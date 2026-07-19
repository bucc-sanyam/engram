"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Nav from "@/components/Nav";
import ReportCardView, { KIND_LABEL } from "@/components/ReportCardView";
import {
  finishQuiz,
  getPlan,
  markPlanCompleted,
  saveQuizAnswer,
  startQuiz,
  getLatestReportToday,
} from "@/lib/data";
import { getAllStorySections } from "@/lib/stories";
import type {
  DailyPlan,
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

type Phase =
  | "loading"
  | "question"
  | "finishing"
  | "report"
  | "finished"
  | "empty";

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

  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  
  const [groupedQuestions, setGroupedQuestions] = useState<Map<string, { topicName: string, q: SessionQuestion }[]>>(new Map());
  const [groupedReports, setGroupedReports] = useState<Map<string, ReportCard>>(new Map());
  
  const [answers, setAnswers] = useState<Record<number, { answer?: string, selectedIndex?: number, selectedIndices?: number[] }>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [singleTask, setSingleTask] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPhase("loading");
    setError(null);

    Promise.all([getPlan(), getAllStorySections()])
      .then(async ([full, sections]) => {
        if (cancelled) return;
        
        const seriesByTopicId = new Map<string, string>();
        for (const s of sections) {
          if (s.topic_id) seriesByTopicId.set(s.topic_id, s.series_slug);
        }

        let p: DailyPlan = full;
        if (seriesParam) {
          if (seriesParam === "general") {
            p = { ...full, items: full.items.filter(it => !seriesByTopicId.get(it.topic_id)) };
          } else {
            p = { ...full, items: full.items.filter(it => seriesByTopicId.get(it.topic_id) === seriesParam) };
          }
        }
        
        setSingleTask(!!seriesParam);
        setPlan(p);

        if (p.items.length === 0) {
          setPhase("empty");
          return;
        }

        // Only start quiz for pending items
        const pendingItems = p.items.filter(it => !it.done);
        if (pendingItems.length === 0) {
          // All done!
          if (!seriesParam && full.completed) {
            try {
               const rep = await getLatestReportToday();
               if (rep && !cancelled) {
                 groupAndSetReport(rep, seriesByTopicId);
                 setPhase("report");
                 return;
               }
            } catch {}
          }
          setPhase("finished");
          return;
        }

        try {
          const quiz = await startQuiz(pendingItems.map(it => it.topic_id));
          if (cancelled) return;
          setSession(quiz);
          
          const groups = new Map<string, { topicName: string, q: SessionQuestion }[]>();
          for (const q of quiz.questions) {
            const slug = seriesByTopicId.get(q.topic_id) || "general";
            const topicName = p.items.find(it => it.topic_id === q.topic_id)?.topic_name || "Unknown";
            if (!groups.has(slug)) groups.set(slug, []);
            groups.get(slug)!.push({ topicName, q });
          }
          setGroupedQuestions(groups);
          setPhase("question");
        } catch (e) {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : "Couldn't start the quiz session");
            setPhase("empty");
          }
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError("Failed to load plan.");
          setPhase("empty");
        }
      });
      
    return () => { cancelled = true; };
  }, [seriesParam]);

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

  function handleAnswerChange(qIndex: number, val: { answer?: string, selectedIndex?: number, selectedIndices?: number[] }) {
    setAnswers(prev => ({ ...prev, [qIndex]: val }));
  }

  function toggleMulti(qIndex: number, optIndex: number) {
    setAnswers(prev => {
      const cur = prev[qIndex]?.selectedIndices || [];
      const next = cur.includes(optIndex) ? cur.filter(x => x !== optIndex) : [...cur, optIndex];
      return { ...prev, [qIndex]: { ...prev[qIndex], selectedIndices: next } };
    });
  }

  async function submitSession() {
    if (!session || saving) return;
    setSaving(true);
    setError(null);
    
    try {
      // Save all answers
      for (const [slug, qs] of Array.from(groupedQuestions.entries())) {
        for (const { q } of qs) {
          const ans = answers[q.index] || {};
          const isSingleChoice = q.kind === "mcq" || q.kind === "truefalse";
          const isMulti = q.kind === "multi";
          
          await saveQuizAnswer({
            sessionId: session.id,
            questionIndex: q.index,
            answer: isSingleChoice || isMulti ? undefined : (ans.answer || ""),
            selectedIndex: isSingleChoice ? (ans.selectedIndex ?? undefined) : undefined,
            selectedIndices: isMulti && ans.selectedIndices?.length ? [...ans.selectedIndices].sort((a,b)=>a-b) : undefined,
          });
        }
      }
      
      setPhase("finishing");
      const r = await finishQuiz(session.id);
      
      // We need seriesByTopicId to group the report card!
      const sections = await getAllStorySections();
      const seriesByTopicId = new Map<string, string>();
      for (const s of sections) {
        if (s.topic_id) seriesByTopicId.set(s.topic_id, s.series_slug);
      }
      groupAndSetReport(r, seriesByTopicId);
      
      if (!singleTask) {
        try {
          const p = await getPlan();
          if (p.items.length > 0 && p.items.every(it => it.done) && !p.completed) {
            await markPlanCompleted();
          }
        } catch {}
      }
      setPhase("report");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save answers");
      setPhase("question");
    } finally {
      setSaving(false);
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

        {phase === "question" && (
          <div className="space-y-12 rise">
            {Array.from(groupedQuestions.entries()).map(([slug, qs]) => (
              <div key={slug} className="space-y-6">
                <h2 className="text-2xl font-bold text-white/90 px-2 pb-2 border-b border-white/10">
                  {SERIES_TITLES[slug] ?? slug}
                </h2>
                
                {qs.map(({ topicName, q }) => {
                  const ans = answers[q.index] || {};
                  return (
                    <div key={q.index} className="glass p-6 sm:p-8">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="micro rounded-full bg-white/[0.05] px-3 py-1">
                          {KIND_LABEL[q.kind] ?? q.kind}
                        </span>
                        <span className="text-xs font-medium text-faint">
                          {topicName}
                        </span>
                      </div>
                      
                      <p className="mb-5 text-lg font-medium leading-relaxed">{q.prompt}</p>

                      {q.kind === "truefalse" && q.options ? (
                        <div className="grid grid-cols-2 gap-4">
                          {q.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleAnswerChange(q.index, { selectedIndex: i })}
                              disabled={saving}
                              className={`rounded-2xl border py-4 text-center text-base font-bold transition-all ${
                                ans.selectedIndex === i
                                  ? "border-[#f5b95f]/60 bg-[#f5b95f]/[0.1] text-white"
                                  : "border-white/[0.07] bg-white/[0.03] text-white/80 hover:border-white/[0.15] hover:bg-white/[0.05]"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : q.kind === "mcq" && q.options ? (
                        <div className="space-y-2.5">
                          {q.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleAnswerChange(q.index, { selectedIndex: i })}
                              disabled={saving}
                              className={`block w-full rounded-2xl border px-4 py-3.5 text-left text-[15px] leading-relaxed transition-all ${
                                ans.selectedIndex === i
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
                      ) : q.kind === "multi" && q.options ? (
                        <div className="space-y-2.5">
                          <p className="micro !text-[#f5b95f]">Select all that apply</p>
                          {q.options.map((opt, i) => {
                            const picked = (ans.selectedIndices || []).includes(i);
                            return (
                              <button
                                key={i}
                                onClick={() => toggleMulti(q.index, i)}
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
                          value={ans.answer || ""}
                          onChange={(e) => handleAnswerChange(q.index, { answer: e.target.value })}
                          disabled={saving}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            
            <div className="pt-6 flex justify-center">
              <button
                className="btn-primary px-12 py-4 text-lg"
                onClick={submitSession}
                disabled={saving}
              >
                {saving ? "Grading answers..." : "Submit All →"}
              </button>
            </div>
            {error && <p className="text-center mt-3 text-sm text-danger">{error}</p>}
          </div>
        )}

        {phase === "report" && (
          <div className="space-y-12 rise">
            {Array.from(groupedReports.entries()).map(([slug, rep]) => (
              <div key={slug} className="space-y-6">
                <h2 className="text-2xl font-bold text-white/90 px-2 pb-2 border-b border-white/10">
                  {SERIES_TITLES[slug] ?? slug}
                </h2>
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

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
