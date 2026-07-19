import type { CompActChapter } from "../types";

/** Chapter 8 — Director General & Investigation: the CCI's investigative arm. */
export const directorGeneral: CompActChapter = {
  slug: "director-general",
  title: "Director General & Investigation",
  chapter: 8,
  tagline: "The CCI's investigative arm — the officer who turns suspicion into evidence.",
  color: "#64748b",
  prereqs: ["orders-and-remedies"],
  unlocks: ["penalties"],
  intro: `If the CCI is the judge, the Director General is the detective. Section 41 of the Act establishes the office of the Director General, whose primary function is to investigate contraventions of the Act when directed by the CCI. The DG does not initiate investigations independently — the CCI must first form a prima facie opinion and issue a direction. But once that direction is given, the DG has sweeping powers to search premises, seize documents, summon witnesses, and compel production of evidence.

The DG's office is staffed by officers drawn from the Indian Revenue Service, the Indian Police Service, and other All India Services, supplemented by domain experts in economics, forensic accounting, and digital forensics. This multidisciplinary composition reflects the nature of competition investigations: a cartel case may require forensic recovery of deleted WhatsApp messages, economic modelling of price parallelism, and legal analysis of meeting minutes — all in the same investigation.

The two sections ahead examine the DG's institutional role and the specific investigation powers that make the office effective.`,
  sections: [
    {
      slug: "role-and-appointment",
      title: "The DG's Role & Institutional Position",
      sectionNumber: "§41(1)–(2)",
      importance: "Foundation",
      summary: "Who the Director General is, how the office is constituted, and why the separation between investigation and adjudication matters.",
      body: `**The provision.** Section 41(1) provides that the Central Government shall appoint a Director General for the purposes of assisting the CCI in conducting inquiries into contraventions of the Act. Section 41(2) provides that the DG shall, when so directed by the CCI, assist the CCI in investigating into any contravention of the provisions of the Act or any rules or regulations made thereunder.

The DG is appointed by the Central Government, not by the CCI — a deliberate structural choice that preserves institutional independence between the investigator and the adjudicator.

**Why it matters.** The separation between the DG (investigator) and the CCI (adjudicator) is a fundamental principle of fair procedure, rooted in the maxim *nemo judex in causa sua* — no one should be a judge in their own cause. If the CCI both investigated and judged cases, parties would face a tribunal that had already formed its view during the investigation. The DG-CCI separation ensures that the CCI encounters the evidence fresh, through the lens of the DG's report and the parties' responses, without the institutional bias that comes from having gathered the evidence itself.

**The insight.** This separation is not merely theoretical. In practice, the CCI has *disagreed* with the DG's findings in numerous cases. In **Re: Aluminium Phosphide Tablets** (2012), the DG investigated allegations of bid-rigging in government tenders for aluminium phosphide tablets and concluded that no cartel existed. The CCI disagreed, examined the evidence independently, and found a cartel — overruling the DG's recommendation. The opposite also occurs: in some cases, the DG recommends a finding of contravention, but the CCI, after hearing the parties, concludes that the evidence is insufficient. These disagreements demonstrate that the CCI exercises genuine adjudicatory independence — it does not rubber-stamp the DG's conclusions.

**The walk-through.** The DG's office currently operates from New Delhi with regional investigation teams. The Directorate is headed by a senior officer (typically a joint secretary–level IRS or IPS officer) and includes Additional DGs, Joint DGs, Deputy DGs, and Assistant DGs. Economic analysis is supported by the CCI's Economics Division, which works alongside the DG's investigation teams to prepare market studies, run regression analyses on pricing data, and model competitive effects. The forensic accounting unit specialises in tracing financial flows in cartel cases — following the money from inflated prices to cartel members' profits.

**The thread.** The DG's role is institutional. But what specific *powers* does the DG have to compel evidence, enter premises, and seize documents? The investigation powers — particularly the enhanced search-and-seizure provisions introduced by the 2023 amendment — are the next section.`,
      questions: [
        {
          kind: "mcq",
          prompt: "The Director General (DG) is appointed by which authority?",
          options: [
            "The Chairperson of the CCI",
            "The Central Government",
            "The Supreme Court of India",
            "The President of India"
          ],
          correct_index: 1,
          model_answer: "The DG is appointed by the Central Government, a deliberate structural choice to preserve independence between the investigator (DG) and the adjudicator (CCI).",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "If the DG's investigation report concludes that no cartel exists, the CCI is legally bound to accept that finding and close the case.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The CCI is not bound by the DG's report. In cases like Re: Aluminium Phosphide Tablets, the CCI has explicitly overruled the DG's recommendation and found a contravention.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt: "Why does the Competition Act mandate a strict separation between the Director General (the investigator) and the CCI (the adjudicator)?",
          model_answer: "To prevent institutional bias, rooted in the principle that no one should be a judge in their own cause. Separating the roles ensures the CCI encounters the evidence fresh and objectively, rather than having already formed a bias while collecting it.",
          difficulty: "advanced",
        },
        {
          kind: "quickfire",
          prompt: "Can the Director General initiate an antitrust investigation entirely independently?",
          model_answer: "No, the DG can only investigate when directed by the CCI after it forms a prima facie opinion.",
          difficulty: "basic",
        }
      ],
      facts: [
        "In competition law, the police and the judge are kept strictly separate: the Director General investigates the crime, but only the CCI decides if a company is actually guilty.",
      ],
    },
    {
      slug: "investigation-powers",
      title: "Search, Seizure & Evidence Powers",
      sectionNumber: "§41(3), §36 (read with DG powers)",
      importance: "Core",
      summary: "Dawn raids, document seizure, digital forensics, and the enhanced powers the 2023 amendment gave the DG.",
      body: `**The provision.** The DG's investigation powers are drawn from two sources: Section 41(3) (which gives the DG the same powers as the CCI has under Section 36, including civil-court powers to summon, compel documents, and examine witnesses); and the Competition (Amendment) Act, 2023, which introduced explicit provisions for:

(a) **Search and seizure** — the DG can enter and search any premises (including digital systems) of an enterprise, with authorisation from the CCI, and seize documents, electronic data, and other evidence.
(b) **Dawn raids** — unannounced inspections, typically conducted early in the morning before business hours, to prevent destruction of evidence.
(c) **Digital forensics** — the power to image hard drives, clone servers, access email accounts, and recover deleted electronic communications.
(d) **Sealed-cover proceedings** — the ability to present sensitive evidence (leniency applications, whistleblower identities) to the CCI in sealed cover.

**Why it matters.** Cartels are by definition secret. The participants know their conduct is illegal, and they take active steps to conceal it: using burner phones, meeting in person rather than communicating electronically, deleting messages, using encrypted apps, storing documents offshore. Without search-and-seizure powers, the DG is limited to requesting information that the parties voluntarily provide — which is precisely the information the cartelists have already sanitised. Dawn raids bypass this problem entirely: the DG arrives unannounced, before evidence can be destroyed, and secures it on the spot.

**The insight.** India's adoption of dawn-raid powers in 2023 brought it in line with the most effective competition enforcers globally. The European Commission has had dawn-raid powers since the 1962 Regulation 17, and the Commission's most significant cartel cases — the Auto Parts cartel (€1.3 billion), the Truck cartel (€2.9 billion) — were built on evidence seized during dawn raids. The US DOJ uses FBI-led raids. Before 2023, Indian competition enforcement relied heavily on the leniency programme (cartelists voluntarily confessing) and economic evidence (price parallelism) to prove cartels — effective but incomplete tools. Dawn raids fill the evidentiary gap.

**The walk-through.** While India's post-2023 dawn-raid jurisprudence is still developing, the template is well-established internationally. A typical dawn raid proceeds as follows: (1) the DG obtains authorisation from the CCI, specifying the premises to be searched and the evidence sought; (2) a team of investigators, accompanied by digital forensic experts, arrives at the target's premises before business hours; (3) the team secures the premises (prevents destruction of evidence) and informs the enterprise's legal representative of the authorisation; (4) the team images computer systems, copies relevant physical documents, and interviews available personnel; (5) seized evidence is catalogued, sealed, and transported to the DG's office; (6) the enterprise receives a copy of the seizure inventory and has the right to claim privilege over specific documents. The entire process is subject to judicial review — the enterprise can challenge the authorisation in court if it was obtained improperly.

**The thread.** The DG gathers the evidence; the CCI makes the finding. But what consequences follow the finding? The next chapter — Penalties & Enforcement — is where the Act shows its teeth: monetary penalties, individual criminal liability, leniency for cooperating cartelists, and the new settlement and commitment mechanism introduced in 2023.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why are 'dawn raids' considered critical for investigating cartels?",
          options: [
            "Because cartel members only meet at dawn.",
            "Because they allow the DG to seize documents and digital evidence unannounced before cartelists can destroy them.",
            "Because the Competition Act prohibits investigations during normal business hours.",
            "Because they are the only way to arrest cartel executives."
          ],
          correct_index: 1,
          model_answer: "Cartels operate secretly and often try to destroy evidence. Dawn raids (unannounced inspections) bypass this by securing evidence on the spot.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "The 2023 amendment to the Competition Act explicitly granted the DG powers for dawn raids and digital forensics.",
          options: ["True", "False"],
          correct_index: 0,
          model_answer: "True. The 2023 amendment explicitly empowered the DG to conduct unannounced searches and clone/recover digital evidence, aligning India with global regulators.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt: "Describe the typical sequence of a dawn raid conducted by the DG.",
          model_answer: "The DG obtains CCI authorization, arrives unannounced before business hours, secures the premises to prevent evidence destruction, images computer systems and seizes physical documents, and provides the enterprise with a seizure inventory.",
          difficulty: "advanced",
        },
        {
          kind: "multi",
          prompt: "Which of the following powers does the Director General explicitly possess under the Act? Select all that apply.",
          options: [
            "Enter and search premises (with CCI authorization)",
            "Summon and examine witnesses on oath",
            "Arrest suspected cartel executives",
            "Image hard drives and clone servers"
          ],
          correct_indices: [0, 1, 3],
          model_answer: "The DG can search premises, summon witnesses, and image digital devices. The DG cannot arrest individuals (competition offences result in civil/monetary penalties, not police arrests).",
          difficulty: "intermediate",
        }
      ],
      facts: [
        "Armed with new 2023 amendments, the Director General can conduct 'dawn raids' — showing up unannounced before business hours to clone servers and recover deleted WhatsApp messages.",
      ],
    },
  ],
};
