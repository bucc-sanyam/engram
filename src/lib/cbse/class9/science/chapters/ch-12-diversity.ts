import type { Chapter } from "@/lib/cbse/types";
import { endemicSpeciesPlate,
  fiveKingdomsPlate,
  plantKingdomPlate,
  animalKingdomPlate
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
      body: "The Earth is home to an enormous variety of life forms, ranging from microscopic organisms to giant trees. This immense variety of living organisms is known as **biodiversity**. Biodiversity is essential for life on Earth, as every organism plays a role in keeping nature stable and functioning.\n\nSmall differences among individuals affect their chances of survival and reproduction, helping them adapt to changing conditions. Over many generations, these differences accumulate and give rise to new forms of life.\n\nThe diversity we see today is the outcome of continuous changes occurring over a vast span of time, shaped by interactions between organisms and their environments. To study this diversity systematically, scientists group and classify organisms based on shared characteristics and evolutionary relationships.",
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
      body: "**Classification** is the process of grouping organisms based on similarities and differences. This systematic framework helps us understand how organisms are related, how they function, and how they evolved.\n\nOrganisms can be classified using various criteria, such as cell structure (prokaryotic vs eukaryotic), body organisation (unicellular vs multicellular), and modes of nutrition (autotrophic vs heterotrophic).\n\nOver time, biological classification systems have evolved. Early systems categorised life simply into plants and animals, but as microscopes revealed a hidden world of microbes, more comprehensive systems were needed. Modern classification reflects evolutionary relationships, ensuring that organisms in the same group share a common ancestor.",
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
      body: "The Five Kingdom classification system, proposed by R.H. Whittaker, divides all living organisms into Monera, Protista, Fungi, Plantae, and Animalia.\n\n**Kingdom Monera** includes unicellular **prokaryotes**, such as bacteria, which lack a defined nucleus and membrane-bound organelles.\n\n**Kingdom Protista** consists of unicellular **eukaryotes**, such as *Amoeba* and *Paramecium*, which have a well-defined nucleus and often move using cilia or flagella.\n\n**Kingdom Fungi** includes multicellular, heterotrophic organisms like mushrooms and yeast. Fungi obtain nutrients by absorbing organic matter from their surroundings and have cell walls made of chitin.\n\nThese three kingdoms encompass the vast diversity of microscopic life and essential decomposers in our ecosystems.",
      sim: fiveKingdomsPlate,
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
      body: "**Kingdom Plantae** consists of multicellular, autotrophic eukaryotes that use chlorophyll to perform photosynthesis.\n\nPlants are further classified into subgroups such as **Thallophyta** (simple algae without differentiated bodies), **Bryophyta** (mosses that live on land but need water to reproduce), and **Pteridophyta** (ferns with simple vascular tissues).\n\nMore complex plants produce seeds. **Gymnosperms** (like pine trees) produce naked seeds, while **Angiosperms** produce flowers and enclose their seeds inside fruits.\n\nTogether, these plants form the primary producers of terrestrial ecosystems.",
      sim: plantKingdomPlate,
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
      body: "**Kingdom Animalia** includes multicellular, heterotrophic eukaryotes without cell walls.\n\nAnimals are incredibly diverse, ranging from simple sponges (**Porifera**) and jellyfish (**Cnidaria**) to worms, insects (**Arthropoda**), and complex vertebrates (**Chordata**).\n\nThey are adapted to almost every environment on Earth and exhibit a wide range of body plans, from radial symmetry (like a starfish) to bilateral symmetry (like a human).\n\nUnlike plants, most animals are highly mobile, allowing them to actively search for food, mates, and shelter.",
      sim: animalKingdomPlate,
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
      body: "Classification follows a hierarchical structure where broader groups contain progressively smaller, more specific sub-groups. The major levels of classification, from broadest to most specific, are **Kingdom**, **Phylum** (or Division for plants), **Class**, **Order**, **Family**, **Genus**, and **Species**.\n\nA species is the basic unit of classification, representing a group of organisms that can interbreed and produce fertile offspring.\n\nTo avoid confusion caused by common names in different languages, scientists use a standardised system called **binomial nomenclature**. Developed by Carl Linnaeus, this system assigns each organism a unique two-part scientific name consisting of its Genus and species, such as *Homo sapiens* for humans.",
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
