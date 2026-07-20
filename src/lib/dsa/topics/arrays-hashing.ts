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
      body: `**Signal.** "Decide whether any value appears more than once" — any prompt shaped like "have I seen this before?" is a hash set asking to be used. That's the whole task here, which is exactly why it is the chapter's cleanest opener.

**Brute force.** Compare every pair. Two nested loops, O(n²) time, O(1) space. For 10 elements, fine; for a million, that is half a trillion comparisons for a yes/no question. The pain is *re-checking*: element number 500,000 gets compared against everything before it, even though you already walked past all of those values once.

**Optimal approach.** You do not need to compare pairs. You need to *remember*. A hash set is a bag with a magic property: asking "is this in the bag?" costs the same whether the bag holds ten items or ten million. So walk the array once. Before you drop each number in, ask the bag if it is already there. The first yes ends the game. Take [1, 2, 3, 1]. See 1 — bag is empty, add it. See 2 — not in the bag, add. See 3 — add. See 1 again — the bag says *yes, I know that one*, and you return true having touched each element exactly once.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 1], "pointers": [{ "label": "i", "index": 0 }], "note": "Bag is empty. See 1 — not there, add it." },
    { "cells": [1, 2, 3, 1], "pointers": [{ "label": "i", "index": 1 }], "note": "See 2 — not in the bag, add it." },
    { "cells": [1, 2, 3, 1], "pointers": [{ "label": "i", "index": 2 }], "note": "See 3 — not in the bag, add it." },
    { "cells": [1, 2, 3, 1], "pointers": [{ "label": "i", "index": 3 }], "highlight": [0, 3], "note": "See 1 again — the bag already has it. Return true." }
  ],
  "caption": "Contains Duplicate — one pass, one hash set, one early exit."
}
\`\`\`

**Complexity.** O(n) time, O(n) space. Compare that with the other honest option — sort first, then scan for equal neighbours — which is O(n log n) time but O(1) extra space. That pair of options is worth memorising as a *shape*: hashing buys speed with memory; sorting buys order with time. Interviewers love asking which you would pick and why (answer: it depends on whether memory or latency is the scarce resource — say that out loud).

**The thread.** You just learned to remember *whether* you have seen something. The very next problem, Valid Anagram, asks a slightly richer question: not "have I seen this letter?" but "*how many times* have I seen it?" — and the set quietly grows up into a counter.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the primary trade-off when using a Hash Set to solve Contains Duplicate?",
          options: ["It sacrifices time for space.", "It trades O(N) auxiliary space to achieve O(N) time complexity.", "It requires the array to be sorted first.", "It only works for positive integers."],
          correct_index: 1,
          model_answer: "A Hash Set allows O(1) lookups, bringing the total time down to O(N). However, storing up to N elements in the set requires O(N) space.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "valid-anagram",
      title: "Valid Anagram",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/is-anagram",
      summary: "Two words are anagrams when their letter histograms match — comparison by counting.",
      body: `**Signal.** "Are two strings anagrams" with no mention of order — "listen"/"silent" should say yes, "rat"/"car" should say no. Whenever a prompt says rearrangement is allowed, stop thinking about permutations and start thinking about **inventory**.

**Brute force.** Sort both words and compare the sorted strings — sorted("listen") and sorted("silent") are both "eilnst". Correct, and it is a real canonical-form idea worth keeping (it returns with force two problems from now in Group Anagrams), but it costs O(n log n) per pair when a linear pass is available.

