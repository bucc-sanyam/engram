import { EcChapter } from "../types";

export const meetingsAndPresentations: EcChapter = {
  slug: "meetings-and-presentations",
  title: "Meetings & Presentations",
  summary:
    "Meetings are where reputations are made in real time. Learn to speak up with signal, disagree without friction, and present so the room remembers your point.",
  sections: [
    {
      slug: "speaking-up-in-meetings",
      title: "Speaking Up in Meetings",
      summary:
        "The people who influence meetings aren't the ones who talk most — they're the ones who add signal at the right moment and say it in one clean sentence.",
      body: `**The idea:**
In every meeting there are people who talk a lot and people who *land.* The difference isn't airtime — it's signal. One well-placed, well-formed contribution shapes a decision more than ten rambling ones. And staying silent the whole meeting quietly signals that you had nothing to add, even when you did.

**Make your point in one clean sentence:**
The biggest mistake is thinking out loud — narrating your way to a point while the room waits. Do the thinking first, then deliver the conclusion:
> ❌ "So, um, I was just thinking, like, there might be a thing with the timeline, because when we did the last project there was this issue, and I'm not sure but maybe…"
> ✅ "One risk on the timeline: the vendor was two weeks late last quarter, so I'd build in a buffer."

Fifteen words, and it changes the plan. Run PREP silently if you need a structure: point, reason, done.

**Pick your moment — and claim it:**
- **Enter cleanly:** "Can I add one thing?" or "Building on that —" beats waiting for a gap that never comes.
- **If you get talked over,** don't shrink. "I'd like to finish this thought —" said calmly is completely acceptable and re-establishes your turn.
- **Signal you're brief** when you are: "Quick point —" earns you the floor because it promises to give it back.

**The prepared-question move:**
If you tend to freeze, go in with one thing ready — a question or a point you've pre-written. You don't have to improvise brilliance; you have to contribute *something* of value, once. That single contribution is what people remember.

**Watch out for:**
Repeating a point that's already been made just to be heard, or the "I was going to say that" after someone else says it. Both cost credibility. Add, don't echo.

**The takeaway:**
Influence comes from signal, not volume. Do the thinking, then deliver one clean sentence, claim your moment calmly, and — crucially — say the thing at least once. A meeting you sat through silently is a meeting you weren't really in.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What most distinguishes people who influence meetings from those who don't?",
          options: [
            "They speak for the largest share of the meeting",
            "They add clear signal at the right moment, in one clean sentence",
            "They always agree with the most senior person",
            "They take the most detailed notes",
          ],
          correct_index: 1,
          model_answer:
            "Influence comes from signal, not airtime — a single well-placed, well-formed contribution shapes decisions more than lots of rambling, thinking-out-loud talk.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "In a planning meeting, the team is about to commit to a launch date that you think is too aggressive because of a known dependency. You get a gap to speak. Say your one clean contribution — enter cleanly, make the point, keep it tight.",
          model_answer:
            "Can I add one risk before we lock the date? We're depending on the data team's migration, and they told me last week they're already stretched — so a Friday launch assumes they hit their date with no slack. I'd suggest we either confirm their commitment now or add a one-week buffer, rather than find out on launch day.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "Going into a meeting with one pre-written point or question is the simplest cure for freezing — you don't have to improvise brilliance, just contribute something of value once.",
      ],
    },
    {
      slug: "disagreeing-professionally",
      title: "Disagreeing Professionally",
      summary:
        "Disagreement is where value gets created — if you do it right. Align on the shared goal first, attack the idea not the person, and stay genuinely open.",
      body: `**The idea:**
Teams that can't disagree make bad decisions politely. But disagreement done badly — combative, personal, or point-scoring — poisons trust. The skill is productive disagreement: challenging the idea hard while keeping the relationship and the shared goal intact.

**The four moves:**
1. **Affirm the shared goal first.** "We both want this launch to succeed —" reframes the exchange as two people on the same side solving a problem, not two opponents.
2. **Attack the idea, not the person.** "I think this approach has a risk" — never "I think you haven't thought this through."
3. **Bring reasoning, not just opposition.** "I disagree" is noise; "I disagree *because* X, and here's what I'd worry about" is signal.
4. **Stay genuinely open.** "…but I might be missing something — what am I not seeing?" This isn't weakness; it's what makes people willing to hear you.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "goal", "label": "Affirm the shared goal ('we both want X')", "row": 0, "col": 0 },
    { "id": "idea", "label": "Challenge the idea, not the person", "row": 1, "col": 0 },
    { "id": "reason", "label": "Bring reasoning & evidence, not just 'no'", "row": 2, "col": 0 },
    { "id": "open", "label": "Stay open ('what am I not seeing?')", "row": 3, "col": 0 }
  ],
  "edges": [
    { "from": "goal", "to": "idea" },
    { "from": "idea", "to": "reason" },
    { "from": "reason", "to": "open" }
  ],
  "caption": "Productive disagreement: same side first, then challenge hard on the substance, stay genuinely open — and once it's decided, disagree and commit."
}
\`\`\`

**In practice:**
> ❌ "That won't work. We've tried that before."
> ✅ "I want the same outcome here, and I'd push back on this approach — when we tried something similar last year it broke under load. Could we pressure-test it first, or is there a reason this time is different?"

The second is just as firm on the substance, but it's collaborative, evidenced, and leaves a door open.

**Disagreeing with someone senior:**
Frame it as offering information, not challenging authority: "One thing I'd want to flag before we commit —". You're helping them make a better call with full data, which is exactly what good leaders want. Deliver it, then genuinely defer to the decision once it's made.

**Watch out for:**
Winning the argument and losing the room. Being technically right while making someone look foolish costs you more than the point is worth. And once a decision is made, "disagree and commit" — get behind it fully rather than re-litigating in the hallway.

**The takeaway:**
Align on the goal, challenge the idea with reasons, stay open, and defer gracefully once it's decided. The aim isn't to win — it's to help the team reach the better answer together.`,
      questions: [
        {
          kind: "multi",
          prompt: "Which moves make disagreement productive rather than damaging? Select all that apply.",
          options: [
            "Affirming the shared goal before introducing the friction",
            "Challenging the idea rather than the person",
            "Bringing your reasoning, not just your opposition",
            "Making sure the other person clearly loses the argument",
          ],
          correct_indices: [0, 1, 2],
          model_answer:
            "Align on the shared goal, attack the idea not the person, and bring reasons. 'Winning' by making someone look foolish costs more than the point is worth.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "Adding 'I might be missing something — what am I not seeing?' to a disagreement is a sign of weakness that undermines your position.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Staying genuinely open signals confidence, not weakness — it's what makes people willing to actually hear your challenge instead of digging in against it.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "Your manager proposes an approach in a meeting that you believe will create tech debt the team will regret. Disagree professionally — align on the goal, challenge the idea with a reason, stay open. Two to four sentences.",
          model_answer:
            "I'm with you on shipping this quickly — that's the right priority. My one worry is that hard-coding the rules now will be painful to unwind when we add the next region, and I've seen that turn into weeks of rework. Could we spend an extra day making it config-driven, or is the timeline too tight for that? Genuinely open if you think the trade-off's worth it — just wanted it on the table before we commit.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "\"Disagree and commit\" is the norm on high-trust teams: argue your case hard before the decision, then get fully behind it once it's made — re-litigating in the hallway is what erodes trust.",
      ],
    },
    {
      slug: "presenting-and-qa",
      title: "Presenting & Handling Q&A",
      summary:
        "Open with why it matters, structure so the point survives, and treat Q&A as the real test — answer first, then explain, and never bluff.",
      body: `**The idea:**
A presentation is not an information dump — it's an argument delivered live. Most presentations fail in the first minute (no hook, no reason to listen) or in the Q&A (defensive, rambling, or bluffing). Nail the open and the questions, and the middle takes care of itself.

**Open with the "so what":**
Don't start with agenda and background. Start with why the room should care:
> ❌ "Today I'll walk through the Q3 metrics, then the roadmap, then some risks…"
> ✅ "We're on track to hit our Q3 target, but one trend could cost us Q4 — here's what it is and what I'm recommending."

The second earns attention immediately. Lead with the headline (Pyramid Principle), then support it.

**Structure so the point survives:**
People forget most of what they hear. Decide the *one thing* you want them to remember and build everything toward it. Signpost the journey ("three things: the number, the risk, the ask") so they can follow and know when you're landing.

**Q&A is the real test — three rules:**
1. **Answer first, then explain.** "Yes — and here's why," not a two-minute wind-up. If asked a yes/no, lead with the yes/no.
2. **Don't bluff.** "I don't know — I'll find out and follow up by end of day" is far stronger than a confident guess that unravels on the next question. Bluffing is the single fastest way to lose a room's trust.
3. **Reframe hostile questions charitably.** Answer the strongest reasonable version of the question, not the sharpest jab. It keeps you composed and looks generous.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "q", "label": "A question lands", "row": 0, "col": 1 },
    { "id": "ans", "label": "Answer first (yes/no/the point)", "row": 1, "col": 0 },
    { "id": "unk", "label": "Don't actually know?", "row": 1, "col": 2 },
    { "id": "exp", "label": "Then explain / give the reason", "row": 2, "col": 0 },
    { "id": "follow", "label": "'I'll find out and follow up by EOD'", "row": 2, "col": 2 }
  ],
  "edges": [
    { "from": "q", "to": "ans", "label": "you know it" },
    { "from": "ans", "to": "exp" },
    { "from": "q", "to": "unk", "label": "you don't" },
    { "from": "unk", "to": "follow" }
  ],
  "caption": "Q&A is the real test: answer first then explain — and never bluff. A confident guess that unravels on the next question costs the room's trust."
}
\`\`\`

**Handling the curveball:**
Buy a beat honestly — "Good question, let me think for a second" — instead of filling the silence with filler. A short, composed pause reads as confidence; a stream of "um, so, basically" reads as panic.

**Watch out for:**
Reading your slides aloud, and apologising your way through ("sorry, this is a bit rough…"). The room takes your framing of your own work — present it as if it's worth their time, because you decided it was.

**The takeaway:**
Lead with why it matters, drive everything toward one memorable point, and in Q&A answer first, admit what you don't know, and stay composed. The talk sells the idea; the Q&A sells *you.*`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Q&A, what's the recommended way to handle a question you genuinely can't answer?",
          options: [
            "Give your most confident guess so you don't look unprepared",
            "Deflect it back to the person who asked",
            "Say you don't know and commit to following up by a specific time",
            "Change the subject to something you do know",
          ],
          correct_index: 2,
          model_answer:
            "'I don't know — I'll find out and follow up by end of day' beats a confident guess that unravels on the next question. Bluffing is the fastest way to lose a room's trust.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "A strong presentation should open with the agenda and background so the audience has full context before the main point.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Open with the 'so what' — the headline and why the room should care (Pyramid Principle). Agenda-and-background openings waste the minute when attention is highest.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "You're presenting a proposal to switch analytics tools. Someone senior interrupts, fairly sharply: \"This just sounds like extra work for the team with no real benefit.\" Respond in a way that stays composed, reframes the question charitably, and answers it.",
          model_answer:
            "That's a fair challenge — the migration is real work, so it's only worth it if the payoff is clear. The benefit is concrete: the team currently loses about a day a week stitching reports together by hand, and the new tool automates that, so it pays back the migration cost in under two months. If you're not convinced the time saving is real, I'd be glad to show the actual hours from last quarter — that's the number this whole case rests on.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "In Q&A, answering the strongest reasonable version of a hostile question — rather than the sharpest jab — keeps you composed and reads as generous, which wins the room more than a clever comeback.",
      ],
    },
  ],
};
