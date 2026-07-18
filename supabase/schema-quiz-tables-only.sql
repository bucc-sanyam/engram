-- Run this in Supabase SQL Editor if you get "policy already exists" errors.
-- This creates ONLY the new quiz tables needed for the redesign.

-- ============ questions (pre-generated question bank, filled at ingest) ============
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  kind text not null default 'open',           -- 'open' | 'quickfire' | 'mcq' | 'truefalse' | 'multi'
  prompt text not null,
  options jsonb,                               -- choice kinds: array of option strings
  correct_index integer,                       -- mcq / truefalse: index into options
  correct_indices jsonb,                       -- multi: array of correct option indices
  model_answer text not null,
  difficulty text not null default 'basic',    -- 'basic' | 'intermediate' | 'advanced'
  times_asked integer not null default 0,
  last_asked_at timestamptz,
  created_at timestamptz not null default now()
);
-- migration for databases created before multi-select questions existed
alter table public.questions add column if not exists correct_indices jsonb;

-- ============ facts (pre-generated "fact of the day" pool, filled at ingest) ============
create table if not exists public.facts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  fact text not null,
  created_at timestamptz not null default now()
);

-- ============ quiz_sessions (one row per review session; report filled on finish) ============
create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  status text not null default 'active',       -- 'active' | 'graded'
  items jsonb not null,                        -- server-side question snapshot (incl. answers)
  report jsonb,                                -- ReportCard, set when graded
  created_at timestamptz not null default now(),
  graded_at timestamptz,
  ai_graded boolean not null default false     -- true iff gradeSession() (real Gemini call) ran, not the heuristic fallback
);
-- migration for databases created before the per-day AI-grading cap existed
alter table public.quiz_sessions add column if not exists ai_graded boolean not null default false;
create index if not exists quiz_sessions_ai_graded_idx on public.quiz_sessions (user_id, graded_at) where ai_graded;

-- ============ quiz_answers (each answer saved as it is submitted) ============
create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.quiz_sessions on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  question_index integer not null,             -- index into quiz_sessions.items
  topic_id uuid not null references public.topics on delete cascade,
  answer text,                                 -- typed answer ('' = skipped)
  selected_index integer,                      -- mcq choice
  created_at timestamptz not null default now(),
  unique (session_id, question_index)
);

-- ============ Enable RLS ============
alter table public.questions enable row level security;
alter table public.facts enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quiz_answers enable row level security;

-- ============ Create RLS Policies ============
-- Questions
drop policy if exists "own questions" on public.questions;
create policy "own questions" on public.questions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Facts
drop policy if exists "own facts" on public.facts;
create policy "own facts" on public.facts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Quiz sessions
drop policy if exists "own quiz_sessions" on public.quiz_sessions;
create policy "own quiz_sessions" on public.quiz_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Quiz answers
drop policy if exists "own quiz_answers" on public.quiz_answers;
create policy "own quiz_answers" on public.quiz_answers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ Indexes ============
create index if not exists questions_user_topic on public.questions (user_id, topic_id);
create index if not exists facts_user on public.facts (user_id);
create index if not exists quiz_answers_session on public.quiz_answers (session_id);
