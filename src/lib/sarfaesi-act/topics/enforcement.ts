import type { SarfaesiChapter } from "../types";

export const enforcement: SarfaesiChapter = {
  slug: "enforcement",
  title: "Enforcement of Security Interest",
  chapter: 3,
  tagline: "Taking possession, appointing managers, and appealing to DRTs.",
  color: "#43d6b5",
  prereqs: ["regulation"],
  unlocks: ["central-registry"],
  intro: `Chapter III contains the most powerful and heavily utilized provisions of the SARFAESI Act. It empowers secured creditors (like banks) to enforce their security interests without the intervention of a court or tribunal. This chapter details the crucial 60-day notice period, the measures a creditor can take upon default (including taking possession of assets), the assistance provided by magistrates, and the appellate mechanism available to aggrieved parties through the Debts Recovery Tribunal (DRT).`,
  sections: [
    {
      slug: "enforcement-without-court",
      title: "Enforcement Without Court Intervention",
      sectionNumber: "§13(1)-(3A)",
      importance: "Core",
      summary: "The 60-day demand notice and the borrower's right to representation.",
      body: `**Section 13: Enforcement of security interest**

**(1) Enforcement without Court:** Any security interest created in favour of any secured creditor may be enforced without the intervention of the court or tribunal.

**(2) The 60-Day Notice:** When a borrower defaults and their account is classified as a Non-Performing Asset (NPA), the secured creditor may require the borrower by notice in writing to discharge in full his liabilities within 60 days.

**(3) Notice Details:** The notice must give details of the amount payable and the secured assets intended to be enforced.

**(3A) Borrower's Representation:** If the borrower makes a representation or raises an objection upon receiving the notice, the secured creditor must consider it. If the creditor finds it unacceptable, they must communicate the reasons for non-acceptance within 15 days. However, these reasons do not confer the right to file an immediate appeal to the DRT.`,
      questions: [],
      facts: ["Secured creditors can enforce security interests without going to court under SARFAESI.", "A mandatory 60-day notice must be issued to the borrower after the account becomes an NPA."],
    },
    {
      slug: "measures-to-recover",
      title: "Measures to Recover Secured Debts",
      sectionNumber: "§13(4)-(13)",
      importance: "Core",
      summary: "Taking possession, taking over management, and recovering money from third parties.",
      body: `**Section 13(4): Action upon failure to discharge liability**

If the borrower fails to discharge liability in full within the 60 days, the secured creditor may take recourse to one or more of the following measures:

*   **(a) Take Possession:** Take possession of the secured assets, including the right to transfer by lease, assignment, or sale.
*   **(b) Take over Management:** Take over the management of the business of the borrower.
*   **(c) Appoint a Manager:** Appoint any person to manage the secured assets that have been taken over.
*   **(d) Notice to Third Parties:** Require any person who has acquired secured assets from the borrower or owes money to the borrower to pay the secured creditor directly.

The right to transfer by lease/sale can only be exercised where a substantial part of the business is held as security.

If the borrower tenders the full dues together with costs before the publication of the notice for public auction/sale, the assets shall not be transferred.`,
      questions: [],
      facts: ["Section 13(4) allows banks to take physical possession of secured assets if the borrower doesn't pay within 60 days."],
    },
    {
      slug: "magistrate-assistance",
      title: "Assistance by Magistrates",
      sectionNumber: "§14",
      importance: "Core",
      summary: "Seeking the Chief Metropolitan Magistrate or District Magistrate's help to take possession.",
      body: `**Section 14: Chief Metropolitan Magistrate or District Magistrate to assist secured creditor**

Where possession of secured assets is required to be taken, the secured creditor may request in writing the Chief Metropolitan Magistrate (CMM) or District Magistrate (DM) within whose jurisdiction the asset is situated to take possession.

The CMM or DM shall take possession of the asset and documents and forward them to the secured creditor.

The secured creditor's application must be accompanied by a detailed affidavit confirming the debt, the security interest, the default, the NPA classification, and that the 60-day notice was served.`,
      questions: [],
      facts: ["Banks can request the local District Magistrate (DM) or CMM to physically assist in taking possession of property."],
    },
    {
      slug: "appeal-to-drt",
      title: "Appeals to Debts Recovery Tribunal",
      sectionNumber: "§17-18",
      importance: "Core",
      summary: "How aggrieved parties can challenge the secured creditor's actions.",
      body: `**Section 17: Application against measures to recover secured debts**

Any person (including the borrower) aggrieved by any of the measures referred to in Section 13(4) taken by the secured creditor may make an application to the Debts Recovery Tribunal (DRT) within 45 days from the date such measure was taken.

If the DRT concludes that the measures taken were not in accordance with the Act, it may declare the recourse invalid and order restoration of possession/management to the borrower.

**Section 18: Appeal to Appellate Tribunal**

Any person aggrieved by an order of the DRT under Section 17 may prefer an appeal to the Appellate Tribunal (DRAT) within 30 days. No appeal shall be entertained unless the borrower has deposited 50% of the amount of debt due (the Appellate Tribunal may reduce this to 25%).`,
      questions: [],
      facts: ["An aggrieved borrower must appeal to the DRT within 45 days of the bank taking a measure under Section 13(4).", "Appealing to the DRAT requires a mandatory pre-deposit of at least 25% to 50% of the debt."],
    }
  ],
};
