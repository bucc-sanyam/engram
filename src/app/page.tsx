"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import ProgressCalendar from "@/components/ProgressCalendar";
import ProgressMap from "@/components/ProgressMap";
import RichText from "@/components/RichText";
import StoryJourney from "@/components/StoryJourney";
import { getEntries, getFactOfTheDay, getPlan, getProfile, getReviews, getTopics } from "@/lib/data";
import { getAllStorySections, getStartedStories, type StorySection, type UserStory } from "@/lib/stories";
import { NOTES_EVENT, childrenOf, countDescendants, ensureSeeded, getNotes } from "@/lib/notes";
import { stripMarkdown } from "@/lib/text";
import type { DailyFact, DailyPlan, Entry, Note, PlanItem, Profile, Review, Topic } from "@/lib/types";
import { categoryColor } from "@/lib/types";

const MODE_LABEL: Record<string, string> = {
  recall: "Deep recall",
  flashcard: "Mixed quiz", // legacy cached plans only — no longer generated
  quickfire: "Quick-fire",
};

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [fact, setFact] = useState<DailyFact | null>(null);
  const [planError, setPlanError] = useState(false);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [storySections, setStorySections] = useState<StorySection[]>([]);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
    getTopics().then(setTopics).catch(() => {});
    getReviews().then(setReviews).catch(() => {});
    getEntries().then(setEntries).catch(() => {});
    getFactOfTheDay().then(setFact).catch(() => {});
    getPlan().then(setPlan).catch(() => setPlanError(true));
    getStartedStories().then(setStories).catch(() => {});
    getAllStorySections().then(setStorySections).catch(() => {});
  }, []);

  // Personal notes live in localStorage — read on mount, stay in sync with edits.
  useEffect(() => {
    ensureSeeded();
    const sync = () => setNotes(getNotes());
    sync();
    window.addEventListener(NOTES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(NOTES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const topNotes = childrenOf(notes, null);

  // Compute the clock on the client only. This page is prerendered, and with
  // suppressHydrationWarning React KEEPS the server-rendered text on mismatch —
  // so a build-time (UTC) "Good morning" would otherwise never update. Setting
  // `now` in an effect forces a real re-render with the viewer's local time.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);
  const hour = now?.getHours() ?? -1;
  const greeting =
    hour < 0 ? "Hello" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = profile?.display_name?.trim().split(/\s+/)[0] || "there";



  // Which story (if any) each plan topic belongs to.
  const seriesByTopic = new Map(storySections.map((s) => [s.topic_id, s.series_slug]));
  // Remaining tasks first, completed ones sink to the bottom.
  const planItems = plan ? [...plan.items].sort((a, b) => Number(!!a.done) - Number(!!b.done)) : [];
  const remainingCount = planItems.filter((i) => !i.done).length;

  // Series with at least one non-done task today — used to surface the most
  // relevant stories first in the journey panel (see dueSeriesSlugs below).
  const dueSeriesSlugs = new Set(
    planItems
      .filter((i) => !i.done)
      .map((i) => seriesByTopic.get(i.topic_id))
      .filter((s): s is string => Boolean(s))
  );

  // Story topics keep their chosen story colour on the brain-teaser pills.
  const storyColorByStory = new Map(stories.map((s) => [s.series_slug, s.color]));
  const topicColors = new Map<string, string>();
  for (const s of storySections) {
    const c = storyColorByStory.get(s.series_slug);
    if (c) topicColors.set(s.topic_id, c);
  }

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-32 pt-10 sm:px-6 md:pb-16">
        {/* Greeting */}
        <div className="rise mb-10">
          {/* Date/greeting depend on the viewer's clock & locale — client-only. */}
          <p className="micro mb-3" suppressHydrationWarning>
            {now?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) ?? " "}
          </p>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.1] sm:text-5xl" suppressHydrationWarning>
            {greeting}, {firstName}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            {plan ? stripMarkdown(plan.headline) : "Loading your revision plan…"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Today's plan */}
            <section data-tour="plan" className="glass rise rise-1 relative overflow-hidden p-6 sm:p-7">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#ff7a5c]/[0.07] blur-3xl" />
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="micro mb-1 flex items-center gap-2 !text-[#ff9a80]">
                    <span className="ping-dot text-[#ff7a5c]" /> Today&apos;s session
                  </p>
                  <h2 className="text-xl font-bold">
                    Today&apos;s recall
                    {plan && plan.items.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-muted">
                        · {plan.items.length} topic{plan.items.length !== 1 ? "s" : ""}
                        {remainingCount > 0 && `, ${remainingCount} remaining`}
                      </span>
                    )}
                  </h2>
                </div>
                {plan && plan.items.length > 0 && (
                  <Link href="/recall" data-tour="recall-cta" className="btn-primary shrink-0">
                    {plan.completed ? "See report" : "Start"} →
                  </Link>
                )}
              </div>

              {planError && (
                <p className="text-sm text-danger">
                  Couldn&apos;t load today&apos;s plan. Check your Supabase & Gemini configuration.
                </p>
              )}

              {plan && plan.items.length === 0 && (
                <div className="py-8 text-center">
                  <p className="mb-4 text-muted">{stripMarkdown(plan.insight)}</p>
                  <Link href="/add" className="btn-primary">
                    Log your first learning
                  </Link>
                </div>
              )}

              {plan && plan.items.length > 0 && (
                <ul className="space-y-2.5">
                  {planItems.map((item) => (
                    <PlanRow key={item.topic_id} item={item} accent={topicColors.get(item.topic_id)} />
                  ))}
                </ul>
              )}

              {plan?.completed && (
                <p className="mt-4 rounded-2xl bg-[#43d6b5]/[0.09] px-4 py-3 text-sm text-[#7fe5cb]">
                  ✓ Today&apos;s session complete — streak secured. Come back tomorrow!
                </p>
              )}
            </section>



            {/* Connection insight */}
            {plan && plan.items.length > 0 && (
              <section className="rise rise-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f5b95f]/[0.08] via-transparent to-[#ff7a5c]/[0.04] p-6 sm:p-7">
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#f5b95f]/15 blur-3xl" />
                <p className="micro mb-3 flex items-center gap-2 !text-[#f5b95f]">
                  <SparkleIcon /> The thread today
                </p>
                <RichText className="block text-[15px] leading-relaxed text-white/85">
                  {plan.insight}
                </RichText>
              </section>
            )}

            {/* Recent entries */}
            <section className="glass rise rise-3 p-6 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="micro mb-1">Knowledge log</p>
                  <h2 className="text-xl font-bold">Recent learnings</h2>
                </div>
                <Link href="/add" className="btn-ghost px-4 py-2 text-sm">
                  + Add new
                </Link>
              </div>
              {entries.length === 0 ? (
                <p className="text-sm text-muted">Nothing logged yet.</p>
              ) : (
                <ul className="space-y-3">
                  {entries.slice(0, 4).map((e) => (
                    <li key={e.id} className="row-soft px-4 py-3.5">
                      <div className="mb-0.5 flex items-baseline justify-between gap-3">
                        <span className="truncate font-medium">{e.title}</span>
                        <span className="micro shrink-0">
                          {new Date(e.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted">{e.summary}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Personal notes — private reminders, not in the graph */}
            <section data-tour="notes" className="glass rise rise-3 p-6 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="micro mb-1 !text-[#bfa8f5]">Personal margin</p>
                  <h2 className="text-xl font-bold">Personal notes</h2>
                </div>
                <Link href="/notes" className="btn-ghost px-4 py-2 text-sm">
                  Open notes →
                </Link>
              </div>
              {topNotes.length === 0 ? (
                <Link
                  href="/notes"
                  className="row-soft flex items-center gap-3 px-4 py-4 text-sm text-muted"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#bfa8f5]/12 text-[#bfa8f5]">
                    ✎
                  </span>
                  Jot a reminder — markdown, subnotes, all in one place.
                </Link>
              ) : (
                <ul className="space-y-2.5">
                  {topNotes.slice(0, 5).map((n) => {
                    const subs = countDescendants(notes, n.id);
                    return (
                      <li key={n.id}>
                        <Link
                          href={`/notes?note=${n.id}`}
                          className="row-soft group flex items-center gap-3.5 px-4 py-3.5"
                        >
                          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#bfa8f5]" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">{n.title.trim() || "Untitled"}</div>
                            <div className="truncate text-xs text-faint">
                              {new Date(n.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                              {subs > 0 && ` · ${subs} subnote${subs === 1 ? "" : "s"}`}
                            </div>
                          </div>
                          <span
                            aria-hidden
                            className="shrink-0 text-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Fact of the day — pre-generated from the user's own knowledge graph */}
            {fact && (
              <section data-tour="fact" className="rise rise-1 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#7fd0e8]/[0.08] via-transparent to-[#bfa8f5]/[0.05] p-6 sm:p-7">
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#7fd0e8]/12 blur-3xl" />
                <p className="micro mb-3 flex items-center gap-2 !text-[#7fd0e8]">
                  <BulbIcon /> Fact of the day
                </p>
                <p className="text-[15px] leading-relaxed text-white/85">{fact.text}</p>
                {fact.topic_name && (
                  <p className="micro mt-3.5">from your topic · {fact.topic_name}</p>
                )}
              </section>
            )}

            {/* Story journey — radial progress visualization */}
            {stories.length > 0 && (
              <StoryJourney stories={stories} storySections={storySections} dueSeriesSlugs={dueSeriesSlugs} />
            )}

            {profile && (
              <div data-tour="momentum">
                <ProgressMap profile={profile} reviews={reviews} />
              </div>
            )}

            {/* Rendered only after profile loads (client-side) so calendar dates never mismatch SSR */}
            {profile && (
              <div data-tour="calendar">
                <ProgressCalendar reviews={reviews} />
              </div>
            )}

            {/* Stats — naked numbers, no boxes */}
            <div className="rise rise-2 py-3">
              <p className="micro mb-4 text-center !text-faint">At a glance</p>
              <div className="flex items-center justify-around px-2">
                <Stat 
                  label="Total topics" 
                  value={topics.length} 
                  description="All concepts logged in your brain"
                />
                <Divider />
                <Stat 
                  label="Tasks today" 
                  value={plan ? plan.items.length : "—"} 
                  description="Topics scheduled for revision today"
                  accent={(plan?.items.length ?? 0) > 0} 
                />
              </div>
            </div>

            {/* Mini brain teaser — pills open each topic's blog page */}
            <div className="glass rise rise-3 relative overflow-hidden p-6 sm:p-7">
              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-[#43d6b5]/[0.08] blur-3xl" />
              <Link href="/brain" className="group block">
                <p className="micro mb-1 !text-[#43d6b5]">Knowledge graph</p>
                <h3 className="mb-1 text-xl font-bold transition-colors group-hover:text-[#7fe5cb]">
                  Your brain →
                </h3>
                <p className="text-sm text-muted">
                  {topics.length} topics, interconnected. Explore the graph.
                </p>
              </Link>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {topics.slice(0, 8).map((t) => {
                  const color = topicColors.get(t.id) ?? categoryColor(t.category);
                  return (
                    <Link
                      key={t.id}
                      href={`/blogs/${t.id}`}
                      className="rounded-full px-3 py-1 text-[11px] font-medium transition-all hover:-translate-y-0.5"
                      style={{
                        background: `${color}14`,
                        color: color,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {t.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, description, accent }: { label: string; value: string | number; description: string; accent?: boolean }) {
  return (
    <div className="group relative h-16 w-28 [perspective:1000px]">
      <div className="relative h-full w-full cursor-default transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden]">
          <div className={`display text-3xl font-bold ${accent ? "text-[#ff9a80]" : ""}`}>{value}</div>
          <div className="micro mt-1">{label}</div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 flex items-center justify-center px-1 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-[11px] leading-snug text-faint">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />;
}

function PlanRow({ item, accent }: { item: PlanItem; accent?: string }) {
  const dot = accent || "#43d6b5";
  return (
    <li>
      <Link
        href={`/recall?topic=${item.topic_id}`}
        className={`row-soft group flex items-center gap-3.5 px-4 py-3.5 ${item.done ? "opacity-55" : ""}`}
      >
        {item.done ? (
          <span
            aria-hidden
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-[9px] font-bold text-white/60"
          >
            ✓
          </span>
        ) : (
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: dot, boxShadow: `0 0 10px ${dot}` }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className={`truncate font-medium ${item.done ? "line-through decoration-white/30" : ""}`}>
            {item.topic_name}
          </div>
          <div className="truncate text-xs text-faint">
            {item.done ? "Completed today" : item.reason}
          </div>
        </div>
        <span className="micro shrink-0 rounded-full bg-white/[0.05] px-3 py-1.5 transition-colors group-hover:bg-white/[0.09]">
          {MODE_LABEL[item.mode]}
        </span>
        <span
          aria-hidden
          className="-ml-1 shrink-0 text-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
        >
          →
        </span>
      </Link>
    </li>
  );
}

function BulbIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2zm-2 19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.5h-4v.5z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9L12 2zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" />
    </svg>
  );
}
