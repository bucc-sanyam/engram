import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQuestion, gradeAnswer } from "@/lib/gemini";
import { scheduleNext, updateMastery, xpForReview } from "@/lib/srs";
import { awardXp } from "@/lib/progress";
import type { Topic } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json();
  const { action, topicId } = body;

  const { data: topicData } = await supabase
    .from("topics")
    .select("*")
    .eq("id", topicId)
    .single();
  const topic = topicData as Topic | null;
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  // ---- Generate a question ----
  if (action === "question") {
    const { data: recent } = await supabase
      .from("reviews")
      .select("question")
      .eq("topic_id", topicId)
      .not("question", "is", null)
      .order("created_at", { ascending: false })
      .limit(8);
    try {
      const q = await generateQuestion(
        {
          name: topic.name,
          summary: topic.summary,
          key_points: (topic.key_points as string[]) ?? [],
          mastery: topic.mastery,
        },
        body.mode === "quickfire" ? "quickfire" : "recall",
        (recent ?? []).map((r) => r.question as string)
      );
      return NextResponse.json(q);
    } catch (e) {
      console.error("Question generation failed", e);
      return NextResponse.json(
        { error: "Couldn't generate a question. Check your GEMINI_API_KEY." },
        { status: 502 }
      );
    }
  }

  // ---- Grade a typed answer ----
  if (action === "grade") {
    const { question, answer, mode } = body;
    if (!question || typeof answer !== "string") {
      return NextResponse.json({ error: "Missing question or answer" }, { status: 400 });
    }
    let grade;
    try {
      grade = await gradeAnswer({
        topicName: topic.name,
        topicSummary: topic.summary,
        keyPoints: (topic.key_points as string[]) ?? [],
        question,
        answer,
      });
    } catch (e) {
      console.error("Grading failed", e);
      return NextResponse.json(
        { error: "Couldn't grade the answer. Check your GEMINI_API_KEY." },
        { status: 502 }
      );
    }

    const xp = await applyReview(supabase, user.id, topic, grade.score, {
      mode: mode ?? "recall",
      question,
      answer,
      feedback: grade.feedback,
    });
    return NextResponse.json({ ...grade, xp });
  }

  // ---- Self-rated flashcard ----
  if (action === "rate") {
    const quality = Math.max(0, Math.min(5, Number(body.quality)));
    const xp = await applyReview(supabase, user.id, topic, quality, {
      mode: "flashcard",
    });
    return NextResponse.json({ xp });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function applyReview(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  topic: Topic,
  quality: number,
  review: { mode: string; question?: string; answer?: string; feedback?: string }
) {
  const srs = scheduleNext(
    { ease: topic.ease, interval_days: topic.interval_days, review_count: topic.review_count },
    quality
  );

  await supabase
    .from("topics")
    .update({
      ease: srs.ease,
      interval_days: srs.interval_days,
      review_count: srs.review_count,
      next_review_at: srs.next_review_at,
      last_reviewed_at: new Date().toISOString(),
      mastery: updateMastery(topic.mastery, quality),
    })
    .eq("id", topic.id);

  await supabase.from("reviews").insert({
    user_id: userId,
    topic_id: topic.id,
    mode: review.mode,
    score: Math.round(quality),
    question: review.question ?? null,
    answer: review.answer ?? null,
    feedback: review.feedback ?? null,
  });

  return awardXp(supabase, userId, xpForReview(quality));
}
