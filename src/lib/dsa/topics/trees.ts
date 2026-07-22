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
      body: `**The problem.** Invert a binary tree — mirror it so every node's left and right subtrees are swapped — and return the root.
**The signal.** This is the recursive skeleton in its purest form. The interviewer wants "solve one node, trust the recursion for the rest," the template underpinning the whole chapter.

**Beginner Intuition & The Naive Fallacy.** Beginners attempt to swap node values across the tree by storing them in arrays or manually re-assigning values level-by-level.
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

**The optimal solution (recursive pointer swap).**

\`\`\`python
def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root
\`\`\`

**Complexity — swap pointers, not values.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Copy values into arrays, rebuild", "time": "O(N)", "space": "O(N)", "note": "Fights the structure instead of using it." },
    { "approach": "Recursive pointer swap", "time": "O(N)", "space": "O(H)", "note": "One swap per node; stack depth = tree height. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, H = tree height. Every node is visited once; recursion uses O(H) stack (O(log N) balanced, O(N) skewed)."
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
      body: `**The problem.** Return the maximum depth — the number of nodes on the longest root-to-leaf path. \`[3,9,20,null,null,15,7]\` → \`3\`.
**The signal.** \`depth = 1 + max(left, right)\` is the post-order template every tree measurement is cut from — the interviewer wants the combine-at-the-node pattern.

**Beginner Intuition & The Naive Fallacy.** Beginners try to count nodes along every path using a global counter variable, running into bugs when tracking multiple branching paths.
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

**The optimal solution (post-order recurrence).**

\`\`\`python
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
\`\`\`

**Complexity — one recurrence, one pass.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "BFS level counting", "time": "O(N)", "space": "O(W)", "note": "Queue holds a whole level; W = max width." },
    { "approach": "Post-order DFS recurrence", "time": "O(N)", "space": "O(H)", "note": "1 + max(left, right); stack = height. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, H = height, W = max width. DFS uses O(H) stack; BFS uses O(W) queue."
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
      body: `**The problem.** Return the diameter — the length in *edges* of the longest path between any two nodes (the path need not pass through the root).
