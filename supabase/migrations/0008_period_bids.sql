-- period_bids: auction bids, one per share per period (chain type = 'lai' only)
create table period_bids (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references periods(id) on delete cascade,
  chain_share_id uuid not null references chain_shares(id),
  bid_amount numeric(14, 2) not null check (bid_amount >= 0),
  created_at timestamptz not null default now(),
  unique (period_id, chain_share_id)
);

-- period_bid_distributions: audit trail of how the winning bid premium was split
create table period_bid_distributions (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references periods(id) on delete cascade,
  chain_share_id uuid not null references chain_shares(id),
  amount numeric(14, 2) not null,
  created_at timestamptz not null default now()
);

alter table period_bids enable row level security;
alter table period_bid_distributions enable row level security;
-- Policies defined in 0013_rls_policies.sql.
