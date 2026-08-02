import type { FigureSpec } from "@/lib/sim/types";
import { circle, dots } from "@/lib/sim/draw";

/**
 * Chapter 3 plates — "The World of Numbers".
 *
 * Number lines and geometric constructions. As in ch-01, the numerals are the
 * content, so they live in `notes` and stay legible while the plate is
 * magnified rather than fading out like an anatomical label.
 */

const T = {
  line: "#cfd8e6",
  integer: "#7fb2f0",
  rational: "#57c785",
  irrational: "#f4796b",
  unit: "#f2b544",
  hyp: "#e86fa8",
  arc: "#b39ddb",
  spoke: "#7fb2f0",
} as const;

/* ═════════════════════════════════════════════════════════ number line ══ */

const NL_Y = 132;
const NL_0 = 330;
const NL_U = 92;
const nx = (v: number) => NL_0 + v * NL_U;

export const numberLineFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.7",
  title: "Integers and rationals on a number line",
  caption:
    "The integers are the milestones. Between any two of them sit infinitely many rationals — and, as it turns out, infinitely many numbers that are not rational at all.",
  altText:
    "A number line from minus three to three. Larger dots mark the integers, smaller dots mark rational numbers between them, and one dot marks the irrational number root two. Selecting a label magnifies that part of the line.",
  viewBox: [660, 250],
  maxZoom: 3,
  scenery: [
    {
      d: [-3, -2, -1, 0, 1, 2, 3].map((v) => `M${nx(v)},${NL_Y - 14} V${NL_Y + 16}`).join(" "),
      width: 1.6,
      opacity: 0.7,
    },
  ],
  notes: [
    { at: [nx(-3), NL_Y + 40], text: "−3", size: 14 },
    { at: [nx(-2), NL_Y + 40], text: "−2", size: 14 },
    { at: [nx(-1), NL_Y + 40], text: "−1", size: 14 },
    { at: [nx(0), NL_Y + 40], text: "0", size: 14 },
    { at: [nx(1), NL_Y + 40], text: "1", size: 14 },
    { at: [nx(2), NL_Y + 40], text: "2", size: 14 },
    { at: [nx(3), NL_Y + 40], text: "3", size: 14 },
    { at: [nx(-1.5), NL_Y - 26], text: "−3/2", size: 13 },
    { at: [nx(-0.5), NL_Y - 26], text: "−1/2", size: 13 },
    { at: [nx(0.5), NL_Y - 26], text: "1/2", size: 13 },
    { at: [nx(2.5), NL_Y - 26], text: "5/2", size: 13 },
    { at: [nx(1.414) + 6, NL_Y - 26], text: "√2", size: 14, emphasis: true, align: "start" },
  ],
  parts: [
    {
      id: "line",
      label: "The number line",
      tint: T.line,
      depth: 0,
      backdrop: true,
      d: `M40,${NL_Y - 5} H620 V${NL_Y + 5} H40 Z`,
      layers: [
        { d: "M606,120 L626,132 L606,144 Z", as: "fill" },
        { d: "M54,120 L34,132 L54,144 Z", as: "fill" },
      ],
      focus: [34, NL_Y - 30, 120, 60],
      labelAt: [40, 216],
      leaderAt: [90, NL_Y + 5],
      labelAlign: "start",
      blurb:
        "One straight line standing in for every real number there is. Arrows at both ends say it never stops: however far out you go, there is always more line.",
    },
    {
      id: "integers",
      label: "Integers",
      tint: T.integer,
      depth: 1,
      d: dots([-3, -2, -1, 0, 1, 2, 3].map((v) => [nx(v), NL_Y] as [number, number]), 9),
      focus: [nx(-1) - 40, NL_Y - 40, 172, 80],
      labelAt: [150, 58],
      leaderAt: [nx(-1), NL_Y - 12],
      labelAlign: "end",
      blurb:
        "The whole numbers and their negatives, evenly spaced. They are the only points you can reach by repeatedly stepping one unit left or right from zero.",
    },
    {
      id: "rationals",
      label: "Rational numbers",
      tint: T.rational,
      depth: 2,
      d: dots(
        [
          [nx(-1.5), NL_Y],
          [nx(-0.5), NL_Y],
          [nx(0.5), NL_Y],
          [nx(2.5), NL_Y],
        ],
        7,
      ),
      focus: [nx(0.5) - 46, NL_Y - 40, 92, 80],
      labelAt: [560, 58],
      leaderAt: [nx(0.5), NL_Y - 10],
      labelAlign: "end",
      blurb:
        "Anything that can be written as one whole number over another. Between any two you name, another one always fits — halve the gap, and halve it again, for ever.",
    },
    {
      id: "irrational",
      label: "An irrational",
      tint: T.irrational,
      depth: 3,
      d: circle(nx(1.414), NL_Y, 8),
      focus: [nx(1.414) - 40, NL_Y - 40, 80, 80],
      labelAt: [330, 216],
      leaderAt: [nx(1.414), NL_Y + 10],
      labelAlign: "middle",
      blurb:
        "Root two sits on the line at a perfectly definite spot, yet no fraction of whole numbers lands exactly there. Its decimal runs on for ever without ever repeating.",
    },
  ],
};

