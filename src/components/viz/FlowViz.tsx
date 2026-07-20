import type { FlowVizPayload } from "./types";

/** Labeled nodes + directed edges on an explicit row/col grid — for Macroeconomics concept/flow diagrams. */
export default function FlowViz({ payload, accent = "#a3e635" }: { payload: FlowVizPayload; accent?: string }) {
  const colW = 160;
  const rowH = 96;
  const boxW = 132;
  const boxH = 48;

  const maxRow = Math.max(...payload.nodes.map((n) => n.row), 0);
  const maxCol = Math.max(...payload.nodes.map((n) => n.col), 0);
  const width = (maxCol + 1) * colW;
  const height = (maxRow + 1) * rowH;

  const center = (n: { row: number; col: number }) => ({
    x: n.col * colW + colW / 2,
    y: n.row * rowH + rowH / 2,
  });
  const byId = new Map(payload.nodes.map((n) => [n.id, n]));

  return (
    <div className="not-prose my-5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <svg width={Math.max(width, 1)} height={Math.max(height, 1)} viewBox={`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`} className="block">
        <defs>
          <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={accent} />
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
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={accent} strokeWidth={1.5} opacity={0.65} markerEnd="url(#flow-arrow)" />
              {e.label && (
                <text x={midX} y={midY - 6} textAnchor="middle" fontSize="10.5" fill="rgba(255,252,245,0.65)">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {payload.nodes.map((n) => {
          const c = center(n);
          return (
            <g key={n.id}>
              <rect
                x={c.x - boxW / 2}
                y={c.y - boxH / 2}
                width={boxW}
                height={boxH}
                rx={14}
                fill="rgba(255,252,245,0.04)"
                stroke={accent}
                strokeWidth={1.2}
              />
              <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize="12.5" fontWeight={600} fill="rgba(255,252,245,0.9)">
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
