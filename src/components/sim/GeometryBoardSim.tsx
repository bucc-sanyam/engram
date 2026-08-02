"use client";

import { useState, useCallback } from "react";
import type { GeometryBoardSpec } from "@/lib/sim/types";
import { useVizPalette } from "@/lib/viz-theme";
import SimReadout from "./controls/SimReadout";

export default function GeometryBoardSim({
  spec,
  accent,
}: {
  spec: GeometryBoardSpec;
  accent: string;
}) {
  const p = useVizPalette(accent);
  const [w, h] = spec.viewBox;
  const gs = spec.gridSize;

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const init: Record<string, { x: number; y: number }> = {};
    for (const v of spec.vertices) init[v.id] = { x: v.at[0], y: v.at[1] };
    return init;
  });

  const snap = (val: number) => Math.round(val / gs) * gs;
  const clampX = (val: number) => Math.max(0, Math.min(w, val));
  const clampY = (val: number) => Math.max(0, Math.min(h, val));

  const moveVertex = useCallback(
    (id: string, x: number, y: number) => {
      setPositions((prev) => ({
        ...prev,
        [id]: { x: clampX(snap(x)), y: clampY(snap(y)) },
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gs, w, h],
  );

  const handlePointerDown = useCallback(
    (id: string, e: React.PointerEvent<SVGCircleElement>) => {
      const vtx = spec.vertices.find((v) => v.id === id);
      if (vtx && vtx.draggable === false) return;

      const svg = (e.target as SVGElement).ownerSVGElement;
      if (!svg) return;

      (e.target as SVGCircleElement).setPointerCapture(e.pointerId);

      const onMove = (me: PointerEvent) => {
        const pt = svg.createSVGPoint();
        pt.x = me.clientX;
        pt.y = me.clientY;
        const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        moveVertex(id, svgPt.x, svgPt.y);
      };

      const onUp = () => {
        (e.target as SVGCircleElement).removeEventListener("pointermove", onMove);
        (e.target as SVGCircleElement).removeEventListener("pointerup", onUp);
      };

      (e.target as SVGCircleElement).addEventListener("pointermove", onMove);
      (e.target as SVGCircleElement).addEventListener("pointerup", onUp);
    },
    [spec.vertices, moveVertex],
  );

  const handleKeyDown = useCallback(
    (id: string, e: React.KeyboardEvent) => {
      const vtx = spec.vertices.find((v) => v.id === id);
      if (vtx && vtx.draggable === false) return;

      const pos = positions[id];
      if (!pos) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          moveVertex(id, pos.x, pos.y - gs);
          break;
        case "ArrowDown":
          e.preventDefault();
          moveVertex(id, pos.x, pos.y + gs);
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveVertex(id, pos.x - gs, pos.y);
          break;
        case "ArrowRight":
          e.preventDefault();
          moveVertex(id, pos.x + gs, pos.y);
          break;
      }
    },
    [positions, gs, moveVertex, spec.vertices],
  );

  // Build polygon points string
  const polyPoints = spec.polygon
    .map((id) => {
      const pos = positions[id];
      return pos ? `${pos.x},${pos.y}` : "";
    })
    .join(" ");

  // Compute readouts with try/catch
  const readoutValues = spec.readouts.map((r) => {
    try {
      return r.compute(positions);
    } catch {
      return "—";
    }
  });

  // Grid lines
  const gridLinesH: number[] = [];
  for (let y = 0; y <= h; y += gs) gridLinesH.push(y);
  const gridLinesV: number[] = [];
  for (let x = 0; x <= w; x += gs) gridLinesV.push(x);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: p.accent }}>
        {spec.title}
      </h3>
      <p className="sr-only">{spec.altText}</p>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={spec.altText}
          style={{
            maxWidth: "100%",
            minWidth: Math.round(w * 0.72),
            height: "auto",
          }}
        >
          {/* Grid */}
          {gridLinesH.map((y) => (
            <line
              key={`gh-${y}`}
              x1={0}
              x2={w}
              y1={y}
              y2={y}
              stroke={p.gridStroke}
              strokeWidth={0.5}
            />
          ))}
          {gridLinesV.map((x) => (
            <line
              key={`gv-${x}`}
              x1={x}
              x2={x}
              y1={0}
              y2={h}
              stroke={p.gridStroke}
              strokeWidth={0.5}
            />
          ))}

          {/* Polygon fill + stroke */}
          <polygon
            points={polyPoints}
            fill={p.accentFill}
            stroke={p.accent}
            strokeWidth={2}
            strokeLinejoin="round"
          />

          {/* Vertex handles */}
          {spec.vertices.map((vtx) => {
            const pos = positions[vtx.id];
            if (!pos) return null;
            const isDraggable = vtx.draggable !== false;
            return (
              <g key={vtx.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={9}
                  fill={p.accent}
                  stroke={p.panel}
                  strokeWidth={2}
                  cursor={isDraggable ? "grab" : "default"}
                  tabIndex={isDraggable ? 0 : undefined}
                  role={isDraggable ? "slider" : undefined}
                  aria-label={`${vtx.label} (${pos.x}, ${pos.y})`}
                  onPointerDown={
                    isDraggable
                      ? (e) => handlePointerDown(vtx.id, e)
                      : undefined
                  }
                  onKeyDown={
                    isDraggable
                      ? (e) => handleKeyDown(vtx.id, e)
                      : undefined
                  }
                />
                <text
                  x={pos.x}
                  y={pos.y - 14}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill={p.ink}
                >
                  {vtx.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Readouts */}
      <div className="mt-3 flex flex-wrap gap-2">
        {spec.readouts.map((r, i) => (
          <SimReadout
            key={i}
            label={r.label}
            value={readoutValues[i]}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}
