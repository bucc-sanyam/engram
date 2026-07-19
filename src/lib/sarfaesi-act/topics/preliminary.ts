import type { SarfaesiChapter } from "../types";

export const preliminary: SarfaesiChapter = {
  slug: "preliminary",
  title: "Preliminary",
  chapter: 1,
  tagline: "Short title, extent, commencement, and definitions.",
  color: "#5ba4cf",
  prereqs: [],
  unlocks: ["regulation"],
  intro: `Chapter I of the SARFAESI Act lays the groundwork. It sets out the scope of the Act, which extends to the whole of India, and provides crucial definitions that govern the interpretation of the entire statute. Understanding terms like "asset reconstruction company", "financial asset", "non-performing asset", and "secured creditor" is vital before diving into the operational mechanisms of the Act.`,
  sections: [
    {
      slug: "short-title-extent-commencement",
      title: "Short Title, Extent and Commencement",
      sectionNumber: "§1",
      importance: "Foundation",
      summary: "Scope and applicability of the SARFAESI Act.",
      body: `**Section 1: Short title, extent and commencement**

This section declares that the Act may be called the Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002.

It extends to the whole of India and is deemed to have come into force on the 21st day of June, 2002.`,
      questions: [],
      facts: ["The SARFAESI Act came into force on June 21, 2002."],
    },
    {
      slug: "definitions",
      title: "Definitions",
      sectionNumber: "§2",
      importance: "Core",
      summary: "Key definitions including Asset Reconstruction Company, Financial Asset, and NPA.",
      body: `**Section 2: Definitions**

This section defines the key terms used throughout the Act. Some of the most critical definitions include:

*   **Asset Reconstruction Company (ARC):** A company registered with the Reserve Bank under section 3 for the purposes of carrying on the business of asset reconstruction or securitisation, or both.
*   **Financial Asset:** Means debt or receivables and includes claims to any debt, any debt secured by mortgage/charge on property, mortgages, and any right or interest in security.
*   **Non-Performing Asset (NPA):** An asset or account of a borrower, which has been classified by a bank or financial institution as sub-standard, doubtful, or loss asset in accordance with RBI guidelines or other regulatory body guidelines.
*   **Secured Creditor:** Any bank or financial institution or consortium thereof, debenture trustee, asset reconstruction company, etc., in whose favour security interest is created.
*   **Security Interest:** Right, title or interest of any kind (other than those specified in Section 31) upon property created in favour of any secured creditor.`,
      questions: [],
      facts: ["An NPA is an asset classified as sub-standard, doubtful, or loss by a bank/FI according to RBI guidelines."],
    }
  ],
};
