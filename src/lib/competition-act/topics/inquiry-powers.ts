import type { CompActChapter } from "../types";

/** Chapter 6 — Inquiry & Investigation Powers: how the CCI acts on complaints. */
export const inquiryPowers: CompActChapter = {
  slug: "inquiry-powers",
  title: "Inquiry & Investigation Powers",
  chapter: 6,
  tagline: "How complaints become investigations — the CCI's procedure from information to prima facie order.",
  color: "#e8927c",
  prereqs: ["competition-commission"],
  unlocks: ["orders-and-remedies"],
  intro: `The CCI's enforcement process begins with a question: *how does a case get started?* The answer is in Chapter IV (Sections 18–33) of the Act, which lays out the CCI's duties, the triggers for inquiry, the investigation process, and the procedural safeguards that ensure fairness. This chapter of the story covers the front half of that procedure — from complaint to investigation — while the next chapter covers the back half — orders, remedies, and outcomes.

The CCI can act on three triggers: (1) an "information" filed by any person — not just the victim of anti-competitive conduct, but anyone, including consumers, competitors, trade associations, or even a law student; (2) a reference from the Central or State Government, or a statutory authority; and (3) the CCI's own knowledge or information (suo motu). This expansive standing is deliberate: competition harm is often diffuse, suffered by millions of consumers who individually lack the incentive or resources to complain. By allowing *anyone* to file and by empowering its own suo motu jurisdiction, the Act ensures that enforcement does not depend on the victim being both aware and motivated.

Once information is received, the CCI makes a "prima facie" assessment: is there a reasonable basis to believe that a contravention has occurred? If yes, the CCI directs the Director General (DG) — its investigative arm — to investigate. The DG's investigation report is then shared with the parties, who get a hearing. After the hearing, the CCI passes a final order.

The sections ahead unpack each stage: how inquiries begin, what the DG investigates, the evidentiary tools available, and the interim relief the CCI can grant while a case is pending.`,
  sections: [
    {
      slug: "inquiry-initiation",
      title: "How Inquiries Begin",
      sectionNumber: "§18–19",
      importance: "Core",
      summary: "The CCI's duty to prevent AAEC, the three triggers for inquiry, and the factors it considers before ordering investigation.",
      body: `**The provision.** Section 18 declares the duty of the CCI: "to eliminate practices having adverse effect on competition, promote and sustain competition, protect the interests of consumers, and ensure freedom of trade." This is the CCI's constitutional mission statement.

Section 19 provides that the CCI may inquire into anti-competitive agreements (Section 3) and abuse of dominant position (Section 4) on:
(a) Receipt of **any information** from any person, consumer, or their association or trade association.
(b) A **reference** made to it by the Central Government, a State Government, or a statutory authority.
(c) Its own **knowledge or information** (suo motu).

Section 19(1) further provides that the CCI shall, while determining whether an agreement has an AAEC, have regard to the factors specified in subsections (3), and while determining whether there is abuse of dominant position, have regard to the factors in subsections (4)–(7).

**Why it matters.** The breadth of standing under Section 19 is remarkable. You do not need to be the victim of the anti-competitive conduct to file. A consumer association can file against a cartel that raised cement prices. A competitor can file against a dominant firm's predatory pricing. A journalist can file based on a news report of bid-rigging. Even the CCI itself can initiate proceedings based on information it encounters while reviewing combinations or conducting advocacy studies. This open-door policy maximises the CCI's enforcement reach — competitive harm cannot hide behind the victim's inability or unwillingness to complain.

**The insight.** The "prima facie" stage — where the CCI decides whether to order a DG investigation or close the matter — is the most critical filter in the enforcement pipeline. The CCI receives hundreds of informations each year; not all raise genuine competition concerns. Some are commercial disputes between business rivals disguised as competition complaints. Some allege conduct that is not covered by the Act. The CCI must sift genuine cases from frivolous or misdirected ones without conducting a full investigation at this stage. The prima facie standard is deliberately low — it asks "is there a reasonable basis to suspect a contravention?" rather than "has a contravention been proved?" — because the investigation itself is where proof is gathered.

**The walk-through.** In **Surinder Singh Barmi v. BCCI** (2013), an individual filed information alleging that the Board of Control for Cricket in India (BCCI) was abusing its dominant position in the market for organisation of professional cricket leagues in India. The CCI formed a prima facie opinion that the BCCI's refusal to allow competing cricket leagues (while exclusively organising the IPL) warranted investigation. The DG investigated and confirmed the abuse. The CCI ultimately held that the BCCI, though a private body, was an "enterprise" under the Act and had abused its dominance. The case began with a single individual's complaint — exactly the kind of open-access enforcement Section 19 enables.

**The thread.** A prima facie order sends the case to the Director General for investigation. The investigation process — what the DG can do, what evidence it can compel, and how it reports — is the machinery that turns a suspicion into a case. That is the next section.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Which of the following is NOT a statutory trigger for the CCI to initiate an inquiry under Section 19?",
          options: [
            "Receipt of information from any person",
            "A reference from the Central or State Government",
            "The CCI's own knowledge (suo motu)",
            "A mandate from the United Nations"
          ],
          correct_index: 3,
          model_answer: "The three triggers are: information from any person, government/statutory reference, and suo motu. International mandates are not a trigger.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "To file an 'information' with the CCI, you must prove that you were a direct victim of the anti-competitive conduct.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The Act allows *any* person (including a consumer, competitor, or trade association) to file, because competition harm is often diffuse and victims may lack resources to complain.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Why is the 'prima facie' standard for ordering an investigation deliberately kept low?",
          model_answer: "At the prima facie stage, the CCI only asks 'is there a reasonable basis to suspect a contravention?' rather than demanding full proof. This is because the DG's investigation itself is the mechanism designed to gather the actual proof.",
          difficulty: "intermediate",
        },
        {
          kind: "quickfire",
          prompt: "What does 'suo motu' mean in the context of CCI inquiries?",
          model_answer: "On its own motion — the CCI can initiate an inquiry based on its own knowledge without waiting for a formal complaint.",
          difficulty: "basic",
        }
      ],
      facts: [
        "You don't need to be the victim to report an antitrust violation in India; literally anyone — a consumer, a rival, or a journalist — can file an 'information' with the CCI.",
      ],
    },
    {
      slug: "investigation-process",
      title: "Investigation by the Director General",
      sectionNumber: "§26",
      importance: "Core",
      summary: "The DG's investigation powers — dawn raids, evidence gathering, and the investigation report that frames the final hearing.",
      body: `**The provision.** Section 26 is the procedural backbone of CCI enforcement. Upon forming a prima facie opinion, the CCI directs the Director General to cause an investigation into the matter. The DG submits an investigation report, which the CCI then shares with the parties for their response. The process unfolds in stages:

(1) CCI forms prima facie opinion → directs DG to investigate.
(2) DG investigates → submits report to CCI.
(3) CCI shares the report with the parties concerned.
(4) Parties file objections/responses to the DG report.
(5) CCI hears the parties and the DG.
(6) CCI passes its order.

If the DG recommends that no contravention has occurred, the CCI may disagree and direct further investigation — the DG's recommendation is not binding on the CCI.

**Why it matters.** The DG is the CCI's field force. While the CCI sits in a quasi-judicial capacity — hearing arguments, reading evidence, writing orders — the DG is on the ground: inspecting premises, seizing documents, interviewing witnesses, analysing data. The quality of the CCI's orders depends directly on the quality of the DG's investigation. A sloppy investigation produces weak evidence; weak evidence produces orders that are overturned on appeal.

**The insight.** The 2023 amendment significantly strengthened the DG's investigative toolkit. The DG now has explicit powers for **dawn raids** — unannounced inspections of business premises, including the power to search, seize documents, and make copies. In the digital age, this includes the power to image hard drives, access email servers, and secure electronic evidence. These powers bring India in line with the European Commission and the US DOJ/FTC, both of which have long had dawn-raid capabilities. Before 2023, the DG's searches required cooperation or court orders, which gave cartelists time to destroy evidence.

**The walk-through.** In the **Beer Cartel case** (2021), the DG's investigation uncovered WhatsApp messages between senior executives of United Breweries, SABMiller India, and Carlsberg India discussing price coordination in multiple Indian states. The executives used code words ("let's align" for price-fixing, "discipline" for punishing deviators) and deleted messages — but forensic recovery from company servers captured the conversations. The DG's investigation report, running to hundreds of pages, laid out the communication patterns, the price parallelism, and the economic analysis showing that the parallel pricing could not be explained by independent market forces. The CCI imposed penalties of ₹873 crores. The case demonstrated both the power of thorough investigation and the critical role of digital evidence in modern cartel enforcement.

**The thread.** Investigation gathers evidence. But what can the CCI do *while* the investigation is ongoing, if the anti-competitive conduct is causing immediate harm? Section 33 gives the CCI the power to grant interim relief — temporary orders that restrain the parties from continuing the harmful conduct during the pendency of the investigation. That interim power, along with the evidentiary framework, is the next section.`,
      questions: [
        {
          kind: "mcq",
          prompt: "The 2023 amendment explicitly strengthened the Director General's power to conduct:",
          options: [
            "Undercover sting operations",
            "Dawn raids (unannounced inspections of business premises)",
            "Wiretapping of personal phone calls",
            "International extraditions"
          ],
          correct_index: 1,
          model_answer: "The DG now has explicit dawn raid powers to search premises and seize documents (including digital evidence) without prior warning, preventing cartelists from destroying evidence.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "If the Director General investigates and recommends that no contravention occurred, the CCI is legally bound to close the case.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The DG's recommendation is not binding. The CCI can disagree with the DG and direct further investigation.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Why is digital forensic recovery increasingly critical in cartel investigations? Give an example.",
          model_answer: "Cartels operate secretly and delete evidence. In the Beer Cartel case, executives used code words and deleted WhatsApp messages. Forensic recovery by the DG proved price-fixing, leading to ₹873 crores in penalties.",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "Which of the following are standard steps in the CCI's investigation pipeline? Select all that apply.",
          options: [
            "CCI forms prima facie opinion",
            "DG conducts investigation and submits report",
            "CCI arrests the CEO of the offending company",
            "Parties file responses to the DG report",
            "CCI passes its final order"
          ],
          correct_indices: [0, 1, 3, 4],
          model_answer: "The process moves from prima facie order -> DG report -> party responses -> CCI hearing -> final order. The CCI cannot arrest CEOs (it is a civil/quasi-judicial body, not police).",
          difficulty: "basic",
        }
      ],
      facts: [
        "The CCI's investigative arm, the Director General, has the power to conduct 'dawn raids' — unannounced searches of corporate offices to seize hard drives and secret cartel documents.",
      ],
    },
    {
      slug: "evidence-and-hearings",
      title: "Evidence & Procedural Safeguards",
      sectionNumber: "§36, §41",
      importance: "Advanced",
      summary: "The CCI's powers as a civil court — summoning witnesses, compelling documents, and the safeguards of natural justice.",
      body: `**The provision.** Section 36 grants the CCI the powers of a civil court in respect of: (a) summoning and enforcing the attendance of any person and examining them on oath; (b) requiring the discovery and production of documents; (c) receiving evidence on affidavits; (d) issuing commissions for examination of witnesses or documents; (e) requisitioning any public record from any court or office; and (f) any other matter prescribed.

The CCI's proceedings are deemed to be "judicial proceedings" for the purposes of Sections 193 and 228 of the Indian Penal Code (giving false evidence and intentionally insulting public servants). This means witnesses before the CCI are under oath, and perjury is punishable.

**Why it matters.** These civil-court powers are what distinguish the CCI from a mere advisory body. The old MRTP Commission was frequently criticised for lacking teeth — parties could ignore its summons, withhold documents, and face negligible consequences. The Competition Act corrected this by giving the CCI coercive powers equivalent to those of a court. A party that refuses to appear or produce documents can be held in contempt; a witness who lies under oath can be prosecuted for perjury.

**The insight.** The principle of **natural justice** — primarily the right to be heard (audi alteram partem) — runs through the CCI's procedure. Every party against whom an order is proposed must receive: (a) the DG's investigation report, (b) the opportunity to file written submissions, (c) the opportunity for oral hearings, and (d) a reasoned order that addresses the party's arguments. The CCI's orders have been challenged — and sometimes overturned — on appeal for violations of natural justice, particularly when parties were not given adequate access to the DG's evidence or sufficient time to respond. This procedural rigour is not a technicality; it is what legitimises the CCI's power to impose penalties that can break a company.

**The walk-through.** In **Excel Crop Care v. CCI** (2017), the Supreme Court examined whether the CCI's procedure satisfied natural justice requirements. The companies challenged the CCI's cartel order on the ground that they were not given access to all documents collected during the DG's investigation. The Supreme Court held that while the CCI must share relevant evidence, it need not disclose internal notes, privileged communications, or third-party confidential information. The ruling established a framework for balancing transparency (the party's right to know the case against it) with confidentiality (protecting witnesses and third-party business secrets) — a balance that every competition authority in the world must strike.

**The thread.** The CCI can investigate, summon, compel, and hear. But what does it *do* with all that power? The next chapter — Orders, Relief & Remedies — covers the CCI's toolkit for actually stopping anti-competitive conduct and compensating for the harm it caused.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Which fundamental legal principle is central to the CCI's hearing process, ensuring parties can defend themselves against the DG's findings?",
          options: [
            "Caveat emptor (let the buyer beware)",
            "Audi alteram partem (the right to be heard / natural justice)",
            "Res judicata",
            "Habeas corpus"
          ],
          correct_index: 1,
          model_answer: "Audi alteram partem requires that every party gets the DG's report, files written submissions, and has an oral hearing before an order is passed.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "Because the CCI is a regulator, witnesses who lie during its proceedings cannot be prosecuted for perjury under the Indian Penal Code.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Section 36 grants the CCI civil court powers, and its proceedings are 'judicial proceedings' for IPC purposes. Lying under oath is punishable perjury.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "In Excel Crop Care (2017), how did the Supreme Court balance transparency and confidentiality regarding the DG's evidence?",
          model_answer: "The Court held the CCI must share relevant evidence so parties can defend themselves (transparency/natural justice), but it does not need to disclose internal notes, privileged communications, or third-party business secrets (confidentiality).",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "Does the CCI have the power to legally compel a company to produce internal documents during an inquiry?",
          model_answer: "Yes, Section 36 grants it the powers of a civil court to require the discovery and production of documents.",
          difficulty: "basic",
        }
      ],
      facts: [
        "Lying to the CCI is legally the same as lying to a judge. Its proceedings are treated as judicial proceedings, meaning perjury is punishable under the Indian Penal Code.",
      ],
    },
    {
      slug: "interim-relief",
      title: "Interim Orders & Temporary Restraints",
      sectionNumber: "§33",
      importance: "Advanced",
      summary: "Emergency powers: how the CCI can halt anti-competitive conduct mid-investigation when waiting would cause irreparable harm.",
      body: `**The provision.** Section 33 empowers the CCI to pass a temporary restraining order during the pendency of an inquiry if it is satisfied that an act in contravention of Section 3 (anti-competitive agreements) or Section 4 (abuse of dominance) has been committed, is being committed, or is about to be committed, and it is necessary to do so in the interest of the public.

The interim order can restrain the party from carrying on with the anti-competitive practice, or from implementing a combination that has not been approved, until the conclusion of the inquiry.

**Why it matters.** Investigations take time — often one to three years from information to final order. During that period, the anti-competitive conduct may continue, causing ongoing harm to consumers and competitors. A cartel may keep fixing prices; a dominant firm may keep denying market access; a combination may be on the verge of closing without approval. Section 33 is the CCI's emergency brake — it allows the CCI to stop the bleeding while it determines whether the patient (the market) needs surgery (a full penalty order) or only a bandage.

**The insight.** The CCI uses interim orders sparingly, and deliberately so. An interim order is coercive — it restrains a party's freedom to conduct business before the CCI has made a final finding of violation. The principles governing interim relief mirror those in civil courts: (a) a prima facie case exists, (b) the balance of convenience favours the order, and (c) irreparable harm would occur without the order. The CCI has been cautious because overuse of interim orders would effectively convert the prima facie stage into a final adjudication — parties would be penalised by restraining orders before they have had a full hearing.

**The walk-through.** In **Belaire Owners' Association v. DLF** (2011), residents of a DLF housing project alleged that DLF was abusing its dominant position in the Gurgaon real estate market by imposing one-sided terms in apartment buyer agreements. The CCI found a prima facie case and, critically, passed an interim order restraining DLF from enforcing certain clauses in its buyer agreements while the investigation was ongoing. The CCI reasoned that waiting two years for a final order would cause irreparable harm — apartment buyers would have paid penalties under unfair clauses that would later be found illegal. DLF challenged the interim order, but the appellate tribunal upheld it, establishing that the CCI's interim powers are a legitimate tool when immediate harm is demonstrable.

**The thread.** Interim relief stops the harm mid-case. But what happens when the case concludes? The CCI's final orders — cease-and-desist directions, penalties, modifications, and compensation awards — are the subject of the next chapter. That is where the Act's prohibitions turn into concrete consequences.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is Section 33 considered the CCI's 'emergency brake'?",
          options: [
            "It allows the CCI to instantly fire a company's board of directors.",
            "It allows the CCI to temporarily halt anti-competitive conduct mid-investigation to prevent ongoing, irreparable harm.",
            "It automatically freezes the bank accounts of accused cartels.",
            "It gives the CCI power to declare a national economic emergency."
          ],
          correct_index: 1,
          model_answer: "Investigations take years. Section 33 allows the CCI to pass temporary restraining orders to stop the harmful practice while the inquiry is pending.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The CCI frequently and routinely issues interim orders in almost every investigation it opens.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Interim orders are used sparingly because they are coercive restraints applied *before* a final finding of guilt has been established.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "What three conditions must generally be satisfied for the CCI to grant an interim order?",
          model_answer: "(a) A prima facie case of contravention exists, (b) the balance of convenience favours granting the order, and (c) irreparable harm would occur if the order is not granted.",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "An interim order under Section 33 can be used to do which of the following? Select all that apply.",
          options: [
            "Restrain a party from continuing a suspected anti-competitive practice",
            "Temporarily halt an unapproved combination from closing",
            "Impose a final penalty of ₹10,000 crores",
            "Sentence a cartel executive to prison"
          ],
          correct_indices: [0, 1],
          model_answer: "Interim orders can restrain conduct or halt mergers. Penalties require a final order, and the CCI cannot sentence anyone to prison (it imposes civil/monetary penalties).",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "Because investigations take years, the CCI can use an 'interim order' as an emergency brake — forcing a company to stop a harmful practice temporarily while the trial is still ongoing.",
      ],
    },
  ],
};
