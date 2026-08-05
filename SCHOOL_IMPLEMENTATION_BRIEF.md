# Knovis for Schools — implementation brief & cost model

> Research date: **2026-07-31**. Prepared for a go/no-go call on the four decisions below. **No code or existing files were changed.**
> Companion to `SCHOOL_GTM.md` (market, positioning, GTM). This document covers: (1) URL + white-label architecture, (2) the class-9 content plan, (3) the teacher dashboard, (4) full cost model and pricing.
> FX used throughout: **₹95 / USD** (spot 95.55 on 2026-07-31).

---

## 0. Four headline findings

**1. The class-9 syllabus was replaced this year, and two of the books do not exist yet.**
NCERT has overhauled class 9 under NCF-SE 2023 — new titles, new structure: **Ganita Manjari** (Maths, 12→**15** chapters), **Exploration** (Science, now a *single* integrated PCB volume, 12→**11** chapters), **Kaveri** (English, replaces Beehive + Moments), **Ganga** (Hindi), **Sharda** (Sanskrit), and **Understanding Society: India & Beyond Parts 1–2** (Social Science). Books were due 10–15 April 2026, slipped after review by ~4,000 experts, and **Social Science and ICT are still under final review with release expected July–August 2026**.
→ "All class 9 subjects by end of August" is not achievable, and not because of effort. Two books aren't published. See §2.

**2. That same fact is the best strategic news in this document.**
Every incumbent — Extramarks, Vedantu, PW, Educart, Oswaal — has a class-9 library built on the *old* syllabus and must now redo all of it. You have no legacy content to migrate. For the Oct–Dec 2026 selling window, **"built on the new NCF-SE books, not retrofitted"** is a sharp, checkable differentiator, and it expires once everyone catches up. This is a roughly 12-month window.

**3. Your AI costs are far lower than you think — and the voice interviewer is the only line item that matters.**
Content generation for all 26 Maths + Science chapters costs **under ₹2,000 in API calls**. Daily recall costs **₹0** (deterministic grading of choice questions). Written grading is **₹12/student/year**. The voice interviewer ranges from **₹6 to ₹372 per student per year** depending on which of three architectures you pick — a 60× spread, and the single largest engineering-economics decision in the product. See §5.4.

**4. A free pilot is cheap. The content is the investment.**
Running a 100-student pilot for one term costs roughly **₹10,500** in marginal infra + AI. Building the content costs roughly **₹1.6 lakh**, mostly in human review, not compute. Budget accordingly: you are not funding a pilot, you are funding a content library that every future school reuses at zero marginal cost.

---

## 1. Decision #1 — URL structure and per-school branding

### Your proposal
`/schoolname/standard/...` holding the static blocks for that standard, with the school name also driving how Knovis is branded for that school.

### Verdict: right instinct, wrong axis. Do it as a rewrite layer, not as a content tree.

The instinct is genuinely valuable — a principal seeing `knovis.app/dps-rkpuram/class-9` with their crest on it is a real sales asset, and it makes a pilot feel bespoke rather than borrowed. Keep that. But making the school a segment of the *content path* has three problems:

**Problem 1 — build cost scales with schools, for identical content.**
If content lives under `/[school]/[standard]/...`, Next statically generates the same pages once per school. Your current build already produces 412 pages. Add ~200 class-9 content pages and the maths is:

| Schools | Content pages built | Build behaviour |
|---|---|---|
| 1 | ~200 | fine |
| 10 | ~2,000 | slow, ~₹ in Vercel build minutes |
| 50 | ~10,000 | builds become a bottleneck for every deploy |
| 100 | ~20,000 | untenable |

You would be paying, on every single deploy, to render byte-identical Science chapters 100 times. Wrong axis.

**Problem 2 — duplicate content across N paths is an SEO penalty**, and content marketing is a channel you'll want later (see `GROWTH_PLAYBOOK.md`'s SEO engine).

**Problem 3 — the slug is a liability.** A school leaves and the URL dies; a school renames and links break; the slug is also a public statement of who your customers are, which some schools will not want.

### The design that gets you the same benefit for a fraction of the cost

**One canonical content tree, N brands applied at runtime.**

```
Canonical (built once, SSG):     /learn/class-9/science/exploration/ch-04
School-facing (rewritten):       /dps-rkpuram/class-9/science/exploration/ch-04
```

