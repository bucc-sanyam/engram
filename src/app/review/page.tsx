"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import ReportCardView, { KIND_LABEL } from "@/components/ReportCardView";
import {
  finishQuiz,
  getPlan,
  markPlanCompleted,
  saveQuizAnswer,
  startQuiz,
  getTodayReviewDetail,
  getLatestReportToday,
} from "@/lib/data";
import { demoQuestionBank } from "@/lib/demo";
import QuestionWidget from "@/components/QuestionWidget";
import type {
  DailyPlan,
  PlanItem,
  QuizSession,
  ReportCard,
  SessionQuestion,
} from "@/lib/types";
import { categoryColor } from "@/lib/types";

type Phase =
  | "loading"
  | "question"
  | "finishing"
  | "report"
  | "finished"
  | "empty"
  | "already-done"; // topic already reviewed today

export default function ReviewPage() {
  // useSearchParams needs a Suspense boundary for prerendering.
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
  // The ?topic= param via the router — unlike a one-off window.location read,
  // this re-triggers the init effect when the user navigates between
  // /review?topic=A, /review?topic=B and /review while the page stays mounted.
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");

  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<SessionQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [multiSelected, setMultiSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [report, setReport] = useState<ReportCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Session start failure (e.g. DB missing the quiz tables) — shown on every
  // question item, since none of them can load without a session.
  const [startError, setStartError] = useState<string | null>(null);
  // true when deep-linked to a single task via ?topic= — finishing it must not
  // mark the whole day's plan complete / bump the streak.
  const [singleTask, setSingleTask] = useState(false);

  // Already-done sub-state
  const [doneDetail, setDoneDetail] = useState<{
    question: string;
    userAnswer: string;
    storedAnswer: string;
    feedback?: string;
  } | null>(null);

  const item: PlanItem | null = plan?.items[index] ?? null;

  // Mirror of startError readable from the stable loadItem callback.
  const startErrorRef = useRef<string | null>(null);

  const loadItem = useCallback(
    async (planData: DailyPlan, quiz: QuizSession | null, i: number) => {
      const it = planData.items[i];
      setError(null);
      setAnswer("");
      setSelected(null);
      setMultiSelected([]);
      setQuestion(null);
      setDoneDetail(null);

      // If this item was already done today, show the "already done" card
      // instead of asking the question again.
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

      const bankQuestion = quiz?.questions.find((q) => q.topic_id === it.topic_id) ?? null;

      if (bankQuestion) {
        setQuestion(bankQuestion);
        setPhase("question");
      } else {
        setError(
          startErrorRef.current ??
            "No question available for this topic yet — add more learnings to grow the bank."
        );
        setPhase("question");
      }
    },
    []
  );

  useEffect(() => {
    // Deep link from the dashboard: `/review?topic=<id>` runs just that one
    // task. No param → the full daily plan including all items (done ones shown
    // as "already reviewed" so the user still sees every topic). Re-runs on
    // every ?topic= change, resetting the whole session state.
    let cancelled = false;
    setPlan(null);
    setSession(null);
    setIndex(0);
    setPhase("loading");
    setQuestion(null);
    setAnswer("");
    setSelected(null);
    setMultiSelected([]);
    setSaving(false);
    setAnsweredCount(0);
    setReport(null);
    setError(null);
    setStartError(null);
    startErrorRef.current = null;
    setSingleTask(false);
    setDoneDetail(null);

    getPlan()
      .then(async (full) => {
        if (cancelled) return;
        // If the plan is completed and no topicId parameter is specified, show
        // the merged report for today directly (every question asked today).
        if (full.completed && !topicId) {
          try {
            const latestReport = await getLatestReportToday();
            if (latestReport) {
              if (cancelled) return;
              setReport(latestReport);
              setPhase("report");
              return;
            }
          } catch { /* fallback to normal quiz session building */ }
        }

        const matched = !!topicId && full.items.some((it) => it.topic_id === topicId);
        let p: DailyPlan;
        if (matched) {
          // Single-task deep link: just that one topic (regardless of done state)
          p = { ...full, items: full.items.filter((it) => it.topic_id === topicId) };
        } else {
          // Full plan run: every item, PENDING ONES FIRST so the session never
          // opens on an "already reviewed" card; done topics come after, so the
          // user still steps through everything covered today.
          p = {
            ...full,
            items: [...full.items].sort((a, b) => Number(!!a.done) - Number(!!b.done)),
          };
        }
        if (cancelled) return;
        setSingleTask(matched);
        setPlan(p);
        if (p.items.length === 0) {
          setPhase("empty");
          return;
        }
        // Build a quiz session for non-done topics only (done ones are skipped
        // without a question, so don't need bank slots).
        const pendingIds = p.items.filter((it) => !it.done).map((it) => it.topic_id);
        let quiz: QuizSession | null = null;
        if (pendingIds.length > 0) {
          try {
            quiz = await startQuiz(pendingIds);
          } catch (e) {
            const msg = e instanceof Error ? e.message : "Couldn't start the quiz session";
            if (!cancelled) setStartError(msg);
            startErrorRef.current = msg;
          }
        }
        if (cancelled) return;
        setSession(quiz);
        loadItem(p, quiz, 0);
      })
      .catch(() => {
        if (!cancelled) setPhase("empty");
      });
    return () => {
      cancelled = true;
    };
  }, [topicId, loadItem]);

  async function submitCurrent(skip = false) {
    if (!question || !session || saving) return;
    setSaving(true);
    setError(null);
    const isSingleChoice = question.kind === "mcq" || question.kind === "truefalse";
    const isMulti = question.kind === "multi";
    try {
      // Answers are persisted the moment they're given; grading happens once,
      // at the end of the session.
      await saveQuizAnswer({
        sessionId: session.id,
        questionIndex: question.index,
        answer: isSingleChoice || isMulti ? undefined : skip ? "" : answer,
        selectedIndex: isSingleChoice && !skip ? selected ?? undefined : undefined,
        selectedIndices: isMulti && !skip && multiSelected.length ? [...multiSelected].sort((a, b) => a - b) : undefined,
      });
      setAnsweredCount((c) => c + 1);
      setSaving(false);
      next(true);
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : "Couldn't save your answer");
    }
  }

  function toggleMulti(i: number) {
    setMultiSelected((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]
    );
  }

  function next(justAnswered: boolean) {
    if (!plan) return;
    if (index + 1 < plan.items.length) {
      setIndex(index + 1);
      loadItem(plan, session, index + 1);
      return;
    }
    // Session over. Only a full-plan run closes out the day; a single
    // deep-linked task doesn't.
    if (!singleTask) markPlanCompleted().catch(() => {});
    // answeredCount is stale within this tick when called right after a save,
    // so the caller tells us whether it just added an answer.
    if (session && (answeredCount > 0 || justAnswered)) {
      finalize();
    } else {
      setPhase("finished");
    }
  }

  async function finalize() {
    if (!session) return;
    setPhase("finishing");
    try {
      const r = await finishQuiz(session.id);
      setReport(r);
      setPhase("report");
      // A single deep-linked task doesn't close the day by itself — but when it
      // was the LAST pending topic, the day IS complete: mark it so the streak
      // and the "See report" button behave without needing a full-plan replay.
      if (singleTask) {
        try {
          const p = await getPlan();
          if (p.items.length > 0 && p.items.every((it) => it.done) && !p.completed) {
            await markPlanCompleted();
          }
        } catch { /* non-fatal — the next full run will close the day */ }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't build your report card");
      setPhase("finished");
    }
  }

  const canSubmit =
    !!question &&
    (question.kind === "mcq" || question.kind === "truefalse"
      ? selected !== null
      : question.kind === "multi"
        ? multiSelected.length > 0
        : answer.trim().length > 0);

  // How many items in the plan are NOT already done (i.e. need answering this session)
  const pendingCount = plan ? plan.items.filter((it) => !it.done).length : 0;
  // Progress = steps through the plan (regardless of done state)
  const progress = plan && plan.items.length ? (index / plan.items.length) * 100 : 0;

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-8 sm:px-6 md:pb-16">
        {/* Progress bar */}
        {plan && plan.items.length > 0 && !["finished", "report", "finishing"].includes(phase) && (
          <div className="rise mb-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted">
                {index + 1} of {plan.items.length}
                {pendingCount < plan.items.length && (
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
        )}

        {phase === "empty" && (
          <div className="glass rise p-8 text-center">
            <h1 className="mb-2 text-xl font-bold">Nothing to revise yet</h1>
            <p className="mb-5 text-muted">Log some learnings first and come back.</p>
            <Link href="/add" className="btn-primary">Add a learning</Link>
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

        {/* Topic header */}
        {item && ["question", "already-done"].includes(phase) && (
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

        {/* Already-done card — show what was answered and what was stored */}
        {phase === "already-done" && item && (
          <div className="glass rise p-6 space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#43d6b5]/[0.12] text-xl text-[#43d6b5]">
                ✓
              </div>
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
              <p className="text-center text-sm text-muted">
                You covered <span className="font-semibold text-white/85">{item.topic_name}</span> earlier.
              </p>
            )}

            <div className="flex justify-center pt-2">
              <button className="btn-primary" onClick={() => next(false)}>
                {index + 1 < (plan?.items.length ?? 0) ? "Next topic →" : "Finish session →"}
              </button>
            </div>
          </div>
        )}

        {/* Question — typed, single choice, true/false or multi-select */}
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
                      <span
                        className={`mr-3 inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                          picked ? "bg-[#f5b95f] text-[#1a120e]" : "bg-white/[0.07]"
                        }`}
                      >
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
                placeholder="Answer from memory — no peeking. You'll get your full report card at the end."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={saving}
                autoFocus
              />
            )}

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
            <div className="mt-4 flex justify-between">
              <button className="btn-ghost text-sm" onClick={() => submitCurrent(true)} disabled={saving}>
                Skip
              </button>
              <button
                className="btn-primary"
                onClick={() => submitCurrent(false)}
                disabled={saving || !canSubmit}
              >
                {saving ? (
                  <><Spinner /> Saving…</>
                ) : index + 1 < (plan?.items.length ?? 0) ? (
                  "Save & next →"
                ) : (
                  "Save & finish →"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Question failed to load — never leave a blank page */}
        {phase === "question" && !question && (
          <div className="glass rise p-8 text-center">
            <h2 className="mb-2 text-lg font-bold">Couldn&apos;t load this question</h2>
            <p className="mb-6 text-sm text-danger">
              {error ?? startError ?? "Something went wrong preparing this topic."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn-ghost text-sm" onClick={() => next(false)}>
                Skip this topic
              </button>
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Report card — every question of the session, fully detailed */}
        {phase === "report" && report && (
          <div className="rise">
            <ReportCardView report={report} />
            
            <section className="mt-8 glass rise overflow-hidden p-6 sm:p-7">
              <div className="mb-5">
                <p className="micro mb-1 flex items-center gap-2 !text-[#bfa8f5]">
                   Review Deck
                </p>
                <h2 className="text-xl font-bold">Flip through your flashcards</h2>
              </div>
              <QuestionWidget questions={demoQuestionBank.slice(5, 10)} color="#bfa8f5" />
            </section>

            <div className="mt-5 flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/" className="btn-primary">Back to dashboard</Link>
              <Link href="/brain" className="btn-ghost">Explore your brain</Link>
            </div>
          </div>
        )}

        {/* Finished (nothing answered, or report unavailable) */}
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

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
