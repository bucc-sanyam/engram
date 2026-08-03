/**
 * Chapter 2 — everything the plant and animal cell plates don't cover.
 *
 * ORIGINAL ARTWORK, same terms as ./ch-02-cell-plate.ts. These eight replace
 * the NCERT page scans the chapter used to mount, which is what clears the
 * licensing question for this chapter outright.
 *
 * Drawn in the same cartoon register as the two cell plates and interactive on
 * the same terms (`magnify: "part"` — clicking a component lifts it out,
 * enlarged and tagged, leaving the rest of the scene in place behind it).
 *
 * THE ONE RULE THAT DECIDES SHAPE VOCABULARY: use the primitive the thing
 * actually is. A microscope is manufactured, so `stadium` and `roundRect` are
 * correct for it and rounding them off would make it look like a toy. An
 * organelle is grown, so it gets `blob`. Getting this backwards is what made
 * the earlier plates read as boxes — and a blanket "make everything organic"
 * pass was tried in this repo and reverted for the same reason.
 *
 * COLOUR: `cartoonFor()` pins lightness and reads a tint for hue + saturation
 * only. A darker hex does NOT darken a shape — use a `shade` self-layer to
 * recede inside a same-hue parent, and a full-coverage `light` layer to go pale.
 */

import type { FigureSpec } from "@/lib/sim/types";
import {
  circle,
  ellipse,
  dots,
  folds,
  discStack,
  tubule,
  roundRect,
  stadium,
  blob,
  gleam,
} from "@/lib/sim/draw";

const T = {
  metal: "#9fb0c4",
  brass: "#d9a441",
  glass: "#8fd0e8",
  stand: "#7c8a9c",
  mirror: "#cfd9e6",
  wall: "#6faa46",
  membrane: "#f28c28",
  cytoplasm: "#f4dfa6",
  nucleoid: "#d8568f",
  plasmid: "#b56ad0",
  ribosome: "#3862ab",
  flagellum: "#8a9bb0",
};

/* The membrane palette is separate — the bilayer needs three related hues that
   do not collide with anything in the cell plates. */
const M = {
  head: "#9b7ad6",
  tail: "#e0c86a",
  channel: "#5fc0e0",
  surface: "#4f9ad6",
  carb: "#e0603f",
};

const N = {
  envelope: "#a768cf",
  nucleoplasm: "#c58ade",
  chromatin: "#8548b0",
  nucleolus: "#6f35a0",
  er: "#e0705a",
  pore: "#5f2f8a",
};

const O = {
  outer: "#e0a03f",
  inner: "#dd5f7f",
  matrix: "#ef8f6a",
  dna: "#4f7fd0",
  ribosome: "#3862ab",
};

const C = {
  outer: "#3f9c4a",
  inner: "#7fc94f",
  grana: "#2f7a3a",
  stroma: "#bfe07a",
  dna: "#4f7fd0",
};

const D = {
  cell: "#e0607f",
  nucleus: "#b06fd0",
  chromosome: "#5f7fd0",
  dna: "#e0a03f",
};

const X = {
  cell: "#c98fd0",
  nucleus: "#8548b0",
  chromosome: "#a03f7f",
  spindle: "#7f6fc0",
  wall: "#8fbf5e",
};

/* ════════════════════════════════════════════ Fig. 2.2 — the microscope ══ */

