# Converting both books into the site — the full programme

The two class-9 NCF-SE 2023 textbooks are on disk. Start with **`CHAPTER-WORKFLOW.md`** — it is the runbook. This file is the
plan for turning **all 21 chapters** into pages in the Chapter-2 format: prose, question
bank, and drawn interactive figures.

It is the umbrella document. The two files it drives are:

- **`author-a-chapter.md`** — the prompt you actually paste into a model. It
  carries the type contract, the drawing rules and the acceptance bar.
- **`targets-existing-chapters.md`** — drop-in TARGET blocks for the chapters
  already shipping.

This file adds what those two cannot: the inventory, the order, the accent
assignments, the editorial rules for mapping a printed chapter onto 5–7 app
sections, and the per-chapter notes on which diagram register each subject
needs.

---

## 0 · The books, and the rule about them

```
.claude/Books/iesc1dd/iesc1NN.pdf   Exploration        (Science, 13 chapters)
.claude/Books/iemh1dd/iemh10N.pdf   Ganita Manjari I   (Mathematics, 8 chapters)
```

**These PDFs are NCERT's copyrighted material.** They are gitignored and must
stay that way. The rule for every run:

- **Read them for facts.** Anatomy, apparatus, laws, worked numbers, section
  structure, figure numbers, terminology — all free to use.
- **Never reproduce the artwork.** Not traced, not adapted, not "adjusted", not
  extracted as an image. Every diagram on the site is drawn from the subject
  matter in path data. This is settled policy: an earlier attempt to ship page
  crops was reverted and the whole extraction pipeline deleted.
- **Never reproduce the prose.** Section bodies are written fresh and are
  substantially shorter than the book. The one exception is a **single quoted
  definition per section** in a blockquote with attribution — and the validator
  caps blockquotes at 2 sentences / 300 characters, which is the guardrail.
- **Nothing from `.claude/Books/` is ever committed**, including extracted text.

---

## 1 · Inventory

### Exploration — Science, 13 chapters

| # | Title | Pages | Status |
| --- | --- | --- | --- |
| 1 | Exploration: Entering the World of Secondary Science | 7 | **Skip** — a preface about how to use the book, not content. |
| 2 | Cell: The Building Block of Life | 20 | ✅ **Done — the reference.** |
| 3 | Tissues in Action | 20 | ✅ Done; artwork restyle briefed |
| 4 | Describing Motion Around Us | 24 | ☐ To author |
| 5 | Exploring Mixtures and their Separation | 22 | ✅ Done; artwork restyle briefed |
| 6 | How Forces Affect Motion | 22 | ☐ To author |
| 7 | Work, Energy, and Simple Machines | 24 | ☐ To author |
| 8 | Journey Inside the Atom | 22 | ☐ To author |
| 9 | Atomic Foundations of Matter | 22 | ☐ To author |
| 10 | Sound Waves: Characteristics and Applications | 24 | ☐ To author |
| 11 | Reproduction: How Life Continues | 20 | ☐ To author |
| 12 | Patterns in Life: Diversity and Classification | 24 | ☐ To author |
| 13 | Earth as a System: Energy, Matter, and Life | 21 | ☐ To author |

### Ganita Manjari Part I — Mathematics, 8 chapters

| # | Title | Pages | Status |
| --- | --- | --- | --- |
| 1 | Orienting Yourself: The Use of Coordinates | 15 | ✅ Done |
| 2 | Introduction to Linear Polynomials | 25 | ☐ To author |
| 3 | The World of Numbers | 27 | ✅ Done |
| 4 | Exploring Algebraic Identities | 24 | ☐ To author |
| 5 | I'm Up and Down, and Round and Round | 26 | ☐ To author |
| 6 | Measuring Space: Perimeter **and Area** | 37 | ⚠️ **Half done** — the app has Perimeter only and is retitled to match. The printed title includes Area. Briefed as block 5 of `targets-existing-chapters.md`. |
| 7 | The Mathematics of Maybe: Introduction to Probability | 19 | ☐ To author |
| 8 | Predicting What Comes Next: Exploring Sequences and Progressions | 27 | ☐ To author |

**Remaining work: 14 new chapters + finishing maths 6.**

---

## 2 · The unit of work is one chapter, per model run

