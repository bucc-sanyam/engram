import type { SarfaesiChapter } from "../types";

export const miscellaneous: SarfaesiChapter = {
  slug: "miscellaneous",
  title: "Miscellaneous (Exemptions & Overriding Effect)",
  chapter: 6,
  tagline: "Agricultural land exemptions, protecting the civil court ban, and the final word.",
  color: "#9aa0aa",
  prereqs: ["offences"],
  unlocks: [],
  intro: `Every powerful law has a boundary line. Chapter VI of the SARFAESI Act draws that line. 

While Chapter III gave banks the devastating power to seize property, Section 31 in Chapter VI explicitly lists the types of property and debts that are immune to this power. The most famous and fiercely debated of these exemptions is agricultural land.

Furthermore, a law that bypasses civil courts only works if civil courts are legally barred from intervening. Sections 34 and 35 build an impenetrable legal wall around the SARFAESI process, ensuring that clever lawyers cannot derail a bank's recovery by filing injunctions in local courts. This final chapter cements the SARFAESI Act as a supreme, specialized, and self-contained legal ecosystem for debt recovery in India.`,
  sections: [
    {
      slug: "exemptions-under-sarfaesi",
      title: "Exemptions (Section 31)",
      sectionNumber: "§31",
      importance: "Core",
      summary: "The assets that are immune to SARFAESI seizure, notably agricultural land and tiny debts.",
      body: `**The provision.** Section 31 lists the specific situations where the provisions of the SARFAESI Act *shall not apply*. The most critical exemptions are:
*   **(e) Conditional sale or hire-purchase:** Any conditional sale, hire-purchase, or lease where no security interest has been created.
*   **(g) Certain properties:** Any properties not liable to attachment (seizure) under Section 60 of the Code of Civil Procedure (e.g., necessary wearing apparel, tools of artisans, cooking vessels).
*   **(i) Agricultural land:** Any security interest created in agricultural land.
*   **(j) Small debts:** Any case in which the amount due is less than twenty per cent of the principal amount and interest thereon. (In other words, if the borrower has paid off 81% of the loan, the bank cannot use SARFAESI to seize the collateral for the remaining 19%).

**Why it matters.** The exemption for agricultural land (Section 31(i)) is deeply rooted in Indian socio-economic policy. A massive portion of India's population relies on farming for survival. Allowing a bank to summarily seize and sell a farmer's only source of livelihood without a court hearing was deemed too politically and socially destructive.

**The insight.** The agricultural exemption is heavily litigated. Borrowers often try to claim that large tracts of barren land or land zoned for commercial use are "agricultural" simply because they planted a few trees on it before the bank arrived. Courts look at the *actual usage* and zoning laws, not just the claims on paper, to determine if the exemption applies. 

**The walk-through.** A borrower takes two loans from a bank. Loan A is ₹10 crores secured by a commercial factory. Loan B is ₹50 lakhs secured by 10 acres of active agricultural farmland. The borrower defaults on both. The bank can issue a 60-day notice and seize the factory under SARFAESI. However, because of Section 31(i), the bank cannot touch the 10 acres of farmland using SARFAESI. To recover Loan B, the bank must file a regular civil suit or go through a standard debt recovery tribunal process.

**The thread.** While the bank cannot touch agricultural land, what happens if the borrower tries to stall the seizure of the commercial factory by filing a lawsuit in a local civil court? Section 34 slams that door shut.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 31(i), which of the following types of collateral is completely exempt from being seized under the SARFAESI Act?",
          options: [
            "A residential apartment.",
            "A commercial shopping mall.",
            "Agricultural land.",
            "A fleet of transport trucks."
          ],
          correct_index: 2,
          model_answer: "Agricultural land. This exemption is rooted in socio-economic policy to protect the livelihood of farmers from summary seizure by banks.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Explain the '20% rule' exemption found in Section 31(j) of the SARFAESI Act. Why is it fair to the borrower?",
          model_answer: "Under Section 31(j), if the outstanding amount due is less than 20% of the principal and interest (meaning the borrower has successfully paid off over 80% of the loan), the bank cannot use SARFAESI to seize the collateral. This prevents banks from using extreme, extra-judicial measures to seize a highly valuable asset over a relatively minor remaining debt, forcing them to use standard recovery methods instead.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "If a borrower plants a vegetable garden on a commercial plot of land in a city center, it automatically qualifies for the agricultural land exemption under Section 31.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Courts look at the *actual usage* and official zoning/revenue records of the land, not superficial attempts to disguise commercial or barren land as 'agricultural' merely to evade SARFAESI enforcement.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "Which section of the Civil Procedure Code is referenced in Section 31(g) to protect basic survival items (like cooking vessels) from being seized by a bank?",
          model_answer: "Section 60 of the Code of Civil Procedure, 1908.",
          difficulty: "advanced",
        }
      ],
      facts: [
        "Banks cannot use the SARFAESI Act to seize agricultural land, regardless of how much the borrower owes.",
        "If a borrower has paid back more than 80% of their total loan, the bank is banned from using SARFAESI to seize the collateral for the remainder."
      ],
    },
    {
      slug: "civil-court-bar",
      title: "Bar of Jurisdiction & Overriding Effect",
      sectionNumber: "§34-35",
      importance: "Core",
      summary: "How Sections 34 and 35 prevent civil courts from issuing injunctions and ensure SARFAESI reigns supreme.",
      body: `**The provision.** 
*   **Section 34:** No civil court shall have jurisdiction to entertain any suit or proceeding in respect of any matter which a Debts Recovery Tribunal (DRT) or the Appellate Tribunal (DRAT) is empowered to determine under this Act. Furthermore, *no injunction shall be granted by any court* in respect of any action taken or to be taken under this Act.
*   **Section 35:** The provisions of this Act shall have effect, notwithstanding anything inconsistent therewith contained in any other law for the time being in force or any instrument having effect by virtue of any such law.

**Why it matters.** Without Section 34, the entire SARFAESI Act would collapse. If a civil court could issue an injunction ("stay order") halting the bank's 60-day notice, borrowers would simply file endless lawsuits in local courts to delay the seizure, completely defeating the purpose of the "speedy recovery" law. Section 35 ensures that if a state law or another statute contradicts SARFAESI regarding asset recovery, SARFAESI wins.

**The insight.** The ban on injunctions is absolute. Even if a borrower claims the bank's paperwork is completely fraudulent, a local civil judge cannot issue a stay order halting the bank's action under Section 13(4). The borrower's *only* legal recourse is to wait for the bank to take action and then file an appeal with the specialized Debts Recovery Tribunal (DRT) under Section 17.

**The walk-through.** A bank issues a 60-day notice to seize a hotel. On day 55, the hotel owner runs to the local District Civil Court, claiming the bank miscalculated the interest, and begs the judge for a temporary injunction to stop the bank from taking possession on day 61. The judge reads Section 34 of the SARFAESI Act and dismisses the petition immediately, stating they have zero legal jurisdiction to interfere. The bank takes possession on day 61. The hotel owner must now take their interest-calculation argument to the DRT.

**The thread.** The SARFAESI Act was a brutal, necessary medicine for a banking sector that was dying of toxic debt. By defining strict boundaries (Chapter I), creating specialized debt-buyers (Chapter II), granting immense extra-judicial powers (Chapter III), tracking everything to prevent fraud (Chapter IV), penalizing rule-breakers (Chapter V), and building a wall against civil court interference (Chapter VI), the Act reshaped the Indian economy.`,
      questions: [
        {
          kind: "open",
          prompt: "Why is the absolute ban on civil court injunctions under Section 34 vital for the survival of the SARFAESI Act?",
          model_answer: "The primary purpose of the SARFAESI Act is to allow banks to recover debts speedily without court intervention. If civil courts were allowed to issue injunctions (stay orders), borrowers would continuously file frivolous civil suits to halt the bank's seizure process. This would drag recovery back into decades of litigation, entirely defeating the legislative intent of the Act. Section 34 prevents this by forcing all disputes into the specialized DRT.",
          difficulty: "intermediate",
        },
        {
          kind: "mcq",
          prompt: "Under Section 35, if a provision of the SARFAESI Act contradicts a state property law regarding the seizure of a mortgaged asset, which law prevails?",
          options: [
            "The state property law always prevails.",
            "The borrower gets to choose which law applies.",
            "The SARFAESI Act prevails due to its overriding effect.",
            "The matter must be escalated to the Supreme Court for a constitutional ruling."
          ],
          correct_index: 2,
          model_answer: "The SARFAESI Act prevails. Section 35 gives the Act an 'overriding effect', meaning it stands notwithstanding anything inconsistent contained in any other law.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "A local civil court judge can issue a temporary 10-day stay order against a bank's SARFAESI seizure if they believe the borrower is facing extreme hardship.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 34 states explicitly that 'no injunction shall be granted by any court or other authority in respect of any action taken or to be taken in pursuance of any power conferred by or under this Act'. The judge has zero jurisdiction.",
          difficulty: "intermediate",
        },
        {
          kind: "multi",
          prompt: "According to Section 34, which specific judicial bodies *are* empowered to determine matters arising out of a bank's actions under the SARFAESI Act?",
          options: [
            "The local District Civil Court.",
            "The Debts Recovery Tribunal (DRT).",
            "The Appellate Tribunal (DRAT).",
            "The Consumer Disputes Redressal Forum."
          ],
          correct_indices: [1, 2],
          model_answer: "Only the DRT (under Section 17) and the DRAT (under Section 18) are empowered to adjudicate disputes regarding measures taken under the SARFAESI Act.",
          difficulty: "basic",
        }
      ],
      facts: [
        "Civil courts in India are legally banned from issuing injunctions (stay orders) to stop a bank from seizing property under the SARFAESI Act.",
        "The SARFAESI Act has an 'overriding effect', meaning if it conflicts with another older law regarding debt recovery, SARFAESI automatically wins."
      ],
    }
  ],
};
