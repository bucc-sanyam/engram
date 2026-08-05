/**
 * Rasterise every `kind: "figure"` plate to a standalone .svg for eyeballing.
 *
 * Hand-authored SVG is the one thing in this repo that `tsc` cannot check: a
 * spec compiles perfectly while an organelle sits outside its cell, a leader
 * line points at empty space, or two labels overlap. This script paints each
 * plate exactly as FigureSim paints it (same layer order, same palette) and
 * writes it to disk, so the drawing can be looked at without a browser.
 *
 *   npx tsx scripts/render-figures.mts [outDir]
 *
 * Not a package dependency and not imported by the app — a build tool only.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { FigureSpec, FigureLayer, SimSpec } from "../src/lib/sim/types.js";
import { cartoonFor } from "../src/lib/sim/shading.js";
import { liftSubset, layerSubset, subpaths } from "../src/lib/sim/draw.js";
import { allChapters } from "../src/lib/cbse/class9/index.js";

/* The dark-theme half of useVizPalette(), which is a client hook. */
const palette = (accent: string) => ({
  accent,
  accentFill: `${accent}26`,
  ink: "rgba(255,252,245,0.85)",
  cellFill: "rgba(255,252,245,0.04)",
  gridStroke: "rgba(255,252,245,0.16)",
  edgeStroke: "rgba(255,252,245,0.18)",
  muted: "rgba(255,252,245,0.65)",
  panel: "#0b0a0e",
});

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const LABEL_CHARS = 15;
function wrapLabel(text: string): string[] {
  if (text.length <= LABEL_CHARS) return [text];
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (!line) line = word;
    else if (line.length + 1 + word.length <= LABEL_CHARS) line += " " + word;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function layerSvg(layer: FigureLayer, c: ReturnType<typeof cartoonFor>, backdrop = "#0b0a0e") {
  const as = layer.as ?? "stroke";
  const solid =
    as === "fill" ? c.fill : as === "shade" ? c.shade : as === "panel" ? backdrop : c.light;
  const paint =
    as === "stroke"
      ? `fill="none" stroke="${c.ink}" stroke-width="${layer.width ?? 1.2}"`
      : `fill="${solid}" stroke="none"`;
  const dash = layer.dash ? ` stroke-dasharray="${layer.dash}"` : "";
  return `<path d="${layer.d}" ${paint}${dash} stroke-linecap="round" stroke-linejoin="round" opacity="${layer.opacity ?? 1}"/>`;
}

/* The `magnify: "part"` constants, mirrored from FigureSim. Kept in sync by
   hand: this script exists to show what the component actually draws, so a
   drifted constant here is a lying preview. */
const LIFT_TARGET = 0.3;
const LIFT_MIN = 1.35;
const LIFT_MAX = 2.8;
const LIFT_RECENTRE = 0.35;
const PART_DIM = 0.3;
const PART_DIM_BACKDROP = 0.62;
const TAG_CHAR_W = 7.6;
const TAG_FONT = 14;
const TAG_H = 26;
const TAG_GAP = 12;

const clampN = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Renders a plate. Pass `lift` (a part id) to draw it as it looks mid-click
 *  in `magnify: "part"` mode — that part enlarged, tagged, everything else
 *  dimmed. Without this there is no way to eyeball tag placement, which is
 *  geometry and therefore exactly the thing that goes wrong unseen. */
function render(spec: FigureSpec, accent: string, lift?: string): string {
  const p = palette(accent);
  const [w, h] = spec.viewBox;
  const out: string[] = [];
  const lifted = lift ? spec.parts.find((pt) => pt.id === lift) : undefined;
  const partMode = spec.magnify === "part" && !!lifted;

  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Inter, system-ui, sans-serif">`,
  );
  out.push(`<rect width="${w}" height="${h}" fill="${p.panel}"/>`);

  out.push("<defs>");
  for (const part of spec.parts) {
    out.push(`<clipPath id="c-${part.id}"><path d="${part.d}"/></clipPath>`);
  }
  out.push("</defs>");

  for (const s of spec.scenery ?? []) {
    const c = s.tint
      ? cartoonFor(s.tint, false)
      : { fill: p.gridStroke, shade: p.gridStroke, ink: p.muted, light: p.cellFill };
    out.push(layerSvg(s, c, p.panel));
  }

  const ordered = spec.parts
    .map((part, i) => ({ part, order: part.depth ?? i }))
    .sort((a, b) => a.order - b.order);

  const paintOrder = partMode
    ? [...ordered].sort((a, b) =>
        a.part.id === lift ? 1 : b.part.id === lift ? -1 : 0,
      )
    : ordered;

  for (const { part } of paintOrder) {
    const c = cartoonFor(part.tint ?? accent, false);
    const isLifted = partMode && part.id === lift;
    const opacity = !partMode || isLifted
      ? 1
      : part.backdrop
        ? PART_DIM_BACKDROP
        : PART_DIM;

    let transform = "";
    if (isLifted && !part.backdrop) {
      const [fx, fy, fw, fh] = part.focus;
      const cx = fx + fw / 2;
      const cy = fy + fh / 2;
      const k = clampN((Math.min(w, h) * LIFT_TARGET) / Math.max(fw, fh), LIFT_MIN, LIFT_MAX);
      const dx = (w / 2 - cx) * LIFT_RECENTRE;
      const dy = (h / 2 - cy) * LIFT_RECENTRE;
      transform = ` transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(3)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})"`;
    }

    // Which copy of a multi-copy part travels with the lift, and the ghost of
    // the rest left behind in the plate. Shared with FigureSim rather than
    // mirrored, so this half of the preview cannot drift.
    const subset = isLifted && !part.backdrop ? liftSubset(part.d, part.focus) : null;
    const body = subset?.d ?? part.d;
    if (subset) {
      out.push(
        `<g opacity="${PART_DIM}"><path d="${part.d}" fill="${c.fill}" fill-opacity="0.92"/>` +
          `<path d="${part.d}" fill="none" stroke="${c.ink}" stroke-width="1.5" stroke-linejoin="round"/></g>`,
      );
    }
    out.push(`<g opacity="${opacity}"${transform}>`);
    if (isLifted && !part.backdrop) {
      out.push(
        `<path d="${body}" fill="rgba(12,8,20,0.3)" transform="translate(${(w * 0.008).toFixed(1)} ${(h * 0.022).toFixed(1)})"/>`,
      );
    }
    out.push(
      `<path d="${body}" fill="${c.fill}" fill-opacity="${part.backdrop ? 0.55 : 0.92}"/>`,
    );
    out.push(
      `<g clip-path="url(#c-${part.id})"><path d="${body}" fill="${c.shade}" transform="translate(${(w * 0.014).toFixed(1)} ${(h * 0.022).toFixed(1)})" opacity="${part.backdrop ? 0.22 : 0.42}"/></g>`,
    );
    for (const layer of part.layers ?? []) {
      const l = subset ? { ...layer, d: layerSubset(layer.d, subset.box) } : layer;
      const painted = layerSvg(l, layer.tint ? cartoonFor(layer.tint, false) : c, p.panel);
      // Interior texture is clipped to the silhouette it fills — mirrors FigureSim.
      out.push(layer.clip ? `<g clip-path="url(#c-${part.id})">${painted}</g>` : painted);
    }
    out.push(
      `<path d="${body}" fill="none" stroke="${c.ink}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>`,
    );
    out.push(`</g>`);
  }

  for (const note of spec.notes ?? []) {
    out.push(
      `<text x="${note.at[0]}" y="${note.at[1]}" text-anchor="${note.align ?? "middle"}" font-size="${note.size ?? 14}" fill="${note.emphasis ? p.accent : p.muted}" stroke="${p.panel}" stroke-width="3" paint-order="stroke" stroke-linejoin="round">${esc(note.text)}</text>`,
    );
  }

  for (const panel of spec.panels ?? []) {
    out.push(
      `<text x="${panel.box[0] + panel.box[2] / 2}" y="${panel.box[1] + panel.box[3] + 20}" text-anchor="middle" font-size="15" font-style="italic" fill="${p.muted}">${esc(panel.caption)}</text>`,
    );
  }

  for (const part of spec.parts) {
    if (!part.labelAt) continue;
    if (partMode && part.id === lift && !part.backdrop) continue;
    const [lx, ly] = part.labelAt;
    const [fx, fy, fw, fh] = part.focus;
    const [ax, ay] = part.leaderAt ?? [fx + fw / 2, fy + fh / 2];
    const align = part.labelAlign ?? (lx < w / 2 ? "end" : "start");
    const gap = align === "end" ? -7 : align === "start" ? 7 : 0;
    const lines = wrapLabel(part.label);
    const anchorY = ly - 4 + ((lines.length - 1) * 17) / 2;
    out.push(
      `<line x1="${lx + gap}" y1="${anchorY}" x2="${ax}" y2="${ay}" stroke="${p.edgeStroke}" stroke-width="1"/>`,
    );
    out.push(`<circle cx="${ax}" cy="${ay}" r="2.6" fill="${p.edgeStroke}"/>`);
    const tspans = lines
      .map((l, i) => `<tspan x="${lx}" dy="${i === 0 ? 0 : 17}">${esc(l)}</tspan>`)
      .join("");
    out.push(
      `<text x="${lx}" y="${ly}" text-anchor="${align}" font-size="15" fill="${p.ink}" stroke="${p.panel}" stroke-width="3.5" paint-order="stroke" stroke-linejoin="round">${tspans}</text>`,
    );
  }

  if (lifted && partMode && !lifted.backdrop) {
    const [fx, fy, fw, fh] = lifted.focus;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;
    const k = clampN((Math.min(w, h) * LIFT_TARGET) / Math.max(fw, fh), LIFT_MIN, LIFT_MAX);
    const lcx = cx + (w / 2 - cx) * LIFT_RECENTRE;
    const lcy = cy + (h / 2 - cy) * LIFT_RECENTRE;
    const halfH = (fh / 2) * k;
    const tw = lifted.label.length * TAG_CHAR_W + 26;
    const halfW = (fw / 2) * k;
    const tall = halfH * 2 > h * 0.55;
    const above = lcy - halfH - TAG_GAP - TAG_H;
    const ty = clampN(
      tall ? lcy - TAG_H / 2 : above < 4 ? lcy + halfH + TAG_GAP : above,
      4,
      Math.max(4, h - TAG_H - 4),
    );
    const tx = clampN(
      tall ? (lcx < w / 2 ? lcx + halfW + TAG_GAP : lcx - halfW - TAG_GAP - tw) : lcx - tw / 2,
      4,
      Math.max(4, w - tw - 4),
    );
    out.push(
      `<rect x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" width="${tw.toFixed(1)}" height="${TAG_H}" rx="${TAG_H / 2}" fill="${p.panel}" stroke="${p.accent}" stroke-width="1.5"/>`,
    );
    out.push(
      `<text x="${(tx + tw / 2).toFixed(1)}" y="${(ty + TAG_H / 2 + TAG_FONT * 0.36).toFixed(1)}" text-anchor="middle" font-size="${TAG_FONT}" font-weight="600" fill="${p.accent}">${esc(lifted.label)}</text>`,
    );
  }

  out.push("</svg>");
  return out.join("\n");
}

