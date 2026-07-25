#!/usr/bin/env node

/**
 * One-off backfill: give every existing USER topic blog a structured markdown
 * `body` (The gist / What it is / How it works · Why it matters / Key points to
 * remember / Watch out for / The takeaway).
 *
 * Scope: the `topics` table ONLY — i.e. the AI-generated topic blogs at
 * /blogs/[id]. The hand-authored static story series (DSA / SQL / Macro /
 * SARFAESI / Competition-Act) live in TS data with NO rows here, so they are
 * structurally out of reach and never touched.
 *
 * Safe to re-run: only topics whose `body` is still null are processed, so an
 * interrupted run resumes cleanly and re-runs are no-ops. One Gemini call per
 * topic (grounded in its own summary/key_points + original source text).
 *
 * Prerequisites:
 *   1. Run supabase/schema-blog-body.sql in Supabase (adds the `body` column).
 *   2. NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + GEMINI_API_KEY
 *      in .env.local (this script auto-loads that file).
 *
 * Run:
 *   npx tsx scripts/restructure-blogs.mts            (DRY-RUN — shows the plan)
 *   npx tsx scripts/restructure-blogs.mts --commit   (writes bodies)
 *   npx tsx scripts/restructure-blogs.mts --commit --limit 5   (small test run first)
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { generateBlogStructure } from "@/lib/gemini";

// --- dependency-free .env.local loader (scripts aren't run through Next) ---
function loadEnvLocal() {
  for (const file of [".env.local", ".env"]) {
    try {
      const raw = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const line of raw.split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (!m) continue;
        const key = m[1];
        let val = m[2].trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) process.env[key] = val;
      }
    } catch {
      /* file may not exist — ignore */
    }
  }
}
loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const commit = process.argv.includes("--commit");
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg !== -1 ? Number(process.argv[limitArg + 1]) : Infinity;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("   Set these in .env.local before running this script.");
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY (needed to generate the structured bodies).");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

type TopicRow = {
  id: string;
  name: string;
  category: string;
  summary: string | null;
  key_points: unknown;
};

/** Best-effort original source text for grounding — most-recent entries first. */
async function sourceTextForTopic(topicId: string): Promise<string> {
  const { data } = await supabase
    .from("entry_topics")
    .select("entries(raw_text, created_at)")
    .eq("topic_id", topicId);
  const rows = (data ?? []) as unknown as Array<{
    entries: { raw_text: string | null; created_at: string } | null;
  }>;
  return rows
    .map((r) => r.entries)
    .filter((e): e is { raw_text: string | null; created_at: string } => !!e)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((e) => e.raw_text ?? "")
    .filter(Boolean)
    .join("\n\n---\n\n")
    .slice(0, 40000);
}

async function run() {
  console.log(`🔄 Blog restructure — ${commit ? "COMMIT MODE" : "DRY-RUN"}\n`);

  // Only topics still missing a structured body → idempotent + resumable.
  const { data: topics, error } = await supabase
    .from("topics")
    .select("id, name, category, summary, key_points")
    .is("body", null)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Failed to fetch topics:", error.message);
    process.exit(1);
  }

  const all = (topics ?? []) as TopicRow[];
  const todo = Number.isFinite(limit) ? all.slice(0, limit) : all;

  console.log(`📊 Topics missing a structured body: ${all.length}`);
  console.log(`   This run will process: ${todo.length}\n`);

  if (todo.length === 0) {
    console.log("✅ Nothing to do — every topic already has a structured body.");
    return;
  }

  if (!commit) {
    console.log("📋 DRY-RUN — would restructure (first 10):");
    todo.slice(0, 10).forEach((t) => console.log(`   • ${t.name} (${t.category})`));
    if (todo.length > 10) console.log(`   … and ${todo.length - 10} more`);
    console.log(`\n🚀 Re-run with --commit to write. This makes ~${todo.length} Gemini call(s).`);
    console.log("   Tip: start with --commit --limit 5 to spot-check the output first.");
    return;
  }

  let success = 0;
  let failed = 0;

  for (const topic of todo) {
    try {
      const key_points = Array.isArray(topic.key_points)
        ? (topic.key_points as string[])
        : [];
      const sourceText = await sourceTextForTopic(topic.id);
      const body = await generateBlogStructure({
        name: topic.name,
        category: topic.category,
        summary: topic.summary,
        key_points,
        sourceText,
      });

      if (!body || body.trim().length < 40) {
        console.log(`⏭️  ${topic.name} — model returned an empty body, skipped`);
        failed++;
        continue;
      }

      const { error: updErr } = await supabase
        .from("topics")
        .update({ body })
        .eq("id", topic.id);
      if (updErr) throw new Error(updErr.message);

      console.log(`✅ ${topic.name} — restructured (${body.length} chars)`);
      success++;
    } catch (e) {
      console.error(`❌ ${topic.name} — ${e instanceof Error ? e.message : String(e)}`);
      failed++;
    }

    // Gentle pacing so a large backfill doesn't trip the Gemini rate limit.
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\n📈 Done — restructured: ${success}, failed/skipped: ${failed}`);
  if (failed > 0) {
    console.log("   Failed topics kept a null body (fallback render still works). Re-run to retry them.");
  }
}

run().catch((e) => {
  console.error("❌ Fatal:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
