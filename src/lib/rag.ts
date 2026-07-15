/**
 * RAG layer — server-side. Everything the user ingests (article/notes) and
 * every answer they save is chunked, embedded and stored in `knowledge_chunks`
 * (see supabase/schema-rag.sql + schema-rag-v2.sql). Generation then
 * RETRIEVES the user's own content and grounds the prompt in it, so
 * questions / blogs / graph come from what the user actually added — not the
 * model's world knowledge.
 *
 * v2 additions (schema-rag-v2.sql): a `rag_documents` registry with
 * content-hash dedup and replace-safe re-indexing, a per-user `index_version`
 * "alias" pointer so a future reindex can build a new generation in the
 * background before atomically swapping live traffic to it, hybrid
 * (vector + keyword) retrieval, and `rag_retrieval_logs` for chunk-level
 * attribution / quality metrics.
 *
 * Everything here degrades gracefully: if a RAG table/function isn't
 * installed yet, or embedding fails, the caller continues without grounding
 * rather than erroring. RAG is strictly additive.
 */
import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { chunkText } from "./chunk";
import { embedText, embedTexts } from "./gemini";

/** Postgres `vector` columns want the `[1,2,3]` text form, not a PG array. */
const toVector = (v: number[]) => JSON.stringify(v);

/** True when the failure is just "RAG isn't installed" — expected, not logged loudly. */
function isMissingRag(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    error.code === "42P01" || // undefined_table
    error.code === "42883" || // undefined_function (match_knowledge_chunks*, rag_index_version_correlation)
    /does not exist|could not find/i.test(error.message ?? "")
  );
}

/** Content-hash for exact-duplicate detection — sha256 of the trimmed text. */
export function hashContent(text: string): string {
  return createHash("sha256").update((text ?? "").trim()).digest("hex");
}

// ---- Index version ("alias") — per-user pointer to the live generation ----

/** The version currently serving retrieval for this user. Defaults to 1 (and on any failure) so retrieval never breaks. */
export async function getActiveIndexVersion(supabase: SupabaseClient, userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("rag_index_pointers")
      .select("active_version")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      if (!isMissingRag(error)) console.error("RAG version lookup failed", error);
      return 1;
    }
    return (data?.active_version as number) ?? 1;
  } catch (e) {
    console.error("RAG version lookup skipped", e);
    return 1;
  }
}

