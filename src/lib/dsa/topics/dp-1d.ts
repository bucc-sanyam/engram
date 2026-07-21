import type { DsaTopic } from "../types";

/** Chapter 13 — 1-D Dynamic Programming: recursion that remembers. */
export const dp1d: DsaTopic = {
  slug: "dp-1d",
  title: "1-D Dynamic Programming",
  chapter: 13,
  tagline: "Overlapping subproblems, remembered once — the decision tree collapsed into a single array.",
  color: "#ffd166",
  prereqs: ["backtracking"],
  unlocks: ["dp-2d", "bit-manipulation"],
  intro: `Dynamic programming is the entire discipline built on one observation: **if a subproblem's answer depends only on where you are, not how you got there, solve it once and remember it.** The exponential tree collapses into a table with one entry per distinct state — and in this chapter, states fit in a single array: \`dp[i]\` for "the answer at position i" or "the answer for amount i."

Every problem follows the same five-finger checklist: **State**, **Recurrence**, **Base cases**, **Order of filling**, and **Answer location**.`,
  problems: [
    {
      slug: "climbing-stairs",
      title: "Climbing Stairs",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/climbing-stairs",
      summary: "Fibonacci in disguise — the canonical tour from brute recursion to O(1) space.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try naive recursion \`climb(n) = climb(n-1) + climb(n-2)\`.
*Why this shatters*: Naive recursion re-calculates the exact same subproblems repeatedly, creating an $O(2^N)$ exponential call tree (e.g. \`climb(3)\` is calculated dozens of times for \`n=10\`).

**The Structural Invariant: Optimal Substructure + Tabulation.**
To reach step $i$, you can ONLY arrive from:
1. Step $i - 1$ (taking a 1-step jump).
2. Step $i - 2$ (taking a 2-step jump).
- **Recurrence**:
  $$\\text{dp}[i] = \\text{dp}[i-1] + \\text{dp}[i-2]$$
- **Base Cases**: \`dp[1] = 1\`, \`dp[2] = 2\`.
- **$O(1)$ Space Optimization**: Since \`dp[i]\` only depends on the previous 2 values, maintain two rolling variables \`prev1\` and \`prev2\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, "_", "_", "_"], "note": "Base: dp[1]=1, dp[2]=2." },
    { "cells": [1, 2, 3, "_", "_"], "highlight": [0, 1], "note": "dp[3] = dp[2] + dp[1] = 2 + 1 = 3." },
    { "cells": [1, 2, 3, 5, "_"], "highlight": [1, 2], "note": "dp[4] = dp[3] + dp[2] = 3 + 2 = 5." },
    { "cells": [1, 2, 3, 5, 8], "highlight": [2, 3], "note": "dp[5] = dp[4] + dp[3] = 5 + 3 = 8. Total ways for 5 stairs = 8!" }
  ],
  "caption": "Climbing Stairs — Rolling variable Fibonacci DP in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Base Case Bounds*: Check $N=1$ explicitly before allocating array indices if using 1-indexed tables.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What mathematical sequence defines the recurrence for Climbing Stairs?",
          options: [
            "Fibonacci Sequence",
            "Catalan Sequence",
            "Geometric Progression",
            "Factorial Sequence"
          ],
          correct_index: 0,
          model_answer: "The number of ways to reach step N is dp[N-1] + dp[N-2], matching the Fibonacci recurrence.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "How can space complexity be reduced from O(N) to O(1) in Climbing Stairs?",
          model_answer: "By replacing the DP array with two integer variables storing only the previous two step values (prev1 and prev2) as you iterate.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "min-cost-climbing-stairs",
      title: "Min Cost Climbing Stairs",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/min-cost-climbing-stairs",
      summary: "Same staircase, now priced: dp[i] = cost[i] + min(two predecessors).",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners greedily pick the cheaper step between step $i+1$ and $i+2$ at every step.
*Why this shatters*: Greedy fails because taking a slightly cheaper step now might force landing on a massively expensive step later!

**The Structural Invariant: Minimum Accumulated Cost Recurrence.**
Let \`dp[i]\` be the minimum cost to reach step $i$:
$$\\text{dp}[i] = \\text{cost}[i] + \\min(\\text{dp}[i-1], \\text{dp}[i-2])$$
- **Base Cases**: \`dp[0] = cost[0]\`, \`dp[1] = cost[1]\`.
- **Top of Staircase**: The top is past the last index $N$. You can reach the top from either step $N-1$ or $N-2$:
  $$\\text{Total Min Cost} = \\min(\\text{dp}[N-1], \\text{dp}[N-2])$$

\`\`\`viz:array
{
  "frames": [
    { "cells": [10, 15, 20], "pointers": [{ "label": "cost[0]", "index": 0 }, { "label": "cost[1]", "index": 1 }], "note": "cost = [10, 15, 20]. Base: dp[0]=10, dp[1]=15." },
    { "cells": [10, 15, 30], "highlight": [0, 1], "note": "dp[2] = 20 + min(10, 15) = 20 + 10 = 30." },
    { "cells": [10, 15, 30], "highlight": [1, 2], "note": "Top reached! min(dp[1], dp[2]) = min(15, 30) = 15. Min cost = 15!" }
  ],
  "caption": "Min Cost Climbing Stairs — DP accumulation in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Starting Step*: Remember you can start from either index 0 OR index 1 for free!`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Min Cost Climbing Stairs, how is the final minimum cost to reach the top calculated from the DP table?",
          options: [
            "dp[N]",
            "min(dp[N-1], dp[N-2])",
            "dp[0] + dp[1]",
            "max(dp[N-1], dp[N-2])"
          ],
          correct_index: 1,
          model_answer: "The top of the floor is past the end of the array, so it can be reached in 1 step from N-1 or in 2 steps from N-2.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity of Min Cost Climbing Stairs using two rolling variables?",
          model_answer: "O(N) time complexity and O(1) space complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "house-robber",
      title: "House Robber",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/house-robber",
      summary: "Take it and skip a neighbour, or skip it — the include/exclude recurrence.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners greedily rob odd houses or even houses (\`sum(odd)\` vs \`sum(even)\`).
*Why this shatters*: Counterexample: \`[2, 1, 1, 2]\`. Odd sum = $2 + 1 = 3$, Even sum = $1 + 2 = 3$. But robbing house 0 and house 3 yields $2 + 2 = 4$!

**The Structural Invariant: Include / Exclude Recurrence.**
At each house $i$, we have two mutually exclusive choices:
1. **Rob House $i$**: Earn \`nums[i]\` plus maximum loot from house $i-2$ (\`nums[i] + dp[i-2]\`).
2. **Skip House $i$**: Earn maximum loot up to house $i-1$ (\`dp[i-1]\`).
- **Recurrence**:
  $$\\text{dp}[i] = \\max(\\text{dp}[i-1], \\text{nums}[i] + \\text{dp}[i-2])$$

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 7, 9, 3, 1], "note": "nums = [2, 7, 9, 3, 1]. Base: rob0=2, rob1=max(2,7)=7." },
    { "cells": [2, 7, 11, 3, 1], "highlight": [0, 1], "note": "House 2 (val 9): max(dp[1], 9 + dp[0]) = max(7, 9+2) = 11." },
    { "cells": [2, 7, 11, 11, 1], "highlight": [1, 2], "note": "House 3 (val 3): max(dp[2], 3 + dp[1]) = max(11, 3+7) = 11." },
    { "cells": [2, 7, 11, 11, 12], "highlight": [2, 3], "note": "House 4 (val 1): max(dp[3], 1 + dp[2]) = max(11, 1+11) = 12. Final max loot = 12!" }
  ],
  "caption": "House Robber — Non-adjacent DP choice tree in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Rolling Variables*: Implement with \`rob1\` and \`rob2\` variables to eliminate $O(N)$ array memory.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What are the two choices evaluated at house i in the House Robber recurrence?",
          options: [
            "Rob house i and i+1 vs Skip both",
            "Rob house i (nums[i] + dp[i-2]) vs Skip house i (dp[i-1])",
            "Rob all odd houses vs Rob all even houses",
            "Sort houses descending vs ascending"
          ],
          correct_index: 1,
          model_answer: "If we rob house i, we cannot rob i-1, so we add nums[i] to dp[i-2]. If we skip house i, we retain dp[i-1]. We take the maximum.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the optimal space complexity for House Robber?",
          model_answer: "O(1) auxiliary space using two variables to track the maximum loot of the previous two houses.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "house-robber-ii",
      title: "House Robber II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/house-robber-ii",
      summary: "A circular street: split into two linear cases and take the better.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to handle circular house arrangements by adding modulo operations to index checks.
*Why this shatters*: Modulo checks blur the distinction between house 0 and house $N-1$, breaking standard 1D DP array dependencies.

**The Structural Invariant: Global Circular Constraint Case Splitting.**
Since houses are arranged in a **circle**, House 0 and House $N-1$ are adjacent!
- You can NEVER rob both House 0 AND House $N-1$.
- This splits the problem into **two independent linear House Robber I subproblems**:
  1. **Case A (Rob House 0)**: Evaluate subarray \`nums[0 ... N-2]\` (exclude last house).
  2. **Case B (Rob House N-1)**: Evaluate subarray \`nums[1 ... N-1]\` (exclude first house).
- **Result**:
  $$\\text{Max Loot} = \\max(\\text{HouseRobberI}(\\text{nums}[0 \\dots N-2]), \\text{HouseRobberI}(\\text{nums}[1 \\dots N-1]))$$

\`\`\`viz:table-diff
{
  "columns": ["Case Choice", "Subarray Evaluated", "Constraint Handled"],
  "before": [["Case A", "nums[0 ... N-2]", "Excludes House N-1"], ["Case B", "nums[1 ... N-1]", "Excludes House 0"]],
  "after": [["Result", "max(Case A, Case B)", "Guarantees House 0 and N-1 are never robbed together"]],
  "caption": "House Robber II — Case splitting circular constraint into 2 linear subproblems."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Single House Edge Case*: If \`nums.length == 1\`, return \`nums[0]\` immediately!`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does House Robber II handle the constraint that the first and last houses are adjacent?",
          options: [
            "By using 2D matrix DP.",
            "By running standard House Robber twice: once on houses [0...N-2] and once on houses [1...N-1], returning the max.",
            "By setting negative values for house N-1.",
            "By dividing the array by 2."
          ],
          correct_index: 1,
          model_answer: "Splitting into two linear runs guarantees we never simultaneously rob both house 0 and house N-1.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the result for nums = [2, 3, 2] in House Robber II?",
          model_answer: "3. Case A [2, 3] yields 3. Case B [3, 2] yields 3. Max is 3.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-palindromic-substring",
      summary: "Every palindrome has a centre — expand from all 2n−1 of them and keep the widest.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners check all $O(N^2)$ substrings and verify if each is a palindrome ($O(N^3)$ total).
*Why this shatters*: Checking substrings from scratch repeats palindrome checks for overlapping inner characters.

**The Structural Invariant: Expand Around Center ($O(N^2)$ Time, $O(1)$ Space).**
Every palindrome expands symmetrically around its **center**:
- There are $2N - 1$ total potential centers in a string of length $N$:
  - $N$ odd-length centers (e.g. \`"aba"\` centered at \`'b'\`).
  - $N - 1$ even-length centers (e.g. \`"abba"\` centered between \`'b'\` and \`'b'\`).
- **Expansion Algorithm**: For each center, expand pointers \`L\` and \`R\` outward while \`L >= 0 && R < N && s[L] == s[R]\`.
- Track the maximum length substring found across all expansions.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["b", "a", "b", "a", "d"], "pointers": [{ "label": "center 'a'", "index": 1 }], "note": "Center at idx 1 ('a'). Expand L=1, R=1 -> 'a'." },
    { "cells": ["b", "a", "b", "a", "d"], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 2 }], "highlight": [0, 1, 2], "note": "Expand L=0, R=2: s[0]=='b' == s[2]=='b'. Valid palindrome 'bab' (length 3)!" },
    { "cells": ["b", "a", "b", "a", "d"], "highlight": [0, 1, 2], "note": "Expand L=-1 (out of bounds). Max Palindrome found = 'bab'." }
  ],
  "caption": "Longest Palindromic Substring — Expand around center in O(N^2) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Space Advantage*: Expand Around Center achieves $O(1)$ extra space, vastly superior to the $O(N^2)$ space required by 2D DP table approaches.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why are there 2N - 1 total centers to check in a string of length N?",
          options: [
            "N centers for odd-length palindromes + N-1 centers between characters for even-length palindromes.",
            "Because 2N - 1 is prime.",
            "N centers for vowels + N-1 for consonants.",
            "Because strings have two ends."
          ],
          correct_index: 0,
          model_answer: "Odd-length palindromes center on a single character (N possibilities), while even-length palindromes center between two characters (N-1 possibilities).",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the space complexity of Expand Around Center vs 2D DP for Longest Palindromic Substring?",
          model_answer: "Expand Around Center takes O(1) space, whereas 2D DP takes O(N^2) space to store table state.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "palindromic-substrings",
      title: "Palindromic Substrings",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/palindromic-substrings",
      summary: "Same centres, new harvest: count every successful expansion step.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use the same code as Longest Palindromic Substring, but store substrings in a Set to count them.
*Why this shatters*: The problem explicitly requires counting **every occurrence** of a palindromic substring separately (duplicates at different positions count!).

**The Structural Invariant: Center Expansion Step Harvesting.**
- Use the same $2N - 1$ Center Expansion engine.
- Instead of tracking maximum length, **increment \`count++\` for EVERY valid expansion step**:
  - \`countSubstrings(L, R)\`:
    - While \`L >= 0 && R < N && s[L] == s[R]\`:
      - \`count++\`
      - \`L--\`, \`R++\`

\`\`\`viz:array
{
  "frames": [
    { "cells": ["a", "a", "a"], "pointers": [{ "label": "center 0", "index": 0 }], "note": "Center 0 ('a'): L=0, R=0 -> s[0]=='a' -> count=1." },
    { "cells": ["a", "a", "a"], "pointers": [{ "label": "gap 0-1", "index": 0 }], "highlight": [0, 1], "note": "Gap (0,1): L=0, R=1 -> s[0]==s[1]=='a' -> count=2 ('aa')." },
    { "cells": ["a", "a", "a"], "pointers": [{ "label": "center 1", "index": 1 }], "highlight": [0, 1, 2], "note": "Center 1 ('a'): L=1,R=1 ('a') -> count=3; expand L=0,R=2 ('aaa') -> count=4!" }
  ],
  "caption": "Palindromic Substrings — Counting every expansion step in O(N^2) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *All Positions Count*: For \`"aaa"\`, answer is 6: \`"a", "a", "a", "aa", "aa", "aaa"\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does Palindromic Substrings harvest counts during center expansion?",
          options: [
            "It adds 1 only when expansion finishes.",
            "It increments total count by 1 for EVERY step that s[L] == s[R] holds during expansion.",
            "It multiplies counts by N.",
            "It divides length by 2."
          ],
          correct_index: 1,
          model_answer: "Every valid step during outward expansion corresponds to a distinct valid palindromic substring, adding 1 to the total count.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the total number of palindromic substrings in string s = \"aaa\"?",
          model_answer: "6 palindromic substrings.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "decode-ways",
      title: "Decode Ways",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/decode-ways",
      summary: "Fibonacci with validity guards: the last token was one digit or two, but zeros must ride as tails.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners treat \`'0'\` as a valid digit mapping (e.g. mapping \`0\` to \`'A'\`).
*Why this shatters*: Encoding is 1-indexed (\`'1' -> 'A'\` ... \`'26' -> 'Z'\`). A standalone \`'0'\` is INVALID and cannot be decoded!

**The Structural Invariant: Gated 1-Digit and 2-Digit Recurrence.**
Let \`dp[i]\` be the number of ways to decode prefix \`s[0 ... i-1]\`:
1. **1-Digit Transition**: If \`s[i-1] != '0'\` (valid digit '1'-'9'):
   $$\\text{dp}[i] += \\text{dp}[i-1]$$
2. **2-Digit Transition**: If two-character substring \`s[i-2...i-1]\` is between \`"10"\` and \`"26"\`:
   $$\\text{dp}[i] += \\text{dp}[i-2]$$
- **Base Case**: \`dp[0] = 1\` (empty string has 1 valid decoding), \`dp[1] = s[0] == '0' ? 0 : 1\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 1, "_", "_"], "note": "s = '226'. Base: dp[0]=1, dp[1]=1 ('2' is valid)." },
    { "cells": [1, 1, 2, "_"], "highlight": [0, 1], "note": "i=2 ('2'): '2' valid (+dp[1]=1), '22' valid (+dp[0]=1) -> dp[2] = 2." },
    { "cells": [1, 1, 2, 3], "highlight": [1, 2], "note": "i=3 ('6'): '6' valid (+dp[2]=2), '26' valid (+dp[1]=1) -> dp[3] = 3. Total ways = 3!" }
  ],
  "caption": "Decode Ways — Gated 1-digit and 2-digit DP transitions."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Leading Zeros*: If \`s[0] == '0'\`, return \`0\` immediately! Substrings like \`"30"\` or \`"06"\` have 0 valid decodings.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What happens when a standalone '0' character is encountered in Decode Ways without a valid preceding '1' or '2'?",
          options: [
            "It decodes to 'A'.",
            "It is invalid, contributing 0 ways to decode at that branch.",
            "It skips to the next character.",
            "It doubles the DP value."
          ],
          correct_index: 1,
          model_answer: "Digits start at '1'='A'. '0' cannot stand alone or follow digits > 2, making the decoding branch invalid (0 ways).",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the result of Decode Ways for input s = \"10\"?",
          model_answer: "1. '10' decodes to 'J'. '0' cannot decode alone.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "coin-change",
      title: "Coin Change",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/coin-change",
      summary: "State = amount, not position. Fewest coins for every value 0..target.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use a Greedy approach, always taking the largest coin denomination available.
*Why this shatters*: Counterexample: \`coins = [1, 3, 4, 5]\`, \`amount = 7\`. Greedy picks $5 + 1 + 1 = 3$ coins. But optimal is $4 + 3 = 2$ coins! Greedy fails for non-canonical coin systems.

**The Structural Invariant: Amount-Indexed Min Unbounded Knapsack.**
Let \`dp[a]\` be the minimum number of coins needed to make amount \`a\`:
$$\\text{dp}[a] = 1 + \\min_{c \\in \\text{coins}, c \\le a} (\\text{dp}[a - c])$$
- **Base Case**: \`dp[0] = 0\` (0 coins needed for amount 0).
- **Initialization**: Fill \`dp\` array with \`amount + 1\` (acting as $+\\infty$).
- **Outer Loop**: Amount $a$ from $1 \\dots \\text{amount}$.
- **Inner Loop**: For each coin $c \\in \\text{coins}$.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, "INF", "INF", "INF", "INF", "INF", "INF", "INF"], "note": "coins=[1,3,4,5], amount=7. Base: dp[0]=0." },
    { "cells": [0, 1, 2, 1, 1, 1, 2, 2], "highlight": [7], "note": "dp[7] = 1 + min(dp[6], dp[4], dp[3], dp[2]) = 1 + min(2, 1, 1, 2) = 2 (coins 4 + 3)!" }
  ],
  "caption": "Coin Change — Amount-indexed DP finding minimum coins."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Unreachable Amount*: If \`dp[amount] > amount\`, return \`-1\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does the Greedy algorithm fail for general Coin Change problems?",
          options: [
            "Because greedy algorithms take O(N^2) time.",
            "Because picking the largest denomination can prevent finding a combination of smaller coins that uses fewer total coins overall.",
            "Because coin values are negative.",
            "Because Greedy requires sorted arrays."
          ],
          correct_index: 1,
          model_answer: "Always taking the largest coin can leave an awkward remaining amount requiring many small coins, whereas smaller coin choices sum to the target in fewer steps.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Coin Change for amount A and N coin types?",
          model_answer: "O(A * N) time complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "maximum-product-subarray",
      title: "Maximum Product Subarray",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/maximum-product-subarray",
      summary: "Carry the max AND the min: a negative number swaps them, and yesterday's worst becomes today's best.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use Kadane's Algorithm tracking only the running maximum product \`maxSoFar\`.
*Why this shatters*: Multiplying by a **negative number** flips a large negative number into a **massive positive number**! Tracking only the maximum discards negative candidates that could become the maximum on the next step.

**The Structural Invariant: Dual State Tracking (Max & Min Product).**
At each element $x = \\text{nums}[i]$, maintain BOTH \`currMax\` and \`currMin\`:
- If $x < 0$, **SWAP** \`currMax\` and \`currMin\`!
- **Transitions**:
  $$\\text{currMax} = \\max(x, x \\cdot \\text{currMax})$$
  $$\\text{currMin} = \\min(x, x \\cdot \\text{currMin})$$
- Update \`globalMax = max(globalMax, currMax)\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 3, -2, 4], "note": "nums=[2, 3, -2, 4]. Init currMax=2, currMin=2, global=2." },
    { "cells": [2, 6, -2, 4], "highlight": [1], "note": "x=3: currMax=max(3, 3*2)=6, currMin=3. global=6." },
    { "cells": [2, 6, -12, 4], "highlight": [2], "note": "x=-2 (negative -> swap max/min!): currMax=max(-2, -2*3)=-2, currMin=min(-2, -2*6)=-12. global=6." },
    { "cells": [2, 6, -12, 4], "highlight": [1], "note": "x=4: currMax=max(4, 4*-2)=4, currMin=min(4, 4*-12)=-48. Final global max product = 6!" }
  ],
  "caption": "Maximum Product Subarray — Tracking dual max and min states to handle negative flips."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Zero Reset*: When $x = 0$, both \`currMax\` and \`currMin\` reset to $0$, restarting subarray calculations.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must we track currMin alongside currMax in Maximum Product Subarray?",
          options: [
            "To calculate average product.",
            "Because multiplying a large negative currMin by a negative number produces a massive positive product that becomes the new currMax.",
            "To prevent integer overflow.",
            "Because Kadane's algorithm requires 2 variables."
          ],
          correct_index: 1,
          model_answer: "Negative numbers invert signs. Today's smallest negative product becomes tomorrow's largest positive product upon encountering a negative multiplier.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity of Maximum Product Subarray?",
          model_answer: "O(N) time complexity and O(1) space complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "word-break",
      title: "Word Break",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/word-break",
      summary: "dp[i] asks: can the first i characters be fully segmented into dictionary words?",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use greedy prefix matching, picking the longest matching dictionary word first.
*Why this shatters*: Counterexample: \`s = "cars"\`, \`dict = ["car", "ca", "rs"]\`. Greedy picks \`"car"\`, leaving \`"s"\` (fails!). Optimal picks \`"ca"` + `"rs"\` (succeeds!).

**The Structural Invariant: Prefix Segmentability Boolean DP.**
Let \`dp[i]\` be \`true\` iff prefix \`s[0 ... i-1]\` can be segmented into dictionary words:
- **Base Case**: \`dp[0] = true\` (empty string is valid).
- **Transition**: For $i = 1 \\dots N$:
  - For $j = 0 \\dots i-1$:
    - If \`dp[j] == true\` AND \`s.substring(j, i)\` is in \`wordDictSet\`:
      - Set \`dp[i] = true\` and \`break\`!

\`\`\`viz:array
{
  "frames": [
    { "cells": ["T", "F", "F", "F", "F", "F", "F", "F", "F"], "note": "s = 'leetcode', dict=['leet', 'code']. Base: dp[0]=T." },
    { "cells": ["T", "F", "F", "F", "T", "F", "F", "F", "F"], "highlight": [0, 4], "note": "i=4: dp[0]==T && s[0..4] 'leet' in dict -> dp[4] = T." },
    { "cells": ["T", "F", "F", "F", "T", "F", "F", "F", "T"], "highlight": [4, 8], "note": "i=8: dp[4]==T && s[4..8] 'code' in dict -> dp[8] = T. Return TRUE!" }
  ],
  "caption": "Word Break — Boolean prefix segmentability DP."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *HashSet Lookup*: Convert \`wordDict\` array to a \`Set\` for $O(1)$ string lookups.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does dp[i] = true represent in Word Break?",
          options: [
            "The character at index i is a vowel.",
            "The prefix substring s[0...i-1] of length i can be completely segmented into valid dictionary words.",
            "The dictionary contains i words.",
            "The string has no spaces."
          ],
          correct_index: 1,
          model_answer: "dp[i] stores whether the first i characters of string s can be formed by concatenating words from the dictionary.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Word Break for a string of length N?",
          model_answer: "O(N^2 * K) time, where N is string length and K is max word length (for substring slicing/hashing).",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-increasing-subsequence",
      summary: "dp[i] = LIS ending at i in O(n²). Then patience-sorting tails array in O(n log n).",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners confuse *Subsequence* (elements keep order, can skip elements) with *Subarray* (contiguous elements).
*Why this shatters*: Subsequences do NOT need to be contiguous!

**The Structural Invariant: Look-Back Predecessor DP ($O(N^2)$) vs Patience Sorting ($O(N \\log N)$).**
- **$O(N^2)$ DP Approach**:
  - Let \`dp[i]\` be the LIS ending **exactly at index $i$**.
  - \`dp[i] = 1 + max(dp[j])\` for all $j < i$ where \`nums[j] < nums[i]\`.
  - Base: \`dp[i] = 1\` for all $i$.
- **$O(N \\log N)$ Patience Sorting Optimization**:
  - Maintain array \`tails\` where \`tails[k]\` is the smallest tail value of all increasing subsequences of length $k + 1$.
  - For each number $x \\in \\text{nums}$:
    - Binary search $x$ in \`tails\`.
    - If $x > \\text{all elements in tails}$, append $x$.
    - Else replace first element in \`tails\` $\\ge x$ with $x$.
  - Result = \`tails.length\`!

\`\`\`viz:array
{
  "frames": [
    { "cells": [10, 9, 2, 5, 3, 7, 101, 18], "note": "nums = [10, 9, 2, 5, 3, 7, 101, 18]." },
    { "cells": [2, 3, 7, 101], "highlight": [0, 1, 2, 3], "note": "Patience Sorting tails array evolves to length 4: [2, 3, 7, 101]. LIS Length = 4!" }
  ],
  "caption": "Longest Increasing Subsequence — Patience sorting binary search optimization in O(N log N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Strictly Increasing*: Problem requires STRICTLY increasing ($>$, equal elements cannot extend the sequence!).`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does Patience Sorting reduce the time complexity of LIS from O(N^2) to O(N log N)?",
          options: [
            "By sorting the input array.",
            "By maintaining a sorted tails array of minimal end-elements for each subsequence length, using binary search to update entries in O(log N) per number.",
            "By eliminating nested loops.",
            "By using Hash Maps."
          ],
          correct_index: 1,
          model_answer: "The tails array remains sorted, allowing binary search to find insertion/replacement positions in O(log N) time per element.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "In O(N^2) DP for LIS, what does dp[i] represent?",
          model_answer: "dp[i] represents the length of the longest strictly increasing subsequence that ends specifically at index i.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "partition-equal-subset-sum",
      title: "Partition Equal Subset Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/partition-equal-subset-sum",
      summary: "Subset-sum DP: which totals are buildable? Sweep high-to-low so each number is used once.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to generate all $2^N$ subsets to check if any subset sums to \`total / 2\`.
*Why this shatters*: $2^N$ subset generation for $N = 200$ takes $2^{200}$ operations (impossible!).

**The Structural Invariant: 0/1 Knapsack High-to-Low Boolean Sweep.**
Partitioning into two equal sum subsets requires finding a subset with sum equal to **\`target = total_sum / 2\`**:
1. If \`total_sum\` is ODD, return \`false\` immediately!
2. Let \`dp[a]\` be boolean: Can we form exact sum \`a\` using a subset of numbers?
3. Base: \`dp[0] = true\`.
4. For each number $x \\in \\text{nums}$:
   - **SWEEP HIGH-TO-LOW** ($a = \\text{target}$ down to $x$):
     $$\\text{dp}[a] = \\text{dp}[a] \\;||\\; \\text{dp}[a - x]$$
   - *Why High-to-Low?* Sweeping backwards ensures number $x$ is used at most ONCE (0/1 Knapsack rule). Low-to-high sweep would reuse $x$ multiple times (Unbounded Knapsack!).

\`\`\`viz:array
{
  "frames": [
    { "cells": ["T", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F"], "note": "nums=[1,5,11,5], sum=22, target=11. Base: dp[0]=T." },
    { "cells": ["T", "T", "F", "F", "F", "T", "T", "F", "F", "F", "F", "T"], "highlight": [11], "note": "After processing 1, 5, 11: dp[11] becomes TRUE! Subset {11} equals target 11." }
  ],
  "caption": "Partition Equal Subset Sum — 0/1 Knapsack 1D DP high-to-low boolean sweep."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Target Check*: If max element in array $> \\text{target}$, return \`false\` immediately.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must the amount loop sweep HIGH-TO-LOW (target down to x) in 0/1 Knapsack subset sum DP?",
          options: [
            "To prevent negative array indices.",
            "To ensure each number x is used at most ONCE, preventing dp[a-x] updated in the current iteration from being reused to set dp[a].",
            "Because high-to-low sorts the array.",
            "To reduce time complexity."
          ],
          correct_index: 1,
          model_answer: "High-to-low iteration reads states from the *previous* element iteration. Low-to-high would allow the current number to be reused multiple times.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Partition Equal Subset Sum for N numbers and target sum T?",
          model_answer: "O(N * T) pseudo-polynomial time complexity.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
