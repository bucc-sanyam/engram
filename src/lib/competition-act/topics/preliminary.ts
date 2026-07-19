import type { CompActChapter } from "../types";

/** Chapter 1 — Preliminary & Definitions: the vocabulary of competition law. */
export const preliminary: CompActChapter = {
  slug: "preliminary",
  title: "Preliminary & Definitions",
  chapter: 1,
  tagline: "The vocabulary of competition law — every term the rest of the Act assumes you know.",
  color: "#5ba4cf",
  prereqs: [],
  unlocks: ["anti-competitive-agreements"],
  intro: `Every body of law begins with a glossary, and competition law's glossary is unusually important because the words it defines — "enterprise," "consumer," "relevant market," "agreement" — are deliberately wider than everyday English. The Competition Act, 2002 replaced the old Monopolies and Restrictive Trade Practices Act of 1969, born in an era of licence-raj suspicion toward bigness itself. The new law does not punish size; it punishes *conduct*. That philosophical pivot — from structure to behaviour — is the single idea that explains everything else in the statute, and it lives right here, in the definitions.

Understanding Section 2 is not a formality. When a future chapter asks whether a cartel "agreement" existed, Section 2(b) tells you that an agreement need not be written — it can be inferred from an "arrangement or understanding or action in concert." When a chapter on dominance asks what "market" a firm dominates, Section 2(r) defines the "relevant market" by geography and product substitutability. When the CCI orders a penalty on an "enterprise," Section 2(h) tells you that even a single individual acting as a business counts.

Read these definitions carefully. They are the load-bearing walls of the building. Every section of the Act that follows leans on at least one of them, and the definitions are where most examination questions and courtroom arguments begin — because if a party falls outside the definition, the prohibition does not apply at all.`,
  sections: [
    {
      slug: "scope-and-application",
      title: "Scope & Application of the Act",
      sectionNumber: "§1",
      importance: "Foundation",
      summary: "Where, when, and to whom the Competition Act applies — its territorial reach and commencement story.",
      body: `**The provision.** Section 1 gives the Act its name — the Competition Act, 2002 — and declares that it extends to the whole of India. It also records that different provisions of the Act were brought into force on different dates, a staggered commencement that reflected political and institutional readiness: the Act was passed in January 2003 but the Competition Commission was not fully operational until 2009.

**Why it matters.** Territorial scope sounds routine until you ask: does the Act reach conduct that happens *outside* India but hurts competition *inside* India? The answer, refined by amendments and case law, is yes — the CCI has investigated international cartels (the global vitamins cartel, for instance) whose price-fixing rippled into Indian markets. The Act's jurisdiction is effects-based: if the anti-competitive impact lands here, the CCI can act, regardless of where the conspiracy was hatched.

**The insight.** The staggered commencement is itself instructive. Parliament understood that a competition regulator needs institutional scaffolding — trained staff, investigation protocols, an appellate mechanism — before it can credibly enforce. The old MRTP Commission's failings were partly about inadequate infrastructure, not just inadequate law. Section 1 is the Act's way of acknowledging that law on paper and law in practice are different things, and that a phased rollout protects credibility.

**The walk-through.** Consider an Indian cement buyer who suspects a cartel formed at a meeting in Singapore. Section 1's reach, combined with Section 32 (which gives the CCI explicit extra-territorial jurisdiction over conduct affecting Indian markets), means the buyer can file an information complaint with the CCI. The meeting's location does not shield the cartelists — only the *effect* on Indian competition matters.

**The thread.** Scope tells you who is inside the statute. But to operate the statute, you need the vocabulary it uses for everything it regulates. Section 2, next, is that vocabulary — and the width of its definitions is where the Act's real power hides.`,
      questions: [
        {
          kind: "open",
          prompt: "Explain what it means to say the Competition Act's jurisdiction is 'effects-based', and why that matters for conduct hatched outside India.",
          model_answer: "Effects-based jurisdiction means the Act reaches anti-competitive conduct by where its impact lands, not where it was planned. Combined with Section 32's explicit extra-territorial reach, the CCI can investigate a cartel formed abroad (e.g. the global vitamins cartel) so long as it harmed competition inside India. The location of the conspiracy is irrelevant; only the effect on Indian markets is.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "The Competition Act, 2002 came fully into force on the day it was passed.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The Act was passed in 2003 but its provisions were brought into force on staggered dates; the CCI was not fully operational until 2009. The phased commencement gave the regulator time to build institutional scaffolding.",
          difficulty: "basic",
        },
        {
          kind: "mcq",
          prompt: "Which statute did the Competition Act, 2002 replace?",
          options: [
            "The Consumer Protection Act, 1986",
            "The Monopolies and Restrictive Trade Practices Act, 1969",
            "The Companies Act, 1956",
            "The Foreign Exchange Regulation Act, 1973",
          ],
          correct_index: 1,
          model_answer: "The MRTP Act, 1969 — a licence-raj era law suspicious of bigness itself. The Competition Act pivoted from punishing structure (size) to punishing conduct (behaviour).",
          difficulty: "basic",
        },
        {
          kind: "quickfire",
          prompt: "In one line: what is the single philosophical pivot from the MRTP Act to the Competition Act?",
          model_answer: "From punishing structure (size/monopoly itself) to punishing conduct (anti-competitive behaviour).",
          difficulty: "basic",
        },
      ],
      facts: [
        "The Competition Act, 2002 doesn't punish being big — it punishes anti-competitive conduct. That shift from structure to behaviour is the idea the whole statute is built on.",
      ],
    },
    {
      slug: "key-definitions",
      title: "Key Definitions",
      sectionNumber: "§2",
      importance: "Foundation",
      summary: "The 28 definitions that power the entire Act — enterprise, agreement, relevant market, consumer, and more.",
      body: `**The provision.** Section 2 contains 28 defined terms, lettered (a) through (y), plus sub-clauses. Every subsequent section of the Act borrows from this glossary. The most consequential definitions are:

- **(b) "agreement"** — includes any arrangement, understanding, or action in concert, whether formal or informal, written or oral.
- **(h) "enterprise"** — any person or department of Government engaged in any activity relating to production, storage, supply, distribution, acquisition, or control of goods, or provision of services. Crucially, even a single individual qualifies if acting commercially.
- **(r) "relevant market"** — the market determined by the CCI with reference to the relevant product market and the relevant geographic market.
- **(s) "relevant geographic market"** — an area where competitive conditions are homogeneous and distinguishable from neighbouring areas.
- **(t) "relevant product market"** — products or services that are substitutable from the consumer's perspective (demand-side) and from the producer's perspective (supply-side).
- **(f) "consumer"** — anyone who buys or receives goods or services for consideration, including the users of such goods or services.

**Why it matters.** The breadth of "agreement" is the Act's sharpest weapon. An agreement need not be a signed contract. A WhatsApp message, a nod at a trade-association dinner, parallel pricing that cannot be explained by market forces — all can constitute an "agreement" if they evidence concerted action. This expansive definition is what allows the CCI to tackle tacit collusion, which is the form most modern cartels take.

**The insight.** The definition of "relevant market" is the analytical foundation of both the dominance chapter and the combinations chapter. You cannot say a firm is "dominant" without first defining the market in which it dominates. Get the market definition wrong — too narrow, and every firm looks dominant; too wide, and no firm does — and the entire analysis collapses. The CCI determines the relevant market by asking two questions: (1) can consumers switch to a substitute? (demand-side substitutability) and (2) can other producers switch to making this product? (supply-side substitutability). These are not abstract tests; they are the *first* step the CCI takes in every dominance and merger inquiry.

**The walk-through.** When the CCI investigated Google for alleged abuse of dominance in the online search market, the first hundred pages of the order were about market definition. Google argued the relevant market included all forms of advertising (print, TV, digital); the CCI drew it as "online general web search" in India — a far narrower market in which Google's share exceeded 90%. The dominance finding, and the entire penalty, rested on that definitional choice. Section 2(r), (s), and (t) are the legal tools that made the choice possible.

**The thread.** You now have the entire vocabulary. Next chapter, the Act stops defining and starts *prohibiting*. Section 3, Anti-Competitive Agreements, is the Act's most-litigated provision, and it uses nearly every definition you have just learned — "agreement," "enterprise," "relevant market" — as load-bearing inputs. The definitions were the foundations; the prohibitions are the building.`,
      questions: [
        {
          kind: "open",
          prompt: "Why is Section 2(b)'s definition of 'agreement' described as the Act's sharpest weapon? Give an example of what can count as an agreement.",
          model_answer: "Because 'agreement' needs no signed contract — it includes any arrangement, understanding, or action in concert, whether written or oral, formal or informal. A WhatsApp message, a nod at a trade-association dinner, or unexplained parallel pricing can all evidence concerted action. This breadth lets the CCI reach tacit collusion, the form most modern cartels take.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Explain the two-sided test the CCI uses to define a 'relevant product market', and why getting market definition wrong collapses the whole analysis.",
          model_answer: "The CCI asks (1) demand-side substitutability — can consumers switch to a substitute? — and (2) supply-side substitutability — can other producers switch to making this product? Market definition is the first step of every dominance and merger inquiry: draw it too narrow and every firm looks dominant; too wide and none does. In the Google case the CCI defined the market as 'online general web search in India' (>90% share), and the entire dominance finding rested on that definitional choice.",
          difficulty: "advanced",
        },
        {
          kind: "truefalse",
          prompt: "Under the Act, a single individual can never be an 'enterprise'.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 2(h) defines 'enterprise' broadly — even a single individual qualifies if acting commercially (engaged in production, supply, distribution, services, etc.), and it can include a department of Government.",
          difficulty: "basic",
        },
        {
          kind: "multi",
          prompt: "Which of the following are needed to establish that a firm is 'dominant' in a market? Select all that apply.",
          options: [
            "First defining the relevant market (product + geographic)",
            "Demand-side and supply-side substitutability analysis",
            "Proof that the firm is the largest by revenue nationwide",
            "A signed written agreement between competitors",
          ],
          correct_indices: [0, 1],
          model_answer: "Defining the relevant market (via demand- and supply-side substitutability) is the prerequisite to any dominance finding. Nationwide size and a written agreement are not required — dominance is assessed within the defined relevant market, and agreements belong to Section 3, not dominance.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "Which section number defines 'relevant market'?",
          model_answer: "Section 2(r) — with 2(s) (relevant geographic market) and 2(t) (relevant product market) refining it.",
          difficulty: "intermediate",
        },
      ],
      facts: [
        "Under the Competition Act an 'agreement' need not be written — a nod at a dinner or unexplained parallel pricing can count. That's how regulators reach cartels that never signed anything.",
        "When the CCI fined Google, the first ~100 pages were just about defining the market. Google wanted 'all advertising'; the CCI drew 'online web search in India', where Google held over 90%.",
      ],
    },
  ],
};