/* ---- geometry sanity checks the eye would miss ------------------------- */

function audit(spec: FigureSpec, chapter: string): string[] {
  const [w, h] = spec.viewBox;
  const problems: string[] = [];
  const seen = new Set<string>();
  const boxes: { id: string; x: number; y: number; w: number; hh: number }[] = [];

  for (const part of spec.parts) {
    if (seen.has(part.id)) problems.push(`${chapter}/${spec.title}: duplicate part id "${part.id}"`);
    seen.add(part.id);

    const [fx, fy, fw, fh] = part.focus;
    if (fx < 0 || fy < 0 || fx + fw > w || fy + fh > h) {
      problems.push(`${chapter}/${spec.title}: focus of "${part.id}" falls outside the viewBox`);
    }
    // A filled body with no area is a part that vanished. It happens when a
    // helper is called with the wrong argument order — `tubule(x0, y, x1, wave,
    // thickness)` is HORIZONTAL, and calling it as if it were (x0,y0,x1,y1)
    // gives x0 === x1, a zero-length ribbon that renders as a bare stroked line
    // with nothing in it. Four parts shipped that way before this check existed.
    for (const sp of subpaths(part.d)) {
      const [, , sw, sh] = sp.box;
      if (sw < 0.5 || sh < 0.5) {
        problems.push(
          `${chapter}/${spec.title}: part "${part.id}" has a zero-area subpath (${sw.toFixed(1)}x${sh.toFixed(1)}) — a filled body drawn as a bare line`,
        );
        break;
      }
    }
    if (fw <= 0 || fh <= 0) {
      problems.push(`${chapter}/${spec.title}: focus of "${part.id}" has zero size`);
    }
    if (part.labelAt) {
      const [lx, ly] = part.labelAt;
      const lines = wrapLabel(part.label);
      const align = part.labelAlign ?? (lx < w / 2 ? "end" : "start");
      // Per-character advance at font-size 15, measured off the live SVG with
      // getBBox across every label on a plate: 7.2 for lowercase-heavy text,
      // 8.0 for short capitalised text. This has to be the WORST case, not the
      // average — at 7.4 a 15-character label sitting at x=110 audited clean
      // and rendered with its first letter shaved off the plate.
      const width = Math.max(...lines.map((l) => l.length)) * 8.0;
      const x0 = align === "end" ? lx - width : align === "middle" ? lx - width / 2 : lx;
      const x1 = x0 + width;
      const y0 = ly - 13;
      const y1 = ly + (lines.length - 1) * 17 + 4;
      if (x0 < 0 || x1 > w || y0 < 0 || y1 > h) {
        problems.push(
          `${chapter}/${spec.title}: label "${part.label}" runs off the plate (x ${x0.toFixed(0)}–${x1.toFixed(0)}, y ${y0.toFixed(0)}–${y1.toFixed(0)} in ${w}x${h})`,
        );
      }
      for (const b of boxes) {
        if (x0 < b.x + b.w && x1 > b.x && y0 < b.y + b.hh && y1 > b.y) {
          problems.push(
            `${chapter}/${spec.title}: label "${part.label}" overlaps label "${b.id}"`,
          );
        }
      }
      boxes.push({ id: part.label, x: x0, y: y0, w: width, hh: y1 - y0 });
    }
  }
  if (spec.defaultPartId && !seen.has(spec.defaultPartId)) {
    problems.push(`${chapter}/${spec.title}: defaultPartId "${spec.defaultPartId}" is not a part`);
  }
  return problems;
}

