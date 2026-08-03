# Ready-to-run TARGET blocks for the chapters that already exist

Five chapters are already authored and shipping. Their **prose and questions are
done and pass validation** — what falls short of Chapter 2 is the artwork, and
in two places a missing figure or a missing section.

Each block below is a complete brief. To use one:

1. Paste `prompts/school-chapters/author-a-chapter.md` (everything below its
   `---`) into the model.
2. Replace its `## TARGET` block with one block from this file.
3. Paste in the named reference files.

These are **figure work**, not re-authoring: the model must not touch
`body`, `questions`, `note`, `bookRef`, section keys or the chapter's
`accent`/`estMinutes`. Say so — it will otherwise rewrite prose that is fine.

Ordering, matching the backlog in `TASKS.md`: **ch-03 first, then ch-05.** The
three maths blocks are additive and independent.

---

## 1 · `ch-03-tissues` — redraw the seven plates

**Scope:** rewrite `src/lib/cbse/class9/science/figures/ch-03.ts` only. Do not
modify `chapters/ch-03-tissues.ts` beyond imports, and change no prose or
questions. Chapter accent `#5ad1c0`.

**Reference to paste in:** `src/lib/cbse/class9/science/figures/ch-02-organelle-plates.ts`
(the shading model and shape-vocabulary rule) and
`src/lib/cbse/class9/science/figures/ch-02-cell-plate.ts` (organelle interiors).

Seven plates. Keep every `id`, `label`, `figNumber`, `title` and `viewBox` —
they are referenced by the chapter file. Raise each to the acceptance bar:

| Fig | Plate | Now | Do |
| --- | --- | --- | --- |
| 3.3 | Where a plant grows from | 3 parts, 0.7 layers/part, `part` | **Add parts** — split apical into root-tip and shoot-tip so the plate has ≥5. Give each meristem zone visible dividing cells (small, square, dense, a nucleus each) against the larger vacuolated cells around it. Keep the plant silhouette as `scenery`. |
| 3.8 | Simple permanent tissues | 3 panels, 1.3, `camera` | **Stays `camera`** — it is a comparison. Add per panel: a nucleus in each parenchyma cell and visible intercellular spaces; thickened *corners* on collenchyma (the corner thickening is the diagnostic feature); a thick lignified wall with a narrow dead lumen on sclerenchyma. Cells here are genuinely polygonal — do **not** round them off. |
| 3.9 | Xylem and phloem | 6 parts, 1.2, `part` | Add the diagnostics: annular/spiral lignin thickening bands on the vessel, tapered ends with pits on the tracheid, a **sieve plate with pores** on the sieve tube, dense cytoplasm plus a large nucleus in the companion cell. |
| 3.11 | Types of epithelial tissue | 4 panels, 2.3, `camera` | Already at the bar. Light pass only: a nucleus per cell where missing, and a basement membrane line under each panel. |
| 3.12 | Types of connective tissue | 4 panels, 3.0, `camera` | Already at the bar. Leave alone unless something reads wrong. |
| 3.13 | Types of muscle | 3 panels, 2.7, `camera` | Already at the bar. Check the striations read at rail size (~590px wide). |
| 3.14 | Structure of a neuron | 6 parts, **0.2, 17%** | **The worst plate in the repo — a bare outline.** Rebuild the interior: Nissl granules speckling the cell body, a nucleus with a nucleolus, myelin drawn as *discrete Schwann segments with nodes of Ranvier between them* (not one continuous sleeve), branching dendrites, and synaptic knobs holding vesicles at the nerve endings. |

**Watch:** the four `camera` plates are comparison plates — their parts *are*
their panels. Converting them to `"part"` clamps every lift to 1.35× and drops
the name tag onto the panel captions. This was tried and reverted.

---

## 2 · `ch-05-mixtures` — redraw the six plates

**Scope:** rewrite `src/lib/cbse/class9/science/figures/ch-05.ts` only. No prose,
no questions. Chapter accent `#f5b95f`.

**Reference to paste in:** `src/lib/cbse/class9/science/figures/ch-02-organelle-plates.ts`
— specifically the microscope, which is the worked example of **apparatus**:
manufactured things get `roundRect`/`stadium`/straight edges, and rounding them
off makes them toys.

| Fig | Plate | Now | Do |
| --- | --- | --- | --- |
| 5.23 | Solution, suspension and colloid | 3 panels, 2.3, `camera` | Already at the bar. **Stays `camera`.** Light pass only. |
| 5.24 | The Tyndall effect | 6 parts, 1.0, `part` | Add glassware realism: a `gleam()` highlight and a meniscus on both beakers, a reflector and switch on the torch body, and **speckle in the colloid beam** — the scattered light is the entire point of the figure. The clear beam must stay clean by contrast. |
| 5.22 | Separating the parts of blood | 5 parts, 0.4, 40% | Add: glass gleam and graduation marks on the tube, a meniscus on the plasma, a thin distinctly-coloured buffy coat with a few white cells in it, and **biconcave red-cell discs** packed at the bottom rather than a flat block of colour. |
| 5.12 | Distillation set-up | 7 parts, 0.9, 57% | Add: a blue inner cone in the burner flame, a liquid level with rising bubbles in the flask, a **mercury thread and a scale** on the thermometer, the water jacket and inner tube of the condenser drawn as two separate things, and droplets collecting in the receiver. Rubber-bung joints where glass meets glass. |
| 5.16 | Separating immiscible liquids | 7 parts, **0.1, 14%** | **Second-worst plate in the repo.** Add: a stopper at the top, glass gleam down the funnel body, a graduated stem, a visible **stopcock bore** (the tap turned to show the channel), droplets suspended at the boundary between the two layers, and a meniscus on each liquid. The two liquids need clearly different tints, not two shades of one. |
| 5.15 | Paper chromatography | 6 parts, 0.7, 50% | Add: a lid on the jar and a gleam on its glass, the **pencil baseline** (drawn in pencil, not ink — that is the teaching point), a solvent meniscus, and diffuse rather than hard-edged band boundaries. |

