"use client";

/**
 * Client data layer. Every page talks to this module; it switches between
 * demo data (no Supabase configured) and the real Supabase + API backend.
 */
import { createClient } from "./supabase/client";
import {
  isDemo,
  demoTopics,
  demoLinks,
  demoEntries,
  demoFacts,
  demoProfile,
  demoReviews,
  demoPlan,
  demoQuestionBank,
  demoGrade,
  demoTopicSource,
} from "./demo";
import { localDayKey, localDayStartIso, localDayEndIso, tzOffsetMinutes } from "./dates";
import type {
  DailyFact,
  DailyPlan,
  Entry,
  Profile,
  QuizSession,
  ReportCard,
  ReportItem,
  Review,
  SessionQuestion,
  Topic,
  TopicLink,
  TopicQuestion,
  TopicSource,
} from "./types";

export { isDemo };
export * from "./stories";

/** Demo quiz session: the client-safe questions plus the hidden answer key. */
interface DemoSession {
  id: string;
  questions: SessionQuestion[];
  key: Map<
    number,
    { correct_index: number | null; correct_indices: number[] | null; model_answer: string }
  >;
  answers: Map<number, { answer?: string; selectedIndex?: number; selectedIndices?: number[] }>;
}

// Demo-mode mutable state. Persisted to localStorage so guest progress
// survives reloads and hard navigations (done flags reset on a new day,
// like the real backend; reviews/reports/streak carry over).
const DEMO_STATE_KEY = "knovis.demo.v1";

const demoState = {
  profile: { ...demoProfile },
  plan: JSON.parse(JSON.stringify(demoPlan)) as DailyPlan,
  done: new Set<string>(),
  reviews: [...demoReviews] as Review[],
  // Keyed by session id so several series groups can each run their own
  // independent session concurrently (per-group report cards).
  sessions: new Map<string, DemoSession>(),
  reports: [] as ReportCard[], // graded reports (feeds day report cards)
};

function saveDemoState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      DEMO_STATE_KEY,
      JSON.stringify({
        day: localDayKey(),
        profile: demoState.profile,
        completed: demoState.plan.completed,
        done: Array.from(demoState.done),
        reviews: demoState.reviews,
        reports: demoState.reports,
      })
    );
  } catch { /* storage full/blocked — demo stays in-memory */ }
}

function loadDemoState(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(DEMO_STATE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as {
      day?: string;
      profile?: Profile;
      completed?: boolean;
      done?: string[];
      reviews?: Review[];
      reports?: ReportCard[];
    };
    if (saved.profile) demoState.profile = { ...demoState.profile, ...saved.profile };
    if (Array.isArray(saved.reviews) && saved.reviews.length) demoState.reviews = saved.reviews;
    if (Array.isArray(saved.reports)) demoState.reports = saved.reports;
    // Done flags and day-completion only carry within the same local day.
    if (saved.day === localDayKey()) {
      demoState.done = new Set(saved.done ?? []);
      demoState.plan.completed = !!saved.completed;
    }
  } catch { /* corrupted blob — start fresh */ }
}

if (isDemo) loadDemoState();

/** Thrown by api() — carries the HTTP status so callers can branch on it (e.g. 429 rate limits) without parsing the message text. */
export class ApiError extends Error {
  status: number;
  /** ISO instant of the client's next local midnight, when a 429 daily-limit error includes one. */
  resetAt?: string;
  constructor(message: string, status: number, resetAt?: string) {
    super(message);
    this.status = status;
    this.resetAt = resetAt;
  }
}

async function api<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    // `??` only falls back on null/undefined — over HTTP/2, res.statusText is
    // ALWAYS "" (no reason phrases), so a non-JSON error body (platform crash
    // or timeout) used to produce `new Error("")`, which the UI then rendered
    // as nothing (`{error && ...}` is falsy for ""). Include res.status so the
    // fallback is never blank.
    const err = await res.json().catch(() => ({}));
    throw new ApiError(err.error || `Request failed (${res.status})`, res.status, err.resetAt);
  }
  return res.json();
}

