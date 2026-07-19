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
  intro: `Backtracking left you with a confession: the decision tree keeps solving the *same subproblem* over and over. Climb a staircase two ways to step 3, and everything above step 3 gets explored twice — identically. Dynamic programming is the entire discipline built on one observation: **if a subproblem's answer depends only on where you are, not how you got there, solve it once and remember it.** The exponential tree collapses into a table with one entry per distinct state — and in this chapter, states fit in a single array: dp[i] for "the answer at position i" or "the answer for amount i."

Every problem here follows the same five-finger checklist, and it is worth reciting until automatic. **State** — what does dp[i] *mean*, in one precise sentence? (Vague state definitions are where DP attempts die.) **Recurrence** — how does dp[i] follow from earlier entries? This is always a sentence about the *last decision*: the final step was 1 or 2; the last house was robbed or skipped; the last coin was one of these. **Base cases** — the smallest honest answers. **Order** — fill so dependencies are ready before they are needed. **Answer location** — which entry (or combination) is the result. Top-down memoization (recursion plus a cache) and bottom-up tabulation (loops filling the array) are the same mathematics in different clothing; fluency means writing either and knowing why you chose.

The twelve problems are sequenced as one long escalation. Climbing Stairs is Fibonacci — the recurrence in its purest form, told three ways. Min Cost adds a price to each choice; House Robber makes choices *exclude* each other (the take-or-skip recurrence you will reuse forever); House Robber II bends the street into a circle and teaches constraint-splitting. The palindrome pair swaps positions for centres. Decode Ways is Fibonacci wearing validity guards; Coin Change re-indexes the state from position to *amount* — the pivotal abstraction jump — and Maximum Product Subarray forces the state itself to grow (you must carry the minimum too). Word Break makes dp[i] a boolean about prefixes; Longest Increasing Subsequence pays O(n²) honestly, then glimpses the O(n log n) patience trick; and Partition Equal Subset Sum closes by turning take-or-skip loose on a *sum target* — the doorway to knapsack, which is exactly where the 2-D chapter picks up.

On the roadmap, 1-D DP unlocks 2-D DP and Bit Manipulation.`,
  problems: [
    {
      slug: "climbing-stairs",
      title: "Climbing Stairs",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/climbing-stairs",
      summary: "Fibonacci in disguise — and the canonical tour: brute recursion, memoization, tabulation, two variables.",
      body: `**The problem.** A staircase of n steps; each move climbs 1 or 2. How many distinct ways to the top? n = 3 → 3 (1+1+1, 1+2, 2+1). The problem every DP education starts with, because it contains the whole method in miniature.

**The recurrence, from the last move.** Stand at the top and ask: what was the final step? Either a 1 from step n−1, or a 2 from step n−2 — no other way to arrive, and the two families never overlap. So ways(n) = ways(n−1) + ways(n−2), bases ways(1) = 1, ways(2) = 2. That is Fibonacci — but the *derivation habit* is the treasure: condition on the last decision, and the count splits into disjoint smaller counts.

**Telling one: brute recursion.** Code the recurrence directly — and watch it burn: ways(5) computes ways(3) twice, ways(2) three times; the call tree doubles per level, O(2ⁿ). The subproblems *overlap*, and recursion alone has amnesia.

**Telling two: memoization.** Add a cache: first call computes and stores, repeats return instantly. Same code plus three lines; O(n) time, O(n) space. This is DP top-down — recursion that remembers.

**Telling three: tabulation.** Kill the recursion: fill dp[1], dp[2], … upward in a loop, each entry from the two before it. Same O(n), no call stack, and the dependency *order* is explicit — the version to write when asked.

**Telling four: rolling variables.** dp[i] only ever reads two predecessors — so keep just two variables and shuffle them forward. O(1) space. This space-squeeze (keep only the window the recurrence reads) is a standard finishing move; you will repeat it in Min Cost and House Robber.

**The walk-through.** dp: 1, 2, 3, 5, 8 — n = 5 gives 8 ways.

**Complexity.** O(n) time, O(1) space in the final telling.

**The thread.** Counting was free of choices — every path counted equally. Min Cost Climbing Stairs, next, prices each step, and the recurrence's plus becomes a min: same skeleton, first taste of *optimisation*.`,
    },
    {
      slug: "min-cost-climbing-stairs",
      title: "Min Cost Climbing Stairs",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/min-cost-climbing-stairs",
      summary: "The same staircase, now priced: dp[i] = cost[i] + min(two predecessors) — counting becomes optimising.",
      body: `**The problem.** Each step has a toll, paid when you step on it; from a step you may climb 1 or 2. Start from step 0 *or* step 1; finish just past the last step. Minimise total cost. [10, 15, 20] → 15 (start at 15, leap to the top).

**The recurrence.** Define dp[i] = the cheapest total cost to *stand on* step i (having paid it). The last move into i came from i−1 or i−2 — same two doors as Climbing Stairs — but now instead of *adding* the two families, you *choose the cheaper*: dp[i] = cost[i] + min(dp[i−1], dp[i−2]). Counting sums over the ways in; optimisation mins over them. One operator changed, and the whole genre of "cheapest way to X" opens up. Bases: dp[0] = cost[0], dp[1] = cost[1] — the free choice of starting step is encoded entirely in the bases, no special logic later. Answer: min(dp[n−1], dp[n−2]) — the "top" is past the array, reachable by a 1-step from the last or a 2-step from the second-last.

**The state-definition lesson.** Notice how much precision the dp[i] sentence carried: *standing on i, toll paid*. Define it instead as "cost to reach the area above i" and the bases, the recurrence, and the answer all shift. Most wrong DP is wrong in the English, not the code — write the sentence first, out loud, every time.

**The walk-through.** [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]. dp: 1, 100, 2, 3, 3, 103, 4, 5, 104, 6 → answer min(104, 6)… careful — min(dp[9], dp[8]) = min(6, 104) = **6**: the famous zigzag over every 100.

**Complexity.** O(n) time; O(1) space with the two-variable roll — the finishing move transfers verbatim.

**The thread.** Two problems, two operators — sum and min — on the same two-door recurrence. House Robber, next, changes the *doors themselves*: taking a house slams the adjacent door shut, and the recurrence must reason about incompatible choices.`,
    },
    {
      slug: "house-robber",
      title: "House Robber",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/house-robber",
      summary: "Take it and skip a neighbour, or skip it — the include/exclude recurrence that powers half of DP.",
      body: `**The problem.** Houses in a row, each holding cash; adjacent houses share an alarm, so you cannot rob neighbours. Maximise the haul. [2, 7, 9, 3, 1] → 12 (rob 2, 9, 1).

**The recurrence, from the last decision.** Consider the final house. Two futures: you **skip** it — then the best haul is exactly the best over the first n−1 houses; or you **take** it — then house n−1 is untouchable, and you add its cash to the best over the first n−2. dp[i] = max(dp[i−1], cash[i] + dp[i−2]). This is the *include/exclude recurrence*, and it is the single most reused shape in dynamic programming — subsequences, scheduling with cooldowns, deletion problems: all of them are "take it and lose some neighbourhood, or pass."

**Why greed fails first.** "Rob every other house" or "always take the richest available" both break: [2, 1, 1, 2] wants the two 2s — skipping *two* houses in the middle — which no fixed pattern finds. The recurrence considers every legal structure implicitly; that is what you are buying.

**The walk-through.** [2, 7, 9, 3, 1]: dp[0] = 2, dp[1] = max(2, 7) = 7. dp[2] = max(7, 9 + 2) = 11. dp[3] = max(11, 3 + 7) = 11. dp[4] = max(11, 1 + 11) = 12. Notice dp[3]: taking 3 was *evaluated* (10) and lost — the max quietly discards bad branches the greedy would have committed to.

**The two-variable form.** Only dp[i−1] and dp[i−2] are ever read: roll two variables (best-including-previous, best-excluding). O(1) space, and interviewers often ask for exactly this polish.

**Complexity.** O(n) time, O(1) space.

**The thread.** The recurrence assumed the row *ends* — house 0 and house n−1 are strangers. House Robber II welds them into neighbours (a circular street), and the fix is not a new recurrence but a decomposition trick worth owning on its own.`,
    },
    {
      slug: "house-robber-ii",
      title: "House Robber II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/house-robber-ii",
      summary: "A circular street: split into two linear cases — with house 0, or with house n−1 — and take the better.",
      body: `**The problem.** Same rules, but the houses form a **circle**: the first and last are now adjacent, so robbing both trips the alarm. [2, 3, 2] → 3, not 4 — the two 2s are neighbours across the seam.

**Why the old recurrence breaks.** dp[i] = max(dp[i−1], cash[i] + dp[i−2]) encodes only *local* adjacency; the circle adds one **global** constraint — houses 0 and n−1 exclude each other — that no per-index recurrence can see. You could thread extra state ("did I rob house 0?") through the whole computation… or notice something cleaner.

**The insight — case-split on the conflict.** Exactly one pair is problematic. Every valid plan either skips house 0 or skips house n−1 (possibly both — that plan lives inside either case; the cases need not be disjoint, only *exhaustive*). And within each case, the circle is broken: "houses 1..n−1" and "houses 0..n−2" are plain **linear** streets. So run House Robber I — unchanged — on each of the two slices, and return the better result. The circular problem reduces to two linear ones. This *constraint-splitting* move — enumerate the small set of ways a single awkward constraint can resolve, then solve a clean subproblem under each — is a general weapon: circular subsequences, wrap-around schedules, and several hard DPs all yield to it.

**The walk-through.** [2, 3, 2]: slice without house 0 → [3, 2] → 3; slice without the last → [2, 3] → 3. Answer 3. Now [1, 2, 3, 1]: slices [2, 3, 1] → 4 and [1, 2, 3] → 4 → answer 4 (rob 1 and 3 — legal, since only the 0/n−1 pair was ever the issue).

**Edge case.** A single house has no neighbour — return its cash directly; the two-slice machinery needs at least two houses to slice.

**Complexity.** O(n) time — two linear passes — O(1) space.

**The thread.** Positions have carried the state so far. The next pair of problems moves the lens *inside* strings — where the natural unit is not an index but a **centre**, and palindromes bloom outward from it.`,
    },
    {
      slug: "longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-palindromic-substring",
      summary: "Every palindrome has a centre — expand from all 2n−1 of them and keep the widest.",
      body: `**The problem.** Find the longest contiguous palindrome inside a string. "babad" → "bab" (or "aba" — ties are free). Substring, not subsequence: the letters are consecutive, which is exactly what makes geometric thinking work.

**The insight — think centres, not endpoints.** Checking all O(n²) substrings for palindromity costs O(n³) and re-verifies the same middles endlessly. Flip the viewpoint: every palindrome is symmetric about a **centre** — a character (odd length, like "aba") or a gap between characters (even length, like "abba"). A string of length n has exactly 2n − 1 centres. From each, *expand*: step left and right in tandem while the characters match; where they stop matching, that centre's maximal palindrome is fully known. Track the widest seen anywhere. No substring is ever re-examined — each centre's expansion does fresh work only.

**Why this lives in the DP chapter.** The classic table formulation — isPal[i][j] true when s[i] = s[j] and the inside isPal[i+1][j−1] — *is* DP: big palindromes verified from smaller ones, exactly the table Palindrome Partitioning precomputed back in Backtracking. It costs O(n²) time *and* O(n²) space. Centre expansion computes the same truth in O(n²) time and **O(1) space**, and reads more naturally besides. Holding both — and saying why you would pick expansion here but the table when many problems share it — is the fluency being tested. (Manacher's algorithm does it in O(n); name it as a known landmark, decline to implement, and nobody reasonable will push.)

**The walk-through.** "babad": centre at index 1 (a) expands b-a-b then hits b≠d… careful — expands to "bab", stops at edges/mismatch. Centre at 2: "aba". Even centres between letters all die immediately (no "aa" pairs). Widest: length 3.

**Complexity.** O(n²) time worst case ("aaaa…" expands fully everywhere), O(1) space.

**The thread.** The expansion machinery answers more than "longest" — run it and *count* what blooms instead. That is literally the next problem.`,
    },
    {
      slug: "palindromic-substrings",
      title: "Palindromic Substrings",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/palindromic-substrings",
      summary: "Same centres, new harvest: every successful expansion step is one more palindrome — count them all.",
      body: `**The problem.** Count *all* palindromic substrings — every occurrence counts separately. "aaa" → 6: three single a's, two "aa"s, one "aaa".

**The insight.** Reuse last problem's engine wholesale. Expand from each of the 2n − 1 centres — but change what you harvest: every *step* of a successful expansion is itself one complete palindrome. Centre expands to radius 0 (just itself): that is a palindrome, count it. Still matching at radius 1: another palindrome, count it. Each match-and-widen adds exactly one to the tally, so the counter increments *inside* the expansion loop rather than after it. The total is the sum of expansion depths across all centres. Nothing else changes — same centres, same tandem pointers, same O(1) space.

**The chassis lesson, again.** This is the atlas's recurring duet structure (Number of Islands → Max Area; Subsets → Subsets II): one traversal engine, two harvests. It is deliberate that the roadmap pairs them — the skill under test is recognising that "longest X" and "count of X" share machinery, so the second problem costs you three minutes, not thirty. In interviews, pattern-matching a new request onto an engine you already hold *is* the demonstration of seniority.

**The walk-through.** "aaa". Centres at letters: index 0 expands radius 0 (✓ 1). Index 1: radius 0 (✓), radius 1 "aaa" (✓) — 2 more. Index 2: 1 more. Centres at gaps: between 0-1, "aa" ✓ (1); between 1-2, "aa" ✓ (1). Total 6. Each of the six is a distinct (start, end) span — occurrences, not distinct strings.

**The table alternative.** The isPal[i][j] DP counts too — sum the true cells — same O(n²)/O(n²) as before; and it remains the right tool when a *later* stage needs random-access palindrome queries (as Palindrome Partitioning did). Expansion when you need answers once; table when you need them repeatedly. Say the sentence.

**Complexity.** O(n²) time, O(1) space.

**The thread.** Palindromes closed. Next, the recurrence-with-guards genre: Decode Ways — Climbing Stairs' twin, except some steps are *illegal*, and zeros lie in wait.`,
    },
    {
      slug: "decode-ways",
      title: "Decode Ways",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/decode-ways",
      summary: "Fibonacci with validity guards: count decodings by whether the last token was one digit or two.",
      body: `**The problem.** Letters were encoded as numbers (A=1 … Z=26) and concatenated: "12" could be AB (1, 2) or L (12) — 2 ways. Given a digit string, count the decodings. "226" → 3. Strings with stranded zeros → 0.

**The recurrence.** Condition on the **last token** — the move that produced the final characters. It was either a single digit (valid iff nonzero) consuming s[i], leaving dp[i−1] ways for the rest; or a two-digit token (valid iff the pair reads 10–26) consuming s[i−1..i], leaving dp[i−2]. dp[i] = (guard₁ ? dp[i−1] : 0) + (guard₂ ? dp[i−2] : 0). Structurally *identical* to Climbing Stairs — steps of size 1 and 2 — except each step must pass a validity check before its family counts. Recurrence plus guards: an enormous genre (word segmentation, parsing counts) in its smallest instance.

**Zeros are the whole game.** '0' decodes as nothing on its own — its single-digit guard always fails — so a zero *must* ride as the tail of 10 or 20. "30" → both guards fail at the zero → dp hits 0 and stays there: no decoding exists. "100" → the second zero has no legal partner (00 invalid) → 0. Every hidden-test failure on this problem is a zero case; walk them before writing code.

**The walk-through.** "226": dp[0] = 1 (empty string decodes one way — the base that makes the arithmetic work; treat it as "one way to have decoded nothing"). '2': single ✓ → dp = 1. '22': single ✓ (dp 1) + pair 22 ✓ (dp 1) → 2. '226': single 6 ✓ (dp 2) + pair 26 ✓ (dp 1) → **3** — BZ, VF, BBF.

**Complexity.** O(n) time; O(1) space by rolling two variables, the standard finish.

**The thread.** Every state so far was a *position in the input*. Coin Change, next, makes the leap that unlocks the rest of the chapter: the state becomes an **amount** — a number you are trying to build — and positions disappear entirely.`,
    },
    {
      slug: "coin-change",
      title: "Coin Change",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/coin-change",
      summary: "State = amount, not position: fewest coins for every value 0..target, each built from smaller amounts.",
      body: `**The problem.** Coin denominations (unlimited supply) and a target amount: fewest coins that make it exactly, or −1. Coins [1, 3, 4], amount 6 → 2 (3 + 3).

**Why greed dies here — properly.** Take-the-biggest works for canonical currencies (US coins are engineered for it) and fails in general: amount 6 with [1, 3, 4] greedily takes 4, then 1, 1 — three coins — missing 3 + 3. Optimal choices at one scale do not compose from locally biggest pieces; when greed lacks a proof, DP is the honest fallback. (This exact contrast returns in the Greedy chapter — from the other side.)

**The abstraction jump.** Until now dp was indexed by *where you are in the input*. Here the input has no positions worth walking — the state is **how much money remains to build**. dp[a] = fewest coins totalling exactly a. Recurrence by the last coin: whichever coin c finished the pile, the rest made a − c, so dp[a] = 1 + min over coins of dp[a − c] (skipping negatives and unreachable sub-amounts). Base: dp[0] = 0 — zero coins make zero. Fill a from 1 upward; every dp[a − c] is ready before dp[a] asks. Answer dp[amount], with "still infinity" meaning unreachable → −1.

**The walk-through.** Coins [1, 3, 4]: dp[1] = 1, dp[2] = 2, dp[3] = 1, dp[4] = 1, dp[5] = 2 (1+4), dp[6] = min(dp[5], dp[3], dp[2]) + 1 = **2**. The 4-coin's tempting start is *evaluated* at dp[6] via dp[2] = 2 → 3 coins, and loses fairly.

**Unbounded, noted.** Reusing coins is free because dp[a − c] already allows every coin again — no bookkeeping, unlike Combination Sum's index discipline. The use-once variant needs different machinery: that is knapsack, and it closes this chapter.

**Complexity.** O(amount × coins) time, O(amount) space. *Pseudo-polynomial* — linear in the numeric value, exponential in its digit-length — a distinction worth pronouncing.

**The thread.** State just became a quantity. Next, Maximum Product Subarray forces the state to grow another way: one running value is not enough — you must carry the *minimum* too, because a negation can crown it.`,
    },
    {
      slug: "maximum-product-subarray",
      title: "Maximum Product Subarray",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/maximum-product-subarray",
      summary: "Carry the max and the min: a negative number swaps them, and yesterday's worst becomes today's best.",
      body: `**The problem.** Find the contiguous subarray with the largest *product*. [2, 3, −2, 4] → 6 (subarray [2, 3]). Sums have Kadane's algorithm (waiting in the Greedy chapter); products look like a one-character edit — and the edit breaks everything, instructively.

**Why the naive carry fails.** For sums, one running value suffices: best-ending-here = max(x, best + x), because adding x moves everyone monotonically. Products *flip*: multiplying by a negative turns the largest product into the smallest and — the crucial half — the smallest into the **largest**. A deeply negative running product is not trash; it is a rocket waiting for one more minus sign. Carry only the max and you throw the rocket away.

**The insight — widen the state.** Track two values ending at each position: maxHere and minHere. Each new element x has three candidate roles: start fresh (x alone), extend the best (maxHere · x), extend the worst (minHere · x) — new maxHere and minHere are the max and min of those three. (Idiom: when x < 0, swap maxHere and minHere first — same arithmetic, prettier.) The global answer is the largest maxHere ever seen. The general lesson is the chapter's deepest: **when a recurrence cannot be written over your current state, the state is too small.** You did not need a cleverer formula; you needed to remember more per step. That diagnosis — recurrence won't close → enrich the state — unlocks dozens of hard DPs.

**The walk-through.** [2, 3, −2, 4]: start maxHere = minHere = 2. x = 3: candidates (3, 6, 6) → maxHere 6, minHere 3. x = −2: candidates (−2, −12, −6) → maxHere −2, minHere −12. x = 4: candidates (4, −8, −48) → maxHere 4, minHere −48. Global best: 6. Now append one more −1: candidates (−1, −4, 48) → maxHere **48** — the rocket fires, and the answer jumps from 6 to 48 precisely because the minimum was carried all along.

**Zeros** reset both carries through the "start fresh" candidate — no special case needed; the max(x, …) handles it.

**Complexity.** O(n) time, O(1) space.

**The thread.** State enriched by value. Word Break, next, shrinks the cell to a single boolean — can this prefix be built? — and the recurrence consults a dictionary instead of arithmetic.`,
    },
    {
      slug: "word-break",
      title: "Word Break",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/word-break",
      summary: "dp[i] asks: is the first i characters segmentable? True when some dictionary word ends exactly there.",
      body: `**The problem.** Can a string be segmented entirely into dictionary words (reusable)? "leetcode" with ["leet", "code"] → true. "catsandog" with ["cats", "dog", "sand", "and", "cat"] → false — every segmentation strands a letter somewhere.

**Backtracking first, to feel the burn.** Try every word at every position, recurse on the remainder — Palindrome Partitioning's cut-position search with dictionary membership as the guard. Correct, and exponential on adversarial inputs ("aaaa…b" with all-a words): the same suffix gets re-attempted from countless cut histories. Same suffix, same answer — *overlapping subproblems*, the DP bat-signal.

**The state.** dp[i] = true iff the prefix of length i can be fully segmented. dp[0] = true — the empty prefix is trivially done (the same "one way to have done nothing" base as Decode Ways). Recurrence by the **last word**: the prefix of length i is buildable iff some dictionary word w ends exactly at i with dp[i − len(w)] true — a valid smaller prefix, then one clean word. Two loop shapes compute it: for each i, scan candidate split points j (dp[j] true and s[j..i] in a word *set* — chapter one's O(1) membership, load-bearing as ever); or for each i, try each dictionary word as the tail — cheaper when the dictionary is small, and capping scans by the longest word length is the easy optimisation worth saying.

**The walk-through.** "leetcode": dp[0] ✓. i = 4: "leet" ends here, dp[0] ✓ → dp[4] ✓. i = 8: "code" ends here, dp[4] ✓ → dp[8] ✓ → true. For "catsandog": dp goes true at 3 ("cat"), 4 ("cats"), and 7 — reachable two ways, "sand" ending a dp[3] prefix or "and" ending a dp[4] prefix. But from 7 the remainder is "og", no word lands on index 9, and dp[9] stays false: segmentable almost all the way is still false.

**Complexity.** O(n² ) substring checks against a set (or O(n · dict) word-tailed), O(n) space. Follow-ups: return one segmentation (store a predecessor per i), or all of them (that is backtracking again — Word Break II, genuinely exponential output).

**The thread.** Booleans over prefixes. Next, the chapter's most famous ordering problem — Longest Increasing Subsequence — where dp looks *backwards* at every smaller element, and a second, stranger O(n log n) solution waits underneath.`,
    },
    {
      slug: "longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-increasing-subsequence",
      summary: "dp over 'LIS ending here' in O(n²) — then the patience-sorting tails array cuts it to O(n log n).",
      body: `**The problem.** Longest strictly increasing subsequence — elements in order, not necessarily adjacent. [10, 9, 2, 5, 3, 7, 101, 18] → 4 ([2, 3, 7, 101] or [2, 3, 7, 18]). Subsequence, not subarray: the gaps are the freedom, and the freedom is the difficulty.

**The O(n²) DP.** State: dp[i] = length of the longest increasing subsequence **ending exactly at** index i. (The "ending here" qualifier is what makes the recurrence close — the same trick as maxHere in Maximum Product.) Recurrence: look back at every j < i with nums[j] < nums[i]; I can extend any of those chains, so dp[i] = 1 + max(dp[j]), or 1 alone. Answer: the max over all dp. Honest, quadratic, and the version to write first — it also generalises (count the LISs, weighted variants) where the fast method does not.

**The O(n log n) idea — tails.** Keep an array where tails[k] = the *smallest possible last element* of any increasing subsequence of length k+1 seen so far. Walk the numbers: each x either extends the longest chain (x beats the last tail — append) or **improves** some chain (binary-search the first tail ≥ x and replace it: a length-(k+1) chain now ends lower, leaving more room above). Tails stays sorted — replacement preserves order — so every step is one binary search: chapter five, employed inside chapter thirteen. The final *length* of tails is the LIS length. Sharp edge worth stating: tails is **not** an actual LIS — its entries belong to different chains; only its length is meaningful.

**The walk-through (tails).** [10, 9, 2, 5, 3, 7, 101, 18]: tails [10] → [9] → [2] → [2,5] → [2,3] → [2,3,7] → [2,3,7,101] → [2,3,7,18]. Length 4.

**Complexity.** O(n²)/O(n), or O(n log n)/O(n) with tails. (The name "patience sorting" comes from the solitaire card game — a pleasant aside that interviewers enjoy.)

**The thread.** One problem left in 1-D: Partition Equal Subset Sum — take-or-skip aimed at a *sum target*, the exact doorway through which the 2-D chapter's knapsacks enter.`,
    },
    {
      slug: "partition-equal-subset-sum",
      title: "Partition Equal Subset Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/partition-equal-subset-sum",
      summary: "Subset-sum DP: which totals are buildable? Sweep amounts high-to-low so each number is used once.",
      body: `**The problem.** Can an array be split into two subsets with equal sums? [1, 5, 11, 5] → yes ({1, 5, 5} and {11}). First reduction: the two halves must each total sum/2 — so if the total is odd, answer no instantly; otherwise the real question is **subset-sum**: does *any* subset hit target = sum/2? (Finding one half finds the other by complement.)

**The state.** dp[a] = true iff some subset of the numbers seen so far sums to exactly a. Base dp[0] = true — the empty subset. Process numbers one at a time; each number x upgrades the reachable set: every previously buildable amount a now also makes a + x buildable. This is House Robber's take-or-skip aimed at a *quantity* instead of a position — and Coin Change's amount-indexed state with one critical difference: each number exists **once**.

**The direction trick — the part interviews probe.** Update dp in place and sweep amounts **downward** (target → x). Why: writing dp[a] = dp[a] or dp[a − x] while sweeping *upward* lets dp[a − x] be a value you just set using x itself — x counted twice, silently converting the problem to unlimited-supply Coin Change. Sweeping high-to-low means every dp[a − x] you read is from *before* x arrived. One loop direction is the entire once-versus-unlimited distinction; flip it deliberately and you have implemented the other problem. Say this out loud — it is the sharpest single sentence you can utter about knapsack DP.

**The walk-through.** [1, 5, 11, 5], target 11. After 1: {0, 1}. After 5: {0, 1, 5, 6}. After 11: {0, 1, 5, 6, 11, 12…capped} — 11 hit ✓ → true. (The last 5 never needed.) For [1, 2, 3, 5]: total 11, odd → false before any DP runs.

**Complexity.** O(n · target) time, O(target) space — pseudo-polynomial again, like every subset-sum relative.

**The thread.** And with that, the doorway: this problem *is* 0/1 knapsack's feasibility face — items used once, a capacity, a table over amounts. Add a second dimension — values to maximise, strings to align, grids to cross — and you have the next chapter. 2-D Dynamic Programming awaits.`,
    },
  ],
};
