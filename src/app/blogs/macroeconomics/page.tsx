import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import StoryStartControl from "@/components/StoryStartControl";
import { AccentText, AccentPill } from "@/components/AccentText";
import {
  MACRO_SERIES_TITLE,
  MACROECONOMICS_CHAPTERS,
  MACRO_IMPORTANCE_COLORS,
  macroSectionCount,
} from "@/lib/macroeconomics";

export const metadata: Metadata = {
  title: `${MACRO_SERIES_TITLE} · Knovis`,
  description:
    "Alex M. Thomas's Macroeconomics retold as a linear blog series: 6 chapters, every section a full read, each one handing off to the next.",
};

export default function MacroeconomicsPage() {
  const total = macroSectionCount();
  const first = MACROECONOMICS_CHAPTERS[0];

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
            style={{ background: "#a3e635" }}
            aria-hidden
          />
          <AccentText as="p" color="#a3e635" className="micro mb-3">
            {MACRO_SERIES_TITLE}
          </AccentText>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
            Macroeconomics: An Introduction
          </h1>
          <p className="article-lead mt-6">
            A critical approach to understanding macroeconomics, focusing on the history of economic thought, competing paradigms, and the reality of the Indian economy. This series retells the textbook as one continuous walk: six chapters, from definitions to policy, with every section serving as a full read. Start at chapter one and just keep reading.
          </p>
        </header>

        {/* How to read */}
        <section className="rise mb-10 grid gap-3 sm:grid-cols-3">
          <div className="glass rounded-[1.5rem] p-5">
            <AccentText as="p" color="#a3e635" className="display text-2xl font-bold">
              {MACROECONOMICS_CHAPTERS.length}
            </AccentText>
            <p className="mt-1 text-sm text-muted">chapters, from foundations to policy</p>
          </div>
          <div className="glass rounded-[1.5rem] p-5">
            <AccentText as="p" color="#43d6b5" className="display text-2xl font-bold">
              {total}
            </AccentText>
            <p className="mt-1 text-sm text-muted">section blogs, each a complete read</p>
          </div>
          <div className="glass rounded-[1.5rem] p-5">
            <AccentText as="p" color="#ff7a5c" className="display text-2xl font-bold">
              1
            </AccentText>
            <p className="mt-1 text-sm text-muted">path — every blog links to the next</p>
          </div>
        </section>

        {first && (
          <div className="rise mb-12">
            <StoryStartControl
              seriesSlug="macroeconomics"
              total={total}
              firstSectionHref={`/blogs/macroeconomics/${first.slug}`}
            />
          </div>
        )}

        {/* Chapters */}
        <section className="rise">
          <h2 className="micro mb-5">The chapters, in reading order</h2>
          <ol className="space-y-3">
            {MACROECONOMICS_CHAPTERS.map((chapter) => {
              const counts = { Foundation: 0, Core: 0, Advanced: 0 };
              for (const s of chapter.sections) counts[s.importance]++;
              return (
                <li key={chapter.slug}>
                  <Link
                    href={`/blogs/macroeconomics/${chapter.slug}`}
                    className="glass glass-hover group relative block overflow-hidden rounded-[1.5rem] p-5"
                  >
                    <div
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-25"
                      style={{ background: chapter.color }}
                      aria-hidden
                    />
                    <div className="flex items-start gap-4">
                      <AccentText
                        color={chapter.color}
                        className="display mt-0.5 shrink-0 text-2xl font-bold tabular-nums opacity-40"
                      >
                        {String(chapter.chapter).padStart(2, "0")}
                      </AccentText>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-base font-bold leading-snug transition-colors group-hover:text-white"
                          style={{ color: "rgba(255,252,245,0.92)" }}
                        >
                          {chapter.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-faint">{chapter.tagline}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="text-faint">
                            {chapter.sections.length} section{chapter.sections.length === 1 ? "" : "s"}
                          </span>
                          {(["Foundation", "Core", "Advanced"] as const).map((imp) =>
                            counts[imp] > 0 ? (
                              <AccentPill
                                key={imp}
                                color={MACRO_IMPORTANCE_COLORS[imp]}
                                className="rounded-full px-2 py-0.5 font-semibold"
                              >
                                {counts[imp]} {imp.toLowerCase()}
                              </AccentPill>
                            ) : null
                          )}
                        </div>
                      </div>
                      <AccentText
                        ariaHidden
                        color={chapter.color}
                        className="mt-1 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                      >
                        →
                      </AccentText>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      </main>
    </>
  );
}
