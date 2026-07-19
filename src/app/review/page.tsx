"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import ReportCardView, { KIND_LABEL } from "@/components/ReportCardView";
import QuestionWidget from "@/components/QuestionWidget";
import { demoQuestionBank } from "@/lib/demo";
import {
  finishQuiz,
  getPlan,
  markPlanCompleted,
  saveQuizAnswer,
  startQuiz,
  getTodayReviewDetail,
  getLatestReportToday,
} from "@/lib/data";
import { getAllStorySections } from "@/lib/stories";
import type {
  DailyPlan,
  PlanItem,
  QuizSession,
  ReportCard,
  SessionQuestion,
} from "@/lib/types";
import { categoryColor } from "@/lib/types";

const SERIES_TITLES: Record<string, string> = {
  "competition-act": "Legal Series",
  "dsa": "DSA Series",
  "sql": "SQL Series",
  "general": "General Knowledge",
};

const SERIES_COLORS: Record<string, string> = {
  "competition-act": "#5ba4cf",
  "dsa": "#f5b95f",
  "sql": "#22d3ee",
  "general": "#9aa0aa",
};

/** On-brand section header for a review group (colour-coded per series). */
function GroupHeader({ slug }: { slug: string }) {
  const color = SERIES_COLORS[slug] ?? "#9aa0aa";
  return (
    <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-2.5">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      <h2 className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color }}>
        {SERIES_TITLES[slug] ?? slug}
      </h2>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<ReviewFallback />}>
      <ReviewRunner />
    </Suspense>
  );
}

function ReviewFallback() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-8 sm:px-6 md:pb-16">
        <div className="glass rise flex items-center justify-center gap-3 p-16 text-muted">
          <Spinner /> Preparing your next challenge…
        </div>
      </main>
    </>
  );
}

