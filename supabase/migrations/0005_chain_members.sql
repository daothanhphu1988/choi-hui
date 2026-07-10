-- chain_members: a member's participation in one chain (1 row per member per chain)
create table chain_members (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references hui_chains(id) on delete cascade,
  member_id uuid not null references members(id),
  joined_at timestamptz not null default now(),
  note text,
  unique (chain_id, member_id)
);

alter table chain_members enable row level security;
-- Policies defined in 0013_rls_policies.sql.
