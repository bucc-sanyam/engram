import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import {
  EC_SERIES_TITLE,
  EC_CHAPTERS,
  EC_COLOR,
  ecNeighbors,
  ecStopHref,
  ecStopTitle,
  getEcChapter,
} from "@/lib/english-communication";

export function generateStaticParams() {
  return EC_CHAPTERS.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getEcChapter(slug);
  if (!chapter) return { title: `Chapter not found · ${EC_SERIES_TITLE}` };
  const idx = EC_CHAPTERS.findIndex(c => c.slug === slug);
  return {
    title: `${chapter.title} — Chapter ${idx + 1} · ${EC_SERIES_TITLE} · Knovis`,
    description: chapter.summary,
  };
}

export default async function EnglishCommunicationChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const chapter = getEcChapter(slug);
  if (!chapter) notFound();

  const { prev, next } = ecNeighbors(chapter.slug);
  const chapterIdx = EC_CHAPTERS.findIndex(c => c.slug === slug);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link href="/blogs/english-communication" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            ← {EC_SERIES_TITLE}
          </Link>
        </div>

        <article className="rise">
          {/* Header */}
          <header className="relative mb-9">
            <div
              className="pointer-events-none absolute -left-24 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
              style={{ background: EC_COLOR }}
              aria-hidden
            />
            <p className="micro mb-4" style={{ color: EC_COLOR }}>
              Chapter {chapterIdx + 1} · {chapter.sections.length} section{chapter.sections.length === 1 ? "" : "s"}
            </p>
            <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
              {chapter.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{chapter.summary}</p>
          </header>

          {/* The sections, in reading order */}
          <section className="border-t border-white/[0.07] pt-9">
            <h2 className="micro mb-2" style={{ color: EC_COLOR }}>
              The sections, in order
            </h2>
            <p className="mb-6 text-sm text-faint">
              Read them top to bottom — each one hands off to the next.
            </p>
            <ol className="space-y-2.5">
              {chapter.sections.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/blogs/english-communication/${chapter.slug}/${s.slug}`}
                    className="row-soft group flex items-start gap-4 px-4 py-3.5"
                  >
                    <span
                      className="display mt-0.5 shrink-0 text-lg font-bold tabular-nums opacity-40"
                      style={{ color: EC_COLOR }}
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
              <Link href={ecStopHref(prev)} className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Previously</span>
                <span className="mt-1 block font-medium text-white/85">{ecStopTitle(prev)}</span>
              </Link>
            ) : (
              <Link href="/blogs/english-communication" className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Series</span>
                <span className="mt-1 block font-medium text-white/85">{EC_SERIES_TITLE}</span>
              </Link>
            )}
            {next && (
              <Link
                href={ecStopHref(next)}
                className="glass glass-hover rounded-[1.5rem] p-4 text-right"
              >
                <span className="micro !text-faint">Begin the chapter →</span>
                <span className="mt-1 block font-medium" style={{ color: EC_COLOR }}>
                  {ecStopTitle(next)}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </>
  );
}
