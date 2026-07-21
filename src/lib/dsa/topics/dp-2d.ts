import type { DsaTopic } from "../types";

/** Chapter 14 — 2-D Dynamic Programming: states with two coordinates. */
export const dp2d: DsaTopic = {
  slug: "dp-2d",
  title: "2-D Dynamic Programming",
  chapter: 14,
  tagline: "Two strings, two choices, or a grid — when one index cannot describe where you stand.",
  color: "#6fdfa8",
  prereqs: ["graphs", "dp-1d"],
  unlocks: [],
  intro: `The last chapter's states fit in one number: a position, an amount. This chapter is what happens when *where you stand* takes two numbers to say. Sometimes literally — a robot at row i, column j of a grid. More often structurally: comparing two strings means a position in *each* (the great alignment family — Longest Common Subsequence, Edit Distance, Distinct Subsequences, Regular Expression Matching).

The five-finger checklist survives untouched: state sentence, recurrence from the last decision, bases, fill order, answer cell.`,
  problems: [
    {
      slug: "unique-paths",
      title: "Unique Paths",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-paths",
      summary: "Count paths in a grid where every cell is reachable from above or the left.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try naive recursive grid walking without memoization.
*Why this shatters*: Naive recursion branches $2^{M+N}$ times because different paths arrive at the same grid cell $(r, c)$ repeatedly!

**The Structural Invariant: Grid Path Sum Recurrence.**
A robot moving ONLY **Right** or **Down** can reach cell $(r, c)$ ONLY from:
1. Cell directly above: $(r - 1, c)$
2. Cell directly left: $(r, c - 1)$
- **Recurrence**:
  $$\\text{dp}[r][c] = \\text{dp}[r-1][c] + \\text{dp}[r][c-1]$$
- **Base Cases**: Top row \`dp[0][c] = 1\` and left column \`dp[r][0] = 1\` (strictly 1 way to travel in a straight line).
- **$O(N)$ Space Optimization**: Collapse 2D matrix into a 1D row array: \`row[c] += row[c-1]\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 1, 1], "note": "Row 0 (Top border): [1, 1, 1] — Only 1 way to move right." },
    { "cells": [1, 2, 3], "highlight": [1, 2], "note": "Row 1: row[1]=1+1=2, row[2]=1+2=3." },
    { "cells": [1, 3, 6], "highlight": [1, 2], "pointers": [{ "label": "answer", "index": 2 }], "note": "Row 2: row[1]=1+2=3, row[2]=3+3=6. 6 unique paths for 3x3 grid!" }
  ],
  "caption": "Unique Paths — 2D Grid DP collapsed into 1D row rolling array."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Combinatorial Math Alternative*: $\\text{Paths} = \\binom{(M-1) + (N-1)}{M-1} = \\frac{(M+N-2)!}{(M-1)! (N-1)!}$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the recurrence relation for Unique Paths at cell (r, c)?",
          options: [
            "dp[r][c] = dp[r-1][c-1] + 1",
            "dp[r][c] = dp[r-1][c] + dp[r][c-1]",
            "dp[r][c] = min(dp[r-1][c], dp[r][c-1])",
            "dp[r][c] = dp[r-1][c] * dp[r][c-1]"
          ],
          correct_index: 1,
          model_answer: "Since movement is limited to Right and Down, the total unique paths to (r, c) equals the sum of paths from the top neighbor (r-1, c) and left neighbor (r, c-1).",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the space complexity of Unique Paths when optimized using a 1D rolling array?",
          model_answer: "O(N) space complexity, where N is the number of columns in the grid.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "longest-common-subsequence",
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-common-subsequence",
      summary: "The alignment square: match extends the diagonal, mismatch takes the better of two drops.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners compare characters sequentially using two pointers without branching.
*Why this shatters*: Two pointers fail when deciding whether to skip a character in string 1 vs string 2 (e.g. \`text1 = "abcde"\`, \`text2 = "ace"\`).

**The Structural Invariant: 2D Alignment Matrix.**
Let \`dp[i][j]\` be the LCS length for \`text1[0...i-1]\` and \`text2[0...j-1]\`:
- **Match Case** (\`text1[i-1] == text2[j-1]\`):
  Extends diagonal:
  $$\\text{dp}[i][j] = 1 + \\text{dp}[i-1][j-1]$$
- **Mismatch Case** (\`text1[i-1] != text2[j-1]\`):
  Take max of skipping character from text1 OR text2:
  $$\\text{dp}[i][j] = \\max(\\text{dp}[i-1][j], \\text{dp}[i][j-1])$$

\`\`\`viz:table-diff
{
  "columns": ["text1 \\\\ text2", "∅", "a", "c", "e"],
  "before": [["∅", 0, 0, 0, 0], ["a", 0, 1, 1, 1]],
  "after": [["c", 0, 1, 2, 2], ["e", 0, 1, 2, 3]],
  "caption": "Longest Common Subsequence — Match extends diagonal (+1), mismatch takes max(Up, Left)."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Table Sizing*: Size DP table \`(M+1) x (N+1)\` to hold 0-index empty string base cases.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Longest Common Subsequence, what transition occurs when text1[i-1] == text2[j-1]?",
          options: [
            "dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
            "dp[i][j] = 1 + dp[i-1][j-1]",
            "dp[i][j] = dp[i-1][j-1]",
            "dp[i][j] = 0"
          ],
          correct_index: 1,
          model_answer: "When characters match, they extend the longest common subsequence by 1, building on the diagonal predecessor dp[i-1][j-1].",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of LCS for strings of length M and N?",
          model_answer: "O(M * N) time complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "best-time-to-buy-and-sell-stock-with-cooldown",
      title: "Best Time to Buy and Sell Stock With Cooldown",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/buy-and-sell-crypto-with-cooldown",
      summary: "Model each day as a tiny automaton — holding, just-sold, free — and run one row of DP per state.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use greedy buy/sell logic on price dips.
*Why this shatters*: Greedy fails because selling today forces a mandatory **1-day Cooldown** tomorrow, which might prevent buying at an even larger dip!

**The Structural Invariant: State Machine Automaton DP.**
Maintain 3 states for each day $i$:
1. **\`held\`** (Own stock): \`max(prev_held, prev_reset - price)\`
2. **\`sold\`** (Just sold stock today $\\rightarrow$ Forces cooldown tomorrow!): \`prev_held + price\`
3. **\`reset\`** (No stock, ready to buy): \`max(prev_reset, prev_sold)\`

\`\`\`viz:array
{
  "frames": [
    { "cells": [-1, 0, 0], "pointers": [{ "label": "held", "index": 0 }, { "label": "sold", "index": 1 }, { "label": "reset", "index": 2 }], "note": "Day 0 (price=1): held=-1, sold=0, reset=0." },
    { "cells": [-1, 1, 0], "highlight": [1], "note": "Day 1 (price=2): sold=held+2=1." },
    { "cells": [1, -1, 2], "highlight": [0, 2], "note": "Day 3 (price=0): rebuy held=reset-0=1, reset=max(0, sold)=2." },
    { "cells": [1, 3, 2], "pointers": [{ "label": "max profit", "index": 1 }], "highlight": [1], "note": "Day 4 (price=2): sold=held+2=3. Max profit = 3!" }
  ],
  "caption": "Stock with Cooldown — 3-State Automaton DP in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *State Order*: Update states using previous day's variables (\`prev_held\`, \`prev_sold\`, \`prev_reset\`) to avoid intra-day state corruption.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Stock with Cooldown, why does the 'held' state transition from 'prev_reset - price' instead of 'prev_sold - price'?",
          options: [
            "Because stock prices are non-negative.",
            "Because selling stock forces a 1-day cooldown, meaning you can only buy stock from the 'reset' state (after cooling down).",
            "Because held state uses less memory.",
            "Because reset state is always 0."
          ],
          correct_index: 1,
          model_answer: "The mandatory cooldown rule prevents buying stock immediately after selling (sold state). You must transition through reset state before buying.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the overall max profit returned at the end of the stock array?",
          model_answer: "max(sold, reset), since ending while holding a stock provides no extra profit.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "coin-change-ii",
      title: "Coin Change II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/coin-change-ii",
      summary: "Count combinations, not permutations: put the coin loop outside the amount loop.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners place the Amount loop on the outside and the Coin loop on the inside.
*Why this shatters*: Putting Amount on the outside counts **PERMUTATIONS** (e.g. \`[1, 2]\` and \`[2, 1]\` count as 2 distinct ways). The problem asks for **COMBINATIONS** (order does not matter!).

**The Structural Invariant: Coins Outer Loop for Combination Counting.**
To count combinations (where \`[1, 2]\` is identical to \`[2, 1]\`):
- **Place Coins in the OUTER loop**:
  - For each coin $c \\in \\text{coins}$:
    - For amount $a = c \\dots \\text{amount}$:
      $$\\text{dp}[a] += \\text{dp}[a - c]$$
- **Why this works**: Processing each coin denomination fully before moving to the next coin ensures combinations are constructed in strict non-decreasing coin order!

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 0, 0, 0, 0, 0], "note": "amount=5, coins=[1,2,5]. Base: dp[0]=1." },
    { "cells": [1, 1, 1, 1, 1, 1], "note": "After Coin 1: All amounts 0..5 have 1 way (all 1s)." },
    { "cells": [1, 1, 2, 2, 3, 3], "note": "After Coin 2: dp[2]+=dp[0], dp[3]+=dp[1], dp[4]+=dp[2], dp[5]+=dp[3]=3." },
    { "cells": [1, 1, 2, 2, 3, 4], "pointers": [{ "label": "answer", "index": 5 }], "highlight": [5], "note": "After Coin 5: dp[5]+=dp[0]=3+1=4. Total combinations = 4!" }
  ],
  "caption": "Coin Change II — Coins outer loop enforcing combination order."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Loop Order Trap*: Outer = Coins, Inner = Amount $\\rightarrow$ Combinations. Outer = Amount, Inner = Coins $\\rightarrow$ Permutations.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the fundamental difference between Coin Change II (combinations) and Combination Sum IV (permutations)?",
          options: [
            "Coin Change II uses float values.",
            "Coin Change II iterates Coins in the OUTER loop, while Combination Sum IV iterates Amount in the OUTER loop.",
            "Coin Change II sorts the array.",
            "There is no difference."
          ],
          correct_index: 1,
          model_answer: "Iterating coins in the outer loop forces processing each denomination once across all amounts, eliminating duplicate ordered permutations.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Coin Change II for N coin types and target amount A?",
          model_answer: "O(N * A) time complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "target-sum",
      title: "Target Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/target-sum",
      summary: "Choosing + or − signs is choosing a subset. One line of algebra turns it into subset-sum counting.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use brute-force backtracking trying $+/-$ for every number ($O(2^N)$ time).
*Why this shatters*: $2^N$ for $N=20$ executes over 1 million operations. We can transform sign assignment into **Subset Sum DP**!

**The Structural Invariant: Algebraic Reduction to Subset Sum.**
Let $P$ be the subset of numbers with $+$ sign, and $N$ be numbers with $-$ sign:
1. $P - N = \\text{target}$
2. $P + N = \\text{total\\_sum}$
- Adding equations: $2P = \\text{target} + \\text{total\\_sum}$
  $$P = \\frac{\\text{target} + \\text{total\\_sum}}{2}$$
- **Reduction**: Count subsets that sum to **\`P\`** using **0/1 Knapsack High-to-Low DP**!

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 0, 0, 0, 0], "note": "nums=[1,1,1,1,1], target=3. P = (3+5)/2 = 4. Target P=4." },
    { "cells": [1, 5, 10, 10, 5], "pointers": [{ "label": "dp[4]", "index": 4 }], "highlight": [4], "note": "After 0/1 Knapsack sweep: dp[4] = 5. Exactly 5 valid sign assignments!" }
  ],
  "caption": "Target Sum — Algebraic reduction to 0/1 Knapsack subset sum counting."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Invalid Checks*: If \`target + total_sum\` is ODD or \`Math.abs(target) > total_sum\`, return \`0\` immediately!`,
      questions: [
        {
          kind: "mcq",
          prompt: "How is the target subset sum P calculated from input array total_sum and target?",
          options: [
            "P = target - total_sum",
            "P = (target + total_sum) / 2",
            "P = target / 2",
            "P = total_sum / target"
          ],
          correct_index: 1,
          model_answer: "Adding P - N = target and P + N = sum yields 2P = target + sum, so P = (target + sum) / 2.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why does Target Sum use a High-to-Low sweep for updating its DP array?",
          model_answer: "Because each number in nums can be used at most ONCE (0/1 Knapsack rule). High-to-low prevents reusing the same number in the same iteration.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "interleaving-string",
      title: "Interleaving String",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/interleaving-string",
      summary: "Can two strings braid into a third? dp[i][j] tracks whether prefixes i and j weave the first i+j characters.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use 2 pointers greedily comparing \`s1\` and \`s2\` against \`s3\`.
*Why this shatters*: When \`s1[i] == s3[k]\` AND \`s2[j] == s3[k]\` simultaneously, a greedy choice can pick the wrong string and get stuck later!

**The Structural Invariant: 2D Braid Verification Matrix.**
Let \`dp[i][j]\` be \`true\` iff \`s1[0...i-1]\` and \`s2[0...j-1]\` can interleave to form \`s3[0...i+j-1]\`:
- Transition for \`k = i + j - 1\`:
  $$\\text{dp}[i][j] = (s1[i-1] == s3[k] \\;\\&\\; \\text{dp}[i-1][j]) \\;||\\; (s2[j-1] == s3[k] \\;\\&\\; \\text{dp}[i][j-1])$$
- Base: \`dp[0][0] = true\`. First row depends only on \`s2\`; first column depends only on \`s1\`.

\`\`\`viz:table-diff
{
  "columns": ["s1 \\\\ s2", "∅", "a", "x", "y"],
  "before": [["∅", "T", "T", "F", "F"], ["a", "T", "T", "T", "F"]],
  "after": [["b", "F", "F", "T", "T"]],
  "caption": "Interleaving String — dp[i][j] boolean grid verifying combined prefix braid."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Length Check*: If \`s1.length + s2.length != s3.length\`, return \`false\` in $O(1)$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Interleaving String, what index in s3 corresponds to state dp[i][j]?",
          options: [
            "i * j",
            "i + j - 1",
            "i - j",
            "Math.max(i, j)"
          ],
          correct_index: 1,
          model_answer: "Consuming i characters from s1 and j characters from s2 means we have matched exactly i + j characters in s3, reaching 0-based index i + j - 1.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Interleaving String for s1 of length M and s2 of length N?",
          model_answer: "O(M * N) time complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "longest-increasing-path-in-a-matrix",
      title: "Longest Increasing Path in a Matrix",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/longest-increasing-path-in-matrix",
      summary: "Memoised DFS on the implicit DAG of increasing moves — strict increase means no cycles.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners run unmemoized DFS from every cell.
*Why this shatters*: Unmemoized grid exploration takes exponential $O(4^{M \\cdot N})$ time.

**The Structural Invariant: Memoized DFS on Implicit Grid DAG.**
Because paths must be **STRICTLY INCREASING** ($matrix[nr][nc] > matrix[r][c]$), cycles are **mathematically impossible**! The grid is implicitly a Directed Acyclic Graph (DAG).
- \`dfs(r, c)\`:
  - If \`memo[r][c]\` is already computed, **RETURN IT** ($O(1)$!).
  - Set \`maxLen = 1\`.
  - For each cardinal neighbor \`(nr, nc)\`:
    - If \`matrix[nr][nc] > matrix[r][c]\`:
      - \`maxLen = max(maxLen, 1 + dfs(nr, nc))\`.
  - Save \`memo[r][c] = maxLen\`.
  - Return \`maxLen\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "1", "label": "Cell 1 at (2,1) -> len=4", "children": ["2"], "highlight": true },
    { "id": "2", "label": "Cell 2 at (2,0) -> len=3", "children": ["6"], "highlight": true },
    { "id": "6", "label": "Cell 6 at (1,0) -> len=2", "children": ["9"], "highlight": true },
    { "id": "9", "label": "Cell 9 at (0,0) -> len=1 (peak)", "highlight": true }
  ],
  "rootId": "1",
  "caption": "Longest Increasing Path — Memoized DFS on implicit DAG (path: 1 -> 2 -> 6 -> 9)."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *No Visited Set Needed*: Strict inequality ($>$) prevents stepping backward, rendering visited sets unnecessary.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is a boolean visited[][] matrix NOT required for Longest Increasing Path in a Matrix?",
          options: [
            "Because grid sizes are fixed.",
            "Because paths require strict increasing values, making it impossible to step back into a smaller or equal ancestor cell.",
            "Because DFS uses a Queue.",
            "Because memoized values are binary."
          ],
          correct_index: 1,
          model_answer: "Strict increasing movement guarantees acyclicity. You can never return to a previously visited lower value cell.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Longest Increasing Path in a Matrix with M x N memoization?",
          model_answer: "O(M * N) time complexity, since each cell's longest path is computed exactly once.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "distinct-subsequences",
      title: "Distinct Subsequences",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/count-subsequences",
      summary: "Count the ways t appears in s as a subsequence: on a match, use the character AND also skip it.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use LCS logic, taking \`max()\`.
*Why this shatters*: We are NOT finding maximum length! We are **COUNTING DISTINCT OCCURRENCES** of string \`t\` inside string \`s\`.

**The Structural Invariant: Additive Match/Skip Subsequence Counting.**
Let \`dp[i][j]\` be the number of ways to match prefix \`t[0...j-1]\` inside \`s[0...i-1]\`:
- **Match Case** (\`s[i-1] == t[j-1]\`):
  Sum of **USING** character + **SKIPPING** character in \`s\`:
  $$\\text{dp}[i][j] = \\text{dp}[i-1][j-1] + \\text{dp}[i-1][j]$$
- **Mismatch Case** (\`s[i-1] != t[j-1]\`):
  Must skip character in \`s\`:
  $$\\text{dp}[i][j] = \\text{dp}[i-1][j]$$
- **Base Case**: \`dp[i][0] = 1\` (an empty string \`t\` matches any string \`s\` in 1 way).

\`\`\`viz:table-diff
{
  "columns": ["s \\\\ t", "∅", "b", "a", "g"],
  "before": [["∅", 1, 0, 0, 0], ["b", 1, 1, 0, 0]],
  "after": [["g", 1, 3, 4, 5]],
  "caption": "Distinct Subsequences — Matching character adds Use (dp[i-1][j-1]) + Skip (dp[i-1][j])."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Space Optimization*: Can be reduced to a 1D array by sweeping $j$ from $N$ down to $1$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Distinct Subsequences, why do we ADD dp[i-1][j-1] and dp[i-1][j] when s[i-1] == t[j-1]?",
          options: [
            "Because we want the maximum length.",
            "Because matching characters allow two valid choices: use s[i-1] to match t[j-1] OR skip s[i-1] to look for other matches in s.",
            "Because string characters are 16-bit.",
            "To prevent overflow."
          ],
          correct_index: 1,
          model_answer: "Both choices represent valid distinct subsequence ways. Summing them combines matches that use s[i-1] with matches that bypass it.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What is the result of Distinct Subsequences for s = \"rabbbit\", t = \"rabbit\"?",
          model_answer: "3. There are 3 distinct ways to pick 2 'b's out of the 3 'b's in s.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "edit-distance",
      title: "Edit Distance",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/edit-distance",
      summary: "Insert, delete, replace: each maps to a neighbour cell to compute the cheapest string transformation.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use greedy character replacement.
*Why this shatters*: Greedy fails because an **Insert** or **Delete** operation now could eliminate multiple future mismatch costs.

**The Structural Invariant: Minimum 3-Way Edit Choice Matrix.**
Let \`dp[i][j]\` be the minimum operations to convert \`word1[0...i-1]\` to \`word2[0...j-1]\`:
- **Match Case** (\`word1[i-1] == word2[j-1]\`):
  No operation cost: \`dp[i][j] = dp[i-1][j-1]\`.
- **Mismatch Case**:
  $$1 + \\min \\begin{cases} \\text{dp}[i][j-1] & \\text{(Insert)} \\\\ \\text{dp}[i-1][j] & \\text{(Delete)} \\\\ \\text{dp}[i-1][j-1] & \\text{(Replace)} \\end{cases}$$
- **Base Cases**: \`dp[i][0] = i\` (delete all chars), \`dp[0][j] = j\` (insert all chars).

\`\`\`viz:table-diff
{
  "columns": ["word1 \\\\ word2", "∅", "r", "o", "s"],
  "before": [["∅", 0, 1, 2, 3], ["h", 1, 1, 2, 3]],
  "after": [["e", 5, 4, 4, 3]],
  "caption": "Edit Distance — 3-Way Min: Insert (Left), Delete (Up), Replace (Diagonal)."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Geometric Mnemonic*: Left = Insert, Up = Delete, Diagonal = Replace.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Edit Distance DP matrix transitions, what operation corresponds to moving UP (dp[i-1][j])?",
          options: [
            "Insert character into word1",
            "Delete character from word1",
            "Replace character in word1",
            "Match character"
          ],
          correct_index: 1,
          model_answer: "Moving UP consumes a character from word1 without advancing word2, representing a Delete operation.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Edit Distance for word1 of length M and word2 of length N?",
          model_answer: "O(M * N) time complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "burst-balloons",
      title: "Burst Balloons",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/burst-balloons",
      summary: "Think about the LAST balloon in each range — interval DP over spans, with padded 1s at the borders.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners think about which balloon to burst **FIRST** ($O(N!)$ permutation tree).
*Why this shatters*: Bursting balloon $i$ first merges its left and right neighbors, creating complex dependencies between subproblems.

**The Structural Invariant: Last Balloon Burst Inversion (Interval DP).**
Invert your perspective! Think about which balloon $k$ is burst **LAST in range $(l, r)$**:
- If balloon $k$ is burst LAST in interval $(l, r)$, its adjacent neighbors are fixed at the walls \`nums[l]\` and \`nums[r]\`!
- **Recurrence**:
  $$\\text{dp}[l][r] = \\max_{l < k < r} (\\text{dp}[l][k] + \\text{nums}[l] \\cdot \\text{nums}[k] \\cdot \\text{nums}[r] + \\text{dp}[k][r])$$
- Pad array: Add virtual \`1\` at index 0 and index $N+1$.
- **Fill Order**: Iterate by **interval length (span)** from $2$ to $N+1$.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 3, 1, 5, 8, 1], "note": "Padded nums = [1, 3, 1, 5, 8, 1]. Fill intervals by length." },
    { "cells": [3, 30, "·", 167], "highlight": [3], "note": "Full interval dp[0][5] = 167. Max coins achieved = 167!" }
  ],
  "caption": "Burst Balloons — Interval DP picking LAST balloon in span (O(N^3) time)."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Fill Order*: Must fill shorter interval spans BEFORE larger interval spans.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does selecting the LAST balloon to burst inside interval (l, r) decouple subproblems in Burst Balloons?",
          options: [
            "Because last balloons are worth more points.",
            "Because when balloon k is the LAST to burst in (l, r), its immediate neighbors are fixed at boundaries nums[l] and nums[r], making left and right sub-intervals independent.",
            "Because interval DP requires sorting.",
            "Because 1s are padded at borders."
          ],
          correct_index: 1,
          model_answer: "Selecting the LAST balloon keeps interval boundaries fixed, allowing independent recursion on sub-intervals (l, k) and (k, r).",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Burst Balloons for N balloons?",
          model_answer: "O(N^3) time complexity (O(N^2) interval spans * O(N) internal split choices).",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "regular-expression-matching",
      title: "Regular Expression Matching",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/regular-expression-matching",
      summary: "Dot matches any single char; star means zero-or-more of the preceding element — two arms per cell.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use greedy string matching for \`*\` wildcards.
*Why this shatters*: Greedy matching consumes too many characters, causing failures on downstream requirements.

**The Structural Invariant: Wildcard Star Dual-Branch Matrix DP.**
Let \`dp[i][j]\` be \`true\` iff \`s[0...i-1]\` matches pattern \`p[0...j-1]\`:
1. **Normal / Dot Match** (\`p[j-1] == '.'\` OR \`s[i-1] == p[j-1]\`):
   $$\\text{dp}[i][j] = \\text{dp}[i-1][j-1]$$
2. **Star Wildcard** (\`p[j-1] == '*'\`):
   Star can represent **0 occurrences** OR **1+ occurrences** of preceding character \`p[j-2]\`:
   - **Zero Occurrences**: \`dp[i][j-2]\` (skip char and star!).
   - **One+ Occurrences**: If \`s[i-1]\` matches \`p[j-2]\` $\\rightarrow$ \`dp[i-1][j]\` (consume 1 char in $s$, keep star in $p$).
   $$\\text{dp}[i][j] = \\text{dp}[i][j-2] \\;||\\; (\\text{match} \\;\\&\\; \\text{dp}[i-1][j])$$

\`\`\`viz:table-diff
{
  "columns": ["s \\\\ p", "∅", "c", "*", "a", "*", "b"],
  "before": [["∅", "T", "F", "T", "F", "T", "F"]],
  "after": [["aab", "F", "F", "F", "F", "F", "T"]],
  "caption": "Regular Expression Matching — Star '*' dual-branch DP matrix evaluation."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty String Base Case*: Pattern like \`"a*b*c*"\` matches empty string \`""\` at \`dp[0][j]\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What two branches are evaluated when encountering a star '*' in pattern p at index j?",
          options: [
            "Match 1 char vs Match 2 chars",
            "Zero occurrences (dp[i][j-2]) OR One+ occurrences (match && dp[i-1][j])",
            "Delete string vs Reverse pattern",
            "Dot match vs Digit match"
          ],
          correct_index: 1,
          model_answer: "Star can either eliminate its preceding character (0 occurrences -> dp[i][j-2]) or consume one matching character from s while retaining the star pattern (dp[i-1][j]).",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Regular Expression Matching for text of length M and pattern of length N?",
          model_answer: "O(M * N) time complexity.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
