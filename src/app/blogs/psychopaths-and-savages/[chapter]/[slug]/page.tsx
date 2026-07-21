import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Markdown from "@/components/Markdown";
import StoryLearnPanel from "@/components/StoryLearnPanel";
import {
  PS_SERIES_TITLE,
  PS_CHAPTERS,
  PS_COLOR,
  psNeighbors,
  psStopHref,
  psStopTitle,
  getPsSection,
  psSectionCount,
} from "@/lib/psychopaths-and-savages";

export function generateStaticParams() {
  return PS_CHAPTERS.flatMap((c) =>
    c.sections.map((s) => ({ chapter: c.slug, slug: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string; slug: string }>;
}): Promise<Metadata> {
  const { chapter: chapterSlug, slug } = await params;
  const section = getPsSection(chapterSlug, slug);
  const chapter = PS_CHAPTERS.find(c => c.slug === chapterSlug);
  if (!section || !chapter) return { title: `Not found · ${PS_SERIES_TITLE}` };
  return {
    title: `${section.title} · ${chapter.title} · ${PS_SERIES_TITLE} · Knovis`,
    description: section.summary,
  };
}

export default async function PsychopathsAndSavagesSectionPage({
  params,
}: {
  params: Promise<{ chapter: string; slug: string }>;
}) {
  const { chapter: chapterSlug, slug } = await params;
  const section = getPsSection(chapterSlug, slug);
  const chapter = PS_CHAPTERS.find(c => c.slug === chapterSlug);
  if (!section || !chapter) notFound();

  const { prev, next } = psNeighbors(section.slug);
  const chapterIdx = PS_CHAPTERS.findIndex(c => c.slug === chapterSlug);
  const total = psSectionCount();
  
  // Calculate read position across all sections
  let readPos = 0;
  for (const c of PS_CHAPTERS) {
    for (const s of c.sections) {
      readPos++;
      if (s.slug === slug) break;
    }
    if (c.slug === chapterSlug) {
      if (c.sections.some(s => s.slug === slug)) break;
    }
  }

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link
            href={`/blogs/psychopaths-and-savages/${chapter.slug}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            ← Chapter {chapterIdx + 1}: {chapter.title}
          </Link>
        </div>

        <article className="rise">
          {/* Header */}
          <header className="relative mb-9">
            <div
              className="pointer-events-none absolute -left-24 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
              style={{ background: PS_COLOR }}
              aria-hidden
            />
            <p className="micro mb-4" style={{ color: PS_COLOR }}>
              {chapter.title} · read {readPos} of {total}
            </p>
            <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
              {section.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted">{section.summary}</span>
            </div>
          </header>

          {/* The read */}
          <section className="article-body">
            <Markdown vizAccent={PS_COLOR} strictViz>{section.body}</Markdown>
          </section>

          {/* Learn this section — seeds its quiz bank into the reader's reviews */}
          <StoryLearnPanel
            seriesSlug="psychopaths-and-savages"
            chapterSlug={chapter.slug}
            sectionSlug={section.slug}
            questions={section.questions ?? []}
            color={PS_COLOR}
          />

          {/* Linear nav — the whole series is one path */}
          <nav className="mt-12 grid gap-3 sm:grid-cols-2">
            {prev && (
              <Link href={psStopHref(prev)} className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Previously</span>
                <span className="mt-1 block font-medium text-white/85">{psStopTitle(prev)}</span>
              </Link>
            )}
            {next ? (
              <Link
                href={psStopHref(next)}
                className={`glass glass-hover rounded-[1.5rem] p-4 text-right ${prev ? "" : "sm:col-start-2"}`}
              >
                <span className="micro !text-faint">Keep reading →</span>
                <span className="mt-1 block font-medium" style={{ color: PS_COLOR }}>
                  {psStopTitle(next)}
                </span>
              </Link>
            ) : (
              <Link
                href="/blogs/psychopaths-and-savages"
                className={`glass glass-hover rounded-[1.5rem] p-4 text-right ${prev ? "" : "sm:col-start-2"}`}
              >
                <span className="micro !text-faint">The end →</span>
                <span className="mt-1 block font-medium" style={{ color: PS_COLOR }}>
                  Back to {PS_SERIES_TITLE}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </>
  );
}
