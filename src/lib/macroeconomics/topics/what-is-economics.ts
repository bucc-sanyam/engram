import type { MacroChapter } from "../types";

export const whatIsEconomics: MacroChapter = {
  slug: "what-is-economics",
  title: "What is Economics",
  chapter: 1,
  tagline: "An introduction to the science of wealth, its history, and its limits.",
  color: "#3b82f6",
  prereqs: [],
  unlocks: ["conceptualising-the-macroeconomy"],
  intro: `A cursory glance at your daily newspaper might tell you about struggling farmers, jobless manufacturing growth, ecological damage, or the stock market reacting to government notifications. To an economist, all these seemingly disparate issues are deeply related. This chapter lays the foundation for understanding these connections by exploring the history and defining the scope of economics. It contrasts the classical 'science of wealth' with the marginalist 'science of choice', establishes the object of analysis as a competitive monetary production economy, and firmly situates the macroeconomy as an embedded system within society and ecology.`,
  sections: [
    {
      slug: "introduction",
      title: "Introduction",
      sectionNumber: "1.1",
      importance: "Foundation",
      summary: "Why study economics, and what are its limits?",
      body: `**Motivations for studying economics**
We live in societies where governments are democratically elected. Political parties promise us better wages, greater employment opportunities, and low inflation. How do we evaluate these claims and vision documents? The study of economics helps in making an informed judgement as a citizen and voter.

Moreover, if you wish to see everyone in your community get a good life, your occupational choices—whether as a policymaker, journalist, teacher, or union leader—will require a sound knowledge of economic matters.

**The limits of formal economics**
However, the study of economics, especially of the current university kind, is never *sufficient* to fully understand our societies. You must read widely:
- Read good books of fiction that convey the realities of your surroundings in a manner no economics book can.
- Read history.
- Understand the operation of political systems.
- Listen to those who have experienced socio-economic hardships.

An economics textbook is only a stepping stone and should be used in the good company of other texts and experiences. As John Maynard Keynes wrote in his obituary for his teacher Alfred Marshall:

> "... the master-economist must possess a rare *combination* of gifts.... He must be mathematician, historian, statesman, philosopher—in some degree. He must understand symbols and speak in words. He must contemplate the particular in terms of the general, and touch abstract and concrete in the same flight of thought."`,
      questions: [
        {
          kind: "mcq",
          prompt: "According to the introduction, what is the primary limit of studying formal university economics?",
          options: [
            "It requires advanced mathematical skills that most people lack.",
            "It is insufficient on its own to fully understand society and must be supplemented by history, politics, and fiction.",
            "It only applies to developed nations like the US and UK.",
            "It focuses entirely on microeconomic firm behaviour."
          ],
          correct_index: 1,
          model_answer: "The text emphasizes that economics is never sufficient on its own and explicitly encourages reading fiction, history, and listening to those who have experienced hardships.",
          difficulty: "basic"
        }
      ],
      facts: [
        "John Maynard Keynes believed a master-economist must simultaneously be a mathematician, historian, statesman, and philosopher."
      ]
    },
    {
      slug: "a-brief-history-of-economics",
      title: "A brief history of economics",
      sectionNumber: "1.2",
      importance: "Core",
      summary: "The evolution of economic thought from classical political economy to the marginalist and Keynesian revolutions.",
      body: `**Pre-classical and Classical Political Economy**
While early economic discourses existed globally (e.g., Kautilya's *Arthashastra*, Ibn Khaldun's *Muqaddimah*, and the European Mercantilists), Adam Smith's *Wealth of Nations* (1776) conceptualised political economy as a distinct field of inquiry: the science of wealth.

Subsequent economists like David Ricardo and Karl Marx developed this further. Classical economics focused on:
- How economies grow and how the surplus is generated and distributed.
- The fundamental unit of analysis was social **classes** (workers, capitalists, landowners).
- Wages were seen as determined by social and political forces, while profits and wages had an inverse relationship, highlighting innate class conflict.

**The Marginalist Revolution (1870s)**
Pioneered by Walras, Jevons, and Menger, this revolution supplanted classical ideas:
- The fundamental unit of analysis shifted from the 'class' to the **individual** (methodological individualism).
- Economics was redefined as the maximisation of pleasure/utility and minimisation of pain.
- Income distribution was theorised harmoniously: workers are paid their marginal product of labour, and capitalists their marginal product of capital.
- It argued that a competitive economy naturally tends towards full employment.

**The Keynesian Revolution (1930s)**
Amidst the Great Depression, John Maynard Keynes published *The General Theory* (1936), arguing:
- The marginalist claim of an automatic tendency toward full employment was flawed.
- The economy could get stuck in an unemployment equilibrium due to a deficiency in aggregate demand.
- The solution was an expansion in government expenditure to revive employment, as private investment is volatile and driven by unpredictable expectations.

**Post-Keynesian Developments**
Economics is not a settled science. The 20th century saw further branches:
1. **Monetarism** (Milton Friedman): Argued monetary forces don't impact real variables like employment.
2. **Institutionalism**: Highlighted the role of social norms.
3. **Sraffian Economics**: Piero Sraffa provided a devastating critique of marginalist capital theory and revived classical political economy.

Today, multiple contending schools of thought co-exist, each offering different lenses to make sense of our economic surroundings.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What was the fundamental unit of analysis in Classical Political Economy (Smith, Ricardo, Marx) versus Marginalist Economics?",
          options: [
            "Classical: The Individual; Marginalist: Social Classes",
            "Classical: The Firm; Marginalist: The Government",
            "Classical: Social Classes; Marginalist: The Individual",
            "Classical: The Nation; Marginalist: The World Economy"
          ],
          correct_index: 2,
          model_answer: "Classical economics focused on classes (workers, capitalists, landowners), while the Marginalist revolution shifted the focus to methodological individualism (the individual consumer/firm).",
          difficulty: "intermediate"
        },
        {
          kind: "truefalse",
          prompt: "Keynesian economics agrees with the Marginalist view that a competitive economy naturally tends toward full employment.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Keynes published The General Theory specifically to argue that the economy has no automatic tendency toward full employment and can be stuck in unemployment equilibrium.",
          difficulty: "basic"
        }
      ],
      facts: [
        "The Marginalist Revolution of the 1870s introduced concepts like marginal utility and the marginal productivity theory of income distribution.",
        "Karl Marx and David Ricardo explicitly highlighted the conflict between workers and capitalists over income distribution, a concept minimized by later marginalist theories."
      ]
    },
    {
      slug: "our-definition-of-economics",
      title: "Our definition of economics",
      sectionNumber: "1.3",
      importance: "Core",
      summary: "Why this book adopts the 'science of wealth' over the 'science of choice'.",
      body: `**Science of Wealth vs. Science of Choice**
There are two dominant definitions of economics:

1. **Science of Wealth (Classical):** 
Adam Smith proposed that political economy has two objects: "to provide a plentiful revenue or subsistence for the people... and secondly, to supply the state... with a revenue sufficient for the public services." It focuses on **production** and how the aggregate surplus is generated and distributed.

2. **Science of Choice (Marginalist):**
Lionel Robbins defined economics as "the science which studies human behavior as a relationship between ends and scarce means which have alternative uses." It focuses on **allocation** under scarcity.

**The Standpoint of this Book**
This book adopts the **science of wealth** definition because of its emphasis on production. Following Keynes, our theoretical object of study is the **'monetary production economy'**.

For classical economists, questions of what determines the production, distribution, and disposal of the surplus were central. The science of wealth definition incorporates openness to politics and policies. Whether in India or elsewhere, we aspire to an ecologically clean and socially equal economy with full employment, low inflation, and decent wages. This necessitates an important role for the government in utilising the surplus for physical and social infrastructure (health, education). 

**The Role of History and Politics**
Economics cannot be ahistorical or apolitical. Decisions to distribute wealth are political. For instance, explaining why 1% of the Indian population owns 80% of the land requires acknowledging historical privileges, caste, and patriarchy, rather than just abstract economic merit. A pure 'science of choice' often obscures these realities.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Who famously defined economics as the science studying human behavior as a relationship between ends and scarce means?",
          options: [
            "Adam Smith",
            "Karl Marx",
            "Lionel Robbins",
            "John Maynard Keynes"
          ],
          correct_index: 2,
          model_answer: "Lionel Robbins provided the scarcity/choice definition of economics in 1932, which contrasts with Adam Smith's earlier 'science of wealth' definition.",
          difficulty: "basic"
        }
      ],
      facts: [
        "The 'science of wealth' definition focuses on the production and distribution of surplus, while the 'science of choice' focuses on the allocation of scarce resources."
      ]
    },
    {
      slug: "a-note-on-our-approach",
      title: "A note on our approach",
      sectionNumber: "1.4",
      importance: "Foundation",
      summary: "The object and levels of analysis, precision, and the embedded nature of the economy.",
      body: `**Object of Analysis**
The primary object of analysis in the initial stages of macroeconomic theorising is a **competitive economy**—characterised by the free mobility of labour and capital. 

Why use this abstraction when reality (like India's caste system and patriarchy) strictly prevents free mobility? 
1. **Precision:** It enables us to say something definitive. Free mobility implies that rates of return (profits) across sectors will tend to be uniform, providing a clear concept of *equilibrium* (a state of rest).
2. **Benchmark:** Once we understand the tendencies of a competitive economy, we are better equipped to study non-competitive 'actual' economies by introducing real-world frictions.

**Level of Analysis**
Economics can be studied at different levels of aggregation:
- **Micro:** How an individual makes decisions or a firm chooses technology.
- **Meso:** Examines specific sectors (e.g., agriculture vs. manufacturing) and their inter-relationships.
- **Macro:** Focuses on aggregates like total output, general price level, and total employment.

This book primarily adopts a **macro** approach, occasionally complemented by meso insights.

**Precision in Theory (Ceteris Paribus)**
To understand complex causal mechanisms, economists use the assumption of ***ceteris paribus*** ("other things remaining the same"). If we want to study the effect of government expenditure on employment, we hold inflation and private investment constant in our minds. It acts as a theoretical "scaffold" to isolate and examine specific tendencies before reintroducing real-world complexities.

**The Economy as an Embedded System**
Crucially, the macroeconomy does not exist in a vacuum. It is an abstraction that is deeply embedded within two larger realities:
1. **Society:** Driven by community norms, history, and political institutions (e.g., caste, gender, class).
2. **Ecology:** The natural environment which provides hard, binding physical limits on endless economic growth.

We theorise the economy as a distinct entity, but good economics must always reintegrate social and ecological constraints when translating theory into policy.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does the Latin phrase 'ceteris paribus' mean in economic theorising?",
          options: [
            "Let the buyer beware.",
            "Other things remaining the same.",
            "All markets clear simultaneously.",
            "Production creates its own demand."
          ],
          correct_index: 1,
          model_answer: "Ceteris paribus means 'other things being equal', and it is used to isolate the relationship between two variables by holding all other confounding variables constant.",
          difficulty: "basic"
        },
        {
          kind: "multi",
          prompt: "According to the text, the macroeconomy is fundamentally embedded within which two larger systems? (Select two)",
          options: [
            "The Stock Market",
            "Society (Community norms, politics)",
            "Ecology (The natural environment)",
            "The Banking Sector"
          ],
          correct_indices: [1, 2],
          model_answer: "The economy is a sub-system embedded within Society, which is in turn embedded within the broader Ecology/Environment.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "In a theoretical competitive economy, the free mobility of labour and capital implies that profit rates across different sectors will eventually equalize.",
        "The 'meso' level of economic analysis bridges the gap between micro and macro by focusing on specific sectors like agriculture, manufacturing, and services."
      ]
    }
  ]
};
