import type { Chapter } from "@/lib/cbse/types";
import {
  buddingHydraPlate,
  flowerPlate,
  maleSystemPlate,
  femaleSystemPlate,
  animalReproductionPlate,
  zygoteEmbryoPlate,
  menstrualCyclePlate,
} from "../figures/ch-11";

export const ch11Reproduction: Chapter = {
  key: "ch-11-reproduction",
  number: 11,
  title: "Reproduction: How Life Continues",
  subject: "science",
  book: "Exploration",
  accent: "#f58fa8",
  summary: "Discover how life perpetuates itself, from single-celled organisms budding to the complex reproductive systems of humans.",
  estMinutes: 20,
  sections: [
    {
      key: "asexual-reproduction",
      title: "Asexual Reproduction",
      eyebrow: "The basics",
      bookRef: "Exploration §11.1",
      body: `You have learnt that one of the important characteristics of living beings is that they reproduce. Every organism has a definite life span — it is born, grows, matures, reproduces and eventually dies. **Reproduction** is a biological process by which living beings produce new individuals of their own kind.

Living beings reproduce in two main ways — asexually, where a single parent produces offspring that are almost exact copies of the parent, and sexually, where offspring inherit a mix of characteristics from two individuals.

### A single parent

**Asexual reproduction** is seen in many unicellular organisms like bacteria and yeast, and simple multicellular organisms like hydra. In hydra, repeated cell division at a specific site on the parent body produces a small outgrowth called a **bud**. The bud enlarges, develops tentacles and a mouth, and eventually separates from the parent to live independently. This process is called **budding**.

Fungi, like the mould that grows on bread, reproduce through **spore formation**. They produce millions of tiny, lightweight spores in sac-like structures. These float through the air waiting for moisture and nutrients to germinate.

### Vegetative propagation

Many types of plants sprout new shoots and roots from their existing vegetative parts (stems, roots, or leaves) without producing seeds. For example, potato tubers, sugarcane cuttings, and *Bryophyllum* leaves all grow into new plants. This is called **vegetative propagation**.

> Asexual reproduction involves only one parent and produces offspring that are genetically identical to the parent, known as clones.

Because there is only one parent, the central process behind asexual reproduction is mitosis. This method is fast and helps organisms increase their population quickly when environmental conditions are favourable.`,
      sim: buddingHydraPlate,
      note: {
        kind: "fact",
        body: "Scientists and horticulturists use vegetative propagation methods like cutting, grafting and tissue culture to cultivate desirable crops on a large scale without waiting for seeds.",
      },
    },
    {
      key: "sexual-reproduction-plants",
      title: "Sexual Reproduction in Plants",
      eyebrow: "Flowers and seeds",
      bookRef: "Exploration §11.2",
      body: `**Sexual reproduction** involves two parents contributing to the genetic material of the offspring. To ensure the chromosome number does not double every generation, organisms use a special type of cell division known as **meiosis**, which halves the chromosome number to form **gametes** (reproductive cells).

In flowering plants (angiosperms), the flower is the reproductive organ. The male part is the **stamen**, consisting of a filament and an anther that produces pollen grains (containing male gametes). The female part is the **pistil**, comprising a stigma, style and ovary. The ovary contains ovules, and each ovule holds an egg cell (the female gamete).

### Pollination and fertilisation

For reproduction to occur, pollen must be transferred from the anther to the stigma — a process called **pollination**.

- **Self-pollination** occurs within the same flower or between flowers of the same plant.
- **Cross-pollination** involves transferring pollen to a flower on a different plant of the same type.

Plants rely on external agents like wind, water, insects or birds to carry the pollen. Insect-pollinated flowers are usually brightly coloured and fragrant to attract bees and butterflies, while wind-pollinated flowers produce millions of lightweight pollen grains.

Once a pollen grain lands on a compatible stigma, it sprouts a pollen tube that grows down the style to the ovary. The male gamete travels through this tube and fuses with the egg cell in the ovule. This fusion is called **fertilisation**.

> Fertilisation is the fusion of a male gamete with a female gamete to form a single-celled zygote, which later develops into an embryo.

After fertilisation, the ovary enlarges to become a fruit, and the ovules inside develop into seeds. When these seeds find suitable soil, they germinate into new plants.`,
      sim: flowerPlate,
      note: {
        kind: "remember",
        body: "The transfer of pollen is called pollination, while the actual fusion of the male and female gametes is called fertilisation.",
      },
    },
    {
      key: "reproduction-animals",
      title: "Sexual Reproduction in Animals",
      eyebrow: "Diverse strategies",
      bookRef: "Exploration §11.3",
      body: `Animals show a wide variety of methods for sexual reproduction. The basic challenge is always the same: ensuring that male and female gametes meet, and that the young ones survive long enough to grow and reproduce.

### Where does fertilisation happen?

In many aquatic animals, such as frogs and most fish, the female releases eggs into the water and the male releases sperm over them. This is called **external fertilisation**. Because eggs are exposed to water currents and predators, these animals produce hundreds or thousands of eggs at a time to ensure at least a few survive.

In reptiles, birds and mammals, fertilisation takes place inside the body of the female. This is called **internal fertilisation**. Here, the gametes are much better protected, increasing the chances of a successful pregnancy.

### Variations in reproduction

Besides fertilisation methods, animals also differ in how their young develop. Animals like hens, frogs and butterflies are **oviparous** (egg-laying), meaning the embryo develops inside an egg outside the mother's body. In contrast, mammals like cows, dogs and humans are **viviparous** (giving birth to live young), where the embryo develops safely inside the mother.

In some oviparous animals, the young hatching from the egg look completely different from the adults. For instance, a caterpillar looks nothing like a butterfly, and a tadpole looks nothing like a frog. This process of drastic change from a larva into an adult is called **metamorphosis**.

### Nutrition and survival

Animals also differ in how they nourish the developing embryo. Fish, amphibians and insects lay eggs containing just enough yolk to produce a **larva**. This larva hatches and must feed itself (often on organic waste) until it accumulates enough energy to transform into an adult — a process clearly seen in butterflies and frogs.

> Reptiles and birds lay eggs that contain enough yolk to completely nourish the embryo until it hatches as a fully formed young one.

In mammals, however, the fertilised egg develops inside the female's body, drawing nutrition directly from the mother. When mammalian young are born, they typically require an extended period of care and are fed via breast milk.`,
      sim: animalReproductionPlate,
      note: {
        kind: "watch-out",
        body: "Animals using external fertilisation must produce vastly more eggs than those using internal fertilisation because the unprotected eggs have a very low survival rate.",
      },
    },
    {
      key: "human-reproductive-system",
      title: "The Human Reproductive System",
      eyebrow: "Male and female organs",
      bookRef: "Exploration §11.5",
      body: `As children grow into adults, their reproductive organs mature and begin producing gametes (sperm in males and eggs in females). This marks the onset of reproductive maturity.

### The male system

The male reproductive system produces male gametes called **sperm**. These are generated in two oval-shaped organs called **testes**, which are housed outside the abdominal cavity in a pouch called the **scrotum**. This keeps them slightly cooler than the rest of the body, which is essential for healthy sperm production.

Sperm travel from the testes through a tube called the **vas deferens**. Along the way, glands like the **seminal vesicles** and the **prostate** add nutrient-rich and alkaline fluids to nourish the sperm and keep them active. This mixture of fluid and sperm is called semen, which exits the body through the **urethra** inside the penis.

### The female system

The female reproductive system is designed to produce eggs and nourish a growing baby. It features a pair of **ovaries** which store and release female gametes (**eggs** or ova).

Each ovary is connected to a funnel-like tube called the **oviduct** (or fallopian tube). The oviducts lead to the **uterus**, a muscular, bag-like structure where a foetus develops. The uterus opens through a narrow passage called the **cervix** into the **vagina**, a muscular canal that receives sperm during intercourse and serves as the birth canal.

> Gametogenesis is the process of forming gametes by meiosis. In human males, it produces millions of tiny, motile sperm; in females, it produces a single, large, non-motile egg each month.`,
      sim: maleSystemPlate,
      figures: [femaleSystemPlate],
      note: {
        kind: "fact",
        body: "Male and female gametes differ greatly: sperm are tiny, produced in millions, and actively swim, whereas eggs are large, packed with nutrients, and non-motile.",
      },
    },
    {
      key: "fertilisation-and-pregnancy",
      title: "Fertilisation and Pregnancy",
      eyebrow: "New life begins",
      bookRef: "Exploration §11.5",
      body: `From puberty onwards, one of a woman's ovaries usually releases one mature egg every month — a process called **ovulation**. At the same time, the inner lining of the uterus thickens in preparation for a potential pregnancy.

If sexual intercourse occurs, millions of sperm swim through the vagina, past the cervix, and into the oviducts. If one sperm successfully fuses with the egg there, a **zygote** is formed. This single fertilised cell immediately begins dividing into a ball of cells as it travels down to the uterus. It then embeds itself into the thick uterine lining, an event known as implantation, which marks the start of **pregnancy**.

### What if fertilisation fails?

If the egg is not fertilised, it survives for about a day before breaking down. The thickened uterine lining is no longer needed, so it sheds. The lining and blood exit the body through the vagina in a process called **menstruation** (or a period). This cycle of ovulation and menstruation typically repeats every 28 days.

### Growing a baby

Human pregnancy lasts about nine months and is divided into three trimesters. The developing embryo implants in the uterine wall, where a special disc-like tissue called the **placenta** forms. The placenta connects the mother's blood supply to the foetus via the umbilical cord, providing oxygen and essential nutrients while removing waste products. In the first two months, the major organs form, and the embryo becomes known as a **foetus**. The uterus protects and nourishes the baby throughout. During childbirth, strong muscular contractions push the fully grown foetus out through the birth canal.

> The mother's health is critical during pregnancy. A balanced diet, adequate rest, and avoiding harmful substances are essential for the baby's safe development.`,
      sim: zygoteEmbryoPlate,
      note: {
        kind: "exam-tip",
        body: "Fertilisation usually takes place in the oviduct (fallopian tube), not in the uterus. The uterus is where the embryo implants and develops.",
      },
    },
    {
      key: "reproductive-health",
      title: "Reproductive Health and Choices",
      eyebrow: "Maturity and safety",
      bookRef: "Exploration §11.5",
      body: `During adolescence, the body gradually becomes capable of reproduction, marked by changes like the onset of the menstrual cycle in females. However, physical readiness does not mean a person is emotionally or socially prepared for adult responsibilities. Emotional maturity — handling feelings and making thoughtful decisions — takes much longer to develop.

Responsible choices are necessary to prevent unplanned pregnancies and **Sexually Transmitted Infections (STIs)**. STIs, such as gonorrhoea, syphilis, and HIV, can be transmitted during close physical contact. Using barrier methods, like condoms, is highly effective at preventing the spread of these infections and keeping individuals healthy. Maintaining personal hygiene during menstruation is also a vital part of reproductive health.

### Preventing unwanted pregnancy

There are several **contraceptive** methods available to avoid unwanted pregnancies:

- **Barrier methods**: Condoms prevent sperm from reaching the egg.
- **Oral pills**: Medicines that alter hormone levels to stop the ovaries from releasing an egg.
- **Intra-Uterine Devices (IUDs)**: Devices like the Copper-T are placed inside the uterus by a doctor to prevent implantation.
- **Surgical methods**: Blocking the vas deferens in males or the fallopian tubes in females to permanently prevent sperm and egg from meeting.

> Contraception allows individuals to plan their families and avoid unwanted pregnancies, while barrier methods uniquely provide protection against sexually transmitted infections.

In certain cases, unwanted pregnancies are terminated via surgery (abortion). However, using this procedure for prenatal sex determination (selective abortion based on gender) is strictly prohibited by law in India to maintain a healthy societal sex ratio.`,
      sim: menstrualCyclePlate,
      note: {
        kind: "watch-out",
        body: "Oral pills and IUDs prevent pregnancy but offer no protection against Sexually Transmitted Infections (STIs). Only barrier methods like condoms do both.",
      },
    }
  ],
  questions: [
    // ── MCQ (20) ────────────────────────────────────────────────────
    {
      kind: "mcq",
      prompt: "Which of the following organisms primarily reproduces through budding?",
      options: ["Amoeba", "Hydra", "Bacteria", "Mould"],
      correct_index: 1,
      model_answer: "Hydra reproduces by budding, where an outgrowth on its body develops into a new individual.",
      difficulty: "basic",
      section: "asexual-reproduction",
    },
    {
      kind: "mcq",
      prompt: "What is the key advantage of asexual reproduction?",
      options: ["It produces genetic variations", "It allows a rapid increase in population", "It creates offspring better adapted to new environments", "It requires two parents"],
      correct_index: 1,
      model_answer: "Asexual reproduction only requires one parent and cell division via mitosis, making it a very fast way to increase population size.",
      difficulty: "intermediate",
      section: "asexual-reproduction",
    },
    {
      kind: "mcq",
      prompt: "Which part of the flower produces pollen grains?",
      options: ["Stigma", "Ovary", "Anther", "Sepal"],
      correct_index: 2,
      model_answer: "The anther is the swollen tip of the stamen that produces and stores powdery pollen grains.",
      difficulty: "basic",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "mcq",
      prompt: "What develops into a seed after fertilisation in a plant?",
      options: ["Ovary", "Stigma", "Ovule", "Pollen tube"],
      correct_index: 2,
      model_answer: "After fertilisation, the ovule inside the ovary develops into a seed, while the ovary itself becomes a fruit.",
      difficulty: "basic",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "mcq",
      prompt: "Why do insect-pollinated flowers usually have bright, large petals?",
      options: ["To protect the pollen from rain", "To attract pollinators like bees and butterflies", "To catch pollen blowing in the wind", "To perform photosynthesis more efficiently"],
      correct_index: 1,
      model_answer: "Bright colours and fragrances act as signals to attract insects, which carry pollen from one flower to another.",
      difficulty: "intermediate",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "mcq",
      prompt: "What type of cell division halves the chromosome number to form gametes?",
      options: ["Mitosis", "Meiosis", "Budding", "Vegetative propagation"],
      correct_index: 1,
      model_answer: "Meiosis is a special cell division that halves the chromosome count, ensuring the zygote has the correct number after fertilisation.",
      difficulty: "basic",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "mcq",
      prompt: "Which of these animals relies on external fertilisation?",
      options: ["Lizard", "Bird", "Frog", "Human"],
      correct_index: 2,
      model_answer: "Frogs lay eggs in water, and the male releases sperm over them outside the body.",
      difficulty: "basic",
      section: "reproduction-animals",
    },
    {
      kind: "mcq",
      prompt: "Why do animals that use external fertilisation produce thousands of eggs?",
      options: ["Because the mother has excess yolk", "To increase the chances that a few survive predators and water currents", "Because internal fertilisation is impossible underwater", "To feed the developing larvae"],
      correct_index: 1,
      model_answer: "Eggs left in water are highly vulnerable, so producing them in massive numbers offsets the high mortality rate.",
      difficulty: "intermediate",
      section: "reproduction-animals",
    },
    {
      kind: "mcq",
      prompt: "What is the function of the scrotum in the male reproductive system?",
      options: ["To produce testosterone", "To store mature sperm before ejaculation", "To keep the testes cooler than normal body temperature", "To add nutrient fluid to semen"],
      correct_index: 2,
      model_answer: "The scrotum hangs outside the body cavity, maintaining a lower temperature required for healthy sperm production.",
      difficulty: "intermediate",
      section: "human-reproductive-system",
    },
    {
      kind: "mcq",
      prompt: "Where does fertilisation typically occur in the human female reproductive system?",
      options: ["Uterus", "Ovary", "Vagina", "Oviduct (Fallopian tube)"],
      correct_index: 3,
      model_answer: "Fertilisation happens when a swimming sperm meets the egg in the oviduct, before the egg reaches the uterus.",
      difficulty: "advanced",
      section: "fertilisation-and-pregnancy",
    },
    {
      kind: "mcq",
      prompt: "What happens if a released human egg is not fertilised?",
      options: ["It returns to the ovary", "It implants in the uterus anyway", "The uterine lining sheds, causing menstruation", "It develops into a cyst"],
      correct_index: 2,
      model_answer: "An unfertilised egg breaks down, and the thickened uterine lining sheds along with blood during menstruation.",
      difficulty: "basic",
      section: "fertilisation-and-pregnancy",
    },
    {
      kind: "mcq",
      prompt: "Which of the following describes a zygote?",
      options: ["An unfertilised egg", "A single cell formed by the fusion of male and female gametes", "A fully formed foetus", "A male gamete"],
      correct_index: 1,
      model_answer: "A zygote is the single-celled result of fertilisation, combining genetic material from both parents.",
      difficulty: "basic",
      section: "fertilisation-and-pregnancy",
    },
    {
      kind: "mcq",
      prompt: "What is the primary function of the prostate gland?",
      options: ["To produce sperm", "To store urine", "To add alkaline fluid to semen to protect sperm", "To produce testosterone"],
      correct_index: 2,
      model_answer: "The prostate adds fluid that helps neutralise the acidic environment of the female reproductive tract, protecting the sperm.",
      difficulty: "advanced",
      section: "human-reproductive-system",
    },
    {
      kind: "mcq",
      prompt: "Which contraceptive method also protects against Sexually Transmitted Infections (STIs)?",
      options: ["Oral pills", "Copper-T (IUD)", "Condoms", "Surgical blocking of fallopian tubes"],
      correct_index: 2,
      model_answer: "Condoms act as a physical barrier that prevents fluid exchange, uniquely protecting against STIs as well as pregnancy.",
      difficulty: "intermediate",
      section: "reproductive-health",
    },
    {
      kind: "mcq",
      prompt: "Why is prenatal sex determination prohibited by law in India?",
      options: ["It is medically unsafe for the mother", "It can lead to a skewed societal sex ratio due to selective abortion", "It causes genetic abnormalities", "It interferes with the natural birth process"],
      correct_index: 1,
      model_answer: "The law prevents self-selective abortion based on gender, which harms the natural sex ratio in society.",
      difficulty: "intermediate",
      section: "reproductive-health",
    },
    {
      kind: "mcq",
      prompt: "Which part of the plant seed provides nutrition to the growing seedling?",
      options: ["Seed coat", "Cotyledon", "Radicle", "Plumule"],
      correct_index: 1,
      model_answer: "The cotyledons store food to nourish the embryonic plant until it can grow leaves and photosynthesise.",
      difficulty: "intermediate",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "mcq",
      prompt: "What is the term for a fertilised egg after it has been developing for two months in the uterus?",
      options: ["Zygote", "Embryo", "Foetus", "Larva"],
      correct_index: 2,
      model_answer: "After the major organs have started forming (around the ninth week), the embryo is referred to as a foetus.",
      difficulty: "basic",
      section: "fertilisation-and-pregnancy",
    },
    {
      kind: "mcq",
      prompt: "Which of the following STIs is caused by a virus?",
      options: ["Syphilis", "Gonorrhoea", "HIV", "Malaria"],
      correct_index: 2,
      model_answer: "HIV is a viral infection that can lead to AIDS, whereas syphilis and gonorrhoea are bacterial.",
      difficulty: "advanced",
      section: "reproductive-health",
    },
    {
      kind: "mcq",
      prompt: "How does an Intra-Uterine Device (IUD) like Copper-T prevent pregnancy?",
      options: ["By preventing ovulation", "By killing sperm before they enter the vagina", "By being placed in the uterus to prevent implantation", "By blocking the vas deferens"],
      correct_index: 2,
      model_answer: "An IUD is placed inside the uterus to create an environment that stops a fertilised egg from implanting.",
      difficulty: "intermediate",
      section: "reproductive-health",
    },
    {
      kind: "mcq",
      prompt: "Why do fungi produce spores in such massive numbers?",
      options: ["Because spores are very heavy and sink", "To increase the likelihood that some land in a suitable moist, warm environment", "Because most spores are eaten by insects", "Because fungi are multicellular"],
      correct_index: 1,
      model_answer: "Spores are dispersed randomly by air; producing millions ensures a few will find the exact moisture and nutrients needed to grow.",
      difficulty: "advanced",
      section: "asexual-reproduction",
    },

    // ── TRUE/FALSE (10) ─────────────────────────────────────────────
    {
      kind: "truefalse",
      prompt: "Asexual reproduction always involves two parents.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "Asexual reproduction requires only a single parent and produces genetically identical offspring.",
      difficulty: "basic",
      section: "asexual-reproduction",
    },
    {
      kind: "truefalse",
      prompt: "In flowering plants, the ovary develops into a fruit after fertilisation.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "After fertilisation, the ovary enlarges and ripens into a fruit to protect the seeds.",
      difficulty: "basic",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "truefalse",
      prompt: "Birds and reptiles use external fertilisation.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "Birds and reptiles use internal fertilisation, protecting the gametes inside the female's body before laying eggs.",
      difficulty: "basic",
      section: "reproduction-animals",
    },
    {
      kind: "truefalse",
      prompt: "The human male urethra carries both urine and semen.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "The urethra is a common passage for both systems in males, unlike in females where the passages are separate.",
      difficulty: "intermediate",
      section: "human-reproductive-system",
    },
    {
      kind: "truefalse",
      prompt: "Menstruation occurs when a fertilised egg successfully implants in the uterus.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "Menstruation occurs when the egg is NOT fertilised, causing the unneeded uterine lining to shed.",
      difficulty: "basic",
      section: "fertilisation-and-pregnancy",
    },
    {
      kind: "truefalse",
      prompt: "Oral contraceptive pills protect against Sexually Transmitted Infections (STIs).",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "Pills only alter hormones to prevent pregnancy; they provide no physical barrier against STIs.",
      difficulty: "intermediate",
      section: "reproductive-health",
    },
    {
      kind: "truefalse",
      prompt: "A zygote has half the normal number of chromosomes.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "Gametes have half the chromosomes. When they fuse, the resulting zygote has the full, normal number of chromosomes.",
      difficulty: "advanced",
      section: "fertilisation-and-pregnancy",
    },
    {
      kind: "truefalse",
      prompt: "Vegetative propagation allows farmers to grow plants that are genetically identical to the parent.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "Because vegetative propagation is a form of asexual reproduction, all offspring are exact clones.",
      difficulty: "intermediate",
      section: "asexual-reproduction",
    },
    {
      kind: "truefalse",
      prompt: "Wind-pollinated flowers are usually large, brightly coloured and highly fragrant.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "Wind-pollinated flowers do not need to attract insects, so they are typically small and lack bright colours or scents.",
      difficulty: "intermediate",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "truefalse",
      prompt: "The cervix is a narrow passage that connects the uterus to the vagina.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "The cervix acts as a gateway at the base of the uterus, dilating during childbirth to allow the baby to pass.",
      difficulty: "basic",
      section: "human-reproductive-system",
    },

    // ── MULTI (8) ───────────────────────────────────────────────────
    {
      kind: "multi",
      prompt: "Which of the following organisms reproduce asexually? (Select all that apply)",
      options: ["Hydra", "Human", "Yeast", "Dog"],
      correct_indices: [0, 2],
      model_answer: "Hydra reproduces by budding and yeast by budding/spores, both being asexual methods. Humans and dogs reproduce sexually.",
      difficulty: "basic",
      section: "asexual-reproduction",
    },
    {
      kind: "multi",
      prompt: "Which of the following are parts of the female pistil in a flower? (Select all that apply)",
      options: ["Stigma", "Anther", "Style", "Ovary"],
      correct_indices: [0, 2, 3],
      model_answer: "The pistil consists of the stigma at the top, the style as the stalk, and the ovary at the base. The anther is a male part.",
      difficulty: "basic",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "multi",
      prompt: "Which of the following statements are true about internal fertilisation? (Select all that apply)",
      options: ["It occurs outside the female's body", "It provides better protection for the gametes", "It is used by reptiles and mammals", "It usually involves producing thousands of eggs"],
      correct_indices: [1, 2],
      model_answer: "Internal fertilisation happens inside the body (protecting gametes) and is used by reptiles, birds, and mammals. Because survival rates are higher, fewer eggs are needed.",
      difficulty: "intermediate",
      section: "reproduction-animals",
    },
    {
      kind: "multi",
      prompt: "Which glands add fluid to the sperm to create semen? (Select all that apply)",
      options: ["Testes", "Seminal vesicles", "Prostate gland", "Scrotum"],
      correct_indices: [1, 2],
      model_answer: "The seminal vesicles and prostate gland secrete fluids that nourish and protect the sperm.",
      difficulty: "intermediate",
      section: "human-reproductive-system",
    },
    {
      kind: "multi",
      prompt: "Which of the following represent barrier methods of contraception? (Select all that apply)",
      options: ["Condoms", "Oral pills", "Vaginal covers", "Copper-T"],
      correct_indices: [0, 2],
      model_answer: "Condoms and vaginal covers physically block sperm from reaching the egg. Pills alter hormones and Copper-T is an IUD.",
      difficulty: "basic",
      section: "reproductive-health",
    },
    {
      kind: "multi",
      prompt: "What changes occur in the uterus during a regular menstrual cycle if no fertilisation happens? (Select all that apply)",
      options: ["The inner lining thickens with blood vessels", "The foetus begins to grow", "The lining sheds through the vagina", "The ovary moves into the uterus"],
      correct_indices: [0, 2],
      model_answer: "The lining first thickens to prepare for an embryo. When fertilisation fails, that thickened lining breaks down and sheds.",
      difficulty: "advanced",
      section: "fertilisation-and-pregnancy",
    },
    {
      kind: "multi",
      prompt: "Which of these are advantages of vegetative propagation? (Select all that apply)",
      options: ["It introduces new genetic traits", "It is faster than growing plants from seeds", "It allows multiplication of seedless plants", "It relies entirely on wind pollination"],
      correct_indices: [1, 2],
      model_answer: "Vegetative propagation is fast and works perfectly for plants that do not produce viable seeds, like some bananas and roses.",
      difficulty: "advanced",
      section: "asexual-reproduction",
    },
    {
      kind: "multi",
      prompt: "Which of the following are Sexually Transmitted Infections (STIs)? (Select all that apply)",
      options: ["Gonorrhoea", "Typhoid", "HIV", "Syphilis"],
      correct_indices: [0, 2, 3],
      model_answer: "Gonorrhoea, HIV, and Syphilis are transmitted through sexual contact. Typhoid is transmitted through contaminated food or water.",
      difficulty: "intermediate",
      section: "reproductive-health",
    },

    // ── QUICKFIRE (6) ───────────────────────────────────────────────
    {
      kind: "quickfire",
      prompt: "What is the single-celled structure formed immediately after fertilisation called?",
      model_answer: "Zygote",
      difficulty: "basic",
      section: "fertilisation-and-pregnancy",
    },
    {
      kind: "quickfire",
      prompt: "Name the process by which a hydra reproduces asexually.",
      model_answer: "Budding",
      difficulty: "basic",
      section: "asexual-reproduction",
    },
    {
      kind: "quickfire",
      prompt: "Which part of a flower attracts insects for pollination?",
      model_answer: "Petal",
      difficulty: "basic",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "quickfire",
      prompt: "What is the name of the male gamete in humans?",
      model_answer: "Sperm",
      difficulty: "basic",
      section: "human-reproductive-system",
    },
    {
      kind: "quickfire",
      prompt: "Name the viral STI that can eventually lead to AIDS.",
      model_answer: "HIV",
      difficulty: "intermediate",
      section: "reproductive-health",
    },
    {
      kind: "quickfire",
      prompt: "Which type of fertilisation do frogs use?",
      model_answer: "External",
      difficulty: "intermediate",
      section: "reproduction-animals",
    },

    // ── OPEN (6) ────────────────────────────────────────────────────
    {
      kind: "open",
      prompt: "Explain why meiosis is essential for sexual reproduction.",
      model_answer: "Meiosis halves the number of chromosomes in the gametes. This ensures that when the male and female gametes fuse during fertilisation, the resulting zygote has the normal, correct number of chromosomes rather than double the amount.",
      difficulty: "advanced",
      section: "sexual-reproduction-plants",
    },
    {
      kind: "open",
      prompt: "Compare the survival strategies of animals that use external fertilisation with those that use internal fertilisation.",
      model_answer: "Animals with external fertilisation lay thousands of eggs in water to counter the high risk of predation and environmental damage. In contrast, internal fertilisation protects the gametes inside the female's body, significantly increasing survival chances, which allows these animals to produce far fewer eggs.",
      difficulty: "intermediate",
      section: "reproduction-animals",
    },
    {
      kind: "open",
      prompt: "Describe the journey of a sperm cell in the human male reproductive system from production to ejaculation.",
      model_answer: "Sperm are produced in the testes within the scrotum. They travel up through the vas deferens, where fluids from the seminal vesicles and prostate gland are added to create semen. Finally, the semen is expelled through the urethra in the penis.",
      difficulty: "intermediate",
      section: "human-reproductive-system",
    },
    {
      kind: "open",
      prompt: "What is the biological purpose of menstruation, and under what condition does it occur?",
      model_answer: "Menstruation is the shedding of the thickened uterine lining and blood. It occurs when the released egg is not fertilised. The body discards the lining because it is no longer needed to nourish a developing embryo.",
      difficulty: "intermediate",
      section: "fertilisation-and-pregnancy",
    },
    {
      kind: "open",
      prompt: "Why are condoms considered a dual-purpose contraceptive method, unlike oral pills?",
      model_answer: "Condoms act as a physical barrier that stops sperm from reaching the egg, preventing pregnancy, and also prevents the exchange of bodily fluids, thus protecting against Sexually Transmitted Infections (STIs). Oral pills only alter hormones to prevent pregnancy but offer no protection against STIs.",
      difficulty: "advanced",
      section: "reproductive-health",
    },
    {
      kind: "open",
      prompt: "How does vegetative propagation benefit agricultural practices?",
      model_answer: "It allows farmers to produce a large number of genetically identical plants quickly, ensuring that desirable traits are maintained. It is also the only way to propagate seedless plant varieties like bananas or certain grapes.",
      difficulty: "intermediate",
      section: "asexual-reproduction",
    }
  ],
};
