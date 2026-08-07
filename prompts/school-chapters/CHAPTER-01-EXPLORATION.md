# Chapter 1 — Exploration: Entering the World of Secondary Science

**Companion to `SCIENCE-CHAPTERS-PLAN.md`. Read that file first, all of it.**
Everything in it binds except the three overrides below. This file exists because
Chapter 1 breaks assumptions the main brief bakes in, and because it is the only
science chapter with nothing in the book to draw.

**One chapter, one run.**

---

# PART 0 — THE MAIN BRIEF IS WRONG ABOUT THIS CHAPTER

`SCIENCE-CHAPTERS-PLAN.md` Part 2 says:

> Chapter 1 of the book is a preface about how to use the book — **skip it**; it
> is not content.

That was never checked against the PDF. It is false.

`iesc101.pdf` is **7 pages, ≈3,000 words** of extracted text and carries the same
apparatus as every other chapter in the book:

| | count |
| --- | --- |
| worked Examples | 3 (1.1 cricket shot, 1.2 testable rain prediction, 1.3 litres of air per day) |
| Activity | 1 (1.1 — model your ride home) |
| Pause and Ponder | 3 |
| Ready to Go Beyond | 4 (aircraft fuel, weather forecasts, rice estimate, how a mask works) |
| Threads of Curiosity | 3 (why `c`, why the kilogram, the eclipse-food claim) |
| Meet a Scientist | 1 (Meghnad Saha) |
| numbered figures | 4 |

Its subject is **scientific method**: modelling and deliberate simplification,
precise language and SI units, mathematics as reasoning rather than arithmetic,
the law/theory/principle distinction, prediction and correction by evidence,
estimation, and the artificiality of disciplinary boundaries.

Exactly one sentence concerns how to use the book — the magnifying-glass and
compass motif framing the page numbers — and even that is thematic.

**Consequence: ten science chapters remain, not nine.** Fix Part 2's table and
`TASKS.md` when this ships.

---

# PART 1 — THE THREE OVERRIDES

## Override 1 — every `bookRef` is `Exploration §1`

Chapter 1 has **no numbered sections**. This is not the extraction-misses-headings
problem the main brief warns about for Chapters 6, 7, 11 and 12 — there are none
in the book. It is continuous prose broken by sidebars.

The validator's regex is `/^(Exploration|Ganita Manjari) §\d+(\.\d+)*$/`. The
`(\.\d+)*` is **zero**-or-more, so a bare `Exploration §1` passes. Verified:

```
"Exploration §1"             VALID
"Exploration §1 (opening)"   REJECTED
```

**Use `Exploration §1` on all seven sections.**

**Do not invent §1.1 … §1.7 to make the refs look normal.** Trap 6 of the main
brief is a `bookRef` naming a section that does not exist in the book, and
manufacturing subsection numbers is the purest form of it — shape is checked,
existence is not, and a student who opens the book looking for §1.4 will not find
it. This is the only chapter where every section shares one ref, and that is the
correct answer, not a workaround.

## Override 2 — the real gates, since the checklist overstates them

The main brief's Phase 3 and Part 6 both assert *"Section 1 must have a `sim`"*.
`validate-cbse.mts` does not check that. What it actually enforces per chapter:

| gate | actual rule |
| --- | --- |
| sections | 5–7 |
| sims | ≥ 3, in any sections |
| notes | ≥ 4, **not** one per section |
| questions | 45–55 total; mix exactly mcq 20 / tf 10 / multi 8 / quickfire 6 / open 6 |
| `bookRef` | regex only |
| `altText` | ≥ 40 chars, on sims *and* inline figures |
| part `blurb` | ≥ 40 chars |

Give section 1 a `sim` anyway — it is the house convention and the page opens
broken-backed without one. The point is not to go hunting for a rule that isn't
there when something else fails.

## Override 3 — you cannot pick the book's figures, because there are none to pick

