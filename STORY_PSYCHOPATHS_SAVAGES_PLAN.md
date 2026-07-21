# New story series: "Talking with Psychopaths and Savages" — Plan + Checklist

> Permanent tracking doc (like `DSA_HELLOINTERVIEW_CHECKLIST.md`) — not scratch, keep updated as work lands. **Status: PLAN ONLY — no code written yet, implementation starts on go-ahead.** Advisor was tried again on 2026-07-21 (4th attempt across three sessions) and is still disabled ("temporarily disabled for this conversation") — plan is self-reviewed instead, same fallback used in prior sessions (see SESSION_LOG 2026-07-19). **This self-review caught a real error the prior ones missed: read every claim below against the actual committed files instead of trusting the earlier write-up.**

## Which story-agent applies (the actual point of this section)
**2026-07-21 correction:** earlier drafts of this plan asserted that `psychiatry-story-agent.md` already had a 6th "Spot it" beat ("newly-added", "this agent file was mid-refinement on this branch"). That was never true — `git log -p` on the file shows exactly one substantive commit (`3c7d7bc`, 2026-07-20) after its creation, and it only added Coverage & Completeness / Content Depth / quiz-schema rules; the Pedagogical Framework section has always been 5 beats (concept → why it matters → insight → walk-through → thread), never 6. That claim was fabricated in an earlier self-review pass and repeated uncorrected across two sessions without anyone actually re-reading the file. Caught this time by reading the live file byte-for-byte instead of trusting the previous write-up.

That correction changed the actual decision. Compared candidates against the book's content (pp 19–224, read via `pdftotext`) and against all 26 existing agents in `prompts/story-agents/`:

| Agent | Body skeleton (as actually written in the file) | Domain guidelines | Fit |
|---|---|---|---|
| `psychiatry-story-agent.md` | concept → why it matters → the insight → clinical walk-through → thread (**5 beats, verified**) | Clinical/empirical accuracy, biopsychosocial nuance, case-based learning, safety-first trauma-informed tone | Good pedagogical base (clinical-instrument framing, case-based learning, safety clause) but has no "spot it" mechanic and no rule about real named victims/offenders — both of which this book specifically needs. |
| `sociology-anthropology-agent.md` | concept → why it matters → insight → case study → thread | Systems over individuals, cultural relativism, power/hierarchy | Wrong lens — the book studies individual pathology, not social structures. |
| `legal-story-agent.md` | provision → why it matters → insight → case-study walk-through → thread | Strict factual accuracy, legislative intent, precedent & exceptions | Fits the trial/verdict portions only, not the diagnostic core. |

**Decision (revised 2026-07-21): create a new dedicated agent, `true-crime-forensic-story-agent.md`,** rather than stretch psychiatry's agent or write session-only conventions into this plan that no installed agent actually enforces. Rationale:
- The "spot it" vignette-classification beat and the "real named victims, composite-only spot-it vignettes, no glamorizing offenders" safety rules are specific to true-crime/forensic-casework content — baking them into the general-purpose `psychiatry-story-agent.md` would leak true-crime conventions into unrelated future psychiatry content (e.g. a DSM criteria explainer has no business generating "spot it" vignettes about killers).
- A plan that promises a 6-beat structure and a safety rule set that no agent file actually contains is exactly the kind of drift this correction is meant to stop — better to make the tooling match the claim than keep asserting a claim the tooling doesn't back.
- Scanned all 26 existing agent titles (architecture, art/design, biology, business, chemistry, culinary, economics, education, fitness, geography, history, legal, linguistics, literature, marketing, math, medical, music, philosophy, physics, politics, psychiatry, science, self-help, sociology, tech) — none is scoped for true-crime/forensic-case-study nonfiction, confirming this is a genuine gap, not a near-duplicate of an existing agent.

