# Science chapters — the build plan

Hand this file to an agent. It is self-contained: everything needed to author one
chapter of *Exploration* (NCERT class-9 science) to the standard of the shipped
Chapter 2 is in here. It replaces the four earlier prompt files.

**Nine chapters remain. One chapter per run. Do not batch.**

---

# PART 1 — WHAT YOU ARE BUILDING

A chapter is **two hand-written TypeScript files plus two registry lines**. No
database, no CMS, no AI at runtime, no image assets — the diagrams *are* path
data in the source, rendered as inline SVG. The page that displays it already
exists and is generic; you write no React.

```
src/lib/cbse/class9/science/chapters/ch-NN-slug.ts   the chapter
src/lib/cbse/class9/science/figures/ch-NN.ts         its plates
src/lib/cbse/class9/science/index.ts                 + 2 lines, in book order
```

```ts
// index.ts — a chapter missing these two lines compiles, validates, and has no URL
import { ch04Motion } from "./chapters/ch-04-motion";
export const SCIENCE_CHAPTERS: Chapter[] = [ch02Cell, ch03Tissues, ch04Motion, ch05Mixtures];
```

The route `/learn/class-9/science/<key>` is statically generated from that array,
and `key` must equal the filename.

## The reference

**`src/lib/cbse/class9/science/chapters/ch-02-cell.ts`** and
**`figures/ch-02-organelle-plates.ts`** are the standard. Read both before you
start. Every rule below was paid for by a plate in this repo that shipped looking
wrong.

## Absolute constraints

1. **Original artwork only.** Draw from the subject matter — never trace, adapt
   or "adjust" a published figure, and do not work from a reference image even if
   given one. A lightly-altered copy is a derivative work. Free to use: the
   science itself, standard part names, and the convention of a labelled
   cut-away. Composition, proportions, palette and geometry must be yours.
2. **No new dependencies.** No charting or SVG library, no WebGL, no `three`.
3. **Deterministic.** No `Math.random`, no `Date.now`.
4. **No `any`.** Must pass `tsc --noEmit` on the repo's strict config.
5. **Copyright.** The PDFs under `.claude/Books/` are NCERT's. Read them for
   facts; never reproduce artwork or prose. One short attributed definition per
   section is the limit. **Commit nothing derived from them.**

---

# PART 2 — THE NINE CHAPTERS

PDFs live at `.claude/Books/iesc1dd/iesc1NN.pdf`. Chapter 1 of the book is a
preface about how to use the book — **skip it**; it is not content. Chapters 2, 3
and 5 are already built.

| # | Title | PDF | Pages | Accent | Register |
| --- | --- | --- | --- | --- | --- |
| 4 | Describing Motion Around Us | `iesc104` | 24 | `#6fc3f2` | physics — graphs |
| 6 | How Forces Affect Motion | `iesc106` | 22 | `#ff8a70` | physics — forces |
| 7 | Work, Energy, and Simple Machines | `iesc107` | 24 | `#cfd96b` | physics — machines |
| 8 | Journey Inside the Atom | `iesc108` | 22 | `#b28cf0` | chemistry — abstract |
| 9 | Atomic Foundations of Matter | `iesc109` | 22 | `#ef8fd4` | chemistry — abstract |
| 10 | Sound Waves: Characteristics and Applications | `iesc110` | 24 | `#97d96f` | physics — waves |
| 11 | Reproduction: How Life Continues | `iesc111` | 20 | `#f58fa8` | biology |
| 12 | Patterns in Life: Diversity and Classification | `iesc112` | 24 | `#6fd9a3` | biology |
| 13 | Earth as a System: Energy, Matter, and Life | `iesc113` | 21 | `#d98ff0` | earth systems |

**Suggested order:** 11 and 12 first — they are biology and reuse Chapter 2's
drawing vocabulary directly, so they are the fastest route to a good result. Then
4, 6, 7, 10 as a block (they share a diagram register, so the second is much
faster than the first). Then 8, 9. Then 13.

Accents are suggestions; they only need to be distinct from their neighbours and
bright enough to survive `darkenForPaper()`.

## Per-chapter starting notes

