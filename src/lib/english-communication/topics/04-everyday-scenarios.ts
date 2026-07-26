import { EcChapter } from "../types";

export const everydayScenarios: EcChapter = {
  slug: "everyday-scenarios",
  title: "Everyday Workplace Scenarios",
  summary:
    "The high-frequency moments that quietly shape your reputation: introducing yourself, reporting status, giving and taking feedback, and saying no without burning a bridge.",
  sections: [
    {
      slug: "introductions",
      title: "Introducing Yourself",
      summary:
        "A good introduction answers three silent questions — who are you, why should I care, and what happens next — in about twenty seconds.",
      body: `**The idea:**
Whether you're joining a new team, meeting a client, or speaking up first in a workshop, your introduction is a tiny pitch. People form a working impression in seconds, and a rambling or over-modest intro wastes the one moment they're actually paying attention to you.

**The three questions a good intro answers:**
1. **Who are you?** Name and role — the anchor.
2. **Why should I care?** The relevant hook: what you do *for them* or the thing you share.
3. **What happens next?** A hand-off — a question, an offer, or a reason to talk again.

**Same person, right-sized for the moment:**
> **Joining a team (Slack):** "Hi all — I'm Dev, the new backend engineer. I'll mostly be on the payments service, so you'll see me in those PRs. Happy to pair with anyone this week to get up to speed — just ping me."
> **Meeting a client:** "I'm Dev, I lead the integration side of this project. My job is basically to make sure the hand-off to your systems is painless. What's the part of this you're most worried about?"

Both are short, both make the other person's life the point, and both end with an open door.

**The confidence calibration:**
Two failure modes bookend a good intro. The over-modest version — "Oh, I'm just the new junior, I probably won't be much help" — pre-discounts you before you've started. The over-selling version — a two-minute résumé recital — reads as insecure in the other direction. Aim for the middle: a plain statement of who you are and why it's relevant, no apology and no brag.

**Watch out for:**
The context-free intro that lists your job title and stops. "I'm Dev, backend engineer" tells people what you *are*, not why this conversation matters. One clause of relevance ("…so I'll own the payments work") does more than any title.

**The takeaway:**
Prepare a flexible three-part intro — who, why it matters to *them*, and an open door — and resize it to the moment. Twenty confident seconds beats two rambling minutes every time.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What are the three silent questions a strong self-introduction should answer?",
          options: [
            "Where you studied, who you know, and how senior you are",
            "Who you are, why the listener should care, and what happens next",
            "Your job title, your salary band, and your start date",
            "Your hobbies, your strengths, and your weaknesses",
          ],
          correct_index: 1,
          model_answer:
            "Who you are, why the listener should care (the relevant hook), and what happens next (a question or open door) — roughly twenty seconds.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "You're joining a new cross-functional team as a product designer. Write a short Slack introduction (2–3 sentences) that says who you are, why it matters to them, and leaves an open door.",
          model_answer:
            "Hi everyone — I'm Maya, the product designer joining the onboarding squad. I'll be redesigning the signup flow we've all been complaining about, so I'll be leaning on you for context on where users get stuck. If you've got 15 minutes this week to walk me through your corner of it, I'd love that — just drop a time.",
          difficulty: "intermediate",
        },
      ],
      facts: [
        "The strongest self-introductions spend more words on why the listener should care than on the speaker's own title — relevance beats résumé.",
      ],
    },
    {
      slug: "status-updates",
      title: "Status Updates That Land",
      summary:
        "A status update exists to answer one question — are we OK? — fast. Lead with the headline, flag risks early, and make any ask explicit.",
      body: `**The idea:**
A status update is not a diary of everything you did. It's a signal to a busy reader answering one question: *is this on track, and is there anything I need to do?* The best updates can be understood in five seconds and read in full in thirty.

**The shape — headline, then detail (this is BLUF applied):**
1. **The headline:** On track / at risk / blocked — in the first line.
2. **What changed** since last time (not everything, just the delta).
3. **Risks or blockers**, flagged early enough to act on.
4. **The ask**, if any — explicit, with a name and a date.

**Vague vs. useful:**
> ❌ "Made good progress on the migration this week, did a bunch of testing, ran into a few things, should be fine, will keep going."
> ✅ "**Migration: on track for Friday.** Backend cutover is done and tested; the last piece is the data backfill, running now. **One risk:** if the backfill finds bad rows we may slip to Monday — I'll know by Wednesday. **No ask right now.**"

The second version lets a manager relax (or intervene) in one glance.

**The 'red' rule — surface bad news early:**
The hardest and most valuable habit: flag "at risk" *while there's still time to help,* not on the deadline. A blocker raised on Tuesday is a problem you solve together; the same blocker revealed on Friday is a failure. Managers overwhelmingly prefer an early, honest "at risk" to a last-minute surprise. Green-washing a status you know is shaky is the fastest way to lose trust.

**Watch out for:**
Effort theatre — listing hours worked and tasks touched as if activity equals progress. Report outcomes and status, not busyness. "I spent three days on X" isn't a status; "X is done" or "X is blocked on Y" is.

**The takeaway:**
Open with the one word your reader needs (on track / at risk / blocked), give only the delta, and raise risks early enough to matter. A status update is a favour to your reader, not a log of your week.`,
      questions: [
        {
          kind: "truefalse",
          prompt: "It's more professional to keep a status 'green' until you're certain a deadline will slip, to avoid alarming your manager unnecessarily.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Surfacing 'at risk' early — while there's still time to help — is what managers prefer and what protects trust. A last-minute surprise is far worse than an early honest flag.",
          difficulty: "intermediate",
        },
        {
          kind: "multi",
          prompt: "Which belong in a strong status update? Select all that apply.",
          options: [
            "A one-line headline: on track / at risk / blocked",
            "Only the changes since the last update, not everything you did",
            "Risks flagged early enough to act on",
            "A full log of every hour you spent this week",
          ],
          correct_indices: [0, 1, 2],
          model_answer:
            "Lead with a headline, report the delta, and flag risks early. An hour-by-hour activity log is effort theatre, not status.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "Write a weekly status update for this situation: the feature is mostly done and still on track for next Friday, but you're waiting on a legal review of the terms copy that could push it to the following Monday if it comes back with changes. Lead with the headline.",
          model_answer:
            "Feature X: on track for Friday, one dependency. Engineering and QA are done; the only open item is legal's review of the terms copy, which I requested Monday. Risk: if legal comes back with changes, we slip to the following Monday — I'll know by Thursday. Ask: if anyone has a line to the legal team, a nudge to prioritise this would de-risk the date.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "Managers consistently rank an early, honest \"this is at risk\" above a confident status that collapses at the deadline — reliability of your signal matters more than the colour of it.",
      ],
    },
    {
      slug: "giving-and-receiving-feedback",
      title: "Giving and Receiving Feedback",
      summary:
        "SBI — Situation, Behaviour, Impact — keeps feedback specific and non-accusatory. Receiving it well is a skill too: get curious, not defensive.",
      body: `**The idea:**
Most feedback fails because it's vague ("be more proactive"), personal ("you're careless"), or both. The **SBI** framework fixes this by anchoring feedback to observable facts instead of character judgments:
- **Situation:** when and where. "In yesterday's client call…"
- **Behaviour:** what you actually observed — not your interpretation. "…you answered the pricing question before the client had finished asking it."
- **Impact:** the effect it had. "…and I noticed they went quiet afterwards; I think they felt cut off."

**Why SBI works:**
It separates *behaviour* from *identity.* "You interrupted the client" is a specific, fixable action; "you're rude" is an attack on who they are, and people defend their identity far harder than they defend a single action. SBI also removes mind-reading — you report the impact *you observed,* not the motive you assumed.

**Praise deserves SBI too:**
Good feedback isn't only corrective. "Great job!" is nice but teaches nothing. "In the standup (S), you summarised the blocker in one sentence and proposed two options (B) — it saved us ten minutes of debate and we decided on the spot (I)" tells the person exactly what to keep doing.

**Receiving feedback — the harder skill:**
When feedback lands, the instinct is to defend or explain. Resist it. The professional move:
1. **Listen fully** — don't interrupt to justify.
2. **Get curious, not defensive** — "Can you give me an example?" beats "But that's because…".
3. **Thank them** — even if you disagree; feedback is a gift that's costly to give.
4. **Decide later** — you don't have to accept every piece, but evaluate it when you're not defensive.

**Watch out for:**
The "feedback sandwich" (praise–criticism–praise) so padded the actual message gets lost. Be warm, be direct, and don't bury the point between two compliments the person will see straight through.

**The takeaway:**
Give feedback as Situation–Behaviour–Impact — observable, specific, non-accusatory. Receive it by getting curious instead of defensive. Both are muscles; both compound.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In the SBI feedback model, what does the 'B' (Behaviour) require?",
          options: [
            "Your interpretation of why the person acted that way",
            "A judgment about the person's character",
            "The specific, observable action — not your interpretation of it",
            "A comparison to how others on the team behave",
          ],
          correct_index: 2,
          model_answer:
            "Behaviour is the concrete, observable action ('you answered before they finished asking'), stated without interpretation or character judgment — that's what keeps SBI specific and non-accusatory.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "When you receive critical feedback, immediately explaining the reasons behind your actions is the most professional first response.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. The stronger first move is to listen fully and get curious ('can you give me an example?') rather than defend or explain. You can evaluate and respond later, when you're not defensive.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "A teammate keeps turning up 5–10 minutes late to your daily standup, and the team ends up repeating updates for them. Give them this feedback using SBI (Situation, Behaviour, Impact), privately and kindly.",
          model_answer:
            "Hey, can I share something quick? In the last few standups (Situation) you've joined about ten minutes in (Behaviour), and we've ended up recapping the blockers for you, which pushes the meeting long and pulls focus (Impact). I don't know if the timing clashes with something — is 9:30 hard for you? If so we could shift it; if not, it'd really help to have you there from the top.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "People defend their identity far harder than a single action — which is why \"you interrupted the client\" (a fixable behaviour) lands where \"you're rude\" (an identity attack) only triggers defence.",
      ],
    },
    {
      slug: "saying-no",
      title: "Saying No Without Burning a Bridge",
      summary:
        "You can decline, push back, or protect your time and still be a good colleague. The trick is to say no to the request while saying yes to the relationship.",
      body: `**The idea:**
Saying yes to everything isn't kindness — it's how work quality collapses and resentment builds. But a blunt "no" can damage a relationship. The skill is declining the *request* while affirming the *person and the goal:* no to the task, yes to the working relationship.

**The structure of a good no:**
1. **Acknowledge** the request and the person genuinely.
2. **Decline clearly** — no maybe-that-means-no. Ambiguity is unkind; it leaves them hoping.
3. **Give a brief, honest reason** (not a pile of excuses).
4. **Offer a path** where you can — an alternative, a later time, a different owner, or a trade-off for them to decide.

**Blunt vs. skilful:**
> ❌ "No, I can't, I'm too busy."
> ✅ "I'd like to help, but I can't take this on this week without dropping the launch work — and I don't think you'd want me to. Two options: I can pick it up Monday, or Sam knows this area and has more room right now. Which works better?"

The second says no just as firmly, but it's warm, honest, and hands the decision back.

**Pushing back on a decision (not just a task):**
Same instinct, applied to disagreement. "I see why we'd want to ship Friday, and I want that too — my concern is X. Can we do Y instead?" You're aligning on the *shared goal* before introducing the friction, which keeps it collaborative rather than obstructive.

**The saying-no-to-your-boss case:**
You usually can't just refuse — but you can make the trade-off visible: "Happy to take this on. To fit it in this week, which of my current three should slip — the report, the review, or the migration?" This isn't defiance; it's surfacing the real cost of yes so the priority call gets made by the right person.

**Watch out for:**
Over-apologising and over-explaining. A no wrapped in five sorries and a paragraph of justification reads as guilty and invites negotiation. State it once, warmly, and stop.

**The takeaway:**
Decline the request, keep the relationship: acknowledge, say no clearly, give one honest reason, and offer a path. Firm and kind are not opposites.`,
      questions: [
        {
          kind: "multi",
          prompt: "What makes a 'no' both firm and relationship-preserving? Select all that apply.",
          options: [
            "Acknowledging the request and the person genuinely",
            "Declining clearly, without a vague maybe",
            "Offering a path — an alternative, a later time, or a trade-off",
            "Wrapping it in several apologies and a long justification",
          ],
          correct_indices: [0, 1, 2],
          model_answer:
            "Acknowledge, decline clearly, and offer a path. Piling on apologies and justification reads as guilty and invites negotiation.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "Your manager asks you to take on an urgent extra project this week, but you're already at capacity with a launch. You can't simply refuse. Respond in a way that says yes to helping while making the trade-off visible.",
          model_answer:
            "Happy to take it on — I just want to make sure it doesn't sink the launch, which is also due Friday. If this is the priority, I can start it today, but I'd need to push the launch to next week or hand the QA to someone else. Which would you prefer, or is there a third option I'm missing? Just don't want to quietly drop a ball on either.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "A no wrapped in five apologies reads as guilty and invites negotiation — stating it once, warmly and clearly, is both kinder and more respected than over-softening it.",
      ],
    },
  ],
};