export const microscopeFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.2",
  title: "Structure of a light microscope",
  caption:
    "Two lenses in line: the objective magnifies the specimen, the eyepiece magnifies that image again. Their powers multiply.",
  altText:
    "A side view of a compound light microscope: eyepiece at the top of the body tube, a nosepiece carrying the objective lens above the stage, the mirror below it, the coarse and fine focusing knobs on the curved arm, and the heavy base. Selecting any part lifts it out, enlarged, and explains it.",
  viewBox: [660, 470],
  magnify: "part",
  scenery: [
    // The arm — context that ties the parts together, never clickable.
    {
      d: "M250,398 C226,340 234,254 292,222 L312,252 C270,278 262,342 282,398 Z",
      as: "fill",
      tint: T.stand,
    },
    {
      d: "M250,398 C226,340 234,254 292,222 L312,252 C270,278 262,342 282,398 Z",
      as: "stroke",
      width: 1.4,
      opacity: 0.7,
      tint: T.stand,
    },
  ],
  parts: [
    {
      id: "eyepiece",
      label: "Eyepiece",
      tint: T.metal,
      depth: 0,
      d: stadium(306, 44, 42, 58),
      layers: [
        { d: ellipse(327, 50, 19, 7), as: "light" },
        { d: gleam(327, 73, 21, 29), as: "light", opacity: 0.5 },
      ],
      focus: [300, 38, 54, 70],
      labelAt: [528, 58],
      leaderAt: [350, 66],
      blurb:
        "The lens you look through, usually marked 10X. It magnifies the image the objective has already formed, so a 10X eyepiece over a 40X objective gives 400X in total.",
    },
    {
      id: "body-tube",
      label: "Body tube",
      tint: T.metal,
      depth: 1,
      d: roundRect(304, 100, 46, 122, 10),
      layers: [{ d: gleam(327, 161, 23, 61), as: "light", opacity: 0.45 }],
      focus: [298, 96, 58, 132],
      labelAt: [528, 132],
      leaderAt: [352, 150],
      blurb:
        "The tube holding the eyepiece above the objective. It fixes the distance between the two lenses, which is what keeps the magnified image sharp once you have focused.",
    },
    {
      id: "objective",
      label: "Objective lens",
      tint: T.brass,
      depth: 2,
      // The revolving nosepiece and the barrel hanging off it. Both are
      // machined brass, so both are flat-sided (SHAPE VOCABULARY, top of file).
      // Drawn as a `blob` cap on a round-ended `stadium` this read as a
      // mushroom: the cap was near twice the width of the tube it hangs from
      // and the barrel had no taper and no lens at its tip.
      d: [
        roundRect(293, 221, 68, 25, 7),
        "M313,246 H341 L334,287 H320 Z",
      ].join(" "),
      layers: [
        { d: gleam(327, 233, 34, 12), as: "light", opacity: 0.4 },
        { d: gleam(325, 268, 13, 20), as: "light", opacity: 0.45 },
        // The magnification ring every objective is banded with. After the
        // gleam, or the highlight washes it out.
        { d: "M314.3,254 H339.7 L338,264 H316 Z", as: "shade" },
        // The lens itself, looking down at the slide.
        { d: ellipse(327, 285, 6, 2.6), as: "light" },
      ],
      focus: [289, 217, 76, 78],
      labelAt: [528, 214],
      leaderAt: [362, 232],
      blurb:
        "The lens closest to the specimen, and the one doing the real magnifying. A rotating nosepiece carries several — typically 10X and 40X — so you can change power without moving the slide.",
    },
    {
      id: "stage",
      label: "Stage",
      tint: T.stand,
      depth: 3,
      d: roundRect(230, 304, 180, 20, 5),
      layers: [
        // The hole light passes up through, and the clips holding the slide.
        { d: ellipse(320, 314, 26, 6), as: "panel" },
        { d: [roundRect(252, 296, 26, 8, 3), roundRect(366, 296, 26, 8, 3)].join(" "), as: "shade" },
      ],
      focus: [224, 290, 192, 42],
      labelAt: [528, 300],
      leaderAt: [412, 312],
      blurb:
        "The flat platform the slide rests on, with clips to stop it sliding. The hole in its middle lets light from below pass up through the specimen and into the objective.",
    },
    {
      id: "mirror",
      label: "Mirror",
      tint: T.mirror,
      depth: 4,
      d: circle(300, 368, 27),
      layers: [
        { d: gleam(300, 368, 27, 27, -34), as: "light", opacity: 0.6 },
        { d: "M300,395 V410", as: "stroke", width: 3.4 },
      ],
      focus: [268, 336, 64, 78],
      labelAt: [528, 372],
      leaderAt: [328, 366],
      blurb:
        "Tilts to catch room light and throw it up through the hole in the stage. Getting this angle right is why a slide can look blank one moment and perfectly lit the next.",
    },
    {
      id: "coarse-knob",
      label: "Coarse adjustment",
      tint: T.metal,
      depth: 5,
      d: circle(254, 258, 28),
      layers: [
        { d: circle(254, 258, 12), as: "shade" },
        { d: gleam(254, 258, 28, 28), as: "light", opacity: 0.45 },
      ],
      focus: [222, 226, 64, 64],
      labelAt: [132, 232],
      leaderAt: [226, 254],
      blurb:
        "The large knob, moving the tube through a wide range to bring the specimen roughly into view. Use it first and only at low power, or the objective can strike the slide.",
    },
    {
      id: "fine-knob",
      label: "Fine adjustment",
      tint: T.metal,
      depth: 6,
      d: circle(250, 306, 15),
      layers: [{ d: circle(250, 306, 6), as: "shade" }],
      focus: [230, 286, 40, 40],
      labelAt: [132, 300],
      leaderAt: [234, 306],
      blurb:
        "The small knob, for the last fraction of a millimetre. Once the coarse knob has the specimen roughly in view, this brings a single layer of cells into crisp focus.",
    },
    {
      id: "base",
      label: "Base",
      tint: T.stand,
      depth: 7,
      d: blob(300, 412, 112, 22, [1, 0.97, 1.02, 0.98, 1.01, 0.98]),
      layers: [{ d: gleam(300, 412, 112, 22), as: "light", opacity: 0.4 }],
      focus: [186, 388, 228, 48],
      labelAt: [132, 412],
      leaderAt: [196, 410],
      blurb:
        "The heavy foot that keeps the instrument from toppling. Always carry a microscope by the arm with your other hand underneath this.",
    },
  ],
};

/* ══════════════════════════════════════ Fig. 2.10 (a) — bacterial cell ══ */

