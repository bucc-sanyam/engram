import type { FigureSpec } from "@/lib/sim/types";
import { cell, tubule, blob, dots, gleam, cristae, stadium, roundRect, circle } from "@/lib/sim/draw";

const T = {
  sky: "#8fb7f5",
  earth: "#a37651",
  water: "#5da7e8",
  cloud: "#e4ebf5",
  plant: "#64b360",
  factory: "#9da1a6",
  fossil: "#4b4f52",
  sun: "#f5d16e",
  algae: "#44943f",
  fish: "#e07b46",
  bacteria: "#b587cf",
  atmosphere: "#d9e2f0",
  stratosphere: "#c7d5eb",
  mesosphere: "#b5c7e3",
  thermosphere: "#a0b7de"
};

export const atmosphereLayersPlate: FigureSpec = {
  kind: "figure",
  title: "Layers of the Earth's Atmosphere",
  figNumber: "Fig. 13.7",
  altText: "Vertical diagram showing atmospheric layers. Interacting with a layer magnifies into its specific region.",
  viewBox: [660, 480],
  magnify: "part",
  parts: [
    {
      id: "earth-surface",
      label: "Earth's Surface",
      blurb: "The solid and liquid surface of the Earth, which absorbs solar radiation and heats the air directly above it.",
      d: "M0,450 L660,450 L660,480 L0,480 Z",
      tint: T.earth,
      focus: [180, 450, 300, 30],
      layers: [
        { d: gleam(330, 465, 330, 15), as: "light", opacity: 0.2, clip: true },
        { d: "M20,450 L40,430 L60,450", as: "stroke", width: 4 } // A small mountain
      ]
    },
    {
      id: "troposphere",
      label: "Troposphere",
      blurb: "The lowest layer, extending up to 15 km. It contains almost all weather and water vapour.",
      d: "M0,350 L660,350 L660,450 L0,450 Z",
      tint: T.sky,
      focus: [180, 350, 300, 100],
      layers: [
        { d: gleam(330, 400, 330, 50), as: "light", opacity: 0.1, clip: true },
        { d: blob(150, 400, 40, 20, [5, 10, 5, 8], 0), as: "shade", clip: true } // cloud
      ]
    },
    {
      id: "stratosphere",
      label: "Stratosphere",
      blurb: "Extends to 50 km and houses the ozone layer, which absorbs harmful ultraviolet radiation.",
      d: "M0,250 L660,250 L660,350 L0,350 Z",
      tint: T.stratosphere,
      focus: [180, 250, 300, 100],
      layers: [
        { d: gleam(330, 300, 330, 50), as: "light", opacity: 0.1, clip: true },
        { d: blob(500, 300, 40, 15, [4, 6, 3, 5], 0), as: "shade", clip: true, opacity: 0.5 }
      ]
    },
    {
      id: "mesosphere",
      label: "Mesosphere",
      blurb: "Extends to 85 km. It is the coldest layer where most meteors burn up upon entry.",
      d: "M0,150 L660,150 L660,250 L0,250 Z",
      tint: T.mesosphere,
      focus: [180, 150, 300, 100],
      layers: [
        { d: gleam(330, 200, 330, 50), as: "light", opacity: 0.1, clip: true },
        { d: "M100,170 L150,220", as: "stroke", dash: "4 4", width: 2 } // meteor trail
      ]
    },
    {
      id: "thermosphere",
      label: "Thermosphere",
      blurb: "The very hot upper layer extending past 85 km, where auroras occur and satellites orbit.",
      d: "M0,0 L660,0 L660,150 L0,150 Z",
      tint: T.thermosphere,
      focus: [180, 0, 300, 150],
      layers: [
        { d: gleam(330, 75, 330, 75), as: "light", opacity: 0.1, clip: true },
        { d: circle(400, 50, 10), as: "fill", tint: T.factory } // satellite
      ]
    }
  ]
};

