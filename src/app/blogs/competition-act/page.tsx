import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import StoryStartControl from "@/components/StoryStartControl";
import {
  COMP_ACT_SERIES_TITLE,
  COMP_ACT_CHAPTERS,
  IMPORTANCE_COLORS,
  compActSectionCount,
} from "@/lib/competition-act";

export const metadata: Metadata = {
  title: `${COMP_ACT_SERIES_TITLE} — Competition Act, 2002 · Knovis`,
  description:
    "India's Competition Act, 2002 retold as a linear blog series: 10 chapters, every section a full read, each one handing off to the next.",
};

/**
 * The Competition Act main blog — hub of The Competition Code. Static content:
 * the whole series is data in src/lib/competition-act, rendered with zero AI calls and zero DB.
 */
export default function CompetitionActPage() {
  const total = compActSectionCount();
  const first = COMP_ACT_CHAPTERS[0];

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
            style={{ background: "#5ba4cf" }}
            aria-hidden
          />
          <p className="micro mb-3 !text-[#5ba4cf]">{COMP_ACT_SERIES_TITLE}</p>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
            Competition Act, 2002
          </h1>
          <p className="article-lead mt-6">
            Most people meet competition law as a maze of sections, provisos, and explanations.
            This series retells the Competition Act, 2002 as one continuous walk: ten chapters
            tracking the Act from definitions to enforcement, and inside each chapter every
            key section as a full read — what the provision says, why it matters, landmark cases,
            and the thread that hands you to the next one. Start at chapter one and just keep reading.
          </p>
        </header>

        {/* How to read */}
        <section className="rise mb-10 grid gap-3 sm:grid-cols-3">
          <div className="glass rounded-[1.5rem] p-5">
            <p className="display text-2xl font-bold text-[#5ba4cf]">{COMP_ACT_CHAPTERS.length}</p>
            <p className="mt-1 text-sm text-muted">chapters, from definitions to advocacy</p>
          </div>
          <div className="glass rounded-[1.5rem] p-5">
            <p className="display text-2xl font-bold text-[#43d6b5]">{total}</p>
            <p className="mt-1 text-sm text-muted">section blogs, each a complete read</p>
          </div>
          <div className="glass rounded-[1.5rem] p-5">
            <p className="display text-2xl font-bold text-[#ff7a5c]">1</p>
            <p className="mt-1 text-sm text-muted">path — every blog links to the next</p>
          </div>
        </section>

        {first && (
          <div className="rise mb-12">
            <StoryStartControl
              seriesSlug="competition-act"
              total={total}
              firstSectionHref={`/blogs/competition-act/${first.slug}`}
            />
          </div>
        )}

        {/* Chapters */}
        <section className="rise">
          <h2 className="micro mb-5">The chapters, in reading order</h2>
          <ol className="space-y-3">
            {COMP_ACT_CHAPTERS.map((chapter) => {
              const counts = { Foundation: 0, Core: 0, Advanced: 0 };
              for (const s of chapter.sections) counts[s.importance]++;
              return (
                <li key={chapter.slug}>
                  <Link
                    href={`/blogs/competition-act/${chapter.slug}`}
                    className="glass glass-hover group relative block overflow-hidden rounded-[1.5rem] p-5"
                  >
                    <div
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-25"
                      style={{ background: chapter.color }}
                      aria-hidden
                    />
                    <div className="flex items-start gap-4">
                      <span
                        className="display mt-0.5 shrink-0 text-2xl font-bold tabular-nums opacity-40"
                        style={{ color: chapter.color }}
                      >
                        {String(chapter.chapter).padStart(2, "0")}
                      </span>
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
                              <span
                                key={imp}
                                className="rounded-full px-2 py-0.5 font-semibold"
                                style={{
                                  background: `${IMPORTANCE_COLORS[imp]}1a`,
                                  color: IMPORTANCE_COLORS[imp],
                                }}
                              >
                                {counts[imp]} {imp.toLowerCase()}
                              </span>
                            ) : null
                          )}
                        </div>
                      </div>
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        style={{ color: chapter.color }}
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <p className="mt-10 text-center text-xs leading-relaxed text-faint">
          Based on the{" "}
          <a
            href="https://www.indiacode.nic.in/bitstream/123456789/2006/1/A2002-54.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/20 underline-offset-2 hover:text-white"
          >
            Competition Act, 2002 ↗
          </a>
          . All essays are Knovis originals — study the Act there, read the story here.
        </p>
      </main>
    </>
  );
}
