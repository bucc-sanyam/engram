import type { DsaTopic } from "../types";

/** Chapter 4 — Stack: order of arrival as a data structure. */
export const stack: DsaTopic = {
  slug: "stack",
  title: "Stack",
  chapter: 4,
  tagline: "Last in, first out — the natural shape of anything that nests, defers, or waits its turn.",
  color: "#b48df0",
  prereqs: ["arrays-hashing"],
  unlocks: [],
  intro: `A stack is the simplest data structure with an opinion. You may only touch the top: push onto it, pop off it. That restriction looks like a weakness and is actually the entire point — because an astonishing number of processes in computing are *last-in, first-out by nature*. The most recently opened bracket is the first one that must close. The most recently deferred question is the first one the future answers. Your language runtime agrees: every function call in every program you have ever run lives on a call stack.

This chapter teaches two distinct superpowers that happen to share the same API. The first is **matching what nests**: Valid Parentheses is the pattern's hello-world, and Evaluate Reverse Polish Notation shows the same machinery computing arithmetic. Min Stack sits between them as a design exercise — augmenting a stack so it can answer a question (the current minimum) that popping normally destroys.

The second superpower is subtler and carries the chapter's hard problems: the **monotonic stack**, which you already met lying on its side as the deque in Sliding Window Maximum. The scenario: elements arrive one by one, and each one asks a question only the *future* can answer — "when will someone warmer than me arrive?" (Daily Temperatures), "who limits my rectangle?" (Largest Rectangle in Histogram). The stack holds everyone still waiting for their answer, and arrivals resolve the waiting in a very particular order: the newcomer answers the most recent waiters first, popping them off, precisely because anyone the newcomer *cannot* answer is shielded by someone above them who couldn't be answered either. The stack stays sorted — monotonic — without ever being sorted, and every element is pushed once and popped once: O(n) for problems that look hopelessly quadratic.

Car Fleet, the odd duck in the middle, shows the pattern in disguise — cars merging on a highway are a monotonic process once you sort by position and think in arrival times. On the roadmap, Stack is a leaf like Sliding Window: no children, but its monotonic idea echoes into histograms, spans, and parsing for the rest of your career.`,
  problems: [
    {
      slug: "valid-parentheses",
      title: "Valid Parentheses",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/validate-parentheses",
      summary: "Every closer must match the most recent unclosed opener — LIFO stated as a law of nature.",
      body: `**The problem.** A string of brackets — ( ) [ ] { } — is valid if every opener closes, in the right order, with the right partner. "([])" is valid; "([)]" is not.

**The insight.** Say the rule for a valid string precisely: a closing bracket must match *the most recently opened bracket that has not yet closed*. Read that sentence again — "most recent, not yet handled" — it is the definition of last-in-first-out. The data structure is not a clever choice here; it is a transcription. Push every opener. On a closer, the top of the stack must be its partner: pop it if so, fail if not (wrong partner, or nothing there to close). At the end, the stack must be empty — leftover openers are unclosed.

**The walk-through.** "([])": push ( → push [ → see ], top is [ — pop → see ), top is ( — pop → end, stack empty, valid. Now "([)]": push ( → push [ → see ), but the top is [ — the most recent open thing is a square bracket, and no later closer can fix that ordering. Fail immediately. That early, local failure is the stack's gift: wrongness surfaces the instant it occurs.

**The three failure modes** worth naming in an interview: a closer arriving to an empty stack ("]"), a closer meeting the wrong top ("(]"), and a non-empty stack at the end ("((" ). One line of code each; forgetting the third is the classic slip.

**Complexity.** O(n) time, O(n) space in the worst case — a string of all openers.

**Why it matters beyond itself.** Every nested structure you will ever parse — JSON, HTML, expression trees, indentation — validates by exactly this loop. Your compiler ran it on this problem's own source code.

**The thread.** Here the stack merely *remembered* openers. Next, Min Stack asks the stack to answer a question about everything it currently holds — in O(1) — and the answer is to make every element carry a little history with it.`,
    },
    {
      slug: "min-stack",
      title: "Min Stack",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/minimum-stack",
      summary: "Design a stack that also reports its minimum in O(1) — by snapshotting history on the way in.",
      body: `**The problem.** Build a stack supporting push, pop, top — and getMin, all in O(1). The catch is entirely in getMin: a single "current minimum" variable is easy to maintain on push, but when that minimum is *popped*, what was the minimum before it? A lone variable has amnesia.

**The insight.** The stack's own shape is the cure. Notice that the answer to "what is the minimum?" only ever changes at push and pop — and pops happen in exactly the reverse order of pushes. So record history the same way the stack records everything: alongside each element, store *the minimum of the stack as of that push*. A second stack, moving in lockstep with the first, where minStack top always equals the current minimum. Push x: push min(x, current top of minStack) onto minStack. Pop: pop both. getMin: read minStack's top. Every operation is one or two O(1) stack moves; when the reigning minimum leaves, the previous regime is sitting right underneath, already computed, because it *was* the answer back when that element arrived.

**The walk-through.** Push 5 → mins: 5. Push 2 → mins: 5,2. Push 7 → mins: 5,2,2. Push 1 → mins: 5,2,2,1. getMin → 1. Pop (the 1 leaves) → mins top is 2: the past restored, no recomputation, no scan.

**The principle.** This is your first *augmented data structure*: attaching a running summary to each node so questions about "everything below me" resolve locally. The same move powers order-statistic trees, prefix sums, and the maxLeft/maxRight sweeps you have already seen. Interview phrasing: "invariant — the auxiliary top always equals the minimum of the live elements." Name the invariant and the design defends itself.

**Complexity.** O(1) per operation, O(n) extra space. (Space-tightening variants exist — storing deltas, or pushing to minStack only when a new min arrives — worth mentioning, not worth the bug risk under pressure.)

**The thread.** You have now stored *summaries* on a stack. Next, Evaluate Reverse Polish Notation stores *operands* — and the stack quietly becomes a calculator, the same way your CPU's call stack is one.`,
    },
    {
      slug: "evaluate-reverse-polish-notation",
      title: "Evaluate Reverse Polish Notation",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/evaluate-reverse-polish-notation",
      summary: "Postfix arithmetic: operands wait on the stack, every operator consumes the two most recent.",
      body: `**The problem.** Evaluate an arithmetic expression given in Reverse Polish (postfix) notation: ["2","1","+","3","*"] means (2 + 1) × 3 = 9. Operators come *after* their operands, and — the entire selling point — no parentheses are ever needed.

**The insight.** In postfix, by the time an operator appears, its two operands are the *two most recently produced values* — either read directly or computed by earlier operators. "Most recently produced, consumed first": the stack sentence again. So the algorithm is a transcription, like Valid Parentheses was. Walk the tokens: a number pushes; an operator pops twice, computes, and pushes the result. When the tokens run out, the stack holds exactly one value — the answer.

**The one classic trap.** Order. Popping gives you the operands *backwards*: the first pop is the right-hand operand, the second is the left. For + and × nobody notices; for − and ÷ this is the bug every first implementation ships. 6, 2, ÷ must compute 6 ÷ 2: pop 2 (right), pop 6 (left), push left ÷ right = 3.

**The walk-through.** ["4","13","5","/","+"]: push 4, push 13, push 5 → ÷ pops 5 then 13, computes 13 ÷ 5 = 2 (truncating), pushes → + pops 2 and 4 → 6.

**Why postfix exists at all.** Infix notation needs parentheses and precedence rules because operators arrive before you know their right operand. Postfix dissolves both problems structurally — which is why stack machines, bytecode interpreters, and old HP calculators all speak it, and why compilers convert your infix code *into* it (the shunting-yard algorithm — a follow-up interviewers love to reach for) before evaluating.

**Complexity.** O(n) time, O(n) space; each token touched once.

**The thread.** Three problems in, the stack has matched, remembered, and computed — all with elements that *wanted* to be popped. Daily Temperatures, next, flips the emotional polarity: elements now *wait* on the stack for an answer from the future, and the monotonic pattern — the chapter's real boss — begins.`,
    },
    {
      slug: "daily-temperatures",
      title: "Daily Temperatures",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/daily-temperatures",
      summary: "The monotonic stack arrives: each day waits on the stack until a warmer one resolves it.",
      body: `**The problem.** For each day's temperature, how many days until a warmer one? [73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]. Days with no warmer future get 0.

**The naive move.** For each day, scan forward until warmth: O(n²), and the waste is palpable — the scan from day 3 re-walks the same cold days the scan from day 4 will walk again.

**The insight.** Reverse the direction of the question. Instead of each day *searching* its future, let each arriving day *deliver answers to the past*. Keep a stack of days still waiting for warmth. When a new temperature arrives, it resolves every waiting day colder than itself — pop them, and each one's answer is simply the index gap. Then the newcomer joins the waiters. Why is popping from the top always enough? Because the waiting days are automatically ordered coldest-on-top: any day warmer than the one beneath it would have popped that day the moment it arrived. So the stack stays *monotonic* — temperatures decreasing from bottom to top — not because anyone sorts it, but as a pure consequence of the popping rule. When a newcomer fails to pop the top, nothing deeper can be popped either, and the scan stops instantly.

**The walk-through.** [73,74,75,71,69,72,…]: 73 waits. 74 arrives — pops 73 (answer 1) — waits. 75 pops 74 (answer 1), waits. 71 waits; 69 waits (stack now 75,71,69 — decreasing). 72 arrives: pops 69 (answer 1), pops 71 (answer 2), cannot pop 75, waits. 76 arrives: pops 72 (answer 1), pops 75 (answer 4), waits. And so on. Every day pushed once, popped at most once.

**Complexity.** O(n) time — the push-once-pop-once amortised argument, third time in this atlas — and O(n) space. Anyone the stack still holds at the end answers 0.

**The thread.** "Next greater element" is a whole problem *family*, and you now own its key. Car Fleet, next, hides the same monotonic shape inside a word problem about cars — the popping happens in your head before any code is written.`,
    },
    {
      slug: "car-fleet",
      title: "Car Fleet",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/car-fleet",
      summary: "Sort by position, think in arrival times: fleets form exactly where a slower leader absorbs the fast.",
      body: `**The problem.** Cars at various positions drive toward a target at various speeds. A faster car catching a slower one cannot pass — it slows and they merge into a *fleet*. How many fleets reach the target?

**The reframe.** Simulating motion is a tar pit. The liberating move: a car's fate is determined by one number — the time it *would* reach the target driving alone: (target − position) / speed. Now sort cars by starting position, closest to the target first, and read their alone-times in that order. The car ahead of you (closer to target) blocks you if and only if your alone-time is *less than or equal to* its effective time — you would arrive sooner, meaning you catch it en route and are absorbed, inheriting its pace. You can never affect a car ahead; a car behind can never do anything but join you.

**The insight, stack-shaped.** Process cars from the one nearest the target backwards. Maintain a stack of fleet *leaders* — their arrival times. Each new car (starting further back) compares its alone-time with the stack top: less or equal → it merges into that fleet, vanishing (no push); greater → it will never catch up, and it becomes a new fleet leader (push). The stack ends holding exactly the fleets, and notice its shape: arrival times strictly *increasing* from top of traffic to back — monotonic again, maintained by the same pop-or-push (here: absorb-or-lead) decision as Daily Temperatures, just with the popping happening as "never being pushed."

**The walk-through.** Target 12; cars at position 10 speed 2, at 8 speed 4, at 0 speed 1. Times: 1, 1, 12. Nearest first: leader with time 1. Next car time 1 ≤ 1 — merges (fleets: 1). Next time 12 > 1 — new leader. Two fleets.

**Complexity.** O(n log n) for the sort, O(n) for the pass. The sort is doing real conceptual work: it converts a 2-D physics problem into a 1-D monotonic scan.

**The thread.** One problem left, and it is the monotonic stack's masterpiece: Largest Rectangle in Histogram, where each bar waits on the stack to learn *both* of its boundaries — and popping computes areas.`,
    },
    {
      slug: "largest-rectangle-in-histogram",
      title: "Largest Rectangle in Histogram",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/largest-rectangle-in-histogram",
      summary: "Every bar's best rectangle is bounded by the first shorter bar on each side — and one stack finds both.",
      body: `**The problem.** A histogram of bar heights. Find the largest rectangle that fits entirely inside it. For [2,1,5,6,2,3] the answer is 10 — the 5 and 6 bars supporting a 5×2 rectangle.

**The decomposition.** Any candidate rectangle is pinned by some bar that is its *shortest* — the rectangle uses that bar's full height and extends left and right exactly until a shorter bar cuts it off. So the problem reduces to: for each bar, find the first shorter bar to its left and to its right; width is the gap between those boundaries, area is width × height. n candidate rectangles, and the best one is the answer. "First shorter to the left/right" — you heard it: Daily Temperatures' question, asked twice in mirror.

**The insight.** One left-to-right pass with a stack of bars *waiting for their right boundary*, kept increasing in height. When a new bar is shorter than the stack's top, the top's fate is sealed on both sides at once: the newcomer is its **right** boundary, and — the beautiful part — the entry sitting *underneath it on the stack* is its **left** boundary, because anything between them was taller and has already been popped. Pop it, compute its area, and keep popping while the newcomer undercuts. Push the newcomer. A virtual bar of height 0 at the end flushes everyone.

**The walk-through.** [2,1,5,6,2,3]: 2 waits. 1 arrives — pops 2 (right boundary here, left boundary the stack's floor: width 1, area 2) — waits. 5, 6 stack up (increasing). 2 arrives: pops 6 (width 1, area 6), pops 5 (width 2 — indexes between 1 and the newcomer — area **10**), waits. 3 waits. The flush pops 3 (area 3), 2 (width 4, area 8), 1 (width 6, area 6). Best: 10.

**Complexity.** O(n) time — push once, pop once — O(n) space, for a problem whose naive form is O(n²) and whose divide-and-conquer form is O(n log n). The stack wins outright.

**The thread.** Chapter closed: matching, augmenting, computing, and the monotonic wait. Next chapter abandons arrival order entirely and returns to *sorted space* — Binary Search, where every comparison discards not one candidate but half the world.`,
    },
  ],
};
