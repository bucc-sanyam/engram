import type { FigureSpec } from "@/lib/sim/types";
import { circle, ellipse, dots, roundRect, stadium, gleam } from "@/lib/sim/draw";

/**
 * Chapter 5 plates — "Mixtures Around Us".
 *
 * This chapter is mostly apparatus: a distillation set-up, a separating
 * funnel, a chromatography strip. Apparatus is where a labelled plate earns
 * its keep, because a student who cannot name the parts cannot follow the
 * method — and magnifying the condenser is a far better answer to "what is
 * that spiral bit?" than a paragraph.
 *
 * SHAPE VOCABULARY: manufactured things get `roundRect`/`stadium`/straight
 * edges, and rounding them off makes them toys. See the rule at the top of
 * ch-02-organelle-plates.ts.
 *
 * Drawn from the apparatus, not traced. See the note at the top of ch-02.ts.
 */

const T = {
  glass: "#8fd3f4",
  liquid: "#7fc4e8",
  water: "#6bb8e0",
  vapour: "#cfd8e6",
  flame: "#f4796b",
  flameInner: "#6ba8f4",
  metal: "#9aa7b8",
  cork: "#c9a86a",
  solvent: "#f2b544",
  pigmentA: "#57c785",
  pigmentB: "#e8506b",
  pigmentC: "#f2d06b",
  oil: "#f2d06b",
  solute: "#b39ddb",
  beam: "#f7e08a",
  plasma: "#f2d06b",
  rbc: "#e8506b",
  wbc: "#cfd8e6",
  mercury: "#c0c0c8",
  rubber: "#5a4a3a",
  buffy: "#e8dcc0",
  pencil: "#8a8a8a",
} as const;

function panelBoxes(
  count: number,
  top: number,
  height: number,
  margin = 12,
  gap = 12,
): [number, number, number, number][] {
  const width = (660 - margin * 2 - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, i) => [
    margin + i * (width + gap),
    top,
    width,
    height,
  ]);
}

/** A conical flask standing on its base, as a single closed outline. */
function flask(cx: number, neckTop: number, baseY: number, halfBase: number, halfNeck: number) {
  const shoulder = baseY - (baseY - neckTop) * 0.42;
  return (
    `M${cx - halfNeck},${neckTop} L${cx - halfNeck},${shoulder} ` +
    `L${cx - halfBase},${baseY - 12} Q${cx - halfBase},${baseY} ${cx - halfBase + 12},${baseY} ` +
    `L${cx + halfBase - 12},${baseY} Q${cx + halfBase},${baseY} ${cx + halfBase},${baseY - 12} ` +
    `L${cx + halfNeck},${shoulder} L${cx + halfNeck},${neckTop} Z`
  );
}

/* Deterministic scatter — never Math.random, so the plate is identical on the
 * server and in the browser and never causes a hydration mismatch. */
function scatter(
  box: [number, number, number, number],
  count: number,
  radius: number,
  seed: number,
): string {
  const [x, y, w, h] = box;
  const pts: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const a = (i * 2.399963 + seed) % (Math.PI * 2);
    const r = Math.sqrt((i + 0.5) / count);
    pts.push([
      x + w / 2 + Math.cos(a) * r * (w / 2 - radius - 6),
      y + h / 2 + Math.sin(a) * r * (h / 2 - radius - 6),
    ]);
  }
  return dots(pts, radius);
}

const beakerAt = (x: number): string =>
  `M${x},60 V196 Q${x},210 ${x + 14},210 L${x + 106},210 Q${x + 120},210 ${x + 120},196 V60`;

/** A meniscus — the curved surface where liquid meets glass. */
function meniscus(x0: number, x1: number, y: number, depth: number): string {
  const cx = (x0 + x1) / 2;
  return `M${x0},${y} Q${cx},${y + depth} ${x1},${y}`;
}

/* ══════════════════════════════════════════ solution / suspension / colloid ══ */

const mixPanels = panelBoxes(3, 20, 190);

