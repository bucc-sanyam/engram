"use client";

import type { TreeVizPayload } from "./types";
import { useVizPalette } from "@/lib/viz-theme";

/** Approximate text width at fontSize 13 with monospace (~7.8px/char). */
const CHAR_W = 7.8;
const FONT_SIZE = 13;
const PAD_X = 22; // horizontal padding inside a pill
const LINE_H = 16; // line height for wrapped labels
const NODE_R = 22; // radius used for short circular nodes
const ROW_GAP = 34; // vertical gap between BFS levels
// Wrap labels longer than this so a sentence-length label makes a compact
// multi-line pill instead of one giant box that blows out the whole diagram.
const MAX_LINE_CHARS = 18;
// Diagrams shrink to fit their column, but never below this fraction of natural
// size — past it they scroll horizontally (see the `overflow-x-auto` wrapper)
// instead of squashing into an illegible smear.
const MIN_LEGIBLE_SCALE = 0.72;

/** Split a label into lines of at most `maxChars`, breaking on word boundaries. */
function wrapLabel(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w;
    if (candidate.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = candidate;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [text];
}

/** Simple tree/graph diagram — BFS-level layout with wrapped labels + dynamic sizing. */
export default function TreeViz({ payload, accent = "#f5b95f" }: { payload: TreeVizPayload; accent?: string }) {
  const pal = useVizPalette(accent);
  const byId = new Map(payload.nodes.map((n) => [n.id, n]));

  // BFS levels from the root
  const levels: string[][] = [];
  const depthOf = new Map<string, number>();
  const queue: string[] = [payload.rootId];
  depthOf.set(payload.rootId, 0);
  while (queue.length) {
    const id = queue.shift()!;
    const depth = depthOf.get(id)!;
    (levels[depth] ??= []).push(id);
    for (const childId of byId.get(id)?.children ?? []) {
      if (!depthOf.has(childId)) {
        depthOf.set(childId, depth + 1);
        queue.push(childId);
      }
    }
  }

  // Per-node geometry: wrapped lines + pill/circle size
  type Geo = { lines: string[]; w: number; h: number; circle: boolean };
  const geo = new Map<string, Geo>();
  for (const n of payload.nodes) {
    const lines = wrapLabel(n.label, MAX_LINE_CHARS);
    const longest = Math.max(...lines.map((l) => l.length));
    const textW = longest * CHAR_W;
    const circle = lines.length === 1 && textW <= NODE_R * 1.7;
    const w = circle ? NODE_R * 2 : textW + PAD_X;
    const h = circle ? NODE_R * 2 : Math.max(lines.length * LINE_H + 14, NODE_R * 2);
    geo.set(n.id, { lines, w, h, circle });
  }

  // Column slot width = widest pill across the tree (keeps levels centered/aligned);
  // wrapping keeps this modest even for sentence labels.
  const colW = Math.max(...payload.nodes.map((n) => geo.get(n.id)!.w), NODE_R * 2) + 16;
  const maxCols = Math.max(...levels.map((l) => l.length), 1);
  const width = maxCols * colW;

  // Cumulative Y per level, sized to the tallest node in that level
  const rowY: number[] = [];
  let yAcc = 0;
  for (let d = 0; d < levels.length; d++) {
    const rowH = Math.max(...levels[d].map((id) => geo.get(id)!.h), NODE_R * 2);
    rowY.push(yAcc + rowH / 2);
    yAcc += rowH + ROW_GAP;
  }
  const height = yAcc - ROW_GAP;

  const pos = new Map<string, { x: number; y: number }>();
  levels.forEach((level, depth) => {
    const rowWidth = level.length * colW;
    const offset = (width - rowWidth) / 2;
    level.forEach((id, idx) => {
      pos.set(id, { x: offset + idx * colW + colW / 2, y: rowY[depth] });
    });
  });

  const edges: { from: string; to: string }[] = [];
  for (const n of payload.nodes) {
    for (const c of n.children ?? []) if (pos.has(c)) edges.push({ from: n.id, to: c });
  }

  return (
    <div className="not-prose my-5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <svg
        width={Math.max(width, 1)}
        height={Math.max(height, 1)}
        viewBox={`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`}
        className="block"
        style={{ maxWidth: "100%", minWidth: Math.round(Math.max(width, 1) * MIN_LEGIBLE_SCALE), height: "auto" }}
      >
        {edges.map((e, i) => {
          const a = pos.get(e.from)!;
          const b = pos.get(e.to)!;
          const ag = geo.get(e.from)!;
          const bg = geo.get(e.to)!;
          return <line key={i} x1={a.x} y1={a.y + ag.h / 2} x2={b.x} y2={b.y - bg.h / 2} stroke={pal.edgeStroke} strokeWidth={1.5} />;
        })}
        {payload.nodes.map((n) => {
          const p = pos.get(n.id);
          if (!p) return null;
          const g = geo.get(n.id)!;
          const fill = n.highlight ? pal.accentFill : pal.cellFill;
          const stroke = n.highlight ? pal.accent : pal.gridStroke;
          const textFill = n.highlight ? pal.accent : pal.ink;
          const totalH = g.lines.length * LINE_H;
          return (
            <g key={n.id}>
              {g.circle ? (
                <circle cx={p.x} cy={p.y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth={n.highlight ? 1.6 : 1} />
              ) : (
                <rect
                  x={p.x - g.w / 2}
                  y={p.y - g.h / 2}
                  width={g.w}
                  height={g.h}
                  rx={14}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={n.highlight ? 1.6 : 1}
                />
              )}
              {g.circle ? (
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={FONT_SIZE} fontFamily="var(--font-jetmono), monospace" fill={textFill}>
                  {g.lines[0]}
                </text>
              ) : (
                g.lines.map((line, li) => (
                  <text
                    key={li}
                    x={p.x}
                    y={p.y - totalH / 2 + LINE_H * 0.8 + li * LINE_H}
                    textAnchor="middle"
                    fontSize={FONT_SIZE}
                    fontFamily="var(--font-jetmono), monospace"
                    fill={textFill}
                  >
                    {line}
                  </text>
                ))
              )}
            </g>
          );
        })}
      </svg>
      {payload.caption && <p className="mt-2 text-xs text-faint">{payload.caption}</p>}
    </div>
  );
}
