-- Synapse — knowledge graph + spaced repetition schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).

-- ============ profiles ============
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  xp integer not null default 0,
  streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active date,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============ entries (pasted conversations / notes / article links) ============
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text,
  raw_text text not null,
  summary text,
  source_url text, -- set when the entry was ingested from a blog/article link
  created_at timestamptz not null default now()
);
-- migration for databases created before source_url existed
alter table public.entries add column if not exists source_url text;

-- ============ topics (nodes of the brain) ============
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  category text not null default 'General',
  summary text,
  key_points jsonb not null default '[]'::jsonb,
  mastery integer not null default 0,          -- 0..100
  review_count integer not null default 0,
  ease real not null default 2.5,              -- SM-2 ease factor
  interval_days real not null default 0,       -- SM-2 interval
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- ============ topic_links (edges of the brain) ============
create table if not exists public.topic_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  source uuid not null references public.topics on delete cascade,
  target uuid not null references public.topics on delete cascade,
  reason text,
  strength real not null default 1,
  unique (user_id, source, target)
);

-- ============ entry_topics ============
create table if not exists public.entry_topics (
  entry_id uuid not null references public.entries on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  primary key (entry_id, topic_id)
);

-- ============ flashcards ============
create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

-- ============ reviews (history for progress tracking) ============
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  mode text not null,           -- 'recall' | 'flashcard' | 'quickfire'
  score integer not null,       -- 0..5
  question text,
  answer text,
  feedback text,
  created_at timestamptz not null default now()
);

-- ============ questions (pre-generated question bank, filled at ingest) ============
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  topic_id uuid not null references public.topics on delete cascade,
  kind text not null default 'open',           -- 'open' | 'quickfire' | 'mcq'
  prompt text not null,
  options jsonb,                               -- mcq only: array of 4 option strings
  correct_index integer,                       -- mcq only: index into options
  model_answer text not null,
  difficulty text not null default 'basic',    -- 'basic' | 'intermediate' | 'advanced'
  times_asked integer not null default 0,
  last_asked_at timestamptz,
  created_at timestamptz not null default now()
);

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
  graded_at timestamptz
);

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

-- ============ daily_plans (one AI-generated plan per day) ============
create table if not exists public.daily_plans (
  user_id uuid not null references auth.users on delete cascade,
  plan_date date not null,
  plan jsonb not null,
  completed boolean not null default false,
  primary key (user_id, plan_date)
);

-- ============ Row Level Security ============
alter table public.profiles enable row level security;
alter table public.entries enable row level security;
alter table public.topics enable row level security;
alter table public.topic_links enable row level security;
alter table public.entry_topics enable row level security;
alter table public.flashcards enable row level security;
alter table public.reviews enable row level security;
alter table public.daily_plans enable row level security;
alter table public.questions enable row level security;
alter table public.facts enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quiz_answers enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own entries" on public.entries;
create policy "own entries" on public.entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own topics" on public.topics;
create policy "own topics" on public.topics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own links" on public.topic_links;
create policy "own links" on public.topic_links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own entry_topics" on public.entry_topics;
create policy "own entry_topics" on public.entry_topics
  for all using (
    exists (select 1 from public.entries e where e.id = entry_id and e.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.entries e where e.id = entry_id and e.user_id = auth.uid())
  );

drop policy if exists "own flashcards" on public.flashcards;
create policy "own flashcards" on public.flashcards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own reviews" on public.reviews;
create policy "own reviews" on public.reviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own plans" on public.daily_plans;
create policy "own plans" on public.daily_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own questions" on public.questions;
create policy "own questions" on public.questions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own facts" on public.facts;
create policy "own facts" on public.facts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own quiz_sessions" on public.quiz_sessions;
create policy "own quiz_sessions" on public.quiz_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own quiz_answers" on public.quiz_answers;
create policy "own quiz_answers" on public.quiz_answers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helpful indexes
create index if not exists topics_user_next_review on public.topics (user_id, next_review_at);
create index if not exists reviews_user_created on public.reviews (user_id, created_at);
create index if not exists links_user on public.topic_links (user_id);
create index if not exists questions_user_topic on public.questions (user_id, topic_id);
create index if not exists facts_user on public.facts (user_id);
create index if not exists quiz_answers_session on public.quiz_answers (session_id);