⚠️ **The section lists below are INCOMPLETE.** They came from a text extraction
that provably misses headings — several sit in their own text frame and never
start a line, so 6.5, 7.2, 11.3, 12.2 and others are absent here but exist in the
book. **Confirm every section by reading the PDF.** `bookRef` is regex-checked
for *shape* only; nothing verifies that §4.3 exists.

- **Ch 4 — Describing Motion Around Us.** Seen: 4.1 Motion in a Straight Line ·
  4.2 Graphical Representation of Motion · 4.3 Kinematic Equations. Only three
  numbered sections for 24 pages, so this needs **splitting** to reach 5–7.
  Distance-vs-displacement and speed-vs-velocity are natural separate sections.
- **Ch 6 — How Forces Affect Motion.** Seen: 6.1 The Concept of Force · 6.2
  Balanced and Unbalanced Forces · 6.3 The Force of Friction · 6.4 Newton's First
  Law · 6.6 Newton's Third Law · 6.7 Forces on a System. 6.5 is missing from the
  extraction and is almost certainly the Second Law — check.
- **Ch 7 — Work, Energy, and Simple Machines.** Seen: 7.1 Work Done by a Constant
  Force · 7.3 Forms of Energy · 7.4 Mechanical Energy · 7.5 Power · 7.6 Simple
  Machines. 7.2 missing.
- **Ch 8 — Journey Inside the Atom.** Seen: 8.1–8.8, eight sections → **merge**
  to 5–7. Symbols/atomic number/mass number group naturally.
- **Ch 9 — Atomic Foundations of Matter.** Seen: 9.1–9.8, eight sections →
  **merge**. The three historical laws (conservation of mass, constant
  proportions, Dalton) are one section; molecular mass and formula unit mass are
  one.
- **Ch 10 — Sound Waves.** Seen: 10.1–10.5, 10.7.
- **Ch 11 — Reproduction.** Seen: 11.1 Asexual · 11.2 Sexual · 11.4 Variations ·
  11.5 In Human Beings. **Content sensitivity:** this is a class-9 human
  reproduction chapter. Write it as the book does — clinical, factual, no
  euphemism and no coyness.
- **Ch 12 — Patterns in Life.** Seen: 12.1, 12.3, 12.6, 12.8, 12.9, 12.10.
  Classification hierarchies are the obvious plates.
- **Ch 13 — Earth as a System.** Seen: 13.1, 13.2, 13.4. Few numbered sections,
  each long → **split**.

---

# PART 3 — THE WORKFLOW

## Phase 0 — before you touch anything

```bash
git status --short     # must be clean, or you will mistake someone else's WIP for yours
npx tsc --noEmit && npx tsx scripts/validate-cbse.mts && npx tsx scripts/render-figures.mts .figures
```

All green *before* you start, so any later failure is yours.

## Phase 1 — read the printed chapter

```bash
B=.claude/Books
pdftotext "$B/iesc1dd/iesc104.pdf" -              # whole chapter, reading order
pdftotext -f 3 -l 6 "$B/iesc1dd/iesc104.pdf" -    # a page range
pdfinfo    "$B/iesc1dd/iesc104.pdf"
```

Write down before any code: the **exact printed title** (take it from the running
headers on interior pages — page 1 is laid out around the "Think It Over" sidebar
and extracts scrambled), the **confirmed section list**, the **figure list** with
printed numbers, and the **worked numbers** you will reuse.

## Phase 2 — map printed sections onto 5–7 app sections

**Hard limit: 5–7. The validator rejects 4 and 8.** Merge chapters with 8+
numbered sections, split those with 3–4. Group by idea, not proximity. `bookRef`
names the section a reader should open; when you merge, cite the first; when you
split, both halves cite the same ref (this already happens elsewhere and is
fine). **Order follows the book — never resequence.**

## Phase 3 — inventory every diagram the chapter will render

`sim` and `figures[]` land in the same sticky rail; the split is editorial, not
visual. **The section's best diagram goes in `sim`, the rest in `figures[]`.**
Two validator rules force this:

- **Every chapter needs ≥ 3 `sim`s.**
- **Section 1 must have a `sim`.**

Putting everything in `figures[]` because it looks tidier fails with
`"is missing a sim"`.

