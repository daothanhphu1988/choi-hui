-- profiles: extends auth.users, single source of truth for role
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  role user_role not null default 'thanh_vien',
  member_id uuid, -- fk added in 0003_members.sql once the members table exists
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Reads the caller's role, bypassing RLS (security definer) so policies on
-- other tables can call it without recursing back into profiles' own RLS.
create or replace function current_role_name()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid()
$$;

-- Reads the caller's linked member_id (for thanh_vien-scoped policies).
create or replace function my_member_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select member_id from profiles where id = auth.uid()
$$;

-- Auto-create a profile row whenever a new auth user is provisioned, so the
-- app never has an authenticated session without a matching profile.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email, 'Người dùng mới'),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'thanh_vien')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create policy profiles_select on profiles for select
  to authenticated using (true);

create policy profiles_update on profiles for update
  to authenticated
  using (id = auth.uid() or current_role_name() = 'chu_hui')
  with check (id = auth.uid() or current_role_name() = 'chu_hui');