/** Atomically flip the alias to a new generation once it's fully built. */
export async function setActiveIndexVersion(
  supabase: SupabaseClient,
  userId: string,
  version: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("rag_index_pointers")
      .upsert(
        { user_id: userId, active_version: version, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    if (error) {
      if (!isMissingRag(error)) console.error("RAG version swap failed", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("RAG version swap skipped", e);
    return false;
  }
}

/** Delete a retired generation's chunks (call only after the alias has moved off it). */
export async function pruneIndexVersion(
  supabase: SupabaseClient,
  userId: string,
  version: number
): Promise<number> {
  try {
    const { error, count } = await supabase
      .from("knowledge_chunks")
      .delete({ count: "exact" })
      .eq("user_id", userId)
      .eq("index_version", version);
    if (error) {
      if (!isMissingRag(error)) console.error("RAG prune failed", error);
      return 0;
    }
    return count ?? 0;
  } catch (e) {
    console.error("RAG prune skipped", e);
    return 0;
  }
}

// ---- Document registry ----

export interface DuplicateEntry {
  entryId: string;
}

/**
 * Content-hash lookup for exact-duplicate entry resubmissions. Checked
 * BEFORE the Gemini extraction call so a repeat paste/URL never burns quota,
 * a daily-cap slot, or creates duplicate chunks/questions.
 */
export async function findDuplicateEntry(
  supabase: SupabaseClient,
  userId: string,
  text: string
): Promise<DuplicateEntry | null> {
  try {
    const hash = hashContent(text);
    const { data, error } = await supabase
      .from("rag_documents")
      .select("entry_id")
      .eq("user_id", userId)
      .eq("content_hash", hash)
      .eq("source", "entry")
      .eq("status", "active")
      .not("entry_id", "is", null)
      .limit(1)
      .maybeSingle();
    if (error) {
      if (!isMissingRag(error)) console.error("RAG duplicate check failed", error);
      return null;
    }
    return data?.entry_id ? { entryId: data.entry_id as string } : null;
  } catch (e) {
    console.error("RAG duplicate check skipped", e);
    return null;
  }
}

/**
 * Register (or replace) an entry's document row, clearing any chunks it
 * already owns so re-indexing the same entry never duplicates. Returns the
 * document id, or null if the registry isn't installed / the write failed
 * (caller still indexes chunks with document_id=null in that case).
 */
async function upsertDocument(
  supabase: SupabaseClient,
  args: {
    userId: string;
    entryId: string;
    topicId: string | null;
    source: "entry" | "answer";
    text: string;
    chunkCount: number;
  }
): Promise<string | null> {
  try {
    const hash = hashContent(args.text);
    const nowIso = new Date().toISOString();

    const { data: existing, error: findErr } = await supabase
      .from("rag_documents")
      .select("id")
      .eq("user_id", args.userId)
      .eq("entry_id", args.entryId)
      .maybeSingle();
    if (findErr) {
      if (!isMissingRag(findErr)) console.error("RAG document lookup failed", findErr);
      return null;
    }

    if (existing) {
      const documentId = existing.id as string;
      await supabase.from("knowledge_chunks").delete().eq("document_id", documentId);
      const { error: updErr } = await supabase
        .from("rag_documents")
        .update({
          content_hash: hash,
          char_count: args.text.length,
          chunk_count: args.chunkCount,
          status: "active",
          updated_at: nowIso,
        })
        .eq("id", documentId);
      if (updErr && !isMissingRag(updErr)) console.error("RAG document update failed", updErr);
      return documentId;
    }

    const { data: created, error: insErr } = await supabase
      .from("rag_documents")
      .insert({
        user_id: args.userId,
        entry_id: args.entryId,
        topic_id: args.topicId,
        source: args.source,
        content_hash: hash,
        char_count: args.text.length,
        chunk_count: args.chunkCount,
      })
      .select("id")
      .single();
    if (insErr) {
      if (!isMissingRag(insErr)) console.error("RAG document insert failed", insErr);
      return null;
    }
    return (created?.id as string) ?? null;
  } catch (e) {
    console.error("RAG document upsert skipped", e);
    return null;
  }
}

// ---- Indexing ----

export interface IndexArgs {
  userId: string;
  entryId?: string | null;
  topicId?: string | null;
  source: "entry" | "answer";
  text: string;
}

/**
 * Chunk → embed → store, registry-tracked and replace-safe (calling this
 * twice for the same entryId deletes-then-reinserts that entry's chunks
 * rather than duplicating them). Best-effort: returns the number of chunks
 * written (0 on any failure). Never throws.
 */
export async function indexContent(
  supabase: SupabaseClient,
  { userId, entryId = null, topicId = null, source, text }: IndexArgs
): Promise<number> {
  try {
    const chunks = chunkText(text);
    if (!chunks.length) return 0;

    const documentId = entryId
      ? await upsertDocument(supabase, { userId, entryId, topicId, source, text, chunkCount: chunks.length })
      : null;

    const version = await getActiveIndexVersion(supabase, userId);
    const vectors = await embedTexts(
      chunks.map((c) => c.content),
      "RETRIEVAL_DOCUMENT"
    );
    if (vectors.length !== chunks.length) return 0;

    const rows = chunks.map((c, i) => ({
      user_id: userId,
      entry_id: entryId,
      topic_id: topicId,
      document_id: documentId,
      source,
      content: c.content,
      embedding: toVector(vectors[i]),
      index_version: version,
    }));

    const { error } = await supabase.from("knowledge_chunks").insert(rows);
    if (error) {
      if (!isMissingRag(error)) console.error("RAG index insert failed", error);
      return 0;
    }
    return rows.length;
  } catch (e) {
    console.error("RAG indexing skipped (embedding failed)", e);
    return 0;
  }
}

/**
 * Index several short answers in ONE embedding batch + one insert (cheaper
 * than per-answer indexContent). Each answer is one chunk and gets its own
 * registry row (uniform versioning/observability with entry documents).
 * Best-effort; never throws.
 */
export async function indexAnswers(
  supabase: SupabaseClient,
  userId: string,
  items: { text: string; topicId?: string | null }[]
): Promise<number> {
  try {
    const clean = items
      .map((i) => ({ text: (i.text ?? "").trim(), topicId: i.topicId ?? null }))
      .filter((i) => i.text.length >= 40); // skip one-liners with no retrievable substance
    if (!clean.length) return 0;
    const vectors = await embedTexts(clean.map((c) => c.text), "RETRIEVAL_DOCUMENT");
    if (vectors.length !== clean.length) return 0;

    const version = await getActiveIndexVersion(supabase, userId);

    // One registry row per answer. Postgres preserves VALUES order on a
    // multi-row INSERT ... RETURNING, so docIds[i] lines up with clean[i].
    const docRows = clean.map((c) => ({
      user_id: userId,
      entry_id: null,
      topic_id: c.topicId,
      source: "answer" as const,
      content_hash: hashContent(c.text),
      char_count: c.text.length,
      chunk_count: 1,
    }));
    const { data: docs, error: docErr } = await supabase.from("rag_documents").insert(docRows).select("id");
    if (docErr && !isMissingRag(docErr)) console.error("RAG answer document registry insert failed", docErr);
    const docIds = docs ?? [];

    const rows = clean.map((c, i) => ({
      user_id: userId,
      entry_id: null,
      topic_id: c.topicId,
      document_id: (docIds[i]?.id as string) ?? null,
      source: "answer" as const,
      content: c.text,
      embedding: toVector(vectors[i]),
      index_version: version,
    }));
    const { error } = await supabase.from("knowledge_chunks").insert(rows);
    if (error) {
      if (!isMissingRag(error)) console.error("RAG answer index failed", error);
      return 0;
    }
    return rows.length;
  } catch (e) {
    console.error("RAG answer indexing skipped", e);
    return 0;
  }
}

export interface ReindexDocumentArgs {
  userId: string;
  documentId: string;
  entryId: string | null;
  topicId: string | null;
  source: "entry" | "answer";
  text: string;
  targetVersion: number;
}

/**
 * Chunk+embed+store a document's content at a TARGET (not-yet-live) index
 * version, without touching whatever version is currently serving
 * retrieval — the "build in the background" half of a zero-downtime
 * reindex. See src/app/api/rag/reindex/route.ts for the swap+prune flow.
 */
export async function reindexDocument(
  supabase: SupabaseClient,
  { userId, documentId, entryId, topicId, source, text, targetVersion }: ReindexDocumentArgs
): Promise<number> {
  try {
    const chunks = chunkText(text);
    if (!chunks.length) return 0;
    const vectors = await embedTexts(
      chunks.map((c) => c.content),
      "RETRIEVAL_DOCUMENT"
    );
    if (vectors.length !== chunks.length) return 0;

    // Clear any leftovers from a prior partial attempt at THIS target version only.
    await supabase.from("knowledge_chunks").delete().eq("document_id", documentId).eq("index_version", targetVersion);

    const rows = chunks.map((c, i) => ({
      user_id: userId,
      entry_id: entryId,
      topic_id: topicId,
      document_id: documentId,
      source,
      content: c.content,
      embedding: toVector(vectors[i]),
      index_version: targetVersion,
    }));
    const { error } = await supabase.from("knowledge_chunks").insert(rows);
    if (error) {
      if (!isMissingRag(error)) console.error("RAG reindex insert failed", error);
      return 0;
    }
    return rows.length;
  } catch (e) {
    console.error("RAG reindex skipped", e);
    return 0;
  }
}

// ---- Retrieval ----

export interface RetrievedChunk {
  id: string;
  content: string;
  similarity: number;
  keyword_rank?: number;
  score?: number;
  topic_id: string | null;
  entry_id: string | null;
  source: string;
}

export interface RetrievalResult {
  chunks: RetrievedChunk[];
  /** rag_retrieval_logs row id for this request, if logging succeeded — pass to linkRetrievalLogToEntry once the caller knows the entry id. */
  logId: string | null;
}

async function logRetrieval(
  supabase: SupabaseClient,
  args: { userId: string; query: string; chunks: RetrievedChunk[]; mode: "hybrid" | "vector_only"; version: number }
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("rag_retrieval_logs")
      .insert({
        user_id: args.userId,
        request_context: "ingest_grounding",
        query_text: args.query.slice(0, 2000),
        index_version: args.version,
        mode: args.mode,
        match_count: args.chunks.length,
        chunks: args.chunks.map((c, i) => ({
          chunk_id: c.id,
          entry_id: c.entry_id,
          topic_id: c.topic_id,
          source: c.source,
          similarity: c.similarity,
          rank: i + 1,
        })),
      })
      .select("id")
      .single();
    if (error) {
      if (!isMissingRag(error)) console.error("RAG retrieval log failed", error);
      return null;
    }
    return (data?.id as string) ?? null;
  } catch (e) {
    console.error("RAG retrieval log skipped", e);
    return null;
  }
}

/**
 * Backfill a retrieval log's entry_id once the just-ingested entry exists.
 * retrieveContext() runs BEFORE the entry is created (it retrieves the
 * user's PRIOR entries for grounding), so the log is written with
 * entry_id=null and linked here right after the entries insert succeeds.
 */
export async function linkRetrievalLogToEntry(
  supabase: SupabaseClient,
  logId: string,
  entryId: string
): Promise<void> {
  try {
    const { error } = await supabase.from("rag_retrieval_logs").update({ entry_id: entryId }).eq("id", logId);
    if (error && !isMissingRag(error)) console.error("RAG retrieval log link failed", error);
  } catch (e) {
    console.error("RAG retrieval log link skipped", e);
  }
}

/**
 * Retrieve the user's most relevant stored chunks for a query. Tries hybrid
 * (vector + keyword, RRF-fused) first; if the hybrid function isn't
 * installed yet, falls back to the plain vector RPC — same
 * additive/graceful-degradation pattern as the rest of this file. Empty
 * result if RAG isn't installed, nothing is indexed yet, or embedding fails.
 */
export async function retrieveContext(
  supabase: SupabaseClient,
  userId: string,
  query: string,
  matchCount = 6
): Promise<RetrievalResult> {
  try {
    const vector = await embedText(query, "RETRIEVAL_QUERY");
    if (!vector) return { chunks: [], logId: null };

    let chunks: RetrievedChunk[] = [];
    let mode: "hybrid" | "vector_only" = "hybrid";

    const { data, error } = await supabase.rpc("match_knowledge_chunks_hybrid", {
      query_embedding: toVector(vector),
      query_text: query,
      match_count: matchCount,
      min_similarity: 0.25,
    });
    if (!error) {
      chunks = (data ?? []) as RetrievedChunk[];
    } else {
      if (!isMissingRag(error)) console.error("RAG hybrid retrieval failed, falling back to vector-only", error);
      mode = "vector_only";
      const { data: vData, error: vErr } = await supabase.rpc("match_knowledge_chunks", {
        query_embedding: toVector(vector),
        match_count: matchCount,
        min_similarity: 0.25,
      });
      if (vErr) {
        if (!isMissingRag(vErr)) console.error("RAG retrieval failed", vErr);
        return { chunks: [], logId: null };
      }
      chunks = (vData ?? []) as RetrievedChunk[];
    }

    const version = await getActiveIndexVersion(supabase, userId);
    const logId = await logRetrieval(supabase, { userId, query, chunks, mode, version });
    return { chunks, logId };
  } catch (e) {
    console.error("RAG retrieval skipped (embedding failed)", e);
    return { chunks: [], logId: null };
  }
}

/** Format retrieved chunks as a grounding block for a generation prompt. */
export function formatContext(chunks: RetrievedChunk[]): string {
  if (!chunks.length) return "";
  return chunks
    .map((c, i) => `[${i + 1}] ${c.content.replace(/\s+/g, " ").trim()}`)
    .join("\n\n");
}

// ---- Observability ----

export interface RetrievalMetrics {
  days: number;
  totalRetrievals: number;
  avgChunksReturned: number;
  avgTopSimilarity: number;
  zeroHitRate: number;
  byMode: { mode: string; count: number }[];
  byDay: { day: string; retrievals: number; avgTopSimilarity: number }[];
}

/**
 * Aggregate recent rag_retrieval_logs into simple retrieval-quality metrics.
 * Aggregated in JS rather than a bespoke SQL function — per-user row volume
 * here is tiny (a handful of retrievals/day), the same reasoning
 * getDayReport/session grading already use elsewhere in this codebase.
 * No product UI surfaces this today; it's a queryable diagnostic.
 */
export async function getRetrievalMetrics(
  supabase: SupabaseClient,
  userId: string,
  days = 30
): Promise<RetrievalMetrics> {
  const empty: RetrievalMetrics = {
    days,
    totalRetrievals: 0,
    avgChunksReturned: 0,
    avgTopSimilarity: 0,
    zeroHitRate: 0,
    byMode: [],
    byDay: [],
  };
  try {
    const since = new Date(Date.now() - days * 86_400_000).toISOString();
    const { data, error } = await supabase
      .from("rag_retrieval_logs")
      .select("mode, match_count, chunks, created_at")
      .eq("user_id", userId)
      .gte("created_at", since)
      .order("created_at", { ascending: true });
    if (error) {
      if (!isMissingRag(error)) console.error("RAG metrics query failed", error);
      return empty;
    }
    const rows = data ?? [];
    if (!rows.length) return empty;

    const topSimilarities = rows.map((r) => {
      const chunks = (r.chunks as { similarity?: number }[]) ?? [];
      return chunks.length ? Math.max(...chunks.map((c) => c.similarity ?? 0)) : 0;
    });
    const zeroHits = rows.filter((r) => (r.match_count ?? 0) === 0).length;

    const modeCounts = new Map<string, number>();
    for (const r of rows) modeCounts.set(r.mode, (modeCounts.get(r.mode) ?? 0) + 1);

    const dayBuckets = new Map<string, { retrievals: number; simSum: number }>();
    rows.forEach((r, i) => {
      const day = (r.created_at as string).slice(0, 10);
      const bucket = dayBuckets.get(day) ?? { retrievals: 0, simSum: 0 };
      bucket.retrievals += 1;
      bucket.simSum += topSimilarities[i];
      dayBuckets.set(day, bucket);
    });

    return {
      days,
      totalRetrievals: rows.length,
      avgChunksReturned: rows.reduce((s, r) => s + (r.match_count ?? 0), 0) / rows.length,
      avgTopSimilarity: topSimilarities.reduce((s, v) => s + v, 0) / rows.length,
      zeroHitRate: zeroHits / rows.length,
      byMode: Array.from(modeCounts, ([mode, count]) => ({ mode, count })),
      byDay: Array.from(dayBuckets, ([day, b]) => ({
        day,
        retrievals: b.retrievals,
        avgTopSimilarity: b.simSum / b.retrievals,
      })),
    };
  } catch (e) {
    console.error("RAG metrics skipped", e);
    return empty;
  }
}

export interface IndexVersionCorrelation {
  index_version: number;
  retrievals: number;
  entries_grounded: number;
  avg_top_similarity: number | null;
  linked_reviews: number;
  avg_quiz_score_pct: number | null;
}

/**
 * Correlates each index_version with downstream quiz performance for topics
 * grounded under it. BEST-EFFORT CORRELATION ONLY — retrieval quality at
 * ingest-grounding time is several steps removed from a quiz score
 * (extraction quality -> question quality -> the user's own recall,
 * confounded by how well they actually know the material). Treat a dip as a
 * lead to investigate, not proof a given index version caused a regression.
 */
export async function getIndexVersionCorrelation(
  supabase: SupabaseClient,
  days = 90
): Promise<IndexVersionCorrelation[]> {
  try {
    const { data, error } = await supabase.rpc("rag_index_version_correlation", { days });
    if (error) {
      if (!isMissingRag(error)) console.error("RAG version correlation failed", error);
      return [];
    }
    return (data ?? []) as IndexVersionCorrelation[];
  } catch (e) {
    console.error("RAG version correlation skipped", e);
    return [];
  }
}
