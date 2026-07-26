import { EcChapter } from "../types";

export const foundations: EcChapter = {
  slug: "foundations",
  title: "Foundations of Professional Communication",
  summary:
    "Before frameworks and delivery, three habits do the heavy lifting: choose clarity over cleverness, write for a specific reader, and default to plain English.",
  sections: [
    {
      slug: "clarity-first",
      title: "Clarity Comes First",
      summary:
        "At work, the goal of communication is not to sound impressive — it's to be understood on the first read. Clarity is a kindness and a competitive advantage.",
      body: `**The idea:**
Most workplace communication fails for one reason: the reader has to work too hard to figure out what you mean. A brilliant point buried in a fog of qualifiers, jargon, and throat-clearing is, for practical purposes, a point that was never made. The professional standard is simple — *be understood on the first read.*

**Why it matters:**
Your reader is busy, skimming, and probably on their phone between two meetings. Every extra sentence they have to decode is a tax on their attention and a risk that your actual request gets missed. Clarity is not "dumbing down" — it's respect for the reader's time, and it makes *you* look like someone who thinks clearly.

**Clever vs. clear:**
> ❌ "I wanted to circle back and touch base regarding the aforementioned deliverable, as there may potentially be some bandwidth constraints impacting our ability to hit the originally agreed timeline."
> ✅ "We'll miss Friday's deadline. Can we move it to Tuesday?"

\`\`\`viz:table-diff
{
  "columns": ["The same message"],
  "before": [["I wanted to circle back and touch base regarding the aforementioned deliverable, as there may potentially be some bandwidth constraints impacting our ability to hit the originally agreed timeline."]],
  "after": [["We'll miss Friday's deadline. Can we move it to Tuesday?"]],
  "caption": "Same meaning, a third of the words. Clarity is what's left after you remove the hedging, the filler, and the vague nouns."
}
\`\`\`

The second version says more in ten words than the first says in thirty. Notice what disappeared: the hedging ("may potentially"), the filler ("circle back and touch base"), and the vague nouns ("bandwidth constraints").

**How to get there:**
1. **Lead with the point.** Say the one thing you need the reader to know before you explain it.
2. **One idea per sentence.** If a sentence has two "and"s and a "which", split it.
3. **Cut hedges.** "I just think maybe we should possibly consider" → "Let's".
4. **Read it aloud.** If you run out of breath or lose the thread, so will your reader.

**Watch out for:**
Clarity is not the same as bluntness. "Your report was wrong" is clear but needlessly harsh. Clear *and* considerate — "The Q3 figures in the report need a second look; I think two of them are off" — is the target.

**The takeaway:**
When in doubt, ask: *if my reader only remembered one sentence of this, which would I want it to be?* Put that sentence first, and cut whatever hides it.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the core standard for clarity in professional communication described here?",
          options: [
            "Use as much industry vocabulary as possible",
            "Be understood on the first read",
            "Always keep messages under three sentences",
            "Sound more senior than you are",
          ],
          correct_index: 1,
          model_answer:
            "The standard is to be understood on the first read — clarity is respect for the reader's limited time and attention.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "Being clear means being blunt — softening a message always reduces clarity.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Clarity and consideration are compatible; you can state the point plainly while still being tactful (\"the Q3 figures need a second look\" vs. \"your report was wrong\").",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "Rewrite this so a busy manager gets it on the first read, in one or two sentences: \"I wanted to circle back and touch base regarding the aforementioned deliverable, as there may potentially be some bandwidth constraints impacting our ability to hit the originally agreed timeline.\"",
          model_answer:
            "We're going to miss Friday's deadline because two people are out sick this week. Can we move it to Tuesday, or should I prioritise this over the dashboard work?",
          difficulty: "intermediate",
        },
      ],
      facts: [
        "Readers decide whether to keep reading a work message in the first sentence or two — front-loading your point is what earns the rest of their attention.",
      ],
    },
    {
      slug: "know-your-audience",
      title: "Know Your Audience",
      summary:
        "The same message needs different framing for your manager, a client, and a teammate. Adjust for what they already know, what they care about, and what they'll do next.",
      body: `**The idea:**
There is no such thing as a "good message" in the abstract — only a message that's well-matched to *this* reader. The single biggest upgrade to your communication is pausing for five seconds to ask: *who is reading this, and what do they need from it?*

**The three questions:**
1. **What do they already know?** An engineer needs the technical cause; a VP needs the impact and the plan. Explaining the database index to the VP wastes their time; hiding it from the engineer wastes yours.
2. **What do they care about?** Your manager cares about risk, timelines, and what you need from them. A client cares about outcomes and reassurance. A peer cares about how it affects *their* work.
3. **What do you want them to do?** Every message has a job: approve, decide, act, or just stay informed. Make that job obvious.

**The same news, three ways:**
The situation: a launch is delayed a week.
> **To your manager:** "Launch slips to the 14th — a vendor's API wasn't ready. No impact on the quarter's numbers. I don't need anything from you; just keeping you posted."
> **To the client:** "We're moving launch to the 14th to finish final testing, so the first thing you see is rock-solid. Nothing changes on your side."
> **To the engineer:** "Vendor API is late, so launch is the 14th. Can you use the extra week to close the two flaky tests?"

Same fact, three different framings — because each reader needs a different thing.

**Watch out for:**
The "reply-all to 40 people" message written for no one in particular. If you can't name the primary reader and the action you want, the message isn't ready.

**The takeaway:**
Write the reader's name (or role) at the top of your mind before the first word. Match their knowledge, speak to what they care about, and make the next step unmistakable.`,
      questions: [
        {
          kind: "multi",
          prompt:
            "Before sending a work message, which questions help you match it to the reader? Select all that apply.",
          options: [
            "What do they already know?",
            "What do they care about?",
            "What do I want them to do next?",
            "How can I make this sound as formal as possible?",
          ],
          correct_indices: [0, 1, 2],
          model_answer:
            "Match the reader by their existing knowledge, what they care about, and the action you want — not by maximising formality.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "A feature launch is slipping by a week because a third-party vendor's API isn't ready. Write a 2–3 sentence Slack message to your engineering manager. Assume they mainly care about impact, risk, and whether they need to act.",
          model_answer:
            "Heads up: launch is slipping from the 7th to the 14th — the payments vendor's API isn't ready, and there's no clean workaround. No impact on the quarter's targets and nothing I need from you; I'll use the extra week to close the two flaky tests. Shout if you'd rather we ship behind a flag instead.",
          difficulty: "advanced",
        },
      ],
      facts: [
        "The same fact — a one-week delay — is reassuring to a client, a risk update to a manager, and a scheduling change to an engineer. Audience, not content, decides the framing.",
      ],
    },
    {
      slug: "plain-english",
      title: "Plain English at Work",
      summary:
        "Jargon, buzzwords, and inflated vocabulary make you harder to understand and easier to distrust. Default to the plain word.",
      body: `**The idea:**
Plain English means using the simplest words that carry your exact meaning. It is not casual or unprofessional — it is how the clearest thinkers at every level actually write. Inflated language is usually a sign someone is hiding uncertainty, padding for length, or trying to sound senior.

**The plain-word swap:**
Almost every corporate word has a shorter twin that means the same thing:
> "utilise" → **use** · "leverage" → **use** · "in order to" → **to** · "at this point in time" → **now** · "commence" → **start** · "endeavour" → **try** · "facilitate" → **help** · "circle back" → **follow up** · "going forward" → *(usually delete it)*

None of these swaps loses meaning. Every one of them saves the reader effort.

**Jargon has a place — and it isn't everywhere:**
Precise technical terms are useful *with the right audience.* "Idempotent", "NPA", "gross margin" — these are exact, and among specialists they're clearer than a plain-English paraphrase. The rule is audience-based: use the term when your reader shares it; translate it when they don't. Jargon used to *include* is professional; jargon used to *impress* is noise.

**The buzzword test:**
If you can delete a word and the sentence still means exactly the same thing, delete it. "We need to synergise our core competencies to move the needle" survives this test with almost nothing left: "We need to work together on what we're good at."

**Watch out for:**
Nominalisation — turning verbs into nouns — quietly drains energy from writing. "We made a decision to do an implementation of the change" → "We decided to make the change." Hunt for "-tion", "-ment", and "-ance" words hiding a simple verb.

**The takeaway:**
Plain English is a discipline, not a lack of vocabulary. Say the true thing in the plainest words your reader will understand — it reads as confidence, not simplicity.`,
      questions: [
        {
          kind: "mcq",
          prompt: "According to the plain-English rule, when is technical jargon appropriate?",
          options: [
            "Never — always translate every term",
            "Whenever you want to sound more senior",
            "When your reader shares the term; otherwise translate it",
            "Only in formal written documents",
          ],
          correct_index: 2,
          model_answer:
            "Use a precise technical term when your reader shares it (it's clearer among specialists); translate it when they don't. Jargon to include is fine; jargon to impress is noise.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "Rewrite this in plain English, keeping the meaning: \"Going forward, we need to leverage our core competencies in order to facilitate the commencement of the initiative at this point in time.\"",
          model_answer:
            "We should use what we're best at to start the project now.",
          difficulty: "basic",
        },
      ],
      facts: [
        "Almost every inflated business word has a plain twin that means the same thing — \"utilise\" is just \"use\" wearing a suit.",
      ],
    },
  ],
};
