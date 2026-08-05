import type { FigureSpec } from "@/lib/sim/types";
import {
  circle,
  ellipse,
  dots,
  blob,
  cell,
  tubule,
  roundRect,
  stadium,
  gleam,
  smoothClosed,
} from "@/lib/sim/draw";

const T = {
  hydraBody: "#f58fa8",
  hydraTentacle: "#f8a8bb",
  petal: "#ff7b9c",
  sepal: "#8fbf5e",
  stamen: "#f4dfa6",
  pistil: "#43d6b5",
  maleOrgan: "#8fd0e8",
  maleDuct: "#a768cf",
  femaleOrgan: "#ff8a70",
  femaleDuct: "#e0607f",
  background: "#f4f4f4",
};

export const buddingHydraPlate: FigureSpec = {
  kind: "figure",
  title: "Budding in Hydra",
  figNumber: "Fig. 11.7",
  altText: "A hydra showing a bud developing on its side. Selecting parts highlights the tentacles, mouth, main body, bud and basal disc.",
  viewBox: [660, 470],
  magnify: "part",
  parts: [
    {
      id: "tentacles",
      label: "Tentacles",
      tint: T.hydraTentacle,
      depth: 1,
      d: [
        smoothClosed([ [306, 150], [266, 80], [274, 80], [314, 150] ]),
        smoothClosed([ [321, 140], [306, 60], [314, 60], [329, 140] ]),
        smoothClosed([ [336, 140], [356, 50], [364, 50], [344, 140] ]),
        smoothClosed([ [351, 150], [406, 70], [414, 70], [359, 150] ]),
      ].join(" "),
      layers: [
        { d: gleam(310, 140, 4, 30), as: "light", opacity: 0.3 },
        { d: gleam(340, 130, 4, 30), as: "light", opacity: 0.3 },
        { d: gleam(350, 140, 4, 30), as: "light", opacity: 0.3 },
        { d: "M300,100 A20,20 0 0,1 310,120", as: "shade" },
        { d: "M350,90 A20,20 0 0,0 340,110", as: "shade" }
      ],
      focus: [300, 50, 80, 100],
      labelAt: [200, 80],
      leaderAt: [280, 100],
      blurb: "Long, flexible appendages armed with stinging cells. The hydra uses them to capture tiny aquatic prey and sweep it towards the central mouth.",
    },
    {
      id: "mouth",
      label: "Mouth",
      tint: T.hydraBody,
      depth: 2,
      d: blob(333, 140, 18, 12, [1, 0.9, 1.05, 0.95]),
      layers: [
        { d: ellipse(333, 140, 8, 4), as: "shade" },
        { d: ellipse(333, 140, 4, 2), as: "panel" }
      ],
      focus: [315, 128, 36, 24],
      labelAt: [480, 120],
      leaderAt: [340, 140],
      blurb: "The single opening at the top of the body. Food goes in and waste comes out through this same opening, leading into the digestive cavity.",
    },
    {
      id: "body",
      label: "Main body",
      tint: T.hydraBody,
      depth: 0,
      d: smoothClosed([ [310, 150], [356, 150], [360, 250], [355, 380], [311, 380], [306, 250] ]),
      layers: [
        { d: gleam(333, 260, 20, 200), as: "light", opacity: 0.4 },
        { d: smoothClosed([ [320, 170], [346, 170], [340, 360], [326, 360] ]), as: "shade", opacity: 0.3 }
      ],
      focus: [300, 150, 66, 230],
      labelAt: [200, 260],
      leaderAt: [310, 260],
      blurb: "A simple, tube-like structure made of just two cell layers. The inner layer digests food while the outer layer protects the organism and contains nerve cells.",
    },
    {
      id: "developing-bud",
      label: "Developing bud",
      tint: T.hydraTentacle,
      depth: 3,
      d: smoothClosed([ [358, 290], [420, 275], [425, 285], [358, 305] ]),
      layers: [
        { d: gleam(389, 285, 8, 20), as: "light", opacity: 0.4 },
        { d: smoothClosed([ [420, 275], [440, 260], [443, 263], [423, 278] ]), as: "light" },
        { d: smoothClosed([ [422, 280], [445, 285], [445, 289], [422, 284] ]), as: "light" },
        { d: smoothClosed([ [425, 285], [435, 305], [431, 307], [421, 287] ]), as: "light" }
      ],
      focus: [358, 260, 80, 60],
      labelAt: [500, 280],
      leaderAt: [410, 280],
      blurb: "A small outgrowth formed by repeated cell division at one specific site. It develops a mouth and tentacles before eventually detaching to live independently.",
    },
    {
      id: "basal-disc",
      label: "Basal disc",
      tint: T.hydraBody,
      depth: 1,
      d: blob(333, 380, 35, 10, [1, 0.95, 1.05, 0.9, 1]),
      layers: [
        { d: ellipse(333, 380, 25, 5), as: "shade" },
        { d: gleam(333, 375, 15, 4), as: "light", opacity: 0.5 }
      ],
      focus: [298, 370, 70, 20],
      labelAt: [200, 380],
      leaderAt: [305, 380],
      blurb: "The sticky base that anchors the hydra to aquatic plants or stones. It can secrete bubbles to help the hydra float to a new location.",
    },
  ],
};

