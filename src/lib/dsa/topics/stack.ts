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
      body: `**Signal.** "Every opener must close, in the right order, with the right partner" — a nesting/matching rule is close to the clearest possible tell for a stack; the rule *is* last-in-first-out, restated.

**Brute force.** Repeatedly scan the string for an adjacent matched pair — "()", "[]", or "{}" — and remove it, shrinking the string each time. If it fully collapses to empty, it was valid. Correct, but each scan is O(n) and you may need O(n) scans: O(n²) total.

**Optimal approach.** Say the rule for a valid string precisely: a closing bracket must match *the most recently opened bracket that has not yet closed*. Read that sentence again — "most recent, not yet handled" — it is the definition of last-in-first-out. The data structure is not a clever choice here; it is a transcription. Push every opener. On a closer, the top of the stack must be its partner: pop it if so, fail if not (wrong partner, or nothing there to close). At the end, the stack must be empty — leftover openers are unclosed.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["("], "highlight": [0], "note": "See '(' — push. Stack: (." },
    { "cells": ["(", "["], "highlight": [1], "note": "See '[' — push. Stack: ( [." },
    { "cells": ["("], "highlight": [0], "note": "See ']' — top is '[', a match. Pop it." },
    { "cells": [], "note": "See ')' — top is '(', a match. Pop it. Stack empty at the end → valid." }
  ],
  "caption": "Valid Parentheses on \\"([])\\" — every opener pushes, every matching closer pops; an empty stack at the end means valid."
}
\`\`\`

**The three failure modes** worth naming in an interview: a closer arriving to an empty stack ("]"), a closer meeting the wrong top ("(]"), and a non-empty stack at the end ("((" ). One line of code each; forgetting the third is the classic slip.

**Complexity.** O(n) time, O(n) space in the worst case — a string of all openers — versus the O(n²) repeated-scan brute force.

**Why it matters beyond itself.** Every nested structure you will ever parse — JSON, HTML, expression trees, indentation — validates by exactly this loop. Your compiler ran it on this problem's own source code.

**Thread.** Here the stack merely *remembered* openers. Next, Min Stack asks the stack to answer a question about everything it currently holds — in O(1) — and the answer is to make every element carry a little history with it.`,
    },
    {
      slug: "min-stack",
      title: "Min Stack",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/minimum-stack",
      summary: "Design a stack that also reports its minimum in O(1) — by snapshotting history on the way in.",
      body: `**Signal.** "Design a stack supporting push, pop, top, and getMin — all in O(1)" — an explicit O(1) bar on a query (the minimum) that normally requires a scan is the tell for an *augmented* data structure: attach the answer to the data instead of computing it on demand.

**Brute force.** Keep one plain stack; when getMin is called, scan the whole thing for the smallest value. Push/pop/top are all O(1), but getMin is O(n) — it violates the requirement outright, which is exactly why the problem specifies it.

**Optimal approach.** The stack's own shape is the cure. Notice that the answer to "what is the minimum?" only ever changes at push and pop — and pops happen in exactly the reverse order of pushes. So record history the same way the stack records everything: alongside each element, store *the minimum of the stack as of that push*. A second stack, moving in lockstep with the first, where minStack's top always equals the current minimum. Push x: push min(x, current top of minStack) onto minStack. Pop: pop both. getMin: read minStack's top. Every operation is one or two O(1) stack moves; when the reigning minimum leaves, the previous regime is sitting right underneath, already computed, because it *was* the answer back when that element arrived.

\`\`\`viz:array
{
  "frames": [
    { "cells": [5], "highlight": [0], "note": "Push 5. min(5, —) = 5. minStack: [5]." },
    { "cells": [5, 2], "highlight": [1], "note": "Push 2. min(2, top 5) = 2. minStack: [5, 2]." },
    { "cells": [5, 2, 2], "highlight": [2], "note": "Push 7. min(7, top 2) = 2 — unchanged. minStack: [5, 2, 2]." },
    { "cells": [5, 2, 2, 1], "highlight": [3], "note": "Push 1. min(1, top 2) = 1. minStack: [5, 2, 2, 1]. getMin() reads the top: 1." },
    { "cells": [5, 2, 2], "highlight": [2], "note": "Pop — the 1 leaves both stacks. minStack's top is now 2: the previous minimum, already sitting there, no recomputation." }
  ],
  "caption": "Min Stack's auxiliary stack — its top always equals the current minimum, restored instantly on pop."
}
\`\`\`

**The principle.** This is your first *augmented data structure*: attaching a running summary to each node so questions about "everything below me" resolve locally. The same move powers order-statistic trees, prefix sums, and the maxLeft/maxRight sweeps you have already seen. Interview phrasing: "invariant — the auxiliary top always equals the minimum of the live elements." Name the invariant and the design defends itself.

**Complexity.** O(1) per operation, O(n) extra space — versus the brute force's O(n) getMin. (Space-tightening variants exist — storing deltas, or pushing to minStack only when a new min arrives — worth mentioning, not worth the bug risk under pressure.)

**Thread.** You have now stored *summaries* on a stack. Next, Evaluate Reverse Polish Notation stores *operands* — and the stack quietly becomes a calculator, the same way your CPU's call stack is one.`,
    },
    {
      slug: "evaluate-reverse-polish-notation",
      title: "Evaluate Reverse Polish Notation",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/evaluate-reverse-polish-notation",
      summary: "Postfix arithmetic: operands wait on the stack, every operator consumes the two most recent.",
      body: `**Signal.** "Evaluate an expression given in postfix notation, where operators come after their operands" — postfix's whole selling point is that no parentheses are ever needed, and the reason is that every operator's operands are always the *two most recently produced values*. "Most recently produced, consumed first" is the stack sentence again.

**Brute force.** Repeatedly scan the token list left to right for the first \`operand operand operator\` triplet, evaluate it in place, and shift the remaining tokens down to close the gap — then re-scan from the start. Each pass is O(n), and you need roughly n passes: O(n²) total, plus the bookkeeping of shifting an array on every step.

**Optimal approach.** Walk the tokens once. A number pushes; an operator pops twice, computes, and pushes the result. When the tokens run out, the stack holds exactly one value — the answer. The one classic trap is order: popping gives you the operands *backwards* — the first pop is the right-hand operand, the second is the left. For + and × nobody notices; for − and ÷ this is the bug every first implementation ships. 6, 2, ÷ must compute 6 ÷ 2: pop 2 (right), pop 6 (left), push left ÷ right = 3.

\`\`\`viz:array
{
  "frames": [
    { "cells": [4], "note": "Token \\"4\\": push. Stack: [4]." },
    { "cells": [4, 13], "note": "Token \\"13\\": push. Stack: [4, 13]." },
    { "cells": [4, 13, 5], "highlight": [2], "note": "Token \\"5\\": push. Stack: [4, 13, 5]." },
    { "cells": [4, 2], "highlight": [1], "note": "Token \\"/\\": pop 5 (right), pop 13 (left). 13 ÷ 5 = 2 (truncated). Push 2. Stack: [4, 2]." },
    { "cells": [6], "highlight": [0], "note": "Token \\"+\\": pop 2 (right), pop 4 (left). 4 + 2 = 6. Push 6. Stack: [6] — one value left, the answer." }
  ],
  "caption": "Evaluate Reverse Polish Notation on [\\"4\\",\\"13\\",\\"5\\",\\"/\\",\\"+\\"] — every operator consumes exactly the two most recent values on the stack."
}
\`\`\`

**Why postfix exists at all.** Infix notation needs parentheses and precedence rules because operators arrive before you know their right operand. Postfix dissolves both problems structurally — which is why stack machines, bytecode interpreters, and old HP calculators all speak it, and why compilers convert your infix code *into* it (the shunting-yard algorithm — a follow-up interviewers love to reach for) before evaluating.

**Complexity.** O(n) time, O(n) space; each token touched once — versus the O(n²) repeated-scan brute force.

**Thread.** Three problems in, the stack has matched, remembered, and computed — all with elements that *wanted* to be popped. Daily Temperatures, next, flips the emotional polarity: elements now *wait* on the stack for an answer from the future, and the monotonic pattern — the chapter's real boss — begins.`,
    },
    {
      slug: "daily-temperatures",
      title: "Daily Temperatures",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/daily-temperatures",
      summary: "The monotonic stack arrives: each day waits on the stack until a warmer one resolves it.",
      body: `**Signal.** "For each day, how many days until a warmer one" — each element asking a question only the *future* can answer is the tell for the monotonic stack: elements wait, and arrivals resolve the waiting.

**Brute force.** For each day, scan forward until a warmer temperature appears: O(n²), and the waste is palpable — the scan from day 3 re-walks the same cold days the scan from day 4 will walk again.

**Optimal approach.** Reverse the direction of the question. Instead of each day *searching* its future, let each arriving day *deliver answers to the past*. Keep a stack of days still waiting for warmth. When a new temperature arrives, it resolves every waiting day colder than itself — pop them, and each one's answer is simply the index gap. Then the newcomer joins the waiters. Why is popping from the top always enough? Because the waiting days are automatically ordered coldest-on-top: any day warmer than the one beneath it would have popped that day the moment it arrived. So the stack stays *monotonic* — temperatures decreasing from bottom to top — not because anyone sorts it, but as a pure consequence of the popping rule.

\`\`\`viz:array
{
  "frames": [
    { "cells": [73, 74, 75, 71, 69, 72, 76, 73], "pointers": [{ "label": "today", "index": 0 }], "highlight": [0], "note": "73 has nothing waiting to compare against — it just waits. Stack (by day): [73]." },
    { "cells": [73, 74, 75, 71, 69, 72, 76, 73], "pointers": [{ "label": "today", "index": 1 }], "highlight": [1], "note": "74 arrives — pops 73: 1 day to warmth. 74 now waits. Stack: [74]." },
    { "cells": [73, 74, 75, 71, 69, 72, 76, 73], "pointers": [{ "label": "today", "index": 2 }], "highlight": [2], "note": "75 arrives — pops 74: 1 day to warmth. 75 waits. Stack: [75]." },
    { "cells": [73, 74, 75, 71, 69, 72, 76, 73], "pointers": [{ "label": "today", "index": 3 }], "highlight": [2, 3], "note": "71 can't warm 75 — it just waits underneath. Stack (temps decreasing bottom to top): [75, 71]." },
    { "cells": [73, 74, 75, 71, 69, 72, 76, 73], "pointers": [{ "label": "today", "index": 4 }], "highlight": [2, 3, 4], "note": "69 can't warm 71 either — waits too. Stack: [75, 71, 69]." },
    { "cells": [73, 74, 75, 71, 69, 72, 76, 73], "pointers": [{ "label": "today", "index": 5 }], "highlight": [2, 5], "note": "72 arrives — pops 69 (1 day) and 71 (2 days), but can't touch 75. 72 waits. Stack: [75, 72]." },
    { "cells": [73, 74, 75, 71, 69, 72, 76, 73], "pointers": [{ "label": "today", "index": 6 }], "highlight": [6], "note": "76 arrives — pops 72 (1 day) and 75 (4 days). 76 waits alone. Stack: [76]." },
    { "cells": [73, 74, 75, 71, 69, 72, 76, 73], "pointers": [{ "label": "today", "index": 7 }], "highlight": [6, 7], "note": "73 can't warm 76 — waits. The final stack [76, 73] never resolves: both answer 0." }
  ],
  "caption": "Daily Temperatures — the monotonic stack holds days still waiting for warmth, temperatures decreasing bottom to top."
}
\`\`\`

**Complexity.** O(n) time — the push-once-pop-once amortised argument, third time in this atlas — and O(n) space, versus the O(n²) brute force. Anyone the stack still holds at the end answers 0.

**Thread.** "Next greater element" is a whole problem *family*, and you now own its key. Car Fleet, next, hides the same monotonic shape inside a word problem about cars — the popping happens in your head before any code is written.`,
    },
    {
      slug: "car-fleet",
      title: "Car Fleet",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/car-fleet",
      summary: "Sort by position, think in arrival times: fleets form exactly where a slower leader absorbs the fast.",
      body: `**Signal.** "A faster car catching a slower one cannot pass — they merge into a fleet; how many fleets reach the target" — merging that only ever happens from behind, never breaking apart, is a one-directional absorption process, the same shape as the monotonic stack wearing a word-problem disguise.

**Brute force.** For every car, check every car ahead of it to see whether it gets absorbed before the target — O(n²) after sorting by position, redoing pairwise comparisons the monotonic scan below does in one pass.

**Optimal approach.** Simulating motion is a tar pit. The liberating move: a car's fate is determined by one number — the time it *would* reach the target driving alone: (target − position) / speed. Sort cars by starting position, closest to the target first, and read their alone-times in that order. The car ahead of you (closer to target) blocks you if and only if your alone-time is *less than or equal to* its effective time — you would arrive sooner, meaning you catch it en route and are absorbed, inheriting its pace. Process cars from the one nearest the target backwards, maintaining a stack of fleet *leaders* (their arrival times). Each new car compares its alone-time with the stack top: less or equal → it merges into that fleet, vanishing (no push); greater → it will never catch up, and becomes a new fleet leader (push). The stack ends holding exactly the fleets, arrival times strictly increasing from top of traffic to back — monotonic again, maintained by the same pop-or-push decision as Daily Temperatures, just with the popping happening as "never being pushed."

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 1, 12], "pointers": [{ "label": "car", "index": 0 }], "highlight": [0], "note": "Target 12. Nearest car (position 10, speed 2): alone-time = (12-10)/2 = 1. New fleet leader. Stack: [1]." },
    { "cells": [1, 1, 12], "pointers": [{ "label": "car", "index": 1 }], "highlight": [0, 1], "note": "Next car (position 8, speed 4): alone-time = 1. 1 <= leader's 1 -> merges into the same fleet. Stack unchanged: [1]." },
    { "cells": [1, 1, 12], "pointers": [{ "label": "car", "index": 2 }], "highlight": [2], "note": "Next car (position 0, speed 1): alone-time = 12. 12 > leader's 1 -> can never catch up. New fleet leader. Stack: [1, 12]. Total fleets: 2." }
  ],
  "caption": "Car Fleet — cars processed nearest-target-first; each one either merges into the current leader or becomes a new one."
}
\`\`\`

**Complexity.** O(n log n) for the sort, O(n) for the pass — versus the O(n²) pairwise brute force. The sort is doing real conceptual work: it converts a 2-D physics problem into a 1-D monotonic scan.

**Thread.** One problem left, and it is the monotonic stack's masterpiece: Largest Rectangle in Histogram, where each bar waits on the stack to learn *both* of its boundaries — and popping computes areas.`,
    },
    {
      slug: "largest-rectangle-in-histogram",
      title: "Largest Rectangle in Histogram",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/largest-rectangle-in-histogram",
      summary: "Every bar's best rectangle is bounded by the first shorter bar on each side — and one stack finds both.",
      body: `**Signal.** "Find the largest rectangle that fits entirely inside a histogram" — every candidate rectangle is pinned by whichever bar inside it is shortest, so this reduces to "first shorter bar to the left/right of each bar" — Daily Temperatures' question, asked twice in mirror.

**Brute force.** For each bar, expand left and right until hitting a shorter bar, tracking the width — O(n) per bar, O(n²) total. (A naive triple loop trying every left/right boundary pair is O(n³), worth naming only to bury.)

**Optimal approach.** Any candidate rectangle is pinned by some bar that is its *shortest* — the rectangle uses that bar's full height and extends left and right exactly until a shorter bar cuts it off. One left-to-right pass with a stack of bars *waiting for their right boundary*, kept increasing in height. When a new bar is shorter than the stack's top, the top's fate is sealed on both sides at once: the newcomer is its **right** boundary, and — the beautiful part — the entry sitting *underneath it on the stack* is its **left** boundary, because anything between them was taller and has already been popped. Pop it, compute its area, and keep popping while the newcomer undercuts. Push the newcomer. A virtual bar of height 0 at the end flushes everyone.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 1, 5, 6, 2, 3], "pointers": [{ "label": "i", "index": 0 }], "highlight": [0], "note": "2 waits — nothing shorter has arrived yet. Stack (indices): [0]." },
    { "cells": [2, 1, 5, 6, 2, 3], "pointers": [{ "label": "i", "index": 1 }], "highlight": [0], "note": "1 arrives, shorter than 2 -> pop index 0: right boundary = index 1, left boundary = stack floor. Width 1, area 2. Stack: [1]." },
    { "cells": [2, 1, 5, 6, 2, 3], "pointers": [{ "label": "i", "index": 3 }], "highlight": [1, 2, 3], "note": "5, then 6 stack up increasing (indices 2, 3 pushed, no pops). Stack: [1, 2, 3]." },
    { "cells": [2, 1, 5, 6, 2, 3], "pointers": [{ "label": "i", "index": 4 }], "highlight": [2, 3], "note": "2 arrives: pops index 3 (h=6, width 1, area 6), pops index 2 (h=5, width 2, area 10 — the eventual best). Stack: [1, 4]." },
    { "cells": [2, 1, 5, 6, 2, 3], "pointers": [{ "label": "i", "index": 5 }], "highlight": [4, 5], "note": "3 arrives, taller than 2 -> just pushes. Stack: [1, 4, 5]." },
    { "cells": [2, 1, 5, 6, 2, 3], "note": "End of array: the virtual height-0 bar flushes everyone — pops index 5 (area 3), index 4 (width 4, area 8), index 1 (width 6, area 6). Best area overall: 10." }
  ],
  "caption": "Largest Rectangle in Histogram — a bar popped between a shorter newcomer and a shorter entry underneath knows both of its boundaries at once."
}
\`\`\`

**Complexity.** O(n) time — push once, pop once — O(n) space, versus the O(n²) per-bar expansion (or O(n³) triple loop). The stack wins outright.

**Thread.** Chapter closed: matching, augmenting, computing, and the monotonic wait. Next chapter abandons arrival order entirely and returns to *sorted space* — Binary Search, where every comparison discards not one candidate but half the world.`,
    },
  ],
};
