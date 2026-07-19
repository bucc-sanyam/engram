"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isDemo } from "@/lib/data";
import { getStartedStories, getStorySections, startStory } from "@/lib/stories";

/** Palette a learner can pick for this story's nodes on their brain. */
const STORY_COLORS = ["#5ba4cf", "#f5b95f", "#43d6b5", "#ff8fb1", "#bfa8f5", "#ff7a5c"];

/**
 * Start / continue control for a learnable Story, shown on a series hub. Seeds
 * the whole series onto the reader's brain (dormant topics) on start; afterwards
 * shows learned progress. Guests get a sign-in gate.
 */
export default function StoryStartControl({
  seriesSlug,
  total,
  firstSectionHref,
}: {
  seriesSlug: string;
  total: number;
  firstSectionHref: string;
}) {
  const [state, setState] = useState<"unknown" | "guest" | "new" | "started">("unknown");
  const [learned, setLearned] = useState(0);
  const [color, setColor] = useState(STORY_COLORS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemo) {
      setState("guest");
      return;
    }
    Promise.all([getStartedStories(), getStorySections(seriesSlug)])
      .then(([stories, sections]) => {
        const started = stories.find((s) => s.series_slug === seriesSlug);
        setLearned(sections.filter((s) => s.status === "learned").length);
        if (started) {
          setColor(started.color);
          setState("started");
        } else {
          setState("new");
        }
      })
      .catch(() => setState("new"));
  }, [seriesSlug]);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      await startStory(seriesSlug, color);
      setState("started");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (state === "unknown") {
    return <div className="h-24 animate-pulse rounded-[1.5rem] bg-white/[0.04]" />;
  }

  if (state === "guest") {
    return (
      <div className="glass flex flex-col gap-4 rounded-[1.5rem] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-bold text-white/90">Learn this, don&apos;t just read it</p>
          <p className="mt-1 text-sm text-muted">
            Sign in to add these {total} sections to your brain and get spaced-repetition quizzes.
          </p>
        </div>
        <Link href="/login" className="btn-primary shrink-0 whitespace-nowrap">
          Sign in to learn
        </Link>
      </div>
    );
  }

  if (state === "started") {
    const pct = total ? Math.round((learned / total) * 100) : 0;
    return (
      <div className="glass rounded-[1.5rem] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-white/90">You&apos;re learning this story</p>
            <p className="mt-1 text-sm text-muted">
              {learned} / {total} sections learned. Mark more as you read.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/brain" className="btn-ghost whitespace-nowrap">
              See on brain
            </Link>
            <Link href={firstSectionHref} className="btn-primary whitespace-nowrap">
              Continue →
            </Link>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    );
  }

  // state === "new"
  return (
    <div className="glass rounded-[1.5rem] p-5">
      <p className="text-base font-bold text-white/90">Learn this, don&apos;t just read it</p>
      <p className="mt-1 text-sm text-muted">
        Add all {total} sections to your brain as a connected story, then mark each one learned to
        pull its questions into your spaced-repetition reviews.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="micro">Brain colour</span>
        <div className="flex gap-2">
          {STORY_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Pick colour ${c}`}
              className={`h-6 w-6 rounded-full transition-transform ${color === c ? "scale-110 ring-2 ring-white/60" : "hover:scale-105"}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button onClick={start} disabled={busy} className="btn-primary">
          {busy ? "Setting up…" : "Start learning this story"}
        </button>
        <Link href={firstSectionHref} className="text-sm font-semibold text-faint transition-colors hover:text-white">
          Just read it →
        </Link>
      </div>
      {error && <p className="mt-3 text-sm text-[#ff7a5c]">{error}</p>}
    </div>
  );
}
