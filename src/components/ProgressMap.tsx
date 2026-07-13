"use client";

import { useMemo } from "react";
import type { Profile, Review } from "@/lib/types";
import { FlameIcon } from "./Nav";

/** The next streak milestone worth chasing — keeps the bar always in reach. */
function nextMilestone(streak: number): number {
  const ladder = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365];
  return ladder.find((m) => m > streak) ?? (Math.floor(streak / 100) + 1) * 100;
}

/**
 * Shows the user's current review momentum: daily streak, progress toward the
 * next streak milestone, and the activity heatmap.
 */
export default function ProgressMap({
  profile,
  reviews,
}: {
  profile: Profile;
  reviews: Review[];
}) {
  const milestone = nextMilestone(profile.streak);
  const toGo = milestone - profile.streak;
  const pct = Math.max(4, Math.min(100, Math.round((profile.streak / milestone) * 100)));
  return (
    <div className="glass p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="micro mb-1">Momentum</p>
          <h2 className="text-xl font-bold">Review activity</h2>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-[#ff7a5c]/10 px-3.5 py-2">
          <FlameIcon className="h-5 w-5 text-[#ff7a5c]" />
          <div className="leading-tight">
            <div className="display text-lg font-bold text-[#ff9a80]">{profile.streak}</div>
            <div className="text-[10px] uppercase tracking-wider text-[#ff9a80]/70">
              day streak
            </div>
          </div>
        </div>
      </div>

      {/* Next streak milestone — always a target in sight */}
      <div className="mb-6">
        <div className="mb-2 flex items-baseline justify-between text-xs">
          <span className="font-semibold text-white/80">
            {toGo} day{toGo === 1 ? "" : "s"} to a {milestone}-day streak
          </span>
          <span className="text-faint">
            {profile.streak}/{milestone}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ff7a5c] to-[#f5b95f] shadow-[0_0_10px_rgba(255,122,92,0.5)] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-faint">
          {toGo <= 2
            ? "So close — don't break the chain now."
            : profile.streak >= profile.longest_streak && profile.streak > 0
              ? "This is your longest streak ever. Every day from here is a record."
              : `Your record is ${profile.longest_streak} days — this streak can beat it.`}
        </p>
      </div>

      {/* Activity heatmap */}
      <Heatmap reviews={reviews} />
    </div>
  );
}

function Heatmap({ reviews }: { reviews: Review[] }) {
  const WEEKS = 16;
  const cells = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of reviews) {
      const day = r.created_at.slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - (WEEKS * 7 - 1) - today.getDay());
    const out: { date: string; count: number }[] = [];
    const d = new Date(start);
    while (d <= today) {
      const key = d.toISOString().slice(0, 10);
      out.push({ date: key, count: counts.get(key) ?? 0 });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }, [reviews]);

  const shade = (c: number) =>
    c === 0
      ? "rgba(255,252,245,0.05)"
      : c < 2
        ? "rgba(255,122,92,0.3)"
        : c < 4
          ? "rgba(255,140,100,0.55)"
          : "rgba(245,185,95,0.95)";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="micro">Review history</span>
        <span className="micro">last {WEEKS} weeks</span>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-hidden">
        {cells.map((c) => (
          <div
            key={c.date}
            title={`${c.date} — ${c.count} review${c.count === 1 ? "" : "s"}`}
            className="h-[11px] w-[11px] rounded-full"
            style={{ background: shade(c.count) }}
          />
        ))}
      </div>
    </div>
  );
}
