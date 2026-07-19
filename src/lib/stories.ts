"use client";

/**
 * Learnable Stories — turns a pre-installed static blog series (The Competition
 * Code, etc.) into something a signed-in user can actually *learn*.
 *
 * Starting a story seeds ordinary `topics` (+ a `topic_links` spine) into the
 * user's own account, dormant, so the whole series appears on their brain.
 * Marking a section "learned" seeds that section's pre-authored `questions` +
 * `facts` and makes the topic due — so it flows through the existing daily
 * plan / quiz / report-card / streak machinery with ZERO new AI calls (the
 * questions are authored by hand in src/lib/competition-act/topics/*.ts).
 *
 * All writes are browser-direct and RLS-scoped (see supabase/schema-stories.sql),
 * exactly like getTopics/updateProfile in data.ts. Signed-in only: in demo mode
 * reads return empty and writes throw (the UI gates before ever calling).
 */
import { createClient } from "./supabase/client";
import { isDemo } from "./demo";
import { getSeed, type SeedSection, type SeriesSeed } from "./story-seeds";

export interface UserStory {
  series_slug: string;
  color: string;
  started_at: string;
}

export interface StorySection {
  series_slug: string;
  chapter_slug: string;
  section_slug: string;
  topic_id: string;
  status: "started" | "learned";
  learned_at: string | null;
}

// A dormant seeded topic sits ~100 years out so it shows on the brain but never
// enters the daily plan until the section is actually learned (plan = due topics).
const FAR_FUTURE = () => new Date(Date.now() + 100 * 365 * 24 * 3600 * 1000).toISOString();

async function requireUser() {
  if (isDemo) throw new Error("Sign in to learn this story.");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to learn this story.");
  return { supabase, user };
}

// ---------------------------------------------------------------- reads

export async function getStartedStories(): Promise<UserStory[]> {
  if (isDemo) return [];
  const supabase = createClient();
  const { data } = await supabase.from("user_stories").select("*");
  return (data ?? []) as UserStory[];
}

export async function getStorySections(seriesSlug: string): Promise<StorySection[]> {
  if (isDemo) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("story_sections")
    .select("*")
    .eq("series_slug", seriesSlug);
  return (data ?? []) as StorySection[];
}

/** Every story section across all started series — for the brain view. */
export async function getAllStorySections(): Promise<StorySection[]> {
  if (isDemo) return [];
  const supabase = createClient();
  const { data } = await supabase.from("story_sections").select("*");
  return (data ?? []) as StorySection[];
}

/** Build the "read the full topic" href for a seeded story topic. */
export function storySectionHref(s: Pick<StorySection, "series_slug" | "chapter_slug" | "section_slug">): string {
  return `/blogs/${s.series_slug}/${s.chapter_slug}/${s.section_slug}`;
}

/**
 * Find the resume point for a started story — the first section in reading
 * order that is NOT "learned". Returns its deep href (e.g.
 * `/blogs/dsa/arrays-hashing/two-sum`). Falls back to the first section if
 * every section is learned (re-read from the top).
 */
export async function getResumeHref(seriesSlug: string): Promise<string> {
  const seed = getSeed(seriesSlug);
  const sections = await getStorySections(seriesSlug);
  const learnedSlugs = new Set(
    sections.filter((s) => s.status === "learned").map((s) => s.section_slug)
  );
  // Walk the seed in reading order — the first un-learned section wins.
  for (const s of seed.sections) {
    if (!learnedSlugs.has(s.sectionSlug)) {
      return `/blogs/${seriesSlug}/${s.chapterSlug}/${s.sectionSlug}`;
    }
  }
  // Everything learned → start from the top again.
  const first = seed.sections[0];
  return first
    ? `/blogs/${seriesSlug}/${first.chapterSlug}/${first.sectionSlug}`
    : `/blogs/${seriesSlug}`;
}

// ---------------------------------------------------------------- writes

/**
 * Start (or re-affirm) a story: seed every section as a dormant topic, wire the
 * reading-order spine as topic_links, and record membership. Idempotent —
 * re-running never duplicates topics/links and never downgrades a learned
 * section back to 'started'.
 */
