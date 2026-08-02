"use client";

import { useState } from "react";
import type { GraphPlotSpec } from "@/lib/sim/types";
import { useVizPalette } from "@/lib/viz-theme";
import SimSlider from "./controls/SimSlider";

const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
const SVG_W = 400;
const SVG_H = 300;
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

export default function GraphPlotSim({
  spec,
  accent,
}: {
  spec: GraphPlotSpec;
  accent: string;
}) {
  const p = useVizPalette(accent);
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const inp of spec.inputs) init[inp.id] = inp.default;
    return init;
  });

  const set = (id: string, n: number) =>
    setValues((prev) => ({ ...prev, [id]: n }));

  const [xMin, xMax] = spec.xRange;
  const [yMin, yMax] = spec.yRange;
  const xSpan = xMax - xMin;
  const ySpan = yMax - yMin;

  const toSvgX = (x: number) => PAD.left + ((x - xMin) / xSpan) * PLOT_W;
  const toSvgY = (y: number) => PAD.top + ((yMax - y) / ySpan) * PLOT_H;

  const tickInterval = (span: number) => (span <= 12 ? 1 : 5);
  const xTick = tickInterval(xSpan);
  const yTick = tickInterval(ySpan);

  const xTicks: number[] = [];
  for (let v = Math.ceil(xMin / xTick) * xTick; v <= xMax; v += xTick) xTicks.push(v);
  const yTicks: number[] = [];
  for (let v = Math.ceil(yMin / yTick) * yTick; v <= yMax; v += yTick) yTicks.push(v);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: p.accent }}>
        {spec.title}
      </h3>
      <p className="sr-only">{spec.altText}</p>

      {/* Sliders */}
      {spec.inputs.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {spec.inputs.map((inp) => (
            <SimSlider
              key={inp.id}
              label={inp.label}
              min={inp.min}
              max={inp.max}
              step={inp.step}
              value={values[inp.id]}
              unit={inp.unit}
              accent={accent}
              onChange={(n) => set(inp.id, n)}
            />
          ))}
        </div>
      )}

      {/* Plot */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          role="img"
          aria-label={spec.altText}
          style={{
            maxWidth: "100%",
            minWidth: Math.round(SVG_W * 0.72),
            height: "auto",
          }}
        >
          {/* Grid lines */}
          {xTicks.map((v) => (
            <line
              key={`gx-${v}`}
              x1={toSvgX(v)}
              x2={toSvgX(v)}
              y1={PAD.top}
              y2={PAD.top + PLOT_H}
              stroke={p.gridStroke}
              strokeWidth={0.5}
            />
          ))}
          {yTicks.map((v) => (
            <line
              key={`gy-${v}`}
              x1={PAD.left}
              x2={PAD.left + PLOT_W}
              y1={toSvgY(v)}
              y2={toSvgY(v)}
              stroke={p.gridStroke}
              strokeWidth={0.5}
            />
          ))}

          {/* Axes */}
          <line
            x1={PAD.left}
            x2={PAD.left + PLOT_W}
            y1={toSvgY(0)}
            y2={toSvgY(0)}
            stroke={p.edgeStroke}
            strokeWidth={1}
          />
          <line
            x1={toSvgX(0)}
            x2={toSvgX(0)}
            y1={PAD.top}
            y2={PAD.top + PLOT_H}
            stroke={p.edgeStroke}
            strokeWidth={1}
          />

          {/* Tick labels */}
          {xTicks.map((v) => (
            <text
              key={`tx-${v}`}
              x={toSvgX(v)}
              y={PAD.top + PLOT_H + 16}
              textAnchor="middle"
              fontSize={10}
              fill={p.muted}
            >
              {v}
            </text>
          ))}
          {yTicks.map((v) => (
            <text
              key={`ty-${v}`}
              x={PAD.left - 8}
              y={toSvgY(v) + 3}
              textAnchor="end"
              fontSize={10}
              fill={p.muted}
            >
              {v}
            </text>
          ))}

          {/* Axis labels */}
          <text
            x={PAD.left + PLOT_W / 2}
            y={SVG_H - 4}
            textAnchor="middle"
            fontSize={11}
            fill={p.muted}
          >
            {spec.xLabel}
          </text>
          <text
            x={12}
            y={PAD.top + PLOT_H / 2}
            textAnchor="middle"
            fontSize={11}
            fill={p.muted}
            transform={`rotate(-90, 12, ${PAD.top + PLOT_H / 2})`}
          >
            {spec.yLabel}
          </text>

          {/* Series */}
          {spec.series.map((s) => {
            const pts: string[] = [];
            const samples = 120;
            for (let i = 0; i <= samples; i++) {
              const x = xMin + (xSpan * i) / samples;
              const y = s.fn(x, values);
              if (!Number.isFinite(y)) continue;
              pts.push(`${toSvgX(x)},${toSvgY(y)}`);
            }
            return (
              <polyline
                key={s.id}
                points={pts.join(" ")}
                fill="none"
                stroke={p.accent}
                strokeWidth={2}
              />
            );
          })}

          {/* Fixed points */}
          {spec.points?.map((pt, i) => (
            <g key={`pt-${i}`}>
              <circle cx={toSvgX(pt.x)} cy={toSvgY(pt.y)} r={5} fill={p.accent} />
              <text
                x={toSvgX(pt.x) + 8}
                y={toSvgY(pt.y) - 8}
                fontSize={10}
                fill={p.ink}
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
