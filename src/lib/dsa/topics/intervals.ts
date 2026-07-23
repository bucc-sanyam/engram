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

The second load-bearing idea is knowing the **overlap test** cold: two intervals $A$ and $B$ overlap iff $A.\text{start} \le B.\text{end}$ and $B.\text{start} \le A.\text{end}$.`,
  problems: [
    {
      slug: "insert-interval",
      title: "Insert Interval",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/insert-new-interval",
      summary: "Three phases against a sorted list: copy the before, absorb the overlapping, copy the after.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners push the new interval into the array and re-sort the entire list ($O(N \log N)$).
*Why this shatters*: The input list is **ALREADY SORTED and NON-OVERLAPPING**! Re-sorting from scratch throws away pre-existing order and takes unnecessary time.

**The Structural Invariant: Three-Phase Linear Sweep ($O(N)$ Time).**
A single insertion into an already-sorted disjoint list produces a **contiguous overlapping block**:
1. **Phase 1 (Before)**: Copy all intervals ending BEFORE the new interval starts (\`curr.end < newInterval.start\`).
2. **Phase 2 (Overlap Merging)**: Merge all intervals that overlap with new interval (\`curr.start <= newInterval.end\`):
   $$\text{newInterval.start} = \\min(\text{newInterval.start}, \text{curr.start})$$
   $$\text{newInterval.end} = \\max(\text{newInterval.end}, \text{curr.end})$$
3. **Push Merged New Interval**.
4. **Phase 3 (After)**: Copy remaining intervals (\`curr.start > newInterval.end\`).

\`\`\`viz:table-diff
{
  "columns": ["Existing Interval", "Sweep Phase", "Action Taken"],
  "before": [["[1, 2]", "Phase 1: Before", "Push to result as-is"], ["[3, 5]", "Phase 2: Overlap", "Merge: newInterval becomes [3, 8]"]],
  "after": [["[6, 7]", "Phase 2: Overlap", "Merge: newInterval stays [3, 8]"], ["[8, 10]", "Phase 2: Overlap", "Merge: newInterval becomes [3, 10]"], ["[12, 16]", "Phase 3: After", "Push merged [3, 10], then copy [12, 16]"]],
  "caption": "Insert Interval — 3-Phase linear sweep merging contiguous overlapping spans."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty List*: If existing list is empty \`[]\`, return \`[newInterval]\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does Insert Interval take O(N) time instead of O(N log N)?",
          options: [
            "Because we sort the array.",
            "Because the input intervals are already sorted and disjoint, allowing us to merge in a single linear 3-phase pass without re-sorting.",
            "Because it uses binary search.",
            "Because intervals are 1D arrays."
          ],
          correct_index: 1,
          model_answer: "Pre-sorted inputs allow contiguous overlap merging during a single O(N) linear sweep.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What condition defines that interval A and interval B overlap?",
          model_answer: "A.start <= B.end && B.start <= A.end.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "merge-intervals",
      title: "Merge Intervals",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/merge-intervals",
      summary: "Sort by start; each interval either extends the last open span or starts a new one.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners compare all pairs of intervals without sorting ($O(N^2)$).
*Why this shatters*: Un-sorted intervals can overlap with intervals located anywhere in the input array.

**The Structural Invariant: Sort-By-Start + Running Open Span Sweep.**
1. **Sort intervals by start time**: \`intervals.sort((a, b) => a[0] - b[0])\`.
2. Maintain \`result = [intervals[0]]\`.
3. For each subsequent interval \`curr\`:
   - Let \`last = result[result.length - 1]\`.
   - **Overlap Case** (\`curr.start <= last.end\`):
     Extend current open span: \`last.end = max(last.end, curr.end)\`.
   - **Disjoint Case** (\`curr.start > last.end\`):
     Start a new open span: \`result.push(curr)\`.

\`\`\`viz:table-diff
{
  "columns": ["Interval (Sorted)", "Comparison against last.end", "Action"],
  "before": [["[1, 3]", "First interval", "result = [[1, 3]]"], ["[2, 6]", "2 <= 3 (Overlap!)", "Extend: result = [[1, 6]]"]],
  "after": [["[8, 10]", "8 > 6 (Disjoint!)", "Push new: result = [[1, 6], [8, 10]]"], ["[15, 18]", "15 > 10 (Disjoint!)", "Push new: result = [[1, 6], [8, 10], [15, 18]]"]],
  "caption": "Merge Intervals — Sort-by-start single pass linear sweep."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Swallowed Intervals*: Always update \`last.end = max(last.end, curr.end)\`. Don't just assign \`last.end = curr.end\` because a swallowed interval like \`[2, 3]\` inside \`[1, 10]\` must not shrink \`last.end\`!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must we use max(last.end, curr.end) instead of assigning last.end = curr.end when merging overlapping intervals?",
          options: [
            "Because intervals are sorted by end time.",
            "Because an interval may be completely swallowed inside the previous interval (e.g. [1, 10] and [2, 3]), and assigning directly would incorrectly shrink last.end.",
            "To prevent negative interval values.",
            "Because the intervals were sorted by end time, not start time."
          ],
          correct_index: 1,
          model_answer: "A swallowed interval has a smaller end than the open span. Using max() ensures the span never shrinks.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Merge Intervals?",
          model_answer: "O(N log N) time complexity due to sorting intervals by start time.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "non-overlapping-intervals",
      title: "Non Overlapping Intervals",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/non-overlapping-intervals",
      summary: "Fewest removals = total minus the most you can keep — and earliest-end-first keeps the most.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners sort by start time and greedily pick intervals.
*Why this shatters*: Counterexample: \`[[1, 10], [2, 3], [3, 4]]\`. Sorting by start time picks \`[1, 10]\` first, forcing the removal of 2 smaller non-overlapping intervals!

**The Structural Invariant: Activity Selection (Sort by End Time).**
To **MINIMIZE REMOVALS**, we must **MAXIMIZE KEPT INTERVALS**:
- **Greedy Rule**: Sort intervals by **END TIME** (\`a[1] - b[1]\`).
- *Why End Time?* The interval that finishes **earliest** leaves the **maximum possible room for future intervals**!
- **Sweep**:
  - Track \`lastEnd = -Infinity\`, \`removed = 0\`.
  - For each \`curr\` in sorted intervals:
    - If \`curr.start >= lastEnd\`: Keep interval! Update \`lastEnd = curr.end\`.
    - Else (\`curr.start < lastEnd\`): Overlap detected! **REMOVE \`curr\`** $\rightarrow$ \`removed++\`.

\`\`\`viz:table-diff
{
  "columns": ["Interval (Sorted by End)", "Compare to lastEnd", "Decision"],
  "before": [["[1, 2]", "1 >= -inf", "KEEP: lastEnd = 2"], ["[2, 3]", "2 >= 2", "KEEP: lastEnd = 3"]],
  "after": [["[1, 3]", "1 < 3 (Overlap!)", "REMOVE! removed = 1"], ["[3, 4]", "3 >= 3", "KEEP: lastEnd = 4"]],
  "caption": "Non-Overlapping Intervals — Sort by End Time greedy activity selection."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Touching Endpoints*: Touching endpoints (e.g. \`[1, 2]\` and \`[2, 3]\`) are NOT considered overlapping (\`curr.start >= lastEnd\` is valid).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must intervals be sorted by END TIME instead of START TIME for Non-Overlapping Intervals?",
          options: [
            "Because sorting by end time takes O(N) time.",
            "Because picking the interval that ends earliest frees up the maximum remaining timeline for future non-overlapping intervals (Greedy Activity Selection).",
            "Because start times are negative.",
            "Because end times are 1-indexed."
          ],
          correct_index: 1,
          model_answer: "Selecting the earliest-ending interval leaves the maximum open space for subsequent intervals, maximizing the total count of non-overlapping intervals kept.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the relationship between Min Removals and Max Non-Overlapping Intervals Kept?",
          model_answer: "Min Removals = Total Intervals - Max Non-Overlapping Intervals Kept.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "meeting-rooms",
      title: "Meeting Rooms",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/meeting-schedule",
      summary: "One person, many meetings: sort by start and check each neighbour pair — any overlap means no.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners compare all pairs of meetings ($O(N^2)$).
*Why this shatters*: Un-sorted pair checking takes quadratic time.

**The Structural Invariant: Adjacent Neighbor Overlap Check.**
1. **Sort intervals by start time**: \`intervals.sort((a, b) => a[0] - b[0])\`.
2. Iterate $i$ from $0 \dots N-2$:
   - If \`intervals[i+1].start < intervals[i].end\`:
     - Overlap detected! **Return \`false\`** (One person cannot attend both!).
3. Return \`true\` if sweep completes without overlaps.

\`\`\`viz:array
{
  "frames": [
    { "cells": [[0,30], [5,10], [15,20]], "note": "Sorted: [[0,30], [5,10], [15,20]]." },
    { "cells": [[0,30], [5,10]], "highlight": [0, 1], "note": "Check i=0: intervals[1].start(5) < intervals[0].end(30) -> OVERLAP! Return FALSE." }
  ],
  "caption": "Meeting Rooms — Sort by start single pass overlap check."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Equal End/Start*: If meeting A ends at 10 and meeting B starts at 10 (\`10 < 10\` is false), there is NO overlap.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the condition that signals a meeting collision in Meeting Rooms after sorting by start time?",
          options: [
            "intervals[i+1].start < intervals[i].end",
            "intervals[i+1].end < intervals[i].start",
            "intervals[i].start == 0",
            "intervals[i].end == 24"
          ],
          correct_index: 0,
          model_answer: "After sorting by start time, a meeting collision occurs if the next meeting starts before the previous meeting ends.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Meeting Rooms?",
          model_answer: "O(N log N) time complexity due to sorting.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "meeting-rooms-ii",
      title: "Meeting Rooms II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/meeting-schedule-ii",
      summary: "Peak simultaneous meetings: a min-heap of end times, or the +1/−1 event sweep — know both.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners think the number of rooms equals the number of overlapping meeting pairs.
*Why this shatters*: The number of rooms needed equals the **MAXIMUM CONCURRENT / SIMULTANEOUS MEETINGS** active at any single point in time!

**The Structural Invariant: Min-Heap of Active End-Times (or Event Sweep).**
- **Approach 1: Min-Heap of End-Times**:
  - Sort intervals by start time.
  - Maintain a **Min-Heap \`minHeap\` storing meeting end times**.
  - For each \`meeting\` in sorted intervals:
    - If \`minHeap.peek() <= meeting.start\`:
      - Room freed up! Pop earliest end time (\`minHeap.pop()\`).
    - Push \`meeting.end\` to \`minHeap\`.
  - Result = \`minHeap.size()\` (Peak concurrent rooms needed!).
- **Approach 2: Chronological Event Line Sweep (+1 / -1)**:
  - Separate start times and end times into 2 sorted arrays.
  - Walk two pointers \`s\` and \`e\`: if \`starts[s] < ends[e]\`, \`count++\`, \`s++\`; else \`count--\`, \`e++\`. Track \`max(count)\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [[0,30], [5,10], [15,20]], "note": "Sorted: [[0,30], [5,10], [15,20]]." },
    { "cells": [30], "note": "Meeting [0,30]: Heap=[30]. Rooms=1." },
    { "cells": [10, 30], "highlight": [0, 1], "note": "Meeting [5,10]: 5 < 30 (No room free) -> Push 10. Heap=[10, 30]. Rooms=2." },
    { "cells": [20, 30], "highlight": [0, 1], "note": "Meeting [15,20]: 15 >= 10 (Room freed!) -> Pop 10, Push 20. Heap=[20, 30]. Peak Rooms = 2!" }
  ],
  "caption": "Meeting Rooms II — Min-Heap of end times tracking peak concurrency."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Tie Breaking in Event Sweep*: If a meeting ends at 10 and another starts at 10, process the end event BEFORE the start event so the room is reused.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does the peak size of the Min-Heap represent in Meeting Rooms II?",
          options: [
            "The total number of meetings.",
            "The maximum number of concurrent/simultaneous meetings active at any single point in time, which equals the minimum rooms needed.",
            "The total duration of all meetings.",
            "The number of canceled meetings."
          ],
          correct_index: 1,
          model_answer: "The Min-Heap tracks active meeting end times. Its peak size represents maximum simultaneous room occupancy.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Meeting Rooms II using a Min-Heap?",
          model_answer: "O(N log N) time complexity (sorting takes O(N log N), N heap operations take O(N log N)).",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "minimum-interval-to-include-each-query",
      title: "Minimum Interval to Include Each Query",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/minimum-interval-including-query",
      summary: "Sort intervals and queries together, sweep once: a heap keyed by size holds the candidates — offline processing.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners scan every interval for each query independently ($O(Q \cdot N)$ time).
*Why this shatters*: Scanning $Q = 100,000$ queries against $N = 100,000$ intervals takes 10 billion operations (TLE!).

**The Structural Invariant: Offline Query Sorting + Min-Heap Size Candidate Sweep.**
1. **Offline Query Processing**:
   Sort queries alongside their original indices: \`sortedQueries = [[q, origIdx]...]\` sorted by value $q$.
2. **Sort Intervals by Start Time**: \`intervals.sort((a, b) => a[0] - b[0])\`.
3. Maintain a **Min-Heap of Candidate Intervals** storing \`[interval_size, interval_end]\`.
4. **Single-Pass Sweep for each Query $q$**:
   - **Admit**: Push all intervals with \`start <= q\` into Min-Heap.
   - **Evict**: Pop from Min-Heap any interval with \`end < q\` (Expired interval that can NEVER cover future $q$!).
   - **Read**: The Min-Heap root is the **smallest valid interval covering $q$**!
   - Save \`result[origIdx] = heap.peek().size\` (or \`-1\` if heap is empty).

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 3], "note": "Query q=2: Admit [1,4] (size 4) & [2,4] (size 3). Min size=3." },
    { "cells": [3, 3, 4], "note": "Query q=3: Admit [3,6] (size 4). Min size stays 3." },
    { "cells": [3, 3, 4, 1], "note": "Query q=4: Admit [4,4] (size 1). Heap root min size = 1." },
    { "cells": [4], "highlight": [0], "note": "Query q=5: Evict expired intervals (end < 5). Remaining root = [3,6] (size 4). Answer = 4." }
  ],
  "caption": "Minimum Interval to Include Each Query — Offline processing with size Min-Heap."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Lazy Eviction*: Evicting expired intervals (\`heap.peek().end < q\`) at query time ensures each interval is pushed and popped from the heap at most ONCE!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must queries be sorted alongside intervals in Minimum Interval to Include Each Query?",
          options: [
            "Because binary search requires sorted queries.",
            "Sorting queries allows an offline 2-pointer sweep where interval admission and eviction move monotonically forward, guaranteeing each interval is pushed/popped at most once.",
            "Because query values are negative.",
            "To remove duplicate queries."
          ],
          correct_index: 1,
          model_answer: "Monotonic query progression allows single-pass admission and eviction, reducing total time from O(Q * N) to O((N + Q) log N).",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Minimum Interval to Include Each Query?",
          model_answer: "O((N log N) + (Q log Q)) time complexity for sorting intervals and queries.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
