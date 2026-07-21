"use client";

import { useEffect, useRef } from "react";

/**
 * Paper-snap theme transition.
 *
 * Brings back the old "Thanos snap" disintegration (real ash particles on a
 * <canvas>) but reshapes it around the request: instead of a soft reveal wave,
 * the whole screen breaks into a grid of small PAPER SHARDS that each rotate /
 * flip away in place — a little paper turning in the light — while shedding a
 * spray of ash. The whole thing radiates outward from the click origin (the
 * Paper Mode button, bottom-right), sweeping across the screen shard by shard.
 *
 * Same props/contract as before so `ReadingThemeContext` is unchanged: the
 * shards initially cover the screen in the OLD page colour, we flip the DOM
 * theme underneath once (hidden beneath the still-covering shards), and each
 * shard reveals the NEW theme as it rotates away. `onComplete` fires once every
 * shard + ash particle is gone.
 */
interface ThanosSnapCanvasProps {
  isActive: boolean;
  clickPos: { x: number; y: number } | null;
  mode: "to-paper" | "to-dark";
  onThemeFlip: () => void;
  onComplete: () => void;
}

const DARK_BG = "#0b0a0e";
const PAPER_BG = "#eee8dd";

// A screen shard = one little sheet of paper.
interface Shard {
  cx: number; // centre x (moves as it drifts)
  cy: number; // centre y
  w: number;
  h: number;
  delay: number; // frames before it lets go (radial sweep from origin)
  triggered: boolean;
  angle: number; // z-rotation
  spin: number; // z-rotation speed
  flip: number; // 3D-flip phase → scaleX
  flipSpeed: number;
  vx: number; // drift
  vy: number;
  alpha: number;
  shed: boolean; // has it emitted its ash yet
}

// Fine disintegration ash (the "particles we had before").
interface Ash {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  angle: number;
  spin: number;
  seed: number;
}

// Shard grid size — bigger cells = fewer, chunkier sheets of paper.
const CELL = 46;

