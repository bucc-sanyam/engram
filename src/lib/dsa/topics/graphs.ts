import type { DsaTopic } from "../types";

/** Chapter 11 — Graphs: structure without hierarchy. */
export const graphs: DsaTopic = {
  slug: "graphs",
  title: "Graphs",
  chapter: 11,
  tagline: "Nodes connected however they please — DFS, BFS, topological order, and union-find cover the territory.",
  color: "#9fb3ff",
  prereqs: ["backtracking"],
  unlocks: ["advanced-graphs", "math-geometry", "dp-2d"],
  intro: `Everything in this atlas so far had a shape imposed on it — chains, windows, trees. Graphs drop the imposition: nodes connect to whatever they connect to. Friendships, road maps, dependency lists, the internet — anything relational is a graph, which is why this chapter's tools end up used more often in real systems than perhaps any other's.

Losing hierarchy costs you two comforts trees gave for free. There is no root — no natural place to start — and there are **cycles**: follow edges naively and you will walk in circles forever. The cure is the *visited set*, and the discipline of marking a node **when you first commit to it** (not later — later is how BFS enqueues the same node twice). Every graph algorithm is some traversal wearing a visited set; the craft is choosing the traversal.

Three, plus a bookkeeping structure, cover this entire chapter. **DFS** — backtracking's engine pointed at real structure — dives deep and answers reachability, connectivity, and "explore this whole region" (Number of Islands, Max Area, Surrounded Regions). **BFS** expands in rings and is the *only* correct instinct for unweighted shortest-anything (Walls and Gates, Rotting Oranges — including its lovely multi-source variant — and Word Ladder). **Topological sort** handles directed dependency graphs: which order satisfies all the arrows, and does a legal order even exist (Course Schedule I and II — cycle detection and build orders). And **union-find** answers connectivity *incrementally* — components merging edge by edge (Connected Components, Redundant Connection, Graph Valid Tree) — with two tiny optimisations that make it effectively O(1) per operation.

One more habit this chapter installs: most of its problems never hand you a graph object. A grid of land and water *is* a graph — cells are nodes, adjacency is edges. A prerequisites list, a word list where neighbours differ by one letter: graphs, once you see the nodes and edges. Half the skill is the modelling step nobody writes down.

On the roadmap, Graphs unlocks Advanced Graphs (weights, and algorithms with names), 2-D DP, and Math & Geometry. This chapter is the hub of the atlas's back half.`,
  problems: [
    {
      slug: "number-of-islands",
      title: "Number of Islands",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-number-of-islands",
      summary: "Flood fill: every unvisited land cell you trip over is a new island — sink it whole and keep scanning.",
      body: `**The problem.** A grid of 1s (land) and 0s (water): count the islands — maximal groups of land connected up/down/left/right. The hello-world of graph problems, and the template a dozen later problems reuse.

**The modelling step first.** Nobody hands you nodes and edges. *You* declare them: each cell is a node; orthogonal neighbours are edges. An island is then precisely a **connected component** — a set of nodes mutually reachable — and the question becomes "how many connected components does this graph have?" Saying that sentence out loud in an interview is worth as much as the code.

**The insight.** Scan the grid cell by cell. Water: skip. Land you have *already visited*: skip — it belongs to an island you have counted. Land you have never seen: you have discovered a brand-new island — count it, and immediately **flood-fill** from it: DFS (or BFS) to every reachable land cell, marking each visited, so the rest of this island can never trigger the counter again. The count increments exactly once per component, at its first-discovered cell; the fill is what enforces "exactly once."

**The mechanics.** DFS from a cell: bounds-check, water-check, visited-check — return on any; otherwise mark and recurse in four directions. Marking can be a visited set or — the common trick — overwriting the cell to 0, "sinking" the island into the grid itself (mutation traded for memory; mention the trade). This is Word Search's mark-and-explore made permanent: no unchoose, because visited means *globally done*, not "in my current path" — the deep difference between component exploration and backtracking.

**The walk-through.** Grid rows 110 / 110 / 001. Cell (0,0): new land → count 1, flood sinks the four connected 1s. Scan continues over sunk cells silently. Cell (2,2): new land → count 2. Answer 2.

**Complexity.** O(rows × cols) time — each cell touched a constant number of times — O(rows × cols) space worst case (recursion depth on an all-land grid; an explicit stack or BFS queue dodges deep-recursion limits, a practical aside worth one sentence).

**The thread.** Counting components was a yes/no per cell. Next problem asks the fill to *measure* what it sinks — same traversal, now with a return value.`,
    },
    {
      slug: "max-area-of-island",
      title: "Max Area of Island",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/max-area-of-island",
      summary: "The same flood fill, now counting as it sinks — traversals that measure, not just visit.",
      body: `**The problem.** Same grid, new question: the *area* of the largest island. Zero if there is no land.

**The insight.** Identical skeleton to Number of Islands — scan, discover, flood — but the fill now *returns a number*. Define it recursively, exactly the way Trees taught you: the area claimed from this cell is 0 if out-of-bounds, water, or visited; otherwise 1 (me) plus whatever the four recursive neighbour calls claim. Sink cells as you count so nothing is claimed twice. The outer scan keeps a running maximum of the areas its discoveries report. That is the entire change — and that is the lesson: the traversal is a *chassis*, and what you bolt on (a counter, a max, a collected list, a painted colour) varies freely without touching the chassis. Interviewers love follow-ups precisely because they test whether you built the chassis or memorised one assembly.

**The walk-through.** Grid rows 0110 / 0100 / 0011. Discovery at (0,1): the fill claims (0,1), (0,2)… wait — (0,2) is 1, (1,1) is 1: total 3. Discovery at (2,2): claims (2,2), (2,3): total 2. Max: 3.

**The recursion-shape note.** The return-a-count fill is *structurally* Maximum Depth of Binary Tree — combine children's answers with mine — except "children" are the four neighbours and the visited-check prevents infinite loops where the tree's shape used to. Once you see grid-DFS as tree-DFS plus a visited set, every one of these problems is ten minutes.

**Variations to expect.** Diagonals count as connected (eight directions instead of four — one array change). Perimeter instead of area (count exposed edges: contribute 1 for each neighbour that is water or out of bounds). Number of *distinct island shapes* (serialize each fill's path — chapter seven's serialization trick, sideways). All the same chassis.

**Complexity.** O(rows × cols) time and space, as before.

**The thread.** Grids two, abstract graphs zero. Clone Graph, next, hands you honest nodes and pointers — and asks you to deep-copy a structure that may loop back on itself mid-copy.`,
    },
    {
      slug: "clone-graph",
      title: "Clone Graph",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/clone-graph",
      summary: "Deep-copy a cyclic structure: the old-to-new map is both your correspondence and your visited set.",
      body: `**The problem.** Given a node of a connected, undirected graph (each node: a value and a neighbour list), return a deep copy — new nodes, wired identically, no references into the original.

**Why naive copying loops forever.** Copy a node, then recursively copy its neighbours: in a graph with a cycle — even a simple triangle — the recursion returns to where it started, copies it *again*, and never terminates. The tree version of this problem is trivial precisely because trees cannot do that. The cycle is the problem.

**The insight.** You met this exact difficulty in Copy List with Random Pointer, and the same cure works: a hash map from original → clone. On visiting a node, check the map first: **already cloned → return the existing clone** — this both breaks the infinite loop *and* wires cycles correctly, because the second visitor links to the same clone the first visitor made, recreating the cycle in the copy. Not in the map → create the clone, *register it immediately* (before touching neighbours — registration order is the entire correctness argument), then fill its neighbour list with recursive clones of the original's neighbours. The map plays two roles at once: correspondence table and visited set. Realising those are the same object here is the aha.

**The walk-through.** Triangle 1–2, 2–3, 3–1. Clone 1, register. Neighbour 2: clone, register; its neighbour 3: clone, register; *its* neighbour 1 — in the map → link to clone-1, cycle closed cleanly; 3's list done; back up, 2's list done; 1's list done. Every node cloned once, every edge wired twice (undirected), recursion terminated by the map alone.

**Register-before-recursing** is the line to get right: register after, and a cycle re-enters the unregistered node and recurses forever. Same discipline as marking BFS nodes at *enqueue* time — commit at first contact.

**Complexity.** O(V + E) time — each node cloned once, each edge walked from both ends — O(V) space for the map plus recursion. BFS with the same map works identically; the map, not the traversal, is the algorithm.

**The thread.** DFS has had three wins. Time for BFS to show what only it can do: Walls and Gates — distances rippling outward from *many* sources at once.`,
    },
    {
      slug: "walls-and-gates",
      title: "Walls and Gates",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/islands-and-treasure",
      summary: "Multi-source BFS: start the wave from every gate at once, and each cell's first touch is its true distance.",
      body: `**The problem.** A grid of gates (0), walls (−1), and open rooms (infinity): fill each room with the distance to its *nearest* gate. Unreachable rooms stay infinite. (NeetCode dresses it as islands and treasure; the structure is identical.)

**The wrong direction.** BFS from each room outward, looking for a gate? Correct answers, ruinous cost — every room repeats work over the same terrain: O(rooms × cells). The reflex to build instead: **flip the direction**. Do not ask each consumer to find its nearest source; let the sources *broadcast*.

**The insight — multi-source BFS.** Seed the queue with **every gate simultaneously**, all at distance 0, then run one ordinary BFS. The wave expands in lockstep rings: first every cell at distance 1 from *some* gate, then distance 2, and so on. When the wave first touches a room, that touch is — provably — from its nearest gate: no closer gate exists, or its ring would have arrived earlier. Nearest-gate competition, which sounded like it needed per-room comparisons, is resolved automatically by *arrival order*. One traversal, every answer.

**The mechanics.** Enqueue all gates. Pop a cell; for each orthogonal neighbour that is an open room still marked infinite (that check doubles as the visited set — already-filled cells are claimed), write distance = mine + 1 and enqueue it. Walls never enter the queue. Mark at *enqueue* time, as always — two gates flanking one room must not both claim it.

**The walk-through.** Row: gate, room, room, wall, room, gate. The wave: both gates enqueue. Ring 1: the rooms adjacent to each gate get 1. Ring 2: the middle-left room gets 2. The wall stops propagation; the room beyond it was reached from the right gate at distance 1, not from the left at distance 4 — arrival order did the min() for free.

**Complexity.** O(cells) time, O(cells) space — versus the per-room version's O(cells²) in the worst case.

**The thread.** Multi-source BFS with distances as rings. Rotting Oranges, next, is the same wave wearing a stopwatch — rings become *minutes*, and the question becomes "how long until the wave has touched everything it ever will?"`,
    },
    {
      slug: "rotting-oranges",
      title: "Rotting Oranges",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/rotting-fruit",
      summary: "BFS rings as time steps: rot spreads one minute per ring, and leftovers mean minus one.",
      body: `**The problem.** A grid of empty cells, fresh oranges, and rotten oranges. Every minute, rot spreads to orthogonally adjacent fresh oranges. How many minutes until nothing fresh remains — or −1 if some orange can never be reached?

**The insight.** This is Walls and Gates with the story changed: rotten oranges are the sources, rot-spread is the BFS wave, and **each BFS ring is one minute of simulated time**. Multi-source seed (all initially rotten oranges at minute 0), expand ring by ring, and the answer is the number of the last ring that actually rotted something. The mapping "BFS depth = elapsed time" is the transferable idea — any synchronised, step-wise spreading process (fire, infection, signal propagation) is this exact algorithm.

**The bookkeeping that decides correctness.** Two details carry the problem. First, ring boundaries: process the queue level-by-level (snapshot its size per round — the Level Order Traversal loop from Trees, back again) so minutes tick once per ring, not once per orange. Second, count the fresh oranges up front; decrement as they rot. When the wave dies out, leftover fresh count > 0 → −1: some orange was walled off by empty cells. Edge cases interviewers watch for: zero fresh oranges at the start → answer 0 (no time passes — do not report the seed round as a minute); no rotten oranges but fresh ones exist → −1 immediately.

**The walk-through.** Rows: rotten-fresh-fresh / fresh-fresh-empty / empty-fresh-fresh. Minute 1: the two oranges beside the source rot. Minute 2: two more. Minute 3: one more. Minute 4: the last one. Queue empties, fresh count 0 → answer 4. Wall off the bottom-right pair with empties instead, and they never rot → −1.

**Complexity.** O(cells) time and space — every cell enqueued at most once; each minute is a queue generation, not a grid rescan.

**The thread.** Two waves outward from sources. Pacific Atlantic, next, inverts the flow direction *again* — water that must reach two oceans, solved by walking uphill from the coastlines and intersecting.`,
    },
    {
      slug: "pacific-atlantic-water-flow",
      title: "Pacific Atlantic Water Flow",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/pacific-atlantic-water-flow",
      summary: "Reverse the flow: climb from each coastline, take the intersection of the two reachable sets.",
      body: `**The problem.** A height grid; rain flows from any cell to orthogonal neighbours of **equal or lower** height. The Pacific touches the top and left edges, the Atlantic the bottom and right. Which cells can send water to *both* oceans?

**The forward trap.** From each cell, search downhill for both coastlines: O(cells) work per cell, O(cells²) total, with wild re-exploration — the same per-consumer waste as Walls and Gates, and the same cure.

**The insight — run the river backwards.** Instead of asking "which cells reach the Pacific?", ask "which cells can the Pacific reach, *climbing*?" Start from every Pacific-edge cell (multi-source again) and traverse with the rule inverted: you may step to a neighbour whose height is **greater than or equal to** yours — walking uphill traces exactly the paths water would have run down. The visited set of that traversal *is* the full pacific-reachable set, computed in one sweep. Do the same from the Atlantic edges. The answer is the **intersection** of the two sets. Two linear traversals and a set intersection replace a quadratic forward search — and "reverse the direction of a reachability question, then intersect" is a trick that transfers to dependency and escape problems everywhere.

**The mechanics.** Either DFS or BFS works; seed all edge cells of one ocean, expand with the uphill rule, collect. Keep the two visited sets separate — two boolean grids — and read off cells marked in both. The equal-height case matters (water flows across plateaus); ≥, not >.

**The walk-through.** Classic 5×5 height grid: the crest cells — e.g. the 5s sitting on the ridge from top-right to bottom-left — appear in both climbs and form the answer; the low northwest corner reaches only the Pacific climb.

**Complexity.** O(rows × cols) time and space — each traversal touches each cell at most once.

**The thread.** Reachability *from* the border turns out to be the key to the next problem too — Surrounded Regions, where the regions that survive are exactly the ones the border can touch.`,
    },
    {
      slug: "surrounded-regions",
      title: "Surrounded Regions",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/surrounded-regions",
      summary: "Don't find the captured — find the safe: flood from the border, then flip everyone unmarked.",
      body: `**The problem.** A grid of X and O: capture (flip to X) every region of Os that is *fully surrounded* by Xs. A region touching the board's edge escapes — it is not surrounded.

**The inversion.** Directly testing "is this region surrounded?" means flooding a region while watching for edge contact, then flipping or not — doable, but bookkeeping-heavy and easy to fumble. Flip the question, exactly as Pacific Atlantic just taught: a region is captured **unless it touches the border**, so find the *survivors* instead. Survivors are precisely the Os reachable from some border O — one multi-source flood from all border Os marks every safe cell (temporarily relabel them, say to T). Then a single sweep finishes it: every O still unmarked is provably surrounded → flip to X; every T is a survivor → restore to O. No per-region analysis ever happens; the border flood settles all regions at once.

**Why complement-thinking wins.** "Surrounded" is a *global negative* — it asserts no escape exists anywhere along the region's frontier, which is awkward to verify incrementally. "Touches the border" is a *local positive* — one flood from known-safe seeds. When a property is hard to confirm and its complement is easy to reach, compute the complement. This is the second consecutive problem built on that reflex; it is now yours.

**The walk-through.** Grid rows XXXX / XOOX / XXOX / XOXX. Border scan finds one border O at (3,1) → flood marks it T (its only neighbours are X — the region is just itself). Sweep: the interior Os at (1,1), (1,2), (2,2) are unmarked → flipped to X; (3,1) restores to O. Exactly the textbook answer.

**The in-place bonus.** The T-relabel uses the grid itself as the visited set and the safe-set simultaneously — no extra structures beyond the flood's stack/queue. Interviewers read the three-symbol dance (O → T → O, unmarked O → X) as fluency.

**Complexity.** O(rows × cols) time, O(rows × cols) worst-case stack.

**The thread.** Six problems of undirected terrain. Now the edges grow arrowheads: Course Schedule — directed graphs, dependencies, and the question "does a legal order even exist?"`,
    },
    {
      slug: "course-schedule",
      title: "Course Schedule",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/course-schedule",
      summary: "Prerequisites form a directed graph — you can finish them all if and only if it has no cycle.",
      body: `**The problem.** n courses, and prerequisite pairs (a, b): b must be taken before a. Can every course be completed? [[1, 0]] → yes (0 then 1). [[1, 0], [0, 1]] → no — each requires the other first.

**The modelling.** Courses are nodes; each prerequisite is a directed edge b → a. A moment's thought turns the question structural: the schedule is impossible exactly when some chain of prerequisites loops back on itself — you can finish all courses **iff the directed graph has no cycle**. The problem *is* cycle detection, and saying that transformation aloud is half the interview.

**Why undirected tricks fail.** In directed graphs, "I reached a node I have seen before" no longer implies a cycle — two prerequisite chains merging on a shared course revisit a node with no loop anywhere. Detection needs to distinguish *seen ever* from *seen on my current path*.

**The insight — three colours.** Give each node one of three states: unvisited; **in progress** (its DFS has started and not finished — it is on the current recursion path); done (its entire subtree explored, provably cycle-free). DFS along edges: meeting a *done* node is harmless — skip. Meeting an **in-progress** node means you walked back into your own active path: a cycle, report failure. Finish a node (mark done) only after all its outgoing edges are explored. Run from every unvisited node (the graph may be disconnected). The in-progress state is exactly "the current root-to-here path" — Backtracking's path-awareness, fused onto Graphs' visited set.

**The walk-through.** Edges 0→1→2→3 and 3→1: DFS enters 0, 1, 2, 3; from 3, the edge to 1 finds 1 *in progress* → cycle → false. Remove 3→1: 3 finishes, 2 finishes, 1, 0 — all done, true.

**Complexity.** O(V + E) time and space. (The BFS alternative — Kahn's algorithm, repeatedly removing zero-prerequisite courses — detects cycles as "nodes left over," and is next problem's star.)

**The thread.** Yes/no answered. Course Schedule II asks for the *actual order* — and the finishing sequence of this very DFS, reversed, turns out to be one.`,
    },
    {
      slug: "course-schedule-ii",
      title: "Course Schedule II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/course-schedule-ii",
      summary: "Topological sort: peel zero-prerequisite courses layer by layer, or reverse DFS finishing order.",
      body: `**The problem.** Same setup — return an actual valid ordering of all courses, or an empty list if none exists. The name for such an ordering: a **topological sort** — every edge points forward in it. Build systems, package managers, spreadsheet recalculation, task pipelines: all of them are this problem wearing work clothes.

**Kahn's algorithm (BFS flavour).** Track each node's **in-degree** — how many unmet prerequisites it has. Any node at in-degree zero is takeable *right now*; queue them all. Repeatedly: pop one, append it to the order, and — the key move — *delete it from the graph* by decrementing every successor's in-degree; successors hitting zero join the queue. The order grows in dependency-respecting layers, like peeling an onion from the outside. And the cycle check falls out free: nodes in a cycle can never reach in-degree zero (each waits on another), so if the final order is shorter than n, a cycle exists → return empty. Count-processed-versus-n *is* the detector.

**DFS flavour, one insight.** Run last problem's three-colour DFS, and record each node **at the moment it finishes** — when everything it points to is fully explored. A node finishes only after its dependents… careful, after its *successors* — everything it must precede — are done. So finishing order is reverse-topological: collect finishes, reverse at the end. Two very different traversals, same certificate; knowing both, and that Kahn's gives you incremental "what can run now" semantics while DFS composes with other passes, is the senior-level garnish.

**The walk-through (Kahn's).** 4 courses, edges 0→1, 0→2, 1→3, 2→3. In-degrees: 0, 1, 1, 2. Queue [0] → take 0; 1 and 2 drop to zero → take 1 (3 drops to 1), take 2 (3 drops to 0) → take 3. Order [0, 1, 2, 3] — [0, 2, 1, 3] equally valid; the queue's tie order decides, and *multiple correct answers* is a stated feature.

**Complexity.** O(V + E) time and space, both flavours.

**The thread.** Directed dependencies handled. The chapter now shifts to its fourth tool — union-find — with Graph Valid Tree: connectivity plus the *no-cycle* condition, checked by merging.`,
    },
    {
      slug: "graph-valid-tree",
      title: "Graph Valid Tree",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-tree",
      summary: "A tree is n−1 edges, no cycle, one component — union-find verifies all three while merging.",
      body: `**The problem.** n nodes and a list of undirected edges: do they form a valid tree? A tree, structurally: **connected** (one piece) and **acyclic** (no loops). Two conditions, one lovely counting fact between them.

**The counting fact first.** A tree on n nodes has *exactly* n − 1 edges. Fewer → cannot be connected. More → must contain a cycle (each edge beyond n − 1 closes a loop somewhere). So check the count up front: wrong → false immediately. Right count → the two conditions collapse into one: with n − 1 edges, acyclic *implies* connected (and vice versa) — verify either, get both. This little theorem does half the problem before any traversal starts.

**Union-find, introduced properly.** The structure this problem showcases maintains a partition of nodes into components under one operation: **union(a, b)** merges the components containing a and b; **find(x)** names x's component (its root representative). Implementation: each node points toward a parent; roots point to themselves; find follows parents to the root; union links one root under the other. Two standard optimisations — *path compression* (find re-points every node it walks directly at the root) and *union by rank/size* (attach the shorter tree under the taller) — flatten the forest until each operation is effectively O(1) (inverse-Ackermann, a function that never exceeds 5 in this universe; cite it, don't prove it).

**The insight.** Feed the edges through union-find. For each edge (a, b): if find(a) equals find(b), the two nodes are *already* connected — this edge closes a **cycle** → false. Otherwise union them. Survive all edges (with the count pre-checked) → true. The cycle test is one comparison per edge; no DFS, no visited set, no recursion.

**The walk-through.** n = 5, edges (0,1), (0,2), (0,3), (1,4): four edges = n − 1 ✓; each union merges strangers ✓ → tree. Swap (1,4) for (1,2): find(1) and find(2) already agree → cycle → false.

**Complexity.** O(E · α(n)) ≈ O(E) time, O(n) space. (DFS works too — detect cycles and count reached nodes — same asymptotics; union-find needs no adjacency list at all.)

**The thread.** Union-find just detected one cycle. Connected Components, next, uses it as a *counter* — and the DFS-versus-union-find choice becomes the interview conversation itself.`,
    },
    {
      slug: "number-of-connected-components",
      title: "Number of Connected Components in an Undirected Graph",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-connected-components",
      summary: "Start at n islands and merge: every successful union is two components becoming one.",
      body: `**The problem.** n nodes, a list of undirected edges: how many connected components? Number of Islands asked this about a grid; here the graph is abstract — and the freedom of input format makes it the cleanest stage for comparing the chapter's two connectivity tools head-to-head.

**The union-find way.** Begin with the truth before any edges: n nodes, n components, everyone alone. Process each edge with a union — and notice the accounting: a union of two nodes *already sharing* a component changes nothing (the edge is redundant); a union of two strangers **fuses two components into one**. So: components = n − (number of unions that actually merged). Have union return whether it merged, count the successes, subtract. No traversal, no adjacency list, no visited set — three lines of arithmetic wrapped around the structure from last problem. And it is **incremental**: edges could arrive as a stream (think: friendships forming) and the count stays live at every moment — the capability DFS fundamentally lacks.

**The DFS way.** Build an adjacency list, then the Number of Islands loop: scan all nodes; each unvisited one is a fresh component — count it, flood its component with DFS. O(V + E), entirely solid — the right answer when the graph is *given whole* and you are already building adjacency for other reasons.

**The comparison, which is the real content.** Static graph, need paths or structure too → DFS. Edges arriving over time, only connectivity questions → union-find, no contest. Saying *when each wins* is worth more than either implementation; this problem exists to let you say it.

**The walk-through.** n = 5, edges (0,1), (1,2), (3,4). Start: 5 components. Union(0,1): merge → 4. Union(1,2): merge → 3. Union(3,4): merge → 2. Answer 2 — node set {0,1,2}, {3,4}.

**Complexity.** Union-find: O(E · α(n)) time, O(n) space. DFS: O(V + E) both.

**The thread.** Union-find's merge-refusal — "these two are already connected" — was a cycle alarm in Graph Valid Tree and a no-op here. Redundant Connection, next, makes it the *entire answer*: find the one edge that closes the loop.`,
    },
    {
      slug: "redundant-connection",
      title: "Redundant Connection",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/redundant-connection",
      summary: "Feed edges through union-find; the first edge joining two already-connected nodes is the culprit.",
      body: `**The problem.** A graph that *was* a tree until exactly one extra edge was added. Find that edge — if several candidates would restore treehood, return the one appearing **last** in the input. n nodes, n edges (one too many for a tree — the counting fact from Graph Valid Tree, felt from the other side).

**The insight.** One extra edge on a tree creates exactly one cycle, and the redundant edge is *an* edge of that cycle. Process the input edges in order through union-find: each edge either merges two components (fine — tree-building proceeding normally) or arrives to find its endpoints **already connected** — meaning a path between them existed before this edge, so this edge closes the cycle. Report it. The tie-breaking rule dissolves on inspection: processing in input order means the closing edge you trip over is automatically the *latest* cycle edge in the input — every earlier cycle edge merged innocently before the loop existed. The requirement that looked like extra logic is satisfied by the processing order itself; noticing that is the little joy of the problem.

**The walk-through.** Edges (1,2), (1,3), (2,3). Union(1,2): merge. Union(1,3): merge. Union(2,3): find(2) and find(3) already agree — the path 2–1–3 exists → answer (2,3). Reorder input as (2,3), (1,2), (1,3): now (1,3) is the closer → answer (1,3) — same cycle, different culprit, exactly per the rule.

**Why union-find over DFS here.** A DFS could find the cycle after building the graph — but then which cycle edge is "last in input"? You would re-derive input positions awkwardly. Union-find *is* an input-order streamer by nature; the algorithm and the tie-break speak the same language. Choosing the tool whose native behaviour matches the problem's quirk: that is the skill on display.

**The follow-up worth knowing exists.** Directed version (Redundant Connection II) is genuinely harder — two-parent nodes versus cycles, case analysis. Name it; don't volunteer to solve it.

**Complexity.** O(E · α(n)) time, O(n) space.

**The thread.** Union-find's trilogy closes. The chapter's finale returns to BFS for its purest calling — shortest transformation paths — in a graph whose edges you must *imagine*: Word Ladder.`,
    },
    {
      slug: "word-ladder",
      title: "Word Ladder",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/word-ladder",
      summary: "Words are nodes, one-letter changes are edges — BFS the implicit graph, generating neighbours by pattern.",
      body: `**The problem.** Transform beginWord into endWord, one letter at a time, every intermediate step a real word from the given list. Return the length of the *shortest* transformation sequence (counting both ends), or 0. hit → cog via hit, hot, dot, dog, cog: length 5.

**The modelling, one more time.** Words are nodes; an edge joins words differing in exactly one letter. "Shortest sequence" in an unweighted graph → **BFS**, no deliberation needed — depth of first arrival is the answer, the guarantee BFS has carried since Walls and Gates. The interest is entirely in the edges: nobody gives them to you, and *computing* them is where the problem's difficulty actually lives.

**The neighbour-generation trade.** Comparing all word pairs for one-letter difference: O(n² · wordLength) — 50k words is 2.5 billion comparisons, dead on arrival. Generate instead: from the current word, try all wordLength × 25 single-letter mutations and keep those present in a hash set of the dictionary — O(wordLength · 26) per node, independent of dictionary size. Chapter one's "membership is O(1)" reflex, deciding a graph problem's feasibility. (The elegant alternative: bucket words by wildcard patterns — h*t, *ot — so each bucket *is* an adjacency list; either works, and mentioning both is range.)

**The essential pruning.** Remove words from the set (or mark visited) *as you enqueue them*. Any later path reaching the same word is necessarily no shorter — BFS's rings guarantee it — so revisits are pure waste, and without the removal the frontier explodes. This is the visited-at-enqueue discipline under maximum load.

**The walk-through.** hit: mutations find hot. hot: dot, lot. Ring 3: dot→dog, lot→log. Ring 4: dog→cog ✓ → 5 words. Every arrival was first-arrival; every first-arrival was optimal.

**Complexity.** O(n · wordLength · 26) time with the set, O(n) space. Bidirectional BFS — expand from both ends, always growing the smaller frontier, meet in the middle — cuts the exponent in half; it is the follow-up and the phrase to say.

**The thread.** Thirteen problems: flood fills, waves, orderings, mergers, imagined edges. The territory ahead adds *weights* — edges that cost — where plain BFS breaks and the named algorithms live: Dijkstra, Prim, Kruskal. Advanced Graphs is next.`,
    },
  ],
};
