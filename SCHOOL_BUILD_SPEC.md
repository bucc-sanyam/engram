# Knovis for Schools — build specification (class 9, Exploration + Ganita Manjari)

> **This is an executable specification, not a discussion document.**
> It is written to be implemented literally by an agent that has NOT read the rest of this repo.
> Every fact in §2 was verified against the codebase on 2026-07-31. Do not second-guess it.
> Companions (context only, not required to build): `SCHOOL_GTM.md`, `SCHOOL_IMPLEMENTATION_BRIEF.md`, `SCHOOL_TECH_PLAN.md`.

---

## 1. RULES — read before every task, never violate

1. **Add, do not modify.** Everything new goes in new directories. Exactly **three** existing files may be touched, listed in §1.1. Touching any other existing file is a spec violation.
2. **No new npm dependencies. Ever.** Not for SVG, not for math, not for charts, not for drag handling, not for testing. `package.json` must be byte-identical when you finish. If a task seems to need a library, you have misread the task.
3. **No `three.js` in anything you build.** The target device is a ₹8,000 Android.
4. **This entire spec is zero-database and zero-AI.** No Supabase queries, no Gemini calls, no `fetch` to anything. If you write `createClient` or `@google/genai`, you have made a mistake.
5. **Never invent an API.** If you need a function from an existing file, its exact signature is in §2. If it is not in §2, do not call it.
6. **Every file you create must be listed in §3.** If your work requires a file not in §3, stop and report rather than inventing one.
7. **Content is original prose, with one narrow exception.** The NCERT PDFs at `/Users/bucc/Working Projects/Websites/Learning/.claude/Books/` are reference for scope, sequence and terminology. They are copyrighted ("All rights reserved"), and NCERT has published a formal advisory against third parties reproducing textbook content. Never copy or lightly paraphrase explanatory paragraphs. Never trace their figures. **The one exception:** short quoted definitions, statements of laws, and formulas — one or two sentences, in a blockquote, attributed — as specified in §8.3a rule 5. Everything else you write yourself.
8. **After every task, run the verification command for that task.** Do not proceed while it fails.
9. **British/Indian English** ("colour", "analyse", "metre"), matching existing content.
10. **Do not touch, read-to-modify, or "improve"**: `/blogs`, `/brain`, `/add`, `/recall`, `/notes`, `src/lib/dsa/`, `src/lib/sql/`, `src/lib/english-communication/`, `src/lib/data.ts`, `src/lib/gemini.ts`, `src/lib/srs.ts`, `src/app/api/**`. They are out of scope and working.

### 1.1 The only existing files you may modify

| File | Change | Nothing else |
|---|---|---|
| `src/proxy.ts` | Insert one block, exactly as given in Task 5.3 | Do not restructure the auth logic |
| `.gitignore` | Append two lines (Task 0.1) | — |
| `src/app/globals.css` | Append one fenced block at the very end (Task 3.4) | Do not edit any existing rule |

`src/app/layout.tsx` is **NOT** on this list — you do not need it (see §2.6).

---

## 2. Verified codebase facts — treat as ground truth

### 2.1 Stack
- Next.js **16.2.10** (App Router), React **19.2.4**, TypeScript 5, Tailwind **v4**.
- Path alias: `@/*` → `./src/*`. Always import as `@/lib/...`, `@/components/...`.
- Scripts available: `npm run dev`, `npm run build`. There is **no** `npm test` and **no** test runner installed.
- Typecheck command: `npx tsc --noEmit`.

### 2.2 Next 16 route conventions (used by every existing page)
`params` is a **Promise** and must be awaited:

```tsx
export default async function Page({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
}
```

`generateStaticParams` is a plain (non-async) function returning an array of param objects.

### 2.3 `src/lib/viz-theme.ts` — exact exports

```ts
export function darkenForPaper(hex: string): string
export function tintForPaper(hex: string, alpha: number): string
export function useAccentColor(hex: string): string        // client hook
export function useVizPalette(accentHex: string): VizPalette // client hook

export interface VizPalette {
  accent: string;      // readable accent for labels / active strokes
  accentFill: string;  // translucent accent tint for highlighted fills
  ink: string;         // normal text
  cellFill: string;    // non-highlighted fill
  gridStroke: string;  // faint borders
  edgeStroke: string;  // connecting edges
  muted: string;       // secondary label text
  panel: string;       // diagram backdrop
}
```

**Every SVG colour in every sim must come from `useVizPalette()`.** Never hard-code a colour, never write `fill="#fff"`, never add a `!important` CSS rule. This is how Paper Mode legibility is handled in this repo.

### 2.4 `src/components/AccentText.tsx` — exact exports

```tsx
export function AccentText(props: {
  color: string; className?: string; style?: React.CSSProperties;
  children: React.ReactNode; as?: "span" | "p" | "div" | "h2" | "h3"; ariaHidden?: boolean;
}): JSX.Element

export function DifficultyPill(props: { difficulty: string; color: string; className?: string }): JSX.Element

export function AccentPill(props: { color: string; href?: string; className?: string; children: React.ReactNode }): JSX.Element
```

### 2.5 `src/components/Markdown.tsx` — exact props

```tsx
export default function Markdown(props: {
  children: string;        // the markdown source
  className?: string;
  vizAccent?: string;      // accent passed to viz:* diagrams
  strictViz?: boolean;     // true => malformed viz payload THROWS (fails the build)
}): JSX.Element
```

Always call it as `<Markdown vizAccent={accent} strictViz>{body}</Markdown>` for chapter content.
It already supports: headings, lists, blockquote, fenced code, hr, bold/italic/code/links, inline `$…$` math, and ` ```viz:<kind> ` diagram fences.

### 2.6 Paper Mode — how it is mounted (IMPORTANT)

`ReadingThemeProvider` is **not** in the root layout. It is mounted per-section. `src/app/blogs/layout.tsx` is the working example:

```tsx
import React from "react";
import { ReadingThemeProvider } from "@/context/ReadingThemeContext";
import PaperModeToggle from "@/components/PaperModeToggle";

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReadingThemeProvider>
      <div className="relative min-h-screen">
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2 md:bottom-6 md:right-6">
          <PaperModeToggle />
        </div>
        {children}
      </div>
    </ReadingThemeProvider>
  );
}
```

You will create `src/app/learn/layout.tsx` as a near-copy (Task 3.1). **This is why you never touch the root layout.**

`useReadingTheme()` returns `{ isPaperMode, isSnapping, togglePaperMode }` and has a safe default, so components work even without the provider.

### 2.7 Existing CSS classes you may use (they exist in `globals.css`)

`.article-body` · `.article-lead` · `.glass` · `.glass-hover` · `.micro` · `.rise` · `.text-warm-gradient` · `.input` · `.paper-mode-active`

Tailwind colour utilities in use across the app: `text-faint`, `text-muted`, `text-white/85`, `bg-white/5`, `border-white/10`. Background is `#0b0a0e`.