**New agent created:** `prompts/story-agents/true-crime-forensic-story-agent.md` — psychiatry's clinical-instrument framing carried over, plus: (a) the 6-beat body (concept → why it matters → insight → walk-through (real, named case) → **spot it** (invented composite vignette, never a second real case) → thread), (b) explicit "anchor to the instrument" rule (every case section ties back to the framework's own terms — here, PCL-R traits), (c) victims-named-with-dignity / offenders-not-glamorized / original-writing-only safety rules for real-person nonfiction. This is now the agent this series uses — the rest of this plan (chapter list, quiz rules) has been updated to reference it instead of psychiatry-story-agent.

## Source
`/Users/bucc/Downloads/Talking With Psychopaths and Savages.pdf` — Christopher Berry-Dee, published by John Blake (JB), 227 pages, ~80,000 words. Nonfiction forensic-psychology/true-crime: profiles real convicted killers against Robert Hare's PCL-R checklist, drawing a line the book itself insists on between two categories:
- **Psychopath** — clinically scores high on the Hare PCL-R (charm, grandiosity, zero remorse, parasitic lifestyle).
- **Savage** — violent/manipulative but doesn't fully fit the clinical psychopathy profile (the book's own distinguishing chapter, pp 32–36).

Extracted full text via `pdftotext -layout` to `book.txt` (scratchpad) so every section is written from the actual source pages, not paraphrase-from-memory — page boundaries below were located by scanning for section headings in that text.

