import type { MacroChapter } from "../types";

export const conceptualisingTheMacroeconomy: MacroChapter = {
  slug: "conceptualising-the-macroeconomy",
  title: "Conceptualising the Macroeconomy",
  chapter: 2,
  tagline: "How we draw the boundaries of the economy dictates what we see—and what we ignore.",
  color: "#f5b95f",
  prereqs: ["what-is-economics"],
  unlocks: ["money-and-interest-rates"],
  intro: `Before we can study the macroeconomy, we must conceptualise it. How do we draw its boundaries? Which parts do we aggregate, and which do we separate? 

This chapter introduces three distinct ways of 'seeing' the macroeconomy, moving from the foundational ideas of William Petty to modern National Income Accounts (NAS), Input-Output (I-O) tables, and Flow of Funds (FoF) analysis. 

Crucially, it also reinforces that any conceptualisation of the economy is inherently incomplete. The macroeconomy is an abstraction embedded within the larger domains of society and ecology. Understanding it as a web of interacting commodity and money flows is the necessary precursor to analysing interest rates, employment, and growth.`,
  sections: [
    {
      slug: "three-ways-to-conceptualise",
      title: "Three Ways to Conceptualise the Economy",
      sectionNumber: "2.2",
      importance: "Core",
      summary: "Aggregate Income, Inter-sectoral Relations, and the Flow of Funds.",
      body: `**1. Aggregate Income and Expenditure**
This is the most common way to view the economy, yielding metrics like the Gross Domestic Product (GDP). Its roots go back to William Petty in 1690 who created 'political arithmetick' to measure England's aggregate income for tax purposes. Modern National Accounts Statistics (NAS) were pioneered in the 20th century by economists like Simon Kuznets and Richard Stone (and in India by Dadabhai Naoroji, V.K.R.V. Rao, and P.C. Mahalanobis).

However, the NAS has two serious blind spots:
1. **Undervaluation of women's work:** It excludes unpaid household and care work (cooking, fetching water), which is primarily undertaken by women.
2. **Ecological costs:** It does not account for the environmental damage and resource depletion caused by production.

**2. Inter-sectoral Relations**
The economy can be viewed as an interdependent network of sectors. François Quesnay's *Tableau Économique* (1765) first modelled this between agriculture and manufacturing. Karl Marx later divided the economy into departments producing 'consumption goods' and 'investment goods'. 

In the 1930s, Wassily Leontief formalised this into the **Input-Output (I-O) framework**. It shows how the output of one sector (e.g., primary/agriculture) is used as an input in another (e.g., secondary/manufacturing). An ecological shock to agriculture cascades through manufacturing because of this structural interdependence.

**3. Sectoral Flow of Funds**
The third way views the economy as a system of money flows. Pioneered by Morris Copeland in 1949, Flow of Funds (FoF) analysis maps how money moves between deficit sectors (those needing funds to invest/consume) and surplus sectors (those with excess funds). It tracks transactions across households, private corporate businesses, government, banking, and the foreign sector via financial instruments.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is a major critique of the standard National Accounts Statistics (NAS) like GDP?",
          options: [
            "They focus too much on the informal sector.",
            "They undervalue unpaid domestic/care work and ignore ecological costs.",
            "They are unable to measure the output of the manufacturing sector.",
            "They only measure inter-sectoral relations, not aggregate output."
          ],
          correct_index: 1,
          model_answer: "Standard GDP accounting fails to include unpaid household labour (largely done by women) and does not deduct the cost of environmental degradation.",
          difficulty: "basic"
        },
        {
          kind: "mcq",
          prompt: "Which framework was developed by Wassily Leontief to analyse the structural interdependence of different sectors?",
          options: [
            "Flow of Funds (FoF)",
            "National Income Accounts (NAS)",
            "Input-Output (I-O) framework",
            "General Equilibrium Theory"
          ],
          correct_index: 2,
          model_answer: "Leontief pioneered the Input-Output framework to show how the outputs of some industries serve as inputs for others.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "William Petty is credited with inventing 'political arithmetick' in 1690, an early precursor to modern GDP accounting.",
        "Input-Output tables reveal that a significant portion of agricultural output is consumed as raw material by the manufacturing sector, making them highly interdependent."
      ]
    },
    {
      slug: "an-embedded-system",
      title: "The Macroeconomy as an Embedded System",
      sectionNumber: "2.3",
      importance: "Foundation",
      summary: "The economy does not exist in a vacuum; it is mediated by social norms and bounded by ecology.",
      body: `**Social Embeddedness**
While economic models often assume "free mobility" of labour and capital, real-world transactions are deeply social. In India, factors like caste and patriarchy strictly mediate economic outcomes. 

For instance, social norms dictate who can perform certain jobs, who can own land, and who can access formal credit. A Dalit labourer may face systemic barriers to occupational mobility, and women's labour participation is restricted by patriarchal expectations regarding household care. Thus, what economists might view as a simple "market exchange" is often a transaction heavily influenced by community power structures and trust.

**Ecological Embeddedness**
The economy is also constrained by the natural environment. Economic expansion cannot ignore ecological limits. Clearing ancient forests for mining or industry might boost GDP in the short term, but it destroys ecosystems that indigenous communities rely on and accelerates climate change. 

As Amitav Ghosh notes, the idea that every family in the world can own two cars and multiple appliances is not limited by economics, but by the fact that "humanity would asphyxiate in the process."

Therefore, visualising the macroeconomy requires viewing it as a circle embedded within a larger circle of **Society**, which is itself embedded within the ultimate circle of the **Environment**.`,
      questions: [
        {
          kind: "truefalse",
          prompt: "Economic models assuming 'free mobility of labour' perfectly capture the realities of the Indian labour market.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Free mobility is a theoretical abstraction. In reality, factors like caste and gender heavily restrict occupational and geographical mobility in India.",
          difficulty: "basic"
        }
      ],
      facts: [
        "The assumption of free mobility of labour and capital is a theoretical tool used for precision, but real-world economies are bound by social and historical rigidities."
      ]
    },
    {
      slug: "web-of-flows",
      title: "A Web of Flows",
      sectionNumber: "2.4",
      importance: "Core",
      summary: "Mapping the dual flows of commodities and money across the five key sectors.",
      body: `Bringing together the NAS, I-O, and FoF perspectives allows us to visualise the macroeconomy as a vast web of dual flows: **commodities** (goods, services, labour) moving in one direction, and **money** (wages, payments, investments) moving in the opposite direction.

To simplify, we divide the economy into five broad sectors:
1. **Households:** Provide labour services to firms/government and receive wages/salaries. They spend this on consumption goods and save the rest.
2. **Non-Financial Firms:** Borrow funds to invest in productive capacity. They hire labour, produce goods/services, and earn sales revenue (profits).
3. **Financial Sector (Banks/Funds):** The intermediaries. They take savings from households and lend credit to firms and the government.
4. **Government:** Collects taxes from households and firms. It spends on public goods, infrastructure, and subsidies, often borrowing from the financial sector to cover deficits.
5. **Rest of the World (RoW):** The foreign sector, engaging in imports, exports, and international capital flows.

**The Multiplier Effect**
Because of this tight inter-sectoral linkage, an injection of money (e.g., government spending on a new road) does not stop at the first transaction. The construction company pays wages to workers, who then spend those wages at the local grocer, who then buys more stock from farmers. This chain reaction means that an initial expenditure generates multiple rounds of income across the economy—a phenomenon known as the **multiplier effect**.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In the five-sector macroeconomic model, what is the primary role of the Financial Sector?",
          options: [
            "To produce consumption goods for households.",
            "To act as an intermediary, funnelling savings from households into credit for firms and government.",
            "To collect taxes and provide public infrastructure.",
            "To manage the export and import of commodities."
          ],
          correct_index: 1,
          model_answer: "The financial sector (banks, mutual funds) intermediates between those with surplus funds (savers) and those needing funds (borrowers).",
          difficulty: "easy"
        }
      ],
      facts: [
        "The 'multiplier effect' occurs because sectors are interdependent; expenditure by the government becomes income for households, which then becomes expenditure for firms."
      ]
    }
  ]
};
