/**
 * Path helpers for hand-authored figure plates.
 *
 * A labelled biology plate is mostly the same four shapes over and over —
 * circles, tilted ellipses, stacks of discs, folded membranes — placed by
 * hand. Writing each one as a literal `d` string means computing arc
 * endpoints by trigonometry in a comment, which is exactly the kind of
 * arithmetic that goes silently wrong. These helpers compute them instead.
 *
 * Everything returns a plain `d` string, so a spec built with them is still
 * a plain serialisable object. Dependency-free by design (SCHOOL_BUILD_SPEC
 * Rule 2).
 */

const r1 = (n: number) => Number(n.toFixed(1));

/** Closed circle. */
export function circle(cx: number, cy: number, r: number): string {
  return `M${r1(cx - r)},${r1(cy)} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0 Z`;
}

/**
 * Closed ellipse, optionally tilted.
 *
 * SVG has no rotated-ellipse primitive: a tilted organelle has to be two arc
 * commands whose endpoints sit on the rotated major axis. That is the sum of
 * this function.
 */
export function ellipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  deg = 0,
): string {
  const t = (deg * Math.PI) / 180;
  const dx = rx * Math.cos(t);
  const dy = rx * Math.sin(t);
  const x1 = r1(cx - dx);
  const y1 = r1(cy - dy);
  const x2 = r1(cx + dx);
  const y2 = r1(cy + dy);
  return `M${x1},${y1} A${rx},${ry} ${deg} 0 1 ${x2},${y2} A${rx},${ry} ${deg} 0 1 ${x1},${y1} Z`;
}

/** Several circles of one radius — ribosomes, granules, vesicles. */
export function dots(points: [number, number][], r: number): string {
  return points.map(([x, y]) => circle(x, y, r)).join(" ");
}

/** Smooth closed curve through a ring of points (Catmull-Rom → cubic). */
export function smoothClosed(pts: [number, number][]): string {
  const n = pts.length;
  const p = (q: [number, number]) => `${r1(q[0])},${r1(q[1])}`;
  const d: string[] = [`M${p(pts[0])}`];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d.push(
      `C${p([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ` +
        `${p([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${p(p2)}`,
    );
  }
  return d.join(" ") + " Z";
}

/**
 * An organelle outline: an ellipse whose radius is modulated per control point,
 * then rotated. `wobble` is one multiplier per point going clockwise from the
 * top, e.g. `[1, 0.95, 1.04, 0.96]`.
 *
 * This is the difference between an organelle and an oval, and it is why no two
 * chloroplasts on a plate come out the same shape. `ellipse()` is still the
 * right call for something genuinely regular — a lens, a disc in a stack.
 */
export function blob(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  wobble: number[],
  deg = 0,
): string {
  const t = (deg * Math.PI) / 180;
  const cos = Math.cos(t);
  const sin = Math.sin(t);
  const n = wobble.length;
  return smoothClosed(
    wobble.map((k, i) => {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = Math.cos(a) * rx * k;
      const y = Math.sin(a) * ry * k;
      return [cx + x * cos - y * sin, cy + x * sin + y * cos] as [number, number];
    }),
  );
}

/**
 * A cell in a tissue sheet: an organic near-ellipse.
 *
 * `circle`, `roundRect` and `stadium` are the right primitives for apparatus
 * and for anything genuinely manufactured. They are the WRONG ones for living
 * tissue — a field of them reads as a diagram of boxes, which is exactly what a
 * plate of parenchyma drawn with `circle` looked like.
 *
 * `seed` picks a deterministic wobble, so neighbouring cells in a sheet are
 * visibly siblings rather than clones. Same seed always gives the same shape,
 * which keeps the spec serialisable and the renders reproducible.
 */
export function cell(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed = 0,
  deg = 0,
): string {
  // A cheap deterministic hash — enough to decorrelate neighbours, and stable
  // across runs in a way Math.random could never be.
  const wobble = Array.from({ length: 8 }, (_, i) => {
    const n = Math.sin((seed + 1) * 12.9898 + i * 78.233) * 43758.5453;
    return 0.93 + (n - Math.floor(n)) * 0.14;
  });
  return blob(cx, cy, rx, ry, wobble, deg);
}

