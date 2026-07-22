import type { DsaTopic } from "../types";

/** Chapter 9 — Backtracking: exploring the tree of your own choices. */
export const backtracking: DsaTopic = {
  slug: "backtracking",
  title: "Backtracking",
  chapter: 9,
  tagline: "Choose, explore, unchoose — walking the decision tree with one path in hand and pruning as you go.",
  color: "#7fe5e0",
  prereqs: ["trees"],
  unlocks: ["graphs", "dp-1d"],
  intro: `In Trees you traversed structures that already existed. Backtracking hands you the same recursion and points it at a tree nobody built: the **decision tree** of a problem — every node a partial answer, every edge a choice, every leaf a candidate solution. Generate all subsets? Each element is a fork: in, or out. Permutations? Each level picks who goes next. The tree is exponential and exists only implicitly; backtracking is depth-first search over it, materialising exactly one root-to-leaf path at a time.

The whole pattern lives in a three-beat mantra: **choose, explore, unchoose.** Append a candidate to your path; recurse deeper; then — the beat beginners drop — *remove it*, restoring the state exactly, so the next branch starts clean.`,
  problems: [
    {
      slug: "subsets",
      title: "Subsets",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/subsets",
      summary: "Every element asks one question — in or out? — and the 2^n leaves are the power set.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to generate subsets using nested loops.
*Why this shatters*: Nested loops are fixed at compile time (e.g. 3 loops for length 3). If the input array has length $N$, you need $N$ nested loops, which is impossible to write statically!

**The Structural Invariant: Binary Choice Tree (In or Out).**
For an array of length $N$, there are $2^N$ total subsets (the Power Set).
- Each element at index \`i\` offers a binary choice:
  1. **Include** \`nums[i]\` in current path.
  2. **Exclude** \`nums[i]\` from current path.
- **The Backtracking Mantra**:
  - \`path.push(nums[i])\` $\\rightarrow$ Recurse \`dfs(i + 1)\` $\\rightarrow$ \`path.pop()\` (Unchoose!).
  - Recurse \`dfs(i + 1)\` (without element).
- **Snapshot Requirement**: Save a **deep copy** (\`[...path]\`) of the path at every decision node!

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "[] (start)", "children": ["inc1", "exc1"] },
    { "id": "inc1", "label": "include 1 -> [1]", "children": ["inc1inc2", "inc1exc2"] },
    { "id": "exc1", "label": "exclude 1 -> []", "children": ["exc1inc2", "exc1exc2"] },
    { "id": "inc1inc2", "label": "[1, 2]", "highlight": true },
    { "id": "inc1exc2", "label": "[1]", "highlight": true },
    { "id": "exc1inc2", "label": "[2]", "highlight": true },
    { "id": "exc1exc2", "label": "[]", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Subsets([1, 2]) — Binary decision tree (2^N leaves)."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Aliasing Trap*: Pushing \`path\` directly to results (\`res.push(path)\`) stores a reference to a single mutable array, which turns into \`[[], [], ...]\` as backtracking unwinds. Always save a copy: \`res.push([...path])\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must we save a copy of the path ([...path]) when appending to the final results array in Backtracking?",
          options: [
            "Because path is a mutable array reference that will be emptied by path.pop() as backtracking unwinds.",
            "To sort the subset elements.",
            "To convert integers to strings.",
            "Because a subset can only be recorded once per recursion depth."
          ],
          correct_index: 0,
          model_answer: "Backtracking uses a single mutable array for space efficiency. Saving `path` by reference stores the same array object, which gets emptied at the end.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time and space complexity of generating all subsets for N elements?",
          model_answer: "O(N * 2^N) time complexity, because there are 2^N subsets, each requiring O(N) time to copy into the result list. Space complexity is O(N) for recursion stack.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "combination-sum",
      title: "Combination Sum",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/combination-target-sum",
      summary: "Reuse allowed, order ignored: recurse on 'smallest candidate I may still use' and prune past the target.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners pick any element at any level without passing a starting index.
*Why this shatters*: Picking freely generates duplicate combinations in different orderings (e.g. \`[2, 2, 3]\`, \`[2, 3, 2]\`, and \`[3, 2, 2]\`), requiring heavy post-processing deduplication!

**The Structural Invariant: Ordered Index Discipline & Target Pruning.**
- **Enforce Non-Decreasing Index**: Pass \`start_index\`. At current step, only choose candidates from \`start_index\` to \`N - 1\`.
- **Unlimited Reuse**: When choosing \`candidates[i]\`, recurse with \`dfs(i, remain - candidates[i])\` (passing index \`i\` instead of \`i + 1\` allows picking the same number again!).
- **Target Pruning**:
  - \`remain == 0\`: Found valid sum! Save \`[...path]\`.
  - \`remain < 0\`: Exceeded target $\\rightarrow$ PRUNE branch immediately (return!).

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "remain=7, start=0", "children": ["p2", "p7"] },
    { "id": "p2", "label": "pick 2 (remain=5)", "children": ["p22"] },
    { "id": "p22", "label": "pick 2 (remain=3)", "children": ["p223"] },
    { "id": "p223", "label": "pick 3 (remain=0 -> MATCH [2,2,3])", "highlight": true },
    { "id": "p7", "label": "pick 7 (remain=0 -> MATCH [7])", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Combination Sum — Index discipline prevents duplicate combination orderings."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Optimization*: Sort \`candidates\` array ascending first. If \`remain - candidates[i] < 0\`, break the loop early because all remaining candidates will also be too large!`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does passing 'start_index' prevent generating duplicate combinations like [2, 3] and [3, 2] in Combination Sum?",
          options: [
            "By sorting the output array.",
            "By ensuring we only select candidates at or after the current index, forcing combinations to be constructed in non-decreasing order.",
            "By limiting recursion depth to 2.",
            "By converting candidates to a Hash Set."
          ],
          correct_index: 1,
          model_answer: "Enforcing that next choices must come from index `i` or later prevents backtracking into earlier indices, generating each unique combination exactly once.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "Why do we pass index 'i' instead of 'i + 1' during recursion in Combination Sum?",
          model_answer: "Passing 'i' allows candidate[i] to be reused multiple times in the same combination.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "combination-sum-ii",
      title: "Combination Sum II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/combination-target-sum-ii",
      summary: "Duplicated input, unique output: sort, then skip equal siblings at the same tree level.",
      body: `**Beginner Intuition & The Naive Fallacy.** Inputs contain duplicates (e.g. \`candidates = [1, 1, 2]\`, \`target = 3\`). Beginners try generating combinations and filtering with a Hash Set.
*Why this shatters*: Generating duplicate tree branches wastes massive exponential CPU time. We must **prune duplicate sibling choices at the decision node level**.

**The Structural Invariant: Sort + Skip Sibling Twins.**
1. **Sort candidates** first (\`[1, 1, 2, 5, 6, 7, 10]\`).
2. Recurse with \`i + 1\` (each element used at most ONCE).
3. **The Sibling Twin Skip Rule**:
   $$\\text{if } i > \\text{start} \\quad \\text{AND} \\quad \\text{candidates}[i] == \\text{candidates}[i - 1] \\implies \\textbf{SKIP!}$$
   - *Why $i > \\text{start}$ matters*:
     - If $i == \\text{start}$, it is the FIRST time we consider this value at the current tree level (parent-child relationship) $\\rightarrow$ **ALLOW** (allows \`[1, 1, 6]\`).
     - If $i > \\text{start}$ and equals previous, it is an alternative duplicate choice at the SAME tree level (sibling relationship) $\\rightarrow$ **SKIP** (prevents cloning subtrees!).

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "sorted [1,1,2,5,6,7,10], target=8", "children": ["c0", "c1", "c2"] },
    { "id": "c0", "label": "i=0: pick first 1", "children": ["c0_1", "c0_7"] },
    { "id": "c0_1", "label": "i=1: pick second 1 (parent-child ALLOWED) -> [1,1,6]", "highlight": true },
    { "id": "c0_7", "label": "i=5: pick 7 -> [1,7]", "highlight": true },
    { "id": "c1", "label": "i=1: pick second 1 as sibling (i > start & c[i]==c[i-1]) -> SKIPPED!" },
    { "id": "c2", "label": "i=2: pick 2 -> [2,6]", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Combination Sum II — Sibling twin skip rule prevents duplicate combination branches."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Difference from Combination Sum 1*: Here elements are used ONCE (\`i + 1\`), and candidates contain DUPLICATES (requires sort + sibling skip).`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Combination Sum II, why is the condition 'i > start' essential when skipping duplicates (candidates[i] == candidates[i-1])?",
          options: [
            "It ensures we only skip duplicates at the same tree level (siblings), while allowing duplicate values across different levels (parent-child).",
            "It prevents index out of bounds errors on negative numbers.",
            "It sorts the array in descending order.",
            "It limits the total sum to 8."
          ],
          correct_index: 0,
          model_answer: "i == start is the first pick at the current decision level, which must be allowed. i > start represents subsequent duplicate choices at the same level, which must be skipped.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "What is the result of applying Combination Sum II on candidates = [2, 2, 2] with target = 4?",
          model_answer: "Returns [[2, 2]] exactly once. The first 2 pairs with the second 2. The third 2 is skipped as a sibling choice.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "permutations",
      title: "Permutations",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/permutations",
      summary: "Each level picks who goes next from the unused pool — n! leaves, one bookkeeping set.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to use \`start_index\` like Subsets or Combinations.
*Why this shatters*: Permutations care about **ORDER**! \`[1, 2]\` and \`[2, 1]\` are distinct permutations. A start index prevents looking backward at earlier numbers.

**The Structural Invariant: Used-State Bookkeeping.**
At each recursion depth:
- We can pick ANY number from \`nums[0 ... N-1]\` that has **NOT been used yet** on the current path.
- Maintain a boolean array \`used[i]\` or Hash Set.
- **The Backtracking Mantra**:
  - For $i = 0$ to $N - 1$:
    - If \`used[i]\` is true, continue (skip!).
    - \`used[i] = true\`, \`path.push(nums[i])\` (Choose!).
    - \`dfs()\`.
    - \`path.pop()\`, \`used[i] = false\` (Unchoose!).

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "[] (used={})", "children": ["c1", "c2", "c3"] },
    { "id": "c1", "label": "choose 1", "children": ["c12", "c13"] },
    { "id": "c12", "label": "choose 2 -> [1, 2, 3]", "highlight": true },
    { "id": "c13", "label": "choose 3 -> [1, 3, 2]", "highlight": true },
    { "id": "c2", "label": "choose 2 -> [2, 1, 3], [2, 3, 1]", "highlight": true },
    { "id": "c3", "label": "choose 3 -> [3, 1, 2], [3, 2, 1]", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Permutations — Decision tree branching on unused candidates (N! leaves)."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Unmark Failure*: Forgetting \`used[i] = false\` after recursive call starves future branches of candidates, producing incomplete results.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the total number of leaf nodes in the decision tree for Permutations of N distinct elements?",
          options: [
            "2^N",
            "N!",
            "N^2",
            "N * log N"
          ],
          correct_index: 1,
          model_answer: "The first level has N choices, second has N-1 choices... multiplying to N * (N-1) * ... * 1 = N! total permutation leaves.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "How does the In-Place Swap alternative for Permutations avoid using a `used[]` boolean array?",
          model_answer: "By swapping `nums[i]` into position `curr_idx`, recursing on `curr_idx + 1`, and swapping back. The array itself acts as the visited state.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "subsets-ii",
      title: "Subsets II",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/subsets-ii",
      summary: "The power set of a multiset: the collect-as-you-go tree plus the sorted sibling-skip, composed.",
      body: `**Beginner Intuition & The Naive Fallacy.** Input array contains duplicates (e.g. \`[1, 2, 2]\`). Beginners generate all subsets and deduplicate results using a Set.
*Why this shatters*: Generating duplicate subsets wastes exponential operations.

**The Structural Invariant: Collect-As-You-Go + Sibling Twin Skip.**
1. **Sort the array** first (\`[1, 2, 2]\`).
2. **Collect As You Go**: Save \`[...path]\` at **EVERY node** of the decision tree (since every prefix is a valid subset!).
3. **Sibling Twin Skip**:
   - For $i = \\text{start}$ to $N - 1$:
   - If $i > \\text{start}$ AND \`nums[i] == nums[i - 1]\`: **SKIP**!

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "[] (Save [])", "children": ["c1", "c2a", "c2b"] },
    { "id": "c1", "label": "pick 1 -> Save [1]", "children": ["c12"] },
    { "id": "c12", "label": "pick first 2 -> Save [1, 2]", "children": ["c122"] },
    { "id": "c122", "label": "pick second 2 -> Save [1, 2, 2]", "highlight": true },
    { "id": "c2a", "label": "pick first 2 -> Save [2]", "children": ["c2a2"] },
    { "id": "c2a2", "label": "pick second 2 -> Save [2, 2]", "highlight": true },
    { "id": "c2b", "label": "pick second 2 as sibling -> SKIPPED!" }
  ],
  "rootId": "root",
  "caption": "Subsets II — Collect-as-you-go tree with sibling duplicate pruning."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Difference from Subsets 1*: Sort array first, add \`i > start && nums[i] == nums[i-1]\` skip check inside loop.`,
      questions: [
        {
          kind: "mcq",
          prompt: "In Subsets II, when is the current path added to the results array?",
          options: [
            "Only at leaf nodes when path length equals N.",
            "At every single decision node in the recursion tree (collect-as-you-go).",
            "Only when the path sum is even.",
            "After sorting the final output."
          ],
          correct_index: 1,
          model_answer: "Every prefix of decisions represents a unique subset, so a copy of the path is collected at every node during traversal.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What unique subsets are generated for nums = [1, 2, 2]?",
          model_answer: "[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]] (6 subsets total).",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "generate-parentheses",
      title: "Generate Parentheses",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/generate-parentheses",
      summary: "Grow strings by two guarded rules — open if any remain, close only when a debt exists.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners generate all $2^{2N}$ possible string combinations of \`'('\` and \`')'\` of length $2N$, then validate each string using a Stack.
*Why this shatters*: Generating $2^{2N}$ strings for $N = 8$ produces $65,536$ strings, when only $1,430$ (Catalan number $C_8$) are valid!

**The Structural Invariant: Guarded Branching Rules.**
Build valid strings incrementally by enforcing two invariant guards:
1. **Add Open Bracket \`'('\`**: Allowed if \`open_count < N\`.
2. **Add Close Bracket \`')'\`**: Allowed ONLY if \`close_count < open_count\` (a close bracket can only balance an unclosed open bracket!).
3. **Base Case**: When \`path.length == 2 * N\` $\\rightarrow$ String is guaranteed valid! Save and return.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "'' (open=0, close=0)", "children": ["o1"] },
    { "id": "o1", "label": "'(' (open=1, close=0)", "children": ["o2", "c1"] },
    { "id": "o2", "label": "'((' (open=2, close=0)", "children": ["o2c1"] },
    { "id": "c1", "label": "'()' (open=1, close=1)", "children": ["c1o1"] },
    { "id": "o2c1", "label": "'(())' (valid!)", "highlight": true },
    { "id": "c1o1", "label": "'()()' (valid!)", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Generate Parentheses — Guarded pruning eliminates all invalid bracket combinations."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Pruning Power*: Invalid strings are never generated and discarded; they are **mathematically unreachable**.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Under what condition is it valid to append a closing parenthesis ')' during string generation?",
          options: [
            "Whenever open_count < N.",
            "Only when close_count < open_count.",
            "Whenever close_count == N.",
            "When the string length is odd."
          ],
          correct_index: 1,
          model_answer: "A closing parenthesis is only valid if there is an unclosed opening parenthesis available to balance it (`close_count < open_count`).",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What mathematical sequence counts the total number of valid parenthesis combinations for N pairs?",
          model_answer: "The Catalan Numbers, where C_n = (1 / (n + 1)) * (2n choose n).",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "word-search",
      title: "Word Search",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/search-for-word",
      summary: "DFS from every cell, matching the word letter by letter — mark cells on the way in, restore on the way out.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners run DFS without un-marking visited grid cells when backtracking.
*Why this shatters*: If cell \`(r, c)\` is marked visited permanently during a failed branch, subsequent valid paths that need to pass through \`(r, c)\` will fail!

**The Structural Invariant: Grid Backtracking & In-Place Cell Marking.**
From each grid cell \`(r, c)\` matching \`word[0]\`:
- **DFS Function \`dfs(r, c, index)\`**:
  - **Success**: If \`index == word.length\`, return \`true\`.
  - **Prune / Failure**: Out-of-bounds, \`board[r][c] != word[index]\`, or already visited (\`board[r][c] == '#'\`) $\\rightarrow$ Return \`false\`.
  - **Choose**: Save \`tmp = board[r][c]\`; mark \`board[r][c] = '#'\` (in-place visited!).
  - **Explore**: Recurse on 4 cardinal directions: \`(r+1, c), (r-1, c), (r, c+1), (r, c-1)\`.
  - **Unchoose**: Restore \`board[r][c] = tmp\`!

\`\`\`viz:flow
{
  "nodes": [
    { "id": "c0", "label": "A (0,0)", "row": 0, "col": 0 },
    { "id": "c1", "label": "B (0,1)", "row": 0, "col": 1 },
    { "id": "c2", "label": "C (0,2)", "row": 0, "col": 2 },
    { "id": "s", "label": "S (start: 1,3)", "row": 1, "col": 3 },
    { "id": "e1", "label": "E (2,3)", "row": 2, "col": 3 },
    { "id": "e2", "label": "E (2,2)", "row": 2, "col": 2 }
  ],
  "edges": [
    { "from": "s", "to": "e1" },
    { "from": "e1", "to": "e2" }
  ],
  "caption": "Word Search — Tracing 'SEE' on grid. Cells marked visited on entry and restored on backtrack."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Memory Optimization*: Mutating \`board[r][c] = '#'\` in-place avoids allocating a 2D boolean \`visited[][]\` array ($O(1)$ extra space).`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why must board[r][c] be restored back to its original character during the Unchoose phase in Word Search?",
          options: [
            "To reset the grid dimensions.",
            "So that other independent search paths originating from different starting cells can reuse the cell.",
            "Because the grid must be returned unchanged to the caller.",
            "To prevent stack overflow."
          ],
          correct_index: 1,
          model_answer: "Cell state marking must be temporary per search path. Restoring the character allows subsequent paths to explore valid routes through that cell.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the worst-case time complexity of Word Search on an M x N grid for a word of length L?",
          model_answer: "O(M * N * 3^L) time. From each cell, we explore up to 3 directions at each step (since we don't immediately step backward into the parent cell).",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "palindrome-partitioning",
      title: "Palindrome Partitioning",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/palindrome-partitioning",
      summary: "Backtrack over cut positions: extend the next piece one letter at a time, recurse only past palindromic cuts.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners generate all possible string partitions ($2^{N-1}$ cut choices), then check if every substring is a palindrome.
*Why this shatters*: Generating invalid partitions before checking palindrome properties wastes time.

**The Structural Invariant: Palindrome Cut Pruning.**
- We iterate over **cut end-positions** $j$ starting from index \`start\`:
  - Substring candidate: \`sub = s.substring(start, j + 1)\`.
  - **Palindrome Guard**: Check if \`sub\` is a palindrome (using two pointers).
  - If NOT a palindrome $\\rightarrow$ **PRUNE** branch (do not recurse!).
  - If palindrome $\\rightarrow$ \`path.push(sub)\`, recurse \`dfs(j + 1)\`, \`path.pop()\`.
- **Base Case**: When \`start == s.length\`, save \`[...path]\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "'aab', start=0", "children": ["pa", "pab", "paa"] },
    { "id": "pa", "label": "cut 'a' (pal), start=1", "children": ["pa_a"] },
    { "id": "pa_a", "label": "cut 'a' (pal), start=2", "children": ["pa_a_b"] },
    { "id": "pa_a_b", "label": "cut 'b' -> [a, a, b]", "highlight": true },
    { "id": "pab", "label": "cut 'ab' -> NOT palindrome -> PRUNED!" },
    { "id": "paa", "label": "cut 'aa' (pal), start=2", "children": ["paa_b"] },
    { "id": "paa_b", "label": "cut 'b' -> [aa, b]", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Palindrome Partitioning — Branching on valid palindromic cut points."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *DP Table Pre-computation*: For long strings, pre-compute a 2D boolean DP table \`isPal[i][j]\` in $O(N^2)$ time so palindrome queries take $O(1)$ during backtracking.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the decision being made at each level of the recursion tree in Palindrome Partitioning?",
          options: [
            "Which character to delete.",
            "Where to place the next valid palindromic substring cut in the remaining string.",
            "How to reverse the string.",
            "Whether to convert characters to uppercase."
          ],
          correct_index: 1,
          model_answer: "The decision tree branches on choosing candidate substring end indices `j`. A branch is explored only if `s[start...j]` is a valid palindrome.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the result of Palindrome Partitioning for s = \"aab\"?",
          model_answer: "[[\"a\", \"a\", \"b\"], [\"aa\", \"b\"]].",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "letter-combinations-of-a-phone-number",
      title: "Letter Combinations of a Phone Number",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/combinations-of-a-phone-number",
      summary: "One level per digit, one branch per letter — the Cartesian product as a backtracking skeleton.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners write hardcoded nested loops for 2, 3, or 4 digit inputs.
*Why this shatters*: Hardcoded loops break for variable length digit strings (e.g., input \`"2345"\`).

**The Structural Invariant: Cartesian Product Tree Traversal.**
- Map digits to letters: \`{ '2': "abc", '3': "def", '4': "ghi"... }\`.
- Recursion level \`index\` corresponds to \`digits[index]\`.
- For each character \`ch\` mapped to \`digits[index]\`:
  - \`path.push(ch)\`.
  - Recurse \`dfs(index + 1)\`.
  - \`path.pop()\`.
- **Base Case**: When \`path.length == digits.length\`, save \`path.join("")\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "'23', index=0", "children": ["a", "b", "c"] },
    { "id": "a", "label": "'a' (digit 2)", "children": ["ad", "ae", "af"] },
    { "id": "ad", "label": "'ad'", "highlight": true },
    { "id": "ae", "label": "'ae'", "highlight": true },
    { "id": "af", "label": "'af'", "highlight": true },
    { "id": "b", "label": "'b' -> 'bd', 'be', 'bf'", "highlight": true },
    { "id": "c", "label": "'c' -> 'cd', 'ce', 'cf'", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Letter Combinations of a Phone Number — Cartesian product decision tree."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Empty Input*: If \`digits == ""\`, return \`[]\` immediately (not \`[""]\`!).`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the total number of combinations generated for a digit string of length N containing digits mapping to 3 letters each?",
          options: [
            "3^N",
            "N^3",
            "3 * N",
            "N!"
          ],
          correct_index: 0,
          model_answer: "Each digit branches into 3 choices independently. N digits multiply to 3^N total combinations.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity to generate all phone number letter combinations for input of length N?",
          model_answer: "O(4^N * N) time, where 4 is the maximum number of letters mapped to a digit (e.g. '7' and '9' map to 4 letters), and N is the string copy length.",
          difficulty: "intermediate"
        }
      ]
    },
    {
      slug: "n-queens",
      title: "N-Queens",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/n-queens",
      summary: "One queen per row; columns and both diagonal families tracked in sets — the classic constraint search.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners attempt to place queens on any of the $N \\times N$ squares ($C(N^2, N)$ possibilities).
*Why this shatters*: Testing all $N^2$ positions for 8 queens results in $4.4 \\text{ billion}$ checks!

**The Structural Invariant: One Queen per Row + O(1) Diagonal Tracking.**
Since no two queens can share a row, **place exactly one queen per row $r$** (depth of recursion tree = $N$).
- **O(1) Conflict Tracking Sets**:
  1. \`cols\`: Set of occupied column indices $c$.
  2. \`diag1\` (Positive Diagonal $\\nearrow$): Occupied \`row + col\` values.
  3. \`diag2\` (Negative Diagonal $\\searrow$): Occupied \`row - col\` values.
- **Backtracking Loop for Row $r$**:
  - For $c = 0$ to $N - 1$:
    - If $c \\in \\text{cols}$ OR $(r + c) \\in \\text{diag1}$ OR $(r - c) \\in \\text{diag2}$ $\\rightarrow$ **CONFLICT! Skip.**
    - **Choose**: Add $c$, $r+c$, $r-c$ to sets. Place Queen at \`(r, c)\`.
    - **Explore**: Recurse \`dfs(r + 1)\`.
    - **Unchoose**: Remove from sets, clear square.

\`\`\`viz:array
{
  "frames": [
    { "cells": ["Q", ".", ".", "."], "pointers": [{ "label": "row 0", "index": 0 }], "note": "Row 0: Place Queen at col 0. Occupied: col=0, diag1=0, diag2=0." },
    { "cells": [".", ".", "Q", "."], "pointers": [{ "label": "row 1", "index": 2 }], "note": "Row 1: Cols 0 and 1 blocked. Place Queen at col 2. Occupied: cols={0,2}." },
    { "cells": [".", "Q", ".", "."], "pointers": [{ "label": "row 0 (backtrack!)", "index": 1 }], "highlight": [0, 1, 2, 3], "note": "Row 2 blocked! Backtrack to Row 0 -> Try col 1. Leads to valid solution: [1, 3, 0, 2]!" }
  ],
  "caption": "N-Queens — Row-by-row placement with O(1) column and diagonal set tracking."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Board Formatting*: Convert row column index array \`[1, 3, 0, 2]\` into strings \`[".Q..", "...Q", "Q...", "..Q."]\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why can the negative diagonal (top-left to bottom-right) be uniquely identified by the value (row - col)?",
          options: [
            "Because row - col is always odd.",
            "Because moving along any negative diagonal incrementing row and col simultaneously keeps (row - col) constant.",
            "Because row - col equals the board width.",
            "Because positive diagonals use multiplication."
          ],
          correct_index: 1,
          model_answer: "Moving along a \\\\ diagonal increases both row and col by 1, leaving the mathematical difference (row - col) invariant.",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "How many total valid solutions exist for 4-Queens (N = 4)?",
          model_answer: "Exactly 2 valid solutions: [1, 3, 0, 2] and [2, 0, 3, 1].",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
