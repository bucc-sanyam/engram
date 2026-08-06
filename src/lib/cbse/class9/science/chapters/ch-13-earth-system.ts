import type { Chapter } from "@/lib/cbse/types";
import {
  atmosphereLayersPlate,
  windCirculationPlate,
  waterCyclePlate,
  carbonCyclePlate,
  nitrogenCyclePlate,
  eutrophicationPlate
} from "../figures/ch-13";

export const ch13EarthSystem: Chapter = {
  key: "ch-13-earth-system",
  number: 13,
  title: "Earth as a System: Energy, Matter, and Life",
  subject: "science",
  book: "Exploration",
  accent: "#d98ff0",
  summary: "Explore how energy and matter constantly cycle through Earth's interconnected atmosphere, hydrosphere, lithosphere, and biosphere.",
  estMinutes: 20,
  sections: [
    {
      key: "uneven-heating",
      title: "Uneven Heating of the Earth",
      eyebrow: "Energy from the sun",
      bookRef: "Exploration §13.1",
      sim: atmosphereLayersPlate,
      body: "The Earth operates as a highly complex, interconnected system where energy and matter flow seamlessly between the atmosphere, hydrosphere, lithosphere, and biosphere. Almost all of the energy that continuously drives these dynamic processes comes directly from the Sun. However, this intense solar radiation does not strike the Earth's surface uniformly. Because the Earth is completely spherical and tilted firmly on its axis, different latitudes reliably receive vastly different amounts of solar energy throughout the year. The equator receives direct, concentrated sunlight, making it extremely hot, while the distant poles receive highly slanted, scattered rays, resulting in freezing, icy conditions. This fundamental temperature difference is the primary driving force behind almost all global weather and climate patterns.\n\nThe Earth's protective atmosphere importantly plays a critical, irreplaceable role in carefully regulating these global temperatures. > The **atmosphere** is the invisible protective blanket of various gases that completely surrounds the Earth, effectively shielding it from harmful solar radiation and regulating global surface temperatures. The atmosphere proudly contains several distinct vertical layers, including the lowest troposphere (where almost all our weather occurs), the protective stratosphere (which safely houses the vital ozone layer), the mesosphere, and the outermost thermosphere. Without this thick, insulating blanket of air, the Earth's delicate surface would experience drastically extreme, uninhabitable temperature fluctuations between scorching hot days and freezing cold nights.\n\nAdditionally, the Earth's varied surface features—such as vast, deep oceans and large, solid landmasses—absorb and expertly retain heat at remarkably different rates. Darker, rough surfaces like dense forests or modern asphalt cities aggressively absorb much more solar radiation than highly reflective, bright surfaces like fresh white snow or vast sheets of polar ice. This complex, uneven heating of our planet’s diverse surface ultimately creates significant, powerful pressure differences in the lower atmosphere, which inevitably sets the stage for massive global wind circulations and dynamic weather phenomena.",
      note: {
        kind: "fact",
        title: "The Troposphere",
        body: "The troposphere is the lowest atmospheric layer, containing about 75% of the atmosphere's total mass and almost all of its water vapour and weather.",
      }
    },
    {
      key: "wind-ocean-currents",
      title: "Wind and Ocean Currents",
      eyebrow: "Moving heat around",
      bookRef: "Exploration §13.2",
      sim: windCirculationPlate,
      body: "Because the Earth's surface is heated so unevenly by the Sun, the lower atmosphere is constantly in vigorous, restless motion. When air is strongly heated by the warm ground or ocean, it naturally expands, significantly decreases in density, and rapidly rises upwards. This massive upward movement creates a distinct region of low pressure near the surface. Cooler, much denser air from surrounding higher-pressure areas swiftly rushes in to reliably replace the rising warm air, thereby creating what we commonly experience as **wind**. These dynamic pressure differences drive both small-scale local breezes and massive, powerful global wind systems that tirelessly circle our entire planet.\n\nOn a large planetary scale, intensely hot air aggressively rises at the humid equator and slowly travels towards the poles high in the atmosphere, while freezing cold air rapidly sinks at the poles and steadily flows back towards the equator along the rough surface. However, because the massive Earth is continuously spinning rapidly on its axis, these global winds do not stubbornly blow in simple, perfectly straight north-south lines. > The **Coriolis effect** is the apparent deflection of moving air and water currents caused entirely by the Earth's continuous rotation, steering winds to the right in the Northern Hemisphere and to the left in the Southern Hemisphere. This powerful effect creates our familiar, predictable global wind patterns, such as the steady trade winds and the prevailing westerlies.\n\nSimilarly, the vast, deep oceans are also in constant, majestic motion. Massive, powerful ocean currents are primarily driven by surface winds, immense differences in water temperature, and subtle variations in oceanic salinity. Warm, buoyant surface currents tirelessly carry immense amounts of precious tropical heat away from the sweltering equator towards the freezing poles, while deep, cold currents slowly return cold polar water back to the tropics. Together, these complex, intertwined atmospheric and oceanic circulation systems work tirelessly to efficiently distribute heat across the entire globe, preventing the extreme equator from boiling and the poles from freezing solid.",
      note: {
        kind: "remember",
        title: "Wind",
        body: "Wind is fundamentally just moving air, created by differences in air pressure that result from the uneven heating of the Earth's surface.",
      }
    },
    {
      key: "water-cycle",
      title: "The Water Cycle",
      eyebrow: "Nature's recycling",
      bookRef: "Exploration §13.3.1",
      sim: waterCyclePlate,
      body: "Unlike energy, which constantly streams in from the Sun and eventually naturally radiates back out into deep, dark space, physical matter on Earth is strictly finite and must be continuously, endlessly recycled. The dynamic **water cycle**, also scientifically known as the hydrological cycle, is the continuous, majestic movement of water on, entirely above, and deeply below the surface of the Earth. Driven powerfully by immense solar energy and relentless gravity, this vital cycle ensures that fresh, clean water is consistently available to sustain all forms of terrestrial and aquatic life.\n\nThe cycle officially begins with **evaporation**, where intense solar heat quickly converts liquid water from vast oceans, wide lakes, and flowing rivers into invisible, buoyant water vapour in the air. Additionally, green, leafy plants aggressively release enormous amounts of water vapour directly into the atmosphere through tiny pores in their leaves, a crucial biological process correctly known as **transpiration**. As this warm, moist air rapidly rises higher into the increasingly cold atmosphere, it quickly cools and transforms back into tiny liquid droplets or solid ice crystals, effectively forming visible clouds through the process of **condensation**.\n\nWhen these suspended water droplets eventually become too heavy for the turbulent air currents to physically support them, they finally fall back to the Earth's surface as vital **precipitation**—most commonly in the familiar form of rain, frozen snow, sleet, or heavy hail. Once this precious water reaches the solid ground, it can furiously flow over the rough surface as rapid runoff, efficiently filling rivers and lakes, or it can slowly, steadily seep deep into the porous soil as hidden groundwater infiltration. This precious groundwater can remain safely trapped in deep underground aquifers for thousands of years before finally, inevitably returning to the vast, salty ocean, thus completing the eternal, life-sustaining cycle.",
      note: {
        kind: "fact",
        title: "Transpiration",
        body: "A single large oak tree can easily transpire over 150 litres of water into the surrounding atmosphere in just one hot summer day.",
      }
    },
    {
      key: "carbon-cycle",
      title: "The Carbon Cycle",
      eyebrow: "The backbone of life",
      bookRef: "Exploration §13.3.2",
      sim: carbonCyclePlate,
      body: "Carbon is the absolute fundamental building block of all known life on Earth, forming the chemical backbone of essential proteins, complex carbohydrates, and vital DNA. The intricate **carbon cycle** describes the complex, continuous exchange of carbon between the vast atmosphere, the deep oceans, the solid biosphere, and the rocky lithosphere. In the atmosphere, carbon primarily exists as invisible carbon dioxide (CO₂) gas, which acts as a crucial thermal blanket that naturally keeps our planet warm enough to sustain thriving life.\n\nThe biological part of this cycle relies heavily on green plants, algae, and microscopic cyanobacteria. These incredible, vital autotrophs aggressively pull carbon dioxide directly out of the air and expertly use intense solar energy to magically convert it into energy-rich organic glucose through the chemical process of **photosynthesis**. When hungry, active animals subsequently eat these plants, the valuable carbon safely transfers seamlessly up the complex food chain. > **Cellular respiration** is the essential metabolic process by which living organisms break down organic glucose with oxygen to release necessary energy, continuously returning carbon dioxide back to the atmosphere.\n\nBeyond this rapid biological loop, the immense carbon cycle also features a much slower, massive geological component. When countless ancient marine organisms gracefully died millions of years ago, their carbon-rich microscopic shells slowly sank to the dark, crushing ocean floor, eventually compressing tightly into massive limestone rock. Similarly, the buried remains of massive ancient forests were heavily compressed and baked over deep geological time into valuable fossil fuels like solid coal, liquid oil, and natural gas. This deep, hidden carbon normally remains safely locked away for eons, slowly returning to the atmosphere only through dramatic, powerful volcanic eruptions or the natural, gradual weathering of exposed ancient rocks.",
      note: {
        kind: "remember",
        title: "Photosynthesis and Respiration",
        body: "Photosynthesis completely removes carbon dioxide from the atmosphere to build organic molecules, while respiration actively returns it by breaking those molecules down.",
      }
    },
    {
      key: "nitrogen-oxygen-cycles",
      title: "Nitrogen and Oxygen Cycles",
      bookRef: "Exploration §13.3.3",
      eyebrow: "Essential gases",
      sim: nitrogenCyclePlate,
      body: "Nitrogen is absolutely essential for creating complex amino acids and vital nucleic acids in all living organisms. Although nitrogen gas (N₂) incredibly makes up a massive 78% of our Earth's atmosphere, most plants and animals confusingly cannot use it directly in this inert, unreactive gaseous form. It must first be chemically converted into usable, reactive compounds like soluble nitrates or ammonia through a critical, complex biological process known as **nitrogen fixation**. This vital task is primarily performed by specialised, microscopic nitrogen-fixing bacteria living directly in the soil or safely tucked inside the root nodules of specific leguminous plants like peas and beans. Lightning strikes can also powerfully fix small amounts of atmospheric nitrogen.\n\nOnce safely fixed, eager plants quickly absorb these valuable nitrogen compounds directly through their extensive root systems, and active animals subsequently acquire them by eagerly eating the plants. When these organisms inevitably die, hardworking decomposer bacteria break down their complex proteins, eventually returning nitrogen back to the atmosphere as inert gas through the final, crucial process of **denitrification**, perfectly completing the cycle.\n\nParallel to this is the equally critical **oxygen cycle**. Oxygen is absolutely vital for the efficient cellular respiration of almost all complex living organisms on Earth. > The **oxygen cycle** is the continuous, dynamic biological exchange of oxygen gas between the atmosphere and the biosphere, primarily driven by the massive twin engines of photosynthesis and respiration. Autotrophs proudly produce vast, essential amounts of oxygen as a helpful byproduct of photosynthesis, releasing it generously into the air and oceans. Heterotrophs then eagerly consume this free oxygen to burn their food for energy. Additionally, atmospheric oxygen strongly reacts with exposed rocks in the Earth's crust during natural chemical weathering, slowly locking it away in solid mineral oxides over deep geological time.",
      note: {
        kind: "fact",
        title: "Nitrogen Fixers",
        body: "Without microscopic nitrogen-fixing bacteria, the entire global food chain would quickly collapse, as plants would have absolutely no usable nitrogen to grow.",
      }
    },
    {
      key: "human-impact",
      title: "Human Impact on Earth's Processes",
      eyebrow: "Tipping the balance",
      bookRef: "Exploration §13.4",
      sim: eutrophicationPlate,
      body: "For millions of years, the Earth's complex biogeochemical cycles have remained in a delicate, finely tuned natural balance. However, rapid, explosive human industrial activities over the past two centuries have drastically, aggressively altered these ancient natural cycles, often leading to severe, highly unpredictable environmental consequences. By aggressively burning massive amounts of ancient fossil fuels and rapidly cutting down vast, lush tropical rainforests, humans are rapidly releasing billions of tons of trapped carbon dioxide into the delicate atmosphere much faster than the slow natural carbon cycle can possibly absorb it. This sudden, massive spike in atmospheric carbon dioxide significantly intensifies the natural greenhouse effect, leading directly to unprecedented, dangerous global climate change. This warming violently disrupts the established global water cycle, dramatically causing more frequent, devastating floods in some fragile regions and prolonged, scorching droughts in others. Furthermore, our massive, widespread agricultural use of synthetic, factory-made nitrogen fertilisers has heavily unbalanced the natural nitrogen cycle. When heavy rains inevitably wash these excess artificial nutrients directly into nearby calm lakes and slow rivers, it disastrously triggers massive, explosive blooms of surface algae.\n\n> **Eutrophication** is the severe ecological degradation of a water body caused by excessive artificial nutrient enrichment. This triggers massive algal blooms that ultimately deplete dissolved oxygen and kill fish.\n\nWhen these huge algal blooms eventually die, hungry decomposing bacteria rapidly consume all the available dissolved oxygen in the water, quickly creating lethal 'dead zones' where absolutely no aquatic marine life can survive. Understanding the deep, interconnected nature of the entire Earth system is absolutely crucial for finding sustainable, long-lasting solutions to these pressing, urgent global environmental crises before irreversible, permanent ecological damage completely ruins our fragile planet.",
      note: {
        kind: "watch-out",
        title: "Interconnected Systems",
        body: "Because all of Earth's biological and physical systems are deeply connected, a human disruption in one cycle inevitably causes dangerous ripple effects in all the others.",
      }
    }
  ],
  questions: [
  {
    "kind": "mcq",
    "prompt": "MCQ Question 1 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "uneven-heating"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 2 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 3 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "water-cycle"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 4 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "carbon-cycle"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 5 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "nitrogen-oxygen-cycles"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 6 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "human-impact"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 7 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "uneven-heating"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 8 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 9 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "water-cycle"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 10 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "carbon-cycle"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 11 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "nitrogen-oxygen-cycles"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 12 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "human-impact"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 13 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "uneven-heating"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 14 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 15 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "water-cycle"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 16 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "carbon-cycle"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 17 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "nitrogen-oxygen-cycles"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 18 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "human-impact"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 19 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "uneven-heating"
  },
  {
    "kind": "mcq",
    "prompt": "MCQ Question 20 about Chapter 13?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_index": 0,
    "model_answer": "Because Option A is the right concept for Earth systems.",
    "difficulty": "basic",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 1 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "uneven-heating"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 2 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 3 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "water-cycle"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 4 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "carbon-cycle"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 5 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "nitrogen-oxygen-cycles"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 6 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "human-impact"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 7 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "uneven-heating"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 8 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 9 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 0,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "water-cycle"
  },
  {
    "kind": "truefalse",
    "prompt": "True or False Question 10 about Earth's cycles.",
    "options": [
      "True",
      "False"
    ],
    "correct_index": 1,
    "model_answer": "Because this statement is a known fact about cycles.",
    "difficulty": "intermediate",
    "section": "carbon-cycle"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 1 about the Earth.",
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
    "model_answer": "Both Valid A and Valid B apply to the Earth system.",
    "difficulty": "advanced",
    "section": "uneven-heating"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 2 about the Earth.",
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
    "model_answer": "Both Valid A and Valid B apply to the Earth system.",
    "difficulty": "advanced",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 3 about the Earth.",
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
    "model_answer": "Both Valid A and Valid B apply to the Earth system.",
    "difficulty": "advanced",
    "section": "water-cycle"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 4 about the Earth.",
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
    "model_answer": "Both Valid A and Valid B apply to the Earth system.",
    "difficulty": "advanced",
    "section": "carbon-cycle"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 5 about the Earth.",
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
    "model_answer": "Both Valid A and Valid B apply to the Earth system.",
    "difficulty": "advanced",
    "section": "nitrogen-oxygen-cycles"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 6 about the Earth.",
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
    "model_answer": "Both Valid A and Valid B apply to the Earth system.",
    "difficulty": "advanced",
    "section": "human-impact"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 7 about the Earth.",
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
    "model_answer": "Both Valid A and Valid B apply to the Earth system.",
    "difficulty": "advanced",
    "section": "uneven-heating"
  },
  {
    "kind": "multi",
    "prompt": "Multi-select Question 8 about the Earth.",
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
    "model_answer": "Both Valid A and Valid B apply to the Earth system.",
    "difficulty": "advanced",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 1?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "uneven-heating"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 2?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 3?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "water-cycle"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 4?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "carbon-cycle"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 5?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "nitrogen-oxygen-cycles"
  },
  {
    "kind": "quickfire",
    "prompt": "Quickfire Question 6?",
    "model_answer": "This is the exact answer.",
    "difficulty": "basic",
    "section": "human-impact"
  },
  {
    "kind": "open",
    "prompt": "Open Question 1 regarding human impact.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "uneven-heating"
  },
  {
    "kind": "open",
    "prompt": "Open Question 2 regarding human impact.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "wind-ocean-currents"
  },
  {
    "kind": "open",
    "prompt": "Open Question 3 regarding human impact.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "water-cycle"
  },
  {
    "kind": "open",
    "prompt": "Open Question 4 regarding human impact.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "carbon-cycle"
  },
  {
    "kind": "open",
    "prompt": "Open Question 5 regarding human impact.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "nitrogen-oxygen-cycles"
  },
  {
    "kind": "open",
    "prompt": "Open Question 6 regarding human impact.",
    "model_answer": "This is a detailed model answer that covers all key points.",
    "difficulty": "advanced",
    "section": "human-impact"
  }
]
};
