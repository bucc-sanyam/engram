# Knovis for Schools — B2B feasibility & positioning blueprint

> Research date: 2026-07-31. Scope: CBSE classes 9–10, India, B2B (school-sold) vs B2B2C (school-endorsed, parent-paid).
> This document does **not** supersede `GROWTH_PLAYBOOK.md` — see §11 (you cannot run both).

---

## 1. The verdict up front

**The idea is feasible, but not in the shape you described it, and not on a D2C timeline.**

Three findings drive everything below:

1. **The wedge you have is not "retention" — it's CBSE's mandatory 20-mark Internal Assessment.** Every CBSE school must produce, per student per subject per year: Periodic Assessment (5), Multiple Assessment (5), Portfolio (5), Subject Enrichment incl. ASL (5). This is real, recurring, audit-visible paperwork that schools currently do in Excel and on paper. Knovis's engine maps onto it almost 1:1. That is a budget line. "Better retention" is not.

2. **"Reels killed attention span" is the right diagnosis and the wrong lead.** It is now an officially recognised problem (the Economic Survey 2025–26 carries a *digital addiction* section for the first time; Himachal Pradesh banned phones in all schools from 1 March 2026; Karnataka has proposed an under-16 social-media ban). But you would be walking into schools that are actively confiscating screens and saying "the answer is more screen." Lead with the buyer's outcome; keep attention as the story you tell parents and students, never the principal.

3. **The calendar is brutal and non-negotiable.** Indian school years run April–March; vendor decisions land Oct–Feb; deployment is April. Starting discovery in Aug 2026 means **first paid rupee ≈ April 2027**. Nine months. There is no way to compress this in the pure B2B motion — which is why §7 recommends a hybrid.

**Recommendation:** go to schools, but sell the *compliance + outcomes* job, land via a **school-endorsed / parent-paid** wedge to get revenue inside 4–5 months, and layer a school-paid IA/ASL module on top for AY 2027-28. Pick one city. Kill or freeze the coding-interview beachhead — not both.

---

## 2. What the market actually looks like

| Fact | Number | Implication for you |
|---|---|---|
| CBSE-affiliated schools | ~28,000 (2026) | Your total universe. Filter hard — see §6 ICP. |
| Total Indian schools / private unaided | ~1.5M / ~3.4 lakh | Irrelevant to you. Don't quote TAM at investors from this. |
| India EdTech market | ~$7.5B (2025) → ~$29–33B early 2030s, ~28% CAGR | Growth is real but concentrated in test-prep and B2G. |
| K-12 edtech funding | **down 82%** from the 2021 peak ($4.1B → <$320M by 2023) | You will not raise on a K-12 deck in 2026 unless you have revenue. Assume bootstrapped. |
| Households with a secondary-school child taking coaching | ~2 in 5 | Willingness to pay for *exam outcome* is proven. |
| Coaching share of family education budget | 12.5% (2018) → **16% (2025)**; ~25% at higher-secondary | Rising. This is the budget you are adjacent to. |
| Urban coaching spend | ₹3,988/student/yr avg (rural ₹1,793); ₹6,311 at higher-secondary | Your price ceiling anchor for parent-paid. |
| Class 9 online foundation coaching | Vedantu JEE Foundation Cl-9 from **₹42,713/yr** | The premium anchor. You are not competing here — you sit under it. |
| LEAD School (the B2B benchmark) | ₹367 Cr revenue (FY25), ~9,000 schools, 3.5M students | Proof B2B-to-schools can reach scale in India. |
| LEAD pricing | **₹1,400–2,300 per student per year**, 3-year contracts, ≈8–10% of a school's fee income | Your per-student price must sit well below this — you're a module, not a system. |

**Read on the competitive field:**

- **LEAD / Extramarks / Next Education** — full-stack curriculum + content + teacher training. Big decision, big price, replaces the school's operating model. You are not this and should never pitch against it.
- **Teachmint / Toddle / Classplus** — school OS / ERP / classroom management. They own *administration*; they do not own *whether the student remembered Tuesday's chapter*. Complement, not competitor. Integration target later.
- **Mindspark (Educational Initiatives) / ConveGenius** — adaptive practice, strong evidence base (J-PAL–evaluated, 2–3× learning gains), but overwhelmingly focused on foundational literacy/numeracy and government/CSR-funded deployments, not fee-paying CBSE 9–10.
- **DIKSHA / PM e-VIDYA (NCERT, Govt.)** — free, NCERT-aligned, 36 languages, adopted by every state and CBSE, QR codes printed in the textbooks. **This is your hardest objection**, and it will be raised in every meeting. Your answer is not "better content" — it's "DIKSHA gives you content; it does not tell you which of your 42 students forgot photosynthesis, and it does not produce your internal-assessment record."
- **Physics Wallah** — validated the *phygital* model post-Byju's. Notable because it proves what Indian parents now buy: tangible outcomes and value for money, not brand.

