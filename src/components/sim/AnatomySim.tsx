"use client";

import { useState, useEffect, useRef, useId } from "react";
import type { AnatomySpec, AnatomyPart } from "@/lib/sim/types";
import { useVizPalette } from "@/lib/viz-theme";
import { useReadingTheme } from "@/context/ReadingThemeContext";
import { cartoonFor } from "@/lib/sim/shading";

/**
 * Interactive labelled diagram.
 *
 * Each part is shaded from its own authored `tint` (see AnatomyPart) with a
 * top-left light source, a darker core and a rim, so organelles read as solid
 * objects rather than outlines. Selecting a part lifts it, scales it slightly
 * and drops a shadow beneath it; everything else dims back.
 *
 * The depth is SVG gradients plus one CSS 3-D tilt on the wrapper — no WebGL,
 * no three.js, no new dependencies (SCHOOL_BUILD_SPEC.md Rules 2 and 3).
 */

const TILT_MAX = 7; // degrees

export default function AnatomySim({
  spec,
  accent,
}: {
  spec: AnatomySpec;
  accent: string;
}) {
  const p = useVizPalette(accent);
  const { isPaperMode } = useReadingTheme();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [selectedId, setSelectedId] = useState(spec.defaultPartId);

  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const on = () => setReduce(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  /* Pointer tilt — only for real mice, never touch, never reduced-motion.
   * One transform on one element: GPU-composited and cheap. */
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<[number, number]>([0, 0]);
  const [canTilt, setCanTilt] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanTilt(m.matches);
    const on = () => setCanTilt(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  const tiltActive = canTilt && !reduce;
  const onTiltMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltActive) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setTilt([-ny * TILT_MAX * 2, nx * TILT_MAX * 2]);
  };
  const resetTilt = () => setTilt([0, 0]);

  const [w, h] = spec.viewBox;
  const selected = spec.parts.find((pt) => pt.id === selectedId) ?? spec.parts[0];

  const ordered = spec.parts
    .map((part, i) => ({ part, order: part.depth ?? i }))
    .sort((a, b) => a.order - b.order);

  const gradId = (id: string) => `an-${uid}-${id}`;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: p.accent }}>
        {spec.title}
      </h3>
      <p className="sr-only">{spec.altText}</p>

      <div className="overflow-x-auto">
        <div
          ref={stageRef}
          onPointerMove={onTiltMove}
          onPointerLeave={resetTilt}
          style={{ perspective: tiltActive ? "1100px" : undefined }}
        >
          <svg
            viewBox={`0 0 ${w} ${h}`}
            role="img"
            aria-label={spec.altText}
            style={{
              maxWidth: "100%",
              minWidth: Math.round(w * 0.72),
              height: "auto",
              display: "block",
              transform: tiltActive
                ? `rotateX(${tilt[0].toFixed(2)}deg) rotateY(${tilt[1].toFixed(2)}deg)`
                : undefined,
              transition: reduce ? undefined : "transform 260ms ease-out",
            }}
          >
            <defs>
              {/* One clip per part: the two-tone cartoon shading is an offset
                  copy of the same path, clipped to the shape. */}
              {spec.parts.map((part) => (
                <clipPath key={part.id} id={gradId(part.id)}>
                  <path d={part.path} transform={part.transform} />
                </clipPath>
              ))}
              <filter id={`lift-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="4"
                  floodColor={isPaperMode ? "rgba(40,32,20,0.4)" : "rgba(0,0,0,0.6)"}
                />
              </filter>
            </defs>

            {/* Non-interactive context: the arm, the stem, the bench. */}
            {spec.scenery?.map((s, i) => (
              <path
                key={`scenery-${i}`}
                d={s.path}
                // Solid enough to read as a body (a stem, an arm) rather than
                // a ghostly outline floating behind the parts.
                fill={s.outline ? "none" : p.gridStroke}
                stroke={p.muted}
                strokeWidth={s.outline ? 2.6 : 2.2}
                strokeLinejoin="round"
                strokeLinecap="round"
                pointerEvents="none"
              />
            ))}

            {ordered.map(({ part }) => {
              const isSelected = part.id === selectedId;
              const [dx, dy] = isSelected ? (part.liftBy ?? [0, 0]) : [0, 0];
              const c = cartoonFor(
                part.tint ?? accent,
                isPaperMode,
                !isSelected && !part.backdrop,
              );
              const scale = isSelected && !part.backdrop ? 1.05 : 1;

              return (
                <g
                  key={part.id}
                  transform={`translate(${dx} ${dy})`}
                  style={
                    reduce
                      ? undefined
                      : { transition: "transform 240ms cubic-bezier(.2,.7,.3,1)" }
                  }
                  filter={isSelected && !part.backdrop ? `url(#lift-${uid})` : undefined}
                  opacity={part.backdrop && !isSelected ? 0.9 : 1}
                >
                  <g
                    transform={part.transform}
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: "center",
                      transformBox: "fill-box",
                      transition: reduce
                        ? undefined
                        : "transform 240ms cubic-bezier(.2,.7,.3,1)",
                    }}
                  >
                    {/* 1 — flat body colour */}
                    <path
                      d={part.path}
                      fill={c.fill}
                      stroke="none"
                      onClick={() => setSelectedId(part.id)}
                      cursor="pointer"
                    />
                    {/* 2 — two-tone shading: the same shape, offset down-right
                        and clipped, so a crescent of the darker tone shows */}
                    <g clipPath={`url(#${gradId(part.id)})`} pointerEvents="none">
                      <path
                        d={part.path}
                        fill={c.shade}
                        transform="translate(9 11)"
                        opacity={part.backdrop ? 0.5 : 0.85}
                      />
                    </g>
                    {/* 3 — bold ink outline: what makes a flat shape read as
                        a drawing rather than a coloured blob */}
                    <path
                      d={part.path}
                      fill="none"
                      stroke={isSelected ? p.accent : c.ink}
                      strokeWidth={isSelected ? 4 : 2.8}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      onClick={() => setSelectedId(part.id)}
                      cursor="pointer"
                      style={
                        reduce
                          ? undefined
                          : { transition: "stroke 240ms ease, stroke-width 240ms ease" }
                      }
                    />
                    {part.detail && (
                      <path
                        d={part.detail}
                        fill={part.detailFill ? c.shade : "none"}
                        stroke={c.ink}
                        strokeWidth={part.detailFill ? 2.2 : 2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isSelected ? 1 : 0.75}
                        pointerEvents="none"
                      />
                    )}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Part buttons — the keyboard path */}
      <div className="mt-3 flex flex-wrap gap-2">
        {spec.parts.map((part) => {
          const isSelected = part.id === selectedId;
          const c = cartoonFor(part.tint ?? accent, isPaperMode);
          return (
            <button
              key={part.id}
              aria-pressed={isSelected}
              onClick={() => setSelectedId(part.id)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: isSelected ? p.accentFill : p.cellFill,
                color: isSelected ? p.accent : p.muted,
                border: `1.5px solid ${isSelected ? p.accent : p.gridStroke}`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: c.fill,
                  boxShadow: `0 0 0 1.5px ${c.ink}`,
                  flex: "none",
                }}
              />
              {part.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold" style={{ color: p.accent }}>
          {selected.label}
        </h4>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: p.ink }}>
          {selected.blurb}
        </p>
      </div>
    </div>
  );
}

export type { AnatomyPart };
