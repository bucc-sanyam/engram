# 🧠 Knovis — your second brain

Log what you learn (AI conversations, reading notes), see it as a living knowledge graph,
and let Gemini quiz you with spaced repetition before you forget it.

## Features

- **Paste & extract** — paste any AI conversation or notes; Gemini extracts topics, summaries,
  key points, flashcards, and connections to what you already know.
- **The Brain** — a force-directed graph of every topic, colour-coded by category, sized by
  connections, with a mastery ring around each node. Search, filter by category, click for details.
- **Daily revision plan** — a fresh plan every day mixing due topics (SM-2 spaced repetition),
  recent learnings, and weak spots. Gemini writes a headline and a "today's connection" insight
  linking the day's topics together.
- **Three quiz modes** — deep-recall questions graded by AI (0–5), Anki-style flashcards, and
  quick-fire questions. Scores drive the spaced-repetition schedule.
- **Progress map** — XP, levels (Spark → Luminary), daily streaks, and a GitHub-style
  activity heatmap.
- **Demo mode** — runs with rich sample data when no keys are configured, so you can try it
  instantly.
- Fully responsive: detailed desktop layout, bottom-tab mobile layout.

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. (Optional) Enable the Google provider under **Authentication → Providers** for
   "Continue with Google".
4. Copy your **Project URL** and **anon key** from **Settings → API**.

### 2. Gemini

Get an API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### 3. Environment

```bash
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GEMINI_API_KEY
```

### 4. Run

```bash
npm install
npm run dev
```

Without env keys the app boots in **demo mode** with sample data (a yellow "demo" badge shows
in the header).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it on [vercel.com](https://vercel.com/new).
3. Add the three environment variables from `.env.local` in the Vercel project settings.
4. In Supabase, add your Vercel URL to **Authentication → URL Configuration → Redirect URLs**
   (`https://your-app.vercel.app/auth/callback`).

## Architecture

- **Next.js 16 (App Router)** — pages are client components talking to a small data layer
  ([`src/lib/data.ts`](src/lib/data.ts)) that switches between demo data and Supabase.
- **Supabase** — Postgres with row-level security (all tables scoped to `auth.uid()`), plus auth.
- **Gemini** (`gemini-2.5-flash` by default) does four jobs, all server-side
  ([`src/lib/gemini.ts`](src/lib/gemini.ts)): knowledge extraction, plan narratives,
  question generation, and answer grading.
- **SM-2 spaced repetition** ([`src/lib/srs.ts`](src/lib/srs.ts)) — each review reschedules the
  topic; failed recalls come back tomorrow, easy ones stretch out exponentially.
- Daily plans are generated once per day and cached in the `daily_plans` table.

## Roadmap ideas

- Weekly email digest ("what you'd be forgetting this week") via Supabase Edge Functions
- Import from ChatGPT/Claude export files
- Topic decay visualisation (nodes dim as memories fade)
- Shareable public brain snapshots
- Embeddings (pgvector) for semantic search and smarter deduplication