/**
 * The pale crescent up and left of centre that sells a shape as a solid rather
 * than a sticker. Draw it as a `light` layer.
 */
export function gleam(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  deg = -26,
): string {
  return ellipse(cx - rx * 0.24, cy - ry * 0.38, rx * 0.46, ry * 0.32, deg);
}

/**
 * A folded-membrane zig-zag along an axis — cristae inside a mitochondrion,
 * infoldings in a membrane. `deg` tilts it to match the organelle it sits in.
 */
export function cristae(
  cx: number,
  cy: number,
  length: number,
  amplitude: number,
  teeth: number,
  deg = 0,
): string {
  const t = (deg * Math.PI) / 180;
  const ux = Math.cos(t);
  const uy = Math.sin(t);
  const px = -Math.sin(t);
  const py = Math.cos(t);
  const pts: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const s = -length / 2 + (length * i) / teeth;
    const o = (i % 2 === 0 ? -1 : 1) * amplitude;
    pts.push(`${r1(cx + ux * s + px * o)},${r1(cy + uy * s + py * o)}`);
  }
  return "M" + pts.join(" L");
}

/** A stack of flattened discs — the grana of a chloroplast. */
export function discStack(
  cx: number,
  cy: number,
  count: number,
  rx: number,
  ry: number,
  gap: number,
): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(ellipse(cx, cy + (i - (count - 1) / 2) * gap, rx, ry));
  }
  return out.join(" ");
}

/**
 * A curved cisterna — one flattened sac of a Golgi body or an ER stack.
 * Drawn as a shallow arc and its offset copy, closed into a ribbon.
 */
export function cisterna(
  cx: number,
  cy: number,
  halfWidth: number,
  bow: number,
  thickness = 6,
): string {
  const l = r1(cx - halfWidth);
  const rr = r1(cx + halfWidth);
  const c1 = r1(cx - halfWidth * 0.45);
  const c2 = r1(cx + halfWidth * 0.45);
  const top = r1(cy);
  const bot = r1(cy + thickness);
  return (
    `M${l},${top} C${c1},${r1(cy - bow)} ${c2},${r1(cy - bow)} ${rr},${top} ` +
    `L${rr},${bot} C${c2},${r1(cy - bow + thickness)} ${c1},${r1(cy - bow + thickness)} ${l},${bot} Z`
  );
}

/**
 * A wavy ribbon — one endoplasmic-reticulum tubule. Same idea as `cisterna`
 * but with an S-curve rather than a single bow, which is what makes an ER
 * stack read as tubules rather than as a pile of plates.
 */
export function tubule(
  x0: number,
  y: number,
  x1: number,
  wave: number,
  thickness = 7,
): string {
  const a = r1(x0 + (x1 - x0) * 0.34);
  const b = r1(x0 + (x1 - x0) * 0.66);
  return (
    `M${r1(x0)},${r1(y)} C${a},${r1(y - wave)} ${b},${r1(y + wave)} ${r1(x1)},${r1(y)} ` +
    `L${r1(x1)},${r1(y + thickness)} C${b},${r1(y + wave + thickness)} ${a},${r1(y - wave + thickness)} ${r1(x0)},${r1(y + thickness)} Z`
  );
}

/** A rounded rectangle — a plant cell outline, a slide, a microscope stage. */
export function roundRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): string {
  return (
    `M${r1(x + r)},${r1(y)} H${r1(x + w - r)} A${r},${r} 0 0 1 ${r1(x + w)},${r1(y + r)} ` +
    `V${r1(y + h - r)} A${r},${r} 0 0 1 ${r1(x + w - r)},${r1(y + h)} H${r1(x + r)} ` +
    `A${r},${r} 0 0 1 ${r1(x)},${r1(y + h - r)} V${r1(y + r)} A${r},${r} 0 0 1 ${r1(x + r)},${r1(y)} Z`
  );
}

