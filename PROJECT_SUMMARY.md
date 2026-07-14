# Engramia — Project Summary

> **Purpose of this file:** single source of truth for new sessions. Read this + `SESSION_LOG.md` + `TASKS.md` first; do NOT scan the repo unless something here is insufficient or contradicted. Keep this file updated after every meaningful change.

## What it is
"Your second brain" — a learning app. Log what you learn, see it as a living 3D knowledge graph, and get AI-scheduled quizzes before you forget. Gamified (daily streak). Runs in **demo mode** without sign-in (DEMO badge, seeded topics).

## Stack (fixed — do not propose alternatives)
- **Next.js 16.2.10** (App Router, Turbopack) + React 19.2.4 + TypeScript 5
- **Tailwind v4** (in `dependencies`, not dev — needed for prod builds)
- **Supabase** — auth (email; Google OAuth was removed) + Postgres DB (`@supabase/ssr`, `@supabase/supabase-js`) + **pgvector** for RAG. **Decision (2026-07-15): stay on Supabase, do NOT migrate to TiDB** — auth + RLS + browser-direct queries are load-bearing and TiDB has neither; when 500MB is hit, upgrade to Pro ($25/mo, 8GB, no 7-day pause) rather than migrate.
- **Gemini** via `@google/genai` — quiz generation / ingest / planning + **embeddings** (`gemini-embedding-001`, 768-dim) for RAG. **Model fallback chain** in `gemini.ts`: on 429/quota or 503/overload the call retries down `GEMINI_MODEL` → `GEMINI_MODEL_FALLBACKS` (default flash → flash-lite → 2.0-flash → 2.0-flash-lite); a 429'd model is skipped for 5 min per warm instance.
- **three.js 0.185** — the 3D brain scene
- **Deploy target: Vercel** (`render.yaml` was removed); Supabase free tier for db+auth

## Design language
Dark, organic, atmospheric — NOT boxy/generic. Mesh glows, blobs, pill shapes, organic radii. Fonts: Inter (body), **Space Grotesk** (display + canvas labels), JetBrains Mono (tiny caps labels), **Fraunces** (`--font-serif`, long-form reading on topic blog pages — see `.article-lead`/`.article-body` in globals.css). Ambient blob divs in `layout.tsx`. Background `#0b0a0e`.

**Branding:** the app is **Engramia** everywhere; the meaning tagline "en·gram — the trace a memory leaves in your brain" sits under the wordmark in `Nav.tsx`, on the login page, in layout metadata, and in the footer.

## Route map
| Route | File | What |
|---|---|---|
| `/` | `src/app/page.tsx` | Today dashboard: revision plan (rows are links → `/review?topic=`), ProgressMap, streak. Stats: Topics / Tasks today |
| `/brain` | `src/app/brain/page.tsx` | 3D brain graph + search + topic info card (right panel; summarised text + "Read the full topic" → blog) |
| `/blogs/[id]` | `src/app/blogs/[id]/page.tsx` | Topic "blog" — full read, Fraunces serif w/ drop cap, key ideas, connections. Breadcrumb → /blogs. CTAs: Revise / All blogs / Brain graph. |
| `/blogs` | `src/app/blogs/page.tsx` | **Library page** — all topic blogs as filterable cards (search, category chips, review count). Links to `/blogs/[id]`. |
| `/notes` | `src/app/notes/page.tsx` | Personal notes — OneNote-style tree of notes + subnotes, markdown Write/Read. **localStorage only, NOT in the graph.** `?note=<id>` opens one. |
| `/add` | `src/app/add/page.tsx` | Add/ingest new learning |
| `/review` | `src/app/review/page.tsx` | Quiz session: all plan items loaded (done ones show prompt, user answer, and stored answer; auto-skip); ONE batch AI grade at the end → report card listing EVERY question (full Q&A). Question kinds: open / quickfire / mcq / **truefalse** / **multi** (flashcards fully removed). |
| `/about` | `src/app/about/page.tsx` | Quirky About page (Sanyam Gupta, origin story, contact CTAs: email + LinkedIn). Linked from the global footer. |
| `/profile` | `src/app/profile/page.tsx` | View/edit display name, streak/topic stats, sign out |
| `/login` | `src/app/login/page.tsx` | Email auth (no OAuth); signup captures name → `raw_user_meta_data.name` → `handle_new_user` trigger → `profiles.display_name`. "Continue as guest" sets `engramia_guest=1` cookie + hard-navigates → demo data on production. |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Supabase callback |
| API | `src/app/api/{ingest,plan,quiz}/route.ts` | See "AI-call budget" below — only ingest & quiz-finish call Gemini |

