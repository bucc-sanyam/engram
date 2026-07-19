import type { SarfaesiChapter } from "../types";

export const centralRegistry: SarfaesiChapter = {
  slug: "central-registry",
  title: "Central Registry",
  chapter: 4,
  tagline: "Registration of securitisation, reconstruction, and security interest transactions.",
  color: "#ff7a5c",
  prereqs: ["enforcement"],
  unlocks: ["offences"],
  intro: `Chapters IV and IVA of the SARFAESI Act establish the Central Registry. This is a crucial database created to prevent frauds involving multiple mortgages on the same property. It mandates the registration of all transactions related to securitisation, asset reconstruction, and the creation of security interests by secured creditors. The Central Registry serves as a public notice to anyone inquiring about encumbrances on a property.`,
  sections: [
    {
      slug: "establishment-of-central-registry",
      title: "Establishment of Central Registry",
      sectionNumber: "§20-21",
      importance: "Foundation",
      summary: "Setting up the Central Registry and appointing the Central Registrar.",
      body: `**Section 20: Central Registry**

The Central Government sets up the Central Registry for the purposes of registration of transactions of securitisation and reconstruction of financial assets and creation of security interest under the Act.

**Section 20A: Integration of registration systems**

The Central Government may integrate the registration records of various registration systems (like under the Companies Act, Registration Act, Motor Vehicles Act, Patents Act, etc.) with the Central Registry to provide a unified central database.

**Section 21: Central Registrar**

The Central Government appoints a person to be known as the Central Registrar for the purpose of registering these transactions.`,
      questions: [],
      facts: ["The Central Registry (CERSAI) was established under SARFAESI to maintain records of security interests."],
    },
    {
      slug: "filing-transactions",
      title: "Registering Transactions",
      sectionNumber: "§22-26",
      importance: "Core",
      summary: "The requirement to file particulars of security interests and the right to inspect.",
      body: `**Section 23: Filing of transactions**

The particulars of every transaction of securitisation, asset reconstruction, or creation of security interest must be filed with the Central Registrar.

**Section 24 & 25: Modification and Satisfaction**

Whenever the terms of a registered security interest are modified, or the security interest is satisfied (paid in full), the ARC or secured creditor must send intimation to the Central Registrar within 30 days to record the modification or memorandum of satisfaction.

**Section 26: Right to inspect**

The particulars entered in the Central register are open during business hours for inspection by any person on payment of the prescribed fees.`,
      questions: [],
      facts: ["Anyone can inspect the Central Registry to check if a property has a registered security interest (mortgage) on it."],
    },
    {
      slug: "priority-to-secured-creditors",
      title: "Effect of Registration and Priority",
      sectionNumber: "§26B-26E",
      importance: "Advanced",
      summary: "Registration serves as public notice, and secured creditors get priority over other dues.",
      body: `**Section 26C: Effect of registration of transactions**

Registration of transactions of creation, modification, or satisfaction of security interest or filing of attachment orders shall be deemed to constitute a public notice from the date and time of filing.

**Section 26D: Right of enforcement of securities**

From the date of commencement of this Chapter, no secured creditor is entitled to exercise the rights of enforcement of securities under Chapter III unless the security interest created in its favour has been registered with the Central Registry.

**Section 26E: Priority to secured creditors**

After the registration of security interest, the debts due to any secured creditor shall be paid in priority over all other debts and all revenues, taxes, cesses, and other rates payable to the Central Government, State Government, or local authority. (Note: This priority is subject to the provisions of the Insolvency and Bankruptcy Code, 2016).`,
      questions: [],
      facts: ["A bank cannot enforce its security interest under SARFAESI if it hasn't registered that interest with the Central Registry.", "Registered secured creditors have priority over government tax dues."],
    }
  ],
};
