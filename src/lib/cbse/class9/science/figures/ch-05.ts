import type { FigureSpec } from "@/lib/sim/types";
import { circle, ellipse, dots, roundRect, stadium } from "@/lib/sim/draw";

/**
 * Chapter 5 plates — "Mixtures Around Us".
 *
 * This chapter is mostly apparatus: a distillation set-up, a separating
 * funnel, a chromatography strip. Apparatus is where a labelled plate earns
 * its keep, because a student who cannot name the parts cannot follow the
 * method — and magnifying the condenser is a far better answer to "what is
 * that spiral bit?" than a paragraph.
 *
 * Drawn from the apparatus, not traced. See the note at the top of ch-02.ts.
 */

const T = {
  glass: "#8fd3f4",
  liquid: "#7fc4e8",
  water: "#6bb8e0",
  vapour: "#cfd8e6",
  flame: "#f4796b",
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

/* ══════════════════════════════════════════ solution / suspension / colloid ══ */

const mixPanels = panelBoxes(3, 20, 190);

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
        { d: "M46,80 H166", width: 1.4, opacity: 0.5 },
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
        { d: "M270,80 H390", width: 1.4, opacity: 0.5 },
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
        { d: "M494,80 H614", width: 1.4, opacity: 0.5 },
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
    "Two beakers with a light beam passing through each. In the salt solution the beam is invisible; in the colloid the beam is clearly visible as a bright path because the larger particles scatter the light. Selecting a label magnifies that part.",
  viewBox: [660, 300],
  parts: [
    {
      id: "torch",
      label: "Light source",
      tint: T.metal,
      depth: 0,
      d: [stadium(20, 128, 74, 44), "M94,138 L118,130 V170 L94,162 Z"].join(" "),
      focus: [12, 120, 116, 60],
      labelAt: [88, 66],
      leaderAt: [58, 128],
      labelAlign: "middle",
      blurb:
        "An ordinary torch. Aim it through the side of the beaker and look at the liquid from the front rather than into the beam — that is when the difference between the two shows up.",
    },
    {
      id: "solution-beaker",
      label: "Solution",
      tint: T.liquid,
      depth: 1,
      d: "M150,86 V212 Q150,228 166,228 L272,228 Q288,228 288,212 V86 Z",
      layers: [
        { d: "M150,110 H288", width: 1.4, opacity: 0.5 },
        { d: scatter([156, 116, 126, 104], 42, 2, 0.4), as: "shade", opacity: 0.6 },
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
      layers: [{ d: "M150,150 H288", width: 2, dash: "4 8", opacity: 0.5 }],
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
        { d: "M400,110 H538", width: 1.4, opacity: 0.5 },
        { d: scatter([406, 116, 126, 104], 40, 4, 0.9), as: "shade", opacity: 0.85 },
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
        {
          d: [
            "M430,150 L418,120 M430,150 L444,118 M466,150 L454,120 M466,150 L480,120",
            "M430,150 L418,180 M466,150 L480,180 M502,150 L496,122 M502,150 L514,180",
          ].join(" "),
          width: 1.6,
          opacity: 0.85,
        },
      ],
      focus: [362, 108, 190, 84],
      labelAt: [466, 46],
      leaderAt: [466, 142],
      labelAlign: "middle",
      blurb:
        "Here the path of the beam glows. Each particle throws a little light off to the side, and enough of it reaches you that the beam becomes an object you can see.",
    },
    {
      id: "beam-source",
      label: "Split beam",
      tint: T.beam,
      depth: 5,
      d: "M288,142 H400 V158 H288 Z",
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
    "A distillation apparatus showing the distillation flask over a burner, the thermometer in the neck, the water-cooled condenser with its inlet and outlet, and the receiver collecting the distillate. Selecting a label magnifies that part.",
  viewBox: [660, 420],
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
      focus: [84, 278, 80, 100],
      labelAt: [64, 398],
      leaderAt: [120, 366],
      labelAlign: "middle",
      blurb:
        "Supplies the heat. Raise the temperature slowly: a gentle boil sends across the lower-boiling liquid on its own, while a fierce one carries both over together and separates nothing.",
    },
    {
      id: "flask",
      label: "Distillation flask",
      tint: T.glass,
      depth: 1,
      d: flask(120, 118, 282, 66, 17),
      layers: [
        { d: "M62,236 Q120,224 178,236 L178,270 Q120,282 62,270 Z", as: "shade", opacity: 0.8 },
        { d: dots([[86, 252], [110, 262], [140, 250], [160, 262]], 4), as: "panel", opacity: 0.5 },
      ],
      focus: [50, 200, 140, 92],
      labelAt: [30, 344],
      leaderAt: [88, 258],
      labelAlign: "start",
      blurb:
        "Holds the mixture being separated. Never fill it more than about two-thirds, and drop in a few porcelain chips so the liquid boils evenly instead of jumping in sudden bursts.",
    },
    {
      id: "thermometer",
      label: "Thermometer",
      tint: T.flame,
      depth: 2,
      d: [roundRect(114, 40, 12, 106, 6), circle(120, 150, 10)].join(" "),
      layers: [{ d: "M117,58 H123 M117,74 H123 M117,90 H123 M117,106 H123", width: 1.4 }],
      focus: [104, 32, 34, 130],
      labelAt: [96, 26],
      leaderAt: [120, 60],
      labelAlign: "end",
      blurb:
        "Its bulb must sit level with the side arm, not down in the liquid. What you want to read is the temperature of the vapour going across, which is the boiling point of whatever is distilling.",
    },
    {
      id: "condenser",
      label: "Condenser",
      tint: T.glass,
      depth: 3,
      d: "M186,118 L470,238 L458,266 L174,146 Z",
      layers: [
        { d: "M198,132 L462,244", width: 1.6, opacity: 0.6 },
        { d: "M186,148 L466,266", width: 1.6, opacity: 0.6 },
      ],
      focus: [170, 110, 310, 164],
      labelAt: [336, 116],
      leaderAt: [318, 178],
      labelAlign: "middle",
      blurb:
        "A tube inside a water jacket, sloping downhill. Hot vapour entering the inner tube meets cold glass, turns back into liquid, and runs down into the receiver as pure distillate.",
    },
    {
      id: "water-in",
      label: "Cold water in",
      tint: T.water,
      depth: 4,
      d: [roundRect(452, 254, 16, 54, 7), roundRect(444, 300, 32, 14, 6)].join(" "),
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
      depth: 5,
      d: [roundRect(190, 76, 16, 50, 7), roundRect(182, 68, 32, 14, 6)].join(" "),
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
      depth: 6,
      d: "M470,282 V366 Q470,382 486,382 L558,382 Q574,382 574,366 V282 Z",
      layers: [
        { d: "M470,330 H574 V366 Q574,382 558,382 L486,382 Q470,382 470,366 Z", as: "shade" },
      ],
      focus: [462, 274, 120, 116],
      labelAt: [598, 356],
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
    "A strip of filter paper hanging in a jar with a little solvent at the bottom. The original ink spot has separated into three coloured bands at different heights up the strip. Selecting a label magnifies that part.",
  viewBox: [660, 420],
  parts: [
    {
      id: "jar",
      label: "Jar and lid",
      tint: T.glass,
      depth: 0,
      backdrop: true,
      d: "M186,66 V352 Q186,372 206,372 L454,372 Q474,372 474,352 V66 Z",
      layers: [{ d: roundRect(172, 46, 316, 22, 8), as: "shade" }],
      focus: [166, 40, 328, 90],
      labelAt: [534, 62],
      leaderAt: [476, 74],
      blurb:
        "A covered jar keeps the air inside saturated with solvent vapour. Without the lid the solvent evaporates off the paper as fast as it climbs and the bands never separate cleanly.",
    },
    {
      id: "solvent",
      label: "Solvent",
      tint: T.solvent,
      depth: 1,
      d: "M188,318 H472 V352 Q472,370 454,370 L206,370 Q188,370 188,352 Z",
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
      layers: [{ d: "M300,318 H360", width: 1.6, dash: "6 5", opacity: 0.7 }],
      focus: [292, 66, 76, 284],
      labelAt: [126, 128],
      leaderAt: [302, 150],
      labelAlign: "end",
      blurb:
        "The stationary phase. Solvent creeps up its fibres by capillary action, and every dye it carries has to keep letting go of the paper to move — which is what makes them travel at different speeds.",
    },
    {
      id: "spot",
      label: "Original spot",
      tint: T.pigmentB,
      depth: 3,
      d: ellipse(330, 300, 17, 8),
      focus: [304, 282, 52, 38],
      labelAt: [126, 300],
      leaderAt: [312, 300],
      labelAlign: "end",
      blurb:
        "One small dot of ink, dried on before the strip goes in. Keep it small and concentrated: a wide smudge gives wide, overlapping bands that are impossible to tell apart.",
    },
    {
      id: "bands",
      label: "Separated dyes",
      tint: T.pigmentA,
      depth: 4,
      d: [
        ellipse(330, 250, 24, 11),
        ellipse(330, 194, 24, 11),
        ellipse(330, 132, 24, 11),
      ].join(" "),
      layers: [
        { d: ellipse(330, 194, 24, 11), as: "shade", tint: T.pigmentC },
        { d: ellipse(330, 132, 24, 11), as: "shade", tint: T.pigmentB },
      ],
      focus: [300, 112, 60, 156],
      labelAt: [534, 172],
      leaderAt: [356, 180],
      blurb:
        "Three dyes, three heights. The one that clings least to the paper and dissolves best in the solvent runs furthest — so the order of the bands is a fingerprint of the ink.",
    },
    {
      id: "solvent-front",
      label: "Solvent front",
      tint: T.metal,
      depth: 5,
      d: "M296,92 H364 V98 H296 Z",
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
    "A separating funnel held in a stand, holding oil floating on water with a clear boundary between them, the stopcock below, and a beaker catching the lower layer. Selecting a label magnifies that part.",
  viewBox: [660, 440],
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
      focus: [80, 150, 132, 66],
      labelAt: [70, 42],
      leaderAt: [96, 76],
      labelAlign: "middle",
      blurb:
        "Holds the funnel steady with both hands free. Clamp it around the neck, not around the bulb — a clamp tightened on the wide glass is how a separating funnel gets cracked.",
    },
    {
      id: "funnel",
      label: "Separating funnel",
      tint: T.glass,
      depth: 1,
      d: "M256,96 V150 C256,196 214,214 214,262 C214,306 254,332 300,332 C346,332 386,306 386,262 C386,214 344,196 344,150 V96 Z",
      layers: [{ d: roundRect(248, 62, 104, 22, 8), as: "shade" }],
      focus: [206, 56, 190, 120],
      labelAt: [546, 96],
      leaderAt: [352, 116],
      blurb:
        "A pear-shaped funnel with a stopper on top and a tap below. Shake it with the stopper held down, vent it, then stand it still and let the two liquids draw a flat line between them.",
    },
    {
      id: "upper-layer",
      label: "Lighter liquid",
      tint: T.oil,
      depth: 2,
      d: "M256,150 C256,196 214,214 214,258 H386 C386,214 344,196 344,150 Z",
      focus: [206, 142, 190, 128],
      labelAt: [546, 176],
      leaderAt: [388, 216],
      blurb:
        "Oil, kerosene — whichever liquid is less dense floats on top. It comes out last, and it is often easier to pour it from the mouth of the funnel than to run it through the tap.",
    },
    {
      id: "boundary",
      label: "Boundary",
      tint: T.metal,
      depth: 3,
      d: "M214,254 H386 V262 H214 Z",
      focus: [206, 240, 190, 40],
      labelAt: [546, 250],
      leaderAt: [388, 258],
      blurb:
        "The flat line where the two layers meet. Close the tap the instant this line reaches it — a moment late and the second liquid follows the first into your beaker.",
    },
    {
      id: "lower-layer",
      label: "Denser liquid",
      tint: T.water,
      depth: 4,
      d: "M214,262 C214,306 254,332 300,332 C346,332 386,306 386,262 Z",
      focus: [206, 254, 190, 88],
      labelAt: [546, 318],
      leaderAt: [388, 300],
      blurb:
        "Water, or any liquid of greater density, sinks to the bottom. Because it sits against the tap it can be drawn off first, cleanly, leaving the lighter layer behind in the funnel.",
    },
    {
      id: "stopcock",
      label: "Stopcock",
      tint: T.metal,
      depth: 5,
      d: [roundRect(292, 330, 16, 26, 4), circle(300, 362, 15), roundRect(294, 374, 12, 26, 4)].join(" "),
      focus: [280, 324, 40, 82],
      labelAt: [438, 372],
      leaderAt: [316, 362],
      blurb:
        "A glass tap you turn a quarter-circle. Open it slowly: a sudden full flow drags the boundary down with it and mixes the two layers again just as you were about to separate them.",
    },
    {
      id: "beaker",
      label: "Beaker",
      tint: T.glass,
      depth: 6,
      d: "M244,398 V420 Q244,432 256,432 L344,432 Q356,432 356,420 V398 Z",
      focus: [236, 390, 128, 50],
      labelAt: [206, 424],
      leaderAt: [248, 420],
      labelAlign: "end",
      blurb:
        "Catches the lower layer as it runs out. Have a second clean one ready — the two liquids must never end up in the same vessel, which would undo the whole separation.",
    },
  ],
};

/* ═════════════════════════════════════════════════════════ blood ══ */

const bloodPanels = panelBoxes(2, 24, 216);

export const bloodFigure: FigureSpec = {
  kind: "figure",
  figNumber: "Fig. 5.22",
  title: "Separating the parts of blood",
  caption:
    "Blood is a mixture. Spin it fast enough and it splits into the heavy cells at the bottom and the straw-coloured plasma above.",
  altText:
    "Two test tubes. Before centrifuging, the blood is a uniform red liquid; after centrifuging it has separated into a pale plasma layer on top, a thin white-cell layer, and packed red cells at the bottom. Selecting a label magnifies that part.",
  viewBox: [660, 320],
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
      layers: [{ d: "M132,54 H216", width: 1.4, opacity: 0.5 }],
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
      layers: [{ d: "M456,54 H540", width: 1.4, opacity: 0.5 }],
      focus: [448, 46, 100, 104],
      labelAt: [572, 78],
      leaderAt: [542, 96],
      blurb:
        "The pale yellow liquid that makes up over half of blood by volume. It is mostly water, carrying dissolved food, salts, hormones and waste to wherever they are going.",
    },
    {
      id: "buffy-coat",
      label: "White cells",
      tint: T.wbc,
      panel: "a",
      depth: 2,
      d: "M456,140 H540 V152 H456 Z",
      focus: [448, 128, 100, 38],
      labelAt: [572, 146],
      leaderAt: [542, 146],
      blurb:
        "A thin pale band caught between the plasma and the red cells. White cells and platelets together are less than one percent of blood — but that band is the body's whole defence force.",
    },
    {
      id: "packed-cells",
      label: "Red cells",
      tint: T.rbc,
      panel: "a",
      depth: 3,
      d: "M456,152 V182 C456,208 476,224 498,224 C520,224 540,208 540,182 V152 Z",
      focus: [448, 144, 100, 90],
      labelAt: [572, 202],
      leaderAt: [542, 190],
      blurb:
        "The heaviest fraction, packed solid at the bottom. What proportion of the tube they fill is a real clinical measurement — a low figure is one of the signs of anaemia.",
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
      focus: [116, 36, 116, 206],
      blurb:
        "Both tubes hold the same blood; only the second has been spun. Comparing them side by side is the point — separation has changed nothing chemically, just sorted the mixture by density.",
    },
  ],
};
