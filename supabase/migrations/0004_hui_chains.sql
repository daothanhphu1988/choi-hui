-- hui_chains: a "dây hụi"
create table hui_chains (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references profiles(id),
  type chain_type not null,
  share_value numeric(14, 2) not null check (share_value > 0),
  cycle cycle_type not null,
  start_date date not null,
  total_shares int not null check (total_shares > 0),
  bid_split_rule bid_split_rule not null default 'equal',
  status chain_status not null default 'draft',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table hui_chains enable row level security;
-- Policies for this table are defined in 0013_rls_policies.sql, since the
-- member-scoped select policy needs to reference chain_members (created later).
