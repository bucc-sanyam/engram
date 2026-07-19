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

    </section>
  );
}