export const flowerPlate: FigureSpec = {
  kind: "figure",
  title: "Structure of a Flower",
  figNumber: "Fig. 11.10",
  altText: "Cross section of a flower showing petals, sepals, stamens, and pistil. Selecting parts highlights them and explains their role in reproduction.",
  viewBox: [660, 470],
  magnify: "part",
  parts: [
    {
      id: "petal",
      label: "Petal",
      tint: T.petal,
      depth: 0,
      d: [
        smoothClosed([ [330, 260], [220, 180], [180, 80], [280, 60] ]),
        smoothClosed([ [330, 260], [380, 60], [480, 80], [440, 180] ]),
        smoothClosed([ [330, 260], [300, 40], [360, 40] ]),
      ].join(" "),
      layers: [
        { d: "M240,160 Q280,180 320,240 M420,160 Q380,180 340,240", as: "shade", width: 2 },
        { d: gleam(250, 120, 40, 40), as: "light", opacity: 0.3 },
        { d: gleam(410, 120, 40, 40), as: "light", opacity: 0.3 }
      ],
      focus: [180, 40, 300, 220],
      labelAt: [130, 120],
      leaderAt: [240, 140],
      blurb: "Brightly coloured, scented modified leaves. Their primary function is to attract pollinators like insects and birds, guiding them towards the reproductive organs.",
    },
    {
      id: "sepal",
      label: "Sepal",
      tint: T.sepal,
      depth: 1,
      d: [
        smoothClosed([ [330, 280], [250, 300], [220, 340], [300, 320] ]),
        smoothClosed([ [330, 280], [410, 300], [440, 340], [360, 320] ]),
      ].join(" "),
      layers: [
        { d: "M250,310 L300,300 M410,310 L360,300", as: "shade" },
        { d: gleam(270, 310, 20, 15), as: "light", opacity: 0.3 },
        { d: gleam(390, 310, 20, 15), as: "light", opacity: 0.3 }
      ],
      focus: [220, 280, 220, 60],
      labelAt: [150, 330],
      leaderAt: [260, 310],
      blurb: "Green, leaf-like structures that form the outermost whorl. They protect the delicate inner parts of the flower during the bud stage before it blossoms.",
    },
    {
      id: "stigma",
      label: "Stigma",
      tint: T.pistil,
      depth: 2,
      d: blob(330, 120, 25, 12, [1, 0.95, 1.05, 0.95]),
      layers: [
        { d: ellipse(330, 120, 15, 6), as: "shade" },
        { d: gleam(330, 116, 10, 4), as: "light", opacity: 0.5 },
        { d: dots([[325,120], [330,118], [335,121], [328,122], [332,120]], 1.5), as: "light" }
      ],
      focus: [305, 108, 50, 24],
      labelAt: [500, 120],
      leaderAt: [345, 120],
      blurb: "The sticky, receptive tip of the pistil. It acts as a landing pad for pollen grains carried by wind or insects, capturing them to start fertilisation.",
    },
    {
      id: "style",
      label: "Style",
      tint: T.pistil,
      depth: 1,
      d: roundRect(324, 132, 12, 108, 6),
      layers: [
        { d: gleam(330, 186, 4, 100), as: "light", opacity: 0.4 },
        { d: roundRect(329, 132, 2, 108, 1), as: "shade" }
      ],
      focus: [324, 132, 12, 108],
      labelAt: [500, 180],
      leaderAt: [336, 180],
      blurb: "The slender stalk connecting the stigma to the ovary. After pollen lands on the stigma, a pollen tube grows down through the style to reach the ovule.",
    },
    {
      id: "ovary",
      label: "Ovary",
      tint: T.pistil,
      depth: 2,
      d: blob(330, 270, 35, 30, [1, 1.05, 0.95, 1]),
      layers: [
        { d: gleam(330, 270, 20, 18), as: "light", opacity: 0.4 },
        { d: blob(330, 270, 20, 15, [1, 0.9, 1, 0.9]), as: "panel", clip: true },
        // Ovules inside
        { d: ellipse(320, 270, 6, 8), as: "light", clip: true },
        { d: ellipse(340, 270, 6, 8), as: "light", clip: true }
      ],
      focus: [295, 240, 70, 60],
      labelAt: [500, 270],
      leaderAt: [350, 270],
      blurb: "The swollen base of the pistil containing ovules. After fertilisation, the ovary enlarges and ripens into a fruit, while the ovules inside become seeds.",
    },
    {
      id: "anther",
      label: "Anther",
      tint: T.stamen,
      depth: 2,
      d: [
        blob(260, 150, 15, 20, [1, 0.9, 1.1, 0.95]),
        blob(400, 150, 15, 20, [1, 0.9, 1.1, 0.95])
      ].join(" "),
      layers: [
        { d: "M260,130 L260,170 M400,130 L400,170", as: "shade" },
        { d: gleam(256, 150, 4, 15), as: "light", opacity: 0.5 },
        { d: gleam(396, 150, 4, 15), as: "light", opacity: 0.5 },
        { d: dots([[258,145], [262,150], [257,155], [260,148], [402,145], [398,150], [403,155], [400,148]], 1.5), as: "light" }
      ],
      focus: [245, 130, 30, 40],
      labelAt: [150, 150],
      leaderAt: [255, 150],
      blurb: "The swollen tip of the stamen that produces and stores pollen grains. When mature, it splits open to release the powdery pollen containing male gametes.",
    },
    {
      id: "filament",
      label: "Filament",
      tint: T.stamen,
      depth: 1,
      d: [
        smoothClosed([ [258, 170], [308, 260], [312, 260], [262, 170] ]),
        smoothClosed([ [402, 170], [352, 260], [348, 260], [398, 170] ])
      ].join(" "),
      layers: [
        { d: gleam(285, 215, 2, 80), as: "light", opacity: 0.4 },
        { d: gleam(375, 215, 2, 80), as: "light", opacity: 0.4 }
      ],
      focus: [258, 170, 54, 90],
      labelAt: [150, 210],
      leaderAt: [285, 215],
      blurb: "The thin, thread-like stalk that supports the anther, holding it in an optimal position for wind or insects to pick up the pollen.",
    }
  ],
};

