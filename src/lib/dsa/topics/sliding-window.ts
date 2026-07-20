import type { DsaTopic } from "../types";

/** Chapter 3 — Sliding Window: two pointers, same direction, living state between them. */
export const slidingWindow: DsaTopic = {
  slug: "sliding-window",
  title: "Sliding Window",
  chapter: 3,
  tagline: "A stretch of the array that grows, shrinks, and never looks at anything twice.",
  color: "#ff7a5c",
  prereqs: ["two-pointers"],
  unlocks: [],
  intro: `Take the two pointers from last chapter and change one thing: instead of converging from opposite ends, both now march *rightward*, with the right pointer leading and the left one following. The stretch between them is the window — a candidate answer that is alive, growing when the right edge eats a new element and shrinking when the left edge lets one go.

Why does this deserve its own chapter? Because of what it kills. An enormous family of problems asks about "the best contiguous run": the longest substring with some property, the smallest subarray covering some requirement, the maximum over every k-length stretch. Brute force re-examines every one of the O(n²) ranges from scratch. The window's discipline is *incremental maintenance*: when the window moves one step, you do not recompute its contents — you update a small summary (a count map, a max frequency, a deque) by exactly the one element that entered and the one that left. Every element enters the window once and leaves at most once, and O(n²) collapses to O(n). That amortised argument is this chapter's version of "retire a candidate forever," and interviewers will ask you to say it aloud.

The rhythm of the standard loop never changes — expand right; while the window is broken (or as long as it can be improved), contract left; record. What changes per problem is a single question: **what state must the window carry to know, cheaply, whether it is valid?** Best Time to Buy and Sell Stock starts with the thinnest possible state, a running minimum. Longest Substring Without Repeating Characters carries a set. Longest Repeating Character Replacement carries counts plus one clever ratchet. Permutation in String fixes the window's size and compares histograms. Minimum Window Substring — the boss — flips the objective from longest-valid to *shortest*-satisfying. And Sliding Window Maximum ends the chapter with the monotonic deque, a data structure you will meet again wearing a stack costume next chapter.

Sliding Window has no children on the roadmap — it is a leaf, a finishing move. But the incremental-maintenance instinct it drills stays with you for every chapter after.`,
  problems: [
    {
      slug: "best-time-to-buy-and-sell-stock",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      neetcodeUrl: "https://neetcode.io/problems/buy-and-sell-crypto",
      summary: "One pass, one running minimum: the lightest state a window can carry.",
      body: `**Signal.** "Buy once, sell once, sell after you buy, maximise profit" over a sequence of prices — a single pass where each answer depends only on the best thing seen *so far* is the tell for a running-state window, no data structure required.

**Brute force.** Every buy day × every later sell day: O(n²) time, O(1) space. Name the waste before fixing it: when you evaluate selling on day j, the *best buy before j* is a fact you could have carried with you — recomputing it per j is the crime.

**Optimal approach.** Walk the days once, carrying exactly one piece of state: the lowest price seen so far. Each new day asks a single question — *if I sold today, having bought at that lowest price, what is my profit?* — and updates two things: the best profit ever seen, and (if today is cheaper) the running minimum. Selling-after-buying is guaranteed by construction, because the minimum you compare against always came from the past. You can also read this as the chapter's opening window: left edge pinned to the cheapest day so far, right edge sweeping forward. When a new price undercuts the old minimum, the left edge *jumps* forward to it — the window resets its anchor. Either mental model compiles to the identical four-line loop; having both matters more than either alone, because the next five problems all speak the window dialect.

\`\`\`viz:array
{
  "frames": [
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min", "index": 0 }, { "label": "i", "index": 0 }], "note": "i = min = 0. Baseline price 7, profit 0." },
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min", "index": 1 }, { "label": "i", "index": 1 }], "note": "Price 1 undercuts the running min — min jumps to index 1." },
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min", "index": 1 }, { "label": "i", "index": 2 }], "highlight": [1, 2], "note": "Price 5: profit = 5 - 1 = 4. New best." },
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min", "index": 1 }, { "label": "i", "index": 3 }], "note": "Price 3: profit would be 2 - worse than 4. Skip." },
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min", "index": 1 }, { "label": "i", "index": 4 }], "highlight": [1, 4], "note": "Price 6: profit = 6 - 1 = 5. New best." },
    { "cells": [7, 1, 5, 3, 6, 4], "pointers": [{ "label": "min", "index": 1 }, { "label": "i", "index": 5 }], "note": "Price 4: profit would be 3 - worse than 5. Final answer: 5." }
  ],
  "caption": "Best Time to Buy and Sell Stock — min jumps to every new low; i sweeps right pricing a sale against it."
}
\`\`\`

**Complexity.** O(n) time, O(1) space — the floor for any problem that must at least read its input, versus the O(n²) brute force.

**Thread.** The state here was a single number. Next problem, the window must remember *which characters it contains* — the state grows into a set, and for the first time the left edge has to walk, not jump.`,
    },
    {
      slug: "longest-substring-without-repeating-characters",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-substring-without-duplicates",
      summary: "The canonical elastic window: expand right, evict from the left until the duplicate is gone.",
      body: `**Signal.** "Longest run of a string with no repeated character" — a *contiguous* run maximized subject to a distinctness constraint is the chapter's purest template: expand right, and evict from the left the moment the constraint breaks.

**Brute force.** Check every substring for duplicate characters — O(n²) or O(n³) depending on how the duplicate check is done — recomputing distinctness from scratch for every starting point, even though almost all of that work was already done for the previous start.

**Optimal approach.** A window is *valid* when every character inside it is distinct — a fact a hash set tracks perfectly. The right edge advances one character per step. If the incoming character is already in the set, the window has broken — so evict from the *left*, one character at a time, until the earlier copy of the offender is gone. Then admit the new character and measure. The tempting wrong instinct is that after a duplicate you should restart just past the first offender — and the eviction loop does exactly that, but *incrementally*, without ever re-scanning. Each character enters the set once and is evicted at most once; the two edges together take at most 2n steps. That amortised bound is the whole magic, and saying "each element enters once and leaves once, so it is O(n)" out loud is precisely what the interviewer is listening for.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["a", "b", "c", "a", "b", "c", "b", "b"], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 2 }], "highlight": [0, 1, 2], "note": "Window grows admitting a, b, c -> [a,b,c], length 3. New record." },
    { "cells": ["a", "b", "c", "a", "b", "c", "b", "b"], "pointers": [{ "label": "L", "index": 1 }, { "label": "R", "index": 3 }], "highlight": [1, 2, 3], "note": "R hits 'a' again (index 3) - duplicate. Evict a (index 0). Window [b,c,a], length 3." },
    { "cells": ["a", "b", "c", "a", "b", "c", "b", "b"], "pointers": [{ "label": "L", "index": 2 }, { "label": "R", "index": 4 }], "highlight": [2, 3, 4], "note": "R hits 'b' again (index 4) - duplicate. Evict b (index 1). Window [c,a,b], length 3." },
    { "cells": ["a", "b", "c", "a", "b", "c", "b", "b"], "pointers": [{ "label": "L", "index": 3 }, { "label": "R", "index": 5 }], "highlight": [3, 4, 5], "note": "R hits 'c' again (index 5) - duplicate. Evict c (index 2). Window [a,b,c], length 3 again." },
    { "cells": ["a", "b", "c", "a", "b", "c", "b", "b"], "pointers": [{ "label": "L", "index": 5 }, { "label": "R", "index": 6 }], "highlight": [5, 6], "note": "R hits 'b' again (index 6) - duplicate. Evict a (index 3), then b (index 4) - two evictions. Window [c,b], length 2." },
    { "cells": ["a", "b", "c", "a", "b", "c", "b", "b"], "pointers": [{ "label": "L", "index": 7 }, { "label": "R", "index": 7 }], "highlight": [7], "note": "R hits the final 'b' (index 7) - duplicate. Evict c (index 5), then b (index 6). Window [b], length 1. Longest recorded stays 3." }
  ],
  "caption": "Longest Substring Without Repeating Characters — L and R bound the window; every duplicate evicts from the left until the offender is gone."
}
\`\`\`

**A polish worth knowing.** Storing each character's *last index* in a map lets the left edge jump directly past the stale copy instead of stepping — same complexity, fewer moves, and a nice thing to mention as a refinement rather than lead with.

**Complexity.** O(n) time, O(min(n, alphabet)) space — versus the O(n²)-or-worse brute force.

**Thread.** Here, one duplicate broke the window outright. The next problem softens the rule: the window may contain flaws — up to k of them — and validity becomes an *inequality* over the counts the window carries.`,
    },
    {
      slug: "longest-repeating-character-replacement",
      title: "Longest Repeating Character Replacement",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-repeating-substring-with-replacement",
      summary: "Window valid while size − max frequency ≤ k — plus the ratchet trick that never lowers the max.",
      body: `**Signal.** "You may repaint up to k characters — what's the longest run you could turn into a single repeated letter" — a budget k tolerating up to k "flaws" inside the window, rather than demanding perfection, is the tell that validity becomes an inequality over counts, not a strict membership test.

**Brute force.** Check every substring, count its most frequent letter, and test size − maxFreq ≤ k directly — O(n²) or O(n³) depending on how the count is refreshed per substring, redoing work the window could carry forward instead.

**Optimal approach.** Ask what makes a window *fixable*. Keep the letter that already dominates it and repaint everyone else; the repaint bill is window size minus the count of the most frequent letter. So the validity test is one inequality: **size − maxFreq ≤ k**. Maintain per-letter counts as the edges move, expand right each step, and when the inequality breaks, shift left by one (shrinking the window back to legal size). Record the best size seen. The professional refinement — the ratchet: maintaining maxFreq exactly would mean rescanning 26 counts whenever the letter that held the max leaves the window. Instead, let maxFreq be stale — only ever raise it, never recompute downward. This is sound because the answer only improves when a **longer** valid window appears, and a longer valid window requires a *higher* max frequency than any before. A stale, too-high maxFreq can make the test overly generous for a while — the window lingers at its record size instead of shrinking further — but it can never mint a false record. The best answer recorded stays exact.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["A", "A", "B", "A", "B", "B", "A"], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 3 }], "highlight": [0, 1, 2, 3], "note": "Window \\"AABA\\": size 4, maxFreq 3 (A). 4-3=1 <= k -> valid. Record 4." },
    { "cells": ["A", "A", "B", "A", "B", "B", "A"], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 4 }], "note": "R admits B (index 4): size 5, cost = 5-3 = 2 > k -> broken." },
    { "cells": ["A", "A", "B", "A", "B", "B", "A"], "pointers": [{ "label": "L", "index": 1 }, { "label": "R", "index": 4 }], "highlight": [1, 2, 3, 4], "note": "Shrink left by one (drop index 0's A): window \\"ABAB\\", size 4. maxFreq stays stale at 3 (ratchet) -> 4-3=1<=k, valid again. Record stays 4 for the rest of the string." }
  ],
  "caption": "Longest Repeating Character Replacement — the window never shrinks below its record size; a stale maxFreq only ever makes the test too generous, never wrong."
}
\`\`\`

**Complexity.** O(n) time, O(26) space — versus the brute force's O(n²) or worse. With the ratchet, each step is O(1); without it, O(26) per step — also fine, and worth offering as the simpler-to-defend version.

**Thread.** Both problems so far let the window stretch freely. Next, Permutation in String *fixes* the window's length exactly — and validity becomes histogram equality, checked incrementally.`,
    },
    {
      slug: "permutation-in-string",
      title: "Permutation in String",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/permutation-string",
      summary: "A fixed-size window sliding one step at a time, comparing letter histograms as it goes.",
      body: `**Signal.** "Does s2 contain any permutation of s1" — a permutation match with a length pinned to |s1| exactly is the tell for a **fixed-size** window: no decision about when to shrink, since the left edge is always precisely windowSize behind the right.

**Brute force.** Extract every length-|s1| substring of s2, sort it and sort s1, and compare — O(n · k log k) for n starting positions each costing O(k log k) to sort a window of size k. Worth naming only to set up why it's beatable.

**Optimal approach.** A permutation of s1 is any substring with *exactly s1's letter histogram* — order irrelevant, inventory identical. That is the canonical-form idea from Valid Anagram, now hunted through a longer string. Since every candidate has exactly length |s1|, each slide admits one character and expels one, and each of those is a ±1 on a 26-slot count array — no resorting, no rescanning. Comparing two 26-slot histograms per slide is O(26) — honestly fine, and the version to write first. The refinement interviewers enjoy: track a single integer, *matches*, counting how many of the 26 letters currently have equal counts in both histograms. When a slide increments or decrements a slot, only that letter's equality status can change, so matches updates in O(1); the window is a hit exactly when matches is 26.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["e", "i", "d", "b", "a", "o", "o", "o"], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 1 }], "note": "Window \\"ei\\": histogram {e:1,i:1} vs needed {a:1,b:1} -> no match." },
    { "cells": ["e", "i", "d", "b", "a", "o", "o", "o"], "pointers": [{ "label": "L", "index": 1 }, { "label": "R", "index": 2 }], "note": "Window \\"id\\": slide by one, expel e, admit d -> still no match." },
    { "cells": ["e", "i", "d", "b", "a", "o", "o", "o"], "pointers": [{ "label": "L", "index": 2 }, { "label": "R", "index": 3 }], "note": "Window \\"db\\": expel i, admit b -> no match." },
    { "cells": ["e", "i", "d", "b", "a", "o", "o", "o"], "pointers": [{ "label": "L", "index": 3 }, { "label": "R", "index": 4 }], "highlight": [3, 4], "note": "Window \\"ba\\": expel d, admit a -> histogram {a:1,b:1} matches s1 exactly. Found — return true." }
  ],
  "caption": "Permutation in String — a fixed-size window slides one character at a time; only the expelled and admitted letters ever update the histogram."
}
\`\`\`

**Complexity.** O(n) time over s2's length, O(26) space — versus the brute force's O(n · k log k).

**Thread.** You now have elastic windows and fixed windows. Minimum Window Substring, next, is the pattern's summit: an elastic window whose objective *inverts* — instead of the longest window that stays legal, the shortest one that achieves coverage.`,
    },
    {
      slug: "minimum-window-substring",
      title: "Minimum Window Substring",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/minimum-window-with-characters",
      summary: "Expand until you cover, contract while you still cover — the inverted window at full power.",
      body: `**Signal.** "Find the smallest window of s containing every character of t" — *smallest* satisfying, not longest valid, is the tell that this is the inverted window: expand to satisfy a requirement, then contract to optimise it.

**Brute force.** Check every substring of s for coverage of t's histogram — O(n²) substrings, each needing an O(n) verification pass. O(n³) altogether, redoing the coverage check from scratch for every window.

**Optimal approach (the inversion).** Every window so far grew while valid and shrank when broken. Here validity — *covering all of t* — is something you push toward, then squeeze: the right edge expands until the window first covers t, and then, while coverage holds, the left edge contracts to make the window as tight as possible, recording each size along the way. Losing coverage hands control back to the right edge. Expand to satisfy, contract to optimise: that two-phase heartbeat is the whole algorithm. The state is two count maps and one integer: *need* holds t's histogram, *have* holds the window's counts of needed characters, and an integer usually called *formed* tracks how many distinct characters currently meet their full quota — so "is the window covering?" is an O(1) comparison, not a map scan. It updates only at the moment a character's count crosses its quota, entering or leaving.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 5 }], "highlight": [0, 3, 5], "note": "Right edge expands until every character of t is covered: window \\"ADOBEC\\" (0-5). Record size 6." },
    { "cells": ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"], "pointers": [{ "label": "L", "index": 1 }, { "label": "R", "index": 5 }], "note": "Try contracting: dropping the A at index 0 would break coverage (need A >= 1). Contraction stops here; expand again." },
    { "cells": ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"], "pointers": [{ "label": "L", "index": 9 }, { "label": "R", "index": 12 }], "highlight": [9, 10, 11, 12], "note": "After more expand/contract cycles, the window tightens to \\"BANC\\" (9-12), size 4 — covers A, B, C with nothing to spare. Final answer." }
  ],
  "caption": "Minimum Window Substring — expand to cover, contract to tighten; each character of s enters the window once and leaves at most once regardless of how many cycles run."
}
\`\`\`

**Complexity.** O(|s| + |t|) time, O(alphabet) space — versus the brute force's O(n³).

**Thread.** One problem remains, and it changes what the window must *remember*: not counts, but a maximum — which crumbles when its holder leaves. Enter the monotonic deque.`,
    },
    {
      slug: "sliding-window-maximum",
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/sliding-window-maximum",
      summary: "A deque of the undefeated: keep candidates in decreasing order and the window max is always at the front.",
      body: `**Signal.** "For every k-length window, report the maximum" — a running maximum that must survive elements *leaving* the window (not just arriving) is the tell that a plain running-max variable or count map won't work; you need a structure that remembers the whole chain of succession.

**Brute force.** Scan all k elements of every window to find its max — O(n·k) time, degrading to O(n²) when k is a fraction of n. Every window re-derives a max that overlaps almost entirely with its neighbour's.

**Optimal approach.** Maintaining a max incrementally has an asymmetry: an *arriving* large element updates it in O(1), but when the current max *departs* out the left edge, the window must somehow know the runner-up — and the runner-up's runner-up, all the way down. Watch who can never matter: when a new element arrives, every element in the window that is *smaller and older* is finished — it exits earlier than the newcomer and is dominated while they coexist, so it cannot be the maximum of any future window. Discard such elements permanently. What survives is a deque of indices whose values are strictly decreasing: the reigning max at the front, then the element that becomes max when the front expires, and so on — a line of heirs. Per step: pop the front if it slid out of the window; pop smaller elements off the *back* before pushing the newcomer; read the answer at the front.

\`\`\`viz:array
{
  "frames": [
    { "cells": [1, 3, -1, -3, 5, 3, 6, 7], "pointers": [{ "label": "L", "index": 0 }, { "label": "R", "index": 2 }], "highlight": [1], "note": "Window [1,3,-1]. Deque holds index 1 (value 3) at the front. Max: 3." },
    { "cells": [1, 3, -1, -3, 5, 3, 6, 7], "pointers": [{ "label": "L", "index": 1 }, { "label": "R", "index": 3 }], "highlight": [1], "note": "Window [3,-1,-3]. -3 joins the deque behind -1 without evicting anyone. Max stays 3." },
    { "cells": [1, 3, -1, -3, 5, 3, 6, 7], "pointers": [{ "label": "L", "index": 2 }, { "label": "R", "index": 4 }], "highlight": [4], "note": "Window [-1,-3,5]. 5 evicts the entire deque (smaller and older). New max: 5." },
    { "cells": [1, 3, -1, -3, 5, 3, 6, 7], "pointers": [{ "label": "L", "index": 3 }, { "label": "R", "index": 5 }], "highlight": [4], "note": "Window [-3,5,3]. 3 joins behind 5 without evicting it. Max stays 5." },
    { "cells": [1, 3, -1, -3, 5, 3, 6, 7], "pointers": [{ "label": "L", "index": 4 }, { "label": "R", "index": 6 }], "highlight": [6], "note": "Window [5,3,6]. 6 evicts both 3 and 5 from the deque. New max: 6." },
    { "cells": [1, 3, -1, -3, 5, 3, 6, 7], "pointers": [{ "label": "L", "index": 5 }, { "label": "R", "index": 7 }], "highlight": [7], "note": "Window [3,6,7]. 7 evicts 6. New max: 7. Output: [3,3,5,5,6,7]." }
  ],
  "caption": "Sliding Window Maximum — L/R mark the window; the highlighted cell is the deque's front (the current max), updated by evicting dominated elements as the window slides."
}
\`\`\`

**Complexity.** Each index is pushed once and popped at most once — O(n) total, O(k) space, versus the O(n·k) brute force. The heap alternative gives O(n log n) with lazy deletions; the deque is strictly better here and the succession-line intuition is why.

**Thread.** That "discard the dominated" move is bigger than this problem — it is the *monotonic* principle, and next chapter it reappears standing up instead of sliding: the stack, where order of arrival becomes the structure itself.`,
    },
  ],
};
