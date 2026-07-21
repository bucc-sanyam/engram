import type { DsaTopic } from "../types";

/** Chapter 15 — Greedy: one provable choice at a time. */
export const greedy: DsaTopic = {
  slug: "greedy",
  title: "Greedy",
  chapter: 15,
  tagline: "Commit to the locally best move and never look back — legal only when you can say why.",
  color: "#ff9e9e",
  prereqs: ["heap"],
  unlocks: [],
  intro: `Dynamic programming wins by *keeping every option alive* until the table settles. Greedy is the opposite bet: at each step, make one choice — the locally best one — commit forever, and throw the alternatives away. When it is valid, nothing beats it: no table, no recursion, usually one pass and O(1) space. When it is invalid, it fails silently on inputs you didn't try. That makes this chapter less about algorithms than about **arguments** — a greedy solution is only as good as the sentence that justifies it.

Two proof-shapes carry almost every greedy argument, and you have already used both. The **exchange argument**: take any optimal solution that disagrees with the greedy choice, swap in the greedy choice, and show the result got no worse — so a greedy-agreeing optimum exists (this justified always-move-the-shorter-wall in Container With Most Water, and Prim's cheapest-crossing-edge). And **dominance**: show the greedy's state is *at least as good* in every respect, so anything the alternative could achieve, the greedy's position can too — "my reach is further; any square you can jump to, I can as well." When you cannot construct either argument, treat greed as a hypothesis, hunt a counterexample, and fall back to DP: Coin Change already showed you a greedy that feels right and is wrong.

The eight problems are a tour of what commitment looks like. Maximum Subarray is Kadane's algorithm — one running decision, drop-the-past-or-carry-it, and the bridge from DP to greedy (it *is* a collapsed DP). The Jump Game pair moves from feasibility (track the furthest reach) to optimality (expand in reach-layers — BFS thinking without a queue). Gas Station adds the elegant restart argument: when you stall, no start inside the failed stretch could have survived either. Hand of Straights greedily anchors runs at the smallest card (with a heap or sorted map — the prerequisite chapter earning its keep). Merge Triplets inverts greed into *filtering* — discard anything poisoned, keep the harmless. Partition Labels grows a window to the last occurrence of everything inside it. And Valid Parenthesis String closes with the chapter's cleverest trick: tracking a whole *range* of possible open-bracket counts, greedily collapsing uncertainty to two numbers.

On the roadmap Greedy hangs off Heap and is a leaf — a finishing school for judgment more than a toolbox.`,
  problems: [
    {
      slug: "maximum-subarray",
      title: "Maximum Subarray",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/maximum-subarray",
      summary: "Kadane's algorithm: a negative running sum helps nobody — drop it and start fresh.",
      body: `**Signal.** "Find the contiguous subarray with the largest sum" — a running value where carrying negative history can only hurt is the tell for Kadane's algorithm: the cleanest bridge between the DP chapter you left and the greedy mindset you're entering.

**Brute force.** Check every contiguous subarray's sum — O(n²) with a running sum per start, or O(n³) recomputing sums from scratch — redoing overlapping work the running-value trick avoids entirely.

**Optimal approach.** Walk the array carrying one value: the best sum of a subarray **ending exactly here**. At each element x, the choice is binary — extend the previous run (best + x) or abandon it and start fresh at x. Extend only if the previous run is *worth carrying*, i.e. if best is positive; a negative prefix is dead weight, since any future subarray does strictly better without it. Track the global maximum of the running value as you go. The greedy sentence justifying it is an exchange argument in miniature: *any optimal subarray that includes a negative prefix can drop that prefix and improve — so some optimum starts fresh exactly where the greedy does.*

\`\`\`viz:array
{
  "frames": [
    { "cells": [-2, 1, -3, 4, -1, 2, 1, -5, 4], "pointers": [{ "label": "i", "index": 0 }], "highlight": [0], "note": "i=0: running sum = -2. Global max = -2 (nothing better yet)." },
    { "cells": [-2, 1, -3, 4, -1, 2, 1, -5, 4], "pointers": [{ "label": "i", "index": 1 }], "highlight": [1], "note": "i=1: the previous run was negative — drop it, start fresh at 1. Running sum = 1. Global max = 1." },
    { "cells": [-2, 1, -3, 4, -1, 2, 1, -5, 4], "pointers": [{ "label": "i", "index": 3 }], "highlight": [3], "note": "i=2 extended to -2 (negative again), so i=3 drops it and starts fresh at 4. Running sum = 4. Global max = 4." },
    { "cells": [-2, 1, -3, 4, -1, 2, 1, -5, 4], "pointers": [{ "label": "i", "index": 6 }], "highlight": [3, 4, 5, 6], "note": "i=4,5,6 all extend the run (each addition helps) — running sum climbs to 6. New global max = 6, subarray [4,-1,2,1]." },
    { "cells": [-2, 1, -3, 4, -1, 2, 1, -5, 4], "pointers": [{ "label": "i", "index": 8 }], "highlight": [3, 4, 5, 6], "note": "i=7 (-5) drags the run down to 1; i=8 rebuilds it to 5 — neither beats 6. Final answer: 6." }
  ],
  "caption": "Maximum Subarray — Kadane's rule: carry the run while it helps, drop it the instant it hurts."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — versus O(n²) checking every subarray. (Divide-and-conquer solves it in O(n log n) — worth one sentence as the "clever but beaten" alternative.)

**Thread.** One carried value, one drop rule. Jump Game, next, carries a different single value — the furthest reachable index — and feasibility falls out of a one-pass maximum.`,
    },
    {
      slug: "jump-game",
      title: "Jump Game",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/jump-game",
      summary: "Track the furthest reachable index; if the sweep ever outruns it, you are stranded.",
      body: `**Signal.** "Each cell holds a maximum jump length — can you reach the last index" — a reachability question where only the furthest attainable point matters, not which specific jumps got you there, is the tell for tracking one running frontier instead of enumerating paths.

**Brute force.** DP over "can I stand here": dp[i] = true if some earlier reachable j can jump to i — O(n²), checking every earlier index for every position.

**Optimal approach.** Sweep left to right carrying one number: **reach**, the furthest index attainable so far. At each index i: if i > reach, you're standing somewhere unreachable — the sweep has outrun every possible route, return false. Otherwise this cell is live, and standing on it extends possibility: reach = max(reach, i + nums[i]). Reach the end of the sweep → true. The greedy justification is a dominance argument: *the furthest-reachable frontier dominates every individual path — any index some route can reach is ≤ reach — so tracking the maximum loses nothing.*

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 2, 1, 0, 4], "pointers": [{ "label": "i", "index": 0 }], "highlight": [0, 1, 2, 3], "note": "i=0: reach = max(0, 0+3) = 3. Cells 0..3 are reachable so far." },
    { "cells": [3, 2, 1, 0, 4], "pointers": [{ "label": "i", "index": 1 }], "highlight": [0, 1, 2, 3], "note": "i=1 <= reach(3): live. reach = max(3, 1+2) = 3 — no improvement." },
    { "cells": [3, 2, 1, 0, 4], "pointers": [{ "label": "i", "index": 2 }], "highlight": [0, 1, 2, 3], "note": "i=2 <= reach(3): live. reach = max(3, 2+1) = 3 — no improvement." },
    { "cells": [3, 2, 1, 0, 4], "pointers": [{ "label": "i", "index": 3 }], "highlight": [0, 1, 2, 3], "note": "i=3 <= reach(3): live, but nums[3]=0 adds nothing. reach stays 3." },
    { "cells": [3, 2, 1, 0, 4], "pointers": [{ "label": "i", "index": 4 }], "highlight": [0, 1, 2, 3], "note": "i=4 > reach(3) — index 4 is unreachable. The sweep has outrun the frontier: false." }
  ],
  "caption": "Jump Game — the reach frontier stalls at 3 and the walk falls off the edge at index 4."
}
\`\`\`

**Backwards greedy, the mirror.** Sweep right to left carrying "leftmost index that can finish": a cell is good if i + nums[i] reaches the current goal; goal slides to each good cell. Same O(n), a nice sanity check that greedy directions are often interchangeable when the argument is dominance.

**Complexity.** O(n) time, O(1) space — versus the O(n²) per-cell DP.

**Thread.** Feasibility asked "can you?" — the sequel asks "how few jumps?" and the frontier idea sharpens into *layers*: BFS rings over indexes, walked without a queue.`,
    },
    {
      slug: "jump-game-ii",
      title: "Jump Game II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/jump-game-ii",
      summary: "Reach-layers: everything attainable in k jumps forms a window — count windows until the end falls inside.",
      body: `**Signal.** "Find the *minimum* number of jumps to the last index, success guaranteed" — minimum steps in an unweighted reachability graph is BFS's territory, but here the graph is so orderly (each index connects to a contiguous block of later ones) that BFS needs no queue at all.

**Brute force.** Greedily jump to the furthest *square* reachable at each step, choosing the specific landing spot — this fails: from [2,3,1,1,4], jumping max-distance from index 0 lands on index 2, wasting a jump that a window-aware choice would have avoided.

**Optimal approach.** Think in rings, not jumps: layer 0 is index 0; layer 1 is every index reachable in one jump — a contiguous window; layer k+1 is everything reachable from *anywhere in* layer k's window, its right edge being the max of i + nums[i] over the window. Sweep once, tracking the current layer's right edge and the *next* layer's furthest reach; when the sweep crosses the current edge, a jump has been "spent" — increment the count and adopt the new edge. Nobody ever chooses where to land; the window *contains* the landing spot, and that suffices — dominance over layers, not over squares.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 3, 1, 1, 4], "pointers": [{ "label": "i", "index": 0 }], "note": "Layer 0 is just index 0 (edge=0). i=0: nextReach = max(0, 0+2) = 2." },
    { "cells": [2, 3, 1, 1, 4], "highlight": [0], "note": "i reaches edge (0) — jump count=1, edge becomes nextReach=2. New window: indices 1-2." },
    { "cells": [2, 3, 1, 1, 4], "pointers": [{ "label": "i", "index": 1 }], "note": "i=1: nextReach = max(2, 1+3) = 4." },
    { "cells": [2, 3, 1, 1, 4], "pointers": [{ "label": "i", "index": 2 }], "highlight": [1, 2], "note": "i=2: nextReach stays 4 (2+1=3<4). i reaches edge (2) — jump count=2, edge becomes 4. Index 4 (last) is inside this window. Answer: 2 jumps." }
  ],
  "caption": "Jump Game II — each layer is a contiguous window; crossing the current window's edge means one jump was spent, whichever specific square got you there."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — BFS semantics at zero BFS cost, versus a naive furthest-square greedy that produces wrong answers.

**Thread.** Frontiers forward. Gas Station, next, drives a loop instead of a line — and its greedy restart rule comes with the chapter's most elegant little proof.`,
    },
    {
      slug: "gas-station",
      title: "Gas Station",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/gas-station",
      summary: "If you stall, no start inside the failed stretch works either — restart just past the failure.",
      body: `**Signal.** "Circular route: choose the unique valid starting station to complete a full lap" — a circular consumption problem where failing partway through condemns a whole stretch at once is the tell for the restart rule, one of greedy's cleanest dominance arguments.

**Brute force.** Simulate a full lap from every candidate starting station, checking whether the tank ever goes negative — O(n²), re-walking overlapping stretches from every failed start.

**Optimal approach.** Solvability is global: a lap is possible iff total gas ≥ total cost. The restart rule: simulate from a candidate start, carrying the tank; the moment the tank dips negative en route to station j, skip everything and restart at j + 1. Why is the whole stretch condemned at once? Any station strictly inside it was entered with a *non-negative* tank under the current candidate — starting there instead means arriving at the same failure point with an equal-or-**smaller** tank, so it fails at least as early. One failure eliminates the entire prefix.

\`\`\`viz:array
{
  "frames": [
    { "cells": [-2, -2, -2, 3, 3], "pointers": [{ "label": "candidate", "index": 0 }], "highlight": [0], "note": "Candidate = 0. Tank after station 0: 0 + (-2) = -2 — negative! Discard the prefix, candidate becomes 1." },
    { "cells": [-2, -2, -2, 3, 3], "pointers": [{ "label": "candidate", "index": 1 }], "highlight": [1], "note": "Candidate = 1. Tank: -2 again — negative. Candidate becomes 2." },
    { "cells": [-2, -2, -2, 3, 3], "pointers": [{ "label": "candidate", "index": 2 }], "highlight": [2], "note": "Candidate = 2. Tank: -2 again — negative. Candidate becomes 3." },
    { "cells": [-2, -2, -2, 3, 3], "pointers": [{ "label": "candidate", "index": 3 }], "highlight": [3, 4], "note": "Candidate = 3. Tank: +3, then +3 more at station 4 — tank climbs to 6, never dipping negative." },
    { "cells": [-2, -2, -2, 3, 3], "pointers": [{ "label": "candidate", "index": 3 }], "highlight": [0, 1, 2, 3, 4], "note": "Wrapping around: the tank absorbs -2, -2, -2 and lands at exactly 0. Total sum = 0 >= 0, so candidate 3 is confirmed." }
  ],
  "caption": "Gas Station — every failed stretch condemns its whole prefix; the surviving candidate banks enough surplus to finish."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — versus O(n²) simulate-every-start.

**Thread.** Circular consumption managed by restart logic. Next the greed sorts first: Hand of Straights — consuming cards in runs, always anchored at the smallest survivor.`,
    },
    {
      slug: "hand-of-straights",
      title: "Hand of Straights",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/hand-of-straights",
      summary: "The smallest card has no choice: it must anchor a run — consume upward from it, count map in hand.",
      body: `**Signal.** "Can a hand of cards be rearranged into groups of groupSize *consecutive* values" — the smallest remaining card can never sit in the middle of a run (nothing smaller precedes it), which is the tell that its role is *forced*, not chosen — the purest kind of greedy step.

**Brute force.** Try every way of grouping cards into consecutive runs via backtracking — exponential, exploring choices that were never actually free.

**Optimal approach.** Divisibility gate first: hand size must be a multiple of groupSize, or fail instantly. Consider the smallest value still in hand — it cannot sit in the middle of any straight, so it **must begin one**: itself, +1, +2, … up to groupSize. No alternative exists. A frequency map plus ordered access to the smallest remaining (sort the distinct values and sweep, or a min-heap) lets you batch-consume: for each value v in sorted order with count c > 0, it must anchor exactly c runs — subtract c from v, v+1, …, v+size−1; any deficit → false.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 2, 1, 1, 1, 1], "note": "Counts for distinct values [1,2,3,4,6,7,8]: {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}. Smallest remaining is 1, count 1 — it must anchor a run: consume 1, 2, 3." },
    { "cells": [0, 1, 1, 1, 1, 1, 1], "highlight": [0, 1, 2], "note": "After consuming: counts become {1:0, 2:1, 3:1, 4:1, 6:1, 7:1, 8:1}." },
    { "cells": [0, 0, 0, 0, 1, 1, 1], "highlight": [1, 2, 3], "note": "Next smallest remaining is 2, count 1: consume 2, 3, 4. Counts drop to zero for all of them." },
    { "cells": [0, 0, 0, 0, 0, 0, 0], "highlight": [4, 5, 6], "note": "Next smallest is 6, count 1: consume 6, 7, 8. All counts zero — every card accounted for. Answer: true." }
  ],
  "caption": "Hand of Straights — the smallest remaining value is always forced to anchor a run; batch-consuming its whole count at once keeps the sweep linear over distinct values."
}
\`\`\`

**Complexity.** O(n log n) for ordering, O(n) consumption, O(n) space — versus exponential backtracking over groupings.

**Thread.** Greed as forced moves. The next problem inverts the lens entirely: Merge Triplets does not *choose* what to take — it discards what is poisoned, and checks that what remains suffices.`,
    },
    {
      slug: "merge-triplets-to-form-target-triplet",
      title: "Merge Triplets to Form Target Triplet",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/merge-triplets-to-form-target",
      summary: "Discard any triplet that overshoots the target anywhere; the survivors can only help — check coverage.",
      body: `**Signal.** "An operation replaces one triplet with the element-wise max of two — can some sequence produce exactly the target" — max-merging only ever ratchets values upward, never down, which is the tell that operation order is irrelevant and this reduces to a set-selection (filter + coverage) question.

**Brute force.** Try every subset of triplets and every merge order, checking whether any produces the target exactly — the merge order is provably irrelevant (max is associative and commutative), so this explores enormous redundancy for nothing.

**Optimal approach.** A triplet with *any* coordinate above the target is radioactive: include it ever, and that coordinate overshoots forever, since no operation lowers anything. Discard all such triplets. Everything surviving is ≤ target in every coordinate, so merging safe triplets can never exceed the target — you may take **all** of them without risk. Success reduces to coverage: among the survivors, does some triplet hit the target's first coordinate exactly? The second? The third? (Not necessarily the same triplet.) All three covered → true.

\`\`\`viz:table-diff
{
  "columns": ["Triplet", "Coord 1", "Coord 2", "Coord 3", "Verdict"],
  "before": [["[2,5,3]", 2, 5, 3, "safe — covers coord1 (2) exactly"], ["[1,8,4]", 1, 8, 4, "8 > target's 7 — DISCARDED wholesale"]],
  "after": [["[1,7,5]", 1, 7, 5, "safe — covers coord2 (7) and coord3 (5)"], ["Coverage check", "✓", "✓", "✓", "all three coordinates covered → true"]],
  "caption": "Target [2,7,5] — [1,8,4] is discarded entirely for one bad coordinate; the two survivors together cover all three target coordinates."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — one pass, three booleans — versus exhaustive subset-and-order enumeration.

**Thread.** From filtering to partitioning: Partition Labels, where a window greedily stretches to the last occurrence of everything it has swallowed.`,
    },
    {
      slug: "partition-labels",
      title: "Partition Labels",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/partition-labels",
      summary: "A partition can close only when the window has passed every occurrence of every letter inside it.",
      body: `**Signal.** "Split a string so no letter appears in two parts, maximise the number of parts" — maximising part count means cutting as early as legality allows, which is the tell for a greedy cut the instant every obligation inside the current window is settled.

**Brute force.** Try every possible set of cut positions and check whether each resulting part is self-contained (no letter leaking across a boundary) — exponentially many candidate partitions to verify.

**Optimal approach.** A part containing letter x must contain *every* occurrence of x — so a part can end at position i only if no letter seen inside it occurs again after i. Precompute each letter's **last occurrence** (one pass, 26 slots). Sweep with an expanding obligation: track end = the furthest last-occurrence among letters seen since the current part began. When the sweep index *reaches* end — every debt inside is settled — cut: record the size, start fresh. Cutting earlier than legal is impossible, later is wasteful — first-legal is optimal by squeeze.

\`\`\`viz:array
{
  "frames": [
    { "cells": [8], "note": "Part 1 starts at index 0 ('a'). Running end = the furthest last-occurrence seen so far among letters inside the window; it settles at 8 once every occurrence of a, b, and c is accounted for. Cut after 9 characters (indices 0-8)." },
    { "cells": [8, 15], "highlight": [1], "note": "Part 2 starts at index 9. Running end settles at 15 once d, e, f, g are all fully accounted for. Cut after 7 more characters (indices 9-15)." },
    { "cells": [8, 15, 23], "highlight": [2], "note": "Part 3 starts at index 16 and runs to the end (index 23), since h, i, j, k, l's occurrences don't resolve until the string ends. Final part sizes: [9, 7, 8]." }
  ],
  "caption": "Partition Labels — the window's obligation (furthest last-occurrence) must fully resolve before a cut is legal; this is interval-merging in disguise."
}
\`\`\`

**The déjà vu.** Each letter spans [first, last]; overlapping spans must share a part, and parts are exactly the merged clusters of overlapping letter-spans — you are merging intervals without saying so. The next chapter will say so, loudly.

**Complexity.** O(n) time, O(26) space — versus exponentially many candidate partitions to verify by brute force.

**Thread.** One problem left: Valid Parenthesis String — where the wildcard forces greed to do something subtle: carry not a value but a *range* of possible truths, and stay sound by collapsing it carefully.`,
    },
    {
      slug: "valid-parenthesis-string",
      title: "Valid Parenthesis String",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-parenthesis-string",
      summary: "Stars are three-way wildcards: track the min and max possible open count — a whole range in two integers.",
      body: `**Signal.** "Each * may act as (, as ), or as nothing — is *some* interpretation valid" — a wildcard forking every prefix's open-count into multiple possible values is the tell that the achievable set is always a contiguous **range**, trackable as just two integers instead of an exponential fan-out.

**Brute force.** Backtrack over every interpretation of every star (open, close, or nothing) — 3ⁿ branches for n stars, or a DP over (index, open-count) at O(n²), both far more than the greedy range needs.

**Optimal approach.** The set of achievable open-counts after any prefix is always a contiguous range — each character shifts the whole range by ±1, or (for *) widens it by one in each direction, and contiguity survives every step. Carry two integers: **lo** and **hi**, the least and most opens any interpretation could have. ( → both up. ) → both down. * → lo down (might be a close), hi up (might be an open). If **hi** ever goes negative, even all-stars-as-opens has too many closes — false immediately. **lo** clamps at zero — a negative lo describes interpretations that already died, so discard them and keep the range honest. At the end: valid iff **lo == 0** — some surviving interpretation balanced exactly.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 0], "note": "Start: lo=0, hi=0 (empty prefix, zero opens either way)." },
    { "cells": [1, 1], "highlight": [0, 1], "note": "'(': both up. lo=1, hi=1." },
    { "cells": [0, 2], "note": "'*': lo down (could be a close) to 0, hi up (could be an open) to 2. Range [0,2]." },
    { "cells": [0, 1], "note": "')': both down. lo would be -1, clamped to 0. hi=1. Range [0,1]." },
    { "cells": [0, 0], "highlight": [0], "note": "')': both down again. lo clamped to 0, hi=0. Range [0,0]. lo==0 at the end — valid: the star spent itself as an open." }
  ],
  "caption": "Valid Parenthesis String on \\"(*))\\" — [lo, hi] tracks the whole envelope of possible open-counts; validity only needs lo to reach exactly 0."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — for a problem whose possibility space is exponential — versus 3ⁿ backtracking or O(n²) DP. Carrying the *envelope of all futures* instead of any single future: greedy's graduation exam.

**Thread.** Greedy closes. Partition Labels already whispered the next chapter's name — spans with starts and ends, merged and scheduled. Intervals is next, and its first move is the sort this chapter kept almost needing.`,
    },
  ],
};