export const bacterialCellFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.10 (a)",
  title: "A typical bacterial cell",
  caption:
    "A prokaryotic cell: no nucleus and no membrane-bound organelles at all. Everything happens in one shared compartment.",
  altText:
    "A rod-shaped bacterial cell cut away to show its wall, the membrane inside it, the cytoplasm, a coiled nucleoid of circular DNA, a small separate plasmid ring, scattered ribosomes, and a whip-like flagellum trailing from one end. Selecting any part lifts it out, enlarged, and explains it.",
  viewBox: [660, 360],
  magnify: "part",
  scenery: [
    // The flagellum's trailing wave — the part itself is the thick stroke.
    {
      d: "M156,190 C120,168 104,206 78,196 C52,186 44,214 28,206",
      as: "stroke",
      width: 5,
      tint: T.flagellum,
      opacity: 0.9,
    },
  ],
  parts: [
    {
      id: "cell-wall",
      label: "Cell wall",
      tint: T.wall,
      depth: 0,
      backdrop: true,
      d: blob(348, 186, 172, 78, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98]),
      layers: [{ d: gleam(348, 186, 172, 78), as: "light", opacity: 0.4 }],
      focus: [190, 116, 96, 70],
      labelAt: [132, 108],
      leaderAt: [216, 138],
      blurb:
        "A tough outer jacket that gives the cell its rod shape and stops it bursting. It is chemically unlike a plant's cellulose wall, which is why some antibiotics attack it and leave your cells alone.",
    },
    {
      id: "membrane",
      label: "Cell membrane",
      tint: T.membrane,
      depth: 1,
      backdrop: true,
      d: `${blob(348, 186, 158, 66, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98])} ${blob(348, 186, 150, 59, [0.98, 1.02, 0.99, 1.01, 0.98, 1.02, 0.99, 1].reverse())}`,
      focus: [470, 150, 60, 72],
      labelAt: [528, 118],
      leaderAt: [486, 162],
      blurb:
        "The selectively permeable layer just inside the wall. In a bacterium it does jobs that a plant or animal cell hands to organelles, because there are no organelles here to hand them to.",
    },
    {
      id: "cytoplasm",
      label: "Cytoplasm",
      tint: T.cytoplasm,
      depth: 2,
      backdrop: true,
      d: blob(348, 186, 150, 59, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98]),
      layers: [{ d: blob(348, 186, 150, 59, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98]), as: "light" }],
      focus: [252, 216, 76, 40],
      labelAt: [132, 268],
      leaderAt: [274, 226],
      blurb:
        "One undivided compartment holding everything the cell owns. With no internal membranes to keep reactions apart, a bacterium stays small — and divides very fast.",
    },
    {
      id: "nucleoid",
      label: "Nucleoid",
      tint: T.nucleoid,
      depth: 3,
      d: "M292,168 C268,150 268,208 304,204 C340,200 316,152 350,158 C384,164 358,212 392,200 C420,190 404,154 380,166",
      layers: [
        {
          d: "M292,168 C268,150 268,208 304,204 C340,200 316,152 350,158 C384,164 358,212 392,200 C420,190 404,154 380,166",
          as: "stroke",
          width: 9,
        },
      ],
      focus: [268, 142, 160, 78],
      labelAt: [528, 190],
      leaderAt: [404, 186],
      blurb:
        "The bacterial genetic material — a single circular DNA molecule lying loose in the cytoplasm. It is called a nucleoid rather than a nucleus precisely because no membrane encloses it.",
    },
    {
      id: "plasmid",
      label: "Plasmid",
      tint: T.plasmid,
      depth: 4,
      d: `${circle(432, 224, 17)} ${circle(432, 224, 10)}`,
      focus: [410, 202, 44, 44],
      labelAt: [528, 246],
      leaderAt: [449, 224],
      blurb:
        "A small extra ring of DNA, separate from the nucleoid and copied independently. Plasmids often carry antibiotic resistance, and bacteria can pass them to one another.",
    },
    {
      id: "ribosomes",
      label: "Ribosomes",
      tint: T.ribosome,
      depth: 5,
      d: dots(
        [
          [268, 200],
          [312, 226],
          [372, 224],
          [420, 168],
          [452, 196],
          [296, 148],
        ],
        6,
      ),
      focus: [256, 188, 24, 24],
      labelAt: [132, 214],
      leaderAt: [262, 202],
      blurb:
        "Granules where proteins are assembled. A bacterium has plenty, and they are small enough to be different from yours — which is exactly what some antibiotics target.",
    },
    {
      id: "flagellum",
      label: "Flagellum",
      tint: T.flagellum,
      depth: 6,
      d: `${blob(176, 188, 22, 13, [1, 0.94, 1.05, 0.95, 1.04, 0.96])} ${circle(196, 188, 8)}`,
      focus: [148, 162, 66, 52],
      labelAt: [132, 150],
      leaderAt: [166, 178],
      blurb:
        "A whip-like thread that rotates like a propeller to drive the cell through liquid. Not every bacterium has one, and nothing in the plant or animal cell corresponds to it.",
    },
  ],
};

/* ═════════════════════════════════════ Fig. 2.7 — the cell membrane ══ */

/** One row of phospholipid heads with their tails hanging toward `dir`. */
function lipidRow(x0: number, x1: number, y: number, step: number, dir: 1 | -1) {
  const heads: [number, number][] = [];
  const tails: string[] = [];
  for (let x = x0; x <= x1; x += step) {
    heads.push([x, y]);
    const t = y + dir * 34;
    tails.push(
      `M${x - 3},${y + dir * 9} C${x - 8},${y + dir * 20} ${x - 1},${y + dir * 24} ${x - 4},${t}`,
      `M${x + 3},${y + dir * 9} C${x + 8},${y + dir * 20} ${x + 1},${y + dir * 24} ${x + 4},${t}`,
    );
  }
  return { heads, tails: tails.join(" ") };
}

const upper = lipidRow(126, 534, 128, 24, 1);
const lower = lipidRow(126, 534, 214, 24, -1);

