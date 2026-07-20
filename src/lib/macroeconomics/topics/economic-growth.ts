import type { MacroChapter } from "../types";

export const economicGrowth: MacroChapter = {
  slug: "economic-growth",
  title: "Economic Growth",
  chapter: 5,
  tagline: "The evolution of the economic pie over time—and who gets the largest slices.",
  color: "#f472b6",
  prereqs: ["output-and-employment"],
  unlocks: ["macroeconomic-policy"],
  intro: `If Chapter 4 examined what determines the size of the economic pie at a specific point in time, this chapter looks at how that pie grows over time. 'Economic growth' is the study of the evolution of the size of output, or output per worker, over time.

This requires us to relax the assumption of a 'given productive capacity'. Over time, investment adds to the capital stock, populations grow, and technological progress occurs. We will contrast the two major theoretical paradigms of growth—Supply-side and Demand-led—before examining the messy, highly unequal reality of India's growth trajectory, which has been plagued by jobless growth, rising inequality, and severe ecological damage.`,
  sections: [
    {
      slug: "theories-of-economic-growth",
      title: "Theories of Economic Growth",
      sectionNumber: "5.2",
      importance: "Core",
      summary: "Supply-side (Marginalist) vs Demand-led (Keynesian/Classical) theories.",
      body: `**1. Supply-Side Growth Theories**
Originating from the Solow (1956) model and later Romer's endogenous growth models, these theories are built on Marginalist foundations.
- **The Core Idea:** Economic growth is driven purely by the supply side: growth in labour and technological progress. 
- **The Mechanism:** They employ an aggregate production function with constant returns to scale and *diminishing returns to capital*. Because adding more capital to the same amount of labour yields less and less output, capital accumulation alone cannot drive permanent growth. Continuous technological progress is required.
- **The Assumptions:** They assume the economy naturally maintains **full employment**. Saving automatically equals investment via interest rate adjustments. Aggregate demand is ignored.
- **Policy Implication:** Leave markets alone. Deregulate. The government's role is minimal, perhaps only to subsidise R&D or enforce patents (to protect intellectual property/ideas).

**2. Demand-Led Growth Theories**
Originating from Keynes, Kalecki, and Sraffian economics (e.g., Garegnani, Serrano).
- **The Core Idea:** Economic growth is determined by the growth of the **autonomous elements of aggregate demand** (autonomous consumption, autonomous investment, government expenditure, and exports).
- **The Mechanism:** Production responds to demand. Capital is simply "produced means of production"—if firms expect higher demand, they will invest to build more capital. 
- **The Assumptions:** There is **no tendency to full employment**. Growth is path-dependent and historical. Capital is not scarce; surplus labour exists.
- **Policy Implication:** Active and systematic government intervention is required to generate autonomous demand and attain full employment.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "demand", "label": "Autonomous Demand Rises (Exports, Govt Spending)", "row": 0, "col": 0 },
    { "id": "expect", "label": "Firms Expect Higher Future Demand", "row": 1, "col": 0 },
    { "id": "invest", "label": "Firms Invest to Expand Capacity", "row": 2, "col": 0 },
    { "id": "capital", "label": "Capital Stock Grows", "row": 3, "col": 0 },
    { "id": "growth", "label": "Output & Employment Grow", "row": 4, "col": 0 }
  ],
  "edges": [
    { "from": "demand", "to": "expect", "label": "signals opportunity" },
    { "from": "expect", "to": "invest", "label": "induces investment" },
    { "from": "invest", "to": "capital", "label": "produced means of production" },
    { "from": "capital", "to": "growth", "label": "expands capacity" }
  ],
  "caption": "In demand-led growth theory, capital accumulation is not the ultimate driver — it is itself induced by expected demand, reversing the supply-side story where growth is limited only by diminishing returns to capital."
}
\`\`\`

**3. Classical Growth Theories (Smith, Ricardo, Marx)**
The demand-led models draw heavily from the Classicals. Adam Smith identified the 'division of labour' (technological progress) constrained by the 'extent of the market' (aggregate demand) as the engine of growth. Ricardo highlighted the ecological limit of diminishing returns on land. Marx warned that capitalism's tendency to depress wages leads to *underconsumption*, causing recurrent crises of unsold goods.`,
      questions: [
        {
          kind: "mcq",
          prompt: "According to the Solow growth model (a supply-side theory), why cannot capital accumulation alone drive permanent economic growth?",
          options: [
            "Because of the tendency for wages to fall.",
            "Because of diminishing returns to capital.",
            "Because aggregate demand is usually insufficient.",
            "Because the government crowds out private investment."
          ],
          correct_index: 1,
          model_answer: "The Solow model assumes diminishing marginal returns to capital. Adding more machines without adding more workers or better technology yields progressively less extra output.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "Supply-side growth theories assume full employment and ignore aggregate demand, whereas demand-led growth theories place autonomous demand as the primary driver of growth."
      ]
    },
    {
      slug: "the-nature-of-growth-in-india",
      title: "The Nature of Growth in India",
      sectionNumber: "5.3",
      importance: "Core",
      summary: "Analysing India's growth through a meso lens: agriculture, joblessness, and ecology.",
      body: `To understand India's growth, we must look beyond the macro GDP average and adopt a 'meso' (sectoral) approach. Averages hide distribution.

**1. Unequal Initial Conditions**
Growth is like compound interest. If wealth is initially unequal, a uniform growth rate severely exacerbates the absolute wealth gap over time. In rural India, land is the primary asset. However, 75% of households own marginal plots (less than 1 hectare), while a tiny fraction controls massive estates. This inequality is historically rooted in caste and colonial policies.

**2. Sectoral Growth and Informality**
India's growth has been highly skewed. The Services sector has grown rapidly, while Agriculture (which employs nearly half the workforce) has stagnated. Because agriculture provides uncertain incomes, workers migrate to urban areas, ending up in the informal construction sector.

**3. Jobless Growth**
Has India's GDP growth translated into jobs? No. 
Between 2004 and 2009, India's GDP grew at an astonishing 8.7% annually, but employment growth was a mere **0.1%**. This is a stark example of "jobless growth." The benefits of growth did not trickle down into wage increases for the majority.

**4. Divergence of Productivity and Wages**
In India's organised manufacturing sector, labour productivity (output per worker) has risen sharply since the 1980s. However, the real wages of production workers have completely stagnated. Where did the extra output go? It went to profits and massive increases in managerial compensation. This highlights Marx and Ricardo's observation: income distribution is a conflictual process mediated by power, not just a harmonious result of 'marginal productivity'.

**5. Ecological Impacts**
Economic growth in India has come at severe environmental costs. The power sector's CO2 emissions have skyrocketed. Furthermore, as Pankaj Sekhsaria and Hansda Sowvendra Shekhar note, "development" often means clearing ancient forests and dispossessing Adivasi (indigenous) communities to build mines and factories. Growth is not an unalloyed good; its *nature* matters immensely.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What trend characterises the relationship between labour productivity and worker wages in India's organised manufacturing sector over recent decades?",
          options: [
            "Wages have risen much faster than productivity.",
            "Both productivity and wages have stagnated.",
            "Productivity has risen significantly, but worker wages have stagnated.",
            "Productivity has fallen, but minimum wage laws forced wages up."
          ],
          correct_index: 2,
          model_answer: "Data shows a stark divergence: while labour productivity increased dramatically, real wages for production workers remained flat, with the surplus going to profits and managerial compensation.",
          difficulty: "intermediate"
        },
        {
          kind: "truefalse",
          prompt: "India's period of highest GDP growth (2004-2009) also saw its highest rate of employment generation.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Despite GDP growing at 8.7%, employment growth was near zero (0.1%), a phenomenon known as jobless growth.",
          difficulty: "basic"
        }
      ],
      facts: [
        "Between 2004 and 2009, India experienced 'jobless growth', with GDP growing at 8.7% annually while employment grew at only 0.1%."
      ]
    }
  ]
};
