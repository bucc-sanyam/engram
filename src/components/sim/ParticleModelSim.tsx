"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ParticleModelSpec } from "@/lib/sim/types";
import { useVizPalette } from "@/lib/viz-theme";
import { useReadingTheme } from "@/context/ReadingThemeContext";
import { shadesFor } from "@/lib/sim/shading";

/** Deterministic pseudo-random: stable across renders, no Math.random(). */
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x); // 0..1
};

const CANVAS_CSS_W = 320;
const CANVAS_CSS_H = 240;

export default function ParticleModelSim({
  spec,
  accent,
}: {
  spec: ParticleModelSpec;
  accent: string;
}) {
  const p = useVizPalette(accent);
  const { isPaperMode } = useReadingTheme();
  const [stateId, setStateId] = useState(spec.defaultStateId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const on = () => setReduce(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  const activeState = spec.states.find((s) => s.id === stateId) ?? spec.states[0];

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Border
      ctx.strokeStyle = p.gridStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);

      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.min(w, h) * 0.42;

      // Species lookup: deterministic assignment by particle index, weighted
      // by each species' share. One entry = a uniform field (pure substance);
      // several = visibly different particles (a mixture).
      const species = activeState.species?.length
        ? activeState.species
        : [{ size: activeState.particleSize, color: accent, share: 1 }];
      const totalShare = species.reduce((n, s) => n + s.share, 0) || 1;
      const speciesFor = (i: number) => {
        // Golden-ratio low-discrepancy sequence rather than the sine hash:
        // it spreads the species evenly, so 5:2:2 actually renders ~17/7/7
        // instead of clumping to 22/4/4 and hiding the minority particles.
        let roll = ((i * 0.6180339887498949) % 1) * totalShare;
        for (const s of species) {
          roll -= s.share;
          if (roll <= 0) return s;
        }
        return species[species.length - 1];
      };

      for (let i = 0; i < spec.count; i++) {
        const baseAngle = rnd(i, 0) * Math.PI * 2;
        const baseDist = rnd(i, 1) * maxRadius * activeState.spread;

        // Energy-driven oscillation (deterministic, based on index + time)
        const wobbleX =
          activeState.energy * 8 * Math.sin(t * 0.003 * (1 + rnd(i, 2)) + baseAngle);
        const wobbleY =
          activeState.energy * 8 * Math.cos(t * 0.003 * (1 + rnd(i, 3)) + baseAngle * 1.3);

        const px = cx + Math.cos(baseAngle) * baseDist + wobbleX;
        const py = cy + Math.sin(baseAngle) * baseDist + wobbleY;

        const kind = speciesFor(i);
        const r = kind.size;
        const shadeSet = shadesFor(kind.color, isPaperMode);

        // Contact shadow — grounds the particle instead of leaving it floating.
        ctx.beginPath();
        ctx.ellipse(px, py + r * 0.85, r * 0.85, r * 0.32, 0, 0, Math.PI * 2);
        ctx.fillStyle = shadeSet.contact;
        ctx.fill();

        // Sphere body: light from the top-left, dark at the lower-right edge.
        const grad = ctx.createRadialGradient(
          px - r * 0.36,
          py - r * 0.4,
          Math.max(r * 0.12, 0.5),
          px,
          py,
          r * 1.08,
        );
        grad.addColorStop(0, shadeSet.highlight);
        grad.addColorStop(0.52, shadeSet.body);
        grad.addColorStop(1, shadeSet.shadow);

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = shadeSet.rim;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Specular dot — only worth drawing once the particle is big enough.
        if (r >= 4) {
          ctx.beginPath();
          ctx.ellipse(
            px - r * 0.34,
            py - r * 0.38,
            r * 0.26,
            r * 0.19,
            -0.6,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = shadeSet.gloss;
          ctx.fill();
        }
      }
    },
    [spec.count, activeState, p, accent, isPaperMode],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_CSS_W * dpr;
    canvas.height = CANVAS_CSS_H * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Reduced-motion: single static frame, no loop
    if (reduce) {
      draw(ctx, CANVAS_CSS_W, CANVAS_CSS_H, 0);
      return;
    }

    // Gate animation on visibility (IntersectionObserver + document visibility)
    let raf = 0;
    let isIntersecting = false;
    let isDocVisible = document.visibilityState === "visible";

    const startLoop = () => {
      if (raf) return; // already running
      const loop = (t: number) => {
        draw(ctx, CANVAS_CSS_W, CANVAS_CSS_H, t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const syncLoop = () => {
      if (isIntersecting && isDocVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        syncLoop();
      },
      { threshold: 0 },
    );
    io.observe(wrapper);

    const onVisChange = () => {
      isDocVisible = document.visibilityState === "visible";
      syncLoop();
    };
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      stopLoop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [draw, reduce]);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: p.accent }}>
        {spec.title}
      </h3>
      <p className="sr-only">{spec.altText}</p>

      <div className="overflow-x-auto" ref={wrapperRef}>
        <canvas
          ref={canvasRef}
          style={{
            width: CANVAS_CSS_W,
            height: CANVAS_CSS_H,
            maxWidth: "100%",
            minWidth: Math.round(CANVAS_CSS_W * 0.72),
          }}
        />
      </div>

      {/* State buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {spec.states.map((s) => {
          const isActive = s.id === stateId;
          return (
            <button
              key={s.id}
              aria-pressed={isActive}
              onClick={() => setStateId(s.id)}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: isActive ? p.accentFill : p.cellFill,
                color: isActive ? p.accent : p.muted,
                border: `1.5px solid ${isActive ? p.accent : p.gridStroke}`,
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Blurb */}
      <p className="mt-3 text-sm leading-relaxed" style={{ color: p.ink }}>
        {activeState.blurb}
      </p>
    </div>
  );
}
