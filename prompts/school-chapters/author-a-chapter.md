# Prompt — author a complete class-9 chapter page

Paste everything below the line into the model. Change only the **TARGET** block
at the very end to name the chapter you want.

Companion files:

- **`prompts/school-chapters/convert-the-books.md`** — the umbrella plan for
  converting **all 21 chapters** of both books: the inventory, the running
  order, accent assignments, how to map a printed chapter onto 5–7 app
  sections, and which diagram register each subject needs. Start there when
  authoring a chapter that does not exist yet.
- **`prompts/school-chapters/targets-existing-chapters.md`** — ready-to-run
  TARGET blocks for the five chapters that already exist, aimed at bringing
  their artwork up to the Chapter 2 bar. Drop one in place of the TARGET block
  at the end of this prompt.
- **`prompts/school-figures/draw-cell-plate.md`** — goes deeper on drawing a
  single plate. Use it when one figure needs a second pass.

**Worth pasting in as worked examples if the model drifts** (each is a complete,
shipped chapter or plate file):

| For | Paste |
| --- | --- |
| A science chapter | `src/lib/cbse/class9/science/chapters/ch-02-cell.ts` |
| A maths chapter | `src/lib/cbse/class9/maths/chapters/ch-01-coordinates.ts` |
| Organic / biological plates | `src/lib/cbse/class9/science/figures/ch-02-organelle-plates.ts` |
| Apparatus / manufactured plates | `src/lib/cbse/class9/science/figures/ch-05.ts` |
| Maths construction plates | `src/lib/cbse/class9/maths/figures/ch-01.ts` |

---

You are authoring one chapter of a class-9 CBSE revision app. The chapter is a
single hand-written TypeScript file plus a file of drawn SVG figures. There is no
database, no CMS, no AI at runtime, and no image assets — the diagrams **are**
path data in the source, rendered as inline SVG.

Everything you write is static data. The page that renders it already exists and
is generic; you are not writing any React.

## Absolute constraints

1. **Original artwork only.** Draw from the subject matter — the biology, the
   apparatus, the geometry — never from an existing illustration. Do not trace,
   adapt, or "adjust" a published figure, and do not work from a reference image
   even if one is supplied. A lightly-altered copy of someone's drawing is a
   derivative work. Free to use: the anatomy and apparatus themselves, the
   standard part names, and the convention of a labelled cut-away. Those are
   facts and conventions. Composition, proportions, palette and geometry must be
   yours.
2. **No new dependencies.** No charting library, no SVG library, no WebGL, no
   `three`. Path helpers already in the repo, or plain arithmetic.
3. **Deterministic.** No `Math.random`, no `Date.now`. Same source, same pixels.
4. **No `any`.** The file must pass `tsc --noEmit` with the repo's strict config.
5. **Recaps the printed book, does not replace it.** Every section cites the book
   section it recaps.

## What you deliver

For a chapter `ch-07-motion` in science:

```
src/lib/cbse/class9/science/chapters/ch-07-motion.ts   ← the chapter
src/lib/cbse/class9/science/figures/ch-07.ts           ← its plates
```

plus **two registry lines**, or the chapter will not exist at any URL:

```ts
// src/lib/cbse/class9/science/index.ts
import { ch07Motion } from "./chapters/ch-07-motion";
export const SCIENCE_CHAPTERS: Chapter[] = [ch02Cell, ch03Tissues, ch05Mixtures, ch07Motion];
//                                          ^ keep in printed book order
```

(For maths: `class9/maths/…` and `MATHS_CHAPTERS`.) The route
`/learn/class-9/<subject>/<chapter-key>` is statically generated from that array.
`key` must equal the filename.

## The page your data lands in

Know this before you decide what goes where.

- **Left column — prose only.** The section's `body`, at a ~71-character measure.
- **Right column — a sticky rail** carrying the *active* section's `sim`, then
  every entry in its `figures[]`, then its `note`. It swaps as the reader scrolls
  and scrolls inside itself.
- Below 1400px the page collapses to one column and everything renders inline
  under its own section, in the same order.

So: `sim` is the hero diagram of the section, `figures[]` are its plates, and
both live in the same rail. Put a diagram in `figures[]` when it is a *labelled
plate* (`kind: "figure"`); use `sim` for the section's single most important
diagram of any kind.

## Type contract — the chapter

