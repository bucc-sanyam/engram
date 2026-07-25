# Knovis — 12-Week Growth Playbook

> **What this is:** a week-by-week execution checklist to take Knovis from *end-of-MVP, pre-revenue* to *validated, monetizable, launched*. Do **one week at a time**, in order. Each week has a mission, a checklist you tick off, a paste-ready **Agent brief** (for a fresh Claude Code session), the **human-only** tasks, and an **exit gate** you must clear before moving on.
>
> **Strategic spine (why the order matters):** Sharpen the wedge → prove people want it and will pay → finish the monetizable loop → turn your content into a distribution engine. You cannot skip. Launching (Weeks 9–12) before retention is proven (Weeks 3–5) just burns users faster.
>
> **The wedge:** *"Knovis helps people cramming for coding interviews actually remember what they study — so it sticks past the interview."* Interview-prep is the doorway; "all learners" is the destination you earn room-by-room.

---

## How to use this playbook

1. **Pick the current week.** Read its Mission, Deliverables, and Exit gate first.
2. **Run the Agent brief.** Open a fresh Claude Code session in the repo and paste the fenced `Agent brief` block for that week. It contains everything the agent needs.
3. **Do the human-only tasks yourself** (talking to users, running SQL with your own DB access, entering API keys, hitting "publish"). Agents scaffold; you decide and deploy.
4. **Tick the boxes** (`- [ ]` → `- [x]`) as you go.
5. **Don't advance until the Exit gate is green.** The gate is the point of the week.

**Legend:** 🤖 agent can do · 🧑 human must do · 🚦 exit gate · ⚠️ watch-out

---

## 📊 North-star metrics tracker (update every Friday)

| Metric | What it means | Target | Wk1 | Wk4 | Wk8 | Wk12 |
|---|---|---|---|---|---|---|
| **Activation %** | landed → hit "aha" (first graded recall) | ≥ 50% |  |  |  |  |
| **Day-7 return %** ⭐ *(OMTM)* | came back on their own by day 7 | ≥ 20% |  |  |  |  |
| **3-day streak %** | formed a 3-day streak in week 1 | ≥ 25% |  |  |  |  |
| **Time-to-aha** | landing → first graded recall | < 60s | ✅ <60s (was aha at tour step 5/14 → now step 2/6, ~2 clicks) |  |  |  |
| **Fake-paywall CTR** | clicked "Go Pro" (intent to pay) | ≥ 15% |  |  |  |  |
| **Signups (cumulative)** |  | 1,000 by Wk12 |  |  |  |  |
| **MRR** |  | > $0 by Wk8 |  |  |  |  |

> ⭐ **Day-7 return is the number that decides everything.** If people don't come back on their own by day 3–7, fix that before spending a rupee on acquisition.

---

# PHASE A — See the Truth & Sharpen (Weeks 1–2)

## Week 1 — Instrument everything + activate your moat
**Phase:** A · **Type:** Build-heavy (great agent week)

🎯 **Mission:** Stop flying blind. Get a working funnel dashboard, confirm your RAG personalization is actually live in production, and write down who you're for.

📦 **Deliverables:**
- PostHog installed, funnel events firing in production.
- A confirmed answer to "is RAG live?" + old entries backfilled if it was dormant.
- A one-page ICP + your single OMTM written down.

✅ **Checklist:**
- [x] Install PostHog and wire the funnel events (see Agent brief). — `posthog-js` + `PostHogProvider` in layout; `src/lib/analytics.ts` 5 events. (2026-07-25)
- [x] Verify all 5 funnel events fire in a real browser session. — verified `landed` + `guest_started` fire in-console; `recall_graded` fires via the demo recall report; init `flush`-callback bug fixed. ⚠️ Dashboard capture needs the **project `phc_` key** (a personal `phx_` key 404s), and the two `NEXT_PUBLIC_POSTHOG_*` vars set in Vercel for PROD.
- [ ] 🧑 Confirm in Supabase whether `knowledge_chunks` exists and has rows (RAG status). If the table is missing, run `supabase/schema-rag.sql` then `supabase/schema-rag-v2.sql` in the Supabase SQL editor. — **still owed** (diagnostic script ready: `scripts/diagnose-rag.mts`).
- [ ] Backfill old entries into the RAG index (see Agent brief) so personalization isn't empty for existing content. — **still owed** (script ready: `scripts/backfill-rag.mts`, dry-run default, `--commit` to write).
- [x] 🧑 Write the ICP one-pager. — `ICP.md` (Sarah Chen, L7 SDE prepping interviews; wedge = coding-interview prep). (2026-07-25)
- [x] 🧑 Pick your **OMTM** and put it on a wall/sticky: **Day-7 return %**. — `OMTM.md`. (2026-07-25)
- [x] Fill the Week-1 column of the metrics tracker above (baseline). — time-to-aha logged post-Week-2; rest await live traffic.

