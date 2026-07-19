"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isDemo } from "@/lib/data";
import { getStartedStories, getStorySections, getResumeHref, startStory, updateStoryColor, endStory } from "@/lib/stories";

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
  const [resumeHref, setResumeHref] = useState(firstSectionHref);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuit, setShowQuit] = useState(false);
  const [quitText, setQuitText] = useState("");

  useEffect(() => {
    if (isDemo) {
      setState("guest");
      return;
    }
    Promise.all([getStartedStories(), getStorySections(seriesSlug)])
      .then(async ([stories, sections]) => {
        const started = stories.find((s) => s.series_slug === seriesSlug);
        setLearned(sections.filter((s) => s.status === "learned").length);
        if (started) {
          setColor(started.color);
          setState("started");
          // Resolve the resume point — first unlearned section in reading order
          try {
            const href = await getResumeHref(seriesSlug);
            setResumeHref(href);
          } catch {
            // fall back to firstSectionHref
          }
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
            <Link href={resumeHref} className="btn-primary whitespace-nowrap">
              Continue →
            </Link>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5">
          <span className="micro">Brain colour</span>
          <div className="flex gap-2">
            {STORY_COLORS.map((c) => (
              <button
                key={c}
                onClick={async () => {
                  const old = color;
                  setColor(c);
                  setError(null);
                  try {
                    await updateStoryColor(seriesSlug, c);
                  } catch (e) {
                    setColor(old);
                    setError(e instanceof Error ? e.message : "Could not update colour");
                  }
                }}
                aria-label={`Pick colour ${c}`}
                className={`h-6 w-6 rounded-full transition-transform ${color === c ? "scale-110 ring-2 ring-white/60" : "hover:scale-105"}`}
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {!showQuit ? (
              <button
                onClick={() => setShowQuit(true)}
                className="text-xs font-semibold text-[#ff7a5c] transition-colors hover:text-white"
              >
                End story
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder='Type "I quit"'
                  value={quitText}
                  onChange={(e) => {
                    setQuitText(e.target.value);
                    setError(null);
                  }}
                  className="input !rounded-full px-3 py-1 text-xs w-32 bg-white/[0.04] border border-white/[0.1]"
                  autoFocus
                />
                <button
                  onClick={async () => {
                    if (quitText !== "I quit") {
                      setError("Type exactly 'I quit'");
                      return;
                    }
                    setBusy(true);
                    setError(null);
                    try {
                      await endStory(seriesSlug);
                      setState("new");
                      setLearned(0);
                      setShowQuit(false);
                      setQuitText("");
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Could not end story");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  disabled={busy}
                  className="text-xs font-semibold text-[#ff7a5c] transition-colors hover:text-white"
                >
                  {busy ? "Ending..." : "Confirm"}
                </button>
                <button
                  onClick={() => {
                    setShowQuit(false);
                    setQuitText("");
                    setError(null);
                  }}
                  disabled={busy}
                  className="text-xs text-faint hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            {error && <span className="text-xs text-[#ff7a5c]">{error}</span>}
          </div>
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
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
