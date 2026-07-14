/**
 * RAG layer — server-side. Everything the user ingests (article/notes) and
 * every answer they save is chunked, embedded and stored in `knowledge_chunks`
 * (see supabase/schema-rag.sql). Generation then RETRIEVES the user's own
 * content and grounds the prompt in it, so questions / blogs / graph come from
 * what the user actually added — not the model's world knowledge.
 *
 * Everything here degrades gracefully: if the RAG table/extension isn't
 * installed yet, or embedding fails, the caller continues without grounding
 * rather than erroring. RAG is strictly additive.
 */
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
    error.code === "42883" || // undefined_function (match_knowledge_chunks)
    /does not exist|could not find/i.test(error.message ?? "")
  );
}

export interface IndexArgs {
  userId: string;
  entryId?: string | null;
  topicId?: string | null;
  source: "entry" | "answer";
  text: string;
}

/**
 * Chunk → embed → store. Best-effort: returns the number of chunks written
 * (0 on any failure). Never throws.
 */
export async function indexContent(
  supabase: SupabaseClient,
  { userId, entryId = null, topicId = null, source, text }: IndexArgs
): Promise<number> {
  try {
    const chunks = chunkText(text);
    if (!chunks.length) return 0;
    const vectors = await embedTexts(
      chunks.map((c) => c.content),
      "RETRIEVAL_DOCUMENT"
    );
    if (vectors.length !== chunks.length) return 0;

    const rows = chunks.map((c, i) => ({
      user_id: userId,
      entry_id: entryId,
      topic_id: topicId,
      source,
      content: c.content,
      embedding: toVector(vectors[i]),
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
 * Index several short answers in ONE embedding batch + one insert (cheaper than
 * per-answer indexContent). Each answer is one chunk. Best-effort; never throws.
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

    const rows = clean.map((c, i) => ({
      user_id: userId,
      entry_id: null,
      topic_id: c.topicId,
      source: "answer" as const,
      content: c.text,
      embedding: toVector(vectors[i]),
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

export interface RetrievedChunk {
  content: string;
  similarity: number;
  topic_id: string | null;
  entry_id: string | null;
  source: string;
}

/**
 * Retrieve the user's most relevant stored chunks for a query. Empty array if
 * RAG isn't installed, nothing is indexed yet, or embedding fails.
 */
export async function retrieveContext(
  supabase: SupabaseClient,
  query: string,
  matchCount = 6
): Promise<RetrievedChunk[]> {
  try {
    const vector = await embedText(query, "RETRIEVAL_QUERY");
    if (!vector) return [];
    const { data, error } = await supabase.rpc("match_knowledge_chunks", {
      query_embedding: toVector(vector),
      match_count: matchCount,
      min_similarity: 0.25,
    });
    if (error) {
      if (!isMissingRag(error)) console.error("RAG retrieval failed", error);
      return [];
    }
    return (data ?? []) as RetrievedChunk[];
  } catch (e) {
    console.error("RAG retrieval skipped (embedding failed)", e);
    return [];
  }
}

/** Format retrieved chunks as a grounding block for a generation prompt. */
export function formatContext(chunks: RetrievedChunk[]): string {
  if (!chunks.length) return "";
  return chunks
    .map((c, i) => `[${i + 1}] ${c.content.replace(/\s+/g, " ").trim()}`)
    .join("\n\n");
}
