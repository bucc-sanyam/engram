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

Losing hierarchy costs you two comforts trees gave for free: there is no root and there are **cycles**. The cure is the *visited set*, and the discipline of marking a node **when you first commit to it**.`,
  problems: [
    {
      slug: "number-of-islands",
      title: "Number of Islands",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-number-of-islands",
      summary: "Flood fill: every unvisited land cell you trip over is a new island — sink it whole and keep scanning.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners count every land cell \`'1'\` and subtract adjacent land cells without marking visited states.
*Why this shatters*: Un-tracked traversals re-count the same island multiple times or fail to capture complex C-shaped/L-shaped island geometries.

**The Structural Invariant: Flood Fill Sink Traversal.**
- Iterate through every cell \`(r, c)\` in grid:
  - If \`grid[r][c] == '1'\`: We discovered a **NEW island**! Increment \`island_count++\`.
  - Immediately launch **Flood Fill DFS/BFS** from \`(r, c)\`:
    - Mark \`grid[r][c] = '0'\` (Sink land to water to mark visited in-place!).
    - Recurse on all 4 cardinal neighbors \`(r+1, c), (r-1, c), (r, c+1), (r, c-1)\`.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "r0c0", "label": "1 (Discovery! island_count=1)", "row": 0, "col": 0 },
    { "id": "r0c1", "label": "1 (Sunk -> 0)", "row": 0, "col": 1 },
    { "id": "r1c0", "label": "1 (Sunk -> 0)", "row": 1, "col": 0 },
    { "id": "r1c1", "label": "1 (Sunk -> 0)", "row": 1, "col": 1 },
    { "id": "r2c2", "label": "1 (Discovery! island_count=2)", "row": 2, "col": 2 }
  ],
  "edges": [
    { "from": "r0c0", "to": "r0c1" },
    { "from": "r0c0", "to": "r1c0" },
    { "from": "r0c1", "to": "r1c1" }
  ],
  "caption": "Number of Islands — Sinking land cells ('1' -> '0') in-place during Flood Fill."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Boundary Guard*: Always check \`r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0'\` at the start of DFS.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is setting grid[r][c] = '0' during DFS flood fill an effective optimization for Number of Islands?",
          options: [
            "It converts binary strings to numbers.",
            "It marks the land cell as visited in-place, preventing it from triggering future island counts without allocating an O(M*N) visited set.",
            "It turns islands into water permanently for all test cases.",
            "It reduces total grid size."
          ],
          correct_index: 1,
          model_answer: "Mutating '1' to '0' acts as an in-place visited set, ensuring each land component is counted exactly once at initial discovery.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Number of Islands on an M x N grid?",
          model_answer: "O(M * N) time complexity, since every cell is visited at most a constant number of times.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "max-area-of-island",
      title: "Max Area of Island",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/max-area-of-island",
      summary: "The same flood fill, now counting as it sinks — traversals that measure, not just visit.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use flood fill to count islands, but try to count area using global accumulators that get corrupted during recursive branching.
*Why this shatters*: Global counter variables require tedious resets across separate island components.

**The Structural Invariant: Post-Order Cell Area Accumulation.**
Define recursive \`getArea(r, c)\`:
- **Base Case**: If out-of-bounds or \`grid[r][c] == 0\`, return \`0\`.
- **Mark Visited**: Set \`grid[r][c] = 0\`.
- **Accumulate**: Return \`1 + getArea(r+1,c) + getArea(r-1,c) + getArea(r,c+1) + getArea(r,c-1)\`.
- Track \`max_area = max(max_area, getArea(r, c))\` across all grid discovery points.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "01", "label": "(0,1): area = 1 + 1 + 1 = 3", "children": ["02", "11"], "highlight": true },
    { "id": "02", "label": "(0,2): area = 1", "highlight": true },
    { "id": "11", "label": "(1,1): area = 1", "highlight": true }
  ],
  "rootId": "01",
  "caption": "Max Area of Island — Returning 1 + sum of neighbor areas."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty Grid*: Handle 0-length grid edge cases.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the return value of getArea(r, c) when (r, c) points to a valid land cell '1'?",
          options: [
            "0",
            "1 + sum of getArea for all 4 orthogonal neighbors",
            "1 + total grid size",
            "max(left, right)"
          ],
          correct_index: 1,
          model_answer: "The area of an island rooted at (r, c) is 1 (the cell itself) plus the combined areas returned by its 4 cardinal neighbors.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "How does Max Area of Island prevent infinite recursion loops on cyclic land shapes?",
          model_answer: "By immediately setting `grid[r][c] = 0` (sinking the cell) before making recursive calls to neighboring cells.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "clone-graph",
      title: "Clone Graph",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/clone-graph",
      summary: "Deep-copy a cyclic structure: the old-to-new map is both your correspondence and your visited set.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners recursively clone neighbors without tracking visited nodes.
*Why this shatters*: Cyclic graphs (e.g. Node A $\\leftrightarrow$ Node B) cause **infinite recursion call stack overflow**!

**The Structural Invariant: Map Registration before Recursion.**
Maintain \`oldToNew = Map<OldNode, ClonedNode>()\`:
- \`clone(node)\`:
  - If \`node == null\`, return \`null\`.
  - If \`oldToNew.has(node)\`: **RETURN EXISTING CLONE** \`oldToNew.get(node)\` (Breaks cycle and links existing copy!).
  - Create copy: \`copy = new Node(node.val)\`.
  - **REGISTER IMMEDIATELY**: \`oldToNew.set(node, copy)\` (Must register BEFORE recursing into neighbors!).
  - For each \`neighbor\` in \`node.neighbors\`:
    - \`copy.neighbors.push(clone(neighbor))\`.
  - Return \`copy\`.

\`\`\`viz:table-diff
{
  "columns": ["Original Node", "Map Registration", "Action"],
  "before": [["Node 1", "Map.set(1, Clone1)", "Recurse into Neighbor 2"], ["Node 2", "Map.set(2, Clone2)", "Recurse into Neighbor 1"]],
  "after": [["Node 1 (Revisited)", "Map.has(1) == TRUE!", "Return Clone1 directly (Cycle Closed!)"]],
  "caption": "Clone Graph — Map registration prevents infinite cycle recursion."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Registration Order*: Setting \`oldToNew.set(node, copy)\` AFTER processing neighbors causes infinite loops on self-loops or bidirectional edges.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must oldToNew.set(node, copy) be executed BEFORE iterating over node.neighbors?",
          options: [
            "Because the map must be sized before any inserts.",
            "So that if a neighbor contains a cycle pointing back to 'node', the recursion discovers the existing clone in oldToNew instead of creating a duplicate infinite clone chain.",
            "To sort neighbor values.",
            "To convert graph nodes into array indices."
          ],
          correct_index: 1,
          model_answer: "Registering the clone prior to neighbor traversal ensures cycles pointing back to `node` instantly resolve to the existing clone instance.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity of Clone Graph for V vertices and E edges?",
          model_answer: "O(V + E) time (traverses each node and edge once) and O(V) space for the Map and call stack.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "walls-and-gates",
      title: "Walls and Gates",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/islands-and-treasure",
      summary: "Multi-source BFS: start the wave from every gate at once, and each cell's first touch is its true distance.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners run single-source BFS starting from each empty room cell \`INF\` to find the nearest gate \`0\`.
*Why this shatters*: Running $O(M \cdot N)$ searches for $M \times N$ rooms takes $O((M \cdot N)^2)$ time (quadratic TLE!).

**The Structural Invariant: Multi-Source Simultaneous BFS.**
Invert the direction! Start BFS from **ALL GATES SIMULTANEOUSLY**:
1. Scan grid: Push all Gate coordinates \`(r, c)\` with value \`0\` into a Queue.
2. Run standard Queue BFS:
   - Pop \`(r, c)\`.
   - For each valid orthogonal neighbor \`(nr, nc)\`:
     - If \`grid[nr][nc] == INF\` (unvisited room):
       - Update \`grid[nr][nc] = grid[r][c] + 1\`.
       - Push \`(nr, nc)\` to Queue.
- **Proof of Correctness**: In unweighted BFS, the **first time** a room is reached by the expanding multi-source frontier, its assigned distance is mathematically guaranteed to be the **shortest distance** to ANY gate!

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, "INF", "INF", -1, "INF", 0], "note": "Queue initialized with ALL Gates at dist 0: idx 0 and idx 5." },
    { "cells": [0, 1, "INF", -1, 1, 0], "highlight": [1, 4], "note": "Level 1: Rooms adjacent to gates updated to dist 1." },
    { "cells": [0, 1, 2, -1, 1, 0], "highlight": [2], "note": "Level 2: Final empty room updated to dist 2. Multi-source BFS complete in O(M*N) time!" }
  ],
  "caption": "Walls and Gates — Multi-Source BFS spreading shortest distance rings."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Sentinel Values*: Obstacles are \`-1\`, Gates are \`0\`, Empty Rooms are \`2147483647\` (\`INF\`).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is Multi-Source BFS from all gates (0s) simultaneously faster than single-source BFS from each empty room (INF)?",
          options: [
            "Because Multi-Source BFS runs in parallel threads.",
            "Because Multi-Source BFS visits each grid cell at most once in O(M*N) time, whereas per-room BFS re-traverses grid cells up to O((M*N)^2) times.",
            "Because gates sort the grid.",
            "Because empty rooms contain negative values."
          ],
          correct_index: 1,
          model_answer: "Multi-Source BFS expands distance frontiers simultaneously from all gates, ensuring every room is visited once at its minimal distance in O(M*N) time.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why is the first distance value assigned to an INF room during multi-source BFS guaranteed to be optimal?",
          model_answer: "BFS explores level-by-level (equidistant rings). The first wave to touch a room originates from the closest gate.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "rotting-oranges",
      title: "Rotting Oranges",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/rotting-fruit",
      summary: "BFS rings as time steps: rot spreads one minute per ring, and leftovers mean minus one.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners simulate rot minute-by-minute using nested grid loops.
*Why this shatters*: Full grid scans per minute waste operations scanning already-rotten or empty cells.

**The Structural Invariant: Level-Order Queue Snapshotting for Time Ticks.**
- Count initial \`fresh_count\`. Push all initial rotten oranges \`'2'\` into Queue.
- Track \`minutes = 0\`.
- While Queue is not empty and \`fresh_count > 0\`:
  - \`level_size = queue.length\`.
  - For $i = 0$ to \`level_size - 1\`:
    - Pop rotten orange \`(r, c)\`.
    - For each fresh neighbor \`(nr, nc)\` with value \`1\`:
      - Turn rotten: \`grid[nr][nc] = 2\`.
      - Decrement \`fresh_count--\`.
      - Push \`(nr, nc)\` to Queue.
  - Increment \`minutes++\`.
- Return \`fresh_count == 0 ? minutes : -1\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 1, 1], "note": "Min 0: Queue=[(0,0)], fresh_count=2." },
    { "cells": [2, 2, 1], "highlight": [1], "note": "Min 1: Queue=[(0,1)], fresh_count=1. Minutes=1." },
    { "cells": [2, 2, 2], "highlight": [2], "note": "Min 2: Queue=[(0,2)], fresh_count=0. All rotten in 2 minutes!" }
  ],
  "caption": "Rotting Oranges — Multi-Source BFS level-order time step simulation."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Zero Fresh Oranges Initially*: If \`fresh_count == 0\` at start, return \`0\` immediately.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What condition indicates that it is impossible for all oranges to rot in Rotting Oranges?",
          options: [
            "If minutes exceeds 100.",
            "If fresh_count > 0 after the BFS queue becomes empty (indicating isolated fresh oranges surrounded by empty spaces).",
            "If initial rotten count is 0.",
            "If the grid is square."
          ],
          correct_index: 1,
          model_answer: "If fresh_count remains > 0 after BFS terminates, isolated fresh oranges exist that can never be reached by rotting waves, returning -1.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "Why do we check `fresh_count > 0` before incrementing minutes at the end of a BFS level?",
          model_answer: "To prevent adding an extra minute increment when the last queue level processes already-rotten oranges without rotting any new fresh oranges.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "pacific-atlantic-water-flow",
      title: "Pacific Atlantic Water Flow",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/pacific-atlantic-water-flow",
      summary: "Reverse the flow: climb from each coastline, take the intersection of the two reachable sets.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners run DFS starting from every individual grid cell \`(r, c)\` down to the ocean borders.
*Why this shatters*: Water flows downhill. Running DFS from every cell causes redundant path traversals ($O((M \cdot N)^2)$ time).

**The Structural Invariant: Reverse Flow (Uphill Climb from Coastlines).**
Invert the problem! Instead of flowing downhill from cell to ocean, **climb UPHILL from ocean borders into the island**:
1. \`pacificReachable\`: Set of cells reachable by climbing UPHILL from Top and Left borders.
2. \`atlanticReachable\`: Set of cells reachable by climbing UPHILL from Bottom and Right borders.
3. **Uphill Rule**: Move from \`(r, c)\` to neighbor \`(nr, nc)\` ONLY IF \`heights[nr][nc] >= heights[r][c]\`.
4. **Intersection**: Result = Cells present in BOTH \`pacificReachable\` AND \`atlanticReachable\`!

\`\`\`viz:flow
{
  "nodes": [
    { "id": "p", "label": "Pacific Coast (Top/Left)", "row": 0, "col": 0 },
    { "id": "cell", "label": "Height 5 (Reachable by BOTH climbs!)", "row": 1, "col": 1 },
    { "id": "a", "label": "Atlantic Coast (Bottom/Right)", "row": 2, "col": 2 }
  ],
  "edges": [
    { "from": "p", "to": "cell" },
    { "from": "a", "to": "cell" }
  ],
  "caption": "Pacific Atlantic Water Flow — Uphill traversal from ocean borders to intersection cells."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Equal Heights*: Water can flow between cells of EQUAL height (\`heights[nr][nc] >= heights[r][c]\`).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is climbing UPHILL from ocean borders more efficient than running downhill DFS from every grid cell?",
          options: [
            "Because climbing uphill uses less memory.",
            "Because running two sweeps from the borders populates Pacific and Atlantic reachable sets in O(M*N) time, avoiding quadratic redundant cell checks.",
            "Because downhill paths are non-linear.",
            "Because oceans are static."
          ],
          correct_index: 1,
          model_answer: "Reversing the flow reduces the problem to 2 border-initiated traversals. Taking the set intersection of reachable cells yields the solution in O(M*N) time.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What grid condition allows water to flow between neighboring cells?",
          model_answer: "Water flows downhill or across flat terrain, meaning neighbor height must be less than or equal to current cell height (`heights[neighbor] <= heights[current]`).",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "surrounded-regions",
      title: "Surrounded Regions",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/surrounded-regions",
      summary: "Don't find the captured — find the safe: flood from the border, then flip everyone unmarked.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to find 'O' cells surrounded by 'X' from the inside out, flipping them and trying to undo flips if a border is reached.
*Why this shatters*: Undoing invalid flips creates messy state management.

**The Structural Invariant: Border Protection (Complement Search).**
An 'O' region is captured UNLESS it is connected to an 'O' on the border!
1. **Find Un-capturable 'O's**: Run DFS/BFS from all **border 'O' cells** (top, bottom, left, right edges).
2. Mark all reachable border-connected 'O's as temporary **\`'T'\`** (Safe from capture!).
3. **Final Grid Sweep**:
   - If cell is \`'O'\` $\rightarrow$ Change to \`'X'\` (Captured!).
   - If cell is \`'T'\` $\rightarrow$ Change back to \`'O'\` (Rescued!).

\`\`\`viz:flow
{
  "nodes": [
    { "id": "border", "label": "Border O at (3,1) -> Marked 'T' (Safe)", "row": 3, "col": 1 },
    { "id": "inner1", "label": "Inner O at (1,1) -> Flipped to 'X'", "row": 1, "col": 1 },
    { "id": "inner2", "label": "Inner O at (1,2) -> Flipped to 'X'", "row": 1, "col": 2 }
  ],
  "edges": [],
  "caption": "Surrounded Regions — Border-connected 'O's marked 'T' first; remaining 'O's flipped to 'X'."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Edge Sweep Loop*: Iterate rows 0 and $M-1$ for all cols; cols 0 and $N-1$ for all rows to seed border DFS.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What distinguishes an 'O' cell that should be flipped to 'X' from an 'O' cell that should remain 'O'?",
          options: [
            "Whether the cell value is odd or even.",
            "If the 'O' cell is part of a region connected to any border 'O' cell, it escapes capture; otherwise it is captured.",
            "Whether it is in an even row.",
            "If it has 4 neighbors."
          ],
          correct_index: 1,
          model_answer: "Any 'O' region touching the grid boundary cannot be completely surrounded by 'X's, allowing it to escape capture.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Surrounded Regions?",
          model_answer: "O(M * N) time, as each cell is visited a constant number of times during border DFS and the final matrix transformation pass.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "course-schedule",
      title: "Course Schedule",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/course-schedule",
      summary: "Prerequisites form a directed graph — you can finish them all if and only if it has no cycle.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners think checking if a graph contains a cycle is the same as detecting undirected cycles.
*Why this shatters*: In a Directed Graph, visiting an already-visited node is NOT a cycle if that node was finished on a DIFFERENT path (e.g. $A \rightarrow B \rightarrow C$ and $A \rightarrow C$ is a DAG, not a cycle!).

**The Structural Invariant: Three-Color Directed Cycle DFS.**
Maintain a state array \`state[i]\`:
- **0 = Unvisited** (White).
- **1 = Visiting / In-Progress** (Gray - on CURRENT recursion call stack!).
- **2 = Visited / Completed** (Black - fully processed and cycle-free).
- **Cycle Rule**: If DFS visits a neighbor with \`state[neighbor] == 1\` (Gray), we hit an ancestor on our active recursion stack $\rightarrow$ **CYCLE DETECTED! Return \`false\`**.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["W", "W", "W"], "note": "Edges: 0->1, 1->2, 2->0. States: 0=Unvisited." },
    { "cells": ["G", "G", "G"], "pointers": [{ "label": "stack", "index": 2 }], "note": "DFS path: 0 (Gray) -> 1 (Gray) -> 2 (Gray)." },
    { "cells": ["G", "G", "G"], "highlight": [0], "note": "From node 2, neighbor is 0 (State=1/Gray!). Re-visited active stack ancestor -> CYCLE DETECTED! Return false." }
  ],
  "caption": "Course Schedule — Three-Color DFS cycle detection in directed graphs."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Disconnected Components*: Run cycle check loop for ALL nodes $0 \dots N-1$ to handle disconnected sub-graphs!`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Directed Graph cycle detection using 3-Color DFS, what condition signals a cycle?",
          options: [
            "Visiting a node with state == 0 (Unvisited).",
            "Visiting a node with state == 1 (Visiting / Currently on active recursion stack).",
            "Visiting a node with state == 2 (Completed).",
            "Reaching a node with in-degree 0."
          ],
          correct_index: 1,
          model_answer: "State 1 (Gray) represents nodes currently being explored on the active call stack. Encountering a Gray neighbor indicates a directed loop back to an ancestor.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "How can Course Schedule be solved using Kahn's Algorithm (BFS)?",
          model_answer: "Calculate in-degrees for all nodes. Push nodes with in-degree 0 into a Queue. Dequeue, decrement neighbor in-degrees, and count processed nodes. If count == N, no cycle exists.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "course-schedule-ii",
      title: "Course Schedule II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/course-schedule-ii",
      summary: "Topological sort: peel zero-prerequisite courses layer by layer, or reverse DFS finishing order.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to sort courses by their node IDs or degree counts statically.