- `src/proxy.ts` — which already exists and already handles the guest-cookie auth gate — rewrites `/[school]/...` → `/learn/...`, setting a school context header/cookie from a `schools` lookup.
- Branding (name, crest, accent colour, wordmark) reads from the `schools` row at render time. One build, unlimited schools, **zero marginal build cost per school.**
- Canonical `<link rel="canonical">` points at `/learn/...`; school-prefixed paths get `noindex`. Solves SEO.
- A departing school = one row flipped inactive. No rebuild.

**Later upgrade path, if a school wants it:** `dps.knovis.app` reads as more "theirs" than a path does, and Vercel Pro supports wildcard domains. The canonical content tree does not change — you are only adding a second rewrite source. **Design for this now, build it when a school asks.**

**One caution on branding depth.** Full white-label (their logo replacing yours) undercuts your own brand-building and makes case-study marketing harder. The version that sells just as well and costs you nothing: **co-branding** — "Knovis for DPS RK Puram", their crest beside your wordmark, their accent colour on the dashboard. Offer full white-label only as a paid tier, if ever.

---

## 2. Decision #2 — class-9 content by August

### The blocker is publication, not effort

| Subject | New book (2026-27) | Chapters | Status | Buildable in Aug? |
|---|---|---|---|---|
| Maths | **Ganita Manjari** | **15** (was 12) | Released | ✅ |
| Science | **Exploration** (integrated PCB) | **11** (was 12) | Released | ✅ |
| English | **Kaveri** (replaces Beehive + Moments) | ~12–15 units | Released | ⚠️ if time |
| Social Science | **Understanding Society: India & Beyond** Pt 1–2 | reorganised | **Under final review, expected Jul–Aug 2026** | ❌ |
| ICT | — | — | **Under development** | ❌ |
| Hindi / Sanskrit | Ganga / Sharda | — | Released | ❌ deprioritise |

**Do not build anything from the old books.** Beehive, Moments, the 12-chapter Science, the four separate SST books — all obsolete. Content built against them in August is dead on arrival in a school in October.

### Recommended August scope: 26 chapters, two subjects

**Science (Exploration, 11 ch) + Maths (Ganita Manjari, 15 ch) = 26 chapters.** Then English in September, Social Science whenever the book ships (realistically Oct–Nov).

This is also the right *pedagogical* scope: Science and Maths are where recall failure actually costs marks, where parents feel pain, and where a measurable pre/post delta is easiest to demonstrate in a pilot. English and SST are better served by your existing concept-card format anyway.

### What "one chapter of content" means, concretely

Per chapter, targeting the existing schema (`topics.body` + `questions` bank):

- **6 concept cards** — the 6-beat blog spine already in `BLOG_BODY_SPEC`, each with exactly one `viz:*` diagram. Your existing primitives map cleanly: `viz:flow` (reflex arc, nitrogen cycle), `viz:tree` (classification of matter), `viz:table-diff` (mitosis vs meiosis), `viz:array` (worked numericals, step-by-step algebra).
- **~50 questions** — weighted to choice kinds (mcq / truefalse / multi) because those grade deterministically at zero AI cost, plus a few `open` for the weekly written. 50/chapter is the floor for a year of SM-2 scheduling without visible repeats.

26 chapters → **156 concept cards, ~1,300 questions.**

### The real constraint is review hours, not compute

| Work | Rate | Hours (26 ch) |
|---|---|---|
| Verify 1,300 questions (answer correctness, syllabus fit, no ambiguity) | ~25/hr | ~52 |
| Verify 156 concept cards (factual accuracy, diagram correctness) | ~4/hr | ~39 |
| **Total** | | **~91 hours** |

91 hours in 31 days is achievable, but not by you alone alongside field sales. **Budget ₹30,000–60,000 for a freelance class-9 Science/Maths teacher** (₹400–700/hr market rate) to review, with you reviewing Maths. This is the single most important ₹50,000 you will spend: **one wrong Science answer in front of an HOD costs you the school**, and teachers check exactly this in the first week.

**Ship-gate for August:** no chapter goes live to a student until a subject-competent human has signed off on every question in it. Track it like `the DSA checklist (deleted 2026-08-05, in git history)` — that pattern worked.

---

## 3. Decision #3 — the teacher dashboard

