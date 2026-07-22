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
      body: `**The problem.** Given a string of just \`()[]{}\`, return \`true\` if every bracket is closed by the matching type in the correct order. \`"()[]{}"\` → \`true\`, \`"([)]"\` → \`false\`.
**The signal.** "Match what nests" is the stack's hello-world — the interviewer wants you to reach for LIFO the instant you notice the *most recently opened* bracket must be the first to close.

**Beginner Intuition & The Naive Fallacy.** Beginners often try to count brackets using counter variables: \`open_count++\` on \`'('\` and \`open_count--\` on \`')'\`.
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

**The optimal solution (match against the stack top).**

\`\`\`python
def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in pairs:                        # a closer
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:                                  # an opener
            stack.append(ch)
    return not stack                           # nothing left unclosed
\`\`\`

**Complexity — one linear pass with a stack.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Repeatedly strip matched pairs", "time": "O(N²)", "space": "O(N)", "note": "Each string replace rescans the whole string." },
    { "approach": "LIFO stack of openers", "time": "O(N)", "space": "O(N)", "note": "Push openers, match closers against the top. Interview-optimal.", "best": true }
  ],
  "caption": "N = string length. Worst case (all openers) the stack holds every character, so space is O(N)."
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
      body: `**The problem.** Design a stack supporting \`push\`, \`pop\`, \`top\`, and \`getMin\` — every one in O(1) time. \`push(-2); push(0); push(-3); getMin()\` → \`-3\`; \`pop(); getMin()\` → \`-2\`.
**The signal.** A single \`minVal\` scalar can't survive popping the minimum (the previous min is gone), so the interviewer wants you to store the min-so-far *alongside every element* on a parallel stack.

**Beginner Intuition & The Naive Fallacy.** Beginners keep a single stack and a scalar variable \`minVal\`. When a smaller element arrives, they update \`minVal = new_val\`.
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

**The optimal solution (parallel min stack).**

\`\`\`python
class MinStack:
    def __init__(self):
        self.stack = []
        self.mins = []                                  # min at each level

    def push(self, val):
        self.stack.append(val)
        self.mins.append(min(val, self.mins[-1]) if self.mins else val)

    def pop(self):
        self.stack.pop()
        self.mins.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.mins[-1]                            # O(1)
\`\`\`

**Complexity — trade O(N) memory for O(1) getMin.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Scan the stack on each getMin", "time": "O(N) per getMin", "space": "O(N)", "note": "push/pop are O(1) but getMin walks everything." },
    { "approach": "Parallel min stack", "time": "O(1) all ops", "space": "O(N)", "note": "Each level remembers the min beneath it. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of elements. The min stack mirrors the main stack, doubling memory to make getMin O(1)."
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
      body: `**The problem.** Evaluate an arithmetic expression given in Reverse Polish (postfix) notation, where operators follow their operands. \`["2","1","+","3","*"]\` → \`9\`.
**The signal.** Postfix has no parentheses and no precedence to reason about — operands simply *wait*, and each operator consumes the two most recent. "Wait, then consume the last two" is a textbook stack.

**Beginner Intuition & The Naive Fallacy.** Beginners get confused by the absence of parentheses in postfix notation (RPN) and try to convert it back into infix notation (\`3 + 4\`) using complex string regex.
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

**The optimal solution (operand stack machine).**

\`\`\`python
def eval_rpn(tokens):
    stack = []
    ops = {'+', '-', '*', '/'}
    for t in tokens:
        if t in ops:
            b = stack.pop()               # right operand (popped first)
            a = stack.pop()               # left operand
            if t == '+':   stack.append(a + b)
            elif t == '-': stack.append(a - b)
            elif t == '*': stack.append(a * b)
            else:          stack.append(int(a / b))   # truncate toward zero
        else:
            stack.append(int(t))
    return stack[0]
\`\`\`

**Complexity — each token is handled once.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Convert to infix + re-parse", "time": "O(N²)", "space": "O(N)", "note": "Rebuilding parenthesised infix is error-prone and slow." },
    { "approach": "Operand stack machine", "time": "O(N)", "space": "O(N)", "note": "Push numbers, apply operators to the top two. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of tokens. The stack holds pending operands, at most O(N) of them."
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
      body: `**The problem.** For each day, return how many days you must wait for a warmer temperature (\`0\` if none ever comes). \`[73,74,75,71,69,72,76,73]\` → \`[1,1,4,2,1,1,0,0]\`.
**The signal.** "For each element, the distance to the next greater one" is the monotonic-stack tell. Instead of each day searching forward, let an arriving warm day *resolve* the colder days still waiting below it.

**Beginner Intuition & The Naive Fallacy.** For each day $i$, beginners scan forward through days $j > i$ to find the first temperature strictly greater than \`temperatures[i]\`.
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

**The optimal solution (monotonic decreasing stack).**

\`\`\`python
def daily_temperatures(temperatures):
    res = [0] * len(temperatures)
    stack = []                            # indices, temperatures decreasing
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            j = stack.pop()
            res[j] = i - j                # days this earlier day waited
        stack.append(i)
    return res
\`\`\`

**Complexity — each index is pushed and popped once.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Scan forward from each day", "time": "O(N²)", "space": "O(1)", "note": "A decreasing run makes every day rescan the rest." },
    { "approach": "Monotonic decreasing stack", "time": "O(N)", "space": "O(N)", "note": "Warm days resolve the waiting cold days. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of days. Every index enters and leaves the stack at most once → linear total work."
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
      body: `**The problem.** Cars on a one-lane road all head to the same \`target\` at fixed speeds; a faster car that catches a slower one ahead joins its fleet and can never pass. Return the number of fleets that arrive. \`target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]\` → \`3\`.
**The signal.** Simulating positions frame-by-frame is a trap. The interviewer wants you to sort by position and compare *arrival times*: a car merges into the fleet ahead exactly when it would arrive no later than that fleet's leader.

**Beginner Intuition & The Naive Fallacy.** Beginners attempt to simulate car movements frame-by-frame on a timeline.
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

**The optimal solution (sort by position, compare arrival times).**

\`\`\`python
def car_fleet(target, position, speed):
    cars = sorted(zip(position, speed), reverse=True)   # closest to target first
    fleets = 0
    lead_time = 0.0                       # arrival time of the current fleet leader
    for pos, spd in cars:
        time = (target - pos) / spd
        if time > lead_time:              # can't catch up → starts a new fleet
            fleets += 1
            lead_time = time
    return fleets
\`\`\`

**Complexity — sorting dominates the single sweep.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Simulate positions over time", "time": "O(target)", "space": "O(N)", "note": "Slow and prone to floating-point drift." },
    { "approach": "Sort by position + arrival-time sweep", "time": "O(N log N)", "space": "O(N)", "note": "One scan counts fleets after the sort. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of cars. The O(N log N) sort dominates; the fleet-counting sweep is O(N). (The stack of times is equivalent to the single lead-time scalar shown here.)"
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
      body: `**The problem.** Given bar heights, return the area of the largest rectangle that fits entirely under the histogram. \`[2,1,5,6,2,3]\` → \`10\` (bars 5 and 6 spanning width 2).
**The signal.** Each bar's widest rectangle runs until the first *shorter* bar on each side. Computing "nearest smaller to the left and to the right" for every bar in a single pass is the monotonic-stack signature.

**Beginner Intuition & The Naive Fallacy.** For every bar $i$, beginners expand left and right to find the nearest shorter bars, calculating $\\text{area} = \\text{height}[i] \\times (\\text{right\_bound} - \\text{left\_bound} - 1)$ in $O(N^2)$ time.
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

**The optimal solution (monotonic increasing stack).**

\`\`\`python
def largest_rectangle_area(heights):
    stack = []                            # (start_index, height), heights increasing
    best = 0
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            best = max(best, height * (i - idx))   # right bound is i
            start = idx                   # h can extend back to idx
        stack.append((start, h))
    n = len(heights)
    for idx, height in stack:             # flush bars that reach the end
        best = max(best, height * (n - idx))
    return best
\`\`\`

**Complexity — nearest-smaller on both sides in one pass.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Expand left/right per bar", "time": "O(N²)", "space": "O(1)", "note": "Re-finds both boundaries for every bar." },
    { "approach": "Monotonic increasing stack", "time": "O(N)", "space": "O(N)", "note": "Popping gives right bound; the new top gives left bound. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of bars. Each bar is pushed and popped once, so the whole sweep is linear."
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
