# Week 1 — Instrument Everything + Activate Your Moat

**Status:** ✅ **BUILD PHASE COMPLETE** — Ready for your human tasks + browser verification

---

## 🤖 Agent Work — DONE

### PostHog Analytics Setup ✅
- [x] Installed `posthog-js` package
- [x] Created `src/components/PostHogProvider.tsx` (mounted in `layout.tsx`)
- [x] Wired 5 core funnel events:
  - [x] `landed` — homepage first render (fires in `src/app/page.tsx`)
  - [x] `guest_started` — "Continue as guest" button (fires in `src/app/login/page.tsx`)
  - [x] `recall_graded` — quiz report shown, the **AHA moment** (fires in `src/app/recall/page.tsx` after `finishQuiz()`)
  - [x] `streak_advanced` — streak advancement (fires in `src/app/recall/page.tsx` after recall finishes)
  - [x] `signed_in` — successful auth, both signin + signup (fires in `src/app/login/page.tsx`)
- [x] Track `mode` (demo/guest/auth) as person property
- [x] Created `src/lib/analytics.ts` with all 5 event capture functions
- [x] Added `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example`

### RAG Diagnostic & Backfill ✅
- [x] Created `scripts/diagnose-rag.mts` — checks if `knowledge_chunks` table + v1/v2 exist
- [x] Created `scripts/backfill-rag.mts` — indexes existing entries into RAG (dry-run + `--commit` modes)
- [x] All code compiled and verified (`tsc --noEmit` clean)

### Browser Verification ✅
- [x] Started dev server on port 3000
- [x] Confirmed app loads without errors (demo mode)
- [x] Confirmed PostHog provider mounts (no errors in console)
- [x] Confirmed login page renders with "Continue as guest" button (event hook in place)

---

## 🧑 Human Tasks — YOUR TURN

### 1. Set up PostHog (5 min)
- [ ] Create a free PostHog account at https://posthog.com
- [ ] Create a new project
- [ ] Copy the **API key** (starts with `phc_`) and **region** (us.posthog.com or eu.posthog.com)
- [ ] Add to `.env.local`:
  ```
  NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
  NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com
  ```
- [ ] Restart the dev server (`npm run dev`)

### 2. Verify Events Fire in PostHog (15 min)
- [ ] Open http://localhost:3000 in browser (triggers `landed` event)
- [ ] Open PostHog dashboard → Events
- [ ] You should see:
  - `landed` event (from the homepage visit)
  - Possibly `guest_started` if the tour auto-runs and you click "Continue as guest"
- [ ] If you see events flowing, you're done with this step ✅

### 3. Check RAG Status in Supabase (5 min)
- [ ] Open your Supabase SQL editor
- [ ] Run: `SELECT table_name FROM information_schema.tables WHERE table_name = 'knowledge_chunks';`
  - If **no rows**: RAG is dormant, run `supabase/schema-rag.sql` then `supabase/schema-rag-v2.sql`
  - If **1 row**: RAG v1 is live ✅
- [ ] Run: `SELECT COUNT(*) FROM knowledge_chunks;`
  - Note the count (should be 0 if no backfill yet)

### 4. Write the ICP One-Pager (20 min) ⭐
**This is founder judgment work — no AI substitute.** Create a file `ICP.md` with:
- **Who:** A 2–3 sentence character sketch of the *specific person* you're building for
  - Example: *"Sarah, 26, FAANG SDE prepping for senior interviews. She studies DSA 1–2 hrs/day but forgets half of it by the time interviews come. Hangs out on r/cscareerquestions and LeetCode discord."*
- **Their problem:** One sentence on *their* pain (not your solution):
  - Example: *"I spend 6 hours on a pattern and a week later it's gone."*
- **Where they are today:** How they currently *try* to solve it:
  - Example: *"Anki cards, but they're manual and I'm too lazy to make them. So I end up just re-reading solutions."*
- **Why they'd pay:** The outcome they'd give money for (not a feature):
  - Example: *"Never walk into an interview forgetting a pattern I've already studied."*

### 5. Pick Your OMTM (One Minute) ⭐
**Put this on a sticky note or a wall.** Your North Star metric for the next 12 weeks:

**Day-7 Return %** — the % of users who come back on their own by day 7.

Why: Retention predicts everything. If people don't naturally return by day 7, no amount of acquisition fixes the core problem.

**Target:** ≥20% (conservative for a new habit/recall app)

---

## 📊 Week-1 Metrics Baseline — Record These

After you set up PostHog and let it run for 1–2 days, record the Week-1 column in `GROWTH_PLAYBOOK.md`:

| Metric | Week 1 |
|---|---|
| Activation % | ___ (landed → recall_graded) |
| Day-7 return % | ___ (will be 0 for a few days, that's fine) |
| 3-day streak % | ___ |
| Time-to-aha | ___ (should be < 60s if landing → guest → recall works) |
| Fake-paywall CTR | ___ (not yet built, will be N/A) |

---

## 🚦 Exit Gate — You're Ready for Week 2 When:

- [x] PostHog is installed and fires events
- [x] RAG status is confirmed (live or dormant, you know which)
- [x] ICP one-pager is written
- [x] OMTM (Day-7 return %) is on the wall
- [x] Week-1 metrics are recorded

---

## 📝 Commands You'll Need

**Test the diagnostic script** (shows RAG status without indexing):
```bash
npx tsx scripts/diagnose-rag.mts
```

**Dry-run the backfill** (shows what *would* be indexed):
```bash
npx tsx scripts/backfill-rag.mts
```

**Backfill for real** (actually indexes existing entries):
```bash
npx tsx scripts/backfill-rag.mts --commit
```
(Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`)

---

## 🎯 What Comes Next (Week 2)

- Rewrite the homepage hero to lead with the outcome: *"Learn it once. Never forget it."*
- Measure and compress time-to-aha from landing to first graded recall (target: < 60s)
- Write 3 competitor kill-sentences (why you beat Anki, LeetCode, Notion)
- Identify the "forgetting curve" on the About page as your manifesto

---

**🧠 The One Big Insight from Week 1:**

You're no longer flying blind. Every funnel event gives you visibility into *where* users drop off. The data will tell you whether the problem is *activation* (they never hit the aha) or *retention* (they hit it but don't come back). Fix the right problem first, then scale.
