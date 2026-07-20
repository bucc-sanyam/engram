import type { DsaTopic } from "../types";

/** Chapter 18 — Bit Manipulation: the machine's own dialect. */
export const bitManipulation: DsaTopic = {
  slug: "bit-manipulation",
  title: "Bit Manipulation",
  chapter: 18,
  tagline: "Numbers as rows of switches — XOR cancellation, bit tricks, and arithmetic rebuilt from logic.",
  color: "#b8e986",
  prereqs: ["dp-1d"],
  unlocks: ["math-geometry"],
  intro: `Underneath every structure in this atlas — the hash maps, the heaps, the DP tables — a number was never a quantity. It was thirty-two or sixty-four switches in a row, and the machine flips them in bulk, one clock cycle at a time. This final chapter drops to that level. It is the shortest chapter and the most alien-feeling one, because its tools are not algorithms so much as *identities* — small algebraic facts about AND, OR, XOR, NOT, and shifts that turn whole loops into single instructions.

The star of the chapter is **XOR**, and it deserves its reputation. XOR is addition without carrying — per-bit, 1 when the inputs differ. From that one definition fall three properties that solve half the chapter: x ^ x = 0 (anything cancels itself), x ^ 0 = x (zero is the identity), and the operation is commutative and associative — order never matters. Together they make XOR a *cancellation machine*: XOR a pile of numbers, and everything appearing twice vanishes, leaving only the unpaired. Single Number is that sentence verbatim; Missing Number is the same cancellation aimed at a range; and Sum of Two Integers rebuilds addition itself from XOR (the carry-less sum) and AND-shift (the carries), looping until the carries drain — the ripple-carry adder from your computer architecture course, written in four lines.

The rest of the toolkit: **n & (n − 1)** clears the lowest set bit — the single most quoted bit trick on earth, and the engine of Number of 1 Bits; shifting walks bits past a window (Reverse Bits assembles a mirror image one bit at a time); and Counting Bits closes the loop back to the DP chapter with the loveliest small recurrence in the atlas — a number's bit count is its half's bit count plus its lowest bit. Reverse Integer, the finale, is honest digit arithmetic wearing the chapter's overflow-consciousness: pop and push digits while guarding the 32-bit boundary *before* crossing it.

On the roadmap, Bit Manipulation hangs off 1-D DP and unlocks Math & Geometry. In this atlas's reading order it is the last chapter — the ground floor, visited last, the way you meet the foundations of a building you have already lived in.`,
  problems: [
    {
      slug: "single-number",
      title: "Single Number",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/single-number",
      summary: "Every number appears twice except one — XOR them all and the pairs annihilate.",
      body: `**The problem.** Every element in the array appears exactly twice, except one loner. Find it — in O(n) time and, the real constraint, **O(1) space**. The hash-map count from chapter one solves it instantly in O(n) space; the problem exists to make you find the zero-memory answer.

**The insight.** XOR the entire array together. Because XOR is commutative and associative, the order is irrelevant — mentally regroup the pile so each pair sits together: x ^ x = 0 for every pair, the zeros vanish (0 is XOR's identity), and the running result is exactly the loner. No memory of *which* numbers were seen is ever kept — the pairs erase **each other**, in whatever order they arrive. That is the cancellation machine at full power, and the three-property argument (self-inverse, identity, reorderable) is precisely what an interviewer wants recited: it is the proof, in one breath.

**The walk-through.** [4, 1, 2, 1, 2]: running XOR — 4, then 4^1 = 5, 5^2 = 7, 7^1 = 6, 6^2 = **4**. The intermediate values look like noise — they are; only the final cancellation pattern matters, and regrouped it reads 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4.

\`\`\`viz:array
{
  "frames": [
    { "cells": [4, 1, 2, 1, 2], "pointers": [{ "label": "i", "index": 0 }], "note": "Running XOR = 4." },
    { "cells": [4, 1, 2, 1, 2], "pointers": [{ "label": "i", "index": 1 }], "note": "4 ^ 1 = 5." },
    { "cells": [4, 1, 2, 1, 2], "pointers": [{ "label": "i", "index": 2 }], "note": "5 ^ 2 = 7." },
    { "cells": [4, 1, 2, 1, 2], "pointers": [{ "label": "i", "index": 3 }], "highlight": [1, 3], "note": "7 ^ 1 = 6 — the two 1's have now cancelled." },
    { "cells": [4, 1, 2, 1, 2], "pointers": [{ "label": "i", "index": 4 }], "highlight": [0, 2, 4], "note": "6 ^ 2 = 4 — the two 2's cancel too, leaving the loner 4." }
  ],
  "caption": "Single Number — one running XOR accumulator; every pair cancels, only the loner survives."
}
\`\`\`

**Why this beats its rivals.** Sorting first: O(n log n) and mutates. Hash set (add on first sight, remove on second — the survivor remains): O(n) space. Sum trick (2 × sum-of-distinct − sum): needs the distinct set anyway. XOR: one accumulator, one pass, no arithmetic overflow concerns even in fixed-width languages — XOR never carries.

**The famous follow-ups, named.** Every element thrice except one: count each bit position modulo 3 (XOR generalised to a per-bit counter). *Two* loners: XOR gives their combined signature; split all numbers into two groups by any set bit of that signature and recurse the cancellation per group. Both are standard sequels; knowing they exist marks the territory.

**Complexity.** O(n) time, O(1) space.

**The thread.** Cancellation against duplicates. Next, the microscope turns inward — counting the set bits *inside* one number, and the trick that snaps off the lowest one.`,
    },
    {
      slug: "number-of-1-bits",
      title: "Number of 1 Bits",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/number-of-one-bits",
      summary: "Popcount: n & (n − 1) deletes the lowest set bit — loop once per 1, not once per bit.",
      body: `**The problem.** Count the 1 bits in a 32-bit integer — the *Hamming weight*, or popcount. 11 (binary 1011) → 3. The smallest real bit problem, and home of the most quoted trick in the field.

**The straightforward loop.** Check the last bit (n & 1), add it to the count, shift right; 32 iterations regardless of the number. Perfectly fine, O(32) — say it, write it if asked for simple, then upgrade.

**The trick — n & (n − 1).** Subtracting 1 from a binary number flips the lowest set bit to 0 and every bit *below* it to 1 (the borrow ripples up to the first 1 and stops): 1011 0100 − 1 = 1011 0011. AND that with the original and everything below the lowest set bit was already 0, the lowest set bit meets a 0 — the result is the original **with its lowest 1 deleted**, all higher bits untouched. So loop: n = n & (n − 1), count++, until n is 0. The loop runs *once per set bit* — three iterations for 1011, one for a power of two — not once per position. For sparse numbers that is a real win; as an interview artifact it is a handshake: fluency in one line.

**The walk-through.** n = 1011₂: & with 1010 → 1010 (count 1); & with 1001 → 1000 (count 2); & with 0111 → 0 (count 3). Done — three ones, three iterations.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["1", "0", "1", "1"], "highlight": [3], "note": "n = 1011 — lowest set bit is the rightmost 1." },
    { "cells": ["1", "0", "1", "0"], "highlight": [2], "note": "n & (n - 1) = 1010 — lowest bit cleared, count = 1." },
    { "cells": ["1", "0", "0", "0"], "highlight": [0], "note": "n & (n - 1) = 1000 — count = 2." },
    { "cells": ["0", "0", "0", "0"], "note": "n & (n - 1) = 0000 — count = 3, loop ends." }
  ],
  "caption": "Number of 1 Bits — n & (n - 1) deletes the lowest set bit each round; three deletions, three set bits."
}
\`\`\`

**Where popcount actually matters.** Hamming distance (XOR two values, popcount the result — how many positions differ, the metric behind error-correcting codes), bitboards in chess engines, bloom filters, compressed bitmaps in databases. Modern CPUs ship it as a single instruction — POPCNT — and most languages expose an intrinsic; mentioning that you would call the intrinsic in production, and implement the trick in interviews, is exactly the right register.

**One language note.** In JavaScript, bitwise operators work on signed 32-bit values — a leading-1 input reads as negative, but n & (n − 1) still terminates correctly if the loop tests n !== 0 rather than n > 0. The kind of edge this chapter trains you to hear.

**Complexity.** O(set bits) ≤ O(32) time, O(1) space.

**The thread.** One number's count mastered. Counting Bits, next, wants the count for *every* number up to n — and doing it in one pass resurrects, of all things, the DP chapter.`,
    },
    {
      slug: "counting-bits",
      title: "Counting Bits",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/counting-bits",
      summary: "dp[i] = dp[i >> 1] + (i & 1): every number's bit count is its half's count plus its last bit.",
      body: `**The problem.** For every i from 0 to n, output the number of 1 bits in i. Running popcount n times costs O(n log n) — fine, but the follow-up printed on the problem itself demands **O(n) total**: the counts must help compute each other. That sentence — answers built from earlier answers — is the DP bat-signal, heard one last time.

**The insight.** Shift i right by one and you get a *smaller number whose count is already computed*: i >> 1 is i with its last bit dropped. So i's count is that count, plus the dropped bit: **dp[i] = dp[i >> 1] + (i & 1)**. Every number's answer is one array lookup and one AND — filled in increasing order, dependencies always ready (i >> 1 < i, guaranteed). Base: dp[0] = 0. It is Climbing Stairs' shape — an answer leaning on a strictly smaller answer — with the recurrence discovered not in steps or houses but in the *binary structure of the index itself*. The atlas's two most distant chapters, DP and bits, meeting in one line.

**The sibling recurrence.** dp[i] = dp[i & (i − 1)] + 1 — last problem's trick as a recurrence: my count is one more than the count of me-with-my-lowest-bit-removed. Equally O(1) per entry, equally correct; deriving *both* and noting they lean on different decompositions (drop the last bit versus drop the lowest set bit) is the flourish.

**The walk-through.** n = 8: dp[0] = 0; dp[1] = dp[0]+1 = 1; dp[2] = dp[1]+0 = 1; dp[3] = dp[1]+1 = 2; dp[4] = dp[2]+0 = 1; dp[5] = dp[2]+1 = 2; dp[6] = dp[3]+0 = 2; dp[7] = dp[3]+1 = 3; dp[8] = dp[4]+0 = 1. Output [0,1,1,2,1,2,2,3,1] — and notice the fractal: each power-of-two block repeats the previous blocks' counts plus one, the pattern the recurrence quietly encodes.

**Complexity.** O(n) time, O(1) beyond the output array.

**The thread.** Bits counted forward. Reverse Bits, next, rebuilds a number mirror-imaged — thirty-two little transfers, and a lesson in assembling from the other end.`,
    },
    {
      slug: "reverse-bits",
      title: "Reverse Bits",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/reverse-bits",
      summary: "Mirror a 32-bit word: peel bits off one end, push them onto the other, thirty-two times.",
      body: `**The problem.** Reverse the 32 bits of an unsigned integer — bit 0 swaps with bit 31, bit 1 with bit 30, the full mirror. Input 000...0101 → 1010...000.

**The insight.** The cleanest mental model is two registers and a conveyor belt: peel the lowest bit off the input, push it onto the *low end* of the output — which shifts everything already there up one — and repeat 32 times. First-peeled ends up deepest, i.e. highest: last-in-first-out ordering producing exactly the mirror, the stack discipline from chapter four operating on individual bits. Per step: result = (result << 1) | (n & 1); n >>= 1. Thirty-two iterations, unconditionally — reversal has no early exit, every position matters including the leading zeros.

**The walk-through (8-bit for sanity).** n = 00000101: peel 1 → result 1; peel 0 → 10; peel 1 → 101; five more zeros → 10100000. The three meaningful bits mirrored, the padding zeros now trailing — visible proof that fixed *width* is part of the problem statement: reversing "as a number" without the width would lose them.

**The divide-and-conquer flex.** The bit-twiddling classic reverses in five masked steps: swap adjacent bits, then adjacent pairs, then nibbles, bytes, halves — each step a shift-mask-OR over the whole word in parallel. O(log 32) steps, branch-free, and how hardware and libraries actually do it. Deriving it live is overkill; *describing* it — "mirror by recursive halving with masks like 0x55555555" — is the senior signature. (Same masks power the parallel popcount, a pleasing rhyme with two problems ago.)

**Language note, again.** JavaScript's 32-bit signed operators make the final result potentially "negative" — convert with an unsigned right shift by zero (result >>> 0) to read it as the intended unsigned value. Exactly the class of detail this chapter exists to make routine.

**Complexity.** O(32) time — call it O(1) — O(1) space. The follow-up ("called many times?") wants a byte-level lookup table: precompute 256 reversed bytes, assemble four of them swapped — time-space trading, chapter one's oldest lesson, at the bit level.

**The thread.** Mirrors done. Missing Number, next, returns to XOR's cancellation — this time against a *range* — and pits it against Gauss's formula in a two-line showdown.`,
    },
    {
      slug: "missing-number",
      title: "Missing Number",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/missing-number",
      summary: "0..n with one absentee: XOR the range against the array — or subtract sums — and the gap names itself.",
      body: `**The problem.** An array holds n distinct numbers drawn from 0 to n — one value from the range is missing. Find it in O(n) time, O(1) space. [3, 0, 1] → 2.

**The XOR way.** XOR two complete collections together: every index 0..n, and every array element. The array's numbers each have a twin in the range — cancelled. The one range value with no twin in the array survives: the missing number. It is Single Number with the second copy of each value supplied *by the index range itself* — the cancellation machine fed synthetic pairs. Implementation: one accumulator, XOR in i and nums[i] as you sweep, XOR in the final n. No overflow thoughts required, ever — XOR does not carry.

**The Gauss way.** The full range sums to n(n + 1)/2 — the schoolboy formula. Sum the array, subtract: the difference *is* the missing number. Two lines, and in most languages the honest caveat: intermediate sums can overflow fixed-width integers for large n (irrelevant in Python/JavaScript-number-land, real in 32-bit contexts). The XOR version's total immunity to overflow is its quiet superiority, and stating that comparison — same complexity, different failure modes — is the interview's actual content. Two correct answers plus the judgment between them beats either alone.

**The walk-through (XOR).** [3, 0, 1]: accumulate indices and values — 0^3, then ^1^0, then ^2^1, finally ^3 (the n term). Regrouped: (0^0) ^ (1^1) ^ (3^3) ^ **2** = 2. The pairs vanished in arbitrary order, as they always do.

**The third way worth one sentence.** Sort and scan for the first index ≠ value: O(n log n), the answer you give only to show you see the trade — or binary-search that boundary if the input *arrives* sorted, a flip-point search straight from chapter five.

**Complexity.** O(n) time, O(1) space, both ways.

**The thread.** Cancellation has now solved three problems. The chapter's summit is next: Sum of Two Integers — where XOR and AND stop being tricks and become the *definition* of addition itself.`,
    },
    {
      slug: "sum-of-two-integers",
      title: "Sum of Two Integers",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/sum-of-two-integers",
      summary: "No + allowed: XOR is the carry-less sum, AND-shift is the carries — loop until the carries drain.",
      body: `**The problem.** Add two integers without using + or −. A problem that sounds like a party trick and is actually a guided tour of how your CPU's arithmetic logic unit works.

**The insight — split addition into its two ingredients.** Add two binary digits: 0+0=0, 1+0=1, 0+1=1, and 1+1=0 *carry 1*. Look at the sum column alone: it is exactly **XOR**. Look at the carry column alone: it is exactly **AND**, delivered one position to the left — **(a & b) << 1**. So a + b = (a ^ b) + (the carries) — addition decomposed into a carry-less part and a carry part. Still a + in that sentence? Apply the same decomposition *again* to the XOR result and the carries: loop — sum = a ^ b; carry = (a & b) << 1; a = sum; b = carry — until the carry is zero. Each iteration pushes carries at least one bit leftward; in a 32-bit word they fall off the end within 32 rounds. Termination is the width of the machine.

**The walk-through.** 5 + 3: 101 ^ 011 = 110, carry (101 & 011) << 1 = 010. Next: 110 ^ 010 = 100, carry (110 & 010) << 1 = 100. Next: 100 ^ 100 = 000, carry 1000. Next: 0 ^ 1000 = 1000, carry 0 → **8**. Watch the carry ripple leftward each round — this is Plus One's ripple from last chapter, expressed in pure logic, and in silicon it is the ripple-carry adder (real ALUs accelerate it with carry-lookahead, a sentence worth owning).

**Negatives, free of charge.** In two's complement, the same loop handles negative numbers with *no changes* — subtraction is addition of a negated operand, and two's complement was designed precisely so the adder never needs to know signs. (Python's unbounded integers spoil the party — carries never "fall off" — so there you mask to 32 bits each round and sign-fix at the end; naming that wrinkle is the distinguishing move.)

**Complexity.** O(32) rounds worst case — O(1) — and O(1) space.

**The thread.** Arithmetic rebuilt from logic — the atlas's deepest floor. One problem remains, and it climbs back up to digits and their limits: Reverse Integer, the overflow-honesty finale.`,
    },
    {
      slug: "reverse-integer",
      title: "Reverse Integer",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/reverse-integer",
      summary: "Pop digits, push digits — and prove you won't overflow before each push, not after.",
      body: `**The problem.** Reverse a signed 32-bit integer's digits: 123 → 321, −123 → −321, 120 → 21. If the reversal exceeds the 32-bit range, return 0 — and the rule of the game is that your solution must not *itself* rely on wider arithmetic to notice. The atlas ends on a problem about honesty at the boundary.

**The mechanics.** Digit pop and push: pop = x mod 10, x = x ÷ 10 (truncating); result = result × 10 + pop. The loop is four lines. The entire problem is the guard: result × 10 + pop can overflow, so check **before** multiplying — if result > (2³¹ − 1) ÷ 10, the multiply alone will overflow; if it *equals* the boundary quotient, only a final digit ≤ 7 fits (2³¹ − 1 = 2,147,483,64**7**), and the mirrored checks with −2³¹ and its trailing 8 cover the negative side. Checking after the damage — computing the overflowed value and inspecting it — is undefined behaviour in C-family languages and a failed interview everywhere: the point is *predicting* the cliff, not surviving the fall. (Languages with wide or arbitrary integers make the check soft — but the problem grades you as if on 32 bits; say so and honour it.)

**The walk-through.** x = −123 (with truncating division, pops arrive signed — −3, −2, −1 — and the same loop builds −321 with no sign special-casing; a pleasing two's-complement dividend). x = 1,534,236,469: reversal would be 9,646,324,351 — the guard fires when result hits 964,632,435 with a 1 still to push (964,632,435 > 214,748,364) → return 0, no overflow ever computed.

**Why this closes the atlas.** It is the smallest problem that demands the chapter's whole temperament: digits as mechanical objects, the machine's width as a real boundary, and correctness *proved* at the edge instead of hoped for. Every structure in the 150 ultimately rests on arithmetic that behaves — this is what behaving costs.

**The thread — the end of the path.** That is 150 of 150. You have walked from a hash set's first "have I seen this?" to rebuilding addition from logic gates — arrays, pointers, windows, stacks, halvings, chains, trees, heaps, choices, letters, components, weights, tables, proofs, spans, grids, and bits, each chapter handing its tools to the next. The honest next step is the same as the first: go back and *solve* — the reading gave you the map, the keyboard makes it territory. Head back to the atlas hub any time; the trail markers will still be here.`,
    },
  ],
};
