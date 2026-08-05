/**
 * Interactive simulation specs for the class-9 reader.
 *
 * Unlike the `viz:*` markdown fences (JSON, validated at runtime by
 * src/components/viz/types.ts), these are typed TypeScript objects authored
 * directly on a chapter Section. That gives compile-time validation for free —
 * a malformed spec is a `tsc` error at author time, not a runtime surprise.
 *
 * CONSEQUENCE: specs may contain functions, so they can never be serialised to
 * JSON or sent from a Server Component to a Client Component. The chapter
 * reader is therefore a Client Component that imports chapter data directly.
 * See src/components/school/ChapterReader.tsx.
 */

/** Every spec must supply this. It is the screen-reader text, the
 *  prefers-reduced-motion fallback, and the print/export representation.
 *  Never leave it empty. */
type SimBase = {
  /** Shown above the diagram. Keep under 60 characters. */
  title: string;
  /** Plain-language description of what the diagram shows AND what changes
   *  when you interact with it. 2–3 sentences. REQUIRED. */
  altText: string;
};

/* ------------------------------------------------------------------ figure */
/**
 * A textbook plate: the whole specimen drawn at once with leader-line labels
 * around it, and every labelled part clickable to MAGNIFY into it.
 *
 * This began as a separate kind from `anatomy`, a small flat cartoon that
 * lifted a part out of a body. `figure` is the printed-book article instead —
 * dense internal structure, fine linework, labels with leaders, and a
 * magnifier. It won: the last four `anatomy` diagrams were redrawn as plates
 * on 2026-08-04 and the kind was deleted.
 *
 * Rendering is plain SVG + one CSS transform. No WebGL, no new dependency
 * (SCHOOL_BUILD_SPEC.md Rules 2 and 3).
 */

/** One painted stroke or fill inside a part. This is where the *detail* lives:
 *  cristae, grana stacks, nuclear pores, ribosome dots, cell-wall striations. */
export type FigureLayer = {
  /** SVG path `d`, in the spec's viewBox coordinates. */
  d: string;
  /** `stroke` = ink line (default). `fill` = solid in the part's body colour.
   *  `shade` = solid in the part's darker tone. `light` = pale highlight.
   *  `panel` = the diagram backdrop, i.e. a hole — the lumen of a thick-walled
   *  cell, the canal through a bone, the pore in a sieve plate. */
  as?: "stroke" | "fill" | "shade" | "light" | "panel";
  /** Override hue for this layer. Defaults to the part's `tint`. */
  tint?: string;
  /** Stroke width in viewBox units. Default 1.6. */
  width?: number;
  opacity?: number;
  /** Dash pattern in viewBox units, e.g. "5 4". */
  dash?: string;
  /**
   * Clip this layer to the part's own outline.
   *
   * For INTERIOR TEXTURE — a grid of dividing cells inside a meristem dome,
   * lignin rings inside a vessel, fat globules inside a layer. A rectangular
   * grid never matches an organic silhouette, so without this the corners spill
   * out and the part grows square shoulders; it is worst in a lift, where the
   * overhang is magnified up to 2.8×.
   *
   * Off by default, because plenty of layers overhang on purpose — a mirror's
   * stem, a leader dot, a flagellum trailing off its cell.
   */
  clip?: boolean;
};

