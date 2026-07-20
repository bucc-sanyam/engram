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

The unifying idea is *greedy expansion guided by a priority queue* — which is why the roadmap requires the Heap chapter before this one. BFS used a plain queue because all frontier nodes were equally far; Dijkstra swaps in a min-heap so the frontier is expanded **cheapest known total first**, and that single substitution restores the guarantee: when a node leaves the heap, its distance is final. Prim's algorithm is the same loop with one word changed — order by *edge cost* instead of *total distance* — and it builds minimum spanning trees instead of shortest paths. Learn the two as siblings and you will never confuse them again.

The six problems each add one twist to that machinery. Network Delay Time is Dijkstra straight. Min Cost to Connect All Points is Prim straight. Swim in Rising Water bends the objective — minimise the *maximum* edge on the path, not the sum — and the heap loop absorbs the change with one line. Cheapest Flights Within K Stops breaks Dijkstra's assumption outright (a stop budget makes "settled" unsafe) and introduces Bellman-Ford's k-round relaxation as the honest tool. Alien Dictionary is topological sort doing forensic work — extracting an ordering from evidence. And Reconstruct Itinerary is the outlier gem: not shortest-anything, but *use every edge exactly once* — an Eulerian path, built by Hierholzer's beautiful post-order trick.

This chapter is a leaf on the roadmap — nothing unlocks from it, because it is a summit. What remains after it is the other great mountain: dynamic programming.`,
  problems: [
    {
      slug: "network-delay-time",
      title: "Network Delay Time",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/network-delay-time",
      summary: "Dijkstra, cleanly: a heap always expanding the cheapest known node — settled means final.",
      body: `**Signal.** "How long until *every* node has heard the signal" over directed **weighted** edges — weights breaking the "arrival order = cheapest order" promise BFS relied on is the tell for Dijkstra: expand the frontier by accumulated cost, not by hop count.

**Brute force.** Try every possible path from k to each node (or run BFS and hope hop count tracks cost) — BFS specifically fails here since a 3-hop path of weight 1+1+1 beats a 1-hop path of weight 10, so hop order and cost order have come apart.

**Optimal approach.** Keep best-known distances (infinity everywhere, 0 at the source) and a min-heap of (distance, node) candidates. Repeatedly pop the smallest: if the node is already settled, skip (a stale entry from lazy deletion); otherwise its popped distance is **final** — settle it, and *relax* each outgoing edge: if my distance + edge weight beats the neighbour's best known, update it and push the new candidate. The guarantee that popping means final: every other route into that node must pass through something still in the heap with a larger key, and weights are non-negative, so no future discovery can undercut it. That non-negativity clause is Dijkstra's entire fine print — remember it for two problems from now.