### 2.8 `src/lib/types.ts` — the one type you need

```ts
export type QuestionKind = "open" | "quickfire" | "mcq" | "truefalse" | "multi";
```

Import it as `import type { QuestionKind } from "@/lib/types";`. **Do not add anything to `src/lib/types.ts`.**

### 2.9 The pattern you are mirroring

`src/lib/dsa/` is the proven static-content module in this repo: `types.ts` + `topics/*.ts` (one file per chapter) + `index.ts` (ordered registry + nav helpers), rendered by SSG routes with zero DB and zero AI. Your `src/lib/cbse/` mirrors it. You may read `src/lib/dsa/index.ts` for reference; **you may not modify it**.

### 2.10 `src/proxy.ts` — current shape

```ts
export async function proxy(request: NextRequest) { … }
export const config = { matcher: [ … ] };
```
It reads a `knovis_guest` cookie, has `const PUBLIC_PATHS = ["/login", "/auth"];`, and redirects unauthenticated users to `/login`. You will insert one block near the top (Task 5.3).

---

## 3. Complete file manifest

Every file this spec creates. Nothing else may be created.

```
src/lib/sim/
  types.ts                         T1.1  all SimSpec shapes
src/lib/cbse/
  types.ts                         T1.2  Chapter / Section / Question
  class9/
    index.ts                       T1.3  registry + nav helpers
    science/
      index.ts                     T1.3
      chapters/
        ch-02-cell.ts              T4.2
        ch-03-tissues.ts           T4.3
        ch-05-mixtures.ts          T4.4
    maths/
      index.ts                     T1.3
      chapters/
        ch-01-coordinates.ts       T4.5
        ch-03-numbers.ts           T4.6
        ch-06-perimeter-area.ts    T4.7
src/lib/schools/
  reserved.ts                      T0.2
  registry.ts                      T5.1
  rewrite.ts                       T5.2
src/components/sim/
  SimBlock.tsx                     T2.1  dispatcher
  SimFallback.tsx                  T2.1  altText fallback
  controls/
    SimSlider.tsx                  T2.1
    SimReadout.tsx                 T2.1
  AnatomySim.tsx                   T2.2  REFERENCE IMPLEMENTATION
  WorkedExampleSim.tsx             T2.3
  GraphPlotSim.tsx                 T2.4
  ParticleModelSim.tsx             T2.5
  GeometryBoardSim.tsx             T2.6
src/components/school/
  ChapterReader.tsx                T3.2  the 3-pane reader (client)
  SchoolBrandBar.tsx               T5.4
src/app/learn/
  layout.tsx                       T3.1
  class-9/
    page.tsx                       T3.3  grade hub
    [subject]/
      page.tsx                     T3.3  subject hub
      [chapter]/
        page.tsx                   T3.3  chapter reader route
scripts/
  validate-cbse.mts                T6.1  content + reserved-slug checks
```

---

## 4. Phase 0 — guardrails (do these first)

### Task 0.1 — feature flag and gitignore

**Create nothing.** Append to `.gitignore` (last two lines):

```
# NCERT reference PDFs — copyrighted, never commit
.claude/Books/
```

The feature flag is read at build time. Add to `.env.example` (append, do not reorder):

```
# School track (class 9 CBSE reader). Unset or "0" disables all /learn routes.
NEXT_PUBLIC_SCHOOL_TRACK=1
```

**Verify:** `git check-ignore -v .claude/Books` prints a match (may print nothing if the dir is outside the worktree — that is fine).

### Task 0.2 — reserved slugs

**Create `src/lib/schools/reserved.ts`** — complete file, copy exactly:

```ts
/**
 * Top-level path segments that must NEVER be treated as a school slug.
 *
 * A school-branded URL is `/<school-slug>/class-9/...`, rewritten by proxy.ts
 * onto the canonical `/learn/class-9/...` tree. Because the school slug sits at
 * the root of the path, any real top-level route would be shadowed if a school
 * ever registered that slug. Every directory in `src/app/` must appear here.
 *
 * `scripts/validate-cbse.mts` asserts that invariant — if you add a route,
 * add it here or the check fails.
 */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  // real app routes
  "about", "add", "api", "auth", "blogs", "brain", "learn",
  "login", "notes", "profile", "recall", "review",
  // framework / static
  "_next", "favicon.ico", "robots.txt", "sitemap.xml", "public",
  // reserved for future use — do not remove
  "admin", "s", "schools", "teach", "privacy", "terms", "pricing", "help",
]);

export function isReservedSlug(segment: string): boolean {
  return RESERVED_SLUGS.has(segment.toLowerCase());
}
```

**Verify:** `npx tsc --noEmit` passes.

---

## 5. Phase 1 — types and contracts

> These three files are the foundation. Everything downstream depends on their exact shape. Copy them verbatim.

### Task 1.1 — `src/lib/sim/types.ts`

Complete file, copy exactly:

```ts
/**
 * Interactive simulation specs for the class-9 reader.
 *
 * Unlike the `viz:*` markdown fences (JSON, validated at runtime by
 * src/components/viz/types.ts), these are typed TypeScript objects authored
 * directly on a chapter Section. That gives compile-time validation for free —
 * a malformed spec is a `tsc` error at author time, not a runtime surprise.
 *
 * CONSEQUENCE: specs may contain functions, so they can never be serialised to
 * JSON or sent from a Server Component to a Client Component. The chapter
 * reader is therefore a Client Component that imports chapter data directly.
 * See src/components/school/ChapterReader.tsx.
 */

/** Every spec must supply this. It is the screen-reader text, the
 *  prefers-reduced-motion fallback, and the print/export representation.
 *  Never leave it empty. */
type SimBase = {
  /** Shown above the diagram. Keep under 60 characters. */
  title: string;
  /** Plain-language description of what the diagram shows AND what changes
   *  when you interact with it. 2–3 sentences. REQUIRED. */
  altText: string;
};

/* ------------------------------------------------------------------ anatomy */
/** Click a labelled part; it lifts away from the body and explains itself.
 *  Use for: cell organelles, tissue types, any labelled structure. */
export type AnatomyPart = {
  /** Unique within the spec, kebab-case, e.g. "cell-wall" */
  id: string;
  /** Shown in the part list and as the selected heading. Max 28 chars. */
  label: string;
  /** SVG path `d` attribute, drawn inside the spec's viewBox. */
  path: string;
  /** Translation applied when this part is selected, in viewBox units.
   *  This is the "raises it" behaviour. Default [0, 0] (no lift). */
  liftBy?: [number, number];
  /** What this part does. 25–45 words. Plain prose, no markdown. */
  blurb: string;
};

export type AnatomySpec = SimBase & {
  kind: "anatomy";
  /** [width, height] of the SVG coordinate space. Use [400, 300] unless the
   *  drawing genuinely needs another ratio. */
  viewBox: [number, number];
  parts: AnatomyPart[];
  /** Part id selected on first render. Must exist in `parts`. */
  defaultPartId: string;
};

/* ----------------------------------------------------------- worked-example */
/** Editable inputs; every step recomputes live. Use for: any Maths derivation
 *  where changing the numbers should change the working. */
export type WorkedInput = {
  /** Referenced inside compute functions, e.g. "a" */
  id: string;
  /** Slider label, e.g. "First number (a)" */
  label: string;
  min: number;
  max: number;
  /** Slider granularity. Use 1 for integers. */
  step: number;
  default: number;
  /** Optional unit suffix shown after the value, e.g. "cm" */
  unit?: string;
};

export type WorkedStep = {
  /** Why this step happens. Markdown-free plain text; `$…$` math IS allowed. */
  explain: string;
  /** The arithmetic for the current inputs. MUST be pure: no Math.random,
   *  no Date, no external state. Return a display string. */
  compute: (v: Record<string, number>) => string;
};

export type WorkedExampleSpec = SimBase & {
  kind: "worked-example";
  inputs: WorkedInput[];
  steps: WorkedStep[];
  /** The final answer line, emphasised. Same purity rule as `compute`. */
  result: (v: Record<string, number>) => string;
};

/* ---------------------------------------------------------------- graph-plot */
/** Cartesian plot with draggable parameters. Use for: coordinates, linear
 *  relationships, distance–time graphs. */
export type PlotSeries = {
  id: string;
  label: string;
  /** y for a given x, under the current parameter values. Pure. */
  fn: (x: number, v: Record<string, number>) => number;
};

export type GraphPlotSpec = SimBase & {
  kind: "graph-plot";
  /** Same shape as worked-example inputs; drives the series. May be empty. */
  inputs: WorkedInput[];
  xRange: [number, number];
  yRange: [number, number];
  xLabel: string;
  yLabel: string;
  series: PlotSeries[];
  /** Fixed labelled points drawn on the plane, e.g. plotting coordinates. */
  points?: { x: number; y: number; label: string }[];
};

/* ------------------------------------------------------------ particle-model */
/** Animated particles whose spacing and motion respond to a control.
 *  Use for: states of matter, solutions vs suspensions vs colloids. */
export type ParticleState = {
  id: string;
  /** e.g. "Solution", "Colloid", "Suspension" */
  label: string;
  /** 0 = tightly packed and still, 1 = far apart and fast. */
  spread: number;
  /** 0 = motionless, 1 = rapid. */
  energy: number;
  /** Particle radius in viewBox units. Bigger = suspension-like. */
  particleSize: number;
  /** What a learner should notice in this state. 20–40 words. */
  blurb: string;
};

export type ParticleModelSpec = SimBase & {
  kind: "particle-model";
  /** 2–4 states the learner switches between. */
  states: ParticleState[];
  defaultStateId: string;
  /** Number of particles drawn. Keep 18–40 — more costs frame budget. */
  count: number;
};

/* ----------------------------------------------------------- geometry-board */
/** Draggable vertices with live measurements. Use for: perimeter, area,
 *  properties of triangles and quadrilaterals. */
export type GeometryVertex = {
  id: string;
  label: string;
  /** Starting position in viewBox units. */
  at: [number, number];
  /** false => fixed in place. Default true. */
  draggable?: boolean;
};

export type GeometryReadout = {
  label: string;
  /** Computed from current vertex positions. Pure. Return a display string. */
  compute: (pts: Record<string, { x: number; y: number }>) => string;
};

export type GeometryBoardSpec = SimBase & {
  kind: "geometry-board";
  viewBox: [number, number];
  vertices: GeometryVertex[];
  /** Vertex ids in draw order. The shape is always closed. */
  polygon: string[];
  /** Live measurements shown beneath the board. 1–4 of them. */
  readouts: GeometryReadout[];
  /** Snap dragging to this grid size in viewBox units. Use 20. */
  gridSize: number;
};

/* ------------------------------------------------------------------- union */
export type SimSpec =
  | AnatomySpec
  | WorkedExampleSpec
  | GraphPlotSpec
  | ParticleModelSpec
  | GeometryBoardSpec;

export type SimKind = SimSpec["kind"];
```

**Verify:** `npx tsc --noEmit` passes.

### Task 1.2 — `src/lib/cbse/types.ts`

Complete file, copy exactly:

```ts
import type { QuestionKind } from "@/lib/types";
import type { SimSpec } from "@/lib/sim/types";

/**
 * Class-9 CBSE content types (NCF-SE 2023 books: "Exploration" for Science,
 * "Ganita Manjari Part I" for Mathematics).
 *
 * Mirrors the proven src/lib/dsa/ pattern: hand-authored static TypeScript,
 * rendered by SSG routes. Zero database, zero AI, zero runtime cost.
 */

export type Subject = "science" | "maths";

export type CbseQuestion = {
  kind: QuestionKind;
  prompt: string;
  /** Required for mcq / truefalse / multi. For truefalse use ["True","False"]. */
  options?: string[];
  /** mcq + truefalse: index into `options`. */
  correct_index?: number;
  /** multi: every correct index. */
  correct_indices?: number[];
  /** The ideal answer. For choice kinds, one sentence saying WHY. */
  model_answer: string;
  difficulty: "basic" | "intermediate" | "advanced";
  /** Section key this question belongs to. Must match a Section.key. */
  section: string;
};

export type SectionNote = {
  kind: "fact" | "remember" | "watch-out" | "exam-tip";
  /** Optional heading. Omit to use the kind's default label. */
  title?: string;
  /** Plain text. 25–55 words. This is the RIGHT-BOTTOM pane. */
  body: string;
};

export type Section = {
  /** kebab-case, unique within the chapter, e.g. "what-a-cell-is" */
  key: string;
  title: string;
  /** Small accent label above the title. 1–3 words, e.g. "The idea". */
  eyebrow?: string;
  /** REQUIRED. The section of the NCERT book this recaps, exactly as printed,
   *  e.g. "Exploration §2.3" or "Ganita Manjari §1.2". Displayed in the UI so
   *  the book and the app are visibly the same journey. See §8.3a. */
  bookRef: string;
  /** LEFT PANE. Markdown, rendered with strictViz. 250–450 words.
   *  This is a RECAP of the book section, not a replacement for it. */
  body: string;
  /** RIGHT-TOP PANE. Omit only if the section genuinely needs no diagram. */
  sim?: SimSpec;
  /** RIGHT-BOTTOM PANE. */
  note?: SectionNote;
};

export type Chapter = {
  /** URL segment, e.g. "ch-02-cell". Must match the filename. */
  key: string;
  /** Chapter number as printed in the NCERT book. */
  number: number;
  title: string;
  subject: Subject;
  /** Book title for attribution in the UI. */
  book: "Exploration" | "Ganita Manjari";
  /** Accent hex for this chapter. Bright pastel — Paper Mode darkens it. */
  accent: string;
  /** One sentence. Used on cards and as the page description. */
  summary: string;
  /** Realistic reading time in minutes for the whole chapter. */
  estMinutes: number;
  sections: Section[];
  /** The SM-2 bank. 45–55 per chapter. See §7.4 for the required mix. */
  questions: CbseQuestion[];
};
```

