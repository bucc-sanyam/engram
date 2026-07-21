import type { DsaTopic } from "../types";

/** Chapter 17 — Math & Geometry: grids, digits, and clean coordinate thinking. */
export const mathGeometry: DsaTopic = {
  slug: "math-geometry",
  title: "Math & Geometry",
  chapter: 17,
  tagline: "Rotate, spiral, carry, and count — the problems where the trick is a coordinate identity.",
  color: "#e6c9a3",
  prereqs: ["graphs", "bit-manipulation"],
  unlocks: [],
  intro: `Every other chapter in this atlas is organised around a *technique*. This one is organised around a *temperament*: problems whose crux is not an algorithmic pattern but a clean piece of arithmetic or coordinate insight — the kind you either see, or grind past with triple the code. That makes the chapter deceptively dangerous: nothing here needs a heap or a DP table, yet these problems produce more off-by-one bugs per line than any other family. The skill being trained is **exactness** — walking boundaries, carries, and transformations without a single index slipping.

Three mini-families share the eight problems. The **grid transformations**: Rotate Image (a rotation is a transpose followed by a mirror — one identity replacing pages of index gymnastics), Spiral Matrix (four shrinking boundaries walked in strict order), and Set Matrix Zeroes (in-place marking that reuses the matrix's own first row and column as its scratchpad — the borrow-your-own-storage trick). The **digit-and-number problems**: Plus One (the carry ripple, schoolbook addition's smallest case), Happy Number (a digit process that either converges or *cycles* — and cycle detection is Floyd's tortoise and hare from the Linked List chapter, returning for a curtain call on pure numbers), Pow(x, n) (fast exponentiation by squaring — the halving instinct from Binary Search applied to arithmetic), and Multiply Strings (grade-school multiplication industrialised: the digit-position identity i + j and i + j + 1 doing all the work). And one **geometry-with-hashing** closer: Detect Squares, where chapter one's point-counting map meets a diagonal insight — fix two opposite corners and the other two are determined.

The chapter's roadmap position — after Graphs and Bit Manipulation — reflects its role as a finishing ground: the traversal discipline and bit-level comfort feed directly into the exactness these problems demand. Expect at least one of them in almost any onsite loop; they are beloved screening questions precisely because they cannot be pattern-matched — only *executed cleanly*.`,
  problems: [
    {
      slug: "rotate-image",
      title: "Rotate Image",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/rotate-matrix",
      summary: "Rotate 90° in place: transpose across the diagonal, then mirror each row — two simple moves, no index acrobatics.",
      body: `**Signal.** "Rotate an n×n matrix 90° clockwise, **in place**" — the in-place clause is the whole problem: chasing the rotation mapping (row,col)→(col,n-1-row) directly means fiddly four-way swap cycles, which is the tell to decompose the transformation into two simpler, independently-obvious operations instead.

**Brute force.** Allocate a second n×n matrix and write each element directly to its rotated position — O(n²) time and space, correct but violates the in-place requirement the problem is testing.

**Optimal approach.** Rotation = **transpose, then mirror horizontally**. Transpose swaps (r, c) with (c, r) — flip across the main diagonal. Mirroring reverses each row — (r, c) becomes (r, n−1−c). Compose them: (r, c) → (c, r) → (c, n−1−r) — exactly the rotation map. Two operations, each trivially in-place and independently verifiable at a glance. The one bug to name: transposing with a full double loop swaps every pair *twice*, restoring the original — the inner loop must start at c = r + 1, strictly above the diagonal.

\`\`\`viz:table-diff
{
  "columns": ["Step", "Row 0", "Row 1", "Row 2"],
  "before": [["Original", "1, 2, 3", "4, 5, 6", "7, 8, 9"], ["After transpose", "1, 4, 7", "2, 5, 8", "3, 6, 9"]],
  "after": [["After mirroring each row", "7, 4, 1", "8, 5, 2", "9, 6, 3"]],
  "caption": "Rotate Image — transpose flips across the diagonal, then mirroring each row completes the 90° clockwise rotation. Corner check: 1 moved top-left → top-right; 7 moved bottom-left → top-left."
}
\`\`\`

**Complexity.** O(n²) time — every element moves — O(1) space, versus O(n²) space for a second matrix.

**Thread.** One transformation, decomposed. Spiral Matrix, next, is the opposite discipline: no identity saves you — just four boundaries, tightened with perfect manners.`,
    },
    {
      slug: "spiral-matrix",
      title: "Spiral Matrix",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/spiral-matrix",
      summary: "Four boundaries — top, bottom, left, right — walked in order and tightened after each pass.",
      body: `**Signal.** "Read an m×n matrix in spiral order" — no algorithm to discover, pure execution — is the tell that tracking a heading-and-turn is error-prone compared to tracking **four shrinking boundaries** walked in fixed order.

**Brute force.** Simulate a direction vector and turn 90° whenever the next cell is out of bounds or already visited (using a separate visited grid) — works, but needs O(mn) extra space for the visited marks and fiddly turn-detection logic.

**Optimal approach.** Track four boundaries: top, bottom, left, right — the still-unread frame. One lap is four walks in fixed order: left→right along row *top*, then top++; top→bottom down column *right*, then right−−; right→left along row *bottom*, then bottom−−; bottom→top up column *left*, then left++. Loop while top ≤ bottom and left ≤ right. The two guards that separate correct from almost: after the first two walks, the boundaries may have crossed, so the third and fourth walks must re-check (top ≤ bottom before the bottom row; left ≤ right before the left column) — skip those and single-row/column matrices read elements twice.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3], "highlight": [0, 1, 2], "note": "top=0,bottom=2,left=0,right=2. Walk top row left→right: 1,2,3. top++ → top=1." },
    { "cells": [1, 2, 3, 6, 9], "highlight": [3, 4], "note": "Walk right column top→bottom: 6, 9. right-- → right=1." },
    { "cells": [1, 2, 3, 6, 9, 8, 7], "highlight": [5, 6], "note": "Guard: top(1) <= bottom(2), OK. Walk bottom row right→left: 8, 7. bottom-- → bottom=1." },
    { "cells": [1, 2, 3, 6, 9, 8, 7, 4], "highlight": [7], "note": "Guard: left(0) <= right(1), OK. Walk left column bottom→top: 4. left++ → left=1." },
    { "cells": [1, 2, 3, 6, 9, 8, 7, 4, 5], "highlight": [8], "note": "Frame has collapsed to a single cell (top=bottom=left=right=1): read 5. Output: [1,2,3,6,9,8,7,4,5]." }
  ],
  "caption": "Spiral Matrix — four boundaries, each walk consuming its edge and tightening the frame until it collapses."
}
\`\`\`

**Complexity.** O(mn) time — each element read exactly once — O(1) space beyond output, versus O(mn) extra space for a visited grid.

**Thread.** Boundaries tightened from outside in. Set Matrix Zeroes, next, inverts the storage question — how do you *mark* a grid's fate using nothing but the grid itself?`,
    },
    {
      slug: "set-matrix-zeroes",
      title: "Set Matrix Zeroes",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/set-zeroes-in-matrix",
      summary: "Use the first row and column as the marker board — O(1) space by borrowing the matrix's own edges.",
      body: `**Signal.** "Wherever a cell is 0, zero out its entire row and column, in place, O(1) extra space" — the O(1) bar on a problem that naturally wants two boolean arrays (which rows die, which columns die) is the tell to borrow storage that already exists: the matrix's own first row and column.

**Brute force.** Two boolean arrays of size m and n marking which rows and columns must die — O(m + n) space, the honest and clear solution, stated first without shame before the O(1) refinement.

**Optimal approach.** Those two boolean arrays can live *inside* the matrix: use the first row and first column as the marker arrays — cell (r, 0) records "row r dies," cell (0, c) records "column c dies." The delicate part: the first row and column now serve double duty (data and markers), so capture two booleans up front for "does the first row/column itself contain a zero, originally?" Then: scan the interior, planting markers at the edges; apply the markers to the interior (from index 1, not 0 — applying edge markers first wipes your own marker board); finally settle the first row and column from the two saved booleans.

\`\`\`viz:table-diff
{
  "columns": ["r \\\\ c", "0", "1", "2"],
  "before": [["0", 1, 1, 1], ["1", 1, 0, 1], ["2", 1, 1, 1]],
  "after": [["0", 1, 0, 1], ["1", 0, 0, 0], ["2", 1, 0, 1]],
  "caption": "Set Matrix Zeroes — the interior 0 at (1,1) marks (1,0) and (0,1); applying those markers zeroes row 1 and column 1 entirely, leaving the rest untouched."
}
\`\`\`

**Complexity.** O(mn) time, O(1) space — versus O(m + n) for the honest two-array version. The borrow-your-own-storage idea echoes the interleaved clone from Copy List with Random Pointer.

**Thread.** Grids complete. Numbers next — starting with a digit process that either settles or spins forever, and the cycle detector you built in chapter six comes back for numbers: Happy Number.`,
    },
    {
      slug: "happy-number",
      title: "Happy Number",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/non-cyclical-number",
      summary: "Square the digits, sum, repeat: it ends at 1 or loops — and loop detection is Floyd, no list required.",
      body: `**Signal.** "Repeatedly replace a number with the sum of the squares of its digits — does it reach 1, or loop forever" — a sequence where each state determines the next, confined to finitely many small values, is the tell for exactly the same cycle-detection problem as Linked List Cycle, just without an explicit list.

**Brute force.** A hash set of every value seen; a repeat before reaching 1 means unhappy — O(seen) space, perfectly valid, and worth stating as the direct solution before the elegant one.

**Optimal approach.** Any number with four or more digits strictly shrinks under the operation (a 4-digit number is at least 1000; its digit-square sum is at most 4 × 81 = 324), so every trajectory falls into small numbers and stays there — it must either hit 1 or revisit a state, forever. This is *exactly* the structure of a linked list's next-pointers, so **Floyd's tortoise and hare** applies verbatim: slow advances one step of the digit process, fast advances two; if they meet at a value other than 1, a cycle exists; if fast reaches 1, happy. Cycle detection never cared about *nodes* — it works on any iterated function.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2], "note": "n=2. slow=2, fast=2 (start)." },
    { "cells": [4, 16], "note": "Tick: slow steps once (2→4). Fast steps twice (2→4→16)." },
    { "cells": [37, 145], "note": "A few ticks later: slow=37, fast=145 — no match yet, both still wandering the trajectory." },
    { "cells": [20, 20], "highlight": [0, 1], "note": "Eventually: slow=20, fast=20 — collision! Both are trapped in the cycle {4,16,37,58,89,145,42,20}. n=2 is NOT happy." }
  ],
  "caption": "Happy Number — Floyd's tortoise and hare, run on the digit-square-sum function instead of list pointers; a collision away from 1 proves a cycle."
}
\`\`\`

**Complexity.** O(1) space with Floyd, versus O(seen) for the hash-set approach. Each step costs O(digits); trajectories are short (values collapse below 243 immediately).

**Thread.** One digit process tamed. Plus One, next, is the humblest arithmetic in the atlas — and its carry ripple is the exact mechanism the chapter's multiplication finale will industrialise.`,
    },
    {
      slug: "plus-one",
      title: "Plus One",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/plus-one",
      summary: "Increment a digit array: ripple the carry from the right, and only all-nines grow the array.",
      body: `**Signal.** "A number stored as an array of digits — add one" — a two-minute X-ray of whether you handle edge cases as *structure* or as patches, since the carry has only two behaviours worth naming precisely.

**Brute force.** Convert the digit array to an actual integer, add one, convert back to an array — fails the moment the number outgrows a machine integer, which is the entire reason this problem stores digits in an array.

**Optimal approach.** Walk from the rightmost digit. A digit below 9: increment it, done — return immediately. A 9: it becomes 0, and the carry ripples one digit left. If the carry survives past the leftmost digit — the input was *all* nines — the number grows a digit: allocate one extra cell, leading 1, rest zeros (which the ripple already wrote). "All nines" isn't a special case to patch — it's the carry falling off the end, one mechanism, no branches bolted on.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 9, 9], "pointers": [{ "label": "i", "index": 3 }], "note": "Start at the rightmost digit." },
    { "cells": [1, 2, 9, 0], "pointers": [{ "label": "i", "index": 3 }], "highlight": [3], "note": "9 → 0, carry moves left." },
    { "cells": [1, 2, 0, 0], "pointers": [{ "label": "i", "index": 2 }], "highlight": [2], "note": "Next digit is also 9 → 0, carry continues." },
    { "cells": [1, 3, 0, 0], "pointers": [{ "label": "i", "index": 1 }], "highlight": [1], "note": "2 → 3. Carry absorbed — done." }
  ],
  "caption": "Plus One — [1, 2, 9, 9] increments to [1, 3, 0, 0]; the carry ripples left until it meets a digit below 9."
}
\`\`\`

**Why arrays of digits at all?** Because numbers outgrow machine integers — arbitrary-precision arithmetic's smallest operation, the same reason Add Two Numbers stored digits in a linked list.

**Complexity.** O(n) worst case (all nines), O(1) typical (early exit on a random digit) — versus the integer-conversion approach's outright failure on huge inputs.

**Thread.** One carry, one operand. Before multiplication weaponises a *grid* of carries, a detour through the chapter's cleverest arithmetic: exponentiation that halves its way to the answer — Pow(x, n).`,
    },
    {
      slug: "pow-x-n",
      title: "Pow(x, n)",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/pow-x-n",
      summary: "Exponentiation by squaring: halve the exponent, square the base — O(log n), negatives included.",
      body: `**Signal.** "Compute x^n where n can be huge" — a huge exponent computed via a bound that's explicitly not O(n) is the tell for halving the *work itself*, the Binary Search chapter's instinct applied to arithmetic instead of a search space.

**Brute force.** Multiply x by itself n times — O(n) time, which dies the moment n reaches into the billions.

**Optimal approach.** x¹⁰ = (x²)⁵: squaring the base halves the exponent in one multiplication. Odd exponents peel one factor first: x⁵ = x · x⁴ = x · (x²)². Recursively: pow(x, n) = pow(x², n/2) for even n, x · pow(x², (n−1)/2) for odd. Every step halves n, so ~log₂ n multiplications total. Negative exponents: x⁻ⁿ = 1 / xⁿ — compute the positive power, invert once at the end.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 10], "note": "pow(2,10): n=10 is even → pow(2²=4, 10/2=5)." },
    { "cells": [4, 5], "note": "pow(4,5): n=5 is odd → 4 × pow(4²=16, (5-1)/2=2)." },
    { "cells": [16, 2], "note": "pow(16,2): n=2 is even → pow(16²=256, 1)." },
    { "cells": [256, 1], "note": "pow(256,1): n=1 is odd → 256 × pow(256², 0)." },
    { "cells": [256], "highlight": [0], "note": "pow(_, 0) = 1. Unwinding: 256×1=256, then ×4=1024. Result: 2^10 = 1024 in 4 multiplications, not 10." }
  ],
  "caption": "Pow(x, n) — exponentiation by squaring: each recursive call halves the exponent, so log₂ n multiplications suffice."
}
\`\`\`

**Base cases.** n = 0 → 1 (including 0⁰ → 1 by this problem's convention).

**Complexity.** O(log n) time, O(log n) stack recursive or O(1) iterative — versus O(n) naive repeated multiplication. This is how modular exponentiation inside RSA and Diffie-Hellman runs, with a modulo bolted onto every multiply.

**Thread.** Fast power halved its way down. The chapter's arithmetic finale goes the other way — building a full multiplication digit by digit: Multiply Strings.`,
    },
    {
      slug: "multiply-strings",
      title: "Multiply Strings",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/multiply-strings",
      summary: "Grade-school multiplication with one identity: digit i × digit j lands at positions i+j and i+j+1.",
      body: `**Signal.** "Multiply two non-negative integers given as *strings*, converting to numbers explicitly banned" — arbitrary-precision multiplication from scratch is the tell for a clean position identity, not the "shift each row left by one" mess of doing it on paper.

**Brute force.** Simulate the paper method literally: compute each row's partial product as a shifted string, then sum all the rows with repeated string addition — correct but bookkeeping-heavy, with a separate addition pass per digit of one operand.

**Optimal approach.** Number the digits from the left, lengths m and n. The product of digit i (first number) and digit j (second) contributes to exactly two output cells: **positions i + j and i + j + 1** of an m+n length result — the high and low part of the two-digit partial product. Allocate an array of m + n zeros, loop over every digit pair, accumulate mul = d(i)·d(j) into position i+j+1 (and the carry into i+j), then run one final right-to-left carry ripple — Plus One's exact mechanism, over the whole array. The largest possible product (all nines) has exactly m + n digits, so the allocation never overflows.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 10, 3, 5], "note": "\\"23\\" × \\"45\\": raw accumulation before carrying — each digit pair's product split across positions i+j and i+j+1 and summed. Position 1 has overflowed to 10." },
    { "cells": [1, 0, 3, 5], "highlight": [0], "note": "Final right-to-left carry ripple (Plus One's mechanism): position 1's 10 becomes 0, carry 1 into position 0. Result: \\"1035\\"." }
  ],
  "caption": "Multiply Strings — every digit pair's product lands at two fixed positions (i+j, i+j+1); one final carry ripple settles the whole array."
}
\`\`\`

**Complexity.** O(m · n) time, O(m + n) space — versus the row-by-row simulation's extra string-addition passes. (Karatsuba at O(n^1.585), FFT methods beyond — worth naming as what real bignum libraries switch to at scale, not implementing live.)

**Thread.** Digits mastered. One problem remains in the chapter — and it swaps arithmetic for coordinates: Detect Squares, where a hash map of points and one diagonal observation count squares in a stream.`,
    },
    {
      slug: "detect-squares",
      title: "Detect Squares",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-squares",
      summary: "Fix the diagonal: for each candidate opposite corner, the other two corners are determined — count with a map.",
      body: `**Signal.** "count(query) returns how many axis-aligned squares the query point completes with three previously added points" — an axis-aligned square is fully determined by one diagonal, which is the tell to enumerate diagonal *candidates* and let a hash map close the remaining two corners in O(1) each.

**Brute force.** For each query, check every triple of previously added points to see whether the four points (query + three) form a valid axis-aligned square — O(points³) per query, astronomically wasteful.

**Optimal approach.** If the query (qx, qy) and some point (x, y) are *opposite* corners, the other two corners must be exactly (qx, y) and (x, qy) — no freedom at all. Iterate over candidate diagonal partners from the added points only; a valid partner sits diagonally, meaning |x − qx| = |y − qy| ≠ 0. For each such partner, the square count contributed is partnerCount × count(qx, y) × count(x, qy) — multiplied, since duplicate points are legitimate and each combination is a distinct square. Sum over partners: enumerate one element of the configuration, hash-lookup the rest — Two Sum's skeleton, one more time.

\`\`\`viz:table-diff
{
  "columns": ["Candidate point", "Diagonal check", "Needed corners", "Result"],
  "before": [["(3,10)", "Δx=8, Δy=0 → not diagonal", "—", "skip"], ["(11,2)", "Δx=0, Δy=8 → not diagonal", "—", "skip"]],
  "after": [["(3,2)", "Δx=8, Δy=8 → diagonal!", "needs (11,2) ✓ and (3,10) ✓", "contributes 1×1×1 = 1 square"]],
  "caption": "Detect Squares — query (11,10) against added points (3,10), (11,2), (3,2): only (3,2) satisfies the diagonal condition, and both its required corners exist. Total: 1 square."
}
\`\`\`

**Complexity.** add O(1); count O(points added) with O(1) work per candidate, versus O(points³) brute-force triple checking. Space O(distinct points).

**Thread.** Math & Geometry closes. One chapter remains — the machine's own dialect: Bit Manipulation, where numbers stop being quantities and become thirty-two switches in a row.`,
    },
  ],
};
