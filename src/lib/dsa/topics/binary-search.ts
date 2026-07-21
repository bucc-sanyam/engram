import type { DsaTopic } from "../types";

/** Chapter 5 — Binary Search: halving the world with every question. */
export const binarySearch: DsaTopic = {
  slug: "binary-search",
  title: "Binary Search",
  chapter: 5,
  tagline: "Any question with a sorted answer — even an invisible one — falls in log n guesses.",
  color: "#6fb7ff",
  prereqs: ["two-pointers"],
  unlocks: ["trees"],
  intro: `Two Pointers taught you that order lets a comparison retire one candidate. Binary Search pushes this to its logical extreme: aim your comparison at the *middle* of what remains, and one question retires half of everything. Twenty questions crack a million candidates.

The real skill here is recognising binary search wearing disguises. A 2-D matrix that is secretly one sorted line. A rotated array where *half* is always sorted. A timestamped history. And the biggest idea: **binary search on the answer space**. If you have a yes/no feasibility question that is monotone (too small fails, big enough succeeds), the boundary between them is the answer, and halving finds it.`,
  problems: [
    {
      slug: "binary-search",
      title: "Binary Search",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/binary-search",
      summary: "The canonical halving loop — and the invariant decisions that end all off-by-one suffering.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners scan the array sequentially from left to right using a linear loop ($O(N)$ time).
*Why this shatters*: Linear scanning completely ignores the fact that the input array is **already sorted**! For $N = 1,000,000$ elements, linear search takes up to $1,000,000$ comparisons, while Binary Search takes at most $\\approx 20$ comparisons ($\\log_2 1,000,000 \\approx 19.9$).

**The Structural Invariant: Monotone Range Reduction.**
- Maintain inclusive search bounds \`[L, R]\`.
- Compute mid point: \`mid = L + floor((R - L) / 2)\` (prevents integer overflow!).
- **Three Decisions**:
  - \`nums[mid] == target\` $\\rightarrow$ Match found! Return \`mid\`.
  - \`nums[mid] < target\` $\\rightarrow$ Target lies strictly to the right. Retire left half: \`L = mid + 1\`.
  - \`nums[mid] > target\` $\\rightarrow$ Target lies strictly to the left. Retire right half: \`R = mid - 1\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [-1, 0, 3, 5, 9, 12], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "mid=2 (3)", "index": 2 }, { "label": "R=5", "index": 5 }], "note": "mid=(0+5)//2=2 -> nums[2]=3. 3 < 9 -> Target in right half. Move L = mid + 1 = 3." },
    { "cells": [-1, 0, 3, 5, 9, 12], "pointers": [{ "label": "L=3", "index": 3 }, { "label": "mid=4 (9)", "index": 4 }, { "label": "R=5", "index": 5 }], "highlight": [4], "note": "mid=(3+5)//2=4 -> nums[4]=9 == target! Found at index 4." }
  ],
  "caption": "Binary Search — Halving the search space on every step in O(log N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Integer Overflow Trap*: \`(L + R) / 2\` can overflow 32-bit signed integers when $L + R > 2^{31} - 1$. Always write \`L + Math.floor((R - L) / 2)\`.
- *Inclusive Loop Condition*: Use \`while (L <= R)\`. Using \`L < R\` misses single-element ranges!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why should `L + Math.floor((R - L) / 2)` be used instead of `Math.floor((L + R) / 2)`?",
          options: [
            "Because (L + R) does not work with negative numbers.",
            "Because (L + R) can overflow max 32-bit integer limits when L and R are large numbers.",
            "Because (R - L) is faster for the CPU to compute.",
            "Because Binary Search requires odd array lengths."
          ],
          correct_index: 1,
          model_answer: "In languages with fixed 32-bit integer types, L + R can exceed the maximum integer limit (2,147,483,647), wrapping around to a negative number. Using L + (R - L) / 2 prevents overflow.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "How many maximum guesses does Binary Search take for an array of 1,000,000 sorted elements?",
          model_answer: "At most 20 guesses, since 2^20 = 1,048,576 > 1,000,000.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "search-a-2d-matrix",
      title: "Search a 2D Matrix",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/search-2d-matrix",
      summary: "Rows sorted, rows stacked in order — the grid is just one sorted array wearing a disguise.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners search row-by-row or run binary search on every row individually ($O(M \\log N)$).
*Why this shatters*: Notice the problem's two rules:
1. Each row is sorted ascending.
2. The first integer of each row is strictly greater than the last integer of the previous row.
This means the $M \\times N$ 2D grid is **literally one giant 1D sorted array** of length $M \\times N$ wrapped into rows!

**The Structural Invariant: Virtual 1D Coordinate Mapping.**
Perform a single Binary Search over virtual 1D indices \`0 ... (M * N - 1)\`.
- **Coordinate Translation**:
  - \`row = Math.floor(mid / COLS)\`
  - \`col = mid % COLS\`
- Evaluate \`matrix[row][col]\` against \`target\` using standard binary search logic in $O(\\log(M \\cdot N))$ time.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "mid=5 (val=11)", "index": 5 }, { "label": "R=11", "index": 11 }], "note": "Virtual 1D mid=5 (COLS=4) -> row=5//4=1, col=5%4=1 -> matrix[1][1]=11. 11 > 3 -> R = mid-1 = 4." },
    { "cells": [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "mid=1 (val=3)", "index": 1 }, { "label": "R=4", "index": 4 }], "highlight": [1], "note": "mid=1 -> row=0, col=1 -> matrix[0][1]=3 == target. Found in O(log(M*N)) time!" }
  ],
  "caption": "Search a 2D Matrix — Virtual 1D index mapping enables pure O(log(M*N)) binary search."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Matrix Dimensions*: $M = \\text{matrix.length}$, $N = \\text{matrix}[0].\\text{length}$. Total elements $Total = M \\times N$.
- *Range*: Search range initializes to $L = 0, R = Total - 1$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How is 1D virtual index 'mid' converted to 2D matrix coordinates (row, col) for a grid with C columns?",
          options: [
            "row = mid % C, col = mid // C",
            "row = Math.floor(mid / C), col = mid % C",
            "row = mid * C, col = mid + C",
            "row = mid // R, col = mid % R"
          ],
          correct_index: 1,
          model_answer: "Floor dividing mid by the column count C yields the row index. The remainder (mid % C) gives the column index.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Compare the time complexity of searching each row individually vs virtual 1D binary search.",
          model_answer: "Searching each row takes O(M log N). Virtual 1D binary search treats the matrix as one array of length M*N, achieving O(log(M*N)) = O(log M + log N) time complexity.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "koko-eating-bananas",
      title: "Koko Eating Bananas",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/eating-bananas",
      summary: "No array to search — so binary-search the answer itself, steered by a monotone yes/no test.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners look for a sorted array in the problem input to binary search. Finding none, they try every speed $k = 1, 2, 3...$ sequentially until Koko can finish within $H$ hours.
*Why this shatters*: If the largest pile has $1,000,000,000$ bananas, linear search tests up to 1 billion speeds!

**The Structural Invariant: Binary Search on the Answer Space.**
- **The Answer Range**: Koko's eating speed $k$ must lie within $[1, \\max(\\text{piles})]$.
- **Monotone Feasibility Function \`canFinish(k)\`**:
  $$\\text{total\_hours}(k) = \\sum_{p \\in \\text{piles}} \\lceil p / k \\rceil$$
  - If $k$ is too small, hours $> H$ (Fails).
  - As $k$ increases, total hours **monotonically decreases**.
  - There exists a sharp boundary: \`[False, False, ..., True, True]\`.
- **Goal**: Find the MINIMUM speed $k$ that returns \`True\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "pointers": [{ "label": "L=1", "index": 0 }, { "label": "mid=6", "index": 5 }, { "label": "R=11", "index": 10 }], "note": "Piles=[3,6,7,11], H=8. Test speed mid=6: hours=1+1+2+2=6 <= 8 (Valid!). Record res=6, try smaller speed R=mid-1=5." },
    { "cells": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "pointers": [{ "label": "L=1", "index": 0 }, { "label": "mid=3", "index": 2 }, { "label": "R=5", "index": 4 }], "note": "Test speed mid=3: hours=1+2+3+4=10 > 8 (Too slow!). Must eat faster: L=mid+1=4." },
    { "cells": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "pointers": [{ "label": "L=4", "index": 3 }, { "label": "mid=4", "index": 3 }, { "label": "R=4", "index": 3 }], "highlight": [3], "note": "Test speed mid=4: hours=1+2+2+3=8 <= 8 (Valid!). Record res=4. Loop ends -> Min Speed = 4." }
  ],
  "caption": "Koko Eating Bananas — Binary search over candidate answer space [1, max(piles)]."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Ceiling Division*: Calculate hours per pile using \`Math.ceil(pile / k)\` or integer math \`Math.floor((pile + k - 1) / k)\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the lower and upper search boundary for speed k in Koko Eating Bananas?",
          options: [
            "L = 0, R = piles.length",
            "L = 1, R = max(piles)",
            "L = min(piles), R = sum(piles)",
            "L = H, R = max(piles) * H"
          ],
          correct_index: 1,
          model_answer: "The minimum possible speed is 1 banana/hour. The maximum useful speed is max(piles) because eating faster than the largest pile still consumes 1 full hour for that pile.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why does integer math `(pile + k - 1) / k` correctly compute ceiling division `ceil(pile / k)`?",
          model_answer: "Adding `k - 1` before integer floor division shifts non-exact multiples into the next integer bucket (e.g. for pile=7, k=3: (7 + 2)/3 = 3 = ceil(7/3)). Exact multiples remain unaffected.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "find-minimum-in-rotated-sorted-array",
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array",
      summary: "A rotated array is two sorted runs; compare mid to the right end to find the seam.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners scan linearly looking for the element where \`nums[i] < nums[i-1]\` ($O(N)$ time).
*Why this shatters*: Linear scanning fails the problem's strict $O(\\log N)$ time requirement!

**The Structural Invariant: Finding the Inflection Point (Seam).**
A rotated sorted array consists of two sorted subarrays: \`[Large Values | Small Values]\`.
- Compare \`nums[mid]\` against \`nums[R]\` (the rightmost boundary element):
  - **If \`nums[mid] > nums[R]\`**: \`mid\` lies inside the **left (larger) subarray**. The minimum must be strictly to the right! Update \`L = mid + 1\`.
  - **If \`nums[mid] <= nums[R]\`**: \`mid\` lies inside the **right (smaller) subarray**. \`mid\` could be the minimum itself! Update \`R = mid\` (keep \`mid\` included!).

\`\`\`viz:array
{
  "frames": [
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "mid=3 (7)", "index": 3 }, { "label": "R=6 (2)", "index": 6 }], "note": "nums[mid]=7 > nums[R]=2 -> mid is in left big run. Minimum is to the right! L = mid + 1 = 4." },
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L=4", "index": 4 }, { "label": "mid=5 (1)", "index": 5 }, { "label": "R=6 (2)", "index": 6 }], "note": "nums[mid]=1 <= nums[R]=2 -> mid is in right small run. Minimum could be at mid or left! R = mid = 5." },
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L=4", "index": 4 }, { "label": "mid=4 (0)", "index": 4 }, { "label": "R=5 (1)", "index": 5 }], "highlight": [4], "note": "nums[mid]=0 <= nums[R]=1 -> R = mid = 4. L == R == 4. Minimum found: nums[4] = 0." }
  ],
  "caption": "Find Minimum in Rotated Sorted Array — Binary search comparing mid against rightmost boundary."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Why \`R = mid\` instead of \`R = mid - 1\`*: If \`nums[mid] <= nums[R]\`, \`nums[mid]\` might BE the global minimum! Setting \`R = mid - 1\` would discard the answer!
- *Loop Condition*: Use \`while (L < R)\` so loop terminates when \`L == R\` pointing at the minimum element.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Find Minimum in Rotated Sorted Array, why do we set R = mid instead of R = mid - 1 when nums[mid] <= nums[R]?",
          options: [
            "Because mid is always greater than target.",
            "Because nums[mid] itself could be the minimum element, so we must keep it within the active search space.",
            "To prevent out of bounds memory access.",
            "Because the array contains duplicate numbers."
          ],
          correct_index: 1,
          model_answer: "If nums[mid] <= nums[R], mid is part of the smaller right subarray. Since mid could be the inflection point (minimum), we set R = mid to retain mid in the range.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What condition indicates that an array segment [L...R] is NOT rotated (i.e. perfectly sorted)?",
          model_answer: "If `nums[L] < nums[R]`, the entire subarray from L to R is already strictly sorted in ascending order, meaning `nums[L]` is the minimum.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "search-in-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/find-target-in-rotated-sorted-array",
      summary: "At every step one half is perfectly sorted — check if the target lives there.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners think rotation destroys binary search because the array isn't globally sorted.
*Why this shatters*: Even when rotated, splitting the array at \`mid\` guarantees that **at least ONE half is strictly, perfectly sorted**!

**The Structural Invariant: The Sorted Half Test.**
1. Compute \`mid\`. If \`nums[mid] == target\`, return \`mid\`.
2. **Determine which half is sorted**:
   - **Case A: Left Half is Sorted (\`nums[L] <= nums[mid]\`)**:
     - Check if target falls within the sorted range \`nums[L] <= target < nums[mid]\`:
       - If yes: Search left half $\\rightarrow$ \`R = mid - 1\`.
       - If no: Search right half $\\rightarrow$ \`L = mid + 1\`.
   - **Case B: Right Half is Sorted (\`nums[mid] <= nums[R]\`)**:
     - Check if target falls within the sorted range \`nums[mid] < target <= nums[R]\`:
       - If yes: Search right half $\\rightarrow$ \`L = mid + 1\`.
       - If no: Search left half $\\rightarrow$ \`R = mid - 1\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "mid=3 (7)", "index": 3 }, { "label": "R=6", "index": 6 }], "note": "Target=0. nums[L]=4 <= nums[mid]=7 -> LEFT half [4,5,6,7] is sorted. Is target 0 in [4, 7)? NO -> Go Right! L=mid+1=4." },
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L=4", "index": 4 }, { "label": "mid=5 (1)", "index": 5 }, { "label": "R=6", "index": 6 }], "note": "nums[L]=0 <= nums[mid]=1 -> LEFT half [0,1] is sorted. Is target 0 in [0, 1)? YES (0 <= 0 < 1) -> Go Left! R=mid-1=4." },
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L=4", "index": 4 }, { "label": "mid=4 (0)", "index": 4 }, { "label": "R=4", "index": 4 }], "highlight": [4], "note": "nums[mid]=0 == target! Found at index 4 in O(log N) time." }
  ],
  "caption": "Search in Rotated Sorted Array — Identify sorted half and perform range bounds check."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Strict Boundary Inclusions*: Notice the \`< \` vs \`<= \` operators when checking if target is in range! Example: \`nums[L] <= target && target < nums[mid]\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How do we identify which half of a rotated sorted array is strictly sorted at step 'mid'?",
          options: [
            "If nums[L] <= nums[mid], the left half is sorted. Otherwise, the right half is sorted.",
            "The left half is always sorted.",
            "If nums[mid] > target, the right half is sorted.",
            "By sorting the array first."
          ],
          correct_index: 0,
          model_answer: "Comparing the left boundary nums[L] with nums[mid] determines if the left segment is continuous and sorted (no rotation seam inside).",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why can we reliably perform a range check `nums[L] <= target < nums[mid]` on the sorted half?",
          model_answer: "Because that half is strictly sorted in ascending order. If a target is not within its minimum (nums[L]) and maximum (nums[mid]) values, it physically cannot exist in that segment.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "time-based-key-value-store",
      title: "Time Based Key Value Store",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/time-based-key-value-store",
      summary: "Histories append in time order — so 'latest value at or before t' is a right-boundary search.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners search through historical timestamps linearly from newest to oldest ($O(N)$ time per lookup).
*Why this shatters*: The problem guarantees that calls to \`set(key, value, timestamp)\` arrive with **strictly increasing timestamps**!

**The Structural Invariant: Binary Search on Monotonic Timestamps.**
Because timestamps arrive pre-sorted:
- Map structure: \`Map<string, List<{ timestamp, value }>>\`.
- For \`get(key, timestamp)\`:
  - Run Binary Search over the key's history list to find the **largest timestamp $\\le$ target timestamp**.
  - If \`list[mid].timestamp <= target\`: Save \`list[mid].value\` as current best answer, then search right (\`L = mid + 1\`) for a newer timestamp!
  - If \`list[mid].timestamp > target\`: Search left (\`R = mid - 1\`).

\`\`\`viz:array
{
  "frames": [
    { "cells": ["t=1, v='bar'", "t=4, v='bar2'"], "pointers": [{ "label": "L=0", "index": 0 }, { "label": "mid=0", "index": 0 }, { "label": "R=1", "index": 1 }], "note": "get('foo', timestamp=3). mid=0 (t=1 <= 3): Valid candidate! Save res='bar'. Search right for newer: L=mid+1=1." },
    { "cells": ["t=1, v='bar'", "t=4, v='bar2'"], "pointers": [{ "label": "L=1", "index": 1 }, { "label": "mid=1", "index": 1 }, { "label": "R=1", "index": 1 }], "note": "mid=1 (t=4 > 3): Invalid! Search left: R=mid-1=0. Loop ends." },
    { "cells": ["t=1, v='bar'", "t=4, v='bar2'"], "highlight": [0], "note": "Return best saved result res = 'bar'." }
  ],
  "caption": "Time Based Key Value Store — Binary search for largest timestamp <= query timestamp."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Key Does Not Exist*: If key is not in map or all timestamps $> \\text{query}$, return \`""\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What property guarantees that the history list for a key is always sorted by timestamp?",
          options: [
            "The system automatically sorts the list after every get() call.",
            "The problem statement explicitly guarantees that set() calls are invoked with strictly increasing timestamps.",
            "Hash Maps sort lists by default.",
            "Timestamps are converted to 32-bit integers."
          ],
          correct_index: 1,
          model_answer: "Because timestamps arrive in strictly increasing chronological order, appending new entries to the array naturally keeps it sorted.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of set() and get() in Time Based Key Value Store?",
          model_answer: "set() takes O(1) time (appending to list). get() takes O(log K) time where K is the number of timestamps recorded for that key.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "median-of-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/median-of-two-sorted-arrays",
      summary: "Binary-search the partition: cut both arrays so left halves balance right halves.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners merge both sorted arrays into one array of size $M + N$ using Two Pointers ($O(M + N)$ time).
*Why this shatters*: The problem strictly demands **$O(\\log(M + N))$ time**! Merging whole arrays is too slow.

**The Structural Invariant: Binary Searching the Combined Partition Line.**
A median splits a dataset into two equal halves where **all left elements $\\le$ all right elements**.
- Binary search the **partition cut index \`i\`** in the SMALLER array $A$ (length $M$).
- The partition cut index \`j\` in array $B$ is automatically fixed:
  $$j = \\text{Math.floor}((M + N + 1) / 2) - i$$
- **Cross-Boundary Validation**:
  - Let $A_{left} = A[i-1]$, $A_{right} = A[i]$.
  - Let $B_{left} = B[j-1]$, $B_{right} = B[j]$.
  - **Valid Partition Condition**:
    $$A_{left} \\le B_{right} \\quad \\text{AND} \\quad B_{left} \\le A_{right}$$
- **Adjusting Search**:
  - If $A_{left} > B_{right}$: $A$ contributed too many elements $\\rightarrow$ Search left in $A$ (\`R = i - 1\`).
  - If $B_{left} > A_{right}$: $A$ contributed too few elements $\\rightarrow$ Search right in $A$ (\`L = i + 1\`).

\`\`\`viz:table-diff
{
  "columns": ["A_left", "A_right", "B_left", "B_right", "Valid Partition?"],
  "before": [[3, 8, 9, 10, "No: B_left (9) > A_right (8) -> Move Right in A"]],
  "after": [[8, "inf", 7, 9, "YES: 8 <= 9 and 7 <= inf"]],
  "caption": "Median of Two Sorted Arrays — Binary search partition cut on smaller array in O(log(min(M,N))) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Out of Bounds Handling*: If $i = 0$, $A_{left} = -\\infty$. If $i = M$, $A_{right} = +\\infty$.
- *Odd vs Even Total Length*:
  - If total length $(M + N)$ is **odd**: $\\text{Median} = \\max(A_{left}, B_{left})$.
  - If total length $(M + N)$ is **even**: $\\text{Median} = \\frac{\\max(A_{left}, B_{left}) + \\min(A_{right}, B_{right})}{2.0}$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must binary search be performed specifically on the SMALLER of the two arrays?",
          options: [
            "To guarantee O(log(min(M, N))) time complexity and prevent negative/out-of-bounds partition indices in the larger array.",
            "Because the larger array cannot be partitioned.",
            "Because smaller arrays sort faster.",
            "Because binary search only works on arrays under 10 elements."
          ],
          correct_index: 0,
          model_answer: "Searching the smaller array guarantees log(min(M,N)) time and ensures the computed partition index j in the larger array remains valid and non-negative.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "How are array boundary edge cases (e.g. partition index at 0 or array length) safely handled during cross-boundary validation?",
          model_answer: "If partition index i == 0, A_left is set to -Infinity. If i == M, A_right is set to +Infinity. This allows standard comparison logic to execute without array index out-of-bound errors.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
