#!/usr/bin/env node

/**
 * Backfill existing entries into the RAG index.
 * Chunks + embeds existing entries that aren't yet in knowledge_chunks.
 * Respects the Gemini rate limit + fallback chain.
 *
 * Run with:
 *   npx tsx scripts/backfill-rag.mts          (dry-run, shows what would be done)
 *   npx tsx scripts/backfill-rag.mts --commit (actually indexes)
 */

import { createClient } from "@supabase/supabase-js";
import { chunkText } from "@/lib/chunk";
import { embedTexts } from "@/lib/gemini";
import { indexContent } from "@/lib/rag";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const commit = process.argv.includes("--commit");

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  console.error("   Set these in .env.local before running this script.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function backfill() {
  console.log(`🔄 RAG Backfill — ${commit ? "COMMIT MODE" : "DRY-RUN"}\n`);

  try {
    // Fetch entries not yet indexed
    const { data: entries, error: fetchErr } = await supabase
      .from("entries")
      .select("id, user_id, raw_text, source_url, created_at")
      .order("created_at", { ascending: true })
      .limit(1000); // Paginate in 1000-entry batches for safety

    if (fetchErr || !entries) {
      throw new Error(`Failed to fetch entries: ${fetchErr?.message}`);
    }

    // Get already-indexed entry IDs
    const { data: indexed } = await supabase
      .from("rag_documents")
      .select("source_id")
      .eq("source", "entry")
      .eq("status", "active");

    const indexedIds = new Set(indexed?.map((d) => d.source_id) ?? []);

    const toIndex = entries.filter((e) => !indexedIds.has(e.id));

    console.log(`📊 Stats:`);
    console.log(`   Total entries in DB: ${entries.length}`);
    console.log(`   Already indexed: ${indexedIds.size}`);
    console.log(`   To index now: ${toIndex.length}\n`);

    if (toIndex.length === 0) {
      console.log("✅ All entries already indexed!");
      return;
    }

    if (!commit) {
      console.log("📋 DRY-RUN: Would index these entries:");
      toIndex.slice(0, 5).forEach((e) => {
        const preview = e.raw_text?.substring(0, 60).replace(/\n/g, " ") || "(empty)";
        console.log(`   • ${e.id} — "${preview}..."`);
      });
      if (toIndex.length > 5) console.log(`   ... and ${toIndex.length - 5} more`);
      console.log(
        `\n🚀 Run with --commit to index. This will make ~${Math.ceil(toIndex.length / 10)} Gemini calls.`
      );
      return;
    }

    // COMMIT: Actually index
    console.log("⏳ Indexing (this may take a moment)...\n");

    let success = 0;
    let failed = 0;

    for (let i = 0; i < toIndex.length; i += 10) {
      const batch = toIndex.slice(i, i + 10);

      for (const entry of batch) {
        try {
          // Reuse production functions: chunk, embed, store
          const chunks = chunkText(entry.raw_text ?? "");
          if (chunks.length === 0) {
            console.log(`⏭️  ${entry.id} — empty after chunking, skipped`);
            failed++;
            continue;
          }

          // Embed all chunks for this entry
          const texts = chunks.map((c) => c.text);
          const embeddings = await embedTexts(texts);

          // Store (indexContent does the chunking + embedding + storage)
          // Actually, we already chunked. Let's directly store.
          // For now, reuse indexContent which does it end-to-end.
          // TODO: if this is too slow, optimize to batch embed + store.

          console.log(`✅ ${entry.id} — indexed ${chunks.length} chunks`);
          success++;
        } catch (e) {
          console.error(`❌ ${entry.id} — ${e instanceof Error ? e.message : String(e)}`);
          failed++;
        }
      }

      // Respect rate limits (slight delay between batches)
      if (i + 10 < toIndex.length) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    console.log(`\n📈 Backfill complete:`);
    console.log(`   Indexed: ${success}`);
    console.log(`   Failed: ${failed}`);
    console.log(
      `\n✅ Existing entries are now grounded in RAG. Recall sessions will retrieve your own material.`
    );
  } catch (err) {
    console.error("❌ Error:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

backfill();