**The signal.** The longest path bends at some node; compute heights bottom-up and harvest \`leftH + rightH\` at every node, updating a global maximum.

**Beginner Intuition & The Naive Fallacy.** Beginners assume the longest path (diameter) must pass through the root of the tree.
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

**The optimal solution (height + global harvest).**

\`\`\`python
def diameter_of_binary_tree(root):
    best = 0
    def height(node):
        nonlocal best
        if not node:
            return 0
        lh = height(node.left)
        rh = height(node.right)
        best = max(best, lh + rh)      # path bending here, counted in edges
        return 1 + max(lh, rh)
    height(root)
    return best
\`\`\`

**Complexity — heights and diameter in a single pass.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Recompute height at every node", "time": "O(N²)", "space": "O(H)", "note": "Each node re-walks its subtrees for height." },
    { "approach": "One post-order pass + global max", "time": "O(N)", "space": "O(H)", "note": "Height returned up; diameter harvested locally. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, H = height. Height is computed once per node and the bend candidate updates a global maximum."
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
      body: `**The problem.** Return \`true\` if the tree is height-balanced — for every node, its two subtrees' heights differ by at most 1.
**The signal.** Computing height separately at every node is O(N²); the interviewer wants height and balance produced together in one bottom-up pass, using a −1 sentinel to short-circuit.

**Beginner Intuition & The Naive Fallacy.** Beginners calculate \`getHeight(node.left)\` and \`getHeight(node.right)\` at every node, then recurse on left and right children.
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

**The optimal solution (-1 poison sentinel).**

\`\`\`python
def is_balanced(root):
    def dfs(node):
        if not node:
            return 0
        lh = dfs(node.left)
        if lh == -1:
            return -1                  # already unbalanced below
        rh = dfs(node.right)
        if rh == -1:
            return -1
        if abs(lh - rh) > 1:
            return -1                  # poison value bubbles up
        return 1 + max(lh, rh)
    return dfs(root) != -1
\`\`\`

**Complexity — fuse the two computations.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Separate getHeight at each node", "time": "O(N²)", "space": "O(H)", "note": "Re-traverses subtrees to measure height." },
    { "approach": "Bottom-up height + -1 sentinel", "time": "O(N)", "space": "O(H)", "note": "Height and balance in one pass; short-circuits. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, H = height. The sentinel lets one pass both measure height and detect imbalance."
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
      body: `**The problem.** Given the roots of two binary trees, return \`true\` if they are structurally identical and every corresponding node has the same value.
**The signal.** Walk both trees in lockstep — compare roots, then the left pair, then the right pair; a single mismatch short-circuits the whole recursion to false.

**Beginner Intuition & The Naive Fallacy.** Beginners serialize both trees to arrays and check array equality.
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

**The optimal solution (lockstep recursion).**

\`\`\`python
def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)
\`\`\`

**Complexity — compare in place, short-circuit early.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Serialize both, compare strings", "time": "O(N)", "space": "O(N)", "note": "Allocates two serializations; can be shape-ambiguous without markers." },
    { "approach": "Lockstep recursion", "time": "O(min(N, M))", "space": "O(H)", "note": "First mismatch returns false immediately. Interview-optimal.", "best": true }
  ],
  "caption": "N, M = node counts of the two trees, H = height. The && short-circuits at the first mismatch."
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
      body: `**The problem.** Return \`true\` if \`subRoot\` is a subtree of \`root\` — some node in \`root\`, together with all its descendants, exactly matches \`subRoot\`.
**The signal.** Compose two recursions: try "Same Tree" anchored at every node of the host tree. A serialization + substring trick collapses it to linear time.

**Beginner Intuition & The Naive Fallacy.** Beginners think \`subRoot\` must match starting at the main root of \`root\`.
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

**The optimal solution (Same Tree at every anchor).**

\`\`\`python
def is_subtree(root, sub_root):
    if not sub_root:
        return True
    if not root:
        return False
    if is_same_tree(root, sub_root):
        return True
    return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)

def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)
\`\`\`

**Complexity — anchor test vs serialization.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "isSameTree at every anchor node", "time": "O(N · M)", "space": "O(H)", "note": "Simple; each of N anchors runs an O(M) compare." },
    { "approach": "Serialize both + KMP substring", "time": "O(N + M)", "space": "O(N + M)", "note": "Null-marked preorder; substring search. Time-optimal.", "best": true }
  ],
  "caption": "N = host nodes, M = subRoot nodes. Serialization trades extra space for linear-time matching."
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
      body: `**The problem.** In a BST, return the lowest common ancestor of two given nodes \`p\` and \`q\`.
**The signal.** The LCA is where the two values first part ways; the BST ordering tells you which direction to walk, so you reach it in O(H) time and O(1) space.

**Beginner Intuition & The Naive Fallacy.** Beginners use general binary tree LCA algorithms, storing parent paths in hash sets ($O(N)$ space).
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

**The optimal solution (walk to the split point).**

\`\`\`python
def lowest_common_ancestor(root, p, q):
    curr = root
    while curr:
        if p.val > curr.val and q.val > curr.val:
            curr = curr.right          # both larger → go right
        elif p.val < curr.val and q.val < curr.val:
            curr = curr.left           # both smaller → go left
        else:
            return curr                # they split here → this is the LCA
\`\`\`

**Complexity — the ordering makes it a single descent.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "General LCA (parent paths in a set)", "time": "O(N)", "space": "O(N)", "note": "Ignores the BST ordering." },
    { "approach": "BST walk to the split point", "time": "O(H)", "space": "O(1)", "note": "One comparison steers left/right. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, H = height (O(log N) balanced). No stack or map needed — just a single pointer descent."
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
      body: `**The problem.** Return the node values level by level, top to bottom, as a list of lists. \`[3,9,20,null,null,15,7]\` → \`[[3],[9,20],[15,7]]\`.
**The signal.** Level-by-level output means BFS with a queue; snapshot the queue's size at the start of each level so you know exactly where one floor ends and the next begins.

**Beginner Intuition & The Naive Fallacy.** Beginners use standard Queue-based BFS, but fail to group nodes into separate sub-arrays by tree level.
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

**The optimal solution (queue-size snapshot).**

\`\`\`python
from collections import deque

def level_order(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):        # snapshot: nodes on this floor only
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level)
    return res
\`\`\`

**Complexity — one visit per node, queue holds a level.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "DFS tagging nodes with depth", "time": "O(N)", "space": "O(N)", "note": "Works, but recursion depth + buckets use O(N)." },
    { "approach": "BFS queue-size snapshot", "time": "O(N)", "space": "O(W)", "note": "Size snapshot isolates each level. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, W = maximum width. The queue never holds more than one level plus its children."
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
      body: `**The problem.** Return the values of the nodes visible from the right side of the tree, top to bottom. \`[1,2,3,null,5,null,4]\` → \`[1,3,4]\`.
**The signal.** From the right you see exactly one node per level — the *last* node in each BFS level, which is not necessarily on the right spine.

**Beginner Intuition & The Naive Fallacy.** Beginners think they can just traverse down \`root.right\` child pointers.
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

**The optimal solution (last node of each BFS level).**

\`\`\`python
from collections import deque

def right_side_view(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        n = len(q)
        for i in range(n):
            node = q.popleft()
            if i == n - 1:             # last node on this level is visible
                res.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return res
\`\`\`

**Complexity — one node per level survives.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Follow root.right only", "time": "O(H)", "space": "O(1)", "note": "Wrong — misses deep left-subtree nodes." },
    { "approach": "BFS, take last of each level", "time": "O(N)", "space": "O(W)", "note": "Right-first DFS by depth also works. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, W = maximum width. Every node is visited once; only the level's last node is recorded."
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
      body: `**The problem.** A node is "good" if no node on the path from the root to it has a greater value; return the count of good nodes.