export const membraneFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.7",
  title: "Structure of a cell membrane",
  caption:
    "The fluid-mosaic model: two layers of lipid with proteins floating in them, all of it drifting sideways all the time.",
  altText:
    "A cut-away of the cell membrane showing two layers of phospholipid laid tail to tail — rounded heads facing the watery outside and inside, oily tails meeting in the middle — with a channel protein spanning the full thickness, a protein sitting on one surface, and a carbohydrate chain branching off the outer face. Selecting any part lifts it out, enlarged, and explains it.",
  viewBox: [660, 330],
  magnify: "part",
  parts: [
    {
      id: "heads",
      label: "Water-loving heads",
      tint: M.head,
      depth: 0,
      d: `${dots(upper.heads, 11)} ${dots(lower.heads, 11)}`,
      layers: [{ d: dots(upper.heads.slice(0, 4), 4), as: "light", opacity: 0.6 }],
      focus: [116, 116, 60, 26],
      labelAt: [132, 76],
      leaderAt: [150, 120],
      blurb:
        "The rounded ends face outwards, towards the watery fluid inside and outside the cell. Being attracted to water is what holds the two sheets in the right orientation with nothing gluing them.",
    },
    {
      id: "tails",
      label: "Water-repelling tails",
      tint: M.tail,
      depth: 1,
      d: `${upper.tails} ${lower.tails}`,
      layers: [
        { d: upper.tails, as: "stroke", width: 2.4 },
        { d: lower.tails, as: "stroke", width: 2.4 },
      ],
      focus: [116, 142, 60, 58],
      labelAt: [132, 288],
      leaderAt: [150, 176],
      blurb:
        "The wavy chains point inwards, away from water, forming an oily core. That core is the actual barrier — it is what turns the membrane into a selective gate rather than an open sieve.",
    },
    {
      id: "channel",
      label: "Channel protein",
      tint: M.channel,
      depth: 2,
      d: [
        blob(268, 171, 26, 62, [1, 0.9, 1.04, 0.88, 1.06, 0.9]),
        blob(330, 171, 26, 62, [1, 0.88, 1.06, 0.9, 1.04, 0.88]),
      ].join(" "),
      layers: [
        { d: gleam(268, 171, 26, 62), as: "light", opacity: 0.45 },
        { d: gleam(330, 171, 26, 62), as: "light", opacity: 0.45 },
      ],
      focus: [236, 104, 126, 134],
      labelAt: [528, 106],
      leaderAt: [300, 140],
      blurb:
        "A protein spanning the full thickness of the membrane with a passage through its middle. These are the gatekeepers: whatever cannot cross the oily core goes through a channel instead.",
    },
    {
      id: "surface-protein",
      label: "Surface protein",
      tint: M.surface,
      depth: 3,
      d: blob(432, 126, 38, 22, [1, 0.92, 1.06, 0.94, 1.04, 0.93]),
      layers: [{ d: gleam(432, 126, 38, 22), as: "light", opacity: 0.5 }],
      focus: [390, 100, 84, 54],
      labelAt: [528, 176],
      leaderAt: [462, 128],
      blurb:
        "Sits on one face rather than crossing over. Proteins are not pinned down: they and the lipids around them drift sideways through the layer, which is why the model is called fluid.",
    },
    {
      id: "carbohydrate",
      label: "Carbohydrate chain",
      tint: M.carb,
      depth: 4,
      d: dots(
        [
          [186, 96],
          [174, 72],
          [200, 66],
          [162, 50],
          [212, 44],
        ],
        9,
      ),
      layers: [
        {
          d: "M186,96 L174,72 M186,96 L200,66 M174,72 L162,50 M200,66 L212,44",
          as: "stroke",
          width: 2.6,
        },
      ],
      focus: [148, 32, 80, 78],
      labelAt: [528, 46],
      leaderAt: [222, 52],
      blurb:
        "Branching sugar chains attached to the outer surface only. They act as identity markers, letting one cell recognise another — which is how your body tells its own cells from an invader.",
    },
  ],
};

/* ═════════════════════════════════════════ Fig. 2.11 — the nucleus ══ */

const NUC = { cx: 322, cy: 190, r: 128 };
/** Pores, spaced around the envelope. */
const poreAngles = [-72, -28, 16, 62, 120, 168, 208, 250];
const porePts = poreAngles.map((deg) => {
  const a = (deg * Math.PI) / 180;
  return [NUC.cx + Math.cos(a) * NUC.r, NUC.cy + Math.sin(a) * NUC.r] as [number, number];
});

export const nucleusFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.11",
  title: "Structure of a nucleus",
  caption:
    "A double membrane full of holes, wrapped around the cell's instructions. The holes are the point: the nucleus has to talk to the cytoplasm constantly.",
  altText:
    "A cut-away nucleus: a double envelope pierced by pores, the threadlike chromatin filling the space inside, the dense nucleolus near its centre, and the endoplasmic reticulum spreading away from the envelope. Selecting any part lifts it out, enlarged, and explains it.",
  viewBox: [660, 460],
  magnify: "part",
  parts: [
    {
      id: "envelope",
      label: "Nuclear envelope",
      tint: N.envelope,
      depth: 0,
      backdrop: true,
      d: `${circle(NUC.cx, NUC.cy, NUC.r)} ${circle(NUC.cx, NUC.cy, NUC.r - 14)}`,
      layers: [
        { d: circle(NUC.cx, NUC.cy, NUC.r - 7), as: "stroke", width: 1.2, opacity: 0.7, dash: "8 6" },
      ],
      focus: [NUC.cx - 150, 44, 96, 76],
      labelAt: [132, 74],
      leaderAt: [230, 100],
      blurb:
        "Two membranes, one inside the other, separating the nucleus from the cytoplasm. Having a true envelope like this is what makes a cell eukaryotic — a bacterium's DNA has none.",
    },
    {
      id: "nucleoplasm",
      label: "Nucleoplasm",
      tint: N.nucleoplasm,
      depth: 1,
      backdrop: true,
      d: circle(NUC.cx, NUC.cy, NUC.r - 14),
      layers: [{ d: circle(NUC.cx, NUC.cy, NUC.r - 14), as: "light" }],
      focus: [NUC.cx - 40, NUC.cy + 62, 80, 44],
      labelAt: [132, 300],
      leaderAt: [268, 268],
      blurb:
        "The jelly filling the nucleus, in which the chromatin and the nucleolus sit. Everything the nucleus assembles has to travel out through this and then through a pore.",
    },
    {
      id: "pores",
      label: "Nuclear pores",
      tint: N.pore,
      depth: 2,
      d: dots(porePts, 13),
      layers: [{ d: dots(porePts, 6), as: "panel", opacity: 0.9 }],
      focus: [porePts[0][0] - 22, porePts[0][1] - 22, 44, 44],
      labelAt: [528, 96],
      leaderAt: [porePts[0][0] + 8, porePts[0][1] - 6],
      blurb:
        "Openings through both membranes. Ribosomal subunits made inside leave this way, and the signals that tell the nucleus what to build come in the same way.",
    },
    {
      id: "chromatin",
      label: "Chromatin",
      tint: N.chromatin,
      depth: 3,
      d: [
        tubule(238, 132, 404, 20, 9),
        tubule(230, 186, 412, -22, 9),
        tubule(244, 240, 398, 18, 9),
      ].join(" "),
      layers: [
        {
          d: [
            tubule(238, 132, 404, 20, 9),
            tubule(230, 186, 412, -22, 9),
            tubule(244, 240, 398, 18, 9),
          ].join(" "),
          as: "shade",
          opacity: 0.45,
        },
      ],
      focus: [226, 176, 192, 44],
      labelAt: [528, 196],
      leaderAt: [408, 190],
      blurb:
        "The tangled mass of thread-like material filling the nucleus, made of DNA wound around proteins. It only packs itself into visible rod-shaped chromosomes when the cell is about to divide.",
    },
    {
      id: "nucleolus",
      label: "Nucleolus",
      tint: N.nucleolus,
      depth: 4,
      d: blob(302, 176, 40, 37, [1, 0.94, 1.06, 0.95, 1.04, 0.96]),
      layers: [
        { d: blob(302, 176, 40, 37, [1, 0.94, 1.06, 0.95, 1.04, 0.96]), as: "shade" },
        { d: gleam(302, 176, 40, 37), as: "light", opacity: 0.35 },
      ],
      focus: [258, 132, 88, 88],
      labelAt: [528, 244],
      leaderAt: [340, 186],
      blurb:
        "The dense round body inside the nucleus, where ribosomal subunits are assembled. One large and one small subunit later join out in the cytoplasm to form a working ribosome.",
    },
    {
      id: "er",
      label: "Endoplasmic reticulum",
      tint: N.er,
      depth: 5,
      d: [
        tubule(214, 324, 402, 15, 13),
        tubule(244, 356, 452, -16, 13),
        tubule(286, 388, 486, 14, 13),
      ].join(" "),
      layers: [
        {
          d: dots(
            [
              [252, 322], [302, 330], [352, 320],
              [318, 386], [372, 394], [424, 384],
            ],
            4,
          ),
          as: "shade",
        },
      ],
      focus: [210, 312, 240, 96],
      labelAt: [528, 380],
      leaderAt: [478, 392],
      blurb:
        "The network of membranes running out from the outer nuclear membrane — the two are continuous. The studs on it are ribosomes, which is why proteins made here can be shipped straight out.",
    },
  ],
};