The brief ("all the Q&A, and the growth/improvement in student answers, so teachers can quantify whether it's helping") is right. Three notes on making it actually persuasive.

### 3.1 The metric that only you can produce

Usage stats prove nothing and every vendor shows them. The metric that wins the renewal is:

> **First-attempt accuracy vs. delayed-recall accuracy on the same question.**

A student scores 4/5 on Chapter 4 in July. The system re-asks in September. Did it hold? That delta *is* retention, it is exactly what the school is buying, and **only a spaced-repetition system can measure it.** Extramarks cannot show this. DIKSHA cannot show this. Put it on the front of the dashboard and make it the headline of the pilot report.

### 3.2 What the dashboard shows

| Panel | Content | Who it convinces |
|---|---|---|
| **Retention curve** | Class avg: first-attempt vs 2-week vs 6-week recall | Principal — the money slide |
| **Chapter × student heatmap** | Latest recall score per cell | Teacher — instant "who's lost" |
| **At-risk list** | Students <3/5 on ≥3 chapters, ranked | Teacher — actionable Monday morning |
| **Item analysis** | Questions the *class* failed ("34 of 42 missed Q7") | Teacher — this is a *teaching* signal, and it is the panel that makes teachers advocate for you internally |
| **IA export** | Periodic + Multiple Assessment marks, per student per subject, CBSE format, one click | Principal / exam coordinator — the budget justification |
| **ASL evidence** | Weekly viva transcripts + rubric scores, teacher awards the marks | Exam coordinator |

**Item analysis is the sleeper feature.** Everything else tells a teacher about students; item analysis tells them about *their own teaching*, which is the thing that makes a teacher open the tool unprompted. Cheap to build (you already store every answer), disproportionate on adoption.

### 3.3 Build note

Do not express teacher visibility in RLS policies — reading 40 students' `quiz_sessions` row-by-row through a policy is slow and awkward. Use a `security definer` RPC (`get_section_report(section_id)`) that checks the caller's role once and aggregates server-side. Full tenancy/RLS design is in `SCHOOL_GTM.md` §10.

---

## 4. Cost model — assumptions and unit prices

All prices verified 2026-07-31 from official pricing pages.

### AI (Google Gemini API, paid tier)

| Model | Input /1M | Output /1M | Note |
|---|---|---|---|
| **Gemini 3.1 Flash-Lite** | **$0.25** | **$1.50** | recommended workhorse |
| Gemini 3.5 Flash-Lite | $0.30 | $2.50 | |
| Gemini 2.5 Flash *(your current default)* | $0.30 | $2.50 | |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | ⚠️ **retiring 16 Oct 2026** |
| Gemini 3.1 Pro | $2.00 | $12.00 | content authoring only |
| Gemini Embedding | $0.15 | — | RAG |
| **Gemini 3.1 Flash Live (audio)** | **$3.00 / $0.005 per min** | **$12.00 / $0.018 per min** | the interviewer |

Batch mode is **50% off** on both directions — content generation should always run in batch.

> ⚠️ **Two compliance-relevant notes.** (a) Your fallback chain in `gemini.ts` currently ends at 2.0-flash / 2.0-flash-lite; 2.5 Flash-Lite retires 16 Oct 2026, so the chain needs revisiting before the school term anyway. (b) **Do not run student data through the Gemini free tier.** Free-tier terms generally permit use of submitted data for product improvement; with minors' data under DPDP that is not a risk worth taking. Paid tier from day one, including in the pilot. Confirm against current terms before launch.

### Speech (if you go beyond browser-native)

| Service | Rate |
|---|---|
| AssemblyAI batch | $0.0025/min |
| Deepgram batch | $0.0043/min |
| Deepgram streaming | $0.0077/min |
| Google Cloud STT | ~$0.016/min |

### Infrastructure

| Service | Plan | Cost | Included |
|---|---|---|---|
| Supabase | Pro | **$25/mo** | 8 GB DB, 100 GB storage, 250 GB egress, 100k MAU |
| Vercel | Pro | **$20/mo** | 1 TB transfer, 10M edge requests, function invocations then $0.60/1M |

Overages relevant at your scale: Supabase DB $0.125/GB, storage $0.0213/GB, egress $0.09/GB.

---

## 5. Cost model — the numbers