The main brief says: choose 3–6 of the book's figures, **skip photographs**.
Chapter 1's four figures are Fig. 1.1 a pan balance, 1.2 a solar eclipse, 1.3
rice cooking, 1.4 surgical masks — **all four are photographs.** Apply the rule
literally and the chapter has zero plates and fails the ≥3 sims gate.

So Chapter 1's plates are **invented**. That is a harder brief than it sounds,
and it has one dominant failure mode:

> **The obvious response to an abstract chapter is a flowchart** — rounded boxes
> with words in them and arrows between. It clears `tsc`, the validator and the
> geometry audit, and it is exactly the "flat, grey, or like a placeholder"
> failure the main checklist's last box exists to catch. The acceptance bar (≥5
> parts, ≥1.0 layers/part, ≥70% coverage) cannot be cleared by word-boxes,
> because a box has nothing inside it to draw.

**The rule for this chapter: draw the concrete instance, never the abstraction.**
"A model simplifies" is not drawable. A cricket ball reduced to a point with a
velocity arrow is. Every plate proposed below is a physical scene or a real
instrument, chosen so the idea falls out of the picture instead of being lettered
onto it.

---

# PART 2 — THE PLATE SLATE

Six candidates. **Build 4–5.** Parts, layers and `magnify` are specified because
this is the chapter where an agent has no printed figure to work from.

### Plate A — "Observation, and a direction to point it" · `part` · section 1 hero

The book's own motif as an object: a magnifying glass and a pocket compass lying
on a desk. Both **manufactured**, so rule 1 applies — flat-sided, `circle`,
`roundRect`, `stadium`. Rounding them into pebbles makes a toy.

Parts (≥ 6): lens · bezel ring · handle with ferrule · compass housing · dial
with cardinal marks and degree ticks · magnetised needle · pivot cap · glass cover.
Layers: `gleam()` on lens, cover and housing; a rim highlight on the bezel; brass
banding on the ferrule; tick marks **`clip: true`** inside the dial (rule 4).
The needle is thread-like → a **closed ribbon with real width**, never a stroked
line (rule 3 — the geometry audit now fails a zero-area body).

Dense, lifts well, and it is the chapter's thesis as a physical object: careful
looking, plus a chosen direction.

### Plate B — "What the model keeps, and what it throws away" · `camera` · 2 panels

Example 1.1, the cricket six. **Left panel, the real thing, deliberately
over-detailed:** bat with grain and a taped handle, seamed ball, grass, boundary
rope, a fielder. **Right panel, the same shot as physics:** one filled circle at
the origin, a labelled velocity arrow at an angle, a dashed parabola, the boundary
as a marked distance. Captions "What we see" / "What we model".

Comparison plate → `camera`, exempt from the layer bar. **Leave ≥ 30 units under
each panel box** or the caption renders below the viewBox and silently never
appears (trap 11).

The thing the plate must say visually: nothing in the right panel is *wrong*, it
is *chosen*. Carry the discarded details as a faded strip so the reader can see
what was dropped and that dropping it was deliberate.

### Plate C — "One quantity, one symbol, one unit" · `part`

A bench of five instruments, each blurb naming quantity / symbol / unit: pan
balance with brass weights (mass, $m$, kg) · steel rule (length, $l$, m) ·
stopwatch (time, $t$, s) · laboratory thermometer (temperature, $T$, K) ·
ammeter with a needle dial (current, $I$, A).

All manufactured → straight edges, `roundRect`, `stadium`, `circle`. Every solid
gets a `gleam()`. Scale marks and dial ticks are layers with **`clip: true`**.

