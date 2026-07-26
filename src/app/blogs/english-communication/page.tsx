import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import StoryStartControl from "@/components/StoryStartControl";
import {
  EC_SERIES_TITLE,
  EC_CHAPTERS,
  EC_COLOR,
  ecSectionCount,
} from "@/lib/english-communication";

export const metadata: Metadata = {
  title: `${EC_SERIES_TITLE} · Knovis`,
  description:
    "English communication for working professionals — clarity, structure, and delivery. Practise real workplace scenarios and get judged on how you structure and deliver your answer, not just what you know.",
};

export default function EnglishCommunicationPage() {
  const total = ecSectionCount();
  const first = EC_CHAPTERS[0];

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
            style={{ background: EC_COLOR }}
            aria-hidden
          />
          <p className="micro mb-3" style={{ color: EC_COLOR }}>Communication · For Working Professionals</p>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
            {EC_SERIES_TITLE}
          </h1>
          <p className="article-lead mt-6">
            Being right isn&apos;t enough at work — you have to be understood. This series builds the
            everyday skill that promotions quietly depend on: saying what you mean clearly, structuring
            it so it lands, and delivering it with the right tone. And unlike a normal quiz, the scenario
            practice <strong>judges how you answer</strong> — grading your response on content, structure,
            and delivery, then showing you a stronger version.
          </p>
        </header>

        {/* How to read */}
        <section className="rise mb-10 grid gap-3 sm:grid-cols-3">
          <div className="glass rounded-[1.5rem] p-5">
            <p className="display text-2xl font-bold" style={{ color: EC_COLOR }}>{EC_CHAPTERS.length}</p>
            <p className="mt-1 text-sm text-muted">chapters — foundations, structure, delivery</p>
          </div>
          <div className="glass rounded-[1.5rem] p-5">
            <p className="display text-2xl font-bold text-[#43d6b5]">{total}</p>
            <p className="mt-1 text-sm text-muted">section blogs, each a complete read</p>
          </div>
          <div className="glass rounded-[1.5rem] p-5">
            <p className="display text-2xl font-bold text-[#f5b95f]">C·S·D</p>
            <p className="mt-1 text-sm text-muted">answers judged on Content, Structure &amp; Delivery</p>
          </div>
        </section>

        {first && (
          <div className="rise mb-12">
            <StoryStartControl
              seriesSlug="english-communication"
              total={total}
              firstSectionHref={`/blogs/english-communication/${first.slug}`}
            />
          </div>
        )}

        {/* Chapters */}
        <section className="rise">
          <h2 className="micro mb-5">The chapters, in reading order</h2>
          <ol className="space-y-3">
            {EC_CHAPTERS.map((chapter, i) => {
              return (
                <li key={chapter.slug}>
                  <Link
                    href={`/blogs/english-communication/${chapter.slug}`}
                    className="glass glass-hover group relative block overflow-hidden rounded-[1.5rem] p-5"
                  >
                    <div
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-25"
                      style={{ background: EC_COLOR }}
                      aria-hidden
                    />
                    <div className="flex items-start gap-4">
                      <span
                        className="display mt-0.5 shrink-0 text-2xl font-bold tabular-nums opacity-40"
                        style={{ color: EC_COLOR }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-base font-bold leading-snug transition-colors group-hover:text-white"
                          style={{ color: "rgba(255,252,245,0.92)" }}
                        >
                          {chapter.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-faint">{chapter.summary}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="text-faint">
                            {chapter.sections.length} section{chapter.sections.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      </div>
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        style={{ color: EC_COLOR }}
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
          A living series — more chapters (meetings &amp; presentations, written comms, high-stakes conversations) are on the way.
        </p>
      </main>
    </>
  );
}