export const mixtureTypesFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 5.23",
  title: "Solution, suspension and colloid",
  caption:
    "Same three ingredients every time — a substance, a liquid, and gravity. What differs is how big the scattered particles are.",
  altText:
    "Three beakers side by side. The solution holds particles too small to see, the suspension holds large particles that settle to the bottom, and the colloid holds medium particles spread evenly throughout. Selecting a beaker magnifies it.",
  viewBox: [660, 260],
  panels: [
    { id: "so", caption: "Solution — particles invisible", box: mixPanels[0] },
    { id: "su", caption: "Suspension — particles settle", box: mixPanels[1] },
    { id: "co", caption: "Colloid — stays cloudy", box: mixPanels[2] },
  ],
  parts: [
    {
      id: "solution",
      label: "Solution",
      tint: T.liquid,
      panel: "so",
      depth: 0,
      d: `${beakerAt(46)} Z`,
      layers: [
        { d: scatter([50, 80, 112, 126], 46, 2, 0.4), as: "shade", opacity: 0.7 },
        // Meniscus at the top surface
        { d: meniscus(46, 166, 80, 4), width: 1.6, opacity: 0.6 },
        { d: gleam(80, 100, 30, 40), as: "light", opacity: 0.2 },
      ],
      focus: mixPanels[0],
      blurb:
        "A homogeneous mixture: the dissolved particles are smaller than a nanometre, so light passes straight through and no filter can catch them. Salt in water never settles, however long you wait.",
    },
    {
      id: "suspension",
      label: "Suspension",
      tint: T.liquid,
      panel: "su",
      depth: 1,
      d: `${beakerAt(270)} Z`,
      layers: [
        { d: scatter([278, 160, 104, 42], 16, 6, 1.1), as: "shade" },
        { d: scatter([278, 96, 104, 50], 7, 6, 2.3), as: "shade", opacity: 0.75 },
        { d: meniscus(270, 390, 80, 4), width: 1.6, opacity: 0.6 },
        { d: gleam(304, 100, 30, 40), as: "light", opacity: 0.2 },
      ],
      focus: mixPanels[1],
      blurb:
        "A heterogeneous mixture whose particles are big enough to see and heavy enough to sink. Leave chalk in water standing and it collects at the bottom; filter paper stops it completely.",
    },
    {
      id: "colloid",
      label: "Colloid",
      tint: T.liquid,
      panel: "co",
      depth: 2,
      d: `${beakerAt(494)} Z`,
      layers: [
        { d: scatter([500, 84, 108, 120], 40, 3.6, 0.9), as: "shade", opacity: 0.85 },
        { d: meniscus(494, 614, 80, 4), width: 1.6, opacity: 0.6 },
        { d: gleam(528, 100, 30, 40), as: "light", opacity: 0.2 },
      ],
      focus: mixPanels[2],
      blurb:
        "The in-between case: particles too big to be a true solution, too small and light to settle. Milk stays milky for days, and a beam of light shining through it becomes visible.",
    },
  ],
};

/* ══════════════════════════════════════════════════════════ Tyndall ══ */

export const tyndallFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 5.24",
  title: "The Tyndall effect",
  caption:
    "Shine a torch through both. The solution shows nothing; in the colloid the beam itself lights up, because the particles scatter the light sideways into your eye.",
  altText:
    "Two beakers with a light beam passing through each. In the salt solution the beam is invisible; in the colloid the beam is clearly visible as a bright path with speckles because the larger particles scatter the light. The torch body shows a reflector and switch. Selecting a label lifts that part out enlarged.",
  viewBox: [660, 300],
  magnify: "part",
  parts: [
    {
      id: "torch",
      label: "Light source",
      tint: T.metal,
      depth: 0,
      d: [stadium(20, 128, 74, 44), "M94,138 L118,130 V170 L94,162 Z"].join(" "),
      layers: [
        // Reflector disc at the front of the torch
        { d: ellipse(114, 150, 8, 18), as: "light", opacity: 0.6 },
        // Switch on the body — a small raised rectangle
        { d: roundRect(48, 130, 14, 8, 3), as: "shade" },
        { d: gleam(46, 138, 22, 18), as: "light", opacity: 0.35 },
      ],
      focus: [12, 120, 116, 60],
      labelAt: [88, 66],
      leaderAt: [58, 128],
      labelAlign: "middle",
      blurb:
        "An ordinary torch with a parabolic reflector behind the bulb and a switch on the body. Aim it through the side of the beaker and look from the front — that is when the difference shows up.",
    },
    {
      id: "solution-beaker",
      label: "Solution",
      tint: T.liquid,
      depth: 1,
      d: "M150,86 V212 Q150,228 166,228 L272,228 Q288,228 288,212 V86 Z",
      layers: [
        // Meniscus
        { d: meniscus(150, 288, 110, 5), width: 1.8, opacity: 0.65 },
        { d: scatter([156, 116, 126, 104], 42, 2, 0.4), as: "shade", opacity: 0.6 },
        // Glass gleam
        { d: gleam(176, 120, 24, 40), as: "light", opacity: 0.25 },
      ],
      focus: [140, 78, 158, 158],
      labelAt: [216, 274],
      leaderAt: [216, 226],
      labelAlign: "middle",
      blurb:
        "Salt water. Its particles are far smaller than the wavelength of light, so the beam passes through untouched and its path cannot be seen from the side.",
    },
    {
      id: "beam-clear",
      label: "Beam not seen",
      tint: T.beam,
      depth: 2,
      d: "M118,142 H288 V158 H118 Z",
      layers: [
        // The beam is INVISIBLE — drawn as a broken line to show nothing scatters
        { d: "M150,150 H288", width: 2, dash: "4 8", opacity: 0.5 },
      ],
      focus: [112, 132, 182, 40],
      labelAt: [216, 46],
      leaderAt: [216, 142],
      labelAlign: "middle",
      blurb:
        "Inside the solution the beam is drawn as a broken line because there is nothing to see. Light only becomes visible when something bounces it towards your eye.",
    },
    {
      id: "colloid-beaker",
      label: "Colloid",
      tint: T.liquid,
      depth: 3,
      d: "M400,86 V212 Q400,228 416,228 L522,228 Q538,228 538,212 V86 Z",
      layers: [
        // Meniscus
        { d: meniscus(400, 538, 110, 5), width: 1.8, opacity: 0.65 },
        { d: scatter([406, 116, 126, 104], 40, 4, 0.9), as: "shade", opacity: 0.85 },
        // Glass gleam
        { d: gleam(426, 120, 24, 40), as: "light", opacity: 0.25 },
      ],
      focus: [390, 78, 158, 158],
      labelAt: [466, 274],
      leaderAt: [466, 226],
      labelAlign: "middle",
      blurb:
        "Milk diluted with water, or starch solution. Its particles are about the size of a wavelength of light — big enough to scatter it, small enough never to settle out.",
    },
    {
      id: "beam-visible",
      label: "Beam scattered",
      tint: T.beam,
      depth: 4,
      d: "M368,142 H538 V158 H368 Z",
      layers: [
        // Scatter lines — light bouncing off particles sideways
        {
          d: [
            "M430,150 L418,120 M430,150 L444,118 M466,150 L454,120 M466,150 L480,120",
            "M430,150 L418,180 M466,150 L480,180 M502,150 L496,122 M502,150 L514,180",
          ].join(" "),
          width: 1.6,
          opacity: 0.85,
        },
        // SPECKLE IN THE COLLOID BEAM — tiny bright dots scattered along
        // the beam path, representing the scattered light that is the
        // entire point of the figure.
        {
          d: dots(
            [
              [412, 146], [420, 153], [434, 148], [442, 155], [450, 144],
              [458, 152], [470, 147], [478, 154], [486, 145], [494, 151],
              [506, 148], [514, 153], [522, 146], [530, 150],
            ],
            2.2,
          ),
          as: "light",
          opacity: 0.9,
        },
      ],
      focus: [362, 108, 190, 84],
      labelAt: [466, 46],
      leaderAt: [466, 142],
      labelAlign: "middle",
      blurb:
        "Here the path of the beam glows with visible speckle. Each particle throws a little light off to the side, and enough of it reaches you that the beam becomes an object you can see.",
    },
    {
      id: "beam-source",
      label: "Split beam",
      tint: T.beam,
      depth: 5,
      d: "M288,142 H400 V158 H288 Z",
      layers: [
        { d: gleam(344, 146, 30, 6), as: "light", opacity: 0.25 },
      ],
      focus: [284, 134, 120, 34],
      blurb:
        "The same torch shone through both beakers in turn. Keeping the light identical is what makes this a fair test of the liquids rather than of the torch.",
    },
  ],
};

