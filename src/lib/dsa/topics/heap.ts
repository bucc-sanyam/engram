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

Under the hood it is a complete binary tree flattened into an array where each parent outranks its children. The children of index $i$ live at $2i+1$ and $2i+2$, while the parent sits at $\lfloor(i-1)/2\rfloor$.`,
  problems: [
    {
      slug: "kth-largest-element-in-a-stream",
      title: "Kth Largest Element in a Stream",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/kth-largest-integer-in-a-stream",
      summary: "A min-heap of size k: the root is the bar every newcomer must clear — and also the answer.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners keep a running array of numbers, append each new streaming number, and re-sort the array descending ($O(N \log N)$ per \`add()\`).
*Why this shatters*: For a stream of $N = 100,000$ numbers, sorting repeatedly takes tens of billions of operations! Re-sorting full arrays on streaming data is too slow.

**The Structural Invariant: Capped Size-K Min-Heap.**
- *The Mind Inversion*: To find the $K$-th **largest** elements, we maintain a **MIN-HEAP** of size $K$!
- *Why Min-Heap?* In a Min-Heap of size $K$, the **root element is the MINIMUM of the $K$ largest elements** (the weakest member of the elite $K$ club).
- **Add Operation**:
  - Push new element into Min-Heap.
  - If \`heap.size() > K\`: Pop the root element (\`heap.pop()\`).
  - The $K$-th largest element is ALWAYS \`heap.peek()\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "4", "label": "4 (root: peek() = 4th largest!)", "children": ["5", "8"], "highlight": true },
    { "id": "5", "label": "5" },
    { "id": "8", "label": "8" }
  ],
  "rootId": "4",
  "caption": "Kth Largest in a Stream — Min-Heap of size K=3 containing elite {4, 5, 8}. Root 4 is the answer."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Why Min-Heap over Max-Heap*: A Max-Heap would store all elements, requiring $O(\log N)$ insertions. A Min-Heap capped at size $K$ takes only $O(\log K)$ time per addition and $O(K)$ space.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why do we use a MIN-HEAP of size K (instead of a MAX-HEAP) to track the K-th LARGEST element?",
          options: [
            "Because Min-Heaps use less RAM than Max-Heaps.",
            "Because the root of a size-K Min-Heap contains the smallest of the top-K elements, which is mathematically the K-th largest overall.",
            "Because Max-Heaps cannot accept stream insertions.",
            "Because Min-Heaps sort elements automatically."
          ],
          correct_index: 1,
          model_answer: "The root of a Min-Heap represents the minimum element inside it. In a heap capped at size K containing the largest elements, that root is precisely the K-th largest element.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity per add() operation using a Min-Heap of size K?",
          model_answer: "O(log K) time per addition because the heap size is capped at K elements.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "last-stone-weight",
      title: "Last Stone Weight",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/last-stone-weight",
      summary: "Repeatedly smash the two heaviest stones — a simulation that is only fast if extremes are cheap.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners sort the stone array, pop the top two, smash them, and re-sort the remaining array ($O(N^2 \log N)$).
*Why this shatters*: Repeatedly re-sorting after every single stone collision causes massive overhead.

**The Structural Invariant: Max-Heap Simulation.**
- Insert all stones into a **Max-Heap**.
- **Smash Loop**: While \`heap.size() > 1\`:
  - Pop \`first = heap.pop()\` (heaviest stone).
  - Pop \`second = heap.pop()\` (second heaviest stone).
  - If \`first != second\`: Push remaining fragment \`first - second\` back into Max-Heap.
- **Result**: Return \`heap.size() == 1 ? heap.pop() : 0\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [8, 7, 4, 2, 1, 1], "note": "Max-Heap: [8, 7, 4, 2, 1, 1]. Pop 8 & 7. Smash: 8 - 7 = 1. Push 1 back." },
    { "cells": [4, 2, 1, 1, 1], "note": "Max-Heap: [4, 2, 1, 1, 1]. Pop 4 & 2. Smash: 4 - 2 = 2. Push 2 back." },
    { "cells": [1], "highlight": [0], "note": "Continue smashing... Heap contains [1]. Final remaining weight = 1." }
  ],
  "caption": "Last Stone Weight — Max-Heap simulation in O(N log N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Negated Numbers Trick*: In standard JavaScript/Python where libraries default to Min-Heap, insert negated weights (\`-weight\`) to simulate a Max-Heap seamlessly!`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the time complexity of Last Stone Weight using a Max-Heap?",
          options: [
            "O(N^2)",
            "O(N log N)",
            "O(N)",
            "O(log N)"
          ],
          correct_index: 1,
          model_answer: "Heapifying N stones takes O(N). We perform at most N-1 smash iterations, each taking O(log N) heap pops/pushes, yielding O(N log N) total time.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "How can a Min-Heap library be used to implement a Max-Heap without writing a custom heap class?",
          model_answer: "Multiply values by -1 before pushing. The smallest negated number corresponds to the largest positive number, effectively turning a Min-Heap into a Max-Heap.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "k-closest-points-to-origin",
      title: "K Closest Points to Origin",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/k-closest-points-to-origin",
      summary: "Keep k candidates in a max-heap keyed on distance — evict the farthest whenever a closer one arrives.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners calculate Euclidean distances $\\sqrt{x^2 + y^2}$ for all $N$ points, sort all points ascending ($O(N \log N)$), and slice the top $K$.
