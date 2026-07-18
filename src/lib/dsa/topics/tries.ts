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
  intro: `Store a dictionary in a hash set and you can answer exactly one question fast: "is this exact word present?" Ask anything *prefix-shaped* — does anything start with "pre"? what are the autocompletions of "aut"? — and the set makes you scan everything it holds. The trie (from re*trie*val, usually pronounced "try") is the structure that makes prefixes first-class. It is a tree where each node fans out by *letter*: the root is the empty string, and every step down appends one character. A word is a root-to-node path; a shared prefix is a shared path. "apple" and "apply" ride the same four nodes and split only at the last letter — the dictionary's redundancy becomes the structure's compression.

Two design details do all the work. Each node holds a small map (or 26-slot array) from character to child. And each node carries one boolean — *is a word ending here?* — which is easy to underestimate and impossible to skip: "app" may be a real word while also being a waypoint on the road to "apple", and the flag is the only thing distinguishing word from mere prefix. Every trie bug in every interview traces back to conflating those two ideas.

Why does this small chapter sit here, after Trees and Backtracking? Because its three problems are exactly those two chapters composed. Implement Trie is Trees discipline — build the node, walk the paths, respect the flag. Design Add and Search Words drops a wildcard into queries, and the moment one character can be *anything*, the walk forks — search becomes backtracking down multiple children. And Word Search II welds the trie onto the letter-grid DFS from Word Search: hunting hundreds of dictionary words in one board walk, with the trie acting as a *shared prefix-pruner* that kills doomed paths after one letter. It is one of the great "two patterns snap together" moments in the entire 150.

Tries power autocomplete boxes, spell checkers, IP routing tables (longest-prefix match), and tokenizers. On the roadmap this node is a leaf — nothing unlocks from it — but the lesson generalises: when your keys are *sequences* and your queries are about *their beginnings*, give the structure the same shape as the data.`,
  problems: [
    {
      slug: "implement-trie-prefix-tree",
      title: "Implement Trie (Prefix Tree)",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/implement-prefix-tree",
      summary: "Nodes mapping letters to children, plus one end-of-word flag — insert, search, and startsWith.",
      body: `**The problem.** Build the structure itself: insert(word), search(word) — exact word present? — and startsWith(prefix) — any word begin this way? The rare interview problem that is pure construction, no algorithmic twist; the twist is doing it *cleanly*.

**The node.** Two fields: children — a map from character to child node (a 26-slot array when the alphabet is lowercase English; a hash map when it might not be) — and isWord, the end-of-word flag. No node stores its own character; **the letter lives on the edge**, implicitly, as the key under which the parent reaches you. The root is an empty node: the zero-length prefix shared by everything.

**The three walks.** All three operations are the *same walk* with different endings — seeing that collapses the problem to one mental motion. Insert: descend character by character, *creating* any missing child, and stamp isWord on the final node. Search: descend, *failing* on any missing child; arriving is not enough — return the final node's isWord (the flag separating word from waypoint). startsWith: identical descent; arrival alone is success — some insertion built this path, so some word extends it. Factor the shared descent into a helper returning the final node (or null), and each public method becomes one line — the refactor *is* the demonstration of understanding.

**The walk-through.** insert("apple"): root grows a → p → p → l → e, flag on e. search("app") → path exists, flag absent → false. startsWith("app") → path exists → true. insert("app") → walk existing nodes, stamp the second p. search("app") → true now. Nothing was duplicated; "app" cost zero new nodes.

**Complexity.** Every operation O(length of the key) — *independent of dictionary size*, the trie's headline. A million stored words or ten: "apple" costs five steps. Space O(total characters) worst case, less as prefixes overlap; the 26-array trades memory for speed against the hash-map node, a classic knob to mention.

**The thread.** Structure built. Next problem bends the walk: a query character that matches *anything* — and the single descent becomes a branching search.`,
    },
    {
      slug: "design-add-and-search-words-data-structure",
      title: "Design Add and Search Words Data Structure",
      difficulty: "Medium",
      neetcodeUrl: "https://neetcode.io/problems/design-word-search-data-structure",
      summary: "Wildcard dots fork the descent: trie walking becomes backtracking over every child.",
      body: `**The problem.** Same structure, one upgrade: search may contain dots, and a dot matches *any single character*. add("bad"), add("dad") → search("b..") is true, search(".ad") is true, search("..") is false. One character of syntax, and the whole texture of the walk changes.

**The insight.** A literal character permits exactly one continuation: follow that child or fail. A dot permits *every* continuation: the walk must try each child of the current node — and if one branch dies deeper down, return and try the next. That is backtracking, chapter nine verbatim, landed inside a data structure: choose a child, explore the remainder of the query beneath it, and (nothing to unchoose here — the walk mutates nothing) fall back to the loop for the next child. Recursion carries (current node, index into the query); literal characters advance one child deterministically, dots fan out, and success anywhere bubbles true through the ORs.

**The endings, precise as ever.** Query exhausted → return the current node's isWord — the flag discipline survives wildcards; "b." must not match a mere prefix "ba" of "bad". Child missing under a literal → false, prune instantly. Note the asymmetry that makes the structure still worth it: *literal segments stay O(1) per step* — only dots pay the fan-out. ".ad" explores all 26 potential first children but then runs each surviving branch deterministically.

**The walk-through.** Trie holds bad, dad, mad. search(".ad"): root's dot tries child b → deterministic a, d, flag ✓ — true unwinds immediately, never visiting d or m. search("b.."): b → dot tries a → dot tries d → flag ✓ → true. search(".."): every 2-step path — ba, da, ma — lands on unflagged nodes → false.

**Complexity.** Literal-only queries: O(length). Worst case (all dots): O(total trie nodes) — the query degenerates into "does any word of this length exist," and the walk sweeps the structure. State both; the gap *is* the design analysis.

**The thread.** Trie plus backtracking, inside the structure. The finale inverts the direction: the trie walks *alongside* a grid DFS, pruning a multi-word hunt — Word Search II.`,
    },
    {
      slug: "word-search-ii",
      title: "Word Search II",
      difficulty: "Hard",
      neetcodeUrl: "https://neetcode.io/problems/search-for-word-ii",
      summary: "Hunt a whole dictionary in one grid walk: the trie prunes every path no word could continue.",
      body: `**The problem.** A letter grid and a dictionary of words: return every word traceable through adjacent cells, no cell reused per word. Word Search asked about one word; this asks about *hundreds* — and running the single-word DFS per word re-walks the same board into the ground. The dictionary needs to be searched *collectively*.

**The insight.** Build a trie of all the words, then run **one** DFS over the grid — walking the board and the trie *in lockstep*. Standing on a cell with letter c, holding a trie node t: if t has no child under c, stop — *no word in the entire dictionary* continues through this cell from this path. That is the trie acting as a shared pruner: one lookup vetoes hundreds of words at once, which is precisely what the per-word approach could never do. If the child exists, descend both worlds together — mark the cell (Word Search's choose), recurse into neighbours holding the child node, restore the cell (unchoose). Whenever the current trie node carries a word-end flag, harvest that word — and keep walking, since it may extend into a longer one ("cat" continuing toward "cattle").

**The refinements that make it sing.** Harvested words re-harvest on other paths — clear the flag (or store the word on the node and null it) after first collection: dedup by *mutating the trie*. Better still, prune harder: after a subtree yields all its words, it is dead weight — delete child pointers that lead nowhere live, and the trie *shrinks as the search succeeds*, accelerating every later path. This turn-the-dictionary-into-a-guide inversion is why the problem is a classic: the data structure is not being queried, it is *steering the search*.

**The walk-through.** Words [oath, pea, eat, rain], grid rows oaan / etae / ihkr / iflv. DFS from o: trie has o → a → walk to a, t, h — harvest "oath". From e (row 1): e → a → t — "eat". Cells starting p or r die at the root lookup — one comparison each.

**Complexity.** O(cells · 3^maxWordLength) worst case, but the trie's veto makes real behaviour dramatically better; trie build O(total characters).

**The thread.** Two structures, one search — the atlas's cleanest fusion, and the trie chapter closes. Next: the country all these walks were training for. Graphs — where nodes connect however they please, cycles are real, and the visited set stops being optional.`,
    },
  ],
};
