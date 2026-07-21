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
      body: `**Signal.** "A robot can only move right or down — count unique paths to the bottom-right corner" — arriving at any cell only from directly above or directly left is the tell for a grid-fill recurrence: dp[r][c] = dp[r-1][c] + dp[r][c-1].

**Brute force.** From (0,0), branch into two choices — right or down — recursively. This tree has depth m+n−2 and up to 2^(m+n) leaves, but the real waste is that many different paths land on the *same* cell (going right-then-down and down-then-right both reach (1,1)) and each recomputes everything below it from scratch.

**Optimal approach.** Since you can only arrive at (r, c) from above (r-1, c) or from the left (r, c-1): dp[r][c] = dp[r-1][c] + dp[r][c-1]. Base cases: the entire first row and first column are 1 — there is exactly one way to reach any cell in a straight line. Each cell only ever reads the previous row (above) and the current row (left), so the whole 2-D table collapses to a single 1-D array of size n, updated left-to-right for each row: row[j] += row[j-1].

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

**Complexity.** O(m·n) time, O(n) space with the rolling row — versus the brute force's O(2^(m+n)). (Closed form: a path is (m-1) downs and (n-1) rights in some order → C(m+n-2, m-1), O(min(m,n)) — but it breaks the moment the grid gains obstacles.)

**Thread.** Longest Common Subsequence keeps the same up/left recurrence shape, but now the two axes are positions in *two different strings* instead of a physical grid — the alignment square, the family this whole chapter is named for.`,
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
      body: `**Signal.** "The length of the longest common subsequence" of two strings — comparing two sequences where both can skip characters is the tell for the **alignment square**: state indexed by a position in *each* string, not one.

**Brute force.** Generate every subsequence of text1 (2^m of them) and check each against text2 — O(2^m · n), far too slow, but it reveals the branching decision every alignment problem shares: at each character, include it or skip it.

**Optimal approach.** Compare the *last* characters of each prefix. If text1[i] == text2[j]: dp[i][j] = 1 + dp[i-1][j-1] — a match extends the diagonal. Otherwise: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) — skip whichever character doesn't help. Base cases: row 0 and column 0 are all 0, since an empty string shares nothing. To recover the actual subsequence (not just its length), trace backwards from the bottom-right: on a match, emit the character and move diagonally; otherwise follow whichever neighbour (up or left) supplied the max.

\`\`\`viz:table-diff
{
  "columns": ["row \\\\ text2", "∅", "a", "c", "e"],
  "before": [["∅", 0, 0, 0, 0], ["a", 0, 1, 1, 1]],
  "after": [["c", 0, 1, 2, 2], ["e", 0, 1, 2, 3]],
  "caption": "text1=\\"abcde\\", text2=\\"ace\\" — a character match extends the diagonal by 1; a mismatch copies the max of the cell above or to the left. Final answer dp[e][e]=3, the length of \\"ace\\"."
}
\`\`\`

**Complexity.** O(m·n) time, O(min(m,n)) space with a rolling row — versus the O(2^m · n) brute force.

**Thread.** Best Time to Buy and Sell Stock With Cooldown leaves the two-string alignment shape for a different second dimension: not a second sequence, but a second axis of *situation* — which of a few states you're in on any given day.`,
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
      body: `**Signal.** "After selling you must wait one full day (cooldown) before buying again" — a rule that depends on what you did *yesterday*, not just today's price, is the tell for a state-machine DP: your options on any day depend on which of a small number of states yesterday left you in.

**Brute force.** Try every subset of buy/sell days respecting the cooldown rule and compute profit — exponential, and greedy ("sell whenever price rises") provably fails: selling at 3 forces a cooldown on day 4, missing the buy-at-0 opportunity two days later.

**Optimal approach.** There are exactly 3 states: HOLDING (own a share), COOLING (just sold, must wait), FREE (can buy). Let hold[i], cool[i], free[i] be the best cash in each state on day i. hold[i] = max(hold[i-1], free[i-1] - price[i]) — kept holding, or bought today from free. cool[i] = hold[i-1] + price[i] — sold today. free[i] = max(free[i-1], cool[i-1]) — stayed free, or finished cooling. The "2-D" table has 3 × n cells, but the second dimension is only 3 states wide, so it collapses to three rolling variables — no array of arrays needed.

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

**Complexity.** O(n) time, O(1) space with rolling state variables — versus the exponential subset-of-days brute force.

**Thread.** Coin Change II moves the second dimension from "which state" to "which coin denomination has been considered so far" — and the order those two loops nest in turns out to be the entire difference between counting combinations and counting permutations.`,
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
      body: `**Signal.** "Return the number of **combinations** that make up an amount, infinite supply of each coin" — combinations (order-independent), not sequences, is the tell for a very specific loop-nesting choice: coins in the outer loop, amounts in the inner.

**Brute force (the permutation trap).** For each amount a, try subtracting every coin c and sum dp[a-c] with amounts in the outer loop. This *works* as a count, but counts **permutations** (ordered sequences) — {1,2,2} and {2,1,2} get counted as different, over-counting the true number of combinations.

**Optimal approach.** Put coins in the outer loop: for coin in coins: for a in range(coin, amount+1): dp[a] += dp[a-coin]. Once coin 1 is processed, all combinations using only 1s are set. Then coin 2 is added on top — a combination {1,1,2} is built in exactly *one* canonical order (all 1s first, then 2s), so it's counted once. Swap the loops (amounts outer, coins inner) and you count permutations instead — same code, opposite nesting, totally different answer.

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

**Complexity.** O(coins × amount) time, O(amount) space — versus the permutation-counting version, which runs in identical time but computes the wrong quantity. This is the sharpest two-line lesson in all of DP: same code, opposite loop nesting, totally different answer.

**Thread.** Target Sum returns to single-dimension subset-sum counting, but the two dimensions are hidden inside one clever algebraic substitution: choosing +/- signs turns out to *be* choosing a subset.`,
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
      body: `**Signal.** "Assign + or − to each number so the expression equals target — count the assignments" — a sign-assignment count is the tell for an algebraic reduction: split into a positive set P and negative set N, and the problem becomes subset-sum counting.

**Brute force.** Try every +/- combination: 2ⁿ assignments. Fine for 5 elements (32), a million for 20 — DP is needed for anything realistic.

**Optimal approach.** sum(P) − sum(N) = target and sum(P) + sum(N) = totalSum. Adding these: 2·sum(P) = target + totalSum, so sum(P) = (target + totalSum) / 2. **Choosing signs = choosing the positive subset** — the problem reduces to "how many subsets of nums sum to exactly (target + totalSum) / 2?", a classic subset-sum count (quick exits: if target + totalSum is odd, or |target| > totalSum, the answer is 0). Sweep high-to-low per number — the same 0/1-knapsack discipline as Partition Equal Subset Sum — so each number is used at most once.

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

**Complexity.** O(n × sum) time, O(sum) space — versus the O(2ⁿ) brute-force sign enumeration.

**Thread.** Interleaving String is the alignment square again, but now the third piece of information — position in the target string — is derived for free: i + j always tells you exactly where you are in s3.`,
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
      body: `**Signal.** "Determine if s3 is formed by interleaving s1 and s2, both used completely, relative order preserved" — when both sources could supply s3's next character, the choice can't be decided locally, since the wrong pick might strand characters later — the tell for DP over a position in *each* source string.

**Brute force.** Recursively try consuming the next character of s3 from s1 or from s2 (whichever matches), branching whenever both options are available — exponential in the worst case, revisiting the same (i, j) position pair from many different branch histories.

**Optimal approach.** dp[i][j] = true iff the first i characters of s1 and first j characters of s2 can interleave to form the first i+j characters of s3. The position in s3 is always i + j — no third dimension needed. Let k = i+j-1 (current position in s3): dp[i][j] = (s1[i-1]==s3[k] AND dp[i-1][j]) OR (s2[j-1]==s3[k] AND dp[i][j-1]) — the last character came from s1, or from s2. Base: dp[0][0] = true; the first row and column are chains of single-source matching.

\`\`\`viz:table-diff
{
  "columns": ["row \\\\ s2", "∅", "a", "x", "y"],
  "before": [["∅", "T", "T", "F", "F"], ["a", "T", "T", "T", "F"]],
  "after": [["a", "T", "F", "T", "F"], ["b", "F", "F", "T", "T"]],
  "caption": "s1=\\"aab\\", s2=\\"axy\\", s3=\\"aaxaby\\" — dp[i][j] is true exactly when either source's next character matches s3 at position i+j-1 AND the predecessor cell holds. The path of true cells from top-left to bottom-right traces a valid interleaving."
}
\`\`\`

**Complexity.** O(m·n) time, O(n) space with a rolling row — versus exponential naive recursion without memoisation.

**Thread.** Longest Increasing Path in a Matrix leaves string alignment behind entirely — the grid itself is the state space, and the recursion becomes memoised DFS on an implicit graph with no cycles to worry about.`,
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
      body: `**Signal.** "Find the length of the longest strictly increasing path" through a grid, moving in 4 directions — **strict** increase is the tell: it means no cycle can ever exist among increasing moves, so this is DAG traversal wearing a grid costume, safe for memoised DFS with no visited set needed.

**Brute force.** From every cell, try every strictly-increasing path exhaustively without memoisation — many cells get revisited from different starting points and re-explored from scratch each time, exponential in the worst case.

**Optimal approach.** Draw an edge from each cell to each strictly larger orthogonal neighbour. longest(cell) = 1 + max(longest(neighbour) for each LARGER neighbour). Two things normally mandatory in graph traversal aren't needed here: no visited set (values only increase, so revisiting is structurally impossible), and no explicit topological sort (memoised DFS discovers the order implicitly). This is the cleanest demonstration that **DP = DAG traversal with remembered results**.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "n1", "label": "1 at (2,1) — longest=4", "children": ["n2"], "highlight": true },
    { "id": "n2", "label": "2 at (2,0) — longest=3", "children": ["n6"], "highlight": true },
    { "id": "n6", "label": "6 at (1,0) — longest=2", "children": ["n9"], "highlight": true },
    { "id": "n9", "label": "9 at (0,0) — longest=1 (no larger neighbour)", "highlight": true }
  ],
  "rootId": "n1",
  "caption": "Longest Increasing Path — DFS from cell (2,1)=1 climbs strictly-increasing neighbours; each cell's longest() is computed once and cached, giving the path 1→2→6→9, length 4."
}
\`\`\`

**Complexity.** O(m·n) time, O(m·n) space for the memo (each cell computed exactly once, 4 edges checked each; stack depth bounded by the longest path) — versus the exponential unmemoised exploration.

**Thread.** Distinct Subsequences returns to the alignment square, but now the question is a *count* of embeddings rather than a longest match — and the twist is that even a matching character keeps both branches alive.`,
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
      body: `**Signal.** "Return the number of distinct subsequences of s which equal t" — the LCS alignment square's shape, but *counting* embeddings instead of finding the longest match, is the tell that even a matching character needs both branches (use it, or skip it anyway) added together, not maxed.

**Brute force.** Recursively try, at each position in s, either matching it against the current position in t (if equal) or skipping it, branching at every character — exponential, with massive overlap between subproblems reached via different skip/match histories.

**Optimal approach.** dp[i][j] = number of ways to match t[0..j-1] within s[0..i-1]. If s[i-1] != t[j-1]: dp[i][j] = dp[i-1][j] (skip s[i-1], it can't help). If s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1] (use s[i-1] for t[j-1]) + dp[i-1][j] (skip s[i-1] anyway). The critical insight: **even on a match, add the skip case** — different source characters used for the same target position create distinct embeddings. Bases: dp[i][0] = 1 (empty target matches one way, vacuously), dp[0][j>0] = 0.

\`\`\`viz:table-diff
{
  "columns": ["row \\\\ t", "∅", "b", "a", "g"],
  "before": [["∅", 1, 0, 0, 0], ["b", 1, 1, 0, 0]],
  "after": [["a", 1, 3, 4, 1], ["g", 1, 3, 4, 5]],
  "caption": "s=\\"babgbag\\", t=\\"bag\\" — on a character match, dp[i][j] = dp[i-1][j-1] + dp[i-1][j] (use AND skip both survive); on a mismatch, dp[i][j] = dp[i-1][j] only. Final answer dp[g][g] = 5."
}
\`\`\`

**Complexity.** O(m·n) time, O(n) space with a rolling row (sweep right-to-left, the same discipline as the subset-sum high-to-low sweep, to avoid clobbering) — versus exponential naive recursion.

**Thread.** Edit Distance is the alignment square once more, but the operator changes again: instead of counting matches, minimise a cost over three possible moves per cell instead of two.`,
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
      body: `**Signal.** "The minimum number of operations (insert, delete, replace) to convert word1 into word2" — three possible edits at each mismatched position is the tell for a three-way min over the alignment square's three neighbours: diagonal, up, and left.

**Brute force.** Recursively try all three operations at every mismatch, branching three ways each time — exponential, revisiting the same (i, j) subproblem through many different edit-sequence histories.

**Optimal approach.** dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1]. If word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1] — match, no cost. Otherwise: dp[i][j] = 1 + min(dp[i-1][j-1] [replace], dp[i-1][j] [delete], dp[i][j-1] [insert]). Geometric mnemonic: replace = diagonal, delete = up, insert = left. Bases: dp[i][0] = i (delete all of word1), dp[0][j] = j (insert all of word2).

\`\`\`viz:table-diff
{
  "columns": ["row \\\\ word2", "∅", "r", "o", "s"],
  "before": [["∅", 0, 1, 2, 3], ["h", 1, 1, 2, 3]],
  "after": [["s", 4, 3, 3, 2], ["e", 5, 4, 4, 3]],
  "caption": "word1=\\"horse\\", word2=\\"ros\\" — tracing back from dp[e][s]=3: delete 'e' (up), match 's' (diagonal, free), delete 'r' (up), match 'o' (diagonal, free), replace 'h'→'r' (diagonal, cost 1). Total: 3 operations — horse → hors → hos → ros."
}
\`\`\`

**Complexity.** O(m·n) time, O(m·n) space (can be optimised to O(min(m,n)) with two rows, but the full table is needed to recover the actual edit script) — versus exponential naive recursion. Kinship: with only insert/delete (no replace), edit distance = m + n − 2·LCS.

**Thread.** Burst Balloons abandons the two-string alignment shape entirely for a genuinely different 2-D pattern: interval DP, where dp[l][r] describes a *span*, not a pair of prefixes — and the trick is thinking about the last event in a range, not the first.`,
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
      body: `**Signal.** "Bursting balloon i earns nums[left] × nums[i] × nums[right], using its *current* neighbours" — a cost that depends on neighbours that change as you burst is the tell that the subproblems are interdependent when you think about which balloon bursts *first*; thinking about which bursts *last* decouples them.

**Brute force.** Try every order of bursting all n balloons and compute the total — n! orderings, since the "current neighbours" rule makes the cost of each burst depend entirely on burst order.

**Optimal approach (the last-balloon inversion).** If balloon i is picked to burst *first*, the remaining array "heals" and its neighbours merge — the subproblems become interdependent because the boundaries shift. But if balloon k is the **last** to burst in a range (l, r), its neighbours *are* the walls l and r, fixed and known, and everything else in (l, k) and (k, r) is already gone — two independent subproblems. Pad the array with virtual 1s. dp[l][r] = max coins from bursting everything strictly between walls l and r: dp[l][r] = max over k in (l,r) of dp[l][k] + nums[l]·nums[k]·nums[r] + dp[k][r]. Base: adjacent walls enclose nothing, dp[l][l+1] = 0. Fill by increasing **span length** — small intervals before large ones — since large intervals depend on smaller sub-intervals; this fill order is the third dimension of thought even though the table itself is 2-D.

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, "·", "·", "·"], "note": "Padded nums = [1,3,1,5,8,1]. Span 2 (one balloon between walls): dp[0][2] = 1×3×1 = 3." },
    { "cells": [3, 30, "·", "·"], "note": "Span 3 (two balloons): dp[0][3], trying k=1: dp[0][1](0) + 1×3×5 + dp[1][3](15) = 30 — better than trying k=2 (which gives 8)." },
    { "cells": [3, 30, "·", 167], "highlight": [3], "note": "Continuing to fill by increasing span across all sub-ranges: the full span dp[0][5] = 167 — the maximum total coins from bursting every balloon." }
  ],
  "caption": "Burst Balloons — filled by span length; dp[l][r] considers every possible LAST balloon to burst within the range, since that balloon's neighbours are fixed at the walls."
}
\`\`\`

**Complexity.** O(n³) time — O(n²) intervals × O(n) split points — O(n²) space, versus the O(n!) brute-force ordering enumeration. This cubic cost is the honest price of interval DP, and it's optimal for this problem family (matrix-chain multiplication, polygon triangulation share the same shape).

**Thread.** Regular Expression Matching closes the chapter back in the alignment square — the family this chapter opened with — but now one axis carries a wildcard operator that can match zero, one, or many characters, doubling the branches per cell.`,
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
      body: `**Signal.** "\`.\` matches any single character, \`*\` matches zero or more of the *preceding* element, match must cover the entire string" — the \`*\` operator creates branching (should a* match zero, one, or more a's?) that can't be decided greedily, since a wrong choice now could fail later — the alignment square one final time, with a wildcard.

**Brute force.** Recursively try every possible number of repetitions for each starred element, branching at every \`*\` — exponential, revisiting the same (i, j) position pair across many different repetition-count histories.

**Optimal approach.** dp[i][j] = true iff s[0..i-1] matches p[0..j-1]. Normal character or '.': dp[i][j] = dp[i-1][j-1] AND (s[i-1]==p[j-1] OR p[j-1]=='.'). When p[j-1] is '*': the '*' and p[j-2] form a unit with two arms — zero copies: dp[i][j-2] (the x* unit vanishes entirely); one-or-more copies: dp[i-1][j] AND (s[i-1] matches p[j-2]) (consume one character from s, but the x* unit stays — pattern index j stays put, which is how "more" loops). dp[i][j] = zero_arm OR one_plus_arm.

\`\`\`viz:table-diff
{
  "columns": ["row \\\\ pattern", "∅", "c", "*", "a", "*", "b"],
  "before": [["∅", "T", "F", "T", "F", "T", "F"], ["a", "F", "F", "F", "T", "T", "F"]],
  "after": [["a", "F", "F", "F", "F", "T", "F"], ["b", "F", "F", "F", "F", "F", "T"]],
  "caption": "s=\\"aab\\", p=\\"c*a*b\\" — row ∅: c* and a* can both vanish, giving T at columns 2 and 4. Row \\"a\\": a* matches one 'a', propagating T down column 4. Final answer dp[b][b] = T."
}
\`\`\`

**Complexity.** O(m·n) time, O(m·n) space — versus exponential naive recursion over repetition counts. Real regex engines compile to Thompson NFAs — but the NFA's state graph *is* this table with the string axis streamed; you have effectively derived the engine.

**Thread.** That closes 2-D DP and the DP arc of the atlas: grid walks, alignment squares, state machines, knapsack loop-order tricks, DAG memoisation, and interval DP — six shapes covering nearly every 2-D state space you'll meet. Next, **Greedy** asks a different question: when can you skip the table entirely and just prove, at each step, that the locally obvious choice is never wrong?`,
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
