import type { FigureSpec } from "@/lib/sim/types";
import {
  circle,
  ellipse,
  dots,
  folds,
  discStack,
  cisterna,
  tubule,
  roundRect,
  stadium,
  spindle,
  chromosomes,
} from "@/lib/sim/draw";

/**
 * Chapter 2 plates — "Cell: The Building Block of Life".
 *
 * These recap the figures a class-9 student meets in the printed chapter, so
 * the book and the app are visibly the same journey. They are drawn from the
 * biology, not traced from the book: the structures (a rod-shaped bacterium
 * with a nucleoid, a plant cell with a large central vacuole, a mitochondrion
 * with cristae) are facts, and the anatomical terms are terminology. The
 * artwork, the proportions, the palette and the interaction are ours.
 *
 * Every plate is `kind: "figure"`, which means the whole specimen is drawn at
 * once with leader-line labels and any part can be clicked to MAGNIFY into it
 * (see src/components/sim/FigureSim.tsx).
 */

/* Shared tints, so an organelle is the same colour in every plate it appears
 * in. This is what lets a student recognise a mitochondrion on sight. */
const T = {
  wall: "#a3c76d",
  membrane: "#f0a35e",
  cytoplasm: "#8fd3f4",
  nucleus: "#b39ddb",
  nucleolus: "#8a6fd4",
  vacuole: "#7fd8e8",
  chloroplast: "#57c785",
  mito: "#f4796b",
  er: "#7fb2f0",
  golgi: "#f2b544",
  lysosome: "#e86fa8",
  ribosome: "#cfd8e6",
  nucleoid: "#c48fe0",
  flagellum: "#9aa7b8",
  stroma: "#9ee6b8",
  matrix: "#f7b3a8",
  chromatin: "#8a6fd4",
  spindle: "#9aa7b8",
  glass: "#8fd3f4",
  metal: "#9aa7b8",
} as const;

/* ═══════════════════════════════════════════════════ (a) bacterial cell ══ */

export const bacterialCellFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.10 (a)",
  title: "A typical bacterial cell",
  caption:
    "A prokaryotic cell: no nucleus and no membrane-bound organelles. The genetic material lies free in the cytoplasm as a nucleoid.",
  altText:
    "A labelled diagram of a rod-shaped bacterial cell showing the cell wall, cell membrane, cytoplasm, nucleoid, ribosomes and a whip-like appendage for locomotion. Selecting any label magnifies the diagram into that structure and explains it.",
  viewBox: [660, 400],
  parts: [
    {
      id: "flagellum",
      label: "Appendage for locomotion",
      tint: T.flagellum,
      depth: 0,
      d: "M190,182 C152,166 120,138 98,112 C84,96 70,88 58,92 C46,96 44,110 54,120 L48,126 C34,112 38,88 56,82 C74,76 92,90 106,106 C128,132 158,158 194,176 Z",
      focus: [36, 66, 170, 124],
      labelAt: [130, 316],
      leaderAt: [62, 96],
      blurb:
        "A long whip-like thread anchored in the cell envelope. It rotates like a propeller and drives the bacterium through liquid, letting it swim towards food and away from harmful surroundings.",
    },
    {
      id: "cell-wall",
      label: "Cell wall",
      tint: T.wall,
      depth: 1,
      backdrop: true,
      d: stadium(185, 130, 290, 130),
      focus: [420, 140, 90, 90],
      labelAt: [520, 138],
      leaderAt: [466, 172],
      blurb:
        "A tough outer layer that holds the rod shape and stops the cell bursting when water rushes in. In bacteria it is built from peptidoglycan, not the cellulose found in plants.",
    },
    {
      id: "cell-membrane",
      label: "Cell membrane",
      tint: T.membrane,
      depth: 2,
      backdrop: true,
      d: stadium(201, 140, 258, 110),
      focus: [196, 160, 80, 80],
      blurb:
        "The living boundary just inside the wall. It decides what enters and leaves, and in a bacterium it also does jobs that organelles handle in larger cells, such as releasing energy.",
    },
    {
      id: "cytoplasm",
      label: "Cytoplasm",
      tint: T.cytoplasm,
      depth: 3,
      backdrop: true,
      d: stadium(215, 148, 230, 94),
      focus: [230, 152, 90, 86],
      labelAt: [252, 352],
      leaderAt: [268, 228],
      labelAlign: "middle",
      blurb:
        "The crowded fluid that fills the cell. Every chemical reaction the bacterium runs happens here, because there are no separate compartments to run them in.",
    },
    {
      id: "nucleoid",
      label: "Nucleoid",
      tint: T.nucleoid,
      depth: 4,
      d: "M282,195 C286,173 308,163 332,167 C358,171 374,163 386,175 C398,187 394,211 378,219 C360,228 338,221 318,225 C298,229 278,217 282,195 Z",
      layers: [
        {
          d: "M292,190 C302,172 322,200 342,178 C358,161 374,190 382,174",
          width: 2,
          opacity: 0.85,
        },
        {
          d: "M296,206 C310,190 326,214 346,196 C362,181 374,206 384,194",
          width: 2,
          opacity: 0.85,
        },
      ],
      focus: [276, 158, 130, 76],
      labelAt: [400, 352],
      leaderAt: [336, 222],
      labelAlign: "middle",
      blurb:
        "The bacterium's genetic material — a single circular DNA molecule coiled into one region of the cytoplasm. It is not wrapped in a nuclear membrane, which is what makes this cell prokaryotic.",
    },
    {
      id: "ribosome",
      label: "Ribosome",
      tint: T.ribosome,
      depth: 5,
      d: dots(
        [
          [280, 168],
          [300, 232],
          [330, 152],
          [356, 238],
          [392, 168],
          [408, 214],
          [426, 192],
          [268, 208],
          [376, 150],
          [414, 236],
        ],
        5,
      ),
      focus: [398, 180, 60, 70],
      labelAt: [520, 250],
      leaderAt: [420, 224],
      blurb:
        "Tiny granules where proteins are assembled from the instructions carried by the DNA. Bacteria have thousands of them, scattered loose in the cytoplasm rather than attached to any membrane.",
    },
  ],
};

