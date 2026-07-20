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
      body: `**Signal.** "Count the islands — maximal groups of land connected up/down/left/right" — connectivity over a grid is the tell that cells are nodes, adjacency is edges, and an island is a **connected component**: "how many connected components does this graph have?"

**Brute force.** For every land cell, run a fresh search to find all cells reachable from it and record the resulting set — massively redundant, since every cell in the same island re-derives the same component from scratch: O((rows·cols)²) in the worst case.

**Optimal approach.** Scan the grid cell by cell. Water: skip. Land already visited: skip — it belongs to an island already counted. Land never seen: a brand-new island — count it, and immediately **flood-fill** from it: DFS (or BFS) to every reachable land cell, marking each visited, so the rest of this island can never trigger the counter again. Marking can be a visited set or the common trick of overwriting the cell to 0, "sinking" the island into the grid itself.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "r0c0", "label": "1", "row": 0, "col": 0 },
    { "id": "r0c1", "label": "1", "row": 0, "col": 1 },
    { "id": "r0c2", "label": "0", "row": 0, "col": 2 },
    { "id": "r1c0", "label": "1", "row": 1, "col": 0 },
    { "id": "r1c1", "label": "1", "row": 1, "col": 1 },
    { "id": "r1c2", "label": "0", "row": 1, "col": 2 },
    { "id": "r2c0", "label": "0", "row": 2, "col": 0 },
    { "id": "r2c1", "label": "0", "row": 2, "col": 1 },
    { "id": "r2c2", "label": "1 (island 2)", "row": 2, "col": 2 }
  ],
  "edges": [
    { "from": "r0c0", "to": "r0c1" },
    { "from": "r0c0", "to": "r1c0" },
    { "from": "r0c1", "to": "r1c1" },
    { "from": "r1c0", "to": "r1c1" }
  ],
  "caption": "Two connected components: the top-left 2×2 block (island 1, fully flood-filled) and the isolated cell at (2,2) (island 2). The scan counts each exactly once, at first discovery."
}
\`\`\`

**Complexity.** O(rows × cols) time — each cell touched a constant number of times — O(rows × cols) space worst case (recursion depth) — versus the brute force's quadratic re-derivation of the same components.

**Thread.** Counting components was a yes/no per cell. Next problem asks the fill to *measure* what it sinks — same traversal, now with a return value.`,
    },
    {
      slug: "max-area-of-island",
      title: "Max Area of Island",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/max-area-of-island",
      summary: "The same flood fill, now counting as it sinks — traversals that measure, not just visit.",
      body: `**Signal.** "The *area* of the largest island" — the same connected-component structure as Number of Islands, but now the traversal must return a measurement instead of just a yes/no discovery, which is the tell that the flood fill needs a return value, not just a visited mark.

**Brute force.** Flood-fill each island as in Number of Islands purely to mark it, then in a separate pass count how many cells belong to each labeled island — works, but does the counting in a second pass instead of folding it into the same walk.

**Optimal approach.** Identical skeleton to Number of Islands — scan, discover, flood — but the fill now *returns a number*. Define it recursively, exactly the way Trees taught you: the area claimed from this cell is 0 if out-of-bounds, water, or visited; otherwise 1 (me) plus whatever the four recursive neighbour calls claim. Sink cells as you count so nothing is claimed twice. The outer scan keeps a running maximum of the areas its discoveries report.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "c01", "label": "(0,1): 1 + area(0,2) + area(1,1)", "children": ["c02", "c11"], "highlight": true },
    { "id": "c02", "label": "(0,2): 1 (leaf — neighbours are water/out of bounds)", "highlight": true },
    { "id": "c11", "label": "(1,1): 1 (leaf)", "highlight": true }
  ],
  "rootId": "c01",
  "caption": "area(0,1) = 1 + area(0,2) + area(1,1) = 3 — the same combine-children-with-mine shape as Maximum Depth of Binary Tree, with grid neighbours standing in for tree children."
}
\`\`\`

**The recursion-shape note.** Once you see grid-DFS as tree-DFS plus a visited set, every one of these problems is ten minutes. Variations to expect: eight-directional connectivity (diagonals count), perimeter instead of area (contribute 1 per water/out-of-bounds neighbour), or distinct island shapes (serialize each fill's path).

**Complexity.** O(rows × cols) time and space, as before — versus the brute force's extra full pass to tally areas after the fact.

**Thread.** Grids two, abstract graphs zero. Clone Graph, next, hands you honest nodes and pointers — and asks you to deep-copy a structure that may loop back on itself mid-copy.`,
    },
    {
      slug: "clone-graph",
      title: "Clone Graph",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/clone-graph",
      summary: "Deep-copy a cyclic structure: the old-to-new map is both your correspondence and your visited set.",
      body: `**Signal.** "Return a deep copy — new nodes, wired identically" of a graph that may contain **cycles** — the possibility of a cycle is the tell that naive recursive copying (clone a node, then recursively clone its neighbours) will loop forever, the way it never could on a tree.

**Brute force (why it fails).** Copy a node, then recursively copy its neighbours — in a graph with a cycle, even a simple triangle, the recursion returns to where it started, copies it *again*, and never terminates. Not a slower solution, a non-terminating one.

**Optimal approach.** A hash map from original → clone, the same cure as Copy List with Random Pointer. On visiting a node, check the map first: **already cloned → return the existing clone** — this both breaks the infinite loop *and* wires cycles correctly, because the second visitor links to the same clone the first visitor made. Not in the map → create the clone, *register it immediately* (before touching neighbours — registration order is the entire correctness argument), then fill its neighbour list with recursive clones of the original's neighbours.

\`\`\`viz:table-diff
{
  "columns": ["Original node", "Clone (map entry)"],
  "before": [[1, "clone-1 (registered before recursing)"], [2, "clone-2 (registered before recursing into 3)"]],
  "after": [[3, "clone-3 registered; its neighbour 1 is already in the map → link to clone-1, closing the cycle"]],
  "caption": "Clone Graph on a triangle 1–2–3–1 — registering each clone before recursing into its neighbours is what lets the third visitor close the cycle instead of recursing forever."
}
\`\`\`

**Register-before-recursing** is the line to get right: register after, and a cycle re-enters the unregistered node and recurses forever — the same discipline as marking BFS nodes at *enqueue* time.

**Complexity.** O(V + E) time — each node cloned once, each edge walked from both ends — O(V) space for the map plus recursion. BFS with the same map works identically.

**Thread.** DFS has had three wins. Time for BFS to show what only it can do: Walls and Gates — distances rippling outward from *many* sources at once.`,
    },
    {
      slug: "walls-and-gates",
      title: "Walls and Gates",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/islands-and-treasure",
      summary: "Multi-source BFS: start the wave from every gate at once, and each cell's first touch is its true distance.",
      body: `**Signal.** "Fill each room with the distance to its *nearest* gate" — multiple sources competing for "nearest," in an unweighted grid, is the tell for multi-source BFS: let the sources broadcast outward together instead of asking each room to search for one.

**Brute force.** BFS from each room outward, looking for the nearest gate — correct, but every room repeats work over the same terrain: O(rooms × cells) in the worst case.

**Optimal approach.** Seed the queue with **every gate simultaneously**, all at distance 0, then run one ordinary BFS. The wave expands in lockstep rings: first every cell at distance 1 from *some* gate, then distance 2, and so on. When the wave first touches a room, that touch is — provably — from its nearest gate: no closer gate exists, or its ring would have arrived earlier. Enqueue all gates; pop a cell; for each orthogonal neighbour that is an open room still marked infinite, write distance = mine + 1 and enqueue it. Walls never enter the queue.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, "INF", "INF", -1, "INF", 0], "note": "Seed: both gates (ends) enqueued at distance 0. Room cells start at infinity; the wall (-1) never joins the queue." },
    { "cells": [0, 1, "INF", -1, 1, 0], "highlight": [1, 4], "note": "Ring 1: the rooms adjacent to each gate get distance 1." },
    { "cells": [0, 1, 2, -1, 1, 0], "highlight": [2], "note": "Ring 2: the middle-left room reaches distance 2 (the wall blocks propagation from that side). The room right of the wall was already claimed at distance 1 from the right gate — arrival order resolved the nearest-gate competition for free." }
  ],
  "caption": "Walls and Gates — multi-source BFS: every gate broadcasts at once, and first-touch is always shortest-distance."
}
\`\`\`

**Complexity.** O(cells) time, O(cells) space — versus the per-room version's O(cells²) in the worst case.

**Thread.** Multi-source BFS with distances as rings. Rotting Oranges, next, is the same wave wearing a stopwatch — rings become *minutes*, and the question becomes "how long until the wave has touched everything it ever will?"`,
    },
    {
      slug: "rotting-oranges",
      title: "Rotting Oranges",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/rotting-fruit",
      summary: "BFS rings as time steps: rot spreads one minute per ring, and leftovers mean minus one.",
      body: `**Signal.** "Every minute, rot spreads to adjacent fresh oranges — how many minutes until none remain" — synchronized, step-wise spreading from multiple existing sources is the tell that this is Walls and Gates with the story changed: rotten oranges are the sources, and BFS depth is literally elapsed time.

**Brute force.** Simulate minute by minute with a full grid rescan each time, checking every cell for a rotten neighbour — O(cells) work per minute, and the number of minutes isn't known up front, so this restarts the scan far more than a queue-driven wave needs to.

**Optimal approach.** Multi-source seed (all initially rotten oranges at minute 0), expand ring by ring — process the queue level-by-level (snapshot its size per round, the Level Order Traversal loop from Trees) so minutes tick once per ring, not once per orange. Count the fresh oranges up front; decrement as they rot. When the wave dies out, leftover fresh count > 0 means some orange was walled off by empty cells → −1.

\`\`\`viz:array
{
  "frames": [
    { "cells": [5], "note": "Minute 0: one rotten orange seeds the queue. 5 fresh oranges remain." },
    { "cells": [3], "note": "Minute 1 (BFS ring 1): the oranges adjacent to the source rot. Fresh remaining: 3." },
    { "cells": [1], "note": "Minute 2 (ring 2): two more rot. Fresh remaining: 1." },
    { "cells": [0], "highlight": [0], "note": "Minute 3 (ring 3): the last orange rots. Fresh remaining: 0 — answer: 3 minutes." }
  ],
  "caption": "Rotting Oranges — each BFS ring is exactly one minute of simulated time; the answer is the ring number of the last cell that rotted."
}
\`\`\`

**Edge cases interviewers watch for:** zero fresh oranges at the start → answer 0 (don't count the seed round as a minute); no rotten oranges but fresh ones exist → −1 immediately.

**Complexity.** O(cells) time and space — versus the repeated-full-rescan brute force's higher constant factor per minute.

**Thread.** Two waves outward from sources. Pacific Atlantic, next, inverts the flow direction *again* — water that must reach two oceans, solved by walking uphill from the coastlines and intersecting.`,
    },
    {
      slug: "pacific-atlantic-water-flow",
      title: "Pacific Atlantic Water Flow",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/pacific-atlantic-water-flow",
      summary: "Reverse the flow: climb from each coastline, take the intersection of the two reachable sets.",
      body: `**Signal.** "Which cells can send water to *both* oceans" — a from-every-cell reachability question over a large grid is the tell to reverse it: ask what the oceans can reach by climbing, instead of what every cell can reach by descending.

**Brute force.** From each cell, search downhill for both coastlines — O(cells) work per cell, O(cells²) total, with wild re-exploration since neighbouring cells re-walk almost the same downhill paths.

**Optimal approach.** Instead of asking "which cells reach the Pacific?", ask "which cells can the Pacific reach, *climbing*?" Start from every Pacific-edge cell (multi-source again) and traverse with the rule inverted: step to a neighbour whose height is **greater than or equal to** yours — walking uphill traces exactly the paths water would have run down. The visited set of that traversal *is* the full Pacific-reachable set, computed in one sweep. Do the same from the Atlantic edges. The answer is the **intersection** of the two sets.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "r0c0", "label": "h=1 (Pacific only)", "row": 0, "col": 0 },
    { "id": "r0c1", "label": "h=2 (Pacific only)", "row": 0, "col": 1 },
    { "id": "r0c2", "label": "h=2 (Pacific only)", "row": 0, "col": 2 },
    { "id": "r1c0", "label": "h=3 (Pacific only)", "row": 1, "col": 0 },
    { "id": "r1c1", "label": "h=5 (BOTH)", "row": 1, "col": 1 },
    { "id": "r1c2", "label": "h=3 (Atlantic only)", "row": 1, "col": 2 },
    { "id": "r2c0", "label": "h=2 (Pacific only)", "row": 2, "col": 0 },
    { "id": "r2c1", "label": "h=4 (Atlantic only)", "row": 2, "col": 1 },
    { "id": "r2c2", "label": "h=1 (Atlantic only)", "row": 2, "col": 2 }
  ],
  "edges": [],
  "caption": "The Pacific climb (from top+left edges, uphill) and the Atlantic climb (from bottom+right edges, uphill) each reach most of the grid — but only the ridge cell (h=5) is reachable from both, the answer."
}
\`\`\`

**Complexity.** O(rows × cols) time and space — each traversal touches each cell at most once — versus the O(cells²) forward search.

**Thread.** Reachability *from* the border turns out to be the key to the next problem too — Surrounded Regions, where the regions that survive are exactly the ones the border can touch.`,
    },
    {
      slug: "surrounded-regions",
      title: "Surrounded Regions",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/surrounded-regions",
      summary: "Don't find the captured — find the safe: flood from the border, then flip everyone unmarked.",
      body: `**Signal.** "Capture every region of Os fully surrounded by Xs; a region touching the edge escapes" — "surrounded" is a global negative (no escape exists anywhere along the frontier), which is the tell to compute its complement instead: find what touches the border, which is a local positive reachable by one flood.

**Brute force.** For each O region, flood-fill it while checking whether any cell in the fill touches the border, then decide to flip or not — correct, but redoes border-adjacency bookkeeping per region instead of resolving it once.

**Optimal approach.** A region is captured **unless it touches the border**, so find the *survivors* instead. Survivors are precisely the Os reachable from some border O — one multi-source flood from all border Os marks every safe cell (temporarily relabel them, say to T). Then a single sweep finishes it: every O still unmarked is provably surrounded → flip to X; every T is a survivor → restore to O.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "o11", "label": "O (1,1) → flipped to X", "row": 1, "col": 1 },
    { "id": "o12", "label": "O (1,2) → flipped to X", "row": 1, "col": 2 },
    { "id": "o22", "label": "O (2,2) → flipped to X", "row": 2, "col": 2 },
    { "id": "o31", "label": "O (3,1) → border-connected, stays O", "row": 3, "col": 1 }
  ],
  "edges": [],
  "caption": "Grid XXXX/XOOX/XXOX/XOXX — the border flood only reaches (3,1); the interior Os at (1,1), (1,2), (2,2) are never marked safe, so the sweep flips all three to X."
}
\`\`\`

**Why complement-thinking wins.** When a property is hard to confirm and its complement is easy to reach, compute the complement — the second consecutive problem built on that reflex.

**Complexity.** O(rows × cols) time, O(rows × cols) worst-case stack — versus the per-region border-check brute force's redundant bookkeeping.

**Thread.** Six problems of undirected terrain. Now the edges grow arrowheads: Course Schedule — directed graphs, dependencies, and the question "does a legal order even exist?"`,
    },
    {
      slug: "course-schedule",
      title: "Course Schedule",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/course-schedule",
      summary: "Prerequisites form a directed graph — you can finish them all if and only if it has no cycle.",
      body: `**Signal.** "b must be taken before a — can every course be completed?" — a directed dependency graph where the question is "does a valid order exist" is the tell for cycle detection: the schedule is impossible exactly when some chain of prerequisites loops back on itself.

**Brute force.** Repeatedly scan for a course whose prerequisites are all already scheduled, remove it, and repeat — this is actually Kahn's algorithm in disguise (correct and reasonable!), but a naive version without in-degree bookkeeping rescans the whole prerequisite list each round: O(V·E) instead of O(V+E).

**Optimal approach.** In directed graphs, "I reached a node I have seen before" no longer implies a cycle — two prerequisite chains merging on a shared course revisit a node with no loop anywhere. Give each node one of three states: unvisited; **in progress** (its DFS has started and not finished — on the current recursion path); done (its entire subtree explored, provably cycle-free). DFS along edges: meeting a *done* node is harmless — skip. Meeting an **in-progress** node means you walked back into your own active path: a cycle. Finish a node (mark done) only after all its outgoing edges are explored. Run from every unvisited node (the graph may be disconnected).

\`\`\`viz:array
{
  "frames": [
    { "cells": ["W", "W", "W", "W"], "note": "All nodes start White (unvisited). Edges: 0→1→2→3 and 3→1." },
    { "cells": ["G", "G", "G", "G"], "highlight": [0, 1, 2, 3], "note": "DFS enters 0, then follows 0→1→2→3, marking each Gray (in-progress on the current path) as it descends." },
    { "cells": ["G", "G", "G", "G"], "highlight": [1], "note": "From node 3, follow edge 3→1 — node 1 is still Gray (in-progress, on the current path) → a back-edge into an active ancestor → CYCLE detected, return false." }
  ],
  "caption": "Course Schedule — the three-colour DFS: a Gray node revisited mid-path is proof of a cycle."
}
\`\`\`

**Complexity.** O(V + E) time and space — versus a naive round-by-round rescan's O(V·E).

**Thread.** Yes/no answered. Course Schedule II asks for the *actual order* — and the finishing sequence of this very DFS, reversed, turns out to be one.`,
    },
    {
      slug: "course-schedule-ii",
      title: "Course Schedule II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/course-schedule-ii",
      summary: "Topological sort: peel zero-prerequisite courses layer by layer, or reverse DFS finishing order.",
      body: `**Signal.** "Return an actual valid ordering of all courses" — not just yes/no but the order itself is the tell for topological sort: peeling nodes with no remaining unmet prerequisites, layer by layer.

**Brute force.** Repeatedly scan all remaining courses for one whose prerequisites are already scheduled, append it, remove it, repeat — correct, but re-scanning the full remaining set every round costs O(V²) instead of tracking in-degrees directly.

**Optimal approach (Kahn's, BFS flavour).** Track each node's **in-degree** — how many unmet prerequisites it has. Any node at in-degree zero is takeable *right now*; queue them all. Repeatedly: pop one, append it to the order, and *delete it from the graph* by decrementing every successor's in-degree; successors hitting zero join the queue. The cycle check falls out free: nodes in a cycle can never reach in-degree zero, so if the final order is shorter than n, a cycle exists → return empty. (DFS flavour: record each node at the moment it finishes in the three-colour DFS, then reverse the finish order — a node finishes only after everything it must precede is done, so finish order is reverse-topological.)

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 1, 1, 2], "pointers": [{ "label": "take", "index": 0 }], "note": "In-degrees for courses 0,1,2,3. Only course 0 starts at zero — queue it." },
    { "cells": [0, 0, 0, 2], "highlight": [1, 2], "note": "Take 0, append to order. Successors 1 and 2 drop to in-degree zero — both join the queue. Order: [0]." },
    { "cells": [0, 0, 0, 1], "pointers": [{ "label": "take", "index": 1 }], "highlight": [3], "note": "Take 1. Its only successor, course 3, drops from 2 to 1 — not yet queueable. Order: [0, 1]." },
    { "cells": [0, 0, 0, 0], "pointers": [{ "label": "take", "index": 2 }], "highlight": [3], "note": "Take 2. Course 3 drops to zero — queue it. Order: [0, 1, 2]." },
    { "cells": [0, 0, 0, 0], "pointers": [{ "label": "take", "index": 3 }], "note": "Take 3 — nothing left to decrement. Final order: [0, 1, 2, 3]." }
  ],
  "caption": "Course Schedule II — Kahn's algorithm: cells are each course's remaining in-degree, peeled to zero layer by layer."
}
\`\`\`

**Complexity.** O(V + E) time and space, both flavours — versus the naive O(V²) full-rescan approach.

**Thread.** Directed dependencies handled. The chapter now shifts to its fourth tool — union-find — with Graph Valid Tree: connectivity plus the *no-cycle* condition, checked by merging.`,
    },
    {
      slug: "graph-valid-tree",
      title: "Graph Valid Tree",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-tree",
      summary: "A tree is n−1 edges, no cycle, one component — union-find verifies all three while merging.",
      body: `**Signal.** "Do these edges form a valid tree" — connected AND acyclic is the tell for union-find: process edges one at a time, and an edge connecting two nodes already in the same component is instantly a cycle.

**Brute force.** Build an adjacency list and run DFS from any node, checking that it reaches all n nodes (connected) and never revisits a node except via its immediate parent (acyclic) — entirely valid, O(V+E), but requires building and walking a full adjacency structure for a question union-find answers with pure arithmetic.

**Optimal approach.** A tree on n nodes has *exactly* n − 1 edges — fewer can't be connected, more must contain a cycle. Check the count up front: wrong → false immediately. Right count → acyclic implies connected (and vice versa), so verify either. Union-find maintains a partition of nodes into components: **union(a, b)** merges the components containing a and b; **find(x)** names x's component root. Feed the edges through it: for each edge, if find(a) equals find(b), the two nodes are *already* connected — this edge closes a **cycle** → false. Otherwise union them.

\`\`\`viz:table-diff
{
  "columns": ["Edge", "find(a)", "find(b)", "Result"],
  "before": [["(0,1)", "0", "1", "different roots — union, merge"], ["(0,2)", "0", "2", "different roots — union, merge"], ["(0,3)", "0", "3", "different roots — union, merge"], ["(1,4)", "0", "4", "different roots — union, merge → 4 edges = n-1, VALID TREE"]],
  "after": [["(0,1)", "0", "1", "different roots — union, merge"], ["(0,2)", "0", "2", "different roots — union, merge"], ["(0,3)", "0", "3", "different roots — union, merge"], ["(1,2)", "0", "0", "SAME ROOT — cycle → NOT a tree"]],
  "caption": "n=5. Left: edges (0,1),(0,2),(0,3),(1,4) — every union merges strangers, so it's a valid tree. Right: swapping the last edge to (1,2) finds both endpoints already share root 0 — a cycle, not a tree."
}
\`\`\`

**Complexity.** O(E · α(n)) ≈ O(E) time, O(n) space — versus the DFS approach's identical asymptotics but with an adjacency list to build and maintain.

**Thread.** Union-find just detected one cycle. Connected Components, next, uses it as a *counter* — and the DFS-versus-union-find choice becomes the interview conversation itself.`,
    },
    {
      slug: "number-of-connected-components",
      title: "Number of Connected Components in an Undirected Graph",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-connected-components",
      summary: "Start at n islands and merge: every successful union is two components becoming one.",
      body: `**Signal.** "n nodes, a list of undirected edges: how many connected components" — a pure counting question over an abstract (not grid) graph is the tell to compare the chapter's two connectivity tools head-to-head: DFS flood-fill versus union-find's incremental merge count.

**Brute force.** Build an adjacency list, then run Number of Islands' scan-and-flood loop over abstract nodes instead of grid cells — entirely valid, O(V+E), the right call when the graph is given whole and you're already building adjacency for other reasons.

**Optimal approach (union-find).** Begin with the truth before any edges: n nodes, n components, everyone alone. Process each edge with a union: a union of two nodes *already sharing* a component changes nothing (the edge is redundant); a union of two strangers **fuses two components into one**. So components = n − (number of unions that actually merged). No traversal, no adjacency list, no visited set. And it is **incremental**: edges could arrive as a stream and the count stays live at every moment — a capability DFS fundamentally lacks.

\`\`\`viz:array
{
  "frames": [
    { "cells": [5], "note": "Start: 5 nodes, 5 components (everyone alone)." },
    { "cells": [4], "note": "union(0,1): strangers merge → 4 components." },
    { "cells": [3], "note": "union(1,2): strangers merge → 3 components." },
    { "cells": [2], "highlight": [0], "note": "union(3,4): strangers merge → 2 components. Final answer: 2 — {0,1,2} and {3,4}." }
  ],
  "caption": "Number of Connected Components — start at n and subtract one for every union that actually merges two strangers."
}
\`\`\`

**The comparison, which is the real content.** Static graph, need paths or structure too → DFS. Edges arriving over time, only connectivity questions → union-find, no contest.

**Complexity.** Union-find: O(E · α(n)) time, O(n) space. DFS: O(V + E) both.

**Thread.** Union-find's merge-refusal — "these two are already connected" — was a cycle alarm in Graph Valid Tree and a no-op here. Redundant Connection, next, makes it the *entire answer*: find the one edge that closes the loop.`,
    },
    {
      slug: "redundant-connection",
      title: "Redundant Connection",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/redundant-connection",
      summary: "Feed edges through union-find; the first edge joining two already-connected nodes is the culprit.",
      body: `**Signal.** "A graph that *was* a tree until exactly one extra edge was added — find it; if several candidates work, return the one appearing last" — n nodes and n edges (one too many for a tree) is the tell that union-find's cycle-detection, run in input order, finds exactly this edge with no extra bookkeeping.

**Brute force.** Remove each edge one at a time and check whether the remaining graph is a valid tree (Graph Valid Tree's check) — O(E) checks, each O(V+E), and doesn't naturally respect the "return the one appearing last" tie-break without extra care.

**Optimal approach.** One extra edge on a tree creates exactly one cycle, and the redundant edge is *an* edge of that cycle. Process the input edges in order through union-find: each edge either merges two components (tree-building proceeding normally) or arrives to find its endpoints **already connected** — meaning a path between them existed before this edge, so this edge closes the cycle. Report it. Processing in input order means the closing edge you trip over is automatically the *latest* cycle edge in the input — every earlier cycle edge merged innocently before the loop existed.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["1", "2", "3"], "note": "Edges (1,2), (1,3), (2,3). Process (1,2): different roots → union. Process (1,3): different roots → union." },
    { "cells": ["1", "2", "3"], "highlight": [1, 2], "note": "Process (2,3): find(2) and find(3) already agree (both connect through 1) — this edge closes the cycle. Answer: (2,3)." }
  ],
  "caption": "Redundant Connection — the first edge union-find refuses to merge (same root already) is the answer, and input order guarantees it's the last such edge."
}
\`\`\`

**Why union-find over DFS here.** Union-find *is* an input-order streamer by nature; the algorithm and the tie-break speak the same language, unlike a post-hoc cycle search that would need to re-derive input positions.

**Complexity.** O(E · α(n)) time, O(n) space — versus the brute force's O(E) full tree-validity checks.

**Thread.** Union-find's trilogy closes. The chapter's finale returns to BFS for its purest calling — shortest transformation paths — in a graph whose edges you must *imagine*: Word Ladder.`,
    },
    {
      slug: "word-ladder",
      title: "Word Ladder",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/word-ladder",
      summary: "Words are nodes, one-letter changes are edges — BFS the implicit graph, generating neighbours by pattern.",
      body: `**Signal.** "Return the length of the *shortest* transformation sequence" through single-letter word changes — shortest path in an unweighted graph is the tell for BFS, no deliberation needed; the real difficulty is that nobody hands you the edges.

**Brute force.** Compare every pair of words in the dictionary for a one-letter difference to build the adjacency list — O(n² · wordLength): 50k words is 2.5 billion comparisons, dead on arrival.

**Optimal approach.** From the current word, generate all wordLength × 25 single-letter mutations and keep those present in a hash set of the dictionary — O(wordLength · 26) per node, independent of dictionary size. Remove words from the set (or mark visited) *as you enqueue them*: any later path reaching the same word is necessarily no shorter, so revisits are pure waste. BFS's ring-by-ring expansion guarantees the first arrival at endWord is the shortest.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "hit", "label": "hit", "children": ["hot"] },
    { "id": "hot", "label": "hot", "children": ["dot", "lot"] },
    { "id": "dot", "label": "dot", "children": ["dog"] },
    { "id": "lot", "label": "lot", "children": ["log"] },
    { "id": "dog", "label": "dog", "children": ["cog"] },
    { "id": "log", "label": "log" },
    { "id": "cog", "label": "cog", "highlight": true }
  ],
  "rootId": "hit",
  "caption": "Word Ladder — each edge is a one-letter mutation; BFS depth of first arrival at cog is the answer (5 words)."
}
\`\`\`

**Complexity.** O(n · wordLength² · 26) time with the set — versus O(n² · wordLength) for pairwise comparison — O(n · wordLength) space. Bidirectional BFS (expand from both ends, meet in the middle) cuts the exponent in half; it is the standard follow-up.

**Thread.** Thirteen problems: flood fills, waves, orderings, mergers, imagined edges. The territory ahead adds *weights* — edges that cost — where plain BFS breaks and the named algorithms live: Dijkstra, Prim, Kruskal. Advanced Graphs is next.`,
    },
  ],
};
