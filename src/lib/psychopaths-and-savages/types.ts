import type { QuestionKind } from "@/lib/types";

export type PsDifficulty = "basic" | "intermediate" | "advanced";

export type PsQuestion = {
  kind: QuestionKind;
  prompt: string;
  options?: string[];
  correct_index?: number;
  correct_indices?: number[];
  model_answer: string;
  difficulty: PsDifficulty;
};

export type PsSection = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  questions?: PsQuestion[];
  facts?: string[];
};

export type PsChapter = {
  slug: string;
  title: string;
  summary: string;
  sections: PsSection[];
};
