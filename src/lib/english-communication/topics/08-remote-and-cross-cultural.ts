import { EcChapter } from "../types";

export const remoteAndCrossCultural: EcChapter = {
  slug: "remote-and-cross-cultural",
  title: "Remote & Cross-Cultural Communication",
  summary:
    "Modern teams are distributed and diverse. Write so async works across time zones, choose language that's clear to non-native and neurodiverse readers alike, and show up well on video.",
  sections: [
    {
      slug: "async-first-communication",
      title: "Writing for Async & Remote",
      summary:
        "On a distributed team, the message that needs no follow-up wins. Write self-contained updates, decide async by default, and make your work legible to people who aren't online when you are.",
      body: `**The idea:**
On a co-located team you can lean over and clarify. On a remote, cross-time-zone team, a message that needs a follow-up question can cost a whole day — the reply lands while you're asleep. The core discipline of remote work is writing **self-contained** communication: everything the reader needs to act, in one message, without you present.

**The self-contained test:**
Before you send, ask: *if the reader saw only this and couldn't ask me anything for 12 hours, could they still act?* If not, add the missing context, links, and the specific decision you need.
> ❌ "Hey, can you take a look at the thing we discussed and let me know?"
> ✅ "Could you review the pricing section of the proposal (linked, p.3) and reply with either 'ship it' or your specific changes? I'm sending it to the client Thursday 10am UK time, so anything by Wed EOD your time works."

**Async by default — sync for the right reasons:**
Not everything needs a meeting. A good rule for what belongs where:

\`\`\`viz:flow
{
  "nodes": [
    { "id": "start", "label": "Something to communicate", "row": 0, "col": 1 },
    { "id": "complex", "label": "High-conflict, emotional, or needs live back-and-forth?", "row": 1, "col": 1 },
    { "id": "sync", "label": "Call / meeting — then post a written summary", "row": 2, "col": 0 },
    { "id": "async", "label": "Write it: a clear async message or doc", "row": 2, "col": 2 }
  ],
  "edges": [
    { "from": "start", "to": "complex" },
    { "from": "complex", "to": "sync", "label": "yes" },
    { "from": "complex", "to": "async", "label": "no (most things)" }
  ],
  "caption": "Default to async writing; reserve synchronous time for the genuinely hard, emotional, or fast-iterating conversations — and always leave a written trail afterwards."
}
\`\`\`

**Write the trail:**
Async teams run on written memory. Decisions made on a call vanish unless someone writes them down where others can find and search them. "We decided X because Y — see thread" in a shared channel is worth more than the meeting itself. Being the person who writes the summary quietly makes you central.

**Respect time zones and focus:**
- **State your timezone and real deadline** ("by Wed EOD your time") — "end of day" is ambiguous across a 9-hour gap.
- **Don't expect instant replies,** and don't perform availability. A thoughtful answer in four hours beats an instant "will look later".
- **Batch, don't ping.** One message with three questions beats three pings that fracture someone's focus across the day.

**Watch out for:**
Recreating the open-plan office in Slack — a stream of interruptions and a fear of being "offline". Remote done well is *more* focused, not less, precisely because good writing removes the need to interrupt.

**The takeaway:**
Write so your reader can act without you in the room: self-contained messages, async by default, decisions written down, deadlines with a timezone. That's the whole craft of distributed work.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the key test for a good async message on a distributed team?",
          options: [
            "It's as short as possible",
            "It uses the most formal language available",
            "The reader could act on it without asking you anything for many hours",
            "It's sent during the sender's working hours",
          ],
          correct_index: 2,
          model_answer:
            "A self-contained message: if the reader saw only this and couldn't reach you for hours, they'd still have everything (context, links, the specific decision, a timezone-anchored deadline) needed to act.",
          difficulty: "basic",
        },
        {
          kind: "truefalse",
          prompt: "On a remote team, replying instantly to every message is the best way to be seen as a strong communicator.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Performing constant availability fractures focus; a thoughtful, self-contained answer a few hours later is more valuable than an instant 'will look later'. Async done well is more focused, not less.",
          difficulty: "intermediate",
        },
        {
          kind: "open",
          prompt:
            "You're in London and need a teammate in San Francisco to approve a design before you hand it to a client on Thursday at 10am UK time. Write a single self-contained async message they can act on without asking you anything.",
          model_answer:
            "Hi Jordan — I need your sign-off on the final onboarding design (Figma link here) before it goes to Acme. Two things to check: the empty-state copy and the mobile breakpoint on screen 3. Please reply with either 'approved' or specific changes. My hard deadline is Thursday 10am UK time, which is Wednesday 2am your time — so anytime during your Wednesday works. If you spot a blocker, flag it and I'll adjust the client timing. Thanks!",
          difficulty: "advanced",
        },
      ],
      facts: [
        "\"End of day\" is ambiguous across time zones — on a distributed team, a deadline is only clear if it names the zone (\"Wed 5pm your time\"), which is why careful remote writers always anchor it.",
      ],
    },
    {
      slug: "inclusive-and-clear-language",
      title: "Clear, Inclusive Language",
      summary:
        "On a global team, plain, literal, jargon-light language isn't dumbing down — it's what lets non-native speakers, neurodiverse colleagues, and newcomers all follow you. Clarity is inclusion.",
      body: `**The idea:**
Your colleagues may not share your first language, your cultural references, or the way you read tone. Language that's clear and literal — light on idiom, slang, sarcasm, and insider references — includes more people without losing any meaning. This is the same clarity discipline from chapter 1, now doing double duty as inclusion.

**Idioms and sports/war metaphors don't travel:**
Phrases that feel neutral to you can baffle or exclude:
> ❌ "Let's touch base offline, run it up the flagpole, and circle back — we don't want to drop the ball or get caught with our pants down."
> ✅ "Let's discuss this separately, check with the team, and follow up. We can't afford to miss this."

The second is clearer to *everyone*, native speakers included. Swap idioms and metaphors for the literal thing you mean:

\`\`\`viz:table-diff
{
  "columns": ["Insider phrasing", "Clear & inclusive"],
  "before": [
    ["Let's take this offline", "Table it for now"],
    ["Ping me / give me a bell", "It's a slam dunk"],
    ["Let's boil the ocean", "That's not my wheelhouse"]
  ],
  "after": [
    ["Let's discuss this separately", "Let's postpone this"],
    ["Message me", "This is a strong, low-risk choice"],
    ["Let's not try to do everything at once", "That's outside my area"]
  ],
  "caption": "Left: idioms and metaphors that don't cross cultures or first languages. Right: the literal meaning, clearer to everyone."
}
\`\`\`

**Small inclusive defaults that cost nothing:**
- **"Hi everyone" / "Hi team"** instead of "Hey guys" — a tiny change that includes everyone.
- **Spell out acronyms** the first time; a newcomer or another department may not know your team's shorthand.
- **Describe images and links** ("chart showing signups doubling", not "see this") — better for screen-reader users and for anyone skimming.
- **Assume good intent across cultures.** Directness reads as rude in some cultures and as honest in others; warmth reads as fake in some and as kind in others. When something lands oddly, assume a norms gap, not malice.

**Directness varies by culture — flex it:**
In some cultures "this needs work" is normal and kind; in others it's a slap, and feedback is wrapped carefully. Neither is right; the skill is noticing your default and adjusting toward your colleague's. When in doubt, be clear about the substance and generous about the person.

**Watch out for:**
Humour and sarcasm across cultures and in text. What reads as playful banter to you can read as a genuine insult to someone else — and text strips the wink that would have saved it. When unsure, cut it.

**The takeaway:**
Say the literal thing, skip the idioms and insider shorthand, and default to inclusive greetings and spelled-out terms. Clear language is the most practical form of inclusion there is — and it makes you a better communicator for everyone.`,
      questions: [
        {
          kind: "multi",
          prompt: "Which habits make your language clearer and more inclusive on a global team? Select all that apply.",
          options: [
            "Replacing idioms and sports/war metaphors with the literal meaning",
            "Spelling out acronyms the first time you use them",
            "Using 'Hi everyone' or 'Hi team' instead of 'Hey guys'",
            "Adding sarcasm and inside jokes to build rapport in text",
          ],
          correct_indices: [0, 1, 2],
          model_answer:
            "Literal phrasing, spelled-out acronyms, and inclusive greetings all help. Sarcasm and inside jokes in text travel badly across cultures and lose the tone that would have signalled the joke.",
          difficulty: "basic",
        },
        {
          kind: "open",
          prompt:
            "Rewrite this message so it's clear and inclusive for a global team of native and non-native English speakers: \"Hey guys — let's take the pricing thing offline and run it up the flagpole before EOD, don't want to drop the ball on this one.\"",
          model_answer:
            "Hi everyone — let's discuss the pricing question separately and check it with the leadership team before end of day (5pm UK time). It's important we don't miss this one, so I'd like it settled today.",
          difficulty: "intermediate",
        },
      ],
      facts: [
        "Directness isn't universally polite or rude — \"this needs work\" is ordinary kindness in some cultures and a harsh blow in others, so fluent cross-cultural communicators flex their bluntness toward the person they're talking to.",
      ],
    },
    {
      slug: "virtual-presence",
      title: "Presence on Video Calls",
      summary:
        "On video you're a small rectangle competing with everyone's inbox. Look present, speak in shorter turns, name people to hand off, and use chat and mute deliberately.",
      body: `**The idea:**
Video calls flatten your presence to a small square and a slightly-delayed voice, while everyone's inbox sits one tab away. Being effective on video is a distinct skill from being effective in a room — the signals that carry are different, and the ways to lose the room are new.

**Look present (it reads as engaged):**
- **Look toward the camera** on your key points, not at your own face or a second monitor — it's the video equivalent of eye contact.
- **Keep your face lit and framed** (light in front, not behind; face filling a reasonable part of the frame). You don't need a studio, just to be *seen.*
- **React visibly.** A nod or a thumbs-up matters more on video, because the room can't feel your presence the way it would in person. Silent, still faces read as absent.

**Speak for the medium:**
- **Shorter turns.** Latency makes long monologues painful and easy to talk over. Make your point, then hand off.
- **Signal before you speak** on a big call — "I'll jump in here —" or the raise-hand — since the natural gaps that let you enter a room don't exist on video.
- **Name people to hand off cleanly:** "Priya, does that match what you're seeing?" This beats an open "any thoughts?" that meets awkward silence as everyone waits for someone else.

**Use the tools deliberately:**
- **Mute when not speaking** on larger calls; unmute promptly when you are (the "you're on mute" beat is universal — a quick "sorry, muted" and move on).
- **Chat is a parallel channel,** not a distraction — drop a link, a +1, or a question there without interrupting the speaker.
- **Camera-on is a kindness, not a mandate.** Default on for small collaborative calls where faces help; it's fine to be off when you have a reason (bandwidth, back-to-backs) — just say so rather than going dark unexplained.

**Watch out for:**
Visibly multitasking — the darting eyes and typing that everyone can see, which quietly tells the room they don't have your attention. If you genuinely must step away, say so ("grabbing something, back in one") rather than ghosting your own square.

**The takeaway:**
On video, be seen and be present: look at the camera on key points, react visibly, speak in shorter turns, hand off by name, and use mute and chat with intent. Presence is a choice the medium makes harder — so make it deliberately.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is naming a specific person to hand off to especially valuable on a video call?",
          options: [
            "It makes the call end faster",
            "An open 'any thoughts?' tends to meet awkward silence as everyone waits, since the natural cues for entering a conversation are missing on video",
            "It's the only polite way to speak on video",
            "It prevents anyone else from contributing",
          ],
          correct_index: 1,
          model_answer:
            "Video lacks the natural gaps and body cues that let people enter a conversation, so an open 'any thoughts?' often stalls. Naming someone ('Priya, does that match what you see?') hands off cleanly.",
          difficulty: "intermediate",
        },
        {
          kind: "truefalse",
          prompt: "On video, staying silent and still with a neutral expression communicates the same engagement as active nodding and reactions would in person.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer:
            "False. Video can't convey ambient presence, so still, silent faces read as absent. Visible reactions — a nod, a thumbs-up, looking toward the camera — matter more on video, not less.",
          difficulty: "basic",
        },
      ],
      facts: [
        "On video, looking into the camera on your key points — not at the other person's face on your screen — is what actually reads as eye contact to them, a small mechanical detail that changes how present you seem.",
      ],
    },
  ],
};
