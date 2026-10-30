create table if not exists public.user_library (
  user_id uuid not null references auth.users(id) on delete cascade,
  title_id text not null,
  status text not null check (
    status in (
      'plan_to_watch',
      'watching',
      'completed',
      'on_hold',
      'dropped',
      'plan_to_read',
      'reading'
    )
  ),
  favorite boolean not null default false,
  user_rating smallint not null default 0 check (user_rating between 0 and 10),
  progress integer not null default 0 check (progress >= 0),
  total_progress integer not null default 0 check (total_progress >= 0),
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, title_id)
);

alter table public.user_library enable row level security;

create policy "Users can read their own library"
  on public.user_library
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add to their own library"
  on public.user_library
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own library"
  on public.user_library
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete from their own library"
  on public.user_library
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists user_library_user_updated_idx
  on public.user_library (user_id, updated_at desc);

create index if not exists user_library_user_favorite_idx
  on public.user_library (user_id, favorite)
  where favorite = true;
