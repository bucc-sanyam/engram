import type { Chapter } from "@/lib/cbse/types";
import { ch01Coordinates } from "./chapters/ch-01-coordinates";
import { ch03Numbers } from "./chapters/ch-03-numbers";
import { ch06PerimeterArea } from "./chapters/ch-06-perimeter-area";

/** Ganita Manjari Part I (NCERT Mathematics, Grade 9) — authored chapters, in book order. */
export const MATHS_CHAPTERS: Chapter[] = [ch01Coordinates, ch03Numbers, ch06PerimeterArea];