/* ═════════════════════════════════════════════════════ (b) plant cell ══ */

const plantWall = roundRect(195, 78, 275, 290, 30);
const plantMembrane = roundRect(207, 90, 251, 266, 24);
const plantCytoplasm = roundRect(215, 98, 235, 250, 20);

export const plantCellFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.10 (b)",
  title: "A typical plant cell",
  caption:
    "A eukaryotic cell with three things an animal cell never has: a rigid cell wall, chloroplasts, and one large central vacuole.",
  altText:
    "A labelled diagram of a plant cell showing the cell wall, cell membrane, cytoplasm, a large central vacuole, the nucleus and nucleolus, chloroplasts, mitochondria, endoplasmic reticulum, Golgi body and ribosomes. Selecting any label magnifies the diagram into that structure and explains it.",
  viewBox: [660, 440],
  maxZoom: 3.6,
  parts: [
    {
      id: "cell-wall",
      label: "Cell wall",
      tint: T.wall,
      depth: 0,
      backdrop: true,
      d: plantWall,
      layers: [
        // Cellulose laid down in layers — the striations you see at the corner.
        { d: "M199,150 H466 M199,180 H466", width: 1, opacity: 0.35, dash: "7 9" },
      ],
      focus: [186, 120, 90, 90],
      labelAt: [175, 108],
      leaderAt: [200, 128],
      blurb:
        "A rigid jacket of cellulose outside the membrane. It gives the cell its box-like shape, lets it stand up to the pressure of a full vacuole, and is freely permeable to water and dissolved minerals.",
    },
    {
      id: "cell-membrane",
      label: "Cell membrane",
      tint: T.membrane,
      depth: 1,
      backdrop: true,
      d: plantMembrane,
      focus: [416, 110, 84, 84],
      labelAt: [492, 104],
      leaderAt: [452, 126],
      blurb:
        "A thin, selectively permeable layer pressed against the inside of the wall. The wall decides nothing; this membrane is what actually controls which substances get into and out of the cell.",
    },
    {
      id: "cytoplasm",
      label: "Cytoplasm",
      tint: T.cytoplasm,
      depth: 2,
      backdrop: true,
      d: plantCytoplasm,
      focus: [220, 300, 90, 46],
      labelAt: [175, 352],
      leaderAt: [252, 340],
      blurb:
        "The jelly-like fluid holding every organelle in place. In a living plant cell it streams slowly around the vacuole, carrying materials from one part of the cell to another.",
    },
    {
      id: "vacuole",
      label: "Vacuole",
      tint: T.vacuole,
      depth: 3,
      d: "M296,152 C334,148 356,176 356,212 C356,250 332,272 296,272 C258,272 240,248 240,210 C240,172 258,156 296,152 Z",
      focus: [236, 146, 126, 132],
      labelAt: [175, 228],
      leaderAt: [268, 212],
      blurb:
        "One huge sac of cell sap that can fill most of a mature plant cell. Its water pressure pushes outward against the wall and keeps stems and leaves firm — which is why a plant wilts when it dries out.",
    },
    {
      id: "chloroplast",
      label: "Chloroplast",
      tint: T.chloroplast,
      depth: 4,
      d: [
        ellipse(300, 124, 30, 13, -10),
        ellipse(300, 318, 30, 13, 12),
        ellipse(228, 200, 26, 11, 82),
      ].join(" "),
      layers: [
        {
          d: [
            discStack(286, 126, 4, 9, 2.6, 5),
            discStack(312, 121, 3, 8, 2.4, 5),
            discStack(286, 315, 4, 9, 2.6, 5),
            discStack(312, 321, 3, 8, 2.4, 5),
            discStack(228, 188, 4, 8, 2.4, 5),
            discStack(230, 212, 3, 7, 2.2, 5),
          ].join(" "),
          as: "shade",
        },
      ],
      focus: [266, 106, 68, 38],
      labelAt: [175, 168],
      leaderAt: [232, 190],
      blurb:
        "The green organelle that runs photosynthesis, trapping sunlight to build glucose from carbon dioxide and water. Its colour comes from chlorophyll, packed into stacks of membrane discs inside.",
    },
    {
      id: "mitochondria",
      label: "Mitochondria",
      tint: T.mito,
      depth: 5,
      d: [ellipse(348, 114, 28, 12, 20), ellipse(228, 282, 24, 11, 68)].join(" "),
      layers: [
        { d: folds(348, 114, 28, 12, 5, 20), width: 1.4, opacity: 0.85 },
        { d: folds(228, 282, 24, 11, 4, 68), width: 1.4, opacity: 0.85 },
      ],
      focus: [316, 92, 66, 46],
      labelAt: [175, 292],
      leaderAt: [230, 280],
      blurb:
        "The cell's power houses. They break glucose down with oxygen and store the energy released as ATP, the chemical fuel every other process in the cell draws on. Plant cells need them just as much as animal cells do.",
    },
    {
      id: "nucleus",
      label: "Nucleus",
      tint: T.nucleus,
      depth: 6,
      d: circle(410, 160, 34),
      layers: [
        { d: circle(410, 160, 27), width: 1.3, opacity: 0.7 },
        {
          d: "M394,150 C402,143 408,157 418,148 M396,176 C404,169 412,181 424,172",
          width: 1.8,
          opacity: 0.75,
        },
      ],
      focus: [376, 126, 68, 68],
      labelAt: [492, 152],
      leaderAt: [408, 130],
      blurb:
        "The control centre, wrapped in a double membrane pierced by pores. It holds the chromosomes, and the instructions they carry decide which proteins the cell makes and when it divides.",
    },
    {
      id: "nucleolus",
      label: "Nucleolus",
      tint: T.nucleolus,
      depth: 7,
      d: circle(418, 152, 12),
      focus: [400, 134, 36, 36],
      labelAt: [492, 200],
      leaderAt: [428, 156],
      blurb:
        "A dense round body inside the nucleus. This is where ribosomes are put together before they move out into the cytoplasm to begin making proteins.",
    },
    {
      id: "endoplasmic-reticulum",
      label: "Endoplasmic reticulum",
      tint: T.er,
      depth: 8,
      d: [tubule(372, 226, 444, 11), tubule(372, 248, 444, 11)].join(" "),
      layers: [
        {
          d: dots(
            [
              [378, 228],
              [396, 224],
              [414, 234],
              [436, 228],
              [378, 250],
              [400, 246],
              [420, 256],
              [438, 250],
            ],
            3,
          ),
          as: "shade",
        },
      ],
      focus: [366, 216, 84, 48],
      labelAt: [492, 244],
      leaderAt: [442, 234],
      blurb:
        "A branching network of membrane tubes running through the cytoplasm. It carries proteins and fats around the cell; where ribosomes stud its surface it looks rough, and where they do not it looks smooth.",
    },
    {
      id: "golgi-body",
      label: "Golgi body",
      tint: T.golgi,
      depth: 9,
      d: [
        cisterna(402, 282, 38, 9),
        cisterna(404, 294, 34, 8),
        cisterna(404, 306, 30, 7),
        circle(358, 276, 5),
        circle(442, 300, 4.5),
      ].join(" "),
      focus: [352, 268, 100, 50],
      labelAt: [492, 306],
      leaderAt: [436, 300],
      blurb:
        "A stack of flattened sacs that finishes off what the endoplasmic reticulum makes — sorting it, packaging it into small bubbles, and sending it to wherever in the cell it is needed.",
    },
    {
      id: "ribosome",
      label: "Ribosome",
      tint: T.ribosome,
      depth: 10,
      d: dots(
        [
          [256, 150],
          [344, 152],
          [258, 292],
          [352, 292],
          [240, 340],
          [346, 340],
          [232, 152],
        ],
        5,
      ),
      focus: [236, 132, 60, 40],
      labelAt: [492, 352],
      leaderAt: [350, 340],
      blurb:
        "Very small granules, free in the cytoplasm or attached to the endoplasmic reticulum, where amino acids are joined into proteins. Every cell alive has them, prokaryote or eukaryote.",
    },
  ],
};