```ts
type Subject = "science" | "maths";

type SectionNote = {
  kind: "fact" | "remember" | "watch-out" | "exam-tip";
  title?: string;            // omit to use the kind's default label
  body: string;              // plain text, 25–55 words
};

type Section = {
  key: string;               // kebab-case, unique in the chapter, e.g. "what-a-cell-is"
  title: string;
  eyebrow?: string;          // 1–3 words above the title, e.g. "The idea"
  bookRef: string;           // REQUIRED. Must match exactly:
                             //   /^(Exploration|Ganita Manjari) §\d+(\.\d+)*$/
                             // e.g. "Exploration §2.3", "Ganita Manjari §1.2"
  body: string;              // markdown, 250–450 words — see below
  sim?: SimSpec;             // the section's hero diagram
  figures?: SimSpec[];       // its labelled plates, in order
  note?: SectionNote;
};

type CbseQuestion = {
  kind: "mcq" | "truefalse" | "multi" | "quickfire" | "open";
  prompt: string;
  options?: string[];        // required for mcq / truefalse / multi
  correct_index?: number;    // mcq + truefalse — truefalse options are ["True","False"]
  correct_indices?: number[];// multi — every correct index
  model_answer: string;      // for choice kinds, one sentence saying WHY
  difficulty: "basic" | "intermediate" | "advanced";
  section: string;           // MUST match a Section.key in this chapter
};

type Chapter = {
  key: string;               // URL segment; must match the filename
  number: number;            // as printed in the book
  title: string;
  subject: Subject;
  book: "Exploration" | "Ganita Manjari";
  accent: string;            // bright pastel hex; Paper Mode darkens it at render
  summary: string;           // one sentence
  estMinutes: number;
  sections: Section[];       // 5–7
  questions: CbseQuestion[]; // 45–55
};
```

Import types from `@/lib/cbse/types`. Export the chapter as a named const in
lowerCamelCase matching the key: `export const ch07Motion: Chapter = { … }`.

### Writing `body`

250–450 words of markdown per section, for a 14-year-old, in British English.

- Open with something concrete — a relay race, a cork slice under a lens, a
  kitchen observation — then name the idea. Never open with a definition.
- `**bold**` the term being defined, the first time it appears.
- `>` blockquote for a definition quoted from the book, ending `— Exploration, §2.1`.
  **Hard limit: 2 sentences or 300 characters**, checked by the validator.
- Bullet lists for enumerable things; short `###` sub-headings to break up a long
  section.
- Inline maths uses `$…$` and renders (`$O(1)$`, `$\text{speed}$`, greek, sup/sub).
  **Plain `\r`, `\t`, `\b`, `\f` escapes get eaten by TypeScript template
  literals** — write `\\text{}`, or avoid the construct. A literal control
  character in a body is a validation error.
- **Diagrams go in `sim`/`figures[]`, not in the prose.** Markdown here is
  rendered with `strictViz`, so a ` ```viz:* ` fence with a malformed payload
  throws at render rather than degrading. No school chapter uses one today; the
  primitives (`array`, `tree`, `flow`, `table-diff`, `complexity`) exist for the
  AI-generated blogs. If you genuinely want one, keep it tiny — a tree over 14
  nodes, a flow over 12, or any label over 60 characters is rejected — but a
  `figure` plate is the right answer for anything structural.
- No HTML. No images.

### Writing `questions`

45–55 for the chapter, and the mix is fixed and checked:

| kind | count | notes |
| --- | --- | --- |
| `mcq` | 20 | 4 options, one `correct_index` |
| `truefalse` | 10 | options exactly `["True","False"]` |
| `multi` | 8 | 4–5 options, 2+ `correct_indices` |
| `quickfire` | 6 | one-word or one-number answer |
| `open` | 6 | a few sentences; graded by AI at review time |

Every section must be covered by at least one question, and every `section`
field must match a real `Section.key`. Spread `difficulty` roughly
50 basic / 35 intermediate / 15 advanced. Distractors must be plausible — a
wrong option nobody would pick teaches nothing. For choice kinds the
`model_answer` explains *why*, it does not merely restate the right option.

## Type contract — the figures

```ts
type FigureLayer = {
  d: string;                 // SVG path, in viewBox coordinates
  as?: "stroke" | "fill" | "shade" | "light" | "panel";  // default "stroke"
  tint?: string;             // hex; defaults to the parent part's tint
  width?: number;            // stroke width in viewBox units, default 1.2
  opacity?: number;
  dash?: string;             // e.g. "9 7"
};

