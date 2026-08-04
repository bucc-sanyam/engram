# The chapter workflow — start here

The runbook for turning one NCERT chapter into a page. Follow it top to bottom,
once per chapter. It is the entry point; the other three files are references it
sends you to.

| File | What it is |
| --- | --- |
| **CHAPTER-WORKFLOW.md** (this) | The steps, the gates, the traps. Read first. |
| `convert-the-books.md` | Inventory of all 21 chapters, running order, accents, section-mapping rules |
| `author-a-chapter.md` | The prompt you paste into a model — type contract, drawing rules, acceptance bar |
| `targets-existing-chapters.md` | Drop-in TARGET blocks for chapters that already exist |

---

## The rule that this workflow exists to enforce

**A chapter is not its `figures[]`. It is every diagram it renders.**

This was learned the expensive way. A brief was written to restyle Chapter 3's
and Chapter 5's plates. It worked — every plate went from a bare outline to full
interior detail and passed every automated gate. The pages still looked wrong,
because each of those chapters also had **section `sim`s** that the brief never
mentioned: four leftover flat cartoons that nobody had looked at. Three of the
four screenshots the owner sent back were `sim`s, not plates.

So: **audit what the page renders, not what you edited.** Step 2 below does it
mechanically, and it is not optional.

---

## Phase 0 — Before you touch anything

```bash
git -C . status --short          # working tree must be clean, or you will
                                 # mistake someone else's WIP for your own
npx tsc --noEmit && npx tsx scripts/validate-cbse.mts && npx tsx scripts/render-figures.mts .figures
```

All three must be green *before* you start, so any failure later is yours.

**Pick the chapter from `convert-the-books.md` §1** and take its accent from §4.
One chapter per run. Do not batch — a chapter is ~2,000 words, 50 questions and
3–6 plates that each need two or three visual iterations.

---

## Phase 1 — Read the printed chapter

```bash
B=.claude/Books
pdftotext "$B/iesc1dd/iesc104.pdf" -             # science ch4, reading order
pdftotext -f 3 -l 6 "$B/iemh1dd/iemh102.pdf" -   # maths ch2, pages 3–6
pdfinfo "$B/iesc1dd/iesc104.pdf"
```

Write down, before any code:

- **The exact printed title.** Take it from the running headers on interior
  pages. Page 1 is laid out around the "Think It Over" sidebar and extracts
  scrambled — trust it and you will name the chapter "Think It Over y How much
  distance".
- **The section numbers and headings**, confirmed by reading. A quick
  `grep '^[0-9]\.[0-9]'` misses several: some headings sit in their own text
  frame and never start a line. `bookRef` is regex-checked for *shape* only —
  nothing verifies §4.3 exists.
- **The figures**, with printed numbers and captions.
- **The worked examples and numbers** you will reuse.

⚠️ **Copyright.** Read the PDFs for facts; never reproduce artwork or prose.
One short attributed definition per section is the limit, and the validator's
2-sentence blockquote cap is the guardrail. Commit nothing derived from
`.claude/Books/`.

---

## Phase 2 — Inventory every diagram the chapter will render

Both `sim` and `figures[]` land in the same sticky rail. The distinction is
editorial, not visual: **`sim` is the section's hero, `figures[]` are its
supporting plates.** Two hard constraints from the validator:

- **Every chapter needs ≥ 3 `sim`s.**
- **Section 1 must have a `sim`.**

So the hero plate of a section goes in `sim`, and only extra plates go in
`figures[]`. Getting this backwards fails validation with
`"is missing a sim"` — which is what happens if you put everything in
`figures[]` because it feels tidier.

For an existing chapter, list what it renders today before changing anything:

```ts
// npx tsx a throwaway script
for (const ch of allChapters()) {
  for (const sec of ch.sections) {
    for (const spec of [sec.sim, ...(sec.figures ?? [])]) {
      if (!spec) continue;
      const parts = (spec as any).parts ?? [];
      const layers = parts.reduce((a: number, p: any) => a + (p.layers?.length ?? 0), 0);
      console.log(ch.key, sec.key, spec.kind, spec.title,
        parts.length, (layers / (parts.length || 1)).toFixed(1));
    }
  }
}
```

Anything with fewer than 5 parts or under 1.0 layers per part is a plate that
will look empty on the page. Fix it in this run or it ships.

---

## Phase 3 — Map the printed sections onto 5–7 app sections

**Hard limit: 5–7. The validator rejects 4 and 8.** The printed chapters run 3
to 10 numbered sections, so nearly every chapter needs a merge or a split. Rules
and worked cases are in `convert-the-books.md` §3 step 2.

---

## Phase 4 — Write the prose and the question bank

Rules in `author-a-chapter.md`. The constraints that are checked:

