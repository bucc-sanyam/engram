"use client";

import type { ComplexityVizPayload } from "./types";
import { useVizPalette } from "@/lib/viz-theme";

/**
 * Time/Space complexity comparison table — one row per approach, with the
 * interview-optimal row spotlighted. Gives every DSA question a consistent,
 * scannable "how fast / how much memory" summary without hand-formatting.
 */
export default function ComplexityViz({ payload, accent = "#f5b95f" }: { payload: ComplexityVizPayload; accent?: string }) {
  const pal = useVizPalette(accent);

  return (
    <div className="not-prose my-5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1.5">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-3 py-2 font-semibold text-faint">Approach</th>
            <th className="px-3 py-2 font-semibold text-faint">Time</th>
            <th className="px-3 py-2 font-semibold text-faint">Space</th>
            <th className="px-3 py-2 font-semibold text-faint">Trade-off</th>
          </tr>
        </thead>
        <tbody>
          {payload.rows.map((r, i) => (
            <tr
              key={i}
              className="border-t border-white/[0.06]"
              style={r.best ? { background: pal.accentFill } : undefined}
            >
              <td className="px-3 py-2.5 align-top font-medium" style={{ color: r.best ? pal.accent : pal.ink }}>
                {r.best && <span aria-hidden className="mr-1.5">★</span>}
                {r.approach}
              </td>
              <td className="px-3 py-2.5 align-top font-mono text-[0.85em]" style={{ color: r.best ? pal.accent : pal.ink }}>
                {r.time}
              </td>
              <td className="px-3 py-2.5 align-top font-mono text-[0.85em]" style={{ color: r.best ? pal.accent : pal.ink }}>
                {r.space}
              </td>
              <td className="px-3 py-2.5 align-top text-muted">{r.note ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {payload.caption && <p className="mt-1 px-3 pb-2 text-xs text-faint">{payload.caption}</p>}
    </div>
  );
}

