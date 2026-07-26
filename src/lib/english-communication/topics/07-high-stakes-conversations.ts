import { EcChapter } from "../types";

export const highStakesConversations: EcChapter = {
  slug: "high-stakes-conversations",
  title: "High-Stakes Conversations",
  summary:
    "When the pressure is real — bad news, conflict, a job interview — structure and composure matter most. Four conversations worth rehearsing before you're in them.",
  sections: [
    {
      slug: "delivering-bad-news",
      title: "Delivering Bad News",
      summary:
        "Bad news handled well can build trust rather than destroy it. Be prompt, be direct, own it, and always arrive with a path forward.",
      body: `**The idea:**
Delivering bad news — a missed deadline, a mistake, a project that failed — is where reputations are truly tested. Handled badly (hidden, spun, or dumped without a plan), it destroys trust. Handled well, it can *build* trust: people learn you're someone who tells them the truth and owns it.

**The five moves:**
1. **Be prompt.** Bad news ages badly. The moment you know, they should know — the cover-up is always worse than the crime, and early news preserves options.
2. **Lead with brief framing, then be direct.** A single sentence of warmth or context ("I want to flag something before it grows —"), then the news, plainly. Don't bury it under three paragraphs of preamble, and don't blurt it with no cushioning at all.
3. **Own your part.** "We underestimated the scope" beats "the requirements kept changing." Blame-shifting is transparent and makes it worse; clean ownership is disarming.
4. **Bring the path forward.** Never deliver bad news empty-handed. "Here's what happened, here's what I'm doing about it, and here's what I need from you" turns a problem into a plan.
5. **Be honest about uncertainty.** Don't over-promise a fix to make the news land softer. A recovery plan you can't keep is a second piece of bad news in waiting.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "prompt", "label": "Be prompt (the moment you know)", "row": 0, "col": 0 },
    { "id": "direct", "label": "Brief framing, then the news, plainly", "row": 1, "col": 0 },
    { "id": "own", "label": "Own your part (no blame-shifting)", "row": 2, "col": 0 },
    { "id": "path", "label": "Bring the path forward + what you need", "row": 3, "col": 0 },
    { "id": "honest", "label": "Be honest about what's still uncertain", "row": 4, "col": 0 }
  ],
  "edges": [
    { "from": "prompt", "to": "direct" },
    { "from": "direct", "to": "own" },
    { "from": "own", "to": "path" },
    { "from": "path", "to": "honest" }
  ],
  "caption": "Delivered this way, bad news can build trust: the cover-up is always worse than the crime, and arriving with a plan turns a problem into a decision."
}
\`\`\`

**Weak vs. strong:**
> ❌ "So, um, there might be a small delay, it's mostly because of some things outside our control, but hopefully it'll be fine."
> ✅ "I need to give you a heads-up: we're going to miss the Friday launch — we underestimated the migration work. New realistic date is Wednesday. Here's the recovery plan, and the one thing I need from you is a call on whether we soft-launch or wait."

**The apology, if one's owed:**
Once, sincerely, specifically — then pivot to the fix. Over-apologising ("I'm so so sorry, I feel terrible…") makes it about your guilt instead of their problem. "I'm sorry — that's on me. Here's how I'm fixing it" is the professional shape.

**Watch out for:**
Softening the news so much the person doesn't realise it's serious. "A slight possible delay maybe" when the project is a month behind isn't kindness — it's a landmine for later. Clarity is the kindness here.

**The takeaway:**
Prompt, direct, owned, and paired with a plan. Bad news is unavoidable; how you deliver it is entirely yours, and it's one of the clearest signals of whether you can be trusted with more.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What should always accompany bad news at work?",
          options: [
            "A detailed explanation of whose fault it was",
            "A path forward — what you're doing about it and what you need",
            "Multiple apologies to show you feel bad",
            "Reassurance that it probably won't matter much",
          ],
          correct_index: 1,
          model_answer:
            "Never deliver bad news empty-handed — pair it with a path forward: what happened, what you're doing about it, and what you need. That turns a problem into a plan.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "When the news is bad, softening it heavily — 'a slight possible delay maybe' — is the kind and professional choice, even if the project is badly behind.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Over-softening so the person doesn't grasp the severity is a landmine for later. Clarity is the real kindness — be direct about how serious it is, then bring the plan.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "You've just realised a report you sent to a client last week contained a wrong revenue figure that overstated their growth. Tell your manager. Be prompt, direct, own it, and bring a path forward.",
          model_answer:
            "I need to flag a mistake before it goes further. The growth report I sent Acme last Tuesday overstated their Q2 revenue by about 12% — I pulled from a pre-adjustment table, and that's on me. Here's my plan: I've already recalculated the correct figures, and I'd like to send Acme a brief, straight correction today owning the error, with the fixed report attached. Before I do, can you sanity-check my corrected numbers and the wording of the note? I want the fix to be as clean as the mistake was avoidable.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "With bad news, the cover-up is reliably worse than the crime — telling people promptly preserves options and trust, while a late reveal destroys both even when the underlying problem was minor.",
      ],
    },
    {
      slug: "difficult-conversations",
      title: "Difficult Conversations",
      summary:
        "Conflict with a coworker, a boundary that's been crossed, a tension that's festering — approach it with facts over accusations, curiosity over assumptions, and a shared goal.",
      body: `**The idea:**
The conversations we most want to avoid — a coworker who keeps overriding you, a boundary being crossed, a simmering tension — are exactly the ones that fester when dodged. Having them well is a defining professional skill. The core move: separate the *facts* from your *story* about the facts.

**Facts vs. story:**
When someone frustrates us, we fuse what happened with our interpretation of *why.* "You keep undermining me in meetings" is a story. "In the last two meetings, you reversed a decision I'd stated without checking with me first" is a fact. Lead with the fact; the story ("I feel undermined") you can *offer* as your experience, not assert as their intent.

**A structure for the hard talk:**
1. **Open with the shared goal and good intent.** "I want us to work well together, which is why I wanted to talk."
2. **State the facts,** neutrally — what happened, not what it means about them.
3. **Share your experience** using "I" not "you": "I felt sidelined," not "you sideline me." One is your data; the other is an accusation they'll fight.
4. **Get curious.** "What's it looking like from your side?" You may be missing context, and asking disarms.
5. **Move to a fix together.** "How do we handle this next time?"

\`\`\`viz:flow
{
  "nodes": [
    { "id": "goal", "label": "Shared goal & good intent", "row": 0, "col": 0 },
    { "id": "facts", "label": "State the facts (not your story)", "row": 1, "col": 0 },
    { "id": "i", "label": "Your experience in 'I' ('I felt sidelined')", "row": 2, "col": 0 },
    { "id": "curious", "label": "Get curious ('what's it like for you?')", "row": 3, "col": 0 },
    { "id": "fix", "label": "Move to a fix together", "row": 4, "col": 0 }
  ],
  "edges": [
    { "from": "goal", "to": "facts" },
    { "from": "facts", "to": "i" },
    { "from": "i", "to": "curious" },
    { "from": "curious", "to": "fix" }
  ],
  "caption": "Facts over accusations, 'I felt' over 'you did', curiosity over assumption — the structure that keeps a hard conversation from becoming a fight."
}
\`\`\`

**Manage the temperature:**
Difficult conversations go wrong when emotions spike. Slow down, stay calm, and if it overheats, it's fine to pause: "I want to get this right — can we pick this up after lunch?" Composure under tension is itself persuasive.

**Weak vs. strong open:**
> ❌ "We need to talk. You've been really difficult to work with lately."
> ✅ "I value working with you, so I wanted to raise something directly rather than let it sit. In the last couple of syncs, decisions I'd made got changed without a heads-up, and I felt cut out of my own area. I'd like to understand your view and figure out a better way — what's it looking like for you?"

**Watch out for:**
The ambush (a serious conversation sprung with no warning) and the audience (having it in front of others). Private, and with a little notice — "do you have 15 minutes to talk about the project?" — gives both people a chance to show up well.

**The takeaway:**
Lead with facts not accusations, own your experience with "I", get genuinely curious, and aim for a shared fix. The conversation you're dreading, done with structure and calm, is usually far less bad than the avoidance.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What's the key distinction to hold onto when raising a difficult issue with a coworker?",
          options: [
            "Formal language vs. casual language",
            "The observable facts vs. your story or interpretation of why they happened",
            "Whether you're more senior than them",
            "Email vs. face-to-face",
          ],
          correct_index: 1,
          model_answer:
            "Separate facts from your story about them. 'You reversed my decision without checking' is a fact; 'you undermine me' is an interpretation they'll fight. Lead with facts; offer your experience as 'I felt…'.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "Using 'I felt sidelined' instead of 'you sideline me' is just softer wording with no real difference in how it lands.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. 'I felt sidelined' is your experience — hard to argue with; 'you sideline me' is an accusation about their intent that invites defence. The framing materially changes whether the conversation stays productive.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "A peer on your team has twice reversed decisions in your area during meetings without talking to you first. Open the difficult conversation with them — shared goal, facts not accusations, 'I' language, and curiosity. Three to five sentences.",
          model_answer:
            "Hey, do you have fifteen minutes? I wanted to raise something directly because I'd rather sort it than let it sit. In the last two planning syncs, a couple of calls I'd made on the onboarding flow got reversed in the room without a heads-up to me first, and honestly I felt a bit cut out of my own area. I'm sure there's context I'm missing — how's it looking from your side? I'd love to find a way where we can align before the meeting rather than colliding in it.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "\"I felt X\" is nearly impossible to argue with because it's your own data; \"you did X to me\" invites a fight over intent — which is why the framing decides whether a hard conversation stays productive.",
      ],
    },
    {
      slug: "interviews-star",
      title: "Interviews & the STAR Method",
      summary:
        "Interviews reward structured storytelling. STAR — Situation, Task, Action, Result — keeps your answers concrete and makes sure the result actually lands.",
      body: `**The idea:**
An interview is a communication test as much as a competence test. Two people with the same experience can interview completely differently — one rambles through vague generalities, the other tells crisp, structured stories that stick. The tool for the second is **STAR**.

**STAR, the behavioural-answer framework:**
For any "tell me about a time when…" question:
- **Situation:** the context, briefly. Where, when, what was going on.
- **Task:** your specific responsibility or the challenge you owned.
- **Action:** what *you* did — concrete steps, and emphasise *your* contribution, not "we".
- **Result:** the outcome, ideally quantified, plus what you learned.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "s", "label": "Situation — the context, briefly", "row": 0, "col": 0 },
    { "id": "t", "label": "Task — the challenge you owned", "row": 1, "col": 0 },
    { "id": "a", "label": "Action — what YOU did (not 'we')", "row": 2, "col": 0 },
    { "id": "r", "label": "Result — the outcome, quantified + lesson", "row": 3, "col": 0 }
  ],
  "edges": [
    { "from": "s", "to": "t" },
    { "from": "t", "to": "a" },
    { "from": "a", "to": "r" }
  ],
  "caption": "Keep Situation short and let the Result land — the quantified outcome is the part that sells you, and the part people rush past under pressure."
}
\`\`\`

Most people over-invest in Situation (endless setup) and under-invest in Result (the part that actually sells you). Keep the setup tight and make the result land.

**Vague vs. STAR:**
> ❌ "I'm good under pressure. Like, there was this one project that was really stressful but we got it done and everyone was happy."
> ✅ "**(S)** Our biggest client threatened to churn over a broken integration two days before renewal. **(T)** I owned the fix and the relationship. **(A)** I triaged the bug, pulled in one backend engineer, gave the client a clear hourly update, and had a workaround live in six hours. **(R)** They renewed — a $200k account — and told us the communication was why they stayed. I learned that in a crisis, over-communicating is as important as the fix."

The second is specific, structured, and quantified — you remember it. The first evaporates.

**Beyond the story:**
- **Answer the actual question first** (BLUF), then tell the story: "Yes — the clearest example was…".
- **Own your part honestly.** Say "I" for what you did and "we" for genuine team work; interviewers can smell inflated credit.
- **Prepare 5–6 flexible stories** (a success, a failure, a conflict, a leadership moment, a time you were wrong) — most questions are a remix of these.
- **On weaknesses,** name a real one and the concrete thing you're doing about it. A polished fake ("I'm a perfectionist") reads as evasive.

**Watch out for:**
The result-less story. If your answer doesn't end with what happened and why it mattered, you've described activity, not impact — and impact is the entire point of the question.

**The takeaway:**
Structure behavioural answers as Situation–Task–Action–Result, keep the setup short, emphasise *your* action, and always land a concrete result. Rehearse a handful of stories and you can meet almost any question with a clear, memorable answer.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Which part of a STAR answer do people most often under-develop, weakening the answer most?",
          options: [
            "Situation — the context and setup",
            "Task — the responsibility they owned",
            "Action — the steps they took",
            "Result — the outcome and what it achieved",
          ],
          correct_index: 3,
          model_answer:
            "The Result — the quantified outcome and lesson is the part that actually sells you, yet people over-invest in setup and let the result trail off. Impact is the whole point of the question.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "In a behavioural interview answer, using 'we' throughout is safer than 'I', because it shows you're a team player.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Say 'I' for what you personally did and 'we' only for genuine team work. Hiding your contribution behind 'we' throughout makes it impossible for the interviewer to assess what YOU actually brought.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "An interviewer asks: \"Tell me about a time you handled a conflict on a team.\" Answer using STAR — keep the situation brief, emphasise your action, and land a concrete result with a lesson.",
          model_answer:
            "Situation: On a product launch, our designer and lead engineer were deadlocked over the checkout flow, and it had stalled the sprint for a week. Task: I was the PM, so unblocking it was on me. Action: I met each of them separately to understand the real concern — the designer worried about drop-off, the engineer about build time — then ran a 30-minute session where we agreed a measurable test rather than an opinion war, and shipped the designer's version behind a flag. Result: We unblocked the sprint that day, and the A/B test settled it with data — conversion rose 9%, and both of them were bought in. What I learned was that most 'personality' conflicts are really unstated, competing goals, and surfacing those is the fastest way through.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "STAR interview answers fail most often at the Result — a story that ends without a concrete, ideally quantified outcome describes activity, not impact, and impact is exactly what the question is testing.",
      ],
    },
  ],
};
