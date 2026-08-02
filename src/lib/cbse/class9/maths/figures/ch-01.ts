import type { FigureSpec } from "@/lib/sim/types";
import { circle } from "@/lib/sim/draw";

/**
 * Chapter 1 plates — "Orienting Yourself: The Use of Coordinates".
 *
 * A maths plate leans on `notes` rather than on part labels: the numbers along
 * an axis ARE the diagram, so they stay on screen and scale up when the plate
 * is magnified, instead of stepping aside the way an anatomical label does.
 */

const T = {
  axis: "#cfd8e6",
  q1: "#57c785",
  q2: "#f2b544",
  q3: "#e86fa8",
  q4: "#7fb2f0",
  point: "#f4796b",
  origin: "#b39ddb",
  leg: "#f2b544",
  hyp: "#f4796b",
} as const;

/* ═══════════════════════════════════════════════════ the coordinate plane ══ */

const OX = 330;
const OY = 236;
const U = 44;

/** Faint grid, drawn behind everything and never clickable. */
function grid(): string {
  const out: string[] = [];
  for (let k = -6; k <= 6; k++) {
    if (k === 0) continue;
    out.push(`M${OX + k * U},42 V430`);
  }
  for (let k = -4; k <= 4; k++) {
    if (k === 0) continue;
    out.push(`M58,${OY + k * U} H602`);
  }
  return out.join(" ");
}

const axisNotes = (): FigureSpec["notes"] => {
  const notes: NonNullable<FigureSpec["notes"]> = [];
  for (let k = -3; k <= 3; k++) {
    if (k === 0) continue;
    notes.push({ at: [OX + k * U, OY + 24], text: String(k), size: 13 });
    notes.push({ at: [OX - 12, OY - k * U + 5], text: String(k), size: 13, align: "end" });
  }
  notes.push({ at: [OX - 12, OY + 24], text: "0", size: 13, align: "end" });
  return notes;
};

export const coordinatePlaneFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 1.2",
  title: "Structure of the coordinate plane",
  caption:
    "Two number lines crossing at right angles. Every point in the plane now has exactly one address, written (x, y).",
  altText:
    "A coordinate plane with the x-axis and y-axis crossing at the origin, dividing the plane into four numbered quadrants, and a point plotted at three across and two up. Selecting a label magnifies that part of the plane.",
  viewBox: [660, 460],
  maxZoom: 2.6,
  scenery: [{ d: grid(), width: 1, dash: "3 6", opacity: 0.5 }],
  notes: [
    ...(axisNotes() ?? []),
    { at: [462, 132], text: "(3, 2)", size: 14, emphasis: true },
  ],
  parts: [
    {
      id: "quadrant-1",
      label: "Quadrant I",
      tint: T.q1,
      depth: 0,
      backdrop: true,
      d: "M336,42 H602 V230 H336 Z",
      focus: [336, 42, 266, 188],
      labelAt: [500, 74],
      leaderAt: [500, 104],
      labelAlign: "middle",
      blurb:
        "Right of the y-axis and above the x-axis, so both coordinates are positive. This is the quadrant you meet first, and the only one you need for most graphs of real quantities.",
    },
    {
      id: "quadrant-2",
      label: "Quadrant II",
      tint: T.q2,
      depth: 1,
      backdrop: true,
      d: "M58,42 H324 V230 H58 Z",
      focus: [58, 42, 266, 188],
      labelAt: [160, 74],
      leaderAt: [160, 104],
      labelAlign: "middle",
      blurb:
        "Left of the y-axis but still above the x-axis: x is negative, y is positive. Numbering runs anticlockwise from quadrant one, which is worth remembering — it is a common slip.",
    },
    {
      id: "quadrant-3",
      label: "Quadrant III",
      tint: T.q3,
      depth: 2,
      backdrop: true,
      d: "M58,242 H324 V430 H58 Z",
      focus: [58, 242, 266, 188],
      labelAt: [160, 402],
      leaderAt: [160, 372],
      labelAlign: "middle",
      blurb:
        "Below and to the left, so both coordinates are negative. A point here is a mirror image of one in quadrant one, reflected in both axes at once.",
    },
    {
      id: "quadrant-4",
      label: "Quadrant IV",
      tint: T.q4,
      depth: 3,
      backdrop: true,
      d: "M336,242 H602 V430 H336 Z",
      focus: [336, 242, 266, 188],
      labelAt: [500, 402],
      leaderAt: [500, 372],
      labelAlign: "middle",
      blurb:
        "Right of the y-axis but below the x-axis: x is positive, y is negative. Depth below sea level plotted against distance along a coast lands here.",
    },
    {
      id: "x-axis",
      label: "x-axis",
      tint: T.axis,
      depth: 4,
      d: "M50,231 H610 V241 H50 Z",
      layers: [{ d: "M596,222 L616,236 L596,250 Z", as: "fill" }],
      focus: [500, 214, 120, 44],
      labelAt: [628, 214],
      leaderAt: [566, 236],
      labelAlign: "end",
      blurb:
        "The horizontal number line. The first coordinate of a point says how far to travel along it — right for positive, left for negative. It is also called the axis of abscissae.",
    },
    {
      id: "y-axis",
      label: "y-axis",
      tint: T.axis,
      depth: 5,
      d: "M325,34 V442 H335 V34 Z",
      layers: [{ d: "M316,48 L330,28 L344,48 Z", as: "fill" }],
      focus: [300, 34, 60, 120],
      labelAt: [352, 46],
      leaderAt: [330, 76],
      labelAlign: "start",
      blurb:
        "The vertical number line. The second coordinate says how far to travel up or down it. Order matters: (3, 2) and (2, 3) are two different points on the plane.",
    },
    {
      id: "origin",
      label: "Origin",
      tint: T.origin,
      depth: 6,
      d: circle(OX, OY, 11),
      focus: [OX - 34, OY - 34, 68, 68],
      labelAt: [268, 288],
      leaderAt: [OX - 10, OY + 10],
      labelAlign: "end",
      blurb:
        "Where the two axes cross, written (0, 0). Every measurement on the plane is counted from here, which is why choosing a sensible origin makes a problem easy or hard.",
    },
    {
      id: "point",
      label: "A plotted point",
      tint: T.point,
      depth: 7,
      d: circle(OX + 3 * U, OY - 2 * U, 10),
      layers: [
        {
          d: `M${OX},${OY - 2 * U} H${OX + 3 * U} V${OY}`,
          width: 1.6,
          dash: "6 5",
          opacity: 0.85,
        },
      ],
      focus: [OX + 3 * U - 44, OY - 2 * U - 44, 88, 88],
      labelAt: [560, 176],
      leaderAt: [OX + 3 * U + 10, OY - 2 * U + 6],
      labelAlign: "end",
      blurb:
        "Three units right, two units up: the point (3, 2). Trace the dashed lines back to the axes and you can read the pair straight off — that is the whole idea of coordinates.",
    },
  ],
};

