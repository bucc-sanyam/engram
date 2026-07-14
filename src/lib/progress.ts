import type { SupabaseClient } from "@supabase/supabase-js";
import { localTodayForOffset } from "./dates";

/**
 * Keep the daily streak up to date (XP itself is retired — always written as 0).
 * `tzMin` is the client's timezone offset so "today" is the user's local day,
 * not the server's UTC day.
 */
export async function awardXp(
  supabase: SupabaseClient,
  userId: string,
  xp: number,
  tzMin = 0
): Promise<number> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, streak, longest_streak, last_active")
    .eq("id", userId)
    .single();
  if (!profile) return 0;

  const today = localTodayForOffset(tzMin);
  const yesterday = localTodayForOffset(tzMin, Date.now() - 86400000);

  let streak = profile.streak;
  if (profile.last_active !== today) {
    streak = profile.last_active === yesterday ? profile.streak + 1 : 1;
  }

  await supabase
    .from("profiles")
    .update({
      xp: 0,
      streak,
      longest_streak: Math.max(profile.longest_streak, streak),
      last_active: today,
    })
    .eq("id", userId);

  return 0;
}
