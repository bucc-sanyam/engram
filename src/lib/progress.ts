import type { SupabaseClient } from "@supabase/supabase-js";
import { localTodayForOffset } from "./dates";

/**
 * Keep the daily streak up to date. `tzMin` is the client's timezone offset
 * so "today" is the user's local day, not the server's UTC day.
 */
export async function advanceStreak(
  supabase: SupabaseClient,
  userId: string,
  tzMin = 0
): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("streak, longest_streak, last_active")
    .eq("id", userId)
    .single();
  if (!profile) return;

  const today = localTodayForOffset(tzMin);
  const yesterday = localTodayForOffset(tzMin, Date.now() - 86400000);

  let streak = profile.streak;
  if (profile.last_active !== today) {
    streak = profile.last_active === yesterday ? profile.streak + 1 : 1;
  }

  await supabase
    .from("profiles")
    .update({
      streak,
      longest_streak: Math.max(profile.longest_streak, streak),
      last_active: today,
    })
    .eq("id", userId);
}