export async function getProfile(): Promise<Profile> {
  if (isDemo) return demoState.profile;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (data) return data as Profile;
  // No profile row — e.g. the account predates the handle_new_user trigger, or
  // the trigger was never installed. Self-heal by creating the row now so the
  // profile page (and dashboard greeting) never hang on a missing row.
  const displayName =
    (user.user_metadata?.name as string | undefined) ?? user.email?.split("@")[0] ?? null;
  const { data: created, error: insertErr } = await supabase
    .from("profiles")
    .upsert({ id: user.id, display_name: displayName }, { onConflict: "id" })
    .select()
    .single();
  if (insertErr) throw insertErr;
  return created as Profile;
}

export async function updateProfile(fields: { display_name: string }): Promise<Profile> {
  if (isDemo) {
    demoState.profile = { ...demoState.profile, ...fields };
    saveDemoState();
    return demoState.profile;
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("profiles")
    .update(fields)
    .eq("id", user!.id)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function getUserEmail(): Promise<string | null> {
  if (isDemo) return null;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? null;
}

export async function getTopics(): Promise<Topic[]> {
  if (isDemo) return demoTopics;
  const supabase = createClient();
  const { data } = await supabase.from("topics").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Topic[];
}

export async function getTopic(id: string): Promise<Topic | null> {
  if (isDemo) return demoTopics.find((t) => t.id === id) ?? null;
  const supabase = createClient();
  const { data } = await supabase.from("topics").select("*").eq("id", id).single();
  return data as Topic | null;
}

/**
 * Where a topic came from, for its blog page: the source_url of the entry it
 * was extracted from (a link), or `text` when it was pasted in. Null if unknown.
 */
export async function getTopicSource(topicId: string): Promise<TopicSource> {
  if (isDemo) {
    return demoTopicSource[topicId] ?? { kind: "text" };
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("entry_topics")
    .select("entries(source_url, created_at)")
    .eq("topic_id", topicId);
  const rows = (data ?? []) as unknown as Array<{
    entries: { source_url: string | null; created_at: string } | null;
  }>;
  const entries = rows
    .map((r) => r.entries)
    .filter((e): e is { source_url: string | null; created_at: string } => !!e)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (entries.length === 0) return null;
  const withUrl = entries.find((e) => e.source_url);
  if (withUrl?.source_url) return { kind: "url", url: withUrl.source_url };
  return { kind: "text" };
}

export async function getLinks(): Promise<TopicLink[]> {
  if (isDemo) return demoLinks;
  const supabase = createClient();
  const { data } = await supabase.from("topic_links").select("*");
  return (data ?? []) as TopicLink[];
}

export async function getEntries(): Promise<Entry[]> {
  if (isDemo) return demoEntries;
  const supabase = createClient();
  const { data } = await supabase
    .from("entries")
    .select("id, title, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []).map((e) => ({ ...e, raw_text: "" })) as Entry[];
}

/** All bank questions for one topic, WITH answers — for the topic's blog page. */
export async function getTopicQuestions(topicId: string): Promise<TopicQuestion[]> {
  if (isDemo) {
    return demoQuestionBank
      .filter((q) => q.topic_id === topicId)
      .map((q, i) => ({
        id: `demo-q-${topicId}-${i}`,
        topic_id: q.topic_id,
        kind: q.kind,
        prompt: q.prompt,
        options: q.options,
        correct_index: q.correct_index,
        correct_indices: q.correct_indices ?? null,
        model_answer: q.model_answer,
        difficulty: "basic",
      }));
  }
  const supabase = createClient();
  // select * so databases without the newer correct_indices column still work.
  const { data } = await supabase
    .from("questions")
    .select("*")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });
  return ((data ?? []) as Record<string, unknown>[]).map((q) => ({
    id: q.id as string,
    topic_id: q.topic_id as string,
    kind: q.kind as TopicQuestion["kind"],
    prompt: q.prompt as string,
    options: (q.options as string[] | null) ?? null,
    correct_index: (q.correct_index as number | null) ?? null,
    correct_indices: (q.correct_indices as number[] | null) ?? null,
    model_answer: q.model_answer as string,
    difficulty: (q.difficulty as string) ?? "basic",
  }));
}

export async function getReviews(sinceDays = 120): Promise<Review[]> {
  if (isDemo) return demoState.reviews;
  const supabase = createClient();
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);
  const { data } = await supabase
    .from("reviews")
    .select("id, topic_id, mode, score, question, answer, feedback, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });
  return (data ?? []) as Review[];
}

export async function getPlan(): Promise<DailyPlan> {
  if (isDemo) {
    return {
      ...demoState.plan,
      items: demoState.plan.items.map((it) => ({
        ...it,
        done: demoState.done.has(it.topic_id),
      })),
    };
  }
  return api<DailyPlan>(`/api/plan?tz=${tzOffsetMinutes()}`);
}

export interface IngestResult {
  entryTitle: string;
  topicNames: string[];
  sourceUrl?: string | null;
  /** True when this exact content was already ingested — the existing entry was reused, nothing new was created. */
  duplicate?: boolean;
  message?: string;
}

export async function ingestText(text: string): Promise<IngestResult> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 1800));
    return {
      entryTitle: "Demo: knowledge extracted",
      topicNames: ["(Demo mode — add Supabase + Gemini keys to save real entries)"],
    };
  }
  return api("/api/ingest", { text, tz: tzOffsetMinutes() });
}

