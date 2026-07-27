/**
 * Pure streak math, timezone-aware and dependency-free so it can be unit-tested
 * and reused by the streak-repair API without hitting Supabase. "Day" is always
 * the user's LOCAL calendar day (see dates.ts) — a day key is "YYYY-MM-DD",
 * which sorts lexicographically = chronologically.
 *
 * The repair logic is derived from the ACTIVE-DAY history (days with a review or
 * a bought-back repair), never from the stored `last_active` field: finishing
 * the make-up recall runs advanceStreak and moves `last_active` to today, so a
 * field-based gap would vanish before the repair is redeemed. History is stable.
 */
import { localTodayForOffset } from "./dates";

const DAY_MS = 86400000;

/** Day key `daysAgo` days before `nowMs`, in the client's timezone. */
export function dayKeyDaysAgo(tzMin: number, daysAgo: number, nowMs = Date.now()): string {
  return localTodayForOffset(tzMin, nowMs - daysAgo * DAY_MS);
}

/** Bucket a timestamp (ms or ISO string) into its local day key for the client tz. */
export function localDayKeyForTs(ts: number | string, tzMin: number): string {
  const ms = typeof ts === "number" ? ts : Date.parse(ts);
  return localTodayForOffset(tzMin, ms);
}

/**
 * Length of the unbroken run of active days going backwards, starting at
 * `startDaysAgo` (0 = today). Stops at the first inactive day.
 */
export function consecutiveRun(
  activeDays: ReadonlySet<string>,
  tzMin: number,
  startDaysAgo = 0,
  nowMs = Date.now(),
  maxLookback = 3660
): number {
  let count = 0;
  for (let d = startDaysAgo; d <= startDaysAgo + maxLookback; d++) {
    if (activeDays.has(dayKeyDaysAgo(tzMin, d, nowMs))) count++;
    else break;
  }
  return count;
}

/** The current streak: the unbroken active run ending at TODAY (0 if today is inactive). */
export function consecutiveStreakEndingToday(
  activeDays: ReadonlySet<string>,
  tzMin: number,
  nowMs = Date.now()
): number {
  return consecutiveRun(activeDays, tzMin, 0, nowMs);
}

export interface RepairableGap {
  /** Inactive days between the streak and today that a repair would cover (chronological). */
  missed: string[];
  /** Days-ago offset of the active day the broken streak hangs from, or null if none exists. */
  anchorDaysAgo: number | null;
}

/**
 * Find the gap that broke the streak: the run of inactive days immediately
 * before today, bounded by the prior active day it "hangs" from. Returns an
 * empty `missed` when yesterday was active (streak intact) or when no active
 * day exists within the lookback (no streak worth saving). Today's activity is
 * irrelevant — the make-up recall may or may not have happened yet.
 */
export function findRepairableGap(
  activeDays: ReadonlySet<string>,
  tzMin: number,
  nowMs = Date.now(),
  maxLookback = 60
): RepairableGap {
  const missed: string[] = [];
  for (let d = 1; d <= maxLookback; d++) {
    const key = dayKeyDaysAgo(tzMin, d, nowMs);
    if (activeDays.has(key)) return { missed: missed.reverse(), anchorDaysAgo: d };
    missed.push(key);
  }
  return { missed: [], anchorDaysAgo: null };
}
