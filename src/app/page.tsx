"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import ProgressCalendar from "@/components/ProgressCalendar";
import ProgressMap from "@/components/ProgressMap";
import { getEntries, getPlan, getProfile, getReviews, getTopics } from "@/lib/data";
import { stripMarkdown } from "@/lib/text";
import type { DailyPlan, Entry, Profile, Review, Topic } from "@/lib/types";
import { categoryColor } from "@/lib/types";

const MODE_LABEL: Record<string, string> = {
  recall: "Deep recall",
  flashcard: "Flashcards",
  quickfire: "Quick-fire",
};

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [planError, setPlanError] = useState(false);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
    getTopics().then(setTopics).catch(() => {});
    getReviews().then(setReviews).catch(() => {});
    getEntries().then(setEntries).catch(() => {});
    getPlan().then(setPlan).catch(() => setPlanError(true));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = profile?.display_name?.trim().split(/\s+/)[0] || "there";

  const dueCount = topics.filter((t) => new Date(t.next_review_at) <= new Date()).length;
  const avgMastery = topics.length
    ? Math.round(topics.reduce((s, t) => s + t.mastery, 0) / topics.length)
    : 0;

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-32 pt-10 sm:px-6 md:pb-16">
        {/* Greeting */}
        <div className="rise mb-10">
          {/* suppressHydrationWarning: date/greeting depend on the viewer's clock & locale */}
          <p className="micro mb-3" suppressHydrationWarning>
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
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
            <section className="glass rise rise-1 relative overflow-hidden p-6 sm:p-7">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#ff7a5c]/[0.07] blur-3xl" />
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="micro mb-1 flex items-center gap-2 !text-[#ff9a80]">
                    <span className="ping-dot text-[#ff7a5c]" /> Today&apos;s session
                  </p>
                  <h2 className="text-xl font-bold">Revision plan</h2>
                </div>
                {plan && plan.items.length > 0 && (
                  <Link href="/review" className="btn-primary shrink-0">
                    {plan.completed ? "Review again" : "Start"} →
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

              <ul className="space-y-2.5">
                {plan?.items.map((item) => (
                  <li
                    key={item.topic_id}
                    className="row-soft flex items-center gap-3.5 px-4 py-3.5"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background: categoryColor(item.category),
                        boxShadow: `0 0 10px ${categoryColor(item.category)}`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{item.topic_name}</div>
                      <div className="truncate text-xs text-faint">{item.reason}</div>
                    </div>
                    <span className="micro shrink-0 rounded-full bg-white/[0.05] px-3 py-1.5">
                      {MODE_LABEL[item.mode]}
                    </span>
                  </li>
                ))}
              </ul>

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
                  <SparkleIcon /> Today&apos;s connection
                </p>
                <p className="text-[15px] leading-relaxed text-white/85">{stripMarkdown(plan.insight)}</p>
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
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {profile && <ProgressMap profile={profile} reviews={reviews} />}

            {/* Rendered only after profile loads (client-side) so calendar dates never mismatch SSR */}
            {profile && <ProgressCalendar reviews={reviews} />}

            {/* Stats — naked numbers, no boxes */}
            <div className="rise rise-2 flex items-center justify-around px-2 py-3">
              <Stat label="Topics" value={topics.length} />
              <Divider />
              <Stat label="Due today" value={dueCount} accent={dueCount > 0} />
              <Divider />
              <Stat label="Mastery" value={`${avgMastery}%`} />
            </div>

            {/* Mini brain teaser */}
            <Link
              href="/brain"
              className="glass glass-hover rise rise-3 relative block overflow-hidden p-6 sm:p-7"
            >
              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-[#43d6b5]/[0.08] blur-3xl" />
              <p className="micro mb-1 !text-[#43d6b5]">Knowledge graph</p>
              <h3 className="mb-1 text-xl font-bold">Your brain →</h3>
              <p className="text-sm text-muted">
                {topics.length} topics, interconnected. Explore the graph.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {topics.slice(0, 8).map((t) => (
                  <span
                    key={t.id}
                    className="rounded-full px-3 py-1 text-[11px] font-medium"
                    style={{
                      background: `${categoryColor(t.category)}14`,
                      color: categoryColor(t.category),
                      border: `1px solid ${categoryColor(t.category)}30`,
                    }}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="text-center">
      <div className={`display text-3xl font-bold ${accent ? "text-[#ff9a80]" : ""}`}>{value}</div>
      <div className="micro mt-1">{label}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />;
}

function SparkleIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9L12 2zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" />
    </svg>
  );
}
