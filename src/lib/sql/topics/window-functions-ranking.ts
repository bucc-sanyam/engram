import type { SqlTopic } from "../types";

/** Chapter 8 — Window Functions: Ranking. */
export const windowFunctionsRanking: SqlTopic = {
  slug: "window-functions-ranking",
  title: "Window Functions — Ranking",
  chapter: 8,
  tagline: "ROW_NUMBER, RANK, DENSE_RANK — numbering and ranking rows without collapsing groups.",
  color: "#f97066",
  prereqs: ["string-and-date-functions"],
  unlocks: ["window-functions-analytics"],
  intro: `Window functions are the most powerful and most tested advanced SQL concept. They let you perform calculations *across a set of rows related to the current row* — without collapsing those rows into a single output like GROUP BY does. The window is defined by PARTITION BY (which rows to include) and ORDER BY (how to arrange them), and the function computes something over that window for each row.

This chapter focuses on the ranking family: ROW_NUMBER() assigns a unique sequential number to each row, RANK() assigns the same number to ties but leaves gaps, and DENSE_RANK() assigns the same number to ties without gaps. These three functions solve the vast majority of "top N," "Nth per group," and "ranking within category" problems.

The conceptual leap: GROUP BY says "collapse these rows into one"; PARTITION BY says "compute across these rows but keep them all." Once you internalise this distinction, window functions become intuitive.`,
  problems: [
    {
      slug: "rank-scores",
      title: "Rank Scores",
      leetcodeNumber: 178,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/rank-scores/",
      summary: "DENSE_RANK — ranking scores without gaps, so tied scores share the same rank.",
      body: `**The problem.** Rank scores in descending order. If two scores are equal, they should have the same rank, and the next rank should be the next consecutive number (no gaps).

**The query.**
\`\`\`sql
SELECT score,
       DENSE_RANK() OVER (ORDER BY score DESC) AS \`rank\`
FROM Scores
ORDER BY score DESC;
\`\`\`

**Why it matters.** This is *the* problem that teaches the difference between RANK and DENSE_RANK. With scores [4.0, 4.0, 3.85, 3.65]: RANK gives [1, 1, 3, 4] (gap after tie); DENSE_RANK gives [1, 1, 2, 3] (no gap). The problem demands no gaps, so DENSE_RANK is correct.

\`\`\`viz:table-diff
{
  "columns": ["score", "rank"],
  "before": [[4.0, null], [4.0, null], [3.85, null], [3.65, null]],
  "after": [[4.0, 1], [4.0, 1], [3.85, 2], [3.65, 3]],
  "caption": "The tied 4.0s share rank 1; the next distinct score gets rank 2, not 3 — no gap."
}
\`\`\`

**The insight.** The three ranking functions: ROW_NUMBER() never ties (arbitrary tiebreaking), RANK() ties and skips (1,1,3), DENSE_RANK() ties without skipping (1,1,2). Memorise this — interviewers love asking which one to use and why.

**The thread.** Global ranking. The next problem introduces PARTITION BY — ranking *within groups* rather than globally.`,
    },
    {
      slug: "department-highest-salary",
      title: "Department Highest Salary",
      leetcodeNumber: 184,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/department-highest-salary/",
      summary: "Window function with PARTITION BY — finding the highest salary in each department, handling ties.",
      body: `**The problem.** Find employees who have the highest salary in their department. Multiple employees can share the highest salary.

**The query.**
\`\`\`sql
SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM (
  SELECT *, DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rk
  FROM Employee
) e
JOIN Department d ON e.departmentId = d.id
WHERE e.rk = 1;
\`\`\`

**Why it matters.** PARTITION BY departmentId creates a separate "window" for each department. Within each window, DENSE_RANK ranks by salary descending. Filtering WHERE rk = 1 keeps only the top-ranked employees in each department. This "rank-then-filter" pattern is the standard way to find "top N per group."

\`\`\`viz:table-diff
{
  "columns": ["department", "employee", "salary", "rk"],
  "before": [
    ["IT", "Joe", 85000, null],
    ["IT", "Jim", 85000, null],
    ["Sales", "Sam", 60000, null],
    ["Sales", "Max", 60000, null],
    ["IT", "Henry", 80000, null]
  ],
  "after": [
    ["IT", "Joe", 85000, 1],
    ["IT", "Jim", 85000, 1],
    ["Sales", "Sam", 60000, 1],
    ["Sales", "Max", 60000, 1]
  ],
  "caption": "Two separate windows (IT, Sales) rank independently — Henry's rk=2 in IT drops him from the rk=1 filter."
}
\`\`\`

**The insight.** You cannot use WHERE directly on a window function (because window functions are evaluated after WHERE in SQL's execution order). The solution is to compute the rank in a subquery or CTE, then filter in the outer query. This two-step pattern is essential.

**The thread.** Top-1 per group. The next problem extends this to top-3 per group — the same pattern, just filtering WHERE rk <= 3.`,
    },
    {
      slug: "department-top-three-salaries",
      title: "Department Top Three Salaries",
      leetcodeNumber: 185,
      difficulty: "Hard",
      leetcodeUrl: "https://leetcode.com/problems/department-top-three-salaries/",
      summary: "Top-N per group — DENSE_RANK partitioned by department to find the three highest distinct salaries.",
      body: `**The problem.** Find employees who earn one of the top three distinct salaries in their department.

**The query.**
\`\`\`sql
SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM (
  SELECT *, DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rk
  FROM Employee
) e
JOIN Department d ON e.departmentId = d.id
WHERE e.rk <= 3;
\`\`\`

**Why it matters.** This is the hard version of the previous problem — same pattern, but filtering WHERE rk <= 3 instead of rk = 1. DENSE_RANK is correct because we want "top three *distinct* salaries" — if three employees share the 2nd-highest salary, they all get rank 2, and we still have room for rank 3. RANK would also work here since the gap doesn't affect the <= 3 filter.

**The insight.** The "rank-then-filter" pattern scales to any top-N: top-1, top-3, top-10. The subquery structure is always the same; only the WHERE condition changes. This is one of the most frequently asked Hard problems in SQL interviews.

**The thread.** Ranking functions let you number and position rows. The next chapter introduces analytical window functions — LEAD, LAG, running SUM, and running AVG — which let you look *across* rows to compute differences, trends, and cumulative values.`,
    },
  ],
};
