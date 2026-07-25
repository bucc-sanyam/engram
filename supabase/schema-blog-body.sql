-- ============================================================================
-- Structured blog body for USER topic blogs (the `topics` table → /blogs/[id]).
-- Adds a single markdown `body` column that holds the long-form, structured
-- article (The gist / What it is / How it works · Why it matters / Key points
-- to remember / Watch out for / The takeaway).
--
-- Scope: user-generated topic blogs ONLY. The hand-authored static story series
-- (DSA / SQL / Macroeconomics / SARFAESI / Competition-Act) are pure TS data
-- with no rows in this table and are unaffected.
--
-- Safe to re-run. Apply this in the Supabase SQL editor, THEN run the backfill
-- to populate `body` for existing topics:
--   npx tsx scripts/restructure-blogs.mts            (dry-run)
--   npx tsx scripts/restructure-blogs.mts --commit   (writes)
-- New ingests populate `body` automatically (one Gemini call, same as before).
-- ============================================================================

alter table public.topics add column if not exists body text;
