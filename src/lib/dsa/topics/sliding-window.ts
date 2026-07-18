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
      body: `**The problem.** Prices of a stock, one per day. Buy once, sell once, sell after you buy. Maximise profit; if no profit is possible, answer zero. Prices [7,1,5,3,6,4] → buy at 1, sell at 6, profit 5.

**The naive move.** Every buy day × every later sell day: O(n²). And as always in this atlas, name the waste before fixing it: when you evaluate selling on day j, the *best buy before j* is a fact you could have carried with you — recomputing it per j is the crime.

**The insight.** Walk the days once, carrying exactly one piece of state: the lowest price seen so far. Each new day asks a single question — *if I sold today, having bought at that lowest price, what is my profit?* — and updates two things: the best profit ever seen, and (if today is cheaper) the running minimum. Selling-after-buying is guaranteed by construction, because the minimum you compare against always came from the past.

**The window view.** You can also read this as the chapter's opening window: left edge pinned to the cheapest day so far, right edge sweeping forward. When a new price undercuts the old minimum, the left edge *jumps* forward to it — the window resets its anchor. Either mental model compiles to the identical four-line loop; having both matters more than either alone, because the next five problems all speak the window dialect.

**The walk-through.** [7,1,5,3,6,4]: min 7, profit 0 → day 1: min drops to 1 → day 5: 5−1=4, best 4 → day 3: nothing → day 6: 6−1=5, best 5 → day 4: nothing. Answer 5.

**Complexity.** O(n) time, O(1) space — the floor for any problem that must at least read its input.

**The thread.** The state here was a single number. Next problem, the window must remember *which characters it contains* — the state grows into a set, and for the first time the left edge has to walk, not jump.`,
    },
    {
      slug: "longest-substring-without-repeating-characters",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-substring-without-duplicates",
      summary: "The canonical elastic window: expand right, evict from the left until the duplicate is gone.",
      body: `**The problem.** Longest run of a string with no repeated character. In "abcabcbb" it is "abc", length 3.

**The insight.** A window is *valid* when every character inside it is distinct — a fact a hash set tracks perfectly. The loop is the chapter's template in its purest form. The right edge advances one character per step. If the incoming character is already in the set, the window has broken — so evict from the *left*, one character at a time, until the earlier copy of the offender is gone. Then admit the new character and measure.

**Why the left edge never backtracks.** The tempting wrong instinct is that after a duplicate you should restart just past the first offender — and the eviction loop does exactly that, but *incrementally*, without ever re-scanning. Each character enters the set once and is evicted at most once; the two edges together take at most 2n steps. That amortised bound is the whole magic, and saying "each element enters once and leaves once, so it is O(n)" out loud is precisely what the interviewer is listening for.

**The walk-through.** "abcabcbb": window grows a→ab→abc (length 3, record). Next a collides: evict a from the left, admit the new a — window bca. Then b collides: evict b, admit — cab. Then c: abc again. Then b: evict until the old b leaves (window shrinks to cb→b… evict c, evict a — careful, evictions come from the left in order), admit b. Final answer stays 3.

**A polish worth knowing.** Storing each character's *last index* in a map lets the left edge jump directly past the stale copy instead of stepping — same complexity, fewer moves, and a nice thing to mention as a refinement rather than lead with.

**Complexity.** O(n) time, O(min(n, alphabet)) space.

**The thread.** Here, one duplicate broke the window outright. The next problem softens the rule: the window may contain flaws — up to k of them — and validity becomes an *inequality* over the counts the window carries.`,
    },
    {
      slug: "longest-repeating-character-replacement",
      title: "Longest Repeating Character Replacement",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-repeating-substring-with-replacement",
      summary: "Window valid while size − max frequency ≤ k — plus the ratchet trick that never lowers the max.",
      body: `**The problem.** A string and a budget k: you may repaint up to k characters. What is the longest run you could turn into a single repeated letter? "AABABBA" with k=1 → 4 (repaint one B inside AABA… to get AAAA).

**The insight.** Ask what makes a window *fixable*. Keep the letter that already dominates it and repaint everyone else; the repaint bill is window size minus the count of the most frequent letter. So the validity test is one inequality: **size − maxFreq ≤ k**. Maintain per-letter counts as the edges move, expand right each step, and when the inequality breaks, shift left by one (shrinking the window back to legal size). Record the best size seen.

**The ratchet.** Maintaining maxFreq exactly would mean rescanning 26 counts whenever the letter that held the max leaves the window. The professional trick: *don't bother*. Let maxFreq be stale — only ever raise it, never recompute downward. Why is that sound? Because the answer only improves when a **longer** valid window appears, and a longer valid window requires a *higher* max frequency than any before (the inequality says so: size grows only if maxFreq grows with it). A stale, too-high maxFreq can make the test overly generous for a while — the window lingers at its record size instead of shrinking further — but it can never mint a new record that is false. The best answer recorded is still exact.

**The walk-through.** "AABABBA", k=1. Window swallows AABA: size 4, maxFreq 3 (A), 4−3 ≤ 1 → valid, record 4. Right edge brings the next B: size 5, cost 2 > 1 → broken; left steps once. The window slides on, never validly exceeding 4. Answer 4.

**Complexity.** O(n) time, O(26) space. With the ratchet, each step is O(1); without it, O(26) per step — also fine, and worth offering as the simpler-to-defend version.

**The thread.** Both problems so far let the window stretch freely. Next, Permutation in String *fixes* the window's length exactly — and validity becomes histogram equality, checked incrementally.`,
    },
    {
      slug: "permutation-in-string",
      title: "Permutation in String",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/permutation-string",
      summary: "A fixed-size window sliding one step at a time, comparing letter histograms as it goes.",
      body: `**The problem.** Does string s2 contain any permutation of s1 as a contiguous substring? s1 = "ab", s2 = "eidbaooo" → yes ("ba").

**The insight.** A permutation of s1 is any substring with *exactly s1's letter histogram* — order irrelevant, inventory identical. That is the canonical-form idea from Valid Anagram, now hunted through a longer string. And since every candidate has exactly length |s1|, this is the **fixed-size** window variant: no elastic left edge deciding when to shrink — the left edge is always precisely windowSize behind the right. Each slide admits one character and expels one, and each of those is a ±1 on a 26-slot count array.

**Making the comparison cheap.** Comparing two 26-slot histograms per slide is O(26) — honestly fine, and the version to write first. The refinement interviewers enjoy: track a single integer, *matches*, counting how many of the 26 letters currently have equal counts in both histograms. When a slide increments or decrements a slot, only that letter's equality status can change, so matches updates in O(1); the window is a hit exactly when matches is 26. Same asymptotics, constant-factor elegance — mention it, don't die for it.

**The walk-through.** s1 = "ab" (a:1, b:1). Slide a length-2 window over "eidbaooo": "ei", "id", "db" — no. "ba" — histogram a:1, b:1 — match, return true. The expelled and admitted characters were the only updates ever made; nothing inside a window was recounted.

**Complexity.** O(n) time over s2's length, O(26) space. Brute force — sort every substring of length |s1| — would be O(n · k log k) and is worth naming only to bury.

**The thread.** You now have elastic windows and fixed windows. Minimum Window Substring, next, is the pattern's summit: an elastic window whose objective *inverts* — instead of the longest window that stays legal, the shortest one that achieves coverage.`,
    },
    {
      slug: "minimum-window-substring",
      title: "Minimum Window Substring",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/minimum-window-with-characters",
      summary: "Expand until you cover, contract while you still cover — the inverted window at full power.",
      body: `**The problem.** Given strings s and t, find the smallest window of s containing every character of t, multiplicities included. s = "ADOBECODEBANC", t = "ABC" → "BANC".

**The inversion.** Every window so far grew while valid and shrank when broken. Here validity — *covering all of t* — is something you push toward, then squeeze: the right edge expands until the window first covers t, and then, while coverage holds, the left edge contracts to make the window as tight as possible, recording each size along the way. Losing coverage hands control back to the right edge. Expand to satisfy, contract to optimise: that two-phase heartbeat is the whole algorithm.

**The state.** Two count maps and one integer. *Need* holds t's histogram. *Have* holds the window's counts of needed characters. The integer, usually called *formed* or *have-count*, tracks how many distinct characters currently meet their full quota — so "is the window covering?" is an O(1) comparison against the number of distinct characters t requires, not a map scan. It updates only at the moment a character's count crosses its quota, entering or leaving. Getting that crossing logic exactly right (increments past the quota do not re-count) is where implementations live or die.

**The walk-through.** Expanding across "ADOBEC" achieves the first coverage (A, B, C present). Contract: dropping A breaks it — record "ADOBEC" (6) and expand on. Coverage returns at "…CODEBA"; contraction squeezes to "CODEBA" → smaller candidates as D, O fall away… the dance continues until "BANC" (4) is recorded. Each character of s entered the window once and left at most once, no matter how many times control changed hands.

**Complexity.** O(|s| + |t|) time, O(alphabet) space — for a problem whose brute force checks O(n²) substrings with an O(n) verification each.

**The thread.** One problem remains, and it changes what the window must *remember*: not counts, but a maximum — which crumbles when its holder leaves. Enter the monotonic deque.`,
    },
    {
      slug: "sliding-window-maximum",
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/sliding-window-maximum",
      summary: "A deque of the undefeated: keep candidates in decreasing order and the window max is always at the front.",
      body: `**The problem.** For every k-length window of an array, report the maximum. [1,3,-1,-3,5,3,6,7], k=3 → [3,3,5,5,6,7].

**Why counts stop working.** Maintaining a max incrementally has an asymmetry: an *arriving* large element updates it in O(1), but when the current max *departs* out the left edge, the window must somehow know the runner-up — and the runner-up's runner-up, all the way down. A count map cannot say who is next. You need a structure that remembers exactly the chain of succession.

**The insight.** Watch who can never matter. When a new element arrives, every element in the window that is *smaller and older* is finished — it exits earlier than the newcomer and is dominated while they coexist, so it cannot be the maximum of any future window. Discard such elements permanently. What survives is a deque of indices whose values are strictly decreasing: the reigning max at the front, then the element that becomes max when the front expires, and so on — a line of heirs. Per step: pop the front if it slid out of the window; pop smaller elements off the *back* before pushing the newcomer; read the answer at the front.

**The walk-through.** [1,3,-1,-3,5,3,6,7], k=3. 1 arrives; 3 arrives and evicts 1 (smaller, older — dead forever); -1 queues behind 3. Window full: front says 3. Slide: -3 queues (deque 3,-1,-3) → 3. Slide: 5 arrives and clears the entire deque → 5. Then 3 queues behind 5 → 5. Then 6 clears both → 6. Then 7 clears 6 → 7. Output [3,3,5,5,6,7].

**Complexity.** Each index is pushed once and popped at most once — O(n) total, O(k) space. The heap alternative gives O(n log n) with lazy deletions; the deque is strictly better here and the succession-line intuition is why.

**The thread.** That "discard the dominated" move is bigger than this problem — it is the *monotonic* principle, and next chapter it reappears standing up instead of sliding: the stack, where order of arrival becomes the structure itself.`,
    },
  ],
};