/* ═══════════════════════════════════════════════ constructing root two ══ */

export const constructRootFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.11",
  title: "Constructing √2 on the number line",
  caption:
    "Build a right triangle with both legs one unit long. Its hypotenuse is exactly √2 — swing it down and you have marked an irrational number with nothing but a compass.",
  altText:
    "A number line with a unit square's diagonal constructed above it: a vertical unit segment at one, a hypotenuse from zero to its top, and an arc swinging that hypotenuse down onto the line to mark root two. Selecting a label magnifies that part.",
  viewBox: [660, 360],
  maxZoom: 2.8,
  scenery: [
    { d: "M60,246 H620 V254 H60 Z", as: "fill" },
    { d: "M120,236 V264 M270,236 V264 M420,236 V264 M570,236 V264", width: 1.6, opacity: 0.7 },
    { d: "M270,100 A212,212 0 0 1 332,250", width: 1.6, dash: "7 6", opacity: 0.85 },
    { d: "M270,232 H288 V250", width: 1.5, opacity: 0.8 },
  ],
  notes: [
    { at: [120, 292], text: "0", size: 14 },
    { at: [270, 292], text: "1", size: 14 },
    { at: [420, 292], text: "2", size: 14 },
    { at: [570, 292], text: "3", size: 14 },
    { at: [195, 232], text: "1", size: 14 },
    { at: [290, 176], text: "1", size: 14, align: "start" },
    { at: [332, 316], text: "√2", size: 16, emphasis: true },
  ],
  parts: [
    {
      id: "unit-segment",
      label: "One unit",
      tint: T.unit,
      depth: 0,
      d: "M120,245 H270 V255 H120 Z",
      focus: [112, 230, 166, 40],
      labelAt: [40, 340],
      leaderAt: [180, 252],
      labelAlign: "start",
      blurb:
        "The base of the triangle: the segment from zero to one, taken straight off the number line. Everything else in the construction is measured against this one length.",
    },
    {
      id: "perpendicular",
      label: "Perpendicular",
      tint: T.unit,
      depth: 1,
      d: "M265,100 V250 H275 V100 Z",
      focus: [250, 92, 40, 166],
      labelAt: [432, 128],
      leaderAt: [275, 160],
      labelAlign: "start",
      blurb:
        "A second unit length, raised at a right angle from the point one. Set-square or compass, it makes no difference — the right angle is what matters.",
    },
    {
      id: "hypotenuse",
      label: "Hypotenuse",
      tint: T.hyp,
      depth: 2,
      d: "M123.5,253.5 L273.5,103.5 L266.5,96.5 L116.5,246.5 Z",
      focus: [112, 92, 172, 172],
      labelAt: [40, 76],
      leaderAt: [190, 182],
      labelAlign: "start",
      blurb:
        "By Pythagoras its length is √(1² + 1²) = √2. No measuring is involved: the construction produces the exact length, decimal expansion and all.",
    },
    {
      id: "root-point",
      label: "√2 on the line",
      tint: T.irrational,
      depth: 3,
      d: circle(332, 250, 10),
      focus: [292, 210, 80, 80],
      labelAt: [620, 218],
      leaderAt: [340, 246],
      labelAlign: "end",
      blurb:
        "Set a compass to the hypotenuse, put its point on zero, and swing. Where the arc crosses the line is √2 — proof that irrational numbers have a definite place on it.",
    },
  ],
};

/* ═══════════════════════════════════════════════════ square root spiral ══ */

/* The spiral is generated, not typed: each triangle stands on the previous
 * hypotenuse, so a hand-authored version would be twenty-odd coordinates each
 * depending on the last. */
const SPIRAL_O: [number, number] = [318, 244];
const SPIRAL_U = 62;
const SPIRAL_N = 8;

