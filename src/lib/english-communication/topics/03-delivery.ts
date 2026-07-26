import { EcChapter } from "../types";

export const delivery: EcChapter = {
  slug: "delivery",
  title: "Delivery: How It Lands",
  summary:
    "You can have the right point and the right structure and still lose the room. Delivery — concision, tone, and calibrated confidence — is what turns a correct message into a persuasive one.",
  sections: [
    {
      slug: "concision",
      title: "Cut the Filler",
      summary:
        "Concision is respect made measurable. Every filler phrase you cut makes the real message easier to find and your point harder to dismiss.",
      body: `**The idea:**
Concision means saying exactly what's needed and then stopping. It's not about being terse or dropping warmth — it's about removing the words that do no work, so the words that matter stand out. A concise message reads as confident; a padded one reads as unsure.

**The filler that hides in every draft:**
- **Throat-clearing openers:** "I just wanted to reach out to say…", "I was thinking that maybe…", "So basically what happened is…". Delete them and start with the actual sentence.
- **Redundant pairs:** "each and every", "first and foremost", "in and of itself".
- **Empty intensifiers:** "very", "really", "actually", "literally", "quite". They add length, not weight.
- **Hedges on autopilot:** "I think", "sort of", "kind of", "just", "a bit". One hedge can be honest; a pile of them sounds nervous.

**Before and after:**
> ❌ "I just wanted to quickly check in and see if you had maybe had a chance to possibly take a look at the doc I sent over, no worries at all if not!"
> ✅ "Have you had a chance to review the doc? No rush."

\`\`\`viz:table-diff
{
  "columns": ["The same nudge"],
  "before": [["I just wanted to quickly check in and see if you had maybe had a chance to possibly take a look at the doc I sent over, no worries at all if not!"]],
  "after": [["Have you had a chance to review the doc? No rush."]],
  "caption": "Cut the throat-clearing, the stacked hedges, and the empty intensifiers, and the friendlier message is the shorter one."
}
\`\`\`

Fourteen words instead of thirty-four — and the second is *friendlier*, because it isn't apologising for existing.

**The word-count test:**
After writing, try to cut 20% without losing meaning. You almost always can, and the message almost always improves. Brevity forces you to decide what actually matters.

**Watch out for:**
Over-correcting into coldness. Concision removes filler, not humanity. "Thanks for this — one change:" is concise *and* warm. The goal is signal, and a little warmth is signal too.

**The takeaway:**
Write the message, then delete every word the reader wouldn't miss. What remains is clearer, more confident, and kinder to their time.`,
      questions: [
        {
          kind: "multi",
          prompt: "Which of these are 'filler' worth cutting from a work message? Select all that apply.",
          options: [
            "\"I just wanted to reach out to say…\"",
            "The single sentence stating your actual request",
            "\"very\", \"really\", \"actually\" used as intensifiers",
            "Stacked hedges like \"I sort of think we maybe should just…\"",
          ],
          correct_indices: [0, 2, 3],
          model_answer:
            "Throat-clearing openers, empty intensifiers, and stacked hedges are filler; the sentence carrying your actual request is the one thing you must keep.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "Make this concise without losing the friendliness: \"I just wanted to quickly check in and see if you had maybe had a chance to possibly take a look at the doc I sent over the other day, no worries at all if not!\"",
          model_answer:
            "Have you had a chance to review the doc I sent? No rush — just let me know if you'd like changes.",
          difficulty: "intermediate",
        },
      ],
      facts: [
        "Trying to cut 20% from any draft almost always works — and almost always improves it. Length is rarely the message; it's usually what's hiding it.",
      ],
    },
    {
      slug: "tone-and-register",
      title: "Match Your Tone to the Room",
      summary:
        "Register is how formal or casual you are; tone is the emotional colour. Reading the room — and adjusting both — is what separates fluent professionals from merely correct ones.",
      body: `**The idea:**
Two messages can carry identical information and land completely differently because of *tone* (the emotional signal — warm, urgent, neutral, apologetic) and *register* (the formality level — a Slack quip vs. a board email). Fluency isn't one perfect voice; it's the range to match the moment.

**Register: read the channel and the reader.**
- A quick Slack to a teammate: contractions, lower-case, an emoji is fine.
- An email to a client or senior leader: complete sentences, a clear subject, no slang.
- A message to someone you've never met: start a notch more formal — you can always warm up, but you can't un-send over-familiarity.

The mistake in both directions: stiff, robotic formality with a close colleague reads as cold; breezy casualness with a new client reads as careless.

**Tone: mind the emotional signal, especially in writing.**
Text strips out your face and voice, so neutral messages often read as *colder* than you mean. "Per my last email" or a blunt "No." can feel hostile on screen even when you felt neutral typing it. Two cheap fixes:
1. **A word of warmth costs nothing:** "Thanks for flagging this —" before a correction changes the whole temperature.
2. **Read it as your reader on a bad day.** If there's any way to read it as sharp, soften the edge or add context.

**The specific trap — sensitive news:**
Bad news, pushback, and feedback need tone *and* structure. Lead with brief framing, be direct about the substance, and be warm about the person: "I know this timeline is tight, so I want to be straight with you: we can't hit Friday. Here's what we *can* do…"

**Watch out for:**
Sarcasm and jokes in writing. They rely on tone of voice you don't have on screen, and they misfire across seniority and culture. If it could be misread, it will be.

**The takeaway:**
Before sending, ask two questions: *is my formality matched to this channel and reader?* and *could this be read as colder or sharper than I mean?* Adjust both, and your message lands the way you intended.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why do neutral written messages often land as 'colder' than intended?",
          options: [
            "Because written words are inherently rude",
            "Because text strips out facial expression and tone of voice, so the reader supplies their own",
            "Because short messages are always aggressive",
            "Because formality always signals hostility",
          ],
          correct_index: 1,
          model_answer:
            "Writing removes your face and voice, so a neutral message can read as cold — the reader fills the emotional gap themselves. A word of warmth or a little context offsets it.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "Using the same formal register with everyone — a close teammate and a new client alike — is the safest professional choice.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Register should match the channel and reader: stiff formality with a close colleague reads as cold, while over-casual with a new client reads as careless. Fluency is the range to adjust.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "A teammate's late code review has now blocked your work for two days. Write a Slack message that raises it directly but keeps the tone collaborative, not accusatory.",
          model_answer:
            "Hey Sam — I'm blocked on the checkout PR waiting for your review, and it's been a couple of days now, so I wanted to flag it before it slips further. Totally get you're swamped; is there a time today you can get to it, or should I ask someone else to take a look so we don't lose more time? Happy to hop on a quick call if that's faster.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "Sarcasm is the riskiest thing you can put in a work message — it depends on a tone of voice the reader can't hear, and it misfires most across seniority and culture.",
      ],
    },
    {
      slug: "confident-not-arrogant",
      title: "Confident, Not Arrogant",
      summary:
        "Confidence is stating your view plainly and owning what you don't know. It sits between the mumbling under-sell and the over-claiming that makes people stop trusting you.",
      body: `**The idea:**
Confidence in communication isn't volume or certainty — it's the calm ownership of your message. It lives between two failure modes: **under-confidence** (so many hedges the point dissolves) and **over-confidence** (claiming more certainty than you have, which torches trust the first time you're wrong).

**Drop the reflexive hedges.**
Many capable people bury good points under apology: "This might be a silly question, but…", "I'm probably wrong, but…", "Sorry to bother you…". These pre-emptive discounts train listeners to weight your ideas less. Cut them. Compare:
> ❌ "Sorry, this is probably a dumb idea and you've likely thought of it, but maybe we could possibly try caching?"
> ✅ "One option: we cache the results. That should cut the load time."

The second isn't arrogant — it just states the idea and lets it stand.

**Confidence includes owning uncertainty — precisely.**
The most credible move is being exact about your confidence level. "I'm certain about the revenue number; I'm guessing on the timeline — I'd want a day to confirm it." That *builds* trust, because people learn your "certain" means certain. Vague over-claiming ("it'll definitely be fine") does the opposite.

**Assertive ≠ aggressive.**
- **Passive:** "Whatever you all think is fine." (no view — unhelpful)
- **Aggressive:** "That's wrong, we're doing it my way." (a view, no respect)
- **Assertive:** "I see it differently — here's why, and I'm open to being wrong." (a clear view, held with respect)

\`\`\`viz:flow
{
  "nodes": [
    { "id": "passive", "label": "Passive: 'Whatever you think is fine' (no view)", "row": 0, "col": 0 },
    { "id": "assertive", "label": "Assertive: clear view, held openly (the target)", "row": 0, "col": 1 },
    { "id": "aggressive", "label": "Aggressive: 'We're doing it my way' (no respect)", "row": 0, "col": 2 }
  ],
  "edges": [],
  "caption": "Confidence sits in the middle: state your position AND leave room for others. Under-confidence dissolves the point; over-confidence torches trust."
}
\`\`\`

Assertive is the target: state your position *and* leave room for others.

**Watch out for:**
Confidence as a mask for not knowing. If you don't know, "I don't know — I'll find out by end of day" is far stronger than a confident guess that collapses under one follow-up question.

**The takeaway:**
Say your point without apologising for it, be precise about how sure you are, and hold your view firmly *and* openly. That combination reads as someone worth listening to.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Which response is 'assertive' — the target between passive and aggressive?",
          options: [
            "\"Whatever you all think is fine.\"",
            "\"That's wrong, we're doing it my way.\"",
            "\"I see it differently — here's why, and I'm open to being wrong.\"",
            "\"Sorry, this is probably a dumb idea, but maybe…\"",
          ],
          correct_index: 2,
          model_answer:
            "Assertive states a clear view while leaving room for others: \"I see it differently — here's why, and I'm open to being wrong.\" Passive gives no view; aggressive gives no respect.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "Admitting \"I don't know — I'll find out by end of day\" undermines your credibility and should be avoided.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Precisely owning what you don't know builds trust — it's far stronger than a confident guess that collapses under the first follow-up question.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "In a planning meeting you disagree with a popular proposal to ship a feature without a beta test. State your disagreement confidently but not arrogantly — clear view, still open. Two to four sentences.",
          model_answer:
            "I'd push back on skipping the beta. My worry is that this touches billing, and a bug there costs us trust we can't easily win back — a one-week beta with 20 users would catch the worst of it cheaply. I could be wrong about the timeline pressure, so if shipping now is non-negotiable, can we at least gate it behind a flag and roll out to 5% first? Happy to go with the room, but I wanted my concern on the record.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "Reflexive hedges — \"sorry\", \"this might be dumb\", \"I'm probably wrong\" — act as pre-emptive discounts: they train listeners to weight your ideas less before you've even made them.",
      ],
    },
  ],
};
