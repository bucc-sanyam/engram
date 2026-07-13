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
- **Deploy target: Vercel** (`render.yaml` was removed); Supabase free tier for db+auth

## Design language
Dark, organic, atmospheric — NOT boxy/generic. Mesh glows, blobs, pill shapes, organic radii. Fonts: Inter (body), **Space Grotesk** (display + canvas labels), JetBrains Mono (tiny caps labels), **Fraunces** (`--font-serif`, long-form reading on topic blog pages — see `.article-lead`/`.article-body` in globals.css). Ambient blob divs in `layout.tsx`. Background `#0b0a0e`.

## Route map
| Route | File | What |
|---|---|---|
| `/` | `src/app/page.tsx` | Today dashboard: revision plan (rows are links → `/review?topic=`), ProgressMap, streak/XP |
| `/brain` | `src/app/brain/page.tsx` | 3D brain graph + search + topic info card (right panel; summarised text + "Read the full topic" → blog) |
| `/brain/[id]` | `src/app/brain/[id]/page.tsx` | Topic "blog" — full read, Fraunces serif w/ drop cap, key ideas, connections. Opened in a new tab from the card. |
| `/notes` | `src/app/notes/page.tsx` | Personal notes — OneNote-style tree of notes + subnotes, markdown Write/Read. **localStorage only, NOT in the graph.** `?note=<id>` opens one. |
| `/add` | `src/app/add/page.tsx` | Add/ingest new learning |
| `/review` | `src/app/review/page.tsx` | Quiz session: answers saved per question (incl. MCQs), ONE batch AI grade at the end → report card |
| `/profile` | `src/app/profile/page.tsx` | View/edit display name, journey stats, sign out |
| `/login` | `src/app/login/page.tsx` | Email auth (no OAuth); signup captures name → `raw_user_meta_data.name` → `handle_new_user` trigger → `profiles.display_name`. "Continue as guest" sets `engram_guest=1` cookie + hard-navigates → demo data on production. |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Supabase callback |
| API | `src/app/api/{ingest,plan,quiz}/route.ts` | See "AI-call budget" below — only ingest & quiz-finish call Gemini |

## AI-call budget (deliberate design — keep it this way)
Exactly **1 Gemini call per ingest** and **1 per finished quiz session**; everything else is zero-AI:
- **Ingest** (`/api/ingest`): the single `extractKnowledge()` call now also returns a **question bank** (5-6 per topic: ~2 open, 1-2 quickfire, ~2 MCQ with 4 options + correct_index; each with model_answer + difficulty) and **facts** (1-2/topic) → stored in `questions` & `facts` tables.
- **Quiz** (`/api/quiz` actions): `start` picks bank questions (least-asked, mastery-matched difficulty, kind rotation open→mcq→quickfire; synthesized local fallback for pre-bank topics) into a `quiz_sessions` snapshot (client never sees answers); `answer` upserts each answer into `quiz_answers` as submitted; `finish` grades MCQs deterministically + ONE `gradeSession()` batch call for typed answers (keyword-overlap fallback if Gemini fails, call skipped entirely if nothing typed) → report card (score_pct, xp, summary, strengths/focus, per-item feedback) saved on the session (idempotent), SRS per topic from avg score, reviews rows, XP, bank usage bumped; `rate` = flashcard self-rating (never AI).
- **Plan** (`/api/plan`): Gemini narrative REMOVED — headline from day-rotating templates, insight reuses a `topic_links.reason` between today's topics (`composeNarrative()`).
- **Fact of the day**: `getFactOfTheDay()` in data.ts picks deterministically by day from `facts` (joined topic name; fallback = a topic key_point). Dashboard card, right column. Zero AI.

