import { PsChapter, PsSection } from "./types";
import { understandingThePredatorMind } from "./topics/01-understanding-the-predator-mind";
import { oscarPistorius } from "./topics/02-oscar-pistorius";
import { haroldShipman } from "./topics/03-harold-shipman";
import { melanieMcguire } from "./topics/04-melanie-mcguire";
import { michaelBruceRoss } from "./topics/05-michael-bruce-ross";
import { kennethBianchi } from "./topics/06-kenneth-bianchi";
import { arthurShawcross } from "./topics/07-arthur-shawcross";
import { johnDavidGuiseCannan } from "./topics/08-john-david-guise-cannan";
import { kennethAllenMcDuff } from "./topics/09-kenneth-allen-mcduff";
import { johnJrRobinson } from "./topics/10-john-jr-robinson";
import { couldYouHaveSpottedThese } from "./topics/11-could-you-have-spotted-these";

export const PS_SERIES_TITLE = "Talking with Psychopaths and Savages";
export const PS_COLOR = "#d94f5c";

export const PS_CHAPTERS: PsChapter[] = [
  understandingThePredatorMind,
  oscarPistorius,
  haroldShipman,
  melanieMcguire,
  michaelBruceRoss,
  kennethBianchi,
  arthurShawcross,
  johnDavidGuiseCannan,
  kennethAllenMcDuff,
  johnJrRobinson,
  couldYouHaveSpottedThese,
];

export function psSectionCount(): number {
  return PS_CHAPTERS.reduce((acc, c) => acc + c.sections.length, 0);
}

export function getPsChapter(slug: string): PsChapter | undefined {
  return PS_CHAPTERS.find((c) => c.slug === slug);
}

export function getPsSection(
  chapterSlug: string,
  sectionSlug: string
): PsSection | undefined {
  const chapter = getPsChapter(chapterSlug);
  return chapter?.sections.find((s) => s.slug === sectionSlug);
}

export type PsStop = { type: "chapter" | "section"; chapterSlug: string; sectionSlug?: string };

export function psNeighbors(current: string): { prev: PsStop | null; next: PsStop | null } {
  const linear: PsStop[] = [];
  for (const c of PS_CHAPTERS) {
    linear.push({ type: "chapter", chapterSlug: c.slug });
    for (const s of c.sections) {
      linear.push({ type: "section", chapterSlug: c.slug, sectionSlug: s.slug });
    }
  }

  const idx = linear.findIndex((stop) => {
    if (stop.type === "chapter") return stop.chapterSlug === current;
    return stop.sectionSlug === current;
  });

  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? linear[idx - 1] : null,
    next: idx < linear.length - 1 ? linear[idx + 1] : null,
  };
}

export function psStopHref(stop: PsStop): string {
  if (stop.type === "chapter") return `/blogs/psychopaths-and-savages/${stop.chapterSlug}`;
  return `/blogs/psychopaths-and-savages/${stop.chapterSlug}/${stop.sectionSlug}`;
}

export function psStopTitle(stop: PsStop): string {
  const c = getPsChapter(stop.chapterSlug)!;
  if (stop.type === "chapter") return c.title;
  return c.sections.find((s) => s.slug === stop.sectionSlug)!.title;
}
