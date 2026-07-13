"use client";

import { useMemo } from "react";
import type { Profile, Review } from "@/lib/types";
import { levelForXp, levelTitle, LEVEL_TITLES } from "@/lib/types";
import { FlameIcon } from "./Nav";

/**
 * The addictive bit: a winding level path (constellation), XP progress,
 * streak, and an activity heatmap built from review history.
 */
export default function ProgressMap({
  profile,
  reviews,
}: {
  profile: Profile;
  reviews: Review[];
}) {
  const { level, into, needed } = levelForXp(profile.xp);

  return (
    <div className="glass p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="micro mb-1">Momentum</p>
          <h2 className="text-xl font-bold">Progress map</h2>
          <p className="text-sm text-muted">
            Level {level} · <span className="text-[#f5b95f]">{levelTitle(level)}</span>
          </p>
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

      {/* XP bar */}
      <div className="mb-1 flex items-center justify-between text-xs text-muted">
        <span>{profile.xp.toLocaleString()} XP total</span>
        <span>
          {into}/{needed} to level {level + 1}
        </span>
      </div>
      <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ff7a5c] to-[#f5b95f] shadow-[0_0_12px_rgba(255,122,92,0.55)] transition-all duration-700"
          style={{ width: `${Math.min(100, (into / needed) * 100)}%` }}
        />
      </div>

      {/* Level constellation path */}
      <LevelPath current={level} />

      {/* Activity heatmap */}
      <Heatmap reviews={reviews} />
    </div>
  );
}

function LevelPath({ current }: { current: number }) {
  const N = LEVEL_TITLES.length;
  // Winding path across a 640x110 viewBox.
  const points = Array.from({ length: N }, (_, i) => ({
    x: 30 + (i * 580) / (N - 1),
    y: 58 + (i % 2 === 0 ? -26 : 26) * (0.5 + 0.5 * Math.sin(i * 1.7)),
  }));
  const d = points
    .map((p, i) =>
      i === 0
        ? `M ${p.x} ${p.y}`
        : `C ${(points[i - 1].x + p.x) / 2} ${points[i - 1].y}, ${(points[i - 1].x + p.x) / 2} ${p.y}, ${p.x} ${p.y}`
    )
    .join(" ");

  return (
    <svg viewBox="0 0 640 116" className="mb-4 w-full">
      <path d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      {/* lit portion of the path */}
      <path
        d={d}
        fill="none"
        stroke="url(#lvlGrad)"
        strokeWidth="3"
        pathLength={100}
        strokeDasharray={`${((Math.min(current, N) - 1) / (N - 1)) * 100} 100`}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="lvlGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff7a5c" />
          <stop offset="100%" stopColor="#f5b95f" />
        </linearGradient>
      </defs>
      {points.map((p, i) => {
        const lvl = i + 1;
        const reached = lvl <= current;
        const isCurrent = lvl === current;
        return (
          <g key={i}>
            {isCurrent && (
              <circle cx={p.x} cy={p.y} r="13" fill="rgba(255,122,92,0.25)" className="pulse-glow" />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={isCurrent ? 8 : 6}
              fill={reached ? (isCurrent ? "#ffb09b" : "#ff7a5c") : "#221f26"}
              stroke={reached ? "#ffd9c4" : "rgba(255,252,245,0.15)"}
              strokeWidth="1.5"
            />
            <text
              x={p.x}
              y={p.y + (p.y < 58 ? -16 : 24)}
              textAnchor="middle"
              fontSize="10"
              fill={reached ? "#f0c9a8" : "#6d6875"}
              fontWeight={isCurrent ? 700 : 400}
            >
              {LEVEL_TITLES[i]}
            </text>
          </g>
        );
      })}
    </svg>
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
        <span className="micro">Review activity</span>
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
