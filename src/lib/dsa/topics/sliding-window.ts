import type { DsaTopic } from "../types";

/** Chapter 3 — Sliding Window: two pointers, same direction, living state between them. */
export const slidingWindow: DsaTopic = {
  slug: "sliding-window",
  title: "Sliding Window",
  chapter: 3,
  tagline: "A stretch of the array that grows, shrinks, and never looks at anything twice.",
  color: "#ff7a5c",
  prereqs: ["two-pointers"],
  unlocks: [],
  intro: `Take the two pointers from last chapter and change one thing: instead of converging from opposite ends, both now march *rightward*, with the right pointer leading and the left one following. The stretch between them is the window — a candidate answer that is alive, growing when the right edge eats a new element and shrinking when the left edge lets one go.

Why does this deserve its own chapter? Because of what it kills. An enormous family of problems asks about "the best contiguous run": the longest substring with some property, the smallest subarray covering some requirement, the maximum over every k-length stretch. Brute force re-examines every one of the O(n²) ranges from scratch. The window's discipline is *incremental maintenance*: when the window moves one step, you do not recompute its contents — you update a small summary (a count map, a max frequency, a deque) by exactly the one element that entered and the one that left. Every element enters the window once and leaves at most once, and O(n²) collapses to O(n). That amortised argument is this chapter's version of "retire a candidate forever," and interviewers will ask you to say it aloud.`,
  problems: [
    {
      slug: "best-time-to-buy-and-sell-stock",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/buy-and-sell-crypto",
      summary: "One pass, one running minimum: the lightest state a window can carry.",
      body: `**The problem.** Given daily prices, buy on one day and sell on a *later* day to maximise profit; return \`0\` if no profitable trade exists. \`[7,1,5,3,6,4]\` → \`5\` (buy at 1, sell at 6).
**The signal.** "Best over all (buy, sell) pairs with buy before sell" screams $O(N^2)$ — but the interviewer wants you to see that for any sell day the only thing that matters is the *cheapest price so far*, which collapses it to one pass.

**Beginner Intuition & The Naive Fallacy.** Beginners try to calculate profit for every pair of (buy_day, sell_day) where \`sell_day > buy_day\` using two nested loops.
*Why this shatters*: For $N = 100,000$ days, two nested loops require 5 billion comparisons ($O(N^2)$ time). The key realization is: if you decide to sell on day $i$, the best buy price is simply the **lowest price seen anywhere before day $i$**.

**The Structural Invariant & Running Minimum.**
- Maintain a single scalar \`min_price\` initialized to $\\infty$, and \`max_profit\` initialized to $0$.
- As you sweep rightward through prices:
  - Update \`min_price = min(min_price, current_price)\`.
  - Calculate potential profit: \`current_price - min_price\`.
  - Update \`max_profit = max(max_profit, current_price - min_price)\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min=7", "index": 0 }], "note": "Day 0: Price=7. min_price=7, max_profit=0." },
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min=1", "index": 1 }], "note": "Day 1: Price=1 < 7. Update min_price=1." },
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min=1", "index": 2 }], "highlight": [1, 2], "note": "Day 2: Price=5. Profit = 5 - 1 = 4. Update max_profit=4." },
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min=1", "index": 4 }], "highlight": [1, 4], "note": "Day 4: Price=6. Profit = 6 - 1 = 5. Update max_profit=5 (Max Profit Found!)." }
  ],
  "caption": "Best Time to Buy and Sell Stock — Track running minimum price to achieve O(N) single-pass execution."
}
\`\`\`

**The optimal solution (running minimum).**

\`\`\`python
def max_profit(prices):
    min_price = float('inf')
    best = 0
    for p in prices:
        min_price = min(min_price, p)     # cheapest buy so far
        best = max(best, p - min_price)   # best sell if we sell today
    return best
\`\`\`

**Complexity — one scalar erases the inner loop.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Brute force (all buy/sell pairs)", "time": "O(N²)", "space": "O(1)", "note": "Re-checks every earlier day for each sell day." },
    { "approach": "Running minimum, single pass", "time": "O(N)", "space": "O(1)", "note": "Cheapest-so-far is all a sell day needs. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of days. Sweeping left-to-right keeps the buy strictly before the sell for free."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Monotonically Decreasing Prices*: Inputs like \`[7, 6, 4, 3, 1]\` yield no profitable sales $\\rightarrow$ algorithm safely returns \`0\`.
- *Buy-Before-Sell Guarantee*: Because \`min_price\` is updated before or during the pass, you can never accidentally sell before buying!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does keeping a running min_price guarantee we never sell before buying?",
          options: [
            "Because the array is sorted in ascending order.",
            "Because as we iterate left-to-right, min_price only reflects prices at or before the current selling index.",
            "Because max_profit is always initialized to negative infinity.",
            "Because we use two pointers starting at opposite ends."
          ],
          correct_index: 1,
          model_answer: "Iterating left-to-right ensures that min_price only incorporates historical prices up to the current day, enforcing chronological order.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the space complexity of Best Time to Buy and Sell Stock?",
          model_answer: "O(1) auxiliary space because we only maintain two scalar variables (`min_price` and `max_profit`).",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "longest-substring-without-repeating-characters",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-substring-without-duplicates",
      summary: "The canonical elastic window: expand right, evict from the left until the duplicate is gone.",
      body: `**The problem.** Return the length of the longest substring of \`s\` with no repeated characters. \`"abcabcbb"\` → \`3\` (\`"abc"\`), \`"bbbbb"\` → \`1\`.
**The signal.** "Longest contiguous run with a property" is the sliding-window tell. The interviewer wants an elastic window that expands right and evicts from the left only when a duplicate appears — never re-scanning a range.

**Beginner Intuition & The Naive Fallacy.** Beginners generate all $O(N^2)$ substrings and check each for unique characters using a set ($O(N)$), yielding an $O(N^3)$ algorithm.
*Why this shatters*: For $N = 10,000$, $N^3$ is 1 trillion operations! The fundamental insight is that if substring \`s[L...R]\` has a duplicate character, extending it to \`s[L...R+1]\` will still contain duplicates!

**The Structural Invariant: Elastic Window Expansion & Eviction.**
Maintain a window \`s[L...R]\` and a Hash Set storing characters inside the window.
- **Expand Right (\`R\`)**: Add \`s[R]\` to the set.
- **Validity Violation**: If \`s[R]\` is ALREADY in the set:
  - Shrink window from the **Left (\`L\`)**: Remove \`s[L]\` from set and increment \`L++\` **until the duplicate \`s[R]\` is evicted**.
- **Update Max**: \`max_len = max(max_len, R - L + 1)\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["a", "b", "c", "a", "b", "c", "b", "b"], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "R=2", "index": 2 }], "highlight": [0, 1, 2], "note": "Window [a, b, c] valid (set={a,b,c}). Length = 3." },
    { "cells": ["a", "b", "c", "a", "b", "c", "b", "b"], "pointers": [{ "label": "L=1", "index": 1 }, { "label": "R=3", "index": 3 }], "highlight": [1, 2, 3], "note": "R=3 ('a') causes duplicate! Evict s[0] ('a'). Window becomes [b, c, a]. Length = 3." },
    { "cells": ["a", "b", "c", "a", "b", "c", "b", "b"], "pointers": [{ "label": "L=5", "index": 5 }, { "label": "R=6", "index": 6 }], "highlight": [5, 6], "note": "R=6 ('b') duplicate! Evict s[3] ('a'), s[4] ('b'). Window becomes [c, b]. Length = 2." }
  ],
  "caption": "Longest Substring Without Repeating Characters — Amortized O(N) time (each char enters/leaves once)."
}
\`\`\`

**The optimal solution (last-seen jump).**

\`\`\`python
def length_of_longest_substring(s):
    last = {}                        # char -> last index seen
    l = 0
    best = 0
    for r, ch in enumerate(s):
        if ch in last and last[ch] >= l:
            l = last[ch] + 1         # jump L past the duplicate
        last[ch] = r
        best = max(best, r - l + 1)
    return best
\`\`\`

**Complexity — each character is visited a constant number of times.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "All substrings + uniqueness check", "time": "O(N³)", "space": "O(N)", "note": "Rebuilds and rechecks every substring." },
    { "approach": "Elastic window + set (step L)", "time": "O(N)", "space": "O(min(N, Σ))", "note": "L walks forward one char at a time." },
    { "approach": "Window + last-seen index jump", "time": "O(N)", "space": "O(min(N, Σ))", "note": "L leaps straight past the duplicate. Interview-optimal.", "best": true }
  ],
  "caption": "N = length of s, Σ = alphabet size. Both pointers only move forward, so the scan is linear."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Amortized $O(N)$ Time Proof*: Each character is added to the set by \`R\` once, and removed by \`L\` at most once. Total operations across the entire loop are bounded by $2N = O(N)$.
- *Index Jump Optimization*: Instead of stepping \`L\` one by one, store a map of \`{ char: last_seen_index }\`. When duplicate \`ch\` is hit, jump \`L = max(L, last_seen[ch] + 1)\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is the inner while-loop for shrinking the left pointer (L) guaranteed to run in overall O(N) time?",
          options: [
            "Because L skips 10 elements at a time.",
            "Because L moves strictly rightward and can only advance at most N times across the entire algorithm execution.",
            "Because the Hash Set sorts elements automatically.",
            "Because R stays stationary."
          ],
          correct_index: 1,
          model_answer: "Since L never moves backward and stops at N, the total number of L increments across all outer loop steps combined is at most N.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "When using the Map last-seen-index jump optimization `L = max(L, map[ch] + 1)`, why is the `max()` necessary?",
          model_answer: "Because the stored index for `ch` might belong to an earlier duplicate that lies *outside* (to the left of) the current active window. Using `max()` prevents moving `L` backward.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "longest-repeating-character-replacement",
      title: "Longest Repeating Character Replacement",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-repeating-substring-with-replacement",
      summary: "Window valid while size − max frequency ≤ k — plus the ratchet trick that never lowers the max.",
      body: `**The problem.** You may replace up to \`k\` characters of \`s\` with any uppercase letter. Return the length of the longest substring that can become a single repeated character. \`s = "AABABBA", k = 1\` → \`4\`.
**The signal.** A window is valid while \`(window length − count of its most frequent char) ≤ k\`. Spotting that "everything except the majority character must be replaced" is exactly what the interviewer is probing for.

**Beginner Intuition & The Naive Fallacy.** Beginners think they need to test replacing every character with every other letter of the alphabet across all substrings ($O(26 \\cdot N^2)$).
*Why this shatters*: To make a window \`s[L...R]\` consist of identical characters using at most $K$ replacements, we should **keep the most frequent character** in the window and replace all other characters!

**The Structural Invariant & The Validity Equation.**
- Window length = $(R - L + 1)$.
- Number of character replacements needed = $\\text{Window Length} - \\text{max\_frequency\_in\_window}$.
- **Validity Condition**:
  $$\\text{Window Length} - \\text{max\_frequency} \\le K$$
- If valid: Expand \`R++\`.
- If invalid: Shrink \`L++\` (and decrement count of \`s[L]\`).

\`\`\`viz:array
{
  "frames": [
    { "cells": ["A", "A", "B", "A", "B", "B", "A"], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "R=3", "index": 3 }], "highlight": [0, 1, 2, 3], "note": "Window 'AABA': len=4, maxFreq=3 (A). Cost = 4 - 3 = 1 <= K=1 -> Valid! MaxLen = 4." },
    { "cells": ["A", "A", "B", "A", "B", "B", "A"], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "R=4", "index": 4 }], "note": "R=4 ('B'): Window 'AABAB', len=5. Cost = 5 - 3 = 2 > K=1 -> Invalid!" },
    { "cells": ["A", "A", "B", "A", "B", "B", "A"], "pointers": [{ "label": "L=1", "index": 1 }, { "label": "R=4", "index": 4 }], "highlight": [1, 2, 3, 4], "note": "Shrink L=1: Window 'ABAB', len=4. Cost = 4 - 2 = 2 > K -> Keep window size at 4." }
  ],
  "caption": "Longest Repeating Character Replacement — Window state checked via length - maxFreq <= K."
}
\`\`\`

**The optimal solution (window on length − maxFreq).**

\`\`\`python
def character_replacement(s, k):
    count = {}
    l = 0
    max_freq = 0
    best = 0
    for r, ch in enumerate(s):
        count[ch] = count.get(ch, 0) + 1
        max_freq = max(max_freq, count[ch])
        while (r - l + 1) - max_freq > k:     # too many chars to replace
            count[s[l]] -= 1
            l += 1
        best = max(best, r - l + 1)
    return best
\`\`\`

**Complexity — a 26-slot count keeps every step O(1).**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Try every substring × replacement", "time": "O(26 · N²)", "space": "O(1)", "note": "Re-evaluates replacement cost from scratch." },
    { "approach": "Sliding window + frequency map", "time": "O(N)", "space": "O(1)", "note": "maxFreq never needs to decrease. Interview-optimal.", "best": true }
  ],
  "caption": "N = length of s. The count map holds at most 26 letters, so its space is constant."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *The Stale maxFreq Ratchet Optimization*: Do we need to recalculate \`maxFreq\` when shrinking \`L\`? **No!** We only care about finding a window *strictly larger* than our current max. A stale, higher \`maxFreq\` does not produce incorrect maximum length results!`,
      questions: [
        {
          kind: "mcq",
          prompt: "What condition determines if a sliding window can be converted into a single repeating character string using at most K edits?",
          options: [
            "(Window Length) / 2 <= K",
            "(Window Length) - (max_character_frequency_in_window) <= K",
            "(Window Length) + K == 26",
            "max_character_frequency_in_window == K"
          ],
          correct_index: 1,
          model_answer: "Keeping the most frequent character requires replacing all other characters in the window. The replacement cost is (Window Length) - maxFreq, which must be <= K.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why is it mathematically safe to NEVER decrease `maxFreq` even when the character contributing to `maxFreq` leaves the window?",
          model_answer: "Our goal is to find the maximum window length. The max window length can only be beaten if we encounter a window with a *higher* max frequency than any seen before. Stale maxFreq values never overestimate the global maximum window length achieved.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "permutation-in-string",
      title: "Permutation in String",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/permutation-string",
      summary: "A fixed-size window sliding one step at a time, comparing letter histograms as it goes.",
      body: `**The problem.** Given \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a permutation of \`s1\` as a contiguous substring. \`s1 = "ab", s2 = "eidbaooo"\` → \`true\` (\`"ba"\`).
**The signal.** A permutation is just a substring with an *identical character histogram*, so this is a **fixed-size** window (length = \`|s1|\`) sliding one step at a time and comparing two 26-slot counts.

**Beginner Intuition & The Naive Fallacy.** Beginners extract every substring of \`s2\` with length equal to \`s1.length\`, sort both strings, and compare them in $O(N \\cdot K \\log K)$ time.
*Why this shatters*: Re-sorting windows repeatedly does redundant work! A permutation of \`s1\` is simply any substring with an **identical character frequency distribution**.

**The Structural Invariant: Fixed-Size Sliding Window.**
- Window size is fixed at $K = \\text{s1.length}$.
- Maintain two frequency arrays of size 26: \`count1\` (for \`s1\`) and \`count2\` (for current window in \`s2\`).
- **Slide Window One Step**:
  - Add incoming character \`s2[R]\`: \`count2[s2[R]]++\`.
  - Evict outgoing character \`s2[R - K]\`: \`count2[s2[R - K]]--\`.
  - Compare \`count1\` vs \`count2\` in $O(26) = O(1)$ time.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["e", "i", "d", "b", "a", "o", "o", "o"], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "R=1", "index": 1 }], "note": "s1='ab' (K=2, count1={a:1,b:1}). Initial window 'ei': count2={e:1,i:1} -> Mismatch." },
    { "cells": ["e", "i", "d", "b", "a", "o", "o", "o"], "pointers": [{ "label": "L=2", "index": 2 }, { "label": "R=3", "index": 3 }], "note": "Slide window to 'db': count2={d:1,b:1} -> Mismatch." },
    { "cells": ["e", "i", "d", "b", "a", "o", "o", "o"], "pointers": [{ "label": "L=3", "index": 3 }, { "label": "R=4", "index": 4 }], "highlight": [3, 4], "note": "Slide window to 'ba': count2={a:1,b:1} == count1! Permutation found -> Return true." }
  ],
  "caption": "Permutation in String — Fixed-size sliding window with O(26) frequency checks."
}
\`\`\`

**The optimal solution (fixed window of counts).**

\`\`\`python
def check_inclusion(s1, s2):
    if len(s1) > len(s2):
        return False
    need = [0] * 26
    have = [0] * 26
    for ch in s1:
        need[ord(ch) - 97] += 1
    k = len(s1)
    for i, ch in enumerate(s2):
        have[ord(ch) - 97] += 1
        if i >= k:
            have[ord(s2[i - k]) - 97] -= 1   # evict the char leaving the window
        if have == need:
            return True
    return False
\`\`\`

**Complexity — no re-sorting, just count deltas.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Sort each length-K window", "time": "O(N · K log K)", "space": "O(K)", "note": "Redundantly re-sorts overlapping windows." },
    { "approach": "Fixed window + 26-slot counts", "time": "O(N)", "space": "O(1)", "note": "One char in, one out per slide. Interview-optimal.", "best": true }
  ],
  "caption": "N = length of s2, K = length of s1. Comparing two fixed 26-slot arrays is O(1) per step."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Short String Edge Case*: If \`s1.length > s2.length\`, return \`false\` immediately.
- *O(1) Matches Optimization*: Instead of comparing 26 slots each slide, track a single variable \`matches\` (count of characters with equal frequency). Update \`matches\` in $O(1)$ when adding/removing characters!`,
      questions: [
        {
          kind: "mcq",
          prompt: "What makes Permutation in String a FIXED-SIZE sliding window problem?",
          options: [
            "Because the window size can grow infinitely.",
            "Because any valid permutation of s1 MUST have length exactly equal to s1.length.",
            "Because s2 is sorted.",
            "Because the alphabet is limited to 26 letters."
          ],
          correct_index: 1,
          model_answer: "Any permutation of s1 has the exact same character count and length as s1. Thus, the window length in s2 is fixed at s1.length.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "How does tracking a single `matches` count variable optimize the frequency array comparison from O(26) to O(1)?",
          model_answer: "When sliding the window, only two character counts change (one added, one removed). We update `matches` by checking if those specific character counts transitioned into or out of alignment with s1's counts.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "minimum-window-substring",
      title: "Minimum Window Substring",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/minimum-window-with-characters",
      summary: "Expand until you cover, contract while you still cover — the inverted window at full power.",
      body: `**The problem.** Given \`s\` and \`t\`, return the shortest substring of \`s\` that contains every character of \`t\` including multiplicity, or \`""\` if none exists. \`s = "ADOBECODEBANC", t = "ABC"\` → \`"BANC"\`.
**The signal.** "Smallest window covering a requirement" is the *inverted* sliding window: expand to satisfy, then contract to minimise — tracked with a \`have == required\` counter so each validity check is O(1).

**Beginner Intuition & The Naive Fallacy.** Beginners generate all $O(N^2)$ substrings, checking if each contains all characters of string $T$.
*Why this shatters*: $O(N^3)$ time complexity TLEs on large inputs.

**The Structural Invariant: The Inverted Expand-Satisfy / Contract-Optimize Pattern.**
Unlike previous problems where we expand until *invalid*, here we:
1. **Expand Right (\`R\`)** to **SATISFY** the condition (window contains all required characters of $T$).
2. **Contract Left (\`L\`)** to **OPTIMIZE** (shrink window as small as possible while preserving validity).
3. **State Counters**:
   - \`need[char]\`: Frequency requirement map for string $T$.
   - \`have\`: Count of unique characters whose required frequency is currently satisfied.
   - \`required\`: Number of unique characters in $T$.
   - Condition satisfied when \`have == required\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "R=5", "index": 5 }], "highlight": [0, 3, 5], "note": "T='ABC'. Expand R=5: Window 'ADOBEC' contains A, B, C! valid=true. Record len=6." },
    { "cells": ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"], "pointers": [{ "label": "L=1", "index": 1 }, { "label": "R=5", "index": 5 }], "note": "Contract L=1: Evict 'A'. Window 'DOBEC' misses 'A' -> valid=false. Resume expanding R." },
    { "cells": ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"], "pointers": [{ "label": "L=9", "index": 9 }, { "label": "R=12", "index": 12 }], "highlight": [9, 10, 11, 12], "note": "After expansion/contraction cycles, window tightens to 'BANC' (index 9..12). Min Length = 4." }
  ],
  "caption": "Minimum Window Substring — Expand to satisfy, contract to minimize."
}
\`\`\`

**The optimal solution (expand-satisfy, contract-optimize).**

\`\`\`python
def min_window(s, t):
    if not t or not s:
        return ""
    need = {}
    for ch in t:
        need[ch] = need.get(ch, 0) + 1
    required = len(need)
    window = {}
    have = 0
    best_len, best = float('inf'), (0, 0)
    l = 0
    for r, ch in enumerate(s):
        window[ch] = window.get(ch, 0) + 1
        if ch in need and window[ch] == need[ch]:
            have += 1
        while have == required:                    # fully covered → shrink
            if r - l + 1 < best_len:
                best_len, best = r - l + 1, (l, r)
            window[s[l]] -= 1
            if s[l] in need and window[s[l]] < need[s[l]]:
                have -= 1
            l += 1
    return s[best[0]: best[1] + 1] if best_len != float('inf') else ""
\`\`\`

**Complexity — both pointers cross s once.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Check every substring", "time": "O(N² · M)", "space": "O(M)", "note": "Re-verifies coverage for each substring." },
    { "approach": "Expand-satisfy / contract-optimize", "time": "O(N + M)", "space": "O(M)", "note": "have/need counter makes validity O(1). Interview-optimal.", "best": true }
  ],
  "caption": "N = length of s, M = length of t. Each character of s is added once and removed at most once."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Exact Frequency Satisfaction*: If T requires two 'A's ("AA"), 'have' only increments when the window's 'A' count reaches 2.
- *No Result Found*: If no valid window exists, return "".`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the core difference between standard sliding window and Minimum Window Substring?",
          options: [
            "Minimum Window Substring uses binary search instead of pointers.",
            "Standard window expands while valid and shrinks when broken; Minimum Window expands to become valid and shrinks to minimize size while maintaining validity.",
            "Minimum Window Substring only works on numbers.",
            "Standard window runs in O(N^2) time."
          ],
          correct_index: 1,
          model_answer: "Minimum Window Substring flips the loop logic: right pointer expands until target criteria is met, then left pointer contracts to find the minimum valid substring.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Minimum Window Substring for s of length N and t of length M?",
          model_answer: "O(N + M) time. Constructing the frequency map for t takes O(M). Left and right pointers each traverse string s at most once, taking O(N) time.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "sliding-window-maximum",
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/sliding-window-maximum",
      summary: "A deque of the undefeated: keep candidates in decreasing order and the window max is always at the front.",
      body: `**The problem.** Given \`nums\` and a window size \`k\`, return the maximum of every contiguous window as it slides across the array. \`nums = [1,3,-1,-3,5,3,6,7], k = 3\` → \`[3,3,5,5,6,7]\`.
**The signal.** Needing the max of *every* window in O(N) rules out re-scanning and even a heap (removing stale elements is costly). The intended tool is a **monotonic decreasing deque** of indices whose front is always the current window max.

**Beginner Intuition & The Naive Fallacy.** Scanning all $K$ elements for each of the $N - K + 1$ windows takes $O(N \\cdot K)$ time.
*Why Max-Heap fails*: Using a Max-Heap takes $O(N \\log K)$ time, but removing elements that fall out of the left window requires $O(K)$ search unless complex lazy deletion is implemented.

**The Structural Invariant: The Monotonic Decreasing Deque.**
We maintain a Double-Ended Queue (Deque) storing **indices** of elements in strictly **decreasing order of value**.
- *The Dominance Principle*: If a new element \`nums[i]\` is **larger** than elements at the back of the deque, those smaller elements can **NEVER** be the maximum of any current or future window! (They are smaller AND older).
- **Deque Maintenance per Step**:
  1. **Evict Expired Head**: If \`deque.front() == i - K\`, pop from front (out of window).
  2. **Evict Dominated Back**: While \`deque.back()\` has value $\\le \\text{nums}[i]$, pop from back.
  3. **Push Current Index**: Push index $i$ to back.
  4. **Record Max**: For $i \\ge K - 1$, \`res.push(nums[deque.front()])\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 3, -1, -3, 5, 3, 6, 7], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "R=2", "index": 2 }], "highlight": [1], "note": "Window [1, 3, -1]. Deque indices: [1, 2] (vals: 3, -1). Front is index 1 (val 3). Max = 3." },
    { "cells": [1, 3, -1, -3, 5, 3, 6, 7], "pointers": [{ "label": "L=2", "index": 2 }, { "label": "R=4", "index": 4 }], "highlight": [4], "note": "R=4 (val 5): 5 > -1 and 5 > 3! Evict all smaller elements. Deque: [4] (val 5). Max = 5." },
    { "cells": [1, 3, -1, -3, 5, 3, 6, 7], "pointers": [{ "label": "L=4", "index": 4 }, { "label": "R=6", "index": 6 }], "highlight": [6], "note": "R=6 (val 6): 6 > 3 and 6 > 5! Evict all. Deque: [6] (val 6). Max = 6." }
  ],
  "caption": "Sliding Window Maximum — Monotonic Deque provides O(N) overall time complexity."
}
\`\`\`

**The optimal solution (monotonic deque of indices).**

\`\`\`python
from collections import deque

def max_sliding_window(nums, k):
    dq = deque()          # indices, their values strictly decreasing
    res = []
    for i, x in enumerate(nums):
        if dq and dq[0] == i - k:        # front slid out of the window
            dq.popleft()
        while dq and nums[dq[-1]] <= x:  # evict smaller, older values
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            res.append(nums[dq[0]])      # front is the window max
    return res
\`\`\`

**Complexity — every index is pushed and popped at most once.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Re-scan each window", "time": "O(N · K)", "space": "O(1)", "note": "Recomputes the max for every window from scratch." },
    { "approach": "Max-heap with lazy deletion", "time": "O(N log N)", "space": "O(N)", "note": "Stale-max removal drags in a log factor." },
    { "approach": "Monotonic decreasing deque", "time": "O(N)", "space": "O(K)", "note": "Front is always the max; O(1) amortized per step. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of elements, K = window size. Each index enters and leaves the deque once → linear total."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Store Indices, Not Values*: Store element **indices** in the deque, not raw values! Indices are required to check if \`deque.front()\` has expired past the left boundary \`i - K\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why are elements smaller than the incoming element nums[i] popped from the back of the Monotonic Deque?",
          options: [
            "To keep the deque size less than K.",
            "Because those smaller elements are both smaller AND older, meaning they can never be the maximum of any current or future window.",
            "To sort the array in ascending order.",
            "Because the deque only accepts positive numbers."
          ],
          correct_index: 1,
          model_answer: "An element that is both smaller than nums[i] and appears before index i will expire before nums[i] and has smaller value, rendering it useless for future window maximum queries.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What is the amortized time complexity per element using the Monotonic Deque approach?",
          model_answer: "O(1) amortized time per element. Each index is pushed into the deque exactly once and popped at most once, yielding total O(N) time for the entire array.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
