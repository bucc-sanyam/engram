"use client";

import { useVizPalette } from "@/lib/viz-theme";

export default function SimSlider({
  label,
  min,
  max,
  step,
  value,
  unit,
  accent,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  accent: string;
  onChange: (n: number) => void;
}) {
  const p = useVizPalette(accent);

  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium" style={{ color: p.muted }}>
        {label}:{" "}
        <span style={{ color: p.accent }}>
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: p.accent }}
      />
    </label>
  );
}
