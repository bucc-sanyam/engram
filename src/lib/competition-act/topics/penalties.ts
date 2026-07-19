import type { CompActChapter } from "../types";

/** Chapter 9 — Penalties & Enforcement: consequences of violation. */
export const penalties: CompActChapter = {
  slug: "penalties",
  title: "Penalties & Enforcement",
  chapter: 9,
  tagline: "Fines, imprisonment, leniency, and settlement — the consequences that give the Act its teeth.",
  color: "#ef4444",
  prereqs: ["director-general"],
  unlocks: ["advocacy-miscellaneous"],
  intro: `A law without consequences is a suggestion. Chapter VI of the Competition Act (Sections 42–48C) ensures the Act is not a suggestion. It establishes a comprehensive penalty regime that addresses every dimension of enforcement: monetary penalties on enterprises, personal liability on individuals, leniency for cartelists who cooperate, settlement and commitment mechanisms for resolving cases efficiently, and criminal penalties for the most egregious violations.

The penalty architecture is designed around four objectives: (1) **punishment** — the offender must suffer a consequence proportionate to the harm; (2) **deterrence** — the penalty must be large enough that the expected cost of violation exceeds the expected gain; (3) **cooperation incentives** — the leniency programme rewards cartelists who break ranks and provide evidence, making cartels inherently unstable; and (4) **efficiency** — the settlement and commitment mechanisms allow less serious cases to be resolved without full-length proceedings, freeing CCI resources for the most harmful conduct.

The four sections ahead cover monetary penalties and their calculation, individual liability for company officers, the leniency programme for cooperating cartelists, and the settlement and commitment framework introduced by the 2023 amendment.`,
  sections: [
    {
      slug: "monetary-penalties",
      title: "Monetary Penalties",
      sectionNumber: "§42–43",
      importance: "Core",
      summary: "Penalties for non-compliance with CCI orders, failing to notify combinations, and providing false information — from ₹1 lakh/day to ₹1 crore.",
      body: `**The provision.** The Act provides for multiple categories of monetary penalties:

**Section 42** — Contravention of CCI orders: any person who fails to comply with any direction issued by the CCI or any condition or restriction imposed by the CCI shall be punishable with a fine of up to **₹1 lakh per day** of default, subject to a maximum of **₹10 crores**.

**Section 43** — Failure to comply with combination notification requirements: if a person or enterprise fails to give notice of a combination under Section 6, the CCI may impose a penalty of up to **1% of the total turnover or assets** of the combination, whichever is higher.

**Section 44** — Making false statements or omitting material facts in any information, document, or evidence submitted to the CCI: penalty of not less than **₹50 lakhs** and up to **₹1 crore**.

**Section 45** — Making false statements to the DG during investigation: penalty which may extend to **₹1 crore** and, for continuing contravention, up to **₹10 lakhs per day** of default.

These penalties are *in addition* to the substantive penalties under Section 27 (up to 10% of turnover for anti-competitive agreements and abuse of dominance).

**Why it matters.** The layered penalty structure ensures that enterprises cannot game the system. The substantive penalty (Section 27) punishes the anti-competitive conduct itself. The compliance penalties (Section 42) punish refusal to obey the CCI's corrective orders. The notification penalty (Section 43) punishes attempts to evade combination review. The false-information penalties (Sections 44–45) punish dishonesty during proceedings. Together, they close every escape route: you cannot ignore the CCI, you cannot evade its jurisdiction, and you cannot lie to it.

**The insight.** The daily-penalty mechanism under Section 42 is particularly effective against chronic non-compliance. A one-time fine, however large, can be budgeted for and absorbed. But a *daily* fine that accumulates — ₹1 lakh per day, every day, until compliance — creates a mounting financial pressure that makes continued defiance irrational. For a company ordered to cease exclusive dealing practices, every day of non-compliance adds ₹1 lakh to the bill. After 100 days, that is ₹1 crore — and the CCI can extend the cumulative penalty up to ₹10 crores.

**The walk-through.** In **MCX-SX v. NSE** (2011), the CCI found that the National Stock Exchange (NSE) had abused its dominant position by waiving transaction fees on its currency derivatives segment to drive the competing MCX Stock Exchange out of the market (predatory pricing). The CCI imposed a penalty of ₹55.5 crores on NSE. When NSE delayed compliance with the CCI's behavioural directions (to stop zero-fee pricing), the CCI warned that Section 42's daily penalty would apply. NSE complied. The case demonstrated that the daily-penalty lever is often more effective than the headline penalty — it creates urgency rather than allowing leisurely litigation strategy.

**The thread.** Monetary penalties hit the enterprise. But who within the enterprise bears personal responsibility? Section 48 extends liability to individuals — directors, managers, and officers — who were in charge when the violation occurred. Individual liability is the next section, and it is what makes competition law personally frightening rather than merely corporately inconvenient.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 42, what is the penalty for failing to comply with a corrective order issued by the CCI?",
          options: [
            "A flat fine of ₹1 lakh.",
            "Up to ₹1 lakh per day of default, subject to a maximum of ₹10 crores.",
            "Automatic cancellation of the company's registration.",
            "A maximum fine of ₹50 crores."
          ],
          correct_index: 1,
          model_answer: "The 'daily penalty' mechanism imposes up to ₹1 lakh per day to create mounting financial pressure against chronic non-compliance.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The only type of penalty the CCI can impose is a fine based on the turnover of the company for substantive competition violations (like cartels).",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The Act provides layered penalties: substantive fines (Sec 27), daily non-compliance fines (Sec 42), failure-to-notify fines (Sec 43), and false-information fines (Sec 44-45).",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "How does the 'daily penalty' mechanism under Section 42 prevent companies from simply treating CCI fines as a routine cost of doing business?",
          model_answer: "A massive one-time fine can be budgeted for and absorbed. But a fine that grows every single day (up to ₹1 lakh/day) creates unavoidable, compounding financial pressure that makes continued defiance economically irrational.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "What is the penalty under Section 43 for failing to notify the CCI about a combination (merger)?",
          model_answer: "Up to 1% of the total turnover or assets of the combination, whichever is higher.",
          difficulty: "basic",
        }
      ],
      facts: [
        "If a company ignores a CCI order, it doesn't just get a one-time fine. The CCI can charge a 'daily penalty' of ₹1 lakh every single day until the company complies.",
      ],
    },
    {
      slug: "individual-liability",
      title: "Individual Liability & Imprisonment",
      sectionNumber: "§48",
      importance: "Core",
      summary: "When directors, managers, and officers face personal penalties — and the threat of imprisonment — for their company's anti-competitive conduct.",
      body: `**The provision.** Section 48 provides that where a person committing a contravention of the Act is a company, every person who at the time of the contravention was in charge of, and was responsible to the company for, the conduct of its business shall be deemed to be guilty of the contravention and shall be liable to be proceeded against and punished accordingly.

The penalty for individuals: up to **10% of the average income** of the individual for the last three preceding financial years. If the individual fails to pay the penalty, imprisonment of up to **three years** or a fine of up to **₹25 crores**, or both.

The section provides a defence: a person is not liable if they prove that the contravention took place without their knowledge or that they exercised all due diligence to prevent the contravention.

**Why it matters.** Corporate penalties alone are insufficient deterrents. A company is an abstraction — it does not feel pain, shame, or fear. The humans who run the company do. When a CEO knows that *their personal income* is at risk — and that failure to pay the penalty can lead to *imprisonment* — the incentive structure changes dramatically. Individual liability transforms competition compliance from a corporate-governance checkbox into a personal survival imperative.

**The insight.** The "in charge of and responsible for" test is the critical gateway. Not every employee is liable — only those with sufficient seniority and decision-making authority to have prevented the contravention. In practice, this targets: the CEO/Managing Director, functional heads (VP Sales, VP Marketing) who directed the cartel or abuse, and in some cases, independent directors who were aware of the conduct and failed to prevent it. The "due diligence" defence protects individuals who genuinely did not know — a compliance officer who implemented an antitrust compliance programme, trained employees, and was actively misled by colluding employees has a viable defence. But ignorance born of wilful blindness — "I didn't ask, so I didn't know" — is not protected.

**The walk-through.** In the **Cement Cartel case** (2012), the CCI not only penalised the 11 cement companies but also directed that the individual officers responsible for the coordination — senior executives who attended the Cement Manufacturers' Association meetings where production and pricing were discussed — were liable under Section 48. Several Managing Directors and Senior Vice Presidents were personally penalised. The COMPAT (now NCLAT) upheld the principle of individual liability but recalibrated the penalty amounts. The case sent a clear message to India Inc.: cartel participation is not just a corporate risk — it is a personal one.

**The thread.** Penalties and individual liability punish. But what if a cartelist wants to *cooperate* — to break ranks, confess, and provide evidence against co-conspirators? The leniency programme, next, is the Act's carrot to complement its stick, and it is the single most effective tool for detecting cartels that would otherwise remain hidden.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 48, what is the maximum term of imprisonment an individual can face for failing to pay a penalty?",
          options: [
            "One year.",
            "Three years.",
            "Five years.",
            "Life imprisonment."
          ],
          correct_index: 1,
          model_answer: "Failure to pay personal penalties can result in imprisonment of up to three years or a massive fine (up to ₹25 crores), or both.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "Under Section 48, every single employee of a company is automatically held personally liable if the company engages in cartel behaviour.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Liability is restricted to those who were 'in charge of and responsible to the company for the conduct of its business' (e.g., CEOs, senior VPs).",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "What defence is available to an individual corporate officer under Section 48 to avoid personal liability?",
          model_answer: "The officer must prove that the contravention took place without their knowledge, or that they exercised all due diligence to prevent the contravention (e.g., implementing an active compliance program and being actively misled).",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "Which of the following consequences can apply to a senior executive personally held liable for their company's anti-competitive conduct? Select all that apply.",
          options: [
            "Penalty of up to 10% of their personal average income",
            "Imprisonment of up to 3 years if the penalty is unpaid",
            "Forced transfer to a different department within the company",
            "Confiscation of their private home by the CCI"
          ],
          correct_indices: [0, 1],
          model_answer: "The Act allows for personal income-based fines and imprisonment for non-payment. The CCI cannot mandate internal HR transfers or physically confiscate real estate.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "Antitrust law isn't just a corporate problem. If a company forms a cartel, its CEO and senior executives can be personally fined up to 10% of their own income — and jailed if they don't pay.",
      ],
    },
    {
      slug: "leniency-programme",
      title: "The Leniency Programme",
      sectionNumber: "§46",
      importance: "Core",
      summary: "Lesser penalties for cooperating cartelists — how the CCI incentivises insiders to betray their cartel and provide evidence.",
      body: `**The provision.** Section 46 empowers the CCI to impose a **lesser penalty** (including zero penalty) on any member of a cartel who has made a "full, true, and vital disclosure" of the cartel's activities and has cooperated with the CCI throughout the investigation. The CCI's Lesser Penalty Regulations (2009, amended 2017) establish the procedure:

(1) The first applicant to approach the CCI with vital evidence receives the highest reduction — up to **100% reduction** (complete immunity from penalty).
(2) The second applicant receives a reduction of up to **50%**.
(3) The third applicant receives up to **30%**.
(4) Subsequent applicants may receive reductions at the CCI's discretion.

The applicant must: (a) cease participation in the cartel immediately; (b) not destroy, conceal, or alter evidence; (c) provide complete and continuing cooperation; and (d) not have coerced other enterprises to participate in the cartel.

**Why it matters.** Cartels are secret agreements between competitors. Without an insider willing to talk, detecting a cartel requires either lucky evidence (a whistleblower, a dawn raid that finds a smoking gun) or sophisticated economic analysis (proving that parallel pricing cannot be explained by market forces — a high evidentiary bar). The leniency programme solves the detection problem by making cartels *inherently unstable*: every member knows that any other member might, at any moment, go to the CCI, confess, and receive immunity — leaving the remaining members to face the full penalty. This "prisoner's dilemma" dynamic means that the rational strategy for each cartelist is to race to the CCI before the others do.

**The insight.** The "first-in-the-door" race is the programme's genius and its cruelty. Only the first applicant gets full immunity; the second gets only 50%. This creates a fierce incentive to be first, which means that the moment any cartelist suspects that another member might defect, the entire cartel unravels. The leniency programme does not just detect existing cartels — it *prevents* new ones from forming, because potential co-conspirators know that any agreement they enter will be haunted by the possibility of first-mover defection.

**The walk-through.** In the **Car Parts Cartel** (auto components, multiple cases 2014–2017), the CCI received leniency applications from participants in international cartels that had rigged bids for automobile parts (bearings, ignition coils, spark plugs) supplied to Indian car manufacturers. The first applicants in each cartel received full immunity; subsequent applicants received reduced penalties. The evidence provided by the leniency applicants — internal emails, meeting minutes, pricing spreadsheets — was decisive: without it, the CCI would have struggled to prove the cartels' existence, as the conduct occurred largely outside India. The leniency programme turned co-conspirators into star witnesses.

**The thread.** Leniency addresses cartels specifically. But what about non-cartel cases — abuse of dominance or vertical agreements — where a full-length investigation and adjudication might not be worth the CCI's resources? The 2023 amendment introduced settlement and commitment mechanisms for exactly this purpose. That is the final section of this chapter.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does the Leniency Programme (Section 46) incentivize cartel members to come forward?",
          options: [
            "By offering a government job to the whistleblower.",
            "By offering the first applicant who provides vital evidence up to a 100% reduction in penalties.",
            "By guaranteeing that their company's stock price will go up.",
            "By exempting them from paying corporate taxes for a year."
          ],
          correct_index: 1,
          model_answer: "The first applicant to provide 'full, true, and vital disclosure' can receive up to complete immunity (100% penalty reduction), a massive incentive to defect.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "A cartel member who is the third to approach the CCI with evidence gets absolutely no reduction in their penalty.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The third applicant can still receive up to a 30% reduction, ensuring there is still some incentive to cooperate even if you aren't first.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Why is the 'first-in-the-door' race critical to the success of the leniency programme?",
          model_answer: "Because only the first applicant gets 100% immunity, it creates fierce paranoia among cartel members. Knowing anyone could defect at any time makes cartels inherently unstable and prevents new ones from forming.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "Can a company get leniency if it was the 'ringleader' that coerced other enterprises to join the cartel?",
          model_answer: "No, a strict condition for leniency is that the applicant must not have coerced others to participate.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "The CCI uses a 'prisoner's dilemma' to bust cartels: the first company to betray the cartel and confess to the government gets 100% immunity, while the rest face massive fines.",
      ],
    },
    {
      slug: "settlement-and-commitment",
      title: "Settlement & Commitment",
      sectionNumber: "§48A–48C",
      importance: "Advanced",
      summary: "The 2023 amendment's new tools — resolving cases through negotiated settlements and voluntary commitments, without a final finding of violation.",
      body: `**The provision.** The Competition (Amendment) Act, 2023 introduced two new mechanisms:

**Section 48B — Settlement**: An enterprise under investigation for abuse of dominance (Section 4) or vertical anti-competitive agreements (Section 3(4)) may apply to the CCI to settle the case by offering to pay a settlement amount and undertaking to modify or cease the impugned conduct. If the CCI accepts, the case is closed without a finding of contravention.

**Section 48C — Commitment**: An enterprise may, at any stage before the DG submits its investigation report, offer voluntary commitments to address the CCI's competition concerns. If the CCI accepts the commitments, it closes the case.

Key limitations: (a) Settlement and commitment are **not available for cartels** (Section 3(3) violations); (b) the CCI has discretion to accept or reject — there is no right to settle; (c) accepted settlements/commitments are binding and enforceable as CCI orders; (d) if the enterprise breaches the commitment, the CCI can reopen the investigation.

**Why it matters.** The CCI handles hundreds of cases; full-length proceedings for every case are neither practical nor necessary. Many cases involve conduct that, while potentially anti-competitive, can be remedied through voluntary changes in business practices — without the time, cost, and uncertainty of a multi-year investigation and adjudication. Settlement and commitment allow the CCI to secure behavioural changes quickly, freeing its limited resources for the most harmful cases (hard-core cartels, systemic abuse of dominance) that warrant full enforcement.

**The insight.** The exclusion of cartels from the settlement mechanism is deliberate and important. Cartels are the most harmful form of anti-competitive conduct, and the policy choice is that they must be fully investigated, adjudicated, and penalised — no shortcuts. Allowing cartelists to settle would undermine the deterrent effect: companies would collude, extract cartel profits, and then settle for a fraction of the penalty when caught. The exclusion preserves the leniency programme's role as the sole path to reduced penalties for cartels — and the leniency programme requires *full cooperation* and *vital evidence*, not just a financial payment.

**The walk-through.** While India's settlement/commitment framework is new (2023), the model is well-tested in Europe, where the European Commission has used commitment decisions under Article 9 of Regulation 1/2003 for two decades. The Google Shopping case in the EU (2017) was resolved partly through commitments — Google offered to display rival shopping comparison services alongside its own in search results. The EU accepted, avoiding a potentially longer proceeding. India's Section 48C is modelled on the same principle: give enterprises a path to resolve cases by addressing the competitive concern directly, rather than fighting a multi-year battle over whether the conduct technically constituted a "contravention."

**The thread.** The penalty chapter is complete: monetary penalties, individual liability, leniency for cartel whistleblowers, and settlement for non-cartel cases. The last chapter of this story steps back from enforcement to survey the Act's broader mission — competition advocacy, the appellate mechanism, and the miscellaneous provisions that complete the statutory architecture.`,
      questions: [
        {
          kind: "truefalse",
          prompt: "Under the 2023 amendment, a company accused of participating in a hard-core cartel can apply to settle the case and avoid a formal finding of contravention.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The settlement and commitment mechanisms are explicitly NOT available for cartels. Cartelists must use the leniency programme.",
          difficulty: "intermediate",
        },
        {
          kind: "mcq",
          prompt: "Why were the Settlement and Commitment mechanisms introduced in 2023?",
          options: [
            "To allow cartels to legally operate if they pay a fee.",
            "To allow the CCI to quickly resolve less serious cases through negotiated behavioral changes, freeing up resources for major cases.",
            "To replace the leniency programme completely.",
            "To allow companies to bribe CCI officials legally."
          ],
          correct_index: 1,
          model_answer: "They provide a fast-track way to resolve cases involving abuse of dominance or vertical agreements by securing behavioral changes without years of litigation.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "What is the procedural difference between the 'Settlement' mechanism (Section 48B) and the 'Commitment' mechanism (Section 48C)?",
          model_answer: "Timing. A 'Commitment' is offered *before* the DG submits its investigation report (early stage). A 'Settlement' is offered *after* the DG submits its report but before the CCI passes a final order (late stage, usually involves a financial payment).",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "Which of the following statements about Settlement and Commitment are true? Select all that apply.",
          options: [
            "They are not available for cartels.",
            "The CCI is legally forced to accept any settlement offer a company makes.",
            "Accepted settlements are binding and enforceable.",
            "An enterprise can use these mechanisms in an abuse of dominance case."
          ],
          correct_indices: [0, 2, 3],
          model_answer: "They apply to dominance/vertical agreements, they are binding, but they exclude cartels. The CCI has discretion and is never forced to accept an offer.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "Since 2023, companies accused of abusing their dominance can offer a 'settlement' — agreeing to change their behavior and pay a fee to close the case without a formal guilty verdict.",
      ],
    },
  ],
};
