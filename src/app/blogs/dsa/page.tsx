import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import StoryStartControl from "@/components/StoryStartControl";
import { AccentText, AccentPill } from "@/components/AccentText";
import {
  DSA_SERIES_TITLE,
  DSA_TOPICS,
  DSA_DIFFICULTY_COLORS,
  dsaProblemCount,
} from "@/lib/dsa";

export const metadata: Metadata = {
  title: `${DSA_SERIES_TITLE} — The NeetCode 150 · Knovis`,
  description:
    "The NeetCode 150 roadmap retold as a linear blog series: 18 pattern chapters, every question a full read, each one handing off to the next.",
};

/**
 * The DSA main blog — hub of the Pattern Atlas. Static content: the whole
 * series is data in src/lib/dsa, rendered with zero AI calls and zero DB.
 */
export default function DsaAtlasPage() {
  const total = dsaProblemCount();
  const first = DSA_TOPICS[0];

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
            style={{ background: "#f5b95f" }}
            aria-hidden
          />
          <AccentText as="p" color="#f5b95f" className="micro mb-3">
            {DSA_SERIES_TITLE}
          </AccentText>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
            The NeetCode 150
          </h1>
          <p className="article-lead mt-6">
            Most people meet data structures and algorithms as a pile of disconnected puzzles.
            This atlas retells the NeetCode 150 roadmap as one continuous walk: eighteen
            chapters, one per pattern, and inside each chapter every question as a full read —
            what the problem really asks, the insight that cracks it, and the thread that hands
            you to the next one. Start at chapter one and just keep reading.
          </p>
        </header>

        {/* How to read */}
        <section className="rise mb-10 grid gap-3 sm:grid-cols-3">
          <div className="glass rounded-[1.5rem] p-5">
            <AccentText as="p" color="#f5b95f" className="display text-2xl font-bold">
              {DSA_TOPICS.length}
            </AccentText>
            <p className="mt-1 text-sm text-muted">pattern chapters, in prerequisite order</p>
          </div>
          <div className="glass rounded-[1.5rem] p-5">
            <AccentText as="p" color="#43d6b5" className="display text-2xl font-bold">
              {total}
            </AccentText>
            <p className="mt-1 text-sm text-muted">question blogs, each a complete read</p>
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
              seriesSlug="dsa"
              total={total}
              firstSectionHref={`/blogs/dsa/${first.slug}`}
            />
          </div>
        )}

        {/* Chapters */}
        <section className="rise">
          <h2 className="micro mb-5">The chapters, in reading order</h2>
          <ol className="space-y-3">
            {DSA_TOPICS.map((topic) => {
              const counts = { Easy: 0, Medium: 0, Hard: 0 };
              for (const p of topic.problems) counts[p.difficulty]++;
              return (
                <li key={topic.slug}>
                  <Link
                    href={`/blogs/dsa/${topic.slug}`}
                    className="glass glass-hover group relative block overflow-hidden rounded-[1.5rem] p-5"
                  >
                    <div
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-25"
                      style={{ background: topic.color }}
                      aria-hidden
                    />
                    <div className="flex items-start gap-4">
                      <AccentText
                        color={topic.color}
                        className="display mt-0.5 shrink-0 text-2xl font-bold tabular-nums opacity-40"
                      >
                        {String(topic.chapter).padStart(2, "0")}
                      </AccentText>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-base font-bold leading-snug transition-colors group-hover:text-white"
                          style={{ color: "rgba(255,252,245,0.92)" }}
                        >
                          {topic.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-faint">{topic.tagline}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="text-faint">
                            {topic.problems.length} question{topic.problems.length === 1 ? "" : "s"}
                          </span>
                          {(["Easy", "Medium", "Hard"] as const).map((d) =>
                            counts[d] > 0 ? (
                              <AccentPill
                                key={d}
                                color={DSA_DIFFICULTY_COLORS[d]}
                                className="rounded-full px-2 py-0.5 font-semibold"
                              >
                                {counts[d]} {d.toLowerCase()}
                              </AccentPill>
                            ) : null
                          )}
                        </div>
                      </div>
                      <AccentText
                        ariaHidden
                        color={topic.color}
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

        <p className="mt-10 text-center text-xs leading-relaxed text-faint">
          Question list and ordering follow the{" "}
          <a
            href="https://neetcode.io/roadmap"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/20 underline-offset-2 hover:text-white"
          >
            NeetCode roadmap ↗
          </a>
          . All essays are Knovis originals — practice the problems there, read the story here.
        </p>
      </main>
    </>
  );
}