Carries the `c`/*celeritas* box, the "a kilogram means the same everywhere" box,
and the aircraft-fuel unit disaster.

### Plate D — "From a hunch to something you can test" · `camera`

Example 1.2. One sky, twice. **Left:** a dark cloud — weather is natural, so
`blob()` is right here — and a speech bubble, "it'll rain this afternoon".
**Right:** the same cloud annotated with what is measurable — a hygrometer
reading, a wind arrow carrying a speed, a thermometer with a falling column, a
tally of the last three rainy days. `camera`: the annotations mean what they mean
because of where they sit.

### Plate E — "Ten thousand litres of air" · `camera`

Example 1.3 — the chapter's best number and its best picture. Three stages, left
to right: one breath ≈ 0.5 L → a party balloon = 4–5 breaths ≈ 2 L → a day ≈
20,000 breaths ≈ 10,000 L, drawn as a block of balloons with the count. **Keep
the arithmetic in `notes[]`, not labels:** on a quantitative plate the numerals
*are* the content, and `notes` stay on screen and scale during magnification
where labels fade out.

### Plate F — "Why a mask needs four sciences" · `part`

Fig. 1.4 is a photograph, but the mechanism is a genuine cutaway and the book
itself names the four disciplines. A magnified cross-section through the fabric:
outer hydrophobic layer · melt-blown filter web of tangled polymer fibres · inner
comfort layer · a large droplet caught on the surface · a fine particle deflected
onto a charged fibre · the airflow threading between.

Fibres are threads → closed ribbons with real width (rule 3). The fibre web sits
inside the middle layer → **`clip: true`** (rule 4). Lifting each part names which
science explains it — which is the whole point of the closing section.

### Optional Plate G — law / theory / principle · `camera` · 3 panels · ⚠️ read this first

Tempting and **usually a mistake**: it wants to become three labelled boxes. It
only works if each panel is a concrete *instance* — a bus braking and a passenger
lurching (a described pattern), two atoms joining into a molecule (an explanation
of why), a child on stairs with energy converting (a broad idea applied). If you
cannot draw all three as scenes, **leave section 5 without a plate.** That is the
better outcome; see below.

### Slate rules

- **At least two `part` plates.** A chapter built entirely from `camera`
  constructions reads as a slide deck. A and C are the specimen/apparatus plates
  that clear the acceptance bar; B, D, E are constructions and exempt from it.
- Recommended build: **A, B, C, D, F** — five plates, two of them `part`.
- `--lift <partId>` every `part`-mode plate before claiming done.

---

# PART 3 — THE SECTION PLAN

Seven sections, following the book's argument in printed order. **Seven is the
validator ceiling** — nothing can be added later without merging two.

| # | `key` | covers | diagram |
| --- | --- | --- | --- |
| 1 | `how-we-know` | secondary science is about *how* we know; observation with direction | `sim`: Plate A |
| 2 | `models-and-simplification` | models, assumptions, what is ignored on purpose; Example 1.1, Activity 1.1, Meghnad Saha | `sim`: Plate B |
| 3 | `the-language-of-science` | everyday words with exact meanings; symbols; SI units; `c`; the kilogram; the fuel disaster | `sim`: Plate C |
| 4 | `mathematics-as-reasoning` | an equation as a compact statement about a relationship, not a formula to memorise | — |
| 5 | `laws-theories-principles` | the three do different jobs; a theory is not a guess | — (or Plate G) |
| 6 | `prediction-and-evidence` | prediction as reasoned expectation; Example 1.2; weather forecasts; the eclipse claim; theories have limits and that is the strength | `sim`: Plate D |
| 7 | `estimation-and-no-walls` | rough estimates as a check; Example 1.3; branches are our filing system, not nature's; the mask | `sim`: Plate E · `figures[]`: Plate F |

Five `sim`s against a gate of three. Section 7 carries two plates, which is fine —
they are different ideas, not the "two diagrams of the same idea" the main brief
warns about.

**Sections 4 and 5 carry no diagram, deliberately.** There is nothing physical in
either, and a plate there would be word-boxes. **Two undiagrammed sections beat
two flowcharts.** Do not add a plate for symmetry.

**Fallback if seven proves too thin:** merge 5 into 6 for six sections. Do not go
below five.

---

# PART 4 — PROSE: THE HIGHEST PLAGIARISM RISK IN THE BOOK

Every other chapter rests on facts. A mitochondrion has cristae; sound needs a
medium. You can restate a fact in your own words and it is still true and still
yours.

**Chapter 1 has almost no facts. It is argument and framing, so the wording *is*
the content** — which makes it the easiest chapter in the book to plagiarise
without noticing you have done it. Chapter 3 of the maths book had to be rewritten
for exactly this, with 20-word unattributed runs.

**Phrasings the book owns — do not reuse:** its gloss on the magnifying glass and
compass, its "not wandering aimlessly" formulation, its line about science valuing
careful reasoning above accurate calculation, and its "science is not just a
collection of facts…" closing.

**Free to use:** the technical distinctions (law / theory / principle), SI units
and symbols, `c` from Latin *celeritas* and the defined 299 792 458 m/s, Meghnad
Saha's ionisation work on stellar spectra, and the *shape* of the worked examples.
Re-stage them — your own ball, your own question, your own numbers.

**Check it.** 8-gram overlap against the source, target zero unquoted runs ≥ 8
words:

```bash
pdftotext .claude/Books/iesc1dd/iesc101.pdf -
```

One attributed `>` blockquote per section, ≤ 2 sentences, is the only exception.

**Voice.** The book is second-person and inspirational and signs off "Happy
Exploring!". The house voice is not. Write it as the app's other chapters are
written: concrete opening, term bolded on first use, no exhortation.

---

# PART 5 — QUESTIONS

Mix is unchanged and exact: mcq 20 / tf 10 / multi 8 / quickfire 6 / open 6, 45–55
total, every section covered.

A methodology chapter produces bad MCQs very easily — *"What is a model?"* with
three silly options teaches nothing. **Anchor every question to a scenario:** give
a situation and ask what may sensibly be ignored; which of four questions is
testable; which of four unit statements is wrong; whether a given statement is a
law, a theory or a principle.

The distractors that teach here are the real misconceptions: **that "theory" means
a guess**, and **that a more detailed model is always a better one**. Use both.

`quickfire` is well served by units and symbols (*the SI unit of current?*).
`open` suits the Pause and Ponder prompts, re-staged.

---

# PART 6 — CHAPTER HEADER AND REGISTRY

```ts
export const ch01Exploration: Chapter = {
  key: "ch-01-exploration",     // MUST equal the filename
  number: 1,
  title: "Exploration: Entering the World of Secondary Science",
  subject: "science",
  book: "Exploration",
  accent: "#f7c85c",
  summary: "…one sentence…",
  estMinutes: 16,
  sections: [ /* 7 */ ],
  questions: [ /* 50 */ ],
};
```

**Title** confirmed from the running header on interior pages. Page 1 sets it over
three lines and extracts scrambled — exactly the trap Phase 1 of the main brief
warns about. Note it repeats the book name; that is what is printed.

**Accent.** Its only neighbour is Ch2 (`#43d6b5`, teal-green), so a warm gold is
maximally distinct and suits the brass-instrument plates. In use elsewhere:
Ch3 `#5ad1c0`, Ch5 `#f5b95f`, Ch11 `#f58fa8`. Ch5's amber is the nearest
collision and it is not adjacent.

