"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import ReportCardView, { KIND_LABEL } from "@/components/ReportCardView";
import {
  finishQuiz,
  markPlanCompleted,
  saveQuizAnswer,
  startQuiz,
  getTodayReviewDetail,
  getLatestReportToday,
} from "@/lib/data";
import { getPlanCached, getStorySectionsCached } from "@/lib/prefetch";
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
  "psychopaths-and-savages": "Psychology Series",
  "general": "General Knowledge",
};

const SERIES_COLORS: Record<string, string> = {
  "competition-act": "#5ba4cf",
  "dsa": "#f5b95f",
  "sql": "#22d3ee",
  "psychopaths-and-savages": "#d94f5c",
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

  const [phase, setPhase] = useState<"loading" | "quizzing" | "report" | "empty">("loading");

  // Live flow: each series group runs its OWN independent session so a report
  // card appears the moment THAT section is submitted (topic-wise reports).
  const [groupedItems, setGroupedItems] = useState<Map<string, PlanItem[]>>(new Map());
  const [sessionsByGroup, setSessionsByGroup] = useState<Map<string, QuizSession | null>>(new Map());
  const [completedGroups, setCompletedGroups] = useState<Set<string>>(new Set());

  // Revisit flow: day already done → show the merged report, grouped by series.
  const [groupedReports, setGroupedReports] = useState<Map<string, ReportCard>>(new Map());

  const [error, setError] = useState<string | null>(null);
  const [singleTask, setSingleTask] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPhase("loading");
    setError(null);
    setCompletedGroups(new Set());
    setGroupedReports(new Map());

    Promise.all([getPlanCached(), getStorySectionsCached()])
      .then(async ([full, sections]) => {
        if (cancelled) return;

        const seriesByTopicId = new Map<string, string>();
        for (const s of sections) {
          if (s.topic_id) seriesByTopicId.set(s.topic_id, s.series_slug);
        }

        // Revisit: whole day already complete → show grouped merged report
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
        const isMatched = !!topicId && full.items.some((it) => it.topic_id === topicId);

        if (isMatched) {
          p = { ...full, items: full.items.filter((it) => it.topic_id === topicId) };
          setSingleTask(true);
        } else if (seriesParam) {
          if (seriesParam === "general") {
            p = { ...full, items: full.items.filter((it) => !seriesByTopicId.get(it.topic_id)) };
          } else {
            p = { ...full, items: full.items.filter((it) => seriesByTopicId.get(it.topic_id) === seriesParam) };
          }
          setSingleTask(true); // Don't complete the full day if just doing one series
        } else {
          // Normal run: sort pending first
          p = { ...full, items: [...full.items].sort((a, b) => Number(!!a.done) - Number(!!b.done)) };
          setSingleTask(false);
        }

        if (p.items.length === 0) {
          setPhase("empty");
          return;
        }

        // Group items by series
        const groups = new Map<string, PlanItem[]>();
        for (const item of p.items) {
          const slug = seriesByTopicId.get(item.topic_id) || "general";
          if (!groups.has(slug)) groups.set(slug, []);
          groups.get(slug)!.push(item);
        }

        // Start an independent session per group (its pending topics only), so
        // each section can be finished + graded on its own. Fire them in
        // PARALLEL — a sequential await-loop here was the main cause of the lag
        // when opening recall for several series at once.
        const sessions = new Map<string, QuizSession | null>();
        const started = await Promise.all(
          Array.from(groups.entries()).map(async ([slug, items]) => {
            const pendingIds = items.filter((it) => !it.done).map((it) => it.topic_id);
            if (pendingIds.length === 0) return [slug, null] as const;
            try {
              return [slug, await startQuiz(pendingIds)] as const;
            } catch (e) {
              if (!cancelled) setError(e instanceof Error ? e.message : "Couldn't start a quiz session");
              return [slug, null] as const;
            }
          })
        );
        for (const [slug, session] of started) sessions.set(slug, session);

        if (cancelled) return;
        setGroupedItems(groups);
        setSessionsByGroup(sessions);
        setPhase("quizzing");
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load plan.");
          setPhase("empty");
        }
      });

    return () => {
      cancelled = true;
    };
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
    for (const [, group] of Array.from(groups.entries())) {
      group.score_pct = Math.round((group.items.reduce((acc, it) => acc + (it.score || 0), 0) / group.items.length) * 20);
      group.strengths = group.items.filter((it) => (it.score || 0) >= 4).map((it) => it.topic_name);
      group.focus = group.items.filter((it) => (it.score || 0) < 4).map((it) => it.topic_name);
    }

    setGroupedReports(groups);
  }

  const handleGroupDone = useCallback((slug: string) => {
    setCompletedGroups((prev) => new Set(prev).add(slug));
  }, []);

  const allGroupsDone = groupedItems.size > 0 && completedGroups.size >= groupedItems.size;

  // Close the day once every group is finished (full-plan runs only).
  useEffect(() => {
    if (phase !== "quizzing" || singleTask || !allGroupsDone) return;
    (async () => {
      try {
        const p = await getPlanCached();
        if (p.items.length > 0 && p.items.every((it) => it.done) && !p.completed) {
          await markPlanCompleted();
        }
      } catch {}
    })();
  }, [allGroupsDone, phase, singleTask]);

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

        {phase === "quizzing" && (
          <div className="space-y-12 rise">
            {error && sessionsByGroup.size === 0 && <p className="text-danger text-center">{error}</p>}

            {Array.from(groupedItems.entries()).map(([slug, items]) => (
              <GroupRunner
                key={slug}
                slug={slug}
                items={items}
                session={sessionsByGroup.get(slug) ?? null}
                showHeader={groupedItems.size > 1}
                onDone={() => handleGroupDone(slug)}
              />
            ))}

            {allGroupsDone && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/" className="btn-primary">Back to dashboard</Link>
                <Link href="/brain" className="btn-ghost">Explore your brain</Link>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

/**
 * One series group: runs its carousel, then finishes ITS OWN session and shows
 * ITS OWN report card inline — independent of the other groups on the page.
 */
function GroupRunner({
  slug,
  items,
  session,
  showHeader,
  onDone,
}: {
  slug: string;
  items: PlanItem[];
  session: QuizSession | null;
  showHeader: boolean;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"quizzing" | "finishing" | "report" | "done">("quizzing");
  const [report, setReport] = useState<ReportCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const doneCalled = useRef(false);

  const notifyDone = useCallback(() => {
    if (!doneCalled.current) {
      doneCalled.current = true;
      onDone();
    }
  }, [onDone]);

  const finishGroup = useCallback(async () => {
    if (session) {
      setPhase("finishing");
      try {
        const r = await finishQuiz(session.id);
        setReport(r);
        setPhase("report");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't build your report card");
        setPhase("done");
      }
    } else {
      setPhase("done"); // every item in this group was already reviewed today
    }
    notifyDone();
  }, [session, notifyDone]);

  return (
    <div className="space-y-6">
      {showHeader && <GroupHeader slug={slug} />}

      {phase === "quizzing" && (
        <QuizCarousel items={items} session={session} onComplete={finishGroup} />
      )}

      {phase === "finishing" && (
        <div className="glass rise flex flex-col items-center justify-center gap-3 p-12 text-muted">
          <Spinner />
          <p className="font-medium text-white/85">Building your report card…</p>
          <p className="text-sm">Grading this section — feedback, the lot.</p>
        </div>
      )}

      {phase === "report" && report && <ReportCardView report={report} />}

      {phase === "done" && (
        <div className="glass rise p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#43d6b5]/[0.12] text-xl text-[#43d6b5]">
            ✓
          </div>
          <h3 className="text-lg font-bold">Section complete</h3>
          {error ? (
            <p className="text-sm text-danger">{error}</p>
          ) : (
            <p className="text-sm text-muted">
              You&apos;ve finished {SERIES_TITLES[slug] ?? slug} for today.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function QuizCarousel({
  items,
  session,
  onComplete,
}: {
  items: PlanItem[];
  session: QuizSession | null;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"loading" | "question" | "already-done">("loading");

  const [question, setQuestion] = useState<SessionQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [multiSelected, setMultiSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

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
      onComplete();
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

  const pendingCount = items.filter((it) => !it.done).length;
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
