/**
 * Input/output guardrails for the ingest pipeline. Dependency-free, matching
 * chunk.ts's style — no NLP libraries, just cheap heuristics.
 */

import { parseVizPayload } from "@/components/viz/types";

/**
 * Catches obvious junk (keyboard mashing, copy-paste spam, repeated-character
 * floods) BEFORE it burns a Gemini call, a daily-ingest-cap slot, and
 * pollutes the knowledge base with garbage topics. Deliberately lenient —
 * dense technical text, code snippets, and non-English prose should all pass;
 * this only needs to catch the unambiguous cases.
 */
export function looksLikeGibberish(raw: string): boolean {
  const text = raw.trim();
  if (text.length < 40) return false; // caller already enforces a minimum length

  // A short pattern (1-4 chars) repeated 10+ times in a row - "aaaaaaaa...",
  // "hahahaha...", "asdasdasdasd...". Require the repeated unit to contain a
  // letter or digit: real technical writing routinely has long runs of pure
  // punctuation (ASCII fraction bars, table borders, markdown "------"
  // rules, box-drawing dividers like "──────"), and those shouldn't reject
  // an otherwise-real article. Punctuation-only floods that ARE spam (e.g.
  // ">>> >>> >>>" quote-chain garbage) still get caught below - the
  // word-shape check flags them since none of their "words" contain a letter.
  const flood = text.match(/(.{1,4})\1{9,}/);
  if (flood && /[a-z0-9]/i.test(flood[1])) return true;

  const sample = text.slice(0, 4000); // bound the cost on huge pastes

  // Meaningful-character ratio: real prose/code is mostly letters, digits and
  // whitespace even with heavy punctuation. Symbol-only spam ("!@#$%^&*()..."
  // repeated) has almost none - and being one unbroken run with no
  // whitespace, it also dodges the word-level checks below.
  const meaningful = sample.replace(/[^a-z0-9\s]/gi, "").length;
  if (sample.length >= 30 && meaningful / sample.length < 0.35) return true;

  // Word-level sanity: real writing has varied, letter-containing words.
  const words = sample.split(/\s+/).filter(Boolean);
  if (words.length >= 8) {
    const distinctWords = new Set(words.map((w) => w.toLowerCase())).size;
    if (distinctWords / words.length < 0.2) return true; // heavy word-repetition spam

    const wordish = words.filter((w) => /[a-z]/i.test(w)).length;
    if (wordish / words.length < 0.25) return true; // mostly symbols/numbers, not prose
  }

  return false;
}

// Control characters to strip from Gemini's output before storage: every
// code point from 0 to 31 except tab (9), newline (10) and carriage return
// (13), plus DEL (127). Built from numeric char codes (not literal escapes)
// so the character class can't get mangled in transit.
const KEEP_CODES = new Set([9, 10, 13]);
const CONTROL_CODES: number[] = [];
for (let c = 0; c <= 31; c++) if (!KEEP_CODES.has(c)) CONTROL_CODES.push(c);
CONTROL_CODES.push(127);
const CONTROL_CHARS = new RegExp(`[${CONTROL_CODES.map((c) => String.fromCharCode(c)).join("")}]`, "g");

/**
 * Strip control/non-printable characters and clamp to a max length. Applied
 * to every free-text field Gemini returns before it's stored - defense in
 * depth against a manipulated or hallucinating model returning oversized or
 * malformed output (a successful prompt injection can still only produce
 * valid-JSON-shaped text, but nothing bounds what's INSIDE those strings
 * without this).
 */
export function sanitizeField(value: unknown, maxLen: number): string {
  const s = typeof value === "string" ? value : "";
  return s.replace(CONTROL_CHARS, "").trim().slice(0, maxLen);
}

/**
 * Size budgets for AI-generated diagrams. A diagram that blows past these is a
 * generation failure — even though the primitives now scroll gracefully rather
 * than squashing, a 20-cell array or a 6-column flow scrolls off-screen and
 * reads as broken. Kept generous (the render tolerates mild overflow); this
 * only drops the egregious cases so an auto-generated blog stays scannable.
 * The hand-authored story content is NOT run through here — it's tuned by hand.
 */
