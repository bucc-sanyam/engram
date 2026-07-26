import type { QuestionKind } from "@/lib/types";

export type EcDifficulty = "basic" | "intermediate" | "advanced";

export type EcQuestion = {
  kind: QuestionKind;
  prompt: string;
  options?: string[];
  correct_index?: number;
  correct_indices?: number[];
  /**
   * For `open` scenario prompts this is the EXEMPLAR strong response — the north
   * star the communication judge grades against (content + structure + delivery).
   * For choice kinds it's the usual short explanation.
   */
  model_answer: string;
  difficulty: EcDifficulty;
};

export type EcSection = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  questions?: EcQuestion[];
  facts?: string[];
};

export type EcChapter = {
  slug: string;
  title: string;
  summary: string;
  sections: EcSection[];
};