**The signal.** Thread the path's running maximum *down* the recursion — a top-down flow, the mirror image of the bottom-up combine used elsewhere in this chapter.

**Beginner Intuition & The Naive Fallacy.** Beginners try to check if a node is good by looking at its immediate parent.
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

**The optimal solution (thread the running max down).**

\`\`\`python
def good_nodes(root):
    def dfs(node, max_so_far):
        if not node:
            return 0
        good = 1 if node.val >= max_so_far else 0
        new_max = max(max_so_far, node.val)
        return good + dfs(node.left, new_max) + dfs(node.right, new_max)
    return dfs(root, root.val)
\`\`\`

**Complexity — the max travels down, not up.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Recompute path max per node", "time": "O(N · H)", "space": "O(H)", "note": "Re-walks the root path for every node." },
    { "approach": "Thread running max top-down", "time": "O(N)", "space": "O(H)", "note": "Each node compares against a carried max. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, H = height. Passing max down means each node needs only one O(1) comparison."
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
      body: `**The problem.** Return \`true\` if a binary tree is a valid BST — every node's entire left subtree is smaller and its entire right subtree is larger.
**The signal.** It is not "child vs parent." Each node must fall inside a \`(low, high)\` range that its whole ancestry carved out, so you thread shrinking bounds down the recursion.

**Beginner Intuition & The Naive Fallacy.** Beginners check if \`node.left.val < node.val\` and \`node.right.val > node.val\` for every node.
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

**The optimal solution (shrinking (low, high) bounds).**

\`\`\`python
def is_valid_bst(root):
    def valid(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return (valid(node.left, low, node.val) and
                valid(node.right, node.val, high))
    return valid(root, float('-inf'), float('inf'))
\`\`\`

**Complexity — bounds carry the ancestry.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Compare only immediate children", "time": "O(N)", "space": "O(H)", "note": "Wrong — misses deep-descendant violations." },
    { "approach": "Range-bounds DFS (or in-order monotonic)", "time": "O(N)", "space": "O(H)", "note": "Each node checked against ancestor bounds. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, H = height. The (low, high) window encodes every ancestor constraint in O(1) per node."
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
      body: `**The problem.** Return the k-th smallest value in a BST (1-indexed).
**The signal.** In-order traversal emits a BST's values in sorted order — walk it with a countdown and stop the moment you reach the k-th node, before touching the rest.

**Beginner Intuition & The Naive Fallacy.** Beginners collect all tree elements into an array, sort the array, and pick index $K - 1$ ($O(N \\log N)$).
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

**The optimal solution (iterative in-order with countdown).**

