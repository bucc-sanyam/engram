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
  demoFlashcards,
  demoProfile,
  demoReviews,
  demoPlan,
  demoQuestions,
  demoGrade,
} from "./demo";
import type {
  DailyPlan,
  Entry,
  Flashcard,
  GradeResult,
  Profile,
  Review,
  ReviewMode,
  Topic,
  TopicLink,
} from "./types";

export { isDemo };

// Demo-mode mutable state lives for the tab session.
const demoState = {
  profile: { ...demoProfile },
  plan: JSON.parse(JSON.stringify(demoPlan)) as DailyPlan,
  done: new Set<string>(),
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
  const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  return data as Profile;
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
  if (isDemo) return demoReviews;
  const supabase = createClient();
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);
  const { data } = await supabase
    .from("reviews")
    .select("id, topic_id, mode, score, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });
  return (data ?? []) as Review[];
}

export async function getPlan(): Promise<DailyPlan> {
  if (isDemo) return demoState.plan;
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
      xp: 30,
    };
  }
  return api("/api/ingest", { text });
}

export async function ingestLink(url: string): Promise<IngestResult> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 2200));
    demoState.profile.xp += 30;
    let host = "the article";
    try {
      host = new URL(url).hostname.replace(/^www\./, "");
    } catch { /* keep fallback */ }
    return {
      entryTitle: `Demo: article from ${host}`,
      topicNames: ["(Demo mode — add Supabase + Gemini keys to fetch and save real articles)"],
      sourceUrl: url,
      xp: 30,
    };
  }
  return api("/api/ingest", { url });
}

export async function getQuestion(topicId: string, mode: ReviewMode): Promise<{ question: string }> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 700));
    const topic = demoTopics.find((t) => t.id === topicId);
    return { question: demoQuestions[topicId] ?? `From memory, explain the core idea of "${topic?.name}" and why it matters.` };
  }
  return api("/api/quiz", { action: "question", topicId, mode });
}

export async function submitAnswer(args: {
  topicId: string;
  mode: ReviewMode;
  question: string;
  answer: string;
}): Promise<GradeResult & { xp: number }> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 900));
    const topic = demoTopics.find((t) => t.id === args.topicId)!;
    const g = demoGrade(args.answer, topic.key_points);
    const xp = 5 + g.score * 4;
    demoState.profile.xp += xp;
    demoState.done.add(args.topicId);
    return { ...g, xp };
  }
  return api("/api/quiz", { action: "grade", ...args });
}

export async function rateFlashcard(args: {
  topicId: string;
  quality: number; // 0..5
}): Promise<{ xp: number }> {
  if (isDemo) {
    const xp = 5 + args.quality * 4;
    demoState.profile.xp += xp;
    demoState.done.add(args.topicId);
    return { xp };
  }
  return api("/api/quiz", { action: "rate", topicId: args.topicId, quality: args.quality });
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
