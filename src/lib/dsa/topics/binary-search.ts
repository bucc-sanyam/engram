import type { DsaTopic } from "../types";

/** Chapter 5 — Binary Search: halving the world with every question. */
export const binarySearch: DsaTopic = {
  slug: "binary-search",
  title: "Binary Search",
  chapter: 5,
  tagline:
    "Any question with a sorted answer — even an invisible one — falls in log n guesses.",
  color: "#6fb7ff",
  prereqs: ["two-pointers"],
  unlocks: ["trees"],
  intro: `Two Pointers taught you that order lets a comparison retire one candidate. Binary Search pushes this to its logical extreme: aim your comparison at the *middle* of what remains, and one question retires half of everything. Twenty questions crack a million candidates.

The real skill here is recognising binary search wearing disguises. A 2-D matrix that is secretly one sorted line. A rotated array where *half* is always sorted. A timestamped history. And the biggest idea: **binary search on the answer space**. If you have a yes/no feasibility question that is monotone (too small fails, big enough succeeds), the boundary between them is the answer, and halving finds it.

The through-line: binary search needs sortedness only in one abstract sense — a predicate that flips once across the search space. Find the flip point.`,
  problems: [
    {
      slug: "binary-search",
      title: "Binary Search",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/binary-search",
      summary:
        "The canonical halving loop — and the invariant decisions that end all off-by-one suffering.",
      body: `**Signal.** "Sorted array, find the target's index" — sortedness plus a single-value lookup is the purest possible tell for binary search: comparing against the middle discards half the candidates in one step.

**Brute force.** Linear scan, checking each element — O(n) time. Correct, and it doesn't use the fact that the array is sorted at all.

**Optimal approach.** Decide once what L and R mean: they bracket the candidates **still alive**, inclusive on both ends. Loop while L <= R: compute mid, and compare nums[mid] to the target. Equal means found. Less means the target must be to the right — L = mid + 1. Greater means it must be to the left — R = mid - 1. Every classic bug comes from violating this invariant — e.g. setting R = mid when you already know mid isn't the target (hello infinite loop).

\`\`\`viz:array
{
  "frames": [
    { "cells": [-1, 0, 3, 5, 9, 12], "pointers": [{ "label": "L", "index": 0 }, { "label": "mid", "index": 2 }, { "label": "R", "index": 5 }], "note": "mid = (0+5)/2 = 2 → nums[2] = 3. 3 < 9, so target is right of mid. L = mid + 1 = 3." },
    { "cells": [-1, 0, 3, 5, 9, 12], "pointers": [{ "label": "L", "index": 3 }, { "label": "mid", "index": 4 }, { "label": "R", "index": 5 }], "highlight": [4], "note": "mid = (3+5)/2 = 4 → nums[4] = 9. Match! Found at index 4." }
  ],
  "caption": "Binary Search — each comparison at mid halves the range L..R."
}
\`\`\`

**Complexity.** O(log n) time, O(1) space — versus the O(n) linear scan.

**Thread.** Next, Search a 2D Matrix shows that "sorted" doesn't require a literal 1-D array — a grid with the right row/column properties is one sorted line wearing a disguise.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In a standard Binary Search, if nums[mid] is less than the target, how should the left pointer be updated?",
          options: ["L = mid", "L = mid + 1", "L = mid - 1", "R = mid - 1"],
          correct_index: 1,
          model_answer: "Because we have already checked nums[mid] and it is too small, the target must lie strictly to the right. Thus, L = mid + 1.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "Why does Binary Search achieve an O(log N) time complexity?",
          model_answer: "Because it discards exactly half of the remaining search space on every comparison, meaning the number of elements halves repeatedly until 1 is left.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "search-a-2d-matrix",
      title: "Search a 2D Matrix",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/search-2d-matrix",
      summary:
        "Rows sorted, rows stacked in order — the grid is just one sorted array wearing a disguise.",
      body: `**Signal.** "Each row sorted, and the first integer of each row exceeds the last of the previous row" — that double promise is the tell: flattened, this matrix is one perfectly sorted array, so ordinary binary search still applies once you can address it.

**Brute force.** Scan every cell — O(m·n) — or binary-search each row individually — O(m log n) — neither of which uses the fact that the *rows themselves* are ordered relative to each other.

**Optimal approach.** Pretend the matrix is a 1-D array of length m·n, indices 0 to m·n − 1. To translate a virtual index mid into 2-D coordinates: row = mid // COLS, col = mid % COLS. Then run ordinary binary search over that virtual index space, translating on every comparison.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60], "pointers": [{ "label": "L", "index": 0 }, { "label": "mid", "index": 5 }, { "label": "R", "index": 11 }], "note": "mid=5 -> row=5//4=1, col=5%4=1 -> matrix[1][1]=11. 11 > 3 -> target is left. R = mid-1 = 4." },
    { "cells": [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60], "pointers": [{ "label": "L", "index": 0 }, { "label": "mid", "index": 2 }, { "label": "R", "index": 4 }], "note": "mid=2 -> row=0, col=2 -> matrix[0][2]=5. 5 > 3 -> R = mid-1 = 1." },
    { "cells": [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60], "pointers": [{ "label": "L", "index": 0 }, { "label": "mid", "index": 0 }, { "label": "R", "index": 1 }], "note": "mid=0 -> row=0, col=0 -> matrix[0][0]=1. 1 < 3 -> L = mid+1 = 1." },
    { "cells": [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60], "pointers": [{ "label": "L", "index": 1 }, { "label": "mid", "index": 1 }, { "label": "R", "index": 1 }], "highlight": [1], "note": "mid=1 -> row=0, col=1 -> matrix[0][1]=3 == target. Found." }
  ],
  "caption": "Search a 2D Matrix — a virtual index into the flattened grid, translated to (row, col) on every comparison."
}
\`\`\`

**Complexity.** O(log(m·n)) time, O(1) space — versus O(m·n) full scan or O(m log n) per-row search.

**Thread.** Koko Eating Bananas, next, drops the array entirely — there's nothing to look up. Instead you binary-search over a space of *candidate answers*, steered by a yes/no feasibility test.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How do you translate a virtual 1-D index 'mid' into a 2-D matrix coordinate (row, col)?",
          options: ["row = mid % COLS, col = mid // COLS", "row = mid // COLS, col = mid % COLS", "row = mid // ROWS, col = mid % ROWS", "row = COLS // mid, col = COLS % mid"],
          correct_index: 1,
          model_answer: "The row is the number of full COLS that fit into mid (mid // COLS), and the column is the remainder (mid % COLS).",
          difficulty: "intermediate"
        },
        {
          kind: "truefalse",
          prompt: "True or False: We could binary search each row individually to achieve O(log(m * n)) time complexity.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. Searching each row individually takes O(m * log n) time, which is slower than flattening the matrix logically to achieve O(log(m * n)).",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "koko-eating-bananas",
      title: "Koko Eating Bananas",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/eating-bananas",
      summary:
        "No array to search — so binary-search the answer itself, steered by a monotone yes/no test.",
      body: `**Signal.** "Return the minimum eating speed k such that she finishes within h hours" — minimizing a parameter subject to a pass/fail feasibility test is the tell for binary search *on the answer space*, not on any array in the input.

**Brute force.** Try every speed k from 1 upward, compute the hours needed, stop at the first that fits within h — O(max(piles) · n) in the worst case, since each candidate speed costs an O(n) hours computation and you may try nearly every speed.

**Optimal approach.** There is no sorted array here — until you build one in your head. The possible speeds k range from 1 to max(piles) (eating faster than the biggest pile doesn't save any more time). For any speed k, hours = sum(ceil(p / k) for p in piles). Feasibility is **monotone**: speed 1 fails, max(piles) succeeds, and everything flips from fail to succeed exactly once as k increases — F, F, F, T, T, T… You want the *first* T. Binary-search k directly: if canFinish(mid) is true, mid works but maybe a slower speed also works — record mid as the answer and search left (R = mid − 1); if false, mid is too slow — search right (L = mid + 1).

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "pointers": [{ "label": "L", "index": 0 }, { "label": "mid", "index": 5 }, { "label": "R", "index": 10 }], "note": "Test speed 6: hours = 1+1+2+2 = 6 ≤ 8 → feasible. Record 6, then search slower. R = mid - 1 = 4." },
    { "cells": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "pointers": [{ "label": "L", "index": 0 }, { "label": "mid", "index": 2 }, { "label": "R", "index": 4 }], "note": "Test speed 3: hours = 1+2+3+4 = 10 > 8 → too slow. Search faster. L = mid + 1 = 3." },
    { "cells": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "pointers": [{ "label": "L", "index": 3 }, { "label": "mid", "index": 3 }, { "label": "R", "index": 4 }], "highlight": [3], "note": "Test speed 4: hours = 1+2+2+3 = 8 ≤ 8 → feasible. Record 4 — better. R = mid - 1 = 2, now L > R. Answer: speed 4." }
  ],
  "caption": "Koko Eating Bananas — binary search over the answer space (candidate speeds), not over the piles array."
}
\`\`\`

**Complexity.** O(n · log(max(piles))) time, O(1) space — versus O(max(piles) · n) trying every speed in order.

**Thread.** Find Minimum in Rotated Sorted Array returns to searching an actual array — but one that's had its sortedness scrambled by a single rotation, and the trick is finding the seam.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the theoretical maximum eating speed Koko should ever consider?",
          options: ["The sum of all bananas", "The average size of the piles", "The size of the largest pile", "The number of piles"],
          correct_index: 2,
          model_answer: "Eating faster than the largest pile doesn't save any time, because Koko still spends 1 full hour on that pile regardless.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why is Koko Eating Bananas a classic example of 'binary search on the answer'?",
          model_answer: "Because instead of searching a given array, we binary search across the range of possible eating speeds (from 1 to max pile). We use a monotone feasibility function to check if a speed works, narrowing the range to find the minimum.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "find-minimum-in-rotated-sorted-array",
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      neetcodeUrl:
        "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array",
      summary:
        "A rotated array is two sorted runs; compare mid to the right end to find the seam.",
      body: `**Signal.** "A sorted array, rotated between 1 and n times — find the minimum in O(log n)" — "rotated" is the tell: sortedness isn't gone, it's split into exactly two ascending runs, and O(log n) rules out a linear scan.

