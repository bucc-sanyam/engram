import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Markdown from "@/components/Markdown";
import StoryLearnPanel from "@/components/StoryLearnPanel";
import { AccentText, DifficultyPill } from "@/components/AccentText";
import {
  DSA_SERIES_TITLE,
  DSA_TOPICS,
  DSA_DIFFICULTY_COLORS,
  dsaNeighbors,
  dsaProblemCount,
  dsaProblemNumber,
  dsaStopHref,
  dsaStopTitle,
  dsaLeetcodeUrl,
  getDsaProblem,
} from "@/lib/dsa";

export function generateStaticParams() {
  return DSA_TOPICS.flatMap((t) =>
    t.problems.map((p) => ({ topic: t.slug, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}): Promise<Metadata> {
  const { topic: topicSlug, slug } = await params;
  const hit = getDsaProblem(topicSlug, slug);
  if (!hit) return { title: `Not found · ${DSA_SERIES_TITLE}` };
  return {
    title: `${hit.problem.title} · ${hit.topic.title} · ${DSA_SERIES_TITLE} · Knovis`,
    description: hit.problem.summary,
  };
}

/** A single question blog in the Pattern Atlas. */
export default async function DsaProblemPage({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic: topicSlug, slug } = await params;
  const hit = getDsaProblem(topicSlug, slug);
  if (!hit) notFound();
  const { topic, problem } = hit;

  const { prev, next } = dsaNeighbors(topic.slug, problem.slug);
  const number = dsaProblemNumber(topic.slug, problem.slug);
  const total = dsaProblemCount();
  const diffColor = DSA_DIFFICULTY_COLORS[problem.difficulty];

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link
            href={`/blogs/dsa/${topic.slug}`}
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
            <AccentText as="p" className="micro mb-4" color={topic.color}>
              {topic.title} · read {number} of {total}
            </AccentText>
            <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
              {problem.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <DifficultyPill difficulty={problem.difficulty} color={diffColor} />
              <a
                href={problem.neetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline decoration-white/20 underline-offset-2 transition-colors hover:text-white hover:decoration-white/50"
              >
                Practice on NeetCode ↗
              </a>
              <a
                href={dsaLeetcodeUrl(problem)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline decoration-white/20 underline-offset-2 transition-colors hover:text-white hover:decoration-white/50"
              >
                Solve on LeetCode ↗
              </a>
            </div>
          </header>

          {/* The read */}
          <section className="article-body">
            <Markdown vizAccent={topic.color} strictViz>{problem.body}</Markdown>
          </section>

          {/* Learn this section — seeds its quiz bank into the reader's reviews */}
          <StoryLearnPanel
            seriesSlug="dsa"
            chapterSlug={topic.slug}
            sectionSlug={problem.slug}
            questions={[]}
            color={topic.color}
          />

          {/* Linear nav — the whole series is one path */}
          <nav className="mt-12 grid gap-3 sm:grid-cols-2">
            {prev && (
              <Link href={dsaStopHref(prev)} className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Previously</span>
                <span className="mt-1 block font-medium text-white/85">{dsaStopTitle(prev)}</span>
              </Link>
            )}
            {next ? (
              <Link
                href={dsaStopHref(next)}
                className={`glass glass-hover rounded-[1.5rem] p-4 text-right ${prev ? "" : "sm:col-start-2"}`}
              >
                <span className="micro !text-faint">Keep reading →</span>
                <AccentText as="span" className="mt-1 block font-medium" color={topic.color}>
                  {dsaStopTitle(next)}
                </AccentText>
              </Link>
            ) : (
              <Link
                href="/blogs/dsa"
                className={`glass glass-hover rounded-[1.5rem] p-4 text-right ${prev ? "" : "sm:col-start-2"}`}
              >
                <span className="micro !text-faint">The end →</span>
                <span className="mt-1 block font-medium text-[#f5b95f]">
                  Back to {DSA_SERIES_TITLE}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </>
  );
}