type FigurePart = {
  id: string;                // kebab-case, unique in the spec
  label: string;             // ≤ 28 chars — used for BOTH the chip and the leader label
  d: string;                 // the body outline; several disjoint subpaths allowed
  layers?: FigureLayer[];    // the detail, painted over the body
  tint?: string;
  labelAt?: [number, number];// omit to make the part chip-only (no leader line)
  leaderAt?: [number, number];// where the leader touches; defaults to the focus centre
  labelAlign?: "start" | "middle" | "end";
  focus: [number, number, number, number];  // REQUIRED [x, y, w, h]
  backdrop?: boolean;        // the cytoplasm, the cell wall, the slide, the beaker
  depth?: number;            // paint order, low = behind; defaults to array index
  blurb: string;             // 25–45 words, plain prose, no markdown
};

type FigureSpec = {
  kind: "figure";
  title: string;             // ≤ 60 chars
  altText: string;           // REQUIRED, ≥ 40 chars: what it shows AND what
                             // interacting does. 2–3 sentences.
  figNumber?: string;        // e.g. "Fig. 2.10 (b)"
  caption?: string;
  viewBox: [number, number];
  parts: FigurePart[];
  scenery?: FigureLayer[];   // non-interactive context, painted before all parts
  panels?: { id: string; box: [number,number,number,number]; caption: string }[];
  notes?: { text: string; at: [number,number]; size?: number;
            align?: "start"|"middle"|"end"; emphasis?: boolean }[];
  magnify?: "camera" | "part";
  maxZoom?: number;
  defaultPartId?: string;
};
```

Types from `@/lib/sim/types`. Other `SimSpec` kinds exist for `sim` —
`anatomy`, `worked-example`, `graph-plot`, `particle-model`, `geometry-board` —
but **`figure` is the default and the right choice for anything labelled.**

### Path helpers — import from `@/lib/sim/draw`

`circle(cx,cy,r)` · `ellipse(cx,cy,rx,ry,deg)` · `dots(points,r)` ·
`blob(cx,cy,rx,ry,wobble[],deg)` · `cell(cx,cy,rx,ry,seed,deg)` ·
`smoothClosed(points)` · `gleam(cx,cy,rx,ry,deg)` · `folds(cx,cy,rx,ry,count,deg,reach)` ·
`cristae(...)` · `discStack(cx,cy,count,rx,ry,gap)` · `cisterna(cx,cy,halfWidth,bow,thickness)` ·
`tubule(x0,y,x1,wave,thickness)` · `roundRect(x,y,w,h,r)` · `stadium(x,y,w,h)` ·
`spindle(...)` · `chromosomes(points,length,thickness)`

Use them instead of hand-computing arc endpoints — that arithmetic is where
silent errors live. Writing your own local geometry helpers at the top of the
figures file is encouraged.

## The eight rules that decide whether a plate looks right

These were each paid for by a plate that shipped looking wrong. They are not
style preferences.

1. **Use the primitive the thing actually IS.** A microscope, a burner, a
   separating funnel is manufactured, so `roundRect` / `stadium` / straight
   edges are correct and rounding them off makes it a toy. An organelle, a cell,
   a blood corpuscle is grown, so it gets `blob()`. Getting this backwards is
   what makes a plate read as a diagram of boxes. **Corollary: boxy is often
   anatomically correct** — collenchyma and sclerenchyma cells really are
   polygonal. A blanket "make everything organic" pass was tried in this repo
   and reverted.
2. **The renderer pins lightness.** A `tint` is read for hue and saturation
   only; `fill`, `shade`, `ink` and `light` are always emitted at fixed
   lightness. **Picking a darker hex does not darken a shape.** To recede, add a
   `shade` self-layer; to go pale, add a full-coverage `light` layer; to sit
   back, desaturate. This bites twice per plate until you internalise it.
3. **A part's body is always FILLED.** Anything thread-like — chromatin, a
   flagellum, an ER tubule, a wire — authored as an open curve closes itself
   into a splodge. Threads must be closed ribbons; `tubule()` is the right
   primitive.
4. **Give every solid a `gleam()`.** A small pale `light` ellipse up and left of
   centre. Detail and palette are what make a plate read as an illustration —
   not perspective. A pseudo-3-D attempt was tried and it still read as a
   diagram.
5. **A sub-part must ALSO be a layer of its parent.** The nucleolus is its own
   clickable part *and* a `shade` layer inside the nucleus — otherwise the
   nucleus lifts away and leaves its nucleolus hanging in the cytoplasm. Define
   the shape once in a `const` and use it twice.
6. **Structures must touch what they are continuous with.** The ER is continuous
   with the outer nuclear membrane; drawn floating below the nucleus it is
   simply wrong.
7. **Keep the viewBox tight to the content**, and leave ~150 units of margin on
   each side for labels. Dead vertical space above the drawing is the usual
   sloppiness — measure where your topmost label and bottommost element actually
   sit. Width 660 suits most plates; 800 is the practical maximum (the rail is
   640px and a plate will not render below 0.72 of its viewBox).
8. **One `tint` per part, collected in a `const T = { … }` at the top.** Aim for
   a saturated, friendly textbook register — greens for wall and chloroplasts,
   cyan for vacuoles, purple for nuclei, warm orange for mitochondria, blue for
   ER, pink for Golgi.

## Choosing `magnify`, and what `focus` really controls

`magnify: "part"` — clicking a component **lifts that component out**: it scales
about its own `focus` centre, drifts toward the middle, casts a shadow, gains a
name tag, and the rest of the plate stays put, dimmed, as context. This is the
default for anatomical and apparatus plates.

`magnify: "camera"` (the default if omitted) scales the *whole plate* into the
part. Use it for exactly two cases:

- **Comparison plates** whose parts *are* their panels (three tissue types side
  by side). A lift there barely enlarges anything and the tag lands on the panel
  captions. Comparing panels is what camera zoom is for.
- **Maths figures.** A maths figure encodes meaning in POSITION — a point lifted
  off its axes, or a numeral off the number line, stops meaning anything. Their
  flat construction-line style is the correct register, not a shortcoming.

**How `focus` behaves under a lift.** A part is often several copies of one
structure sharing one path — four chloroplasts, five stacks of grana, thirty-six
phospholipid heads. Lifting scales the whole path about one centre, so the
renderer first reduces the part to whole shapes: it keeps the subpaths whose
centre lies inside the focus box, plus any subpath that contains the focus box's
centre. Consequences for you:

- **For a multi-copy part, draw the focus box tightly around ONE
  representative.** That is the copy the reader gets to inspect. A loose box
  drags neighbours in.
- **For a single large shape, any focus box works** — the "contains the focus
  centre" clause keeps it whole. Nothing is ever cut mid-shape.
- **Several shapes that are ONE object** (a nosepiece and its barrel; a burner's
  base, stem and flame) should all sit in or around the focus box so the whole
  object lifts together.
- Lift scale is `clamp(min(viewW, viewH) × 0.30 / max(focusW, focusH), 1.35, 2.8)`.
  A focus box much larger than the shape gives a limp 1.35× lift with no punch.
  Tighten the box if a part feels weak.
- **`backdrop: true` parts light up but never scale.** Mark the cytoplasm, the
  cell wall, the beaker, the slide — the container *is* the plate.

## The acceptance bar, in numbers

Chapter 2 is the reference. These are measured from its ten plates, not
invented, and they are what separates it from the chapters that still read as
flat. **An anatomical or apparatus plate is not finished until it clears all
five:**

| | Chapter 2 actual | Your target |
| --- | --- | --- |
| parts per plate | 4–13, median 7 | **≥ 5** |
| detail layers per part | 0.4–2.3, mean 1.3 | **≥ 1.0 on average** |
| parts carrying ≥1 layer | 43–100%, median 90% | **≥ 70%** |
| `magnify` | `"part"` on all ten | **`"part"`** |
| blurb length | 26–32 words | **25–35** |

For contrast, the plates in this repo that visibly fall short: a neuron at 0.2
layers per part with 17% of parts carrying any (a bare outline), a separating
funnel at 0.1 and 14%, a blood tube at 0.4 and 40%. They pass `tsc` and the
validator. They just look empty.

"Detail layers" means the interior that makes a shape a thing rather than a
silhouette: a `gleam()` on every solid, plus what is actually inside it — Nissl
granules in a cell body, lignin rings on a xylem vessel, a mercury thread in a
thermometer, glass highlights and a meniscus on a beaker, a flame cone on a
burner. **Every solid gets a `gleam()`; that alone is one layer per part.**

**Two exemptions, and they matter as much as the bar:**

1. **Comparison plates stay on `camera` and are already dense** — three tissue
   types side by side run 1.3–3.0 layers per part because each panel is a
   little scene. Do not convert them to `"part"`.
2. **Maths figures are exempt entirely.** Every maths plate in this repo sits at
   0.0–0.5 layers per part, on `camera`, with no organic curves — and that is
   *correct*. A maths figure is a construction: flat lines, a right-angle mark,
   a labelled length. Adding volume, gleam or blob outlines to a number line
   makes it worse. Do not apply this section to `subject: "maths"`.

Count it yourself before you claim you are done:

```ts
// per plate
const nParts  = spec.parts.length;
const perPart = spec.parts.reduce((a, p) => a + (p.layers?.length ?? 0), 0) / nParts;
const covered = spec.parts.filter((p) => (p.layers?.length ?? 0) > 0).length / nParts;
```

## Labels

- 15px in viewBox units, wrapped at 15 characters, 17px line height.
- Left-side labels share an x with `align: "end"`; right-side labels share an x
  with `align: "start"`.
- Every label must fit inside the viewBox and must not overlap another label.
  Both are checked automatically.
- Author `leaderAt` whenever the focus centre would land on empty space.
- Parts that would crowd the plate (ribosomes, a nucleolus) may omit `labelAt`
  and be reachable from the chip row only.

## Prose in the figures

Each `blurb` is 25–45 words, plain prose, no markdown: what the part is, what it
does, and where useful how it differs from its counterpart elsewhere. Do not pad.
`altText` describes the whole plate **and** states that selecting a part lifts it
out enlarged.

## Verification — you are not done until these pass

```bash
npx tsc --noEmit
npx tsx scripts/validate-cbse.mts        # section/question counts, the kind mix,
                                         # per-section coverage, bookRef format,
                                         # altText, ≥2 parts, unique ids, blurbs
