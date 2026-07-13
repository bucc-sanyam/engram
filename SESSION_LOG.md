# Session Log

> Milestone journal, newest first. One short entry per completed milestone. Keep entries terse — this file is read at the start of every session.

## 2026-07-13 — Review bug fixes + /blogs page
- **Bug 1 fixed — already-answered questions re-opening:** `/review` now loads ALL plan items (not filtered to remaining-only). Items with `it.done=true` show an "Already reviewed today" card (✓ icon, topic name, "locked in for today") with a "Next topic →" button instead of re-asking the question. The `loadItem()` callback short-circuits to `setPhase("already-done")` when `it.done` is true.
- **Bug 2 fixed — report card after 1 question:** Root cause: old code filtered the plan to only `remaining` items — if 1 item remained, 1 question then report. Now the full plan is passed (all items); done items auto-skip via the `already-done` phase; quiz session is started only for `pendingIds` (non-done topics). After all items are stepped through, finalize() runs.
- **Bug 3 fixed — plan/stats count discrepancy:** Removed the `dueCount` ("Due today") stat (topics where `next_review_at <= now` — different from plan count). Replaced with **"In plan"** stat that reads `plan.items.length`. Also added a subtitle to the "Revision plan" heading: `· N topics, M remaining` so the full count is always visible even when collapsed.
- **Bug 4 fixed — /blogs page + nav:** Created `src/app/blogs/page.tsx` — standalone library page listing all topic blogs as filterable cards. **Moved** `src/app/brain/[id]` to `src/app/blogs/[id]` to completely decouple the blog read from the brain route. Added **Blogs** link to `Nav.tsx` (BookIcon, between Brain and Add). `blogs/[id]` blog page: breadcrumb → "← All blogs" → `/blogs`; bottom CTAs: "All blogs" + "Brain graph". Dashboard links to blogs via `/blogs/${t.id}`.
- **Stats fix (At a glance):** Clarified the dashboard stats row by wrapping it in a section with a "At a glance" heading, and renamed the labels from "Topics", "In plan", "Mastery" to "Total topics", "Tasks today", and "Avg. mastery" to remove ambiguity.

## 2026-07-13 — Guest mode fix, plan done-tracking, review error card, blog pills
- **Guest/demo on production FIXED:** "Continue as guest" was a plain `Link href="/"` → proxy bounced unauthenticated visitors straight back to /login (the reload loop). Now: button sets `engram_guest=1` cookie (`enableGuestMode()` in demo.ts) + hard navigation; `src/proxy.ts` lets guests through and **deletes the cookie whenever a real session exists**; `isDemo` = no Supabase env OR guest cookie. Sign-in now hard-navigates (`window.location.assign`) so stale module-level `isDemo` re-evaluates. Render-time isDemo uses (Nav badge/auth controls, /add notice, /profile notice) moved to post-mount state to avoid SSR hydration mismatches (cookie invisible to server).
- **Plan done-tracking:** `PlanItem.done` computed at read time — real mode from today's `reviews` rows (`doneTopicsToday()` in /api/plan, applied to saved AND fresh plans), demo from `demoState.done`. Dashboard: **green dot** (#43d6b5) for remaining tasks, done rows dimmed + ✓ + strikethrough + "Completed today" and **sorted last**; section shows 5 rows with **"Show all N tasks (M remaining)"** toggle. `MAX_ITEMS` 6→10; demo plan padded to 10 items. Full `/review` run now covers only remaining items (replays all when everything's done); deep-linked single tasks unchanged.
- **Review empty-page FIXED:** when a question couldn't load, phase was "question" with `question=null` → nothing rendered. Now a proper error card ("Couldn't load this question" + Skip topic / Try again) shows the real cause; `startQuiz` failures are captured into `startError`; `/api/quiz start` returns an explicit "run the latest supabase/schema.sql" message when the quiz tables are missing (42P01) — the likely production cause.
- **Dashboard knowledge-graph card:** topic pills now link to `/brain/<id>` blog pages (card restructured: header links to /brain, pills are individual Links).
- **Verified (demo):** guest button → cookie + dashboard; 10-task plan collapsed to 5 + toggle; completed d13 → green dots on the rest, d13 dimmed/✓/"Completed today"/last, "9 remaining", full run "1 of 9"; pills href /brain/d1…; no console errors; tsc + prod build clean. NB: browser tab renderer got flaky mid-session (black screenshots/scroll timeouts) — DOM-level checks used for the tail end.

