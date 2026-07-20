import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Markdown from "@/components/Markdown";
import {
  MACRO_SERIES_TITLE,
  MACROECONOMICS_CHAPTERS,
  MACRO_IMPORTANCE_COLORS,
  macroNeighbors,
  macroStopHref,
  macroStopTitle,
  getMacroChapter,
} from "@/lib/macroeconomics";

export function generateStaticParams() {
  return MACROECONOMICS_CHAPTERS.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getMacroChapter(slug);
  if (!chapter) return { title: `Chapter not found · ${MACRO_SERIES_TITLE}` };
  return {
    title: `${chapter.title} — Chapter ${chapter.chapter} · ${MACRO_SERIES_TITLE} · Knovis`,
    description: chapter.tagline,
  };
}

export default async function MacroChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const chapter = getMacroChapter(slug);
  if (!chapter) notFound();

  const { prev, next } = macroNeighbors(chapter.slug);
  const prereqs = chapter.prereqs.map((s) => getMacroChapter(s)).filter((c) => c !== null);
  const unlocks = chapter.unlocks.map((s) => getMacroChapter(s)).filter((c) => c !== null);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link href="/blogs/macroeconomics" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            ← {MACRO_SERIES_TITLE}
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
              Chapter {chapter.chapter} · {chapter.sections.length} section{chapter.sections.length === 1 ? "" : "s"}
            </p>
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
                      <Link
                        key={p.slug}
                        href={`/blogs/macroeconomics/${p.slug}`}
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
                        href={`/blogs/macroeconomics/${p.slug}`}
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

          <section className="article-body mb-12">
            <Markdown vizAccent={chapter.color} strictViz>{chapter.intro}</Markdown>
          </section>

          <section className="border-t border-white/[0.07] pt-9">
            <h2 className="micro mb-2" style={{ color: chapter.color }}>
              The sections, in order
            </h2>
            <p className="mb-6 text-sm text-faint">
              Read them top to bottom — each one hands off to the next.
            </p>
            <ol className="space-y-2.5">
              {chapter.sections.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/blogs/macroeconomics/${chapter.slug}/${s.slug}`}
                    className="row-soft group flex items-start gap-4 px-4 py-3.5"
                  >
                    <span
                      className="display mt-0.5 shrink-0 text-lg font-bold tabular-nums opacity-40"
                      style={{ color: chapter.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white/90 transition-colors group-hover:text-white">
                          {s.title}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: `${MACRO_IMPORTANCE_COLORS[s.importance]}1a`,
                            color: MACRO_IMPORTANCE_COLORS[s.importance],
                          }}
                        >
                          {s.importance}
                        </span>
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

          <nav className="mt-12 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={macroStopHref(prev)} className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Previously</span>
                <span className="mt-1 block font-medium text-white/85">{macroStopTitle(prev)}</span>
              </Link>
            ) : (
              <Link href="/blogs/macroeconomics" className="glass glass-hover rounded-[1.5rem] p-4">
                <span className="micro !text-faint">← Series</span>
                <span className="mt-1 block font-medium text-white/85">{MACRO_SERIES_TITLE}</span>
              </Link>
            )}
            {next && (
              <Link
                href={macroStopHref(next)}
                className="glass glass-hover rounded-[1.5rem] p-4 text-right"
              >
                <span className="micro !text-faint">Begin the chapter →</span>
                <span className="mt-1 block font-medium" style={{ color: chapter.color }}>
                  {macroStopTitle(next)}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
    </>
  );
}