*Why this shatters*: Full sorting does unnecessary work on $N - K$ points that we do not care about! Also, taking square roots is computationally expensive and introduces floating-point errors.

**The Structural Invariant: Capped Size-K Max-Heap of Distances.**
- *Distance Metric Optimization*: Use squared Euclidean distance $x^2 + y^2$ directly (avoids \`Math.sqrt()\`).
- *Max-Heap Invariant*: Maintain a **MAX-HEAP** of size $K$ storing \`[dist, x, y]\`.
- *Why Max-Heap?* The root of a size-$K$ Max-Heap is the **farthest point currently in our top-$K$ closest list**.
- **Stream Points**:
  - Push current point distance to Max-Heap.
  - If \`heap.size() > K\`: Pop root (evicts the farthest point!).
  - Remaining $K$ points in heap are guaranteed to be the $K$ closest!

\`\`\`viz:array
{
  "frames": [
    { "cells": ["d=10 (1,3)", "d=8 (-2,2)"], "note": "K=2. Push (1,3) d=10, (-2,2) d=8. Max-Heap root is farthest: d=10." },
    { "cells": ["d=10 (1,3)", "d=8 (-2,2)"], "note": "Stream (5,8) d=89. Heap size > 2 -> Evict root (89) immediately!" },
    { "cells": ["d=8 (-2,2)", "d=1 (0,1)"], "highlight": [0, 1], "note": "Stream (0,1) d=1. Push d=1, evict root d=10! Final K=2 closest: (-2,2) and (0,1)." }
  ],
  "caption": "K Closest Points to Origin — Max-Heap of size K in O(N log K) time & O(K) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Comparison*: Compare points strictly by $x^2 + y^2$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can we compare squared distances (x^2 + y^2) instead of full Euclidean distances sqrt(x^2 + y^2)?",
          options: [
            "Because square root functions are non-linear.",
            "Because square root is a strictly monotonic increasing function for non-negative values, preserving relative order while saving CPU performance.",
            "Because square numbers use 16-bit integers.",
            "Because distances cannot be negative."
          ],
          correct_index: 1,
          model_answer: "For non-negative numbers, a > b if and only if a^2 > b^2. Omitting square roots preserves exact distance ordering while avoiding floating-point math.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity comparison between sorting all points vs using a Capped Size-K Max-Heap?",
          model_answer: "Sorting takes O(N log N) time and O(N) space. Capped Max-Heap takes O(N log K) time and O(K) space, which is vastly faster when K << N.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "kth-largest-element-in-an-array",
      title: "Kth Largest Element in an Array",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/kth-largest-element-in-an-array",
      summary: "Heap gives O(n log k); quickselect partitions its way to O(n) average — know both, argue the trade.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners sort the entire array descending ($O(N \log N)$) and return index $K - 1$.
*Why this shatters*: Full sorting does extra work. Can we find the $K$-th largest element in **$O(N)$ average time**?

**The Structural Invariant: QuickSelect (Hoare's Partition).**
QuickSelect adapts QuickSort's partition logic, but **only recurses into the single half that contains the target index** $Target = N - K$.
1. Pick a pivot element \`nums[pivot_idx]\`.
2. **Partition Array**: Rearrange elements so everything $\le \text{pivot}$ is on the left, and everything $> \text{pivot}$ is on the right.
3. Let pivot land at index \`p\`:
   - If \`p == Target\`: Return \`nums[p]\` (Found!).
   - If \`p < Target\`: Target lies in the **right partition** $\rightarrow$ Recurse on right subarray only!
   - If \`p > Target\`: Target lies in the **left partition** $\rightarrow$ Recurse on left subarray only!

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 2, 1, 5, 6, 4], "note": "Target index = N - K = 6 - 2 = index 4. Pivot = 4." },
    { "cells": [3, 2, 1, 4, 6, 5], "pointers": [{ "label": "pivot p=3", "index": 3 }], "note": "Partition around 4: [3, 2, 1 | 4 | 6, 5]. Pivot index p=3 < 4 -> Search RIGHT subarray!" },
    { "cells": [6, 5], "pointers": [{ "label": "pivot p=4", "index": 4 }], "highlight": [4], "note": "Partition right half: p=4 matches Target index 4! Return value 5." }
  ],
  "caption": "Kth Largest Element in an Array — QuickSelect in O(N) average time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Worst-Case Avoidance*: Standard QuickSelect has $O(N^2)$ worst-case time for already-sorted inputs. **Randomly shuffle the array** or pick random pivots to guarantee $O(N)$ average time!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is QuickSelect faster on average than QuickSort for finding the K-th largest element?",
          options: [
            "Because QuickSelect sorts both halves simultaneously.",
            "Because QuickSelect only recurses into ONE half of the array at each step (N + N/2 + N/4... = 2N = O(N)), whereas QuickSort recurses into BOTH halves (O(N log N)).",
            "Because QuickSelect does not use pivots.",
            "Because QuickSelect converts arrays into Min-Heaps."
          ],
          correct_index: 1,
          model_answer: "By discarding one half at each step, QuickSelect evaluates a geometric series sum N + N/2 + N/4 + ... = 2N, achieving O(N) average time complexity.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the space complexity trade-off between QuickSelect and Size-K Min-Heap?",
          model_answer: "QuickSelect operates in-place with O(1) auxiliary space (modifying input array). Size-K Min-Heap uses O(K) space but leaves the input array un-mutated and handles streaming data.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "task-scheduler",
      title: "Task Scheduler",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/task-scheduling",
      summary: "Always run the most-remaining task that is off cooldown — a heap plus a cooldown queue, tick by tick.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to place tasks sequentially in alphabetical order.
*Why this shatters*: Tasks with highest frequency create the largest bottleneck. You must **prioritize scheduling tasks with the highest remaining frequency** to minimize idle time slots!

**The Structural Invariant: Max-Heap + Cooldown Queue Simulation.**
1. Count task frequencies using a Hash Map \`{ 'A': 3, 'B': 3 }\`.
2. Insert frequencies into a **Max-Heap** (ready tasks).
3. Maintain a **Cooldown Queue** storing \`[remaining_count, available_time_step]\`.
4. **Time-Step Loop (time = 0, 1, 2...)**:
   - **Release Cooldowns**: If \`cooldownQueue.front()[1] == time\`, pop from queue and push back to Max-Heap (task is ready again!).
   - **Execute Task**: If Max-Heap is not empty:
     - Pop max frequency \`cnt = heap.pop()\`.
     - Execute task: if \`cnt - 1 > 0\`, push \`[cnt - 1, time + n + 1]\` to Cooldown Queue.
   - If Max-Heap is empty, current time-step is an **IDLE CPU cycle**.
   - Increment \`time++\`. Stop when both Max-Heap and Cooldown Queue are empty!

\`\`\`viz:array
{
  "frames": [
    { "cells": ["A:3", "B:3"], "note": "Tasks A:3, B:3, n=2. Time 0: Run A. A:2 cools until time 3. Heap: [B:3]." },
    { "cells": ["B:3"], "note": "Time 1: Run B. B:2 cools until time 4. Heap empty!" },
    { "cells": ["IDLE"], "note": "Time 2: Heap empty, A cools until time 3 -> IDLE cycle." },
    { "cells": ["A:2"], "highlight": [0], "note": "Time 3: A cools down! Re-enter Heap -> Run A. Repeat until all completed in 8 total units." }
  ],
  "caption": "Task Scheduler — Max-Heap + Cooldown Queue simulation."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Math Formula Alternative*: $\text{Min Time} = \\max(\text{tasks.length}, (\text{maxFreq} - 1) \times (n + 1) + \text{countMaxFreqTasks})$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why should the task with the highest remaining frequency always be scheduled first?",
          options: [
            "Because highest frequency tasks require less cooldown.",
            "Because most-frequent tasks create the longest potential bottleneck, and scheduling them early maximizes available slots to interleave smaller tasks.",
            "Because tasks are sorted alphabetically.",
            "Because Max-Heaps only accept 26 tasks."
          ],
          correct_index: 1,
          model_answer: "The task with highest frequency imposes the strictest structural limits on schedule length. Executing it greedily leaves open slots for less frequent tasks.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Under what condition will the Task Scheduler produce NO idle slots at all?",
          model_answer: "When there are enough distinct tasks to fill all cooldown gaps between high-frequency tasks, resulting in total time equal to `tasks.length`.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "design-twitter",
      title: "Design Twitter",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/design-twitter-feed",
      summary: "Follow sets in hash maps, tweets in per-user lists, and a heap merging the 10 freshest — a feed in miniature.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners collect all tweets from all followed users, combine them into one list, and sort them descending by timestamp ($O(M \log M)$ where $M$ is total tweets).
*Why this shatters*: Full sorting re-sorts thousands of old tweets when we **only need the 10 most recent tweets**!

**The Structural Invariant: K-Way Merge of Recency Lists using Max-Heap.**
- Data Storage:
  - \`userFollows: Map<userId, Set<followeeId>>\`
  - \`userTweets: Map<userId, List<{ tweetId, timestamp, index }>>\`
- **\`getNewsFeed(userId)\`**:
  - Get all followees of \`userId\` (including \`userId\` itself).
  - Each followee's tweet list is ALREADY pre-sorted by timestamp (since tweets are appended chronologically!).
  - This is reduced to **Merge K Sorted Lists**!
  - Push the **latest tweet** of each followee into a Max-Heap \`[timestamp, tweetId, userId, tweetIndex]\`.
  - Pop top (freshest tweet) 10 times:
    - Add \`tweetId\` to feed.
    - Push the **next newest tweet** from that same user into the Max-Heap.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "u1", "label": "User 1 Tweets: [t=10, t=5]", "row": 0, "col": 0 },
    { "id": "u2", "label": "User 2 Tweets: [t=12, t=8]", "row": 1, "col": 0 },
    { "id": "heap", "label": "Max-Heap: [t=12, t=10]", "row": 0.5, "col": 1 },
    { "id": "feed", "label": "News Feed: [12, 10, 8, 5]", "row": 0.5, "col": 2 }
  ],
  "edges": [
    { "from": "u1", "to": "heap" },
    { "from": "u2", "to": "heap" },
    { "from": "heap", "to": "feed" }
  ],
  "caption": "Design Twitter — K-Way Heap Merge of pre-sorted user tweet timelines."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Self-Following*: A user must always see their own tweets in their newsfeed even if they never explicitly called \`follow(userId, userId)\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is getNewsFeed in Design Twitter mathematically equivalent to Merge K Sorted Lists?",
          options: [
            "Because tweets are stored in a 2D matrix.",
            "Because each user's tweet history is already sorted by timestamp (newest to oldest), so we merge K sorted user timeline lists.",
            "Because Twitter feeds only hold 10 tweets.",
            "Because followee lists are sorted alphabetically."
          ],
          correct_index: 1,
          model_answer: "Appending tweets chronologically keeps per-user tweet lists sorted. Merging feed updates from K followees is merging K pre-sorted lists.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of getNewsFeed() using a Max-Heap to extract 10 tweets for K followees?",
          model_answer: "O(K + 10 log K) time. Seeding the heap takes O(K) time, and extracting 10 tweets with heap updates takes O(10 log K) time.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "find-median-from-data-stream",
      title: "Find Median From Data Stream",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/find-median-in-a-data-stream",
      summary: "Two Heaps holding each half of the data, balanced within one element — the median lives at their facing roots.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners insert streaming elements into an array and re-sort or shift elements using insertion sort ($O(N)$ per \`addNum()\`).
*Why this shatters*: $O(N)$ insertion for $N = 100,000$ numbers in a stream takes 10 billion operations!

**The Structural Invariant: Dueling Two-Heap System (Max-Heap vs Min-Heap).**
Split the stream into two equal halves:
- **Small Halves (Max-Heap \`small\`)**: Holds the smaller half of numbers. Root is the **MAXIMUM of the small half**.
- **Large Halves (Min-Heap \`large\`)**: Holds the larger half of numbers. Root is the **MINIMUM of the large half**.
- **Two Invariants**:
  1. **Value Order**: Every element in \`small\` $\le$ every element in \`large\` (\`small.peek() <= large.peek()\`).
  2. **Balance Constraint**: Sizes differ by **at most 1** (\`|small.size() - large.size()| <= 1\`).
- **Median Calculation**:
  - If \`small.size() > large.size()\`: \`Median = small.peek()\`.
  - If \`large.size() > small.size()\`: \`Median = large.peek()\`.
  - If \`small.size() == large.size()\`: \`Median = (small.peek() + large.peek()) / 2.0\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "stream", "label": "Stream: [1, 2, 5, 8]", "children": ["small", "large"] },
    { "id": "small", "label": "small (Max-Heap): root = 2", "children": ["1"], "highlight": true },
    { "id": "1", "label": "1" },
    { "id": "large", "label": "large (Min-Heap): root = 5", "children": ["8"], "highlight": true },
    { "id": "8", "label": "8" }
  ],
  "rootId": "stream",
  "caption": "Find Median From Data Stream — Small Max-Heap (root=2) & Large Min-Heap (root=5). Median = (2+5)/2 = 3.5."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Rebalancing*: After inserting a number into \`small\`, if \`small.peek() > large.peek()\`, pop from \`small\` and push to \`large\`. If size imbalance exceeds 1, pop from larger heap and push to smaller heap.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does the Dueling Two-Heap system achieve O(1) time for findMedian()?",
          options: [
            "By sorting both heaps.",
            "Because the median is computed directly from the roots of the two heaps (small.peek() and large.peek()) in O(1) time.",
            "By keeping all numbers in a single array.",
            "By using binary search."
          ],
          correct_index: 1,
          model_answer: "The roots of the Max-Heap (max of small half) and Min-Heap (min of large half) represent the two exact middle values of the dataset, accessible in O(1) time.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of addNum() in Find Median From Data Stream?",
          model_answer: "O(log N) time due to pushing and balancing elements across the two heaps.",
          difficulty: "basic"
        }
      ]
    }
  ]
};
