# Knovis for Schools — technical implementation plan

> Status: **PLAN ONLY — nothing built yet.** Approve or amend before implementation begins.
> Companions: `SCHOOL_GTM.md` (market/GTM), `SCHOOL_IMPLEMENTATION_BRIEF.md` (costs, syllabus, architecture decisions).
> Target: CBSE class 9, **Exploration** (Science, 11 ch) + **Ganita Manjari** (Maths, 15 ch), pilot-ready for Oct–Dec 2026.

---

## 0. Read this first — the one scoping decision

Hand-authoring 26 chapters means: ~156 theory sections, ~156 interactive diagrams, and ~1,300 questions. Honest estimate is **40–65 working days for the content alone**, on top of **27–41 days** for the platform. Both cannot happen in August.

The critical path is also strictly ordered: **you cannot author content until the simulation primitives and the reader exist**, because there is nothing for the content to render into.

**Recommendation: August ships a demoable product with 6 lighthouse chapters, not 26.**

| | August (weeks 1–4) | Sept–Nov |
|---|---|---|
| Platform | Phases A, B(core), D — tenancy, 5 sim primitives, 3-pane reader | Phases E, F — dashboards, consent, exports |
| Content | **6 lighthouse chapters** (3 Science, 3 Maths) | Remaining 20 chapters |

Six chapters is enough to demo to a principal, run a real pilot in one unit, and — critically — **validate the authoring format before you spend 50 days writing against it.** Authoring 26 chapters against an unvalidated format is the single most expensive mistake available here.

Everything below assumes this scoping. If you want all 26 by 31 August, the honest answer is that it displaces the platform work and you'd have content with nothing to render it.

---

## 1. Scope

### In scope
1. School tenancy + branded URLs (`/[school]/class-9/...`)
2. Hand-authored class-9 content system (no Gemini in the content path)
3. **Interactive simulation primitive library** — the major new engineering
4. 3-pane student reader (theory · interactive · note)
5. Teacher (section) dashboard + Principal (school) dashboard
6. Roster/join codes + DPDP consent gate

### Explicitly not in scope
- Social Science / ICT content — **books not published yet** (expected Jul–Aug 2026)
- English (Kaveri) — September at the earliest
- Class 10 — next academic year
- Changes to `/blogs/[id]` (user-ingested topics), `/brain`, `/notes`, `/add`, `/recall` core loop
- The DSA / SQL / Macro / Communication series — untouched, keep their existing single-column reader
- Parent-facing app, ERP integrations, offline mode, native apps

### Honest note on "create the content on our own"
Authoring in-repo as typed TypeScript instead of calling the Gemini API buys you: determinism, version control, code review, compile-time validation, zero runtime AI cost, and zero AI-content DPDP surface. It does **not** by itself buy accuracy — content I draft still needs subject-expert verification before a student sees it. The ₹30–60k reviewer budget in `SCHOOL_IMPLEMENTATION_BRIEF.md` §2 stands.

---

## 2. URL and tenancy architecture

### 2.1 Route scheme

```
CANONICAL (SSG, public, indexed)
  /learn/class-9/science/ch-01                    chapter reader
  /learn/class-9/science/ch-01/[section]          deep link to a section
  /learn/class-9/maths/ch-04
  /learn/class-9                                  grade hub

SCHOOL-FACING (rewritten to canonical, noindex)
  /dps-rk-puram/class-9/science/ch-01
  /dps-rk-puram/class-9                           branded grade hub
  /dps-rk-puram                                   branded school landing
```

One canonical content tree, built once. `src/proxy.ts` rewrites `/[school]/...` → `/learn/...` and sets a school-context cookie/header; branding is applied at render time from the `schools` row. **Zero marginal build cost per school** — 1 school or 200, the same 200 pages are generated.

### 2.2 The reserved-slug guard — mandatory

A bare root-level `/[school]` segment will shadow every future top-level route. This must exist before the route does:

