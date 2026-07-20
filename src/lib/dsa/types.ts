import type { QuestionKind } from "@/lib/types";

/**
 * The Pattern Atlas — static content types for the DSA blog series.
 *
 * The series mirrors the NeetCode 150 roadmap: 18 umbrella "chapters"
 * (one per pattern/topic) each containing its questions as full blog reads,
 * ordered so the whole thing can be read linearly, start to finish.
 * Pure static data — zero AI calls, zero DB, renders like any other page.
 */

export type DsaDifficulty = "Easy" | "Medium" | "Hard";

export type DsaQuestion = {
  kind: QuestionKind;
  prompt: string;
  options?: string[];
  correct_index?: number;
  correct_indices?: number[];
  model_answer: string;
  difficulty: "basic" | "intermediate" | "advanced";
};

export type DsaProblem = {
  /** URL segment under the chapter, e.g. "two-sum" */
  slug: string;
  title: string;
  difficulty: DsaDifficulty;
  /** Canonical practice link on neetcode.io */
  neetcodeUrl: string;
  /** One-liner shown on cards and used as the page description */
  summary: string;
  /** The blog itself — markdown rendered by src/components/Markdown.tsx */
  body: string;
  /** Domain-specific questions for this algorithm */
  questions?: DsaQuestion[];
};

export type DsaTopic = {
  /** URL segment, e.g. "arrays-hashing" */
  slug: string;
  title: string;
  /** 1-based position in the linear reading order */
  chapter: number;
  /** Short hook shown under the title on cards */
  tagline: string;
  /** Accent colour for this chapter (warm palette, matches the app) */
  color: string;
  /** Roadmap prerequisites (topic slugs) — what to read before this */
  prereqs: string[];
  /** Roadmap edges onward (topic slugs) — what this unlocks */
  unlocks: string[];
  /** The umbrella essay — markdown; the chapter's mental model + how its questions build */
  intro: string;
  /** Questions in reading order (site order) */
  problems: DsaProblem[];
};

export const DSA_DIFFICULTY_COLORS: Record<DsaDifficulty, string> = {
  Easy: "#43d6b5",
  Medium: "#f5b95f",
  Hard: "#ff7a5c",
};