export const windCirculationPlate: FigureSpec = {
  kind: "figure",
  title: "Global Wind Circulation",
  figNumber: "Fig. 13.9",
  altText: "A cross-section of the Earth showing global pressure belts and prevailing wind arrows.",
  viewBox: [660, 560],
  magnify: "part",
  parts: [
    {
      id: "globe",
      label: "Earth",
      blurb: "The spinning spherical Earth creates the Coriolis effect, which deflects prevailing winds.",
      d: circle(330, 280, 200),
      tint: T.water,
      focus: [330, 280, 200, 200],
      backdrop: true,
      layers: [
        { d: gleam(330, 280, 200, 200), as: "light", opacity: 0.3, clip: true },
        { d: blob(250, 200, 60, 40, [10, 20, 15, 5], 30), as: "fill", tint: T.earth, clip: true },
        { d: blob(450, 350, 50, 70, [15, 10, 20, 10], -20), as: "fill", tint: T.earth, clip: true }
      ]
    },
    {
      id: "equatorial-low",
      label: "Equatorial Low",
      blurb: "Intense solar heating causes hot air to rise constantly, creating a band of low pressure at the equator.",
      d: "M130,280 L530,280 L525,300 L135,300 Z",
      tint: T.sun,
      focus: [330, 290, 200, 20],
      layers: [
        { d: gleam(330, 290, 200, 10), as: "light", opacity: 0.3, clip: true },
        { d: "M330,280 L330,260 L320,265", as: "stroke", width: 2 } // Rising air arrow
      ]
    },
    {
      id: "subtropical-high-n",
      label: "Subtropical High (N)",
      blurb: "Cooling air sinks around 30 degrees North latitude, forming a persistent high-pressure belt.",
      d: "M160,180 L500,180 L490,200 L170,200 Z",
      tint: T.cloud,
      focus: [330, 190, 170, 20],
      layers: [
        { d: gleam(330, 190, 170, 10), as: "light", opacity: 0.3, clip: true },
        { d: "M330,170 L330,190 L320,185", as: "stroke", width: 2 } // Sinking air arrow
      ]
    },
    {
      id: "subtropical-high-s",
      label: "Subtropical High (S)",
      blurb: "Cooling air sinks around 30 degrees South latitude, forming a persistent high-pressure belt.",
      d: "M160,380 L500,380 L490,360 L170,360 Z",
      tint: T.cloud,
      focus: [330, 370, 170, 20],
      layers: [
        { d: gleam(330, 370, 170, 10), as: "light", opacity: 0.3, clip: true },
        { d: "M330,390 L330,370 L320,375", as: "stroke", width: 2 }
      ]
    },
    {
      id: "trade-winds-n",
      label: "Northeast Trades",
      blurb: "Surface winds blowing from the northern subtropical high towards the equator, deflected right by Earth's rotation.",
      d: "M200,240 L250,260 L245,250 Z", // Simplified arrow body
      tint: T.sky,
      focus: [225, 250, 40, 20],
      layers: [
        { d: gleam(225, 250, 20, 10), as: "light", opacity: 0.5, clip: true }
      ]
    },
    {
      id: "trade-winds-s",
      label: "Southeast Trades",
      blurb: "Surface winds blowing from the southern subtropical high towards the equator, deflected left.",
      d: "M200,320 L250,300 L245,310 Z",
      tint: T.sky,
      focus: [225, 310, 40, 20],
      layers: [
        { d: gleam(225, 310, 20, 10), as: "light", opacity: 0.5, clip: true }
      ]
    }
  ]
};

