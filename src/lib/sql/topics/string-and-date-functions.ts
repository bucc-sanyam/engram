import type { SqlTopic } from "../types";

/** Chapter 7 — String & Date Functions. */
export const stringAndDateFunctions: SqlTopic = {
  slug: "string-and-date-functions",
  title: "String & Date Functions",
  chapter: 7,
  tagline: "CONCAT, SUBSTRING, DATE_FORMAT, DATEDIFF — manipulating text and time inside queries.",
  color: "#22d3ee",
  prereqs: ["case-when"],
  unlocks: ["window-functions-ranking"],
  intro: `Real-world data is messy. Names have inconsistent casing, dates arrive in different formats, phone numbers need masking, and usernames need extraction from email addresses. String and date functions are the cleanup tools — they let you transform data within the query rather than in application code.

This chapter covers the most interview-relevant functions: CONCAT (joining strings), SUBSTRING (extracting parts), UPPER/LOWER (casing), REPLACE (substitution), DATE_FORMAT (formatting dates), DATEDIFF (computing intervals), and DATE_ADD/DATE_SUB (date arithmetic). The problems here test your ability to use these functions in realistic scenarios.`,
  problems: [
    {
      slug: "fix-names-in-a-table",
      title: "Fix Names in a Table",
      leetcodeNumber: 1667,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/fix-names-in-a-table/",
      summary: "String casing — CONCAT + UPPER + LOWER + SUBSTRING to capitalise only the first letter of each name.",
      body: `**The problem.** Fix names so that only the first character is uppercase and the rest are lowercase.

**The query.**
\`\`\`sql
SELECT user_id,
       CONCAT(UPPER(SUBSTRING(name, 1, 1)), LOWER(SUBSTRING(name, 2))) AS name
FROM Users
ORDER BY user_id;
\`\`\`

**Why it matters.** This is the canonical string-manipulation problem. SUBSTRING(name, 1, 1) extracts the first character; UPPER makes it uppercase. SUBSTRING(name, 2) extracts everything from the second character onward; LOWER makes it lowercase. CONCAT joins them back together.

\`\`\`viz:table-diff
{
  "columns": ["user_id", "name"],
  "before": [[1, "aLice"], [2, "bOB"]],
  "after": [[1, "Alice"], [2, "Bob"]],
  "caption": "Each name is rebuilt from an uppercased first character plus a lowercased remainder — regardless of the original casing."
}
\`\`\`

**The insight.** SUBSTRING is 1-indexed in SQL (not 0-indexed like most programming languages). SUBSTRING(str, 2) without a length argument returns everything from position 2 to the end — a useful shorthand.

**The thread.** String extraction and transformation. The next problem applies date functions to compute intervals between events.`,
    },
    {
      slug: "patients-with-a-condition",
      title: "Patients With a Condition",
      leetcodeNumber: 1527,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/patients-with-a-condition/",
      summary: "Pattern matching with LIKE — finding patients whose conditions include a code starting with 'DIAB1'.",
      body: `**The problem.** Find patients who have Type I diabetes, identified by a conditions column containing a code that starts with 'DIAB1'. The conditions column may contain multiple space-separated codes.

**The query.**
\`\`\`sql
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions LIKE 'DIAB1%' OR conditions LIKE '% DIAB1%';
\`\`\`

**Why it matters.** The tricky part is that DIAB1 might be the first code (no space before it) or a subsequent code (space before it). \`LIKE 'DIAB1%'\` catches the first case; \`LIKE '% DIAB1%'\` catches the rest. You cannot just use \`LIKE '%DIAB1%'\` because that would also match codes like 'PREDIAB1' — where DIAB1 is a suffix, not a prefix.

\`\`\`viz:table-diff
{
  "columns": ["patient_id", "patient_name", "conditions"],
  "before": [
    [3, "Bob", "DIAB100 MYOP"],
    [4, "George", "ACNE DIAB100"],
    [1, "Daniel", "YFEV COUGH"],
    [2, "Alice", ""],
    [5, "Alain", "DIAB201"]
  ],
  "after": [
    [3, "Bob", "DIAB100 MYOP"],
    [4, "George", "ACNE DIAB100"]
  ],
  "caption": "Bob's condition starts with DIAB1; George's has DIAB1 after a space. Alain's DIAB201 doesn't match DIAB1, so he's excluded along with Daniel and Alice."
}
\`\`\`

**The insight.** LIKE patterns: \`%\` matches any sequence of characters (including empty), \`_\` matches exactly one character. For word-boundary matching in space-separated lists, the "starts-with OR space-then-starts-with" pattern is the standard approach in databases without regex support. In MySQL, you could also use REGEXP: \`WHERE conditions REGEXP '(^| )DIAB1'\`.

**The thread.** Pattern matching on strings. The next problem combines date arithmetic with GROUP BY to answer temporal aggregation questions.`,
    },
    {
      slug: "delete-duplicate-emails",
      title: "Delete Duplicate Emails",
      leetcodeNumber: 196,
      difficulty: "Easy",
      leetcodeUrl: "https://leetcode.com/problems/delete-duplicate-emails/",
      summary: "DELETE with self-join — removing duplicate rows while keeping the one with the smallest id.",
      body: `**The problem.** Delete all duplicate emails, keeping only the row with the smallest id for each email.

**The query.**
\`\`\`sql
DELETE p1
FROM Person p1
INNER JOIN Person p2
  ON p1.email = p2.email
  AND p1.id > p2.id;
\`\`\`

**Why it matters.** This is the canonical DELETE-with-self-join pattern. The self-join pairs each row with all rows that share its email. The condition \`p1.id > p2.id\` ensures we only delete the row with the *larger* id — keeping the smallest. DELETE p1 (not p2) specifies which side of the join to delete.

\`\`\`viz:table-diff
{
  "columns": ["id", "email"],
  "before": [
    [1, "john@example.com"],
    [2, "bob@example.com"],
    [3, "john@example.com"]
  ],
  "after": [
    [1, "john@example.com"],
    [2, "bob@example.com"]
  ],
  "caption": "Row 3 shares an email with row 1 but has the larger id, so the self-join matches it for deletion — only the smallest id per email survives."
}
\`\`\`

**The insight.** DELETE with JOIN is MySQL-specific syntax. In standard SQL / PostgreSQL, you'd use: \`DELETE FROM Person WHERE id NOT IN (SELECT MIN(id) FROM Person GROUP BY email)\`. Know both approaches. The self-join approach is often more efficient because it avoids a subquery.

**The thread.** String and date functions let you transform data; DELETE lets you clean it. The next chapter is the big leap: window functions — the tool that lets you compute across rows without collapsing them, unlocking ranking, running totals, and lead/lag analysis.`,
    },
  ],
};
