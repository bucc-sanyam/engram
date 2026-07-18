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
      body: `**The problem.** Design a class: initialised with k and some numbers, then add(x) is called repeatedly — each call inserts a value and must return the kth largest value seen *so far*. A stream, not an array: numbers keep coming, and the answer must stay fresh.

**Why re-sorting loses.** Sorting on every add is O(n log n) per call, on data that changed by one element. The stream setting is precisely where recompute-from-scratch dies and *maintain-an-invariant* wins.

**The insight — the elite club.** You never need most of the numbers. The kth largest is determined entirely by the top k values; everything below them is noise, forever (a number that falls out of the top k can never re-enter it — newcomers only push the bar up). So maintain just the club of the k best. The question "who is the kth largest?" then becomes "who is the *weakest member* of the club?" — and a structure whose specialty is exposing its minimum is exactly right: a **min-heap**, capped at size k. The root — the club's weakest — *is* the kth largest overall. That inversion (min-heap to track largest) trips everyone once; internalise the phrasing "the gatekeeper is the weakest elite" and it never trips you again.

**The choreography.** add(x): push x, and if the heap exceeds k, pop the root — the weakest is expelled. Return the root. Alternatively, when full: compare x to the root first, and only swap in if x beats it. Either way each add is O(log k), and the answer is a peek.

**The walk-through.** k = 3, seed [4, 5, 8, 2] → club is {4, 5, 8}, root 4 — the third largest. add(3): 3 < 4, club unchanged → 4. add(10): 10 enters, 4 expelled → club {5, 8, 10}, answer 5.

**Complexity.** O(log k) per add, O(k) space — independent of the stream's length, which is the entire victory.

**The thread.** Hold the size-k min-heap trick; two problems from now it returns for geometry. First, a lighter interlude — Last Stone Weight, where the heap plays demolition derby.`,
    },
    {
      slug: "last-stone-weight",
      title: "Last Stone Weight",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/last-stone-weight",
      summary: "Repeatedly smash the two heaviest stones — a simulation that is only fast if extremes are cheap.",
      body: `**The problem.** Stones with weights. Repeatedly take the *two heaviest*, smash them together: equal weights annihilate both; unequal leaves one stone of the difference. Continue until at most one stone remains; report its weight (or 0).

**The insight.** The rules are given; the algorithm *is* the simulation. The entire question is the data structure: every round needs the two current maxima, and the smash may insert a new stone that can immediately be among the heaviest. A sorted array re-sorts per round (O(n log n) each); a max-heap serves each round in three O(log n) moves — pop, pop, maybe push. This is the heap's home turf: **repeated extraction of the extreme from a changing population**. When you see "repeatedly take the biggest/smallest, transform, reinsert," the priority queue should reach your hand before the problem finishes stating itself.

**The min-heap-only wrinkle.** Several standard libraries ship only min-heaps. The idiom: store *negated* weights — the most negative is the heaviest, and every pop/push negates on the way through. Trivial once seen, disorienting the first time; this problem exists partly to make you see it.

**The walk-through.** [2, 7, 4, 1, 8, 1]. Pop 8, 7 → smash → push 1: [4, 2, 1, 1, 1]. Pop 4, 2 → push 2: [2, 1, 1, 1]. Pop 2, 1 → push 1: [1, 1, 1]. Pop 1, 1 → annihilate: [1]. Answer 1.

**Complexity.** O(n log n) — at most n − 1 smashes, each O(log n) — plus O(n) to build the heap (building all at once by sifting is genuinely O(n), a classic fact worth citing). Space O(n).

**A wider note.** Event-driven simulations — schedulers, physics engines, discrete-event models — are all this loop at scale: a priority queue of pending events, always processing the most urgent next. This toy is their skeleton.

**The thread.** Back to the elite club: K Closest Points to Origin is Kth-Largest-in-a-Stream's trick pointed at 2-D geometry — with one inversion to keep you honest about which way the heap must face.`,
    },
    {
      slug: "k-closest-points-to-origin",
      title: "K Closest Points to Origin",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/k-closest-points-to-origin",
      summary: "Keep k candidates in a max-heap keyed on distance — evict the farthest whenever a closer one arrives.",
      body: `**The problem.** Given points on a plane, return the k closest to the origin. The output is a *set* of k points, any order — a hint that full sorting is overkill.

**One tiny optimisation first.** Comparing distances needs no square roots: if x² + y² beats the other point's x² + y², the true distances agree — squaring is monotone on non-negatives. Skipping sqrt avoids floating-point entirely; small, but interviewers notice.

**The insight.** Same elite-club structure as Kth Largest in a Stream, *mirrored*. There, you kept the k largest, so the gatekeeper was the club's minimum. Here you keep the k **closest**, so the gatekeeper is the club's **farthest** member — a **max**-heap on distance, capped at k. Stream the points through: push each; when size exceeds k, pop the root, expelling the current farthest. Survivors at the end are exactly the k closest. Being able to *derive* the heap's direction — "I keep the best k, so I evict from the worst end, so the heap exposes the worst" — rather than memorising it, is the skill this problem certifies. Say the derivation aloud in interviews; it lands.

**The walk-through.** Points (1,3), (−2,2), (5,8), (0,1), k = 2. Squared distances: 10, 8, 89, 1. Push 10, push 8. Push 89 → size 3 → expel 89. Push 1 → expel 10. Club: {8, 1} → points (−2,2) and (0,1).

**Complexity.** O(n log k) time, O(k) space — versus O(n log n) for sort-everything. When k is small (the usual case: "top 10 of ten million"), that gap is enormous. Alternatives worth naming: heapify-all-then-pop-k is O(n + k log n); quickselect (next problem's star) reaches O(n) average when the data sits in memory. The size-k heap's unique virtue: it *streams* — n never needs to fit in memory at once.

**The thread.** Quickselect has now been name-dropped twice. Kth Largest Element in an Array, next, gives it the stage — heap versus partition, and when each deserves to win.`,
    },
    {
      slug: "kth-largest-element-in-an-array",
      title: "Kth Largest Element in an Array",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/kth-largest-element-in-an-array",
      summary: "Heap gives O(n log k); quickselect partitions its way to O(n) average — know both, argue the trade.",
      body: `**The problem.** Find the kth largest element of an array — no stream this time, all data in hand. That one change reshuffles the leaderboard of solutions, and *discussing the reshuffle* is what the interviewer actually wants.

**Option one: the heap, again.** Size-k min-heap, exactly as in the stream problem: O(n log k) time, O(k) space, ten lines. Given the array is static, you are not using the heap's superpower (surviving updates) — you are just borrowing its economy. Perfectly good answer; not the interesting one.

**Option two: quickselect.** Recall quicksort's partition step: pick a pivot, sweep once, and land it at its final sorted position — everything larger on one side, smaller on the other. Quicksort recurses on *both* sides. But you only need one position (index k − 1 in descending terms) — so recurse only on **the side containing it**. If the pivot lands exactly at k − 1, done; landed too far left, hunt in the right part; too far right, hunt left. Halving-in-expectation work on one side gives n + n/2 + n/4 + … = **O(n) average** — the geometric series argument, and the reason quickselect is the textbook answer for "selection."

**The honesty clause.** Worst case is O(n²) — adversarial pivots, sorted inputs with naive pivot choice. Randomised pivots make the bad case vanish in practice (and median-of-medians guarantees O(n) at real constant-factor cost — cite it, never implement it live). Quickselect also *mutates* the array and does not stream; the heap does neither harm. There is no single winner — there is a table of trade-offs, and reciting it fluently is the senior move.

**The walk-through.** [3,2,1,5,6,4], k = 2. Pivot 4 → partition: [6,5 | 4 | 3,2,1]; 4 sits at index 2, we want index 1 → recurse left on [6,5]. Pivot 5 → [6 | 5]; 5 at index 1 → answer 5.

**Complexity.** Heap O(n log k)/O(k); quickselect O(n) average, O(1) extra space, in place.

**The thread.** From pure selection to selection under *constraints*: Task Scheduler, next, repeatedly picks the best available task — with a cooldown rule that forces the heap to work alongside a waiting room.`,
    },
    {
      slug: "task-scheduler",
      title: "Task Scheduler",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/task-scheduling",
      summary: "Always run the most-remaining task that is off cooldown — a heap plus a cooldown queue, tick by tick.",
      body: `**The problem.** Tasks labelled A–Z, each taking one time unit; identical tasks must sit at least n units apart. Idling is allowed. Find the minimum total time. ["A","A","A","B","B","B"], n = 2 → 8: A B idle A B idle A B.

**The greedy intuition.** The scarce resource is *time slots for your most frequent task* — its copies must spread out, and everything else tucks into the gaps. So at every tick, among tasks currently off cooldown, run the one with the **most remaining copies**: it is the one whose deadlines are tightest, and deferring it can only push the schedule longer. "Most remaining" on a changing population — that is a max-heap keyed on remaining count (counts come from a chapter-one frequency map; the labels themselves never matter).

**The machinery.** Two structures in conversation. The **ready heap** holds runnable task counts. A **cooldown queue** holds tasks serving their n-tick sentence, each stamped with the tick they become ready. Per tick: release anything whose stamp has matured back into the heap; pop the heap and run one unit of the best task (decrement; if copies remain, into the cooldown queue with stamp now + n); if the heap was empty, the tick is an idle — time passes anyway. The queue matures in stamp order — arrivals are chronological — so releases pop cleanly off its front.

**The walk-through.** A×3, B×3, n = 2. Tick 1: run A (A cools till 4). Tick 2: run B. Tick 3: heap empty — idle. Tick 4: A returns, run A. The cycle repeats: total 8 ticks.

**The closed-form footnote.** A pure-math answer exists: (maxFreq − 1)·(n + 1) + (number of tasks tying maxFreq), floored at the task count. It falls out of picturing the most-frequent task's copies as fence posts with gap-sized buckets between. Derive it after the simulation, as a bonus — the simulation generalises (heterogeneous durations, priorities); the formula does not.

**Complexity.** O(total ticks × log 26) — effectively linear; space O(26).

**The thread.** One heap scheduling one machine. Design Twitter, next, aims k heaps' worth of machinery at a systems problem: merging friends' timelines into a feed.`,
    },
    {
      slug: "design-twitter",
      title: "Design Twitter",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/design-twitter-feed",
      summary: "Follow sets in hash maps, tweets in per-user lists, and a heap merging the 10 freshest — a feed in miniature.",
      body: `**The problem.** Build a toy Twitter: postTweet(user, id), follow(a, b), unfollow(a, b), and getNewsFeed(user) — the 10 most recent tweet ids across the user and everyone they follow. A composition exam: no single structure suffices, and the design *is* the answer.

**The inventory.** Chapter-one reflexes cover the social graph: a hash map from user → *set* of followees (sets make unfollow O(1) and duplicates impossible; remember users implicitly see their own tweets — the classic forgotten case). Tweets: a map from user → list of (timestamp, id), appended in posting order — so each user's list is **already sorted by recency**, newest at the tail, for free. A global monotonic counter stands in for time.

**The feed is the algorithm.** getNewsFeed asks: given up to N sorted-by-recency lists (one per followee), produce the 10 freshest overall. Read that sentence again — it is **Merge K Sorted Lists** from chapter six, with k = the follow count and only 10 outputs wanted. Max-heap seeded with each followee's newest tweet; pop the freshest overall, then push the *next-newest from that same author*; repeat 10 times. Each pop is O(log k), and you never touch more than ~10 + k tweets, no matter that the archive holds millions. The stop-after-10 is what makes the heap the right call over flatten-and-sort.

**The walk-through.** User 1 follows 2. Tweets: u1 posts 5; u2 posts 6 then 8. Feed(1): heap seeds {u1's 5, u2's 8} → pop 8, push u2's 6 → pop 6 → pop 5. Feed: [8, 6, 5].

**Complexity.** post/follow/unfollow O(1); feed O(k + 10 log k). Real Twitter's fan-out-on-write versus fan-out-on-read debate is *literally this trade-off* at planet scale — mentioning that turns a toy into a systems conversation.

**The thread.** Every heap so far pointed one direction. The finale points two at once: Find Median from a Data Stream, where a max-heap and a min-heap lean against each other and the median lives in the crack.`,
    },
    {
      slug: "find-median-from-data-stream",
      title: "Find Median From Data Stream",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/find-median-in-a-data-stream",
      summary: "Two heaps holding each half of the data, balanced within one element — the median lives at their facing roots.",
      body: `**The problem.** Numbers arrive one at a time; at any moment, report the median — the middle value, or the average of the two middles. addNum and findMedian, both fast, forever. The median is the awkward statistic: min and max are heap-native, but the *middle* moves unpredictably with every arrival.

**The insight.** The median is where the lower half of the data meets the upper half. So *store the halves*: a **max-heap holding the lower half** (its root: the largest small number) and a **min-heap holding the upper half** (its root: the smallest large number). The two roots face each other across the cut, and the median is read off them in O(1): the bigger half's root when counts are odd, the average of both roots when even. Every earlier problem capped a heap's size; this one splits the population between two heaps and lets *balance* be the invariant.

**Two invariants, and the dance.** One: ordering — every element in the low heap ≤ every element in the high heap. Two: balance — sizes differ by at most one. addNum maintains both with a fixed two-step: push into the low heap if the number is ≤ its root, else into the high heap (ordering preserved by construction); then, if either heap outgrows the other by two, move one root across the gap (balance restored — and ordering survives, because the element that crosses is by definition adjacent to the cut). Each add: a constant number of O(log n) heap moves.

**The walk-through.** Stream 5, 2, 8, 1. Add 5 → low {5}; median 5. Add 2 → low {5, 2}; sizes 2/0 → rebalance, 5 crosses → low {2}, high {5}; median 3.5. Add 8 → high {5, 8}; median 5. Add 1 → low {2, 1}; median (2 + 5)/2 = 3.5.

**Complexity.** O(log n) per add, O(1) per median, O(n) space. Follow-ups worth having thoughts on: values in a known small range → counting buckets; "median of the last k only" → sliding-window medians, genuinely harder (lazy deletion or order-statistics trees).

**The thread.** Chapter closed: one heap, sized heaps, dueling heaps. Next the atlas returns to recursion and turns it outward — Backtracking, where the tree you traverse is the tree of *your own choices*, and unchoosing is the essential move.`,
    },
  ],
};
