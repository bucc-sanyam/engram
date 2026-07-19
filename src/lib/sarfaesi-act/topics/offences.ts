import type { SarfaesiChapter } from "../types";

export const offences: SarfaesiChapter = {
  slug: "offences",
  title: "Offences and Penalties",
  chapter: 5,
  tagline: "The financial and criminal consequences of breaking the rules.",
  color: "#f87171",
  prereqs: ["central-registry"],
  unlocks: ["miscellaneous"],
  intro: `A law that grants extraordinary powers without severe consequences for abusing those powers is dangerous. The SARFAESI Act arms banks and Asset Reconstruction Companies with the ability to bypass the judicial system. To balance this, Chapter V establishes severe penalties for non-compliance.

This chapter covers two main areas:
1.  **Failing to use the Central Registry.** Because CERSAI is critical for preventing fraud, failing to register a transaction is met with compounding daily fines.
2.  **Disobeying the Regulator.** The RBI's directions to ARCs are not suggestions. Disobeying them can result in massive, multi-crore fines, adjudicated rapidly by the RBI itself.

This chapter ensures that the hunters (banks and ARCs) are kept strictly in line by the game wardens (the Central Registrar and the RBI).`,
  sections: [
    {
      slug: "penalties-and-offences",
      title: "Penalties and General Offences",
      sectionNumber: "§27-29",
      importance: "Core",
      summary: "Daily fines for failing to file transactions with CERSAI and criminal liability for general contravention.",
      body: `**The provision.** 
*   **Section 27: Penalties.** If a default is made in filing the particulars of transactions, modifications, or intimations of satisfaction with the Central Registry (as required under Chapter IV), every company, every officer of the company, the secured creditor, and every officer of the secured creditor who is in default is punishable with a fine which may extend to five thousand rupees for *every day* during which the default continues.
*   **Section 28:** (Repealed/Omitted in later amendments, originally dealt with certain other penalties).
*   **Section 29: Offences.** A catch-all provision. If any person contravenes, attempts to contravene, or abets the contravention of the provisions of this Act (where no specific penalty is provided), they shall be punishable with imprisonment for a term which may extend to one year, or with fine, or with both.

**Why it matters.** The daily fine under Section 27 is a ticking clock. If a bank forgets to file a modification of a mortgage for two years, the fine doesn't just sit there; it compounds daily up to ₹5,000 per day (which would be over ₹36 lakhs). This forces banks to treat registry filings as a critical daily operational task, not an afterthought. 

**The insight.** Notice that Section 27 specifically targets "every officer... who is in default." The law pierces the corporate veil. A lazy bank manager cannot hide behind the massive corporate structure of SBI or HDFC. If it was their job to file the paperwork with CERSAI and they failed, they are personally liable for the fine.

**The walk-through.** A borrower pays off their ₹1 crore home loan to a bank branch on January 1st. Section 25 requires the bank to file a "satisfaction" with CERSAI within 30 days (by January 31st). The branch manager simply forgets. On May 1st (90 days late), the borrower complains because they can't sell the house. The Central Registrar discovers the default. The bank (and the specific branch manager) can be fined ₹5,000 for each of the 90 days of default, totaling a ₹4.5 lakh fine just for forgetting to file a piece of digital paperwork.

**The thread.** While Section 27 deals with CERSAI filings, what happens when an ARC disobeys a direct order from the Reserve Bank of India regarding their core business practices? The RBI doesn't rely on general offences; it uses the specific, brutal adjudication powers of Section 30A.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 27, what is the maximum penalty for a bank officer who fails to file a transaction with the Central Registry?",
          options: [
            "A flat fine of one lakh rupees.",
            "Imprisonment for up to three years.",
            "A fine of up to five thousand rupees for every day the default continues.",
            "Immediate termination of their banking license."
          ],
          correct_index: 2,
          model_answer: "A fine of up to five thousand rupees for *every day* during which the default continues. The compounding nature of the fine forces compliance.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Explain how Section 27 of the SARFAESI Act ensures accountability at an individual level, rather than just punishing the corporation.",
          model_answer: "Section 27 explicitly states that the fine applies not only to the company/secured creditor but also to 'every officer... who is in default'. By piercing the corporate veil, it prevents individual bank managers or employees from hiding behind their employer's massive corporate structure. If they fail in their duty to file with CERSAI, they face personal liability.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "If a person contravenes a provision of the SARFAESI Act for which no specific penalty is provided, they cannot be punished.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 29 acts as a catch-all provision. It states that general contravention of the Act can be punished with imprisonment up to one year, or a fine, or both.",
          difficulty: "basic",
        },
        {
          kind: "quickfire",
          prompt: "True or False: The daily fine for not filing with CERSAI stops accumulating after 30 days.",
          model_answer: "False. The fine under Section 27 can extend up to ₹5,000 for *every day* during which the default continues, with no stated cap.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "Failing to update the Central Registry (CERSAI) can result in a fine of ₹5,000 for every single day the delay continues.",
        "Individual bank officers can be held personally liable and fined for failing to file paperwork with CERSAI."
      ],
    },
    {
      slug: "adjudication-and-recovery",
      title: "Adjudication and Recovery of Penalties",
      sectionNumber: "§30A-30D",
      importance: "Core",
      summary: "How the RBI imposes massive fines on non-compliant ARCs, how appeals work, and how the RBI aggressively recovers the money.",
      body: `**The provision.** 
*   **Section 30A:** If any ARC or person fails to comply with any direction issued by the Reserve Bank under this Act, the RBI's adjudicating authority may impose a penalty not exceeding **one crore rupees** or twice the amount involved in the failure (whichever is more). If the failure continues, a further penalty of up to **one lakh rupees for every day** may be imposed. 
*   **Section 30B & 30C:** An aggrieved party can prefer an appeal against the adjudicating authority's order to the Appellate Authority designated by the Central Board of the RBI within 30 days.
*   **Section 30D:** This is the recovery mechanism. If a penalty is not paid, it becomes a "recoverable sum". The RBI can recover it by debiting the current account of the ARC in default. Even more aggressively, the RBI can issue notices to *third parties* who owe money to the ARC, ordering them to pay the RBI directly.

**Why it matters.** The penalties in Section 30A are staggering—up to one crore rupees, plus one lakh per day. This reflects the immense systemic risk ARCs pose. If an ARC ignores an RBI directive regarding capital adequacy or accounting standards, it threatens the broader financial system.

**The insight.** Section 30D utilizes the same "garnishee" power that banks use against borrowers in Chapter III. If an ARC refuses to pay a ₹1 crore fine, the RBI doesn't need to file a lawsuit to collect. The RBI can simply look at the ARC's books, find a bank that owes the ARC money, and legally intercept that payment to settle the fine. The regulator holds the ultimate trump card over cash flow.

**The walk-through.** The RBI issues a binding policy direction requiring all ARCs to provision more capital for high-risk assets. 'Alpha ARC' ignores the directive to artificially boost its reported profits by ₹50 lakhs. The RBI investigates and discovers the violation. Under Section 30A, the adjudicating authority imposes a fine of ₹1 crore (since ₹1 crore is higher than twice the amount involved, which would be ₹1 crore). Alpha ARC appeals under Section 30B but loses. They refuse to pay. The RBI uses Section 30D to directly debit ₹1 crore from Alpha ARC's current account held with a commercial bank.

**The thread.** The powers of the banks and the regulators are absolute, provided they operate within the confines of the Act. But does the Act apply to every single debt in India? No. Chapter VI outlines the critical exemptions and establishes the final legal supremacy of SARFAESI over other laws.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 30A, what is the base maximum penalty the RBI can impose on an ARC for failing to comply with its directions?",
          options: [
            "Ten lakh rupees.",
            "Fifty lakh rupees.",
            "One crore rupees or twice the amount involved (whichever is more).",
            "Ten crore rupees."
          ],
          correct_index: 2,
          model_answer: "One crore rupees or twice the amount involved (whichever is more), plus up to one lakh per day for continuing failures.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Explain the aggressive 'garnishee' recovery mechanism the RBI can use under Section 30D if an ARC refuses to pay its penalty.",
          model_answer: "Under Section 30D, if an ARC refuses to pay a penalty, the RBI does not need to file a civil suit for recovery. The RBI can directly debit the ARC's current account. Furthermore, it can issue notices to third parties who owe money to the defaulting ARC, legally forcing those third parties to pay the RBI directly instead, thereby intercepting the ARC's cash flow.",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "If an ARC is penalized by the RBI's adjudicating authority under Section 30A, what are the steps for appeal and recovery? Select all that apply.",
          options: [
            "The ARC can appeal to the Supreme Court immediately.",
            "The ARC can appeal to the Appellate Authority designated by the RBI within 30 days.",
            "If the penalty is unpaid, the RBI can directly debit the ARC's current account.",
            "The RBI must obtain a warrant from a District Magistrate to recover the penalty."
          ],
          correct_indices: [1, 2],
          model_answer: "The ARC appeals to the RBI's designated Appellate Authority within 30 days (Section 30B/30C). For recovery, the RBI can directly debit accounts or intercept third-party payments (Section 30D) without needing a magistrate's warrant.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "Under Section 30A, if a failure to comply with RBI directions continues, what is the maximum *daily* penalty that can be added on top of the base fine?",
          model_answer: "Up to one lakh rupees for every day the failure continues.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "The RBI can fine an Asset Reconstruction Company up to ₹1 Crore (or twice the amount involved) for disobeying its directives.",
        "If a penalized entity refuses to pay a fine, the RBI can legally intercept payments owed to that entity by third parties."
      ],
    }
  ],
};