function spiralPoints(): [number, number][] {
  const pts: [number, number][] = [[SPIRAL_U, 0]];
  for (let i = 1; i < SPIRAL_N; i++) {
    const [x, y] = pts[i - 1];
    const len = Math.hypot(x, y);
    // Unit perpendicular, turned anticlockwise on screen (y grows downward).
    pts.push([x + (y / len) * SPIRAL_U, y - (x / len) * SPIRAL_U]);
  }
  return pts.map(([x, y]) => [SPIRAL_O[0] + x, SPIRAL_O[1] + y]);
}

const SP = spiralPoints();

/** A thin closed band along a segment — a drawn line with real thickness. */
function bar(
  [x0, y0]: [number, number],
  [x1, y1]: [number, number],
  half = 3.5,
): string {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const px = (-(y1 - y0) / len) * half;
  const py = ((x1 - x0) / len) * half;
  const r = (n: number) => Number(n.toFixed(1));
  return (
    `M${r(x0 + px)},${r(y0 + py)} L${r(x1 + px)},${r(y1 + py)} ` +
    `L${r(x1 - px)},${r(y1 - py)} L${r(x0 - px)},${r(y0 - py)} Z`
  );
}

export const rootSpiralFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 3.14",
  title: "The square root spiral",
  caption:
    "Stand a unit length on the last hypotenuse, over and over. Each new hypotenuse is the square root of the next whole number — √2, √3, √4, and on for ever.",
  altText:
    "A spiral of right-angled triangles all sharing a common vertex. Each triangle has one unit-length leg standing on the previous hypotenuse, so the hypotenuses measure root two, root three, root four and so on. Selecting a label magnifies that part.",
  viewBox: [660, 430],
  maxZoom: 3,
  notes: SP.slice(1, 6).map((p, i) => ({
    at: [
      SPIRAL_O[0] + (p[0] - SPIRAL_O[0]) * 0.58 - 14,
      SPIRAL_O[1] + (p[1] - SPIRAL_O[1]) * 0.58 - 6,
    ] as [number, number],
    text: `√${i + 2}`,
    size: 13,
    emphasis: i === 0,
  })),
  parts: [
    {
      id: "spokes",
      label: "Hypotenuses",
      tint: T.spoke,
      depth: 0,
      d: SP.slice(1).map((p) => bar(SPIRAL_O, p, 3)).join(" "),
      focus: [SPIRAL_O[0] - 20, SPIRAL_O[1] - 120, 180, 150],
      labelAt: [608, 96],
      leaderAt: [(SPIRAL_O[0] + SP[3][0]) / 2, (SPIRAL_O[1] + SP[3][1]) / 2],
      labelAlign: "end",
      blurb:
        "Every line back to the centre. The first is 1, then √2, √3, √4 and so on — the spiral lays out the square root of every whole number as an actual length you can measure.",
    },
    {
      id: "legs",
      label: "Unit legs",
      tint: T.unit,
      depth: 1,
      d: SP.slice(0, -1).map((p, i) => bar(p, SP[i + 1], 3)).join(" "),
      focus: [SP[0][0] - 30, SP[0][1] - 90, 130, 130],
      labelAt: [608, 378],
      leaderAt: [(SP[1][0] + SP[2][0]) / 2, (SP[1][1] + SP[2][1]) / 2],
      labelAlign: "end",
      blurb:
        "Each outer edge is exactly one unit long and stands at a right angle to the hypotenuse before it. Repeating that one rule is the whole construction.",
    },
    {
      id: "first-triangle",
      label: "First triangle",
      tint: T.hyp,
      depth: 2,
      d: `M${SPIRAL_O[0]},${SPIRAL_O[1]} L${SP[0][0].toFixed(1)},${SP[0][1].toFixed(1)} L${SP[1][0].toFixed(1)},${SP[1][1].toFixed(1)} Z`,
      focus: [SPIRAL_O[0] - 10, SPIRAL_O[1] - 80, 100, 100],
      labelAt: [70, 378],
      leaderAt: [SPIRAL_O[0] + 34, SPIRAL_O[1] - 18],
      labelAlign: "start",
      blurb:
        "Two legs of one unit meeting at a right angle, so the hypotenuse is √2 — the same construction as the one on the number line, and the seed of the whole spiral.",
    },
    {
      id: "centre",
      label: "Common vertex",
      tint: T.arc,
      depth: 3,
      d: circle(SPIRAL_O[0], SPIRAL_O[1], 9),
      focus: [SPIRAL_O[0] - 40, SPIRAL_O[1] - 40, 80, 80],
      labelAt: [70, 96],
      leaderAt: [SPIRAL_O[0] - 8, SPIRAL_O[1] - 8],
      labelAlign: "start",
      blurb:
        "Every triangle shares this one point. That is what turns a chain of separate triangles into a spiral winding outward, each arm a little longer than the last.",
    },
  ],
};