Do not attempt a book, a subject, or even two chapters in one run. One chapter
is already ~2,000 words of prose, 50 questions and 3–6 hand-drawn SVG plates,
and the plates need two or three visual iterations each that **cannot be judged
from source**. A run that tries to do more produces thin prose and empty
diagrams that pass every automated check.

Each run ends with the chapter committed and every gate in §7 green. Then start
the next run fresh.

---

## 3 · Per-chapter pipeline

### Step 1 — Read the chapter and build its outline

```bash
B=.claude/Books
pdftotext "$B/iesc1dd/iesc104.pdf" -            # whole chapter, reading order
pdftotext -f 3 -l 6 "$B/iesc1dd/iesc104.pdf" -  # a page range
pdfinfo    "$B/iesc1dd/iesc104.pdf"             # page count
```

Produce, before writing any code:

- the chapter's **exact printed title** (running headers are the reliable
  source — the title on page 1 is set around the "Think It Over" sidebar and
  extracts scrambled);
- its **section numbers and headings**, confirmed by reading, not guessed —
  `bookRef` is regex-checked for *shape* but nothing verifies §4.3 exists;
- its **figure list** with printed figure numbers and captions;
- the **worked examples and numbers** you will reuse.

⚠️ A quick `grep -oE '^[0-9]+\.[0-9]+ [A-Z]'` over the extracted text **misses
headings** — several are set in separate text frames and never appear at the
start of a line. Confirm the list by reading the pages. Getting this wrong puts
a `bookRef` in the UI pointing at a section that does not exist.

### Step 2 — Map the printed sections onto 5–7 app sections

This is the main editorial judgement in the whole job, and the app's cap forces
it: **`sections` must be 5–7. No exceptions — the validator rejects 4 or 8.**

The printed chapters run from 3 to 10 numbered sections, so:

- **A book chapter with 8–10 sections** → merge. Group by idea, not by
  proximity. Science ch9 has eight sections; "Molecular mass" and "Formula unit
  mass" are one app section, and the three historical laws (conservation of
  mass, constant proportions, Dalton) merge into one.
- **A book chapter with 3–4 sections** → split. Science ch13 has few numbered
  sections but each is long; split on the natural sub-idea.
- **`bookRef` names the section a reader should open.** When you merge, cite
  the first: `"Exploration §9.1"`. When you split, both halves cite the same
  ref — that is fine and already happens (ch-03-tissues has two sections on
  `§3.2`, ch-01-coordinates has three on `§1.3`).
- **Order follows the book.** Never resequence.

Write the section list out and sanity-check it against the printed chapter
before writing a word of prose.

### Step 3 — Write the prose

Rules are in `author-a-chapter.md`. The ones that decide quality:

- 250–450 words per section, British English, for a 14-year-old.
- **Open concrete, then name the idea.** Never open with a definition. The book
  itself does this — the "Think It Over" question at the head of each printed
  chapter is a ready-made hook, and reusing its *premise* (not its wording) is
  the fastest way to a good opening.
- One `>` blockquote definition per section, attributed, ≤2 sentences.
- `**bold**` each term on first use.
- Maths uses `$…$`; write `\\text{}` because template literals eat `\t`.

### Step 4 — Choose the diagram register for this chapter

**This is where a generic prompt goes wrong**, so decide it deliberately. The
site has six `SimSpec` kinds and they are not interchangeable:

| Chapter type | Hero `sim` | `figures[]` | `magnify` |
| --- | --- | --- | --- |
| **Biology** (sci 2, 3, 11, 12) | `figure` | labelled `figure` plates | `"part"` |
| **Chemistry — apparatus** (sci 5) | `particle-model` | apparatus `figure` plates | `"part"` |
| **Chemistry — abstract** (sci 8, 9) | `particle-model` / `worked-example` | `figure` plates of atoms, shells, bonds | `"part"` |
| **Physics — motion & graphs** (sci 4, 10) | `graph-plot` | `figure` plates of set-ups and waveforms | `"camera"` for anything graph-like, `"part"` for apparatus |
| **Physics — forces & machines** (sci 6, 7) | `worked-example` | `figure` plates of free-body diagrams, levers, pulleys | `"part"` for machines, `"camera"` for force diagrams |
| **Earth systems** (sci 13) | `figure` | `figure` plates of cycles and cross-sections | `"part"` |

