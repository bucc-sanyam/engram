import type { SqlTopic } from "../types";

/** Chapter 3 — Aggregation: GROUP BY, HAVING, and aggregate functions. */
export const aggregation: SqlTopic = {
  slug: "aggregation",
  title: "Aggregation & GROUP BY",
  chapter: 3,
  tagline: "COUNT, SUM, AVG, MIN, MAX — collapsing rows into summaries with GROUP BY and HAVING.",
  color: "#f5b95f",
  prereqs: ["basic-joins"],
  unlocks: ["sorting-and-limiting", "case-when"],
  intro: `If JOINs expand your data horizontally (more columns), aggregation compresses it vertically (fewer rows). GROUP BY partitions rows into buckets, and aggregate functions (COUNT, SUM, AVG, MIN, MAX) summarise each bucket into a single number. The result is one row per group — and that transformation is the backbone of every report, dashboard, and analytics query ever written.

The critical conceptual hurdle is the difference between WHERE and HAVING. WHERE filters *rows* before grouping; HAVING filters *groups* after aggregation. You cannot use an aggregate function in WHERE (because the groups don't exist yet), and you generally shouldn't filter raw column values in HAVING (because it's less efficient than filtering early with WHERE). This row-vs-group distinction is the most commonly tested concept in SQL interviews.

The problems here progress from simple counts to conditional aggregation, GROUP BY with multiple columns, and the subtle art of knowing when to count, when to sum, and when to average.`,
  problems: [
    {
      slug: "not-boring-movies",
      title: "Not Boring Movies",
      leetcodeNumber: 620,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/not-boring-movies/",
      summary: "Compound WHERE with modulo — find movies with odd IDs and non-boring descriptions.",
      body: `**The problem.** Find movies with an odd-numbered id and a description that is not "boring." Order by rating descending.

**The query.**
\`\`\`sql
SELECT *
FROM Cinema
WHERE id % 2 = 1 AND description != 'boring'
ORDER BY rating DESC;
\`\`\`

**Why it matters.** This bridges filtering and the aggregation chapter by introducing the modulo operator (% for odd/even) and compound WHERE conditions. It's also your first encounter with ORDER BY DESC — sorting results by a numeric column in descending order.

**The insight.** The modulo trick for odd/even (\`id % 2 = 1\` for odd, \`id % 2 = 0\` for even) is a pattern that appears in many SQL problems. Some databases use MOD(id, 2) instead of %. Know both.

**The thread.** Filtering on computed values. The next problem introduces the real star of this chapter: GROUP BY with COUNT to find duplicates.`,
    },
    {
      slug: "duplicate-emails",
      title: "Duplicate Emails",
      leetcodeNumber: 182,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/duplicate-emails/",
      summary: "GROUP BY + HAVING COUNT > 1 — the standard pattern for finding duplicates.",
      body: `**The problem.** Find all duplicate emails in a Person table.

**The query.**
\`\`\`sql
SELECT email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;
\`\`\`

**Why it matters.** This is *the* canonical GROUP BY + HAVING problem. GROUP BY email collapses all rows with the same email into one group. HAVING COUNT(*) > 1 keeps only groups with more than one row — i.e., duplicates. This two-line pattern is the standard way to find duplicates in any column, and it appears in some form in almost every SQL interview.

**The insight.** HAVING is the WHERE of the grouped world. WHERE runs before GROUP BY (it filters individual rows); HAVING runs after GROUP BY (it filters groups). You cannot write \`WHERE COUNT(*) > 1\` because COUNT doesn't exist until the rows are grouped. This is the single most important WHERE-vs-HAVING distinction to memorise.

**The thread.** You found duplicates. The next problem uses GROUP BY to compute an average — a different kind of aggregation that produces a continuous value rather than a count.`,
    },
    {
      slug: "average-selling-price",
      title: "Average Selling Price",
      leetcodeNumber: 1251,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/average-selling-price/",
      summary: "Weighted average with JOIN + SUM — computing price × units divided by total units per product.",
      body: `**The problem.** Compute the average selling price for each product, where price varies by date range and each sale is weighted by units sold.

**The query.**
\`\`\`sql
SELECT p.product_id,
       IFNULL(ROUND(SUM(p.price * u.units) / SUM(u.units), 2), 0) AS average_price
FROM Prices p
LEFT JOIN UnitsSold u
  ON p.product_id = u.product_id
  AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY p.product_id;
\`\`\`

**Why it matters.** This problem combines JOIN, GROUP BY, and a *weighted average* — not just AVG(price), but SUM(price × units) / SUM(units). The weighted average is the correct calculation when different prices apply to different quantities, and it's a pattern that appears constantly in financial and e-commerce analytics.

**The insight.** The LEFT JOIN with a date range condition in ON is crucial. Each sale must be matched to the price that was active on the sale date. The BETWEEN in the ON clause is the lookup — a temporal join that says "this sale happened during this price period." IFNULL handles products with no sales, defaulting to 0.

**The thread.** Weighted averages combine multiplication and aggregation. The next problem introduces GROUP BY with multiple columns — grouping by (year, month) or (department, role) to produce multi-dimensional summaries.`,
    },
    {
      slug: "monthly-transactions-i",
      title: "Monthly Transactions I",
      leetcodeNumber: 1193,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/monthly-transactions-i/",
      summary: "Conditional aggregation — COUNT and SUM with CASE WHEN inside GROUP BY to split approved vs. total transactions.",
      body: `**The problem.** For each month and country, find the number of transactions, their total amount, the number of approved transactions, and the approved total amount.

**The query.**
\`\`\`sql
SELECT DATE_FORMAT(trans_date, '%Y-%m') AS month,
       country,
       COUNT(*) AS trans_count,
       SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count,
       SUM(amount) AS trans_total_amount,
       SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount
FROM Transactions
GROUP BY DATE_FORMAT(trans_date, '%Y-%m'), country;
\`\`\`

**Why it matters.** This introduces **conditional aggregation** — using CASE WHEN inside SUM or COUNT to aggregate only rows that meet a condition. Instead of writing two separate queries (one for all transactions, one for approved), you do it in one pass by embedding the condition inside the aggregate. This is a critical pattern for dashboards and reports.

**The insight.** \`SUM(CASE WHEN condition THEN 1 ELSE 0 END)\` is equivalent to \`COUNT with a filter\` — it counts only rows where the condition is true. This trick is the backbone of pivot-style queries and is far more efficient than multiple self-joins or subqueries.

**The thread.** You can now group, count, sum, average, and conditionally aggregate. The next problem pushes aggregation to its limit with a HAVING condition that uses a percentage threshold — a real-world analytics pattern.`,
    },
    {
      slug: "queries-quality-and-percentage",
      title: "Queries Quality and Percentage",
      leetcodeNumber: 1211,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/queries-quality-and-percentage/",
      summary: "Computing averages and percentages per group — quality as AVG(rating/position) and poor percentage from conditional COUNT.",
      body: `**The problem.** For each query name, compute: (a) quality = AVG(rating / position), and (b) poor_query_percentage = (count of ratings < 3 / total count) × 100.

**The query.**
\`\`\`sql
SELECT query_name,
       ROUND(AVG(rating / position), 2) AS quality,
       ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage
FROM Queries
WHERE query_name IS NOT NULL
GROUP BY query_name;
\`\`\`

**Why it matters.** This combines multiple aggregation patterns in a single query: a computed-column average (rating/position), conditional counting (ratings below 3), and percentage calculation (conditional count / total count × 100). Each technique alone is simple; combining them in one GROUP BY is the reality of analytics SQL.

**The insight.** Multiply by 100.0 (not 100) to force floating-point division. In many SQL dialects, integer / integer truncates to integer: 1/3 = 0, not 0.33. Using 100.0 ensures at least one operand is a float, producing the correct decimal result. This is a classic interview trap.

**The thread.** Aggregation chapter complete. You can group, count, sum, average, conditionally aggregate, and compute percentages. The next two chapters branch: Sorting & Limiting teaches you to rank and page results; CASE WHEN & Conditional Logic teaches the decision-making tool you glimpsed in conditional aggregation.`,
    },
  ],
};
