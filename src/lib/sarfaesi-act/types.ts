/**
 * The SARFAESI Playbook — static content types for the SARFAESI Act, 2002 blog series.
 *
 * The series mirrors the Act's chapter structure.
 */

import type { QuestionKind } from "@/lib/types";

export type SarfaesiImportance = "Foundation" | "Core" | "Advanced";

export type SarfaesiQuestion = {
  kind: QuestionKind;
  prompt: string;
  options?: string[];
  correct_index?: number;
  correct_indices?: number[];
  model_answer: string;
  difficulty: "basic" | "intermediate" | "advanced";
};

export type SarfaesiSection = {
  slug: string;
  title: string;
  sectionNumber: string;
  importance: SarfaesiImportance;
  summary: string;
  body: string;
  questions?: SarfaesiQuestion[];
  facts?: string[];
};

export type SarfaesiChapter = {
  slug: string;
  title: string;
  chapter: number;
  tagline: string;
  color: string;
  prereqs: string[];
  unlocks: string[];
  intro: string;
  sections: SarfaesiSection[];
};

export const IMPORTANCE_COLORS: Record<SarfaesiImportance, string> = {
  Foundation: "#5ba4cf",
  Core: "#f5b95f",
  Advanced: "#a78bfa",
};
