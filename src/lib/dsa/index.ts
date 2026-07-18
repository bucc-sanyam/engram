import type { DsaProblem, DsaTopic } from "./types";
import { arraysHashing } from "./topics/arrays-hashing";
import { twoPointers } from "./topics/two-pointers";
import { slidingWindow } from "./topics/sliding-window";
import { stack } from "./topics/stack";
import { binarySearch } from "./topics/binary-search";
import { linkedList } from "./topics/linked-list";
import { trees } from "./topics/trees";
import { heap } from "./topics/heap";

export * from "./types";

/**
 * The atlas, in reading order. Chapters are appended here as they are written;
 * every registered chapter is immediately live at /blogs/dsa.
 */
export const DSA_TOPICS: DsaTopic[] = [
  arraysHashing,
  twoPointers,
  slidingWindow,
  stack,
  binarySearch,
  linkedList,
  trees,
  heap,
];

export const DSA_SERIES_TITLE = "The Pattern Atlas";

export function getDsaTopic(slug: string): DsaTopic | null {
  return DSA_TOPICS.find((t) => t.slug === slug) ?? null;
}

export function getDsaProblem(
  topicSlug: string,
  problemSlug: string
): { topic: DsaTopic; problem: DsaProblem } | null {
  const topic = getDsaTopic(topicSlug);
  const problem = topic?.problems.find((p) => p.slug === problemSlug);
  return topic && problem ? { topic, problem } : null;
}

export function dsaProblemCount(): number {
  return DSA_TOPICS.reduce((sum, t) => sum + t.problems.length, 0);
}

/** One stop on the linear read: a chapter opener or a question inside it. */
export type DsaStop =
  | { kind: "topic"; topic: DsaTopic }
  | { kind: "problem"; topic: DsaTopic; problem: DsaProblem };

/** The whole series flattened into its reading order. */
export function dsaReadingOrder(): DsaStop[] {
  const stops: DsaStop[] = [];
  for (const topic of DSA_TOPICS) {
    stops.push({ kind: "topic", topic });
    for (const problem of topic.problems) stops.push({ kind: "problem", topic, problem });
  }
  return stops;
}

export function dsaStopHref(stop: DsaStop): string {
  return stop.kind === "topic"
    ? `/blogs/dsa/${stop.topic.slug}`
    : `/blogs/dsa/${stop.topic.slug}/${stop.problem.slug}`;
}

export function dsaStopTitle(stop: DsaStop): string {
  return stop.kind === "topic"
    ? `Chapter ${stop.topic.chapter}: ${stop.topic.title}`
    : stop.problem.title;
}

/**
 * Prev/next around a given stop, crossing chapter boundaries so the whole
 * series reads as one continuous path.
 */
export function dsaNeighbors(
  topicSlug: string,
  problemSlug?: string
): { prev: DsaStop | null; next: DsaStop | null } {
  const order = dsaReadingOrder();
  const idx = order.findIndex((s) =>
    problemSlug
      ? s.kind === "problem" && s.topic.slug === topicSlug && s.problem.slug === problemSlug
      : s.kind === "topic" && s.topic.slug === topicSlug
  );
  if (idx === -1) return { prev: null, next: null };
  return { prev: order[idx - 1] ?? null, next: order[idx + 1] ?? null };
}

/** 1-based position of a problem in the full 150 reading order (problems only). */
export function dsaProblemNumber(topicSlug: string, problemSlug: string): number {
  let n = 0;
  for (const topic of DSA_TOPICS) {
    for (const problem of topic.problems) {
      n++;
      if (topic.slug === topicSlug && problem.slug === problemSlug) return n;
    }
  }
  return 0;
}
