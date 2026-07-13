export type Category =
  | "Technology"
  | "Science"
  | "Business"
  | "Design"
  | "Health"
  | "History"
  | "Philosophy"
  | "Language"
  | "Mathematics"
  | "General";

export const CATEGORY_COLORS: Record<string, string> = {
  Technology: "#6fb0ff",
  Science: "#43d6b5",
  Business: "#f5b95f",
  Design: "#ff8fb1",
  Health: "#8fd694",
  History: "#e8927c",
  Philosophy: "#bfa8f5",
  Language: "#7fd0e8",
  Mathematics: "#ffd166",
  General: "#a8a29e",
};

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.General;
}

export interface Profile {
  id: string;
  display_name: string | null;
  xp: number;
  streak: number;
  longest_streak: number;
  last_active: string | null;
}

export interface Topic {
  id: string;
  name: string;
  category: string;
  summary: string | null;
  key_points: string[];
  mastery: number;
  review_count: number;
  ease: number;
  interval_days: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  created_at: string;
}

export interface TopicLink {
  id: string;
  source: string;
  target: string;
  reason: string | null;
  strength: number;
}

/** Where a topic was ingested from — shown on its blog page. */
export type TopicSource =
  | { kind: "url"; url: string }
  | { kind: "text" }
  | null;

/**
 * A personal note. Deliberately NOT part of the knowledge graph — notes are
 * private reminders. `parent_id` gives OneNote-style nesting (subnotes).
 * Stored locally (localStorage), keyed per browser.
 */
export interface Note {
  id: string;
  parent_id: string | null;
  title: string;
  body: string; // markdown
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: string;
  title: string | null;
  raw_text: string;
  summary: string | null;
  source_url?: string | null;
  created_at: string;
}

export interface Flashcard {
  id: string;
  topic_id: string;
  question: string;
  answer: string;
}

export interface Review {
  id: string;
  topic_id: string;
  mode: ReviewMode;
  score: number;
  question?: string | null;
  answer?: string | null;
  feedback?: string | null;
  created_at: string;
}

export type ReviewMode = "recall" | "flashcard" | "quickfire";

/** Kind of a pre-generated bank question. */
export type QuestionKind = "open" | "quickfire" | "mcq";

/** One question as sent to the client during a session — no answers included. */
export interface SessionQuestion {
  index: number; // position in the session (stable key for saving answers)
  topic_id: string;
  topic_name: string;
  category: string;
  kind: QuestionKind;
  prompt: string;
  options: string[] | null; // mcq only
}

export interface QuizSession {
  id: string;
  questions: SessionQuestion[];
}

/** One graded line of the end-of-session report card. */
export interface ReportItem {
  index: number;
  topic_id: string;
  topic_name: string;
  kind: QuestionKind;
  prompt: string;
  answer: string | null; // what the learner typed / picked
  skipped: boolean;
  correct: boolean | null; // mcq only
  score: number; // 0..5
  feedback: string;
  correct_answer: string;
  options: string[] | null;
  selected_index: number | null;
  correct_index: number | null;
}

/** The single-AI-call report shown after all answers are submitted. */
export interface ReportCard {
  session_id: string;
  date: string;
  score_pct: number; // 0..100 over attempted questions
  xp: number;
  summary: string;
  strengths: string[];
  focus: string[];
  items: ReportItem[];
}

/** Daily fact drawn from the pre-generated pool — zero AI calls. */
export interface DailyFact {
  text: string;
  topic_name: string | null;
}

export interface PlanItem {
  topic_id: string;
  topic_name: string;
  category: string;
  mode: ReviewMode;
  reason: string; // why this topic today ("due for review", "learnt yesterday", …)
  done?: boolean; // reviewed today — computed at read time, never stored in the plan
}

export interface DailyPlan {
  date: string;
  headline: string;      // AI-written one-liner for today's session
  insight: string;       // AI-written connection insight between today's topics
  items: PlanItem[];
  completed: boolean;
}

/** Result of Gemini extracting knowledge from a pasted conversation. */
export interface ExtractionResult {
  title: string;
  summary: string;
  topics: {
    name: string;
    category: string;
    summary: string;
    key_points: string[];
  }[];
  connections: { a: string; b: string; reason: string }[];
  flashcards: { topic: string; question: string; answer: string }[];
  questions: {
    topic: string;
    kind: QuestionKind;
    prompt: string;
    options?: string[];
    correct_index?: number;
    model_answer: string;
    difficulty: "basic" | "intermediate" | "advanced";
  }[];
  facts: { topic: string; fact: string }[];
}

export interface GradeResult {
  score: number; // 0..5
  feedback: string;
  model_answer: string;
}


