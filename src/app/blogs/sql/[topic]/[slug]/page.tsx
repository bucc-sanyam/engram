import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Markdown from "@/components/Markdown";
import StoryLearnPanel from "@/components/StoryLearnPanel";
import {
  SQL_SERIES_TITLE,
  SQL_TOPICS,
  SQL_DIFFICULTY_COLORS,
  sqlNeighbors,
  sqlProblemCount,
  sqlProblemNumber,
  sqlStopHref,
  sqlStopTitle,
  getSqlProblem,
} from "@/lib/sql";

export function generateStaticParams() {
  return SQL_TOPICS.flatMap((t) =>
    t.problems.map((p) => ({ topic: t.slug, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}): Promise<Metadata> {
  const { topic: topicSlug, slug } = await params;
  const hit = getSqlProblem(topicSlug, slug);
  if (!hit) return { title: `Not found · ${SQL_SERIES_TITLE}` };
  return {
    title: `${hit.problem.title} · ${hit.topic.title} · ${SQL_SERIES_TITLE} · Knovis`,
    description: hit.problem.summary,
  };
}

/** A single problem blog in The Query Playbook. */
export default async function SqlProblemPage({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic: topicSlug, slug } = await params;
  const hit = getSqlProblem(topicSlug, slug);
  if (!hit) notFound();
  const { topic, problem } = hit;

  const { prev, next } = sqlNeighbors(topic.slug, problem.slug);
  const number = sqlProblemNumber(topic.slug, problem.slug);
  const total = sqlProblemCount();
  const diffColor = SQL_DIFFICULTY_COLORS[problem.difficulty];

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link
            href={`/blogs/sql/${topic.slug}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            ← Chapter {topic.chapter}: {topic.title}
          </Link>
        </div>

        <article className="rise">
          {/* Header */}
          <header className="relative mb-9">
            <div
              className="pointer-events-none absolute -left-24 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
              style={{ background: topic.color }}
              aria-hidden
            />
            <p className="micro mb-4" style={{ color: topic.color }}>
              {topic.title} · read {number} of {total}
            </p>
            <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
              {problem.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{ background: `${diffColor}1a`, color: diffColor }}
              >
                {problem.difficulty}
              </span>
              <span className="text-muted">LC #{problem.leetcodeNumber}</span>
              <a
                href={problem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted underline decoration-white/20 underline-offset-2 transition-colors hover:text-white hover:decoration-white/50"
              >
                Attempt on LeetCode ↗
              </a>
            </div>
          </header>

          {/* The read */}
          <section className="article-body">
            <Markdown>{problem.body}</Markdown>
          </section>

          {/* Practice link */}
          <div className="mt-8">
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Practice this problem on LeetCode →
            </a>
          </div>

          {/* Learn this section — seeds its quiz bank into the reader's reviews */}
          <StoryLearnPanel
            seriesSlug="sql"
            chapterSlug={topic.slug}
            sectionSlug={problem.slug}
            questions={[]}
            color={topic.color}
          />

          {/* Linear nav — the whole series is one path */}
          <nav className="mt-12 grid gap-3 sm:grid-cols-2">
            {prev && (
              <Link href={sqlStopHref(prev)} className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Previously</span>
                <span className="mt-1 block font-medium text-white/85">{sqlStopTitle(prev)}</span>
              </Link>
            )}
            {next ? (
              <Link
                href={sqlStopHref(next)}
                className={`glass glass-hover rounded-[1.5rem] p-4 text-right ${prev ? "" : "sm:col-start-2"}`}
              >
                <span className="micro !text-faint">Keep reading →</span>
                <span className="mt-1 block font-medium" style={{ color: topic.color }}>
                  {sqlStopTitle(next)}
                </span>
              </Link>
            ) : (
              <Link
                href="/blogs/sql"
                className={`glass glass-hover rounded-[1.5rem] p-4 text-right ${prev ? "" : "sm:col-start-2"}`}
              >
                <span className="micro !text-faint">The end →</span>
                <span className="mt-1 block font-medium text-[#22d3ee]">
                  Back to {SQL_SERIES_TITLE}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </>
  );
}
