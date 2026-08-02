import type { Chapter } from "@/lib/cbse/types";
import type { WorkedExampleSpec } from "@/lib/sim/types";
import {
  bacterialCellFigure,
  plantCellFigure,
  animalCellFigure,
  nucleusFigure,
  mitochondrionFigure,
  chloroplastFigure,
  membraneFigure,
  mitosisFigure,
  microscopeFigure,
} from "../figures/ch-02";

/* ─── Sim specs ──────────────────────────────────────────────────── */

const cellSizeSim: WorkedExampleSpec = {
  kind: "worked-example",
  title: "Estimating Cell Size",
  altText:
    "A worked example that calculates the approximate size of a cell from the microscope's field of view and the number of cells counted across it. Adjust the sliders to see the calculation update.",
  inputs: [
    {
      id: "fieldDiameter",
      label: "Field of view diameter",
      min: 1,
      max: 10,
      step: 0.5,
      default: 5,
      unit: "mm",
    },
    {
      id: "cellCount",
      label: "Cells along the diameter",
      min: 5,
      max: 50,
      step: 1,
      default: 25,
    },
  ],
  steps: [
    {
      explain: "Convert the field diameter from mm to micrometres (1 mm = 1000 µm).",
      compute: (v) =>
        `${v.fieldDiameter} mm × 1000 = ${v.fieldDiameter * 1000} µm`,
    },
    {
      explain: "Divide by the number of cells to get the estimated size of one cell.",
      compute: (v) =>
        `${v.fieldDiameter * 1000} µm ÷ ${v.cellCount} = ${(
          (v.fieldDiameter * 1000) /
          v.cellCount
        ).toFixed(1)} µm`,
    },
  ],
  result: (v) =>
    `Estimated cell size ≈ ${((v.fieldDiameter * 1000) / v.cellCount).toFixed(
      1,
    )} µm`,
};

const chromosomeSim: WorkedExampleSpec = {
  kind: "worked-example",
  title: "Chromosomes after Division",
  altText:
    "A worked example comparing mitosis and meiosis. Adjust the starting chromosome count and see how many chromosomes each daughter cell receives in each type of division.",
  inputs: [
    {
      id: "parentChromosomes",
      label: "Chromosomes in parent cell (2n)",
      min: 4,
      max: 46,
      step: 2,
      default: 46,
    },
  ],
  steps: [
    {
      explain:
        "In mitosis the entire set is copied, then the cell splits once into two identical daughter cells.",
      compute: (v) =>
        `Each daughter cell: ${v.parentChromosomes} chromosomes (same as parent)`,
    },
    {
      explain:
        "In meiosis the cell divides twice, halving the chromosome number to produce four gametes.",
      compute: (v) =>
        `Each gamete: ${v.parentChromosomes} ÷ 2 = ${
          v.parentChromosomes / 2
        } chromosomes`,
    },
    {
      explain:
        "When two gametes fuse during fertilisation, the full count is restored.",
      compute: (v) =>
        `Zygote: ${v.parentChromosomes / 2} + ${v.parentChromosomes / 2} = ${
          v.parentChromosomes
        } chromosomes`,
    },
  ],
  result: (v) =>
    `Mitosis: 2 cells × ${v.parentChromosomes} each | Meiosis: 4 cells × ${
      v.parentChromosomes / 2
    } each`,
};

/* ─── Chapter ────────────────────────────────────────────────────── */

