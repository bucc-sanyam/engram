"use client";

import { useState } from "react";
import type { ArrayVizPayload } from "./types";

/**
 * Array/pointer state diagram — one or more frames a reader can step through.
 * Covers most DSA two-pointer / sliding-window / array-state walkthroughs.
 */
export default function ArrayViz({ payload, accent = "#f5b95f" }: { payload: ArrayVizPayload; accent?: string }) {
  const [i, setI] = useState(0);
  const frame = payload.frames[Math.min(i, payload.frames.length - 1)];
  const cellSize = 44;
  const gap = 6;
  const width = frame.cells.length * (cellSize + gap) - gap;

  const pointersByIndex = new Map<number, string[]>();
  for (const p of frame.pointers ?? []) {
    const list = pointersByIndex.get(p.index) ?? [];
    list.push(p.label);
    pointersByIndex.set(p.index, list);
  }
  const highlighted = new Set(frame.highlight ?? []);

  return (
    <div className="not-prose my-5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <svg width={Math.max(width, 1)} height={92} viewBox={`0 0 ${Math.max(width, 1)} 92`} className="block">
        {frame.cells.map((cell, idx) => {
          const x = idx * (cellSize + gap);
          const isHi = highlighted.has(idx);
          return (
            <g key={idx}>
              <rect
                x={x}
                y={28}
                width={cellSize}
                height={cellSize}
                rx={10}
                fill={isHi ? `${accent}26` : "rgba(255,252,245,0.04)"}
                stroke={isHi ? accent : "rgba(255,252,245,0.14)"}
                strokeWidth={isHi ? 1.6 : 1}
              />
              <text
                x={x + cellSize / 2}
                y={28 + cellSize / 2 + 5}
                textAnchor="middle"
                fontSize="15"
                fontFamily="var(--font-jetmono), monospace"
                fill={isHi ? accent : "rgba(255,252,245,0.85)"}
              >
                {String(cell)}
              </text>
              {pointersByIndex.get(idx) && (
                <text x={x + cellSize / 2} y={20} textAnchor="middle" fontSize="10" fontWeight={700} fill={accent}>
                  {pointersByIndex.get(idx)!.join(" ")}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {frame.note && <p className="mt-1 text-sm text-muted">{frame.note}</p>}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-semibold text-muted transition-colors hover:text-white disabled:opacity-30"
        >
          ← Prev
        </button>
        <span className="micro !text-faint">
          step {i + 1} / {payload.frames.length}
        </span>
        <button
          type="button"
          onClick={() => setI((v) => Math.min(payload.frames.length - 1, v + 1))}
          disabled={i === payload.frames.length - 1}
          className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-semibold text-muted transition-colors hover:text-white disabled:opacity-30"
        >
          Next →
        </button>
      </div>
      {payload.caption && <p className="mt-2 text-xs text-faint">{payload.caption}</p>}
    </div>
  );
}
