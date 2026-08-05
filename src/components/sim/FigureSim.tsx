"use client";

import { useState, useEffect, useCallback, useId } from "react";
import type { FigureSpec, FigurePart, FigureLayer } from "@/lib/sim/types";
import { useVizPalette } from "@/lib/viz-theme";
import { useReadingTheme } from "@/context/ReadingThemeContext";
import { cartoonFor } from "@/lib/sim/shading";
import { liftSubset, layerSubset } from "@/lib/sim/draw";

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
/** In `magnify: "part"` mode the plate stays on screen as context, so the
 *  unselected parts must stay readable rather than disappear. */
const PART_DIM = 0.3;
const PART_DIM_BACKDROP = 0.62;
/** How large a lifted part grows, as a fraction of the plate's short side,
 *  and the bounds that keeps a whole-cell backdrop from swallowing the frame. */
const LIFT_TARGET = 0.3;
const LIFT_MIN = 1.35;
const LIFT_MAX = 2.8;
/** How far a lifted part drifts toward the middle of the plate, so an
 *  organelle in the corner does not enlarge straight off the edge. */
const LIFT_RECENTRE = 0.35;

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

/**
 * The `magnify: "part"` transform: grow the part about its own centre and
 * drift it toward the middle of the plate.
 *
 * Scale comes from the part's authored `focus` box rather than a measured
 * bounding box, for the same reason the camera zoom does — a part made of four
 * scattered chloroplasts should enlarge like one chloroplast, not like the
 * rectangle that spans all four.
 */
function liftTransform(part: FigurePart, w: number, h: number): string {
  const [fx, fy, fw, fh] = part.focus;
  const cx = fx + fw / 2;
  const cy = fy + fh / 2;
  // The cytoplasm and the cell wall ARE the plate. Scaling them just pushes
  // the specimen off its own edges, so a backdrop only lights up.
  const k = part.backdrop
    ? 1
    : clamp((Math.min(w, h) * LIFT_TARGET) / Math.max(fw, fh), LIFT_MIN, LIFT_MAX);
  const dx = (w / 2 - cx) * LIFT_RECENTRE * (part.backdrop ? 0 : 1);
  const dy = (h / 2 - cy) * LIFT_RECENTRE * (part.backdrop ? 0 : 1);
  return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) scale(${k.toFixed(3)}) translate(${(-cx).toFixed(1)}px, ${(-cy).toFixed(1)}px)`;
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
  const mode = spec.magnify ?? "camera";

  const zoom =
    selected && mode === "camera" ? zoomTo(selected.focus, w, h, maxZoom) : IDENTITY;
  const magnified = mode === "part" ? !!selected : zoom.k > 1.02;

  const ordered = spec.parts
    .map((part, i) => ({ part, order: part.depth ?? i }))
    // A lifted part has to paint over its neighbours, or it grows *underneath*
    // the organelles drawn after it and reads as a clipping bug.
    .sort((a, b) =>
      mode === "part" && a.part.id === selectedId
        ? 1
        : mode === "part" && b.part.id === selectedId
          ? -1
          : a.order - b.order,
    );

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
            {mode === "part" ? "tap a part to lift it out" : "tap a label to magnify"}
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
                const dim = mode === "part" ? PART_DIM : DIM;
                const dimBackdrop =
                  mode === "part" ? PART_DIM_BACKDROP : DIM_BACKDROP;
                const opacity =
                  !selected || isSelected
                    ? 1
                    : part.backdrop
                      ? dimBackdrop
                      : dim;
                const lifted = mode === "part" && isSelected && !part.backdrop;
                // Which copy of a multi-copy part travels: the one its focus box
                // was authored around. `null` when the part is a single shape,
                // which lifts whole and untouched.
                const subset = lifted ? liftSubset(part.d, part.focus) : null;
                const body = subset?.d ?? part.d;

                return (
                  <g key={part.id}>
                  {/* The part left behind. Lifting only one organelle would
                      otherwise delete the other three chloroplasts from the
                      cell; this keeps the specimen whole and shows where the
                      lifted one came from. */}
                  {subset && (
                    <g opacity={dim} pointerEvents="none">
                      <path d={part.d} fill={c.fill} fillOpacity={0.92} />
                      <path
                        d={part.d}
                        fill="none"
                        stroke={c.ink}
                        strokeWidth={1.5}
                        vectorEffect="non-scaling-stroke"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}
                  <g
                    opacity={opacity}
                    style={{
                      transition: reduce
                        ? undefined
                        : "opacity 340ms ease, transform 520ms cubic-bezier(.22,.68,.24,1)",
                      transform:
                        mode === "part" && isSelected
                          ? liftTransform(part, w, h)
                          : undefined,
                      transformOrigin: "0 0",
                    }}
                  >
                    {/* 0 — a cast shadow, so a lifted part reads as being in
                        front of the cell rather than merely bigger */}
                    {lifted && (
                      <path
                        d={body}
                        fill="rgba(12,8,20,0.3)"
                        transform={`translate(${(w * 0.008).toFixed(1)} ${(h * 0.022).toFixed(1)})`}
                        pointerEvents="none"
                      />
                    )}
                    {/* 1 — flat body colour */}
                    <path
                      d={body}
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
                        d={body}
                        fill={c.shade}
                        transform={`translate(${(w * 0.014).toFixed(1)} ${(h * 0.022).toFixed(1)})`}
                        opacity={part.backdrop ? 0.22 : 0.42}
                      />
                    </g>
                    {/* 3 — the detail: cristae, grana, pores, striations. A
                        lifted copy takes only its own detail with it. */}
                    {part.layers?.map((layer, i) => {
                      const painted = (
                        <Layer
                          layer={
                            subset ? { ...layer, d: layerSubset(layer.d, subset.box) } : layer
                          }
                          ink={layer.tint ? cartoonFor(layer.tint, isPaperMode).ink : c.ink}
                          fill={layer.tint ? cartoonFor(layer.tint, isPaperMode).fill : c.fill}
                          shade={layer.tint ? cartoonFor(layer.tint, isPaperMode).shade : c.shade}
                          light={layer.tint ? cartoonFor(layer.tint, isPaperMode).light : c.light}
                          panel={p.panel}
                        />
                      );
                      // Interior texture is clipped to the silhouette it fills,
                      // or a rectangular grid gives an organic shape corners.
                      return layer.clip ? (
                        <g key={i} clipPath={`url(#${clipId(part.id)})`}>
                          {painted}
                        </g>
                      ) : (
                        <g key={i}>{painted}</g>
                      );
                    })}
                    {/* 4 — ink outline last, so no detail crosses the edge */}
                    <path
                      d={body}
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
              {/* In "part" mode the plate never moves, so the labels stay put
                  and keep naming the rest of the cell. Only the lifted part's
                  own label goes — its leader would be pointing at the hole it
                  just left. */}
              <g
                opacity={mode === "camera" && magnified ? 0 : 1}
                pointerEvents={mode === "camera" && magnified ? "none" : undefined}
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
                    <g
                      key={part.id}
                      opacity={
                        mode === "part" && part.id === selectedId && !part.backdrop
                          ? 0
                          : 1
                      }
                      style={{ transition: fade }}
                    >
                      <Label
                        part={part}
                        w={w}
                        panel={p.panel}
                        ink={p.ink}
                        accent={p.accent}
                        edge={p.edgeStroke}
                        active={part.id === selectedId}
                        onSelect={() => setSelectedId(part.id)}
                      />
                    </g>
                  ) : null,
                )}
              </g>

              {/* The lifted part's own tag, which travels with it. Its printed
                  label is hidden above (the leader would point at the hole it
                  left), so without this the enlarged organelle is unnamed on
                  the plate itself. */}
              {mode === "part" && selected && !selected.backdrop && (
                <PartTag
                  part={selected}
                  w={w}
                  h={h}
                  accent={p.accent}
                  panel={p.panel}
                  fade={fade}
                />
              )}
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
            {mode === "part" ? "↩ Put it back" : "⤢ Zoom out"}
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

