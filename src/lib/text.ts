/**
 * Gemini occasionally returns markdown despite plain-text instructions, and
 * daily plans are cached in `daily_plans`, so stale markdown can persist for
 * a whole day. Strip the common inline syntax before rendering or saving.
 */
export function stripMarkdown(s: string): string {
  return s
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*•]\s+/gm, "")
    .trim();
}
