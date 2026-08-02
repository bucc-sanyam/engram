import type { FigureSpec, FigureLayer } from "@/lib/sim/types";
import { circle, ellipse, dots, roundRect, stadium } from "@/lib/sim/draw";

/**
 * Chapter 3 plates — "Tissues".
 *
 * Most of this chapter is "here are the four kinds of X", which is why nearly
 * every plate here is a multi-panel one: the panels sit side by side so the
 * differences are visible at a glance, and magnifying a panel is how a student
 * gets from "they all look like blobs" to "that one has a thickened corner".
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

/* ══════════════════════════════════════════════════════════ meristems ══ */

export const meristemFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.3",
  title: "Where a plant grows from",
  caption:
    "A plant does not grow all over. Division is confined to meristems: at the tips, at the nodes, and in a ring inside the stem.",
  altText:
    "A young plant showing the three kinds of meristem: apical meristem at the shoot and root tips, intercalary meristem at a node, and lateral meristem as a ring inside the stem. Selecting a label magnifies that region and explains what it does.",
  viewBox: [660, 480],
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
      id: "apical",
      label: "Apical meristem",
      tint: T.meristem,
      depth: 0,
      d: [
        "M236,150 C234,122 244,102 255,100 C266,102 276,122 274,150 Z",
        "M246,420 C244,438 249,452 256,457 C263,452 268,438 266,420 Z",
      ].join(" "),
      layers: [
        { d: dots([[248, 124], [262, 126], [255, 138], [256, 436], [251, 446]], 4), as: "shade" },
      ],
      focus: [228, 92, 56, 66],
      labelAt: [492, 100],
      leaderAt: [272, 120],
      blurb:
        "Sits at the very tip of every shoot and every root. Its cells divide to make the plant longer — this is what pushes a root deeper into the soil and a stem up towards the light.",
    },
    {
      id: "intercalary",
      label: "Intercalary meristem",
      tint: T.meristem,
      depth: 1,
      d: roundRect(230, 252, 50, 26, 8),
      layers: [{ d: "M230,265 H280", width: 1.2, opacity: 0.6, dash: "5 4" }],
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
      depth: 2,
      d: [roundRect(238, 300, 10, 84, 5), roundRect(266, 300, 10, 84, 5)].join(" "),
      focus: [228, 292, 58, 100],
      labelAt: [492, 344],
      leaderAt: [278, 342],
      blurb:
        "A thin cylinder of dividing cells running the length of the stem, also called cambium. It adds cells sideways, so the trunk thickens year after year rather than merely getting taller.",
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
    "Three panels comparing parenchyma, collenchyma and sclerenchyma. Parenchyma has thin-walled rounded cells with air spaces, collenchyma has extra wall material at the corners, and sclerenchyma has walls so thick that only a narrow lumen is left. Selecting a panel magnifies it.",
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
        circle(64, 80, 32),
        circle(134, 74, 30),
        circle(170, 134, 30),
        circle(96, 144, 34),
        circle(38, 148, 24),
      ].join(" "),
      layers: [
        {
          d: dots(
            [
              [64, 80],
              [134, 74],
              [170, 134],
              [96, 144],
              [38, 148],
            ],
            8,
          ),
          as: "shade",
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
        roundRect(246, 58, 84, 66, 14),
        roundRect(336, 58, 84, 66, 14),
        roundRect(246, 132, 84, 66, 14),
        roundRect(336, 132, 84, 66, 14),
      ].join(" "),
      layers: [
        {
          // Extra wall material piled into the corners — the whole point.
          d: dots(
            [
              [252, 64], [324, 64], [252, 118], [324, 118],
              [342, 64], [414, 64], [342, 118], [414, 118],
              [252, 138], [324, 138], [252, 192], [324, 192],
              [342, 138], [414, 138], [342, 192], [414, 192],
            ],
            9,
          ),
          as: "shade",
        },
        { d: dots([[288, 91], [378, 91], [288, 165], [378, 165]], 8), as: "shade" },
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
      d: [
        roundRect(464, 44, 52, 152, 14),
        roundRect(524, 44, 52, 152, 14),
        roundRect(584, 44, 52, 152, 14),
      ].join(" "),
      layers: [
        {
          d: [
            roundRect(482, 66, 16, 108, 8),
            roundRect(542, 66, 16, 108, 8),
            roundRect(602, 66, 16, 108, 8),
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
    "Two panels of conducting tissue. The xylem panel shows a wide vessel with perforated end walls, a tapered tracheid, and xylem parenchyma. The phloem panel shows a sieve tube with sieve plates, a companion cell and phloem parenchyma. Selecting a label magnifies that cell.",
  viewBox: [660, 340],
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
        // Perforated end walls: the plates between stacked cells, mostly gone.
        { d: "M46,104 H118 M46,174 H118", width: 2.2, dash: "9 7" },
      ],
      focus: [38, 36, 88, 206],
      labelAt: [16, 262],
      leaderAt: [82, 234],
      labelAlign: "start",
      blurb:
        "A wide pipe made from dead cells stacked end to end, with the end walls largely dissolved away. Water pulled up from the roots runs through it in an unbroken column, like water through a drainpipe.",
    },
    {
      id: "tracheid",
      label: "Tracheid",
      tint: T.xylem,
      panel: "xylem",
      depth: 1,
      d: "M146,64 C146,50 158,42 170,44 C182,46 192,54 192,68 V212 C192,226 182,234 170,232 C158,230 146,222 146,208 Z",
      layers: [
        { d: dots([[152, 92], [186, 118], [152, 148], [186, 176], [152, 202]], 5), as: "panel" },
      ],
      focus: [138, 36, 62, 206],
      labelAt: [150, 288],
      leaderAt: [170, 232],
      labelAlign: "middle",
      blurb:
        "A narrower dead cell tapered at both ends, with pits in its side walls rather than open ends. Water crosses from one tracheid to the next through those pits, so flow is slower than in a vessel.",
    },
    {
      id: "xylem-parenchyma",
      label: "Xylem parenchyma",
      tint: T.parenchyma,
      panel: "xylem",
      depth: 2,
      d: [roundRect(222, 44, 42, 92, 10), roundRect(222, 142, 42, 92, 10)].join(" "),
      layers: [{ d: dots([[243, 90], [243, 188]], 8), as: "shade" }],
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
        { d: "M386,104 H456 M386,174 H456", width: 2.4 },
        // The pores of the sieve plate.
        {
          d: dots(
            [
              [398, 104], [412, 104], [426, 104], [440, 104],
              [398, 174], [412, 174], [426, 174], [440, 174],
            ],
            3,
          ),
          as: "panel",
        },
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
      layers: [{ d: circle(487, 110, 11), as: "shade" }],
      focus: [460, 52, 54, 174],
      labelAt: [468, 288],
      leaderAt: [490, 218],
      labelAlign: "middle",
      blurb:
        "A narrow living cell pressed against the sieve tube. A mature sieve tube has lost its nucleus, so this neighbour keeps it alive and does its housekeeping for it.",
    },
    {
      id: "phloem-parenchyma",
      label: "Phloem fibre",
      tint: T.sclerenchyma,
      panel: "phloem",
      depth: 5,
      d: roundRect(518, 60, 34, 158, 8),
      layers: [{ d: roundRect(529, 78, 12, 122, 6), as: "panel" }],
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
    "Four panels of epithelial tissue: flat squamous cells, cube-shaped cuboidal cells, tall columnar cells, and columnar cells carrying cilia. All four sit on a basement membrane. Selecting a panel magnifies it.",
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
        { d: dots([[45, 131], [89, 131], [133, 131]], 7), as: "shade" },
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
        { d: dots([[204, 122], [244, 122], [284, 122]], 8), as: "shade" },
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
        { d: dots([[368, 136], [408, 136], [448, 136]], 8), as: "shade" },
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
        { d: ticks(516, 624, 52, 16, 8), width: 1.6, opacity: 0.85 },
        { d: dots([[530, 138], [570, 138], [610, 138]], 8), as: "shade" },
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
        { d: ticks(42, 190, 66, 36, 12), width: 1.5, opacity: 0.75 },
        { d: ticks(42, 190, 126, 36, 12), width: 1.5, opacity: 0.75 },
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
        { d: ticks(472, 594, 66, 30, 11), width: 1.4, opacity: 0.7 },
        { d: ticks(490, 622, 120, 30, 11), width: 1.4, opacity: 0.7 },
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
    "A labelled diagram of a nerve cell showing the branching dendrites, the cell body with its nucleus, the long axon wrapped in a segmented myelin sheath, and the branched nerve endings. Selecting a label magnifies that part.",
  viewBox: [660, 320],
  maxZoom: 4,
  parts: [
    {
      id: "dendrite",
      label: "Dendrite",
      tint: T.nerve,
      depth: 0,
      d: [
        "M136,142 C112,132 92,116 68,106 L64,118 C88,128 108,144 132,156 Z",
        "M132,178 C108,182 84,192 62,206 L68,216 C90,204 112,194 136,190 Z",
        "M150,120 C142,98 132,78 118,58 L128,52 C144,72 154,94 162,116 Z",
      ].join(" "),
      focus: [56, 46, 116, 176],
      labelAt: [140, 42],
      leaderAt: [124, 60],
      blurb:
        "Short branching fibres reaching out from the cell body. They collect signals from neighbouring neurons — the more branches, the more connections one neuron can listen to at once.",
    },
    {
      id: "cell-body",
      label: "Cell body",
      tint: T.nerve,
      depth: 1,
      d: "M138,168 C136,138 160,116 190,118 C220,120 238,144 236,172 C234,202 210,220 182,218 C154,216 140,198 138,168 Z",
      focus: [130, 110, 116, 116],
      labelAt: [116, 296],
      leaderAt: [172, 212],
      blurb:
        "The bulging middle of the cell, holding the nucleus and the cytoplasm. Everything the neuron needs to stay alive is made here, then shipped out along the fibres.",
    },
    {
      id: "nucleus",
      label: "Nucleus",
      tint: T.nucleus,
      depth: 2,
      d: circle(188, 168, 24),
      layers: [{ d: circle(194, 162, 9), as: "shade" }],
      focus: [160, 140, 56, 56],
      labelAt: [232, 62],
      leaderAt: [198, 146],
      labelAlign: "middle",
      blurb:
        "The control centre, sitting in the cell body. A neuron rarely divides again once it is mature, so this nucleus generally has to run the same cell for your whole life.",
    },
    {
      id: "axon",
      label: "Axon",
      tint: T.nerve,
      depth: 3,
      d: roundRect(232, 158, 340, 22, 11),
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
      d: [
        roundRect(252, 148, 72, 42, 18),
        roundRect(334, 148, 72, 42, 18),
        roundRect(416, 148, 72, 42, 18),
        roundRect(498, 148, 66, 42, 18),
      ].join(" "),
      focus: [244, 138, 92, 62],
      labelAt: [352, 296],
      leaderAt: [288, 190],
      labelAlign: "middle",
      blurb:
        "A fatty wrapping laid down in segments along the axon, with bare gaps between them. The signal leaps from gap to gap instead of crawling along, which makes it travel far faster.",
    },
    {
      id: "nerve-ending",
      label: "Nerve endings",
      tint: T.nerve,
      depth: 5,
      d: [
        "M568,164 C586,152 604,142 624,138 L626,148 C608,152 592,162 576,174 Z",
        "M570,176 C590,180 610,188 628,198 L622,206 C606,196 588,188 568,186 Z",
        "M572,170 C592,170 614,170 634,170 L634,180 C614,180 592,180 572,180 Z",
      ].join(" "),
      focus: [560, 130, 92, 82],
      labelAt: [596, 246],
      leaderAt: [616, 196],
      labelAlign: "middle",
      blurb:
        "The axon splits into fine branches at its far end. Each one comes within a hair's breadth of the next cell and passes the message across the tiny gap using chemicals.",
    },
  ],
};
