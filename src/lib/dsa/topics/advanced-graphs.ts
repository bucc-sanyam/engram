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
      body: `**Signal.** "Wire every point into one connected network at minimum total cost" — minimum-cost full connectivity is the tell for a **minimum spanning tree**: n − 1 edges, no cycles (a cycle's costliest edge is always deletable for free, so optimal solutions never carry one — the tree facts from Graph Valid Tree, now doing optimisation work).

**Brute force.** Try every subset of n−1 edges out of the C(n,2) possible connections and check which forms a valid tree with minimum total cost — combinatorially infeasible; the real content is the greedy cut-argument that makes exhaustive search unnecessary.

**Optimal approach (Prim's).** Grow the network from any seed point, one absorption at a time: among all edges **crossing the frontier** — one endpoint wired, one not — the cheapest one belongs to some optimal tree (the *cut argument*: any spanning tree must cross the frontier somewhere; if it crosses via a pricier edge, swapping in the cheapest crossing edge reconnects it no worse). Min-heap of candidate edges out of the wired set, keyed by cost. Pop the cheapest; if its far endpoint is already wired, discard (lazy deletion); otherwise wire it, add the cost, and push that new point's edges to every unwired point. Same skeleton as Dijkstra, one key changed: Dijkstra orders by *accumulated distance from the source*; Prim orders by *single edge cost into the tree*.

\`\`\`viz:array
{
  "frames": [
    { "cells": [4, 13], "note": "Seed (0,0). Heap holds edges to unwired points: cost 4 to (2,2), cost 13 to (3,10)." },
    { "cells": [13, 9], "highlight": [1], "note": "Pop cheapest (4) → wire (2,2). Push its edge to (3,10): cost 9. Heap now holds 13 and 9." },
    { "cells": [9], "highlight": [0], "note": "Pop cheapest (9) → wire (3,10). All points wired. Total cost: 4 + 9 = 13 — the direct 13-cost edge in the heap is never needed." }
  ],
  "caption": "Min Cost to Connect All Points — Prim's algorithm: always absorb the cheapest edge crossing the frontier between wired and unwired points."
}
\`\`\`

**Complexity.** Dense graph — all point pairs are edges — so O(n² log n) with the heap; an array-based Prim reaches O(n²) flat — versus the combinatorially infeasible brute force. **Kruskal's** is the other MST classic: sort all edges, sweep cheapest-first, union-find rejecting cycle-closers — chapter 11's structure immediately re-employed.

**Thread.** Sum-of-edges minimised. Swim in Rising Water keeps the heap loop but asks for the strangest objective yet: minimise the *worst single moment* of the path.`,
    },
    {
      slug: "swim-in-rising-water",
      title: "Swim In Rising Water",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/swim-in-rising-water",
      summary: "Minimax pathfinding: Dijkstra with max-along-path instead of sum — plus two rival solutions worth knowing.",
      body: `**Signal.** "Earliest time to swim from top-left to bottom-right" where you must wait for the tallest cell on your route — minimizing the **maximum** value along a path, not the sum, is the tell that Dijkstra's accumulation rule needs to change from sum to max while keeping everything else.

**Brute force.** Try every possible path from start to goal, tracking the maximum elevation encountered on each, and keep the path with the smallest such maximum — exponentially many paths in the worst case, redoing comparisons that a monotone-accumulation Dijkstra resolves in one pass.

**Optimal approach.** Reframe: find the path whose **maximum elevation is minimised** — you must wait for the tallest cell on your route, so the best route is the one with the lowest tallest cell. The accumulation rule changes from sum to max: the cost of extending a path to a neighbour is max(cost so far, neighbour's elevation). Everything else survives — min-heap of (cost, cell), pop-means-final, relax neighbours. The settled guarantee still holds by the same argument: any other route to the popped cell passes through a heap entry with a larger key, and taking a max can never *shrink* a cost as a path extends (max is monotone, exactly as adding non-negative weights was). Dijkstra never needed "sum" — it needed *monotone accumulation*.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 2, 1, 3], "pointers": [{ "label": "start", "index": 0 }], "note": "Grid [[0,2],[1,3]] flattened. Start at (0,0)=0, cost so far 0." },
    { "cells": [0, 2, 1, 3], "pointers": [{ "label": "pop", "index": 2 }], "highlight": [2], "note": "Neighbours: right (0,1)=2 → cost max(0,2)=2; down (1,0)=1 → cost max(0,1)=1. Pop the cheaper: cell (1,0), cost 1." },
    { "cells": [0, 2, 1, 3], "pointers": [{ "label": "pop", "index": 1 }], "highlight": [1], "note": "From (1,0), neighbour (1,1)=3 offers cost max(1,3)=3. The other path via (0,1) offers max(2,3)=3 too. Pop the smaller remaining candidate first: cost 2, cell (0,1)." },
    { "cells": [0, 2, 1, 3], "highlight": [3], "note": "Finally pop cost 3 → reach goal (1,1). Answer: 3 — you cannot avoid waiting for elevation 3, and no route touches anything worse." }
  ],
  "caption": "Swim In Rising Water — Dijkstra with max-along-path instead of sum-along-path; monotone accumulation is all the settled guarantee actually needs."
}
\`\`\`

**The rivals.** Two other full solutions, both interview gold. **Binary search + BFS:** "can I cross with waterline t?" is monotone in t — Koko's template from chapter five — so binary-search t, checking each with a flood fill: O(n² log n). **Union-find by rising water:** sort cells by elevation, add them one by one, union with flooded neighbours, stop when start and goal connect — chapter 11's incremental connectivity, verbatim.

**Complexity.** Dijkstra: O(n² log n) time, O(n²) space — versus the brute force's exponential path enumeration.

**Thread.** Objectives have flexed; next the *evidence* is indirect. Alien Dictionary hands you sorted words in an unknown alphabet and asks you to reverse-engineer the alphabet — topological sort as detective work.`,
    },
    {
      slug: "alien-dictionary",
      title: "Alien Dictionary",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/foreign-dictionary",
      summary: "Adjacent sorted words leak one precedence edge each — assemble them and topologically sort the alphabet.",
      body: `**Signal.** "A list of words *sorted* according to some unknown alphabet — recover a valid letter ordering" — no graph in sight until you build one from evidence, which is the tell that this is topological sort applied after a modelling step, not a new algorithm.

**Brute force.** Try every permutation of the alphabet's letters and check whether it's consistent with the given sorted order — 26! permutations, absurdly infeasible; the real work is extracting the actual constraints instead of guessing orderings blind.

**Optimal approach.** What does "wrt before wrf" assert? Walk the pair from the left until the first mismatch: w=w, r=r, then t vs f — so **t precedes f**, and *that is the pair's entire information* (everything after a first mismatch is unconstrained). Each *adjacent* pair yields at most one directed edge. One poison case: a word followed by its own proper **prefix** — "abc" before "ab" — is flatly invalid in any alphabet; detect it during extraction and fail immediately. Then it's chapter 11: nodes are every letter appearing anywhere (including unconstrained ones — they must still appear in the output), edges are the extracted precedences, and a valid alphabet is a **topological order**. A cycle (evidence implying t < f and f < t) means no consistent alphabet exists.

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

**Complexity.** O(total characters) to extract, O(V + E) to sort — V ≤ 26, E ≤ word pairs — versus the 26!-permutation brute force.

**Why interviewers adore it.** It tests the full pipeline — real-world statement → formal model → known algorithm → edge-case honesty — with almost no code. The topological sort is ten lines; the modelling is the interview.

**Thread.** One problem left, and it breaks Dijkstra on purpose: a budget on stops makes "settled means final" a lie, and Bellman-Ford's rounds step in.`,
    },
    {
      slug: "cheapest-flights-within-k-stops",
      title: "Cheapest Flights Within K Stops",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/cheapest-flight-path",
      summary: "A stop budget breaks 'settled means final' — Bellman-Ford relaxes all edges k+1 rounds instead.",
      body: `**Signal.** "Cheapest fare using **at most k stops**" — a hop budget layered on top of a shortest-path question is the tell that Dijkstra's core promise breaks: a pricier-but-shorter-hop route can beat a cheaper-but-longer one, since only the pricier one might still have budget left to finish the trip.

**Brute force.** Enumerate every path from src to dst with at most k+1 edges (DFS/backtracking over the flight graph, bounded by depth) and keep the cheapest — correct, but can revisit the same partial routes exponentially many times with no sharing of work between them.

**Optimal approach (Bellman-Ford).** Settling a node in Dijkstra assumed its cheapest-known distance could never be beaten — but under a stop budget, a *pricier* route can be strictly better **if it used fewer hops**, since it has budget left that the cheap route lacks. States are really "node × hops used," which plain Dijkstra collapses. Relax **every edge, in rounds** instead: after one round, best-known costs using ≤ 1 flight are exact; after two rounds, ≤ 2 flights; after k + 1 rounds, exactly the answer the problem defines. The rounds *are* the hop budget. Each round must relax against a **frozen snapshot** of the previous round's costs, or improvements chain within a single round and a "round" silently spends multiple flights.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, "INF", "INF"], "note": "Edges 0→1 (100), 1→2 (100), 0→2 (500). Initial costs: node 0 = 0, everything else infinity." },
    { "cells": [0, 100, 500], "highlight": [1, 2], "note": "Round 1 (≤1 flight), relaxing all edges from the frozen snapshot: node 1 = 100 (via 0→1), node 2 = 500 (via 0→2)." },
    { "cells": [0, 100, 200], "highlight": [2], "note": "Round 2 (≤2 flights), relaxing against the round-1 snapshot: node 2 improves via node 1 (100+100=200). With k=1 (2 flights allowed), this round counts — final answer: 200." }
  ],
  "caption": "Cheapest Flights Within K Stops — Bellman-Ford's rounds ARE the hop budget: round r gives the exact cheapest cost using at most r flights."
}
\`\`\`

**Complexity.** O(k · E) time, O(V) space (two cost arrays) — versus the brute force's exponential path enumeration. General Bellman-Ford runs V − 1 rounds and — its other superpower — tolerates *negative* edge weights and detects negative cycles, the exact territory where Dijkstra's fine print voids the warranty.

**Thread.** Notice what those rounds really were: costs indexed by *how many flights used* — an answer built layer by layer from smaller sub-answers. That is dynamic programming, already in your hands. The next chapter gives it its name: 1-D DP.`,
    },
  ],
};