🤖 **Agent brief (paste into a fresh Claude Code session):**
```
You are working in the Knovis repo (Next.js 16 App Router, Supabase, Gemini). Read PROJECT_SUMMARY.md, SESSION_LOG.md, TASKS.md first, and use `graphify query` before reading source. Two tasks:

TASK 1 — Product analytics with PostHog.
- Add `posthog-js` and set up a client-side provider mounted once in src/app/layout.tsx (guard against double-init; only run when NEXT_PUBLIC_POSTHOG_KEY is set).
- Capture these 5 events at the RIGHT places in the code (find them via graphify, don't guess):
  1. `landed` — first client render of the app.
  2. `guest_started` — where `enableGuestMode()` runs (guest cookie set).
  3. `recall_graded` — when a quiz session finishes and a report card is produced (the /api/quiz finish path / recall page report phase). Include score_pct as a property. THIS IS THE AHA EVENT.
  4. `streak_advanced` — where `advanceStreak()` runs.
  5. `signed_in` — successful auth.
- Respect the demo/guest distinction: add a person property `mode: 'demo' | 'guest' | 'auth'`.
- Add NEXT_PUBLIC_POSTHOG_KEY + NEXT_PUBLIC_POSTHOG_HOST to .env.example with comments. DO NOT hardcode keys.
- Verify in the browser preview (demo mode works logged-out): open the app, trigger a recall, and confirm the events appear in the PostHog network requests (read_network_requests) — don't claim success without seeing them fire.
- Run `npx tsc --noEmit` and the dev server; report exactly what you verified.

TASK 2 — Confirm + backfill RAG.
- Determine whether RAG is active: the `knowledge_chunks` table + `match_knowledge_chunks` function come from supabase/schema-rag.sql (and schema-rag-v2.sql for the hardening). Since you can't reach the live DB, write a short admin/diagnostic API route or script that, when run with the service context, reports whether the table exists and how many rows/users it has — and print clear instructions for me to run the two schema files in the Supabase SQL editor if it's missing.
- Write a one-off backfill script (scripts/backfill-rag.mts) that: reads existing `entries` (raw_text), reuses the REAL production chunker (src/lib/chunk.ts) and embedder (src/lib/gemini.ts embedTexts) and the store path in src/lib/rag.ts (indexContent), and indexes any entry not already in `rag_documents`. Make it idempotent, paginated, and respectful of the Gemini rate limits / model fallback chain already in gemini.ts. Do NOT invent a new embedding path — call the existing functions.
- Print a dry-run count first; require a `--commit` flag to actually write.

Ground everything in the real functions named in PROJECT_SUMMARY.md. After each task: tsc clean, verify in preview, then run `graphify update .`. Update SESSION_LOG.md with a terse milestone entry when done.
```

🧑 **Human-only tasks:** running the two RAG schema files in Supabase (needs your DB access); writing the ICP and choosing the OMTM (founder judgment, not code).

🚦 **Exit gate:** You can open PostHog and see real events flowing. You know for certain whether RAG is live. ICP + OMTM are written down.

⚠️ **Watch-outs:** Don't let the agent hardcode any keys. Don't skip the "verify events actually fire" step — an analytics install that silently doesn't fire is worse than none.

---

## Week 2 — Sharpen positioning + compress time-to-aha
**Phase:** A · **Type:** Mixed (copy + build)

🎯 **Mission:** Make the promise undeniable to interview-preppers, and get a cold visitor to their first graded recall in under 60 seconds.

📦 **Deliverables:**
- New outcome-first homepage hero + a focused landing narrative.
- A measured, shortened path from landing → first recall.
- Competitor kill-sentences (Anki / LeetCode / Notion) written down.

✅ **Checklist:**
- [x] 🧑 Rewrite the hero to lead with the outcome: *"Learn it once. Never forget it."* — done across all site-wide static lines (Nav subtitle, login h1+tagline, footer, layout metadata); "second brain"/"novice" demoted to footer/About brand personality. (2026-07-25)
- [ ] 🧑 Write 3 competitor kill-sentences (why you beat Anki, LeetCode/NeetCode, Notion — one line each). — **deferred** (deliberately kept off-site per the no-competitor-comparison positioning; keep as internal sales lines only).
- [x] Instrument and measure current **time-to-aha** (use the Week-1 `landed`→`recall_graded` funnel). — the tour buried the aha at step 5/14; now step 2/6.
- [x] Cut steps between landing and first recall (see Agent brief). Re-measure. Target < 60s. — tour cut 14→6, aha at step 2; verified cold-load → graded report card in ~2 clicks, **<60s**. ✅ exit gate met.
- [ ] Make the "forgetting curve" story (already on `/about`) visible from the landing page — it's your manifesto/enemy. — **deferred** (bigger structural add; `/about` chart untouched, still on-message).
- [x] Update the metrics tracker (time-to-aha before/after).