export const VIZ_BUDGETS = {
  maxLabelChars: 60, // any single label/note/cell longer than this ⇒ over budget
  array: { maxFrames: 8, maxCells: 14 },
  tree: { maxNodes: 14, maxDepthLabelSum: 6 }, // maxDepthLabelSum unused placeholder
  flow: { maxNodes: 12, maxCols: 5, maxRows: 5 },
  "table-diff": { maxColumns: 6, maxRows: 8 },
} as const;

/** Recursively strip control chars + unrenderable `$…$` math from every string in a payload. */
function sanitizeVizStrings(v: unknown): unknown {
  if (typeof v === "string") {
    return v
      .replace(CONTROL_CHARS, " ")
      .replace(/\$([^$]{0,60})\$/g, "$1") // `$x$` never renders as math inside a diagram — unwrap it
      .replace(/[ \t]{2,}/g, " ")
      .trim();
  }
  if (Array.isArray(v)) return v.map(sanitizeVizStrings);
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) o[k] = sanitizeVizStrings(val);
    return o;
  }
  return v;
}

/** Returns true if a validated payload is within its size budget (small enough to render cleanly). */
function withinVizBudget(kind: string, p: any): boolean {
  const tooLong = (s: unknown) => typeof s === "string" && s.length > VIZ_BUDGETS.maxLabelChars;
  if (kind === "array") {
    const b = VIZ_BUDGETS.array;
    if (p.frames.length > b.maxFrames) return false;
    for (const f of p.frames) {
      if (f.cells.length > b.maxCells) return false;
      if (f.cells.some((c: unknown) => tooLong(String(c)))) return false;
      if (tooLong(f.note)) return false;
    }
    return true;
  }
  if (kind === "tree") {
    const b = VIZ_BUDGETS.tree;
    if (p.nodes.length > b.maxNodes) return false;
    return !p.nodes.some((n: any) => tooLong(n.label));
  }
  if (kind === "flow") {
    const b = VIZ_BUDGETS.flow;
    if (p.nodes.length > b.maxNodes) return false;
    if (Math.max(...p.nodes.map((n: any) => n.col)) + 1 > b.maxCols) return false;
    if (Math.max(...p.nodes.map((n: any) => n.row)) + 1 > b.maxRows) return false;
    return !p.nodes.some((n: any) => tooLong(n.label));
  }
  if (kind === "table-diff") {
    const b = VIZ_BUDGETS["table-diff"];
    if (p.columns.length > b.maxColumns) return false;
    if (p.before.length > b.maxRows || p.after.length > b.maxRows) return false;
    const cells = [p.columns, ...p.before, ...p.after].flat();
    return !cells.some((c: unknown) => tooLong(c === null ? "" : String(c)));
  }
  return true;
}

/**
 * Normalize the ```viz:*``` diagram fences in an AI-generated blog body so a
 * generated blog can never ship a broken, unrenderable, or oversized diagram.
 * For each fence: parse + validate the JSON; DROP it if invalid or beyond its
 * size budget (see VIZ_BUDGETS); otherwise sanitize its text (strip control
 * chars / stray `$…$` math that can't render in a diagram) and re-emit it as
 * compact JSON. The render primitives handle wide diagrams by scrolling, so
 * this is the ingest-side complement — it keeps auto-generated diagrams small,
 * clean, and legible. Valid, in-budget, clean fences pass through effectively
 * verbatim (re-serialized compactly). Non-viz markdown is returned untouched.
 *
 * (Kept the name `stripInvalidVizBlocks` — the ingest route imports it — but it
 * now normalizes rather than only strips.)
 */
export function stripInvalidVizBlocks(md: string): string {
  if (!md.includes("```viz:")) return md;
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].trim().match(/^```viz:(\S+)/);
    if (m) {
      const kind = m[1];
      const buf: string[] = [];
      let j = i + 1;
      while (j < lines.length && !/^```/.test(lines[j].trim())) buf.push(lines[j++]);
      let emit: string[] | null = null;
      try {
        const clean = sanitizeVizStrings(parseVizPayload(kind, buf.join("\n")));
        // Re-validate the sanitized object, then budget-check it.
        const revalidated = parseVizPayload(kind, JSON.stringify(clean));
        if (withinVizBudget(kind, revalidated)) emit = [`\`\`\`viz:${kind}`, JSON.stringify(clean), "```"];
      } catch {
        emit = null;
      }
      if (emit) out.push(...emit);
      // else: drop the whole fenced block
      i = j + 1;
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  // Collapse the blank-line gap a dropped block may leave behind.
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}