**Verify:** `npx tsc --noEmit` passes.

### Task 1.3 — registries

**Create `src/lib/cbse/class9/science/index.ts`:**

```ts
import type { Chapter } from "@/lib/cbse/types";
import { ch02Cell } from "./chapters/ch-02-cell";
import { ch03Tissues } from "./chapters/ch-03-tissues";
import { ch05Mixtures } from "./chapters/ch-05-mixtures";

/** Exploration (NCERT Science, Grade 9) — chapters we have authored, in book order. */
export const SCIENCE_CHAPTERS: Chapter[] = [ch02Cell, ch03Tissues, ch05Mixtures];
```

**Create `src/lib/cbse/class9/maths/index.ts`:**

```ts
import type { Chapter } from "@/lib/cbse/types";
import { ch01Coordinates } from "./chapters/ch-01-coordinates";
import { ch03Numbers } from "./chapters/ch-03-numbers";
import { ch06PerimeterArea } from "./chapters/ch-06-perimeter-area";

/** Ganita Manjari Part I (NCERT Mathematics, Grade 9) — authored chapters, in book order. */
export const MATHS_CHAPTERS: Chapter[] = [ch01Coordinates, ch03Numbers, ch06PerimeterArea];
```

**Create `src/lib/cbse/class9/index.ts`** — complete file, copy exactly:

```ts
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
```

**Verify:** `npx tsc --noEmit` will FAIL here because the six chapter files don't exist yet. That is expected. Create stub chapter files now so the tree compiles — each exporting a `Chapter` with `sections: []` and `questions: []` and the correct `key`/`number`/`title`/`subject`/`book`/`accent`/`summary`/`estMinutes`. Real content lands in Phase 4.

Use these exact identifiers and accents:

| File | Export | key | number | title | accent |
|---|---|---|---|---|---|
| `science/chapters/ch-02-cell.ts` | `ch02Cell` | `ch-02-cell` | 2 | Cell: The Building Block of Life | `#43d6b5` |
| `science/chapters/ch-03-tissues.ts` | `ch03Tissues` | `ch-03-tissues` | 3 | Tissues in Action | `#5ad1c0` |
| `science/chapters/ch-05-mixtures.ts` | `ch05Mixtures` | `ch-05-mixtures` | 5 | Exploring Mixtures and their Separation | `#f5b95f` |
| `maths/chapters/ch-01-coordinates.ts` | `ch01Coordinates` | `ch-01-coordinates` | 1 | Orienting Yourself: The Use of Coordinates | `#9fb3ff` |
| `maths/chapters/ch-03-numbers.ts` | `ch03Numbers` | `ch-03-numbers` | 3 | The World of Numbers | `#b4a0ff` |
| `maths/chapters/ch-06-perimeter-area.ts` | `ch06PerimeterArea` | `ch-06-perimeter-area` | 6 | Measuring Space: Perimeter and Area | `#ff9f7a` |

**Verify:** `npx tsc --noEmit` passes.

---

## 6. Phase 2 — simulation primitives

> Build in this order. `AnatomySim` is the reference implementation: get it right, then follow its structure for the other four.

### Shared rules for every sim component

1. First line is `"use client";`.
2. Props are always exactly `{ spec: <ThatSpec>; accent: string }`.
3. Call `const p = useVizPalette(accent);` and take **every** colour from `p`.
4. Wrap the SVG in `<div className="overflow-x-auto">` and give the SVG
   `style={{ maxWidth: "100%", minWidth: Math.round(naturalWidth * 0.72), height: "auto" }}`.
   This is the repo's established "shrink to 72%, then scroll rather than squash" rule.
5. Respect reduced motion:
   ```ts
   const [reduce, setReduce] = useState(false);
   useEffect(() => {
     const m = window.matchMedia("(prefers-reduced-motion: reduce)");
     setReduce(m.matches);
     const on = () => setReduce(m.matches);
     m.addEventListener("change", on);
     return () => m.removeEventListener("change", on);
   }, []);
   ```
   When `reduce` is true: no animation loops, render the end state.
6. Interactive elements are real `<button>` / `<input type="range">` elements — never `<path onClick>`. Keyboard must work.
7. Render `spec.altText` in a visually hidden `<p className="sr-only">` inside every sim.
8. No `Math.random()` and no `Date.now()` anywhere that affects render output. Particle positions must be derived deterministically from the particle index (see T2.5).

### Task 2.1 — dispatcher, fallback, controls

**`src/components/sim/SimFallback.tsx`** — renders `altText` in a bordered card. Props `{ altText: string; title: string; accent: string }`.

**`src/components/sim/controls/SimSlider.tsx`** — a labelled `<input type="range">`. Props `{ label: string; min: number; max: number; step: number; value: number; unit?: string; accent: string; onChange: (n: number) => void }`. Show the current value beside the label.

**`src/components/sim/controls/SimReadout.tsx`** — a label/value chip. Props `{ label: string; value: string; accent: string }`.

**`src/components/sim/SimBlock.tsx`** — complete file, copy exactly:

```tsx
"use client";

import type { SimSpec } from "@/lib/sim/types";
import AnatomySim from "./AnatomySim";
import WorkedExampleSim from "./WorkedExampleSim";
import GraphPlotSim from "./GraphPlotSim";
import ParticleModelSim from "./ParticleModelSim";
import GeometryBoardSim from "./GeometryBoardSim";

/** Dispatches a typed SimSpec to its renderer. The union is exhaustive —
 *  adding a kind without a case here is a compile error. */
export default function SimBlock({ spec, accent }: { spec: SimSpec; accent: string }) {
  switch (spec.kind) {
    case "anatomy":
      return <AnatomySim spec={spec} accent={accent} />;
    case "worked-example":
      return <WorkedExampleSim spec={spec} accent={accent} />;
    case "graph-plot":
      return <GraphPlotSim spec={spec} accent={accent} />;
    case "particle-model":
      return <ParticleModelSim spec={spec} accent={accent} />;
    case "geometry-board":
      return <GeometryBoardSim spec={spec} accent={accent} />;
    default: {
      const _exhaustive: never = spec;
      return _exhaustive;
    }
  }
}
```

