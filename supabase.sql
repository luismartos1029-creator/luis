create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  title text,
  category text,
  done json,
  streak int,
  impact int,
  created_at timestamp default now()
);
