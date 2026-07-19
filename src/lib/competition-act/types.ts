/**
 * The Competition Code — static content types for the Competition Act, 2002 blog series.
 *
 * The series mirrors the Act's chapter structure: 10 umbrella "chapters"
 * each containing its key sections as full blog reads,
 * ordered so the whole thing can be read linearly, start to finish.
 * Pure static data — zero AI calls, zero DB, renders like any other page.
 */

import type { QuestionKind } from "@/lib/types";

export type CompActImportance = "Foundation" | "Core" | "Advanced";

/**
 * A pre-authored bank question for a section. Mirrors the shape Gemini would
 * emit at ingest (see ExtractionResult in src/lib/types.ts) so that when a
 * learner marks a section "learned" we can seed the `questions` table directly
 * — zero AI calls. Authored by hand from the section body.
 */
export type CompActQuestion = {
  kind: QuestionKind;
  prompt: string;
  /** choice kinds (mcq / truefalse / multi) */
  options?: string[];
  /** mcq / truefalse: index into options */
  correct_index?: number;
  /** multi: indices of every correct option */
  correct_indices?: number[];
  model_answer: string;
  difficulty: "basic" | "intermediate" | "advanced";
};

export type CompActSection = {
  /** URL segment under the chapter, e.g. "what-is-competition-law" */
  slug: string;
  title: string;
  /** The section number(s) of the Act this covers, e.g. "§3(1)–(3)" */
  sectionNumber: string;
  importance: CompActImportance;
  /** One-liner shown on cards and used as the page description */
  summary: string;
  /** The blog itself — markdown rendered by src/components/Markdown.tsx */
  body: string;
  /**
   * Pre-authored quiz bank, seeded into the user's `questions` table when they
   * mark this section learned. Optional while banks are still being authored
   * chapter-by-chapter; a section with no bank simply seeds no questions.
   */
  questions?: CompActQuestion[];
  /** 1-2 "fact of the day" candidates seeded alongside the questions. */
  facts?: string[];
};

export type CompActChapter = {
  /** URL segment, e.g. "preliminary" */
  slug: string;
  title: string;
  /** 1-based position in the linear reading order */
  chapter: number;
  /** Short hook shown under the title on cards */
  tagline: string;
  /** Accent colour for this chapter */
  color: string;
  /** Roadmap prerequisites (chapter slugs) — what to read before this */
  prereqs: string[];
  /** Roadmap edges onward (chapter slugs) — what this unlocks */
  unlocks: string[];
  /** The umbrella essay — markdown; the chapter's mental model */
  intro: string;
  /** Sections in reading order */
  sections: CompActSection[];
};

export const IMPORTANCE_COLORS: Record<CompActImportance, string> = {
  Foundation: "#5ba4cf",
  Core: "#f5b95f",
  Advanced: "#a78bfa",
};
