import type { DsaTopic } from "../types";

/** Chapter 12 — Advanced Graphs: when edges have prices. */
export const advancedGraphs: DsaTopic = {
  slug: "advanced-graphs",
  title: "Advanced Graphs",
  chapter: 12,
  tagline: "Weights change everything — Dijkstra, Prim, Bellman-Ford, and the algorithms with names.",
  color: "#de9cff",
  prereqs: ["heap", "graphs"],
  unlocks: [],
  intro: `The Graphs chapter had a hidden simplification: every edge cost the same. That is why BFS could promise shortest paths — rings of equal price expanding evenly. Give edges *weights* — milliseconds of latency, dollars of airfare, metres of cable — and the promise shatters: two cheap hops can beat one expensive hop, so the first path to arrive is no longer the best path. This chapter is about the algorithms invented to repair that — and they have names, because each one is a landmark: **Dijkstra**, **Prim**, **Kruskal**, **Bellman-Ford**, **Hierholzer**, plus topological sort doing real modelling work.

The unifying idea is *greedy expansion guided by a priority queue*: Dijkstra for shortest path, Prim for minimum spanning tree, Bellman-Ford for hop limits and negative weights.`,
  problems: [
    {
      slug: "network-delay-time",
      title: "Network Delay Time",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/network-delay-time",
      summary: "Dijkstra, cleanly: a heap always expanding the cheapest known node — settled means final.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use standard Queue-based BFS to find signal propagation time.
*Why this shatters*: Standard BFS assumes all edges have unit weight (1). In weighted graphs, a 3-hop path of total weight $1 + 1 + 1 = 3$ is faster than a 1-hop path of weight $10$!

**The Structural Invariant: Dijkstra's Greedy Min-Heap Expansion.**
Maintain a **Min-Heap** storing \`[dist_so_far, node]\` and a distance array \`distMap\` initialized to $\\infty$.
1. Seed heap with \`[0, k]\` (distance 0 to source \`k\`). Set \`distMap[k] = 0\`.
2. While Min-Heap is not empty:
   - Pop \`[d, u]\`.
   - If $d > \\text{distMap}[u]$: **PRUNE STALE NODE** (a cheaper path to \`u\` was already processed!).
   - For each neighbor \`[v, weight]\` of \`u\`:
     - If $d + \\text{weight} < \\text{distMap}[v]$:
       - Update \`distMap[v] = d + weight\`.
       - Push \`[distMap[v], v]\` to Min-Heap.
3. Signal reaches all nodes when the **MAXIMUM distance** in \`distMap\` is found! If any node remains $\\infty$, return \`-1\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "2", "label": "2 (Source: dist=0)", "children": ["1", "3"] },
    { "id": "1", "label": "1 (dist=1)", "highlight": true },
    { "id": "3", "label": "3 (dist=1)", "children": ["4"], "highlight": true },
    { "id": "4", "label": "4 (dist=1+1=2)", "highlight": true }
  ],
  "rootId": "2",
  "caption": "Network Delay Time — Dijkstra's Min-Heap expanding shortest weighted paths."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Non-Negative Weight Guarantee*: Dijkstra's algorithm ONLY works on non-negative edge weights ($w \\ge 0$).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must Dijkstra's algorithm use a Min-Heap instead of a standard Queue for weighted graphs?",
          options: [
            "Because Min-Heaps reduce memory allocation.",
            "Because popping the minimum accumulated distance from the heap guarantees that when a node is popped, its shortest path distance is permanently finalized.",
            "Because standard Queues reverse edge directions.",
            "Because Min-Heaps sort node IDs."
          ],
          correct_index: 1,
          model_answer: "Greedy choice property: Popping the minimum accumulated distance ensures no unvisited path can reach this node with a smaller weight (assuming non-negative weights).",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Dijkstra's algorithm for V vertices and E edges using a binary Min-Heap?",
          model_answer: "O((V + E) log V) time complexity.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "reconstruct-itinerary",
      title: "Reconstruct Itinerary",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/reconstruct-flight-path",
      summary: "Use every ticket exactly once: Hierholzer's post-order walk builds the Eulerian path backwards.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners pick the lexicographically smallest available flight destination greedily at each step.
*Why this shatters*: A greedy choice can lead to a dead-end node before all tickets are used! (e.g. \`JFK -> A\` is a dead end with no outgoing tickets, while \`JFK -> B -> JFK -> A\` uses all tickets).

**The Structural Invariant: Hierholzer's Post-Order Eulerian Path Removal.**
- Build adjacency list \`adj\` where destination lists are **pre-sorted lexicographically** (Priority Queue or sorted array).
- **Hierholzer's Algorithm**:
  - Run DFS starting from \`"JFK"\`.
  - While \`adj[curr]\` has outgoing tickets:
    - Pop the smallest destination \`next = adj[curr].pop()\`.
    - Recurse \`dfs(next)\`.
  - **Post-Order Append**: After all outgoing tickets from \`curr\` are exhausted, push \`curr\` to \`result\`!
- **Final Step**: Reverse \`result\` array to get the chronological flight itinerary!

\`\`\`viz:array
{
  "frames": [
    { "cells": [], "note": "Fly JFK -> A (dead end). Push 'A' to post-order result." },
    { "cells": ["A"], "note": "Unwind to JFK. Fly JFK -> B -> JFK (exhausted). Push 'JFK'." },
    { "cells": ["A", "JFK", "B"], "note": "Push 'B'." },
    { "cells": ["A", "JFK", "B", "JFK"], "highlight": [0, 1, 2, 3], "note": "Push 'JFK'. Reverse result: [JFK, B, JFK, A] — valid Eulerian path!" }
  ],
  "caption": "Reconstruct Itinerary — Hierholzer's Eulerian Path post-order recursion."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Destructive Edge Consumption*: Deleting edges (\`pop()\`) during DFS ensures each ticket is used EXACTLY once without getting trapped in infinite cycles.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must nodes be added to the result during the post-order unwinding phase (and then reversed) in Hierholzer's algorithm?",
          options: [
            "To sort the airport codes alphabetically.",
            "Because dead-end destinations with zero remaining outgoing edges finish recursion first and must end up at the back of the final itinerary.",
            "Because DFS traverses backwards.",
            "To prevent stack overflow."
          ],
          correct_index: 1,
          model_answer: "Post-order traversal captures dead ends at the bottom of the call stack. Reversing the result places dead ends at the end of the trip, correctly consuming all sub-loops first.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What graph property defines an Eulerian Path?",
          model_answer: "An Eulerian Path is a trail in a finite graph that visits every edge exactly once.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "min-cost-to-connect-all-points",
      title: "Min Cost to Connect All Points",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/min-cost-to-connect-points",
      summary: "Minimum spanning tree by Prim: grow one component, always absorbing the cheapest crossing edge.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners connect points by linking each point to its single nearest neighbor.
*Why this shatters*: Connecting nearest neighbors independently can create disconnected cycles or invalid loops instead of a single spanning tree!

**The Structural Invariant: Prim's Minimum Spanning Tree (MST).**
A Minimum Spanning Tree connects $N$ points with $N - 1$ edges at minimum total Manhattan distance $|x_1 - x_2| + |y_1 - y_2|$.
1. Maintain \`visited = Set()\`, \`min_cost = 0\`.
2. Seed Min-Heap with \`[0, 0]\` (cost 0 to point index 0).
3. While \`visited.size < N\`:
   - Pop \`[cost, u]\`.
   - If \`visited.has(u)\`: Continue (Skip already connected point!).
   - Mark \`visited.add(u)\`. Add \`min_cost += cost\`.
   - For all unvisited points $v$:
     - \`dist = |x_u - x_v| + |y_u - y_v|\`.
     - Push \`[dist, v]\` to Min-Heap.
4. Return \`min_cost\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0], "note": "Seed Min-Heap with point 0 (dist 0). Visited: {0}." },
    { "cells": [4, 13], "highlight": [0], "note": "Cheapest edge from 0 is to point 1 (cost 4). Add point 1 to MST. Visited: {0, 1}." },
    { "cells": [9], "highlight": [0], "note": "Cheapest frontier edge from {0, 1} is to point 2 (cost 9). Add point 2. All points connected!" }
  ],
  "caption": "Min Cost to Connect All Points — Prim's MST absorbing cheapest frontier edges."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Kruskal Alternative*: Sort all $O(N^2)$ edges by weight and use Union-Find to accept edges that don't form cycles.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the key difference between Dijkstra's algorithm and Prim's algorithm?",
          options: [
            "Dijkstra's works on grids, Prim's works on trees.",
            "Dijkstra's orders the Min-Heap by cumulative path distance from source (dist[u] + w), while Prim's orders by single edge weight to the tree (w).",
            "Prim's algorithm uses BFS.",
            "Dijkstra's uses Union-Find."
          ],
          correct_index: 1,
          model_answer: "Dijkstra minimizes total accumulated distance from a single source. Prim minimizes the single edge cost to expand the connected spanning tree.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Prim's algorithm on a complete dense graph of N points using a Min-Heap?",
          model_answer: "O(N^2 log N) time, because there are O(N^2) total pairs/edges inserted into the Min-Heap.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "swim-in-rising-water",
      title: "Swim In Rising Water",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/swim-in-rising-water",
      summary: "Minimax pathfinding: Dijkstra with max-along-path instead of sum — plus two rival solutions worth knowing.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners calculate total path sum along grid routes.
*Why this shatters*: You do NOT pay the sum of elevations! You can only swim to a cell when the water level rises to equal its elevation. The cost of a path is its **MAXIMUM elevation bottleneck**.

**The Structural Invariant: Modified Dijkstra (Minimax Path Bottleneck).**
Find a path from \`(0, 0)\` to \`(N-1, N-1)\` that **minimizes the MAXIMUM elevation** encountered!
- Use a **Min-Heap** storing \`[max_elevation_so_far, r, c]\`.
- Seed heap with \`[grid[0][0], 0, 0]\`.
- Maintain \`visited\` set.
- While Min-Heap is not empty:
  - Pop \`[time, r, c]\`.
  - If \`r == N - 1 && c == N - 1\`: Return \`time\` (Reached destination at minimal bottleneck time!).
  - For each neighbor \`(nr, nc)\`:
    - If not in \`visited\`:
      - Mark \`visited.add((nr, nc))\`.
      - \`new_time = max(time, grid[nr][nc])\` (Monotone max accumulation!).
      - Push \`[new_time, nr, nc]\` to Min-Heap.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 2, 1, 3], "note": "Grid [[0,2],[1,3]]. Pop (0,0) with time=0." },
    { "cells": [0, 2, 1, 3], "pointers": [{ "label": "pop (1,0)", "index": 2 }], "highlight": [2], "note": "Neighbors: (0,1) elev 2 -> max(0,2)=2; (1,0) elev 1 -> max(0,1)=1. Pop (1,0) with time 1!" },
    { "cells": [0, 2, 1, 3], "highlight": [3], "note": "From (1,0), neighbor (1,1) elev 3 -> max(1,3)=3. Reached target (1,1) at min bottleneck time = 3!" }
  ],
  "caption": "Swim in Rising Water — Modified Dijkstra minimizing path bottleneck elevation."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Binary Search + BFS Alternative*: Binary search answer $T \\in [0, N^2 - 1]$. Run BFS flood fill considering only cells with elevation $\\le T$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does modified Dijkstra work for Swim in Rising Water when accumulating cost as max(cost, elevation) instead of cost + elevation?",
          options: [
            "Because elevations are positive integers.",
            "Because the max() function is monotonic (extending a path can never decrease its bottleneck cost), preserving Dijkstra's greedy popped-means-final invariant.",
            "Because grid graphs have no cycles.",
            "Because binary search requires Min-Heaps."
          ],
          correct_index: 1,
          model_answer: "Dijkstra requires monotonic path accumulation. Since max(time, next_elev) >= time, popped nodes are guaranteed to have their minimal bottleneck time finalized.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of the Binary Search + BFS approach for an N x N grid?",
          model_answer: "O(N^2 log(max_elevation)) time, running BFS in O(N^2) for each binary search step.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "alien-dictionary",
      title: "Alien Dictionary",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/foreign-dictionary",
      summary: "Adjacent sorted words leak one precedence edge each — assemble them and topologically sort the alphabet.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners compare every word against every other word in the input array.
*Why this shatters*: Only **adjacent words** in a sorted dictionary provide valid direct lexicographical precedence rules. Comparing non-adjacent words adds redundant or confusing edges!

**The Structural Invariant: Adjacent Word Precedence Extraction + Topological Sort.**
1. **Node Set**: Create graph nodes for every unique character in \`words\`.
2. **Extract Edges**: Compare adjacent words \`w1\` and \`w2\`:
   - Find first index $i$ where \`w1[i] != w2[i]\`.
   - Add directed edge \`w1[i] -> w2[i]\` (character \`w1[i]\` precedes \`w2[i]\`!).
   - **Break immediately** (subsequent characters do NOT provide precedence!).
   - **Prefix Invalidity Check**: If \`w1\` starts with \`w2\` but \`w1.length > w2.length\` (e.g. \`"abc"\` before \`"ab"\`), return \`""\` (Invalid order!).
3. **Topological Sort**: Run Kahn's BFS (or 3-Color DFS) on the directed graph.
4. If result length equals total unique characters, return \`result.join("")\`; else return \`""\` (Cycle detected!).

\`\`\`viz:tree
{
  "nodes": [
    { "id": "w", "label": "w", "children": ["e"] },
    { "id": "e", "label": "e", "children": ["r"] },
    { "id": "r", "label": "r", "children": ["t"] },
    { "id": "t", "label": "t", "children": ["f"] },
    { "id": "f", "label": "f", "highlight": true }
  ],
  "rootId": "w",
  "caption": "Alien Dictionary — Precedence edges extracted from adjacent words forming DAG topological order."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Single Character Words*: If input is \`["z", "z"]\`, the graph contains node \`'z'\` with in-degree 0, returning \`"z"\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What error occurs if an input contains words [\"apple\", \"app\"] in that order?",
          options: [
            "Topological sort creates a 3-node cycle.",
            "It violates standard lexicographical rules (a longer prefix cannot precede its shorter word), rendering the dictionary invalid (return \"\").",
            "It generates duplicate letter nodes.",
            "It drops the letter 'e'."
          ],
          correct_index: 1,
          model_answer: "In any valid dictionary, a prefix word ('app') must always come before a longer word ('apple'). Placing 'apple' before 'app' is invalid.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why do we stop scanning a pair of adjacent words immediately after finding their first differing character?",
          model_answer: "Lexicographical order is decided entirely by the first non-matching character. Subsequent characters after the first mismatch carry no order information.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "cheapest-flights-within-k-stops",
      title: "Cheapest Flights Within K Stops",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/cheapest-flight-path",
      summary: "A stop budget breaks 'settled means final' — Bellman-Ford relaxes all edges k+1 rounds instead.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners run standard Dijkstra's algorithm.
*Why this shatters*: **Standard Dijkstra fails under a stop constraint $K$!** A cheaper path with 5 stops might finalize a node in Dijkstra, blocking a slightly more expensive path with 1 stop that could have reached the destination within $K$ stops!

**The Structural Invariant: Bellman-Ford $K+1$ Round Edge Relaxation.**
Since we are allowed **at most $K$ stops** (which means at most $K + 1$ flight edges), we can run **Bellman-Ford for exactly $K + 1$ rounds**:
- Maintain distance array \`prices\` initialized to $\\infty$, with \`prices[src] = 0\`.
- For $i = 0$ to $K$:
  - Create a **copy of current prices** \`tempPrices = [...prices]\`.
  - For each flight \`[u, v, price]\` in flights:
    - If \`prices[u] != \\infty\`:
      - \`tempPrices[v] = min(tempPrices[v], prices[u] + price)\`.
  - \`prices = tempPrices\` (Snapshot prevents updates from chaining within the same round!).
- Return \`prices[dst] == \\infty ? -1 : prices[dst]\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, "INF", "INF"], "note": "Prices: [0:0, 1:INF, 2:INF]. K=1 stop (max 2 flights)." },
    { "cells": [0, 100, 500], "highlight": [1, 2], "note": "Round 1 (1 flight): prices[1]=100 (via 0->1), prices[2]=500 (via 0->2)." },
    { "cells": [0, 100, 200], "highlight": [2], "note": "Round 2 (2 flights): prices[2]=min(500, 100+100)=200 (via 0->1->2). Return 200!" }
  ],
  "caption": "Cheapest Flights Within K Stops — Bellman-Ford round-based relaxation."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Snapshot Array*: Copying \`tempPrices\` at the start of each round ensures Round $R$ only uses paths of length $\\le R$ edges, preventing multi-hop chaining in a single round.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must Bellman-Ford use a copy of the prices array (tempPrices) during each round of relaxation for Cheapest Flights Within K Stops?",
          options: [
            "To prevent negative prices.",
            "To ensure that each round relaxes edges using ONLY the paths established in previous rounds, preventing an edge from chaining across multiple hops in a single round.",
            "Because JavaScript arrays are passed by reference.",
            "To sort the flight routes."
          ],
          correct_index: 1,
          model_answer: "Without snapshotting, a single round could chain edge A->B and B->C, consuming 2 flights while counting it as 1 round.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of running Bellman-Ford for K + 1 rounds on E flights?",
          model_answer: "O(K * E) time complexity.",
          difficulty: "basic"
        }
      ]
    }
  ]
};