export type FigurePart = {
  /** Unique within the spec, kebab-case. */
  id: string;
  /** Leader-line label AND the chip label. Max 28 chars. */
  label: string;
  /** Outline of the part. Several disjoint shapes may be concatenated. */
  d: string;
  /** Detail drawn on top of the body. */
  layers?: FigureLayer[];
  /** Bright hue, tuned for the dark theme; Paper Mode darkens it. */
  tint?: string;
  /** Where the label text sits, in viewBox units. Omit to draw no label
   *  (useful for a part that is only reachable from the chip row). */
  labelAt?: [number, number];
  /** Where the leader line touches the drawing. Defaults to the centre of
   *  `focus`. Author it when the part has several scattered shapes and the
   *  centre lands on empty space. */
  leaderAt?: [number, number];
  /** Text anchor. Default: inferred from which side of the plate the label is
   *  on, which is right nearly always. */
  labelAlign?: "start" | "middle" | "end";
  /** The region the magnifier zooms to: `[x, y, w, h]` in viewBox units.
   *  REQUIRED — it is authored, not measured, so a part made of four
   *  scattered chloroplasts can zoom to one representative rather than to a
   *  bounding box that spans the whole cell. */
  focus: [number, number, number, number];
  /** Sits behind everything and never takes visual focus (cytoplasm, the
   *  cell wall, the slide background). Dims less when something else is
   *  selected, so the specimen keeps its context while magnified. */
  backdrop?: boolean;
  /** Paint order. Lower renders first (further back). Default: array index. */
  depth?: number;
  /** What this part is and does. 25–45 words, plain prose. */
  blurb: string;
  /** Panel this part belongs to, for multi-panel plates. Must match a
   *  `FigurePanel.id`. */
  panel?: string;
};

/** One sub-drawing of a multi-panel plate — "(a) bacterial cell",
 *  "(b) plant cell", "(c) animal cell" side by side in one figure. */
export type FigurePanel = {
  id: string;
  /** Printed under the panel, e.g. "(b) Plant cell". */
  caption: string;
  /** `[x, y, w, h]` region of the viewBox this panel occupies. Used to place
   *  the caption and to zoom to the whole panel when its caption is clicked. */
  box: [number, number, number, number];
};

export type FigureSpec = SimBase & {
  kind: "figure";
  /** Book-style figure number shown in the caption, e.g. "Fig. 2.10".
   *  Identifies the printed figure this recaps — same job as `bookRef`. */
  figNumber?: string;
  /** Sentence printed under the plate. Omit to caption with `title`. */
  caption?: string;
  /** `[width, height]` of the SVG coordinate space. Plates run wider than the
   *  cartoon diagrams — use ~[640, 420] so label text can be small in user
   *  units and still legible on screen. */
  viewBox: [number, number];
  parts: FigurePart[];
  panels?: FigurePanel[];
  /** Non-interactive context: the slide, the stand, a bracket, an arrow. */
  scenery?: FigureLayer[];
  /** Free-standing text with no leader and no click target — the numbers on a
   *  number line, an axis name, a dimension. Unlike a part label these stay on
   *  screen while the plate is magnified, and scale with it: on a maths plate
   *  the numbers are the content, not furniture. */
  notes?: {
    at: [number, number];
    text: string;
    align?: "start" | "middle" | "end";
    /** Font size in viewBox units. Default 14. */
    size?: number;
    /** Draw in the accent colour instead of the muted one. */
    emphasis?: boolean;
  }[];
  /** Part magnified on first render. Omit (the normal case) to open on the
   *  whole labelled plate, which is the point of the figure. */
  defaultPartId?: string;
  /** Magnification ceiling. Default 3.4. Raise for a plate whose parts are
   *  tiny relative to the whole (a ribosome inside a cell). */
  maxZoom?: number;
  /**
   * What selecting a part does.
   *
   * `"camera"` (default) magnifies the whole plate into the part — the plate
   * scales and recentres, everything else falls off the edge.
   *
   * `"part"` holds the plate still and lifts the PART forward instead: it
   * enlarges about its own centre, drifts toward the middle, gains a shadow,
   * and the rest of the cell stays where it is, dimmed, as context. Use this
   * when the plate is a whole specimen made of separable organelles — you
   * learn more from seeing an enlarged chloroplast still sitting in its cell
   * than from a cropped rectangle of cell. `backdrop` parts never scale.
   */
  magnify?: "camera" | "part";
};

/* ----------------------------------------------------------- worked-example */
/** Editable inputs; every step recomputes live. Use for: any Maths derivation
 *  where changing the numbers should change the working. */
export type WorkedInput = {
  /** Referenced inside compute functions, e.g. "a" */
  id: string;
  /** Slider label, e.g. "First number (a)" */
  label: string;
  min: number;
  max: number;
  /** Slider granularity. Use 1 for integers. */
  step: number;
  default: number;
  /** Optional unit suffix shown after the value, e.g. "cm" */
  unit?: string;
};

