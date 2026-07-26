import { EcChapter } from "../types";

export const writtenCommunication: EcChapter = {
  slug: "written-communication",
  title: "Written Communication",
  summary:
    "Most of your work reputation is written. Master the email that gets read, the chat message that doesn't get misread, and the follow-up that gets a reply.",
  sections: [
    {
      slug: "email-that-gets-read",
      title: "Email That Gets Read",
      summary:
        "A good email earns the open with its subject line, delivers the point in the first line, and makes the ask impossible to miss.",
      body: `**The idea:**
Email is where clarity goes to die: buried asks, vague subjects, and walls of text that get starred "to read later" and never reopened. A good work email is engineered so a skimming reader gets the point and the action in seconds.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "email", "label": "An email that gets read & actioned", "highlight": true, "children": ["subj", "bl", "ask", "warm"] },
    { "id": "subj", "label": "Subject: specific, names the action & deadline" },
    { "id": "bl", "label": "First line: the bottom line / the ask" },
    { "id": "ask", "label": "The ask made scannable: bold it, bullet the options" },
    { "id": "warm", "label": "A line of warmth (email runs cold)" }
  ],
  "rootId": "email",
  "caption": "Engineer every email for an eight-second skim: a subject that earns the open, the point up front, a scannable ask, and enough warmth that neutral doesn't read as curt."
}
\`\`\`

**The subject line is the whole email's headline:**
Most people decide whether (and when) to open based on the subject alone. Make it specific and, where useful, name the action:
> ❌ "Quick question" · "Update" · "Following up"
> ✅ "Approval needed by Thu: vendor choice for payments" · "FYI (no action): launch moved to the 14th"

Flagging the action and deadline in the subject respects the reader and gets you a faster response.

**Put the bottom line first (BLUF, again):**
The first sentence should carry the point or the ask. Assume they read only that:
> "**I need your approval on the Stripe contract by Thursday.** Context below." Then the detail, then — if there's an action — make it visually unmissable.

**Make the ask scannable:**
For anything with more than one moving part, use structure. A reader should find "what do you need from me?" without hunting:
> **What I need:** your sign-off on the budget line.
> **By when:** Thursday EOD.
> **Why:** the vendor holds the price until Friday.

Bold the ask, bullet the options, keep paragraphs to 2–3 lines. White space is a feature, not a waste.

**Tone in writing runs cold — warm it deliberately:**
Email strips out your voice, so neutral reads as curt. A one-line human opener ("Hope your week's going well —") and a genuine sign-off cost nothing and change how the whole thing lands. And re-read anything written while annoyed *before* sending; "per my last email" is rarely as neutral as it feels.

**Watch out for:**
The multi-ask email where three requests hide in a paragraph and only one gets answered. If you need three things, number them — or send three focused emails. And "reply-all" only when everyone genuinely needs it.

**The takeaway:**
Specific subject, bottom line first, ask made scannable, a touch of warmth. Write every email for a reader who will skim it in eight seconds — because they will.`,
      questions: [
        {
          kind: "multi",
          prompt: "Which practices make a work email more likely to get read and actioned? Select all that apply.",
          options: [
            "A specific subject line that names the action and deadline",
            "The bottom line or ask in the first sentence",
            "Bolding the ask and using bullets/white space for scannability",
            "Combining several unrelated requests into one dense paragraph",
          ],
          correct_indices: [0, 1, 2],
          model_answer:
            "Specific subject, bottom line first, and a scannable ask all help. Burying several requests in one paragraph means only one gets answered.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "You need a colleague, Priya, to approve a $4k budget line for a conference booth by this Thursday, because the vendor holds the price until Friday. Write the email — subject line included — so the ask and deadline are impossible to miss.",
          model_answer:
            "Subject: Approval needed by Thu — $4k booth budget (price held till Fri)\n\nHi Priya — hope your week's going well. I need your sign-off on a $4k budget line for our booth at the conference. What I need: a yes/no reply. By when: Thursday EOD. Why the deadline: the vendor holds this price until Friday, after which it goes up ~15%. Details and the quote are attached — happy to jump on a quick call if anything's unclear. Thanks!",
          difficulty: "advanced",
        },
      ],
      facts: [
        "Readers triage email by subject line alone — putting the action and deadline in the subject (\"Approval needed by Thu\") gets a faster reply than any amount of polish in the body.",
      ],
    },
    {
      slug: "chat-and-async",
      title: "Chat & Async Etiquette",
      summary:
        "Slack and async writing reward respect for other people's attention: front-load context, don't make people wait on a lonely 'hi', and assume good intent.",
      body: `**The idea:**
Chat tools feel casual, but they're where most modern work coordination happens — and small habits there compound into big reputations. Good async communicators optimise for the *reader's* time and attention, not their own convenience.

**Never send a lonely "hi":**
> ❌ "Hey, you there?" *(…reader waits, anxious, for the actual message)*
> ✅ "Hey — quick one: do we have the client's sign-off on the copy, or is that still pending? No rush."

Making someone wait for the real message after a bare greeting is a small tax on their attention paid many times a day. Put the question *in the first message.*

**Front-load context in async:**
The person reading your message doesn't have your last hour of thinking in their head. A message that assumes shared context ("did it work?") forces a round-trip of "did what work?". Give the anchor: "The deploy to staging I mentioned — did it go through, or still failing?"

**Match urgency to the channel — and say it:**
A DM at 9pm reads as urgent even if it isn't. If it can wait, say so ("no rush, tomorrow's fine"). If it's genuinely urgent, say *that* and use the channel that matches. Mismatched urgency signals are how people burn out or miss real fires.

**Tone: assume good intent, and give it:**
Text is terse by nature, so read others' messages in the most generous light — a blunt reply is usually busy, not hostile. And add the small warmth that keeps *your* messages from reading cold: an emoji, a "thanks!", a "no worries". These aren't unprofessional; they're the tone of voice text otherwise lacks.

**Watch out for:**
Important decisions made in ephemeral DMs that no one else can see or search. If it affects the team, move it to a shared channel or write it down — async communication is also a record.

**The takeaway:**
Put the question in the first message, front-load context, signal real urgency honestly, and assume (and give) good intent. Async done well is one of the highest-leverage professional skills there is.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is sending a lone \"hey, you there?\" and waiting before stating your question considered poor async etiquette?",
          options: [
            "It's too informal for the workplace",
            "It makes the reader wait anxiously for the real message — a repeated tax on their attention",
            "It uses too many characters",
            "It should always be an email instead",
          ],
          correct_index: 1,
          model_answer:
            "The bare greeting forces the reader to wait for the actual question, paying a small attention tax many times a day. Put the question in the first message.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "Because text lacks tone of voice, you should assume a blunt or terse message from a colleague is probably a sign of hostility.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Assume good intent — a terse message is usually someone being busy, not hostile. Read others generously, and add small warmth to your own messages to offset text's natural coldness.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "You need to ask a busy colleague, over Slack, whether the staging deploy you set up earlier went through — it's not urgent, tomorrow is fine. Write the single message (no lonely 'hi' first), front-loading enough context that they can answer without a follow-up.",
          model_answer:
            "Hey Sam — no rush on this, tomorrow's totally fine: did the staging deploy for the checkout service (the one I kicked off around lunch) go through cleanly, or is it still erroring on the migration step? Just want to know whether I can start testing on it in the morning. Thanks!",
          difficulty: "intermediate",
        },
      ],
      facts: [
        "Decisions made in ephemeral one-to-one DMs vanish from the team's shared memory — if it affects others, moving it to a searchable channel is part of communicating well async.",
      ],
    },
    {
      slug: "requests-and-follow-ups",
      title: "Requests & Follow-ups",
      summary:
        "Getting things from people is a skill: make the request easy to say yes to, and follow up in a way that's persistent without being annoying.",
      body: `**The idea:**
So much of work is getting other people to do things — review a doc, make a decision, unblock you. Vague requests get ignored; nagging follow-ups get resented. Both are learnable.

**Make the request easy to say yes to:**
A good request lowers the effort of the "yes." Give the person everything they need to act in one message:
- **The specific ask** — "review section 3" beats "take a look at this".
- **The why** — a reason gets more yeses than a bare demand (even a small reason works).
- **The deadline** — "by Thursday" beats "when you get a chance," which means never.
- **The easy path** — attach the doc, pre-fill the form, propose the time. Every click you remove raises your odds.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "ask", "label": "Specific ask ('review section 3')", "row": 0, "col": 0 },
    { "id": "why", "label": "A reason (even a small one)", "row": 1, "col": 0 },
    { "id": "when", "label": "A concrete deadline ('by Thursday')", "row": 2, "col": 0 },
    { "id": "easy", "label": "The easy path (doc attached, time proposed)", "row": 3, "col": 0 }
  ],
  "edges": [
    { "from": "ask", "to": "why" },
    { "from": "why", "to": "when" },
    { "from": "when", "to": "easy" }
  ],
  "caption": "Each element lowers the effort of the 'yes'. 'Whenever you get a chance' has no ask, no reason, and no deadline — which is why it means never."
}
\`\`\`

> ❌ "Can you look at the proposal at some point?"
> ✅ "Could you review just the pricing section (p.3) of the proposal by Thursday? It's the one part I'm unsure on, and I want to send it Friday. Doc's attached, should take 10 minutes."

**The follow-up that works:**
Following up is not rude — a dropped request helps no one. The trick is tone and cadence:
1. **Assume the best.** "Just floating this back up in case it slipped —" not "You still haven't done this."
2. **Re-make it easy.** Re-link the doc, restate the ask, so they don't have to dig.
3. **Add a gentle reason to act now.** "I'm sending it Friday, so any thoughts before then would be great."
4. **Give an out.** "If you're slammed, just say and I'll ask Sam" — this often gets you either the thing or a fast redirect.

**Escalate gracefully:**
If two friendly nudges get nothing on something that matters, it's fair to raise the stakes calmly — a clear "I need this by X or Y happens" or looping in the right person — without drama or blame.

**Watch out for:**
The passive-aggressive follow-up ("Per my previous three messages…"). It feels satisfying and costs you goodwill you'll want later. Stay warm even when you're frustrated — it works better *and* protects the relationship.

**The takeaway:**
Make requests specific, reasoned, deadlined, and effortless; follow up assuming the best and re-making it easy. Persistence with warmth gets you what you need without the resentment.`,
      questions: [
        {
          kind: "multi",
          prompt: "What makes a request easy for a busy person to say yes to? Select all that apply.",
          options: [
            "A specific ask ('review section 3', not 'take a look')",
            "A reason, even a small one",
            "A concrete deadline",
            "Leaving the timing open with 'whenever you get a chance'",
          ],
          correct_indices: [0, 1, 2],
          model_answer:
            "Specific ask + a reason + a concrete deadline (plus removing effort) all raise your odds. 'Whenever you get a chance' effectively means never.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "You asked a colleague three days ago to review a doc before you send it to a client tomorrow, and haven't heard back. Write a follow-up that's persistent but warm — assume the best, re-make it easy, and give them an out.",
          model_answer:
            "Hey Alex — floating this back up in case it got buried: I'm hoping to send the client proposal tomorrow morning, and your eyes on the pricing section (p.3) would really help before it goes. Re-linking it here so you don't have to dig — it's a 10-minute read. If you're swamped and can't get to it by tonight, no problem at all, just let me know and I'll send it as-is or grab Sam. Thanks either way!",
          difficulty: "advanced",
        },
      ],
      facts: [
        "Adding even a small reason to a request measurably raises compliance — people are wired to say yes more readily to \"can you do X, because Y\" than to \"can you do X\" alone.",
      ],
    },
  ],
};
