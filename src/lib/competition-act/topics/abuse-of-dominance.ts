import type { CompActChapter } from "../types";

/** Chapter 3 — Abuse of Dominant Position: when market power becomes unlawful. */
export const abuseOfDominance: CompActChapter = {
  slug: "abuse-of-dominance",
  title: "Abuse of Dominant Position",
  chapter: 3,
  tagline: "When market power becomes unlawful — dominance is legal, abusing it is not.",
  color: "#f5b95f",
  prereqs: ["anti-competitive-agreements"],
  unlocks: ["combinations"],
  intro: `Section 4 addresses a fundamentally different kind of competitive harm than Section 3. Agreements require at least two parties conspiring; dominance abuse requires only one. A firm that has become so powerful in a market that it can act independently of competitive pressures — setting prices, choosing customers, dictating terms — is "dominant." And dominance, by itself, is perfectly legal. The Act does not punish success. What it punishes is the *abuse* of the position success has built.

This distinction — between being dominant and abusing dominance — is the conceptual spine of the chapter. An enterprise is dominant when it can "operate independently of competitive forces prevailing in the relevant market" or can "affect its competitors or consumers or the relevant market in its favour" (Section 4, Explanation (a)). Abuse happens when the dominant enterprise uses that independence to impose unfair conditions, charge unfair prices, limit production, deny market access, make contracts contingent on unrelated obligations, or use its dominance in one market to enter or protect a position in another.

The two-step structure — first determine dominance, then assess abuse — makes this the most analytically complex provision in the Act. Market definition (from Section 2's definitions) is the gateway: you cannot be dominant in a market you have not defined. The CCI must delineate the relevant product market and the relevant geographic market before it even begins to ask about market share, entry barriers, and competitive constraints. Get the market definition wrong, and the entire dominance inquiry collapses.

India's jurisprudence under Section 4 has been shaped by landmark cases against Google, the Indian Railways, Coal India, and numerous pharmaceutical companies. Each one refined how dominance is measured, what counts as abuse, and what remedies the CCI can order. The three sections ahead break this down: how dominance is defined and measured, the specific types of abuse Section 4 prohibits, and how the CCI determines the "relevant market" in which dominance is assessed.`,
  sections: [
    {
      slug: "defining-dominance",
      title: "Defining Dominant Position",
      sectionNumber: "§4, Explanation (a)",
      importance: "Core",
      summary: "What 'dominant' means in law — the 13-factor test the CCI uses to determine if an enterprise can act independently of market forces.",
      body: `**The provision.** Section 4, Explanation (a) defines "dominant position" as a position of strength enjoyed by an enterprise in the relevant market in India, which enables it to: (i) operate independently of competitive forces prevailing in the relevant market, or (ii) affect its competitors or consumers or the relevant market in its favour. Section 19(4) lists 13 factors the CCI considers when assessing dominance:

Market share, size and resources, size and importance of competitors, economic power including commercial advantages, vertical integration, dependence of consumers, monopoly or dominant position enjoyed by virtue of statute or by reason of patents, countervailing buying power, market structure, social obligations and social costs, entry barriers (regulatory, financial, technological), and any other relevant factor.

**Why it matters.** Dominance is not simply about market share. A firm with 60% market share in a contestable market — where entry barriers are low and new competitors can emerge quickly — may not be dominant in the legal sense. Conversely, a firm with 40% share in a market with high regulatory barriers, significant switching costs, and network effects may be dominant. The 13-factor test forces a holistic assessment that goes far beyond simple arithmetic.

**The insight.** The CCI does not use a single bright-line threshold for dominance (unlike some jurisdictions where, say, 50% share creates a presumption). Instead, the Commission builds a composite picture. Market share is the starting point — below 25%, dominance is rarely found; above 50%, it is frequently found — but the supporting factors can tip the analysis either way. The *sustainability* of market power matters: a high share that could be eroded by a new technology within a year is less concerning than a moderate share protected by insurmountable regulatory licenses.

**The walk-through.** In **Coal India Limited v. CCI** (2014), the CCI found Coal India dominant in the market for production and supply of non-coking coal in India. Coal India's market share exceeded 75%, but the dominance finding rested on more than that: Coal India was a state-owned monopoly, entry into coal mining required government licenses that were practically unavailable to private players, consumers (power plants, steel companies) had no alternative domestic supplier, and switching to imported coal involved prohibitive logistics costs. Every factor on the Section 19(4) list pointed the same way — a textbook case where dominance was as much about structural market conditions as about raw share.

**The thread.** Finding dominance is only step one. The next question is: *did the dominant enterprise abuse that position?* Section 4(2) lists the specific acts that constitute abuse — and they range from unfair pricing to leveraging dominance from one market into another. That is the next read.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the primary conceptual difference between an offence under Section 3 (Anti-Competitive Agreements) and Section 4 (Abuse of Dominant Position)?",
          options: [
            "Section 3 applies only to goods; Section 4 applies to services.",
            "Section 3 requires at least two parties conspiring; Section 4 requires only one enterprise abusing its power.",
            "Section 3 is judged by the rule of reason; Section 4 is per se illegal.",
            "Section 3 involves the CCI; Section 4 involves civil courts."
          ],
          correct_index: 1,
          model_answer: "Section 3 requires an agreement between at least two parties. Dominance abuse under Section 4 is unilateral — it requires only one enterprise that has achieved a position of strength.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "If an enterprise captures over 50% market share, it is automatically considered to be violating Section 4 of the Competition Act.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Dominance itself is perfectly legal (the Act does not punish success). What Section 4 prohibits is the *abuse* of that dominant position.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "How did the CCI establish dominance in the Coal India Limited (2014) case beyond just its 75% market share?",
          model_answer: "The CCI relied on structural market conditions: Coal India was a state monopoly, entry required practically unavailable government licenses, domestic consumers had no alternative supplier, and imported coal had prohibitive logistics costs. Every factor under Section 19(4) pointed to dominance.",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "Which of the following are among the 13 factors the CCI considers when assessing dominance under Section 19(4)? Select all that apply.",
          options: [
            "Market share",
            "Size and resources of the enterprise",
            "Entry barriers (regulatory, financial, technological)",
            "Number of employees",
            "Dependence of consumers"
          ],
          correct_indices: [0, 1, 2, 4],
          model_answer: "Market share, size/resources, entry barriers, and consumer dependence are all statutory factors under Section 19(4). The number of employees is not explicitly a factor.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "Under Section 4, what defines a 'dominant position' in one sentence?",
          model_answer: "A position of strength enabling an enterprise to operate independently of competitive forces or affect competitors/consumers in its favour.",
          difficulty: "basic",
        }
      ],
      facts: [
        "In Indian competition law, being a monopoly or holding a dominant position is perfectly legal — only the *abuse* of that position is prohibited.",
        "The CCI uses a 13-factor test to determine dominance; market share is only the starting point, not the sole determinant.",
      ],
    },
    {
      slug: "types-of-abuse",
      title: "Types of Abuse",
      sectionNumber: "§4(2)(a)–(e)",
      importance: "Core",
      summary: "The five categories of abusive conduct: unfair pricing, predatory behaviour, market denial, tied selling, and leveraging.",
      body: `**The provision.** Section 4(2) lists five categories of conduct that constitute abuse of a dominant position:

**(a)** Imposing unfair or discriminatory conditions or prices (including predatory pricing) in the purchase or sale of goods or services.
**(b)** Limiting or restricting production of goods or provision of services, or limiting or restricting the market or technical or scientific development relating to goods or services to the prejudice of consumers.
**(c)** Indulging in practices resulting in denial of market access in any manner.
**(d)** Making the conclusion of contracts subject to acceptance of supplementary obligations which have no connection with the subject of the contracts (tied selling / bundling).
**(e)** Using dominant position in one relevant market to enter into, or protect, another relevant market (leveraging).

**Why it matters.** Each category captures a different way power can distort a market. Unfair pricing (a) means consumers pay more than they should. Output restriction (b) means less is available than should be. Market denial (c) means competitors who should exist do not. Tied selling (d) means buyers are forced to accept products they do not want. Leveraging (e) means dominance in one market spills into and corrupts another. Together, these five categories cover virtually every way a dominant firm can weaponise its position.

**The insight.** The most significant — and most debated — type of abuse is **predatory pricing** under clause (a). Predatory pricing means selling goods or services *below cost* to drive competitors out, with the expectation of raising prices once the market is cleared. The Explanation to Section 4 defines it as selling below cost "as may be determined by regulations." The challenge is defining "cost" — is it marginal cost, average variable cost, average total cost? The CCI has adopted a modified Areeda-Turner test (named after the US scholars who proposed it): pricing below average variable cost is presumptively predatory; pricing between average variable cost and average total cost may be predatory if other evidence of exclusionary intent exists.

**The walk-through.** In **Google/Android (2022)**, the CCI found Google guilty of abuse of dominance under multiple clauses of Section 4(2). Google was found to have: (a) imposed unfair conditions by requiring Android device manufacturers to pre-install the entire Google Mobile Services suite as a condition of licensing the Play Store; (c) denied market access to competing app stores and search engines by making pre-installation mandatory; (d) tied the Play Store (dominant product) with Google Search and Chrome (supplementary obligations); and (e) leveraged its dominance in the app store market to protect its position in the online search market. The CCI imposed a penalty of ₹1,337.76 crores and ordered Google to allow users to choose their default search engine and uninstall pre-installed apps. The case is India's most comprehensive application of Section 4(2).

**The thread.** Both dominance and abuse depend on one analytical foundation: the definition of the "relevant market." If the market is drawn too narrowly, every firm looks dominant; too broadly, none does. The next section unpacks how the CCI defines relevant markets — the single most consequential analytical step in any Section 4 case.`,
      questions: [
        {
          kind: "multi",
          prompt: "Which of the following are explicitly listed as types of abuse under Section 4(2)? Select all that apply.",
          options: [
            "Predatory pricing",
            "Limiting or restricting production",
            "Denial of market access",
            "Tied selling / bundling",
            "Lobbying the government for favorable regulations"
          ],
          correct_indices: [0, 1, 2, 3],
          model_answer: "Section 4(2) lists unfair/predatory pricing, output restriction, market denial, tied selling, and leveraging. Lobbying is not an abuse of dominance under the Act.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "What is 'predatory pricing', and how does the CCI determine if a price is predatory?",
          model_answer: "Predatory pricing is selling below cost to drive competitors out, with the intent of raising prices later. The CCI uses a modified Areeda-Turner test: pricing below average variable cost is presumptively predatory, while pricing between average variable cost and average total cost requires other evidence of exclusionary intent.",
          difficulty: "advanced",
        },
        {
          kind: "mcq",
          prompt: "In the Google/Android (2022) case, what practice was found to be an abuse of dominance via 'tied selling' (Section 4(2)(d))?",
          options: [
            "Paying Apple to be the default search engine on iOS.",
            "Requiring device manufacturers to pre-install the entire Google Mobile Services suite to license the Play Store.",
            "Banning third-party apps from using alternative payment systems.",
            "Selling Android devices at a loss."
          ],
          correct_index: 1,
          model_answer: "Google tied the licensing of its dominant product (Play Store) to the acceptance of a supplementary obligation — pre-installing the entire Google Mobile Services suite, including Search and Chrome.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "Leveraging occurs when a dominant enterprise uses its position in one market to protect its position in that identical market.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Leveraging (Section 4(2)(e)) is using dominance in *one* relevant market to enter or protect a position in *another* relevant market.",
          difficulty: "basic",
        },
        {
          kind: "quickfire",
          prompt: "What type of abuse is it when an enterprise makes a contract subject to unrelated supplementary obligations?",
          model_answer: "Tied selling or bundling.",
          difficulty: "basic",
        }
      ],
      facts: [
        "In 2022, the CCI fined Google ₹1,337 crores for multiple abuses, including tying the Play Store to the pre-installation of Google Search and Chrome.",
      ],
    },
    {
      slug: "relevant-market",
      title: "Determining the Relevant Market",
      sectionNumber: "§2(r)–(t), §19(5)–(7)",
      importance: "Core",
      summary: "How the CCI defines the playing field — product substitutability, geographic boundaries, and the SSNIP test.",
      body: `**The provision.** The "relevant market" is determined as the intersection of: (i) the **relevant product market** (Section 2(t)) — all products or services regarded as interchangeable or substitutable by consumers, by reason of characteristics, prices, and intended use; and (ii) the **relevant geographic market** (Section 2(s)) — a distinguishable area in which conditions of competition are homogeneous. Sections 19(6) and 19(7) list the factors the CCI considers for each.

For the product market (Section 19(7)): physical characteristics, price, end-use, consumer preferences, exclusion of in-house production for captive consumption, classification in industry standards, and the existence of specialised producers.

For the geographic market (Section 19(6)): regulatory trade barriers, local specification requirements, national procurement policies, transport costs, language, consumer preferences, and the need for a secure or regular supply.

**Why it matters.** Market definition is the *gateway* to dominance analysis. A company can be dominant in "the market for online food delivery in Mumbai" but not dominant in "the market for restaurant services in India." The same company, the same conduct — different market definition, opposite outcome. This is not a bug; it is how competition analysis works. Markets are defined by what a consumer can switch to (demand-side) and what a producer can switch to making (supply-side). The narrower the set of realistic alternatives, the narrower the market, and the more likely a firm within it is dominant.

**The insight.** The globally standard tool for market definition is the **SSNIP test** (Small but Significant Non-transitory Increase in Price), also called the "hypothetical monopolist test." Ask: if a hypothetical monopolist of product X raised prices by 5–10% for a sustained period, would enough consumers switch to product Y that the price increase would be unprofitable? If yes, X and Y are in the same market (they are substitutes). If no — consumers are locked in — then X is its own relevant market. The CCI does not always apply the SSNIP test formally, but the *logic* of the test underpins every market-definition decision the Commission makes.

**The walk-through.** In **Matrimony.com v. Google** (2018), the question was whether Google's "dominant market" was (a) online search advertising, (b) all online advertising (including social media ads, display ads), or (c) all advertising (including print, TV, radio). Matrimony.com argued it was (a) — a narrow market where Google's share exceeded 90%. Google argued it was (c) — a broad market where Google competed with television and newspapers and held a modest share. The CCI sided with a narrow definition: online search advertising in India. The reasoning followed SSNIP logic — an advertiser wanting to reach users at the moment of search intent could not meaningfully substitute a newspaper ad or a television spot. The search is specific, the intent is immediate, and no other advertising medium provides the same thing. With the market drawn narrowly, Google's dominance was inescapable.

**The thread.** Dominance analysis is complete — you can now define the market, assess dominance within it, and identify the specific abuse. But the Act does not only govern existing market power; it also governs the *creation* of market power through combinations (mergers and acquisitions). Chapter 4, Regulation of Combinations, is where the CCI acts as a gatekeeper *before* dominance is created, rather than a prosecutor *after* it is abused.`,
      questions: [
        {
          kind: "mcq",
          prompt: "The 'relevant market' is determined as the intersection of which two components?",
          options: [
            "Relevant product market and relevant consumer market",
            "Relevant product market and relevant geographic market",
            "Relevant domestic market and relevant export market",
            "Relevant supplier market and relevant distributor market"
          ],
          correct_index: 1,
          model_answer: "The relevant market is the intersection of the relevant product market (substitutable goods/services) and the relevant geographic market (area with homogeneous conditions of competition).",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Explain the logic of the SSNIP (hypothetical monopolist) test used for market definition.",
          model_answer: "The SSNIP test asks: if a hypothetical monopolist of product X raised prices by a Small but Significant Non-transitory amount (5-10%), would enough consumers switch to product Y to make the increase unprofitable? If yes, X and Y are substitutes (same market). If no (consumers are locked in), X is its own relevant market.",
          difficulty: "advanced",
        },
        {
          kind: "truefalse",
          prompt: "In Matrimony.com v. Google (2018), the CCI agreed with Google that its relevant market was 'all advertising' (including print and TV) because all media compete for ad budgets.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The CCI defined the market narrowly as 'online search advertising in India'. It reasoned that an advertiser wanting to reach users at the exact moment of search intent could not meaningfully substitute a TV or newspaper ad.",
          difficulty: "intermediate",
        },
        {
          kind: "multi",
          prompt: "Which of the following factors does the CCI consider when defining the relevant geographic market under Section 19(6)? Select all that apply.",
          options: [
            "Regulatory trade barriers",
            "Transport costs",
            "Physical characteristics of the product",
            "Language",
            "Consumer preferences"
          ],
          correct_indices: [0, 1, 3, 4],
          model_answer: "Regulatory barriers, transport costs, language, and consumer preferences are geographic market factors. Physical characteristics of the product are used to define the *product* market, not the geographic market.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "The SSNIP test (Small but Significant Non-transitory Increase in Price) is the global standard for defining a market: if a 5% price hike makes consumers switch, the markets are the same.",
      ],
    },
  ],
};
