"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isDemo } from "@/lib/data";
import { completeSection, getStorySections } from "@/lib/stories";
import { KIND_LABEL } from "@/components/ReportCardView";
import type { CompActQuestion } from "@/lib/competition-act/types";

/**
 * The "learn this section" island rendered inside an otherwise-static Competition
 * Code section blog. Signed-in users can mark the section learned, which seeds
 * its pre-authored question bank (via completeSection) so the topic enters their
 * reviews. Guests see a sign-in gate. Once learned, the section's Q&A is shown.
 */
export default function StoryLearnPanel({
  seriesSlug,
  sectionSlug,
  questions,
  color,
}: {
  seriesSlug: string;
  chapterSlug: string;
  sectionSlug: string;
  questions: CompActQuestion[];
  color: string;
}) {
  // "unknown" until we've checked; drives the initial skeleton.
  const [status, setStatus] = useState<"unknown" | "guest" | "new" | "learned">("unknown");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const hasBank = questions.length > 0;

  useEffect(() => {
    if (isDemo) {
      setStatus("guest");
      return;
    }
    getStorySections(seriesSlug)
      .then((rows) => {
        const hit = rows.find((r) => r.section_slug === sectionSlug);
        setStatus(hit?.status === "learned" ? "learned" : "new");
      })
      .catch(() => setStatus("new"));
  }, [seriesSlug, sectionSlug]);

  async function markLearned() {
    setBusy(true);
    setError(null);
    try {
      const { questionCount } = await completeSection(seriesSlug, sectionSlug);
      setStatus("learned");
      setToast(
        questionCount > 0
          ? `${questionCount} question${questionCount === 1 ? "" : "s"} added to your reviews`
          : "Added to your reviews"
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (status === "learned" && hasBank) {
    return (
      <section className="mt-12 border-t border-white/[0.07] pt-9">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="micro mb-1" style={{ color }}>
              Questions & answers
            </h2>
            <p className="text-sm text-muted">
              You've learned this section. Every question is now in your review rotation.
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
            style={{ background: `${color}1a`, color }}
          >
            ✓ Learned
          </span>
        </div>
        <QuestionStack questions={questions} color={color} />
      </section>
    );
  }

  return (
    <section className="mt-12 border-t border-white/[0.07] pt-9">
      {/* Learn control */}
      <div className="glass flex flex-col gap-4 rounded-[1.5rem] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="micro mb-1" style={{ color }}>
            Learn this section
          </p>
          <p className="text-sm leading-relaxed text-muted">
            {status === "learned"
              ? "You've learned this section — its questions are in your review rotation."
              : hasBank
                ? "Mark it learned to add its questions to your spaced-repetition reviews."
                : "Mark it learned to track it on your brain."}
          </p>
        </div>

        <div className="shrink-0">
          {status === "unknown" && (
            <div className="h-10 w-36 animate-pulse rounded-full bg-white/[0.05]" />
          )}

          {status === "guest" && (
            <Link href="/login" className="btn-primary whitespace-nowrap" data-allow-nav>
              Sign in to learn this
            </Link>
          )}

          {status === "new" && (
            <button onClick={markLearned} disabled={busy} className="btn-primary whitespace-nowrap">
              {busy ? "Adding…" : "Mark as learned"}
            </button>
          )}

          {status === "learned" && (
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
                style={{ background: `${color}1a`, color }}
              >
                ✓ Learned
              </span>
              <Link href="/review" className="text-sm font-semibold text-faint transition-colors hover:text-white">
                Review →
              </Link>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <p className="mt-3 text-sm font-medium" style={{ color }}>
          {toast}
        </p>
      )}
      {error && <p className="mt-3 text-sm text-[#ff7a5c]">{error}</p>}

      {/* (Removed static Q&A list, replaced by QuestionStack above) */}
    </section>
  );
}

function QuestionStack({ questions, color }: { questions: CompActQuestion[], color: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (currentIndex >= questions.length) {
    return (
      <div className="glass rounded-[1.5rem] p-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-2xl" style={{ background: `${color}1a`, color }}>
          ✓
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">Preview complete</h3>
        <p className="mb-6 text-sm text-muted">You've seen all the questions for this section. They will appear in your daily spaced-repetition plan.</p>
        <Link href="/review" className="btn-primary">Go to your reviews →</Link>
      </div>
    );
  }

  return (
    <div className="relative h-[480px] w-full [perspective:1000px]">
       {questions.slice(currentIndex, currentIndex + 3).map((qItem, offset) => {
         const isTop = offset === 0;
         const scale = 1 - offset * 0.04;
         const translateY = offset * 12;
         const opacity = 1 - offset * 0.25;
         
         return (
           <div 
             key={currentIndex + offset}
             className={`absolute inset-x-0 top-0 bottom-6 rounded-3xl border border-white/[0.06] p-6 sm:p-8 transition-all duration-500 ease-out shadow-2xl flex flex-col ${isTop ? 'bg-[#1a171d]' : 'bg-[#141216] pointer-events-none'}`}
             style={{
                transform: `translate3d(0, ${translateY}px, -${offset * 20}px) scale(${scale})`,
                opacity,
                zIndex: 10 - offset,
             }}
           >
              {isTop && (
                <div className="h-full flex flex-col min-h-0">
                  <div className="flex items-center gap-3 mb-5 shrink-0">
                    <span className="micro rounded-full bg-white/[0.05] px-2.5 py-0.5">
                      {KIND_LABEL[qItem.kind] ?? qItem.kind}
                    </span>
                    <span className="text-xs font-semibold ml-auto" style={{ color }}>{currentIndex + 1} of {questions.length}</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto min-h-0 space-y-5 pr-2">
                    <p className="text-[17px] font-medium leading-relaxed">{qItem.prompt}</p>
                    
                    {showAnswer ? (
                      <div className="space-y-4 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {qItem.options && (
                          <div className="space-y-2.5">
                            {qItem.options.map((opt, i) => {
                              const isCorrect = qItem.kind === "multi" ? qItem.correct_indices?.includes(i) : i === qItem.correct_index;
                              return (
                                <div key={i} className={`rounded-2xl border px-4 py-3.5 text-[15px] leading-relaxed transition-colors ${isCorrect ? 'border-[#43d6b5]/50 bg-[#43d6b5]/[0.08] text-[#7fe5cb]' : 'border-white/[0.06] bg-white/[0.02] text-white/55'}`}>
                                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.07] text-xs font-bold">{String.fromCharCode(65 + i)}</span>{opt}
                                  {isCorrect && <span className="ml-2 text-xs">✓</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="rounded-2xl bg-[#43d6b5]/[0.05] p-5 border border-[#43d6b5]/[0.1]">
                          <div className="micro mb-2 !text-[#43d6b5]">Model Answer</div>
                          <p className="text-[15px] leading-relaxed text-white/90">{qItem.model_answer}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 flex items-center justify-center">
                        <button onClick={() => setShowAnswer(true)} className="btn-ghost" style={{ color }}>
                          Reveal Answer
                        </button>
                      </div>
                    )}
                  </div>

                  {showAnswer && (
                    <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-end shrink-0">
                      <button onClick={() => { setCurrentIndex(c => c + 1); setShowAnswer(false); }} className="btn-primary group">
                        {currentIndex === questions.length - 1 ? 'Finish →' : 'Next Question →'}
                      </button>
                    </div>
                  )}
                </div>
              )}
           </div>
         )
       })}
    </div>
  )
}
