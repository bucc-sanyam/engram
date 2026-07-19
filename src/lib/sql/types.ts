/**
 * The Query Playbook — static content types for the SQL blog series.
 *
 * The series is a custom SQL interview roadmap: 12 umbrella "chapters"
 * (one per SQL concept area) each containing curated LeetCode problems
 * as full blog reads, ordered so the whole thing can be read linearly.
 * Pure static data — zero AI calls, zero DB, renders like any other page.
 */

export type SqlDifficulty = "Easy" | "Medium" | "Hard";

export type SqlProblem = {
  /** URL segment under the chapter, e.g. "combine-two-tables" */
  slug: string;
  title: string;
  /** LeetCode problem number */
  leetcodeNumber: number;
  difficulty: SqlDifficulty;
  /** Practice link on leetcode.com */
  leetcodeUrl: string;
  /** One-liner shown on cards and used as the page description */
  summary: string;
  /** The blog itself — markdown rendered by src/components/Markdown.tsx */
  body: string;
};

export type SqlTopic = {
  /** URL segment, e.g. "select-and-filter" */
  slug: string;
  title: string;
  /** 1-based position in the linear reading order */
  chapter: number;
  /** Short hook shown under the title on cards */
  tagline: string;
  /** Accent colour for this chapter */
  color: string;
  /** Roadmap prerequisites (topic slugs) — what to read before this */
  prereqs: string[];
  /** Roadmap edges onward (topic slugs) — what this unlocks */
  unlocks: string[];
  /** The umbrella essay — markdown; the chapter's mental model */
  intro: string;
  /** Problems in reading order */
  problems: SqlProblem[];
};

export const SQL_DIFFICULTY_COLORS: Record<SqlDifficulty, string> = {
  Easy: "#43d6b5",
  Medium: "#f5b95f",
  Hard: "#ff7a5c",
};
