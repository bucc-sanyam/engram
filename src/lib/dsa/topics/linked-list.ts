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
      body: `**The problem.** Reverse a singly linked list: 1→2→3→null becomes 3→2→1→null. The most fundamental list operation there is — asked constantly on its own, and embedded inside half the harder problems in this chapter.

**Why it is not trivial.** You cannot just walk along flipping arrows. The moment you point node 1's next at null, node 2 — and the entire rest of the list — is unreachable, unless someone was already holding it. Every linked-list bug in existence is a version of this: overwriting a pointer before saving what it pointed to.

**The insight.** Walk with three pointers. *prev* starts as null (the new tail's destination), *curr* at the head. Each step is a fixed four-beat bar: save curr.next into a temp (protect the rest of the list); point curr.next at prev (the flip); slide prev up to curr; slide curr up to the saved temp. When curr runs off the end, prev is standing on the old tail — the new head. Nothing is ever unreachable, because at every instant one of the three pointers holds each critical node.

**The walk-through.** 1→2→3. Beat one: save 2, flip 1→null, prev=1, curr=2. Beat two: save 3, flip 2→1, prev=2, curr=3. Beat three: save null, flip 3→2, prev=3, curr=null. Loop ends; return prev — 3→2→1→null.

**The recursive version.** Reverse the rest of the list first, then attach yourself behind it: head.next.next = head; head.next = null. Elegant, O(n) stack space, and a beautiful warm-up for Trees, where recursion stops being optional. Know both; lead with the iterative one.

**Complexity.** O(n) time, O(1) space iteratively.

**The thread.** That four-beat bar is this chapter's atomic move — you will replay it inside Reorder List and Reverse Nodes in K-Group. First, though, a gentler skill: weaving two lists together while breaking neither.`,
    },
    {
      slug: "merge-two-sorted-lists",
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/merge-two-sorted-linked-lists",
      summary: "Two sorted chains, one dummy head, and a tail that always grabs the smaller front.",
      body: `**The problem.** Merge two sorted linked lists into one sorted list, reusing the existing nodes. 1→2→4 and 1→3→4 become 1→1→2→3→4→4.

**The insight.** This is the merge step of merge sort, performed with pointers. Both lists present their heads; the smaller one is, by sortedness, the smallest element anywhere — it must come next in the output. Detach it, append it to the result's tail, and advance that list. Repeat until one list empties; then the survivor — already sorted, already chained — is appended *whole* in O(1), the little bonus arrays never give you.

**The dummy-head trick.** Appending to an empty result is an ugly special case: there is no tail yet to append to. The idiom that erases it: start with a throwaway *dummy* node, keep a tail pointer at it, and append normally forever — dummy.next is the real head when you finish. This one-line trick removes the "is this the first node?" branch from every list-building problem you will ever write, and interviewers read its presence as fluency. Use it here, in Add Two Numbers, in Merge K — everywhere construction happens.

**The walk-through.** 1→2→4 vs 1→3→4: take 1 (first list), take 1 (second), take 2, take 3, take 4, first list empties → append second list's remaining 4. Every step moved one existing node; zero new nodes beyond the dummy.

**Complexity.** O(m + n) time, O(1) extra space — the merge is a re-threading, not a copy.

**Why this small problem is load-bearing.** Merging sorted streams is half of external sorting, log-structured storage engines, and the k-way generalisation coming later this chapter. The two-list version is the cell everything larger is built from.

**The thread.** You can reverse; you can weave. Next question: what if the chain is dishonest — what if, somewhere down the line, it loops back on itself? Detecting that without any memory is one of the prettiest algorithms ever found.`,
    },
    {
      slug: "linked-list-cycle",
      title: "Linked List Cycle",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/linked-list-cycle-detection",
      summary: "Floyd's tortoise and hare: on a looped track, a runner at 2x must lap a runner at 1x.",
      body: `**The problem.** Does this linked list terminate, or does some node's next-pointer loop back to an earlier node? A cycle means walking it never ends — and you must answer without modifying the list, ideally in O(1) space.

**The obvious solution first.** A hash set of visited nodes: walk, and if you ever revisit a node, cycle. O(n) time, O(n) space — completely correct, say it in one breath. The interview is really about the follow-up: do it with *no* memory.

**The insight.** Two runners on the same track: a tortoise moving one node per tick, a hare moving two. If the track ends, the hare falls off — no cycle, done. If the track loops, both runners eventually get swept into the loop and circle forever — and inside the loop, the hare gains on the tortoise by exactly one node per tick. A gap that shrinks by one each tick must reach zero: they *collide*. Not "probably meet" — provably, within one lap of the tortoise entering. The collision is the proof of the cycle; no memory of the past required, because the runners' relative motion encodes it.

**The walk-through.** 1→2→3→4→5→3 (5 loops back to 3). Ticks: tortoise 2, hare 3 · tortoise 3, hare 5 · tortoise 4, hare 4 — collision, cycle confirmed.

**The famous part two.** After colliding, reset one runner to the head and advance both at speed one: they meet again exactly at the *cycle's entrance*. That is Floyd's full algorithm, and the arithmetic behind it (distances before and inside the loop cancelling) is worth working through once on paper — the next time you will need it is two problems from now, wearing an array costume in Find the Duplicate Number.

**Complexity.** O(n) time, O(1) space.

**The thread.** Fast and slow runners can do more than detect loops — run the hare to the end and the tortoise is standing on the *middle*. Reorder List, next, uses exactly that, then folds the list in half like a hand of cards.`,
    },
    {
      slug: "reorder-list",
      title: "Reorder List",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/reorder-linked-list",
      summary: "Find the middle, reverse the back half, interleave — three known moves composed into surgery.",
      body: `**The problem.** Rearrange 1→2→3→4→5 into 1→5→2→4→3: first, last, second, second-to-last… in place, without touching node values. The list folds in half and the two halves shuffle together like riffled cards.

**The insight.** Written as one algorithm this looks fearsome; recognised as *composition*, it is three problems you have already solved, run in sequence. Step one: find the middle — tortoise and hare, hare at double speed; when the hare hits the end, the tortoise stands at the midpoint. Step two: split there and **reverse the back half** — the three-pointer shuffle from the chapter's opening, verbatim. Now you hold 1→2→3 and 5→4. Step three: **interleave** — alternately splice one node from each list, a cousin of the merge you performed two problems ago, except the rule is "take turns" instead of "take smaller."

**The pointer discipline.** Each splice in step three overwrites two next-pointers, so each iteration must save both onward nodes before rewiring — the protect-before-flip reflex again. And do not forget to null-terminate the final node; the classic bug leaves a stale pointer creating an accidental cycle, which — pleasingly — the previous problem taught you to detect.

**The walk-through.** 1→2→3→4→5. Middle: tortoise on 3. Split: 1→2→3 and 4→5. Reverse back: 5→4. Interleave: take 1, take 5, take 2, take 4, take 3 → 1→5→2→4→3→null.

**Complexity.** O(n) time, O(1) space. The array-based cheat — copy nodes into a vector, two-pointer from both ends — is O(n) space and worth mentioning only as the thing you are avoiding.

**Why interviewers love it.** It is a *composition test*: no new idea anywhere, only fluency under pointer pressure. People who learned patterns as isolated tricks stall here; people who learned them as reusable moves finish in minutes.

**The thread.** The runners so far differed in *speed*. Next problem they differ in *head start* — and n-apart runners find the nth node from the end in a single pass.`,
    },
    {
      slug: "remove-nth-node-from-end-of-list",
      title: "Remove Nth Node From End of List",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/remove-node-from-end-of-linked-list",
      summary: "Two pointers locked n apart: when the leader falls off the end, the trailer stands before the victim.",
      body: `**The problem.** Delete the nth node counting from the *end*, in one pass. 1→2→3→4→5 with n = 2 → remove the 4.

**Why it is awkward.** Distance-from-the-end is exactly what a singly linked list cannot see — you discover the end only by arriving, at which point you have walked past the victim with no way back. The two-pass fix (measure length, walk again to position length − n) is fine and honest. The one-pass version is the pattern worth owning.

**The insight.** You cannot measure from the end, but you can *carry the measurement with you*. Send a lead pointer ahead exactly n nodes. Then advance lead and trail together, in lockstep, gap fixed. When lead steps off the end of the list, the trail pointer — n behind by construction — is standing exactly at distance n from the end. Arrange the offsets so trail lands one *before* the victim (advance lead n + 1 ahead, or start trail at a dummy), and the deletion is one splice: trail.next = trail.next.next. The rigid gap converts "position relative to an end you have not seen" into "position relative to a partner you can see." That is the fast-and-slow family's third trick: same speed, fixed offset.

**The dummy again.** If n equals the list's length, the victim is the *head*, and the head has no predecessor to splice from. The dummy-head idiom from Merge Two Sorted Lists dissolves the case: hang a dummy before the head, start trail there, and head-removal becomes indistinguishable from any other removal. Two problems, one idiom, zero special cases.

**The walk-through.** dummy→1→2→3→4→5, n = 2. Lead advances past 1, 2 (n steps from head, giving trail its buffer). March together: lead 3/trail dummy… lead null/trail 3. Splice: 3.next = 5. Result 1→2→3→5.

**Complexity.** O(n) time, one traversal, O(1) space.

**The thread.** Every problem so far rewired a single chain. Copy List with Random Pointer, next, asks you to *clone* one — including pointers that jump anywhere — and the slick solution interleaves the copy into the original.`,
    },
    {
      slug: "copy-list-with-random-pointer",
      title: "Copy List With Random Pointer",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/copy-linked-list-with-random-pointer",
      summary: "Deep-copy a list whose nodes point anywhere: a map from old to new — or clones woven between originals.",
      body: `**The problem.** Each node has a next pointer *and* a random pointer aiming at any node in the list (or null). Produce a deep copy — new nodes, with the copy's random pointers landing on the copy's own nodes, never the originals.

**Why naive copying fails.** Walking and cloning as you go handles next fine, but when you meet a random pointer aimed at a node you have not cloned yet, there is nothing to point at. Any order you pick, some pointer aims "ahead." The dependency graph is arbitrary; a single sweep cannot resolve it.

**The insight (two passes and a map).** Separate *creating* nodes from *wiring* them. Pass one: clone every node, wiring nothing, but record old → new in a hash map — the same "remember what you have seen" reflex as chapter one, now storing correspondences rather than presence. Pass two: for each original node, set copy.next = map[original.next] and copy.random = map[original.random]. Every lookup succeeds because *all* nodes exist before *any* wiring happens. O(n) time, O(n) space for the map.

**The interleaving trick (O(1) extra space).** The follow-up asks you to lose the map — so store the correspondence *in the list's own geometry*. Pass one: after each original node, splice in its clone: A→A'→B→B'→… Now "the clone of X" is simply X.next, an address computation instead of a map lookup. Pass two: for each original, copy.random = original.random.next — one hop finds the partner. Pass three: unzip the two lists, restoring the original perfectly. Same information as the hash map, encoded positionally.

**The walk-through.** List A→B, A.random = B, B.random = B. Interleave: A→A'→B→B'. Wire randoms: A'.random = A.random.next = B'; B'.random = B'. Unzip → a perfect copy.

**Complexity.** O(n) time either way; O(n) vs O(1) auxiliary space.

**The thread.** You have now cloned structure. Next, Add Two Numbers has you *computing* with lists — grade-school addition where each node is a digit and the carry rides along the walk.`,
    },
    {
      slug: "add-two-numbers",
      title: "Add Two Numbers",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/add-two-numbers",
      summary: "Grade-school addition down two chains: sum digits, emit node, carry the overflow forward.",
      body: `**The problem.** Two non-negative integers stored as linked lists, one digit per node, *least significant first*: 342 is 2→4→3. Return their sum in the same format. 2→4→3 plus 5→6→4 → 7→0→8 (342 + 465 = 807).

**Why reversed storage is a gift.** Grade-school addition starts at the ones column — and the lists hand you the ones column first. The digit order that looks weird is precisely the order the algorithm consumes. (The variant with most-significant-first storage is a real follow-up — solved by reversing first, or with stacks — and noting that trade shows you see the design choice.)

**The insight.** Walk both lists in lockstep with a *carry* riding along. Each step: sum = digitA + digitB + carry; emit a node holding sum mod 10; carry becomes sum ÷ 10 (always 0 or 1 — two digits plus a carry max out at 19). The subtleties are all endings: the lists may have different lengths (treat a missing node as digit 0 and keep walking), and after both lists end, a surviving carry mints one final node — forgetting it is *the* classic bug, the 999 + 1 case where the answer grows a digit.

**The walk-through.** 2→4→3 plus 5→6→4. Column one: 2+5 = 7, carry 0. Column two: 4+6 = 10 → emit 0, carry 1. Column three: 3+4+1 = 8. Result 7→0→8. Now 9→9 plus 1: 9+1 = 10 → emit 0 carry 1; 9+0+1 = 10 → emit 0 carry 1; lists done, carry alive → emit 1. Result 0→0→1 = 100. ✓

**The idioms.** Dummy head for clean construction (third appearance in this chapter), and a loop condition of "while either list has nodes *or* carry is nonzero" — that single or-clause encodes both edge cases without special-case code.

**Complexity.** O(max(m, n)) time, output-sized space. This is arbitrary-precision arithmetic in miniature — big-integer libraries do exactly this over larger digit chunks.

**The thread.** Next comes the chapter's practical joke: a problem with no linked list in sight — an array of numbers — that collapses the moment you *read the values as pointers* and set the tortoise and hare loose on it.`,
    },
    {
      slug: "find-the-duplicate-number",
      title: "Find The Duplicate Number",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/find-duplicate-integer",
      summary: "An array where values are pointers in disguise — the duplicate is a cycle entrance, and Floyd finds it.",
      body: `**The problem.** An array of n + 1 integers, each in the range 1..n. By pigeonhole, some value repeats. Find it — *without* modifying the array and in O(1) space. Those two constraints assassinate the obvious moves: no sorting (mutation), no hash set (space). The problem is engineered to force a stranger idea.

**The insight.** Read each value as an *instruction*: standing at index i, go to index nums[i]. Every cell points somewhere in-range, so from index 0 this walk goes on forever through a finite space — it must eventually revisit somewhere and loop. Now the beautiful part: **a repeated value is exactly a shared incoming pointer.** If the duplicate is d, then at least two different indexes point at index d — two arrows converging on one node. A walk that has a tail (index 0 is never pointed at, since values start at 1) funnelling into a converging node is precisely a rho shape: a linked list with a cycle, and *the cycle's entrance is the duplicate value*. The array was a linked list all along; nobody told you.

**The algorithm.** You already own it: Floyd. Phase one — tortoise and hare from index 0 until they collide inside the loop. Phase two — reset one runner to the start, advance both at speed one; their meeting point is the cycle entrance, which is d. Same two phases as Linked List Cycle, same distance-cancelling arithmetic, zero memory, array untouched.

**The walk-through.** [1,3,4,2,2]: the walk 0→1→3→2→4→2→4→… — indexes 3 and 4 both point at 2. Phase two lands both runners at index 2… whose role as entrance names the duplicate: 2.

**Complexity.** O(n) time, O(1) space. (Binary search on *value ranges* — count how many elements are ≤ mid — also solves it in O(n log n): a lovely echo of the Koko trick, worth one sentence in an interview.)

**The thread.** That is the chapter's mind-bender. Now the crown jewel of practical design: LRU Cache, where a hash map and a doubly linked list snap together into the structure half the industry runs on.`,
    },
    {
      slug: "lru-cache",
      title: "LRU Cache",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/lru-cache",
      summary: "Hash map for finding, doubly linked list for ordering — O(1) get and put, and eviction for free.",
      body: `**The problem.** Design a fixed-capacity cache: get(key) returns the value or −1; put(key, value) inserts or updates. When full, evict the **least recently used** entry. Both operations in O(1). This is the single most-asked design problem in interviews, because real systems — CPU caches, page tables, CDN edges, your browser — all live and die by it.

**Why one structure cannot do it.** The cache must do two unrelated things fast: *find* an entry by key (hash map territory) and maintain a *recency ordering* — with arbitrary entries jumping to the front on every touch, and the stalest one evictable from the back. Arrays reorder in O(n). Heaps order by priority but cannot "move this to front" in O(1). A hash map alone has no order at all.

**The insight.** Compose. A **doubly linked list** holds the entries in recency order — most recent at the head, stalest at the tail. Doubly, because the core move is *unlink this node from wherever it is* (then re-insert at head), and unlinking in O(1) requires knowing your predecessor without walking: node.prev.next = node.next; node.next.prev = node.prev. The **hash map** points keys straight at their list nodes — teleporting you to the node so the list never needs searching. Map finds; list orders. Each covers the other's blindness.

**The choreography.** get: map lookup → miss returns −1; hit unlinks the node, re-inserts at head (it is now most recent), returns the value. put: existing key updates and moves to head; new key inserts at head, and if capacity is exceeded, the tail node is unlinked and its key deleted from the map — that last part, cleaning the *map* on eviction, is the bug everyone ships. Two sentinel nodes (permanent head and tail) erase every null-check on the list edges — the dummy-head idiom, now doubled.

**Complexity.** O(1) per operation, O(capacity) space.

**The thread.** One list per problem so far. Merge K Sorted Lists, next, hands you a whole pile of them — and the interesting question is not *how* to merge but in what *shape*: one-by-one, tournament, or heap.`,
    },
    {
      slug: "merge-k-sorted-lists",
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/merge-k-sorted-linked-lists",
      summary: "Pairwise tournament merging turns k lists into one in O(n log k) — divide and conquer over streams.",
      body: `**The problem.** k sorted linked lists; merge them into one sorted list. You wrote the two-list merge earlier this chapter — this problem is entirely about *how to scale it*, and the three candidate shapes are a complexity lesson in themselves.

**Shape one: fold.** Merge list 1 into list 2, the result into list 3, and so on. Correct — and quietly quadratic: the growing accumulator is re-walked in almost every merge, totalling O(n·k) node visits for n total nodes. The accumulating-cost trap, worth recognising far beyond this problem.

**Shape two: tournament (the classic answer).** Merge lists in *pairs*: k lists become k/2, then k/4, halving each round. Every round touches each node at most once — O(n) per round — and there are log k rounds: **O(n log k)** total. Same two-list merge subroutine, arranged as a balanced tree instead of a chain. That restructuring — identical work, different shape, log factor saved — is divide and conquer's whole sales pitch, and it is exactly how merge sort beats insertion-by-insertion.

**Shape three: k-way heap.** Keep a min-heap of the k current front nodes; pop the global smallest, append it, push its successor. Also O(n log k), O(k) space, and the right answer when the "lists" are *streams* arriving over time — this is how log-structured databases compact files and how external sorts merge runs. Next chapter is entirely about this machine; here it is a preview.

**The walk-through (tournament).** Lists [1→4→5], [1→3→4], [2→6]. Round one: merge pairs → [1→1→3→4→4→5], [2→6]. Round two: merge those → [1→1→2→3→4→4→5→6]. Two rounds, log₂ 3 rounded up.

**Complexity.** O(n log k) time; O(1) extra space for iterative pairwise merging (heap version O(k)).

**The thread.** One hard problem remains — reversal, the chapter's first move, now performed in fixed-size bursts down the chain, with the leftovers left untouched: Reverse Nodes in K-Group, the final exam in pointer discipline.`,
    },
    {
      slug: "reverse-nodes-in-k-group",
      title: "Reverse Nodes in K-Group",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/reverse-nodes-in-k-group",
      summary: "Reverse the list k nodes at a time, re-splicing each reversed block seamlessly — the pointer final exam.",
      body: `**The problem.** Reverse a list in blocks of k: 1→2→3→4→5 with k = 2 → 2→1→4→3→5. A block shorter than k at the end stays in original order. Nothing conceptually new — which is exactly why it is hard: it is pure execution, every pointer pitfall of the chapter at once.

**The decomposition.** Per block, four duties. **Scout:** walk ahead to confirm k nodes remain — if not, stop; the tail stays as-is (checking first avoids the ugly reverse-then-undo dance). **Reverse:** run the three-pointer shuffle from Reverse Linked List across exactly k nodes. **Splice:** here is where implementations die. Reversing a block turns its first node into its *last* — so the node *before* the block must now point at the block's new head, and the block's new tail (the old first node) must point at whatever follows the block. Keep two handles before reversing: *prevBlockTail* (the connector behind you) and the block's original first node (your future tail). **Advance:** the old first node — now the block's tail — is the next block's prevBlockTail.

**The dummy, one last time.** The very first block has no node before it — its "prevBlockTail" would be the head's nonexistent predecessor. The dummy-head idiom (fourth appearance this chapter) makes block one identical to every other block. By now this should feel like reaching for a seatbelt.

**The walk-through.** dummy→1→2→3→4→5, k = 2. Scout finds 1, 2 → reverse → 2→1; splice: dummy→2, 1→3. Next block from 3: scout finds 3, 4 → reverse → 4→3; splice: 1→4, 3→5. Scout from 5 finds one node < k → stop. Result 2→1→4→3→5.

**Complexity.** O(n) time — each node reversed once, scouted once — O(1) space (recursion gives a prettier O(n/k)-stack version; offer it as the alternative).

**The thread.** Chapter complete: you can now bend chains into any shape without dropping them. Next, the pointer grows a sibling — every node holding *two* onward references — and the atlas enters its largest territory: Trees, where recursion becomes the native language.`,
    },
  ],
};
