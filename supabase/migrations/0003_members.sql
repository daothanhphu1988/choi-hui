-- members: the "con hụi" person registry, independent of any specific chain
create table members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  address text,
  note text,
  status member_status not null default 'active',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index members_search_idx on members using gin (
  to_tsvector('simple', coalesce(full_name, '') || ' ' || coalesce(phone, ''))
);

alter table profiles
  add constraint profiles_member_id_fkey
  foreign key (member_id) references members(id) on delete set null;

alter table members enable row level security;

create policy members_select on members for select
  to authenticated
  using (
    current_role_name() in ('chu_hui', 'pho_chu_hui', 'ke_toan')
    or id = my_member_id()
  );

create policy members_insert on members for insert
  to authenticated
  with check (current_role_name() in ('chu_hui', 'pho_chu_hui'));

create policy members_update on members for update
  to authenticated
  using (current_role_name() in ('chu_hui', 'pho_chu_hui'))
  with check (current_role_name() in ('chu_hui', 'pho_chu_hui'));

create policy members_delete on members for delete
  to authenticated
  using (current_role_name() in ('chu_hui', 'pho_chu_hui'));
