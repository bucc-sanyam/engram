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
    /* ------------------------------------------------------------------ */
    /*  1. BINARY SEARCH                                                  */
    /* ------------------------------------------------------------------ */
    {
      slug: "binary-search",
      title: "Binary Search",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/binary-search",
      summary:
        "The canonical halving loop — and the invariant decisions that end all off-by-one suffering.",
      body: `**Problem Statement**
Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

*Example:*
\`\`\`
Input:  nums = [-1, 0, 3, 5, 9, 12], target = 9
Output: 4
\`\`\`

---

**Building Intuition**
Linear scan takes O(n). But the array is sorted. If we look at the middle element, we can determine which half the target must lie in, eliminating half the remaining elements in a single O(1) step.

---

**Finding the Pattern**
Decide once what \`L\` and \`R\` mean: they bracket the candidates **still alive**, inclusive on both ends.

\`\`\`
Loop while L <= R:
    mid = (L + R) / 2
    If nums[mid] == target: found it!
    If nums[mid] < target: target must be to the right → L = mid + 1
    If nums[mid] > target: target must be to the left  → R = mid - 1
\`\`\`

Every classic bug comes from violating this invariant — e.g., setting \`R = mid\` when you already know \`mid\` isn't the target (hello infinite loop).

---

**Visualisation**
\`nums = [-1, 0, 3, 5, 9, 12]\`, \`target = 9\`:
\`\`\`
 L                R
[-1, 0, 3, 5, 9, 12]    mid = (0+5)/2 = 2 → nums[2]=3
           3 < 9 → target is right of mid. L = mid + 1 = 3

             L    R
[-1, 0, 3, 5, 9, 12]    mid = (3+5)/2 = 4 → nums[4]=9
           9 == 9 → FOUND at index 4!
\`\`\`

---

**Code & Complexity**
\`\`\`python
def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = l + (r - l) // 2  # prevents overflow
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1
\`\`\`

- **Time:** O(log n)
- **Space:** O(1)`,
    },
    /* ------------------------------------------------------------------ */
    /*  2. SEARCH A 2D MATRIX                                             */
    /* ------------------------------------------------------------------ */
    {
      slug: "search-a-2d-matrix",
      title: "Search a 2D Matrix",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/search-2d-matrix",
      summary:
        "Rows sorted, rows stacked in order — the grid is just one sorted array wearing a disguise.",
      body: `**Problem Statement**
You are given an \`m x n\` integer matrix \`matrix\` with two properties:
1. Each row is sorted in non-decreasing order.
2. The first integer of each row is greater than the last integer of the previous row.

Given an integer \`target\`, return \`true\` if \`target\` is in \`matrix\` or \`false\` otherwise.

*Example:*
\`\`\`
Input: matrix = [[1,3,5,7],
                 [10,11,16,20],
                 [23,30,34,60]], target = 3
Output: true
\`\`\`

---

**Building Intuition**
The double promise is the tell: if you flattened this matrix into a 1D array, it would be perfectly sorted! \`[1,3,5,7,10,11,16,20,23,30,34,60]\`. We can just run binary search on this virtual 1D array.

---

**Finding the Pattern / Virtual Indexing**
We pretend the matrix is a 1D array of length \`m * n\`.
Indices go from \`0\` to \`m * n - 1\`.

To translate a virtual 1D index \`mid\` into 2D \`(row, col)\` coordinates:
\`\`\`
row = mid // COLS
col = mid % COLS
\`\`\`

---

**Visualisation**
\`target = 3\`
\`\`\`
Virtual array length: 3x4 = 12 (indices 0..11)
L=0, R=11

Step 1: mid = (0+11)//2 = 5
        row = 5 // 4 = 1
        col = 5 % 4 = 1
        matrix[1][1] = 11
        11 > 3 → target is left → R = mid - 1 = 4

Step 2: L=0, R=4
        mid = (0+4)//2 = 2
        matrix[0][2] = 5
        5 > 3 → R = mid - 1 = 1

Step 3: L=0, R=1
        mid = 0
        matrix[0][0] = 1
        1 < 3 → L = mid + 1 = 1

Step 4: L=1, R=1
        mid = 1
        matrix[0][1] = 3 == 3! ✓
\`\`\`

---

**Code & Complexity**
\`\`\`python
def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    ROWS, COLS = len(matrix), len(matrix[0])
    l, r = 0, ROWS * COLS - 1
    
    while l <= r:
        mid = l + (r - l) // 2
        row, col = mid // COLS, mid % COLS
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] < target:
            l = mid + 1
        else:
            r = mid - 1
            
    return False
\`\`\`

- **Time:** O(log(m * n))
- **Space:** O(1)`,
    },
    /* ------------------------------------------------------------------ */
    /*  3. KOKO EATING BANANAS                                            */
    /* ------------------------------------------------------------------ */
    {
      slug: "koko-eating-bananas",
      title: "Koko Eating Bananas",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/eating-bananas",
      summary:
        "No array to search — so binary-search the answer itself, steered by a monotone yes/no test.",
      body: `**Problem Statement**
Koko loves to eat bananas. There are \`n\` piles of bananas, where the \`i-th\` pile has \`piles[i]\` bananas. The guards have gone and will come back in \`h\` hours. Koko can decide her bananas-per-hour eating speed of \`k\`. Each hour, she chooses some pile and eats \`k\` bananas from it. If the pile has less than \`k\` bananas, she eats all of them instead and will not eat any more bananas during this hour.

Return the *minimum* integer \`k\` such that she can eat all the bananas within \`h\` hours.

*Example:*
\`\`\`
Input: piles = [3,6,7,11], h = 8
Output: 4
\`\`\`

---

**Building Intuition**
There is no sorted array here — until you build one in your head. The possible speeds \`k\` range from \`1\` to \`max(piles)\` (eating faster than the biggest pile doesn't save any more time).

For any speed \`k\`, we can calculate how many hours it takes.
- Speed 1: takes forever (too slow) → Fails
- Speed max(piles): takes \`len(piles)\` hours (very fast) → Succeeds

Feasibility is **monotone**: F, F, F, T, T, T, T...
We want to find the *first T*. This is binary search on the answer space.

---

**Finding the Pattern**
1. Define the search space: \`L = 1\`, \`R = max(piles)\`
2. Define the feasibility function \`canFinish(k)\`:
   \`hours = sum(math.ceil(p / k) for p in piles)\`
3. Binary Search:
   - If \`canFinish(mid)\` is True: \`mid\` works, but maybe a slower speed works too. Record \`mid\` as answer, go left (\`R = mid - 1\`).
   - If False: \`mid\` is too slow. Go right (\`L = mid + 1\`).

---

**Visualisation**
\`piles = [3,6,7,11]\`, \`h = 8\`
Speeds range \`1..11\`.

\`\`\`
Speed:     1  2  3  4  5  6  7  8  9 10 11
Feasible?  F  F  F  T  T  T  T  T  T  T  T
                    ↑ (first T)
\`\`\`

Test mid = 6:
Hours = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6) = 1+1+2+2 = 6 <= 8 (True!)
Can we go slower? Search left [1..5].

Test mid = 3:
Hours = ceil(3/3)+ceil(6/3)+ceil(7/3)+ceil(11/3) = 1+2+3+4 = 10 > 8 (False!)
Must go faster. Search right [4..5].

Test mid = 4:
Hours = 1+2+2+3 = 8 <= 8 (True!)
Record 4, search left... finds no better. Answer = 4.

---

**Code & Complexity**
\`\`\`python
import math
def minEatingSpeed(piles: list[int], h: int) -> int:
    l, r = 1, max(piles)
    res = r
    while l <= r:
        k = l + (r - l) // 2
        
        hours = 0
        for p in piles:
            hours += math.ceil(p / k)
            
        if hours <= h:
            res = k
            r = k - 1   # try to go slower (smaller k)
        else:
            l = k + 1   # must go faster
    return res
\`\`\`

- **Time:** O(N * log(max(P))) where N is len(piles), P is max pile.
- **Space:** O(1)`,
    },
    /* ------------------------------------------------------------------ */
    /*  4. FIND MINIMUM IN ROTATED SORTED ARRAY                           */
    /* ------------------------------------------------------------------ */
    {
      slug: "find-minimum-in-rotated-sorted-array",
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      neetcodeUrl:
        "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array",
      summary:
        "A rotated array is two sorted runs; compare mid to the right end to find the seam.",
      body: `**Problem Statement**
Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times. For example, \`[0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\`. Given the sorted rotated array \`nums\` of unique elements, return the minimum element in O(log n) time.

*Example:*
\`\`\`
Input: nums = [4,5,6,7,0,1,2]
Output: 0
\`\`\`

---

**Building Intuition**
Rotation damages sortedness but doesn't destroy it: the array is exactly two ascending runs, with the first run entirely larger than the second run. The minimum element is the *seam* where the first run drops into the second run.

---

**Finding the Pattern**
Compare \`nums[mid]\` against the **rightmost** element \`nums[R]\`.
1. If \`nums[mid] > nums[R]\`: We are in the big first run. The drop (minimum) must be to our right. → \`L = mid + 1\`
2. If \`nums[mid] <= nums[R]\`: We are in the small second run. The drop is at \`mid\` or to our left. → \`R = mid\` (keep mid alive, it might be the min!)

When \`L == R\`, we've pinned the minimum.

---

**Visualisation**
\`nums = [4,5,6,7,0,1,2]\`
\`\`\`
 L         mid       R
[4, 5, 6, 7, 0, 1, 2]
nums[mid]=7. Is 7 > 2? YES. We are in the left big chunk.
Drop is to the right. L = mid+1 = 4.

             L mid   R
[4, 5, 6, 7, 0, 1, 2]
nums[mid]=1. Is 1 > 2? NO. We are in the right small chunk.
Drop is at mid or left. R = mid = 5.

             L R
             m
[4, 5, 6, 7, 0, 1, 2]
nums[mid]=0. Is 0 > 1? NO. R = mid = 4.
L==R (4==4). Loop ends. Min is nums[4] = 0.
\`\`\`

---

**Code & Complexity**
\`\`\`python
def findMin(nums: list[int]) -> int:
    l, r = 0, len(nums) - 1
    
    while l < r:
        mid = l + (r - l) // 2
        # Compare to rightmost element
        if nums[mid] > nums[r]:
            l = mid + 1
        else:
            r = mid
            
    return nums[l]
\`\`\`

- **Time:** O(log n)
- **Space:** O(1)`,
    },
    /* ------------------------------------------------------------------ */
    /*  5. SEARCH IN ROTATED SORTED ARRAY                                 */
    /* ------------------------------------------------------------------ */
    {
      slug: "search-in-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      neetcodeUrl:
        "https://neetcode.io/problems/find-target-in-rotated-sorted-array",
      summary:
        "At every step one half is perfectly sorted — check if the target lives there.",
      body: `**Problem Statement**
Given a rotated sorted array \`nums\` of unique elements and a \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not. Must be O(log n) time.

*Example:*
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
\`\`\`

---

**Building Intuition**
Cut the array at \`mid\`. One side *must* be perfectly sorted (no seam). The other side has the seam.
We can use the sorted half to interrogate: "Is the target inside your range?" Since it's sorted, we just check its boundaries. If yes, target is there. If no, target *must* be in the messy half.

---

**Finding the Pattern**
1. Check if left half is sorted: \`nums[L] <= nums[mid]\`
   - Is target in left half? \`nums[L] <= target < nums[mid]\`
   - If yes: \`R = mid - 1\`
   - If no: \`L = mid + 1\`
2. Else (right half is sorted):
   - Is target in right half? \`nums[mid] < target <= nums[R]\`
   - If yes: \`L = mid + 1\`
   - If no: \`R = mid - 1\`

---

**Visualisation**
\`nums = [4,5,6,7,0,1,2]\`, \`target = 0\`
\`\`\`
 L         mid       R
[4, 5, 6, 7, 0, 1, 2]
nums[mid] = 7.
Is left half sorted? nums[0]=4 <= 7. YES.
Is target 0 inside [4..7]? NO.
Therefore, target MUST be in right half. L = mid + 1 = 4.

             L  mid  R
[4, 5, 6, 7, 0, 1, 2]
nums[mid] = 1.
Is left half sorted? nums[4]=0 <= 1. YES.
Is target 0 inside [0..1]? YES (0 <= 0 < 1).
Target MUST be in left half. R = mid - 1 = 4.

             L
             R
             m
[4, 5, 6, 7, 0, 1, 2]
nums[mid] = 0 == target! Found at index 4.
\`\`\`

---

**Code & Complexity**
\`\`\`python
def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    
    while l <= r:
        mid = l + (r - l) // 2
        if nums[mid] == target:
            return mid
            
        # Left portion is sorted
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]:
                r = mid - 1
            else:
                l = mid + 1
        # Right portion is sorted
        else:
            if nums[mid] < target <= nums[r]:
                l = mid + 1
            else:
                r = mid - 1
                
    return -1
\`\`\`

- **Time:** O(log n)
- **Space:** O(1)`,
    },
    /* ------------------------------------------------------------------ */
    /*  6. TIME BASED KEY VALUE STORE                                     */
    /* ------------------------------------------------------------------ */
    {
      slug: "time-based-key-value-store",
      title: "Time Based Key Value Store",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/time-based-key-value-store",
      summary:
        "Histories append in time order — so 'latest value at or before t' is a right-boundary search.",
      body: `**Problem Statement**
Design a store with \`set(key, value, timestamp)\` and \`get(key, timestamp)\`. The \`get\` returns the value with the *largest timestamp <= requested timestamp*, or \`""\` if it doesn't exist.
*Timestamps in \`set\` are strictly increasing.*

*Example:*
\`\`\`
set("foo", "bar", 1)
get("foo", 1) → "bar"
get("foo", 3) → "bar" (1 is largest <= 3)
set("foo", "bar2", 4)
get("foo", 4) → "bar2"
get("foo", 5) → "bar2"
\`\`\`

---

**Building Intuition**
The problem guarantees timestamps arrive strictly increasing. If we store a list of \`(timestamp, value)\` pairs for each key, the list is automatically sorted. Searching for a boundary in a sorted list is exactly what binary search does.

---

**Finding the Pattern**
We want the rightmost entry where \`entry_time <= target_time\`.
- If \`mid_time <= target_time\`: this is a valid candidate! Save it as \`best\`, and search right (\`L = mid + 1\`) to see if there's a *closer* valid timestamp.
- If \`mid_time > target_time\`: invalid. Search left (\`R = mid - 1\`).

---

**Code & Complexity**
\`\`\`python
class TimeMap:
    def __init__(self):
        # key: str -> list of (timestamp, value)
        self.store = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.store:
            self.store[key] = []
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        res = ""
        values = self.store.get(key, [])
        l, r = 0, len(values) - 1
        
        while l <= r:
            mid = l + (r - l) // 2
            if values[mid][0] <= timestamp:
                res = values[mid][1]
                l = mid + 1  # try to find a closer, larger valid time
            else:
                r = mid - 1
                
        return res
\`\`\`

- **Time:** O(1) for \`set\`, O(log N) for \`get\` (N is entries per key).
- **Space:** O(total entries) memory.`,
    },
    /* ------------------------------------------------------------------ */
    /*  7. MEDIAN OF TWO SORTED ARRAYS                                    */
    /* ------------------------------------------------------------------ */
    {
      slug: "median-of-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/median-of-two-sorted-arrays",
      summary:
        "Binary-search the partition: cut both arrays so left halves balance right halves.",
      body: `**Problem Statement**
Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.
The overall run time complexity should be O(log (m+n)).

*Example:*
\`\`\`
Input: nums1 = [1,3], nums2 = [2]
Output: 2.0 (median of [1,2,3] is 2)
\`\`\`

---

**Building Intuition**
Merging takes O(m+n). To get logarithmic time, we must stop searching for a *value* and search for a **partition**.
The median splits a dataset into a left half and a right half of equal size, where every element on the left <= every element on the right.

---

**Finding the Pattern**
We only need to binary-search the partition index \`i\` in the *smaller* array (let's say A).
If we cut A at \`i\`, the cut \`j\` in array B is forced: \`j = half_total - i\`.

\`\`\`
A_left = A[i-1],  A_right = A[i]
B_left = B[j-1],  B_right = B[j]
\`\`\`

Valid partition condition (no leaking cross-cuts):
- \`A_left <= B_right\`
- \`B_left <= A_right\`

If \`A_left > B_right\`, we took too much from A. Go left: \`R = i - 1\`.
If \`B_left > A_right\`, we took too little from A. Go right: \`L = i + 1\`.
Use \`-infinity\` and \`+infinity\` for edges to avoid out-of-bounds checks.

---

**Visualisation**
\`A = [1, 3, 8]\`, \`B = [7, 9, 10, 11]\`
Total = 7. Half = 7 // 2 = 3.

\`\`\`
Try i = 2. Forced j = 3 - 2 = 1.
A: [1, 3 | 8]     A_left=3, A_right=8
B: [7 | 9, 10, 11] B_left=7, B_right=9

Check: A_left (3) <= B_right (9) ✓
       B_left (7) <= A_right (8) ✓
Valid partition!
Median is max(A_left, B_left) = max(3, 7) = 7.
\`\`\`

---

**Code & Complexity**
\`\`\`python
def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    A, B = nums1, nums2
    if len(A) > len(B):
        A, B = B, A
        
    total = len(A) + len(B)
    half = total // 2
    
    l, r = 0, len(A)
    while True:
        i = l + (r - l) // 2 # A
        j = half - i         # B
        
        Aleft = A[i-1] if i > 0 else float('-inf')
        Aright = A[i] if i < len(A) else float('inf')
        Bleft = B[j-1] if j > 0 else float('-inf')
        Bright = B[j] if j < len(B) else float('inf')
        
        # Partition is correct
        if Aleft <= Bright and Bleft <= Aright:
            # odd total length
            if total % 2:
                return min(Aright, Bright)
            # even total length
            return (max(Aleft, Bleft) + min(Aright, Bright)) / 2
            
        elif Aleft > Bright:
            r = i - 1
        else:
            l = i + 1
\`\`\`

- **Time:** O(log(min(m, n)))
- **Space:** O(1)`,
    },
  ],
};
