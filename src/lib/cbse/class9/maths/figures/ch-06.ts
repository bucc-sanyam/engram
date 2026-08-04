import type { FigureSpec } from "@/lib/sim/types";
import { circle, stadium } from "@/lib/sim/draw";

/**
 * Chapter 6 plates — "Measuring Space: Perimeter".
 *
 * Geometry rather than anatomy, so the interesting thing to magnify is a
 * relationship — the gap between an inscribed and a circumscribed polygon, the
 * bend of a running track — rather than an object.
 */

const T = {
  track: "#f0a35e",
  straight: "#57c785",
  bend: "#7fb2f0",
  infield: "#8fbf5e",
  line: "#f4796b",
  circle: "#8fd3f4",
  inner: "#57c785",
  outer: "#f2b544",
  sector: "#e86fa8",
  arc: "#f4796b",
  radius: "#b39ddb",
} as const;

/* ══════════════════════════════════════════════════════ athletics track ══ */

/* Outer edge and infield of the same stadium shape; the ring between them is
 * the running surface. */
const TRACK_OUTER = stadium(70, 60, 520, 260);
const TRACK_INNER = stadium(110, 100, 440, 180);

export const athleticsTrackFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 6.11",
  title: "A 400 m athletics track",
  caption:
    "Two straights and two half-circles. Add the straights to the circumference of the circle the bends would make, and you get exactly 400 metres in lane one.",
  altText:
    "A running track drawn as two straight sections joined by two semicircular bends around a rectangular infield, with the start line marked. Selecting a label magnifies that section of the track.",
  viewBox: [660, 420],
  maxZoom: 2.6,
  notes: [
    { at: [330, 44], text: "straight — 84.39 m", size: 14 },
    { at: [330, 196], text: "400 m in lane 1", size: 16, emphasis: true },
    { at: [330, 352], text: "bend radius 36.5 m", size: 13 },
  ],
  parts: [
    {
      id: "track",
      label: "Running surface",
      tint: T.track,
      depth: 0,
      backdrop: true,
      d: TRACK_OUTER,
      layers: [{ d: TRACK_INNER, as: "panel" }],
      focus: [62, 52, 160, 160],
      labelAt: [96, 32],
      leaderAt: [128, 112],
      labelAlign: "start",
      blurb:
        "The ring between the outer edge and the infield. Its length is what the race measures, and it is measured along the inside edge of lane one — 30 cm out from the kerb.",
    },
    {
      id: "infield",
      label: "Infield",
      tint: T.infield,
      depth: 1,
      backdrop: true,
      d: TRACK_INNER,
      focus: [180, 130, 300, 120],
      labelAt: [330, 258],
      leaderAt: [330, 232],
      labelAlign: "middle",
      blurb:
        "The grass in the middle, used for the throwing and jumping events. Its shape is what fixes the track: the bends must wrap it exactly, so its width sets the radius.",
    },
    {
      id: "straight",
      label: "Straight",
      tint: T.straight,
      depth: 2,
      d: "M200,60 H460 V100 H200 Z M200,280 H460 V320 H200 Z",
      focus: [192, 52, 276, 56],
      labelAt: [200, 372],
      leaderAt: [270, 300],
      labelAlign: "middle",
      blurb:
        "The two flat sections, 84.39 m each. They are the same length in every lane, which is why a stagger is needed only to make up for the difference around the bends.",
    },
    {
      id: "bend",
      label: "Bend",
      tint: T.bend,
      depth: 3,
      d: [
        "M200,60 A130,130 0 0 0 200,320 L200,280 A90,90 0 0 1 200,100 Z",
        "M460,60 A130,130 0 0 1 460,320 L460,280 A90,90 0 0 0 460,100 Z",
      ].join(" "),
      focus: [440, 52, 160, 280],
      labelAt: [610, 372],
      leaderAt: [566, 190],
      labelAlign: "end",
      blurb:
        "Each bend is a half-circle of radius 36.5 m. The two together make one full circle, so their combined length is 2πr — and that is where the awkward 84.39 m for the straights comes from.",
    },
    {
      id: "start-line",
      label: "Start line",
      tint: T.line,
      depth: 4,
      d: "M326,280 V320 H336 V280 Z",
      focus: [296, 268, 70, 66],
      labelAt: [420, 372],
      leaderAt: [336, 306],
      labelAlign: "middle",
      blurb:
        "Where a one-lap race begins and ends. Runners in outer lanes start further forward, because a lane further from the centre has a longer bend to travel around.",
    },
  ],
};