**Optimal approach.** Two words are anagrams exactly when their letter counts match — 1 l, 1 i, 1 s, 1 t, 1 e, 1 n on both sides. So reduce each word to its histogram and compare histograms directly, without sorting either one. Count letters of the first word up: each letter increments its slot. Then walk the second word and count *down*: each letter decrements. If you ever go below zero, the second word uses a letter the first cannot supply — fail early. If the lengths matched and you never dipped negative, every count ends at exactly zero. One array of 26 integers does all the bookkeeping; no second pass to compare maps needed.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 0, 0, 0, 0, 0], "note": "Counter slots for e, i, l, n, s, t — all start at 0." },
    { "cells": [1, 1, 1, 1, 1, 1], "note": "After counting UP through \\"listen\\": every letter's slot is 1." },
    { "cells": [0, 0, 0, 0, 0, 0], "note": "After counting DOWN through \\"silent\\": every slot lands back on 0." },
    { "cells": [0, 0, 0, 0, 0, 0], "highlight": [0, 1, 2, 3, 4, 5], "note": "All zero, same length, never went negative — anagram confirmed." }
  ],
  "caption": "Valid Anagram — one histogram, incremented then decremented, must return to all-zero."
}
\`\`\`

**Complexity.** O(n) time, and O(1) space in the lowercase-English version — the histogram is 26 slots no matter how long the words are. (If the alphabet is unbounded — full Unicode — a hash map replaces the fixed array and space becomes O(k) for k distinct characters. Mentioning that unprompted is an easy interview point.) The sort-and-compare brute force stays O(n log n).

**Thread.** Contains Duplicate remembered presence; this problem remembered counts. Next, Two Sum flips the direction of the question entirely: instead of asking "have I seen *this*?", you will ask "have I seen *the thing that completes this*?" — and that flip is the single most reused trick in interview history.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can an array of size 26 replace a Hash Map for Valid Anagram?",
          options: ["Because strings only ever contain 26 characters.", "Because the problem specifies lowercase English letters, mapping directly to indices 0-25.", "Because arrays are automatically dynamically sized.", "Because it takes O(1) time to sort an array of size 26."],
          correct_index: 1,
          model_answer: "When the character set is bounded (e.g., a-z), a fixed-size array acts as a perfect hash map with zero collision overhead and O(1) constant space.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "two-sum",
      title: "Two Sum",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/two-integer-sum",
      summary: "The most famous interview problem ever — and the birth of the complement lookup.",
      body: `**Signal.** "Return the indices of the two numbers that add up to a target" — any "find a pair that sums/matches to X" prompt is asking whether you know the complement-lookup trick. It is the most-asked interview question in existence, and it earned that spot honestly: its one trick generalises everywhere.

**Brute force.** Try every pair: two nested loops, O(n²) time, O(1) space. Notice *why* it feels wasteful: when you stand on 11 looking for a partner summing to 9, you scan backwards hunting for −2 — but you already *walked past* −2 earlier. The information existed; you just failed to keep it.

