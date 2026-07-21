"use client";

import { useReadingTheme } from "@/context/ReadingThemeContext";

/**
 * Paper-mode contrast helpers for accent-coloured UI.
 *
 * The DSA/SQL/etc. topic accents are bright PASTELS tuned for the dark theme
 * (e.g. `#43d6b5`, `#f5b95f`, `#9fb3ff`). On the cream Paper-Mode page those are
 * nearly illegible, and because they're passed inline as arbitrary per-topic
 * hexes the `.paper-mode-active [style*="color:#…"]` CSS remaps can't enumerate
 * them. So instead of fighting it in CSS, the components that own these colours
 * darken them here at render time when Paper Mode is active.
 */

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function parseHex(hex: string): [number, number, number] | null {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return null;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, l];
}

function hslToCss(h: number, s: number, l: number, alpha?: number) {
  const sp = `${Math.round(s * 100)}%`;
  const lp = `${Math.round(l * 100)}%`;
  return alpha === undefined
    ? `hsl(${Math.round(h)} ${sp} ${lp})`
    : `hsl(${Math.round(h)} ${sp} ${lp} / ${alpha})`;
}

/**
 * Convert a bright dark-theme accent into a saturated, dark ink readable on the
 * cream paper page (target lightness ~34%, contrast ≈ 6:1 on `#eee8dd`).
 */
export function darkenForPaper(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return "#5b4a2a";
  const [h, s] = rgbToHsl(...rgb);
  return hslToCss(h, clamp(s + 0.12, 0.45, 0.92), 0.34);
}

/** Same hue/darkness but as a translucent tint (for highlighted cell fills). */
export function tintForPaper(hex: string, alpha: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return `rgba(91,74,42,${alpha})`;
  const [h, s] = rgbToHsl(...rgb);
  return hslToCss(h, clamp(s + 0.05, 0.4, 0.9), 0.42, alpha);
}

export interface VizPalette {
  /** readable accent for labels / highlighted text / active strokes */
  accent: string;
  /** translucent accent tint for highlighted cell/node fills */
  accentFill: string;
  /** normal (non-highlighted) text */
  ink: string;
  /** non-highlighted cell / node fill */
  cellFill: string;
  /** faint grid borders / node outlines */
  gridStroke: string;
  /** connecting edges (tree / flow) */
  edgeStroke: string;
  /** secondary label text (edge labels, notes) */
  muted: string;
}

/** Theme-aware colour set for the `viz:*` reading diagrams. */
export function useVizPalette(accentHex: string): VizPalette {
  const { isPaperMode } = useReadingTheme();
  if (isPaperMode) {
    const a = darkenForPaper(accentHex);
    return {
      accent: a,
      accentFill: tintForPaper(accentHex, 0.16),
      ink: "#231f1a",
      cellFill: "rgba(58,50,38,0.05)",
      gridStroke: "rgba(58,50,38,0.32)",
      edgeStroke: "rgba(58,50,38,0.34)",
      muted: "#544d42",
      panel: "#eee8dd",
    };
  }
  return {
    accent: accentHex,
    accentFill: `${accentHex}26`,
    ink: "rgba(255,252,245,0.85)",
    cellFill: "rgba(255,252,245,0.04)",
    gridStroke: "rgba(255,252,245,0.16)",
    edgeStroke: "rgba(255,252,245,0.18)",
    muted: "rgba(255,252,245,0.65)",
    panel: "#0b0a0e",
  };
}

/** Single readable accent colour (for pills / eyebrows) that follows the theme. */
export function useAccentColor(hex: string): string {
  const { isPaperMode } = useReadingTheme();
  return isPaperMode ? darkenForPaper(hex) : hex;
}


