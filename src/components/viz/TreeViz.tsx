"use client";

import type { TreeVizPayload } from "./types";
import { useVizPalette } from "@/lib/viz-theme";

/** Simple tree/graph diagram — explicit node ids/children, BFS-level layout (no auto-layout engine). */
export default function TreeViz({ payload, accent = "#f5b95f" }: { payload: TreeVizPayload; accent?: string }) {
  const pal = useVizPalette(accent);
  const byId = new Map(payload.nodes.map((n) => [n.id, n]));
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

  const nodeR = 22;
  const rowH = 78;
  const colW = 76;
  const maxCols = Math.max(...levels.map((l) => l.length), 1);
  const width = maxCols * colW;
  const height = levels.length * rowH;

  const pos = new Map<string, { x: number; y: number }>();
  levels.forEach((level, depth) => {
    const rowWidth = level.length * colW;
    const offset = (width - rowWidth) / 2;
    level.forEach((id, idx) => {
      pos.set(id, { x: offset + idx * colW + colW / 2, y: depth * rowH + nodeR + 6 });
    });
  });

  const edges: { from: string; to: string }[] = [];
  for (const n of payload.nodes) {
    for (const c of n.children ?? []) if (pos.has(c)) edges.push({ from: n.id, to: c });
  }

  return (
    <div className="not-prose my-5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <svg width={Math.max(width, 1)} height={Math.max(height, 1)} viewBox={`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`} className="block">
        {edges.map((e, i) => {
          const a = pos.get(e.from)!;
          const b = pos.get(e.to)!;
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={pal.edgeStroke} strokeWidth={1.5} />;
        })}
        {payload.nodes.map((n) => {
          const p = pos.get(n.id);
          if (!p) return null;
          return (
            <g key={n.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={nodeR}
                fill={n.highlight ? pal.accentFill : pal.cellFill}
                stroke={n.highlight ? pal.accent : pal.gridStroke}
                strokeWidth={n.highlight ? 1.6 : 1}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize="13"
                fontFamily="var(--font-jetmono), monospace"
                fill={n.highlight ? pal.accent : pal.ink}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      {payload.caption && <p className="mt-2 text-xs text-faint">{payload.caption}</p>}
    </div>
  );
}