**`sim` vs `figures[]`**: both render in the same rail, so the split is
editorial — the section's hero goes in `sim` (the validator wants >=3 per
chapter and one on section 1), the rest in `figures[]`. The `anatomy` kind no
longer exists; every labelled diagram is a `figure`.
| **Maths, all** | `graph-plot` / `worked-example` / `geometry-board` | flat construction `figure` plates | **`"camera"`, always** |

**A free-body diagram, a velocity–time graph and a ray diagram are
constructions, not specimens.** They obey the maths rule: meaning lives in
position, so they stay on `camera`, stay flat, and get no `gleam()`. Lifting an
arrow off a block destroys the diagram. Physics chapters are therefore a
*mixture* — the pulley is a specimen and lifts, the force arrows on it do not.

### Step 5 — Draw the figures

3–6 plates per chapter. Follow `author-a-chapter.md` in full, and hit the
acceptance bar for anything anatomical or apparatus: **≥5 parts, ≥1.0 detail
layers per part, ≥70% of parts carrying a layer, `magnify: "part"`.** Maths and
construction figures are explicitly exempt.

Which of the book's figures to draw: pick the ones a student would be asked to
*label in an exam*, plus any the prose cannot explain in words. Skip
photographs, tables and decorative openers.

### Step 6 — Write the question bank

45–55 questions, mix fixed at **mcq 20 / truefalse 10 / multi 8 / quickfire 6 /
open 6**, every section covered, every `section` field matching a real
`Section.key`. Numeric chapters (physics, maths) should lean on `quickfire` for
computed answers and `open` for "explain why". Distractors in physics should be
the classic misconceptions — heavier objects fall faster, force is needed to
maintain motion — because those teach when the reader gets them wrong.

### Step 7 — Wire it up

Two registry lines, in printed book order:

```ts
// src/lib/cbse/class9/science/index.ts
import { ch04Motion } from "./chapters/ch-04-motion";
export const SCIENCE_CHAPTERS: Chapter[] = [ch02Cell, ch03Tissues, ch04Motion, ch05Mixtures];
```

Filenames: `chapters/ch-NN-slug.ts` and `figures/ch-NN.ts`. `key` equals the
filename. **A chapter missing these two lines compiles, validates, and has no
URL.**

---

## 4 · Accent assignments

Every chapter needs a distinct bright pastel. Paper Mode darkens it at render
(`darkenForPaper`), so author it bright — a hex chosen to look right on the dark
theme is correct.

**Taken:** sci 2 `#43d6b5` · sci 3 `#5ad1c0` · sci 5 `#f5b95f` ·
maths 1 `#9fb3ff` · maths 3 `#87e3cd` · maths 6 `#ffc163`

**Suggested for the rest** (spread around the wheel, avoiding the teal band the
biology chapters already own):

| Chapter | Accent | | Chapter | Accent |
| --- | --- | --- | --- | --- |
| Sci 4 Motion | `#6fc3f2` sky | | Sci 11 Reproduction | `#f58fa8` rose |
| Sci 6 Forces | `#ff8a70` coral | | Sci 12 Diversity | `#6fd9a3` spring |
| Sci 7 Work & Energy | `#cfd96b` lime | | Sci 13 Earth system | `#d98ff0` orchid |
| Sci 8 Atom | `#b28cf0` violet | | Maths 2 Polynomials | `#c48ff0` mauve |
| Sci 9 Atomic Matter | `#ef8fd4` magenta | | Maths 4 Identities | `#ff9a80` salmon |
| Sci 10 Sound | `#97d96f` green | | Maths 5 Curves | `#6fcfe8` cyan |
| | | | Maths 7 Probability | `#b3d96b` olive |
| | | | Maths 8 Sequences | `#f58fc0` pink |

Swap freely — the only requirements are *distinct from its neighbours in the
list* and *bright enough to survive being darkened*.

---

## 5 · Effort, honestly

A chapter is roughly:

- 5–7 sections × 350 words ≈ **2,000 words of prose**
- **50 questions** with model answers
- **3–6 plates**, each 100–250 lines of generated path data, each needing 2–3
  visual iterations

At 14 chapters that is a substantial programme, not an afternoon. Sequence it so
value lands early rather than authoring by book order:

1. **Maths 6 Area** — finishes a chapter that is currently half a chapter and
   mis-titled against its own book. Smallest job, clearest gap.
2. **Science 4, 6, 7, 10** — physics. Four chapters that share a diagram
   register (graphs + apparatus + free-body), so the second is much faster than
   the first.
