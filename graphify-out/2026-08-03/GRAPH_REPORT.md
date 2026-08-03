# Graph Report - startup-strategy-blueprint-6e9a0e  (2026-08-03)

## Corpus Check
- 288 files · ~580,132 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2019 nodes · 3666 edges · 134 communities (109 shown, 25 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5aa5a45`
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
- useVizPalette
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
- page.tsx
- draw.ts
- ReadingThemeContext.tsx
- route.ts
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
- AccentText.tsx
- cache.ts
- graphify reference: transcribe video and audio
- vercel.json
- graphify
- graphify reference: extraction subagent prompt
- Prompt — draw an interactive textbook plate
- page.tsx
- stories.ts
- index.ts
- render-figures.mts
- Nav.tsx
- route.ts
- ReadingThemeContext.tsx
- ThanosSnapCanvas.tsx
- page.tsx
- Knovis for Schools — implementation brief & cost model
- Knovis for Schools — B2B feasibility & positioning blueprint
- route.ts
- index.ts
- types.ts
- ch-03.ts
- ch-05.ts
- ch-03.ts
- ch-06.ts
- cache.ts
- shading.ts
- ch-02-animal-plate.ts
- Knovis for Schools — build specification (class 9, Exploration + Ganita Manjari)
- 2. Verified codebase facts — treat as ground truth
- validate-cbse.mts
- Task 3.2 — `src/components/school/ChapterReader.tsx`
- layout.tsx
- FigureSim.tsx
- 6. Phase 2 — simulation primitives
- 8. Phase 4 — content authoring (the six chapters)
- 9. Phase 5 — school-branded URLs
- index.ts
- 5. Phase 1 — types and contracts
- BrainScene.tsx
- page.tsx
- blog-gen.mts
- RichText.tsx

## God Nodes (most connected - your core abstractions)
1. `Session Log` - 74 edges
2. `useVizPalette()` - 30 edges
3. `DSA Pattern Atlas — HelloInterview-style rewrite + diagram checklist` - 24 edges
4. `createClient()` - 23 edges
5. `AccentText()` - 21 edges
6. `DsaTopic` - 20 edges
7. `DSA content completion checklist — optimal solution + complexity section` - 20 edges
8. `invalidate()` - 19 edges
9. `POST()` - 18 edges
10. `useReadingTheme()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `ThanosSnapCanvas()` --indirect_call--> `render()`  [INFERRED]
  src/components/ThanosSnapCanvas.tsx → scripts/render-figures.mts
- `loadEnv()` --indirect_call--> `f()`  [INFERRED]
  scripts/blog-gen.mts → src/lib/cbse/class9/science/figures/ch-02-cell-plate.ts
- `render()` --calls--> `layerSubset()`  [EXTRACTED]
  scripts/render-figures.mts → src/lib/sim/draw.ts
- `render()` --calls--> `liftSubset()`  [EXTRACTED]
  scripts/render-figures.mts → src/lib/sim/draw.ts
- `render()` --calls--> `cartoonFor()`  [EXTRACTED]
  scripts/render-figures.mts → src/lib/sim/shading.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Engram Core Logic** — src_lib_data, src_lib_gemini, src_lib_srs [EXTRACTED 0.90]
- **Graphify Core Operations** — claude_skills_graphify_references_update_incremental, claude_skills_graphify_references_query_traversal, claude_skills_graphify_references_github_and_merge_merge [EXTRACTED 0.90]
- **Graphify External Integrations** — claude_skills_graphify_references_exports_neo4j, claude_skills_graphify_references_exports_falkordb, claude_skills_graphify_references_exports_mcp [EXTRACTED 0.90]

## Communities (134 total, 25 thin omitted)

### Community 0 - "Review and Scoring System"
Cohesion: 0.10
Nodes (40): api(), BlogTopicLibrary, DemoSession, demoState, finishQuiz(), getStreakRepairStatus(), ingestLink(), ingestText() (+32 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 2 - "AI Content Generation"
Cohesion: 0.12
Nodes (23): extractVizBlocks(), main(), walkStrings(), ArrayViz(), ComplexityViz(), FlowViz(), wrapLabel(), TreeViz() (+15 more)

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
Cohesion: 0.13
Nodes (27): generateMetadata(), MacroChapterPage(), generateMetadata(), generateStaticParams(), MacroSectionPage(), MacroeconomicsPage(), metadata, getMacroChapter() (+19 more)

### Community 8 - "useVizPalette"
Cohesion: 0.11
Nodes (22): AnatomySim(), SimReadout(), SimSlider(), GeometryBoardSim(), GraphPlotSim(), PAD, SimBlock(), SimFallback() (+14 more)

### Community 9 - "layout.tsx"
Cohesion: 0.22
Nodes (12): SpotRect, TutorialTour(), clearGuestMode(), clearTourState(), DEMO_REVIEW_QUESTION, markTourSeen(), readTourState(), saveTourState() (+4 more)

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
Cohesion: 0.13
Nodes (14): AI-call budget (deliberate design — keep it this way), Conventions / gotchas, Dates / "today" (fixed 2026-07-15), Design language, Diagram rendering — how the figures are drawn (settled 2026-08-02), Key modules, Knovis — Project Summary, RAG layer (added 2026-07-15, hardened 2026-07-15 — `supabase/schema-rag.sql` THEN `schema-rag-v2.sql` must both be run to activate) (+6 more)

### Community 27 - "graphify reference: query, path, explain"
Cohesion: 0.09
Nodes (22): 10. tries (3), 11. graphs (13), 12. advanced-graphs (6), 13. dp-1d (12), 14. dp-2d (11), 15. greedy (8), 16. intervals (6), 17. math-geometry (8) (+14 more)

### Community 28 - "Session Log"
Cohesion: 0.03
Nodes (74): 2026-07-13 — AI-call minimisation redesign: question bank, batch report card, MCQs, fact of the day, 2026-07-13 — Brain label overhaul (clickable, Space Grotesk, declutter), 2026-07-13 — Dashboard/brain polish: rich insight, clickable plan, topic blogs, smaller labels, 2026-07-13 — Fix /profile infinite loading (missing profiles row), 2026-07-13 — Guest mode fix, plan done-tracking, review error card, blog pills, 2026-07-13 — Personal notes feature + blog source attribution, 2026-07-13 — Plan markdown fix, progress calendar, profile page, 2026-07-13 — Rebranding to Engramia + Mastery/XP removal + True/False Statements + Detailed completed reviews (+66 more)

### Community 29 - "Tasks"
Cohesion: 0.20
Nodes (9): Active milestone, Backlog, Decisions (recorded — no action unless revisited), Done (recent), Enhancements (code, when prioritized), 🧑 Owed by you — DB migrations (need the Supabase SQL editor; no raw-SQL/DDL access from this environment), Paused milestone (pre-growth redesign — resume after retention signal), School track (+1 more)

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
Cohesion: 0.08
Nodes (35): EnglishCommunicationChapterPage(), generateMetadata(), EnglishCommunicationSectionPage(), generateMetadata(), generateStaticParams(), EnglishCommunicationPage(), metadata, CompActQuestion (+27 more)

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
Cohesion: 0.13
Nodes (32): backfill(), commit, TODO: if this is too slow, optimize to batch embed + store., supabase, POST(), Chunk, chunkText(), segments() (+24 more)

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
Cohesion: 0.08
Nodes (14): GroupRunner(), ReviewRunner(), SERIES_COLORS, SERIES_TITLES, BigScoreRing(), trackRecallGraded(), trackSignedIn(), trackStreakAdvanced() (+6 more)

### Community 53 - "Architecture & Urban Planning Story Creator Agent"
Cohesion: 0.25
Nodes (7): Chemistry Story Creator Agent, Content Depth & Engagement, Coverage & Completeness, Domain Guidelines: Chemistry, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 54 - "stories.ts"
Cohesion: 0.13
Nodes (26): generateMetadata(), SarfaesiChapterPage(), generateMetadata(), generateStaticParams(), SarfaesiSectionPage(), SarfaesiActPage(), getSarfaesiChapter(), getSarfaesiSection() (+18 more)

### Community 55 - "page.tsx"
Cohesion: 0.14
Nodes (23): Dashboard(), MODE_LABEL, RevisionRow(), scoreColor(), Prefetcher(), trackLanded(), cached(), prefetch() (+15 more)

### Community 56 - "draw.ts"
Cohesion: 0.15
Nodes (24): Acc, Box, centreOf(), chromosomes(), circle(), cisterna(), cristae(), discStack() (+16 more)

### Community 57 - "ReadingThemeContext.tsx"
Cohesion: 0.25
Nodes (7): Content Depth & Engagement, Coverage & Completeness, Culinary Arts & Nutrition Story Creator Agent, Domain Guidelines: Culinary & Nutrition, Output Format, Pedagogical Framework, Quiz Isolation Rules

### Community 58 - "route.ts"
Cohesion: 0.24
Nodes (17): computeStatus(), GET(), Ineligible, loadActiveDays(), POST(), reasonMessage(), REPAIR_MAX_GAP_DAYS, REPAIR_ROLLING_LIMIT (+9 more)

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

### Community 81 - "blog-gen.mts"
Cohesion: 0.10
Nodes (22): loadEnv(), CHLORO, chloroPaths, cristaePaths, f(), granaPaths, hex(), hexPts() (+14 more)

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
Cohesion: 0.15
Nodes (19): duplicateResponse(), answer(), BankQuestion, CHOICE_KINDS, finish(), heuristicCommunicationScore(), heuristicScore(), pickQuestion() (+11 more)

### Community 86 - "route.ts"
Cohesion: 0.16
Nodes (20): assertPublicHttpUrl(), fetchReadable(), INGEST_DAILY_LIMIT, isBlockedIp(), isBlockedIPv4(), isBlockedIPv6(), LookupCallback, POST() (+12 more)

### Community 87 - "gemini.ts"
Cohesion: 0.16
Nodes (15): client(), cooldownUntil, EMBED_DIMS, EmbedTaskType, extractKnowledge(), generateJson(), gradeCommunicationSession(), GradeMode (+7 more)

### Community 91 - "AccentText.tsx"
Cohesion: 0.30
Nodes (14): metadata, AccentPill(), AccentText(), DifficultyPill(), TableDiffViz(), useReadingTheme(), clamp(), darkenForPaper() (+6 more)

### Community 92 - "cache.ts"
Cohesion: 0.13
Nodes (15): BlogsPage(), STORY_SERIES, BrainPage(), SERIES_TITLES, SERIES_META, SERIES_TITLES, getBlogTopicLibrary(), l() (+7 more)

### Community 97 - "Prompt — draw an interactive textbook plate"
Cohesion: 0.14
Nodes (13): Absolute constraint on originality, How the renderer paints, which determines how you author, Labels, Making it read as a solid, not a sticker, Output, Palette, Path helpers you may import from `@/lib/sim/draw`, Prompt — draw an interactive textbook plate (+5 more)

### Community 98 - "page.tsx"
Cohesion: 0.16
Nodes (20): ancestorsInclude(), NoteEditor(), NoteRow(), NotesPage(), INLINE, InlineRule, MATH_SYMBOLS, renderMath() (+12 more)

### Community 99 - "stories.ts"
Cohesion: 0.24
Nodes (17): KIND_LABEL, StoryLearnPanel(), STORY_COLORS, StoryStartControl(), invalidate(), invalidateIngest(), invalidateProgress(), invalidateStories() (+9 more)

### Community 100 - "index.ts"
Cohesion: 0.17
Nodes (13): metadata, SUBJECT_META, ch03Numbers, ch06PerimeterArea, MATHS_CHAPTERS, ch02Cell, ch03Tissues, ch05Mixtures (+5 more)

### Community 101 - "render-figures.mts"
Cohesion: 0.21
Nodes (12): args, audit(), clampN(), esc(), layerSvg(), liftFlag, palette(), problems (+4 more)

### Community 102 - "Nav.tsx"
Cohesion: 0.15
Nodes (5): metadata, BrainIcon(), FlameIcon(), LINKS, Nav()

### Community 103 - "route.ts"
Cohesion: 0.18
Nodes (16): QuizCarousel(), dayClasses(), dayKey(), ProgressCalendar(), WEEKDAYS, Heatmap(), nextMilestone(), ProgressMap() (+8 more)

### Community 104 - "ReadingThemeContext.tsx"
Cohesion: 0.16
Nodes (11): PaperModeToggle(), Ash, drawShard(), drawTile(), shade(), Shard, ThanosSnapCanvas(), ThanosSnapCanvasProps (+3 more)

### Community 105 - "ThanosSnapCanvas.tsx"
Cohesion: 0.05
Nodes (41): 0. Read this first — the one scoping decision, 10. Risks, 11. What I would build first, in order, 12. Open decisions before implementation, 1. Scope, 2.1 Route scheme, 2.2 The reserved-slug guard — mandatory, 2.3 Branding (+33 more)

### Community 106 - "page.tsx"
Cohesion: 0.20
Nodes (13): BlogBody(), parseBodySections(), sourceLabel(), TopicBlogPage(), ProfilePage(), getLinks(), getTopic(), getTopicQuestions() (+5 more)

### Community 107 - "Knovis for Schools — implementation brief & cost model"
Cohesion: 0.05
Nodes (39): 0. Four headline findings, 1. Decision #1 — URL structure and per-school branding, 2. Decision #2 — class-9 content by August, 3.1 The metric that only you can produce, 3.2 What the dashboard shows, 3.3 Build note, 3. Decision #3 — the teacher dashboard, 4. Cost model — assumptions and unit prices (+31 more)

### Community 108 - "Knovis for Schools — B2B feasibility & positioning blueprint"
Cohesion: 0.05
Nodes (38): 10.1 Identity: join codes, not email domains, 10.2 RLS: the current model is row-owner, teacher visibility is not, 10.3 Content scoping is a routing problem, not an RLS problem, 10.4 The AI budget breaks at school scale, 10. The school track inside the existing codebase, 11. Risks, ranked, with kill criteria, 12. The conflict you have to resolve first, 13. Open questions that change the answer (+30 more)

### Community 109 - "route.ts"
Cohesion: 0.29
Nodes (10): composeNarrative(), doneTopicsToday(), GET(), markDone(), POST(), GET(), clampTz(), dayStartUtcIso() (+2 more)

### Community 110 - "index.ts"
Cohesion: 0.20
Nodes (12): ChapterPage(), generateMetadata(), generateMetadata(), SubjectPage(), ChapterReader(), NOTE_LABELS, chapterHref(), chapterNeighbors() (+4 more)

### Community 111 - "types.ts"
Cohesion: 0.20
Nodes (8): ch01Coordinates, distanceSim, quadrantSim, simpleGridSim, coordinatePlaneFigure, distanceFormulaFigure, T, GeometryBoardSpec

### Community 112 - "ch-03.ts"
Cohesion: 0.12
Nodes (17): basicTissueAnatomy, meristemAnatomy, tissueTypesAnatomy, connectiveFigure, conPanels, epiPanels, epithelialFigure, meristemFigure (+9 more)

### Community 113 - "ch-05.ts"
Cohesion: 0.15
Nodes (14): distillationAnatomy, mixtureTypesSim, pureVsMixtureSim, bloodFigure, bloodPanels, chromatographyFigure, distillationFigure, mixPanels (+6 more)

### Community 114 - "ch-03.ts"
Cohesion: 0.16
Nodes (10): integerArithmeticSim, rationalAdditionSim, tallySim, constructRootFigure, numberLineFigure, rootSpiralFigure, SP, SPIRAL_O (+2 more)

### Community 115 - "ch-06.ts"
Cohesion: 0.16
Nodes (11): arcLengthWorked, circumferenceWorked, perimeterSim, archimedesFigure, athleticsTrackFigure, SE_END, SE_INNER, sectorFigure (+3 more)

### Community 116 - "cache.ts"
Cohesion: 0.24
Nodes (12): CACHE_KEYS, CacheEntry, CacheOptions, canPersist, clearCache(), getEntry(), INFLIGHT, isCached() (+4 more)

### Community 117 - "shading.ts"
Cohesion: 0.29
Nodes (12): ParticleModelSim(), rnd(), Cartoon, cartoonFor(), clamp(), hsl(), parseHex(), rgbToHsl() (+4 more)

### Community 118 - "ch-02-animal-plate.ts"
Cohesion: 0.14
Nodes (14): animalCellPlate, BODY, CENTRO, cristaePaths, LYSO, MITO, mitoPaths, NUC (+6 more)

### Community 119 - "Knovis for Schools — build specification (class 9, Exploration + Ganita Manjari)"
Cohesion: 0.15
Nodes (12): 10. Phase 6 — validation script, 11. Acceptance criteria — the build is done when all of these pass, 12. Rollback, 13. Things that will go wrong — read before you start, 1.1 The only existing files you may modify, 1. RULES — read before every task, never violate, 3. Complete file manifest, 4. Phase 0 — guardrails (do these first) (+4 more)

### Community 120 - "2. Verified codebase facts — treat as ground truth"
Cohesion: 0.18
Nodes (11): 2.10 `src/proxy.ts` — current shape, 2.1 Stack, 2.2 Next 16 route conventions (used by every existing page), 2.3 `src/lib/viz-theme.ts` — exact exports, 2.4 `src/components/AccentText.tsx` — exact exports, 2.5 `src/components/Markdown.tsx` — exact props, 2.6 Paper Mode — how it is mounted (IMPORTANT), 2.7 Existing CSS classes you may use (they exist in `globals.css`) (+3 more)

### Community 121 - "validate-cbse.mts"
Cohesion: 0.31
Nodes (9): check(), checkQuote(), __dirname, reportError(), ROOT, allChapters(), questionCount(), isReservedSlug() (+1 more)

### Community 122 - "Task 3.2 — `src/components/school/ChapterReader.tsx`"
Cohesion: 0.20
Nodes (10): 7. Phase 3 — the reader, Header and footer, Layout, Mobile (below `lg`) — interleaved, not stacked, Note card, Scroll sync, Task 3.1 — `src/app/learn/layout.tsx`, Task 3.2 — `src/components/school/ChapterReader.tsx` (+2 more)

### Community 123 - "layout.tsx"
Cohesion: 0.15
Nodes (9): fraunces, grotesk, inter, jetmono, metadata, viewport, CONNECT, EXPLORE (+1 more)

### Community 124 - "FigureSim.tsx"
Cohesion: 0.26
Nodes (10): clamp(), FigureSim(), IDENTITY, Label(), liftTransform(), PartTag(), wrapLabel(), Zoom (+2 more)

### Community 125 - "6. Phase 2 — simulation primitives"
Cohesion: 0.25
Nodes (8): 6. Phase 2 — simulation primitives, Shared rules for every sim component, Task 2.1 — dispatcher, fallback, controls, Task 2.2 — `AnatomySim.tsx` (reference implementation), Task 2.3 — `WorkedExampleSim.tsx`, Task 2.4 — `GraphPlotSim.tsx`, Task 2.5 — `ParticleModelSim.tsx`, Task 2.6 — `GeometryBoardSim.tsx`

### Community 126 - "8. Phase 4 — content authoring (the six chapters)"
Cohesion: 0.25
Nodes (8): 8.1 Source material, 8.2 Chapter file template, 8.3 Section rules, 8.3a Alignment rules — the app is a RECAP of the book, not a rival to it, 8.4 Which sim goes where (mandatory — this set is what proves the primitive library), 8.5 Question bank rules, 8.6 Order of work, 8. Phase 4 — content authoring (the six chapters)

### Community 127 - "9. Phase 5 — school-branded URLs"
Cohesion: 0.40
Nodes (5): 9. Phase 5 — school-branded URLs, Task 5.1 — `src/lib/schools/registry.ts`, Task 5.2 — `src/lib/schools/rewrite.ts`, Task 5.3 — patch `src/proxy.ts`, Task 5.4 — `src/components/school/SchoolBrandBar.tsx`

### Community 128 - "index.ts"
Cohesion: 0.08
Nodes (28): cellSizeSim, chromosomeSim, plantCellPlate, bacterialCellFigure, C, cellToDnaFigure, CHL, chloroplastFigure (+20 more)

### Community 129 - "5. Phase 1 — types and contracts"
Cohesion: 0.50
Nodes (4): 5. Phase 1 — types and contracts, Task 1.1 — `src/lib/sim/types.ts`, Task 1.2 — `src/lib/cbse/types.ts`, Task 1.3 — registries

### Community 130 - "BrainScene.tsx"
Cohesion: 0.30
Nodes (11): brainPoint(), BrainScene(), hashStr(), LinkObj, LOBES, makeCircleTexture(), makeGlowTexture(), makeLabelTexture() (+3 more)

### Community 131 - "page.tsx"
Cohesion: 0.60
Nodes (5): LoginPage(), trackGuestStarted(), enableGuestMode(), hasSeenTour(), startTour()

### Community 135 - "RichText.tsx"
Cohesion: 0.16
Nodes (10): SnapshotItem, KIND_LABEL, Question, MATH_SYMBOLS, parse(), RichText(), RULES, tidy() (+2 more)

## Knowledge Gaps
- **866 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+861 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `blog-gen.mts` to `stories.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `completeSection()` connect `stories.ts` to `blog-gen.mts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `loadEnv()` connect `blog-gen.mts` to `blog-gen.mts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _866 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Review and Scoring System` be split into smaller, more focused modules?**
  _Cohesion score 0.09513742071881606 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `AI Content Generation` be split into smaller, more focused modules?**
  _Cohesion score 0.11724137931034483 - nodes in this community are weakly interconnected._