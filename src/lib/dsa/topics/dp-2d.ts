import type { DsaTopic } from "../types";

/** Chapter 14 — 2-D Dynamic Programming: states with two coordinates. */
export const dp2d: DsaTopic = {
  slug: "dp-2d",
  title: "2-D Dynamic Programming",
  chapter: 14,
  tagline: "Two strings, two choices, or a grid — when one index cannot describe where you stand.",
  color: "#6fdfa8",
  prereqs: ["graphs", "dp-1d"],
  unlocks: [],
  intro: `The last chapter's states fit in one number: a position, an amount. This chapter is what happens when *where you stand* takes two numbers to say. Sometimes literally — a robot at row i, column j of a grid. More often structurally: comparing two strings means a position in *each* (the great alignment family — Longest Common Subsequence, Edit Distance, Distinct Subsequences, Regular Expression Matching, the DNA-and-diff algorithms of the real world). Or one sequence with a second axis of *situation*: holding stock versus cooling down, choosing with a remaining capacity. The table becomes a plane; the recurrence becomes a cell looking at its neighbours — up, left, diagonal — and everything you practised in 1-D transfers cell by cell.

The five-finger checklist survives untouched: state sentence, recurrence from the last decision, bases (now a whole first row and column — where most bugs live), fill order, answer cell. What is genuinely new is a small set of recurring *shapes* worth recognising on sight. The **grid walk**: paths counted or costs minimised from up-and-left neighbours (Unique Paths). The **alignment square**: characters match → extend the diagonal; mismatch → best of dropping a character from either side (LCS, and its harder cousins where matches can also be *skipped or repeated*). The **loop-order flip**: Coin Change II versus its 1-D sibling — iterating coins outside versus amounts outside is precisely the difference between counting combinations and counting permutations, the sharpest two-line lesson in all of DP. The **state-machine day**: With Cooldown models each day as a node in a tiny automaton — holding, cooling, free — and the "table" is one row per machine-state. **DFS + memo on a DAG**: Longest Increasing Path shows DP and graph traversal are one subject (increasing edges cannot cycle, so memoised DFS *is* the fill order). And the **interval shape**: Burst Balloons, where the trick is thinking about the *last* balloon, not the first, and states are spans.

This chapter contains more genuinely hard problems than any other in the atlas — four Hards, all famous. Take them slowly; every one of them is some earlier problem with one twist. It is a leaf on the roadmap: nothing unlocks from here, because this is the far shore.`,
  problems: [
    {
      slug: "unique-paths",
      title: "Unique Paths",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/count-paths",
      summary: "Every cell is reachable from above or the left — so its path count is the sum of two neighbours.",
      body: `**The problem.** A robot starts at the top-left of an m×n grid and moves only right or down. How many distinct paths reach the bottom-right? 3×7 → 28.

**The recurrence.** The last move into any cell came from above or from the left — the only two entrances. Paths arriving via different entrances are distinct families, so counts add: dp[i][j] = dp[i−1][j] + dp[i][j−1]. Climbing Stairs, verbatim, with the two doors rotated into two dimensions. Bases: the entire first row and first column are 1 — a robot confined to one direction has exactly one route. Fill left-to-right, top-to-bottom; answer in the far corner.

**The walk-through.** 3×3: first row 1 1 1, first column 1 1 1. Middle cell: 1+1 = 2. Then 1+2 = 3, 2+1 = 3, and the corner: 3+3 = 6. Six paths, and you can enumerate them by hand to believe it.

**The space squeeze, upgraded.** Each cell reads only the current row's left neighbour and the *previous row's* same column — so keep one row and overwrite it in place: dp[j] += dp[j−1]. The 1-D rolling-variable trick, promoted to a rolling *row*: O(n) space, and the standard expected polish.

**The closed form, for range.** A path is a sequence of (m−1) downs and (n−1) rights in some order — choose which slots are downs: C(m+n−2, m−1). Combinatorics answers in O(1) what the table answers in O(mn); the table wins the moment the problem grows warts (obstacles — the famous variant where blocked cells contribute 0; weighted cells; minimum path *sum* instead of count, where + becomes min exactly as Min Cost Climbing Stairs taught). Offering both, and knowing which survives which follow-up, is the complete answer.

**Complexity.** O(mn) time, O(n) space.

**The thread.** A grid of *positions*. The next problem keeps the two-dimensional table but changes what the axes mean: a position in one string × a position in another — the alignment family opens with Longest Common Subsequence.`,
    },
    {
      slug: "longest-common-subsequence",
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/longest-common-subsequence",
      summary: "The alignment square: match extends the diagonal, mismatch takes the better of two drops.",
      body: `**The problem.** The longest subsequence (ordered, gaps allowed) present in both strings. "abcde" and "ace" → 3 ("ace" itself). This is the mother of the alignment family — diff tools, DNA comparison, spell-correct suggestions all descend from this table.

**The state.** dp[i][j] = LCS length of the first i characters of one string and the first j of the other. Two prefixes, one number — the axes are positions in *different* strings, the leap this chapter exists to teach.

**The recurrence — look at the last characters.** If they **match**, they can safely end the common subsequence: dp[i][j] = 1 + dp[i−1][j−1] — extend the diagonal. (Safely: no optimal alignment loses by matching identical final characters; a cut-and-paste argument proves it, and "why is matching always safe?" is the classic probe.) If they **differ**, at least one of them is useless to the alignment — drop mine or drop yours, keep the better: dp[i][j] = max(dp[i−1][j], dp[i][j−1]). Bases: row zero and column zero are 0 — nothing shares anything with an empty prefix. That is the whole *alignment square*: diagonal on match, max-of-two on mismatch. Burn it in; three later problems are this square with modified corners.

**The walk-through.** "abcde" × "ace": the table grows 1 at the a-column, holds through b, steps to 2 at c, holds through d, steps to 3 at e. Every cell is a one-glance decision; the answer sits at the far corner.

**Recovering the subsequence itself** — the standard follow-up — walks the table backwards from that corner: diagonal steps emit matched characters, max-steps follow the larger neighbour. The table *is* the alignment; the length was just its headline.

**Complexity.** O(mn) time; O(min(m, n)) space with a rolling row (though recovery needs the full table — say the trade). Fun fact with teeth: strongly subquadratic LCS would violate the Strong Exponential Time Hypothesis — this table is believed essentially optimal.

**The thread.** Alignment opened. Before its harder cousins, a detour into a different 2-D shape: a *state machine* over days — Best Time to Buy and Sell Stock, now with a cooldown.`,
    },
    {
      slug: "best-time-to-buy-and-sell-stock-with-cooldown",
      title: "Best Time to Buy and Sell Stock With Cooldown",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/buy-and-sell-crypto-with-cooldown",
      summary: "Model the day as a tiny automaton — holding, just-sold, free — and run one row of DP per machine state.",
      body: `**The problem.** Trade a stock over n days, unlimited transactions, one share at a time — but after selling you must sit out one full day (cooldown). Maximise profit. [1, 2, 3, 0, 2] → 3 (buy 1, sell 2, cool, buy 0, sell 2).

**The insight — the second axis is a *mode*.** Chapter three's stock problem carried one number (min so far). The cooldown makes your options depend on *what situation yesterday left you in* — and situations here are exactly three: **holding** a share; **cooling** (sold today, tomorrow is frozen); **free** (no share, no freeze). That is a state machine, and the DP table is one row per machine state, one column per day: dp[state][day] = best cash position entering that state that day. This "small automaton × time" shape solves every stock variant (fees, transaction limits) and a swath of scheduling problems; learning to *draw the machine first* — nodes, allowed arrows — turns a confusing word problem into transcription.

**The transitions.** Holding today: either held yesterday, or was free and bought today (free − price). Cooling today: held yesterday and sold (hold + price). Free today: was free yesterday, or finished cooling (cooling yesterday). Each is a max of two arithmetic options — three rolling variables, no table needed. Bases: day one — holding = −price, cooling = −∞ or 0-guarded, free = 0.

**The walk-through.** Prices [1, 2, 3, 0, 2]: the machine buys at 1, holds to sell at 2 or 3 — selling at 2 then cooling lets it buy the 0 and sell the final 2 (profit 1 + 2 = 3), while greedily riding to 3 (profit 2) strands it cooling as the 0 flies by. The DP holds both futures and lets the max decide; that is precisely what the cooldown was designed to break in greedy answers.

**Complexity.** O(n) time, O(1) space — a "2-D" DP whose second dimension has size three.

**The thread.** A tiny second axis. Next it grows honest again: Coin Change II, where the axes are coins × amounts, and the *order of two loops* becomes the entire mathematics.`,
    },
    {
      slug: "coin-change-ii",
      title: "Coin Change II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/coin-change-ii",
      summary: "Count the combinations: coins in the outer loop, so each mix is built in one canonical order.",
      body: `**The problem.** Same coins, unlimited supply — but now *count the combinations* that make the amount. Coins [1, 2, 5], amount 5 → 4 (5; 2+2+1; 2+1+1+1; 1×5). Combinations: {1, 2, 2} and {2, 1, 2} are the *same* answer, counted once.

**Where the naive count goes wrong.** Take Coin Change's loop — for each amount, try every coin last — and swap min for sum: you get a real quantity, but the wrong one. dp[5] += dp[3] (via a 2) and dp[5] += dp[4] (via a 1) counts 2-then-...-then-1 and 1-then-...-then-2 endings separately: you have counted **permutations** (sequences of coins), not combinations. Not a bug — a different problem (it has its own name on other lists: combination sum IV, confusingly).

**The insight — impose an order, again.** You have met this exact disease twice: Combination Sum's duplicate paths, 3Sum's duplicate triplets — and the cure was always *canonical construction order*. Here the cure is astonishingly cheap: **put the coin loop outside**. Process coin 1 fully (dp[a] += dp[a − 1] for all amounts), then coin 2, then coin 5. Every combination is now built in exactly one order — all its 1s first, then its 2s, then its 5s — because a later coin can never precede an earlier one in the construction. Same two loops, swapped nesting: outer-coins counts combinations, outer-amounts counts permutations. Two lines of code apart, and being able to *say why* is the sharpest DP sentence you can own.

**The 2-D reading.** The honest table is dp[k][a] = ways to make a using only the first k coin types — each row a coin, filled from the row above (skip coin k) plus the same row shifted (use another copy: unbounded, so *same* row — high-to-low versus low-to-high sweeps being the once-versus-unlimited toggle from Partition Equal Subset Sum). The 1-D outer-coin loop is that table with rows compressed in place.

**The walk-through.** Coins [1, 2, 5]: after coin 1, dp = all 1s. After coin 2: dp[5] = 3 (0, 1, or 2 twos). After coin 5: dp[5] = 4.

**Complexity.** O(coins × amount) time, O(amount) space.

**The thread.** Signs next: Target Sum hands every number a + or −, and the counting collapses onto this same subset-sum table through one line of algebra.`,
    },
    {
      slug: "target-sum",
      title: "Target Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/target-sum",
      summary: "Choosing signs is choosing a subset: one line of algebra turns ± assignments into subset-sum counting.",
      body: `**The problem.** Put a + or − before every number so the expression hits a target; count the ways. [1, 1, 1, 1, 1], target 3 → 5. Two choices per element — 2ⁿ assignments — smells like Subsets; the counting smells like DP. Both instincts are right, and algebra is the bridge.

**The reduction.** Split the numbers by the sign you give them: P gets +, N gets −. Then sum(P) − sum(N) = target, and sum(P) + sum(N) = total. Add the equations: **sum(P) = (total + target) / 2** — a plain number. So choosing signs *is* choosing the positive subset, and the question becomes: *how many subsets sum to exactly (total + target) / 2?* — Partition Equal Subset Sum's table, counting instead of testing. Two sanity gates fall out of the algebra free: if total + target is odd, or target's magnitude exceeds total, the answer is 0 before any DP runs. One line of high-school algebra deleted an exponential search space; this problem earns its place as the cleanest example of *reduce before you compute* in the whole atlas.

**The DP.** dp[a] = number of subsets (so far) summing to a. Base dp[0] = 1 — the empty subset, the "one way to have done nothing" base for the third time. Per number x, sweep amounts **high-to-low** (once-each discipline, exactly as in Partition Equal Subset Sum) with dp[a] += dp[a − x]. Booleans became counts; the machinery didn't blink.

**The walk-through.** Five 1s, target 3: sum(P) = (5 + 3)/2 = 4 — choose which four 1s are positive: C(5, 4) = 5 ✓, and the table computes the same by accretion: after each 1, dp = rows of Pascal's triangle. (Subset-sum DP *is* binomial counting when all items are equal — a pleasing check.)

**Zeros, the classic wrinkle.** A zero can take either sign without changing any sum, so each zero doubles the count — and the recurrence handles it by itself: with x = 0, dp[a] += dp[a − 0] legitimately doubles every entry (the sweep direction is irrelevant for a zero — reading your own just-written value *is* the correct "use it or not" fork here). Trust the recurrence; the one real mistake is "optimising" zeros away as no-ops.

**Complexity.** O(n × sum) time, O(sum) space.

**The thread.** Numbers aligned to a target. Now strings braided together: Interleaving String, where two prefixes must weave into a third — the alignment square with a twist in what the axes *produce*.`,
    },
    {
      slug: "interleaving-string",
      title: "Interleaving String",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/interleaving-string",
      summary: "Can two strings braid into a third? dp[i][j] tracks whether prefixes i and j weave the first i+j characters.",
      body: `**The problem.** Does s3 consist of s1 and s2 *interleaved* — both strings fully used, each keeping its internal order, characters woven together arbitrarily? s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac" → true; reshuffle s3's tail and it turns false. First gate: lengths must satisfy |s1| + |s2| = |s3|, or nothing can braid.

**Why greedy matching dies.** Walk s3, matching greedily against whichever source's next character fits: ambiguity kills you when *both* fit — s1 offers a, s2 offers a; committing to the wrong one strands letters far downstream, and no local rule sees that far. Ambiguous branching with shared sub-fates: the DP signature.

**The state.** dp[i][j] = true iff the first i characters of s1 and the first j of s2 can weave the first **i + j** characters of s3. That is the quiet elegance: the position in s3 is not a third dimension — it is *determined* as i + j, because weaving consumes exactly one source character per target character. A problem that looks 3-D collapses to the standard square; noticing forced coordinates is a state-design skill worth naming.

**The recurrence.** The last woven character, s3[i+j−1], came from one of two hands: from s1 (needs s1[i−1] to match it, and dp[i−1][j] true), or from s2 (s2[j−1] matches, dp[i][j−1] true). OR the two. Bases: dp[0][0] = true; first row and column are chains of single-source matching. The alignment square again — but where LCS *maxed* over choices, a feasibility braid **ORs** them; the shape survives the operator swap, which is exactly the point of learning shapes.

**The walk-through.** At any tie — both sources offering the same letter — the table simply marks *both* successor cells reachable and lets the future decide; the stranded branch dies quietly in a false region, the good one threads to the corner. Ambiguity handled by breadth, not commitment.

**Complexity.** O(mn) time, O(n) with a rolling row.

**The thread.** From weaving to a grid with no strings at all: Longest Increasing Path in a Matrix — where DP meets DFS and the "fill order" is discovered by the recursion itself.`,
    },
    {
      slug: "longest-increasing-path-in-a-matrix",
      title: "Longest Increasing Path in a Matrix",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/longest-increasing-path-in-matrix",
      summary: "Memoised DFS on the DAG of increasing moves — strictly increasing means no cycles, so no visited set.",
      body: `**The problem.** In a grid of numbers, find the longest path moving up/down/left/right where values **strictly increase** at every step. No revisits are even possible — increase forbids them, and that observation is the key to everything.

**The graph view.** Draw an edge from each cell to each larger orthogonal neighbour. Strict increase means edges only point "uphill" — no cycle can exist (a cycle would have to return to its own value). The grid's moves form a **DAG**, and longest-path-in-a-DAG is a classic DP; on general graphs it is NP-hard, and the acyclicity is the entire licence to proceed. Say that in an interview and the room changes temperature.

**The insight — memoised DFS *is* the DP.** Define longest(c) = the longest increasing path *starting* at cell c = 1 + max over larger neighbours of longest(neighbour). Recursion with a cache: first visit computes and stores; later visits — from any direction — return instantly. Two things usually demanded by DP dissolve here. No **visited set**: DFS cannot loop, because recursion only moves to strictly larger cells (the structure polices itself — contrast every Graphs-chapter DFS). No **fill order**: topological order is exactly what bottom-up tabulation would need, and the recursion *discovers it implicitly* — each cell completes only after its uphill dependencies have. Top-down memoisation is not a convenience here; it is the natural shape, and this problem is the cleanest demonstration in the atlas that **DP = DAG traversal with remembered results**. The two chapters this one requires — Graphs and 1-D DP — meet in a single function.

**The walk-through.** Grid rows 994 / 668 / 211. From 1: 1→2→6→9 — length 4. The memo means the 6→9 tail, computed once, is reused by every path funnelling through 6; total work stays one visit per cell despite exponentially many paths existing.

**The mechanics.** For each cell, if cached return it; else recurse into strictly-larger neighbours, cache 1 + best, return. Answer: max over all cells (paths can start anywhere).

**Complexity.** O(mn) time — each cell computed once, four edges each — O(mn) space for memo and recursion.

**The thread.** Back to strings, and up a difficulty notch: Distinct Subsequences — the alignment square where matching no longer *ends* the story, because one character can be matched many ways.`,
    },
    {
      slug: "distinct-subsequences",
      title: "Distinct Subsequences",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/count-subsequences",
      summary: "Count the ways t appears in s as a subsequence: on a match, use the character — and also don't.",
      body: `**The problem.** How many distinct ways does string t occur inside string s as a subsequence? s = "rabbbit", t = "rabbit" → 3 — three different choices of which letters of s spell it. Counting *ways of embedding*, not existence: the alignment family's counting face.

**The state.** dp[i][j] = the number of ways the first j characters of t can be embedded in the first i characters of s. Answer at the full corner.

**The recurrence — the twist is on match.** Look at s[i−1] (the newest source character). If it *differs* from t[j−1], it is useless for the current target position: dp[i][j] = dp[i−1][j] — embeddings simply ignore it. If it **matches**, two disjoint families exist and — unlike LCS, where matching was safely final — both must be counted: embeddings that *use* this s-character for this t-position (dp[i−1][j−1] ways to have placed the rest) plus embeddings that *skip* it, saving the t-position for an equal character somewhere earlier — later — in s's prefix (dp[i−1][j]). Sum, not max: counting versus optimising, the operator swap you have now seen four times. Missing the skip-on-match term is *the* canonical error, and "why do you add dp[i−1][j] even on a match?" is the interview's favourite question. Answer: because distinct embeddings are distinguished by *which* source characters they consume, and declining a usable character is a real, different choice.

**Bases.** dp[i][0] = 1 — the empty target embeds exactly one way (consume nothing). dp[0][j>0] = 0 — a non-empty target cannot come from emptiness. The empty-target base is the same "one way to do nothing" convention as ever, now load-bearing for correctness of every match count.

**The walk-through.** "rabbbit" × "rabbit": the three b's of s competing for t's two b-slots generate the multiplicity — the table quietly computes C-like counts through pure addition, and lands on 3.

**Complexity.** O(mn) time, rolling row O(n) — sweep j high-to-low to avoid clobbering, the once-per-character discipline echoing subset-sum.

**The thread.** Counting embeddings mastered. Now the alignment square's most famous member: Edit Distance — three operations, three neighbours, one number that ships in every spellchecker on earth.`,
    },
    {
      slug: "edit-distance",
      title: "Edit Distance",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/edit-distance",
      summary: "Insert, delete, replace: each maps to a neighbour cell, and the table computes the cheapest transformation.",
      body: `**The problem.** Minimum number of operations — insert a character, delete a character, replace a character — to turn one word into another. "horse" → "ros": 3. This is Levenshtein distance: the number under spellcheck suggestions, fuzzy search, and DNA alignment scoring. If one problem from this chapter follows you into industry, it is this one.

**The state.** dp[i][j] = minimum operations converting the first i characters of word1 into the first j of word2. Bases are the degenerate conversions and they *mean* something: dp[i][0] = i (delete everything), dp[0][j] = j (insert everything) — reciting their meaning is how you never botch them.

**The recurrence — three operations, three neighbours.** Compare the last characters. **Match:** they cost nothing; inherit the diagonal, dp[i−1][j−1]. **Mismatch:** three ways to fix the ending, each leaving a smaller instance. *Replace* word1's last with word2's last → diagonal + 1. *Delete* word1's last → dp[i−1][j] + 1 (still must reach j). *Insert* word2's last onto word1 → dp[i][j−1] + 1 (that insertion consumed target character j). Take the min of the three, plus one. The geometric mnemonic — replace = diagonal, delete = up, insert = left — makes the code write itself; the understanding that each arrow is *an operation on the word*, not table magic, is what survives follow-ups (operation costs? forbid replaces? the recurrence bends without breaking).

**The walk-through.** "horse" → "ros" lands on 3, and the table's min-arrows spell the script: replace h with r ("rorse"), match the o, delete the second r ("rose"), match the s, delete the e ("ros") — one replace, two deletes. Trace the arrows backwards from the corner and the actual edit script falls out, the same table-walk that recovered the LCS.

**Kinship worth saying.** With only insert/delete allowed, edit distance = m + n − 2·LCS — the two tables are cousins, and mentioning the identity is effortless depth.

**Complexity.** O(mn) time, O(n) rolling row (full table if the script must be recovered).

**The thread.** The alignment square is now fully yours. The last two problems leave it behind: first Burst Balloons — the interval shape, where the winning question is not "what happens first?" but "what happens **last**?"`,
    },
    {
      slug: "burst-balloons",
      title: "Burst Balloons",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/burst-balloons",
      summary: "Think about the last balloon in each range: interval DP over spans, with padded 1s at the borders.",
      body: `**The problem.** Balloons with numbers. Bursting balloon i pays left · i · right — its *current* neighbours at burst time. Burst them all; maximise total coins. [3, 1, 5, 8] → 167. The cruelty: every burst changes who neighbours whom, so early choices reshape every later payoff.

**Why "first" fails and "last" wins.** Condition on the *first* burst and the remaining problem is a mess — the array reglues, and subproblems overlap in unspeakable ways. The famous inversion: in any range, condition on the **last** balloon to burst there. When k bursts last in the range, every other balloon in the range is already gone — so k's payoff is *the borders themselves*: boundary-left · k · boundary-right, known constants. And the range splits into two independent subranges — everything left of k, everything right of k — each fully burst before k, and each bounded by walls that never move: the range's own boundary on one side and k itself (still standing until last) on the other. Choosing the last event, not the first, is what makes subproblems clean; this inversion is interval DP's master key (matrix-chain multiplication, polygon triangulation — same trick).

**The state.** Pad the array with 1s at both ends (virtual balloons that never burst — they exist to be walls). dp[l][r] = max coins from bursting everything strictly *between* walls l and r. Recurrence: try each k in the open interval as the last burst — dp[l][k] + wall(l)·k·wall(r) + dp[k][r] — take the max. Base: adjacent walls enclose nothing, dp = 0. Fill by increasing **span length** — small intervals feed large ones; the fill order is the third dimension of thought even though the table is 2-D.

**The walk-through.** [3, 1, 5, 8] padded to [1, 3, 1, 5, 8, 1]: length-1 spans score their own products (3·1·5 = 15 for the middle 1, etc.); spans grow; the full interval tries each survivor-to-the-end and lands on 167 (burst order 1, 5, 3, 8).

**Complexity.** O(n³) time — O(n²) intervals × O(n) split points — O(n²) space. Cubic and proud; this is the honest cost of interval DP.

**The thread.** One summit remains — the alignment square pushed to its extreme, where one of the strings contains *wildcards that loop*: Regular Expression Matching.`,
    },
    {
      slug: "regular-expression-matching",
      title: "Regular Expression Matching",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/regular-expression-matching",
      summary: "Dot matches anything; star means zero-or-more of the previous — two cases per cell, handled exactly.",
      body: `**The problem.** Implement regex matching for two operators: . (any single character) and * (zero or more of the *preceding* element). The match must cover the **entire** string. s = "aab", p = "c*a*b" → true (zero c's, two a's, one b). The chapter's final boss, and the ancestor of every regex engine's core loop.

**The state.** dp[i][j] = true iff the first i characters of s match the first j of p. The alignment square one last time — with OR as the operator (feasibility, like Interleaving String) and one element that reaches *two columns back*.

**The recurrence, by pattern character.** If p[j−1] is a normal letter or .: match iff the current characters agree (letter equality, or dot) *and* the diagonal dp[i−1][j−1] holds. The interesting case: p[j−1] is *, which forms a unit with p[j−2]. Two disjoint readings, OR-ed. **Zero copies:** the unit vanishes — dp[i][j−2], same string, pattern minus the pair. **One more copy:** legal only if s[i−1] agrees with p[j−2] (or it is a dot); then this string character is consumed *by the same unit* — dp[i−1][j], pattern **unchanged**, which is precisely how "or more" loops without looping. Every regex-star bug in history is a mangling of one of those two arms; there is no third arm.

**Bases — where the zeros live.** dp[0][0] = true. dp[0][j]: an empty string matches only patterns that can *evaporate* — alternating x* units — so dp[0][j] = p[j−1] is * and dp[0][j−2]. Non-empty string against empty pattern: false. Fill row by row; answer at the far corner.

**The walk-through.** "aab" × "c*a*b": c* takes the zero arm immediately; a* takes the one-more arm twice, consuming both a's while the pattern stands still; b matches b. Corner: true. Each decision was one of the two arms — nothing else ever fires.

**Complexity.** O(mn) time and space. (Real engines compile to automata — Thompson NFA — but their state graph *is* this table with the string axis streamed; you have effectively derived it.)

**The thread.** The tables are conquered — grids, alignments, machines, intervals, wildcards. What remains of the atlas are the sharper, lighter arts: Greedy, where a single provable choice replaces the whole table; then Intervals, Math & Geometry, and Bit Manipulation. The long climb is over; the ridge walk begins.`,
    },
  ],
};
