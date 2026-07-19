"use client";

import { useEffect, useRef } from "react";

interface ThanosSnapCanvasProps {
  isActive: boolean;
  clickPos: { x: number; y: number } | null;
  mode: "to-paper" | "to-dark";
  onThemeFlip: () => void;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  delay: number; // frames before starting disintegration
  active: boolean;
  seed: number;
  spin: number;
  angle: number;
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

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const originX = clickPos ? clickPos.x : width / 2;
    const originY = clickPos ? clickPos.y : height / 2;

    // Palette selection
    const darkPalette = [
      "#0b0a0e",
      "#1a1721",
      "#ff7a5c",
      "#f5b95f",
      "#43d6b5",
      "#6d6875",
      "#2c2834",
      "#a5a1ab",
    ];

    const paperPalette = [
      "#eee8dd",
      "#e4ddd0",
      "#221e1a",
      "#3a342d",
      "#aa6f1e",
      "#cf4225",
      "#8a8174",
      "#d1c9b9",
    ];

    const palette = mode === "to-paper" ? darkPalette : paperPalette;

    // Generate ~2400 particles distributed over screen grid
    const particles: Particle[] = [];
    const cols = Math.floor(width / 24);
    const rows = Math.floor(height / 24);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = (c + Math.random()) * 24;
        const py = (r + Math.random()) * 24;

        // Calculate distance from snap origin to sweep outward
        const dx = px - originX;
        const dy = py - originY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Delay sweeps outward from click point (or left to right)
        const sweepDelay = Math.floor(dist / 35) + Math.floor(Math.random() * 8);

        const color = palette[Math.floor(Math.random() * palette.length)];
        const size = Math.random() * 3.5 + 1.5;

        // Angle outward from click origin
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
        const speed = Math.random() * 3.5 + 2.0;

        particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed + (Math.random() * 1.5 - 0.5),
          vy: Math.sin(angle) * speed - Math.random() * 2.0 - 0.8, // slight upward drift
          size,
          color,
          alpha: 1,
          delay: sweepDelay,
          active: false,
          seed: Math.random() * 100,
          spin: (Math.random() - 0.5) * 0.1,
          angle: Math.random() * Math.PI * 2,
        });
      }
    }

    let frame = 0;
    let animId: number;

    // Shockwave ring radius
    let ringRadius = 0;
    const maxRingRadius = Math.max(width, height) * 1.2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      // 1. Draw expanding shockwave ring
      if (ringRadius < maxRingRadius) {
        ringRadius += 35;
        ctx.beginPath();
        ctx.arc(originX, originY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = mode === "to-paper" ? "rgba(255, 122, 92, 0.35)" : "rgba(194, 133, 43, 0.35)";
        ctx.lineWidth = Math.max(1, 12 - ringRadius * 0.015);
        ctx.stroke();
      }

      // 2. Trigger theme flip mid-way through snap (around frame 16 ~ 260ms)
      if (frame === 16 && !flippedRef.current) {
        flippedRef.current = true;
        onThemeFlip();
      }

      // 3. Update & render disintegrating particles
      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (frame >= p.delay) {
          p.active = true;
        }

        if (!p.active) continue;

        // Physics updates
        p.x += p.vx + Math.sin(frame * 0.08 + p.seed) * 0.9;
        p.y += p.vy - 0.15; // upward float like light ash
        p.size *= 0.975;
        p.alpha *= 0.955;
        p.angle += p.spin;

        if (p.alpha > 0.02 && p.size > 0.3) {
          aliveCount++;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);

          ctx.fillStyle = p.color;

          // Draw small textured ash shape (triangle or square)
          if (i % 2 === 0) {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          } else {
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size, p.size);
            ctx.lineTo(-p.size, p.size);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // 4. Check completion
      if (frame > 20 && aliveCount === 0) {
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
