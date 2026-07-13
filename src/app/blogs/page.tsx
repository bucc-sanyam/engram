"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import { getTopics } from "@/lib/data";
import type { Topic } from "@/lib/types";
import { categoryColor, CATEGORY_COLORS } from "@/lib/types";

export default function BlogsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    getTopics()
      .then(setTopics)
      .finally(() => setLoaded(true));
  }, []);

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
        <div className="rise mb-10">
          <p className="micro mb-3 !text-[#43d6b5]">Knowledge library</p>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
            Your topic blogs
          </h1>
          <p className="mt-3 text-lg text-muted">
            Deep reads on every topic in your knowledge graph — key ideas, connections, and sources.
          </p>
        </div>

        {/* Search + filter */}
        <div className="rise mb-8 space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              id="blogs-search"
              className="input !rounded-full pl-11"
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
                  href={`/brain/${topic.id}`}
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

                  {/* Footer — mastery + review count */}
                  <div className="flex items-center gap-3 text-xs text-faint">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block h-1 w-14 overflow-hidden rounded-full bg-white/[0.08]">
                        <span
                          className="block h-full rounded-full"
                          style={{ width: `${topic.mastery}%`, background: color }}
                        />
                      </span>
                      <span style={{ color }}>{topic.mastery}%</span>
                    </span>
                    <span className="text-white/20">·</span>
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
    </>
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