*Why this shatters*: Prerequisites enforce a strict topological dependency order.

**The Structural Invariant: Kahn's BFS Topological Sort.**
1. Build adjacency list \`adj\` and \`inDegree[]\` array for all $N$ courses.
2. Initialize Queue with all courses having \`inDegree[i] == 0\` (courses with NO prerequisites!).
3. \`result = []\`.
4. While Queue is not empty:
   - Pop course \`curr\`. Push \`curr\` to \`result\`.
   - For each \`neighbor\` in \`adj[curr]\`:
     - Decrement \`inDegree[neighbor]--\`.
     - If \`inDegree[neighbor] == 0\`: Push \`neighbor\` to Queue!
5. **Cycle Validation**: If \`result.length == N\`, return \`result\`; else return \`[]\` (Cycle exists!).

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 1, 1, 2], "note": "In-degrees: [0:0, 1:1, 2:1, 3:2]. Course 0 has inDegree 0 -> Queue=[0]." },
    { "cells": [0, 0, 0, 2], "highlight": [1, 2], "note": "Pop 0 -> Result=[0]. Decrement 1 & 2 in-degrees to 0 -> Queue=[1, 2]." },
    { "cells": [0, 0, 0, 0], "highlight": [3], "note": "Pop 1 & 2 -> Decrement 3 in-degree to 0 -> Queue=[3]. Final Result=[0, 1, 2, 3]." }
  ],
  "caption": "Course Schedule II — Kahn's Topological Sort peeling zero in-degree nodes."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Cycle Output*: Return an empty array \`[]\` if a cycle prevents processing all $N$ courses.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does an in-degree of 0 signify for a node in Kahn's Topological Sort algorithm?",
          options: [
            "The node has no outgoing edges.",
            "The node has no remaining unmet prerequisites and can be scheduled immediately.",
            "The node is part of a cycle.",
            "The node is disconnected."
          ],
          correct_index: 1,
          model_answer: "In-degree represents incoming prerequisite edges. An in-degree of 0 means all prerequisites for that course have been satisfied.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Topological Sort on a graph with V vertices and E edges?",
          model_answer: "O(V + E) time, as every vertex and edge is processed once.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "graph-valid-tree",
      title: "Graph Valid Tree",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-tree",
      summary: "A tree is n−1 edges, no cycle, one component — union-find verifies all three while merging.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners think a graph is a tree if it has no cycles.
*Why this shatters*: A graph with 2 disconnected components and no cycles is a **forest**, NOT a single valid tree!

**The Structural Invariant: Tree Definition Axiom (Edges == N - 1 & Fully Connected).**
A graph of $N$ nodes is a **Valid Tree** if and ONLY if:
1. Total edges equals **EXACTLY $N - 1$** (\`edges.length == n - 1\`).
2. The graph contains **NO CYCLES** and is **FULLY CONNECTED**.
- **Union-Find Verification**:
  - Initialize Union-Find with $N$ components.
  - If \`edges.length != n - 1\`, return \`false\` immediately!
  - For each edge \`(u, v)\`:
    - If \`find(u) == find(v)\`: Nodes are already connected $\rightarrow$ **CYCLE DETECTED**! Return \`false\`.
    - \`union(u, v)\`.
  - Return \`true\`.

\`\`\`viz:table-diff
{
  "columns": ["Edges Count", "Union-Find Cycle Check", "Result"],
  "before": [["4 edges for 5 nodes (N-1)", "All unions connect distinct components", "VALID TREE"]],
  "after": [["4 edges for 5 nodes (N-1)", "Edge (1,2) finds find(1)==find(2)", "CYCLE DETECTED -> INVALID TREE"]],
  "caption": "Graph Valid Tree — Union-Find verifying acyclic connectivity with N-1 edges."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *N-1 Edge Pruning*: Checking \`edges.length == n - 1\` up-front eliminates invalid graphs in $O(1)$ time!`,
      questions: [
        {
          kind: "mcq",
          prompt: "What two conditions must hold simultaneously for an undirected graph of N nodes to be a valid tree?",
          options: [
            "It must have N edges and be directed.",
            "It must have exactly N - 1 edges and be fully connected with no cycles.",
            "It must have 0 edges.",
            "All nodes must have degree 2."
          ],
          correct_index: 1,
          model_answer: "A valid tree of N nodes strictly requires N-1 edges without any cycles, ensuring full connectivity across all nodes.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "How does Union-Find detect a cycle while processing undirected edges?",
          model_answer: "If `find(u) == find(v)` before merging edge (u, v), u and v are already connected via another path, proving this edge creates a cycle.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "number-of-connected-components",
      title: "Number of Connected Components in an Undirected Graph",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-connected-components",
      summary: "Start at n islands and merge: every successful union is two components becoming one.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners build an adjacency list and run DFS traversals ($O(V + E)$), allocating extra memory for adjacency maps.
*Why this shatters*: While DFS works, **Union-Find handles dynamic component counting in $O(1)$ extra graph setup time**!

**The Structural Invariant: Union-Find Decrementing Counter.**
- Initialize \`count = n\`.
- Each node starts as its own root parent \`parent[i] = i\`.
- For each edge \`(u, v)\`:
  - \`rootU = find(u)\`, \`rootV = find(v)\`.
  - If \`rootU != rootV\`:
    - Merge \`parent[rootU] = rootV\`.
    - **Decrement \`count--\`** (Merging two distinct components reduces overall component count by 1!).
- Return \`count\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [5], "note": "Initial: 5 nodes, count = 5." },
    { "cells": [4], "note": "union(0, 1): Distinct roots -> Merge! count = 4." },
    { "cells": [3], "note": "union(1, 2): Distinct roots -> Merge! count = 3." },
    { "cells": [2], "highlight": [0], "note": "union(3, 4): Distinct roots -> Merge! Final Connected Components = 2." }
  ],
  "caption": "Number of Connected Components — Union-Find decrementing component count."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Path Compression*: Implement \`find(i)\` with path compression (\`parent[i] = find(parent[i])\`) for near-constant $O(\\alpha(N))$ operations!`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does Union-Find update the component count when processing an edge between nodes u and v?",
          options: [
            "It increments count by 1.",
            "If u and v belong to different root components, union merges them and decrements count by 1.",
            "It resets count to N.",
            "It multiplies count by 2."
          ],
          correct_index: 1,
          model_answer: "Merging two previously disconnected sub-graphs unites them into a single component, reducing the total component count by 1.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is path compression in Union-Find and what complexity does it achieve?",
          model_answer: "Path compression flattens the tree structure during find() by pointing visited nodes directly to the root. It achieves near-constant O(alpha(N)) amortized time per operation.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "redundant-connection",
      title: "Redundant Connection",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/redundant-connection",
      summary: "Feed edges through union-find; the first edge joining two already-connected nodes is the culprit.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use DFS to find all cycles in the graph and try to figure out which edge appeared last.
*Why this shatters*: Complex cycle-finding DFS is error-prone.

**The Structural Invariant: First Refused Union Edge.**
We are given a graph that started as a tree of $N$ nodes, but has **1 extra edge** creating a cycle.
- Process edges in the **EXACT order given in the input**:
  - For each edge \`[u, v]\`:
    - \`rootU = find(u)\`
    - \`rootV = find(v)\`
    - If \`rootU == rootV\`: **THIS IS THE REDUNDANT EDGE!** (Because \`u\` and \`v\` were already connected via earlier edges, adding this edge completes the cycle!).
    - Return \`[u, v]\` immediately.
    - Otherwise \`union(u, v)\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["(1,2)", "(1,3)"], "note": "Edges (1,2) and (1,3): Distinct roots -> Union merged." },
    { "cells": ["(2,3)"], "highlight": [0], "note": "Edge (2,3): find(2)==1 and find(3)==1. SAME ROOT! Return [2,3] as redundant edge!" }
  ],
  "caption": "Redundant Connection — Union-Find identifies cycle-closing edge in input order."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Input Order Tie-Break*: Because edges are evaluated sequentially, the first edge where \`find(u) == find(v)\` is automatically guaranteed to be the redundant edge specified by the problem.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does evaluating edges sequentially with Union-Find automatically return the correct redundant edge?",
          options: [
            "Because Union-Find sorts edges by weight.",
            "Because the first edge where endpoints u and v already share a root is the exact edge that completes the cycle in input order.",
            "Because trees cannot contain node 1.",
            "Because edges are processed backwards."
          ],
          correct_index: 1,
          model_answer: "The graph is a tree + 1 extra edge. The first edge whose endpoints are already connected in Union-Find is the edge closing the cycle.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Redundant Connection using Union-Find with Path Compression?",
          model_answer: "O(N * alpha(N)) time, which is effectively O(N) linear time for all practical values of N.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "word-ladder",
      title: "Word Ladder",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/word-ladder",
      summary: "Words are nodes, one-letter changes are edges — BFS the implicit graph, generating neighbours by pattern.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners build an adjacency list by comparing every pair of words in the dictionary ($O(N^2 \cdot L)$ time).
*Why this shatters*: For $N = 5,000$ words, comparing all pairs takes tens of millions of operations up front!

**The Structural Invariant: On-The-Fly Pattern Neighbor Generation BFS.**
- Model words as nodes in an unweighted graph where edges connect words differing by **1 character**.
- **Shortest Path = BFS Queue**:
  - Initialize \`queue = [beginWord]\`, \`visited = Set([beginWord])\`, \`changes = 1\`.
  - Level-Order Queue Snapshot loop:
    - For each word \`curr\` in current level:
      - If \`curr == endWord\`, return \`changes\`!
      - **Generate Neighbors On-The-Fly**:
        - For each character index $i$ in \`curr\`:
          - Try replacing \`curr[i]\` with all 26 letters \`'a' ... 'z'\`.
          - If transformed word exists in \`wordListSet\` and NOT in \`visited\`:
            - Add to \`visited\`, Push to \`queue\`.
    - Increment \`changes++\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "hit", "label": "hit (Level 1)", "children": ["hot"] },
    { "id": "hot", "label": "hot (Level 2)", "children": ["dot", "lot"] },
    { "id": "dot", "label": "dot (Level 3)", "children": ["dog"] },
    { "id": "lot", "label": "lot (Level 3)" },
    { "id": "dog", "label": "dog (Level 4)", "children": ["cog"] },
    { "id": "cog", "label": "cog (Level 5: MATCH! Return 5)", "highlight": true }
  ],
  "rootId": "hit",
  "caption": "Word Ladder — Shortest transformation path using BFS."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Fast Lookup*: Convert \`wordList\` array into a \`Set\` up front for $O(1)$ word existence checks.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must Breadth-First Search (BFS) be used instead of Depth-First Search (DFS) for Word Ladder?",
          options: [
            "Because DFS uses more memory.",
            "Because BFS explores shortest paths level-by-level in unweighted graphs, guaranteeing the first time endWord is reached yields the minimal transformation sequence.",
            "Because words cannot be traversed with DFS.",
            "Because word lengths are variable."
          ],
          correct_index: 1,
          model_answer: "Unweighted graph shortest path problems require BFS. DFS can explore long deep paths before finding endWord, missing the shortest path.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity per word to generate all single-character mutations during BFS?",
          model_answer: "O(L * 26) = O(L) time, where L is the length of the word, by trying all 26 English letters at each of the L character positions.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
