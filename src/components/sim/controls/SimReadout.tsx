"use client";

import { useVizPalette } from "@/lib/viz-theme";

export default function SimReadout({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  const p = useVizPalette(accent);

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
      style={{ backgroundColor: p.accentFill, color: p.ink }}
    >
      <span style={{ color: p.muted }}>{label}:</span>
      <span className="font-semibold" style={{ color: p.accent }}>
        {value}
      </span>
    </div>
  );
}