export const waterCyclePlate: FigureSpec = {
  kind: "figure",
  title: "The Water Cycle",
  figNumber: "Fig. 13.12",
  altText: "A landscape illustrating evaporation, transpiration, condensation, and precipitation.",
  viewBox: [700, 480],
  magnify: "part",
  parts: [
    {
      id: "ocean-source",
      label: "Oceans and Lakes",
      blurb: "Massive bodies of water absorb solar energy and provide most of the water vapour in the atmosphere.",
      d: roundRect(350, 380, 300, 100, 10),
      tint: T.water,
      focus: [500, 430, 150, 50],
      backdrop: true,
      layers: [
        { d: gleam(500, 430, 150, 50), as: "light", opacity: 0.3, clip: true },
        { d: "M400,400 Q450,380 500,400 T600,400", as: "shade", width: 2, clip: true } // wave
      ]
    },
    {
      id: "evaporation-process",
      label: "Evaporation",
      blurb: "Solar heat turns liquid surface water into rising, invisible water vapour.",
      d: roundRect(450, 250, 100, 100, 20),
      tint: T.sky,
      focus: [500, 300, 50, 50],
      layers: [
        { d: gleam(500, 300, 50, 50), as: "light", opacity: 0.5, clip: true },
        { d: "M480,320 L480,260 M520,320 L520,260", as: "stroke", dash: "5 5", width: 3 }
      ]
    },
    {
      id: "condensation-clouds",
      label: "Condensation",
      blurb: "Cooling air forces vapour to condense into tiny liquid droplets, forming visible clouds.",
      d: blob(350, 150, 120, 60, [15, 20, 10, 25], 0),
      tint: T.cloud,
      focus: [350, 150, 120, 60],
      layers: [
        { d: gleam(350, 150, 120, 60), as: "light", opacity: 0.3, clip: true },
        { d: blob(370, 160, 60, 30, [5, 10, 5, 8], 0), as: "shade", opacity: 0.2, clip: true }
      ]
    },
    {
      id: "precipitation-rain",
      label: "Precipitation",
      blurb: "Heavy droplets fall back to the Earth as rain or snow under the force of gravity.",
      d: roundRect(250, 250, 100, 100, 20),
      tint: T.water,
      focus: [300, 300, 50, 50],
      layers: [
        { d: gleam(300, 300, 50, 50), as: "light", opacity: 0.2, clip: true },
        { d: "M280,260 L270,330 M320,260 L310,330", as: "stroke", dash: "10 5", width: 4 } // rain
      ]
    },
    {
      id: "surface-runoff",
      label: "Runoff & Groundwater",
      blurb: "Water flows over the land into rivers or seeps deep into the soil to become groundwater.",
      d: "M50,480 L350,480 L350,380 L200,300 L50,350 Z",
      tint: T.earth,
      focus: [200, 400, 100, 50],
      layers: [
        { d: gleam(200, 400, 100, 50), as: "light", opacity: 0.1, clip: true },
        { d: "M150,350 Q250,400 350,450", as: "stroke", tint: T.water, width: 8, clip: true } // river
      ]
    },
    {
      id: "transpiration-trees",
      label: "Transpiration",
      blurb: "Plants release large amounts of water vapour directly into the air through their leaves.",
      d: blob(150, 310, 40, 50, [10, 15, 5, 8], 0),
      tint: T.plant,
      focus: [150, 310, 40, 50],
      layers: [
        { d: gleam(150, 310, 40, 50), as: "light", opacity: 0.4, clip: true },
        { d: "M150,360 L150,330", as: "stroke", tint: T.earth, width: 8 } // trunk
      ]
    }
  ]
};

export const carbonCyclePlate: FigureSpec = {
  kind: "figure",
  title: "The Carbon Cycle",
  figNumber: "Fig. 13.13",
  altText: "A diagram showing carbon exchanges: photosynthesis, respiration, and fossil fuel emissions.",
  viewBox: [700, 500],
  magnify: "part",
  parts: [
    {
      id: "atmospheric-co2",
      label: "Atmospheric CO₂",
      blurb: "Carbon dioxide in the air traps heat and serves as the carbon source for all terrestrial plants.",
      d: roundRect(300, 50, 300, 80, 40),
      tint: T.sky,
      focus: [450, 90, 150, 40],
      backdrop: true,
      layers: [
        { d: gleam(450, 90, 150, 40), as: "light", opacity: 0.3, clip: true },
        { d: dots([[350, 80], [450, 100], [550, 70]], 4), as: "fill", tint: T.factory }
      ]
    },
    {
      id: "photosynthesis-plants",
      label: "Photosynthesis",
      blurb: "Green plants absorb CO₂ to build organic matter using sunlight.",
      d: cell(150, 300, 80, 120, 1234, 0),
      tint: T.plant,
      focus: [150, 300, 80, 120],
      layers: [
        { d: gleam(150, 300, 80, 120), as: "light", opacity: 0.3, clip: true },
        { d: "M150,420 L150,250 M120,300 L150,330 M180,300 L150,330", as: "stroke", width: 4, tint: T.factory } // veins
      ]
    },
    {
      id: "animal-respiration",
      label: "Respiration",
      blurb: "Animals break down carbon compounds for energy, releasing CO₂ back into the atmosphere.",
      d: blob(350, 350, 60, 40, [10, 12, 8, 15], 0),
      tint: T.fish,
      focus: [350, 350, 60, 40],
      layers: [
        { d: gleam(350, 350, 60, 40), as: "light", opacity: 0.4, clip: true },
        { d: circle(330, 340, 5), as: "fill", tint: T.factory } // eye
      ]
    },
    {
      id: "fossil-fuels",
      label: "Fossil Fuels",
      blurb: "Buried organic matter compressed over millions of years stores vast amounts of ancient carbon.",
      d: roundRect(50, 420, 600, 80, 10),
      tint: T.fossil,
      focus: [350, 460, 300, 40],
      backdrop: true,
      layers: [
        { d: gleam(350, 460, 300, 40), as: "light", opacity: 0.1, clip: true },
        { d: "M100,440 L200,440 M400,470 L500,470", as: "stroke", width: 8, tint: T.earth } // strata
      ]
    },
    {
      id: "factory-emissions",
      label: "Emissions",
      blurb: "Burning fossil fuels rapidly releases long-trapped ancient carbon back into the atmosphere.",
      d: "M500,420 L500,300 L530,300 L530,220 L550,220 L550,420 Z",
      tint: T.factory,
      focus: [525, 320, 25, 100],
      layers: [
        { d: gleam(525, 320, 25, 100), as: "light", opacity: 0.3, clip: true },
        { d: blob(540, 180, 30, 20, [5, 5, 5, 5], 0), as: "shade", opacity: 0.5 } // smoke
      ]
    },
    {
      id: "ocean-sink",
      label: "Ocean Sink",
      blurb: "Oceans absorb a large amount of atmospheric CO₂, helping regulate the climate but causing acidification.",
      d: roundRect(580, 350, 120, 70, 5),
      tint: T.water,
      focus: [640, 385, 60, 35],
      layers: [
        { d: gleam(640, 385, 60, 35), as: "light", opacity: 0.3, clip: true },
        { d: "M590,370 Q610,360 630,370 T680,370", as: "shade", width: 2, clip: true }
      ]
    }
  ]
};

