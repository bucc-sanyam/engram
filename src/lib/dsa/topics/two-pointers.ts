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
  intro: `Chapter one taught you to buy speed with memory. This chapter teaches the counter-move: sometimes you do not need to buy anything, because the data already carries structure you can spend instead. Usually that structure is *sortedness* — and the tool for spending it is two indexes, walking toward each other.

The core argument: put one pointer at each end of a sorted array. If their sum is too small, advance the left pointer (moving right can only grow it). If too big, the mirror applies. Every comparison retires one candidate, and a quadratic universe of pairs collapses into a single linear pass.

The five problems build from simple mirroring (Valid Palindrome) to the full exploit: Two Sum II, 3Sum, Container With Most Water, and the boss fight — Trapping Rain Water.`,
  problems: [
    {
      slug: "valid-palindrome",
      title: "Valid Palindrome",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/is-palindrome",
      summary: "Two mirrored pointers meeting in the middle — the gentlest introduction to the pattern.",
      body: `**The problem.** Given a string, return \`true\` if it reads the same forwards and backwards after dropping every non-alphanumeric character and ignoring case. \`"A man, a plan, a canal: Panama"\` → \`true\`, \`"race a car"\` → \`false\`.
**The signal.** The interviewer wants you to compare from *both ends* without building a cleaned-up copy of the string. Recognising that a palindrome check is inherently a **converging scan** — not a reverse-and-compare — is the whole test here.

**Beginner Intuition & The Naive Fallacy.** Beginners usually solve this by filtering out non-alphanumeric characters, converting to lowercase, and reversing the string to check \`s_clean == reverse(s_clean)\`.
*Why this shatters*: Creating a new filtered string and a reversed string requires $O(N)$ extra memory allocation. On embedded systems or high-performance APIs processing millions of strings, allocating temporary copies causes garbage collection churn.

**The Structural Invariant.** A palindrome possesses **mirror symmetry**: character at index $i$ must match character at index $(N - 1 - i)$.
- *In-Place Convergence*: Place \`left\` at index 0 and \`right\` at index $N-1$.
- *Skip Rule*: If \`left\` points to non-alphanumeric, increment \`left\`. If \`right\` points to non-alphanumeric, decrement \`right\`.
- *Match Check*: Convert to lowercase and compare. If mismatch, return \`false\` instantly.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["r", "a", "c", "e", " ", "a", " ", "c", "a", "r"], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "R=9", "index": 9 }], "note": "L='r', R='r' -> match! Advance L to 1, decrement R to 8." },
    { "cells": ["r", "a", "c", "e", " ", "a", " ", "c", "a", "r"], "pointers": [{ "label": "L=3", "index": 3 }, { "label": "R=6", "index": 6 }], "note": "L='e', R=' ' -> R is non-alphanumeric. Skip R inward without comparing." },
    { "cells": ["r", "a", "c", "e", " ", "a", " ", "c", "a", "r"], "pointers": [{ "label": "L=3", "index": 3 }, { "label": "R=5", "index": 5 }], "highlight": [3, 5], "note": "L='e', R='a' -> Mismatch ('e' != 'a')! Return false." }
  ],
  "caption": "Valid Palindrome — In-place two-pointer convergence with O(1) auxiliary space."
}
\`\`\`

**The optimal solution (converging pointers).**

\`\`\`python
def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():   # skip junk from the left
            l += 1
        while l < r and not s[r].isalnum():   # skip junk from the right
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True
\`\`\`

**Complexity — in-place comparison avoids the extra copy.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Filter + reverse + compare", "time": "O(N)", "space": "O(N)", "note": "Allocates a cleaned copy and its reverse — GC churn at scale." },
    { "approach": "Two converging pointers", "time": "O(N)", "space": "O(1)", "note": "Compares in place, skipping non-alphanumerics. Interview-optimal.", "best": true }
  ],
  "caption": "N = string length. Same linear time, but the two-pointer scan never allocates a second string."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty or Space-Only String*: \`s = " "\` should skip all characters, causing \`left >= right\` to terminate and return \`true\`.
- *Loop Condition*: Always use \`while (left < right)\` to avoid comparing a middle character with itself.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is the two-pointer approach superior to string reversal for Valid Palindrome?",
          options: [
            "Because string reversal requires O(N^2) time.",
            "Because two pointers achieve O(1) auxiliary space by comparing characters in-place without allocating temporary strings.",
            "Because string reversal only works on numbers.",
            "Because two pointers convert ASCII to UTF-8 automatically."
          ],
          correct_index: 1,
          model_answer: "Two pointers check characters in-place, eliminating the O(N) space memory allocation required by string reversal.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What happens if we forget the inner loop check `left < right` when skipping non-alphanumeric characters?",
          model_answer: "If a string contains only spaces (e.g., \"   \"), `left` will increment past `right` and out-of-bounds, causing index out-of-bounds runtime exceptions.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "two-sum-ii",
      title: "Two Sum II (Sorted Array)",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/two-integer-sum-ii",
      summary: "The chapter's thesis: sortedness lets each comparison retire a candidate forever.",
      body: `**The problem.** Given a **sorted** array and a target, return the 1-based indices of the two numbers that add up to it. Exactly one solution exists, and you must use only O(1) extra space. \`numbers = [2,7,11,15], target = 9\` → \`[1, 2]\`.
**The signal.** The word *sorted* combined with the O(1)-space rule is a neon arrow pointing at two pointers. If you reach for a hash map here, you have thrown away the very structure the problem handed you.

**Beginner Intuition & The Naive Fallacy.** In Chapter 1, we solved Two Sum using a Hash Map in $O(N)$ time and $O(N)$ space. Beginners often re-use the Hash Map here.
*Why this shatters*: Two Sum II explicitly specifies that the array is **sorted** and requires **$O(1)$ extra space**! Using a Hash Map ignores the sorted structure and fails the space constraint.

**The Structural Invariant & Candidate Retirement.**
Place \`L = 0\` and \`R = N - 1\`. Calculate \`sum = nums[L] + nums[R]\`.
- *If \`sum > target\`*: Because the array is sorted, \`nums[R]\` is the largest remaining element. Even when paired with the smallest available element (\`nums[L]\`), the sum exceeds target. Therefore, \`nums[R]\` can NEVER be part of the solution with any element! We safely **retire R** by decrementing \`R--\`.
- *If \`sum < target\`*: Similarly, \`nums[L]\` is too small to pair with anything. We safely **retire L** by incrementing \`L++\`.
- *If \`sum == target\`*: Return 1-based indices \`[L + 1, R + 1]\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 3, 4, 7, 11], "pointers": [{ "label": "L=0 (val=1)", "index": 0 }, { "label": "R=4 (val=11)", "index": 4 }], "note": "Target = 10. sum = 1 + 11 = 12 > 10. 11 is too big for anyone $\rightarrow$ Retire R (R=3)." },
    { "cells": [1, 3, 4, 7, 11], "pointers": [{ "label": "L=0 (val=1)", "index": 0 }, { "label": "R=3 (val=7)", "index": 3 }], "note": "sum = 1 + 7 = 8 < 10. 1 is too small for anyone $\rightarrow$ Retire L (L=1)." },
    { "cells": [1, 3, 4, 7, 11], "pointers": [{ "label": "L=1 (val=3)", "index": 1 }, { "label": "R=3 (val=7)", "index": 3 }], "highlight": [1, 3], "note": "sum = 3 + 7 = 10 == target! Found match. Return 1-indexed [2, 4]." }
  ],
  "caption": "Two Sum II — Every step permanently eliminates one element, finding the target in O(N) time & O(1) space."
}
\`\`\`

**The optimal solution (retire from the ends).**

\`\`\`python
def two_sum(numbers, target):
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l + 1, r + 1]     # 1-indexed answer
        if s < target:
            l += 1                    # too small → grow the sum
        else:
            r -= 1                    # too big → shrink the sum
\`\`\`

**Complexity — sortedness buys away the hash map.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Brute force (all pairs)", "time": "O(N²)", "space": "O(1)", "note": "Ignores the sorted order entirely." },
    { "approach": "Hash map complement", "time": "O(N)", "space": "O(N)", "note": "Fast, but violates the O(1)-space requirement." },
    { "approach": "Two pointers from the ends", "time": "O(N)", "space": "O(1)", "note": "Each comparison retires one element for good. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of elements. The sorted invariant lets one comparison eliminate a candidate permanently."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *1-Indexed Result*: Problem requires returning 1-based indices (\`[L+1, R+1]\`), not 0-based!
- *Strictly One Solution*: The problem guarantees exactly one solution, so \`L\` and \`R\` will always find the target before cross-over.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does sum > target justify decrementing the right pointer (R--) in Two Sum II?",
          options: [
            "Because decrementing R increases the sum.",
            "Because the array is sorted, nums[R] is the largest current element; if pairing it with the smallest element (nums[L]) still exceeds target, nums[R] can never form a valid pair.",
            "Because it resets the left pointer back to 0.",
            "Because R is always an even index."
          ],
          correct_index: 1,
          model_answer: "Since the array is sorted, nums[R] + nums[L] is the minimum possible sum involving nums[R]. If this minimum sum is too large, nums[R] cannot participate in any valid solution.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the key advantage of Two Sum II over the standard Two Sum problem?",
          model_answer: "Standard Two Sum requires O(N) hash map memory. Two Sum II uses the sorted invariant to achieve O(N) linear time using only O(1) auxiliary memory.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "3sum",
      title: "3Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/three-integer-sum",
      summary: "Fix one number and the rest is Two Sum II — plus the art of skipping duplicates.",
      body: `**The problem.** Return every **unique** triplet \`[a, b, c]\` in the array with \`a + b + c = 0\`. Order within a triplet does not matter, and no triplet may repeat. \`[-1,0,1,2,-1,-4]\` → \`[[-1,-1,2], [-1,0,1]]\`.
**The signal.** "Find k numbers that sum to a target" with k = 3 is the canonical *fix-one, two-pointer-the-rest* pattern. The interviewer is testing whether you can reduce a new problem to one you already solved (Two Sum II) and then handle duplicates without a hash set.

**Beginner Intuition & The Naive Fallacy.** Beginners use three nested loops $O(N^3)$ to test all triplets, inserting results into a Hash Set of sorted tuples to eliminate duplicates.
*Why this shatters*: $O(N^3)$ time TLEs on $N = 3,000$ ($27$ billion operations!). Hash set tuple deduplication adds heavy overhead.

**The Structural Invariant: Fix One + Two Sum II.**
1. **Sort the array** first ($O(N \log N)$).
2. Iterate through the array with index $i$, fixing \`nums[i]\` as the first number.
3. The remaining two numbers must sum to \`target = -nums[i]\`. This is reduced to **Two Sum II** on the sub-array \`nums[i+1 ... N-1]\`.
4. **Duplicate Prevention Rules**:
   - *Outer Loop Skip*: If $i > 0$ and \`nums[i] == nums[i-1]\`, skip $i$! (We already explored all triplets starting with this value).
   - *Inner Loop Skip*: When a valid triplet is found (\`nums[i] + nums[L] + nums[R] == 0\`), advance \`L\` past all duplicate values (\`while (nums[L] == nums[L+1]) L++\`) before continuing.

\`\`\`viz:array
{
  "frames": [
    { "cells": [-4, -1, -1, 0, 1, 2], "pointers": [{ "label": "i=1 (-1)", "index": 1 }, { "label": "L=2 (-1)", "index": 2 }, { "label": "R=5 (2)", "index": 5 }], "note": "Fix i=1 (val=-1). Two Sum target = 1. L=2 (-1), R=5 (2). Sum = -1 + 2 = 1. Match! Triplet [-1, -1, 2]." },
    { "cells": [-4, -1, -1, 0, 1, 2], "pointers": [{ "label": "i=1 (-1)", "index": 1 }, { "label": "L=3 (0)", "index": 3 }, { "label": "R=4 (1)", "index": 4 }], "highlight": [1, 3, 4], "note": "Skip duplicate L=-1. L moves to 3 (0), R moves to 4 (1). Sum = 0 + 1 = 1. Match! Triplet [-1, 0, 1]." },
    { "cells": [-4, -1, -1, 0, 1, 2], "pointers": [{ "label": "i=2 (-1)", "index": 2 }], "note": "i=2 (val=-1) == nums[i-1] (-1) $\rightarrow$ SKIP duplicate outer loop value!" }
  ],
  "caption": "3Sum — Sorting + Fixing 1 element + Two Sum II with duplicate skipping in O(N^2) time."
}
\`\`\`

**The optimal solution (sort, fix one, two-pointer the rest).**

\`\`\`python
def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums)):
        if nums[i] > 0:                          # smallest is positive → done
            break
        if i > 0 and nums[i] == nums[i - 1]:     # skip duplicate anchor
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            total = nums[i] + nums[l] + nums[r]
            if total < 0:
                l += 1
            elif total > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                l += 1
                r -= 1
                while l < r and nums[l] == nums[l - 1]:   # skip duplicate lefts
                    l += 1
    return res
\`\`\`

**Complexity — sorting is cheaper than the triple loop.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Brute force (3 nested loops)", "time": "O(N³)", "space": "O(N)", "note": "TLEs at N=3,000; hash-set dedup adds overhead." },
    { "approach": "Sort + hash set per anchor", "time": "O(N²)", "space": "O(N)", "note": "Right time class, but stores a set to dedup." },
    { "approach": "Sort + fix one + two pointers", "time": "O(N²)", "space": "O(1)", "note": "Duplicates skipped by scanning past equals. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of elements. The O(N log N) sort is dominated by the O(N²) two-pointer sweep. Space excludes the output list."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Positive First Element*: Since the array is sorted, if \`nums[i] > 0\`, we can break the loop immediately! Three positive numbers can never sum to zero.
- *Outer Duplicate Check*: Must be \`i > 0 && nums[i] == nums[i-1]\` (comparing with previous), NOT \`nums[i] == nums[i+1]\` (which would skip identical numbers needed within the same triplet, like \`[-1, -1, 2]\`).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why do we skip nums[i] if i > 0 and nums[i] == nums[i-1] in 3Sum?",
          options: [
            "To prevent endless infinite loops.",
            "Because all unique triplets starting with that number were already explored during the previous iteration.",
            "Because 3Sum only allows positive numbers.",
            "To reduce array size by half."
          ],
          correct_index: 1,
          model_answer: "Since the array is sorted, identical consecutive values will search the exact same remaining search space, generating duplicate triplets.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why can we break the outer loop early if nums[i] > 0 in 3Sum (target = 0)?",
          model_answer: "Because the array is sorted. If the smallest of the three numbers (nums[i]) is greater than 0, any remaining numbers to its right are also > 0. Three positive numbers can never sum to 0.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "container-with-most-water",
      title: "Container With Most Water",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/max-water-container",
      summary: "Always move the shorter wall — the greedy rule that provably never discards the best.",
      body: `**The problem.** Each array value is the height of a vertical line on the x-axis. Pick two lines that, together with the axis, hold the most water. The area between lines \`L\` and \`R\` is \`(R - L) × min(height[L], height[R])\`. \`[1,8,6,2,5,4,8,3,7]\` → \`49\`.
**The signal.** The O(N²) "try every pair" is obvious, so the interviewer is watching for the **greedy** insight: which pointer is *safe* to move — and, ideally, a short proof that moving the taller wall can never improve the answer.

**Beginner Intuition & The Naive Fallacy.** Beginners calculate the water area for all possible pairs of vertical lines using nested loops in $O(N^2)$ time.
*Why this shatters*:
$$\text{Area} = (\text{R} - \text{L}) \times \\min(\text{height}[\text{L}], \text{height}[\text{R}])$$
Moving pointers inward **always decreases the width** $(R - L)$. Beginners struggle to see how moving pointers inward could ever *increase* the total area.

**The Structural Invariant: The Shorter-Wall Greedy Rule.**
Place \`L = 0\` and \`R = N - 1\` (maximizing initial width).
- *Crucial Proof*: The container height is bottlenecked by the **shorter wall**: $\\min(h[L], h[R])$.
- If we move the **taller wall** inward:
  - Width $(R - L)$ strictly decreases.
  - The new height is still capped by the shorter wall (or something even shorter).
  - Therefore, moving the taller wall **can NEVER increase the area**!
- *Conclusion*: **Always move the pointer at the SHORTER wall inward.** It is the ONLY move that holds any possibility of finding a taller wall to offset the reduced width!

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 8, 6, 2, 5, 4, 8, 3, 7], "pointers": [{ "label": "L=0 (h=1)", "index": 0 }, { "label": "R=8 (h=7)", "index": 8 }], "note": "h[L]=1, h[R]=7 -> Area = (8-0) * min(1,7) = 8. L is shorter -> Move L to 1." },
    { "cells": [1, 8, 6, 2, 5, 4, 8, 3, 7], "pointers": [{ "label": "L=1 (h=8)", "index": 1 }, { "label": "R=8 (h=7)", "index": 8 }], "highlight": [1, 8], "note": "h[L]=8, h[R]=7 -> Area = (8-1) * min(8,7) = 49 (Max Area!). R is shorter -> Move R to 7." },
    { "cells": [1, 8, 6, 2, 5, 4, 8, 3, 7], "pointers": [{ "label": "L=1 (h=8)", "index": 1 }, { "label": "R=7 (h=3)", "index": 7 }], "note": "h[L]=8, h[R]=3 -> Area = (7-1) * min(8,3) = 18. Move R." }
  ],
  "caption": "Container With Most Water — Greedily moving the shorter wall achieves O(N) time complexity."
}
\`\`\`

**The optimal solution (move the shorter wall).**

\`\`\`python
def max_area(height):
    l, r = 0, len(height) - 1
    best = 0
    while l < r:
        best = max(best, (r - l) * min(height[l], height[r]))
        if height[l] < height[r]:
            l += 1                    # the shorter wall is the only hopeful move
        else:
            r -= 1
    return best
\`\`\`

**Complexity — one pass replaces every-pair enumeration.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Brute force (all pairs)", "time": "O(N²)", "space": "O(1)", "note": "Recomputes area for every pair of lines." },
    { "approach": "Two pointers, move shorter wall", "time": "O(N)", "space": "O(1)", "note": "Each step retires the wall that can never do better. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of lines. Moving the shorter wall is the only move that could ever increase the area."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Equal Heights*: If \`height[L] == height[R]\`, moving either pointer (or both) is fine because neither can bound a larger area with the current opposite wall.`,
      questions: [
        {
          kind: "open",
          prompt: "Mathematical Proof: Why does moving the taller wall inward guaranteed NEVER to yield a larger area than the current state?",
          model_answer: "Area = width * min(h_left, h_right). Moving the taller wall reduces width from W to W - 1. The new min height is bounded by min(h_shorter, h_new_taller) <= h_shorter. Since width decreased and height cannot increase, area is strictly smaller or equal.",
          difficulty: "advanced"
        },
        {
          kind: "mcq",
          prompt: "What is the time and space complexity of the optimal Container With Most Water algorithm?",
          options: [
            "O(N log N) time and O(1) space.",
            "O(N) time and O(1) space.",
            "O(N^2) time and O(N) space.",
            "O(N) time and O(N) space."
          ],
          correct_index: 1,
          model_answer: "Each step moves one pointer inward, visiting each element at most once in O(N) time with O(1) auxiliary variables.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "trapping-rain-water",
      title: "Trapping Rain Water",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/trapping-rain-water",
      summary: "Water above each bar = min(maxLeft, maxRight) − height. Two pointers compute it in one pass.",
      body: `**The problem.** Given an elevation map where each value is a bar's height, compute how much rainwater is trapped between the bars after it rains. \`[0,1,0,2,1,0,1,3,2,1,2,1]\` → \`6\`.
**The signal.** This is a famous "hard," but it collapses the instant you see that the water sitting above bar \`i\` is \`min(maxLeft, maxRight) − height[i]\`. The interviewer wants that per-bar reformulation first, then the space optimisation from prefix arrays down to two running maxes.

**Beginner Intuition & The Naive Fallacy.** Beginners try to calculate water by scanning left and right for every single bar $i$ to find the tallest left wall \`maxL\` and tallest right wall \`maxR\`.
*Why this shatters*: For bar $i$, water trapped is:
$$\text{water}[i] = \\max(0, \\min(\text{maxL}[i], \text{maxR}[i]) - \text{height}[i])$$
Rescanning left and right from every bar takes $O(N^2)$ time!

**The Structural Invariant: The Binding Wall Principle.**
Precomputing \`leftMax[]\` and \`rightMax[]\` prefix arrays takes $O(N)$ time and $O(N)$ space.
*How Two Pointers achieve $O(1)$ space*:
- Maintain running scalars \`maxL\` and \`maxR\`.
- *The Key Insight*: Water trapped at bar $i$ is determined by the **smaller** of \`maxL\` and \`maxR\`.
- If \`maxL < maxR\`: The left side is the **bottleneck**. Whatever taller walls exist far to the right do NOT matter because \`maxL\` caps the water height! We can process \`height[L]\` immediately and move \`L++\`.
- If \`maxR <= maxL\`: The right side is the bottleneck. Process \`height[R]\` immediately and move \`R--\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "R=11", "index": 11 }], "note": "maxL=0, maxR=1. maxL <= maxR -> Process L=0: water += max(0, 0-0)=0. L=1, maxL=1." },
    { "cells": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], "pointers": [{ "label": "L=2 (h=0)", "index": 2 }, { "label": "R=11 (h=1)", "index": 11 }], "highlight": [2], "note": "maxL=1, maxR=1. maxL <= maxR -> Process L=2: water += maxL - h[2] = 1 - 0 = 1 unit! L=3." },
    { "cells": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], "pointers": [{ "label": "L=7 (h=3)", "index": 7 }, { "label": "R=10 (h=2)", "index": 10 }], "note": "maxL=3, maxR=2. maxR < maxL -> Control shifts to R! Process R=10: water += 2 - 2 = 0." }
  ],
  "caption": "Trapping Rain Water — Process the smaller running max side in O(N) time & O(1) space."
}
\`\`\`

**The optimal solution (two running maxes).**

\`\`\`python
def trap(height):
    if not height:
        return 0
    l, r = 0, len(height) - 1
    max_l, max_r = height[l], height[r]
    water = 0
    while l < r:
        if max_l < max_r:                 # left side is the bottleneck
            l += 1
            max_l = max(max_l, height[l])
            water += max_l - height[l]
        else:                             # right side is the bottleneck
            r -= 1
            max_r = max(max_r, height[r])
            water += max_r - height[r]
    return water
\`\`\`

**Complexity — running maxes drop the prefix arrays.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Rescan left/right per bar", "time": "O(N²)", "space": "O(1)", "note": "Finds maxL/maxR from scratch for every bar." },
    { "approach": "Prefix leftMax + rightMax arrays", "time": "O(N)", "space": "O(N)", "note": "Precompute both walls; clearest to reason about." },
    { "approach": "Two pointers, running maxes", "time": "O(N)", "space": "O(1)", "note": "Smaller running max is the binding wall. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of bars. Knowing which running max is smaller is enough to fix the water level at that pointer."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Updating Max Before Adding Water*: Always update \`maxL = max(maxL, height[L])\` **before** computing \`water += maxL - height[L]\` to avoid negative water addition!
- *Flat & Monotonic Terrain*: Inputs like \`[1, 2, 3, 4]\` or \`[4, 4, 4]\` naturally yield \`0\` trapped water.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Trapping Rain Water, why can we safely process the left pointer when maxL < maxR without knowing the exact max wall to the right of L?",
          options: [
            "Because right walls are always shorter than left walls.",
            "Because water depth is bounded by min(maxL, maxR). Since maxL < maxR, maxL is guaranteed to be the limiting bottleneck regardless of any even taller walls further right.",
            "Because we sort the elevation map first.",
            "Because water doesn't accumulate on the left side."
          ],
          correct_index: 1,
          model_answer: "The trapped water formula relies on min(maxL, maxR). Knowing maxL < maxR guarantees maxL is the binding constraint, making further right details irrelevant for bar L.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "Compare the Prefix Array approach vs Two Pointer approach for Trapping Rain Water.",
          model_answer: "Both take O(N) time. The Prefix Array approach uses two auxiliary arrays (O(N) space) to store left/right maximums. The Two Pointer approach maintains running max scalars to achieve O(1) space.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
