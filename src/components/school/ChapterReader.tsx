"use client";

import { useState, useEffect } from "react";
import type { Subject, SectionNote } from "@/lib/cbse/types";
import { getChapter, chapterNeighbors, chapterHref } from "@/lib/cbse/class9";
import { AccentText } from "@/components/AccentText";
import Markdown from "@/components/Markdown";
import SimBlock from "@/components/sim/SimBlock";
import SimFallback from "@/components/sim/SimFallback";
import Link from "next/link";

/** Props: two strings — never the chapter object (it contains functions). */
export default function ChapterReader({
  subject,
  chapterKey,
}: {
  subject: Subject;
  chapterKey: string;
}) {
  const chapter = getChapter(subject, chapterKey);

  const [activeKey, setActiveKey] = useState(chapter?.sections[0]?.key ?? "");

  /* Scroll-sync: track which left section is in view */
  useEffect(() => {
    if (!chapter) return;
    const els = chapter.sections
      .map((s) => document.getElementById("sec-" + s.key))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const intersecting = new Set<string>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = e.target.id.replace(/^sec-/, "");
          if (e.isIntersecting) {
            intersecting.add(id);
          } else {
            intersecting.delete(id);
          }
        });

        if (intersecting.size > 0) {
          const firstVisible = chapter.sections.find((s) => intersecting.has(s.key));
          if (firstVisible) {
            setActiveKey(firstVisible.key);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapter]);

  if (!chapter) return null;

  const active = chapter.sections.find((s) => s.key === activeKey) ?? chapter.sections[0];
  const { prev, next } = chapterNeighbors(subject, chapter.key);

  return (
    <article>
      {/* Header */}
      <header className="mb-10">
        <AccentText color={chapter.accent} className="micro">
          Chapter {chapter.number} · {chapter.book}
        </AccentText>
        <h1 className="text-warm-gradient mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {chapter.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {chapter.estMinutes} min read · {chapter.sections.length} sections
        </p>
      </header>

      {/* Main grid. Text on the left, every diagram on the right — so the
          reading column keeps one measure the whole way down and the plates
          get the width they need.
          The split is 42/58 and waits for `xl`, both for the same reason: a
          plate refuses to render below 0.72 of its own viewBox and scrolls
          sideways instead, and the widest here is 800 units — 576px, plus the
          card's padding. Under 1280 there is no honest way to fit that beside a
          readable measure, so the page stacks the way it does on a phone. */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,41fr)_minmax(0,59fr)]">
        {/* LEFT COLUMN — sections stacked */}
        <div className="flex flex-col gap-12">
          {chapter.sections.map((section) => (
            <section
              key={section.key}
              id={"sec-" + section.key}
              className="school-section"
            >
              {section.eyebrow && (
                <AccentText color={chapter.accent} className="micro">
                  {section.eyebrow}
                </AccentText>
              )}
              <h2 className="mt-1 text-xl font-semibold text-white/85">
                {section.title}
              </h2>
              <p className="mt-1 text-xs text-muted">{section.bookRef}</p>
              <div className="article-body mt-4">
                <Markdown vizAccent={chapter.accent} strictViz>
                  {section.body}
                </Markdown>
              </div>

              {/* Single-column only — there the diagrams belong with the text
                  they illustrate. Wide enough for two columns, they all move
                  into the rail. */}
              <div className="mt-6 xl:hidden">
                {section.sim && (
                  <div className="mb-4">
                    <div className="motion-reduce:hidden">
                      <SimBlock spec={section.sim} accent={chapter.accent} />
                    </div>
                    <div className="hidden motion-reduce:block">
                      <SimFallback altText={section.sim.altText} title={section.sim.title} accent={chapter.accent} />
                    </div>
                  </div>
                )}
                {section.figures?.map((figure, i) => (
                  <div key={i} className="school-figure glass mb-4 rounded-[1.5rem] p-5">
                    <div className="motion-reduce:hidden">
                      <SimBlock spec={figure} accent={chapter.accent} />
                    </div>
                    <div className="hidden motion-reduce:block">
                      <SimFallback
                        altText={figure.altText}
                        title={figure.title}
                        accent={chapter.accent}
                      />
                    </div>
                  </div>
                ))}
                {section.note && (
                  <NoteCard note={section.note} accent={chapter.accent} />
                )}
              </div>
            </section>
          ))}
        </div>

        {/* RIGHT COLUMN — every diagram for the section being read (desktop
            only). A section can carry several plates on top of its sim, so the
            rail scrolls inside itself rather than growing past the viewport
            and taking its own stickiness away. */}
        <div className="school-rail sticky top-24 hidden max-h-[calc(100vh-7rem)] self-start overflow-y-auto xl:block">
          <div
            key={activeKey}
            className="school-fade flex flex-col gap-4"
          >
            {active?.sim && (
              <>
                <div className="motion-reduce:hidden">
                  <SimBlock spec={active.sim} accent={chapter.accent} />
                </div>
                <div className="hidden motion-reduce:block">
                  <SimFallback altText={active.sim.altText} title={active.sim.title} accent={chapter.accent} />
                </div>
              </>
            )}
            {active?.figures?.map((figure, i) => (
              // p-4, not p-5: the rail's own scrollbar plus this padding is
              // what an 800-unit plate has to fit inside.
              <div key={i} className="school-figure glass rounded-[1.5rem] p-4">
                <div className="motion-reduce:hidden">
                  <SimBlock spec={figure} accent={chapter.accent} />
                </div>
                <div className="hidden motion-reduce:block">
                  <SimFallback
                    altText={figure.altText}
                    title={figure.title}
                    accent={chapter.accent}
                  />
                </div>
              </div>
            ))}
            {active?.note && (
              <NoteCard note={active.note} accent={chapter.accent} />
            )}
          </div>
        </div>
      </div>

      {/* Footer — prev/next navigation */}
      <footer className="mt-16 flex flex-col gap-4 sm:flex-row sm:justify-between">
        {prev ? (
          <Link
            href={chapterHref(subject, prev.key)}
            className="glass glass-hover rounded-[1.5rem] p-4"
          >
            <span className="text-xs text-muted">← Previous</span>
            <span className="mt-1 block text-sm font-medium text-white/85">
              Ch {prev.number}: {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={chapterHref(subject, next.key)}
            className="glass glass-hover rounded-[1.5rem] p-4 text-right"
          >
            <span className="text-xs text-muted">Next →</span>
            <span className="mt-1 block text-sm font-medium text-white/85">
              Ch {next.number}: {next.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </footer>
    </article>
  );
}

/* ── Note card sub-component ────────────────────────────────────── */

const NOTE_LABELS: Record<string, string> = {
  fact: "Did you know",
  remember: "Remember this",
  "watch-out": "Watch out",
  "exam-tip": "In the exam",
};

function NoteCard({ note, accent }: { note: SectionNote; accent: string }) {
  const heading = note.title ?? NOTE_LABELS[note.kind] ?? note.kind;
  return (
    <div className="glass rounded-[1.5rem] p-5">
      <AccentText color={accent} className="micro">
        {heading}
      </AccentText>
      <p className="mt-2 text-sm leading-relaxed text-white/85">{note.body}</p>
    </div>
  );
}
