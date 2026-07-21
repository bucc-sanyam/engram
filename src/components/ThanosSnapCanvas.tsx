"use client";

import { useEffect, useRef } from "react";

interface ThanosSnapCanvasProps {
  isActive: boolean;
  clickPos: { x: number; y: number } | null;
  mode: "to-paper" | "to-dark";
  onThemeFlip: () => void;
  onComplete: () => void;
}

// ---- timing (ms, wall-clock via performance.now) ----
const DURATION_MS = 1700; // total duration
const REVEAL_MS = 1050; // time for reveal circle to reach full radius
const FLIP_GUARD_MS = 80; // hold before hole starts
const PARTICLE_LIFE_MS = 600;
const SPAWN_STOP_RT = 0.9; // stop spawning once reveal is 90% done

// ---- reveal geometry ----
const FEATHER_PX = 90; // soft width of dissolving edge

// ---- particles ----
const SPAWN_PER_FRAME = 14;
const PARTICLE_MAX = 2200;
const SIZE_MIN = 0.8;
const SIZE_MAX = 2.6; // radius px
const SPEED_MIN = 0.02;
const SPEED_MAX = 0.09; // outward drift px/ms
const UP_DRIFT = 0.02; // upward bias px/ms
const SWAY_AMP = 0.5; // horizontal sine sway px
const ACCENT_RATIO = 0.4; // ~40% accent, ~60% neutral

// ---- rendering ----
const DPR_CAP = 2;
const SPRITE_PX = 24;

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// ---- color tokens ----
const DARK_BG = "#0b0a0e";
const PAPER_BG = "#eee8dd";

const DARK_NEUTRAL = ["#1a1721", "#2c2834", "#6d6875", "#a5a1ab"];
const DARK_ACCENT = ["#ff7a5c", "#f5b95f", "#43d6b5"];
const PAPER_NEUTRAL = ["#e4ddd0", "#d1c9b9", "#8a8174", "#3a342d"];
const PAPER_ACCENT = ["#cf4225", "#aa6f1e", "#187369"];

const SHIMMER_TO_PAPER = "rgba(245,185,95,0.55)";
const SHIMMER_TO_DARK = "rgba(170,111,30,0.5)";

function makeSprite(color: string): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = s.height = SPRITE_PX;
  const sctx = s.getContext("2d")!;
  const r = SPRITE_PX / 2;
  const grad = sctx.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, color);
  grad.addColorStop(1, "transparent");
  sctx.fillStyle = grad;
  sctx.beginPath();
  sctx.arc(r, r, r, 0, Math.PI * 2);
  sctx.fill();
  return s;
}

interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  born: number;
  sprite: HTMLCanvasElement;
  seed: number;
}

export default function ThanosSnapCanvas({
  isActive,
  clickPos,
  mode,
  onThemeFlip,
  onComplete,
}: ThanosSnapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flippedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      flippedRef.current = false;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const originX = clickPos ? clickPos.x : W / 2;
    const originY = clickPos ? clickPos.y : H / 2;
    const maxRadius =
      Math.hypot(Math.max(originX, W - originX), Math.max(originY, H - originY)) +
      FEATHER_PX;
    const toPaper = mode === "to-paper";
    const sheetColor = toPaper ? DARK_BG : PAPER_BG;

    const palette = toPaper
      ? { neutral: DARK_NEUTRAL, accent: DARK_ACCENT }
      : { neutral: PAPER_NEUTRAL, accent: PAPER_ACCENT };

    const spriteCache = new Map<string, HTMLCanvasElement>();
    const spriteFor = (c: string) => {
      let sp = spriteCache.get(c);
      if (!sp) {
        sp = makeSprite(c);
        spriteCache.set(c, sp);
      }
      return sp;
    };

    const inks: InkParticle[] = [];
    const start = performance.now();
    let lastTime = start;
    let animId: number;

    const render = (now: number) => {
      const t = now - start;
      const dt = now - lastTime;
      lastTime = now;

      // Flip DOM theme on frame 1 hidden underneath opaque sheet
      if (!flippedRef.current) {
        flippedRef.current = true;
        onThemeFlip();
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const rt = Math.min(1, Math.max(0, (t - FLIP_GUARD_MS) / REVEAL_MS));
      const radius = easeInOutCubic(rt) * maxRadius;

      // Layer 1: Opaque old-theme sheet over everything
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = sheetColor;
      ctx.fillRect(0, 0, W, H);

      // Layer 2: Erase soft-edged hole -> new theme shows through
      if (radius > 0) {
        ctx.globalCompositeOperation = "destination-out";
        const inner = Math.max(0, radius - FEATHER_PX);
        const g = ctx.createRadialGradient(originX, originY, inner, originX, originY, radius);
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(originX, originY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      // Layer 3a: Spawn & render glowing ink particles along the crumbling edge
      if (rt > 0 && rt < SPAWN_STOP_RT && inks.length < PARTICLE_MAX) {
        for (let k = 0; k < SPAWN_PER_FRAME; k++) {
          const a = Math.random() * Math.PI * 2;
          const rr = radius - Math.random() * FEATHER_PX;
          const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
          const pool = Math.random() < ACCENT_RATIO ? palette.accent : palette.neutral;
          const color = pool[(Math.random() * pool.length) | 0];
          inks.push({
            x: originX + Math.cos(a) * rr,
            y: originY + Math.sin(a) * rr,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed - UP_DRIFT,
            size: SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN),
            born: t,
            sprite: spriteFor(color),
            seed: Math.random() * 100,
          });
        }
      }

      let write = 0;
      for (let i = 0; i < inks.length; i++) {
        const p = inks[i];
        const age = t - p.born;
        if (age >= PARTICLE_LIFE_MS) continue;

        p.x += p.vx * dt + Math.sin(t * 0.004 + p.seed) * SWAY_AMP * (dt / 16.7);
        p.y += p.vy * dt;

        const lifeT = age / PARTICLE_LIFE_MS;
        ctx.globalAlpha = 1 - lifeT * lifeT;
        const sz = p.size * (1 - 0.35 * lifeT) * 3;
        ctx.drawImage(p.sprite, p.x - sz, p.y - sz, sz * 2, sz * 2);
        inks[write++] = p;
      }
      inks.length = write;
      ctx.globalAlpha = 1;

      // Layer 3b: Reveal edge shimmer ring
      if (rt > 0 && rt < 1) {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = toPaper ? SHIMMER_TO_PAPER : SHIMMER_TO_DARK;
        ctx.lineWidth = 2;
        ctx.shadowColor = ctx.strokeStyle as string;
        ctx.shadowBlur = 14;
        ctx.globalAlpha = 0.7 * (1 - rt);
        ctx.beginPath();
        ctx.arc(originX, originY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Check completion
      if (t >= DURATION_MS) {
        cancelAnimationFrame(animId);
        onComplete();
        return;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive, clickPos, mode, onThemeFlip, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
      style={{ isolation: "isolate" }}
    />
  );
}