/* ════════════════════════════════════════ Fig. 2.12 — from cell to DNA ══ */

export const cellToDnaFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.12",
  title: "From cell to DNA",
  caption:
    "Four steps of zoom. Everything a cell needs to know is written along the molecule at the end of them.",
  altText:
    "Four stages left to right: a whole cell with its nucleus marked, the chromatin inside that nucleus, a single condensed chromosome, and finally the DNA double helix the chromosome is made of, with arrows leading from each stage to the next. Selecting any stage lifts it out, enlarged, and explains it.",
  viewBox: [660, 320],
  magnify: "part",
  scenery: [
    {
      d: "M172,150 L206,150 M328,150 L362,150 M470,150 L504,150",
      as: "stroke",
      width: 3,
    },
    {
      d: "M206,150 L196,144 M206,150 L196,156 M362,150 L352,144 M362,150 L352,156 M504,150 L494,144 M504,150 L494,156",
      as: "stroke",
      width: 3,
    },
  ],
  parts: [
    {
      id: "cell",
      label: "The cell",
      tint: D.cell,
      depth: 0,
      d: blob(112, 150, 58, 54, [1, 0.96, 1.04, 0.95, 1.03, 0.97, 1.02, 0.96]),
      layers: [
        { d: circle(122, 142, 24), as: "shade" },
        { d: circle(122, 142, 30), as: "stroke", width: 1.6, dash: "6 5" },
        { d: gleam(112, 150, 58, 54), as: "light", opacity: 0.45 },
      ],
      focus: [50, 88, 124, 124],
      labelAt: [112, 250],
      labelAlign: "middle",
      leaderAt: [112, 200],
      blurb:
        "Where the sequence starts. The dashed ring marks the nucleus — one organelle among many, holding everything needed to build and run this cell.",
    },
    {
      id: "chromatin",
      label: "Chromatin",
      tint: D.nucleus,
      depth: 1,
      d: blob(266, 150, 52, 50, [1, 0.97, 1.03, 0.96, 1.02, 0.98]),
      layers: [
        {
          d: "M234,140 C254,118 268,168 292,142 C312,120 306,178 278,180 C252,182 240,164 236,172",
          as: "stroke",
          width: 4.5,
        },
        { d: gleam(266, 150, 52, 50), as: "light", opacity: 0.4 },
      ],
      focus: [210, 94, 112, 112],
      labelAt: [266, 250],
      labelAlign: "middle",
      leaderAt: [266, 198],
      blurb:
        "Inside the nucleus, DNA is not tidy. It sits as chromatin — an entangled mass of thread — and stays that way for as long as the cell is not about to divide.",
    },
    {
      id: "chromosome",
      label: "Chromosome",
      tint: D.chromosome,
      depth: 2,
      d: [
        blob(404, 116, 13, 32, [1, 0.9, 1.06, 0.92, 1.04, 0.9]),
        blob(432, 116, 13, 32, [1, 0.92, 1.04, 0.9, 1.06, 0.92]),
        blob(404, 186, 13, 32, [1, 0.92, 1.06, 0.9, 1.04, 0.92]),
        blob(432, 186, 13, 32, [1, 0.9, 1.05, 0.92, 1.04, 0.9]),
      ].join(" "),
      layers: [
        { d: ellipse(418, 150, 20, 10), as: "shade" },
        { d: gleam(404, 116, 13, 32), as: "light", opacity: 0.45 },
      ],
      focus: [376, 76, 84, 148],
      labelAt: [418, 250],
      labelAlign: "middle",
      leaderAt: [418, 224],
      blurb:
        "When the cell prepares to divide, chromatin packs itself into these rod-shaped structures. Only then are chromosomes visible at all — the rest of the time they are not there to be seen.",
    },
    {
      id: "dna",
      label: "DNA",
      tint: D.dna,
      depth: 3,
      d: [
        "M528,96 C572,116 528,140 572,160 C616,180 572,204 616,224",
        "M572,96 C528,116 572,140 528,160 C484,180 528,204 484,224",
      ].join(" "),
      layers: [
        {
          d: [
            "M528,96 C572,116 528,140 572,160 C616,180 572,204 616,224",
            "M572,96 C528,116 572,140 528,160 C484,180 528,204 484,224",
          ].join(" "),
          as: "stroke",
          width: 5,
        },
        // The base pairs holding the two strands together.
        {
          d: "M542,110 H558 M550,132 H566 M540,154 H558 M556,178 H574 M534,200 H552 M548,218 H566",
          as: "stroke",
          width: 2.6,
          opacity: 0.8,
        },
      ],
      focus: [478, 84, 148, 152],
      labelAt: [552, 250],
      labelAlign: "middle",
      leaderAt: [552, 226],
      blurb:
        "Unwound, a chromosome is one long DNA molecule twisted into a double helix. The functional stretches along it are genes, and those are what pass from parents to the next generation.",
    },
  ],
};

