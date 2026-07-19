import type { QuestionKind } from "@/lib/types";

export type MacroImportance = "Foundation" | "Core" | "Advanced";

export type MacroQuestion = {
  kind: QuestionKind;
  prompt: string;
  options?: string[];
  correct_index?: number;
  correct_indices?: number[];
  model_answer: string;
  difficulty: "basic" | "intermediate" | "advanced";
};

export type MacroSection = {
  slug: string;
  title: string;
  sectionNumber: string;
  importance: MacroImportance;
  summary: string;
  body: string;
  questions?: MacroQuestion[];
  facts?: string[];
};

export type MacroChapter = {
  slug: string;
  title: string;
  chapter: number;
  tagline: string;
  color: string;
  prereqs: string[];
  unlocks: string[];
  intro: string;
  sections: MacroSection[];
};

export const MACRO_IMPORTANCE_COLORS: Record<MacroImportance, string> = {
  Foundation: "#5ba4cf",
  Core: "#f5b95f",
  Advanced: "#a78bfa",
};
