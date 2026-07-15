-- RAG v2: document registry, content-hash dedup, alias-based index versioning,
-- hybrid (vector + keyword) search, and observability.
-- Requires schema-rag.sql to already be applied. Safe to re-run.

-- ============ rag_documents (registry: one row per indexed entry/answer) ============
create table if not exists public.rag_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_id uuid references public.entries(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  source text not null default 'entry' check (source in ('entry', 'answer')),
  content_hash text not null,
  char_count integer not null default 0,
  chunk_count integer not null default 0,
  status text not null default 'active' check (status in ('active', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rag_documents_user_idx on public.rag_documents (user_id);
create index if not exists rag_documents_entry_idx on public.rag_documents (entry_id);
create index if not exists rag_documents_hash_idx on public.rag_documents (user_id, content_hash);

-- Cross-entry resubmission guard, 'entry' documents only — an identical
-- *answer* string across two different questions is legitimate; an identical
-- *entry* resubmission is the duplicate-ingest bug this registry fixes.
-- Partial on status='active' so a soft-deleted document's hash can be reused.
create unique index if not exists rag_documents_entry_hash_uidx
  on public.rag_documents (user_id, content_hash)
  where source = 'entry' and status = 'active';

alter table public.rag_documents enable row level security;
drop policy if exists "own rag_documents" on public.rag_documents;
create policy "own rag_documents" on public.rag_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ knowledge_chunks alters: registry link, index version, keyword search ============
alter table public.knowledge_chunks add column if not exists document_id uuid references public.rag_documents(id) on delete cascade;
create index if not exists knowledge_chunks_document_idx on public.knowledge_chunks (document_id);

-- Every existing row backfills to version 1 via this default; a user with no
-- rag_index_pointers row is implicitly "on version 1" everywhere below.
alter table public.knowledge_chunks add column if not exists index_version integer not null default 1;
create index if not exists knowledge_chunks_version_idx on public.knowledge_chunks (user_id, index_version);

alter table public.knowledge_chunks add column if not exists content_tsv tsvector
  generated always as (to_tsvector('english', content)) stored;
create index if not exists knowledge_chunks_tsv_idx on public.knowledge_chunks using gin (content_tsv);

-- ============ rag_index_pointers (per-user "alias" — which index_version is live) ============
create table if not exists public.rag_index_pointers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active_version integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.rag_index_pointers enable row level security;
drop policy if exists "own rag_index_pointers" on public.rag_index_pointers;
create policy "own rag_index_pointers" on public.rag_index_pointers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ rag_retrieval_logs (chunk-level attribution per retrieval request) ============
create table if not exists public.rag_retrieval_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_context text not null default 'ingest_grounding',
  query_text text,
  index_version integer,
  mode text not null default 'hybrid' check (mode in ('hybrid', 'vector_only')),
  match_count integer not null default 0,
  chunks jsonb not null default '[]'::jsonb,
  entry_id uuid references public.entries(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists rag_retrieval_logs_user_idx on public.rag_retrieval_logs (user_id, created_at desc);
create index if not exists rag_retrieval_logs_entry_idx on public.rag_retrieval_logs (entry_id);

alter table public.rag_retrieval_logs enable row level security;
drop policy if exists "own rag_retrieval_logs" on public.rag_retrieval_logs;
create policy "own rag_retrieval_logs" on public.rag_retrieval_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ match_knowledge_chunks (vector-only, now version-aware) ============
-- Kept working in place (same name/signature) so a DB that hasn't picked up
-- the new hybrid function yet still gets correct, version-scoped results.
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
    and c.index_version = coalesce((select p.active_version from public.rag_index_pointers p where p.user_id = auth.uid()), 1)
    and c.embedding is not null
    and 1 - (c.embedding <=> query_embedding) > min_similarity
  order by c.embedding <=> query_embedding
  limit greatest(1, least(match_count, 20));
$$;

-- ============ match_knowledge_chunks_hybrid (vector + keyword, RRF-fused) ============
-- Postgres has no built-in BM25; tsvector/ts_rank_cd is the standard stand-in
-- for the keyword side. The grounding "query" here is often a ~2000-char
-- excerpt, not a short search phrase, so plainto_tsquery/websearch_to_tsquery
-- (which AND every term) would almost never match — instead we OR the
-- query's distinct lexemes together, letting the keyword side catch
-- exact-term/jargon hits the vector side might miss.
create or replace function public.match_knowledge_chunks_hybrid(
  query_embedding vector(768),
  query_text text,
  match_count int default 6,
  min_similarity float default 0.25,
  rrf_k int default 60
)
returns table (
  id uuid,
  entry_id uuid,
  topic_id uuid,
  source text,
  content text,
  similarity float,
  keyword_rank float,
  score float
)
language sql stable
as $$
  with active as (
    select coalesce((select p.active_version from public.rag_index_pointers p where p.user_id = auth.uid()), 1) as v
  ),
  query_lexemes as (
    select to_tsquery('english', string_agg(distinct lex, ' | ')) as q
    from unnest(tsvector_to_array(to_tsvector('english', coalesce(query_text, '')))) as lex
  ),
  vector_matches as (
    select c.id, 1 - (c.embedding <=> query_embedding) as similarity,
           row_number() over (order by c.embedding <=> query_embedding) as rnk
    from public.knowledge_chunks c, active
    where c.user_id = auth.uid()
      and c.index_version = active.v
      and c.embedding is not null
      and 1 - (c.embedding <=> query_embedding) > min_similarity
    order by c.embedding <=> query_embedding
    limit 40
  ),
  keyword_matches as (
    select c.id, ts_rank_cd(c.content_tsv, ql.q) as kw_rank,
           row_number() over (order by ts_rank_cd(c.content_tsv, ql.q) desc) as rnk
    from public.knowledge_chunks c, active, query_lexemes ql
    where c.user_id = auth.uid()
      and c.index_version = active.v
      and ql.q is not null
      and c.content_tsv @@ ql.q
    order by kw_rank desc
    limit 40
  ),
  fused as (
    select
      coalesce(v.id, k.id) as id,
      coalesce(v.similarity, 0) as similarity,
      coalesce(k.kw_rank, 0) as keyword_rank,
      (1.0 / (rrf_k + coalesce(v.rnk, 1000000))) + (1.0 / (rrf_k + coalesce(k.rnk, 1000000))) as score
    from vector_matches v
    full outer join keyword_matches k on k.id = v.id
  )
  select c.id, c.entry_id, c.topic_id, c.source, c.content, f.similarity, f.keyword_rank, f.score
  from fused f
  join public.knowledge_chunks c on c.id = f.id
  order by f.score desc
  limit greatest(1, least(match_count, 20));
$$;

-- ============ rag_index_version_correlation (observability: version <-> downstream quiz score) ============
-- Best-effort CORRELATION only, not a causal regression detector: retrieval
-- quality at ingest-grounding time is several steps removed from a quiz
-- score (extraction quality -> question quality -> the user's own recall,
-- confounded by how well they actually know the material). Use as a lead to
-- investigate, not as proof a given index version caused a quality change.
create or replace function public.rag_index_version_correlation(days int default 90)
returns table (
  index_version integer,
  retrievals bigint,
  entries_grounded bigint,
  avg_top_similarity float,
  linked_reviews bigint,
  avg_quiz_score_pct float
)
language sql stable
as $$
  with logs as (
    select
      l.index_version,
      l.entry_id,
      (select max((c->>'similarity')::float) from jsonb_array_elements(l.chunks) c) as top_similarity
    from public.rag_retrieval_logs l
    where l.user_id = auth.uid()
      and l.request_context = 'ingest_grounding'
      and l.entry_id is not null
      and l.created_at >= now() - (days || ' days')::interval
  ),
  grounded_topics as (
    select distinct l.index_version, et.topic_id
    from logs l
    join public.entry_topics et on et.entry_id = l.entry_id
  ),
  topic_reviews as (
    select gt.index_version, r.score
    from grounded_topics gt
    join public.reviews r on r.topic_id = gt.topic_id and r.user_id = auth.uid()
    where r.created_at >= now() - (days || ' days')::interval
  )
  select
    l.index_version,
    count(*) as retrievals,
    count(distinct l.entry_id) as entries_grounded,
    avg(l.top_similarity) as avg_top_similarity,
    (select count(*) from topic_reviews tr where tr.index_version = l.index_version) as linked_reviews,
    (select avg(tr.score) * 20 from topic_reviews tr where tr.index_version = l.index_version) as avg_quiz_score_pct
  from logs l
  group by l.index_version
  order by l.index_version;
$$;
