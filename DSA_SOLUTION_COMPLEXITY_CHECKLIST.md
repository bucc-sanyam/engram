# DSA content completion checklist — optimal solution + complexity section

> Task: every DSA question blog (`src/lib/dsa/topics/*.ts`) must have **(S)** an optimal-solution
> code block and **(C)** a `viz:complexity` section, in addition to its existing prose + diagram.
> Now also **(U)** a hellointerview-style "The problem." + "The signal." understanding opener.
> Diagrams (`viz:*`) are already present for all 150 problems (verified 2026-07-22).
>
> Mark `[x]` only after the file passes `scripts/validate-viz.mts` + `tsc --noEmit`.
> Legend: **S** = optimal solution code, **C** = complexity table, **U** = problem/signal opener.

### Global (done once, applies to all 150)
- [x] **LeetCode "Solve on LeetCode ↗" link** on every problem page — `dsaLeetcodeUrl()` in
      `src/lib/dsa/index.ts` (slug-derived + override map), optional `leetcodeUrl` field on the
      type, rendered next to "Practice on NeetCode ↗" in `.../[topic]/[slug]/page.tsx`.

## 1. arrays-hashing (9)
- [x] Contains Duplicate — U✅ S✅ C✅
- [x] Valid Anagram — U✅ S✅ C✅
- [x] Two Sum — U✅ S✅ C✅
- [x] Group Anagrams — U✅ S✅ C✅
- [x] Top K Frequent Elements — U✅ S✅ C✅
- [x] Encode and Decode Strings — U✅ S✅ C✅
- [x] Product of Array Except Self — U✅ S✅ C✅
- [x] Valid Sudoku — U✅ S✅ C✅
- [x] Longest Consecutive Sequence — U✅ S✅ C✅

## 2. two-pointers (5)
- [x] Valid Palindrome — U✅ S✅ C✅
- [x] Two Sum II (Sorted Array) — U✅ S✅ C✅
- [x] 3Sum — U✅ S✅ C✅
- [x] Container With Most Water — U✅ S✅ C✅
- [x] Trapping Rain Water — U✅ S✅ C✅

## 3. sliding-window (6)
- [x] Best Time to Buy and Sell Stock — U✅ S✅ C✅
- [x] Longest Substring Without Repeating Characters — U✅ S✅ C✅
- [x] Longest Repeating Character Replacement — U✅ S✅ C✅
- [x] Permutation in String — U✅ S✅ C✅
- [x] Minimum Window Substring — U✅ S✅ C✅
- [x] Sliding Window Maximum — U✅ S✅ C✅

## 4. stack (6)
- [x] Valid Parentheses — U✅ S✅ C✅
- [x] Min Stack — U✅ S✅ C✅
- [x] Evaluate Reverse Polish Notation — U✅ S✅ C✅
- [x] Daily Temperatures — U✅ S✅ C✅
- [x] Car Fleet — U✅ S✅ C✅
- [x] Largest Rectangle in Histogram — U✅ S✅ C✅

## 5. binary-search (7)
- [x] Binary Search — U✅ S✅ C✅
- [x] Search a 2D Matrix — U✅ S✅ C✅
- [x] Koko Eating Bananas — U✅ S✅ C✅
- [x] Find Minimum in Rotated Sorted Array — U✅ S✅ C✅
- [x] Search in Rotated Sorted Array — U✅ S✅ C✅
- [x] Time Based Key Value Store — U✅ S✅ C✅
- [x] Median of Two Sorted Arrays — U✅ S✅ C✅

## 6. linked-list (12)
- [x] Reverse Linked List — U✅ S✅ C✅
- [x] Merge Two Sorted Lists — U✅ S✅ C✅
- [x] Linked List Cycle — U✅ S✅ C✅
- [x] Reorder List — U✅ S✅ C✅
- [x] Remove Nth Node From End of List — U✅ S✅ C✅
- [x] Copy List With Random Pointer — U✅ S✅ C✅
- [x] Add Two Numbers — U✅ S✅ C✅
- [x] Find The Duplicate Number — U✅ S✅ C✅
- [x] LRU Cache — U✅ S✅ C✅
- [x] Merge K Sorted Lists — U✅ S✅ C✅
- [x] Reverse Nodes in K-Group — U✅ S✅ C✅