```ts
// src/lib/schools/reserved.ts
export const RESERVED_SLUGS = new Set([
  "learn", "blogs", "brain", "add", "recall", "review", "notes",
  "about", "profile", "login", "auth", "api", "s", "admin",
  "privacy", "terms", "pricing", "schools", "_next", "favicon.ico",
]);
```

`proxy.ts` checks `RESERVED_SLUGS` first and only then attempts a school lookup. **A CI test must assert that every top-level directory under `src/app/` appears in `RESERVED_SLUGS`** — otherwise adding a route six months from now silently breaks whenever a school registers that slug. This is the maintenance tax of the pretty URL; it is payable but it must be automated.

Slug rules: lowercase, `[a-z0-9-]`, 3–40 chars, immutable once issued, never reused after a school leaves.

### 2.3 Branding

Co-branding, not white-label (rationale in `SCHOOL_IMPLEMENTATION_BRIEF.md` §1):

```ts
// schools.brand jsonb
{
  displayName: "Delhi Public School, R.K. Puram",
  shortName: "DPS RK Puram",
  crestUrl: "/school-crests/dps-rk-puram.svg",   // Supabase storage
  accent: "#1e6f5c",                             // validated hex, contrast-checked
  wordmarkLine: "Knovis for DPS RK Puram"
}
```

Applied via a `SchoolBrandProvider` (mirrors the existing `ReadingThemeContext` pattern) that sets CSS custom properties. `accent` must pass a contrast check against both the dark theme and Paper Mode at build/insert time — reuse `darkenForPaper()` from `src/lib/viz-theme.ts`.

### 2.4 Later, without rework
`dps.knovis.app` becomes a second rewrite source pointing at the same canonical tree. Vercel Pro supports wildcard domains. No content changes. Build it when a school asks.

---

## 3. Content system

### 3.1 Follow the `src/lib/dsa/` pattern exactly

That pattern already carried 18 chapters + 150 question blogs through SSG with zero AI and zero DB. Reuse it wholesale.

```
src/lib/cbse/
  types.ts                    Chapter, Section, SimSpec, Question types
  class9/
    index.ts                  CLASS9_SUBJECTS registry + nav helpers
    science/
      index.ts                ordered SCIENCE_CHAPTERS
      chapters/
        ch-01-matter.ts
        ch-02-is-matter-pure.ts
        ... (11 files)
    maths/
      index.ts
      chapters/
        ch-01-number-systems.ts
        ... (15 files)
```

Nav helpers mirroring `dsaReadingOrder` / `dsaNeighbors` / `dsaProblemNumber`: `chapterOrder()`, `chapterNeighbors()`, `sectionNeighbors()`.

### 3.2 Content shape

```ts
export type Chapter = {
  key: string;                  // "ch-04-cell"
  number: number;
  title: string;
  book: "exploration" | "ganita-manjari";
  subject: "science" | "maths";
  ncertChapter: number;
  estMinutes: number;
  accent: string;
  summary: string;              // hub card + SEO description
  sections: Section[];
  questions: Question[];        // ~50, the SM-2 bank
};

export type Section = {
  key: string;
  title: string;
  eyebrow?: string;             // accent micro-label, matches existing house style
  body: string;                 // markdown → Markdown.tsx (LEFT PANE)
  sim?: SimSpec;                // typed object, NOT a fence (RIGHT TOP)
  note?: SectionNote;           // (RIGHT BOTTOM)
};

export type SectionNote = {
  kind: "fact" | "remember" | "watch-out" | "exam-tip";
  title?: string;
  body: string;                 // short markdown, ≤ ~60 words
};
```

### 3.3 One deliberate departure from the `viz:` pattern

