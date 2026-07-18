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
      body: `**The problem.** Mirror a binary tree: every left child becomes a right child, at every level. The problem is famous partly for a legend — a celebrated software creator once noted, publicly and sourly, that he was rejected in an interview over it. Let that be motivation: the problem is genuinely easy *if* you think recursively, and genuinely awkward if you try to manage the whole tree by hand.

**The insight.** Say what "invert" means at a single node: my mirrored tree is my node, with my *inverted right subtree* hanging on the left, and my *inverted left subtree* hanging on the right. That sentence is the entire algorithm. Base case: inverting an empty tree gives an empty tree. Recursive case: invert left, invert right, swap them. You never think about depth 5 or node 37 — you state the rule for one node and let self-similarity do the rest.

**The walk-through.** Root 4 with children 2 and 7. Trust the recursion: the subtree under 2 comes back mirrored, the subtree under 7 comes back mirrored; swap them, so 7's mirror hangs left and 2's mirror hangs right. Done at this node — and by induction, done everywhere. The discipline is *not* peeking further down: the recursive promise ("my function correctly inverts any smaller tree") is your building block.

**The iterative version.** Any tree recursion can be run by hand with an explicit stack (or a queue, processing level by level): pop a node, swap its child pointers, push the children. Worth writing once so you believe the call stack is not magic — recursion *is* a stack, the one your runtime maintains; chapter four foreshadowed exactly this.

**Complexity.** O(n) time — every node visited once — O(h) space for the recursion stack, where h is the tree's height: log n balanced, n degenerate.

**The thread.** One node's rule, trusted globally: that is the chapter's whole grammar. Next problem, Maximum Depth, asks the first *measuring* question, and the combine step becomes an arithmetic one — one plus the taller child.`,
    },
    {
      slug: "maximum-depth-of-binary-tree",
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/depth-of-binary-tree",
      summary: "Depth = 1 + max(left, right): the template every tree measurement is cut from.",
      body: `**The problem.** Return the number of nodes on the longest path from the root down to a leaf. A tree with a single node has depth 1; an empty tree, 0.

**The insight.** Phrase it as the standing-at-one-node question: *my* depth is one (for myself) plus the depth of my *deeper* child. Empty trees contribute zero. Three lines: if null return 0; return 1 + max(depth(left), depth(right)). It is Invert Binary Tree's skeleton with the combine step swapped from a pointer swap to an arithmetic max — and that substitutability is the actual lesson. Skeleton constant, combine step varies: count nodes (1 + left + right), sum values, find the max value, check a property — dozens of "different" problems are this one function with one line changed.

**The two traversal styles, named.** This solution is *depth-first*: it plunges to the leaves before resolving anything, and answers bubble **up**. The alternative — walk the tree floor by floor with a queue, counting floors — is *breadth-first*, and information flows **across**. Both give depth in O(n); knowing which style a problem wants is most of tree fluency. A rule of thumb worth keeping: answers about *paths and subtree aggregates* lean DFS; answers about *levels and nearness* lean BFS. This chapter visits both deliberately.

**The walk-through.** Root 3, children 9 and 20, 20's children 15 and 7. Depth(9) = 1 (leaves ask their empty children, get zeros). Depth(20) = 1 + max(1, 1) = 2. Root: 1 + max(1, 2) = 3.

**Complexity.** O(n) time, O(h) recursion space. Note the vocabulary: *height* of a node (distance down to its deepest leaf) versus *depth* (distance up to the root) — this problem's "maximum depth" equals the root's height, and the next two problems lean on heights hard.

**The thread.** Height is about to become a *component* rather than an answer: Diameter of Binary Tree asks for the longest path between any two nodes — and at every node, that path's length is the sum of two child heights.`,
    },
    {
      slug: "diameter-of-binary-tree",
      title: "Diameter of Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-diameter",
      summary: "The longest path bends at some node — compute heights, and harvest left + right at every bend.",
      body: `**The problem.** The diameter is the longest path between *any* two nodes, measured in edges. It need not pass through the root. That last clause is the entire difficulty — the answer might live in some deep corner, entirely inside one subtree.

**The insight.** Every path in a tree has a highest point — a node where it *bends*: climbs up its left side, crests, descends its right side. So consider each node as a potential bend. The longest path bending at me has length height(left child's subtree) + height(right child's subtree), counting edges into each side. Compute that for every node; the maximum over all nodes is the diameter. And here is the efficiency gift: you are already computing every node's height in the depth recursion from last problem. The diameter needs no second traversal — it is a *side effect*. Run the height function; at each node, before returning, evaluate leftHeight + rightHeight and fold it into a running best (a variable outside the recursion, or threaded through return values).

**The pattern being born.** Notice the shape: the function *returns* one thing to its parent (height — what the parent arithmetic needs) while *recording* another thing globally (the best bend seen — what the problem actually asks). Return value versus harvested value. This split is one of the most reused ideas in tree problems — Balanced Binary Tree uses it next, and Maximum Path Sum, the chapter's boss, is this exact architecture with profits instead of lengths.

**The walk-through.** Root 1, children 2 and 3; 2's children 4 and 5. Heights bubble up: 4, 5, 3 are leaves (height 1 in nodes, 0 in edges — pick edge-counting and stay consistent). At node 2: bend = 1 + 1 = 2 edges (path 4-2-5). At root: bend = 2 + 1 = 3 (path 4-2-1-3 or 5-2-1-3). Diameter 3.

**Complexity.** O(n) time, single traversal; O(h) space. The naive version — call depth() separately per node — is O(n²) and is precisely the trap the problem sets.

**The thread.** The same compute-once-harvest-alongside architecture next answers a yes/no question: is the tree height-*balanced*? Same recursion, one extra comparison — and a clever trick for signalling failure upward.`,
    },
    {
      slug: "balanced-binary-tree",
      title: "Balanced Binary Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/balanced-binary-tree",
      summary: "Check every node's child-height gap in the same single pass that computes the heights.",
      body: `**The problem.** A tree is height-balanced when, at *every* node, the heights of the two child subtrees differ by at most one. Verify it. Balance is why trees are fast: it is the property that keeps a million nodes twenty levels deep, and real structures (AVL trees, red-black trees) fight to maintain exactly this invariant on every insert.

**The trap first.** The natural translation — "for each node, compute height(left) and height(right), compare, recurse" — is correct and O(n²): every node triggers full height computations over its subtrees, and deep nodes get remeasured by every ancestor. It is the same trap Diameter set, and the same escape works.

**The insight.** One traversal, bottom-up. Compute heights leaf-to-root as usual; at each node, the two child heights are in hand at the moment you combine — compare them *right there*. The only question is how a deep imbalance reports itself to the top. Two clean designs. One: return a pair (height, isBalanced), OR-ing failure upward. Two — the neat idiom — return height normally but reserve **−1 as a poison value** meaning "imbalance below"; any node that sees −1 from a child, or sees a gap greater than one, itself returns −1. The poison propagates to the root unstoppably, because every combine step checks for it first. Sentinel-in-the-return-channel is a trick you will reuse in languages and contexts far from trees.

**The walk-through.** A spine 1-2-3 with 3's child 4 (heights: 4→1, 3→2, 2→3) and 1's right child absent. At node 2: children have heights 3-in-subtree… concretely, left height 2, right height 0 — gap 2 → return −1. Node 1 sees −1 → −1. Root reports unbalanced without anyone remeasuring anything.

**Complexity.** O(n) time, O(h) space — versus the trap's O(n²).

**The thread.** You have measured trees three ways with one recursion. The next two problems change the question from *measuring* one tree to *comparing* two — first for perfect equality, then for containment.`,
    },
    {
      slug: "same-tree",
      title: "Same Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/same-binary-tree",
      summary: "Two trees in lockstep: equal roots, then equal left pairs, then equal right pairs.",
      body: `**The problem.** Are two binary trees identical — same shape, same values, everywhere?

**The insight.** Recursion generalises gracefully from walking one tree to walking *two in lockstep*. The single-node question: trees rooted at p and q match when their root values match, their left subtrees match, and their right subtrees match. Base cases carry the shape-checking: both null → same (two empty trees agree); exactly one null → different (shape mismatch — one branch exists where the other does not); values differ → different. Then two recursive calls, AND-ed. Five lines, and the base-case ordering does all the real work — most wrong versions mishandle the one-null-one-not case.

**Short-circuiting matters.** The AND means the first discrepancy anywhere stops the comparison — mismatched trees are often detected in a handful of nodes. Worst case still visits everything, but typical behaviour is fast-fail, which is exactly what you want from an equality check.

**The walk-through.** p = [1, 2, 3], q = [1, 2, 3]: roots 1 = 1; recurse left — 2 = 2, both children null on both sides → true; recurse right — 3 = 3 → true; AND → true. Now q = [1, null, 2]: roots match, but p's left is a node while q's left is null → false, instantly, without ever looking right.

**A note on what "same" means.** You are checking *structural* equality — shape plus values — not whether two variables reference the same object in memory. That distinction (deep equality versus reference equality) is a real conversation in every language you will ever use; this problem is its algorithm.

**Complexity.** O(min(m, n)) time — lockstep walking can stop at the smaller tree's edge — O(h) space.

**The thread.** Equality is the building block; the next problem, Subtree of Another Tree, uses this exact function as its inner loop — *is the second tree identical to something hanging somewhere inside the first?*`,
    },
    {
      slug: "subtree-of-another-tree",
      title: "Subtree of Another Tree",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/subtree-of-a-binary-tree",
      summary: "Try Same Tree at every node of the host — composition of two recursions, with a serialization twist.",
      body: `**The problem.** Does tree t appear inside tree s as a complete subtree — some node of s whose entire subtree is identical to t? Not "contains these values," not "contains this shape somewhere spread out" — an exact, whole-subtree match, leaves and all.

**The insight.** You already own the hard part. Same Tree answers "are these two trees identical?" — so walk the host tree, and at every node ask that question against t. Two recursions, composed: an outer walk over s's nodes (the candidate anchors) and an inner lockstep comparison (the match check). If any anchor passes, true; if the walk exhausts s, false. Base cases: an empty t is a subtree of anything (vacuously — worth saying aloud since it is a genuine convention question); an empty s can only contain an empty t.

**The complexity honesty.** Worst case O(m·n) — every node of s launching a comparison that runs deep before failing. Adversarial inputs (long chains of equal values) genuinely hit it. Interviewers know; say it plainly rather than hand-waving O(n).

**The elegant alternative.** Flatten both trees to strings and reduce the problem to substring search. Serialize with a traversal that records null children explicitly — nulls are what make the string uniquely describe the shape (without them, different trees collide) — plus delimiters so values like 2 and 22 cannot blur. Then "is t a subtree of s?" becomes "is serial(t) a substring of serial(s)?", solvable in linear time with proper string matching. This foreshadows Serialize and Deserialize at this chapter's end, and it teaches a real technique: *reduce an unfamiliar problem to a solved one*.

**The walk-through.** s = [3, 4, 5, 1, 2], t = [4, 1, 2]. Anchor 3: roots differ from 4 → fail fast. Anchor 4: lockstep match — 4/4, 1/1, 2/2, nulls align → true.

**Complexity.** O(m·n) time composed; O(m + n) with serialization.

**The thread.** Six problems of plain binary trees; now structure gets a *promise*. The binary search tree section opens with Lowest Common Ancestor — where one ordering invariant turns an O(n) search into a guided O(h) descent.`,
    },
    {
      slug: "lowest-common-ancestor-of-a-bst",
      title: "Lowest Common Ancestor of a BST",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree",
      summary: "The LCA is where two values part ways — and the BST invariant tells you which way to walk.",
      body: `**The problem.** In a binary search tree, find the lowest common ancestor of nodes p and q — the deepest node having both as descendants (a node counts as its own descendant). First, feel what the BST invariant buys: in a *plain* tree this requires real work (find both paths, compare them); in a BST, the invariant — everything left of a node is smaller, everything right is larger — turns it into a guided walk.

**The insight.** Stand at the root with the two values. If both are smaller than you, both live in your left subtree — so the *lowest* common ancestor does too; step left. Both larger: step right. But the moment the values **straddle** you — one on each side, or one equals you — you are the answer. Why? You are certainly a common ancestor (each value is findable from here, one down each side). And no deeper node can be: stepping either direction abandons one of the two. The LCA is precisely the *fork point* — the last node where p's search path and q's search path still travel together. That reframe ("where do two binary searches diverge?") is the whole problem.

**The walk-through.** BST rooted at 6 (children 2, 8; 2's children 0, 4; 4's children 3, 5). p = 2, q = 4: at 6, both smaller → left. At 2: p equals me — straddle condition → answer 2 (an ancestor of itself, per the definition). Now p = 3, q = 5: at 6 → left; at 2, both larger → right; at 4: 3 < 4 < 5, straddle → answer 4.

**Complexity.** O(h) time — one root-to-answer walk, log n balanced — O(1) space iteratively. No parent pointers, no path lists, no recursion needed; the ordering invariant replaces all of that machinery. (The plain-binary-tree variant is a separate classic — recursion both sides, bubble non-null results — worth knowing as the contrast.)

**The thread.** The BST rewarded you for *navigating*. Before going deeper into its order, the chapter switches lenses entirely: Level Order Traversal reads any tree floor by floor — recursion set aside, a queue takes the wheel.`,
    },
    {
      slug: "binary-tree-level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/level-order-traversal-of-binary-tree",
      summary: "BFS with a queue, level by level: snapshot the queue's size to know where each floor ends.",
      body: `**The problem.** Return the tree's values grouped by depth: [[root], [its children], [their children], …]. The output format *is* the algorithm hint — you need the tree floor by floor, which is exactly the order depth-first recursion refuses to produce.

**The insight.** Breadth-first search: a queue where nodes wait their turn, and each dequeued node enrols its children at the back. First-in-first-out guarantees the entire current floor is served before any of the next floor — children always queue behind every remaining same-level node. The one refinement this problem adds to plain BFS is *floor boundaries*: how do you know where one level ends? **Snapshot the queue's size before draining it.** At the moment a level begins, the queue holds exactly that level and nothing else; dequeue precisely that many nodes into one output group (enqueuing their children as you go), and when the count runs out, the next level stands complete in the queue. That size-snapshot loop is the template for every level-aware problem — including the next one in this atlas.

**The walk-through.** Tree 3 / (9, 20) / (20 → 15, 7). Queue [3], size 1 → emit [3], enqueue 9, 20. Queue [9, 20], size 2 → emit [9, 20], enqueue 15, 7. Queue [15, 7], size 2 → emit [15, 7]. Output [[3], [9, 20], [15, 7]].

**DFS can fake it** — recurse carrying a depth parameter, appending each value to output[depth]. Same O(n), and a nice trick to know. But the queue version *is* the concept: BFS is how you explore anything where nearness matters — shortest paths in mazes, friend-of-a-friend hops, the entire Graphs chapter ahead. The tree version is BFS with training wheels (no visited-set needed — trees have no cycles), which is exactly why the roadmap places it here.

**Complexity.** O(n) time; O(w) space for the queue, where w is the tree's widest level — up to n/2 for a bushy tree. Compare DFS's O(h): breadth pays in width, depth pays in height.

**The thread.** Next problem, Right Side View, is this algorithm with a one-line harvest change: from each floor, keep only the last node you serve.`,
    },
    {
      slug: "binary-tree-right-side-view",
      title: "Binary Tree Right Side View",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-right-side-view",
      summary: "Stand to the tree's right: you see exactly one node per level — the last one in BFS order.",
      body: `**The problem.** Standing to the right of a tree, report the nodes you can see, top to bottom. One node per level — the rightmost — with nearer-to-the-right nodes eclipsing everything behind them on their floor.

**The reframe.** Strip the visual: "the right side view" is precisely *the last node of each level*. Once the problem is restated that way, it stops being a new problem at all — it is Level Order Traversal with a harvesting rule. Run the queue with the size-snapshot loop from last problem; within each level's drain, whichever node you dequeue *last* is that floor's visible node. Emit it; discard the rest. The lesson worth keeping is the reduction reflex itself: many "novel" tree problems are a known traversal plus a one-line filter, and the interview skill is naming which traversal within the first minute.

**The DFS variant, for elegance.** Recurse *right child first*, carrying depth, and record a node only when its depth exceeds the deepest recorded so far — the first node reached at each depth is then always the rightmost. Three lines, O(h) space on balanced trees, and a pleasing inversion: same answer, mirrored traversal priority. Offer both; write whichever you narrate more fluently.

**The walk-through.** Tree 1 / (2, 3), 2's right child 5, 3's right child 4. Level [1] → last is 1. Level [2, 3] → last is 3. Level [5, 4] → last is 4. View: [1, 3, 4]. Note 5 is *deeper* than its floor-mates? No — 5 and 4 share a floor, and 4, being dequeued later, eclipses it. If 3 had no child, 5 would be visible: the view can zigzag across subtrees, which is why "just walk the right spine" is wrong — the trap this problem exists to set.

**Complexity.** O(n) time either way; O(w) queue space or O(h) recursion space.

**The thread.** BFS interlude complete. The next problem returns to root-to-leaf recursion with a twist on *what flows down*: Count Good Nodes passes ancestor information — the running maximum — from parent to child, top-down.`,
    },
    {
      slug: "count-good-nodes-in-binary-tree",
      title: "Count Good Nodes in Binary Tree",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-good-nodes-in-binary-tree",
      summary: "Pass the path's running maximum down the recursion — top-down flow, the mirror of everything so far.",
      body: `**The problem.** A node is *good* when no node on the path from the root down to it holds a greater value — it is a running record-holder on its own ancestral line. Count the good nodes.

**The directional insight.** Every measuring problem so far flowed **upward**: children reported heights and verdicts, parents combined them. Goodness flows the other way. Whether I am good depends on my *ancestors* — information that lives above me. So thread it downward as a parameter: recurse with maxSoFar, the largest value on the path into this node. On arrival, compare: my value ≥ maxSoFar → I am good, count one, and my children inherit an updated maximum; otherwise I pass the old maximum along unchanged. Return my subtree's count (mine plus both children's) upward. Two flows in one function — context descending as arguments, tallies ascending as return values — and being consciously fluent in *which direction each piece of information travels* is the skill this problem drills. Interviewers pick it precisely to see whether you reach for the parameter or contort a bottom-up shape that cannot work.

**The walk-through.** Root 3, children 1 and 4; 1's left child 3; 4's children 1 and 5. Root 3: good (nothing above), pass max 3. Node 1: 1 < 3, not good, pass 3. Its child 3: 3 ≥ 3 — good (ties count; the definition says *greater than*, so equal records still qualify), pass 3. Node 4: 4 ≥ 3, good, pass 4. Children 1 (not good) and 5 (good, 5 ≥ 4). Total: 4 good nodes.

**Complexity.** O(n) time, O(h) space. The root is always good — a pleasant sanity check on any implementation.

**The thread.** Passing constraints downward is exactly the machinery the next problem requires — Validate Binary Search Tree, where each node inherits an *allowed range* from its ancestors, and the famous wrong answer comes from checking children instead of ranges.`,
    },
    {
      slug: "validate-binary-search-tree",
      title: "Validate Binary Search Tree",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-binary-search-tree",
      summary: "Not 'children versus parent' — every node must sit inside a range its whole ancestry carved out.",
      body: `**The problem.** Verify that a binary tree satisfies the BST invariant: for *every* node, all values in its left subtree are strictly smaller, all in its right subtree strictly larger.

**The famous wrong answer.** Check each node against its immediate children; recurse. It feels complete and it is not — the invariant is about entire *subtrees*, not children. The canonical counterexample: root 5, left child 3, and 3's right child 4… fine so far — but make that right child 6 instead. Locally impeccable (3 < 5 ✓… and 6 > 3 ✓ from 3's view), yet 6 sits in root 5's **left** subtree while being greater than 5. Broken — and the local check never notices, because the violated relationship spans a grandparent. Every interviewer knows this trap; walking into it is the problem's real test.

**The insight.** Each node lives inside a *window* that its entire ancestry has carved. Start at the root with (−∞, +∞). Descending left tightens the ceiling — everything down there must stay below my value; descending right raises the floor. A node is legal iff its value lies strictly inside its inherited window; recurse left with (low, me) and right with (me, high). This is Count Good Nodes' top-down parameter flow, upgraded from one running number to two bounds — the roadmap ordered these problems deliberately.

**The alternative that doubles as a lesson.** In-order traversal (left, node, right) of a valid BST emits values in strictly increasing order — that *is* the invariant, linearised. So traverse in-order and verify each value exceeds its predecessor. Same O(n); and the fact you only need to remember one previous value foreshadows the next problem directly.

**The walk-through.** Root 5 (−∞, ∞) ✓ → left 3 gets (−∞, 5) ✓ → its right child 6 gets (3, 5) — 6 violates the ceiling → false. The grandparent's constraint arrived via the window, exactly what the naive check lost.

**Complexity.** O(n) time, O(h) space.

**The thread.** In-order traversal just made an entrance; Kth Smallest Element in a BST, next, weaponises it — sorted order on demand, stopped early at the kth emission.`,
    },
    {
      slug: "kth-smallest-element-in-a-bst",
      title: "Kth Smallest Element in a BST",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/kth-smallest-integer-in-bst",
      summary: "In-order traversal emits a BST in sorted order — walk it with a countdown and stop at k.",
      body: `**The problem.** Return the kth smallest value in a binary search tree. No flattening the tree into an array first — the point is to use the structure itself.

**The insight.** A BST does not *store* sorted order; it *implies* it. In-order traversal — recurse left, visit node, recurse right — visits a BST's values in exactly ascending order, because the invariant promises everything left of me is smaller and everything right is larger, applied recursively at every node. So the kth smallest is simply the kth node the traversal *visits*. Carry a countdown: decrement at every visit; when it hits zero, the node under your feet is the answer, and you stop. No arrays, no sorting — the tree was the sorted list all along, folded up.

**Early exit is the craft.** A recursive version wants to unwind cleanly once found — return a found-flag, or raise the answer through an outer variable. The **iterative in-order walk with an explicit stack** is often cleaner here and is a technique worth owning on its own: push left spine as far as it goes; pop (that pop is the next in-order visit — the smallest unvisited value); then step to the popped node's right child and push *its* left spine. Each pop decrements k; the kth pop answers. Being able to run in-order manually, pausable at will, is the skill — it is how BST *iterators* are built, a very common follow-up (and a design you will meet in real codebases).

**The walk-through.** BST 5 / (3, 6), 3's children 2 and 4, 2's left child 1; k = 3. In-order emits 1, 2, 3 — stop. Answer 3. Total nodes touched: the left spine plus three pops — nowhere near the whole tree.

**Complexity.** O(h + k) time — descend the spine, then k pops — O(h) space. The follow-up ("what if the tree is modified often and kth-queries are frequent?") wants subtree-size augmentation: store per-node counts and *navigate* directly to the kth in O(h), Min Stack's augmentation idea grown up.

**The thread.** You now read trees in every direction. Next: build one from its footprints — Construct Binary Tree from Preorder and Inorder Traversal, where two traversal orders pin down the one tree that produced both.`,
    },
    {
      slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
      title: "Construct Binary Tree from Preorder and Inorder Traversal",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal",
      summary: "Preorder names the root; inorder splits left from right — recurse on the two halves.",
      body: `**The problem.** Given a tree's preorder traversal (node, left, right) and its inorder traversal (left, node, right), reconstruct the tree. Values are distinct — a load-bearing guarantee, as you are about to see.

**The insight.** Each order leaks a different secret. **Preorder's first element is the root** — preorder visits the node before either subtree, so the whole tree's root leads the list. Now take that root value and **find it in the inorder sequence: everything to its left is exactly the left subtree's values; everything to its right, the right subtree's** — because inorder sandwiches the node between its two sides. That one split tells you *which* values go left and right, and — counting them — *how many*, which lets you split the remaining preorder list at the same sizes. Two smaller (preorder, inorder) pairs remain: recurse. Each call peels one root and splits what is left; the tree assembles itself top-down.

**The walk-through.** Preorder [3, 9, 20, 15, 7], inorder [9, 3, 15, 20, 7]. Root: 3. In inorder, 3 splits [9] | [15, 20, 7] — left subtree has one node, right has three. Preorder splits accordingly: [9] and [20, 15, 7]. Left: single node 9. Right: root 20; inorder [15] | [7] → children 15 and 7. Tree rebuilt.

**The engineering.** Searching inorder for each root is O(n) per node — O(n²) on degenerate trees. Fix with the chapter-one reflex: a hash map from value → inorder index (distinct values make it well-defined; this is why the guarantee matters), and pass index ranges instead of slicing arrays. A single preorder cursor advancing across the whole build makes the code even cleaner: every call consumes the next preorder element as its root, and recursion order does the bookkeeping.

**Complexity.** O(n) time and space with the map.

**Why the pairing matters.** Preorder alone cannot distinguish a left-only chain from a right-only chain — one traversal underdetermines the tree; the second order resolves the ambiguity. This "two projections pin the object" idea returns in the chapter's finale.

**The thread.** First, the boss fight: Binary Tree Maximum Path Sum — Diameter's architecture, but with values that can be *negative*, forcing every combine step to make choices.`,
    },
    {
      slug: "binary-tree-maximum-path-sum",
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/binary-tree-maximum-path-sum",
      summary: "At each node, two different questions: the best path through me, and the best path I can offer upward.",
      body: `**The problem.** A path is any chain of connected nodes (each node used at most once); its sum is the total of its values. Values may be **negative**. Find the maximum path sum anywhere in the tree. This is the chapter's boss because it forces the return-versus-harvest split from Diameter into its full form — with decisions at every step.

**The two questions.** Stand at a node. Question one: what is the best path that *bends* at me — climbs one side, crosses me, descends the other? That is a complete candidate answer; harvest it into a global best. Question two: what is the best path I can *offer my parent*? A parent extending its path through me can continue down only **one** of my sides — a path may not fork. So my offer is my value plus the better single child offer. Two different quantities, computed together in one post-order pass: the harvest may use both arms; the return value must choose one.

**Where negatives bite.** A child's offer can be *worse than nothing* — a subtree summing negative would drag any path that includes it. So clamp: an offer below zero is declined; take max(offer, 0) per side. The harvest at a node is then value + clampedLeft + clampedRight, and the upward offer is value + max of the clamped sides. Note the root is not special — the best path might live entirely in some subtree, which is exactly why the answer is harvested globally rather than read off the root's return. Initialise the global best to negative infinity, not zero: an all-negative tree's answer is its least-bad single node, and a zero-initialised best silently corrupts that case — the bug that fails hidden tests.

**The walk-through.** Root −10, children 9 and 20; 20's children 15 and 7. Offers upward: 9 → 9; 15 → 15; 7 → 7; node 20 harvests 15 + 20 + 7 = 42, offers 20 + 15 = 35. Root harvests −10 + 9 + 35 = 34; best overall: **42**, living entirely under 20.

**Complexity.** O(n) time, O(h) space — one traversal, every node combining constant-time decisions.

**The thread.** One problem left: flatten a tree to a string and bring it back alive. Serialization is where all the traversal fluency pays out.`,
    },
    {
      slug: "serialize-and-deserialize-binary-tree",
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/serialize-and-deserialize-binary-tree",
      summary: "Preorder with explicit nulls uniquely describes any tree — and reads back as a self-consuming stream.",
      body: `**The problem.** Design serialize(root) → string and deserialize(string) → root such that any binary tree round-trips exactly. This is a *design* problem: no target format is imposed — inventing one that makes both directions easy is the task. It is also a real one: every RPC, cache, and file format is this problem at industrial scale.

**The insight.** Construct-from-Traversals taught that one traversal order underdetermines a tree — two orders were needed. But there is a cheaper fix: one traversal order **with the nulls written down**. Serialize preorder — node, left, right — emitting a sentinel (say, N) for every empty child, values separated by delimiters (chapter one's Encode/Decode lesson: 2 and 22 must never blur). The nulls record the *shape*: they say exactly where branches end, which is precisely the information a second traversal existed to supply. With them, preorder describes one and only one tree.

**Deserialization is the elegant half.** Read the tokens as a stream with a single advancing cursor. Take the next token: if N, return null — this subtree is empty; otherwise make a node from it, then *build its left subtree from the stream, then its right* — recursively, each call consuming exactly the tokens that belong to it. No indexes, no splitting, no lookahead: the recursion structure and the token order are the *same shape*, so the stream self-partitions. This mirrored pair — writer's traversal order = reader's consumption order — is the deep principle; it is why recursive-descent parsers work, and why formats designed without this symmetry hurt.

**The walk-through.** Tree 1 / (2, 3), 3's children 4, 5. Serialize: 1, 2, N, N, 3, 4, N, N, 5, N, N. Deserialize: 1 → build left: 2 → left N, right N, done → build right: 3 → left: 4 (N, N) → right: 5 (N, N). Identical tree, guaranteed.

**Complexity.** O(n) both directions; the string carries n values and n + 1 sentinels — linear, and the sentinels are the price of uniqueness. (BFS-order serialization works too — it is what LeetCode's own bracket format does; preorder's recursion is simply less machinery.)

**The thread.** Trees complete — fifteen problems, one grammar. The roadmap now forks three ways from this junction, and the atlas takes them in turn: first the Heap, a tree so disciplined it lives inside a flat array and answers "what is the smallest thing I hold?" in constant time — then Backtracking, then Tries. On to the machine room.`,
    },
  ],
};