/* ════════════════════════════════════════════════════ (c) animal cell ══ */

export const animalCellFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.10 (c)",
  title: "A typical animal cell",
  caption:
    "The same organelles as a plant cell, minus the wall, the chloroplasts and the big vacuole — which is why an animal cell has no fixed shape.",
  altText:
    "A labelled diagram of an animal cell showing the cell membrane, cytoplasm, nucleus and nucleolus, endoplasmic reticulum, mitochondria, Golgi body, lysosomes, a small vacuole and ribosomes. Selecting any label magnifies the diagram into that structure and explains it.",
  viewBox: [660, 440],
  maxZoom: 3.6,
  parts: [
    {
      id: "cell-membrane",
      label: "Cell membrane",
      tint: T.membrane,
      depth: 0,
      backdrop: true,
      d: "M330,75 C388,73 442,103 462,158 C483,214 478,276 447,318 C416,360 366,378 328,377 C280,376 230,355 205,312 C178,266 178,202 204,157 C229,112 274,79 330,75 Z",
      focus: [196, 180, 84, 84],
      labelAt: [492, 386],
      leaderAt: [372, 366],
      blurb:
        "The only boundary an animal cell has. Being flexible rather than rigid, it lets the cell change shape — which is how a white blood cell squeezes out of a capillary to reach an infection.",
    },
    {
      id: "cytoplasm",
      label: "Cytoplasm",
      tint: T.cytoplasm,
      depth: 1,
      backdrop: true,
      d: "M330,90 C384,88 432,116 450,166 C469,217 464,272 436,310 C408,348 362,363 328,362 C284,361 239,342 217,303 C192,262 192,205 216,164 C239,123 279,94 330,90 Z",
      focus: [206, 292, 80, 60],
      labelAt: [175, 344],
      leaderAt: [230, 330],
      blurb:
        "Everything between the membrane and the nucleus: a watery jelly holding the organelles, packed with dissolved salts, sugars and enzymes, and the site of countless reactions.",
    },
    {
      id: "endoplasmic-reticulum",
      label: "Endoplasmic reticulum",
      tint: T.er,
      depth: 2,
      d: [
        tubule(226, 148, 306, 15),
        tubule(226, 172, 306, 15),
        tubule(226, 196, 306, 15),
      ].join(" "),
      layers: [
        {
          d: dots(
            [
              [232, 150],
              [258, 146],
              [284, 158],
              [300, 150],
              [232, 174],
              [262, 170],
              [288, 182],
              [236, 198],
              [266, 194],
              [292, 206],
            ],
            3,
          ),
          as: "shade",
        },
      ],
      focus: [220, 138, 92, 74],
      labelAt: [175, 128],
      leaderAt: [242, 152],
      blurb:
        "A maze of membrane channels folded through the cytoplasm. It transports proteins and fats, and it hugely increases the surface area on which the cell's chemistry can happen.",
    },
    {
      id: "lysosome",
      label: "Lysosome",
      tint: T.lysosome,
      depth: 3,
      d: [circle(252, 207, 15), circle(275, 233, 11)].join(" "),
      layers: [
        {
          d: dots(
            [
              [246, 203],
              [256, 211],
              [250, 214],
              [272, 231],
              [279, 236],
            ],
            2.5,
          ),
          as: "shade",
        },
      ],
      focus: [234, 190, 58, 56],
      labelAt: [175, 200],
      leaderAt: [240, 205],
      blurb:
        "A bag of powerful digestive enzymes. It breaks down worn-out organelles and anything the cell swallows — and if the cell is damaged it bursts and digests the cell itself, earning it the name suicide bag.",
    },
    {
      id: "mitochondria",
      label: "Mitochondria",
      tint: T.mito,
      depth: 4,
      d: [ellipse(262, 265, 40, 19, -14), ellipse(402, 269, 34, 16, 22)].join(" "),
      layers: [
        { d: folds(262, 265, 40, 19, 6, -14), width: 1.5, opacity: 0.85 },
        { d: folds(402, 269, 34, 16, 5, 22), width: 1.5, opacity: 0.85 },
      ],
      focus: [220, 242, 86, 48],
      labelAt: [175, 272],
      leaderAt: [238, 270],
      blurb:
        "Bean-shaped organelles folded into shelves called cristae, which pack an enormous membrane area into a tiny space. Respiration happens on those folds, releasing the energy the cell runs on.",
    },
    {
      id: "nucleus",
      label: "Nucleus",
      tint: T.nucleus,
      depth: 5,
      d: circle(363, 172, 55),
      layers: [
        { d: circle(363, 172, 46), width: 1.3, opacity: 0.7 },
        {
          d: "M334,168 C346,156 352,178 366,164 C378,152 386,172 398,160 M340,196 C352,186 358,204 372,192 C384,182 392,198 402,188 M348,140 C360,132 366,148 380,138",
          width: 1.9,
          opacity: 0.75,
        },
      ],
      focus: [308, 117, 110, 110],
      labelAt: [492, 108],
      leaderAt: [356, 122],
      blurb:
        "The largest organelle and the cell's control centre. Its double membrane is punched with pores, so instructions copied from the chromosomes can travel out to the ribosomes that carry them out.",
    },
    {
      id: "nucleolus",
      label: "Nucleolus",
      tint: T.nucleolus,
      depth: 6,
      d: circle(378, 164, 18),
      focus: [354, 140, 48, 48],
      labelAt: [492, 152],
      leaderAt: [394, 162],
      blurb:
        "A darker, denser spot inside the nucleus with no membrane of its own. It builds ribosomes, so a cell that makes a lot of protein has a strikingly large one.",
    },
    {
      id: "vacuole",
      label: "Vacuole",
      tint: T.vacuole,
      depth: 7,
      d: circle(420, 212, 26),
      focus: [392, 184, 56, 56],
      labelAt: [492, 208],
      leaderAt: [442, 208],
      blurb:
        "A small fluid-filled sac used for temporary storage of food, water or waste. Animal cells have several tiny ones, never the single dominating vacuole a plant cell keeps.",
    },
    {
      id: "golgi-body",
      label: "Golgi body",
      tint: T.golgi,
      depth: 8,
      d: [
        cisterna(322, 300, 52, 11),
        cisterna(322, 311, 46, 10),
        cisterna(322, 322, 40, 9),
        cisterna(322, 333, 33, 8),
        circle(258, 292, 6),
        circle(388, 296, 5),
        circle(374, 348, 5.5),
      ].join(" "),
      focus: [252, 286, 145, 66],
      labelAt: [492, 330],
      leaderAt: [366, 318],
      blurb:
        "A stack of curved sacs near the nucleus. Material arriving from the endoplasmic reticulum is modified here, then pinched off in small vesicles — you can see two of them drifting away.",
    },
    {
      id: "ribosome",
      label: "Ribosome",
      tint: T.ribosome,
      depth: 9,
      d: dots(
        [
          [330, 108],
          [394, 118],
          [212, 192],
          [210, 292],
          [332, 242],
          [302, 352],
          [436, 244],
          [250, 120],
        ],
        5,
      ),
      focus: [312, 92, 100, 52],
      labelAt: [492, 258],
      leaderAt: [438, 246],
      blurb:
        "Protein factories, so small that an electron microscope is needed to see them. Some float free in the cytoplasm; others sit on the endoplasmic reticulum and feed their product straight into it.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════ nucleus ══ */

export const nucleusFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.11",
  title: "Structure of a nucleus",
  caption:
    "A double membrane pierced by pores, enclosing the chromatin threads and the nucleolus.",
  altText:
    "A magnified diagram of a cell nucleus showing the double nuclear envelope, the nuclear pores that pass through it, the nucleoplasm, the threads of chromatin and the nucleolus. Selecting a label magnifies the diagram into that structure.",
  viewBox: [560, 400],
  parts: [
    {
      id: "nuclear-envelope",
      label: "Nuclear envelope",
      tint: T.nucleus,
      depth: 0,
      backdrop: true,
      d: circle(280, 200, 130),
      layers: [{ d: circle(280, 200, 118), width: 1.4, opacity: 0.8 }],
      focus: [140, 88, 90, 90],
      labelAt: [128, 74],
      leaderAt: [190, 112],
      blurb:
        "Two membranes, one inside the other, wrapping the whole nucleus. Keeping the genetic material in its own compartment is the single feature that separates a eukaryotic cell from a prokaryotic one.",
    },
    {
      id: "nucleoplasm",
      label: "Nucleoplasm",
      tint: T.cytoplasm,
      depth: 1,
      backdrop: true,
      d: circle(280, 200, 116),
      focus: [186, 250, 80, 80],
      labelAt: [128, 330],
      leaderAt: [212, 268],
      blurb:
        "The fluid filling the nucleus. The chromatin and the nucleolus float in it, and the raw materials for copying DNA are dissolved in it.",
    },
    {
      id: "nuclear-pore",
      label: "Nuclear pore",
      tint: T.membrane,
      depth: 2,
      d: dots(
        [
          [387, 262],
          [302, 322],
          [185, 280],
          [164, 158],
          [248, 80],
          [360, 105],
        ],
        9,
      ),
      focus: [352, 232, 70, 60],
      labelAt: [432, 300],
      leaderAt: [392, 266],
      blurb:
        "Gaps that pass right through both membranes. They are the doorways: messenger molecules copied from the DNA leave through them, and the proteins the nucleus needs come in the same way.",
    },
    {
      id: "chromatin",
      label: "Chromatin",
      tint: T.chromatin,
      depth: 3,
      d: [
        tubule(178, 148, 268, 22, 8),
        tubule(196, 246, 292, 26, 8),
        tubule(206, 300, 300, -20, 8),
        tubule(300, 120, 386, 24, 8),
      ].join(" "),
      focus: [170, 236, 130, 84],
      labelAt: [128, 250],
      leaderAt: [214, 258],
      blurb:
        "Long threads of DNA wound around proteins. They lie loose and tangled while the cell is going about its business, and only condense into the short thick chromosomes you can see when the cell divides.",
    },
    {
      id: "nucleolus",
      label: "Nucleolus",
      tint: T.nucleolus,
      depth: 4,
      d: circle(330, 160, 40),
      layers: [
        {
          d: dots(
            [
              [318, 148],
              [340, 152],
              [326, 170],
              [346, 174],
              [332, 140],
            ],
            4,
          ),
          as: "shade",
          opacity: 0.7,
        },
      ],
      focus: [286, 116, 88, 88],
      labelAt: [432, 132],
      leaderAt: [362, 148],
      blurb:
        "A dense knot with no membrane around it, where the parts of ribosomes are manufactured. It disappears when the cell starts to divide and reappears once two new nuclei have formed.",
    },
  ],
};

/* ═════════════════════════════════════════════════════ mitochondrion ══ */

export const mitochondrionFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.14",
  title: "Structure of a mitochondrion",
  caption:
    "Two membranes, the inner one thrown into folds called cristae, which is where respiration releases energy.",
  altText:
    "A cut-away diagram of a mitochondrion showing the smooth outer membrane, the folded inner membrane, the shelf-like cristae projecting inwards and the matrix that fills the interior. Selecting a label magnifies the diagram into that structure.",
  viewBox: [560, 360],
  parts: [
    {
      id: "outer-membrane",
      label: "Outer membrane",
      tint: T.mito,
      depth: 0,
      backdrop: true,
      d: ellipse(280, 180, 200, 110),
      focus: [82, 140, 84, 84],
      labelAt: [140, 58],
      leaderAt: [148, 96],
      blurb:
        "A smooth, continuous bag around the whole organelle. It is freely permeable to small molecules, so the space just inside it has much the same contents as the surrounding cytoplasm.",
    },
    {
      id: "inner-membrane",
      label: "Inner membrane",
      tint: T.membrane,
      depth: 1,
      backdrop: true,
      d: ellipse(280, 180, 182, 94),
      focus: [420, 148, 76, 76],
      labelAt: [420, 60],
      leaderAt: [434, 118],
      blurb:
        "A second, far more selective membrane. The proteins that actually capture energy sit in it, so the cell packs as much of it as possible into the space available — by folding it.",
    },
    {
      id: "matrix",
      label: "Matrix",
      tint: T.matrix,
      depth: 2,
      backdrop: true,
      d: ellipse(280, 180, 172, 84),
      focus: [244, 156, 76, 50],
      labelAt: [140, 320],
      leaderAt: [246, 250],
      blurb:
        "The thick fluid filling the interior. It holds the enzymes that break down food molecules, plus the mitochondrion's own small loop of DNA and its own ribosomes.",
    },
    {
      id: "cristae",
      label: "Cristae",
      tint: T.mito,
      depth: 3,
      // Flat base on the inner-membrane curve (its y at that x), rounded tip
      // reaching into the matrix — a shelf, not a free-floating bar.
      d: [
        "M165,122 L187,122 V204 q0,15 -11,15 q-11,0 -11,-15 Z",
        "M237,106 L259,106 V204 q0,15 -11,15 q-11,0 -11,-15 Z",
        "M309,106 L331,106 V204 q0,15 -11,15 q-11,0 -11,-15 Z",
        "M381,125 L403,125 V204 q0,15 -11,15 q-11,0 -11,-15 Z",
        "M201,249 L223,249 V156 q0,-15 -11,-15 q-11,0 -11,15 Z",
        "M273,256 L295,256 V156 q0,-15 -11,-15 q-11,0 -11,15 Z",
        "M345,247 L367,247 V156 q0,-15 -11,-15 q-11,0 -11,15 Z",
      ].join(" "),
      focus: [163, 96, 106, 136],
      labelAt: [420, 310],
      leaderAt: [356, 240],
      blurb:
        "Shelf-like folds of the inner membrane pushing into the matrix. They multiply the working surface many times over, which is why a hard-working cell such as a muscle cell is crammed with mitochondria.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════ chloroplast ══ */

export const chloroplastFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.15",
  title: "Structure of a chloroplast",
  caption:
    "Stacks of green discs suspended in a fluid, all wrapped in a double membrane — the machinery of photosynthesis.",
  altText:
    "A cut-away diagram of a chloroplast showing the double membrane, the stroma filling it, four stacks of thylakoid discs called grana and the lamellae connecting the stacks. Selecting a label magnifies the diagram into that structure.",
  viewBox: [560, 340],
  parts: [
    {
      id: "outer-membrane",
      label: "Double membrane",
      tint: T.chloroplast,
      depth: 0,
      backdrop: true,
      d: ellipse(280, 170, 210, 105),
      layers: [{ d: ellipse(280, 170, 194, 90), width: 1.4, opacity: 0.75 }],
      focus: [72, 132, 80, 76],
      labelAt: [126, 46],
      leaderAt: [148, 96],
      blurb:
        "Two membranes enclosing the whole organelle, the same arrangement a mitochondrion has. Both are thought to descend from free-living bacteria that were engulfed by an early cell.",
    },
    {
      id: "stroma",
      label: "Stroma",
      tint: T.stroma,
      depth: 1,
      backdrop: true,
      d: ellipse(280, 170, 184, 80),
      focus: [252, 216, 84, 50],
      labelAt: [126, 300],
      leaderAt: [268, 234],
      blurb:
        "The colourless fluid the stacks sit in. Once sunlight has been captured, it is here that carbon dioxide is actually built into sugar, using the energy the discs collected.",
    },
    {
      id: "granum",
      label: "Granum",
      tint: T.chloroplast,
      depth: 2,
      d: [
        discStack(150, 170, 5, 34, 8, 15),
        discStack(250, 140, 5, 32, 8, 14),
        discStack(350, 190, 5, 32, 8, 14),
        discStack(430, 160, 4, 26, 7, 13),
      ].join(" "),
      focus: [112, 126, 76, 90],
      labelAt: [434, 76],
      leaderAt: [356, 152],
      blurb:
        "A neat pile of flat discs called thylakoids. Chlorophyll is packed into their membranes, so stacking them is how the chloroplast squeezes the greatest possible light-catching area into one organelle.",
    },
    {
      id: "lamella",
      label: "Lamella",
      tint: T.stroma,
      depth: 3,
      d: [
        "M184,166 L216,146 L219,152 L187,172 Z",
        "M284,148 L316,182 L312,188 L280,154 Z",
        "M384,186 L412,164 L415,170 L387,192 Z",
      ].join(" "),
      focus: [176, 138, 52, 44],
      labelAt: [434, 268],
      leaderAt: [400, 180],
      blurb:
        "Flat membrane bridges running between one stack and the next. They connect the grana into a single continuous system, so the products of photosynthesis can move freely between stacks.",
    },
  ],
};

/* ═══════════════════════════════════════════════════ plasma membrane ══ */

/* The bilayer is a repeating unit, so it is generated rather than typed out:
 * forty phospholipids authored by hand would be forty chances to fat-finger a
 * coordinate. */
function bilayer() {
  const heads: string[] = [];
  const tails: string[] = [];
  for (let x = 56; x <= 584; x += 24) {
    heads.push(circle(x, 108, 10), circle(x, 212, 10));
    for (const s of [-5, 5]) {
      tails.push(
        `M${x + s - 1},118 C${x + s - 5},134 ${x + s + 1},146 ${x + s - 3},158 L${x + s + 1},159 C${x + s + 5},147 ${x + s - 1},135 ${x + s + 3},119 Z`,
      );
      tails.push(
        `M${x + s - 1},202 C${x + s - 5},186 ${x + s + 1},174 ${x + s - 3},162 L${x + s + 1},161 C${x + s + 5},173 ${x + s - 1},185 ${x + s + 3},201 Z`,
      );
    }
  }
  return { heads: heads.join(" "), tails: tails.join(" ") };
}

const LIPID = bilayer();

export const membraneFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.7",
  title: "Structure of a cell membrane",
  caption:
    "Two layers of phospholipid molecules, water-loving heads facing out and water-hating tails facing each other, with proteins embedded through them.",
  altText:
    "A magnified diagram of the cell membrane showing a double layer of phospholipid molecules with rounded hydrophilic heads and paired hydrophobic tails, a protein embedded in the layer and a channel protein forming a pore. Selecting a label magnifies the diagram into that structure.",
  viewBox: [640, 320],
  maxZoom: 4,
  parts: [
    {
      id: "tail",
      label: "Hydrophobic tail",
      tint: T.membrane,
      depth: 0,
      d: LIPID.tails,
      focus: [220, 116, 90, 88],
      labelAt: [40, 296],
      leaderAt: [300, 176],
      labelAlign: "start",
      blurb:
        "Two fatty chains per molecule that repel water, so they turn inwards and face each other. That oily middle layer is the real barrier: water-soluble substances cannot slip through it unaided.",
    },
    {
      id: "head",
      label: "Hydrophilic head",
      tint: T.nucleus,
      depth: 1,
      d: LIPID.heads,
      focus: [220, 84, 90, 52],
      labelAt: [40, 44],
      leaderAt: [296, 100],
      labelAlign: "start",
      blurb:
        "The rounded end of each phospholipid, which is attracted to water. Heads line the outer and inner faces of the membrane, where they meet the watery fluid on either side.",
    },
    {
      id: "protein",
      label: "Protein",
      tint: T.golgi,
      depth: 2,
      d: "M184,96 q22,-14 44,0 q10,26 -2,52 q-4,12 2,24 q12,26 0,52 q-22,14 -44,0 q-12,-26 0,-52 q6,-12 2,-24 q-12,-26 0,-52 Z",
      focus: [172, 84, 72, 156],
      labelAt: [330, 44],
      leaderAt: [206, 104],
      labelAlign: "middle",
      blurb:
        "A large molecule sitting in or across the layer. Membrane proteins do the recognising, the signalling and the ferrying — they are what makes the membrane selective rather than merely a barrier.",
    },
    {
      id: "channel",
      label: "Channel protein",
      tint: T.lysosome,
      depth: 3,
      d: [
        "M396,96 q14,-8 22,0 q-6,26 -2,52 q2,12 0,24 q-4,26 2,52 q-8,8 -22,0 q-12,-26 0,-52 q6,-12 2,-24 q-8,-26 -2,-52 Z",
        "M492,96 q-14,-8 -22,0 q6,26 2,52 q-2,12 0,24 q4,26 -2,52 q8,8 22,0 q12,-26 0,-52 q-6,-12 -2,-24 q8,-26 2,-52 Z",
      ].join(" "),
      layers: [
        {
          d: "M444,84 V236",
          width: 1.4,
          dash: "6 6",
          opacity: 0.6,
        },
      ],
      focus: [386, 84, 116, 156],
      labelAt: [600, 296],
      leaderAt: [444, 228],
      labelAlign: "end",
      blurb:
        "A protein with a water-filled tunnel down its middle. Charged particles that could never cross the oily interior pass through this pore instead, and the cell can open or shut it.",
    },
  ],
};

/* ══════════════════════════════════════════════════════ cell division ══ */

/* Six cells in a row, one per stage. Building them in a loop keeps the six
 * outlines identical, which is the whole point of the plate: the only thing
 * that changes from cell to cell is what the chromosomes are doing. */
const STAGE_X = (i: number) => 14 + i * 108;
const STAGE_CX = (i: number) => STAGE_X(i) + 48;
const STAGE_CY = 98;
const stageCell = (i: number) => roundRect(STAGE_X(i), 36, 96, 124, 10);
const stageFocus = (i: number): [number, number, number, number] => [
  STAGE_X(i) - 2,
  32,
  100,
  132,
];

export const mitosisFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.17",
  title: "Stages of cell division in onion root tip",
  caption:
    "One squashed onion root tip shows every stage at once, because neighbouring cells are never in step with each other.",
  altText:
    "Six onion root tip cells in a row, each frozen at a different stage of mitosis: interphase, prophase, metaphase, anaphase, telophase and two finished daughter cells. Selecting a stage magnifies that cell and explains what the chromosomes are doing.",
  viewBox: [660, 240],
  maxZoom: 3,
  parts: [
    {
      id: "interphase",
      label: "Interphase",
      tint: T.nucleus,
      depth: 0,
      backdrop: true,
      d: stageCell(0),
      layers: [
        { d: circle(STAGE_CX(0), STAGE_CY, 26), as: "shade", opacity: 0.55 },
        { d: circle(STAGE_CX(0), STAGE_CY, 26), width: 1.5 },
        { d: circle(STAGE_CX(0) + 4, STAGE_CY - 5, 9), as: "shade" },
      ],
      focus: stageFocus(0),
      labelAt: [STAGE_CX(0), 196],
      leaderAt: [STAGE_CX(0), 162],
      labelAlign: "middle",
      blurb:
        "The cell is not dividing yet. The nucleus looks plain because the DNA is still loose chromatin — but behind the scenes every chromosome is being copied, ready for the split to come.",
    },
    {
      id: "prophase",
      label: "Prophase",
      tint: T.nucleus,
      depth: 1,
      backdrop: true,
      d: stageCell(1),
      layers: [
        { d: circle(STAGE_CX(1), STAGE_CY, 28), width: 1.4, dash: "5 4", opacity: 0.8 },
        {
          d: chromosomes(
            [
              [STAGE_CX(1) - 13, STAGE_CY - 15],
              [STAGE_CX(1) + 12, STAGE_CY - 7],
              [STAGE_CX(1) - 11, STAGE_CY + 7],
              [STAGE_CX(1) + 13, STAGE_CY + 15],
            ],
            19,
            6,
          ),
          as: "shade",
        },
      ],
      focus: stageFocus(1),
      labelAt: [STAGE_CX(1), 196],
      leaderAt: [STAGE_CX(1), 162],
      labelAlign: "middle",
      blurb:
        "The threads coil up tight and become visible as separate chromosomes, each already doubled. The nuclear membrane starts to break apart, which is why it is drawn here as a broken line.",
    },
    {
      id: "metaphase",
      label: "Metaphase",
      tint: T.spindle,
      depth: 2,
      backdrop: true,
      d: stageCell(2),
      layers: [
        {
          d: [
            spindle(STAGE_CX(2), STAGE_CY - 48, STAGE_CY, 24),
            spindle(STAGE_CX(2), STAGE_CY + 48, STAGE_CY, 24),
          ].join(" "),
          width: 1,
          opacity: 0.65,
        },
        {
          d: chromosomes(
            [
              [STAGE_CX(2) - 21, STAGE_CY],
              [STAGE_CX(2) - 7, STAGE_CY],
              [STAGE_CX(2) + 7, STAGE_CY],
              [STAGE_CX(2) + 21, STAGE_CY],
            ],
            10,
            18,
          ),
          as: "shade",
          tint: T.chromatin,
        },
      ],
      focus: stageFocus(2),
      labelAt: [STAGE_CX(2), 196],
      leaderAt: [STAGE_CX(2), 162],
      labelAlign: "middle",
      blurb:
        "Every chromosome lines up in a single row across the middle of the cell, held by fine spindle fibres reaching from the two poles. Lining up first is what guarantees a fair share for each new cell.",
    },
    {
      id: "anaphase",
      label: "Anaphase",
      tint: T.spindle,
      depth: 3,
      backdrop: true,
      d: stageCell(3),
      layers: [
        {
          d: [
            spindle(STAGE_CX(3), STAGE_CY - 48, STAGE_CY - 22, 22),
            spindle(STAGE_CX(3), STAGE_CY + 48, STAGE_CY + 22, 22),
          ].join(" "),
          width: 1,
          opacity: 0.65,
        },
        {
          d: chromosomes(
            [
              [STAGE_CX(3) - 18, STAGE_CY - 26],
              [STAGE_CX(3) - 6, STAGE_CY - 30],
              [STAGE_CX(3) + 6, STAGE_CY - 30],
              [STAGE_CX(3) + 18, STAGE_CY - 26],
              [STAGE_CX(3) - 18, STAGE_CY + 26],
              [STAGE_CX(3) - 6, STAGE_CY + 30],
              [STAGE_CX(3) + 6, STAGE_CY + 30],
              [STAGE_CX(3) + 18, STAGE_CY + 26],
            ],
            10,
            16,
          ),
          as: "shade",
          tint: T.chromatin,
        },
      ],
      focus: stageFocus(3),
      labelAt: [STAGE_CX(3), 196],
      leaderAt: [STAGE_CX(3), 162],
      labelAlign: "middle",
      blurb:
        "The two halves of each chromosome are pulled apart and dragged to opposite ends of the cell. From this moment each end holds a complete, identical set of instructions.",
    },
    {
      id: "telophase",
      label: "Telophase",
      tint: T.nucleus,
      depth: 4,
      backdrop: true,
      d: stageCell(4),
      layers: [
        { d: circle(STAGE_CX(4), STAGE_CY - 28, 19), as: "shade", opacity: 0.55 },
        { d: circle(STAGE_CX(4), STAGE_CY + 28, 19), as: "shade", opacity: 0.55 },
        { d: circle(STAGE_CX(4), STAGE_CY - 28, 19), width: 1.5 },
        { d: circle(STAGE_CX(4), STAGE_CY + 28, 19), width: 1.5 },
      ],
      focus: stageFocus(4),
      labelAt: [STAGE_CX(4), 196],
      leaderAt: [STAGE_CX(4), 162],
      labelAlign: "middle",
      blurb:
        "A fresh nuclear membrane forms around each group of chromosomes and the threads uncoil again. There are now two nuclei, but still only one cell around them.",
    },
    {
      id: "cytokinesis",
      label: "Two cells",
      tint: T.wall,
      depth: 5,
      backdrop: true,
      d: stageCell(5),
      layers: [
        { d: `M${STAGE_X(5) + 4},${STAGE_CY} H${STAGE_X(5) + 92}`, width: 3.2 },
        { d: circle(STAGE_CX(5), STAGE_CY - 32, 17), as: "shade", opacity: 0.55 },
        { d: circle(STAGE_CX(5), STAGE_CY + 32, 17), as: "shade", opacity: 0.55 },
        { d: circle(STAGE_CX(5), STAGE_CY - 32, 17), width: 1.5 },
        { d: circle(STAGE_CX(5), STAGE_CY + 32, 17), width: 1.5 },
      ],
      focus: stageFocus(5),
      labelAt: [STAGE_CX(5), 196],
      leaderAt: [STAGE_CX(5), 162],
      labelAlign: "middle",
      blurb:
        "The cytoplasm divides. In a plant cell a new wall is laid down straight across the middle, giving two daughter cells with exactly the same chromosome number as the cell they came from.",
    },
  ],
};

