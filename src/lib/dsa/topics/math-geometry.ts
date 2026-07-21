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
  intro: `Every other chapter in this atlas is organised around a *technique*. This one is organised around a *temperament*: problems whose crux is not an algorithmic pattern but a clean piece of arithmetic or coordinate insight — the kind you either see, or grind past with triple the code. That makes the chapter deceptively dangerous: nothing here needs a heap or a DP table, yet these problems produce more off-by-one bugs per line than any other family. The skill being trained is **exactness** — walking boundaries, carries, and transformations without a single index slipping.`,
  problems: [
    {
      slug: "rotate-image",
      title: "Rotate Image",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/rotate-matrix",
      summary: "Rotate 90° in place: transpose across the diagonal, then mirror each row — two simple moves, no index acrobatics.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to manually rotate elements using 4-way index swap cycles ($(r, c) \\rightarrow (c, N-1-r)$).
*Why this shatters*: Complex 4-way index swapping leads to index bugs.

**The Structural Invariant: Decomposed Matrix Transformation (Transpose + Mirror).**
A $90^\\circ$ clockwise matrix rotation is mathematically equivalent to **two simple $O(1)$ operations**:
1. **Transpose**: Flip the matrix across its main diagonal ($swap(matrix[r][c], matrix[c][r])$ for $c > r$).
2. **Mirror Horizontally**: Reverse each row in-place.

\`\`\`viz:table-diff
{
  "columns": ["Transformation Step", "Row 0", "Row 1", "Row 2"],
  "before": [["Original Matrix", "1, 2, 3", "4, 5, 6", "7, 8, 9"], ["Step 1: Transpose", "1, 4, 7", "2, 5, 8", "3, 6, 9"]],
  "after": [["Step 2: Mirror Rows", "7, 4, 1", "8, 5, 2", "9, 6, 3"]],
  "caption": "Rotate Image — Transpose (diagonal swap) followed by row reversal."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Transpose Loop Trap*: In the Transpose step, the inner loop MUST start at \`c = r + 1\`. Starting at \`c = 0\` swaps every element twice, restoring the original matrix!`,
      questions: [
        {
          kind: "mcq",
          prompt: "What two simple operations compose a 90-degree clockwise matrix rotation?",
          options: [
            "Row reverse + Column reverse",
            "Transpose (diagonal flip) + Mirror rows (horizontal reverse)",
            "Shift right + Shift down",
            "Sort rows + Sort columns"
          ],
          correct_index: 1,
          model_answer: "Transposing swaps (r, c) to (c, r). Reversing each row converts (c, r) to (c, N-1-r), achieving a 90-degree clockwise rotation.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "Why must the inner loop for matrix transposition start at c = r + 1?",
          model_answer: "Starting from c = 0 would process every element pair (r, c) and (c, r) twice, swapping them back to their original positions.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "spiral-matrix",
      title: "Spiral Matrix",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/spiral-matrix",
      summary: "Four boundaries — top, bottom, left, right — walked in order and tightened after each pass.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners simulate movement with direction vectors \`(dx, dy)\` and a boolean \`visited[][]\` grid.
*Why this shatters*: Direction vectors require allocating $O(M \\cdot N)$ extra visited matrix memory and complex turn logic.

**The Structural Invariant: 4-Boundary Shrinking Frame.**
Maintain four bounding pointers: \`top = 0\`, \`bottom = M - 1\`, \`left = 0\`, \`right = N - 1\`.
- **Loop while \`top <= bottom\` AND \`left <= right\`**:
  1. Walk **Left $\\rightarrow$ Right** along \`top\` row. \`top++\`.
  2. Walk **Top $\\rightarrow$ Bottom** along \`right\` col. \`right--\`.
  3. **Guard**: If \`top <= bottom\`, walk **Right $\\rightarrow$ Left** along \`bottom\` row. \`bottom--\`.
  4. **Guard**: If \`left <= right\`, walk **Bottom $\\rightarrow$ Top** along \`left\` col. \`left++\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3], "note": "Walk Top row L->R: 1,2,3. top=1." },
    { "cells": [1, 2, 3, 6, 9], "note": "Walk Right col T->B: 6,9. right=1." },
    { "cells": [1, 2, 3, 6, 9, 8, 7], "note": "Walk Bottom row R->L: 8,7. bottom=1." },
    { "cells": [1, 2, 3, 6, 9, 8, 7, 4, 5], "highlight": [8], "note": "Walk Left col B->T: 4. Final center 5. Output: [1,2,3,6,9,8,7,4,5]." }
  ],
  "caption": "Spiral Matrix — 4-Boundary frame shrinking in O(M*N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Boundary Guard Check*: Re-check \`top <= bottom\` before step 3 and \`left <= right\` before step 4 to prevent double-reading single-row or single-column matrices!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must steps 3 (bottom row) and 4 (left column) include explicit boundary checks (top <= bottom / left <= right)?",
          options: [
            "Because matrix rows can be negative.",
            "Because steps 1 and 2 increment top and decrement right, which could cause boundaries to cross on single-row or single-column matrices, reading duplicate elements.",
            "To sort the output array.",
            "Because Javascript array indices cannot be 0."
          ],
          correct_index: 1,
          model_answer: "Modifying top and right in steps 1 and 2 can shrink the frame prematurely, so steps 3 and 4 must verify the boundaries remain valid.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity of Spiral Matrix?",
          model_answer: "O(M * N) time complexity and O(1) auxiliary space.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "set-matrix-zeroes",
      title: "Set Matrix Zeroes",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/set-zeroes-in-matrix",
      summary: "Use the first row and column as the marker board — O(1) space by borrowing the matrix's own edges.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners set row/col to 0 immediately upon seeing a \`0\`.
*Why this shatters*: Setting rows/cols to 0 mid-traversal propagates newly written 0s into future cell checks, turning the entire matrix to 0s!

**The Structural Invariant: In-Place Marker Borrowing ($O(1)$ Space).**
Instead of using $O(M + N)$ extra boolean arrays, **use Matrix Row 0 and Col 0 as marker arrays**:
1. Record if Row 0 originally had a zero (\`firstRowZero\`) and Col 0 originally had a zero (\`firstColZero\`).
2. Scan interior cells $r \\in [1, M-1], c \\in [1, N-1]$:
   - If \`matrix[r][c] == 0\`: Mark \`matrix[r][0] = 0\` and \`matrix[0][c] = 0\`.
3. Apply interior markers: For $r \\ge 1, c \\ge 1$, if \`matrix[r][0] == 0\` or \`matrix[0][c] == 0\`, set \`matrix[r][c] = 0\`.
4. Handle Row 0 and Col 0 markers using saved booleans.

\`\`\`viz:table-diff
{
  "columns": ["r \\\\ c", "0", "1", "2"],
  "before": [["0", 1, 1, 1], ["1", 1, 0, 1], ["2", 1, 1, 1]],
  "after": [["0", 1, 0, 1], ["1", 0, 0, 0], ["2", 1, 0, 1]],
  "caption": "Set Matrix Zeroes — Interior zero at (1,1) sets markers at (1,0) and (0,1)."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Apply Order*: Never apply row/col 0 markers first, as doing so wipes out your stored marker data for interior cells!`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does Set Matrix Zeroes achieve O(1) auxiliary space complexity?",
          options: [
            "By sorting matrix cells.",
            "By using the matrix's own 1st row and 1st column as the marker arrays to track which rows and columns should be zeroed.",
            "By converting zeroes to null.",
            "By compressing the matrix."
          ],
          correct_index: 1,
          model_answer: "Reusing row 0 and col 0 as internal marker flags eliminates the need to allocate external O(M+N) memory arrays.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why must interior cells (r >= 1, c >= 1) be zeroed BEFORE applying the markers to row 0 and col 0?",
          model_answer: "Zeroing row 0 or col 0 first destroys the marker indicators needed to determine whether interior cells should be zeroed.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "happy-number",
      title: "Happy Number",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/non-cyclical-number",
      summary: "Square the digits, sum, repeat: it ends at 1 or loops — and loop detection is Floyd, no list required.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners run digit-square sums in an infinite loop until hitting 1.
*Why this shatters*: Unhappy numbers get trapped in an **infinite cycle** (e.g., $4 \\rightarrow 16 \\rightarrow 37 \\dots \\rightarrow 4$), causing an infinite loop.

**The Structural Invariant: Floyd's Fast & Slow Pointer Cycle Detection.**
The digit square sum operation is a deterministic function $f(n)$. It either reaches $1$ or enters a cycle.
- We can apply **Floyd's Tortoise and Hare algorithm** without a linked list:
  - \`slow = getNext(n)\`
  - \`fast = getNext(getNext(n))\`
  - While \`fast != 1 && slow != fast\`:
    - \`slow = getNext(slow)\`
    - \`fast = getNext(getNext(fast))\`
- **Result**: Return \`fast == 1\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [19], "note": "n=19. getNext(19) = 1^2 + 9^2 = 82." },
    { "cells": [82, 68], "note": "getNext(82) = 68 -> getNext(68) = 100." },
    { "cells": [100, 1], "highlight": [1], "note": "getNext(100) = 1. Fast reaches 1! Return TRUE (Happy Number)." }
  ],
  "caption": "Happy Number — Floyd's Fast/Slow cycle detection on digit square sums."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *HashSet Alternative*: Store visited numbers in a Set ($O(\\text{visited})$ space). Floyd achieves $O(1)$ space.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How can Floyd's Tortoise and Hare algorithm be applied to Happy Number without a Linked List?",
          options: [
            "By treating the digit-square-sum function f(n) as the 'next' pointer in an implicit state graph.",
            "By creating a binary search tree.",
            "By converting the number into a string.",
            "By sorting digits."
          ],
          correct_index: 0,
          model_answer: "The function getNext(n) maps each number to its unique successor, forming an implicit sequence where fast/slow pointers detect cycles.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the result for n = 2 in Happy Number?",
          model_answer: "False. 2 enters an infinite cycle {4, 16, 37, 58, 89, 145, 42, 20} without ever reaching 1.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "plus-one",
      title: "Plus One",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/plus-one",
      summary: "Increment a digit array: ripple the carry from the right, and only all-nines grow the array.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners convert the digit array to an integer, add 1, and convert back to an array.
*Why this shatters*: Integer conversion overflows 64-bit integer limits for large digit arrays (e.g. 100 digits long)!

**The Structural Invariant: Right-to-Left Carry Ripple.**
Iterate $i$ from $N - 1$ down to $0$:
- If \`digits[i] < 9\`:
  - Increment \`digits[i]++\`.
  - **RETURN \`digits\` IMMEDIATELY** (Carry is fully absorbed!).
- Else (\`digits[i] == 9\`):
  - Set \`digits[i] = 0\` (Carry ripples left).
- **All-Nines Edge Case**: If loop finishes without returning (e.g. \`[9, 9, 9]\`), the carry spilled off the left! Prepend \`1\` to array: return \`[1, 0, 0, 0]\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 9, 9], "pointers": [{ "label": "i=3", "index": 3 }], "note": "i=3 (9): digits[3]=0, carry ripples left." },
    { "cells": [1, 2, 0, 0], "pointers": [{ "label": "i=2", "index": 2 }], "note": "i=2 (9): digits[2]=0, carry ripples left." },
    { "cells": [1, 3, 0, 0], "pointers": [{ "label": "i=1", "index": 1 }], "highlight": [1], "note": "i=1 (2 < 9): digits[1]=3. Return [1, 3, 0, 0]!" }
  ],
  "caption": "Plus One — Right-to-left carry ripple in O(N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Early Exit*: Over 90% of cases terminate on the first step ($O(1)$ average time).`,
      questions: [
        {
          kind: "mcq",
          prompt: "What happens when all digits in the array are 9 (e.g. [9, 9, 9]) in Plus One?",
          options: [
            "Returns [0, 0, 0].",
            "The loop sets all digits to 0, and a new leading 1 is prepended to return [1, 0, 0, 0].",
            "It throws an integer overflow exception.",
            "It returns [10, 0, 0]."
          ],
          correct_index: 1,
          model_answer: "When all digits are 9, the carry ripples to the front, producing a new array with a leading 1 followed by zeros.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the average time complexity of Plus One?",
          model_answer: "O(1) average time, as non-9 digits absorb the carry immediately on the first step.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "pow-x-n",
      title: "Pow(x, n)",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/pow-x-n",
      summary: "Exponentiation by squaring: halve the exponent, square the base — O(log n), negatives included.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners multiply $x$ by itself $N$ times ($O(N)$ loop).
*Why this shatters*: For $N = 2^{31} - 1$, multiplying 2 billion times results in a TLE timeout.

**The Structural Invariant: Binary Exponentiation by Squaring ($O(\\log N)$).**
Exploit $x^{2n} = (x^2)^n$:
- **Recurrence**:
  - If $n$ is even: $x^n = (x^2)^{n/2}$
  - If $n$ is odd: $x^n = x \\cdot (x^2)^{(n-1)/2}$
- **Negative Exponent $n < 0$**:
  - Convert $x = 1 / x$, $n = -n$.
- **Base Case**: $n == 0 \\implies 1$.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 10], "note": "pow(2, 10): n=10 (even) -> pow(4, 5)." },
    { "cells": [4, 5], "note": "pow(4, 5): n=5 (odd) -> 4 * pow(16, 2)." },
    { "cells": [16, 2], "note": "pow(16, 2): n=2 (even) -> pow(256, 1)." },
    { "cells": [256, 1], "highlight": [0], "note": "pow(256, 1): 256 * 1 = 256 -> Unwind: 256 * 4 = 1024! Log2(N) steps." }
  ],
  "caption": "Pow(x, n) — Exponentiation by squaring in O(log N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Integer Overflow on Negative Min*: $-n$ for $n = -2^{31}$ overflows 32-bit signed integers. Use double/64-bit integer variables for $n$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does Exponentiation by Squaring reduce time complexity from O(N) to O(log N)?",
          options: [
            "By sorting exponent factors.",
            "By halving the exponent at each step (x^n = (x^2)^(n/2) for even n), reducing total multiplications to log2(N).",
            "By using logarithmic tables.",
            "By converting x to a float."
          ],
          correct_index: 1,
          model_answer: "Squaring the base halves the exponent at each step, achieving logarithmic O(log N) recursive depth.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "How are negative exponents (n < 0) handled in Pow(x, n)?",
          model_answer: "By converting x = 1 / x and using positive exponent |n|.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "multiply-strings",
      title: "Multiply Strings",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/multiply-strings",
      summary: "Grade-school multiplication with one identity: digit i × digit j lands at positions i+j and i+j+1.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners parse input strings into integers using \`parseInt()\`.
*Why this shatters*: Inputs can be hundreds of digits long, breaking standard number type bounds.

**The Structural Invariant: Position Identity Accumulation.**
For two numbers of length $M$ and $N$, their product takes at most **$M + N$ digits**.
- **Digit Position Identity**:
  - The product of \`num1[i]\` and \`num2[j]\` contributes to indices **\`i + j\` (carry)** and **\`i + j + 1\` (digit)** in the result array!
- **Algorithm**:
  - Initialize \`res = Array(M + N).fill(0)\`.
  - Nested loop $i$ from $M-1 \\dots 0$, $j$ from $N-1 \\dots 0$:
    - \`mul = num1[i] * num2[j]\`.
    - \`sum = mul + res[i + j + 1]\`.
    - \`res[i + j + 1] = sum % 10\`.
    - \`res[i + j] += Math.floor(sum / 10)\`.
  - Strip leading zeros and join to string.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 10, 3, 5], "note": "'23' * '45': Raw product accumulation at indices i+j and i+j+1." },
    { "cells": [1, 0, 3, 5], "highlight": [0, 1, 2, 3], "note": "After carry ripple: '1035'!" }
  ],
  "caption": "Multiply Strings — Index position identity accumulation."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Zero Input*: If either string is \`"0"\`, return \`"0"\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Where do the product digits of num1[i] and num2[j] land in the result array of size M + N?",
          options: [
            "Indices i and j",
            "Indices i + j (carry) and i + j + 1 (low digit)",
            "Indices i * j",
            "Index 0"
          ],
          correct_index: 1,
          model_answer: "Grade-school column multiplication places the product of digits i and j across positions i + j and i + j + 1.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the maximum number of digits in the product of an M-digit number and an N-digit number?",
          model_answer: "At most M + N digits.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "detect-squares",
      title: "Detect Squares",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-squares",
      summary: "Fix the diagonal: for each candidate opposite corner, the other two corners are determined — count with a map.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners check all triples of stored points for each query ($O(P^3)$ time).
*Why this shatters*: Triple point checking is far too slow for streaming queries.

**The Structural Invariant: Opposite Diagonal Corner Fixing.**
An axis-aligned square is fully determined by its **opposite diagonal corners**:
- Given query point $(qx, qy)$ and candidate opposite corner $(x, y)$:
  - Check if $(x, y)$ forms a valid **diagonal**:
    $$\\text{Math.abs}(x - qx) == \\text{Math.abs}(y - qy) > 0$$
  - If valid, the remaining two required corners are **FIXED**:
    - Corner 3: $(qx, y)$
    - Corner 4: $(x, qy)$
- **Count Calculation**:
  $$\\text{Total} += \\text{countMap}[(x, y)] \\times \\text{countMap}[(qx, y)] \\times \\text{countMap}[(x, qy)]$$

\`\`\`viz:table-diff
{
  "columns": ["Candidate Point", "Diagonal Check |x-qx|==|y-qy|", "Fixed Corners Required", "Square Count"],
  "before": [["(3, 10)", "dx=8, dy=0 -> FAIL", "-", "Skip"]],
  "after": [["(3, 2)", "dx=8, dy=8 -> MATCH!", "Needs (11,2) & (3,10)", "+= count(3,2) * count(11,2) * count(3,10)"]],
  "caption": "Detect Squares — Opposite diagonal corner fixing with O(1) hash map lookup."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Duplicate Points*: Duplicate point insertions multiply valid square combinations.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does fixing the opposite diagonal corner (x, y) for a query point (qx, qy) allow O(1) square detection?",
          options: [
            "Because squares have 4 equal sides.",
            "Because an axis-aligned square's remaining 2 corners are mathematically fixed at (qx, y) and (x, qy), allowing direct O(1) Hash Map lookups.",
            "Because query points are unique.",
            "Because diagonal slopes are always 0."
          ],
          correct_index: 1,
          model_answer: "Two opposite diagonal corners uniquely specify the coordinates of the remaining two corners in an axis-aligned square.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of the count(point) operation in Detect Squares?",
          model_answer: "O(P) time complexity where P is the number of distinct points stored.",
          difficulty: "basic"
        }
      ]
    }
  ]
};
