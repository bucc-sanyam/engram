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
      body: `**The problem.** A sorted, non-overlapping list of intervals, and one new interval: insert it, merging wherever it overlaps, and return a list that is sorted and non-overlapping again. [[1,3],[6,9]] + [2,5] → [[1,5],[6,9]].

**The insight.** Because the existing list is sorted and disjoint, the new interval's collisions form a **contiguous block** — everything it touches sits together in the middle. So the pass has exactly three phases, and the algorithm is just phase discipline. **Phase one:** intervals ending before the newcomer starts are untouchable — copy them through. **Phase two:** intervals that overlap it (start ≤ newEnd, the overlap test half that matters here) get *absorbed*: fold each into the newcomer by taking min of starts and max of ends — the newcomer swells as it eats. When the next interval starts beyond the swollen end, the eating is over; emit the merged span once. **Phase three:** everything after — copy through. One pass, no sorting (the input's order is the gift; wasting it with a sort-and-remerge is the mediocre answer).

**The walk-through.** [[1,2],[3,5],[6,7],[8,10],[12,16]] + [4,8]: phase one copies [1,2]. Phase two absorbs [3,5] → newcomer [3,8]; absorbs [6,7] → [3,8]; absorbs [8,10] → [3,10] (touching at 8 — this problem counts touching as overlapping; you asked, as always). [12,16] starts past 10 → emit [3,10], phase three copies [12,16]. Result [[1,2],[3,10],[12,16]].

**The edge cases that grade you.** Newcomer swallowed whole by phase two's arithmetic (min/max handles containment silently); newcomer before everything or after everything (one of the phases is simply empty — no special code if the loop conditions are right); empty input list (emit the newcomer alone).

**Complexity.** O(n) time, O(n) output space — and the follow-up "what if you insert many intervals?" points at re-sorting once and running the next problem instead.

**The thread.** One interval absorbed into sorted peace. Merge Intervals, next, is this problem with *nothing* pre-sorted and *everything* potentially colliding — the wholesale version, and the chapter's true workhorse.`,
    },
    {
      slug: "merge-intervals",
      title: "Merge Intervals",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/merge-intervals",
      summary: "Sort by start; each interval either extends the last open span or starts a new one.",
      body: `**The problem.** An arbitrary pile of intervals: merge all overlapping ones. [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]. The single most-used interval routine in practice — calendar dedup, memory-range coalescing, genomic span cleanup all run exactly this.

**The insight.** Sort by start. Now sweep, maintaining one **open span** — the interval currently being built. Each next interval, thanks to the sort, can only relate to the open span two ways: its start falls inside (start ≤ openEnd — it overlaps or touches; extend the span's end with max) or beyond it (a gap — the open span is finished forever; emit it, open a new one). Nothing else is possible: the sort guarantees no *later* interval can reach back and touch an emitted span, because later starts only grow. That guarantee — emitted means safe — is the entire correctness argument, and it is worth saying in exactly those words. Without the sort, any interval might touch any other (all-pairs, O(n²) unions); the sort is what collapses geometry into adjacency.

**The max-not-assign detail.** Extending must take max(openEnd, end), not assign: [[1,10],[2,3]] — the swallowed [2,3] must not *shrink* the open span to 3. Containment is the case that catches assignment bugs, and interviewers know it.

**The walk-through.** Sorted [[1,3],[2,6],[8,10],[15,18]]: open [1,3]; 2 ≤ 3 → extend to [1,6]; 8 > 6 → emit, open [8,10]; 15 > 10 → emit, open [15,18]; emit. Three spans.

**Complexity.** O(n log n) for the sort, O(n) sweep, O(n) output. The sort dominates and is the honest headline.

**Kinship.** Partition Labels (last chapter) was secretly this — letter spans merged into clusters; and Insert Interval is this problem's phase two running once. The interval toolkit is small and heavily interlinked; three problems in, you have most of it.

**The thread.** Merging makes peace by *union*. The next problem makes peace by *eviction* — remove the fewest intervals so none overlap — and the right greedy choice (keep the earliest ender) comes with the chapter's classic proof.`,
    },
    {
      slug: "non-overlapping-intervals",
      title: "Non Overlapping Intervals",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/non-overlapping-intervals",
      summary: "Fewest removals = total minus the most you can keep — and earliest-end-first keeps the most.",
      body: `**The problem.** Remove the minimum number of intervals so the rest never overlap (touching endpoints are fine here). [[1,2],[2,3],[3,4],[1,3]] → 1 (drop [1,3]).

**The reframe.** "Fewest removed" = n − "most kept," and *most kept non-overlapping intervals* is the classic **activity selection** problem — the founding example of greedy algorithms in every textbook, arriving here with its interval costume on. Solve the keeping problem; subtract at the end.

**The greedy and its proof.** Sort by **end time**. Sweep, keeping any interval that starts at or after the end of the last kept one; skip (i.e. remove) the rest. Why earliest-end and not, say, shortest, or earliest-start? The exchange argument, in full, because this is *the* place to know it: consider any optimal kept-set, and compare its first interval with the greedy's first (the global earliest ender). Swapping the greedy's choice in for the optimal's first can never hurt — it ends no later, so everything after the optimal's first still fits after the greedy's. Induct along the sequence: an optimal solution exists agreeing with greedy everywhere. Earliest end *frees the future fastest*; that phrase is the whole intuition. (Counterexamples kill the rivals: earliest-start loses to one huge early interval; shortest loses to a small one bridging two big ones.)

**The walk-through.** Sorted by end: [1,2],[2,3],[1,3],[3,4]. Keep [1,2]; [2,3] starts at 2 ≥ 2 → keep; [1,3] starts at 1 < 3 → remove; [3,4] starts at 3 ≥ 3 → keep. Kept 3 of 4 → removals 1.

**The equivalent phrasing.** Sorting by end and *counting overlaps as you evict* gives the same number directly — track the last kept end; each interval that starts before it increments the removal count. Same algorithm, bookkeeping inverted; write whichever narrates better.

**Complexity.** O(n log n) sort, O(n) sweep, O(1) extra.

**The thread.** Yes/no overlap next, in its purest form — Meeting Rooms, the one-person calendar — and then its famous sequel asks *how many calendars* you need.`,
    },
    {
      slug: "meeting-rooms",
      title: "Meeting Rooms",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/meeting-schedule",
      summary: "One person, many meetings: sort by start and check each neighbour pair — any overlap means no.",
      body: `**The problem.** Given meeting intervals, can one person attend them all? Equivalently: are the intervals pairwise non-overlapping? [[0,30],[5,10],[15,20]] → false; [[7,10],[2,4]] → true. (In this problem's convention, one meeting ending exactly as the next starts is fine — attendance is possible back-to-back.)

**The insight.** The all-pairs question collapses, once sorted by start, into a **neighbours-only** question: if any two intervals overlap at all, then in sorted order some *adjacent* pair overlaps. Why: take an overlapping pair with the fewest intervals between them; the earlier one's span covers the start of everything up to its partner (starts are sorted), so the pair immediately next to it already overlaps — contradiction unless adjacent. In practice you never recite that; you rely on the simpler direct fact: after sorting, meeting i+1 conflicts with the schedule iff it starts before meeting i ends — because meeting i is the *latest-starting* thing before it, and under sortedness (with disjointness so far) also the latest-*ending* relevant one. One pass, one comparison per step: interval[i+1].start < interval[i].end → false. Survive the sweep → true.

**The walk-through.** Sorted [[0,30],[5,10],[15,20]]: 5 < 30 → clash immediately → false. Sorted [[2,4],[7,10]]: 7 ≥ 4 → fine → true.

**Why an Easy sits this deep in the atlas.** Placement, not difficulty: it is the *skeleton* of the previous two problems (Merge's sweep without the merging; Non-overlapping's sweep without the eviction), and the setup for its sequel, which is the real interview staple. It also carries the chapter's etiquette lesson one more time: the strictness of the comparison (< versus ≤) *is* the touching-endpoints convention — name the assumption before writing the operator.

**Complexity.** O(n log n) sort, O(n) sweep, O(1) space.

**The thread.** One room, yes or no. The sequel: everyone keeps their meetings — how many rooms must exist? Counting simultaneous overlap needs a genuinely new tool, and there are two lovely ones.`,
    },
    {
      slug: "meeting-rooms-ii",
      title: "Meeting Rooms II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/meeting-schedule-ii",
      summary: "Peak simultaneous meetings: a min-heap of end times, or the +1/−1 event sweep — know both.",
      body: `**The problem.** Same meetings, new question: the minimum number of rooms so every meeting happens as scheduled. [[0,30],[5,10],[15,20]] → 2. This is *the* intervals interview question, and it is really asking: what is the **maximum number of meetings alive at one instant**?

**Tool one — the end-time min-heap.** Sort by start; the heap holds the end times of meetings currently occupying rooms. For each meeting: if the earliest-ending room (heap root) frees up before this meeting starts (root ≤ start), that room is reusable — pop it; either way push this meeting's end. The heap's size after the sweep's high-water mark — in the standard formulation, its final size, since rooms are only conceptually reused, never destroyed — is the answer. Greedy choice embedded: always reuse the room freeing *earliest*; if even that one is busy, no room is free, and a new one is genuinely forced. Chapter eight's structure carrying chapter fifteen's argument, inside chapter sixteen's geometry: the atlas converging.

**Tool two — the event sweep.** Forget rooms; count *concurrency*. Explode each meeting into two events: (start, +1) and (end, −1). Sort events by time — ends before starts on ties, so back-to-back meetings share a room. Sweep, keeping a running sum; its **peak** is the answer. This is a prefix sum over time — chapter one's oldest idea — and it generalises effortlessly (max CPU load, plane-seat overlap, staffing curves). Equivalent formulation: sort starts and ends in two separate arrays and two-pointer through them; same events, different clothes.

**The walk-through (events).** [0,+1], [5,+1], [10,−1], [15,+1], [20,−1], [30,−1]: running 1, 2, 1, 2, 1, 0 — peak **2**.

**Complexity.** Both tools O(n log n) time, O(n) space. Offer both; pick the sweep for elegance, the heap when the follow-up wants *which* room each meeting gets (the heap hands out identities naturally).

**The thread.** Counting concurrency conquered. The finale composes the whole chapter — intervals sorted, queries sorted, a heap in the middle — to answer many questions in one pass: offline processing.`,
    },
    {
      slug: "minimum-interval-to-include-each-query",
      title: "Minimum Interval to Include Each Query",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/minimum-interval-including-query",
      summary: "Sort intervals and queries together, sweep once: a heap keyed by size holds the candidates — offline processing.",
      body: `**The problem.** Intervals, and a list of query points: for each query, the **size** of the smallest interval containing it (size = right − left + 1), or −1. Answers must return in the original query order. Intervals [[1,4],[2,4],[3,6],[4,4]], queries [2,3,4,5] → [3,3,1,4].

**Why per-query scanning dies.** Each query scanning all intervals is O(n·q). The unlock is noticing the problem is **offline**: all queries are known up front, so nothing forces you to answer them in the order asked. Sort the queries, answer them in sorted order, and deliver results re-mapped to the original order at the end (a hash map from query value to answer — queries may repeat, and the map handles that too). Offline reordering is a genuine technique with a name, used by databases and competitive programmers alike; recognising "I may reorder the questions" *is* the hard part of this Hard.

**The sweep.** Sort intervals by start. Walk queries ascending, maintaining a min-heap of **candidate intervals keyed by size**. Per query q: first, *admit* — push every not-yet-admitted interval whose start ≤ q (the interval pointer only moves forward across the whole sweep; each interval is admitted once, ever). Then, *evict* — pop from the heap while its top has end < q: that interval is expired, and here is the argument that makes eviction safe: queries only *grow* from here, so an interval too far left for this query is too far left for every future one. Dead is dead — the same "retired forever" reasoning as Two Sum II, eleven chapters later. Finally, *read* — the surviving top is the smallest-sized interval covering q (it was admitted, so start ≤ q; it survived eviction, so end ≥ q); empty heap → −1.

**The walk-through.** Queries sorted [2,3,4,5]. q=2: admit [1,4],[2,4]; top size 3 → 3. q=3: admit [3,6]; top still 3 → 3. q=4: admit [4,4]; top size 1 → 1. q=5: evict [4,4],[1,4],[2,4] (ends < 5); top [3,6] size 4 → 4. Remap → [3,3,1,4].

**Complexity.** O(n log n + q log q + (n + q) log n) — sorts plus each interval pushed and popped at most once. Space O(n + q).

**The thread.** Intervals close with the atlas's favourite move: three old tools, one new posture. Two chapters remain — Math & Geometry's grab-bag of grids and digits, then the bit-level finale.`,
    },
  ],
};
