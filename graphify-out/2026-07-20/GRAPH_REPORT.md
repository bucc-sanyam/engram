# Graph Report - Learning  (2026-07-19)

## Corpus Check
- 172 files · ~229,539 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 999 nodes · 1817 edges · 84 communities (61 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `40d3a635`
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
- createClient
- ProgressCalendar.tsx
- Architecture & Urban Planning Story Creator Agent
- stories.ts
- route.ts
- route.ts
- ReadingThemeContext.tsx
- gemini.ts
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
- Self-Help & Personal Development Story Creator Agent
- Sociology & Anthropology Story Creator Agent
- Tech & Engineering Story Creator Agent

## God Nodes (most connected - your core abstractions)
1. `Session Log` - 29 edges
2. `createClient()` - 22 edges
3. `DsaTopic` - 20 edges
4. `POST()` - 17 edges
5. `compilerOptions` - 16 edges
6. `Dashboard()` - 15 edges
7. `isMissingRag()` - 14 edges
8. `SqlTopic` - 14 edges
9. `getTopics()` - 13 edges
10. `categoryColor()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `duplicateResponse()` --indirect_call--> `t()`  [INFERRED]
  src/app/api/ingest/route.ts → src/lib/demo.ts
- `GET()` --indirect_call--> `t()`  [INFERRED]
  src/app/api/plan/route.ts → src/lib/demo.ts
- `TopicBlogPage()` --indirect_call--> `t()`  [INFERRED]
  src/app/blogs/[id]/page.tsx → src/lib/demo.ts
- `BrainPage()` --indirect_call--> `l()`  [INFERRED]
  src/app/brain/page.tsx → src/lib/demo.ts
- `BrainPage()` --indirect_call--> `t()`  [INFERRED]
  src/app/brain/page.tsx → src/lib/demo.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Engram Core Logic** — src_lib_data, src_lib_gemini, src_lib_srs [EXTRACTED 0.90]
- **Graphify Core Operations** — claude_skills_graphify_references_update_incremental, claude_skills_graphify_references_query_traversal, claude_skills_graphify_references_github_and_merge_merge [EXTRACTED 0.90]
- **Graphify External Integrations** — claude_skills_graphify_references_exports_neo4j, claude_skills_graphify_references_exports_falkordb, claude_skills_graphify_references_exports_mcp [EXTRACTED 0.90]

## Communities (84 total, 23 thin omitted)

### Community 0 - "Review and Scoring System"
Cohesion: 0.17
Nodes (17): DemoSession, demoState, demoEntries, demoFacts, demoGrade(), demoLinks, demoPlan, demoProfile (+9 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 2 - "AI Content Generation"
Cohesion: 0.14
Nodes (21): POST(), answer(), BankQuestion, CHOICE_KINDS, finish(), heuristicScore(), pickQuestion(), POST() (+13 more)

### Community 3 - "Nav.tsx"
Cohesion: 0.05
Nodes (39): 10. ⚠️ Known Gaps / Backlog (as of 2026-07-16), 1.1 System context diagram, 1.2 The three planes, 1.3 Deployment topology, 1. 🏗️ High-Level Design (HLD), 2.1 Entity-relationship diagram, 2.2 Table reference, 2.3 Row-Level Security (RLS) (+31 more)

### Community 4 - "Dashboard and Visualization"
Cohesion: 0.18
Nodes (10): 1. Supabase, 2. Gemini, 3. Environment, 4. Run, Architecture, Deploy to Vercel, Features, 🧠 Knovis — your second brain (+2 more)

### Community 5 - "Project Dependencies"
Cohesion: 0.05
Nodes (39): @google/genai, next, dependencies, @google/genai, next, react, react-dom, @supabase/ssr (+31 more)

### Community 6 - "RichText.tsx"
Cohesion: 0.10
Nodes (33): metadata, SqlPlaybookPage(), generateMetadata(), SqlTopicPage(), generateMetadata(), generateStaticParams(), SqlProblemPage(), getSqlProblem() (+25 more)

### Community 7 - "schema.sql"
Cohesion: 0.30
Nodes (15): ancestorsInclude(), NoteEditor(), NoteRow(), NotesPage(), childrenOf(), countDescendants(), createNote(), deleteNote() (+7 more)

### Community 8 - "BrainScene.tsx"
Cohesion: 0.05
Nodes (56): BlogsPage(), STORY_SERIES, BrainPage(), SERIES_TITLES, Dashboard(), MODE_LABEL, SERIES_TITLES, ProfilePage() (+48 more)

### Community 9 - "layout.tsx"
Cohesion: 0.07
Nodes (29): metadata, fraunces, grotesk, inter, jetmono, metadata, viewport, LoginPage() (+21 more)

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
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 26 - "Engram — Project Summary"
Cohesion: 0.15
Nodes (12): AI-call budget (deliberate design — keep it this way), Conventions / gotchas, Dates / "today" (fixed 2026-07-15), Design language, Key modules, Knovis — Project Summary, RAG layer (added 2026-07-15, hardened 2026-07-15 — `supabase/schema-rag.sql` THEN `schema-rag-v2.sql` must both be run to activate), RAG v2 — document registry, index versioning, hybrid search, observability (added 2026-07-15, `supabase/schema-rag-v2.sql`) (+4 more)

### Community 27 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 28 - "Session Log"
Cohesion: 0.07
Nodes (29): 2026-07-13 — AI-call minimisation redesign: question bank, batch report card, MCQs, fact of the day, 2026-07-13 — Brain label overhaul (clickable, Space Grotesk, declutter), 2026-07-13 — Dashboard/brain polish: rich insight, clickable plan, topic blogs, smaller labels, 2026-07-13 — Fix /profile infinite loading (missing profiles row), 2026-07-13 — Guest mode fix, plan done-tracking, review error card, blog pills, 2026-07-13 — Personal notes feature + blog source attribution, 2026-07-13 — Plan markdown fix, progress calendar, profile page, 2026-07-13 — Rebranding to Engramia + Mastery/XP removal + True/False Statements + Detailed completed reviews (+21 more)

### Community 29 - "Tasks"
Cohesion: 0.40
Nodes (4): Active milestone, Backlog, Done (recent), Tasks

### Community 30 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 31 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 32 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 44 - "gemini.ts"
Cohesion: 0.15
Nodes (28): POST(), Chunk, chunkText(), segments(), embedText(), embedTexts(), DuplicateEntry, findDuplicateEntry() (+20 more)

### Community 45 - "Nav.tsx"
Cohesion: 0.18
Nodes (6): AddPage(), formatResetTime(), Mode, Phase, ApiError, IngestResult

### Community 46 - "index.ts"
Cohesion: 0.08
Nodes (39): DsaAtlasPage(), metadata, DsaTopicPage(), generateMetadata(), DsaProblemPage(), generateMetadata(), generateStaticParams(), DSA_TOPICS (+31 more)

### Community 47 - "index.ts"
Cohesion: 0.10
Nodes (31): CompActChapterPage(), generateMetadata(), CompActSectionPage(), generateMetadata(), generateStaticParams(), CompetitionActPage(), metadata, COMP_ACT_CHAPTERS (+23 more)

### Community 48 - "page.tsx"
Cohesion: 0.15
Nodes (17): QuizCarousel(), ReviewRunner(), SERIES_COLORS, SERIES_TITLES, api(), finishQuiz(), getLatestReportToday(), getPlan() (+9 more)

### Community 49 - "page.tsx"
Cohesion: 0.16
Nodes (9): BigScoreRing(), KIND_LABEL, Category, DailyFact, GradeResult, QuizSession, ReportCard, ReportItem (+1 more)

### Community 50 - "QuestionKind"
Cohesion: 0.33
Nodes (5): SnapshotItem, KIND_LABEL, Question, DemoBankQuestion, QuestionKind

### Community 51 - "createClient"
Cohesion: 0.36
Nodes (6): sourceLabel(), TopicBlogPage(), getLinks(), getTopic(), getTopicQuestions(), getTopicSource()

### Community 52 - "ProgressCalendar.tsx"
Cohesion: 0.18
Nodes (15): FlameIcon(), dayClasses(), dayKey(), ProgressCalendar(), WEEKDAYS, nextMilestone(), ProgressMap(), getDayReport() (+7 more)

### Community 53 - "Architecture & Urban Planning Story Creator Agent"
Cohesion: 0.33
Nodes (5): Architecture & Urban Planning Story Creator Agent, Domain Guidelines: Architecture & Urban Planning, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 54 - "stories.ts"
Cohesion: 0.08
Nodes (34): generateMetadata(), SarfaesiChapterPage(), generateMetadata(), generateStaticParams(), SarfaesiSectionPage(), metadata, SarfaesiActPage(), INLINE (+26 more)

### Community 55 - "route.ts"
Cohesion: 0.18
Nodes (19): assertPublicHttpUrl(), duplicateResponse(), fetchReadable(), INGEST_DAILY_LIMIT, isBlockedIp(), isBlockedIPv4(), isBlockedIPv6(), LookupCallback (+11 more)

### Community 56 - "route.ts"
Cohesion: 0.26
Nodes (10): composeNarrative(), doneTopicsToday(), GET(), markDone(), GET(), dayStartUtcIso(), createClient(), DailyPlan (+2 more)

### Community 57 - "ReadingThemeContext.tsx"
Cohesion: 0.19
Nodes (8): PaperModeToggle(), Particle, ThanosSnapCanvas(), ThanosSnapCanvasProps, ReadingThemeContext, ReadingThemeContextType, ReadingThemeProvider(), useReadingTheme()

### Community 58 - "gemini.ts"
Cohesion: 0.20
Nodes (11): client(), cooldownUntil, EMBED_DIMS, EmbedTaskType, generateJson(), isRetryableModelError(), MODEL_CHAIN, normalise() (+3 more)

### Community 59 - "Art, Design & UI/UX Story Creator Agent"
Cohesion: 0.33
Nodes (5): Art, Design & UI/UX Story Creator Agent, Domain Guidelines: Art & Design, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 60 - "Biology & Ecology Story Creator Agent"
Cohesion: 0.33
Nodes (5): Biology & Ecology Story Creator Agent, Domain Guidelines: Biology & Ecology, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 61 - "clear_cache.js"
Cohesion: 0.33
Nodes (5): Business & Finance Story Creator Agent, Domain Guidelines: Business & Finance, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 62 - "clear_cache.ts"
Cohesion: 0.33
Nodes (5): Chemistry Story Creator Agent, Domain Guidelines: Chemistry, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 63 - "Culinary Arts & Nutrition Story Creator Agent"
Cohesion: 0.33
Nodes (5): Culinary Arts & Nutrition Story Creator Agent, Domain Guidelines: Culinary & Nutrition, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 64 - "Economics Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Economics, Economics Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 65 - "Education & Pedagogy Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Education & Pedagogy, Education & Pedagogy Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 66 - "Fitness & Kinesiology Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Fitness & Kinesiology, Fitness & Kinesiology Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 67 - "Geography & Geopolitics Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Geography & Geopolitics, Geography & Geopolitics Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 68 - "History Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: History, History Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 69 - "Legal Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Law & Compliance, Legal Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 70 - "Linguistics & Languages Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Linguistics, Linguistics & Languages Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 71 - "Literature & Creative Writing Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Literature & Writing, Literature & Creative Writing Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 72 - "Marketing & Branding Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Marketing & Branding, Marketing & Branding Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 73 - "Mathematics & Statistics Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Mathematics & Statistics, Mathematics & Statistics Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 74 - "Medical Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Medicine & Biology, Medical Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 75 - "Music Theory & Audio Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Music Theory, Music Theory & Audio Story Creator Agent, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 76 - "Philosophy Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Philosophy, Output Format, Pedagogical Framework, Philosophy Story Creator Agent, Quiz Isolation Rules

### Community 77 - "Physics & Astronomy Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Physics & Astronomy, Output Format, Pedagogical Framework, Physics & Astronomy Story Creator Agent, Quiz Isolation Rules

### Community 78 - "Political Science Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Politics, Output Format, Pedagogical Framework, Political Science Story Creator Agent, Quiz Isolation Rules

### Community 79 - "Psychiatry & Psychology Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Psychiatry & Psychology, Output Format, Pedagogical Framework, Psychiatry & Psychology Story Creator Agent, Quiz Isolation Rules

### Community 80 - "Science (Physics/Chemistry/Biology) Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Science, Output Format, Pedagogical Framework, Quiz Isolation Rules, Science (Physics/Chemistry/Biology) Story Creator Agent

### Community 81 - "Self-Help & Personal Development Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Self-Help, Output Format, Pedagogical Framework, Quiz Isolation Rules, Self-Help & Personal Development Story Creator Agent

### Community 82 - "Sociology & Anthropology Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Sociology & Anthropology, Output Format, Pedagogical Framework, Quiz Isolation Rules, Sociology & Anthropology Story Creator Agent

### Community 83 - "Tech & Engineering Story Creator Agent"
Cohesion: 0.33
Nodes (5): Domain Guidelines: Tech & Algorithms (The HelloInterview Approach), Output Format, Pedagogical Framework, Quiz Isolation Rules, Tech & Engineering Story Creator Agent

## Knowledge Gaps
- **367 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+362 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Topic` connect `BrainScene.tsx` to `Review and Scoring System`, `AI Content Generation`, `page.tsx`, `createClient`, `route.ts`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `QuestionKind` connect `QuestionKind` to `Review and Scoring System`, `AI Content Generation`, `index.ts`, `page.tsx`, `stories.ts`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `createClient()` connect `route.ts` to `AI Content Generation`, `gemini.ts`, `route.ts`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _367 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `AI Content Generation` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._
- **Should `Nav.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._