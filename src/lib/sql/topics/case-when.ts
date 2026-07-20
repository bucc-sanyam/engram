import type { SqlTopic } from "../types";

/** Chapter 6 — CASE WHEN & Conditional Logic. */
export const caseWhen: SqlTopic = {
  slug: "case-when",
  title: "CASE WHEN & Conditional Logic",
  chapter: 6,
  tagline: "IF-THEN-ELSE in SQL — transforming, categorising, and pivoting data with CASE expressions.",
  color: "#e8927c",
  prereqs: ["subqueries"],
  unlocks: ["string-and-date-functions"],
  intro: `CASE WHEN is SQL's if-then-else. It evaluates conditions top-to-bottom and returns the value of the first matching THEN clause. It works everywhere — in SELECT (to create computed columns), in WHERE (to create complex filters), in ORDER BY (to create custom sort orders), and inside aggregate functions (to create conditional aggregations). This flexibility makes it the Swiss Army knife of SQL.

The problems in this chapter focus on using CASE WHEN for data transformation (swapping values, recategorising), pivoting (turning rows into columns), and decision logic (applying different calculations based on conditions).`,
  problems: [
    {
      slug: "swap-salary",
      title: "Swap Salary",
      leetcodeNumber: 627,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/swap-salary/",
      summary: "UPDATE with CASE — swapping 'm' and 'f' values in a single statement without a temporary variable.",
      body: `**The problem.** Swap all 'f' and 'm' values in the sex column of a Salary table with a single UPDATE statement.

**The query.**
\`\`\`sql
UPDATE Salary
SET sex = CASE WHEN sex = 'm' THEN 'f' ELSE 'm' END;
\`\`\`

**Why it matters.** This is the simplest possible CASE WHEN in an UPDATE. The beauty is that CASE evaluates the *original* value before any changes — so you don't need a temporary variable or multiple statements. All swaps happen "simultaneously" within the single UPDATE.

\`\`\`viz:table-diff
{
  "columns": ["id", "sex"],
  "before": [[1, "m"], [2, "f"], [3, "m"]],
  "after": [[1, "f"], [2, "m"], [3, "f"]],
  "caption": "Every row's sex value flips in place — CASE reads the pre-update value, so there's no risk of a double-swap."
}
\`\`\`

**The insight.** CASE WHEN in UPDATE is transactional — the old value is read, the CASE evaluated, and the new value written. There's no risk of 'm' → 'f' → 'm' double-swap because the CASE reads from the pre-update state, not the mid-update state.

**The thread.** CASE in UPDATE transforms data in place. The next problem uses CASE in SELECT to create a computed column — categorising data on the fly without changing the underlying table.`,
    },
    {
      slug: "calculate-special-bonus",
      title: "Calculate Special Bonus",
      leetcodeNumber: 1873,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/calculate-special-bonus/",
      summary: "Conditional calculation — bonus is 100% of salary if employee_id is odd AND name doesn't start with 'M', otherwise 0.",
      body: `**The problem.** Calculate a bonus for each employee: 100% of salary if the employee_id is odd AND the name does not start with 'M'; otherwise the bonus is 0.

**The query.**
\`\`\`sql
SELECT employee_id,
       CASE
         WHEN employee_id % 2 = 1 AND name NOT LIKE 'M%' THEN salary
         ELSE 0
       END AS bonus
FROM Employees
ORDER BY employee_id;
\`\`\`

**Why it matters.** This combines CASE WHEN with modulo (odd/even check) and LIKE (pattern matching). The compound condition (AND) inside WHEN demonstrates that WHEN clauses can contain any valid boolean expression — not just simple equality checks.

\`\`\`viz:table-diff
{
  "columns": ["employee_id", "name", "salary", "bonus"],
  "before": [
    [2, "Meir", 3000, null],
    [3, "Michael", 3800, null],
    [7, "Addilyn", 7400, null],
    [8, "Juan", 6100, null],
    [9, "Kannon", 7700, null]
  ],
  "after": [
    [2, "Meir", 3000, 0],
    [3, "Michael", 3800, 0],
    [7, "Addilyn", 7400, 7400],
    [8, "Juan", 6100, 0],
    [9, "Kannon", 7700, 7700]
  ],
  "caption": "Only odd employee_ids whose name doesn't start with 'M' get the full salary as bonus (7, 9) — even ids and 'M' names get 0, even though 3 is odd."
}
\`\`\`

**The insight.** CASE WHEN evaluates top-to-bottom and short-circuits at the first TRUE condition. Order your WHEN clauses from most specific to most general. If you put ELSE first (which you can't, but conceptually), you'd mask all the specific conditions.

**The thread.** CASE for calculation. The next problem uses CASE inside GROUP BY to create a pivot — transforming row values into column headers.`,
    },
    {
      slug: "tree-node",
      title: "Tree Node",
      leetcodeNumber: 608,
      difficulty: "Medium",
      leetcodeUrl: "https://leetcode.com/problems/tree-node/",
      summary: "Classifying nodes — using CASE with subqueries to label each node as Root, Inner, or Leaf.",
      body: `**The problem.** Given a Tree table with id and p_id (parent id), label each node as 'Root' (p_id is NULL), 'Leaf' (not a parent of any other node), or 'Inner' (has a parent and is a parent).

**The query.**
\`\`\`sql
SELECT id,
       CASE
         WHEN p_id IS NULL THEN 'Root'
         WHEN id NOT IN (SELECT DISTINCT p_id FROM Tree WHERE p_id IS NOT NULL) THEN 'Leaf'
         ELSE 'Inner'
       END AS type
FROM Tree;
\`\`\`

**Why it matters.** This combines CASE WHEN with a subquery. The root check is simple (p_id IS NULL). The leaf check requires knowing whether this node's id appears as anyone else's p_id — which requires a subquery. The ELSE catches everything that's neither root nor leaf — inner nodes.

\`\`\`viz:table-diff
{
  "columns": ["id", "p_id", "type"],
  "before": [
    [1, null, null],
    [2, 1, null],
    [3, 1, null],
    [4, 2, null],
    [5, 2, null]
  ],
  "after": [
    [1, null, "Root"],
    [2, 1, "Inner"],
    [3, 1, "Leaf"],
    [4, 2, "Leaf"],
    [5, 2, "Leaf"]
  ],
  "caption": "Node 2 is both someone's child and someone's parent, so it's Inner; nodes 3, 4, 5 have no children of their own, so they're Leaf."
}
\`\`\`

**The insight.** The order of WHEN clauses matters logically here: check root first (it has no parent), then leaf (it's not anyone's parent), then inner (everything else). Re-ordering would still work because the conditions are mutually exclusive, but the logical flow is clearest in this order.

**The thread.** CASE WHEN handles classification elegantly. The next chapter introduces string and date functions — the built-in tools that let you extract, transform, and compute on text and temporal data.`,
    },
  ],
};