export default function ThanosSnapCanvas({
  isActive,
  clickPos,
  mode,
  onThemeFlip,
  onComplete,
}: ThanosSnapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep latest callbacks without restarting the animation when the theme flip
  // changes their identity mid-run.
  const flipRef = useRef(onThemeFlip);
  const doneRef = useRef(onComplete);
  flipRef.current = onThemeFlip;
  doneRef.current = onComplete;

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const ox = clickPos ? clickPos.x : W - 40;
    const oy = clickPos ? clickPos.y : H - 40;
    const maxD = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy)) || 1;

    const toPaper = mode === "to-paper";
    // Shards show the OLD page colour while they still cover the screen.
    const sheet = toPaper ? DARK_BG : PAPER_BG;
    const sheetEdge = toPaper ? "#1c1926" : "#e0d8c8";
    const sheen = toPaper ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.65)";

    // Ash palette — mostly paper-coloured flecks + a few warm accents.
    const darkPalette = ["#0b0a0e", "#1a1721", "#2c2834", "#6d6875", "#ff7a5c", "#f5b95f", "#43d6b5"];
    const paperPalette = ["#eee8dd", "#e4ddd0", "#d1c9b9", "#8a8174", "#cf4225", "#aa6f1e", "#0f6b60"];
    const ashPalette = toPaper ? darkPalette : paperPalette;

    // ---- build shards ----
    const cols = Math.max(1, Math.ceil(W / CELL));
    const rows = Math.max(1, Math.ceil(H / CELL));
    const cw = W / cols;
    const chh = H / rows;
    const shards: Shard[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * cw + cw / 2;
        const cy = r * chh + chh / 2;
        const d = Math.hypot(cx - ox, cy - oy) / maxD; // 0 at origin → 1 far corner
        const ang = Math.atan2(cy - oy, cx - ox); // outward from origin
        const push = 1.4 + Math.random() * 1.6;
        shards.push({
          cx,
          cy,
          w: cw + 1, // +1 hides sub-pixel seams while covering
          h: chh + 1,
          delay: d * 46 + Math.random() * 8,
          triggered: false,
          angle: 0,
          spin: (Math.random() - 0.5) * 0.26,
          flip: 0,
          flipSpeed: 0.1 + Math.random() * 0.09,
          vx: Math.cos(ang) * push + (Math.random() - 0.5),
          vy: Math.sin(ang) * push - (0.6 + Math.random() * 1.1), // bias upward
          alpha: 1,
          shed: false,
        });
      }
    }

    const ash: Ash[] = [];
    const spawnAsh = (s: Shard) => {
      const n = 2 + Math.floor(Math.random() * 2);
      for (let k = 0; k < n; k++) {
        const ang = Math.atan2(s.cy - oy, s.cx - ox) + (Math.random() - 0.5) * 1.1;
        const speed = 1.4 + Math.random() * 2.6;
        ash.push({
          x: s.cx + (Math.random() - 0.5) * s.w,
          y: s.cy + (Math.random() - 0.5) * s.h,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed - Math.random() * 1.4,
          size: 1.4 + Math.random() * 3,
          color: ashPalette[Math.floor(Math.random() * ashPalette.length)],
          alpha: 1,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.24,
          seed: Math.random() * 100,
        });
      }
    };

    let frame = 0;
    let flipped = false;
    let animId = 0;

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Flip the DOM theme underneath once the shards have painted a covering
      // sheet — the new theme stays hidden until each shard rotates away.
      if (frame === 2 && !flipped) {
        flipped = true;
        flipRef.current();
      }

      // Soft origin flash — a little burst where the "snap" starts.
      if (frame < 18) {
        const rr = frame * 26;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rr + 1);
        const glow = toPaper ? "255,122,92" : "170,111,30";
        g.addColorStop(0, `rgba(${glow},${0.16 * (1 - frame / 18)})`);
        g.addColorStop(1, `rgba(${glow},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, rr + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      let alive = 0;

      // ---- shards ----
      for (const s of shards) {
        if (!s.triggered) {
          if (frame >= s.delay) s.triggered = true;
          else {
            drawShard(ctx, s, sheet, sheetEdge, sheen, 1); // still covering — flat sheet
            alive++;
            continue;
          }
        }

        if (!s.shed) {
          s.shed = true;
          spawnAsh(s);
        }

        // physics
        s.angle += s.spin;
        s.flip += s.flipSpeed;
        s.cx += s.vx;
        s.cy += s.vy;
        s.vy += 0.06; // slight gravity settle after the initial lift
        s.w *= 0.984;
        s.h *= 0.984;
        s.alpha *= 0.93;

        const flipScale = Math.abs(Math.cos(s.flip)); // 3D turn → edge-on then back
        if (s.alpha > 0.03 && s.w > 1.2) {
          drawShard(ctx, s, sheet, sheetEdge, sheen, flipScale);
          alive++;
        }
      }

      // ---- ash ----
      for (const p of ash) {
        p.x += p.vx + Math.sin(frame * 0.08 + p.seed) * 0.7;
        p.y += p.vy - 0.12; // float up like light ash
        p.size *= 0.972;
        p.alpha *= 0.95;
        p.angle += p.spin;
        if (p.alpha <= 0.03 || p.size <= 0.3) continue;
        alive++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      if (frame > 6 && alive === 0) {
        cancelAnimationFrame(animId);
        doneRef.current();
        return;
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isActive, clickPos, mode]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
      style={{ isolation: "isolate" }}
    />
  );
}

/** Draw one paper shard: a sheet with a soft directional sheen + hairline edge. */
function drawShard(
  ctx: CanvasRenderingContext2D,
  s: Shard,
  sheet: string,
  edge: string,
  sheen: string,
  flipScale: number,
) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
  ctx.translate(s.cx, s.cy);
  ctx.rotate(s.angle);
  ctx.scale(Math.max(0.04, flipScale), 1);
  const w = s.w;
  const h = s.h;
  ctx.fillStyle = sheet;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  // sheen — a diagonal gloss so the rotating paper catches light
  const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  g.addColorStop(0, sheen);
  g.addColorStop(0.5, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.10)");
  ctx.fillStyle = g;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  // hairline edge
  ctx.strokeStyle = edge;
  ctx.lineWidth = 0.6;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.restore();
}