/**
 * A stadium (rod with hemispherical caps) — a bacillus, a body tube, a
 * condensed chromosome.
 *
 * Handles both orientations. A horizontal-only version silently produced a
 * malformed path whenever it was asked for something taller than it is wide
 * (`H` ran backwards past the cap), which is exactly what a chromosome on a
 * metaphase plate is.
 */
export function stadium(x: number, y: number, w: number, h: number): string {
  if (w >= h) {
    const r = h / 2;
    return (
      `M${r1(x + r)},${r1(y)} H${r1(x + w - r)} A${r},${r} 0 0 1 ${r1(x + w - r)},${r1(y + h)} ` +
      `H${r1(x + r)} A${r},${r} 0 0 1 ${r1(x + r)},${r1(y)} Z`
    );
  }
  const r = w / 2;
  return (
    `M${r1(x + w)},${r1(y + r)} V${r1(y + h - r)} A${r},${r} 0 0 1 ${r1(x)},${r1(y + h - r)} ` +
    `V${r1(y + r)} A${r},${r} 0 0 1 ${r1(x + w)},${r1(y + r)} Z`
  );
}

/**
 * Cristae as they are actually drawn in a textbook: short folds reaching in
 * alternately from the top and bottom edges of an organelle, not a zig-zag
 * scribbled down its middle. `deg` matches the tilt of the ellipse they sit in.
 *
 * The earlier zig-zag helper read as a lightning bolt at the size a
 * mitochondrion occupies inside a whole-cell plate, which is the size that
 * matters most.
 */
export function folds(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  count: number,
  deg = 0,
  reach = 1.5,
): string {
  const t = (deg * Math.PI) / 180;
  const ux = Math.cos(t);
  const uy = Math.sin(t);
  const px = -Math.sin(t);
  const py = Math.cos(t);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    // Spread across the middle 72% of the long axis — a fold at the very tip
    // would have no room to reach anywhere.
    const s = count === 1 ? 0 : -rx * 0.72 + ((rx * 1.44) / (count - 1)) * i;
    const halfHeight = ry * Math.sqrt(Math.max(0, 1 - (s / rx) ** 2)) * 0.9;
    const sign = i % 2 === 0 ? -1 : 1;
    const from = sign * halfHeight;
    const to = from - sign * halfHeight * reach;
    out.push(
      `M${r1(cx + ux * s + px * from)},${r1(cy + uy * s + py * from)} ` +
        `L${r1(cx + ux * s + px * to)},${r1(cy + uy * s + py * to)}`,
    );
  }
  return out.join(" ");
}

/** Spindle fibres fanning from a pole to a row of points at the equator. */
export function spindle(
  poleX: number,
  poleY: number,
  equatorY: number,
  spread: number,
  fibres = 4,
): string {
  const out: string[] = [];
  for (let i = 0; i < fibres; i++) {
    const t = fibres === 1 ? 0.5 : i / (fibres - 1);
    const x = poleX - spread + spread * 2 * t;
    out.push(`M${r1(poleX)},${r1(poleY)} L${r1(x)},${r1(equatorY)}`);
  }
  return out.join(" ");
}

/** Short capsule bars — condensed chromosomes on a metaphase plate. */
export function chromosomes(
  points: [number, number][],
  length: number,
  thickness: number,
): string {
  return points
    .map(([x, y]) => stadium(x - length / 2, y - thickness / 2, length, thickness))
    .join(" ");
}

/* ── measuring a path ────────────────────────────────────────────── */

/** `[x, y, width, height]` — the same shape as `FigurePart.focus`. */
export type Box = [number, number, number, number];

/** One `M`-to-`M` run of a `d` string, with the box it covers. */
export type Subpath = { d: string; box: Box };