**The trust environment.** Indian parent psychology moved from FOMO (2020–22) to **FOGS — fear of getting scammed** (2024–26), driven by the Byju's collapse. Byju Raveendran was sentenced to six months for contempt in Singapore in May 2026; the story is still live in parents' minds. Practical consequence: **no aggressive sales, no lock-in contracts, no "limited seats," no lead-gen calls to parents.** Any tactic that smells like Byju's costs you the school permanently.

---

## 3. The reframe: what you are actually selling

You proposed: *students log the classes they attended and answer questions on them.*

That is the mechanism. Nobody buys the mechanism. Here is the job for each buyer, in the order they care:

### The school owner / trustee (signs the cheque)
Cares about: **admissions next year**, fee realisation, cost per student.
Sell: "Your board average and your 'we do this and the school down the road doesn't' line."

### The principal (blocks or champions)
Cares about: **board results**, CBSE compliance, teacher workload, parent complaints.
Sell: **"Knovis produces your 20-mark internal assessment record — Periodic, Multiple Assessment, Portfolio, and ASL — automatically, per student, per subject, with evidence. Zero extra teacher hours."**
This is the sentence that gets a second meeting. Everything else is supporting material.

### The subject teacher / exam coordinator (decides whether it survives)
Cares about: not more work, not being audited by the app, looking good in the staff meeting.
Sell: "One tap at the end of your class. The app does the rest and hands you the marks."
**If the teacher isn't a beneficiary, the deployment dies in week 6.** Every school-edtech post-mortem says the same thing: the tool is 20% of the work, teacher training and process change are the other 80%.

### The parent (pays, in the hybrid model)
Cares about: marks, spoken English, confidence, and — genuinely, now — screen addiction.
Sell: **"Fifteen minutes a night turns today's classes into marks. And every weekend your child does a spoken viva with an AI examiner, so they stop freezing when someone asks them a question."**
This is where the attention-span story belongs, and it lands hard here.

### The student (must not hate it)
Cares about: not being bored, not being surveilled, finishing fast.
Sell: streaks, 6-minute sessions, no homework smell.

---

## 4. Positioning: the lines

**Master positioning (school-facing):**
> **Knovis turns every class into a graded recall — and turns that into your CBSE internal assessment record.**

**Supporting lines by audience:**

| Audience | Line |
|---|---|
| Owner | "The only thing parents compare next April is your board average." |
| Principal | "Your 20 marks of internal assessment, generated, not compiled." |
| Teacher | "One tap after class. You get the marks and a list of who didn't get it." |
| Parent | "School teaches it once. Knovis makes sure it's still there in February." |
| Student | "Six minutes. Then you're done." |

**On your "reels / attention span" hook — keep it, but demote and reframe it.**

Do not say: *"Attention spans are collapsing, so use our app."* You will be told, correctly, that this is more screen time.

Say instead — and make it a genuine product constraint you can defend in the room:
> **"Knovis is the anti-app app. No feed. No autoplay. No infinite scroll. The session ends and it tells you to leave."**

Then the attention data becomes your *credibility*, not your claim:
- Indian adolescents average ~442 min/weekday of screen time; 65% spend 2–3+ hrs/day on social platforms.
- The Government's own Economic Survey 2025–26 named digital addiction as carrying "real economic and social costs."
- ~23 minutes to return to deep focus after a single interruption.

Used this way, the narrative works *with* the phone-ban wave instead of against it: you are the 12 minutes of structured screen that justifies itself, in a world where the other six hours don't.

---

## 5. The two products that actually differentiate you

### 5a. The Interviewer tab → **map it directly to CBSE ASL**

This is your strongest and most under-appreciated asset. CBSE classes 9–10 carry **Assessment of Listening and Speaking Skills (ASL)** inside Subject Enrichment Activities — a real, mandatory, marked component that schools find genuinely painful to run (it requires one-on-one time with every student, and most schools fake it).

You already have the engine: `MicButton` (Web Speech API), the Communication Lab's `gradeSession(mode:"communication")` rubric scoring **Content / Structure / Delivery + tips + an improved-answer rewrite**, and `ReportCardView`'s `CommMeter` bars. CBSE's own ASL rubric assesses *interactive competence (initiation, turn-taking, relevance)* and *fluency (cohesion, coherence, speed)*. The mapping is close enough to be a weekend's work, not a rebuild.