/* ═══════════════════════════════════ Fig. 2.14 — the mitochondrion ══ */

const MIT = { cx: 322, cy: 200, rx: 186, ry: 96, deg: -10 };

export const mitochondrionFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.14",
  title: "Structure of a mitochondrion",
  caption:
    "Two membranes, the inner one folded into deep pleats. The folding is the whole trick: it packs an enormous working surface into a tiny organelle.",
  altText:
    "A cut-away mitochondrion: a smooth outer membrane, an inner membrane thrown into deep finger-like folds called cristae, the narrow space between the two membranes, and the matrix inside holding its own DNA and ribosomes. Selecting any part lifts it out, enlarged, and explains it.",
  viewBox: [660, 410],
  magnify: "part",
  parts: [
    {
      id: "outer",
      label: "Outer membrane",
      tint: O.outer,
      depth: 0,
      backdrop: true,
      d: blob(MIT.cx, MIT.cy, MIT.rx, MIT.ry, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], MIT.deg),
      layers: [{ d: gleam(MIT.cx, MIT.cy, MIT.rx, MIT.ry, MIT.deg - 20), as: "light", opacity: 0.4 }],
      focus: [150, 96, 110, 72],
      labelAt: [132, 84],
      leaderAt: [190, 124],
      blurb:
        "The smooth, porous boundary. Being porous, it lets small molecules through freely — so it is the inner membrane, not this one, that does the selecting.",
    },
    {
      id: "intermembrane",
      label: "Intermembrane space",
      tint: O.outer,
      depth: 1,
      backdrop: true,
      d: `${blob(MIT.cx, MIT.cy, MIT.rx - 14, MIT.ry - 12, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], MIT.deg)}`,
      layers: [
        {
          d: blob(MIT.cx, MIT.cy, MIT.rx - 14, MIT.ry - 12, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], MIT.deg),
          as: "shade",
          opacity: 0.5,
        },
      ],
      focus: [470, 208, 78, 62],
      labelAt: [528, 300],
      leaderAt: [486, 232],
      blurb:
        "The narrow gap between the two membranes. Two membranes with a space between them is a feature mitochondria share with chloroplasts and with almost nothing else in the cell.",
    },
    {
      id: "matrix",
      label: "Matrix",
      tint: O.matrix,
      depth: 2,
      backdrop: true,
      d: blob(MIT.cx, MIT.cy, MIT.rx - 30, MIT.ry - 26, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], MIT.deg),
      layers: [
        {
          d: blob(MIT.cx, MIT.cy, MIT.rx - 30, MIT.ry - 26, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], MIT.deg),
          as: "light",
        },
      ],
      focus: [268, 250, 90, 48],
      labelAt: [132, 318],
      leaderAt: [296, 262],
      blurb:
        "The fluid filling the space the cristae fold into. The reactions that finish breaking sugar down happen here, and the energy released is packed into molecules of ATP.",
    },
    {
      id: "inner",
      label: "Inner membrane",
      tint: O.inner,
      depth: 3,
      d: blob(MIT.cx, MIT.cy, MIT.rx - 30, MIT.ry - 26, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], MIT.deg),
      layers: [
        {
          d: blob(MIT.cx, MIT.cy, MIT.rx - 30, MIT.ry - 26, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], MIT.deg),
          as: "stroke",
          width: 4,
        },
      ],
      focus: [MIT.cx - 60, MIT.cy - 80, 120, 44],
      labelAt: [528, 120],
      leaderAt: [382, 132],
      blurb:
        "The second membrane, lying just inside the first and folded rather than smooth. Everything that makes a mitochondrion a powerhouse happens on or across this layer.",
    },
    {
      id: "cristae",
      label: "Cristae",
      tint: O.inner,
      depth: 4,
      d: folds(MIT.cx, MIT.cy, MIT.rx - 42, MIT.ry - 34, 9, MIT.deg, 1.6),
      layers: [
        {
          d: folds(MIT.cx, MIT.cy, MIT.rx - 42, MIT.ry - 34, 9, MIT.deg, 1.6),
          as: "stroke",
          width: 7,
        },
      ],
      focus: [MIT.cx - 40, MIT.cy - 56, 90, 112],
      labelAt: [528, 190],
      leaderAt: [376, 214],
      blurb:
        "The finger-like pleats of the inner membrane. Folding packs far more membrane into the same volume, and that extra surface area is where the energy-releasing reactions run.",
    },
    {
      id: "dna",
      label: "Its own DNA",
      tint: O.dna,
      depth: 5,
      d: `${circle(232, 232, 16)} ${circle(232, 232, 9)}`,
      focus: [210, 210, 44, 44],
      labelAt: [132, 232],
      leaderAt: [214, 230],
      blurb:
        "A mitochondrion carries a small loop of DNA of its own, separate from the DNA in the nucleus. Very few organelles do — the chloroplast is the other one.",
    },
    {
      id: "ribosomes",
      label: "Its own ribosomes",
      tint: O.ribosome,
      depth: 6,
      d: dots(
        [
          [268, 168],
          [356, 250],
          [412, 178],
          [300, 236],
        ],
        7,
      ),
      focus: [254, 154, 28, 28],
      labelAt: [132, 166],
      leaderAt: [258, 166],
      blurb:
        "With its own DNA and its own ribosomes, a mitochondrion can build some of its proteins on site rather than waiting for the rest of the cell to send them.",
    },
  ],
};