export async function startStory(seriesSlug: string, color: string): Promise<void> {
  const { supabase, user } = await requireUser();
  const seed = getSeed(seriesSlug);

  await supabase
    .from("user_stories")
    .upsert({ user_id: user.id, series_slug: seriesSlug, color }, { onConflict: "user_id,series_slug" });

  // 1. Seed dormant topics. `ignoreDuplicates` so we NEVER overwrite a topic the
  // user already has with the same name — otherwise starting a story would reset
  // that topic's mastery/schedule and wipe real progress. New topics are inserted;
  // pre-existing same-named topics are left untouched and simply adopted below.
  const far = FAR_FUTURE();
  const topicRows = seed.sections.map((s) => ({
    user_id: user.id,
    name: s.name,
    category: s.category,
    summary: s.summary,
    key_points: s.keyPoints,
    mastery: 0,
    next_review_at: far,
  }));
  const { error: topicErr } = await supabase
    .from("topics")
    .upsert(topicRows, { onConflict: "user_id,name", ignoreDuplicates: true });
  if (topicErr) throw topicErr;

  // Resolve ids for every seeded name (both freshly inserted and pre-existing),
  // in name-batches so the `in()` filter stays within limits.
  const idByName = new Map<string, string>();
  const names = seed.sections.map((s) => s.name);
  for (let i = 0; i < names.length; i += 200) {
    const { data: rows } = await supabase
      .from("topics")
      .select("id,name")
      .eq("user_id", user.id)
      .in("name", names.slice(i, i + 200));
    for (const t of rows ?? []) idByName.set(t.name as string, t.id as string);
  }

  // 2. Record section membership (don't clobber a section already 'learned').
  const sectionRows = seed.sections
    .map((s) => {
      const topicId = idByName.get(s.name);
      return topicId
        ? {
            user_id: user.id,
            series_slug: seriesSlug,
            chapter_slug: s.chapterSlug,
            section_slug: s.sectionSlug,
            topic_id: topicId,
            status: "started" as const,
          }
        : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
  await supabase
    .from("story_sections")
    .upsert(sectionRows, { onConflict: "user_id,series_slug,section_slug", ignoreDuplicates: true });

  // 3. Wire the reading-order spine so the brain shows the story as a path.
  const linkRows: {
    user_id: string;
    source: string;
    target: string;
    reason: string;
    strength: number;
  }[] = [];
  for (let i = 0; i < seed.sections.length - 1; i++) {
    const a = idByName.get(seed.sections[i].name);
    const b = idByName.get(seed.sections[i + 1].name);
    if (a && b) {
      linkRows.push({ user_id: user.id, source: a, target: b, reason: `next in ${seed.title}`, strength: 1 });
    }
  }
  if (linkRows.length) {
    await supabase.from("topic_links").upsert(linkRows, { onConflict: "user_id,source,target", ignoreDuplicates: true });
  }
}

/**
 * Update the colour of a started story.
 */
export async function updateStoryColor(seriesSlug: string, color: string): Promise<void> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("user_stories")
    .update({ color })
    .eq("user_id", user.id)
    .eq("series_slug", seriesSlug);
  if (error) throw error;
}

/**
 * End a story: removes the story membership and deletes the topics this story
 * seeded (cascading to their questions, facts, and links), wiping that progress.
 *
 * Safety: a topic that also has an `entry_topics` link was ingested by the user
 * themselves (only real ingest creates entries — seeding never does). If such a
 * topic happened to share a name with a story section and was adopted at start,
 * we must NOT delete it, or we'd destroy the user's own knowledge. Those are
 * filtered out; only purely story-seeded topics are removed.
 */
export async function endStory(seriesSlug: string): Promise<void> {
  const { supabase, user } = await requireUser();

  const { data: sections } = await supabase
    .from("story_sections")
    .select("topic_id")
    .eq("user_id", user.id)
    .eq("series_slug", seriesSlug);

  const topicIds = (sections ?? []).map((s) => s.topic_id as string);

  // Remove membership first (so the story disappears immediately even if a
  // topic delete is skipped for safety below).
  await supabase
    .from("user_stories")
    .delete()
    .eq("user_id", user.id)
    .eq("series_slug", seriesSlug);
  await supabase
    .from("story_sections")
    .delete()
    .eq("user_id", user.id)
    .eq("series_slug", seriesSlug);

  if (topicIds.length === 0) return;

  // Topics the user actually ingested (have an entry) must never be deleted.
  const userOwned = new Set<string>();
  for (let i = 0; i < topicIds.length; i += 200) {
    const { data: owned } = await supabase
      .from("entry_topics")
      .select("topic_id")
      .in("topic_id", topicIds.slice(i, i + 200));
    for (const r of owned ?? []) userOwned.add(r.topic_id as string);
  }
  const deletable = topicIds.filter((id) => !userOwned.has(id));

  for (let i = 0; i < deletable.length; i += 100) {
    await supabase.from("topics").delete().in("id", deletable.slice(i, i + 100));
  }
}

/**
 * Mark a section learned: seed its pre-authored question bank + facts (once) and
 * make its topic due now, so it enters today's reviews. Auto-starts the story
 * first if it wasn't already. Returns how many questions were seeded (0 if the
 * bank hasn't been authored yet, or was already seeded).
 */
export async function completeSection(
  seriesSlug: string,
  sectionSlug: string
): Promise<{ questionCount: number }> {
  const { supabase, user } = await requireUser();
  const seed = getSeed(seriesSlug);
  const section = seed.sections.find((s) => s.sectionSlug === sectionSlug);
  if (!section) throw new Error(`Unknown section: ${seriesSlug}/${sectionSlug}`);

  // Find (or lazily create) the topic for this section.
  let { data: existing } = await supabase
    .from("story_sections")
    .select("topic_id")
    .eq("series_slug", seriesSlug)
    .eq("section_slug", sectionSlug)
    .maybeSingle();

  if (!existing) {
    // Story wasn't started — seed the whole series so the brain stays coherent.
    await startStory(seriesSlug, "#5ba4cf");
    ({ data: existing } = await supabase
      .from("story_sections")
      .select("topic_id")
      .eq("series_slug", seriesSlug)
      .eq("section_slug", sectionSlug)
      .maybeSingle());
  }
  const topicId = existing?.topic_id as string | undefined;
  if (!topicId) throw new Error("Could not seed this section.");

  // Fetch existing prompts and facts so we only seed missing ones.
  // This ensures story questions are always seeded, even if the topic
  // previously existed and contained user-ingested questions.
  const { data: existingQs } = await supabase
    .from("questions")
    .select("prompt")
    .eq("topic_id", topicId);
  const existingPrompts = new Set((existingQs ?? []).map((q) => q.prompt));

  let seededCount = 0;

  const toInsert = section.questions.filter((q) => !existingPrompts.has(q.prompt));
  if (toInsert.length > 0) {
    const questionRows = toInsert.map((q) => ({
      user_id: user.id,
      topic_id: topicId,
      kind: q.kind,
      prompt: q.prompt,
      options: q.options ?? null,
      correct_index: q.correct_index ?? null,
      correct_indices: q.correct_indices ?? null,
      model_answer: q.model_answer,
      difficulty: q.difficulty,
    }));
    const { error: qErr } = await supabase.from("questions").insert(questionRows);
    if (qErr) throw qErr;
    seededCount = questionRows.length;
  }

  const { data: existingFacts } = await supabase
    .from("facts")
    .select("fact")
    .eq("topic_id", topicId);
  const existingFactTexts = new Set((existingFacts ?? []).map((f) => f.fact));

  const factsToInsert = section.facts.filter((f) => !existingFactTexts.has(f));
  if (factsToInsert.length > 0) {
    await supabase
      .from("facts")
      .insert(factsToInsert.map((fact) => ({ user_id: user.id, topic_id: topicId, fact })));
  }

  // Make the topic due now so it enters today's plan + quiz.
  await supabase
    .from("topics")
    .update({ next_review_at: new Date().toISOString() })
    .eq("id", topicId);

  // Invalidate today's plan so the new topic is pulled in immediately.
  // We delete any uncompleted plan instead of guessing the timezone-specific date.
  await supabase
    .from("daily_plans")
    .delete()
    .eq("user_id", user.id)
    .eq("completed", false);

  // Mark learned.
  await supabase
    .from("story_sections")
    .update({ status: "learned", learned_at: new Date().toISOString() })
    .eq("series_slug", seriesSlug)
    .eq("section_slug", sectionSlug)
    .eq("user_id", user.id);

  return { questionCount: seededCount };
}
