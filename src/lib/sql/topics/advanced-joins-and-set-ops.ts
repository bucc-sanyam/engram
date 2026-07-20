import type { SqlTopic } from "../types";

/** Chapter 11 — Advanced JOINs & Set Operations. */
export const advancedJoinsAndSetOps: SqlTopic = {
  slug: "advanced-joins-and-set-ops",
  title: "Advanced JOINs & Set Operations",
  chapter: 11,
  tagline: "CROSS JOIN, FULL OUTER JOIN, UNION, INTERSECT, EXCEPT — complex table combinations.",
  color: "#64748b",
  prereqs: ["common-table-expressions"],
  unlocks: ["data-transformation"],
  intro: `Basic JOINs combine related rows; advanced JOINs combine tables in less obvious ways. CROSS JOIN produces the Cartesian product — every possible pairing — useful for generating combinations or filling gaps. FULL OUTER JOIN keeps all rows from both sides, filling NULLs where either side has no match. Set operations (UNION, INTERSECT, EXCEPT) treat entire result sets as mathematical sets and combine them vertically.

These tools are less commonly needed than INNER and LEFT JOIN, but when the problem calls for them, nothing else will do. The problems here test your ability to recognise when a standard JOIN won't work and an advanced approach is needed.`,
  problems: [
    {
      slug: "employees-with-missing-information",
      title: "Employees With Missing Information",
      leetcodeNumber: 1965,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/employees-with-missing-information/",
      summary: "FULL OUTER JOIN emulation — finding employees missing from either the Employees or Salaries table.",
      body: `**The problem.** Given Employees (employee_id, name) and Salaries (employee_id, salary), find employee IDs that are missing from either table.

**The query.**
\`\`\`sql
SELECT employee_id FROM Employees WHERE employee_id NOT IN (SELECT employee_id FROM Salaries)
UNION
SELECT employee_id FROM Salaries WHERE employee_id NOT IN (SELECT employee_id FROM Employees)
ORDER BY employee_id;
\`\`\`

**Why it matters.** This is effectively a FULL OUTER JOIN problem — you want rows from Employees with no match in Salaries AND rows from Salaries with no match in Employees. MySQL doesn't support FULL OUTER JOIN, so the standard approach is two anti-joins combined with UNION.

\`\`\`viz:table-diff
{
  "columns": ["employee_id", "in_employees", "in_salaries"],
  "before": [
    [90, "yes", "no"],
    [85, "no", "yes"],
    [1, "yes", "yes"],
    [7, "yes", "yes"],
    [11, "yes", "yes"]
  ],
  "after": [
    [90, "yes", "no"],
    [85, "no", "yes"]
  ],
  "caption": "The two anti-joins + UNION keep only ids missing from one side (90, 85); ids present in both tables are filtered out."
}
\`\`\`

**The insight.** In PostgreSQL or SQL Server, the direct approach is: \`SELECT COALESCE(e.employee_id, s.employee_id) FROM Employees e FULL OUTER JOIN Salaries s ON e.employee_id = s.employee_id WHERE e.employee_id IS NULL OR s.employee_id IS NULL\`. Know the UNION workaround for MySQL and the direct approach for other databases.

**The thread.** Missing-data detection using set operations. The next problem uses CROSS JOIN to generate all possible combinations.`,
    },
    {
      slug: "product-sales-analysis-iii",
      title: "Product Sales Analysis III",
      leetcodeNumber: 1070,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/product-sales-analysis-iii/",
      summary: "Finding the first year of sale per product — using a subquery to identify the earliest year, then joining back.",
      body: `**The problem.** For each product, find the product_id, first_year (earliest year it was sold), quantity, and price for that first year.

**The query.**
\`\`\`sql
SELECT s.product_id, s.year AS first_year, s.quantity, s.price
FROM Sales s
JOIN (
  SELECT product_id, MIN(year) AS min_year
  FROM Sales
  GROUP BY product_id
) t ON s.product_id = t.product_id AND s.year = t.min_year;
\`\`\`

**Why it matters.** This is the "join back to get full row details for an aggregate" pattern. The subquery finds the minimum year per product; the JOIN retrieves all columns for those specific rows. This is more efficient than a correlated subquery and more readable than a window function approach for this use case.

\`\`\`viz:table-diff
{
  "columns": ["product_id", "year", "quantity", "price"],
  "before": [
    [1, 2019, 10, 5000],
    [2, 2019, 15, 9000],
    [1, 2020, 20, 5500],
    [2, 2020, 30, 9500]
  ],
  "after": [
    [1, 2019, 10, 5000],
    [2, 2019, 15, 9000]
  ],
  "caption": "The join keeps only each product's earliest-year row (min_year match); later-year rows for the same product are dropped."
}
\`\`\`

**The insight.** An alternative approach uses window functions: \`RANK() OVER (PARTITION BY product_id ORDER BY year) = 1\`. Both are valid; the subquery-join approach is often more intuitive and can be easier to optimise with indexes.

**The thread.** Joining back to aggregates. The next problem combines multiple advanced techniques: CTEs, window functions, and self-joins.`,
    },
    {
      slug: "the-number-of-employees-which-report",
      title: "The Number of Employees Which Report to Each Employee",
      leetcodeNumber: 1731,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/the-number-of-employees-which-report-to-each-employee/",
      summary: "Self-join with aggregation — counting direct reports and computing their average age per manager.",
      body: `**The problem.** For each manager (an employee who is someone's reports_to), find the number of direct reports and the average age of those reports.

**The query.**
\`\`\`sql
SELECT e1.employee_id, e1.name,
       COUNT(*) AS reports_count,
       ROUND(AVG(e2.age)) AS average_age
FROM Employees e1
INNER JOIN Employees e2 ON e1.employee_id = e2.reports_to
GROUP BY e1.employee_id, e1.name
ORDER BY e1.employee_id;
\`\`\`

**Why it matters.** This combines self-join (employee table joined to itself via reports_to) with aggregation (COUNT and AVG). The INNER JOIN naturally filters to only managers (those who appear as someone's reports_to). GROUP BY the manager produces one row per manager with their report statistics.

\`\`\`viz:table-diff
{
  "columns": ["employee_id", "name", "reports_to", "age", "reports_count", "average_age"],
  "before": [
    [1, "Boss", null, 50, null, null],
    [2, "Alice", 1, 30, null, null],
    [3, "Bob", 1, 40, null, null],
    [4, "Carol", 2, 35, null, null]
  ],
  "after": [
    [1, "Boss", null, null, 2, 35],
    [2, "Alice", null, null, 1, 35]
  ],
  "caption": "The self-join + GROUP BY collapses each manager's raw row into a summary row (reports_count, average_age); non-manager rows (Bob, Carol) drop out entirely."
}
\`\`\`

**The insight.** ROUND(AVG(e2.age)) rounds to the nearest integer — a common requirement. Some databases default to integer division; using ROUND explicitly ensures consistent behaviour across dialects.

**The thread.** Advanced joins and set operations chapter complete. The final chapter covers data transformation — pivoting, unpivoting, and reshaping data to answer the most complex interview questions.`,
    },
  ],
};
