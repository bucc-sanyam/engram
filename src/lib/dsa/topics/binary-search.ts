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
  intro: `Two Pointers taught you that order lets a comparison retire one candidate. Binary Search is that idea pushed to its logical extreme: aim your comparison at the *middle* of what remains, and one question retires half of everything. Twenty questions crack a million candidates; forty crack a trillion. Logarithms are the closest thing computing has to magic, and this chapter is about learning to see them where nobody drew them for you.

Because that is the real skill here. The textbook version — find a target in a sorted array — is the first problem and takes ten minutes to learn (though the off-by-one traps around *lo*, *hi*, and loop exit have humbled generations; we will name them precisely). Everything after that is about recognising binary search wearing disguises. A 2-D matrix that is secretly one sorted line. A rotated array where *half* is always sorted — you just have to identify which half, every step. A timestamped history where you want the closest value *at or before* a moment. And then the chapter's biggest idea: **binary search on the answer space**. Koko Eating Bananas never hands you an array at all — you invent one, the range of possible eating speeds, and search *it*, guided by a yes/no feasibility question that is monotone: too slow fails, fast enough succeeds, and the boundary between them is the answer. Once you see that trick, half the "minimise the maximum" problems in existence dissolve.

The chapter ends at Median of Two Sorted Arrays, the classic hard problem where you binary-search a *partition point* — not looking for an element, but for the cut that balances two arrays against each other.

The through-line to hold onto: binary search needs sortedness only in one abstract sense — a predicate that flips once, from false to true, across the search space. Find the flip point. On the roadmap, this chapter unlocks Trees, and the connection is genealogical: a binary search tree *is* binary search, frozen into a shape you can insert into.`,
  problems: [
    {
      slug: "binary-search",
      title: "Binary Search",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/binary-search",
      summary: "The canonical halving loop — and the two invariant decisions that end all off-by-one suffering.",
      body: `**The problem.** A sorted array, a target: return its index or −1. You already know the shape — look at the middle, go left or right. The reason to slow down on an "easy" problem is that binary search is famously the algorithm everyone knows and half of us get subtly wrong: study after study has found broken midpoints, infinite loops, and off-by-ones in production implementations.

**The discipline.** All the suffering comes from vagueness about one thing: *what do lo and hi mean?* Decide once, explicitly: they bracket the candidates still alive, inclusive on both ends. Everything else follows mechanically. Loop while lo ≤ hi — the space is non-empty. Take mid between them. If the value at mid is the target, done. Too small? Then mid *and everything left of it* are dead: lo becomes mid + 1. Too large: hi becomes mid − 1. Both branches shrink the space by at least one, so the loop terminates; when lo passes hi, the space is empty and the answer is −1. Every classic bug is a violation of the stated invariant — setting hi to mid (keeping a candidate you proved dead, hello infinite loop), or looping on strict inequality (abandoning a live candidate).

**The walk-through.** [-1, 0, 3, 5, 9, 12], target 9. lo 0, hi 5, mid 2 → 3 too small → lo 3. mid 4 → 9 — found, index 4. Two questions, six elements. At a million elements it is twenty questions; that ratio is the entire religion.

**One production detail.** Computing the midpoint as (lo + hi) / 2 can overflow fixed-size integers in some languages; lo + (hi − lo) / 2 cannot. In JavaScript or Python it does not bite, but saying it signals you have met real systems.

**Complexity.** O(log n) time, O(1) space.

**The thread.** That is the tool. The rest of the chapter is target practice at increasingly hidden sortedness — starting with an array that has folded itself into two dimensions.`,
    },
    {
      slug: "search-a-2d-matrix",
      title: "Search a 2D Matrix",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/search-2d-matrix",
      summary: "Rows sorted, rows stacked in order — so the grid is one sorted array wearing a disguise.",
      body: `**The problem.** A matrix where each row is sorted *and* each row begins after the previous row ends. Find a target. The double promise is the tell: this is not really a matrix problem.

**The insight.** Read the cells left-to-right, top-to-bottom, and the two properties guarantee the sequence is one single sorted list that somebody folded into rows. Binary search does not care about the fold. Run the standard loop over indexes 0 to rows×cols − 1, and translate each abstract index to a cell when you need to compare: row = index ÷ cols (integer division), column = index mod cols. That division/modulo pair is the inverse of the fold — the same coordinate arithmetic that named Sudoku's boxes back in chapter one, now used to *flatten* instead of to group.

**The walk-through.** Matrix [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target 3. Virtual array has 12 slots. mid = 5 → cell (1, 1) = 11, too big → hi = 4. mid = 2 → (0, 2) = 5, too big → hi = 1. mid = 0 → 1, too small → lo = 1. mid = 1 → (0, 1) = 3. Found, four probes.

**The two-phase alternative.** Binary-search which row could contain the target (by first-and-last elements), then binary-search within that row. Also O(log m + log n) — which is the *same* number as log(m·n), a tidy little identity — and arguably easier to explain. Choose either; know both exist. The single-search version has fewer edge cases; the two-phase version generalises to matrices where only the row-internal sort holds.

**What interviewers are probing.** Whether you translate between coordinate systems without flinching, and whether you notice that the "matrix" framing is decoration. The moment you say "this is a sorted array of length m times n," the problem is over.

**Complexity.** O(log(m·n)) time, O(1) space.

**The thread.** Twice now the sorted thing was handed to you. Koko Eating Bananas, next, hands you *nothing* — no array anywhere — and asks you to conjure the sorted space yourself out of the range of possible answers.`,
    },
    {
      slug: "koko-eating-bananas",
      title: "Koko Eating Bananas",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/eating-bananas",
      summary: "No array to search — so binary-search the answer itself, steered by a monotone yes/no test.",
      body: `**The problem.** Koko has piles of bananas and h hours; each hour she picks one pile and eats k bananas from it (a pile smaller than k still burns the full hour). Find the *minimum* speed k that finishes everything in time. Piles [3,6,7,11], h = 8 → k = 4.

**The insight.** There is no sorted array here — until you build one in your head. Consider the space of all possible speeds, 1 up to the largest pile. For any candidate speed you can *check* feasibility cheaply: hours needed = sum over piles of ⌈pile / k⌉; feasible iff that total is ≤ h. Now the crucial observation: feasibility is **monotone** in k. Eating faster never hurts — if speed k works, every speed above it works too. So the answer space looks like FFFF…TTTT — a wall of failures, then a wall of successes — and the answer is the *first T*. Finding the flip point of a monotone predicate is binary search's abstract job description. Search speeds, not positions; the "array element" at index k is the result of running the feasibility check.

**The walk-through.** Speeds 1..11. Try 6: hours = 1+1+2+2 = 6 ≤ 8, feasible — but maybe slower works; go left, remembering 6. Try 3: 1+2+3+4 = 10 > 8, infeasible — go right. Try 4: 1+2+2+3 = 8 ≤ 8, feasible — go left. Try… space exhausts; minimum feasible was 4.

**Why this problem is the chapter's hinge.** "Minimise the maximum," "maximise the minimum," "smallest capacity/speed/radius that satisfies X" — a giant family of optimisation problems all yield to this exact template: bound the answer range, write the O(n) feasibility check, confirm monotonicity aloud, binary-search the boundary. You will use it for shipping capacities, split-array problems, and later in this atlas for Swim in Rising Water — as an alternative solution — in Advanced Graphs.

**Complexity.** O(n · log(maxPile)) time — a linear check per halving — O(1) space.

**The thread.** Next the sortedness comes back *broken*: a sorted array someone rotated. The order is damaged — but only half-damaged, and that residue of structure is enough.`,
    },
    {
      slug: "find-minimum-in-rotated-sorted-array",
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array",
      summary: "A rotated array is two sorted runs; compare mid to the right end and walk toward the seam.",
      body: `**The problem.** A sorted array was rotated at some unknown pivot: [1,2,3,4,5] became, say, [3,4,5,1,2]. Find the minimum in O(log n). The minimum is the *seam* — the one place where order breaks, where the second sorted run begins.

**The insight.** Rotation damages sortedness but does not destroy it: the array is exactly two ascending runs, with every element of the first run larger than every element of the second. Stand at mid and compare against the *rightmost* element. If mid's value is greater, you are in the first (high) run, and the seam lies strictly to your right: lo = mid + 1. If mid's value is less, you are in the second run — the seam is at mid or to its left: hi = mid (keep mid alive; it might *be* the minimum). This is the flip-point search again — the predicate "am I in the second run?" reads FFFF…TTTT across the array, and the first T is the answer. When lo meets hi, they sit on the seam.

**Why compare to the right end, not the left?** Symmetry breaks in an unrotated array: comparing left, mid > leftmost is true in both runs and tells you nothing. Comparing right is decisive in every case, including the zero-rotation case where the whole array is one run and hi glides leftward to index 0. Choosing the informative comparison *is* the problem.

**The walk-through.** [4,5,6,7,0,1,2]: mid 7 > right 2 → seam right of mid → lo lands among [0,1,2]. mid 1 < 2 → hi = that position. mid 0 < 1 → hi tightens. lo = hi on 0. Found in three comparisons.

**Complexity.** O(log n) time, O(1) space. (With duplicates allowed, equal mid/right comparisons become uninformative and the guarantee degrades to O(n) — a known variant, good to mention.)

**The thread.** You can now *locate the seam*. The next problem asks for an arbitrary target in the same rotated terrain — and the move is to notice that at every step, one half of your current range is always intact.`,
    },
    {
      slug: "search-in-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/find-target-in-rotated-sorted-array",
      summary: "At every step one half is perfectly sorted — check if the target lives there, and discard accordingly.",
      body: `**The problem.** The same rotated sorted array — now find a *target* value's index, still in O(log n). [4,5,6,7,0,1,2], target 0 → index 4.

**The insight.** Cut the current range at mid and something lovely is always true: **at least one of the two halves is a perfectly sorted run.** The seam — the one break in order — can only be in one place, so the other side is intact. And you can tell which in O(1): if the leftmost value ≤ mid's value, the left half is sorted; otherwise the right half is. Now use the sorted half not to search it, but to *interrogate* it: a sorted range with known endpoints can answer "is the target inside you?" instantly. If yes, discard the other half and recurse into order. If no, the target — if it exists — must be in the messy half; discard the sorted one. Either way, half the world dies per step, which is all binary search ever asked for.

**The walk-through.** [4,5,6,7,0,1,2], target 0. mid = 7; left half [4..7] is sorted (4 ≤ 7). Is 0 in [4, 7]? No → discard left, keep [0,1,2]. mid = 1; left half [0..1] sorted; is 0 in [0, 1]? Yes → keep it. mid = 0 → found at index 4.

**The pitfalls.** Two, both boundary-flavoured: use ≤ (not <) when testing "is the left half sorted" so single-element halves classify correctly; and make the containment checks half-open with care so the target being *equal* to an endpoint is not dropped. If your version loops forever on two-element ranges, the sortedness test is the suspect — it almost always is.

**Complexity.** O(log n) time, O(1) space. (The lazier two-pass plan — find the seam with the previous problem, then run plain binary search in the correct run — is also O(log n) and entirely legitimate; the one-pass version just shows finer control.)

**The thread.** So far each query stood alone. Time Based Key Value Store, next, embeds binary search inside a *system*: many keys, each with a timestamped history, and queries that want "the latest value at or before t" — the flip-point question, asked as an API.`,
    },
    {
      slug: "time-based-key-value-store",
      title: "Time Based Key Value Store",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/time-based-key-value-store",
      summary: "Histories append in time order — so 'latest value at or before t' is a right-boundary binary search.",
      body: `**The problem.** Design a store with set(key, value, timestamp) and get(key, timestamp) — where get returns the value with the *largest timestamp at or before* the requested one, or empty string if the key's history starts later. A tiny version-controlled database.

**The structural gift.** The problem guarantees timestamps arrive strictly increasing. So the design writes itself: a hash map from key to an *append-only list* of (timestamp, value) pairs. Every set is an O(1) push onto that key's list — and the list is sorted by construction, no sorting ever performed. Sortedness you get for free is still sortedness; noticing it is the design step.

**The query.** get asks for the last entry with timestamp ≤ t. That is a binary search for a *boundary*, not an exact hit — the predicate "entry's timestamp ≤ t" reads TTTT…FFFF over the list, and you want the last T. Run the search keeping a best-so-far: when mid's timestamp is ≤ t, record mid as a candidate and go right (a later entry might also qualify); when it is > t, go left. The loop ends with the rightmost qualifier — or nothing, the before-history case that returns empty string. Exact-match binary search finds *a* position; boundary binary search finds an *edge*. Interviews lean on the second kind far more, and this problem is its cleanest industrial dressing.

**The walk-through.** History for "foo": (1, "bar"), (4, "bar2"). get("foo", 3): mid (1,"bar") ≤ 3 → candidate, go right; (4,…) > 3 → go left; done → "bar". get("foo", 4) → lands on "bar2". get("foo", 0) → no candidate → "".

**Complexity.** set O(1); get O(log h) for a history of length h; space O(total sets). This is, incidentally, how real systems think — MVCC databases and Git both answer "state as of time t" against append-only sorted history.

**The thread.** One search remains — the famous one. Median of Two Sorted Arrays stops searching for values entirely and searches for a *cut*: the partition that splits two arrays into balanced halves.`,
    },
    {
      slug: "median-of-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/median-of-two-sorted-arrays",
      summary: "Binary-search the partition: cut both arrays so left halves balance right halves, and the median falls out.",
      body: `**The problem.** Two sorted arrays; find the median of their union in O(log(m+n)) — pointedly faster than the O(m+n) merge everyone can write. The classic closer of binary search chapters everywhere, because it forces the final abstraction: searching over *configurations* instead of elements.

**The reframe.** The median is a statement about a *partition*: split the combined multiset into a left half and right half of equal size (left one larger, if odd) such that everything left ≤ everything right. The median is then read off the boundary — max of the left halves, or the average of the two boundary values when even. So stop hunting a value. Hunt the partition.

**The insight.** A partition is fully described by one number: cut the shorter array after i elements, and the longer array's cut j is forced (i + j must equal half the total). So there are only shortLength + 1 candidate cuts — binary-search them. A cut is *correct* when neither side leaks: the last element left of the cut in array A must be ≤ the first element right of the cut in array B, and vice versa. If A's left-max exceeds B's right-min, the cut takes too much from A — move i left. The opposite imbalance moves it right. The predicate is monotone across cuts, so the flip point exists and halving finds it. Empty sides are handled by treating missing values as ∓infinity — the trick that makes the edge cases uniform instead of special.

**The walk-through.** A = [1, 3], B = [2]. Total 3, left half size 2. Try i = 1: A-left [1], forced j = 1: B-left [2]. Check: 1 ≤ (B right = ∞) ✓; 2 ≤ (A right = 3) ✓. Valid cut → median = max(1, 2) = 2.

**Complexity.** O(log(min(m, n))) time — search only the shorter array's cuts — O(1) space.

**The thread.** The chapter's arc is complete: search an array, search a folded array, search an *invented* answer space, search broken order, search history, search partitions. Next chapter that halving instinct grows a physical body — Trees, where every node you stand on *is* a binary-search comparison, and the structure remembers all of them.`,
    },
  ],
};
