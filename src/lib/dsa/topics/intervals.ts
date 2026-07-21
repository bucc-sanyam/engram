import type { DsaTopic } from "../types";

/** Chapter 16 — Intervals: time as geometry. */
export const intervals: DsaTopic = {
  slug: "intervals",
  title: "Intervals",
  chapter: 16,
  tagline: "Spans with starts and ends — sort them, and overlap becomes a one-comparison question.",
  color: "#8fd3ff",
  prereqs: ["heap"],
  unlocks: [],
  intro: `An interval is the smallest interesting piece of geometry: a start and an end. Meetings, bookings, CPU bursts, IP ranges, gene spans — the moment your data means "from here to there," you are in this chapter. And nearly everything difficult about intervals dissolves under one preparatory move: **sort by start**. Unsorted, "do any of these overlap?" is an all-pairs question; sorted, overlap can only happen between *neighbours in the sweep* — each new interval need only be compared against the latest thing still open. One sort converts geometry into a single left-to-right pass. If this chapter had a motto, that is it.

The second load-bearing idea is knowing the **overlap test** cold, in its clean form: two intervals overlap iff each starts before the other ends — a.start ≤ b.end and b.start ≤ a.end. Interviewers watch whether you derive it or fumble it; derive it once from its negation ("they *don't* overlap iff one ends before the other starts") and it is yours forever. Its edge case — do touching endpoints count? — is a *problem statement* question, not a math question; ask it out loud every time.

The six problems build a complete toolkit. Insert Interval is the surgical case — one new span absorbed into sorted peace, three phases: before, during (merge), after. Merge Intervals is the same absorption run wholesale. Non-overlapping Intervals turns to scheduling — remove the fewest to make peace — and resurrects the Greedy chapter's exchange argument in its most famous costume (keep the earliest-ending). Meeting Rooms is the overlap test as a yes/no sweep; Meeting Rooms II asks *how many rooms* — the count of simultaneous overlaps — and introduces the two great counting techniques: the min-heap of end-times (chapter eight, back on stage) and the event sweep (starts +1, ends −1), which is really a prefix-sum over time (chapter one, of all things). The finale, Minimum Interval to Include Each Query, composes everything: sort intervals *and* queries, sweep them together, and let a heap hold the candidates — offline processing, the pattern real databases use when queries can be reordered.

On the roadmap Intervals is a leaf hanging off Heap. Small chapter, permanent tools.`,
  problems: [
    {
      slug: "insert-interval",
      title: "Insert Interval",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/insert-new-interval",
      summary: "Three phases against a sorted list: copy the before, absorb the overlapping, copy the after.",
      body: `**Signal.** "A sorted, non-overlapping list, and one new interval: insert it, merging wherever it overlaps" — a single insertion into an already-sorted, already-disjoint list is the tell that the collisions form one *contiguous block*, solvable in three linear phases with no re-sorting.

**Brute force.** Append the new interval to the list, sort everything again, then merge overlapping intervals as a fresh pass — O(n log n), throwing away the fact that the input was already sorted and disjoint before the insertion.

**Optimal approach.** Because the existing list is sorted and disjoint, the new interval's collisions form a **contiguous block**. **Phase one:** intervals ending before the newcomer starts are untouchable — copy them through. **Phase two:** intervals that overlap it get *absorbed*: fold each into the newcomer by taking min of starts and max of ends — the newcomer swells as it eats. When the next interval starts beyond the swollen end, emit the merged span once. **Phase three:** everything after — copy through.

\`\`\`viz:table-diff
{
  "columns": ["Interval", "Phase", "Action"],
  "before": [["[1,2]", "Before", "copy through unchanged"], ["[3,5]", "Overlap", "absorb — newcomer [4,8] becomes [3,8]"]],
  "after": [["[6,7]", "Overlap", "absorb — stays [3,8]"], ["[8,10]", "Overlap (touching)", "absorb — newcomer becomes [3,10]"], ["[12,16]", "After", "emit merged [3,10] first, then copy [12,16] through"]],
  "caption": "Insert Interval — [[1,2],[3,5],[6,7],[8,10],[12,16]] + [4,8]: the collision block is contiguous (indices 1-3), swallowed into one growing span. Result: [[1,2],[3,10],[12,16]]."
}
\`\`\`

**Complexity.** O(n) time, O(n) output space — versus the O(n log n) re-sort-everything approach.

**Thread.** One interval absorbed into sorted peace. Merge Intervals, next, is this problem with *nothing* pre-sorted and *everything* potentially colliding — the wholesale version, and the chapter's true workhorse.`,
    },
    {
      slug: "merge-intervals",
      title: "Merge Intervals",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/merge-intervals",
      summary: "Sort by start; each interval either extends the last open span or starts a new one.",
      body: `**Signal.** "An arbitrary pile of intervals: merge all overlapping ones" — no pre-existing order is the tell for the chapter's motto: sort by start first, and an all-pairs question collapses into a single left-to-right sweep.

**Brute force.** Compare every pair of intervals for overlap and union the overlapping ones (e.g. via union-find or repeated merging) — O(n²), since without sorting, any interval might touch any other.

**Optimal approach.** Sort by start. Sweep, maintaining one **open span** — the interval currently being built. Each next interval, thanks to the sort, can only relate to the open span two ways: its start falls inside (start ≤ openEnd — extend the span's end with max) or beyond it (a gap — the open span is finished forever; emit it, open a new one). The sort guarantees no *later* interval can reach back and touch an emitted span, because later starts only grow — emitted means safe, the entire correctness argument. Extending must take max(openEnd, end), not assign: a swallowed interval like [2,3] inside [1,10] must not shrink the open span.

\`\`\`viz:table-diff
{
  "columns": ["Next interval", "Compare to open span", "Result"],
  "before": [["[1,3]", "(first) open span begins", "open = [1,3]"], ["[2,6]", "2 <= openEnd(3)", "extend — open = [1,6]"]],
  "after": [["[8,10]", "8 > openEnd(6) — a gap", "emit [1,6]; open = [8,10]"], ["[15,18]", "15 > openEnd(10) — a gap", "emit [8,10]; open = [15,18]; emit at the end"]],
  "caption": "Merge Intervals, sorted [[1,3],[2,6],[8,10],[15,18]] — each interval either extends the open span (overlap/touch) or closes it (a gap). Result: [[1,6],[8,10],[15,18]]."
}
\`\`\`

**Complexity.** O(n log n) for the sort, O(n) sweep and output — versus the O(n²) all-pairs comparison.

**Kinship.** Partition Labels (last chapter) was secretly this — letter spans merged into clusters; and Insert Interval is this problem's phase two running once.

**Thread.** Merging makes peace by *union*. The next problem makes peace by *eviction* — remove the fewest intervals so none overlap — and the right greedy choice (keep the earliest ender) comes with the chapter's classic proof.`,
    },
    {
      slug: "non-overlapping-intervals",
      title: "Non Overlapping Intervals",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/non-overlapping-intervals",
      summary: "Fewest removals = total minus the most you can keep — and earliest-end-first keeps the most.",
      body: `**Signal.** "Remove the minimum number of intervals so the rest never overlap" — minimizing removals is the same as maximizing what's kept, which is the tell that this is the classic **activity selection** problem in an interval costume: sort by end time, keep greedily.

**Brute force.** Try every subset of intervals, check which are pairwise non-overlapping, and keep the largest valid subset — 2ⁿ subsets, exponential.

**Optimal approach.** "Fewest removed" = n − "most kept." Sort by **end time**. Sweep, keeping any interval that starts at or after the end of the last kept one; skip the rest. Why earliest-end and not shortest or earliest-start? The exchange argument: compare any optimal kept-set's first interval with the greedy's first (the global earliest ender) — swapping the greedy's choice in can never hurt, since it ends no later, so everything after the optimal's first still fits after the greedy's. Earliest end *frees the future fastest*.

\`\`\`viz:table-diff
{
  "columns": ["Interval", "Compare to last kept end", "Decision"],
  "before": [["[1,2]", "first — keep", "lastEnd = 2"], ["[2,3]", "2 >= 2", "keep, lastEnd = 3"]],
  "after": [["[1,3]", "1 < 3", "REMOVE"], ["[3,4]", "3 >= 3", "keep, lastEnd = 4"]],
  "caption": "Sorted by end: [1,2],[2,3],[1,3],[3,4]. Kept 3 of 4 — [1,3] is the one removal. Every kept interval starts at or after the previous kept interval's end."
}
\`\`\`

**Complexity.** O(n log n) sort, O(n) sweep, O(1) extra — versus the O(2ⁿ) subset search.

**Thread.** Yes/no overlap next, in its purest form — Meeting Rooms, the one-person calendar — and then its famous sequel asks *how many calendars* you need.`,
    },
    {
      slug: "meeting-rooms",
      title: "Meeting Rooms",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/meeting-schedule",
      summary: "One person, many meetings: sort by start and check each neighbour pair — any overlap means no.",
      body: `**Signal.** "Can one person attend all these meetings" — equivalent to "are the intervals pairwise non-overlapping" — is the tell that sorting reduces an all-pairs check to a neighbours-only check: after sorting by start, if any two intervals overlap, some *adjacent* pair overlaps.

**Brute force.** Compare every pair of intervals for overlap — O(n²), checking pairs that sorting would make provably unnecessary.

**Optimal approach.** Sort by start. One pass, one comparison per step: interval[i+1].start < interval[i].end → false (a clash). Survive the whole sweep → true. This works because after sorting, meeting i is the latest-starting thing seen so far, and — since nothing has overlapped yet — also the latest-ending relevant one, so comparing only against the immediate predecessor suffices.

\`\`\`viz:array
{
  "frames": [
    { "cells": [30, 10, 20], "pointers": [{ "label": "i", "index": 0 }], "highlight": [0, 1], "note": "Sorted by start: [0,30],[5,10],[15,20]. Compare interval[1].start(5) to interval[0].end(30): 5 < 30 — overlap detected immediately. Answer: false." },
    { "cells": [4, 10], "highlight": [0, 1], "note": "Second example, sorted [[2,4],[7,10]]: compare interval[1].start(7) to interval[0].end(4): 7 >= 4 — no clash. Sweep survives — true." }
  ],
  "caption": "Meeting Rooms — after sorting by start, only adjacent pairs ever need checking."
}
\`\`\`

**Why an Easy sits this deep in the atlas.** It is the *skeleton* of the previous two problems (Merge's sweep without the merging; Non-overlapping's sweep without the eviction) and the setup for its sequel, the real interview staple.

**Complexity.** O(n log n) sort, O(n) sweep, O(1) space — versus the O(n²) all-pairs check.

**Thread.** One room, yes or no. The sequel: everyone keeps their meetings — how many rooms must exist? Counting simultaneous overlap needs a genuinely new tool, and there are two lovely ones.`,
    },
    {
      slug: "meeting-rooms-ii",
      title: "Meeting Rooms II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/meeting-schedule-ii",
      summary: "Peak simultaneous meetings: a min-heap of end times, or the +1/−1 event sweep — know both.",
      body: `**Signal.** "The minimum number of rooms so every meeting happens as scheduled" — this is really asking for the **maximum number of meetings alive at any one instant**, the tell for either a min-heap of end times or an event-based concurrency sweep.

**Brute force.** For every point in time (or every meeting start), count how many meetings are active — O(n²) if checking each meeting against every other, or worse if sampling a continuous timeline.

**Optimal approach, tool one (end-time min-heap).** Sort by start; the heap holds the end times of meetings currently occupying rooms. For each meeting: if the earliest-ending room (heap root) frees up before this meeting starts, that room is reusable — pop it; either way push this meeting's end. The heap's peak size is the answer — always reuse the room freeing earliest; if even that one is busy, a new room is genuinely forced.

**Optimal approach, tool two (event sweep).** Explode each meeting into two events: (start, +1) and (end, −1). Sort events by time — ends before starts on ties, so back-to-back meetings share a room. Sweep, keeping a running sum; its **peak** is the answer. This is a prefix sum over time — chapter one's oldest idea — and it generalises effortlessly (max CPU load, plane-seat overlap, staffing curves).

\`\`\`viz:array
{
  "frames": [
    { "cells": [1], "note": "Event (0, +1): running count = 1." },
    { "cells": [1, 2], "highlight": [1], "note": "Event (5, +1): running count = 2. New peak: 2." },
    { "cells": [1, 2, 1], "note": "Event (10, -1): running count = 1 — a room frees up." },
    { "cells": [1, 2, 1, 2], "highlight": [1, 3], "note": "Event (15, +1): running count = 2 again — ties the peak." },
    { "cells": [1, 2, 1, 2, 1, 0], "note": "Events (20, -1) and (30, -1): count falls to 1, then 0. Peak concurrency — and the answer — is 2 rooms." }
  ],
  "caption": "Meeting Rooms II — the event sweep's running sum is a prefix sum over time; its peak is the room count."
}
\`\`\`

**Complexity.** Both tools O(n log n) time, O(n) space — versus O(n²) naive concurrency checking. Offer both; pick the sweep for elegance, the heap when the follow-up wants *which* room each meeting gets.

**Thread.** Counting concurrency conquered. The finale composes the whole chapter — intervals sorted, queries sorted, a heap in the middle — to answer many questions in one pass: offline processing.`,
    },
    {
      slug: "minimum-interval-to-include-each-query",
      title: "Minimum Interval to Include Each Query",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/minimum-interval-including-query",
      summary: "Sort intervals and queries together, sweep once: a heap keyed by size holds the candidates — offline processing.",
      body: `**Signal.** "For each query, the size of the smallest interval containing it" — answers can be delivered in any order and remapped at the end, which is the tell for **offline processing**: sort the queries too, and sweep both lists together instead of answering in the order asked.

**Brute force.** For each query, scan every interval to find the smallest one containing it — O(n·q), redoing the same scan structure for every query independently.

**Optimal approach.** Sort intervals by start. Walk queries ascending, maintaining a min-heap of **candidate intervals keyed by size**. Per query q: *admit* — push every not-yet-admitted interval whose start ≤ q (the interval pointer only ever moves forward across the whole sweep). *Evict* — pop from the heap while its top has end < q: queries only grow from here, so an interval too far left for this query is too far left for every future one, dead forever. *Read* — the surviving top is the smallest-sized interval covering q; empty heap → −1. A hash map remaps sorted-order answers back to the original query order (queries may repeat).

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 3], "pointers": [{ "label": "q", "index": 0 }], "note": "q=2: admit [1,4] (size 4) and [2,4] (size 3). Heap top (smallest size): 3." },
    { "cells": [3, 3, 4], "pointers": [{ "label": "q", "index": 1 }], "note": "q=3: admit [3,6] (size 4). Heap top is still 3." },
    { "cells": [3, 3, 4, 1], "pointers": [{ "label": "q", "index": 2 }], "note": "q=4: admit [4,4] (size 1). Heap top: 1." },
    { "cells": [4], "highlight": [0], "pointers": [{ "label": "q", "index": 3 }], "note": "q=5: evict [4,4], [1,4], [2,4] (their ends are all < 5). Only [3,6] (size 4) survives. Answer: 4." }
  ],
  "caption": "Minimum Interval to Include Each Query — admit/evict/read against a size-ordered heap; queries sorted ascending [2,3,4,5] give answers [3,3,1,4], remapped to original query order."
}
\`\`\`

**Complexity.** O(n log n + q log q + (n + q) log n) — sorts plus each interval pushed and popped at most once — O(n + q) space, versus the O(n·q) per-query scan.

**Thread.** Intervals close with the atlas's favourite move: three old tools, one new posture. Two chapters remain — Math & Geometry's grab-bag of grids and digits, then the bit-level finale.`,
    },
  ],
};
