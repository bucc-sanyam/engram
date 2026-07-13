"use client";

import { useEffect, useMemo, useState } from "react";
import ReportCardView from "@/components/ReportCardView";
import { getDayReport } from "@/lib/data";
import type { Review, ReportCard } from "@/lib/types";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MAX_MONTHS_BACK = 11;

const dayKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/**
 * Month-view study calendar: days light up with review activity, and clicking
 * a lit day opens the full report card for that day — every question asked,
 * the answer given, the correct answer and the feedback.
 */
export default function ProgressCalendar({ reviews }: { reviews: Review[] }) {
  const [monthsBack, setMonthsBack] = useState(0);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [dayReport, setDayReport] = useState<ReportCard | null>(null);
  const [loadingDay, setLoadingDay] = useState(false);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of reviews) {
      const day = r.created_at.slice(0, 10);
      m.set(day, (m.get(day) ?? 0) + 1);
    }
    return m;
  }, [reviews]);

  useEffect(() => {
    if (!openDay) return;
    let cancelled = false;
    setLoadingDay(true);
    setDayReport(null);
    getDayReport(openDay)
      .then((r) => { if (!cancelled) setDayReport(r); })
      .catch(() => { if (!cancelled) setDayReport(null); })
      .finally(() => { if (!cancelled) setLoadingDay(false); });
    return () => { cancelled = true; };
  }, [openDay]);

  // Lock background scroll while the day report is open.
  useEffect(() => {
    if (!openDay) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [openDay]);

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
        {days.map((d) =>
          d.count > 0 ? (
            <button
              key={d.key}
              onClick={() => setOpenDay(d.key)}
              title={`${d.key} — ${d.count} question${d.count === 1 ? "" : "s"} answered. Click for the day's report card.`}
              className={`mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[12px] transition-all hover:scale-110 hover:ring-2 hover:ring-white/30 ${dayClasses(d)}`}
            >
              {d.day}
            </button>
          ) : (
            <div
              key={d.key}
              title={`${d.key} — no reviews`}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[12px] transition-colors ${dayClasses(d)}`}
            >
              {d.day}
            </div>
          )
        )}
      </div>

      <p className="mt-4 text-xs text-faint">
        {activeDays > 0
          ? `${activeDays} active day${activeDays === 1 ? "" : "s"} this month — tap a lit day to see that day's report card.`
          : "No reviews this month yet — today is a good day to start."}
      </p>

      {/* Day report modal */}
      {openDay && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0b0a0e]/80 px-4 py-10 backdrop-blur-sm sm:py-14"
          onClick={() => setOpenDay(null)}
        >
          <div
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {new Date(openDay + "T12:00:00").toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <button
                onClick={() => setOpenDay(null)}
                aria-label="Close day report"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-muted transition-colors hover:bg-white/[0.12] hover:text-white"
              >
                ✕
              </button>
            </div>

            {loadingDay && (
              <div className="glass flex items-center justify-center gap-3 p-14 text-muted">
                Pulling up that day&apos;s report card…
              </div>
            )}

            {!loadingDay && dayReport && (
              <ReportCardView report={dayReport} heading="Day report" />
            )}

            {!loadingDay && !dayReport && (
              <div className="glass p-10 text-center text-muted">
                No detailed answers stored for this day — newer sessions will
                keep the full question-by-question history.
              </div>
            )}

            <div className="mt-5 flex justify-center pb-6">
              <button className="btn-ghost" onClick={() => setOpenDay(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
