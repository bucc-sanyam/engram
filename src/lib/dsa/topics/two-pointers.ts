import type { DsaTopic } from "../types";

/** Chapter 2 — Two Pointers: exploiting structure instead of buying it. */
export const twoPointers: DsaTopic = {
  slug: "two-pointers",
  title: "Two Pointers",
  chapter: 2,
  tagline: "When the data already has structure, two moving fingers replace an entire hash map.",
  color: "#43d6b5",
  prereqs: ["arrays-hashing"],
  unlocks: ["binary-search", "sliding-window", "linked-list"],
  intro: `Chapter one taught you to buy speed with memory. This chapter teaches the counter-move: sometimes you do not need to buy anything, because the data already carries structure you can spend instead. Usually that structure is *sortedness* — and the tool for spending it is embarrassingly simple: two indexes, walking toward each other.

Here is the core argument, and it is worth internalising because every problem in this chapter is a variation on it. Put one pointer at each end of a sorted array. The pair you are looking at has a sum. If that sum is too small, the *only* way to grow it is to advance the left pointer — moving the right one down can only shrink it. If too big, the mirror argument applies. Every comparison therefore permanently retires one candidate, and a quadratic universe of pairs collapses into a single linear pass. No map, no extra memory — the sort order does the remembering for you.

The five problems build the idea from touch to mastery. Valid Palindrome is the gentlest form: two pointers that merely *mirror* each other. Two Sum II is the argument above in its purest form — and the deliberate echo of chapter one's Two Sum, so you feel exactly what sortedness buys. 3Sum layers a loop on top: fix one element, and the remaining problem *is* Two Sum II. Container With Most Water flips the objective from equality to maximisation, and asks you to trust the retire-a-candidate argument even when it feels lossy. And Trapping Rain Water — the chapter's boss fight — makes both pointers carry running knowledge with them as they move.

On the roadmap this node fans out three ways. Binary Search takes "retire candidates using order" to its logarithmic extreme. Sliding Window keeps two pointers but makes them move in the *same* direction. And Linked List swaps indexes for node references, where the two-pointer idea becomes fast and slow runners. All three are children of what you learn here.`,
  problems: [
    {
      slug: "valid-palindrome",
      title: "Valid Palindrome",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/is-palindrome",
      summary: "Two mirrored pointers meeting in the middle — the gentlest possible introduction to the pattern.",
      body: `**The problem.** Given a string, decide whether it reads the same forwards and backwards — considering only alphanumeric characters and ignoring case. "Was it a car or a cat I saw?" should say yes.

**The insight.** A palindrome is a claim about *mirrored positions*: first character equals last, second equals second-to-last, and so on inward. That phrasing hands you the algorithm directly. Put one pointer at each end. Compare. Step both inward. The moment a pair disagrees, the answer is no; if the pointers meet or cross, every mirrored pair agreed and the answer is yes.

**The wrinkle.** The cleaning rule — ignore punctuation, spaces, case — is where the easy problem hides its actual interview content. The tempting move is to build a cleaned copy of the string first and compare it with its reverse: correct, but O(n) extra space. The pointer version cleans *in flight*: when the left pointer sits on a non-alphanumeric character, advance it and re-check; same for the right, moving down. Only when both rest on real characters do you compare (case-folded). No copy is ever made.

**The walk-through.** "Was it a car or a cat I saw?" — left starts at W, right skips past the question mark to w. W equals w (case-folded). Step inward, skip spaces as they come, keep matching: a-a, s-s… The pointers glide past every irrelevant character and meet in the middle without ever disagreeing.

**Complexity.** O(n) time — each pointer moves only forward (or only backward), so together they touch each character once. O(1) extra space, which is the entire point of doing it this way.

**The thread.** These two pointers only *mirrored* each other; neither made a decision. Next, Two Sum II gives the pointers a brain: at each step, the pair's sum decides which pointer moves — and that one decision rule is the engine of the whole chapter.`,
    },
    {
      slug: "two-sum-ii",
      title: "Two Sum II (Sorted Array)",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/two-integer-sum-ii",
      summary: "The chapter's thesis in pure form: sortedness lets each comparison retire a candidate forever.",
      body: `**The problem.** Two Sum again — find two numbers adding to a target — but the array is *sorted*, and the required space is O(1). The hash map that solved chapter one's version is now against the rules. That is not cruelty; it is the roadmap forcing you to discover what sortedness is worth.

**The insight.** Start with left at the smallest element and right at the largest. Look at their sum. If it is too small, consider what you actually know: left paired with *anything* — even the biggest element available — comes up short. Every pair involving this left value is dead. Retire it; move left inward. If the sum is too big, the mirror argument kills every pair involving the current right value; move right inward. Each comparison eliminates an entire row of the pair-space, so at most n steps remain of what was an n² search.

**The walk-through.** [1, 3, 4, 7, 11], target 10. Ends: 1+11 = 12, too big — 11 can never work with anything (even 11+1 overshoots… careful: the *reason* is that 11 paired with the smallest already exceeds 10, and every other partner is larger). Retire 11. Now 1+7 = 8, too small — 1 is exhausted; retire it. 3+7 = 10. Done, and note the guarantee the problem gives you — a solution exists — is what lets the walk always terminate on a hit.

**Why this is the important one.** Not for itself — for the *argument*. "This element can never again be part of a better answer, so drop it forever" is the exact reasoning you will reuse in Container With Most Water, in Trapping Rain Water, and later in binary search, where half the array dies per comparison instead of one element.

**Complexity.** O(n) time, O(1) space. Sorting an unsorted input first costs O(n log n) — which is why the hash map still wins chapter one's version, where no order comes for free.

**The thread.** Next, 3Sum stacks a third number on top — and the discovery is that after fixing one element, the leftover problem is *exactly this one*. Patterns compose.`,
    },
    {
      slug: "3sum",
      title: "3Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/three-integer-sum",
      summary: "Fix one number and the rest is Two Sum II — plus the art of skipping duplicates.",
      body: `**The problem.** Find every *unique* triplet in an array that sums to zero. [-1, 0, 1, 2, -1, -4] contains [-1, -1, 2] and [-1, 0, 1] — each reported once, no matter how many ways they can be formed.

**The insight.** Three moving parts are two too many to reason about — so nail one down. Sort the array, then walk a fixed pointer i across it. For each i, the question becomes: *find two numbers to my right summing to −nums[i]* — which is Two Sum II, verbatim, on the subarray after i. Left pointer just past i, right pointer at the end, walk them together with the retire-a-candidate rule. The triple loop you feared flattens into a double one.

**The duplicate discipline.** Uniqueness is where candidates fail this problem. Sorting is what makes it manageable: equal values sit adjacent, so duplicates are *skippable by comparison with your previous position*. Two rules. One — if nums[i] equals nums[i−1], skip this i entirely: it would regenerate every triplet the previous i already found. Two — after recording a hit inside the two-pointer walk, slide left past any repeats of its value before continuing. Both rules are the same idea: never start a search from a value you have already searched from.

**The walk-through.** Sorted: [-4, -1, -1, 0, 1, 2]. i on −4: seek pairs summing to 4 → none. i on first −1: seek 1 → (−1, 2) hit, then (0, 1) hit. i on second −1: same value, skipped. i on 0: seek 0 → (1, 2)? sums to 3, walk ends. Result: two unique triplets.

**Complexity.** O(n²) time — n fixed positions × linear pair-walk — after an O(n log n) sort; O(1) extra space beyond the output. A hash-based approach can also reach O(n²) but wrestles with duplicates far less gracefully; the sorted version's answer to uniqueness is what interviewers want to see.

**The thread.** So far the pointers hunted an exact sum. Container With Most Water, next, asks them to *maximise* something instead — and the retire-a-candidate argument has to survive a leap of faith.`,
    },
    {
      slug: "container-with-most-water",
      title: "Container With Most Water",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/max-water-container",
      summary: "Always move the shorter wall — the greedy pointer rule that provably never discards the best answer.",
      body: `**The problem.** Vertical lines of various heights stand on a number line. Pick two that, with the x-axis, hold the most water: the area is the *distance between them* times the *shorter* of the two heights. Maximise it.

**The naive move.** Every pair: O(n²). The chapter has trained you to be suspicious by now — two pointers at the ends feel right. But this time the sum-too-big/too-small compass is gone. Which pointer moves?

**The insight.** The area is width × min(leftHeight, rightHeight), and every inward step *shrinks the width*. So the only hope any move has of improving things is finding a taller minimum. Now the key question: if you move the pointer at the **taller** wall inward, what can happen? The width drops, and the minimum cannot rise — it is pinned by the shorter wall you kept. Every such move is provably wasted. Therefore: **always move the shorter wall.** It is the only move with upside. This is a greedy argument of the same family as Two Sum II's — "everything this wall could ever offer, we have already measured" — just one level subtler, because you are discarding *pairs you never looked at* and trusting the proof that none of them could win.

**The walk-through.** Heights [1, 8, 6, 2, 5, 4, 8, 3, 7], ends give width 8 × min(1, 7) = 8. Left wall (1) is shorter — move it. Now 8 and 7: width 7 × 7 = 49, the eventual answer. The walk continues, never beats 49, and every discard along the way was justified by the shorter-wall argument.

**Complexity.** O(n) time — one pointer or the other advances each step — O(1) space.

**The thread.** One line of greedy proof carried this whole problem. Trapping Rain Water, the chapter's finale, keeps the two walls but asks a harder question — not the best single container, but the water above *every* position — and the pointers will need to carry memory with them as they walk.`,
    },
    {
      slug: "trapping-rain-water",
      title: "Trapping Rain Water",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/trapping-rain-water",
      summary: "Water above each bar = min(best wall left, best wall right) − bar. Two pointers compute it in one pass.",
      body: `**The problem.** An elevation map of bars. Rain falls. How much water sits trapped in the valleys? For [0,1,0,2,1,0,1,3,2,1,2,1] the answer is 6 units.

**The insight, locally.** Forget the whole skyline; stand on one bar. The water column above *you* is decided by exactly two numbers: the tallest wall anywhere to your left and the tallest anywhere to your right. Water rises to the *lower* of those two barriers, minus your own height (never negative). That is the entire physics: water(i) = min(maxLeft, maxRight) − height(i). This per-position decomposition — answer at i = f(something from the left, something from the right) — should feel familiar: it is Product of Array Except Self's shape, returned in a harder costume.

**The prefix version.** And the same cure works: precompute maxLeft for every position in one forward sweep, maxRight in one backward sweep, then sum the formula. O(n) time, O(n) space, completely respectable — say it first in an interview.

**The two-pointer version.** The space melts away with one observation. Walk pointers inward from both ends, carrying running values of maxLeft and maxRight. At any moment, compare them. Suppose maxLeft is the smaller. Then for the *left pointer's* position, the true bound min(maxLeft, trueMaxRight) is already known — it is maxLeft, because whatever taller walls the right side still hides can only raise the right barrier, which is not the binding one. So the left position's water can be settled *now*, without ever seeing the rest of the array. Settle it, advance left. Whichever side owns the smaller max is always safe to process — the same "the smaller side's fate is sealed" logic that moved the shorter wall last problem, now used to *emit answers* rather than discard pairs.

**Complexity.** O(n) time, O(1) space. This is the canonical hard-mode payoff of the chapter's one idea.

**The thread.** Chapter closed. Two pointers moving toward each other, spending sortedness or geometry instead of memory. Next chapter the pointers change formation: both move *rightward*, and the space between them becomes a living window over the data — Sliding Window is two pointers with a purpose.`,
    },
  ],
};