export const maleSystemPlate: FigureSpec = {
  kind: "figure",
  title: "Male Reproductive System",
  figNumber: "Fig. 11.18",
  altText: "Cross section of the human male reproductive system. Selecting parts highlights the testis, scrotum, vas deferens, prostate, seminal vesicle, urethra and penis.",
  viewBox: [660, 500],
  magnify: "part",
  parts: [
    {
      id: "scrotum",
      label: "Scrotum",
      tint: T.maleOrgan,
      depth: 0,
      d: smoothClosed([ [280, 400], [330, 440], [380, 400], [350, 350], [310, 350] ]),
      layers: [
        { d: gleam(330, 410, 30, 20), as: "light", opacity: 0.3 },
        { d: "M300,420 Q330,430 360,420", as: "shade" }
      ],
      focus: [280, 350, 100, 90],
      labelAt: [150, 420],
      leaderAt: [300, 410],
      blurb: "A pouch of skin hanging outside the abdominal cavity. It keeps the testes slightly cooler than normal body temperature, an essential condition for producing healthy sperm.",
    },
    {
      id: "testis",
      label: "Testis",
      tint: T.maleDuct,
      depth: 1,
      d: ellipse(330, 390, 22, 28),
      layers: [
        { d: gleam(330, 390, 12, 18), as: "light", opacity: 0.5 },
        { d: "M315,390 A15,20 0 0,0 345,390", as: "shade" }
      ],
      focus: [308, 362, 44, 56],
      labelAt: [500, 390],
      leaderAt: [350, 390],
      blurb: "Oval-shaped organs that produce sperm cells through meiosis. They also secrete testosterone, the hormone responsible for male puberty changes like facial hair and voice deepening.",
    },
    {
      id: "vas-deferens",
      label: "Vas deferens",
      tint: T.maleDuct,
      depth: 1,
      d: [
        roundRect(326, 180, 8, 182, 4),
        roundRect(326, 180, 44, 8, 4)
      ].join(" "),
      layers: [
        { d: roundRect(328, 182, 4, 180, 2), as: "light", opacity: 0.5 },
        { d: "M326,280 L334,280", as: "shade" }
      ],
      focus: [326, 180, 44, 182],
      labelAt: [150, 280],
      leaderAt: [326, 280],
      blurb: "A muscular tube that transports mature sperm from the testis upwards into the pelvic cavity to mix with fluids before ejaculation.",
    },
    {
      id: "seminal-vesicle",
      label: "Seminal vesicle",
      tint: T.maleOrgan,
      depth: 1,
      d: blob(370, 180, 20, 25, [1, 0.9, 1.05, 0.95]),
      layers: [
        { d: gleam(370, 180, 10, 15), as: "light", opacity: 0.4 },
        { d: "M360,170 Q370,180 380,170", as: "shade" }
      ],
      focus: [350, 155, 40, 50],
      labelAt: [500, 170],
      leaderAt: [385, 170],
      blurb: "Glands that secrete a nutrient-rich fluid. This fluid makes up most of the semen's volume and provides energy to keep the sperm active and swimming.",
    },
    {
      id: "prostate-gland",
      label: "Prostate gland",
      tint: T.maleOrgan,
      depth: 1,
      d: blob(315, 210, 22, 18, [1, 0.9, 1.1, 0.9]),
      layers: [
        { d: gleam(315, 210, 12, 10), as: "light", opacity: 0.4 },
        { d: "M305,210 Q315,220 325,210", as: "shade" }
      ],
      focus: [293, 192, 44, 36],
      labelAt: [500, 210],
      leaderAt: [335, 210],
      blurb: "A walnut-sized gland that surrounds the urethra. It adds an alkaline fluid to semen, which helps protect sperm from the acidic environment of the female reproductive tract.",
    },
    {
      id: "penis",
      label: "Penis",
      tint: T.maleOrgan,
      depth: 0,
      d: smoothClosed([ [290, 250], [310, 250], [310, 380], [290, 380] ]),
      layers: [
        { d: gleam(300, 315, 6, 120), as: "light", opacity: 0.3 },
        { d: "M295,370 Q300,385 305,370", as: "shade" }
      ],
      focus: [290, 250, 20, 130],
      labelAt: [150, 330],
      leaderAt: [290, 330],
      blurb: "The male organ used for urination and sexual intercourse. Spongy tissue inside fills with blood to make it rigid, allowing semen to be deposited in the female tract.",
    },
    {
      id: "urethra",
      label: "Urethra",
      tint: T.maleDuct,
      depth: 1,
      d: roundRect(298, 210, 4, 170, 2),
      layers: [
        { d: roundRect(299, 210, 2, 170, 1), as: "light", opacity: 0.5 },
        { d: roundRect(298, 210, 32, 4, 2), as: "fill" }
      ],
      focus: [298, 210, 4, 170],
      labelAt: [150, 210],
      leaderAt: [300, 210],
      blurb: "A common passage leading through the penis. It serves dual roles, carrying both urine from the bladder and semen from the reproductive glands out of the body.",
    }
  ],
};

