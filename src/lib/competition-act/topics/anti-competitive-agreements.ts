import type { CompActChapter } from "../types";

/** Chapter 2 — Anti-Competitive Agreements: the heart of competition law. */
export const antiCompetitiveAgreements: CompActChapter = {
  slug: "anti-competitive-agreements",
  title: "Anti-Competitive Agreements",
  chapter: 2,
  tagline: "Cartels, price-fixing, bid-rigging, and the line between cooperation and collusion.",
  color: "#f97066",
  prereqs: ["preliminary"],
  unlocks: ["abuse-of-dominance"],
  intro: `Section 3 is the engine room of the Competition Act. If the definitions were the vocabulary, this is the first sentence the Act speaks — and it says: *certain agreements between enterprises shall be void, and the Commission may penalise them.* But not all agreements. The law draws a careful line between agreements that are presumed harmful (horizontal restraints between competitors) and agreements that *might* be harmful depending on context (vertical restraints between entities at different levels of the supply chain). Understanding that line is the entire chapter.

The architecture is elegant. Section 3(1) lays down the general prohibition: no enterprise shall enter into any agreement in respect of production, supply, distribution, storage, acquisition, or control of goods or provision of services which causes, or is likely to cause, an appreciable adverse effect on competition (AAEC) in India. Section 3(2) declares such agreements void. Then Section 3(3) creates the presumption for horizontal agreements — cartels — where the adverse effect is *assumed*: price-fixing, output limitation, market allocation, and bid-rigging are per se violations. Section 3(4) lists vertical agreements — tie-in arrangements, exclusive supply, exclusive distribution, refusal to deal, resale price maintenance — where the AAEC must be *proved* by examining actual market effects.

This two-tier structure mirrors the approach of most mature competition jurisdictions. The European Union distinguishes between "object" restrictions (per se) and "effect" restrictions (rule of reason); the United States similarly separates per se illegality from rule-of-reason analysis. India borrowed the best of both traditions when drafting Section 3, and the CCI has, over two decades of orders, developed a substantial body of precedent interpreting each clause.

The four sections ahead walk you through horizontal agreements (the per se world), vertical agreements (the effects-based world), the exemptions the Act carves out, and finally the analytical framework the CCI uses to decide whether an agreement crosses the line.`,
  sections: [
    {
      slug: "horizontal-agreements",
      title: "Horizontal Agreements & Cartels",
      sectionNumber: "§3(3)",
      importance: "Core",
      summary: "Price-fixing, bid-rigging, output restriction, and market allocation — the four per se violations.",
      body: `**The provision.** Section 3(3) identifies four types of agreements between enterprises engaged in *identical or similar* trade (i.e., competitors) that are presumed to cause an appreciable adverse effect on competition:

(a) **Price-fixing** — directly or indirectly determining purchase or sale prices.
(b) **Output limitation** — limiting or controlling production, supply, markets, technical development, investment, or provision of services.
(c) **Market allocation** — sharing the market by geography, type of goods, number of customers, or any other similar way.
(d) **Bid-rigging** — directly or indirectly manipulating the process of bidding, including any arrangement between competitors to fix bids.

These are "per se" violations — the CCI does not need to prove actual harm. The agreement itself is the offence.

**Why it matters.** Cartels are the cancer of markets. When competitors agree on prices rather than competing, consumers pay more, quality stagnates, and innovation dies. The per se rule exists because decades of global enforcement experience have shown that these four types of agreements *never* produce efficiencies that outweigh their harm. No cartel in the history of competition law has successfully argued that fixing prices was good for consumers. The law therefore skips the balancing exercise entirely: prove the agreement existed, and the violation is established.

**The insight.** The hardest part of cartel enforcement is *proof*. Cartels do not sign contracts. They meet in hotel rooms, communicate through intermediaries, use code words. The CCI relies on three types of evidence: (1) **direct evidence** — documents, emails, WhatsApp messages, witness testimony; (2) **economic evidence** — parallel pricing behaviour that cannot be explained by market forces; and (3) **circumstantial evidence** — meetings between competitors, exchange of commercially sensitive information, patterns of co-ordination. The 2023 amendment to the Act strengthened the CCI's investigative tools, including powers related to dawn raids and digital evidence.

**The walk-through.** In the landmark **Cement Cartel case** (2012), the CCI found that 11 cement companies — controlling over 80% of India's cement production — had been co-ordinating production, supply, and prices through the Cement Manufacturers' Association. The evidence included minutes of association meetings where production data was shared, parallel price increases across all members within days of each other, and a pattern of capacity utilisation that made no independent economic sense. The CCI imposed a penalty of ₹6,307 crores — the largest cartel penalty in Indian history at that time. The case remains the foundational precedent for how Section 3(3) operates.

**The thread.** Horizontal agreements are between competitors — entities on the *same* rung of the supply chain. But what about agreements between entities on *different* rungs — a manufacturer and its dealers, a platform and its sellers? Those are vertical agreements, governed by Section 3(4), and they follow entirely different analytical rules. That is the next read.`,
      questions: [
        {
          kind: "multi",
          prompt: "Which of the following are the per se horizontal violations under Section 3(3)? Select all that apply.",
          options: [
            "Price-fixing",
            "Output/production limitation",
            "Market allocation",
            "Bid-rigging",
            "Resale price maintenance",
          ],
          correct_indices: [0, 1, 2, 3],
          model_answer: "Section 3(3) lists price-fixing, output limitation, market allocation, and bid-rigging as presumed (per se) violations. Resale price maintenance is a vertical restraint under Section 3(4), judged by the rule of reason — not a Section 3(3) per se offence.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "For a Section 3(3) horizontal violation, the CCI must prove actual harm to competition before it can penalise the cartel.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 3(3) violations are 'per se' — the adverse effect is presumed. The CCI need only prove the agreement existed; it does not have to prove actual harm. (Contrast vertical agreements under 3(4), which require a rule-of-reason effects analysis.)",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Cartels rarely sign contracts. What three types of evidence does the CCI rely on to prove a cartel, and give an example of each?",
          model_answer: "(1) Direct evidence — documents, emails, WhatsApp messages, witness testimony; (2) economic evidence — parallel pricing that market forces cannot explain; (3) circumstantial evidence — meetings between competitors, exchange of commercially sensitive information, co-ordinated patterns. In the Cement Cartel case all three appeared: association meeting minutes sharing production data, near-simultaneous parallel price increases, and unexplained capacity-utilisation patterns.",
          difficulty: "advanced",
        },
        {
          kind: "mcq",
          prompt: "In the landmark Cement Cartel case (2012), what did the CCI find was the vehicle used to co-ordinate production and prices?",
          options: [
            "Secret offshore bank accounts",
            "The Cement Manufacturers' Association",
            "A shared pricing algorithm",
            "Government tender committees",
          ],
          correct_index: 1,
          model_answer: "The 11 cement companies co-ordinated through the Cement Manufacturers' Association — its meetings shared production data and preceded parallel price hikes. The CCI imposed a ₹6,307 crore penalty, then the largest cartel penalty in Indian history.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "What is 'bid-rigging' in one line?",
          model_answer: "Any arrangement between competitors to manipulate the bidding process — e.g. agreeing in advance who will win a tender, or submitting deliberately high 'cover' bids.",
          difficulty: "basic",
        },
      ],
      facts: [
        "In 2012 the CCI fined 11 cement companies ₹6,307 crore for running a cartel through their trade association — then the largest cartel penalty in Indian history.",
        "Price-fixing is 'per se' illegal in India: the regulator doesn't have to prove it hurt anyone. No cartel in competition-law history has ever won by arguing that fixing prices helped consumers.",
      ],
    },
    {
      slug: "vertical-agreements",
      title: "Vertical Agreements & Restraints",
      sectionNumber: "§3(4)",
      importance: "Core",
      summary: "Tie-ins, exclusive dealing, RPM, and refusal to deal — restraints that need a rule-of-reason analysis.",
      body: `**The provision.** Section 3(4) lists five types of agreements between enterprises at *different levels* of the production chain (manufacturer-distributor, franchisor-franchisee, platform-seller) that *may* cause an AAEC:

(a) **Tie-in arrangements** — requiring a buyer to purchase one product as a condition of buying another.
(b) **Exclusive supply agreements** — restricting a buyer from acquiring goods from any other seller.
(c) **Exclusive distribution agreements** — restricting a seller from distributing to anyone other than the specified buyer.
(d) **Refusal to deal** — restricting by agreement the persons or classes to whom goods are sold or from whom goods are bought.
(e) **Resale price maintenance (RPM)** — any agreement requiring a re-seller to sell goods at a price fixed by the supplier.

Unlike Section 3(3), these agreements are *not* per se illegal. The CCI must evaluate them under the **rule of reason** — examining whether, on balance, the agreement actually harms competition.

**Why it matters.** Vertical restraints are fundamentally ambiguous. A manufacturer requiring exclusive distribution may be restricting competition — or it may be investing in dealer training and after-sales service that would be free-ridden without exclusivity. A tie-in might force unwanted products on buyers — or it might be a quality-assurance mechanism (think printers and ink cartridges). The law acknowledges this ambiguity by requiring case-by-case analysis rather than blanket prohibition.

**The insight.** The rule-of-reason assessment under Section 19(3) considers six factors: (a) creation of barriers to new entrants, (b) driving existing competitors out, (c) foreclosure of competition by hindering entry, (d) accrual of benefits to consumers, (e) improvements in production or distribution, and (f) promotion of technical, scientific, or economic development. The CCI weighs pro-competitive benefits against anti-competitive harms. If benefits outweigh, the agreement survives; if harms dominate, it falls.

**The walk-through.** In **Hyundai Motor India v. CCI** (2017), a dealer complained that Hyundai restricted where dealers could sell cars (exclusive territory allocation) and imposed minimum resale prices. The CCI analysed the agreements under Section 3(4) and found that while some territorial restrictions served legitimate distribution efficiency purposes, the resale price maintenance component — fixing the actual prices at which dealers sold to consumers — had no pro-competitive justification. Hyundai could protect its brand and distribution network without dictating final consumer prices. The RPM clause was struck down; the territorial allocation survived. This case illustrates the surgical precision the rule-of-reason approach enables.

**The thread.** You now see the two tiers: per se for cartels, rule of reason for verticals. But the Act is not absolute — it carves out specific exemptions for certain types of agreements. The next section explains who gets a pass, and why.`,
      questions: [
        {
          kind: "truefalse",
          prompt: "Vertical agreements under Section 3(4) are per se illegal, just like cartels.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Vertical restraints (tie-ins, exclusive supply/distribution, refusal to deal, RPM) are judged under the rule of reason — the CCI must prove they actually cause an appreciable adverse effect on competition, weighing pro- and anti-competitive effects.",
          difficulty: "basic",
        },
        {
          kind: "mcq",
          prompt: "A requirement that a buyer purchase product B as a condition of being allowed to buy product A is called:",
          options: ["Exclusive supply", "A tie-in arrangement", "Resale price maintenance", "Refusal to deal"],
          correct_index: 1,
          model_answer: "A tie-in arrangement — conditioning the sale of one product on the purchase of another. The classic example is printers tied to the manufacturer's own ink cartridges.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Why does the law treat vertical restraints as 'ambiguous' rather than presumptively harmful? Illustrate with exclusive distribution.",
          model_answer: "Because a vertical restraint can be harmful OR efficiency-enhancing depending on context. Exclusive distribution can foreclose rivals — but it can also let a manufacturer invest in dealer training and after-sales service that would be free-ridden without exclusivity. Because the effect is genuinely case-dependent, the law requires a rule-of-reason analysis instead of a blanket ban.",
          difficulty: "advanced",
        },
        {
          kind: "open",
          prompt: "In Hyundai Motor India v. CCI (2017), which vertical restraint survived and which fell, and why?",
          model_answer: "Territorial/exclusive-distribution restrictions survived because they served legitimate distribution-efficiency purposes. The resale price maintenance component — Hyundai dictating the actual prices dealers charged consumers — fell, because Hyundai could protect its brand and network without fixing final consumer prices, so the RPM had no pro-competitive justification. It shows the surgical precision of rule-of-reason analysis.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "What does 'RPM' stand for in competition law?",
          model_answer: "Resale Price Maintenance — an agreement requiring a re-seller to sell at a price fixed by the supplier.",
          difficulty: "basic",
        },
      ],
      facts: [
        "The reason your printer only 'accepts' the manufacturer's ink is a classic tie-in arrangement — one of the vertical restraints competition law scrutinises under the rule of reason.",
      ],
    },
    {
      slug: "exemptions",
      title: "Exemptions from Section 3",
      sectionNumber: "§3(5)",
      importance: "Core",
      summary: "Intellectual property rights and reasonable export restraints — the two safe harbours from anti-competitive agreement liability.",
      body: `**The provision.** Section 3(5) carves out two categories of agreements from the prohibitions of Section 3:

(i) **Intellectual property rights** — the right of any person to restrain any infringement of, or to impose reasonable conditions for the protection of, any right under the Copyright Act, Patents Act, Trademarks Act, Geographical Indications Act, Designs Act, or Semiconductor Integrated Circuits Layout-Design Act. In other words, the *exercise* of an IPR is not automatically an anti-competitive agreement.

(ii) **Export agreements** — agreements relating exclusively to the export of goods from India, to the extent that they do not affect competition in India.

**Why it matters.** The IPR exemption is the most litigated carve-out in the Act. Every patent is a legal monopoly — the right to exclude others from making, selling, or using the invention for a fixed period. Competition law prohibits monopolistic behaviour. The two bodies of law are therefore in permanent tension: one grants exclusive rights, the other attacks exclusion. Section 3(5)(i) resolves the tension by saying that *exercising* an IPR right — licensing it on reasonable terms, suing infringers — is protected. But *abusing* the IPR — using it as a vehicle for a cartel, tying unrelated products to a patented product, or refusing to license on FRAND terms — is not.

**The insight.** The key word in Section 3(5)(i) is "reasonable." Not all conditions a rights-holder imposes are protected — only *reasonable* ones. A pharmaceutical company holding a patent on a life-saving drug can enforce its patent and prevent generic manufacturers from copying it during the patent term. But if it enters into an agreement with other patent-holders to cross-license in a way that excludes all competitors from the market (a patent pool cartel), the exemption evaporates. The reasonableness test means Section 3(5) is a shield for legitimate IP use, not a sword for anti-competitive strategy disguised as IP management.

**The walk-through.** In **Ericsson v. Micromax** (2013), Ericsson held Standard Essential Patents (SEPs) for 2G and 3G telecom technologies and demanded royalty rates that Micromax argued were excessive and discriminatory. Micromax filed a complaint with the CCI, alleging abuse of dominance (Section 4) rather than an anti-competitive agreement (Section 3), but the case raised the Section 3(5) question squarely: does holding an SEP and demanding royalties fall within the IPR exemption? The CCI held that while the patent itself is protected, the *terms* of licensing are not beyond scrutiny — especially for SEPs where the holder has made a FRAND (Fair, Reasonable, and Non-Discriminatory) commitment. The IPR exemption protects the right, not the abuse of the right.

**The thread.** Exemptions tell you where the Act *does not* reach. But what analytical framework does the CCI use when the Act *does* reach? The next section — the AAEC test — is the heart of the analysis, the six-factor balancing test the CCI applies to every agreement that is not per se illegal.`,
      questions: [
        {
          kind: "multi",
          prompt: "Which two categories of agreement does Section 3(5) exempt from the Section 3 prohibitions? Select all that apply.",
          options: [
            "Reasonable conditions protecting intellectual property rights",
            "Agreements relating exclusively to exports from India",
            "Any agreement approved by a company's board",
            "Agreements between firms with under 10% market share",
          ],
          correct_indices: [0, 1],
          model_answer: "Section 3(5) exempts (i) reasonable conditions imposed to protect IPRs (patents, copyright, trademarks, etc.) and (ii) agreements relating exclusively to exports from India insofar as they don't affect competition in India. Board approval and a market-share threshold are not statutory exemptions.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "Because a patent is a legal monopoly, exercising any patent right can never violate the Competition Act.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 3(5)(i) protects only *reasonable* conditions to protect an IPR. Using a patent as a vehicle for a cartel, tying unrelated products, or refusing to license a standard-essential patent on FRAND terms is an abuse that falls outside the exemption.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "The IPR exemption turns on a single word. What is it, and how did Ericsson v. Micromax (2013) illustrate its limits?",
          model_answer: "The word is 'reasonable' — only reasonable conditions to protect an IPR are exempt. In Ericsson v. Micromax, Ericsson held Standard Essential Patents and demanded royalties Micromax called excessive/discriminatory. The CCI held that while the patent itself is protected, the *terms* of licensing are open to scrutiny — especially for SEPs subject to a FRAND commitment. The exemption protects the right, not the abuse of the right.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "What does 'FRAND' stand for?",
          model_answer: "Fair, Reasonable, and Non-Discriminatory — the licensing commitment a holder of a standard-essential patent makes.",
          difficulty: "intermediate",
        },
      ],
      facts: [
        "Patent law grants a monopoly; competition law attacks monopoly. Section 3(5) resolves the clash with one word — 'reasonable': using an IPR is protected, abusing it as a cartel tool is not.",
      ],
    },
    {
      slug: "aaec-test",
      title: "The AAEC Test & Analytical Framework",
      sectionNumber: "§19(3), §3(1)",
      importance: "Core",
      summary: "The six-factor balancing test the CCI uses to decide whether an agreement appreciably harms competition.",
      body: `**The provision.** Section 3(1) prohibits agreements that cause or are *likely to cause* an "appreciable adverse effect on competition" (AAEC) in India. For vertical agreements under Section 3(4), the CCI must actually prove the AAEC. Section 19(3) lists the six factors the CCI must consider:

(a) Creation of barriers to new entrants in the market.
(b) Driving existing competitors out of the market.
(c) Foreclosure of competition by hindering entry into the market.
(d) Accrual of benefits to consumers — lower prices, better quality, wider choice.
(e) Improvements in production or distribution of goods or provision of services.
(f) Promotion of technical, scientific, and economic development by means of production or distribution of goods or provision of services.

Factors (a)–(c) are anti-competitive harms; factors (d)–(f) are pro-competitive benefits. The CCI weighs them against each other.

**Why it matters.** The AAEC test is where competition law becomes *economics*. It is not enough to show that an agreement restricts competition in some abstract sense — the restriction must be "appreciable," meaning quantitatively or qualitatively significant. A corner shop's exclusive supply deal with a local dairy is unlikely to appreciably affect competition in the national dairy market. But the same type of deal between a dominant e-commerce platform and a leading electronics brand might foreclose the entire online market for competing platforms.

**The insight.** The word "appreciable" does the heaviest lifting in the entire Act. The CCI has developed a body of case law establishing that appreciability depends on: the market share of the parties, the degree of market concentration, the duration of the agreement, the existence of alternative sources or channels, and the actual or likely effect on prices and consumer choice. There is no bright-line threshold — it is a holistic assessment. This is what makes competition law intellectually demanding: the same agreement can be legal or illegal depending on the market context in which it operates.

**The walk-through.** In **FICCI v. United Producers/Distributors Forum** (the Multiplex case, 2011), film producers and distributors collectively decided to withhold new releases from multiplex chains unless the multiplexes agreed to a specific revenue-sharing formula. The CCI analysed the arrangement under the AAEC framework: were barriers to entry created? (Yes — new multiplexes could not access content.) Were existing competitors driven out? (Partly — single-screen theatres benefited at multiplexes' expense.) Were there consumer benefits? (No — consumers were denied choice about where to watch new releases.) The weighing exercise was decisive: harms substantially outweighed any claimed benefits. The CCI found a violation of Section 3(3)(a) — a collective price-fixing arrangement among competitors — and imposed penalties.

**Complexity.** The AAEC test is the reason competition law is neither a simple checklist nor a subjective judgment call. It is a structured economic analysis wrapped in a legal framework. Master the six factors, and you have the analytical skeleton key for every non-per-se case under the Act.

**The thread.** You have now seen the Act's first major prohibition — agreements that distort competition. The next chapter turns to a different kind of harm: what happens when a single enterprise becomes so powerful that it can *unilaterally* distort the market. Section 4, Abuse of Dominant Position, does not require an agreement between parties. It requires only one thing — power — and then asks how that power is used.`,
      questions: [
        {
          kind: "multi",
          prompt: "Under Section 19(3), which of the following are considered 'pro-competitive benefits' in the AAEC test? Select all that apply.",
          options: [
            "Accrual of benefits to consumers",
            "Creation of barriers to new entrants",
            "Improvements in production or distribution",
            "Promotion of technical, scientific, and economic development",
            "Foreclosure of competition by hindering entry"
          ],
          correct_indices: [0, 2, 3],
          model_answer: "Factors (d)-(f) are benefits: consumer benefits, improvements in production/distribution, and promotion of technical/economic development. Barriers to entry and foreclosure are anti-competitive harms.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "To prove an appreciable adverse effect on competition, there is a strict, bright-line market share threshold that must be crossed.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. There is no bright-line threshold. 'Appreciable' is a holistic assessment depending on market share, concentration, duration of agreement, and actual/likely effects on consumer choice.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "How did the CCI apply the AAEC balancing test in FICCI v. United Producers/Distributors Forum (the 2011 Multiplex case)?",
          model_answer: "Film producers collectively withheld new releases from multiplexes to force a revenue-sharing formula. The CCI weighed the harms (barriers to entry for new multiplexes, consumers denied choice of where to watch) against claimed benefits (none found). The harms substantially outweighed benefits, resulting in a penalty for a Section 3(3)(a) collective price-fixing violation.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "What does 'AAEC' stand for in Indian competition law?",
          model_answer: "Appreciable Adverse Effect on Competition.",
          difficulty: "basic",
        },
        {
          kind: "mcq",
          prompt: "Why is an exclusive supply deal between a corner shop and a local dairy unlikely to trigger the Act, while the same deal between a dominant e-commerce platform and a leading electronics brand might?",
          options: [
            "Because the Competition Act exempts the dairy industry.",
            "Because corner shops are not considered 'enterprises'.",
            "Because the restriction must be 'appreciable' (quantitatively or qualitatively significant) in a market context.",
            "Because vertical restraints only apply to e-commerce."
          ],
          correct_index: 2,
          model_answer: "The restriction must be 'appreciable'. The corner shop's deal lacks the market significance to appreciably affect competition in the broader market, whereas a dominant platform's exclusive deal could foreclose the entire online market.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "The AAEC test is an economic balancing act: the CCI weighs three statutory 'harms' (like creating barriers to entry) against three statutory 'benefits' (like improving production).",
      ],
    },
  ],
};
