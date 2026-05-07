create extension if not exists pgcrypto;

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  category text not null default 'Focus',
  done jsonb not null default '[false, false, false, false, false, false, false]'::jsonb,
  streak int not null default 0,
  impact int not null default 70,
  created_at timestamptz not null default now()
);

create index if not exists habits_user_id_created_at_idx
  on public.habits (user_id, created_at desc);