export const femaleSystemPlate: FigureSpec = {
  kind: "figure",
  title: "Female Reproductive System",
  figNumber: "Fig. 11.19",
  altText: "Front view of the human female reproductive system. Selecting parts highlights the ovary, fallopian tube, uterus, cervix, vagina, and endometrium.",
  viewBox: [660, 450],
  magnify: "part",
  parts: [
    {
      id: "uterus",
      label: "Uterus",
      tint: T.femaleOrgan,
      depth: 0,
      d: smoothClosed([ [330, 280], [260, 120], [400, 120] ]),
      layers: [
        { d: gleam(330, 200, 40, 50), as: "light", opacity: 0.3 },
        { d: "M280,140 Q330,160 380,140", as: "shade" }
      ],
      focus: [260, 120, 140, 160],
      labelAt: [200, 150],
      leaderAt: [280, 150],
      blurb: "A muscular, bag-like organ where a fertilised egg implants and develops into a foetus. During childbirth, its strong muscles contract to push the baby out.",
    },
    {
      id: "endometrium",
      label: "Uterine lining",
      tint: T.femaleDuct,
      depth: 1,
      d: smoothClosed([ [330, 270], [275, 130], [385, 130] ]),
      layers: [
        { d: "M290,140 Q330,250 370,140", as: "shade", width: 2 },
        { d: gleam(330, 200, 20, 30), as: "light", opacity: 0.3 }
      ],
      focus: [275, 130, 110, 140],
      labelAt: [480, 200],
      leaderAt: [370, 200],
      blurb: "The inner wall of the uterus that thickens with blood vessels each month. If fertilisation occurs, it nourishes the embryo; if not, it sheds during menstruation.",
    },
    {
      id: "ovary",
      label: "Ovary",
      tint: T.femaleOrgan,
      depth: 1,
      d: [
        ellipse(200, 150, 22, 16),
        ellipse(460, 150, 22, 16)
      ].join(" "),
      layers: [
        { d: gleam(200, 150, 12, 8), as: "light", opacity: 0.5 },
        { d: gleam(460, 150, 12, 8), as: "light", opacity: 0.5 },
        { d: dots([[195,145], [205,155], [198,152], [455,145], [465,155], [458,152]], 2), as: "shade" }
      ],
      focus: [178, 134, 44, 32],
      labelAt: [150, 180],
      leaderAt: [185, 160],
      blurb: "A pair of organs that store and release eggs (ova). They also produce female hormones like oestrogen, which coordinate the menstrual cycle and pregnancy.",
    },
    {
      id: "fallopian-tube",
      label: "Fallopian tube",
      tint: T.femaleDuct,
      depth: 1,
      d: [
        smoothClosed([ [260, 116], [200, 126], [200, 134], [260, 124] ]),
        smoothClosed([ [400, 116], [460, 126], [460, 134], [400, 124] ])
      ].join(" "),
      layers: [
        { d: smoothClosed([ [260, 118], [200, 128], [200, 132], [260, 122] ]), as: "light", opacity: 0.5 },
        { d: smoothClosed([ [400, 118], [460, 128], [460, 132], [400, 122] ]), as: "light", opacity: 0.5 },
        { d: "M210,130 A15,15 0 0,0 190,130", as: "shade" },
        { d: "M450,130 A15,15 0 0,1 470,130", as: "shade" }
      ],
      focus: [200, 116, 60, 22],
      labelAt: [150, 100],
      leaderAt: [230, 125],
      blurb: "Tubes connecting the ovaries to the uterus. When an egg is released, it travels through this tube. This is typically where fertilisation by a sperm occurs.",
    },
    {
      id: "cervix",
      label: "Cervix",
      tint: T.femaleOrgan,
      depth: 1,
      d: roundRect(315, 280, 30, 20, 4),
      layers: [
        { d: gleam(330, 290, 15, 8), as: "light", opacity: 0.3 },
        { d: "M330,280 L330,300", as: "shade" }
      ],
      focus: [315, 280, 30, 20],
      labelAt: [480, 290],
      leaderAt: [345, 290],
      blurb: "The narrow lower portion of the uterus that connects to the vagina. It acts as a gateway, dilating widely during childbirth to let the baby pass through.",
    },
    {
      id: "vagina",
      label: "Vagina",
      tint: T.femaleDuct,
      depth: 0,
      d: roundRect(320, 300, 20, 80, 10),
      layers: [
        { d: roundRect(326, 300, 8, 80, 4), as: "light", opacity: 0.4 },
        { d: "M320,340 Q330,350 340,340 M320,360 Q330,370 340,360", as: "shade" }
      ],
      focus: [320, 300, 20, 80],
      labelAt: [480, 350],
      leaderAt: [340, 350],
      blurb: "A muscular canal leading from the cervix to the outside of the body. It receives sperm during intercourse and serves as the birth canal during delivery.",
    }
  ],
};

