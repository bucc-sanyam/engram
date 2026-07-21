import type { DsaTopic } from "../types";

/** Chapter 10 — Tries: the tree that spells. */
export const tries: DsaTopic = {
  slug: "tries",
  title: "Tries",
  chapter: 10,
  tagline: "A tree where every edge is a letter and every path is a word — shared prefixes become shared structure.",
  color: "#c9e07a",
  prereqs: ["trees"],
  unlocks: [],
  intro: `Store a dictionary in a hash set and you can answer exactly one question fast: "is this exact word present?" Ask anything *prefix-shaped* — does anything start with "pre"? what are the autocompletions of "aut"? — and the set makes you scan everything it holds. The trie (from re*trie*val, usually pronounced "try") is the structure that makes prefixes first-class. It is a tree where each node fans out by *letter*: the root is the empty string, and every step down appends one character. A word is a root-to-node path; a shared prefix is a shared path. "apple" and "apply" ride the same four nodes and split only at the last letter — the dictionary's redundancy becomes the structure's compression.`,
  problems: [
    {
      slug: "implement-trie-prefix-tree",
      title: "Implement Trie (Prefix Tree)",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/implement-prefix-tree",
      summary: "Nodes mapping letters to children, plus one end-of-word flag — insert, search, and startsWith.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners use a standard Hash Set of words.
*Why this shatters*: \`search(word)\` takes $O(1)$ time, but \`startsWith(prefix)\` requires scanning every word in the set ($O(N \\cdot L)$ time for $N$ words of length $L$). A Hash Set has no structural memory of character prefixes!

**The Structural Invariant: Shared Prefix Character Node Trees.**
Each node in a Trie contains:
- \`children\`: Map or array of size 26 mapping characters \`'a' ... 'z'\` to child TrieNodes.
- \`isWord\`: Boolean flag set to \`true\` if a complete word terminates at this node.
- **Operations**:
  - \`insert(word)\`: Walk character by character, creating missing nodes. Set \`isWord = true\` on the last node.
  - \`search(word)\`: Walk characters. Return \`true\` iff all nodes exist AND the final node has \`isWord == true\`.
  - \`startsWith(prefix)\`: Walk characters. Return \`true\` iff all prefix nodes exist (regardless of \`isWord\`!).

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "• (root)", "children": ["a"] },
    { "id": "a", "label": "a", "children": ["p"] },
    { "id": "p", "label": "p", "children": ["p2"] },
    { "id": "p2", "label": "p (isWord=true: 'app')", "children": ["l"], "highlight": true },
    { "id": "l", "label": "l", "children": ["e"] },
    { "id": "e", "label": "e (isWord=true: 'apple')", "highlight": true }
  ],
  "rootId": "root",
  "caption": "Implement Trie — Shared node prefix tree supporting O(L) insertions and searches."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Difference Between search() and startsWith()*:
  - \`search("app")\` checks if \`isWord == true\` at the node for the second \`'p'\`.
  - \`startsWith("app")\` returns \`true\` as long as the path \`a -> p -> p\` exists, ignoring \`isWord\`.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What is the primary difference between search(word) and startsWith(prefix) in a Trie?",
          options: [
            "search() checks that the last node has isWord == true; startsWith() only checks that the path exists.",
            "startsWith() sorts the prefix.",
            "search() takes O(N) time while startsWith() takes O(1) time.",
            "There is no difference."
          ],
          correct_index: 0,
          model_answer: "search() requires an exact word match (verifying isWord == true), whereas startsWith() only verifies that the character prefix path exists in the tree.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "What is the time complexity of insert(word) for a word of length L?",
          model_answer: "O(L) time complexity, where L is the length of the string, since we traverse/create exactly L node pointers.",
          difficulty: "basic"
        }
      ]
    },
    {
      slug: "design-add-and-search-words-data-structure",
      title: "Design Add and Search Words Data Structure",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/design-word-search-data-structure",
      summary: "Wildcard dots fork the descent: trie walking becomes backtracking over every child.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners try to use regular expressions or linear string scanning across stored arrays.
*Why this shatters*: Linear regex scanning takes $O(N \\cdot L)$ time per query.

**The Structural Invariant: Trie DFS Backtracking on Wildcards.**
- Insert words into a standard Trie.
- \`search(word)\`: Run DFS backtracking on the Trie:
  - For literal character \`c\`: Check \`node.children[c]\`. If \`null\`, return \`false\`. Recurse to \`node.children[c]\`.
  - For wildcard **\`'.'\`**: Iterate over **ALL 26 possible children** of current \`node\`. If any non-null child branch returns \`true\` recursively, return \`true\`!
  - At end of word index: Return \`node.isWord\`.

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "root (wildcard '.' checks all 3 children)", "children": ["b", "d", "m"] },
    { "id": "b", "label": "b", "children": ["ba"] },
    { "id": "ba", "label": "a", "children": ["bad"] },
    { "id": "bad", "label": "d (isWord=true)", "highlight": true },
    { "id": "d", "label": "d", "children": ["da"] },
    { "id": "da", "label": "a", "children": ["dad"] },
    { "id": "dad", "label": "d (isWord=true)" },
    { "id": "m", "label": "m" }
  ],
  "rootId": "root",
  "caption": "Design Add and Search Words — Wildcard '.' branches DFS across all valid children."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Wildcard Pruning*: Empty child slots in \`node.children\` should be skipped instantly during wildcard evaluation.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How does search(word) handle the wildcard character '.' in the WordDictionary Trie?",
          options: [
            "It skips the wildcard character completely.",
            "It branches DFS recursively to check all 26 possible non-null children of the current node.",
            "It returns true immediately.",
            "It converts the Trie into a Hash Set."
          ],
          correct_index: 1,
          model_answer: "The '.' character matches any letter, forcing a DFS branch to check if any existing child node can complete the remainder of the query.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "What is the worst-case time complexity of searching a word of length L containing only wildcards '...'?",
          model_answer: "O(26^L) worst-case time, as every dot forces exploring all 26 branching child paths down L levels.",
          difficulty: "advanced"
        }
      ]
    },
    {
      slug: "word-search-ii",
      title: "Word Search II",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/search-for-word-ii",
      summary: "Hunt a whole dictionary in one grid walk: the trie prunes every path no word could continue.",
      body: `**Beginner Intuition & The Naive Fallacy.** Beginners run standard Word Search DFS for every single word in the dictionary independently.
*Why this shatters*: Searching $W$ words independently runs $W$ full grid traversals ($O(W \\cdot M \\cdot N \\cdot 4^L)$ time), resulting in TLE.

**The Structural Invariant: Grid DFS Guided by Trie Prefix Pruning.**
Instead of searching for each word in the grid, **build a Trie of all words and search the grid using the Trie to guide DFS**!
- Build Trie containing all words in dictionary. Store full \`word\` string directly at terminal nodes (\`node.word = "oath"\`).
- Run DFS from every cell \`(r, c)\` in grid:
  - If current cell character \`board[r][c]\` is NOT in \`trieNode.children\`, **PRUNE IMMEDIATELY**! (No word in the dictionary starts with this prefix!).
  - If \`trieNode.word\` exists: Add to results, and set \`trieNode.word = null\` to prevent duplicate findings.
  - Mark grid cell as visited \`'#'\`, recurse on 4 direction neighbors, then restore \`board[r][c]\` (Backtracking).

\`\`\`viz:tree
{
  "nodes": [
    { "id": "root", "label": "Trie Root", "children": ["o", "e"] },
    { "id": "o", "label": "o (grid matches 'o')", "children": ["a"] },
    { "id": "a", "label": "a (grid matches 'a')", "children": ["t"] },
    { "id": "t", "label": "t (grid matches 't')", "children": ["h"] },
    { "id": "h", "label": "h (FOUND 'oath'!)", "highlight": true },
    { "id": "e", "label": "e (grid matches 'e')" }
  ],
  "rootId": "root",
  "caption": "Word Search II — Grid DFS guided by Trie prefix pruning."
}
\`\`\`

**Boundary Traps & Execution Blueprint.**
- *Trie Node Pruning Optimization*: After a word is found, remove terminal nodes or decrement child references from the Trie so future grid searches short-circuit instantly!`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why is guiding Grid DFS with a Trie drastically faster than running independent DFS searches for each word?",
          options: [
            "Because Tries sort the grid characters.",
            "Because a single Trie lookup at a grid cell prunes paths for hundreds of dictionary words simultaneously if that prefix does not exist.",
            "Because Tries remove the need for grid backtracking.",
            "Because grid coordinates become 1D indices."
          ],
          correct_index: 1,
          model_answer: "If a cell's character does not exist in the current Trie node's children, no word in the dictionary can continue from that path, pruning all remaining branches in O(1).",
          difficulty: "advanced"
        },
        {
          kind: "open",
          prompt: "How can we prevent duplicate word entries in the result list when a word can be formed via multiple distinct grid paths?",
          model_answer: "Store the completed word string at the Trie node (`node.word`), and upon finding it, set `node.word = null` before adding it to the result set.",
          difficulty: "intermediate"
        }
      ]
    }
  ]
};
