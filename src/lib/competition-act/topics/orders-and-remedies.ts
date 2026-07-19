import type { CompActChapter } from "../types";

/** Chapter 7 — Orders, Relief & Remedies: the CCI's enforcement toolkit. */
export const ordersAndRemedies: CompActChapter = {
  slug: "orders-and-remedies",
  title: "Orders, Relief & Remedies",
  chapter: 7,
  tagline: "Cease-and-desist, penalties, modifications, and compensation — how the CCI turns findings into consequences.",
  color: "#ff7a5c",
  prereqs: ["inquiry-powers"],
  unlocks: ["director-general"],
  intro: `The investigation is complete, the hearings are over, and the CCI has formed its view. Now what? Chapter IV of the Act (Sections 27–31, along with Section 34) empowers the CCI to pass final orders that range from cease-and-desist directions to penalties of up to 10% of turnover, from mandatory modifications to mergers to awards of compensation. This is where the Act's prohibitions become real — where a finding of cartel behaviour transforms into a ₹6,000-crore penalty, or a finding of abuse of dominance becomes a mandatory change to a company's business practices.

The CCI's remedial toolkit is designed around a simple principle: the remedy must match the harm. A cartel that has already inflicted consumer damage needs a penalty large enough to deter repetition — both by the offender and by anyone else tempted to collude. A dominant firm that is denying market access needs a behavioural direction that opens the market — not just a fine that it can absorb as a cost of doing business. A merger that would create a monopoly needs structural modification — divestiture of overlapping businesses — not just a promise of good behaviour.

The three sections ahead cover the three main categories of CCI orders: orders against anti-competitive agreements (Section 27), orders against abuse of dominance (Section 28 read with Section 27), and orders regarding combinations (Section 31). Together, they form the Act's enforcement backbone.`,
  sections: [
    {
      slug: "orders-against-agreements",
      title: "Orders Against Anti-Competitive Agreements",
      sectionNumber: "§27",
      importance: "Core",
      summary: "What the CCI can order when it finds a cartel or restrictive agreement — cease-and-desist, penalties up to 10% of turnover, and more.",
      body: `**The provision.** Section 27 empowers the CCI, after finding a contravention of Section 3 (anti-competitive agreements) or Section 4 (abuse of dominant position), to pass all or any of the following orders:

(a) Direct the enterprise to **discontinue** and not to re-enter the agreement or discontinue the abuse.
(b) Impose a **penalty** of not more than 10% of the average turnover of the enterprise for the last three preceding financial years. For cartels, the penalty can be up to three times the profit made from the cartel, or 10% of turnover, whichever is higher.
(c) Direct the **modification** of the agreement.
(d) Direct the enterprise to **abide by such other orders** as the CCI may pass and comply with directions, including payment of costs.
(e) Pass any other order or direction as it may deem fit.

**Why it matters.** The penalty provision is the Act's sharpest deterrent. Ten percent of *average turnover* for three years is an enormous number for large enterprises — for a company with ₹50,000 crores in annual revenue, the maximum penalty is ₹5,000 crores per contravention. The penalty is not calculated on profits (which companies can depress through accounting), but on *turnover* (which cannot be hidden). This is a deliberate design choice: the penalty must be large enough that no rational company would risk a cartel because the expected penalty (probability of detection × penalty amount) exceeds the expected gain.

**The insight.** The "three times the profit" alternative for cartels, introduced by the 2023 amendment, addresses a specific enforcement gap. Under the original 10%-of-turnover formula, a company with a large turnover but a cartel that affected only a small product line might face a disproportionately large penalty (unfair), while a company with a small turnover but enormous cartel gains might face a disproportionately small penalty (ineffective). The "three times profit" option lets the CCI scale the penalty to the actual *gain* from the illegal conduct — a more precise deterrent.

**The walk-through.** In the **Cement Cartel case** (2016, COMPAT appeal), the CCI had originally imposed penalties of ₹6,307 crores on 11 cement companies. On appeal, the Competition Appellate Tribunal reduced the penalties to roughly ₹4,000 crores, adjusting the relevant turnover to cover only the cement business (not the companies' entire diversified operations). The Supreme Court later examined the penalty methodology. The case established that the CCI must: (a) use "relevant turnover" (turnover from the product affected by the cartel, not total company turnover) as the base; (b) calibrate the percentage based on the severity, duration, and nature of the contravention; and (c) provide reasons for the specific penalty amount chosen. These principles now guide every CCI penalty calculation.

**The thread.** Orders against agreements address collective harm. But dominance abuse often requires a different kind of remedy — not just a penalty, but a *behavioural direction* that changes how a company operates. The orders the CCI can pass against dominant enterprises include mandatory access requirements, unbundling obligations, and pricing constraints. Those remedies are the next section.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under Section 27, what is the maximum penalty the CCI can generally impose for an anti-competitive agreement or abuse of dominance?",
          options: [
            "Up to ₹100 crores.",
            "Up to 10% of the average turnover of the enterprise for the last three preceding financial years.",
            "Up to 50% of the company's total assets.",
            "Up to three times the total revenue of the company."
          ],
          correct_index: 1,
          model_answer: "The standard maximum penalty is 10% of the average turnover for the preceding three financial years.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "For cartels specifically, the maximum penalty is strictly capped at 10% of turnover, regardless of how much profit the cartel actually made.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. For cartels, the penalty can be up to three times the profit made from the cartel OR 10% of turnover, whichever is higher. This ensures the penalty outweighs the illegal gain.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Why does the Act primarily calculate penalties based on 'turnover' rather than 'profit'?",
          model_answer: "Profits can be easily manipulated or depressed through accounting practices, making them an unreliable base for penalties. Turnover (revenue) is much harder to hide, ensuring the penalty acts as a massive, unavoidable deterrent.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "According to the Supreme Court in the Cement Cartel case, what specific type of turnover must the CCI use as the base for calculating penalties?",
          model_answer: "'Relevant turnover' — the turnover strictly from the product/service affected by the contravention, not the company's entire diversified operations.",
          difficulty: "basic",
        }
      ],
      facts: [
        "To punish a cartel, the CCI can fine a company up to three times the profit it made from the illegal agreement — mathematically ensuring that crime literally does not pay.",
      ],
    },
    {
      slug: "dominance-remedies",
      title: "Remedies for Abuse of Dominance",
      sectionNumber: "§27–28",
      importance: "Core",
      summary: "Behavioural directions, mandatory access, and structural remedies — how the CCI reshapes a dominant firm's conduct.",
      body: `**The provision.** When the CCI finds an abuse of dominant position under Section 4, it can pass any of the orders listed in Section 27 (described in the previous section), plus the broader power in Section 28 to "pass such order or issue such directions as it may deem appropriate," including the division of a dominant enterprise where it considers division necessary to ensure that the enterprise does not abuse its dominant position.

This includes: directing the dominant enterprise to (a) cease the abusive practice, (b) modify its terms of dealing, (c) provide access to its network or essential facility, (d) unbundle products that have been illegally tied, or (e) undergo structural separation (splitting the enterprise).

**Why it matters.** Dominance cases require more than just penalties. A fine, however large, does not change the structural conditions that enable the abuse. If a dominant platform forces app developers to use its payment system, a penalty might deter the specific practice — but the underlying market power persists, and the platform may find new ways to abuse it. Behavioural remedies (mandatory access, unbundling) address the *conduct*; structural remedies (division, divestiture) address the *power itself*. The CCI has both tools and must choose the appropriate one for each case.

**The insight.** Structural remedies — actually breaking up a dominant enterprise — are the nuclear option. The CCI has never used this power, and no competition authority globally has imposed a structural breakup since the AT&T case in the United States (1984). The threat, however, is not empty. Its very existence creates a "shadow of the law" — dominant enterprises know that persistent, egregious abuse could, in theory, lead to division, and this knowledge moderates behaviour. In practice, the CCI overwhelmingly relies on behavioural remedies: directing the enterprise to change specific practices while leaving its structure intact.

**The walk-through.** In **Google/Android (2022)**, the CCI did not merely impose a ₹1,337.76-crore penalty. It also issued comprehensive behavioural directions: (a) Google must allow Android device manufacturers to install alternative app stores alongside the Play Store; (b) Google must not mandate pre-installation of its apps as a condition of licensing Play Store or Android; (c) Google must allow users to set any search engine as default during device setup; (d) Google must not offer financial incentives to OEMs conditional on exclusive pre-installation of Google Search; and (e) Google must allow sideloading of apps without warnings that discourage users. These directions were designed not just to punish past abuse, but to structurally alter Google's relationship with the Android ecosystem going forward.

**The thread.** Agreements and dominance are ex-post enforcement — the CCI acts after the harm has occurred. Combination orders are different: they are ex-ante, shaping transactions *before* they close. The CCI's power to approve, modify, or block mergers — and the conditions it attaches to approvals — is the next section.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Which of the following is an example of a 'structural remedy' that the CCI has the theoretical power to order against a dominant enterprise?",
          options: [
            "Mandating that the enterprise provide network access to rivals.",
            "Ordering the division (breakup) of the enterprise.",
            "Capping the prices the enterprise can charge.",
            "Prohibiting the enterprise from offering bundled discounts."
          ],
          correct_index: 1,
          model_answer: "Division or breakup is a structural remedy because it alters the actual physical/corporate structure of the firm. The others are behavioral remedies.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The CCI frequently uses its power to physically break up (structurally divide) dominant tech companies in India.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The CCI has never used its power to break up a company. It overwhelmingly relies on behavioral remedies (like directing the company to change specific business practices).",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "What is the core difference between a behavioural remedy and a structural remedy in dominance cases?",
          model_answer: "A behavioural remedy addresses the *conduct* (forcing the company to change its practices, like unbundling products, while staying intact). A structural remedy addresses the *power itself* (breaking up the company so it no longer has dominance).",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "In the Google/Android (2022) case, which of the following behavioural directions did the CCI issue? Select all that apply.",
          options: [
            "Allowing Android device manufacturers to install alternative app stores",
            "Mandating Google to sell the Android operating system to a competitor",
            "Prohibiting the mandatory pre-installation of Google apps as a condition for Play Store licensing",
            "Forcing Google to hire a government-appointed CEO"
          ],
          correct_indices: [0, 2],
          model_answer: "The CCI ordered Google to allow alternative app stores and stop mandating pre-installation of its own apps. It did not order structural changes like selling Android or replacing the CEO.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "In theory, the CCI has the power to legally break a dominant company into smaller pieces (a 'structural remedy'), though it has never actually used this nuclear option.",
      ],
    },
    {
      slug: "combination-orders",
      title: "Orders on Combinations",
      sectionNumber: "§31",
      importance: "Core",
      summary: "Approve, modify, or block — the CCI's three options when reviewing a merger, and the conditions it can impose.",
      body: `**The provision.** Section 31 provides the CCI's three options after reviewing a combination:

(1) **Approve** — the combination may proceed as notified. The CCI issues an approval order, and the standstill period ends.
(2) **Approve with modifications** — the CCI identifies competitive concerns and proposes modifications. The parties may accept the modifications (in which case the combination proceeds with conditions) or withdraw the transaction.
(3) **Block** — the CCI directs that the combination shall not take effect. The parties cannot proceed.

Modifications can be **structural** (divestiture of a business unit, sale of assets to a third party) or **behavioural** (commitments to maintain pricing, guarantee access to third parties, maintain firewalls between competing business lines).

Section 31(11) provides that if the CCI does not pass any order within 210 days of notification, the combination is deemed approved.

**Why it matters.** The CCI's combination review power is the Act's most proactive tool. Unlike cartel enforcement (which punishes past harm) and dominance enforcement (which corrects ongoing abuse), combination review *prevents* competitive harm from occurring. A merger that would create a monopoly is stopped before it creates the monopoly. This is structurally more efficient: preventing a problem is always cheaper than curing it, especially when "curing" a merger means unwinding combined operations — a process that is practically impossible and never attempted.

**The insight.** The 210-day deemed-approval rule is a regulatory innovation. It balances the CCI's need for time to conduct a thorough review against the parties' legitimate commercial interest in deal certainty. A merger involves financing, employment decisions, customer commitments, and market expectations — indefinite regulatory uncertainty can destroy value even if the merger is ultimately approved. The 210-day clock forces the CCI to prioritise and decide, while the parties know they will have an answer, one way or another, within seven months.

**The walk-through.** In **PVR/INOX merger** (2022), the CCI reviewed the combination of India's two largest multiplex chains. The combined entity would have approximately 1,500+ screens across India, raising concerns about dominance in film exhibition in specific cities. The CCI approved the combination after analysing city-level market shares and concluding that: (a) sufficient competition existed from regional multiplex chains, single-screen theatres, and OTT platforms; (b) film distributors had countervailing bargaining power; and (c) entry barriers for new multiplex developers were moderate. The case illustrates a sophisticated geographic-market analysis — national market shares might have triggered concerns, but city-by-city analysis showed competition was preserved in most relevant geographic markets.

**The thread.** The CCI's orders — against agreements, dominance, and combinations — need someone to gather the evidence that informs them. That someone is the Director General, the CCI's investigative arm. The next chapter is dedicated to the DG's role, powers, and duties — the machinery that turns suspicion into proof.`,
      questions: [
        {
          kind: "mcq",
          prompt: "If the CCI does not pass any order on a notified combination within 210 days, what is the legal consequence?",
          options: [
            "The combination is automatically blocked.",
            "The parties must re-file their notification.",
            "The combination is deemed to be approved.",
            "The case is transferred to the Supreme Court."
          ],
          correct_index: 2,
          model_answer: "Section 31(11) states that if no order is passed within 210 days, the combination is deemed approved (a mechanism to ensure regulatory certainty).",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "When the CCI finds that a merger raises competitive concerns, its only legal option is to block the transaction completely.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The CCI has the option to 'approve with modifications' — imposing structural (selling off assets) or behavioral conditions to fix the competitive concerns without killing the deal.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Why is the 210-day 'deemed approval' rule considered a crucial regulatory innovation for mergers?",
          model_answer: "Mergers involve financing, jobs, and market expectations. Indefinite regulatory limbo can destroy a deal's value even if it is eventually approved. The 210-day clock forces the CCI to decide quickly, guaranteeing companies commercial deal certainty.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "What are the three broad options the CCI has when reviewing a combination under Section 31?",
          model_answer: "Approve, Approve with modifications, or Block.",
          difficulty: "basic",
        }
      ],
      facts: [
        "To protect companies from endless government delays, the Competition Act includes a 'ticking clock': if the CCI doesn't decide on a merger within 210 days, the merger is automatically approved by law.",
      ],
    },
  ],
};
