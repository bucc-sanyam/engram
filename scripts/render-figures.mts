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

function render(spec: FigureSpec, accent: string): string {
  const p = palette(accent);
  const [w, h] = spec.viewBox;
  const out: string[] = [];

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

  for (const { part } of ordered) {
    const c = cartoonFor(part.tint ?? accent, false);
    out.push(`<g>`);
    out.push(
      `<path d="${part.d}" fill="${c.fill}" fill-opacity="${part.backdrop ? 0.55 : 0.92}"/>`,
    );
    out.push(
      `<g clip-path="url(#c-${part.id})"><path d="${part.d}" fill="${c.shade}" transform="translate(${(w * 0.014).toFixed(1)} ${(h * 0.022).toFixed(1)})" opacity="${part.backdrop ? 0.22 : 0.42}"/></g>`,
    );
    for (const layer of part.layers ?? []) {
      out.push(layerSvg(layer, layer.tint ? cartoonFor(layer.tint, false) : c, p.panel));
    }
    out.push(
      `<path d="${part.d}" fill="none" stroke="${c.ink}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>`,
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
    if (fw <= 0 || fh <= 0) {
      problems.push(`${chapter}/${spec.title}: focus of "${part.id}" has zero size`);
    }
    if (part.labelAt) {
      const [lx, ly] = part.labelAt;
      const lines = wrapLabel(part.label);
      const align = part.labelAlign ?? (lx < w / 2 ? "end" : "start");
      // ~7.4 user units per character at font-size 15.
      const width = Math.max(...lines.map((l) => l.length)) * 7.4;
      const x0 = align === "end" ? lx - width : align === "middle" ? lx - width / 2 : lx;
      const x1 = x0 + width;
      const y0 = ly - 13;
      const y1 = ly + (lines.length - 1) * 17 + 4;
      if (x0 < -2 || x1 > w + 2 || y0 < 0 || y1 > h) {
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

const outDir = process.argv[2] ?? ".figures";
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
