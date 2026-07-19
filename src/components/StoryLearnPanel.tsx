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

      {/* Q&A — revealed once learned */}
      {status === "learned" && hasBank && (
        <div className="mt-8">
          <h2 className="micro mb-2" style={{ color }}>
            Questions &amp; answers
          </h2>
          <p className="mb-6 text-sm text-faint">
            Every quiz question drawn from this section. Try answering before you peek.
          </p>
          <ul className="space-y-3">
            {questions.map((q, qi) => (
              <li key={qi}>
                <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors open:bg-white/[0.03]">
                  <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                    <span className="micro mt-1 shrink-0 rounded-full bg-white/[0.05] px-2.5 py-0.5">
                      {KIND_LABEL[q.kind] ?? q.kind}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-medium leading-relaxed">
                      {q.prompt}
                    </span>
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 text-faint transition-transform group-open:rotate-90"
                    >
                      ›
                    </span>
                  </summary>
                  <div className="space-y-2.5 px-4 pb-4">
                    {q.options && (
                      <div className="space-y-1.5">
                        {q.options.map((opt, i) => {
                          const isCorrect =
                            q.kind === "multi"
                              ? q.correct_indices?.includes(i) ?? false
                              : i === q.correct_index;
                          return (
                            <div
                              key={i}
                              className={`rounded-xl border px-3.5 py-2 text-sm leading-relaxed ${
                                isCorrect
                                  ? "border-[#43d6b5]/50 bg-[#43d6b5]/[0.08] text-[#7fe5cb]"
                                  : "border-white/[0.06] text-white/55"
                              }`}
                            >
                              <span className="mr-2 text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                              {opt}
                              {isCorrect && <span className="ml-2 text-xs">✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="rounded-xl bg-[#43d6b5]/[0.05] p-3.5">
                      <div className="micro mb-1 !text-[#43d6b5]">Answer</div>
                      <p className="text-sm leading-relaxed text-muted">{q.model_answer}</p>
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