## Page map (verified against the PDF's own table of contents + heading scan)
| Pages | Section |
|---|---|
| 19–31 | Psychopathy (definitions, PCL-R origin) |
| 32–36 | On Savages and Savagery (the book's core taxonomy) |
| 37–47 | Professor Robert Hare PCL-R Checklist (the 20-item instrument, explained) |
| 48–56 | In the Beginning (nature/nurture, historical theories) |
| 57–59 | Aggressive Narcissism and Psychopathy |
| 60–63 | Case: Oscar Pistorius — Savage |
| 64–75 | Case: Harold Shipman — Psychopath |
| 76–85 | Case: Melanie 'Mel' Lyn McGuire — Savage |
| 86–105 | Case: Michael Bruce Ross — Psychopath |
| 106–120 | Case: Kenneth Alessio Bianchi — Savage |
| 121–131 | Case: The Shawcross Confession (Arthur Shawcross) — Psychopath |
| 132–172 | Case: John David Guise Cannan — Savage (longest, 41pp) |
| 173–199 | Case: Kenneth Allen McDuff — Psychopath |
| 200–217 | Case: John 'JR' Robinson — Savage |
| 218–220 | Tailpiece: Could You Have Spotted These? |
| 221–224 | Conclusions |

## Content-safety approach (read this before writing any section body)
This is real nonfiction about real named victims and convicted offenders — different stakes from DSA/SQL/legal-code content. Rules for every section:
1. **Clinical/forensic framing, not true-crime sensationalism.** Follow the `true-crime-forensic-story-agent.md` domain brief: clinical/forensic framing, PCL-R traits tied to observable behavior, no gratuitous violence detail. State what happened factually; don't dwell on it.
2. **Victims named with dignity**, offenders not glamorized — no admiring language about their "genius" or "charm" without immediately tying it to the clinical point being taught (that charm IS a PCL-R trait, that's the pedagogical point).
3. **Original writing only.** Summarize and analyze in Knovis's own words; never reproduce book prose verbatim (copyright) beyond the odd short attributed quote already public in the book (e.g. a killer's own quoted words), same as how DSA/SQL/SARFAESI are original essays "based on" their source.
4. **Attribution on the hub page**, same pattern as the SARFAESI footer: "Based on *Talking with Psychopaths and Savages* by Christopher Berry-Dee (John Blake) — read the source book for the full account."
5. Every case-study chapter closes by tying back to the Hare PCL-R checklist (which trait(s) it illustrates) — this is what keeps it pedagogical rather than tabloid.

## Series architecture (the generic Knovis Story Engine shape — chapter/section/questions/facts TS objects + a 3-route pattern is infrastructure shared by every series, not something borrowed stylistically from SARFAESI specifically; content voice/framework comes from `true-crime-forensic-story-agent.md` above, not from any other series' prose)
- `seriesSlug`: `psychopaths-and-savages`
- `category`: `"Psychology"` (not in `CATEGORY_COLORS` — falls back to General grey via `categoryColor()`, same as existing `"Economics"`/`"Data"`/`"Computer Science"` series categories, so no `types.ts` change needed)
- Series accent color: `#d94f5c` (muted crimson — distinct from DSA amber `#f5b95f`, SQL cyan `#22d3ee`, SARFAESI violet `#a78bfa`, Macro lime `#a3e635`), reused across every chapter per the agent template's convention
- Dir: `src/lib/psychopaths-and-savages/{types.ts, index.ts, topics/*.ts}`
- Routes: `src/app/blogs/psychopaths-and-savages/{page.tsx, [chapter]/page.tsx, [chapter]/[slug]/page.tsx}`
- Types mirror `SarfaesiChapter`/`SarfaesiSection`/`SarfaesiQuestion` exactly (rename `Psaq`/`PsSection`/`PsChapter` or similar)

### Full touch-point checklist (verified via `grep -rl sarfaesi-act src/` — this is the exhaustive list, nothing hidden elsewhere)
- [x] `prompts/story-agents/true-crime-forensic-story-agent.md` — new agent, created 2026-07-21
- [ ] `src/lib/psychopaths-and-savages/types.ts`
- [ ] `src/lib/psychopaths-and-savages/index.ts` (registry + reading-order/nav helpers, copy of sarfaesi's `index.ts` pattern)
- [ ] `src/lib/psychopaths-and-savages/topics/*.ts` (one file per chapter, 12 files — see chapter list below)
- [ ] `src/app/blogs/psychopaths-and-savages/page.tsx` (hub)
- [ ] `src/app/blogs/psychopaths-and-savages/[chapter]/page.tsx` (chapter blog)
- [ ] `src/app/blogs/psychopaths-and-savages/[chapter]/[slug]/page.tsx` (section blog)
- [ ] `src/app/blogs/page.tsx` — add to `STORY_SERIES` array
- [ ] `src/lib/story-seeds.ts` — add `psychopathsAndSavagesSeed()` + register in `SERIES` map
- [ ] `src/app/recall/page.tsx` — add to `SERIES_NAMES`/`SERIES_COLORS` (note: sarfaesi-act/macroeconomics are ALSO missing from these two maps already — pre-existing gap, not caused by this work, not fixing it here, out of scope)

## Chapter breakdown (12 chapters total)
Chapter 1 is conceptual foundation; chapters 2–11 are the ten case studies in book order (alternating Savage/Psychopath exactly as the book does); chapter 12 closes it out. Section counts are proportional to real source length, decided per the "coverage & completeness" self-check (decompose fully, split rather than cut) — exact count may flex ±1 per chapter while writing if the material demands it.

| # | Chapter | Source pp | Planned sections |
|---|---|---|---|
| 1 | Understanding the Predator Mind (foundations) | 19–59 | 5: What Is Psychopathy? · Savages vs Psychopaths · The Hare PCL-R Checklist · Where It Begins (nature/nurture) · Aggressive Narcissism |
| 2 | Oscar Pistorius — Savage | 60–63 | 2: The Relationship and the Night of the Shooting · Trial and Verdict |
| 3 | Harold Shipman — Psychopath | 64–75 | 3: The Trusted Doctor · The Killing Pattern · Caught and the Aftermath |
| 4 | Melanie 'Mel' Lyn McGuire — Savage | 76–85 | 3: The Ice Queen's Life · The Murder and Dismemberment · Trial and Motive |
| 5 | Michael Bruce Ross — Psychopath | 86–105 | 4: Early Life and First Kills · The Killing Spree · Capture and Death Row · The Manipulator's Mind |
| 6 | Kenneth Alessio Bianchi — Savage | 106–120 | 3: The Hillside Strangler Partnership · The Crimes · Caught — Confession and the "Multiple Personality" Con |
| 7 | The Shawcross Confession — Psychopath | 121–131 | 3: Arthur Shawcross's History · The Genesee River Killings · The Confession Tapes |
| 8 | John David Guise Cannan — Savage | 132–172 | 5: Early Crimes and the Pattern · The Suzy Lamplugh Case · Other Assaults · The Cold-Case DNA Breakthrough · Conviction |
| 9 | Kenneth Allen McDuff — Psychopath | 173–199 | 4: 'Big Mac' — Death Row and Release · Back on the Streets · The Second Killing Spree · Caught and Executed |
| 10 | John 'JR' Robinson — Savage | 200–217 | 3: The Con Man · The Early Internet Predator · Caught and Convicted |
| 11 | Could You Have Spotted These? (closing) | 218–224 | 2: Red Flags and Warning Signs · Conclusions — What We Learned |

Total: ~37 sections.

**Note on chapter 8 (Cannan, 41pp — biggest in the book):** if while writing it the material genuinely resists 5 sections without cramming, split into 6 rather than compress — per the agent's "never compress by cutting material, compress by adding a section/chapter" rule.

## Quiz + facts rules (per `true-crime-forensic-story-agent.md`, created 2026-07-21 — verified against the file's actual committed content, not asserted from memory)
- 3–5 questions/section, mix of `open`/`quickfire`/`mcq`/`multi`/`truefalse`
- `difficulty` exact enum `"basic"|"intermediate"|"advanced"` (never "easy"/"hard")
- `multi` uses `correct_indices` (number array), never `correct_index`
- Questions test the section's own content + relevant PCL-R traits (including the "spot it" vignette), not outside true-crime trivia
- `facts` are self-contained one-liners (no "as mentioned above"); at least one fact per section must crystallize that section's single most important takeaway (e.g. "Psychopathy is scored, not diagnosed by gut feeling: the PCL-R rates 20 traits 0-2 each, and a score of 30+ (out of 40) is the clinical threshold used in most research.")
- Wrong MCQ options should be plausible differentials (other PCL-R traits, other case details), not throwaway jokes
- **Every section's `body` ends with a "Spot it" beat before the thread** (native 6-beat structure in the new agent, not a plan-only convention): concept → why it matters → the insight → walk-through (the named case) → **spot it** (a short, new, invented composite vignette the reader must classify against the PCL-R criteria just taught) → thread. "Spot it" vignettes must be invented composites, never another real named case — keep real individuals confined to the walk-through and the chapter's own subject.

## Explicitly out of scope for this pass
- `viz:*` diagrams — DSA/SQL/Macro got these in a *later* dedicated redesign pass, not at initial content creation; skip here too, revisit as a backlog item if wanted
- Adding a `"Psychology"` entry to `CATEGORY_COLORS` in `types.ts` — not required (falls back to General grey, same as other story categories already do)
- Backfilling the pre-existing `SERIES_NAMES`/`SERIES_COLORS` gaps for sarfaesi-act/macroeconomics in `recall/page.tsx`

## Implementation checklist
- [x] Extract PDF text, map page boundaries, write this plan
- [x] Create `true-crime-forensic-story-agent.md` (2026-07-21, replaces earlier plan to reuse psychiatry-story-agent as-is)
- [ ] Scaffold `types.ts` + `index.ts` (empty topic imports at first, fill in as chapters land)
- [ ] Write Chapter 1 — foundations (pilot chapter, verify pattern before continuing)
- [ ] Wire routes + `STORY_SERIES` + `story-seeds.ts` + `recall` SERIES maps for chapter 1 only, verify `tsc`/`build` clean, browser-check the hub + chapter 1 + one section
- [ ] Write Chapters 2–11 (case studies), one at a time, each followed by a `tsc --noEmit` check
- [ ] Write Chapter 12 (closing)
- [ ] Full `npm run build` + browser walk of hub → ch1 → last chapter → back-to-hub link
- [ ] Update `PROJECT_SUMMARY.md` route map + key modules, append `SESSION_LOG.md` milestone, sync `TASKS.md`
- [ ] `graphify update .`
