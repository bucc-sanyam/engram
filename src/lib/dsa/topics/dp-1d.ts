import type { DsaTopic } from "../types";

/** Chapter 13 — 1-D Dynamic Programming: recursion that remembers. */
export const dp1d: DsaTopic = {
  slug: "dp-1d",
  title: "1-D Dynamic Programming",
  chapter: 13,
  tagline:
    "Overlapping subproblems, remembered once — the decision tree collapsed into a single array.",
  color: "#ffd166",
  prereqs: ["backtracking"],
  unlocks: ["dp-2d", "bit-manipulation"],
  intro: `Dynamic programming is the entire discipline built on one observation: **if a subproblem's answer depends only on where you are, not how you got there, solve it once and remember it.** The exponential tree collapses into a table with one entry per distinct state — and in this chapter, states fit in a single array: \`dp[i]\` for "the answer at position i" or "the answer for amount i."

Every problem follows the same five-finger checklist: **State** — what does \`dp[i]\` mean? **Recurrence** — how does \`dp[i]\` follow from earlier entries? **Base cases** — the smallest honest answers. **Order** — fill so dependencies are ready. **Answer location** — which entry is the result.

The twelve problems are sequenced as one long escalation: from Fibonacci-shaped recurrences (Climbing Stairs) through optimisation (Min Cost, House Robber) to string parsing (Decode Ways, Word Break) and finally the knapsack doorway (Partition Equal Subset Sum).`,
  problems: [
    /* ------------------------------------------------------------------ */
    /*  1. CLIMBING STAIRS                                                */
    /* ------------------------------------------------------------------ */
    {
      slug: "climbing-stairs",
      title: "Climbing Stairs",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/climbing-stairs",
      summary:
        "Fibonacci in disguise — the canonical tour from brute recursion to O(1) space.",
      body: `**Signal.** "Each time you can climb 1 or 2 steps — how many distinct ways to reach the top" — the last move splits into exactly two cases (a final 1-step or a final 2-step), and the count of ways to reach n is built from the counts for smaller n — the tell for a recurrence over one running index.

**Brute force.** Recurse directly: ways(n) = ways(n-1) + ways(n-2). Code this naively and watch it burn — ways(5) calls ways(3) twice, ways(2) three times, and the call tree doubles per level: **O(2ⁿ)**, all from recomputing the same subproblems endlessly (the same amnesia Fibonacci recursion always has).

**Optimal approach.** This is literally **Fibonacci** — F(1)=1, F(2)=2, F(n)=F(n-1)+F(n-2). Once a subproblem's answer depends only on *which step you're at*, not how you arrived, solve each step once and remember it: dp[i] = dp[i-1] + dp[i-2]. Tabulate bottom-up, filling left to right so both predecessors are always ready before you need them. Since each step only ever needs its two immediate predecessors, the whole array collapses to two rolling variables — O(n) time becomes O(1) space, the last stop on the memoisation-to-tabulation-to-rolling-variables tour every DP problem eventually takes.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, "·", "·", "·"], "note": "Base cases: dp[1]=1 (one way: a single step), dp[2]=2 (1+1, or one 2-step)." },
    { "cells": [1, 2, 3, "·", "·"], "highlight": [0, 1], "note": "dp[3] = dp[2] + dp[1] = 2 + 1 = 3." },
    { "cells": [1, 2, 3, 5, "·"], "highlight": [1, 2], "note": "dp[4] = dp[3] + dp[2] = 3 + 2 = 5." },
    { "cells": [1, 2, 3, 5, 8], "highlight": [2, 3], "note": "dp[5] = dp[4] + dp[3] = 5 + 3 = 8. Answer: 8 distinct ways." }
  ],
  "caption": "Climbing Stairs — Fibonacci's exact recurrence; each entry needs only its two immediate predecessors."
}
\`\`\`

**Complexity.** O(n) time, O(1) space with rolling variables — versus the brute recursion's O(2ⁿ) time from recomputing every subproblem from scratch.

**Thread.** Min Cost Climbing Stairs keeps the identical shape and swaps the operator: counting paths with + becomes optimising them with min.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What sequence does Climbing Stairs directly map to?",
          options: ["The Fibonacci sequence", "The Catalan numbers", "The Harmonic series", "The Collatz conjecture"],
          correct_index: 0,
          model_answer: "The number of ways to reach step n is exactly the sum of ways to reach step n-1 and n-2.",
          difficulty: "basic"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  2. MIN COST CLIMBING STAIRS                                       */
    /* ------------------------------------------------------------------ */
    {
      slug: "min-cost-climbing-stairs",
      title: "Min Cost Climbing Stairs",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/min-cost-climbing-stairs",
      summary:
        "Same staircase, now priced: dp[i] = cost[i] + min(two predecessors).",
      body: `**Signal.** "Each step has a toll — minimise the total cost, starting from step 0 or 1" — Climbing Stairs' exact shape with the operator swapped: counting paths (+) becomes optimising them (min).

**Brute force.** Try every possible sequence of 1-and-2-steps from start to past-the-end, summing tolls, and keep the cheapest — exponentially many paths, recomputing the same suffixes from every route that reaches a given step.

**Optimal approach.** dp[i] = cheapest total cost to **stand on** step i (toll paid): dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Base cases dp[0] = cost[0], dp[1] = cost[1]; the answer is min(dp[n-1], dp[n-2]) since the "top" is one step past the array, reachable from either of the last two steps.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 100, "·", "·", "·", "·", "·", "·", "·", "·"], "pointers": [{ "label": "dp[0]", "index": 0 }, { "label": "dp[1]", "index": 1 }], "note": "Base cases: dp[0]=cost[0]=1, dp[1]=cost[1]=100 — the toll just to stand on each starting step." },
    { "cells": [1, 100, 2, "·", "·", "·", "·", "·", "·", "·"], "pointers": [{ "label": "i", "index": 2 }], "highlight": [0, 1], "note": "dp[2] = cost[2] + min(dp[1], dp[0]) = 1 + min(100, 1) = 2 — the cheap step beats jumping from the costly one." },
    { "cells": [1, 100, 2, 3, 3, "·", "·", "·", "·", "·"], "pointers": [{ "label": "i", "index": 4 }], "highlight": [2, 3], "note": "dp[3]=3 and dp[4]=3 — every predecessor here is cheap, so cost just climbs by 1 each step." },
    { "cells": [1, 100, 2, 3, 3, 103, "·", "·", "·", "·"], "pointers": [{ "label": "i", "index": 5 }], "highlight": [3, 4], "note": "dp[5] = cost[5] + min(dp[4], dp[3]) = 100 + 3 = 103 — standing on step 5 is expensive no matter which predecessor you arrive from." },
    { "cells": [1, 100, 2, 3, 3, 103, 4, 5, 104, 6], "pointers": [{ "label": "i", "index": 9 }], "highlight": [7, 8], "note": "dp[9] = cost[9] + min(dp[8], dp[7]) = 1 + min(104, 5) = 6 — arriving from dp[7] is a 2-step jump straight over step 8's toll." },
    { "cells": [1, 100, 2, 3, 3, 103, 4, 5, 104, 6], "highlight": [8, 9], "note": "Answer = min(dp[9], dp[8]) = min(6, 104) = 6. The optimal path never stands on either 100 — it zigzags over both." }
  ],
  "caption": "Min Cost Climbing Stairs — dp[i] = cost[i] + min(dp[i-1], dp[i-2]), filled left to right."
}
\`\`\`

**Complexity.** O(n) time, O(1) space with rolling variables — versus the brute force's exponential path enumeration.

**Thread.** House Robber keeps the same two-predecessor shape but changes the decision from "which of two arrival costs" to "take this element or don't" — the include/exclude recurrence, the single most reused shape in DP.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Min Cost Climbing Stairs, what does dp[i] typically represent?",
          options: ["The cost of the step itself.", "The minimum total cost to reach the top starting from step i.", "The maximum possible cost avoided.", "The cost to reach step i from the bottom."],
          correct_index: 1,
          model_answer: "Usually, dp[i] is defined as the minimum cost to climb to the top starting from step i, computing backwards from the top.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  3. HOUSE ROBBER                                                   */
    /* ------------------------------------------------------------------ */
    {
      slug: "house-robber",
      title: "House Robber",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/house-robber",
      summary:
        "Take it and skip a neighbour, or skip it — the include/exclude recurrence.",
      body: `**Signal.** "Adjacent houses share an alarm — you cannot rob neighbours, maximise the total haul" — a non-adjacency constraint over a linear sequence, maximised, is the tell for the include/exclude recurrence: at each position, either take it (and skip the neighbour) or don't.