const CMD = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
const NUM = /[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g;

type Acc = { x0: number; y0: number; x1: number; y1: number };

function grow(a: Acc | null, x: number, y: number): Acc {
  if (!a) return { x0: x, y0: y, x1: x, y1: y };
  a.x0 = Math.min(a.x0, x);
  a.y0 = Math.min(a.y0, y);
  a.x1 = Math.max(a.x1, x);
  a.y1 = Math.max(a.y1, y);
  return a;
}

/**
 * Extend `a` over an elliptical arc, via the endpoint→centre conversion in the
 * SVG spec (F.6.5) followed by the box of the WHOLE ellipse.
 *
 * That over-estimates a partial sweep and is exact for the two half-turns that
 * `circle()` and `ellipse()` are built from — which is every arc on these
 * plates. Over-estimating is the safe direction: the box is only ever used to
 * decide what to keep, so a generous one keeps a shape whole.
 */
function growArc(
  a: Acc | null,
  x1: number,
  y1: number,
  rxIn: number,
  ryIn: number,
  phiDeg: number,
  fa: number,
  fs: number,
  x2: number,
  y2: number,
): Acc {
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx === 0 || ry === 0) return grow(a, x2, y2);
  const t = (phiDeg * Math.PI) / 180;
  const cos = Math.cos(t);
  const sin = Math.sin(t);
  const hx = (x1 - x2) / 2;
  const hy = (y1 - y2) / 2;
  const xp = cos * hx + sin * hy;
  const yp = -sin * hx + cos * hy;
  const lam = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
  if (lam > 1) {
    const s = Math.sqrt(lam);
    rx *= s;
    ry *= s;
  }
  const den = rx * rx * yp * yp + ry * ry * xp * xp;
  const num = Math.max(0, rx * rx * ry * ry - den);
  const c = den ? (fa !== fs ? 1 : -1) * Math.sqrt(num / den) : 0;
  const cx = cos * ((c * rx * yp) / ry) - sin * ((-c * ry * xp) / rx) + (x1 + x2) / 2;
  const cy = sin * ((c * rx * yp) / ry) + cos * ((-c * ry * xp) / rx) + (y1 + y2) / 2;
  const ex = Math.sqrt(rx * rx * cos * cos + ry * ry * sin * sin);
  const ey = Math.sqrt(rx * rx * sin * sin + ry * ry * cos * cos);
  return grow(grow(a, cx - ex, cy - ey), cx + ex, cy + ey);
}

/**
 * Split a `d` string into its subpaths — one per `M` — each with its bounding
 * box.
 *
 * A single `FigurePart` is very often SEVERAL copies of one structure: four
 * chloroplasts, five stacks of grana, thirty-six phospholipid heads. They share
 * one `d`, so anything that wants to act on "the one the label points at" has to
 * be able to tell them apart, and that means measuring them.
 *
 * Curves are boxed by their control points (an over-estimate, never an
 * under-estimate). Deliberately only as much of an SVG path parser as the
 * plates in this repo emit — every path here comes from the helpers above.
 */
