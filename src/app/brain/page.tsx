"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import BrainScene from "@/components/BrainScene";
import { getLinks, getTopics } from "@/lib/data";
import type { Topic, TopicLink } from "@/lib/types";
import { CATEGORY_COLORS, categoryColor } from "@/lib/types";

export default function BrainPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [links, setLinks] = useState<TopicLink[]>([]);
  const [query, setQuery] = useState("");
  // the walked trail of topics — each step is (ideally) linked to the previous
  const [path, setPath] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getTopics(), getLinks()]).then(([t, l]) => {
      setTopics(t);
      setLinks(l);
      setLoaded(true);
    });
  }, []);

  const byId = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

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
        <div className="absolute inset-0">
          {loaded && topics.length > 0 && (
            <BrainScene
              topics={visibleTopics}
              links={links}
              path={path}
              onSelect={(id) => id && navigateTo(id)}
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
            <div className="relative">
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
                        style={{ background: categoryColor(t.category) }}
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
              const color = categoryColor(t.category);

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
                        <h2 className="text-lg font-bold leading-snug">{t.name}</h2>
                      </div>
                      <button
                        onClick={() => setPath([])}
                        className="rounded-full p-1.5 text-faint hover:bg-white/[0.06] hover:text-white"
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Mastery */}
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>Mastery</span>
                      <span>{t.mastery}%</span>
                    </div>
                    <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${t.mastery}%`, background: color }}
                      />
                    </div>

                    <p className="mb-4 text-sm leading-relaxed text-white/80">{t.summary}</p>

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
                                    style={{ background: categoryColor(c.topic.category) }}
                                  />
                                  <span className="min-w-0 flex-1">
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: categoryColor(c.topic.category) }}
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
