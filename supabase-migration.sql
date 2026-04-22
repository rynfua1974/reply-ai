-- Supabase SQL Editor に貼り付けて実行してください
-- waitlistテーブル（メール登録）

create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamptz default now() not null
);

-- RLS（Row Level Security）を有効化
alter table public.waitlist enable row level security;

-- サービスロールキーからのみ書き込み可能（フロントから直接書けないように）
create policy "Service role can insert" on public.waitlist
  for insert with check (true);

-- 読み取りはサービスロールのみ
create policy "Service role can select" on public.waitlist
  for select using (true);