| | |
| --- | --- |
| Sections | 5–7 |
| Questions | 45–55, mix **fixed** at mcq 20 / tf 10 / multi 8 / quickfire 6 / open 6 |
| Coverage | every section has ≥1 question; every `section` field matches a real `Section.key` |
| `bookRef` | `/^(Exploration\|Ganita Manjari) §\d+(\.\d+)*$/` |
| Blockquote | ≤ 2 sentences or 300 characters |
| Body | no literal `\t` `\r` `\b` `\f` — write `\\text{}` in maths |

If you are adding to an existing chapter that is already at 50 questions,
**rebalance rather than grow** — the mix is exact, not a minimum.

---

## Phase 5 — Draw

Every labelled diagram is `kind: "figure"`. The old `anatomy` kind **no longer
exists** — its last four diagrams were redrawn as plates on 2026-08-04 and
`AnatomySim.tsx`, `AnatomySpec` and `AnatomyPart` were deleted. Available kinds
are `figure`, `worked-example`, `graph-plot`, `particle-model`, `geometry-board`.

Full drawing rules are in `author-a-chapter.md`. The acceptance bar, measured
from Chapter 2's ten plates:

| | Target |
| --- | --- |
| parts per plate | ≥ 5 |
| detail layers per part | ≥ 1.0 average |
| parts carrying ≥1 layer | ≥ 70% |
| `magnify` | `"part"` |
| blurb | 25–35 words |

**Exempt:** comparison plates (panels side by side) stay on `camera` and are
already dense; **maths and construction figures are exempt entirely** — flat
lines are the correct register and adding volume to a number line makes it
worse.

**Do not draw two diagrams of the same idea in one section.** Chapter 3 had a
meristem `sim` *and* a meristem plate in the same section; the reader got the
same content twice, once badly. Pick one and make it good.

---

## Phase 6 — Gates

```bash
npx tsc --noEmit
npx tsx scripts/validate-cbse.mts
npx tsx scripts/render-figures.mts .figures
npx tsx scripts/render-figures.mts .figures --lift <partId>   # per part-mode plate
NEXT_PUBLIC_SCHOOL_TRACK=1 npm run build
```

`render-figures.mts` audits labels running off the plate, overlapping labels,
focus boxes outside the viewBox and duplicate ids. **Its label check sizes text
at the worst-case 8.0 units/character** — it was 7.4, the average, and a
15-character label at x=110 audited clean and rendered with its first letter
shaved off. When it flags a label, move the label; do not widen the tolerance.

---

## Phase 7 — Look at it. This is the step that catches everything.

Nothing about a drawing is judgeable from its source, and every rule above
exists because something passed all of Phase 6 and still looked wrong.

```bash
qlmanage -t -s 1100 -o png .figures/*.svg     # macOS
```

Or serve them where a browser can reach them:

```bash
mkdir -p public/__figcheck && cp .figures/ch-04*.svg public/__figcheck/
# build a tiny index.html of <img> tags, open /__figcheck/index.html,
# then: rm -rf public/__figcheck
```

⚠️ The in-app preview pane reports `visibilityState === "hidden"`, which
throttles IntersectionObserver and rAF: **it stops painting below the fold**, so
a deep-scrolled screenshot comes back black and the sticky rail never swaps
sections. Put what you want to see at the top of the page, or assert against the
DOM instead.

Then load the real page and check, at 1440px and at 390px:

- [ ] Every section's rail shows its diagrams, and swaps as you scroll
- [ ] Every `part`-mode plate lifts a component cleanly — whole shapes, no
      slicing, tag readable, no stray copies left behind
- [ ] No horizontal scrollbar inside a figure card
- [ ] Nothing looks flat, grey, or like a placeholder

---

## Phase 8 — Wire, record, commit

```ts
// src/lib/cbse/class9/science/index.ts — in printed book order
import { ch04Motion } from "./chapters/ch-04-motion";
export const SCIENCE_CHAPTERS: Chapter[] = [ch02Cell, ch03Tissues, ch04Motion, ch05Mixtures];
```

**A chapter missing these two lines compiles, validates, and has no URL.**

Then: update `PROJECT_SUMMARY.md` if the architecture moved, append a
`SESSION_LOG.md` entry, tick `TASKS.md`, run `graphify update .`, and commit.

**Commit at the end of every chapter.** Uncommitted work in a worktree is
invisible to any other checkout and to every deploy — a completed restyle once
looked like "nothing happened" for exactly this reason.

---

## The traps, collected

1. **You only audited what you edited.** A section's `sim` is a diagram. Phase 2.
2. **Everything in `figures[]`, nothing in `sim`.** Fails validation: ≥3 sims per
   chapter, and section 1 needs one.
3. **`anatomy` is gone.** Use `figure`.
4. **Two diagrams of one idea in one section.** Pick one.
5. **A label that audits clean and renders clipped.** The check is worst-case
   now; if it fires, move the label.
6. **Section count 4 or 8.** Merge or split to 5–7.
7. **Question mix off by one.** It is exact. Rebalance, do not grow.
8. **Registry lines forgotten.** Compiles, validates, no URL.
9. **Uncommitted at the end.** Looks like nothing happened.
10. **Reported done on green gates alone.** Phase 7 is not optional.
