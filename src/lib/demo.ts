import type {
  DailyPlan,
  Entry,
  Flashcard,
  Profile,
  Review,
  Topic,
  TopicLink,
  TopicSource,
} from "./types";

/** Demo mode is active when Supabase isn't configured yet. */
export const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL;

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

export const demoFlashcards: Flashcard[] = [
  { id: "f1", topic_id: "d1", question: "Why did transformers replace RNNs for language modelling?", answer: "They process all tokens in parallel via self-attention, removing the sequential bottleneck and enabling much larger training runs." },
  { id: "f2", topic_id: "d1", question: "What problem do positional encodings solve?", answer: "Self-attention is order-agnostic, so positional encodings inject word-order information into the model." },
  { id: "f3", topic_id: "d5", question: "What is the spacing effect?", answer: "Information reviewed at spaced intervals is remembered far better than the same time spent massed together (cramming)." },
  { id: "f4", topic_id: "d5", question: "In SM-2, what happens after a failed recall?", answer: "The interval resets to 1 day and the ease factor drops, so the item comes back sooner." },
  { id: "f5", topic_id: "d7", question: "Which sleep stage replays hippocampal memories?", answer: "Slow-wave (deep) sleep replays the day's memories, transferring them toward cortical long-term storage." },
  { id: "f6", topic_id: "d3", question: "What are the three steps of a RAG pipeline?", answer: "Retrieve relevant chunks via embedding similarity, add them to the prompt context, then generate the answer." },
  { id: "f7", topic_id: "d10", question: "What was the Pax Romana?", answer: "A ~200-year period of relative peace and stability across the Roman Empire, starting under Augustus." },
  { id: "f8", topic_id: "d12", question: "State Bayes' theorem.", answer: "P(A|B) = P(B|A) × P(A) / P(B) — posterior equals likelihood times prior over evidence." },
];

export const demoProfile: Profile = {
  id: "demo",
  display_name: "Demo Learner",
  xp: 940,
  streak: 6,
  longest_streak: 11,
  last_active: daysAgo(1).slice(0, 10),
};

export const demoReviews: Review[] = Array.from({ length: 40 }, (_, i) => {
  const day = [0, 1, 1, 2, 3, 3, 3, 4, 6, 7, 8, 8, 10, 11, 13, 14, 15, 17, 18, 20][i % 20];
  return {
    id: `r${i}`,
    topic_id: demoTopics[i % demoTopics.length].id,
    mode: (["recall", "flashcard", "quickfire"] as const)[i % 3],
    score: 2 + ((i * 7) % 4),
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
    { topic_id: "d7", topic_name: "Sleep & Learning", category: "Health", mode: "flashcard", reason: "Struggling topic — mastery 35%" },
    { topic_id: "d3", topic_name: "Retrieval-Augmented Generation", category: "Technology", mode: "recall", reason: "Due for review today" },
    { topic_id: "d13", topic_name: "Supabase & Postgres", category: "Technology", mode: "quickfire", reason: "Learnt 2 days ago — lock it in" },
    { topic_id: "d10", topic_name: "The Roman Empire", category: "History", mode: "flashcard", reason: "Overdue — last seen 2 weeks ago" },
    { topic_id: "d14", topic_name: "Deliberate Practice", category: "Science", mode: "quickfire", reason: "New topic from this week" },
  ],
  completed: false,
};

/** Canned questions per topic for demo quiz mode. */
export const demoQuestions: Record<string, string> = {
  d1: "Explain why the transformer's parallelism was such a big deal compared to RNNs — what did it unlock?",
  d3: "Walk through what happens between a user asking a question and a RAG system answering it.",
  d7: "Your friend plans an all-nighter before an exam. Using what you know about sleep and memory, what would you tell them?",
  d10: "What mechanisms did Rome use to hold such a large empire together?",
  d13: "How does row-level security in Supabase differ from checking permissions in application code?",
  d14: "What separates deliberate practice from just doing something a lot?",
};

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