### 5.1 Content build (one-time, 26 chapters)

Per chapter: ~14,000 input tokens (source + spec), ~13,200 output (6 concept cards + 50 questions).

| Approach | Per chapter | × 3 passes × 26 ch |
|---|---|---|
| Gemini 3.1 Flash-Lite, batch | $0.012 | **$0.91 ≈ ₹87** |
| Gemini 3.1 Flash-Lite, standard | $0.023 | $1.82 ≈ ₹173 |
| Gemini 3.1 Pro (highest quality) | $0.186 | $14.50 ≈ ₹1,378 |

**API cost for the entire class-9 Maths + Science library: under ₹1,400 even on the expensive model.** Use Pro — the quality difference on syllabus content is worth ₹1,300.

| Content build, all in | ₹ |
|---|---|
| API generation | ~1,400 |
| Human review (Science teacher, ~60 hrs @ ₹500) | 30,000 |
| Contingency / rework | 15,000 |
| **Total for Maths + Science** | **~₹46,000** |
| **Extrapolated to all 4 subjects** | **~₹1,60,000** |

### 5.2 Per-student runtime cost (per year, 200 school days / 40 weeks)

| Activity | Frequency | Cost/student/year |
|---|---|---|
| Daily recall — choice kinds, deterministic grading | 200× | **₹0** |
| Weekly written answer — 3 open answers batched, 1 Gemini call | 40× | **₹12** |
| Voice viva | 40× | **₹6 – ₹372** (§5.4) |

Daily recall costing ₹0 is not an accident — it is the architectural decision that makes this business work. Questions come from a bank authored once and shared nationally; mcq/truefalse/multi grade deterministically in your existing `finish()` path. **Never generate per-student questions at runtime.**

### 5.3 Infrastructure by scale

| Students | Supabase | Vercel | Monthly | **Annual** | Per student/yr |
|---|---|---|---|---|---|
| 100 (1 pilot school) | $25 | $20 | $45 | **₹51,300** | ₹513 |
| 200 (1 school) | $25 | $20 | $45 | **₹51,300** | ₹257 |
| 2,000 (10 schools) | $25–35 | $20–25 | $45–60 | **₹51,300–68,400** | **₹26–34** |

Infrastructure is almost entirely **fixed**. At 2,000 students: DB ~6 GB (inside the 8 GB), audio storage ~88 GB if you record vivas (inside the 100 GB), egress and invocations nowhere near limits. **The same ₹55,000 carries you from 100 students to ~5,000.**

### 5.4 The voice interviewer — three architectures, 60× cost spread

This is the decision that matters. A 5-minute weekly viva, student speaking ~3 minutes.

#### Tier 0 — Browser-native *(you already have this)*
Web Speech API for recognition (`MicButton`, already shipped), browser `SpeechSynthesis` for the examiner's voice, Gemini grades the transcript with your existing `gradeSession(mode:"communication")` rubric.

- **₹6 / student / year**
- ✅ Already 80% built. Zero speech vendor. No audio leaves the browser → **cleanest DPDP position by far**.
- ❌ Chrome/Edge only (Safari partial). Recognition accuracy on Indian-accented teenage English is mediocre. No audio evidence unless you separately record. Not conversational — structured Q&A, not dialogue.

#### Tier 1 — Recorded + managed STT
Student records; audio uploaded; batch transcription; Gemini grades. Examiner questions are TTS'd **once** into cached audio files and served to every student (amortises to ~₹0).

- **₹35 – ₹55 / student / year** (AssemblyAI batch → Deepgram batch)
- ✅ Works on every browser. Much better accuracy. **Produces the audio evidence ASL actually needs.** Async, so no latency engineering.
- ❌ Storing minors' voice recordings is a real DPDP surface — needs consent, retention limits, deletion on request.
- Storage: ~44 MB/student/year; 2,000 students = 88 GB, inside Supabase Pro.

#### Tier 2 — Gemini Live API, true conversation
Real-time speech-to-speech. The examiner interrupts, follows up, probes.

- **₹372 / student / year** weekly *(includes a 1.6× uplift for context re-processing, which naive estimates miss)*
- **₹93 / student / year** if monthly
- ✅ Genuinely impressive. The demo that makes a principal say yes.
- ❌ At ₹700/student revenue, weekly Tier 2 consumes **53% of revenue** and drops gross margin from 93% to 41%. Preview-model dependency. Hardest DPDP position.

