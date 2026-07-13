# Session Log

> Milestone journal, newest first. One short entry per completed milestone. Keep entries terse — this file is read at the start of every session.

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