/* ══════════════════════════════════════════════════════ distance formula ══ */

export const distanceFormulaFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 1.7",
  title: "Where the distance formula comes from",
  caption:
    "Drop a right angle between the two points and the gap becomes the hypotenuse of a right triangle — so Pythagoras finishes the job.",
  altText:
    "Two plotted points joined by a straight line, with a horizontal leg and a vertical leg completing a right-angled triangle beneath it. Selecting a label magnifies that side of the triangle.",
  viewBox: [660, 420],
  maxZoom: 2.8,
  scenery: [
    { d: "M70,350 H620 M110,380 V40", width: 1.4, opacity: 0.6 },
    // The right angle at the corner.
    { d: "M458,288 V262 H482", width: 1.6, opacity: 0.8 },
  ],
  notes: [
    { at: [214, 314], text: "A (x₁, y₁)", size: 14, align: "end" },
    { at: [502, 88], text: "B (x₂, y₂)", size: 14, align: "start" },
    { at: [358, 320], text: "x₂ − x₁", size: 14 },
    { at: [466, 200], text: "y₂ − y₁", size: 14, align: "end" },
    { at: [330, 42], text: "AB² = (x₂ − x₁)² + (y₂ − y₁)²", size: 16, emphasis: true },
  ],
  parts: [
    {
      id: "hypotenuse",
      label: "The distance AB",
      tint: T.hyp,
      depth: 0,
      d: "M237,292 L485,106 L479,98 L231,284 Z",
      focus: [280, 140, 160, 120],
      labelAt: [252, 128],
      leaderAt: [330, 216],
      labelAlign: "end",
      blurb:
        "The straight gap you actually want. It is not read off either axis — it has to be worked out from the two sides beneath it, and Pythagoras is the tool that does that.",
    },
    {
      id: "horizontal-leg",
      label: "Horizontal leg",
      tint: T.leg,
      depth: 1,
      d: "M234,283 H482 V293 H234 Z",
      focus: [226, 268, 264, 40],
      labelAt: [220, 372],
      leaderAt: [300, 288],
      labelAlign: "start",
      blurb:
        "How far apart the two points are left-to-right: simply the difference of the x-coordinates. Subtract in either order — squaring it in the next step removes any minus sign.",
    },
    {
      id: "vertical-leg",
      label: "Vertical leg",
      tint: T.leg,
      depth: 2,
      d: "M477,102 V288 H487 V102 Z",
      focus: [462, 94, 40, 202],
      labelAt: [636, 300],
      leaderAt: [487, 220],
      labelAlign: "end",
      blurb:
        "How far apart they are up-and-down: the difference of the y-coordinates. With both legs known the triangle is fixed, and only one length is left to find.",
    },
    {
      id: "point-a",
      label: "Point A",
      tint: T.point,
      depth: 3,
      d: circle(234, 288, 9),
      focus: [206, 260, 56, 56],
      blurb:
        "The first point. Which of the two you call A makes no difference to the answer, because both differences get squared before they are added.",
    },
    {
      id: "point-b",
      label: "Point B",
      tint: T.point,
      depth: 4,
      d: circle(482, 102, 9),
      focus: [454, 74, 56, 56],
      blurb:
        "The second point. Join it to A, drop the two legs, and the triangle you have built is the reason the distance formula looks the way it does.",
    },
  ],
};
