import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Markdown from "@/components/Markdown";
import {
  DSA_SERIES_TITLE,
  DSA_TOPICS,
  DSA_DIFFICULTY_COLORS,
  dsaNeighbors,
  dsaStopHref,
  dsaStopTitle,
  getDsaTopic,
} from "@/lib/dsa";

export function generateStaticParams() {
  return DSA_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getDsaTopic(slug);
  if (!topic) return { title: `Chapter not found · ${DSA_SERIES_TITLE}` };
  return {
    title: `${topic.title} — Chapter ${topic.chapter} · ${DSA_SERIES_TITLE} · Knovis`,
    description: topic.tagline,
  };
}

/** A chapter of the Pattern Atlas — the umbrella blog for one DSA pattern. */
export default async function DsaTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = getDsaTopic(slug);
  if (!topic) notFound();

  const { prev, next } = dsaNeighbors(topic.slug);
  const prereqs = topic.prereqs.map((s) => getDsaTopic(s)).filter((t) => t !== null);
  const unlocks = topic.unlocks.map((s) => getDsaTopic(s)).filter((t) => t !== null);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link href="/blogs/dsa" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            ← {DSA_SERIES_TITLE}
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
              Chapter {topic.chapter} · {topic.problems.length} questions
            </p>
            <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
              {topic.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{topic.tagline}</p>

            {(prereqs.length > 0 || unlocks.length > 0) && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {prereqs.length > 0 && (
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="micro !text-faint">After</span>
                    {prereqs.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blogs/dsa/${p.slug}`}
                        className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold transition-transform hover:-translate-y-0.5"
                        style={{ background: `${p.color}1a`, color: p.color }}
                      >
                        {p.title}
                      </Link>
                    ))}
                  </span>
                )}
                {unlocks.length > 0 && (
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="micro !text-faint">Unlocks</span>
                    {unlocks.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blogs/dsa/${p.slug}`}
                        className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold transition-transform hover:-translate-y-0.5"
                        style={{ background: `${p.color}1a`, color: p.color }}
                      >
                        {p.title}
                      </Link>
                    ))}
                  </span>
                )}
              </div>
            )}
          </header>

          {/* The umbrella essay */}
          <section className="article-body mb-12">
            <Markdown vizAccent={topic.color} strictViz>{topic.intro}</Markdown>
          </section>

          {/* The questions, in reading order */}
          <section className="border-t border-white/[0.07] pt-9">
            <h2 className="micro mb-2" style={{ color: topic.color }}>
              The questions, in order
            </h2>
            <p className="mb-6 text-sm text-faint">
              Read them top to bottom — each one hands off to the next.
            </p>
            <ol className="space-y-2.5">
              {topic.problems.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/blogs/dsa/${topic.slug}/${p.slug}`}
                    className="row-soft group flex items-start gap-4 px-4 py-3.5"
                  >
                    <span
                      className="display mt-0.5 shrink-0 text-lg font-bold tabular-nums opacity-40"
                      style={{ color: topic.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white/90 transition-colors group-hover:text-white">
                          {p.title}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: `${DSA_DIFFICULTY_COLORS[p.difficulty]}1a`,
                            color: DSA_DIFFICULTY_COLORS[p.difficulty],
                          }}
                        >
                          {p.difficulty}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-faint">
                        {p.summary}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 text-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          {/* Linear nav */}
          <nav className="mt-12 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={dsaStopHref(prev)} className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Previously</span>
                <span className="mt-1 block font-medium text-white/85">{dsaStopTitle(prev)}</span>
              </Link>
            ) : (
              <Link href="/blogs/dsa" className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Series</span>
                <span className="mt-1 block font-medium text-white/85">{DSA_SERIES_TITLE}</span>
              </Link>
            )}
            {next && (
              <Link
                href={dsaStopHref(next)}
                className="glass glass-hover rounded-[1.5rem] p-4 text-right"
              >
                <span className="micro !text-faint">Begin the chapter →</span>
                <span className="mt-1 block font-medium" style={{ color: topic.color }}>
                  {dsaStopTitle(next)}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </>
  );
}
