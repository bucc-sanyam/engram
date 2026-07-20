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
      body: `**The problem.** Find the contiguous subarray with the largest sum. [−2, 1, −3, 4, −1, 2, 1, −5, 4] → 6 (subarray [4, −1, 2, 1]). The most famous one-pass algorithm in interviewing, and the cleanest bridge between the DP chapter you left and the greedy mindset you are entering.

**The insight.** Walk the array carrying one value: the best sum of a subarray **ending exactly here**. At each element x, the choice is binary — extend the previous run (best + x) or abandon it and start fresh at x. And the decision rule is brutally simple: extend only if the previous run is *worth carrying*, i.e. if best is positive. A negative prefix is dead weight — any future subarray does strictly better without it. Track the global maximum of the running value as you go; that is the answer. This is Kadane's algorithm, and the greedy sentence justifying it is an exchange argument in miniature: *any optimal subarray that includes a negative prefix can drop that prefix and improve — so some optimum starts fresh exactly where the greedy does.*

**Two lenses, one algorithm.** As DP: dp[i] = max(x, dp[i−1] + x) — Maximum Product Subarray's simpler sibling, with the table collapsed to one variable. As greedy: "carry the run while it helps; drop it the instant it hurts." Both compile to the same four lines; holding both explains *why* the chapter transition runs through this problem. (The all-negative edge case is handled free: starting fresh at the least-bad element is exactly max(x, …), and initialising the global best to the first element — never to 0 — keeps it honest.)

**The walk-through.** [−2, 1, −3, 4, −1, 2, 1, −5, 4]: running best: −2, 1, −2, 4, 3, 5, 6, 1, 5. Global max 6. Watch index 3: the running −2 was dropped, not carried — the fresh start *is* the algorithm.

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

**Complexity.** O(n) time, O(1) space. (Divide-and-conquer solves it in O(n log n) — worth one sentence as the "clever but beaten" alternative.)

**The thread.** One carried value, one drop rule. Jump Game, next, carries a different single value — the furthest reachable index — and feasibility falls out of a one-pass maximum.`,
    },
    {
      slug: "jump-game",
      title: "Jump Game",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/jump-game",
      summary: "Track the furthest reachable index; if the sweep ever outruns it, you are stranded.",
      body: `**The problem.** Each array cell holds a maximum jump length. Starting at index 0, can you reach the last index? [2, 3, 1, 1, 4] → true; [3, 2, 1, 0, 4] → false — every route funnels into the 0 and dies.

**The insight.** You do not need to know *which* jumps to take — only what is *reachable*. Sweep left to right carrying one number: **reach**, the furthest index attainable so far. At each index i: if i > reach, you are standing somewhere unreachable — the sweep has outrun every possible route, return false. Otherwise this cell is live, and standing on it extends possibility: reach = max(reach, i + nums[i]). Reach the end of the sweep (or reach ≥ last index) → true. The greedy justification is a dominance argument in one line: *the furthest-reachable frontier dominates every individual path — any index some route can reach is ≤ reach — so tracking the maximum loses nothing.* No path enumeration, no DP table over "can I stand here" (which works, O(n²), and is precisely what the greedy collapses).

**The walk-through.** [2, 3, 1, 1, 4]: reach 0 → i 0: reach 2 → i 1: reach 4 → done, true. Now [3, 2, 1, 0, 4]: reach 3 after i 0; i 1: reach max(3, 3) = 3; i 2: 3; i 3: 3 (the 0 adds nothing); i 4: 4 > 3 → **false**. The zero never needed special-casing — it simply failed to move the frontier, and the frontier told the truth.

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

**Backwards greedy, the mirror.** Sweep right to left carrying "leftmost index that can finish": a cell is good if i + nums[i] reaches the current goal; goal slides to each good cell. Same O(n), pleasing symmetry, and a nice sanity check that greedy directions are often interchangeable when the argument is dominance.

**Complexity.** O(n) time, O(1) space.

**The thread.** Feasibility asked "can you?" — the sequel asks "how few jumps?" and the frontier idea sharpens into *layers*: BFS rings over indexes, walked without a queue.`,
    },
    {
      slug: "jump-game-ii",
      title: "Jump Game II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/jump-game-ii",
      summary: "Reach-layers: everything attainable in k jumps forms a window — count windows until the end falls inside.",
      body: `**The problem.** Same setup, success guaranteed — now find the *minimum* number of jumps to the last index. [2, 3, 1, 1, 4] → 2 (jump to the 3, then to the end).

**The insight — think in rings, not jumps.** Minimum-steps in an unweighted world is BFS — chapter 11's reflex. Here the "graph" is so orderly (each index connects to a *contiguous* block of later indexes) that the BFS needs no queue: **each layer is just an interval**. Layer 0 is index 0. Layer 1 is every index reachable in one jump — a contiguous window. Layer k+1 is everything reachable from *anywhere in* layer k's window — again contiguous, its right edge being the max of i + nums[i] over the window. Sweep once, tracking the current layer's right edge and the *next* layer's furthest reach; when the sweep crosses the current edge, a jump has been "spent" — increment the count and adopt the new edge. The answer is how many edges you crossed before the last index fell inside a window. Greedy phrasing of the same fact: *never decide where you land — decide only how far the next jump-generation can possibly extend; the specific stepping stones are irrelevant because the furthest frontier dominates them all.*

**The walk-through.** [2, 3, 1, 1, 4]: layer edge 0, next-reach 0. i 0: next-reach 2; sweep hits edge 0 → jump 1, edge 2. i 1: next 4; i 2: next 4; sweep hits edge 2 → jump 2, edge 4 — last index inside. Answer 2. Note nobody ever chose "land on index 1"; the window *contained* it, and that sufficed.

**The trap.** Greedily jumping to the furthest square each time (rather than the furthest *frontier*) fails: from [2, 3, 1, 1, 4], jumping max-distance to index 2 wastes a jump. The window formulation is what makes the greed sound — it is dominance over layers, not over squares.

**Complexity.** O(n) time, O(1) space — BFS semantics at zero BFS cost.

**The thread.** Frontiers forward. Gas Station, next, drives a loop instead of a line — and its greedy restart rule comes with the chapter's most elegant little proof.`,
    },
    {
      slug: "gas-station",
      title: "Gas Station",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/gas-station",
      summary: "If you stall, no start inside the failed stretch works either — restart just past the failure.",
      body: `**The problem.** Circular route of stations: gas[i] to collect, cost[i] to reach the next. Choose the unique valid starting station to complete a full lap (or −1). gas [1,2,3,4,5], cost [3,4,5,1,2] → start at index 3.

**Two facts, two passes merged into one.** **Fact one — solvability is global:** a lap is possible iff total gas ≥ total cost. Net fuel is conserved around the loop; if the sum is negative nothing helps, and (less obviously — this is the theorem the problem rests on) if the sum is non-negative, *some* start works. **Fact two — the restart rule:** simulate from a candidate start, carrying the tank. The moment the tank dips negative en route to station j, do not backtrack and retry the next station — **skip everything and restart at j + 1.** Why is the whole stretch condemned at once? Any station strictly inside it was *entered with a non-negative tank* under the current candidate (you were still solvent when you passed it). Starting there instead means arriving at the same failure point with an equal-or-**smaller** tank — you gave up the surplus carried in — so it fails at least as early. One failure eliminates the entire prefix: the exchange/dominance argument at its prettiest, and the sentence interviewers are listening for.

**The mechanics.** One sweep: running tank, running total, candidate start. Tank goes negative → total keeps accumulating, tank resets to 0, candidate becomes i + 1. End of sweep: total negative → −1; otherwise the candidate stands — no second lap of verification needed, because the two facts together guarantee it (the surviving candidate banks enough surplus to cover the early stretch it skipped; the problem's uniqueness promise seals it).

**The walk-through.** Net per station: −2, −2, −2, +3, +3. From 0: tank −2 → restart at 1 → −2 → restart… candidate settles at 3: tank +3, +6, then absorbs −2, −2, −2 → finishes at 0 exactly. Total = 0 ≥ 0 ✓ → answer 3.

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

**The thread.** Circular consumption managed by restart logic. Next the greed sorts first: Hand of Straights — consuming cards in runs, always anchored at the smallest survivor.`,
    },
    {
      slug: "hand-of-straights",
      title: "Hand of Straights",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/hand-of-straights",
      summary: "The smallest card has no choice: it must anchor a run — consume upward from it, count map in hand.",
      body: `**The problem.** Can a hand of cards be rearranged into groups, each being groupSize *consecutive* values? [1,2,3,6,2,3,4,7,8], size 3 → true: (1,2,3), (2,3,4), (6,7,8). Divisibility gate first: hand size must be a multiple of groupSize, or fail instantly.

**The insight — the smallest card is forced.** Consider the smallest value still in hand. It cannot sit in the *middle* of any straight (nothing smaller exists to precede it), so it **must begin one**: itself, +1, +2, … up to groupSize. No alternative exists — which means this greedy step needs no exchange argument at all; it is not a clever choice, it is the *only legal move*. Make it: decrement the count of each value in the run; any missing value → false. Repeat with the new smallest. Greedy is most comfortable exactly here, where every step is forced — recognising forcedness is itself the skill.

**The mechanics.** A frequency map (chapter one) plus ordered access to the smallest remaining — either sort the distinct values and sweep, or a min-heap (chapter eight's tool, and the reason Greedy sits after Heap on the roadmap). Sweep flavour: for each value v in sorted order with count c > 0, it must anchor exactly c runs — subtract c from v, v+1, …, v+size−1; any deficit → false. Batch-consuming c runs at once turns a potentially quadratic dance into one clean pass over distinct values.

**The walk-through.** Counts {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}. v=1, c=1: subtract 1 from 1,2,3 → {2:1, 3:1, 4:1, …}. v=2, c=1: consume 2,3,4 → gone. v=6, c=1: consume 6,7,8 → empty hand → true. Remove the 4 from the original hand and v=2's run demands a 4 that is not there → false.

**Complexity.** O(n log n) for ordering, O(n) consumption, O(n) space.

**The thread.** Greed as forced moves. The next problem inverts the lens entirely: Merge Triplets does not *choose* what to take — it discards what is poisoned, and checks that what remains suffices.`,
    },
    {
      slug: "merge-triplets-to-form-target-triplet",
      title: "Merge Triplets to Form Target Triplet",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/merge-triplets-to-form-target",
      summary: "Discard any triplet that overshoots the target anywhere; the survivors can only help — check coverage.",
      body: `**The problem.** Triplets [a, b, c]; an operation picks two and replaces one with the element-wise max. Can some sequence of operations produce exactly the target triplet? Triplets [[2,5,3],[1,8,4],[1,7,5]], target [2,7,5] → true.

**The reframe.** Max-merging never *decreases* any coordinate — values only ratchet upward. So the question is really: can you select triplets whose element-wise max is exactly the target? The operation order is theatre; merging any chosen set in any order yields the same coordinate-wise max (max is associative and commutative). Strip the story, and it is a set-selection question.

**The insight — filter, then check.** A triplet with *any* coordinate **above** the target is radioactive: include it ever, and that coordinate overshoots forever (no operation lowers anything). Discard all such triplets. Everything surviving is ≤ target in every coordinate — and merging safe triplets can never exceed the target, so you may take **all** of them without risk. Success then reduces to coverage: among the survivors, does some triplet *hit* target's first coordinate exactly? the second? the third? (Not necessarily the same triplet — three flags.) All three covered → true. The greedy flavour here is unusual and worth naming: no ordering, no frontier — just **prune the poisonous, keep everything harmless, verify sufficiency**. Filtering *is* a greedy argument: each discard is individually forced, each keep is individually free.

**The walk-through.** Target [2,7,5]: triplet [2,5,3] safe — covers coordinate 1 exactly. [1,8,4]: 8 > 7 → discarded wholesale, its useful-looking 1 and 4 notwithstanding. [1,7,5]: safe — covers coordinates 2 and 3. Flags all set → true. Remove the third triplet and coordinate 2 goes uncovered → false.

**Complexity.** O(n) time, O(1) space — one pass, three booleans.

**Why it earns its slot.** It trains the *reduction* instinct — operation-sequence problems often collapse to invariant questions ("what can this operation never undo?") — and the answer "order doesn't matter because the operation is a semilattice max" is the kind of sentence that ends an interview early, pleasantly.

**The thread.** From filtering to partitioning: Partition Labels, where a window greedily stretches to the last occurrence of everything it has swallowed.`,
    },
    {
      slug: "partition-labels",
      title: "Partition Labels",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/partition-labels",
      summary: "A partition can close only when the window has passed every occurrence of every letter inside it.",
      body: `**The problem.** Split a string into as many parts as possible so that **no letter appears in two parts**. Return the part sizes. "ababcbacadefegdehijhklij" → [9, 7, 8]. Maximising the *number* of parts means cutting as early as legality allows — the definition of a greedy cut.

**The insight.** A part containing letter x must contain *every* occurrence of x — so a part can end at position i only if no letter seen inside it occurs again after i. Precompute each letter's **last occurrence** (one pass, 26 slots — chapter one's cheapest table). Then sweep with an expanding obligation: track end = the furthest last-occurrence among letters seen since the current part began. Every letter you meet may push end outward (its own last occurrence might exceed the current promise). When the sweep index *reaches* end — every debt inside is settled, nothing seen recurs later — cut: record the size, start the next part fresh. The greedy sentence: *cut at the first legal position; delaying a cut can only merge parts, never create more.* Cutting earlier than legal is impossible, later is wasteful — first-legal is optimal by squeeze.

**The déjà vu.** An interval is forming here: each letter spans [first, last], overlapping spans must share a part, and parts are exactly the merged clusters of overlapping letter-spans. You are merging intervals without saying so — the next chapter will say so, loudly. The sweep with a running furthest-reach is also Jump Game's frontier in different clothes; greedy has a small vocabulary and vast reuse.

**The walk-through.** "ababcbaca…": a's last occurrence is index 8. Sweep: a sets end 8; b extends? b's last is 5 — no; c's last is 7 — no; index reaches 8 → cut [9]. The d-e-f-g stretch settles at 15 → [7]; the tail → [8].

**Complexity.** O(n) time, O(26) space.

**The thread.** One problem left: Valid Parenthesis String — where the wildcard forces greed to do something subtle: carry not a value but a *range* of possible truths, and stay sound by collapsing it carefully.`,
    },
    {
      slug: "valid-parenthesis-string",
      title: "Valid Parenthesis String",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-parenthesis-string",
      summary: "Stars are three-way wildcards: track the min and max possible open count — a whole range in two integers.",
      body: `**The problem.** A string of (, ), and * — where each * may act as (, as ), or as nothing. Is *some* interpretation a valid parenthesis string? "(*))" → true (star becomes an open). The chapter's finale because the greedy state is its most sophisticated: not a value, not a frontier — an **interval of possibilities**.

**Why naive counting dies.** Valid Parentheses (chapter four) tracked one number: unmatched opens. Each * forks that number three ways; n stars fork it 3ⁿ ways. Backtracking works and burns; DP over (index, open-count) works at O(n²). The greedy observation kills the fork entirely: the set of achievable open-counts after any prefix is always a **contiguous range** — each character shifts the whole range by ±1 or (for *) widens it by one in each direction, and contiguity survives every step (ranges shifted or widened stay ranges — with one parity caveat interviewers never ask and honest footnotes admit: the range steps by 2 in raw form, but its min/max envelope is what soundness needs). So carry two integers: **lo** and **hi**, the least and most opens any interpretation could have.

**The rules.** ( → both up. ) → both down. * → lo down (it might be a close), hi up (might be an open). Two clamps carry all the correctness: if **hi** ever goes negative, even all-stars-as-opens has too many closes — false immediately. And **lo** clamps at zero — a negative lo describes interpretations that already died (closed below zero); discard them, keep the range honest. At the end: valid iff **lo == 0** — some surviving interpretation balanced exactly.

**The walk-through.** "(*))": ( → [1,1]. * → [0,2]. First ) → [0,1] — lo dipped to −1 and clamped to 0. Second ) → [0,0] — clamped again, hi now exactly 0. End: lo = 0 → true — the star spent itself as an open. For "))(": lo and hi both start at [0,0], and the very first ) drags hi to −1 immediately → false on the spot, no interpretation survives.

**Complexity.** O(n) time, O(1) space — for a problem whose possibility space is exponential. Carrying the *envelope of all futures* instead of any single future: greedy's graduation exam.

**The thread.** Greedy closes. Partition Labels already whispered the next chapter's name — spans with starts and ends, merged and scheduled. Intervals is next, and its first move is the sort this chapter kept almost needing.`,
    },
  ],
};
