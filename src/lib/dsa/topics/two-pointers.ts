import type { DsaTopic } from "../types";

/** Chapter 2 — Two Pointers: exploiting structure instead of buying it. */
export const twoPointers: DsaTopic = {
  slug: "two-pointers",
  title: "Two Pointers",
  chapter: 2,
  tagline:
    "When the data already has structure, two moving fingers replace an entire hash map.",
  color: "#43d6b5",
  prereqs: ["arrays-hashing"],
  unlocks: ["binary-search", "sliding-window", "linked-list"],
  intro: `Chapter one taught you to buy speed with memory. This chapter teaches the counter-move: sometimes you do not need to buy anything, because the data already carries structure you can spend instead. Usually that structure is *sortedness* — and the tool for spending it is two indexes, walking toward each other.

The core argument: put one pointer at each end of a sorted array. If their sum is too small, advance the left pointer (moving right can only shrink it). If too big, the mirror applies. Every comparison retires one candidate, and a quadratic universe of pairs collapses into a single linear pass.

The five problems build from simple mirroring (Valid Palindrome) to the full exploit: Two Sum II, 3Sum, Container With Most Water, and the boss fight — Trapping Rain Water.`,
  problems: [
    /* ------------------------------------------------------------------ */
    /*  1. VALID PALINDROME                                               */
    /* ------------------------------------------------------------------ */
    {
      slug: "valid-palindrome",
      title: "Valid Palindrome",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/is-palindrome",
      summary:
        "Two mirrored pointers meeting in the middle — the gentlest introduction to the pattern.",
      body: `**Signal.** "Determine if a string is a palindrome, considering only alphanumeric characters" — a claim about *mirrored positions* (first = last, second = second-to-last, …) is the clearest possible tell for two pointers converging from both ends.

**Brute force.** Build a cleaned string — lowercase, alphanumeric only — then check if it equals its own reverse. Correct, O(n) time, but O(n) extra space for the copy that two pointers can avoid entirely.

**Optimal approach.** Walk one pointer in from the left, one in from the right. When a pointer sits on a non-alphanumeric character, skip it — advance that pointer without comparing. Only compare when both rest on real characters; if they ever disagree (case-insensitively), it isn't a palindrome. If the pointers meet without ever disagreeing, it is.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["r", "a", "c", "e", " ", "a", " ", "c", "a", "r"], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 9 }], "note": "L='r', R='r' -> match, move both inward." },
    { "cells": ["r", "a", "c", "e", " ", "a", " ", "c", "a", "r"], "pointers": [{ "label": "L", "index": 1 }, { "label": "R", "index": 8 }], "note": "L='a', R='a' -> match, move inward." },
    { "cells": ["r", "a", "c", "e", " ", "a", " ", "c", "a", "r"], "pointers": [{ "label": "L", "index": 2 }, { "label": "R", "index": 7 }], "note": "L='c', R='c' -> match, move inward." },
    { "cells": ["r", "a", "c", "e", " ", "a", " ", "c", "a", "r"], "pointers": [{ "label": "L", "index": 3 }, { "label": "R", "index": 6 }], "note": "L='e', R=' ' -> R is non-alphanumeric, skip it inward without comparing." },
    { "cells": ["r", "a", "c", "e", " ", "a", " ", "c", "a", "r"], "pointers": [{ "label": "L", "index": 3 }, { "label": "R", "index": 5 }], "highlight": [3, 5], "note": "L='e', R='a' -> mismatch. Return false." }
  ],
  "caption": "Valid Palindrome — s = \\"race a car\\": mirrored comparisons converge inward, skipping punctuation, until a mismatch or a meeting."
}
\`\`\`

**Complexity.** O(n) time — each pointer moves only inward, never backtracks — and O(1) space, no cleaned copy needed.

**Thread.** Here the two pointers only ever *mirrored* — same distance from each end, moving in lockstep. Next, Two Sum II asks them to move *independently*, driven by a comparison against a target instead of a fixed symmetry — the chapter's real thesis begins there.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Valid Palindrome, why do we use two pointers starting at opposite ends?",
          options: ["To find the middle element faster.", "To check for symmetry by comparing characters from the outside moving inwards.", "Because a single pointer cannot iterate over a string.", "To reverse the string in place."],
          correct_index: 1,
          model_answer: "A palindrome is perfectly symmetrical, so characters equidistant from the ends must match. Two pointers converging inwards is the optimal O(N) way to verify this without extra memory.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "How does the optimal approach handle non-alphanumeric characters?",
          model_answer: "It uses an inner loop to advance the pointers past any non-alphanumeric characters before comparing them, effectively skipping spaces and punctuation without allocating a new cleaned string.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  2. TWO SUM II                                                     */
    /* ------------------------------------------------------------------ */
    {
      slug: "two-sum-ii",
      title: "Two Sum II (Sorted Array)",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/two-integer-sum-ii",
      summary:
        "The chapter's thesis: sortedness lets each comparison retire a candidate forever.",
      body: `**Signal.** "1-indexed **sorted** array, find two numbers that add up to the target, use O(1) extra space" — the hash map from Chapter 1's Two Sum still works, but the O(1) space bar rules it out, and the word "sorted" is doing all the talking: sortedness is structure you can spend instead of memory.

**Brute force.** Every pair, O(n²) — or the O(n)/O(n) hash-map lookup from Two Sum, which is fast but violates the O(1) space requirement this problem is specifically testing.

**Optimal approach (the retirement argument).** Place pointers at both ends. Check their sum: if it's less than target, the left value can't work with *anything* — even the largest remaining number — so retire it and move the left pointer right. If the sum is greater, the mirror applies: retire the right value, move left. If the sum matches, done. Each comparison permanently eliminates one candidate, so the pointers meet in at most n steps — no rescanning, no memory.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 3, 4, 7, 11], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 4 }], "note": "sum = 1 + 11 = 12 > 10 -> retire R (11 is too big for anyone)." },
    { "cells": [1, 3, 4, 7, 11], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 3 }], "note": "sum = 1 + 7 = 8 < 10 -> retire L (1 is too small for anyone)." },
    { "cells": [1, 3, 4, 7, 11], "pointers": [{ "label": "L", "index": 1 }, { "label": "R", "index": 3 }], "highlight": [1, 3], "note": "sum = 3 + 7 = 10 = target -> found. 1-indexed answer: [2, 4]." }
  ],
  "caption": "Two Sum II — each comparison retires one candidate forever; L and R converge on the answer in three steps."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — the whole point of spending sortedness instead of buying a hash map.

