import type { FigureSpec, FigureLayer } from "@/lib/sim/types";
import { circle, ellipse, dots, roundRect, stadium, cell, blob, gleam } from "@/lib/sim/draw";

/**
 * Chapter 3 plates — "Tissues".
 *
 * Most of this chapter is "here are the four kinds of X", which is why nearly
 * every plate here is a multi-panel one: the panels sit side by side so the
 * differences are visible at a glance, and magnifying a panel is how a student
 * gets from "they all look like blobs" to "that one has a thickened corner".
 *
 * THE FOUR COMPARISON PLATES (Fig 3.8, 3.11, 3.12, 3.13) STAY ON
 * `magnify: "camera"`. Converting them to `"part"` was tried and reverted —
 * it clamps every lift to 1.35× and drops the name tag onto the panel captions.
 *
 * Drawn from the biology, not traced. See the note at the top of ch-02.ts.
 */

const T = {
  parenchyma: "#7fd8a0",
  collenchyma: "#57c785",
  sclerenchyma: "#c9a86a",
  xylem: "#e0a45e",
  phloem: "#7fc4e8",
  meristem: "#f2b544",
  epithelium: "#8fd3f4",
  areolar: "#c9d3e0",
  adipose: "#f2d06b",
  bone: "#ded3c0",
  blood: "#e8506b",
  muscle: "#f4796b",
  smooth: "#f0a35e",
  cardiac: "#e86fa8",
  nerve: "#b39ddb",
  nucleus: "#8a6fd4",
  myelin: "#f2d06b",
  cellWall: "#a3c76d",
  axoplasm: "#d4c4e8",
  vesicle: "#e8a0cf",
  nissl: "#6f5ab8",
} as const;

/** Evenly spaced panel boxes across a 660-wide plate. */
function panelBoxes(
  count: number,
  top: number,
  height: number,
  margin = 12,
  gap = 12,
): [number, number, number, number][] {
  const width = (660 - margin * 2 - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, i) => [
    margin + i * (width + gap),
    top,
    width,
    height,
  ]);
}

/** A row of short parallel ticks — striations, cilia, pit markings. */
function ticks(
  x0: number,
  x1: number,
  y: number,
  length: number,
  step: number,
): string {
  const out: string[] = [];
  for (let x = x0; x <= x1; x += step) {
    out.push(`M${x.toFixed(1)},${y} V${(y + length).toFixed(1)}`);
  }
  return out.join(" ");
}

/** Small square dividing cells — the hallmark of a meristem. */
function dividingCells(
  cx: number,
  cy: number,
  cols: number,
  rows: number,
  size: number,
  gap: number,
): string {
  const out: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = cx - ((cols - 1) * (size + gap)) / 2 + c * (size + gap);
      const y = cy - ((rows - 1) * (size + gap)) / 2 + r * (size + gap);
      out.push(`M${x},${y} h${size} v${size} h${-size} Z`);
    }
  }
  return out.join(" ");
}

/** Nuclei dots inside a grid of dividing cells. */
function cellNuclei(
  cx: number,
  cy: number,
  cols: number,
  rows: number,
  size: number,
  gap: number,
  radius: number,
): string {
  const pts: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = cx - ((cols - 1) * (size + gap)) / 2 + c * (size + gap) + size / 2;
      const y = cy - ((rows - 1) * (size + gap)) / 2 + r * (size + gap) + size / 2;
      pts.push([x, y]);
    }
  }
  return dots(pts, radius);
}

