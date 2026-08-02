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
