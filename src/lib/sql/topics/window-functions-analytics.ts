import type { SqlTopic } from "../types";

/** Chapter 9 — Window Functions: Analytics (LEAD, LAG, running totals). */
export const windowFunctionsAnalytics: SqlTopic = {
  slug: "window-functions-analytics",
  title: "Window Functions — Analytics",
  chapter: 9,
  tagline: "LEAD, LAG, SUM OVER, running totals — looking across rows to compute trends and cumulative values.",
  color: "#a78bfa",
  prereqs: ["window-functions-ranking"],
  unlocks: ["common-table-expressions"],
  intro: `Ranking functions number rows; analytical window functions *compute across* rows. LEAD looks forward, LAG looks backward, SUM OVER computes running totals, and AVG OVER computes moving averages. These functions transform SQL from a row-filtering language into a full analytical engine capable of time-series analysis, trend detection, and gap-and-island identification.

The problems here test the most interview-relevant analytical patterns: comparing a row with its previous/next row (LEAD/LAG), computing cumulative sums, and the famous "gaps and islands" problem — finding consecutive sequences in data.`,
  problems: [
    {
      slug: "consecutive-numbers",
      title: "Consecutive Numbers",
      leetcodeNumber: 180,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/consecutive-numbers/",
      summary: "LEAD/LAG — finding numbers that appear three or more times consecutively.",
      body: `**The problem.** Find all numbers that appear at least three times consecutively in a Logs table.

**The query.**
\`\`\`sql
SELECT DISTINCT l.num AS ConsecutiveNums
FROM (
  SELECT num,
         LEAD(num, 1) OVER (ORDER BY id) AS next1,
         LEAD(num, 2) OVER (ORDER BY id) AS next2
  FROM Logs
) l
WHERE l.num = l.next1 AND l.num = l.next2;
\`\`\`

**Why it matters.** LEAD(num, 1) looks one row ahead; LEAD(num, 2) looks two rows ahead (both ordered by id). If all three — current, next, and next-next — are equal, we found three consecutive occurrences. This is cleaner than a triple self-join approach.

\`\`\`viz:table-diff
{
  "columns": ["id", "num", "next1", "next2"],
  "before": [
    [1, 1, null, null],
    [2, 1, null, null],
    [3, 1, null, null],
    [4, 2, null, null],
    [5, 1, null, null],
    [6, 2, null, null],
    [7, 2, null, null]
  ],
  "after": [
    [1, 1, 1, 1]
  ],
  "caption": "Only id=1 has num = next1 = next2 (three 1's in a row, ids 1-3). SELECT DISTINCT then reports ConsecutiveNums = 1."
}
\`\`\`

**The insight.** LEAD(column, offset) and LAG(column, offset) are the go-to tools for comparing a row with its neighbours. LAG looks backward; LEAD looks forward. The offset parameter (default 1) controls how far ahead/behind to look. A third optional parameter sets the default value when there is no neighbour (e.g., at the edge of the result set).

**The thread.** Looking ahead with LEAD. The next problem uses running SUM to compute cumulative totals — the foundation of time-series analysis.`,
    },
    {
      slug: "last-person-to-fit-in-bus",
      title: "Last Person to Fit in the Bus",
      leetcodeNumber: 1204,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/last-person-to-fit-in-the-bus/",
      summary: "Running SUM — computing a cumulative weight total to find the last person who can board before exceeding 1000 kg.",
      body: `**The problem.** People board a bus one at a time (ordered by turn). Each person has a weight. The bus has a 1000 kg limit. Find the last person who can board without exceeding the limit.

**The query.**
\`\`\`sql
SELECT person_name
FROM (
  SELECT person_name,
         SUM(weight) OVER (ORDER BY turn) AS cumulative_weight
  FROM Queue
) q
WHERE cumulative_weight <= 1000
ORDER BY cumulative_weight DESC
LIMIT 1;
\`\`\`

**Why it matters.** SUM(weight) OVER (ORDER BY turn) is a *running total* — for each row, it sums the weight of all rows up to and including the current one (in turn order). This turns a row-level value (individual weight) into a cumulative value. Filtering WHERE cumulative_weight <= 1000 keeps everyone who can fit; ORDER BY DESC + LIMIT 1 gives the last person who fit.

\`\`\`viz:table-diff
{
  "columns": ["person_name", "weight", "cumulative_weight"],
  "before": [
    ["Alice", 250, null],
    ["Bob", 175, null],
    ["Alex", 400, null],
    ["John", 350, null]
  ],
  "after": [
    ["Alice", 250, 250],
    ["Bob", 175, 425],
    ["Alex", 400, 825],
    ["John", 350, 1175]
  ],
  "caption": "The running total crosses 1000 at John (1175). Filtering to <= 1000, ordering DESC, and taking LIMIT 1 leaves Alex (825) as the last person who fits."
}
\`\`\`

**The insight.** SUM OVER (ORDER BY ...) with no PARTITION BY computes a running total over the entire result set. Adding PARTITION BY would restart the running total for each group. The window frame defaults to ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — meaning "sum everything from the start up to here."

**The thread.** Running totals are the gateway to time-series analysis. The next problem uses analytical window functions to detect a more complex pattern: human traffic at a stadium on consecutive high-attendance days.`,
    },
    {
      slug: "human-traffic-of-stadium",
      title: "Human Traffic of Stadium",
      leetcodeNumber: 601,
      difficulty: "Hard",
      leetcodeUrl: "https://leetcode.com/problems/human-traffic-of-stadium/",
      summary: "Gaps and islands — finding three or more consecutive days with 100+ visitors using ROW_NUMBER to detect sequences.",
      body: `**The problem.** Find records of three or more consecutive rows in Stadium where the number of visitors (people) is >= 100.

**The query.**
\`\`\`sql
WITH high_traffic AS (
  SELECT *,
         id - ROW_NUMBER() OVER (ORDER BY id) AS grp
  FROM Stadium
  WHERE people >= 100
),
islands AS (
  SELECT grp
  FROM high_traffic
  GROUP BY grp
  HAVING COUNT(*) >= 3
)
SELECT h.id, h.visit_date, h.people
FROM high_traffic h
JOIN islands i ON h.grp = i.grp
ORDER BY h.id;
\`\`\`

**Why it matters.** This is the famous **gaps and islands** pattern — one of the hardest and most useful SQL patterns. The trick: filter to only high-traffic rows, then compute \`id - ROW_NUMBER()\`. For consecutive rows, this difference is constant (an "island" shares the same group number). Non-consecutive rows break the pattern (creating "gaps"). Group by this computed value and keep only groups with 3+ rows.

\`\`\`viz:table-diff
{
  "columns": ["id", "visit_date", "people"],
  "before": [
    [1, "2017-01-01", 10],
    [2, "2017-01-02", 109],
    [3, "2017-01-03", 150],
    [4, "2017-01-04", 99],
    [5, "2017-01-05", 145],
    [6, "2017-01-06", 1455],
    [7, "2017-01-07", 199],
    [8, "2017-01-09", 188]
  ],
  "after": [
    [5, "2017-01-05", 145],
    [6, "2017-01-06", 1455],
    [7, "2017-01-07", 199],
    [8, "2017-01-09", 188]
  ],
  "caption": "id=4 (99 people) breaks the island: ids 2-3 form a group of only 2 (dropped), while ids 5-8 form a group of 4 (kept)."
}
\`\`\`

**The insight.** Why does \`id - ROW_NUMBER()\` work? In consecutive rows, both id and ROW_NUMBER increase by 1 per row, so their difference stays constant. When there's a gap in id (a low-traffic day was filtered out), the difference changes, starting a new island. This is the most elegant algorithm in all of SQL analytics, and understanding it deeply is a genuine interview differentiator.

**The thread.** Gaps and islands is the capstone of analytical window functions. The next chapter introduces CTEs (Common Table Expressions), which you just used in this problem — the tool that makes complex multi-step queries readable and maintainable.`,
    },
  ],
};
