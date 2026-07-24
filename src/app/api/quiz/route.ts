import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gradeSession, type SessionGradeInput } from "@/lib/gemini";
import { scheduleNext } from "@/lib/srs";
import { advanceStreak } from "@/lib/progress";
import { clampTz, localTodayForOffset } from "@/lib/dates";
import { indexAnswers } from "@/lib/rag";
import type {
  QuestionKind,
  ReportCard,
  ReportItem,
  SessionQuestion,
  Topic,
} from "@/lib/types";
import { getSeed } from "@/lib/story-seeds";

export const maxDuration = 60;

/**
 * Max quiz sessions per user per day that get REAL AI grading (gradeSession()).
 * Unlike the ingest cap, exceeding this never blocks finishing a session —
 * it just falls back to the existing heuristic (keyword-overlap) grader, the
 * same path already used when Gemini itself fails. Kept low deliberately:
 * ingest's own cap (INGEST_DAILY_LIMIT) reserves the bulk of the daily Gemini
 * budget for adding new material; this is the always-available slice held
 * back specifically for the review flow so it's never starved by ingest use.
 *
 * Since /recall now runs ONE session per series group, the effective daily cap
 * is per-user dynamic: this base (the "General Knowledge" section) PLUS one slot
 * per story the user has started — so every section they can submit gets a real
 * AI-graded report card. See the finish handler.
 */
const QUIZ_AI_DAILY_BASE = Number(process.env.QUIZ_AI_DAILY_LIMIT || 1);

/**
 * Quiz backend, redesigned to minimise AI calls:
 * - "start":  builds a session from the PRE-GENERATED question bank (0 AI calls)
 * - "answer": persists one answer as it is submitted (0 AI calls)
 * - "finish": ONE batch Gemini call grades every typed answer and writes the
 *             report card; choice questions (mcq / truefalse / multi) are
 *             graded deterministically (0 AI calls)
 */

/** Server-side snapshot of one session question (includes the answers). */
interface SnapshotItem {
  index: number;
  question_id: string | null; // null = synthesized fallback (topic had no bank yet)
  topic_id: string;
  topic_name: string;
  category: string;
  kind: QuestionKind;
  prompt: string;
  options: string[] | null;
  correct_index: number | null;
  correct_indices: number[] | null;
  model_answer: string;
}

interface BankQuestion {
  id: string;
  topic_id: string;
  kind: QuestionKind;
  prompt: string;
  options: string[] | null;
  correct_index: number | null;
  correct_indices: number[] | null;
  model_answer: string;
  difficulty: string;
  times_asked: number;
  last_asked_at: string | null;
}

