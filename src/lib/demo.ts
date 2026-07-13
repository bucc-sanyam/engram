import type {
  DailyPlan,
  Entry,
  Profile,
  QuestionKind,
  Review,
  Topic,
  TopicLink,
  TopicSource,
} from "./types";

/**
 * Guest mode: lets visitors try the app with demo data even when Supabase IS
 * configured (production). Set by the login page's "Continue as guest" link,
 * honoured by src/proxy.ts, and cleared there as soon as a real user signs in.
 */
export const GUEST_COOKIE = "engramia_guest";

function guestActive(): boolean {
  if (typeof document === "undefined") return false; // SSR — resolved on the client
  return document.cookie.split("; ").includes(`${GUEST_COOKIE}=1`);
}

/** Enter guest mode. Caller must do a FULL page load afterwards (not a SPA
 * navigation) so module-level `isDemo` re-evaluates with the cookie set. */
export function enableGuestMode() {
  document.cookie = `${GUEST_COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
}

export function clearGuestMode() {
  document.cookie = `${GUEST_COOKIE}=; path=/; max-age=0`;
}

/** Demo mode is active when Supabase isn't configured, or for guest visitors. */
export const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || guestActive();

const daysAgo = (n: number, h = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, 0, 0, 0);
  return d.toISOString();
};
const daysAhead = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(5, 0, 0, 0);
  return d.toISOString();
};

const t = (
  id: string,
  name: string,
  category: string,
  summary: string,
  key_points: string[],
  mastery: number,
  createdDaysAgo: number,
  nextReviewInDays: number
): Topic => ({
  id,
  name,
  category,
  summary,
  key_points,
  mastery,
  review_count: Math.max(0, Math.round(mastery / 25)),
  ease: 2.5,
  interval_days: Math.max(1, nextReviewInDays),
  next_review_at: daysAhead(nextReviewInDays),
  last_reviewed_at: mastery > 0 ? daysAgo(1) : null,
  created_at: daysAgo(createdDaysAgo),
});

export const demoTopics: Topic[] = [
  t("d1", "Transformer Architecture", "Technology",
    "The neural network architecture behind modern LLMs. Processes all tokens in parallel using self-attention instead of recurrence, which made large-scale pretraining practical.",
    ["Self-attention lets every token attend to every other token", "Positional encodings inject word-order information", "Encoder-decoder vs decoder-only variants", "Parallelism made web-scale training feasible"],
    72, 9, 0),
  t("d2", "Attention Mechanism", "Technology",
    "The core operation of transformers: each token computes query/key/value vectors and mixes information from other tokens weighted by relevance.",
    ["Q·K similarity decides how much each token attends to others", "Softmax turns scores into weights over values", "Multi-head attention captures different relation types"],
    65, 9, 0),
  t("d3", "Retrieval-Augmented Generation", "Technology",
    "Grounding LLM answers in external documents fetched at query time. Cuts hallucination and keeps knowledge fresh without retraining.",
    ["Retrieve → stuff context → generate", "Embeddings turn text into searchable vectors", "Chunking strategy strongly affects quality"],
    48, 6, 0),
  t("d4", "Vector Databases", "Technology",
    "Databases optimised for nearest-neighbour search over embeddings — the storage layer behind RAG and semantic search.",
    ["Store high-dimensional embedding vectors", "ANN indexes (HNSW, IVF) trade accuracy for speed", "pgvector adds this to Postgres"],
    40, 6, 2),
  t("d5", "Spaced Repetition", "Science",
    "Reviewing material at increasing intervals right before you'd forget it. Exploits the spacing effect — one of the most robust findings in memory research.",
    ["Ebbinghaus forgetting curve: memory decays exponentially", "Each successful recall flattens the curve", "SM-2 algorithm schedules reviews from recall quality"],
    85, 14, 4),
  t("d6", "How Memory Consolidates", "Science",
    "New memories are fragile and hippocampus-dependent; over time they consolidate into cortex. Retrieval practice and sleep both strengthen this process.",
    ["Hippocampus encodes fast, cortex stores slow", "Active recall beats re-reading", "Consolidation continues during sleep"],
    58, 14, 1),
  t("d7", "Sleep & Learning", "Health",
    "Deep sleep replays the day's experiences and consolidates them into long-term memory. Sleep deprivation before or after learning sharply reduces retention.",
    ["Slow-wave sleep replays hippocampal memories", "REM sleep helps integrate and generalise knowledge", "All-nighters cut retention by up to 40%"],
    35, 5, 0),
  t("d8", "Compound Interest", "Business",
    "Growth on growth: returns are reinvested so value grows exponentially. The same maths governs learning — small daily gains compound dramatically.",
    ["FV = PV(1+r)^n", "Rule of 72 estimates doubling time", "Starting early beats contributing more"],
    77, 20, 6),
  t("d9", "Stoicism", "Philosophy",
    "Ancient Greek/Roman philosophy of focusing only on what you control. Practical toolkit: negative visualisation, voluntary discomfort, evening review.",
    ["Dichotomy of control", "Marcus Aurelius' Meditations was a private journal", "Amor fati: love your fate"],
    52, 18, 3),
  t("d10", "The Roman Empire", "History",
    "Rome scaled from city-state to Mediterranean superpower via roads, law and citizenship, then split and declined under overextension and internal decay.",
    ["Pax Romana: ~200 years of stability", "Citizenship as an integration tool", "Split into East and West in 285 AD"],
    30, 18, 0),
  t("d11", "Typography Basics", "Design",
    "Type choices drive readability and mood. Hierarchy, spacing and line length matter more than typeface choice.",
    ["45-75 characters per line is optimal", "Line height ~1.5x for body text", "Pair a display face with a workhorse text face"],
    44, 3, 1),
  t("d12", "Bayes' Theorem", "Mathematics",
    "Updating beliefs with evidence: posterior ∝ likelihood × prior. The engine behind spam filters, medical test interpretation and rational thinking.",
    ["P(A|B) = P(B|A)P(A)/P(B)", "Base-rate neglect is the classic failure mode", "Priors matter most when evidence is weak"],
    61, 11, 5),
  t("d13", "Supabase & Postgres", "Technology",
    "Open-source Firebase alternative: Postgres with auth, row-level security, realtime and storage out of the box.",
    ["RLS policies enforce per-user data access in the DB itself", "Auth issues JWTs consumed by PostgREST", "pgvector enables AI features"],
    25, 2, 0),
  t("d14", "Deliberate Practice", "Science",
    "Improvement comes from focused practice at the edge of ability with immediate feedback — not from repetition of what's already comfortable.",
    ["Practice at the edge of current skill", "Immediate feedback is essential", "Mental representations distinguish experts"],
    38, 4, 0),
];

const l = (id: string, source: string, target: string, reason: string, strength = 1): TopicLink =>
  ({ id, source, target, reason, strength });

export const demoLinks: TopicLink[] = [
  l("e1", "d1", "d2", "Attention is the core computational block of transformers", 2),
  l("e2", "d1", "d3", "RAG pipelines feed retrieved context into a transformer LLM"),
  l("e3", "d3", "d4", "Vector databases are the retrieval layer of RAG", 2),
  l("e4", "d4", "d13", "pgvector brings vector search into Supabase's Postgres"),
  l("e5", "d5", "d6", "Spaced repetition works because of how consolidation strengthens traces", 2),
  l("e6", "d6", "d7", "Sleep is when memory consolidation happens", 2),
  l("e7", "d5", "d8", "Both are exponential processes — retention and returns compound"),
  l("e8", "d5", "d14", "Both prescribe effortful recall at the edge of ability"),
  l("e9", "d6", "d14", "Deliberate practice builds the representations memory consolidates"),
  l("e10", "d9", "d10", "Stoicism flourished in imperial Rome — Marcus Aurelius was emperor", 2),
  l("e11", "d12", "d3", "Retrieval ranking can be framed as Bayesian relevance updating"),
  l("e12", "d12", "d5", "SM-2 implicitly updates a prior about your recall probability"),
  l("e13", "d11", "d1", "Good typography and good architectures both manage attention"),
  l("e14", "d8", "d12", "Both are about reasoning correctly with exponentials and probabilities"),
  l("e15", "d7", "d14", "Recovery is part of effective practice schedules"),
];

/**
 * Where each demo topic was "ingested" from — a few came from article links,
 * the rest from pasted text. Topics not listed default to text input.
 */
export const demoTopicSource: Record<string, TopicSource> = {
  d1: { kind: "url", url: "https://arxiv.org/abs/1706.03762" },
  d3: { kind: "url", url: "https://arxiv.org/abs/2005.11401" },
  d4: { kind: "url", url: "https://github.com/pgvector/pgvector" },
  d11: { kind: "url", url: "https://practicaltypography.com" },
};

export const demoEntries: Entry[] = [
  { id: "en1", title: "Deep dive: how transformers actually work", raw_text: "", summary: "Discussed self-attention, positional encodings and why parallelism enabled the LLM era.", created_at: daysAgo(9) },
  { id: "en2", title: "RAG and vector search", raw_text: "", summary: "Explored retrieval-augmented generation, embeddings, chunking and pgvector.", created_at: daysAgo(6) },
  { id: "en3", title: "Why we forget — memory science", raw_text: "", summary: "Covered the forgetting curve, consolidation, sleep's role and spaced repetition.", created_at: daysAgo(5) },
  { id: "en4", title: "Stoic philosophy & Rome", raw_text: "", summary: "Marcus Aurelius, dichotomy of control, and the empire he ruled.", created_at: daysAgo(18) },
];

export const demoProfile: Profile = {
  id: "demo",
  display_name: "Demo Learner",
  xp: 0,
  streak: 6,
  longest_streak: 11,
  last_active: daysAgo(1).slice(0, 10),
};

export const demoReviews: Review[] = Array.from({ length: 40 }, (_, i) => {
  const day = [0, 1, 1, 2, 3, 3, 3, 4, 6, 7, 8, 8, 10, 11, 13, 14, 15, 17, 18, 20][i % 20];
  const topic = demoTopics[i % demoTopics.length];
  const score = 2 + ((i * 7) % 4);
  return {
    id: `r${i}`,
    topic_id: topic.id,
    mode: (["recall", "quickfire"] as const)[i % 2],
    score,
    question: `What are the core details of ${topic.name}?`,
    answer: `The user answered some key facts about ${topic.name}.`,
    feedback: score >= 4 ? "Strong answer — you hit the key ideas." : "You've got part of it, but some key points are missing.",
    created_at: daysAgo(day, 9 + (i % 8)),
  };
});

export const demoPlan: DailyPlan = {
  date: new Date().toISOString().slice(0, 10),
  headline: "Six topics, one thread: how machines and minds decide what to remember.",
  insight:
    "Notice the thread running through today: transformers decide what to attend to, your hippocampus decides what to consolidate, and spaced repetition exploits that same machinery. Sleep & Learning and Memory Consolidation explain WHY the SM-2 schedule behind this very app works.",
  items: [
    { topic_id: "d1", topic_name: "Transformer Architecture", category: "Technology", mode: "recall", reason: "Due for review today" },
    { topic_id: "d7", topic_name: "Sleep & Learning", category: "Health", mode: "quickfire", reason: "Needs practice — only 0 reviews" },
    { topic_id: "d3", topic_name: "Retrieval-Augmented Generation", category: "Technology", mode: "recall", reason: "Due for review today" },
    { topic_id: "d13", topic_name: "Supabase & Postgres", category: "Technology", mode: "quickfire", reason: "Learnt 2 days ago — lock it in" },
    { topic_id: "d10", topic_name: "The Roman Empire", category: "History", mode: "recall", reason: "Overdue — last seen 2 weeks ago" },
    { topic_id: "d14", topic_name: "Deliberate Practice", category: "Science", mode: "quickfire", reason: "New topic from this week" },
    { topic_id: "d6", topic_name: "How Memory Consolidates", category: "Science", mode: "recall", reason: "Due for review today" },
    { topic_id: "d5", topic_name: "Spaced Repetition", category: "Science", mode: "quickfire", reason: "Interval up today — keep the curve flat" },
    { topic_id: "d9", topic_name: "Stoicism", category: "Philosophy", mode: "recall", reason: "Not seen in 3 days" },
    { topic_id: "d12", topic_name: "Bayes' Theorem", category: "Mathematics", mode: "quickfire", reason: "Needs practice — only 1 review" },
  ],
  completed: false,
};

/** Demo question bank — mirrors what ingest pre-generates in real mode. */
export interface DemoBankQuestion {
  topic_id: string;
  kind: QuestionKind;
  prompt: string;
  options: string[] | null;
  correct_index: number | null;
  correct_indices?: number[] | null;
  model_answer: string;
}

export const demoQuestionBank: DemoBankQuestion[] = [
  {
    topic_id: "d1", kind: "truefalse",
    prompt: "Transformers process language tokens sequentially, one by one.",
    options: ["True", "False"], correct_index: 1,
    model_answer: "False — self-attention processes all tokens in parallel, which is exactly what made web-scale training practical.",
  },
  {
    topic_id: "d1", kind: "multi",
    prompt: "Which of these are real ingredients of the transformer architecture? Select all that apply.",
    options: [
      "Self-attention over all tokens",
      "Positional encodings",
      "A recurrence loop over the sequence",
      "Multi-head attention",
      "A convolutional feature pyramid",
    ],
    correct_index: null, correct_indices: [0, 1, 3],
    model_answer: "Self-attention, positional encodings and multi-head attention are core transformer pieces — recurrence and convolutional pyramids are what it replaced.",
  },
  {
    topic_id: "d7", kind: "truefalse",
    prompt: "Slow-wave sleep is the stage where memory consolidation primarily happens.",
    options: ["True", "False"], correct_index: 0,
    model_answer: "True — slow-wave (deep) sleep replays hippocampal memories into cortex; that replay is the consolidation step.",
  },
  {
    topic_id: "d10", kind: "truefalse",
    prompt: "Pax Romana was a period of stability in Rome lasting roughly 20 years.",
    options: ["True", "False"], correct_index: 1,
    model_answer: "False — the Pax Romana lasted roughly 200 years, not 20.",
  },
  {
    topic_id: "d6", kind: "multi",
    prompt: "Which of these genuinely strengthen memory consolidation? Select all that apply.",
    options: [
      "Active recall practice",
      "Re-reading your notes a fifth time",
      "A full night's sleep",
      "Highlighting in three colours",
    ],
    correct_index: null, correct_indices: [0, 2],
    model_answer: "Active recall and sleep both strengthen consolidation; re-reading and highlighting feel productive but barely move the needle.",
  },
  {
    topic_id: "d9", kind: "truefalse",
    prompt: "Marcus Aurelius wrote Meditations as a private journal, never meant for publication.",
    options: ["True", "False"], correct_index: 0,
    model_answer: "True — Meditations was the emperor's private notebook; it became the most-read Stoic text anyway.",
  },
  {
    topic_id: "d1", kind: "open",
    prompt: "Explain why the transformer's parallelism was such a big deal compared to RNNs — what did it unlock?",
    options: null, correct_index: null,
    model_answer: "RNNs process tokens sequentially, so training can't be parallelised. Self-attention processes all tokens at once, letting transformers train on web-scale data efficiently — which is what made large language models practical.",
  },
  {
    topic_id: "d3", kind: "mcq",
    prompt: "In a RAG pipeline, what happens immediately after the relevant chunks are retrieved?",
    options: [
      "The chunks are added to the prompt context before generation",
      "The model is fine-tuned on the chunks",
      "The chunks are converted back into embeddings",
      "The user query is rewritten and re-embedded",
    ],
    correct_index: 0,
    model_answer: "Retrieved chunks are stuffed into the prompt context, and the LLM then generates an answer grounded in them — retrieve, augment, generate.",
  },
  {
    topic_id: "d7", kind: "open",
    prompt: "Your friend plans an all-nighter before an exam. Using what you know about sleep and memory, what would you tell them?",
    options: null, correct_index: null,
    model_answer: "Deep sleep is when the day's memories consolidate from hippocampus to cortex; skipping it can cut retention by up to 40%. Studying less but sleeping properly beats an all-nighter.",
  },
  {
    topic_id: "d10", kind: "mcq",
    prompt: "Which of these was NOT one of Rome's main tools for holding the empire together?",
    options: ["Roads", "A universal printing press", "Roman law", "Extending citizenship"],
    correct_index: 1,
    model_answer: "Rome integrated its empire through roads, a shared legal system and the strategic extension of citizenship — printing didn't exist for another millennium.",
  },
  {
    topic_id: "d13", kind: "quickfire",
    prompt: "In one sentence: where is a row-level security policy enforced?",
    options: null, correct_index: null,
    model_answer: "In the database itself — Postgres checks the policy on every query, regardless of which app or client is asking.",
  },
  {
    topic_id: "d14", kind: "open",
    prompt: "What separates deliberate practice from just doing something a lot?",
    options: null, correct_index: null,
    model_answer: "Deliberate practice targets the edge of your current ability with immediate feedback and full focus, building better mental representations — mere repetition of what's comfortable doesn't improve skill.",
  },
  {
    topic_id: "d5", kind: "mcq",
    prompt: "In SM-2, what happens to an item after a failed recall?",
    options: [
      "Its interval resets to one day and ease drops",
      "It's removed from the deck",
      "Its interval doubles to force practice",
      "Nothing — only successes change the schedule",
    ],
    correct_index: 0,
    model_answer: "A failed recall resets the interval to one day and lowers the ease factor, so the item returns sooner and grows its interval more slowly.",
  },
  {
    topic_id: "d12", kind: "quickfire",
    prompt: "Quick — what's the classic failure mode Bayes' theorem protects you from?",
    options: null, correct_index: null,
    model_answer: "Base-rate neglect: ignoring the prior probability and judging only from the new evidence.",
  },
];

/** Demo facts pool — mirrors the ingest-time facts table in real mode. */
export const demoFacts: { topic_id: string; fact: string }[] = [
  { topic_id: "d7", fact: "Pulling one all-nighter can cut your retention of newly learnt material by up to 40% — sleep is when memories consolidate." },
  { topic_id: "d1", fact: "The transformer paper is called “Attention Is All You Need” because it removed recurrence entirely — attention really was all it needed." },
  { topic_id: "d10", fact: "Rome's Pax Romana kept relative peace across the Mediterranean for roughly 200 years — longer than most modern states have existed." },
  { topic_id: "d8", fact: "The Rule of 72: divide 72 by your growth rate to estimate doubling time. At 7% a year, your money — or your knowledge — doubles in about a decade." },
  { topic_id: "d9", fact: "Marcus Aurelius never meant Meditations to be published — the most-read Stoic text was the Roman emperor's private journal." },
  { topic_id: "d5", fact: "Ebbinghaus discovered the forgetting curve in 1885 by memorising thousands of nonsense syllables — on himself." },
  { topic_id: "d12", fact: "Doctors given a positive test result routinely overestimate disease probability tenfold — base-rate neglect is that strong, and Bayes' theorem is the antidote." },
  { topic_id: "d4", fact: "HNSW indexes find nearest neighbours among billions of vectors in milliseconds by navigating a small-world graph — the same maths as six degrees of separation." },
];

export function demoGrade(answer: string, keyPoints: string[]): { score: number; feedback: string; model_answer: string } {
  const a = answer.toLowerCase();
  const hits = keyPoints.filter((k) =>
    k.toLowerCase().split(/\W+/).filter((w) => w.length > 4).some((w) => a.includes(w))
  ).length;
  const lengthOk = answer.trim().split(/\s+/).length >= 8;
  const score = Math.min(5, Math.max(1, hits + (lengthOk ? 2 : 0)));
  return {
    score,
    feedback:
      score >= 4
        ? "Strong answer — you hit the key ideas. (Demo mode: add your Gemini key for real AI grading.)"
        : "You've got part of it, but some key points are missing. (Demo mode: add your Gemini key for real AI grading.)",
    model_answer: keyPoints.join(" "),
  };
}