## Key modules
- `src/components/BrainScene.tsx` (~850 lines) — the crown jewel. Stylised brain as particle shell; topics = glowing cortex patches; selection dives camera inside; label system: canvas-texture sprites in Space Grotesk, per-frame **screen-space declutter** (priority place → vertical nudge via `sprite.center` → fade), staggered edge labels, **labels are click targets** (raycast before glows, only when opacity > 0.3). Yaw bias +0.32 on landscape keeps selection out from under the info card.
- `src/components/ProgressMap.tsx` — level/rank journey map + 16-week heatmap.
- `src/components/ProgressCalendar.tsx` — month-view study calendar on the dashboard (days lit by review count, month nav, today ring). Rendered only after profile loads to dodge SSR date mismatch.
- `src/components/Nav.tsx` — top nav (Today/Brain/Add/Review + Profile/Sign-in pill; mobile 5th tab). Includes `authStatus` logic to correctly display 'Sign in' when unauthenticated in production.
- `src/lib/text.ts` — `stripMarkdown()`; Gemini sometimes emits markdown and daily plans are cached in `daily_plans`, so it's applied both in `/api/plan` before saving AND at render time on the dashboard.
- `src/components/RichText.tsx` — inline-markdown renderer (**bold**/*italic*/`code` → styled spans). Used for the dashboard "The thread today" insight instead of stripping (preserves emphasis). Recursive first-match parser; strips leading `#`/bullets.
- `src/app/review/page.tsx` — reads `?topic=<id>` from `window.location.search`; when it matches a plan item, runs a single-task session (`singleTask` flag suppresses `markPlanCompleted` so one deep-linked task doesn't close out the whole day).
- `src/lib/notes.ts` — **personal notes, localStorage-backed** (`engram.notes.v1`), deliberately outside the graph/Supabase. CRUD + `childrenOf`/`countDescendants` tree helpers; `ensureSeeded()` writes a one-time welcome note; every write dispatches `NOTES_EVENT` (+ native `storage` event) so the /notes page and the dashboard "Personal notes" section stay in sync. `Note` type in `types.ts` (`parent_id` = subnote nesting).
- `src/components/Markdown.tsx` — dependency-free block+inline markdown renderer (headings, lists, blockquote, fenced code, hr, bold/italic/code/links). Used by the notes Read view. (`RichText.tsx` is the smaller inline-only variant for the dashboard insight.)
- `getTopicSource(topicId)` in `data.ts` → `TopicSource` (`{kind:"url",url}` | `{kind:"text"}` | null): the blog page shows where a topic came from. Real mode joins `entry_topics`→`entries.source_url`; demo uses `demoTopicSource` (a few arxiv/github URLs, rest text).
- `src/lib/srs.ts` — SM-2 spaced repetition. `src/lib/progress.ts` — XP/levels.
- **New DB tables** — Run `supabase/schema-quiz-tables-only.sql` in your Supabase SQL editor (this file avoids policy conflicts if your database already has policies): creates `questions` (bank: kind/options/correct_index/model_answer/difficulty/times_asked), `facts`, `quiz_sessions` (items snapshot + report jsonb), `quiz_answers` (unique session_id+question_index), with RLS policies and indexes. Alternatively, run the full `supabase/schema.sql` if starting fresh.
- Quiz types in `types.ts`: `QuestionKind`, `SessionQuestion` (client-safe, no answers), `QuizSession`, `ReportItem`, `ReportCard`, `DailyFact`; `ExtractionResult` extended with `questions` + `facts`.
- `src/lib/demo.ts` — demo-mode seed data. `src/lib/data.ts` — data access.
- `src/lib/types.ts` — `Topic`, `TopicLink`, `categoryColor(category)`.
- `src/lib/supabase/{client,server}.ts`, `src/lib/gemini.ts`.
- `src/proxy.ts` — Next 16 proxy (migrated from middleware.ts). Auth gate honours the `engram_guest` cookie (guest/demo access without an account) and deletes it as soon as a real session exists.
- **Guest mode / isDemo:** `isDemo` (demo.ts) = no `NEXT_PUBLIC_SUPABASE_URL` OR `engram_guest=1` cookie. Cookie helpers `enableGuestMode()`/`clearGuestMode()`. Guest→signed-in transitions use full page loads so the module-level constant re-evaluates. Render-time isDemo checks (Nav, /add, /profile) go through post-mount state to keep hydration stable.
- **Plan done-tracking:** `PlanItem.done` computed at read time (today's `reviews` rows in real mode; `demoState.done` in demo). Dashboard plan section: green dots = remaining, done rows dimmed/✓/last, 5 rows + "Show all" toggle (plan caps at 10 items). Full /review runs cover only remaining items.

## Conventions / gotchas
- Dev server: use `.claude/launch.json` name `synapse-dev` (autoPort; 3000 often taken by other projects).
- Knowledge graph of this repo lives in `graphify-out/` (`graph.json`); query it instead of grepping. **The graphify CLI is installed** (PyPI `graphifyy`, double-y) at `/Users/bucc/.local/bin/graphify` — if not on PATH in a fresh shell, call it by full path or `export PATH="/Users/bucc/.local/bin:$PATH"`. Use `graphify query "…"` / `path` / `explain`; run `graphify update .` after code changes (AST-only, no API cost). NB: an unrelated `graphify` npm package (a "Random Graph Generator") is in the global npm dir with no bin — ignore it.
- Verify visual changes in the browser (demo mode works logged-out).
- **Notes are localStorage-only** (per-browser, no server/graph). Cross-device sync would need a Supabase `notes` table — deliberately deferred (see TASKS backlog).
- `npx tsc --noEmit` for typecheck; no test suite yet.
