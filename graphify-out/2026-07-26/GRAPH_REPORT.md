# Graph Report - startup-strategy-blueprint-6e9a0e  (2026-07-26)

## Corpus Check
- 227 files · ~436,847 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1409 nodes · 2595 edges · 101 communities (75 shown, 26 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5f5ce253`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Review and Scoring System
- TypeScript Configuration
- AI Content Generation
- Nav.tsx
- Dashboard and Visualization
- Project Dependencies
- RichText.tsx
- schema.sql
- BrainScene.tsx
- layout.tsx
- Engram Web Service
- proxy.ts
- Extraction Rules
- Incremental Update
- Graphify Skill
- next.config.ts
- postcss.config.mjs
- Graphify Watcher
- FalkorDB Export
- MCP Server
- Neo4j Export
- GitHub Clone
- Merge Graphs
- Git Commit Hook
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- graphify reference: extra exports and benchmark
- Engram — Project Summary
- graphify reference: query, path, explain
- Session Log
- Tasks
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- CLAUDE.md
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- CLAUDE.md
- extraction-spec.md
- Extraction Rules
- Graph Traversal
- Whisper Transcription
- Incremental Update
- Engram Project
- engram
- gemini.ts
- Nav.tsx
- index.ts
- index.ts
- page.tsx
- page.tsx
- QuestionKind
- Nav.tsx
- page.tsx
- Architecture & Urban Planning Story Creator Agent
- stories.ts
- route.ts
- route.ts
- ReadingThemeContext.tsx
- page.tsx
- Art, Design & UI/UX Story Creator Agent
- Biology & Ecology Story Creator Agent
- clear_cache.js
- clear_cache.ts
- Culinary Arts & Nutrition Story Creator Agent
- Economics Story Creator Agent
- Education & Pedagogy Story Creator Agent
- Fitness & Kinesiology Story Creator Agent
- Geography & Geopolitics Story Creator Agent
- History Story Creator Agent
- Legal Story Creator Agent
- Linguistics & Languages Story Creator Agent
- Literature & Creative Writing Story Creator Agent
- Marketing & Branding Story Creator Agent
- Mathematics & Statistics Story Creator Agent
- Medical Story Creator Agent
- Music Theory & Audio Story Creator Agent
- Philosophy Story Creator Agent
- Physics & Astronomy Story Creator Agent
- Political Science Story Creator Agent
- Psychiatry & Psychology Story Creator Agent
- Science (Physics/Chemistry/Biology) Story Creator Agent
- blog-gen.mts
- Sociology & Anthropology Story Creator Agent
- Tech & Engineering Story Creator Agent
- page.tsx
- route.ts
- route.ts
- gemini.ts
- RichText.tsx
- New story series: "Talking with Psychopaths and Savages" — Plan + Checklist
- True Crime & Forensic Casework Story Creator Agent
- QuestionKind
- srs.ts
- graphify reference: transcribe video and audio
- vercel.json
- graphify
- graphify reference: extraction subagent prompt
- page.tsx
- stories.ts
- Nav.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `Session Log` - 47 edges
2. `DSA Pattern Atlas — HelloInterview-style rewrite + diagram checklist` - 24 edges
3. `createClient()` - 22 edges
4. `DsaTopic` - 20 edges
5. `DSA content completion checklist — optimal solution + complexity section` - 20 edges
6. `AccentText()` - 18 edges
7. `invalidate()` - 18 edges
8. `POST()` - 17 edges
9. `Dashboard()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `backfill()` --calls--> `chunkText()`  [EXTRACTED]
  scripts/backfill-rag.mts → src/lib/chunk.ts
- `backfill()` --calls--> `embedTexts()`  [EXTRACTED]
  scripts/backfill-rag.mts → src/lib/gemini.ts
- `main()` --calls--> `parseVizPayload()`  [EXTRACTED]
  scripts/validate-viz.mts → src/components/viz/types.ts
- `duplicateResponse()` --indirect_call--> `t()`  [INFERRED]
  src/app/api/ingest/route.ts → src/lib/demo.ts
- `GET()` --indirect_call--> `t()`  [INFERRED]
  src/app/api/plan/route.ts → src/lib/demo.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Engram Core Logic** — src_lib_data, src_lib_gemini, src_lib_srs [EXTRACTED 0.90]
- **Graphify Core Operations** — claude_skills_graphify_references_update_incremental, claude_skills_graphify_references_query_traversal, claude_skills_graphify_references_github_and_merge_merge [EXTRACTED 0.90]
- **Graphify External Integrations** — claude_skills_graphify_references_exports_neo4j, claude_skills_graphify_references_exports_falkordb, claude_skills_graphify_references_exports_mcp [EXTRACTED 0.90]

## Communities (101 total, 26 thin omitted)

### Community 0 - "Review and Scoring System"
Cohesion: 0.12
Nodes (29): DemoSession, demoState, daysAgo(), daysAhead(), demoEntries, demoFacts, demoGrade(), demoLinks (+21 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 2 - "AI Content Generation"
Cohesion: 0.07
Nodes (45): extractVizBlocks(), main(), walkStrings(), AccentPill(), DifficultyPill(), PaperModeToggle(), Ash, drawShard() (+37 more)

### Community 3 - "Nav.tsx"
Cohesion: 0.11
Nodes (29): generateMetadata(), PsychopathsAndSavagesChapterPage(), generateMetadata(), generateStaticParams(), PsychopathsAndSavagesSectionPage(), metadata, PsychopathsAndSavagesPage(), getPsChapter() (+21 more)

### Community 4 - "Dashboard and Visualization"
Cohesion: 0.05
Nodes (39): 10. ⚠️ Known Gaps / Backlog (as of 2026-07-16), 1.1 System context diagram, 1.2 The three planes, 1.3 Deployment topology, 1. 🏗️ High-Level Design (HLD), 2.1 Entity-relationship diagram, 2.2 Table reference, 2.3 Row-Level Security (RLS) (+31 more)

### Community 5 - "Project Dependencies"
Cohesion: 0.05
Nodes (41): @google/genai, next, dependencies, @google/genai, next, posthog-js, react, react-dom (+33 more)

### Community 6 - "RichText.tsx"
Cohesion: 0.10
Nodes (33): metadata, SqlPlaybookPage(), generateMetadata(), SqlTopicPage(), generateMetadata(), generateStaticParams(), SqlProblemPage(), getSqlProblem() (+25 more)

### Community 7 - "schema.sql"
Cohesion: 0.08
Nodes (35): generateMetadata(), MacroChapterPage(), generateMetadata(), generateStaticParams(), MacroSectionPage(), MacroeconomicsPage(), metadata, CompActQuestion (+27 more)

### Community 8 - "BrainScene.tsx"
Cohesion: 0.12
Nodes (33): Dashboard(), Prefetcher(), CACHE_KEYS, cached(), CacheEntry, CacheOptions, canPersist, clearCache() (+25 more)

### Community 9 - "layout.tsx"
Cohesion: 0.06
Nodes (31): metadata, fraunces, grotesk, inter, jetmono, metadata, viewport, LoginPage() (+23 more)

### Community 10 - "Engram Web Service"
Cohesion: 0.50
Nodes (4): Engram Web Service, GEMINI_API_KEY, Node.js Runtime, NEXT_PUBLIC_SUPABASE_URL

### Community 11 - "proxy.ts"
Cohesion: 0.67
Nodes (3): config, proxy(), PUBLIC_PATHS

### Community 14 - "Graphify Skill"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 25 - "graphify reference: extra exports and benchmark"
Cohesion: 0.08
Nodes (24): ALL 18 CHAPTERS / 150 QUESTIONS COMPLETE — 2026-07-21, Chapter 10 — Tries (`tries.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20, Chapter 11 — Graphs (`graphs.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-20, Chapter 12 — Advanced Graphs (`advanced-graphs.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21, Chapter 13 — 1-D Dynamic Programming (`dp-1d.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21 (also normalized off old ASCII/Python template; hardcoded `questions` arrays preserved), Chapter 14 — 2-D Dynamic Programming (`dp-2d.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21 (also normalized off old ASCII/Python template; hardcoded `questions` arrays preserved), Chapter 15 — Greedy (`greedy.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21, Chapter 16 — Intervals (`intervals.ts`) — intro: [D: ✗] — CHAPTER DONE 2026-07-21 (+16 more)

### Community 26 - "Engram — Project Summary"
Cohesion: 0.15
Nodes (12): AI-call budget (deliberate design — keep it this way), Conventions / gotchas, Dates / "today" (fixed 2026-07-15), Design language, Key modules, Knovis — Project Summary, RAG layer (added 2026-07-15, hardened 2026-07-15 — `supabase/schema-rag.sql` THEN `schema-rag-v2.sql` must both be run to activate), RAG v2 — document registry, index versioning, hybrid search, observability (added 2026-07-15, `supabase/schema-rag-v2.sql`) (+4 more)

### Community 27 - "graphify reference: query, path, explain"
Cohesion: 0.09
Nodes (22): 10. tries (3), 11. graphs (13), 12. advanced-graphs (6), 13. dp-1d (12), 14. dp-2d (11), 15. greedy (8), 16. intervals (6), 17. math-geometry (8) (+14 more)

### Community 28 - "Session Log"
Cohesion: 0.04
Nodes (47): 2026-07-13 — AI-call minimisation redesign: question bank, batch report card, MCQs, fact of the day, 2026-07-13 — Brain label overhaul (clickable, Space Grotesk, declutter), 2026-07-13 — Dashboard/brain polish: rich insight, clickable plan, topic blogs, smaller labels, 2026-07-13 — Fix /profile infinite loading (missing profiles row), 2026-07-13 — Guest mode fix, plan done-tracking, review error card, blog pills, 2026-07-13 — Personal notes feature + blog source attribution, 2026-07-13 — Plan markdown fix, progress calendar, profile page, 2026-07-13 — Rebranding to Engramia + Mastery/XP removal + True/False Statements + Detailed completed reviews (+39 more)

### Community 29 - "Tasks"
Cohesion: 0.33
Nodes (5): Active milestone, Backlog, Done (recent), Paused milestone (pre-growth redesign — resume after retention signal), Tasks

### Community 30 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.09
Nodes (21): How to use this playbook, Knovis — 12-Week Growth Playbook, 📊 North-star metrics tracker (update every Friday), 🧭 One-line reminder, PHASE A — See the Truth & Sharpen (Weeks 1–2), PHASE B — Validation (Weeks 3–5), PHASE C — Finish the Monetizable Loop (Weeks 6–8), PHASE D — Launch (Weeks 9–12) (+13 more)

### Community 31 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.12
Nodes (15): 1. Set up PostHog (5 min) ✅ (local), 2. Verify Events Fire in PostHog (15 min), 3. Check RAG Status in Supabase (5 min), 4. Write the ICP One-Pager (20 min) ⭐ ✅ — written to `ICP.md` (Sarah Chen, L7 SDE prepping interviews; wedge = coding-interview prep), 5. Pick Your OMTM (One Minute) ⭐ ✅ — written to `OMTM.md`, 🤖 Agent Work — DONE, Browser Verification ✅, 📝 Commands You'll Need (+7 more)

### Community 32 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.17
Nodes (11): Chapter breakdown (12 chapters total), Content-safety approach (read this before writing any section body), Explicitly out of scope for this pass, Full touch-point checklist (verified via `grep -rl sarfaesi-act src/` — this is the exhaustive list, nothing hidden elsewhere), Implementation checklist, New story series: "Talking with Psychopaths and Savages" — Plan + Checklist, Page map (verified against the PDF's own table of contents + heading scan), Quiz + facts rules (per `true-crime-forensic-story-agent.md`, created 2026-07-21 — verified against the file's actual committed content, not asserted from memory) (+3 more)

### Community 33 - "CLAUDE.md"
Cohesion: 0.29
Nodes (9): backfill(), commit, TODO: if this is too slow, optimize to batch embed + store., supabase, Chunk, chunkText(), segments(), embedTexts() (+1 more)

### Community 34 - "graphify reference: GitHub clone and cross-repo merge"
Cohesion: 0.22
Nodes (8): How They Solve It Today (The Status Quo), Knovis ICP — Ideal Customer Profile, Red Flags (When NOT Our Customer), Summary, Their Problem (The Pain), Who (Character Sketch), Why Knovis Wins Their Money, Why They'd Pay (The Outcome They Want)

### Community 35 - "graphify reference: transcribe video and audio"
Cohesion: 0.22
Nodes (8): **Day-7 Return %**, How We Track It, OMTM — One Metric That Matters, Target, The Wall Copy, What We'll Do If Day-7 is Strong (≥20%), What We'll Do If Day-7 is Weak (<15%), Why This Metric

### Community 36 - "CLAUDE.md"
Cohesion: 0.18
Nodes (10): 1. Supabase, 2. Gemini, 3. Environment, 4. Run, Architecture, Deploy to Vercel, Features, 🧠 Knovis — learn it once, never forget it (+2 more)

### Community 37 - "extraction-spec.md"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 43 - "engram"
Cohesion: 0.25
Nodes (7): Architecture & Urban Planning Story Creator Agent, Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Architecture & Urban Planning, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 44 - "gemini.ts"
Cohesion: 0.18
Nodes (23): POST(), embedText(), DuplicateEntry, findDuplicateEntry(), getActiveIndexVersion(), getIndexVersionCorrelation(), getRetrievalMetrics(), hashContent() (+15 more)

### Community 45 - "Nav.tsx"
Cohesion: 0.18
Nodes (6): AddPage(), formatResetTime(), Mode, Phase, ApiError, IngestResult

### Community 46 - "index.ts"
Cohesion: 0.08
Nodes (41): DsaAtlasPage(), metadata, DsaTopicPage(), generateMetadata(), DsaProblemPage(), generateMetadata(), generateStaticParams(), DSA_TOPICS (+33 more)

### Community 47 - "index.ts"
Cohesion: 0.10
Nodes (31): CompActChapterPage(), generateMetadata(), CompActSectionPage(), generateMetadata(), generateStaticParams(), CompetitionActPage(), metadata, COMP_ACT_CHAPTERS (+23 more)

### Community 48 - "page.tsx"
Cohesion: 0.25
Nodes (7): Art, Design & UI/UX Story Creator Agent, Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Art & Design, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 49 - "page.tsx"
Cohesion: 0.23
Nodes (10): commit, deterministicBody(), firstSentenceAndRest(), limitArg, run(), sourceTextForTopic(), storySeededIds(), supabase (+2 more)

### Community 50 - "QuestionKind"
Cohesion: 0.25
Nodes (7): Biology & Ecology Story Creator Agent, Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Biology & Ecology, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 51 - "Nav.tsx"
Cohesion: 0.25
Nodes (7): Business & Finance Story Creator Agent, Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Business & Finance, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 52 - "page.tsx"
Cohesion: 0.14
Nodes (8): MODE_LABEL, FlameIcon(), nextMilestone(), ProgressMap(), SERIES_META, SERIES_TITLES, StorySection, UserStory

### Community 53 - "Architecture & Urban Planning Story Creator Agent"
Cohesion: 0.25
Nodes (7): Chemistry Story Creator Agent, Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Chemistry, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 54 - "stories.ts"
Cohesion: 0.12
Nodes (28): generateMetadata(), SarfaesiChapterPage(), generateMetadata(), generateStaticParams(), SarfaesiSectionPage(), metadata, SarfaesiActPage(), AccentText() (+20 more)

### Community 55 - "route.ts"
Cohesion: 0.12
Nodes (20): BlogsPage(), STORY_SERIES, BrainPage(), SERIES_TITLES, brainPoint(), BrainScene(), hashStr(), LinkObj (+12 more)

### Community 56 - "route.ts"
Cohesion: 0.33
Nodes (8): composeNarrative(), doneTopicsToday(), GET(), markDone(), GET(), dayStartUtcIso(), createClient(), ReviewMode

### Community 57 - "ReadingThemeContext.tsx"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Culinary Arts & Nutrition Story Creator Agent, Domain Guidelines: Culinary & Nutrition, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 58 - "page.tsx"
Cohesion: 0.24
Nodes (12): sourceLabel(), TopicBlogPage(), ProfilePage(), getLinks(), getProfile(), getTopic(), getTopicQuestions(), getTopics() (+4 more)

### Community 59 - "Art, Design & UI/UX Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Economics, Economics Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 60 - "Biology & Ecology Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Education & Pedagogy, Education & Pedagogy Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 61 - "clear_cache.js"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Fitness & Kinesiology, Fitness & Kinesiology Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 62 - "clear_cache.ts"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Geography & Geopolitics, Geography & Geopolitics Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 63 - "Culinary Arts & Nutrition Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: History, History Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 64 - "Economics Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Law & Compliance, Legal Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 65 - "Education & Pedagogy Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Linguistics, Linguistics & Languages Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 66 - "Fitness & Kinesiology Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Literature & Writing, Literature & Creative Writing Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 67 - "Geography & Geopolitics Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Marketing & Branding, Marketing & Branding Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 68 - "History Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Mathematics & Statistics, Mathematics & Statistics Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 69 - "Legal Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Medicine & Biology, Medical Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 70 - "Linguistics & Languages Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Music Theory, Music Theory & Audio Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 71 - "Literature & Creative Writing Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Philosophy, Output Format, Pedagogical Framework, Philosophy Story Creator Agent, Quiz Isolation Rules

### Community 72 - "Marketing & Branding Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Physics & Astronomy, Output Format, Pedagogical Framework, Physics & Astronomy Story Creator Agent, Quiz Isolation Rules

### Community 73 - "Mathematics & Statistics Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Politics, Output Format, Pedagogical Framework, Political Science Story Creator Agent, Quiz Isolation Rules

### Community 74 - "Medical Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Psychiatry & Psychology, Output Format, Pedagogical Framework, Psychiatry & Psychology Story Creator Agent, Quiz Isolation Rules

### Community 75 - "Music Theory & Audio Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Science, Output Format, Pedagogical Framework, Quiz Isolation Rules, Science (Physics/Chemistry/Biology) Story Creator Agent

### Community 76 - "Philosophy Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Self-Help, Output Format, Pedagogical Framework, Quiz Isolation Rules, Self-Help & Personal Development Story Creator Agent

### Community 77 - "Physics & Astronomy Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Sociology & Anthropology, Output Format, Pedagogical Framework, Quiz Isolation Rules, Sociology & Anthropology Story Creator Agent

### Community 78 - "Political Science Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Tech & Algorithms (The HelloInterview Approach), Output Format, Pedagogical Framework, Quiz Isolation Rules, Tech & Engineering Story Creator Agent

### Community 79 - "Psychiatry & Psychology Story Creator Agent"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: True Crime & Forensic Casework, Output Format, Pedagogical Framework, Quiz Isolation Rules, True Crime & Forensic Casework Story Creator Agent

### Community 80 - "Science (Physics/Chemistry/Biology) Story Creator Agent"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 82 - "Sociology & Anthropology Story Creator Agent"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 83 - "Tech & Engineering Story Creator Agent"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 84 - "page.tsx"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 85 - "route.ts"
Cohesion: 0.22
Nodes (16): POST(), answer(), BankQuestion, CHOICE_KINDS, finish(), heuristicScore(), pickQuestion(), POST() (+8 more)

### Community 86 - "route.ts"
Cohesion: 0.18
Nodes (18): assertPublicHttpUrl(), duplicateResponse(), fetchReadable(), INGEST_DAILY_LIMIT, isBlockedIp(), isBlockedIPv4(), isBlockedIPv6(), LookupCallback (+10 more)

### Community 87 - "gemini.ts"
Cohesion: 0.18
Nodes (12): client(), cooldownUntil, EMBED_DIMS, EmbedTaskType, extractKnowledge(), generateJson(), isRetryableModelError(), MODEL_CHAIN (+4 more)

### Community 91 - "QuestionKind"
Cohesion: 0.16
Nodes (10): SnapshotItem, KIND_LABEL, Question, MATH_SYMBOLS, parse(), RichText(), RULES, tidy() (+2 more)

### Community 98 - "page.tsx"
Cohesion: 0.16
Nodes (20): ancestorsInclude(), NoteEditor(), NoteRow(), NotesPage(), INLINE, InlineRule, MATH_SYMBOLS, renderMath() (+12 more)

### Community 99 - "stories.ts"
Cohesion: 0.29
Nodes (14): KIND_LABEL, StoryLearnPanel(), STORY_COLORS, StoryStartControl(), completeSection(), endStory(), FAR_FUTURE(), getResumeHref() (+6 more)

### Community 100 - "Nav.tsx"
Cohesion: 0.13
Nodes (16): QuizCarousel(), dayClasses(), dayKey(), ProgressCalendar(), WEEKDAYS, BigScoreRing(), getDayReport(), getTodayReviewDetail() (+8 more)

### Community 103 - "page.tsx"
Cohesion: 0.12
Nodes (20): GroupRunner(), ReviewRunner(), SERIES_COLORS, SERIES_TITLES, trackLanded(), trackRecallGraded(), trackStreakAdvanced(), api() (+12 more)

## Knowledge Gaps
- **568 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+563 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `run()` connect `page.tsx` to `gemini.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `QuestionKind` connect `QuestionKind` to `Review and Scoring System`, `Nav.tsx`, `schema.sql`, `index.ts`, `index.ts`, `route.ts`, `stories.ts`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `AccentText()` connect `stories.ts` to `AI Content Generation`, `RichText.tsx`, `schema.sql`, `index.ts`, `index.ts`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _568 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Review and Scoring System` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `AI Content Generation` be split into smaller, more focused modules?**
  _Cohesion score 0.07191961924907457 - nodes in this community are weakly interconnected._