The existing static diagrams are markdown fences (` ```viz:tree `) validated at build by `scripts/validate-viz.mts` and `strictViz`. **Simulations should instead be typed TypeScript objects on the `Section`, not fences.**

Why: since the content is hand-authored TS anyway, a discriminated union gives you **compile-time validation for free**. A malformed sim spec becomes a `tsc` error at author time rather than a runtime parse failure caught by a separate script. Strictly better, and it removes a whole validation layer.

The existing `viz:*` fences stay supported inside `Section.body` for static inline diagrams — the two systems coexist, same as `Markdown.tsx` already handles.

### 3.4 Question bank

~50 per chapter, reusing the existing `QuestionKind` union (`open | quickfire | mcq | truefalse | multi`) so `/api/quiz`, `ReportCardView`, and `srs.ts` work unchanged.

Weighting matters economically — choice kinds grade deterministically at **₹0**:

| Kind | Per chapter | Grading |
|---|---|---|
| mcq | 20 | deterministic |
| truefalse | 10 | deterministic |
| multi | 8 | deterministic, partial credit |
| quickfire | 6 | heuristic |
| open | 6 | AI, weekly only |

Authored as plain TS arrays on `Chapter.questions`, seeded into the `questions` table by an idempotent script (mirroring the DSA chapter files that already carry hardcoded `questions` arrays).

**Open question for you (§12.1): do you want to hand-write all 1,300 questions, or hand-write theory + sims and draft questions from the authored text for review?** The second is ~40 days cheaper and the review burden is identical.

---

## 4. The interactive simulation library

This is the largest new piece of engineering and the thing that differentiates the product in a demo.

### 4.1 Design constraint

Bespoke React components per diagram does not scale to 156 diagrams. The answer is **~10 parameterised primitives driven by typed specs**, covering the recurring interaction grammar of class-9 Science and Maths, plus an escape hatch for genuinely one-off diagrams.

Your four examples describe the *interaction grammar* you want, and it generalises cleanly:

| Your example | Generalises to |
|---|---|
| (a) convex/concave lens, drag to change focus | **parameter → live geometric recomputation** |
| (b) beakers, acid/neutral/base react differently | **choose inputs → observe outcome** |
| (c) maths formula working with an example | **change the inputs → the worked steps recompute** |
| (d) plant cell, click a part → it raises and explains | **explore a labelled structure part-by-part** |

> **Syllabus note, worth knowing before we build:** lenses/dispersion and acids/bases are **class 10** topics, not class 9. Your examples are perfect illustrations of the *style* you want, but the primitive set below is scoped to what is actually in Exploration and Ganita Manjari. `sim:ray-optics` and `sim:reaction-bench` are still on the list — they are your best demo pieces and they unlock class 10 next year — but they are P2, not P0.

### 4.2 The primitive set

| Primitive | Interaction | Class-9 coverage | Priority |
|---|---|---|---|
| **`anatomy`** | click/tap a part → it lifts, highlights, explains | Cell, Tissues (plant + animal), neuron, stomata | **P0** — highest reuse in Science |
| **`worked-example`** | editable inputs → derivation recomputes step by step | Nearly every Maths chapter | **P0** — highest reuse in Maths |
| **`graph-plot`** | drag parameters → curve/line updates live | Linear equations, coordinate geometry, motion graphs, statistics | **P0** |
| **`particle-model`** | temperature/pressure sliders → particle behaviour, state change | Matter in Our Surroundings, Is Matter Around Us Pure | **P0** |
| **`geometry-board`** | drag vertices → live angle/length/area readouts | Lines & Angles, Triangles, Quadrilaterals, Circles, Heron's | **P0** — 5 of 15 Maths chapters |
| **`motion-track`** | velocity/acceleration controls → animated motion + live readout | Motion, Force & Laws of Motion | P1 |
| **`wave`** | amplitude/frequency sliders → waveform, optional audible tone (Web Audio) | Sound | P1 |
| **`balance`** | drag/select to balance an equation | Atoms & Molecules, algebra | P1 |
| **`sorter`** | drag items into categories, validates | Classification, mixtures vs compounds | P1 |
| **`ray-optics`** | drag object/lens, focal-length slider → live ray tracing | *class 10* | P2 — demo piece |
| **`reaction-bench`** | pick reagent + sample → observe result | *class 10* | P2 — demo piece |

**P0 = 5 primitives.** Those five unblock content authoring for both subjects. Build those in August; P1 as content demands them.

### 4.3 Spec contract

```ts
// src/lib/sim/types.ts
export type SimSpec =
  | AnatomySpec | WorkedExampleSpec | GraphPlotSpec
  | ParticleModelSpec | GeometryBoardSpec
  | MotionTrackSpec | WaveSpec | BalanceSpec | SorterSpec
  | RayOpticsSpec | ReactionBenchSpec;

export type AnatomySpec = {
  kind: "anatomy";
  title: string;
  viewBox: [number, number];
  parts: {
    id: string;
    label: string;
    path: string;              // SVG path data
    liftBy?: [number, number]; // offset applied on select — the "raises" behaviour
    blurb: string;             // ≤ 40 words, shown on select
    accentRole?: "primary" | "muted";
  }[];
  defaultPartId?: string;
  altText: string;             // REQUIRED — a11y + print + IA export fallback
};

export type WorkedExampleSpec = {
  kind: "worked-example";
  title: string;
  inputs: { id: string; label: string; min: number; max: number;
            step: number; default: number; unit?: string }[];
  steps: {
    explain: string;                          // may contain $…$ inline math
    compute: (vals: Record<string, number>) => string;   // pure, deterministic
  }[];
  result: (vals: Record<string, number>) => string;
  altText: string;
};
```

Every spec carries a **required `altText`**. It is not optional politeness: it is the screen-reader path, the `prefers-reduced-motion` fallback, the print view, and the text that goes into an IA export. Enforce it in the type.

### 4.4 Implementation rules

- **SVG + React state** for everything except `particle-model` (Canvas 2D) and `wave` (Canvas 2D + Web Audio).
- **No three.js. No new dependencies.** Matches the repo's dependency-free ethos (`Markdown.tsx`, `chunk.ts`, the `viz` primitives are all zero-dep) and the target device is a ₹8,000 Android, not a MacBook.
- **Paper Mode**: every sim consumes `useVizPalette()` / `darkenForPaper()` from `src/lib/viz-theme.ts`. This is already the established fix for bright accents on the cream page — do not add more `!important` CSS.
- **Reduced motion**: `prefers-reduced-motion: reduce` → animations become static end-states, sliders still work.
- **Keyboard**: every interactive element reachable and operable by keyboard. `anatomy` parts are `<button>`s, not `<path onClick>`.
- **Performance budget**: ≤16 ms/frame on a mid-range Android; sims below the fold lazy-mount via `IntersectionObserver`; `content-visibility: auto` on section wrappers.
- **Overflow**: reuse the legibility-floor pattern from the 2026-07-27 fix — `minWidth: naturalW * 0.72` inside `overflow-x-auto`, shrink-then-scroll, never squash.
- **Deterministic**: `compute` functions must be pure. No `Math.random()`, no `Date.now()` — sims must render identically in SSG and on the client (hydration) and in a screenshot for a report.

### 4.5 Directory

```
src/components/sim/
  SimBlock.tsx            dispatcher on spec.kind
  AnatomySim.tsx
  WorkedExampleSim.tsx
  GraphPlotSim.tsx
  ParticleModelSim.tsx
  GeometryBoardSim.tsx
  ...
  controls/               shared Slider, Stepper, PartButton, ReadoutChip
  SimFallback.tsx         renders altText — reduced-motion / no-JS / print
```

---

## 5. The 3-pane reader

### 5.1 Layout

```
┌─────────────────────────────┬──────────────────────────┐
│                             │  INTERACTIVE (sticky)    │
│  THEORY                     │  sim for the section     │
│  markdown, serif            │  currently in view       │
│  .article-body / Fraunces   ├──────────────────────────┤
│  scrolls                    │  NOTE                    │
│                             │  fact / remember /       │
│  section 1 … section n      │  watch-out / exam-tip    │
└─────────────────────────────┴──────────────────────────┘
        ~58%                            ~42%
```

**The right rail is sticky and swaps content as you scroll.** An `IntersectionObserver` tracks which left-pane section is in view and drives both right panes. This is the scrollytelling pattern good explainers use, and it is what makes the layout feel designed rather than merely divided.

Transition between sims: short cross-fade (~180 ms), respecting reduced-motion. No layout shift — the rail reserves a fixed min-height.

### 5.2 Responsive

Below `lg`, collapse to a single column, **interleaved per section** (not three stacked blocks):

```
[ theory §1 ] → [ sim §1 ] → [ note §1 ] → [ theory §2 ] → …
```

Stacking all theory, then all sims, would divorce each diagram from the paragraph it illustrates. Per-section interleaving is the only correct mobile reading order.

### 5.3 Reuse

- Left pane: `Markdown.tsx` inside `.article-body` — inline math, `viz:*` fences, and link-scheme validation all work unchanged.
- Section parsing: extend the existing `parseBodySections()` idea from `blogs/[id]/page.tsx`, but simpler — sections are already structured data here, no parsing needed.
- Accents: `AccentText` / `DifficultyPill` / `AccentPill` from `src/components/AccentText.tsx` for eyebrows and pills, so Paper Mode legibility is handled the established way.
- Paper Mode: works via the existing `ReadingThemeProvider` + `PaperModeToggle`. New routes must be added to the reading-route list.

### 5.4 Route

```
src/app/learn/class-9/[subject]/[chapter]/page.tsx      SSG
src/app/learn/class-9/[subject]/page.tsx                subject hub
src/app/learn/class-9/page.tsx                          grade hub
```

`generateStaticParams` from the chapter registry. Fully static, zero DB, zero AI — same as the DSA routes.

### 5.5 Not touching `/blogs/[id]`

The existing user-ingested topic blog keeps its current single-column reader. Its content has no authored sims, so the 3-pane layout has nothing to put in the rail. Backporting is a later, separate decision.

---

## 6. Teacher and school dashboards

### 6.1 Two levels

| | Teacher | Principal / Coordinator |
|---|---|---|
| Route | `/[school]/teach/[section]` | `/[school]/admin` |
| Scope | one section, their subject(s) | all sections, all subjects |
| Answers | "who in my class is lost, and on what" | "is this working, and where is it not" |

### 6.2 Teacher dashboard — panels

| Panel | Content |
|---|---|
| **Retention curve** | Class avg: first-attempt vs 2-week vs 6-week recall on the same questions. *The metric only a spaced-repetition system can produce.* |
| **Chapter × student heatmap** | Latest recall score per cell, colour-graded; click a cell → that student's answers |
| **At-risk list** | Students <3/5 on ≥3 chapters, ranked weakest-first |
| **Item analysis** | Questions the *class* failed — "34 of 42 missed Q7". The panel that makes teachers open the tool unprompted. |
| **Assign** | Mark "taught ch-04 §2 today" → auto-assigns recall to the section, due tonight |
| **IA export** | Periodic + Multiple Assessment marks, CBSE format, one click, CSV + PDF |
| **ASL evidence** | Weekly viva transcripts + rubric scores; **teacher awards the marks** |

### 6.3 School dashboard — panels

| Panel | Content |
|---|---|
| **School scorecard** | Active students, sessions/week, avg recall score, trend vs last month |
| **Section comparison** | Every section ranked by retention delta — surfaces both strong teaching and struggling sections |
| **Subject comparison** | Science vs Maths retention across the grade |
| **Coverage** | Which chapters have been taught/assigned per section — a syllabus-pacing view principals currently maintain by hand |
| **Adoption** | Teacher activity: who is assigning, who is not. *Show this to the principal, not the teachers.* |
| **IA readiness** | % of students with complete IA records per subject — the compliance view |

### 6.4 Data access — do not express this in RLS

Reading 40 students' `quiz_sessions` row-by-row through a policy is slow and awkward. Use `security definer` RPCs that check the caller's role **once**, then aggregate server-side:

```sql
get_section_report(p_section_id uuid, p_from date, p_to date)
get_school_report(p_school_id uuid, p_from date, p_to date)
get_item_analysis(p_section_id uuid, p_chapter_key text)
export_internal_assessment(p_section_id uuid, p_subject text, p_term text)
```

**Nightly rollup** via `pg_cron` into `section_daily_stats` so dashboards read pre-aggregated rows rather than scanning `quiz_answers`. At 2,000 students live aggregation would work; at 20,000 it would not, and adding the rollup later means rewriting every panel. Build it now — it is ~half a day.

---

## 7. Data model

```sql
-- Tenancy
schools(id, slug unique, name, board, city, brand jsonb, active, created_at)
sections(id, school_id, grade, name, academic_year, unique(school_id,grade,name,academic_year))
memberships(id, user_id, school_id, section_id, role, created_at,
            unique(user_id, section_id))          -- role: student|teacher|coordinator|admin
section_subjects(section_id, subject, teacher_user_id)

-- Onboarding + compliance
join_codes(id, section_id, code unique, expires_at, max_uses, uses, created_by)
consents(id, student_user_id, guardian_name, guardian_contact, method,
         granted_at, revoked_at, evidence jsonb)

-- Teaching loop
assignments(id, section_id, subject, chapter_key, section_key, assigned_by, due_at)
assignment_targets(assignment_id, student_user_id, status)

-- Reporting
section_daily_stats(section_id, day, subject, students_active, sessions,
                    avg_score, first_attempt_avg, delayed_avg, primary key(section_id,day,subject))
```

### RLS helpers (`security definer`, to avoid recursive policy evaluation)

```sql
auth_section_ids()                    -- sections the caller belongs to
auth_teaches_section(uuid) → bool
auth_school_role(uuid) → text
```

Every policy calls these functions rather than subquerying `memberships` — a policy on `memberships` that itself queries `memberships` will error or loop. Index `memberships(user_id)` and `memberships(section_id)`; mark helpers `stable`.

### ⚠️ Security posture change

`PROJECT_SUMMARY.md` currently states "RLS is the only thing isolating users." **That stops being true the moment teachers exist.** Isolation becomes RLS *plus* a correct membership graph, and a bug in `memberships` is a data breach involving minors.

This warrants **the repo's first test suite** — a Postgres-level policy test asserting: a student sees only their own rows; a teacher sees only their sections; a teacher in school A sees nothing in school B; a revoked membership loses access immediately. Non-negotiable before any real student data enters the system.

---

## 8. Build, validation, CI

| Gate | Mechanism |
|---|---|
| Sim specs valid | **`tsc`** — discriminated union, compile-time (§3.3) |
| `viz:*` fences valid | existing `scripts/validate-viz.mts`, extended to `src/lib/cbse/**` |
| Every chapter renders | `npm run build` — SSG, a broken chapter fails the build |
| Reserved slugs complete | new test: every dir in `src/app/` ∈ `RESERVED_SLUGS` |
| RLS correct | new Postgres policy test suite (§7) |
| Content reviewed | `CBSE_CONTENT_CHECKLIST.md`, mirroring `DSA_HELLOINTERVIEW_CHECKLIST.md` — **no chapter goes live until a subject-competent human has signed off every question in it** |
| a11y | every `SimSpec.altText` non-empty (type-enforced); keyboard path manually verified per primitive |

---

## 9. Phasing, effort, and gates

| Phase | Work | Est. days | Gate |
|---|---|---|---|
| **A** | Tenancy: schema, RLS + helpers, policy tests, `proxy.ts` rewrite, reserved-slug guard, join codes, `SchoolBrandProvider` | 5–8 | Two schools, two sections, correct isolation proven by tests |
| **B** | 5 × P0 sim primitives + `SimBlock` + controls + fallback | 6–9 | Each primitive renders in dark + Paper Mode, keyboard-operable, <16ms/frame on a throttled device |
| **C** | Content registry, types, chapter scaffolding, seeding script | 2–3 | One chapter renders end-to-end |
| **D** | 3-pane reader, scroll-sync, mobile interleave, Paper Mode | 4–6 | Lighthouse chapter reads well on a phone and a laptop |
| **C′** | **6 lighthouse chapters** (3 Science, 3 Maths) | 9–15 | Reviewed, signed off, in the checklist |
| **E** | Teacher + school dashboards, rollup job, IA export | 6–9 | A real teacher completes "find who's lost on ch-04" unaided |
| **F** | Consent flow, DPDP retention/deletion, roster import, hardening | 4–6 | Consent captured before any teacher can see an answer |
| **C″** | Remaining 20 chapters | 30–50 | Sept–Nov, in parallel with pilot |

**August realistic scope: A + B + C + D + C′** ≈ 26–41 days of focused work. That is tight for four weeks and assumes content authoring runs in parallel with platform work only in the last stretch.

**Critical path:** A → B(P0) → C → D → C′. Nothing about content can start before B.

---

## 10. Risks

| # | Risk | Mitigation |
|---|---|---|
| 1 | **Sim primitives balloon** — every chapter wants "just one more" bespoke diagram | Hard rule: content bends to the primitive set; a new primitive needs ≥3 chapters of demand. Escape hatch stays closed in v1. |
| 2 | **26 chapters is 40–65 days** and August is 31 | The §0 rescope. 6 lighthouse chapters, bulk after. |
| 3 | **Content accuracy** — one wrong Science answer costs the school | Human review gate, checklist-tracked, budgeted (₹30–60k) |
| 4 | **Reserved-slug shadowing** breaks a route months later | Automated CI test, not a code comment |
| 5 | **RLS bug exposes minors' data** | Policy test suite before any real student data |
| 6 | **Sims too heavy for ₹8k Androids** | SVG-first, no three.js, no new deps, lazy-mount, measured on a throttled device — not assumed |
| 7 | **Paper Mode regression** — new components re-introduce the `!important` cascade | All sims consume `viz-theme.ts`; PR review checks this specifically |
| 8 | **SST/ICT books slip past August** | Already out of scope; do not plan around them |

---

## 11. What I would build first, in order

1. `RESERVED_SLUGS` + `proxy.ts` rewrite + `schools`/`sections`/`memberships` + policy tests **(nothing else works without correct isolation)**
2. `AnatomySim` — your plant-cell example, on the real Cell chapter. It is the best demo, the highest-reuse Science primitive, and the fastest way to validate the whole spec contract.
3. The 3-pane reader around that one section.
4. Then the remaining P0 primitives, then bulk content.

Point 2 is deliberate: **build one complete vertical slice — one section, one sim, one note, rendering in the real reader — before building breadth.** If the 3-pane format doesn't feel right, you want to discover that in week 1, not after 20 chapters.

---

## 12. Open decisions before implementation

1. **Question bank authoring.** Hand-write all ~1,300, or hand-write theory + sims and draft questions from the authored text for expert review? The second is ~40 days cheaper with identical review burden. *(My recommendation: draft-then-review.)*
2. **Which 6 lighthouse chapters?** Suggest Science: Matter in Our Surroundings, The Cell, Tissues (covers `particle-model` + `anatomy` ×2). Maths: Number Systems, Linear Equations in Two Variables, Triangles (covers `worked-example`, `graph-plot`, `geometry-board`). That set exercises all 5 P0 primitives.
3. **Bare `/[school]` or prefixed `/s/[school]`?** Bare is prettier and is what you asked for; it needs the reserved-slug guard forever. Prefixed is safer and uglier. *(My recommendation: bare, with the CI-enforced guard.)*
4. **Do the NCERT PDFs for Exploration and Ganita Manjari exist on ncert.nic.in right now?** The whole content plan assumes yes — worth confirming before 1 August.
5. **Science reviewer** — named by ~7 August, or August drops to Maths only.
