# Graph Report - Learning  (2026-07-15)

## Corpus Check
- 67 files · ~65,543 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 507 nodes · 915 edges · 43 communities (20 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ef59a52`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Review and Scoring System
- TypeScript Configuration
- AI Content Generation
- Dashboard and Visualization
- Project Dependencies
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

## God Nodes (most connected - your core abstractions)
1. `Session Log` - 19 edges
2. `createClient()` - 17 edges
3. `compilerOptions` - 16 edges
4. `isMissingRag()` - 14 edges
5. `Dashboard()` - 13 edges
6. `getTopics()` - 13 edges
7. `categoryColor()` - 13 edges
8. `POST()` - 12 edges
9. `localDayKey()` - 12 edges
10. `createClient()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `duplicateResponse()` --indirect_call--> `t()`  [INFERRED]
  src/app/api/ingest/route.ts → src/lib/demo.ts
- `TopicBlogPage()` --indirect_call--> `t()`  [INFERRED]
  src/app/blogs/[id]/page.tsx → src/lib/demo.ts
- `BrainPage()` --indirect_call--> `l()`  [INFERRED]
  src/app/brain/page.tsx → src/lib/demo.ts
- `BrainPage()` --indirect_call--> `t()`  [INFERRED]
  src/app/brain/page.tsx → src/lib/demo.ts
- `POST()` --calls--> `awardXp()`  [EXTRACTED]
  src/app/api/ingest/route.ts → src/lib/progress.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Engram Core Logic** — src_lib_data, src_lib_gemini, src_lib_srs [EXTRACTED 0.90]
- **Graphify Core Operations** — claude_skills_graphify_references_update_incremental, claude_skills_graphify_references_query_traversal, claude_skills_graphify_references_github_and_merge_merge [EXTRACTED 0.90]
- **Graphify External Integrations** — claude_skills_graphify_references_exports_neo4j, claude_skills_graphify_references_exports_falkordb, claude_skills_graphify_references_exports_mcp [EXTRACTED 0.90]

## Communities (43 total, 23 thin omitted)

### Community 0 - "Review and Scoring System"
Cohesion: 0.07
Nodes (48): Mode, Phase, Phase, ReviewRunner(), dayClasses(), dayKey(), ProgressCalendar(), WEEKDAYS (+40 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 2 - "AI Content Generation"
Cohesion: 0.10
Nodes (33): composeNarrative(), doneTopicsToday(), GET(), markDone(), POST(), answer(), BankQuestion, CHOICE_KINDS (+25 more)

### Community 4 - "Dashboard and Visualization"
Cohesion: 0.18
Nodes (10): 1. Supabase, 2. Gemini, 3. Environment, 4. Run, Architecture, Deploy to Vercel, Features, 🧠 Knovis — your second brain (+2 more)

### Community 5 - "Project Dependencies"
Cohesion: 0.05
Nodes (37): @google/genai, next, dependencies, @google/genai, next, react, react-dom, @supabase/ssr (+29 more)

### Community 7 - "schema.sql"
Cohesion: 0.10
Nodes (31): ancestorsInclude(), NoteEditor(), NoteRow(), NotesPage(), Dashboard(), MODE_LABEL, INLINE, InlineRule (+23 more)

### Community 8 - "BrainScene.tsx"
Cohesion: 0.07
Nodes (35): metadata, sourceLabel(), TopicBlogPage(), BlogsPage(), BrainPage(), ProfilePage(), brainPoint(), BrainScene() (+27 more)

### Community 9 - "layout.tsx"
Cohesion: 0.08
Nodes (29): fraunces, grotesk, inter, jetmono, metadata, viewport, LoginPage(), CONNECT (+21 more)

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
Cohesion: 0.10
Nodes (19): 2026-07-13 — AI-call minimisation redesign: question bank, batch report card, MCQs, fact of the day, 2026-07-13 — Brain label overhaul (clickable, Space Grotesk, declutter), 2026-07-13 — Dashboard/brain polish: rich insight, clickable plan, topic blogs, smaller labels, 2026-07-13 — Fix /profile infinite loading (missing profiles row), 2026-07-13 — Guest mode fix, plan done-tracking, review error card, blog pills, 2026-07-13 — Personal notes feature + blog source attribution, 2026-07-13 — Plan markdown fix, progress calendar, profile page, 2026-07-13 — Rebranding to Engramia + Mastery/XP removal + True/False Statements + Detailed completed reviews (+11 more)

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
Cohesion: 0.09
Nodes (47): assertPublicHttpUrl(), duplicateResponse(), fetchReadable(), INGEST_DAILY_LIMIT, POST(), POST(), Chunk, chunkText() (+39 more)

## Knowledge Gaps
- **189 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+184 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Topic` connect `BrainScene.tsx` to `Review and Scoring System`, `AI Content Generation`, `schema.sql`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `createClient()` connect `AI Content Generation` to `gemini.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `t()` connect `AI Content Generation` to `BrainScene.tsx`, `Review and Scoring System`, `gemini.ts`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _189 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Review and Scoring System` be split into smaller, more focused modules?**
  _Cohesion score 0.06939890710382514 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `AI Content Generation` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._