**estMinutes 16** — 7 printed pages, the shortest science chapter (others 18–25).

**Registry — Chapter 1 goes FIRST:**

```ts
import { ch01Exploration } from "./chapters/ch-01-exploration";

export const SCIENCE_CHAPTERS: Chapter[] = [
  ch01Exploration, ch02Cell, ch03Tissues, ch05Mixtures, ch11Reproduction,
];
```

Files:

```
src/lib/cbse/class9/science/chapters/ch-01-exploration.ts
src/lib/cbse/class9/science/figures/ch-01.ts
src/lib/cbse/class9/science/index.ts        + 2 lines
```

---

# PART 7 — SOURCE INVENTORY (confirmed against the PDF)

So you do not have to re-derive it. Still read the chapter.

- **Models.** Simplification is deliberate, not sloppy: a car as a point, atoms as
  spheres and bonds, the Earth as a layered smooth sphere. Air resistance dropped
  to see gravity plainly; individual cells ignored to see the heart as a pump.
- **Meghnad Saha.** Treated stellar matter as a hot gas, ignored most of the
  processes, kept temperature, pressure and ionisation — and got the link between
  a star's colour and its temperature.
- **Example 1.1.** Cricket six. Keep: mass of the ball, speed, direction. Drop:
  bat brand, ball colour, grass. Smaller effects: air resistance, spin, seam.
