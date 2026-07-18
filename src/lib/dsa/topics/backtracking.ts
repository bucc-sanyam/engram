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
      body: `**The problem.** Given distinct integers, return every possible subset — the power set. [1, 2, 3] has 8 subsets, from [] to [1, 2, 3]. The counting fact *is* the design hint: each of n elements independently in or out gives 2ⁿ — a binary decision per element.

**The insight.** Build the decision tree explicitly in your head: level i asks "does element i join?" Two branches — include it, or don't — and recurse to level i + 1 either way. Every leaf (level n) is one complete subset; the tree's 2ⁿ leaves are exactly the power set, no duplicates, no omissions, by construction. The code is the mantra verbatim: at index i, first branch — path.push(nums[i]), recurse(i + 1), path.pop() — then second branch — recurse(i + 1) with the element excluded. The pop is the unchoose; save a *copy* of the path at each leaf (saving the live reference is the classic aliasing bug — every entry in your output mutates in unison, and you learn about deep-versus-shallow the hard way).

**The walk-through.** [1, 2]: include 1 → include 2 → leaf [1, 2]; unchoose 2 → exclude 2 → leaf [1]; unchoose 1 → exclude 1 → include 2 → leaf [2]; exclude → leaf []. Four leaves, one shared path array, mutated and restored in perfect nesting — trace this once by hand and the entire chapter unlocks.

**The alternative shape.** A "collect as you go" variant recurses on "which element joins next" (loop from i, recording the path at *every* node, not just leaves). Same output, different tree — and that shape is the chassis for Combination Sum next. Knowing both, and that they enumerate the same set differently, is real fluency.

**Complexity.** O(2ⁿ · n) — 2ⁿ subsets, each copied at up to n length. Exponential output makes exponential time *optimal*, a phrase worth saying: the algorithm is not slow, the answer is big.

**The thread.** Subsets asked in-or-out once per element. Combination Sum loosens the rules — elements may repeat, and a target prunes the tree — the second canonical shape.`,
    },
    {
      slug: "combination-sum",
      title: "Combination Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/combination-target-sum",
      summary: "Reuse allowed, order ignored: recurse on 'smallest candidate I may still use' and prune past the target.",
      body: `**The problem.** Distinct candidate numbers and a target: return every unique combination summing to it, with each candidate usable *unlimited* times. [2, 3, 6, 7], target 7 → [[2, 2, 3], [7]].

**The duplicate-combinations trap.** Naive choosing ("pick any candidate each level") finds [2, 2, 3], [2, 3, 2] and [3, 2, 2] separately — the same *combination* discovered along three paths. Deduplicating afterwards is a hash-set-of-sorted-lists mess. The professional fix is structural: impose an order so each combination is constructible **one way only**. Pass a start index; at level with start = i, you may choose candidates[i] or anything later, *never earlier*. Combinations then emerge in non-decreasing candidate order — [2, 2, 3] exists, [3, 2, 2] is unbuildable. Duplicates are not filtered; they are never generated. This start-index discipline is *the* combination template, reused in every subset/combination problem forever after.

**Reuse, in one character.** Choosing candidates[i] and recursing with start = **i** (not i + 1) says: I may pick myself again. That single index decides reuse-allowed versus use-once — the entire difference between this problem and its sequel.

**Pruning.** Carry the remaining target. Negative → this branch is dead, return (with sorted candidates, you can break the loop outright — everything later only overshoots harder). Zero → record a copy of the path. The subtraction *is* the constraint doing the pruning; without it this is an infinite tree (2 can be chosen forever).

**The walk-through.** Target 7: choose 2 (remain 5) → 2 (3) → 2 (1) → 2 goes negative, 3 goes negative — dead end, unchoose back up → 3 (0) → record [2, 2, 3]. Later, start at 7: record [7].

**Complexity.** Exponential in the worst case (output can be); depth bounded by target / smallest candidate. State it honestly.

**The thread.** Now poison the input: duplicate candidates, single-use each. Combination Sum II needs one more idea — the sorted skip-your-twin rule — the chapter's most transferable trick.`,
    },
    {
      slug: "combination-sum-ii",
      title: "Combination Sum II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/combination-target-sum-ii",
      summary: "Duplicated input, unique output: sort, then skip equal siblings at the same tree level.",
      body: `**The problem.** Candidates may now contain *duplicates*, each usable **once**, and the output must contain no duplicate combinations. [10, 1, 2, 7, 6, 1, 5], target 8 → [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]] — note [1, 7] appears once despite two 1s existing.

**What actually changes.** Single-use is the easy half: recurse with start = i + 1 instead of i — the one-character flip promised last problem. The hard half: two equal candidates make the tree generate identical combinations down *different branches* — pick the first 1 with 7, or the second 1 with 7, and both paths deliver [1, 7].

**The insight — skip your twin.** Sort first, so equal values sit adjacent. Then, inside the choosing loop at any level: if candidates[i] equals candidates[i − 1] **and i is past this level's start**, skip it. Unpack the two conditions, because the precision is the whole trick. Equal-to-previous flags a twin. Past-the-start distinguishes *sibling* twins from *parent-child* twins: choosing 1 then choosing the second 1 beneath it (stacking duplicates — legitimate, that is how [1, 1, 6] gets built) has the twin as a *child*, where i equals the fresh start; choosing the second 1 as an *alternative* to the first at the same level (regenerating everything the first already explored) has i past start. Skip siblings, keep children. The rationale in one line: at each level, let a value open a subtree only once — the first copy explores everything any copy could.

**The walk-through.** Sorted [1, 1, 2, 5, 6, 7, 10], target 8. First 1 opens a subtree: within it the second 1 is chooseable (child) → [1, 1, 6]; also [1, 2, 5], [1, 7]. Back at the top level, the second 1 is a sibling twin → skipped wholesale. Then 2 → [2, 6]. No duplicate ever born.

**Complexity.** O(n log n) sort + exponential enumeration, as ever with combinatorial output.

**The thread.** Sort-and-skip-siblings is a *portable component* — you will bolt it onto Subsets II two problems from now. First, the third canonical shape: Permutations, where order matters and the tree branches on who goes next.`,
    },
    {
      slug: "permutations",
      title: "Permutations",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/permutations",
      summary: "Each level picks who goes next from the unused pool — n! leaves, one bookkeeping set.",
      body: `**The problem.** Return every ordering of a list of distinct integers. [1, 2, 3] has 3! = 6 permutations. Subsets asked *which elements*; permutations ask *in what order* — the third and last canonical enumeration shape.

**The insight.** The decision at each level is "who occupies the next position?" Level 0 chooses from all n; whoever is chosen is unavailable beneath that branch; level 1 chooses among the n − 1 others; the leaf at depth n is one complete ordering. Branching factors n, n − 1, … , 1 multiply to n! leaves — the tree *is* the factorial. Bookkeeping is the only design choice: how does a branch know who is used? A boolean used-array (or hash set) alongside the path, maintained by the mantra: mark, push, recurse, pop, **unmark** — the unchoose now has two halves, and forgetting the unmark starves every later branch of candidates (a bug that announces itself as mysteriously missing permutations).

**The walk-through.** [1, 2, 3]: choose 1 → choose 2 → forced 3 → leaf [1, 2, 3]; retreat, choose 3 → forced 2 → [1, 3, 2]; retreat twice, choose 2 at the top → [2, 1, 3], [2, 3, 1]; choose 3 → the final pair. Depth-first order, one path array, one used-array, perfectly restored between branches.

**The in-place alternative.** Swap-based permuting: at level i, swap each candidate j (from i onward) into position i, recurse on i + 1, swap back. No used-array — position in the array *is* the bookkeeping. Slicker, slightly harder to reason about with duplicates; know it as a variant.

**Complexity.** O(n! · n) — n! leaves, each copied at length n. Ten elements is 3.6 million; twelve is half a billion. Enumeration has walls, and naming them is part of the answer.

**The thread.** You now hold all three shapes: in/out (Subsets), ordered-pool choosing with a start index (Combination Sum), and arrangement with a used-set (here). Subsets II, next, welds shape one to the skip-your-twin rule — the chapter's two big ideas in one small problem.`,
    },
    {
      slug: "subsets-ii",
      title: "Subsets II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/subsets-ii",
      summary: "The power set of a multiset: the collect-as-you-go tree plus the sorted sibling-skip, composed.",
      body: `**The problem.** All unique subsets of an array that may contain duplicates. [1, 2, 2] → [], [1], [1, 2], [1, 2, 2], [2], [2, 2] — six, not eight: [2] via the first 2 and [2] via the second must collapse into one.

**The composition.** Nothing new is invented here — that is the point, and why the roadmap places it after both parents. Chassis: the collect-as-you-go subsets tree (recurse on "which element joins next" from a start index, recording the path at *every* node — every prefix of choices is itself a valid subset). Guard: sort first, and inside each level's loop, skip candidates equal to their previous sibling — the exact twin rule from Combination Sum II, same two conditions, same reasoning: the first copy of a value opens every subtree any copy could; later copies at the same level would only clone it. Children stacking duplicates ([2, 2]) remain reachable because a twin as *first choice within its level* is never skipped.

**The walk-through.** Sorted [1, 2, 2]. Record [] at the root. Choose 1 → record [1]; within: choose first 2 → [1, 2]; within: choose second 2 (child position — allowed) → [1, 2, 2]; back out; sibling second 2 → skipped. Back to top: choose first 2 → [2] → child second 2 → [2, 2]; top-level second 2 → skipped. Six subsets, zero filtering.

**Why this problem earns its slot.** It is a *composition checkpoint*. If Subsets and Combination Sum II genuinely landed, this is ten minutes; if either was memorised rather than understood, this is where that shows. Interviewers use it exactly that way. It also cements the meta-lesson of the chapter's middle stretch: **uniqueness is engineered structurally** — by ordering the search space so each answer has one construction path — never by filtering output through a set (which costs memory proportional to the duplicates you failed to prevent).

**Complexity.** O(2ⁿ · n) upper bound; duplicates only shrink the tree.

**The thread.** So far the input constrained the tree. Generate Parentheses, next, flips it: the input is just a number, and *validity rules* are the entire shape of the search.`,
    },
    {
      slug: "generate-parentheses",
      title: "Generate Parentheses",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/generate-parentheses",
      summary: "Grow strings by two guarded rules — open if any remain, close only when a debt exists.",
      body: `**The problem.** Generate every well-formed string of n bracket pairs. n = 3 → five strings, from ((())) to ()()(). (Five, not 2⁶ = 64 — the valid ones are the Catalan numbers, growing ~4ⁿ against the raw 2²ⁿ. The gap between those curves is exactly what pruning will save.)

**The insight.** Build strings left to right, one character per level: each position forks into open-or-close — but *guard both branches* with the two facts that define validity as a prefix property. You may add an open bracket while opens used < n (stock remains). You may add a close bracket only while closes used < opens used (an unmatched open exists to pay it off — chapter four's stack logic, reborn as a counter, because with one bracket type the stack's only useful content was its height). Recurse under each legal branch; at length 2n the guards guarantee the string is complete and valid — record it, no verification pass needed. Invalid strings are not generated-and-rejected; they are **unreachable**: the first illegal character is refused at its branch, and the entire subtree beneath — every one of its exponentially many completions — dies unexplored. This is pruning at its purest: constraint checks at partial answers, multiplied by subtree size.

**The walk-through.** n = 2. Root must open: "(". Fork: "((" (opens exhausted → forced close-close → "(())") and "()" (→ "()(" forced → "()()"). Two leaves, two valid strings, zero dead ends even visited — compare the 16 raw strings of length 4.

**The state.** Recursion carries (current string or char-path, opens, closes). The counters *are* the pruning; the mantra applies as ever if you mutate a shared path — push, recurse, pop.

**Complexity.** Output-bound: the nth Catalan number of strings, each length 2n. The algorithm touches nothing else — every recursion path ends in a recorded answer.

**The thread.** Constraints just shaped a search over an *invented* string. Word Search, next, pins the search to a physical grid — neighbours become the branches, and the visited-marking discipline previews the Graphs chapter.`,
    },
    {
      slug: "word-search",
      title: "Word Search",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/search-for-word",
      summary: "DFS from every cell, matching the word letter by letter — mark cells on the way in, restore on the way out.",
      body: `**The problem.** A grid of letters, a target word: can you trace the word through adjacent cells (up/down/left/right), using no cell twice? The first problem in this atlas where the decision tree lives on a *board* — branches are directions, and the path physically snakes.

**The insight.** From each cell matching the word's first letter, launch a depth-first search: standing at position (r, c) matching letter i, try all four neighbours for letter i + 1. Matching the final letter anywhere returns true up the whole stack. The no-reuse rule is the mantra with a twist: *choose* means marking the current cell used — overwrite it with a sentinel character, or track a visited set — and *unchoose* means restoring it, so the cell is available to entirely different paths. Miss the restore and later searches find a corrupted board; miss the *mark* and paths happily reuse cells ("SEES" traced over two E-cells that are one cell). This mark-explore-unmark-on-a-grid loop is, verbatim, the flood-fill DFS that opens the Graphs chapter — the roadmap put this problem here as your bridge.

**The pruning that matters.** Fail *fast and locally*: out-of-bounds, wrong letter, already-used — each check kills the branch before recursion. Cheap global wins worth mentioning: a letter-frequency precheck (word needs three Es, board has two → instant false), and searching from the word's *rarer* end.

**The walk-through.** Board rows ABCE / SFCS / ADEE, word "SEE". Launch from each S. The S at row 1, col 3: neighbour E (row 2) matches → mark, seek final E → its neighbour E (row 2, col 2) matches → word complete, true unwinds. Cells restore on the way out regardless — cleanliness is unconditional.

**Complexity.** O(cells · 3^length) — four directions first step, then three (no immediate backtrack into your parent); exponential in word length, fine in practice with the pruning. Space O(length) recursion depth.

**The thread.** Grid conquered. Next the search space turns inward again: Palindrome Partitioning backtracks over *where to cut a string*, with a validity test guarding every cut.`,
    },
    {
      slug: "palindrome-partitioning",
      title: "Palindrome Partitioning",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/palindrome-partitioning",
      summary: "Backtrack over cut positions: extend the next piece one letter at a time, recurse only past palindromic cuts.",
      body: `**The problem.** Split a string into pieces so every piece is a palindrome; return all such partitions. "aab" → [["a", "a", "b"], ["aa", "b"]]. The choice being enumerated is not *elements* but **cut positions** — a new species of decision, same backtracking skeleton.

**The insight.** Stand at index i (everything before it already cut into valid pieces). Your choice: where does the *next* piece end? Try each candidate piece s[i..j] for j from i onward — but recurse past j **only if that piece is a palindrome** (the two-mirrored-pointers check from chapter two, now a pruning guard). Choose: push the piece. Explore: recurse from j + 1. Unchoose: pop. Reaching the string's end means every piece along the path passed — record a copy. Non-palindromic prefixes kill their subtrees instantly: after piece "ab", no completion exists, so none is attempted.

**The walk-through.** "aab" from index 0: piece "a" ✓ → from 1: piece "a" ✓ → from 2: piece "b" ✓ → end, record ["a","a","b"]; back up: piece "ab" ✗ pruned. Back to 0: piece "aa" ✓ → "b" ✓ → record ["aa","b"]; piece "aab" ✗. Done — two partitions, and every recursion followed only valid ground.

**The optimisation conversation.** The palindrome check inside the loop is O(length) each — fine, but the same substrings get re-tested across branches. Precompute a table: isPal[i][j], filled by expanding shorter spans into longer ones (a palindrome is matching ends wrapped around a smaller palindrome), and every guard becomes O(1). That table is *dynamic programming* — precomputed overlapping subanswers — quietly previewing the chapters ahead; and "min cuts instead of all partitions" is the famous follow-up that goes full DP. Partition-style backtracking (word break, IP restoration, expression splits) is a whole problem family; this is its cleanest member.

**Complexity.** O(2ⁿ · n) worst case — a string like "aaaa" makes every cut valid, and the output itself is exponential.

**The thread.** Next, the gentlest problem in the chapter, placed here almost as a breather: Letter Combinations of a Phone Number — the pure Cartesian product, no pruning at all, the skeleton with nothing to fight.`,
    },
    {
      slug: "letter-combinations-of-a-phone-number",
      title: "Letter Combinations of a Phone Number",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/combinations-of-a-phone-number",
      summary: "One level per digit, one branch per letter — the Cartesian product as a backtracking skeleton.",
      body: `**The problem.** Digits 2–9 map to letters as on a phone keypad (2 → abc, 7 → pqrs…). Given a digit string, return every letter string it could spell. "23" → ad, ae, af, bd, be, bf, cd, ce, cf.

**The insight.** This is the Cartesian product — one choice-set per digit, answers formed by picking one item from each, in order. As a decision tree: level i is digit i, its branches the digit's 3-4 letters, and *every* leaf at full depth is an answer. No constraints link the levels; nothing prunes. That absence is the pedagogy: with the fighting gone, the skeleton stands naked — a lookup table (digit → letters), a recursion on digit index carrying a path, the choose/explore/unchoose loop over the current digit's letters, a copy recorded per leaf. If any earlier problem's structure felt murky, this is the one to re-derive from memory until the template is muscle.

**The walk-through.** "23": level for 2 branches a/b/c; beneath each, level for 3 branches d/e/f. Nine leaves in lexicographic stroll: ad, ae, af, then the b-triple, then the c-triple. The path never exceeds two characters; nine strings materialise from one buffer.

**The iterative mirror.** Build combinations breadth-wise instead: start with [""], and per digit, replace the list with every string extended by every letter of that digit — [""] → [a, b, c] → [ad, ae, …]. Same output, queue-flavoured, no recursion; the BFS-versus-DFS duality from Trees, replayed over generated strings. Worth writing once for the perspective.

**Edge case.** An empty digit string returns an empty *list* — not a list holding the empty string. One guard clause; a surprisingly common slip.

**Complexity.** O(4ⁿ · n) — up to four branches per digit, n-length copies at the leaves. Output-bound yet again: enumeration's cost lives in its answer, not its cleverness.

**The thread.** Skeleton bare, ideas rested — time for the finale the pattern was invented for. N-Queens: full-board constraint search, where the pruning bookkeeping *is* the solution.`,
    },
    {
      slug: "n-queens",
      title: "N-Queens",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/n-queens",
      summary: "One queen per row; columns and both diagonal families tracked in sets — the classic constraint search.",
      body: `**The problem.** Place n queens on an n×n board so none attacks another — no shared row, column, or diagonal. Return every distinct arrangement. The problem backtracking is *named* for, and the finale where every skill in the chapter reports for duty.

**The first insight: shrink the space before searching.** Naive placement considers all board cells per queen. But no two queens share a row *and* there are exactly n queens for n rows — so **every row holds exactly one queen**, and the decision tree becomes: level r chooses the column for row r's queen. From n² choose-any-cells chaos to an n-branch tree of depth n — permutation-shaped, like the chapter's third canonical form. Modelling the search space well is half of every constraint problem.

**The second insight: O(1) attack checks.** Placing at (r, c), what conflicts? A queen in column c — keep a set of occupied columns. A queen on either diagonal — and here is the classic trick: every ↘ diagonal has constant r − c, every ↙ diagonal constant r + c. Two more sets, keyed on those sums. Three set-membership tests decide any square instantly; no board scanning ever. (Rows need no set — one-per-row is enforced by the tree's very shape. Structure beats bookkeeping where you can get it.)

**The mantra, fully grown.** Choose: record the column, add c, r − c, r + c to their sets. Explore: recurse to row r + 1. Unchoose: remove all three, try the next column. A row with no legal column is a dead branch — retreat, and note how *early* most branches die: the diagonal sets prune enormous subtrees by row two or three. Reaching row n means n compatible placements — render the board, record it.

**The walk-through.** n = 4: row 0 col 0 → row 1 must skip cols 0 (column) and 1 (diagonal) → col 2 → row 2 has *no* legal square → backtrack; eventually the branch from row 0 col 1 threads through to a full solution (cols 1, 3, 0, 2) — and its mirror from col 2. Two solutions.

**Complexity.** Bounded by O(n!), far tighter in practice via pruning; space O(n) plus output.

**The thread.** The chapter closes with search mastered over choices, strings, grids, and boards. Two roads now open per the roadmap: Graphs — this same DFS on structures that really exist — and 1-D DP, for when your tree keeps solving the same subproblem twice. The atlas takes Tries first, the third child of Trees, before the graph country. Next: Tries.`,
    },
  ],
};