**Brute force.** Try every subset of houses respecting non-adjacency and keep the max sum — 2ⁿ subsets, though a greedy shortcut ("always rob the richest available") tempts and fails: [2,1,1,2] wants both 2s (indices 0 and 3), skipping *two* houses in the middle, which no fixed alternating pattern finds.

**Optimal approach.** For each house i, two choices: **skip it** → best from dp[i-1]; **take it** → nums[i] + dp[i-2] (the adjacent house must be skipped). dp[i] = max(dp[i-1], nums[i] + dp[i-2]). This include/exclude recurrence is the single most reused shape in DP.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 7, "·", "·", "·"], "pointers": [{ "label": "dp[0]", "index": 0 }, { "label": "dp[1]", "index": 1 }], "note": "Base cases: dp[0]=nums[0]=2 (one house, just take it). dp[1]=max(nums[0],nums[1])=max(2,7)=7 — rob the richer of the first two." },
    { "cells": [2, 7, 11, "·", "·"], "pointers": [{ "label": "i", "index": 2 }], "highlight": [0, 1], "note": "dp[2] = max(dp[1], nums[2]+dp[0]) = max(7, 9+2) = 11 — taking house 2 plus house 0's loot beats skipping it." },
    { "cells": [2, 7, 11, 11, "·"], "pointers": [{ "label": "i", "index": 3 }], "highlight": [1, 2], "note": "dp[3] = max(dp[2], nums[3]+dp[1]) = max(11, 3+7) = 11 — skipping house 3 wins this time." },
    { "cells": [2, 7, 11, 11, 12], "pointers": [{ "label": "i", "index": 4 }], "highlight": [2, 3], "note": "dp[4] = max(dp[3], nums[4]+dp[2]) = max(11, 1+11) = 12 — taking house 4 plus house 2's total edges it out." },
    { "cells": [2, 7, 11, 11, 12], "highlight": [0, 2, 4], "note": "Final answer dp[4] = 12, achieved by robbing houses 0, 2, 4 → 2 + 9 + 1 = 12." }
  ],
  "caption": "House Robber — dp[i] = max(dp[i-1], nums[i] + dp[i-2])."
}
\`\`\`

**Complexity.** O(n) time, O(1) space with rolling variables — versus the O(2ⁿ) brute-force subset search.

**Thread.** House Robber II bends the street into a circle — the local recurrence still holds everywhere except at the seam, where a global constraint (house 0 and house n−1 are neighbours) needs a different trick entirely: split into two linear cases.`,
      questions: [
        {
          kind: "open",
          prompt: "What is the core recurrence relation for House Robber?",
          model_answer: "dp[i] = max(rob_current + dp[i+2], skip_current + dp[i+1]). We choose the maximum between robbing the current house and adding the max from two houses down, or skipping it and keeping the max from the next house.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  4. HOUSE ROBBER II                                                */
    /* ------------------------------------------------------------------ */
    {
      slug: "house-robber-ii",
      title: "House Robber II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/house-robber-ii",
      summary:
        "A circular street: split into two linear cases and take the better.",
      body: `**Signal.** "Same rules, but the houses form a **circle** — house 0 and house n−1 are adjacent" — the old recurrence dp[i] = max(dp[i-1], nums[i] + dp[i-2]) only sees *local* adjacency, and a circle adds one **global** constraint no per-index recurrence can express directly — the tell to split into cases instead of extending the recurrence.

**Brute force.** Try every subset respecting both local non-adjacency and the wraparound constraint (0 and n−1 not both chosen) directly — 2ⁿ subsets, with the wraparound check bolted on awkwardly at every candidate.

**Optimal approach.** Every valid plan either skips house 0 **or** skips house n−1 (or both — covered by either case). Within each case, the circle breaks into a **linear** street: Case A is houses [1..n-1] (skip house 0), Case B is houses [0..n-2] (skip house n-1). Run House Robber I, unchanged, on each slice, and take the max. Splitting a global constraint into cases that each reduce to an already-solved subproblem is a broadly reusable move, not specific to circles.

\`\`\`viz:table-diff
{
  "columns": ["Case", "Houses considered", "Best haul (House Robber I)"],
  "before": [["A: skip house 0", "[2, 3, 1]", "3"]],
  "after": [["B: skip house n-1", "[1, 2, 3]", "4"]],
  "caption": "nums=[1,2,3,1]. Case A excludes house 0, Case B excludes house 3 (n-1). Answer = max(3, 4) = 4, achieved by robbing houses 0 and 2 (1+3=4) under Case B's slice."
}
\`\`\`

**Complexity.** O(n) time — two linear passes — O(1) space, same order as the brute force's exponential blowup avoided.

**Thread.** Longest Palindromic Substring leaves counting-and-optimising behind for a different DP flavour entirely: expanding outward from centres, where the "state" is a symmetric window instead of a running index.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How do we handle the circular street in House Robber II?",
          options: ["By using a 2D DP array.", "By running the standard House Robber algorithm twice: once skipping the first house, and once skipping the last house.", "By duplicating the array.", "By always skipping the first house."],
          correct_index: 1,
          model_answer: "Because the first and last houses are adjacent, you cannot rob both. Therefore, the maximum profit is the max of robbing houses[0 to n-2] or houses[1 to n-1].",
          difficulty: "basic"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  5. LONGEST PALINDROMIC SUBSTRING                                  */
    /* ------------------------------------------------------------------ */
    {
      slug: "longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-palindromic-substring",
      summary:
        "Every palindrome has a centre — expand from all 2n−1 of them and keep the widest.",
      body: `**Signal.** "Find the longest contiguous palindromic substring" — palindromes are symmetric around a centre, which is the tell for expanding outward from every possible centre instead of verifying substrings independently.

**Brute force.** Check all O(n²) substrings, each requiring O(n) to verify as a palindrome — O(n³) total, massively redundant since re-verifying overlapping middles happens endlessly.

**Optimal approach.** Every palindrome is symmetric about a **centre** — odd length (like "aba") centres on a character, even length (like "abba") centres on a gap between characters. A string of length n has 2n − 1 possible centres. From each, expand outward while characters match, tracking the longest span found. Two centres, one loop: expand(i, i) for odd-length, expand(i, i+1) for even-length, at every index i.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["b", "a", "b", "a", "d"], "pointers": [{ "label": "centre", "index": 0 }], "note": "Centre at index 0 ('b'): expand outward — nothing beyond the string's edge. Length 1." },
    { "cells": ["b", "a", "b", "a", "d"], "pointers": [{ "label": "centre", "index": 1 }], "highlight": [0, 1, 2], "note": "Centre at index 1 ('a'): expand — s[0]='b', s[2]='b' match → \\"bab\\", length 3. New longest." },
    { "cells": ["b", "a", "b", "a", "d"], "pointers": [{ "label": "centre", "index": 2 }], "note": "Centre at index 2 ('b'): expand — s[1]='a', s[3]='a' match → \\"aba\\", length 3. Ties the current best, doesn't beat it." },
    { "cells": ["b", "a", "b", "a", "d"], "pointers": [{ "label": "centre", "index": 3 }], "note": "Centre at index 3 ('a'): expand — s[2]='b', s[4]='d' don't match. Length 1." },
    { "cells": ["b", "a", "b", "a", "d"], "highlight": [0, 1, 2], "note": "Longest found overall: \\"bab\\" (indices 0-2), length 3 — the first palindrome to reach that length." }
  ],
  "caption": "Longest Palindromic Substring — every one of the 2n-1 centres gets one expansion; the widest match wins."
}
\`\`\`

**Complexity.** O(n²) time, O(1) space with centre expansion — versus O(n³) brute force, or an O(n²)-time, O(n²)-space DP table that tracks palindrome status for every (start, end) pair.

**Thread.** Palindromic Substrings reuses this exact expansion engine — the only change is what gets harvested: every successful expansion step counts as one more answer, instead of tracking just the longest.`,
      questions: [
        {
          kind: "open",
          prompt: "Why is expanding around the center better than a 2D DP table for Longest Palindromic Substring?",
          model_answer: "Expanding from the center achieves the same O(N^2) time complexity as the DP approach but only requires O(1) space, whereas the DP table requires O(N^2) space.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  6. PALINDROMIC SUBSTRINGS                                         */
    /* ------------------------------------------------------------------ */
    {
      slug: "palindromic-substrings",
      title: "Palindromic Substrings",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/palindromic-substrings",
      summary:
        "Same centres, new harvest: count every successful expansion step.",
      body: `**Signal.** "Count the total number of palindromic substrings (every occurrence counts separately)" — the same 2n−1 centres as Longest Palindromic Substring, but the question is a tally, not a maximum — the tell to reuse the identical expansion engine with a different harvest.

**Brute force.** Check all O(n²) substrings for palindrome-ness in O(n) each — O(n³), the same redundant re-verification as the longest-substring brute force.

**Optimal approach.** Reuse the centre-expansion engine unchanged. Instead of tracking the longest, **count every successful expansion step** — each time s[l] == s[r] during an expansion, that's one more palindromic substring, incremented right inside the expansion loop.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["a", "a", "a"], "pointers": [{ "label": "centre", "index": 0 }], "note": "Centre at index 0: 'a' alone counts. Total: 1." },
    { "cells": ["a", "a", "a"], "highlight": [0, 1], "note": "Gap centre between 0 and 1: s[0]=s[1]='a' → \\"aa\\" counts. Total: 2." },
    { "cells": ["a", "a", "a"], "pointers": [{ "label": "centre", "index": 1 }], "highlight": [0, 1, 2], "note": "Centre at index 1: 'a' alone counts, then expanding once more matches s[0]=s[2]='a' → \\"aaa\\" counts too. Total: 4." },
    { "cells": ["a", "a", "a"], "highlight": [1, 2], "note": "Gap centre between 1 and 2: s[1]=s[2]='a' → \\"aa\\" counts. Total: 5." },
    { "cells": ["a", "a", "a"], "pointers": [{ "label": "centre", "index": 2 }], "note": "Centre at index 2: 'a' alone counts. Total: 6." }
  ],
  "caption": "Palindromic Substrings — the same centre-expansion sweep as the longest-substring problem; here every successful match increments a running count instead of a max."
}
\`\`\`

**Complexity.** O(n²) time, O(1) space — versus the O(n³) brute-force substring check.

**Thread.** Decode Ways returns to Fibonacci-shaped counting, but now every step must pass a validity check before it's allowed to count at all — zeros are the whole game.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How many possible centers are there for palindromes in a string of length N?",
          options: ["N", "2N", "2N - 1", "N^2"],
          correct_index: 2,
          model_answer: "There are N single-character centers and N-1 between-character centers (for even-length palindromes), totaling 2N - 1 centers.",
          difficulty: "advanced"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  7. DECODE WAYS                                                    */
    /* ------------------------------------------------------------------ */
    {
      slug: "decode-ways",
      title: "Decode Ways",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/decode-ways",
      summary:
        "Fibonacci with validity guards: the last token was one digit or two, but zeros must ride as tails.",
      body: `**Signal.** "Letters A-Z are encoded as 1-26 — count the number of valid decodings" — the last token being either one digit or two is the tell for a two-predecessor recurrence, Climbing Stairs' exact shape, gated by a validity check on each option.

**Brute force.** Recursively try consuming one digit or two digits at each position, branching on validity — exponential in the worst case, recomputing the same suffix's decode count from every prefix that reaches it.

**Optimal approach.** dp[i] counts valid decodings of the first i characters. If s[i] != '0': dp[i] += dp[i-1] (single digit valid, 1-9). If s[i-1:i+1] is 10-26: dp[i] += dp[i-2] (two-digit valid). **Zeros are the whole game** — '0' alone is invalid, and must ride as the tail of "10" or "20"; inputs like "30" or "100" give 0 decodings entirely.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, "·", "·", "·"], "note": "Base: dp[0] = 1 (empty prefix, one trivial way to decode nothing)." },
    { "cells": [1, 1, "·", "·"], "highlight": [0], "note": "dp[1] ('2'): single digit '2' is valid (1-9) → += dp[0] = 1." },
    { "cells": [1, 1, 2, "·"], "highlight": [0, 1], "note": "dp[2] ('22'): single digit '2' valid → += dp[1] = 1. Two-digit '22' is 10-26, valid → += dp[0] = 1. Total 2." },
    { "cells": [1, 1, 2, 3], "highlight": [1, 2], "note": "dp[3] ('226'): single digit '6' valid → += dp[2] = 2. Two-digit '26' is 10-26, valid → += dp[1] = 1. Total 3." }
  ],
  "caption": "Decode Ways — dp[i] sums a single-digit continuation and a two-digit continuation, each gated by validity."
}
\`\`\`

**Complexity.** O(n) time, O(1) space with rolling variables — versus exponential naive recursion without memoisation.

**Thread.** Coin Change keeps counting-with-validity but makes the jump every DP problem eventually makes: the state stops indexing *position in the input* and starts indexing *how much of a resource remains*.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Decode Ways, what is the special edge case you must always handle?",
          options: ["Negative numbers.", "Numbers larger than 26.", "Leading zeros (like '06').", "Empty strings."],
          correct_index: 2,
          model_answer: "A string starting with '0' cannot be decoded into a letter (since 'A' is '1', not '0'). Any sequence starting with '0' contributes 0 ways to decode.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  8. COIN CHANGE                                                    */
    /* ------------------------------------------------------------------ */
    {
      slug: "coin-change",
      title: "Coin Change",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/coin-change",
      summary:
        "State = amount, not position. Fewest coins for every value 0..target.",
      body: `**Signal.** "Fewest coins to make an amount exactly, unlimited supply" — an optimum over how a target quantity can be assembled from repeatable pieces is the tell for state indexed by *remaining amount*, not position in any input sequence.