export async function ingestLink(url: string): Promise<IngestResult> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 2200));
    let host = "the article";
    try {
      host = new URL(url).hostname.replace(/^www\./, "");
    } catch { /* keep fallback */ }
    return {
      entryTitle: `Demo: article from ${host}`,
      topicNames: ["(Demo mode — add Supabase + Gemini keys to fetch and save real articles)"],
      sourceUrl: url,
    };
  }
  return api("/api/ingest", { url, tz: tzOffsetMinutes() });
}

/**
 * Start a review session: questions come from the pre-generated bank, so this
 * costs zero AI calls. The client never receives the correct answers.
 */
export async function startQuiz(topicIds: string[]): Promise<QuizSession> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 500));
    const kinds = ["open", "mcq", "truefalse", "quickfire", "multi"] as const;
    const questions: SessionQuestion[] = [];
    const key = new Map<
      number,
      { correct_index: number | null; correct_indices: number[] | null; model_answer: string }
    >();
    topicIds.forEach((topicId, i) => {
      const topic = demoTopics.find((t) => t.id === topicId);
      if (!topic) return;
      const pool = demoQuestionBank.filter((q) => q.topic_id === topicId);
      const bank =
        pool.find((q) => q.kind === kinds[i % kinds.length]) ?? pool[0] ?? null;
      const index = questions.length;
      if (bank) {
        questions.push({
          index,
          topic_id: topic.id,
          topic_name: topic.name,
          category: topic.category,
          kind: bank.kind,
          prompt: bank.prompt,
          options: bank.options,
        });
        key.set(index, {
          correct_index: bank.correct_index,
          correct_indices: bank.correct_indices ?? null,
          model_answer: bank.model_answer,
        });
      } else {
        questions.push({
          index,
          topic_id: topic.id,
          topic_name: topic.name,
          category: topic.category,
          kind: "open",
          prompt:
            topic.category === "Computer Science"
              ? `For the algorithm "${topic.name}", explain the core pattern or recurrence relation used to solve it, and state the time and space complexity of the optimal approach.`
              : `From memory, explain "${topic.name}" — the core idea and why it matters.`,
          options: null,
        });
        key.set(index, {
          correct_index: null,
          correct_indices: null,
          model_answer: topic.key_points.join(" "),
        });
      }
    });
    const id = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    demoState.sessions.set(id, { id, questions, key, answers: new Map() });
    return { id, questions };
  }
  return api("/api/quiz", { action: "start", topicIds });
}

/** Save one answer the moment it's submitted — persisted in the DB, no AI. */
export async function saveQuizAnswer(args: {
  sessionId: string;
  questionIndex: number;
  answer?: string;
  selectedIndex?: number;
  selectedIndices?: number[];
}): Promise<void> {
  if (isDemo) {
    demoState.sessions.get(args.sessionId)?.answers.set(args.questionIndex, {
      answer: args.answer,
      selectedIndex: args.selectedIndex,
      selectedIndices: args.selectedIndices,
    });
    return;
  }
  await api("/api/quiz", { action: "answer", ...args });
}

/**
 * Finish the session: the ONE AI call grades everything at once and returns
 * the report card (demo mode grades locally).
 */