/* ═════════════════════════════════════════ Fig. 2.15 — the chloroplast ══ */

const CHL = { cx: 322, cy: 200, rx: 188, ry: 112, deg: -8 };
/** Grana: stacks of thylakoid discs, strung along the organelle's long axis. */
const GRANA: [number, number][] = [
  [216, 166],
  [286, 226],
  [354, 154],
  [396, 240],
  [268, 138],
];

export const chloroplastFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.15",
  title: "Structure of a chloroplast",
  caption:
    "Built to the same plan as a mitochondrion — two membranes, its own DNA — but doing the opposite job: it builds food instead of burning it.",
  altText:
    "A cut-away chloroplast: a double membrane enclosing the semi-fluid stroma, in which stacks of disc-shaped thylakoid membranes holding chlorophyll sit connected to one another, along with a loop of its own DNA and its own ribosomes. Selecting any part lifts it out, enlarged, and explains it.",
  viewBox: [660, 430],
  magnify: "part",
  parts: [
    {
      id: "outer",
      label: "Outer membrane",
      tint: C.outer,
      depth: 0,
      backdrop: true,
      d: blob(CHL.cx, CHL.cy, CHL.rx, CHL.ry, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], CHL.deg),
      layers: [{ d: gleam(CHL.cx, CHL.cy, CHL.rx, CHL.ry, CHL.deg - 20), as: "light", opacity: 0.4 }],
      focus: [144, 108, 108, 76],
      labelAt: [132, 96],
      leaderAt: [186, 136],
      blurb:
        "The outer of the two membranes wrapping the organelle. Like a mitochondrion, a chloroplast is double-membrane-bound — the two are built to a strikingly similar plan.",
    },
    {
      id: "inner",
      label: "Inner membrane",
      tint: C.inner,
      depth: 1,
      backdrop: true,
      d: `${blob(CHL.cx, CHL.cy, CHL.rx - 16, CHL.ry - 14, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], CHL.deg)}`,
      layers: [
        {
          d: blob(CHL.cx, CHL.cy, CHL.rx - 16, CHL.ry - 14, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], CHL.deg),
          as: "stroke",
          width: 3.4,
        },
      ],
      focus: [CHL.cx - 56, CHL.cy - 96, 112, 44],
      labelAt: [528, 108],
      leaderAt: [368, 116],
      blurb:
        "Lies just inside the outer one and encloses the stroma. Unlike a mitochondrion's inner membrane it is not folded — here the folding happens on separate structures within.",
    },
    {
      id: "stroma",
      label: "Stroma",
      tint: C.stroma,
      depth: 2,
      backdrop: true,
      d: blob(CHL.cx, CHL.cy, CHL.rx - 30, CHL.ry - 26, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], CHL.deg),
      layers: [
        {
          d: blob(CHL.cx, CHL.cy, CHL.rx - 30, CHL.ry - 26, [1, 0.98, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98], CHL.deg),
          as: "light",
        },
      ],
      focus: [316, 276, 88, 44],
      labelAt: [528, 306],
      leaderAt: [372, 286],
      blurb:
        "The semi-fluid substance filling the space inside the inner membrane, with the disc stacks suspended in it. The reactions that build sugar from captured energy happen out here.",
    },
    {
      id: "grana",
      label: "Grana",
      tint: C.grana,
      depth: 3,
      d: GRANA.map(([x, y]) => discStack(x, y, 5, 30, 7, 15)).join(" "),
      layers: [
        {
          // Lamellae — the tubes connecting one stack to the next.
          d: "M240,172 C266,190 268,208 284,220 M312,222 C332,206 336,186 352,166 M376,158 C390,180 386,222 396,236",
          as: "stroke",
          width: 5,
          opacity: 0.85,
        },
      ],
      focus: [180, 128, 76, 78],
      labelAt: [132, 184],
      leaderAt: [188, 166],
      blurb:
        "Stacks of flattened disc-shaped sacs suspended in the stroma. Chlorophyll sits in these membranes, so this is exactly where sunlight is captured.",
    },
    {
      id: "dna",
      label: "Its own DNA",
      tint: C.dna,
      depth: 4,
      d: `${circle(452, 190, 16)} ${circle(452, 190, 9)}`,
      focus: [430, 168, 44, 44],
      labelAt: [528, 202],
      leaderAt: [470, 190],
      blurb:
        "A small loop of DNA of its own, exactly as in a mitochondrion. It is one reason biologists think both organelles began as free-living bacteria that were swallowed and kept.",
    },
    {
      id: "ribosomes",
      label: "Its own ribosomes",
      tint: C.dna,
      depth: 5,
      d: dots(
        [
          [246, 262],
          [330, 268],
          [414, 156],
          [200, 214],
        ],
        7,
      ),
      focus: [232, 248, 28, 28],
      labelAt: [132, 272],
      leaderAt: [236, 262],
      blurb:
        "Scattered specks in the stroma. With its own DNA and ribosomes a chloroplast makes some of its proteins itself, without waiting on the nucleus.",
    },
  ],
};

/* ═══════════════════════════════ Fig. 2.17 — cell division in a root tip ══ */

