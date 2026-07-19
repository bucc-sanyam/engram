import type { SarfaesiChapter } from "../types";

export const regulation: SarfaesiChapter = {
  slug: "regulation",
  title: "Regulation of Securitisation and Reconstruction",
  chapter: 2,
  tagline: "Registration of ARCs, acquisition of financial assets, and measures for asset reconstruction.",
  color: "#f5b95f",
  prereqs: ["preliminary"],
  unlocks: ["enforcement"],
  intro: `When a bank's balance sheet is choking on Non-Performing Assets, it has two choices: spend years trying to recover the money itself (using the powers in Chapter III), or sell the bad debt to a specialist and instantly clean up its books. 

Chapter II governs these specialists, known as Asset Reconstruction Companies (ARCs). It establishes the strict regulatory framework under which they operate. Because ARCs are granted the same extraordinary powers as banks to seize and sell property without court intervention, they must be tightly controlled. 

This chapter mandates their registration with the Reserve Bank of India (RBI), dictates how they legally "step into the shoes" of the original lending bank when acquiring a financial asset, and outlines the specific surgical measures they can take to reconstruct a dying business or recover the debt. It also firmly establishes the RBI as the ultimate overseer with sweeping powers to audit, direct, and penalize these companies.`,
  sections: [
    {
      slug: "registration-of-arcs",
      title: "Registration of Asset Reconstruction Companies",
      sectionNumber: "§3-4",
      importance: "Core",
      summary: "The mandatory RBI registration and the conditions an ARC must meet to exist.",
      body: `**The provision.** Section 3 mandates that no ARC can commence or carry on the business of securitisation or asset reconstruction without obtaining a certificate of registration from the RBI. Furthermore, the ARC must have a minimum net owned fund as specified by the RBI (historically set at a baseline of two crore rupees, but subject to increase).

Before granting this certificate, the RBI inspects the ARC's books and considers several factors:
*   The ARC hasn't incurred losses in the preceding three years.
*   It has adequate arrangements to realize the financial assets it acquires.
*   Its directors have adequate professional experience.
*   The sponsors are fit and proper persons.
*   It complies with prudential norms.

**Section 4** gives the RBI the power to cancel the registration if the ARC ceases to carry on business, fails to hold investments from qualified buyers, or violates RBI directions.

**Why it matters.** ARCs are granted immense, extra-judicial powers to seize property and take over businesses. Section 3 acts as a massive filter, ensuring only well-capitalized, professionally managed entities with clean track records are trusted with these powers. 

**The insight.** An ARC is essentially a "bad bank." Its entire business model revolves around buying distressed, toxic assets from regular banks at a discount, and then using its specialized skills (and the SARFAESI powers) to recover more money than it paid. The RBI's rigorous registration process ensures that the toxic assets aren't simply transferred to an incompetent entity that could trigger a wider systemic failure.

**The walk-through.** A group of investors wants to start an ARC to buy bad loans from a struggling regional bank. They can't just incorporate a company and start buying. They must apply to the RBI, prove their net owned fund meets the threshold, and demonstrate their directors are experienced professionals (Section 3). If, two years later, they stop following RBI accounting standards, the RBI can instantly revoke their license (Section 4).

**The thread.** Once an ARC is registered, its next step is actually acquiring the bad debt from the banks. This magical legal transfer, where the ARC replaces the bank entirely, happens under Section 5.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 3, which regulatory body is responsible for granting a certificate of registration to an Asset Reconstruction Company (ARC)?",
          options: [
            "The Securities and Exchange Board of India (SEBI)",
            "The Ministry of Finance",
            "The Reserve Bank of India (RBI)",
            "The Debts Recovery Tribunal (DRT)"
          ],
          correct_index: 2,
          model_answer: "The Reserve Bank of India (RBI). The RBI is the primary regulator for ARCs and mandates registration before they can commence business.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The RBI must grant a registration certificate to any ARC that applies, provided they pay the application fee.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The RBI has a rigorous screening process under Section 3 and will only grant a certificate if satisfied that the ARC meets strict criteria regarding net owned funds, profitable track records, and professional management.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Explain why the SARFAESI Act places such strict registration and cancellation conditions on ARCs under Sections 3 and 4.",
          model_answer: "ARCs are granted extraordinary, extra-judicial powers to seize assets and take over the management of defaulting businesses. Strict RBI registration and the threat of cancellation ensure that only well-capitalized, highly professional, and strictly regulated entities are entrusted with these immense powers, preventing abuse and systemic financial risk.",
          difficulty: "advanced",
        }
      ],
      facts: [
        "No company can operate as an ARC in India without explicit registration and approval from the RBI.",
        "The RBI can revoke an ARC's license if it fails to maintain proper accounts or violates RBI directives."
      ],
    },
    {
      slug: "acquisition-of-financial-assets",
      title: "Acquisition of Rights or Interest",
      sectionNumber: "§5",
      importance: "Core",
      summary: "How ARCs acquire financial assets and legally 'step into the shoes' of the original lending bank.",
      body: `**The provision.** Section 5 governs how an ARC acquires a financial asset (a bad loan) from a bank or financial institution. It can do this by issuing a debenture, bond, or other security, or simply by entering into an agreement.

The most critical part of Section 5 is the legal fiction it creates: **Upon such acquisition, the ARC is deemed to be the lender.** All rights of the original bank vest entirely in the ARC. 

Furthermore, all contracts, deeds, agreements, and mortgages that were valid in favour of the original bank now have full legal force in favour of the ARC. Any pending lawsuit or appeal by or against the bank relating to that asset can be continued and prosecuted by or against the ARC.

**Why it matters.** This section is the legal magic trick that makes asset reconstruction possible. Without it, every time an ARC bought a bad loan, it would have to sign brand new mortgage agreements and contracts with the defaulting borrower—which the borrower would obviously refuse to do. Section 5 forces the transfer by operation of law.

**The insight.** The concept is called "subrogation" or "stepping into the shoes." The borrower might suddenly receive a letter saying they no longer owe money to ICICI Bank; they now owe it to Phoenix ARC Private Limited. The borrower has no say in this transfer. The ARC inherits every single right the bank had, including the right to seize the property under SARFAESI.

**The walk-through.** A textile mill owes ₹50 crores to a public sector bank and has mortgaged its factory. The loan becomes an NPA. The bank doesn't want the headache, so it sells the loan to an ARC for ₹30 crores. The moment the agreement is signed, Section 5 activates. The ARC becomes the new secured creditor. The factory is now mortgaged to the ARC, and the ARC can immediately issue a 60-day notice to seize the factory, even though the mill's owner never signed a contract with the ARC.

**The thread.** Now that the ARC owns the toxic asset and holds all the rights, what exactly can it do to recover the money? Section 9 provides the toolkit.`,
      questions: [
        {
          kind: "open",
          prompt: "Explain the legal effect of Section 5 when an ARC acquires a financial asset from a bank. Why is this provision critical for the ARC's business model?",
          model_answer: "Under Section 5, when an ARC acquires a financial asset, it legally 'steps into the shoes' of the original bank. The ARC is deemed to be the lender, inheriting all rights, mortgages, and agreements associated with the loan. This is critical because it allows the ARC to enforce the security interest (e.g., seize property) without needing the defaulting borrower to sign new contracts.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "If a bank sells a bad loan to an ARC, the defaulting borrower must sign a new mortgage agreement with the ARC before the ARC can seize the property.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 5 dictates that all existing deeds and agreements automatically have full force in favour of the ARC upon acquisition. The borrower's consent or new signature is not required.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "If a lawsuit regarding a mortgaged property is pending between a bank and a borrower, and the bank sells the loan to an ARC, what happens to the lawsuit under Section 5?",
          model_answer: "The lawsuit can be continued and prosecuted by or against the ARC, as it completely replaces the bank in the proceedings.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "When an ARC buys a loan, it legally becomes the new lender, inheriting all the original bank's rights and mortgages automatically.",
        "Borrowers have no legal right to block their bank from selling their loan to an Asset Reconstruction Company."
      ],
    },
    {
      slug: "measures-for-assets-reconstruction",
      title: "Measures for Assets Reconstruction",
      sectionNumber: "§9",
      importance: "Core",
      summary: "The specific tools available to an ARC to resolve bad debts, from rescheduling to taking over management.",
      body: `**The provision.** Section 9 outlines the specific measures an ARC can take to reconstruct the asset and recover the money. It allows the ARC to provide for one or more of the following:

*   **(a) Change or take over of management:** The ARC can literally take over the management of the borrower's business.
*   **(b) Sale or lease:** Selling or leasing a part or whole of the borrower's business.
*   **(c) Rescheduling of debts:** Changing the payment terms.
*   **(d) Enforcement of security interest:** Seizing the collateral in accordance with the Act.
*   **(e) Settlement of dues:** Reaching a compromise amount with the borrower.
*   **(f) Taking possession:** Taking physical possession of secured assets.
*   **(g) Conversion to equity:** Converting a portion of the debt into shares of the borrower company.

**Why it matters.** This is the ARC's toolkit. It provides flexibility. Sometimes, seizing a factory and selling the machinery as scrap isn't the best way to maximize recovery. If a business is fundamentally viable but suffering from terrible management, the ARC can fire the management, run the company profitably, and recover the debt from the profits.

**The insight.** Clause (g)—converting debt into equity—is a powerful restructuring tool. If a borrower owes ₹100 crores and cannot pay, the ARC can convert ₹40 crores of that debt into equity shares. Suddenly, the ARC is a major shareholder (potentially a controlling shareholder) in the borrower's company, aligning their interests and giving the ARC a seat at the board table.

**The walk-through.** An ARC acquires a bad loan from a hotel chain. Instead of auctioning off the hotels (which might fetch a low price in a bad market), the ARC analyzes the business and decides the issue is high interest rates. Using Section 9, they reschedule the debt to a lower interest rate over a longer period (Clause c), and convert a portion of the unpaid interest into equity shares in the hotel chain (Clause g). The hotel survives, and the ARC recovers its money over time while holding a valuable equity stake.

**The thread.** While ARCs have massive power to reconstruct assets, they are not rogue operators. Their every move is watched by the ultimate authority in Indian banking, as detailed in Sections 12 and 12B.`,
      questions: [
        {
          kind: "multi",
          prompt: "Under Section 9, which of the following measures can an Asset Reconstruction Company (ARC) legally take to recover a debt? Select all that apply.",
          options: [
            "Rescheduling the payment of debts.",
            "Taking over the management of the borrower's business.",
            "Converting a portion of the debt into shares of the borrower company.",
            "Arresting the directors of the borrower company."
          ],
          correct_indices: [0, 1, 2],
          model_answer: "An ARC can reschedule debts, take over management, and convert debt to equity. It does not possess police powers and cannot arrest directors.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Explain how 'converting debt to equity' (Section 9(g)) serves as a strategic tool for an ARC rather than just seizing collateral.",
          model_answer: "Converting debt to equity allows an ARC to take an ownership stake in a struggling but fundamentally viable company. Instead of selling assets at a fire-sale price, the ARC reduces the company's immediate debt burden, becomes a shareholder, and can participate in the company's future profits or eventual turnaround, often maximizing the overall financial recovery.",
          difficulty: "advanced",
        },
        {
          kind: "truefalse",
          prompt: "An ARC is forced to sell the collateral immediately upon acquiring a bad loan; it cannot choose to restructure the debt instead.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 9 provides ARCs with a flexible toolkit. They can choose to restructure the debt, reschedule payments, or even take over management if they believe that will yield a better recovery than an immediate fire-sale.",
          difficulty: "basic",
        }
      ],
      facts: [
        "ARCs have the legal power to physically take over the management of a defaulting borrower's business to recover their dues.",
        "An ARC can forcefully convert a portion of a defaulting company's debt into equity shares."
      ],
    },
    {
      slug: "rbi-powers",
      title: "Powers of the Reserve Bank",
      sectionNumber: "§12-12B",
      importance: "Foundation",
      summary: "The RBI's sweeping authority to determine policy, issue directions, and audit ARCs.",
      body: `**The provision.** Sections 12 through 12B cement the Reserve Bank of India (RBI) as the absolute authority over ARCs.
*   **Section 12:** The RBI has the power to determine policy and issue binding directions to ARCs regarding income recognition, accounting standards, provisioning for bad debts, and capital adequacy.
*   **Section 12A:** The RBI may call for statements and information from ARCs relating to their business at any time.
*   **Section 12B:** The RBI may carry out audits and inspections of an ARC. If satisfied that the business is conducted detrimentally to public interest, the RBI can remove directors or appoint observers to secure proper management.

**Why it matters.** ARCs deal with billions of dollars of toxic assets that have been flushed out of the banking system. If ARCs fail or engage in shady accounting, the systemic risk bounces right back into the financial sector. The RBI's powers ensure that ARCs remain solvent, transparent, and aligned with national economic policy.

**The insight.** Section 12B is a drastic measure. It means the regulator doesn't just issue fines; it can physically walk into an ARC, fire the board of directors, and install its own people to run the company if it senses mismanagement. This keeps ARC executives highly accountable.

**The walk-through.** An ARC starts using aggressive, non-standard accounting to make its balance sheet look highly profitable, masking the fact that it isn't actually recovering much money from its acquired assets. The RBI conducts an inspection under Section 12B, uncovers the creative accounting, issues a binding directive under Section 12 forcing them to restate their earnings, and fires the CFO who orchestrated it.

**The thread.** We have covered the vocabulary and the specialized companies (ARCs). Now we reach the climax of the Act: the actual, step-by-step process of seizing a defaulting borrower's property without a court order, detailed in Chapter III.`,
      questions: [
        {
          kind: "mcq",
          prompt: "If the RBI determines an ARC is being managed in a way detrimental to public interest, what drastic action can the RBI take under Section 12B?",
          options: [
            "File a civil suit in the Supreme Court.",
            "Remove the ARC's directors and appoint its own observers.",
            "Transfer all the ARC's assets to the State Bank of India.",
            "Order the immediate arrest of the shareholders."
          ],
          correct_index: 1,
          model_answer: "The RBI has the power to remove directors and appoint observers to secure proper management of the ARC.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Why is it crucial for the RBI to have the power to dictate accounting standards and capital adequacy norms for ARCs under Section 12?",
          model_answer: "ARCs handle massive amounts of toxic assets transferred from the banking system. If they engage in shady accounting or become insolvent, it poses a severe systemic risk to the broader financial sector. By dictating strict accounting and capital norms, the RBI ensures ARCs remain transparent, solvent, and do not mask their true financial health.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "Which section grants the RBI the power to carry out audits and inspections of an Asset Reconstruction Company?",
          model_answer: "Section 12B.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "The RBI does not need a court order to fire the directors of an Asset Reconstruction Company; it can do so directly if public interest is threatened."
      ],
    }
  ],
};
