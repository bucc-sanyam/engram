import type { FigureSpec } from "@/lib/sim/types";
import {
  circle,
  ellipse,
  dots,
  blob,
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
        tubule(310, 150, 270, 80, 8),
        tubule(325, 140, 310, 60, 8),
        tubule(340, 140, 360, 50, 8),
        tubule(355, 150, 410, 70, 8),
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
      d: tubule(358, 300, 420, 280, 22),
      layers: [
        { d: gleam(389, 290, 8, 30), as: "light", opacity: 0.4 },
        { d: tubule(420, 280, 440, 260, 4), as: "light" },
        { d: tubule(420, 280, 445, 285, 4), as: "light" },
        { d: tubule(420, 280, 435, 305, 4), as: "light" }
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
      d: tubule(330, 132, 330, 240, 12),
      layers: [
        { d: gleam(330, 186, 4, 100), as: "light", opacity: 0.4 },
        { d: tubule(330, 132, 330, 240, 2), as: "shade" }
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
        tubule(260, 170, 310, 260, 4),
        tubule(400, 170, 350, 260, 4)
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
      d: tubule(330, 362, 330, 200, 8),
      layers: [
        { d: tubule(330, 362, 330, 200, 4), as: "light", opacity: 0.5 },
        { d: "M326,280 L334,280", as: "shade" }
      ],
      focus: [326, 200, 8, 162],
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
      d: blob(330, 210, 22, 18, [1, 0.9, 1.1, 0.9]),
      layers: [
        { d: gleam(330, 210, 12, 10), as: "light", opacity: 0.4 },
        { d: "M320,210 Q330,220 340,210", as: "shade" }
      ],
      focus: [308, 192, 44, 36],
      labelAt: [500, 210],
      leaderAt: [350, 210],
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
      d: tubule(300, 210, 300, 380, 4),
      layers: [
        { d: tubule(300, 210, 300, 380, 1), as: "light", opacity: 0.5 },
        { d: "M300,210 L330,210", as: "fill" }
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
        tubule(260, 120, 200, 130, 8),
        tubule(400, 120, 460, 130, 8)
      ].join(" "),
      layers: [
        { d: tubule(260, 120, 200, 130, 4), as: "light", opacity: 0.5 },
        { d: tubule(400, 120, 460, 130, 4), as: "light", opacity: 0.5 },
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
      d: tubule(330, 300, 330, 380, 20),
      layers: [
        { d: tubule(330, 300, 330, 380, 8), as: "light", opacity: 0.4 },
        { d: "M320,340 Q330,350 340,340 M320,360 Q330,370 340,360", as: "shade" }
      ],
      focus: [320, 300, 20, 80],
      labelAt: [480, 350],
      leaderAt: [340, 350],
      blurb: "A muscular canal leading from the cervix to the outside of the body. It receives sperm during intercourse and serves as the birth canal during delivery.",
    }
  ],
};