export const animalReproductionPlate: FigureSpec = {
  kind: "figure",
  title: "External vs Internal Fertilisation",
  figNumber: "Fig. 11.17",
  altText: "Comparison of external fertilisation in water and internal fertilisation inside an animal body.",
  viewBox: [660, 450],
  magnify: "camera",
  panels: [
    { id: "external", caption: "(a) External fertilisation (e.g. fish)", box: [0, 0, 330, 420] },
    { id: "internal", caption: "(b) Internal fertilisation (e.g. mammals)", box: [330, 0, 330, 420] }
  ],
  parts: [
    {
      id: "female-fish",
      label: "Female Fish",
      tint: T.femaleOrgan,
      panel: "external",
      depth: 0,
      d: blob(100, 150, 60, 30, [1, 1.2, 0.8, 1]) + " M30,150 L10,130 L10,170 Z",
      layers: [
        { d: "M70,145 A5,5 0 1,1 80,145", as: "shade" }
      ],
      focus: [10, 120, 150, 60],
      labelAt: [100, 80],
      leaderAt: [100, 130],
      blurb: "Releases a very large number of eggs directly into the surrounding water. This requires an aquatic environment to ensure the gametes do not quickly dry out before fertilisation.",
    },
    {
      id: "water-eggs",
      label: "Eggs in Water",
      tint: T.femaleDuct,
      panel: "external",
      depth: 1,
      d: [
        circle(180, 200, 8), circle(210, 190, 8), circle(200, 220, 8),
        circle(240, 210, 8), circle(230, 240, 8), circle(260, 230, 8)
      ].join(" "),
      layers: [
        { d: dots([[180,200], [210,190], [200,220], [240,210], [230,240], [260,230]], 3), as: "shade" }
      ],
      focus: [170, 180, 100, 70],
      labelAt: [220, 130],
      leaderAt: [210, 190],
      blurb: "Hundreds or thousands of eggs are released at once. They are highly vulnerable to aquatic predators and environmental changes, so producing massive numbers ensures at least a few survive.",
    },
    {
      id: "water-sperm",
      label: "Swimming Sperm",
      tint: T.maleDuct,
      panel: "external",
      depth: 2,
      d: [
        circle(280, 180, 4), circle(270, 200, 4), circle(290, 220, 4), circle(260, 250, 4)
      ].join(" "),
      layers: [
        { d: "M284,180 Q294,185 304,180 M274,200 Q284,205 294,200 M294,220 Q304,225 314,220 M264,250 Q274,255 284,250", as: "stroke" }
      ],
      focus: [250, 170, 70, 90],
      labelAt: [280, 320],
      leaderAt: [270, 250],
      blurb: "The male parent releases thousands of sperm over the eggs in the water. The sperm use their tails to swim through the water and find the eggs by chance.",
    },
    {
      id: "reproductive-tract",
      label: "Female Tract",
      tint: T.femaleOrgan,
      panel: "internal",
      depth: 0,
      d: blob(490, 200, 80, 120, [1, 0.9, 1.1, 0.8]),
      layers: [
        { d: blob(490, 200, 60, 100, [1, 0.9, 1.1, 0.8]), as: "panel", clip: true }
      ],
      focus: [400, 70, 180, 260],
      labelAt: [490, 80],
      leaderAt: [490, 100],
      blurb: "The specialised internal reproductive organs of a terrestrial animal. They provide a safe, moist environment deep inside the body where fertilisation can safely occur without the risk of drying out.",
    },
    {
      id: "protected-egg",
      label: "Protected Egg",
      tint: T.femaleDuct,
      panel: "internal",
      depth: 1,
      d: circle(490, 160, 15),
      layers: [
        { d: circle(490, 160, 6), as: "shade" }
      ],
      focus: [460, 130, 60, 60],
      labelAt: [400, 120],
      leaderAt: [475, 160],
      blurb: "Only one or a very few eggs are produced at a time. Because they remain safely inside the mother, their chances of survival and successful fertilisation are significantly higher.",
    },
    {
      id: "internal-sperm",
      label: "Internal Sperm",
      tint: T.maleDuct,
      panel: "internal",
      depth: 2,
      d: circle(490, 240, 4) + " " + circle(505, 220, 4) + " " + circle(475, 210, 4),
      layers: [
        { d: "M490,244 Q490,254 485,264 M505,224 Q505,234 500,244 M475,214 Q475,224 470,234", as: "stroke" }
      ],
      focus: [460, 190, 60, 90],
      labelAt: [500, 280],
      leaderAt: [505, 220],
      blurb: "Sperm are deposited directly into the female's reproductive tract during mating. They must swim a short distance through this highly protected environment to successfully reach and fertilise the egg.",
    }
  ]
};

