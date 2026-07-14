/**
 * Text chunking for RAG. Splits long text into overlapping, semantically
 * coherent windows so each embedding covers a focused span while overlap
 * preserves context across boundaries.
 *
 * Strategy: pack whole paragraphs/sentences up to a target character budget,
 * carry a small overlap from the tail of the previous chunk. Character-based
 * (not token-based) to stay dependency-free; ~4 chars/token, so the defaults
 * land near ~350 tokens/chunk — a good retrieval granularity.
 */

export interface Chunk {
  content: string;
  index: number;
}

const TARGET_CHARS = 1400; // ~350 tokens
const OVERLAP_CHARS = 200;
const MIN_CHARS = 60; // drop slivers

/** Split into sentence-ish units, keeping paragraph breaks as hard boundaries. */
function segments(text: string): string[] {
  const out: string[] = [];
  for (const para of text.split(/\n{2,}/)) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    // Split overly long paragraphs on sentence boundaries.
    if (trimmed.length <= TARGET_CHARS) {
      out.push(trimmed);
      continue;
    }
    const sentences = trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [trimmed];
    for (const s of sentences) {
      const t = s.trim();
      if (t) out.push(t);
    }
  }
  return out;
}

export function chunkText(raw: string): Chunk[] {
  const text = (raw ?? "").replace(/\r\n/g, "\n").trim();
  if (!text) return [];
  if (text.length <= TARGET_CHARS) {
    return [{ content: text, index: 0 }];
  }

  const parts = segments(text);
  const chunks: string[] = [];
  let current = "";

  const flush = () => {
    const c = current.trim();
    if (c.length >= MIN_CHARS) chunks.push(c);
    else if (c && chunks.length) chunks[chunks.length - 1] += "\n" + c;
    current = "";
  };

  for (const part of parts) {
    if (!current) {
      current = part;
    } else if (current.length + part.length + 1 <= TARGET_CHARS) {
      current += "\n" + part;
    } else {
      const carry = current.slice(-OVERLAP_CHARS);
      flush();
      // Start the next window with a little overlap for context continuity.
      const overlap = carry.includes(" ") ? carry.slice(carry.indexOf(" ") + 1) : "";
      current = overlap ? overlap + "\n" + part : part;
    }
  }
  flush();

  return chunks.map((content, index) => ({ content, index }));
}
