import type { Chapter } from "@/lib/cbse/types";
import {
  mixtureTypesFigure,
  tyndallFigure,
  distillationFigure,
  chromatographyFigure,
  separatingFunnelFigure,
  bloodFigure,
} from "../figures/ch-05";
import type { ParticleModelSpec, } from "@/lib/sim/types";

/* ─── Sim specs ──────────────────────────────────────────────────── */

const pureVsMixtureSim: ParticleModelSpec = {
  kind: "particle-model",
  title: "Pure Substance vs Mixture",
  altText:
    "An interactive particle model showing the difference between a pure substance (identical particles) and a mixture (different particles mixed together).",
  states: [
    {
      id: "pure",
      label: "Pure Substance",
      spread: 0.55,
      energy: 0.3,
      particleSize: 7,
      // One kind of particle only — that uniformity IS the definition.
      species: [{ size: 7, color: "#8fd3f4", share: 1 }],
      blurb:
        "A pure substance consists of only one type of particle throughout. Sugar, salt, and pure water are pure substances.",
    },
    {
      id: "mixture",
      label: "Mixture",
      spread: 0.8,
      energy: 0.5,
      particleSize: 7,
      // Three visibly different particles, physically combined but unchanged.
      species: [
        { size: 7, color: "#8fd3f4", share: 5 },
        { size: 10, color: "#f4796b", share: 2 },
        { size: 5, color: "#ffd166", share: 2 },
      ],
      blurb:
        "A mixture contains two or more pure substances physically combined. The components retain their own properties.",
    }
  ],
  defaultStateId: "pure",
  count: 30,
};


const mixtureTypesSim: ParticleModelSpec = {
  kind: "particle-model",
  title: "Particle View of Mixtures",
  altText:
    "An animated particle model showing the difference between a solution, a colloid, and a suspension. You can switch between states to see how particle size and movement affect the mixture.",
  states: [
    {
      id: "solution",
      label: "Solution",
      spread: 0.8,
      energy: 0.6,
      particleSize: 2,
      // Dispersed solute among the solvent — both far too small to scatter light.
      species: [
        { size: 2, color: "#8fd3f4", share: 4 },
        { size: 2.5, color: "#ffd166", share: 1 },
      ],
      blurb:
        "Particles are extremely small (less than 1 nm) and completely dissolved. They never settle down and do not scatter light. The mixture is perfectly transparent and homogeneous.",
    },
    {
      id: "colloid",
      label: "Colloid",
      spread: 0.6,
      energy: 0.4,
      particleSize: 5,
      // Dispersed droplets big enough to scatter light, suspended in the medium.
      species: [
        { size: 2, color: "#8fd3f4", share: 3 },
        { size: 6, color: "#ffd166", share: 2 },
      ],
      blurb:
        "Particles are larger (1–1000 nm) but still do not settle out. They are large enough to scatter a beam of light (the Tyndall effect) making the mixture appear cloudy.",
    },
    {
      id: "suspension",
      label: "Suspension",
      spread: 0.3,
      energy: 0.1,
      particleSize: 12,
      // Large undissolved grains that will settle out of the medium.
      species: [
        { size: 2, color: "#8fd3f4", share: 3 },
        { size: 13, color: "#c98a5b", share: 2 },
      ],
      blurb:
        "Particles are very large (more than 1000 nm) and heavy. If left undisturbed, they will eventually settle to the bottom due to gravity. The mixture is distinctly heterogeneous.",
    },
  ],
  defaultStateId: "solution",
  count: 30,
};

/* ─── Chapter ────────────────────────────────────────────────────── */

