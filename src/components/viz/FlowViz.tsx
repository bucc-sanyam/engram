"use client";

import type { FlowVizPayload } from "./types";
import { useVizPalette } from "@/lib/viz-theme";

/**
 * Labeled nodes + directed edges on an explicit row/col grid.
 *
 * Dynamically sizes each box based on label length so text is never clipped.
 * Long labels are split across multiple lines within the box.
 */

/** Approximate text width at fontSize 12.5 with fontWeight 600 (~7.2px/char). */
const CHAR_W = 7.2;
const FONT_SIZE = 12.5;
const PAD_X = 28; // horizontal padding inside box (14 each side)
const PAD_Y = 24; // vertical padding inside box
const LINE_H = 17; // line-height for wrapped text
const GAP_X = 28; // horizontal gap between columns
const GAP_Y = 48; // vertical gap between rows (extra room for edge labels)
const MAX_LINE_CHARS = 28; // wrap labels longer than this
// Diagrams shrink to fit their column, but never below this fraction of natural
// size — past it they scroll horizontally instead of squashing into an illegible
// smear (see the shared `overflow-x-auto` wrapper). Keeps text ≥ ~9px.
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

export default function FlowViz({ payload, accent = "#a3e635" }: { payload: FlowVizPayload; accent?: string }) {
  const pal = useVizPalette(accent);

  // Pre-compute per-node dimensions based on label text
  const nodeInfo = new Map<
    string,
    { lines: string[]; boxW: number; boxH: number; row: number; col: number; label: string }
  >();
  for (const n of payload.nodes) {
    const lines = wrapLabel(n.label, MAX_LINE_CHARS);
    const longestLine = Math.max(...lines.map((l) => l.length));
    const boxW = Math.max(longestLine * CHAR_W + PAD_X, 80); // min 80px
    const boxH = Math.max(lines.length * LINE_H + PAD_Y, 48);
    nodeInfo.set(n.id, { lines, boxW, boxH, row: n.row, col: n.col, label: n.label });
  }

  // Compute column widths (widest box in each column + gap)
  const maxCol = Math.max(...payload.nodes.map((n) => n.col), 0);
  const maxRow = Math.max(...payload.nodes.map((n) => n.row), 0);

  const colWidths: number[] = [];
  for (let c = 0; c <= maxCol; c++) {
    let maxW = 80;
    for (const info of nodeInfo.values()) {
      if (info.col === c) maxW = Math.max(maxW, info.boxW);
    }
    colWidths.push(maxW);
  }

  // Compute row heights (tallest box in each row + gap)
  const rowHeights: number[] = [];
  for (let r = 0; r <= maxRow; r++) {
    let maxH = 48;
    for (const info of nodeInfo.values()) {
      if (info.row === r) maxH = Math.max(maxH, info.boxH);
    }
    rowHeights.push(maxH);
  }

  // Compute cumulative X / Y positions for each column/row center
  const colCenters: number[] = [];
  let xAcc = 0;
  for (let c = 0; c <= maxCol; c++) {
    colCenters.push(xAcc + colWidths[c] / 2);
    xAcc += colWidths[c] + GAP_X;
  }

  const rowCenters: number[] = [];
  let yAcc = 0;
  for (let r = 0; r <= maxRow; r++) {
    rowCenters.push(yAcc + rowHeights[r] / 2);
    yAcc += rowHeights[r] + GAP_Y;
  }

  const svgW = xAcc - GAP_X; // remove trailing gap
  const svgH = yAcc - GAP_Y;

  const center = (n: { row: number; col: number }) => ({
    x: colCenters[n.col],
    y: rowCenters[n.row],
  });

  const byId = new Map(payload.nodes.map((n) => [n.id, n]));

  return (
    <div className="not-prose my-5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <svg
        width={Math.max(svgW, 1)}
        height={Math.max(svgH, 1)}
        viewBox={`0 0 ${Math.max(svgW, 1)} ${Math.max(svgH, 1)}`}
        className="block"
        style={{ maxWidth: "100%", minWidth: Math.round(Math.max(svgW, 1) * MIN_LEGIBLE_SCALE), height: "auto" }}
      >
        <defs>
          <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={pal.accent} />
          </marker>
        </defs>
        {payload.edges.map((e, i) => {
          const from = byId.get(e.from);
          const to = byId.get(e.to);
          if (!from || !to) return null;
          const a = center(from);
          const b = center(to);
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={pal.accent} strokeWidth={1.5} opacity={0.65} markerEnd="url(#flow-arrow)" />
              {e.label && (
                <text x={midX} y={midY - 6} textAnchor="middle" fontSize="10.5" fill={pal.muted}>
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {payload.nodes.map((n) => {
          const c = center(n);
          const info = nodeInfo.get(n.id)!;
          return (
            <g key={n.id}>
              <rect
                x={c.x - info.boxW / 2}
                y={c.y - info.boxH / 2}
                width={info.boxW}
                height={info.boxH}
                rx={14}
                fill={pal.cellFill}
                stroke={pal.accent}
                strokeWidth={1.2}
              />
              {info.lines.map((line, li) => {
                const totalH = info.lines.length * LINE_H;
                const lineY = c.y - totalH / 2 + LINE_H * 0.7 + li * LINE_H;
                return (
                  <text
                    key={li}
                    x={c.x}
                    y={lineY}
                    textAnchor="middle"
                    fontSize={FONT_SIZE}
                    fontWeight={600}
                    fill={pal.ink}
                  >
                    {line}
                  </text>
                );
              })}
            </g>
          );
        })}
      </svg>
      {payload.caption && <p className="mt-2 text-xs text-faint">{payload.caption}</p>}
    </div>
  );
}