> **This phase exists because of a real failure.** A restyle brief once covered
> only `figures[]`. Every plate passed every gate, and the pages still looked
> wrong — because those sections also had `sim`s nobody had looked at. **Audit
> what the page renders, not what you edited.**

## Phase 4 — write prose and questions

## Phase 5 — draw

## Phase 6 — gates

```bash
npx tsc --noEmit
npx tsx scripts/validate-cbse.mts
npx tsx scripts/render-figures.mts .figures
npx tsx scripts/render-figures.mts .figures --lift <partId>   # per part-mode plate
NEXT_PUBLIC_SCHOOL_TRACK=1 npm run build
```

`render-figures.mts` audits labels running off the plate, overlapping labels,
focus boxes outside the viewBox and duplicate ids. Its label check sizes text at
the **worst-case 8.0 units/character** — it was 7.4, the average, and a
15-character label at x=110 audited clean and rendered with its first letter
shaved off. **When it flags a label, move the label; never widen the tolerance.**

## Phase 7 — look at it

Nothing about a drawing is judgeable from its source. Rasterise and open them:

```bash
qlmanage -t -s 1100 -o png .figures/*.svg          # macOS
# or: mkdir -p public/__figcheck && cp .figures/ch-04*.svg public/__figcheck/
#     build an index.html of <img> tags, open /__figcheck/, then rm -rf it
```

⚠️ An in-app preview pane reports `visibilityState === "hidden"`, which throttles
IntersectionObserver and rAF: **it stops painting below the fold**, so a
deep-scrolled screenshot comes back black and the sticky rail never swaps. Put
what you want to see at the top, or assert against the DOM.

## Phase 8 — wire, record, commit

Add the two registry lines. Update `PROJECT_SUMMARY.md` if architecture moved,
append a `SESSION_LOG.md` entry, tick `TASKS.md`, run `graphify update .`, and
**commit** — uncommitted work in a worktree is invisible to every other checkout
and every deploy.

---

# PART 4 — THE TYPE CONTRACT

Types come from `@/lib/cbse/types` and `@/lib/sim/types`.

```ts
type Section = {
  key: string;               // kebab-case, unique in the chapter
  title: string;
  eyebrow?: string;          // 1–3 words above the title, e.g. "The idea"
  bookRef: string;           // MUST match /^(Exploration|Ganita Manjari) §\d+(\.\d+)*$/
  body: string;              // markdown, 250–450 words
  sim?: SimSpec;             // the section's HERO diagram (see Phase 3)
  figures?: SimSpec[];       // its remaining plates, in order
  note?: SectionNote;
};

type SectionNote = {
  kind: "fact" | "remember" | "watch-out" | "exam-tip";
  title?: string;            // omit to use the kind's default label
  body: string;              // plain text, 25–55 words
};

type CbseQuestion = {
  kind: "mcq" | "truefalse" | "multi" | "quickfire" | "open";
  prompt: string;
  options?: string[];        // required for mcq / truefalse / multi
  correct_index?: number;    // mcq + truefalse; truefalse options are ["True","False"]
  correct_indices?: number[];// multi — every correct index
  model_answer: string;      // for choice kinds, one sentence saying WHY
  difficulty: "basic" | "intermediate" | "advanced";
  section: string;           // MUST match a Section.key in this chapter
};

type Chapter = {
  key: string;               // URL segment; must equal the filename
  number: number;
  title: string;             // exactly as printed
  subject: "science";
  book: "Exploration";
  accent: string;            // bright pastel hex
  summary: string;           // one sentence
  estMinutes: number;
  sections: Section[];       // 5–7
  questions: CbseQuestion[]; // 45–55
};
```

Export as a named const matching the key: `export const ch04Motion: Chapter = {…}`.

## Writing `body`

250–450 words per section, British English, for a 14-year-old.

- **Open concrete, then name the idea.** Never open with a definition. The
  printed chapter's "Think It Over" question is a ready-made hook — reuse its
  *premise*, not its wording.
- `**bold**` each term on first use.
- One `>` blockquote definition per section, attributed —
  **≤ 2 sentences or 300 characters**, checked.
- Inline maths uses `$…$`. **Template literals eat `\t` `\r` `\b` `\f`** — write
  `\\text{}`. A literal control character in a body is a validation error.
