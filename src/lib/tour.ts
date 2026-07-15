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
    title: "Welcome to Knovis",
    body: "Your second brain. Log what you learn, watch it grow into a living graph, and revise each memory right before it fades. Here's the one-minute walk-through.",
  },
  {
    route: "/",
    target: "nav",
    title: "Getting around",
    body: "Five rooms: Today is your dashboard, Brain the 3D graph, Blogs your library, Add feeds knowledge in, and Review runs your quiz sessions.",
  },
  {
    route: "/",
    target: "plan",
    title: "Today's revision plan",
    body: "Knovis schedules each topic on the day you're about to forget it — spaced repetition, done for you. Every row is a topic due today; tap one to revise it on its own.",
  },
  {
    route: "/",
    target: "review-cta",
    title: "One-tap review",
    body: "Start runs the whole plan — open questions, quick-fire, MCQs, true/false and multi-select — all graded together at the end into a full report card.",
  },
  {
    route: "/review",
    custom: "review-demo",
    title: "Try a review",
    body: "This is what grading feels like.",
  },
  {
    route: "/",
    target: "momentum",
    title: "Momentum",
    body: "Review on consecutive days to grow a streak. The bar tracks your next milestone; the heatmap shows sixteen weeks of practice at a glance.",
  },
  {
    route: "/",
    target: "calendar",
    title: "Study calendar",
    body: "Every lit day is a day you showed up. Tap one to reopen that day's full report card — every question, answer and grade.",
  },
  {
    route: "/",
    target: "fact",
    title: "Fact of the day",
    body: "A daily spark resurfaced from your own knowledge — a small nudge that keeps old memories warm. Zero effort; it's already yours.",
  },
  {
    route: "/",
    target: "notes",
    title: "Personal notes",
    body: "A private margin for everything else: markdown notes with subnotes, kept on this device and deliberately outside the knowledge graph.",
  },
  {
    route: "/brain",
    target: "brain-canvas",
    title: "Your brain, in 3D",
    body: "Every topic is a glowing patch of cortex, wired to the ideas it relates to. Click a glow to dive inside, then follow connections to walk a path through what you know.",
  },
  {
    route: "/brain",
    target: "brain-search",
    title: "Search the cortex",
    body: "Find any topic instantly, or focus on one region — the categories grow from whatever you actually learn.",
  },
  {
    route: "/blogs",
    target: "blogs-intro",
    title: "Topic blogs",
    body: "Every topic becomes a long-form read — key ideas, connections, sources, and its full question bank. Your knowledge, written back to you.",
  },
  {
    route: "/add",
    target: "add-form",
    title: "Feed your brain",
    body: "Paste notes or an AI conversation, or drop a link. One pass extracts the topics, wires them into your graph, and builds the questions you'll be quizzed with.",
  },
  {
    route: "/",
    title: "That's Knovis",
    body: "Ready to grow a brain of your own? Create a free account and log your first learning — it takes a minute.",
    bodyDemo: "You're in the demo — everything works, with seeded topics. Explore freely, and sign up whenever it clicks.",
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
