import { EcChapter } from "../types";

export const structuringYourMessage: EcChapter = {
  slug: "structuring-your-message",
  title: "Structuring Your Message",
  summary:
    "Great communicators aren't improvising — they're running a structure. Three reliable ones: lead with the bottom line, argue with PREP, and organise with the Pyramid Principle.",
  sections: [
    {
      slug: "bluf",
      title: "Lead With the Bottom Line",
      summary:
        "BLUF — Bottom Line Up Front — means putting your conclusion, ask, or headline in the first sentence, before the background. It's the single highest-leverage structure at work.",
      body: `**The idea:**
BLUF — *Bottom Line Up Front* — is a habit borrowed from the military and adopted by every effective operator: state your conclusion or request in the **first sentence**, then give the supporting detail. You are answering the reader's silent question — "why are you telling me this, and what do you want?" — before they have to ask it.

**Why it works:**
Most people write like they think: context first, build-up, then the point at the end. But readers scan top-down and often stop early. If your ask is in sentence six, half your readers never reach it. BLUF flips the order so the most important thing is impossible to miss — and the reader can decide immediately how much of the detail they even need.

**Bottom-line-last vs. bottom-line-up-front:**
> ❌ "As you know, we've been evaluating vendors for the payments integration. We looked at three options, ran a security review, and compared pricing. After a lot of back and forth, and given the timeline, **we'd like to go with Stripe. Can you approve by Thursday?**"
> ✅ "**We'd like to go with Stripe for payments — can you approve by Thursday?** We evaluated three vendors on security and price; Stripe won on both and fits the timeline. Details below if useful."

Same information. The second version respects a reader who's busy: the ask and deadline land instantly, and the justification is there for anyone who wants it.

**When to use it:**
- **Emails and Slack:** almost always. Lead with the ask or the news.
- **Status updates:** headline first ("On track for Friday"), then detail.
- **Answering a question in a meeting:** give the answer, *then* the reasoning. "Yes — because…" not a two-minute wind-up to a "yes".

**Watch out for:**
BLUF is not the same as being abrupt or skipping context — the context still comes, it just comes *second.* And for genuinely sensitive news (bad news, difficult feedback), a single sentence of framing before the bottom line can be the humane choice. BLUF is the default, not an absolute law.

**The takeaway:**
Before you send, find your bottom line — the one sentence that is the actual point — and move it to the front. If you're not sure what it is, you're not ready to send.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does BLUF stand for, and what does it ask you to do?",
          options: [
            "Brief, Legible, Useful, Formal — keep messages short and tidy",
            "Bottom Line Up Front — state your conclusion or ask in the first sentence",
            "Build Long, Understand First — give full context before the point",
            "Be Likeable, Use Feeling — lead with warmth",
          ],
          correct_index: 1,
          model_answer:
            "BLUF = Bottom Line Up Front: put your conclusion or request in the first sentence, then the supporting detail.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "BLUF means removing context from your message entirely.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. BLUF reorders the message so the bottom line comes first; the context still follows, it just isn't the opening.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "Your manager asks for a status update. The project is on track to ship Friday, but you need design sign-off by Wednesday or it slips. Write the update using BLUF — bottom line first, then the detail.",
          model_answer:
            "On track to ship Friday — with one dependency: I need design sign-off by Wednesday, or we slip to Monday. Everything else (engineering, QA, copy) is done or in flight. Can you nudge the design review to the top of Priya's list, or should I? Full checklist in the thread.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "BLUF — Bottom Line Up Front — comes from military communication, where the first line of a message must carry the decision or order in case the reader reads nothing else.",
      ],
    },
    {
      slug: "prep",
      title: "The PREP Framework",
      summary:
        "PREP — Point, Reason, Example, Point — is a four-beat structure for making any argument or answering any question crisply, especially when you're put on the spot.",
      body: `**The idea:**
PREP is a portable structure for saying something persuasive without rambling. Four beats:
- **Point** — state your position in one sentence.
- **Reason** — why you hold it.
- **Example** — one concrete piece of evidence or a short story.
- **Point** — restate the position, now earned.

It works because it front-loads the conclusion (like BLUF), backs it with logic *and* a concrete example (logic convinces the head; the example makes it stick), and lands cleanly instead of trailing off.

**PREP in action:**
> **Point:** "We should cut the number of onboarding steps from seven to three."
> **Reason:** "Because most drop-off happens before people ever reach the aha moment — the length is the problem, not the content."
> **Example:** "When we removed the optional profile step last month, completion jumped 18% overnight."
> **Point:** "So trimming to three steps is the fastest lever we have on activation."

Thirty seconds, and it's complete: a claim, a reason, proof, and a clean close.

**Where it shines:**
- **Answering a question on the spot** in a meeting or interview — PREP stops you from thinking out loud.
- **Making a recommendation** to a manager or client.
- **Disagreeing** — "Point: I'd push back on shipping Friday. Reason:… Example:… Point:…" keeps you calm and structured instead of defensive.

**The interview cousin — STAR:**
For "tell me about a time…" questions, STAR (Situation, Task, Action, Result) is PREP's relative — it structures a story so the *Result* lands instead of getting lost in setup. Same instinct: a deliberate shape beats improvising.

**Watch out for:**
Skipping the **Example.** The concrete example is what separates a real answer from an opinion — it's the beat most people drop under pressure, and the one that does the most work.

**The takeaway:**
When you're asked something and feel the urge to ramble, silently run P-R-E-P. Claim, reason, proof, restate — then stop talking.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In the PREP framework, what does the second 'P' (the final beat) do?",
          options: [
            "Introduces a brand-new point to keep the discussion going",
            "Restates your original point, now supported by the reason and example",
            "Asks the listener a question",
            "Provides a second example for balance",
          ],
          correct_index: 1,
          model_answer:
            "The final P restates your original Point — now earned by the Reason and Example — so the answer lands cleanly instead of trailing off.",
          difficulty: "basic",
        },
        {
          kind: "mcq",
          prompt: "Which beat of PREP do people most often drop under pressure, weakening the answer most?",
          options: [
            "The opening Point",
            "The Reason",
            "The Example",
            "The closing Point",
          ],
          correct_index: 2,
          model_answer:
            "The Example — the concrete piece of evidence is what turns an opinion into a real answer, and it's the beat most often skipped when nervous.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "In a team meeting someone asks: \"Should we keep doing daily standups?\" Give your answer using PREP (Point, Reason, Example, Point). Take a clear position either way.",
          model_answer:
            "Point: I'd keep standups but cut them to twice a week. Reason: the daily cadence has turned into status theatre — most days there are no blockers, so we're spending 15 minutes to say 'no update'. Example: last sprint, only three of ten standups surfaced an actual blocker, and those all came up in Slack anyway. Point: so Tuesday and Thursday standups keep the coordination we need without the daily tax on focus.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "PREP (Point, Reason, Example, Point) and STAR (Situation, Task, Action, Result) are cousins — both exist to stop you improvising and make sure the payoff, not the setup, is what your listener remembers.",
      ],
    },
    {
      slug: "pyramid-principle",
      title: "The Pyramid Principle",
      summary:
        "Barbara Minto's Pyramid Principle organises a whole document or presentation: start with the answer, group your supporting arguments, and let detail sit underneath — not the other way around.",
      body: `**The idea:**
The Pyramid Principle, from Barbara Minto at McKinsey, is BLUF scaled up to an entire document, deck, or presentation. You structure ideas as a pyramid:
- **The top:** your single main message or recommendation.
- **The middle:** 2–4 grouped arguments that support it.
- **The base:** the facts, data, and detail supporting each argument.

The reader meets the answer first, then descends into as much supporting detail as they want. Nobody has to wade through the analysis to discover the conclusion.

**Top-down, not bottom-up:**
Most people present the way they *did the work* — "here's all the research, and therefore, in conclusion…". That forces the audience to hold everything in their head, trusting a conclusion is coming. The pyramid inverts it: **answer first**, then support. It's the difference between a mystery novel and a briefing. At work, always write the briefing.

**A worked shape:**
> **Main message:** "We should pause the EU launch until Q3."
> **Argument 1:** The compliance work isn't done → *(supporting facts: 2 of 5 GDPR items open, legal needs 6 weeks)*
> **Argument 2:** The market timing is better in Q3 → *(supporting facts: competitor launches in Q2, trade show is in September)*
> **Argument 3:** Our team is over-committed this quarter → *(supporting facts: 3 launches already booked)*

Someone can read just the four bold lines and understand the entire recommendation. That's the test.

**The MECE check:**
Minto's supporting groups should be **MECE** — Mutually Exclusive, Collectively Exhaustive. No two arguments overlap, and together they cover the case. If your three reasons are really the same reason said three ways, the pyramid is weak.

**Watch out for:**
Building the pyramid *bottom-up* in the actual meeting — dumping every fact and hoping the structure emerges. Do the grouping *before* you communicate; the audience should receive the finished pyramid, not watch you assemble it.

**The takeaway:**
For anything longer than a paragraph, name your one main message, find the 2–4 non-overlapping reasons it's true, and put the answer at the top. Structure is a gift you prepare for the reader in advance.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does the Pyramid Principle say you should order a document or presentation?",
          options: [
            "Present all the research first, then reveal the conclusion at the end",
            "Start with the main message, then supporting arguments, then detail",
            "Alternate between facts and opinions to keep interest",
            "Put the most detailed data first to establish credibility",
          ],
          correct_index: 1,
          model_answer:
            "Top-down: lead with your single main message, then 2–4 grouped supporting arguments, with facts and detail underneath — the reader meets the answer first.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "In the Pyramid Principle, 'MECE' means your supporting arguments should overlap heavily to reinforce each other.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. MECE = Mutually Exclusive, Collectively Exhaustive: the arguments should NOT overlap, and together they should cover the whole case.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "You want to recommend that your team adopt a four-day work week trial. Sketch the top two layers of a Minto pyramid: your one main message, plus 2–3 non-overlapping (MECE) supporting arguments. One line each.",
          model_answer:
            "Main message: We should run a three-month four-day-week trial starting next quarter. Argument 1 (retention): two engineers cited burnout in recent exit interviews, and a rested team is cheaper than backfilling. Argument 2 (output): teams that have trialled it report flat or higher delivery because meetings and busywork get cut first. Argument 3 (low risk): a time-boxed trial with clear metrics (velocity, on-call, satisfaction) is fully reversible if it doesn't work. The three don't overlap — people, output, risk — and together they make the case.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "The Pyramid Principle was developed by Barbara Minto, the first female consultant at McKinsey, and is still taught at consulting firms as the default way to structure any recommendation.",
      ],
    },
  ],
};