- **Diagrams go in `sim`/`figures[]`, never in the prose.** Bodies render with
  `strictViz`, so a malformed ` ```viz:* ` fence throws at render. No science
  chapter uses one.
- No HTML, no images.

## Writing `questions`

45–55 per chapter, and the mix is **exact, not a minimum**:

| kind | count | notes |
| --- | --- | --- |
| `mcq` | 20 | 4 options, one `correct_index` |
| `truefalse` | 10 | options exactly `["True","False"]` |
| `multi` | 8 | 4–5 options, 2+ `correct_indices` |
| `quickfire` | 6 | one-word or one-number answer |
| `open` | 6 | a few sentences; AI-graded at review time |

Every section needs ≥1 question and every `section` field must match a real
`Section.key`. Spread difficulty roughly 50 basic / 35 intermediate / 15
advanced. **Distractors must be plausible** — in physics, use the classic
misconceptions (heavier objects fall faster; force is needed to maintain motion),
because those teach when the reader gets them wrong. The `model_answer` on a
choice question explains *why*; it does not restate the right option.

---

# PART 5 — DRAWING

```ts
type FigureLayer = {
  d: string;                 // SVG path, in viewBox coordinates
  as?: "stroke" | "fill" | "shade" | "light" | "panel";  // default "stroke"
  tint?: string;             // defaults to the parent part's tint
  width?: number;            // stroke width, default 1.2
  opacity?: number;
  dash?: string;
  clip?: boolean;            // clip to the PART's outline — see rule 4
};

type FigurePart = {
  id: string;                // kebab-case, unique in the spec
  label: string;             // ≤ 28 chars — used for the chip AND the leader label
  d: string;                 // body outline; several disjoint subpaths allowed
  layers?: FigureLayer[];    // the detail, painted over the body
  tint?: string;
  labelAt?: [number, number];// omit to make the part chip-only
  leaderAt?: [number, number];// where the leader touches; defaults to focus centre
  labelAlign?: "start" | "middle" | "end";
  focus: [number, number, number, number];   // REQUIRED [x, y, w, h]
  backdrop?: boolean;        // cytoplasm, a beaker, a slide — context, never scales
  depth?: number;            // paint order, low = behind
  blurb: string;             // 25–35 words, plain prose, no markdown
};