/** Kinds answered by picking options rather than typing. */
const CHOICE_KINDS = new Set<QuestionKind>(["mcq", "truefalse", "multi"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { action } = body;

  if (action === "start") return start(supabase, user.id, body);
  if (action === "answer") return answer(supabase, user.id, body);
  if (action === "finish") return finish(supabase, user.id, body);

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// ---- start: pick one bank question per topic, no AI ----
async function start(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  body: { topicIds?: unknown }
) {
  const topicIds = Array.isArray(body.topicIds)
    ? (body.topicIds.filter((t) => typeof t === "string") as string[]).slice(0, 12)
    : [];
  if (!topicIds.length) {
    return NextResponse.json({ error: "No topics to review" }, { status: 400 });
  }

  const { data: topicsData } = await supabase
    .from("topics")
    .select("*")
    .eq("user_id", userId)
    .in("id", topicIds);
  const topics = (topicsData ?? []) as Topic[];
  const topicById = new Map(topics.map((t) => [t.id, t]));

  const { data: bankData } = await supabase
    .from("questions")
    .select("*")
    .eq("user_id", userId)
    .in("topic_id", topicIds);
  const bank = (bankData ?? []) as BankQuestion[];
  const bankByTopic = new Map<string, BankQuestion[]>();
  for (const q of bank) {
    const list = bankByTopic.get(q.topic_id) ?? [];
    list.push(q);
    bankByTopic.set(q.topic_id, list);
  }

  const { data: sectionsData } = await supabase
    .from("story_sections")
    .select("topic_id, series_slug, section_slug")
    .eq("user_id", userId)
    .in("topic_id", topicIds);
  
  const storyTopics = new Map((sectionsData ?? []).map(s => [s.topic_id, s]));

  // Strict isolation: if a topic belongs to a story, its quiz pool must ONLY
  // contain questions exactly matching the story's pre-authored seed questions.
  // This prevents user-uploaded notes from leaking into the story's quiz
  // even if they share a topic name.
  for (const [topicId, storySection] of storyTopics.entries()) {
    try {
      const seed = getSeed(storySection.series_slug as string);
      const section = seed.sections.find(s => s.sectionSlug === storySection.section_slug);
      if (section) {
        const validPrompts = new Set(section.questions.map(q => q.prompt));
        const filteredList = (bankByTopic.get(topicId) ?? []).filter(q => validPrompts.has(q.prompt));
        bankByTopic.set(topicId, filteredList);
      }
    } catch { /* ignore if seed not found */ }
  }

  // Rotate desired kinds so every session mixes choice and typed questions.
  const kindRotation: QuestionKind[] = ["open", "mcq", "truefalse", "quickfire", "multi"];
  const snapshot: SnapshotItem[] = [];

  topicIds.forEach((topicId, i) => {
    const topic = topicById.get(topicId);
    if (!topic) return;
    const picked = pickQuestion(bankByTopic.get(topicId) ?? [], topic.review_count, kindRotation[i % kindRotation.length]);
    if (picked) {
      const isChoice = CHOICE_KINDS.has(picked.kind);
      snapshot.push({
        index: snapshot.length,
        question_id: picked.id,
        topic_id: topic.id,
        topic_name: topic.name,
        category: topic.category,
        kind: picked.kind,
        prompt: picked.prompt,
        options: isChoice ? (picked.kind === "truefalse" ? picked.options ?? ["True", "False"] : picked.options) : null,
        correct_index: picked.kind === "mcq" || picked.kind === "truefalse" ? picked.correct_index : null,
        correct_indices: picked.kind === "multi" ? picked.correct_indices : null,
        model_answer: picked.model_answer,
      });
    } else {
      const storySection = storyTopics.get(topic.id);
      let seedQuestion: {
        kind: QuestionKind;
        prompt: string;
        options?: string[] | null;
        correct_index?: number | null;
        correct_indices?: number[] | null;
        model_answer: string;
      } | null = null;

      let fallbackSummary = topic.summary ?? (topic.key_points as string[]).join(" ");

      if (storySection) {
        try {
          const seed = getSeed(storySection.series_slug as string);
          const section = seed.sections.find((s) => s.sectionSlug === storySection.section_slug);
          if (section) {
            fallbackSummary = section.summary;
            if (section.questions && section.questions.length > 0) {
              seedQuestion = section.questions[i % section.questions.length];
            }
          }
        } catch {
          /* ignore if seed not found */
        }
      }

      if (seedQuestion) {
        const isChoice = CHOICE_KINDS.has(seedQuestion.kind);
        snapshot.push({
          index: snapshot.length,
          question_id: null,
          topic_id: topic.id,
          topic_name: topic.name,
          category: topic.category,
          kind: seedQuestion.kind,
          prompt: seedQuestion.prompt,
          options: isChoice
            ? seedQuestion.kind === "truefalse"
              ? seedQuestion.options ?? ["True", "False"]
              : seedQuestion.options ?? null
            : null,
          correct_index:
            seedQuestion.kind === "mcq" || seedQuestion.kind === "truefalse"
              ? seedQuestion.correct_index ?? null
              : null,
          correct_indices: seedQuestion.kind === "multi" ? seedQuestion.correct_indices ?? null : null,
          model_answer: seedQuestion.model_answer,
        });
      } else {
        // Synthesize a prompt whose model answer directly aligns with the question
        snapshot.push({
          index: snapshot.length,
          question_id: null,
          topic_id: topic.id,
          topic_name: topic.name,
          category: topic.category,
          kind: "open",
          prompt: `From memory, explain "${topic.name}" — the core idea, optimal approach, and why it matters.`,
          options: null,
          correct_index: null,
          correct_indices: null,
          model_answer: fallbackSummary,
        });
      }
    }
  });

  if (!snapshot.length) {
    return NextResponse.json({ error: "Topics not found" }, { status: 404 });
  }

  const { data: session, error } = await supabase
    .from("quiz_sessions")
    .insert({ user_id: userId, items: snapshot })
    .select("id")
    .single();
  if (error) {
    const missingTable = error.code === "42P01" || /does not exist/i.test(error.message);
    return NextResponse.json(
      {
        error: missingTable
          ? "Your database is missing the new quiz tables — run the latest supabase/schema.sql in the Supabase SQL editor, then try again."
          : error.message,
      },
      { status: 500 }
    );
  }

  // Client gets the questions WITHOUT correct answers.
  const questions: SessionQuestion[] = snapshot.map((s) => ({
    index: s.index,
    topic_id: s.topic_id,
    topic_name: s.topic_name,
    category: s.category,
    kind: s.kind,
    prompt: s.prompt,
    options: s.options,
  }));
  return NextResponse.json({ id: session.id, questions });
}

/** Least-asked question of the preferred kind and mastery-matched difficulty. */
function pickQuestion(pool: BankQuestion[], reviewCount: number, preferKind: QuestionKind): BankQuestion | null {
  if (!pool.length) return null;
  const tier = reviewCount < 3 ? "basic" : reviewCount < 7 ? "intermediate" : "advanced";
  const freshness = (a: BankQuestion, b: BankQuestion) =>
    a.times_asked - b.times_asked ||
    (a.last_asked_at ?? "").localeCompare(b.last_asked_at ?? "");
  const candidates = [
    pool.filter((q) => q.kind === preferKind && q.difficulty === tier),
    pool.filter((q) => q.kind === preferKind),
    pool.filter((q) => q.difficulty === tier),
    pool,
  ].find((c) => c.length);
  return candidates!.sort(freshness)[0];
}

// ---- answer: save one answer as it's submitted, no AI ----
async function answer(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  body: {
    sessionId?: string;
    questionIndex?: number;
    answer?: string;
    selectedIndex?: number;
    selectedIndices?: number[];
  }
) {
  const { sessionId, questionIndex } = body;
  if (!sessionId || typeof questionIndex !== "number") {
    return NextResponse.json({ error: "Missing sessionId or questionIndex" }, { status: 400 });
  }
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("id, status, items")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.status !== "active") {
    return NextResponse.json({ error: "Session already graded" }, { status: 409 });
  }
  const item = (session.items as SnapshotItem[]).find((s) => s.index === questionIndex);
  if (!item) return NextResponse.json({ error: "Unknown question" }, { status: 400 });

  // Multi-select picks are serialised into the (otherwise unused) answer text
  // column, so the answers table needs no new columns.
  const multiPicks = Array.isArray(body.selectedIndices)
    ? body.selectedIndices.filter((n) => typeof n === "number").slice(0, 20)
    : null;
  const { error } = await supabase.from("quiz_answers").upsert(
    {
      session_id: sessionId,
      user_id: userId,
      question_index: questionIndex,
      topic_id: item.topic_id,
      answer: multiPicks
        ? JSON.stringify(multiPicks)
        : typeof body.answer === "string" ? body.answer.slice(0, 4000) : null,
      selected_index: typeof body.selectedIndex === "number" ? body.selectedIndex : null,
    },
    { onConflict: "session_id,question_index" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// ---- finish: ONE batch AI call → report card, SRS updates, streak ----
async function finish(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  body: { sessionId?: string; tz?: number }
) {
  const { sessionId } = body;
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("id, status, items, report, created_at")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  // Finishing twice (e.g. a retried request) returns the saved report.
  if (session.status === "graded" && session.report) {
    return NextResponse.json(session.report as ReportCard);
  }

  const snapshot = session.items as SnapshotItem[];
  const { data: answersData } = await supabase
    .from("quiz_answers")
    .select("question_index, answer, selected_index")
    .eq("session_id", sessionId);
  const answerByIndex = new Map(
    (answersData ?? []).map((a) => [a.question_index as number, a])
  );

  // Only items the learner actually saw (answered or explicitly skipped) are graded.
  const presented = snapshot.filter((s) => answerByIndex.has(s.index));
  if (!presented.length) {
    return NextResponse.json({ error: "No answers submitted yet" }, { status: 400 });
  }

  // Topic reference material for the grading prompt.
  const { data: topicsData } = await supabase
    .from("topics")
    .select("*")
    .eq("user_id", userId)
    .in("id", Array.from(new Set(presented.map((s) => s.topic_id))));
  const topicById = new Map(((topicsData ?? []) as Topic[]).map((t) => [t.id, t]));

  const toGrade: SessionGradeInput[] = [];
  const items: ReportItem[] = presented.map((s) => {
    const a = answerByIndex.get(s.index)!;
    const base: ReportItem = {
      index: s.index,
      topic_id: s.topic_id,
      topic_name: s.topic_name,
      kind: s.kind,
      prompt: s.prompt,
      answer: null,
      skipped: false,
      correct: null,
      score: 0,
      feedback: "",
      correct_answer: s.model_answer,
      options: s.options,
      selected_index: null,
      correct_index: s.kind === "mcq" || s.kind === "truefalse" ? s.correct_index : null,
      selected_indices: null,
      correct_indices: s.kind === "multi" ? s.correct_indices : null,
    };

    if (s.kind === "mcq" || s.kind === "truefalse") {
      const sel = typeof a.selected_index === "number" ? a.selected_index : null;
      base.selected_index = sel;
      base.answer = sel !== null && s.options ? s.options[sel] ?? null : null;
      if (sel === null) {
        base.skipped = true;
        base.feedback = "You skipped this one — no harm done, it'll come back around.";
      } else {
        base.correct = sel === s.correct_index;
        base.score = base.correct ? 5 : 1;
        base.feedback = base.correct
          ? "Correct — you picked the right option."
          : `Not quite — the right answer was "${s.options?.[s.correct_index ?? 0] ?? ""}".`;
      }
      if (s.options && s.correct_index !== null) {
        base.correct_answer = s.options[s.correct_index] ?? s.model_answer;
      }
      return base;
    }

    if (s.kind === "multi") {
      let sel: number[] | null = null;
      try {
        const parsed = JSON.parse(a.answer ?? "");
        if (Array.isArray(parsed)) sel = parsed.filter((n): n is number => typeof n === "number");
      } catch { /* skipped or malformed → treated as skip */ }
      const key = s.correct_indices ?? [];
      base.selected_indices = sel;
      base.answer =
        sel && s.options ? sel.map((i) => s.options![i]).filter(Boolean).join(" · ") || null : null;
      base.correct_answer =
        key.length && s.options
          ? key.map((i) => s.options![i]).filter(Boolean).join(" · ")
          : s.model_answer;
      if (!sel || sel.length === 0) {
        base.skipped = true;
        base.feedback = "You skipped this one — no harm done, it'll come back around.";
      } else {
        const hits = sel.filter((i) => key.includes(i)).length;
        const wrong = sel.length - hits;
        base.correct = hits === key.length && wrong === 0;
        base.score = base.correct
          ? 5
          : Math.max(0, Math.min(4, Math.round((5 * Math.max(0, hits - wrong)) / Math.max(1, key.length))));
        base.feedback = base.correct
          ? "Correct — you picked every right option."
          : hits > 0
            ? `Partly right — you found ${hits} of ${key.length} correct option${key.length === 1 ? "" : "s"}${wrong ? ` but also picked ${wrong} wrong one${wrong === 1 ? "" : "s"}` : ""}.`
            : "Not quite — none of your picks were correct this time.";
      }
      return base;
    }

    const typed = (a.answer ?? "").trim();
    base.answer = typed || null;
    if (!typed) {
      base.skipped = true;
      base.feedback = "You skipped this one — no harm done, it'll come back around.";
      return base;
    }
    const topic = topicById.get(s.topic_id);
    toGrade.push({
      index: s.index,
      topic: s.topic_name,
      summary: topic?.summary ?? null,
      key_points: (topic?.key_points as string[]) ?? [],
      question: s.prompt,
      reference_answer: s.model_answer || null,
      answer: typed,
    });
    return base;
  });

  // THE one AI call — skipped entirely if every answer was MCQ or skipped.
  let summary = "";
  let strengths: string[] = [];
  let focus: string[] = [];
  let usedAi = false;
  if (toGrade.length) {
    // Daily AI-grading budget: count today's sessions that already got a real
    // gradeSession() call. Never blocks finishing — just silently downgrades
    // to the same heuristic fallback used when Gemini itself fails.
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const { count: aiGradedToday } = await supabase
      .from("quiz_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("ai_graded", true)
      .gte("graded_at", dayStart.toISOString());
    // Daily budget = base (General Knowledge section) + one slot per started
    // story, so each series section a user submits can get a real AI grade.
    const { count: startedStories } = await supabase
      .from("user_stories")
      .select("series_slug", { count: "exact", head: true })
      .eq("user_id", userId);
    const dailyLimit = QUIZ_AI_DAILY_BASE + (startedStories ?? 0);
    const budgetAvailable = (aiGradedToday ?? 0) < dailyLimit;

    if (budgetAvailable) {
      try {
        const graded = await gradeSession(toGrade);
        for (const g of graded.grades) {
          const item = items.find((i) => i.index === g.index);
          if (!item) continue;
          item.score = Math.max(0, Math.min(5, Math.round(g.score)));
          item.feedback = g.feedback;
          if (g.correct_answer) item.correct_answer = g.correct_answer;
        }
        summary = graded.summary;
        strengths = graded.strengths ?? [];
        focus = graded.focus ?? [];
        usedAi = true;
      } catch (e) {
        console.error("Batch grading failed, using heuristic fallback", e);
      }
    }
    if (!usedAi) {
      // Either Gemini failed above, or today's AI-grading budget is spent —
      // keyword-overlap fallback keeps the session finishable either way.
      for (const g of toGrade) {
        const item = items.find((i) => i.index === g.index)!;
        item.score = heuristicScore(g.answer, g.key_points);
        item.feedback =
          item.score >= 4
            ? "Strong answer — you hit the key ideas. (AI grading was unavailable, so this was scored by keyword match.)"
            : "You've got part of it, but some key points seem missing. (AI grading was unavailable, so this was scored by keyword match.)";
      }
    }
  }

  const attempted = items.filter((i) => !i.skipped);
  const scorePct = attempted.length
    ? Math.round((attempted.reduce((s, i) => s + i.score, 0) / (attempted.length * 5)) * 100)
    : 0;
  if (!summary) {
    summary =
      scorePct >= 80
        ? "Excellent session — your recall is sharp across the board. Keep the rhythm going."
        : scorePct >= 50
          ? "Solid session — the core ideas are there, with a few gaps worth another pass."
          : "Tough session, and that's fine — effortful recall is exactly what rewires memory. These topics will come back sooner.";
  }

  // SRS: one update per topic from its average score this session.
  const byTopic = new Map<string, number[]>();
  for (const i of attempted) {
    byTopic.set(i.topic_id, [...(byTopic.get(i.topic_id) ?? []), i.score]);
  }
  for (const [topicId, scores] of byTopic) {
    const topic = topicById.get(topicId);
    if (!topic) continue;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const srs = scheduleNext(
      { ease: topic.ease, interval_days: topic.interval_days, review_count: topic.review_count },
      avg
    );
    await supabase
      .from("topics")
      .update({
        ease: srs.ease,
        interval_days: srs.interval_days,
        review_count: srs.review_count,
        next_review_at: srs.next_review_at,
        last_reviewed_at: new Date().toISOString(),
        mastery: 0,
      })
      .eq("id", topicId);
  }

  // Review history (drives the calendar/heatmap) — one row per attempted question.
  // A failed insert here must not go unnoticed: the plan's done-tracking and the
  // calendar both feed off these rows (last_reviewed_at is the safety net).
  if (attempted.length) {
    const { error: revErr } = await supabase.from("reviews").insert(
      attempted.map((i) => ({
        user_id: userId,
        topic_id: i.topic_id,
        mode: i.kind === "open" ? "recall" : "quickfire",
        score: i.score,
        question: i.prompt,
        answer: i.answer,
        feedback: i.feedback,
      }))
    );
    if (revErr) {
      console.error("reviews insert failed — calendar/history will miss this session", revErr);
    }
  }

  // RAG: index the learner's own typed answers so their recall becomes part of
  // the retrievable knowledge base. Choice picks carry no prose, so skip them.
  const typedAnswers = items
    .filter((i) => !i.skipped && i.answer && (i.kind === "open" || i.kind === "quickfire"))
    .map((i) => ({ text: i.answer as string, topicId: i.topic_id }));
  if (typedAnswers.length) await indexAnswers(supabase, userId, typedAnswers);

  // Rotate the bank: bump usage so the next session picks fresher questions.
  const usedIds = presented.map((s) => s.question_id).filter(Boolean) as string[];
  if (usedIds.length) {
    const { data: used } = await supabase
      .from("questions")
      .select("id, times_asked")
      .in("id", usedIds);
    for (const q of used ?? []) {
      await supabase
        .from("questions")
        .update({ times_asked: (q.times_asked ?? 0) + 1, last_asked_at: new Date().toISOString() })
        .eq("id", q.id);
    }
  }

  // The streak advances on every session with at least one attempted answer.
  if (attempted.length) await advanceStreak(supabase, userId, clampTz(body.tz));

  const report: ReportCard = {
    session_id: sessionId,
    date: localTodayForOffset(clampTz(body.tz)),
    score_pct: scorePct,
    summary,
    strengths,
    focus,
    items,
  };

  await supabase
    .from("quiz_sessions")
    .update({ status: "graded", report, graded_at: new Date().toISOString(), ai_graded: usedAi })
    .eq("id", sessionId);

  return NextResponse.json(report);
}

function heuristicScore(answer: string, keyPoints: string[]): number {
  const a = answer.toLowerCase();
  const hits = keyPoints.filter((k) =>
    k.toLowerCase().split(/\W+/).filter((w) => w.length > 4).some((w) => a.includes(w))
  ).length;
  const lengthOk = answer.trim().split(/\s+/).length >= 8;
  return Math.min(5, Math.max(1, hits + (lengthOk ? 2 : 0)));
}