#### Recommendation

> **Ship Tier 0 for the pilot. Move to Tier 1 when a school needs ASL evidence. Use Tier 2 monthly — or purely as the live demo in the principal's office — never weekly for everyone.**

Tier 0 costs you almost nothing, is mostly built, and proves whether students will *do* a weekly viva at all — which is the actual open question, not audio fidelity. Spend on Tier 1/2 only after that's answered. A blended model (Tier 1 weekly + Tier 2 once a month) lands at ~₹150/student/year, still an 79% gross margin at ₹700.

### 5.5 Blended COGS per student per year (at 2,000 students)

| Component | Tier 0 | Tier 1 | Blended (T1 weekly + T2 monthly) | Tier 2 weekly |
|---|---|---|---|---|
| Infrastructure | ₹30 | ₹34 | ₹34 | ₹30 |
| Written grading | ₹12 | ₹12 | ₹12 | ₹12 |
| Voice | ₹6 | ₹55 | ₹148 | ₹372 |
| **Total COGS** | **₹48** | **₹101** | **₹194** | **₹414** |
| **Gross margin @ ₹700** | **93%** | **86%** | **72%** | **41%** |

### 5.6 What a pilot actually costs you

The number that should reassure you:

| Pilot | Marginal AI | Marginal infra (4 months) | **Total** |
|---|---|---|---|
| 100 students, one term | ₹2,200 | ₹8,300 | **~₹10,500** |
| 200 students, one term | ₹4,500 | ₹8,300 | **~₹12,800** |

**A free pilot costs about ₹10,000.** Give it away without hesitation. The investment is the ₹1.6 lakh content library — and that is spent once and reused by every school forever.

---

## 6. Year-1 P&L and what to charge

### Scenario: 10 schools, 2,000 students, school-paid, Tier 1 voice

| Line | ₹ |
|---|---|
| **Revenue @ ₹700/student** | **14,00,000** |
| Infrastructure | (68,000) |
| AI runtime (2,000 × ₹67) | (1,34,000) |
| Content build + review, all 4 subjects | (1,60,000) |
| Legal / DPDP (privacy, consent flow, school contracts) | (75,000) |
| Field sales — travel, one city, ~60 visits | (1,00,000) |
| Tools, domain, misc | (30,000) |
| Payment gateway @ 2% | (28,000) |
| **Cash costs** | **(5,95,000)** |
| **Surplus before founder pay** | **8,05,000** |
| Founder salary @ ₹50k/mo | (6,00,000) |
| **Net profit** | **2,05,000** |

### Break-even

Fixed costs ≈ **₹4,33,000**. Variable ≈ **₹81/student** (₹67 AI + ₹14 gateway). Contribution at ₹700 = **₹619/student**.

| Target | Students | ≈ Schools |
|---|---|---|
| Cover cash costs | **700** | **3.5** |
| Cover cash costs **+ ₹50k/mo salary** | **1,669** | **8.3** |

> **Your 10-school / 2,000-student year-1 goal clears both bars with margin.** The plan is financially sound as stated.

### What to charge

| | Price | Verdict |
|---|---|---|
| Floor (covers costs + ₹6L salary at 2,000) | **₹598** | never go below |
| **Target** | **₹700 / student / year** | recommended |
| Stretch (if the IA + ASL story lands) | ₹800–900 | try it on school #4 onward, once you have the pilot data |
| Ceiling | ₹1,400–2,300 | LEAD's price — for whole-school transformation, not a module. Do not approach it. |

Bill **per section per year, annually in advance**, invoiced to the school. Not per month (school finance offices hate it), not per active user (they will not accept usage risk).

### Parent-paid alternative, honestly compared

At **₹1,299/student/year** with the same 10 schools (2,000 students exposed):

| Target | Payers needed | Conversion |
|---|---|---|
| Cover cash costs | 359 | **18%** — achievable |
| Cover costs + ₹6L salary | 857 | **43%** — not realistic |

**Conclusion: parent-paid at 10 schools covers your costs but will not pay you a salary.** It would need ~25–30 schools at ~18% conversion to do that. School-paid at ₹700 gets there at 8 schools.

