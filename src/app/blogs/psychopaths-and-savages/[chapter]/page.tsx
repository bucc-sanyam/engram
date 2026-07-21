import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Markdown from "@/components/Markdown";
import {
  PS_SERIES_TITLE,
  PS_CHAPTERS,
  PS_COLOR,
  psNeighbors,
  psStopHref,
  psStopTitle,
  getPsChapter,
} from "@/lib/psychopaths-and-savages";

export function generateStaticParams() {
  return PS_CHAPTERS.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getPsChapter(slug);
  if (!chapter) return { title: `Chapter not found · ${PS_SERIES_TITLE}` };
  const idx = PS_CHAPTERS.findIndex(c => c.slug === slug);
  return {
    title: `${chapter.title} — Chapter ${idx + 1} · ${PS_SERIES_TITLE} · Knovis`,
    description: chapter.summary,
  };
}

export default async function PsychopathsAndSavagesChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const chapter = getPsChapter(slug);
  if (!chapter) notFound();

  const { prev, next } = psNeighbors(chapter.slug);
  const chapterIdx = PS_CHAPTERS.findIndex(c => c.slug === slug);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link href="/blogs/psychopaths-and-savages" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            ← {PS_SERIES_TITLE}
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
              Chapter {chapterIdx + 1} · {chapter.sections.length} section{chapter.sections.length === 1 ? "" : "s"}
            </p>
            <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
              {chapter.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{chapter.summary}</p>
          </header>

          {/* The sections, in reading order */}
          <section className="border-t border-white/[0.07] pt-9">
            <h2 className="micro mb-2" style={{ color: PS_COLOR }}>
              The sections, in order
            </h2>
            <p className="mb-6 text-sm text-faint">
              Read them top to bottom — each one hands off to the next.
            </p>
            <ol className="space-y-2.5">
              {chapter.sections.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/blogs/psychopaths-and-savages/${chapter.slug}/${s.slug}`}
                    className="row-soft group flex items-start gap-4 px-4 py-3.5"
                  >
                    <span
                      className="display mt-0.5 shrink-0 text-lg font-bold tabular-nums opacity-40"
                      style={{ color: PS_COLOR }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white/90 transition-colors group-hover:text-white">
                          {s.title}
                        </span>
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
              <Link href={psStopHref(prev)} className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Previously</span>
                <span className="mt-1 block font-medium text-white/85">{psStopTitle(prev)}</span>
              </Link>
            ) : (
              <Link href="/blogs/psychopaths-and-savages" className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Series</span>
                <span className="mt-1 block font-medium text-white/85">{PS_SERIES_TITLE}</span>
              </Link>
            )}
            {next && (
              <Link
                href={psStopHref(next)}
                className="glass glass-hover rounded-[1.5rem] p-4 text-right"
              >
                <span className="micro !text-faint">Begin the chapter →</span>
                <span className="mt-1 block font-medium" style={{ color: PS_COLOR }}>
                  {psStopTitle(next)}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </>
  );
}
