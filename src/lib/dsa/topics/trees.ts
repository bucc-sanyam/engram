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

The mental shift this chapter demands — and it is *the* shift, the one that separates people who fight trees from people who glide — is learning to think **recursively without simulating the recursion**. A tree is a self-similar object: every node is the root of its own smaller tree. So almost every tree algorithm has the same skeleton: handle the empty tree (the base case), recurse on the left child, recurse on the right, and *combine* the two answers at the node you are standing on. Your entire creative contribution is the combine step. Depth? One plus the taller child. Same tree? Roots match and both subtree pairs match. Invert? Swap the two answers. Stop tracing the call stack node by node; state what the function *promises to return* for any subtree, then use that promise as if it were already true. That leap of faith has a name — structural induction — and the first six problems drill it until it is a reflex.

Midway, the chapter changes lens. Level Order Traversal and Right Side View swap depth-first recursion for **breadth-first** queues — the tree read as floors instead of branches. Then the **binary search tree** section cashes in chapter five's promise: a BST is binary search frozen into a shape, its left-less-root-less-right invariant giving you ordered iteration (Kth Smallest), pruned navigation (Lowest Common Ancestor), and a validation problem whose classic wrong answer teaches more than most right ones. The finale is two genuine hards: Maximum Path Sum, where the combine step must tell the difference between the best answer *through* a node and the best answer a node can *offer its parent* — and Serialize/Deserialize, where you flatten a tree to a string and resurrect it.

On the roadmap, Trees is the great junction: Tries specialise the node, Heaps flatten the tree into an array, and Backtracking turns the recursion outward into decision-making. All three chapters ahead are children of this one.`,
  problems: [
    {
      slug: "invert-binary-tree",
      title: "Invert Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/invert-a-binary-tree",
      summary: "Swap left and right at every node — the recursive skeleton in its purest form.",
      body: `**Signal.** "Mirror a binary tree: every left child becomes a right child, at every level" — a structural transformation applied uniformly at every node is the purest possible tell for "solve it for one node, trust recursion for the rest."

**Brute force.** Collect all nodes with a traversal, then manually walk the collected structure swapping child pointers with explicit bookkeeping — it works, but it fights the recursion the problem is built for instead of using it, and needs O(n) extra space to hold the collection.

**Optimal approach.** Say what "invert" means at a single node: my mirrored tree is my node, with my *inverted right subtree* hanging on the left, and my *inverted left subtree* hanging on the right. That sentence is the entire algorithm. Base case: inverting an empty tree gives an empty tree. Recursive case: invert left, invert right, swap them. You never think about depth 5 or node 37 — you state the rule for one node and let self-similarity do the rest. (An iterative version — pop a node from an explicit stack, swap its children, push them — works too, and is worth writing once so you believe the call stack is not magic; it *is* a stack, the one your runtime maintains.)