export const nitrogenCyclePlate: FigureSpec = {
  kind: "figure",
  title: "The Nitrogen Cycle",
  figNumber: "Fig. 13.15",
  altText: "Illustration of the nitrogen cycle showing fixation in roots, assimilation by plants, and denitrification.",
  viewBox: [700, 500],
  magnify: "part",
  parts: [
    {
      id: "atmospheric-n2",
      label: "Atmospheric N₂",
      blurb: "Nitrogen gas makes up 78% of the air but is completely unusable by most plants and animals.",
      d: roundRect(300, 50, 300, 80, 40),
      tint: T.sky,
      focus: [450, 90, 150, 40],
      backdrop: true,
      layers: [
        { d: gleam(450, 90, 150, 40), as: "light", opacity: 0.3, clip: true },
        { d: dots([[320, 80], [420, 100], [520, 70], [600, 90]], 3), as: "fill", tint: T.bacteria }
      ]
    },
    {
      id: "nitrogen-fixation",
      label: "Nitrogen Fixation",
      blurb: "Specialised soil bacteria in legume root nodules convert N₂ into usable nitrates.",
      d: blob(200, 400, 50, 50, [15, 10, 20, 5], 0),
      tint: T.bacteria,
      focus: [200, 400, 50, 50],
      layers: [
        { d: gleam(200, 400, 50, 50), as: "light", opacity: 0.4, clip: true },
        { d: "M200,450 L200,350 M170,400 L230,400", as: "stroke", width: 4, tint: T.earth } // roots
      ]
    },
    {
      id: "plant-assimilation",
      label: "Assimilation",
      blurb: "Plants eagerly absorb soluble nitrates from the soil to build vital proteins.",
      d: cell(200, 250, 60, 100, 4321, 0),
      tint: T.plant,
      focus: [200, 250, 60, 100],
      layers: [
        { d: gleam(200, 250, 60, 100), as: "light", opacity: 0.3, clip: true },
        { d: "M200,350 L200,180", as: "stroke", width: 6, tint: T.factory } // stem
      ]
    },
    {
      id: "animal-consumption",
      label: "Animals",
      blurb: "Animals obtain essential nitrogen by eating plants or other animals.",
      d: blob(400, 250, 70, 50, [12, 18, 10, 15], 0),
      tint: T.fish,
      focus: [400, 250, 70, 50],
      layers: [
        { d: gleam(400, 250, 70, 50), as: "light", opacity: 0.4, clip: true },
        { d: circle(380, 240, 6), as: "fill", tint: T.factory } // eye
      ]
    },
    {
      id: "denitrification",
      label: "Denitrification",
      blurb: "Decomposer bacteria break down dead matter, returning nitrogen back to the atmosphere.",
      d: blob(550, 400, 60, 40, [10, 12, 8, 14], 0),
      tint: T.factory,
      focus: [550, 400, 60, 40],
      layers: [
        { d: gleam(550, 400, 60, 40), as: "light", opacity: 0.4, clip: true },
        { d: dots([[530, 400], [550, 410], [570, 390]], 4), as: "fill", tint: T.bacteria }
      ]
    },
    {
      id: "soil-nitrates",
      label: "Soil Nitrates",
      blurb: "The rich soil reservoir holding fixed nitrogen ready for root absorption.",
      d: roundRect(50, 350, 600, 120, 20),
      tint: T.earth,
      focus: [350, 410, 300, 60],
      backdrop: true,
      depth: -1,
      layers: [
        { d: gleam(350, 410, 300, 60), as: "light", opacity: 0.1, clip: true }
      ]
    }
  ]
};

