import type { SqlTopic } from "../types";

/** Chapter 10 — Common Table Expressions (CTEs). */
export const commonTableExpressions: SqlTopic = {
  slug: "common-table-expressions",
  title: "Common Table Expressions",
  chapter: 10,
  tagline: "WITH clauses — breaking complex queries into named, readable, modular steps.",
  color: "#43d6b5",
  prereqs: ["window-functions-analytics"],
  unlocks: ["advanced-joins-and-set-ops"],
  intro: `A Common Table Expression (CTE) is a named temporary result set defined by a WITH clause. It exists only for the duration of the query and can be referenced like a table. CTEs solve the same problems as subqueries, but they are dramatically more readable — each step gets a descriptive name, and complex logic flows top-to-bottom instead of inside-out.

CTEs come in two forms: *non-recursive* (a named subquery, used once or reused multiple times in the main query) and *recursive* (a CTE that references itself, used for hierarchical data, series generation, and graph traversal). This chapter focuses on non-recursive CTEs — the pattern you'll reach for in the vast majority of interview problems, whether for grouping, unpivoting, or prefiltering before a self-join. (Recursive CTEs, for hierarchical or graph data, are a rarer specialist tool worth knowing about but outside this chapter's scope.)`,
  problems: [
    {
      slug: "managers-with-at-least-5-reports",
      title: "Managers with at Least 5 Direct Reports",
      leetcodeNumber: 570,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/managers-with-at-least-5-direct-reports/",
      summary: "CTE for clarity — computing the count of direct reports per manager, then filtering.",
      body: `**The problem.** Find managers who have at least 5 direct reports.

**The query.**
\`\`\`sql
WITH report_counts AS (
  SELECT managerId, COUNT(*) AS cnt
  FROM Employee
  WHERE managerId IS NOT NULL
  GROUP BY managerId
  HAVING COUNT(*) >= 5
)
SELECT e.name
FROM Employee e
JOIN report_counts rc ON e.id = rc.managerId;
\`\`\`

**Why it matters.** This problem can be solved with a subquery, but the CTE version is cleaner. The first step (report_counts) answers "which manager IDs have >= 5 reports?" The second step joins back to get the manager's name. Each step has a clear purpose and a descriptive name.

\`\`\`viz:table-diff
{
  "columns": ["id", "name", "managerId"],
  "before": [
    [1, "Alice", null],
    [2, "Bob", 1],
    [3, "Carol", 1],
    [4, "Dave", 1],
    [5, "Eve", 1],
    [6, "Frank", 1],
    [9, "Grace", null],
    [7, "Hank", 9],
    [8, "Ivy", 9]
  ],
  "after": [
    [1, "Alice", null]
  ],
  "caption": "Alice (id=1) has 5 direct reports (ids 2-6) — the report_counts CTE keeps her. Grace (id=9) has only 2 (ids 7-8), so HAVING COUNT(*) >= 5 drops her before the join."
}
\`\`\`

**The insight.** CTEs are not just syntactic sugar — they improve maintainability. When debugging, you can run the CTE portion alone to verify intermediate results. In interviews, starting with "I'll use a CTE to break this into steps" immediately signals structured thinking.

**The thread.** Simple named CTE for grouping + filtering. The next problem uses a CTE with UNION ALL to reshape data before aggregating.`,
    },
    {
      slug: "friend-requests-ii",
      title: "Friend Requests II: Who Has the Most Friends",
      leetcodeNumber: 602,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/",
      summary: "CTE with UNION ALL — counting bidirectional friendships by unpivoting the RequestAccepted table.",
      body: `**The problem.** Find the person with the most friends. Friendships are bidirectional: if A is friends with B, then B is also friends with A. The RequestAccepted table has requester_id and accepter_id.

**The query.**
\`\`\`sql
WITH all_friends AS (
  SELECT requester_id AS id FROM RequestAccepted
  UNION ALL
  SELECT accepter_id AS id FROM RequestAccepted
)
SELECT id, COUNT(*) AS num
FROM all_friends
GROUP BY id
ORDER BY num DESC
LIMIT 1;
\`\`\`

**Why it matters.** The CTE "unpivots" the table: each friendship row generates two entries (one for each person). Then a simple GROUP BY + COUNT gives the total friends per person. Without the CTE, you'd need a complex subquery or two separate aggregations joined together.

\`\`\`viz:table-diff
{
  "columns": ["id", "num"],
  "before": [
    [1, null],
    [3, null],
    [2, null],
    [2, null],
    [2, null],
    [3, null]
  ],
  "after": [
    [2, 3]
  ],
  "caption": "all_friends unpivots each (requester, accepter) pair into two id rows. Grouping and counting: id 2 appears 3 times, the most of anyone — the final answer."
}
\`\`\`

**The insight.** UNION ALL (not UNION) is critical here — if person A appears as both requester and accepter in different rows, we want to count both occurrences. UNION would deduplicate and undercount.

**The thread.** CTEs for restructuring data via UNION ALL. The next problem shows a third common CTE role: prefiltering before a self-join.`,
    },
    {
      slug: "consecutive-available-seats",
      title: "Consecutive Available Seats",
      leetcodeNumber: 603,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/consecutive-available-seats/",
      summary: "CTE with self-join — finding pairs of adjacent free seats using a CTE to prefilter.",
      body: `**The problem.** Find all seat IDs that are free and adjacent to at least one other free seat. Two seats are adjacent if their seat_ids differ by 1.

**The query.**
\`\`\`sql
WITH free_seats AS (
  SELECT seat_id FROM Cinema WHERE free = 1
)
SELECT DISTINCT f1.seat_id
FROM free_seats f1
JOIN free_seats f2
  ON ABS(f1.seat_id - f2.seat_id) = 1
ORDER BY f1.seat_id;
\`\`\`

**Why it matters.** The CTE prefilters to only free seats, then a self-join finds pairs that are adjacent (seat_id difference = 1). DISTINCT ensures each qualifying seat appears once. This is a clean example of CTEs making self-joins more readable — without the CTE, you'd repeat the WHERE free = 1 condition twice.

\`\`\`viz:table-diff
{
  "columns": ["seat_id", "free"],
  "before": [
    [1, 1],
    [2, 0],
    [3, 1],
    [4, 1],
    [5, 1]
  ],
  "after": [
    [3, 1],
    [4, 1],
    [5, 1]
  ],
  "caption": "Seat 1 is free but its only neighbour (seat 2) isn't, so it's excluded. Seats 3-4-5 are a free run — each is adjacent to another free seat."
}
\`\`\`

**The insight.** ABS(f1.seat_id - f2.seat_id) = 1 catches both "seat before" and "seat after" in one condition. Without ABS, you'd need \`f1.seat_id = f2.seat_id + 1 OR f1.seat_id = f2.seat_id - 1\`.

**The thread.** CTEs make multi-step queries readable and modular. The next chapter covers advanced joins and set operations — FULL OUTER JOIN, CROSS JOIN, INTERSECT, and EXCEPT — the tools for complex table combinations.`,
    },
  ],
};
