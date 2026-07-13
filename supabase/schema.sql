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

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own entries" on public.entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own topics" on public.topics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own links" on public.topic_links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own entry_topics" on public.entry_topics
  for all using (
    exists (select 1 from public.entries e where e.id = entry_id and e.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.entries e where e.id = entry_id and e.user_id = auth.uid())
  );

create policy "own flashcards" on public.flashcards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own reviews" on public.reviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own plans" on public.daily_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helpful indexes
create index if not exists topics_user_next_review on public.topics (user_id, next_review_at);
create index if not exists reviews_user_created on public.reviews (user_id, created_at);
create index if not exists links_user on public.topic_links (user_id);
