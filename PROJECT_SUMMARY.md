# Engram — Project Summary

> **Purpose of this file:** single source of truth for new sessions. Read this + `SESSION_LOG.md` + `TASKS.md` first; do NOT scan the repo unless something here is insufficient or contradicted. Keep this file updated after every meaningful change.

## What it is
"Your second brain" — a learning app. Log what you learn, see it as a living 3D knowledge graph, and get AI-scheduled quizzes before you forget. Gamified (XP, levels, streaks, ranks like "Pattern Seeker"). Runs in **demo mode** without sign-in (DEMO badge, seeded topics).

## Stack (fixed — do not propose alternatives)
- **Next.js 16.2.10** (App Router, Turbopack) + React 19.2.4 + TypeScript 5
- **Tailwind v4** (in `dependencies`, not dev — needed for prod builds)
- **Supabase** — auth (email; Google OAuth was removed) + Postgres DB (`@supabase/ssr`, `@supabase/supabase-js`)
- **Gemini** via `@google/genai` — quiz generation / ingest / planning
- **three.js 0.185** — the 3D brain scene
- Deploy target: **Render** (`render.yaml` present); Supabase free tier for db+auth

## Design language
Dark, organic, atmospheric — NOT boxy/generic. Mesh glows, blobs, pill shapes, organic radii. Fonts: Inter (body), **Space Grotesk** (display + canvas labels), JetBrains Mono (tiny caps labels). Ambient blob divs in `layout.tsx`. Background `#0b0a0e`.

## Route map
| Route | File | What |
|---|---|---|
| `/` | `src/app/page.tsx` | Today dashboard: revision plan, ProgressMap, streak/XP |
| `/brain` | `src/app/brain/page.tsx` | 3D brain graph + search + topic info card (right panel) |
| `/add` | `src/app/add/page.tsx` | Add/ingest new learning |
| `/review` | `src/app/review/page.tsx` | Quiz/review flow with scoring |
| `/profile` | `src/app/profile/page.tsx` | View/edit display name, journey stats, sign out |
| `/login` | `src/app/login/page.tsx` | Email auth (no OAuth); signup captures name → `raw_user_meta_data.name` → `handle_new_user` trigger → `profiles.display_name` |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Supabase callback |
| API | `src/app/api/{ingest,plan,quiz}/route.ts` | Gemini-backed endpoints |

## Key modules
- `src/components/BrainScene.tsx` (~850 lines) — the crown jewel. Stylised brain as particle shell; topics = glowing cortex patches; selection dives camera inside; label system: canvas-texture sprites in Space Grotesk, per-frame **screen-space declutter** (priority place → vertical nudge via `sprite.center` → fade), staggered edge labels, **labels are click targets** (raycast before glows, only when opacity > 0.3). Yaw bias +0.32 on landscape keeps selection out from under the info card.
- `src/components/ProgressMap.tsx` — level/rank journey map + 16-week heatmap.
- `src/components/ProgressCalendar.tsx` — month-view study calendar on the dashboard (days lit by review count, month nav, today ring). Rendered only after profile loads to dodge SSR date mismatch.
- `src/components/Nav.tsx` — top nav (Today/Brain/Add/Review + Profile/Sign-in pill; mobile 5th tab).
- `src/lib/text.ts` — `stripMarkdown()`; Gemini sometimes emits markdown and daily plans are cached in `daily_plans`, so it's applied both in `/api/plan` before saving AND at render time on the dashboard.
- `src/lib/srs.ts` — SM-2 spaced repetition. `src/lib/progress.ts` — XP/levels.
- `src/lib/demo.ts` — demo-mode seed data. `src/lib/data.ts` — data access.
- `src/lib/types.ts` — `Topic`, `TopicLink`, `categoryColor(category)`.
- `src/lib/supabase/{client,server}.ts`, `src/lib/gemini.ts`.
- `src/proxy.ts` — Next 16 proxy (migrated from middleware.ts).

## Conventions / gotchas
- Dev server: use `.claude/launch.json` name `synapse-dev` (autoPort; 3000 often taken by other projects).
- Knowledge graph of this repo lives in `graphify-out/` (`graph.json`); query it instead of grepping. The `graphify` CLI is **not installed** on this machine (install was blocked); read `graphify-out/graph.json` directly with python when needed.
- Verify visual changes in the browser (demo mode works logged-out).
- `npx tsc --noEmit` for typecheck; no test suite yet.