/** One boxed cell of the onion root tip, at a given stage. */
function rootCell(x: number, y: number): string {
  return roundRect(x, y, 116, 132, 12);
}

export const mitosisFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.17",
  title: "Stages of cell division in an onion root tip",
  caption:
    "Every cell in the field is caught at a different moment, so one slide shows you the whole sequence at once.",
  altText:
    "Four boxed cells from an onion root tip, side by side, each caught at a different stage of division: a resting cell with one round nucleus, a cell whose chromosomes have condensed and lined up on a spindle, a cell with the two sets being pulled to opposite ends, and finally two small daughter cells each with a nucleus of its own. Selecting any stage lifts it out, enlarged, and explains it.",
  viewBox: [660, 300],
  magnify: "part",
  parts: [
    {
      id: "wall",
      label: "Cell walls",
      tint: X.wall,
      depth: 0,
      backdrop: true,
      d: [rootCell(28, 54), rootCell(178, 54), rootCell(328, 54), rootCell(478, 54)].join(" "),
      layers: [
        {
          d: [
            roundRect(38, 64, 96, 112, 8),
            roundRect(188, 64, 96, 112, 8),
            roundRect(338, 64, 96, 112, 8),
            roundRect(488, 64, 96, 112, 8),
          ].join(" "),
          as: "light",
        },
      ],
      focus: [20, 46, 132, 148],
      labelAt: [132, 244],
      labelAlign: "middle",
      leaderAt: [86, 190],
      blurb:
        "Plant cells keep their rigid walls all the way through division, which is why the cells stay boxy and in tidy files. An animal cell simply pinches itself in two instead.",
    },
    {
      id: "resting",
      label: "Not dividing",
      tint: X.nucleus,
      depth: 1,
      d: blob(86, 120, 34, 32, [1, 0.96, 1.04, 0.95, 1.03, 0.97]),
      layers: [
        { d: blob(86, 120, 15, 14, [1, 0.94, 1.06, 0.95, 1.04, 0.96]), as: "shade" },
        { d: gleam(86, 120, 34, 32), as: "light", opacity: 0.4 },
      ],
      focus: [46, 80, 80, 80],
      labelAt: [86, 220],
      labelAlign: "middle",
      leaderAt: [86, 156],
      blurb:
        "Most cells look like this: one round, clearly bounded nucleus with a darker nucleolus in it. No chromosomes are visible, because the DNA is still spread out as chromatin.",
    },
    {
      id: "lined-up",
      label: "Lined up",
      tint: X.chromosome,
      depth: 2,
      d: [
        blob(224, 120, 9, 22, [1, 0.9, 1.06, 0.92, 1.04, 0.9]),
        blob(240, 120, 9, 22, [1, 0.92, 1.04, 0.9, 1.06, 0.92]),
        blob(256, 120, 9, 22, [1, 0.9, 1.05, 0.92, 1.04, 0.9]),
      ].join(" "),
      layers: [
        {
          // Spindle fibres reaching in from both poles.
          d:
            "M196,74 L224,110 M196,74 L240,110 M196,74 L256,110 " +
            "M196,166 L224,132 M196,166 L240,132 M196,166 L256,132 " +
            "M284,74 L256,110 M284,74 L240,110 M284,166 L256,132 M284,166 L240,132",
          as: "stroke",
          tint: X.spindle,
          width: 1.6,
          opacity: 0.75,
        },
      ],
      focus: [204, 88, 76, 66],
      labelAt: [236, 220],
      labelAlign: "middle",
      leaderAt: [240, 148],
      blurb:
        "The nucleus has gone and the chromatin has packed itself into visible chromosomes, drawn up in a row across the middle of the cell with fibres attached from both ends.",
    },
    {
      id: "separating",
      label: "Being pulled apart",
      tint: X.chromosome,
      depth: 3,
      d: [
        blob(370, 92, 9, 20, [1, 0.9, 1.06, 0.92, 1.04, 0.9]),
        blob(388, 90, 9, 20, [1, 0.92, 1.04, 0.9, 1.06, 0.92]),
        blob(376, 152, 9, 20, [1, 0.9, 1.05, 0.92, 1.04, 0.9]),
        blob(394, 154, 9, 20, [1, 0.92, 1.06, 0.9, 1.04, 0.92]),
      ].join(" "),
      layers: [
        {
          d: "M346,70 L370,84 M346,70 L388,82 M420,174 L376,160 M420,174 L394,162",
          as: "stroke",
          tint: X.spindle,
          width: 1.6,
          opacity: 0.75,
        },
      ],
      focus: [340, 70, 92, 104],
      labelAt: [386, 220],
      labelAlign: "middle",
      leaderAt: [396, 168],
      blurb:
        "The two sets of chromosomes moving to opposite ends of the cell. Each set is a complete copy, which is what guarantees both daughter cells get the same genetic information.",
    },
    {
      id: "daughters",
      label: "Two daughter cells",
      tint: X.cell,
      depth: 4,
      d: [
        blob(536, 92, 26, 22, [1, 0.96, 1.04, 0.95, 1.03, 0.97]),
        blob(536, 150, 26, 22, [1, 0.95, 1.04, 0.96, 1.03, 0.96]),
      ].join(" "),
      layers: [
        {
          d: [blob(536, 92, 11, 9, [1, 0.94, 1.06, 0.95]), blob(536, 150, 11, 9, [1, 0.95, 1.05, 0.94])].join(" "),
          as: "shade",
        },
        { d: "M488,121 H584", as: "stroke", width: 3 },
      ],
      focus: [500, 62, 72, 122],
      labelAt: [536, 220],
      labelAlign: "middle",
      leaderAt: [536, 180],
      blurb:
        "A new wall has formed across the middle and each half has rebuilt its nucleus. Two cells now stand where one did, each carrying the same instructions as the parent.",
    },
  ],
};
