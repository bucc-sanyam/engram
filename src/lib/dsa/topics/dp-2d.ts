import type { DsaTopic } from "../types";

/** Chapter 14 — 2-D Dynamic Programming: states with two coordinates. */
export const dp2d: DsaTopic = {
  slug: "dp-2d",
  title: "2-D Dynamic Programming",
  chapter: 14,
  tagline:
    "Two strings, two choices, or a grid — when one index cannot describe where you stand.",
  color: "#6fdfa8",
  prereqs: ["graphs", "dp-1d"],
  unlocks: [],
  intro: `The last chapter's states fit in one number: a position, an amount. This chapter is what happens when *where you stand* takes two numbers to say. Sometimes literally — a robot at row i, column j of a grid. More often structurally: comparing two strings means a position in *each* (the great alignment family — Longest Common Subsequence, Edit Distance, Distinct Subsequences, Regular Expression Matching). Or one sequence with a second axis of *situation*: holding stock versus cooling down, choosing with a remaining capacity. The table becomes a plane; the recurrence becomes a cell looking at its neighbours — up, left, diagonal — and everything you practised in 1-D transfers cell by cell.

The five-finger checklist survives untouched: state sentence, recurrence from the last decision, bases (now a whole first row and column), fill order, answer cell. What is genuinely new is a small set of recurring *shapes*: the **grid walk** (Unique Paths), the **alignment square** (LCS and its cousins), the **loop-order flip** (Coin Change II), the **state-machine day** (Stock With Cooldown), **DFS + memo on a DAG** (Longest Increasing Path), and the **interval shape** (Burst Balloons). Master each shape once and every new 2-D DP problem becomes a variation you recognise.`,
  problems: [
    /* ------------------------------------------------------------------ */
    /*  1. UNIQUE PATHS                                                   */
    /* ------------------------------------------------------------------ */
    {
      slug: "unique-paths",
      title: "Unique Paths",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-paths",
      summary:
        "Count paths in a grid where every cell is reachable from above or the left.",
      body: `**Problem Statement**
A robot starts at the top-left corner of an \`m × n\` grid and can only move **right** or **down**. Return the number of unique paths to the bottom-right corner.

*Example:*
\`\`\`
Input:  m = 3, n = 7
Output: 28
\`\`\`

---

**Building Intuition (Brute Force)**
From \`(0, 0)\` we branch into two choices — right or down — and from each of those cells we branch again. This recursive tree has depth \`m + n - 2\` and up to \`2^(m+n)\` leaves. The bottleneck: the same cell is visited from many different paths. Going Right-then-Down and Down-then-Right both land on \`(1, 1)\`, yet we recompute everything from there twice.

\`\`\`
              (0,0)
             /     \\
         (0,1)     (1,0)
         /   \\     /   \\
      (0,2) (1,1) (1,1) (2,0)   ← (1,1) computed TWICE
\`\`\`

---

**Finding the Pattern / Recurrence Relation**
Since we can only arrive at \`(r, c)\` from above \`(r-1, c)\` or from the left \`(r, c-1)\`:

\`\`\`
dp[r][c] = dp[r-1][c] + dp[r][c-1]
\`\`\`

*Base cases:* The entire first row and first column are \`1\` — there is exactly one way to reach any cell in a straight line.

---

**Visualisation**
\`3 × 3\` grid filled cell by cell:

| | col 0 | col 1 | col 2 |
|---|---|---|---|
| **row 0** | 1 | 1 | 1 |
| **row 1** | 1 | 2 | 3 |
| **row 2** | 1 | 3 | **6** |

- \`dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2\`
- \`dp[2][2] = dp[1][2] + dp[2][1] = 3 + 3 = 6\`

---

**The Walk-through (Space-Optimised Bottom-Up)**
Each cell only reads the previous row (above) and the current row (left). We only need a single 1-D array of size \`n\`, updating it left-to-right for each row:

\`\`\`
row = [1, 1, 1]       ← row 0
row = [1, 2, 3]       ← row 1  (row[j] += row[j-1])
row = [1, 3, 6]       ← row 2
Answer: row[-1] = 6
\`\`\`

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 1, 1], "note": "Row 0: every cell in the top row is reachable only by moving right, so the whole row is 1s — the base case." },
    { "cells": [1, 2, 3], "highlight": [1, 2], "note": "Row 1: row[j] += row[j-1] for j=1,2. row[1] = 1+1 = 2 (down from row 0, plus left neighbour). row[2] = 1+2 = 3." },
    { "cells": [1, 3, 6], "highlight": [1, 2], "pointers": [{ "label": "answer", "index": 2 }], "note": "Row 2: row[1] = 1+2 = 3, row[2] = 3+3 = 6. row[-1] = 6 is the answer — 6 unique paths across a 3×3 grid." }
  ],
  "caption": "Unique Paths (3×3 grid) — the 2-D table collapses to one 1-D row, updated left to right for each grid row."
}
\`\`\`

---

**Code & Complexity**
\`\`\`python
def uniquePaths(m: int, n: int) -> int:
    row = [1] * n
    for i in range(1, m):
        for j in range(1, n):
            row[j] += row[j - 1]
    return row[-1]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| Brute-force recursion | O(2^(m+n)) | O(m+n) stack |
| Bottom-up 2D table | O(m·n) | O(m·n) |
| **Bottom-up 1D row** | **O(m·n)** | **O(n)** |

**Bonus — Closed Form:** A path is \`(m-1)\` downs and \`(n-1)\` rights in some order → \`C(m+n-2, m-1)\`. Works in O(min(m,n)) but breaks the moment the grid gains obstacles.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Unique Paths, what is the value of the cells in the top row and left column?",
          options: ["0", "1", "-1", "Depends on the input."],
          correct_index: 1,
          model_answer: "There is exactly 1 way to reach any cell in the top row (by moving strictly right) and the left column (by moving strictly down).",
          difficulty: "basic"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  2. LONGEST COMMON SUBSEQUENCE                                     */
    /* ------------------------------------------------------------------ */
    {
      slug: "longest-common-subsequence",
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-common-subsequence",
      summary:
        "The alignment square: match extends the diagonal, mismatch takes the better of two drops.",
      body: `**Problem Statement**
Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence (LCS). A subsequence preserves relative order but can skip characters.

*Example:*
\`\`\`
Input:  text1 = "abcde", text2 = "ace"
Output: 3          # LCS is "ace"
\`\`\`

---

**Building Intuition (Brute Force)**
Generate every subsequence of \`text1\` (there are \`2^m\` of them) and check each against \`text2\`. Time: \`O(2^m · n)\`. Far too slow, but it reveals the branching decision: at each character, we either include it or skip it.

---

**Finding the Pattern / Recurrence Relation**
Compare the *last* characters of each prefix.

\`\`\`
If text1[i] == text2[j]:
    dp[i][j] = 1 + dp[i-1][j-1]      ← match: extend the diagonal
Else:
    dp[i][j] = max(dp[i-1][j],        ← skip text1[i]
                   dp[i][j-1])         ← skip text2[j]
\`\`\`

*Base cases:* Row 0 and column 0 are all \`0\` — an empty string shares nothing.

---

**Visualisation**
\`text1 = "abcde"\`, \`text2 = "ace"\`:

|   | ∅ | a | c | e |
|---|---|---|---|---|
| **∅** | 0 | 0 | 0 | 0 |
| **a** | 0 | **1**↖ | 1 | 1 |
| **b** | 0 | 1 | 1 | 1 |
| **c** | 0 | 1 | **2**↖ | 2 |
| **d** | 0 | 1 | 2 | 2 |
| **e** | 0 | 1 | 2 | **3**↖ |

↖ = diagonal (character matched). Every other cell copies the max of its top or left neighbour.

---

**The Walk-through**
To **recover the actual subsequence**, trace backwards from the bottom-right:
1. \`(e, e)\` → match → emit 'e', go diagonal
2. \`(d, c)\` → no match → go up (larger neighbour)
3. \`(c, c)\` → match → emit 'c', go diagonal
4. \`(a, a)\` → match → emit 'a', go diagonal
Result: "ace" ✓

---

**Code & Complexity**
\`\`\`python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    prev = [0] * (n + 1)
    for i in range(1, m + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                curr[j] = 1 + prev[j-1]
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev = curr
    return prev[n]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| Brute-force | O(2^m · n) | O(m) |
| **Bottom-up rolling row** | **O(m·n)** | **O(min(m,n))** |`,
      questions: [
        {
          kind: "open",
          prompt: "If text1[i] !== text2[j], what is the recurrence relation for LCS?",
          model_answer: "dp[i][j] = Math.max(dp[i+1][j], dp[i][j+1]). If the characters do not match, we take the maximum LCS of ignoring either the current character of text1 or text2.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  3. BEST TIME TO BUY/SELL STOCK WITH COOLDOWN                      */
    /* ------------------------------------------------------------------ */
    {
      slug: "best-time-to-buy-and-sell-stock-with-cooldown",
      title: "Best Time to Buy and Sell Stock With Cooldown",
      difficulty: "Medium",
      neetcodeUrl:
        "https://neetcode.io/problems/buy-and-sell-crypto-with-cooldown",
      summary:
        "Model each day as a tiny automaton — holding, just-sold, free — and run one row of DP per state.",
      body: `**Problem Statement**
You may complete as many stock transactions as you like, but after selling you must wait one full day (cooldown) before buying again. Find the maximum profit.

*Example:*
\`\`\`
Input:  prices = [1, 2, 3, 0, 2]
Output: 3          # buy@1 sell@2, cool, buy@0 sell@2
\`\`\`

---

**Building Intuition**
Greedy "sell whenever price rises" fails: selling at 3 forces a cooldown on day 4, missing the buy-at-0 opportunity. We need to consider *all* possible hold/sell/wait decisions.

The key insight: your options on any day depend on **what state yesterday left you in**. There are exactly 3 states:
\`\`\`
  ┌─────────┐    sell     ┌─────────┐   wait    ┌─────────┐
  │ HOLDING │ ──────────→ │ COOLING │ ────────→ │  FREE   │
  └────┬────┘             └─────────┘           └────┬────┘
       │  hold                                       │  buy
       └──────────────────────────────────────────────┘
\`\`\`

---

**Finding the Pattern / Recurrence Relation**
Let \`hold[i]\`, \`cool[i]\`, \`free[i]\` = best cash in each state on day \`i\`.

\`\`\`
hold[i] = max(hold[i-1],              ← kept holding
              free[i-1] - price[i])    ← was free, bought today

cool[i] = hold[i-1] + price[i]        ← was holding, sold today

free[i] = max(free[i-1],              ← stayed free
              cool[i-1])              ← finished cooling
\`\`\`

*Base:* Day 0 → \`hold = -price[0]\`, \`cool = 0\`, \`free = 0\`.

---

**The Walk-through**
\`prices = [1, 2, 3, 0, 2]\`:

| Day | Price | hold | cool | free |
|-----|-------|------|------|------|
| 0   | 1     | -1   | 0    | 0    |
| 1   | 2     | -1   | 1    | 0    |
| 2   | 3     | -1   | 2    | 1    |
| 3   | 0     |  1   | -1   | 2    |
| 4   | 2     |  1   | **3**| 2    |

Answer: \`max(cool[4], free[4]) = max(3, 2) = 3\` ✓

\`\`\`viz:array
{
  "frames": [
    { "cells": [-1, 0, 0], "pointers": [{ "label": "hold", "index": 0 }, { "label": "cool", "index": 1 }, { "label": "free", "index": 2 }], "note": "Day 0 (price=1): hold = -price[0] = -1 (bought immediately). cool = free = 0 — base state." },
    { "cells": [-1, 1, 0], "highlight": [1], "note": "Day 1 (price=2): cool = hold(-1) + 2 = 1 — sell today's holding for a paper profit." },
    { "cells": [-1, 2, 1], "highlight": [1, 2], "note": "Day 2 (price=3): cool = hold(-1) + 3 = 2. free = max(free(0), cool(1)) = 1 — yesterday's cooldown finishes." },
    { "cells": [1, -1, 2], "highlight": [0, 2], "note": "Day 3 (price=0): hold = max(hold(-1), free(1) - 0) = 1 — rebuy on the dip. free = max(free(1), cool(2)) = 2." },
    { "cells": [1, 3, 2], "highlight": [1], "pointers": [{ "label": "answer", "index": 1 }], "note": "Day 4 (price=2): cool = hold(1) + 2 = 3 — sell the day-3 dip-buy. Answer = max(cool, free) = max(3, 2) = 3." }
  ],
  "caption": "Stock With Cooldown — three rolling states (hold / cool / free) replace the 2-D table; each day reads only yesterday's three values."
}
\`\`\`

---

**Code & Complexity**
\`\`\`python
def maxProfit(prices: list[int]) -> int:
    if not prices:
        return 0
    hold, cool, free = -prices[0], 0, 0
    for price in prices[1:]:
        new_hold = max(hold, free - price)
        new_cool = hold + price
        new_free = max(free, cool)
        hold, cool, free = new_hold, new_cool, new_free
    return max(cool, free)
\`\`\`

| Approach | Time | Space |
|---|---|---|
| **State-machine DP** | **O(n)** | **O(1)** |

The "2-D" table has 3 × n cells, but the second dimension is only 3 states wide — so it collapses to three rolling variables.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What are the three main states needed for the state machine approach?",
          options: ["Buy, Sell, Hold", "Held, Sold, Reset", "Min_Price, Max_Profit, Cooldown", "Day1, Day2, Day3"],
          correct_index: 1,
          model_answer: "We track the maximum profit we can have while currently holding a stock (Held), the profit right after selling (Sold), and the profit when resting/ready to buy (Reset).",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  4. COIN CHANGE II                                                 */
    /* ------------------------------------------------------------------ */
    {
      slug: "coin-change-ii",
      title: "Coin Change II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/coin-change-ii",
      summary:
        "Count combinations, not permutations: put the coin loop outside the amount loop.",
      body: `**Problem Statement**
Given coins of different denominations and a total amount, return the number of **combinations** that make up that amount. You have an infinite supply of each coin.

*Example:*
\`\`\`
Input:  amount = 5, coins = [1, 2, 5]
Output: 4          # {5}, {2+2+1}, {2+1+1+1}, {1+1+1+1+1}
\`\`\`

---

**Building Intuition (The Permutation Trap)**
A naive approach: for each amount \`a\`, try subtracting every coin \`c\` and sum up \`dp[a - c]\`. This *works*, but it counts **permutations** (ordered sequences), not combinations. \`{1,2,2}\` and \`{2,1,2}\` would be counted as different.

---

**Finding the Pattern / The Loop-Order Insight**
The fix is elegant: **put coins in the outer loop**.

\`\`\`
for coin in coins:          ← process each coin denomination fully
    for a in range(coin, amount+1):
        dp[a] += dp[a - coin]
\`\`\`

Why? Once we process coin \`1\`, all combinations using only 1s are set. Then coin \`2\` is added on top. A combination \`{1,1,2}\` is built in exactly *one* canonical order — all 1s first, then 2s — so it's counted once.

**Swap the loops** (amounts outer, coins inner) and you count *permutations* instead. Same code, opposite nesting, totally different answer. This is the sharpest two-line lesson in all of DP.

---

**Visualisation**
\`coins = [1, 2, 5]\`, \`amount = 5\`:

\`\`\`
                 amount:  0   1   2   3   4   5
 ─────────────────────────────────────────────────
 After coin 1:           1   1   1   1   1   1
 After coin 2:           1   1   2   2   3   3
 After coin 5:           1   1   2   2   3   4  ← answer
\`\`\`

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 0, 0, 0, 0, 0], "note": "Start: dp[0] = 1 (one way to make amount 0 — use no coins)." },
    { "cells": [1, 1, 1, 1, 1, 1], "highlight": [1, 2, 3, 4, 5], "note": "After coin 1: every amount 0-5 now has exactly one way (all 1s)." },
    { "cells": [1, 1, 2, 2, 3, 3], "highlight": [2, 3, 4, 5], "note": "After coin 2: dp[2]+=dp[0]→2, dp[3]+=dp[1]→2, dp[4]+=dp[2]→3, dp[5]+=dp[3]→3." },
    { "cells": [1, 1, 2, 2, 3, 4], "highlight": [5], "pointers": [{ "label": "answer", "index": 5 }], "note": "After coin 5: dp[5] += dp[0] = 3+1 = 4. Final answer: 4 combinations." }
  ],
  "caption": "Coin Change II — coins in the OUTER loop. Each denomination is fully processed before the next begins, so combinations (not permutations) are counted."
}
\`\`\`

---

**The Walk-through**
Start with \`dp = [1, 0, 0, 0, 0, 0]\` (one way to make amount 0: use nothing).

- **Coin 1:** Every amount gets exactly 1 way (all 1s). \`dp = [1,1,1,1,1,1]\`
- **Coin 2:** \`dp[2] += dp[0]=1 → 2\`, \`dp[3] += dp[1]=1 → 2\`, \`dp[4] += dp[2]=2 → 3\`, \`dp[5] += dp[3]=2 → 3\`
- **Coin 5:** \`dp[5] += dp[0]=1 → 4\`

---

**Code & Complexity**
\`\`\`python
def change(amount: int, coins: list[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    return dp[amount]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| **Outer-coin DP** | **O(coins × amount)** | **O(amount)** |`,
      questions: [
        {
          kind: "open",
          prompt: "Why must the outer loop iterate over coins rather than the amount?",
          model_answer: "Iterating over coins in the outer loop computes combinations (order does not matter). If the amount is in the outer loop, it computes permutations (different sequences of the same coins).",
          difficulty: "advanced"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  5. TARGET SUM                                                     */
    /* ------------------------------------------------------------------ */
    {
      slug: "target-sum",
      title: "Target Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/target-sum",
      summary:
        "Choosing + or − signs is choosing a subset. One line of algebra turns it into subset-sum counting.",
      body: `**Problem Statement**
Given an integer array \`nums\` and an integer \`target\`, assign \`+\` or \`-\` to each number so the expression equals \`target\`. Return the count of such assignments.

*Example:*
\`\`\`
Input:  nums = [1,1,1,1,1], target = 3
Output: 5
\`\`\`

---

**Building Intuition (Brute Force)**
Try every \`+/-\` combination: 2^n assignments. For 5 elements that's 32 — fine. For 20 elements that's a million. We need DP.

---

**Finding the Pattern / The Algebraic Reduction**
Split numbers into a positive set P and a negative set N:
\`\`\`
sum(P) - sum(N) = target
sum(P) + sum(N) = totalSum
────────────────────────────
2 · sum(P)      = target + totalSum
sum(P)          = (target + totalSum) / 2
\`\`\`

**Choosing signs = choosing the positive subset.** The problem reduces to: *"How many subsets of nums sum to exactly \`(target + totalSum) / 2\`?"* — a classic subset-sum count.

*Quick exits:* If \`(target + totalSum)\` is odd or \`|target| > totalSum\`, the answer is 0.

---

**Visualisation**
\`nums = [1,1,1,1,1]\`, \`target = 3\`:
\`subsetSum = (3 + 5) / 2 = 4\` → How many subsets of five 1s sum to 4? → C(5,4) = 5.

Subset-sum DP table (sweep high-to-low for each number):
\`\`\`
                sum:   0   1   2   3   4
 ──────────────────────────────────────────
 Start:                1   0   0   0   0
 After 1st '1':        1   1   0   0   0
 After 2nd '1':        1   2   1   0   0
 After 3rd '1':        1   3   3   1   0
 After 4th '1':        1   4   6   4   1
 After 5th '1':        1   5  10  10   5  ← dp[4] = 5 ✓
\`\`\`

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 0, 0, 0, 0], "note": "Start: dp[0] = 1 (one way to make sum 0 — pick nothing)." },
    { "cells": [1, 1, 0, 0, 0], "highlight": [1], "note": "After the 1st '1': sweeping HIGH to LOW (a=4 down to 1), dp[1] += dp[0] → 1." },
    { "cells": [1, 2, 1, 0, 0], "highlight": [1, 2], "note": "After the 2nd '1': dp[2] += dp[1]=1 → 1, dp[1] += dp[0]=1 → 2." },
    { "cells": [1, 3, 3, 1, 0], "highlight": [1, 2, 3], "note": "After the 3rd '1': dp[3] += dp[2]=1 → 1, dp[2] += dp[1]=2 → 3, dp[1] += dp[0]=1 → 3." },
    { "cells": [1, 4, 6, 4, 1], "highlight": [1, 2, 3, 4], "note": "After the 4th '1': dp[4] += dp[3]=1 → 1, dp[3] += dp[2]=3 → 4, dp[2] += dp[1]=3 → 6, dp[1] += dp[0]=1 → 4." },
    { "cells": [1, 5, 10, 10, 5], "highlight": [4], "pointers": [{ "label": "answer", "index": 4 }], "note": "After the 5th '1': dp[4] += dp[3]=4 → 5. dp[4] = 5 matches C(5,4) — the five ways to choose which single '1' is negative." }
  ],
  "caption": "Target Sum — subset-sum DP swept HIGH to LOW per number, the 0/1-knapsack discipline that keeps each number used at most once."
}
\`\`\`

---

**The Walk-through**
For each number \`x\`, sweep from \`subsetSum\` down to \`x\`:
\`dp[a] += dp[a - x]\`

Sweeping **high-to-low** ensures each number is used at most once (the 0/1 knapsack discipline).

---

**Code & Complexity**
\`\`\`python
def findTargetSumWays(nums: list[int], target: int) -> int:
    total = sum(nums)
    if (target + total) % 2 != 0 or abs(target) > total:
        return 0
    subset_sum = (target + total) // 2
    dp = [0] * (subset_sum + 1)
    dp[0] = 1
    for x in nums:
        for a in range(subset_sum, x - 1, -1):   # high-to-low
            dp[a] += dp[a - x]
    return dp[subset_sum]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| Brute force | O(2^n) | O(n) |
| **Subset-sum DP** | **O(n × sum)** | **O(sum)** |`,
      questions: [
        {
          kind: "mcq",
          prompt: "How can Target Sum be transformed into a subset sum problem?",
          options: ["By sorting the array.", "By finding a subset of numbers that sum to (total_sum + target) / 2.", "By taking the absolute value of all elements.", "It cannot be transformed."],
          correct_index: 1,
          model_answer: "If P is the sum of positive elements and N is the negative, P - N = target and P + N = sum. Adding gives 2P = target + sum, so we just need to find subsets that sum to (target + sum) / 2.",
          difficulty: "advanced"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  6. INTERLEAVING STRING                                            */
    /* ------------------------------------------------------------------ */
    {
      slug: "interleaving-string",
      title: "Interleaving String",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/interleaving-string",
      summary:
        "Can two strings braid into a third? dp[i][j] tracks whether prefixes i and j weave the first i+j characters.",
      body: `**Problem Statement**
Given strings \`s1\`, \`s2\`, and \`s3\`, determine if \`s3\` is formed by interleaving \`s1\` and \`s2\`. Both strings must be used completely, and the relative order of characters within each string must be preserved.

*Example:*
\`\`\`
Input:  s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
\`\`\`

---

**Building Intuition**
Walk through \`s3\` greedily, matching against whichever source fits. But what if *both* \`s1\` and \`s2\` have the same next character? We can't decide locally — the wrong choice now could strand characters later. This ambiguity screams DP.

---

**Finding the Pattern / Recurrence Relation**
\`dp[i][j] = true\` iff the first \`i\` chars of \`s1\` and first \`j\` chars of \`s2\` can interleave to form the first \`i+j\` chars of \`s3\`.

Key insight: the position in \`s3\` is always \`i + j\` — no third dimension needed!

\`\`\`
k = i + j - 1   (current position in s3)

dp[i][j] = (s1[i-1] == s3[k] AND dp[i-1][j])    ← last char came from s1
         OR
            (s2[j-1] == s3[k] AND dp[i][j-1])    ← last char came from s2
\`\`\`

*Base:* \`dp[0][0] = true\`. First row/col are chains of single-source matching.

---

**Visualisation**
\`s1 = "aab"\`, \`s2 = "axy"\`, \`s3 = "aaxaby"\`:

|     | ∅  | a  | x  | y  |
|-----|----|----|----|----|
| **∅**   | ✓  | ✓  | ✗  | ✗  |
| **a**   | ✓  | ✓  | ✓  | ✗  |
| **a**   | ✓  | ✗  | ✓  | ✗  |
| **b**   | ✗  | ✗  | ✓  | **✓** |

The path of ✓ cells from top-left to bottom-right traces a valid interleaving.

---

**Code & Complexity**
\`\`\`python
def isInterleave(s1: str, s2: str, s3: str) -> bool:
    m, n = len(s1), len(s2)
    if m + n != len(s3):
        return False
    dp = [False] * (n + 1)
    for i in range(m + 1):
        for j in range(n + 1):
            k = i + j - 1
            if i == 0 and j == 0:
                dp[j] = True
            elif i == 0:
                dp[j] = dp[j-1] and s2[j-1] == s3[k]
            elif j == 0:
                dp[j] = dp[j] and s1[i-1] == s3[k]
            else:
                dp[j] = (dp[j] and s1[i-1] == s3[k]) or \\
                         (dp[j-1] and s2[j-1] == s3[k])
    return dp[n]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| **Bottom-up rolling row** | **O(m·n)** | **O(n)** |`,
      questions: [
        {
          kind: "open",
          prompt: "What does dp[i][j] represent in Interleaving String?",
          model_answer: "dp[i][j] is true if the first i characters of s1 and the first j characters of s2 can interleave to form the first i+j characters of s3.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  7. LONGEST INCREASING PATH IN A MATRIX                            */
    /* ------------------------------------------------------------------ */
    {
      slug: "longest-increasing-path-in-a-matrix",
      title: "Longest Increasing Path in a Matrix",
      difficulty: "Hard",
      neetcodeUrl:
        "https://neetcode.io/problems/longest-increasing-path-in-matrix",
      summary:
        "Memoised DFS on the implicit DAG of increasing moves — strict increase means no cycles.",
      body: `**Problem Statement**
Given an \`m × n\` matrix of integers, find the length of the longest strictly increasing path. You can move in 4 directions: up, down, left, right.

*Example:*
\`\`\`
Input:  [[9, 9, 4],
         [6, 6, 8],
         [2, 1, 1]]
Output: 4          # path: 1 → 2 → 6 → 9
\`\`\`

---

**Building Intuition**
From every cell we can try moving to strictly larger neighbours. This creates a branching tree. But many cells are revisited from different starting points — classic overlapping subproblems. DFS with memoisation is the natural shape.

---

**Finding the Pattern / Why No Visited Set**
Draw an edge from each cell to each strictly larger orthogonal neighbour. **Strict increase means no cycle can exist** — you can never return to a value you've already visited. The grid's moves form a **Directed Acyclic Graph (DAG)**.

\`\`\`
longest(cell) = 1 + max(longest(neighbour) for each LARGER neighbour)
\`\`\`

Two things that are normally mandatory in graph traversal are **not needed** here:
1. **No visited set** — the structure prevents revisiting (values only increase).
2. **No explicit topological sort** — memoised DFS discovers the order implicitly.

This is the cleanest demonstration that **DP = DAG traversal with remembered results**.

---

**Visualisation**
\`\`\`
Matrix:          DAG of increasing edges:
 9  9  4         1 → 2 → 6 → 9
 6  6  8              ↗       ↑
 2  1  1         1 → 6    4 → 8

Longest path: 1 → 2 → 6 → 9 (length 4)
\`\`\`

---

**The Walk-through**
Start DFS at cell \`(2,1)\` value 1:
- Neighbours: \`(2,0)=2\` is larger → recurse
  - \`(2,0)=2\`: neighbour \`(1,0)=6\` is larger → recurse
    - \`(1,0)=6\`: neighbour \`(0,0)=9\` is larger → recurse
      - \`(0,0)=9\`: no larger neighbour → return 1
    - return 1 + 1 = 2
  - return 1 + 2 = 3
- return 1 + 3 = **4**

Every cell computed once, then served from cache.

---

**Code & Complexity**
\`\`\`python
def longestIncreasingPath(matrix: list[list[int]]) -> int:
    m, n = len(matrix), len(matrix[0])
    memo = {}
    
    def dfs(r, c):
        if (r, c) in memo:
            return memo[(r, c)]
        best = 1
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        memo[(r, c)] = best
        return best
    
    return max(dfs(r, c) for r in range(m) for c in range(n))
\`\`\`

| Approach | Time | Space |
|---|---|---|
| **Memoised DFS** | **O(m·n)** | **O(m·n)** |

Each cell is computed exactly once (4 edges checked each). Stack depth is bounded by the longest path.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is a visited set not strictly necessary for the DFS in this problem?",
          options: ["Because it's a DAG (Directed Acyclic Graph).", "Because the matrix is small.", "Because the path must strictly increase, preventing cycles.", "Because we can backtrack."],
          correct_index: 2,
          model_answer: "Since we only move to strictly greater neighbors, it is mathematically impossible to loop back to a cell we've already visited.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  8. DISTINCT SUBSEQUENCES                                          */
    /* ------------------------------------------------------------------ */
    {
      slug: "distinct-subsequences",
      title: "Distinct Subsequences",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/count-subsequences",
      summary:
        "Count the ways t appears in s as a subsequence: on a match, use the character AND also skip it.",
      body: `**Problem Statement**
Given two strings \`s\` and \`t\`, return the number of distinct subsequences of \`s\` which equal \`t\`.

*Example:*
\`\`\`
Input:  s = "rabbbit", t = "rabbit"
Output: 3
\`\`\`
The three b's in "rab**bbb**it" can fill t's two b-slots in C(3,2) = 3 ways.

---

**Building Intuition**
This is the LCS alignment square, but instead of finding the *longest* match, we *count* how many ways to embed \`t\` entirely within \`s\`.

---

**Finding the Pattern / Recurrence Relation**
\`dp[i][j]\` = number of ways to match \`t[0..j-1]\` within \`s[0..i-1]\`.

\`\`\`
If s[i-1] != t[j-1]:
    dp[i][j] = dp[i-1][j]             ← skip s[i-1], it can't help

If s[i-1] == t[j-1]:
    dp[i][j] = dp[i-1][j-1]           ← USE s[i-1] for t[j-1]
             + dp[i-1][j]             ← SKIP s[i-1] anyway
\`\`\`

The critical insight: **even on a match, we add the skip case**. Different source characters used for the same target position create distinct embeddings.

*Bases:* \`dp[i][0] = 1\` (empty target matches one way), \`dp[0][j>0] = 0\`.

---

**Visualisation**
\`s = "babgbag"\`, \`t = "bag"\`:

|     | ∅ | b | a | g |
|-----|---|---|---|---|
| **∅**   | 1 | 0 | 0 | 0 |
| **b**   | 1 | 1 | 0 | 0 |
| **a**   | 1 | 1 | 1 | 0 |
| **b**   | 1 | 2 | 1 | 0 |
| **g**   | 1 | 2 | 1 | 1 |
| **b**   | 1 | 3 | 1 | 1 |
| **a**   | 1 | 3 | 4 | 1 |
| **g**   | 1 | 3 | 4 | **5** |

---

**Code & Complexity**
\`\`\`python
def numDistinct(s: str, t: str) -> int:
    m, n = len(s), len(t)
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, m + 1):
        for j in range(n, 0, -1):   # sweep RIGHT to LEFT (0/1 knapsack)
            if s[i-1] == t[j-1]:
                dp[j] += dp[j-1]
            # else: dp[j] stays the same (skip)
    return dp[n]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| **Rolling-row DP** | **O(m·n)** | **O(n)** |

The right-to-left sweep prevents clobbering — the same discipline as the subset-sum high-to-low sweep.`,
      questions: [
        {
          kind: "open",
          prompt: "What is the recurrence relation when s[i] matches t[j]?",
          model_answer: "dp[i][j] = dp[i+1][j+1] + dp[i+1][j]. We can either use the matching character (dp[i+1][j+1]) OR choose not to use it and look for another match later in s (dp[i+1][j]).",
          difficulty: "advanced"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  9. EDIT DISTANCE                                                  */
    /* ------------------------------------------------------------------ */
    {
      slug: "edit-distance",
      title: "Edit Distance",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/edit-distance",
      summary:
        "Insert, delete, replace: each maps to a neighbour cell to compute the cheapest string transformation.",
      body: `**Problem Statement**
Given two strings \`word1\` and \`word2\`, return the minimum number of operations (insert, delete, or replace a character) to convert \`word1\` into \`word2\`.

*Example:*
\`\`\`
Input:  word1 = "horse", word2 = "ros"
Output: 3          # horse → rorse → rose → ros
\`\`\`

---

**Building Intuition**
Compare the last characters of the current prefixes. If they match, no operation is needed. If they don't, we have 3 options — each costs 1 operation and leaves a smaller subproblem.

---

**Finding the Pattern / Recurrence Relation**
\`dp[i][j]\` = min operations to convert \`word1[0..i-1]\` to \`word2[0..j-1]\`.

\`\`\`
If word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]                    ← match, no cost

Else:
    dp[i][j] = 1 + min(
        dp[i-1][j-1],   ← Replace word1[i-1] with word2[j-1]
        dp[i-1][j],     ← Delete  word1[i-1]
        dp[i][j-1]      ← Insert  word2[j-1] into word1
    )
\`\`\`

Geometric mnemonic: **Replace = diagonal ↖, Delete = up ↑, Insert = left ←**.

*Bases:* \`dp[i][0] = i\` (delete all), \`dp[0][j] = j\` (insert all).

---

**Visualisation**
\`word1 = "horse"\`, \`word2 = "ros"\`:

|     | ∅ | r | o | s |
|-----|---|---|---|---|
| **∅**   | 0 | 1 | 2 | 3 |
| **h**   | 1 | 1 | 2 | 3 |
| **o**   | 2 | 2 | 1 | 2 |
| **r**   | 3 | 2 | 2 | 2 |
| **s**   | 4 | 3 | 3 | 2 |
| **e**   | 5 | 4 | 4 | **3** |

Trace back from \`dp[5][3] = 3\`:
- \`(e,s)\`: mismatch — the cheapest predecessor is **delete** (up), not replace: \`1 + dp[4][3] = 1 + 2 = 3\`
- \`(s,s)\`: match → diagonal, free
- \`(r,o)\`: mismatch → delete (up) → cost 1
- \`(o,o)\`: match → diagonal, free
- \`(h,r)\`: mismatch → replace (diag) → cost 1
Total: 3 operations ✓ — delete 'e', delete 'r', replace 'h'→'r': \`horse → hors → hos → ros\`

---

**Code & Complexity**
\`\`\`python
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])
    return dp[m][n]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| **Bottom-up DP** | **O(m·n)** | **O(m·n)** |

Can be optimised to O(min(m,n)) with two rows, but full table is needed to recover the actual edit script.

**Kinship:** With only insert/delete (no replace), edit distance = \`m + n - 2·LCS\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Edit Distance, what does dp[i+1][j] represent relative to dp[i][j]?",
          options: ["Inserting a character.", "Deleting a character from word1.", "Replacing a character.", "A match."],
          correct_index: 1,
          model_answer: "Moving horizontally/vertically in the DP table represents insertions and deletions. Skipping a character in word1 corresponds to a deletion.",
          difficulty: "intermediate"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  10. BURST BALLOONS                                                */
    /* ------------------------------------------------------------------ */
    {
      slug: "burst-balloons",
      title: "Burst Balloons",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/burst-balloons",
      summary:
        "Think about the LAST balloon in each range — interval DP over spans, with padded 1s at the borders.",
      body: `**Problem Statement**
You have \`n\` balloons, each with a number. Bursting balloon \`i\` earns \`nums[left] × nums[i] × nums[right]\` coins (using its *current* neighbours). After bursting, left and right become adjacent. Burst all balloons to maximise total coins.

*Example:*
\`\`\`
Input:  nums = [3, 1, 5, 8]
Output: 167
\`\`\`

---

**Building Intuition (Why "First" Fails)**
If we pick balloon \`i\` to burst *first*, the remaining array "heals" — its neighbours merge. The subproblems become interdependent because the boundaries shift. This is the signature that we should think about the *last* element, not the first.

---

**Finding the Pattern / The "Last Balloon" Inversion**
Pad the array with virtual \`1\`s: \`[1, 3, 1, 5, 8, 1]\`. Define \`dp[l][r]\` = max coins from bursting all balloons **strictly between** walls \`l\` and \`r\`.

If balloon \`k\` is the **last** to burst in the range \`(l, r)\`:
- Everything else between \`l\` and \`k\` is already gone → contributed \`dp[l][k]\`
- Everything between \`k\` and \`r\` is already gone → contributed \`dp[k][r]\`
- Balloon \`k\` pops last, so its neighbours are the walls: \`nums[l] × nums[k] × nums[r]\`

\`\`\`
dp[l][r] = max over all k in (l, r) of:
           dp[l][k] + nums[l] * nums[k] * nums[r] + dp[k][r]
\`\`\`

*Base:* Adjacent walls enclose nothing → \`dp[l][l+1] = 0\`.

---

**Visualisation**
\`nums = [1, 3, 1, 5, 8, 1]\` (padded):

Fill by increasing **span length**:
\`\`\`
Span 2 (1 balloon between walls):
  dp[0][2] = 1×3×1 = 3
  dp[1][3] = 3×1×5 = 15
  dp[2][4] = 1×5×8 = 40
  dp[3][5] = 5×8×1 = 40

Span 3 (2 balloons):
  dp[0][3]: try k=1 → 0 + 1×3×5 + 15 = 30
            try k=2 → 3 + 1×1×5 + 0  = 8    → 30
  dp[1][4]: try k=2 → 0 + 3×1×8 + 40 = 64
            try k=3 → 15 + 3×5×8 + 0 = 135  → 135
  ...

Full span dp[0][5] = 167
\`\`\`

---

**The Walk-through (Fill Order)**
Unlike grid DP, we don't fill row-by-row. We fill by **span length** — small intervals before large ones, because large intervals depend on smaller sub-intervals. The fill order is the third dimension of thought even though the table is 2-D.

---

**Code & Complexity**
\`\`\`python
def maxCoins(nums: list[int]) -> int:
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    
    for span in range(2, n):           # span = distance between walls
        for l in range(0, n - span):
            r = l + span
            for k in range(l + 1, r):  # try each balloon as last
                dp[l][r] = max(
                    dp[l][r],
                    dp[l][k] + nums[l] * nums[k] * nums[r] + dp[k][r]
                )
    return dp[0][n - 1]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| **Interval DP** | **O(n³)** | **O(n²)** |

Cubic because: O(n²) intervals × O(n) split points. This is the honest cost of interval DP — and it's optimal for this problem family (matrix-chain multiplication, polygon triangulation use the same shape).`,
      questions: [
        {
          kind: "open",
          prompt: "Why is it crucial to think about which balloon is burst LAST rather than FIRST in a given interval?",
          model_answer: "If we pick the first balloon to burst, it changes the adjacent balloons for future choices, breaking independent subproblems. If we pick the LAST balloon to burst, its neighbors are firmly fixed (the boundaries of the interval), allowing us to cleanly split the interval into two independent subproblems.",
          difficulty: "advanced"
        }
      ]
    },
    /* ------------------------------------------------------------------ */
    /*  11. REGULAR EXPRESSION MATCHING                                   */
    /* ------------------------------------------------------------------ */
    {
      slug: "regular-expression-matching",
      title: "Regular Expression Matching",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/regular-expression-matching",
      summary:
        "Dot matches any single char; star means zero-or-more of the preceding element — two arms per cell.",
      body: `**Problem Statement**
Implement regex matching with \`.\` (matches any single character) and \`*\` (matches zero or more of the *preceding* element). The match must cover the **entire** string.

*Example:*
\`\`\`
Input:  s = "aab", p = "c*a*b"
Output: true       # zero c's, two a's, one b
\`\`\`

---

**Building Intuition**
Without \`*\`, matching is a linear scan. The \`*\` operator creates branching: should \`a*\` match zero, one, or more a's? We can't decide greedily because a wrong choice now could fail later. This is the alignment square one final time.

---

**Finding the Pattern / Recurrence Relation**
\`dp[i][j] = true\` iff \`s[0..i-1]\` matches \`p[0..j-1]\`.

**Case 1 — Normal char or \`.\`:**
\`\`\`
dp[i][j] = dp[i-1][j-1] AND (s[i-1] == p[j-1] OR p[j-1] == '.')
\`\`\`

**Case 2 — \`p[j-1]\` is \`*\`:**
The \`*\` and \`p[j-2]\` form a unit. Two arms:

\`\`\`
Zero copies:  dp[i][j-2]
              The x* unit vanishes entirely.

One+ copies:  dp[i-1][j] AND (s[i-1] matches p[j-2])
              We consume one char from s, but the x* unit stays
              (pattern index j stays put — this is how "more" loops).
\`\`\`

\`dp[i][j] = zero_arm OR one_plus_arm\`

---

**Visualisation**
\`s = "aab"\`, \`p = "c*a*b"\`:

|     | ∅ | c | * | a | * | b |
|-----|---|---|---|---|---|---|
| **∅**   | ✓ | ✗ | ✓ | ✗ | ✓ | ✗ |
| **a**   | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| **a**   | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| **b**   | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** |

Row 0 (\`∅\` vs pattern): \`c*\` can vanish → ✓ at col 2; \`a*\` can vanish → ✓ at col 4.
\`(a, a*)\`: \`a*\` matches one 'a' → \`dp[0][4] = ✓\` propagates down.

---

**The Walk-through**
- \`(b, b)\`: \`b == b\` and \`dp[2][4] = ✓\` → ✓ at the corner.
- Each decision was exactly one of the two arms (zero or one-more). No third case ever fires.

---

**Code & Complexity**
\`\`\`python
def isMatch(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # Base: empty string vs pattern with possible x* evaporations
    for j in range(2, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-2]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                # Zero copies of p[j-2]
                dp[i][j] = dp[i][j-2]
                # One or more copies
                if s[i-1] == p[j-2] or p[j-2] == '.':
                    dp[i][j] = dp[i][j] or dp[i-1][j]
            else:
                # Normal char or '.'
                if s[i-1] == p[j-1] or p[j-1] == '.':
                    dp[i][j] = dp[i-1][j-1]
    return dp[m][n]
\`\`\`

| Approach | Time | Space |
|---|---|---|
| **Bottom-up DP** | **O(m·n)** | **O(m·n)** |

Real regex engines compile to Thompson NFAs — but the NFA's state graph *is* this table with the string axis streamed. You have effectively derived the engine.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does the DP table handle the '*' character?",
          options: ["By ignoring the previous character.", "By checking if the character matches, and if so, branching into 0 uses or 1+ uses.", "By automatically matching any character.", "By skipping 2 indices backward in the pattern string."],
          correct_index: 1,
          model_answer: "When checking an asterisk, we look at the character before it. If it doesn't match, we treat it as 0 uses (dp[i][j+2]). If it does match, we can either use it (dp[i+1][j]) or skip it (0 uses).",
          difficulty: "advanced"
        }
      ]
    },
  ],
};
