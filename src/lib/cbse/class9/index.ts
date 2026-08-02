import type { Chapter, Subject } from "@/lib/cbse/types";
import { SCIENCE_CHAPTERS } from "./science";
import { MATHS_CHAPTERS } from "./maths";

export const SUBJECT_META: Record<Subject, {
  slug: Subject; label: string; book: string; accent: string; blurb: string;
}> = {
  science: {
    slug: "science",
    label: "Science",
    book: "Exploration",
    accent: "#43d6b5",
    blurb: "Thirteen chapters that treat science as something you do, not something you memorise.",
  },
  maths: {
    slug: "maths",
    label: "Mathematics",
    book: "Ganita Manjari",
    accent: "#9fb3ff",
    blurb: "Part I of the new NCF-SE course — coordinates, numbers, algebra and space.",
  },
};

export const CLASS9_CHAPTERS: Record<Subject, Chapter[]> = {
  science: SCIENCE_CHAPTERS,
  maths: MATHS_CHAPTERS,
};

export function allChapters(): Chapter[] {
  return [...SCIENCE_CHAPTERS, ...MATHS_CHAPTERS];
}

export function getSubject(slug: string): Subject | null {
  return slug === "science" || slug === "maths" ? slug : null;
}

export function getChapter(subject: string, key: string): Chapter | null {
  const s = getSubject(subject);
  if (!s) return null;
  return CLASS9_CHAPTERS[s].find((c) => c.key === key) ?? null;
}

/** Prev/next within a subject, in book order. */
export function chapterNeighbors(
  subject: Subject,
  key: string
): { prev: Chapter | null; next: Chapter | null } {
  const list = CLASS9_CHAPTERS[subject];
  const i = list.findIndex((c) => c.key === key);
  if (i === -1) return { prev: null, next: null };
  return { prev: list[i - 1] ?? null, next: list[i + 1] ?? null };
}

export function chapterHref(subject: Subject, key: string): string {
  return `/learn/class-9/${subject}/${key}`;
}

/** Total authored question count — used on hub pages. */
export function questionCount(): number {
  return allChapters().reduce((n, c) => n + c.questions.length, 0);
}