---

## 3 · `ch-01-coordinates` — add the reflections plate

**Scope:** append one `FigureSpec` to `src/lib/cbse/class9/maths/figures/ch-01.ts`
and reference it from the `reflections` section's `figures[]`. Accent `#9fb3ff`.

**This is maths — the detail bar does not apply.** Flat construction lines,
`magnify: "camera"`, no gleam, no blob outlines. A point lifted off its axes
stops meaning anything, which is why every maths plate stays on camera.

The `reflections` section (`Ganita Manjari §1.3`) currently has no figure.
Draw **"Reflecting a point in the axes"**, `viewBox` about `[660, 460]`,
`magnify: "camera"`:

- A labelled coordinate plane with all four quadrants.
- One point $P(3, 2)$ plus its three images: $(3, -2)$ reflected in the x-axis,
  $(-3, 2)$ in the y-axis, $(-3, -2)$ through the origin.
- Dashed perpendicular construction lines from each point to the mirror axis,
  with equal-length tick marks on both sides — the tick marks are what show the
  reflection rather than assert it.
- Use `notes[]` for the coordinate pairs. On a maths plate the numerals **are**
  the content, so they must stay on screen and scale while magnified — that is
  exactly what `notes[]` does and what `labelAt` does not.

Parts: `point-p`, `image-x`, `image-y`, `image-origin`, `x-axis`, `y-axis`.

---

## 4 · `ch-03-numbers` — add a place-value plate

**Scope:** append one `FigureSpec` to `src/lib/cbse/class9/maths/figures/ch-03.ts`
and reference it from `invention-of-zero`. Accent `#87e3cd`. **Maths — camera,
flat, no detail bar.**

The `invention-of-zero` section (`Ganita Manjari §3.2`) is 322 words with no
figure, and it is the most visual idea in the chapter. Draw **"Why zero had to
be invented"**, `viewBox` about `[660, 300]`, `magnify: "camera"`:

- Two rows of place-value columns (thousands / hundreds / tens / units),
  labelled.
- The top row shows a number written *without* a zero placeholder and therefore
  ambiguous; the bottom row shows the same digits with zero holding the empty
  column, resolving it.
- The empty column is the subject: give it a dashed outline in the top row and
  a solid `0` in the bottom.

Parts: `empty-column`, `zero-placeholder`, `place-columns`, `digits`. Use
`notes[]` for the numerals and `panels[]` for the two row captions.

---

## 5 · `ch-06-perimeter-area` — author the missing Area sections

**Scope:** this one **is** a content job, not a figure job — the only block here
that writes prose and questions. Accent `#ffc163`.

The chapter was retitled to "Measuring Space: Perimeter" because the Area half
of the printed chapter was never written. The file currently has 5 sections and
50 questions covering perimeter only.

Author the Area material and fold it in:

- **Retitle** to `"Measuring Space: Perimeter and Area"` and update `summary`.
- **Add 2 sections**, taking the chapter to 7 — the validator's maximum, so no
  more than two:
  1. `area-basics` — `Ganita Manjari §6.5` — area as counting unit squares, then
     the rectangle and triangle formulas.
  2. `area-by-dissection` — `Ganita Manjari §6.6` — rearranging a shape without
     changing its area; a parallelogram cut and slid into a rectangle; a circle
     cut into sectors and laid out into a near-rectangle to show $A = \pi r^2$.
- **Rebalance the question bank back to exactly 45–55 with the mix
  mcq 20 / tf 10 / multi 8 / quickfire 6 / open 6.** It is at 50 now, so adding
  questions for the two new sections means removing the same number of the
  weakest existing ones. Every section needs at least one question.
- **Add two figures** (maths register — flat, `camera`):
  - `"Area by counting unit squares"` — a shape on a unit grid with whole and
    part squares marked.
  - `"A circle cut into sectors"` — the classic dissection: a circle sliced into
    sectors, then the same sectors interleaved into a shape approaching a
    rectangle of height $r$ and width $\pi r$. Use `notes[]` for $r$ and $\pi r$.
- Update the chapter's `estMinutes` for the added reading.

**Careful:** `key` stays `ch-06-perimeter-area` — it is the URL and the
filename, and the route is statically generated from it.

---

## Verification for every block above

```bash
npx tsc --noEmit
npx tsx scripts/validate-cbse.mts
npx tsx scripts/render-figures.mts .figures
npx tsx scripts/render-figures.mts .figures --lift <partId>   # per reworked plate
NEXT_PUBLIC_SCHOOL_TRACK=1 npm run build
qlmanage -t -s 1100 -o png .figures/*.svg                     # then LOOK at them
```

A plate that passes all of these and still looks empty has failed. The numbers
in the acceptance-bar table are the check that catches that, and they are worth
running before claiming a plate is done.