export async function finishQuiz(sessionId: string): Promise<ReportCard> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 1200));
    const s = demoState.sessions.get(sessionId);
    if (!s) throw new Error("Session not found");
    const items: ReportItem[] = [];
    for (const q of s.questions) {
      const a = s.answers.get(q.index);
      if (!a) continue; // never presented this session
      const key = s.key.get(q.index)!;
      const topic = demoTopics.find((t) => t.id === q.topic_id)!;
      const item: ReportItem = {
        index: q.index,
        topic_id: q.topic_id,
        topic_name: q.topic_name,
        kind: q.kind,
        prompt: q.prompt,
        answer: null,
        skipped: false,
        correct: null,
        score: 0,
        feedback: "",
        correct_answer: key.model_answer,
        options: q.options,
        selected_index: null,
        correct_index: q.kind === "mcq" || q.kind === "truefalse" ? key.correct_index : null,
        selected_indices: null,
        correct_indices: q.kind === "multi" ? key.correct_indices : null,
      };
      if (q.kind === "mcq" || q.kind === "truefalse") {
        const sel = typeof a.selectedIndex === "number" ? a.selectedIndex : null;
        item.selected_index = sel;
        item.answer = sel !== null ? q.options?.[sel] ?? null : null;
        if (sel === null) {
          item.skipped = true;
          item.feedback = "You skipped this one — no harm done, it'll come back around.";
        } else {
          item.correct = sel === key.correct_index;
          item.score = item.correct ? 5 : 1;
          item.feedback = item.correct
            ? "Correct — you picked the right option."
            : `Not quite — the right answer was "${q.options?.[key.correct_index ?? 0] ?? ""}".`;
        }
        if (key.correct_index !== null && q.options) {
          item.correct_answer = q.options[key.correct_index] ?? key.model_answer;
        }
      } else if (q.kind === "multi") {
        const sel = a.selectedIndices?.filter((n) => typeof n === "number") ?? null;
        const answerKey = key.correct_indices ?? [];
        item.selected_indices = sel;
        item.answer =
          sel && q.options ? sel.map((i) => q.options![i]).filter(Boolean).join(" · ") || null : null;
        item.correct_answer =
          answerKey.length && q.options
            ? answerKey.map((i) => q.options![i]).filter(Boolean).join(" · ")
            : key.model_answer;
        if (!sel || sel.length === 0) {
          item.skipped = true;
          item.feedback = "You skipped this one — no harm done, it'll come back around.";
        } else {
          const hits = sel.filter((i) => answerKey.includes(i)).length;
          const wrong = sel.length - hits;
          item.correct = hits === answerKey.length && wrong === 0;
          item.score = item.correct
            ? 5
            : Math.max(0, Math.min(4, Math.round((5 * Math.max(0, hits - wrong)) / Math.max(1, answerKey.length))));
          item.feedback = item.correct
            ? "Correct — you picked every right option."
            : hits > 0
              ? `Partly right — you found ${hits} of ${answerKey.length} correct option${answerKey.length === 1 ? "" : "s"}${wrong ? ` but also picked ${wrong} wrong one${wrong === 1 ? "" : "s"}` : ""}.`
              : "Not quite — none of your picks were correct this time.";
        }
      } else {
        const typed = (a.answer ?? "").trim();
        item.answer = typed || null;
        if (!typed) {
          item.skipped = true;
          item.feedback = "You skipped this one — no harm done, it'll come back around.";
        } else {
          const g = demoGrade(typed, topic.key_points);
          item.score = g.score;
          item.feedback = g.feedback;
        }
      }
      items.push(item);
      demoState.done.add(q.topic_id);
    }
    const attempted = items.filter((i) => !i.skipped);
    const scorePct = attempted.length
      ? Math.round((attempted.reduce((sum, i) => sum + i.score, 0) / (attempted.length * 5)) * 100)
      : 0;
    const strengths = attempted.filter((i) => i.score >= 4).map((i) => i.topic_name).slice(0, 3);
    const focus = attempted.filter((i) => i.score <= 2).map((i) => i.topic_name).slice(0, 3);

    // Also add to demoState.reviews so it shows up in calendar and review detail!
    for (const q of s.questions) {
      const a = s.answers.get(q.index);
      if (!a) continue;
      const item = items.find((x) => x.index === q.index)!;
      if (!item.skipped) {
        demoState.reviews.push({
          id: `demo-r-${q.topic_id}-${Date.now()}`,
          topic_id: q.topic_id,
          mode: q.kind === "open" ? "recall" : "quickfire",
          score: item.score,
          created_at: new Date().toISOString(),
          question: q.prompt,
          answer: item.answer ?? undefined,
          feedback: item.feedback ?? undefined,
        } as Review);
      }
    }

    const report: ReportCard = {
      session_id: sessionId,
      date: localDayKey(),
      score_pct: scorePct,
      summary:
        scorePct >= 80
          ? "Excellent session — your recall is sharp across the board. (Demo mode: add your Gemini key for real AI report cards.)"
          : scorePct >= 50
            ? "Solid session — the core ideas are there, with a few gaps worth another pass. (Demo mode: add your Gemini key for real AI report cards.)"
            : "Tough session, and that's fine — effortful recall is exactly what rewires memory. (Demo mode: add your Gemini key for real AI report cards.)",
      strengths,
      focus,
      items,
    };
    // Keep the graded report so "See report" and calendar day clicks can replay it.
    demoState.reports.push(report);
    saveDemoState();
    return report;
  }
  return api("/api/quiz", { action: "finish", sessionId, tz: tzOffsetMinutes() });
}