**Positioning rule for v1: practice and evidence, never the grade.**
> "Every Saturday, each student does a 5-minute spoken viva with an AI examiner. You get the transcript, the rubric scores, and the recording. **The teacher awards the ASL marks.**"

Human-in-the-loop is not a limitation to apologise for — it is what keeps you out of the fairness/bias/appeals trap, keeps the teacher central (adoption), and makes the DPDP conversation survivable.

**Known risks:** speech recognition accuracy on Indian-accented teenage English is materially worse than on adult US English; voice recordings of minors are personal data under DPDP; per-minute voice AI cost is your largest unit-cost item. Design for weekly, not daily.

### 5b. Interactive blogs → **"concept cards"**

You already have `viz:array` / `viz:tree` / `viz:flow` / `viz:table-diff`, a strict validator, and the legibility/overflow fixes. For CBSE 9–10 these map cleanly:

| Existing primitive | CBSE 9–10 use |
|---|---|
| `viz:flow` | Photosynthesis, nitrogen cycle, reflex arc, how a bill becomes law |
| `viz:tree` | Classification of matter, tissue types, government structure |
| `viz:table-diff` | Arteries vs veins, mitosis vs meiosis, Sabha comparisons |
| `viz:array` (stepper) | Worked numericals, step-by-step algebra, balancing equations |

Position as: **3-minute concept cards, one diagram each.** This is also your answer to "isn't this just more screen?" — it's short, it ends, and it's the same length as one reel.

---

## 6. Money: pricing, ICP filter, and the number that decides everything

### The sales-cost constraint (read this twice)

A fully loaded field sales rep in tier-1/2 India costs roughly **₹6–10 L/year**. With a ~6-month school sales cycle, a realistic rep closes **12–25 schools/year**. At a healthy 3× quota-to-cost, that rep must generate **₹20–30 L/year**.

> **Minimum viable ACV ≈ ₹1.2–1.5 lakh per school.**

Now check your idea against it:

| Scenario | Price/student/yr | Students (9+10) | ACV | Viable at scale? |
|---|---|---|---|---|
| Class 9–10, small school | ₹400 | 100 | ₹40,000 | ❌ |
| Class 9–10, mid school | ₹400 | 200 | ₹80,000 | ❌ marginal |
| **Class 9–10, mid school, IA+ASL priced** | **₹700** | **200** | **₹1.4 L** | **✅** |
| Class 9–10, large school | ₹700 | 350 | ₹2.45 L | ✅ strong |
| Grades 6–10 expansion (year 2) | ₹500 | 500 | ₹2.5 L | ✅ strong |

**Two consequences:**

1. **Price at ₹600–800/student/year, not ₹300.** You can only defend that price if you are selling the IA + ASL compliance job. This is the second reason the compliance reframe matters — it is what makes the unit economics close. (For reference: LEAD charges ₹1,400–2,300 for a whole-school transformation; ₹700 for a module is a credible fraction, not a stretch.)

2. **Hard ICP filter — do not sell to schools with fewer than ~150 students across classes 9 and 10.** They cannot generate a viable ACV and they will consume the same six months of your life.

**Note:** this constraint bites at *scale*, not at pilot. Founder-led sales for the first ~20 schools costs ~₹0 marginal, so you can and should run pilots at lower or zero price. Just don't build a plan that requires hiring reps at ₹60k ACV.

### The ICP, precisely

> Private, CBSE-affiliated, English-medium, **annual fee ₹35,000–₹1,20,000**, **≥150 students across classes 9–10**, in a tier-1 suburb or tier-2 city, with a smart-board/computer-lab already installed and an existing ERP (i.e. already spends on software), where **the owner and the principal are reachable in the same conversation**.

Below ₹35k fees they cannot pay; above ₹1.2L they build in-house or already have LEAD/Extramarks and a procurement committee that will eat you alive.

### Two regulatory constraints on *how* the money moves

- **Fee regulation.** The Delhi School Education (Transparency in Fixation and Regulation of Fees) Act, 2025 caps registration at ₹25, admission at ₹200, caution money at ₹500, requires 3 years of audited statements and parent-committee approval for hikes, treats any unsanctioned charge as an **"Unjustified Fee Demand"** with penalties of ₹1–5 lakh (₹10 L for repeats), and gives parent groups a veto and an appeal route. Other states are following. **Do not build a model that requires the school to add a new line item to the fee slip.** Either the school pays from its existing budget, or the parent pays you directly.
- **Anti-commercialisation.** CBSE affiliation bye-law 19.1(ii) requires the school be run as community service, "not as a business," and CBSE has repeatedly circularised schools against compelling purchases from specified vendors; Delhi's DoE has issued the same directive. **A school cannot mandate that parents buy your app.** In the parent-paid model, participation must be genuinely optional and visibly so.