🤖 **Agent brief:**
```
Knovis repo. Read the context files + use graphify. Two tasks:

TASK 1 — Homepage/hero rewrite (I will give you final copy; scaffold the structure).
- Update the landing hero to be outcome-first for coding-interview preppers. Keep the dark, organic design language (mesh glows, blobs, pills, organic radii — NOT boxy). Surface the Ebbinghaus forgetting-curve chart (already built on /about) as a landing-page section that frames "forgetting" as the enemy.
- Keep the existing guest/demo "try it before signup" flow — that's the aha-before-ask strategy, don't remove it.

TASK 2 — Compress time-to-aha (landing → first graded recall).
- Trace the exact click-path a cold visitor takes from the homepage to their first graded recall session. Use graphify + the route map in PROJECT_SUMMARY.md. List every step.
- Propose and implement the smallest set of changes to get them to a graded recall in under 60 seconds — e.g., a one-tap "Try a 60-second recall" CTA on the landing page that drops them straight into a seeded demo recall (you already have DEMO_REVIEW_QUESTION and the review-demo tour step to model this on), bypassing navigation.
- Do NOT fake the grading — reuse the real recall/report components (ReportCardView etc.) so the aha is genuine.
- Verify in the browser preview: cold-load → reach a graded report in under 60s, no console errors. Screenshot the flow.

tsc clean + preview-verified + `graphify update .` + SESSION_LOG entry. Flag anything that would need a signed-in account to fully verify.
```

🧑 **Human-only tasks:** final hero/landing copy (your voice matters here — the agent drafts, you decide); the competitor kill-sentences.

🚦 **Exit gate:** A stranger can hit a real graded recall in < 60s. The hero promises an outcome, not a mechanism.

⚠️ **Watch-outs:** Resist adding features this week. The only job is *clarity + speed to value*. Every extra step before the aha costs you activation.

---

# PHASE B — Validation (Weeks 3–5)

## Week 3 — Recruit 20 real users + build the feedback loop
**Phase:** B · **Type:** Human-heavy

🎯 **Mission:** Get 20 real interview-preppers (not friends) using Knovis, with a channel to watch and talk to them.

📦 **Deliverables:**
- 20 recruited beachhead users in a private channel.
- A lightweight waitlist/feedback capture.
- Session replay on so you can watch real usage.

