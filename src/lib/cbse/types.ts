import type { QuestionKind } from "@/lib/types";
import type { SimSpec } from "@/lib/sim/types";

/**
 * Class-9 CBSE content types (NCF-SE 2023 books: "Exploration" for Science,
 * "Ganita Manjari Part I" for Mathematics).
 *
 * Mirrors the proven src/lib/dsa/ pattern: hand-authored static TypeScript,
 * rendered by SSG routes. Zero database, zero AI, zero runtime cost.
 */

export type Subject = "science" | "maths";

export type CbseQuestion = {
  kind: QuestionKind;
  prompt: string;
  /** Required for mcq / truefalse / multi. For truefalse use ["True","False"]. */
  options?: string[];
  /** mcq + truefalse: index into `options`. */
  correct_index?: number;
  /** multi: every correct index. */
  correct_indices?: number[];
  /** The ideal answer. For choice kinds, one sentence saying WHY. */
  model_answer: string;
  difficulty: "basic" | "intermediate" | "advanced";
  /** Section key this question belongs to. Must match a Section.key. */
  section: string;
};

export type SectionNote = {
  kind: "fact" | "remember" | "watch-out" | "exam-tip";
  /** Optional heading. Omit to use the kind's default label. */
  title?: string;
  /** Plain text. 25–55 words. This is the RIGHT-BOTTOM pane. */
  body: string;
};

export type Section = {
  /** kebab-case, unique within the chapter, e.g. "what-a-cell-is" */
  key: string;
  title: string;
  /** Small accent label above the title. 1–3 words, e.g. "The idea". */
  eyebrow?: string;
  /** REQUIRED. The section of the NCERT book this recaps, exactly as printed,
   *  e.g. "Exploration §2.3" or "Ganita Manjari §1.2". Displayed in the UI so
   *  the book and the app are visibly the same journey. See §8.3a. */
  bookRef: string;
  /** LEFT PANE. Markdown, rendered with strictViz. 250–450 words. */
  body: string;
  /** RIGHT PANE, first. Omit only if the section genuinely needs no diagram. */
  sim?: SimSpec;
  /** RIGHT PANE, after `sim`. The section's labelled plates (`kind: "figure"`),
   *  in order; `sim` stays the hero. A section may carry several — all of them
   *  ride the same sticky rail, which scrolls inside itself. Below 1400px the
   *  page is a single column and these render inline under the section's text
   *  instead, the way figures sit inside a printed chapter. */
  figures?: SimSpec[];
  /** RIGHT PANE, last. */
  note?: SectionNote;
};

export type Chapter = {
  /** URL segment, e.g. "ch-02-cell". Must match the filename. */
  key: string;
  /** Chapter number as printed in the NCERT book. */
  number: number;
  title: string;
  subject: Subject;
  /** Book title for attribution in the UI. */
  book: "Exploration" | "Ganita Manjari";
  /** Accent hex for this chapter. Bright pastel — Paper Mode darkens it. */
  accent: string;
  /** One sentence. Used on cards and as the page description. */
  summary: string;
  /** Realistic reading time in minutes for the whole chapter. */
  estMinutes: number;
  sections: Section[];
  /** The SM-2 bank. 45–55 per chapter. See §7.4 for the required mix. */
  questions: CbseQuestion[];
};
