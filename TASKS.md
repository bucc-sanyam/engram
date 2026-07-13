# Tasks

> One active milestone at a time. Move finished items to `SESSION_LOG.md`.

## Active milestone
- [ ] No active milestone

## Backlog
- [ ] Install the `graphify` CLI — real package is **`graphifyy`** (double-y): `pipx install graphifyy`. Sandbox blocked the auto-install as a typosquat; user is running it themselves. Once installed, run `graphify update .` (graph is stale re: RichText, /brain/[id] blog, review deep-link, ProgressCalendar). Note: `.graphify_python` holds a placeholder path.
- [ ] Consider zero-shadow label variant if the soft glow still reads as a boundary.
- [ ] Topic blogs currently compose from `summary` + `key_points` (no long-form field). If richer articles are wanted, add a `body`/`article` column populated at ingest by Gemini.
- [ ] **Notes cross-device sync:** notes are localStorage-only (per-browser). To sync for signed-in users, add a Supabase `notes` table (id, user_id, parent_id, title, body, position, timestamps) + RLS, and branch `src/lib/notes.ts` demo(localStorage)/real(Supabase) like `data.ts`.

## Done (recent)
- [x] **Personal notes + blog source** — `/notes` (localStorage, subnotes, markdown Write/Read), dashboard "Personal notes" section, blog source attribution (url vs "Text input"). (2026-07-13, see SESSION_LOG)
- [x] **Dashboard/brain polish** — "The thread today" rich insight, clickable plan rows → single-task review, topic blog pages (Fraunces serif), summarised brain card + Read-full, smaller 3D labels. (2026-07-13, see SESSION_LOG)
- [x] **Deploy to Vercel** — migrated from Render. Removed `render.yaml`, connected Vercel CLI, deployed to production. (2026-07-13, see SESSION_LOG)
- [x] **Fix Nav Auth UI** — fixed bug in `Nav.tsx` where the "Sign in" button was hidden for unauthenticated users when a database was connected. (2026-07-13, see SESSION_LOG)
- [x] Plan markdown leak fix + progress calendar + /profile page + signup name (2026-07-13, see SESSION_LOG)
- [x] Brain label overlap fix + clickable labels + Space Grotesk (2026-07-13, see SESSION_LOG)
