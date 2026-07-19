-- Knovis — Learnable Stories
-- Bridges the pre-installed static blog series (src/lib/competition-act, etc.)
-- to the per-user learning loop. Starting/completing a "Story" seeds ordinary
-- topics/questions/facts rows (done client-side in data.ts); these two tables
-- only track story membership + the user's chosen brain color and per-section
-- learned state. Run this in the Supabase SQL editor. Safe to re-run.

-- ============ user_stories (which series a user started + brain color) ============
create table if not exists public.user_stories (
  user_id uuid not null references auth.users on delete cascade,
  series_slug text not null,                 -- 'competition-act'
  color text not null default '#5ba4cf',     -- chosen accent for this story's brain nodes
  started_at timestamptz not null default now(),
  primary key (user_id, series_slug)
);

-- ============ story_sections (each seeded section → its topic + learned state) ============
create table if not exists public.story_sections (
  user_id uuid not null references auth.users on delete cascade,
  series_slug text not null,
  chapter_slug text not null,
  section_slug text not null,
  topic_id uuid not null references public.topics on delete cascade,
  status text not null default 'started',    -- 'started' | 'learned'
  learned_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, series_slug, section_slug)
);

-- ============ Row Level Security ============
alter table public.user_stories enable row level security;
alter table public.story_sections enable row level security;

drop policy if exists "own user_stories" on public.user_stories;
create policy "own user_stories" on public.user_stories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own story_sections" on public.story_sections;
create policy "own story_sections" on public.story_sections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helpful indexes
create index if not exists user_stories_user on public.user_stories (user_id);
create index if not exists story_sections_user_series on public.story_sections (user_id, series_slug);
create index if not exists story_sections_topic on public.story_sections (topic_id);
