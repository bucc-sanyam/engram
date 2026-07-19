import type { SarfaesiChapter } from "../types";

export const regulation: SarfaesiChapter = {
  slug: "regulation",
  title: "Regulation of Securitisation and Reconstruction",
  chapter: 2,
  tagline: "Registration of ARCs, acquisition of financial assets, and measures for asset reconstruction.",
  color: "#f5b95f",
  prereqs: ["preliminary"],
  unlocks: ["enforcement"],
  intro: `Chapter II governs the core business of Asset Reconstruction Companies (ARCs). It establishes the mandatory registration with the Reserve Bank of India (RBI), the rules for acquiring financial assets from banks, issuing security receipts to qualified buyers, and the various measures an ARC can take to reconstruct assets (like taking over management, selling the business, or rescheduling debt).`,
  sections: [
    {
      slug: "registration-of-arcs",
      title: "Registration of Asset Reconstruction Companies",
      sectionNumber: "§3-4",
      importance: "Core",
      summary: "Mandatory RBI registration and cancellation rules for ARCs.",
      body: `**Section 3: Registration of Asset Reconstruction Companies**

No ARC can commence or carry on the business of securitisation or asset reconstruction without obtaining a certificate of registration from the RBI and having the required net owned fund (as specified by RBI, historically not less than two crore rupees).

The RBI considers factors like the ARC not incurring losses in preceding years, adequate arrangements for realization of acquired assets, professional experience of directors, and fit and proper sponsors before granting the certificate.

**Section 4: Cancellation of certificate of registration**

The RBI may cancel a registration if the ARC ceases to carry on business, ceases to hold investments from qualified buyers, fails to comply with conditions, or fails to comply with RBI directions or maintain proper accounts.`,
      questions: [],
      facts: ["ARCs must obtain a certificate of registration from the RBI to operate."],
    },
    {
      slug: "acquisition-of-financial-assets",
      title: "Acquisition of Rights or Interest in Financial Assets",
      sectionNumber: "§5",
      importance: "Core",
      summary: "How ARCs acquire financial assets from banks and step into their shoes.",
      body: `**Section 5: Acquisition of rights or interest in financial assets**

An ARC may acquire financial assets of any bank or financial institution by issuing a debenture, bond, or other security, or by entering into an agreement.

Upon such acquisition, the ARC is deemed to be the lender, and all rights of the original bank/FI vest in the ARC. All contracts, deeds, and agreements that were subsisting in favour of the bank now have full force in favour of the ARC.

Any pending suit, appeal, or proceeding by or against the bank relating to the financial asset can be continued and prosecuted by or against the ARC.`,
      questions: [],
      facts: ["When an ARC acquires a financial asset, it legally steps into the shoes of the original lending bank."],
    },
    {
      slug: "measures-for-assets-reconstruction",
      title: "Measures for Assets Reconstruction",
      sectionNumber: "§9",
      importance: "Core",
      summary: "The specific tools available to an ARC to resolve bad debts.",
      body: `**Section 9: Measures for assets reconstruction**

Without prejudice to other laws, an ARC may provide for any of the following measures for asset reconstruction:

*   (a) Proper management of the business of the borrower, by change in, or take over of, the management.
*   (b) The sale or lease of a part or whole of the business of the borrower.
*   (c) Rescheduling of payment of debts payable by the borrower.
*   (d) Enforcement of security interest in accordance with this Act.
*   (e) Settlement of dues payable by the borrower.
*   (f) Taking possession of secured assets.
*   (g) Conversion of any portion of debt into shares of a borrower company.`,
      questions: [],
      facts: ["ARCs have the power to convert a portion of a borrower's debt into shares of the borrower company."],
    },
    {
      slug: "rbi-powers",
      title: "Powers of the Reserve Bank",
      sectionNumber: "§12-12B",
      importance: "Foundation",
      summary: "RBI's authority to determine policy, issue directions, and audit ARCs.",
      body: `**Sections 12, 12A, 12B: Power of Reserve Bank**

**Section 12:** The RBI has the power to determine policy and give directions to ARCs in matters relating to income recognition, accounting standards, provisioning for bad debts, and capital adequacy.

**Section 12A:** RBI may call for statements and information from ARCs relating to their business.

**Section 12B:** RBI may carry out audits and inspections of an ARC. If satisfied that the business is conducted detrimentally to public interest, RBI may remove directors or appoint observers to secure proper management.`,
      questions: [],
      facts: ["The RBI serves as the primary regulator for Asset Reconstruction Companies."],
    }
  ],
};