**Thread.** You just retired candidates two at a time with a fixed pair of pointers. 3Sum adds a third moving part — but rather than three pointers dancing together, it fixes one and hands the other two straight back to this exact algorithm.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Two Sum II, if the sum of the elements at the left and right pointers is greater than the target, which pointer must move?",
          options: ["The left pointer must move right (L = L + 1).", "The right pointer must move left (R = R - 1).", "Both pointers must move inwards.", "We must start over from the beginning."],
          correct_index: 1,
          model_answer: "Because the array is sorted, the only way to decrease the sum is to move the right pointer to a smaller value.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "Why can't we use a hash map for Two Sum II to achieve O(N) time?",
          model_answer: "We *could* use a hash map, but it requires O(N) extra space. The two-pointer approach leverages the sorted property to achieve O(N) time with only O(1) constant space, which is strictly better.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  3. 3SUM                                                           */
    /* ------------------------------------------------------------------ */
    {
      slug: "3sum",
      title: "3Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/three-integer-sum",
      summary:
        "Fix one number and the rest is Two Sum II — plus the art of skipping duplicates.",
      body: `**Signal.** "Find all unique triplets that sum to zero" — three moving parts is one too many to reason about directly, but "fix one, solve for two" is a standard reduction, and the two you're left solving for is exactly Two Sum II on a sorted array.

**Brute force.** Three nested loops trying every triplet, then dedupe the results with a set — O(n³) time, plus the annoyance of hash-based dedup on top.

**Optimal approach.** Sort the array first. For each index i, fix nums[i] and go looking for two numbers after it that sum to −nums[i] — that's Two Sum II, verbatim, on the remaining sorted suffix. The only new work is duplicate-skipping, and it happens at two levels: if nums[i] equals the previous nums[i−1], skip this i entirely — sorting already put its duplicate triplets one iteration ago, so re-running would just reproduce them. And after a match inside the inner two-pointer walk, slide L (and R) past any run of equal values before continuing, so the same triplet doesn't get recorded twice.

\`\`\`viz:array
{
  "frames": [
    { "cells": [-4, -1, -1, 0, 1, 2], "pointers": [{ "label": "i", "index": 1 }, { "label": "L", "index": 2 }, { "label": "R", "index": 5 }], "note": "Fix i=1 (val=-1), target = 1. Run Two Sum II on the suffix: L=2, R=5." },
    { "cells": [-4, -1, -1, 0, 1, 2], "pointers": [{ "label": "i", "index": 1 }, { "label": "L", "index": 2 }, { "label": "R", "index": 5 }], "highlight": [1, 2, 5], "note": "-1 + 2 = 1 = target -> found [-1,-1,2]. Skip L past its duplicate, then advance both pointers." },
    { "cells": [-4, -1, -1, 0, 1, 2], "pointers": [{ "label": "i", "index": 1 }, { "label": "L", "index": 3 }, { "label": "R", "index": 4 }], "highlight": [1, 3, 4], "note": "0 + 1 = 1 = target -> found [-1,0,1]. L and R meet next; move on to the next i." },
    { "cells": [-4, -1, -1, 0, 1, 2], "pointers": [{ "label": "i", "index": 2 }], "note": "i=2 has val=-1, same as nums[i-1] -> skip this i entirely, its triplets were already found." }
  ],
  "caption": "3Sum — fix i, then hand the rest to Two Sum II; duplicate-skipping at both levels is what keeps the output unique."
}
\`\`\`

**Complexity.** O(n²) time — n fixed positions × a linear two-pointer walk each — O(1) space beyond the output, since sorting is in-place.

**Thread.** Container With Most Water drops the sorting requirement and the target entirely — it replaces "find a pair matching a value" with "find a pair maximizing an area," but the two-pointer convergence argument survives the swap intact.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must we sort the array before solving 3Sum optimally?",
          options: ["To easily skip duplicate triplets and enable the two-pointer technique on the remaining two numbers.", "Because sorting reduces the overall time complexity from O(N^3) to O(N log N).", "To make it easier to binary search for the third number.", "The array doesn't actually need to be sorted."],
          correct_index: 0,
          model_answer: "Sorting is required both to easily skip duplicate values (to avoid duplicate triplets) and to run the Two Sum II algorithm on the rest of the array.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Explain how 3Sum handles avoiding duplicate triplets.",
          model_answer: "After sorting, we skip any number that is identical to the previous one in the outer loop. Inside the two-pointer loop, if we find a match, we also skip past any duplicate values for the left pointer.",
          difficulty: "advanced"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  4. CONTAINER WITH MOST WATER                                      */
    /* ------------------------------------------------------------------ */
    {
      slug: "container-with-most-water",
      title: "Container With Most Water",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/max-water-container",
      summary:
        "Always move the shorter wall — the greedy rule that provably never discards the best.",
      body: `**Problem Statement**
Vertical lines of various heights stand on the x-axis. Pick two that, with the x-axis, hold the most water. Area = distance × min(height_left, height_right).

*Example:*
\`\`\`
Input:  height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
Output: 49         # lines at index 1 (h=8) and index 8 (h=7): 7 × 7 = 49
\`\`\`

**Signal.** "Pick two lines that hold the most water" with area = distance × the *shorter* of the two — maximizing over pairs, where moving inward always shrinks one factor (width). That tension between width and height is what makes this a two-pointer convergence problem rather than a search.

**Brute force.** Try every pair of lines, compute the area, keep the max — O(n²) time, O(1) space. Correct, but the problem's real content is the O(n) argument below.

**Optimal approach (the shorter-wall rule).** area = (R − L) × min(height[L], height[R]). Start pointers at both ends. If you move the *taller* wall inward: width strictly decreases, and the min height can't increase — it's still pinned by the shorter wall on the other side — so area provably decreases or stays the same. That's a wasted move. So: **always move the shorter wall.** It's the only move that has any chance of improving the area, because the min might grow even as the width shrinks.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 8, 6, 2, 5, 4, 8, 3, 7], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 8 }], "note": "h[L]=1, h[R]=7 -> area = 8x1 = 8. L is shorter -> move L." },
    { "cells": [1, 8, 6, 2, 5, 4, 8, 3, 7], "pointers": [{ "label": "L", "index": 1 }, { "label": "R", "index": 8 }], "highlight": [1, 8], "note": "h[L]=8, h[R]=7 -> area = 7x7 = 49, the best area found. R is shorter -> move R." },
    { "cells": [1, 8, 6, 2, 5, 4, 8, 3, 7], "pointers": [{ "label": "L", "index": 1 }, { "label": "R", "index": 7 }], "note": "h[L]=8, h[R]=3 -> area = 6x3 = 18. Every later move stays below 49." }
  ],
  "caption": "Container With Most Water — always move the shorter wall; the best area (49) appears at step 2 and nothing beats it after."
}
\`\`\`

**Complexity.** O(n) time — each pointer moves inward at most n times total — O(1) space, versus the O(n²) brute force.

**Thread.** The shorter-wall rule is a *greedy* argument dressed up as two pointers: at each step, exactly one move is provably not worse than optimal. Trapping Rain Water, the chapter's boss fight next, asks a related-looking question — but instead of one global max, it wants the water trapped at *every* position, and the same L/R convergence idea has to carry running state instead of just comparing once.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Container With Most Water, what dictates the height of the water between two pointers?",
          options: ["The distance between the pointers.", "The sum of the heights of both pointers.", "The taller of the two heights.", "The shorter of the two heights."],
          correct_index: 3,
          model_answer: "Water cannot rise higher than the shorter wall without spilling over, so the area is always bottlenecked by min(height[L], height[R]).",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "Why do we always move the pointer pointing to the shorter wall?",
          model_answer: "Because moving the taller wall inwards will only decrease the width without increasing the height (since the height is bounded by the shorter wall). Moving the shorter wall is the only way to potentially find a taller boundary that offsets the lost width.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  5. TRAPPING RAIN WATER                                            */
    /* ------------------------------------------------------------------ */
    {
      slug: "trapping-rain-water",
      title: "Trapping Rain Water",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/trapping-rain-water",
      summary:
        "Water above each bar = min(maxLeft, maxRight) − height. Two pointers compute it in one pass.",
      body: `**Signal.** "Compute how much water is trapped after raining" over an elevation map — water above any bar depends on walls on *both* sides at once, which is what pulls this out of Container With Most Water's single global answer into a per-position running computation.

**Brute force.** Stand on each bar. Water there is max(0, min(maxLeft, maxRight) − height), where maxLeft and maxRight are the tallest walls anywhere to that side. Computed naively — rescanning left and right from every position — that's O(n²).

**Approach 2: prefix arrays.** Precompute maxLeft[] with a forward sweep and maxRight[] with a backward sweep, then apply the formula at every position in a third pass. O(n) time, but O(n) extra space for the two arrays.

**Optimal approach: two pointers, O(1) space.** Walk pointers inward from both ends, carrying running maxLeft and maxRight instead of precomputed arrays. The key insight: if maxLeft < maxRight, the *left* pointer's water is already fully determined — it's bounded by maxLeft, because whatever taller walls the right side is still hiding can only raise the right barrier, which isn't the binding one for this position. So you can settle the left position now and advance it, without ever knowing the true maxRight. Whichever side currently has the smaller running max is the side that's safe to process.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 11 }], "note": "maxLeft=0 (h[0]), maxRight=1 (h[11]). maxLeft <= maxRight -> advance L." },
    { "cells": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], "pointers": [{ "label": "L", "index": 5 }, { "label": "R", "index": 10 }], "note": "L has swept to index 5; maxLeft=2, maxRight=2 (ties go left). Water collected so far: 4." },
    { "cells": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], "pointers": [{ "label": "L", "index": 7 }, { "label": "R", "index": 10 }], "note": "L reaches index 7 (h=3): maxLeft jumps to 3, now maxLeft > maxRight(2) -> control switches to R. Water collected so far: 5." },
    { "cells": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], "pointers": [{ "label": "L", "index": 7 }, { "label": "R", "index": 7 }], "highlight": [7], "note": "R sweeps in to meet L at index 7. Total water trapped: 6." }
  ],
  "caption": "Trapping Rain Water — advance whichever side has the smaller running max; water at that step is bounded by it."
}
\`\`\`

**Complexity.** Brute force per bar: O(n²) time, O(1) space. Prefix arrays: O(n) time, O(n) space. Two pointers: O(n) time, O(1) space — the strict upgrade, and the version worth having ready cold.

**Thread.** That closes the chapter. Every problem here spent structure the array already had — mirror symmetry, sortedness, a max bound from both sides — instead of buying memory the way Chapter 1 did. Next, **Binary Search** takes sortedness even further: instead of two pointers converging linearly, it discards half the search space every single step.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What determines the amount of water trapped at a single position 'i'?",
          options: ["min(max_left, max_right) - height[i]", "max(max_left, max_right) - height[i]", "max_left + max_right - height[i]", "min(height[L], height[R])"],
          correct_index: 0,
          model_answer: "The water at index i is bounded by the maximum walls on its left and right. The shorter of those two max walls defines the waterline, and we subtract the ground height (height[i]) to get the depth.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "How does the two-pointer O(1) space solution avoid needing precomputed left/right max arrays?",
          model_answer: "It maintains running maxes from both ends (maxL and maxR). Because water is bounded by the smaller max, if maxL < maxR, we know exactly how much water can be trapped at L without needing to know the true maximum on its right (and vice versa).",
          difficulty: "advanced"
        }
      ]
    },
  ],
};