**Brute force.** Take-the-biggest greedy: 6 → 4+1+1 = 3 coins. But 3+3 = 2 coins beats it — greedy only works for denomination systems designed to make it work (like US coins), and fails in general. A true brute force tries every combination of coins summing to the target: exponential.

**Optimal approach (the abstraction jump).** Until now, dp was indexed by position in the input. Here the state is **how much money remains**: dp[a] = fewest coins to make amount a. dp[a] = 1 + min(dp[a - c] for each coin c if a - c >= 0). Base: dp[0] = 0. Fill from 1 upward — every amount's answer depends only on smaller amounts, already computed.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, "·", "·", "·", "·", "·", "·"], "note": "Base case: dp[0] = 0 — zero coins needed to make amount 0." },
    { "cells": [0, 1, "·", "·", "·", "·", "·"], "pointers": [{ "label": "a", "index": 1 }], "highlight": [0], "note": "dp[1] = 1 + dp[0] = 1 — one coin of value 1." },
    { "cells": [0, 1, 2, "·", "·", "·", "·"], "pointers": [{ "label": "a", "index": 2 }], "highlight": [1], "note": "dp[2] = 1 + dp[1] = 2 — two 1-coins; coins 3 and 4 don't fit yet." },
    { "cells": [0, 1, 2, 1, "·", "·", "·"], "pointers": [{ "label": "a", "index": 3 }], "highlight": [0, 2], "note": "dp[3] = 1 + min(dp[2]=2, dp[0]=0) = 1 — a single coin of value 3 beats three 1s." },
    { "cells": [0, 1, 2, 1, 1, "·", "·"], "pointers": [{ "label": "a", "index": 4 }], "highlight": [0, 1, 3], "note": "dp[4] = 1 + min(dp[3]=1, dp[1]=1, dp[0]=0) = 1 — coin 4 directly." },
    { "cells": [0, 1, 2, 1, 1, 2, "·"], "pointers": [{ "label": "a", "index": 5 }], "highlight": [1, 2, 4], "note": "dp[5] = 1 + min(dp[4]=1, dp[2]=2, dp[1]=1) = 2." },
    { "cells": [0, 1, 2, 1, 1, 2, 2], "pointers": [{ "label": "a", "index": 6 }], "highlight": [2, 3, 5], "note": "dp[6] = 1 + min(dp[5]=2, dp[3]=1, dp[2]=2) = 2 — two coins of value 3 (3+3). Answer: 2." }
  ],
  "caption": "Coin Change — dp[a] = 1 + min(dp[a-c]) over each coin c, filled from amount 0 up."
}
\`\`\`

**Complexity.** O(amount × coins) time — pseudo-polynomial — O(amount) space — versus the exponential all-combinations brute force.

**Thread.** Maximum Product Subarray leaves counting/amount-indexed DP for a Kadane's-style running scan — but with a twist that breaks the single running value House Robber and friends relied on.`,
      questions: [
        {
          kind: "open",
          prompt: "Why do we initialize the DP array with 'amount + 1' in Coin Change?",
          model_answer: "Because 'amount + 1' acts as infinity. The maximum possible number of coins needed is 'amount' (all 1-value coins), so 'amount + 1' ensures we can reliably use Math.min() and check for impossible amounts at the end.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  9. MAXIMUM PRODUCT SUBARRAY                                       */
    /* ------------------------------------------------------------------ */
    {
      slug: "maximum-product-subarray",
      title: "Maximum Product Subarray",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/maximum-product-subarray",
      summary:
        "Carry the max AND the min: a negative number swaps them, and yesterday's worst becomes today's best.",
      body: `**Signal.** "The contiguous subarray with the largest *product*" — products, unlike sums, can flip sign entirely on one multiplication, which is the tell that a single running "best so far" value (Kadane's shape) isn't enough state.

**Brute force.** Compute the product of every contiguous subarray directly — O(n²), recomputing overlapping products from scratch for every start index.

**Optimal approach.** For sums, Kadane's algorithm carries one running value. For products, **negatives flip everything**: multiplying by −1 turns the max into the min and vice versa. Track **two** values at each position: maxHere = max(x, maxHere·x, minHere·x); minHere = min(x, maxHere·x, minHere·x) — a deeply negative running product is a rocket waiting for one more minus sign to fire. When a recurrence won't close with one running value, the state is too small — you don't need a cleverer formula, you need to remember more per step.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 3, -2, 4], "pointers": [{ "label": "i", "index": 0 }], "note": "x=2: maxHere=2, minHere=2. globalMax=2." },
    { "cells": [2, 3, -2, 4], "pointers": [{ "label": "i", "index": 1 }], "highlight": [0, 1], "note": "x=3: maxHere=max(3,2·3)=6, minHere=min(3,2·3)=3. globalMax=6." },
    { "cells": [2, 3, -2, 4], "pointers": [{ "label": "i", "index": 2 }], "note": "x=-2 (negative — max and min effectively swap roles): maxHere=max(-2,6·-2,3·-2)=-2, minHere=min(-2,6·-2,3·-2)=-12. globalMax stays 6." },
    { "cells": [2, 3, -2, 4], "pointers": [{ "label": "i", "index": 3 }], "note": "x=4: maxHere=max(4,-2·4,-12·4)=4, minHere=min(4,-2·4,-12·4)=-48. globalMax stays 6." },
    { "cells": [2, 3, -2, 4], "highlight": [0, 1], "note": "Best subarray: [2, 3], product 6 — the deeply negative minHere=-48 never got a chance to flip into a new max." }
  ],
  "caption": "Maximum Product Subarray — carrying both a running max AND min is what survives a sign flip; a single running value can't."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — versus the O(n²) all-subarrays brute force.

**Thread.** Word Break returns to prefix-indexed DP, but the recurrence now checks membership in a dictionary instead of an arithmetic condition.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must we track both the maximum and minimum product ending at each position?",
          options: ["To find the range of possible products.", "Because a negative minimum multiplied by a negative number becomes the new maximum.", "To avoid dividing by zero.", "Because it's required for a sliding window."],
          correct_index: 1,
          model_answer: "A very large negative number (the minimum) can instantly flip into a massive positive number if multiplied by another negative number.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  10. WORD BREAK                                                    */
    /* ------------------------------------------------------------------ */
    {
      slug: "word-break",
      title: "Word Break",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/word-break",
      summary:
        "dp[i] asks: can the first i characters be fully segmented into dictionary words?",
      body: `**Signal.** "Can a string be segmented entirely into dictionary words (reuse allowed)?" — a prefix-by-prefix segmentability question is the tell for dp[i] = "can the first i characters be fully segmented," checked against every earlier valid cut point.

**Brute force.** Try every word at every position, recurse on the remainder — correct, but exponential on adversarial inputs: the same suffix is re-attempted from countless cut histories, the classic overlapping-subproblems signature DP exists to fix.

**Optimal approach.** dp[i] = true iff the prefix of length i can be fully segmented: dp[i] = any(dp[j] AND s[j:i] in wordSet for j in range(i)). Base: dp[0] = true (the empty prefix is trivially done). A hash set for wordDict membership makes each inner check O(1) amortised.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["T", "F", "F", "F", "F", "F", "F", "F", "F"], "note": "Base: dp[0] = T (empty prefix trivially segmentable)." },
    { "cells": ["T", "F", "F", "F", "T", "F", "F", "F", "F"], "pointers": [{ "label": "i", "index": 4 }], "highlight": [0], "note": "dp[4]: s[0:4] = \\"leet\\" is in the dictionary AND dp[0] = T → dp[4] = T." },
    { "cells": ["T", "F", "F", "F", "T", "F", "F", "F", "T"], "pointers": [{ "label": "i", "index": 8 }], "highlight": [4], "note": "dp[8]: s[4:8] = \\"code\\" is in the dictionary AND dp[4] = T → dp[8] = T. Answer: true — \\"leet\\" + \\"code\\"." }
  ],
  "caption": "Word Break — dp[i] checks every earlier valid cut point j where both dp[j] holds and s[j:i] is a dictionary word."
}
\`\`\`

**Complexity.** O(n² · k) time where k is average word length for substring hashing, O(n) space — versus exponential naive recursion without memoisation.

**Thread.** Longest Increasing Subsequence keeps the "look back at every earlier index" shape but changes the question from segmentability to an optimum — and adds a second, much faster solution hiding underneath the obvious one.`,
      questions: [
        {
          kind: "open",
          prompt: "What does dp[i] store in the bottom-up DP solution for Word Break?",
          model_answer: "dp[i] stores a boolean indicating whether the substring starting at index i (to the end of the string) can be successfully segmented into words from the dictionary.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  11. LONGEST INCREASING SUBSEQUENCE                                */
    /* ------------------------------------------------------------------ */
    {
      slug: "longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-increasing-subsequence",
      summary:
        "dp[i] = LIS ending at i in O(n²). Then patience-sorting tails array in O(n log n).",
      body: `**Signal.** "The length of the longest strictly increasing *subsequence*" — subsequence, not subarray (elements keep order but can skip), is the tell that the best chain ending at each element depends on the best chains ending at every earlier *smaller* element.

**Brute force.** Try every subset of elements, check whether it's increasing, keep the longest — 2ⁿ subsets, exponential and throwing away order information the array already gives you for free.

**Optimal approach (O(n²) DP).** dp[i] = length of the LIS **ending exactly at** index i: dp[i] = 1 + max(dp[j] for j < i if nums[j] < nums[i]), or 1 if no such j exists. Answer: max(dp).

\`\`\`viz:array
{
  "frames": [
    { "cells": [10, 9, 2, 5, 3, 7, 101, 18], "note": "Input array — values, not yet dp." },
    { "cells": [1, 1, 1, "·", "·", "·", "·", "·"], "note": "dp[0..2] = 1: each of 10, 9, 2 has no smaller earlier element, so each starts its own chain of length 1." },
    { "cells": [1, 1, 1, 2, 2, "·", "·", "·"], "highlight": [2], "note": "dp[3]=2 (5 extends the chain ending at 2), dp[4]=2 (3 also extends the chain ending at 2)." },
    { "cells": [1, 1, 1, 2, 2, 3, 4, 4], "highlight": [3, 4], "note": "dp[5]=3 (7 extends 5 or 3, whichever gives dp=2). dp[6]=4 (101 extends 7, dp=3). dp[7]=4 (18 also extends 7, tying 101's chain length). Answer: max(dp) = 4." }
  ],
  "caption": "Longest Increasing Subsequence — dp[i] looks back at every smaller earlier value and extends its best chain."
}
\`\`\`

**The O(n log n) approach — patience sorting.** Keep a tails array where tails[k] = smallest possible tail of an increasing subsequence of length k+1. For each number x: if x extends the longest chain (bigger than every tail), append; otherwise binary-search the first tail ≥ x and replace it — same idea as Koko's monotone feasibility search, aimed at maintaining the cheapest possible "ending value" per chain length. tails is *not* an actual LIS — its entries may belong to different chains — only its length is meaningful.

**Complexity.** DP (look-back): O(n²) time, O(n) space. Patience sorting: O(n log n) time, O(n) space — versus the brute force's O(2ⁿ) subset enumeration.

**Thread.** Partition Equal Subset Sum closes the chapter at the knapsack doorway: state indexed by *target sum*, like Coin Change, but now each number is available only once — and the sweep direction becomes the entire difference between using an item once and using it unboundedly.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What makes Patience Sorting (Binary Search) superior to standard 1D DP for LIS?",
          options: ["It uses less space.", "It is easier to implement.", "It reduces the time complexity from O(N^2) to O(N log N).", "It can handle negative numbers."],
          correct_index: 2,
          model_answer: "By maintaining a sorted array of the smallest tails of all increasing subsequences of length i, we can binary search where to place the next element, dropping time to O(N log N).",
          difficulty: "advanced"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  12. PARTITION EQUAL SUBSET SUM                                    */
    /* ------------------------------------------------------------------ */
    {
      slug: "partition-equal-subset-sum",
      title: "Partition Equal Subset Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/partition-equal-subset-sum",
      summary:
        "Subset-sum DP: which totals are buildable? Sweep high-to-low so each number is used once.",
      body: `**Signal.** "Can an array be split into two subsets with equal sums" — equal-sum partition reduces to finding a subset summing to exactly half the total, which is the tell for **subset-sum** DP: state indexed by target amount, exactly like Coin Change, but with each number usable only once.

**Brute force.** Try every subset (2ⁿ of them), check whether its sum equals total/2 — exponential, and if total is odd, impossible immediately (can't split an odd sum into two equal integer halves).

**Optimal approach.** dp[a] = true iff some subset of numbers seen so far sums to exactly a. For each number x, sweep amounts **high-to-low**: for a in range(target, x-1, -1): dp[a] = dp[a] OR dp[a-x]. Sweeping low-to-high would let dp[a-x] be a value just set *using x itself* — counting x twice (unbounded knapsack, Coin Change's shape). High-to-low ensures only values from *before* x arrived get read, so each number is used at most once. This single loop direction is the entire 0/1-versus-unbounded-knapsack distinction.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["✓", "·", "·", "·", "·", "·", "·", "·", "·", "·", "·", "·"], "note": "Start: only sum 0 is reachable — the empty subset." },
    { "cells": ["✓", "✓", "·", "·", "·", "·", "·", "·", "·", "·", "·", "·"], "pointers": [{ "label": "x=1", "index": 1 }], "highlight": [0], "note": "After num=1: dp[1] = dp[1] OR dp[0] → sum 1 becomes reachable." },
    { "cells": ["✓", "✓", "·", "·", "·", "✓", "✓", "·", "·", "·", "·", "·"], "pointers": [{ "label": "x=5", "index": 5 }], "highlight": [0, 1], "note": "After num=5, swept high-to-low: dp[6] picks up dp[1] and dp[5] picks up dp[0] — 5 alone, or 5+1." },
    { "cells": ["✓", "✓", "·", "·", "·", "✓", "✓", "·", "·", "·", "·", "✓"], "pointers": [{ "label": "x=11", "index": 11 }], "highlight": [0], "note": "After num=11: dp[11] = dp[11] OR dp[0] → sum 11 is reachable on its own. Target hit." },
    { "cells": ["✓", "✓", "·", "·", "·", "✓", "✓", "·", "·", "·", "·", "✓"], "highlight": [11], "note": "dp[target] = dp[11] = true → the array splits into {11} and {1,5,5}, both summing to 11." }
  ],
  "caption": "Partition Equal Subset Sum — dp[a]: can some subset sum to exactly a? Swept high-to-low per number so each is used once."
}
\`\`\`

**Complexity.** O(n × target) time — pseudo-polynomial — O(target) space — versus the O(2ⁿ) all-subsets brute force.

**Thread.** That closes 1-D DP: twelve problems, one checklist — state, recurrence, base cases, order, answer location — applied to counting (Climbing Stairs), optimising (House Robber), string validity (Decode Ways, Word Break), and now knapsack-shaped resource allocation. Next, **2-D Dynamic Programming** adds a second dimension to the state — two strings, two indices, a grid — and the same five-finger checklist scales up unchanged.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What must be true about the sum of the array for Partition Equal Subset Sum to be possible?",
          options: ["It must be zero.", "It must be even.", "It must be a prime number.", "It must be greater than the maximum element."],
          correct_index: 1,
          model_answer: "If the total sum is odd, it is impossible to divide the array into two subsets with equal integer sums.",
          difficulty: "basic"
        }
      ]
    },
  ],
};
