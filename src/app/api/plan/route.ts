import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writePlanNarrative } from "@/lib/gemini";
import { stripMarkdown } from "@/lib/text";
import type { DailyPlan, PlanItem, ReviewMode, Topic } from "@/lib/types";

export const maxDuration = 60;

const MAX_ITEMS = 6;

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);

  // A plan is generated once per day and stays stable.
  const { data: saved } = await supabase
    .from("daily_plans")
    .select("plan, completed")
    .eq("user_id", user.id)
    .eq("plan_date", today)
    .maybeSingle();
  if (saved) {
    return NextResponse.json({ ...(saved.plan as DailyPlan), completed: saved.completed });
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

  // Gemini writes the narrative; static fallback keeps the app working without it.
  let headline = "Time to strengthen what you've learnt.";
  let insight = "Revisiting topics right before you forget them is what makes memory stick.";
  try {
    const narrative = await writePlanNarrative(
      picked.map(({ topic, reason }) => ({
        topic_name: topic.name,
        category: topic.category,
        reason,
        summary: topic.summary,
      }))
    );
    headline = stripMarkdown(narrative.headline);
    insight = stripMarkdown(narrative.insight);
  } catch (e) {
    console.error("Plan narrative generation failed", e);
  }

  const plan: DailyPlan = { date: today, headline, insight, items, completed: false };
  await supabase
    .from("daily_plans")
    .upsert({ user_id: user.id, plan_date: today, plan, completed: false });

  return NextResponse.json(plan);
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