- **Language and units.** *force*, *work*, *cell*, *reaction* have exact meanings;
  $m$, $v$, $F$, $I$. `c` from *celeritas*; the speed of light is **defined** as
  exactly 299 792 458 m/s. Aircraft-fuel incident: 22 300 kg needed, density used
  in lb/L instead of kg/L, ≈15 000 L short, glided to an emergency landing.
- **Laws, theories, principles.** Law = an observed regular pattern (Newton's laws
  → the jerk when a bus stops). Theory = an evidence-based explanation of why
  (atomic theory → how molecules form). Principle = a broad idea applied
  (conservation of energy → climbing stairs). A theory is **not** a guess.
- **Prediction.** How far a kicked football travels, how much CO₂ a reaction gives,
  how breathing changes when running. Example 1.2: Varsha's "dark clouds" made
  testable — humidity above 80%? wind speed and direction? temperature dropping as
  it did before recent rain? Weather forecasts fail because tiny differences grow.
  The eclipse-food claim dies on one question: what physical, chemical or
  biological mechanism could do that?
- **Estimation.** Example 1.3: 12–15 breaths/min × 1440 min ≈ 20 000 breaths/day;
  4–5 breaths fill a ~2 L balloon so one breath ≈ 0.5 L; ≈10 000 L/day.
  Cross-check: 3 balloons/min × 2 L × 1440 min ≈ 8 640 L. Rice: an adult needs
  ≈2000–2500 kcal/day — 100 g for a month is absurdly low, a few tonnes absurdly
  high.
- **No walls.** Climate change, medicines, sustainable technology need several
  branches. A mask needs physics (particle motion, electrostatic attraction),
  chemistry (polymer fibres), biology (virus size and behaviour) and mathematics
  (airflow and filtration efficiency).

---

# PART 8 — TRAPS SPECIFIC TO THIS CHAPTER

The main brief's twelve still apply. These are additional.

1. **Trusting Part 2 of the main brief and skipping the chapter.** It is not a
   preface. That is the whole reason this file exists.
2. **Inventing §1.1–§1.7** so the `bookRef`s look like every other chapter's.
   `Exploration §1`, seven times.
3. **Drawing the abstraction.** Boxes with words and arrows between them pass
   every automated gate and fail the only check that matters.
4. **A chapter of nothing but `camera` constructions.** Two `part` plates minimum.
5. **Paraphrasing too closely,** because there are no facts to hide behind.
6. **Carrying the book's second-person inspirational voice** into the prose.
7. **Adding a plate to section 4 or 5 for symmetry.** Leave them undiagrammed.
8. **Section 1 tagged with a bare `Exploration §1` and then "fixed"** by someone
   who thinks it is a typo. Leave a comment in the file saying it is correct.

---

# PART 9 — CHECKLIST DELTA

Use the main brief's Part 6 checklist in full, with these replacements:

- [ ] ~~Every section number confirmed by reading the PDF~~ → **there are none;
      every `bookRef` is `Exploration §1`**
- [ ] ~~Figure list with printed numbers written down~~ → **all four printed
      figures are photographs; the plate slate is invented (Part 2 above)**
- [ ] ~~Section 1 has a `sim`~~ → house convention, not a gate; do it anyway
- [ ] ~~Each section has a `note`~~ → gate is **≥ 4 notes**; aim for all seven
- [ ] 7 sections (or 6 via the stated merge), never 4 or 8
- [ ] ≥ 2 plates on `magnify: "part"`
- [ ] 8-gram overlap against `iesc101.pdf` run, zero unquoted runs ≥ 8 words
- [ ] Chapter 1 is **first** in `SCIENCE_CHAPTERS`
- [ ] `SCIENCE-CHAPTERS-PLAN.md` Part 2 corrected: Chapter 1 is content, and the
      remaining count is nine after this ships