export const eutrophicationPlate: FigureSpec = {
  kind: "figure",
  title: "Eutrophication and Dead Zones",
  figNumber: "Fig. 13.17",
  altText: "Agricultural runoff entering a lake, causing an algal bloom that blocks sunlight and kills fish.",
  viewBox: [700, 460],
  magnify: "part",
  parts: [
    {
      id: "farm-runoff",
      label: "Nutrient Runoff",
      blurb: "Excess synthetic fertilisers wash off farmlands during rain, entering lakes and rivers.",
      d: roundRect(50, 100, 150, 100, 10),
      tint: T.earth,
      focus: [125, 150, 75, 50],
      layers: [
        { d: gleam(125, 150, 75, 50), as: "light", opacity: 0.2, clip: true },
        { d: "M100,150 L200,180 M120,130 L200,160", as: "stroke", width: 6, tint: T.algae, dash: "4 4" } // runoff
      ]
    },
    {
      id: "lake-water",
      label: "Lake Ecosystem",
      blurb: "The fragile aquatic environment that normally supports a balanced food web.",
      d: roundRect(250, 150, 400, 250, 20),
      tint: T.water,
      focus: [450, 275, 200, 125],
      backdrop: true,
      depth: -1,
      layers: [
        { d: gleam(450, 275, 200, 125), as: "light", opacity: 0.3, clip: true }
      ]
    },
    {
      id: "algal-bloom",
      label: "Algal Bloom",
      blurb: "A massive, explosive overgrowth of surface algae triggered by excess nitrogen and phosphorus.",
      d: blob(450, 160, 150, 30, [15, 20, 10, 25], 0),
      tint: T.algae,
      focus: [450, 160, 150, 30],
      layers: [
        { d: gleam(450, 160, 150, 30), as: "light", opacity: 0.5, clip: true },
        { d: dots([[350, 150], [450, 160], [550, 150], [400, 170]], 5), as: "fill", tint: T.plant } // texture
      ]
    },
    {
      id: "sunlight-blocked",
      label: "Blocked Sunlight",
      blurb: "The thick green blanket of algae blocks vital sunlight from reaching deep-water plants.",
      d: roundRect(400, 50, 100, 100, 5),
      tint: T.sun,
      focus: [400, 50, 100, 100],
      layers: [
        { d: "M425,100 L425,150 M450,100 L450,150 M475,100 L475,150", as: "stroke", width: 6, dash: "10 5" }
      ]
    },
    {
      id: "decomposers",
      label: "Decomposers",
      blurb: "Bacteria aggressively consume dead algae, rapidly depleting all dissolved oxygen in the water.",
      d: roundRect(350, 300, 200, 80, 20),
      tint: T.bacteria,
      focus: [450, 340, 100, 40],
      layers: [
        { d: gleam(450, 340, 100, 40), as: "light", opacity: 0.3, clip: true },
        { d: dots([[380, 320], [420, 350], [480, 330], [500, 360]], 3), as: "fill", tint: T.factory }
      ]
    },
    {
      id: "dead-fish",
      label: "Dead Fish",
      blurb: "Suffocated by the total lack of oxygen, aquatic life quickly dies, creating a lethal 'dead zone'.",
      d: blob(450, 250, 40, 20, [8, 5, 10, 6], 180), // upside down fish
      tint: T.fish,
      focus: [450, 250, 40, 20],
      layers: [
        { d: gleam(450, 250, 40, 20), as: "light", opacity: 0.5, clip: true },
        { d: "M430,240 L440,250 M440,240 L430,250", as: "stroke", width: 2, tint: T.factory } // X for eye
      ]
    }
  ]
};
