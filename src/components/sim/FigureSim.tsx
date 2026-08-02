"use client";

import { useState, useEffect, useCallback, useId } from "react";
import type { FigureSpec, FigurePart, FigureLayer } from "@/lib/sim/types";
import { useVizPalette } from "@/lib/viz-theme";
import { useReadingTheme } from "@/context/ReadingThemeContext";
import { cartoonFor } from "@/lib/sim/shading";

/**
 * A textbook plate you can magnify.
 *
 * The whole specimen is drawn at once with leader-line labels around it — the
 * way the printed figure does it. Clicking any labelled part (or its chip)
 * MAGNIFIES the plate into that part: the drawing scales up and recentres on
 * it, the labels step out of the way, and everything else fades back so the
 * selected structure is the only thing in focus.
 *
 * How the magnification works: one CSS `transform` on one <g>. The scale comes
 * from the part's authored `focus` box, and the translate is clamped so the
 * plate always fills the frame instead of drifting off into empty space. The
 * outermost <svg> clips by default, so nothing spills.
 *
 * Linework uses `vector-effect="non-scaling-stroke"`, so ink lines keep a
 * constant screen weight whether the plate is magnified 3× or shrunk into the
 * sticky rail. That is what makes it read as a technical illustration rather
 * than a shape that got bigger.
 *
 * No WebGL, no new dependency (SCHOOL_BUILD_SPEC.md Rules 2 and 3).
 */

/** Breathing room around a focus box, as a fraction of its size. */
const FOCUS_PAD = 0.2;
const DEFAULT_MAX_ZOOM = 3.4;
/** How far back the unselected parts fade while something is magnified. */
const DIM = 0.16;
const DIM_BACKDROP = 0.42;

type Zoom = { k: number; tx: number; ty: number };

const IDENTITY: Zoom = { k: 1, tx: 0, ty: 0 };

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/** Scale + translate that brings `focus` to the centre of the plate. */
function zoomTo(
  focus: [number, number, number, number],
  w: number,
  h: number,
  maxZoom: number,
): Zoom {
  const [fx, fy, fw, fh] = focus;
  const bw = fw * (1 + FOCUS_PAD * 2);
  const bh = fh * (1 + FOCUS_PAD * 2);
  const k = clamp(Math.min(w / bw, h / bh), 1, maxZoom);
  const cx = fx + fw / 2;
  const cy = fy + fh / 2;
  // Keep the plate covering the frame: never pan past its own edges.
  const tx = clamp(w / 2 - k * cx, w - k * w, 0);
  const ty = clamp(h / 2 - k * cy, h - k * h, 0);
  return { k, tx, ty };
}

