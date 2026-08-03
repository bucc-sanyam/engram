/**
 * Chapter 2 — the animal cell, drawn from scratch.
 *
 * ORIGINAL ARTWORK, same terms as the plant cell in ./ch-02-cell-plate.ts:
 * the anatomy is fact, the geometry and palette are generated here.
 *
 * DRAWN AS A DELIBERATE COUNTERPART. The two plates sit in the same section, so
 * they share the frame size, the palette, the shading model and the
 * interaction, and differ only where the biology differs. Every contrast a
 * learner is meant to notice is then a real one rather than a drawing accident:
 *
 *   • no cell wall — one thin membrane instead of the plant's three rings, and
 *     an irregular outline rather than a hexagon packed against its neighbours;
 *   • no chloroplasts;
 *   • several small vacuoles rather than one that fills the cell;
 *   • lysosomes and a centrosome, which the plant cell does not get.
 *
 * Interaction is `magnify: "part"` — clicking a component lifts THAT component
 * out of the cell, enlarged, leaving the cell in place behind it.
 */

import type { FigureSpec } from "@/lib/sim/types";
import { dots, folds, cisterna, tubule, blob, gleam, stadium } from "@/lib/sim/draw";

/* ── frame — matched to the plant cell so the pair reads as a pair ── */

const W = 800;
const H = 545;
const CX = 396;
const CY = 262;

/** An animal cell has nothing rigid holding its shape, so the outline is a
 *  wobbled closed curve. This is the one place on either plate where being
 *  visibly irregular is the correct answer rather than a flourish. */
const BODY = [1, 0.97, 1.03, 0.96, 1.02, 0.98, 1.04, 0.95, 1.01, 0.97];
const R_OUT = 184;
const R_MEMBRANE_IN = 177;
const R_CYTO = 170;

const outline = (r: number, reverse = false) =>
  blob(CX, CY, r, r * 0.86, reverse ? [...BODY].reverse() : BODY);

/* ── where everything sits ───────────────────────────────────────── */

const NUC = { cx: 474, cy: 224, r: 52 };
const NUCLEOLUS = { cx: 462, cy: 212, r: 18 };

const MITO: [number, number, number, number, number][] = [
  [300, 196, 34, 16, -30],
  [346, 344, 32, 15, 16],
];

const LYSO: [number, number, number][] = [
  [386, 168, 19],
  [518, 316, 17],
  [286, 288, 15],
];

const VESICLE: [number, number, number][] = [
  [250, 236, 21],
  [318, 264, 15],
];

/** The centrosome: a pair of short barrels at right angles. Animal cells have
 *  one and plant cells do not, which is the whole reason it is on this plate. */
const CENTRO = { cx: 372, cy: 214 };

const mitoPaths = MITO.map(([x, y, rx, ry, deg]) =>
  blob(x, y, rx, ry, [1, 0.94, 1.05, 0.95, 1.04, 0.94], deg),
).join(" ");

const cristaePaths = MITO.map(([x, y, rx, ry, deg]) =>
  folds(x, y, rx, ry, 6, deg, 1.55),
).join(" ");

/* ── palette — the shared one, minus everything green ────────────── */

const T = {
  membrane: "#f28c28",
  cytoplasm: "#f4dfa6",
  nucleus: "#a768cf",
  nucleolus: "#6f35a0",
  mitochondrion: "#dd6a38",
  golgi: "#d9558e",
  er: "#4f96d6",
  lysosome: "#8cc63f",
  vesicle: "#79c8e0",
  ribosome: "#3862ab",
  centrosome: "#8b7ad6",
};

/* ── the plate ───────────────────────────────────────────────────── */

