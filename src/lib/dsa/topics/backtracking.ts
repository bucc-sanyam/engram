import type { DsaTopic } from "../types";

/** Chapter 9 — Backtracking: exploring the tree of your own choices. */
export const backtracking: DsaTopic = {
  slug: "backtracking",
  title: "Backtracking",
  chapter: 9,
  tagline: "Choose, explore, unchoose — walking the decision tree with one path in hand and pruning as you go.",
  color: "#7fe5e0",
  prereqs: ["trees"],
  unlocks: ["graphs", "dp-1d"],
  intro: `In Trees you traversed structures that already existed. Backtracking hands you the same recursion and points it at a tree nobody built: the **decision tree** of a problem — every node a partial answer, every edge a choice, every leaf a candidate solution. Generate all subsets? Each element is a fork: in, or out. Permutations? Each level picks who goes next. The tree is exponential and exists only implicitly; backtracking is depth-first search over it, materialising exactly one root-to-leaf path at a time.

The whole pattern lives in a three-beat mantra: **choose, explore, unchoose.** Append a candidate to your path; recurse deeper; then — the beat beginners drop — *remove it*, restoring the state exactly, so the next branch starts clean. That undo is what lets a single mutable path serve the entire exponential tree: you are not copying candidates, you are walking a corridor of possibilities with one notebook, erasing as you retreat. When the same list keeps appearing in every "answer" you saved, a missing unchoose (or an unsaved copy) is the bug — everyone ships it exactly once.

The second essential idea is **pruning**: killing branches before exploring them. A combination already over its target cannot be saved by adding more; a queen attacked in row three does not care how clever rows four through eight are. Every viability check you can evaluate at a *partial* answer multiplies through the whole subtree beneath it — pruning is where exponential-in-theory becomes fine-in-practice.

The ten problems form a deliberate ladder. Subsets, Combination Sum and Permutations are the three canonical *enumeration shapes* — include/exclude, reuse-allowed choosing, and arrangement — worth knowing as templates cold. Their sequels (Subsets II, Combination Sum II) add the trickiest recurring sub-skill: generating *unique* results from *duplicated* inputs via sort-and-skip. Generate Parentheses shows constraints shrinking a tree, Letter Combinations is the clean Cartesian product, Word Search takes backtracking onto a grid (your bridge toward Graphs), Palindrome Partitioning backtracks over *cut positions* in a string, and N-Queens — the pattern's historic mascot — composes constraint bookkeeping with full-board search.

On the roadmap, Backtracking unlocks Graphs (the same DFS, aimed at explicit structures) and 1-D Dynamic Programming — because DP is what you do when you notice your decision tree keeps re-solving identical subproblems.`,
  problems: [
    {
      slug: "subsets",
      title: "Subsets",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/subsets",
      summary: "Every element asks one question — in or out? — and the 2^n leaves are the power set.",
      body: `**Signal.** "Return every possible subset" — the counting fact *is* the design hint: each of n elements independently in or out gives 2ⁿ, a binary decision per element, which is the tell for a choose/explore/unchoose tree with two branches at every level.

**Brute force.** Enumerate every integer from 0 to 2ⁿ−1 and read its binary representation as an include/exclude mask over the n elements — iterative, no recursion, and genuinely the same O(2ⁿ · n) as backtracking. The two approaches tie here because the output itself is exponential; backtracking's real payoff shows up once pruning enters in the next few problems.

**Optimal approach.** Build the decision tree explicitly: level i asks "does element i join?" Two branches — include it, or don't — and recurse to level i + 1 either way. Every leaf (level n) is one complete subset. The code is the mantra verbatim: at index i, first branch — path.push(nums[i]), recurse(i + 1), path.pop() — then second branch — recurse(i + 1) with the element excluded. Save a *copy* of the path at each leaf; saving the live reference is the classic aliasing bug.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "start []", "children": ["inc1", "exc1"] },
    { "id": "inc1", "label": "include 1 -> [1]", "children": ["inc1inc2", "inc1exc2"] },
    { "id": "exc1", "label": "exclude 1 -> []", "children": ["exc1inc2", "exc1exc2"] },
    { "id": "inc1inc2", "label": "include 2 -> [1,2]", "highlight": true },
    { "id": "inc1exc2", "label": "exclude 2 -> [1]", "highlight": true },
    { "id": "exc1inc2", "label": "include 2 -> [2]", "highlight": true },
    { "id": "exc1exc2", "label": "exclude 2 -> []", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Subsets([1,2]) — each level asks in-or-out; the four leaves are the power set."
}
\`\`\`

**The alternative shape.** A "collect as you go" variant recurses on "which element joins next" (loop from i, recording the path at *every* node, not just leaves). Same output, different tree — and that shape is the chassis for Combination Sum next.

**Complexity.** O(2ⁿ · n) — 2ⁿ subsets, each copied at up to n length. Exponential output makes exponential time *optimal*: the algorithm is not slow, the answer is big.

**Thread.** Subsets asked in-or-out once per element. Combination Sum loosens the rules — elements may repeat, and a target prunes the tree — the second canonical shape.`,
    },
    {
      slug: "combination-sum",
      title: "Combination Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/combination-target-sum",
      summary: "Reuse allowed, order ignored: recurse on 'smallest candidate I may still use' and prune past the target.",
      body: `**Signal.** "Each candidate usable *unlimited* times, return every unique combination summing to the target" — unlimited reuse plus an order-irrelevant "combination" (not "sequence") is the tell for a start-index discipline that generates each combination exactly once, pruned by a running remaining-target.

**Brute force.** Let every level choose *any* candidate (no ordering restriction) and dedupe the results afterward with a set of sorted tuples — finds [2,2,3], [2,3,2], and [3,2,2] as three separate paths for one combination, paying a hash-set cost proportional to all the duplicates generated and discarded.

**Optimal approach.** Impose an order so each combination is constructible **one way only**: pass a start index; at a level with start = i, you may choose candidates[i] or anything later, never earlier. Combinations then emerge in non-decreasing candidate order — duplicates are not filtered, they are never generated. Choosing candidates[i] and recursing with start = **i** (not i + 1) says "I may pick myself again" — that single index decides reuse-allowed versus use-once, the entire difference from this problem's sequel. Carry the remaining target: negative means the branch is dead (with sorted candidates, break the loop outright); zero means record a copy of the path.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "start, remain=7", "children": ["p2", "p7"] },
    { "id": "p2", "label": "pick 2, remain=5", "children": ["p22"] },
    { "id": "p22", "label": "pick 2, remain=3", "children": ["p223"] },
    { "id": "p223", "label": "pick 3, remain=0 → [2,2,3]", "highlight": true },
    { "id": "p7", "label": "pick 7, remain=0 → [7]", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Combination Sum([2,3,6,7], target=7) — the start index (never choosing an earlier candidate) means each combination is built exactly one way."
}
\`\`\`

**Complexity.** Exponential in the worst case (output can be); depth bounded by target / smallest candidate — versus the brute force's extra dedup cost on top of the same generation.

**Thread.** Now poison the input: duplicate candidates, single-use each. Combination Sum II needs one more idea — the sorted skip-your-twin rule — the chapter's most transferable trick.`,
    },
    {
      slug: "combination-sum-ii",
      title: "Combination Sum II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/combination-target-sum-ii",
      summary: "Duplicated input, unique output: sort, then skip equal siblings at the same tree level.",
      body: `**Signal.** "Candidates may contain duplicates, each usable once, output must contain no duplicate combinations" — duplicated input plus a uniqueness requirement on the output is the tell for sort-then-skip-siblings, since two equal candidates can otherwise reach the identical combination down different branches.

**Brute force.** Generate combinations with start = i + 1 (single-use) but no duplicate-guard, then dedupe with a set of sorted tuples afterward — pays for generating (and then discarding) every duplicate path, of which there can be many when several values repeat.

**Optimal approach.** Single-use is the easy half: recurse with start = i + 1 instead of i. The hard half: two equal candidates make the tree generate identical combinations down *different branches*. Sort first, so equal values sit adjacent. Then, inside the choosing loop at any level: if candidates[i] equals candidates[i − 1] **and i is past this level's start**, skip it. Equal-to-previous flags a twin; past-the-start distinguishes *sibling* twins (an alternative to the first at the same level — skip, it would only reclone) from *parent-child* twins (stacking duplicates beneath the first choice — legitimate, keep it). At each level, let a value open a subtree only once — the first copy explores everything any copy could.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "sorted [1,1,2,5,6,7,10], remain=8", "children": ["n1a", "n1b", "n2"] },
    { "id": "n1a", "label": "pick 1 (index 0), remain=7", "children": ["leafA", "leafB"] },
    { "id": "leafA", "label": "…→ [1,1,6]", "highlight": true },
    { "id": "leafB", "label": "…→ [1,7]", "highlight": true },
    { "id": "n1b", "label": "pick 1 (index 1) — same value as sibling → SKIPPED" },
    { "id": "n2", "label": "pick 2, remain=6", "children": ["leafC"] },
    { "id": "leafC", "label": "pick 6 → [2,6]", "highlight": true }
  ],
  "rootId": "root",
  "caption": "The second 1 as a root-level sibling is skipped (it would only reclone the first 1's subtree); the second 1 as a child beneath the first 1 is kept, since that's how [1,1,6] gets built."
}
\`\`\`

**Complexity.** O(n log n) sort + exponential enumeration — versus the brute force's identical generation cost plus a wasted dedup pass.

**Thread.** Sort-and-skip-siblings is a *portable component* — you will bolt it onto Subsets II two problems from now. First, the third canonical shape: Permutations, where order matters and the tree branches on who goes next.`,
    },
    {
      slug: "permutations",
      title: "Permutations",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/permutations",
      summary: "Each level picks who goes next from the unused pool — n! leaves, one bookkeeping set.",
      body: `**Signal.** "Return every ordering of a list of distinct integers" — order mattering (not just membership) is the tell for the third canonical shape: each level picks *who occupies the next position* from whoever remains unused.

**Brute force.** Generate all n^n sequences of length n by picking freely from the full pool at every level, then filter out any sequence that repeats an element — wastes enormous effort generating invalid sequences that get thrown away, versus tracking usage directly.

**Optimal approach.** The decision at each level is "who occupies the next position?" Level 0 chooses from all n; whoever is chosen is unavailable beneath that branch; level 1 chooses among the n − 1 others; the leaf at depth n is one complete ordering. Branching factors n, n − 1, …, 1 multiply to n! leaves — the tree *is* the factorial. Bookkeeping is the only design choice: a boolean used-array (or hash set) alongside the path, maintained by the mantra: mark, push, recurse, pop, **unmark** — forgetting the unmark starves every later branch of candidates, a bug that announces itself as mysteriously missing permutations.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "[] , used={}", "children": ["c1", "c2", "c3"] },
    { "id": "c1", "label": "choose 1", "children": ["c1c2", "c1c3"] },
    { "id": "c1c2", "label": "choose 2 → forced 3", "children": ["leaf123"] },
    { "id": "leaf123", "label": "[1,2,3]", "highlight": true },
    { "id": "c1c3", "label": "choose 3 → forced 2", "children": ["leaf132"] },
    { "id": "leaf132", "label": "[1,3,2]", "highlight": true },
    { "id": "c2", "label": "choose 2 → yields [2,1,3], [2,3,1]", "highlight": true },
    { "id": "c3", "label": "choose 3 → yields [3,1,2], [3,2,1]", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Permutations([1,2,3]) — one used-set, marked on the way in and unmarked on the way out of every branch."
}
\`\`\`

**The in-place alternative.** Swap-based permuting: at level i, swap each candidate j (from i onward) into position i, recurse on i + 1, swap back. No used-array — position in the array *is* the bookkeeping.

**Complexity.** O(n! · n) — n! leaves, each copied at length n — versus the brute force's O(n^n) generate-then-filter. Ten elements is 3.6 million; twelve is half a billion.

**Thread.** You now hold all three shapes: in/out (Subsets), ordered-pool choosing with a start index (Combination Sum), and arrangement with a used-set (here). Subsets II, next, welds shape one to the skip-your-twin rule — the chapter's two big ideas in one small problem.`,
    },
    {
      slug: "subsets-ii",
      title: "Subsets II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/subsets-ii",
      summary: "The power set of a multiset: the collect-as-you-go tree plus the sorted sibling-skip, composed.",
      body: `**Signal.** "All unique subsets of an array that may contain duplicates" — duplicated input plus a uniqueness requirement on subsets is the tell that this composes two ideas you already have: the collect-as-you-go subsets tree, guarded by Combination Sum II's sibling-skip.

**Brute force.** Generate the full power set as if all elements were distinct, then dedupe with a set of sorted tuples — for [1,2,2] this generates [2] twice (once per copy of 2) before discarding the duplicate, paying generation cost for every collision.

**Optimal approach.** Chassis: the collect-as-you-go subsets tree (recurse on "which element joins next" from a start index, recording the path at *every* node — every prefix of choices is itself a valid subset). Guard: sort first, and inside each level's loop, skip candidates equal to their previous sibling — the exact twin rule from Combination Sum II. Children stacking duplicates ([2, 2]) remain reachable because a twin as *first choice within its level* is never skipped.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "sorted [1,2,2], start []", "children": ["n1", "n2first", "n2skip"] },
    { "id": "n1", "label": "choose 1 → [1]", "children": ["n1_2"] },
    { "id": "n1_2", "label": "choose first 2 (child) → [1,2]", "children": ["n1_2_2"] },
    { "id": "n1_2_2", "label": "choose second 2 (child) → [1,2,2]", "highlight": true },
    { "id": "n2first", "label": "choose first 2 → [2]", "children": ["n2_2"] },
    { "id": "n2_2", "label": "choose second 2 (child) → [2,2]", "highlight": true },
    { "id": "n2skip", "label": "choose second 2 as sibling alternative — SKIPPED" }
  ],
  "rootId": "root",
  "caption": "Every prefix along the tree is recorded as a subset (including [] at the root and [1], [2] mid-tree); the root-level second 2 is skipped as a sibling duplicate, but stacking it as a child is kept."
}
\`\`\`

**Why this problem earns its slot.** It is a *composition checkpoint* — the meta-lesson of the chapter's middle stretch: **uniqueness is engineered structurally**, by ordering the search space so each answer has one construction path, never by filtering output through a set.

**Complexity.** O(2ⁿ · n) upper bound; duplicates only shrink the tree — versus the brute force's wasted generate-and-dedupe on every duplicate.

**Thread.** So far the input constrained the tree. Generate Parentheses, next, flips it: the input is just a number, and *validity rules* are the entire shape of the search.`,
    },
    {
      slug: "generate-parentheses",
      title: "Generate Parentheses",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/generate-parentheses",
      summary: "Grow strings by two guarded rules — open if any remain, close only when a debt exists.",
      body: `**Signal.** "Generate every well-formed string of n bracket pairs" — validity being a *prefix* property (a string can be checked as invalid before it's even finished) is the tell for pruning branches before they're explored, rather than generating everything and filtering.

**Brute force.** Generate all 2^(2n) strings of length 2n over the alphabet {(, )}, then check each for validity with a stack scan — the valid strings are only the nth Catalan number (~4ⁿ), a tiny fraction of 2²ⁿ, so almost all generated work is wasted.

**Optimal approach.** Build strings left to right, one character per level: each position forks into open-or-close — but *guard both branches* with the two facts that define validity as a prefix property. Add an open bracket only while opens used < n. Add a close bracket only while closes used < opens used (an unmatched open exists to pay it off — chapter four's stack logic, reborn as a counter). At length 2n the guards guarantee the string is complete and valid — record it, no verification pass needed. Invalid strings are not generated-and-rejected; they are **unreachable**.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "\\"\\" (0 open, 0 close)", "children": ["open1"] },
    { "id": "open1", "label": "\\"(\\" (1 open, 0 close) — close illegal here", "children": ["oo", "oc"] },
    { "id": "oo", "label": "\\"((\\" (2 open, 0 close)", "children": ["ooc"] },
    { "id": "oc", "label": "\\"()\\" (1 open, 1 close) — open forced", "children": ["oco"] },
    { "id": "ooc", "label": "\\"(()\\" (2 open, 1 close)", "children": ["leaf1"] },
    { "id": "oco", "label": "\\"()(\\" (2 open, 1 close)", "children": ["leaf2"] },
    { "id": "leaf1", "label": "\\"(())\\" valid", "highlight": true },
    { "id": "leaf2", "label": "\\"()()\\" valid", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Generate Parentheses (n=2) — every branch is guarded; both leaves are valid, nothing is generated then rejected."
}
\`\`\`

**Complexity.** Output-bound: the nth Catalan number of strings, each length 2n — versus the brute force's O(2²ⁿ) generation before any filtering.

**Thread.** Constraints just shaped a search over an *invented* string. Word Search, next, pins the search to a physical grid — neighbours become the branches, and the visited-marking discipline previews the Graphs chapter.`,
    },
    {
      slug: "word-search",
      title: "Word Search",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/search-for-word",
      summary: "DFS from every cell, matching the word letter by letter — mark cells on the way in, restore on the way out.",
      body: `**Signal.** "Trace the word through adjacent grid cells, using no cell twice" — a path physically constrained by adjacency and non-reuse is the tell for DFS with a mark-on-entry, unmark-on-exit discipline — the mantra applied to a board instead of an abstract list.

**Brute force.** Enumerate every possible path of the word's length starting from every cell (all 4^length direction sequences per start), then check each for validity against the board and the word — massively redundant, since almost every path is rejected after only one or two mismatched letters.

**Optimal approach.** From each cell matching the word's first letter, launch a depth-first search: standing at (r, c) matching letter i, try all four neighbours for letter i + 1. The no-reuse rule is the mantra with a twist: *choose* means marking the current cell used (overwrite with a sentinel, or track a visited set), and *unchoose* means restoring it, so the cell is available to entirely different paths. Fail *fast and locally*: out-of-bounds, wrong letter, already-used — each check kills the branch before recursion, which is exactly what makes this cheap in practice despite the theoretical exponential bound.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "r0c0", "label": "A", "row": 0, "col": 0 },
    { "id": "r0c1", "label": "B", "row": 0, "col": 1 },
    { "id": "r0c2", "label": "C", "row": 0, "col": 2 },
    { "id": "r0c3", "label": "E", "row": 0, "col": 3 },
    { "id": "r1c0", "label": "S", "row": 1, "col": 0 },
    { "id": "r1c1", "label": "F", "row": 1, "col": 1 },
    { "id": "r1c2", "label": "C", "row": 1, "col": 2 },
    { "id": "r1c3", "label": "S (start)", "row": 1, "col": 3 },
    { "id": "r2c0", "label": "A", "row": 2, "col": 0 },
    { "id": "r2c1", "label": "D", "row": 2, "col": 1 },
    { "id": "r2c2", "label": "E", "row": 2, "col": 2 },
    { "id": "r2c3", "label": "E", "row": 2, "col": 3 }
  ],
  "edges": [
    { "from": "r1c3", "to": "r2c3" },
    { "from": "r2c3", "to": "r2c2" }
  ],
  "caption": "Word Search for \\"SEE\\" — DFS from the S at (1,3): its neighbour E at (2,3) matches, whose neighbour E at (2,2) completes the word. Cells are marked used on the way in and restored on the way out."
}
\`\`\`

**Cheap global wins worth mentioning:** a letter-frequency precheck (word needs three Es, board has two → instant false), and searching from the word's *rarer* end.

**Complexity.** O(cells · 3^length) — four directions first step, then three (no immediate backtrack into your parent) — versus the brute force's O(cells · 4^length) with no early termination.

**Thread.** Grid conquered. Next the search space turns inward again: Palindrome Partitioning backtracks over *where to cut a string*, with a validity test guarding every cut.`,
    },
    {
      slug: "palindrome-partitioning",
      title: "Palindrome Partitioning",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/palindrome-partitioning",
      summary: "Backtrack over cut positions: extend the next piece one letter at a time, recurse only past palindromic cuts.",
      body: `**Signal.** "Split a string into pieces so every piece is a palindrome; return all such partitions" — the choice being enumerated is not *elements* but **cut positions**, a new species of decision on the same backtracking skeleton, guarded by a palindrome check at every cut.

**Brute force.** Generate every possible way to insert cuts into the string (2^(n−1) total partitions, one bit per gap between characters), then filter to keep only those where every resulting piece is a palindrome — most candidate partitions get thrown away only after being fully built.

**Optimal approach.** Stand at index i (everything before it already cut into valid pieces). Try each candidate piece s[i..j] for j from i onward — but recurse past j **only if that piece is a palindrome** (the two-mirrored-pointers check from chapter two, now a pruning guard). Choose: push the piece. Explore: recurse from j + 1. Unchoose: pop. Non-palindromic prefixes kill their subtrees instantly: after piece "ab", no completion exists, so none is attempted.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "\\"aab\\", i=0", "children": ["pa", "pab", "paa"] },
    { "id": "pa", "label": "piece \\"a\\" (palindrome), i=1", "children": ["pa_a"] },
    { "id": "pa_a", "label": "piece \\"a\\" (palindrome), i=2", "children": ["pa_a_b"] },
    { "id": "pa_a_b", "label": "piece \\"b\\", i=3 (end) → [a,a,b]", "highlight": true },
    { "id": "pab", "label": "piece \\"ab\\" — NOT a palindrome → pruned" },
    { "id": "paa", "label": "piece \\"aa\\" (palindrome), i=2", "children": ["paa_b"] },
    { "id": "paa_b", "label": "piece \\"b\\", i=3 (end) → [aa,b]", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Palindrome Partitioning(\\"aab\\") — the \\"ab\\" branch dies instantly since it fails the palindrome guard; every surviving branch reaches a valid partition."
}
\`\`\`

**The optimisation conversation.** The palindrome check inside the loop is O(length) each, but the same substrings get re-tested across branches. Precompute a table isPal[i][j] (a palindrome is matching ends wrapped around a smaller palindrome) and every guard becomes O(1) — that table is *dynamic programming*, quietly previewing the chapters ahead.

**Complexity.** O(2ⁿ · n) worst case — a string like "aaaa" makes every cut valid — versus the brute force's identical O(2ⁿ) generation with no early pruning at all.

**Thread.** Next, the gentlest problem in the chapter, placed here almost as a breather: Letter Combinations of a Phone Number — the pure Cartesian product, no pruning at all, the skeleton with nothing to fight.`,
    },
    {
      slug: "letter-combinations-of-a-phone-number",
      title: "Letter Combinations of a Phone Number",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/combinations-of-a-phone-number",
      summary: "One level per digit, one branch per letter — the Cartesian product as a backtracking skeleton.",
      body: `**Signal.** "Digits 2–9 map to letters; return every letter string a digit string could spell" — one independent choice-set per position, combined in order with no constraints linking them, is the tell for a pure Cartesian product: the backtracking skeleton with nothing to prune.

**Brute force.** Nested loops, one per digit position, hard-coded to the maximum digit count — functionally identical to the recursive version but doesn't generalize to arbitrary-length input without rewriting the loop nest each time.

**Optimal approach.** As a decision tree: level i is digit i, its branches the digit's 3-4 letters, and *every* leaf at full depth is an answer. No constraints link the levels; nothing prunes. A lookup table (digit → letters), a recursion on digit index carrying a path, the choose/explore/unchoose loop over the current digit's letters, a copy recorded per leaf. If any earlier problem's structure felt murky, this is the one to re-derive from memory until the template is muscle.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "\\"23\\", path=\\"\\"", "children": ["a", "b", "c"] },
    { "id": "a", "label": "digit 2: 'a'", "children": ["ad", "ae", "af"] },
    { "id": "ad", "label": "digit 3: 'd' → \\"ad\\"", "highlight": true },
    { "id": "ae", "label": "digit 3: 'e' → \\"ae\\"", "highlight": true },
    { "id": "af", "label": "digit 3: 'f' → \\"af\\"", "highlight": true },
    { "id": "b", "label": "digit 2: 'b' → yields \\"bd\\", \\"be\\", \\"bf\\"", "highlight": true },
    { "id": "c", "label": "digit 2: 'c' → yields \\"cd\\", \\"ce\\", \\"cf\\"", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Letter Combinations(\\"23\\") — no branch is ever pruned; every leaf at full depth is a valid answer."
}
\`\`\`

**The iterative mirror.** Build combinations breadth-wise: start with [""], and per digit, replace the list with every string extended by every letter of that digit — [""] → [a, b, c] → [ad, ae, …]. Same output, queue-flavoured, no recursion.

**Edge case.** An empty digit string returns an empty *list* — not a list holding the empty string.

**Complexity.** O(4ⁿ · n) — up to four branches per digit, n-length copies at the leaves. Output-bound yet again: enumeration's cost lives in its answer, not its cleverness.

**Thread.** Skeleton bare, ideas rested — time for the finale the pattern was invented for. N-Queens: full-board constraint search, where the pruning bookkeeping *is* the solution.`,
    },
    {
      slug: "n-queens",
      title: "N-Queens",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/n-queens",
      summary: "One queen per row; columns and both diagonal families tracked in sets — the classic constraint search.",
      body: `**Signal.** "Place n queens so none attacks another — no shared row, column, or diagonal" — the problem backtracking is *named* for. Multiple simultaneous constraints (row, column, two diagonals) over a full board is the tell for shrinking the search space structurally before adding any pruning.

**Brute force.** Consider every way to place n queens on n² cells (C(n², n) placements), checking each complete placement for conflicts — astronomically larger than necessary, since it never uses the fact that no two queens can share a row.

**Optimal approach.** Shrink the space before searching: since no two queens share a row and there are exactly n queens for n rows, **every row holds exactly one queen** — the decision tree becomes level r choosing the column for row r's queen, an n-branch tree of depth n instead of n²-cell chaos. For O(1) attack checks: a set of occupied columns, plus two more sets keyed on r − c (one diagonal family) and r + c (the other) — every ↘ diagonal has constant r − c, every ↙ diagonal constant r + c. Three set-membership tests decide any square instantly. Choose: record the column, add c, r−c, r+c to their sets. Explore: recurse to row r + 1. Unchoose: remove all three, try the next column.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, "_", "_", "_"], "pointers": [{ "label": "row", "index": 0 }], "highlight": [0], "note": "Row 0: place the queen at column 0. Columns={0}, diagonals recorded." },
    { "cells": [0, 2, "_", "_"], "pointers": [{ "label": "row", "index": 1 }], "highlight": [1], "note": "Row 1: column 0 blocked (same column), column 1 blocked (same diagonal). Column 2 is legal — place there." },
    { "cells": [0, 2, "_", "_"], "pointers": [{ "label": "row", "index": 2 }], "highlight": [2], "note": "Row 2: columns 0 and 2 are column-blocked; column 1 and column 3 are diagonal-blocked. No legal column — dead end, backtrack." },
    { "cells": [1, "_", "_", "_"], "pointers": [{ "label": "row", "index": 0 }], "highlight": [0], "note": "Unwind all the way to row 0 and try column 1 instead. Columns={1}." },
    { "cells": [1, 3, 0, 2], "pointers": [{ "label": "row", "index": 3 }], "highlight": [0, 1, 2, 3], "note": "That branch threads all the way to row 3: columns [1,3,0,2] — a complete, conflict-free solution. Its mirror, starting from column 2, gives the second." }
  ],
  "caption": "N-Queens (n=4) — the choice stack of column assignments, built row by row and popped on every dead end."
}
\`\`\`

**Complexity.** Bounded by O(n!), far tighter in practice via pruning; space O(n) plus output — versus the brute force's C(n², n) complete-placement enumeration.

**Thread.** The chapter closes with search mastered over choices, strings, grids, and boards. Two roads now open per the roadmap: Graphs — this same DFS on structures that really exist — and 1-D DP, for when your tree keeps solving the same subproblem twice. The atlas takes Tries first, the third child of Trees, before the graph country. Next: Tries.`,
    },
  ],
};
