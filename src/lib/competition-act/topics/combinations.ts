import type { CompActChapter } from "../types";

/** Chapter 4 — Regulation of Combinations: the CCI as gatekeeper for mergers. */
export const combinations: CompActChapter = {
  slug: "combinations",
  title: "Regulation of Combinations",
  chapter: 4,
  tagline: "Mergers, acquisitions, and amalgamations — the CCI as gatekeeper before market power is created.",
  color: "#43d6b5",
  prereqs: ["abuse-of-dominance"],
  unlocks: ["competition-commission"],
  intro: `Sections 3 and 4 are reactive — they punish anti-competitive conduct after it occurs. Section 5 and 6 are *proactive*. They give the CCI the power to review mergers, acquisitions, and amalgamations *before they are consummated*, and to block or modify them if they would cause or are likely to cause an appreciable adverse effect on competition (AAEC) in India. This is the "combination regulation" regime, and it exists because the most durable competitive harm often comes not from secret agreements or predatory pricing, but from the permanent *structural* change that occurs when competitors merge.

The logic is simple: it is better to prevent a monopoly from forming than to regulate its behaviour after it forms. Sections 3 and 4 are the cure; Sections 5 and 6 are the vaccine.

The architecture of the combination regime has three moving parts: (1) **thresholds** — Section 5 defines when a transaction is large enough to require CCI notification; (2) **notification** — Section 6 requires parties to notify the CCI before (or within a short window after) completing a qualifying transaction; and (3) **review** — the CCI assesses whether the combination would cause an AAEC, considering market shares, competitive effects, efficiencies, and entry barriers. If the CCI approves, the deal closes; if it objects, the parties may offer remedies (modifications), or the CCI may block the deal entirely.

India's combination regime is relatively young — it became operational only in 2011 — but the CCI has reviewed over 900 combinations and blocked or imposed modifications on several significant ones. The 2023 amendment introduced a "deal value threshold" to catch acquisitions in the digital economy where the target has low turnover but high competitive significance (think: acquiring a startup with millions of users but almost no revenue).`,
  sections: [
    {
      slug: "thresholds",
      title: "Combination Thresholds",
      sectionNumber: "§5",
      importance: "Core",
      summary: "When a merger is big enough to need CCI review — the asset, turnover, and deal-value thresholds.",
      body: `**The provision.** Section 5 defines a "combination" as an acquisition, merger, or amalgamation that meets specified thresholds based on the assets or turnover of the parties. The thresholds operate at two levels:

**Enterprise level** (the target alone): Assets exceeding ₹2,000 crores in India (or $1 billion globally including at least ₹1,000 crores in India), *or* turnover exceeding ₹6,000 crores in India (or $3 billion globally including at least ₹3,000 crores in India).

**Group level** (the acquiring group): Assets exceeding ₹8,000 crores in India (or $4 billion globally including at least ₹1,000 crores in India), *or* turnover exceeding ₹24,000 crores in India (or $12 billion globally including at least ₹3,000 crores in India).

The 2023 amendment added a **deal-value threshold**: any transaction where the value of the transaction exceeds ₹2,000 crores *and* the target entity has "substantial business operations in India" triggers notification, regardless of asset or turnover size.

**Why it matters.** Thresholds are the filter that prevents the CCI from being overwhelmed. Most M&A activity is competitively harmless — a small company buying another small company, private equity portfolio reshuffling, internal corporate restructuring. The thresholds ensure the CCI reviews only transactions large enough to plausibly affect national or sub-national competition. But the thresholds must also be *low enough* to catch transactions that matter, which is why the deal-value threshold was added: in the digital economy, a platform acquiring a rival with 100 million users but ₹50 crores in revenue might fly under the traditional asset/turnover thresholds despite being enormously significant.

**The insight.** The deal-value threshold is India's response to the "killer acquisition" problem — where a dominant tech firm acquires a nascent competitor not to build on its product, but to *eliminate* it before it becomes a threat. Facebook's acquisition of WhatsApp (2014) and Google's acquisition of Waze (2013) are global examples that drove many jurisdictions, including India, to rethink purely financial thresholds. The ₹2,000 crore deal-value trigger is designed to net exactly these kinds of transactions.

**The walk-through.** When Zomato acquired Blinkit (then Grofers) in 2022, the transaction crossed the enterprise-level threshold on assets. Zomato filed a notification with the CCI. The CCI assessed whether the combination of a food-delivery platform with a quick-commerce platform would create dominance in any relevant market. After examining overlaps and the competitive landscape (Swiggy Instamart, BigBasket, and others remained active), the CCI approved the combination unconditionally. Not every large deal raises concerns — but every large deal must be examined.

**The thread.** Crossing the threshold triggers an obligation: the parties must *notify* the CCI and wait for approval. The notification process — timing, forms, green channels, and what happens during the waiting period — is the next section.`,
    },
    {
      slug: "notification-process",
      title: "Notification & Standstill Obligation",
      sectionNumber: "§6(2)–(2A)",
      importance: "Core",
      summary: "How and when parties must notify the CCI, the standstill period, and the green-channel route for non-overlapping mergers.",
      body: `**The provision.** Section 6(2) requires the parties to a combination to give notice to the CCI in the specified form, disclosing the details of the proposed combination, *within 30 days* of: (a) approval of the proposal by the board of directors (in case of a merger/amalgamation); (b) execution of any agreement or other document for acquisition.

Section 6(2A) imposes a **standstill obligation**: the combination shall not come into effect until the CCI has passed an order or 210 days have elapsed from the date of notification, whichever is earlier (the "deemed approval" rule).

The CCI's Green Channel route (introduced via regulation in 2019) allows combinations where there is *no* horizontal, vertical, or complementary overlap between the parties to be automatically approved upon filing — no review period required.

**Why it matters.** The standstill obligation is the CCI's enforcement lever. Without it, parties could rush to close a transaction, comingle operations, and present the CCI with a fait accompli: "the merger is already done, undoing it would be impractical." The standstill prevents this by making implementation before approval a violation punishable with penalties. The 210-day deemed-approval window protects deal certainty — parties know that even in the worst case, the CCI cannot hold a transaction in limbo indefinitely.

**The insight.** The Green Channel is a smart regulatory design. Most notified combinations are competitively harmless — companies in entirely different markets merging (a steel company acquiring a software firm). The Green Channel lets these pass instantly, freeing CCI resources for the combinations that actually raise competitive concerns. The parties self-certify that no overlaps exist; if the certification turns out to be false, the Green Channel approval can be revoked and penalties imposed.

**The walk-through.** When Adani Group acquired Ambuja Cements and ACC in 2022 — one of the largest M&A transactions in Indian corporate history — the parties notified the CCI under Section 6(2). Because both Adani (through Adani Enterprises) and Ambuja/ACC operated in the cement market, the Green Channel was not available (horizontal overlap existed). The CCI reviewed the combination over several months, assessed market shares in regional cement markets across India, and ultimately approved the transaction after determining that sufficient competition remained post-merger from UltraTech, Shree Cement, and others. The standstill obligation ensured that the transaction did not close until the CCI was satisfied.

**The thread.** Once the CCI receives a notification, it must *assess* whether the combination would cause an AAEC. The assessment framework — market shares, competitive effects, efficiencies, failing-firm defence — is the next section, and it determines whether the CCI approves, modifies, or blocks the deal.`,
    },
    {
      slug: "cci-review",
      title: "CCI Review of Combinations",
      sectionNumber: "§6(1), §20(4), §31",
      importance: "Core",
      summary: "How the CCI assesses mergers — the AAEC test for combinations, remedies, and the power to block deals.",
      body: `**The provision.** Section 6(1) provides that no combination which causes or is likely to cause an AAEC within the relevant market in India shall be allowed. Section 20(4) lists the factors the CCI considers when assessing a combination's competitive impact:

(a) Actual and potential competition in the market.
(b) Barriers to entry.
(c) The degree of countervailing power in the market.
(d) The likelihood that the combination would substantially reduce competition through the creation or strengthening of a dominant position.
(e) Market shares and extent of concentration.
(f) The likelihood of the combination removing a vigorous and effective competitor.
(g) The nature and extent of vertical integration.
(h) Whether benefits of the combination outweigh the adverse impact (efficiency defence).
(i) Whether the combination is needed for a "failing firm" or division thereof.
(j) The nature of ownership of the entities.
(k) The nature of the market and any other relevant factor.

Under Section 31, the CCI may: (a) approve the combination; (b) approve with modifications (conditions/remedies); or (c) direct that the combination shall not take effect (block).

**Why it matters.** The Section 20(4) framework is the *merger-specific* version of the AAEC test you saw for agreements. But merger review has additional dimensions: you must predict the *future* state of competition, not just assess the present. Will the merged entity raise prices? Will competitors expand to fill the gap? Will entry barriers prevent new competitors from entering? Will efficiencies from the merger — cost savings, better distribution, innovation — benefit consumers enough to offset any reduction in competition? These are predictive questions, and the CCI must answer them before the merger happens.

**The insight.** The two most powerful analytical tools in merger review are: (1) the **market-concentration test** — typically measured using the Herfindahl-Hirschman Index (HHI), which sums the squares of market shares; a merger that pushes the HHI above 2,500 with a delta (change) above 200 raises serious concerns; and (2) the **failing-firm defence** — if the target company is genuinely failing (insolvent, no alternative buyer, assets would exit the market without the merger), the CCI may approve even a competitively concerning combination because the alternative is worse (losing those assets entirely).

**The walk-through.** In the **Holcim/Lafarge** cement merger (2015, global transaction with Indian operations), the CCI required the merged entity to divest certain cement plants in regions where the combined market share would have exceeded competitive thresholds. The CCI did not block the merger outright — it modified it. The divested plants were sold to Birla Corporation, creating a new competitor to replace the competition lost through the merger. This "structural remedy" is the CCI's preferred approach: rather than blocking socially valuable transactions, modify them to preserve competition. The Holcim/Lafarge case established the CCI as a credible and sophisticated merger reviewer.

**The thread.** You have now covered the Act's three substantive pillars: agreements, dominance, and combinations. The next chapter shifts from *what the law prohibits* to *who enforces it* — the Competition Commission of India itself. Understanding the institution, its composition, and its powers is essential because the CCI's effectiveness determines whether the prohibitions you have just learned are paper rules or living law.`,
    },
  ],
};
