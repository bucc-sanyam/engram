import type { SarfaesiChapter } from "../types";

export const miscellaneous: SarfaesiChapter = {
  slug: "miscellaneous",
  title: "Miscellaneous",
  chapter: 6,
  tagline: "Exemptions, jurisdiction of civil courts, and overriding effect.",
  color: "#c084fc",
  prereqs: ["offences"],
  unlocks: [],
  intro: `Chapter VI covers miscellaneous provisions that are vital for the smooth operation of the Act. It defines certain transactions that are exempt from the SARFAESI Act, grants immunity for actions taken in good faith, establishes that civil courts have no jurisdiction over matters handled by the DRT, and famously declares that the SARFAESI Act overrides other conflicting laws.`,
  sections: [
    {
      slug: "exemptions-and-protection",
      title: "Exemptions and Protection of Action",
      sectionNumber: "§31-32",
      importance: "Core",
      summary: "Transactions where SARFAESI doesn't apply and good faith immunity.",
      body: `**Section 31: Provisions of this Act not to apply in certain cases**

The SARFAESI Act does NOT apply to certain types of transactions, including:
*   A lien on any goods, money or security given under the Indian Contract Act or Sale of Goods Act.
*   A pledge of movables.
*   Creation of any security in any aircraft or vessel.
*   Any properties not liable to attachment under the Code of Civil Procedure.
*   Any security interest for securing repayment of a financial asset not exceeding one lakh rupees.
*   **Any security interest created in agricultural land.**
*   Any case where the amount due is less than 20% of the principal amount and interest thereon.

**Section 32: Protection of action taken in good faith**

No suit, prosecution, or other legal proceedings shall lie against the Reserve Bank, the Central Registry, or any secured creditor or their officers for anything done in good faith under this Act.`,
      questions: [],
      facts: ["SARFAESI cannot be used to enforce security interests on agricultural land or on debts under one lakh rupees."],
    },
    {
      slug: "civil-courts-and-overriding",
      title: "Jurisdiction and Overriding Effect",
      sectionNumber: "§34-35",
      importance: "Advanced",
      summary: "Barring civil courts from intervening and giving SARFAESI overriding power.",
      body: `**Section 34: Civil court not to have jurisdiction**

No civil court shall have jurisdiction to entertain any suit or proceeding in respect of any matter which a Debts Recovery Tribunal or the Appellate Tribunal is empowered by or under this Act to determine. Civil courts are also prohibited from granting injunctions in respect of any action taken pursuant to powers conferred by this Act.

**Section 35: The provisions of this Act to override other laws**

The provisions of this Act shall have effect, notwithstanding anything inconsistent therewith contained in any other law for the time being in force or any instrument having effect by virtue of any such law. This gives SARFAESI teeth against contradictory state or older central legislations.`,
      questions: [],
      facts: ["Civil courts cannot grant injunctions against banks taking action under the SARFAESI Act.", "The SARFAESI Act explicitly overrides other inconsistent laws."],
    },
    {
      slug: "limitation-and-rules",
      title: "Limitation and Rule-Making",
      sectionNumber: "§36-42",
      importance: "Foundation",
      summary: "Statute of limitations and the Central Government's power to make rules.",
      body: `**Section 36: Limitation**

No secured creditor shall be entitled to take all or any of the measures under Section 13(4) unless his claim in respect of the financial asset is made within the period of limitation prescribed under the Limitation Act, 1963.

**Section 37: Application of other laws not barred**

The provisions of this Act are in addition to, and not in derogation of, the Companies Act, SEBI Act, Recovery of Debts Due to Banks and Financial Institutions Act, etc.

**Section 38: Power of Central Government to make rules**

The Central Government may make rules for carrying out the provisions of this Act, such as prescribing fees, forms of registration, and the manner of exercising rights by secured creditors.`,
      questions: [],
      facts: ["A bank cannot use SARFAESI if its debt is time-barred under the Limitation Act, 1963."],
    }
  ],
};
