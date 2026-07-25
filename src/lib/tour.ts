/**
 * Guided feature tour.
 *
 * Shown once on a browser's very first visit (the login page arms it, demo
 * mode powers the pages it points at, and it hands the visitor back to
 * /login when finished or skipped) — and again on EVERY "Continue as guest"
 * click, so demo visitors always get walked through.
 *
 * State lives in sessionStorage (survives the hard navigations guest-mode
 * entry requires); the "seen it" flag lives in localStorage.
 */

export type TourMode = "first" | "demo";

export type TourStep = {
  /** Page the step lives on — the tour navigates there itself. */
  route: string;
  /** `[data-tour="…"]` anchor to spotlight; centered card when absent. */
  target?: string;
  title: string;
  body: string;
  /** Alternative body for demo-mode runs (used by the closing step). */
  bodyDemo?: string;
  /** Swaps the title/body for a fully custom, self-contained interactive card. */
  custom?: "review-demo";
};

/** A made-up question used purely to demonstrate the review flow inside the tour — never touches real quiz state. */
export const DEMO_REVIEW_QUESTION = {
  topic: "Spaced Repetition",
  kind: "Quick-fire",
  prompt: "What's the core idea behind spaced repetition?",
  options: [
    "Reviewing material right before you're about to forget it",
    "Studying the same material for as many hours as possible",
    "Only reviewing material you already know well",
    "Switching topics every few minutes to stay alert",
  ],
  correctIndex: 0,
  correctFeedback: "Exactly — timing the review just before the forgetting curve dips is what makes each pass stick.",
  incorrectFeedback: "Not quite — the trick is timing: reviewing right before you'd naturally forget is what makes each pass stick.",
};

export const TOUR_STEPS: TourStep[] = [
  {
    route: "/",
    title: "Learn it once. Never forget it.",
    body: "Most of what you study is gone within a week — that's just how memory works. Knovis fixes the timing: a quick recall right before each idea would fade, so it sticks for good. Ten seconds to feel it.",
  },
  {
    route: "/recall",
    custom: "review-demo",
    title: "This is the whole trick",
    body: "One question, graded the instant you answer.",
  },
  {
    route: "/",
    target: "plan",
    title: "Your forgetting, on a schedule",
    body: "Knovis lines up each topic on the exact day you're about to lose it, then quizzes you. No deciding what to review — just show up and recall. Spaced repetition, done for you.",
  },
  {
    route: "/",
    target: "momentum",
    title: "A few minutes a day is all it takes",
    body: "Recall on consecutive days and each memory fades slower — then barely at all. The streak is just proof you're winning against the curve.",
  },
  {
    route: "/brain",
    target: "brain-canvas",
    title: "Watch everything you know take shape",
    body: "Every topic becomes a glowing node, wired to the ideas it connects to. The more you learn, the more it grows — your knowledge, finally visible in one place.",
  },
  {
    route: "/",
    title: "Start remembering for real",
    body: "Create a free account and log the first thing you want to keep. A minute now — remembered for good.",
    bodyDemo: "You're in the demo, running on seeded topics — poke at anything. When it clicks, sign up and start building a memory that's yours.",
  },
];

export type TourState = { mode: TourMode; step: number };

const SEEN_KEY = "knovis.tour.seen.v1";
const STATE_KEY = "knovis.tour.state.v1";

export function hasSeenTour(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Storage unavailable — treat as seen so we never hijack the page.
    return true;
  }
}

export function markTourSeen() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {}
}

export function readTourState(): TourState | null {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as TourState;
    if ((s.mode !== "first" && s.mode !== "demo") || typeof s.step !== "number") return null;
    return { mode: s.mode, step: Math.min(Math.max(0, s.step), TOUR_STEPS.length - 1) };
  } catch {
    return null;
  }
}

export function saveTourState(state: TourState) {
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {}
}

export function clearTourState() {
  try {
    sessionStorage.removeItem(STATE_KEY);
  } catch {}
}

/** Arm the tour; the caller then does a FULL navigation to "/". */
export function startTour(mode: TourMode) {
  saveTourState({ mode, step: 0 });
}
