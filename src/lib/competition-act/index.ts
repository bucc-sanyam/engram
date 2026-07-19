import type { CompActSection, CompActChapter } from "./types";
import { preliminary } from "./topics/preliminary";
import { antiCompetitiveAgreements } from "./topics/anti-competitive-agreements";
import { abuseOfDominance } from "./topics/abuse-of-dominance";
import { combinations } from "./topics/combinations";
import { competitionCommission } from "./topics/competition-commission";
import { inquiryPowers } from "./topics/inquiry-powers";
import { ordersAndRemedies } from "./topics/orders-and-remedies";
import { directorGeneral } from "./topics/director-general";
import { penalties } from "./topics/penalties";
import { advocacyMiscellaneous } from "./topics/advocacy-miscellaneous";

export * from "./types";

/**
 * The Competition Code, in reading order. Chapters are appended here as they
 * are written; every registered chapter is immediately live at /blogs/competition-act.
 */
export const COMP_ACT_CHAPTERS: CompActChapter[] = [
  preliminary,
  antiCompetitiveAgreements,
  abuseOfDominance,
  combinations,
  competitionCommission,
  inquiryPowers,
  ordersAndRemedies,
  directorGeneral,
  penalties,
  advocacyMiscellaneous,
];

export const COMP_ACT_SERIES_TITLE = "The Competition Code";

export function getCompActChapter(slug: string): CompActChapter | null {
  return COMP_ACT_CHAPTERS.find((c) => c.slug === slug) ?? null;
}

export function getCompActSection(
  chapterSlug: string,
  sectionSlug: string
): { chapter: CompActChapter; section: CompActSection } | null {
  const chapter = getCompActChapter(chapterSlug);
  const section = chapter?.sections.find((s) => s.slug === sectionSlug);
  return chapter && section ? { chapter, section } : null;
}

export function compActSectionCount(): number {
  return COMP_ACT_CHAPTERS.reduce((sum, c) => sum + c.sections.length, 0);
}

/** One stop on the linear read: a chapter opener or a section inside it. */
export type CompActStop =
  | { kind: "chapter"; chapter: CompActChapter }
  | { kind: "section"; chapter: CompActChapter; section: CompActSection };

/** The whole series flattened into its reading order. */
export function compActReadingOrder(): CompActStop[] {
  const stops: CompActStop[] = [];
  for (const chapter of COMP_ACT_CHAPTERS) {
    stops.push({ kind: "chapter", chapter });
    for (const section of chapter.sections) stops.push({ kind: "section", chapter, section });
  }
  return stops;
}

export function compActStopHref(stop: CompActStop): string {
  return stop.kind === "chapter"
    ? `/blogs/competition-act/${stop.chapter.slug}`
    : `/blogs/competition-act/${stop.chapter.slug}/${stop.section.slug}`;
}

export function compActStopTitle(stop: CompActStop): string {
  return stop.kind === "chapter"
    ? `Chapter ${stop.chapter.chapter}: ${stop.chapter.title}`
    : stop.section.title;
}

/**
 * Prev/next around a given stop, crossing chapter boundaries so the whole
 * series reads as one continuous path.
 */
export function compActNeighbors(
  chapterSlug: string,
  sectionSlug?: string
): { prev: CompActStop | null; next: CompActStop | null } {
  const order = compActReadingOrder();
  const idx = order.findIndex((s) =>
    sectionSlug
      ? s.kind === "section" && s.chapter.slug === chapterSlug && s.section.slug === sectionSlug
      : s.kind === "chapter" && s.chapter.slug === chapterSlug
  );
  if (idx === -1) return { prev: null, next: null };
  return { prev: order[idx - 1] ?? null, next: order[idx + 1] ?? null };
}

/** 1-based position of a section in the full reading order (sections only). */
export function compActSectionNumber(chapterSlug: string, sectionSlug: string): number {
  let n = 0;
  for (const chapter of COMP_ACT_CHAPTERS) {
    for (const section of chapter.sections) {
      n++;
      if (chapter.slug === chapterSlug && section.slug === sectionSlug) return n;
    }
  }
  return 0;
}
