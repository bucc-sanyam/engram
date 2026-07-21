import type { DsaTopic } from "../types";

/** Chapter 7 — Trees: recursion becomes the native language. */
export const trees: DsaTopic = {
  slug: "trees",
  title: "Trees",
  chapter: 7,
  tagline: "Every node is the root of something smaller — solve for one node, trust the recursion for the rest.",
  color: "#8ade7f",
  prereqs: ["binary-search", "linked-list"],
  unlocks: ["tries", "heap", "backtracking"],
  intro: `A binary tree is a linked list that learned to branch: each node holds a value and *two* onward pointers, left and right. That one extra pointer changes the geometry of everything. A chain of a million nodes is a million steps deep; a balanced tree of a million nodes is twenty levels deep. Hierarchy is how you fit vastness within arm's reach — which is why file systems, databases, HTML documents, and compilers all arrange the world as trees.

The mental shift this chapter demands is learning to think **recursively without simulating the recursion**. A tree is a self-similar object: every node is the root of its own smaller tree. So almost every tree algorithm has the same skeleton: handle the empty tree (the base case), recurse on the left child, recurse on the right, and *combine* the two answers at the node you are standing on.`,
  problems: [
    {
      slug: "invert-binary-tree",
      title: "Invert Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/invert-a-binary-tree",
      summary: "Swap left and right at every node — the recursive skeleton in its purest form.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners attempt to swap node values across the tree by storing them in arrays or manually re-assigning values level-by-level.
*Why this shatters*: Swapping values requires complex indexing and breaks tree structural pointers. Inverting a binary tree means **swapping the left and right child pointers at EVERY node**!

**The Structural Invariant: Recursive Pointer Swapping.**
At any node \`root\`:
1. **Base Case**: If \`root == null\`, return \`null\`.
2. **Recursive Inversion**:
   - Invert left subtree: \`leftInverted = invertTree(root.left)\`.
   - Invert right subtree: \`rightInverted = invertTree(root.right)\`.
3. **Swap**: \`root.left = rightInverted\`, \`root.right = leftInverted\`.
4. Return \`root\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "4", "label": "4 (root)" },
    { "id": "7", "label": "7 (swapped left)", "children": ["9", "6"] },
    { "id": "2", "label": "2 (swapped right)", "children": ["3", "1"] },
    { "id": "9", "label": "9" },
    { "id": "6", "label": "6" },
    { "id": "3", "label": "3" },
    { "id": "1", "label": "1" }
  ],
  "rootId": "4",
  "caption": "Invert Binary Tree — Recursively swapping left and right child pointers."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Overwrite Trap*: If you assign \`root.left = invertTree(root.right)\` BEFORE saving or inverting \`root.left\`, you overwrite the left pointer and lose the original left subtree! Use temporary variables or simultaneous assignment.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the core structural action taken at each node during Invert Binary Tree?",
          options: [
            "Swap the integer values of left and right nodes.",
            "Swap the left and right child pointers of the current node.",
            "Delete the left subtree.",
            "Re-balance the binary search tree."
          ],
          correct_index: 1,
          model_answer: "Inverting a tree means mirroring its structure by swapping the `left` and `right` child pointer references at every node.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the space complexity of the recursive Invert Binary Tree algorithm?",
          model_answer: "O(H) space, where H is the height of the tree, corresponding to the maximum depth of the call stack (O(log N) for balanced trees, O(N) for degenerate trees).",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "maximum-depth-of-binary-tree",
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/depth-of-binary-tree",
      summary: "Depth = 1 + max(left, right): the template every tree measurement is cut from.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to count nodes along every path using a global counter variable, running into bugs when tracking multiple branching paths.
*Why this shatters*: Managing global counters across recursive branches leads to dirty shared state.

**The Structural Invariant: Post-Order Height Accumulation.**
The maximum depth at any node \`root\` is:
$$\\text{depth}(\\text{root}) = 1 + \\max(\\text{depth}(\\text{root.left}), \\text{depth}(\\text{root.right}))$$
- **Base Case**: If \`root == null\`, depth is \`0\`.
- **Combine Step**: Take \`1\` (for current node) plus the maximum depth returned from either child subtree.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "3", "label": "3 (depth = 1 + max(1, 2) = 3)", "children": ["9", "20"] },
    { "id": "9", "label": "9 (depth = 1)" },
    { "id": "20", "label": "20 (depth = 1 + 1 = 2)", "children": ["15", "7"], "highlight": true },
    { "id": "15", "label": "15 (depth = 1)", "highlight": true },
    { "id": "7", "label": "7 (depth = 1)" }
  ],
  "rootId": "3",
  "caption": "Maximum Depth of Binary Tree — Post-order height accumulation."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Single-Node Tree*: If tree contains only root, \`depth(root.left) = 0\`, \`depth(root.right) = 0\` $\\rightarrow$ returns \`1 + max(0, 0) = 1\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the recurrence relation for calculating the maximum depth of a binary tree at node 'root'?",
          options: [
            "depth(root) = depth(left) + depth(right)",
            "depth(root) = 1 + max(depth(left), depth(right))",
            "depth(root) = max(left, right)",
            "depth(root) = 1 + min(depth(left), depth(right))"
          ],
          correct_index: 1,
          model_answer: "The depth of any node is 1 (counting itself) plus the maximum depth reached by its left or right subtrees.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "How can Maximum Depth be calculated iteratively using Breadth-First Search (BFS)?",
          model_answer: "Use a Queue level-by-level (level-order traversal). Increment a depth counter once per completed level queue snapshot loop until queue is empty.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "diameter-of-binary-tree",
      title: "Diameter of Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-diameter",
      summary: "The longest path bends at some node — compute heights, and harvest left + right at every bend.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners assume the longest path (diameter) must pass through the root of the tree.
*Why this shatters*: Counterexample: A tree with a deep, bushy left subtree (e.g. depth 5 on left-left and left-right) and no right subtree has its longest path **entirely contained within the left subtree**, without passing through the global root!

**The Structural Invariant: Bending Point Harvesting.**
Every path in a binary tree has a highest point where it "bends".
- For any node \`root\`, the longest path bending at \`root\` is:
  $$\\text{path\\_length}(\\text{root}) = \\text{height}(\\text{root.left}) + \\text{height}(\\text{root.right})$$
- Maintain a global variable \`max_diameter\`.
- Compute height post-order: \`height(node) = 1 + max(leftH, rightH)\`.
- At each node, update \`max_diameter = max(max_diameter, leftH + rightH)\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "1", "label": "1 (root)", "children": ["2", "3"] },
    { "id": "2", "label": "2 (bend node: diameter = 1+1=2)", "children": ["4", "5"], "highlight": true },
    { "id": "3", "label": "3" },
    { "id": "4", "label": "4", "highlight": true },
    { "id": "5", "label": "5", "highlight": true }
  ],
  "rootId": "1",
  "caption": "Diameter of Binary Tree — Harvesting longest path at every potential bend node."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Edges vs Nodes*: Diameter counts **edges**, not nodes! Path between 3 nodes contains 2 edges.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can't we simply calculate height(root.left) + height(root.right) at the global root to find the diameter?",
          options: [
            "Because tree height cannot be calculated recursively.",
            "Because the longest path (diameter) may bend at a deeper sub-node and never pass through the global root.",
            "Because tree nodes contain negative integers.",
            "Because diameter measures total nodes, not edges."
          ],
          correct_index: 1,
          model_answer: "The diameter is the longest path between ANY two nodes in the tree, which may be located entirely within a deep child subtree.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is returned by the recursive height function vs what is updated in the global diameter variable?",
          model_answer: "The height function returns `1 + max(leftH, rightH)` upward to its parent. It updates `max_diameter = max(max_diameter, leftH + rightH)` locally as a side effect.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "balanced-binary-tree",
      title: "Balanced Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/balanced-binary-tree",
      summary: "Check every node's child-height gap in the same single pass that computes the heights.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners calculate \`getHeight(node.left)\` and \`getHeight(node.right)\` at every node, then recurse on left and right children.
*Why this shatters*: Calling a separate \`getHeight\` function at every node re-traverses subtrees repeatedly, causing $O(N^2)$ quadratic time!

**The Structural Invariant: Bottom-Up Fast-Failure (-1 Sentinel).**
We can check balance and compute height in a **single $O(N)$ pass**:
- If a subtree is unbalanced ($|\\text{leftH} - \\text{rightH}| > 1$), return **\`-1\` as a poison/sentinel value**.
- If a child returns \`-1\`, immediately propagate \`-1\` upward without doing further height math.
- Otherwise, return standard height \`1 + max(leftH, rightH)\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "1", "label": "1" },
    { "id": "2", "label": "2 (unbalanced: leftH=2, rightH=0 -> returns -1)", "children": ["3"], "highlight": true },
    { "id": "3", "label": "3 (height=2)", "children": ["4"] },
    { "id": "4", "label": "4 (height=1)" }
  ],
  "rootId": "1",
  "caption": "Balanced Binary Tree — Bottom-up -1 sentinel propagation halts unnecessary calculations."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Definition of Height-Balanced*: A binary tree in which the left and right subtrees of EVERY node differ in height by **at most 1**.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does the bottom-up sentinel (-1) approach reduce time complexity for Balanced Binary Tree from O(N^2) to O(N)?",
          options: [
            "By sorting the tree elements first.",
            "By computing height and balance status simultaneously in one pass, instantly propagating -1 upward when an imbalance is found.",
            "By converting the tree into a linked list.",
            "By ignoring right subtrees."
          ],
          correct_index: 1,
          model_answer: "Propagating -1 when an imbalance is discovered short-circuits further height calculations, visiting each node at most once in O(N) time.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What condition defines an unbalanced node in a binary tree?",
          model_answer: "An unbalanced node has `Math.abs(leftHeight - rightHeight) > 1`.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "same-tree",
      title: "Same Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/same-binary-tree",
      summary: "Two trees in lockstep: equal roots, then equal left pairs, then equal right pairs.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners serialize both trees to arrays and check array equality.
*Why this shatters*: Standard traversals (like in-order) can produce identical arrays for different tree structures! Array conversion also uses $O(N)$ extra space.

**The Structural Invariant: Lockstep Structural & Value Equivalence.**
Traverse trees \`p\` and \`q\` simultaneously:
- **Base Cases**:
  - If both \`p == null\` and \`q == null\` $\\rightarrow$ Return \`true\` (both empty).
  - If one is \`null\` and the other is NOT \`null\` $\\rightarrow$ Return \`false\` (structural mismatch!).
  - If \`p.val != q.val\` $\\rightarrow$ Return \`false\` (value mismatch!).
- **Recursive Step**:
  - Return \`isSameTree(p.left, q.left) && isSameTree(p.right, q.right)\`.

\`\`\`viz:table-diff
{
  "columns": ["Node Position", "Tree P", "Tree Q", "Match Status"],
  "before": [["Root", 1, 1, "Match"], ["Left Child", 2, 2, "Match"], ["Right Child", 3, "null", "MISMATCH!"]],
  "after": [["Result", "-", "-", "Return FALSE immediately"]],
  "caption": "Same Tree — Lockstep traversal catching structural mismatch in O(N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Short-Circuiting*: Logical \`&&\` automatically short-circuits execution the moment any mismatch is found.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is returned when p is null and q is not null in Same Tree?",
          options: [
            "true",
            "false",
            "null",
            "0"
          ],
          correct_index: 1,
          model_answer: "One node being null while the other exists indicates a structural shape mismatch, returning false.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the worst-case time and space complexity of Same Tree?",
          model_answer: "O(min(N, M)) time and O(H) call stack space, where N and M are the node counts of trees p and q, and H is tree height.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "subtree-of-another-tree",
      title: "Subtree of Another Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/subtree-of-a-binary-tree",
      summary: "Try Same Tree at every node of the host — composition of two recursions, with a serialization twist.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners think \`subRoot\` must match starting at the main root of \`root\`.
*Why this shatters*: \`subRoot\` can match a subtree anchored at **any candidate node** deep inside \`root\`!

**The Structural Invariant: Composed Recursion.**
- **Outer Helper**: Traverse \`root\`. At every node \`node\`, check if \`isSameTree(node, subRoot)\` is true.
- **Base Cases**:
  - If \`subRoot == null\` $\\rightarrow$ Return \`true\` (an empty tree is a subtree of everything).
  - If \`root == null\` $\\rightarrow$ Return \`false\` (non-empty subRoot cannot be in an empty tree).
- **Recurse**:
  - Return \`isSameTree(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot)\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "3", "label": "3 (root: sameTree=false)" },
    { "id": "4", "label": "4 (candidate: sameTree=TRUE!)", "children": ["1", "2"], "highlight": true },
    { "id": "5", "label": "5" },
    { "id": "1", "label": "1", "highlight": true },
    { "id": "2", "label": "2", "highlight": true }
  ],
  "rootId": "3",
  "caption": "Subtree of Another Tree — Testing isSameTree at every anchor node."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Exact Subtree Requirement*: A subtree must include a node and ALL of its descendants! A matching structure that cuts off before reaching leaf nodes is NOT a valid subtree.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the worst-case time complexity of Subtree of Another Tree when main tree has N nodes and subRoot has M nodes?",
          options: [
            "O(N + M)",
            "O(N * M)",
            "O(N^2)",
            "O(log N)"
          ],
          correct_index: 1,
          model_answer: "For each of the N nodes in the main tree, we may execute an isSameTree check taking O(M) time, giving O(N * M) overall.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "How can String Serialization solve Subtree of Another Tree in O(N + M) time?",
          model_answer: "Serialize both trees into strings using pre-order traversal with explicit null markers (e.g. `#`). Then check if `serial(subRoot)` is a substring of `serial(root)` using KMP string matching.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "lowest-common-ancestor-of-a-bst",
      title: "Lowest Common Ancestor of a BST",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree",
      summary: "The LCA is where two values part ways — and the BST invariant tells you which way to walk.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use general binary tree LCA algorithms, storing parent paths in hash sets ($O(N)$ space).
*Why this shatters*: A **Binary Search Tree (BST)** has a strict ordering invariant ($L < \\text{root} < R$). We can find LCA in $O(H)$ time and $O(1)$ space by following the BST invariant!

**The Structural Invariant: The Split Point.**
- If BOTH \`p.val\` and \`q.val\` are **smaller** than \`curr.val\`: The LCA MUST lie in the **left subtree**! Move \`curr = curr.left\`.
- If BOTH \`p.val\` and \`q.val\` are **larger** than \`curr.val\`: The LCA MUST lie in the **right subtree**! Move \`curr = curr.right\`.
- **The Split / Fork Point**: If \`p\` and \`q\` lie on **opposite sides** of \`curr\` (or one of them equals \`curr\`), \`curr\` IS the Lowest Common Ancestor!

\`\`\`viz:tree
{
  "nodes": [
    { "id": "6", "label": "6 (curr: 2 < 6 and 8 > 6 -> SPLIT!)", "children": ["2", "8"], "highlight": true },
    { "id": "2", "label": "2 (p)", "highlight": true },
    { "id": "8", "label": "8 (q)", "highlight": true }
  ],
  "rootId": "6",
  "caption": "Lowest Common Ancestor of a BST — The split point where paths to p and q diverge."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Iterative Execution*: Can be written in a simple \`while(curr)\` loop with $O(1)$ space.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In a Binary Search Tree, what condition confirms that current node 'curr' is the Lowest Common Ancestor of nodes p and q?",
          options: [
            "When curr is a leaf node.",
            "When p and q lie on opposite sides of curr (one in left subtree, one in right subtree) or curr equals p or q.",
            "When curr.val == p.val + q.val.",
            "When curr has no children."
          ],
          correct_index: 1,
          model_answer: "The LCA is the first node where the search paths to p and q diverge in opposite directions.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity to find LCA in a balanced BST of N nodes?",
          model_answer: "O(log N) time, corresponding to the height H of the balanced search tree.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "binary-tree-level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/level-order-traversal-of-binary-tree",
      summary: "BFS with a queue, level by level: snapshot the queue's size to know where each floor ends.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use standard Queue-based BFS, but fail to group nodes into separate sub-arrays by tree level.
*Why this shatters*: Pushing nodes into a queue flattens them. Without level boundaries, level 1 and level 2 nodes blur together.

**The Structural Invariant: Queue Level-Size Snapshot.**
To preserve level boundaries in BFS:
- Initialize \`queue = [root]\`.
- While queue is not empty:
  - **Snapshot Size**: \`level_size = queue.length\`.
  - Process **EXACTLY \`level_size\` nodes** in a loop for the current level.
  - Enqueue children of each dequeued node.
  - Append the current level's node values as a sub-array to \`result\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [3], "note": "Queue=[3], size=1. Dequeue 3, enqueue children 9, 20. Level 0 result: [[3]]." },
    { "cells": [9, 20], "note": "Queue=[9, 20], size=2. Dequeue 9 & 20, enqueue children 15, 7. Level 1 result: [[3], [9, 20]]." },
    { "cells": [15, 7], "note": "Queue=[15, 7], size=2. Dequeue 15 & 7. Level 2 result: [[3], [9, 20], [15, 7]]." }
  ],
  "caption": "Level Order Traversal — BFS using queue size snapshotting."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty Tree*: If \`root == null\`, return \`[]\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does Level Order Traversal separate nodes belonging to different tree levels using a single Queue?",
          options: [
            "By sorting the queue after every push.",
            "By recording queue.length at the beginning of each level loop and iterating exactly that many times.",
            "By using two separate stacks.",
            "By deleting odd nodes."
          ],
          correct_index: 1,
          model_answer: "Snapshotting `queue.length` before processing a level isolates the nodes of the current level from new child nodes being pushed for the next level.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the maximum space complexity of Level Order Traversal for a full binary tree of N nodes?",
          model_answer: "O(W) space where W is the maximum width of the tree. For a full binary tree, the last level contains N/2 nodes, so space is O(N).",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "binary-tree-right-side-view",
      title: "Binary Tree Right Side View",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-right-side-view",
      summary: "Stand to the tree's right: you see exactly one node per level — the last one in BFS order.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners think they can just traverse down \`root.right\` child pointers.
*Why this shatters*: Counterexample: If a left child subtree extends 5 levels deep while the right child subtree is only 2 levels deep, the **bottom 3 levels of the left subtree are visible** from the right side!

**The Structural Invariant: Rightmost Node per Level.**
- Perform BFS Level-Order Traversal with Queue size snapshotting.
- For each level:
  - The **LAST node processed in that level's loop** is the rightmost visible node!
  - Append its value to \`result\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1], "note": "Level 0: Queue [1], last node is 1 -> View: [1]." },
    { "cells": [2, 3], "highlight": [1], "note": "Level 1: Queue [2, 3], last node is 3 -> View: [1, 3]." },
    { "cells": [5, 4], "highlight": [1], "note": "Level 2: Queue [5, 4], last node is 4 (from left subtree!) -> View: [1, 3, 4]." }
  ],
  "caption": "Binary Tree Right Side View — Extracting the last node of each level in BFS."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *DFS Alternative*: DFS prioritizing right child first (\`root.right\` before \`root.left\`). Add node to result if \`current_depth == result.length\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can't we simply traverse down root.right pointers to get the Right Side View?",
          options: [
            "Because right pointers are immutable.",
            "Because deeper nodes in left subtrees become visible if the right subtrees end earlier.",
            "Because BFS requires binary search trees.",
            "Because root.right can be null."
          ],
          correct_index: 1,
          model_answer: "If the right branch is shorter than the left branch, the bottom nodes of the left branch remain visible from the right side.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "In DFS right-first traversal, what condition determines if a node is the first visible node at its depth?",
          model_answer: "When `current_depth === result.length`. Since right subtrees are visited first, the first node encountered at any depth level is guaranteed to be the rightmost node.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "count-good-nodes-in-binary-tree",
      title: "Count Good Nodes in Binary Tree",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-good-nodes-in-binary-tree",
      summary: "Pass the path's running maximum down the recursion — top-down flow, the mirror of everything so far.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to check if a node is good by looking at its immediate parent.
*Why this shatters*: A node is "good" if **NO node on the path from root to it** is greater than it! Checking only the parent misses larger grandparents upstream.

**The Structural Invariant: Top-Down Running Max Propagation.**
Pass \`maxSoFar\` down the call stack:
- At \`node\`:
  - If \`node.val >= maxSoFar\`: Node is **GOOD**! Count $+ 1$.
  - Update \`newMax = max(maxSoFar, node.val)\`.
  - Recurse on children passing \`newMax\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "3", "label": "3 (root: max=3 -> GOOD)", "children": ["1", "4"], "highlight": true },
    { "id": "1", "label": "1 (1 < max 3 -> NOT good)" },
    { "id": "4", "label": "4 (4 >= max 3 -> GOOD)", "children": ["1b", "5"], "highlight": true },
    { "id": "1b", "label": "1" },
    { "id": "5", "label": "5 (5 >= max 4 -> GOOD)", "highlight": true }
  ],
  "rootId": "3",
  "caption": "Count Good Nodes in Binary Tree — Propagating path maximum top-down."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Equal Values*: Nodes with values EQUAL to \`maxSoFar\` are GOOD (\`node.val >= maxSoFar\`). Root is always good.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What information must be passed downward to child nodes in Count Good Nodes?",
          options: [
            "The height of the tree.",
            "The maximum node value encountered on the path from root to the current node.",
            "The total count of leaf nodes.",
            "The sum of all ancestor values."
          ],
          correct_index: 1,
          model_answer: "Threading `maxSoFar` down the recursion allows each node to compare its value against the maximum ancestor on its specific root-to-node path.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "Why is the root node always considered a good node?",
          model_answer: "Because there are no ancestor nodes on the path before the root. Its value is trivially greater than or equal to all preceding path elements.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "validate-binary-search-tree",
      title: "Validate Binary Search Tree",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-binary-search-tree",
      summary: "Not 'children versus parent' — every node must sit inside a range its whole ancestry carved out.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners check if \`node.left.val < node.val\` and \`node.right.val > node.val\` for every node.
*Why this shatters*: **The Famous BST Trap!** Counterexample: Root 5, Left child 3, Right child of 3 is **6**. Locally $3 < 6$ and $3 < 5$ passes, but **6 is in root 5's left subtree**, violating BST rules ($6 > 5$)!

**The Structural Invariant: Ancestor Bound Shrinking.**
Every node must fall strictly within an allowed range \`(min_bound, max_bound)\`.
- Root starts with \`(-Infinity, +Infinity)\`.
- When going **Left**: Upper bound shrinks $\\rightarrow$ \`(low, node.val)\`.
- When going **Right**: Lower bound increases $\\rightarrow$ \`(node.val, high)\`.
- If \`node.val <= low\` or \`node.val >= high\`, return \`false\`!

\`\`\`viz:tree
{
  "nodes": [
    { "id": "5", "label": "5 (bound: -inf, +inf)" },
    { "id": "3", "label": "3 (bound: -inf, 5)" },
    { "id": "6", "label": "6 (bound: 3, 5 -> INVALID! 6 > 5)", "highlight": true }
  ],
  "rootId": "5",
  "caption": "Validate BST — Ancestor bounds check catches invalid deep descendants."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Strict Inequality*: BST requires STRICT inequality ($<$, not $\\le$). Duplicate values in subtrees render a BST invalid!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does checking only immediate parent-child relationships fail to validate a Binary Search Tree?",
          options: [
            "Because trees can have negative numbers.",
            "Because deep descendants can violate constraints imposed by higher ancestor nodes without violating their immediate parent.",
            "Because parent-child checks take O(N^2) time.",
            "Because leaf nodes have no children."
          ],
          correct_index: 1,
          model_answer: "A node in a left subtree must be smaller than ALL ancestors above it, not just its direct parent. Subtree range checking enforces global ancestry limits.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "How can In-Order Traversal be used to validate a Binary Search Tree?",
          model_answer: "An in-order traversal of a valid BST visits nodes in strictly ascending sorted order. We can track `prev` node value and verify `curr.val > prev.val` for every visit.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "kth-smallest-element-in-a-bst",
      title: "Kth Smallest Element in a BST",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/kth-smallest-integer-in-bst",
      summary: "In-order traversal emits a BST in sorted order — walk it with a countdown and stop at k.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners collect all tree elements into an array, sort the array, and pick index $K - 1$ ($O(N \\log N)$).
*Why this shatters*: A BST **already has sorted order embedded in its structure** via In-Order Traversal!

**The Structural Invariant: In-Order Traversal Countdown.**
In-Order Traversal (Left $\\rightarrow$ Node $\\rightarrow$ Right) visits BST nodes in **strictly sorted ascending order**.
- Use Iterative In-Order Traversal with a Stack.
- Push all left nodes to stack.
- Pop node (this is the next smallest element!).
- Decrement $K$. If $K == 0$, return popped node's value!
- Step to \`node.right\` and repeat.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "5", "label": "5" },
    { "id": "3", "label": "3 (3rd visit: K=0 -> ANSWER=3)", "children": ["2", "4"], "highlight": true },
    { "id": "2", "label": "2 (2nd visit)", "children": ["1"], "highlight": [true] },
    { "id": "1", "label": "1 (1st visit)", "highlight": true },
    { "id": "4", "label": "4" }
  ],
  "rootId": "5",
  "caption": "Kth Smallest Element in a BST — In-Order traversal countdown stopping at K=0."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Early Exit*: Iterative traversal allows stopping immediately when the $K$-th node is reached, avoiding visiting remaining nodes!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Which tree traversal order visits nodes of a Binary Search Tree in sorted ascending order?",
          options: [
            "Pre-Order Traversal",
            "In-Order Traversal",
            "Post-Order Traversal",
            "Level-Order Traversal"
          ],
          correct_index: 1,
          model_answer: "In-Order Traversal visits (Left Subtree, Current Node, Right Subtree), which naturally outputs BST elements in strictly increasing sorted order.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of finding the K-th smallest element in a balanced BST using iterative In-Order traversal?",
          model_answer: "O(H + K) time, where H is tree height and K is the target rank, because we stop immediately on the K-th visit.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
      title: "Construct Binary Tree from Preorder and Inorder Traversal",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal",
      summary: "Preorder names the root; inorder splits left from right — recurse on the two halves.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners get stuck trying to construct the tree using only preorder traversal.
*Why this shatters*: Preorder traversal alone is ambiguous — a left-skewed tree and right-skewed tree can produce identical preorder sequences!

**The Structural Invariant: Preorder Root Identification + Inorder Subtree Splitting.**
1. **Preorder First Element IS the Root**: \`rootVal = preorder[preorder_idx++]\`.
2. **Inorder Split**: Find \`rootVal\` in \`inorder\` array at index \`mid\`.
   - Elements to the left of \`mid\` in \`inorder\` belong to **Left Subtree**.
   - Elements to the right of \`mid\` in \`inorder\` belong to **Right Subtree**.
3. **Recursion**:
   - \`root.left = build(inorder_start, mid - 1)\`
   - \`root.right = build(mid + 1, inorder_end)\`
4. **Optimization**: Store \`inorder\` value $\\rightarrow$ index mapping in a Hash Map for $O(1)$ split lookups!

\`\`\`viz:table-diff
{
  "columns": ["Traversal Type", "Array Content", "Structural Role"],
  "before": [["Preorder", "[3, 9, 20, 15, 7]", "First element (3) = Root"], ["Inorder", "[9, 3, 15, 20, 7]", "Split at 3: Left=[9], Right=[15,20,7]"]],
  "after": [["Result", "Root 3 created", "Recurse on Left [9] & Right [15,20,7]"]],
  "caption": "Construct Tree — Preorder determines root, Inorder partitions subtrees."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Order of Recursion*: Must build \`root.left\` BEFORE \`root.right\` because \`preorder\` sequence lists left subtree nodes before right subtree nodes!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why do we use a Hash Map during the construction of Binary Tree from Preorder and Inorder traversals?",
          options: [
            "To sort the preorder array.",
            "To lookup the root value's index in the inorder array in O(1) time instead of O(N) linear scanning.",
            "To store created TreeNode objects.",
            "To count total leaf nodes."
          ],
          correct_index: 1,
          model_answer: "Pre-indexing the inorder array in a Hash Map reduces the subtree partitioning search from O(N) to O(1), improving total build time from O(N^2) to O(N).",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why must root.left be constructed before root.right in the recursive step?",
          model_answer: "Because the preorder traversal visits nodes in (Root -> Left -> Right) order. The next available root value in the preorder array corresponds to the left child.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "binary-tree-maximum-path-sum",
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-maximum-path-sum",
      summary: "At each node, two different questions: the best path through me, and the best path I can offer upward.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners calculate path sums for every pair of nodes ($O(N^2)$).
*Why this shatters*: Nodes can contain **negative values**! A negative subtree reduces total path sum, so paths must be allowed to **clamp negative subtrees to 0**!

**The Structural Invariant: Local Bend Harvest vs Upward Single-Branch Gain.**
At each node \`curr\`:
1. Calculate max gain from left child: \`leftGain = max(0, maxGain(curr.left))\` (clamp negative to 0!).
2. Calculate max gain from right child: \`rightGain = max(0, maxGain(curr.right))\`.
3. **The Bend Harvest (Local Candidate Path)**:
   $$\\text{price\\_new\\_path} = \\text{curr.val} + \\text{leftGain} + \\text{rightGain}$$
   Update \`max_path_sum = max(max_path_sum, price_new_path)\`.
4. **The Upward Return (Single Branch)**:
   A parent can only extend a path through ONE of \`curr\`'s branches!
   Return \`curr.val + max(leftGain, rightGain)\` upward to parent.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "-10", "label": "-10 (root)" },
    { "id": "9", "label": "9 (left gain = 9)" },
    { "id": "20", "label": "20 (bend node: local path = 15+20+7 = 42!)", "children": ["15", "7"], "highlight": true },
    { "id": "15", "label": "15", "highlight": true },
    { "id": "7", "label": "7", "highlight": true }
  ],
  "rootId": "-10",
  "caption": "Binary Tree Maximum Path Sum — Local path 42 bends at 20 without visiting root."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Negative All-Node Tree*: Initialize \`max_path_sum = -Infinity\`. If all nodes are negative (e.g. \`[-3]\`), the result is the least negative single node (\`-3\`).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why do we return 'curr.val + max(leftGain, rightGain)' to the parent caller, but update max_path_sum with 'curr.val + leftGain + rightGain'?",
          options: [
            "Because parents can only connect to one branch of a child (paths cannot fork), whereas a local bend at curr can combine both left and right branches.",
            "Because leftGain is always larger than rightGain.",
            "To prevent stack overflow.",
            "Because trees are non-linear."
          ],
          correct_index: 0,
          model_answer: "A valid path cannot fork. A node extending upward to its parent can only contribute one of its two branch paths, but as a local bending point, it can combine both subtrees.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "Why must child gain values be clamped using `max(0, gain)`?",
          model_answer: "If a child subtree returns a negative net path sum, including it would decrease the total path sum. Clamping to 0 effectively chooses to exclude that negative subtree.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "serialize-and-deserialize-binary-tree",
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/serialize-and-deserialize-binary-tree",
      summary: "Preorder with explicit nulls uniquely describes any tree — and reads back as a self-consuming stream.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners serialize nodes using standard preorder traversal without recording null pointers.
*Why this shatters*: Preorder without null markers is ambiguous! \`[1, 2]\` could represent \`1 -> left:2\` OR \`1 -> right:2\`.

**The Structural Invariant: Preorder Stream with Explicit Sentinel Markers.**
- **Serialize**:
  - Run Preorder Traversal.
  - Emit node value followed by delimiter \`","\`.
  - For null pointers, emit sentinel \`"N,"\`.
  - Example tree becomes: \`"1,2,N,N,3,4,N,N,5,N,N,"\`.
- **Deserialize**:
  - Convert string into an array/queue of tokens.
  - Dequeue next token \`val\`:
    - If \`val == "N"\` $\\rightarrow$ Return \`null\`.
    - Otherwise, create \`node = new TreeNode(parseInt(val))\`.
    - \`node.left = deserialize(tokens)\`
    - \`node.right = deserialize(tokens)\`
    - Return \`node\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["1", "2", "N", "N", "3", "4", "N", "N", "5", "N", "N"], "pointers": [{ "label": "token=1", "index": 0 }], "note": "Read '1' -> Create Root(1). Recurse left." },
    { "cells": ["1", "2", "N", "N", "3", "4", "N", "N", "5", "N", "N"], "pointers": [{ "label": "token=2", "index": 1 }], "note": "Read '2' -> Create Node(2). Recurse left." },
    { "cells": ["1", "2", "N", "N", "3", "4", "N", "N", "5", "N", "N"], "pointers": [{ "label": "token=N", "index": 2 }], "highlight": [2], "note": "Read 'N' -> Node(2).left = null. Next 'N' -> Node(2).right = null. Node 2 done!" }
  ],
  "caption": "Serialize & Deserialize Binary Tree — Self-consuming token queue reconstruction."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Self-Consuming Queue*: Using an index or \`shift()\` on token queue guarantees that subtree constructors consume exactly their required tokens in $O(N)$ time.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does Preorder Traversal WITH explicit null markers ('N') uniquely define a binary tree shape?",
          options: [
            "Because null markers provide the exact structural boundaries needed to reconstruct parent-child links without needing a second traversal array.",
            "Because pre-order sorting eliminates duplicate values.",
            "Because string tokens consume less memory.",
            "Because sentinel nodes balance the tree."
          ],
          correct_index: 0,
          model_answer: "Including explicit null markers records structural leaf endings, removing all shape ambiguity from a single preorder traversal sequence.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity to serialize and deserialize a binary tree of N nodes?",
          model_answer: "O(N) time for single-pass traversal/reconstruction, and O(N) space for storing the serialized string tokens and recursion stack.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
