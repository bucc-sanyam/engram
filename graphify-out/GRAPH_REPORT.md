# Graph Report - Learning  (2026-07-13)

## Corpus Check
- 54 files · ~36,992 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 384 nodes · 615 edges · 46 communities (24 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3e5cd00`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Review and Scoring System
- TypeScript Configuration
- AI Content Generation
- Navigation and Core UI
- Dashboard and Visualization
- Project Dependencies
- package.json
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
- ProgressCalendar.tsx
- RichText.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createClient()` - 14 edges
3. `Dashboard()` - 12 edges
4. `What You Must Do When Invoked` - 12 edges
5. `categoryColor()` - 11 edges
6. `getTopics()` - 10 edges
7. `createClient()` - 10 edges
8. `/graphify` - 10 edges
9. `BrainScene()` - 9 edges
10. `Topic` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --indirect_call--> `t()`  [INFERRED]
  src/app/api/plan/route.ts → src/lib/demo.ts
- `BrainPage()` --indirect_call--> `l()`  [INFERRED]
  src/app/brain/page.tsx → src/lib/demo.ts
- `POST()` --calls--> `createClient()`  [EXTRACTED]
  src/app/api/plan/route.ts → src/lib/supabase/server.ts
- `GET()` --calls--> `createClient()`  [EXTRACTED]
  src/app/auth/callback/route.ts → src/lib/supabase/server.ts
- `TopicBlogPage()` --calls--> `getTopics()`  [EXTRACTED]
  src/app/brain/[id]/page.tsx → src/lib/data.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Engram Core Logic** — src_lib_data, src_lib_gemini, src_lib_srs [EXTRACTED 0.90]
- **Graphify Core Operations** — claude_skills_graphify_references_update_incremental, claude_skills_graphify_references_query_traversal, claude_skills_graphify_references_github_and_merge_merge [EXTRACTED 0.90]
- **Graphify External Integrations** — claude_skills_graphify_references_exports_neo4j, claude_skills_graphify_references_exports_falkordb, claude_skills_graphify_references_exports_mcp [EXTRACTED 0.90]

## Communities (46 total, 22 thin omitted)

### Community 0 - "Review and Scoring System"
Cohesion: 0.09
Nodes (37): Mode, Phase, Phase, ReviewPage(), scoreLabel(), api(), demoState, getFlashcards() (+29 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 2 - "AI Content Generation"
Cohesion: 0.15
Nodes (22): fetchReadable(), POST(), GET(), POST(), applyReview(), POST(), GET(), client() (+14 more)

### Community 3 - "Navigation and Core UI"
Cohesion: 0.13
Nodes (15): ProfilePage(), BrainIcon(), FlameIcon(), LINKS, Nav(), ProgressMap(), getProfile(), getTopics() (+7 more)

### Community 4 - "Dashboard and Visualization"
Cohesion: 0.18
Nodes (10): 1. Supabase, 2. Gemini, 3. Environment, 4. Run, Architecture, Deploy to Vercel, 🧠 Engram — your second brain, Features (+2 more)

### Community 5 - "Project Dependencies"
Cohesion: 0.11
Nodes (19): @google/genai, next, dependencies, @google/genai, next, react, react-dom, @supabase/ssr (+11 more)

### Community 6 - "package.json"
Cohesion: 0.11
Nodes (18): devDependencies, @types/node, @types/react, @types/react-dom, @types/three, typescript, name, private (+10 more)

### Community 7 - "schema.sql"
Cohesion: 0.15
Nodes (22): ancestorsInclude(), NoteEditor(), NoteRow(), NotesPage(), Dashboard(), MODE_LABEL, INLINE, InlineRule (+14 more)

### Community 8 - "BrainScene.tsx"
Cohesion: 0.12
Nodes (21): sourceLabel(), TopicBlogPage(), BrainPage(), brainPoint(), BrainScene(), hashStr(), LinkObj, makeCircleTexture() (+13 more)

### Community 9 - "layout.tsx"
Cohesion: 0.25
Nodes (6): fraunces, grotesk, inter, jetmono, metadata, viewport

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
Cohesion: 0.25
Nodes (7): Conventions / gotchas, Design language, Engram — Project Summary, Key modules, Route map, Stack (fixed — do not propose alternatives), What it is

### Community 27 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 28 - "Session Log"
Cohesion: 0.22
Nodes (8): 2026-07-13 — Brain label overhaul (clickable, Space Grotesk, declutter), 2026-07-13 — Dashboard/brain polish: rich insight, clickable plan, topic blogs, smaller labels, 2026-07-13 — Fix /profile infinite loading (missing profiles row), 2026-07-13 — Personal notes feature + blog source attribution, 2026-07-13 — Plan markdown fix, progress calendar, profile page, 2026-07-13 — Vercel Migration & Nav Auth Fix, Earlier (from git history), Session Log

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

### Community 43 - "engram"
Cohesion: 0.33
Nodes (5): framework, root, rewrites, services, engram

### Community 44 - "ProgressCalendar.tsx"
Cohesion: 0.60
Nodes (4): dayClasses(), dayKey(), ProgressCalendar(), WEEKDAYS

### Community 45 - "RichText.tsx"
Cohesion: 0.60
Nodes (4): parse(), RichText(), RULES, tidy()

## Knowledge Gaps
- **154 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+149 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Topic` connect `Review and Scoring System` to `BrainScene.tsx`, `AI Content Generation`, `schema.sql`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Project Dependencies` to `package.json`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `categoryColor()` connect `BrainScene.tsx` to `Review and Scoring System`, `schema.sql`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _154 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Review and Scoring System` be split into smaller, more focused modules?**
  _Cohesion score 0.08776595744680851 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Navigation and Core UI` be split into smaller, more focused modules?**
  _Cohesion score 0.12962962962962962 - nodes in this community are weakly interconnected._