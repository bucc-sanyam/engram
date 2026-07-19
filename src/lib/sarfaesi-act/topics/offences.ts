import type { SarfaesiChapter } from "../types";

export const offences: SarfaesiChapter = {
  slug: "offences",
  title: "Offences and Penalties",
  chapter: 5,
  tagline: "Penalties for non-compliance and offences by companies.",
  color: "#f87171",
  prereqs: ["central-registry"],
  unlocks: ["miscellaneous"],
  intro: `Chapter V establishes the penalties for failing to comply with the provisions of the SARFAESI Act, particularly regarding the mandatory registration of transactions with the Central Registry and adherence to RBI directions. It outlines the powers of the adjudicating authority to impose monetary fines and how these fines are recovered.`,
  sections: [
    {
      slug: "penalties-and-offences",
      title: "Penalties and General Offences",
      sectionNumber: "§27-29",
      importance: "Core",
      summary: "Fines for failing to file transactions with the Central Registry.",
      body: `**Section 27: Penalties**

If a default is made in filing the particulars of transactions, modifications, or intimations of satisfaction with the Central Registry, every company, every officer of the company, the secured creditors, and every officer of the secured creditor who is in default is punishable with a fine which may extend to five thousand rupees for every day during which the default continues.

**Section 29: Offences**

If any person contravenes or attempts to contravene or abets the contravention of the provisions of this Act or of any rules made thereunder, he shall be punishable with imprisonment for a term which may extend to one year, or with fine, or with both.`,
      questions: [],
      facts: ["Failing to register a security interest can result in daily fines of up to five thousand rupees."],
    },
    {
      slug: "adjudication-and-recovery",
      title: "Adjudication and Recovery of Penalties",
      sectionNumber: "§30-30D",
      importance: "Core",
      summary: "How penalties are imposed, appealed, and recovered.",
      body: `**Section 30A: Power of adjudicating authority to impose penalty**

If an ARC or person fails to comply with any direction issued by the Reserve Bank under this Act, the adjudicating authority may impose a penalty not exceeding one crore rupees or twice the amount involved in such failure (whichever is more). If the failure continues, a further penalty of up to one lakh rupees for every day may be imposed. The ARC's registration can also be cancelled for non-payment.

**Section 30B & 30C: Appeals**

An aggrieved party can prefer an appeal to the Appellate Authority designated by the Central Board of the Reserve Bank within thirty days.

**Section 30D: Recovery of penalties**

Penalties are recovered as a "recoverable sum" by the Reserve Bank, which may debit the current account of the person in default or issue notices to third parties who owe money to the person in default to deduct the penalty amount.`,
      questions: [],
      facts: ["The RBI adjudicating authority can impose massive fines up to one crore rupees for non-compliance with its directions."],
    }
  ],
};