export const zygoteEmbryoPlate: FigureSpec = {
  kind: "figure",
  title: "From Zygote to Embryo",
  figNumber: "Fig. 11.20",
  altText: "Stages of early human development from a single-celled zygote to a multi-celled embryo.",
  viewBox: [660, 300],
  magnify: "part",
  parts: [
    {
      id: "zygote",
      label: "1. Zygote",
      tint: T.petal,
      depth: 0,
      d: cell(100, 150, 30, 30, 1),
      layers: [
        { d: circle(100, 150, 8), as: "shade" }
      ],
      focus: [60, 110, 80, 80],
      labelAt: [100, 80],
      leaderAt: [100, 120],
      blurb: "The single fertilised cell formed by the successful fusion of sperm and egg. It contains one diploid nucleus that holds the complete genetic blueprint inherited from both biological parents.",
    },
    {
      id: "two-cell",
      label: "2. Two Cells",
      tint: T.pistil,
      depth: 0,
      d: cell(215, 150, 16, 28, 2) + " " + cell(245, 150, 16, 28, 3),
      layers: [
        { d: circle(215, 150, 5) + " " + circle(245, 150, 5), as: "shade" }
      ],
      focus: [190, 110, 80, 80],
      labelAt: [230, 240],
      leaderAt: [230, 180],
      blurb: "About thirty hours after fertilisation occurs, the zygote completes its first major mitotic division. This process, known as cleavage, evenly splits the original single cell into two identical daughter cells.",
    },
    {
      id: "four-cell",
      label: "3. Four Cells",
      tint: T.pistil,
      depth: 0,
      d: [
        cell(345, 135, 16, 16, 4), cell(375, 135, 16, 16, 5),
        cell(345, 165, 16, 16, 6), cell(375, 165, 16, 16, 7)
      ].join(" "),
      layers: [
        { d: [circle(345,135,4), circle(375,135,4), circle(345,165,4), circle(375,165,4)].join(" "), as: "shade" }
      ],
      focus: [320, 110, 80, 80],
      labelAt: [360, 80],
      leaderAt: [360, 120],
      blurb: "The two cells divide again to form four cells. During these early divisions, the overall size of the embryo does not increase; the individual cells simply become smaller each time.",
    },
    {
      id: "morula",
      label: "4. Morula",
      tint: T.pistil,
      depth: 0,
      d: cell(490, 150, 32, 32, 8),
      layers: [
        { d: cell(490, 150, 32, 32, 8), as: "panel", clip: true },
        { d: [
            circle(475, 135, 10), circle(495, 130, 10), circle(510, 140, 10),
            circle(470, 155, 10), circle(490, 150, 10), circle(510, 160, 10),
            circle(480, 170, 10), circle(500, 170, 10)
          ].join(" "), as: "shade", opacity: 0.5, clip: true },
        { d: dots([[475,135], [495,130], [510,140], [470,155], [490,150], [510,160], [480,170], [500,170]], 2), as: "fill" }
      ],
      focus: [450, 110, 80, 80],
      labelAt: [490, 240],
      leaderAt: [490, 180],
      blurb: "After several days of continuous division, the embryo becomes a tightly packed, solid ball of sixteen to thirty-two cells. At this stage, it is called a morula because it resembles a mulberry.",
    },
    {
      id: "implanted-embryo",
      label: "5. Implantation",
      tint: T.femaleOrgan,
      depth: -1,
      d: blob(600, 150, 50, 80, [1, 0.9, 1.1, 0.9]),
      layers: [
        { d: blob(600, 150, 50, 80, [1, 0.9, 1.1, 0.9]), as: "panel", clip: true },
        { d: cell(590, 150, 20, 20, 9), as: "fill", tint: T.femaleDuct, clip: true },
        { d: circle(590, 150, 12), as: "panel", clip: true },
        { d: circle(585, 145, 5), as: "shade", tint: T.femaleDuct, clip: true }
      ],
      focus: [540, 60, 120, 180],
      labelAt: [560, 60],
      labelAlign: "end",
      leaderAt: [590, 130],
      blurb: "The embryo arrives in the uterus as a hollow ball of cells called a blastocyst. It then burrows deeply into the thickened uterine lining to secure a permanent nutrient supply.",
    }
  ]
};

