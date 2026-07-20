import type { MacroChapter } from "../types";

export const macroeconomicPolicy: MacroChapter = {
  slug: "macroeconomic-policy",
  title: "Macroeconomic Policy",
  chapter: 6,
  tagline: "Why theory matters: how abstract models dictate the real-world fight against unemployment and inflation.",
  color: "#a3e635",
  prereqs: ["economic-growth"],
  unlocks: [],
  intro: `Does economic theory actually matter in the real world? Yes, because policymakers use these theories as lenses to filter facts and design interventions. A flawed theory leads to disastrous policies.

This concluding chapter ties everything together by examining how the contending paradigms (Marginalist vs Keynesian/Classical) offer completely different solutions to a nation's two biggest macroeconomic headaches: Unemployment and Inflation. It underscores the necessity of context—particularly India's massive informal sector and volatile agricultural base—when deploying these theories to achieve the ultimate goals of reliable, gainful full employment and stable prices.`,
  sections: [
    {
      slug: "why-theory-matters",
      title: "Why Economic Theory Matters",
      sectionNumber: "6.1",
      importance: "Foundation",
      summary: "Wrong theories lead to bad policies: the danger of the Paradox of Thrift.",
      body: `**Theory as a Disciplining Device**
We are surrounded by millions of economic facts daily. A theory acts as a sieve or a lens, telling us which facts are relevant. Without a theoretical framework, it is impossible to process this data. As Kurt Lewin famously said, "There is nothing as practical as a good theory."

However, if a theory is internally inconsistent or relies on the wrong assumptions, it becomes dangerous in the hands of policymakers.

**Methodological Individualism vs Holism**
A core flaw of Marginalist economics is **methodological individualism**—the assumption that what is true for an individual is true for the macroeconomy. 
For example, it is financially prudent for a single household to cut spending and save money during tough times. Marginalists argue the government should do the same (austerity). 

Keynes exposed this flaw with the **Paradox of Thrift** (methodological holism). If *all* households simultaneously decide to save more, they cut consumption. Firms can't sell goods, so they fire workers. Aggregate income falls, which means total aggregate savings actually *decrease*. The logic of the system is different from the logic of the individual.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "save", "label": "Households Save More", "row": 0, "col": 0 },
    { "id": "consume", "label": "Consumption Falls", "row": 1, "col": 0 },
    { "id": "fire", "label": "Firms Cut Output & Jobs", "row": 2, "col": 0 },
    { "id": "income", "label": "Aggregate Income Falls", "row": 3, "col": 0 },
    { "id": "savings", "label": "Aggregate Savings Fall", "row": 4, "col": 0 }
  ],
  "edges": [
    { "from": "save", "to": "consume", "label": "cut spending" },
    { "from": "consume", "to": "fire", "label": "firms can't sell goods" },
    { "from": "fire", "to": "income", "label": "job losses" },
    { "from": "income", "to": "savings", "label": "less income to save" }
  ],
  "caption": "The Paradox of Thrift: what is prudent for a single household (saving more) becomes self-defeating for the whole economy when everyone does it at once — the logic of the individual differs from the logic of the system."
}
\`\`\`

**The Danger of Exogenous Money**
Marginalist theories also assume the money supply is exogenous and savings determine investment. This leads them to fear that government borrowing will "crowd out" private investment by soaking up limited savings. 
Conversely, the Keynesian/Endogenous money view recognizes that loans create deposits, and capital is not strictly scarce. Therefore, government expenditure aimed at building capacity actually *crowds in* private investment by boosting aggregate demand.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does the 'Paradox of Thrift' demonstrate?",
          options: [
            "That saving money always leads to higher economic growth.",
            "That if everyone tries to save more simultaneously, aggregate demand falls, leading to lower aggregate income and potentially lower total savings.",
            "That government borrowing always crowds out private investment.",
            "That banks need deposits before they can make loans."
          ],
          correct_index: 1,
          model_answer: "The Paradox of Thrift shows that individual prudence (saving) can lead to collective ruin (recession) if everyone does it at once, proving that macroeconomic logic differs from microeconomic logic.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "The assumption that 'what is true for the individual is true for the economy' is called methodological individualism, a concept heavily criticized by Keynesian economists."
      ]
    },
    {
      slug: "full-employment",
      title: "The Policy Objective of Full Employment",
      sectionNumber: "7.1",
      importance: "Core",
      summary: "Measuring the reality of Indian employment and the need for anti-cyclical fiscal policy.",
      body: `**The Nature of Employment in India**
To tackle unemployment, we must first measure it properly. The official unemployment rate often hides deep structural issues:
1. **Low Labour Force Participation Rate (LFPR):** India's LFPR is strikingly low, especially for women. This is largely because the massive amount of domestic and care work done by women is not classified as "economic activity" by standard metrics.
2. **Quality of Employment:** Being "employed" in India does not mean having a secure, well-paying job. Over 80% of the workforce is informal. Even in the formal sector, there is rampant *casualisation* and *contractualisation*. Contract workers have no job security and earn far less than regular salaried workers for the same tasks.
3. **Caste and Gender:** Scheduled Castes (SCs) and Scheduled Tribes (STs) are vastly overrepresented in low-paying, precarious "elementary occupations" and underrepresented in high-paying professional roles. 

**Anti-Cyclical Fiscal Policy**
Because private investment is highly volatile and driven by unpredictable profit expectations, a capitalist economy will naturally go through boom and bust cycles. 

To achieve full employment, the government must adopt an **anti-cyclical fiscal policy**. 
- During economic downturns (when private demand collapses), the government must *increase* expenditure and run deficits to prop up aggregate demand.
- This government expenditure must be directed toward physical and social infrastructure (health, education) to expand the economy's productive capacity, ensuring the debt is sustainable.

Leaving employment generation entirely to the private sector is futile because the private sector's goal is to maximise profit, not to maximise employment.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is an 'anti-cyclical' fiscal policy?",
          options: [
            "A policy where the government balances its budget every single year.",
            "A policy where the government cuts spending during a recession to avoid debt.",
            "A policy where the government increases expenditure during economic downturns to boost aggregate demand.",
            "A policy that relies entirely on the central bank changing interest rates."
          ],
          correct_index: 2,
          model_answer: "Anti-cyclical (or counter-cyclical) policy involves the government doing the opposite of the private sector: spending more when private demand falls to smooth out the business cycle.",
          difficulty: "basic"
        }
      ],
      facts: [
        "In India, over 80% of the workforce is employed in the informal sector, meaning they lack job security, fixed wages, and social security benefits."
      ]
    },
    {
      slug: "low-inflation",
      title: "The Policy Objective of Low Inflation",
      sectionNumber: "8.1",
      importance: "Core",
      summary: "Inflation as a conflict over income distribution rather than just 'too much money'.",
      body: `**Measuring Inflation**
Inflation is a sustained rise in the general price level. In India, it is measured using indices like the Wholesale Price Index (WPI) and the Consumer Price Index (CPI). These are weighted averages. A spike in the WPI does not mean all goods became more expensive; it might just be driven by a spike in food or fuel prices.

**Two Theories of Price Determination**
1. **Marginalist:** Prices are determined by subjective supply and demand (scarcity and utility).
2. **Classical/Sraffian:** Prices are determined objectively by the costs of production and the structural interdependence of sectors (how much coal is needed to make steel). 

**Two Theories of Inflation**
1. **The Monetarist View (QTM):** 
"Too much money chasing too few goods." This view assumes the money supply is exogenous and the economy is always at full employment. If the central bank prints more money, prices just go up. The policy solution is to strictly control the money supply and raise interest rates.

2. **The Keynesian/Classical View:**
Inflation is fundamentally a **conflict over income distribution** in a world of endogenous money. 
If workers successfully bargain for higher wages, capitalists (firms) might raise the prices of their goods to protect their profit margins. This leads to a wage-price spiral. 
Furthermore, in India, inflation is highly sensitive to supply shocks in two 'basic' commodities:
- **Agriculture:** A bad monsoon destroys crops, spiking food prices.
- **Fuel:** Global geopolitical tensions spike crude oil prices. Because fuel is an input for transporting almost everything, this cost cascades through the entire economy.

**Policy Solutions for India**
If inflation in India is driven by food and fuel shortages, simply raising the RBI's interest rate (Monetary Policy) is a blunt and ineffective tool. A high interest rate will not make it rain, nor will it pump more oil. 

Instead, combating inflation requires targeted **fiscal and structural policies**: building better agricultural storage, improving irrigation, transitioning to renewable energy to reduce import dependence, and managing the exchange rate to prevent imported inflation.`,
      questions: [
        {
          kind: "mcq",
          prompt: "According to the Keynesian/Classical view, what is a primary structural driver of inflation?",
          options: [
            "The central bank printing too much physical currency.",
            "A conflict over income distribution (wage-price spirals) and supply shocks in basic commodities like fuel and food.",
            "Households deciding to save too much of their income.",
            "Too much technological progress reducing the cost of goods."
          ],
          correct_index: 1,
          model_answer: "Rather than treating inflation as a purely monetary phenomenon, the Keynesian/Classical view sees it as arising from distributional conflicts (profits vs wages) and real-world supply bottlenecks.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "In the Indian economy, inflation is often driven by structural bottlenecks in agriculture and reliance on imported fuel, meaning interest rate hikes alone are often insufficient to control it."
      ]
    }
  ]
};