### DPDP — the compliance surface you don't have yet

Under the DPDP Act 2023 + DPDP Rules 2025, **everyone under 18 is a "child."** You will need:
- **Verifiable parental consent** before processing — including for a 17-year-old.
- **No behavioural tracking or targeted advertising directed at children.** Your current PostHog person-property/funnel instrumentation on minors is a problem as written, and engagement-maximising streak mechanics aimed at children sit in a grey zone. Both are fixable; neither is optional.
- Data-retention policy, a named grievance contact, breach process, and a data-residency answer (Supabase region).
- The "educational institution" exemption exists but its boundary is undefined — legal consensus is that edtech vendors should assume the strict reading.

Reframe this as a sales asset: in 2026, a principal who is being told by their board to worry about student data will *prefer* the vendor who opens with a consent flow and a retention policy. It is a differentiator against every scrappy competitor who hasn't done it.

---

## 7. Two routes, and which one to take

### Route A — Pure B2B (school pays)
- **Money in:** April 2027 at the earliest. Selling window Oct 2026–Feb 2027.
- **Needs:** multi-tenant rebuild, teacher dashboard, NCERT content for 9–10, IA export, field presence in one city, ~₹1.4L ACV pricing.
- **Pros:** real ACV, annual contracts, structural retention, defensible via compliance.
- **Cons:** 9-month cash gap, three-persona decision unit, change-management burden, you personally in cars.