/**
 * Fact of the day, drawn deterministically from the facts pre-generated at
 * ingest — same fact all day, a new one tomorrow, zero AI calls.
 */
export async function getFactOfTheDay(): Promise<DailyFact | null> {
  const day = Math.floor(Date.now() / 86400000);
  if (isDemo) {
    const f = demoFacts[day % demoFacts.length];
    const topic = demoTopics.find((t) => t.id === f.topic_id);
    return { text: f.fact, topic_name: topic?.name ?? null };
  }
  const supabase = createClient();
  const { data } = await supabase.from("facts").select("fact, topics(name)").limit(300);
  const facts = (data ?? []) as unknown as Array<{ fact: string; topics: { name: string } | null }>;
  if (facts.length) {
    const f = facts[day % facts.length];
    return { text: f.fact, topic_name: f.topics?.name ?? null };
  }
  // Older accounts have no facts yet — fall back to a key point from a topic.
  const { data: topics } = await supabase.from("topics").select("name, key_points");
  const withPoints = (topics ?? []).filter((t) => (t.key_points as string[])?.length);
  if (!withPoints.length) return null;
  const t = withPoints[day % withPoints.length];
  const points = t.key_points as string[];
  return { text: points[day % points.length], topic_name: t.name };
}

export async function markPlanCompleted(): Promise<void> {
  if (isDemo) {
    if (!demoState.plan.completed) demoState.profile.streak += 1;
    demoState.plan.completed = true;
    saveDemoState();
    return;
  }
  await api("/api/plan", { action: "complete", tz: tzOffsetMinutes() });
}

export async function signOut(): Promise<void> {
  if (isDemo) return;
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = "/login";
}

export async function getTodayReviewDetail(topicId: string): Promise<{
  question: string;
  userAnswer: string;
  storedAnswer: string;
  feedback?: string;
} | null> {
  const today = localDayKey();
  if (isDemo) {
    const r = demoState.reviews.find(
      (x) => x.topic_id === topicId && localDayKey(new Date(x.created_at)) === today
    );
    if (!r) return null;
    const q = demoQuestionBank.find(
      (x) => x.topic_id === topicId && x.prompt === r.question
    );
    return {
      question: r.question ?? "Review prompt",
      userAnswer: r.answer ?? "No answer",
      storedAnswer: q?.model_answer ?? "No answer stored",
      feedback: r.feedback ?? undefined,
    };
  }

  const supabase = createClient();
  const { data: revs } = await supabase
    .from("reviews")
    .select("*")
    .eq("topic_id", topicId)
    .gte("created_at", localDayStartIso(today))
    .order("created_at", { ascending: false });
  if (!revs || !revs.length) return null;
  const r = revs[0];

  const { data: q } = await supabase
    .from("questions")
    .select("model_answer")
    .eq("topic_id", topicId)
    .eq("prompt", r.question)
    .maybeSingle();

  return {
    question: r.question ?? "",
    userAnswer: r.answer ?? "",
    storedAnswer: q?.model_answer ?? r.feedback ?? "",
    feedback: r.feedback ?? undefined,
  };
}

