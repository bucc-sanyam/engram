import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DailyPlan, PlanItem, ReviewMode, Topic } from "@/lib/types";

export const maxDuration = 60;

const MAX_ITEMS = 10;

/** Topics the user has already reviewed today — marks plan items as done. */
async function doneTopicsToday(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  today: string
): Promise<Set<string>> {
  const { data } = await supabase
    .from("reviews")
    .select("topic_id")
    .eq("user_id", userId)
    .gte("created_at", `${today}T00:00:00.000Z`);
  return new Set((data ?? []).map((r) => r.topic_id as string));
}

function markDone(plan: DailyPlan, done: Set<string>): DailyPlan {
  return {
    ...plan,
    items: plan.items.map((it) => ({ ...it, done: done.has(it.topic_id) })),
  };
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);

  // A plan is generated once per day and stays stable; the done flags are
  // recomputed from today's reviews on every read.
  const { data: saved } = await supabase
    .from("daily_plans")
    .select("plan, completed")
    .eq("user_id", user.id)
    .eq("plan_date", today)
    .maybeSingle();
  if (saved) {
    const done = await doneTopicsToday(supabase, user.id, today);
    return NextResponse.json({
      ...markDone(saved.plan as DailyPlan, done),
      completed: saved.completed,
    });
  }

  const { data: topicsData } = await supabase
    .from("topics")
    .select("*")
    .eq("user_id", user.id);
  const topics = (topicsData ?? []) as Topic[];

  if (topics.length === 0) {
    const empty: DailyPlan = {
      date: today,
      headline: "Your brain is empty — feed it your first conversation!",
      insight: "Paste your first AI conversation or reading notes and topics will start appearing here.",
      items: [],
      completed: false,
    };
    return NextResponse.json(empty);
  }

  // Which topics have flashcards (flashcard mode needs them).
  const { data: cardCounts } = await supabase
    .from("flashcards")
    .select("topic_id")
    .eq("user_id", user.id);
  const hasCards = new Set((cardCounts ?? []).map((c) => c.topic_id));

  const now = Date.now();
  const dayMs = 86400000;
  const picked: { topic: Topic; reason: string }[] = [];
  const pickedIds = new Set<string>();
  const add = (topic: Topic, reason: string) => {
    if (picked.length < MAX_ITEMS && !pickedIds.has(topic.id)) {
      picked.push({ topic, reason });
      pickedIds.add(topic.id);
    }
  };

  // 1. Due / overdue topics — most overdue first.
  topics
    .filter((t) => new Date(t.next_review_at).getTime() <= now)
    .sort((a, b) => new Date(a.next_review_at).getTime() - new Date(b.next_review_at).getTime())
    .forEach((t) => {
      const overdueDays = Math.floor((now - new Date(t.next_review_at).getTime()) / dayMs);
      add(t, overdueDays > 1 ? `Overdue by ${overdueDays} days` : "Due for review today");
    });

  // 2. Fresh topics from the last 3 days.
  topics
    .filter((t) => now - new Date(t.created_at).getTime() < 3 * dayMs)
    .forEach((t) => add(t, "Learnt in the last few days — lock it in"));

  // 3. Weakest topics.
  [...topics]
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3)
    .forEach((t) => add(t, `Struggling topic — mastery ${t.mastery}%`));

  // 4. Top up with the longest-unreviewed topics.
  [...topics]
    .sort(
      (a, b) =>
        new Date(a.last_reviewed_at ?? a.created_at).getTime() -
        new Date(b.last_reviewed_at ?? b.created_at).getTime()
    )
    .forEach((t) => add(t, "Keeping older knowledge alive"));

  // Assign varied modes; flashcard mode only where cards exist.
  const rotation: ReviewMode[] = ["recall", "flashcard", "quickfire"];
  const items: PlanItem[] = picked.map(({ topic, reason }, i) => {
    let mode = rotation[i % rotation.length];
    if (mode === "flashcard" && !hasCards.has(topic.id)) mode = "recall";
    return {
      topic_id: topic.id,
      topic_name: topic.name,
      category: topic.category,
      mode,
      reason,
    };
  });

  // The narrative is composed locally from the connection reasons Gemini
  // already wrote at ingest time — no AI call for the daily plan.
  const { headline, insight } = await composeNarrative(supabase, user.id, picked);

  const plan: DailyPlan = { date: today, headline, insight, items, completed: false };
  await supabase
    .from("daily_plans")
    .upsert({ user_id: user.id, plan_date: today, plan, completed: false });

  const done = await doneTopicsToday(supabase, user.id, today);
  return NextResponse.json(markDone(plan, done));
}

/**
 * Headline + "thread today" insight without an AI call: templates for the
 * headline, and the insight reuses a `topic_links.reason` (written by Gemini
 * once, at ingest) that connects two of today's topics.
 */
async function composeNarrative(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  picked: { topic: Topic; reason: string }[]
): Promise<{ headline: string; insight: string }> {
  const n = picked.length;
  const first = picked[0]?.topic.name ?? "your topics";
  const headlines = [
    `${n === 1 ? "One topic" : `${n} topics`} today — short, sharp, and worth it.`,
    `From ${first} onward: ${n === 1 ? "one recall" : `${n} recalls`} to lock in what you know.`,
    `Your forgetting curve meets its match — ${n === 1 ? "one topic is" : `${n} topics are`} up today.`,
    `Today's circuit: ${n === 1 ? first : `${first} and ${n - 1} more`}. Every recall makes it stick.`,
    `${n === 1 ? "One idea" : `${n} ideas`} due for a workout — future you will thank present you.`,
  ];
  // Stable for the day, varied across days.
  const day = Math.floor(Date.now() / 86400000);
  const headline = headlines[day % headlines.length];

  let insight =
    "Revisiting topics right before you forget them is what makes memory stick. Answer from memory first — even a wrong guess strengthens the trace more than rereading ever will.";

  const ids = picked.map((p) => p.topic.id);
  const nameById = new Map(picked.map((p) => [p.topic.id, p.topic.name]));
  const { data: links } = await supabase
    .from("topic_links")
    .select("source, target, reason, strength")
    .eq("user_id", userId)
    .in("source", ids)
    .in("target", ids)
    .not("reason", "is", null);
  const usable = (links ?? []).filter((l) => l.source !== l.target && l.reason);
  if (usable.length) {
    const link = usable[day % usable.length];
    const a = nameById.get(link.source);
    const b = nameById.get(link.target);
    const reason = String(link.reason).replace(/\.\s*$/, "");
    if (a && b) {
      insight = `${a} and ${b} sit side by side in today's session, and they're linked in your brain already: ${reason.charAt(0).toLowerCase()}${reason.slice(1)}. Keep that thread in mind as you answer — connected memories reinforce each other.`;
    }
  }

  return { headline, insight };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { action } = await request.json();
  if (action === "complete") {
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from("daily_plans")
      .update({ completed: true })
      .eq("user_id", user.id)
      .eq("plan_date", today);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