**Verify:** `npx tsc --noEmit` fails only on the five not-yet-created sims.

### Task 2.2 — `AnatomySim.tsx` (reference implementation)

Behaviour:
- Render `<svg viewBox={"0 0 " + w + " " + h}>` with one `<path>` per part.
- Unselected part: `fill={p.cellFill}`, `stroke={p.gridStroke}`, `strokeWidth={1.5}`.
- Selected part: `fill={p.accentFill}`, `stroke={p.accent}`, `strokeWidth={2.5}`, and translated by `liftBy` via `transform={`translate(${dx} ${dy})`}` with a CSS transition of `220ms ease` (skip the transition when `reduce`).
- **Every part is also a `<button>` in a list beneath the SVG** (this is the keyboard path). Selecting from either place updates the same state.
- Below the buttons, a panel shows the selected part's `label` (as a heading, coloured `p.accent`) and `blurb` (coloured `p.ink`).
- Initial state is `spec.defaultPartId`.
- Clicking the currently selected part keeps it selected (never deselect to empty).

Accessibility: the SVG gets `role="img"` and `aria-label={spec.altText}`. The part buttons get `aria-pressed`.

**Verify:** `npx tsc --noEmit` passes for this file.

### Task 2.3 — `WorkedExampleSim.tsx`

- State: `Record<string, number>` seeded from each input's `default`.
- One `SimSlider` per `spec.inputs`.
- Render `spec.steps` as an ordered list. Each row: `step.explain` on top (in `p.muted`), `step.compute(values)` beneath in a monospace-ish block (`font-[var(--font-jetmono)]`) coloured `p.ink`.
- `spec.result(values)` rendered last, larger, coloured `p.accent`, in a box filled `p.accentFill`.
- Recompute synchronously on every slider change. No animation, no `useEffect` for computation.
- Wrap each `compute` call in try/catch; on throw, render `—` for that row rather than crashing the page.

### Task 2.4 — `GraphPlotSim.tsx`

- Draw axes across `xRange`/`yRange` with tick marks every integer if the range is ≤ 12 wide, otherwise every 5 units.
- Map data coordinates to SVG coordinates with an explicit helper; **remember SVG y grows downward** — invert it.
- Each series: sample `fn` at ~120 evenly spaced x values, build a `<polyline points="…">`, stroke `p.accent`, `fill="none"`, `strokeWidth={2}`.
- `spec.points`: draw `<circle r={5} fill={p.accent}>` plus a text label offset by `(8, -8)`, coloured `p.ink`.
- Sliders for `spec.inputs` as in T2.3. If `inputs` is empty, render no controls.
- Axis labels from `xLabel`/`yLabel`, coloured `p.muted`.
- Guard against non-finite `fn` results: skip those sample points.

### Task 2.5 — `ParticleModelSim.tsx`

- Buttons to switch between `spec.states` (styled like the anatomy part buttons).
- Draw `spec.count` circles inside a bordered box.
- **Deterministic base positions.** Do not use `Math.random()`. Use a small hash of the index:
  ```ts
  const rnd = (i: number, salt: number) => {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x); // 0..1, stable across renders
  };
  ```
- `spread` controls how far particles sit from the centre; `particleSize` is the radius; `energy` controls animation amplitude and speed.
- Animate with a single `requestAnimationFrame` loop writing to a `<canvas>` (Canvas 2D, **not** SVG — 40 animated SVG nodes is over budget). Cancel the loop on unmount.
- When `reduce` is true: draw one static frame, no loop.
- Show the selected state's `blurb` beneath.

Canvas sizing: set `canvas.width = cssWidth * devicePixelRatio` and scale the context, so it is not blurry on phones.

### Task 2.6 — `GeometryBoardSim.tsx`

- Draw a faint grid at `spec.gridSize` intervals using `p.gridStroke`.
- Draw the polygon from `spec.polygon` (vertex ids in order, closed) — `fill={p.accentFill}`, `stroke={p.accent}`.
- Each vertex: a `<circle r={9}>` that is draggable via **pointer events** (`onPointerDown` / `onPointerMove` / `onPointerUp` with `setPointerCapture`). Snap to `gridSize`. Clamp inside the viewBox. Skip vertices with `draggable === false`.
- **Keyboard path (required):** each vertex is also focusable (`tabIndex={0}`) and arrow keys move it one grid step. Without this the sim is unusable by keyboard and fails the acceptance criteria.
- Beneath, render each `spec.readouts` entry through `SimReadout`, recomputed on every position change.
- Wrap `compute` in try/catch as in T2.3.

---

## 7. Phase 3 — the reader

### Task 3.1 — `src/app/learn/layout.tsx`

Near-copy of `src/app/blogs/layout.tsx` (§2.6). Same structure, same `PaperModeToggle` placement. This is what gives `/learn` Paper Mode without touching the root layout.

### Task 3.2 — `src/components/school/ChapterReader.tsx`

**This is the most important component. Read the whole task before writing code.**

```tsx
"use client";
```

**Props: `{ subject: Subject; chapterKey: string }` — two strings and nothing else.**

Why: `SimSpec` contains functions (§ Task 1.1). Functions cannot cross the Server→Client boundary in React Server Components. So the server route passes only strings, and this component looks the chapter up itself:

```ts
import { getChapter } from "@/lib/cbse/class9";
const chapter = getChapter(subject, chapterKey);
if (!chapter) return null;
```

**Violating this will produce a runtime serialisation error. Do not pass the chapter object as a prop.**

#### Layout

Desktop (`lg` and up): CSS grid, two columns.

```
grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-8
```

- **Left column**: all sections stacked, each in a `<section id={"sec-" + section.key}>` with `scroll-margin-top: 96px`. Renders `eyebrow` (via `AccentText` with `className="micro"`), `title` as an `<h2>`, **`bookRef` as a small muted line directly beneath the title** (`className="mt-1 text-xs text-muted"`, e.g. "Exploration §2.3" — this is what tells the student our section and their book section are the same thing), and `body` via `<Markdown vizAccent={chapter.accent} strictViz>{section.body}</Markdown>` inside a `<div className="article-body">`.
- **Right column**: `sticky top-24 self-start`, containing two stacked panels:
  - **top** — `<SimBlock spec={active.sim} accent={chapter.accent} />` when the active section has a sim; otherwise the panel collapses (render nothing, no empty box).
  - **bottom** — the note card for the active section (see below).

#### Scroll sync

Track which left section is in view with a single `IntersectionObserver`:

```ts
useEffect(() => {
  const els = chapter.sections
    .map((s) => document.getElementById("sec-" + s.key))
    .filter((el): el is HTMLElement => el !== null);
  if (els.length === 0) return;
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveKey(visible.target.id.replace(/^sec-/, ""));
    },
    { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.5, 0.9] }
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}, [chapter]);
```

Initial `activeKey` is `chapter.sections[0].key`.

Cross-fade the right rail on change: wrap its contents in a div keyed by `activeKey` with a 180 ms opacity transition. **Skip the transition when `prefers-reduced-motion: reduce`.**

Give the right rail a `min-h-[420px]` so swapping panels never shifts the page.

#### Mobile (below `lg`) — interleaved, not stacked

Below `lg` the sticky rail must not be used. Render, **per section, in this order**: theory → sim → note → next section's theory. Implement it by rendering the sim and note twice in the markup — once in the mobile flow (`lg:hidden`, inside each section) and once in the sticky rail (`hidden lg:block`). Do **not** stack all theory then all sims; that divorces every diagram from the paragraph it explains.

#### Note card

Map `note.kind` to a label and an emoji-free style:

| kind | default title |
|---|---|
| `fact` | Did you know |
| `remember` | Remember this |
| `watch-out` | Watch out |
| `exam-tip` | In the exam |

Card: `className="glass rounded-[1.5rem] p-5"`, title through `AccentText` with `className="micro"`, body in `text-white/85` (do not hard-code a paper-mode colour — the `.paper-mode-active` cascade handles it).

#### Header and footer

- Header: chapter number + book name as a `micro` eyebrow via `AccentText`, `<h1 className="text-warm-gradient …">{chapter.title}</h1>`, then `estMinutes` and section count.
- Footer: prev/next chapter links via `chapterNeighbors()`, styled like the DSA route's nav (`glass glass-hover rounded-[1.5rem] p-4`).

### Task 3.3 — the three routes

All are Server Components. All are static.

**`src/app/learn/class-9/[subject]/[chapter]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ChapterReader from "@/components/school/ChapterReader";
import { CLASS9_CHAPTERS, getChapter, getSubject } from "@/lib/cbse/class9";

export function generateStaticParams() {
  return (["science", "maths"] as const).flatMap((subject) =>
    CLASS9_CHAPTERS[subject].map((c) => ({ subject, chapter: c.key }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>;
}): Promise<Metadata> {
  const { subject, chapter } = await params;
  const c = getChapter(subject, chapter);
  if (!c) return { title: "Not found · Knovis" };
  return { title: `${c.title} · Class 9 ${c.book} · Knovis`, description: c.summary };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>;
}) {
  const { subject, chapter } = await params;
  const s = getSubject(subject);
  if (!s || !getChapter(subject, chapter)) notFound();
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <ChapterReader subject={s} chapterKey={chapter} />
      </main>
    </>
  );
}
```

**`src/app/learn/class-9/[subject]/page.tsx`** — subject hub. `generateStaticParams` returns `[{subject:"science"},{subject:"maths"}]`. Lists that subject's chapters as `glass glass-hover` cards: number, title, summary, `estMinutes`, question count. `notFound()` for an unknown subject.

**`src/app/learn/class-9/page.tsx`** — grade hub. Two cards, one per subject, from `SUBJECT_META`, linking to the subject hubs. Include a line stating the books are the NCF-SE 2023 editions (First Edition, April 2026).

**Feature flag:** in all three, at the top of the component:
```ts
if (process.env.NEXT_PUBLIC_SCHOOL_TRACK !== "1") notFound();
```

**Verify:** `npm run build` succeeds and the output lists the `/learn/class-9/...` routes as static.

### Task 3.4 — CSS

Append to the very **end** of `src/app/globals.css`, inside this exact fence so it can be deleted in one operation:

```css
/* === SCHOOL TRACK START — safe to delete as one block === */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
.school-rail { min-height: 420px; }
.school-section { scroll-margin-top: 96px; }
@media (prefers-reduced-motion: reduce) {
  .school-fade { transition: none !important; }
}
/* === SCHOOL TRACK END === */
```

Only add a `.sr-only` rule if one does not already exist in the file. Check first with `grep -n "sr-only" src/app/globals.css`.

---

## 8. Phase 4 — content authoring (the six chapters)

### 8.1 Source material

PDFs at `/Users/bucc/Working Projects/Websites/Learning/.claude/Books/`:

| Chapter | File |
|---|---|
| Science 2 — Cell | `iesc1dd/iesc102.pdf` |
| Science 3 — Tissues | `iesc1dd/iesc103.pdf` |
| Science 5 — Mixtures | `iesc1dd/iesc105.pdf` |
| Maths 1 — Coordinates | `iemh1dd/iemh101.pdf` |
| Maths 3 — Numbers | `iemh1dd/iemh103.pdf` |
| Maths 6 — Perimeter & Area | `iemh1dd/iemh106.pdf` |

Extract text with `pdftotext <file> -` (installed at `/opt/homebrew/bin/pdftotext`). Read it to learn **scope, sequence and terminology**. Then write original prose. **Copying sentences is a spec violation** (Rule 7).

### 8.2 Chapter file template

```ts
import type { Chapter } from "@/lib/cbse/types";

export const ch02Cell: Chapter = {
  key: "ch-02-cell",
  number: 2,
  title: "Cell: The Building Block of Life",
  subject: "science",
  book: "Exploration",
  accent: "#43d6b5",
  summary: "…one sentence…",
  estMinutes: 18,
  sections: [ /* 5–7 sections */ ],
  questions: [ /* 45–55 questions */ ],
};
```

### 8.3a Alignment rules — the app is a RECAP of the book, not a rival to it

The student has already met this chapter in class, from the NCERT book. This reader exists to **re-activate** that material before a recall session, not to teach it a second time. Everything below follows from that.

1. **Terminology lock — no synonyms, ever.** Use the book's exact defined terms and notation. If the book says *plasma membrane*, never write *cell membrane*. If it writes a formula one way, write it that way. **Nearly all "I have to learn it twice" friction comes from vocabulary drift, not from length.** When the book offers two names for a thing, use the one the book uses first, and mention the alternative once in a `note`.
2. **Structure lock.** Your sections follow the book's section order, one-to-one, with no reordering, merging or splitting of concepts across sections.
3. **`bookRef` is required on every section.** Exactly as printed in the book, e.g. `"Exploration §2.3"`. The reader displays it, so a student can always jump to the source.
4. **Recap framing.** Write as though the reader has already seen this once. No "In this chapter we will learn…". Open with the idea itself. Aim for the *90-second version*, not a parallel textbook.
5. **Short quoted definitions are allowed and encouraged.** Where precise wording genuinely matters — a formal definition, the statement of a law, a formula — quote the book directly, in a markdown blockquote, with the reference:

   ```
   > A cell is the basic structural and functional unit of life.
   > — *Exploration*, §2.1
   ```

   Keep each quotation to **one or two sentences**. Never string quotations together to reconstruct a paragraph, and never quote ordinary explanatory prose — only text where the exact wording carries meaning.