## 2026-07-13 — AI-call minimisation redesign: question bank, batch report card, MCQs, fact of the day
- **Goal:** minimum LLM calls. Now exactly 1 Gemini call per ingest + 1 per finished quiz session; plan narrative & fact of the day are zero-AI. See PROJECT_SUMMARY "AI-call budget".
- **Ingest pre-generates everything:** `extractKnowledge()` prompt extended → per topic 5-6 bank questions (open/quickfire/**mcq** with 4 options + correct_index, model_answer, difficulty) + 1-2 facts. New tables `questions`, `facts` (+ `quiz_sessions`, `quiz_answers`) in schema.sql with RLS — **must re-run schema.sql in Supabase**.
- **Quiz flow rebuilt** (`/api/quiz`: start/answer/finish/rate): `start` builds a session from the bank (kind rotation, mastery-matched difficulty, least-asked first; local fallback question for pre-bank topics; client never receives answers); each answer **saved to DB on submit**; `finish` = MCQs graded deterministically + ONE `gradeSession()` batch call → **report card** (score ring, XP, summary, strengths/focus chips, per-item feedback + model answers, MCQ option highlighting, skipped items). Heuristic keyword fallback if Gemini fails; idempotent (report stored on session). SRS per topic from session average; reviews rows keep calendar/heatmap alive; flashcards stay self-rated (no AI).
- **Review page rewritten:** no per-question grading; "Answers are graded together at the end" bar, MCQ option pills, Save & next/finish, then "Building your report card…" → report. Deep-link `?topic=` still runs 1-question sessions (verified).
- **Plan narrative sans Gemini:** `composeNarrative()` — day-rotating headline templates + insight reusing a stored `topic_links.reason` between today's topics.
- **Fact of the day:** dashboard card (right column, bulb icon) via `getFactOfTheDay()` — deterministic day-hash pick from `facts` (fallback: topic key_point). Demo pool `demoFacts`.
- **Demo mode** mirrors it all: `demoQuestionBank` (incl. MCQs), local grading/report.
- **Verified in browser (demo):** full 6-item session (open → flashcards → MCQ → quickfire → flashcards → skip) → report card 80%, +109 XP, 3 answered · 1 skipped, MCQ correct-option highlight, skipped shows model answer; single-task deep link → 1-item report; fact card on dashboard; no console errors. tsc + prod build clean. graphify updated (403 nodes).

## 2026-07-13 — Personal notes feature + blog source attribution
- **Personal notes (`/notes`):** new OneNote-style page — left tree of notes + nested **subnotes** (recursive `NoteRow`, expand/collapse), right editor with a **Write/Read** toggle (markdown ↔ rendered), autosave, breadcrumb, add-subnote, delete-subtree. Deliberately **not in the knowledge graph** — stored in **localStorage** (`src/lib/notes.ts`, key `engram.notes.v1`); writes fire `NOTES_EVENT`/`storage` so views stay in sync. One-time seeded welcome note. New `src/components/Markdown.tsx` (dependency-free md renderer) powers the Read view. `Note`/`TopicSource` types added to `types.ts`.
- **Dashboard "Personal notes" section:** left column, lists top-level note headers (title · updated · subnote count) linking to `/notes?note=<id>`; empty-state invites the first note. (Access = /notes OR this section, per request.)
- **Blog source (task 2):** `/brain/[id]` now shows a "Source" line — the entry's `source_url` as a clickable host+path link, or "Text input" when pasted (never the raw text). `getTopicSource()` in `data.ts` (real: `entry_topics`→`entries`; demo: `demoTopicSource`, d1/d3/d4/d11 = arxiv/github URLs, rest text).
- **Verified in browser (demo):** notes page renders, Read mode renders md (bold/lists/code/quote/links), subnote nesting works, autosave persists to localStorage across reload; dashboard section shows the seed note; blog shows arxiv link (d1) and "Text input" (d5). tsc clean, no console errors.
- **Auto-push:** committed and pushed to `origin/main` without confirmation, per standing instruction. Graphify graph refresh still **pending** — CLI (`graphifyy`) not yet installed this session.

## 2026-07-13 — Dashboard/brain polish: rich insight, clickable plan, topic blogs, smaller labels
- **"Today's connection" → "The thread today"** and rendered rich: new `src/components/RichText.tsx` renders inline markdown (**bold**/*italic*/`code`) as styled spans instead of `stripMarkdown()`, so Gemini emphasis survives on the dashboard insight.
- **Clickable revision-plan rows:** each dashboard plan `<li>` is now a `Link` to `/review?topic=<id>` (hover arrow). `src/app/review/page.tsx` reads the param from `window.location.search`; a matching id runs a single-task session. Guarded with `singleTask` so finishing one deep-linked task does NOT call `markPlanCompleted` (won't falsely close the day / bump streak).
- **Topic "blog" view:** new route `src/app/brain/[id]/page.tsx` — full read in Fraunces serif (added `--font-serif` in `layout.tsx`; `.article-lead` w/ drop cap + `.article-body` in globals.css), numbered key ideas, connections (link onward), Revise CTA. Brain info card now shows a 2-line-clamped summary + gold **"Read the full topic ↗"** and a clickable title, both opening the blog in a new tab.
- **Smaller 3D labels (task 5):** `BrainScene.tsx` node label 0.112→0.086, edge 0.086→0.066 (~23% down).
- **graphify CLI:** the real package is `graphifyy` (double-y) via pipx; the npm-global `graphify` is an unrelated pkg. Auto-install was blocked by the sandbox as a typosquat; user is installing it themselves. Graph not refreshed (CLI still unavailable this session).
- **Verified:** tsc clean; in browser (demo): plan row → `/review?topic=d10` shows "1 of 1"; `/brain/d1` blog renders (serif, drop cap, 4 key ideas, 3 connections, CTAs); Bayes card shows clamped summary + Read-full link; scene labels visibly smaller. No console errors.

## 2026-07-13 — Vercel Migration & Nav Auth Fix
- **Vercel Migration:** Moved deployment from Render to Vercel. Deleted `render.yaml` as it is no longer required. Connected Vercel via Vercel CLI (`npx vercel link` & `npx vercel deploy`).
- **Nav Auth UI Fix:** The navigation bar's "Sign in" button was erroneously hidden when `NEXT_PUBLIC_SUPABASE_URL` was set, even if the user wasn't signed in, due to the `isDemo` check failing. Updated `src/components/Nav.tsx` to maintain a local `authStatus` state using `getProfile()`, explicitly showing the "Sign in" button if the user is unauthenticated, instead of defaulting to "Profile".
- **Graphify Note:** Skipped `graphify update .` because the CLI is unavailable in the environment.

## 2026-07-13 — Fix /profile infinite loading (missing profiles row)
- **Symptom:** /profile stuck on "Loading…" on the real-Supabase build. Schema *file* was fine — `supabase/schema.sql` already had all profile columns + `handle_new_user` trigger (committed together in `2b3ec32`). Root cause: `getProfile()` did `.single()` and returned `data as Profile` ignoring the error, so a *missing profiles row* (account predates the trigger, or trigger never installed in that project) returned `null` → profile stayed null → hung. Page's `.catch(()=>{})` hid the error.
- **Fix:** `getProfile()` (`src/lib/data.ts`) now uses `.maybeSingle()`, throws on real errors, and **self-heals**: if no row, upserts one (`user_metadata.name` → email prefix). `/profile` page now shows an error card (with "run schema.sql" hint) instead of infinite Loading.
- **Backfill for existing users:** the trigger only fires on new signups, so pre-existing accounts still need a row (self-heal handles it on next load, or run the SQL insert-from-auth.users backfill).
- **Verified:** tsc clean; /profile still renders in demo mode (Demo Learner / LV 5, no regression). Real-Supabase self-heal not exercisable locally (env is demo-only).

## 2026-07-13 — Plan markdown fix, progress calendar, profile page
- **Markdown leak:** "Today's connection" showed raw `**…**` from Gemini. Fixed three ways: `writePlanNarrative` prompt now forbids markdown/labels (`src/lib/gemini.ts`); new `stripMarkdown()` in `src/lib/text.ts` applied in `/api/plan` before caching AND at render time in `src/app/page.tsx` (covers already-cached plans in `daily_plans`).
- **Progress calendar:** new `src/components/ProgressCalendar.tsx` on the dashboard right column — month view, days lit by review count (3 intensity tiers), today ring, ‹ › month nav (≤11 months back).
- **Profile & greeting:** signup form now asks for a name (`options.data.name` → existing `handle_new_user` trigger fills `profiles.display_name`); new `/profile` page (edit display name via new `updateProfile()` + `getUserEmail()` in `src/lib/data.ts`, journey stats, sign out); Nav sign-out button replaced by Profile pill (desktop) and 5th mobile tab. Greeting falls back to "there" only when name truly empty.
- **Verified:** tsc clean; in browser (demo mode): calendar renders + month nav works, signup shows name field, profile rename → dashboard greets "Good afternoon, Sanyam". Note: demo-mode name edits reset on full page reload (module state); real users persist via Supabase.

## 2026-07-13 — Brain label overhaul (clickable, Space Grotesk, declutter)
- **Problem:** topic name sprites overlapped each other when expanding a topic (all edge labels parked at the same curve fraction; no collision handling), hurting readability and aesthetics.
- **Fix (all in `src/components/BrainScene.tsx`):**
  - Per-frame screen-space declutter: project visible labels → place by priority (hovered > selected > route > edge) → overlap tries vertical nudge via `sprite.center` → else smooth fade-out.
  - Edge labels staggered along their curves (0.30/0.43/0.56 + alternating lift).
  - Camera yaw bias (+0.32 landscape) so selection doesn't slide under the info card.
  - Labels are now **clickable** (node names select; edge names walk to that topic). Raycast checks labels before glows; only when `opacity > 0.3`.
  - Restyled: Space Grotesk (resolved from `--font-grotesk` at runtime, redrawn on webfont load), smaller (node 0.112 / edge 0.086), hard black outline removed → soft shadow.
- **Verified:** tsc clean; live click-through in browser (Bayes' Theorem → clicked edge label → walked to Spaced Repetition).

## Earlier (from git history)
- `f7b824f` graphify graph update (proxy migration + login UI)
- `24d2c32` middleware.ts → proxy.ts (Next 16 convention)
- `310c0a4` removed Google OAuth from login
- `78ff2ce` tailwind/postcss → dependencies (prod builds)
- `bdb20c5` render.yaml for Render deployment