/* ═════════════════════════════════════════════════════════ distillation ══ */

export const distillationFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 5.12",
  title: "Distillation set-up",
  caption:
    "Boil the mixture, cool the vapour, collect the drops. It separates two liquids whose boiling points differ by more than about 25 °C.",
  altText:
    "A distillation apparatus showing the distillation flask over a burner with a blue inner flame cone, the thermometer with a mercury thread and scale in the neck, the water-cooled condenser showing inner tube and outer jacket as separate things, rubber-bung joints, and the receiver collecting droplets. Selecting a label lifts that part out enlarged.",
  viewBox: [660, 420],
  magnify: "part",
  maxZoom: 3.8,
  parts: [
    {
      id: "burner",
      label: "Burner",
      tint: T.flame,
      depth: 0,
      d: [
        "M92,364 h56 v10 h-56 Z",
        "M112,330 h16 v34 h-16 Z",
        "M120,286 C136,306 134,324 120,330 C106,324 104,306 120,286 Z",
      ].join(" "),
      layers: [
        // BLUE INNER CONE — the hottest part of the flame
        {
          d: "M120,302 C128,312 127,322 120,326 C113,322 112,312 120,302 Z",
          as: "fill",
          tint: T.flameInner,
        },
        // Air holes at base of barrel
        { d: dots([[116, 360], [124, 360]], 2), as: "panel" },
        { d: gleam(114, 340, 6, 14), as: "light", opacity: 0.3 },
      ],
      focus: [84, 278, 80, 100],
      labelAt: [64, 398],
      leaderAt: [120, 366],
      labelAlign: "middle",
      blurb:
        "Supplies the heat through a flame with a blue inner cone where the gas burns hottest. Raise the temperature slowly: a gentle boil sends the lower-boiling liquid across on its own.",
    },
    {
      id: "flask",
      label: "Distillation flask",
      tint: T.glass,
      depth: 1,
      d: flask(120, 118, 282, 66, 17),
      layers: [
        // Liquid level inside the flask
        { d: "M62,236 Q120,224 178,236 L178,270 Q120,282 62,270 Z", as: "shade", opacity: 0.8 },
        // RISING BUBBLES — showing the liquid is boiling
        {
          d: dots(
            [[96, 252], [110, 244], [140, 248], [126, 238], [100, 242], [134, 234], [116, 228]],
            3.5,
          ),
          as: "panel",
          opacity: 0.6,
        },
        // Meniscus at the liquid surface
        { d: meniscus(62, 178, 236, 6), width: 1.4, opacity: 0.5 },
        { d: gleam(90, 200, 24, 40), as: "light", opacity: 0.25 },
      ],
      focus: [50, 200, 140, 92],
      labelAt: [30, 344],
      leaderAt: [88, 258],
      labelAlign: "start",
      blurb:
        "Holds the mixture being separated, with bubbles showing it is boiling. Never fill it more than about two-thirds, and drop in porcelain chips so the liquid boils evenly.",
    },
    {
      id: "thermometer",
      label: "Thermometer",
      tint: T.flame,
      depth: 2,
      d: [roundRect(114, 40, 12, 106, 6), circle(120, 150, 10)].join(" "),
      layers: [
        // GRADUATION SCALE MARKS along the stem
        { d: "M114,58 H126 M117,66 H123 M114,74 H126 M117,82 H123 M114,90 H126 M117,98 H123 M114,106 H126 M117,114 H123 M114,122 H126 M117,130 H123 M114,138 H126", width: 1.0, opacity: 0.7 },
        // MERCURY THREAD — a thin column rising from the bulb
        { d: roundRect(118, 86, 4, 62, 2), as: "shade" },
        // Mercury in the bulb
        { d: circle(120, 150, 7), as: "shade" },
        { d: gleam(118, 80, 4, 30), as: "light", opacity: 0.3 },
      ],
      focus: [104, 32, 34, 130],
      labelAt: [96, 26],
      leaderAt: [120, 60],
      labelAlign: "end",
      blurb:
        "Its bulb sits level with the side arm, reading the temperature of the vapour going across. The mercury thread rises alongside a graduated scale, showing the boiling point of whatever is distilling.",
    },
    {
      id: "condenser",
      label: "Condenser",
      tint: T.glass,
      depth: 3,
      // WATER JACKET and INNER TUBE drawn as two separate things
      d: "M186,118 L470,238 L458,266 L174,146 Z",
      layers: [
        // Inner tube — the path the vapour takes, inside the water jacket
        { d: "M198,132 L462,244", width: 4.0, opacity: 0.45 },
        // Outer jacket walls — showing it as a separate enclosure
        { d: "M190,128 L466,244", width: 1.6, opacity: 0.6 },
        { d: "M180,148 L460,266", width: 1.6, opacity: 0.6 },
        // Condensation droplets running down the inner tube
        { d: dots([[280, 168], [340, 194], [400, 218]], 3), as: "shade", opacity: 0.65 },
        { d: gleam(300, 162, 60, 16), as: "light", opacity: 0.2 },
      ],
      focus: [170, 110, 310, 164],
      labelAt: [336, 116],
      leaderAt: [318, 178],
      labelAlign: "middle",
      blurb:
        "A tube inside a water jacket, sloping downhill. The inner tube carries the hot vapour; the outer jacket carries cold water flowing the opposite way, cooling the vapour back into liquid.",
    },
    {
      id: "bung-flask",
      label: "Bung joint",
      tint: T.rubber,
      depth: 4,
      // RUBBER BUNG where the flask neck meets the condenser
      d: roundRect(166, 116, 26, 16, 4),
      layers: [
        { d: gleam(172, 118, 8, 6), as: "light", opacity: 0.2 },
      ],
      focus: [158, 108, 42, 32],
      labelAt: [162, 80],
      leaderAt: [180, 116],
      labelAlign: "end",
      blurb:
        "A rubber bung sealing the joint where the flask neck enters the condenser. Without a tight seal, vapour escapes into the room and the yield drops — and the fumes may be flammable.",
    },
    {
      id: "water-in",
      label: "Cold water in",
      tint: T.water,
      depth: 5,
      d: [roundRect(452, 254, 16, 54, 7), roundRect(444, 300, 32, 14, 6)].join(" "),
      layers: [
        { d: gleam(456, 270, 6, 18), as: "light", opacity: 0.3 },
      ],
      focus: [436, 246, 48, 76],
      labelAt: [556, 300],
      leaderAt: [470, 296],
      blurb:
        "Water enters at the lower end, so it flows up against the direction of the vapour. Running it the other way would leave the far end of the jacket warm and the cooling incomplete.",
    },
    {
      id: "water-out",
      label: "Warm water out",
      tint: T.water,
      depth: 6,
      d: [roundRect(190, 76, 16, 50, 7), roundRect(182, 68, 32, 14, 6)].join(" "),
      layers: [
        { d: gleam(194, 86, 6, 18), as: "light", opacity: 0.3 },
      ],
      focus: [174, 60, 48, 74],
      labelAt: [252, 52],
      leaderAt: [206, 78],
      blurb:
        "Water leaves at the top end, carrying away the heat it has taken from the vapour. A steady trickle is plenty; a torrent wastes water without condensing anything faster.",
    },
    {
      id: "receiver",
      label: "Receiver",
      tint: T.glass,
      depth: 7,
      d: "M470,282 V366 Q470,382 486,382 L558,382 Q574,382 574,366 V282 Z",
      layers: [
        // Collected distillate
        { d: "M470,330 H574 V366 Q574,382 558,382 L486,382 Q470,382 470,366 Z", as: "shade" },
        // DROPLETS collecting at the mouth
        { d: dots([[476, 286], [480, 294], [474, 302], [478, 310]], 2.5), as: "shade", opacity: 0.7 },
        { d: gleam(496, 340, 20, 20), as: "light", opacity: 0.25 },
      ],
      focus: [462, 274, 120, 116],
      labelAt: [590, 356],
      leaderAt: [576, 350],
      blurb:
        "Collects the distillate drop by drop. Swap it for a clean one when the thermometer jumps to a new steady reading — that jump means the next component has started coming across.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════ chromatography ══ */

export const chromatographyFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 5.15",
  title: "Paper chromatography",
  caption:
    "One spot of ink climbs the paper with the solvent and pulls apart into its dyes, because each dye clings to the paper by a different amount.",
  altText:
    "A covered glass jar with a gleam highlight on its surface, a strip of filter paper hanging inside it with a pencil baseline near the bottom, a solvent pool with a meniscus, and separated dye bands with diffuse rather than hard edges. Selecting a label lifts that part out enlarged.",
  viewBox: [660, 420],
  magnify: "part",
  parts: [
    {
      id: "jar",
      label: "Jar and lid",
      tint: T.glass,
      depth: 0,
      backdrop: true,
      d: "M186,66 V352 Q186,372 206,372 L454,372 Q474,372 474,352 V66 Z",
      layers: [
        // LID on the jar — a flat rectangle across the top
        { d: roundRect(172, 46, 316, 22, 8), as: "shade" },
        // GLASS GLEAM running down the jar body
        { d: gleam(210, 120, 20, 90), as: "light", opacity: 0.35 },
        // Second subtle gleam near the right edge
        { d: gleam(450, 140, 12, 60), as: "light", opacity: 0.2 },
      ],
      focus: [166, 40, 328, 90],
      labelAt: [534, 62],
      leaderAt: [476, 74],
      blurb:
        "A covered glass jar keeps the air inside saturated with solvent vapour. Without the lid the solvent evaporates off the paper as fast as it climbs and the bands never separate cleanly.",
    },
    {
      id: "solvent",
      label: "Solvent",
      tint: T.solvent,
      depth: 1,
      d: "M188,318 H472 V352 Q472,370 454,370 L206,370 Q188,370 188,352 Z",
      layers: [
        // MENISCUS at the solvent surface
        { d: meniscus(188, 472, 318, 6), width: 1.8, opacity: 0.65 },
        { d: gleam(260, 336, 40, 14), as: "light", opacity: 0.2 },
      ],
      focus: [180, 310, 300, 66],
      labelAt: [534, 344],
      leaderAt: [476, 344],
      blurb:
        "A shallow pool of water or alcohol. The level must stay BELOW the ink spot — dip the spot itself in and the dyes simply wash off into the pool instead of climbing.",
    },
    {
      id: "paper",
      label: "Filter paper strip",
      tint: T.vapour,
      depth: 2,
      d: roundRect(300, 74, 60, 268, 4),
      layers: [
        // Solvent front line
        { d: "M300,318 H360", width: 1.6, dash: "6 5", opacity: 0.7 },
        // PENCIL BASELINE — drawn in pencil, NOT ink. This is the teaching
        // point: pencil does not dissolve in the solvent, so it stays put
        // while the ink dyes travel. A baseline drawn in ink would smear.
        { d: "M304,292 H356", width: 1.2, opacity: 0.55, dash: "2 3" },
        { d: gleam(314, 140, 14, 60), as: "light", opacity: 0.15 },
      ],
      focus: [292, 66, 76, 284],
      labelAt: [126, 128],
      leaderAt: [302, 150],
      labelAlign: "end",
      blurb:
        "The stationary phase, with a pencil baseline near the bottom. The baseline must be drawn in pencil — ink would dissolve and travel with the solvent, wrecking the experiment.",
    },
    {
      id: "spot",
      label: "Original spot",
      tint: T.pigmentB,
      depth: 3,
      d: ellipse(330, 292, 17, 8),
      layers: [
        { d: gleam(326, 288, 6, 4), as: "light", opacity: 0.25 },
      ],
      focus: [304, 274, 52, 38],
      labelAt: [126, 300],
      leaderAt: [312, 292],
      labelAlign: "end",
      blurb:
        "One small dot of ink, dried on before the strip goes in. Keep it small and concentrated: a wide smudge gives wide, overlapping bands that are impossible to tell apart.",
    },
    {
      id: "bands",
      label: "Separated dyes",
      tint: T.pigmentA,
      depth: 4,
      // DIFFUSE band boundaries — not hard-edged ellipses. Each band has
      // a gradient-like layering to show the dyes are not sharply cut off.
      d: [
        ellipse(330, 250, 24, 14),
        ellipse(330, 194, 24, 14),
        ellipse(330, 132, 24, 14),
      ].join(" "),
      layers: [
        // Outer diffuse halo on each band — making boundaries fuzzy
        { d: ellipse(330, 250, 27, 17), as: "light", opacity: 0.3 },
        { d: ellipse(330, 194, 27, 17), as: "light", opacity: 0.3 },
        { d: ellipse(330, 132, 27, 17), as: "light", opacity: 0.3 },
        // Inner colour cores — distinct tints for each dye
        { d: ellipse(330, 194, 20, 10), as: "shade", tint: T.pigmentC },
        { d: ellipse(330, 132, 20, 10), as: "shade", tint: T.pigmentB },
      ],
      focus: [300, 112, 60, 156],
      labelAt: [534, 172],
      leaderAt: [356, 180],
      blurb:
        "Three dyes, three heights, each with diffuse edges rather than sharp cut-offs. The one that clings least to the paper and dissolves best in the solvent runs furthest.",
    },
    {
      id: "solvent-front",
      label: "Solvent front",
      tint: T.metal,
      depth: 5,
      d: "M296,92 H364 V98 H296 Z",
      layers: [
        { d: gleam(320, 92, 16, 3), as: "light", opacity: 0.2 },
      ],
      focus: [288, 82, 84, 30],
      labelAt: [534, 106],
      leaderAt: [366, 95],
      blurb:
        "The highest point the solvent reached. Mark it the moment you lift the strip out — every band's distance is measured against this line, and it fades once the paper dries.",
    },
  ],
};

/* ═══════════════════════════════════════════════════ separating funnel ══ */

export const separatingFunnelFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 5.16",
  title: "Separating immiscible liquids",
  caption:
    "Oil and water refuse to mix, so they settle into two layers — and a tap at the bottom lets you run the lower one off on its own.",
  altText:
    "A separating funnel held in a stand with a stopper at the top, glass gleam down the funnel body, a graduated stem, a visible stopcock bore showing the channel, two clearly different liquid layers with droplets at the boundary and a meniscus on each, and a beaker catching the lower layer. Selecting a label lifts that part out enlarged.",
  viewBox: [660, 440],
  magnify: "part",
  parts: [
    {
      id: "stand",
      label: "Stand and clamp",
      tint: T.metal,
      depth: 0,
      backdrop: true,
      d: [
        roundRect(88, 60, 16, 336, 6),
        "M60,396 h72 v18 H60 Z",
        roundRect(104, 168, 96, 14, 6),
      ].join(" "),
      layers: [
        { d: gleam(92, 140, 6, 80), as: "light", opacity: 0.25 },
      ],
      focus: [80, 150, 132, 66],
      labelAt: [70, 42],
      leaderAt: [96, 76],
      labelAlign: "middle",
      blurb:
        "Holds the funnel steady with both hands free. Clamp it around the neck, not around the bulb — a clamp tightened on the wide glass is how a separating funnel gets cracked.",
    },
    {
      id: "stopper",
      label: "Stopper",
      tint: T.cork,
      depth: 1,
      // STOPPER at the top — prevents splashing and allows pressure release
      d: "M272,82 L288,66 H312 L328,82 H340 V96 H260 V82 Z",
      layers: [
        { d: roundRect(290, 56, 20, 12, 4), as: "shade" },
        { d: gleam(296, 62, 8, 6), as: "light", opacity: 0.3 },
      ],
      focus: [254, 50, 92, 54],
      labelAt: [420, 66],
      leaderAt: [342, 86],
      blurb:
        "A glass or cork stopper sealing the mouth. Hold it down while shaking — without it the pressure building inside blows the liquids out the top, which is both messy and dangerous.",
    },
    {
      id: "funnel",
      label: "Separating funnel",
      tint: T.glass,
      depth: 2,
      d: "M256,96 V150 C256,196 214,214 214,262 C214,306 254,332 300,332 C346,332 386,306 386,262 C386,214 344,196 344,150 V96 Z",
      layers: [
        // GLASS GLEAM running down the funnel body
        { d: gleam(240, 180, 18, 60), as: "light", opacity: 0.35 },
        // Second gleam on the right
        { d: gleam(368, 240, 10, 40), as: "light", opacity: 0.2 },
      ],
      focus: [206, 86, 190, 120],
      labelAt: [546, 96],
      leaderAt: [352, 116],
      blurb:
        "A pear-shaped funnel with a stopper on top and a tap below. Shake it with the stopper held down, vent it, then stand it still and let the two liquids draw a flat line between them.",
    },
    {
      id: "upper-layer",
      label: "Lighter liquid",
      tint: T.oil,
      depth: 3,
      d: "M256,150 C256,196 214,214 214,258 H386 C386,214 344,196 344,150 Z",
      layers: [
        // MENISCUS on the upper liquid
        { d: meniscus(256, 344, 150, 5), width: 1.6, opacity: 0.55 },
        { d: gleam(268, 180, 20, 30), as: "light", opacity: 0.2 },
      ],
      focus: [206, 142, 190, 128],
      labelAt: [546, 176],
      leaderAt: [388, 216],
      blurb:
        "Oil, kerosene — whichever liquid is less dense floats on top. Its tint is clearly different from the water below so the two layers are unmistakable.",
    },
    {
      id: "boundary",
      label: "Boundary",
      tint: T.metal,
      depth: 4,
      d: "M214,254 H386 V262 H214 Z",
      layers: [
        // DROPLETS suspended at the boundary between the two layers
        {
          d: dots(
            [[240, 258], [268, 256], [300, 260], [330, 256], [360, 258]],
            3,
          ),
          as: "shade",
          opacity: 0.5,
        },
      ],
      focus: [206, 240, 190, 40],
      labelAt: [546, 250],
      leaderAt: [388, 258],
      blurb:
        "The flat line where the two layers meet, with a few stray droplets suspended at the interface. Close the tap the instant this line reaches it to keep the separation clean.",
    },
    {
      id: "lower-layer",
      label: "Denser liquid",
      tint: T.water,
      depth: 5,
      d: "M214,262 C214,306 254,332 300,332 C346,332 386,306 386,262 Z",
      layers: [
        // MENISCUS on the lower liquid
        { d: meniscus(214, 386, 262, 4), width: 1.4, opacity: 0.5 },
        { d: gleam(250, 280, 20, 20), as: "light", opacity: 0.2 },
      ],
      focus: [206, 254, 190, 88],
      labelAt: [546, 318],
      leaderAt: [388, 300],
      blurb:
        "Water, or any liquid of greater density, sinks to the bottom. Its distinctly different tint from the oil above makes the boundary unmistakable.",
    },
    {
      id: "stopcock",
      label: "Stopcock",
      tint: T.metal,
      depth: 6,
      d: [roundRect(292, 330, 16, 26, 4), circle(300, 362, 15), roundRect(294, 374, 12, 26, 4)].join(" "),
      layers: [
        // VISIBLE STOPCOCK BORE — the channel through the tap, showing
        // it turned to demonstrate how liquid flows through.
        { d: roundRect(296, 354, 8, 16, 3), as: "panel" },
        // Tap handle showing the bore direction
        { d: roundRect(270, 358, 60, 8, 3), as: "shade", opacity: 0.5 },
        { d: gleam(294, 350, 6, 10), as: "light", opacity: 0.3 },
      ],
      focus: [264, 324, 72, 82],
      labelAt: [438, 372],
      leaderAt: [316, 362],
      blurb:
        "A glass tap with a visible bore channel. Turn it a quarter-circle to open. Open slowly: a sudden full flow drags the boundary down and mixes the two layers you were about to separate.",
    },
    {
      id: "stem",
      label: "Graduated stem",
      tint: T.glass,
      depth: 7,
      // GRADUATED STEM below the stopcock
      d: roundRect(296, 398, 8, 36, 3),
      layers: [
        // Graduation marks along the stem
        { d: "M296,406 H304 M298,414 H302 M296,422 H304 M298,430 H302", width: 1.0, opacity: 0.6 },
        { d: gleam(298, 408, 3, 12), as: "light", opacity: 0.25 },
      ],
      focus: [288, 394, 24, 44],
      labelAt: [206, 420],
      leaderAt: [296, 418],
      labelAlign: "end",
      blurb:
        "The narrow graduated tube below the tap. The scale lets you read off how much of the lower layer you have drained, and the narrow bore slows the flow enough to stop precisely.",
    },
  ],
};