## 7. trees (15)
- [x] Invert Binary Tree — U✅ S✅ C✅
- [x] Maximum Depth of Binary Tree — U✅ S✅ C✅
- [x] Diameter of Binary Tree — U✅ S✅ C✅
- [x] Balanced Binary Tree — U✅ S✅ C✅
- [x] Same Tree — U✅ S✅ C✅
- [x] Subtree of Another Tree — U✅ S✅ C✅
- [x] Lowest Common Ancestor of a BST — U✅ S✅ C✅
- [x] Binary Tree Level Order Traversal — U✅ S✅ C✅
- [x] Binary Tree Right Side View — U✅ S✅ C✅
- [x] Count Good Nodes in Binary Tree — U✅ S✅ C✅
- [x] Validate Binary Search Tree — U✅ S✅ C✅
- [x] Kth Smallest Element in a BST — U✅ S✅ C✅
- [x] Construct Binary Tree from Preorder and Inorder Traversal — U✅ S✅ C✅
- [x] Binary Tree Maximum Path Sum — U✅ S✅ C✅
- [x] Serialize and Deserialize Binary Tree — U✅ S✅ C✅

## 8. heap (7)
- [ ] Kth Largest Element in a Stream
- [ ] Last Stone Weight
- [ ] K Closest Points to Origin
- [ ] Kth Largest Element in an Array
- [ ] Task Scheduler
- [ ] Design Twitter
- [ ] Find Median From Data Stream

## 9. backtracking (10)
- [ ] Subsets
- [ ] Combination Sum
- [ ] Combination Sum II
- [ ] Permutations
- [ ] Subsets II
- [ ] Generate Parentheses
- [ ] Word Search
- [ ] Palindrome Partitioning
- [ ] Letter Combinations of a Phone Number
- [ ] N-Queens

## 10. tries (3)
- [ ] Implement Trie (Prefix Tree)
- [ ] Design Add and Search Words Data Structure
- [ ] Word Search II

## 11. graphs (13)
- [ ] Number of Islands
- [ ] Max Area of Island
- [ ] Clone Graph
- [ ] Walls and Gates
- [ ] Rotting Oranges
- [ ] Pacific Atlantic Water Flow
- [ ] Surrounded Regions
- [ ] Course Schedule
- [ ] Course Schedule II
- [ ] Graph Valid Tree
- [ ] Number of Connected Components in an Undirected Graph
- [ ] Redundant Connection
- [ ] Word Ladder

## 12. advanced-graphs (6)
- [ ] Network Delay Time
- [ ] Reconstruct Itinerary
- [ ] Min Cost to Connect All Points
- [ ] Swim In Rising Water
- [ ] Alien Dictionary
- [ ] Cheapest Flights Within K Stops

## 13. dp-1d (12)
- [ ] Climbing Stairs
- [ ] Min Cost Climbing Stairs
- [ ] House Robber
- [ ] House Robber II
- [ ] Longest Palindromic Substring
- [ ] Palindromic Substrings
- [ ] Decode Ways
- [ ] Coin Change
- [ ] Maximum Product Subarray
- [ ] Word Break
- [ ] Longest Increasing Subsequence
- [ ] Partition Equal Subset Sum

## 14. dp-2d (11)
- [ ] Unique Paths
- [ ] Longest Common Subsequence
- [ ] Best Time to Buy and Sell Stock With Cooldown
- [ ] Coin Change II
- [ ] Target Sum
- [ ] Interleaving String
- [ ] Longest Increasing Path in a Matrix
- [ ] Distinct Subsequences
- [ ] Edit Distance
- [ ] Burst Balloons
- [ ] Regular Expression Matching

## 15. greedy (8)
- [ ] Maximum Subarray
- [ ] Jump Game
- [ ] Jump Game II
- [ ] Gas Station
- [ ] Hand of Straights
- [ ] Merge Triplets to Form Target Triplet
- [ ] Partition Labels
- [ ] Valid Parenthesis String

## 16. intervals (6)
- [ ] Insert Interval
- [ ] Merge Intervals
- [ ] Non Overlapping Intervals
- [ ] Meeting Rooms
- [ ] Meeting Rooms II
- [ ] Minimum Interval to Include Each Query

## 17. math-geometry (8)
- [ ] Rotate Image
- [ ] Spiral Matrix
- [ ] Set Matrix Zeroes
- [ ] Happy Number
- [ ] Plus One
- [ ] Pow(x, n)
- [ ] Multiply Strings
- [ ] Detect Squares

## 18. bit-manipulation (7)
- [ ] Single Number
- [ ] Number of 1 Bits
- [ ] Counting Bits
- [ ] Reverse Bits
- [ ] Missing Number
- [ ] Sum of Two Integers
- [ ] Reverse Integer

---

### Progress
- Chapters complete: **7 / 18** (arrays-hashing, two-pointers, sliding-window, stack, binary-search, linked-list, trees)
- Problems complete: **59 / 150**

### Final recheck (before marking task complete)
- [ ] `npx tsx scripts/validate-viz.mts src/lib/dsa/topics/*.ts` → all valid
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` clean
- [ ] Every problem has both a solution code block and a `viz:complexity` block (grep audit)














