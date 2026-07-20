import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Markdown from "@/components/Markdown";
import StoryLearnPanel from "@/components/StoryLearnPanel";
import {
  MACRO_SERIES_TITLE,
  MACROECONOMICS_CHAPTERS,
  MACRO_IMPORTANCE_COLORS,
  macroNeighbors,
  macroSectionCount,
  macroSectionNumber,
  macroStopHref,
  macroStopTitle,
  getMacroSection,
} from "@/lib/macroeconomics";

export function generateStaticParams() {
  return MACROECONOMICS_CHAPTERS.flatMap((c) =>
    c.sections.map((s) => ({ chapter: c.slug, slug: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string; slug: string }>;
}): Promise<Metadata> {
  const { chapter: chapterSlug, slug } = await params;
  const hit = getMacroSection(chapterSlug, slug);
  if (!hit) return { title: `Not found · ${MACRO_SERIES_TITLE}` };
  return {
    title: `${hit.section.title} · ${hit.chapter.title} · ${MACRO_SERIES_TITLE} · Knovis`,
    description: hit.section.summary,
  };
}

export default async function MacroSectionPage({
  params,
}: {
  params: Promise<{ chapter: string; slug: string }>;
}) {
  const { chapter: chapterSlug, slug } = await params;
  const hit = getMacroSection(chapterSlug, slug);
  if (!hit) notFound();
  const { chapter, section } = hit;

  const { prev, next } = macroNeighbors(chapter.slug, section.slug);
  const number = macroSectionNumber(chapter.slug, section.slug);
  const total = macroSectionCount();
  const impColor = MACRO_IMPORTANCE_COLORS[section.importance];

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link
            href={`/blogs/macroeconomics/${chapter.slug}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            ← Chapter {chapter.chapter}: {chapter.title}
          </Link>
        </div>

        <article className="rise">
          <header className="relative mb-9">
            <div
              className="pointer-events-none absolute -left-24 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
              style={{ background: chapter.color }}
              aria-hidden
            />
            <p className="micro mb-4" style={{ color: chapter.color }}>
              {chapter.title} · read {number} of {total}
            </p>
            <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
              {section.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{ background: `${impColor}1a`, color: impColor }}
              >
                {section.importance}
              </span>
              <span className="text-muted">{section.sectionNumber}</span>
            </div>
          </header>

          <section className="article-body">
            <Markdown vizAccent={chapter.color} strictViz>{section.body}</Markdown>
          </section>

          <StoryLearnPanel
            seriesSlug="macroeconomics"
            chapterSlug={chapter.slug}
            sectionSlug={section.slug}
            questions={section.questions ?? []}
            color={chapter.color}
          />

          <nav className="mt-12 grid gap-3 sm:grid-cols-2">
            {prev && (
              <Link href={macroStopHref(prev)} className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Previously</span>
                <span className="mt-1 block font-medium text-white/85">{macroStopTitle(prev)}</span>
              </Link>
            )}
            {next ? (
              <Link
                href={macroStopHref(next)}
                className={`glass glass-hover rounded-[1.5rem] p-4 text-right ${prev ? "" : "sm:col-start-2"}`}
              >
                <span className="micro !text-faint">Keep reading →</span>
                <span className="mt-1 block font-medium" style={{ color: chapter.color }}>
                  {macroStopTitle(next)}
                </span>
              </Link>
            ) : (
              <Link
                href="/blogs/macroeconomics"
                className={`glass glass-hover rounded-[1.5rem] p-4 text-right ${prev ? "" : "sm:col-start-2"}`}
              >
                <span className="micro !text-faint">The end →</span>
                <span className="mt-1 block font-medium text-[#a3e635]">
                  Back to {MACRO_SERIES_TITLE}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </>
  );
}
