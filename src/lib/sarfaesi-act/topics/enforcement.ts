import type { SarfaesiChapter } from "../types";

export const enforcement: SarfaesiChapter = {
  slug: "enforcement",
  title: "Enforcement of Security Interest",
  chapter: 3,
  tagline: "The heart of the Act: Taking possession, the 60-day notice, and appealing to DRTs.",
  color: "#43d6b5",
  prereqs: ["regulation"],
  unlocks: ["central-registry"],
  intro: `Chapter III contains the most powerful and heavily litigated provisions of the SARFAESI Act. If you only read one chapter of this Act, make it this one. 

This is where the legislative intent becomes raw power. It empowers secured creditors (banks and ARCs) to enforce their security interests without ever stepping foot inside a civil court or tribunal. It details the precise chronological sequence a bank must follow: from classifying the account as an NPA, to issuing the mandatory 60-day demand notice, to physically taking possession of the collateral. 

It also recognizes that such immense power can be abused. Therefore, it outlines the exact mechanism for how an aggrieved borrower can fight back by appealing to the Debts Recovery Tribunal (DRT). This chapter is a high-stakes balancing act between the urgent need for banks to recover public money and the fundamental rights of property owners.`,
  sections: [
    {
      slug: "enforcement-without-court",
      title: "Enforcement Without Court Intervention",
      sectionNumber: "§13(1)-(3A)",
      importance: "Core",
      summary: "The revolutionary power to bypass courts, the 60-day demand notice, and the borrower's right to representation.",
      body: `**The provision.** 
*   **Section 13(1)** contains the most important sentence in the Act: *"Any security interest created in favour of any secured creditor may be enforced, without the intervention of the court or tribunal."*
*   **Section 13(2)** lays down the prerequisite: The borrower must have defaulted, and their account must be classified as a Non-Performing Asset (NPA). Only then can the creditor issue a written notice demanding the borrower discharge their full liability within **60 days**.
*   **Section 13(3)** states the notice must clearly detail the amount payable and the specific secured assets intended to be enforced.
*   **Section 13(3A)** provides a small window for the borrower: If the borrower replies to the 60-day notice with a representation or objection, the bank *must* consider it. If the bank rejects it, they must communicate the reasons within 15 days. 

**Why it matters.** Section 13(1) is the entire reason the SARFAESI Act exists. By explicitly ousting the civil courts, it cuts recovery time from decades to months. The 60-day notice under 13(2) is the starting gun for the entire enforcement process. 

**The insight.** Notice Section 13(3A). It was inserted via a later amendment after the Supreme Court (in the landmark *Mardia Chemicals* case) ruled that borrowers needed at least a minimal opportunity to be heard before losing their property. However, the Act clearly states that the bank's rejection of this representation does *not* give the borrower the right to immediately appeal to the DRT. They must wait until the bank actually takes action.

**The walk-through.** A borrower defaults on a ₹5 crore factory loan. The bank classifies it as an NPA. The bank sends a Section 13(2) notice giving the borrower 60 days to pay ₹5 crores, specifically listing the factory as the target asset. On day 20, the borrower writes back claiming the interest calculation is wrong (13(3A)). The bank reviews it, finds it incorrect, and sends a rejection letter within 15 days. The 60-day clock keeps ticking. 

**The thread.** The 60 days have now expired. The borrower hasn't paid. What exactly can the bank do on day 61? Section 13(4) provides the terrifying answer.`,
      questions: [
        {
          kind: "open",
          prompt: "Explain the significance of Section 13(1) of the SARFAESI Act in the context of India's banking history.",
          model_answer: "Section 13(1) explicitly allows secured creditors to enforce security interests without the intervention of a court or tribunal. This revolutionized Indian banking because historically, banks had to file civil suits and obtain decrees to seize collateral—a process that took decades. This single provision bypassed the slow legal system, empowering rapid recovery of bad loans.",
          difficulty: "intermediate",
        },
        {
          kind: "mcq",
          prompt: "Under Section 13(2), what is the mandatory time period a bank must give a borrower to discharge their liabilities after issuing the demand notice?",
          options: [
            "15 days",
            "30 days",
            "45 days",
            "60 days"
          ],
          correct_index: 3,
          model_answer: "60 days. The Section 13(2) notice is the critical starting point of SARFAESI enforcement and mandates a 60-day repayment window.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "If a borrower raises an objection to the 60-day notice under Section 13(3A) and the bank rejects it, the borrower can immediately file an appeal in the DRT to stop the clock.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The Act explicitly states that the bank's rejection of a representation under 13(3A) does not confer the right to file an immediate appeal to the DRT. The borrower must wait until the bank actually takes a measure under Section 13(4).",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "What must be included in a valid 60-day demand notice under Section 13(3)? Select all that apply.",
          options: [
            "Details of the amount payable by the borrower.",
            "A police warrant for the borrower's arrest.",
            "Details of the secured assets intended to be enforced.",
            "Approval from a local civil court judge."
          ],
          correct_indices: [0, 2],
          model_answer: "The notice must detail the amount payable and the specific secured assets targeted. Police warrants and civil court approvals are not part of the SARFAESI process.",
          difficulty: "basic",
        }
      ],
      facts: [
        "The Section 13(2) notice gives the borrower exactly 60 days to repay the entire debt before the bank can seize the collateral.",
        "Banks must reply to a borrower's objections to a demand notice within 15 days."
      ],
    },
    {
      slug: "measures-to-recover",
      title: "Measures to Recover Secured Debts",
      sectionNumber: "§13(4)-(13)",
      importance: "Core",
      summary: "The devastating actions a bank can take on Day 61: Taking physical possession, taking over management, and recovering money from third parties.",
      body: `**The provision.** Section 13(4) triggers if the borrower fails to pay in full within the 60 days. The secured creditor may take recourse to one or more of the following measures:

*   **(a) Take Possession:** Take possession of the secured assets, including the right to transfer them by way of lease, assignment, or sale.
*   **(b) Take over Management:** Take over the management of the business of the borrower (only applicable if a substantial part of the business is held as security).
*   **(c) Appoint a Manager:** Appoint any person to manage the secured assets the bank has taken over.
*   **(d) Notice to Third Parties:** Require any person who has acquired secured assets from the borrower, or who owes money to the borrower, to pay the secured creditor directly instead.

**Section 13(8)** provides a final lifeline: If the borrower tenders the full amount of dues, together with all costs and expenses, *at any time before the publication of the notice for public auction/sale*, the secured assets shall not be transferred or sold by the bank.

**Why it matters.** This is the sharp end of the spear. Section 13(4)(a) is the mechanism used tens of thousands of times a year in India to physically seize defaulted homes, factories, and vehicles. It strips the borrower of their property rights immediately upon default and failure to heed the notice.

**The insight.** Clause (d) is a fascinating "garnishee" power. If a defaulting builder owes a bank money, and a tenant owes that builder rent, the bank can serve a notice to the tenant demanding they pay their rent directly to the bank instead of the builder. The bank intercepts the borrower's cash flow without touching the physical property.

**The walk-through.** Day 61 arrives. The borrower hasn't paid. The bank officers (often accompanied by security) arrive at the mortgaged factory, ask the employees to leave, lock the gates, and put up a large banner stating the property is now in the possession of the bank (Section 13(4)(a)). The bank then schedules a public auction. A week before the auction, the borrower somehow arranges the funds and pays the entire principal, interest, and auction fees (Section 13(8)). The bank must accept it and return the factory; the sale cannot proceed.

**The thread.** Sometimes, taking possession isn't as peaceful as changing the locks. What happens if the borrower refuses to leave the property or threatens violence? The bank doesn't fight them in the street; it calls upon the state, utilizing Section 14.`,
      questions: [
        {
          kind: "open",
          prompt: "Describe the 'garnishee' power granted to a bank under Section 13(4)(d) and give a practical example.",
          model_answer: "Section 13(4)(d) allows a bank to require any third party who owes money to the defaulting borrower (or who acquired secured assets from them) to pay the bank directly instead. For example, if a defaulting landlord owes the bank, the bank can legally order the landlord's tenants to pay their monthly rent directly to the bank to clear the loan, intercepting the borrower's cash flow.",
          difficulty: "intermediate",
        },
        {
          kind: "mcq",
          prompt: "Under Section 13(8), what is the absolute latest point in time a borrower can pay their full dues to stop the bank from selling their seized property?",
          options: [
            "Before the 60-day notice expires.",
            "Before the bank physically takes possession of the property.",
            "Before the publication of the notice for public auction or sale.",
            "Before the buyer registers the property deed."
          ],
          correct_index: 2,
          model_answer: "Before the publication of the notice for public auction or sale. Once the auction notice is published, the borrower loses their final statutory right to redeem the property under SARFAESI.",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "Which of the following actions can a bank legally take under Section 13(4) after the 60-day notice period expires without payment? Select all that apply.",
          options: [
            "Take physical possession of the mortgaged property.",
            "Sell the mortgaged property by public auction.",
            "Take over the management of the borrower's business.",
            "Freeze the borrower's personal, un-mortgaged bank accounts at other institutions."
          ],
          correct_indices: [0, 1, 2],
          model_answer: "The bank can take possession, sell the asset, and take over management. It cannot freeze un-mortgaged, unrelated personal bank accounts under Section 13(4), as SARFAESI only applies to 'secured assets'.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "True or False: Under Section 13(4)(b), a bank can take over the management of a borrower's business even if only a tiny fraction of the business assets are mortgaged to the bank.",
          model_answer: "False. Taking over management is only permissible if a 'substantial part' of the business is held as security.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "A borrower's absolute last chance to save their property is to pay the full dues before the bank publishes the notice for public auction.",
        "Under Section 13(4), a bank can legally force a borrower's debtors to pay the bank directly instead of paying the borrower."
      ],
    },
    {
      slug: "magistrate-assistance",
      title: "Assistance by Magistrates",
      sectionNumber: "§14",
      importance: "Core",
      summary: "Seeking the Chief Metropolitan Magistrate or District Magistrate's police power to take physical possession of hostile property.",
      body: `**The provision.** Section 14 provides the muscle for Section 13(4). Where possession of secured assets is required to be taken, and the secured creditor anticipates resistance, they may request in writing the Chief Metropolitan Magistrate (CMM) or District Magistrate (DM) within whose jurisdiction the asset is situated to assist them.

Upon receiving this written request, the CMM or DM *shall* take possession of the asset and documents relating thereto, and forward them to the secured creditor. The Magistrate has the power to use or cause to be used such force as may, in their opinion, be necessary.

To prevent banks from misleading the Magistrate, the application must be accompanied by a highly detailed affidavit affirming:
1. The aggregate amount due.
2. The creation of the security interest.
3. The borrower's default.
4. The NPA classification.
5. That the 60-day notice was served and the period expired.

**Why it matters.** Bank officers are not police officers. They cannot legally break down doors or physically remove hostile occupants from a property. Section 14 bridges this gap by mandating local executive magistrates to use state police power to enforce the bank's SARFAESI rights. 

**The insight.** The phrasing in the statute is that the Magistrate *"shall"* take possession. This is a mandatory administrative duty, not a judicial one. The Magistrate is not supposed to hold a mini-trial, listen to the borrower's sob story, or adjudicate the exact loan amount. Their only job is to verify the bank's affidavit is complete and then provide police protection to take the physical property.

**The walk-through.** A bank needs to seize a residential house, but the borrower has locked the gates and threatened violence. The bank files an application with a sworn affidavit to the local DM (Section 14). The DM reviews the affidavit to ensure all 9 statutory checkboxes are ticked. The DM then issues an order to the local police station. A police inspector arrives at the house, breaks the lock (using necessary force), evicts the occupants, and hands the physical keys to the bank officer.

**The thread.** The bank now has the property and is preparing to sell it. The borrower has just been evicted. If the bank broke the rules (e.g., they didn't wait 60 days, or they seized the wrong property), where does the borrower go for justice? They cannot go to a civil court. They must appeal under Section 17.`,
      questions: [
        {
          kind: "open",
          prompt: "Explain the role of the Chief Metropolitan Magistrate (CMM) or District Magistrate (DM) under Section 14. Is their role judicial or administrative?",
          model_answer: "The role of the CMM/DM under Section 14 is purely administrative, not judicial. They are not meant to hold a trial or adjudicate disputes regarding the loan. Their duty is strictly to verify that the bank has submitted the required sworn affidavit confirming the default and notice period, and then to use state police power (including necessary force) to take physical possession of the property and hand it to the bank.",
          difficulty: "intermediate",
        },
        {
          kind: "multi",
          prompt: "Which of the following must a bank affirm in its sworn affidavit when applying for Magistrate assistance under Section 14? Select all that apply.",
          options: [
            "The borrower's account has been classified as an NPA.",
            "The 60-day notice under Section 13(2) was properly served.",
            "The borrower has committed a criminal offense.",
            "The creation of a valid security interest (mortgage)."
          ],
          correct_indices: [0, 1, 3],
          model_answer: "The affidavit must confirm the NPA classification, the service of the 60-day notice, and the valid creation of the security interest. The borrower does not need to have committed a criminal offense; defaulting on a loan is a civil matter.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "If a DM believes the bank is being too harsh on the borrower, they have the judicial discretion to refuse the bank's Section 14 application.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The language of Section 14 says the DM 'shall' take possession. It is a mandatory administrative duty. Provided the bank's affidavit is complete and legally compliant, the DM cannot exercise judicial discretion to refuse assistance out of sympathy.",
          difficulty: "advanced",
        }
      ],
      facts: [
        "Under Section 14, magistrates are legally empowered to use necessary force (police action) to evict defaulting borrowers and seize properties for banks.",
        "A District Magistrate cannot hold a trial or adjudicate the loan amount under Section 14; their role is strictly to provide administrative/police assistance."
      ],
    },
    {
      slug: "appeal-to-drt",
      title: "Appeals to Debts Recovery Tribunal",
      sectionNumber: "§17-18",
      importance: "Core",
      summary: "The borrower's only legal remedy: appealing to the DRT within 45 days, and the steep cost of further appeals.",
      body: `**The provision.** 
*   **Section 17:** Any person (including the borrower) aggrieved by any of the measures referred to in Section 13(4) taken by the secured creditor may make an application to the Debts Recovery Tribunal (DRT) within **45 days** from the date such measure was taken. If the DRT concludes that the bank's actions were not in accordance with the Act, it can declare the seizure invalid and order the property restored to the borrower.
*   **Section 18:** Any person aggrieved by the order of the DRT under Section 17 can appeal to the Appellate Tribunal (DRAT) within 30 days. However, **no appeal shall be entertained unless the borrower deposits 50% of the amount of debt due** with the DRAT. (The DRAT has the discretion to reduce this deposit, but not below 25%).

**Why it matters.** Because SARFAESI explicitly bars civil courts from interfering (as we will see in Chapter VI), the DRT is the *only* place a borrower can seek justice if a bank acts illegally. Section 17 is the sole safety valve preventing unchecked banking tyranny.

**The insight.** The 50% pre-deposit rule in Section 18 is brutally effective. It prevents frivolous, endless appeals designed solely to stall the sale of the property. If you want a second bite at the apple in the Appellate Tribunal, you must put hard cash on the table. If you don't have at least 25% to 50% of the loan amount in cash, your legal road ends at the DRT.

**The walk-through.** A bank issues a 60-day notice, but seizes the property on day 40. This violates Section 13(2). The borrower files an application before the DRT under Section 17 (within the 45-day window). The DRT reviews the dates, rules the seizure illegal, and orders the bank to hand the keys back. The bank appeals to the DRAT. (Note: The bank doesn't have to pay the 50% pre-deposit; that rule applies only to the *borrower*). If the borrower had lost at the DRT and wanted to appeal, they would have had to deposit 50% of the debt with the DRAT to even be heard.

**The thread.** The bank has seized the asset and fended off the borrower's DRT appeal. But wait—what if another bank claims they also have a mortgage on the exact same property? How do we know who has priority? Chapter IV solves this with the Central Registry.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 17, how many days does a borrower have to file an application before the DRT after a bank takes possession of their property?",
          options: [
            "30 days",
            "45 days",
            "60 days",
            "90 days"
          ],
          correct_index: 1,
          model_answer: "45 days. The borrower must appeal to the DRT within 45 days from the date the measure under Section 13(4) was taken.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Explain the 'pre-deposit' rule under Section 18 for appealing to the DRAT. What is its purpose, and what are the percentage limits?",
          model_answer: "Under Section 18, a borrower appealing a DRT order to the Appellate Tribunal (DRAT) must deposit 50% of the debt due. The DRAT has the discretion to reduce this, but it cannot be reduced below 25%. The purpose of this harsh rule is to prevent frivolous, bad-faith appeals designed solely to stall the bank's recovery process by forcing the borrower to put hard cash on the line to proceed.",
          difficulty: "intermediate",
        },
        {
          kind: "multi",
          prompt: "If a DRT finds under Section 17 that a bank illegally seized a property (e.g., without waiting the full 60 days), what remedies can the DRT provide? Select all that apply.",
          options: [
            "Declare the bank's recourse to Section 13(4) invalid.",
            "Order the property to be restored (returned) to the borrower.",
            "Order the bank's branch manager to serve 6 months in prison.",
            "Cancel the borrower's entire debt so they owe nothing."
          ],
          correct_indices: [0, 1],
          model_answer: "The DRT can declare the seizure invalid and order the restoration of possession to the borrower. It does not have criminal jurisdiction to imprison managers, nor does it cancel the underlying debt (the borrower still owes the money, the bank just has to restart the seizure process legally).",
          difficulty: "advanced",
        },
        {
          kind: "truefalse",
          prompt: "If a bank loses at the DRT and wishes to appeal to the DRAT, the bank must also deposit 50% of the debt amount.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The 50% pre-deposit rule under Section 18 specifically applies to the borrower, not the secured creditor.",
          difficulty: "advanced",
        }
      ],
      facts: [
        "A borrower cannot approach a normal civil court to stop a SARFAESI seizure; they must appeal specifically to the Debts Recovery Tribunal (DRT) within 45 days.",
        "Appealing a DRT decision to the Appellate Tribunal (DRAT) requires the borrower to deposit at least 25% to 50% of their total debt upfront."
      ],
    }
  ],
};
