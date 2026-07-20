import type { SqlTopic } from "../types";

/** Chapter 12 — Data Transformation: pivoting, unpivoting, and reshaping. */
export const dataTransformation: SqlTopic = {
  slug: "data-transformation",
  title: "Data Transformation & Pivoting",
  chapter: 12,
  tagline: "Reshaping data — turning rows into columns, columns into rows, and producing final report-ready output.",
  color: "#ef4444",
  prereqs: ["advanced-joins-and-set-ops"],
  unlocks: [],
  intro: `The final chapter brings together everything you have learned. Data transformation problems don't test one SQL concept — they test your ability to *combine* concepts: CTEs for modular steps, window functions for ranking, CASE WHEN for pivoting, JOINs for combining, and aggregation for summarising.

Pivoting turns row values into column headers (the classic "reformat a table" pattern). Unpivoting turns columns back into rows. These are the most complex SQL patterns you will encounter in interviews, and they require you to think about data as a shape that can be reshaped — not just filtered or aggregated, but structurally transformed.

These problems are interview capstones. If you can solve them cleanly, you have mastered SQL.`,
  problems: [
    {
      slug: "reformat-department-table",
      title: "Reformat Department Table",
      leetcodeNumber: 1179,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/reformat-department-table/",
      summary: "Classic pivot — turning month rows into columns using SUM + CASE WHEN + GROUP BY.",
      body: `**The problem.** The Department table has (id, revenue, month). Pivot it so each row is a department and each column is a month (Jan_Revenue, Feb_Revenue, ..., Dec_Revenue).

**The query.**
\`\`\`sql
SELECT id,
       SUM(CASE WHEN month = 'Jan' THEN revenue END) AS Jan_Revenue,
       SUM(CASE WHEN month = 'Feb' THEN revenue END) AS Feb_Revenue,
       SUM(CASE WHEN month = 'Mar' THEN revenue END) AS Mar_Revenue,
       SUM(CASE WHEN month = 'Apr' THEN revenue END) AS Apr_Revenue,
       SUM(CASE WHEN month = 'May' THEN revenue END) AS May_Revenue,
       SUM(CASE WHEN month = 'Jun' THEN revenue END) AS Jun_Revenue,
       SUM(CASE WHEN month = 'Jul' THEN revenue END) AS Jul_Revenue,
       SUM(CASE WHEN month = 'Aug' THEN revenue END) AS Aug_Revenue,
       SUM(CASE WHEN month = 'Sep' THEN revenue END) AS Sep_Revenue,
       SUM(CASE WHEN month = 'Oct' THEN revenue END) AS Oct_Revenue,
       SUM(CASE WHEN month = 'Nov' THEN revenue END) AS Nov_Revenue,
       SUM(CASE WHEN month = 'Dec' THEN revenue END) AS Dec_Revenue
FROM Department
GROUP BY id;
\`\`\`

**Why it matters.** This is *the* canonical pivot pattern. Each CASE WHEN selects revenue only for a specific month; SUM aggregates it (and returns NULL for months with no data). GROUP BY id collapses all rows for each department into a single row. This pattern works in every SQL dialect — no PIVOT keyword needed.

\`\`\`viz:table-diff
{
  "columns": ["id", "Jan_Revenue", "Feb_Revenue", "Mar_Revenue"],
  "before": [
    [1, 8000, null, null],
    [2, 9000, null, null],
    [1, null, 6000, null],
    [2, null, 5000, null],
    [1, null, null, 7000]
  ],
  "after": [
    [1, 8000, 6000, 7000],
    [2, 9000, 5000, null]
  ],
  "caption": "Showing 3 of the 12 months for clarity. Each raw (id, revenue, month) row lands in one column slot; GROUP BY id + SUM collapses the sparse rows into one dense row per department (department 2 has no March row, so Mar_Revenue is NULL)."
}
\`\`\`

**The insight.** SUM(CASE WHEN ... THEN value END) is the universal pivot tool. CASE without ELSE defaults to NULL; SUM ignores NULLs. So for months without data, the result is NULL (not 0). If you want 0 instead, wrap in IFNULL or COALESCE.

**The thread.** Pivoting with known categories. The next problem applies multiple techniques to a harder transformation.`,
    },
    {
      slug: "count-salary-categories",
      title: "Count Salary Categories",
      leetcodeNumber: 1907,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/count-salary-categories/",
      summary: "Guaranteed-output pivot — ensuring all categories appear even when empty, using UNION + conditional COUNT.",
      body: `**The problem.** Categorise bank accounts into 'Low Salary' (< 20000), 'Average Salary' (20000–50000), and 'High Salary' (> 50000). Report the count for *each* category, even if it's zero.

**The query.**
\`\`\`sql
SELECT 'Low Salary' AS category,
       SUM(CASE WHEN income < 20000 THEN 1 ELSE 0 END) AS accounts_count
FROM Accounts
UNION ALL
SELECT 'Average Salary',
       SUM(CASE WHEN income BETWEEN 20000 AND 50000 THEN 1 ELSE 0 END)
FROM Accounts
UNION ALL
SELECT 'High Salary',
       SUM(CASE WHEN income > 50000 THEN 1 ELSE 0 END)
FROM Accounts;
\`\`\`

**Why it matters.** The tricky requirement is "even if the count is zero." A GROUP BY approach with CASE WHEN in GROUP BY would drop categories with zero rows. The UNION ALL approach guarantees all three categories appear because each SELECT is independent — even if SUM evaluates to 0, the row exists.

\`\`\`viz:table-diff
{
  "columns": ["account_id", "income", "category"],
  "before": [
    [3, 108939, null],
    [2, 12747, null],
    [8, 87709, null],
    [6, 91796, null]
  ],
  "after": [
    [3, 108939, "High Salary"],
    [2, 12747, "Low Salary"],
    [8, 87709, "High Salary"],
    [6, 91796, "High Salary"]
  ],
  "caption": "Each account is classified by CASE WHEN. The final query SUMs these into three rows regardless of counts: Low Salary=1, Average Salary=0, High Salary=3 — UNION ALL guarantees the zero-count row still appears."
}
\`\`\`

**The insight.** Whenever the problem says "include categories with zero count," you need a guaranteed source of categories. UNION ALL with hardcoded category names is one approach; a calendar/dimension table LEFT JOINed to the data is another. The guaranteed-output pattern is a common trap — many candidates get the logic right but miss the empty-category requirement.

**The thread.** Guaranteed output with UNION ALL. The final problem is the capstone — a complex transformation combining multiple advanced techniques.`,
    },
    {
      slug: "confirmation-rate",
      title: "Confirmation Rate",
      leetcodeNumber: 1934,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/confirmation-rate/",
      summary: "Capstone: LEFT JOIN + conditional aggregation — computing a confirmation rate per user, defaulting to 0 for users with no requests.",
      body: `**The problem.** Find the confirmation rate for each user. The confirmation rate is the number of 'confirmed' messages divided by the total number of requested confirmation messages. Users who never requested a confirmation have a rate of 0.

**The query.**
\`\`\`sql
SELECT s.user_id,
       ROUND(IFNULL(AVG(CASE WHEN c.action = 'confirmed' THEN 1 ELSE 0 END), 0), 2) AS confirmation_rate
FROM Signups s
LEFT JOIN Confirmations c ON s.user_id = c.user_id
GROUP BY s.user_id;
\`\`\`

**Why it matters.** This problem is a capstone because it combines nearly everything from the series: LEFT JOIN (to keep users with no confirmations), CASE WHEN (to flag confirmed actions), AVG (to compute the rate), IFNULL (to handle NULL for users with zero requests), and ROUND (to format the output). Each technique alone is simple; combining them cleanly in one query is the mark of SQL fluency.

\`\`\`viz:table-diff
{
  "columns": ["user_id", "action", "confirmed_flag"],
  "before": [
    [1, "confirmed", null],
    [1, "confirmed", null],
    [2, "confirmed", null],
    [2, "timeout", null]
  ],
  "after": [
    [1, "confirmed", 1],
    [1, "confirmed", 1],
    [2, "confirmed", 1],
    [2, "timeout", 0]
  ],
  "caption": "Each row flags confirmed=1/timeout=0; AVG per user_id gives user 1: 1.00, user 2: 0.50. A user in Signups with no Confirmations rows (LEFT JOIN produces no matches) gets IFNULL(AVG(...), 0) = 0.00."
}
\`\`\`

**The insight.** AVG(CASE WHEN ... THEN 1 ELSE 0 END) computes the percentage of rows meeting a condition. This is equivalent to COUNT(confirmed)/COUNT(*), but the AVG+CASE pattern is more versatile — it generalises to weighted averages, multi-condition rates, and conditional proportions. It is the single most useful aggregation pattern in analytics SQL.

**The thread.** That closes the series. You have walked from SELECT to window functions, from simple filters to complex pivots. The path was: filter → join → aggregate → sort → subquery → conditional logic → string/date functions → ranking → analytics → CTEs → advanced joins → transformation. Each chapter built on the last, and each problem handed off to the next. If you have read this far, you have a comprehensive SQL foundation — practice the LeetCode links, and the interview will take care of itself.`,
    },
  ],
};