6. **Everything else is your own prose.** The NCERT books are copyrighted; NCERT has published a formal advisory against third parties reproducing textbook content. Copying or lightly paraphrasing explanatory paragraphs is a spec violation (Rule 7). Learn the scope, then write the recap yourself.

### 8.3 Section rules

- **5–7 sections per chapter.** Fewer than 5 makes the rail feel static; more than 7 makes the page too long. **This is a hard minimum, not a target.**
- `body`: **250–450 words** of markdown. Second person ("you"), concrete, no throat-clearing.
- **AT LEAST 3 SECTIONS PER CHAPTER MUST HAVE A `sim`.** This is the most-missed rule in this spec — read it twice. The right-hand rail is *sticky and swaps as the reader scrolls*; a chapter with one diagram leaves that rail empty for most of the page and the chapter looks unfinished. §8.4 names the **one mandatory primitive** per chapter — that is a floor for *which* primitive, **not** a licence to ship a single sim. Reuse a primitive with different content for the other two if that is the natural fit (e.g. three separate `worked-example` sims for three different derivations).
- The **first section must always have a `sim`** — it is what the reader sees on arrival.
- **At least 4 sections must have a `note`.** Also a hard minimum.
- You may additionally use ` ```viz:flow `, ` ```viz:tree `, ` ```viz:table-diff ` fences **inside** `body` for static diagrams. Payload shapes:
  - `flow`: `{"nodes":[{"id":"a","label":"…","row":0,"col":0}],"edges":[{"from":"a","to":"b","label":"…"}],"caption":"…"}`
  - `tree`: `{"nodes":[{"id":"a","label":"…","children":["b"]}],"rootId":"a","caption":"…"}`
  - `table-diff`: `{"columns":["…"],"before":[[…]],"after":[[…]],"caption":"…"}`
  Every `from`/`to`/`children` id must exist, and every `before`/`after` row length must equal `columns.length`, or the build fails.
- Inline math uses `$…$`, e.g. `$O(n)$`, `$a^2 + b^2$`. Keep it short — the renderer handles common commands only. **Never write a backslash command inside a template literal without escaping**: write `\\text{…}`, not `\text{…}` (`\t` becomes a tab and corrupts the output — this has bitten this repo before).

### 8.4 Which sim goes where (mandatory — this set is what proves the primitive library)

| Chapter | Must include at least |
|---|---|
| Science 2 — Cell | one `anatomy` (a plant cell: cell wall, membrane, nucleus, chloroplast, vacuole, cytoplasm, mitochondrion) |
| Science 3 — Tissues | one `anatomy` (tissue types) |
| Science 5 — Mixtures | one `particle-model` (solution / colloid / suspension) |
| Maths 1 — Coordinates | one `graph-plot` (with `points`, for plotting and quadrants) |
| Maths 3 — Numbers | one `worked-example` |
| Maths 6 — Perimeter & Area | one `geometry-board` |

For `anatomy` SVG paths: draw simple, clean shapes with ellipse/rounded-rect path data in a `[400, 300]` viewBox. Schematic and legible beats anatomically ornate. **Do not trace the textbook figure.**

### 8.5 Question bank rules

**45–55 questions per chapter**, distributed across sections (every section key must appear at least four times). Required mix per chapter:

| kind | count | notes |
|---|---|---|
| `mcq` | 20 | exactly 4 options, one `correct_index` |
| `truefalse` | 10 | `options: ["True","False"]`, `correct_index` 0 or 1 |
| `multi` | 8 | 4–5 options, `correct_indices` with 2–3 correct |
| `quickfire` | 6 | one-word or one-number answer |
| `open` | 6 | 2–4 sentence answer expected |

Difficulty spread roughly 40% `basic`, 45% `intermediate`, 15% `advanced`.

Every question needs a `model_answer`. For choice kinds it must say **why**, not just restate the option.

**Do not write trick questions, and never write a question whose answer is not derivable from the section body.** A teacher will check exactly this.

### 8.6 Order of work

Author **Science Chapter 2 first, completely** — sections, sims, notes and all 50 questions — then stop and run the full verification in §9. It is the vertical slice; if the format is wrong you want to discover it once, not six times. Only then proceed to the other five.

---

## 9. Phase 5 — school-branded URLs

> **No database.** For the pilot (<10 schools) the school list is a static registry. A DB-backed lookup is a later phase and is out of scope here.

### Task 5.1 — `src/lib/schools/registry.ts`

```ts
export type School = {
  /** URL slug. Lowercase, [a-z0-9-], 3–40 chars. Immutable once issued. */
  slug: string;
  /** Full legal name, shown in the brand bar. */
  name: string;
  /** Short name for tight spaces. */
  shortName: string;
  /** Bright accent hex. Paper Mode darkens it automatically. */
  accent: string;
  active: boolean;
};

/** Pilot schools. Adding a school = add a row here and redeploy.
 *  At <10 schools this beats a per-request DB lookup in the proxy. */
export const SCHOOLS: School[] = [
  { slug: "demo-school", name: "Knovis Demo School", shortName: "Demo School", accent: "#f5b95f", active: true },
];

export function getSchool(slug: string): School | null {
  const s = SCHOOLS.find((x) => x.slug === slug.toLowerCase());
  return s && s.active ? s : null;
}
```

### Task 5.2 — `src/lib/schools/rewrite.ts`

```ts
import { isReservedSlug } from "./reserved";
import { getSchool } from "./registry";

/**
 * Maps a school-branded path onto the canonical content tree.
 *   /demo-school/class-9/science/ch-02-cell  ->  /learn/class-9/science/ch-02-cell
 *   /demo-school                             ->  /learn/class-9
 * Returns null when the path is not a school path (so the caller does nothing).
 */
export function resolveSchoolRewrite(
  pathname: string
): { schoolSlug: string; target: string } | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const first = parts[0];
  if (isReservedSlug(first)) return null;
  const school = getSchool(first);
  if (!school) return null;
  const rest = parts.slice(1);
  const target = rest.length === 0 ? "/learn/class-9" : "/learn/" + rest.join("/");
  return { schoolSlug: school.slug, target };
}
```

### Task 5.3 — patch `src/proxy.ts`

Insert **exactly this block**, immediately after the `const path = request.nextUrl.pathname;` line that already exists. Change nothing else in the file.

```ts
  // --- SCHOOL TRACK START (delete this block to remove school-branded URLs) ---
  const schoolHit = resolveSchoolRewrite(path);
  if (schoolHit) {
    const url = request.nextUrl.clone();
    url.pathname = schoolHit.target;
    const rewritten = NextResponse.rewrite(url);
    rewritten.cookies.set("knovis_school", schoolHit.schoolSlug, { path: "/", sameSite: "lax" });
    return rewritten;
  }
  // --- SCHOOL TRACK END ---
