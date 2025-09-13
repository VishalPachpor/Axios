-- Supabase schema for waitlist_entries (covers avatars, seeds, and styles)
-- Run this in the Supabase SQL Editor (or psql) once per project

-- Enable pgcrypto for gen_random_uuid if not already enabled
create extension if not exists pgcrypto;

-- Table
create table if not exists waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id integer not null unique,
  name varchar(255) not null,
  wallet_address varchar(42) not null unique,
  avatar text not null,
  avatar_type varchar(12) not null,
  -- Twitter identity for uniqueness constraints
  twitter_user_id varchar(40) null,
  twitter_username varchar(50) null,
  avatar_seed text null,
  avatar_style varchar(50) null default 'adventurer',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint waitlist_entries_avatar_type_check check (avatar_type in ('upload','avatar_seed'))
);

-- Indexes
create index if not exists idx_waitlist_profile_id on waitlist_entries(profile_id);
create index if not exists idx_waitlist_wallet on waitlist_entries(wallet_address);
create index if not exists idx_waitlist_created on waitlist_entries(created_at);
-- Unique twitter id when present (keeps existing rows compatible)
create unique index if not exists uniq_waitlist_twitter_user_id
  on waitlist_entries (twitter_user_id)
  where twitter_user_id is not null;

-- RLS and basic open policies (adjust for your app's needs)
alter table waitlist_entries enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'waitlist_entries' and policyname = 'Allow public read access'
  ) then
    create policy "Allow public read access" on waitlist_entries for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'waitlist_entries' and policyname = 'Allow public insert'
  ) then
    create policy "Allow public insert" on waitlist_entries for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'waitlist_entries' and policyname = 'Allow public update'
  ) then
    create policy "Allow public update" on waitlist_entries for update using (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'waitlist_entries' and policyname = 'Allow public delete'
  ) then
    create policy "Allow public delete" on waitlist_entries for delete using (true);
  end if;
end $$;

-- updated_at trigger
create or replace function update_updated_at_column() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_waitlist_entries_updated_at on waitlist_entries;
create trigger update_waitlist_entries_updated_at
  before update on waitlist_entries
  for each row execute function update_updated_at_column();


