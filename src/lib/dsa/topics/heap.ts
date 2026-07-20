import type { DsaTopic } from "../types";

/** Chapter 8 — Heap / Priority Queue: always knowing the extreme. */
export const heap: DsaTopic = {
  slug: "heap",
  title: "Heap / Priority Queue",
  chapter: 8,
  tagline: "A tree flattened into an array, promising one thing forever: the extreme element, on demand.",
  color: "#ffb86b",
  prereqs: ["trees"],
  unlocks: ["intervals", "greedy", "advanced-graphs"],
  intro: `Sorting answers every question about order, but it charges O(n log n) up front and goes stale the moment data changes. Very often you need far less: not the full ranking — just *the* minimum, or *the* maximum, right now, with elements arriving and leaving constantly. The heap is the structure that sells exactly that and nothing more: push in O(log n), pop-the-extreme in O(log n), peek in O(1). Buying less lets it charge less, forever, under churn — the quality sorting cannot offer.

Under the hood it is the prettiest engineering compromise in this atlas. A heap is a *complete* binary tree — every level full, last level packed left — obeying one lax rule: each parent outranks its children. No left-right ordering like a BST, no global sortedness; sibling order is chaos, and that looseness is the point, because a weaker promise is cheaper to maintain. Completeness buys something even better: the tree needs no pointers at all. Number the nodes level by level and drop them in a flat array — the children of slot i live at 2i+1 and 2i+2, the parent at (i−1)/2. Push appends and *bubbles up*; pop swaps the last element into the root and *sifts down*. A tree you learned in chapter seven, wearing an array from chapter one.

The problems build a very deliberate skill: **choosing what the heap holds, which way it points, and how big it stays**. The counterintuitive workhorse — used in three of the seven problems — is keeping a *min*-heap of size k to track the k *largest* things: the root is the gatekeeper, the weakest member of the elite, and newcomers only enter by beating it. Kth Largest in a Stream introduces the trick; K Closest Points aims it at distances; Kth Largest in an Array contrasts it with quickselect. Last Stone Weight is the warm-up simulation, Task Scheduler adds greedy scheduling under cooldowns, and Design Twitter composes heaps with hash maps into a real feed system. The finale, Find Median from a Data Stream, is the chapter's signature move: *two* heaps leaning against each other, holding the median between them.

On the roadmap, Heap unlocks Intervals, Greedy, and Advanced Graphs — the last because Dijkstra's algorithm is, at its core, a heap deciding which frontier node to expand next.`,
  problems: [
    {
      slug: "kth-largest-element-in-a-stream",
      title: "Kth Largest Element in a Stream",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/kth-largest-integer-in-a-stream",
      summary: "A min-heap of size k: the root is the bar every newcomer must clear — and also the answer.",
      body: `**Signal.** "Each add(x) must return the kth largest value seen *so far*" — a running order statistic over a growing stream, queried after every insertion, is the tell that you need a maintained invariant, not a recompute-from-scratch.

**Brute force.** Keep every number seen so far and re-sort on every add — O(n log n) per call, on data that changed by exactly one element. The stream setting is precisely where recompute-from-scratch dies.

**Optimal approach.** You never need most of the numbers. The kth largest is determined entirely by the top k values; everything below them is noise, forever (a number that falls out of the top k can never re-enter it). So maintain just the club of the k best. "Who is the kth largest?" becomes "who is the *weakest member* of the club?" — a structure whose specialty is exposing its minimum: a **min-heap**, capped at size k. The root — the club's weakest — *is* the kth largest overall. add(x): push x, and if the heap exceeds k, pop the root. Return the root. That inversion (min-heap to track largest) trips everyone once; internalise "the gatekeeper is the weakest elite" and it never trips you again.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "4 (root — kth largest)", "children": ["c1", "c2"], "highlight": true },
    { "id": "c1", "label": "5" },
    { "id": "c2", "label": "8" }
  ],
  "rootId": "root",
  "caption": "Kth Largest Element in a Stream — the size-3 min-heap club {4, 5, 8}; the root is the weakest member of the elite, and the answer."
}
\`\`\`

**Complexity.** O(log k) per add, O(k) space — versus the resort-everything O(n log n) per call, independent of the stream's length.

**Thread.** Hold the size-k min-heap trick; two problems from now it returns for geometry. First, a lighter interlude — Last Stone Weight, where the heap plays demolition derby.`,
    },
    {
      slug: "last-stone-weight",
      title: "Last Stone Weight",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/last-stone-weight",
      summary: "Repeatedly smash the two heaviest stones — a simulation that is only fast if extremes are cheap.",
      body: `**Signal.** "Repeatedly take the two heaviest, smash them, continue" — "repeatedly extract the extreme from a changing population" is close to a direct definition of what a heap is for; the priority queue should reach your hand before the problem finishes stating itself.

**Brute force.** Keep the stones in a plain array (or sorted list) and re-sort or re-scan for the two maxima after every smash — O(n log n) per round if sorting, O(n) per round if scanning, and either way the whole collection is touched again for one insertion's worth of change.

**Optimal approach.** A max-heap serves each round in three O(log n) moves: pop the heaviest, pop the next heaviest, and — if they weren't equal — push the difference back in. Several standard libraries ship only min-heaps; the idiom is to store *negated* weights, so the most negative is the heaviest, negating again on the way out.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 7, 4, 1, 8, 1], "note": "Max-heap of all stones: [2,7,4,1,8,1]." },
    { "cells": [4, 2, 1, 1, 1], "note": "Pop 8 and 7 (the two heaviest), smash → difference 1, push it back. Heap: [4,2,1,1,1]." },
    { "cells": [2, 1, 1, 1], "note": "Pop 4 and 2, smash → push 2. Heap: [2,1,1,1]." },
    { "cells": [1, 1, 1], "note": "Pop 2 and 1, smash → push 1. Heap: [1,1,1]." },
    { "cells": [1], "highlight": [0], "note": "Pop 1 and 1 — equal weights annihilate both, nothing to push back. Heap: [1]. Answer: 1." }
  ],
  "caption": "Last Stone Weight — a max-heap serves the two current heaviest stones in O(log n) each round, however the population changes."
}
\`\`\`

**Complexity.** O(n log n) — at most n − 1 smashes, each O(log n) — plus O(n) to build the heap (heapify by sifting is genuinely O(n)). Space O(n). Versus the plain-array approach's O(n log n) or O(n) *per round*.

**A wider note.** Event-driven simulations — schedulers, physics engines, discrete-event models — are all this loop at scale: a priority queue of pending events, always processing the most urgent next. This toy is their skeleton.

**Thread.** Back to the elite club: K Closest Points to Origin is Kth-Largest-in-a-Stream's trick pointed at 2-D geometry — with one inversion to keep you honest about which way the heap must face.`,
    },
    {
      slug: "k-closest-points-to-origin",
      title: "K Closest Points to Origin",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/k-closest-points-to-origin",
      summary: "Keep k candidates in a max-heap keyed on distance — evict the farthest whenever a closer one arrives.",
      body: `**Signal.** "Return the k closest points to the origin, any order" — an unordered set of the best k, not a full ranking, is the tell that a capped elite-club heap beats sorting everything.

**Brute force.** Compute every point's distance, sort all n points by distance, take the first k — O(n log n) time, doing full ranking work when only membership in the top k is required.

**Optimal approach.** Comparing distances needs no square roots — squaring is monotone on non-negatives, so x² + y² alone decides order, avoiding floating-point entirely. Same elite-club structure as Kth Largest in a Stream, *mirrored*: there you kept the k largest, so the gatekeeper was the club's minimum; here you keep the k **closest**, so the gatekeeper is the club's **farthest** member — a **max**-heap on distance, capped at k. Stream the points through: push each; when size exceeds k, pop the root, expelling the current farthest. Survivors at the end are exactly the k closest.

\`\`\`viz:array
{
  "frames": [
    { "cells": [10], "note": "Push (1,3), squared distance 10. Heap: {10}." },
    { "cells": [10, 8], "note": "Push (-2,2), squared distance 8. Heap size 2 = k. Root (max): 10." },
    { "cells": [10, 8], "note": "Push (5,8), squared distance 89 — heap grows to size 3, exceeding k. Pop the root (max) — 89 is evicted immediately. Heap unchanged: {10, 8}." },
    { "cells": [8, 1], "note": "Push (0,1), squared distance 1 — heap grows to size 3 again. Pop the root (max) — 10 is evicted. Final club: {8, 1} → points (-2,2) and (0,1)." }
  ],
  "caption": "K Closest Points to Origin — a max-heap capped at k evicts the current farthest point whenever a closer one arrives."
}
\`\`\`

**Complexity.** O(n log k) time, O(k) space — versus O(n log n) to sort everything. When k is small (the usual case: "top 10 of ten million"), that gap is enormous. The size-k heap's unique virtue over quickselect: it *streams* — n never needs to fit in memory at once.

**Thread.** Quickselect has now been name-dropped. Kth Largest Element in an Array, next, gives it the stage — heap versus partition, and when each deserves to win.`,
    },
    {
      slug: "kth-largest-element-in-an-array",
      title: "Kth Largest Element in an Array",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/kth-largest-element-in-an-array",
      summary: "Heap gives O(n log k); quickselect partitions its way to O(n) average — know both, argue the trade.",
      body: `**Signal.** "Find the kth largest element" — no stream this time, all data in hand. That one change reshuffles the leaderboard of solutions, and *discussing the reshuffle* is what the interviewer actually wants.

**Brute force.** Sort the whole array and index k − 1 from the top — O(n log n) time. Correct, and it fully ranks n − k elements nobody asked about.

**Option one (still valid): the heap.** Size-k min-heap, exactly as in the stream problem: O(n log k) time, O(k) space. Given the array is static, you are not using the heap's superpower (surviving updates) — you are just borrowing its economy.

**Optimal approach: quickselect.** Recall quicksort's partition step: pick a pivot, sweep once, and land it at its final sorted position — everything larger on one side, smaller on the other. Quicksort recurses on *both* sides; you only need one position, so recurse only on **the side containing it**. If the pivot lands exactly at the target index, done; otherwise hunt in whichever side must contain it. Halving-in-expectation work on one side gives n + n/2 + n/4 + … = **O(n) average**. Worst case is O(n²) with adversarial pivots — randomised pivots make the bad case vanish in practice (median-of-medians guarantees O(n) worst-case at real constant-factor cost — cite it, never implement it live). Quickselect also *mutates* the array and does not stream; the heap does neither harm.

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 2, 1, 5, 6, 4], "note": "Array with pivot value 4 (chosen as the last element)." },
    { "cells": [6, 5, 4, 3, 2, 1], "highlight": [2], "note": "Partition around 4 (descending: bigger left, smaller right): [6,5 | 4 | 3,2,1]. Pivot lands at index 2; the target (k=2, index 1) is to its left → recurse into [6,5]." },
    { "cells": [6, 5], "highlight": [1], "note": "Pivot 5 (last element): partition gives [6 | 5]. 5 lands at index 1 — exactly the target. Answer: 5." }
  ],
  "caption": "Kth Largest Element in an Array — quickselect only recurses into the half that must contain the target index."
}
\`\`\`

**Complexity.** Heap: O(n log k), O(k) space. Quickselect: O(n) average, O(1) extra space, in place — versus the O(n log n) full-sort brute force. There is no single winner — reciting the trade-off table fluently is the senior move.

**Thread.** From pure selection to selection under *constraints*: Task Scheduler, next, repeatedly picks the best available task — with a cooldown rule that forces the heap to work alongside a waiting room.`,
    },
    {
      slug: "task-scheduler",
      title: "Task Scheduler",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/task-scheduling",
      summary: "Always run the most-remaining task that is off cooldown — a heap plus a cooldown queue, tick by tick.",
      body: `**Signal.** "Identical tasks must sit at least n units apart — minimum total time" — a scarce resource (slots for the most frequent task) that must be spread out, with everything else filling gaps, is the tell for a greedy "run the tightest deadline first" rule, maintained by a heap.

**Brute force.** Try every valid ordering of tasks respecting the cooldown constraint and take the shortest — combinatorially infeasible; worth naming only to motivate the greedy shortcut.

**Optimal approach.** At every tick, among tasks currently off cooldown, run the one with the **most remaining copies** — it's the one whose deadlines are tightest, and deferring it can only push the schedule longer. "Most remaining, on a changing population" is a max-heap keyed on remaining count (counts come from a chapter-one frequency map; labels never matter). Two structures in conversation: the **ready heap** holds runnable task counts; a **cooldown queue** holds tasks serving their n-tick sentence, each stamped with the tick they become ready. Per tick: release anything whose stamp has matured back into the heap; pop the heap and run one unit of the best task (if copies remain, into the cooldown queue with stamp now + n); if the heap was empty, the tick is idle.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["A:3", "B:3"], "note": "Ready heap: A and B both have 3 remaining. Tick 1: run the most-remaining task, A — A now cools until tick 4." },
    { "cells": ["B:3"], "note": "Tick 2: only B is ready (A is cooling) → run B. B cools until tick 5." },
    { "cells": [], "note": "Tick 3: the ready heap is empty — both A and B are cooling. Idle tick; time still passes." },
    { "cells": ["A:2"], "highlight": [0], "note": "Tick 4: A returns to the ready heap → run A. The cycle repeats identically; total time: 8 ticks." }
  ],
  "caption": "Task Scheduler — A×3, B×3, cooldown n=2: the ready heap always serves the most-remaining off-cooldown task."
}
\`\`\`

**A closed-form footnote.** (maxFreq − 1)·(n + 1) + (number of tasks tying maxFreq), floored at the task count, falls out of picturing the most-frequent task's copies as fence posts with gap-sized buckets between. Derive it after the simulation — the simulation generalises (heterogeneous durations, priorities), the formula does not.

**Complexity.** O(total ticks × log 26) — effectively linear; space O(26) — versus the infeasible brute-force enumeration.

**Thread.** One heap scheduling one machine. Design Twitter, next, aims k heaps' worth of machinery at a systems problem: merging friends' timelines into a feed.`,
    },
    {
      slug: "design-twitter",
      title: "Design Twitter",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/design-twitter-feed",
      summary: "Follow sets in hash maps, tweets in per-user lists, and a heap merging the 10 freshest — a feed in miniature.",
      body: `**Signal.** "getNewsFeed returns the 10 most recent tweet ids across the user and everyone they follow" — merging several already-recency-sorted sources into one bounded top-N output is the tell that this is Merge K Sorted Lists wearing a social-network costume.

**Brute force.** Collect every tweet from the user and everyone they follow into one list, sort it by timestamp, take the top 10 — O(m log m) where m is the total tweet count across all followees, redoing a full sort when only 10 outputs are ever needed.

**Optimal approach.** Chapter-one reflexes cover the social graph: a hash map from user → *set* of followees (sets make unfollow O(1); remember users implicitly see their own tweets). Tweets: a map from user → list of (timestamp, id), appended in posting order — so each user's list is already sorted by recency, newest at the tail, for free. getNewsFeed is then: given up to N sorted-by-recency lists (one per followee), produce the 10 freshest overall — Merge K Sorted Lists with k = the follow count and only 10 outputs wanted. Max-heap seeded with each followee's newest tweet; pop the freshest overall, then push the *next-newest from that same author*; repeat 10 times.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "u1", "label": "user1: [5]", "row": 0, "col": 0 },
    { "id": "u2", "label": "user2: [6, 8]", "row": 1, "col": 0 },
    { "id": "feed", "label": "feed: [8, 6, 5]", "row": 0.5, "col": 1 }
  ],
  "edges": [
    { "from": "u1", "to": "feed" },
    { "from": "u2", "to": "feed" }
  ],
  "caption": "Design Twitter — user1 follows user2. The heap seeds each followee's newest tweet (5 and 8), pops the freshest, pulls the next tweet from that same author (6), and repeats — same shape as merging k sorted lists."
}
\`\`\`

**Complexity.** post/follow/unfollow O(1); feed O(k + 10 log k), where k is the follow count — versus the brute force's O(m log m) over the full tweet archive. Real Twitter's fan-out-on-write versus fan-out-on-read debate is *literally this trade-off* at planet scale.

**Thread.** Every heap so far pointed one direction. The finale points two at once: Find Median from a Data Stream, where a max-heap and a min-heap lean against each other and the median lives in the crack.`,
    },
    {
      slug: "find-median-from-data-stream",
      title: "Find Median From Data Stream",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/find-median-in-a-data-stream",
      summary: "Two heaps holding each half of the data, balanced within one element — the median lives at their facing roots.",
      body: `**Signal.** "Report the median after every addNum, forever" — min and max are heap-native, but the *middle* moves unpredictably with every arrival, which is the tell that you need two heaps splitting the population, not one heap capped at a size.

**Brute force.** Keep all numbers in a sorted array (insertion sort into place, or full re-sort on each add) and read the middle directly — O(n) per insertion to maintain sorted order, on a stream where the answer is needed after every single element.

**Optimal approach.** The median is where the lower half of the data meets the upper half. *Store the halves*: a **max-heap holding the lower half** (its root: the largest small number) and a **min-heap holding the upper half** (its root: the smallest large number). The two roots face each other across the cut, and the median is read off them in O(1). Two invariants: ordering (every element in the low heap ≤ every element in the high heap) and balance (sizes differ by at most one). addNum maintains both with a fixed two-step: push into the low heap if the number is ≤ its root, else into the high heap; then, if either heap outgrows the other by two, move one root across the gap.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "stream", "label": "Stream so far: 5, 2, 8, 1", "children": ["low-root", "high-root"] },
    { "id": "low-root", "label": "low max-heap root = 2", "children": ["low-child"], "highlight": true },
    { "id": "low-child", "label": "1" },
    { "id": "high-root", "label": "high min-heap root = 5", "children": ["high-child"], "highlight": true },
    { "id": "high-child", "label": "8" }
  ],
  "rootId": "stream",
  "caption": "Find Median From Data Stream — after adding 5, 2, 8, 1: the max-heap holds the lower half (root 2), the min-heap holds the upper half (root 5). Median = average of both roots = (2 + 5) / 2 = 3.5."
}
\`\`\`

**Complexity.** O(log n) per add, O(1) per median, O(n) space — versus O(n) per insertion to keep a fully sorted array. Follow-ups worth having thoughts on: values in a known small range → counting buckets; "median of the last k only" → sliding-window medians, genuinely harder (lazy deletion or order-statistics trees).

**Thread.** Chapter closed: one heap, sized heaps, dueling heaps. Next the atlas returns to recursion and turns it outward — Backtracking, where the tree you traverse is the tree of *your own choices*, and unchoosing is the essential move.`,
    },
  ],
};