```

And add this import at the top of the file, after the existing imports:

```ts
import { resolveSchoolRewrite } from "@/lib/schools/rewrite";
```

**Note:** the block sits after the auth check, so school pages inherit the existing auth/guest behaviour unchanged. Do not move it above the `getUser()` call.

### Task 5.4 — `src/components/school/SchoolBrandBar.tsx`

`"use client"`. Reads the `knovis_school` cookie via `document.cookie` inside a `useEffect` (never during render — it would break hydration). Looks the slug up in `SCHOOLS`. If found, renders a slim bar: `Knovis for {shortName}`, coloured with the school accent through `AccentText`. If not found, renders `null`.

Mount it in `src/app/learn/layout.tsx` (which you own), directly above `{children}`.

---

## 10. Phase 6 — validation script

### Task 6.1 — `scripts/validate-cbse.mts`

Run with `npx tsx scripts/validate-cbse.mts`. It must exit non-zero on any failure and print every problem found (not just the first). Checks:

1. **Reserved slugs cover every route.** Read the directory names in `src/app/`; every one must be in `RESERVED_SLUGS`. This is the guard that stops a future route being shadowed by a school slug.
2. Every `Chapter.key` is unique within its subject and matches its filename.
3. Every `Section.key` is unique within its chapter.
4. Every `CbseQuestion.section` matches a real `Section.key` in the same chapter.
5. Every section key is referenced by **at least four** questions.
6. Question counts per chapter are 45–55, and the kind mix matches §8.5 exactly.
7. `mcq` has exactly 4 options and a valid `correct_index`; `truefalse` has `["True","False"]`; `multi` has 4–5 options and 2–3 valid `correct_indices`.
8. Every `SimSpec.altText` is non-empty and at least 40 characters.
9. `AnatomySpec.defaultPartId` exists in `parts`; all part ids unique.
10. `ParticleModelSpec.defaultStateId` exists in `states`; `count` is 18–40.
11. `GeometryBoardSpec.polygon` references only real vertex ids and has ≥3 entries.
12. Every chapter has **5–7 sections**, **≥3 sections with a `sim`**, and **≥4 sections with a `note`**. Print the actual counts per chapter in the output, passing or failing, so the numbers are always visible.
13. The **first section of every chapter has a `sim`**.
14. Every section has a non-empty `bookRef` matching `/^(Exploration|Ganita Manjari) §\d+(\.\d+)*$/`.
15. No `body` contains the literal string `\t`, `\r`, `\b` or `\f` (the template-literal escape corruption).
16. No blockquote in any `body` runs longer than **2 sentences or 300 characters** (the §8.3a rule-5 quotation limit). Report the section key and the offending quote.

Note: `tsx` is not a dependency of this repo; run it via `npx tsx` (downloads on demand). **Do not add it to `package.json`.**

---

## 11. Acceptance criteria — the build is done when all of these pass

Run in order. Every one must pass.

```bash
npx tsc --noEmit
```
```bash
npx tsx scripts/validate-cbse.mts
```
```bash
npm run build
```

Then, manually, with `npm run dev`:

| # | Check |
|---|---|
| 1 | `/learn/class-9` lists both subjects |
| 2 | `/learn/class-9/science` lists 3 chapters |
| 3 | `/learn/class-9/science/ch-02-cell` renders three panes on a desktop width |
| 4 | Scrolling the left column swaps the right rail's sim and note |
| 5 | Clicking a plant-cell part lifts it and shows its blurb |
| 6 | Tabbing to the part buttons and pressing Enter does the same |
| 7 | At 375 px width the layout is one column, interleaved theory → sim → note per section |
| 8 | Paper Mode toggle works on `/learn/...` and every sim stays legible |
| 9 | `/demo-school/class-9/science/ch-02-cell` shows the same page plus the brand bar, URL unchanged in the address bar |
| 10 | Setting `NEXT_PUBLIC_SCHOOL_TRACK=0` makes `/learn/class-9` return 404 |
| 11 | No horizontal page scroll at 375 px on any chapter |
| 12 | `git diff --stat` shows exactly three modified files: `src/proxy.ts`, `src/app/globals.css`, `.gitignore` |

Criterion 12 is the isolation guarantee. If any other existing file is modified, revert that change.

---

## 12. Rollback

To remove the entire school track:

1. Delete `src/lib/cbse/`, `src/lib/sim/`, `src/lib/schools/`, `src/components/sim/`, `src/components/school/`, `src/app/learn/`, `scripts/validate-cbse.mts`.
2. In `src/proxy.ts`, delete the block between `// --- SCHOOL TRACK START` and `// --- SCHOOL TRACK END`, and the `resolveSchoolRewrite` import.
3. In `src/app/globals.css`, delete the block between `/* === SCHOOL TRACK START` and `/* === SCHOOL TRACK END === */`.
4. Revert the `.gitignore` and `.env.example` additions.

Nothing else in the app references any of it. Alternatively, set `NEXT_PUBLIC_SCHOOL_TRACK=0` to disable without deleting anything.

---

## 13. Things that will go wrong — read before you start

1. **Passing the chapter object into `ChapterReader` as a prop.** It contains functions. React will throw a serialisation error. Pass `subject` and `chapterKey` strings only (Task 3.2).
2. **Forgetting `await params`.** Next 16 made it a Promise. Every route in this repo awaits it.
3. **Hard-coding colours in a sim.** Paper Mode will break. Every colour comes from `useVizPalette()`.
4. **Using `Math.random()` in the particle sim.** Server and client renders will differ and hydration will fail. Use the deterministic hash in T2.5.
5. **Writing `\text{...}` inside a TypeScript template literal.** `\t` becomes a tab. Escape it: `\\text{...}`.
6. **Adding a dependency.** Rule 2. There is no exception.
7. **Making the sticky rail sticky on mobile.** It must be `hidden lg:block`, with the mobile copy interleaved per section.
8. **Reading the textbook and paraphrasing it sentence by sentence.** Rule 7. Learn the scope, then write it yourself.
9. **`viz:` fence payload errors.** With `strictViz` these throw and fail the build, by design. Check ids and row widths.
10. **Adding a route under `src/app/` without adding it to `RESERVED_SLUGS`.** The validator will catch it; do not disable the check.
