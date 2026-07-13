# Session Log

> Milestone journal, newest first. One short entry per completed milestone. Keep entries terse — this file is read at the start of every session.

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
