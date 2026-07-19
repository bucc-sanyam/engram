import type { CompActChapter } from "../types";

/** Chapter 10 — Competition Advocacy & Miscellaneous: the Act's broader mission. */
export const advocacyMiscellaneous: CompActChapter = {
  slug: "advocacy-miscellaneous",
  title: "Competition Advocacy & Miscellaneous",
  chapter: 10,
  tagline: "Beyond enforcement — advocacy, appeals, and the operational provisions that complete the statutory framework.",
  color: "#22d3ee",
  prereqs: ["penalties"],
  unlocks: [],
  intro: `The Competition Act is not just an enforcement statute. Its vision extends beyond penalising offenders to *shaping* a culture of competition across Indian markets. Sections 49–66 — the final stretch of the Act — contain three categories of provisions: (1) **competition advocacy**, where the CCI advises government bodies on the competitive impact of their policies; (2) the **appellate mechanism**, which ensures CCI orders are subject to independent judicial review; and (3) **miscellaneous provisions** that address the Act's relationship with other laws, its operational rules, and its regulatory infrastructure.

These provisions are often overlooked in academic study because they lack the drama of cartel penalties or merger blocks. But they are the Act's long game. Enforcement catches the wrongdoer after the harm; advocacy prevents the harm from arising. A government policy that inadvertently creates a monopoly — a single-vendor telecom license, a regulatory standard that only one company can meet, a public procurement rule that favours incumbent suppliers — can cause more competitive damage than any private cartel. The CCI's advocacy role allows it to flag these issues before they crystallise into market distortions.

The appellate mechanism is equally essential. The CCI wields enormous power — penalties running into thousands of crores, orders that restructure industries, directions that fundamentally change how companies operate. That power must be checked. The National Company Law Appellate Tribunal (NCLAT), which replaced the Competition Appellate Tribunal (COMPAT) in 2017, provides the first level of appellate review; the Supreme Court provides the final word.

This closing chapter completes the statute. Read it, and you will have walked through every significant provision of the Competition Act, 2002 — from definition to enforcement to appeal.`,
  sections: [
    {
      slug: "competition-advocacy",
      title: "Competition Advocacy",
      sectionNumber: "§49",
      importance: "Foundation",
      summary: "The CCI as policy advisor — how it reviews government policies, legislation, and regulations for their impact on competition.",
      body: `**The provision.** Section 49 provides that the Central Government or a State Government may make a **reference** to the CCI for its opinion on the possible effect on competition of a proposed policy, law, or regulation. The CCI may also, *on its own initiative*, take steps to promote competition advocacy, create awareness, and impart training about competition issues.

The CCI's opinion under Section 49 is advisory — it is not binding on the government. However, the CCI publishes its opinions, creating a public record and reputational pressure for the government to address competition concerns.

**Why it matters.** Governments are among the most significant sources of competitive distortion. A government that grants exclusive telecom spectrum to a single operator creates a monopoly. A regulation that requires a specific proprietary technology standard locks competitors out. A public procurement rule that pre-qualifies only companies above a certain size excludes SMEs. These distortions often arise not from anti-competitive intent, but from inadequate consideration of competitive effects during policy design. Section 49 is the mechanism for injecting competition thinking into government decision-making *before* the policy is finalised.

**The insight.** Competition advocacy operates through two channels. First, **reactive advocacy**: the government sends a reference, and the CCI provides an opinion. The CCI has received and responded to references on policies ranging from broadcasting sector tariffs to pharmaceutical price controls to e-commerce FDI rules. Second, **proactive advocacy**: the CCI conducts its own market studies, publishes reports on competitive conditions in specific sectors, and engages with regulators, trade bodies, and academic institutions. The CCI has published market studies on sectors including telecom, pharmaceuticals, broadcasting, cement, and e-commerce — each one identifying competitive bottlenecks and recommending policy reforms.

**The walk-through.** In 2020, the CCI published a landmark **Market Study on E-Commerce in India**, examining competitive dynamics in online retail and platform markets. The study identified concerns about: (a) platforms favouring their own private-label products over third-party sellers; (b) deep discounting funded by platform subsidies that independent retailers could not match; (c) exclusive arrangements between platforms and major brands; and (d) data advantages that platforms accumulated over sellers operating on their platform. The study's recommendations — on platform neutrality, data sharing, and transparency of search algorithms — influenced subsequent government policy discussions on e-commerce regulation. No penalty was imposed; no order was passed. But the study shifted the policy conversation — which is advocacy at its most effective.

**The thread.** Advocacy shapes policy; enforcement shapes behaviour. But what happens when a company disagrees with the CCI's enforcement order? The appellate mechanism — the NCLAT and the Supreme Court — provides the check on CCI power. That is the next section.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 49, what is the legal effect of an opinion given by the CCI to the government regarding a proposed policy?",
          options: [
            "It is legally binding and the government must amend the policy.",
            "It acts as a permanent veto over the policy.",
            "It is purely advisory and not legally binding on the government.",
            "It automatically triggers a Supreme Court review."
          ],
          correct_index: 2,
          model_answer: "The CCI's advocacy opinions are advisory. The government doesn't have to follow them, though publishing the opinion creates public pressure.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The CCI can only review government policies if the government explicitly sends a formal 'reference' asking for the CCI's opinion.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The CCI can act reactively (answering references) but also proactively (conducting market studies and advocacy on its own initiative).",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Why is the CCI's 'competition advocacy' role sometimes considered just as important as its enforcement role?",
          model_answer: "Enforcement catches bad behaviour after the harm is done. Advocacy prevents the harm from happening in the first place by advising against government policies that would inadvertently create monopolies or distort markets.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "What type of report did the CCI publish in 2020 that significantly influenced policy discussions on online retail without imposing any penalties?",
          model_answer: "A Market Study (specifically on E-Commerce in India).",
          difficulty: "basic",
        }
      ],
      facts: [
        "The CCI doesn't just punish companies; it also acts as an advisor to the government, warning them if a proposed law or policy might accidentally create a monopoly.",
      ],
    },
    {
      slug: "appeals-nclat",
      title: "Appeals & the NCLAT",
      sectionNumber: "§53A–53T (as substituted)",
      importance: "Core",
      summary: "Challenging CCI orders — the appellate hierarchy from NCLAT to Supreme Court, timelines, and grounds for appeal.",
      body: `**The provision.** The Competition Act originally established a **Competition Appellate Tribunal (COMPAT)** to hear appeals against CCI orders. The Finance Act, 2017 dissolved the COMPAT and transferred its functions to the **National Company Law Appellate Tribunal (NCLAT)**.

Any person aggrieved by a direction, decision, or order of the CCI may appeal to the NCLAT within **60 days** of the order (Section 53B). The NCLAT may confirm, modify, or set aside the CCI's order.

An appeal from the NCLAT lies to the **Supreme Court** on one or more of the grounds specified in Section 130E of the Companies Act, 2013 — essentially, questions of law.

The NCLAT has the power to: (a) hear fresh evidence if the CCI refused to admit it; (b) review the merits of the CCI's factual findings; (c) reassess penalty calculations; (d) stay the CCI's order during the pendency of the appeal (including the penalty payment obligation).

**Why it matters.** Appellate review is the democratic check on regulatory power. The CCI — however expert and independent — is not infallible. It may misdefine the relevant market, apply the wrong legal test, ignore exculpatory evidence, or impose a disproportionate penalty. The NCLAT, staffed by High Court-level judges and technical members with domain expertise, provides a full merits review — not mere rubber-stamping. And the Supreme Court provides the final constitutional safeguard, ensuring that the Act is interpreted consistently with fundamental rights and the rule of law.

**The insight.** The shift from COMPAT to NCLAT was controversial. The COMPAT was a specialist tribunal with dedicated competition expertise; the NCLAT is a generalist tribunal that also handles company law, insolvency, and securities appeals. Critics argue that competition law is sufficiently complex and economically intensive that it requires specialist adjudicators. Defenders argue that consolidation reduces the proliferation of tribunals and ensures administrative efficiency. The practical impact has been mixed: some NCLAT benches have demonstrated deep engagement with competition economics, while others have been criticised for treating complex competition cases as routine administrative appeals.

**The walk-through.** In **CCI v. Steel Authority of India Limited (SAIL)** (2010), the Supreme Court examined the scope of the COMPAT's (now NCLAT's) appellate power. SAIL challenged the CCI's interim order directing it to modify certain exclusive supply arrangements. The Supreme Court held that: (a) the appellate tribunal can review both findings of fact and questions of law; (b) interim orders of the CCI are appealable; (c) the tribunal must apply the principles of natural justice in its own proceedings; and (d) the tribunal's review is *de novo* on questions of law, meaning it is not bound by the CCI's legal interpretations. This judgment established the NCLAT's role as a genuine appellate check, not a deferential review body.

**The thread.** Advocacy advises; the appellate mechanism reviews. The final section covers the miscellaneous provisions — the operational, transitional, and structural clauses that complete the Act's architecture and connect it to the broader legal system.`,
      questions: [
        {
          kind: "mcq",
          prompt: "To which body are appeals against the orders of the Competition Commission of India (CCI) currently filed?",
          options: [
            "The High Court of Delhi",
            "The Competition Appellate Tribunal (COMPAT)",
            "The National Company Law Appellate Tribunal (NCLAT)",
            "The Supreme Court of India directly"
          ],
          correct_index: 2,
          model_answer: "The Finance Act, 2017 dissolved COMPAT and transferred its appellate functions for competition cases to the NCLAT.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The NCLAT is a specialized tribunal that only hears competition law cases.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The NCLAT is a generalist tribunal that handles competition appeals as well as company law and insolvency cases.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "What did the Supreme Court establish regarding the NCLAT's review power in the SAIL (2010) case?",
          model_answer: "The Court established that the appellate tribunal conducts a full merits review — it can review both findings of fact and questions of law, and is not bound to deferentially rubber-stamp the CCI's legal interpretations.",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "Which of the following powers does the NCLAT possess when hearing an appeal from the CCI? Select all that apply.",
          options: [
            "Confirm, modify, or set aside the CCI's order",
            "Stay (pause) the CCI's order during the appeal process",
            "Hear fresh evidence if the CCI wrongly refused to admit it",
            "Sentence the CCI Chairperson to jail for passing a bad order"
          ],
          correct_indices: [0, 1, 2],
          model_answer: "The NCLAT has broad powers to review, stay, and modify orders, and admit evidence. It does not have punitive power over CCI officials for their decisions.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "If a company is fined by the CCI, its first appeal goes to the NCLAT (National Company Law Appellate Tribunal). If they lose there, their final option is the Supreme Court.",
      ],
    },
    {
      slug: "miscellaneous-provisions",
      title: "Miscellaneous & Operational Provisions",
      sectionNumber: "§54–66",
      importance: "Advanced",
      summary: "Extra-territorial jurisdiction, relationship with other laws, rule-making powers, and the transitional provisions from the old MRTP Act.",
      body: `**The provision.** The closing sections of the Act address several important operational matters:

**Section 54** — Power of the Central Government to **exempt** any class of enterprises from the provisions of the Act, in the interest of sovereignty, security of state, or public interest. This is the government's override valve — a safety mechanism for exceptional circumstances.

**Section 32** — **Extra-territorial jurisdiction**: the CCI may inquire into agreements or abuse of dominant position that take place outside India but have or are likely to have an AAEC in India. This provision gives the CCI the power to reach international cartels, cross-border mergers, and foreign firms that distort Indian markets from abroad.

**Section 60** — **Non-obstante clause**: the Act's provisions have effect notwithstanding anything inconsistent in any other law for the time being in force — establishing the primacy of competition law over potentially conflicting sectoral regulations.

**Section 62** — Application of other laws not barred: the Act does not prevent the operation of other laws, meaning that a contravention of the Competition Act may *also* be a contravention of, say, the Consumer Protection Act or the Companies Act, and both may apply.

**Section 64** — Power of the Central Government to **make rules** consistent with the Act.

**Section 66** — **Repeal of the MRTP Act**: the old Monopolies and Restrictive Trade Practices Act, 1969 was repealed, and the MRTP Commission was dissolved, with pending cases transferred to the CCI or the NCLAT.

**Why it matters.** Section 32 (extra-territorial jurisdiction) is perhaps the most consequential of these provisions. In a globalised economy, cartels routinely operate across borders — the international vitamins cartel, the lysine cartel, the auto-parts cartels all involved participants from multiple countries conspiring to fix prices that affected Indian consumers. Without extra-territorial jurisdiction, these cartels would be beyond India's reach. Section 32 ensures that the CCI can act against any conduct, wherever it originates, if it harms Indian competition.

**The insight.** The relationship between the Competition Act and sector-specific regulators (TRAI for telecom, SEBI for securities, RBI for banking) is one of the Act's most complex operational questions. Section 21 provides that a statutory authority may make a reference to the CCI, and Section 21A provides that the CCI may make a reference to a statutory authority — creating a dialogue mechanism. But the Act does not clearly resolve *which* body has primacy when both the CCI and a sectoral regulator have jurisdiction over the same conduct. Case law is still developing: in the **Airtel v. Reliance Jio** case (2017), the question was whether Jio's aggressive pricing was a matter for the CCI (predatory pricing under Section 4) or TRAI (tariff regulation under the TRAI Act). The CCI and TRAI took different approaches, and the jurisdictional overlap remains an open question.

**The walk-through.** The repeal of the MRTP Act (Section 66) is the Act's closing historical act. The MRTP Act, 1969 was born in an era of industrial licensing and state-directed economy. Its core concern was *preventing monopolies* — treating bigness itself as suspect. The Competition Act's core concern is *preventing anti-competitive conduct* — recognising that size is often the result of efficiency, innovation, and consumer preference. The repeal was not just a legal technicality; it was a philosophical statement: India's competition policy had grown up. From policing structure to policing behaviour, from suspecting success to protecting competition — the transition was complete.

**The thread.** That closes the story. You have walked through the entire Competition Act, 2002 — from the definitions that set the vocabulary, through the three substantive prohibitions (agreements, dominance, combinations), the institutional architecture (CCI, DG), the enforcement machinery (inquiry, investigation, orders), the penalty framework (fines, leniency, settlement), and finally the Act's broader mission of advocacy and systemic reform. The Act is not just a statute; it is a framework for thinking about how markets should work, how power should be constrained, and how competition — the engine of consumer welfare, innovation, and economic growth — should be protected. If you have read this far, you now understand it, start to finish, as one continuous story.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does Section 32 (Extra-territorial jurisdiction) allow the CCI to do?",
          options: [
            "Set up CCI branch offices in foreign countries.",
            "Inquire into anti-competitive conduct that takes place outside India if it has an Appreciable Adverse Effect on Competition (AAEC) in India.",
            "Extradite foreign CEOs to face trial in India.",
            "Apply Indian competition law to domestic markets of other countries."
          ],
          correct_index: 1,
          model_answer: "Section 32 allows the CCI to penalize foreign conduct (like an international cartel) if that conduct distorts competition within Indian markets.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The Competition Act of 2002 explicitly outlaws monopolies simply for being too big, following the exact same philosophy as the old MRTP Act.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The Competition Act penalizes anti-competitive *conduct* (abuse of dominance), recognizing that simply being big or a monopoly is not illegal if achieved through efficiency and innovation.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Why was the repeal of the MRTP Act and its replacement by the Competition Act considered a philosophical shift for India?",
          model_answer: "It shifted the focus from 'policing structure' (suspecting size and preventing monopolies just for being big) to 'policing behavior' (stopping actual anti-competitive conduct while protecting efficient, innovative businesses).",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "Under Section 54, who has the power to exempt a specific class of enterprises from the provisions of the Competition Act?",
          model_answer: "The Central Government (usually for sovereignty, security, or public interest reasons).",
          difficulty: "basic",
        }
      ],
      facts: [
        "Thanks to 'extra-territorial jurisdiction,' the CCI can punish international cartels operating entirely outside of India, so long as their price-fixing hurts Indian consumers.",
      ],
    },
  ],
};
