import type { DsaTopic } from "../types";

/** Chapter 1 — Arrays & Hashing: trading memory for time. */
export const arraysHashing: DsaTopic = {
  slug: "arrays-hashing",
  title: "Arrays & Hashing",
  chapter: 1,
  tagline: "Trade a little memory for a lot of time — the root of every pattern that follows.",
  color: "#f5b95f",
  prereqs: [],
  unlocks: ["two-pointers", "stack"],
  intro: `Every interview pattern you will ever learn is, at its core, a way of avoiding rework. Arrays & Hashing is where that idea is born, which is why the roadmap puts it at the very top: everything else descends from here.

An array is the simplest promise a computer makes you: give me an index, I hand you the value instantly. A hash map extends that promise to *anything*: give me a name, a word, a coordinate — I hand you what you stored under it, still in constant time. The entire chapter is one long meditation on that superpower. When a brute-force solution says "for every element, scan everything again," hashing whispers: *you already saw that information — why are you looking for it twice?* Store what you learn as you walk the array, and the second scan disappears.

The nine problems here are sequenced like a story. You start by remembering **whether** you have seen something (Contains Duplicate), then **how many times** (Valid Anagram), then you flip the question and look up an element's **partner** (Two Sum). From there the keys get smarter: whole words collapse into canonical signatures (Group Anagrams), counts become bucket indexes (Top K Frequent Elements), and data learns to describe itself (Encode and Decode Strings). The chapter closes with three problems where the *shape* of the storage is the trick — running products (Product of Array Except Self), coordinate sets (Valid Sudoku), and finally a set you can leap through like stepping stones (Longest Consecutive Sequence).

Master the reflex this chapter teaches — *"could a hash map remember this for me?"* — and you will reach for it in graphs, in dynamic programming, in sliding windows, everywhere. On the roadmap, this node unlocks both Two Pointers and Stack: structure through sortedness, and structure through order of arrival. Both are answers to the same question hashing answers with memory.`,
  problems: [
    {
      slug: "contains-duplicate",
      title: "Contains Duplicate",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/duplicate-integer",
      summary: "The hash set's one-line superpower: answering 'have I seen this before?' instantly.",
      body: `**The problem.** Given an array of integers, decide whether any value appears more than once. That is the entire task — and precisely because it is so small, it exposes the chapter's central trade cleanly.

**The naive move.** Compare every pair. Two nested loops, quadratic time. For 10 elements, fine; for a million, that is half a trillion comparisons for a yes/no question. The pain here is *re-checking*: element number 500,000 gets compared against everything before it, even though you already walked past all of those values once.

**The insight.** You do not need to compare pairs. You need to *remember*. A hash set is a bag with a magic property: asking "is this in the bag?" costs the same whether the bag holds ten items or ten million. So walk the array once. Before you drop each number in, ask the bag if it is already there. The first yes ends the game.

**The walk-through.** Take [1, 2, 3, 1]. See 1 — bag is empty, add it. See 2 — not in the bag, add. See 3 — add. See 1 again — the bag says *yes, I know that one*, and you return true having touched each element exactly once.

**Complexity.** O(n) time, O(n) space. Compare that with the other honest option — sort first, then scan for equal neighbours — which is O(n log n) time but O(1) extra space. That pair of options is worth memorising as a *shape*: hashing buys speed with memory; sorting buys order with time. Interviewers love asking which you would pick and why (answer: it depends on whether memory or latency is the scarce resource — say that out loud).

**The thread.** You just learned to remember *whether* you have seen something. The very next problem, Valid Anagram, asks a slightly richer question: not "have I seen this letter?" but "*how many times* have I seen it?" — and the set quietly grows up into a counter.`,
    },
    {
      slug: "valid-anagram",
      title: "Valid Anagram",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/is-anagram",
      summary: "Two words are anagrams when their letter histograms match — comparison by counting.",
      body: `**The problem.** Are two strings anagrams — the same letters, rearranged? "listen" and "silent" should say yes; "rat" and "car" should say no.

**The insight.** Rearrangement is a red herring. You do not care about *order* at all; you care about *inventory*. Two words are anagrams exactly when their letter counts match — 1 l, 1 i, 1 s, 1 t, 1 e, 1 n on both sides. So instead of trying permutations (there are factorially many), reduce each word to its histogram and compare the histograms. This is your first taste of a deep idea: when order does not matter, find a **canonical form** — a fingerprint that is identical for everything you consider "the same."

**The walk-through.** Count letters of the first word up: each letter increments its slot. Then walk the second word and count *down*: each letter decrements. If you ever go below zero, the second word uses a letter the first cannot supply — fail early. If the lengths matched and you never dipped negative, every count ends at exactly zero. One array of 26 integers does all the bookkeeping; no second pass to compare maps needed.

**Complexity.** O(n) time, and O(1) space in the lowercase-English version — the histogram is 26 slots no matter how long the words are. (If the alphabet is unbounded — full Unicode — a hash map replaces the fixed array and space becomes O(k) for k distinct characters. Mentioning that unprompted is an easy interview point.)

**A second canonical form.** Sorting both words and comparing also works — sorted("listen") and sorted("silent") are the same string. It is O(n log n), slower, but the *idea* of "sort as fingerprint" returns with real force two problems from now in Group Anagrams. Keep it in your pocket.

**The thread.** Contains Duplicate remembered presence; this problem remembered counts. Next, Two Sum flips the direction of the question entirely: instead of asking "have I seen *this*?", you will ask "have I seen *the thing that completes this*?" — and that flip is the single most reused trick in interview history.`,
    },
    {
      slug: "two-sum",
      title: "Two Sum",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/two-integer-sum",
      summary: "The most famous interview problem ever — and the birth of the complement lookup.",
      body: `**The problem.** Given an array and a target, return the indices of the two numbers that add up to it. Exactly one solution exists; you cannot use the same element twice. It is the most-asked interview question in existence, and it earned that spot honestly — its one trick generalises everywhere.

**The naive move.** Try every pair: quadratic. And notice *why* it feels wasteful: when you stand on 11 looking for a partner summing to 9, you scan backwards hunting for −2 — but you already *walked past* −2 earlier. The information existed; you just failed to keep it.

**The insight.** Reframe the question. Standing on value x, you do not need to search for anything — you need to know whether **target − x** has already been seen, and where. That number is called the *complement*, and "have I seen the complement?" is exactly the question a hash map answers in O(1). So: walk the array once, and at each element first ask the map for the complement, then store your own value → index for the people downstream.

**The walk-through.** Array [3, 4, 5, 6], target 7. At 3: complement is 4, map is empty, store 3→0. At 4: complement is 3 — the map has it at index 0. Done: [0, 1]. One pass, no rescanning. The check-before-store order also elegantly prevents using the same element twice (7 − 3.5 style self-matches never arise because you have not stored yourself yet when you ask).

**Complexity.** O(n) time, O(n) space. There is a two-pointer O(1)-space variant — but it needs a *sorted* array, and sorting destroys the indices the problem demands. That exact variant is problem two of the next chapter (Two Sum II), which is the roadmap's way of teaching you that the same problem wears different optimal solutions depending on what structure the input already has.

**The thread.** You now own the complement lookup. Group Anagrams, next, scales the idea from "one key finds one partner" to "one key gathers a whole family" — the map's values become buckets.`,
    },
    {
      slug: "group-anagrams",
      title: "Group Anagrams",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/anagram-groups",
      summary: "Canonical forms as hash keys: everything 'the same' lands in the same bucket.",
      body: `**The problem.** Given a list of words, gather the anagrams into groups: ["eat","tea","tan","ate","nat","bat"] becomes [["eat","tea","ate"], ["tan","nat"], ["bat"]].

**The insight.** Valid Anagram gave you the fingerprint idea: anagrams share a canonical form. This problem shows why fingerprints are *powerful* rather than merely cute — a canonical form can be used as a **hash key**, and then the hash map does the grouping for you. Every word walks up to the map, announces its fingerprint, and gets dropped into the bucket labelled with it. Words that are anagrams of each other produce the identical label, so they cannot help but end up together. No comparisons between words ever happen.

**Choosing the fingerprint.** Two candidates, both from the last problem. One: the sorted word — "eat", "tea", "ate" all sort to "aet". Simple, costs O(k log k) per word. Two: the 26-letter count signature — the counts (1,0,0,0,1,…,1 for a/e/t) joined into a string key. Costs O(k) per word, and it is the answer to the follow-up interviewers always ask ("can you avoid sorting each word?"). Either way, the *structure* of the solution is identical: map from fingerprint → list of originals, then return the map's values.

**The walk-through.** "eat" → key "aet" → new bucket. "tea" → "aet" → joins the first bucket. "tan" → "ant" → new bucket. "ate" → "aet" → first bucket again. "nat" → "ant". "bat" → "abt". Three buckets fall out, already grouped.

**Complexity.** With count-signature keys: O(n·k) time for n words of average length k, O(n·k) space to hold everything. With sorted keys: O(n·k log k). Both are worlds better than comparing all word pairs.

**The thread.** Notice the promotion: in Two Sum the map's value was a single index; here it is a growing bucket. Next, Top K Frequent Elements pushes bucketing one step further — the bucket *index itself* becomes meaningful, and out of that falls a linear-time answer to a problem that looks like it needs sorting.`,
    },
    {
      slug: "top-k-frequent-elements",
      title: "Top K Frequent Elements",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/top-k-elements-in-list",
      summary: "Count with a map, then bucket by frequency — a sort-shaped problem solved without sorting.",
      body: `**The problem.** Given an array, return the k most frequent values. [1,1,1,2,2,3] with k=2 → [1,2].

**The first half.** Frequency means counting, and counting means a hash map — by now that reflex should fire instantly. One pass gives you value → count: {1:3, 2:2, 3:1}. The interesting question is the second half: how do you extract the top k counts *without* sorting the whole tally (O(n log n))?

**The insight.** Ask what the counts can possibly be. An element in an array of length n can appear at most n times, and at least once. So frequencies live in the tiny universe 1..n — and whenever values live in a small, dense, known range, you can use them **as array indexes**. Make an array of n+1 buckets where bucket[f] holds every value that occurred exactly f times. This is bucket sort wearing its most natural outfit. Then walk the buckets from the high end down, collecting values until you have k of them.

**The walk-through.** Counts {1:3, 2:2, 3:1} drop into buckets: bucket[3]=[1], bucket[2]=[2], bucket[1]=[3]. Sweep from bucket 6 downward: bucket 3 yields 1, bucket 2 yields 2 — that is k, stop. No comparison-based sorting ever ran; the *positions* did the ordering.

**Complexity.** O(n) time — one counting pass, one bucketing pass, one collection sweep — and O(n) space. The mainstream alternative is a heap of size k, giving O(n log k): genuinely the better answer when data streams in and n is unbounded, and saying so shows range (a full chapter on heaps awaits later in the atlas). But on a static array, buckets win.

**The thread.** Three problems ago a map remembered presence; now maps and arrays are composing into little machines. Next comes a change of pace — Encode and Decode Strings has no counting at all. It asks a systems question: how do you make data *describe itself*? The answer, a length prefix, is secretly another kind of fingerprint.`,
    },
    {
      slug: "encode-and-decode-strings",
      title: "Encode and Decode Strings",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/string-encode-and-decode",
      summary: "Length-prefix framing: the serialization trick real protocols use, in interview miniature.",
      body: `**The problem.** Design two functions: one that flattens a list of strings into a single string, and one that reconstructs the exact original list. The strings can contain *anything* — including whatever character you were hoping to use as a separator.

**Why delimiters fail.** The instinct is to join with a special character: "hello,world". But the moment a string may itself contain a comma, the decoder cannot tell structure from content. Escaping can patch it, but escapes need escaping, and the scheme grows hair. The problem is fundamental: a delimiter puts the structural information *inside* the same alphabet as the data, and the two collide.

**The insight.** Put the structure *before* the data instead of *between* the data: prefix each string with its length and a terminator for the length itself — "5#hello5#world". Now the decoder never searches for anything. It reads a number, reads the # that ends the number, then **counts** forward exactly that many characters — and whatever those characters are, even digits, even #, they are payload by construction. The data cannot collide with the framing because the framing is consumed before the data begins.

**The walk-through.** Decode "4#code8#neetcode": read 4, skip #, take "code"; read 8, skip #, take "neetcode". Note why the # is genuinely required: without it, "12#ab" could not tell "a 12-char string" from "a 1-char string starting with 2…" — lengths can be multi-digit, so the length field needs its own end marker.

**Complexity.** O(total characters) both ways, which is optimal — you must at least look at everything once.

**The bigger picture.** You have reinvented length-prefix framing, which is how much of the real world ships data: HTTP's Content-Length header, TCP-level protocols, binary formats like Protocol Buffers. Interviewers ask this one because it separates people who memorise tricks from people who can *design* — there is no algorithm here, only a decision about where information should live.

**The thread.** A length prefix is information carried *ahead* of the data it describes. Hold that thought: the very next problem, Product of Array Except Self, is built on prefixes of a numeric kind — what running products carry forward from the left and the right.`,
    },
    {
      slug: "product-of-array-except-self",
      title: "Product of Array Except Self",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/products-of-array-discluding-self",
      summary: "Prefix meets suffix: every answer is the product of everything to your left times everything to your right.",
      body: `**The problem.** For each position i, compute the product of every element *except* the one at i — without using division, in O(n). For [1,2,3,4] the answer is [24,12,8,6].

**Why no division?** Because multiply-everything-then-divide-by-self dies the moment a zero appears (and the ban is the point of the exercise — the intended idea generalises far beyond products).

**The insight.** Stand at position i and look both ways. The answer at i is exactly (product of everything to my left) × (product of everything to my right). Neither side involves you. And both sides can be *precomputed as running totals*: a left-to-right sweep accumulates prefix products, a right-to-left sweep accumulates suffix products. Two passes, each O(n), and every element of the answer is one multiplication of a prefix by a suffix.

**The walk-through.** For [1,2,3,4]: prefixes (product of everything before me) are [1,1,2,6]; suffixes (everything after me) are [24,12,4,1]. Multiply position-wise: [24,12,8,6]. The space-polished version writes the prefixes straight into the output array, then sweeps from the right carrying the suffix product in a single variable and multiplying it in — same idea, O(1) extra space, and the follow-up interviewers usually want.

**Complexity.** O(n) time, O(1) space beyond the output.

**The bigger picture.** You have just met **prefix aggregation**, one of the quietly great ideas in all of computing. Swap × for +, and prefix sums answer any "sum of a range" query in O(1) — the trick behind countless subarray problems. The general shape: precompute what the left knows and what the right knows, and every position's answer becomes a meeting of the two. You will see it again in 2-D DP and in interval problems.

**The thread.** So far every structure has been one-dimensional. Valid Sudoku, next, lifts hashing into two dimensions — where the thing you remember is not a value but a *coordinate fact*: "this digit already lives in this row, this column, this box."`,
    },
    {
      slug: "valid-sudoku",
      title: "Valid Sudoku",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-sudoku",
      summary: "Hashing in two dimensions — 27 little sets, and the integer-division trick that names each box.",
      body: `**The problem.** Given a partially filled 9×9 Sudoku board, decide whether it is *valid so far*: no digit repeats in any row, any column, or any of the nine 3×3 boxes. You are not solving the puzzle — only auditing it.

**The insight.** This is Contains Duplicate, three ways at once. Every constraint — "no repeats in row 4", "no repeats in column 7", "no repeats in box (1,2)" — is its own tiny duplicate-detection problem, and each gets its own hash set: 9 row-sets, 9 column-sets, 9 box-sets, 27 in all. One pass over the 81 cells; each filled cell asks three sets "have you seen this digit?" and, if all say no, registers itself in all three. Any yes anywhere ends it.

**The one real trick.** Rows and columns index themselves, but which box does cell (r, c) belong to? Integer division collapses coordinates into blocks: r/3 (rounded down) and c/3 each map 0,1,2 → 0; 3,4,5 → 1; 6,7,8 → 2. The pair (r/3, c/3) — or the single number 3·(r/3) + c/3 — names the box. This coordinate-compression trick is worth keeping: it reappears any time a grid has block structure.

**The walk-through.** Cell (4, 7) holds a 6. Ask row-set 4, column-set 7, and box-set (1, 2). All clear → record 6 in each. Later, cell (5, 8) — also box (1, 2) — holds a 6. Its row and column are clean, but the box-set answers *yes*, and the board is invalid. Constraints stay independent; the sets do all the cross-checking without ever comparing cells to each other.

**Complexity.** The board is fixed at 81 cells, so formally O(1) everything — say that with a smile, then give the honest form: O(n²) time and space for an n×n board. Sudoku's later chapter-mate is N-Queens in Backtracking, where boards stop being audited and start being *searched*.

**The thread.** One problem remains, and it is the chapter's best magic trick: Longest Consecutive Sequence, where a hash set stops being a passive memory and becomes a space you can *leap through* — stepping from number to neighbouring number in O(1), no sorting in sight.`,
    },
    {
      slug: "longest-consecutive-sequence",
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-consecutive-sequence",
      summary: "The set as teleporter: find runs of consecutive numbers in O(n), only ever counting from a run's true start.",
      body: `**The problem.** Given an unsorted array, find the length of the longest run of consecutive integers hiding in it. [100, 4, 200, 1, 3, 2] contains the run 1-2-3-4, so the answer is 4. Required: O(n) — which pointedly rules out the obvious sort-then-scan at O(n log n).

**The insight.** Drop every number into a hash set, and the set becomes a *space with geography*: standing at any number x, you can ask "does x+1 exist?" in O(1) and step to it. Runs can be walked without any sorting. But walking naively from every element re-walks long runs over and over — from 1, from 2, from 3… The fix is the beautiful part: **only start walking from a run's true beginning.** A number x starts a run exactly when x − 1 is *not* in the set. For every other number, do nothing — some starter upstream will collect it.

**The walk-through.** Set: {100, 4, 200, 1, 3, 2}. Visit 100: 99 absent → starter; walk 101? absent — run length 1. Visit 4: 3 present → not a starter, skip. Visit 200: starter, run 1. Visit 1: 0 absent → starter; walk 2, 3, 4, stop at 5 — length 4. Visits to 3 and 2: skipped. Answer: 4.

**Why it is really O(n).** The loop-inside-a-loop look is deceiving. Every element is touched at most twice — once in the outer scan, once as a step inside the single walk that owns it, because only one starter per run exists. Amortised analysis in one sentence, and interviewers *will* ask you to make this argument. The is-x-minus-1-absent guard is the whole difference between O(n) and quadratic.

**Complexity.** O(n) time, O(n) space.

**The thread.** That closes chapter one. Look at the arc: presence, counts, complements, buckets, self-describing data, prefixes, coordinates, and finally a set with paths through it. Every later chapter borrows from this toolkit. Next: **Two Pointers** — where instead of *spending memory* to create structure, you exploit structure the data already has. Its opening problem needs no map at all: just two fingers and a sorted-enough world.`,
    },
  ],
};