## AI-call budget (deliberate design — keep it this way)
Exactly **1 Gemini call per ingest** and **1 per finished quiz session**; everything else is zero-AI:
- **Ingest** (`/api/ingest`): the single `extractKnowledge()` call returns a **question bank** (7-8 per topic: ~2 open, ~1 quickfire, ~2 MCQ (4 options + correct_index), ~1-2 **truefalse** (options ["True","False"] + correct_index), ~1 **multi** (4-5 options + correct_indices array); each with model_answer + difficulty) and **facts** (1-2/topic) → stored in `questions` & `facts` tables. Flashcards are GONE (no extraction, no table writes).
- **Quiz** (`/api/quiz` actions): `start` picks bank questions (least-asked, review-count-matched difficulty, kind rotation open→mcq→truefalse→quickfire→multi; synthesized local fallback for pre-bank topics) into a `quiz_sessions` snapshot (client never sees answers); `answer` upserts each answer into `quiz_answers` as submitted (multi picks are JSON-serialised into the `answer` text column — no schema change); `finish` grades choice kinds (mcq/truefalse exact, multi with partial credit: exact=5, else 0-4 by hits−wrong over key size) deterministically + ONE `gradeSession()` batch call for typed answers (keyword-overlap fallback if Gemini fails, call skipped entirely if nothing typed) → report card (score_pct, summary, strengths/focus, per-item full Q&A) saved on the session (idempotent), SRS per topic from avg score, reviews rows, bank usage bumped. The old `rate` (flashcard) action is removed.
- **Plan** (`/api/plan`): Gemini narrative REMOVED — headline from day-rotating templates, insight reuses a `topic_links.reason` between today's topics (`composeNarrative()`).
- **Fact of the day**: `getFactOfTheDay()` in data.ts picks deterministically by day from `facts` (joined topic name; fallback = a topic key_point). Dashboard card, right column. Zero AI.

