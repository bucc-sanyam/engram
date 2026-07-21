# DSA Pattern Atlas — HelloInterview-style rewrite + diagram checklist

> Audit run 2026-07-20 via `npx tsx` importing `DSA_TOPICS` directly (not grep — grep undercounts because body strings use escaped `` \` `` fences). Ground truth: **150 problems total, 44 already have a `viz:*` diagram, 106 have none.** Confirms the gap the user flagged: most of the 150 individual question blogs render as prose-only, no visual.

## Target format per question (assumption — confirm/adjust before running the rewrite)

Current house style (`src/lib/dsa/topics/*.ts`, `problems[].body`) is a 6-beat narrative essay: **The problem. → The naive move. → The insight. → The walk-through. → Complexity. → The thread.** That's good prose but isn't the hellointerview.com shape. Proposed target structure per question — keep the existing prose voice, but reorganize/relabel so each of these is explicit and scannable:

1. **Signal** — the tell in the prompt that points at this pattern (what hellointerview calls out before anything else).
2. **Approach** — brute force framed briefly, then the optimal approach, each with its own Big-O (not just one "Complexity" line at the end).
3. **Diagram** — at least one `viz:*` block that visually walks the algorithm's state changes (not just prose narration of the walk-through).
4. **Complexity** — explicit final time/space line (keep).
5. **Thread** — the existing pattern-building link to the next problem (keep, it's a nice house touch hellointerview doesn't have).

This changes existing prose *structure/headers*, not just adds diagrams — every one of the 150 needs a pass, including the 44 that already have a diagram (their prose still uses the old 6-beat shape, not this one).

## How to use this checklist

Two independent checkboxes per problem:
- **[D]** = has a `viz:*` diagram
- **[R]** = body rewritten into the Signal/Approach/Diagram/Complexity/Thread shape above

Recommended execution: same pattern as the 2026-07-20 viz rollout — parallel background agents, one per chapter file (18 files = 18 agents, matches `src/lib/dsa/topics/*.ts`), each agent rewrites its own file's `intro` + all `problems[].body` and validates with `npx tsx scripts/validate-viz.mts src/lib/dsa/topics/<file>.ts` before finishing. Chapter intros also lack a diagram (all 18 show `intro viz: none`) — decide whether intros get the same treatment or stay as-is.

---

## Chapter 1 — Arrays & Hashing (`arrays-hashing.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20
- [x] [x] `contains-duplicate` — Contains Duplicate (Easy)
- [x] [x] `valid-anagram` — Valid Anagram (Easy)
- [x] [x] `two-sum` — Two Sum (Easy)
- [x] [x] `group-anagrams` — Group Anagrams (Medium)
- [x] [x] `top-k-frequent-elements` — Top K Frequent Elements (Medium)
- [x] [x] `encode-and-decode-strings` — Encode and Decode Strings (Medium)
- [x] [x] `product-of-array-except-self` — Product of Array Except Self (Medium)
- [x] [x] `valid-sudoku` — Valid Sudoku (Medium)
- [x] [x] `longest-consecutive-sequence` — Longest Consecutive Sequence (Medium)

## Chapter 2 — Two Pointers (`two-pointers.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20 (also normalized off old ASCII/Python template)
- [x] [x] `valid-palindrome` — Valid Palindrome (Easy)
- [x] [x] `two-sum-ii` — Two Sum II Sorted Array (Medium)
- [x] [x] `3sum` — 3Sum (Medium)
- [x] [x] `container-with-most-water` — Container With Most Water (Medium)
- [x] [x] `trapping-rain-water` — Trapping Rain Water (Hard)

## Chapter 3 — Sliding Window (`sliding-window.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20
- [x] [x] `best-time-to-buy-and-sell-stock` — Best Time to Buy and Sell Stock (Easy)
- [x] [x] `longest-substring-without-repeating-characters` — Longest Substring Without Repeating Characters (Medium)
- [x] [x] `longest-repeating-character-replacement` — Longest Repeating Character Replacement (Medium)
- [x] [x] `permutation-in-string` — Permutation in String (Medium)
- [x] [x] `minimum-window-substring` — Minimum Window Substring (Hard)
- [x] [x] `sliding-window-maximum` — Sliding Window Maximum (Hard)

## Chapter 4 — Stack (`stack.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20
- [x] [x] `valid-parentheses` — Valid Parentheses (Easy)
- [x] [x] `min-stack` — Min Stack (Medium)
- [x] [x] `evaluate-reverse-polish-notation` — Evaluate Reverse Polish Notation (Medium)
- [x] [x] `daily-temperatures` — Daily Temperatures (Medium)
- [x] [x] `car-fleet` — Car Fleet (Medium)
- [x] [x] `largest-rectangle-in-histogram` — Largest Rectangle in Histogram (Hard)

## Chapter 5 — Binary Search (`binary-search.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20 (also normalized off old ASCII/Python template)
- [x] [x] `binary-search` — Binary Search (Easy)
- [x] [x] `search-a-2d-matrix` — Search a 2D Matrix (Medium)
- [x] [x] `koko-eating-bananas` — Koko Eating Bananas (Medium)
- [x] [x] `find-minimum-in-rotated-sorted-array` — Find Minimum in Rotated Sorted Array (Medium)
- [x] [x] `search-in-rotated-sorted-array` — Search in Rotated Sorted Array (Medium)
- [x] [x] `time-based-key-value-store` — Time Based Key Value Store (Medium)
- [x] [x] `median-of-two-sorted-arrays` — Median of Two Sorted Arrays (Hard)

## Chapter 6 — Linked List (`linked-list.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20
- [x] [x] `reverse-linked-list` — Reverse Linked List (Easy)
- [x] [x] `merge-two-sorted-lists` — Merge Two Sorted Lists (Easy)
- [x] [x] `linked-list-cycle` — Linked List Cycle (Easy)
- [x] [x] `reorder-list` — Reorder List (Medium)
- [x] [x] `remove-nth-node-from-end-of-list` — Remove Nth Node From End of List (Medium)
- [x] [x] `copy-list-with-random-pointer` — Copy List With Random Pointer (Medium)
- [x] [x] `add-two-numbers` — Add Two Numbers (Medium)
- [x] [x] `find-the-duplicate-number` — Find The Duplicate Number (Medium)
- [x] [x] `lru-cache` — LRU Cache (Medium)
- [x] [x] `merge-k-sorted-lists` — Merge K Sorted Lists (Hard)
- [x] [x] `reverse-nodes-in-k-group` — Reverse Nodes in K-Group (Hard)

## Chapter 7 — Trees (`trees.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20
- [x] [x] `invert-binary-tree` — Invert Binary Tree (Easy)
- [x] [x] `maximum-depth-of-binary-tree` — Maximum Depth of Binary Tree (Easy)
- [x] [x] `diameter-of-binary-tree` — Diameter of Binary Tree (Easy)
- [x] [x] `balanced-binary-tree` — Balanced Binary Tree (Easy)
- [x] [x] `same-tree` — Same Tree (Easy)
- [x] [x] `subtree-of-another-tree` — Subtree of Another Tree (Easy)
- [x] [x] `lowest-common-ancestor-of-a-bst` — Lowest Common Ancestor of a BST (Medium)
- [x] [x] `binary-tree-level-order-traversal` — Binary Tree Level Order Traversal (Medium)
- [x] [x] `binary-tree-right-side-view` — Binary Tree Right Side View (Medium)
- [x] [x] `count-good-nodes-in-binary-tree` — Count Good Nodes in Binary Tree (Medium)
- [x] [x] `validate-binary-search-tree` — Validate Binary Search Tree (Medium)
- [x] [x] `kth-smallest-element-in-a-bst` — Kth Smallest Element in a BST (Medium)
- [x] [x] `construct-binary-tree-from-preorder-and-inorder-traversal` — Construct Binary Tree from Preorder and Inorder Traversal (Medium)
- [x] [x] `binary-tree-maximum-path-sum` — Binary Tree Maximum Path Sum (Hard)
- [x] [x] `serialize-and-deserialize-binary-tree` — Serialize and Deserialize Binary Tree (Hard)

## Chapter 8 — Heap / Priority Queue (`heap.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20
- [x] [x] `kth-largest-element-in-a-stream` — Kth Largest Element in a Stream (Easy)
- [x] [x] `last-stone-weight` — Last Stone Weight (Easy)
- [x] [x] `k-closest-points-to-origin` — K Closest Points to Origin (Medium)
- [x] [x] `kth-largest-element-in-an-array` — Kth Largest Element in an Array (Medium)
- [x] [x] `task-scheduler` — Task Scheduler (Medium)
- [x] [x] `design-twitter` — Design Twitter (Medium)
- [x] [x] `find-median-from-data-stream` — Find Median From Data Stream (Hard)

## Chapter 9 — Backtracking (`backtracking.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20
- [x] [x] `subsets` — Subsets (Medium)
- [x] [x] `combination-sum` — Combination Sum (Medium)
- [x] [x] `combination-sum-ii` — Combination Sum II (Medium)
- [x] [x] `permutations` — Permutations (Medium)
- [x] [x] `subsets-ii` — Subsets II (Medium)
- [x] [x] `generate-parentheses` — Generate Parentheses (Medium)
- [x] [x] `word-search` — Word Search (Medium)
- [x] [x] `palindrome-partitioning` — Palindrome Partitioning (Medium)
- [x] [x] `letter-combinations-of-a-phone-number` — Letter Combinations of a Phone Number (Medium)
- [x] [x] `n-queens` — N-Queens (Hard)

## Chapter 10 — Tries (`tries.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20
- [x] [x] `implement-trie-prefix-tree` — Implement Trie Prefix Tree (Medium)
- [x] [x] `design-add-and-search-words-data-structure` — Design Add and Search Words Data Structure (Medium)
- [x] [x] `word-search-ii` — Word Search II (Hard)

## Chapter 11 — Graphs (`graphs.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20
- [x] [x] `number-of-islands` — Number of Islands (Medium)
- [x] [x] `max-area-of-island` — Max Area of Island (Medium)
- [x] [x] `clone-graph` — Clone Graph (Medium)
- [x] [x] `walls-and-gates` — Walls and Gates (Medium)
- [x] [x] `rotting-oranges` — Rotting Oranges (Medium)
- [x] [x] `pacific-atlantic-water-flow` — Pacific Atlantic Water Flow (Medium)
- [x] [x] `surrounded-regions` — Surrounded Regions (Medium)
- [x] [x] `course-schedule` — Course Schedule (Medium)
- [x] [x] `course-schedule-ii` — Course Schedule II (Medium)
- [x] [x] `graph-valid-tree` — Graph Valid Tree (Medium)
- [x] [x] `number-of-connected-components` — Number of Connected Components in an Undirected Graph (Medium)
- [x] [x] `redundant-connection` — Redundant Connection (Medium)
- [x] [x] `word-ladder` — Word Ladder (Hard)

## Chapter 12 — Advanced Graphs (`advanced-graphs.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21
- [x] [x] `network-delay-time` — Network Delay Time (Medium)
- [x] [x] `reconstruct-itinerary` — Reconstruct Itinerary (Hard)
- [x] [x] `min-cost-to-connect-all-points` — Min Cost to Connect All Points (Medium)
- [x] [x] `swim-in-rising-water` — Swim In Rising Water (Hard)
- [x] [x] `alien-dictionary` — Alien Dictionary (Hard)
- [x] [x] `cheapest-flights-within-k-stops` — Cheapest Flights Within K Stops (Medium)

## Chapter 13 — 1-D Dynamic Programming (`dp-1d.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21 (also normalized off old ASCII/Python template; hardcoded `questions` arrays preserved)
- [x] [x] `climbing-stairs` — Climbing Stairs (Easy)
- [x] [x] `min-cost-climbing-stairs` — Min Cost Climbing Stairs (Easy)
- [x] [x] `house-robber` — House Robber (Medium)
- [x] [x] `house-robber-ii` — House Robber II (Medium)
- [x] [x] `longest-palindromic-substring` — Longest Palindromic Substring (Medium)
- [x] [x] `palindromic-substrings` — Palindromic Substrings (Medium)
- [x] [x] `decode-ways` — Decode Ways (Medium)
- [x] [x] `coin-change` — Coin Change (Medium)
- [x] [x] `maximum-product-subarray` — Maximum Product Subarray (Medium)
- [x] [x] `word-break` — Word Break (Medium)
- [x] [x] `longest-increasing-subsequence` — Longest Increasing Subsequence (Medium)
- [x] [x] `partition-equal-subset-sum` — Partition Equal Subset Sum (Medium)

## Chapter 14 — 2-D Dynamic Programming (`dp-2d.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21 (also normalized off old ASCII/Python template; hardcoded `questions` arrays preserved)
- [x] [x] `unique-paths` — Unique Paths (Medium)
- [x] [x] `longest-common-subsequence` — Longest Common Subsequence (Medium)
- [x] [x] `best-time-to-buy-and-sell-stock-with-cooldown` — Best Time to Buy and Sell Stock With Cooldown (Medium)
- [x] [x] `coin-change-ii` — Coin Change II (Medium)
- [x] [x] `target-sum` — Target Sum (Medium)
- [x] [x] `interleaving-string` — Interleaving String (Medium)
- [x] [x] `longest-increasing-path-in-a-matrix` — Longest Increasing Path in a Matrix (Hard)
- [x] [x] `distinct-subsequences` — Distinct Subsequences (Hard)
- [x] [x] `edit-distance` — Edit Distance (Hard)
- [x] [x] `burst-balloons` — Burst Balloons (Hard)
- [x] [x] `regular-expression-matching` — Regular Expression Matching (Hard)

## Chapter 15 — Greedy (`greedy.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21
- [x] [x] `maximum-subarray` — Maximum Subarray (Medium)
- [x] [x] `jump-game` — Jump Game (Medium)
- [x] [x] `jump-game-ii` — Jump Game II (Medium)
- [x] [x] `gas-station` — Gas Station (Medium)
- [x] [x] `hand-of-straights` — Hand of Straights (Medium)
- [x] [x] `merge-triplets-to-form-target-triplet` — Merge Triplets to Form Target Triplet (Medium)
- [x] [x] `partition-labels` — Partition Labels (Medium)
- [x] [x] `valid-parenthesis-string` — Valid Parenthesis String (Medium)

## Chapter 16 — Intervals (`intervals.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21
- [x] [x] `insert-interval` — Insert Interval (Medium)
- [x] [x] `merge-intervals` — Merge Intervals (Medium)
- [x] [x] `non-overlapping-intervals` — Non Overlapping Intervals (Medium)
- [x] [x] `meeting-rooms` — Meeting Rooms (Easy)
- [x] [x] `meeting-rooms-ii` — Meeting Rooms II (Medium)
- [x] [x] `minimum-interval-to-include-each-query` — Minimum Interval to Include Each Query (Hard)

## Chapter 17 — Math & Geometry (`math-geometry.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21
- [x] [x] `rotate-image` — Rotate Image (Medium)
- [x] [x] `spiral-matrix` — Spiral Matrix (Medium)
- [x] [x] `set-matrix-zeroes` — Set Matrix Zeroes (Medium)
- [x] [x] `happy-number` — Happy Number (Easy)
- [x] [x] `plus-one` — Plus One (Easy)
- [x] [x] `pow-x-n` — Pow(x, n) (Medium)
- [x] [x] `multiply-strings` — Multiply Strings (Medium)
- [x] [x] `detect-squares` — Detect Squares (Medium)

## Chapter 18 — Bit Manipulation (`bit-manipulation.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21
- [x] [x] `single-number` — Single Number (Easy)
- [x] [x] `number-of-1-bits` — Number of 1 Bits (Easy)
- [x] [x] `counting-bits` — Counting Bits (Easy)
- [x] [x] `reverse-bits` — Reverse Bits (Easy)
- [x] [x] `missing-number` — Missing Number (Easy)
- [x] [x] `sum-of-two-integers` — Sum of Two Integers (Medium)
- [x] [x] `reverse-integer` — Reverse Integer (Medium)

---

## ALL 18 CHAPTERS / 150 QUESTIONS COMPLETE — 2026-07-21
Every DSA question now has: a `viz:*` diagram, and a Signal/Brute-force/Optimal-approach/Complexity/Thread (hellointerview-style) rewrite. Chapters that used the older ASCII-art/Python-fence template (two-pointers, binary-search, dp-1d, dp-2d) were normalized to house style in the same pass. All hardcoded `questions` quiz arrays (added by a separate concurrent process partway through this work) were preserved untouched in every chapter that had them. Validated via `npx tsx scripts/validate-viz.mts` (all 150 diagrams parse) and `npx tsc --noEmit` (clean) after every chapter.

---

## Totals
- **150 problems**, **44 with a diagram (29%)**, **106 with none (71%)**
- **0 chapter intros** have a diagram (18/18 missing)
- **0 problems** currently use the proposed Signal/Approach/Diagram/Complexity/Thread structure — the rewrite pass `[R]` column is 100% open regardless of `[D]` status
- Worst-covered chapters (0 diagrams): **Intervals** (0/6)
- Best-covered: **Bit Manipulation** (2/7), **Sliding Window** (3/6), **Advanced Graphs** (2/6), **Backtracking** (3/10)

## Suggested next step
Don't implement yet per your ask — this is the checklist only. When ready: confirm the target format section above (especially whether chapter intros get a diagram too, and whether "Signal" callouts should reuse the `viz:*` fence system or be a plain markdown block), then run it the same way as the 2026-07-20 viz rollout — one background agent per chapter file, validated with `scripts/validate-viz.mts` before each finishes.