export const ch05Mixtures: Chapter = {
  key: "ch-05-mixtures",
  number: 5,
  title: "Exploring Mixtures and their Separation",
  subject: "science",
  book: "Exploration",
  accent: "#f5b95f",
  summary:
    "From the air you breathe to the lemonade you drink, almost everything is a mixture. Learn how to classify them and separate them into pure substances.",
  estMinutes: 25,

  sections: [
    /* ── S1 ─────────────────────────────────────────────────────── */
    {
      key: "pure-vs-mixture",
      title: "What is a Mixture?",
      eyebrow: "Pure vs Mixed",
      bookRef: "Exploration §5.1",
      body: `In science, the word pure has a very strict meaning: a **pure substance** consists of only one type of particle (atoms or molecules) throughout. Sugar, salt, pure water, and a bar of 24-carat gold are pure substances.

However, most things around you are not pure. The air you breathe is a blend of nitrogen, oxygen, and carbon dioxide. The milk you drink contains water, fat, and proteins. These are **mixtures**. A mixture is formed when two or more pure substances are physically combined, but not chemically bonded together. 

Because they are not chemically bonded, the components of a mixture retain their own properties and can usually be separated by physical methods.

### Types of Mixtures

Mixtures come in two broad categories based on how evenly their components are distributed. A homogeneous mixture is mixed so thoroughly that you cannot see the individual parts.

> A well-stirred mixture of sugar and water is equally sweet in the first and the last sip. Such a mixture is called a homogeneous mixture or a solution.
> — *Exploration*, §5.1

In contrast, **heterogeneous mixtures** are not uniform. The components remain separate, and you can often see the distinct parts with the naked eye. A mixture of sand and iron filings, or oil floating on water, are heterogeneous mixtures.

Mixtures are not limited to combining substances in the same state of matter, either. A fizzy drink mixes gas into a liquid, brass mixes two solid metals together, and fog mixes tiny liquid droplets into a gas. Whatever the combination, the test for whether something counts as a pure substance or a mixture stays the same: does it contain only one kind of particle, or several?`,
      sim: pureVsMixtureSim,
      note: {
        kind: "fact",
        body: "Alloys are mixtures of two or more metals (or a metal and a non-metal). Even though they look like a single solid, they are considered homogeneous mixtures because they show the properties of their constituents.",
      },
    },

    /* ── S2 ─────────────────────────────────────────────────────── */
    {
      key: "solutions",
      title: "Solutions: The Perfect Mix",
      eyebrow: "Homogeneous",
      bookRef: "Exploration §5.2",
      body: `If you stir a spoonful of salt into a glass of water, the salt seemingly disappears. What you have created is a **solution** — a perfectly homogeneous mixture of two or more substances.

Every solution has two parts:
- **Solvent**: The component present in the larger amount, which does the dissolving. In salt water, water is the solvent.
- **Solute**: The component present in the smaller amount, which gets dissolved. In salt water, salt is the solute.

### Properties of a Solution

Solutions have very specific characteristics:
- Their particles are unimaginably small — less than 1 nanometre ($10^{-9}$ metres) in diameter.
- Because the particles are so small, they do not scatter light passing through the solution. If you shine a laser pointer through salt water, the beam remains invisible inside the glass.
- The solute particles do not settle down when left undisturbed. A solution is highly stable.
- You cannot separate the solute from the solvent by simple filtration. The salt particles will easily pass right through filter paper.

### Concentration

Not all solutions are the same. A cup of tea with one spoon of sugar is very different from one with five spoons. The **concentration** of a solution describes how much solute is dissolved in a given amount of solvent. 

When a solution has dissolved as much solute as it possibly can at a specific temperature, it is called a **saturated solution**. If you try to add more salt to saturated salt water, it will simply sink to the bottom. Interestingly, if you heat the water, its capacity to dissolve solid solutes usually increases.`,
      note: {
        kind: "remember",
        body: "Solutions are not always liquids. Air is a gaseous solution (gas in gas). Alloys like steel are solid solutions (solid in solid) — the state of matter of a solution matches whichever component is its solvent.",
      },
    },

    /* ── S3 ─────────────────────────────────────────────────────── */
    {
      key: "suspensions-colloids",
      figures: [mixtureTypesFigure, tyndallFigure],
      title: "Suspensions and Colloids",
      eyebrow: "Heterogeneous",
      bookRef: "Exploration §5.4",
      body: `Not all mixtures mix perfectly. When you stir chalk powder into water, the water turns milky white. The chalk does not dissolve; instead, its particles remain suspended in the water. This is a **suspension**.

### Suspensions
A suspension is a heterogeneous mixture containing large solid particles (greater than 1000 nm in diameter). 
- You can easily see the particles with the naked eye.
- The particles are heavy enough that if you leave the mixture undisturbed, they will eventually settle to the bottom due to gravity.
- Because the particles are large, you can easily separate them from the liquid using filter paper.

### Colloids: The In-Between
Between the perfectly clear solutions and the chunky suspensions lies a tricky category: **colloids**. Milk, fog, and blood are colloids. 

To the naked eye, milk looks completely uniform, like a homogeneous solution. But if you look at it under a microscope, you will see tiny droplets of fat suspended in water. A colloid is actually heterogeneous. Its particles are larger than those in a solution but smaller than those in a suspension (between 1 and 1000 nm). 

Because colloidal particles are small, they do not settle down when left undisturbed. They pass right through standard filter paper. However, they are just large enough to scatter a beam of light. If you shine a torch through a glass of milk in a dark room, you will see the path of the light beam clearly illuminated inside the glass. This scattering of light by colloidal particles is called the **Tyndall effect**.`,
      sim: mixtureTypesSim,
      note: {
        kind: "exam-tip",
        body: "The Tyndall effect is the definitive test for a colloid. Solutions never show the Tyndall effect because their particles are too small to scatter light.",
      },
    },

    /* ── S4 ─────────────────────────────────────────────────────── */
    {
      key: "separation-physical",
      figures: [bloodFigure],
      title: "Separating Solid Mixtures",
      eyebrow: "Sorting it out",
      bookRef: "Exploration §5.4",
      body: `Because mixtures are not chemically bonded, we can separate them back into pure substances using their physical properties — like size, density, boiling point, or magnetic nature.

### Hand-picking and Sieving
The simplest methods rely on visual differences. If you have a mixture of rice and small stones, you can use **hand-picking** to remove the stones. If you have a mixture of fine flour and coarse wheat bran, passing them through a mesh screen (**sieving**) easily separates them by size.

### Magnetic Separation
If one component of a mixture is magnetic, separation is trivial. A mixture of sulfur powder and iron filings can be completely separated by dragging a strong magnet over the mixture; the iron filings will leap to the magnet, leaving the sulfur behind.

### Winnowing
Farmers use another simple physical trick to separate grain from lighter husk after threshing: **winnowing**. The mixture is dropped from a height in front of a breeze, or an electric fan. The heavier grain falls almost straight down, while the lighter husk is carried further away by the moving air, letting the two settle into separate piles.

### Sublimation
Most solids melt into a liquid when heated. However, a few substances — like camphor, naphthalene, and dry ice (solid carbon dioxide) — skip the liquid phase entirely and turn directly into a gas. This is called **sublimation**.

If you have a mixture of common salt and naphthalene, heating it gently will cause the naphthalene to sublime into a vapour. The vapour can then be collected on a cool surface, where it undergoes **deposition** (turning back into a solid), leaving the perfectly clean salt behind in the heating dish.`,
    },

    /* ── S5 ─────────────────────────────────────────────────────── */
    {
      key: "separation-liquids",
      sim: distillationFigure,
      figures: [separatingFunnelFigure],
      title: "Separating Liquids",
      eyebrow: "Evaporation & Distillation",
      bookRef: "Exploration §5.3",
      body: `Separating a solid dissolved in a liquid, or two liquids mixed together, requires more advanced techniques.

### Evaporation and Crystallization
If you want to recover salt from seawater, you can simply heat the mixture in an open dish. The water evaporates into the air, leaving the solid salt behind. This is **evaporation**.

However, evaporation can sometimes burn the solid or leave impurities behind. A better method for obtaining highly pure solids is **crystallization**. You first make a hot, saturated solution of the impure substance, filter it, and then allow it to cool slowly. As the liquid cools, its ability to hold the solute drops, and pure, geometrically perfect crystals of the solid begin to form.

### Distillation
Evaporation loses the liquid. What if you want to keep both the salt and the water? You use **distillation**. The mixture is heated in a closed flask until the liquid boils. The vapour is then routed through a long cooling tube called a condenser, where it turns back into a pure liquid and drips into a collection flask.

Distillation is also used to separate two miscible liquids (liquids that mix perfectly, like water and acetone), provided their boiling points differ by at least $25°$ C. The liquid with the lower boiling point turns to vapour first, leaving the other behind.

### Separating Funnel
What about immiscible liquids — liquids that refuse to mix, like oil and water? If you pour them into a **separating funnel** and let them stand, they separate into two distinct layers based on their densities. The heavier liquid (water) sinks to the bottom. You can then carefully open the stopcock at the bottom to drain the water out, closing it just before the oil escapes.`,
      note: {
        kind: "watch-out",
        body: "Distillation separates miscible liquids, based on differing boiling points. A separating funnel separates immiscible liquids, based on differing density. Do not confuse the two — they solve entirely different problems.",
      },
    },

    /* ── S6 ─────────────────────────────────────────────────────── */
    {
      key: "centrifugation-chromatography",
      figures: [chromatographyFigure],
      title: "Advanced Separation",
      eyebrow: "High-tech sorting",
      bookRef: "Exploration §5.3",
      body: `Sometimes particles are too small to be separated by standard filtration, or you need to separate extremely complex mixtures like the pigments in ink. 

### Centrifugation
If you try to filter milk, the fat droplets pass right through the paper. To separate them, dairies use **centrifugation**. The milk is placed in a machine called a centrifuge, which spins it at incredibly high speeds. The rapid spinning creates a powerful outward force. The denser, heavier particles are forced to the bottom (or outward walls) of the tube, while the lighter particles stay near the top. This is exactly how cream is separated from milk.

### Coagulation
In water treatment plants, the water often contains fine clay and organic particles that are too small to settle by gravity. Workers add a chemical coagulant (like alum). This chemical causes the tiny suspended particles to clump together into larger, heavier masses called *floc*. Because they are now heavier, they settle to the bottom rapidly, leaving clear water above.

### Chromatography
Imagine a black ink pen. The black ink is actually a mixture of several different coloured dyes. To separate them, scientists use **paper chromatography**. 

A spot of ink is placed near the bottom of a strip of special filter paper. The very bottom edge of the paper is then dipped in a solvent (like water or alcohol). As the solvent creeps up the paper via capillary action, it dissolves the ink and carries the dyes upward. Because different dyes have different solubilities, they travel up the paper at different speeds. The most soluble dye travels the furthest, while the least soluble stays near the bottom, creating a beautiful separated rainbow of colours.`,
    },
  ],

  /* ─── Questions (50 total) ─────────────────────────────────────── */
  questions: [
    // ── MCQ (20) ────────────────────────────────────────────────────
    {
      kind: "mcq",
      prompt: "Which of the following describes a pure substance in science?",
      options: [
        "A material that is clean and safe to eat",
        "A material consisting of only one type of particle throughout",
        "A mixture of two liquids that looks perfectly clear",
        "Any liquid that has been filtered",
      ],
      correct_index: 1,
      model_answer: "In chemistry, a pure substance consists of identical particles (atoms or molecules) with a fixed chemical composition.",
      difficulty: "basic",
      section: "pure-vs-mixture",
    },
    {
      kind: "mcq",
      prompt: "Which of the following is a heterogeneous mixture?",
      options: ["Air", "Sugar dissolved in water", "Brass", "Oil and water"],
      correct_index: 3,
      model_answer: "Oil and water do not mix evenly; they form distinct layers, which is the defining characteristic of a heterogeneous mixture.",
      difficulty: "basic",
      section: "pure-vs-mixture",
    },
    {
      kind: "mcq",
      prompt: "In a sugar water solution, what is the solvent?",
      options: ["Sugar", "Water", "Both sugar and water", "Neither"],
      correct_index: 1,
      model_answer: "The solvent is the component present in the larger amount that does the dissolving. In this case, water dissolves the sugar.",
      difficulty: "basic",
      section: "solutions",
    },
    {
      kind: "mcq",
      prompt: "What is the typical size of particles in a true solution?",
      options: [
        "Greater than 1000 nm",
        "Between 1 nm and 1000 nm",
        "Less than 1 nm",
        "Exactly 500 nm",
      ],
      correct_index: 2,
      model_answer: "Solution particles are extremely small, measuring less than 1 nanometre in diameter, which is why they cannot scatter light.",
      difficulty: "intermediate",
      section: "solutions",
    },
    {
      kind: "mcq",
      prompt: "What happens to a saturated solution of solid salt in water if it is heated?",
      options: [
        "It boils immediately",
        "Salt crystals begin to form",
        "Its capacity to dissolve more salt increases",
        "It turns into a suspension",
      ],
      correct_index: 2,
      model_answer: "Heating a liquid solvent generally increases the solubility of solid solutes, allowing a previously saturated solution to dissolve even more solute.",
      difficulty: "intermediate",
      section: "solutions",
    },
    {
      kind: "mcq",
      prompt: "Which mixture will leave a residue on filter paper when passed through it?",
      options: ["Salt solution", "Suspension of chalk in water", "Sugar solution", "Air"],
      correct_index: 1,
      model_answer: "A suspension has large solid particles (greater than 1000 nm) that cannot pass through the microscopic pores of filter paper.",
      difficulty: "basic",
      section: "suspensions-colloids",
    },
    {
      kind: "mcq",
      prompt: "Which type of mixture exhibits the Tyndall effect?",
      options: ["True solution", "Pure water", "Colloid", "Pure oxygen gas"],
      correct_index: 2,
      model_answer: "Colloidal particles are large enough (1–1000 nm) to scatter a beam of light, making the path of the beam visible.",
      difficulty: "basic",
      section: "suspensions-colloids",
    },
    {
      kind: "mcq",
      prompt: "How does blood classify as a mixture?",
      options: ["It is a pure substance", "It is a true solution", "It is a colloid", "It is a gaseous mixture"],
      correct_index: 2,
      model_answer: "Blood is a colloid; it appears homogeneous to the naked eye but contains cells and proteins suspended in plasma that do not settle rapidly.",
      difficulty: "intermediate",
      section: "suspensions-colloids",
    },
    {
      kind: "mcq",
      prompt: "Which process involves a solid changing directly into a gas without becoming a liquid?",
      options: ["Evaporation", "Condensation", "Sublimation", "Crystallization"],
      correct_index: 2,
      model_answer: "Sublimation is the phase transition where a solid skips the liquid phase and turns directly into a vapour.",
      difficulty: "basic",
      section: "separation-physical",
    },
    {
      kind: "mcq",
      prompt: "Which method is best for separating a mixture of common salt and naphthalene?",
      options: ["Filtration", "Sublimation", "Magnetic separation", "Chromatography"],
      correct_index: 1,
      model_answer: "Naphthalene sublimes upon heating, turning into a gas and leaving the non-sublimable salt behind.",
      difficulty: "intermediate",
      section: "separation-physical",
    },
    {
      kind: "mcq",
      prompt: "Why is crystallization often preferred over simple evaporation for obtaining a pure solid?",
      options: [
        "It is faster",
        "Evaporation might burn the solid or leave soluble impurities behind",
        "Crystallization does not require heat",
        "Evaporation requires expensive equipment",
      ],
      correct_index: 1,
      model_answer: "Evaporation boils the mixture dry, meaning any soluble impurities are left mixed with the solid. Crystallization slowly forms pure geometric crystals, leaving impurities dissolved in the remaining liquid.",
      difficulty: "advanced",
      section: "separation-liquids",
    },
    {
      kind: "mcq",
      prompt: "Distillation is primarily used to separate:",
      options: [
        "A magnetic solid from a non-magnetic solid",
        "Two immiscible liquids",
        "Two miscible liquids with different boiling points",
        "Dyes in a black ink pen",
      ],
      correct_index: 2,
      model_answer: "Distillation separates perfectly mixed (miscible) liquids by boiling off the liquid with the lower boiling point and condensing it.",
      difficulty: "basic",
      section: "separation-liquids",
    },
    {
      kind: "mcq",
      prompt: "Which tool would you use to separate oil and water?",
      options: ["Filter paper", "Centrifuge", "Separating funnel", "Chromatography paper"],
      correct_index: 2,
      model_answer: "Oil and water are immiscible and have different densities. A separating funnel allows you to drain the heavier liquid from the bottom.",
      difficulty: "basic",
      section: "separation-liquids",
    },
    {
      kind: "mcq",
      prompt: "What is the primary principle behind centrifugation?",
      options: [
        "Separation based on boiling points",
        "Separation based on magnetic properties",
        "Rapid spinning forces denser particles to the bottom while lighter particles stay near the top",
        "Different solubilities in a creeping solvent",
      ],
      correct_index: 2,
      model_answer: "Centrifugation uses high-speed rotational force (centripetal/centrifugal effects) to rapidly separate components by density.",
      difficulty: "intermediate",
      section: "centrifugation-chromatography",
    },
    {
      kind: "mcq",
      prompt: "Which technique is used to separate the different coloured dyes in black ink?",
      options: ["Distillation", "Paper chromatography", "Sublimation", "Filtration"],
      correct_index: 1,
      model_answer: "Paper chromatography separates dyes based on how fast they travel up a piece of filter paper when dissolved in a creeping solvent.",
      difficulty: "basic",
      section: "centrifugation-chromatography",
    },
    {
      kind: "mcq",
      prompt: "What is the purpose of adding alum to muddy water during water treatment?",
      options: [
        "To kill bacteria",
        "To cause coagulation, making tiny particles clump together and settle",
        "To evaporate the water",
        "To change the boiling point",
      ],
      correct_index: 1,
      model_answer: "Alum acts as a coagulant, forcing tiny suspended particles to clump into heavier masses (floc) that quickly settle to the bottom.",
      difficulty: "intermediate",
      section: "centrifugation-chromatography",
    },
    {
      kind: "mcq",
      prompt: "Which of the following represents a solid solution?",
      options: ["Muddy water", "Air", "Brass", "Milk"],
      correct_index: 2,
      model_answer: "Brass is an alloy of copper and zinc. It is a completely uniform mixture of two solids, making it a solid solution.",
      difficulty: "intermediate",
      section: "pure-vs-mixture",
    },
    {
      kind: "mcq",
      prompt: "If a solution cannot dissolve any more solute at a given temperature, it is called:",
      options: ["A super solution", "A saturated solution", "An unsaturated solution", "A colloid"],
      correct_index: 1,
      model_answer: "A saturated solution has reached its maximum capacity for dissolving a specific solute at that specific temperature.",
      difficulty: "basic",
      section: "solutions",
    },
    {
      kind: "mcq",
      prompt: "What is the reverse process of sublimation called?",
      options: ["Melting", "Evaporation", "Deposition", "Boiling"],
      correct_index: 2,
      model_answer: "Deposition occurs when a vapour cools and changes directly back into a solid without becoming a liquid first.",
      difficulty: "intermediate",
      section: "separation-physical",
    },
    {
      kind: "mcq",
      prompt: "How are cream and milk separated in a dairy?",
      options: ["By filtration", "By distillation", "By separating funnel", "By centrifugation"],
      correct_index: 3,
      model_answer: "Because the fat droplets are tiny and form a colloid, they cannot be filtered. High-speed centrifugation forces the separation based on density.",
      difficulty: "basic",
      section: "centrifugation-chromatography",
    },

    // ── TRUE/FALSE (10) ─────────────────────────────────────────────
    {
      kind: "truefalse",
      prompt: "A mixture is formed when two or more substances chemically bond together.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — in a mixture, substances are physically combined but NOT chemically bonded, which is why they can be separated by physical methods.",
      difficulty: "basic",
      section: "pure-vs-mixture",
    },
    {
      kind: "truefalse",
      prompt: "Air is a homogeneous mixture.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — clean air is a uniform blend of gases (nitrogen, oxygen, etc.) and is considered a homogeneous gaseous solution.",
      difficulty: "basic",
      section: "pure-vs-mixture",
    },
    {
      kind: "truefalse",
      prompt: "The particles in a solution are large enough to scatter a beam of light.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — solution particles are less than 1 nm in diameter, which is too small to scatter light. Only colloids and suspensions scatter light.",
      difficulty: "intermediate",
      section: "solutions",
    },
    {
      kind: "truefalse",
      prompt: "Suspensions are heterogeneous mixtures where particles settle down if left undisturbed.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — suspension particles are large and heavy (like chalk in water), so gravity pulls them to the bottom over time.",
      difficulty: "basic",
      section: "suspensions-colloids",
    },
    {
      kind: "truefalse",
      prompt: "Colloids appear homogeneous to the naked eye but are actually heterogeneous.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — milk looks perfectly uniform, but a microscope reveals it is a heterogeneous mix of fat droplets suspended in liquid.",
      difficulty: "intermediate",
      section: "suspensions-colloids",
    },
    {
      kind: "truefalse",
      prompt: "A mixture of iron filings and sulfur powder can be separated using a magnet.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — iron is magnetic and will be attracted to the magnet, leaving the non-magnetic sulfur powder behind.",
      difficulty: "basic",
      section: "separation-physical",
    },
    {
      kind: "truefalse",
      prompt: "Distillation is used to separate two immiscible liquids like oil and water.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — a separating funnel is used for immiscible liquids. Distillation is used for miscible liquids with different boiling points.",
      difficulty: "intermediate",
      section: "separation-liquids",
    },
    {
      kind: "truefalse",
      prompt: "During paper chromatography, the dye that is most soluble in the solvent travels the furthest up the paper.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — highly soluble dyes dissolve easily and move rapidly with the creeping solvent, reaching the top of the paper first.",
      difficulty: "advanced",
      section: "centrifugation-chromatography",
    },
    {
      kind: "truefalse",
      prompt: "Centrifugation separates particles based primarily on their boiling points.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — centrifugation separates particles based on their density using rapid rotational force.",
      difficulty: "basic",
      section: "centrifugation-chromatography",
    },
    {
      kind: "truefalse",
      prompt: "Evaporation is the best method for obtaining highly pure, geometrically perfect crystals from a solution.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — crystallization is the best method for this. Evaporation boils the mixture dry and leaves impurities behind with the solid.",
      difficulty: "intermediate",
      section: "separation-liquids",
    },

    // ── MULTI (8) ───────────────────────────────────────────────────
    {
      kind: "multi",
      prompt: "Which of the following are examples of heterogeneous mixtures?",
      options: ["Muddy water", "Salt dissolved in water", "Oil and water", "Brass alloy"],
      correct_indices: [0, 2],
      model_answer: "Muddy water and oil-and-water do not have uniform compositions. Salt water and brass are homogeneous.",
      difficulty: "basic",
      section: "pure-vs-mixture",
    },
    {
      kind: "multi",
      prompt: "Select ALL the true statements about a true solution.",
      options: [
        "It is homogeneous",
        "It shows the Tyndall effect",
        "Particles are smaller than 1 nm",
        "Solute particles settle at the bottom over time",
      ],
      correct_indices: [0, 2],
      model_answer: "Solutions are perfectly homogeneous and their particles (< 1 nm) are too small to settle or scatter light.",
      difficulty: "intermediate",
      section: "solutions",
    },
    {
      kind: "multi",
      prompt: "Which of these mixtures will show the Tyndall effect (scattering of light)?",
      options: ["Sugar water", "Milk", "Fog", "Salt water"],
      correct_indices: [1, 2],
      model_answer: "Milk and fog are colloids, whose particles are large enough (1-1000 nm) to scatter light. Sugar and salt water are true solutions.",
      difficulty: "intermediate",
      section: "suspensions-colloids",
    },
    {
      kind: "multi",
      prompt: "Which of the following substances can undergo sublimation?",
      options: ["Common salt", "Camphor", "Naphthalene", "Sugar", "Dry ice (solid CO2)"],
      correct_indices: [1, 2, 4],
      model_answer: "Camphor, naphthalene, and dry ice all skip the liquid phase and turn directly into gas upon heating.",
      difficulty: "advanced",
      section: "separation-physical",
    },
    {
      kind: "multi",
      prompt: "What conditions are necessary to use distillation for separating two liquids?",
      options: [
        "The liquids must be completely miscible",
        "The liquids must be immiscible",
        "Their boiling points must differ by at least 25°C",
        "They must have different magnetic properties",
      ],
      correct_indices: [0, 2],
      model_answer: "Distillation requires the liquids to be perfectly mixed (miscible) and to have a significant difference in boiling points so one boils off before the other.",
      difficulty: "advanced",
      section: "separation-liquids",
    },
    {
      kind: "multi",
      prompt: "Which methods would be effective for separating a mixture of sand and water?",
      options: ["Filtration", "Decantation (allowing it to settle and pouring off water)", "Sublimation", "Chromatography"],
      correct_indices: [0, 1],
      model_answer: "Sand forms a suspension in water. It can be separated by filtering it, or by simply waiting for it to settle and pouring the water off (decantation).",
      difficulty: "intermediate",
      section: "suspensions-colloids",
    },
    {
      kind: "multi",
      prompt: "Which separation techniques rely primarily on differences in density?",
      options: ["Separating funnel", "Centrifugation", "Distillation", "Sublimation"],
      correct_indices: [0, 1],
      model_answer: "A separating funnel uses gravity to separate liquids by density, and centrifugation uses rotational force to separate particles by density.",
      difficulty: "intermediate",
      section: "centrifugation-chromatography",
    },
    {
      kind: "multi",
      prompt: "Select the properties that correctly describe a colloid.",
      options: [
        "Heterogeneous composition",
        "Particles pass through standard filter paper",
        "Particles settle rapidly due to gravity",
        "Particles scatter light",
      ],
      correct_indices: [0, 1, 3],
      model_answer: "Colloids are heterogeneous, their particles are small enough to pass through filter paper and stay suspended, but large enough to scatter light.",
      difficulty: "advanced",
      section: "suspensions-colloids",
    },

    // ── QUICKFIRE (6) ───────────────────────────────────────────────
    {
      kind: "quickfire",
      prompt: "What is a mixture called when its components are mixed completely uniformly?",
      model_answer: "Homogeneous mixture",
      difficulty: "basic",
      section: "pure-vs-mixture",
    },
    {
      kind: "quickfire",
      prompt: "In a cup of sugary tea, what is the solvent?",
      model_answer: "Water (or tea)",
      difficulty: "basic",
      section: "solutions",
    },
    {
      kind: "quickfire",
      prompt: "What optical phenomenon allows you to see a laser beam passing through a glass of milk?",
      model_answer: "Tyndall effect",
      difficulty: "basic",
      section: "suspensions-colloids",
    },
    {
      kind: "quickfire",
      prompt: "Name the process of a solid turning directly into a gas upon heating.",
      model_answer: "Sublimation",
      difficulty: "basic",
      section: "separation-physical",
    },
    {
      kind: "quickfire",
      prompt: "What piece of glassware is used to separate oil from water?",
      model_answer: "Separating funnel",
      difficulty: "intermediate",
      section: "separation-liquids",
    },
    {
      kind: "quickfire",
      prompt: "What separation technique is used in dairies to skim cream from milk?",
      model_answer: "Centrifugation",
      difficulty: "intermediate",
      section: "centrifugation-chromatography",
    },

    // ── OPEN (6) ────────────────────────────────────────────────────
    {
      kind: "open",
      prompt: "Explain why alloys like brass are classified as mixtures rather than pure chemical compounds.",
      model_answer: "Even though brass appears to be a single solid, the copper and zinc within it are physically mixed, not chemically bonded. Brass retains the properties of both its constituent metals, and its composition can vary (you can have 70% copper or 60% copper), which defines it as a mixture.",
      difficulty: "advanced",
      section: "pure-vs-mixture",
    },
    {
      kind: "open",
      prompt: "Describe the difference between a saturated and an unsaturated solution.",
      model_answer: "At a given temperature, an unsaturated solution is capable of dissolving more solute. A saturated solution has already dissolved the maximum possible amount of solute; any additional solute added will remain solid and settle at the bottom.",
      difficulty: "intermediate",
      section: "solutions",
    },
    {
      kind: "open",
      prompt: "Why does a suspension eventually become clear if left undisturbed on a desk?",
      model_answer: "A suspension contains very large, heavy solid particles (greater than 1000 nm). When left undisturbed, the force of gravity pulls these heavy particles to the bottom of the container, leaving the clear liquid above.",
      difficulty: "intermediate",
      section: "suspensions-colloids",
    },
    {
      kind: "open",
      prompt: "How does crystallization produce a purer solid than simple evaporation?",
      model_answer: "Evaporation boils all the liquid away, meaning any soluble impurities present in the mixture are left behind and mixed into the final solid. Crystallization relies on slow cooling to grow perfect geometric crystals of the desired substance, leaving the impurities dissolved in the remaining liquid.",
      difficulty: "advanced",
      section: "separation-liquids",
    },
    {
      kind: "open",
      prompt: "Explain the principle behind separating miscible liquids using distillation.",
      model_answer: "Distillation relies on the liquids having different boiling points. When the mixture is heated, the liquid with the lower boiling point vaporises first. This vapour is collected, routed through a cooling condenser, and turned back into a pure liquid, leaving the liquid with the higher boiling point behind in the heating flask.",
      difficulty: "intermediate",
      section: "separation-liquids",
    },
    {
      kind: "open",
      prompt: "Describe how paper chromatography separates the different dyes present in black ink.",
      model_answer: "A spot of ink is placed on filter paper, and the edge of the paper is dipped in a solvent. As capillary action draws the solvent up the paper, it dissolves the ink. Different dyes have different solubilities in the solvent; highly soluble dyes travel fast and far up the paper, while less soluble dyes lag behind, separating the colours.",
      difficulty: "advanced",
      section: "centrifugation-chromatography",
    },
  ],
};
