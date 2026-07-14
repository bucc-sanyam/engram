-- RAG layer: chunked + embedded user knowledge (entries and quiz answers).
-- Run this once in the Supabase SQL editor (safe to re-run).
--
-- Everything the user ingests is chunked, embedded with Gemini
-- (gemini-embedding-001, 768 dims) and stored here. Retrieval grounds all
-- AI generation in the user's OWN content instead of the model's knowledge.

create extension if not exists vector;

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_id uuid references public.entries(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  source text not null default 'entry' check (source in ('entry', 'answer')),
  content text not null,
  embedding vector(768),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_chunks_user_idx on public.knowledge_chunks (user_id);
create index if not exists knowledge_chunks_entry_idx on public.knowledge_chunks (entry_id);
-- HNSW cosine index — fine at this scale, no training step needed.
create index if not exists knowledge_chunks_embedding_idx
  on public.knowledge_chunks using hnsw (embedding vector_cosine_ops);

alter table public.knowledge_chunks enable row level security;

drop policy if exists "own knowledge_chunks" on public.knowledge_chunks;
create policy "own knowledge_chunks" on public.knowledge_chunks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Similarity search scoped to the calling user (RLS also applies).
create or replace function public.match_knowledge_chunks(
  query_embedding vector(768),
  match_count int default 6,
  min_similarity float default 0.25
)
returns table (
  id uuid,
  entry_id uuid,
  topic_id uuid,
  source text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    c.id,
    c.entry_id,
    c.topic_id,
    c.source,
    c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks c
  where c.user_id = auth.uid()
    and c.embedding is not null
    and 1 - (c.embedding <=> query_embedding) > min_similarity
  order by c.embedding <=> query_embedding
  limit greatest(1, least(match_count, 20));
$$;