export const animalCellPlate: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.10 (c)",
  title: "A typical animal cell",
  caption:
    "The same eukaryotic machinery as a plant cell, with no wall, no chloroplasts and only small vacuoles — plus lysosomes and a centrosome of its own.",
  altText:
    "A labelled cut-away of an animal cell with an irregular outline held only by its membrane. Inside are the nucleus with its nucleolus, two mitochondria with cristae, the Golgi apparatus, rough endoplasmic reticulum, three lysosomes, small vacuoles, a centrosome and free ribosomes. Selecting any component lifts it out of the cell, enlarged, and explains it.",
  viewBox: [W, H],
  magnify: "part",
  parts: [
    {
      id: "cell-membrane",
      label: "Cell membrane",
      tint: T.membrane,
      depth: 0,
      backdrop: true,
      d: `${outline(R_OUT)} ${outline(R_MEMBRANE_IN, true)}`,
      focus: [292, 96, 116, 82],
      labelAt: [174, 132],
      leaderAt: [330, 112],
      blurb:
        "The cell's only boundary — there is no wall outside it. Nothing rigid holds the shape, which is why an animal cell can squeeze, crawl and change form as its tissue moves.",
    },
    {
      id: "cytoplasm",
      label: "Cytoplasm",
      tint: T.cytoplasm,
      depth: 1,
      backdrop: true,
      d: outline(R_CYTO),
      layers: [
        // Only a `light` layer can lift a fill past the renderer's fixed
        // lightness; without it the cytoplasm sits behind everything as mud.
        { d: outline(R_CYTO), as: "light" },
        // Cytoskeleton — with no wall, this scaffold is what shape there is.
        {
          d:
            "M286,214 C344,258 372,340 330,396 M470,158 C512,232 548,286 528,364 " +
            "M262,282 C334,306 414,312 486,342",
          as: "stroke",
          width: 1.1,
          opacity: 0.32,
          dash: "6 7",
        },
      ],
      focus: [268, 372, 66, 50],
      labelAt: [174, 424],
      leaderAt: [316, 386],
      blurb:
        "The jelly-like fluid every organelle sits in, threaded with a scaffold of fine fibres. Without a wall to push against, that scaffold is what gives the cell what shape it has.",
    },
    {
      id: "nucleus",
      label: "Nucleus",
      tint: T.nucleus,
      depth: 2,
      d: blob(NUC.cx, NUC.cy, NUC.r, NUC.r * 0.96, [1, 0.98, 1.02, 0.98, 1.01, 0.98, 1.02, 0.99]),
      layers: [
        {
          d:
            `M${NUC.cx - 28},${NUC.cy - 6} C${NUC.cx - 13},${NUC.cy - 25} ${NUC.cx + 8},${NUC.cy + 13} ${NUC.cx + 29},${NUC.cy - 8} ` +
            `M${NUC.cx - 25},${NUC.cy + 19} C${NUC.cx - 8},${NUC.cy + 2} ${NUC.cx + 11},${NUC.cy + 32} ${NUC.cx + 28},${NUC.cy + 13}`,
          as: "stroke",
          width: 1.5,
          opacity: 0.5,
        },
        {
          d: blob(NUC.cx, NUC.cy, NUC.r - 6, NUC.r * 0.96 - 6, [1, 0.98, 1.02, 0.98, 1.01, 0.98, 1.02, 0.99]),
          as: "stroke",
          width: 1.4,
          opacity: 0.75,
        },
        {
          d: dots(
            [8, 62, 124, 176, 226, 300].map((deg) => {
              const a = (deg * Math.PI) / 180;
              return [
                NUC.cx + Math.cos(a) * (NUC.r - 3),
                NUC.cy + Math.sin(a) * (NUC.r * 0.96 - 3),
              ] as [number, number];
            }),
            4.2,
          ),
          as: "shade",
        },
        { d: gleam(NUC.cx, NUC.cy, NUC.r, NUC.r), as: "light", opacity: 0.4 },
      ],
      focus: [NUC.cx - NUC.r, NUC.cy - NUC.r, NUC.r * 2, NUC.r * 2],
      labelAt: [618, 196],
      leaderAt: [524, 210],
      blurb:
        "The control centre, wrapped in a double envelope pierced by pores. In an animal cell it usually sits near the middle, rather than being shoved to one side by a vacuole.",
    },
    {
      id: "nucleolus",
      label: "Nucleolus",
      tint: T.nucleolus,
      depth: 3,
      d: blob(NUCLEOLUS.cx, NUCLEOLUS.cy, NUCLEOLUS.r, NUCLEOLUS.r * 0.94, [1, 0.94, 1.06, 0.95, 1.04, 0.96]),
      layers: [
        // Same hue family as its parent, and the renderer pins every fill to
        // one lightness — a `shade` self-layer is the only way it recedes.
        {
          d: blob(NUCLEOLUS.cx, NUCLEOLUS.cy, NUCLEOLUS.r, NUCLEOLUS.r * 0.94, [1, 0.94, 1.06, 0.95, 1.04, 0.96]),
          as: "shade",
        },
      ],
      focus: [NUCLEOLUS.cx - NUCLEOLUS.r, NUCLEOLUS.cy - NUCLEOLUS.r, NUCLEOLUS.r * 2, NUCLEOLUS.r * 2],
      labelAt: [618, 240],
      leaderAt: [NUCLEOLUS.cx + 12, NUCLEOLUS.cy - 6],
      blurb:
        "The dense round body inside the nucleus. Ribosomal subunits are assembled here, then leave through the nuclear pores to do their work out in the cytoplasm.",
    },
    {
      id: "mitochondria",
      label: "Mitochondria",
      tint: T.mitochondrion,
      depth: 4,
      d: mitoPaths,
      layers: [
        { d: cristaePaths, as: "stroke", width: 1.5, opacity: 0.85 },
        { d: gleam(MITO[0][0], MITO[0][1], MITO[0][2], MITO[0][3], -44), as: "light", opacity: 0.45 },
      ],
      focus: [MITO[0][0] - 40, MITO[0][1] - 26, 80, 52],
      labelAt: [174, 190],
      leaderAt: [MITO[0][0] - 24, MITO[0][1] + 2],
      blurb:
        "Where sugar is broken down to release energy. An animal cell cannot make its own food, so every mitochondrion here is running on sugar the animal ate.",
    },
    {
      id: "er",
      label: "Endoplasmic reticulum",
      tint: T.er,
      depth: 5,
      d: [
        tubule(408, 296, 494, 10, 8),
        tubule(414, 315, 500, -11, 8),
        tubule(408, 334, 488, 9, 8),
      ].join(" "),
      layers: [
        {
          d: dots(
            [
              [426, 294], [452, 300], [476, 294],
              [432, 333], [458, 339], [478, 332],
            ],
            3,
          ),
          as: "shade",
        },
      ],
      focus: [400, 284, 108, 66],
      labelAt: [618, 336],
      leaderAt: [500, 320],
      blurb:
        "A network of folded membrane channels running out from the nuclear envelope. It carries materials across the cell, and the studded stretches are where proteins get assembled.",
    },
    {
      id: "golgi",
      label: "Golgi apparatus",
      tint: T.golgi,
      depth: 6,
      d: [
        cisterna(300, 314, 36, 13, 8),
        cisterna(300, 332, 30, 11, 8),
        cisterna(300, 348, 25, 10, 8),
      ].join(" "),
      layers: [{ d: dots([[254, 318], [262, 344], [348, 306]], 5), as: "fill" }],
      focus: [258, 300, 88, 60],
      labelAt: [174, 306],
      leaderAt: [272, 322],
      blurb:
        "A stack of flattened sacs that packages materials made elsewhere in the cell and ships them out in bubbles. In an animal cell it also builds the lysosomes.",
    },
    {
      id: "lysosomes",
      label: "Lysosomes",
      tint: T.lysosome,
      depth: 7,
      d: LYSO.map(([x, y, r]) => blob(x, y, r, r * 0.92, [1, 0.93, 1.06, 0.94, 1.05, 0.95])).join(" "),
      layers: [
        {
          d: LYSO.map(([x, y, r]) =>
            dots(
              [
                [x - r * 0.32, y - r * 0.1],
                [x + r * 0.26, y + r * 0.22],
                [x + r * 0.1, y - r * 0.36],
              ],
              2.4,
            ),
          ).join(" "),
          as: "shade",
        },
        { d: gleam(LYSO[0][0], LYSO[0][1], LYSO[0][2], LYSO[0][2]), as: "light", opacity: 0.45 },
      ],
      focus: [LYSO[0][0] - 24, LYSO[0][1] - 24, 48, 48],
      labelAt: [618, 132],
      leaderAt: [LYSO[0][0] + 14, LYSO[0][1] - 10],
      blurb:
        "Bags of digestive enzymes that break down worn-out parts and anything the cell has swallowed. They are sometimes called suicide bags, because bursting one destroys the cell.",
    },
    {
      id: "vacuoles",
      label: "Small vacuoles",
      tint: T.vesicle,
      depth: 8,
      d: VESICLE.map(([x, y, r]) => blob(x, y, r, r * 0.9, [1, 0.95, 1.04, 0.96, 1.03, 0.95])).join(" "),
      layers: [
        { d: gleam(VESICLE[0][0], VESICLE[0][1], VESICLE[0][2], VESICLE[0][2]), as: "light", opacity: 0.5 },
      ],
      focus: [VESICLE[0][0] - 26, VESICLE[0][1] - 26, 52, 52],
      labelAt: [174, 248],
      leaderAt: [VESICLE[0][0] - 16, VESICLE[0][1] + 4],
      blurb:
        "Small storage sacs, several of them, holding water and waste. Compare the plant cell, where one vacuole swells until it fills most of the cell and props the whole plant up.",
    },
    {
      id: "centrosome",
      label: "Centrosome",
      tint: T.centrosome,
      depth: 9,
      d: [
        stadium(CENTRO.cx - 16, CENTRO.cy - 5, 30, 11),
        stadium(CENTRO.cx - 4, CENTRO.cy - 20, 11, 30),
      ].join(" "),
      focus: [CENTRO.cx - 24, CENTRO.cy - 24, 48, 48],
      blurb:
        "A pair of short barrels sitting at right angles near the nucleus. When the cell divides they organise the fibres that pull the chromosomes apart. Plant cells manage without one.",
    },
    {
      id: "ribosomes",
      label: "Ribosomes",
      tint: T.ribosome,
      depth: 10,
      d: dots(
        [
          [330, 240],
          [286, 342],
          [420, 200],
          [516, 264],
          [368, 388],
        ],
        5.4,
      ),
      focus: [318, 228, 26, 26],
      labelAt: [618, 400],
      leaderAt: [378, 388],
      blurb:
        "Tiny granules where proteins are actually assembled, following instructions sent out from the nucleus. They either float free in the cytoplasm or sit studded on the endoplasmic reticulum.",
    },
  ],
};