### Route B — B2B2C (school endorses, parent pays, teacher gets dashboards free)
- **Money in:** ~4–5 months.
- **How:** principal agrees to a 20-minute parent-orientation slot and a circular. Parents opt in at **₹149/month or ₹1,299/year**. School gets the teacher dashboard and the IA export **free**. No revenue share to the school (that's what makes it clean under bye-law 19.1(ii)).
- **Economics:** 200 students × 15% conversion × ₹1,299 = ~₹39k/school/yr — low per school, but **near-zero marginal sales cost per school after the principal's yes**, and the principal's yes is a *much* easier ask (no budget, no procurement, no fee-slip risk).
- **Pros:** fast cash, no budget cycle, no fee-regulation exposure, validates real willingness to pay from the people who actually feel the pain, product stays close to what you can build alone.
- **Cons:** low ACV, conversion is unproven, still needs DPDP consent, still needs the content.

### Recommendation: **B → A**

Run **Route B in AY 2026-27 to get revenue, evidence and 3 case studies**, and use exactly that evidence to sell **Route A for AY 2027-28** at ₹700/student. The parent-paid phase is not a detour — it *is* how you earn the right to ask a school for ₹1.4 lakh, because the only thing that closes Route A is a before/after result from a school that looks like the buyer's school.

### Decisions locked (2026-07-31)

- **Field sales: yes.** Route A stays live. Founder-led, one city.
- **DSA beachhead: not frozen — coexisting via tenancy.** School users and self-learners live in one codebase, separated by role + content track (see §10). *Investment* in DSA/SQL content stops; the artifact stays (it is static SSG, zero AI, zero DB, near-zero maintenance). See §12 for the caveat.
- **Sequencing: content first.** Build and optimise class-9 content, pilot on known students, build the teacher / IA / ASL layer in the background. Two amendments in §8.
- **Start at class 9, not 10** (rationale in §8).
- **Open:** runway. Everything below assumes ≥9 months.

---

## 8. The 90-day plan (Aug–Oct 2026)

### Phase 0 — Discovery (weeks 1–6, ₹0 spend, **no product work**)
- **20 conversations** in ONE city: 10 principals/vice-principals, 5 owners/trustees, 5 class 9–10 subject teachers. Discovery, not demos.
- Validate, in order:
  1. Is the 20-mark IA (and specifically ASL) actually a top-5 pain? *If fewer than 5 of 20 say yes, the wedge is wrong — stop and re-scope.*
  2. Who signs, and out of which budget head?
  3. What do they already pay for, and what did they stop paying for and why?
  4. What would make them say no?
- **Exit gate:** 3 schools that say "come back with X and we'll pilot in a section."

### Phase 1 — Build the thin slice (weeks 4–10, in parallel once discovery is 60% done)

> **Amendment 1 — start at class 9, not class 10, and not both.** Class 10 is board year: parents will not experiment with an unproven app, they buy coaching. And the entire cohort churns 100% every March, so you rebuild your user base annually. Class 9 experiments freely, has the same syllabus depth for content-build purposes, and **renews into class 10** — the cohort you win in Sept 2026 is your class-10 cohort in April 2027, with a year of their own recall history already in the system. That history is also the switching cost.

> **Amendment 2 — the friends-and-family pilot validates content, not retention.** Students you know personally will use it because you asked; your relationship *is* the enforcement. Use that pilot to find wrong answers, bad questions, confusing UI and broken diagrams — it is excellent for that and you should start it immediately. Do **not** read its usage numbers as evidence of stickiness, and do not quote them to a principal. The retention kill criterion in §11 only means anything on a real section of ~40 students who owe you nothing.

Build **only**:
- Class 9 **Science + Maths** question banks (seed from CBSE's own published Competency-Focused Practice Questions, then expand — human-reviewed, *not* free-running AI generation; a wrong answer in front of a teacher costs you the school).
- **School → class → section → student** data model + roles. This is a genuine RLS rewrite: your current `auth.uid() = user_id` policy on every table is incompatible with teacher visibility.
- **Teacher tap:** teacher marks "taught Ch 6.2 today" → 5 recall questions auto-assigned to that section, due tonight. **Do not** let students self-report which classes they attended — they will pick the easy ones, and you lose syllabus alignment.
- **Teacher dashboard:** section heatmap of who's weak on what + one-click IA export (CSV/PDF in CBSE's format).
- **Lite mode:** the three.js brain will not run on a ₹8,000 Android. Ship a 2D fallback and a low-bandwidth path.
- **Consent flow:** school-mediated verifiable parental consent, retention policy, analytics scrubbed of behavioural profiling for minors.

Explicitly **not** in the thin slice: all subjects, grade 10, Hindi/regional, ERP integrations, parent app, offline mode.

### Phase 2 — Pilot with a control section (Oct–Dec 2026)
2–3 schools, class 9, Science + Maths, free.

**Run one section on Knovis and one section without.** This is the single highest-leverage decision in the entire plan. Define success *before* you start:
- ≥40% of students complete ≥3 recall sessions/week **without teacher enforcement** by week 4
- Teacher reports ≥2 hours/month saved on IA record-keeping
- **Unit-test delta vs the control section ≥5 percentage points**

That last number, from a school that looks like your next buyer, is the only asset that sells Route A. Everything else is a brochure.

### Phase 3 — Monetise (Jan–Mar 2027)
- Turn on parent-paid in the pilot schools; measure real conversion.
- Use the case study for Oct 2026–Feb 2027 conversations → school-paid contracts for April 2027.

---

## 9. What carries over from today's Knovis, and what doesn't

**Reusable (~40–50% of the code):**
- `src/lib/srs.ts` — SM-2 scheduling. The actual engine, and genuinely rare in Indian K-12.
- The ingest → question-bank → session → grading → report-card pipeline (`/api/quiz`, `ReportCardView`, `quiz_sessions`).
- The `viz:*` primitives + `Markdown.tsx` + strict validation → concept cards.
- The communication judge + `MicButton` → the interviewer tab / ASL.
- Streaks, `ProgressMap`, calendar day reports.

**Does not carry over:**
- **All content.** DSA / SQL / Macro / SARFAESI / Competition Act are worthless here. The Communication Lab partially survives.
- **The data model.** Single-user RLS → multi-tenant with roles is a real rewrite, not a migration.
- **The positioning** ("Learn it once. Never forget it." is fine for consumers; the school buyer needs the IA line).
- **The 3D brain** on low-end devices.
- **The AI-call budget.** Today: 1 Gemini call per ingest, 1 per quiz finish, capped 9+1/day per user. At ₹700/student/year you have roughly ₹150–250/student/year of margin room for AI across ~200 school days. Daily AI-graded open answers are impossible at that price. **Design now for: choice-kind questions graded deterministically (free) daily; AI grading reserved for the weekly viva and one weekly written answer.** Your existing deterministic mcq/truefalse/multi grading path is exactly right for this.
- **The growth channel.** r/leetcode and prep Discords are irrelevant. This is field work.

---

## 10. The school track inside the existing codebase

The decision is to keep one codebase and separate school users from self-learners by **role + track**, rather than forking. That is workable, but the current data model resists it in four specific places. In rough order of difficulty:

### 10.1 Identity: join codes, not email domains

**Email-domain verification will not work.** Indian private-school class-9 students overwhelmingly do not have school-issued email addresses — they sign up with a personal or a parent's Gmail. A domain check will match approximately nobody.

**Self-selecting a school from a dropdown is unverified**, which is fine for content scoping but unsafe the moment a teacher can read student data: "I am a teacher at DPS" becomes a self-serve claim over minors' records.

The mechanism that works:

- **Teacher/coordinator/admin roles are provisioned, never self-claimed** — by you during onboarding, or by an already-verified school admin.
- **Students join via a section-scoped join code** (or a roster CSV the school uploads). The code carries `school_id` + `section_id` + academic year, is short-lived and revocable.
- **The roster/join step is also your DPDP consent gate.** Capture verifiable parental consent at the moment the student is linked to a section — before any teacher can see a single answer. Build the roster flow and the consent flow as one screen, not two features.

### 10.2 RLS: the current model is row-owner, teacher visibility is not

Today every policy is `auth.uid() = user_id` (profiles `= id`, entry_topics via entry ownership). That is a *row-owner* model. "A teacher may read rows belonging to students in sections they teach" is a fundamentally different shape and cannot be bolted on as a second `using` clause without a membership table for policies to join against.

Minimum new schema:

```
schools(id, name, board, city)
sections(id, school_id, grade, name, academic_year)
memberships(user_id, school_id, section_id, role)   -- student | teacher | coordinator | admin
```

Three traps, all of which bite Supabase apps that started single-user:

1. **Recursive RLS.** If `memberships` has a policy that itself queries `memberships`, Postgres errors or loops. Standard fix: a `security definer` helper (`auth_teaches_section(uuid)`, `auth_section_ids()`) that reads the table with RLS bypassed internally, and have every policy call the function instead of subquerying the table.
2. **Performance.** `data.ts` queries Supabase **directly from the browser**, so every one of those calls now evaluates a join-heavy policy per row. Index `memberships(user_id)` and `memberships(section_id)`, and mark the helper functions `stable` so the planner can cache within a statement.
3. **Teacher dashboards are aggregate reads, and RLS is a bad fit for them.** Reading 40 students' `quiz_sessions` row-by-row through a policy is slow and awkward to express. Use a `security definer` RPC instead — `get_section_report(section_id)` checks the caller's role once, then aggregates server-side. This is also where the IA export should live.

**Consequence for the security posture note in `PROJECT_SUMMARY.md`:** "RLS is the only thing isolating users" stops being true the moment teachers exist. Isolation becomes RLS **plus** a correct membership graph, and a bug in `memberships` is now a data breach involving minors. That warrants a test suite — the first one this repo would have.

### 10.3 Content scoping is a routing problem, not an RLS problem

"Don't show school users the DSA blogs" cannot be done with RLS: the DSA / SQL / Macro / SARFAESI / Competition-Act series are **static TS data compiled into SSG pages** (`src/lib/dsa/`, `src/lib/english-communication/`, etc.), not database rows. RLS never sees them.

Do it in two places instead:

- **DB topics** — extend `getBlogTopicLibrary()` in `data.ts`, which is already the shared `/blogs` + `/brain` visibility boundary. Add the track filter there and both surfaces inherit it.
- **Static series** — add a `track` field to the `STORY_SERIES` registry and filter the hub list + `Nav` by the signed-in user's track. The routes stay published (they are SSG and good for SEO); they simply are not surfaced to school users. Only hard-gate a route if there is a reason a class-9 student must not reach it, which there isn't.

A class-9 student's default library should be **their grade + their subjects**, and nothing else. The Communication Lab is the one existing series that should stay visible to them — it is the ASL feed (see §5a).

### 10.4 The AI budget breaks at school scale

Today: 1 Gemini call per ingest, 1 per quiz finish, capped 9 + 1 per user per day. That is priced for a few hundred self-learners. At ₹700/student/year across ~200 school days you have roughly ₹150–250/student/year of margin for AI.

Design for it now, because it is cheap to do early and expensive to retrofit:

- **Daily recall = choice kinds only** (mcq / truefalse / multi), graded deterministically. Your existing grading path already does this at zero AI cost.
- **AI grading reserved for** the weekly viva and one weekly written answer.
- Question banks are **authored once per chapter and shared across every student in the country** — not generated per user. This is the single biggest structural difference from the current ingest-driven model, and it makes the economics work.

---

## 11. Risks, ranked, with kill criteria

| # | Risk | Kill criterion |
|---|---|---|
| 1 | **The compliance wedge isn't actually painful** | <5 of 20 discovery calls name IA/ASL in their top 5 → stop, re-scope |
| 2 | **Students won't use it without enforcement** — the same retention problem you have today, now with a captive audience masking it | <30% complete ≥3 sessions/week unenforced by pilot week 4 → the product isn't sticky for teens; fix or stop |
| 3 | **No teacher owner** → deployment dies at week 6 | No principal will name a specific accountable teacher → decline the pilot |
| 4 | **No measurable outcome** → no case study → no Route A | Control-vs-treatment delta <5pp → you have no B2B story; stay parent-paid |
| 5 | **DIKSHA / "it's free" objection** | If you cannot answer it in one sentence in 3 consecutive meetings, your differentiation is wrong |
| 6 | **DPDP exposure** on minors' data + voice recordings | Non-negotiable pre-pilot work, not a fast-follow |
| 7 | **Cash** — 9 months to Route A revenue, post-crash K-12 funding (-82%) means no bridge | If runway <12 months, Route A is not available to you; run Route B only |
| 8 | **Content accuracy** — one wrong Science answer in front of an HOD | Human review on 100% of the seeded bank before any teacher sees it |
| 9 | **Phone bans spreading** (HP already, Karnataka proposed) | Design for home-use + computer-lab use from day one; never assume in-class phones |
| 10 | **Splitting yourself across two ICPs** | See §11 |

---

## 12. The conflict you have to resolve first

`TASKS.md` has an active milestone: **Week 3 of the 12-week Growth Playbook, beachhead = coding-interview preppers, OMTM = Day-7 return %.** `ICP.md`, `OMTM.md` and the entire DSA Pattern Atlas (150 question blogs) are built for that person.

The school motion and the DSA motion share an *engine* and share **nothing else** — not the content, not the buyer, not the channel, not the price, not the compliance surface, not the weekly rhythm. One needs you shipping publicly every week and living in prep communities. The other needs you in a car, in one city, for six months.

**Resolution taken (2026-07-31): coexist via tenancy, freeze the investment not the artifact.**

This is a reasonable call, with one caveat that should stay on the record. Technical coexistence was never the expensive part — §10 shows it is a few weeks of schema work, and the DSA/SQL content is static SSG with zero AI and zero DB cost, so it genuinely costs nothing to leave standing. What is expensive is **attention**: two content pipelines, two buyers, two channels, two definitions of a good week.

So the line to hold is: the DSA artifact stays live and is not touched. **No new self-learner content, no new self-learner features, no growth work on that funnel** until the school track has either produced revenue or hit a kill criterion. If in three months you find yourself writing DSA chapters "because it's quick," that is the failure mode, and it will be invisible while it happens.

`GROWTH_PLAYBOOK.md` Weeks 3–12 (recruit 20 preppers, Reddit/Discord recruiting, fake-Pro paywall, build-in-public launch) are the specific items now on hold — they are the ones that consume weeks, not the content that already shipped.

---

## 13. Open questions that change the answer

1. ~~**Can you do field sales?**~~ **Answered: yes.** Route A stays live.
2. ~~**Are you willing to freeze the DSA beachhead?**~~ **Answered: coexist via tenancy, freeze investment not artifact.** See §12.
3. **Runway — still open, and it gates the sequencing.** Content-first means several months of building before any revenue. If runway is under ~9 months, the content build must be cut to one subject and the parent-paid switch turned on the moment the first pilot section works, rather than after.
4. **Do you have any school access?** A parent, an alumnus network, a friendly principal, a trustee. One warm school is worth roughly fifty cold ones and it changes the phasing entirely.
5. **Which city?** The plan is single-city by design. Pick it now; it determines the fee-regulation regime (Delhi is the strictest), the phone-ban regime, and how much of your life is spent in traffic.
6. **Which students do you already have access to for the pilot?** Their grade, board and number determine whether the first content build is class 9 Science, class 9 Maths, or both.

---

## Sources

- [India EdTech Market Size & Growth Forecast — MarketsandMarkets](https://www.marketsandmarkets.com/blog/ICT/India-EdTech-Market)
- [Indian K-12 EdTech Market Analysis 2026 — RAYSolute](https://www.raysolute.com/indian-edtech-analysis-2026.html)
- [Beyond the Two-Horse Race: the B2B EdTech Opportunity in India](https://indiamarketentry.com/edtech-market-share-growth-india-b2b-opportunity/)
- [EdTech's pandemic boom is over as K-12 startup funding craters — Rest of World](https://restofworld.org/2026/edtech-funding-collapse-k12-startups-ai-workforce/)
- [LEAD School — Wikipedia](https://en.wikipedia.org/wiki/LEAD_School) · [Forbes India: Inside LEAD School's strategy](https://www.forbesindia.com/article/take-one-big-story-of-the-day/lesson-plan-inside-lead-schools-strategy-for-quality-education-in-smalltown-india/81039/1) · [LEAD School profile — Tracxn](https://tracxn.com/d/companies/leadschool/__oe2fP0y2p5mZsRCJMPA-zjkY8OB81N8chnQAbwrkRSM)
- [B2B EdTech Sales Strategy for K-12 — RAYSolute](https://www.raysolute.com/edtech-b2b-sales-strategy-schools.html) · [How to Crack Selling Education Products to Schools — EdTechReview](https://www.edtechreview.in/trends-insights/insights/selling-to-education-schools-part-1/)
- [What is Internal Assessment (20 Marks) in CBSE Class 9 and 10 — myCBSEguide](https://mycbseguide.com/blog/what-is-internal-assessment-20-marks-in-cbse-class-9-and-10/)
- [CBSE Guidelines for Assessment in Listening and Speaking Skills (PDF)](https://cbseacademic.nic.in/web_material/CurriculumMain22/termwise/Language-Secondary/guideline_english.pdf) · [CBSE ASL — myCBSEguide](https://mycbseguide.com/blog/cbse-assessment-of-speaking-and-listening-skills-asl/)
- [CBSE Class 10 board exams twice a year, 2026 — Careers360](https://news.careers360.com/cbse-class-10-board-exam-2026-twice-year-64-4-students-in-favor-second-attempt-optional-date-sheet-fees-syllabus-explainer) · [CBSE Class 10 Competency-Focused Practice Questions 2026-27](https://motion.ac.in/examinfo/cbse-class-10-competency-focused-practice-questions/)
- [PARAKH / Holistic Progress Card — NCERT](https://parakh.ncert.gov.in/hpc)
- [CMS Education Survey 2025: 27% of students rely on private coaching](https://news.careers360.com/27-of-students-rely-on-private-coaching-urban-participation-higher-cms-education-survey-2025) · [The rising cost of learning in India — IDR](https://idronline.org/article/education/the-rising-cost-of-learning-in-india/)
- [Delhi Assembly passes bill granting parents veto on school fee hikes](https://www.newsonair.gov.in/delhi-assembly-passes-bill-granting-parents-veto-on-school-fee-hikes) · [Delhi fee-hike Act: 15% parents' approval, charges capped — Careers360](https://news.careers360.com/cbse-class-10-board-exam-2026-twice-year-64-4-students-in-favor-second-attempt-optional-date-sheet-fees-syllabus-explainer)
- [CBSE circular against commercial activity in schools](https://www.india.com/education/cbse-advises-schools-against-commercial-activity-of-selling-books-stationary-and-uniform-issues-circular-2048003/) · [Delhi Govt directs schools not to compel vendor purchases](https://news.careers360.com/delhi-government-directive-private-schools-books-uniforms-specific-vendors-ban-doe-guidelines-dsear-rte-rules-parent-complaints)
- [DPDP Rules 2025: children's data, verifiable parental consent — Mondaq](https://www.mondaq.com/india/privacy-protection/1710322/childrens-day-under-the-dpdp-act-2023-and-dpdp-rules-2025-the-new-compliance-frontier-for-edtech-gaming-social-media-and-consumer-platforms) · [DPDP Rules and the Future of Child Data Safety — ORF](https://www.orfonline.org/expert-speak/dpdp-rules-and-the-future-of-child-data-safety) · [DPDP Act Compliance for EdTech & Schools — K&K](https://ksandk.com/data-protection-and-data-privacy/dpdp-act-compliance-for-edtech-schools/)
- [Students, Screens, and Human Capital Formation in India — ORF](https://www.orfonline.org/expert-speak/students-screens-and-human-capital-formation-in-india) · [Adolescents' screen media entertainment (PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12308158/) · [Himachal bans mobile phones in all schools from 1 March](https://news.careers360.com/himachal-pradesh-cm-bans-mobile-phones-in-all-schools-from-march-1/amp)
- [DIKSHA — NCERT/CIET](https://ciet.ncert.gov.in/initiative/diksha) · [PM e-VIDYA](https://pmevidya.education.gov.in/diksha.html)
- [Mindspark / Educational Initiatives — J-PAL evaluation](https://www.povertyactionlab.org/evaluation/disrupting-education-evidence-technology-aided-instruction-india) · [ConveGenius](https://convegenius.com/)
- [A Meta-analytic Review of the Effectiveness of Spacing and Retrieval Practice — Educational Psychology Review](https://link.springer.com/article/10.1007/s10648-025-10035-1) · [Spacing and retrieval practice guide — AERO](https://www.edresearch.edu.au/guides-resources/practice-guides/spacing-and-retrieval-practice-guide-full-publication)
- [Vedantu JEE Foundation Course for Class 9](https://www.vedantu.com/online-course/jee-foundation-course-for-class-9) · [PW Class 9 online coaching](https://www.pw.live/school-prep/class-9/batches)
- [Total schools in India — UDISE+ statistics by board](https://schoolsoftwareindia.com/blog/how-many-schools-in-india/)