**Brute force.** Scan the array for the one place where an element is smaller than its predecessor — O(n) time, and it ignores the O(log n) requirement.

**Optimal approach.** Rotation damages sortedness but doesn't destroy it: the array is exactly two ascending runs, with the first run entirely larger than the second run. The minimum element is the *seam* where the first run drops into the second. Compare nums[mid] against the rightmost element nums[R]: if nums[mid] > nums[R], you're in the big first run and the drop is to your right — L = mid + 1. If nums[mid] <= nums[R], you're in the small second run and the drop is at mid or to your left — R = mid (keep mid alive, it might be the min). When L == R, you've pinned the minimum.

\`\`\`viz:array
{
  "frames": [
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L", "index": 0 }, { "label": "mid", "index": 3 }, { "label": "R", "index": 6 }], "note": "nums[mid] = 7. Is 7 > nums[R] = 2? Yes — we're in the big left run. The drop is to the right. L = mid + 1 = 4." },
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L", "index": 4 }, { "label": "mid", "index": 5 }, { "label": "R", "index": 6 }], "note": "nums[mid] = 1. Is 1 > nums[R] = 2? No — we're in the small right run. The drop is at mid or left. R = mid = 5." },
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L", "index": 4 }, { "label": "mid", "index": 4 }, { "label": "R", "index": 5 }], "note": "nums[mid] = 0. Is 0 > nums[R] = 1? No. R = mid = 4." },
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L", "index": 4 }, { "label": "R", "index": 4 }], "highlight": [4], "note": "L == R == 4. Loop ends — the minimum is nums[4] = 0." }
  ],
  "caption": "Find Minimum in Rotated Sorted Array — comparing mid against the rightmost element finds the seam."
}
\`\`\`

**Complexity.** O(log n) time, O(1) space — versus the O(n) linear scan.

**Thread.** Search in Rotated Sorted Array asks the harder version of the same question — not just where the seam is, but where an arbitrary target lives, using the fact that whichever half you cut, one side is always perfectly sorted.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In a rotated sorted array, what does it mean if nums[mid] > nums[R]?",
          options: ["The minimum is to the left of mid.", "The minimum is at mid.", "The array is not rotated.", "The minimum is to the right of mid."],
          correct_index: 3,
          model_answer: "If mid is greater than the rightmost element, mid must be part of the first (larger) ascending run, meaning the drop-off to the minimum element is somewhere to its right.",
          difficulty: "intermediate"
        },
        {
          kind: "mcq",
          prompt: "Why do we set R = mid instead of R = mid - 1 when nums[mid] <= nums[R]?",
          options: ["Because mid is definitely the minimum.", "Because mid could potentially be the minimum element itself.", "To avoid an infinite loop.", "Because the array has duplicate elements."],
          correct_index: 1,
          model_answer: "When nums[mid] <= nums[R], mid is in the smaller right-hand run. It might be the actual minimum, so we cannot safely exclude it by doing mid - 1.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "search-in-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      neetcodeUrl:
        "https://neetcode.io/problems/find-target-in-rotated-sorted-array",
      summary:
        "At every step one half is perfectly sorted — check if the target lives there.",
      body: `**Signal.** "Rotated sorted array, find the target, in O(log n)" — building on Find Minimum's seam idea, but now hunting an arbitrary value instead of the minimum, which means the halving decision needs one extra check per step.