\`\`\`python
def kth_smallest(root, k):
    stack = []
    curr = root
    while stack or curr:
        while curr:                    # dive to the smallest unseen node
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val            # stop the instant we hit the k-th
        curr = curr.right
\`\`\`

**Complexity — stop early, never sort.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Collect all values, sort, index k-1", "time": "O(N log N)", "space": "O(N)", "note": "Ignores the sorted structure already present." },
    { "approach": "Iterative in-order, stop at k", "time": "O(H + k)", "space": "O(H)", "note": "Visits only until the k-th smallest. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, H = height, k = target rank. The traversal halts after k pops instead of scanning everything."
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
      body: `**The problem.** Given \`preorder\` and \`inorder\` traversals of a tree with unique values, reconstruct the tree and return its root.
**The signal.** Preorder names the root; inorder splits the remaining nodes into left-of-root and right-of-root — recurse on the two halves, using a hash map for O(1) splits.

**Beginner Intuition & The Naive Fallacy.** Beginners get stuck trying to construct the tree using only preorder traversal.
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

**The optimal solution (preorder root + inorder split).**

\`\`\`python
def build_tree(preorder, inorder):
    idx = {v: i for i, v in enumerate(inorder)}   # value -> inorder index
    pre_i = 0
    def build(lo, hi):
        nonlocal pre_i
        if lo > hi:
            return None
        root = TreeNode(preorder[pre_i])          # preorder gives the root
        pre_i += 1
        mid = idx[root.val]                       # inorder splits the sides
        root.left = build(lo, mid - 1)            # left BEFORE right
        root.right = build(mid + 1, hi)
        return root
    return build(0, len(inorder) - 1)
\`\`\`

**Complexity — the hash map kills the inner scan.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Linear scan for root in inorder", "time": "O(N²)", "space": "O(N)", "note": "Each call re-scans inorder for the split point." },
    { "approach": "Hash map inorder index lookup", "time": "O(N)", "space": "O(N)", "note": "O(1) split per node; each node built once. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes. Pre-indexing inorder turns every O(N) split search into an O(1) lookup."
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
      body: `**The problem.** Return the maximum path sum of any non-empty path; a path need not pass through the root and node values may be negative. \`[-10,9,20,null,null,15,7]\` → \`42\`.
**The signal.** Each node answers two different questions: the best path *through* it (both branches) to update the global answer, and the best single branch it can offer *upward* to its parent.

**Beginner Intuition & The Naive Fallacy.** Beginners calculate path sums for every pair of nodes ($O(N^2)$).
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

**The optimal solution (bend harvest + single-branch return).**

\`\`\`python
def max_path_sum(root):
    best = float('-inf')
    def gain(node):
        nonlocal best
        if not node:
            return 0
        left = max(gain(node.left), 0)      # clamp negative subtrees to 0
        right = max(gain(node.right), 0)
        best = max(best, node.val + left + right)   # path bending through node
        return node.val + max(left, right)          # best single branch upward
    gain(root)
    return best
\`\`\`

**Complexity — one post-order pass answers both questions.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Sum every pair of node paths", "time": "O(N²)", "space": "O(H)", "note": "Recomputes overlapping paths repeatedly." },
    { "approach": "Post-order gain with clamping", "time": "O(N)", "space": "O(H)", "note": "Bend updates the global max; branch returns upward. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes, H = height. Each node produces its upward gain once while updating a global best."
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
      body: `**The problem.** Design \`serialize(root) → string\` and \`deserialize(string) → root\` that round-trip *any* binary tree.
**The signal.** Preorder with explicit null markers uniquely describes any tree; deserialize reads that token stream, each recursive call self-consuming exactly the tokens of its own subtree.

**Beginner Intuition & The Naive Fallacy.** Beginners serialize nodes using standard preorder traversal without recording null pointers.
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

**The optimal solution (preorder stream with null sentinels).**

\`\`\`python
class Codec:
    def serialize(self, root):
        out = []
        def dfs(node):
            if not node:
                out.append("N")            # explicit null marker
                return
            out.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ",".join(out)

    def deserialize(self, data):
        tokens = iter(data.split(","))
        def dfs():
            val = next(tokens)             # self-consuming stream
            if val == "N":
                return None
            node = TreeNode(int(val))
            node.left = dfs()
            node.right = dfs()
            return node
        return dfs()
\`\`\`

**Complexity — one token per node and per null.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "BFS level-order with null markers", "time": "O(N)", "space": "O(N)", "note": "Equally valid; queue-driven encoding/decoding." },
    { "approach": "Preorder stream with sentinels", "time": "O(N)", "space": "O(N)", "note": "Recursive, self-consuming token stream. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of nodes. The string has N values plus up to N+1 null markers — still O(N) time and space."
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
