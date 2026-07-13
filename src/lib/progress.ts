import type { SupabaseClient } from "@supabase/supabase-js";

/** Award XP and keep the daily streak up to date. Returns the XP awarded. */
export async function awardXp(
  supabase: SupabaseClient,
  userId: string,
  xp: number
): Promise<number> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, streak, longest_streak, last_active")
    .eq("id", userId)
    .single();
  if (!profile) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let streak = profile.streak;
  if (profile.last_active !== today) {
    streak = profile.last_active === yesterday ? profile.streak + 1 : 1;
  }

  await supabase
    .from("profiles")
    .update({
      xp: profile.xp + xp,
      streak,
      longest_streak: Math.max(profile.longest_streak, streak),
      last_active: today,
    })
    .eq("id", userId);

  return xp;
}
