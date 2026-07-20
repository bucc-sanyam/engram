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
      body: `**The problem.** Rotate an n×n matrix 90° clockwise, **in place** — no second matrix. The in-place clause is the problem: with scratch space this is one line of index shuffling; without it, naive approaches drown in overwritten values.

**The insight — decompose the rotation.** A 90° clockwise rotation sends the element at (row, col) to (col, n−1−row). Chasing that mapping directly means four-way cycles of swaps with fiddly bounds — doable, error-prone. The elegant route: rotation = **transpose, then mirror horizontally**. Transpose swaps (r, c) with (c, r) — flip across the main diagonal. Mirroring reverses each row — (r, c) becomes (r, n−1−c). Compose them: (r, c) → (c, r) → (c, n−1−r) — exactly the rotation map. Two operations, each trivially in-place (transpose swaps pairs above the diagonal with below; mirror swaps within rows), each independently verifiable at a glance. Decomposing a transformation into two involutions you can't get wrong: that is the whole lesson, and it generalises — counter-clockwise is transpose + vertical mirror; 180° is both mirrors.

**The walk-through.** [[1,2,3],[4,5,6],[7,8,9]]: transpose → [[1,4,7],[2,5,8],[3,6,9]]; mirror rows → [[7,4,1],[8,5,2],[9,6,3]]. Check the corners: 1 went top-left → top-right, 7 went bottom-left → top-left. Rotated.

**The one bug to name.** Transposing with a full double loop swaps every pair *twice* — restoring the original. The inner loop must start at c = r + 1 (strictly above the diagonal). This is the problem's classic trap, and saying it before writing it is the flex.

**The direct four-way cycle** (moving four elements at a time around the rotation orbit) saves one pass and is worth describing verbally if asked for "one sweep" — but the transpose-mirror version is what you should *write*: fewer indices, fewer funerals.

**Complexity.** O(n²) time — every element moves — O(1) space.

**The thread.** One transformation, decomposed. Spiral Matrix, next, is the opposite discipline: no identity saves you — just four boundaries, tightened with perfect manners.`,
    },
    {
      slug: "spiral-matrix",
      title: "Spiral Matrix",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/spiral-matrix",
      summary: "Four boundaries — top, bottom, left, right — walked in order and tightened after each pass.",
      body: `**The problem.** Read an m×n matrix in spiral order: across the top, down the right, back along the bottom, up the left, then inward and repeat. [[1,2,3],[4,5,6],[7,8,9]] → [1,2,3,6,9,8,7,4,5]. No algorithm to discover — pure execution, which is exactly why it screens so well: the failure mode is not "didn't know the trick" but "lost an index."

**The insight — boundaries, not coordinates.** Do not track a heading and turn when you hit something; track **four boundaries**: top, bottom, left, right — the still-unread frame. One lap is four walks in fixed order: left→right along row *top*, then top++ (that row is consumed); top→bottom down column *right*, then right−−; right→left along row *bottom*, then bottom−−; bottom→top up column *left*, then left++. Loop while top ≤ bottom and left ≤ right. Each walk consumes its edge and tightens the frame; the spiral is just the frame shrinking to nothing.

**The two guards that separate correct from almost.** After the first two walks, the boundaries may have *crossed* — and the third and fourth walks must re-check (top ≤ bottom before walking the bottom row; left ≤ right before walking the left column). Skip those mid-lap checks and single-row or single-column matrices read elements twice: [[1,2,3,4]] walks the top row, then — without the guard — walks it again backwards as the "bottom" row, because top has passed bottom but the lap didn't notice. Every failed submission of this problem is one of these two guards; know them as *the* content of the exercise.

**The walk-through.** 3×3: top row 1,2,3 (top→1); right column 6,9 (right→1); guard passes, bottom row 8,7 (bottom→1); guard passes, left column 4 (left→1). Frame now top 1, bottom 1, left 1, right 1 → final walk reads 5. Done, 9 elements, none twice.

**Complexity.** O(mn) time — each element read exactly once — O(1) space beyond output.

**The thread.** Boundaries tightened from outside in. Set Matrix Zeroes, next, inverts the storage question — how do you *mark* a grid's fate using nothing but the grid itself?`,
    },
    {
      slug: "set-matrix-zeroes",
      title: "Set Matrix Zeroes",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/set-zeroes-in-matrix",
      summary: "Use the first row and column as the marker board — O(1) space by borrowing the matrix's own edges.",
      body: `**The problem.** Wherever a matrix cell is 0, zero out its entire row and column. In place — and the real challenge tier: O(1) extra space. The naive trap is instructive: zeroing rows *as you scan* cascades — freshly written zeros trigger more zeroing, and the matrix dissolves. Marking must be separated from acting.

**The space ladder — say it in this order.** O(mn): copy the matrix; scan the copy, write the original. O(m + n): two boolean arrays — which rows die, which columns die; mark in one pass, apply in a second. This is the *honest, clear* solution and should be stated first without shame. Then the O(1) twist: those two boolean arrays… the matrix already contains a row and a column you could sacrifice. **Use the first row and first column as the marker arrays**: cell (r, 0) records "row r dies"; cell (0, c) records "column c dies."

**The delicate part.** The first row and column now serve double duty — they hold data *and* markers, and marking would destroy the information "did the first row/column originally contain a zero?" So capture that up front: two booleans (constant space) for "first row itself dies" and "first column itself dies." Then: scan the interior, planting markers at the edges; apply the markers to the interior (iterating from index 1, *not* 0 — applying edge-first wipes your own marker board, the bug that defines this problem); finally, settle the first row and column from the two saved booleans. Order of operations is everything: mark, apply interior, apply edges last.

**The walk-through.** [[1,1,1],[1,0,1],[1,1,1]]: interior scan finds the 0 at (1,1) → mark (1,0) and (0,1). Booleans: first row clean, first column clean. Apply: row 1 zeroed, column 1 zeroed → [[1,0,1],[0,0,0],[1,0,1]]. Edges: untouched.

**Complexity.** O(mn) time, O(1) space. The borrow-your-own-storage idea — encoding bookkeeping *inside* the data being processed — echoes the interleaved clone from Copy List with Random Pointer; it is a small family of tricks worth holding together.

**The thread.** Grids complete. Numbers next — starting with a digit process that either settles or spins forever, and the cycle detector you built in chapter six comes back for numbers: Happy Number.`,
    },
    {
      slug: "happy-number",
      title: "Happy Number",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/non-cyclical-number",
      summary: "Square the digits, sum, repeat: it ends at 1 or loops — and loop detection is Floyd, no list required.",
      body: `**The problem.** Repeatedly replace a number with the sum of the squares of its digits. If the process reaches 1, the number is *happy*; if it loops forever, it is not. 19 → 82 → 68 → 100 → 1: happy. 2 → 4 → 16 → 37 → … → 4: trapped.

**Why it must do one or the other.** The process cannot wander to infinity: any number with four or more digits strictly shrinks under the operation (a 4-digit number is at least 1000; its digit-square sum is at most 4 × 81 = 324), so every trajectory falls into the small numbers and stays there. A process confined to finitely many states either hits 1 or **revisits** a state — and a revisit means a cycle, forever. That two-sentence argument is the mathematical half of the problem, and interviewers enjoy hearing it stated rather than assumed.

**Detecting the loop — two ways.** The direct way: a hash set of every value seen; a repeat before reaching 1 → unhappy. O(seen) space, perfectly fine. The beautiful way: this is a *sequence where each state determines the next* — *exactly* the structure of a linked list's next-pointers — so **Floyd's tortoise and hare** applies verbatim: slow advances one step of the digit process, fast advances two; if they meet at a value other than 1, a cycle exists → unhappy; if fast reaches 1, happy. O(1) space, and the deep note worth sounding: cycle detection never cared about *nodes* — it works on any iterated function, numbers included. The Linked List chapter's tool was more general than its chapter.

**The walk-through.** n = 2: the sequence 2, 4, 16, 37, 58, 89, 145, 42, 20, 4… — the hare laps the tortoise inside the famous 4-cycle → unhappy. n = 19: the fast pointer reaches 1 in a handful of steps → happy.

**Complexity.** Each step costs O(digits); trajectories are short (values collapse below 243 immediately). Effectively O(log n) per step, constant steps in practice; O(1) space with Floyd.

**The thread.** One digit process tamed. Plus One, next, is the humblest arithmetic in the atlas — and its carry ripple is the exact mechanism the chapter's multiplication finale will industrialise.`,
    },
    {
      slug: "plus-one",
      title: "Plus One",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/plus-one",
      summary: "Increment a digit array: ripple the carry from the right, and only all-nines grow the array.",
      body: `**The problem.** A number stored as an array of digits, most significant first: add one. [1,2,3] → [1,2,4]. [9,9,9] → [1,0,0,0]. Trivial to state, and yet it appears in real phone screens constantly — because it is a two-minute X-ray of whether you handle edge cases as *structure* or as patches.

**The insight — the carry has only two behaviours.** Walk from the rightmost digit. A digit below 9: increment it, and you are **done** — return immediately, nothing further can change. A 9: it becomes 0, and the carry ripples one digit left. That is the entire loop: the carry either gets absorbed (early exit) or keeps converting 9s to 0s. If it survives past the leftmost digit — the input was *all* nines — the number grows a digit: allocate one extra cell, leading 1, rest zeros (which the ripple conveniently already wrote). Seeing "all nines" not as a special case to patch but as *the carry falling off the end* — one mechanism, no branches bolted on — is what clean execution means in this chapter.

**The walk-through.** [1, 2, 9, 9]: rightmost 9 → 0, carry; next 9 → 0, carry; next 2 → 3, done → [1, 3, 0, 0]. And [9, 9]: 9→0, 9→0, carry falls off → prepend 1 → [1, 0, 0].

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

**Why arrays of digits at all?** Because numbers outgrow machine integers — this is arbitrary-precision arithmetic's smallest operation, the same reason Add Two Numbers stored digits in a linked list (chapter six; that problem is this one with pointers and two operands). Big-integer libraries, cryptography, and your language's own bignum type all run carry ripples over digit arrays; you are writing their first instruction.

**Complexity.** O(n) worst case (all nines), O(1) typical — the early exit fires immediately on a random number; amortised over sequential increments the cost per increment is O(1), a cute aside from amortised-analysis land.

**The thread.** One carry, one operand. Before multiplication weaponises a *grid* of carries, a detour through the chapter's cleverest arithmetic: exponentiation that halves its way to the answer — Pow(x, n).`,
    },
    {
      slug: "pow-x-n",
      title: "Pow(x, n)",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/pow-x-n",
      summary: "Exponentiation by squaring: halve the exponent, square the base — O(log n), negatives included.",
      body: `**The problem.** Compute x raised to the integer n — where n can be huge, zero, or **negative**. Multiplying x by itself n times is O(n) and dies on n in the billions; the interview is the O(log n) idea.

**The insight — halve the exponent.** x¹⁰ = (x²)⁵: squaring the base halves the exponent in one multiplication. Odd exponents peel one factor first: x⁵ = x · x⁴ = x · (x²)². Recursively: pow(x, n) = pow(x², n/2) for even n, x · pow(x², (n−1)/2) for odd. Every step halves n, so ~log₂ n multiplications total — the Binary Search chapter's halving instinct applied not to a search space but to *work itself*. The iterative reading is even prettier: write n in binary; each bit says whether to fold the current squared-base into the answer. 10 = 1010₂ → x¹⁰ = x⁸ · x² — exponentiation is just binary decomposition, which is why this problem sits after the Bit Manipulation chapter on the roadmap.

**Negative exponents.** x⁻ⁿ = 1 / xⁿ: compute the positive power, invert once at the end. The classic landmine, worth naming even where it can't detonate: in fixed-width integer languages, negating the minimum representable n overflows — handle the first halving specially or widen the type. In JavaScript/Python this is a remark, not a bug, and making the remark shows you have met other machines.

**The walk-through.** pow(2, 10): → pow(4, 5) → odd: 4 · pow(16, 2) → pow(256, 1) → odd: 256 · pow(…, 0) = 256. Unwinding: 4 · 256 = 1024. Four multiplications, not ten. pow(2, −2): pow(2, 2) = 4 → invert → 0.25.

**Base cases.** n = 0 → 1 (including 0⁰ → 1 by this problem's convention — state it). x = 0 with negative n is a division by zero to acknowledge and dodge.

**Complexity.** O(log n) time, O(log n) stack recursive or O(1) iterative. This is how modular exponentiation inside RSA and Diffie-Hellman runs — with a modulo bolted onto every multiply; mention it and the problem grows real teeth.

**The thread.** Fast power halved its way down. The chapter's arithmetic finale goes the other way — building a full multiplication digit by digit: Multiply Strings.`,
    },
    {
      slug: "multiply-strings",
      title: "Multiply Strings",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/multiply-strings",
      summary: "Grade-school multiplication with one identity: digit i × digit j lands at positions i+j and i+j+1.",
      body: `**The problem.** Multiply two non-negative integers given as *strings* — potentially hundreds of digits, far past any built-in type, and converting to numbers is explicitly banned. Arbitrary-precision multiplication, from scratch.

**The insight — the position identity.** Grade school taught you the algorithm; the interview wants it *indexed cleanly*. Number the digits from the left, lengths m and n. Then the product of digit i (first number) and digit j (second) contributes to exactly two output cells: **positions i + j and i + j + 1** of an m+n length result — the high part and the low part of the two-digit partial product. That single identity replaces the entire mess of "shift each row left by one" from paper: allocate an array of m + n zeros, loop over every digit pair, do mul = d(i) · d(j), add it into position i + j + 1, push the overflow into i + j. Accumulate everything first; the carries settle as you go (or in one final right-to-left ripple — Plus One's mechanism, running the length of the array).

**Why m + n cells suffice.** The largest possible product — all nines — has exactly m + n digits (999 × 99 = 98901: five digits for 3 + 2); it never overflows the allocation. The leading cell may stay 0 for smaller products — strip leading zeros at the end, and mind the one honest special case: anything × "0" should return "0", not "0000".

**The walk-through.** "23" × "45": pairs — 2·4 → positions 0/1; 2·5 → 1/2; 3·4 → 1/2; 3·5 → 2/3. Accumulating with carries: cells settle to 1, 0, 3, 5 → "1035". Every shift, every carry, every column of the paper method — encoded in one index sum.

**Complexity.** O(m · n) time, O(m + n) space. (Faster algorithms exist — Karatsuba at O(n^1.585), FFT methods beyond — and naming them as "what real bignum libraries switch to at scale" is the graceful flourish; implementing them is nobody's interview.)

**The thread.** Digits mastered. One problem remains in the chapter — and it swaps arithmetic for coordinates: Detect Squares, where a hash map of points and one diagonal observation count squares in a stream.`,
    },
    {
      slug: "detect-squares",
      title: "Detect Squares",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-squares",
      summary: "Fix the diagonal: for each candidate opposite corner, the other two corners are determined — count with a map.",
      body: `**The problem.** Design a structure: add(point) accepts points (duplicates allowed, each counts), and count(query) returns how many **axis-aligned squares** the query point completes with three previously added points. Geometry meets chapter one: the entire solution is a point-count hash map plus one insight about squares.

**The insight — the diagonal determines everything.** An axis-aligned square is fixed by one diagonal: if the query (qx, qy) and some point (x, y) are *opposite* corners, the other two corners must be exactly (qx, y) and (x, qy) — no freedom at all. So: iterate over candidate diagonal partners; a valid partner sits diagonally, meaning |x − qx| = |y − qy| ≠ 0 (equal horizontal and vertical distance — that is what makes the sides equal — and nonzero, or the "square" is a point). For each such partner, the square count contributed is partnerCount × count(qx, y) × count(x, qy) — multiplied, because duplicates are legitimate and each copy of each corner is a distinct square by this problem's rules. Sum over partners.

**Iterating candidates without scanning the plane.** You cannot loop over all coordinates — but you *can* loop over **added points only**: keep both a count map (point → multiplicity) and a list (or iterate the map's entries). For each stored point, test the diagonal condition against the query; most fail in O(1). With coordinates bounded (0–1000 in the stated constraints), an even tighter loop iterates only points sharing the query's *column*… either way, the shape is: enumerate one degree of freedom, let the map close the other three in O(1) each. That — *enumerate one element of the configuration, hash-lookup the rest* — is the exact skeleton of Two Sum, of Group Anagrams' buckets, of every counting-geometry problem; chapter seventeen ends by handing the baton back to chapter one.

**The walk-through.** Add (3,10), (11,2), (3,2), query (11,10): partner candidates — (3,2) is diagonal (Δx 8, Δy 8) → needs (11,2) ✓ and (3,10) ✓ → 1 × 1 × 1 = 1 square. The others fail the diagonal test. Count: 1.

**Complexity.** add O(1); count O(points added) with O(1) work per candidate. Space O(distinct points).

**The thread.** Math & Geometry closes. One chapter remains — the machine's own dialect: Bit Manipulation, where numbers stop being quantities and become thirty-two switches in a row.`,
    },
  ],
};
