-- Nolio: accounts, ebooks, comments and the job queue of the AI engine.
-- Run once on a new Supabase project (SQL editor, or `npm run db:setup`).

-- Profiles: one per account, created with the account
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  role text,
  role_other text not null default '',
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  brand jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Ebooks: the draft of the creation flow (status 'draft') and the created ebooks.
-- `dossier` holds every answer of the flow, updated as the user goes.
create table if not exists public.ebooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  status text not null default 'draft'
    check (status in ('draft', 'queued', 'working', 'ready', 'failed')),
  lang text not null default 'fr',
  dossier jsonb not null default '{}'::jsonb,
  content jsonb,
  progress jsonb not null default '{"step": 0, "ratio": 0}'::jsonb,
  files jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ready_at timestamptz
);

create index if not exists ebooks_user_idx on public.ebooks (user_id, created_at desc);

-- Comments left on a finished ebook, and what the AI did with them
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  ebook_id uuid not null references public.ebooks on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  page int not null,
  part text,
  text text not null,
  status text not null default 'pending'
    check (status in ('pending', 'applying', 'applied', 'question')),
  reply text,
  created_at timestamptz not null default now(),
  applied_at timestamptz
);

create index if not exists comments_ebook_idx on public.comments (ebook_id, created_at);

-- Jobs run by the worker: 'create' an ebook, 'fixes' to apply comments
create table if not exists public.jobs (
  id bigserial primary key,
  kind text not null check (kind in ('create', 'fixes')),
  ebook_id uuid not null references public.ebooks on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'running', 'done', 'failed')),
  attempts int not null default 0,
  run_after timestamptz not null default now(),
  locked_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists jobs_queue_idx on public.jobs (status, run_after, id);

-- Hands the next job to one worker only, even with several running.
-- A job left 'running' for 15 minutes (a crashed worker) is taken again.
create or replace function public.claim_job() returns setof public.jobs
language sql as $$
  update public.jobs
  set status = 'running', locked_at = now(), attempts = attempts + 1
  where id = (
    select id from public.jobs
    where (status = 'queued' and run_after <= now())
       or (status = 'running' and locked_at < now() - interval '15 minutes')
    order by id
    for update skip locked
    limit 1
  )
  returning *;
$$;

-- Row level security: each account sees only its own rows. The API and the
-- worker use the secret key and check ownership themselves.
alter table public.profiles enable row level security;
alter table public.ebooks enable row level security;
alter table public.comments enable row level security;
alter table public.jobs enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own ebooks" on public.ebooks;
create policy "own ebooks" on public.ebooks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own comments" on public.comments;
create policy "own comments" on public.comments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage: imported and generated images (public, unguessable paths) and
-- exported files (private, served through signed links)
insert into storage.buckets (id, name, public)
values ('images', 'images', true), ('exports', 'exports', false)
on conflict (id) do nothing;
