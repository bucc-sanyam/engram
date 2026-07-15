import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getActiveIndexVersion,
  setActiveIndexVersion,
  pruneIndexVersion,
  reindexDocument,
} from "@/lib/rag";

export const maxDuration = 60;

/**
 * Self-serve, paginated zero-downtime reindex for the CALLING user's own RAG
 * documents (RLS scopes every query, so no service-role key is needed).
 *
 * Infrastructure for a future need (e.g. changing chunk size or embedding
 * dims) — nothing calls this automatically today. Call repeatedly while
 * `hasMore: true`; the index-version "alias" only flips (and the retired
 * version only gets pruned) once a full pass leaves zero pending documents,
 * so the currently-active version keeps serving every live retrieval for
 * the whole (possibly multi-call) build — that's the zero-downtime property.
 * A naive per-call swap+prune would delete not-yet-processed documents'
 * only copy.
 */
const DOCUMENTS_PER_CALL = 200;

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const currentVersion = await getActiveIndexVersion(supabase, user.id);
  const targetVersion = currentVersion + 1;

  // Ordered explicitly (not just PK-default) so pagination across repeated
  // calls is deterministic — an unordered scan gives Postgres no guarantee
  // of a stable row order between separate queries.
  const { data: allDocs, error: docsErr } = await supabase
    .from("rag_documents")
    .select("id, entry_id, topic_id, source")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("id", { ascending: true });
  if (docsErr) return NextResponse.json({ error: docsErr.message }, { status: 500 });
  if (!allDocs?.length) {
    return NextResponse.json({ message: "Nothing to reindex.", activeVersion: currentVersion });
  }

  const { data: doneRows } = await supabase
    .from("knowledge_chunks")
    .select("document_id")
    .eq("user_id", user.id)
    .eq("index_version", targetVersion);
  const done = new Set((doneRows ?? []).map((r) => r.document_id));
  const pending = allDocs.filter((d) => !done.has(d.id)).slice(0, DOCUMENTS_PER_CALL);

  let chunksWritten = 0;
  let documentsProcessed = 0;
  let documentsFailed = 0;

  for (const doc of pending) {
    let text: string | null = null;
    if (doc.source === "entry" && doc.entry_id) {
      const { data: entry } = await supabase
        .from("entries")
        .select("raw_text")
        .eq("id", doc.entry_id)
        .maybeSingle();
      text = entry?.raw_text ?? null;
    } else {
      // Answers have no separate raw-text store (avoids doubling storage);
      // each answer is a single chunk, so its current-version chunk content
      // reconstructs it losslessly.
      const { data: existingChunks } = await supabase
        .from("knowledge_chunks")
        .select("content")
        .eq("document_id", doc.id)
        .eq("index_version", currentVersion)
        .order("created_at");
      text = (existingChunks ?? []).map((c) => c.content).join("\n\n") || null;
    }
    if (!text) {
      documentsFailed++;
      continue;
    }
    const written = await reindexDocument(supabase, {
      userId: user.id,
      documentId: doc.id,
      entryId: doc.entry_id,
      topicId: doc.topic_id,
      source: doc.source as "entry" | "answer",
      text,
      targetVersion,
    });
    if (written > 0) {
      chunksWritten += written;
      documentsProcessed++;
    } else {
      documentsFailed++;
    }
  }

  const remaining = allDocs.length - (done.size + documentsProcessed);
  if (remaining > 0) {
    return NextResponse.json({
      activeVersion: currentVersion,
      targetVersion,
      documentsProcessed,
      documentsFailed,
      chunksWritten,
      hasMore: true,
      message: "Batch complete — call POST /api/rag/reindex again to continue.",
    });
  }

  const swapped = await setActiveIndexVersion(supabase, user.id, targetVersion);
  if (!swapped) {
    return NextResponse.json({ error: "Could not activate the new index version." }, { status: 500 });
  }
  const pruned = await pruneIndexVersion(supabase, user.id, currentVersion);

  return NextResponse.json({
    previousVersion: currentVersion,
    activeVersion: targetVersion,
    documentsProcessed,
    documentsFailed,
    chunksWritten,
    chunksPruned: pruned,
    hasMore: false,
  });
}
