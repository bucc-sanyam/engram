import { EcChapter, EcSection } from "./types";
import { foundations } from "./topics/01-foundations";
import { structuringYourMessage } from "./topics/02-structuring-your-message";
import { delivery } from "./topics/03-delivery";
import { everydayScenarios } from "./topics/04-everyday-scenarios";
import { meetingsAndPresentations } from "./topics/05-meetings-and-presentations";
import { writtenCommunication } from "./topics/06-written-communication";
import { highStakesConversations } from "./topics/07-high-stakes-conversations";
import { remoteAndCrossCultural } from "./topics/08-remote-and-cross-cultural";

export const EC_SERIES_TITLE = "The Communication Lab";
export const EC_SERIES_SLUG = "english-communication";
export const EC_COLOR = "#3fb4c4";

export const EC_CHAPTERS: EcChapter[] = [
  foundations,
  structuringYourMessage,
  delivery,
  everydayScenarios,
  meetingsAndPresentations,
  writtenCommunication,
  highStakesConversations,
  remoteAndCrossCultural,
];

export function ecSectionCount(): number {
  return EC_CHAPTERS.reduce((acc, c) => acc + c.sections.length, 0);
}

export function getEcChapter(slug: string): EcChapter | undefined {
  return EC_CHAPTERS.find((c) => c.slug === slug);
}

export function getEcSection(
  chapterSlug: string,
  sectionSlug: string
): EcSection | undefined {
  const chapter = getEcChapter(chapterSlug);
  return chapter?.sections.find((s) => s.slug === sectionSlug);
}

export type EcStop = { type: "chapter" | "section"; chapterSlug: string; sectionSlug?: string };

export function ecNeighbors(current: string): { prev: EcStop | null; next: EcStop | null } {
  const linear: EcStop[] = [];
  for (const c of EC_CHAPTERS) {
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

export function ecStopHref(stop: EcStop): string {
  if (stop.type === "chapter") return `/blogs/${EC_SERIES_SLUG}/${stop.chapterSlug}`;
  return `/blogs/${EC_SERIES_SLUG}/${stop.chapterSlug}/${stop.sectionSlug}`;
}

export function ecStopTitle(stop: EcStop): string {
  const c = getEcChapter(stop.chapterSlug)!;
  if (stop.type === "chapter") return c.title;
  return c.sections.find((s) => s.slug === stop.sectionSlug)!.title;
}
