import { COMP_ACT_CHAPTERS } from "./competition-act";
import type { CompActQuestion } from "./competition-act/types";
import { DSA_TOPICS } from "./dsa";
import { SQL_TOPICS } from "./sql";
import { SARFAESI_CHAPTERS } from "./sarfaesi-act";
import type { SarfaesiQuestion } from "./sarfaesi-act/types";

export interface SeedSection {
  chapterSlug: string;
  sectionSlug: string;
  /** Topic name — must be unique per user (topics.unique(user_id,name)). */
  name: string;
  category: string;
  summary: string;
  keyPoints: string[];
  questions: CompActQuestion[] | SarfaesiQuestion[];
  facts: string[];
}

export interface SeriesSeed {
  seriesSlug: string;
  title: string;
  /** Sections in reading order (drives the brain spine + linear links). */
  sections: SeedSection[];
}

function compActSeed(): SeriesSeed {
  const sections: SeedSection[] = [];
  for (const chapter of COMP_ACT_CHAPTERS) {
    for (const section of chapter.sections) {
      sections.push({
        chapterSlug: chapter.slug,
        sectionSlug: section.slug,
        name: section.title,
        category: "Legal",
        summary: section.summary,
        keyPoints: [],
        questions: section.questions ?? [],
        facts: section.facts ?? [],
      });
    }
  }
  return { seriesSlug: "competition-act", title: "The Competition Code", sections };
}

function dsaSeed(): SeriesSeed {
  const sections: SeedSection[] = [];
  for (const topic of DSA_TOPICS) {
    for (const problem of topic.problems) {
      sections.push({
        chapterSlug: topic.slug,
        sectionSlug: problem.slug,
        name: problem.title,
        category: "Computer Science",
        summary: problem.summary,
        keyPoints: [],
        questions: [],
        facts: [],
      });
    }
  }
  return { seriesSlug: "dsa", title: "The Pattern Atlas", sections };
}

function sqlSeed(): SeriesSeed {
  const sections: SeedSection[] = [];
  for (const topic of SQL_TOPICS) {
    for (const problem of topic.problems) {
      sections.push({
        chapterSlug: topic.slug,
        sectionSlug: problem.slug,
        name: problem.title,
        category: "Data",
        summary: problem.summary,
        keyPoints: [],
        questions: [],
        facts: [],
      });
    }
  }
  return { seriesSlug: "sql", title: "The Query Playbook", sections };
}

function sarfaesiSeed(): SeriesSeed {
  const sections: SeedSection[] = [];
  for (const chapter of SARFAESI_CHAPTERS) {
    for (const section of chapter.sections) {
      sections.push({
        chapterSlug: chapter.slug,
        sectionSlug: section.slug,
        name: section.title,
        category: "Legal",
        summary: section.summary,
        keyPoints: [],
        questions: section.questions ?? [],
        facts: section.facts ?? [],
      });
    }
  }
  return { seriesSlug: "sarfaesi-act", title: "The SARFAESI Playbook", sections };
}

const SERIES: Record<string, () => SeriesSeed> = {
  "competition-act": compActSeed,
  "dsa": dsaSeed,
  "sql": sqlSeed,
  "sarfaesi-act": sarfaesiSeed,
};

export function getSeed(seriesSlug: string): SeriesSeed {
  const build = SERIES[seriesSlug];
  if (!build) throw new Error(`Unknown story series: ${seriesSlug}`);
  return build();
}