**Brute force.** Linear scan for the target — O(n), ignoring both the sortedness and the O(log n) requirement.

**Optimal approach.** Cut the array at mid. One side *must* be perfectly sorted (no seam) — the other side has the seam. Use the sorted half to interrogate: "is the target inside your range?" Since it's sorted, that's just a boundary check. If yes, recurse into that half; if no, the target must be in the messy half. Concretely: if nums[L] <= nums[mid], the left half is sorted — check nums[L] <= target < nums[mid]; if true go left (R = mid − 1), else go right (L = mid + 1). Otherwise the right half is sorted — check nums[mid] < target <= nums[R]; if true go right, else go left.

\`\`\`viz:array
{
  "frames": [
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L", "index": 0 }, { "label": "mid", "index": 3 }, { "label": "R", "index": 6 }], "note": "nums[mid]=7. Left half sorted (nums[L]=4 <= 7). Is target 0 in [4,7)? No -> target is in the right half. L = mid+1 = 4." },
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L", "index": 4 }, { "label": "mid", "index": 5 }, { "label": "R", "index": 6 }], "note": "nums[mid]=1. Left half sorted (nums[L]=0 <= 1). Is target 0 in [0,1)? Yes (0 <= 0 < 1) -> R = mid-1 = 4." },
    { "cells": [4, 5, 6, 7, 0, 1, 2], "pointers": [{ "label": "L", "index": 4 }, { "label": "mid", "index": 4 }, { "label": "R", "index": 4 }], "highlight": [4], "note": "nums[mid] = 0 == target. Found at index 4." }
  ],
  "caption": "Search in Rotated Sorted Array — whichever half is sorted, a direct boundary check decides where the target must be."
}
\`\`\`

**Complexity.** O(log n) time, O(1) space — versus the O(n) linear scan.

**Thread.** Time Based Key Value Store leaves rotation behind and applies plain binary search to something that only *looks* unlike an array: a history of timestamped writes, sorted by construction.`,
      questions: [
        {
          kind: "open",
          prompt: "When searching in a rotated sorted array, how do we decide which half to explore?",
          model_answer: "We first determine which half is perfectly sorted by comparing nums[L] and nums[mid]. Then, we check if our target falls within the bounds of that sorted half. If it does, we search that half; otherwise, we search the unsorted half.",
          difficulty: "advanced"
        },
        {
          kind: "truefalse",
          prompt: "True or False: In any rotated sorted array (without duplicates), cutting the array exactly in half guarantees that at least one half is strictly increasing.",
          options: ["True", "False"],
          correct_index: 0,
          model_answer: "True. A single rotation point means only one side can contain the seam. The other side will always be perfectly sorted.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "time-based-key-value-store",
      title: "Time Based Key Value Store",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/time-based-key-value-store",
      summary:
        "Histories append in time order — so 'latest value at or before t' is a right-boundary search.",
      body: `**Signal.** "Return the value with the largest timestamp <= the requested timestamp, and set timestamps are strictly increasing" — a strictly-increasing write order is a hidden sorted array; "largest entry not exceeding a query" is a rightmost-valid-boundary search.

**Brute force.** Scan the key's whole history looking for the entry with the largest timestamp <= the query — O(n) per get, where n is entries for that key.

**Optimal approach.** Because set's timestamps arrive strictly increasing, storing (timestamp, value) pairs per key in a list keeps that list automatically sorted — no explicit sort ever needed. get then binary-searches for the *rightmost* entry with entry_time <= target_time: if mid_time <= target_time, it's a valid candidate — save it as the running best and search right (L = mid + 1) to see if a closer timestamp exists; if mid_time > target_time, it's invalid — search left (R = mid − 1).

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 4], "pointers": [{ "label": "L", "index": 0 }, { "label": "mid", "index": 0 }, { "label": "R", "index": 1 }], "highlight": [0], "note": "get(\\"foo\\", 3). mid=0: timestamp 1 <= 3 -> valid candidate, save value \\"bar\\". Search right for something closer: L = mid+1 = 1." },
    { "cells": [1, 4], "pointers": [{ "label": "L", "index": 1 }, { "label": "mid", "index": 1 }, { "label": "R", "index": 1 }], "note": "mid=1: timestamp 4 <= 3? No -> invalid, R = mid-1 = 0. Now L > R, loop ends." },
    { "cells": [1, 4], "highlight": [0], "note": "Best candidate found was index 0 (timestamp 1) -> return \\"bar\\"." }
  ],
  "caption": "Time Based Key Value Store — binary search for the rightmost timestamp not exceeding the query."
}
\`\`\`

**Complexity.** O(1) for set, O(log n) for get (n = entries for that key) — versus O(n) per get with a linear scan. O(total entries) space.

**Thread.** Median of Two Sorted Arrays closes the chapter with the hardest disguise yet: instead of searching for a value, you binary-search for a *partition* — a cut point balancing two arrays at once.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can we use binary search on the timestamps for a specific key?",
          options: ["Because the problem guarantees timestamps are strictly increasing when set.", "Because hash maps automatically sort their values.", "Because we manually sort the array before searching.", "Because we only store integer values."],
          correct_index: 0,
          model_answer: "The problem guarantees that set() calls are made with strictly increasing timestamps, meaning the list of [timestamp, value] pairs for any given key is naturally sorted.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "If we are looking for a timestamp exactly equal to the target or just before it, how do we update our result variable?",
          model_answer: "When mid's timestamp is less than or equal to the target, it is a valid candidate. We record its value as the current best answer, then search to the right (L = mid + 1) to see if we can find a closer timestamp.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "median-of-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/median-of-two-sorted-arrays",
      summary:
        "Binary-search the partition: cut both arrays so left halves balance right halves.",
      body: `**Signal.** "Two sorted arrays, find the median, in O(log(m+n))" — the log bound on a *combined* size, not either array alone, is the tell that you can't merge (that's O(m+n)) — you have to search for a **partition**, not a value.

**Brute force.** Merge both arrays (or merge-walk them without fully materializing the result) and read off the middle — O(m+n) time, which the problem's complexity bound explicitly forbids.

**Optimal approach.** The median splits a dataset into a left half and a right half of equal size, where every element on the left <= every element on the right. Binary-search the partition index i in the *smaller* array, A. If A is cut at i, the cut j in B is forced: j = half_total − i. Read the four border values — Aleft = A[i−1], Aright = A[i], Bleft = B[j−1], Bright = B[j] (using ±infinity past the array edges) — and check the partition is valid: Aleft <= Bright and Bleft <= Aright. If Aleft > Bright, you took too much from A — search left (R = i − 1). If Bleft > Aright, you took too little from A — search right (L = i + 1). Once valid, the median is either the min of the two right borders (odd total) or the average of the max-left and min-right borders (even total).

\`\`\`viz:table-diff
{
  "columns": ["A_left", "A_right", "B_left", "B_right", "valid?"],
  "before": [[1, 3, 9, 10, "no — B_left > A_right"]],
  "after": [[3, 8, 7, 9, "yes"]],
  "caption": "Median of Two Sorted Arrays — A=[1,3,8], B=[7,9,10,11]. Trial i=1 fails the cross-check; trial i=2 balances both arrays. Total is odd, so the median is min(A_right, B_right) = min(8, 9) = 8."
}
\`\`\`

**Complexity.** O(log(min(m, n))) time — binary search runs over the smaller array only — O(1) space, versus the O(m+n) merge.

**Thread.** That closes the chapter. Every problem here found a predicate that flips exactly once across some space — an array, an answer range, a rotation seam, a timestamp history, a partition — and halved its way to the flip point. Next, **Linked List** trades random access away entirely: no more indexing into the middle, only pointers you can follow one hop at a time.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Median of Two Sorted Arrays, what are we actually binary searching for?",
          options: ["The median element in the larger array.", "The median element in the smaller array.", "A partition line that perfectly balances the left and right halves of both arrays combined.", "The midpoint of the combined, merged array."],
          correct_index: 2,
          model_answer: "We binary search for a partition index in the smaller array. The partition ensures the left and right halves have the correct number of elements, and we verify it by checking cross-boundary elements.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "Why do we always choose to run the binary search on the smaller of the two arrays?",
          model_answer: "To minimize the search space. Binary searching the smaller array takes O(log(min(m, n))) time, and it prevents out-of-bounds errors when calculating the partition index for the larger array.",
          difficulty: "intermediate"
        }
      ]
    },
  ],
};