/* ═════════════════════════════════════════════════════════ blood ══ */

const bloodPanels = panelBoxes(2, 24, 216);

/** A single biconcave red blood cell seen from the side. */
function rbcDisc(cx: number, cy: number, rx: number, ry: number): string {
  // A biconcave disc in side view looks like an hourglass-pinched ellipse.
  // Draw it as an outer ellipse with a dimple on each side.
  return [
    ellipse(cx, cy, rx, ry),
    // The two dimples that make it biconcave
    ellipse(cx, cy, rx * 0.35, ry * 0.5),
  ].join(" ");
}

export const bloodFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 5.22",
  title: "Separating the parts of blood",
  caption:
    "Blood is a mixture. Spin it fast enough and it splits into the heavy cells at the bottom and the straw-coloured plasma above.",
  altText:
    "Two test tubes. Before centrifuging, the blood is a uniform red liquid; after centrifuging it has separated into pale plasma with a meniscus, a thin distinctly-coloured buffy coat with white cells, and biconcave red-cell discs packed at the bottom. Both tubes show glass gleam and graduation marks. Selecting a label lifts that part out enlarged.",
  viewBox: [660, 320],
  magnify: "part",
  panels: [
    { id: "b", caption: "(a) Before centrifuging", box: bloodPanels[0] },
    { id: "a", caption: "(b) After centrifuging", box: bloodPanels[1] },
  ],
  parts: [
    {
      id: "whole-blood",
      label: "Whole blood",
      tint: T.rbc,
      panel: "b",
      depth: 0,
      d: "M132,54 V182 C132,208 152,224 174,224 C196,224 216,208 216,182 V54 Z",
      layers: [
        // Meniscus at the top
        { d: meniscus(132, 216, 54, 5), width: 1.6, opacity: 0.6 },
        { d: gleam(148, 100, 16, 50), as: "light", opacity: 0.25 },
      ],
      focus: [124, 46, 100, 188],
      labelAt: [116, 62],
      leaderAt: [134, 100],
      labelAlign: "end",
      blurb:
        "Straight from the vein it looks like a single red liquid. Nothing settles out on its own in any useful time, which is why it takes a machine spinning at thousands of turns a minute.",
    },
    {
      id: "plasma",
      label: "Plasma",
      tint: T.plasma,
      panel: "a",
      depth: 1,
      d: "M456,54 V140 H540 V54 Z",
      layers: [
        // MENISCUS at the plasma surface
        { d: meniscus(456, 540, 54, 5), width: 1.6, opacity: 0.6 },
        { d: gleam(468, 76, 16, 30), as: "light", opacity: 0.25 },
      ],
      focus: [448, 46, 100, 104],
      labelAt: [572, 78],
      leaderAt: [542, 96],
      blurb:
        "The pale yellow liquid that makes up over half of blood by volume. It is mostly water, carrying dissolved food, salts, hormones and waste to wherever they are going.",
    },
    {
      id: "buffy-coat",
      label: "White cells",
      tint: T.buffy,
      panel: "a",
      depth: 2,
      d: "M456,140 H540 V156 H456 Z",
      layers: [
        // A FEW WHITE CELLS visible in the buffy coat layer
        {
          d: dots([[470, 148], [486, 148], [504, 148], [520, 148], [536, 148]], 4),
          as: "light",
          opacity: 0.7,
        },
        // Nuclei in the white cells
        { d: dots([[470, 148], [504, 148], [536, 148]], 2), as: "shade", opacity: 0.6 },
      ],
      focus: [448, 128, 100, 42],
      labelAt: [572, 146],
      leaderAt: [542, 148],
      blurb:
        "A thin distinctly-coloured band caught between the plasma and the red cells, with a few white cells visible in it. White cells and platelets together are less than one percent of blood.",
    },
    {
      id: "packed-cells",
      label: "Red cells",
      tint: T.rbc,
      panel: "a",
      depth: 3,
      d: "M456,156 V182 C456,208 476,224 498,224 C520,224 540,208 540,182 V156 Z",
      layers: [
        // BICONCAVE RED-CELL DISCS packed at the bottom rather than a flat
        // block of colour. Several RBCs shown in different orientations.
        {
          d: [
            rbcDisc(474, 170, 10, 6),
            rbcDisc(498, 166, 11, 7),
            rbcDisc(522, 172, 10, 6),
            rbcDisc(480, 186, 10, 7),
            rbcDisc(510, 182, 11, 6),
            rbcDisc(474, 200, 10, 6),
            rbcDisc(498, 198, 10, 7),
            rbcDisc(522, 196, 10, 6),
          ].join(" "),
          as: "shade",
          opacity: 0.55,
        },
      ],
      focus: [448, 148, 100, 86],
      labelAt: [572, 202],
      leaderAt: [542, 190],
      blurb:
        "The heaviest fraction, packed solid at the bottom as stacks of biconcave discs. What proportion of the tube they fill is a real clinical measurement — a low figure is one sign of anaemia.",
    },
    {
      id: "tube",
      label: "Test tube",
      tint: T.glass,
      panel: "b",
      depth: 4,
      backdrop: true,
      d: [
        "M124,44 V182 C124,214 148,234 174,234 C200,234 224,214 224,182 V44 Z",
        "M448,44 V182 C448,214 472,234 498,234 C524,234 548,214 548,182 V44 Z",
      ].join(" "),
      layers: [
        // GLASS GLEAM on both tubes
        { d: gleam(140, 90, 14, 50), as: "light", opacity: 0.3 },
        { d: gleam(462, 90, 14, 50), as: "light", opacity: 0.3 },
        // GRADUATION MARKS on both tubes
        {
          d: [
            "M124,80 H132 M124,110 H132 M124,140 H132 M124,170 H132 M124,200 H132",
            "M448,80 H456 M448,110 H456 M448,140 H456 M448,170 H456 M448,200 H456",
          ].join(" "),
          width: 1.0,
          opacity: 0.5,
        },
      ],
      focus: [116, 36, 116, 206],
      blurb:
        "Both graduated tubes hold the same blood; only the second has been spun. Comparing them side by side is the point — separation has changed nothing chemically, just sorted the mixture by density.",
    },
  ],
};
