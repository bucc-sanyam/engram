"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Nav from "@/components/Nav";
import {
  finishQuiz,
  getFlashcards,
  getPlan,
  markPlanCompleted,
  rateFlashcard,
  saveQuizAnswer,
  startQuiz,
} from "@/lib/data";
import type {
  DailyPlan,
  Flashcard,
  PlanItem,
  QuizSession,
  ReportCard,
  ReportItem,
  SessionQuestion,
} from "@/lib/types";
import { categoryColor } from "@/lib/types";

type Phase =
  | "loading"
  | "question"
  | "cards"
  | "finishing"
  | "report"
  | "finished"
  | "empty";

const KIND_LABEL: Record<string, string> = {
  open: "Deep recall",
  quickfire: "Quick-fire",
  mcq: "Multiple choice",
};

export default function ReviewPage() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<SessionQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [report, setReport] = useState<ReportCard | null>(null);
  const [cardXp, setCardXp] = useState(0); // flashcard XP, earned immediately
  const [error, setError] = useState<string | null>(null);
  // Session start failure (e.g. DB missing the quiz tables) — shown on every
  // question item, since none of them can load without a session.
  const [startError, setStartError] = useState<string | null>(null);
  // true when deep-linked to a single task via ?topic= — finishing it must not
  // mark the whole day's plan complete / bump the streak.
  const [singleTask, setSingleTask] = useState(false);

  // Flashcard sub-state
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [cardRatings, setCardRatings] = useState<number[]>([]);

  const item: PlanItem | null = plan?.items[index] ?? null;

  const loadItem = useCallback(
    async (planData: DailyPlan, quiz: QuizSession | null, i: number) => {
      const it = planData.items[i];
      setError(null);
      setAnswer("");
      setSelected(null);
      setQuestion(null);
      setRevealed(false);
      setCardIndex(0);
      setCardRatings([]);
      setPhase("loading");

      const bankQuestion = quiz?.questions.find((q) => q.topic_id === it.topic_id) ?? null;

      try {
        if (it.mode === "flashcard") {
          const c = await getFlashcards(it.topic_id);
          if (c.length > 0) {
            setCards(c.slice(0, 3));
            setPhase("cards");
            return;
          }
        }
        // No cards (or a question item): serve the pre-generated bank question.
        if (bankQuestion) {
          setQuestion(bankQuestion);
          setPhase("question");
        } else {
          setError("No question available for this topic yet — add more learnings to grow the bank.");
          setPhase("question");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
        setPhase("question");
      }
    },
    []
  );

  useEffect(() => {
    // Deep link from the dashboard: `/review?topic=<id>` runs just that one
    // task. No param → the full daily plan, as before.
    const topicId =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("topic")
        : null;
    getPlan()
      .then(async (full) => {
        const matched = !!topicId && full.items.some((it) => it.topic_id === topicId);
        let p: DailyPlan;
        if (matched) {
          p = { ...full, items: full.items.filter((it) => it.topic_id === topicId) };
        } else {
          // Full run covers what's still to do today; once everything is done,
          // "Review again" replays the whole plan.
          const remaining = full.items.filter((it) => !it.done);
          p = { ...full, items: remaining.length ? remaining : full.items };
        }
        setSingleTask(matched);
        setPlan(p);
        if (p.items.length === 0) {
          setPhase("empty");
          return;
        }
        // One session for the whole plan — questions come from the bank, no AI.
        let quiz: QuizSession | null = null;
        try {
          quiz = await startQuiz(p.items.map((it) => it.topic_id));
        } catch (e) {
          // Flashcard items still work; question items show this error.
          setStartError(e instanceof Error ? e.message : "Couldn't start the quiz session");
        }
        setSession(quiz);
        loadItem(p, quiz, 0);
      })
      .catch(() => setPhase("empty"));
  }, [loadItem]);

  async function submitCurrent(skip = false) {
    if (!question || !session || saving) return;
    setSaving(true);
    setError(null);
    try {
      // Answers are persisted the moment they're given; grading happens once,
      // at the end of the session.
      await saveQuizAnswer({
        sessionId: session.id,
        questionIndex: question.index,
        answer: question.kind === "mcq" ? undefined : skip ? "" : answer,
        selectedIndex: question.kind === "mcq" && !skip ? selected ?? undefined : undefined,
      });
      setAnsweredCount((c) => c + 1);
      setSaving(false);
      next(true);
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : "Couldn't save your answer");
    }
  }

  async function rateCard(quality: number) {
    const ratings = [...cardRatings, quality];
    setCardRatings(ratings);
    setRevealed(false);
    if (cardIndex + 1 < cards.length) {
      setCardIndex(cardIndex + 1);
    } else {
      // One SRS update per topic: the average of the card self-ratings.
      const avg = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
      try {
        const { xp } = await rateFlashcard({ topicId: item!.topic_id, quality: avg });
        setCardXp((x) => x + xp);
      } catch { /* non-fatal */ }
      next(false);
    }
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't build your report card");
      setPhase("finished");
    }
  }

  const progress = plan && plan.items.length ? (index / plan.items.length) * 100 : 0;
  const totalXp = (report?.xp ?? 0) + cardXp;

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
        {item && ["question", "cards"].includes(phase) && (
          <div className="rise mb-4 flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: categoryColor(item.category), boxShadow: `0 0 8px ${categoryColor(item.category)}` }}
            />
            <span className="font-semibold">{item.topic_name}</span>
            <span className="micro rounded-full bg-white/[0.05] px-3 py-1">
              {phase === "cards" ? "Flashcards" : KIND_LABEL[question?.kind ?? "open"]}
            </span>
          </div>
        )}

        {/* Question (typed or multiple choice) */}
        {phase === "question" && question && (
          <div className="glass rise p-6">
            <p className="mb-5 text-lg font-medium leading-relaxed">{question.prompt}</p>

            {question.kind === "mcq" && question.options ? (
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
                disabled={
                  saving ||
                  (question.kind === "mcq" ? selected === null : !answer.trim())
                }
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

        {/* Flashcards */}
        {phase === "cards" && cards[cardIndex] && (
          <div className="rise">
            <p className="micro mb-3 text-center">Card {cardIndex + 1} of {cards.length}</p>
            <button
              className="glass glass-hover block w-full cursor-pointer p-8 text-center"
              onClick={() => setRevealed(true)}
              disabled={revealed}
            >
              <p className="text-lg font-medium leading-relaxed">{cards[cardIndex].question}</p>
              {revealed ? (
                <p className="mt-6 border-t border-white/[0.07] pt-6 leading-relaxed text-[#7fe5cb]">
                  {cards[cardIndex].answer}
                </p>
              ) : (
                <p className="micro mt-6">tap to reveal</p>
              )}
            </button>

            {revealed && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                <RateBtn label="Again" color="#f87171" onClick={() => rateCard(1)} />
                <RateBtn label="Hard" color="#f5b95f" onClick={() => rateCard(3)} />
                <RateBtn label="Good" color="#8fd694" onClick={() => rateCard(4)} />
                <RateBtn label="Easy" color="#43d6b5" onClick={() => rateCard(5)} />
              </div>
            )}
          </div>
        )}

        {/* Report card — the single AI pass over the whole session */}
        {phase === "report" && report && (
          <div className="rise space-y-5">
            <div className="glass p-7 text-center sm:p-8">
              <p className="micro mb-4">Report card · {report.date}</p>
              <div className="mb-4 flex items-center justify-center gap-6">
                <BigScoreRing pct={report.score_pct} />
                <div className="text-left">
                  <div className="display text-3xl font-bold text-[#f5b95f]">+{totalXp} XP</div>
                  <div className="text-sm text-muted">
                    {report.items.filter((i) => !i.skipped).length} answered ·{" "}
                    {report.items.filter((i) => i.skipped).length} skipped
                  </div>
                </div>
              </div>
              <p className="mx-auto max-w-lg leading-relaxed text-white/85">{report.summary}</p>

              {(report.strengths.length > 0 || report.focus.length > 0) && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {report.strengths.map((s) => (
                    <span key={s} className="rounded-full bg-[#43d6b5]/[0.12] px-3.5 py-1.5 text-xs font-semibold text-[#7fe5cb]">
                      ✓ {s}
                    </span>
                  ))}
                  {report.focus.map((s) => (
                    <span key={s} className="rounded-full bg-[#f5b95f]/[0.12] px-3.5 py-1.5 text-xs font-semibold text-[#f5b95f]">
                      ↺ {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {report.items.map((r) => (
              <ReportItemCard key={r.index} item={r} />
            ))}

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/" className="btn-primary">Back to dashboard</Link>
              <Link href="/brain" className="btn-ghost">Explore your brain</Link>
            </div>
          </div>
        )}

        {/* Finished (flashcards-only sessions, or report unavailable) */}
        {phase === "finished" && (
          <div className="glass rise p-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] text-4xl shadow-[0_0_50px_rgba(255,122,92,0.5)]">
              🏆
            </div>
            <h1 className="mb-2 text-2xl font-bold">Session complete!</h1>
            <p className="display mb-1 text-3xl font-bold text-[#f5b95f]">+{totalXp} XP</p>
            {error && <p className="mb-3 text-sm text-danger">{error}</p>}
            <p className="mb-8 text-muted">
              Streak secured. Every recall today just made the forgetting curve flatter.
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

function ReportItemCard({ item }: { item: ReportItem }) {
  const isMcq = item.kind === "mcq";
  return (
    <div className="glass p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="font-semibold">{item.topic_name}</span>
        <span className="micro rounded-full bg-white/[0.05] px-3 py-1">{KIND_LABEL[item.kind]}</span>
        <span className="ml-auto shrink-0">
          {item.skipped ? (
            <span className="micro rounded-full bg-white/[0.05] px-3 py-1.5">Skipped</span>
          ) : isMcq ? (
            <span
              className="rounded-full px-3 py-1.5 text-xs font-bold"
              style={{
                background: item.correct ? "#43d6b51c" : "#f871711c",
                color: item.correct ? "#43d6b5" : "#f87171",
              }}
            >
              {item.correct ? "✓ Correct" : "✗ Incorrect"}
            </span>
          ) : (
            <ScoreRing score={item.score} size={44} />
          )}
        </span>
      </div>

      <p className="mb-4 font-medium leading-relaxed">{item.prompt}</p>

      {isMcq && item.options ? (
        <div className="mb-4 space-y-1.5">
          {item.options.map((opt, i) => {
            const isCorrect = i === item.correct_index;
            const isPicked = i === item.selected_index;
            return (
              <div
                key={i}
                className={`rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed ${
                  isCorrect
                    ? "border-[#43d6b5]/50 bg-[#43d6b5]/[0.08] text-[#7fe5cb]"
                    : isPicked
                      ? "border-[#f87171]/50 bg-[#f87171]/[0.07] text-[#fca5a5]"
                      : "border-white/[0.06] text-white/60"
                }`}
              >
                <span className="mr-2 text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                {opt}
                {isCorrect && <span className="ml-2 text-xs">✓</span>}
                {isPicked && !isCorrect && <span className="ml-2 text-xs">your pick</span>}
              </div>
            );
          })}
        </div>
      ) : (
        !item.skipped && (
          <div className="mb-4 rounded-2xl bg-white/[0.03] p-4">
            <div className="micro mb-1.5">Your answer</div>
            <p className="text-sm leading-relaxed text-white/75">{item.answer}</p>
          </div>
        )
      )}

      {item.feedback && <p className="mb-4 text-sm leading-relaxed text-white/85">{item.feedback}</p>}

      <div className="rounded-2xl bg-[#43d6b5]/[0.05] p-4">
        <div className="micro mb-1.5 !text-[#43d6b5]">{isMcq ? "Correct answer" : "Model answer"}</div>
        <p className="text-sm leading-relaxed text-muted">{item.correct_answer}</p>
      </div>
    </div>
  );
}

function BigScoreRing({ pct }: { pct: number }) {
  const color = pct >= 75 ? "#43d6b5" : pct >= 50 ? "#f5b95f" : "#f87171";
  const C = 2 * Math.PI * 40;
  return (
    <svg width="104" height="104" viewBox="0 0 104 104">
      <circle cx="52" cy="52" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <circle
        cx="52" cy="52" r="40" fill="none"
        stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * C} ${C}`}
        transform="rotate(-90 52 52)"
      />
      <text x="52" y="52" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="22" fontWeight="700">
        {pct}%
      </text>
    </svg>
  );
}

function ScoreRing({ score, size = 68 }: { score: number; size?: number }) {
  const pct = (score / 5) * 100;
  const color = score >= 4 ? "#43d6b5" : score >= 3 ? "#f5b95f" : "#f87171";
  const r = size * 0.38;
  const C = 2 * Math.PI * r;
  const mid = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={mid} cy={mid} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={size * 0.09} />
      <circle
        cx={mid} cy={mid} r={r} fill="none"
        stroke={color} strokeWidth={size * 0.09} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * C} ${C}`}
        transform={`rotate(-90 ${mid} ${mid})`}
      />
      <text x={mid} y={mid} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={size * 0.28} fontWeight="700">
        {score}
      </text>
    </svg>
  );
}

function RateBtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
      style={{ background: `${color}1c`, color }}
    >
      {label}
    </button>
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
