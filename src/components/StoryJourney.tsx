"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { StorySection, UserStory } from "@/lib/stories";

/** Display titles for each series. */
const SERIES_TITLES: Record<string, string> = {
  "competition-act": "The Competition Code",
  dsa: "The Pattern Atlas",
  sql: "The Query Playbook",
};

const SERIES_META: Record<string, { emoji: string; href: string }> = {
  "competition-act": { emoji: "⚖️", href: "/blogs/competition-act" },
  dsa: { emoji: "🧠", href: "/blogs/dsa" },
  sql: { emoji: "🔍", href: "/blogs/sql" },
};

/**
 * Beautiful animated story journey visualization — shows radial progress
 * rings + chapter bead trail for each started story.
 */
export default function StoryJourney({
  stories,
  storySections,
}: {
  stories: UserStory[];
  storySections: StorySection[];
}) {
  if (!stories.length) return null;

  return (
    <section className="glass rise rise-2 relative overflow-hidden p-6 sm:p-7">
      <div
        className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full opacity-[0.1] blur-3xl"
        style={{ background: "linear-gradient(135deg, #bfa8f5, #ff7a5c)" }}
        aria-hidden
      />
      <div className="mb-5">
        <p className="micro mb-1 !text-[#bfa8f5]">Journey map</p>
        <h2 className="text-xl font-bold">Your stories</h2>
      </div>

      <div className="space-y-5">
        {stories.map((story) => {
          const sections = storySections.filter(
            (s) => s.series_slug === story.series_slug
          );
          return (
            <StoryRing
              key={story.series_slug}
              story={story}
              sections={sections}
            />
          );
        })}
      </div>
    </section>
  );
}

function StoryRing({
  story,
  sections,
}: {
  story: UserStory;
  sections: StorySection[];
}) {
  const total = sections.length;
  const learned = sections.filter((s) => s.status === "learned").length;
  const pct = total ? Math.round((learned / total) * 100) : 0;
  const meta = SERIES_META[story.series_slug];
  const title = SERIES_TITLES[story.series_slug] ?? story.series_slug;

  // Animated counter + ring
  const [animPct, setAnimPct] = useState(0);
  const [animCount, setAnimCount] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    // Animate the percentage fill
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      if (!mounted.current) return;
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimPct(pct * ease);
      setAnimCount(Math.round(learned * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      mounted.current = false;
    };
  }, [pct, learned]);

  // SVG ring dimensions
  const size = 72;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - animPct / 100);

  // Group sections by chapter for bead trail
  const chapters = useMemo(() => {
    const map = new Map<
      string,
      { slug: string; sections: StorySection[] }
    >();
    for (const s of sections) {
      if (!map.has(s.chapter_slug)) {
        map.set(s.chapter_slug, { slug: s.chapter_slug, sections: [] });
      }
      map.get(s.chapter_slug)!.sections.push(s);
    }
    return Array.from(map.values());
  }, [sections]);

  return (
    <Link
      href={meta?.href ?? `/blogs/${story.series_slug}`}
      className="group flex items-center gap-4 rounded-[1.25rem] p-3 transition-colors hover:bg-white/[0.03]"
    >
      {/* Radial progress ring */}
      <div className="relative shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,252,245,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={story.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 0.1s linear",
              filter: `drop-shadow(0 0 6px ${story.color}66)`,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="display text-lg font-bold tabular-nums leading-none"
            style={{ color: story.color }}
          >
            {Math.round(animPct)}%
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {meta && <span className="text-sm">{meta.emoji}</span>}
          <h3 className="truncate text-sm font-bold text-white/90 transition-colors group-hover:text-white">
            {title}
          </h3>
        </div>
        <p className="mt-0.5 text-xs text-faint">
          <span style={{ color: story.color }}>{animCount}</span> / {total}{" "}
          sections learned
        </p>

        {/* Chapter bead trail */}
        {chapters.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {chapters.map((ch) => {
              const chLearned = ch.sections.filter(
                (s) => s.status === "learned"
              ).length;
              const chTotal = ch.sections.length;
              const allDone = chLearned === chTotal;
              const anyDone = chLearned > 0;
              return (
                <div
                  key={ch.slug}
                  title={`${ch.slug}: ${chLearned}/${chTotal}`}
                  className="relative h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(8, (chTotal / total) * 100)}%`,
                    background: allDone
                      ? story.color
                      : anyDone
                        ? `linear-gradient(90deg, ${story.color} ${(chLearned / chTotal) * 100}%, rgba(255,252,245,0.08) ${(chLearned / chTotal) * 100}%)`
                        : "rgba(255,252,245,0.08)",
                    boxShadow: allDone
                      ? `0 0 8px ${story.color}44`
                      : "none",
                  }}
                >
                  {anyDone && !allDone && (
                    <div
                      className="absolute right-0 top-0 h-full w-[3px] rounded-full"
                      style={{
                        background: story.color,
                        boxShadow: `0 0 4px ${story.color}`,
                        animation: "pulseGlow 2.4s ease-in-out infinite",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Arrow */}
      <span
        aria-hidden
        className="shrink-0 text-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
        style={{ color: story.color }}
      >
        →
      </span>
    </Link>
  );
}
