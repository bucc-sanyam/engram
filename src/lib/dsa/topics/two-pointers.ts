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
      body: `**Problem Statement**
Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring case.

*Example:*
\`\`\`
Input:  s = "A man, a plan, a canal: Panama"
Output: true
\`\`\`

---

**Building Intuition (Brute Force)**
The naive approach: build a cleaned string (lowercase, alphanumeric only), then check if it equals its reverse. Works, but costs O(n) extra space.

---

**Finding the Pattern / Two Pointers**
A palindrome is a claim about *mirrored positions*: first = last, second = second-to-last, etc.

\`\`\`
  L →                    ← R
  A  m  a  n  a  p  l  a  n  a  c  a  n  a  l  P  a  n  a  m  A
  ↕                                                            ↕
  a == a ✓ → move both inward
\`\`\`

When a pointer sits on a non-alphanumeric character, skip it. Only compare when both rest on real characters.

---

**Visualisation**
\`s = "race a car"\`:
\`\`\`
Step 1: L='r', R='r'  → match ✓, move inward
Step 2: L='a', R='a'  → match ✓, move inward
Step 3: L='c', R='c'  → match ✓, move inward
Step 4: L='e', R=' '  → skip R
Step 5: L='e', R='a'  → MISMATCH ✗ → return false
\`\`\`

---

**Code & Complexity**
\`\`\`python
def isPalindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True
\`\`\`

- **Time:** O(n) — each pointer moves only inward
- **Space:** O(1) — no cleaned copy needed`,
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
      body: `**Problem Statement**
Given a **1-indexed sorted** array and a target, find two numbers that add up to the target. Return their indices. Use O(1) extra space.

*Example:*
\`\`\`
Input:  numbers = [2, 7, 11, 15], target = 9
Output: [1, 2]     # numbers[1] + numbers[2] = 2 + 7 = 9
\`\`\`

---

**Building Intuition**
The hash map from Chapter 1's Two Sum works — but the problem demands O(1) space. The array is *sorted*, and we're not using that information. Sortedness is structure we can spend.

---

**Finding the Pattern / The Retirement Argument**
Place pointers at both ends. Check their sum:
\`\`\`
sum = nums[L] + nums[R]

If sum < target:  L can't work with ANYTHING (even the largest).
                  Retire L, move right. →

If sum > target:  R can't work with ANYTHING (even the smallest).
                  Retire R, move left. ←

If sum == target: Found it!
\`\`\`

Each step permanently eliminates one candidate. At most \`n\` steps.

---

**Visualisation**
\`nums = [1, 3, 4, 7, 11]\`, \`target = 10\`:
\`\`\`
Step 1: L=1, R=11 → sum=12 > 10 → retire R (11 is too big for everyone)
Step 2: L=1, R=7  → sum=8  < 10 → retire L (1 is too small for everyone)
Step 3: L=3, R=7  → sum=10 = 10 → FOUND ✓
\`\`\`

---

**Code & Complexity**
\`\`\`python
def twoSum(numbers: list[int], target: int) -> list[int]:
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s < target:
            l += 1
        elif s > target:
            r -= 1
        else:
            return [l + 1, r + 1]  # 1-indexed
\`\`\`

- **Time:** O(n)
- **Space:** O(1)`,
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
      body: `**Problem Statement**
Find all unique triplets in the array that sum to zero.

*Example:*
\`\`\`
Input:  nums = [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]
\`\`\`

---

**Building Intuition**
Three moving parts are two too many. Nail one down: fix element \`i\`, then find two elements to the right that sum to \`-nums[i]\`. That's Two Sum II!

---

**Finding the Pattern**
\`\`\`
Sort the array: [-4, -1, -1, 0, 1, 2]

For each i:
    target = -nums[i]
    Run Two Sum II on nums[i+1 ... n-1] with this target
\`\`\`

**Duplicate skipping** (where most candidates fail):
1. If \`nums[i] == nums[i-1]\`, skip \`i\` entirely (same triplets would be found)
2. After a hit, slide \`L\` past duplicates of its value before continuing

---

**Visualisation**
\`\`\`
Sorted: [-4, -1, -1, 0, 1, 2]

i=0 (val=-4): target=4, L=1, R=5
  -1+2=1 < 4, L++
  -1+2=1 < 4, L++
  0+2=2 < 4, L++
  1+2=3 < 4, L++  → no triplet found

i=1 (val=-1): target=1, L=2, R=5
  -1+2=1 ✓ → [-1,-1,2]  → skip duplicate L
  0+1=1 ✓  → [-1,0,1]

i=2 (val=-1): same as i=1 → SKIP (duplicate)
\`\`\`

---

**Code & Complexity**
\`\`\`python
def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue   # skip duplicate i
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                result.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l+1]: l += 1
                while l < r and nums[r] == nums[r-1]: r -= 1
                l += 1; r -= 1
    return result
\`\`\`

- **Time:** O(n²) — n fixed positions × linear two-pointer walk
- **Space:** O(1) beyond the output (sort is in-place)`,
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

