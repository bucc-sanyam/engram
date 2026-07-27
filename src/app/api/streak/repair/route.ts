import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clampTz, localTodayForOffset } from "@/lib/dates";
import {
  consecutiveRun,
  consecutiveStreakEndingToday,
  findRepairableGap,
  localDayKeyForTs,
} from "@/lib/streak";
import type { ReportCard } from "@/lib/types";

/**
 * Streak repair (PREMIUM) — maintain a streak that a missed day would break, by
 * attempting an older day's recall. This is the effortful, on-brand version of
 * a "streak freeze": you don't buy the day back with a tap, you earn it by
 * actually recalling.
 *
 *   GET  /api/streak/repair?tz=<offset>   → eligibility + what's at risk
 *   POST /api/streak/repair { tz, sessionId }
 *        → after the user completes the older-day recall (a graded quiz
 *          session), backfills the missed day(s) and RECOMPUTES the streak
 *          from real history so it can never be set to an arbitrary value.
 *
 * The gap and streak are derived from `reviews` (active days) ∪ `streak_repairs`
 * (bought-back days), never from the stored `last_active`/`streak` fields — the
 * make-up recall's own `finish` advances those, so field-based logic would race.
 */

// How large a gap the feature will offer to repair (missed days between the
// streak and today). Default 1 = "you missed yesterday". One redemption bridges
// the whole offered gap.
const REPAIR_MAX_GAP_DAYS = Math.max(1, Number(process.env.STREAK_REPAIR_MAX_GAP_DAYS || 1));
// Fair-use cap: repairs allowed per rolling 30 days.
const REPAIR_ROLLING_LIMIT = Math.max(1, Number(process.env.STREAK_REPAIR_MONTHLY_LIMIT || 3));
// How far back active/covered days are loaded when detecting the gap / recomputing.
const LOOKBACK_DAYS = 60;
const DAY_MS = 86400000;

type Ineligible = "not_premium" | "no_gap" | "gap_too_large" | "rate_limited";

interface RepairStatus {
  is_premium: boolean;
  eligible: boolean;
  reason: Ineligible | null;
  /** Missed local days (YYYY-MM-DD) this repair would cover, chronological. */
  missed_days: string[];
  /** The streak the user stands to lose if the gap isn't repaired. */
  streak_at_risk: number;
  current_streak: number;
  repairs_used: number;
  repairs_limit: number;
}

/** Active local days over the lookback window: review days ∪ bought-back days. */
async function loadActiveDays(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  tz: number
): Promise<Set<string>> {
  const sinceIso = new Date(Date.now() - LOOKBACK_DAYS * DAY_MS).toISOString();
  const sinceDay = localTodayForOffset(tz, Date.now() - LOOKBACK_DAYS * DAY_MS);
  const [{ data: reviews }, { data: repairs }] = await Promise.all([
    supabase.from("reviews").select("created_at").eq("user_id", userId).gte("created_at", sinceIso),
    supabase.from("streak_repairs").select("covered_day").eq("user_id", userId).gte("covered_day", sinceDay),
  ]);
  const days = new Set<string>();
  for (const r of reviews ?? []) days.add(localDayKeyForTs(r.created_at as string, tz));
  for (const r of repairs ?? []) days.add(r.covered_day as string);
  return days;
}

