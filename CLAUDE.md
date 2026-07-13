@AGENTS.md

## Session context protocol (read this first)

Context files exist to keep token use minimal. At the start of every session:

1. Read `PROJECT_SUMMARY.md` (architecture snapshot), `SESSION_LOG.md` (recent milestones), and `TASKS.md` (active milestone) BEFORE touching any source file.
2. Do NOT scan the whole repo. Only open source files when the saved state is insufficient or contradicted by reality — and prefer a graphify query over grep even then.
3. Work one milestone at a time (see `TASKS.md`).
4. After completing any change or feature: update `PROJECT_SUMMARY.md` (if architecture/state changed), append a milestone entry to `SESSION_LOG.md`, sync `TASKS.md`, and refresh the graphify graph.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
