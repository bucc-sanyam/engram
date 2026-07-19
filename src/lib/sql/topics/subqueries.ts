import type { SqlTopic } from "../types";

/** Chapter 5 — Subqueries: queries inside queries. */
export const subqueries: SqlTopic = {
  slug: "subqueries",
  title: "Subqueries",
  chapter: 5,
  tagline: "Scalar, column, table, and correlated subqueries — nesting queries to answer multi-step questions.",
  color: "#a78bfa",
  prereqs: ["sorting-and-limiting"],
  unlocks: ["case-when"],
  intro: `A subquery is a query nested inside another query. It answers a question that the outer query needs as input. "Find employees who earn more than the average salary" requires two steps: (1) compute the average salary, (2) filter employees above it. A subquery lets you express both steps in a single statement.

Subqueries come in four flavours: *scalar* (returns one value), *column* (returns one column), *table* (returns a full result set), and *correlated* (references the outer query, running once per outer row). Each has its place, and knowing when to use which is a core interview skill. The problems here progress from simple scalar subqueries to correlated subqueries, building toward CTEs (the cleaner alternative) in a later chapter.`,
  problems: [
    {
      slug: "employees-whose-manager-left",
      title: "Employees Whose Manager Left the Company",
      leetcodeNumber: 1978,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/employees-whose-manager-left-the-company/",
      summary: "Subquery with NOT IN — find employees whose manager_id doesn't exist in the employees table.",
      body: `**The problem.** Find employees with salary < 30000 whose manager has left the company (their manager_id is not in the table).

**The query.**
\`\`\`sql
SELECT employee_id
FROM Employees
WHERE salary < 30000
  AND manager_id IS NOT NULL
  AND manager_id NOT IN (SELECT employee_id FROM Employees)
ORDER BY employee_id;
\`\`\`

**Why it matters.** This is a classic NOT IN subquery — "find rows where a value doesn't exist in another set." The subquery \`SELECT employee_id FROM Employees\` builds the set of all current employee IDs; NOT IN checks whether each employee's manager_id is absent from that set.

**The insight.** NOT IN has a dangerous NULL trap: if the subquery returns any NULL value, NOT IN returns UNKNOWN for *every* row, and you get zero results. Always ensure the subquery column is NOT NULL, or use NOT EXISTS instead (which handles NULLs correctly). In this problem, employee_id is a primary key (no NULLs), so NOT IN is safe.

**The thread.** NOT IN uses a subquery as a lookup set. The next problem introduces a scalar subquery — one that returns a single value used as a comparison target.`,
    },
    {
      slug: "exchange-seats",
      title: "Exchange Seats",
      leetcodeNumber: 626,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/exchange-seats/",
      summary: "Swapping adjacent rows — using CASE WHEN with a subquery to handle the last-row edge case.",
      body: `**The problem.** Swap every two consecutive students' seats. If the number of students is odd, the last student stays in place.

**The query.**
\`\`\`sql
SELECT
  CASE
    WHEN id % 2 = 1 AND id = (SELECT MAX(id) FROM Seat) THEN id
    WHEN id % 2 = 1 THEN id + 1
    ELSE id - 1
  END AS id,
  student
FROM Seat
ORDER BY id;
\`\`\`

**Why it matters.** This combines CASE WHEN with a scalar subquery. The subquery \`SELECT MAX(id) FROM Seat\` computes the total number of rows. The CASE logic uses it to handle the edge case: if id is odd and it's the last row, don't swap (keep the same id). The subquery runs once and its result is used in every row's CASE evaluation.

**The insight.** Scalar subqueries in SELECT or WHERE clauses are evaluated once (or once per outer row if correlated). They're the simplest way to inject a computed value (count, max, average) into a row-level expression. Think of them as "computed constants."

**The thread.** Scalar subqueries return one value. The next problem uses a table subquery — a subquery in the FROM clause that acts as a virtual table.`,
    },
    {
      slug: "movie-rating",
      title: "Movie Rating",
      leetcodeNumber: 1341,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/movie-rating/",
      summary: "UNION ALL of two independent subqueries — finding the top user and top movie separately and combining results.",
      body: `**The problem.** Find: (1) the user who rated the most movies (alphabetically first if tie), and (2) the movie with the highest average rating in February 2020 (alphabetically first if tie). Return both as a single result column.

**The query.**
\`\`\`sql
(SELECT u.name AS results
 FROM MovieRating mr
 JOIN Users u ON mr.user_id = u.user_id
 GROUP BY mr.user_id
 ORDER BY COUNT(*) DESC, u.name
 LIMIT 1)
UNION ALL
(SELECT m.title AS results
 FROM MovieRating mr
 JOIN Movies m ON mr.movie_id = m.movie_id
 WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
 GROUP BY mr.movie_id
 ORDER BY AVG(mr.rating) DESC, m.title
 LIMIT 1);
\`\`\`

**Why it matters.** This is two independent queries combined with UNION ALL. Each query answers a different question, and UNION ALL stacks them vertically. The trick is that each subquery has its own ORDER BY and LIMIT — you must wrap them in parentheses in MySQL for the ORDER BY to apply to the subquery (not the entire UNION).

**The insight.** UNION ALL keeps duplicates; UNION removes them. Use UNION ALL when you know the results are already distinct or when duplicates are meaningful. UNION ALL is always faster because it skips the deduplication step.

**The thread.** Subqueries let you express multi-step questions. But deeply nested subqueries become unreadable. The next chapter introduces CASE WHEN for row-level conditional logic, and later CTEs will offer a cleaner alternative to complex nesting.`,
    },
  ],
};
