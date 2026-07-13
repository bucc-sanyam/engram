# Session Log

> Milestone journal, newest first. One short entry per completed milestone. Keep entries terse — this file is read at the start of every session.

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
