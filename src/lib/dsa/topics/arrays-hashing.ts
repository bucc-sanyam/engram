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

The nine problems here are sequenced like a story. You start by remembering **whether** you have seen something (Contains Duplicate), then **how many times** (Valid Anagram), then you flip the question and look up an element's **partner** (Two Sum). From there the keys get smarter: whole words collapse into canonical signatures (Group Anagrams), counts become bucket indexes (Top K Frequent Elements), and data learns to describe itself (Encode and Decode Strings). The chapter closes with three problems where the *shape* of the storage is the trick — running products (Product of Array Except Self), coordinate sets (Valid Sudoku), and finally a set you can leap through like stepping stones (Longest Consecutive Sequence).`,
  problems: [
    {
      slug: "contains-duplicate",
      title: "Contains Duplicate",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/duplicate-integer",
      summary: "The hash set's one-line superpower: answering 'have I seen this before?' instantly.",
      body: `**Beginner Intuition & The Naive Fallacy.** When asked if an array contains duplicates, a beginner's first instinct is to take element 1 and compare it against element 2, 3, 4... then take element 2 and compare against 3, 4, 5... 
*Why this shatters*: For $N = 100,000$ numbers, nested loops do $\\frac{N(N-1)}{2} \\approx 5$ billion comparisons! The core flaw is **amnesia**: when standing at index 50,000, you have already seen the first 49,999 numbers, yet nested loops re-examine them again and again.

**The Structural Invariant.** We do not need to compare pairs; we need to **remember state**. A Hash Set is a data structure backed by a hash function that provides $O(1)$ constant-time lookup. 
- *The Invariant*: At step $i$, the set contains exactly the unique numbers found in \`nums[0...i-1]\`.
- *The Decision Rule*: Before adding \`nums[i]\`, check if it already exists in the set. If yes, stop immediately.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 1], "pointers": [{ "label": "i=0 (seen: {})", "index": 0 }], "note": "Set is empty. Read 1: Not in set → Insert 1. Set is now {1}." },
    { "cells": [1, 2, 3, 1], "pointers": [{ "label": "i=1 (seen: {1})", "index": 1 }], "note": "Read 2: Not in set → Insert 2. Set is now {1, 2}." },
    { "cells": [1, 2, 3, 1], "pointers": [{ "label": "i=2 (seen: {1,2})", "index": 2 }], "note": "Read 3: Not in set → Insert 3. Set is now {1, 2, 3}." },
    { "cells": [1, 2, 3, 1], "pointers": [{ "label": "i=3 (seen: {1,2,3})", "index": 3 }], "highlight": [0, 3], "note": "Read 1: Set already contains 1! Duplicate found → Return true." }
  ],
  "caption": "Contains Duplicate — single pass O(N) time with O(N) Hash Set memory."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty / Single-element array*: If \`nums.length < 2\`, duplicates are impossible $\\rightarrow$ return \`false\`.
- *Space-Time Trade-off*: Sorting first costs $O(N \\log N)$ time but uses $O(1)$ space. Hash Set costs $O(N)$ time and $O(N)$ space. Always specify this trade-off during technical interviews.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why does using a Hash Set guarantee O(N) time complexity for Contains Duplicate?",
          options: [
            "Because Hash Sets sort the elements automatically upon insertion.",
            "Because Hash Set lookup and insertion take O(1) average time, making the single loop overall O(N).",
            "Because Hash Sets use two-pointer navigation internally.",
            "Because Hash Sets eliminate the need for memory allocation."
          ],
          correct_index: 1,
          model_answer: "A Hash Set uses hashing to index elements, allowing instantaneous O(1) checks. Traversing N elements performs N lookups, giving O(N) total time.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "If memory is extremely constrained (O(1) space limit), how would you solve Contains Duplicate and what is the time penalty?",
          model_answer: "Sort the array in-place first (O(N log N) time), then scan adjacent elements in one pass (O(N) time). The total time becomes O(N log N) while maintaining O(1) auxiliary space.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "valid-anagram",
      title: "Valid Anagram",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/is-anagram",
      summary: "Two words are anagrams when their letter histograms match — comparison by counting.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners often try to check if two strings are anagrams by checking if string \`s\` contains every letter of string \`t\` using string searching functions. 
*Why this shatters*: Counterexample: \`s = "aab"\` and \`t = "abb"\`. Both contain 'a' and 'b', but they are **not** anagrams! Order doesn't matter, but **character frequency (inventory)** must match perfectly.

**The Structural Invariant.** Two strings are anagrams if and only if their character frequency distributions (histograms) are identical.
- *Fixed Alphabet Optimization*: If strings consist only of lowercase English letters (\`'a'\` to \`'z'\`), an array of size 26 acts as a fast, zero-overhead hash map.
- *Single-Pass Balance Strategy*: Increment count for each character in \`s\`, decrement count for each character in \`t\`. If all 26 slots return to 0 at the end, they are anagrams.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 0, 0, 0, 0], "note": "Frequency array of size 26 (initialized to 0 for a, b, c, d, e...)" },
    { "cells": [2, 1, 0, 0, 0], "note": "After processing s = 'aab': count['a'] = 2, count['b'] = 1." },
    { "cells": [1, -1, 0, 0, 0], "highlight": [1], "note": "Processing t = 'abb': count['a'] drops to 1, count['b'] drops to -1 (negative count!)." },
    { "cells": [1, -1, 0, 0, 0], "note": "Early exit: count['b'] < 0 means 't' has more 'b's than 's' $\\rightarrow$ return false." }
  ],
  "caption": "Valid Anagram — frequency histogram increment/decrement with early exit."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Length Mismatch*: If \`s.length !== t.length\`, return \`false\` immediately in $O(1)$.
- *Unicode Support*: If inputs contain Unicode characters (beyond ASCII), a fixed-size 26-element array will overflow or throw index out-of-bounds. Upgrade to a standard \`Map<char, int>\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can an array of size 26 replace a Hash Map for Valid Anagram?",
          options: [
            "Because strings can never exceed 26 characters in length.",
            "Because lowercase English characters 'a'-'z' map directly to indices 0-25 using char code arithmetic ('c' - 'a').",
            "Because arrays automatically resize when new characters are added.",
            "Because sorting an array of size 26 takes O(1) time."
          ],
          correct_index: 1,
          model_answer: "For a bounded character set like 'a'-'z', array index offset `ch - 'a'` provides O(1) access without hash collision overhead or object allocations.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What changes if the problem states that the input strings can contain arbitrary Unicode characters?",
          model_answer: "The fixed array of size 26 is replaced with a Hash Map where keys are Unicode characters. Space complexity shifts from O(1) to O(K), where K is the number of distinct characters.",
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
      body: `**Beginner Intuition & The Naive Fallacy.** The brute-force approach tests all pairs using two nested loops: for each index $i$, scan all $j > i$ to check if \`nums[i] + nums[j] == target\`.
*Why this shatters*: This takes $O(N^2)$ time. If $N = 10,000$, it requires 50 million iterations!
*The Breakthrough*: When standing at number $x = \\text{nums}[i]$, you do not need to search for every other number. You are looking for one specific required partner: $\\text{complement} = \\text{target} - x$.

**The Structural Invariant.**
- *State Map*: Store mapping of \`{ number_value: index }\` for all numbers seen so far.
- *Order Invariant*: Check for \`complement\` in the hash map **before** inserting current number \`x\`. This guarantees you never pair an element with itself!

\`\`\`viz:array
{
  "frames": [
    { "cells": [3, 4, 5, 6], "pointers": [{ "label": "i=0 (x=3)", "index": 0 }], "note": "Target = 7. x=3 $\\rightarrow$ complement = 7-3 = 4. Map is {}. 4 not found. Map adds {3: 0}." },
    { "cells": [3, 4, 5, 6], "pointers": [{ "label": "i=1 (x=4)", "index": 1 }], "highlight": [0, 1], "note": "x=4 $\\rightarrow$ complement = 7-4 = 3. Map HAS key 3 at index 0! Return [0, 1]." }
  ],
  "caption": "Two Sum — single-pass complement lookup in O(N) time and O(N) space."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Duplicate Values*: What if \`nums = [3, 3]\` and \`target = 6\`? By checking for complement $6 - 3 = 3$ before inserting the second $3$, the map finds the first $3$ at index 0 and returns \`[0, 1]\` correctly.
- *Same Element Reuse*: Storing before checking would cause \`nums = [3]\`, \`target = 6\` to return \`[0, 0]\` (invalid!). The check-before-store order prevents this bug completely.`,
      questions: [
        {
          kind: "open",
          prompt: "In Two Sum, why do we store array values as keys and array indices as values in the Hash Map?",
          model_answer: "We need to perform O(1) lookups on the *value* of the complement (target - current). Hash maps lookup by key in O(1). Storing the index as the map value allows us to retrieve the required return indices instantly.",
          difficulty: "intermediate"
        },
        {
          kind: "mcq",
          prompt: "What happens if we insert the current element into the Hash Map BEFORE checking for the complement?",
          options: [
            "The algorithm runs faster because insertion happens immediately.",
            "It can incorrectly pair an element with itself if target == 2 * nums[i] (e.g., target=6, nums[0]=3 returning [0,0]).",
            "It causes a runtime null pointer exception.",
            "It degrades time complexity to O(N^2)."
          ],
          correct_index: 1,
          model_answer: "Inserting before checking allows an element to match with its own map entry, producing invalid single-element pairs.",
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
      body: `**The problem in one line.** You are given a list of words. Group together the ones that are anagrams of each other (same letters, any order). For \`["eat","tea","tan","ate","nat","bat"]\` the answer is \`[["eat","tea","ate"], ["tan","nat"], ["bat"]]\`.

**Beginner Intuition & The Naive Fallacy.** The obvious idea: take each word and compare it against every other word using an "is-anagram?" check, then glue the matches into groups.
*Why this shatters*: comparing $N$ words pairwise is $O(N^2 \\cdot K)$ (where $K$ is the longest word). At 10,000 words that is 100,000,000 comparisons — and you still have to manage which group each word already belongs to. The real problem is that you keep *re-deciding* sameness. You never write down a word's identity so you can look it up instantly.

**The key idea — a canonical signature.** Every set of anagrams shares one thing: the same multiset of letters. If we can turn a word into a **canonical fingerprint** that is identical for all its anagrams, then grouping becomes trivial — words with the same fingerprint go in the same bucket. A hash map does the bucketing for us in $O(1)$ per word:

> \`signature(word)  →  list of original words\`

There are two ways to build that fingerprint:

- **(a) Sort the letters.** \`sorted("eat") = "aet"\`, \`sorted("tea") = "aet"\`, \`sorted("ate") = "aet"\` — same key. Costs $O(K \\log K)$ per word.
- **(b) Count the letters (optimal).** Build a 26-slot count of the letters, then turn it into a string like \`"1#0#0#0#1#…#1"\` (one 'a', one 'e', one 't'). Costs $O(K)$ per word — no sorting.

**Building the count signature (step through it).** Below we build the fingerprint for \`"eat"\`. The three slots stand for the counts of \`a\`, \`e\`, \`t\`. \`"tea"\` and \`"ate"\` walk different orders but land on the exact same final counts — which is *why* they collide into one bucket.

\`\`\`viz:array
{
  "frames": [
    { "cells": [0, 0, 0], "note": "Signature = how many of each letter. Slots shown here: [a, e, t]. Start at all zeros." },
    { "cells": [0, 1, 0], "pointers": [{ "label": "read 'e'", "index": 1 }], "highlight": [1], "note": "First char of 'eat' is 'e' → bump the e-slot to 1." },
    { "cells": [1, 1, 0], "pointers": [{ "label": "read 'a'", "index": 0 }], "highlight": [0], "note": "Next char 'a' → bump the a-slot to 1." },
    { "cells": [1, 1, 1], "pointers": [{ "label": "read 't'", "index": 2 }], "highlight": [2], "note": "Last char 't' → key string becomes 'a1e1t1'. 'tea' and 'ate' produce this SAME key." }
  ],
  "caption": "Group Anagrams — the count signature is order-independent, so all anagrams share one key. (Real key uses all 26 letters.)"
}
\`\`\`

**Everything drops into its bucket.** Once each word owns a signature, one pass over the input is enough: compute the key, append the word to \`map[key]\`. Hover a word below to see which bucket it falls into.

\`\`\`viz:flow
{
  "nodes": [
    { "id": "eat", "label": "eat", "row": 0, "col": 0 },
    { "id": "tea", "label": "tea", "row": 1, "col": 0 },
    { "id": "ate", "label": "ate", "row": 2, "col": 0 },
    { "id": "tan", "label": "tan", "row": 3, "col": 0 },
    { "id": "nat", "label": "nat", "row": 4, "col": 0 },
    { "id": "key1", "label": "bucket a1e1t1", "row": 1, "col": 1 },
    { "id": "key2", "label": "bucket a1n1t1", "row": 3.5, "col": 1 }
  ],
  "edges": [
    { "from": "eat", "to": "key1" },
    { "from": "tea", "to": "key1" },
    { "from": "ate", "to": "key1" },
    { "from": "tan", "to": "key2" },
    { "from": "nat", "to": "key2" }
  ],
  "caption": "Strings map directly into canonical frequency buckets — same signature, same bucket."
}
\`\`\`

**The optimal solution (count-key, $O(N \\cdot K)$).**

\`\`\`python
def group_anagrams(words):
    buckets = {}                      # signature -> list of words
    for w in words:
        count = [0] * 26              # counts for 'a'..'z'
        for ch in w:
            count[ord(ch) - ord('a')] += 1
        key = "#".join(map(str, count))   # value-based, hashable key
        buckets.setdefault(key, []).append(w)
    return list(buckets.values())
\`\`\`

**Complexity — and why each approach costs what it does.**

\`\`\`viz:complexity
{
  "rows": [
    { "approach": "Brute force (pairwise anagram check)", "time": "O(N² · K)", "space": "O(N · K)", "note": "Re-checks sameness for every pair — quadratic blow-up." },
    { "approach": "Sort each word for the key", "time": "O(N · K log K)", "space": "O(N · K)", "note": "Simplest to write; sorting per word is the bottleneck." },
    { "approach": "Count signature (26-slot key)", "time": "O(N · K)", "space": "O(N · K)", "note": "Linear per word — no sort. Interview-optimal.", "best": true }
  ],
  "caption": "N = number of words, K = length of the longest word. Space stores every character across all buckets."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty strings*: \`[""]\` produces the all-zero key \`"0#0#…#0"\` and correctly returns \`[[""]]\`.
- *Hash key must compare by value*: in JavaScript and Python, arrays/lists compared as object keys use *reference* identity, so two identical count arrays are treated as different keys. Always serialise to a primitive (\`count.join("#")\` or a tuple) so the map buckets by value.
- *Uppercase / Unicode*: the 26-slot trick assumes lowercase \`a\`–\`z\`. For arbitrary characters, swap the fixed array for a \`Map<char, int>\` and build the key from its sorted entries.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the primary advantage of using a 26-element character count string over sorting each word in Group Anagrams?",
          options: [
            "It avoids creating a Hash Map.",
            "It reduces the per-word key generation time from O(K log K) to O(K).",
            "It uses less memory than an integer array.",
            "It allows the algorithm to work with integers."
          ],
          correct_index: 1,
          model_answer: "Counting character frequencies takes linear time O(K) per string, beating comparison-based sorting O(K log K) for long strings.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why can't we use a raw JavaScript Array `[1, 0, 1...]` directly as a Map key in JS?",
          model_answer: "In JavaScript, Objects and Maps compare object keys by reference identity, not value equality. Two identical arrays `[1, 0]` and `[1, 0]` are different object references. Converting to a primitive string key `\"1,0\"` ensures value-based hashing.",
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
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners count frequencies with a map, then sort the map entries by frequency descending.
*Why this shatters*: Sorting $U$ unique elements takes $O(U \\log U)$ time. If all elements are unique, this takes $O(N \\log N)$. The problem explicitly asks for a solution faster than $O(N \\log N)$!

**The Structural Invariant & Bucket Sort Discovery.**
- *Key Observation*: An element in an array of size $N$ can appear at most $N$ times. The frequencies are strictly bounded within the integer range $[1, N]$.
- *Bucket Array*: Create an array of buckets where \`bucket[freq]\` holds a list of numbers that appeared exactly \`freq\` times.
- *Reverse Sweep*: Iterate through \`bucket\` from index $N$ down to 1, collecting elements until $K$ elements are accumulated.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["freq 0", "freq 1", "freq 2", "freq 3"], "note": "Bucket array indexed by frequency 0..N (Array length N=6)." },
    { "cells": ["[]", "[3]", "[2]", "[1]"], "note": "Counts {1:3, 2:2, 3:1} placed in buckets: bucket[3]=[1], bucket[2]=[2], bucket[1]=[3]." },
    { "cells": ["[]", "[3]", "[2]", "[1]"], "highlight": [3, 2], "note": "Iterate backwards from max freq 3: collect 1, then 2. Collected K=2 elements $\\rightarrow$ [1, 2]." }
  ],
  "caption": "Top K Frequent Elements — Bucket sort in O(N) time without comparison sorting."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Negative Numbers & Large Values*: The Hash Map handles arbitrary values (even negative or huge numbers). Bucket indices only depend on **counts**, which are always positive integers $\\le N$.
- *Min-Heap Alternative*: A Min-Heap of size $K$ gives $O(N \\log K)$ time and $O(N)$ space — a great alternative when $K \\ll N$.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What property of frequency counts enables Bucket Sort to achieve O(N) time complexity in Top K Frequent Elements?",
          options: [
            "The values in the array are already sorted.",
            "The maximum frequency of any element cannot exceed N (the array length), bounding bucket indices to [1, N].",
            "Hash maps store keys in sorted order automatically.",
            "K is guaranteed to be less than 10."
          ],
          correct_index: 1,
          model_answer: "Because frequencies are bounded by N, we can index buckets directly by frequency, performing an O(N) bucket sweep instead of an O(N log N) sort.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "When would a Min-Heap approach (O(N log K)) be preferred over Bucket Sort (O(N))?",
          model_answer: "When streaming data where N is unknown or infinite, or when memory is limited and K is very small relative to N (saving allocation of N bucket lists).",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "encode-and-decode-strings",
      title: "Encode and Decode Strings",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/string-encode-and-decode",
      summary: "Length-prefix framing: the serialization trick real protocols use, in interview miniature.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners suggest joining strings with a delimiter like \`","\` or \`"#"\`.
*Why this shatters*: Counterexample: What if a string in the input list itself contains the delimiter, e.g., \`["hello#world", "test"]\`? Joining with \`"#"\` produces \`"hello#world#test"\`. The decoder cannot tell if \`"hello"\` and \`"world"\` were separate strings! Escaping delimiters adds complex edge-case bugs.

**The Structural Invariant: Length-Prefix Framing.** Real-world protocols (TCP, HTTP Content-Length, Protobuf) avoid delimiter ambiguity by putting **metadata (length) before payload**.
- *Format*: \`"<length>#<string_payload>"\` for each word.
- *Decoding Invariant*: Read digits until encountering \`'#'\`. Parse integer \`L\`. Read exactly the next \`L\` characters as verbatim payload string regardless of content, then jump index by \`L\`.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["4", "#", "c", "o", "d", "e", "5", "#", "w", "o", "r", "l", "d"], "pointers": [{ "label": "i=0", "index": 0 }], "note": "Read digits until '#': length L = 4." },
    { "cells": ["4", "#", "c", "o", "d", "e", "5", "#", "w", "o", "r", "l", "d"], "highlight": [2, 3, 4, 5], "note": "Read next L=4 chars: 'code'. Jump index past payload to i=6." },
    { "cells": ["4", "#", "c", "o", "d", "e", "5", "#", "w", "o", "r", "l", "d"], "pointers": [{ "label": "i=6", "index": 6 }], "note": "Read digits until '#': length L = 5." },
    { "cells": ["4", "#", "c", "o", "d", "e", "5", "#", "w", "o", "r", "l", "d"], "highlight": [8, 9, 10, 11, 12], "note": "Read next L=5 chars: 'world'. Decoded array: ['code', 'world']." }
  ],
  "caption": "Encode and Decode Strings — Length-prefix prevents delimiter collisions."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty Strings & Symbols*: \`["", "#", "12#ab"]\` encodes to \`"0##1##5#12#ab"\`. The decoder parses length \`0\`, skips 0 chars, parses length \`1\`, extracts \`"#"\`, parses length \`5\`, extracts \`"12#ab"\` perfectly!`,
      questions: [
        {
          kind: "open",
          prompt: "Why is the delimiter character '#' required after the length number in length-prefix encoding?",
          model_answer: "Because the length itself can be multi-digit (e.g., 12 vs 1). Without a delimiter terminating the length integer, '12ab' could be parsed as length 1 or length 12.",
          difficulty: "intermediate"
        },
        {
          kind: "mcq",
          prompt: "What is the time complexity to encode and decode a list of N strings with total length L?",
          options: [
            "O(N log N) time for sorting strings.",
            "O(L) time for encoding and O(L) time for decoding.",
            "O(N^2) time due to string slice operations.",
            "O(2^N) exponential time."
          ],
          correct_index: 1,
          model_answer: "Each character across all strings is processed a constant number of times during encoding and decoding, resulting in optimal O(L) linear time.",
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
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners calculate the total product of all elements in the array, then for each index $i$, divide \`total_product / nums[i]\`.
*Why this shatters*: 
1. The problem explicitly bans division!
2. *Division fails on Zeros*: If \`nums = [1, 0, 3]\`, total product is 0. Dividing by \`nums[1] = 0\` throws Division-By-Zero errors!

**The Structural Invariant: Prefix & Suffix Splitting.**
For any index $i$, the product of all elements except \`nums[i]\` equals:
$$\\text{Output}[i] = (\\text{product of all elements to the left of } i) \\times (\\text{product of all elements to the right of } i)$$
- *Left Sweep*: Build \`res[i]\` containing the cumulative product of elements from index $0$ to $i-1$.
- *Right Sweep*: Maintain a running \`postfix\` variable moving right-to-left, updating \`res[i] *= postfix\` in $O(1)$ extra space.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 2, 3, 4], "note": "Input array nums." },
    { "cells": [1, 1, 2, 6], "note": "Left Pass: res[i] holds prefix product of left elements. (res = [1, 1, 2, 6])" },
    { "cells": [24, 12, 8, 6], "highlight": [0, 1, 2, 3], "note": "Right Pass: multiply res[i] by running postfix (from right). Final res = [24, 12, 8, 6]." }
  ],
  "caption": "Product of Array Except Self — Prefix product pass followed by Suffix product pass."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Zeros in Array*:
  - Single zero (e.g., \`[1, 2, 0, 4]\`): Output at index of zero is $1 \\times 2 \\times 4 = 8$. All other indices become $0$.
  - Multiple zeros (e.g., \`[1, 0, 0, 4]\`): All output indices are $0$.
  - The prefix-suffix algorithm handles zero elements naturally without special-case branches!`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Product of Array Except Self, how is O(1) auxiliary space achieved while maintaining O(N) time?",
          options: [
            "By modifying the input array directly.",
            "By storing left prefix products directly inside the returned result array, and using a single running scalar variable for right suffix products.",
            "By using bitwise shift operations.",
            "By sorting the array in-place first."
          ],
          correct_index: 1,
          model_answer: "The output array does not count toward auxiliary space complexity per problem convention. Using a single scalar `postfix` variable during the second pass preserves O(1) extra space.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the result array for nums = [0, 4, 0] using the prefix/suffix multiplication approach?",
          model_answer: "res = [0, 0, 0]. For index 0, right product includes a 0. For index 1, left product has 0 and right has 0. For index 2, left product includes a 0. The output is correctly [0, 0, 0] without division by zero.",
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
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners think of validating Sudoku by running nested loops for each cell to scan its row, column, and 3x3 box.
*Why this shatters*: Scanning 27 cells for each of the 81 cells leads to redundant lookups ($81 \\times 27 \\approx 2,200$ checks).

**The Structural Invariant: 2D Multi-Set Encoding.** We can validate the entire board in a **single pass over the 81 cells**.
- Maintain 3 collections of Hash Sets:
  1. \`rows[r]\`: Hash set of numbers seen in row $r$ (0..8)
  2. \`cols[c]\`: Hash set of numbers seen in column $c$ (0..8)
  3. \`boxes[box_idx]\`: Hash set of numbers seen in 3x3 box \`box_idx\`
- *The Coordinate Trick*: Box index for cell $(r, c)$ is computed via integer division:
  $$\\text{box\\_idx} = (r // 3) \\times 3 + (c // 3)$$

\`\`\`viz:array
{
  "frames": [
    { "cells": ["r=4, c=7", "val = '6'", "box_idx = (4//3)*3 + (7//3) = 1*3 + 2 = 5"], "note": "Cell (4,7) contains '6'. Compute box index = 5." },
    { "cells": ["rows[4]: {}", "cols[7]: {}", "boxes[5]: {}"], "note": "Check if '6' is in rows[4], cols[7], or boxes[5]. All clear!" },
    { "cells": ["rows[4]: {'6'}", "cols[7]: {'6'}", "boxes[5]: {'6'}"], "highlight": [0, 1, 2], "note": "Add '6' to rows[4], cols[7], and boxes[5]. Proceed to next cell." }
  ],
  "caption": "Valid Sudoku — Single-pass validation using row, column, and sub-box hash sets."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty Cells (\`'.'\`)*: Ignore empty cells completely.
- *Validity vs Solvability*: Valid Sudoku only verifies that **current placed numbers do not violate rules**. It does NOT check if the puzzle has a valid complete solution (that requires Backtracking!).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Which formula correctly maps cell coordinates (row, col) to a unique 3x3 sub-box index from 0 to 8?",
          options: [
            "(row % 3) * 3 + (col % 3)",
            "Math.floor(row / 3) * 3 + Math.floor(col / 3)",
            "(row + col) / 3",
            "row * col % 9"
          ],
          correct_index: 1,
          model_answer: "Floor dividing row and col by 3 collapses grid coordinates into 3x3 blocks (0, 1, or 2). Multiplying the block row by 3 produces a unique 0-8 sub-box ID.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why does Valid Sudoku execute in O(1) time and O(1) space complexity?",
          model_answer: "Because the Sudoku board dimensions are fixed at 9x9 (81 cells). The number of operations and maximum stored set elements are bounded by constant upper limits.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "longest-consecutive-sequence",
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-consecutive-sequence",
      summary: "The set as teleporter: find runs of consecutive numbers in O(n), only ever counting from a run's true start.",
      body: `**Beginner Intuition & The Naive Fallacy.** The obvious approach is to sort the array, then scan for consecutive runs \`nums[i] == nums[i-1] + 1\`.
*Why this shatters*: Sorting takes $O(N \\log N)$ time. The problem explicitly requires $O(N)$ linear time!

**The Structural Invariant & Sequence Start Filtering.**
- Insert all elements into a Hash Set for $O(1)$ presence queries.
- *The Aha! Discovery*: A number $x$ is the **start of a sequence** if and only if $(x - 1)$ is **NOT** present in the Hash Set!
- If $(x - 1)$ exists in the set, skip $x$! An earlier start element will measure the sequence containing $x$.

\`\`\`viz:array
{
  "frames": [
    { "cells": [100, 4, 200, 1, 3, 2], "note": "Set: {100, 4, 200, 1, 3, 2}. Scan elements..." },
    { "cells": [100, 4, 200, 1, 3, 2], "pointers": [{ "label": "x=100", "index": 0 }], "note": "99 in set? NO $\\rightarrow$ x=100 is a sequence start. Length = 1." },
    { "cells": [100, 4, 200, 1, 3, 2], "pointers": [{ "label": "x=4", "index": 1 }], "note": "3 in set? YES $\\rightarrow$ Skip! (3 will be handled when walking from 1)." },
    { "cells": [100, 4, 200, 1, 3, 2], "pointers": [{ "label": "x=1", "index": 3 }], "highlight": [1, 3, 4, 5], "note": "0 in set? NO $\\rightarrow$ Start at 1. Count 1, 2, 3, 4 $\\rightarrow$ Max Length = 4." }
  ],
  "caption": "Longest Consecutive Sequence — Only sequence start elements initiate linear counting."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Why it is strictly $O(N)$*: Although there is a nested \`while\` loop inside the \`for\` loop, the \`while\` loop ONLY runs for sequence starts. Each number in the array is visited at most twice (once in the outer loop, once in the inner \`while\` loop). Amortized time is strictly $O(N)$.
- *Duplicates*: Hash Set automatically eliminates duplicate numbers, so \`[1, 2, 0, 1]\` works smoothly without infinite loops.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does the algorithm prevent O(N^2) behavior in Longest Consecutive Sequence?",
          options: [
            "By sorting the array before checking elements.",
            "By only initiating the sequence counting loop if (num - 1) is NOT in the hash set.",
            "By using a binary search tree instead of a hash set.",
            "By limiting the search to positive numbers."
          ],
          correct_index: 1,
          model_answer: "Checking `!set.has(num - 1)` ensures that sequence counting is executed strictly from the beginning of each sequence, visiting each number at most twice overall.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What would happen if we removed the `!set.has(num - 1)` check and counted sequences from every number?",
          model_answer: "For an array like [1, 2, 3, 4, 5], number 1 would count 5 steps, number 2 would count 4 steps, number 3 would count 3 steps... leading to O(N^2) quadratic time complexity.",
          difficulty: "advanced"
        }
      ]
    }
  ]
};
