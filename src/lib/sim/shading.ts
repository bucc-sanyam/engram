/**
 * Volume/shading helpers for the class-9 sims.
 *
 * The sims originally filled every shape with the same flat `p.cellFill`, which
 * made a plant cell render as a pile of identical grey blobs. These helpers turn
 * a single authored hue into a small ramp (highlight → body → core shadow → rim)
 * so a shape can be shaded like a lit, rounded object rather than an outline.
 *
 * Deliberately dependency-free and cheap: the output is consumed as SVG
 * <radialGradient> stops / canvas gradients, which the GPU composites for free.
 * There is no WebGL and no three.js here — the target device is a ₹8,000 Android
 * (SCHOOL_BUILD_SPEC.md Rule 3).
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

function hsl(h: number, s: number, l: number, alpha?: number) {
  const sp = `${Math.round(clamp(s, 0, 1) * 100)}%`;
  const lp = `${Math.round(clamp(l, 0, 1) * 100)}%`;
  return alpha === undefined
    ? `hsl(${Math.round(h)} ${sp} ${lp})`
    : `hsl(${Math.round(h)} ${sp} ${lp} / ${alpha})`;
}

export interface Shades {
  /** Lit face — where the light hits (top-left by convention). */
  highlight: string;
  /** Main body colour. */
  body: string;
  /** Shadowed underside / core. */
  shadow: string;
  /** Outline. Reads as the object's edge, not a hairline border. */
  rim: string;
  /** Specular dot for glossy organelles. */
  gloss: string;
  /** Soft contact shadow cast beneath the object. */
  contact: string;
}

/**
 * Build a lighting ramp from one authored hue.
 *
 * Paper Mode gets a darker, more saturated ramp: the bright pastels these
 * chapters use for the dark theme wash out completely on the cream page
 * (same reasoning as `darkenForPaper` in viz-theme.ts).
 */
export function shadesFor(hex: string, paper: boolean, dim = false): Shades {
  const rgb = parseHex(hex);
  const [h, rawS] = rgb ? rgbToHsl(...rgb) : [210, 0.3];
  const s = clamp(rawS + (paper ? 0.1 : 0), 0.25, 0.95);
  const fade = dim ? 0.55 : 1;

  if (paper) {
    return {
      highlight: hsl(h, s * 0.85, 0.72, 0.95 * fade),
      body: hsl(h, s, 0.55, 0.9 * fade),
      shadow: hsl(h, s, 0.33, 0.95 * fade),
      rim: hsl(h, clamp(s + 0.1, 0, 1), 0.28, dim ? 0.5 : 0.9),
      gloss: hsl(h, 0.5, 0.96, 0.55 * fade),
      contact: "hsl(35 20% 25% / 0.22)",
    };
  }
  return {
    highlight: hsl(h, s * 0.9, 0.74, 0.95 * fade),
    body: hsl(h, s, 0.5, 0.88 * fade),
    shadow: hsl(h, s, 0.26, 0.92 * fade),
    rim: hsl(h, clamp(s + 0.12, 0, 1), 0.68, dim ? 0.4 : 0.95),
    gloss: hsl(h, 0.6, 0.98, 0.5 * fade),
    contact: "hsl(0 0% 0% / 0.35)",
  };
}

/** Neutral ramp for parts that carry no authored `tint` — falls back to accent. */
export function shadesForAccent(accentHex: string, paper: boolean, dim = false): Shades {
  return shadesFor(accentHex, paper, dim);
}

/* ------------------------------------------------------------- cartoon --- */

export interface Cartoon {
  /** Flat body colour — no gradient. */
  fill: string;
  /** Second, darker tone for the shaded side. Two tones is all a cartoon needs. */
  shade: string;
  /** Bold outline. The ink line is what makes a flat shape read as a drawing. */
  ink: string;
  /** Light tone for a simple highlight shape. */
  light: string;
}

/**
 * Flat two-tone palette for the illustrated diagrams.
 *
 * Deliberately NOT the `shadesFor` ramp: gradients and rim lights were an
 * attempt at realism that kept landing in the uncanny valley. A committed
 * cartoon — flat fill, one darker tone, bold ink outline — is both clearer
 * for a learner and something SVG genuinely does well.
 */
export function cartoonFor(hex: string, paper: boolean, dim = false): Cartoon {
  const rgb = parseHex(hex);
  const [h, rawS] = rgb ? rgbToHsl(...rgb) : [210, 0.3];
  const s = clamp(rawS + 0.08, 0.35, 0.95);

  if (paper) {
    return {
      fill: hsl(h, s, dim ? 0.78 : 0.66),
      shade: hsl(h, s, dim ? 0.66 : 0.52),
      ink: hsl(h, clamp(s + 0.1, 0, 1), dim ? 0.42 : 0.26),
      light: hsl(h, s * 0.7, 0.86),
    };
  }
  return {
    fill: hsl(h, s, dim ? 0.44 : 0.62),
    shade: hsl(h, s, dim ? 0.34 : 0.47),
    ink: hsl(h, clamp(s + 0.14, 0, 1), dim ? 0.2 : 0.24),
    light: hsl(h, s * 0.8, dim ? 0.56 : 0.76),
  };
}