/* ── the tag that rides a lifted part ───────────────────────────── */

/** Roughly how wide a character is at `TAG_FONT`. SVG cannot measure text
 *  before layout and the tag has to be centred on the part it names, so the
 *  width is estimated from the character count — same trick as `wrapLabel`. */
const TAG_CHAR_W = 7.6;
const TAG_FONT = 14;
const TAG_H = 26;
/** Clearance between the enlarged part and its tag. */
const TAG_GAP = 12;

/**
 * A pill naming the part that is currently lifted, placed against its ENLARGED
 * silhouette rather than its authored `labelAt` — which is where the part used
 * to be, not where it now is.
 *
 * The geometry has to mirror `liftTransform` exactly. It is recomputed here
 * rather than shared because the transform returns a CSS string; the numbers it
 * is built from are cheap to derive again and impossible to read back out.
 */
function PartTag({
  part,
  w,
  h,
  accent,
  panel,
  fade,
}: {
  part: FigurePart;
  w: number;
  h: number;
  accent: string;
  panel: string;
  fade?: string;
}) {
  const [fx, fy, fw, fh] = part.focus;
  const cx = fx + fw / 2;
  const cy = fy + fh / 2;
  const k = clamp(
    (Math.min(w, h) * LIFT_TARGET) / Math.max(fw, fh),
    LIFT_MIN,
    LIFT_MAX,
  );
  // Where the part ends up: scaled about its own centre, then nudged inward.
  const lcx = cx + (w / 2 - cx) * LIFT_RECENTRE;
  const lcy = cy + (h / 2 - cy) * LIFT_RECENTRE;
  const halfH = (fh / 2) * k;

  const tw = part.label.length * TAG_CHAR_W + 26;
  // Prefer sitting above the part; flip underneath when that would leave the
  // plate, which is what happens to anything near the top edge.
  const halfW = (fw / 2) * k;
  // A part that fills most of the plate's height has no room above or below —
  // and "below" on a panelled plate lands squarely on the panel captions. Tag
  // those to the side instead, where a tall part leaves the most space.
  const tall = halfH * 2 > h * 0.55;
  const above = lcy - halfH - TAG_GAP - TAG_H;

  const ty = clamp(
    tall ? lcy - TAG_H / 2 : above < 4 ? lcy + halfH + TAG_GAP : above,
    4,
    Math.max(4, h - TAG_H - 4),
  );
  const tx = clamp(
    tall
      ? lcx < w / 2
        ? lcx + halfW + TAG_GAP
        : lcx - halfW - TAG_GAP - tw
      : lcx - tw / 2,
    4,
    Math.max(4, w - tw - 4),
  );

  return (
    <g pointerEvents="none" style={{ transition: fade }}>
      <rect
        x={tx}
        y={ty}
        width={tw}
        height={TAG_H}
        rx={TAG_H / 2}
        fill={panel}
        stroke={accent}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={tx + tw / 2}
        y={ty + TAG_H / 2 + TAG_FONT * 0.36}
        textAnchor="middle"
        fontSize={TAG_FONT}
        fontWeight={600}
        fill={accent}
      >
        {part.label}
      </text>
    </g>
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
