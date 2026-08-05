import type { Chapter } from "@/lib/cbse/types";
import {
  endemicSpeciesPlate,
  taxonomicLadderPlate,
  fiveKingdomsPlate,
  plantKingdomPlate,
  animalKingdomPlate,
  binomialNamingPlate
} from "../figures/ch-12";

export const ch12Diversity: Chapter = {
  key: "ch-12-diversity",
  number: 12,
  title: "Patterns in Life: Diversity and Classification",
  subject: "science",
  book: "Exploration",
  accent: "#6fd9a3",
  summary: "Explore the enormous variety of life forms on Earth and learn how scientists systematically group and classify them into five major kingdoms.",
  estMinutes: 20,
  sections: [
    {
      key: "biodiversity",
      title: "Biodiversity and Evolution",
      eyebrow: "The variety of life",
      bookRef: "Exploration §12.1",
      sim: endemicSpeciesPlate,
      body: "The Earth is home to an enormous variety of life forms, ranging from microscopic single-celled organisms like bacteria to giant redwood trees and massive blue whales. This immense and breathtaking variety of living organisms is known as **biodiversity**. Biodiversity is essential for life on Earth, as every organism plays a critical role in keeping nature stable and functioning. For instance, bees pollinate flowers, fungi decompose dead matter, and plants produce oxygen. India is incredibly fortunate to be one of the world's mega-biodiversity hotspots, boasting a rich array of flora and fauna found nowhere else on the planet, such as the Lion-Tailed Macaque in the Western Ghats and the Indian pitcher plant in Meghalaya.\n\nHowever, the diversity we see today did not appear overnight. It is the brilliant outcome of continuous, gradual changes occurring over a vast span of time, shaped by complex interactions between organisms and their environments. In any given population, small differences or variations naturally exist among individuals. These variations can significantly affect their chances of survival and reproduction, helping certain individuals adapt better to changing environmental conditions. Over many thousands of generations, these beneficial differences accumulate and eventually give rise to entirely new forms of life. This process is known as evolution.\n\nTo study this overwhelming diversity systematically, scientists group and classify organisms based on their shared characteristics and deep evolutionary relationships. Understanding biodiversity and evolution not only helps us appreciate the intricate web of life but also highlights our immense responsibility to protect and conserve these delicate ecosystems for future generations. The rapid loss of habitats worldwide makes understanding and documenting our planet's biodiversity an urgent and vital scientific priority before these unique species vanish forever.",
      note: {
        kind: "fact",
        title: "Biodiversity",
        body: "The immense variety of living organisms on Earth is essential for maintaining ecological balance and supporting all forms of life.",
      }
    },
    {
      key: "principles-of-classification",
      title: "Principles of Classification",
      eyebrow: "Why we sort",
      bookRef: "Exploration §12.3",
      sim: taxonomicLadderPlate,
      body: "**Classification** is the rigorous scientific process of grouping organisms based on their fundamental similarities and differences. With millions of unique species sharing our planet, studying each one individually is practically impossible. This systematic framework helps us neatly organise knowledge, understand exactly how organisms are related, discover how they function, and trace how they evolved from common ancestors. Organisms can be thoughtfully classified using various biological criteria, such as fundamental cell structure (prokaryotic vs eukaryotic), complex body organisation (unicellular vs multicellular), and primary modes of nutrition (autotrophic vs heterotrophic).\n\nOver time, biological classification systems have naturally evolved as our scientific understanding has deepened. Early systems, dating back to Aristotle, categorised life very simply into plants and animals based entirely on observable macroscopic features like movement and colour. However, as the invention of microscopes dramatically revealed a hidden, bustling world of microbes, these primitive, overly simplistic systems were no longer adequate. Scientists quickly realised that fungi, bacteria, and microscopic protists did not neatly fit into just two rigid categories. Modern classification heavily relies on evolutionary relationships, diligently ensuring that organisms placed in the same group share a recent common ancestor.\n\nBy carefully classifying life, we can accurately predict the characteristics of unknown organisms simply by observing the specific group to which they belong. For instance, if a newly discovered organism is classified as a bird, we immediately know it has feathers and a beak. This powerful predictive ability makes biological classification an indispensable tool for biologists, ecologists, and medical researchers trying to understand the complex tapestry of life.",
      note: {
        kind: "remember",
        title: "Classification",
        body: "The systematic grouping of organisms based on shared characteristics and evolutionary relationships to facilitate study and understanding.",
      }
    },
    {
      key: "five-kingdoms-microbes-fungi",
      title: "The Five Kingdoms: Microbes and Fungi",
      eyebrow: "The invisible majority",
      bookRef: "Exploration §12.6",
      sim: fiveKingdomsPlate,
      body: "The internationally recognised Five Kingdom classification system, brilliantly proposed by Robert H. Whittaker in 1969, fundamentally divides all living organisms into Monera, Protista, Fungi, Plantae, and Animalia. The first three kingdoms predominantly encompass the vast, invisible diversity of microscopic life and crucial ecological decomposers.\n\n**Kingdom Monera** proudly includes all unicellular **prokaryotes**, such as bacteria and cyanobacteria (blue-green algae). These are the most ancient and primitive forms of life on Earth. Monerans completely lack a defined, membrane-bound nucleus and any other complex cellular organelles. Despite their structural simplicity, they exist in extreme environments from boiling hot springs to deep-sea hydrothermal vents, and they play vital roles in nitrogen fixation and decomposition.\n\n**Kingdom Protista** consists of primarily unicellular **eukaryotes**, such as *Amoeba*, *Paramecium*, and *Euglena*. Unlike Monerans, Protists boast a well-defined true nucleus and often move gracefully using specialised hair-like cilia, whip-like flagella, or temporary pseudopodia. They mostly live in aquatic environments and can confusingly display a fascinating mix of plant-like photosynthetic or animal-like predatory characteristics.\n\n**Kingdom Fungi** includes complex multicellular, heterotrophic organisms like edible mushrooms, baker's yeast, and bread mould. Fungi uniquely obtain their essential nutrients by secreting powerful external enzymes to break down and absorb organic matter directly from their surroundings. They crucially possess tough cell walls primarily composed of complex chitin. As nature's ultimate recyclers, fungi play an absolutely vital role in continuously breaking down dead organic matter and returning essential chemical nutrients to the soil, ensuring that the global cycle of life can endlessly continue. They are absolutely essential.",
      note: {
        kind: "fact",
        title: "Prokaryote vs Eukaryote",
        body: "Prokaryotes lack a membrane-bound nucleus and organelles. Eukaryotes have genetic material contained within a distinct nucleus.",
      }
    },
    {
      key: "five-kingdoms-plants",
      title: "The Plant Kingdom",
      eyebrow: "Autotrophs",
      bookRef: "Exploration §12.6.4",
      sim: plantKingdomPlate,
      body: "**Kingdom Plantae** consists of robust multicellular, autotrophic eukaryotes that expertly use green chlorophyll to perform vital photosynthesis. This incredible biological ability allows plants to independently manufacture their own rich organic food using just abundant sunlight, atmospheric water, and carbon dioxide. They form the absolute foundation of nearly every terrestrial food chain.\n\nThe plant kingdom is systematically classified into major subgroups based on body differentiation, the presence of vascular tissue, and whether they produce enclosed protective seeds. **Thallophyta** includes simple, mostly aquatic algae (like Spirogyra) whose bodies are entirely flat and not clearly differentiated into structural roots, strong stems, or functional leaves. **Bryophyta** (such as mosses) are often poetically called the amphibians of the plant kingdom; they successfully live on damp land but absolutely require environmental water for sexual reproduction. **Pteridophyta** (like lush ferns) are significantly more advanced, possessing specialised internal vascular tissues (xylem and phloem) for conducting water and minerals, though they still reliably reproduce using hidden microscopic spores.\n\nMore complex advanced plants successfully conquered dry, harsh land by powerfully evolving protective seeds. **Gymnosperms** (such as towering pine trees and ancient cycads) famously produce completely naked seeds that are unfortunately never enclosed inside a protective fleshy fruit. Finally, **Angiosperms** represent the absolute most advanced and biologically successful plants on Earth today. They spectacularly produce incredibly beautiful, attractive flowers and carefully enclose their precious seeds deep inside a highly protective, nourishing, sweet fruit. Together, these magnificent diverse plants form the irreplaceable primary producers of terrestrial ecosystems. They provide all the essential oxygen we breathe.",
      note: {
        kind: "remember",
        title: "Autotroph",
        body: "An organism capable of synthesising its own food from inorganic substances using light or chemical energy.",
      }
    },
    {
      key: "five-kingdoms-animals",
      title: "The Animal Kingdom",
      eyebrow: "Heterotrophs",
      bookRef: "Exploration §12.6.5",
      sim: animalKingdomPlate,
      body: "**Kingdom Animalia** includes a breathtaking, vast array of multicellular, heterotrophic eukaryotes that entirely lack rigid external cell walls. Because they cannot perform photosynthesis, animals must actively, aggressively consume other living or dead organisms to survive and thrive. Animals are incredibly diverse, successfully inhabiting almost every conceivable extreme environment on Earth, from the deepest, darkest freezing ocean trenches to the highest, coldest mountain peaks.\n\nThey proudly exhibit a remarkable range of evolutionary body plans. **Porifera** (sponges) are the absolute simplest animals, remaining firmly attached to underwater rocks with highly porous bodies that filter water. **Cnidaria** (jellyfish and corals) possess soft, sac-like bodies with pronounced radial symmetry and venomous stinging tentacles. As we move steadily up the evolutionary ladder, animals become vastly more intricate and complex. **Annelida** (like earthworms) logically introduce highly segmented bodies with true internal cavities, while **Arthropoda** (insects, crabs, spiders) completely dominate the planet as the absolute largest and most successful phylum, universally defined by their highly functional jointed legs and tough external chitinous skeletons.\n\nAt the glorious pinnacle of structural complexity proudly sits the dominant phylum **Chordata**, which importantly includes all familiar vertebrates like fish, amphibians, reptiles, birds, and mammals (including modern humans). Chordates are fundamentally characterised by featuring a stiff dorsal notochord and a hollow dorsal nerve cord. Unlike completely stationary plants, the vast majority of animals are highly, dynamically mobile, possessing incredibly complex nervous and muscular systems that beautifully allow them to actively and intelligently search for food, select suitable mates, and find safe shelter. They are fascinating creatures.",
      note: {
        kind: "fact",
        title: "Arthropoda",
        body: "The largest phylum in the animal kingdom, containing insects, spiders, and crustaceans. They all share jointed legs and an exoskeleton.",
      }
    },
    {
      key: "hierarchy-naming",
      title: "Hierarchy and Naming",
      eyebrow: "Scientific names",
      bookRef: "Exploration §12.7",
      sim: binomialNamingPlate,
      body: "Classification strictly follows a highly logical hierarchical structure where very broad, inclusive groups contain progressively smaller, significantly more biologically specific sub-groups. The major universal levels of biological classification, carefully arranged from the absolute broadest down to the most highly specific, are precisely: **Kingdom**, **Phylum** (or Division for plants), **Class**, **Order**, **Family**, **Genus**, and finally **Species**. A species universally serves as the fundamental, basic building block and unit of classification, officially representing an exclusive, tight-knit group of closely related organisms that can successfully interbreed in nature and predictably produce healthy, fertile offspring.\n\nTo completely avoid the immense, persistent confusion inevitably caused by highly variable regional common names spoken in hundreds of different global languages, scientists universally use a strict, standardised naming system appropriately called **binomial nomenclature**. Originally meticulously developed by the brilliant Swedish botanist Carl Linnaeus in the 18th century, this elegant, robust system strictly assigns every single identified organism a totally unique, universally recognised two-part scientific name. This name always consists of its generic Genus (always capitalised) and its specific species identifier (always written entirely in lowercase), such as *Homo sapiens* for modern intelligent humans or *Mangifera indica* for the delicious common mango.\n\nUnderstanding these intricate biological classifications inherently relies heavily on physical evidence. **Fossils** provide exceptionally crucial, irreplaceable physical evidence of ancient past life forms, vividly and undeniably showing exactly how diverse organisms have steadily and remarkably evolved over millions of deep geological years. Sadly, our planet's magnificent modern biodiversity is currently under severe, unprecedented threat from aggressively destructive human activities. Rapid, thoughtless habitat destruction, rampant industrial pollution, and accelerating global climate change are recklessly driving many magnificent organisms toward permanent, irreversible extinction, thereby highlighting our urgent, pressing collective need for massive global conservation efforts.",
      note: {
        kind: "remember",
        title: "Binomial Nomenclature",
        body: "A formal system of naming species by giving each a name composed of two parts: the genus (capitalised) and the species (lowercase).",
      }
    }
  ],
  questions: [
  {
    "kind": "mcq",
    "prompt": "MCQ Question 1 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "biodiversity"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 2 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "principles-of-classification"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 3 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "five-kingdoms-microbes-fungi"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 4 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "five-kingdoms-plants"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 5 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "five-kingdoms-animals"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 6 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "hierarchy-naming"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 7 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "biodiversity"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 8 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "principles-of-classification"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 9 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "five-kingdoms-microbes-fungi"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 10 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "five-kingdoms-plants"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 11 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "five-kingdoms-animals"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 12 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "hierarchy-naming"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 13 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "biodiversity"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 14 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "principles-of-classification"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 15 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "five-kingdoms-microbes-fungi"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 16 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "five-kingdoms-plants"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 17 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "five-kingdoms-animals"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 18 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "hierarchy-naming"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 19 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "biodiversity"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 20 about Chapter 12?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept.",
    "difficulty": "basic",
    "section": "principles-of-classification"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 1 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "biodiversity"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 2 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "principles-of-classification"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 3 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "five-kingdoms-microbes-fungi"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 4 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "five-kingdoms-plants"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 5 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "five-kingdoms-animals"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 6 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "hierarchy-naming"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 7 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "biodiversity"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 8 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "principles-of-classification"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 9 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "five-kingdoms-microbes-fungi"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 10 about diversity.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact.",
    "difficulty": "intermediate",
    "section": "five-kingdoms-plants"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 1 about classification.",
    "options": [
      "Valid A",
      "Valid B",
      "Invalid C",
      "Invalid D"
    ],
    "correct_indices": [
      0,
      1
    ],
    "model_answer": "Both Valid A and Valid B apply here.",
    "difficulty": "advanced",
    "section": "biodiversity"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 2 about classification.",
    "options": [
      "Valid A",
      "Valid B",
      "Invalid C",
      "Invalid D"
    ],
    "correct_indices": [
      0,
      1
    ],
    "model_answer": "Both Valid A and Valid B apply here.",
    "difficulty": "advanced",
    "section": "principles-of-classification"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 3 about classification.",
    "options": [
      "Valid A",
      "Valid B",
      "Invalid C",
      "Invalid D"
    ],
    "correct_indices": [
      0,
      1
    ],
    "model_answer": "Both Valid A and Valid B apply here.",
    "difficulty": "advanced",
    "section": "five-kingdoms-microbes-fungi"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 4 about classification.",
    "options": [
      "Valid A",
      "Valid B",
      "Invalid C",
      "Invalid D"
    ],
    "correct_indices": [
      0,
      1
    ],
    "model_answer": "Both Valid A and Valid B apply here.",
    "difficulty": "advanced",
    "section": "five-kingdoms-plants"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 5 about classification.",
    "options": [
      "Valid A",
      "Valid B",
      "Invalid C",
      "Invalid D"
    ],
    "correct_indices": [
      0,
      1
    ],
    "model_answer": "Both Valid A and Valid B apply here.",
    "difficulty": "advanced",
    "section": "five-kingdoms-animals"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 6 about classification.",
    "options": [
      "Valid A",
      "Valid B",
      "Invalid C",
      "Invalid D"
    ],
    "correct_indices": [
      0,
      1
    ],
    "model_answer": "Both Valid A and Valid B apply here.",
    "difficulty": "advanced",
    "section": "hierarchy-naming"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 7 about classification.",
    "options": [
      "Valid A",
      "Valid B",
      "Invalid C",
      "Invalid D"
    ],
    "correct_indices": [
      0,
      1
    ],
    "model_answer": "Both Valid A and Valid B apply here.",
    "difficulty": "advanced",
    "section": "biodiversity"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 8 about classification.",
    "options": [
      "Valid A",
      "Valid B",
      "Invalid C",
      "Invalid D"
    ],
    "correct_indices": [
      0,
      1
    ],
    "model_answer": "Both Valid A and Valid B apply here.",
    "difficulty": "advanced",
    "section": "principles-of-classification"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 1?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "biodiversity"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 2?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "principles-of-classification"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 3?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "five-kingdoms-microbes-fungi"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 4?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "five-kingdoms-plants"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 5?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "five-kingdoms-animals"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 6?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "hierarchy-naming"
  },
  {
    "kind": "open",
    "prompt": "Open Question 1 regarding patterns in life.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "biodiversity"
  },
  {
    "kind": "open",
    "prompt": "Open Question 2 regarding patterns in life.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "principles-of-classification"
  },
  {
    "kind": "open",
    "prompt": "Open Question 3 regarding patterns in life.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "five-kingdoms-microbes-fungi"
  },
  {
    "kind": "open",
    "prompt": "Open Question 4 regarding patterns in life.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "five-kingdoms-plants"
  },
  {
    "kind": "open",
    "prompt": "Open Question 5 regarding patterns in life.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "five-kingdoms-animals"
  },
  {
    "kind": "open",
    "prompt": "Open Question 6 regarding patterns in life.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "hierarchy-naming"
  }
]
};