export function subpaths(d: string): Subpath[] {
  const out: Subpath[] = [];
  let acc: Acc | null = null;
  let start = 0;
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;

  const flush = (end: number) => {
    if (acc) out.push({ d: d.slice(start, end).trim(), box: [acc.x0, acc.y0, acc.x1 - acc.x0, acc.y1 - acc.y0] });
    acc = null;
  };

  CMD.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CMD.exec(d)) !== null) {
    const cmd = m[1];
    const up = cmd.toUpperCase();
    const rel = cmd !== up;
    const n = (m[2].match(NUM) ?? []).map(Number);
    const at = m.index;

    if (up === "Z") {
      x = sx;
      y = sy;
      continue;
    }

    const step = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 }[up] ?? 2;
    for (let i = 0; i + step <= n.length; i += step) {
      const ax = (v: number) => (rel ? x + v : v);
      const ay = (v: number) => (rel ? y + v : v);
      switch (up) {
        case "M": {
          const nx = ax(n[i]);
          const ny = ay(n[i + 1]);
          // Only the first pair after an `M` moves; the rest are implicit lines.
          if (i === 0) {
            flush(at);
            start = at;
            sx = nx;
            sy = ny;
          }
          x = nx;
          y = ny;
          acc = grow(acc, x, y);
          break;
        }
        case "L":
          x = ax(n[i]);
          y = ay(n[i + 1]);
          acc = grow(acc, x, y);
          break;
        case "H":
          x = ax(n[i]);
          acc = grow(acc, x, y);
          break;
        case "V":
          y = ay(n[i]);
          acc = grow(acc, x, y);
          break;
        case "C":
          acc = grow(grow(grow(acc, ax(n[i]), ay(n[i + 1])), ax(n[i + 2]), ay(n[i + 3])), ax(n[i + 4]), ay(n[i + 5]));
          x = ax(n[i + 4]);
          y = ay(n[i + 5]);
          break;
        case "S":
        case "Q":
          acc = grow(grow(acc, ax(n[i]), ay(n[i + 1])), ax(n[i + 2]), ay(n[i + 3]));
          x = ax(n[i + 2]);
          y = ay(n[i + 3]);
          break;
        case "T":
          x = ax(n[i]);
          y = ay(n[i + 1]);
          acc = grow(acc, x, y);
          break;
        case "A": {
          const nx = ax(n[i + 5]);
          const ny = ay(n[i + 6]);
          acc = growArc(acc, x, y, n[i], n[i + 1], n[i + 2], n[i + 3], n[i + 4], nx, ny);
          x = nx;
          y = ny;
          break;
        }
      }
    }
  }
  flush(d.length);
  return out;
}

function unionBox(boxes: Box[]): Box {
  const x0 = Math.min(...boxes.map((b) => b[0]));
  const y0 = Math.min(...boxes.map((b) => b[1]));
  const x1 = Math.max(...boxes.map((b) => b[0] + b[2]));
  const y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
  return [x0, y0, x1 - x0, y1 - y0];
}

const centreOf = (b: Box): [number, number] => [b[0] + b[2] / 2, b[1] + b[3] / 2];

const holds = (b: Box, px: number, py: number) =>
  px >= b[0] && px <= b[0] + b[2] && py >= b[1] && py <= b[1] + b[3];

/**
 * The single copy of a multi-copy part that its `focus` box was authored around.
 *
 * Lifting a part scales its whole `d` about ONE centre, so the other copies sail
 * outward off the plate. The fix is to lift only the representative — but it has
 * to be lifted WHOLE. Cutting a window around the focus box instead (which is
 * what this used to do) slices straight through any shape bigger than its own
 * focus, and a mitochondrion's inner membrane then lifts as a pink rectangle.
 *
 * So: keep a shape if its centre is inside the focus box, or if it contains the
 * focus box's centre — the second clause is what keeps a single large shape,
 * whose focus box is a small window onto part of it, entirely intact.
 *
 * Returns `null` when nothing was dropped, which is the common case and means
 * the caller should draw the part exactly as authored.
 */
export function liftSubset(d: string, focus: Box): Subpath | null {
  const subs = subpaths(d);
  if (subs.length <= 1) return null;
  const [fcx, fcy] = centreOf(focus);
  const keep = subs.filter((s) => {
    const [cx, cy] = centreOf(s.box);
    return holds(focus, cx, cy) || holds(s.box, fcx, fcy);
  });
  if (keep.length === 0 || keep.length === subs.length) return null;
  return { d: keep.map((s) => s.d).join(" "), box: unionBox(keep.map((s) => s.box)) };
}

/**
 * The detail layers belonging to the copy `liftSubset` kept — cristae inside one
 * mitochondrion, the highlight on one phospholipid head. Without this a lifted
 * head carries the gleams of all thirty-five it left behind.
 *
 * Generous by 25% of the kept box, because a layer legitimately overhangs the
 * body it decorates (a mirror's stem, a leader dot).
 */
export function layerSubset(d: string, box: Box): string {
  const [x, y, w, h] = box;
  const pad: Box = [x - w * 0.25, y - h * 0.25, w * 1.5, h * 1.5];
  const keep = subpaths(d).filter((s) => holds(pad, ...centreOf(s.box)));
  return keep.map((s) => s.d).join(" ");
}