/* ═══════════════════════════════════════════════════ Archimedes' method ══ */

const AR_CX = 300;
const AR_CY = 200;
const AR_R = 140;

function hexagon(cx: number, cy: number, r: number, offsetDeg: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = ((offsetDeg + i * 60) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

export const archimedesFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 6.7",
  title: "How Archimedes trapped π",
  caption:
    "A polygon inside is shorter than the circle; a polygon outside is longer. Keep doubling the sides and the two close in on π from both directions.",
  altText:
    "A circle with a hexagon drawn inside it and a larger hexagon drawn around it, so the circle's circumference is squeezed between the two perimeters. Selecting a label magnifies that shape.",
  viewBox: [660, 420],
  maxZoom: 2.6,
  notes: [
    {
      at: [330, 398],
      text: "inside perimeter  <  circumference  <  outside perimeter",
      size: 15,
      emphasis: true,
    },
  ],
  parts: [
    {
      id: "circumscribed",
      label: "Polygon outside",
      tint: T.outer,
      depth: 0,
      backdrop: true,
      d: hexagon(AR_CX, AR_CY, AR_R / Math.cos(Math.PI / 6), 30),
      focus: [AR_CX + 30, AR_CY - 200, 190, 160],
      labelAt: [640, 82],
      leaderAt: [AR_CX + 120, AR_CY - 106],
      labelAlign: "end",
      blurb:
        "Every side just touches the circle, so this polygon wraps entirely outside it. Its perimeter must therefore be more than the circumference — an upper bound you can actually calculate.",
    },
    {
      id: "circle",
      label: "The circle",
      tint: T.circle,
      depth: 1,
      backdrop: true,
      d: circle(AR_CX, AR_CY, AR_R),
      layers: [{ d: `M${AR_CX},${AR_CY} H${AR_CX + AR_R}`, width: 1.6, dash: "6 5" }],
      focus: [AR_CX - AR_R - 12, AR_CY - AR_R - 12, AR_R * 2 + 24, AR_R * 2 + 24],
      labelAt: [24, 200],
      leaderAt: [AR_CX - AR_R + 8, AR_CY + 40],
      labelAlign: "start",
      blurb:
        "The shape whose perimeter nobody could measure directly. Archimedes never tried to: he squeezed it between two shapes made of straight lines, which he could measure.",
    },
    {
      id: "inscribed",
      label: "Polygon inside",
      tint: T.inner,
      depth: 2,
      d: hexagon(AR_CX, AR_CY, AR_R, 0),
      focus: [AR_CX - 160, AR_CY + 20, 190, 160],
      labelAt: [24, 348],
      leaderAt: [AR_CX - 76, AR_CY + 110],
      labelAlign: "start",
      blurb:
        "All six corners sit on the circle, so every side cuts a corner off it. Its perimeter is therefore less than the circumference — a lower bound, again exactly calculable.",
    },
  ],
};

/* ══════════════════════════════════════════════════════════ sector ══ */

const SE_CX = 292;
const SE_CY = 212;
const SE_R = 148;
const SE_END: [number, number] = [
  SE_CX + SE_R * Math.cos((-10 * Math.PI) / 180),
  SE_CY + SE_R * Math.sin((-10 * Math.PI) / 180),
];
const SE_INNER: [number, number] = [
  SE_CX + (SE_R - 12) * Math.cos((-10 * Math.PI) / 180),
  SE_CY + (SE_R - 12) * Math.sin((-10 * Math.PI) / 180),
];
const f1 = (n: number) => n.toFixed(1);

export const sectorFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 6.38",
  title: "Arc length and the sector",
  caption:
    "A sector is a slice of the circle. Whatever fraction of 360° the angle is, the arc is the same fraction of the circumference — and the slice the same fraction of the area.",
  altText:
    "A circle with one sector marked off by two radii, showing the arc along its outer edge and the angle at the centre. Selecting a label magnifies that part of the figure.",
  viewBox: [660, 400],
  maxZoom: 2.8,
  notes: [
    { at: [268, 138], text: "r", size: 16, align: "end" },
    { at: [322, 194], text: "θ", size: 15, align: "start" },
    { at: [330, 372], text: "arc = (θ ÷ 360) × 2πr", size: 15, emphasis: true },
  ],
  parts: [
    {
      id: "circle",
      label: "Whole circle",
      tint: T.circle,
      depth: 0,
      backdrop: true,
      d: circle(SE_CX, SE_CY, SE_R),
      focus: [SE_CX - SE_R - 10, SE_CY - SE_R - 10, SE_R * 2 + 20, SE_R * 2 + 20],
      labelAt: [148, 336],
      leaderAt: [SE_CX - 74, SE_CY + 116],
      labelAlign: "end",
      blurb:
        "The full 360°: circumference 2πr, area πr². Every sector formula is just this whole, cut down by the fraction of the turn the sector covers.",
    },
    {
      id: "sector",
      label: "Sector",
      tint: T.sector,
      depth: 1,
      d: `M${SE_CX},${SE_CY} L${SE_CX},${SE_CY - SE_R} A${SE_R},${SE_R} 0 0 1 ${f1(SE_END[0])},${f1(SE_END[1])} Z`,
      layers: [
        { d: `M${SE_CX},${SE_CY - 44} A44,44 0 0 1 ${f1(SE_CX + 43.3)},${f1(SE_CY - 7.6)}`, width: 1.8 },
      ],
      focus: [SE_CX - 20, SE_CY - SE_R - 10, 190, 180],
      labelAt: [608, 132],
      leaderAt: [SE_CX + 68, SE_CY - 82],
      labelAlign: "end",
      blurb:
        "The slice between two radii. Its angle at the centre is the only thing you need: a 90° sector is a quarter of the circle, a 45° sector an eighth, and so on.",
    },
    {
      id: "arc",
      label: "Arc",
      tint: T.arc,
      depth: 2,
      d:
        `M${SE_CX},${SE_CY - SE_R} A${SE_R},${SE_R} 0 0 1 ${f1(SE_END[0])},${f1(SE_END[1])} ` +
        `L${f1(SE_INNER[0])},${f1(SE_INNER[1])} A${SE_R - 12},${SE_R - 12} 0 0 0 ${SE_CX},${SE_CY - SE_R + 12} Z`,
      focus: [SE_CX + 40, SE_CY - SE_R - 12, 130, 150],
      labelAt: [608, 66],
      leaderAt: [SE_CX + 116, SE_CY - 100],
      labelAlign: "end",
      blurb:
        "The curved outer edge. It is a piece of the circumference, not a straight chord — measuring it with a ruler will always come out short.",
    },
    {
      id: "radius",
      label: "Radius",
      tint: T.radius,
      depth: 3,
      d: `M${SE_CX - 5},${SE_CY} V${SE_CY - SE_R} H${SE_CX + 5} V${SE_CY} Z`,
      focus: [SE_CX - 44, SE_CY - SE_R - 10, 88, 170],
      labelAt: [148, 78],
      leaderAt: [SE_CX - 5, SE_CY - 100],
      labelAlign: "end",
      blurb:
        "Both straight sides of a sector are radii, so they are equal. That is why a sector is a slice of a pie rather than any old wedge — the two edges are always the same length.",
    },
    {
      id: "centre",
      label: "Centre",
      tint: T.radius,
      depth: 4,
      d: circle(SE_CX, SE_CY, 9),
      focus: [SE_CX - 44, SE_CY - 44, 88, 88],
      labelAt: [148, 240],
      leaderAt: [SE_CX - 9, SE_CY + 6],
      labelAlign: "end",
      blurb:
        "Where the angle θ is measured. Measured anywhere else on the circle the same arc would subtend a different angle — the sector formula assumes the angle at the centre.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════ area ══ */

export const unitSquaresFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 6.42",
  title: "Area as counting squares",
  caption:
    "Area is not a length but a count of squares. A rectangle 5 cm long and 3 cm wide holds exactly 15 squares of 1 cm by 1 cm.",
  altText:
    "A rectangle divided into a grid of five columns and three rows, making 15 squares in total. Selecting a label highlights the full rectangle, a single row, a single column, or a single unit square.",
  viewBox: [660, 240],
  magnify: "part",
  maxZoom: 2.2,
  notes: [
    { at: [330, 44], text: "5 cm", size: 14, align: "middle" },
    { at: [210, 120], text: "3 cm", size: 14, align: "end" },
  ],
  scenery: [
    { d: "M230,60 H430 V180 H230 Z", width: 1.6, opacity: 0.8 },
    { d: "M230,100 H430 M230,140 H430 M270,60 V180 M310,60 V180 M350,60 V180 M390,60 V180", width: 1.4, opacity: 0.5 },
  ],
  parts: [
    {
      id: "rectangle",
      label: "The whole area",
      tint: T.inner,
      depth: 0,
      d: "M230,60 H430 V180 H230 Z",
      focus: [210, 40, 240, 160],
      labelAt: [130, 80],
      leaderAt: [230, 120],
      labelAlign: "end",
      blurb:
        "The total space inside the boundary. You cannot measure this with a ruler directly, because a ruler only measures one-dimensional lines. To measure 2D space, you have to count squares.",
    },
    {
      id: "row",
      label: "One row",
      tint: T.outer,
      depth: 1,
      d: "M230,100 H430 V140 H230 Z",
      focus: [210, 80, 240, 80],
      labelAt: [560, 80],
      leaderAt: [430, 120],
      blurb:
        "Because the length is 5 cm, each row holds exactly 5 unit squares. The width tells you how many of these rows will stack up to fill the shape.",
    },
    {
      id: "column",
      label: "One column",
      tint: T.outer,
      depth: 2,
      d: "M350,60 H390 V180 H350 Z",
      focus: [330, 40, 80, 160],
      labelAt: [560, 180],
      leaderAt: [390, 160],
      blurb:
        "Because the width is 3 cm, each column is a stack of 3 squares. Multiplication is just repeated addition: 5 columns of 3, or 3 rows of 5, both make 15.",
    },
    {
      id: "unit-square",
      label: "Unit square",
      tint: T.arc,
      depth: 3,
      d: "M310,140 H350 V180 H310 Z",
      focus: [290, 120, 80, 80],
      labelAt: [130, 180],
      leaderAt: [310, 160],
      labelAlign: "end",
      blurb:
        "The fundamental unit of area: a square with sides of exactly 1 cm. When we say the area is '15 cm²', we mean exactly 15 of these tiles fit inside the boundary.",
    },
  ],
};

function dissectionOutline(x: number, y: number, r: number, slices: number): string {
  const dx = (Math.PI * r) / slices;
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(x)},${f(y)}`;
  for (let i = 0; i < slices; i++) {
    d += ` A${f(r)},${f(r)} 0 0 0 ${f(x + (i + 1) * dx)},${f(y)}`;
  }
  d += ` L${f(x + slices * dx + dx / 2)},${f(y + r)}`;
  for (let i = slices; i > 0; i--) {
    d += ` A${f(r)},${f(r)} 0 0 0 ${f(x + (i - 1) * dx + dx / 2)},${f(y + r)}`;
  }
  d += ` Z`;
  return d;
}

function dissectionCuts(x: number, y: number, r: number, slices: number): string {
  const dx = (Math.PI * r) / slices;
  const f = (n: number) => n.toFixed(1);
  let d = "";
  for (let i = 1; i <= slices; i++) {
    d += `M${f(x + i * dx)},${f(y)} L${f(x + i * dx - dx / 2)},${f(y + r)} `;
    if (i < slices) {
      d += `M${f(x + i * dx)},${f(y)} L${f(x + i * dx + dx / 2)},${f(y + r)} `;
    }
  }
  return d;
}

function circleWedges(cx: number, cy: number, r: number, slices: number): string {
  let d = "";
  const dTheta = Math.PI / slices;
  for (let i = 0; i < slices * 2; i++) {
    const a = i * dTheta;
    d += `M${cx},${cy} L${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return d;
}

export const circleDissectionFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 6.45",
  title: "Area of a circle",
  caption:
    "Slice a circle into thin wedges and they interlock into a parallelogram. Its height is the radius, and its width is half the circumference — making its area πr².",
  altText:
    "A circle sliced into sixteen wedges, and those same wedges rearranged side-by-side to form a bumpy parallelogram. The height of the parallelogram is labelled r, and the base is labelled πr. Selecting a label magnifies that part.",
  viewBox: [660, 260],
  magnify: "part",
  maxZoom: 2.2,
  scenery: [
    { d: "M240,110 L270,110 L264,104 M270,110 L264,116", width: 1.6, opacity: 0.5 },
  ],
  notes: [
    { at: [134, 90], text: "r", size: 14, align: "end" },
    { at: [461, 156], text: "πr (half circumference)", size: 14, align: "middle" },
    { at: [320, 90], text: "r", size: 14, align: "end" },
  ],
  parts: [
    {
      id: "sliced-circle",
      label: "Sliced circle",
      tint: T.circle,
      depth: 0,
      d: circle(140, 110, 80),
      layers: [
        { d: circleWedges(140, 110, 80, 8), width: 1.2, opacity: 0.4 },
        { d: "M140,110 V30", width: 1.8, dash: "6 4", opacity: 0.8 }
      ],
      focus: [50, 20, 180, 180],
      labelAt: [40, 40],
      leaderAt: [90, 60],
      labelAlign: "start",
      blurb:
        "The circle is cut into 16 identical wedges. Because they are cut perfectly from the centre, the straight edge of every wedge is exactly the radius, r.",
    },
    {
      id: "parallelogram",
      label: "Rearranged",
      tint: T.inner,
      depth: 1,
      d: dissectionOutline(320, 30, 80, 8),
      layers: [
        { d: dissectionCuts(320, 30, 80, 8), width: 1.0, opacity: 0.4 },
        { d: "M320,30 L335.7,110", width: 1.8, dash: "6 4", opacity: 0.8 },
        { d: "M336,120 v8 H587 v-8", width: 1.4, opacity: 0.6 }
      ],
      focus: [300, 10, 320, 200],
      labelAt: [630, 40],
      leaderAt: [450, 70],
      labelAlign: "end",
      blurb:
        "Interlocking the wedges point-to-crust forms a bumpy parallelogram. The height is the radius, r. The bumpy top and bottom edges are made of the circle's circumference split in half, so the base is exactly πr.",
    },
    {
      id: "area-formula",
      label: "Area = πr²",
      tint: T.sector,
      depth: 2,
      d: dissectionOutline(320, 30, 80, 8),
      focus: [300, 10, 320, 200],
      labelAt: [630, 220],
      leaderAt: [500, 70],
      labelAlign: "end",
      blurb:
        "The area of a parallelogram is base × height. Here, the base is πr and the height is r. Multiplying them gives πr², perfectly calculating the area of the original circle.",
    },
  ],
};
