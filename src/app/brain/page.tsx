"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import BrainScene from "@/components/BrainScene";
import { getLinks, getTopics } from "@/lib/data";
import {
  getAllStorySections,
  getStartedStories,
  storySectionHref,
  type StorySection,
  type UserStory,
} from "@/lib/stories";
import type { Topic, TopicLink } from "@/lib/types";
import { CATEGORY_COLORS, categoryColor } from "@/lib/types";

/** Display titles for learnable story series (extend as series are added). */
const SERIES_TITLES: Record<string, string> = {
  "competition-act": "The Competition Code",
  "dsa": "The Pattern Atlas",
  "sql": "The Query Playbook",
};

export default function BrainPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [links, setLinks] = useState<TopicLink[]>([]);
  const [query, setQuery] = useState("");
  // the walked trail of topics — each step is (ideally) linked to the previous
  const [path, setPath] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [storySections, setStorySections] = useState<StorySection[]>([]);
  const [focusSeries, setFocusSeries] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getTopics(), getLinks(), getStartedStories(), getAllStorySections()]).then(
      ([t, l, s, ss]) => {
        setTopics(t);
        setLinks(l);
        setStories(s);
        setStorySections(ss);
        setLoaded(true);
      }
    );
  }, []);

  const byId = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

  // topic_id → its story section (for "read the full topic" hrefs + focus set)
  const storyByTopic = useMemo(
    () => new Map(storySections.map((s) => [s.topic_id, s])),
    [storySections]
  );

  // story-focus: recolour this story's nodes, dim the rest
  const highlight = useMemo(() => {
    if (!focusSeries) return null;
    const ids = new Set(
      storySections.filter((s) => s.series_slug === focusSeries).map((s) => s.topic_id)
    );
    if (!ids.size) return null;
    const color = stories.find((s) => s.series_slug === focusSeries)?.color ?? "#5ba4cf";
    return { topicIds: ids, color };
  }, [focusSeries, storySections, stories]);

  // give every topic belonging to a story its story's colour as a baseline
  const topicColors = useMemo(() => {
    const map = new Map<string, string>();
    for (const sec of storySections) {
      const color = stories.find((s) => s.series_slug === sec.series_slug)?.color;
      if (color) map.set(sec.topic_id, color);
    }
    return map;
  }, [storySections, stories]);

  // where "read the full topic" points: the static section blog for story
  // topics, the auto-generated topic blog otherwise
  const blogHref = useCallback(
    (t: Topic) => {
      const sec = storyByTopic.get(t.id);
      return sec ? storySectionHref(sec) : `/blogs/${t.id}`;
    },
    [storyByTopic]
  );

  const isLinked = useCallback(
    (a: string, b: string) =>
      links.some(
        (l) => (l.source === a && l.target === b) || (l.source === b && l.target === a)
      ),
    [links]
  );

  // Walk to a topic: jump back if already visited, extend the path if it's
  // connected to where we are, otherwise begin a fresh trail.
  const navigateTo = useCallback(
    (id: string) => {
      setPath((prev) => {
        const idx = prev.indexOf(id);
        if (idx !== -1) return prev.slice(0, idx + 1);
        const tail = prev[prev.length - 1];
        if (!tail || isLinked(tail, id)) return [...prev, id];
        return [id];
      });
    },
    [isLinked]
  );

  // Esc backs out of the dive-inside view (same as the close button)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // leave Esc alone while typing (search box handles its own escape)
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      setPath((prev) => (prev.length ? [] : prev));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visibleTopics = useMemo(
    () => (categoryFilter ? topics.filter((t) => t.category === categoryFilter) : topics),
    [topics, categoryFilter]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return topics
      .filter((t) => t.name.toLowerCase().includes(q) || t.summary?.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, topics]);

  const current = path.length ? byId.get(path[path.length - 1]) ?? null : null;
  const currentConnections = useMemo(() => {
    if (!current) return [];
    const cur = current;
    return links
      .filter((l) => l.source === cur.id || l.target === cur.id)
      .flatMap((l) => {
        const topic = byId.get(l.source === cur.id ? l.target : l.source);
        return topic ? [{ topic, reason: l.reason }] : [];
      });
  }, [current, links, byId]);

  // categories are derived live from whatever the user has actually added
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of topics) counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [topics]);

  // trail rendered newest-first (current card on top, history stacked beneath)
  const trail = useMemo(() => [...path].reverse(), [path]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Nav />
      <main className="relative flex-1">
        {/* Brain fills the page */}
        <div className="absolute inset-0" data-tour="brain-canvas">
          {loaded && topics.length > 0 && (
            <BrainScene
              topics={visibleTopics}
              links={links}
              path={path}
              onSelect={(id) => id && navigateTo(id)}
              highlight={highlight}
              topicColors={topicColors}
            />
          )}
          {loaded && topics.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="glass max-w-sm p-10 text-center">
                <h2 className="mb-2 text-lg font-bold">Your brain is empty</h2>
                <p className="mb-4 text-sm text-muted">
                  Log your first conversation and watch topics light up here.
                </p>
                <Link href="/add" className="btn-primary">Add a learning</Link>
              </div>
            </div>
          )}
        </div>

        {/* Search overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-4 sm:p-6">
          <div className="pointer-events-auto mx-auto max-w-xl">
            <div className="relative" data-tour="brain-search">
              <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input
                className="input !rounded-full pl-11"
                style={{ background: "rgba(18,15,20,0.7)", backdropFilter: "blur(20px)", boxShadow: "0 18px 50px rgba(0,0,0,0.45)" }}
                placeholder="Search your brain…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              />
              {(results.length > 0 || (searchFocused && !query.trim() && categories.length > 0)) && (
                <div className="overlay-panel absolute inset-x-0 top-full mt-2 overflow-hidden !rounded-[1.5rem] p-1.5">
                  {results.map((t) => (
                    <button
                      key={t.id}
                      className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
                      onClick={() => {
                        navigateTo(t.id);
                        setQuery("");
                        setCategoryFilter(null);
                      }}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: topicColors.get(t.id) ?? categoryColor(t.category) }}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.name}</span>
                      <span className="text-xs text-faint">{t.mastery}%</span>
                    </button>
                  ))}
                  {/* your areas of the brain — built from the topics you've added */}
                  {searchFocused && !query.trim() && (
                    <div className="flex flex-wrap gap-1.5 p-2.5">
                      {categories.map(([c, count]) => (
                        <button
                          key={c}
                          onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}
                          className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-all"
                          style={{
                            background: categoryFilter === c ? `${CATEGORY_COLORS[c] ?? "#a8a29e"}2e` : "rgba(255,252,245,0.05)",
                            color: CATEGORY_COLORS[c] ?? "#a8a29e",
                          }}
                        >
                          {c} · {count}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* story focus — light up one learnable story, dim the rest */}
            {stories.length > 0 && (
              <div className="pointer-events-auto mt-3 flex flex-wrap justify-center gap-2">
                {stories.map((s) => {
                  const active = focusSeries === s.series_slug;
                  return (
                    <button
                      key={s.series_slug}
                      onClick={() => setFocusSeries(active ? null : s.series_slug)}
                      className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-xl transition-all"
                      style={{
                        background: active ? `${s.color}2e` : "rgba(18,15,20,0.6)",
                        color: s.color,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                      }}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      {SERIES_TITLES[s.series_slug] ?? s.series_slug}
                      {active && <span className="opacity-70">✕</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* active filter chip — the only thing that stays over the brain */}
            {categoryFilter && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => setCategoryFilter(null)}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-xl"
                  style={{
                    background: `${CATEGORY_COLORS[categoryFilter] ?? "#a8a29e"}22`,
                    color: CATEGORY_COLORS[categoryFilter] ?? "#a8a29e",
                  }}
                >
                  {categoryFilter} <span className="opacity-70">✕</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Path panel — a stack of the topics you've walked through */}
        {current && (
          <aside className="absolute bottom-24 left-4 right-4 z-10 max-h-[52%] overflow-y-auto md:bottom-auto md:left-auto md:right-6 md:top-24 md:max-h-[72%] md:w-96">
            {trail.map((id, i) => {
              const t = byId.get(id);
              if (!t) return null;
              const isCurrent = i === 0;
              // original index in the forward path (for jump-back)
              const originalIndex = path.length - 1 - i;
              const color = topicColors.get(t.id) ?? categoryColor(t.category);

              if (!isCurrent) {
                // a walked-past step — compact, click to return
                return (
                  <div key={id}>
                    <PathConnector />
                    <button
                      onClick={() => setPath(path.slice(0, originalIndex + 1))}
                      className="overlay-panel flex w-full items-center gap-3 !rounded-2xl px-4 py-3 text-left opacity-70 transition-opacity hover:opacity-100"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.name}</span>
                      <span className="micro shrink-0">step {originalIndex + 1}</span>
                    </button>
                  </div>
                );
              }

              // the current topic — expanded card
              return (
                <div key={id}>
                  {trail.length > 1 && <PathConnector />}
                  <div className="overlay-panel p-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <span
                          className="mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                          style={{ background: `${color}20`, color }}
                        >
                          {t.category}
                        </span>
                        <Link
                          href={blogHref(t)}
                          target="_blank"
                          rel="noopener"
                          className="text-lg font-bold leading-snug transition-colors hover:text-[#f5b95f]"
                        >
                          {t.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => setPath([])}
                        className="rounded-full p-1.5 text-faint hover:bg-white/[0.06] hover:text-white"
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>



                    <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-white/80">{t.summary}</p>

                    <Link
                      href={blogHref(t)}
                      target="_blank"
                      rel="noopener"
                      className="group mb-5 inline-flex items-center gap-1.5 text-xs font-semibold"
                      style={{ color: color }}
                    >
                      Read the full topic
                      <span className="transition-transform group-hover:translate-x-0.5">↗</span>
                    </Link>

                    {t.key_points?.length > 0 && (
                      <>
                        <h3 className="micro mb-2">Key points</h3>
                        <ul className="mb-4 space-y-1.5">
                          {t.key_points.map((k, j) => (
                            <li key={j} className="flex gap-2 text-sm text-muted">
                              <span className="text-[#f5b95f]">•</span>
                              {k}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {currentConnections.length > 0 && (
                      <>
                        <h3 className="micro mb-2">Follow a connection</h3>
                        <ul className="space-y-2">
                          {currentConnections.map((c, j) => {
                            const visited = path.includes(c.topic.id);
                            return (
                              <li key={j}>
                                <button
                                  onClick={() => navigateTo(c.topic.id)}
                                  className="row-soft flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left"
                                >
                                  <span
                                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ background: topicColors.get(c.topic.id) ?? categoryColor(c.topic.category) }}
                                  />
                                  <span className="min-w-0 flex-1">
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: topicColors.get(c.topic.id) ?? categoryColor(c.topic.category) }}
                                    >
                                      {c.topic.name}
                                    </span>
                                    {visited && <span className="micro ml-2">visited</span>}
                                    {c.reason && (
                                      <span className="mt-0.5 block text-xs leading-snug text-faint">
                                        {c.reason}
                                      </span>
                                    )}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </aside>
        )}

        {/* Legend / hint */}
        {!current && (
          <div className="pointer-events-none absolute bottom-24 left-1/2 z-0 -translate-x-1/2 md:bottom-6">
            <p className="micro rounded-full bg-[#100e14]/60 px-4 py-2 backdrop-blur-xl">
              hover to name · click a glow to dive inside · follow links to walk a path
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/** A small vertical link between stacked path cards. */
function PathConnector() {
  return (
    <div className="flex justify-center py-1.5" aria-hidden>
      <span className="block h-4 w-px bg-gradient-to-b from-transparent via-white/25 to-white/25" />
    </div>
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