/* ═════════════════════════════════════════════════════════ microscope ══ */

export const microscopeFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 2.2",
  title: "Structure of a light microscope",
  caption:
    "Two lenses in line: the objective makes the first magnified image, the eyepiece magnifies that image again.",
  altText:
    "A labelled diagram of a compound light microscope showing the eyepiece, body tube, arm, coarse and fine adjustment knobs, the revolving nosepiece with objective lenses, the stage with clips, the mirror and the base. Selecting a label magnifies the diagram into that part.",
  viewBox: [520, 460],
  parts: [
    {
      id: "base",
      label: "Base",
      tint: T.metal,
      depth: 0,
      backdrop: true,
      d: "M120,398 h220 a20,20 0 0 1 20,20 v6 a8,8 0 0 1 -8,8 H108 a8,8 0 0 1 -8,-8 v-6 a20,20 0 0 1 20,-20 Z",
      focus: [100, 392, 260, 46],
      labelAt: [86, 418],
      leaderAt: [150, 412],
      blurb:
        "The heavy foot the whole instrument stands on. Its weight matters: at four hundred times magnification the smallest wobble sweeps the specimen straight out of view.",
    },
    {
      id: "arm",
      label: "Arm",
      tint: T.metal,
      depth: 1,
      backdrop: true,
      d: "M296,146 C346,158 372,196 372,246 V368 a20,20 0 0 1 -20,20 h-44 a12,12 0 0 1 -12,-12 v-6 a12,12 0 0 1 12,-12 h30 V246 c0,-34 -18,-62 -50,-74 Z",
      focus: [292, 300, 90, 90],
      labelAt: [404, 186],
      leaderAt: [352, 214],
      blurb:
        "The curved limb joining the base to the body tube. It carries the focusing knobs, and it is the part you hold when you carry a microscope — with your other hand under the base.",
    },
    {
      id: "eyepiece",
      label: "Eyepiece",
      tint: T.glass,
      depth: 2,
      d: "M218,22 h44 a8,8 0 0 1 8,8 v36 h-60 V30 a8,8 0 0 1 8,-8 Z",
      focus: [206, 16, 72, 60],
      labelAt: [106, 40],
      leaderAt: [212, 44],
      blurb:
        "The lens you look through, usually marked 10x. It magnifies the image the objective has already made, so the two multiply: a 10x eyepiece over a 40x objective gives 400x in total.",
    },
    {
      id: "body-tube",
      label: "Body tube",
      tint: T.metal,
      depth: 3,
      backdrop: true,
      d: "M212,66 h56 a10,10 0 0 1 10,10 v116 a10,10 0 0 1 -10,10 h-56 a10,10 0 0 1 -10,-10 V76 a10,10 0 0 1 10,-10 Z",
      focus: [198, 66, 92, 136],
      labelAt: [106, 120],
      leaderAt: [206, 120],
      blurb:
        "The hollow tube holding the two lenses a fixed distance apart. Nothing must disturb that distance, which is why the tube is rigid and the focusing is done by moving it as a whole.",
    },
    {
      id: "objective",
      label: "Objective lens",
      tint: T.glass,
      depth: 4,
      d: [
        "M196,202 h88 a12,12 0 0 1 12,12 v12 a12,12 0 0 1 -12,12 h-88 a12,12 0 0 1 -12,-12 v-12 a12,12 0 0 1 12,-12 Z",
        "M206,238 h26 l-5,36 h-16 Z",
        "M248,238 h26 l-5,28 h-16 Z",
      ].join(" "),
      focus: [182, 198, 116, 80],
      labelAt: [106, 250],
      leaderAt: [216, 256],
      blurb:
        "The lens closest to the specimen, and the one that does the real work. Several sit on a revolving nosepiece so you can swing a stronger one into place without moving the slide.",
    },
    {
      id: "stage",
      label: "Stage",
      tint: T.metal,
      depth: 5,
      d: [
        "M132,292 h196 a6,6 0 0 1 6,6 v10 a6,6 0 0 1 -6,6 H132 a6,6 0 0 1 -6,-6 v-10 a6,6 0 0 1 6,-6 Z",
        "M170,282 h30 v10 h-30 Z",
        "M262,282 h30 v10 h-30 Z",
      ].join(" "),
      layers: [{ d: circle(230, 302, 14), width: 1.4, opacity: 0.7 }],
      focus: [124, 278, 216, 42],
      labelAt: [106, 306],
      leaderAt: [148, 300],
      blurb:
        "The flat platform the slide rests on, with two clips to stop it sliding. The hole in the middle lets light from below pass up through the specimen and into the objective.",
    },
    {
      id: "mirror",
      label: "Mirror",
      tint: T.glass,
      depth: 6,
      d: [ellipse(230, 356, 36, 21, -12), "M226,378 h10 v18 h-10 Z"].join(" "),
      focus: [190, 330, 82, 56],
      labelAt: [106, 362],
      leaderAt: [200, 352],
      blurb:
        "A tilting mirror that catches light and throws it up through the specimen. Angle it well and the field is bright and even; angle it badly and you see nothing at all, however good the lenses.",
    },
    {
      id: "coarse-adjustment",
      label: "Coarse adjustment",
      tint: T.golgi,
      depth: 7,
      d: circle(368, 252, 26),
      layers: [{ d: circle(368, 252, 13), width: 1.4, opacity: 0.7 }],
      focus: [340, 224, 56, 56],
      labelAt: [404, 250],
      leaderAt: [392, 250],
      blurb:
        "The big knob, which moves the tube a long way for every turn. Use it only with the lowest-power objective, and always watch from the side so the lens never crashes into the slide.",
    },
    {
      id: "fine-adjustment",
      label: "Fine adjustment",
      tint: T.golgi,
      depth: 8,
      d: circle(368, 306, 15),
      focus: [348, 286, 40, 40],
      labelAt: [404, 316],
      leaderAt: [382, 308],
      blurb:
        "The small knob, which shifts the tube by a hair for each turn. Once the coarse knob has the image roughly there, this is what brings the detail into sharp focus.",
    },
  ],
};