type FigureSpec = {
  kind: "figure";
  title: string;             // ≤ 60 chars
  altText: string;           // REQUIRED: what it shows AND what interacting does
  figNumber?: string;        // e.g. "Fig. 4.6"
  caption?: string;
  viewBox: [number, number]; // 660 wide suits most; 800 is the practical maximum
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

Other `SimSpec` kinds for `sim`: `worked-example`, `graph-plot`,
`particle-model`, `geometry-board`. **`figure` is the default and the right
choice for anything labelled.** There is no `anatomy` kind — it was deleted.

## Path helpers — `@/lib/sim/draw`

`circle` · `ellipse` · `dots` · `blob` · `cell` · `smoothClosed` · `gleam` ·
`folds` · `cristae` · `discStack` · `cisterna` · `tubule` · `roundRect` ·
`stadium` · `spindle` · `chromosomes`

Use them rather than hand-computing arc endpoints — that arithmetic is where
silent errors live. Local geometry helpers at the top of your figures file are
encouraged.

## The nine rules

1. **Use the primitive the thing actually IS.** A burner, a trolley, a tuning
   fork is manufactured → `roundRect`/`stadium`/straight edges, and rounding them
   makes a toy. A cell, an organ, an embryo is grown → `blob()`. **Corollary:
   boxy is often correct** — a blanket "make everything organic" pass was tried
   here and reverted.
2. **The renderer pins lightness.** A `tint` supplies hue and saturation only;
   `fill`/`shade`/`ink`/`light` are emitted at fixed lightness. **A darker hex
   does not darken a shape.** To recede, add a `shade` self-layer; to go pale, a
   full-coverage `light` layer.
3. **A part's body is always FILLED.** Anything thread-like — a wire, a nerve, a
   ray — authored as an open curve closes itself into a splodge. Threads must be
   closed ribbons; `tubule()` is the right primitive.
4. **Anything drawn INSIDE a part needs `clip: true`.** A grid of cells, rings
   inside a vessel, **a liquid inside a flask** — each is authored as a rectangle
   or cylinder and the shape containing it is not one. A bounding-box check will
   not save you: a cylinder of liquid fits inside a conical flask's bbox and
   still crosses its slanted walls (Fig. 5.12's wall at `y=236` is at `x=83`; the
   liquid started at `x=62`). **Clip anything meant to be contained.**
5. **Give every solid a `gleam()`.** Detail and palette make a plate read as an
   illustration — not perspective. A pseudo-3-D attempt was tried and still read
   as a diagram.
6. **A sub-part must ALSO be a layer of its parent**, or the parent lifts away
   and leaves it behind. Define the shape once in a `const` and use it twice.
7. **Structures must touch what they are continuous with.**
8. **Keep the viewBox tight**, with ~150 units of margin each side for labels.
   Measure where your topmost label and bottommost element actually sit.
9. **One `tint` per part, collected in a `const T = { … }` at the top.**

## `magnify`, and what `focus` controls

`magnify: "part"` lifts the clicked component out — it scales about its own
`focus` centre, drifts toward the middle, casts a shadow, gains a name tag, and
the rest stays put and dimmed. **This is the default for anatomical and apparatus
plates.**

`magnify: "camera"` scales the whole plate into the part. Use it for exactly two
cases:

- **Comparison plates** whose parts *are* their panels (three tissue types side
  by side). A lift there clamps to 1.35× and drops the tag on the captions.
- **Constructions.** A free-body diagram, a velocity–time graph, a ray diagram
  and a number line all encode meaning in POSITION — lift an arrow off a block
  and the diagram stops meaning anything. **Physics chapters are therefore a
  mixture:** the pulley is a specimen and lifts; the force arrows on it do not.

**How `focus` behaves under a lift.** A part is often several copies of one
structure sharing a path. The renderer reduces it to whole shapes — keeping
subpaths whose centre is inside the focus box, plus any subpath containing the
focus box's centre. So:

- **Multi-copy part → draw the focus box tightly around ONE representative.**
- **Single large shape → any focus box works**; nothing is ever cut mid-shape.
- **Several shapes that are ONE object** (a nosepiece and its barrel) should all
  sit in or around the focus box so the whole object lifts together.
- Scale is `clamp(min(viewW,viewH) × 0.30 / max(focusW,focusH), 1.35, 2.8)`. A
  box much larger than the shape gives a limp 1.35× lift — tighten it.
- **`backdrop: true` parts light up but never scale.**

## The acceptance bar

Measured from Chapter 2's ten plates. **A biological or apparatus plate is not
finished until it clears all five.**

| | Ch 2 actual | Target |
| --- | --- | --- |
| parts per plate | 4–13, median 7 | **≥ 5** |
| detail layers per part | 0.4–2.3, mean 1.3 | **≥ 1.0 average** |
| parts carrying ≥1 layer | median 90% | **≥ 70%** |
| `magnify` | `"part"` on all ten | **`"part"`** |
| blurb | 26–32 words | **25–35** |

"Detail layers" means the interior that makes a shape a thing rather than a
silhouette: a `gleam()` on every solid plus what is actually inside it. For
contrast, plates that visibly failed here before being fixed: a neuron at 0.2
layers/part with 17% coverage, a separating funnel at 0.1 and 14%. **Both passed
`tsc` and the validator. They just looked empty.**

**Exempt:** comparison plates stay on `camera` and are already dense.
**Constructions are exempt entirely** — graphs, free-body diagrams and number
lines sit near zero layers on `camera` with no organic curves, and that is
correct. Adding volume to a velocity–time graph makes it worse.

Count it before claiming done:

```ts
const nParts  = spec.parts.length;
const perPart = spec.parts.reduce((a, p) => a + (p.layers?.length ?? 0), 0) / nParts;
const covered = spec.parts.filter((p) => (p.layers?.length ?? 0) > 0).length / nParts;
```

## Labels

15px in viewBox units, wrapped at 15 characters, 17px line height. Left-side
labels share an x with `align: "end"`, right-side with `align: "start"`. Every
label must fit inside the viewBox and not overlap another — both are checked.
Author `leaderAt` whenever the focus centre lands on empty space. Crowding parts
(a scatter of ribosomes) may omit `labelAt` and be reachable from the chip row.

## Which of the book's figures to draw

Three to six per chapter. Pick the ones a student would be asked to **label in an
exam**, plus any the prose cannot explain in words. Skip photographs, tables and
decorative openers. **Never draw two diagrams of the same idea in one section** —
Chapter 3 once had a meristem `sim` *and* a meristem plate in the same section;
the reader got the same content twice, once badly.

---

# PART 6 — PER-CHAPTER CHECKLIST

Copy this into the chapter's PR or session notes and tick it.

**Setup**
- [ ] Working tree clean; all three gates green before starting
- [ ] Chapter picked; accent chosen and distinct from neighbours

**Source**
- [ ] Exact printed title taken from a running header (not page 1)
- [ ] Every section number confirmed by reading the PDF
- [ ] Figure list with printed numbers written down
- [ ] Nothing from `.claude/Books/` copied into the repo

**Structure**
- [ ] 5–7 sections, in printed order
- [ ] Every `bookRef` matches the regex *and* names a section that exists
- [ ] Section 1 has a `sim`; the chapter has ≥ 3 `sim`s
- [ ] No section carries two diagrams of the same idea

**Prose**
- [ ] Each body 250–450 words, opens concrete, terms bolded on first use
- [ ] One attributed blockquote per section, ≤ 2 sentences
- [ ] No literal `\t` `\r` `\b` `\f`; `\\text{}` in maths
- [ ] Each section has a `note`

**Questions**
- [ ] 45–55 total, mix exactly mcq 20 / tf 10 / multi 8 / quickfire 6 / open 6
- [ ] Every section covered; every `section` value matches a real key
- [ ] Distractors plausible; `model_answer` explains why

**Figures**
- [ ] 3–6 plates; each ≥ 5 parts, ≥ 1.0 layers/part, ≥ 70% coverage
- [ ] `magnify: "part"` except comparison plates and constructions
- [ ] Every solid has a `gleam()`
- [ ] Everything drawn inside a part has `clip: true`
- [ ] Focus boxes tight around one representative for multi-copy parts
- [ ] Blurbs 25–35 words; `altText` says what interacting does
- [ ] Palette in a `const T` at the top of the figures file

**Gates**
- [ ] `tsc --noEmit` clean
- [ ] `validate-cbse.mts` passes
- [ ] `render-figures.mts` reports no geometry problems
- [ ] `--lift <partId>` rendered for every part-mode plate
- [ ] `NEXT_PUBLIC_SCHOOL_TRACK=1 npm run build` clean

**Looked at**
- [ ] Every plate rasterised and viewed at rest
- [ ] Every part-mode plate viewed lifted — whole shapes, tag readable, no strays
- [ ] Real page checked at 1440px and 390px, no horizontal scroll in a card
- [ ] Nothing looks flat, grey, or like a placeholder

**Ship**
- [ ] Two registry lines added, in book order
- [ ] Chapter reachable at its URL and listed on the subject index
- [ ] `SESSION_LOG.md` entry, `TASKS.md` ticked, `graphify update .` run
- [ ] Committed

---

# PART 7 — THE TRAPS

Each of these produced a defect that passed every automated check.

1. **You audited only what you edited.** A section's `sim` is a diagram.
2. **Everything in `figures[]`, nothing in `sim`.** Fails validation.
3. **Interior texture without `clip: true`.** Square shoulders on an organic
   shape; a liquid escaping a flask. Bounding boxes do not catch it.
4. **A label that audits clean and renders clipped.** The check is worst-case
   now; if it fires, move the label.
5. **Section count 4 or 8**, or a question mix off by one. Both are exact.
6. **A `bookRef` pointing at a section that does not exist in the book.** Shape
   is checked; existence is not.
7. **Registry lines forgotten.** Compiles, validates, no URL.
8. **Uncommitted at the end.** Invisible to every other checkout and deploy — a
   finished restyle once looked like "nothing happened" for exactly this reason.
9. **A `gleam()` or detail layer floating beside its part rather than on it.**
10. **Reported done on green gates alone.** Phase 7 is not optional.
