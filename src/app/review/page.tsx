"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Nav from "@/components/Nav";
import {
  getFlashcards,
  getPlan,
  getQuestion,
  markPlanCompleted,
  rateFlashcard,
  submitAnswer,
} from "@/lib/data";
import type { DailyPlan, Flashcard, GradeResult, PlanItem } from "@/lib/types";
import { categoryColor } from "@/lib/types";

type Phase = "loading" | "question" | "grading" | "feedback" | "cards" | "finished" | "empty";

export default function ReviewPage() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [grade, setGrade] = useState<(GradeResult & { xp: number }) | null>(null);
  const [xpTotal, setXpTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // true when deep-linked to a single task via ?topic= — finishing it must not
  // mark the whole day's plan complete / bump the streak.
  const [singleTask, setSingleTask] = useState(false);

  // Flashcard sub-state
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [cardRatings, setCardRatings] = useState<number[]>([]);

  const item: PlanItem | null = plan?.items[index] ?? null;

  const loadItem = useCallback(async (planData: DailyPlan, i: number) => {
    const it = planData.items[i];
    setError(null);
    setAnswer("");
    setGrade(null);
    setQuestion(null);
    setRevealed(false);
    setCardIndex(0);
    setCardRatings([]);
    setPhase("loading");

    try {
      if (it.mode === "flashcard") {
        const c = await getFlashcards(it.topic_id);
        if (c.length === 0) {
          // No cards — fall back to an AI question.
          const q = await getQuestion(it.topic_id, "recall");
          setQuestion(q.question);
          setPhase("question");
        } else {
          setCards(c.slice(0, 3));
          setPhase("cards");
        }
      } else {
        const q = await getQuestion(it.topic_id, it.mode);
        setQuestion(q.question);
        setPhase("question");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setPhase("question");
    }
  }, []);

  useEffect(() => {
    // Deep link from the dashboard: `/review?topic=<id>` runs just that one
    // task. No param → the full daily plan, as before.
    const topicId =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("topic")
        : null;
    getPlan().then((full) => {
      const matched = !!topicId && full.items.some((it) => it.topic_id === topicId);
      const p = matched
        ? { ...full, items: full.items.filter((it) => it.topic_id === topicId) }
        : full;
      setSingleTask(matched);
      setPlan(p);
      if (p.items.length === 0) setPhase("empty");
      else loadItem(p, 0);
    }).catch(() => setPhase("empty"));
  }, [loadItem]);

  async function submit() {
    if (!item || !question || !answer.trim()) return;
    setPhase("grading");
    try {
      const g = await submitAnswer({
        topicId: item.topic_id,
        mode: item.mode,
        question,
        answer,
      });
      setGrade(g);
      setXpTotal((x) => x + g.xp);
      setPhase("feedback");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grading failed");
      setPhase("question");
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
        setXpTotal((x) => x + xp);
      } catch { /* non-fatal */ }
      next();
    }
  }

  function next() {
    if (!plan) return;
    if (index + 1 < plan.items.length) {
      setIndex(index + 1);
      loadItem(plan, index + 1);
    } else {
      // Only a full-plan run closes out the day; a single deep-linked task doesn't.
      if (!singleTask) markPlanCompleted().catch(() => {});
      setPhase("finished");
    }
  }

  const progress = plan && plan.items.length ? (index / plan.items.length) * 100 : 0;

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-8 sm:px-6 md:pb-16">
        {/* Progress bar */}
        {plan && plan.items.length > 0 && phase !== "finished" && (
          <div className="rise mb-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted">
                {index + 1} of {plan.items.length}
              </span>
              <span className="micro !text-[#f5b95f]">+{xpTotal} XP</span>
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

        {/* Topic header */}
        {item && !["finished", "empty", "loading"].includes(phase) && (
          <div className="rise mb-4 flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: categoryColor(item.category), boxShadow: `0 0 8px ${categoryColor(item.category)}` }}
            />
            <span className="font-semibold">{item.topic_name}</span>
            <span className="micro rounded-full bg-white/[0.05] px-3 py-1">
              {item.mode === "recall" ? "Deep recall" : item.mode === "quickfire" ? "Quick-fire" : "Flashcards"}
            </span>
          </div>
        )}

        {/* Open question */}
        {(phase === "question" || phase === "grading") && question && (
          <div className="glass rise p-6">
            <p className="mb-5 text-lg font-medium leading-relaxed">{question}</p>
            <textarea
              className="input min-h-[140px] resize-y"
              placeholder="Answer from memory — no peeking. Even partial answers strengthen recall."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={phase === "grading"}
              autoFocus
            />
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
            <div className="mt-4 flex justify-between">
              <button className="btn-ghost text-sm" onClick={next} disabled={phase === "grading"}>
                Skip
              </button>
              <button
                className="btn-primary"
                onClick={submit}
                disabled={phase === "grading" || !answer.trim()}
              >
                {phase === "grading" ? <><Spinner /> Grading…</> : "Submit answer"}
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {phase === "feedback" && grade && (
          <div className="glass rise p-6">
            <div className="mb-5 flex items-center gap-4">
              <ScoreRing score={grade.score} />
              <div>
                <div className="text-lg font-bold">{scoreLabel(grade.score)}</div>
                <div className="text-sm font-semibold text-[#f5b95f]">+{grade.xp} XP</div>
              </div>
            </div>
            <p className="mb-4 leading-relaxed text-white/85">{grade.feedback}</p>
            <div className="mb-6 rounded-2xl bg-white/[0.03] p-4">
              <div className="micro mb-1.5">Model answer</div>
              <p className="text-sm leading-relaxed text-muted">{grade.model_answer}</p>
            </div>
            <button className="btn-primary w-full" onClick={next}>
              Continue →
            </button>
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

        {/* Finished */}
        {phase === "finished" && (
          <div className="glass rise p-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] text-4xl shadow-[0_0_50px_rgba(255,122,92,0.5)]">
              🏆
            </div>
            <h1 className="mb-2 text-2xl font-bold">Session complete!</h1>
            <p className="display mb-1 text-3xl font-bold text-[#f5b95f]">+{xpTotal} XP</p>
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

function scoreLabel(score: number) {
  return ["Blank — it happens", "Rough start", "Getting there", "Solid recall", "Great answer", "Perfect recall!"][
    Math.max(0, Math.min(5, score))
  ];
}

function ScoreRing({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  const color = score >= 4 ? "#43d6b5" : score >= 3 ? "#f5b95f" : "#f87171";
  const C = 2 * Math.PI * 26;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68">
      <circle cx="34" cy="34" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle
        cx="34" cy="34" r="26" fill="none"
        stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * C} ${C}`}
        transform="rotate(-90 34 34)"
      />
      <text x="34" y="34" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="18" fontWeight="700">
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
