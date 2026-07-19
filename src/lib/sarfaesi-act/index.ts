import type { SarfaesiSection, SarfaesiChapter } from "./types";
import { preliminary } from "./topics/preliminary";
import { regulation } from "./topics/regulation";
import { enforcement } from "./topics/enforcement";
import { centralRegistry } from "./topics/central-registry";
import { offences } from "./topics/offences";
import { miscellaneous } from "./topics/miscellaneous";

export * from "./types";

export const SARFAESI_CHAPTERS: SarfaesiChapter[] = [
  preliminary,
  regulation,
  enforcement,
  centralRegistry,
  offences,
  miscellaneous,
];

export const SARFAESI_SERIES_TITLE = "The SARFAESI Playbook";

export function getSarfaesiChapter(slug: string): SarfaesiChapter | null {
  return SARFAESI_CHAPTERS.find((c) => c.slug === slug) ?? null;
}

export function getSarfaesiSection(
  chapterSlug: string,
  sectionSlug: string
): { chapter: SarfaesiChapter; section: SarfaesiSection } | null {
  const chapter = getSarfaesiChapter(chapterSlug);
  const section = chapter?.sections.find((s) => s.slug === sectionSlug);
  return chapter && section ? { chapter, section } : null;
}

export function sarfaesiSectionCount(): number {
  return SARFAESI_CHAPTERS.reduce((sum, c) => sum + c.sections.length, 0);
}

export type SarfaesiStop =
  | { kind: "chapter"; chapter: SarfaesiChapter }
  | { kind: "section"; chapter: SarfaesiChapter; section: SarfaesiSection };

export function sarfaesiReadingOrder(): SarfaesiStop[] {
  const stops: SarfaesiStop[] = [];
  for (const chapter of SARFAESI_CHAPTERS) {
    stops.push({ kind: "chapter", chapter });
    for (const section of chapter.sections) stops.push({ kind: "section", chapter, section });
  }
  return stops;
}

export function sarfaesiStopHref(stop: SarfaesiStop): string {
  return stop.kind === "chapter"
    ? `/blogs/sarfaesi-act/${stop.chapter.slug}`
    : `/blogs/sarfaesi-act/${stop.chapter.slug}/${stop.section.slug}`;
}

export function sarfaesiStopTitle(stop: SarfaesiStop): string {
  return stop.kind === "chapter"
    ? `Chapter ${stop.chapter.chapter}: ${stop.chapter.title}`
    : stop.section.title;
}

export function sarfaesiNeighbors(
  chapterSlug: string,
  sectionSlug?: string
): { prev: SarfaesiStop | null; next: SarfaesiStop | null } {
  const order = sarfaesiReadingOrder();
  const idx = order.findIndex((s) =>
    sectionSlug
      ? s.kind === "section" && s.chapter.slug === chapterSlug && s.section.slug === sectionSlug
      : s.kind === "chapter" && s.chapter.slug === chapterSlug
  );
  if (idx === -1) return { prev: null, next: null };
  return { prev: order[idx - 1] ?? null, next: order[idx + 1] ?? null };
}

export function sarfaesiSectionNumber(chapterSlug: string, sectionSlug: string): number {
  let n = 0;
  for (const chapter of SARFAESI_CHAPTERS) {
    for (const section of chapter.sections) {
      n++;
      if (chapter.slug === chapterSlug && section.slug === sectionSlug) return n;
    }
  }
  return 0;
}
