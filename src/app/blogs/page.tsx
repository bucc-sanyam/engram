"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import { getTopics } from "@/lib/data";
import { getStartedStories, getAllStorySections, type UserStory, type StorySection } from "@/lib/stories";
import type { Topic } from "@/lib/types";
import { categoryColor, CATEGORY_COLORS } from "@/lib/types";

/** The pre-installed learnable series, rendered as one connected module. */
const STORY_SERIES = [
  {
    href: "/blogs/dsa",
    label: "The Pattern Atlas",
    tag: "DSA",
    color: "#f5b95f",
    title: "The NeetCode 150",
    meta: "18 chapters · 150 problems",
    desc: "Every pattern, every problem, one continuous path.",
  },
  // Competition Act paused from discovery for now (2026-07-20) — route/data/seed
  // machinery all still intact for anyone who already started it.
  // {
  //   href: "/blogs/competition-act",
  //   label: "The Competition Code",
  //   tag: "Legal",
  //   color: "#5ba4cf",
  //   title: "The Competition Act, 2002",
  //   meta: "10 chapters · 31 sections",
  //   desc: "Definitions to enforcement, with landmark cases throughout.",
  // },
  {
    href: "/blogs/sql",
    label: "The Query Playbook",
    tag: "SQL",
    color: "#22d3ee",
    title: "SQL for interviews",
    meta: "12 chapters · 41 problems",
    desc: "SELECT to window functions, with practice links.",
  },
  {
    href: "/blogs/sarfaesi-act",
    label: "The SARFAESI Playbook",
    tag: "Legal",
    color: "#a78bfa",
    title: "The SARFAESI Act, 2002",
    meta: "6 chapters",
    desc: "NPA resolution, asset reconstruction, and enforcement of security interest.",
  },
  {
    href: "/blogs/macroeconomics",
    label: "Macroeconomics: An Introduction",
    tag: "Economics",
    color: "#a3e635",
    title: "Macroeconomics by Alex M. Thomas",
    meta: "6 chapters",
    desc: "A critical approach to understanding macroeconomics and the Indian economy.",
  },
  {
    href: "/blogs/psychopaths-and-savages",
    label: "Talking with Psychopaths and Savages",
    tag: "Psychology",
    color: "#d94f5c",
    title: "Talking with Psychopaths and Savages",
    meta: "12 chapters",
    desc: "A deep dive into the minds of predators. Are they clinical psychopaths, or unrestrained savages?",
  },
];

