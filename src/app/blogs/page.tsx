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
        <div className="rise mb-10" data-tour="blogs-intro">
          <p className="micro mb-3 !text-[#43d6b5]">Knowledge library</p>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
            Your topic blogs
          </h1>
          <p className="mt-3 text-lg text-muted">
            Deep reads on every topic in your knowledge graph — key ideas, connections, and sources.
          </p>
        </div>

        {/* The Pattern Atlas — static DSA series */}
        <Link
          href="/blogs/dsa"
          className="glass glass-hover rise group relative mb-8 block overflow-hidden rounded-[1.5rem] p-5"
        >
          <div
            className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f5b95f] opacity-15 blur-3xl transition-opacity group-hover:opacity-25"
            aria-hidden
          />
          <p className="micro mb-2 !text-[#f5b95f]">The Pattern Atlas · DSA series</p>
          <h2 className="text-lg font-bold text-white/90 transition-colors group-hover:text-white">
            The NeetCode 150, read as one story
          </h2>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-faint">
            18 pattern chapters, 150 question blogs, one continuous reading path — every
            problem&apos;s insight, and the thread that hands you to the next.
          </p>
          <span
            aria-hidden
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f5b95f] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          >
            →
          </span>
        </Link>

        {/* The Competition Code — static Competition Act series */}
        <Link
          href="/blogs/competition-act"
          className="glass glass-hover rise group relative mb-8 block overflow-hidden rounded-[1.5rem] p-5"
        >
          <div
            className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#5ba4cf] opacity-15 blur-3xl transition-opacity group-hover:opacity-25"
            aria-hidden
          />
          <p className="micro mb-2 !text-[#5ba4cf]">The Competition Code · Legal series</p>
          <h2 className="text-lg font-bold text-white/90 transition-colors group-hover:text-white">
            The Competition Act, 2002 — read as one story
          </h2>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-faint">
            10 chapters, 31 section blogs, one continuous reading path — every provision&apos;s
            insight, landmark cases, and the thread that hands you to the next.
          </p>
          <span
            aria-hidden
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5ba4cf] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          >
            →
          </span>
        </Link>

        {/* The Query Playbook — static SQL series */}
        <Link
          href="/blogs/sql"
          className="glass glass-hover rise group relative mb-8 block overflow-hidden rounded-[1.5rem] p-5"
        >
          <div
            className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#22d3ee] opacity-15 blur-3xl transition-opacity group-hover:opacity-25"
            aria-hidden
          />
          <p className="micro mb-2 !text-[#22d3ee]">The Query Playbook · SQL series</p>
          <h2 className="text-lg font-bold text-white/90 transition-colors group-hover:text-white">
            SQL, read as one story
          </h2>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-faint">
            12 chapters, 41 LeetCode problems, one continuous reading path — from SELECT
            to window functions to pivoting, with practice links on every problem.
          </p>
          <span
            aria-hidden
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[#22d3ee] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          >
            →
          </span>
        </Link>

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
