# OMTM — One Metric That Matters

## **Day-7 Return %**

The percentage of users who come back on their own by day 7, without any prompts or emails.

---

## Why This Metric

**Everything else is downstream of retention.**

- If Day-7 return is weak: launching bigger/faster just burns users (leaky bucket gets more expensive, not cheaper).
- If Day-7 return is strong: acquisition becomes pure math (CAC < LTV is a solved problem).

For a **habit/memory app** like Knovis, Day-7 return is the truth-telling number:
- It measures whether the core loop (learn → quiz → streak) is *actually* addictive
- It shows whether the promise ("you'll remember this") is being kept
- It's immune to marketing hype (it's authentic behavior, not a signup/vanity metric)

---

## Target

**≥ 20%** by the end of Week 5 (validation gate).

Why 20%? Habit apps typically range 5–15%. We're targeting 20% because:
- Knovis has a *structural advantage* (SM-2 spaced rep is proven to create habits)
- We're starting with interview-preppers (high-intent, high-motivation audience)
- The 3D brain + streak gamification + AI auto-generated quizzes are *retention mechanics*, not just UI polish

---

## How We Track It

PostHog funnel:
- **Cohort:** all users created in a 7-day period
- **Event 1:** signed up or visited as guest (the "day 0" baseline)
- **Event 2:** returned and triggered ANY event (recall, ingest, brain visit) on day 7, 8, 9, 10 (7 days later, ±2 days for time zones)
- **Metric:** (users with event 2) / (users with event 1) = Day-7 return %

If real mode + guest mode track separately, we're most interested in **real-mode Day-7 return** (signed-in users), since they're the ones who'd pay. Guest mode shows whether the value prop is compelling enough for a cold visitor to come back even without an account.

---

## What We'll Do If Day-7 is Weak (<15%)

**We do NOT launch.** We fix the core loop first:

1. Watch PostHog session replays → where do users drop off?
2. Run retention experiments:
   - Streak notifications (gentle push at 6 PM)
   - Win-back email (day 5: "your topics are due")
   - Easier aha (compress time-to-first-recall to <30s)
3. Re-measure. If still weak, consider whether the wedge (interview prep) is actually painful enough.

---

## What We'll Do If Day-7 is Strong (≥20%)

**We launch.** Week 6–8: wire Stripe, ship share loop, measure LTV. Week 9–12: go to market.

---

## The Wall Copy

Print this and stick it somewhere you see it every day:

```
DAY-7 RETURN: _______%

TARGET: ≥ 20%

IF WEAK: FIX THE LOOP FIRST
IF STRONG: LAUNCH WITH CONFIDENCE
```

Update it weekly based on PostHog data.
