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
  intro: `Underneath every structure in this atlas — the hash maps, the heaps, the DP tables — a number was never a quantity. It was thirty-two or sixty-four switches in a row, and the machine flips them in bulk, one clock cycle at a time. This final chapter drops to that level. It is the shortest chapter and the most alien-feeling one, because its tools are not algorithms so much as *identities* — small algebraic facts about AND, OR, XOR, NOT, and shifts that turn whole loops into single instructions.`,
  problems: [
    {
      slug: "single-number",
      title: "Single Number",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/single-number",
      summary: "Every number appears twice except one — XOR them all and the pairs annihilate.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use a Hash Set or Hash Map to count occurrences ($O(N)$ space).
*Why this shatters*: The problem explicitly requires **linear $O(N)$ time with strictly $O(1)$ auxiliary space**.

**The Structural Invariant: XOR Self-Annihilation.**
Bitwise XOR ($\\,^\\,$) satisfies three crucial properties:
1. **Self-Annihilation**: $x \\oplus x = 0$ (Equal numbers cancel each other out!).
2. **Identity**: $x \\oplus 0 = x$.
3. **Commutative & Associative**: $a \\oplus b \\oplus a = (a \\oplus a) \\oplus b = 0 \\oplus b = b$.
- **Algorithm**: XOR all numbers together into a single running total \`res\`. Every duplicate pair cancels out to 0, leaving ONLY the single un-paired number!

\`\`\`viz:array
{
  "frames": [
    { "cells": [4, 1, 2, 1, 2], "pointers": [{ "label": "i=0", "index": 0 }], "note": "res = 4." },
    { "cells": [4, 1, 2, 1, 2], "pointers": [{ "label": "i=1", "index": 1 }], "note": "4 ^ 1 = 5." },
    { "cells": [4, 1, 2, 1, 2], "pointers": [{ "label": "i=3", "index": 3 }], "highlight": [1, 3], "note": "5 ^ 2 ^ 1 = 6 (the two 1s cancel!)." },
    { "cells": [4, 1, 2, 1, 2], "pointers": [{ "label": "i=4", "index": 4 }], "highlight": [0, 2, 4], "note": "6 ^ 2 = 4 (the two 2s cancel!). Single number = 4!" }
  ],
  "caption": "Single Number — XOR cancellation in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *XOR Never Overflows*: Bitwise XOR operates on individual bits without arithmetic carries.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What mathematical property of bitwise XOR allows Single Number to find the unpaired element in O(1) space?",
          options: [
            "x ^ 1 = x",
            "x ^ x = 0 (self-annihilation) and x ^ 0 = x (identity), combined with commutativity.",
            "x ^ 0 = 0",
            "x ^ y = x + y"
          ],
          correct_index: 1,
          model_answer: "Self-annihilation cancels identical pairs (x ^ x = 0), leaving the unique element untouched.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the result of 7 ^ 7 ^ 9 ^ 3 ^ 9?",
          model_answer: "3. 7^7=0, 9^9=0, leaving 0^0^3 = 3.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "number-of-1-bits",
      title: "Number of 1 Bits",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/number-of-one-bits",
      summary: "Popcount: n & (n − 1) deletes the lowest set bit — loop once per 1, not once per bit.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners shift right 32 times, checking the lowest bit (\`n & 1\`) on every iteration.
*Why this shatters*: A 32-shift loop ALWAYS takes 32 iterations, even if the number has only 1 set bit (e.g. $n = 1$).

**The Structural Invariant: Lowest Set Bit Elimination Trick (\`n & (n - 1)\`).**
Subtracting 1 from $n$ flips the lowest set bit to 0 and all bits below it to 1:
- Bitwise ANDing \`n = n & (n - 1)\` **clears the lowest set bit of $n$ in a single instruction**!
- **Algorithm**:
  - Maintain \`count = 0\`.
  - While \`n != 0\`:
    - \`n = n & (n - 1)\`
    - \`count++\`
  - Return \`count\`. Loop executes ONLY as many times as there are 1-bits!

\`\`\`viz:array
{
  "frames": [
    { "cells": ["1", "0", "1", "1"], "highlight": [3], "note": "n = 1011 (3 set bits). Lowest set bit at idx 3." },
    { "cells": ["1", "0", "1", "0"], "highlight": [2], "note": "n & (n - 1) = 1010. Lowest 1 cleared! count = 1." },
    { "cells": ["1", "0", "0", "0"], "highlight": [0], "note": "n & (n - 1) = 1000. Second 1 cleared! count = 2." },
    { "cells": ["0", "0", "0", "0"], "note": "n & (n - 1) = 0000. Final 1 cleared! count = 3." }
  ],
  "caption": "Number of 1 Bits — n & (n - 1) eliminating lowest 1-bits."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Unsigned Loop Condition*: In JavaScript, use \`n !== 0\` instead of \`n > 0\` because bitwise operators treat inputs as signed 32-bit integers (leading 1 becomes negative!).`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does the operation n & (n - 1) perform in bit manipulation?",
          options: [
            "Doubles the value of n.",
            "Clears (sets to 0) the lowest set 1-bit in n.",
            "Flips all bits in n.",
            "Sets the lowest 0-bit to 1."
          ],
          correct_index: 1,
          model_answer: "Subtracting 1 flips the lowest set 1-bit and trailing zeros. ANDing with n zeroes out that lowest set 1-bit.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "How many iterations does the n & (n - 1) loop perform for n = 16 (binary 10000)?",
          model_answer: "Exactly 1 iteration.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "counting-bits",
      title: "Counting Bits",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/counting-bits",
      summary: "dp[i] = dp[i >> 1] + (i & 1): every number's bit count is its half's count plus its last bit.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners calculate popcount independently for each number $0 \dots N$ ($O(N \log N)$).
*Why this shatters*: Independent computation repeats set bit counts for overlapping sub-numbers.

**The Structural Invariant: Sub-problem Shift Recurrence ($O(N)$ DP).**
Notice that shifting a number right by 1 bit (\`i >> 1\`) yields a smaller number whose set bit count is ALREADY COMPUTED:
- \`i >> 1\` is $i$ with its lowest bit dropped.
- **Recurrence**:
  $$\text{dp}[i] = \text{dp}[i \\gg 1] + (i \\;\\&\\; 1)$$
- **Base Case**: \`dp[0] = 0\`.
- Single loop $i$ from $1 \dots N$ fills array in $O(N)$ time with $O(1)$ work per cell.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0], "note": "dp[0] = 0." },
    { "cells": [0, 1, 1, 2], "highlight": [1, 2, 3], "note": "dp[1]=dp[0]+1=1, dp[2]=dp[1]+0=1, dp[3]=dp[1]+1=2." },
    { "cells": [0, 1, 1, 2, 1, 2, 2, 3, 1], "highlight": [4, 5, 6, 7, 8], "note": "dp[4]=dp[2]+0=1, dp[5]=dp[2]+1=2, dp[6]=dp[3]+0=2, dp[7]=dp[3]+1=3, dp[8]=dp[4]+0=1." }
  ],
  "caption": "Counting Bits — dp[i] = dp[i >> 1] + (i & 1) dynamic programming recurrence."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Bitwise Precedence*: Bitwise operators have low operator precedence! Always wrap in parentheses: \`dp[i >> 1] + (i & 1)\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the recurrence relation for Counting Bits in terms of DP?",
          options: [
            "dp[i] = dp[i-1] + 1",
            "dp[i] = dp[i >> 1] + (i & 1)",
            "dp[i] = dp[i / 2] * 2",
            "dp[i] = dp[i & (i-1)]"
          ],
          correct_index: 1,
          model_answer: "dp[i >> 1] retrieves the bit count of i with its least significant bit removed, and (i & 1) adds 1 if that removed bit was a 1.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of Counting Bits for generating counts up to N?",
          model_answer: "O(N) time complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "reverse-bits",
      title: "Reverse Bits",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/reverse-bits",
      summary: "Mirror a 32-bit word: peel bits off one end, push them onto the other, thirty-two times.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners convert the number to a binary string, reverse the string, and parse back.
*Why this shatters*: String conversion is slow and fails to handle 32-bit leading/trailing zero padding correctly.

**The Structural Invariant: 32-Step Bit Shift Conveyor.**
Iterate 32 times:
1. Shift current \`res\` left by 1 bit (\`res <<= 1\`) to make space for the incoming bit.
2. Extract lowest bit of $n$ (\`n & 1\`) and OR it into \`res\` (\`res |= (n & 1)\`).
3. Logical shift $n$ right by 1 bit (\`n >>>= 1\`).
- **32-Bit Unsigned Fix**: Return \`res >>> 0\` (unsigned right shift forces JavaScript to treat result as a 32-bit unsigned integer!).

\`\`\`viz:array
{
  "frames": [
    { "cells": ["0", "0", "0", "0", "0", "1", "0", "1"], "note": "n = 00000101. Peel rightmost bit (1)." },
    { "cells": ["1"], "note": "res = 1." },
    { "cells": ["1", "0", "1", "0", "0", "0", "0", "0"], "highlight": [0, 1, 2], "note": "After 32 shifts: res = 10100000 (padding 0s become trailing)." }
  ],
  "caption": "Reverse Bits — 32-step shift conveyor in O(1) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Unsigned Right Shift*: Always use \`>>>\` instead of \`>>\` to prevent sign-extension when shifting negative 32-bit values.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must we use the unsigned right shift (n >>> 1) instead of the arithmetic right shift (n >> 1) in Reverse Bits?",
          options: [
            "Because arithmetic right shift runs faster.",
            "Because arithmetic right shift (>>) preserves the sign bit by padding with 1s for negative numbers, whereas unsigned shift (>>>) always pads with 0s.",
            "To multiply by 2.",
            "Because unsigned shift is always faster than arithmetic shift."
          ],
          correct_index: 1,
          model_answer: "Arithmetic right shift preserves the leading 1 (sign bit) for negative numbers. Unsigned right shift fills empty high bits with 0.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity of Reverse Bits?",
          model_answer: "O(1) time complexity (exactly 32 iterations) and O(1) space complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "missing-number",
      title: "Missing Number",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/missing-number",
      summary: "0..n with one absentee: XOR the range against the array — or subtract sums — and the gap names itself.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners sort the array ($O(N \log N)$) or use a Hash Set ($O(N)$ space).
*Why this shatters*: We can solve this in **$O(N)$ time and $O(1)$ space** using Gauss's sum formula OR XOR cancellation!

**The Structural Invariant: Gauss Sum vs XOR Cancellation.**
- **Method 1: Gauss Expected Sum Difference**:
  - Expected sum of range $0 \dots N$:
    $$\text{expected} = \frac{N \cdot (N + 1)}{2}$$
  - \`missing = expected - sum(nums)\`.
- **Method 2: XOR Index-Value Pairing ($O(1)$ Overflow Safe)**:
  - Initialize \`res = N\`.
  - For each $i \in [0, N-1]$:
    - \`res ^= i ^ nums[i]\`
  - All matching numbers and indices cancel out, leaving ONLY the missing number!

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 0, 1], "note": "nums=[3, 0, 1], N=3. Expected sum = 3*4/2 = 6." },
    { "cells": [3, 0, 1], "highlight": [0, 1, 2], "note": "Actual sum = 3 + 0 + 1 = 4. Missing number = 6 - 4 = 2!" }
  ],
  "caption": "Missing Number — Gauss Sum vs XOR index cancellation."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Overflow Advantage of XOR*: In languages with fixed 32-bit integer limits, Gauss sum $N(N+1)/2$ can overflow if $N$ is very large. XOR never overflows!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is the XOR approach superior to Gauss's sum formula N*(N+1)/2 in languages with strict 32-bit integer limits?",
          options: [
            "XOR is faster than addition.",
            "N*(N+1)/2 can cause integer overflow for large N, whereas bitwise XOR never overflows.",
            "XOR does not require a loop.",
            "Gauss sum only works for even N."
          ],
          correct_index: 1,
          model_answer: "Summing N*(N+1) can exceed 32-bit integer capacity. XOR bitwise operations stay within bit boundaries without overflow.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity of Missing Number?",
          model_answer: "O(N) time complexity and O(1) space complexity.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "sum-of-two-integers",
      title: "Sum of Two Integers",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/sum-of-two-integers",
      summary: "No + allowed: XOR is the carry-less sum, AND-shift is the carries — loop until the carries drain.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to use loops with $+1$ increments or logarithms.
*Why this shatters*: Problem explicitly forbids using operators \`+\` and \`-\`.

**The Structural Invariant: Ripple-Carry Logic Gate Decomposition.**
Binary addition decomposes into two fundamental logic operations:
1. **Sum without Carry** $\rightarrow$ **XOR** (\`a ^ b\`):
   $0+0=0$, $1+0=1$, $0+1=1$, $1+1=0$.
2. **Carry Bits** $\rightarrow$ **AND Shifted Left** (\`(a & b) << 1\`):
   Carry occurs ONLY when both bits are $1$ ($1+1=10_2$).
- **Algorithm**:
  - While \`b != 0\` (while carry bits remain):
    - \`carry = (a & b) << 1\`
    - \`a = a ^ b\` (update carry-less sum)
    - \`b = carry\` (update carry to process next)
  - Return \`a\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["101", "011"], "note": "a=5 (101), b=3 (011)." },
    { "cells": ["110", "010"], "note": "Iter 1: sum(a^b)=110 (6), carry((a&b)<<1)=010 (2)." },
    { "cells": ["100", "100"], "note": "Iter 2: sum=100 (4), carry=100 (4)." },
    { "cells": ["000", "1000"], "note": "Iter 3: sum=000, carry=1000 (8)." },
    { "cells": ["1000"], "highlight": [0], "note": "Iter 4: b=0. Return a = 1000 (8)!" }
  ],
  "caption": "Sum of Two Integers — XOR carry-less sum and AND-shift carry loop."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Negative Numbers in Two's Complement*: This logic gate adder handles negative numbers automatically without any special cases!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Which two bitwise operations substitute for addition and carry calculation in Sum of Two Integers?",
          options: [
            "OR for sum, NOT for carry",
            "XOR (a ^ b) for carry-less sum, and AND-shift ((a & b) << 1) for carry bits.",
            "AND for sum, OR for carry",
            "Shift left for sum, Shift right for carry"
          ],
          correct_index: 1,
          model_answer: "XOR performs addition without carrying. AND masked with 1 and shifted left by 1 generates the carry values.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the maximum number of loop iterations for 32-bit integers in Sum of Two Integers?",
          model_answer: "At most 32 iterations (carries shift left by 1 each iteration and fall off the 32-bit boundary).",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "reverse-integer",
      title: "Reverse Integer",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/reverse-integer",
      summary: "Pop digits, push digits — and prove you won't overflow before each push, not after.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners reverse digits, then check if \`res > 2**31 - 1\`.
*Why this shatters*: In 32-bit languages (C++/Java), computing \`res = res * 10 + pop\` **OVERFLOWS BEFORE THE CHECK EVEN EXECUTES**, causing undefined behavior/crash!

**The Structural Invariant: Predictive Overflow Boundary Guard.**
We must predict if the next digit push will overflow **BEFORE** executing \`res = res * 10 + pop\`:
- Let $\text{MAX} = 2^{31} - 1 = 2,147,483,647$ and $\text{MIN} = -2^{31} = -2,147,483,648$.
- **Positive Overflow Guard**:
  - If \`res > Math.floor(MAX / 10)\` OR (\`res == Math.floor(MAX / 10)\` AND \`pop > 7\`): Return \`0\`!
- **Negative Overflow Guard**:
  - If \`res < Math.ceil(MIN / 10)\` OR (\`res == Math.ceil(MIN / 10)\` AND \`pop < -8\`): Return \`0\`!
- Loop:
  - \`pop = x % 10\`
  - \`x = Math.trunc(x / 10)\`
  - Check guards $\rightarrow$ if failed, return 0.
  - \`res = res * 10 + pop\`

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 5, 3, 4, 2, 3, 6, 4, 6, 9], "note": "x = 1534236469. Pop digits right to left." },
    { "cells": [9, 6, 4, 6, 3, 2, 4, 3, 5], "note": "Popped up to 964632435. Remaining pop = 1." },
    { "cells": [0], "highlight": [0], "note": "Guard check: 964632435 > 214748364 -> PREDICTED OVERFLOW! Return 0!" }
  ],
  "caption": "Reverse Integer — Predictive 32-bit boundary overflow check."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Truncation in JS*: Use \`Math.trunc(x / 10)\` instead of \`Math.floor()\` so negative numbers drop digits correctly toward zero!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must overflow checks be performed BEFORE executing res = res * 10 + pop in Reverse Integer?",
          options: [
            "Because 10 is an even number.",
            "Because executing res * 10 + pop on an overflowing value causes integer overflow BEFORE the conditional statement can even evaluate it.",
            "Because division is slow.",
            "To reverse the string."
          ],
          correct_index: 1,
          model_answer: "In 32-bit environments, multiplying an already large number causes immediate integer overflow hardware exceptions.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is returned if reversing integer x results in a 32-bit overflow?",
          model_answer: "0.",
          difficulty: "basic"
        }
      ]
    }
  ]
};
