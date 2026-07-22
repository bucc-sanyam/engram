import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Markdown from "@/components/Markdown";
import { AccentText, AccentPill } from "@/components/AccentText";
import {
  SARFAESI_SERIES_TITLE,
  SARFAESI_CHAPTERS,
  IMPORTANCE_COLORS,
  sarfaesiNeighbors,
  sarfaesiStopHref,
  sarfaesiStopTitle,
  getSarfaesiChapter,
} from "@/lib/sarfaesi-act";

export function generateStaticParams() {
  return SARFAESI_CHAPTERS.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getSarfaesiChapter(slug);
  if (!chapter) return { title: `Chapter not found · ${SARFAESI_SERIES_TITLE}` };
  return {
    title: `${chapter.title} — Chapter ${chapter.chapter} · ${SARFAESI_SERIES_TITLE} · Knovis`,
    description: chapter.tagline,
  };
}

/** A chapter of The SARFAESI Playbook — the umbrella blog for one part of the Act. */
export default async function SarfaesiChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const chapter = getSarfaesiChapter(slug);
  if (!chapter) notFound();

  const { prev, next } = sarfaesiNeighbors(chapter.slug);
  const prereqs = chapter.prereqs.map((s) => getSarfaesiChapter(s)).filter((c) => c !== null);
  const unlocks = chapter.unlocks.map((s) => getSarfaesiChapter(s)).filter((c) => c !== null);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link href="/blogs/sarfaesi-act" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            ← {SARFAESI_SERIES_TITLE}
          </Link>
        </div>

        <article className="rise">
          {/* Header */}
          <header className="relative mb-9">
            <div
              className="pointer-events-none absolute -left-24 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
              style={{ background: chapter.color }}
              aria-hidden
            />
            <AccentText as="p" className="micro mb-4" color={chapter.color}>
              Chapter {chapter.chapter} · {chapter.sections.length} section{chapter.sections.length === 1 ? "" : "s"}
            </AccentText>
            <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
              {chapter.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{chapter.tagline}</p>

            {(prereqs.length > 0 || unlocks.length > 0) && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {prereqs.length > 0 && (
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="micro !text-faint">After</span>
                    {prereqs.map((p) => (
                      <AccentPill
                        key={p.slug}
                        href={`/blogs/sarfaesi-act/${p.slug}`}
                        color={p.color}
                        className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold transition-transform hover:-translate-y-0.5"
                      >
                        {p.title}
                      </AccentPill>
                    ))}
                  </span>
                )}
                {unlocks.length > 0 && (
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="micro !text-faint">Unlocks</span>
                    {unlocks.map((p) => (
                      <AccentPill
                        key={p.slug}
                        href={`/blogs/sarfaesi-act/${p.slug}`}
                        color={p.color}
                        className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold transition-transform hover:-translate-y-0.5"
                      >
                        {p.title}
                      </AccentPill>
                    ))}
                  </span>
                )}
              </div>
            )}
          </header>

          {/* The umbrella essay */}
          <section className="article-body mb-12">
            <Markdown vizAccent={chapter.color} strictViz>{chapter.intro}</Markdown>
          </section>

          {/* The sections, in reading order */}
          <section className="border-t border-white/[0.07] pt-9">
            <AccentText as="h2" className="micro mb-2" color={chapter.color}>
              The sections, in order
            </AccentText>
            <p className="mb-6 text-sm text-faint">
              Read them top to bottom — each one hands off to the next.
            </p>
            <ol className="space-y-2.5">
              {chapter.sections.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/blogs/sarfaesi-act/${chapter.slug}/${s.slug}`}
                    className="row-soft group flex items-start gap-4 px-4 py-3.5"
                  >
                    <AccentText
                      className="display mt-0.5 shrink-0 text-lg font-bold tabular-nums opacity-40"
                      color={chapter.color}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </AccentText>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white/90 transition-colors group-hover:text-white">
                          {s.title}
                        </span>
                        <AccentPill
                          color={IMPORTANCE_COLORS[s.importance]}
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        >
                          {s.importance}
                        </AccentPill>
                        <span className="text-[10px] text-faint">{s.sectionNumber}</span>
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-faint">
                        {s.summary}
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
              <Link href={sarfaesiStopHref(prev)} className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Previously</span>
                <span className="mt-1 block font-medium text-white/85">{sarfaesiStopTitle(prev)}</span>
              </Link>
            ) : (
              <Link href="/blogs/sarfaesi-act" className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Series</span>
                <span className="mt-1 block font-medium text-white/85">{SARFAESI_SERIES_TITLE}</span>
              </Link>
            )}
            {next && (
              <Link
                href={sarfaesiStopHref(next)}
                className="glass glass-hover rounded-[1.5rem] p-4 text-right"
              >
                <span className="micro !text-faint">Begin the chapter →</span>
                <AccentText as="span" className="mt-1 block font-medium" color={chapter.color}>
                  {sarfaesiStopTitle(next)}
                </AccentText>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </>
  );
}