export type WorkedStep = {
  /** Why this step happens. Markdown-free plain text; `$…$` math IS allowed. */
  explain: string;
  /** The arithmetic for the current inputs. MUST be pure: no Math.random,
   *  no Date, no external state. Return a display string. */
  compute: (v: Record<string, number>) => string;
};

export type WorkedExampleSpec = SimBase & {
  kind: "worked-example";
  inputs: WorkedInput[];
  steps: WorkedStep[];
  /** The final answer line, emphasised. Same purity rule as `compute`. */
  result: (v: Record<string, number>) => string;
};

/* ---------------------------------------------------------------- graph-plot */
/** Cartesian plot with draggable parameters. Use for: coordinates, linear
 *  relationships, distance–time graphs. */
export type PlotSeries = {
  id: string;
  label: string;
  /** y for a given x, under the current parameter values. Pure. */
  fn: (x: number, v: Record<string, number>) => number;
};

export type GraphPlotSpec = SimBase & {
  kind: "graph-plot";
  /** Same shape as worked-example inputs; drives the series. May be empty. */
  inputs: WorkedInput[];
  xRange: [number, number];
  yRange: [number, number];
  xLabel: string;
  yLabel: string;
  series: PlotSeries[];
  /** Fixed labelled points drawn on the plane, e.g. plotting coordinates. */
  points?: { x: number; y: number; label: string }[];
};

/* ------------------------------------------------------------ particle-model */
/** Animated particles whose spacing and motion respond to a control.
 *  Use for: states of matter, solutions vs suspensions vs colloids. */
export type ParticleState = {
  id: string;
  /** e.g. "Solution", "Colloid", "Suspension" */
  label: string;
  /** 0 = tightly packed and still, 1 = far apart and fast. */
  spread: number;
  /** 0 = motionless, 1 = rapid. */
  energy: number;
  /** Particle radius in viewBox units. Bigger = suspension-like.
   *  Ignored when `species` is supplied. */
  particleSize: number;
  /** What a learner should notice in this state. 20–40 words. */
  blurb: string;

  /** Distinct kinds of particle in this state.
   *
   *  Without this, a "pure substance" and a "mixture" render as the exact
   *  same field of identical dots — which is the one thing the diagram is
   *  supposed to distinguish. A mixture needs visibly different particles.
   *  Shares are relative weights, not percentages. */
  species?: {
    /** Radius in viewBox units. */
    size: number;
    /** Hex tint for this kind of particle. */
    color: string;
    /** Relative abundance. Two species at 3 and 1 → roughly 75% / 25%. */
    share: number;
  }[];
};

export type ParticleModelSpec = SimBase & {
  kind: "particle-model";
  /** 2–4 states the learner switches between. */
  states: ParticleState[];
  defaultStateId: string;
  /** Number of particles drawn. Keep 18–40 — more costs frame budget. */
  count: number;
};

/* ----------------------------------------------------------- geometry-board */
/** Draggable vertices with live measurements. Use for: perimeter, area,
 *  properties of triangles and quadrilaterals. */
export type GeometryVertex = {
  id: string;
  label: string;
  /** Starting position in viewBox units. */
  at: [number, number];
  /** false => fixed in place. Default true. */
  draggable?: boolean;
};

export type GeometryReadout = {
  label: string;
  /** Computed from current vertex positions. Pure. Return a display string. */
  compute: (pts: Record<string, { x: number; y: number }>) => string;
};

export type GeometryBoardSpec = SimBase & {
  kind: "geometry-board";
  viewBox: [number, number];
  vertices: GeometryVertex[];
  /** Vertex ids in draw order. The shape is always closed. */
  polygon: string[];
  /** Live measurements shown beneath the board. 1–4 of them. */
  readouts: GeometryReadout[];
  /** Snap dragging to this grid size in viewBox units. Use 20. */
  gridSize: number;
};

/* ------------------------------------------------------------------- union */
export type SimSpec =
  | FigureSpec
  | WorkedExampleSpec
  | GraphPlotSpec
  | ParticleModelSpec
  | GeometryBoardSpec;

export type SimKind = SimSpec["kind"];
