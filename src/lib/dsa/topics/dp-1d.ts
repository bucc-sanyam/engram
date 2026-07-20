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
      body: `**Problem Statement**
You are climbing a staircase with \`n\` steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?

*Example:*
\`\`\`
Input:  n = 5
Output: 8
\`\`\`

---

**Building Intuition (Brute Force)**
From step \`n\`, the last move was either a 1-step (from \`n-1\`) or a 2-step (from \`n-2\`). So:
\`\`\`
ways(n) = ways(n-1) + ways(n-2)
\`\`\`
Code this recursively and watch it burn: \`ways(5)\` calls \`ways(3)\` twice, \`ways(2)\` three times. The call tree doubles per level → **O(2^n)**.

\`\`\`
                  ways(5)
                /         \\
           ways(4)        ways(3)
           /    \\         /    \\
       ways(3)  ways(2) ways(2) ways(1)
       /    \\
   ways(2) ways(1)           ← ways(2) computed 3 times!
\`\`\`

---

**Finding the Pattern**
This is literally **Fibonacci**: \`F(1)=1, F(2)=2, F(n)=F(n-1)+F(n-2)\`.

The four tellings of this solution, from worst to best:

| Approach | Time | Space | Key idea |
|---|---|---|---|
| Brute recursion | O(2^n) | O(n) stack | Amnesia — recomputes everything |
| Memoisation (top-down) | O(n) | O(n) | Cache results → each subproblem computed once |
| Tabulation (bottom-up) | O(n) | O(n) | Fill array left-to-right |
| **Rolling variables** | **O(n)** | **O(1)** | Only 2 predecessors needed |

---

**Visualisation**
\`\`\`
Step:    1    2    3    4    5
dp:      1    2    3    5    8
              ↑         ↑
              |    3+5 = 8
         base cases
\`\`\`

---

**Code & Complexity**
\`\`\`python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1
\`\`\`

- **Time:** O(n)
- **Space:** O(1) — only two rolling variables`,
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
      body: `**Problem Statement**
Each step has a toll paid when you step on it. You can start from step 0 or step 1. Minimise the total cost to reach just past the last step.

*Example:*
\`\`\`
Input:  cost = [10, 15, 20]
Output: 15         # start at step 1 (cost 15), jump to the top
\`\`\`

---

**Building Intuition**
Climbing Stairs *counted* paths (using +). Here we *optimise* paths (using min). The structure is identical — the operator changed.

---

**Finding the Pattern / Recurrence Relation**
\`dp[i]\` = cheapest total cost to **stand on** step \`i\` (toll paid).

\`\`\`
dp[i] = cost[i] + min(dp[i-1], dp[i-2])
\`\`\`

*Bases:* \`dp[0] = cost[0]\`, \`dp[1] = cost[1]\`.
*Answer:* \`min(dp[n-1], dp[n-2])\` — the "top" is past the array.

---

**Visualisation**
\`cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]\`:
\`\`\`
Step:   0    1    2    3    4    5    6    7    8    9
cost:   1  100    1    1    1  100    1    1  100    1
dp:     1  100    2    3    3  103    4    5  104    6

Answer: min(dp[9], dp[8]) = min(6, 104) = 6
\`\`\`
The optimal path zigzags over every 100.

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

---

**Code & Complexity**
\`\`\`python
def minCostClimbingStairs(cost: list[int]) -> int:
    prev2, prev1 = cost[0], cost[1]
    for i in range(2, len(cost)):
        curr = cost[i] + min(prev1, prev2)
        prev2 = prev1
        prev1 = curr
    return min(prev1, prev2)
\`\`\`

- **Time:** O(n)
- **Space:** O(1) with rolling variables`,
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
      body: `**Problem Statement**
Houses in a row each hold cash. Adjacent houses share an alarm — you cannot rob neighbours. Maximise the total haul.

*Example:*
\`\`\`
Input:  nums = [2, 7, 9, 3, 1]
Output: 12         # rob houses 0, 2, 4 → 2 + 9 + 1 = 12
\`\`\`

---

**Building Intuition (Why Greedy Fails)**
"Always rob the richest available" breaks: \`[2, 1, 1, 2]\` wants both 2s (indices 0 and 3) — skipping *two* houses in the middle — which no fixed alternating pattern finds.

---

**Finding the Pattern / Recurrence Relation**
For each house \`i\`, two choices:
1. **Skip it** → best from \`dp[i-1]\`
2. **Take it** → \`nums[i] + dp[i-2]\` (skip the adjacent house)

\`\`\`
dp[i] = max(dp[i-1], nums[i] + dp[i-2])
\`\`\`

This **include/exclude recurrence** is the single most reused shape in DP.

---

**Visualisation**
\`nums = [2, 7, 9, 3, 1]\`:
\`\`\`
House:   0    1    2    3    4
Value:   2    7    9    3    1
dp:      2    7   11   11   12
                   ↑         ↑
              max(7, 9+2)   max(11, 1+11)
\`\`\`

---

**The Walk-through**
- \`dp[2] = max(7, 9+2) = 11\` → taking house 2 wins
- \`dp[3] = max(11, 3+7) = 10 → 11\` → skipping house 3 wins
- \`dp[4] = max(11, 1+11) = 12\` → taking house 4 wins

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

---

**Code & Complexity**
\`\`\`python
def rob(nums: list[int]) -> int:
    if len(nums) <= 2:
        return max(nums)
    prev2, prev1 = nums[0], max(nums[0], nums[1])
    for i in range(2, len(nums)):
        curr = max(prev1, nums[i] + prev2)
        prev2 = prev1
        prev1 = curr
    return prev1
\`\`\`

- **Time:** O(n)
- **Space:** O(1)`,
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
      body: `**Problem Statement**
Same rules as House Robber, but the houses form a **circle** — house 0 and house \`n-1\` are adjacent.

*Example:*
\`\`\`
Input:  nums = [2, 3, 2]
Output: 3          # can't rob both 2s (they're neighbours in a circle)
\`\`\`

---

**Building Intuition**
The old recurrence \`dp[i] = max(dp[i-1], nums[i] + dp[i-2])\` only handles *local* adjacency. The circle adds one **global** constraint: houses 0 and \`n-1\` exclude each other. No per-index recurrence can see this.

---

**Finding the Pattern / Constraint Splitting**
Every valid plan either skips house 0 **or** skips house \`n-1\` (or both — that's covered by either case). Within each case, the circle is broken into a **linear** street:

\`\`\`
Case A: houses [1 .. n-1]     (skip house 0)
Case B: houses [0 .. n-2]     (skip house n-1)

Answer = max( rob_linear(Case A), rob_linear(Case B) )
\`\`\`

We run House Robber I (unchanged) on each slice.

---

**Visualisation**
\`nums = [1, 2, 3, 1]\`:
\`\`\`
Circle:  1 — 2 — 3 — 1 — (back to 1)

Case A: [2, 3, 1] → rob(2,1)=3 or rob(3)=3 → 3
Case B: [1, 2, 3] → rob(1,3)=4 → 4

Answer: max(3, 4) = 4   (rob houses 0 and 2)
\`\`\`

---

**Code & Complexity**
\`\`\`python
def rob(nums: list[int]) -> int:
    if len(nums) == 1:
        return nums[0]
    def rob_linear(arr):
        prev2, prev1 = 0, 0
        for x in arr:
            prev2, prev1 = prev1, max(prev1, x + prev2)
        return prev1
    return max(rob_linear(nums[1:]), rob_linear(nums[:-1]))
\`\`\`

- **Time:** O(n) — two linear passes
- **Space:** O(1)`,
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
      body: `**Problem Statement**
Find the longest contiguous palindromic substring.

*Example:*
\`\`\`
Input:  s = "babad"
Output: "bab"      # "aba" is also valid
\`\`\`

---

**Building Intuition (Brute Force)**
Check all O(n²) substrings × O(n) to verify palindrome = O(n³). Massively redundant — we re-verify the same middles endlessly.

---

**Finding the Pattern / Centre Expansion**
Every palindrome is symmetric about a **centre**:
- Odd length (e.g., "aba"): centre is a character
- Even length (e.g., "abba"): centre is a gap between characters

A string of length \`n\` has \`2n - 1\` possible centres. From each, expand outward while characters match.

\`\`\`
  b  a  b  a  d
  ↑     ↑     ↑
  c0    c2    c4    ← character centres (odd palindromes)
    c1    c3        ← gap centres (even palindromes)
\`\`\`

---

**Visualisation**
\`s = "babad"\`:
\`\`\`
Centre 0 (b):  expand → "b" only               len=1
Centre 1 (b|a): no match                       len=0
Centre 2 (a):  expand → b=b ✓ → "bab"          len=3 ★
Centre 3 (a|b): no match                       len=0
Centre 4 (b):  expand → a=a ✓ → "aba"          len=3
...
Longest: "bab" (length 3)
\`\`\`

---

**Code & Complexity**
\`\`\`python
def longestPalindrome(s: str) -> str:
    start, max_len = 0, 1
    
    def expand(l, r):
        nonlocal start, max_len
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > max_len:
                start, max_len = l, r - l + 1
            l -= 1
            r += 1
    
    for i in range(len(s)):
        expand(i, i)       # odd-length
        expand(i, i + 1)   # even-length
    return s[start : start + max_len]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| Brute force | O(n³) | O(1) |
| DP table | O(n²) | O(n²) |
| **Centre expansion** | **O(n²)** | **O(1)** |`,
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
      body: `**Problem Statement**
Count the total number of palindromic substrings (every occurrence counts separately).

*Example:*
\`\`\`
Input:  s = "aaa"
Output: 6          # "a","a","a","aa","aa","aaa"
\`\`\`

---

**Building Intuition**
Reuse the centre-expansion engine from Longest Palindromic Substring. Instead of tracking the longest, **count every expansion step** — each successful step is one palindromic substring.

---

**Finding the Pattern**
From each of the \`2n-1\` centres, expand outward. Each time \`s[l] == s[r]\`, that's one more palindromic substring. The counter increments *inside* the expansion loop.

---

**Visualisation**
\`s = "aaa"\`:
\`\`\`
Centre 0 (a):    "a" ✓                         → count = 1
Centre 0.5 (a|a): "aa" ✓                       → count = 2
Centre 1 (a):    "a" ✓, expand "aaa" ✓          → count = 4
Centre 1.5 (a|a): "aa" ✓                       → count = 5
Centre 2 (a):    "a" ✓                          → count = 6
Total: 6
\`\`\`

---

**Code & Complexity**
\`\`\`python
def countSubstrings(s: str) -> int:
    count = 0
    def expand(l, r):
        nonlocal count
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1
            r += 1
    for i in range(len(s)):
        expand(i, i)       # odd
        expand(i, i + 1)   # even
    return count
\`\`\`

- **Time:** O(n²)
- **Space:** O(1)`,
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
      body: `**Problem Statement**
Letters A-Z are encoded as 1-26. Given a digit string, count the number of valid decodings.

*Example:*
\`\`\`
Input:  s = "226"
Output: 3          # "BZ" (2,26), "VF" (22,6), "BBF" (2,2,6)
\`\`\`

---

**Building Intuition**
This is Climbing Stairs where each "step" must pass a validity check. The last token is either:
- A **single digit** (valid if 1-9, i.e., non-zero)
- A **two-digit** number (valid if 10-26)

---

**Finding the Pattern / Recurrence Relation**
\`\`\`
dp[i] = 0
If s[i] != '0':   dp[i] += dp[i-1]     ← single digit valid
If s[i-1:i+1] is 10-26:  dp[i] += dp[i-2]     ← two-digit valid
\`\`\`

**Zeros are the whole game.** \`'0'\` alone is invalid. It *must* ride as the tail of \`10\` or \`20\`. Inputs like \`"30"\` or \`"100"\` → 0 decodings.

---

**Visualisation**
\`s = "226"\`:
\`\`\`
Index:     ∅    '2'   '22'  '226'
dp:        1     1     2      3

'2':  single=✓(dp[∅]=1)                        → 1
'22': single=✓(dp['2']=1) + pair 22≤26 ✓(dp[∅]=1) → 2
'226': single 6=✓(dp['22']=2) + pair 26≤26 ✓(dp['2']=1) → 3
\`\`\`

---

**Code & Complexity**
\`\`\`python
def numDecodings(s: str) -> int:
    if not s or s[0] == '0':
        return 0
    prev2, prev1 = 1, 1  # dp[-1]=1 (empty), dp[0]=1
    for i in range(1, len(s)):
        curr = 0
        if s[i] != '0':
            curr += prev1
        two_digit = int(s[i-1:i+1])
        if 10 <= two_digit <= 26:
            curr += prev2
        prev2, prev1 = prev1, curr
    return prev1
\`\`\`

- **Time:** O(n)
- **Space:** O(1)`,
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
      body: `**Problem Statement**
Given coin denominations (unlimited supply) and a target amount, return the fewest coins to make it exactly, or \`-1\` if impossible.

*Example:*
\`\`\`
Input:  coins = [1, 3, 4], amount = 6
Output: 2          # 3 + 3
\`\`\`

---

**Building Intuition (Why Greedy Fails)**
Take-the-biggest: \`6 → 4 + 1 + 1 = 3 coins\`. But \`3 + 3 = 2 coins\`. Greedy works for US coins (by design) but fails in general.

---

**Finding the Pattern / The Abstraction Jump**
Until now, \`dp\` was indexed by **position in the input**. Here the state is **how much money remains**:

\`dp[a]\` = fewest coins to make amount \`a\`.

\`\`\`
dp[a] = 1 + min(dp[a - c] for each coin c if a - c >= 0)
\`\`\`

*Base:* \`dp[0] = 0\`. Fill from 1 upward.

---

**Visualisation**
\`coins = [1, 3, 4]\`, \`amount = 6\`:
\`\`\`
Amount:  0   1   2   3   4   5   6
dp:      0   1   2   1   1   2   2

dp[6] = 1 + min(dp[5]=2, dp[3]=1, dp[2]=2) = 1 + 1 = 2
                                     ↑
                              coin 3 wins!
\`\`\`

---

**The Walk-through**
- \`dp[1] = 1 + dp[0] = 1\` (coin 1)
- \`dp[3] = 1 + min(dp[2]=2, dp[0]=0) = 1\` (coin 3 directly)
- \`dp[4] = 1 + min(dp[3]=1, dp[1]=1, dp[0]=0) = 1\` (coin 4 directly)
- \`dp[6] = 1 + min(dp[5]=2, dp[3]=1, dp[2]=2) = 2\` → **3+3**

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

---

**Code & Complexity**
\`\`\`python
def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
    return dp[amount] if dp[amount] != float('inf') else -1
\`\`\`

- **Time:** O(amount × coins) — *pseudo-polynomial*
- **Space:** O(amount)`,
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
      body: `**Problem Statement**
Find the contiguous subarray with the largest *product*.

*Example:*
\`\`\`
Input:  nums = [2, 3, -2, 4]
Output: 6          # subarray [2, 3]
\`\`\`

---

**Building Intuition**
For sums, Kadane's algorithm carries one running value. For products, **negatives flip everything**: multiplying by \`-1\` turns the max into the min and vice versa. A deeply negative running product is a rocket waiting for one more minus sign.

---

**Finding the Pattern / Widen the State**
Track **two** values at each position:
\`\`\`
maxHere = max(x, maxHere * x, minHere * x)
minHere = min(x, maxHere * x, minHere * x)
\`\`\`

When \`x < 0\`, swap maxHere and minHere *before* multiplying.

**General lesson:** When a recurrence won't close, the state is too small. You don't need a cleverer formula — you need to remember more per step.

---

**Visualisation**
\`nums = [2, 3, -2, 4]\`:
\`\`\`
 i  | x  | maxHere | minHere | globalMax
----|----|---------|---------|---------
 0  |  2 |    2    |    2    |    2
 1  |  3 |    6    |    3    |    6
 2  | -2 |   -2    |  -12    |    6
 3  |  4 |    4    |  -48    |    6

Now append -1:
 4  | -1 |   48    |   -4    |   48  ← the rocket fires!
\`\`\`

---

**Code & Complexity**
\`\`\`python
def maxProduct(nums: list[int]) -> int:
    result = max(nums)
    cur_max, cur_min = 1, 1
    for x in nums:
        if x == 0:
            cur_max, cur_min = 1, 1
            continue
        tmp = cur_max * x
        cur_max = max(x, tmp, cur_min * x)
        cur_min = min(x, tmp, cur_min * x)
        result = max(result, cur_max)
    return result
\`\`\`

- **Time:** O(n)
- **Space:** O(1)`,
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
      body: `**Problem Statement**
Can a string be segmented entirely into dictionary words (words can be reused)?

*Example:*
\`\`\`
Input:  s = "leetcode", wordDict = ["leet", "code"]
Output: true       # "leet" + "code"
\`\`\`

---

**Building Intuition**
Try every word at every position, recurse on the remainder. Correct, but exponential on adversarial inputs: the same suffix is re-attempted from countless cut histories → overlapping subproblems.

---

**Finding the Pattern / Recurrence Relation**
\`dp[i] = true\` iff the prefix of length \`i\` can be fully segmented.

\`\`\`
dp[i] = any(dp[j] AND s[j:i] in wordSet
            for j in range(i))
\`\`\`

*Base:* \`dp[0] = true\` (empty prefix is trivially done).

---

**Visualisation**
\`s = "leetcode"\`, \`wordDict = ["leet", "code"]\`:
\`\`\`
Index:  0    1    2    3    4    5    6    7    8
        ∅    l    e    e    t    c    o    d    e
dp:     ✓    ✗    ✗    ✗    ✓    ✗    ✗    ✗    ✓
                             ↑                   ↑
                        "leet"              "code"
                        dp[0]=✓             dp[4]=✓
\`\`\`

---

**The Walk-through**
- \`i=4\`: \`s[0:4]="leet"\` in dict AND \`dp[0]=✓\` → \`dp[4]=✓\`
- \`i=8\`: \`s[4:8]="code"\` in dict AND \`dp[4]=✓\` → \`dp[8]=✓\` → **true**

For \`"catsandog"\` with ["cats","dog","sand","and","cat"]:
- \`dp[3]="cat"\` ✓, \`dp[4]="cats"\` ✓, \`dp[7]="sand/and"\` ✓ — but remainder "og" has no word → \`dp[9]=false\`.

---

**Code & Complexity**
\`\`\`python
def wordBreak(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[len(s)]
\`\`\`

- **Time:** O(n² · k) where k = average word length for substring hashing
- **Space:** O(n)`,
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
      body: `**Problem Statement**
Find the length of the longest strictly increasing subsequence.

*Example:*
\`\`\`
Input:  nums = [10, 9, 2, 5, 3, 7, 101, 18]
Output: 4          # [2, 3, 7, 101] or [2, 3, 7, 18]
\`\`\`

---

**Building Intuition**
Subsequence (not subarray) — elements keep their order but can skip. For each element, should we include it in the chain? We need to know the best chain ending at every previous smaller element.

---

**Finding the Pattern / O(n²) DP**
\`dp[i]\` = length of the LIS **ending exactly at** index \`i\`.

\`\`\`
dp[i] = 1 + max(dp[j] for j < i if nums[j] < nums[i])
\`\`\`
If no such \`j\` exists, \`dp[i] = 1\`. Answer: \`max(dp)\`.

---

**Visualisation (O(n²) DP)**
\`nums = [10, 9, 2, 5, 3, 7, 101, 18]\`:
\`\`\`
Index:   0   1   2   3   4   5   6    7
Value:  10   9   2   5   3   7  101  18
dp:      1   1   1   2   2   3   4    4

dp[5]=3: look back → 2<7(dp=1), 5<7(dp=2), 3<7(dp=2) → 1+2=3
dp[6]=4: look back → 7<101(dp=3) → 1+3=4
\`\`\`

---

**The O(n log n) Approach — Patience Sorting**
Keep a \`tails\` array where \`tails[k]\` = smallest possible tail of an increasing subsequence of length \`k+1\`.

For each number \`x\`:
- If \`x > tails[-1]\`: append (extends longest chain)
- Else: binary search the first \`tails[k] >= x\` and replace it

\`\`\`
nums:  10   9   2   5   3   7  101  18
tails: [10]→[9]→[2]→[2,5]→[2,3]→[2,3,7]→[2,3,7,101]→[2,3,7,18]
                                                        length = 4
\`\`\`

**Important:** tails is NOT an actual LIS — its entries may belong to different chains. Only its **length** is meaningful.

---

**Code & Complexity**
\`\`\`python
import bisect
def lengthOfLIS(nums: list[int]) -> int:
    tails = []
    for x in nums:
        pos = bisect.bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
    return len(tails)
\`\`\`

| Approach | Time | Space |
|---|---|---|
| DP (look-back) | O(n²) | O(n) |
| **Patience sorting** | **O(n log n)** | **O(n)** |`,
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
      body: `**Problem Statement**
Can an array be split into two subsets with equal sums?

*Example:*
\`\`\`
Input:  nums = [1, 5, 11, 5]
Output: true       # {1,5,5} and {11}
\`\`\`

---

**Building Intuition**
If total sum is odd → impossible (can't split evenly). Otherwise, we need to find a subset that sums to exactly \`total / 2\`. This is the **subset-sum** problem.

---

**Finding the Pattern / Recurrence Relation**
\`dp[a] = true\` iff some subset of numbers seen so far sums to exactly \`a\`.

For each number \`x\`, sweep amounts **high-to-low**:
\`\`\`
for a in range(target, x-1, -1):
    dp[a] = dp[a] OR dp[a - x]
\`\`\`

**Why high-to-low?** Sweeping low-to-high would let \`dp[a-x]\` be a value we just set *using x itself* — counting x twice (unbounded knapsack). High-to-low ensures we only read values from *before* x arrived → each number used at most once. **This single loop direction is the entire 0/1 vs unbounded knapsack distinction.**

---

**Visualisation**
\`nums = [1, 5, 11, 5]\`, \`target = 11\`:
\`\`\`
                  sum: 0  1  2  3  4  5  6  7  8  9 10 11
 ──────────────────────────────────────────────────────────
 Start:                ✓  ✗  ✗  ✗  ✗  ✗  ✗  ✗  ✗  ✗  ✗  ✗
 After num=1:          ✓  ✓  ✗  ✗  ✗  ✗  ✗  ✗  ✗  ✗  ✗  ✗
 After num=5:          ✓  ✓  ✗  ✗  ✗  ✓  ✓  ✗  ✗  ✗  ✗  ✗
 After num=11:         ✓  ✓  ✗  ✗  ✗  ✓  ✓  ✗  ✗  ✗  ✗  ✓ ← dp[11]=✓!
\`\`\`

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

---

**Code & Complexity**
\`\`\`python
def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for x in nums:
        for a in range(target, x - 1, -1):
            dp[a] = dp[a] or dp[a - x]
    return dp[target]
\`\`\`

- **Time:** O(n × target) — pseudo-polynomial
- **Space:** O(target)`,
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
