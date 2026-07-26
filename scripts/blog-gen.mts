#!/usr/bin/env node

/**
 * Manual blog-body harness — the AGENT (Claude, here) writes the structured
 * bodies; this script only moves data to/from Supabase. No LLM API is called.
 *
 *   npx tsx scripts/blog-gen.mts count
 *       → how many topics still have a null body
 *   npx tsx scripts/blog-gen.mts fetch <limit> <outfile>
 *       → writes the next <limit> null-body topics (id/name/category/summary/
 *         key_points) as JSON to <outfile>, for the agent to read
 *   npx tsx scripts/blog-gen.mts push <infile>
 *       → reads [{id, body}, ...] from <infile> and writes each body to Supabase
 *
 * Scope: `topics` table only. Idempotent (fetch only returns null-body rows).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    for (const f of [".env.local", ".env"]) {
      try {
        for (const line of readFileSync(resolve(dir, f), "utf8").split("\n")) {
          const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
          if (!m) continue;
          let v = m[2].trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
          if (process.env[m[1]] === undefined) process.env[m[1]] = v;
        }
      } catch {}
    }
    const p = dirname(dir);
    if (p === dir) break;
    dir = p;
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
if (!url || !key) {
  console.error("❌ Missing Supabase URL or service-role key in .env.local");
  process.exit(1);
}
const sb = createClient(url, key);

/**
 * Topic ids that were SEEDED from a story (DSA/SQL/Macro/…). These are the
 * "custom created story blogs" and must NEVER get an auto-generated body — only
 * genuinely user-ingested topics do. Identified via story_sections membership.
 */
async function storySeededIds(): Promise<Set<string>> {
  const ids = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from("story_sections")
      .select("topic_id")
      .range(from, from + 999);
    if (error) { console.error(error.message); process.exit(1); }
    for (const r of data ?? []) ids.add((r as { topic_id: string }).topic_id);
    if (!data || data.length < 1000) break;
  }
  return ids;
}

/** Topic ids that came from real user ingestion (have an entry_topics link). */
async function entryLinkedIds(): Promise<Set<string>> {
  const ids = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from("entry_topics").select("topic_id").range(from, from + 999);
    if (error) { console.error(error.message); process.exit(1); }
    for (const r of data ?? []) ids.add((r as { topic_id: string }).topic_id);
    if (!data || data.length < 1000) break;
  }
  return ids;
}

const [cmd, a, b] = process.argv.slice(2);

