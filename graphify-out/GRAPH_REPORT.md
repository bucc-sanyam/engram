# Graph Report - .  (2026-07-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 245 nodes · 396 edges · 25 communities (14 shown, 11 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.73)
- Token cost: 709 input · 58 output

## Graph Freshness
- Built from commit: `24d2c32e`
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createClient()` - 10 edges
3. `createClient()` - 10 edges
4. `api()` - 8 edges
5. `BrainScene()` - 8 edges
6. `Dashboard()` - 7 edges
7. `categoryColor()` - 7 edges
8. `Topic` - 7 edges
9. `include` - 7 edges
10. `applyReview()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `BrainPage()` --indirect_call--> `l()`  [INFERRED]
  src/app/brain/page.tsx → src/lib/demo.ts
- `BrainPage()` --indirect_call--> `t()`  [INFERRED]
  src/app/brain/page.tsx → src/lib/demo.ts
- `Graphify Skill` --references--> `Graphify Skill Definition`  [EXTRACTED]
  CLAUDE.md → .claude/skills/graphify/SKILL.md
- `GET()` --indirect_call--> `t()`  [INFERRED]
  src/app/api/plan/route.ts → src/lib/demo.ts
- `GET()` --calls--> `writePlanNarrative()`  [EXTRACTED]
  src/app/api/plan/route.ts → src/lib/gemini.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Engram Core Logic** — src_lib_data, src_lib_gemini, src_lib_srs [EXTRACTED 0.90]
- **Graphify Core Operations** — claude_skills_graphify_references_update_incremental, claude_skills_graphify_references_query_traversal, claude_skills_graphify_references_github_and_merge_merge [EXTRACTED 0.90]
- **Graphify External Integrations** — claude_skills_graphify_references_exports_neo4j, claude_skills_graphify_references_exports_falkordb, claude_skills_graphify_references_exports_mcp [EXTRACTED 0.90]

## Communities (25 total, 11 thin omitted)

### Community 0 - "Review and Scoring System"
Cohesion: 0.10
Nodes (36): GET(), Phase, ReviewPage(), scoreLabel(), api(), demoState, getFlashcards(), getPlan() (+28 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 2 - "AI Content Generation"
Cohesion: 0.17
Nodes (20): fetchReadable(), POST(), POST(), applyReview(), POST(), GET(), client(), extractKnowledge() (+12 more)

### Community 3 - "Navigation and Core UI"
Cohesion: 0.09
Nodes (11): Mode, Phase, BrainIcon(), FlameIcon(), LINKS, ProgressMap(), IngestResult, ingestText() (+3 more)

### Community 4 - "Dashboard and Visualization"
Cohesion: 0.15
Nodes (14): BrainPage(), Dashboard(), MODE_LABEL, getEntries(), getLinks(), getProfile(), getReviews(), getTopic() (+6 more)

### Community 5 - "Project Dependencies"
Cohesion: 0.11
Nodes (19): @google/genai, next, dependencies, @google/genai, next, react, react-dom, @supabase/ssr (+11 more)

### Community 6 - "package.json"
Cohesion: 0.11
Nodes (18): devDependencies, @types/node, @types/react, @types/react-dom, @types/three, typescript, name, private (+10 more)

### Community 7 - "schema.sql"
Cohesion: 0.18
Nodes (11): Engram Project, on_auth_user_created, public.daily_plans, public.entries, public.entry_topics, public.flashcards, public.handle_new_user(), public.profiles (+3 more)

### Community 8 - "BrainScene.tsx"
Cohesion: 0.33
Nodes (9): brainPoint(), BrainScene(), hashStr(), LinkObj, makeCircleTexture(), makeGlowTexture(), makeLabelTexture(), mulberry32() (+1 more)

### Community 9 - "layout.tsx"
Cohesion: 0.29
Nodes (5): grotesk, inter, jetmono, metadata, viewport

### Community 10 - "Engram Web Service"
Cohesion: 0.50
Nodes (4): Engram Web Service, GEMINI_API_KEY, Node.js Runtime, NEXT_PUBLIC_SUPABASE_URL

### Community 11 - "proxy.ts"
Cohesion: 0.67
Nodes (3): config, proxy(), PUBLIC_PATHS

### Community 12 - "Extraction Rules"
Cohesion: 0.67
Nodes (3): Graphify Skill, Extraction Rules, Graph Traversal

### Community 13 - "Incremental Update"
Cohesion: 0.67
Nodes (3): Graphify Ingest, Whisper Transcription, Incremental Update

## Knowledge Gaps
- **86 isolated node(s):** `nextConfig`, `config`, `Phase`, `Mode`, `inter` (+81 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Project Dependencies` to `package.json`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Topic` connect `Review and Scoring System` to `AI Content Generation`, `Dashboard and Visualization`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `BrainScene()` connect `BrainScene.tsx` to `Dashboard and Visualization`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `nextConfig`, `config`, `Phase` to the rest of the system?**
  _86 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Review and Scoring System` be split into smaller, more focused modules?**
  _Cohesion score 0.10359408033826638 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Navigation and Core UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08923076923076922 - nodes in this community are weakly interconnected._