-- periods: "kỳ hụi" — one round of a chain
create table periods (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references hui_chains(id) on delete cascade,
  period_no int not null check (period_no > 0),
  open_date date not null,
  close_date date not null,
  status period_status not null default 'pending',
  total_fund numeric(14, 2),
  winning_bid_amount numeric(14, 2),
  note text,
  closed_by uuid references profiles(id),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (chain_id, period_no)
);

alter table periods enable row level security;
-- Policies defined in 0013_rls_policies.sql.
