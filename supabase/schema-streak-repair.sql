-- Streak repair (premium) — run in the Supabase SQL editor. Safe to re-run.
-- Lets a premium user maintain a broken streak by attempting an older day's
-- recall: completing that recall "covers" the missed day so the streak chain
-- isn't lost. See src/app/api/streak/repair/route.ts.

-- 1. Premium flag on profiles (forward-compatible with a future Stripe webhook,
--    which would flip this via the service role). Defaults false = free tier.
alter table public.profiles
  add column if not exists is_premium boolean not null default false;

-- 1a. Make the flag tamper-resistant. RLS is row-level, so without this a user
--     could self-grant premium by updating their OWN profile row from the
--     browser. This trigger silently reverts any is_premium change that doesn't
--     come from the service role (i.e. a trusted backend / Stripe webhook), so
--     the paywall actually holds. The rest of the profile row stays editable.
create or replace function public.guard_is_premium()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.is_premium is distinct from old.is_premium
     and coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    new.is_premium := old.is_premium;
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_guard_is_premium on public.profiles;
create trigger profiles_guard_is_premium
  before update on public.profiles
  for each row execute function public.guard_is_premium();

-- 2. Audit + rate-limit ledger: one row per missed day a user has bought back.
--    `covered_day` is the user's LOCAL calendar day (YYYY-MM-DD). The unique
--    constraint makes a day un-repairable twice; session_id ties the repair to
--    the recall session that earned it.
create table if not exists public.streak_repairs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  covered_day date not null,
  session_id uuid references public.quiz_sessions on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, covered_day)
);

create index if not exists streak_repairs_user_created_idx
  on public.streak_repairs (user_id, created_at desc);

alter table public.streak_repairs enable row level security;

-- RLS: users only ever see/write their own repair rows (auth.uid() = user_id).
drop policy if exists "own streak_repairs select" on public.streak_repairs;
create policy "own streak_repairs select" on public.streak_repairs
  for select using (auth.uid() = user_id);

drop policy if exists "own streak_repairs insert" on public.streak_repairs;
create policy "own streak_repairs insert" on public.streak_repairs
  for insert with check (auth.uid() = user_id);

drop policy if exists "own streak_repairs delete" on public.streak_repairs;
create policy "own streak_repairs delete" on public.streak_repairs
  for delete using (auth.uid() = user_id);
