import type { SarfaesiChapter } from "../types";

export const preliminary: SarfaesiChapter = {
  slug: "preliminary",
  title: "Preliminary & Definitions",
  chapter: 1,
  tagline: "Short title, extent, commencement, and the core vocabulary of the Act.",
  color: "#5ba4cf",
  prereqs: [],
  unlocks: ["regulation"],
  intro: `Before the SARFAESI Act was passed in 2002, Indian banks faced a massive crisis of non-performing assets (NPAs). To recover a bad loan, a bank had to file a civil suit, endure years of litigation, and obtain a court decree before it could touch the borrower's mortgaged property. Borrowers knew this and used the agonizingly slow legal system as a shield. 

The SARFAESI Act fundamentally changed the balance of power. It allowed banks to bypass the courts entirely and directly seize and sell mortgaged assets to recover their dues. 

Chapter I of the SARFAESI Act lays the groundwork for this extraordinary power. It defines the vocabulary that dictates exactly *who* can use this power and *what* they can use it on. Understanding terms like "asset reconstruction company", "financial asset", "non-performing asset", and "secured creditor" is vital, because if a transaction doesn't fit perfectly into these definitions, the bank is forced back into the slow civil court system.`,
  sections: [
    {
      slug: "short-title-extent-commencement",
      title: "Scope & Application of the Act",
      sectionNumber: "§1",
      importance: "Foundation",
      summary: "Where, when, and why the SARFAESI Act applies to the whole of India.",
      body: `**The provision.** Section 1 gives the Act its long name: The Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002. It declares that it extends to the whole of India and came into force on the 21st day of June, 2002.

**Why it matters.** The sheer length of the name reveals the Act's three distinct purposes:
1. **Securitisation:** Pooling debt and selling it to investors as securities.
2. **Reconstruction of Financial Assets:** Buying bad loans at a discount and trying to recover the money (the business of ARCs).
3. **Enforcement of Security Interest:** The power of banks to seize collateral without court intervention.

**The insight.** The SARFAESI Act was initially an Ordinance (an emergency executive order) passed on June 21, 2002, before Parliament officially enacted it later that year. The banking sector was suffocating under NPAs, and the government needed a rapid legal surgical strike to empower banks to clean up their balance sheets.

**The walk-through.** Imagine a borrower defaults on a home loan in Mumbai, and the bank wants to seize the property. Because the Act extends to the whole of India, the bank relies on this central legislation rather than state-specific property recovery laws. 

**The thread.** The Act's powers are immense, but they are exclusively reserved for specific entities dealing with specific types of loans. To understand exactly who holds these powers, we must examine Section 2: Definitions.`,
      questions: [
        {
          kind: "quickfire",
          prompt: "What three main activities does the full name of the SARFAESI Act cover?",
          model_answer: "Securitisation, Reconstruction of Financial Assets, and Enforcement of Security Interest.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The SARFAESI Act allows banks to seize mortgaged property without needing a civil court decree.",
          options: ["True", "False"],
          correct_index: 0,
          model_answer: "True. Bypassing the slow civil court system to enforce security interests is the primary revolution of the SARFAESI Act.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Before the SARFAESI Act was enacted in 2002, what was the primary hurdle banks faced when trying to recover bad loans from defaulting borrowers?",
          model_answer: "Before SARFAESI, banks had to file civil suits and obtain a court decree to seize a borrower's mortgaged property. This process meant enduring years of slow litigation, which borrowers used as a shield to delay recovery, leading to a massive crisis of non-performing assets (NPAs).",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "The SARFAESI Act was born out of an urgent need to empower banks to recover bad loans without spending years in civil courts.",
        "The Act has three distinct pillars: Securitisation, Asset Reconstruction, and Enforcement of Security Interests."
      ],
    },
    {
      slug: "definitions",
      title: "Key Definitions",
      sectionNumber: "§2",
      importance: "Core",
      summary: "The critical definitions that determine whether the Act's immense powers apply: NPA, Financial Asset, and Secured Creditor.",
      body: `**The provision.** Section 2 defines the vocabulary used throughout the Act. If an entity or asset doesn't meet these definitions, the powers of the Act cannot be invoked.

*   **(ba) Asset Reconstruction Company (ARC):** A company registered with the RBI under section 3 for the purposes of carrying on the business of asset reconstruction or securitisation.
*   **(l) Financial Asset:** A broad term meaning debt or receivables. It includes claims to any debt, debt secured by mortgage/charge on immovable/movable property, and any right or interest in the security.
*   **(o) Non-Performing Asset (NPA):** An asset or account of a borrower which has been classified by a bank or financial institution as sub-standard, doubtful, or loss asset in accordance with the directions/guidelines issued by the RBI (or another relevant regulatory body).
*   **(zd) Secured Creditor:** Any bank or financial institution, debenture trustee, ARC, etc., in whose favour a security interest is created for due repayment by any borrower.
*   **(zf) Security Interest:** Right, title, or interest of any kind (other than those specified in Section 31) upon property, created in favour of any secured creditor, including any mortgage, charge, hypothecation, or assignment.

**Why it matters.** The definition of **NPA** is the trigger for the entire Act. A bank cannot touch a borrower's property just because they missed a single payment. The account must officially be classified as an NPA according to strict RBI guidelines (typically 90 days of default). 

**The insight.** Notice how "Secured Creditor" is defined. It specifies *banks and financial institutions*. This means an ordinary individual or an unregistered private moneylender cannot use the SARFAESI Act to seize property, even if they have a registered mortgage. This extraordinary power is reserved exclusively for the formal financial sector.

**The walk-through.** A businessman takes a loan from SBI and mortgages his factory. He defaults. After 90 days of non-payment, SBI classifies the account as an **NPA** (Section 2(o)). Because SBI is a **Secured Creditor** (Section 2(zd)) holding a **Security Interest** (Section 2(zf)) over the factory, the door to SARFAESI is now unlocked. If the businessman had borrowed from his wealthy uncle instead, the uncle would have to file a civil suit; he is not a "Secured Creditor" under this Act.

**The thread.** Now that we know *who* can act and *what* assets they can target, we look at the specialized entities created to buy up this bad debt when banks want to wash their hands of it: Asset Reconstruction Companies, regulated under Chapter II.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under the SARFAESI Act, which of the following can legally invoke the Act's powers to seize collateral without court intervention?",
          options: [
            "Any private individual who has registered a mortgage deed.",
            "A registered bank or financial institution (Secured Creditor).",
            "An unsecured creditor who lent money based on a promissory note.",
            "A company seeking to recover unpaid invoices from a client."
          ],
          correct_index: 1,
          model_answer: "A registered bank or financial institution. The definition of 'Secured Creditor' specifically limits these extraordinary powers to the formal financial sector, excluding private moneylenders or unsecured creditors.",
          difficulty: "intermediate",
        },
        {
          kind: "multi",
          prompt: "Which of the following conditions must be met for a bank's loan account to be officially classified as a Non-Performing Asset (NPA) under Section 2(o)? Select all that apply.",
          options: [
            "The borrower must have missed exactly one EMI payment.",
            "The account must be classified as sub-standard, doubtful, or loss asset.",
            "The classification must be in accordance with guidelines issued by the RBI.",
            "The bank's branch manager must personally file an FIR against the borrower."
          ],
          correct_indices: [1, 2],
          model_answer: "The account must be classified as sub-standard, doubtful, or loss asset in accordance with RBI guidelines (which typically require a 90-day default). Missing a single payment does not automatically trigger NPA status, and an FIR is entirely irrelevant.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Explain why the precise definition of 'Non-Performing Asset' (NPA) is considered the 'trigger' for the entire SARFAESI Act.",
          model_answer: "The NPA definition is the trigger because a bank cannot invoke its extraordinary powers to seize assets under SARFAESI immediately upon a missed payment. The account must first legally qualify as an NPA (sub-standard, doubtful, or loss) strictly according to RBI guidelines. Until that official classification happens, the doors to SARFAESI enforcement remain closed.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "What does 'ARC' stand for in the context of the SARFAESI Act?",
          model_answer: "Asset Reconstruction Company.",
          difficulty: "basic",
        }
      ],
      facts: [
        "A private moneylender cannot use the SARFAESI Act to seize property. The power is reserved for formal 'Secured Creditors' like banks and ARCs.",
        "A loan account must officially become an NPA according to RBI guidelines before a bank can initiate SARFAESI proceedings against the collateral."
      ],
    }
  ],
};
