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
  demoFlashcards,
  demoProfile,
  demoReviews,
  demoPlan,
  demoQuestionBank,
  demoGrade,
  demoTopicSource,
} from "./demo";
import { xpForReview } from "./srs";
import type {
  DailyFact,
  DailyPlan,
  Entry,
  Flashcard,
  Profile,
  QuizSession,
  ReportCard,
  ReportItem,
  Review,
  SessionQuestion,
  Topic,
  TopicLink,
  TopicSource,
} from "./types";

export { isDemo };

/** Demo quiz session: the client-safe questions plus the hidden answer key. */
interface DemoSession {
  id: string;
  questions: SessionQuestion[];
  key: Map<number, { correct_index: number | null; model_answer: string }>;
  answers: Map<number, { answer?: string; selectedIndex?: number }>;
}

// Demo-mode mutable state lives for the tab session.
const demoState = {
  profile: { ...demoProfile },
  plan: JSON.parse(JSON.stringify(demoPlan)) as DailyPlan,
  done: new Set<string>(),
  reviews: [...demoReviews] as Review[],
  session: null as DemoSession | null,
};

async function api<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
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

export async function getFlashcards(topicId: string): Promise<Flashcard[]> {
  if (isDemo) return demoFlashcards.filter((f) => f.topic_id === topicId);
  const supabase = createClient();
  const { data } = await supabase.from("flashcards").select("*").eq("topic_id", topicId);
  return (data ?? []) as Flashcard[];
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
  return api<DailyPlan>("/api/plan");
}

export interface IngestResult {
  entryTitle: string;
  topicNames: string[];
  sourceUrl?: string | null;
  xp: number;
}

export async function ingestText(text: string): Promise<IngestResult> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 1800));
    demoState.profile.xp += 30;
    return {
      entryTitle: "Demo: knowledge extracted",
      topicNames: ["(Demo mode — add Supabase + Gemini keys to save real entries)"],
      xp: 0,
    };
  }
  return api("/api/ingest", { text });
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
      xp: 0,
    };
  }
  return api("/api/ingest", { url });
}

/**
 * Start a review session: questions come from the pre-generated bank, so this
 * costs zero AI calls. The client never receives the correct answers.
 */
export async function startQuiz(topicIds: string[]): Promise<QuizSession> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 500));
    const kinds = ["open", "mcq", "quickfire"] as const;
    const questions: SessionQuestion[] = [];
    const key = new Map<number, { correct_index: number | null; model_answer: string }>();
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
        key.set(index, { correct_index: bank.correct_index, model_answer: bank.model_answer });
      } else {
        questions.push({
          index,
          topic_id: topic.id,
          topic_name: topic.name,
          category: topic.category,
          kind: "open",
          prompt: `From memory, explain "${topic.name}" — the core idea and why it matters.`,
          options: null,
        });
        key.set(index, { correct_index: null, model_answer: topic.key_points.join(" ") });
      }
    });
    demoState.session = { id: `demo-${Date.now()}`, questions, key, answers: new Map() };
    return { id: demoState.session.id, questions };
  }
  return api("/api/quiz", { action: "start", topicIds });
}

/** Save one answer the moment it's submitted — persisted in the DB, no AI. */
export async function saveQuizAnswer(args: {
  sessionId: string;
  questionIndex: number;
  answer?: string;
  selectedIndex?: number;
}): Promise<void> {
  if (isDemo) {
    demoState.session?.answers.set(args.questionIndex, {
      answer: args.answer,
      selectedIndex: args.selectedIndex,
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
    const s = demoState.session;
    if (!s || s.id !== sessionId) throw new Error("Session not found");
    const items: ReportItem[] = [];
    for (const q of s.questions) {
      const a = s.answers.get(q.index);
      if (!a) continue; // never presented (e.g. flashcards were shown instead)
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
        correct_index: q.kind === "mcq" ? key.correct_index : null,
      };
      if (q.kind === "mcq") {
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
    const xp = attempted.reduce((sum, i) => sum + xpForReview(i.score), 0);
    demoState.profile.xp += xp;
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
          mode: q.kind === "mcq" ? "quickfire" : q.kind === "quickfire" ? "quickfire" : "recall",
          score: item.score,
          created_at: new Date().toISOString(),
          question: q.prompt,
          answer: item.answer ?? undefined,
          feedback: item.feedback ?? undefined,
        } as any);
      }
    }

    return {
      session_id: sessionId,
      date: new Date().toISOString().slice(0, 10),
      score_pct: scorePct,
      xp: 0,
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
  }
  return api("/api/quiz", { action: "finish", sessionId });
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

export async function rateFlashcard(args: {
  topicId: string;
  quality: number; // 0..5
  question?: string;
  answer?: string;
  feedback?: string;
}): Promise<{ xp: number }> {
  if (isDemo) {
    demoState.done.add(args.topicId);
    demoState.reviews.push({
      id: `demo-r-fc-${args.topicId}-${Date.now()}`,
      topic_id: args.topicId,
      mode: "flashcard",
      score: args.quality,
      created_at: new Date().toISOString(),
      question: args.question ?? "True/False statement",
      answer: args.answer ?? "True",
      feedback: args.feedback ?? "Correct statement.",
    } as any);
    return { xp: 0 };
  }
  return api("/api/quiz", { action: "rate", topicId: args.topicId, quality: args.quality, question: args.question, answer: args.answer, feedback: args.feedback });
}

export async function markPlanCompleted(): Promise<void> {
  if (isDemo) {
    if (!demoState.plan.completed) demoState.profile.streak += 1;
    demoState.plan.completed = true;
    return;
  }
  await api("/api/plan", { action: "complete" });
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
  const today = new Date().toISOString().slice(0, 10);
  if (isDemo) {
    const r = demoState.reviews.find(
      (x) => x.topic_id === topicId && x.created_at.slice(0, 10) === today
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
    .gte("created_at", today + "T00:00:00Z")
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

export async function getLatestReportToday(): Promise<ReportCard | null> {
  const today = new Date().toISOString().slice(0, 10);
  if (isDemo) {
    if (demoState.plan.completed) {
      const items: ReportItem[] = [];
      const todayReviews = demoState.reviews.filter(r => r.created_at.slice(0, 10) === today);
      if (todayReviews.length === 0) return null;
      todayReviews.forEach((r, i) => {
        items.push({
          index: i,
          topic_id: r.topic_id,
          topic_name: demoTopics.find(t => t.id === r.topic_id)?.name ?? "Topic",
          kind: r.mode === "flashcard" ? "quickfire" : "open",
          prompt: r.question ?? "Review prompt",
          answer: r.answer ?? null,
          skipped: false,
          correct: null,
          score: r.score,
          feedback: r.feedback ?? "Completed successfully.",
          correct_answer: "Reference answer stored.",
          options: null,
          selected_index: null,
          correct_index: null,
        });
      });
      return {
        session_id: "demo-latest",
        date: today,
        score_pct: Math.round((items.reduce((s, x) => s + x.score, 0) / (items.length * 5)) * 100),
        xp: 0,
        summary: "Excellent work completing today's revision session!",
        strengths: ["Consistency", "Recall"],
        focus: [],
        items,
      };
    }
    return null;
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("quiz_sessions")
    .select("report")
    .eq("status", "graded")
    .gte("graded_at", today + "T00:00:00Z")
    .order("graded_at", { ascending: false })
    .limit(1);
  return (data?.[0]?.report as ReportCard) ?? null;
}