/* ---- main -------------------------------------------------------------- */

const args = process.argv.slice(2);
const liftFlag = args.indexOf("--lift");
const liftId = liftFlag >= 0 ? args[liftFlag + 1] : undefined;
const outDir = args.find((a) => !a.startsWith("--") && a !== liftId) ?? ".figures";
mkdirSync(outDir, { recursive: true });

const isFigure = (s: SimSpec | undefined): s is FigureSpec => s?.kind === "figure";

let count = 0;
const problems: string[] = [];

for (const chapter of allChapters()) {
  for (const section of chapter.sections) {
    const specs = [section.sim, ...(section.figures ?? [])].filter(isFigure);
    for (const spec of specs) {
      const slug = `${chapter.key}--${section.key}--${spec.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`;
      writeFileSync(join(outDir, `${slug}.svg`), render(spec, chapter.accent));
      if (liftId && spec.parts.some((pt) => pt.id === liftId)) {
        writeFileSync(
          join(outDir, `${slug}--lift-${liftId}.svg`),
          render(spec, chapter.accent, liftId),
        );
      }
      problems.push(...audit(spec, chapter.key));
      count++;
    }
  }
}

console.log(`rendered ${count} figure(s) to ${outDir}/`);
if (problems.length) {
  console.log(`\n${problems.length} geometry problem(s):`);
  for (const p of problems) console.log("  ✗ " + p);
  process.exit(1);
}
console.log("no geometry problems");
