import type { MacroChapter } from "../types";

export const outputAndEmployment: MacroChapter = {
  slug: "output-and-employment",
  title: "Output and Employment Levels",
  chapter: 4,
  tagline: "What determines the size of the economic pie, and why isn't everyone employed in making it?",
  color: "#43d6b5",
  prereqs: ["money-and-interest-rates"],
  unlocks: ["economic-growth"],
  intro: `Why is the total value of all goods and services produced in India only 170 trillion rupees and not 250 trillion? What determines this aggregate output, and how many workers are needed to produce it? 

This chapter dives into the core question of macroeconomics: what determines output and employment levels in the short run? We explore two diametrically opposed frameworks—the Marginalist theory (which believes the economy naturally reaches full employment) and the Keynesian theory (which demonstrates how an economy can be trapped in unemployment). We then extend this framework to an open economy, exploring how international trade and exchange rates impact domestic output.`,
  sections: [
    {
      slug: "contending-theories",
      title: "Contending Theories of Output and Employment",
      sectionNumber: "4.2",
      importance: "Core",
      summary: "Supply creates demand vs. Demand determines supply.",
      body: `**1. The Marginalist Theory**
Originating from J.B. Say and developed by Marshall and Pigou, this theory operates on **Say's Law: "Supply creates its own demand."** 
- **The Core Idea:** The act of production generates enough income for workers and capitalists to buy back exactly what was produced. 
- **The Mechanism:** In a competitive economy, if people save more, the interest rate drops, which makes it cheaper to borrow, perfectly boosting investment. Thus, planned saving determines planned investment. 
- **The Labour Market:** Wages are flexible. If there is unemployment, wages will fall until it becomes profitable for firms to hire everyone. 
- **The Conclusion:** The economy has an automatic tendency toward **full employment**. Government intervention should be minimised.

**2. The Keynesian Theory**
In the 1930s, John Maynard Keynes and Michał Kalecki inverted this logic with the **Principle of Effective Demand**.
- **The Core Idea:** **Aggregate demand determines aggregate output.** Firms only produce what they expect to sell. If households decide to save more and consume less, firms will see inventory pile up and will cut back production and fire workers. 
- **The Mechanism:** Planned investment determines planned saving via variations in aggregate income. (Investment → Output/Income → Savings).
- **The Labour Market:** Workers cannot negotiate real wages, only nominal wages. A fall in wages reduces consumption, further depressing aggregate demand.
- **The Conclusion:** There is **no tendency toward full employment**. The economy can be stuck in a permanent state of unemployment. Active government intervention (expenditure) is required to boost demand.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "investment", "label": "Planned Investment (I)", "row": 0, "col": 0 },
    { "id": "produce", "label": "Firms Produce to Meet Expected Demand", "row": 1, "col": 0 },
    { "id": "output", "label": "Aggregate Output & Income (Y) Adjusts", "row": 2, "col": 0 },
    { "id": "outcome", "label": "Employment & Savings Adjust to Match I", "row": 3, "col": 0 }
  ],
  "edges": [
    { "from": "investment", "to": "produce", "label": "signals expected demand" },
    { "from": "produce", "to": "output", "label": "output responds" },
    { "from": "output", "to": "outcome", "label": "income induces saving/jobs" }
  ],
  "caption": "The Keynesian reversal of Say's Law: instead of saving determining investment, planned investment drives output and income, and employment and saving simply adjust to match it."
}
\`\`\`

**The Keynesian Multiplier**
If the government spends INR 1,000 trillion to build a highway, aggregate output (Y) increases by *more* than 1,000 trillion. Why? 
The government pays a contractor, who pays workers, who buy food, giving income to farmers, who buy clothes... This structural interdependence means an initial autonomous expenditure generates multiple rounds of induced consumption. The ratio of the total change in Y to the initial change in Government Expenditure (G) is the **multiplier**.

**Applicability to India**
Is Keynesian theory perfectly applicable to India? V.K.R.V. Rao argued in 1952 that developing economies suffer from severe *supply-side* constraints (lack of infrastructure, capital, and skilled labour). Pumping money into the economy might just cause inflation if factories cannot physically produce more goods. However, if government expenditure is directed towards building physical and social infrastructure, it directly expands productive capacity while simultaneously generating employment.`,
      questions: [
        {
          kind: "mcq",
          prompt: "According to the Keynesian theory of output and employment, what is the primary determinant of the level of aggregate output?",
          options: [
            "The available supply of labour and capital.",
            "The level of planned aggregate demand.",
            "The flexibility of nominal wages in the labour market.",
            "The exogenous money supply set by the central bank."
          ],
          correct_index: 1,
          model_answer: "Keynes established the 'Principle of Effective Demand', which states that firms produce only what they expect to sell. Therefore, planned aggregate demand determines planned aggregate output.",
          difficulty: "intermediate"
        },
        {
          kind: "truefalse",
          prompt: "Say's Law, a pillar of marginalist theory, states that aggregate demand determines aggregate supply.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Say's Law states the exact opposite: 'Supply creates its own demand.'",
          difficulty: "basic"
        }
      ],
      facts: [
        "The Keynesian Multiplier shows how an initial injection of government spending leads to a proportionately larger increase in national income due to successive rounds of consumption."
      ]
    },
    {
      slug: "open-economy-macrodynamics",
      title: "Open Economy Macrodynamics",
      sectionNumber: "4.3",
      importance: "Foundation",
      summary: "How trade balances and exchange rates impact domestic output.",
      body: `When we open the economy to the Rest of the World (RoW), aggregate demand expands to include foreign demand (Exports) and leaks out through domestic demand for foreign goods (Imports).

**Net Exports (NX) = Exports (X) - Imports (M)**

If X > M, the country has a trade surplus. If M > X, it has a trade deficit.

**The Zero-Sum Game of International Trade**
Because of basic accounting, one country's exports are exactly equal to another country's imports. The world as a whole is a closed economy. Therefore, all countries cannot simultaneously run a trade surplus. 

Economist Joan Robinson called policies designed to enrich a country by aggressively pushing exports and blocking imports **"beggar-my-neighbour" policies**, because one nation's gain in employment from a trade surplus comes at the direct expense of unemployment in the deficit nation.

**Exchange Rates and Aggregate Output**
If the Indian Rupee (INR) **depreciates** (gets weaker against the USD):
- Indian goods become cheaper for Americans. **Exports increase.**
- American goods become more expensive for Indians. **Imports decrease.**
- Net Exports rise, boosting aggregate demand, which increases domestic output and employment (ceteris paribus).

If the INR **appreciates** (gets stronger):
- Importers benefit as foreign goods become cheaper.
- Exporters suffer as their goods become uncompetitive globally.
- Net Exports fall, reducing domestic output and employment.

This highlights why the RBI does not let the 'free market' fully determine the exchange rate; it strategically intervenes to protect domestic employment and control inflation.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the likely effect of a significant depreciation of the Indian Rupee (INR) on the domestic economy, assuming all else remains equal?",
          options: [
            "Imports become cheaper, and exports fall, leading to lower domestic employment.",
            "Both exports and imports will increase equally.",
            "Exports become cheaper for foreign buyers, boosting aggregate demand and increasing domestic output.",
            "The central bank will immediately lower interest rates."
          ],
          correct_index: 2,
          model_answer: "A depreciation makes domestic goods cheaper abroad, stimulating exports. This increases Net Exports, which is a component of Aggregate Demand, thereby boosting domestic output.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "Joan Robinson coined the term 'beggar-my-neighbour' to describe international trade policies where one country tries to cure its own unemployment by running a trade surplus at the expense of its trading partners."
      ]
    }
  ]
};