✅ **Checklist:**
- [ ] 🧑 Write 3 recruiting posts (Use Prompt #2's ICP to target). Post in r/leetcode, r/cscareerquestions, r/csMajors, and 1–2 interview-prep Discords: *"I built a tool that quizzes you on DSA patterns so you don't forget them — free, looking for 20 people to break it."*
- [ ] 🧑 Stand up a private Discord/Telegram for your first 20; onboard each personally.
- [ ] Enable PostHog **session replay** so you can watch where people get stuck.
- [ ] Build a simple waitlist + feedback capture page (see Agent brief).
- [ ] 🧑 Personally onboard at least 20 people; note the exact moment each one "gets it" (or bounces).
- [ ] Update tracker (activation %, early Day-2 returns).

🤖 **Agent brief:**
```
Knovis repo. Read context files + graphify. Tasks:
1. Turn on PostHog session replay (config only; respect privacy — mask text inputs, and don't record on any auth/credential fields).
2. Build a minimal, on-brand waitlist + feedback capture: an email input + a one-line "what are you studying for?" that writes to a Supabase table (create `waitlist(id, email, goal, created_at)` with RLS-appropriate policy; it's insert-only from anon, no read from client). Keep the dark/organic design language. Add a PostHog `waitlist_joined` event.
3. Add a lightweight in-app feedback affordance (a small floating "Give feedback" that opens a mailto or writes to a `feedback` table) so early users can tell you what broke.
Verify inserts work in preview; tsc clean; graphify update; SESSION_LOG entry. Do not collect anything sensitive; email + free-text goal only.
```

🧑 **Human-only tasks:** all recruiting, all onboarding conversations, watching replays. This is founder work — no agent substitutes for talking to users.

🚦 **Exit gate:** 20 real users have tried it; you've personally watched or talked to at least 10; replay + waitlist are live.

⚠️ **Watch-outs:** Don't recruit friends/family — their politeness will lie to you. Recruit strangers with the actual problem.

---

## Week 4 — Problem interviews + the fake Pro paywall
**Phase:** B · **Type:** Human-heavy (one small build)

🎯 **Mission:** Find out if *forgetting* is a hair-on-fire problem, and get a real signal on willingness to pay — without building billing.

📦 **Deliverables:**
- 10 recorded problem-interviews + a synthesis doc.
- A live fake "Go Pro" paywall capturing intent.

✅ **Checklist:**
- [ ] 🧑 Draft a Mom-Test interview script (Prompt #3) — past behavior, zero pitching.
- [ ] 🧑 Run **10 problem-interviews** (15 min each). Ask: *"Walk me through the last time you studied something and forgot it. What did you do?"* Record (with consent).
- [ ] 🧑 Synthesize: is forgetting *painful and urgent*, or a nice-to-have? Write the honest answer.
- [ ] Ship the **fake Pro paywall** (see Agent brief): a "Go Pro — unlimited AI recall + all expert tracks" button that captures the click as intent, then shows "coming soon — join the list."
- [ ] Measure fake-paywall CTR in PostHog.
- [ ] Update tracker.

🤖 **Agent brief:**
```
Knovis repo. Read context files + graphify. Build a FAKE-DOOR paywall (no real payments yet):
- Add a "Go Pro" affordance at natural friction points — specifically when a user hits the free AI-grading cap (the QUIZ_AI_DAILY_LIMIT / per-section budget in src/app/api/quiz/route.ts) and when a locked expert track is tapped. Message: unlimited AI recall + all expert tracks + cross-device notes sync.
- Clicking it fires a PostHog `pro_intent_clicked` event (with a `source` property for WHERE it was clicked), then opens a small on-brand modal: "Pro is coming — want first access?" with the Week-3 waitlist email capture (tag these as `pro_interested`).
- Do NOT wire Stripe or gate anything for real this week — it's a signal test only. Keep the real free experience unchanged.
- Verify the event + modal in preview; tsc clean; graphify update; SESSION_LOG entry.
```

🧑 **Human-only tasks:** all interviews and synthesis. The paywall build is the only agent task.

🚦 **Exit gate:** 10 interviews done and synthesized; fake paywall live and logging clicks.

⚠️ **Watch-outs:** In interviews, if you catch yourself pitching, stop. You're listening for pain, not selling a cure. A polite "that sounds cool" is worthless; "when can I use this?" is gold.

---

## Week 5 — Validation readout + GO / NO-GO gate
**Phase:** B · **Type:** Human-heavy (decision week)

🎯 **Mission:** Make the honest call: is there enough signal to justify building a real revenue loop and launching? Or do you fix the core loop first?

📦 **Deliverables:**
- A one-page validation readout.
- A GO / FIX decision, in writing.
- A decision on the two-product tension (second-brain vs. expert-courses front door).

✅ **Checklist:**
- [ ] 🧑 Pull the numbers: activation %, Day-7 return %, 3-day-streak %, fake-paywall CTR, unprompted feature requests.
- [ ] 🧑 Answer honestly against the gate: **≥40% activation, ≥20% Day-7 return, ≥15% paywall CTR, ≥3 unprompted "when can I get X" messages.**
- [ ] 🧑 Decide the **two-product tension** from real behavior: did users ingest their own notes (product A) or binge the Pattern Atlas (product B)? Whichever they *did*, make it the front door.
- [ ] 🧑 Write the GO / FIX decision. If **FIX**: loop back — the highest-leverage fix is almost always retention (see Prompt #9), not more features. Re-run Weeks 3–4 with the fix.
- [ ] If **GO**: proceed to Phase C.

🤖 **Agent brief (optional — analytics help):**
```
Knovis repo. In PostHog (or by querying the event data), produce a validation readout: activation rate (landed → recall_graded), Day-2 and Day-7 return by cohort, 3-day-streak formation rate, pro_intent_clicked CTR and by-source breakdown, and a funnel drop-off chart. Also cross-tabulate: did users who returned on Day 7 primarily use their own ingested content or the expert story tracks? Output a short markdown summary I can paste into a decision doc. Read-only analysis — change no product code.
```

🚦 **Exit gate:** A written GO/FIX decision backed by numbers. If GO, you also know which product is the front door.

⚠️ **Watch-outs:** Don't rationalize a weak Day-7 number because the product is beautiful. Beauty doesn't retain — value does. A FIX decision here saves you from a hollow launch later.

---

# PHASE C — Finish the Monetizable Loop (Weeks 6–8)

## Week 6 — Wire real payments (Stripe + Pro tier)
**Phase:** C · **Type:** Build-heavy

🎯 **Mission:** Make revenue *possible*. You don't need it popular yet — you need the loop to close so paying is real.

📦 **Deliverables:**
- Stripe live with a working Free/Pro upgrade + a real (even $1) test transaction.
- Pro entitlements enforced server-side.

✅ **Checklist:**
- [ ] 🧑 Create the Stripe account + products/prices (monthly + annual; add a student discount later). Put keys in env yourself.
- [ ] Wire Stripe Checkout + webhook + a `subscriptions`/entitlement record (see Agent brief).
- [ ] Convert the Week-4 fake paywall into the **real** upgrade path.
- [ ] Define Pro entitlements: unlimited AI recall (lift `QUIZ_AI_DAILY_LIMIT`), all expert tracks, cross-device notes sync.
- [ ] 🧑 Do a real end-to-end test purchase (use a real card in test mode, then one live $1).
- [ ] Update tracker (MRR > $0 once anyone pays).

🤖 **Agent brief:**
```
Knovis repo (Next.js App Router, Supabase, Vercel). Read context files + graphify. Wire Stripe:
- Add Stripe Checkout (subscription mode) with a server route to create a checkout session, and a webhook route (/api/stripe/webhook) that verifies the signature and upserts an entitlement row into a new `subscriptions(user_id, status, plan, current_period_end, stripe_customer_id)` table with RLS (user reads own row only; writes happen server-side via webhook using the service role — keep the service key server-only, never in the client bundle, matching how this repo already avoids exposing secrets).
- Enforce Pro entitlements SERVER-SIDE, not just UI: gate the AI-grading budget (QUIZ_AI_DAILY_LIMIT / per-section base in src/app/api/quiz/route.ts) so Pro users are effectively uncapped, unlock locked expert tracks, and unlock cross-device notes sync IF that's built (else leave a clear TODO). Free tier keeps today's behavior exactly.
- Replace the fake-door "Go Pro" from last week with the real Checkout redirect; keep the PostHog `pro_intent_clicked` event and add `checkout_started` / `subscription_active`.
- All keys via env (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_...); add to .env.example with comments. NEVER hardcode or print secret values.
- Provide a schema file supabase/schema-subscriptions.sql for me to run (this repo applies schema manually).
- Verify the non-payment paths in preview; tsc clean; graphify update; SESSION_LOG entry. I will run the schema and do the live test purchase — give me an exact checklist for that.
```

🧑 **Human-only tasks:** Stripe account setup, entering keys, running the schema, the real test purchase. (Per the safety rules, I/agents don't enter financial credentials — you do.)

🚦 **Exit gate:** One real transaction has succeeded; Pro entitlements are enforced server-side; free tier is unchanged.

⚠️ **Watch-outs:** Entitlements enforced only in the UI are trivially bypassed — insist the agent gates server-side. Verify the webhook signature check is real. Deploy this one carefully (don't blind-auto-push payment code without verifying the webhook).

---

## Week 7 — Build the viral share artifact
**Phase:** C · **Type:** Build-heavy

🎯 **Mission:** Ship the one thing your competitors can't — a beautiful, shareable snapshot of a user's knowledge, so growth loops instead of costs.

📦 **Deliverables:**
- A shareable "my brain / my streak" image (OG card) with a share flow + attribution tracking.

✅ **Checklist:**
- [ ] Build a dynamic OG image: "I've learned N topics on Knovis" using the 3D-brain aesthetic, or a streak-milestone card (see Agent brief).
- [ ] Add share prompts at natural high-emotion moments: end of a recall session, streak milestones, "your brain grew."
- [ ] Track the loop: `share_clicked` → landing visit with `?ref=share` → signup. Compute a rough K-factor.
- [ ] 🧑 Test the share on X/LinkedIn/WhatsApp — does the card actually look great in the unfurl?
- [ ] Update tracker.

🤖 **Agent brief:**
```
Knovis repo (Next.js on Vercel). Read context files + graphify. Build a share loop:
- A dynamic Open Graph image route (Vercel OG / @vercel/og, ImageResponse) that renders an on-brand card: the user's topic count / a stylized mini "knowledge brain" motif and/or a streak-milestone ("14-day streak") card. Match the dark, organic Knovis aesthetic (Space Grotesk display, mesh-glow feel). Must render server-side as a real image for social unfurls.
- A share affordance surfaced at emotional peaks: recall-session completion (ReportCardView area) and streak milestones (ProgressMap milestone ladder). One-tap share to X / LinkedIn / WhatsApp / copy-link, with a `?ref=share&u=<opaque_id>` param (opaque, non-PII — do NOT put emails or personal data in URLs).
- Attribution: PostHog events `share_clicked` (with surface) and, on landing, detect `?ref=share` → `arrived_from_share`. Add a note in the readme of how to read K-factor from these.
- Verify the OG image renders (open the image URL in preview) and the share links open correctly; tsc clean; graphify update; SESSION_LOG entry. Respect privacy: nothing sensitive in the shared image or URL.
```

🧑 **Human-only tasks:** eyeballing the real social unfurl quality; deciding what stat feels brag-worthy enough to share.

🚦 **Exit gate:** A real share produces a great-looking card that links back and is attributable in analytics.

⚠️ **Watch-outs:** No personal data in the share URL or image (safety rule + it's tacky). If the card isn't genuinely *cool*, nobody shares it — this is a design bar, not a checkbox.

---

## Week 8 — Resolve the two-product tension + polish activation
**Phase:** C · **Type:** Mixed

🎯 **Mission:** Make the first run unmistakable. One front door (per your Week-5 decision), the other product revealed second. Then tune activation to hit ≥50%.

📦 **Deliverables:**
- A first-run experience with one clear primary path.
- Activation-rate improvements shipped from your replay observations.

✅ **Checklist:**
- [ ] Implement the front-door decision from Week 5 (likely: land users *inside the Pattern Atlas / interview prep*, reveal "add your own learning" second).
- [ ] Watch 10+ PostHog session replays; list the top 3 activation drop-off points.
- [ ] Fix those 3 drop-offs (see Agent brief).
- [ ] Confirm RAG is genuinely improving the experience (grounded recall referencing the user's own material) now that it's backfilled.
- [ ] Re-measure activation %; target ≥ 50%.
- [ ] Update tracker.

🤖 **Agent brief:**
```
Knovis repo. Read context files + graphify. Two tasks:

TASK 1 — Single front door. Based on my decision [PASTE: "lead with interview-prep / Pattern Atlas" OR "lead with second-brain ingest"], restructure the first-run so a new/guest user lands on the primary path immediately, with the secondary product introduced as a clear "and also" (not competing for attention on the first screen). Keep the guest/demo aha-before-signup flow. Don't delete the secondary product — just sequence it.

TASK 2 — Activation fixes. I'll give you the top 3 drop-off points I saw in session replays: [PASTE]. For each, propose and implement the smallest fix that removes the friction. Prefer copy/layout/one-tap-path changes over new features.

Verify the full cold-start → aha flow in preview and screenshot it; tsc clean; graphify update; SESSION_LOG entry.
```

🧑 **Human-only tasks:** watching replays and picking the 3 real drop-offs (judgment); the front-door decision (already made in Week 5).

🚦 **Exit gate:** First run has one obvious path; activation is measurably higher than Week 5.

⚠️ **Watch-outs:** "Reveal second" ≠ "hide/delete." You're sequencing, not amputating. Don't let polish sprawl — three fixes, measured, then stop.

---

# PHASE D — Launch (Weeks 9–12)

## Week 9 — Turn the Pattern Atlas into an SEO engine
**Phase:** D · **Type:** Build-heavy

🎯 **Mission:** Your 150 hand-written NeetCode essays aren't a content library — they're **150 front doors** to high-intent Google search. Optimize them like landing pages.

📦 **Deliverables:**
- Every Pattern Atlas / SQL / Macro page has proper title/meta/OG/structured data, internal linking, and is in a sitemap.
- A target keyword list for the top 10 opportunity pages.

✅ **Checklist:**
- [ ] 🧑 Keyword research (Prompt #6 + Ahrefs/Ubersuggest free): which "[DSA pattern] explained" / "Two Sum solution" queries can you realistically rank for? Pick top 10.
- [ ] Add per-page SEO metadata + structured data + OG images across the static blog series (see Agent brief).
- [ ] Ensure `sitemap.xml` + `robots.txt` are correct and every SSG page is discoverable.
- [ ] Add internal linking (chapter ↔ question ↔ related patterns) for crawl depth + session time.
- [ ] Add a soft in-content CTA on each essay: "Remember this pattern — add it to your recall deck."
- [ ] 🧑 Submit sitemap to Google Search Console; confirm indexing starts.

🤖 **Agent brief:**
```
Knovis repo (Next.js App Router, SSG blog series in src/lib/dsa, src/lib/sql, etc.; routes /blogs/*). Read context files + graphify. Make the static content series rank:
- Add Next.js Metadata (title, description, canonical, openGraph, twitter) generated per page for /blogs/dsa/[topic]/[slug], the chapter and hub pages, and the SQL/Macro series. Titles should target real search intent (e.g., "Two Sum — pattern, intuition & complexity | Knovis"). Keep it truthful to the content.
- Add JSON-LD structured data (Article / optionally LearningResource) per essay.
- Generate per-essay OG images (reuse the Week-7 @vercel/og setup).
- Add/verify app/sitemap.ts covering ALL SSG paths, and robots.ts. Confirm the whole series is in the sitemap.
- Strengthen internal linking: each question links to its chapter, prev/next (already exists), and 2–3 related problems; each chapter links related chapters. Good for crawl + dwell time.
- Add a subtle, on-brand in-content CTA at the end of each essay: "Add this to your recall deck" → the signup/aha path (NOT a popup that hurts UX).
- Verify metadata renders (view source / read_page) on 3 sample pages; run npm run build (all SSG pages must still build); tsc clean; graphify update; SESSION_LOG entry.
```

🧑 **Human-only tasks:** keyword research and Search Console submission (needs your Google account).

🚦 **Exit gate:** Every essay has real metadata + OG + is in the sitemap; Search Console is receiving it.

⚠️ **Watch-outs:** Don't keyword-stuff or write clickbait titles the content doesn't deliver — Google punishes it and it burns trust. This channel compounds for *years*; build it honestly.

---

## Week 10 — Build-in-public engine + launch assets
**Phase:** D · **Type:** Human-heavy (agent drafts)

🎯 **Mission:** Prep the narrative and assets so launch week is execution, not scramble. Start building an audience *before* you need it.

📦 **Deliverables:**
- A build-in-public posting cadence started on X/LinkedIn.
- Product Hunt + Show HN assets drafted and ready.
- An email capture + welcome sequence ready to catch the launch spike.

✅ **Checklist:**
- [ ] 🧑 Start posting build-in-public (3+ posts): the 3D brain demo, the forgetting-curve science, your solo-founder journey. Use Prompt #7's angle: "Anki, but beautiful, with AI that builds your review deck for you."
- [ ] 🧑 Draft the Product Hunt launch (tagline, description, gallery, founder's first comment) and the Show HN title/post.
- [ ] Wire an email tool (Resend/Loops/Beehiiv) + a simple welcome sequence ("the science of not forgetting") — reuse the Week-3 waitlist (see Agent brief).
- [ ] 🧑 Line up 10–20 people who'll upvote/comment in the first hour of the PH launch (friends, your first-20 Discord, communities).
- [ ] 🧑 Record a 30–60s demo video/GIF (the brain + a recall session).
- [ ] Update tracker (email list size).

🤖 **Agent brief:**
```
Knovis repo. Read context files + graphify. Task:
- Integrate a transactional/marketing email tool (Resend or Loops — pick one, keys via env, add to .env.example). On waitlist signup and on new-account creation, enroll the address into a welcome sequence. Provide the sequence content as editable templates (3 emails: welcome + the aha, the forgetting-curve science, "add your first topic" nudge). Add a PostHog `email_captured` event.
- Make sure double-opt-in / unsubscribe is handled (compliance) and NOTHING sends without my review — build it in "draft/paused" mode and give me a checklist to flip it live.
Verify the capture path in preview; tsc clean; graphify update; SESSION_LOG entry. Do not actually send bulk email — I approve and flip it live.
```

🧑 **Human-only tasks:** all posting, the PH/Show HN copy (your founder voice), lining up launch-day supporters, the demo video, and approving/sending any email.

🚦 **Exit gate:** Launch assets exist and are good; email capture works; you've started posting publicly.

⚠️ **Watch-outs:** ⚠️ **Per your safety rules, agents don't post to public platforms or send email on your behalf without your explicit go-ahead — those are your clicks.** Build in public *before* launch; an audience of zero on launch day is the #1 solo-founder mistake.

---

## Week 11 — Launch week
**Phase:** D · **Type:** Human-heavy

🎯 **Mission:** Concentrated distribution push. Product Hunt + Show HN + the communities where interview-preppers already live.

📦 **Deliverables:**
- A real launch across 3+ channels with the spike captured.

✅ **Checklist:**
- [ ] 🧑 Launch on Product Hunt (Tuesday–Thursday; be present all day to reply to every comment).
- [ ] 🧑 Post Show HN with the honest, technical angle (the AI recall + the beautiful spaced-repetition take).
- [ ] 🧑 Post genuinely useful threads in r/leetcode, r/cscareerquestions, prep Discords (*"I mapped all 150 NeetCode patterns into a memory system — free"*). Lead with value, not a pitch.
- [ ] 🧑 Go live on X/LinkedIn with the demo video; engage all day.
- [ ] Confirm analytics + share loop + email capture are catching the spike in real time (watch PostHog live).
- [ ] 🧑 Reply to *every* comment and signup DM within the hour. Launch-day responsiveness compounds.
- [ ] Update tracker (signups, activation of the new cohort).

🤖 **Agent brief (standby / support only):**
```
Knovis repo. LAUNCH DAY support mode. Do NOT post anything publicly (that's the founder's action). Your job:
- Monitor for breakage: watch preview_logs / PostHog error events / read_console_messages for runtime errors as traffic arrives, and hot-fix only genuine bugs (with tsc + preview verification before I deploy).
- Keep the funnel honest: confirm landed → recall_graded → signup events keep firing under load; flag any drop.
- If something is on fire, give me the smallest safe fix + a one-line explanation. Otherwise stay quiet.
```

🧑 **Human-only tasks:** literally all the launching. Agents keep the lights on; you run the show.

🚦 **Exit gate:** You launched on ≥3 channels and captured the traffic (analytics + email + share loop all firing).

⚠️ **Watch-outs:** Traffic you don't capture is traffic you paid for and lost — verify capture *before* the spike. Don't over-scope a launch-day "quick feature"; keep the product stable.

---

## Week 12 — Capture, measure, decide what's next
**Phase:** D · **Type:** Mixed (analysis)

🎯 **Mission:** Turn the launch spike into learning. Did the new cohort *retain*? That answer sets your entire next quarter.

📦 **Deliverables:**
- A post-launch readout (acquisition by channel, activation, and — the real test — Day-7 retention of the launch cohort).
- A prioritized "next 12 weeks" decision (Phase 5 / Scale entry, or another retention fix).

✅ **Checklist:**
- [ ] Pull channel attribution: which source (PH / HN / Reddit / X / SEO / share loop) drove signups *and* which drove *retained* users (not the same thing).
- [ ] Measure the launch cohort's activation % and Day-7 return %.
- [ ] Ship 1–2 retention mechanics from Prompt #9 (streak-recovery notification, win-back email) if Day-7 is soft.
- [ ] 🧑 Decide: is retention strong enough to pour fuel on (→ Phase 5: widen beachhead, expert-content supply engine, network effects)? Or is another retention loop the priority?
- [ ] 🧑 Write the next-quarter plan and update `TASKS.md` with the new active milestone.
- [ ] Fill the Week-12 column of the tracker; compare to targets.

🤖 **Agent brief:**
```
Knovis repo. Read context files + graphify. Two tasks:

TASK 1 — Post-launch analysis (read-only). From PostHog, produce a markdown readout: signups and activation by acquisition source (ref/UTM), the launch cohort's Day-2 and Day-7 return, share-loop K-factor, and which channel produced the best-RETAINING (not just most) users. Be honest about weak numbers.

TASK 2 — Retention mechanics (only if I approve). Implement 1–2 of: a streak-recovery nudge (email/notification when a streak is about to break), a win-back email for 7-day-inactive users, and a "your topics are due" re-engagement using the existing SM-2 due dates. Reuse the Week-10 email tool. Keep it non-spammy, unsubscribe-respecting, and paused-until-I-approve.
Verify; tsc clean; graphify update; SESSION_LOG + TASKS.md updated with the next milestone.
```

🧑 **Human-only tasks:** the strategic next-quarter decision; approving any lifecycle messaging.

🚦 **Exit gate:** You know your best-retaining channel and the launch cohort's Day-7 number, and you've written the next milestone into `TASKS.md`.

⚠️ **Watch-outs:** Vanity metrics (signups, upvotes) feel great and mean little. **The only launch result that matters is whether the new users came back.** Let that — not the applause — pick your next move.

---

## 📌 Standing rules for every week

- **Read `PROJECT_SUMMARY.md` + `SESSION_LOG.md` + `TASKS.md` before any agent touches code** (your session protocol). Use `graphify query` before grep.
- **After any code change:** `npx tsc --noEmit` → verify in the browser preview (demo mode works logged-out) → `graphify update .` → append a `SESSION_LOG.md` milestone.
- **Never let an agent hardcode secrets** (Stripe, PostHog, email, Gemini). Env only. You enter all credentials and run all Supabase schema/DB changes yourself.
- **Verify before you deploy payment/auth changes** — don't blind-push those.
- **Freeze the craftsmanship backlog** (Paper Mode token refactor, cross-encoder reranking, etc.) until you have revenue + retention signal. It's real work, just not *this-quarter* work.

---

## 🧭 One-line reminder

You already did the hard, rare part — you built something beautiful and real. The whole game from here is: **prove people want it, put a price on it, and make retention undeniable before you scale.** Point your craftsman's obsession at the Day-7 number.
```