/** Repairs in the trailing 30 days (fair-use window). */
async function repairsUsed(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<number> {
  const since = new Date(Date.now() - 30 * DAY_MS).toISOString();
  const { count } = await supabase
    .from("streak_repairs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);
  return count ?? 0;
}

/** Shared eligibility computation for GET and POST. */
async function computeStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  tz: number
): Promise<RepairStatus> {
  const [{ data: profile }, activeDays, used] = await Promise.all([
    supabase.from("profiles").select("is_premium, streak").eq("id", userId).maybeSingle(),
    loadActiveDays(supabase, userId, tz),
    repairsUsed(supabase, userId),
  ]);

  const isPremium = !!profile?.is_premium;
  const gap = findRepairableGap(activeDays, tz);
  // Streak that would survive if the gap is bridged (the run ending at the anchor day).
  const streakAtRisk =
    gap.anchorDaysAgo != null ? consecutiveRun(activeDays, tz, gap.anchorDaysAgo) : 0;

  let reason: Ineligible | null = null;
  if (!isPremium) reason = "not_premium";
  else if (gap.missed.length === 0) reason = "no_gap";
  else if (gap.missed.length > REPAIR_MAX_GAP_DAYS) reason = "gap_too_large";
  else if (used >= REPAIR_ROLLING_LIMIT) reason = "rate_limited";

  return {
    is_premium: isPremium,
    eligible: reason === null,
    reason,
    missed_days: gap.missed,
    streak_at_risk: streakAtRisk,
    current_streak: profile?.streak ?? 0,
    repairs_used: used,
    repairs_limit: REPAIR_ROLLING_LIMIT,
  };
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const tz = clampTz(new URL(request.url).searchParams.get("tz"));
  return NextResponse.json(await computeStatus(supabase, user.id, tz));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let body: { tz?: number; sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const tz = clampTz(body.tz);
  const { sessionId } = body;
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId", code: "missing_session" }, { status: 400 });
  }

  const status = await computeStatus(supabase, user.id, tz);
  if (!status.eligible) {
    // 403 for the paywall case so the client can show an upsell; 409 for the
    // "nothing to repair / rate-limited" cases.
    const httpStatus = status.reason === "not_premium" ? 403 : 409;
    return NextResponse.json(
      { error: reasonMessage(status.reason), code: status.reason, status },
      { status: httpStatus }
    );
  }
  const coveredDays = status.missed_days;

  // Proof-of-effort: the redemption must be backed by a real recall the user
  // completed TODAY — validate ownership, graded, done today, ≥1 attempt, and
  // that this session hasn't already funded a repair.
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("id, status, report, created_at")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!session || session.status !== "graded" || !session.report) {
    return NextResponse.json({ error: "Complete an older-day recall first.", code: "session_invalid" }, { status: 400 });
  }
  const today = localTodayForOffset(tz);
  if (localDayKeyForTs(session.created_at as string, tz) !== today) {
    return NextResponse.json({ error: "The recall must be attempted today.", code: "session_stale" }, { status: 400 });
  }
  if (!(session.report as ReportCard).items?.some((i) => !i.skipped)) {
    return NextResponse.json({ error: "You need to actually attempt the recall.", code: "session_empty" }, { status: 400 });
  }
  const { data: reused } = await supabase
    .from("streak_repairs")
    .select("id")
    .eq("user_id", user.id)
    .eq("session_id", sessionId)
    .maybeSingle();
  if (reused) {
    return NextResponse.json({ error: "That recall was already used for a repair.", code: "session_used" }, { status: 409 });
  }

  // Backfill the missed day(s). unique(user_id, covered_day) + ignoreDuplicates
  // makes a retried request idempotent.
  const { error: insertErr } = await supabase
    .from("streak_repairs")
    .upsert(
      coveredDays.map((day) => ({ user_id: user.id, covered_day: day, session_id: sessionId })),
      { onConflict: "user_id,covered_day", ignoreDuplicates: true }
    );
  if (insertErr) {
    console.error("streak_repairs insert failed", insertErr);
    return NextResponse.json({ error: "Could not record the repair.", code: "write_failed" }, { status: 500 });
  }

  // Recompute the streak authoritatively from active + covered days (now
  // including the just-covered gap and today's make-up recall).
  const activeDays = await loadActiveDays(supabase, user.id, tz);
  activeDays.add(today); // the validated recall makes today active
  const newStreak = consecutiveStreakEndingToday(activeDays, tz);

  const { data: prof } = await supabase
    .from("profiles")
    .select("longest_streak")
    .eq("id", user.id)
    .maybeSingle();
  await supabase
    .from("profiles")
    .update({
      streak: newStreak,
      longest_streak: Math.max(prof?.longest_streak ?? 0, newStreak),
      last_active: today,
    })
    .eq("id", user.id);

  return NextResponse.json({ repaired: true, covered_days: coveredDays, streak: newStreak });
}

function reasonMessage(reason: Ineligible | null): string {
  switch (reason) {
    case "not_premium":
      return "Streak repair is a premium feature.";
    case "no_gap":
      return "Your streak is intact — nothing to repair.";
    case "gap_too_large":
      return "This streak has been broken for too long to repair.";
    case "rate_limited":
      return "You've used all your streak repairs for now.";
    default:
      return "Not eligible for a streak repair.";
  }
}
