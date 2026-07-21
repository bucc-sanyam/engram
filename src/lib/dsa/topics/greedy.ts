import type { DsaTopic } from "../types";

/** Chapter 15 — Greedy: one provable choice at a time. */
export const greedy: DsaTopic = {
  slug: "greedy",
  title: "Greedy",
  chapter: 15,
  tagline: "Commit to the locally best move and never look back — legal only when you can say why.",
  color: "#ff9e9e",
  prereqs: ["heap"],
  unlocks: [],
  intro: `Dynamic programming wins by *keeping every option alive* until the table settles. Greedy is the opposite bet: at each step, make one choice — the locally best one — commit forever, and throw the alternatives away. When it is valid, nothing beats it: no table, no recursion, usually one pass and O(1) space. When it is invalid, it fails silently on inputs you didn't try. That makes this chapter less about algorithms than about **arguments** — a greedy solution is only as good as the sentence that justifies it.

Two proof-shapes carry almost every greedy argument: the **exchange argument** (swapping in greedy choice maintains optimality) and **dominance** (greedy state dominates all alternatives).`,
  problems: [
    {
      slug: "maximum-subarray",
      title: "Maximum Subarray",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/maximum-subarray",
      summary: "Kadane's algorithm: a negative running sum helps nobody — drop it and start fresh.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners calculate the sum of all $O(N^2)$ possible contiguous subarrays.
*Why this shatters*: $O(N^2)$ brute-force iteration for $N = 100,000$ executes 5 billion operations.

**The Structural Invariant: Kadane's Algorithm (Resetting Negative Prefixes).**
Walk the array carrying a running sum \`currSum\`:
- At element $x = \\text{nums}[i]$:
  - If \`currSum < 0\`: Drop the negative prefix immediately (\`currSum = 0\`)! A negative running sum will strictly reduce any future contiguous subarray.
  - \`currSum += x\`.
  - Update \`maxSum = max(maxSum, currSum)\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [-2, 1, -3, 4, -1, 2, 1, -5, 4], "pointers": [{ "label": "x=-2", "index": 0 }], "note": "x=-2: currSum=-2, maxSum=-2." },
    { "cells": [-2, 1, -3, 4, -1, 2, 1, -5, 4], "pointers": [{ "label": "x=1", "index": 1 }], "highlight": [1], "note": "x=1: currSum is negative (-2) -> Reset currSum=0. Add 1 -> currSum=1. maxSum=1." },
    { "cells": [-2, 1, -3, 4, -1, 2, 1, -5, 4], "pointers": [{ "label": "x=1 (idx 6)", "index": 6 }], "highlight": [3, 4, 5, 6], "note": "Subarray [4, -1, 2, 1]: currSum = 6. New maxSum = 6!" }
  ],
  "caption": "Maximum Subarray — Kadane's Algorithm resetting negative running sums."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *All Negative Numbers*: Initialize \`maxSum = nums[0]\` (or \`-Infinity\`) to handle arrays containing only negative numbers (e.g. \`[-3, -2, -5]\` $\\rightarrow$ returns \`-2\`).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does Kadane's algorithm reset the running sum to 0 when it drops below 0?",
          options: [
            "Because 0 is the minimum array value.",
            "Because a negative running sum reduces the total sum of any subsequent contiguous subarray it joins.",
            "Because Kadane's algorithm requires non-negative integers.",
            "To sort the array."
          ],
          correct_index: 1,
          model_answer: "Adding a negative prefix sum to any future element is strictly worse than starting a new subarray from that element.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity of Kadane's algorithm?",
          model_answer: "O(N) time complexity and O(1) space complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "jump-game",
      title: "Jump Game",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/jump-game",
      summary: "Track the furthest reachable index; if the sweep ever outruns it, you are stranded.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use recursive backtracking trying every possible jump distance ($O(2^N)$ time).
*Why this shatters*: We do not care WHICH specific jumps were taken! We only care about the **FURTHEST REACHABLE INDEX**.

**The Structural Invariant: Greedy Maximum Reach Frontier.**
Maintain \`maxReach = 0\`:
- Iterate $i$ from $0 \\dots N-1$:
  - If $i > \\text{maxReach}$: **STRANDED!** (We reached an index that cannot be accessed by any previous jump $\\rightarrow$ return \`false\`).
  - \`maxReach = max(maxReach, i + nums[i])\`.
  - If \`maxReach >= N - 1\`: Return \`true\` early!

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 2, 1, 0, 4], "pointers": [{ "label": "i=0", "index": 0 }], "note": "i=0 (val 3): maxReach = max(0, 0+3) = 3." },
    { "cells": [3, 2, 1, 0, 4], "pointers": [{ "label": "i=3", "index": 3 }], "highlight": [3], "note": "i=3 (val 0): i <= maxReach(3). maxReach stays 3." },
    { "cells": [3, 2, 1, 0, 4], "pointers": [{ "label": "i=4", "index": 4 }], "highlight": [4], "note": "i=4 > maxReach(3) -> Index 4 is UNREACHABLE! Return FALSE." }
  ],
  "caption": "Jump Game — Tracking maxReach frontier in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Backward Goal Sliding Alternative*: Track \`goal = N - 1\`. Iterate $i$ from $N-2$ down to $0$: if $i + \\text{nums}[i] \\ge \\text{goal}$, update $\\text{goal} = i$. Return $\\text{goal} == 0$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Jump Game, what condition confirms that the end of the array cannot be reached?",
          options: [
            "If nums[0] == 0.",
            "If current loop index i exceeds maxReach (i > maxReach).",
            "If nums contains negative numbers.",
            "If array length is odd."
          ],
          correct_index: 1,
          model_answer: "If the current index i is greater than maxReach, we have reached a cell that no previous jump could attain, stranding the walk.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Jump Game?",
          model_answer: "O(N) time complexity, making a single pass through the array.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "jump-game-ii",
      title: "Jump Game II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/jump-game-ii",
      summary: "Reach-layers: everything attainable in k jumps forms a window — count windows until the end falls inside.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners greedily jump to the cell with the largest single jump value \`nums[i]\`.
*Why this shatters*: Jumping to the largest number might land on a cell that cannot reach far ahead (e.g. \`[2, 3, 1, 1, 4]\`).

**The Structural Invariant: Implicit BFS Window Levels.**
Treat jump ranges as **BFS levels/windows**:
- Maintain \`jumps = 0\`, \`currEnd = 0\`, \`farthest = 0\`.
- Iterate $i$ from $0 \\dots N-2$:
  - \`farthest = max(farthest, i + nums[i])\`.
  - When $i == \\text{currEnd}$: We reached the boundary of the current jump level!
    - \`jumps++\`
    - \`currEnd = farthest\` (Advance boundary to the farthest cell reachable in the next jump!).

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 3, 1, 1, 4], "note": "i=0: farthest=2, currEnd=0 -> Reached currEnd! jumps=1, currEnd=2." },
    { "cells": [2, 3, 1, 1, 4], "pointers": [{ "label": "i=1", "index": 1 }], "note": "i=1 (val 3): farthest = max(2, 1+3) = 4." },
    { "cells": [2, 3, 1, 1, 4], "highlight": [1, 2], "note": "i=2: farthest=4, i==currEnd(2) -> Reached window end! jumps=2, currEnd=4. Min jumps = 2!" }
  ],
  "caption": "Jump Game II — Implicit BFS window traversal for min jumps."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Loop Limit*: Loop ONLY up to $N - 2$ so you don't trigger an extra unnecessary jump when $i$ lands on $N - 1$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does Jump Game II achieve O(N) time complexity without using a BFS Queue?",
          options: [
            "By sorting jump values.",
            "By tracking current jump window boundary (currEnd) and updating jumps count only when the sweep reaches currEnd.",
            "By using binary search.",
            "By converting jumps to negative numbers."
          ],
          correct_index: 1,
          model_answer: "Tracking `currEnd` simulates level-by-level BFS traversal across contiguous index windows in linear time and O(1) space.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the space complexity of Jump Game II?",
          model_answer: "O(1) space complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "gas-station",
      title: "Gas Station",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/gas-station",
      summary: "If you stall, no start inside the failed stretch works either — restart just past the failure.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners simulate starting at every gas station $i$ ($O(N^2)$ time).
*Why this shatters*: Simulating full laps from every starting index is too slow.

**The Structural Invariant: Single-Pass Failed Stretch Pruning.**
1. **Global Feasibility Check**: A valid circuit exists iff $\\sum \\text{gas} \\ge \\sum \\text{cost}$. If $\\sum \\text{gas} < \\sum \\text{cost}$, return \`-1\` immediately!
2. **The Restart Rule**:
   - Maintain \`currTank = 0\`, \`start = 0\`.
   - Iterate $i$ from $0 \\dots N-1$:
     - \`currTank += gas[i] - cost[i]\`.
     - If \`currTank < 0\`:
       - **PRUNE WHOLE STRETCH**: Stalling at station $i$ proves that **NO station between \`start\` and $i$ can be a valid starting point**!
       - Reset \`start = i + 1\`, \`currTank = 0\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [-2, -2, -2, 3, 3], "pointers": [{ "label": "start=0", "index": 0 }], "note": "start=0: tank=-2 < 0 -> Prune [0]. Reset start=1, tank=0." },
    { "cells": [-2, -2, -2, 3, 3], "pointers": [{ "label": "start=3", "index": 3 }], "highlight": [3, 4], "note": "start=3: tank=3, then tank=6. Never dips negative! Valid start index = 3." }
  ],
  "caption": "Gas Station — Pruning failed stretches in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Proof of Restart*: Arriving at station $i$ with a positive tank still resulted in failure at $i$. Starting at any intermediate station $k \\in (\\text{start}, i)$ with 0 tank would fail even earlier!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can all stations between 'start' and 'i' be skipped when currTank dips below 0 at station i?",
          options: [
            "Because fuel costs are fixed.",
            "Because starting at any intermediate station with 0 initial fuel will result in even less fuel than arriving there with a positive tank, failing at or before station i.",
            "Because arrays are 0-indexed.",
            "Because sum(gas) < sum(cost)."
          ],
          correct_index: 1,
          model_answer: "Arriving at an intermediate station with a positive fuel balance was not enough to pass station i, so starting there from empty guarantees failure.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What condition guarantees that a valid circular circuit exists somewhere in the array?",
          model_answer: "If total gas >= total cost (`sum(gas) >= sum(cost)`).",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "hand-of-straights",
      title: "Hand of Straights",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/hand-of-straights",
      summary: "The smallest card has no choice: it must anchor a run — consume upward from it, count map in hand.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to form groups by picking arbitrary available numbers.
*Why this shatters*: The smallest available card in the hand **HAS NO CHOICE** — it MUST be the minimum/start card of a consecutive group!

**The Structural Invariant: Forced Minimum Card Run Consumption.**
1. **Divisibility Check**: If \`hand.length % groupSize != 0\`, return \`false\` immediately!
2. Count card frequencies in a Hash Map \`countMap\`.
3. Sort unique keys or use a **Min-Heap** of unique card values.
4. While Min-Heap is not empty:
   - Pop smallest value \`first = heap.peek()\`.
   - If \`countMap[first] == 0\`: Pop and continue.
   - For $i = 0 \\dots \\text{groupSize} - 1$:
     - \`card = first + i\`.
     - If \`countMap[card] < countMap[first]\`: Return \`false\` (Not enough consecutive cards available!).
     - \`countMap[card] -= countMap[first]\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 2, 3, 3, 4, 6, 7, 8], "note": "hand=[1,2,2,3,3,4,6,7,8], groupSize=3. Min card=1." },
    { "cells": [0, 1, 1, 0, 0, 0, 0, 0, 0], "highlight": [0, 1, 3], "note": "Consume group [1, 2, 3]. Remaining cards: [2, 3, 4, 6, 7, 8]." },
    { "cells": [0, 0, 0, 0, 0, 0, 0, 0, 0], "highlight": [2, 4, 5, 6, 7, 8], "note": "Consume groups [2, 3, 4] and [6, 7, 8]. All groups formed successfully -> Return TRUE!" }
  ],
  "caption": "Hand of Straights — Greedy forced minimum anchor card consumption."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Frequency Subtraction*: Subtracting frequencies in bulk (\`countMap[card] -= countMap[first]\`) keeps execution linear over distinct card values.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must the smallest remaining card value always serve as the start of a new consecutive group?",
          options: [
            "Because sorting places it first.",
            "Because no smaller card exists in the hand to place before it, leaving group start as its only valid position.",
            "Because groupSize is fixed.",
            "To save memory."
          ],
          correct_index: 1,
          model_answer: "With no smaller cards remaining, the minimum card cannot be the middle or end of a straight; it must be the start.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Hand of Straights for N cards?",
          model_answer: "O(N log N) time complexity for sorting unique card values.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "merge-triplets-to-form-target-triplet",
      title: "Merge Triplets to Form Target Triplet",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/merge-triplets-to-form-target",
      summary: "Discard any triplet that overshoots the target anywhere; the survivors can only help — check coverage.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners simulate all pairwise triplet max-merges ($O(2^N)$ combinations).
*Why this shatters*: Max-merging only ratchets numbers **UPWARD**. Any triplet with a coordinate greater than \`target\` is **POISONOUS** and can NEVER be used!

**The Structural Invariant: Overshoot Filtering + Coordinate Coverage.**
1. **Filter Poisonous Triplets**:
   Discard any triplet \`[a, b, c]\` if \`a > target[0] || b > target[1] || c > target[2]\`.
2. **Coverage Check on Safe Triplets**:
   Maintain boolean flags \`foundA = false, foundB = false, foundC = false\`.
   For each safe triplet \`[a, b, c]\`:
   - If \`a == target[0]\`: \`foundA = true\`.
   - If \`b == target[1]\`: \`foundB = true\`.
   - If \`c == target[2]\`: \`foundC = true\`.
3. Return \`foundA && foundB && foundC\`.

\`\`\`viz:table-diff
{
  "columns": ["Triplet", "a <= t0", "b <= t1", "c <= t2", "Coverage Contribution"],
  "before": [["[2,5,3]", "✓", "✓", "✓", "Covers t0 (2)"], ["[1,8,4]", "✓", "8 > 7 FAIL", "✓", "POISONOUS! Discard!"]],
  "after": [["[1,7,5]", "✓", "✓", "✓", "Covers t1 (7) & t2 (5) -> Target [2,7,5] Achieved!"]],
  "caption": "Merge Triplets — Filter poisonous triplets and verify coordinate coverage."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Associative Property*: Element-wise max is associative and commutative, making triplet order irrelevant.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can a triplet [a, b, c] with b > target[1] never be used in any valid merge sequence?",
          options: [
            "Because triplets must be sorted.",
            "Because max-merging only increases values. Overshooting a target coordinate cannot be undone by future max operations.",
            "Because target values are prime.",
            "To prevent negative numbers."
          ],
          correct_index: 1,
          model_answer: "The max operation is monotonic non-decreasing. Once a coordinate exceeds the target, no future merge can reduce it.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Merge Triplets?",
          model_answer: "O(N) time complexity, requiring a single linear pass over the triplets.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "partition-labels",
      title: "Partition Labels",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/partition-labels",
      summary: "A partition can close only when the window has passed every occurrence of every letter inside it.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to cut partitions at the first repetition of a character.
*Why this shatters*: Cutting early breaks the rule that **each letter must appear in at most one partition**!

**The Structural Invariant: Maximum Last-Occurrence Window Expansion.**
A partition can ONLY close when the current window index reaches the **furthest last-occurrence** of ALL characters inside the window:
1. **Precompute Last Indices**: Record \`lastIdx[ch] = index\` for every character in string $S$ ($O(N)$ pass).
2. **Greedy Window Expansion**:
   - Maintain \`size = 0\`, \`maxEnd = 0\`.
   - Iterate $i$ from $0 \\dots N-1$:
     - \`maxEnd = max(maxEnd, lastIdx[S[i]])\`.
     - \`size++\`.
     - If $i == \\text{maxEnd}$: **CLOSE PARTITION!** (All character obligations inside window are resolved!).
       - Append \`size\` to result. Reset \`size = 0\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["a","b","a","b","c","b","a","c","a", "d","e"], "note": "S = 'ababcbacade...'. Last index of 'a'=8, 'b'=5, 'c'=7." },
    { "cells": ["a","b","a","b","c","b","a","c","a"], "highlight": [0, 1, 2, 3, 4, 5, 6, 7, 8], "note": "i=8: maxEnd reaches 8 (last 'a'). i == maxEnd -> Cut Partition 1 (length 9)!" },
    { "cells": ["d","e"], "highlight": [9, 10], "note": "Start new partition for 'd'..." }
  ],
  "caption": "Partition Labels — Window obligation expansion cutting at max last-occurrence."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Interval Analogy*: This is equivalent to merging overlapping character intervals \`[first_occurrence, last_occurrence]\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What condition dictates when a partition can be safely closed in Partition Labels?",
          options: [
            "When part length reaches 5.",
            "When current loop index i equals the maximum last-occurrence index of all characters encountered in the current partition.",
            "When a vowel is reached.",
            "When the string is sorted."
          ],
          correct_index: 1,
          model_answer: "Reaching maxEnd guarantees that no character inside the current window appears anywhere later in the string.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity of Partition Labels?",
          model_answer: "O(N) time complexity and O(26) = O(1) auxiliary space.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "valid-parenthesis-string",
      title: "Valid Parenthesis String",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-parenthesis-string",
      summary: "Stars are three-way wildcards: track the min and max possible open count — a whole range in two integers.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use a stack, but struggle because wildcards \`'*'\` can act as \`'('\`, \`')'\`, or empty string \`""\`.
*Why this shatters*: Wildcards create exponential $3^N$ choice trees if evaluated recursively without state range tracking.

**The Structural Invariant: Min/Max Open Bracket Range Tracking.**
Track the range of possible **unclosed open bracket counts** \`[low, high]\`:
- At each character \`ch\`:
  - If \`ch == '('\`: \`low++\`, \`high++\`
  - If \`ch == ')'\`: \`low--\`, \`high--\`
  - If \`ch == '*'\`: \`low--\` (as ')'), \`high++\` (as '(')
- **Range Maintenance Guards**:
  - If \`high < 0\`: Return \`false\`! (Even using all stars as \`'('\`, too many \`')'\` were closed).
  - If \`low < 0\`: Clamp \`low = 0\` (discards invalid negative open counts).
- **Result**: Return \`low == 0\` (some valid wildcard interpretation balanced opens to 0!).

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 0], "note": "s = '(*))'. Init low=0, high=0." },
    { "cells": [1, 1], "note": "ch='(': low=1, high=1." },
    { "cells": [0, 2], "highlight": [0, 1], "note": "ch='*': low=0 (as ')'), high=2 (as '('). Range [0, 2]." },
    { "cells": [0, 1], "note": "ch=')': low=max(0, -1)=0, high=1. Range [0, 1]." },
    { "cells": [0, 0], "highlight": [0], "note": "ch=')': low=0, high=0. String complete with low == 0 -> Return TRUE!" }
  ],
  "caption": "Valid Parenthesis String — [low, high] open count range tracking in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Low Clamp*: Setting \`low = max(0, low)\` keeps the range valid because a negative open count represents invalid branches where closing brackets preceded opens.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does high < 0 signify during range tracking in Valid Parenthesis String?",
          options: [
            "The string has no stars.",
            "There are too many closing parentheses, making the string invalid even if every star were treated as an opening parenthesis.",
            "The string is valid.",
            "The string is empty."
          ],
          correct_index: 1,
          model_answer: "high represents the maximum possible open count (treating stars as '('). If high < 0, an unmatchable excess of ')' exists.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why must low be clamped to 0 using `low = Math.max(0, low)`?",
          model_answer: "Because we cannot have a negative count of open brackets. Treating a star as ')' when open count is 0 creates an invalid branch, so we clamp low to 0.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
