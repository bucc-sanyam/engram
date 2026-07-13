# Tasks

> One active milestone at a time. Move finished items to `SESSION_LOG.md`.

## Active milestone
- [ ] No active milestone

## Backlog
- [ ] **Run schema-quiz-tables-only.sql in Supabase** (new tables: questions, facts, quiz_sessions, quiz_answers) — required before the new quiz flow works in real mode. If you get "policy already exists" errors, use this file instead of schema.sql; it safely handles policy conflicts.
- [ ] Question-bank replenishment for old topics: topics ingested before the bank exists only get the synthesized fallback question; consider a one-off backfill (one Gemini call per legacy topic) or regenerate-on-empty.
- [ ] Consider zero-shadow label variant if the soft glow still reads as a boundary.
- [ ] Topic blogs currently compose from `summary` + `key_points` (no long-form field). If richer articles are wanted, add a `body`/`article` column populated at ingest by Gemini.
- [ ] **Notes cross-device sync:** notes are localStorage-only (per-browser). To sync for signed-in users, add a Supabase `notes` table (id, user_id, parent_id, title, body, position, timestamps) + RLS, and branch `src/lib/notes.ts` demo(localStorage)/real(Supabase) like `data.ts`.

## Done (recent)
- [x] **Review page bug fixes + /blogs page** — (1) done questions show "Already reviewed today" card instead of re-asking; (2) full-plan session now includes all items (done ones auto-skip) so report shows after all items not just 1; (3) stats "Due today" → "In plan" for consistency; (4) new `/blogs` library page + nav link, "Back to your brain" removed from blog pages. (2026-07-13, see SESSION_LOG)
- [x] **Guest mode + plan polish** — fixed guest/demo loop on production (cookie + proxy), plan done-tracking (green dots, done-last, expandable), review error card instead of blank page, graph-card pills → blog pages. (2026-07-13, see SESSION_LOG)
- [x] **AI-call minimisation redesign** — ingest-time question bank (incl. MCQs) + facts, per-answer DB saves, single batch-grade report card, zero-AI plan narrative, fact of the day. (2026-07-13, see SESSION_LOG)
- [x] **Install graphify CLI** — `pipx install graphifyy` (v0.9.14) at `/Users/bucc/.local/bin`; graph regenerated (384 nodes). (2026-07-13)
- [x] **Personal notes + blog source** — `/notes` (localStorage, subnotes, markdown Write/Read), dashboard "Personal notes" section, blog source attribution (url vs "Text input"). (2026-07-13, see SESSION_LOG)
- [x] **Dashboard/brain polish** — "The thread today" rich insight, clickable plan rows → single-task review, topic blog pages (Fraunces serif), summarised brain card + Read-full, smaller 3D labels. (2026-07-13, see SESSION_LOG)
- [x] **Deploy to Vercel** — migrated from Render. Removed `render.yaml`, connected Vercel CLI, deployed to production. (2026-07-13, see SESSION_LOG)
- [x] **Fix Nav Auth UI** — fixed bug in `Nav.tsx` where the "Sign in" button was hidden for unauthenticated users when a database was connected. (2026-07-13, see SESSION_LOG)
- [x] Plan markdown leak fix + progress calendar + /profile page + signup name (2026-07-13, see SESSION_LOG)
- [x] Brain label overlap fix + clickable labels + Space Grotesk (2026-07-13, see SESSION_LOG)