npx tsx scripts/render-figures.mts .figures
                                         # paints every plate to .figures/*.svg AND
                                         # audits labels running off the plate,
                                         # overlapping labels, focus boxes outside
                                         # the viewBox, duplicate ids
npx tsx scripts/render-figures.mts .figures --lift <partId>
                                         # renders a plate as it looks mid-click
NEXT_PUBLIC_SCHOOL_TRACK=1 npm run build
```

Then **rasterise and actually look at the plates** — `qlmanage -t -s 1100 -o png
.figures/*.svg` on macOS, or open the SVGs in a browser. Every rule in the two
sections above exists because something passed `tsc` and looked wrong. Expect to
iterate two or three times per plate. **Nothing about a drawing is judgeable
from its source.**

## Known traps, collected

- A `figure` part authored as an open path fills itself into a blob (rule 3).
- A darker hex does not darken anything (rule 2).
- `stadium()` taller than it is wide used to emit a malformed path — use the
  helper, do not hand-roll it.
- Template literals eat `\t` `\r` `\b` `\f`. `\\text{}` in maths, always.
- A `section` value in `questions` that does not match a `Section.key` is caught
  by the validator, not by `tsc`. Same for the question mix, the 5–7 section
  count, the `bookRef` format and the 2-sentence blockquote limit — none of
  those are type errors.
- Forgetting the two registry lines yields a chapter that compiles, validates
  and has no URL.
- The in-app preview pane reports `visibilityState === "hidden"`, which throttles
  IntersectionObserver and rAF — the sticky rail will not swap and canvas sims
  render blank there. Verify in a real browser.

---

## TARGET

Author **<chapter number and title>** of **<Exploration | Ganita Manjari>**
(`subject: "<science|maths>"`, `key: "ch-NN-slug"`, `accent: "<hex>"`).

Sections to cover, in book order — one `Section` each, with the `bookRef` shown:

1. `<section title>` — `<Book §N.N>`
2. …

Figures to draw (title · what it must show · `magnify`):

- `<Fig. N.N — title>` · `<what it must show>` · `part`
- …

<!--
  Fill both lists from the printed chapter before running the prompt. Naming the
  figures up front is what stops the model from drawing one hero diagram and
  calling the chapter done. Three to six plates per chapter is the norm.
-->
