import type { SqlProblem, SqlTopic } from "./types";
import { selectAndFilter } from "./topics/select-and-filter";
import { basicJoins } from "./topics/basic-joins";
import { aggregation } from "./topics/aggregation";
import { sortingAndLimiting } from "./topics/sorting-and-limiting";
import { subqueries } from "./topics/subqueries";
import { caseWhen } from "./topics/case-when";
import { stringAndDateFunctions } from "./topics/string-and-date-functions";
import { windowFunctionsRanking } from "./topics/window-functions-ranking";
import { windowFunctionsAnalytics } from "./topics/window-functions-analytics";
import { commonTableExpressions } from "./topics/common-table-expressions";
import { advancedJoinsAndSetOps } from "./topics/advanced-joins-and-set-ops";
import { dataTransformation } from "./topics/data-transformation";

export * from "./types";

/**
 * The Query Playbook, in reading order. Chapters are appended here as they
 * are written; every registered chapter is immediately live at /blogs/sql.
 */
export const SQL_TOPICS: SqlTopic[] = [
  selectAndFilter,
  basicJoins,
  aggregation,
  sortingAndLimiting,
  subqueries,
  caseWhen,
  stringAndDateFunctions,
  windowFunctionsRanking,
  windowFunctionsAnalytics,
  commonTableExpressions,
  advancedJoinsAndSetOps,
  dataTransformation,
];

export const SQL_SERIES_TITLE = "The Query Playbook";

export function getSqlTopic(slug: string): SqlTopic | null {
  return SQL_TOPICS.find((t) => t.slug === slug) ?? null;
}

export function getSqlProblem(
  topicSlug: string,
  problemSlug: string
): { topic: SqlTopic; problem: SqlProblem } | null {
  const topic = getSqlTopic(topicSlug);
  const problem = topic?.problems.find((p) => p.slug === problemSlug);
  return topic && problem ? { topic, problem } : null;
}

export function sqlProblemCount(): number {
  return SQL_TOPICS.reduce((sum, t) => sum + t.problems.length, 0);
}

/** One stop on the linear read: a chapter opener or a problem inside it. */
export type SqlStop =
  | { kind: "topic"; topic: SqlTopic }
  | { kind: "problem"; topic: SqlTopic; problem: SqlProblem };

/** The whole series flattened into its reading order. */
export function sqlReadingOrder(): SqlStop[] {
  const stops: SqlStop[] = [];
  for (const topic of SQL_TOPICS) {
    stops.push({ kind: "topic", topic });
    for (const problem of topic.problems) stops.push({ kind: "problem", topic, problem });
  }
  return stops;
}

export function sqlStopHref(stop: SqlStop): string {
  return stop.kind === "topic"
    ? `/blogs/sql/${stop.topic.slug}`
    : `/blogs/sql/${stop.topic.slug}/${stop.problem.slug}`;
}

export function sqlStopTitle(stop: SqlStop): string {
  return stop.kind === "topic"
    ? `Chapter ${stop.topic.chapter}: ${stop.topic.title}`
    : stop.problem.title;
}

/**
 * Prev/next around a given stop, crossing chapter boundaries so the whole
 * series reads as one continuous path.
 */
export function sqlNeighbors(
  topicSlug: string,
  problemSlug?: string
): { prev: SqlStop | null; next: SqlStop | null } {
  const order = sqlReadingOrder();
  const idx = order.findIndex((s) =>
    problemSlug
      ? s.kind === "problem" && s.topic.slug === topicSlug && s.problem.slug === problemSlug
      : s.kind === "topic" && s.topic.slug === topicSlug
  );
  if (idx === -1) return { prev: null, next: null };
  return { prev: order[idx - 1] ?? null, next: order[idx + 1] ?? null };
}

/** 1-based position of a problem in the full reading order (problems only). */
export function sqlProblemNumber(topicSlug: string, problemSlug: string): number {
  let n = 0;
  for (const topic of SQL_TOPICS) {
    for (const problem of topic.problems) {
      n++;
      if (topic.slug === topicSlug && problem.slug === problemSlug) return n;
    }
  }
  return 0;
}
