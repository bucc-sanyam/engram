import type { MacroSection, MacroChapter } from "./types";
import { whatIsEconomics } from "./topics/what-is-economics";
import { conceptualisingTheMacroeconomy } from "./topics/conceptualising-the-macroeconomy";
import { moneyAndInterestRates } from "./topics/money-and-interest-rates";
import { outputAndEmployment } from "./topics/output-and-employment";
import { economicGrowth } from "./topics/economic-growth";
import { macroeconomicPolicy } from "./topics/macroeconomic-policy";

export * from "./types";

export const MACROECONOMICS_CHAPTERS: MacroChapter[] = [
  whatIsEconomics,
  conceptualisingTheMacroeconomy,
  moneyAndInterestRates,
  outputAndEmployment,
  economicGrowth,
  macroeconomicPolicy,
];

export const MACRO_SERIES_TITLE = "Macroeconomics: An Introduction";

export function getMacroChapter(slug: string): MacroChapter | null {
  return MACROECONOMICS_CHAPTERS.find((c) => c.slug === slug) ?? null;
}

export function getMacroSection(
  chapterSlug: string,
  sectionSlug: string
): { chapter: MacroChapter; section: MacroSection } | null {
  const chapter = getMacroChapter(chapterSlug);
  const section = chapter?.sections.find((s) => s.slug === sectionSlug);
  return chapter && section ? { chapter, section } : null;
}

export function macroSectionCount(): number {
  return MACROECONOMICS_CHAPTERS.reduce((sum, c) => sum + c.sections.length, 0);
}

export type MacroStop =
  | { kind: "chapter"; chapter: MacroChapter }
  | { kind: "section"; chapter: MacroChapter; section: MacroSection };

export function macroReadingOrder(): MacroStop[] {
  const stops: MacroStop[] = [];
  for (const chapter of MACROECONOMICS_CHAPTERS) {
    stops.push({ kind: "chapter", chapter });
    for (const section of chapter.sections) stops.push({ kind: "section", chapter, section });
  }
  return stops;
}

export function macroStopHref(stop: MacroStop): string {
  return stop.kind === "chapter"
    ? `/blogs/macroeconomics/${stop.chapter.slug}`
    : `/blogs/macroeconomics/${stop.chapter.slug}/${stop.section.slug}`;
}

export function macroStopTitle(stop: MacroStop): string {
  return stop.kind === "chapter"
    ? `Chapter ${stop.chapter.chapter}: ${stop.chapter.title}`
    : stop.section.title;
}

export function macroNeighbors(
  chapterSlug: string,
  sectionSlug?: string
): { prev: MacroStop | null; next: MacroStop | null } {
  const order = macroReadingOrder();
  const idx = order.findIndex((s) =>
    sectionSlug
      ? s.kind === "section" && s.chapter.slug === chapterSlug && s.section.slug === sectionSlug
      : s.kind === "chapter" && s.chapter.slug === chapterSlug
  );
  if (idx === -1) return { prev: null, next: null };
  return { prev: order[idx - 1] ?? null, next: order[idx + 1] ?? null };
}

export function macroSectionNumber(chapterSlug: string, sectionSlug: string): number {
  let n = 0;
  for (const chapter of MACROECONOMICS_CHAPTERS) {
    for (const section of chapter.sections) {
      n++;
      if (chapter.slug === chapterSlug && section.slug === sectionSlug) return n;
    }
  }
  return 0;
}