3. **Science 11, 12** — biology, which reuses the Chapter-2 drawing vocabulary
   directly and should be the highest-quality output.
4. **Science 8, 9** — chemistry.
5. **Science 13** — earth systems.
6. **Maths 2, 4, 5, 7, 8** — all flat-register, so fast to draw and slow to
   write (the prose carries everything).

---

## 6 · Rules that survive every chapter

Restated because they are the ones a fresh run gets wrong:

1. **`sections` is 5–7 and `questions` is 45–55 with a fixed mix.** Not
   guidance — a validator error.
2. **Use the primitive the thing actually is.** Manufactured ⇒ flat-sided;
   grown ⇒ `blob()`. Boxy is often anatomically correct.
3. **A darker hex does not darken a shape** — `cartoonFor()` pins lightness.
   Use a `shade` self-layer to recede, a `light` layer to go pale.
4. **A part's body is always filled** — thread-like things must be closed
   ribbons or they self-close into a splodge.
5. **Maths and construction figures stay flat and on `camera`.** Do not
   "improve" them with volume. A blanket organic pass was tried and reverted.
6. **Nothing about a drawing is judgeable from source.** Render it, rasterise
   it, look at it.
7. **Never commit anything derived from `.claude/Books/`.**

---

## 7 · Gates — a chapter is not done until all of these pass

```bash
npx tsc --noEmit
npx tsx scripts/validate-cbse.mts
npx tsx scripts/render-figures.mts .figures
npx tsx scripts/render-figures.mts .figures --lift <partId>   # per part-mode plate
NEXT_PUBLIC_SCHOOL_TRACK=1 npm run build
qlmanage -t -s 1100 -o png .figures/*.svg                     # then LOOK
```

Plus, by hand:

- [ ] Chapter appears at `/learn/class-9/<subject>/<key>` and in the subject index
- [ ] Every section's rail shows its sim + figures + note, and swaps on scroll
- [ ] Checked at 1440px (two columns) and 390px (one column)
- [ ] Every `part`-mode plate lifts a component cleanly — no sliced shapes, tag
      readable, no stray copies
- [ ] Per plate: `parts ≥ 5`, `layers/part ≥ 1.0`, `≥70%` of parts have a layer
- [ ] `bookRef` values match section numbers that actually exist in the PDF
- [ ] No book text reproduced beyond one short attributed definition per section

---

## 8 · The per-chapter TARGET block

Paste `author-a-chapter.md` (everything below its `---`), then replace its
TARGET section with this, filled in from Step 1:

```
## TARGET

Author **Chapter <N>, "<exact printed title>"** of **<Exploration | Ganita Manjari>**.

  subject:   "<science|maths>"
  key:       "ch-NN-<slug>"
  accent:    "<hex from §4>"
  book PDF:  .claude/Books/<iesc1dd/iesc1NN.pdf | iemh1dd/iemh10N.pdf>

Source sections in the printed chapter:
  <N.1> <heading>
  <N.2> <heading>
  …

App sections to write (5–7), with the merge/split decision already made:
1. key `<kebab-key>` — "<title>" — `<Book §N.N>` — covers printed <N.1>
2. …

Diagram register for this chapter: <from the table in §4 of convert-the-books.md>

Figures to draw:
- "<title>" · <what it must show> · `magnify: "<part|camera>"` · recaps Fig. <N.N>
- …

Hero `sim` per section (kind + what it does), where the section warrants one:
- section `<key>`: `<graph-plot|worked-example|particle-model|geometry-board|figure|anatomy>` — <what the reader manipulates>
- …

Do not modify any other chapter, the renderer, or the layout. Add the two
registry lines. Run every gate in §7 of convert-the-books.md before reporting
done.
```

---

## 9 · What not to do

- **Do not batch chapters.** See §2.
- **Do not extract or trace book artwork.** Settled; the pipeline that did it
  was deleted along with 844 KB of crops.
- **Do not touch `FigureSim.tsx`, `ChapterReader.tsx`, `draw.ts` or the
  validator** while authoring content. If a plate needs a renderer feature it
  does not have, say so and stop — that is a separate change with its own
  review.
- **Do not "improve" the existing chapters** in a run meant for a new one.
- **Do not raise the section or question caps** to fit more content in. Merging
  is the intended answer, and the caps are what keep a chapter reviewable.
- **Do not report a chapter done on green gates alone.** Every rule in §6 exists
  because something passed every automated check and still looked wrong.
