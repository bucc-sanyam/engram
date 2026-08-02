"use client";

import { useVizPalette } from "@/lib/viz-theme";

export default function SimFallback({
  altText,
  title,
  accent,
}: {
  altText: string;
  title: string;
  accent: string;
}) {
  const p = useVizPalette(accent);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        border: `1.5px solid ${p.gridStroke}`,
        backgroundColor: p.panel,
      }}
    >
      <h3 className="mb-2 text-sm font-semibold" style={{ color: p.accent }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: p.ink }}>
        {altText}
      </p>
    </div>
  );
}
