"use client";

import { useMemo, useState } from "react";
import type { Review } from "@/lib/types";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MAX_MONTHS_BACK = 11;

const dayKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Month-view study calendar: days light up with review activity. */
export default function ProgressCalendar({ reviews }: { reviews: Review[] }) {
  const [monthsBack, setMonthsBack] = useState(0);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of reviews) {
      const day = r.created_at.slice(0, 10);
      m.set(day, (m.get(day) ?? 0) + 1);
    }
    return m;
  }, [reviews]);

  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const todayKey = dayKey(now.getFullYear(), now.getMonth(), now.getDate());

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const key = dayKey(first.getFullYear(), first.getMonth(), i + 1);
    return {
      day: i + 1,
      key,
      count: counts.get(key) ?? 0,
      isToday: key === todayKey,
      isFuture: key > todayKey,
    };
  });
  const activeDays = days.filter((d) => d.count > 0).length;

  return (
    <section className="glass rise rise-2 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="micro mb-1">Consistency</p>
          <h2 className="text-xl font-bold">Progress calendar</h2>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            aria-label="Previous month"
            onClick={() => setMonthsBack((m) => Math.min(MAX_MONTHS_BACK, m + 1))}
            disabled={monthsBack >= MAX_MONTHS_BACK}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            ‹
          </button>
          <span className="min-w-[7.5rem] text-center text-sm font-medium text-muted">
            {first.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </span>
          <button
            aria-label="Next month"
            onClick={() => setMonthsBack((m) => Math.max(0, m - 1))}
            disabled={monthsBack === 0}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((w, i) => (
          <div key={`${w}-${i}`} className="micro py-1">
            {w}
          </div>
        ))}
        {Array.from({ length: first.getDay() }, (_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((d) => (
          <div
            key={d.key}
            title={`${d.key} — ${d.count} review${d.count === 1 ? "" : "s"}`}
            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[12px] transition-colors ${dayClasses(d)}`}
          >
            {d.day}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-faint">
        {activeDays > 0
          ? `${activeDays} active day${activeDays === 1 ? "" : "s"} this month — keep the flame alive.`
          : "No reviews this month yet — today is a good day to start."}
      </p>
    </section>
  );
}

function dayClasses(d: { count: number; isToday: boolean; isFuture: boolean }): string {
  const ring = d.isToday ? " ring-1 ring-[#f5b95f]/80" : "";
  if (d.count >= 4)
    return (
      "bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] font-semibold text-[#1a120e] shadow-[0_0_14px_rgba(255,122,92,0.45)]" +
      ring
    );
  if (d.count >= 2)
    return "bg-[#ff7a5c]/[0.42] text-[#ffe3d7] shadow-[0_0_10px_rgba(255,122,92,0.22)]" + ring;
  if (d.count >= 1) return "bg-[#ff7a5c]/[0.18] text-[#ffb09b]" + ring;
  if (d.isFuture) return "text-white/15" + ring;
  return "text-faint" + ring;
}