/** Merge several session reports into ONE report card for a day. */
function mergeReports(reports: ReportCard[], day: string): ReportCard {
  const items = reports
    .flatMap((r) => r.items)
    .map((it, i) => ({ ...it, index: i }));
  const attempted = items.filter((i) => !i.skipped);
  const scorePct = attempted.length
    ? Math.round((attempted.reduce((s, i) => s + i.score, 0) / (attempted.length * 5)) * 100)
    : 0;
  const dedupe = (xs: string[]) => Array.from(new Set(xs)).slice(0, 4);
  return {
    session_id: reports.map((r) => r.session_id).join("+"),
    date: day,
    score_pct: scorePct,
    summary:
      reports.length === 1
        ? reports[0].summary
        : `Across ${reports.length} sessions this day you answered ${attempted.length} question${attempted.length === 1 ? "" : "s"}${items.length - attempted.length ? ` and skipped ${items.length - attempted.length}` : ""} — every one of them is below, questions and answers included.`,
    strengths: dedupe(reports.flatMap((r) => r.strengths)),
    focus: dedupe(reports.flatMap((r) => r.focus)),
    items,
  };
}

/** Rebuild a report card from raw review rows (history predating session reports). */
function reportFromReviews(revs: Review[], day: string, topicName: (id: string) => string): ReportCard | null {
  if (!revs.length) return null;
  const items: ReportItem[] = revs.map((r, i) => {
    const bank = demoQuestionBank.find(
      (q) => q.topic_id === r.topic_id && q.prompt === r.question
    );
    return {
      index: i,
      topic_id: r.topic_id,
      topic_name: topicName(r.topic_id),
      kind: bank?.kind ?? (r.mode === "recall" ? "open" : "quickfire"),
      prompt: r.question ?? "Review prompt",
      answer: r.answer ?? null,
      skipped: false,
      correct: null,
      score: r.score,
      feedback: r.feedback ?? "",
      correct_answer: bank?.model_answer ?? "",
      options: bank?.options ?? null,
      selected_index: null,
      correct_index: bank?.correct_index ?? null,
      selected_indices: null,
      correct_indices: bank?.correct_indices ?? null,
    };
  });
  const scorePct = Math.round(
    (items.reduce((s, x) => s + x.score, 0) / (items.length * 5)) * 100
  );
  return {
    session_id: `day-${day}`,
    date: day,
    score_pct: scorePct,
    summary: `You answered ${items.length} question${items.length === 1 ? "" : "s"} this day — here's the full breakdown, questions and answers included.`,
    strengths: items.filter((i) => i.score >= 4).map((i) => i.topic_name).slice(0, 3),
    focus: items.filter((i) => i.score <= 2).map((i) => i.topic_name).slice(0, 3),
    items,
  };
}

/**
 * The full report card for one calendar day (YYYY-MM-DD): every question asked
 * that day with the answer given, the correct answer and the feedback. Merges
 * all graded sessions of the day; falls back to raw review history.
 */
export async function getDayReport(day: string): Promise<ReportCard | null> {
  if (isDemo) {
    const fromSessions = demoState.reports.filter((r) => r.date === day);
    if (fromSessions.length) return mergeReports(fromSessions, day);
    const dayReviews = demoState.reviews
      .filter((r) => localDayKey(new Date(r.created_at)) === day)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    return reportFromReviews(dayReviews, day, (id) =>
      demoTopics.find((t) => t.id === id)?.name ?? "Topic"
    );
  }

  const supabase = createClient();
  // `day` is a LOCAL calendar day — query the UTC instants it spans.
  const startIso = localDayStartIso(day);
  const endIso = localDayEndIso(day);

  const { data } = await supabase
    .from("quiz_sessions")
    .select("report")
    .eq("status", "graded")
    .gte("graded_at", startIso)
    .lt("graded_at", endIso)
    .order("graded_at", { ascending: true });
  const reports = (data ?? [])
    .map((r) => r.report as ReportCard)
    .filter(Boolean);
  if (reports.length) return mergeReports(reports, day);

  // History that predates session reports — rebuild from the reviews rows.
  const { data: revs } = await supabase
    .from("reviews")
    .select("id, topic_id, mode, score, question, answer, feedback, created_at")
    .gte("created_at", startIso)
    .lt("created_at", endIso)
    .order("created_at", { ascending: true });
  if (!revs?.length) return null;
  const topics = await getTopics();
  const nameById = new Map(topics.map((t) => [t.id, t.name]));
  return reportFromReviews(revs as Review[], day, (id) => nameById.get(id) ?? "Topic");
}

export async function getLatestReportToday(): Promise<ReportCard | null> {
  return getDayReport(localDayKey());
}
