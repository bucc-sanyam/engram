import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import StoryStartControl from "@/components/StoryStartControl";
import {
  SQL_SERIES_TITLE,
  SQL_TOPICS,
  SQL_DIFFICULTY_COLORS,
  sqlProblemCount,
} from "@/lib/sql";

export const metadata: Metadata = {
  title: `${SQL_SERIES_TITLE} — SQL Roadmap · Knovis`,
  description:
    "A comprehensive SQL interview roadmap retold as a linear blog series: 12 pattern chapters, curated LeetCode problems, one continuous reading path.",
};

/**
 * The SQL main blog — hub of The Query Playbook. Static content: the whole
 * series is data in src/lib/sql, rendered with zero AI calls and zero DB.
 */
export default function SqlPlaybookPage() {
  const total = sqlProblemCount();
  const first = SQL_TOPICS[0];

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-10 sm:px-6 md:pb-16">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link href="/blogs" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            ← All blogs
          </Link>
        </div>

        {/* Header */}
        <header className="rise relative mb-10">
          <div
            className="pointer-events-none absolute -left-24 -top-16 h-56 w-56 rounded-full opacity-[0.16] blur-3xl"
            style={{ background: "#22d3ee" }}
            aria-hidden
          />
          <p className="micro mb-3 !text-[#22d3ee]">{SQL_SERIES_TITLE}</p>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
            The SQL Query Playbook
          </h1>
          <p className="article-lead mt-6">
            Most people study SQL as a bag of disconnected syntax rules. This playbook retells
            SQL mastery as one continuous walk: twelve chapters, one per concept area, and inside
            each chapter curated LeetCode problems as full reads — the query, the insight, the
            pattern, and the thread that hands you to the next one. Start at chapter one and
            just keep reading.
          </p>
        </header>

        {/* How to read */}
        <section className="rise mb-10 grid gap-3 sm:grid-cols-3">
          <div className="glass rounded-[1.5rem] p-5">
            <p className="display text-2xl font-bold text-[#22d3ee]">{SQL_TOPICS.length}</p>
            <p className="mt-1 text-sm text-muted">concept chapters, in learning order</p>
          </div>
          <div className="glass rounded-[1.5rem] p-5">
            <p className="display text-2xl font-bold text-[#43d6b5]">{total}</p>
            <p className="mt-1 text-sm text-muted">problem blogs with LeetCode links</p>
          </div>
          <div className="glass rounded-[1.5rem] p-5">
            <p className="display text-2xl font-bold text-[#ff7a5c]">1</p>
            <p className="mt-1 text-sm text-muted">path — every blog links to the next</p>
          </div>
        </section>

        {first && (
          <div className="rise mb-12">
            <StoryStartControl
              seriesSlug="sql"
              total={total}
              firstSectionHref={`/blogs/sql/${first.slug}`}
            />
          </div>
        )}

        {/* Chapters */}
        <section className="rise">
          <h2 className="micro mb-5">The chapters, in reading order</h2>
          <ol className="space-y-3">
            {SQL_TOPICS.map((topic) => {
              const counts = { Easy: 0, Medium: 0, Hard: 0 };
              for (const p of topic.problems) counts[p.difficulty]++;
              return (
                <li key={topic.slug}>
                  <Link
                    href={`/blogs/sql/${topic.slug}`}
                    className="glass glass-hover group relative block overflow-hidden rounded-[1.5rem] p-5"
                  >
                    <div
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-25"
                      style={{ background: topic.color }}
                      aria-hidden
                    />
                    <div className="flex items-start gap-4">
                      <span
                        className="display mt-0.5 shrink-0 text-2xl font-bold tabular-nums opacity-40"
                        style={{ color: topic.color }}
                      >
                        {String(topic.chapter).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-base font-bold leading-snug transition-colors group-hover:text-white"
                          style={{ color: "rgba(255,252,245,0.92)" }}
                        >
                          {topic.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-faint">{topic.tagline}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="text-faint">
                            {topic.problems.length} problem{topic.problems.length === 1 ? "" : "s"}
                          </span>
                          {(["Easy", "Medium", "Hard"] as const).map((d) =>
                            counts[d] > 0 ? (
                              <span
                                key={d}
                                className="rounded-full px-2 py-0.5 font-semibold"
                                style={{
                                  background: `${SQL_DIFFICULTY_COLORS[d]}1a`,
                                  color: SQL_DIFFICULTY_COLORS[d],
                                }}
                              >
                                {counts[d]} {d.toLowerCase()}
                              </span>
                            ) : null
                          )}
                        </div>
                      </div>
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        style={{ color: topic.color }}
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <p className="mt-10 text-center text-xs leading-relaxed text-faint">
          Practice links go to{" "}
          <a
            href="https://leetcode.com/problemset/database/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/20 underline-offset-2 hover:text-white"
          >
            LeetCode SQL ↗
          </a>
          . All essays are Knovis originals — practice the problems there, read the story here.
        </p>
      </main>
    </>
  );
}