export default function FigureSim({
  spec,
  accent,
}: {
  spec: FigureSpec;
  accent: string;
}) {
  const p = useVizPalette(accent);
  const { isPaperMode } = useReadingTheme();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [w, h] = spec.viewBox;
  const maxZoom = spec.maxZoom ?? DEFAULT_MAX_ZOOM;

  const [selectedId, setSelectedId] = useState<string | null>(
    spec.defaultPartId ?? null,
  );

  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const on = () => setReduce(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  const reset = useCallback(() => setSelectedId(null), []);

  /* Esc backs out of the magnifier — the same gesture as closing a dialog. */
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, reset]);

  const selected = selectedId
    ? (spec.parts.find((pt) => pt.id === selectedId) ?? null)
    : null;

  const zoom = selected ? zoomTo(selected.focus, w, h, maxZoom) : IDENTITY;
  const magnified = zoom.k > 1.02;

  const ordered = spec.parts
    .map((part, i) => ({ part, order: part.depth ?? i }))
    .sort((a, b) => a.order - b.order);

  const ease = reduce ? undefined : "transform 520ms cubic-bezier(.22,.68,.24,1)";
  const fade = reduce ? undefined : "opacity 340ms ease";

  const clipId = (id: string) => `fig-${uid}-${id}`;

  return (
    <figure className="m-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold" style={{ color: p.accent }}>
          {spec.title}
        </h3>
        {!magnified && spec.parts.some((pt) => pt.labelAt) && (
          <span className="text-[0.68rem] tracking-wide" style={{ color: p.muted }}>
            tap a label to magnify
          </span>
        )}
      </div>

      <p className="sr-only">{spec.altText}</p>

      <div className="relative mt-2">
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            role="img"
            aria-label={spec.altText}
            style={{
              maxWidth: "100%",
              minWidth: Math.round(w * 0.72),
              height: "auto",
              display: "block",
              borderRadius: 18,
              background: p.panel,
            }}
          >
            <defs>
              {spec.parts.map((part) => (
                <clipPath key={part.id} id={clipId(part.id)}>
                  <path d={part.d} />
                </clipPath>
              ))}
            </defs>

            {/* Clicking bare plate backs out of the magnifier. */}
            <rect
              width={w}
              height={h}
              fill="transparent"
              onClick={reset}
              cursor={magnified ? "zoom-out" : "default"}
            />

            <g
              style={{
                transform: `translate(${zoom.tx.toFixed(2)}px, ${zoom.ty.toFixed(2)}px) scale(${zoom.k.toFixed(3)})`,
                transformOrigin: "0 0",
                transition: ease,
              }}
            >
              {spec.scenery?.map((layer, i) => {
                const c = layer.tint ? cartoonFor(layer.tint, isPaperMode) : null;
                return (
                  <Layer
                    key={`scenery-${i}`}
                    layer={layer}
                    ink={c?.ink ?? p.muted}
                    fill={c?.fill ?? p.gridStroke}
                    shade={c?.shade ?? p.gridStroke}
                    light={c?.light ?? p.cellFill}
                    panel={p.panel}
                  />
                );
              })}

              {ordered.map(({ part }) => {
                const isSelected = part.id === selectedId;
                const c = cartoonFor(part.tint ?? accent, isPaperMode);
                const opacity =
                  !selected || isSelected
                    ? 1
                    : part.backdrop
                      ? DIM_BACKDROP
                      : DIM;

                return (
                  <g key={part.id} opacity={opacity} style={{ transition: fade }}>
                    {/* 1 — flat body colour */}
                    <path
                      d={part.d}
                      fill={c.fill}
                      fillOpacity={part.backdrop ? 0.55 : 0.92}
                      onClick={() => setSelectedId(isSelected ? null : part.id)}
                      cursor="pointer"
                    />
                    {/* 2 — the same shape, nudged down-right and clipped to
                        itself, so a crescent of the darker tone gives the
                        form some roundness without a gradient */}
                    <g clipPath={`url(#${clipId(part.id)})`} pointerEvents="none">
                      <path
                        d={part.d}
                        fill={c.shade}
                        transform={`translate(${(w * 0.014).toFixed(1)} ${(h * 0.022).toFixed(1)})`}
                        opacity={part.backdrop ? 0.22 : 0.42}
                      />
                    </g>
                    {/* 3 — the detail: cristae, grana, pores, striations */}
                    {part.layers?.map((layer, i) => (
                      <Layer
                        key={i}
                        layer={layer}
                        ink={layer.tint ? cartoonFor(layer.tint, isPaperMode).ink : c.ink}
                        fill={layer.tint ? cartoonFor(layer.tint, isPaperMode).fill : c.fill}
                        shade={layer.tint ? cartoonFor(layer.tint, isPaperMode).shade : c.shade}
                        light={layer.tint ? cartoonFor(layer.tint, isPaperMode).light : c.light}
                        panel={p.panel}
                      />
                    ))}
                    {/* 4 — ink outline last, so no detail crosses the edge */}
                    <path
                      d={part.d}
                      fill="none"
                      stroke={isSelected ? p.accent : c.ink}
                      strokeWidth={isSelected ? 2.4 : 1.5}
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      onClick={() => setSelectedId(isSelected ? null : part.id)}
                      cursor="pointer"
                      style={reduce ? undefined : { transition: "stroke 300ms ease" }}
                    />
                  </g>
                );
              })}

              {spec.notes?.map((note, i) => (
                <text
                  key={`note-${i}`}
                  x={note.at[0]}
                  y={note.at[1]}
                  textAnchor={note.align ?? "middle"}
                  fontSize={note.size ?? 14}
                  fill={note.emphasis ? p.accent : p.muted}
                  stroke={p.panel}
                  strokeWidth={3}
                  paintOrder="stroke"
                  strokeLinejoin="round"
                  pointerEvents="none"
                >
                  {note.text}
                </text>
              ))}

              {/* Leader lines, labels and panel captions — the printed-figure
                  furniture. They step aside while the plate is magnified. */}
              <g
                opacity={magnified ? 0 : 1}
                pointerEvents={magnified ? "none" : undefined}
                style={{ transition: fade }}
              >
                {spec.panels?.map((panel) => (
                  <text
                    key={panel.id}
                    x={panel.box[0] + panel.box[2] / 2}
                    y={panel.box[1] + panel.box[3] + 20}
                    textAnchor="middle"
                    fontSize={15}
                    fontStyle="italic"
                    fill={p.muted}
                    pointerEvents="none"
                  >
                    {panel.caption}
                  </text>
                ))}

                {spec.parts.map((part) =>
                  part.labelAt ? (
                    <Label
                      key={part.id}
                      part={part}
                      w={w}
                      panel={p.panel}
                      ink={p.ink}
                      accent={p.accent}
                      edge={p.edgeStroke}
                      active={part.id === selectedId}
                      onSelect={() => setSelectedId(part.id)}
                    />
                  ) : null,
                )}
              </g>
            </g>
          </svg>
        </div>

        {magnified && (
          <button
            type="button"
            onClick={reset}
            className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: p.accentFill,
              color: p.accent,
              border: `1.5px solid ${p.accent}`,
              backdropFilter: "blur(4px)",
            }}
          >
            ⤢ Zoom out
          </button>
        )}
      </div>

      {/* Chips — the keyboard path into every part */}
      <div className="mt-3 flex flex-wrap gap-2">
        {spec.parts.map((part) => {
          const isSelected = part.id === selectedId;
          const c = cartoonFor(part.tint ?? accent, isPaperMode);
          return (
            <button
              key={part.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedId(isSelected ? null : part.id)}
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

      <div className="mt-3" aria-live="polite">
        {selected ? (
          <>
            <h4 className="text-sm font-semibold" style={{ color: p.accent }}>
              {selected.label}
            </h4>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: p.ink }}>
              {selected.blurb}
            </p>
          </>
        ) : (
          <figcaption className="text-xs leading-relaxed" style={{ color: p.muted }}>
            {spec.figNumber && (
              <span style={{ color: p.accent }}>{spec.figNumber}: </span>
            )}
            {spec.caption ?? spec.altText}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

/* ── one painted stroke or fill ─────────────────────────────────── */

function Layer({
  layer,
  ink,
  fill,
  shade,
  light,
  panel,
}: {
  layer: FigureLayer;
  ink: string;
  fill: string;
  shade: string;
  light: string;
  panel: string;
}) {
  const as = layer.as ?? "stroke";
  const solid =
    as === "fill" ? fill : as === "shade" ? shade : as === "panel" ? panel : light;
  return (
    <path
      d={layer.d}
      fill={as === "stroke" ? "none" : solid}
      stroke={as === "stroke" ? ink : "none"}
      strokeWidth={as === "stroke" ? (layer.width ?? 1.2) : undefined}
      vectorEffect={as === "stroke" ? "non-scaling-stroke" : undefined}
      strokeDasharray={layer.dash}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={layer.opacity ?? 1}
      pointerEvents="none"
    />
  );
}

/* ── leader line + label ────────────────────────────────────────── */

/** Greedy wrap so "Endoplasmic reticulum" fits the plate margin instead of
 *  running off the edge. Plates are authored with ~175 user units of margin,
 *  which is about this many characters at the label font size. */
const LABEL_CHARS = 15;

function wrapLabel(text: string): string[] {
  if (text.length <= LABEL_CHARS) return [text];
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (!line) line = word;
    else if (line.length + 1 + word.length <= LABEL_CHARS) line += " " + word;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function Label({
  part,
  w,
  panel,
  ink,
  accent,
  edge,
  active,
  onSelect,
}: {
  part: FigurePart;
  w: number;
  panel: string;
  ink: string;
  accent: string;
  edge: string;
  active: boolean;
  onSelect: () => void;
}) {
  const [lx, ly] = part.labelAt!;
  const [fx, fy, fw, fh] = part.focus;
  const [ax, ay] = part.leaderAt ?? [fx + fw / 2, fy + fh / 2];
  const align = part.labelAlign ?? (lx < w / 2 ? "end" : "start");
  // Stop the leader just short of the text so the line never runs under it.
  const gap = align === "end" ? -7 : align === "start" ? 7 : 0;
  const lines = wrapLabel(part.label);
  // Anchor the leader at the vertical middle of a wrapped label.
  const anchorY = ly - 4 + ((lines.length - 1) * 17) / 2;

  return (
    <g onClick={onSelect} cursor="zoom-in">
      <line
        x1={lx + gap}
        y1={anchorY}
        x2={ax}
        y2={ay}
        stroke={active ? accent : edge}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={ax} cy={ay} r={2.6} fill={active ? accent : edge} />
      {/* The paint-order stroke is a halo, so a label stays legible even
          where a leader line or the specimen passes behind it. */}
      <text
        x={lx}
        y={ly}
        textAnchor={align}
        fontSize={15}
        fill={active ? accent : ink}
        stroke={panel}
        strokeWidth={3.5}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {lines.map((line, i) => (
          <tspan key={i} x={lx} dy={i === 0 ? 0 : 17}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}
