import type { CompActChapter } from "../types";

/** Chapter 5 — Competition Commission of India: the institution. */
export const competitionCommission: CompActChapter = {
  slug: "competition-commission",
  title: "Competition Commission of India",
  chapter: 5,
  tagline: "The regulator itself — its establishment, composition, and the governance framework that gives it teeth.",
  color: "#a78bfa",
  prereqs: ["combinations"],
  unlocks: ["inquiry-powers"],
  intro: `The Competition Act's prohibitions — against cartels, abuse of dominance, anti-competitive mergers — are only as effective as the institution that enforces them. Chapter III of the Act (Sections 7–17) establishes that institution: the **Competition Commission of India (CCI)**. It is a quasi-judicial body — part regulator, part tribunal — with the power to investigate, adjudicate, and penalise. Its design reflects lessons learned from the old MRTP Commission, which was widely criticised as toothless, slow, and structurally inadequate for a liberalising economy.

The CCI is not a court, though it functions like one in some respects. It can receive complaints ("information" in the Act's terminology), order investigations, summon witnesses, compel production of documents, and impose penalties running into thousands of crores. Its orders are enforceable as court decrees. But it also performs non-adversarial functions: reviewing merger notifications, issuing opinions to government bodies, conducting competition advocacy, and publishing studies on market conditions.

This dual character — adjudicator and advocate — is deliberate. Competition law in a young market economy cannot rely on enforcement alone. It must also *educate*: businesses need to understand what conduct is prohibited, government agencies need to understand how their policies affect competition, and courts need a specialist body that can bring economic expertise to legal questions. The CCI performs all three roles.

The three sections ahead cover the CCI's establishment and composition, the appointment process and governance structure, and its administrative powers that enable it to function as an independent regulator.`,
  sections: [
    {
      slug: "establishment-composition",
      title: "Establishment & Composition",
      sectionNumber: "§7–8",
      importance: "Foundation",
      summary: "How the CCI is constituted — a Chairperson and up to six Members, their qualifications, and what makes it quasi-judicial.",
      body: `**The provision.** Section 7 establishes the Competition Commission of India with effect from such date as the Central Government may notify. Section 8 provides that the CCI shall consist of a **Chairperson** and not less than **two** and not more than **six other Members** to be appointed by the Central Government. The Chairperson and Members must be persons of ability, integrity, and standing who have been, or are qualified to be, judges of a High Court, or have special knowledge of, and professional experience of not less than fifteen years in, international trade, economics, business, commerce, law, finance, accountancy, management, industry, public affairs, or administration.

**Why it matters.** The composition rules are designed to ensure the CCI has both legal and economic expertise — a critical requirement because competition law is neither pure law nor pure economics, but a fusion of both. A cartel case requires evidentiary analysis (legal) and understanding of oligopoly pricing (economic). A merger review requires reading corporate documents (legal) and modelling market concentration (economic). By requiring Members to have deep expertise in fields like economics, commerce, or trade, the Act ensures the CCI is not just a group of lawyers or just a group of economists, but a multidisciplinary body.

**The insight.** The CCI is deliberately designed as a *body*, not a single regulator. Unlike some agencies headed by a single director, the CCI decides cases through benches — typically of two or three Members — deliberating collectively. This collegial structure builds in checks against arbitrary decision-making and ensures that multiple perspectives (legal, economic, industry) inform each order. The Chairperson has administrative primacy (constituting benches, assigning cases) but not decisional primacy — each Member's vote on a bench counts equally.

**The walk-through.** The first CCI Chairperson, Dhanendra Kumar, took office in 2009. Under his and successive Chairpersons' leadership, the CCI evolved from an untested institution into one of the most active competition regulators in Asia. The Commission today operates with a full bench, a dedicated economics division, a law division, and a Director General's office for investigations. Its annual report for 2022–23 recorded over 60 new cases and 15 combination approvals, with penalties exceeding ₹3,000 crores imposed across cartel and abuse-of-dominance cases.

**The thread.** Establishment and composition tell you *who* sits on the CCI. But how are they appointed, how long do they serve, and what rules prevent political capture? The governance framework — appointment process, tenure, removal safeguards — is the next section.`,
      questions: [
        {
          kind: "mcq",
          prompt: "The Competition Commission of India (CCI) consists of a Chairperson and how many other Members?",
          options: [
            "Exactly three other members.",
            "Not less than two and not more than six other members.",
            "Ten other members.",
            "Only one other member."
          ],
          correct_index: 1,
          model_answer: "Section 8 specifies a Chairperson and between two to six other Members appointed by the Central Government.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The CCI functions solely as a court to penalise offenders and has no role in educating businesses or advising the government.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The CCI has a deliberate dual character: it is an adjudicator (penalising cartels) and an advocate (educating businesses, issuing policy opinions).",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Why does the Act require CCI Members to have expertise in fields like economics or business, rather than restricting membership exclusively to former judges or lawyers?",
          model_answer: "Competition law is a fusion of law and economics. Assessing a cartel or a merger requires legal evidentiary analysis combined with complex economic modelling (e.g., market concentration, oligopoly pricing). A multidisciplinary body ensures decisions are grounded in both legal process and market reality.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "What type of body is the CCI described as?",
          model_answer: "A quasi-judicial body (part regulator, part tribunal).",
          difficulty: "basic",
        }
      ],
      facts: [
        "The CCI is a 'quasi-judicial' body — meaning it functions like a court (it can impose thousand-crore fines) but also acts as an active regulator and policy advocate.",
      ],
    },
    {
      slug: "appointment-governance",
      title: "Appointment, Tenure & Governance",
      sectionNumber: "§9–11",
      importance: "Foundation",
      summary: "How Members are selected, their tenure and removal protections, and the safeguards that preserve CCI independence.",
      body: `**The provision.** Section 9 provides for a **Selection Committee** to recommend appointments to the CCI, consisting of: (a) the Chief Justice of India or a nominee (Chairperson), (b) the Secretary of the Ministry of Corporate Affairs, (c) the Secretary of the Ministry of Law and Justice, and (d) two experts nominated by the Central Government. Section 10 sets the tenure: the Chairperson and Members hold office for a term of **five years** or until the age of sixty-five, whichever is earlier, and are **not eligible for reappointment**. Section 11 provides for removal: a Member can be removed only by an order of the Central Government on the ground of proved misbehaviour or incapacity, after an inquiry by a sitting Supreme Court Judge.

**Why it matters.** Independence is the oxygen of a competition regulator. If CCI Members can be removed at political will, or if their reappointment depends on government favour, they will hesitate to take on government-owned enterprises (Coal India, Indian Railways, state telecom operators) or politically connected businesses. The Act's governance framework is designed to insulate the CCI from exactly this pressure: a multi-stakeholder Selection Committee (not the government alone) recommends appointments; a fixed five-year term with no reappointment removes the incentive to curry favour for renewal; and removal requires a Supreme Court–level inquiry, not a ministerial signature.

**The insight.** The "no reappointment" rule is the single most important governance provision. Regulators around the world are susceptible to what economists call "capture" — where the regulator begins to serve the interests of the industry it regulates, or the government that appointed it, rather than the public interest. A five-year non-renewable term means CCI Members have no career incentive to please anyone — they cannot be rewarded with a second term for being lenient, nor punished by non-renewal for being aggressive. This structural independence is what enables orders like the ₹6,307-crore cement cartel penalty or the ₹1,337-crore Google penalty.

**The walk-through.** The Selection Committee process was tested when the government sought to appoint a new Chairperson in 2022. The Committee — chaired by the Chief Justice's nominee, with secretaries from two ministries and two domain experts — reviewed candidates with experience in competition law, economics, and public administration. The process, while not without criticism (some argued the expert nominations gave the government too much influence), represents a significant improvement over the old MRTP Commission, where the Chairperson was essentially a government appointee with no structural independence.

**The thread.** Governance is the framework; now for the machinery. The CCI has specific administrative powers — managing finances, hiring staff, delegating functions — that enable it to operate as a functioning institution. These administrative powers, covered in the remaining sections of Chapter III, complete the picture of the CCI as an institution. But for the reader walking through this Act linearly, the more important story is what the CCI *does* with its powers — which is the subject of the next chapter: Inquiry & Investigation Powers.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How long is the tenure of the CCI Chairperson and Members?",
          options: [
            "Three years or until age 60.",
            "Five years or until age 65, whichever is earlier.",
            "Ten years.",
            "Life tenure."
          ],
          correct_index: 1,
          model_answer: "Section 10 sets the tenure at five years or until the age of 65, whichever is earlier.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "CCI Members can be reappointed for a second five-year term if they perform well and the government approves.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The Act explicitly makes them not eligible for reappointment, a crucial safeguard to protect their independence.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Explain how the 'no reappointment' rule protects the CCI from regulatory capture.",
          model_answer: "If Members could be reappointed, they would have a career incentive to please the government or the industries they regulate to secure a second term. The non-renewable term ensures they can take aggressive action (like massive penalties on state monopolies) without fear of being 'punished' by non-renewal.",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "Which of the following individuals are part of the Selection Committee that recommends appointments to the CCI under Section 9? Select all that apply.",
          options: [
            "The Chief Justice of India (or a nominee)",
            "The Secretary of the Ministry of Corporate Affairs",
            "The Prime Minister of India",
            "The Secretary of the Ministry of Law and Justice",
            "The Governor of the Reserve Bank of India"
          ],
          correct_indices: [0, 1, 3],
          model_answer: "The committee consists of the CJI/nominee, MCA Secretary, Law Secretary, and two domain experts nominated by the Central Government. The PM and RBI Governor are not members.",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "To keep the CCI independent and fearless, its Members are given a strict 5-year term with absolutely no option for reappointment, ensuring they have no incentive to curry favor for a second term.",
      ],
    },
    {
      slug: "administrative-powers",
      title: "Administrative & Regulatory Powers",
      sectionNumber: "§12–17",
      importance: "Advanced",
      summary: "Salaries, meetings, vacancies, and delegated powers — the operational machinery that keeps the CCI running.",
      body: `**The provision.** Sections 12–17 address the operational machinery of the CCI:

- **Section 12**: Salary, allowances, and terms of service of the Chairperson and Members, as prescribed by the Central Government.
- **Section 13**: Procedure for CCI meetings, quorum requirements, and decision-making.
- **Section 14**: Provisions for handling vacancies — acts of the CCI are not invalidated merely because of a vacancy or defect in its constitution.
- **Section 15**: Restrictions on Members holding any other office of profit during their tenure.
- **Section 16**: Power of the CCI to make its own regulations, subject to consistency with the Act and the rules.
- **Section 17**: Power of the Chairperson to constitute benches of two or more Members and to transfer proceedings between benches.

**Why it matters.** These sections may seem administrative, but they are the nuts and bolts that keep the institution functional. Section 14 is particularly important in practice: it prevents parties from challenging CCI orders on the ground that a Member position was temporarily vacant — a tactic that could otherwise be used to delay enforcement indefinitely. Section 17's bench-constitution power allows the Chairperson to manage caseload efficiently, assigning complex merger reviews to Members with industry expertise and cartel cases to Members with enforcement experience.

**The insight.** Section 16 — the regulation-making power — is the source of the CCI's procedural autonomy. The CCI has used this power to issue regulations on: (a) the form and procedure for filing information (complaints), (b) the process for combination notification (including the Green Channel), (c) the procedure for imposing lesser penalties on cooperating cartelists (leniency), and (d) the process for settlement and commitment in abuse-of-dominance cases. These regulations are where the Act's broad principles are translated into specific, workable procedures.

**The walk-through.** The CCI's Combination Regulations (2011, amended 2016, 2019, and 2023) illustrate how Section 16 works in practice. The Act says combinations above certain thresholds must be notified and reviewed — but the Act does not specify the notification form, the timeline for CCI response, the information the parties must provide, or the conditions for the Green Channel. All of this is in the regulations. A lawyer advising a company on a merger deal spends more time with the Combination Regulations than with the Act itself — the regulations are the operating manual.

**The thread.** The CCI is now fully constituted — members appointed, governance in place, administrative machinery operational. The next chapter enters the CCI's core function: how it receives complaints, initiates inquiries, conducts investigations, and arrives at orders. This is where the Act moves from institutional architecture to enforcement action.`,
      questions: [
        {
          kind: "truefalse",
          prompt: "If a Member position at the CCI is temporarily vacant, any orders passed by the CCI during that period are legally invalid.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 14 explicitly states that acts of the CCI are not invalidated merely because of a vacancy or defect in its constitution, preventing parties from using vacancies to delay enforcement.",
          difficulty: "basic",
        },
        {
          kind: "mcq",
          prompt: "Under Section 16, the CCI has the power to make its own regulations. Which of the following is typically governed by these regulations rather than the text of the Act itself?",
          options: [
            "The maximum penalty amount for a cartel.",
            "The definition of 'dominant position'.",
            "The detailed procedure for combination notification and the Green Channel.",
            "The tenure of the Chairperson."
          ],
          correct_index: 2,
          model_answer: "Procedural details — like the notification forms, Green Channel rules, and leniency procedures — are established via CCI regulations under Section 16, while substantive definitions and limits are in the Act.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Why is the Chairperson's power to constitute benches (Section 17) practically important for the CCI's functioning?",
          model_answer: "It allows the Chairperson to manage the caseload efficiently by matching cases to expertise. For example, a complex merger review can be assigned to a bench with deep economic expertise, while a cartel enforcement action can go to Members with stronger legal/evidentiary backgrounds.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "Can a CCI Member legally hold another office of profit (like a corporate directorship) during their tenure?",
          model_answer: "No, Section 15 restricts Members from holding any other office of profit.",
          difficulty: "basic",
        }
      ],
      facts: [
        "Most of the day-to-day procedural rules — like how to file a merger or get leniency — aren't in the Competition Act itself; they are in regulations written by the CCI using its Section 16 powers.",
      ],
    },
  ],
};
