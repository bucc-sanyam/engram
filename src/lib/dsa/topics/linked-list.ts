import type { DsaTopic } from "../types";

/** Chapter 6 — Linked List: pointers made physical. */
export const linkedList: DsaTopic = {
  slug: "linked-list",
  title: "Linked List",
  chapter: 6,
  tagline: "No indexes, no random access — just nodes holding hands, and the surgery you perform on them.",
  color: "#f08db8",
  prereqs: ["two-pointers"],
  unlocks: ["trees"],
  intro: `An array is a neighbourhood — everyone has an address, and you can knock on door 40,000 instantly. A linked list is a conga line in the dark: each node knows exactly one thing, who comes next, and to reach anyone you walk the whole chain. That trade sounds terrible until you need to splice: inserting or removing someone mid-line is one pointer rewrite, no mass eviction of neighbours. Caches, schedulers, allocators and every structure that reorders itself constantly are built on this.

For interviews, linked lists are really a test of **pointer discipline** — can you rewire next-references without dropping the rest of the chain on the floor? Two techniques carry the entire chapter: the three-pointer shuffle and Floyd's fast-and-slow runners.`,
  problems: [
    {
      slug: "reverse-linked-list",
      title: "Reverse Linked List",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/reverse-a-linked-list",
      summary: "The three-pointer shuffle: save next, flip the arrow, shift the trio — the chapter's atomic move.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to reverse a linked list by iterating and immediately setting \`curr.next = prev\`.
*Why this shatters*: Overwriting \`curr.next\` instantly **destroys your only link to the rest of the list**! Node \`curr.next\` becomes garbage collected or un-reachable, severing the chain.

**The Structural Invariant: The Four-Beat Pointer Shuffle.**
We must maintain 3 pointers: \`prev\` (initially \`null\`), \`curr\` (initially \`head\`), and \`temp\` (to save the onward link).
- **Beat 1 (Save)**: \`temp = curr.next\` (protect the rest of the list!).
- **Beat 2 (Flip)**: \`curr.next = prev\` (reverse the arrow).
- **Beat 3 (Advance prev)**: \`prev = curr\`.
- **Beat 4 (Advance curr)**: \`curr = temp\`.
- Loop until \`curr == null\`. Return \`prev\` (the new head!).

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3], "pointers": [{ "label": "curr", "index": 0 }], "note": "prev = null, curr = head (1). Initial list: 1 -> 2 -> 3 -> null." },
    { "cells": [1, 2, 3], "pointers": [{ "label": "prev", "index": 0 }, { "label": "curr", "index": 1 }], "highlight": [0], "note": "Save temp=2. Flip 1.next=null. Advance prev=1, curr=2. List: null <- 1, 2 -> 3." },
    { "cells": [1, 2, 3], "pointers": [{ "label": "prev", "index": 1 }, { "label": "curr", "index": 2 }], "highlight": [0, 1], "note": "Save temp=3. Flip 2.next=1. Advance prev=2, curr=3. List: null <- 1 <- 2, 3." },
    { "cells": [1, 2, 3], "pointers": [{ "label": "prev", "index": 2 }], "highlight": [0, 1, 2], "note": "Save temp=null. Flip 3.next=2. Advance prev=3, curr=null. Return prev (3) -> 3 -> 2 -> 1." }
  ],
  "caption": "Reverse Linked List — In-place pointer reversal in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty or 1-Node List*: If \`head == null\` or \`head.next == null\`, return \`head\` directly in $O(1)$.
- *Recursive Variant*: Reverses recursively: \`newHead = reverse(head.next); head.next.next = head; head.next = null;\` ($O(N)$ stack space).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must we store curr.next in a temporary variable 'temp' BEFORE executing curr.next = prev?",
          options: [
            "Because JavaScript requires temporary variables for string conversion.",
            "Because setting curr.next = prev overwrites the next pointer, severing our only reference to the remainder of the linked list.",
            "To calculate the total length of the list.",
            "To prevent memory leaks in the browser."
          ],
          correct_index: 1,
          model_answer: "Overwriting `curr.next` severs the forward pointer to the rest of the list. Storing `curr.next` in `temp` beforehand preserves access to subsequent nodes.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the return value of the iterative Reverse Linked List algorithm when curr becomes null?",
          model_answer: "The algorithm returns `prev`, which sits at the last non-null node of the original list (now the head of the reversed list).",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "merge-two-sorted-lists",
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/merge-two-sorted-linked-lists",
      summary: "Two sorted chains, one dummy head, and a tail that always grabs the smaller front.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to handle special cases for setting the initial new \`head\` pointer before starting the merging loop.
*Why this shatters*: Writing special conditional logic for setting the new head leads to messy, error-prone code with duplicate branches.

**The Structural Invariant: Dummy Head Node & Tail Splice.**
- **The Dummy Node Pattern**: Create a sentinel \`dummy = new ListNode(0)\` and \`tail = dummy\`.
- Compare \`l1.val\` vs \`l2.val\`:
  - Attach smaller node to \`tail.next\`.
  - Advance the pointer of the list that contributed the smaller value.
  - Advance \`tail = tail.next\`.
- **O(1) Residual Splice**: When one list reaches \`null\`, attach the remaining non-null list directly to \`tail.next\` in $O(1)$!
- Return \`dummy.next\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 4], "pointers": [{ "label": "l1", "index": 0 }, { "label": "l2", "index": 0 }], "note": "l1: 1->2->4, l2: 1->3->4. Dummy tail at 0. Compare l1(1) vs l2(1) -> Attach l1(1). l1=2." },
    { "cells": [1, 1, 2], "pointers": [{ "label": "l1", "index": 1 }, { "label": "l2", "index": 1 }], "note": "Compare l1(2) vs l2(1) -> Attach l2(1). l2=3. Tail at 1." },
    { "cells": [1, 1, 2, 3, 4, 4], "highlight": [0, 1, 2, 3, 4, 5], "note": "Continue weaving... l2 reaches null. Splice remaining l1 directly to tail. Return dummy.next." }
  ],
  "caption": "Merge Two Sorted Lists — In-place pointer weaving using a sentinel dummy node."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty Inputs*: If \`l1 == null\`, return \`l2\`. If \`l2 == null\`, return \`l1\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the primary benefit of using a Dummy Sentinel Node when merging linked lists?",
          options: [
            "It automatically sorts the list elements.",
            "It eliminates special-case logic for initializing the result head pointer.",
            "It reduces time complexity from O(N) to O(1).",
            "It converts singly linked lists into doubly linked lists."
          ],
          correct_index: 1,
          model_answer: "A dummy node acts as a fixed anchor. We can append nodes to `tail.next` uniformly without checking if the list head has been assigned.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "Why can the remaining non-null list be attached in O(1) time when one list runs out of nodes?",
          model_answer: "Because linked list nodes are already chained together! When one list empties, the rest of the other list is already sorted and linked, so we just set `tail.next = remaining_list`.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "linked-list-cycle",
      title: "Linked List Cycle",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/linked-list-cycle-detection",
      summary: "Floyd's tortoise and hare: on a looped track, a runner at 2x must lap a runner at 1x.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use a Hash Set to store visited node references as they walk the list ($O(N)$ time, $O(N)$ space).
*Why this shatters*: Storing node references requires $O(N)$ auxiliary memory. The problem challenges us to solve cycle detection in **$O(1)$ constant space**!

**The Structural Invariant: Floyd's Tortoise & Hare Algorithm.**
Place two runners at \`head\`:
- \`slow\` moves 1 step per tick (\`slow = slow.next\`).
- \`fast\` moves 2 steps per tick (\`fast = fast.next.next\`).
- **Proof of Collision**: If no cycle exists, \`fast\` will hit \`null\` and terminate. If a cycle of length $C$ exists, once both runners enter the cycle, the relative distance between \`fast\` and \`slow\` decreases by **1 node per tick**. They are guaranteed to collide (\`slow == fast\`)!

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 2, 0, -4], "pointers": [{ "label": "slow", "index": 0 }, { "label": "fast", "index": 0 }], "note": "List: 3 -> 2 -> 0 -> -4 -> (loops back to 2). Both start at 3." },
    { "cells": [3, 2, 0, -4], "pointers": [{ "label": "slow", "index": 1 }, { "label": "fast", "index": 2 }], "note": "Tick 1: slow at 2 (idx 1), fast at 0 (idx 2)." },
    { "cells": [3, 2, 0, -4], "pointers": [{ "label": "slow", "index": 2 }, { "label": "fast", "index": 1 }], "note": "Tick 2: slow at 0 (idx 2), fast wraps 2->0->-4->2 (idx 1)." },
    { "cells": [3, 2, 0, -4], "pointers": [{ "label": "slow", "index": 3 }, { "label": "fast", "index": 3 }], "highlight": [3], "note": "Tick 3: slow at -4, fast at -4. COLLISION! Cycle detected -> return true." }
  ],
  "caption": "Linked List Cycle — Floyd's fast/slow pointer collision in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Fast Null Checks*: Always verify \`while (fast != null && fast.next != null)\` before advancing \`fast.next.next\` to prevent \`NullPointerExceptions\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why are fast (2x) and slow (1x) pointers mathematically guaranteed to collide if a cycle exists?",
          options: [
            "Because fast skips every odd node.",
            "Because inside a cycle, fast reduces the distance to slow by 1 node per step, reducing the gap to 0.",
            "Because fast resets to head when hitting the loop.",
            "Because linked lists have finite nodes."
          ],
          correct_index: 1,
          model_answer: "With relative speed (2 - 1 = 1 node per step), the gap between fast and slow decreases monotonically by 1 each iteration until collision.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the maximum number of steps fast and slow will take before colliding once slow enters a cycle of length C?",
          model_answer: "At most C steps, since the gap between fast and slow is strictly less than C and decreases by 1 on every step.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "reorder-list",
      title: "Reorder List",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/reorder-linked-list",
      summary: "Find the middle, reverse the back half, interleave — three known moves composed into surgery.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners copy all nodes into an array, then use two pointers on the array to re-link nodes ($O(N)$ space).
*Why this shatters*: The problem requires reordering **in-place without allocating extra array space** ($O(1)$ space).

**The Structural Invariant: Three-Phase List Surgery.**
Reordering $L_0 \\rightarrow L_n \\rightarrow L_1 \\rightarrow L_{n-1}$ composes three atomic operations:
1. **Find Middle**: Use Fast & Slow pointers to locate the list midpoint.
2. **Reverse Second Half**: Split the list at midpoint and reverse the right sub-list using the Three-Pointer Shuffle.
3. **Interleave (Zip)**: Merge the first half and reversed second half by alternating pointers!

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "slow (mid)", "index": 2 }], "highlight": [2], "note": "Phase 1: Find middle. Slow lands on node 3. Split: [1->2->3] and [4->5]." },
    { "cells": [1, 2, 3, 5, 4], "highlight": [3, 4], "note": "Phase 2: Reverse second half [4->5] to get [5->4]." },
    { "cells": [1, 5, 2, 4, 3], "highlight": [0, 1, 2, 3, 4], "note": "Phase 3: Interleave [1->2->3] and [5->4] alternatingly -> 1 -> 5 -> 2 -> 4 -> 3." }
  ],
  "caption": "Reorder List — In-place composition: Midpoint + Reverse + Interleave in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Severing Middle Link*: Remember to set \`slow.next = null\` when splitting the first half from the second half to avoid cyclic pointer references!`,
      questions: [
        {
          kind: "mcq",
          prompt: "What three fundamental linked list operations compose the optimal O(1) space solution for Reorder List?",
          options: [
            "Sort, Filter, Map",
            "Find Midpoint (Fast/Slow), Reverse Second Half, Interleave/Zip",
            "Binary Search, Insertion Sort, Deletion",
            "Hash Map indexing, Quick Sort, Array Merge"
          ],
          correct_index: 1,
          model_answer: "Reorder List is a composite problem combining midpoint finding, list reversal, and alternate node weaving in O(N) time and O(1) space.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What bug occurs if you forget to set `slow.next = null` after splitting the list into two halves?",
          model_answer: "The end of the first half will still point to the start of the second half, causing infinite cyclic loops during the interleaving phase.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "remove-nth-node-from-end-of-list",
      title: "Remove Nth Node From End of List",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/remove-node-from-end-of-linked-list",
      summary: "Two pointers locked n apart: when the leader falls off the end, the trailer stands before the victim.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners count the total length $L$ of the list in one pass, then calculate the target node's 1-based index $(L - N + 1)$ and perform a second pass to delete it.
*Why this shatters*: While $O(N)$ time, it requires **two full passes** over the list. Can we delete the $N$-th node from the end in a **single pass**?

**The Structural Invariant: Two Pointers Locked with Fixed Gap $(N+1)$.**
- Use a \`dummy\` node preceding \`head\`. Place \`left = dummy\` and \`right = dummy\`.
- **Advance \`right\` Pointer**: Move \`right\` forward by $N + 1$ steps.
- **Maintain Gap**: Move both \`left\` and \`right\` forward at equal speed until \`right == null\`.
- *The Result*: When \`right\` reaches the end (\`null\`), \`left\` is standing **EXACTLY one node before the victim**!
- **Splice Out Victim**: \`left.next = left.next.next\`. Return \`dummy.next\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 1, 2, 3, 4, 5], "pointers": [{ "label": "left", "index": 0 }, { "label": "right", "index": 3 }], "note": "Dummy (idx 0). N=2. Advance right by N+1 = 3 steps (to idx 3)." },
    { "cells": [0, 1, 2, 3, 4, 5], "pointers": [{ "label": "left", "index": 3 }, { "label": "right (null)", "index": 6 }], "note": "Advance left & right together until right is null. left lands at idx 3 (node 3)." },
    { "cells": [0, 1, 2, 3, 5], "highlight": [3], "note": "Victim is node 4 (idx 4). Splice: left.next = left.next.next (3.next = 5). Result: 1->2->3->5." }
  ],
  "caption": "Remove Nth Node From End — Single pass with (N+1) fixed pointer gap."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Removing Head Node*: If $N$ equals the list length, deleting the head node is handled seamlessly because \`dummy\` ensures \`left\` points to \`dummy\`, setting \`dummy.next = head.next\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why do we advance the right pointer by N + 1 steps instead of N steps initially?",
          options: [
            "To account for 0-based indexing.",
            "So that when right reaches null, left stops at the node IMMEDIATELY BEFORE the victim node, allowing direct link splicing.",
            "To skip non-integer node values.",
            "Because dummy nodes take two spaces."
          ],
          correct_index: 1,
          model_answer: "To delete a node in a singly linked list, we must modify the `next` pointer of the *previous* node. Gap of N+1 positions `left` directly at that previous node.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "How does using a dummy node simplify deleting the head node of the list?",
          model_answer: "If the head node is deleted, `left` remains at `dummy`. We update `dummy.next = head.next`, avoiding special-case if-statements for head deletion.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "copy-list-with-random-pointer",
      title: "Copy List With Random Pointer",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/copy-linked-list-with-random-pointer",
      summary: "Deep-copy a list whose nodes point anywhere: a map from old to new — or clones woven between originals.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to clone the list in a single pass.
*Why this shatters*: A node's \`random\` pointer might point to a node far ahead in the list that has **not been created yet**!

**The Structural Invariant: Interleaved Splicing ($O(1)$ Auxiliary Space).**
We can perform a deep copy in 3 linear passes without a Hash Map:
1. **Pass 1 (Interleave Clones)**: For each original node $X$, create clone $X'$ and insert it directly after $X$: $X \\rightarrow X' \\rightarrow Y \\rightarrow Y'$.
2. **Pass 2 (Wire Random Pointers)**: For each original node $X$, its clone's random pointer is:
   $$X'.\\text{random} = X.\\text{random}.\\text{next}$$
3. **Pass 3 (Unweave Lists)**: Separate the interleaved list back into original list and cloned list!

\`\`\`viz:array
{
  "frames": [
    { "cells": ["A", "B"], "note": "Original list: A -> B. A.random = B, B.random = B." },
    { "cells": ["A", "A'", "B", "B'"], "highlight": [1, 3], "note": "Pass 1: Interleave clones: A -> A' -> B -> B'." },
    { "cells": ["A", "A'", "B", "B'"], "highlight": [1], "note": "Pass 2: Wire random: A'.random = A.random.next = B.next = B'." },
    { "cells": ["A'", "B'"], "highlight": [0, 1], "note": "Pass 3: Unweave cloned nodes into standalone list A' -> B'." }
  ],
  "caption": "Copy List with Random Pointer — Interleaved cloning in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Null Random Pointers*: If \`X.random == null\`, set \`X'.random = null\`.
- *Hash Map Alternative*: Store \`Map<OriginalNode, ClonedNode>\` in Pass 1, wire \`next\` and \`random\` in Pass 2 ($O(N)$ space).`,
      questions: [
        {
          kind: "mcq",
          prompt: "In the O(1) space interleaved approach for Copy List with Random Pointer, why does X'.random = X.random.next correctly locate the cloned node?",
          options: [
            "Because random pointers are always sorted.",
            "Because Pass 1 inserted every cloned node X' directly after its original node X, so X.random.next IS the clone of X.random.",
            "Because arrays store references sequentially.",
            "Because next pointers are reversed."
          ],
          correct_index: 1,
          model_answer: "Interleaving places clone X' immediately after X. Thus, X.random's clone is stored at X.random.next.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "Why must Pass 3 unweave the original list back to its exact initial state?",
          model_answer: "The problem requires deep-copying without mutating or corrupting the original input linked list structure.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "add-two-numbers",
      title: "Add Two Numbers",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/add-two-numbers",
      summary: "Grade-school addition down two chains: sum digits, emit node, carry the overflow forward.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to convert the linked lists into integers (e.g., \`2->4->3\` $\\rightarrow$ \`342\`), add them (\`342 + 465 = 807\`), and convert the result back to a list.
*Why this shatters*: Linked lists can contain **thousands of digits**, far exceeding 64-bit integer limits (\`BigInt\` overflow!).

**The Structural Invariant: Digit-by-Digit Carry Column Addition.**
Because digits are stored in **reverse order** (least significant digit first), we can simulate grade-school column addition directly while traversing the lists!
- Maintain scalar \`carry = 0\`.
- Loop while \`l1 != null || l2 != null || carry > 0\`:
  - \`v1 = l1 ? l1.val : 0\`
  - \`v2 = l2 ? l2.val : 0\`
  - \`sum = v1 + v2 + carry\`
  - \`carry = Math.floor(sum / 10)\`
  - Attach new node \`new ListNode(sum % 10)\` to \`tail.next\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": [2, 4, 3], "pointers": [{ "label": "l1 (2)", "index": 0 }, { "label": "l2 (5)", "index": 0 }], "note": "l1=2, l2=5, carry=0. sum = 2+5+0 = 7. Emit 7, carry=0." },
    { "cells": [7, 0], "pointers": [{ "label": "l1 (4)", "index": 1 }, { "label": "l2 (6)", "index": 1 }], "highlight": [1], "note": "l1=4, l2=6, carry=0. sum = 4+6+0 = 10. Emit 0, carry=1." },
    { "cells": [7, 0, 8], "pointers": [{ "label": "l1 (3)", "index": 2 }, { "label": "l2 (4)", "index": 2 }], "highlight": [2], "note": "l1=3, l2=4, carry=1. sum = 3+4+1 = 8. Emit 8, carry=0. Result: 7 -> 0 -> 8." }
  ],
  "caption": "Add Two Numbers — Column addition handling arbitrary-length numbers in O(N) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Trailing Carry*: If \`l1\` and \`l2\` end but \`carry == 1\` (e.g. \`99 + 1 = 100\`), the \`carry > 0\` condition in the loop ensures the final \`1\` node is appended!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must the loop condition for Add Two Numbers include `carry > 0` alongside `l1 != null || l2 != null`?",
          options: [
            "To prevent negative numbers.",
            "Because an addition like 99 + 1 produces a final carry that requires creating an extra node after both lists are exhausted.",
            "To reset the dummy node.",
            "Because linked lists are 1-indexed."
          ],
          correct_index: 1,
          model_answer: "When two N-digit numbers sum to an (N+1)-digit number (e.g., 99 + 1 = 100), the leftover carry creates the most significant digit node.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "How does storing numbers in reverse order (least significant digit first) simplify linked list addition?",
          model_answer: "Addition naturally starts at the least significant digit (ones place) and carries over to higher places. Reversal allows us to process digits head-to-tail without needing to reverse the list first.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "find-the-duplicate-number",
      title: "Find The Duplicate Number",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/find-duplicate-integer",
      summary: "An array where values are pointers in disguise — the duplicate is a cycle entrance, and Floyd finds it.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners sort the array ($O(N \\log N)$ time) or use a Hash Set ($O(N)$ space).
*Why this shatters*: The problem strictly forbids modifying the array and requires **$O(1)$ extra space** and **$O(N)$ time**!

**The Structural Invariant: Mapping Array to a Cyclic Linked List.**
- Since numbers are in range $[1, n]$ for array of size $n + 1$, every value \`nums[i]\` is a **valid index pointer** to \`nums[nums[i]]\`!
- **The Core Aha!**: Multiple indices containing the SAME value means **multiple pointers entering the SAME node**. This creates a **cycle**, and the **duplicate number IS the entrance to the cycle**!
- **Floyd's Cycle Algorithm**:
  - **Phase 1 (Collision)**: \`slow = nums[slow]\`, \`fast = nums[nums[fast]]\` until \`slow == fast\`.
  - **Phase 2 (Find Entrance)**: Reset \`slow2 = 0\`. Move \`slow\` and \`slow2\` at 1 step per tick. The index where they meet IS the duplicate number!

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 3, 4, 2, 2], "pointers": [{ "label": "slow", "index": 0 }, { "label": "fast", "index": 0 }], "note": "nums=[1,3,4,2,2]. Read index i -> nums[i] as pointer. Phase 1: Run slow & fast." },
    { "cells": [1, 3, 4, 2, 2], "pointers": [{ "label": "slow", "index": 4 }, { "label": "fast", "index": 4 }], "highlight": [4], "note": "Phase 1 Collision at val=2 (idx 4). Phase 2: Set slow2=0. Advance slow & slow2." },
    { "cells": [1, 3, 4, 2, 2], "pointers": [{ "label": "slow", "index": 2 }, { "label": "slow2", "index": 2 }], "highlight": [2, 4], "note": "Phase 2 Meeting at val=2! Duplicate number = 2 found in O(N) time & O(1) space." }
  ],
  "caption": "Find the Duplicate Number — Array treated as Linked List cycle entrance problem."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Zero Index Start*: Always start Phase 1 from index 0 (\`slow = nums[0]\`, \`fast = nums[nums[0]]\`).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can the array in Find the Duplicate Number be treated as a Linked List with a cycle?",
          options: [
            "Because the array elements are sorted.",
            "Because array elements are in range [1, n] matching valid array indices, and duplicate values represent multiple pointers pointing to the same index (cycle entrance).",
            "Because Floyd's algorithm only works on arrays.",
            "Because index 0 is always negative."
          ],
          correct_index: 1,
          model_answer: "Values in [1, n] act as next-pointers. A duplicate value means two different indices point to the same destination index, creating a loop.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "In Phase 2 of Floyd's Algorithm, why does resetting one pointer to 0 and advancing both pointers at speed 1 guarantee meeting at the cycle entrance?",
          model_answer: "Mathematically, the distance from head to cycle entrance equals the distance from collision point to cycle entrance modulo cycle length. Moving both at 1x speed causes them to meet at the entrance.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "lru-cache",
      title: "LRU Cache",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/lru-cache",
      summary: "Hash map for finding, doubly linked list for ordering — O(1) get and put, and eviction for free.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use a Hash Map + Timestamp array. On \`put\`, they scan the array for the oldest timestamp to evict ($O(N)$ time).
*Why this shatters*: The problem requires **$O(1)$ time complexity for BOTH \`get\` and \`put\`**!

**The Structural Invariant: Hash Map + Doubly Linked List Composition.**
- **Doubly Linked List (DLL)**: Stores cache items ordered by recency.
  - Head \`left\` = Least Recently Used (LRU) candidate.
  - Tail \`right\` = Most Recently Used (MRU).
  - *Why Doubly Linked?* Unlinking an arbitrary node takes $O(1)$ because every node knows its \`prev\` and \`next\`!
- **Hash Map**: Stores \`key -> NodePointer\` for $O(1)$ instant node lookup.
- **Operations**:
  - \`get(key)\`: Look up node in map ($O(1)$). Remove node from current DLL position ($O(1)$), re-insert at MRU tail ($O(1)$).
  - \`put(key, val)\`: If key exists, update value & move to MRU tail. If new key and capacity full, remove LRU head node from DLL ($O(1)$) and delete key from Hash Map ($O(1)$).

\`\`\`viz:array
{
  "frames": [
    { "cells": ["left (dummy)", "key:1, val:1", "right (dummy)"], "note": "put(1,1): DLL: [LRU dummy <-> (1,1) <-> MRU dummy]. Map: {1: Node(1,1)}." },
    { "cells": ["left", "(1,1)", "(2,2)", "right"], "note": "put(2,2): Insert at MRU tail. DLL: [ (1,1) <-> (2,2) ]." },
    { "cells": ["left", "(2,2)", "(1,1)", "right"], "highlight": [2], "note": "get(1): Access key 1! Unlink (1,1) and move to MRU tail. DLL: [ (2,2) <-> (1,1) ]." },
    { "cells": ["left", "(1,1)", "(3,3)", "right"], "highlight": [2], "note": "put(3,3) at capacity 2: Evict LRU (2,2)! Remove from DLL & Map. Insert (3,3) at MRU tail." }
  ],
  "caption": "LRU Cache — Hash Map + Doubly Linked List achieving O(1) get & put operations."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Dummy Sentinel Head/Tail*: Using sentinel \`left\` and \`right\` dummy nodes eliminates all null pointer checks during node insertions and deletions!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must a Doubly Linked List be used instead of a Singly Linked List for LRU Cache?",
          options: [
            "Because doubly linked lists use less memory.",
            "Because unlinking an arbitrary node in O(1) requires access to node.prev, which is only available in doubly linked lists.",
            "Because singly linked lists cannot store key-value pairs.",
            "Because hash maps only accept double pointers."
          ],
          correct_index: 1,
          model_answer: "To move a node to the MRU position in O(1) time, we must remove it from its current position. Removing a node requires updating `node.prev.next`, which requires a double link.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What critical step is often forgotten when evicting the LRU node from the Doubly Linked List?",
          model_answer: "Deleting the corresponding key from the Hash Map! Forgetting to delete `map.delete(lruNode.key)` causes stale memory references and incorrect capacity checks.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "merge-k-sorted-lists",
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/merge-k-sorted-linked-lists",
      summary: "Pairwise tournament merging turns k lists into one in O(n log k) — divide and conquer over streams.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners merge lists one-by-one sequentially: merge list 1 and 2, then merge result with 3, then with 4...
*Why this shatters*: Merging $K$ lists sequentially results in $O(N \\cdot K)$ total time complexity (where $N$ is total number of nodes across all lists). For 10,000 lists, this is quadratic TLE!

**The Structural Invariant: Pairwise Divide & Conquer Tournament.**
Instead of sequential merging, merge lists **in pairs** hierarchically (like a tournament bracket):
- Round 1: Merge $K$ lists pairwise into $K / 2$ lists.
- Round 2: Merge $K / 2$ lists pairwise into $K / 4$ lists.
- ... Continue until 1 merged list remains.
- **Complexity**: Each round processes all $N$ nodes in $O(N)$ time. The number of rounds is $\\log_2 K$. Total time = **$O(N \\log K)$**!

\`\`\`viz:flow
{
  "nodes": [
    { "id": "l1", "label": "List 1 [1,4,5]", "row": 0, "col": 0 },
    { "id": "l2", "label": "List 2 [1,3,4]", "row": 1, "col": 0 },
    { "id": "l3", "label": "List 3 [2,6]", "row": 2, "col": 0 },
    { "id": "m12", "label": "Merged [1,1,3,4,4,5]", "row": 0.5, "col": 1 },
    { "id": "final", "label": "Final Merged [1,1,2,3,4,4,5,6]", "row": 1, "col": 2 }
  ],
  "edges": [
    { "from": "l1", "to": "m12" },
    { "from": "l2", "to": "m12" },
    { "from": "m12", "to": "final" },
    { "from": "l3", "to": "final" }
  ],
  "caption": "Merge K Sorted Lists — Pairwise Divide & Conquer in O(N log K) time."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Min-Heap Alternative*: Insert the head node of each of the $K$ lists into a Min-Heap of size $K$. Pop minimum node, attach to output, push \`popped.next\` into heap. Time: $O(N \\log K)$, Space: $O(K)$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the time complexity of merging K sorted lists with total N nodes using Divide & Conquer pairwise merging?",
          options: [
            "O(N * K)",
            "O(N log K)",
            "O(N^2)",
            "O(K log N)"
          ],
          correct_index: 1,
          model_answer: "Pairwise merging reduces the list count by half each round (log K rounds). Each round processes all N nodes in linear time, yielding O(N log K).",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "When is the Min-Heap approach preferable over Divide & Conquer for merging K sorted lists?",
          model_answer: "When streaming data where lists arrive dynamically over time, or when K sorted streams are read from disk/network, allowing continuous O(1) memory streaming.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "reverse-nodes-in-k-group",
      title: "Reverse Nodes in K-Group",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/reverse-nodes-in-k-group",
      summary: "Reverse the list k nodes at a time, re-splicing each reversed block seamlessly — the pointer final exam.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners reverse the entire list and try to fix sub-group links afterwards.
*Why this shatters*: Reversing in groups of $K$ requires modifying pointer connections **block by block**, leaving any leftover sub-group smaller than $K$ untouched.

**The Structural Invariant: Four-Step Block Reversal.**
Use a \`dummy\` node. For each block of $K$ nodes:
1. **Scout Phase**: Check if there are at least $K$ nodes remaining. If fewer than $K$ nodes remain, **STOP** (leave remaining nodes unchanged).
2. **Identify Boundaries**: Let \`groupPrev\` be the node before the group, \`kth\` be the $K$-th node, and \`groupNext = kth.next\`.
3. **Reverse Group**: Reverse the $K$ nodes between \`groupPrev.next\` and \`groupNext\` using Three-Pointer Shuffle.
4. **Reconnect Splice**:
   - Save \`tmp = groupPrev.next\` (which is now the tail of reversed group).
   - Set \`groupPrev.next = kth\` (point previous group tail to new group head).
   - Set \`groupPrev = tmp\` (advance pointer for next group).

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "groupPrev", "index": 0 }, { "label": "kth=2", "index": 1 }], "note": "K=2. Group 1: nodes [1, 2]. Scout confirms >= 2 nodes exist. Reverse [1,2] -> [2,1]." },
    { "cells": [2, 1, 3, 4, 5], "highlight": [0, 1], "note": "Reconnect: dummy -> 2 -> 1 -> 3. Advance groupPrev to node 1." },
    { "cells": [2, 1, 4, 3, 5], "highlight": [2, 3], "note": "Group 2: nodes [3, 4]. Scout confirms >= 2 nodes. Reverse -> [4,3]. Reconnect 1 -> 4 -> 3 -> 5." },
    { "cells": [2, 1, 4, 3, 5], "highlight": [4], "note": "Group 3: node [5]. Scout finds < 2 nodes -> Leave 5 unchanged! Final: 2->1->4->3->5." }
  ],
  "caption": "Reverse Nodes in K-Group — Grouped reversal with tail preservation in O(N) time & O(1) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Leftover Nodes*: The problem specifically states that if the number of nodes is not a multiple of $K$, remaining nodes at the end should remain in their original order.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What occurs if fewer than K nodes remain at the end of the list in Reverse Nodes in K-Group?",
          options: [
            "The remaining nodes are reversed anyway.",
            "The remaining nodes are deleted.",
            "The algorithm stops and leaves the remaining nodes in their original order.",
            "The list is padded with zero nodes."
          ],
          correct_index: 2,
          model_answer: "The problem rule specifies that any trailing group with length < K must remain unreversed in its original order.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the role of the scout phase before reversing each K-group?",
          model_answer: "The scout phase advances K steps forward to verify if K nodes exist. If null is encountered before counting K nodes, we break early without reversing.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
