"use client";

import { useState } from "react";
import type { QuestionKind } from "@/lib/types";
import RichText from "@/components/RichText";

const KIND_LABEL: Record<string, string> = {
  open: "Deep recall",
  quickfire: "Quick-fire",
  mcq: "Multiple choice",
  truefalse: "True / False",
  multi: "Select all that apply",
};

interface Question {
  kind: QuestionKind;
  prompt: string;
  options?: string[] | null;
  correct_index?: number | null;
  correct_indices?: number[] | null;
  model_answer: string;
}

export default function QuestionWidget({ questions, color = "#43d6b5" }: { questions: Question[], color?: string }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (!questions || questions.length === 0) return null;

  const handleNext = () => {
    setRevealed(false);
    setIndex((i) => (i + 1) % questions.length);
  };

  const handlePrev = () => {
    setRevealed(false);
    setIndex((i) => (i - 1 + questions.length) % questions.length);
  };

  return (
    <div className="relative mx-auto mt-4 w-full max-w-lg">
      <div className="relative h-[420px] w-full">
        {questions.map((q, i) => {
          const diff = (i - index + questions.length) % questions.length;
          const isCurrent = diff === 0;
          const isNext1 = diff === 1;
          const isNext2 = diff === 2;

          if (!isCurrent && !isNext1 && !isNext2) return null;

          let y = 0;
          let scale = 1;
          let zIndex = 30;
          let opacity = 1;

          if (isNext1) {
            y = 12;
            scale = 0.95;
            zIndex = 20;
            opacity = 0.6;
          } else if (isNext2) {
            y = 24;
            scale = 0.9;
            zIndex = 10;
            opacity = 0.3;
          }

          return (
            <div
              key={i}
              className="absolute left-0 top-0 h-full w-full rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-6 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{
                transform: `translateY(${y}px) scale(${scale})`,
                zIndex,
                opacity,
                pointerEvents: isCurrent ? "auto" : "none",
              }}
            >
              <div className="flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <span className="micro rounded-full bg-white/[0.05] px-2.5 py-1">
                    {KIND_LABEL[q.kind] ?? q.kind}
                  </span>
                  <span className="text-xs font-medium text-faint">
                    {i + 1} of {questions.length}
                  </span>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  <RichText className="mb-6 block text-[15px] font-medium leading-relaxed">
                    {q.prompt}
                  </RichText>

                  {!revealed ? (
                    <button
                      onClick={() => setRevealed(true)}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-4 text-sm font-medium transition-colors hover:bg-white/[0.05]"
                    >
                      Reveal Answer
                    </button>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 pb-4">
                      {q.options && (
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect =
                              q.kind === "multi"
                                ? q.correct_indices?.includes(optIdx) ?? false
                                : optIdx === q.correct_index;
                            return (
                              <div
                                key={optIdx}
                                className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                                  isCorrect
                                    ? "border-white/[0.2] bg-white/[0.08] text-white"
                                    : "border-white/[0.06] text-white/40"
                                }`}
                                style={isCorrect ? { borderColor: `${color}80`, backgroundColor: `${color}1a`, color: color } : undefined}
                              >
                                <span className="mr-3 text-xs font-bold opacity-50">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <RichText>{opt}</RichText>
                                {isCorrect && <span className="ml-2 text-xs">✓</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
                        <div className="micro mb-2" style={{ color }}>Explanation</div>
                        <RichText className="block text-sm leading-relaxed text-muted">
                          {q.model_answer}
                        </RichText>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <button
                    onClick={handlePrev}
                    className="p-2 text-faint transition-colors hover:text-white"
                    aria-label="Previous question"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 text-faint transition-colors hover:text-white"
                    aria-label="Next question"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
