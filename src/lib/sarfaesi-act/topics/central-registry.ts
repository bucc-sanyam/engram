import type { SarfaesiChapter } from "../types";

export const centralRegistry: SarfaesiChapter = {
  slug: "central-registry",
  title: "Central Registry",
  chapter: 4,
  tagline: "Preventing fraud through a nationwide database of security interests.",
  color: "#ff7a5c",
  prereqs: ["enforcement"],
  unlocks: ["offences"],
  intro: `Before the SARFAESI Act, a massive flaw existed in the Indian banking system: information asymmetry. A fraudster could take original property papers, mortgage them to Bank A for a loan, then create convincing fake copies of the papers and mortgage the exact same property to Bank B for another loan. Because there was no unified, nationwide database to check if a property was already mortgaged, banks were routinely scammed. 

When the borrower inevitably defaulted, Bank A and Bank B would both show up to seize the same house, leading to endless litigation over whose claim took priority.

Chapters IV and IVA of the SARFAESI Act solve this by establishing the Central Registry (CERSAI). It mandates the registration of all transactions related to securitisation, asset reconstruction, and the creation of security interests. It serves as an open, public notice to the world. If a bank registers its mortgage here, it establishes legal priority. If a bank fails to register, it loses its right to use the immense powers of Chapter III.`,
  sections: [
    {
      slug: "establishment-of-central-registry",
      title: "Establishment of Central Registry",
      sectionNumber: "§20-21",
      importance: "Foundation",
      summary: "Setting up the Central Registry (CERSAI) and integrating multiple databases.",
      body: `**The provision.** 
*   **Section 20:** The Central Government sets up the Central Registry for the purposes of registration of transactions of securitisation, asset reconstruction, and creation of security interest under the Act.
*   **Section 20A:** The Central Government may integrate the registration records of various other registration systems with the Central Registry to provide a unified central database. This includes records under the Companies Act, the Registration Act (for immovable property), the Motor Vehicles Act, and the Patents Act.
*   **Section 21:** The Central Government appoints a person to be known as the Central Registrar for the purpose of registering these transactions.

**Why it matters.** The Central Registry (known in practice as CERSAI - Central Registry of Securitisation Asset Reconstruction and Security Interest of India) is the single source of truth for encumbrances. Section 20A is particularly visionary; by integrating with the RTO (Motor Vehicles) and Sub-Registrar offices (real estate), it creates a unified search portal.

**The insight.** Information is only useful if everyone uses it. Setting up the database under Section 20 was the easy part. The hard part was forcing every bank, ARC, and financial institution to actually log their mortgages into it. The Act uses both carrots (priority of claims) and sticks (fines and loss of enforcement powers) to ensure compliance, which we will see in the subsequent sections.

**The walk-through.** A bank wants to issue a loan against a commercial truck. Before approving the loan, the bank searches the Central Registry. Because of Section 20A's integration with the Motor Vehicles database, the bank can instantly see if another lender already has a hypothecation mark on that specific truck's registration number. 

**The thread.** The registry is established. Now, the Act must mandate its use. Section 23 dictates exactly what must be filed, and Section 26 explains who can view it.`,
      questions: [
        {
          kind: "open",
          prompt: "What major systemic problem in the banking sector was the Central Registry (CERSAI) created to solve?",
          model_answer: "The Central Registry was created to solve the problem of information asymmetry and multiple mortgage frauds. Previously, a fraudster could mortgage the same property to multiple banks using fake papers because there was no unified national database to check for existing encumbrances. CERSAI provides a single source of truth to prevent this.",
          difficulty: "intermediate",
        },
        {
          kind: "mcq",
          prompt: "Under Section 20A, the Central Registry can be integrated with which of the following existing databases to create a unified search portal?",
          options: [
            "The Election Commission's voter database.",
            "The Income Tax Department's PAN database.",
            "Records under the Motor Vehicles Act and Registration Act.",
            "The Passport Office database."
          ],
          correct_index: 2,
          model_answer: "Records under the Motor Vehicles Act, Registration Act, Companies Act, and Patents Act. This allows the registry to track encumbrances on cars, real estate, corporate assets, and intellectual property.",
          difficulty: "basic",
        },
        {
          kind: "quickfire",
          prompt: "What does the acronym CERSAI stand for in practice?",
          model_answer: "Central Registry of Securitisation Asset Reconstruction and Security Interest of India.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "CERSAI acts as a nationwide, unified database to check if a property, vehicle, or corporate asset is already mortgaged to a bank.",
        "The Central Government appoints a Central Registrar to oversee the registration of all security interests under the Act."
      ],
    },
    {
      slug: "filing-transactions",
      title: "Registering Transactions",
      sectionNumber: "§22-26",
      importance: "Core",
      summary: "The strict requirement to file particulars of security interests, modifications, and the public's right to inspect.",
      body: `**The provision.** 
*   **Section 23:** The particulars of every transaction of securitisation, asset reconstruction, or creation of security interest *must* be filed with the Central Registrar within 30 days of the transaction.
*   **Section 24 & 25:** This applies not just to the creation, but to the lifecycle of the loan. Whenever the terms of a registered security interest are modified (Section 24), or the security interest is satisfied (the loan is paid in full) (Section 25), the ARC or secured creditor must send intimation to the Central Registrar within 30 days to update the record.
*   **Section 26:** The particulars entered in the Central register are open for inspection by any person on payment of the prescribed fees.

**Why it matters.** The 30-day timeline creates urgency. The requirement to file "satisfaction" (Section 25) is just as important as the initial creation. If a borrower pays off their 20-year home loan, the bank must tell CERSAI to remove the encumbrance. If they don't, the borrower won't be able to sell their house because a buyer searching the registry will still see a mortgage.

**The insight.** Section 26 democratizes the data. It explicitly states that *any person* can inspect the register. You don't have to be a bank. A regular citizen looking to buy a secondhand apartment can log into CERSAI, pay a nominal fee, and check if the seller is secretly hiding an unpaid mortgage on the property.

**The walk-through.** A borrower takes a loan and mortgages their house to HDFC. HDFC files the particulars with CERSAI within 30 days (Section 23). Ten years later, the borrower pays the final EMI. HDFC must file a memorandum of satisfaction within 30 days (Section 25). The Central Registrar updates the database, clearing the house's record. A month later, a prospective buyer uses Section 26 to inspect the registry and sees the house is free and clear, allowing the sale to proceed smoothly.

**The thread.** Filing is mandatory, but what happens if a bank is lazy and doesn't file? The Act uses the ultimate threat in Sections 26B-26E: loss of SARFAESI powers and loss of priority.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 23, within how many days must a bank file the particulars of a newly created security interest with the Central Registrar?",
          options: [
            "15 days",
            "30 days",
            "45 days",
            "60 days"
          ],
          correct_index: 1,
          model_answer: "30 days. The bank must file the particulars of the transaction within 30 days of its creation.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "Under Section 26, only registered banks and ARCs are legally permitted to inspect the Central Registry to check for property encumbrances.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 26 explicitly states that the register is open for inspection by 'any person' upon payment of the prescribed fees. A regular citizen buying a house can check it.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Why is the requirement to file a 'memorandum of satisfaction' under Section 25 just as critical for a borrower as the initial registration of the mortgage?",
          model_answer: "Filing a memorandum of satisfaction updates the registry to show the loan has been paid in full and the mortgage is cleared. This is critical for the borrower because if the bank fails to file it, the registry will still show an active encumbrance on the property. This false record would prevent the borrower from selling the property or taking a new loan against it in the future.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "Which section mandates that modifications to a security interest must also be filed with the Central Registrar?",
          model_answer: "Section 24.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "Any citizen can pay a small fee to search the Central Registry to ensure the house or car they are buying isn't secretly mortgaged to a bank.",
        "Banks must notify the Central Registry within 30 days when a borrower fully pays off their loan, so the property's record is cleared."
      ],
    },
    {
      slug: "priority-to-secured-creditors",
      title: "Effect of Registration and Priority",
      sectionNumber: "§26B-26E",
      importance: "Advanced",
      summary: "The ultimate 'stick' for banks: Registration serves as public notice, unlocks SARFAESI powers, and grants priority over government tax dues.",
      body: `**The provision.** Chapter IVA (inserted by a 2016 amendment) gives the Central Registry its teeth:
*   **Section 26C:** Registration of a security interest constitutes a "public notice" from the date and time of filing.
*   **Section 26D:** **The Stick.** No secured creditor can exercise the rights of enforcement under Chapter III (seizing the property) *unless* the security interest has been registered with the Central Registry.
*   **Section 26E:** **The Carrot.** After registration, the debts due to any secured creditor shall be paid in *priority* over all other debts, including all revenues, taxes, cesses, and rates payable to the Central Government, State Government, or local authority. (Note: This is subject to the Insolvency and Bankruptcy Code).

**Why it matters.** Section 26D is a masterstroke of legislative drafting. It forces compliance without needing a police force. If a bank is too lazy to register its mortgage on CERSAI, it completely loses the ability to bypass the civil courts. It loses the SARFAESI superpower. 

**The insight.** Section 26E overturned centuries of common law. Traditionally, the "Crown Debt" (government taxes) always took priority over private commercial debts. If a company went bankrupt, the tax department got paid first. Section 26E boldly states that a registered bank mortgage takes priority *even over government taxes*. The government essentially subordinated its own tax claims to protect the banking sector—provided the bank registers the mortgage.

**The walk-through.** A company owes ₹10 crores to a bank (which registered the mortgage on CERSAI) and also owes ₹5 crores in unpaid GST to the government. The company defaults. The bank seizes and sells the factory for ₹12 crores. Under Section 26E, the bank takes its full ₹10 crores first. The government only gets the remaining ₹2 crores. If the bank had forgotten to register on CERSAI, they would lose this priority, and they wouldn't even be able to seize the factory under SARFAESI (Section 26D).

**The thread.** The registry is powerful, but what if an ARC disobeys the RBI, or a bank flat out refuses to file transactions despite the loss of priority? Chapter V details the financial and criminal penalties for those who break the rules.`,
      questions: [
        {
          kind: "open",
          prompt: "Explain how Section 26D serves as the ultimate enforcement mechanism to ensure banks actually use the Central Registry.",
          model_answer: "Section 26D mandates that a secured creditor cannot exercise their immense powers of enforcement under Chapter III (like seizing property without court intervention) unless the security interest is registered with the Central Registry. This creates a massive incentive: if a bank is too lazy to register, they completely lose their SARFAESI superpower and are forced back into the slow civil courts.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "Under Section 26E, government tax dues (Crown Debt) always take priority over a bank's registered mortgage.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 26E explicitly overturned this traditional rule. Once a security interest is registered, the secured creditor's debt takes priority over all other debts, explicitly including revenues and taxes payable to the Central or State Governments.",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "According to Section 26C, what is the legal effect of registering a transaction (like a mortgage) with the Central Registry?",
          options: [
            "It guarantees that the borrower will not default.",
            "It is deemed to constitute a 'public notice' from the date and time of filing.",
            "It transfers ownership of the property to the bank immediately.",
            "It alerts the world that an encumbrance exists on that specific property."
          ],
          correct_indices: [1, 3],
          model_answer: "Registration constitutes a 'public notice' to the world from the exact time of filing, alerting everyone that an encumbrance exists. It does not guarantee repayment or transfer ownership.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "If a bank fails to register its mortgage with CERSAI, what specific power does it lose under Section 26D?",
          model_answer: "It loses the right to enforce the security interest under Chapter III (the right to seize and sell the asset without court intervention).",
          difficulty: "basic",
        }
      ],
      facts: [
        "A registered bank mortgage takes priority over unpaid government taxes when recovering money from a defaulted asset.",
        "If a bank forgets to register a mortgage on CERSAI, they cannot legally use the SARFAESI Act to seize that property."
      ],
    }
  ],
};