\`\`\`viz:table-diff
{
  "columns": ["Node", "Left child", "Right child"],
  "before": [[4, 2, 7], [2, 1, 3], [7, 6, 9]],
  "after": [[4, 7, 2], [7, 9, 6], [2, 3, 1]],
  "caption": "Invert Binary Tree — every node's left and right children swap, at every level, simultaneously."
}
\`\`\`

**Complexity.** O(n) time — every node visited once — O(h) space for the recursion stack, where h is the tree's height: log n balanced, n degenerate.

**Thread.** One node's rule, trusted globally: that is the chapter's whole grammar. Next problem, Maximum Depth, asks the first *measuring* question, and the combine step becomes an arithmetic one — one plus the taller child.`,
    },
    {
      slug: "maximum-depth-of-binary-tree",
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/depth-of-binary-tree",
      summary: "Depth = 1 + max(left, right): the template every tree measurement is cut from.",
      body: `**Signal.** "Return the number of nodes on the longest root-to-leaf path" — a measurement that's naturally defined in terms of the same measurement on smaller subtrees is the tell for depth-first recursion with an arithmetic combine step.

**Brute force.** Breadth-first with a queue, counting how many floors you drain before the queue empties — entirely valid (it's the BFS style named below), but O(w) space for the widest level, versus O(h) for the recursive version on a balanced tree.

**Optimal approach.** Phrase it as the standing-at-one-node question: *my* depth is one (for myself) plus the depth of my *deeper* child. Empty trees contribute zero. Three lines: if null return 0; return 1 + max(depth(left), depth(right)). It is Invert Binary Tree's skeleton with the combine step swapped from a pointer swap to an arithmetic max — skeleton constant, combine step varies. This is *depth-first*: it plunges to the leaves before resolving anything, and answers bubble **up**. A rule of thumb worth keeping: answers about *paths and subtree aggregates* lean DFS; answers about *levels and nearness* lean BFS.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "n3", "label": "3", "children": ["n9", "n20"] },
    { "id": "n9", "label": "9" },
    { "id": "n20", "label": "20", "children": ["n15", "n7"], "highlight": true },
    { "id": "n15", "label": "15", "highlight": true },
    { "id": "n7", "label": "7" }
  ],
  "rootId": "n3",
  "caption": "depth(9) = 1. depth(20) = 1 + max(depth(15), depth(7)) = 1 + 1 = 2. depth(root) = 1 + max(1, 2) = 3, via the highlighted path 3 → 20 → 15."
}
\`\`\`

**Complexity.** O(n) time, O(h) recursion space either way — the DFS/BFS choice trades O(h) against O(w).

**Thread.** Height is about to become a *component* rather than an answer: Diameter of Binary Tree asks for the longest path between any two nodes — and at every node, that path's length is the sum of two child heights.`,
    },
    {
      slug: "diameter-of-binary-tree",
      title: "Diameter of Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-diameter",
      summary: "The longest path bends at some node — compute heights, and harvest left + right at every bend.",
      body: `**Signal.** "The longest path between any two nodes, not necessarily through the root" — "not necessarily through the root" is the tell that the answer must be *harvested* during a traversal rather than read off any single return value, including the root's.

**Brute force.** For every node, independently call a height function on its left and right children and sum them, taking the max over all nodes — correct, but each height() call re-walks its whole subtree, and deeper nodes get remeasured by every ancestor: O(n²) total.

**Optimal approach.** Every path in a tree has a highest point — a node where it *bends*: climbs up its left side, crests, descends its right side. The longest path bending at me has length height(left) + height(right). You are already computing every node's height in a single depth recursion — the diameter needs no second traversal, it is a *side effect*. Run the height function; at each node, before returning, evaluate leftHeight + rightHeight and fold it into a running best (a variable outside the recursion, or threaded through return values). The function *returns* one thing to its parent (height) while *recording* another thing globally (the best bend seen) — return value versus harvested value, one of the most reused splits in tree problems.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "n1", "label": "1", "children": ["n2", "n3"], "highlight": true },
    { "id": "n2", "label": "2", "children": ["n4", "n5"], "highlight": true },
    { "id": "n3", "label": "3", "highlight": true },
    { "id": "n4", "label": "4", "highlight": true },
    { "id": "n5", "label": "5" }
  ],
  "rootId": "n1",
  "caption": "At node 2: bend = height(4) + height(5) = 1 + 1 = 2 edges (path 4-2-5). At the root: bend = height(2's subtree) + height(3) = 2 + 1 = 3 edges — the highlighted path 4-2-1-3 is the diameter."
}
\`\`\`

**Complexity.** O(n) time, single traversal, O(h) space — versus the naive per-node recomputation's O(n²).

**Thread.** The same compute-once-harvest-alongside architecture next answers a yes/no question: is the tree height-*balanced*? Same recursion, one extra comparison — and a clever trick for signalling failure upward.`,
    },
    {
      slug: "balanced-binary-tree",
      title: "Balanced Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/balanced-binary-tree",
      summary: "Check every node's child-height gap in the same single pass that computes the heights.",
      body: `**Signal.** "At every node, the two child subtree heights differ by at most one" — a per-node local condition that still requires global height information is the tell for the same compute-once-harvest architecture as Diameter, with a poison-value twist.

**Brute force.** "For each node, compute height(left) and height(right), compare, recurse" — correct and O(n²): every node triggers full height computations over its subtrees, and deep nodes get remeasured by every ancestor. The same trap Diameter set.

**Optimal approach.** One traversal, bottom-up. Compute heights leaf-to-root as usual; at each node, the two child heights are in hand at the moment you combine — compare them right there. The neat idiom for reporting failure: return height normally but reserve **−1 as a poison value** meaning "imbalance below." Any node that sees −1 from a child, or sees a gap greater than one, itself returns −1. The poison propagates to the root unstoppably, because every combine step checks for it first — a sentinel-in-the-return-channel trick you'll reuse far from trees.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "n1", "label": "1", "children": ["n2"] },
    { "id": "n2", "label": "2", "children": ["n3"], "highlight": true },
    { "id": "n3", "label": "3", "children": ["n4"] },
    { "id": "n4", "label": "4" }
  ],
  "rootId": "n1",
  "caption": "A left-only spine. At node 2: left subtree (via 3, 4) has height 2, right subtree is absent (height 0) — gap 2 → returns -1 (poison). Node 1 sees -1 and propagates it up unstoppably: unbalanced, no remeasuring needed."
}
\`\`\`

**Complexity.** O(n) time, O(h) space — versus the trap's O(n²).

**Thread.** You have measured trees three ways with one recursion. The next two problems change the question from *measuring* one tree to *comparing* two — first for perfect equality, then for containment.`,
    },
    {
      slug: "same-tree",
      title: "Same Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/same-binary-tree",
      summary: "Two trees in lockstep: equal roots, then equal left pairs, then equal right pairs.",
      body: `**Signal.** "Are two binary trees identical — same shape, same values, everywhere" — comparing two structures node-for-node is the tell for recursion walking *two trees in lockstep* instead of one.

**Brute force.** Serialize both trees to strings or flattened lists (including explicit nulls to preserve shape) and compare the two strings — O(n) time, O(n) extra space for the serializations, where lockstep recursion needs none.

**Optimal approach.** The single-node question: trees rooted at p and q match when their root values match, their left subtrees match, and their right subtrees match. Base cases carry the shape-checking: both null → same; exactly one null → different (shape mismatch); values differ → different. Then two recursive calls, AND-ed — and the AND means the first discrepancy anywhere stops the comparison, so mismatched trees are often detected in a handful of nodes.

\`\`\`viz:table-diff
{
  "columns": ["Position", "Value"],
  "before": [["root", 1], ["left", 2], ["right", 3]],
  "after": [["root", 1], ["left", "null"], ["right", 2]],
  "caption": "p = [1,2,3] vs q = [1,null,2]: roots match (1=1), but p has a real left child (2) where q's left is null — shape mismatch caught instantly, without ever comparing the right side."
}
\`\`\`

**Complexity.** O(min(m, n)) time — lockstep walking can stop at the smaller tree's edge — O(h) space, versus the serialization approach's O(n) space.

**Thread.** Equality is the building block; the next problem, Subtree of Another Tree, uses this exact function as its inner loop — *is the second tree identical to something hanging somewhere inside the first?*`,
    },
    {
      slug: "subtree-of-another-tree",
      title: "Subtree of Another Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/subtree-of-a-binary-tree",
      summary: "Try Same Tree at every node of the host — composition of two recursions, with a serialization twist.",
      body: `**Signal.** "Does t appear inside s as a complete subtree" — checking every possible anchor point in a host tree against a candidate is the tell for composing two recursions: an outer walk over s plus the Same Tree check as the inner comparison.

**Brute force / the elegant alternative.** Flatten both trees to strings and reduce to substring search. Serialize with a traversal that records null children explicitly (so different shapes never collide) plus delimiters (so values like 2 and 22 never blur). Then "is t a subtree of s?" becomes "is serial(t) a substring of serial(s)?", solvable in O(m+n) with proper string matching — a real technique (reduce an unfamiliar problem to a solved one), not a lesser approach.

**Optimal approach (direct composition).** Walk the host tree, and at every node ask Same Tree's question against t. Two recursions composed: an outer walk over s's nodes (candidate anchors) and an inner lockstep comparison. If any anchor passes, true; if the walk exhausts s, false. Base cases: an empty t is a subtree of anything (vacuously); an empty s can only contain an empty t. Worst case O(m·n) — every node of s launching a comparison that runs deep before failing; adversarial inputs (long chains of equal values) genuinely hit it.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "n3", "label": "3", "children": ["n4", "n5"] },
    { "id": "n4", "label": "4", "children": ["n1", "n2"], "highlight": true },
    { "id": "n5", "label": "5" },
    { "id": "n1", "label": "1", "highlight": true },
    { "id": "n2", "label": "2", "highlight": true }
  ],
  "rootId": "n3",
  "caption": "s = [3,4,5,1,2], t = [4,1,2]. Anchor at 3: roots differ (3≠4) — fail fast. Anchor at 4: lockstep match on the whole highlighted subtree (4,1,2) — found."
}
\`\`\`

**Complexity.** O(m·n) time composed (direct); O(m + n) with serialization.

**Thread.** Six problems of plain binary trees; now structure gets a *promise*. The binary search tree section opens with Lowest Common Ancestor — where one ordering invariant turns an O(n) search into a guided O(h) descent.`,
    },
    {
      slug: "lowest-common-ancestor-of-a-bst",
      title: "Lowest Common Ancestor of a BST",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree",
      summary: "The LCA is where two values part ways — and the BST invariant tells you which way to walk.",
      body: `**Signal.** "In a binary search tree, find the lowest common ancestor of p and q" — the phrase "binary search tree" is doing the work: the ordering invariant turns what would be real work in a plain tree into a guided single-path walk.

**Brute force.** Find the root-to-p path and the root-to-q path separately (recursion both sides, bubbling non-null results up — the plain-binary-tree algorithm, which ignores BST ordering entirely), then compare the two paths to find where they diverge — O(n) time and doesn't use the invariant at all.

**Optimal approach.** Stand at the root with the two values. If both are smaller than you, both live in your left subtree — step left. Both larger — step right. But the moment the values **straddle** you — one on each side, or one equals you — you are the answer: you're certainly a common ancestor, and no deeper node can be, since stepping either direction abandons one of the two. The LCA is precisely the *fork point* — the last node where p's search path and q's search path still travel together.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "n6", "label": "6", "children": ["n2", "n8"] },
    { "id": "n2", "label": "2", "children": ["n0", "n4"] },
    { "id": "n8", "label": "8" },
    { "id": "n0", "label": "0" },
    { "id": "n4", "label": "4 (LCA)", "children": ["n3", "n5"], "highlight": true },
    { "id": "n3", "label": "3", "highlight": true },
    { "id": "n5", "label": "5", "highlight": true }
  ],
  "rootId": "n6",
  "caption": "LCA(3, 5): at 6 both are smaller, step left; at 2 both are larger, step right; at 4 they straddle (3 < 4 < 5) — 4 is the fork point where the two search paths part, so it is the answer."
}
\`\`\`

**Complexity.** O(h) time — one root-to-answer walk, log n balanced — O(1) space iteratively, versus the two-path approach's O(n) time and O(h) extra space for storing paths.

**Thread.** The BST rewarded you for *navigating*. Before going deeper into its order, the chapter switches lenses entirely: Level Order Traversal reads any tree floor by floor — recursion set aside, a queue takes the wheel.`,
    },
    {
      slug: "binary-tree-level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/level-order-traversal-of-binary-tree",
      summary: "BFS with a queue, level by level: snapshot the queue's size to know where each floor ends.",
      body: `**Signal.** "Return the tree's values grouped by depth" — the output format *is* the algorithm hint: floor-by-floor order is exactly what depth-first recursion refuses to produce directly, and exactly what a queue produces naturally.

**Brute force.** DFS with a depth parameter, appending each value to output[depth] as you recurse — genuinely valid and O(n), just a different style (depth-first faking breadth-first grouping) worth knowing as the alternative, not a worse approach.

**Optimal approach (BFS).** A queue where nodes wait their turn, and each dequeued node enrols its children at the back. First-in-first-out guarantees the entire current floor is served before any of the next floor. The refinement this problem adds to plain BFS is *floor boundaries*: **snapshot the queue's size before draining it.** At the moment a level begins, the queue holds exactly that level and nothing else; dequeue precisely that many nodes into one output group (enqueuing their children as you go), and when the count runs out, the next level stands complete in the queue.

\`\`\`viz:array
{
  "frames": [
    { "cells": [3], "note": "Queue starts [3], size snapshot = 1. Emit level [3]. Enqueue its children 9, 20." },
    { "cells": [9, 20], "note": "Queue [9, 20], size snapshot = 2. Emit level [9, 20]. 9 is a leaf; enqueue 20's children 15, 7." },
    { "cells": [15, 7], "note": "Queue [15, 7], size snapshot = 2. Emit level [15, 7]. Both leaves — queue empties. Output: [[3], [9,20], [15,7]]." }
  ],
  "caption": "Level Order Traversal — the queue's size at the start of each round is exactly that round's floor."
}
\`\`\`

**Complexity.** O(n) time; O(w) space for the queue, where w is the tree's widest level — up to n/2 for a bushy tree. Compare DFS's O(h): breadth pays in width, depth pays in height.

**Thread.** Next problem, Right Side View, is this algorithm with a one-line harvest change: from each floor, keep only the last node you serve.`,
    },
    {
      slug: "binary-tree-right-side-view",
      title: "Binary Tree Right Side View",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-right-side-view",
      summary: "Stand to the tree's right: you see exactly one node per level — the last one in BFS order.",
      body: `**Signal.** "Standing to the right, report the nodes you can see, one per level" — once restated as "the last node of each level," this stops being a new problem: it's Level Order Traversal with a one-line harvesting rule.

**Brute force.** Walk the right spine only (root, root.right, root.right.right, …) — tempting, and wrong: a level's visible node can come from a *left* branch if it extends deeper than the right branch's node at that level. The trap this problem exists to set.

**Optimal approach.** Run the queue with the size-snapshot loop from Level Order Traversal; within each level's drain, whichever node you dequeue *last* is that floor's visible node. Emit it; discard the rest. (A DFS variant also works: recurse *right child first*, carrying depth, and record a node only when its depth exceeds the deepest recorded so far — the first node reached at each depth is then always the rightmost, an elegant inversion at O(h) space.)

\`\`\`viz:array
{
  "frames": [
    { "cells": [1], "note": "Level [1]: only node, last one is 1 — visible." },
    { "cells": [2, 3], "highlight": [1], "note": "Level [2, 3]: last dequeued is 3 — visible. 2 is hidden behind it on the same floor." },
    { "cells": [5, 4], "highlight": [1], "note": "Level [5, 4]: last dequeued is 4 — visible. 5 is hidden even though it's on a different branch. View: [1, 3, 4]." }
  ],
  "caption": "Right Side View — the view can zigzag across subtrees, which is why walking only the right spine is a trap."
}
\`\`\`

**Complexity.** O(n) time either way; O(w) queue space or O(h) recursion space.

**Thread.** BFS interlude complete. The next problem returns to root-to-leaf recursion with a twist on *what flows down*: Count Good Nodes passes ancestor information — the running maximum — from parent to child, top-down.`,
    },
    {
      slug: "count-good-nodes-in-binary-tree",
      title: "Count Good Nodes in Binary Tree",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-good-nodes-in-binary-tree",
      summary: "Pass the path's running maximum down the recursion — top-down flow, the mirror of everything so far.",
      body: `**Signal.** "No node on the path from the root down to it holds a greater value" — a condition depending on *ancestors*, not descendants, is the tell that information must flow top-down as a recursion parameter, the mirror of every bottom-up problem so far.

**Brute force.** At each node, walk back up to the root (with parent pointers) or re-derive the root-to-node path from scratch, checking it's the max — O(n) work per node, O(n²) total, redoing the same ancestor comparisons repeatedly.

**Optimal approach.** Thread the running maximum downward as a parameter: recurse with maxSoFar, the largest value on the path into this node. On arrival, compare: my value ≥ maxSoFar → I am good, count one, and my children inherit an updated maximum; otherwise I pass the old maximum along unchanged. Return my subtree's count (mine plus both children's) upward. Two flows in one function — context descending as arguments, tallies ascending as return values.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "3 (good)", "children": ["c1", "c4"], "highlight": true },
    { "id": "c1", "label": "1" },
    { "id": "c1c", "label": "3 (good)", "highlight": true },
    { "id": "c4", "label": "4 (good)", "children": ["c4a", "c4b"], "highlight": true },
    { "id": "c4a", "label": "1" },
    { "id": "c4b", "label": "5 (good)", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Root 3 (good, nothing above). Node 1 < max 3 — not good, passes max 3 down. Its child 3 ≥ 3 — good (ties count). Node 4 ≥ 3 — good, passes max 4. Its children: 1 not good, 5 ≥ 4 good. Total: 4 good nodes."
}
\`\`\`

**Complexity.** O(n) time, O(h) space — versus the O(n²) repeated-path-walk brute force. The root is always good — a pleasant sanity check on any implementation.

**Thread.** Passing constraints downward is exactly the machinery the next problem requires — Validate Binary Search Tree, where each node inherits an *allowed range* from its ancestors, and the famous wrong answer comes from checking children instead of ranges.`,
    },
    {
      slug: "validate-binary-search-tree",
      title: "Validate Binary Search Tree",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-binary-search-tree",
      summary: "Not 'children versus parent' — every node must sit inside a range its whole ancestry carved out.",
      body: `**Signal.** "Verify the BST invariant holds for *every* node" — the temptation to check each node only against its immediate children is exactly the trap; the invariant is about entire subtrees, which is the tell that ancestry needs to travel as a range, not a single comparison.

**Brute force (the famous wrong answer).** Check each node against its immediate children; recurse. It feels complete and it is not — the invariant is about entire *subtrees*, not children. The canonical counterexample: root 5, left child 3, and 3's right child 6 — locally impeccable (3 < 5 and 6 > 3), yet 6 sits in root 5's **left** subtree while being greater than 5. Broken, and the local check never notices, because the violated relationship spans a grandparent.

**Optimal approach.** Each node lives inside a *window* that its entire ancestry has carved. Start at the root with (−∞, +∞). Descending left tightens the ceiling; descending right raises the floor. A node is legal iff its value lies strictly inside its inherited window; recurse left with (low, me) and right with (me, high). (The alternative that doubles as a lesson: in-order traversal of a valid BST emits values in strictly increasing order — traverse in-order and verify each value exceeds its predecessor, remembering only one previous value.)

\`\`\`viz:tree
{
  "nodes": [
    { "id": "n5", "label": "5 (root)", "children": ["n3"] },
    { "id": "n3", "label": "3", "children": ["n6"] },
    { "id": "n6", "label": "6", "highlight": true }
  ],
  "rootId": "n5",
  "caption": "The famous wrong-answer trap: 3 < 6 and 6 > 3 pass every local parent-child check, but 6 sits inside root 5's left subtree while being greater than 5. Only the inherited window (3, 5) catches it."
}
\`\`\`

**Complexity.** O(n) time, O(h) space — versus the parent-child check, which is the same complexity but silently wrong.

**Thread.** In-order traversal just made an entrance; Kth Smallest Element in a BST, next, weaponises it — sorted order on demand, stopped early at the kth emission.`,
    },
    {
      slug: "kth-smallest-element-in-a-bst",
      title: "Kth Smallest Element in a BST",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/kth-smallest-integer-in-bst",
      summary: "In-order traversal emits a BST in sorted order — walk it with a countdown and stop at k.",
      body: `**Signal.** "Return the kth smallest value in a BST" — needing sorted order from a structure that doesn't store it explicitly is the tell for in-order traversal, which *implies* sorted order rather than storing it.

**Brute force.** Fully traverse the tree, collect every value into an array, sort it (or just in-order-collect, which is already sorted), and index k−1 — O(n) time and O(n) space, touching every node even when k is small.

**Optimal approach.** In-order traversal — recurse left, visit node, recurse right — visits a BST's values in exactly ascending order, because the invariant promises everything left of me is smaller and everything right is larger, applied recursively at every node. So the kth smallest is simply the kth node the traversal *visits*. Carry a countdown: decrement at every visit; when it hits zero, stop — no arrays, no sorting. The **iterative in-order walk with an explicit stack** makes early exit clean: push the left spine as far as it goes; pop (that's the next in-order visit); step to the popped node's right child and push *its* left spine. Each pop decrements k; the kth pop answers.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "n5", "label": "5", "children": ["n3", "n6"] },
    { "id": "n3", "label": "3 (k=3, answer)", "children": ["n2", "n4"], "highlight": true },
    { "id": "n6", "label": "6" },
    { "id": "n2", "label": "2", "children": ["n1"], "highlight": true },
    { "id": "n4", "label": "4" },
    { "id": "n1", "label": "1", "highlight": true }
  ],
  "rootId": "n5",
  "caption": "k=3. In-order visits 1, 2, 3 in that order (highlighted) — the 3rd visit lands on node 3, the answer, without ever touching 4, 5, or 6."
}
\`\`\`

**Complexity.** O(h + k) time — descend the spine, then k pops — O(h) space, versus O(n) time and space to collect and sort everything.

**Thread.** You now read trees in every direction. Next: build one from its footprints — Construct Binary Tree from Preorder and Inorder Traversal, where two traversal orders pin down the one tree that produced both.`,
    },
    {
      slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
      title: "Construct Binary Tree from Preorder and Inorder Traversal",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal",
      summary: "Preorder names the root; inorder splits left from right — recurse on the two halves.",
      body: `**Signal.** "Given preorder and inorder traversals, reconstruct the tree" — two different traversal orders of the *same* tree, given together, is the tell that each order leaks a different, complementary piece of structural information.

**Brute force.** Try every possible tree shape consistent with the node count and check whether it produces both given traversals — combinatorially infeasible; not a real approach, just the thing to rule out before finding the actual structural shortcut.

**Optimal approach.** **Preorder's first element is the root** — preorder visits the node before either subtree. Take that root value and **find it in the inorder sequence: everything to its left is the left subtree's values; everything to its right, the right subtree's** — because inorder sandwiches the node between its two sides. That split tells you which values go left and right, and — counting them — how many, which lets you split the remaining preorder list at the same sizes. Two smaller (preorder, inorder) pairs remain: recurse. The engineering: searching inorder for each root is O(n) per node without help, so use a hash map from value → inorder index (values are guaranteed distinct) and pass index ranges instead of slicing arrays.

\`\`\`viz:table-diff
{
  "columns": ["Segment", "Preorder", "Inorder"],
  "before": [["Whole tree", "[3,9,20,15,7]", "[9,3,15,20,7]"]],
  "after": [["Left subtree", "[9]", "[9]"], ["Right subtree", "[20,15,7]", "[15,20,7]"]],
  "caption": "Root = preorder[0] = 3. Finding 3 in inorder splits it into [9] | [15,20,7] — 1 node left, 3 nodes right — which splits the remaining preorder the same way. Recurse on each half."
}
\`\`\`

**Complexity.** O(n) time and space with the map. Preorder alone cannot distinguish a left-only chain from a right-only chain — one traversal underdetermines the tree; the second order resolves the ambiguity.

**Thread.** First, the boss fight: Binary Tree Maximum Path Sum — Diameter's architecture, but with values that can be *negative*, forcing every combine step to make choices.`,
    },
    {
      slug: "binary-tree-maximum-path-sum",
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-maximum-path-sum",
      summary: "At each node, two different questions: the best path through me, and the best path I can offer upward.",
      body: `**Signal.** "Values may be negative; find the maximum path sum anywhere in the tree" — negative values plus "anywhere, not necessarily through the root" is the tell that this is Diameter's return-versus-harvest split, upgraded to require a decision (include or decline) at every node.

**Brute force.** For every node as a potential "top of the bend," compute the best downward sum into each child independently (recomputing from scratch each time) and combine — same remeasurement trap as Diameter's naive version: O(n²).

**Optimal approach.** Stand at a node. Question one: what is the best path that *bends* at me? That's a complete candidate answer — harvest it into a global best. Question two: what is the best path I can *offer my parent*? A parent extending its path through me can continue down only **one** of my sides — a path may not fork — so my offer is my value plus the better single child offer. Where negatives bite: a child's offer can be worse than nothing, so clamp — an offer below zero is declined, take max(offer, 0) per side. The harvest at a node is value + clampedLeft + clampedRight; the upward offer is value + max of the clamped sides. Initialise the global best to negative infinity, not zero — an all-negative tree's answer is its least-bad single node.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "-10", "children": ["n9", "n20"] },
    { "id": "n9", "label": "9" },
    { "id": "n20", "label": "20", "children": ["n15", "n7"], "highlight": true },
    { "id": "n15", "label": "15", "highlight": true },
    { "id": "n7", "label": "7", "highlight": true }
  ],
  "rootId": "root",
  "caption": "The winning path (42) bends at 20 and never touches the root: 15 + 20 + 7. Node 9 offers only 9 upward, and the root's own harvest (34) loses to a subtree that never needed it."
}
\`\`\`

**Complexity.** O(n) time, O(h) space — versus the O(n²) naive remeasurement.

**Thread.** One problem left: flatten a tree to a string and bring it back alive. Serialization is where all the traversal fluency pays out.`,
    },
    {
      slug: "serialize-and-deserialize-binary-tree",
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/serialize-and-deserialize-binary-tree",
      summary: "Preorder with explicit nulls uniquely describes any tree — and reads back as a self-consuming stream.",
      body: `**Signal.** "Design serialize/deserialize such that any binary tree round-trips exactly" — a design problem with no imposed format is the tell that you need to invent an encoding where both directions are easy, and the previous problem's lesson (one traversal underdetermines a tree) tells you what's missing.

**Brute force.** Serialize using preorder *without* recording nulls — compact, but underdetermined: a left-only chain and a right-only chain of the same values produce the identical string, so deserialization can't recover the original shape. Not actually a working approach, just the natural first attempt to rule out.

**Optimal approach.** One traversal order **with the nulls written down**. Serialize preorder — node, left, right — emitting a sentinel (say, N) for every empty child, values separated by delimiters (Encode/Decode Strings' lesson: 2 and 22 must never blur). The nulls record the *shape*, which is exactly the information a second traversal existed to supply — with them, preorder describes one and only one tree. Deserialize by reading the tokens as a stream with a single advancing cursor: take the next token — N means null; otherwise make a node, then build its left subtree from the stream, then its right, recursively, each call consuming exactly the tokens that belong to it. No indexes, no lookahead: the writer's traversal order and the reader's consumption order are the *same shape*, so the stream self-partitions.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["1", "2", "N", "N", "3", "4", "N", "N", "5", "N", "N"], "pointers": [{ "label": "cursor", "index": 0 }], "note": "Read '1' -> make root node 1. Recurse: build node 1's left subtree from the rest of the stream." },
    { "cells": ["1", "2", "N", "N", "3", "4", "N", "N", "5", "N", "N"], "pointers": [{ "label": "cursor", "index": 1 }], "note": "Read '2' -> make node 2 (1's left child). Recurse into 2's left." },
    { "cells": ["1", "2", "N", "N", "3", "4", "N", "N", "5", "N", "N"], "pointers": [{ "label": "cursor", "index": 2 }], "highlight": [2], "note": "Read 'N' -> node 2's left is null." },
    { "cells": ["1", "2", "N", "N", "3", "4", "N", "N", "5", "N", "N"], "pointers": [{ "label": "cursor", "index": 3 }], "highlight": [3], "note": "Read 'N' -> node 2's right is null. Node 2 is complete; control returns up to build node 1's right." },
    { "cells": ["1", "2", "N", "N", "3", "4", "N", "N", "5", "N", "N"], "pointers": [{ "label": "cursor", "index": 4 }], "note": "Read '3' -> node 1's right child. Recursion continues the same way through the rest of the stream." }
  ],
  "caption": "Serialize and Deserialize — the cursor consumes tokens in exactly the order the recursion needs them; no separate index bookkeeping required."
}
\`\`\`

**Complexity.** O(n) both directions; the string carries n values and n + 1 sentinels — linear, the price of uniqueness.

**Thread.** Trees complete — fifteen problems, one grammar. The roadmap now forks three ways from this junction, and the atlas takes them in turn: first the Heap, a tree so disciplined it lives inside a flat array and answers "what is the smallest thing I hold?" in constant time — then Backtracking, then Tries. On to the machine room.`,
    },
  ],
};
