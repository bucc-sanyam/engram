import type { Chapter } from "@/lib/cbse/types";
import { ch02Cell } from "./chapters/ch-02-cell";
import { ch03Tissues } from "./chapters/ch-03-tissues";
import { ch05Mixtures } from "./chapters/ch-05-mixtures";
import { ch11Reproduction } from "./chapters/ch-11-reproduction";
import { ch12Diversity } from "./chapters/ch-12-diversity";

/** Exploration (NCERT Science, Grade 9) — chapters we have authored, in book order. */
export const SCIENCE_CHAPTERS: Chapter[] = [ch02Cell, ch03Tissues, ch05Mixtures, ch11Reproduction, ch12Diversity];