export default function BlogsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [storySections, setStorySections] = useState<StorySection[]>([]);
  const [expertsOpen, setExpertsOpen] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);

  useEffect(() => {
    getTopics()
      .then(setTopics)
      .finally(() => setLoaded(true));
    getStartedStories().then(setStories).catch(() => {});
    getAllStorySections().then(setStorySections).catch(() => {});
  }, []);

  // Build per-series progress lookup
  const seriesProgress = useMemo(() => {
    const map = new Map<string, { total: number; learned: number; color: string }>();
    for (const story of stories) {
      const secs = storySections.filter((s) => s.series_slug === story.series_slug);
      map.set(story.series_slug, {
        total: secs.length,
        learned: secs.filter((s) => s.status === "learned").length,
        color: story.color,
      });
    }
    return map;
  }, [stories, storySections]);

  // Started series first (most relevant to a returning user), static order preserved otherwise.
  const sortedSeries = useMemo(() => {
    return [...STORY_SERIES].sort((a, b) => {
      const slugA = a.href.split("/blogs/")[1];
      const slugB = b.href.split("/blogs/")[1];
      const aStarted = slugA && seriesProgress.has(slugA) ? 1 : 0;
      const bStarted = slugB && seriesProgress.has(slugB) ? 1 : 0;
      return bStarted - aStarted;
    });
  }, [seriesProgress]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of topics) counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [topics]);

  const filtered = useMemo(() => {
    let result = topics;
    if (categoryFilter) result = result.filter((t) => t.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.summary?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [topics, categoryFilter, search]);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-10 sm:px-6 md:pb-16">
        {/* Page header */}
        <div className="rise mb-10" data-tour="blogs-intro">
          <p className="micro mb-3 !text-[#43d6b5]">Knowledge library</p>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
            Your topic blogs
          </h1>
          <p className="mt-3 text-lg text-muted">
            Deep reads on every topic in your knowledge graph — key ideas, connections, and sources.
          </p>
        </div>

        {/* Learn from our experts — collapsible so the library stays compact
            as more series ship */}
        <section className="rise mb-10">
          <div className="glass relative overflow-hidden rounded-[1.75rem]">
            {/* shared ambient wash so the whole block reads as one surface */}
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-[0.12] blur-3xl"
              style={{ background: "linear-gradient(135deg,#ff7a5c,#f5b95f)" }}
              aria-hidden
            />
            {/* header — click to expand/collapse */}
            <button
              onClick={() => setExpertsOpen((v) => !v)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
              aria-expanded={expertsOpen}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff7a5c]/25 to-[#f5b95f]/20 text-base">
                🎓
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold text-white/90">Learn from our experts</h2>
                <p className="text-xs text-faint">
                  Structured, linear series — hand-crafted, read them or start one to learn it
                </p>
              </div>
              <span className="micro shrink-0 rounded-full bg-white/[0.06] px-2.5 py-1 !text-muted">
                {STORY_SERIES.length} series
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 shrink-0 text-faint transition-transform ${expertsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* series as connected rows sharing one frame — collapsed by default */}
            {expertsOpen && (
              <>
                <div className="divide-y divide-white/[0.05] border-t border-white/[0.06]">
                  {sortedSeries.map((s) => {
                    // Extract the series slug from the href
                    const slug = s.href.split("/blogs/")[1];
                    const progress = slug ? seriesProgress.get(slug) : null;
                    return (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="group relative flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                    >
                      {/* accent spine ties each row to its series colour */}
                      <span
                        className="h-11 w-1 shrink-0 rounded-full transition-all group-hover:h-12"
                        style={{ background: s.color, boxShadow: `0 0 12px ${s.color}66` }}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="micro" style={{ color: s.color }}>
                            {s.label}
                          </p>
                          <span
                            className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                            style={{ background: `${s.color}1f`, color: s.color }}
                          >
                            {s.tag}
                          </span>
                        </div>
                        <h3 className="mt-0.5 text-[15px] font-bold text-white/90 transition-colors group-hover:text-white">
                          {s.title}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-faint">
                          <span style={{ color: `${s.color}cc` }}>{s.meta}</span> · {s.desc}
                        </p>
                      </div>
                      {/* Progress badge — shown when story is started */}
                      {progress && progress.total > 0 && (
                        <div className="flex shrink-0 items-center gap-2">
                          <MiniRing
                            size={32}
                            stroke={3}
                            pct={Math.round((progress.learned / progress.total) * 100)}
                            color={progress.color}
                          />
                          <span className="text-xs tabular-nums text-faint">
                            {progress.learned}/{progress.total}
                          </span>
                        </div>
                      )}
                      <span
                        aria-hidden
                        className="shrink-0 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        style={{ color: s.color }}
                      >
                        <ArrowRightIcon className="h-4 w-4" />
                      </span>
                    </Link>
                  )})}
                </div>

                {/* Request a dedicated story CTA */}
                <div className="border-t border-white/[0.06] px-5 py-4">
                  <button
                    onClick={() => setWriteOpen(true)}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-dashed border-white/[0.14] bg-white/[0.02] px-4 py-3 text-left transition-all hover:border-[#f5b95f]/40 hover:bg-[#f5b95f]/[0.04]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5b95f]/[0.12] text-sm">
                      ✍️
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white/90">
                        Want a dedicated story to share with others?
                      </p>
                      <p className="text-xs text-faint">
                        Have expertise or material worth turning into a series? Write to us.
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="shrink-0 text-[#f5b95f] opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Search + filter */}
        <div className="rise mb-8 space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              id="blogs-search"
              className="input !rounded-full !pl-11"
              placeholder="Search topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.map(([c, count]) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}
                  className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-all hover:-translate-y-0.5"
                  style={{
                    background:
                      categoryFilter === c
                        ? `${CATEGORY_COLORS[c] ?? "#a8a29e"}2e`
                        : "rgba(255,252,245,0.05)",
                    color: CATEGORY_COLORS[c] ?? "#a8a29e",
                    border: `1px solid ${categoryFilter === c ? (CATEGORY_COLORS[c] ?? "#a8a29e") + "40" : "transparent"}`,
                  }}
                >
                  {c} · {count}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading */}
        {!loaded && (
          <p className="text-center text-muted">Loading your knowledge library…</p>
        )}

        {/* Empty state */}
        {loaded && topics.length === 0 && (
          <div className="glass rise p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] text-2xl">
              📚
            </div>
            <h2 className="mb-2 text-lg font-bold">No topics yet</h2>
            <p className="mb-5 text-muted">Add your first learning to generate topic blogs.</p>
            <Link href="/add" className="btn-primary">Add a learning</Link>
          </div>
        )}

        {/* No results */}
        {loaded && topics.length > 0 && filtered.length === 0 && (
          <div className="glass rise p-8 text-center">
            <p className="text-muted">No topics match your search.</p>
            <button
              onClick={() => { setSearch(""); setCategoryFilter(null); }}
              className="mt-4 text-sm text-[#f5b95f] underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Topic grid */}
        {filtered.length > 0 && (
          <div className="rise grid gap-4 sm:grid-cols-2">
            {filtered.map((topic) => {
              const color = categoryColor(topic.category);
              return (
                <Link
                  key={topic.id}
                  href={`/blogs/${topic.id}`}
                  className="glass glass-hover group relative overflow-hidden rounded-[1.5rem] p-5 transition-all"
                >
                  {/* Ambient glow */}
                  <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30"
                    style={{ background: color }}
                    aria-hidden
                  />

                  {/* Category badge */}
                  <span
                    className="mb-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{ background: `${color}20`, color }}
                  >
                    {topic.category}
                  </span>

                  {/* Title */}
                  <h2
                    className="mb-2 text-base font-bold leading-snug transition-colors group-hover:text-white"
                    style={{ color: "rgba(255,252,245,0.92)" }}
                  >
                    {topic.name}
                  </h2>

                  {/* Summary */}
                  {topic.summary && (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-faint">
                      {topic.summary}
                    </p>
                  )}

                  {/* Footer — review count */}
                  <div className="flex items-center gap-3 text-xs text-faint">
                    <span>{topic.review_count} review{topic.review_count === 1 ? "" : "s"}</span>
                    <span
                      aria-hidden
                      className="ml-auto shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                      style={{ color }}
                    >
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Topic count */}
        {filtered.length > 0 && (
          <p className="mt-6 text-center text-xs text-faint">
            {filtered.length} topic{filtered.length !== 1 ? "s" : ""}
            {(search || categoryFilter) && ` · filtered from ${topics.length}`}
          </p>
        )}
      </main>

      {/* Write-to-us modal — request a dedicated story */}
      {writeOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          onClick={() => setWriteOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden />
          <div
            className="glass relative w-full max-w-lg overflow-hidden rounded-[1.75rem] p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.14] blur-3xl"
              style={{ background: "linear-gradient(135deg,#ff7a5c,#f5b95f)" }}
              aria-hidden
            />
            <button
              onClick={() => setWriteOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-faint transition-colors hover:bg-white/[0.12] hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5b95f]/[0.14] text-lg">
                ✍️
              </span>
              <div>
                <p className="micro !text-[#f5b95f]">Contribute a series</p>
                <h2 className="text-lg font-bold text-white/95">Want a dedicated story?</h2>
              </div>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-muted">
              We turn well-structured material into linear, chapter-by-chapter stories others can
              read and learn from. If you have expertise or a resource worth sharing, send it our way.
            </p>

            <div className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="micro mb-2.5 !text-faint">What to include</p>
              <ul className="space-y-2 text-sm text-white/80">
                {[
                  "A clear subject and the audience it's for (beginner, interview prep, etc.).",
                  "A proper document or a public link for reference — Google Doc, PDF, article, or a repo.",
                  "The rough structure or table of contents, if you already have one.",
                  "Any must-cover examples, cases, or diagrams you'd like included.",
                ].map((t, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-[#f5b95f]/70" />
                    <span className="flex-1 leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:sanyamgupta2307@gmail.com?subject=${encodeURIComponent(
                  "Knovis — dedicated story request"
                )}&body=${encodeURIComponent(
                  "Subject / topic:\nAudience:\nReference document or link:\nRough structure:\nMust-cover examples or cases:\n"
                )}`}
                className="btn-primary"
              >
                Write to us
              </a>
              <button onClick={() => setWriteOpen(false)} className="btn-ghost">
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ChevronDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/** Tiny radial progress ring for inline use on series cards. */
function MiniRing({ size, stroke, pct, color }: { size: number; stroke: number; pct: number; color: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,252,245,0.08)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        style={{ filter: `drop-shadow(0 0 3px ${color}66)` }}
      />
    </svg>
  );
}