export const menstrualCyclePlate: FigureSpec = {
  kind: "figure",
  title: "The Menstrual Cycle",
  figNumber: "Fig. 11.21",
  altText: "Diagram showing the stages of the menstrual cycle: menstruation, thickening lining, and ovulation.",
  viewBox: [660, 450],
  magnify: "camera",
  panels: [
    { id: "p1", caption: "(a) Menstruation", box: [0, 0, 220, 420] },
    { id: "p2", caption: "(b) Thickening & Ovulation", box: [220, 0, 220, 420] },
    { id: "p3", caption: "(c) Prepared Lining", box: [440, 0, 220, 420] }
  ],
  parts: [
    {
      id: "uterus-menstruating",
      label: "Uterus",
      tint: T.femaleOrgan,
      panel: "p1",
      depth: 0,
      d: blob(110, 200, 60, 80, [1, 1.1, 0.9, 1]),
      layers: [
        { d: blob(110, 200, 55, 75, [1, 1.1, 0.9, 1]), as: "panel", clip: true }
      ],
      focus: [40, 110, 140, 180],
      labelAt: [110, 90],
      leaderAt: [110, 130],
      blurb: "The main muscular body of the uterus during the very start of the menstrual cycle. Without a fertilised egg, the previous cycle's extensive blood-vessel preparations are absolutely no longer needed.",
    },
    {
      id: "shedding-lining",
      label: "Shedding Lining",
      tint: T.femaleDuct,
      panel: "p1",
      depth: 1,
      d: blob(110, 240, 20, 40, [1, 0.9, 1.1, 0.9]),
      layers: [
        { d: circle(110, 300, 4) + " " + circle(100, 315, 3) + " " + circle(120, 310, 4), as: "fill" }
      ],
      focus: [70, 190, 80, 150],
      labelAt: [150, 360],
      leaderAt: [110, 250],
      blurb: "The heavily thickened inner lining, called the endometrium, breaks down and slowly sheds. It flows out through the vagina as blood and tissue, marking the beginning of a period.",
    },
    {
      id: "ovary-ovulating",
      label: "Ovary",
      tint: T.femaleOrgan,
      panel: "p2",
      depth: 0,
      d: blob(280, 150, 25, 20, [1, 0.95, 1.05, 0.95]),
      layers: [
        { d: circle(290, 150, 8), as: "shade" }
      ],
      focus: [240, 110, 80, 80],
      labelAt: [280, 90],
      leaderAt: [280, 130],
      blurb: "One of the female's two ovaries begins preparing a completely new follicle. Around day fourteen of the monthly cycle, it ruptures and releases a fully mature egg into the oviduct.",
    },
    {
      id: "released-egg",
      label: "Released Egg",
      tint: T.femaleDuct,
      panel: "p2",
      depth: 1,
      d: circle(320, 160, 6),
      layers: [
        { d: "M295,155 L310,160", as: "stroke", dash: "2 2" }
      ],
      focus: [300, 140, 40, 40],
      labelAt: [380, 160],
      leaderAt: [326, 160],
      blurb: "The newly released mature egg, or ovum, slowly travels down the oviduct towards the uterus. This represents the brief biological window during which successful fertilisation by a sperm can occur.",
    },
    {
      id: "thickening-lining",
      label: "Thickening Lining",
      tint: T.femaleDuct,
      panel: "p2",
      depth: 0,
      d: blob(330, 200, 60, 80, [1, 1.1, 0.9, 1]),
      layers: [
        { d: blob(330, 200, 45, 65, [1, 1.1, 0.9, 1]), as: "panel", clip: true },
        { d: blob(330, 200, 45, 65, [1, 1.1, 0.9, 1]), as: "shade", clip: true, opacity: 0.3 }
      ],
      focus: [260, 110, 140, 180],
      labelAt: [330, 330],
      leaderAt: [330, 250],
      blurb: "At exactly the same time as the egg matures, rising hormone levels cause the uterus to start building up a brand new inner lining, densely packed with fresh blood vessels.",
    },
    {
      id: "prepared-lining",
      label: "Prepared Endometrium",
      tint: T.femaleDuct,
      panel: "p3",
      depth: 0,
      d: blob(550, 200, 60, 80, [1, 1.1, 0.9, 1]),
      layers: [
        { d: blob(550, 200, 30, 50, [1, 1.1, 0.9, 1]), as: "panel", clip: true },
        { d: "M510,180 Q530,200 550,180 M510,220 Q530,240 550,220 M590,180 Q570,200 550,180 M590,220 Q570,240 550,220", as: "stroke", tint: T.femaleDuct, width: 2, clip: true }
      ],
      focus: [480, 110, 140, 180],
      labelAt: [550, 90],
      leaderAt: [550, 160],
      blurb: "The uterine lining is now fully thickened, highly vascular, and spongy. It acts as a nutrient-rich bed, perfectly prepared to receive and nourish a growing embryo if fertilisation happened.",
    }
  ]
};