---

**Building Intuition**
Brute force: try every pair → O(n²). But with two pointers at the ends, every inward step *shrinks the width*. The only hope of improvement is finding a taller minimum.

---

**Finding the Pattern / The Shorter-Wall Rule**
\`\`\`
area = (R - L) × min(height[L], height[R])
\`\`\`

If you move the **taller** wall inward:
- Width decreases ↓
- Min height can't increase (still pinned by the shorter wall) ↓
- Area provably decreases or stays same → **wasted move**

Therefore: **always move the shorter wall.** It's the only move with upside.

---

**Visualisation**
\`\`\`
Heights: [1, 8, 6, 2, 5, 4, 8, 3, 7]
          L                          R

Step 1: h[L]=1, h[R]=7 → area = 8×1 = 8
        L is shorter → move L
Step 2: h[L]=8, h[R]=7 → area = 7×7 = 49 ★
        R is shorter → move R
Step 3: h[L]=8, h[R]=3 → area = 6×3 = 18
        ...continues, never beats 49
\`\`\`

---

**Code & Complexity**
\`\`\`python
def maxArea(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    best = 0
    while l < r:
        area = (r - l) * min(height[l], height[r])
        best = max(best, area)
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return best
\`\`\`

- **Time:** O(n)
- **Space:** O(1)`,
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
      body: `**Problem Statement**
Given an elevation map, compute how much water is trapped after raining.

*Example:*
\`\`\`
Input:  height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
Output: 6
\`\`\`

---

**Building Intuition**
Stand on one bar. The water above you depends on exactly two things:
1. The tallest wall anywhere to your **left** (\`maxLeft\`)
2. The tallest wall anywhere to your **right** (\`maxRight\`)

Water rises to the lower of the two walls, minus your own height:
\`\`\`
water[i] = max(0, min(maxLeft[i], maxRight[i]) - height[i])
\`\`\`

---

**Approach 1: Prefix Arrays (O(n) space)**
Precompute \`maxLeft[]\` in a forward sweep and \`maxRight[]\` in a backward sweep, then sum the formula.

---

**Approach 2: Two Pointers (O(1) space)**
Walk pointers inward from both ends, carrying running \`maxLeft\` and \`maxRight\`.

Key insight: if \`maxLeft < maxRight\`, then the left pointer's water is bounded by \`maxLeft\` (whatever taller walls the right side hides can only raise the right barrier, which isn't the binding one). So we can settle the left position *now*.

\`\`\`
L →                                          ← R
maxLeft: tracks tallest seen from left
maxRight: tracks tallest seen from right

Whichever side has the smaller max → process that side
\`\`\`

---

**Visualisation**
\`height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]\`:
\`\`\`
Elevation:    _
           _ |#|_   _
          |#||#||#| |#|_
     _   _|#||#||#|_|#||#|
     0 1 0 2 1 0 1 3 2 1 2 1

Water fills:
             +---+
           +W|   |W+   +W+
           |W|   |W|W+W|W|+
     +W+W+W|W|   |W|W|W|W||
     0 1 0 2 1 0 1 3 2 1 2 1

Water units: 0+0+1+0+1+2+1+0+0+1+0+0 = 6
\`\`\`

---

**Code & Complexity**
\`\`\`python
def trap(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    max_left, max_right = height[l], height[r]
    water = 0
    while l < r:
        if max_left <= max_right:
            l += 1
            max_left = max(max_left, height[l])
            water += max_left - height[l]
        else:
            r -= 1
            max_right = max(max_right, height[r])
            water += max_right - height[r]
    return water
\`\`\`

| Approach | Time | Space |
|---|---|---|
| Brute force (per bar) | O(n²) | O(1) |
| Prefix arrays | O(n) | O(n) |
| **Two pointers** | **O(n)** | **O(1)** |`,
    },
  ],
};
