#!/usr/bin/env node

/**
 * One-off backfill: give every existing USER topic blog a structured markdown
 * `body`.
 *
 * TWO modes:
 *   • DEFAULT (deterministic, NO Gemini): reshapes the topic's existing
 *     `summary` + `key_points` into a structured body — The gist / What it is /
 *     Key points to remember. Free, instant, no API keys beyond Supabase.
 *     Thinner than the AI version (no "How it works" / "Watch out for" /
 *     "The takeaway" — that content isn't in the existing fields), but it gives
 *     every old blog real section structure now.
 *   • --ai (Gemini): regenerates the FULL 6-beat spine grounded in the topic's
 *     original source text. Richer, one Gemini call per topic. Use this later.
 *
 * New ingests already get the full AI-generated structure automatically. This
 * script only backfills PRE-EXISTING topics.
 *
 * Scope: the `topics` table ONLY (the AI-generated blogs at /blogs/[id]). The
 * hand-authored static story series (DSA / SQL / Macro / SARFAESI /
 * Competition-Act) live in TS data with NO rows here and are never touched.
 *
 * Safe to re-run: only topics whose `body` is still null are processed, so an
 * interrupted run resumes cleanly and re-runs are no-ops.
 *
 * Prerequisites:
 *   1. Run supabase/schema-blog-body.sql in Supabase (adds the `body` column).
 *   2. NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 *      (auto-loaded below). GEMINI_API_KEY is only needed for --ai mode.
 *
 * Run:
 *   npx tsx scripts/restructure-blogs.mts               (DRY-RUN, deterministic)
 *   npx tsx scripts/restructure-blogs.mts --commit      (writes, deterministic)
 *   npx tsx scripts/restructure-blogs.mts --commit --ai (writes, Gemini-rich)
 *   npx tsx scripts/restructure-blogs.mts --commit --limit 5   (small test run)
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createClient } from "@supabase/supabase-js";

// --- dependency-free env loader (scripts aren't run through Next). Walks up
// from cwd so a worktree picks up the main checkout's .env.local (gitignored,
// so it isn't shared between worktrees). Nearest file wins. ---
function loadEnvLocal() {
  let dir = process.cwd();
  const roots: string[] = [];
  for (let i = 0; i < 8; i++) {
    roots.push(dir);
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  for (const root of roots) {
    for (const file of [".env.local", ".env"]) {
      try {
        const raw = readFileSync(resolve(root, file), "utf8");
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
          if (process.env[key] === undefined) process.env[key] = val; // nearest wins
        }
      } catch {
        /* file may not exist — ignore */
      }
    }
  }
}
loadEnvLocal();

// Accept the common env-var name variants this project has used.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
const commit = process.argv.includes("--commit");
const useAi = process.argv.includes("--ai");
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg !== -1 ? Number(process.argv[limitArg + 1]) : Infinity;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing Supabase connection details in .env.local:");
  console.error(`   • URL          ${supabaseUrl ? "OK" : "MISSING — set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) to https://<project>.supabase.co"}`);
  console.error(`   • service role ${serviceRoleKey ? "OK" : "MISSING — set SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE)"}`);
  console.error("   The anon key will NOT work — RLS blocks cross-user writes; the service role is required.");
  process.exit(1);
}
if (useAi && !process.env.GEMINI_API_KEY) {
  console.error("❌ --ai mode needs GEMINI_API_KEY in .env.local.");
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

/** Split a summary into its first sentence (the gist) and the rest. */
function firstSentenceAndRest(summary: string): { gist: string; rest: string } {
  const s = summary.replace(/\s+/g, " ").trim();
  if (!s) return { gist: "", rest: "" };
  const m = s.match(/^(.*?[.!?])\s+(.*)$/);
  if (m && m[2].trim()) return { gist: m[1].trim(), rest: m[2].trim() };
  return { gist: s, rest: "" };
}

/**
 * Deterministic (no-AI) structured body from the fields we already have.
 * Honest about its limits — it only emits the sections the existing data can
 * actually support, never fabricating "How it works" / pitfalls / takeaways.
 */
function deterministicBody(summary: string | null, key_points: string[]): string {
  const parts: string[] = [];
  const { gist, rest } = firstSentenceAndRest(summary ?? "");
  if (gist) parts.push(`## The gist\n${gist}`);
  if (rest) parts.push(`## What it is\n${rest}`);
  if (key_points.length) {
    parts.push(
      `## Key points to remember\n${key_points.map((k, i) => `${i + 1}. ${k}`).join("\n")}`
    );
  }
  return parts.join("\n\n");
}

/** Best-effort original source text for AI grounding — newest entries first. */
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
  const mode = useAi ? "AI (Gemini)" : "deterministic (no AI)";
  console.log(`🔄 Blog restructure — ${commit ? "COMMIT" : "DRY-RUN"} · ${mode}\n`);

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
    console.log(
      `\n🚀 Re-run with --commit to write.${useAi ? ` This makes ~${todo.length} Gemini call(s).` : " (deterministic — no API calls.)"}`
    );
    if (!useAi) console.log("   Add --ai for the richer full-spine Gemini version.");
    return;
  }

  // Lazy-load the Gemini generator only when actually needed (keeps the
  // deterministic path free of the GEMINI_API_KEY / @google/genai dependency).
  const generate = useAi
    ? (await import("@/lib/gemini")).generateBlogStructure
    : null;

  let success = 0;
  let failed = 0;

  for (const topic of todo) {
    try {
      const key_points = Array.isArray(topic.key_points)
        ? (topic.key_points as string[])
        : [];

      let body: string;
      if (useAi && generate) {
        const sourceText = await sourceTextForTopic(topic.id);
        body = await generate({
          name: topic.name,
          category: topic.category,
          summary: topic.summary,
          key_points,
          sourceText,
        });
      } else {
        body = deterministicBody(topic.summary, key_points);
      }

      if (!body || body.trim().length < 20) {
        console.log(`⏭️  ${topic.name} — no usable content (empty summary + key_points), skipped`);
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

    // Pace only the AI path (Gemini rate limit). Deterministic needs no delay.
    if (useAi) await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\n📈 Done — restructured: ${success}, failed/skipped: ${failed}`);
  if (failed > 0) {
    console.log("   Skipped topics kept a null body (fallback render still works). Re-run to retry.");
  }
}

run().catch((e) => {
  console.error("❌ Fatal:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