if (cmd === "count") {
  const story = await storySeededIds();
  const { data, error } = await sb.from("topics").select("id").is("body", null);
  if (error) { console.error(error.message); process.exit(1); }
  const real = (data ?? []).filter((t) => !story.has((t as { id: string }).id));
  console.log(`null-body USER topics remaining (story-seeded excluded): ${real.length}`);
} else if (cmd === "fetch") {
  const limit = Number(a) || 25;
  const outfile = b;
  if (!outfile) { console.error("usage: fetch <limit> <outfile>"); process.exit(1); }
  const story = await storySeededIds();
  const { data, error } = await sb
    .from("topics")
    .select("id,name,category,summary,key_points,body")
    .is("body", null)
    .order("created_at", { ascending: true });
  if (error) { console.error(error.message); process.exit(1); }
  const real = (data ?? [])
    .filter((t) => !story.has((t as { id: string }).id))
    .slice(0, limit)
    .map(({ body, ...rest }) => rest); // drop the always-null body from the export
  writeFileSync(outfile, JSON.stringify(real, null, 2));
  console.log(`wrote ${real.length} user topic(s) to ${outfile} (story-seeded excluded)`);
} else if (cmd === "revert-story") {
  // Undo bodies wrongly written to story-seeded topics — set them back to null.
  const story = await storySeededIds();
  const { data, error } = await sb.from("topics").select("id").not("body", "is", null);
  if (error) { console.error(error.message); process.exit(1); }
  const toRevert = (data ?? []).map((t) => (t as { id: string }).id).filter((id) => story.has(id));
  console.log(`story-seeded topics with a body to revert: ${toRevert.length}`);
  let ok = 0;
  for (const id of toRevert) {
    const { error: e } = await sb.from("topics").update({ body: null }).eq("id", id);
    if (e) console.error(`fail ${id} — ${e.message}`); else ok++;
  }
  console.log(`reverted to null: ${ok}`);
} else if (cmd === "push") {
  const infile = a;
  if (!infile) { console.error("usage: push <infile>"); process.exit(1); }
  const rows = JSON.parse(readFileSync(infile, "utf8")) as { id: string; body: string }[];
  let ok = 0, fail = 0;
  for (const r of rows) {
    if (!r.id || !r.body || r.body.trim().length < 20) { console.error(`skip ${r.id} — empty body`); fail++; continue; }
    const { error } = await sb.from("topics").update({ body: r.body }).eq("id", r.id);
    if (error) { console.error(`fail ${r.id} — ${error.message}`); fail++; } else ok++;
  }
  console.log(`pushed: ${ok}, failed/skipped: ${fail}`);
} else if (cmd === "real") {
  // Dump real user blogs (entry-linked) with enough context to design a diagram.
  const outfile = a;
  if (!outfile) { console.error("usage: real <outfile>"); process.exit(1); }
  const entry = await entryLinkedIds();
  const { data, error } = await sb.from("topics").select("id,name,category,summary,key_points,body");
  if (error) { console.error(error.message); process.exit(1); }
  const real = (data ?? [])
    .filter((t) => entry.has((t as { id: string }).id))
    .map((t) => {
      const r = t as { id: string; name: string; category: string; summary: string | null; key_points: unknown; body: string | null };
      return { id: r.id, name: r.name, category: r.category, summary: r.summary, key_points: r.key_points, hasViz: !!r.body && r.body.includes("```viz:") };
    });
  writeFileSync(outfile, JSON.stringify(real, null, 2));
  console.log(`wrote ${real.length} real blog(s) to ${outfile} — ${real.filter((r) => r.hasViz).length} already have a diagram`);
} else if (cmd === "insert-viz") {
  // Insert a viz block into each topic's body, before "## Key points to
  // remember" (fallbacks: The takeaway / Watch out for / append). Skips a
  // topic whose body already has a viz block. infile: [{id, viz}].
  const infile = a;
  if (!infile) { console.error("usage: insert-viz <infile>"); process.exit(1); }
  const rows = JSON.parse(readFileSync(infile, "utf8")) as { id: string; viz: string }[];
  let ok = 0, skip = 0, fail = 0;
  for (const r of rows) {
    const { data, error } = await sb.from("topics").select("body").eq("id", r.id).single();
    if (error || !data?.body) { console.error(`fail ${r.id} — ${error?.message ?? "no body"}`); fail++; continue; }
    let body = data.body as string;
    if (body.includes("```viz:")) { console.log(`skip ${r.id} — already has a diagram`); skip++; continue; }
    const block = r.viz.trim() + "\n\n";
    const marker = ["## Key points to remember", "## The takeaway", "## Watch out for"].find((m) => body.includes(m));
    body = marker ? body.replace(marker, block + marker) : body.trimEnd() + "\n\n" + r.viz.trim() + "\n";
    const { error: e2 } = await sb.from("topics").update({ body }).eq("id", r.id);
    if (e2) { console.error(`fail ${r.id} — ${e2.message}`); fail++; } else { console.log(`ok ${r.id}`); ok++; }
  }
  console.log(`inserted: ${ok}, skipped: ${skip}, failed: ${fail}`);
} else {
  console.error("usage: blog-gen.mts <count | fetch <limit> <outfile> | push <infile> | real <outfile> | insert-viz <infile> | revert-story>");
  process.exit(1);
}