**The walk-through.** Edges k=2: 2→1 (1), 2→3 (1), 3→4 (1). Pop (0, 2) → relax 1 and 3 to distance 1. Pop (1, 1) → settled. Pop (1, 3) → relax 4 to 2. Pop (2, 4). All heard; answer = max(1, 1, 2) = 2.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "2", "label": "2 (source, dist 0)", "children": ["1", "3"] },
    { "id": "1", "label": "1 (dist 1)" },
    { "id": "3", "label": "3 (dist 1)", "children": ["4"] },
    { "id": "4", "label": "4 (dist 2)", "highlight": true }
  ],
  "rootId": "2",
  "caption": "Network Delay Time — Dijkstra's shortest-path tree from node 2; node 4 is farthest at distance 2, the signal's total delay."
}
\`\`\`

**Complexity.** O(E log V) time with the binary heap, O(V + E) space — versus a BFS that gives wrong answers the moment weights are unequal. Unreached nodes keep infinite distance → −1.

**Thread.** One loop, one guarantee. Next problem keeps the loop and changes *what accumulates* — from summed distance to a completely different objective — but first, a detour with no distances at all: Reconstruct Itinerary, where the job is to spend every edge exactly once.`,
    },
    {
      slug: "reconstruct-itinerary",
      title: "Reconstruct Itinerary",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/reconstruct-flight-path",
      summary: "Use every ticket exactly once: Hierholzer's post-order walk builds the Eulerian path backwards.",
      body: `**Signal.** "Reconstruct the journey that **uses every ticket exactly once**, lexically smallest when several exist" — exhaustive edge use, not shortest path, is the tell for an Eulerian path, and Hierholzer's post-order trick is the classic way to build one.

**Brute force.** Backtrack over every ordering of tickets, checking at the end whether all were used — always flying to the alphabetically first destination greedily can strand you (from JFK with tickets to A and B, where A is a dead end but B loops back to JFK, greedy picks A first and dies with unused tickets), so a naive greedy-with-no-recovery fails, and full backtracking without the post-order insight explodes combinatorially.

**Optimal approach (Hierholzer's).** Walk greedily from the start, *consuming* tickets (delete each edge as you fly it — the "visited" discipline applied to **edges**, not nodes), always taking the smallest available destination. When you hit a node with no remaining departures, you are stuck — but **stuck means finished-with-this-node**: every ticket into and out of it is spent, so it must come *last* among what remains. Record it in post-order — append to the route as the recursion *unwinds* — and let the backtracking resume from earlier nodes whose side-loops are still unspent. Reverse the recorded list at the end: a complete Eulerian itinerary, and because each greedy choice took the smallest branch first, it is the lexically smallest one.

\`\`\`viz:array
{
  "frames": [
    { "cells": [], "note": "Fly JFK→A greedily (A is alphabetically first). A has no departures — stuck. Post-order record: push \\"A\\"." },
    { "cells": ["A"], "note": "Back at JFK, fly the only remaining ticket JFK→B." },
    { "cells": ["A", "JFK"], "note": "At B, fly B→JFK. JFK now has no departures left — push \\"JFK\\"." },
    { "cells": ["A", "JFK", "B"], "note": "B also has no more departures — push \\"B\\"." },
    { "cells": ["A", "JFK", "B", "JFK"], "highlight": [0, 1, 2, 3], "note": "Back at the start, nothing left — push \\"JFK\\". Reverse the recorded list: JFK, B, JFK, A — the complete itinerary, using every ticket exactly once." }
  ],
  "caption": "Reconstruct Itinerary — a dead-end node is recorded in post-order; reversing the whole recording produces the itinerary, with the true dead end (A) correctly deferred to last."
}
\`\`\`

**Complexity.** O(E log E) for sorting, O(E) for the walk — each ticket consumed once — versus unbounded backtracking without the post-order insight.

**Thread.** Edges as consumables, order from post-order. Now back to weights and the Dijkstra family: Min Cost to Connect All Points swaps "reach one node cheaply" for "wire *all* nodes cheaply" — Prim's algorithm, one word away.`,
    },
    {
      slug: "min-cost-to-connect-all-points",
      title: "Min Cost to Connect All Points",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/min-cost-to-connect-points",
      summary: "Minimum spanning tree by Prim: grow one component, always absorbing the cheapest crossing edge.",
      body: `**The problem.** Points on a plane; connecting two costs their Manhattan distance (|Δx| + |Δy|). Wire every point into one connected network at minimum total cost. The answer's shape is forced before any algorithm: a **minimum spanning tree** — n − 1 edges, no cycles (a cycle's costliest edge is always deletable for free, so optimal solutions never carry one; the tree facts from Graph Valid Tree, now doing optimisation work).

**Prim's insight.** Grow the network from any seed point, one absorption at a time, and let greed be provably safe: among all edges **crossing the frontier** — one endpoint wired, one not — the cheapest one belongs to some optimal tree. (The classic *cut argument*, in one breath: any spanning tree must cross the frontier somewhere; if it crosses via a pricier edge, swapping in the cheapest crossing edge reconnects it no worse.) So: min-heap of candidate edges out of the wired set, keyed by cost. Pop the cheapest; if its far endpoint is already wired, discard (lazy deletion again); otherwise wire it, add the cost, and push that new point's edges to every unwired point. Repeat until all n are in.

**Dijkstra's sibling, precisely.** Same skeleton, one key changed: Dijkstra orders the heap by *accumulated distance from the source*; Prim orders by *single edge cost into the tree*. Total-so-far versus price-of-admission. Confusing them is the classic exam error; seeing them as one loop with two objectives is the cure.

**The walk-through.** Points (0,0), (2,2), (3,10). Seed (0,0): heap gets edges 4 and 13. Pop 4 → wire (2,2), push its edge 9 to (3,10). Pop 9 → wire (3,10). Total 13. The direct (0,0)–(3,10) edge (cost 13) dies in the heap, unneeded.

**Complexity.** Dense graph — all point pairs are edges — so O(n² log n) with the heap; an array-based Prim reaches O(n²) flat, the right tool here and worth saying. **Kruskal's** is the other MST classic: sort all edges, sweep cheapest-first, union-find rejecting cycle-closers — chapter 11's structure immediately re-employed. Either passes; knowing both is the point.

**The thread.** Sum-of-edges minimised. Swim in Rising Water keeps the heap loop but asks for the strangest objective yet: minimise the *worst single moment* of the path.`,
    },
    {
      slug: "swim-in-rising-water",
      title: "Swim In Rising Water",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/swim-in-rising-water",
      summary: "Minimax pathfinding: Dijkstra with max-along-path instead of sum — plus two rival solutions worth knowing.",
      body: `**The problem.** An n×n grid of distinct elevations. Rain floods the terrain so that at time t you can stand on any cell with elevation ≤ t and move between adjacent flooded cells. Earliest time to swim from the top-left to the bottom-right? Equivalently — and this reframe is the solution's first half — find the path whose **maximum elevation is minimised**: you must wait for the tallest cell on your route, so the best route is the one with the lowest tallest cell.

**Dijkstra, re-aimed.** The accumulation rule changes from sum to max: the cost of extending a path to a neighbour is max(cost so far, neighbour's elevation). Everything else survives — min-heap of (cost, cell), pop-means-final, relax neighbours. Why does the settled guarantee still hold? Same argument as ever: any other route to the popped cell passes through a heap entry with a larger key, and taking a max can never *shrink* a cost as a path extends (max is monotone, exactly as adding non-negative weights was). Dijkstra never needed "sum" — it needed *monotone accumulation*; this problem is the one that teaches you the real precondition.

**The walk-through.** Grid rows [0, 2] / [1, 3]. Start cost 0. Neighbours: right (max(0,2) = 2), down (max(0,1) = 1). Pop 1 → its neighbour (3) offers max(1,3) = 3. Pop 2 → offers max(2,3) = 3. Pop 3 at the goal → answer 3: you cannot avoid a 3, and you never touch anything worse.

**The rivals.** Two other full solutions, both interview gold. **Binary search + BFS:** "can I cross with waterline t?" is monotone in t — Koko's template from chapter five — so binary-search t, checking each with a flood fill: O(n² log n). **Union-find by rising water:** sort cells by elevation, add them one by one, union with flooded neighbours, stop when start and goal connect — chapter 11's incremental connectivity, verbatim. Three chapters of this atlas converging on one problem is the reason it is here.

**Complexity.** Dijkstra: O(n² log n) time, O(n²) space.

**The thread.** Objectives have flexed; next the *evidence* is indirect. Alien Dictionary hands you sorted words in an unknown alphabet and asks you to reverse-engineer the alphabet — topological sort as detective work.`,
    },
    {
      slug: "alien-dictionary",
      title: "Alien Dictionary",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/foreign-dictionary",
      summary: "Adjacent sorted words leak one precedence edge each — assemble them and topologically sort the alphabet.",
      body: `**The problem.** A list of words *sorted* according to some unknown alphabet. Recover a valid letter ordering — or report impossibility. ["wrt","wrf","er","ett","rftt"] → "wertf". The finest modelling exercise in the roadmap: no graph in sight until you build one from evidence.

**Extracting the clues.** What does "wrt before wrf" actually assert? Walk the pair from the left until the first mismatch: w=w, r=r, then t vs f — so **t precedes f** in the alien alphabet, and *that is the pair's entire information* (everything after a first mismatch is unconstrained, exactly like comparing "apple" and "apricot" in English tells you p < r and nothing about the tails). Each *adjacent* pair yields at most one directed edge; non-adjacent pairs add nothing sorted order didn't already imply. One poison case: a word followed by its own proper **prefix** — "abc" before "ab" — is flatly invalid in any alphabet (sorted order puts prefixes first); detect it during extraction and fail immediately. Miss that check and no graph algorithm will save you, because the contradiction never becomes an edge.

**Then it is chapter 11.** Nodes: every letter appearing anywhere (including letters with no constraints — they must still appear in the output; forgetting loners is the second classic bug). Edges: the extracted precedences. A valid alphabet is a **topological order** — Kahn's peeling or DFS finishing-order, your choice — and a cycle (evidence implying t < f and f < t) means no consistent alphabet: return failure via the order-shorter-than-node-count test. Multiple valid answers usually exist; any is accepted.

**The walk-through.** Pairs: wrt/wrf → t→f; wrf/er → w→e; er/ett → r→t; ett/rftt → e→r. Nodes {w,e,r,t,f}. In-degrees: w:0 → take w; e frees → e; r → t → f. "wertf."

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
  "caption": "Alien Dictionary — the four extracted precedence edges chain into one line; reading it off gives the alphabet: w, e, r, t, f."
}
\`\`\`

**Complexity.** O(total characters) to extract, O(V + E) to sort — V ≤ 26, E ≤ word pairs.

**Why interviewers adore it.** It tests the full pipeline — real-world statement → formal model → known algorithm → edge-case honesty — with almost no code. The topological sort is ten lines; the modelling is the interview.

**The thread.** One problem left, and it breaks Dijkstra on purpose: a budget on stops makes "settled means final" a lie, and Bellman-Ford's rounds step in.`,
    },
    {
      slug: "cheapest-flights-within-k-stops",
      title: "Cheapest Flights Within K Stops",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/cheapest-flight-path",
      summary: "A stop budget breaks 'settled means final' — Bellman-Ford relaxes all edges k+1 rounds instead.",
      body: `**The problem.** Flights as directed weighted edges; find the cheapest fare from src to dst using **at most k stops** (k + 1 flights). The constraint is the story: without it, this is Network Delay Time; with it, Dijkstra's core promise quietly breaks — and knowing *why* is worth more than the fix.

**How the budget breaks Dijkstra.** Settling a node assumed its cheapest-known distance could never be beaten. Under a stop budget, a *pricier* route can be strictly better **if it used fewer hops** — it has budget left that the cheap route lacks, and might reach dst where the cheap route legally cannot. States are no longer just "node"; they are "node × hops used," and plain Dijkstra collapses that distinction. (Dijkstra over the expanded state space works — mention it — but there is a cleaner classic.)

**Bellman-Ford's insight.** Relax **every edge, in rounds**. After one round, best-known costs using ≤ 1 flight are exact; after two rounds, ≤ 2 flights; after k + 1 rounds, exactly the answer the problem defines. The rounds *are* the hop budget — the constraint becomes the loop counter, no cleverness required. One implementation detail is load-bearing: each round must relax against a **frozen snapshot** of the previous round's costs (write into a copy), or improvements chain within a single round and a "round" silently spends multiple flights — the bug that passes samples and fails hidden tests.

**The walk-through.** Edges 0→1 (100), 1→2 (100), 0→2 (500); k = 1 (two flights allowed). Round 1: costs from 0 — node 1: 100, node 2: 500. Round 2 (from snapshot): node 2 improves via 1 → 200. Answer 200. With k = 0, one round only: 500 stands — the cheap chain is *illegal*, and the algorithm never sees it.

**Complexity.** O(k · E) time, O(V) space (two cost arrays). General Bellman-Ford runs V − 1 rounds and — its other superpower — tolerates *negative* edge weights and detects negative cycles (an improvement in round V is the alarm), the exact territory where Dijkstra's fine print voids the warranty.

**The thread.** Notice what those rounds really were: costs indexed by *how many flights used* — an answer built layer by layer from smaller sub-answers. That is dynamic programming, already in your hands. The next chapter gives it its name: 1-D DP.`,
    },
  ],
};
