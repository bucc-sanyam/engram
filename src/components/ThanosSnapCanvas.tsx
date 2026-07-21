"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Paper-fold theme transition.
 *
 * The old design was a single soft-edged reveal circle sweeping the screen
 * (one big "wave"). This replaces it with a grid of small paper tiles that each
 * fold away in 3D — an accordion of little sheets radiating out from the click,
 * revealing the new theme underneath. Much more like "many small papers folding"
 * than a wave running across the screen.
 *
 * Same props/contract as before so `ReadingThemeContext` is unchanged: the DOM
 * theme is flipped once (hidden beneath the still-covering tiles) and
 * `onComplete` fires after the last tile has folded.
 */
interface ThanosSnapCanvasProps {
  isActive: boolean;
  clickPos: { x: number; y: number } | null;
  mode: "to-paper" | "to-dark";
  onThemeFlip: () => void;
  onComplete: () => void;
}

// ---- color tokens ----
const DARK_BG = "#0b0a0e";
const PAPER_BG = "#eee8dd";

// ---- paper-fold transition ----
const TILE_PX = 74; // target tile size — keeps ~300 tiles on a laptop screen
const FOLD_MS = 560; // per-tile fold duration
const MAX_STAGGER_MS = 620; // radial spread from the click origin
const JITTER_MS = 140; // organic per-tile randomness

interface Tile {
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
  dir: 1 | -1; // fold up or down (checkerboard so it doesn't read as one wave)
  rot: number; // small z-tilt for a hand-folded feel
}

export default function ThanosSnapCanvas({
  isActive,
  clickPos,
  mode,
  onThemeFlip,
  onComplete,
}: ThanosSnapCanvasProps) {
  const [tiles, setTiles] = useState<Tile[] | null>(null);
  const [folding, setFolding] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  // Keep the latest callbacks without re-running the setup effect (the theme
  // flip changes their identity mid-animation, which must NOT restart it).
  const flipRef = useRef(onThemeFlip);
  const doneRef = useRef(onComplete);
  flipRef.current = onThemeFlip;
  doneRef.current = onComplete;

  useEffect(() => {
    if (!isActive) {
      setTiles(null);
      setFolding(false);
      return;
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const cols = Math.max(1, Math.round(W / TILE_PX));
    const rows = Math.max(1, Math.round(H / TILE_PX));
    const tw = W / cols;
    const th = H / rows;
    const ox = clickPos?.x ?? W / 2;
    const oy = clickPos?.y ?? H / 2;
    const maxD = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy)) || 1;

    const arr: Tile[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * tw + tw / 2;
        const cy = r * th + th / 2;
        const d = Math.hypot(cx - ox, cy - oy) / maxD;
        arr.push({
          x: c * tw,
          y: r * th,
          w: tw + 1, // +1 hides sub-pixel seams while still covering
          h: th + 1,
          delay: d * MAX_STAGGER_MS + Math.random() * JITTER_MS,
          dir: (r + c) % 2 === 0 ? 1 : -1,
          rot: (Math.random() - 0.5) * 7,
        });
      }
    }

    setOrigin({ x: ox, y: oy });
    setTiles(arr);
    setFolding(false);

    // Two rAFs so the covered (un-folded) state paints before we flip the DOM
    // theme underneath and kick off the CSS fold transition.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        flipRef.current();
        setFolding(true);
      });
    });

    const maxDelay = arr.reduce((m, t) => Math.max(m, t.delay), 0);
    const timer = window.setTimeout(() => doneRef.current(), maxDelay + FOLD_MS + 140);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
  }, [isActive, clickPos, mode]);

  if (!isActive || !tiles) return null;

  const toPaper = mode === "to-paper";
  // Tiles show the OLD theme's page colour while they still cover the screen.
  const sheet = toPaper ? DARK_BG : PAPER_BG;
  const sheenTop = toPaper ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)";
  const sheenBot = toPaper ? "rgba(0,0,0,0.4)" : "rgba(120,102,74,0.22)";
  const edge = toPaper ? "rgba(255,255,255,0.05)" : "rgba(120,102,74,0.16)";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      style={{
        perspective: "1200px",
        perspectiveOrigin: `${origin.x}px ${origin.y}px`,
        isolation: "isolate",
      }}
    >
      {tiles.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            width: t.w,
            height: t.h,
            backgroundColor: sheet,
            backgroundImage: `linear-gradient(155deg, ${sheenTop}, transparent 55%, ${sheenBot})`,
            boxShadow: `inset 0 0 0 0.5px ${edge}`,
            transformOrigin: t.dir === 1 ? "center top" : "center bottom",
            transform: folding
              ? `rotateX(${t.dir * -92}deg) rotateZ(${t.rot}deg) translateZ(0)`
              : "rotateX(0deg)",
            opacity: folding ? 0 : 1,
            transition: `transform ${FOLD_MS}ms cubic-bezier(0.62,0.02,0.34,1) ${t.delay}ms, opacity ${FOLD_MS}ms ease ${t.delay + FOLD_MS * 0.4}ms`,
            backfaceVisibility: "hidden",
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
