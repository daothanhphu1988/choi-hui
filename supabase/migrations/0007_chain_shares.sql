-- chain_shares: one row PER SHARE ("phần hụi") — the atomic unit that wins
-- exactly once. A member can hold multiple shares in the same chain.
create table chain_shares (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references hui_chains(id) on delete cascade,
  chain_member_id uuid not null references chain_members(id) on delete cascade,
  share_no int not null check (share_no > 0),
  won_period_id uuid references periods(id),
  won_amount numeric(14, 2),
  created_at timestamptz not null default now(),
  unique (chain_member_id, share_no)
);

-- Fast lookup of shares still eligible to win (used by the lottery draw and
-- auction bidding flows every period).
create index chain_shares_open_idx on chain_shares (chain_id) where won_period_id is null;

alter table chain_shares enable row level security;
-- Policies defined in 0013_rls_policies.sql. Writes to won_period_id/won_amount
-- only ever happen through the close_period() function (0012_functions.sql).
