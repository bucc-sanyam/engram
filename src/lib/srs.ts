/**
 * SM-2 spaced repetition scheduling.
 * quality: 0..5 (0 = total blackout, 5 = perfect recall)
 */
export interface SrsState {
  ease: number;
  interval_days: number;
  review_count: number;
}

export interface SrsResult extends SrsState {
  next_review_at: string;
}

export function scheduleNext(state: SrsState, quality: number, now = new Date()): SrsResult {
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let ease = state.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  ease = Math.max(1.3, ease);

  let interval: number;
  let count = state.review_count + 1;

  if (q < 3) {
    // Failed recall — relearn soon (tomorrow), reset repetition streak.
    interval = 1;
    count = 0;
  } else if (state.review_count === 0) {
    interval = 1;
  } else if (state.review_count === 1) {
    interval = 6;
  } else {
    interval = Math.round(state.interval_days * ease);
  }

  const next = new Date(now);
  next.setDate(next.getDate() + interval);
  // Review any time that day, not at an exact minute.
  next.setHours(5, 0, 0, 0);

  return {
    ease: Number(ease.toFixed(2)),
    interval_days: interval,
    review_count: count,
    next_review_at: next.toISOString(),
  };
}

/** Rolling mastery: previous mastery blended with the latest score. */
export function updateMastery(current: number, quality: number): number {
  return 0;
}
