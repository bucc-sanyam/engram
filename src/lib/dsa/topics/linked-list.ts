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

For interviews, linked lists are really a test of **pointer discipline** — can you rewire next-references without dropping the rest of the chain on the floor? Two techniques carry the entire chapter. The first is the three-pointer shuffle from Reverse Linked List: hold *previous*, *current*, and a saved *next* while you turn an arrow around, because the moment you overwrite a next-pointer, whatever it pointed to is gone unless someone is holding it. The second is the **fast and slow pointer** family — two runners on the same track at different speeds. A runner going twice as fast finds the middle when it hits the end (Reorder List), meets the slow runner if and only if the track loops (Linked List Cycle, via Floyd's algorithm), and — offset by n instead of speed — finds the nth-from-end (Remove Nth Node). This is Two Pointers, chapter two of this atlas, reborn without indexes.

The sequence builds from single moves to full surgery: reverse, merge, detect a cycle, then combinations — Reorder List is literally find-middle + reverse + interleave. Copy List with Random Pointer and Add Two Numbers stretch you sideways (interleaved cloning, digit arithmetic as list-walking). Find the Duplicate Number is the chapter's sleeper twist: an *array* problem that becomes a cycle-detection problem once you read values as pointers. LRU Cache is the payoff — hash map plus doubly linked list composing into the most-implemented data structure in industry. Merge K Sorted Lists and Reverse Nodes in K-Group close it at hard difficulty: divide-and-conquer merging, and reversal performed in windowed bursts without ever losing the chain.

On the roadmap, Linked List (with Binary Search) unlocks Trees — a node with *two* next-pointers instead of one.`,
  problems: [
    {
      slug: "reverse-linked-list",
      title: "Reverse Linked List",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/reverse-a-linked-list",
      summary: "The three-pointer shuffle: save next, flip the arrow, shift the trio — the chapter's atomic move.",
      body: `**Signal.** "Reverse a singly linked list" — no lookup, no target, purely a structural inversion of next-pointers — is the tell for the three-pointer shuffle, the chapter's atomic move.

**Brute force.** Copy every value into an array, reverse the array, then walk the list again overwriting each node's value in order — O(n) time, O(n) space, and it cheats: it never actually rewires a single pointer, so it fails the moment the problem asks you to reverse the *structure*, not just what's printed.

**Optimal approach.** You cannot just walk along flipping arrows — the moment you point node 1's next at null, node 2 and the entire rest of the list is unreachable unless someone was already holding it. Walk with three pointers. *prev* starts as null (the new tail's destination), *curr* at the head. Each step is a fixed four-beat bar: save curr.next into a temp (protect the rest of the list); point curr.next at prev (the flip); slide prev up to curr; slide curr up to the saved temp. When curr runs off the end, prev is standing on the old tail — the new head.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3], "pointers": [{ "label": "curr", "index": 0 }], "note": "prev = null, curr = head (1). Nothing reversed yet." },
    { "cells": [1, 2, 3], "pointers": [{ "label": "prev", "index": 0 }, { "label": "curr", "index": 1 }], "highlight": [0], "note": "Beat one: save curr.next (2), flip 1's arrow to null, prev advances to 1, curr advances to 2." },
    { "cells": [1, 2, 3], "pointers": [{ "label": "prev", "index": 1 }, { "label": "curr", "index": 2 }], "highlight": [0, 1], "note": "Beat two: save curr.next (3), flip 2's arrow back to 1, prev advances to 2, curr advances to 3." },
    { "cells": [1, 2, 3], "pointers": [{ "label": "prev", "index": 2 }], "highlight": [0, 1, 2], "note": "Beat three: flip 3's arrow back to 2, prev advances to 3, curr runs off the end. Return prev — the list is now 3→2→1→null." }
  ],
  "caption": "Reverse Linked List — the three-pointer shuffle, one flipped arrow per beat."
}
\`\`\`

**The recursive version.** Reverse the rest of the list first, then attach yourself behind it: head.next.next = head; head.next = null. Elegant, O(n) stack space, and a beautiful warm-up for Trees, where recursion stops being optional. Know both; lead with the iterative one.

**Complexity.** O(n) time, O(1) space iteratively — versus the value-copy brute force's O(n) space, which doesn't even solve the real problem.

**Thread.** That four-beat bar is this chapter's atomic move — you will replay it inside Reorder List and Reverse Nodes in K-Group. First, though, a gentler skill: weaving two lists together while breaking neither.`,
    },
    {
      slug: "merge-two-sorted-lists",
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/merge-two-sorted-linked-lists",
      summary: "Two sorted chains, one dummy head, and a tail that always grabs the smaller front.",
      body: `**Signal.** "Merge two sorted linked lists into one sorted list, reusing the existing nodes" — two already-sorted sequences combining into one is the merge step of merge sort, and "reusing nodes" rules out just collecting values into an array.

**Brute force.** Collect every value from both lists into an array, sort the array, then build a brand-new list from it — O((m+n) log(m+n)) time, and it throws away the fact that both inputs were already sorted, plus it doesn't reuse the original nodes as the problem asks.

**Optimal approach.** Both lists present their heads; the smaller one is, by sortedness, the smallest element anywhere — it must come next in the output. Detach it, append it to the result's tail, and advance that list. Repeat until one list empties; then the survivor — already sorted, already chained — is appended *whole* in O(1). The dummy-head trick removes the "is this the first node?" special case: start with a throwaway dummy node, keep a tail pointer at it, and append normally forever — dummy.next is the real head when you finish.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1], "note": "Heads: list1=1, list2=1. Tie — take list1's 1. Result so far: [1]." },
    { "cells": [1, 1], "note": "Heads: list1=2, list2=1. Take list2's 1. Result: [1, 1]." },
    { "cells": [1, 1, 2], "note": "Heads: list1=2, list2=3. Take list1's 2. Result: [1, 1, 2]." },
    { "cells": [1, 1, 2, 3], "note": "Heads: list1=4, list2=3. Take list2's 3. Result: [1, 1, 2, 3]." },
    { "cells": [1, 1, 2, 3, 4, 4], "highlight": [4, 5], "note": "list2 empties — splice the rest of list1 (just node 4) on whole, in O(1). Result: [1, 1, 2, 3, 4, 4]." }
  ],
  "caption": "Merge Two Sorted Lists — the smaller front always wins the next slot; the survivor is appended whole when the other list runs out."
}
\`\`\`

**Complexity.** O(m + n) time, O(1) extra space — the merge is a re-threading, not a copy — versus the O((m+n) log(m+n)) sort-everything brute force.

**Thread.** You can reverse; you can weave. Next question: what if the chain is dishonest — what if, somewhere down the line, it loops back on itself? Detecting that without any memory is one of the prettiest algorithms ever found.`,
    },
    {
      slug: "linked-list-cycle",
      title: "Linked List Cycle",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/linked-list-cycle-detection",
      summary: "Floyd's tortoise and hare: on a looped track, a runner at 2x must lap a runner at 1x.",
      body: `**Signal.** "Does this list loop back on itself — answer in O(1) space" — the O(1) space bar rules out remembering visited nodes, which is the tell for two runners at different speeds instead of a memory of the past.

**Brute force.** A hash set of visited nodes: walk, and if you ever revisit a node, cycle. O(n) time, O(n) space — completely correct, say it in one breath, but it's exactly the memory the follow-up asks you to give up.

**Optimal approach.** Two runners on the same track: a tortoise moving one node per tick, a hare moving two. If the track ends, the hare falls off — no cycle, done. If the track loops, both runners eventually get swept into the loop and circle forever — and inside the loop, the hare gains on the tortoise by exactly one node per tick. A gap that shrinks by one each tick must reach zero: they *collide*. Not "probably meet" — provably, within one lap of the tortoise entering. The collision is the proof of the cycle; no memory of the past required, because the runners' relative motion encodes it.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "slow", "index": 0 }, { "label": "fast", "index": 0 }], "note": "Start: both runners at node 1. Remember: node 5's next points back to node 3, not to null." },
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "slow", "index": 1 }, { "label": "fast", "index": 2 }], "note": "Tick 1: slow steps once to 2; fast steps twice to 3." },
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "slow", "index": 2 }, { "label": "fast", "index": 4 }], "note": "Tick 2: slow steps once to 3; fast steps twice to 5." },
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "slow", "index": 3 }, { "label": "fast", "index": 3 }], "highlight": [3], "note": "Tick 3: slow steps to 4. Fast's two steps go 5 -> 3 (via the loop) -> 4. Both land on 4 — collision confirms the cycle." }
  ],
  "caption": "Linked List Cycle — Floyd's tortoise and hare converge inside the loop after node 5 wraps back to node 3."
}
\`\`\`

**The famous part two.** After colliding, reset one runner to the head and advance both at speed one: they meet again exactly at the *cycle's entrance*. That is Floyd's full algorithm, and the arithmetic behind it (distances before and inside the loop cancelling) is worth working through once on paper — the next time you will need it is two problems from now, wearing an array costume in Find the Duplicate Number.

**Complexity.** O(n) time, O(1) space — versus the hash-set approach's O(n) space.

**Thread.** Fast and slow runners can do more than detect loops — run the hare to the end and the tortoise is standing on the *middle*. Reorder List, next, uses exactly that, then folds the list in half like a hand of cards.`,
    },
    {
      slug: "reorder-list",
      title: "Reorder List",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/reorder-linked-list",
      summary: "Find the middle, reverse the back half, interleave — three known moves composed into surgery.",
      body: `**Signal.** "Rearrange into first, last, second, second-to-last…" — a fold-in-half-and-riffle pattern is the tell that this is a *composition* problem: find-the-middle plus reverse plus merge, three moves you already own, chained together.

**Brute force.** Walk the list once to copy every node into an array, then use two pointers from both ends of the array to rebuild the list in the new order — O(n) time, but O(n) space for the array, which the O(1)-space version below avoids entirely.

**Optimal approach.** Step one: find the middle — tortoise and hare, hare at double speed; when the hare hits the end, the tortoise stands at the midpoint. Step two: split there and **reverse the back half** — the three-pointer shuffle from the chapter's opening, verbatim. Step three: **interleave** — alternately splice one node from each list, a cousin of the merge two problems ago, except the rule is "take turns" instead of "take smaller." Each splice overwrites two next-pointers, so each iteration must save both onward nodes before rewiring — the protect-before-flip reflex again, and don't forget to null-terminate the final node.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "slow", "index": 2 }], "highlight": [2], "note": "Fast/slow find the middle: fast hits the end, slow lands on 3 (index 2)." },
    { "cells": [1, 2, 3, 4, 5], "highlight": [3, 4], "note": "Split after the middle: front 1→2→3, back 4→5. Reverse the back half with the three-pointer shuffle: 5→4." },
    { "cells": [1, 5, 2, 4, 3], "highlight": [0, 1, 2, 3, 4], "note": "Interleave front and reversed back, alternating one node from each: 1, 5, 2, 4, 3." }
  ],
  "caption": "Reorder List — find middle, reverse the back half, then splice the two halves together in alternating order."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — versus the array-based cheat's O(n) space.

**Why interviewers love it.** It is a *composition test*: no new idea anywhere, only fluency under pointer pressure. People who learned patterns as isolated tricks stall here; people who learned them as reusable moves finish in minutes.

**Thread.** The runners so far differed in *speed*. Next problem they differ in *head start* — and n-apart runners find the nth node from the end in a single pass.`,
    },
    {
      slug: "remove-nth-node-from-end-of-list",
      title: "Remove Nth Node From End of List",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/remove-node-from-end-of-linked-list",
      summary: "Two pointers locked n apart: when the leader falls off the end, the trailer stands before the victim.",
      body: `**Signal.** "Delete the nth node from the *end*, in one pass" — distance-from-the-end is exactly what a singly linked list cannot see directly, and "one pass" rules out the honest two-pass fix, pointing at a fixed-offset pointer pair instead.

**Brute force.** Two passes: walk once to measure the list's length, then walk again to position length − n and splice. Correct, simple, and explicitly what the "one pass" requirement is steering you away from.

**Optimal approach.** You cannot measure from the end, but you can *carry the measurement with you*. Send a lead pointer ahead exactly n + 1 nodes from a dummy placed before the head. Then advance lead and trail together, in lockstep, gap fixed. When lead steps off the end of the list, trail is standing exactly one node *before* the victim, because the fixed gap converts "position relative to an end you haven't seen" into "position relative to a partner you can see." The deletion is one splice: trail.next = trail.next.next. The dummy-head idiom handles the case where the victim is the head itself — n equal to the list's length — with zero special-casing.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "lead", "index": 2 }], "note": "Lead advances n+1=3 nodes from the dummy (before node 1). Lead is now at node 3 (index 2); trail is still back at the dummy." },
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "lead", "index": 4 }, { "label": "trail", "index": 1 }], "note": "March together: when lead reaches node 5 (index 4, the last node), trail has moved up to node 2 (index 1)." },
    { "cells": [1, 2, 3, 4, 5], "pointers": [{ "label": "trail", "index": 2 }], "highlight": [2, 3], "note": "Lead steps off the end (null). Trail now sits at node 3 (index 2) — exactly one before the victim, node 4 (index 3)." },
    { "cells": [1, 2, 3, 5], "highlight": [2], "note": "Splice: trail.next = trail.next.next, skipping node 4. Result: 1→2→3→5." }
  ],
  "caption": "Remove Nth Node From End — a fixed n+1 gap between lead and trail means trail lands one before the victim exactly when lead falls off the end."
}
\`\`\`

**Complexity.** O(n) time, one traversal, O(1) space — versus the two-pass approach's two traversals of the same data.

**Thread.** Every problem so far rewired a single chain. Copy List with Random Pointer, next, asks you to *clone* one — including pointers that jump anywhere — and the slick solution interleaves the copy into the original.`,
    },
    {
      slug: "copy-list-with-random-pointer",
      title: "Copy List With Random Pointer",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/copy-linked-list-with-random-pointer",
      summary: "Deep-copy a list whose nodes point anywhere: a map from old to new — or clones woven between originals.",
      body: `**Signal.** "Each node has a next pointer *and* a random pointer aiming at any node" — a pointer that can aim "ahead" of wherever a single sweep currently is means one pass can't resolve every wire; you need either a lookup table or a place to stash the correspondence.

**Brute force (why a single pass fails).** Walking and cloning as you go handles next fine, but when you meet a random pointer aimed at a node you haven't cloned yet, there is nothing to point at. Any order you pick, some pointer aims "ahead" — the dependency graph is arbitrary.

**Optimal approach (two passes and a map).** Separate *creating* nodes from *wiring* them. Pass one: clone every node, wiring nothing, but record old → new in a hash map — the same "remember what you have seen" reflex as chapter one, now storing correspondences rather than presence. Pass two: for each original node, set copy.next = map[original.next] and copy.random = map[original.random]. Every lookup succeeds because *all* nodes exist before *any* wiring happens. O(n) time, O(n) space for the map. **The follow-up (O(1) extra space):** store the correspondence *in the list's own geometry* instead of a map. Pass one: after each original node, splice in its clone: A→A'→B→B'→… Now "the clone of X" is simply X.next. Pass two: for each original, copy.random = original.random.next — one hop finds the partner. Pass three: unzip the two lists, restoring the original perfectly.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["A", "B"], "note": "Original list: A → B. A.random = B, B.random = B." },
    { "cells": ["A", "A'", "B", "B'"], "highlight": [1, 3], "note": "Pass 1: splice a clone directly after each original: A → A' → B → B'." },
    { "cells": ["A", "A'", "B", "B'"], "highlight": [1], "note": "Pass 2: copy.random = original.random.next. A'.random = A.random.next = B.next = B' — one hop finds the clone." },
    { "cells": ["A", "B"], "note": "Pass 3: unzip — restore the original A → B, leaving the cloned A' → B' as a fully wired, separate list." }
  ],
  "caption": "Copy List With Random Pointer — interleaving the clone into the original turns \\"find my clone\\" into a single .next hop."
}
\`\`\`

**Complexity.** O(n) time either way; O(n) vs O(1) auxiliary space.

**Thread.** You have now cloned structure. Next, Add Two Numbers has you *computing* with lists — grade-school addition where each node is a digit and the carry rides along the walk.`,
    },
    {
      slug: "add-two-numbers",
      title: "Add Two Numbers",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/add-two-numbers",
      summary: "Grade-school addition down two chains: sum digits, emit node, carry the overflow forward.",
      body: `**Signal.** "Two numbers stored as linked lists, one digit per node, least significant first — return their sum" — least-significant-first storage is the tell that grade-school column addition applies directly, walking both lists in lockstep with a carry.

**Brute force.** Convert each list to an actual integer (or string), add them with native arithmetic, then build a new list from the digits of the result — works for small numbers, but breaks down for arbitrarily large ones that don't fit a machine integer, which is the entire reason this problem stores numbers as lists in the first place.

**Optimal approach.** Walk both lists in lockstep with a *carry* riding along. Each step: sum = digitA + digitB + carry; emit a node holding sum mod 10; carry becomes sum ÷ 10 (always 0 or 1 — two digits plus a carry max out at 19). The subtleties are all endings: the lists may have different lengths (treat a missing node as digit 0 and keep walking), and after both lists end, a surviving carry mints one final node — forgetting it is *the* classic bug, the 999 + 1 case where the answer grows a digit.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["_", "_", "_"], "pointers": [{ "label": "col", "index": 0 }], "note": "List A: 2→4→3 (342). List B: 5→6→4 (465). Column 0 (ones): 2 + 5 + carry 0 = 7." },
    { "cells": [7, "_", "_"], "pointers": [{ "label": "col", "index": 1 }], "highlight": [0], "note": "Emit 7, carry 0. Column 1 (tens): 4 + 6 + carry 0 = 10." },
    { "cells": [7, 0, "_"], "pointers": [{ "label": "col", "index": 2 }], "highlight": [1], "note": "Emit 0, carry 1. Column 2 (hundreds): 3 + 4 + carry 1 = 8." },
    { "cells": [7, 0, 8], "pointers": [{ "label": "col", "index": 2 }], "highlight": [2], "note": "Emit 8, carry 0. Both lists exhausted and carry is 0 — done: 7→0→8 = 807." }
  ],
  "caption": "Add Two Numbers — 342 + 465 = 807, one digit column at a time, carry riding along."
}
\`\`\`

**The idioms.** Dummy head for clean construction (third appearance in this chapter), and a loop condition of "while either list has nodes *or* carry is nonzero" — that single or-clause encodes both edge cases without special-case code.

**Complexity.** O(max(m, n)) time, output-sized space — versus the native-arithmetic brute force, which is only correct up to machine-integer size.

**Thread.** Next comes the chapter's practical joke: a problem with no linked list in sight — an array of numbers — that collapses the moment you *read the values as pointers* and set the tortoise and hare loose on it.`,
    },
    {
      slug: "find-the-duplicate-number",
      title: "Find The Duplicate Number",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/find-duplicate-integer",
      summary: "An array where values are pointers in disguise — the duplicate is a cycle entrance, and Floyd finds it.",
      body: `**Signal.** "n+1 integers, each in 1..n, find the repeat — without modifying the array, in O(1) space" — those two constraints assassinate sorting (mutation) and a hash set (space), which is the tell that the array secretly encodes a linked structure Floyd's algorithm can exploit.

**Brute force.** Sort the array and scan for adjacent equal values (O(n log n), but mutates), or use a hash set to spot the first repeat (O(n) time, O(n) space) — both explicitly forbidden by the constraints, but worth naming before the real trick.

**Optimal approach.** Read each value as an *instruction*: standing at index i, go to index nums[i]. Every cell points somewhere in-range, so from index 0 this walk goes on forever through a finite space — it must eventually revisit somewhere and loop. **A repeated value is exactly a shared incoming pointer:** if the duplicate is d, at least two different indexes point at index d — two arrows converging on one node. A walk that has a tail funnelling into a converging node is precisely a rho shape: a linked list with a cycle, and *the cycle's entrance is the duplicate value*. The array was a linked list all along. Run Floyd exactly as in Linked List Cycle: phase one, tortoise and hare from index 0 until they collide; phase two, reset one runner to the start, advance both at speed one — their meeting point is d.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 3, 4, 2, 2], "pointers": [{ "label": "slow", "index": 0 }, { "label": "fast", "index": 0 }], "note": "nums = [1,3,4,2,2]. Both runners start at index 0. \\"Go to index nums[i]\\" defines the walk." },
    { "cells": [1, 3, 4, 2, 2], "pointers": [{ "label": "slow", "index": 1 }, { "label": "fast", "index": 3 }], "note": "Tick: slow takes one step (0→1). Fast takes two steps (0→1→3)." },
    { "cells": [1, 3, 4, 2, 2], "pointers": [{ "label": "slow", "index": 3 }, { "label": "fast", "index": 4 }], "note": "Tick: slow steps (1→3). Fast double-steps (3→2→4)." },
    { "cells": [1, 3, 4, 2, 2], "pointers": [{ "label": "slow", "index": 2 }, { "label": "fast", "index": 4 }], "note": "Tick: slow steps (3→2). Fast double-steps (4→2→4), landing back on 4." },
    { "cells": [1, 3, 4, 2, 2], "pointers": [{ "label": "slow", "index": 4 }, { "label": "fast", "index": 4 }], "highlight": [4], "note": "Tick: slow steps (2→4). Fast double-steps (4→2→4)=4. Collision at index 4 — cycle confirmed. Phase two (reset-and-walk) then finds the entrance: duplicate = 2." }
  ],
  "caption": "Find the Duplicate Number — indexes 3 and 4 both point at value 2, so the array's pointer-walk has a cycle whose entrance is the duplicate."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — versus O(n log n) sort-based or O(n) space hash-set approaches, both of which violate the stated constraints. (Binary search on *value ranges* — count how many elements are ≤ mid — also solves it in O(n log n): a lovely echo of the Koko trick, worth one sentence in an interview.)

**Thread.** That is the chapter's mind-bender. Now the crown jewel of practical design: LRU Cache, where a hash map and a doubly linked list snap together into the structure half the industry runs on.`,
    },
    {
      slug: "lru-cache",
      title: "LRU Cache",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/lru-cache",
      summary: "Hash map for finding, doubly linked list for ordering — O(1) get and put, and eviction for free.",
      body: `**Signal.** "get and put both in O(1), evict the least recently used when full" — needing fast lookup *and* fast reordering-by-recency at the same time is the tell that no single structure suffices; you compose a hash map with a doubly linked list.

**Brute force.** An array or plain list of (key, value, lastUsed) entries: get is a linear scan, and eviction requires scanning for the minimum lastUsed — O(n) per operation, which fails the O(1) requirement outright.

**Optimal approach.** A **doubly linked list** holds the entries in recency order — most recent at the head, stalest at the tail. Doubly, because the core move is *unlink this node from wherever it is* (then re-insert at head), and unlinking in O(1) requires knowing your predecessor without walking: node.prev.next = node.next; node.next.prev = node.prev. The **hash map** points keys straight at their list nodes — teleporting you to the node so the list never needs searching. get: map lookup → miss returns −1; hit unlinks the node, re-inserts at head, returns the value. put: existing key updates and moves to head; new key inserts at head, and if capacity is exceeded, the tail node is unlinked and its key deleted from the map — cleaning the *map* on eviction is the bug everyone ships. Two sentinel nodes (permanent head and tail) erase every null-check on the list edges.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1], "note": "put(1,1): insert at head. Order (most-recent → stalest): [1]." },
    { "cells": [2, 1], "note": "put(2,2): insert at head. Order: [2, 1]." },
    { "cells": [1, 2], "highlight": [0], "note": "get(1): map finds node 1 instantly, unlinks it, moves it to head. Order: [1, 2]. Returns 1." },
    { "cells": [3, 1], "highlight": [0], "note": "put(3,3) at capacity 2: evict the tail (2), delete its map entry, insert 3 at head. Order: [3, 1]." }
  ],
  "caption": "LRU Cache — the doubly linked list tracks recency order; the hash map makes every node reachable in O(1) without a scan."
}
\`\`\`

**Complexity.** O(1) per operation, O(capacity) space — versus the O(n)-per-operation array/list brute force.

**Thread.** One list per problem so far. Merge K Sorted Lists, next, hands you a whole pile of them — and the interesting question is not *how* to merge but in what *shape*: one-by-one, tournament, or heap.`,
    },
    {
      slug: "merge-k-sorted-lists",
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/merge-k-sorted-linked-lists",
      summary: "Pairwise tournament merging turns k lists into one in O(n log k) — divide and conquer over streams.",
      body: `**Signal.** "k sorted linked lists, merge them into one" — generalizing a two-way merge to k inputs is a scaling question, and the interesting content is entirely in *how* you scale it, not in a new merging idea.

**Brute force (fold).** Merge list 1 into list 2, the result into list 3, and so on. Correct — and quietly quadratic: the growing accumulator is re-walked in almost every merge, totalling O(n·k) node visits for n total nodes.

**Optimal approach (tournament).** Merge lists in *pairs*: k lists become k/2, then k/4, halving each round. Every round touches each node at most once — O(n) per round — and there are log k rounds: **O(n log k)** total. Same two-list merge subroutine from earlier in the chapter, arranged as a balanced tree instead of a chain — identical work, different shape, a log factor saved. (A third shape, a k-way min-heap of the current front nodes, is also O(n log k), O(k) space, and the right answer when the "lists" are *streams* arriving over time rather than fully available up front — Heap, the next chapter, is entirely about this machine.)

\`\`\`viz:flow
{
  "nodes": [
    { "id": "l1", "label": "[1,4,5]", "row": 0, "col": 0 },
    { "id": "l2", "label": "[1,3,4]", "row": 1, "col": 0 },
    { "id": "l3", "label": "[2,6]", "row": 2, "col": 0 },
    { "id": "m12", "label": "[1,1,3,4,4,5]", "row": 0.5, "col": 1 },
    { "id": "final", "label": "[1,1,2,3,4,4,5,6]", "row": 1, "col": 2 }
  ],
  "edges": [
    { "from": "l1", "to": "m12" },
    { "from": "l2", "to": "m12" },
    { "from": "m12", "to": "final" },
    { "from": "l3", "to": "final" }
  ],
  "caption": "Merge K Sorted Lists — pairwise tournament merging: 3 lists collapse in 2 rounds (log₂ 3 rounded up), each round touching every remaining node once."
}
\`\`\`

**Complexity.** O(n log k) time; O(1) extra space for iterative pairwise merging (heap version O(k)) — versus the fold approach's O(n·k).

**Thread.** One hard problem remains — reversal, the chapter's first move, now performed in fixed-size bursts down the chain, with the leftovers left untouched: Reverse Nodes in K-Group, the final exam in pointer discipline.`,
    },
    {
      slug: "reverse-nodes-in-k-group",
      title: "Reverse Nodes in K-Group",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/reverse-nodes-in-k-group",
      summary: "Reverse the list k nodes at a time, re-splicing each reversed block seamlessly — the pointer final exam.",
      body: `**Signal.** "Reverse in blocks of k, leaving a short final block untouched" — nothing conceptually new here, which is exactly the point: it's execution, chaining the chapter's reverse and splice moves under pressure, block after block.

**Brute force.** Convert the whole list to an array, reverse each length-k slice in place, then rebuild the list from the array — O(n) time, O(n) space for the array, sidestepping the in-place pointer surgery the problem is really testing.

**Optimal approach.** Per block, four duties. **Scout:** walk ahead to confirm k nodes remain — if not, stop; the tail stays as-is. **Reverse:** run the three-pointer shuffle from Reverse Linked List across exactly k nodes. **Splice:** reversing a block turns its first node into its *last* — so the node *before* the block must now point at the block's new head, and the block's new tail (the old first node) must point at whatever follows the block. Keep two handles before reversing: *prevBlockTail* (the connector behind you) and the block's original first node (your future tail). **Advance:** the old first node — now the block's tail — is the next block's prevBlockTail. The dummy-head idiom (fourth appearance this chapter) makes the very first block identical to every other block.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4, 5], "highlight": [0, 1], "note": "Scout finds k=2 nodes (1, 2). Reverse this block with the three-pointer shuffle: 1↔2 become 2→1." },
    { "cells": [2, 1, 3, 4, 5], "highlight": [1, 3], "note": "Splice: dummy→2 (new block head); old head 1 (now the block's tail) → next block. Advance: the next block starts at 3." },
    { "cells": [2, 1, 3, 4, 5], "highlight": [2, 3], "note": "Scout finds k=2 nodes (3, 4). Reverse: 3↔4 become 4→3." },
    { "cells": [2, 1, 4, 3, 5], "highlight": [1, 4], "note": "Splice: 1→4 (previous tail to new block head), 3→5 (new tail to remainder). Scout from 5 finds only 1 node (<k) — leave it as-is. Final: 2→1→4→3→5." }
  ],
  "caption": "Reverse Nodes in K-Group — each block is reversed and re-spliced independently; a short trailing block is left untouched."
}
\`\`\`

**Complexity.** O(n) time — each node reversed once, scouted once — O(1) space (recursion gives a prettier O(n/k)-stack version; offer it as the alternative) — versus the array-rebuild brute force's O(n) space.

**Thread.** Chapter complete: you can now bend chains into any shape without dropping them. Next, the pointer grows a sibling — every node holding *two* onward references — and the atlas enters its largest territory: Trees, where recursion becomes the native language.`,
    },
  ],
};