**Optimal approach.** Reframe the question. Standing on value x, you do not need to search for anything — you need to know whether **target − x** has already been seen, and where. That number is called the *complement*, and "have I seen the complement?" is exactly the question a hash map answers in O(1). Walk the array once, and at each element first ask the map for the complement, then store your own value → index for the people downstream. Array [3, 4, 5, 6], target 7: at 3, complement is 4, map is empty, store 3→0; at 4, complement is 3 — the map has it at index 0. Done: [0, 1]. One pass, no rescanning. The check-before-store order also elegantly prevents using the same element twice.

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 4, 5, 6], "pointers": [{ "label": "i", "index": 0 }], "note": "At 3: complement = 7 − 3 = 4. Map is empty — not found. Store 3 → index 0." },
    { "cells": [3, 4, 5, 6], "pointers": [{ "label": "i", "index": 1 }], "highlight": [0, 1], "note": "At 4: complement = 7 − 4 = 3. Map has 3 at index 0 — found! Return [0, 1]." }
  ],
  "caption": "Two Sum — check the complement before storing, one pass, one map."
}
\`\`\`

**Complexity.** O(n) time, O(n) space. There is a two-pointer O(1)-space variant — but it needs a *sorted* array, and sorting destroys the indices the problem demands. That exact variant is problem two of the next chapter (Two Sum II), which is the roadmap's way of teaching you that the same problem wears different optimal solutions depending on what structure the input already has.

**Thread.** You now own the complement lookup. Group Anagrams, next, scales the idea from "one key finds one partner" to "one key gathers a whole family" — the map's values become buckets.`,
      questions: [
        {
          kind: "open",
          prompt: "In Two Sum, why do we store values as keys and indices as values in the Hash Map?",
          model_answer: "We need to look up whether the *complement value* exists in O(1) time. By making the value the key in the map, we can check for its presence instantly, and the map's value gives us the index we need to return.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "group-anagrams",
      title: "Group Anagrams",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/anagram-groups",
      summary: "Canonical forms as hash keys: everything 'the same' lands in the same bucket.",
      body: `**Signal.** "Gather the anagrams into groups" — a grouping/bucketing prompt built on top of an equivalence relation (anagram-of) means a canonical form doubling as a **hash key**, so the map does the grouping for you.

**Brute force.** Compare every word against every other word for the anagram relation and union them into groups — O(n²·k) for n words of average length k, since each comparison itself costs O(k). Painfully redundant: "eat" and "ate" get re-proven anagrams of each other independently of "tea" being one too.

**Optimal approach.** Valid Anagram gave you the fingerprint idea: anagrams share a canonical form. Here that fingerprint becomes a hash key. Every word walks up to the map, announces its fingerprint, and gets dropped into the bucket labelled with it. Words that are anagrams of each other produce the identical label, so they cannot help but end up together — no comparisons between words ever happen. Two candidates for the fingerprint: the sorted word ("eat"/"tea"/"ate" all sort to "aet", O(k log k) per word), or the 26-letter count signature joined into a string key (O(k) per word — the answer to "can you avoid sorting each word?"). Either way the structure is identical: map from fingerprint → list of originals, then return the map's values.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "eat", "label": "eat", "row": 0, "col": 0 },
    { "id": "tea", "label": "tea", "row": 1, "col": 0 },
    { "id": "ate", "label": "ate", "row": 2, "col": 0 },
    { "id": "tan", "label": "tan", "row": 3, "col": 0 },
    { "id": "nat", "label": "nat", "row": 4, "col": 0 },
    { "id": "bat", "label": "bat", "row": 5, "col": 0 },
    { "id": "aet", "label": "key \\"aet\\"", "row": 1, "col": 1 },
    { "id": "ant", "label": "key \\"ant\\"", "row": 3.5, "col": 1 },
    { "id": "abt", "label": "key \\"abt\\"", "row": 5, "col": 1 }
  ],
  "edges": [
    { "from": "eat", "to": "aet" },
    { "from": "tea", "to": "aet" },
    { "from": "ate", "to": "aet" },
    { "from": "tan", "to": "ant" },
    { "from": "nat", "to": "ant" },
    { "from": "bat", "to": "abt" }
  ],
  "caption": "Group Anagrams — every word's fingerprint routes it into the right bucket, no word-to-word comparisons."
}
\`\`\`

**Complexity.** With count-signature keys: O(n·k) time for n words of average length k, O(n·k) space to hold everything. With sorted keys: O(n·k log k). Both are worlds better than the O(n²·k) brute force.

**Thread.** Notice the promotion: in Two Sum the map's value was a single index; here it is a growing bucket. Next, Top K Frequent Elements pushes bucketing one step further — the bucket *index itself* becomes meaningful, and out of that falls a linear-time answer to a problem that looks like it needs sorting.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the optimal key to use in the Hash Map for Group Anagrams?",
          options: ["The original string.", "The sorted version of the string.", "A character frequency count array (e.g., [1, 0, 2...]).", "The length of the string."],
          correct_index: 2,
          model_answer: "While sorting the string works (O(K log K) per string), building a 26-length frequency array takes only O(K) time per string and serves as a perfect, unique key for anagrams.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "top-k-frequent-elements",
      title: "Top K Frequent Elements",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/top-k-elements-in-list",
      summary: "Count with a map, then bucket by frequency — a sort-shaped problem solved without sorting.",
      body: `**Signal.** "Return the k most frequent values" — frequency means counting (a hash map), but "top k without full sort" is the actual ask, and it's a tell for bucket sort whenever counts are bounded by array length.

**Brute force.** Count with a map — {1:3, 2:2, 3:1} for [1,1,1,2,2,3] — then sort the (value, count) pairs by count descending and take the first k. O(n log n) time for the sort, which the problem is explicitly steering you away from with a "better than O(n log n)" follow-up.

**Optimal approach.** Ask what the counts can possibly be. An element in an array of length n can appear at most n times, and at least once — frequencies live in the tiny universe 1..n. Whenever values live in a small, dense, known range, you can use them **as array indexes**. Make an array of n+1 buckets where bucket[f] holds every value that occurred exactly f times — bucket sort wearing its most natural outfit. Then walk the buckets from the high end down, collecting values until you have k of them. No comparison-based sorting ever runs; the *positions* do the ordering.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["", "", "", ""], "note": "Bucket array indexed by frequency 0..3 (n=6 elements, so max frequency ≤ 6)." },
    { "cells": ["", "", "2", "1"], "note": "Counts {1:3, 2:2, 3:1} land in buckets: bucket[3] holds value 1, bucket[2] holds value 2." },
    { "cells": ["", "", "2", "1"], "highlight": [3, 2], "note": "Sweep from the highest index down: bucket 3 yields 1, bucket 2 yields 2 — k=2 reached, stop." }
  ],
  "caption": "Top K Frequent Elements — frequency becomes the index, so collecting the top k needs no sorting."
}
\`\`\`

**Complexity.** O(n) time — one counting pass, one bucketing pass, one collection sweep — and O(n) space. The mainstream alternative is a heap of size k, giving O(n log k): genuinely the better answer when data streams in and n is unbounded, and saying so shows range (a full chapter on heaps awaits later in the atlas). But on a static array, buckets win outright over the O(n log n) brute force.

**Thread.** Three problems ago a map remembered presence; now maps and arrays are composing into little machines. Next comes a change of pace — Encode and Decode Strings has no counting at all. It asks a systems question: how do you make data *describe itself*? The answer, a length prefix, is secretly another kind of fingerprint.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Bucket Sort for Top K Frequent Elements, what does the index of the bucket array represent?",
          options: ["The value from the original array.", "The frequency of the elements stored at that index.", "The rank (kth most frequent).", "The order the elements appeared in the original array."],
          correct_index: 1,
          model_answer: "The index represents the count/frequency. Since a number can appear at most N times, we can create an array of size N+1 where bucket[i] holds all numbers that appeared exactly i times.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "encode-and-decode-strings",
      title: "Encode and Decode Strings",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/string-encode-and-decode",
      summary: "Length-prefix framing: the serialization trick real protocols use, in interview miniature.",
      body: `**Signal.** "Flatten a list of strings, then reconstruct the exact original list" — where the strings can contain *anything*, including whatever separator you were about to reach for. That constraint is the whole signal: this is a serialization-framing question, not a string-algorithms one.

