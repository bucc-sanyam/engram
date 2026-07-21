import type { DsaTopic } from "../types";

/** Chapter 4 — Stack: order of arrival as a data structure. */
export const stack: DsaTopic = {
  slug: "stack",
  title: "Stack",
  chapter: 4,
  tagline: "Last in, first out — the natural shape of anything that nests, defers, or waits its turn.",
  color: "#b48df0",
  prereqs: ["arrays-hashing"],
  unlocks: [],
  intro: `A stack is the simplest data structure with an opinion. You may only touch the top: push onto it, pop off it. That restriction looks like a weakness and is actually the entire point — because an astonishing number of processes in computing are *last-in, first-out by nature*. The most recently opened bracket is the first one that must close. The most recently deferred question is the first one the future answers. Your language runtime agrees: every function call in every program you have ever run lives on a call stack.

This chapter teaches two distinct superpowers that happen to share the same API. The first is **matching what nests**: Valid Parentheses is the pattern's hello-world, and Evaluate Reverse Polish Notation shows the same machinery computing arithmetic. Min Stack sits between them as a design exercise — augmenting a stack so it can answer a question (the current minimum) that popping normally destroys.

The second superpower is subtler and carries the chapter's hard problems: the **monotonic stack**, which you already met lying on its side as the deque in Sliding Window Maximum.`,
  problems: [
    {
      slug: "valid-parentheses",
      title: "Valid Parentheses",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/validate-parentheses",
      summary: "Every closer must match the most recent unclosed opener — LIFO stated as a law of nature.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners often try to count brackets using counter variables: \`open_count++\` on \`'('\` and \`open_count--\` on \`')'\`.
*Why this shatters*: Counter variables fail on multiple bracket types! Counterexample: \`s = "(]"\` or \`s = "([)]"\`. Both have matching total numbers of open and closed brackets, but they are **invalid** because bracket nesting is violated!

**The Structural Invariant: LIFO Nesting Guarantee.**
The most recently opened bracket must be the FIRST one to close.
- **Opener (\`'(' \`,'[' \`,'{' \`)**: Push onto the stack.
- **Closer (\`')' \`,']' \`,'}' \`)**:
  - Check top of stack. If stack is empty OR top does NOT match the required opener $\\rightarrow$ **INVALID** immediately.
  - If matching opener is at the top $\\rightarrow$ **POP** top of stack.
- **Final Validation**: Stack must be empty at the end (no unclosed openers remaining).

\`\`\`viz:array
{
  "frames": [
    { "cells": ["("], "highlight": [0], "note": "Read '(': Opener -> Push '('. Stack: ['(']." },
    { "cells": ["(", "["], "highlight": [1], "note": "Read '[': Opener -> Push '['. Stack: ['(', '[']." },
    { "cells": ["("], "highlight": [0], "note": "Read ']': Closer -> Top is '[' (matches!)] -> Pop '['. Stack: ['(']." },
    { "cells": [], "note": "Read ')': Closer -> Top is '(' (matches!) -> Pop '('. Stack is empty -> VALID!" }
  ],
  "caption": "Valid Parentheses — LIFO Stack validates nested bracket structures in O(N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Three Classic Failure Modes*:
  1. *Unmatched Closer*: \`s = "]" \` $\\rightarrow$ Stack is empty when closer arrives.
  2. *Mismatched Type*: \`s = "(]" \` $\\rightarrow$ Stack top doesn't match closer.
  3. *Unclosed Opener*: \`s = "((" \` $\\rightarrow$ Stack is NOT empty at the end.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does a simple counter integer fail to validate strings containing multiple types of brackets (e.g. '([)]')?",
          options: [
            "Because integers cannot handle negative values.",
            "Because counters cannot track the order and nesting relationship between different bracket types.",
            "Because counters take O(N^2) space.",
            "Because stack operations require string conversion."
          ],
          correct_index: 1,
          model_answer: "Counters only track quantities, not order. A stack preserves the LIFO order required to enforce that the most recently opened bracket matches the current closing bracket.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What must be checked at the end of string processing in Valid Parentheses?",
          model_answer: "Check `stack.length === 0`. If the stack is not empty, there are leftover unclosed opening brackets (e.g., \"((\"), rendering the string invalid.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "min-stack",
      title: "Min Stack",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/minimum-stack",
      summary: "Design a stack that also reports its minimum in O(1) — by snapshotting history on the way in.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners keep a single stack and a scalar variable \`minVal\`. When a smaller element arrives, they update \`minVal = new_val\`.
*Why this shatters*: What happens when you **pop** that minimum element? The scalar \`minVal\` is lost! You have no way of knowing what the *previous* minimum was without scanning the entire stack in $O(N)$ time.

**The Structural Invariant: Parallel History Stack.**
To support $O(1)$ \`getMin()\`, we must record **the minimum element AT THAT POINT IN TIME** alongside every push!
- Maintain a parallel \`minStack\`.
- \`push(val)\`: Push \`val\` to main stack. Push \`min(val, minStack.top())\` to \`minStack\`.
- \`pop()\`: Pop from both main stack and \`minStack\`.
- \`getMin()\`: Read top of \`minStack\` in $O(1)$.

\`\`\`viz:array
{
  "frames": [
    { "cells": [5], "highlight": [0], "note": "Push 5: min(5, infinity) = 5. Main: [5], MinStack: [5]." },
    { "cells": [5, 2], "highlight": [1], "note": "Push 2: min(2, top 5) = 2. Main: [5, 2], MinStack: [5, 2]." },
    { "cells": [5, 2, 7], "highlight": [2], "note": "Push 7: min(7, top 2) = 2. Main: [5, 2, 7], MinStack: [5, 2, 2]." },
    { "cells": [5, 2], "highlight": [1], "note": "Pop(): Both stacks pop top element. MinStack top automatically reverts to 2 in O(1)!" }
  ],
  "caption": "Min Stack — Parallel history stack snapshotting current minimum at every step."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Equal Minimums*: If \`minStack\` top is 2 and we push another 2, we MUST push 2 onto \`minStack\`! Otherwise, popping the first 2 will corrupt the minimum history.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does Min Stack achieve O(1) time complexity for getMin() after popping the current minimum element?",
          options: [
            "By sorting the stack in ascending order on every pop.",
            "By storing a snapshot of the minimum element as of each push on a parallel minStack.",
            "By re-scanning the stack in O(1) time.",
            "By using a Binary Search Tree."
          ],
          correct_index: 1,
          model_answer: "The parallel minStack records the historical minimum at each level of the stack. Popping the top element automatically reveals the previous historical minimum beneath it in O(1).",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "How can you optimize space in Min Stack if there are many duplicate pushes of the same minimum value?",
          model_answer: "Instead of pushing duplicates, push tuples `(val, count)` onto `minStack`. Increment `count` on identical pushes and decrement on pop, saving memory when values repeat.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "evaluate-reverse-polish-notation",
      title: "Evaluate Reverse Polish Notation",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/evaluate-reverse-polish-notation",
      summary: "Postfix arithmetic: operands wait on the stack, every operator consumes the two most recent.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners get confused by the absence of parentheses in postfix notation (RPN) and try to convert it back into infix notation (\`3 + 4\`) using complex string regex.
*Why RPN is superior*: Postfix eliminates all parenthetical ambiguity! Operators immediately follow their required operands.

**The Structural Invariant: Operand Stack Machine.**
- Walk tokens left-to-right.
- **Number Token**: Parse integer and **PUSH** onto stack.
- **Operator Token (\`+\`, \`-\`, \`*\`, \`/\`)**:
  - **POP \`b\`** (second operand / right operand).
  - **POP \`a\`** (first operand / left operand).
  - Perform operation: \`result = a op b\` (Note the order: \`a - b\` or \`a / b\`).
  - **PUSH \`result\`** back onto stack.

\`\`\`viz:array
{
  "frames": [
    { "cells": [4, 13, 5], "note": "Tokens ['4', '13', '5', '/', '+']. Push 4, 13, 5. Stack: [4, 13, 5]." },
    { "cells": [4, 2], "highlight": [1], "note": "Token '/': Pop b=5, a=13. Evaluate 13 / 5 = 2 (truncate). Push 2. Stack: [4, 2]." },
    { "cells": [6], "highlight": [0], "note": "Token '+': Pop b=2, a=4. Evaluate 4 + 2 = 6. Push 6. Stack: [6] (Final Answer!)." }
  ],
  "caption": "Evaluate Reverse Polish Notation — Postfix stack evaluation in O(N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Operand Order Trap*: The FIRST popped element is the RIGHT operand (\`b\`); the SECOND popped element is the LEFT operand (\`a\`). For division and subtraction, \`a / b\` vs \`b / a\` is the difference between correct code and wrong answers!
- *Truncation toward Zero*: In JavaScript/Python, integer division must truncate toward zero (e.g., \`Math.trunc(a / b)\`).`,
      questions: [
        {
          kind: "mcq",
          prompt: "When popping operands 'b' (first pop) and 'a' (second pop) for an operator '/' in RPN, how must the operation be evaluated?",
          options: [
            "b / a",
            "a / b",
            "a * b",
            "(a + b) / 2"
          ],
          correct_index: 1,
          model_answer: "The second popped value ('a') was pushed earlier, meaning it is the left operand. The first popped value ('b') is the right operand. Thus, the operation is a / b.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why does Postfix (RPN) notation eliminate the need for parentheses and operator precedence rules?",
          model_answer: "Because the order of operations is completely determined by the positioning of operators relative to operands. An operator always acts immediately on the two most recently calculated values.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "daily-temperatures",
      title: "Daily Temperatures",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/daily-temperatures",
      summary: "The monotonic stack arrives: each day waits on the stack until a warmer one resolves it.",
      body: `**Beginner Intuition & The Naive Fallacy.** For each day $i$, beginners scan forward through days $j > i$ to find the first temperature strictly greater than \`temperatures[i]\`.
*Why this shatters*: For a decreasing array like \`[90, 80, 70, 60, 50, 100]\`, nested loops run $O(N^2)$ iterations!

**The Structural Invariant: Monotonic Decreasing Stack of Unresolved Days.**
Instead of having days search into the future, let **arriving warm days resolve the waiting days of the past**!
- Maintain a stack storing **indices** of days whose warmer future day has not yet been found.
- The temperatures at these stored indices are kept in **strictly decreasing order** from bottom to top.
- **When \`temp[i]\` arrives**:
  - While stack is NOT empty AND \`temp[i] > temp[stack.top()]\`:
    - Pop index \`prev_day = stack.pop()\`.
    - Record answer: \`res[prev_day] = i - prev_day\` (days waited!).
  - Push current index \`i\` to stack.

\`\`\`viz:array
{
  "frames": [
    { "cells": [73, 74, 75, 71, 69, 72, 76], "pointers": [{ "label": "i=0 (73)", "index": 0 }], "note": "Push i=0 (73). Stack: [0]." },
    { "cells": [73, 74, 75, 71, 69, 72, 76], "pointers": [{ "label": "i=1 (74)", "index": 1 }], "highlight": [0, 1], "note": "74 > 73! Pop i=0. res[0] = 1 - 0 = 1 day. Push i=1 (74). Stack: [1]." },
    { "cells": [73, 74, 75, 71, 69, 72, 76], "pointers": [{ "label": "i=5 (72)", "index": 5 }], "highlight": [4, 5], "note": "Stack has [2(75), 3(71), 4(69)]. 72 arrives: 72 > 69 -> pop 4, res[4]=1. 72 > 71 -> pop 3, res[3]=2. 72 < 75 -> Push 5. Stack: [2, 5]." }
  ],
  "caption": "Daily Temperatures — Monotonic decreasing stack resolving past days in O(N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Unresolved Days*: Days remaining on the stack at the end of the array never found a warmer day $\\rightarrow$ their answer remains default \`0\`.
- *Amortized $O(N)$ Proof*: Every day index is pushed to the stack once and popped at most once. Total operations = $2N = O(N)$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What does the Monotonic Stack store in Daily Temperatures?",
          options: [
            "Sorted temperature values.",
            "Indices of days that are still waiting for a warmer future temperature.",
            "Difference between temperatures.",
            "Maximum temperature seen so far."
          ],
          correct_index: 1,
          model_answer: "Storing day indices allows us to calculate the exact distance (i - stack.top()) when a warmer day is encountered.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why is the stack maintained in strictly decreasing order of temperatures?",
          model_answer: "If a new temperature were greater than or equal to the top of the stack, it would immediately pop and resolve that top element before pushing itself. Thus, only smaller temperatures can remain stacked on top.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "car-fleet",
      title: "Car Fleet",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/car-fleet",
      summary: "Sort by position, think in arrival times: fleets form exactly where a slower leader absorbs the fast.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners attempt to simulate car movements frame-by-frame on a timeline.
*Why this shatters*: Simulating positions leads to floating-point precision issues and unbounded iterations if speeds/distances are large!

**The Structural Invariant: Monotonic Time-to-Target Stack.**
1. **Compute Alone Arrival Time** for each car:
   $$\\text{time}[i] = \\frac{\\text{target} - \\text{position}[i]}{\\text{speed}[i]}$$
2. **Sort cars by starting position DESCENDING** (cars closest to target first).
3. **The Absorption Rule**:
   - A car starting further back with arrival time $T_{\\text{behind}} \\le T_{\\text{ahead}}$ will **catch up to the lead car** and join its fleet! (Its effective arrival time becomes $T_{\\text{ahead}}$).
   - If $T_{\\text{behind}} > T_{\\text{ahead}}$, it can NEVER catch up, forming a new independent car fleet leader!
4. **Stack Maintenance**: Push arrival times. If new arrival time $\\le$ stack top, pop it (it merged into the fleet ahead!).

\`\`\`viz:array
{
  "frames": [
    { "cells": ["pos: 10, time: 1.0", "pos: 8, time: 1.0", "pos: 0, time: 12.0"], "pointers": [{ "label": "car 0", "index": 0 }], "note": "Target = 12. Sorted by pos desc: [10, 8, 0]. Car at 10 has time = (12-10)/2 = 1.0. Push 1.0." },
    { "cells": ["pos: 10, time: 1.0", "pos: 8, time: 1.0", "pos: 0, time: 12.0"], "pointers": [{ "label": "car 1", "index": 1 }], "note": "Car at 8 has time = (12-8)/4 = 1.0. 1.0 <= 1.0 (top) -> Merges into fleet ahead! Do NOT push." },
    { "cells": ["pos: 10, time: 1.0", "pos: 8, time: 1.0", "pos: 0, time: 12.0"], "pointers": [{ "label": "car 2", "index": 2 }], "highlight": [0, 2], "note": "Car at 0 has time = (12-0)/1 = 12.0. 12.0 > 1.0 -> New Fleet! Push 12.0. Total Fleets = 2." }
  ],
  "caption": "Car Fleet — Sorting by position + monotonic arrival time stack in O(N log N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Floating Point Math*: Use double/float precision for arrival time calculations \`(target - pos) / speed\`.
- *Direction of Sort*: Always process cars from **closest-to-target to farthest-from-target** (position descending).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must cars be processed in descending order of starting position?",
          options: [
            "Because cars closest to the target dictate the speed of any fleets catching up to them from behind.",
            "Because sorting by position makes speed calculations unnecessary.",
            "Because target distance is always negative.",
            "Because slower cars are always at position 0."
          ],
          correct_index: 0,
          model_answer: "Cars closer to the target act as fleet leaders. A car behind can only catch up to cars ahead of it, so processing front-to-back establishes leader arrival times.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the overall time complexity of Car Fleet?",
          model_answer: "O(N log N) time, dominated by sorting the N cars by starting position.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "largest-rectangle-in-histogram",
      title: "Largest Rectangle in Histogram",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/largest-rectangle-in-histogram",
      summary: "Every bar's best rectangle is bounded by the first shorter bar on each side — and one stack finds both.",
      body: `**Beginner Intuition & The Naive Fallacy.** For every bar $i$, beginners expand left and right to find the nearest shorter bars, calculating $\\text{area} = \\text{height}[i] \\times (\\text{right\_bound} - \\text{left\_bound} - 1)$ in $O(N^2)$ time.
*Why this shatters*: $O(N^2)$ takes 25 million operations for $N = 100,000$.

**The Structural Invariant: Monotonic Increasing Stack of Height Boundaries.**
Any candidate rectangle is height-bottlenecked by a specific bar $i$. That rectangle extends left until a shorter bar is hit, and right until a shorter bar is hit.
- Maintain a stack of \`(index, height)\` in **strictly increasing order of height**.
- **When incoming \`heights[i]\` is SHORTER than \`stack.top()\`**:
  - The incoming index \`i\` is the **RIGHT BOUNDARY** for the taller bar at \`stack.top()\`.
  - Pop \`(pop_idx, pop_h) = stack.pop()\`.
  - The new \`stack.top()\` index is the **LEFT BOUNDARY** for the popped bar!
  - Calculate area:
    $$\\text{Area} = \\text{pop\\_h} \\times (i - \\text{new\\_stack\\_top} - 1)$$
  - Update \`max_area = max(max_area, Area)\`.
- **Push New Bar**: The incoming bar \`heights[i]\` can extend backward to the \`pop_idx\` of the last popped taller bar!

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 1, 5, 6, 2, 3], "pointers": [{ "label": "i=0 (h=2)", "index": 0 }], "note": "Push (0, 2). Stack: [(0,2)]." },
    { "cells": [2, 1, 5, 6, 2, 3], "pointers": [{ "label": "i=1 (h=1)", "index": 1 }], "highlight": [0, 1], "note": "1 < 2! Pop (0,2): Right bound=1, Left bound=-1. Area = 2 * (1 - (-1) - 1) = 2. Push (0, 1) [extended left!]." },
    { "cells": [2, 1, 5, 6, 2, 3], "pointers": [{ "label": "i=4 (h=2)", "index": 4 }], "highlight": [2, 3], "note": "Stack has (1,1), (2,5), (3,6). i=4 (h=2) arrives: Pop (3,6) -> Area=6*1=6. Pop (2,5) -> Area=5*2=10 (Max Area!)." }
  ],
  "caption": "Largest Rectangle in Histogram — Monotonic stack calculating left & right boundaries in O(N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Dummy Zero Flush*: Append a virtual height \`0\` at the end of the \`heights\` array. This forces all remaining bars on the stack to be popped and evaluated before the function completes.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does the Monotonic Stack determine the LEFT boundary for a popped bar in Largest Rectangle in Histogram?",
          options: [
            "The left boundary is always index 0.",
            "The left boundary is the index of the element remaining directly beneath it on the stack after popping.",
            "The left boundary is determined by binary search.",
            "The left boundary is i - 1."
          ],
          correct_index: 1,
          model_answer: "Because the stack maintains strictly increasing heights, the element directly below the popped element on the stack is guaranteed to be the first shorter bar to its left.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "Why do we append a sentinel '0' height to the end of the heights array?",
          model_answer: "A height of 0 is shorter than any valid histogram bar (> 0), ensuring that all un-popped bars remaining on the stack at the end of the array are flushed and evaluated.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