export const ch02Cell: Chapter = {
  key: "ch-02-cell",
  number: 2,
  title: "Cell: The Building Block of Life",
  subject: "science",
  book: "Exploration",
  accent: "#43d6b5",
  summary: "Every living organism is built from cells — discover how these tiny units carry out the processes of life.",
  estMinutes: 18,

  sections: [
    /* ── S1 ─────────────────────────────────────────────────────── */
    {
      key: "what-a-cell-is",
      title: "The Cell — Where Life Begins",
      eyebrow: "The idea",
      bookRef: "Exploration §2.1",
      body: `Think about the most complex machine you have ever seen — a car engine, perhaps, or a smartphone. Now consider that every living thing, from the tiniest pond bacterium to a full-grown banyan tree, is assembled from units far more intricate than any machine. Those units are **cells**.

A cell is the smallest structure that can independently carry out all the activities we associate with life: taking in nutrients, releasing energy, growing, and reproducing. Some organisms manage everything with a single cell — bacteria and yeast are good examples. Others, like you, are built from trillions of cells that specialise and cooperate.

### How do we see them?

Most cells are far too small for the unaided eye. The limit of resolution of human vision is roughly 0.1 mm; a typical plant or animal cell is only 10–100 µm across (1 µm = 0.001 mm). Robert Hooke was the first person to observe cells in 1665, using a simple microscope he built himself. Looking at a thin slice of cork, he saw rows of tiny box-like compartments and called them *cells*.

Today, school laboratories use **compound light microscopes** with two lenses — an objective and an eyepiece — whose magnifying powers multiply together. A 10× eyepiece paired with a 40× objective gives 400× total magnification, enough to see individual cells clearly. For even finer detail, scientists use **electron microscopes**, which fire a beam of electrons instead of light and can reveal structures at the nanometre scale.

### From cell to organism

Cells rarely work alone in multicellular organisms. Similar cells group together to form **tissues** (you will meet these in Chapter 3). Different tissues combine into **organs**, and organs coordinate as **organ systems** — for instance, your nasal cavity, trachea and lungs form the respiratory system.

Yet no matter how many levels of organisation sit above it, the cell remains the fundamental unit of structure and function in every living thing. Understanding the cell, therefore, is the first step toward understanding life itself.`,
      sim: microscopeFigure,
      figures: [bacterialCellFigure, plantCellFigure, animalCellFigure],
      note: {
        kind: "fact",
        body: "Robert Hooke coined the word 'cell' in 1665 because the tiny compartments he saw in cork reminded him of the small rooms (cellae) in a monastery.",
      },
    },

    /* ── S2 ─────────────────────────────────────────────────────── */
    {
      key: "cell-boundary",
      title: "The Cell Membrane",
      eyebrow: "Boundaries",
      bookRef: "Exploration §2.2",
      body: `Every cell is wrapped in an incredibly thin layer called the **cell membrane** (or plasma membrane). At only 7–10 nanometres thick, it is roughly a thousand times thinner than a sheet of paper, yet it performs one of the most critical jobs in biology: deciding what enters and what leaves the cell.

### Selective permeability

The cell membrane is **selectively permeable**. Small, uncharged molecules like water and oxygen slip through relatively easily, while larger or charged molecules need help from special protein channels. This gatekeeping ensures that useful substances get in, waste products get out, and harmful chemicals stay outside.

### The fluid-mosaic model

Scientists describe the membrane's structure using the **fluid-mosaic model**:

- It consists of a **lipid bilayer** — two layers of phospholipid molecules arranged with their water-attracting heads facing outward and their water-repelling tails tucked inward.
- **Proteins** are embedded throughout this bilayer, some spanning its full width, others sitting on one surface. These proteins act as channels, receptors and transporters.
- The molecules are not fixed; they can slide, rotate and even flip within the layer. This constant movement is why the membrane is described as *fluid*.
- Viewed from above, the scattered proteins look like tiles in a mosaic pattern — hence the name.

### Osmosis — water on the move

When a cell is surrounded by a solution, water moves across the membrane from the region of lower solute concentration to the region of higher solute concentration. This special case of diffusion through a selectively permeable membrane is called **osmosis**.

- In an **isotonic** solution, water moves in and out at equal rates — the cell stays the same size.
- In a **hypotonic** solution (lower solute outside), water enters the cell, causing it to swell.
- In a **hypertonic** solution (higher solute outside), water leaves the cell, causing it to shrink.

Understanding osmosis explains everyday observations: why salted mango slices release juice, and why wilted spinach crisps up when soaked in fresh water.`,
      figures: [membraneFigure],
      note: {
        kind: "remember",
        body: "Water always moves from the region of lower solute concentration to the region of higher solute concentration across a selectively permeable membrane. This is osmosis.",
      },
    },

    /* ── S3 ─────────────────────────────────────────────────────── */
    {
      key: "cell-wall",
      title: "The Cell Wall",
      eyebrow: "Plants only",
      bookRef: "Exploration §2.2",
      body: `If you compare a plant cell with an animal cell under a microscope, the most obvious difference is the thick, rigid border around the plant cell. This structure is the **cell wall**, and it sits outside the cell membrane like a sturdy shell around a soft balloon.

### Why plants need it

Unlike animals, most plants cannot move away from harsh weather. They stand rooted in one place, exposed to wind, rain and the weight of their own branches. The cell wall provides the mechanical strength that keeps stems upright and leaves outstretched. Without it, a plant would collapse like a deflated tent.

The cell wall is **permeable** — it lets water and dissolved minerals pass through freely, unlike the selectively permeable cell membrane beneath it. The two layers work as a team: the wall provides strength while the membrane controls chemistry.

### What it is made of

The primary component of a plant cell wall is **cellulose**, a long-chain carbohydrate assembled from thousands of glucose units. Cellulose fibres are laid down in criss-crossing layers, much like the layers of plywood, giving the wall both strength and a degree of flexibility. Interestingly, the cellulose you eat as dietary fibre (roughage) is exactly the same molecule — your body cannot digest it, but it helps food move through your gut.

### Plasmolysis — the wall holds firm

Place a plant cell in a concentrated salt or sugar solution, and osmosis draws water out. The cell membrane shrinks inward and pulls away from the rigid cell wall — a process called **plasmolysis**. The cell wall itself does not collapse; it keeps the cell's overall shape intact. An animal cell in the same solution has no wall, so it simply shrivels.

This difference explains why a carrot stays firm in plain water but turns limp and rubbery when left in a bowl of concentrated salt solution: the salt draws water out of the cells, and without turgor pressure pushing the membrane against the wall, the tissue loses its crunch.

### Beyond plants

Cell walls are not exclusive to plants. Fungi have walls made of **chitin** (the same material in insect exoskeletons), and most bacteria have walls built from a mesh-like molecule called **peptidoglycan**. In each case, the wall gives the cell protection and a defined shape.`,
      note: {
        kind: "watch-out",
        body: "Do not confuse the cell wall with the cell membrane. The wall is rigid and fully permeable; the membrane is flexible and selectively permeable. Animal cells have no wall at all.",
      },
    },

    /* ── S4 ─────────────────────────────────────────────────────── */
    {
      key: "cell-interior",
      title: "Inside the Cell — Cytoplasm and Nucleus",
      eyebrow: "Control centre",
      bookRef: "Exploration §2.3",
      body: `Once you cross the cell membrane (and the cell wall, if the cell has one), you enter the **cytoplasm** — a gel-like fluid that fills the entire interior. Think of it as the workshop floor of a factory: raw materials are stored here, chemical reactions take place here, and all the specialised machinery of the cell sits suspended within it.

### Cytoplasm

The cytoplasm is mostly water, mixed with salts, enzymes and organic molecules. It stores starch granules in plant cells and glycogen in animal cells, both serving as energy reserves. More importantly, it provides the medium in which the cell's organelles — its specialised compartments — carry out their work.

### The nucleus — the cell's command room

The most prominent organelle in a eukaryotic cell is the **nucleus**. Enclosed by a double-layered **nuclear membrane** (or nuclear envelope) punctuated with tiny pores, it houses the cell's genetic material and directs most cellular activities.

Inside the nucleus you will find:

- **Chromosomes** — thread-like structures made of **DNA** wound tightly around proteins. DNA carries the instructions for building every protein the cell needs. Human cells contain 46 chromosomes arranged in 23 pairs.
- The **nucleolus** — a dense, rounded body responsible for assembling ribosomes, the molecular machines that translate genetic instructions into proteins.

The nuclear pores allow messenger molecules to shuttle between the nucleus and the cytoplasm, ensuring that instructions from the DNA reach the protein-building machinery outside.

### Prokaryotes vs eukaryotes

Not every cell has a membrane-bound nucleus. **Prokaryotic cells** (from the Greek *pro-*, before, and *karyon*, kernel) — such as bacteria — lack a defined nucleus. Their DNA floats freely in the cytoplasm in a region called the **nucleoid**. They also lack the membrane-bound organelles that eukaryotic cells possess.

**Eukaryotic cells** (*eu-*, true) — found in plants, animals, fungi and protists — have a proper nucleus and a collection of specialised organelles. This compartmentalisation lets different chemical processes run side by side without interfering with one another, a major advantage that helped complex multicellular life evolve.`,
      sim: cellSizeSim,
      figures: [nucleusFigure],
      note: {
        kind: "exam-tip",
        body: "Remember the Greek roots: 'pro-' means primitive, 'eu-' means true, and 'karyon' means nucleus. Prokaryotic = primitive nucleus. Eukaryotic = true nucleus — the roots literally spell out the difference.",
      },
    },

    /* ── S5 ─────────────────────────────────────────────────────── */
    {
      key: "organelles",
      title: "Organelles — The Cell's Specialist Team",
      eyebrow: "The workforce",
      bookRef: "Exploration §2.3",
      body: `A eukaryotic cell runs like a well-managed factory. Each organelle has a defined role, and together they keep the cell alive, growing and responding to its environment.

### Endoplasmic reticulum (ER)

The **ER** is an interconnected network of membrane-bound channels and sacs that extends from the nuclear membrane into the cytoplasm. It comes in two forms:

- **Rough ER (RER)** — studded with ribosomes on its surface. It synthesises and folds proteins destined for export or for use in the cell membrane.
- **Smooth ER (SER)** — lacks ribosomes. It manufactures lipids and, in some cells, helps detoxify harmful substances.

### Golgi apparatus

Packages arriving from the ER are received, sorted and dispatched by the **Golgi apparatus** (also called Golgi bodies). Think of it as the cell's post office — it labels molecules, packs them into vesicles and ships them to the correct destination, whether that is the cell surface, a lysosome or somewhere outside the cell.

### Lysosomes

**Lysosomes** are small, enzyme-filled sacs that digest worn-out organelles, food particles and foreign invaders such as bacteria. They are sometimes called the cell's "clean-up crew". If a lysosome's membrane ruptures, the enzymes inside can digest the cell itself — a process seen during the breakdown of old or damaged cells.

### Mitochondria — powerhouses of the cell

**Mitochondria** are bean-shaped organelles with a heavily folded inner membrane. They carry out **cellular respiration**, breaking down glucose in the presence of oxygen to release energy stored as **ATP** (adenosine triphosphate). Nearly every energy-requiring process in your body — from muscle contraction to nerve signalling — runs on ATP produced by mitochondria. Interestingly, mitochondria contain their own small circle of DNA, evidence that they were once free-living bacteria that entered an ancient cell.

### Plastids (plant cells only)

Plants possess a family of organelles called **plastids**. The most familiar is the **chloroplast**, which captures sunlight and drives **photosynthesis** — converting carbon dioxide and water into glucose and oxygen. Chloroplasts contain the green pigment **chlorophyll**. Other plastids include **chromoplasts** (which store pigments that colour fruits and flowers) and **leucoplasts** (which store starch, oils or proteins in non-green parts like roots).

### Vacuoles

Both plant and animal cells have **vacuoles** — membrane-bound compartments that store materials. In a mature plant cell, a single large **central vacuole** can fill up to 90% of the cell volume, storing water, nutrients and waste. It keeps the cell turgid and contributes to the cell's overall rigidity. Animal cells have smaller, often temporary vacuoles.`,
      figures: [mitochondrionFigure, chloroplastFigure],
      note: {
        kind: "remember",
        body: "Mitochondria release energy (cellular respiration); chloroplasts capture energy (photosynthesis). Both have their own small DNA loop, suggesting they were once independent, free-living bacteria absorbed by an ancient cell.",
      },
    },

    /* ── S6 ─────────────────────────────────────────────────────── */
    {
      key: "cell-division",
      title: "How Cells Multiply",
      eyebrow: "Growth & repair",
      bookRef: "Exploration §2.4",
      body: `You started life as a single fertilised egg cell. Today, your body contains roughly 37 trillion cells — and even now, millions of new cells are being produced every second to replace worn-out ones. How does one cell become two? Through **cell division**.

### Mitosis — making identical copies

**Mitosis** is the type of division used for growth and repair in all multicellular organisms. In mitosis:

1. The cell copies all its chromosomes so that each chromosome has an identical twin.
2. The copies line up along the centre of the cell.
3. The cell pulls one complete set to each end.
4. The cytoplasm divides, producing **two daughter cells** that are genetically identical to the parent — each with the full number of chromosomes.

Mitosis is also how unicellular organisms like *Amoeba* reproduce — the single cell divides in two, and each half is a complete new organism.

### Meiosis — halving for reproduction

Sexual reproduction needs a different strategy. If egg and sperm cells each carried the full chromosome set, every generation would double the count. **Meiosis** prevents this by dividing twice:

1. **Meiosis I** separates the paired chromosomes, halving the number.
2. **Meiosis II** separates the copied chromosomes (similar to mitosis).

The result is **four daughter cells**, each with **half** the chromosome number of the parent. These cells mature into **gametes** (egg or sperm). When two gametes fuse at fertilisation, the full count is restored in the **zygote**.

In humans, the parent cell has 46 chromosomes (2n = 46). After meiosis each gamete has 23 (n = 23). Fertilisation brings two sets of 23 together, restoring the 46.

### When division goes wrong

Normal cells follow a built-in programme: they grow, perform their functions and eventually die in an orderly process called **apoptosis**. Occasionally, the control signals break down and a cell begins dividing uncontrollably — this leads to a mass of abnormal cells called a **tumour**. The study of such uncontrolled growth is central to cancer research. Understanding cell division, therefore, is not just an academic exercise — it has direct implications for medicine.`,
      sim: chromosomeSim,
      figures: [mitosisFigure],
      note: {
        kind: "exam-tip",
        body: "Mitosis: 1 division, 2 identical daughter cells, same chromosome count. Meiosis: 2 divisions, 4 daughter cells, half the chromosome count. These differences are frequently tested.",
      },
    },
  ],

  /* ─── Questions (50 total) ─────────────────────────────────────── */
  questions: [
    // ── MCQ (20) ────────────────────────────────────────────────────
    {
      kind: "mcq",
      prompt: "Who first observed cells using a simple microscope in 1665?",
      options: ["Anton van Leeuwenhoek", "Robert Hooke", "Matthias Schleiden", "Rudolf Virchow"],
      correct_index: 1,
      model_answer: "Robert Hooke observed box-like compartments in a thin slice of cork and coined the term 'cell'.",
      difficulty: "basic",
      section: "what-a-cell-is",
    },
    {
      kind: "mcq",
      prompt: "What is the approximate limit of resolution of the unaided human eye?",
      options: ["0.01 mm", "0.1 mm", "1 mm", "10 mm"],
      correct_index: 1,
      model_answer: "The unaided eye can distinguish two points separated by roughly 0.1 mm; anything smaller requires a microscope.",
      difficulty: "basic",
      section: "what-a-cell-is",
    },
    {
      kind: "mcq",
      prompt: "Which model describes the structure of the cell membrane?",
      options: ["Lock-and-key model", "Fluid-mosaic model", "Double-helix model", "Central dogma model"],
      correct_index: 1,
      model_answer: "The fluid-mosaic model describes the membrane as a lipid bilayer with proteins embedded in it, capable of lateral movement.",
      difficulty: "basic",
      section: "cell-boundary",
    },
    {
      kind: "mcq",
      prompt: "What happens to an animal cell placed in a hypertonic solution?",
      options: ["It swells and may burst", "It shrinks", "It stays the same size", "It divides"],
      correct_index: 1,
      model_answer: "In a hypertonic solution the solute concentration outside is higher, so water leaves the cell by osmosis and the cell shrinks.",
      difficulty: "intermediate",
      section: "cell-boundary",
    },
    {
      kind: "mcq",
      prompt: "Which carbohydrate is the main component of a plant cell wall?",
      options: ["Starch", "Glycogen", "Cellulose", "Chitin"],
      correct_index: 2,
      model_answer: "Cellulose, a long-chain polymer of glucose, is laid down in criss-crossing layers to give the wall its strength.",
      difficulty: "basic",
      section: "cell-wall",
    },
    {
      kind: "mcq",
      prompt: "What is plasmolysis?",
      options: [
        "Swelling of a plant cell in pure water",
        "Shrinkage of the cell membrane away from the cell wall in a hypertonic solution",
        "Bursting of an animal cell in a hypotonic solution",
        "Division of the cytoplasm during cell division",
      ],
      correct_index: 1,
      model_answer: "In a concentrated solution, water leaves the plant cell by osmosis; the membrane pulls inward while the rigid cell wall retains its shape.",
      difficulty: "intermediate",
      section: "cell-wall",
    },
    {
      kind: "mcq",
      prompt: "Which organelle is called the 'control centre' of the cell?",
      options: ["Mitochondrion", "Ribosome", "Nucleus", "Golgi apparatus"],
      correct_index: 2,
      model_answer: "The nucleus houses chromosomes containing DNA and directs most cellular activities, making it the cell's control centre.",
      difficulty: "basic",
      section: "cell-interior",
    },
    {
      kind: "mcq",
      prompt: "What distinguishes a prokaryotic cell from a eukaryotic cell?",
      options: [
        "Prokaryotic cells are larger",
        "Prokaryotic cells lack a membrane-bound nucleus",
        "Eukaryotic cells have no cell membrane",
        "Eukaryotic cells lack ribosomes",
      ],
      correct_index: 1,
      model_answer: "Prokaryotic cells have no true nucleus — their DNA is in a nucleoid region — and they lack membrane-bound organelles.",
      difficulty: "basic",
      section: "cell-interior",
    },
    {
      kind: "mcq",
      prompt: "Which organelle is known as the 'powerhouse' of the cell?",
      options: ["Chloroplast", "Nucleus", "Mitochondrion", "Lysosome"],
      correct_index: 2,
      model_answer: "Mitochondria break down glucose through cellular respiration to produce ATP, the energy currency of the cell.",
      difficulty: "basic",
      section: "organelles",
    },
    {
      kind: "mcq",
      prompt: "What is the role of the Golgi apparatus?",
      options: [
        "Protein synthesis",
        "Packaging, sorting and dispatching molecules",
        "Photosynthesis",
        "DNA replication",
      ],
      correct_index: 1,
      model_answer: "The Golgi apparatus receives molecules from the ER, processes and packages them into vesicles, and sends them to their final destination.",
      difficulty: "intermediate",
      section: "organelles",
    },
    {
      kind: "mcq",
      prompt: "Which type of ER has ribosomes on its surface?",
      options: ["Smooth ER", "Rough ER", "Both types equally", "Neither — ribosomes are free-floating only"],
      correct_index: 1,
      model_answer: "Rough ER is studded with ribosomes that synthesise proteins destined for export or membrane use; smooth ER lacks ribosomes and makes lipids.",
      difficulty: "intermediate",
      section: "organelles",
    },
    {
      kind: "mcq",
      prompt: "Chloroplasts contain which green pigment?",
      options: ["Carotene", "Xanthophyll", "Chlorophyll", "Anthocyanin"],
      correct_index: 2,
      model_answer: "Chlorophyll is the pigment in chloroplasts that captures light energy for photosynthesis, giving leaves their green colour.",
      difficulty: "basic",
      section: "organelles",
    },
    {
      kind: "mcq",
      prompt: "How many daughter cells are produced by mitosis?",
      options: ["1", "2", "3", "4"],
      correct_index: 1,
      model_answer: "Mitosis produces two daughter cells, each genetically identical to the parent cell with the full chromosome number.",
      difficulty: "basic",
      section: "cell-division",
    },
    {
      kind: "mcq",
      prompt: "How many daughter cells does meiosis produce?",
      options: ["1", "2", "3", "4"],
      correct_index: 3,
      model_answer: "Meiosis involves two rounds of division and produces four daughter cells, each with half the parent's chromosome number.",
      difficulty: "basic",
      section: "cell-division",
    },
    {
      kind: "mcq",
      prompt: "If a human body cell has 46 chromosomes, how many chromosomes does a human gamete have?",
      options: ["46", "92", "23", "12"],
      correct_index: 2,
      model_answer: "Meiosis halves the chromosome count, so each gamete has 23 chromosomes; fertilisation restores the full 46.",
      difficulty: "intermediate",
      section: "cell-division",
    },
    {
      kind: "mcq",
      prompt: "What is apoptosis?",
      options: [
        "Uncontrolled cell division",
        "Programmed cell death",
        "Fusion of two gametes",
        "Shrinkage of the cell in salt water",
      ],
      correct_index: 1,
      model_answer: "Apoptosis is the orderly, programmed death of a cell — a normal part of growth and maintenance in multicellular organisms.",
      difficulty: "intermediate",
      section: "cell-division",
    },
    {
      kind: "mcq",
      prompt: "In a compound microscope, a 10× eyepiece and a 40× objective lens give a total magnification of:",
      options: ["50×", "400×", "4000×", "30×"],
      correct_index: 1,
      model_answer: "Total magnification = eyepiece × objective = 10 × 40 = 400×.",
      difficulty: "intermediate",
      section: "what-a-cell-is",
    },
    {
      kind: "mcq",
      prompt: "Which of the following is NOT found in an animal cell?",
      options: ["Mitochondrion", "Cell wall", "Cell membrane", "Nucleus"],
      correct_index: 1,
      model_answer: "Animal cells lack a cell wall; only plant, fungal and most bacterial cells have one.",
      difficulty: "basic",
      section: "cell-wall",
    },
    {
      kind: "mcq",
      prompt: "What do lysosomes contain?",
      options: ["Chlorophyll", "Digestive enzymes", "DNA only", "Starch"],
      correct_index: 1,
      model_answer: "Lysosomes are membrane-bound sacs filled with digestive enzymes that break down worn-out organelles, food particles and foreign material.",
      difficulty: "intermediate",
      section: "organelles",
    },
    {
      kind: "mcq",
      prompt: "The nucleolus is responsible for making which cellular component?",
      options: ["Lipids", "ATP", "Ribosomes", "Cell wall material"],
      correct_index: 2,
      model_answer: "The nucleolus assembles ribosomal subunits, which then move to the cytoplasm where they translate mRNA into proteins.",
      difficulty: "intermediate",
      section: "cell-interior",
    },

    // ── TRUE/FALSE (10) ─────────────────────────────────────────────
    {
      kind: "truefalse",
      prompt: "All living organisms are made up of cells.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — the cell theory states that all living things are composed of one or more cells.",
      difficulty: "basic",
      section: "what-a-cell-is",
    },
    {
      kind: "truefalse",
      prompt: "The cell membrane is fully permeable, allowing all substances to pass through.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — the cell membrane is selectively permeable; it allows some molecules through while blocking others.",
      difficulty: "basic",
      section: "cell-boundary",
    },
    {
      kind: "truefalse",
      prompt: "Osmosis is the movement of solute molecules across a selectively permeable membrane.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — osmosis is specifically the movement of water (solvent), not solute, across a selectively permeable membrane.",
      difficulty: "intermediate",
      section: "cell-boundary",
    },
    {
      kind: "truefalse",
      prompt: "Animal cells have a cell wall made of cellulose.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — animal cells lack a cell wall entirely. The cellulose cell wall is a feature of plant cells.",
      difficulty: "basic",
      section: "cell-wall",
    },
    {
      kind: "truefalse",
      prompt: "Prokaryotic cells contain membrane-bound organelles such as mitochondria.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — prokaryotic cells lack membrane-bound organelles; their cellular processes occur directly in the cytoplasm.",
      difficulty: "basic",
      section: "cell-interior",
    },
    {
      kind: "truefalse",
      prompt: "Mitochondria contain their own DNA.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — mitochondria have a small circular DNA molecule, which is evidence that they were once independent bacteria.",
      difficulty: "intermediate",
      section: "organelles",
    },
    {
      kind: "truefalse",
      prompt: "Smooth ER is involved in lipid synthesis.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — the smooth endoplasmic reticulum manufactures lipids and can also detoxify harmful substances.",
      difficulty: "intermediate",
      section: "organelles",
    },
    {
      kind: "truefalse",
      prompt: "Mitosis produces genetically different daughter cells.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — mitosis produces two daughter cells that are genetically identical to the parent cell.",
      difficulty: "basic",
      section: "cell-division",
    },
    {
      kind: "truefalse",
      prompt: "Meiosis is used for growth and repair in the human body.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — growth and repair rely on mitosis. Meiosis is used only to produce gametes (egg and sperm cells).",
      difficulty: "intermediate",
      section: "cell-division",
    },
    {
      kind: "truefalse",
      prompt: "The central vacuole can occupy up to 90% of a mature plant cell's volume.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — in mature plant cells the large central vacuole stores water and nutrients, and can fill most of the cell.",
      difficulty: "intermediate",
      section: "organelles",
    },

    // ── MULTI (8) ───────────────────────────────────────────────────
    {
      kind: "multi",
      prompt: "Which of the following are present in a plant cell but absent in an animal cell?",
      options: ["Cell wall", "Cell membrane", "Chloroplast", "Mitochondria", "Large central vacuole"],
      correct_indices: [0, 2, 4],
      model_answer: "The cell wall (cellulose), chloroplasts (photosynthesis) and a large central vacuole are unique to plant cells. Both cell types have a cell membrane and mitochondria.",
      difficulty: "intermediate",
      section: "what-a-cell-is",
    },
    {
      kind: "multi",
      prompt: "Which statements about the fluid-mosaic model are correct?",
      options: [
        "The membrane has a lipid bilayer",
        "Proteins are embedded in the bilayer",
        "The membrane molecules are completely rigid",
        "The pattern of proteins resembles a mosaic",
      ],
      correct_indices: [0, 1, 3],
      model_answer: "The membrane is a fluid lipid bilayer with mosaic-like proteins; it is not rigid — molecules slide and rotate freely.",
      difficulty: "intermediate",
      section: "cell-boundary",
    },
    {
      kind: "multi",
      prompt: "Select ALL organisms whose cells have a cell wall.",
      options: ["Plants", "Animals", "Fungi", "Most bacteria"],
      correct_indices: [0, 2, 3],
      model_answer: "Plants (cellulose), fungi (chitin) and most bacteria (peptidoglycan) have cell walls; animal cells do not.",
      difficulty: "intermediate",
      section: "cell-wall",
    },
    {
      kind: "multi",
      prompt: "Which of the following are features of eukaryotic cells?",
      options: [
        "Membrane-bound nucleus",
        "Membrane-bound organelles",
        "DNA in a nucleoid region",
        "Typically 10–100 µm in diameter",
      ],
      correct_indices: [0, 1, 3],
      model_answer: "Eukaryotic cells have a true nucleus, membrane-bound organelles and are typically 10–100 µm. The nucleoid is a prokaryotic feature.",
      difficulty: "intermediate",
      section: "cell-interior",
    },
    {
      kind: "multi",
      prompt: "Which organelles contain their own DNA?",
      options: ["Mitochondria", "Chloroplasts", "Lysosomes", "Golgi apparatus"],
      correct_indices: [0, 1],
      model_answer: "Both mitochondria and chloroplasts carry their own small circular DNA, supporting the endosymbiotic theory of their origin.",
      difficulty: "advanced",
      section: "organelles",
    },
    {
      kind: "multi",
      prompt: "Which of the following are functions of the cell membrane?",
      options: [
        "Controlling entry and exit of substances",
        "Providing rigid structural support",
        "Allowing communication between cells",
        "Photosynthesis",
      ],
      correct_indices: [0, 2],
      model_answer: "The membrane controls substance transport and enables cell-to-cell signalling. Rigid support comes from the cell wall (not membrane), and photosynthesis occurs in chloroplasts.",
      difficulty: "intermediate",
      section: "cell-boundary",
    },
    {
      kind: "multi",
      prompt: "Select the correct statements about meiosis.",
      options: [
        "It produces four daughter cells",
        "Daughter cells have the same chromosome number as the parent",
        "It involves two rounds of division",
        "It is used to produce gametes",
        "Daughter cells are genetically identical to the parent",
      ],
      correct_indices: [0, 2, 3],
      model_answer: "Meiosis involves two divisions producing four cells with half the chromosome count for gamete formation; daughter cells are not identical to the parent.",
      difficulty: "advanced",
      section: "cell-division",
    },
    {
      kind: "multi",
      prompt: "Which of these are types of plastids?",
      options: ["Chloroplast", "Chromoplast", "Leucoplast", "Lysosome"],
      correct_indices: [0, 1, 2],
      model_answer: "Chloroplasts (photosynthesis), chromoplasts (colour pigments) and leucoplasts (storage) are all plastids. Lysosomes are enzyme-containing vesicles, not plastids.",
      difficulty: "intermediate",
      section: "organelles",
    },

    // ── QUICKFIRE (6) ───────────────────────────────────────────────
    {
      kind: "quickfire",
      prompt: "How many chromosomes are in a normal human body cell?",
      model_answer: "46",
      difficulty: "basic",
      section: "cell-interior",
    },
    {
      kind: "quickfire",
      prompt: "Name the process by which water moves across a selectively permeable membrane.",
      model_answer: "Osmosis",
      difficulty: "basic",
      section: "cell-boundary",
    },
    {
      kind: "quickfire",
      prompt: "What is the energy currency molecule produced by mitochondria?",
      model_answer: "ATP (adenosine triphosphate)",
      difficulty: "basic",
      section: "organelles",
    },
    {
      kind: "quickfire",
      prompt: "Name the pigment in chloroplasts responsible for the green colour of leaves.",
      model_answer: "Chlorophyll",
      difficulty: "basic",
      section: "organelles",
    },
    {
      kind: "quickfire",
      prompt: "What type of cell division produces gametes?",
      model_answer: "Meiosis",
      difficulty: "basic",
      section: "cell-division",
    },
    {
      kind: "quickfire",
      prompt: "What is the main carbohydrate in plant cell walls?",
      model_answer: "Cellulose",
      difficulty: "basic",
      section: "cell-wall",
    },

    // ── OPEN (6) ────────────────────────────────────────────────────
    {
      kind: "open",
      prompt: "Explain why a plant cell placed in a concentrated salt solution does not collapse, while an animal cell in the same solution shrivels.",
      model_answer: "The plant cell has a rigid cell wall outside its membrane. When osmosis draws water out, the membrane pulls inward (plasmolysis) but the wall holds the cell's overall shape. An animal cell lacks a wall, so nothing prevents it from shrinking entirely when it loses water.",
      difficulty: "intermediate",
      section: "cell-wall",
    },
    {
      kind: "open",
      prompt: "Describe how the cell membrane's selective permeability is important for a cell's survival.",
      model_answer: "Selective permeability ensures that essential molecules such as oxygen and nutrients enter the cell, waste products exit, and harmful substances are kept out. Without this regulation, the internal chemical environment would become chaotic, enzyme reactions would fail, and the cell would die.",
      difficulty: "intermediate",
      section: "cell-boundary",
    },
    {
      kind: "open",
      prompt: "Why is it important that meiosis halves the chromosome number? What would happen if gametes had the full chromosome count?",
      model_answer: "If both gametes carried the full chromosome set, every fertilisation would double the number. After only a few generations the chromosome count would become unmanageable. Halving ensures that fusion of egg and sperm restores the species-specific number, keeping it constant across generations.",
      difficulty: "advanced",
      section: "cell-division",
    },
    {
      kind: "open",
      prompt: "Compare the roles of mitochondria and chloroplasts in a plant cell. How are they complementary?",
      model_answer: "Chloroplasts capture light energy and convert carbon dioxide and water into glucose and oxygen (photosynthesis). Mitochondria then break down that glucose using oxygen to release ATP (cellular respiration). The two processes are complementary: the products of one serve as the raw materials of the other.",
      difficulty: "advanced",
      section: "organelles",
    },
    {
      kind: "open",
      prompt: "Explain the difference between prokaryotic and eukaryotic cells, giving two structural examples.",
      model_answer: "Prokaryotic cells have no membrane-bound nucleus; their DNA is in a nucleoid region, and they lack membrane-bound organelles like mitochondria or ER. Eukaryotic cells have a well-defined nucleus enclosed by a double membrane and contain specialised organelles that compartmentalise different functions.",
      difficulty: "intermediate",
      section: "cell-interior",
    },
    {
      kind: "open",
      prompt: "A student estimates the size of onion cells using a microscope with a 5 mm field of view and counts 20 cells along the diameter. Show the calculation and state the estimated cell size in micrometres.",
      model_answer: "Convert the field of view: 5 mm × 1000 = 5000 µm. Divide by the number of cells: 5000 µm ÷ 20 = 250 µm. The estimated size of one onion cell is approximately 250 µm.",
      difficulty: "intermediate",
      section: "what-a-cell-is",
    },
  ],
};