**Brute force (why it fails).** The instinct is to join with a special character: "hello,world". But the moment a string may itself contain a comma, the decoder cannot tell structure from content. Escaping can patch it, but escapes need escaping, and the scheme grows hair. The problem is fundamental: a delimiter puts the structural information *inside* the same alphabet as the data, and the two collide — there's no complexity win here, it's just wrong.

**Optimal approach.** Put the structure *before* the data instead of *between* the data: prefix each string with its length and a terminator for the length itself — "5#hello5#world". Now the decoder never searches for anything. It reads a number, reads the # that ends the number, then **counts** forward exactly that many characters — and whatever those characters are, even digits, even #, they are payload by construction. The data cannot collide with the framing because the framing is consumed before the data begins. Note why the # is genuinely required: without it, "12#ab" could not tell "a 12-char string" from "a 1-char string starting with 2…" — lengths can be multi-digit, so the length field needs its own end marker.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["4", "#", "c", "o", "d", "e", "8", "#", "n", "e", "e", "t", "c", "o", "d", "e"], "pointers": [{ "label": "i", "index": 0 }], "note": "Read digits until '#': length = 4." },
    { "cells": ["4", "#", "c", "o", "d", "e", "8", "#", "n", "e", "e", "t", "c", "o", "d", "e"], "highlight": [2, 3, 4, 5], "note": "Consume exactly 4 characters as payload: \\"code\\" — no searching, just counting." },
    { "cells": ["4", "#", "c", "o", "d", "e", "8", "#", "n", "e", "e", "t", "c", "o", "d", "e"], "pointers": [{ "label": "i", "index": 6 }], "note": "Next: read digits until '#': length = 8." },
    { "cells": ["4", "#", "c", "o", "d", "e", "8", "#", "n", "e", "e", "t", "c", "o", "d", "e"], "highlight": [8, 9, 10, 11, 12, 13, 14, 15], "note": "Consume exactly 8 characters: \\"neetcode\\". Decoded: [\\"code\\", \\"neetcode\\"]." }
  ],
  "caption": "Encode and Decode Strings — a length prefix tells the decoder exactly how far to count, so payload content never has to be escaped."
}
\`\`\`

**Complexity.** O(total characters) both ways, which is optimal — you must at least look at everything once. O(total characters) space for the encoded output.

**The bigger picture.** You have reinvented length-prefix framing, which is how much of the real world ships data: HTTP's Content-Length header, TCP-level protocols, binary formats like Protocol Buffers. Interviewers ask this one because it separates people who memorise tricks from people who can *design* — there is no algorithm here, only a decision about where information should live.

**Thread.** A length prefix is information carried *ahead* of the data it describes. Hold that thought: the very next problem, Product of Array Except Self, is built on prefixes of a numeric kind — what running products carry forward from the left and the right.`,
      questions: [
        {
          kind: "open",
          prompt: "Why is a simple delimiter (like '#') not enough to encode an array of strings?",
          model_answer: "Because the delimiter character might exist inside the strings themselves. Without a length prefix telling us exactly how many characters belong to the string, we cannot distinguish a delimiter from normal string content.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "product-of-array-except-self",
      title: "Product of Array Except Self",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/products-of-array-discluding-self",
      summary: "Prefix meets suffix: every answer is the product of everything to your left times everything to your right.",
      body: `**Signal.** "The product of every element except the one at i — without division" — the division ban is the tell. It rules out the one-line cheat (multiply everything, then divide by self) and points straight at **prefix aggregation**.

**Brute force.** For each position, multiply every other element — O(n²) time. Or: multiply everything once, then divide by self for each position — O(n) but explicitly banned, since it breaks the moment a zero appears in the array and division isn't always the operation the interviewer wants generalised.

**Optimal approach.** Stand at position i and look both ways. The answer at i is exactly (product of everything to my left) × (product of everything to my right). Neither side involves you. Both sides can be *precomputed as running totals*: a left-to-right sweep accumulates prefix products, a right-to-left sweep accumulates suffix products. Two passes, each O(n), and every element of the answer is one multiplication of a prefix by a suffix. The space-polished version writes the prefixes straight into the output array, then sweeps from the right carrying the suffix product in a single variable and multiplying it in — same idea, O(1) extra space, and the follow-up interviewers usually want.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4], "note": "Input array." },
    { "cells": [1, 1, 2, 6], "note": "Left-to-right sweep: prefix[i] = product of everything before i." },
    { "cells": [24, 12, 4, 1], "note": "Right-to-left sweep: suffix[i] = product of everything after i." },
    { "cells": [24, 12, 8, 6], "highlight": [0, 1, 2, 3], "note": "Multiply position-wise, prefix × suffix: the final answer, no division used." }
  ],
  "caption": "Product of Array Except Self — each answer is where a left-sweep and a right-sweep meet."
}
\`\`\`

**Complexity.** O(n) time, O(1) space beyond the output.

**The bigger picture.** You have just met prefix aggregation, one of the quietly great ideas in all of computing. Swap × for +, and prefix sums answer any "sum of a range" query in O(1) — the trick behind countless subarray problems. The general shape: precompute what the left knows and what the right knows, and every position's answer becomes a meeting of the two. You will see it again in 2-D DP and in interval problems.

**Thread.** So far every structure has been one-dimensional. Valid Sudoku, next, lifts hashing into two dimensions — where the thing you remember is not a value but a *coordinate fact*: "this digit already lives in this row, this column, this box."`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does the optimal approach for Product of Array Except Self avoid division?",
          options: ["By using a sliding window.", "By precomputing prefix products from the left and suffix products from the right, then multiplying them for each index.", "By using a Hash Map to store all products.", "By sorting the array first."],
          correct_index: 1,
          model_answer: "The product of everything except nums[i] is exactly the product of everything to its left multiplied by the product of everything to its right.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "valid-sudoku",
      title: "Valid Sudoku",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/valid-sudoku",
      summary: "Hashing in two dimensions — 27 little sets, and the integer-division trick that names each box.",
      body: `**Signal.** "No digit repeats in any row, column, or 3×3 box" — three independent duplicate-detection constraints layered on the same cells. Multiple independent "no repeats" rules over the same data is a tell for multiple parallel hash sets, not one shared structure.

**Brute force.** For every filled cell, rescan its entire row, column, and box looking for a match — O(n³) work-ish over an n×n board (81 cells, each triggering ~27 comparisons), and it re-derives information you already saw on an earlier cell.

**Optimal approach.** This is Contains Duplicate, three ways at once. Every constraint — "no repeats in row 4", "no repeats in column 7", "no repeats in box (1,2)" — is its own tiny duplicate-detection problem, and each gets its own hash set: 9 row-sets, 9 column-sets, 9 box-sets, 27 in all. One pass over the 81 cells; each filled cell asks three sets "have you seen this digit?" and, if all say no, registers itself in all three. Any yes anywhere ends it. The one real trick: rows and columns index themselves, but which box does cell (r, c) belong to? Integer division collapses coordinates into blocks — r/3 (rounded down) and c/3 each map 0,1,2 → 0; 3,4,5 → 1; 6,7,8 → 2. The pair (r/3, c/3), or the single number 3·(r/3) + c/3, names the box. This coordinate-compression trick reappears any time a grid has block structure.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["row4: {}", "col7: {}", "box(1,2): {}"], "note": "Cell (4,7) holds a 6. Check all three sets — all empty, all clear." },
    { "cells": ["row4: {6}", "col7: {6}", "box(1,2): {6}"], "note": "No conflicts found — register 6 in row-set 4, col-set 7, and box-set (1,2)." },
    { "cells": ["row5: {}", "col8: {}", "box(1,2): {6}"], "highlight": [2], "note": "Cell (5,8) also holds a 6, also in box (1,2). Row 5 and col 8 are clean, but box(1,2) already has 6 — invalid." }
  ],
  "caption": "Valid Sudoku — 27 independent sets do all the cross-checking; box index comes from integer division."
}
\`\`\`

**Complexity.** The board is fixed at 81 cells, so formally O(1) everything — say that with a smile, then give the honest form: O(n²) time and space for an n×n board, versus the brute force's ~O(n³). Sudoku's later chapter-mate is N-Queens in Backtracking, where boards stop being audited and start being *searched*.

**Thread.** One problem remains, and it is the chapter's best magic trick: Longest Consecutive Sequence, where a hash set stops being a passive memory and becomes a space you can *leap through* — stepping from number to neighbouring number in O(1), no sorting in sight.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How do you map a 9x9 Sudoku cell at (row, col) to its corresponding 3x3 sub-box index?",
          options: ["(row % 3) * 3 + (col % 3)", "(row // 3) * 3 + (col // 3)", "(row + col) // 3", "row * col % 9"],
          correct_index: 1,
          model_answer: "Dividing by 3 (floor division) maps indices 0-2 to 0, 3-5 to 1, etc. Multiplying the row offset by 3 gives a unique 1D index (0-8) for each of the 9 sub-boxes.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "longest-consecutive-sequence",
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-consecutive-sequence",
      summary: "The set as teleporter: find runs of consecutive numbers in O(n), only ever counting from a run's true start.",
      body: `**Signal.** "Longest run of consecutive integers," required in O(n) — the O(n) bound is the tell. It explicitly rules out the obvious sort-then-scan (O(n log n)), so the answer has to come from a hash set used as a space you can step through.

**Brute force.** Sort the array, then scan for consecutive runs — O(n log n) time, and it's explicitly disallowed by the required complexity, but it's the natural first idea and worth naming before ruling it out.

**Optimal approach.** Drop every number into a hash set, and the set becomes a *space with geography*: standing at any number x, you can ask "does x+1 exist?" in O(1) and step to it. Runs can be walked without any sorting. But walking naively from every element re-walks long runs over and over — from 1, from 2, from 3… The fix is the beautiful part: **only start walking from a run's true beginning.** A number x starts a run exactly when x − 1 is *not* in the set. For every other number, do nothing — some starter upstream will collect it.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4], "highlight": [0], "note": "Set: {100,4,200,1,3,2}. Visit 1: 0 is absent → 1 is a starter. Begin walking: check 2." },
    { "cells": [1, 2, 3, 4], "highlight": [0, 1], "note": "2 is present — extend the run." },
    { "cells": [1, 2, 3, 4], "highlight": [0, 1, 2], "note": "3 is present — extend further." },
    { "cells": [1, 2, 3, 4], "highlight": [0, 1, 2, 3], "note": "4 is present, 5 is absent — run ends. Length 4. (100 and 200 are each their own starter, length 1; visits to 2 and 3 as outer-loop starters get skipped since 1/2 are present.)" }
  ],
  "caption": "Longest Consecutive Sequence — only true run-starts pay for a walk, so every element is touched at most twice overall."
}
\`\`\`

**Why it is really O(n).** The loop-inside-a-loop look is deceiving. Every element is touched at most twice — once in the outer scan, once as a step inside the single walk that owns it, because only one starter per run exists. Amortised analysis in one sentence, and interviewers *will* ask you to make this argument. The is-x-minus-1-absent guard is the whole difference between O(n) and quadratic.

**Complexity.** O(n) time, O(n) space — versus the O(n log n) brute force.

**Thread.** That closes chapter one. Look at the arc: presence, counts, complements, buckets, self-describing data, prefixes, coordinates, and finally a set with paths through it. Every later chapter borrows from this toolkit. Next: **Two Pointers** — where instead of *spending memory* to create structure, you exploit structure the data already has. Its opening problem needs no map at all: just two fingers and a sorted-enough world.`,
      questions: [
        {
          kind: "open",
          prompt: "In Longest Consecutive Sequence, how do we ensure the algorithm runs in O(N) time instead of O(N^2)?",
          model_answer: "We only start counting a sequence if the current number is the *start* of a sequence (i.e., num - 1 does not exist in the hash set). This guarantees each number is visited at most twice.",
          difficulty: "advanced"
        }
      ]
    },
  ],
};
