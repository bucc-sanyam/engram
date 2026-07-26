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
 * Remove any ```viz:*``` diagram fence whose JSON payload fails validation, so
 * an AI-generated blog body can never ship a broken diagram (which would render
 * as an inline error card). Valid diagrams are kept verbatim. Applied to the
 * blog `body` at ingest — the model is asked to emit a diagram, this is the
 * safety net for when it emits a malformed one.
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
      let valid = false;
      try {
        parseVizPayload(kind, buf.join("\n"));
        valid = true;
      } catch {
        valid = false;
      }
      if (valid) out.push(lines[i], ...buf, lines[j] ?? "```");
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
