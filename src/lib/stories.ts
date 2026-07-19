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
import { COMP_ACT_CHAPTERS } from "./competition-act";
import type { CompActQuestion } from "./competition-act/types";

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

/** A section flattened into everything needed to seed it. */
interface SeedSection {
  chapterSlug: string;
  sectionSlug: string;
  /** Topic name — must be unique per user (topics.unique(user_id,name)). */
  name: string;
  category: string;
  summary: string;
  keyPoints: string[];
  questions: CompActQuestion[];
  facts: string[];
}

interface SeriesSeed {
  seriesSlug: string;
  title: string;
  /** Sections in reading order (drives the brain spine + linear links). */
  sections: SeedSection[];
}

// A dormant seeded topic sits ~100 years out so it shows on the brain but never
// enters the daily plan until the section is actually learned (plan = due topics).
const FAR_FUTURE = () => new Date(Date.now() + 100 * 365 * 24 * 3600 * 1000).toISOString();

/**
 * The Competition Code as seed data — built from the pure-data chapter files.
 * NB: this module imports competition-act (data only), never the reverse, so
 * the server-rendered blog pages never pull in this client module.
 */
function compActSeed(): SeriesSeed {
  const sections: SeedSection[] = [];
  for (const chapter of COMP_ACT_CHAPTERS) {
    for (const section of chapter.sections) {
      sections.push({
        chapterSlug: chapter.slug,
        sectionSlug: section.slug,
        name: section.title,
        category: "Legal",
        summary: section.summary,
        keyPoints: [],
        questions: section.questions ?? [],
        facts: section.facts ?? [],
      });
    }
  }
  return { seriesSlug: "competition-act", title: "The Competition Code", sections };
}

const SERIES: Record<string, () => SeriesSeed> = {
  "competition-act": compActSeed,
};

function getSeed(seriesSlug: string): SeriesSeed {
  const build = SERIES[seriesSlug];
  if (!build) throw new Error(`Unknown story series: ${seriesSlug}`);
  return build();
}

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

  // 1. Seed dormant topics (idempotent on the unique (user_id,name)).
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
  const { data: upserted, error: topicErr } = await supabase
    .from("topics")
    .upsert(topicRows, { onConflict: "user_id,name" })
    .select("id,name");
  if (topicErr) throw topicErr;
  const idByName = new Map((upserted ?? []).map((t) => [t.name as string, t.id as string]));

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

  // Seed the bank only once (idempotent on re-complete).
  const { count } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("topic_id", topicId);

  let seededCount = 0;
  if (!count) {
    if (section.questions.length) {
      const questionRows = section.questions.map((q) => ({
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
    if (section.facts.length) {
      await supabase
        .from("facts")
        .insert(section.facts.map((fact) => ({ user_id: user.id, topic_id: topicId, fact })));
    }
  }

  // Make the topic due now so it enters today's plan + quiz.
  await supabase
    .from("topics")
    .update({ next_review_at: new Date().toISOString() })
    .eq("id", topicId);

  // Mark learned.
  await supabase
    .from("story_sections")
    .update({ status: "learned", learned_at: new Date().toISOString() })
    .eq("series_slug", seriesSlug)
    .eq("section_slug", sectionSlug)
    .eq("user_id", user.id);

  return { questionCount: seededCount };
}