/** Polygonal tissue cell — drawn as a 5–7 sided irregular polygon. */
function polyCell(cx: number, cy: number, r: number, seed: number, sides = 6): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    const wobble = 0.85 + (Math.sin((seed + 1) * 12.9898 + i * 78.233) * 43758.5453 % 1) * 0.3;
    const x = cx + Math.cos(angle) * r * wobble;
    const y = cy + Math.sin(angle) * r * wobble;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts[0]} L${pts.slice(1).join(" L")} Z`;
}

/* ══════════════════════════════════════════════════════════ meristems ══ */

export const meristemFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.3",
  title: "Where a plant grows from",
  caption:
    "A plant does not grow all over. Division is confined to meristems: at the tips, at the nodes, and in a ring inside the stem.",
  altText:
    "A young plant showing the five kinds of meristematic region: shoot-tip meristem and root-tip meristem at the tips, intercalary meristem at a node, and lateral meristem as a ring inside the stem. Selecting a label lifts that region out enlarged and explains what it does.",
  viewBox: [660, 480],
  magnify: "part",
  scenery: [
    // Stem, leaves and roots — context only, never clickable.
    {
      d: "M232,392 C226,318 230,236 238,150 L272,150 C280,236 284,318 278,392 Z",
      as: "fill",
      tint: "#8fbf5e",
    },
    {
      d: "M238,252 C200,232 156,236 124,262 C158,288 206,286 240,266 Z M274,276 C312,256 356,260 388,286 C354,312 306,310 272,290 Z",
      as: "fill",
      tint: "#57c785",
    },
    {
      d: "M238,392 C226,420 206,438 178,452 M278,392 C292,420 312,438 340,452 M256,392 V456 M246,418 C234,430 222,436 208,442 M268,422 C280,434 294,440 308,446",
      width: 3,
      tint: "#c9a86a",
    },
  ],
  parts: [
    {
      id: "shoot-tip",
      label: "Shoot-tip meristem",
      tint: T.meristem,
      depth: 0,
      d: "M236,150 C234,122 244,102 255,100 C266,102 276,122 274,150 Z",
      layers: [
        // Dense, small, square dividing cells packed together
        { d: dividingCells(255, 126, 4, 3, 8, 2), as: "shade" , clip: true },
        // A nucleus in each dividing cell
        { d: cellNuclei(255, 126, 4, 3, 8, 2, 2), as: "shade", opacity: 0.9 , clip: true },
        { d: gleam(250, 114, 12, 16), as: "light", opacity: 0.35 },
      ],
      focus: [228, 92, 56, 66],
      labelAt: [492, 100],
      leaderAt: [272, 120],
      blurb:
        "Cells at the very tip of the shoot divide faster than anywhere else above ground. Each division pushes the stem a little higher, which is why shoots always grow from their tips upward toward the light.",
    },
    {
      id: "root-tip",
      label: "Root-tip meristem",
      tint: T.meristem,
      depth: 1,
      d: "M246,420 C244,438 249,452 256,457 C263,452 268,438 266,420 Z",
      layers: [
        // Dense dividing cells at the root apex
        { d: dividingCells(256, 438, 3, 3, 6, 1.5), as: "shade" , clip: true },
        { d: cellNuclei(256, 438, 3, 3, 6, 1.5, 1.5), as: "shade", opacity: 0.9 , clip: true },
        { d: gleam(253, 432, 8, 10), as: "light", opacity: 0.3 },
      ],
      focus: [240, 414, 32, 48],
      labelAt: [400, 430],
      leaderAt: [268, 440],
      blurb:
        "Cells at the root tip divide to push the root deeper into the soil. A cap of dead cells shields them from the abrasion of soil particles, wearing away and being replaced continuously.",
    },
    {
      id: "intercalary",
      label: "Intercalary meristem",
      tint: T.meristem,
      depth: 2,
      d: roundRect(230, 252, 50, 26, 8),
      layers: [
        // Band of dividing cells at the node
        { d: dividingCells(255, 265, 5, 2, 7, 2), as: "shade" , clip: true },
        { d: cellNuclei(255, 265, 5, 2, 7, 2, 1.8), as: "shade", opacity: 0.85 , clip: true },
        { d: gleam(248, 256, 16, 8), as: "light", opacity: 0.3 },
      ],
      focus: [220, 242, 70, 46],
      labelAt: [110, 190],
      leaderAt: [232, 262],
      blurb:
        "A band of dividing cells left behind at the base of a leaf or at a node. It is why grass keeps growing after it is mown — the growing point is below the blade, not at the tip.",
    },
    {
      id: "lateral",
      label: "Lateral meristem",
      tint: T.meristem,
      depth: 3,
      d: [roundRect(238, 300, 10, 84, 5), roundRect(266, 300, 10, 84, 5)].join(" "),
      layers: [
        // Thin files of dividing cells running longitudinally
        { d: "M240,308 V376 M242,312 V372 M244,316 V368 M268,308 V376 M270,312 V372 M272,316 V368", width: 1.2, opacity: 0.65 },
        { d: dots([[243, 320], [243, 342], [243, 364], [271, 330], [271, 352], [271, 374]], 1.8), as: "shade", opacity: 0.9 },
        { d: gleam(242, 326, 4, 28), as: "light", opacity: 0.3 },
      ],
      focus: [228, 292, 58, 100],
      labelAt: [492, 344],
      leaderAt: [278, 342],
      blurb:
        "A thin cylinder of dividing cells running the length of the stem, also called cambium. It adds cells sideways, so the trunk thickens year after year rather than merely getting taller.",
    },
    {
      id: "vacuolated",
      label: "Permanent cells",
      tint: T.parenchyma,
      depth: 4,
      d: [
        cell(255, 186, 16, 12, 1),
        cell(240, 206, 14, 11, 2),
        cell(270, 200, 15, 12, 3),
        cell(252, 222, 16, 13, 4),
      ].join(" "),
      layers: [
        // Large vacuoles — the contrast with the meristematic cells
        { d: [ellipse(255, 186, 10, 7), ellipse(240, 206, 9, 6), ellipse(270, 200, 10, 7), ellipse(252, 222, 11, 8)].join(" "), as: "light", opacity: 0.5 },
        { d: dots([[255, 190], [240, 210], [270, 204], [252, 226]], 3), as: "shade" },
        { d: gleam(250, 196, 12, 14), as: "light", opacity: 0.3 },
      ],
      focus: [224, 172, 64, 62],
      labelAt: [132, 248],
      leaderAt: [234, 210],
      blurb:
        "Older cells that have stopped dividing and grown large, with a big central vacuole. Compared to the meristematic cells above, they are visibly bigger, rounder, and far less densely packed.",
    },
  ],
};

/* ════════════════════════════════════════════ simple permanent tissue ══ */

const simplePanels = panelBoxes(3, 24, 178);

export const simpleTissueFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.8",
  title: "Simple permanent tissues",
  caption:
    "All three are made of one kind of cell. What separates them is the wall: thin, thickened at the corners, or thick enough to kill the cell.",
  altText:
    "Three panels comparing parenchyma, collenchyma and sclerenchyma. Parenchyma has thin-walled polygonal cells with air spaces between them, collenchyma has extra wall material at the corners, and sclerenchyma has walls so thick that only a narrow lumen is left. Selecting a panel magnifies it.",
  viewBox: [660, 240],
  panels: [
    { id: "p0", caption: "Parenchyma", box: simplePanels[0] },
    { id: "p1", caption: "Collenchyma", box: simplePanels[1] },
    { id: "p2", caption: "Sclerenchyma", box: simplePanels[2] },
  ],
  parts: [
    {
      id: "parenchyma",
      label: "Parenchyma",
      tint: T.parenchyma,
      panel: "p0",
      depth: 0,
      d: [
        polyCell(60, 74, 28, 1, 6),
        polyCell(128, 68, 26, 2, 5),
        polyCell(162, 128, 26, 3, 6),
        polyCell(92, 138, 30, 4, 7),
        polyCell(34, 140, 22, 5, 5),
        polyCell(96, 82, 14, 6, 5),
      ].join(" "),
      layers: [
        // Nucleus in each cell
        { d: dots([[60, 74], [128, 68], [162, 128], [92, 138], [34, 140]], 6), as: "shade" },
        // Nucleolus inside nucleus
        { d: dots([[60, 74], [128, 68], [162, 128], [92, 138], [34, 140]], 2.5), as: "shade", opacity: 0.8 },
        // Intercellular spaces — triangular gaps visible between cells
        {
          d: [
            "M88,94 L96,84 L104,96 Z",
            "M138,100 L148,92 L152,104 Z",
            "M60,112 L68,104 L72,116 Z",
          ].join(" "),
          as: "panel",
          opacity: 0.5,
        },
      ],
      focus: simplePanels[0],
      blurb:
        "Living cells with thin walls, loosely packed so air spaces are left between them. It is the plant's all-purpose filler: it stores food, and where it holds chloroplasts it photosynthesises too.",
    },
    {
      id: "collenchyma",
      label: "Collenchyma",
      tint: T.collenchyma,
      panel: "p1",
      depth: 1,
      d: [
        polyCell(268, 78, 30, 7, 6),
        polyCell(340, 72, 28, 8, 6),
        polyCell(268, 148, 30, 9, 6),
        polyCell(340, 142, 28, 10, 6),
        polyCell(406, 108, 24, 11, 5),
      ].join(" "),
      layers: [
        // Corner thickenings — THE DIAGNOSTIC FEATURE. Extra wall material
        // piled into the corners of each cell where cell walls meet.
        {
          d: [
            // Top-left cluster of corners
            circle(244, 56, 8), circle(292, 56, 8), circle(244, 100, 8), circle(292, 100, 8),
            // Top-right cluster
            circle(316, 50, 7), circle(364, 50, 7), circle(316, 94, 7), circle(364, 94, 7),
            // Bottom-left cluster
            circle(244, 126, 8), circle(292, 126, 8), circle(244, 170, 8), circle(292, 170, 8),
            // Bottom-right cluster
            circle(316, 120, 7), circle(364, 120, 7), circle(316, 164, 7), circle(364, 164, 7),
          ].join(" "),
          as: "shade",
          opacity: 0.7,
        },
        // Nuclei
        { d: dots([[268, 78], [340, 72], [268, 148], [340, 142], [406, 108]], 5.5), as: "shade" },
        // Nucleoli
        { d: dots([[268, 78], [340, 72], [268, 148], [340, 142], [406, 108]], 2), as: "shade", opacity: 0.8 },
      ],
      focus: simplePanels[1],
      blurb:
        "Living cells with extra wall material heaped into the corners. That uneven thickening gives a young stem flexible strength — it can bend in the wind without snapping or splitting.",
    },
    {
      id: "sclerenchyma",
      label: "Sclerenchyma",
      tint: T.sclerenchyma,
      panel: "p2",
      depth: 2,
      // Genuinely polygonal cells — NOT rounded. These are dead cells
      // with thick, lignified walls and only a narrow lumen left.
      d: [
        polyCell(490, 78, 30, 12, 6),
        polyCell(560, 72, 28, 13, 5),
        polyCell(628, 80, 26, 14, 6),
        polyCell(490, 148, 28, 15, 5),
        polyCell(560, 144, 30, 16, 6),
        polyCell(628, 150, 26, 17, 5),
      ].join(" "),
      layers: [
        // Thick lignified walls shown as a shade layer covering most of the cell
        {
          d: [
            polyCell(490, 78, 26, 12, 6),
            polyCell(560, 72, 24, 13, 5),
            polyCell(628, 80, 22, 14, 6),
            polyCell(490, 148, 24, 15, 5),
            polyCell(560, 144, 26, 16, 6),
            polyCell(628, 150, 22, 17, 5),
          ].join(" "),
          as: "shade",
          opacity: 0.5,
        },
        // Narrow dead lumens — the tiny space left inside
        {
          d: [
            polyCell(490, 78, 8, 120, 4),
            polyCell(560, 72, 7, 130, 4),
            polyCell(628, 80, 6, 140, 4),
            polyCell(490, 148, 7, 150, 4),
            polyCell(560, 144, 8, 160, 4),
            polyCell(628, 150, 6, 170, 4),
          ].join(" "),
          as: "panel",
        },
      ],
      focus: simplePanels[2],
      blurb:
        "Long cells whose walls are thickened with lignin until only a narrow lumen is left. The cells die in the process, but the dead walls make the hardest, stiffest tissue the plant has.",
    },
  ],
};

/* ══════════════════════════════════════════════════════ vascular tissue ══ */

const vascPanels = panelBoxes(2, 18, 282);

export const vascularTissueFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.9",
  title: "Vascular tissue: xylem and phloem",
  caption:
    "Two plumbing systems in one plant. Xylem carries water up through dead, hollow pipes; phloem carries food both ways through living tubes.",
  altText:
    "Two panels of conducting tissue. The xylem panel shows a wide vessel with annular lignin thickening, a tapered tracheid with pits, and xylem parenchyma. The phloem panel shows a sieve tube with sieve plates bearing visible pores, a companion cell with dense cytoplasm and large nucleus, and phloem fibre. Selecting a label magnifies that cell.",
  viewBox: [660, 340],
  magnify: "part",
  panels: [
    { id: "xylem", caption: "(a) Xylem — water, upward only", box: vascPanels[0] },
    { id: "phloem", caption: "(b) Phloem — food, both ways", box: vascPanels[1] },
  ],
  parts: [
    {
      id: "vessel",
      label: "Vessel",
      tint: T.xylem,
      panel: "xylem",
      depth: 0,
      d: roundRect(46, 44, 72, 190, 10),
      layers: [
        // Perforated end walls
        { d: "M46,104 H118 M46,174 H118", width: 2.2, dash: "9 7" },
        // ANNULAR / SPIRAL LIGNIN THICKENING BANDS — the diagnostic feature
        // Drawn as horizontal rings inside the vessel, representing the
        // thickening pattern laid down by the vessel before it died.
        {
          d: [
            "M54,60 H110", "M54,72 H110", "M54,84 H110", "M54,96 H110",
            "M54,116 H110", "M54,128 H110", "M54,140 H110", "M54,152 H110",
            "M54,164 H110",
            "M54,186 H110", "M54,198 H110", "M54,210 H110", "M54,222 H110",
          ].join(" "),
          width: 2.0,
          opacity: 0.55,
        },
        { d: gleam(72, 100, 28, 60), as: "light", opacity: 0.3 },
      ],
      focus: [38, 36, 88, 206],
      labelAt: [16, 262],
      leaderAt: [82, 234],
      labelAlign: "start",
      blurb:
        "A wide pipe made from dead cells stacked end to end, with annular lignin rings banding the wall. Water pulled up from the roots runs through it in an unbroken column, like water through a drainpipe.",
    },
    {
      id: "tracheid",
      label: "Tracheid",
      tint: T.xylem,
      panel: "xylem",
      depth: 1,
      // Tapered at both ends — the hallmark of a tracheid
      d: "M160,54 C160,44 170,38 178,44 C186,50 186,54 186,64 V208 C186,218 186,222 178,228 C170,234 160,228 160,218 Z",
      layers: [
        // Bordered pits along the side walls — how water crosses between tracheids
        {
          d: [
            circle(158, 80, 5), circle(188, 100, 5), circle(158, 120, 5),
            circle(188, 140, 5), circle(158, 160, 5), circle(188, 180, 5),
            circle(158, 200, 5),
          ].join(" "),
          as: "panel",
          opacity: 0.6,
        },
        { d: gleam(172, 100, 10, 50), as: "light", opacity: 0.3 },
      ],
      focus: [150, 32, 46, 206],
      labelAt: [150, 288],
      leaderAt: [170, 232],
      labelAlign: "middle",
      blurb:
        "A narrower dead cell tapered at both ends, with bordered pits in its side walls. Water crosses from one tracheid to the next through those pits, so flow is slower than in a vessel.",
    },
    {
      id: "xylem-parenchyma",
      label: "Xylem parenchyma",
      tint: T.parenchyma,
      panel: "xylem",
      depth: 2,
      d: [roundRect(222, 44, 42, 92, 10), roundRect(222, 142, 42, 92, 10)].join(" "),
      layers: [
        // Nuclei — these are the only LIVING cells in xylem
        { d: dots([[243, 90], [243, 188]], 8), as: "shade" },
        { d: dots([[243, 90], [243, 188]], 3), as: "shade", opacity: 0.7 },
        { d: gleam(238, 68, 14, 26), as: "light", opacity: 0.3 },
      ],
      focus: [214, 36, 58, 206],
      labelAt: [318, 262],
      leaderAt: [264, 198],
      labelAlign: "end",
      blurb:
        "The only living cells in xylem. They store food and help move water sideways out of the conducting pipes into the surrounding tissue.",
    },
    {
      id: "sieve-tube",
      label: "Sieve tube",
      tint: T.phloem,
      panel: "phloem",
      depth: 3,
      d: roundRect(386, 44, 70, 190, 10),
      layers: [
        // SIEVE PLATES WITH PORES — the diagnostic feature of sieve tubes.
        // The end walls between cells survive as perforated plates.
        { d: "M386,104 H456 M386,174 H456", width: 2.8 },
        // The pores — larger and more prominent than before
        {
          d: [
            circle(398, 104, 4), circle(414, 104, 4), circle(430, 104, 4), circle(446, 104, 4),
            circle(406, 104, 3), circle(422, 104, 3), circle(438, 104, 3),
            circle(398, 174, 4), circle(414, 174, 4), circle(430, 174, 4), circle(446, 174, 4),
            circle(406, 174, 3), circle(422, 174, 3), circle(438, 174, 3),
          ].join(" "),
          as: "panel",
        },
        // Thin cytoplasm lining — sieve tubes lose their nucleus but keep cytoplasm
        { d: "M394,50 V98 M448,50 V98 M394,110 V168 M448,110 V168 M394,180 V228", width: 1.6, opacity: 0.35 },
        { d: gleam(414, 90, 24, 50), as: "light", opacity: 0.25 },
      ],
      focus: [378, 36, 86, 206],
      labelAt: [352, 262],
      leaderAt: [420, 234],
      labelAlign: "start",
      blurb:
        "A living tube whose end walls survive as perforated sieve plates. Dissolved sugars made in the leaves flow through those pores to wherever the plant needs them — upward or downward.",
    },
    {
      id: "companion-cell",
      label: "Companion cell",
      tint: T.phloem,
      panel: "phloem",
      depth: 4,
      d: roundRect(468, 60, 38, 158, 8),
      layers: [
        // Dense cytoplasm — companion cells are metabolically very active
        {
          d: dots(
            [
              [478, 80], [496, 80], [478, 100], [496, 100],
              [478, 120], [496, 120], [478, 140], [496, 140],
              [478, 160], [496, 160], [478, 180], [496, 180],
              [478, 200], [496, 200],
            ],
            3,
          ),
          as: "shade",
          opacity: 0.4,
        },
        // Large, prominent nucleus — the hallmark of a companion cell
        { d: circle(487, 110, 13), as: "shade" },
        { d: circle(487, 110, 5), as: "shade", opacity: 0.7 },
        { d: gleam(484, 96, 12, 18), as: "light", opacity: 0.3 },
      ],
      focus: [460, 52, 54, 174],
      labelAt: [468, 288],
      leaderAt: [490, 218],
      labelAlign: "middle",
      blurb:
        "A narrow living cell pressed against the sieve tube, packed with dense cytoplasm and a large nucleus. A mature sieve tube has lost its nucleus, so this neighbour keeps it alive and does its housekeeping.",
    },
    {
      id: "phloem-parenchyma",
      label: "Phloem fibre",
      tint: T.sclerenchyma,
      panel: "phloem",
      depth: 5,
      d: roundRect(518, 60, 34, 158, 8),
      layers: [
        // Narrow dead lumen — thick-walled fibre
        { d: roundRect(529, 78, 12, 122, 6), as: "panel" },
        // Lignified wall shading
        { d: "M524,66 V212 M546,66 V212", width: 1.2, opacity: 0.3 },
        { d: gleam(532, 100, 8, 40), as: "light", opacity: 0.25 },
      ],
      focus: [510, 52, 50, 174],
      labelAt: [648, 262],
      leaderAt: [552, 210],
      labelAlign: "end",
      blurb:
        "Thick-walled dead cells running alongside the tubes, giving the bundle its strength. Jute and flax fibres, spun into rope and linen, are exactly this tissue.",
    },
  ],
};

/* ═══════════════════════════════════════════════════ epithelial tissue ══ */

const epiPanels = panelBoxes(4, 24, 168);

const basement = (x0: number, x1: number): FigureLayer => ({
  d: `M${x0},160 H${x1}`,
  width: 2.4,
  opacity: 0.55,
});

export const epithelialFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.11",
  title: "Types of epithelial tissue",
  caption:
    "Every epithelium is a sheet of tightly packed cells on a basement membrane. The shape of the cell tells you what the sheet is for.",
  altText:
    "Four panels of epithelial tissue: flat squamous cells, cube-shaped cuboidal cells, tall columnar cells, and columnar cells carrying cilia. All four sit on a basement membrane with a nucleus in every cell. Selecting a panel magnifies it.",
  viewBox: [660, 232],
  panels: [
    { id: "sq", caption: "Squamous", box: epiPanels[0] },
    { id: "cu", caption: "Cuboidal", box: epiPanels[1] },
    { id: "co", caption: "Columnar", box: epiPanels[2] },
    { id: "ci", caption: "Ciliated", box: epiPanels[3] },
  ],
  parts: [
    {
      id: "squamous",
      label: "Squamous",
      tint: T.epithelium,
      panel: "sq",
      depth: 0,
      d: [stadium(24, 118, 42, 26), stadium(68, 118, 42, 26), stadium(112, 118, 42, 26)].join(" "),
      layers: [
        // Nucleus in each cell
        { d: dots([[45, 131], [89, 131], [133, 131]], 7), as: "shade" },
        // Nucleolus
        { d: dots([[45, 131], [89, 131], [133, 131]], 2.5), as: "shade", opacity: 0.7 },
        // Basement membrane
        basement(20, 156),
      ],
      focus: epiPanels[0],
      blurb:
        "Cells so flat and thin that substances pass straight through them. They line the air sacs of the lungs and the walls of blood capillaries, where the whole job is letting things across quickly.",
    },
    {
      id: "cuboidal",
      label: "Cuboidal",
      tint: T.epithelium,
      panel: "cu",
      depth: 1,
      d: [roundRect(186, 104, 36, 36, 6), roundRect(226, 104, 36, 36, 6), roundRect(266, 104, 36, 36, 6)].join(" "),
      layers: [
        // Nucleus in each cell
        { d: dots([[204, 122], [244, 122], [284, 122]], 8), as: "shade" },
        // Nucleolus
        { d: dots([[204, 122], [244, 122], [284, 122]], 3), as: "shade", opacity: 0.7 },
        // Basement membrane
        basement(182, 306),
      ],
      focus: epiPanels[1],
      blurb:
        "Cube-shaped cells forming the lining of kidney tubules and the ducts of glands. They are thick enough to do real chemical work — absorbing and secreting rather than just letting things past.",
    },
    {
      id: "columnar",
      label: "Columnar",
      tint: T.epithelium,
      panel: "co",
      depth: 2,
      d: [roundRect(350, 56, 36, 104, 6), roundRect(390, 56, 36, 104, 6), roundRect(430, 56, 36, 104, 6)].join(" "),
      layers: [
        // Nucleus in each cell — positioned toward the base
        { d: dots([[368, 136], [408, 136], [448, 136]], 8), as: "shade" },
        // Nucleolus
        { d: dots([[368, 136], [408, 136], [448, 136]], 3), as: "shade", opacity: 0.7 },
        // Basement membrane
        basement(346, 470),
      ],
      focus: epiPanels[2],
      blurb:
        "Tall pillar-shaped cells lining the stomach and intestine. The extra height gives room for the machinery of absorption and for glands that secrete mucus and digestive juices.",
    },
    {
      id: "ciliated",
      label: "Ciliated columnar",
      tint: T.epithelium,
      panel: "ci",
      depth: 3,
      d: [roundRect(512, 68, 36, 92, 6), roundRect(552, 68, 36, 92, 6), roundRect(592, 68, 36, 92, 6)].join(" "),
      layers: [
        // Cilia at the top — beating hairs
        { d: ticks(516, 624, 52, 16, 8), width: 1.6, opacity: 0.85 },
        // Nucleus in each cell
        { d: dots([[530, 138], [570, 138], [610, 138]], 8), as: "shade" },
        // Nucleolus
        { d: dots([[530, 138], [570, 138], [610, 138]], 3), as: "shade", opacity: 0.7 },
        // Basement membrane
        basement(508, 632),
      ],
      focus: epiPanels[3],
      blurb:
        "Columnar cells topped with tiny beating hairs. In your windpipe they sweep dust and mucus steadily upward and away from the lungs, all day, without you ever noticing.",
    },
  ],
};

/* ═══════════════════════════════════════════════════ connective tissue ══ */

const conPanels = panelBoxes(4, 24, 178);

export const connectiveFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.12",
  title: "Types of connective tissue",
  caption:
    "Cells scattered in a matrix. Change the matrix — jelly, fat, hard mineral, liquid — and you get four tissues that look nothing alike.",
  altText:
    "Four panels of connective tissue: areolar tissue with cells among loose fibres, adipose tissue of fat-filled cells, bone showing concentric rings around a central canal, and blood with red cells, a white cell and platelets. Selecting a panel magnifies it.",
  viewBox: [660, 240],
  panels: [
    { id: "ar", caption: "Areolar", box: conPanels[0] },
    { id: "ad", caption: "Adipose", box: conPanels[1] },
    { id: "bo", caption: "Bone", box: conPanels[2] },
    { id: "bl", caption: "Blood", box: conPanels[3] },
  ],
  parts: [
    {
      id: "areolar",
      label: "Areolar",
      tint: T.areolar,
      panel: "ar",
      depth: 0,
      d: [circle(48, 78, 13), circle(102, 116, 12), circle(58, 152, 11), circle(126, 68, 10)].join(" "),
      layers: [
        {
          d: [
            "M20,58 C50,72 74,48 104,64 C126,76 146,58 156,68",
            "M20,98 C48,112 76,86 106,104 C130,118 146,98 156,108",
            "M20,138 C50,152 72,128 102,146 C126,160 146,140 156,150",
            "M22,176 C52,188 74,164 104,182 C128,194 146,174 156,184",
          ].join(" "),
          width: 1.6,
          opacity: 0.8,
        },
      ],
      focus: conPanels[0],
      blurb:
        "A loose mesh of fibres with cells scattered through it. It fills the spaces inside organs, packs around muscles and nerves, and is the tissue that repairs a wound.",
    },
    {
      id: "adipose",
      label: "Adipose",
      tint: T.adipose,
      panel: "ad",
      depth: 1,
      d: [circle(216, 78, 32), circle(284, 84, 30), circle(238, 150, 34), circle(298, 154, 26)].join(" "),
      layers: [
        {
          d: [circle(216, 78, 23), circle(284, 84, 22), circle(238, 150, 25), circle(298, 154, 18)].join(" "),
          as: "light",
          opacity: 0.55,
        },
        // Nucleus squashed against the rim by the fat droplet.
        { d: dots([[216, 104], [284, 108], [238, 178], [298, 174]], 6), as: "shade" },
      ],
      focus: conPanels[1],
      blurb:
        "Cells so full of stored fat that the nucleus is squashed against the wall. Found below the skin and around organs, it is the body's energy store and its insulation against cold.",
    },
    {
      id: "bone",
      label: "Bone",
      tint: T.bone,
      panel: "bo",
      depth: 2,
      d: circle(411, 113, 74),
      layers: [
        { d: circle(411, 113, 58), width: 1.4, opacity: 0.7 },
        { d: circle(411, 113, 42), width: 1.4, opacity: 0.7 },
        { d: circle(411, 113, 26), width: 1.4, opacity: 0.7 },
        { d: circle(411, 113, 13), as: "panel" },
        {
          d: [
            ellipse(411, 63, 7, 3.5),
            ellipse(461, 113, 3.5, 7),
            ellipse(411, 163, 7, 3.5),
            ellipse(361, 113, 3.5, 7),
            ellipse(444, 80, 6, 4, -45),
            ellipse(378, 146, 6, 4, -45),
          ].join(" "),
          as: "shade",
        },
      ],
      focus: conPanels[2],
      blurb:
        "A hard matrix of calcium and phosphorus laid down in rings around a central canal that carries blood vessels. The bone cells sit in small cavities between the rings, still alive.",
    },
    {
      id: "blood",
      label: "Blood",
      tint: T.blood,
      panel: "bl",
      depth: 3,
      d: [
        circle(534, 70, 18),
        circle(596, 86, 18),
        circle(540, 132, 18),
        circle(600, 160, 18),
        circle(556, 182, 16),
      ].join(" "),
      layers: [
        {
          d: [circle(534, 70, 8), circle(596, 86, 8), circle(540, 132, 8), circle(600, 160, 8), circle(556, 182, 7)].join(" "),
          as: "shade",
          opacity: 0.75,
        },
        {
          d: circle(620, 120, 19),
          as: "light",
        },
        { d: [circle(614, 114, 8), circle(626, 124, 8)].join(" "), as: "shade" },
        { d: [ellipse(512, 108, 6, 3, 20), ellipse(578, 148, 6, 3, -30)].join(" "), as: "light" },
      ],
      focus: conPanels[3],
      blurb:
        "The one connective tissue with a liquid matrix. Red cells carry oxygen, white cells fight infection, platelets seal leaks, and plasma carries all three plus food and waste.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════ muscle tissue ══ */

const musPanels = panelBoxes(3, 24, 178);

export const muscleFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.13",
  title: "Types of muscle",
  caption:
    "Tell them apart by three questions: is it striped, is it branched, and can you decide when it contracts?",
  altText:
    "Three panels of muscle tissue: striated muscle as long striped fibres with many nuclei at the edge, smooth muscle as spindle-shaped cells with one central nucleus, and cardiac muscle as branched striped fibres joined by intercalated discs. Selecting a panel magnifies it.",
  viewBox: [660, 240],
  panels: [
    { id: "st", caption: "Striated (voluntary)", box: musPanels[0] },
    { id: "sm", caption: "Smooth (involuntary)", box: musPanels[1] },
    { id: "ca", caption: "Cardiac", box: musPanels[2] },
  ],
  parts: [
    {
      id: "striated",
      label: "Striated muscle",
      tint: T.muscle,
      panel: "st",
      depth: 0,
      d: [stadium(24, 62, 180, 44), stadium(24, 122, 180, 44)].join(" "),
      layers: [
        // Striations — the alternating light and dark bands, drawn with
        // closer spacing so they read at rail size (~590px wide)
        { d: ticks(36, 194, 66, 36, 8), width: 1.8, opacity: 0.7 },
        { d: ticks(36, 194, 126, 36, 8), width: 1.8, opacity: 0.7 },
        // Many nuclei, all pushed to the edge of the fibre.
        {
          d: [
            ellipse(60, 72, 9, 5),
            ellipse(120, 72, 9, 5),
            ellipse(176, 72, 9, 5),
            ellipse(80, 132, 9, 5),
            ellipse(148, 132, 9, 5),
          ].join(" "),
          as: "shade",
        },
      ],
      focus: musPanels[0],
      blurb:
        "Long cylindrical fibres with alternating light and dark bands and many nuclei pushed to the edge. These are the muscles attached to your bones, and they contract when you decide they should.",
    },
    {
      id: "smooth",
      label: "Smooth muscle",
      tint: T.smooth,
      panel: "sm",
      depth: 1,
      d: [ellipse(320, 70, 78, 17, -5), ellipse(340, 116, 80, 18, 4), ellipse(316, 162, 74, 16, -3)].join(" "),
      layers: [
        {
          d: [ellipse(320, 70, 13, 6), ellipse(340, 116, 13, 6), ellipse(316, 162, 12, 5.5)].join(" "),
          as: "shade",
        },
      ],
      focus: musPanels[1],
      blurb:
        "Spindle-shaped cells, pointed at both ends, with a single nucleus in the middle and no stripes at all. They line the gut, the blood vessels and the iris — and you have no say in when they work.",
    },
    {
      id: "cardiac",
      label: "Cardiac muscle",
      tint: T.cardiac,
      panel: "ca",
      depth: 2,
      d: [stadium(456, 62, 150, 38), roundRect(556, 92, 28, 30, 8), stadium(474, 116, 160, 38)].join(" "),
      layers: [
        // Striations — closer spacing for readability at rail size
        { d: ticks(464, 596, 66, 30, 8), width: 1.6, opacity: 0.65 },
        { d: ticks(482, 624, 120, 30, 8), width: 1.6, opacity: 0.65 },
        // Intercalated discs — the junctions that let the beat pass on.
        { d: "M516,62 V100 M582,116 V154", width: 3.4 },
        { d: [ellipse(500, 81, 10, 6), ellipse(548, 135, 10, 6), ellipse(614, 135, 10, 6)].join(" "), as: "shade" },
      ],
      focus: musPanels[2],
      blurb:
        "Striped like skeletal muscle but branched, with one nucleus per cell and dark junctions where fibres meet. Those junctions pass the signal on, which is how the whole heart beats as one.",
    },
  ],
};

/* ══════════════════════════════════════════════════════════ neuron ══ */

export const neuronFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.14",
  title: "Structure of a neuron",
  caption:
    "The longest cell in your body: signals arrive on the dendrites, cross the cell body, and race down the axon to the next cell.",
  altText:
    "A labelled diagram of a nerve cell showing branching dendrites, the cell body speckled with Nissl granules and holding a nucleus with a nucleolus, the long axon wrapped in discrete Schwann-cell myelin segments separated by nodes of Ranvier, and branched nerve endings tipped with synaptic knobs. Selecting a label lifts that part out enlarged.",
  viewBox: [660, 320],
  magnify: "part",
  maxZoom: 4,
  parts: [
    {
      id: "dendrite",
      label: "Dendrite",
      tint: T.nerve,
      depth: 0,
      // Branching dendrites — each branch further subdivides
      d: [
        // Main dendrite branches from cell body
        "M136,142 C112,132 92,116 68,106 L64,118 C88,128 108,144 132,156 Z",
        "M132,178 C108,182 84,192 62,206 L68,216 C90,204 112,194 136,190 Z",
        "M150,120 C142,98 132,78 118,58 L128,52 C144,72 154,94 162,116 Z",
        // Secondary branches — smaller sub-branches
        "M68,106 C56,98 46,86 34,78 L38,72 C50,80 60,92 72,100 Z",
        "M68,106 C58,114 48,124 38,132 L42,138 C52,130 62,120 72,112 Z",
        "M62,206 C50,214 38,224 26,232 L30,238 C42,230 54,220 66,212 Z",
        "M118,58 C108,46 96,36 84,28 L90,22 C102,30 114,42 124,54 Z",
      ].join(" "),
      layers: [
        // Small bumps on dendrites — dendritic spines
        { d: dots([[80, 108], [98, 124], [74, 198], [90, 186], [130, 68], [136, 90]], 3), as: "shade", opacity: 0.6 },
        { d: gleam(90, 108, 18, 24), as: "light", opacity: 0.25 },
      ],
      focus: [22, 18, 126, 226],
      labelAt: [140, 42],
      leaderAt: [124, 60],
      blurb:
        "Short branching fibres reaching out from the cell body, with smaller branches subdividing further. They collect signals from neighbouring neurons — the more branches, the more connections.",
    },
    {
      id: "cell-body",
      label: "Cell body",
      tint: T.nerve,
      depth: 1,
      d: blob(188, 168, 52, 50, [1, 0.96, 1.04, 0.97, 1.02, 0.95, 1.03, 0.98]),
      layers: [
        // NISSL GRANULES — rough ER clumps that are the hallmark of a neuron
        // cell body when stained. Shown as small speckles throughout the cytoplasm.
        {
          d: dots(
            [
              [162, 148], [174, 136], [168, 162], [156, 172],
              [164, 186], [176, 198], [188, 202], [200, 196],
              [212, 190], [218, 174], [222, 158], [214, 142],
              [202, 132], [190, 130], [178, 152], [196, 180],
              [208, 168], [170, 180], [184, 194], [216, 162],
            ],
            2.8,
          ),
          as: "shade",
          opacity: 0.55,
        },
        { d: gleam(174, 148, 24, 28), as: "light", opacity: 0.3 },
      ],
      focus: [132, 114, 120, 110],
      labelAt: [116, 296],
      leaderAt: [172, 212],
      blurb:
        "The bulging middle of the cell, speckled throughout with Nissl granules — clumps of rough endoplasmic reticulum that make the proteins the neuron needs to maintain its extraordinary length.",
    },
    {
      id: "nucleus",
      label: "Nucleus",
      tint: T.nucleus,
      depth: 2,
      d: circle(188, 168, 24),
      layers: [
        // Nucleolus — prominent in neurons
        { d: circle(192, 164, 9), as: "shade" },
        // Nucleolus core
        { d: circle(193, 163, 4), as: "shade", opacity: 0.6 },
        { d: gleam(182, 158, 10, 12), as: "light", opacity: 0.35 },
      ],
      focus: [160, 140, 56, 56],
      labelAt: [232, 62],
      leaderAt: [198, 146],
      labelAlign: "middle",
      blurb:
        "The control centre with a prominent nucleolus, sitting in the cell body. A neuron rarely divides again once it is mature, so this nucleus has to run the same cell for your whole life.",
    },
    {
      id: "axon",
      label: "Axon",
      tint: T.axoplasm,
      depth: 3,
      d: roundRect(232, 158, 340, 22, 11),
      layers: [
        // Axoplasm — the cytoplasm running the length of the axon
        { d: "M244,164 H560", width: 1.0, opacity: 0.3, dash: "3 8" },
        { d: "M244,174 H560", width: 1.0, opacity: 0.3, dash: "5 10" },
        { d: gleam(400, 162, 80, 8), as: "light", opacity: 0.2 },
      ],
      focus: [352, 148, 120, 42],
      labelAt: [412, 62],
      leaderAt: [404, 158],
      labelAlign: "middle",
      blurb:
        "A single long fibre carrying the signal away from the cell body. In your leg one axon can run a metre from the spinal cord to the foot — a single cell longer than your hand is wide.",
    },
    {
      id: "myelin",
      label: "Myelin sheath",
      tint: T.myelin,
      depth: 4,
      // DISCRETE SCHWANN SEGMENTS with NODES OF RANVIER between them.
      // Each segment is one Schwann cell wrapping the axon; the bare gaps
      // between segments are the nodes where the signal regenerates.
      d: [
        roundRect(252, 148, 60, 42, 18),
        roundRect(322, 148, 60, 42, 18),
        roundRect(392, 148, 60, 42, 18),
        roundRect(462, 148, 50, 42, 18),
      ].join(" "),
      layers: [
        // Concentric wrapping layers visible inside each Schwann segment —
        // the myelin sheath is literally many layers of membrane wound around the axon.
        {
          d: [
            // Segment 1 inner layers
            ellipse(282, 169, 24, 16), ellipse(282, 169, 18, 11),
            // Segment 2
            ellipse(352, 169, 24, 16), ellipse(352, 169, 18, 11),
            // Segment 3
            ellipse(422, 169, 24, 16), ellipse(422, 169, 18, 11),
            // Segment 4
            ellipse(487, 169, 20, 16), ellipse(487, 169, 14, 11),
          ].join(" "),
          width: 1.0,
          opacity: 0.4,
        },
        // Schwann cell nuclei — one per segment, pressed against the outer surface
        { d: dots([[270, 152], [340, 152], [410, 152], [476, 152]], 4), as: "shade" },
        // Gleam on each segment
        {
          d: [
            gleam(274, 158, 18, 12),
            gleam(344, 158, 18, 12),
            gleam(414, 158, 18, 12),
            gleam(480, 158, 16, 12),
          ].join(" "),
          as: "light",
          opacity: 0.35,
        },
      ],
      focus: [244, 138, 92, 62],
      labelAt: [352, 296],
      leaderAt: [288, 190],
      labelAlign: "middle",
      blurb:
        "A fatty wrapping laid down in discrete Schwann-cell segments along the axon, with bare nodes of Ranvier between them. The signal leaps node to node instead of crawling, making it travel far faster.",
    },
    {
      id: "nerve-ending",
      label: "Nerve endings",
      tint: T.nerve,
      depth: 5,
      d: [
        // Branching terminal fibres
        "M568,164 C586,152 604,142 624,138 L626,148 C608,152 592,162 576,174 Z",
        "M570,176 C590,180 610,188 628,198 L622,206 C606,196 588,188 568,186 Z",
        "M572,170 C592,170 614,170 634,170 L634,180 C614,180 592,180 572,180 Z",
        // Sub-branches
        "M624,138 C632,130 640,122 648,118 L652,124 C646,128 638,134 630,142 Z",
        "M628,198 C636,206 642,214 646,222 L640,226 C636,218 630,210 624,204 Z",
      ].join(" "),
      layers: [
        // SYNAPTIC KNOBS with vesicles — bulbous endings at the tips
        {
          d: [
            circle(648, 121, 8), circle(652, 170, 7), circle(646, 224, 8),
            circle(636, 138, 6), circle(640, 204, 6),
          ].join(" "),
          as: "shade",
          opacity: 0.6,
        },
        // Vesicles inside the synaptic knobs — tiny circles
        {
          d: dots(
            [
              [644, 118], [652, 118], [648, 124], [644, 124],
              [648, 167], [656, 167], [652, 173],
              [642, 221], [650, 221], [646, 227], [642, 227],
            ],
            1.8,
          ),
          as: "shade",
          opacity: 0.7,
        },
        { d: gleam(640, 118, 6, 6), as: "light", opacity: 0.3 },
      ],
      focus: [560, 110, 100, 124],
      labelAt: [596, 246],
      leaderAt: [616, 196],
      labelAlign: "middle",
      blurb:
        "The axon splits into fine branches tipped with synaptic knobs packed with vesicles. Each knob comes within a hair's breadth of the next cell and passes the message using chemicals released from the vesicles.",
    },
  ],
};

/* ══════════════ Fig. 3.1 — the organism, and the work it divides up ══ */

/** Both leaf blades. Defined once because the vein ribbons have to follow the
 *  same curve, and a vein that misses its blade is the kind of error you only
 *  see in a render. */
const LEAF_L = "M320,178 C270,150 216,146 174,164 C216,194 276,202 320,178 Z";
const LEAF_R = "M344,148 C394,120 448,116 490,134 C448,164 390,172 344,148 Z";

export const organismFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.1",
  title: "One plant, four kinds of tissue",
  caption:
    "No single cell could do all of this. The plant survives by handing each job to a tissue built for it — and by keeping them plumbed together.",
  altText:
    "A young plant drawn whole, with its tissue systems picked out: the epidermis wrapping the outside, photosynthesising leaf tissue in the blades, supporting stem tissue, absorbing root tissue below the soil, and a continuous strand of vascular tissue linking leaf to root. Selecting any part lifts it out, enlarged, and explains it.",
  viewBox: [660, 430],
  magnify: "part",
  scenery: [
    { d: "M96,300 H564", as: "stroke", width: 2, tint: T.sclerenchyma },
  ],
  parts: [
    {
      id: "epidermis",
      label: "Epidermis",
      tint: T.parenchyma,
      depth: 0,
      backdrop: true,
      // A whole silhouette one size up from the stem: the skin is continuous
      // over every organ, which is the point being made. The band has to be
      // wide enough to read as a separate layer — at 10 units it looked like
      // an outline stroke on the stem rather than a tissue of its own.
      d: "M310,92 C305,170 303,248 307,314 L353,314 C357,248 355,170 350,92 C343,72 317,72 310,92 Z",
      layers: [
        { d: "M310,92 C305,170 303,248 307,314 L353,314 C357,248 355,170 350,92 C343,72 317,72 310,92 Z", as: "light" },
        // The brick-like file of surface cells.
        { d: "M308,140 H352 M307,192 H353 M306,244 H354 M306,296 H354", as: "stroke", width: 1, opacity: 0.5 },
      ],
      focus: [304, 244, 56, 70],
      labelAt: [552, 96],
      leaderAt: [360, 118],
      blurb:
        "A single layer of flat cells wrapping every surface of the plant. It keeps water in and pests out, and on a leaf it is punctured by tiny pores that let gases through.",
    },
    {
      id: "stem",
      label: "Stem tissue",
      tint: T.collenchyma,
      depth: 1,
      d: "M320,100 C316,172 315,244 318,300 L344,300 C347,244 346,172 342,100 C337,88 325,88 320,100 Z",
      layers: [
        { d: gleam(331, 200, 11, 96), as: "light", opacity: 0.55 },
        // Thick-walled fibres running the length of the stem.
        { d: "M324,116 C322,186 321,250 323,296 M338,116 C340,186 341,250 339,296", as: "stroke", width: 1.4, opacity: 0.7 },
      ],
      focus: [316, 208, 32, 92],
      labelAt: [552, 236],
      leaderAt: [350, 246],
      blurb:
        "Packs thick-walled cells around the transport strands, which is what lets a soft green shoot hold itself upright. Every extra centimetre of height is paid for in support tissue.",
    },
    {
      id: "leaf",
      label: "Leaf tissue",
      tint: T.parenchyma,
      depth: 2,
      d: `${LEAF_L} ${LEAF_R}`,
      layers: [
        { d: gleam(250, 170, 44, 16), as: "light", opacity: 0.7 },
        { d: gleam(424, 140, 44, 16), as: "light", opacity: 0.7 },
        // Chloroplast-packed cells, the reason the blade is spread flat at all.
        { d: dots([[226, 168], [258, 176], [290, 178], [206, 172], [274, 164]], 5), as: "shade", opacity: 0.55 },
        { d: dots([[400, 138], [432, 146], [464, 146], [380, 142], [448, 134]], 5), as: "shade", opacity: 0.55 },
      ],
      focus: [172, 144, 146, 60],
      labelAt: [150, 128],
      leaderAt: [228, 158],
      blurb:
        "Cells crammed with chloroplasts, spread into a broad flat sheet so that as much of them as possible faces the light. This is the only tissue in the plant that makes food.",
    },
    {
      id: "vascular",
      label: "Vascular tissue",
      tint: T.xylem,
      depth: 3,
      // One continuous plumbing run: leaf vein → stem strand → root. The veins
      // are deliberately thin — drawn at the stem strand's width they read as
      // planks laid across the blades rather than as veins inside them.
      d: [
        "M328,112 C326,182 325,250 327,306 L336,306 C334,250 335,182 337,112 Z",
        "M320,176 C276,161 230,157 184,164 L184,168 C230,161 276,165 320,180 Z",
        "M346,150 C388,137 432,133 478,140 L478,144 C432,137 388,141 346,154 Z",
      ].join(" "),
      layers: [
        // Xylem one side, phloem the other — two pipes, opposite directions.
        { d: "M330,120 C328,186 327,250 329,300", as: "stroke", width: 2, opacity: 0.85 },
        { d: "M334,120 C332,186 331,250 333,300", as: "stroke", width: 2, tint: T.phloem },
      ],
      focus: [324, 196, 18, 110],
      labelAt: [150, 250],
      leaderAt: [322, 250],
      blurb:
        "The pipework, running unbroken from the deepest root hair to the tip of every leaf. One set of tubes carries water up, the other carries dissolved food back down.",
    },
    {
      id: "root",
      label: "Root tissue",
      tint: T.sclerenchyma,
      depth: 4,
      d: "M312,300 H352 C356,328 364,348 388,374 C362,364 346,350 340,334 C340,358 343,378 348,404 C335,384 329,360 328,338 C323,362 314,382 299,406 C306,380 309,356 309,334 C297,352 282,364 260,372 C286,346 300,330 310,300 Z",
      layers: [
        { d: gleam(324, 340, 44, 40), as: "light", opacity: 0.4 },
        // Root hairs — the whole reason a root can drink.
        {
          d: "M344,340 l14,-6 M348,362 l15,-4 M314,344 l-15,-5 M308,368 l-16,-3 M334,392 l13,4 M300,392 l-13,5",
          as: "stroke",
          width: 1.4,
        },
      ],
      focus: [284, 306, 92, 82],
      labelAt: [552, 356],
      leaderAt: [346, 348],
      blurb:
        "Cells drawn out into fine hairs, multiplying the surface touching the soil many times over. Water and dissolved minerals cross into the plant here and nowhere else.",
    },
  ],
};

/* ═══════════════════ Fig. 3.10 — four tissues in one organ ══ */

export const animalArmFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.10",
  title: "Four tissues in a single organ",
  caption:
    "A slice straight through the upper arm. An organ is never one tissue — it is several, layered and doing different jobs at once.",
  altText:
    "A cross-section through a human upper arm showing skin on the outside, a layer of fatty connective tissue beneath it, the bulk of muscle tissue, the bone at the centre with its hard outer shell and marrow, and an artery and a nerve running alongside the bone. Selecting any part lifts it out, enlarged, and explains it.",
  viewBox: [660, 420],
  magnify: "part",
  parts: [
    {
      id: "skin",
      label: "Epithelial tissue",
      tint: T.epithelium,
      depth: 0,
      backdrop: true,
      d: blob(330, 206, 128, 118, [1, 0.98, 1.02, 0.99, 1.01, 0.98, 1.02, 0.99]),
      layers: [
        { d: blob(330, 206, 128, 118, [1, 0.98, 1.02, 0.99, 1.01, 0.98, 1.02, 0.99]), as: "light" },
        { d: gleam(330, 206, 128, 118), as: "light", opacity: 0.5 },
      ],
      focus: [206, 90, 100, 60],
      labelAt: [560, 106],
      leaderAt: [418, 124],
      blurb:
        "The skin: sheets of cells packed edge to edge with almost nothing between them. That tight packing is what makes it a barrier against water loss, injury and microbes.",
    },
    {
      id: "fat",
      label: "Fatty tissue",
      tint: T.adipose,
      depth: 1,
      backdrop: true,
      d: blob(330, 206, 112, 102, [1, 0.99, 1.01, 0.98, 1.02, 0.99, 1.01, 0.98]),
      layers: [
        { d: blob(330, 206, 112, 102, [1, 0.99, 1.01, 0.98, 1.02, 0.99, 1.01, 0.98]), as: "light" },
        // Fat cells: almost entirely one droplet, nucleus shoved to the rim.
        { d: dots([[248, 140], [284, 122], [388, 126], [420, 148], [244, 272], [412, 268]], 13), as: "fill", opacity: 0.8 },
        { d: dots([[248, 140], [284, 122], [388, 126], [420, 148], [244, 272], [412, 268]], 4), as: "shade" },
      ],
      focus: [232, 108, 82, 56],
      labelAt: [560, 170],
      leaderAt: [416, 152],
      blurb:
        "Connective tissue whose cells are each mostly a single fat droplet. It cushions what is underneath, insulates against cold, and is the body's long-term fuel store.",
    },
    {
      id: "muscle",
      label: "Muscle tissue",
      tint: T.muscle,
      depth: 2,
      d: blob(330, 206, 94, 86, [1, 0.98, 1.02, 0.99, 1.01, 0.98, 1.02, 0.99]),
      layers: [
        { d: gleam(330, 206, 94, 86), as: "light", opacity: 0.45 },
        // Fascicles — muscle is bundles of fibres, not a solid mass.
        {
          d: [
            cell(276, 158, 26, 20, 1),
            cell(330, 142, 28, 20, 2),
            cell(384, 160, 26, 20, 3),
            cell(266, 250, 26, 20, 4),
            cell(392, 248, 26, 20, 5),
          ].join(" "),
          as: "shade",
          opacity: 0.6,
        },
        {
          d: [
            cell(276, 158, 26, 20, 1),
            cell(330, 142, 28, 20, 2),
            cell(384, 160, 26, 20, 3),
            cell(266, 250, 26, 20, 4),
            cell(392, 248, 26, 20, 5),
          ].join(" "),
          as: "stroke",
          width: 1.2,
          opacity: 0.8,
        },
      ],
      focus: [250, 138, 52, 42],
      labelAt: [124, 132],
      leaderAt: [258, 156],
      blurb:
        "Long fibres gathered into bundles, each able to shorten on command. Contract them and the bone they are anchored to swings — every voluntary movement you make starts here.",
    },
    {
      id: "bone",
      label: "Bone",
      tint: T.bone,
      depth: 3,
      d: blob(330, 206, 40, 38, [1, 0.99, 1.01, 0.98, 1.01, 0.99]),
      layers: [
        { d: blob(330, 206, 30, 28, [1, 0.99, 1.01, 0.98, 1.01, 0.99]), as: "shade" },
        // The marrow cavity, and the rings of hard matrix around it.
        { d: circle(330, 206, 17), as: "fill", tint: T.blood, opacity: 0.75 },
        { d: `${circle(330, 206, 36)} ${circle(330, 206, 24)}`, as: "stroke", width: 1.1, opacity: 0.7 },
        { d: gleam(330, 206, 40, 38), as: "light", opacity: 0.4 },
      ],
      focus: [290, 168, 80, 76],
      labelAt: [124, 206],
      leaderAt: [296, 204],
      blurb:
        "Connective tissue with a matrix hardened by calcium salts, laid down by living cells trapped inside it. Hollow at the centre, which keeps it light without giving up strength.",
    },
    {
      id: "artery",
      label: "Blood",
      tint: T.blood,
      depth: 4,
      d: circle(398, 268, 15),
      layers: [
        { d: circle(398, 268, 8), as: "panel" },
        { d: dots([[394, 264], [402, 271], [398, 258]], 3), as: "shade" },
        { d: gleam(398, 268, 15, 15), as: "light", opacity: 0.5 },
      ],
      focus: [380, 250, 36, 36],
      labelAt: [560, 292],
      leaderAt: [412, 270],
      blurb:
        "A connective tissue that flows. Its cells are carried in liquid plasma, which is how it can reach every other tissue in the arm to deliver oxygen and take waste away.",
    },
    {
      id: "nerve",
      label: "Nervous tissue",
      tint: T.nerve,
      depth: 5,
      d: circle(262, 270, 13),
      layers: [
        { d: dots([[258, 266], [266, 273], [262, 262], [266, 264]], 3), as: "shade" },
        { d: gleam(262, 270, 13, 13), as: "light", opacity: 0.5 },
      ],
      focus: [246, 254, 32, 32],
      labelAt: [124, 300],
      leaderAt: [252, 274],
      blurb:
        "A bundle of nerve fibres, each one the long arm of a cell whose body sits back in the spinal cord. It carries the order to contract out, and the sense of touch back.",
    },
  ],
};
