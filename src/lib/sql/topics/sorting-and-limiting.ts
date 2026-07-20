import type { SqlTopic } from "../types";

/** Chapter 4 — Sorting, Limiting & Pagination. */
export const sortingAndLimiting: SqlTopic = {
  slug: "sorting-and-limiting",
  title: "Sorting & Limiting",
  chapter: 4,
  tagline: "ORDER BY, LIMIT, OFFSET — controlling what appears and in what order.",
  color: "#43d6b5",
  prereqs: ["aggregation"],
  unlocks: ["subqueries"],
  intro: `Sorting and limiting are how you turn a raw result set into something useful. ORDER BY arranges rows; LIMIT controls how many you see; OFFSET skips rows for pagination. These tools are simple individually, but they unlock important interview patterns: "find the Nth highest," "find top N per group," and "find consecutive sequences." The problems in this chapter test your ability to combine sorting with the aggregation and join skills from previous chapters.`,
  problems: [
    {
      slug: "second-highest-salary",
      title: "Second Highest Salary",
      leetcodeNumber: 176,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/second-highest-salary/",
      summary: "The classic Nth-value problem — using LIMIT/OFFSET or subquery to find the second-highest salary, handling NULL.",
      body: `**The problem.** Find the second-highest distinct salary from the Employee table. If there is no second-highest, return NULL.

**The query.**
\`\`\`sql
SELECT (
  SELECT DISTINCT salary
  FROM Employee
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
) AS SecondHighestSalary;
\`\`\`

**Why it matters.** This is the most commonly asked "Nth value" problem. The trick has two parts: (1) ORDER BY salary DESC + LIMIT 1 OFFSET 1 gives the second-highest, and (2) wrapping it in an outer SELECT handles the case where no second-highest exists (only one salary) — the subquery returns an empty set, and SELECT on an empty set produces NULL.

\`\`\`viz:table-diff
{
  "columns": ["salary"],
  "before": [[200], [300], [100]],
  "after": [[200]],
  "caption": "DISTINCT salaries ordered DESC: 300, 200, 100. LIMIT 1 OFFSET 1 skips the highest (300) and keeps the second-highest (200); the rest are dropped."
}
\`\`\`

**The insight.** OFFSET 1 skips the first row (the highest salary) and LIMIT 1 takes the next one (the second-highest). DISTINCT is necessary because two employees might share the highest salary — without DISTINCT, OFFSET 1 would give you the same salary again, not the second-highest.

**The thread.** LIMIT/OFFSET solves "find the Nth value" for a single result. But what about "find the Nth value *per group*" — the top salary per department? That requires window functions, which come in a later chapter. First, the next problem generalises this to the Nth highest.`,
    },
    {
      slug: "nth-highest-salary",
      title: "Nth Highest Salary",
      leetcodeNumber: 177,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/nth-highest-salary/",
      summary: "Generalising the second-highest pattern — a function that returns the Nth highest salary.",
      body: `**The problem.** Write a SQL function that returns the Nth highest distinct salary. If there are fewer than N distinct salaries, return NULL.

**The query.**
\`\`\`sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  SET N = N - 1;
  RETURN (
    SELECT DISTINCT salary
    FROM Employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET N
  );
END
\`\`\`

**Why it matters.** This generalises the second-highest problem. The key insight is that OFFSET is 0-indexed: OFFSET 0 gives the 1st highest, OFFSET 1 gives the 2nd, so for Nth you need OFFSET N-1. The SET N = N-1 handles this conversion.

\`\`\`viz:table-diff
{
  "columns": ["salary", "offset_position"],
  "before": [[100, 2], [300, 0], [200, 1]],
  "after": [[100, 2]],
  "caption": "Distinct salaries ordered DESC land at positions 0, 1, 2… For N=3, OFFSET = N-1 = 2 selects the row at position 2."
}
\`\`\`

**The insight.** This is one of the few LeetCode problems that requires you to write a MySQL function (CREATE FUNCTION). The pattern is specific to MySQL; in PostgreSQL you would use a CTE with DENSE_RANK() instead. Know both approaches: LIMIT/OFFSET for MySQL, DENSE_RANK() for PostgreSQL/standard SQL.

**The thread.** Sorting and limiting by position. The next problem uses sorting to answer a different kind of question: "find customers who placed the most recent order" — combining ORDER BY with JOIN.`,
    },
    {
      slug: "game-play-analysis-i",
      title: "Game Play Analysis I",
      leetcodeNumber: 511,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/game-play-analysis-i/",
      summary: "MIN per group — finding each player's first login date using GROUP BY and MIN.",
      body: `**The problem.** Find the first login date for each player.

**The query.**
\`\`\`sql
SELECT player_id, MIN(event_date) AS first_login
FROM Activity
GROUP BY player_id;
\`\`\`

**Why it matters.** Finding the "first" or "last" occurrence per group is one of the most common SQL tasks. MIN(date) gives the earliest; MAX(date) gives the latest. This is simpler than using ORDER BY + LIMIT because GROUP BY handles all groups at once — no need for a correlated subquery or window function.

\`\`\`viz:table-diff
{
  "columns": ["player_id", "event_date"],
  "before": [
    [1, "2016-03-01"],
    [2, "2017-06-25"],
    [1, "2016-05-02"],
    [1, "2017-06-25"]
  ],
  "after": [
    [1, "2016-03-01"],
    [2, "2017-06-25"]
  ],
  "caption": "GROUP BY player_id + MIN(event_date) keeps only each player's earliest login row; later logins for the same player drop out."
}
\`\`\`

**The insight.** When the problem says "first" or "earliest," think MIN(). When it says "last" or "most recent," think MAX(). These are often more efficient than the equivalent ORDER BY + LIMIT approach because the database can use an index on the date column directly with the aggregate function.

**The thread.** MIN and MAX are positional aggregates. The next chapter, Subqueries, teaches you to nest queries inside other queries — the tool you need when a single GROUP BY + aggregate isn't enough to express the question.`,
    },
  ],
};
