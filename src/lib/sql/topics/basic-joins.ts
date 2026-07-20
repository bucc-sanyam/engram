import type { SqlTopic } from "../types";

/** Chapter 2 — Basic JOINs: combining tables. */
export const basicJoins: SqlTopic = {
  slug: "basic-joins",
  title: "Basic JOINs",
  chapter: 2,
  tagline: "INNER JOIN, LEFT JOIN, and CROSS JOIN — bringing related tables together.",
  color: "#f97066",
  prereqs: ["select-and-filter"],
  unlocks: ["aggregation"],
  intro: `A single table is a spreadsheet. Two tables linked by a JOIN are a *database*. The relational model's entire power comes from the ability to split data across normalised tables (customers in one, orders in another, products in a third) and then reassemble it at query time using keys. JOINs are the reassembly mechanism.

This chapter teaches the three fundamental join types. INNER JOIN returns only rows with a match in both tables — the intersection. LEFT JOIN returns *all* rows from the left table and matches from the right, filling NULLs where no match exists — essential for "find everything, even things without a counterpart." CROSS JOIN produces every possible pairing of rows from two tables — the Cartesian product, rarely used by itself but fundamental to understanding how JOINs work under the hood.

The problems progress from a textbook LEFT JOIN (Combine Two Tables) through self-joins, multi-table joins, and the critical pattern of "find rows in A that have no match in B" — the anti-join, which is the bread and butter of real-world analytics.`,
  problems: [
    {
      slug: "combine-two-tables",
      title: "Combine Two Tables",
      leetcodeNumber: 175,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/combine-two-tables/",
      summary: "The canonical LEFT JOIN — show every person's city even if their address is missing.",
      body: `**The problem.** Given a Person table (personId, firstName, lastName) and an Address table (personId, city, state), report firstName, lastName, city, and state for every person. If a person has no address, city and state should be NULL.

**The query.**
\`\`\`sql
SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId;
\`\`\`

**Why it matters.** This is *the* problem that teaches LEFT JOIN. An INNER JOIN would drop people without addresses — and the problem explicitly says to keep them. LEFT JOIN keeps every row from the left table (Person) and fills NULLs for right-table columns (city, state) where no match exists.

\`\`\`viz:table-diff
{
  "columns": ["firstName", "lastName", "city", "state"],
  "before": [
    ["Allen", "Wang", null, null],
    ["Bob", "Alice", null, null]
  ],
  "after": [
    ["Allen", "Wang", null, null],
    ["Bob", "Alice", "New York City", "New York"]
  ],
  "caption": "Every person row survives (LEFT JOIN keeps all of Person); only Bob's row gets a matched address — Allen's stays NULL because Address has no row for his personId."
}
\`\`\`

**The insight.** The ON clause is the join condition — it tells the database which rows to pair. Without ON, a JOIN becomes a CROSS JOIN (every person × every address). With ON, it becomes a precise lookup. Think of LEFT JOIN as: "for every person, try to find their address; if you can't, that's okay, just leave it blank."

**The thread.** You've joined two different tables. The next problem joins a table *to itself* — a self-join — which is how you compare rows within the same table.`,
    },
    {
      slug: "employees-earning-more-than-managers",
      title: "Employees Earning More Than Their Managers",
      leetcodeNumber: 181,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/employees-earning-more-than-their-managers/",
      summary: "The self-join — comparing rows within the same table by joining Employee to itself.",
      body: `**The problem.** Find employees who earn more than their managers. The Employee table has id, name, salary, and managerId (which references another row's id in the same table).

**The query.**
\`\`\`sql
SELECT e.name AS Employee
FROM Employee e
INNER JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;
\`\`\`

**Why it matters.** A self-join treats the same table as two separate tables by using aliases (e for employee, m for manager). The ON clause links each employee to their manager via managerId = id. This pattern appears whenever you need to compare rows in the same table — finding consecutive records, detecting duplicates, comparing peers.

\`\`\`viz:table-diff
{
  "columns": ["employee", "emp_salary", "manager", "mgr_salary"],
  "before": [
    ["Joe", 70000, "Sam", 60000],
    ["Henry", 80000, "Max", 90000]
  ],
  "after": [
    ["Joe", 70000, "Sam", 60000]
  ],
  "caption": "The self-join pairs every employee with their manager; the WHERE filter keeps only pairs where the employee out-earns the manager — Henry's row drops out because Max earns more."
}
\`\`\`

**The insight.** INNER JOIN is correct here (not LEFT JOIN) because we want employees who *have* managers and earn more. An employee with no manager (managerId IS NULL) should not appear — and INNER JOIN naturally excludes them because no match exists.

**The thread.** Self-joins compare rows in the same table. The next problem introduces the anti-join pattern: finding rows that have *no* match in another table.`,
    },
    {
      slug: "customers-who-never-order",
      title: "Customers Who Never Order",
      leetcodeNumber: 183,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/customers-who-never-order/",
      summary: "The anti-join — LEFT JOIN + IS NULL to find customers with no matching orders.",
      body: `**The problem.** Find customers who have never placed an order. The Customers table has id and name; the Orders table has id and customerId.

**The query.**
\`\`\`sql
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.id IS NULL;
\`\`\`

**Why it matters.** The anti-join is one of SQL's most important patterns. You want rows from table A that have *no* match in table B. LEFT JOIN keeps all of A, filling NULLs for B where no match exists. Then WHERE o.id IS NULL filters to *only* those unmatched rows. The alternative — \`WHERE c.id NOT IN (SELECT customerId FROM Orders)\` — works but is often slower because NOT IN handles NULLs poorly and can't use indexes as efficiently.

\`\`\`viz:table-diff
{
  "columns": ["customer", "order_id"],
  "before": [
    ["Henry", null],
    ["Max", null],
    ["Joe", 2],
    ["Sam", 1]
  ],
  "after": [
    ["Henry", null],
    ["Max", null]
  ],
  "caption": "LEFT JOIN keeps every customer; WHERE order_id IS NULL keeps only the two who never matched an order — Joe and Sam drop out because they did place one."
}
\`\`\`

**The insight.** The anti-join pattern (LEFT JOIN + IS NULL) is the standard way to find missing data: customers without orders, products without reviews, employees without departments. Memorise the pattern — it appears in some form in nearly every SQL interview.

**The thread.** You've mastered the three fundamental join patterns: regular join, self-join, anti-join. The next problem stretches joins to handle temporal data — finding the most recent or "latest" matching row.`,
    },
    {
      slug: "rising-temperature",
      title: "Rising Temperature",
      leetcodeNumber: 197,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/rising-temperature/",
      summary: "Date-based self-join — comparing today's temperature with yesterday's using DATEDIFF.",
      body: `**The problem.** Find all dates where the temperature was higher than the previous day's temperature.

**The query.**
\`\`\`sql
SELECT w1.id
FROM Weather w1
INNER JOIN Weather w2
  ON DATEDIFF(w1.recordDate, w2.recordDate) = 1
WHERE w1.temperature > w2.temperature;
\`\`\`

**Why it matters.** This combines a self-join with a date function. Instead of joining on a foreign key (managerId = id), you join on a *computed date relationship*: today's record pairs with yesterday's record. This is your first encounter with a temporal self-join — a pattern that becomes central in window-function problems later.

\`\`\`viz:table-diff
{
  "columns": ["date", "temp", "prev_date", "prev_temp"],
  "before": [
    ["2015-01-02", 25, "2015-01-01", 10],
    ["2015-01-04", 30, "2015-01-03", 20],
    ["2015-01-03", 20, "2015-01-02", 25]
  ],
  "after": [
    ["2015-01-02", 25, "2015-01-01", 10],
    ["2015-01-04", 30, "2015-01-03", 20]
  ],
  "caption": "Each row pairs a day with its predecessor; only pairs where today's temperature beats yesterday's survive the WHERE filter — Jan 3 (20 vs 25) drops out."
}
\`\`\`

**The insight.** DATEDIFF(date1, date2) = 1 means date1 is exactly one day after date2. An alternative is \`w1.recordDate = DATE_ADD(w2.recordDate, INTERVAL 1 DAY)\`. Both work; know at least one. The key conceptual point: you are comparing *across rows* by joining the table to itself with a relationship defined by a function.

**The thread.** You can now join, self-join, anti-join, and temporal-join. The next problem adds another dimension: joining three tables to find average processing and shipping times — your first multi-table join.`,
    },
    {
      slug: "average-time-of-process-per-machine",
      title: "Average Time of Process per Machine",
      leetcodeNumber: 1661,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/average-time-of-process-per-machine/",
      summary: "Self-join with aggregation — pairing start and end events to compute durations.",
      body: `**The problem.** An Activity table records process start and end events on factory machines. For each machine, find the average processing time (end timestamp - start timestamp) across all processes.

**The query.**
\`\`\`sql
SELECT a1.machine_id,
       ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time
FROM Activity a1
INNER JOIN Activity a2
  ON a1.machine_id = a2.machine_id
  AND a1.process_id = a2.process_id
  AND a1.activity_type = 'start'
  AND a2.activity_type = 'end'
GROUP BY a1.machine_id;
\`\`\`

**Why it matters.** This problem combines self-join with aggregation (AVG, GROUP BY) — a bridge to the next chapter. You pair each 'start' event with its corresponding 'end' event using a multi-condition ON clause, then aggregate the durations per machine. The self-join here is not just comparing rows — it is *pairing* rows that logically belong together.

\`\`\`viz:table-diff
{
  "columns": ["machine_id", "process_id", "duration"],
  "before": [
    [0, 0, 0.808],
    [1, 0, 1.000],
    [2, 0, 0.412],
    [0, 1, 0.980],
    [1, 1, 0.990],
    [2, 1, 2.500]
  ],
  "after": [
    [0, null, 0.894],
    [1, null, 0.995],
    [2, null, 1.456]
  ],
  "caption": "Each row already reflects a paired start/end event; GROUP BY machine_id averages the two process durations per machine into one row (process_id no longer applies)."
}
\`\`\`

**The insight.** Multi-condition ON clauses are the key to precise self-joins. Without \`AND a1.process_id = a2.process_id\`, you would pair starts from one process with ends from another. Each additional condition narrows the pairing. Think of ON as a *matching rule*: the more specific, the more accurate.

**The thread.** This problem sneaks in GROUP BY and AVG — both of which belong to the next chapter: Aggregation. JOINs combine tables horizontally (adding columns); aggregation summarises tables vertically (collapsing rows into statistics). Together, they cover the vast majority of real-world SQL queries.`,
    },
  ],
};