This flips the recommendation in `SCHOOL_GTM.md` §7. Given you have committed to field sales, **go school-paid as the primary motion**, and hold parent-paid as (a) the fallback if schools won't move budget, and (b) an optional premium tier (Tier 2 voice viva + unlimited practice at ₹799/year) layered on top of a school contract.

### One risk worth naming

**Every cost above is USD-denominated; every rupee of revenue is INR.** The rupee moved from a 93.47 average for 2026 to 95.55 by 31 July. At 86–93% gross margin a 10% depreciation costs you well under 1% of revenue — immaterial. Noted so it isn't a surprise, not a reason to act.

---

## 7. What I'd actually do

**August** — Science (11 ch) + Maths (15 ch) content, generated in batch, **100% human-reviewed before any student sees it**. Freelance a class-9 Science teacher for review (~₹30k). Ship nothing else.
**Simultaneously** — the 20 discovery conversations from `SCHOOL_GTM.md` §8. They cost evenings, not build time, and they tell you whether to build the IA export at all.
**September** — tenancy + roles + the proxy rewrite (§1), teacher dashboard v1 (retention curve + heatmap + item analysis), Tier 0 voice viva, DPDP consent flow. English (Kaveri) content as capacity allows.
**October–December** — pilot in 2–3 schools, class 9, Science + Maths, free, **with a control section**. Social Science content once the book ships.
**January–March** — pilot readout → sell for April 2027 at ₹700/student.

**Cash needed before first revenue: roughly ₹3.5–4 lakh** (content ₹1.6L, legal ₹75k, infra ₹50k, travel/pilot ₹1L). That is the number your runway has to cover, and it is the question still open from `SCHOOL_GTM.md` §13.

---

## 8. Open questions

1. **Runway** — still unanswered, and it is now quantified: ~₹4 lakh and ~9 months to first school-paid revenue.
2. **Who reviews the Science content?** If you cannot name a qualified reviewer by ~7 August, the August scope should drop to Maths only, which you can review yourself.
3. **Do you accept Tier 0 voice for the pilot**, with Tier 1/2 deferred until students prove they'll do a weekly viva at all?
4. **Do you have access to the new NCERT PDFs already?** Exploration and Ganita Manjari are free on ncert.nic.in. Confirm before 1 August — the whole content plan assumes it.
5. **Full white-label or co-branding?** Recommendation: co-brand ("Knovis for DPS RK Puram"). Full white-label undercuts your own brand and complicates case studies.

---

## Sources

**Pricing (official):** [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) · [Supabase pricing](https://supabase.com/pricing) · [Vercel pricing](https://vercel.com/pricing)
**Speech:** [Speech-to-Text API pricing comparison, July 2026](https://www.buildmvpfast.com/api-costs/transcription) · [Deepgram vs Google vs Azure STT](https://deepgram.com/learn/deepgram-vs-google-vs-azure-speech-to-text) · [Best Speech-to-Text APIs 2026](https://deepgram.com/learn/best-speech-to-text-apis-2026)
**Gemini model detail:** [Gemini pricing 2026 — CloudZero](https://www.cloudzero.com/blog/gemini-pricing/) · [Gemini API pricing — BenchLM](https://benchlm.ai/google/api-pricing) · [Google Gemini TTS & Live API pricing](https://the-rogue-marketing.github.io/google-gemini-tts-speech-audio-api-pricing-may-2026/)
**Syllabus:** [NCERT New Books Class 9 2026-27 — Educart](https://www.educart.co/ncert/ncert-books-class-9) · [NCERT Class 9 New Syllabus 2026-27 book list — B3books](https://b3books.in/blogs/exam-prep/ncert-class-9-new-syllabus-2026-27-book-list) · [NCERT Class 9 new textbooks: release dates and printing delays — Toppers Clan](https://toppersclan.com/ncert-class-9-new-textbooks-2026-release-date-updates-2/) · [NCERT New Syllabus 2026-27, Class 9 & 11 changes](https://www.yournotebook.in/blog/ncert-new-syllabus-2026-27-class-9-11-changes-ncf) · [New NCERT Class 9 Books 2026-27 — Competishun](https://competishun.com/new-ncert-class-9-books-2026-27-complete-syllabus-free-pdf-downloads/)
**FX:** [USD/INR spot history 2026](https://www.exchangerates.org.uk/USD-INR-spot-exchange-rates-history-2026.html)