## RAG layer (added 2026-07-15 — `supabase/schema-rag.sql` must be run to activate)
User content is the source of truth. Everything ingested (article/notes) and every typed answer is chunked, embedded and stored so generation RETRIEVES the user's own material instead of leaning on the model's world knowledge. **Strictly additive + best-effort:** if `schema-rag.sql` isn't run yet, or embedding fails, every path degrades to the old behaviour (no errors).
- `src/lib/chunk.ts` — dependency-free overlapping chunker (~1400 chars ≈ 350 tokens, 200-char overlap, paragraph/sentence aware).
- `src/lib/gemini.ts` `embedTexts()/embedText()` — Gemini embeddings, L2-normalised client-side (truncated 768-dim isn't auto-normalised), `RETRIEVAL_DOCUMENT` vs `RETRIEVAL_QUERY` task types.
- `src/lib/rag.ts` — `indexContent()` (entry chunks), `indexAnswers()` (batched typed-answer chunks), `retrieveContext()` (query→embed→`match_knowledge_chunks` RPC), `formatContext()`. All catch-and-continue; recognise "RAG not installed" (42P01/42883) and stay quiet.
- **Wiring:** `/api/ingest` retrieves the user's prior related chunks and passes them to `extractKnowledge(text, existingTopics, priorContext)` as grounding (skipped on first ingest), then indexes the new entry. `/api/quiz` finish indexes typed (open/quickfire) answers. `knowledge_chunks` table + HNSW cosine index + `match_knowledge_chunks(query_embedding, match_count, min_similarity)` SQL function, all RLS-scoped to `auth.uid()`.
- Blog long-form generation from RAG is deliberately NOT wired (would add an AI call per page view, breaking the zero-AI-render budget) — see TASKS backlog.

## Key modules
- `src/components/BrainScene.tsx` (~850 lines) — the crown jewel. Stylised brain as particle shell; topics = glowing cortex patches; selection dives camera inside; label system: canvas-texture sprites in Space Grotesk, per-frame **screen-space declutter** (priority place → vertical nudge via `sprite.center` → fade), staggered edge labels, **labels are click targets** (raycast before glows, only when opacity > 0.3). Yaw bias +0.32 on landscape keeps selection out from under the info card.
- `src/components/ProgressMap.tsx` — streak Momentum card + **streak-milestone progress bar** (ladder 3/7/14/21/30/50/75/100/150/200/365; "N days to a M-day streak" + record-based motivational line) + 16-week review activity heatmap.
- `src/components/ProgressCalendar.tsx` — month-view study calendar (days lit by review count, month nav, today ring). **Lit days are buttons** → modal with that day's full report card via `getDayReport()`. Rendered only after profile loads to dodge SSR date mismatch.
- `src/components/ReportCardView.tsx` — shared report-card renderer (score ring header + per-question cards incl. truefalse/multi option highlighting, partial-credit chip). Used by /review report phase AND the calendar day modal. Exports `KIND_LABEL`.
- `src/components/Footer.tsx` — global footer in `layout.tsx` (brand + engram meaning, Explore links, Connect: /about, mailto contact, LinkedIn).
- `getDayReport(day)` in data.ts — merges ALL graded `quiz_sessions` reports of a day (fallback: rebuild from `reviews` rows); `getLatestReportToday()` delegates to it, so "See report" shows every question asked today. `getTopicQuestions(topicId)` returns the bank WITH answers for the blog Q&A section (`select *` so a missing correct_indices column degrades gracefully).
- `src/components/Nav.tsx` — top nav (Today/Brain/Add/Review + Profile/Sign-in pill; mobile 5th tab). Includes `authStatus` logic to correctly display 'Sign in' when unauthenticated in production.
- `src/lib/text.ts` — `stripMarkdown()`; Gemini sometimes emits markdown and daily plans are cached in `daily_plans`, so it's applied both in `/api/plan` before saving AND at render time on the dashboard.
- `src/components/RichText.tsx` — inline-markdown renderer (**bold**/*italic*/`code` → styled spans). Used for the dashboard "The thread today" insight instead of stripping (preserves emphasis). Recursive first-match parser; strips leading `#`/bullets.
- `src/app/review/page.tsx` — reads `?topic=<id>` from `window.location.search`; single-task mode when matched (`singleTask` flag suppresses `markPlanCompleted`). Full-plan mode now includes ALL plan items (not just remaining): done items show an "Already reviewed today" phase and auto-advance; quiz session started only for pending (non-done) topic IDs.
- `src/app/blogs/page.tsx` — standalone topic-blog library page. Filterable by search and category chip. Cards show mastery bar + review count. Links to `/blogs/[id]`. Added as **Blogs** (BookIcon) in `Nav.tsx` LINKS between Brain and Add.
- `src/lib/notes.ts` — **personal notes, localStorage-backed** (`engramia.notes.v1`), deliberately outside the graph/Supabase. CRUD + `childrenOf`/`countDescendants` tree helpers; `ensureSeeded()` writes a one-time welcome note; every write dispatches `NOTES_EVENT` (+ native `storage` event) so the /notes page and the dashboard "Personal notes" section stay in sync. `Note` type in `types.ts` (`parent_id` = subnote nesting).
- `src/components/Markdown.tsx` — dependency-free block+inline markdown renderer (headings, lists, blockquote, fenced code, hr, bold/italic/code/links). Used by the notes Read view. (`RichText.tsx` is the smaller inline-only variant for the dashboard insight.)
- `getTopicSource(topicId)` in `data.ts` → `TopicSource` (`{kind:"url",url}` | `{kind:"text"}` | null): the blog page shows where a topic came from. Real mode joins `entry_topics`→`entries.source_url`; demo uses `demoTopicSource` (a few arxiv/github URLs, rest text).
- `src/lib/srs.ts` — SM-2 spaced repetition (mastery calculations disabled). `src/lib/progress.ts` — Streaks and active days (XP calculations disabled).
- **RAG tables** — Run `supabase/schema-rag.sql` (creates `vector` extension, `knowledge_chunks` table + HNSW index + `match_knowledge_chunks` function, RLS). Safe to re-run. Until it's run, RAG is dormant and the app behaves exactly as before.
- **Quiz DB tables** — Run `supabase/schema-quiz-tables-only.sql` in your Supabase SQL editor (this file avoids policy conflicts if your database already has policies): creates `questions` (bank: kind/options/correct_index/**correct_indices jsonb**/model_answer/difficulty/times_asked), `facts`, `quiz_sessions` (items snapshot + report jsonb), `quiz_answers` (unique session_id+question_index), with RLS policies and indexes. Both schema files include `alter table questions add column if not exists correct_indices jsonb` for older DBs. Alternatively, run the full `supabase/schema.sql` if starting fresh.
- Quiz types in `types.ts`: `QuestionKind` (open|quickfire|mcq|truefalse|multi), `SessionQuestion` (client-safe, no answers), `QuizSession`, `ReportItem` (+selected_indices/correct_indices), `ReportCard`, `TopicQuestion` (bank WITH answers, for blogs), `DailyFact`; `Flashcard` type removed; `ExtractionResult` has `questions` + `facts` (no flashcards).
- `src/lib/demo.ts` — demo-mode seed data. `src/lib/data.ts` — data access.
- `src/lib/types.ts` — `Topic`, `TopicLink`, `categoryColor(category)`.
- `src/lib/supabase/{client,server}.ts`, `src/lib/gemini.ts`.
- `src/proxy.ts` — Next 16 proxy (migrated from middleware.ts). Auth gate honours the `engramia_guest` cookie (guest/demo access without an account) and deletes it as soon as a real session exists.
- **Guest mode / isDemo:** `isDemo` (demo.ts) = no `NEXT_PUBLIC_SUPABASE_URL` OR `engramia_guest=1` cookie. Cookie helpers `enableGuestMode()`/`clearGuestMode()`. Guest→signed-in transitions use full page loads so the module-level constant re-evaluates. Render-time isDemo checks (Nav, /add, /profile) go through post-mount state to keep hydration stable.
- **Plan done-tracking:** `PlanItem.done` computed at read time (today's `reviews` rows in real mode; `demoState.done` in demo). Dashboard plan section: green dots = remaining, done rows dimmed/✓/last, 5 rows + "Show all" toggle (plan caps at 10 items). Full /review runs cover only remaining items.

## Security posture (reviewed 2026-07-15)
- **SSRF guard on link ingest** (`src/app/api/ingest/route.ts` `assertPublicHttpUrl`): http(s) + standard ports only, blocks loopback/private/link-local/CGNAT IPv4, IPv6 ULA/link-local, `localhost`/`.local`/`.internal`, and credentials-in-URL. Redirects are followed MANUALLY (max 5 hops) so every hop is re-checked.
- **Per-user daily ingest cap** (`INGEST_DAILY_LIMIT`, default 20) — one Gemini call per ingest, so this protects the shared quota + storage. Stored text capped at 120k chars.
- All API routes wrap `request.json()` in try/catch (malformed-body → 400). `/auth/callback` redirects to `/login?error=auth` when `exchangeCodeForSession` fails instead of silently landing on the dashboard.
- RLS: every table `own <x>` policy is `auth.uid() = user_id` (profiles: `= id`; entry_topics via entry ownership). data.ts queries Supabase directly from the browser — RLS is the only thing isolating users, so keep it on every new table (the new `knowledge_chunks` has it).

## Dates / "today" (fixed 2026-07-15)
- `src/lib/dates.ts` is the single source for day boundaries. The app's "day" is the USER'S LOCAL calendar day, never the server's UTC day. Client passes its tz offset (`new Date().getTimezoneOffset()`) to `/api/plan?tz=` and quiz finish/complete bodies; server uses `localTodayForOffset`/`dayStartUtcIso`/`clampTz`. Client bucketing (calendar, heatmap, review detail) uses `localDayKey(new Date(created_at))`. This was the root cause of "answered questions show as not attempted": a UTC-vs-local day mismatch (e.g. evening IST reviews landing on the next UTC date) plus done-tracking that only read `reviews`. `doneTopicsToday()` now unions `reviews` rows AND `topics.last_reviewed_at` (always written on finish) so a failed reviews insert can't strand items.

## Conventions / gotchas
- Dev server: use `.claude/launch.json` name `synapse-dev` (autoPort; 3000 often taken by other projects).
- **Review page** (`src/app/review/page.tsx`): reads `?topic=` via `useSearchParams` (Suspense-wrapped) so switching between `/review?topic=A`, `?topic=B` and `/review` re-runs the init effect while the page stays mounted (fixes the "clicking a different question reroutes to the old one" bug — the old `window.location.search` read only ran on first mount). Full-plan runs sort pending-first so the session never opens on an "already reviewed" card; a single deep-linked task that turns out to be the LAST pending topic now marks the day complete itself.
- **Demo state persists** to `localStorage` (`engramia.demo.v1`) so guest progress survives reloads/hard-navigations: reviews/reports/streak carry over; `done` flags + `completed` reset on a new local day (mirrors the real backend). `saveDemoState()` after every demo mutation; `loadDemoState()` on module init when `isDemo`.
- Knowledge graph of this repo lives in `graphify-out/` (`graph.json`); query it instead of grepping. **The graphify CLI is installed** (PyPI `graphifyy`, double-y) at `/Users/bucc/.local/bin/graphify` — if not on PATH in a fresh shell, call it by full path or `export PATH="/Users/bucc/.local/bin:$PATH"`. Use `graphify query "…"` / `path` / `explain`; run `graphify update .` after code changes (AST-only, no API cost). NB: an unrelated `graphify` npm package (a "Random Graph Generator") is in the global npm dir with no bin — ignore it.
- Verify visual changes in the browser (demo mode works logged-out).
- **Notes are localStorage-only** (per-browser, no server/graph). Cross-device sync would need a Supabase `notes` table — deliberately deferred (see TASKS backlog).
- `npx tsc --noEmit` for typecheck; no test suite yet.
