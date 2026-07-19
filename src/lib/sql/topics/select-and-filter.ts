import type { SqlTopic } from "../types";

/** Chapter 1 — SELECT & Filtering: the first words every query speaks. */
export const selectAndFilter: SqlTopic = {
  slug: "select-and-filter",
  title: "SELECT & Filtering",
  chapter: 1,
  tagline: "WHERE, AND, OR, IN, LIKE, IS NULL — the foundation every query is built on.",
  color: "#5ba4cf",
  prereqs: [],
  unlocks: ["basic-joins"],
  intro: `Every SQL query begins with the same two words: SELECT FROM. You name the columns you want, you name the table they live in, and the database hands them back. Everything else in SQL — joins, aggregation, window functions, CTEs — is layered on top of this foundation. If SELECT FROM is the skeleton, then WHERE is the first muscle: the clause that filters rows, keeping only those that satisfy a condition.

This chapter is about mastering the filter. You will learn to use comparison operators (=, <>, <, >), logical connectives (AND, OR, NOT), set membership (IN), range checks (BETWEEN), pattern matching (LIKE with % and _ wildcards), and the special case of missing data (IS NULL, IS NOT NULL). These are not glamorous tools, but they are the ones you will use in every single query you ever write, and getting them wrong — confusing NULL semantics, misplacing parentheses in compound conditions — is how experienced engineers fail easy interview questions.

The problems here are sequenced from the simplest possible SELECT (Recyclable and Low Fat Products) through increasingly demanding filters, culminating in queries where the real challenge is understanding what the question is *really* asking, not the SQL syntax itself.`,
  problems: [
    {
      slug: "recyclable-and-low-fat-products",
      title: "Recyclable and Low Fat Products",
      leetcodeNumber: 1757,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/recyclable-and-low-fat-products/",
      summary: "The simplest possible WHERE — filter rows by two column conditions with AND.",
      body: `**The problem.** Given a Products table with columns product_id, low_fats (Y/N), and recyclable (Y/N), find all product IDs that are both low fat AND recyclable.

**The query.**
\`\`\`sql
SELECT product_id
FROM Products
WHERE low_fats = 'Y' AND recyclable = 'Y';
\`\`\`

**Why it matters.** This is SQL's "Hello World." The entire problem is a single WHERE clause with two conditions joined by AND. But it establishes the pattern that every filter-based query follows: FROM names the source, WHERE names the condition, SELECT names the output. Get this right and everything else is just adding complexity to the same skeleton.

**The insight.** AND means *both* conditions must be true for the row to pass. If you used OR, you would get products that are low fat but not recyclable, or recyclable but not low fat — a common mistake in interviews. Know the truth table: AND is restrictive (fewer rows), OR is permissive (more rows).

**The thread.** You filtered on exact equality. The next problem introduces a different kind of filter: finding rows where a value is *missing* entirely — the IS NULL check, which behaves differently from every other comparison.`,
    },
    {
      slug: "find-customer-referee",
      title: "Find Customer Referee",
      leetcodeNumber: 584,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/find-customer-referee/",
      summary: "The NULL trap — why WHERE referee_id != 2 silently drops NULL rows, and how to fix it.",
      body: `**The problem.** Find the names of customers who are NOT referred by the customer with id = 2. The referee_id column can be NULL (meaning no referrer).

**The query.**
\`\`\`sql
SELECT name
FROM Customer
WHERE referee_id != 2 OR referee_id IS NULL;
\`\`\`

**Why it matters.** This problem exists to teach you the most important gotcha in SQL: **NULL is not a value — it is the absence of a value.** Any comparison with NULL returns UNKNOWN (not TRUE, not FALSE), and WHERE only keeps rows where the condition is TRUE. So \`WHERE referee_id != 2\` silently drops all rows where referee_id is NULL — even though "no referrer" is clearly not "referred by customer 2." You must explicitly include \`OR referee_id IS NULL\` to capture them.

**The insight.** The three-valued logic of SQL (TRUE, FALSE, UNKNOWN) is the single most common source of bugs in production queries. Memorise: \`NULL = NULL\` is UNKNOWN, \`NULL != anything\` is UNKNOWN, and WHERE drops UNKNOWN. Whenever you see a nullable column in a filter, ask yourself: "what happens to the NULLs?"

**The thread.** You now handle the basic filter toolkit: equality, AND, and NULL. The next problem stretches filtering into pattern matching with LIKE — where you search for substrings rather than exact values.`,
    },
    {
      slug: "big-countries",
      title: "Big Countries",
      leetcodeNumber: 595,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/big-countries/",
      summary: "OR conditions — find countries that are big by area OR by population.",
      body: `**The problem.** A country is "big" if it has an area ≥ 3,000,000 km² OR a population ≥ 25,000,000. Find the name, population, and area of all big countries.

**The query.**
\`\`\`sql
SELECT name, population, area
FROM World
WHERE area >= 3000000 OR population >= 25000000;
\`\`\`

**Why it matters.** The problem introduces OR — the permissive logical connective. A row passes if *either* condition is true (or both). This is the conceptual opposite of AND, and confusing the two is a surprisingly common interview mistake, especially in compound conditions with parentheses.

**The insight.** In performance terms, OR conditions can be harder for the database to optimise than AND conditions. An AND on two indexed columns can use both indexes to narrow the search; an OR typically requires a UNION of two index scans. For interview purposes, just know that UNION ALL is sometimes used as a performance alternative to OR: \`SELECT ... WHERE area >= 3M UNION ALL SELECT ... WHERE population >= 25M AND area < 3M\`. Mentioning this shows query-optimisation awareness.

**The thread.** You have filtered on exact values, NULLs, and numeric ranges. The next problem, Article Views, introduces a self-referential filter: finding rows where two columns of the *same* row have the same value.`,
    },
    {
      slug: "article-views-i",
      title: "Article Views I",
      leetcodeNumber: 1148,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/article-views-i/",
      summary: "Self-referential filter — find authors who viewed their own articles using a same-row column comparison.",
      body: `**The problem.** Given a Views table with author_id and viewer_id, find all authors who viewed at least one of their own articles. Return distinct author IDs, sorted ascending.

**The query.**
\`\`\`sql
SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id
ORDER BY id;
\`\`\`

**Why it matters.** This introduces the idea of comparing two columns *within the same row* — a filter that does not compare against a constant value but against another piece of the row's own data. It also introduces DISTINCT (to deduplicate) and ORDER BY (to sort).

**The insight.** DISTINCT is a deduplication tool, but it is also a performance signal: it tells you that the underlying data may have duplicates (an author can view the same article multiple times). In interviews, always ask: "can there be duplicates in the source data?" If yes, decide whether your result should deduplicate.

**The thread.** You have now covered the core filter vocabulary: equality, NULL, ranges, OR, column-to-column comparison, DISTINCT, ORDER BY. The next problem, Invalid Tweets, adds string-length filtering — a preview of the string functions that become essential in later chapters.`,
    },
    {
      slug: "invalid-tweets",
      title: "Invalid Tweets",
      leetcodeNumber: 1683,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/invalid-tweets/",
      summary: "String-length filtering — using CHAR_LENGTH to find tweets that exceed 15 characters.",
      body: `**The problem.** Find the IDs of tweets where the content is strictly more than 15 characters.

**The query.**
\`\`\`sql
SELECT tweet_id
FROM Tweets
WHERE CHAR_LENGTH(content) > 15;
\`\`\`

**Why it matters.** This is your first encounter with a SQL *function* inside a WHERE clause. CHAR_LENGTH (or LEN in SQL Server) returns the number of characters in a string. The filter applies not to a raw column value but to a *computed* value. This pattern — filter on a function of the data — is the gateway to all the string, date, and math functions you will use in harder problems.

**The insight.** Use CHAR_LENGTH, not LENGTH. In some databases, LENGTH counts *bytes* (which matters for multi-byte character sets like UTF-8), while CHAR_LENGTH always counts *characters*. For interview purposes, CHAR_LENGTH is the safe choice.

**The thread.** This closes chapter one. You can now filter on values, NULLs, patterns, string properties, and column comparisons. But filtering only works on a single table. The real power of SQL comes from *combining* tables — and that is what JOINs, the next chapter, are all about.`,
    },
  ],
};
