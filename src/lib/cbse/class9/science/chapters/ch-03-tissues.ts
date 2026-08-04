import type { Chapter } from "@/lib/cbse/types";
import {
  meristemFigure,
  simpleTissueFigure,
  vascularTissueFigure,
  epithelialFigure,
  connectiveFigure,
  muscleFigure,
  neuronFigure,
  organismFigure,
  animalArmFigure,
} from "../figures/ch-03";

/* ─── Chapter ────────────────────────────────────────────────────── */

export const ch03Tissues: Chapter = {
  key: "ch-03-tissues",
  number: 3,
  title: "Tissues in Action",
  subject: "science",
  book: "Exploration",
  accent: "#5ad1c0",
  summary: "Explore how specialised cells group together to form tissues that power everything from a plant's growth to your own heartbeat.",
  estMinutes: 20,

  sections: [
    /* ── S1 ─────────────────────────────────────────────────────── */
    {
      key: "from-cells-to-tissues",
      title: "From Cells to Tissues",
      eyebrow: "Division of labour",
      bookRef: "Exploration §3.1",
      body: `In a unicellular organism like an *Amoeba*, a single cell handles every life process: movement, feeding, respiration, and excretion. But in multicellular organisms, relying on a single cell is impossible. Instead, they rely on **division of labour**.

> A tissue is a group of cells (similar in structure) that work together to perform a specific function.
> — *Exploration*, Chapter 3

By grouping into tissues, cells become highly efficient. Muscle cells in your legs are entirely optimised for contraction and movement, while cells lining your stomach specialise in secreting enzymes. This specialisation allows multicellular organisms to grow larger and adapt to complex environments.

This same principle of specialisation scales upward. Tissues themselves group together to form **organs** — your stomach is not one tissue but several working in concert: epithelial tissue lining its interior, muscle tissue contracting its walls, connective tissue holding it in shape, and nervous tissue controlling when it contracts. Organs, in turn, combine into **organ systems**, such as the digestive system that carries food from your mouth to its final absorption. Every level of this hierarchy — cell, tissue, organ, organ system — exists because no single unit can do everything well; specialising at each stage is what lets a large, complex body function as efficiently as it does.

### Plant vs. Animal Tissues

Plants are stationary. Their primary need is structural support to stay firm and upright. Consequently, many plant tissues are made of dead cells with thick walls, providing maximum strength with minimal maintenance.

Animals, on the other hand, are highly mobile in search of food and shelter, consuming far more energy. Most animal tissues consist of living cells. Furthermore, while animals grow somewhat uniformly across their bodies until adulthood, plants only grow in specific regions throughout their lifespan.`,
      sim: organismFigure,
      note: {
        kind: "fact",
        title: "The study of tissues",
        body: "The branch of biology that studies the microscopic structure of tissues is called histology. It comes from the Greek words 'histos' (web or tissue) and 'logia' (study).",
      },
    },

    /* ── S2 ─────────────────────────────────────────────────────── */
    {
      key: "plant-growth-meristems",
      title: "How Plants Grow",
      eyebrow: "Meristematic tissue",
      bookRef: "Exploration §3.2",
      body: `If you carve your initials into the trunk of a young tree, years later, the carving will still be at the exact same height from the ground. This is because plants do not grow everywhere at once. They only grow in specific, active regions containing **meristematic tissue**.

### The dividing cells

Meristematic tissues consist of young, actively dividing cells. These cells are small, have thin walls, dense cytoplasm, and a prominent nucleus. Interestingly, they often lack vacuoles — this is because vacuoles store sap and provide rigidity, which would get in the way of rapid cell division. 

Depending on where they are located, meristems do different jobs:
- **Apical meristem**: Found at the growing tips of roots and stems. It makes the plant taller and the roots deeper.
- **Lateral meristem**: Found along the sides of stems and roots. It increases the girth (thickness) of the plant.
- **Intercalary meristem**: Located at the base of leaves or internodes (especially in grasses). It allows grass to grow back quickly after being munched by a cow or cut by a lawnmower.

### Becoming permanent

As the cells produced by meristems mature, they take on specific roles and lose their ability to divide. 

> This process of taking up a permanent shape, size, and a function is called differentiation.
> — *Exploration*, §3.2.4

Differentiated cells form **permanent tissues**, which make up the bulk of the plant. You can see the record of a tree's lateral meristem activity directly: each ring visible in a cut trunk marks one year of growth, wider in wet seasons and narrower in dry ones.`,
      sim: meristemFigure,
      note: {
        kind: "remember",
        body: "Meristematic cells are the only plant cells that actively divide. Once they stop dividing and specialise, they become permanent tissues through a process called differentiation.",
      },
    },

    /* ── S3 ─────────────────────────────────────────────────────── */
    {
      key: "simple-permanent",
      figures: [simpleTissueFigure],
      title: "Support and Protection",
      eyebrow: "Simple permanent tissues",
      bookRef: "Exploration §3.2",
      body: `When you bend a fresh green twig, it flexes. When you snap a dry branch, it breaks. The varying textures of a plant — from soft leaves to hard nutshells — are the work of **simple permanent tissues**. These tissues are "simple" because they are composed of only one type of cell.

### The protective shield: Epidermis
The outermost layer of the entire plant is the **epidermis**. It is usually a single layer of tightly packed cells. In dry habitats, it secretes a waxy, water-resistant layer called the **cuticle** to prevent water loss. On leaves, the epidermis contains tiny pores called **stomata**, flanked by guard cells, which allow gases to enter and exit. In roots, epidermal cells bear long root hairs that drastically increase the surface area for absorbing water.

### The supporting trio
Beneath the epidermis lie the tissues that give the plant its shape and strength:

1. **Parenchyma**: The most common tissue, made of living cells with thin walls and loose packing. It mainly stores food and water. When it contains chlorophyll to perform photosynthesis, it is called *chlorenchyma*. In water plants, large air cavities in parenchyma help the plant float (*aerenchyma*).
2. **Collenchyma**: Made of living cells with corners thickened by pectin. This tissue provides flexibility, allowing stems and tendrils to bend in the wind without snapping.
3. **Sclerenchyma**: The tough guy of the plant world. Its cells are dead, long, and narrow, with thick walls hardened by lignin. It makes stems stiff, forms the hard shells of nuts, and creates the tough fibres in coconut husks.`,
      note: {
        kind: "watch-out",
        body: "Parenchyma stores food and water (thin walls, living). Collenchyma allows bending without breaking (corners thickened with pectin, living). Sclerenchyma provides hard, rigid strength (walls hardened with lignin, dead) — the toughest of the three.",
      },
    },

    /* ── S4 ─────────────────────────────────────────────────────── */
    {
      key: "complex-permanent",
      figures: [vascularTissueFigure],
      title: "The Plant's Plumbing",
      eyebrow: "Complex permanent tissues",
      bookRef: "Exploration §3.2",
      body: `Imagine a redwood tree towering 100 metres into the air. How does water from the soil reach the very top leaves? And how does the food made in those leaves reach the roots deep underground? This incredible logistical feat is handled by **complex permanent tissues**, which are made of more than one type of cell working together as a team.

There are two main conducting tissues in plants, collectively called vascular tissues:

### Xylem: The Water Pipe
**Xylem** transports water and dissolved minerals upwards from the roots to the stem and leaves. It consists of four elements:
- *Tracheids and vessels*: Tubular structures that act as the actual pipes. They have thick, lignified walls and are dead at maturity.
- *Xylem fibres*: Dead, supportive fibres that give strength.
- *Xylem parenchyma*: The only living cells in the xylem, they store food and help conduct water sideways.

Because the main conducting cells are dead and rigid, xylem also acts as the woody skeleton of the tree, keeping it upright against gravity.

### Phloem: The Food Carrier
**Phloem** transports the sugars manufactured in the leaves during photosynthesis to all other parts of the plant — both upwards to growing shoots and downwards to the roots. Unlike xylem, phloem is mostly made of living cells:
- *Sieve tubes*: Long, tubular cells with perforated ends (sieve plates) through which the sugary sap flows.
- *Companion cells*: Specialised cells sitting next to sieve tubes that control the loading and unloading of sugars.
- *Phloem parenchyma*: Living cells that store food.
- *Phloem fibres*: The only dead cells in the phloem, providing mechanical support.`,
      note: {
        kind: "exam-tip",
        body: "Xylem transports water and minerals mostly UPWARDS, from roots to leaves, using cells that are dead at maturity. Phloem transports food in BOTH directions — up and down — using cells that stay alive their whole working life.",
      },
    },

    /* ── S5 ─────────────────────────────────────────────────────── */
    {
      key: "animal-epithelial",
      title: "Animal Tissues: Covering and Lining",
      eyebrow: "Epithelial tissue",
      bookRef: "Exploration §3.3",
      body: `Unlike plants, animals are highly mobile and have complex internal organ systems. To manage this complexity, animals rely on four primary tissue types: epithelial, connective, muscular, and nervous. Let's start with the tissue that covers it all.

### Epithelial Tissue
**Epithelial tissue** is the covering or protective tissue in the animal body. It forms your outer skin, lines the inside of your mouth, coats your blood vessels, and covers your internal organs. Because its main job is to form a barrier — keeping pathogens out and fluids in — its cells are tightly packed together with almost no intercellular space, much like tiles on a floor.

The structure of epithelial tissue directly matches its specific job:
- **Simple squamous epithelium**: A single, incredibly thin, flat layer of cells. It lines the lungs and blood vessels, where its thinness allows gases and nutrients to diffuse across rapidly.
- **Stratified squamous epithelium**: Found in the skin, this consists of many layers of flat cells stacked on top of each other to withstand wear and tear.
- **Cuboidal epithelium**: Cube-shaped cells that provide mechanical support and form the lining of kidney tubules and salivary glands.
- **Columnar epithelium**: Tall, pillar-like cells found lining the intestine, where they absorb nutrients. In the respiratory tract, these cells have tiny hair-like projections called *cilia* that sweep mucus and trapped dust away from the lungs.

Because epithelial tissue takes constant wear from friction, chemicals, and pathogens, its cells are also among the fastest in the body to be replaced — the outer layer of your skin, for instance, renews itself completely roughly every four weeks.`,
      sim: animalArmFigure,
      figures: [epithelialFigure],
    },

    /* ── S6 ─────────────────────────────────────────────────────── */
    {
      key: "animal-connective",
      figures: [connectiveFigure],
      title: "Tying it all Together",
      eyebrow: "Connective tissue",
      bookRef: "Exploration §3.3",
      body: `What stops your skin from sliding off your muscles, or your bones from falling apart? The answer is **connective tissue**. True to its name, this tissue connects, supports, and binds other tissues together. The defining feature of connective tissue is that its cells are loosely spaced and embedded in an intercellular substance called a **matrix**, which can be jelly-like, fluid, or rigid.

### Fluid and Rigid Connective Tissues
- **Blood**: A fluid connective tissue. Its matrix is a liquid called *plasma*, containing red blood cells (carrying oxygen), white blood cells (fighting infection), and platelets (for clotting). Blood flows throughout the body, connecting all organs by delivering nutrients and removing waste.
- **Bone**: A hard, rigid connective tissue. Its matrix is heavily packed with calcium and phosphorus compounds. Bones form the skeleton, providing a structural framework and anchoring muscles.

### Flexible Connective Tissues
- **Cartilage**: A softer, flexible tissue with a solid but pliable matrix of proteins and sugars. It smooths bone surfaces at joints and gives shape to your ear lobes and the tip of your nose.
- **Ligaments**: Very elastic, strong tissues that connect **bone to bone**, holding joints together.
- **Tendons**: Tough, fibrous tissues that connect **muscle to bone**, allowing your muscles to pull your skeleton and create movement.

### Packing and Insulation
- **Areolar tissue**: A loose, jelly-like packing tissue found between skin and muscles, and around blood vessels. It fills spaces inside organs and helps repair tissues.
- **Adipose tissue**: The body's fat storage. Located below the skin and around internal organs, its cells are filled with fat globules, acting as an energy reserve and a thermal insulator.`,
      note: {
        kind: "remember",
        body: "Tendons connect muscle to bone, letting a contracting muscle pull on the skeleton. Ligaments connect bone to bone, holding a joint together. An easy way to remember: Ligaments Link Like to Like — bone to bone.",
      },
    },

    /* ── S7 ─────────────────────────────────────────────────────── */
    {
      key: "animal-muscle-nervous",
      figures: [muscleFigure, neuronFigure],
      title: "Movement and Control",
      eyebrow: "Muscle & Nervous tissue",
      bookRef: "Exploration §3.3",
      body: `The ability to react and move rapidly is the defining trait of animals. This requires a perfect partnership between the tissues that generate physical force and the tissues that issue the commands.

### Muscle Tissue
Muscle tissue consists of elongated cells, appropriately called muscle fibres, which contain special proteins that contract and relax to cause movement. There are three types:
1. **Skeletal muscle**: These muscles are attached to your bones. Because you can control them consciously (like choosing to lift your arm), they are called *voluntary* muscles. Under a microscope, they show alternating light and dark bands (striations).
2. **Smooth muscle**: Found in the walls of the stomach, intestines, and blood vessels. These perform *involuntary* movements, pushing food through your gut without you having to think about it. They are unstriated and spindle-shaped.
3. **Cardiac muscle**: The muscle of the heart. It is involuntary, but uniquely designed to pump rhythmically and tirelessly for your entire life without ever suffering fatigue.

### Nervous Tissue
None of those muscles move without a signal. **Nervous tissue** is highly specialised for receiving stimuli and rapidly transmitting electrical messages throughout the body. It is concentrated in the brain, spinal cord, and nerves.

The cells of nervous tissue are called **neurons**. A neuron looks like a microscopic tree: it has a central *cell body* containing the nucleus, short branching *dendrites* that receive incoming signals, and a single, very long *axon* that carries the signal away to the next cell or muscle. This high-speed communication network allows you to instantly pull your hand away from a hot stove.`,
    },
  ],

  /* ─── Questions (50 total) ─────────────────────────────────────── */
  questions: [
    // ── MCQ (20) ────────────────────────────────────────────────────
    {
      kind: "mcq",
      prompt: "What is a group of similar cells working together to perform a specific function called?",
      options: ["An organ", "An organelle", "A tissue", "An organism"],
      correct_index: 2,
      model_answer: "A tissue is defined as a group of structurally similar cells that coordinate to perform a specific biological function.",
      difficulty: "basic",
      section: "from-cells-to-tissues",
    },
    {
      kind: "mcq",
      prompt: "Why do most plant tissues consist of dead cells?",
      options: [
        "Plants do not need oxygen",
        "Dead cells provide better mechanical strength and require less maintenance",
        "Plants cannot produce enough food to keep cells alive",
        "Dead cells are necessary for photosynthesis",
      ],
      correct_index: 1,
      model_answer: "Because plants are stationary, their primary need is structural support. Dead cells with thick walls provide strong, low-maintenance structural integrity.",
      difficulty: "intermediate",
      section: "from-cells-to-tissues",
    },
    {
      kind: "mcq",
      prompt: "Which meristem is responsible for increasing the girth (thickness) of a plant stem?",
      options: ["Apical meristem", "Lateral meristem", "Intercalary meristem", "Terminal meristem"],
      correct_index: 1,
      model_answer: "The lateral meristem is located along the sides of stems and roots, and its division causes the plant to increase in diameter.",
      difficulty: "basic",
      section: "plant-growth-meristems",
    },
    {
      kind: "mcq",
      prompt: "Why do meristematic cells generally lack vacuoles?",
      options: [
        "Vacuoles prevent photosynthesis",
        "Vacuoles store sap and provide rigidity, which hinders rapid cell division",
        "Meristematic cells are dead",
        "Vacuoles take up too much water from the soil",
      ],
      correct_index: 1,
      model_answer: "Large vacuoles provide rigidity to a cell, which would physically interfere with the rapid and continuous division required of meristematic cells.",
      difficulty: "intermediate",
      section: "plant-growth-meristems",
    },
    {
      kind: "mcq",
      prompt: "What is the process by which meristematic cells take up a permanent shape, size, and function?",
      options: ["Division", "Multiplication", "Differentiation", "Transpiration"],
      correct_index: 2,
      model_answer: "Differentiation is the maturation process where actively dividing cells become specialised permanent tissues.",
      difficulty: "basic",
      section: "plant-growth-meristems",
    },
    {
      kind: "mcq",
      prompt: "Which simple permanent tissue is composed of dead cells with heavily lignified walls?",
      options: ["Parenchyma", "Collenchyma", "Sclerenchyma", "Chlorenchyma"],
      correct_index: 2,
      model_answer: "Sclerenchyma consists of long, narrow, dead cells with thick walls hardened by lignin, providing intense rigidity and strength.",
      difficulty: "basic",
      section: "simple-permanent",
    },
    {
      kind: "mcq",
      prompt: "Which tissue provides flexibility to plant stems, allowing them to bend without breaking?",
      options: ["Sclerenchyma", "Collenchyma", "Xylem", "Epidermis"],
      correct_index: 1,
      model_answer: "Collenchyma cells have corners thickened with pectin, giving stems and tendrils flexible mechanical support.",
      difficulty: "intermediate",
      section: "simple-permanent",
    },
    {
      kind: "mcq",
      prompt: "What is the primary function of stomata in the epidermis of leaves?",
      options: ["Absorbing water", "Providing mechanical support", "Facilitating gas exchange", "Storing starch"],
      correct_index: 2,
      model_answer: "Stomata are tiny pores that open and close to allow carbon dioxide, oxygen, and water vapour to pass into and out of the leaf.",
      difficulty: "basic",
      section: "simple-permanent",
    },
    {
      kind: "mcq",
      prompt: "Which complex tissue transports water and minerals from the roots upwards?",
      options: ["Phloem", "Xylem", "Parenchyma", "Collenchyma"],
      correct_index: 1,
      model_answer: "Xylem acts as a system of microscopic pipes that draw water and dissolved minerals from the roots up to the rest of the plant.",
      difficulty: "basic",
      section: "complex-permanent",
    },
    {
      kind: "mcq",
      prompt: "What is the only living cellular component in mature xylem tissue?",
      options: ["Tracheids", "Xylem vessels", "Xylem fibres", "Xylem parenchyma"],
      correct_index: 3,
      model_answer: "While tracheids, vessels, and fibres in the xylem die at maturity to form hollow structural tubes, xylem parenchyma remains alive to store food.",
      difficulty: "advanced",
      section: "complex-permanent",
    },
    {
      kind: "mcq",
      prompt: "Which type of animal tissue forms a continuous protective barrier covering the body and internal organs?",
      options: ["Muscular tissue", "Connective tissue", "Epithelial tissue", "Nervous tissue"],
      correct_index: 2,
      model_answer: "Epithelial tissue consists of tightly packed cells that form continuous sheets, creating protective linings and coverings.",
      difficulty: "basic",
      section: "animal-epithelial",
    },
    {
      kind: "mcq",
      prompt: "Where in the human body would you expect to find stratified squamous epithelium?",
      options: ["Lining of the lungs", "Skin", "Kidney tubules", "Intestine"],
      correct_index: 1,
      model_answer: "The skin experiences heavy wear and tear, so it requires stratified (multi-layered) squamous epithelium to prevent damage to underlying tissues.",
      difficulty: "intermediate",
      section: "animal-epithelial",
    },
    {
      kind: "mcq",
      prompt: "Which of the following is a fluid connective tissue?",
      options: ["Cartilage", "Bone", "Blood", "Adipose tissue"],
      correct_index: 2,
      model_answer: "Blood is a connective tissue with a fluid matrix called plasma, which allows it to flow and transport substances throughout the body.",
      difficulty: "basic",
      section: "animal-connective",
    },
    {
      kind: "mcq",
      prompt: "Which connective tissue attaches muscles to bones?",
      options: ["Ligament", "Cartilage", "Tendon", "Areolar tissue"],
      correct_index: 2,
      model_answer: "Tendons are tough, fibrous connective tissues that anchor skeletal muscles to bones, enabling movement.",
      difficulty: "basic",
      section: "animal-connective",
    },
    {
      kind: "mcq",
      prompt: "Which tissue stores fat and acts as a thermal insulator in the animal body?",
      options: ["Adipose tissue", "Areolar tissue", "Epithelial tissue", "Cartilage"],
      correct_index: 0,
      model_answer: "Adipose tissue cells are specialised to store fat globules, providing a reserve of energy and insulating the body against heat loss.",
      difficulty: "intermediate",
      section: "animal-connective",
    },
    {
      kind: "mcq",
      prompt: "What characterises smooth muscle tissue?",
      options: [
        "Voluntary and striated",
        "Involuntary and unstriated",
        "Voluntary and unstriated",
        "Involuntary and striated",
      ],
      correct_index: 1,
      model_answer: "Smooth muscles, found in internal organs like the stomach, operate without conscious control (involuntary) and lack the light/dark bands seen in skeletal muscle.",
      difficulty: "intermediate",
      section: "animal-muscle-nervous",
    },
    {
      kind: "mcq",
      prompt: "Which muscle tissue is exclusively found in the heart?",
      options: ["Skeletal muscle", "Cardiac muscle", "Smooth muscle", "Voluntary muscle"],
      correct_index: 1,
      model_answer: "Cardiac muscle is specialised to contract rhythmically and continuously without fatiguing, and it exists only in the heart wall.",
      difficulty: "basic",
      section: "animal-muscle-nervous",
    },
    {
      kind: "mcq",
      prompt: "What is the long, single fibre that carries signals away from the cell body of a neuron called?",
      options: ["Dendrite", "Axon", "Synapse", "Cilium"],
      correct_index: 1,
      model_answer: "The axon is a specialised, elongated projection of a neuron that conducts electrical impulses away from the cell body toward other cells.",
      difficulty: "basic",
      section: "animal-muscle-nervous",
    },
    {
      kind: "mcq",
      prompt: "The husk of a coconut is extremely hard and fibrous. Which tissue is it primarily made of?",
      options: ["Parenchyma", "Collenchyma", "Sclerenchyma", "Phloem fibres"],
      correct_index: 2,
      model_answer: "Sclerenchyma tissue is highly lignified and dead, giving the coconut husk its intensely tough and rigid fibrous texture.",
      difficulty: "intermediate",
      section: "simple-permanent",
    },
    {
      kind: "mcq",
      prompt: "What are the small, branching structures on a neuron that receive signals from other cells?",
      options: ["Axons", "Cilia", "Dendrites", "Tendons"],
      correct_index: 2,
      model_answer: "Dendrites branch out from the neuron's cell body, acting like antennae to receive incoming electrical or chemical signals.",
      difficulty: "basic",
      section: "animal-muscle-nervous",
    },

    // ── TRUE/FALSE (10) ─────────────────────────────────────────────
    {
      kind: "truefalse",
      prompt: "In multicellular organisms, all cells perform exactly the same functions.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — multicellular organisms rely on division of labour, where different groups of cells (tissues) specialise in specific functions.",
      difficulty: "basic",
      section: "from-cells-to-tissues",
    },
    {
      kind: "truefalse",
      prompt: "Apical meristems are found at the growing tips of roots and stems.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — apical meristems drive the primary growth in plants, increasing the length of shoots and roots.",
      difficulty: "basic",
      section: "plant-growth-meristems",
    },
    {
      kind: "truefalse",
      prompt: "Collenchyma tissue is made entirely of dead cells with heavily lignified walls.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — collenchyma is made of living cells thickened with pectin. It is sclerenchyma that consists of dead, lignified cells.",
      difficulty: "intermediate",
      section: "simple-permanent",
    },
    {
      kind: "truefalse",
      prompt: "The waxy cuticle on a leaf's epidermis helps prevent water loss.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — the cuticle acts as a waterproof barrier, which is especially important for plants in dry habitats.",
      difficulty: "basic",
      section: "simple-permanent",
    },
    {
      kind: "truefalse",
      prompt: "Phloem transports water upwards from the roots to the leaves.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — water transport is the job of the xylem. Phloem transports food (sugars) made in the leaves to all parts of the plant.",
      difficulty: "basic",
      section: "complex-permanent",
    },
    {
      kind: "truefalse",
      prompt: "Epithelial cells are typically loosely packed with large intercellular spaces.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — epithelial cells are tightly packed to form a continuous, unbroken barrier, leaving virtually no intercellular space.",
      difficulty: "intermediate",
      section: "animal-epithelial",
    },
    {
      kind: "truefalse",
      prompt: "Bone is a type of connective tissue with a hard matrix containing calcium and phosphorus.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — bone fits the definition of a connective tissue (cells embedded in a matrix), and its rigid mineral matrix provides structural support.",
      difficulty: "basic",
      section: "animal-connective",
    },
    {
      kind: "truefalse",
      prompt: "Ligaments are strong, elastic tissues that connect bones to other bones.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — ligaments act like strong rubber bands holding the skeleton together at the joints.",
      difficulty: "basic",
      section: "animal-connective",
    },
    {
      kind: "truefalse",
      prompt: "Skeletal muscles are responsible for involuntary movements like the digestion of food.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — skeletal muscles control voluntary movements. Involuntary digestion is handled by smooth muscles.",
      difficulty: "intermediate",
      section: "animal-muscle-nervous",
    },
    {
      kind: "truefalse",
      prompt: "Nervous tissue is specialised for transmitting electrical signals rapidly across the body.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — the neurons in nervous tissue are highly adapted to conduct electrical impulses, enabling rapid communication and control.",
      difficulty: "basic",
      section: "animal-muscle-nervous",
    },

    // ── MULTI (8) ───────────────────────────────────────────────────
    {
      kind: "multi",
      prompt: "Which of the following are examples of meristematic tissues in plants?",
      options: ["Apical", "Epidermis", "Lateral", "Intercalary", "Xylem"],
      correct_indices: [0, 2, 3],
      model_answer: "Apical, lateral, and intercalary are the three main types of actively dividing meristematic tissues. Epidermis and xylem are permanent tissues.",
      difficulty: "basic",
      section: "plant-growth-meristems",
    },
    {
      kind: "multi",
      prompt: "Which of the following are characteristics of simple permanent tissues?",
      options: [
        "They are made of only one type of cell",
        "They transport water and food over long distances",
        "They include parenchyma, collenchyma, and sclerenchyma",
        "Their cells are always actively dividing",
      ],
      correct_indices: [0, 2],
      model_answer: "Simple permanent tissues consist of a single cell type and include parenchyma, collenchyma, and sclerenchyma. Transport is done by complex tissues, and permanent cells do not divide.",
      difficulty: "intermediate",
      section: "simple-permanent",
    },
    {
      kind: "multi",
      prompt: "Select ALL the components that make up phloem tissue.",
      options: ["Sieve tubes", "Tracheids", "Companion cells", "Phloem fibres", "Vessels"],
      correct_indices: [0, 2, 3],
      model_answer: "Phloem consists of sieve tubes, companion cells, phloem parenchyma, and phloem fibres. Tracheids and vessels are components of xylem.",
      difficulty: "advanced",
      section: "complex-permanent",
    },
    {
      kind: "multi",
      prompt: "Which of the following tissues are considered animal connective tissues?",
      options: ["Blood", "Bone", "Epithelium", "Cartilage", "Cardiac muscle"],
      correct_indices: [0, 1, 3],
      model_answer: "Blood, bone, and cartilage are all connective tissues (cells embedded in a matrix). Epithelium and muscle are entirely different tissue categories.",
      difficulty: "intermediate",
      section: "animal-connective",
    },
    {
      kind: "multi",
      prompt: "Which of the following are differences between plant and animal tissues?",
      options: [
        "Plant tissues require less energy for maintenance",
        "Animals have more dead supportive tissues than plants",
        "Plant growth is restricted to specific regions",
        "Animal cells never group into tissues",
      ],
      correct_indices: [0, 2],
      model_answer: "Plants use low-energy dead tissues and grow only at meristems. Animals use high-energy living tissues and grow uniformly.",
      difficulty: "intermediate",
      section: "from-cells-to-tissues",
    },
    {
      kind: "multi",
      prompt: "What are the main functions of epithelial tissue?",
      options: [
        "Providing rigid structural support to the body",
        "Protecting underlying cells from injury and infection",
        "Absorbing nutrients in the intestine",
        "Transmitting electrical impulses",
      ],
      correct_indices: [1, 2],
      model_answer: "Epithelial tissue forms protective barriers and absorptive linings. Rigid support is provided by bone, and electrical transmission by nervous tissue.",
      difficulty: "intermediate",
      section: "animal-epithelial",
    },
    {
      kind: "multi",
      prompt: "Which of these are characteristics of skeletal muscle?",
      options: ["Attached to bones", "Voluntary control", "Spindle-shaped cells", "Striated appearance"],
      correct_indices: [0, 1, 3],
      model_answer: "Skeletal muscles are voluntary, striated, and attached to bones. Smooth muscles, not skeletal muscles, are spindle-shaped.",
      difficulty: "intermediate",
      section: "animal-muscle-nervous",
    },
    {
      kind: "multi",
      prompt: "Select the main structural parts of a neuron.",
      options: ["Cell body", "Dendrite", "Axon", "Cuticle"],
      correct_indices: [0, 1, 2],
      model_answer: "A neuron consists of a cell body, receiving dendrites, and a transmitting axon. The cuticle is a waxy layer on plant leaves.",
      difficulty: "basic",
      section: "animal-muscle-nervous",
    },

    // ── QUICKFIRE (6) ───────────────────────────────────────────────
    {
      kind: "quickfire",
      prompt: "What name is given to a group of similar cells performing a specific function?",
      model_answer: "Tissue",
      difficulty: "basic",
      section: "from-cells-to-tissues",
    },
    {
      kind: "quickfire",
      prompt: "Which plant tissue is responsible for increasing the length of roots and stems?",
      model_answer: "Apical meristem",
      difficulty: "basic",
      section: "plant-growth-meristems",
    },
    {
      kind: "quickfire",
      prompt: "What waxy substance coats the epidermis of desert plants to reduce water loss?",
      model_answer: "Cuticle",
      difficulty: "intermediate",
      section: "simple-permanent",
    },
    {
      kind: "quickfire",
      prompt: "Name the complex tissue that transports food (sugars) throughout a plant.",
      model_answer: "Phloem",
      difficulty: "basic",
      section: "complex-permanent",
    },
    {
      kind: "quickfire",
      prompt: "What is the fluid matrix of blood called?",
      model_answer: "Plasma",
      difficulty: "basic",
      section: "animal-connective",
    },
    {
      kind: "quickfire",
      prompt: "Which connective tissue connects muscle to bone?",
      model_answer: "Tendon",
      difficulty: "basic",
      section: "animal-connective",
    },

    // ── OPEN (6) ────────────────────────────────────────────────────
    {
      kind: "open",
      prompt: "Explain why multicellular organisms need tissues, whereas unicellular organisms do not.",
      model_answer: "Unicellular organisms are small enough that a single cell can handle all life processes. Multicellular organisms are large and complex, requiring a division of labour. By grouping into tissues, cells become highly specialised and efficient at specific tasks, allowing the whole organism to survive and grow.",
      difficulty: "intermediate",
      section: "from-cells-to-tissues",
    },
    {
      kind: "open",
      prompt: "Describe the process of differentiation in plants.",
      model_answer: "Differentiation is the process by which young, actively dividing cells from meristematic tissues mature. They lose their ability to divide and take on a specific shape, size, and biological role, thereby becoming permanent tissues.",
      difficulty: "intermediate",
      section: "plant-growth-meristems",
    },
    {
      kind: "open",
      prompt: "Contrast parenchyma and sclerenchyma tissues based on their structure and function.",
      model_answer: "Parenchyma consists of living cells with thin walls; it is loosely packed and primarily functions to store food and water. Sclerenchyma consists of dead, narrow cells with thick, heavily lignified walls; it is tightly packed and functions to provide rigid mechanical strength to the plant.",
      difficulty: "advanced",
      section: "simple-permanent",
    },
    {
      kind: "open",
      prompt: "Why are xylem and phloem referred to as 'complex' permanent tissues?",
      model_answer: "They are called 'complex' because, unlike simple tissues which consist of only one cell type, xylem and phloem are made up of multiple different types of cells (such as vessels, tracheids, fibres, and parenchyma) that work together as a single unit to transport materials.",
      difficulty: "intermediate",
      section: "complex-permanent",
    },
    {
      kind: "open",
      prompt: "How does the structure of epithelial tissue suit its function as a protective barrier?",
      model_answer: "Epithelial cells are tightly packed together with almost no intercellular space, forming continuous sheets. This unbroken structure creates an effective physical barrier that prevents fluid loss and stops pathogens from entering underlying tissues.",
      difficulty: "intermediate",
      section: "animal-epithelial",
    },
    {
      kind: "open",
      prompt: "Explain how skeletal muscle and nervous tissue work together to allow an animal to move.",
      model_answer: "Skeletal muscles are attached to bones and can contract to create movement, but they cannot act on their own. Nervous tissue acts as the control system; neurons rapidly transmit electrical signals from the brain to the muscles, instructing them exactly when and how to contract.",
      difficulty: "advanced",
      section: "animal-muscle-nervous",
    },
  ],
};