function ReviewRunner() {
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get("series");
  const topicId = searchParams.get("topic"); // Legacy deep link support

  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [phase, setPhase] = useState<"loading" | "quizzing" | "finishing" | "report" | "finished" | "empty">("loading");
  
  const [groupedItems, setGroupedItems] = useState<Map<string, PlanItem[]>>(new Map());
  const [completedGroups, setCompletedGroups] = useState<Set<string>>(new Set());
  
  const [groupedReports, setGroupedReports] = useState<Map<string, ReportCard>>(new Map());
  
  const [error, setError] = useState<string | null>(null);
  const [singleTask, setSingleTask] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPhase("loading");
    setError(null);
    setCompletedGroups(new Set());

    Promise.all([getPlan(), getAllStorySections()])
      .then(async ([full, sections]) => {
        if (cancelled) return;
        
        const seriesByTopicId = new Map<string, string>();
        for (const s of sections) {
          if (s.topic_id) seriesByTopicId.set(s.topic_id, s.series_slug);
        }

        // Handle full report check
        if (full.completed && !topicId && !seriesParam) {
          try {
            const latestReport = await getLatestReportToday();
            if (latestReport) {
              if (cancelled) return;
              groupAndSetReport(latestReport, seriesByTopicId);
              setPhase("report");
              return;
            }
          } catch {}
        }

        let p: DailyPlan = full;
        const isMatched = !!topicId && full.items.some(it => it.topic_id === topicId);
        
        if (isMatched) {
          p = { ...full, items: full.items.filter((it) => it.topic_id === topicId) };
          setSingleTask(true);
        } else if (seriesParam) {
          if (seriesParam === "general") {
            p = { ...full, items: full.items.filter(it => !seriesByTopicId.get(it.topic_id)) };
          } else {
            p = { ...full, items: full.items.filter(it => seriesByTopicId.get(it.topic_id) === seriesParam) };
          }
          setSingleTask(true); // Don't complete the full day if just doing one series
        } else {
          // Normal run: sort pending first
          p = { ...full, items: [...full.items].sort((a, b) => Number(!!a.done) - Number(!!b.done)) };
          setSingleTask(false);
        }
        
        setPlan(p);
        if (p.items.length === 0) {
          setPhase("empty");
          return;
        }

        // Group items
        const groups = new Map<string, PlanItem[]>();
        for (const item of p.items) {
          const slug = seriesByTopicId.get(item.topic_id) || "general";
          if (!groups.has(slug)) groups.set(slug, []);
          groups.get(slug)!.push(item);
        }
        setGroupedItems(groups);

        const pendingIds = p.items.filter(it => !it.done).map(it => it.topic_id);
        let quiz: QuizSession | null = null;
        if (pendingIds.length > 0) {
          try {
            quiz = await startQuiz(pendingIds);
          } catch (e) {
            if (!cancelled) {
              setError(e instanceof Error ? e.message : "Couldn't start the quiz session");
              // Even if it failed, we can still show 'already done' items if any, 
              // but if all are pending, it's an error.
            }
          }
        }
        
        if (cancelled) return;
        setSession(quiz);
        setPhase("quizzing");
      })
      .catch((e) => {
        if (!cancelled) {
          setError("Failed to load plan.");
          setPhase("empty");
        }
      });
      
    return () => { cancelled = true; };
  }, [seriesParam, topicId]);

  function groupAndSetReport(rep: ReportCard, seriesByTopicId: Map<string, string>) {
    const groups = new Map<string, ReportCard>();
    for (const item of rep.items) {
      const slug = seriesByTopicId.get(item.topic_id) || "general";
      if (!groups.has(slug)) {
        groups.set(slug, { ...rep, items: [], score_pct: 0, strengths: [], focus: [] });
      }
      groups.get(slug)!.items.push(item);
    }
    
    // Recalculate score per group
    for (const [slug, group] of Array.from(groups.entries())) {
      group.score_pct = Math.round(group.items.reduce((acc, it) => acc + (it.score || 0), 0) / group.items.length * 20);
      group.strengths = group.items.filter(it => (it.score || 0) >= 4).map(it => it.topic_name);
      group.focus = group.items.filter(it => (it.score || 0) < 4).map(it => it.topic_name);
    }
    
    setGroupedReports(groups);
  }

  const handleGroupComplete = useCallback(async (slug: string, answeredCount: number) => {
    setCompletedGroups(prev => {
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
  }, []);
  
  // Watch for all groups completed
  useEffect(() => {
    if (phase !== "quizzing") return;
    if (groupedItems.size === 0) return;
    if (completedGroups.size === groupedItems.size) {
      finalize();
    }
  }, [completedGroups, groupedItems, phase]);

  async function finalize() {
    setPhase("finishing");
    try {
      if (session) {
        const r = await finishQuiz(session.id);
        const sections = await getAllStorySections();
        const seriesByTopicId = new Map<string, string>();
        for (const s of sections) {
          if (s.topic_id) seriesByTopicId.set(s.topic_id, s.series_slug);
        }
        groupAndSetReport(r, seriesByTopicId);
        setPhase("report");
      } else {
        setPhase("finished"); // all were already done
      }
      
      if (!singleTask) {
        try {
          const p = await getPlan();
          if (p.items.length > 0 && p.items.every(it => it.done) && !p.completed) {
            await markPlanCompleted();
          }
        } catch {}
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't build your report card");
      setPhase("finished");
    }
  }

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-8 sm:px-6 md:pb-16">
        {phase === "empty" && (
          <div className="glass rise p-8 text-center">
            <h1 className="mb-2 text-xl font-bold">Nothing to revise yet</h1>
            <p className="mb-5 text-muted">{error || "Log some learnings first and come back."}</p>
            <Link href="/" className="btn-primary">Go to Dashboard</Link>
          </div>
        )}

        {phase === "loading" && (
          <div className="glass rise flex items-center justify-center gap-3 p-16 text-muted">
            <Spinner /> Preparing your next challenge…
          </div>
        )}

        {phase === "finishing" && (
          <div className="glass rise flex flex-col items-center justify-center gap-3 p-16 text-muted">
            <Spinner />
            <p className="font-medium text-white/85">Building your report card…</p>
            <p className="text-sm">One pass over all your answers — grading, feedback, the lot.</p>
          </div>
        )}

        {phase === "quizzing" && plan && (
          <div className="space-y-12 rise">
            {error && !session && <p className="text-danger text-center">{error}</p>}
            
            {Array.from(groupedItems.entries()).map(([slug, items]) => (
              <div key={slug} className="space-y-4">
                {groupedItems.size > 1 && <GroupHeader slug={slug} />}

                {completedGroups.has(slug) ? (
                  <div className="glass rise p-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#43d6b5]/[0.12] text-xl text-[#43d6b5]">
                      ✓
                    </div>
                    <h3 className="text-lg font-bold">Section Complete</h3>
                    <p className="text-sm text-muted">You have finished {SERIES_TITLES[slug] ?? slug} for today.</p>
                  </div>
                ) : (
                  <QuizCarousel 
                    items={items}
                    session={session}
                    onComplete={(ansCount) => handleGroupComplete(slug, ansCount)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {phase === "report" && (
          <div className="space-y-12 rise">
            {Array.from(groupedReports.entries()).map(([slug, rep]) => (
              <div key={slug} className="space-y-6">
                {groupedReports.size > 1 && <GroupHeader slug={slug} />}
                <ReportCardView report={rep} />
              </div>
            ))}
            
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-primary">Back to dashboard</Link>
              <Link href="/brain" className="btn-ghost">Explore your brain</Link>
            </div>
          </div>
        )}

        {phase === "finished" && (
          <div className="glass rise p-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] text-4xl shadow-[0_0_50px_rgba(255,122,92,0.5)]">
              🏆
            </div>
            <h1 className="mb-2 text-2xl font-bold">Session complete!</h1>
            {error && <p className="mb-3 text-sm text-danger">{error}</p>}
            <p className="mb-8 text-muted">
              Every recall today just made the forgetting curve flatter.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-primary">Back to dashboard</Link>
              <Link href="/brain" className="btn-ghost">Explore your brain</Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function QuizCarousel({
  items,
  session,
  onComplete,
}: {
  items: PlanItem[];
  session: QuizSession | null;
  onComplete: (answeredCount: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"loading" | "question" | "already-done">("loading");
  
  const [question, setQuestion] = useState<SessionQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [multiSelected, setMultiSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  
  const [error, setError] = useState<string | null>(null);
  const [doneDetail, setDoneDetail] = useState<{
    question: string;
    userAnswer: string;
    storedAnswer: string;
    feedback?: string;
  } | null>(null);
  
  const item = items[index];

  const loadItem = useCallback(async (i: number) => {
    const it = items[i];
    if (!it) return;
    
    setError(null);
    setAnswer("");
    setSelected(null);
    setMultiSelected([]);
    setQuestion(null);
    setDoneDetail(null);

    if (it.done) {
      setPhase("loading");
      try {
        const detail = await getTodayReviewDetail(it.topic_id);
        if (detail) {
          setDoneDetail(detail);
        }
      } catch { /* fallback */ }
      setPhase("already-done");
      return;
    }

    setPhase("loading");

    const bankQuestion = session?.questions.find((q) => q.topic_id === it.topic_id) ?? null;

    if (bankQuestion) {
      setQuestion(bankQuestion);
      setPhase("question");
    } else {
      setError("No question available for this topic yet — add more learnings to grow the bank.");
      setPhase("question");
    }
  }, [items, session]);

  useEffect(() => {
    loadItem(0);
  }, [loadItem]);

  function next() {
    if (index + 1 < items.length) {
      setIndex(index + 1);
      loadItem(index + 1);
    } else {
      onComplete(answeredCount);
    }
  }

  async function submitCurrent(skip = false) {
    if (!question || !session || saving) return;
    setSaving(true);
    setError(null);
    
    const isSingleChoice = question.kind === "mcq" || question.kind === "truefalse";
    const isMulti = question.kind === "multi";
    
    try {
      await saveQuizAnswer({
        sessionId: session.id,
        questionIndex: question.index,
        answer: isSingleChoice || isMulti ? undefined : skip ? "" : answer,
        selectedIndex: isSingleChoice && !skip ? selected ?? undefined : undefined,
        selectedIndices: isMulti && !skip && multiSelected.length ? [...multiSelected].sort((a, b) => a - b) : undefined,
      });
      setAnsweredCount(c => c + 1);
      setSaving(false);
      next();
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : "Couldn't save your answer");
    }
  }

  function toggleMulti(i: number) {
    setMultiSelected((cur) => cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]);
  }

  const canSubmit = !!question && (question.kind === "mcq" || question.kind === "truefalse"
    ? selected !== null
    : question.kind === "multi" ? multiSelected.length > 0 : answer.trim().length > 0);

  const pendingCount = items.filter(it => !it.done).length;
  const progress = items.length ? (index / items.length) * 100 : 0;

  if (!item) return null;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="rise mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted">
            {index + 1} of {items.length}
            {pendingCount < items.length && (
              <span className="ml-2 text-xs opacity-60">· {pendingCount} to answer</span>
            )}
          </span>
          <span className="micro !text-[#f5b95f]">
            Answers are graded together at the end
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ff7a5c] to-[#f5b95f] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {phase === "loading" && (
        <div className="glass rise flex items-center justify-center gap-3 p-16 text-muted">
          <Spinner />
        </div>
      )}

      {/* Topic header */}
      {["question", "already-done"].includes(phase) && (
        <div className="rise mb-4 flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: categoryColor(item.category), boxShadow: `0 0 8px ${categoryColor(item.category)}` }}
          />
          <span className="font-semibold">{item.topic_name}</span>
          <span className="micro rounded-full bg-white/[0.05] px-3 py-1">
            {phase === "already-done" ? "Done today" : KIND_LABEL[question?.kind ?? "open"]}
          </span>
          {item.done && (
            <span className="micro ml-auto rounded-full bg-[#43d6b5]/[0.12] px-3 py-1 text-[#7fe5cb]">
              ✓ Reviewed
            </span>
          )}
        </div>
      )}

      {/* Already-done card */}
      {phase === "already-done" && (
        <div className="glass rise p-6 space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#43d6b5]/[0.12] text-xl text-[#43d6b5]">✓</div>
            <h2 className="text-lg font-bold">Already reviewed today</h2>
            <p className="text-xs text-muted">Here is your attempt from earlier today.</p>
          </div>

          {doneDetail ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-white/[0.02] p-4 border border-white/[0.04]">
                <p className="micro mb-1.5 !text-faint">Question Prompt</p>
                <p className="text-sm font-medium leading-relaxed text-white/90">{doneDetail.question}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-4 border border-white/[0.05]">
                <p className="micro mb-1.5 !text-[#ff9a80]">Your Answer</p>
                <p className="text-sm leading-relaxed text-white/80">{doneDetail.userAnswer}</p>
              </div>
              <div className="rounded-xl bg-[#43d6b5]/[0.04] p-4 border border-[#43d6b5]/[0.08]">
                <p className="micro mb-1.5 !text-[#43d6b5]">Stored Model Answer</p>
                <p className="text-sm leading-relaxed text-muted">{doneDetail.storedAnswer}</p>
              </div>
              {doneDetail.feedback && (
                <div className="rounded-xl bg-[#f5b95f]/[0.04] p-4 border border-[#f5b95f]/[0.08]">
                  <p className="micro mb-1.5 !text-[#f5b95f]">Feedback</p>
                  <p className="text-sm leading-relaxed text-muted">{doneDetail.feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-muted">You covered <span className="font-semibold text-white/85">{item.topic_name}</span> earlier.</p>
          )}
          <div className="flex justify-center pt-2">
            <button className="btn-primary" onClick={next}>
              {index + 1 < items.length ? "Next topic →" : "Finish section →"}
            </button>
          </div>
        </div>
      )}

      {/* Question */}
      {phase === "question" && question && (
        <div className="glass rise p-6">
          <p className="mb-5 text-lg font-medium leading-relaxed">{question.prompt}</p>

          {question.kind === "truefalse" && question.options ? (
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  disabled={saving}
                  className={`rounded-2xl border py-4 text-center text-base font-bold transition-all ${
                    selected === i
                      ? "border-[#f5b95f]/60 bg-[#f5b95f]/[0.1] text-white"
                      : "border-white/[0.07] bg-white/[0.03] text-white/80 hover:border-white/[0.15] hover:bg-white/[0.05]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : question.kind === "mcq" && question.options ? (
            <div className="space-y-2.5">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  disabled={saving}
                  className={`block w-full rounded-2xl border px-4 py-3.5 text-left text-[15px] leading-relaxed transition-all ${
                    selected === i
                      ? "border-[#f5b95f]/60 bg-[#f5b95f]/[0.1] text-white"
                      : "border-white/[0.07] bg-white/[0.03] text-white/80 hover:border-white/[0.15] hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.07] text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          ) : question.kind === "multi" && question.options ? (
            <div className="space-y-2.5">
              <p className="micro !text-[#f5b95f]">Select all that apply</p>
              {question.options.map((opt, i) => {
                const picked = multiSelected.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleMulti(i)}
                    disabled={saving}
                    className={`block w-full rounded-2xl border px-4 py-3.5 text-left text-[15px] leading-relaxed transition-all ${
                      picked
                        ? "border-[#f5b95f]/60 bg-[#f5b95f]/[0.1] text-white"
                        : "border-white/[0.07] bg-white/[0.03] text-white/80 hover:border-white/[0.15] hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className={`mr-3 inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${picked ? "bg-[#f5b95f] text-[#1a120e]" : "bg-white/[0.07]"}`}>
                      {picked ? "✓" : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              className="input min-h-[140px] resize-y"
              placeholder="Answer from memory — no peeking."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={saving}
            />
          )}

          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          <div className="mt-4 flex justify-between">
            <button className="btn-ghost text-sm" onClick={() => submitCurrent(true)} disabled={saving}>Skip</button>
            <button className="btn-primary" onClick={() => submitCurrent(false)} disabled={saving || !canSubmit}>
              {saving ? <><Spinner /> Saving…</> : index + 1 < items.length ? "Save & next →" : "Save section →"}
            </button>
          </div>
        </div>
      )}
      
      {phase === "question" && !question && (
        <div className="glass rise p-8 text-center">
          <h2 className="mb-2 text-lg font-bold">Couldn&apos;t load this question</h2>
          <p className="mb-6 text-sm text-danger">{error ?? "Something went wrong."}</p>
          <button className="btn-ghost text-sm" onClick={next}>Skip this topic</button>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
