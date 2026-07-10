-- notifications: in-app notifications (payment due, chain opening, overdue,
-- confirmations, period closed, payment recorded). profile_id null = broadcast.
create table notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  type notification_type not null,
  title text not null,
  body text,
  chain_id uuid references hui_chains(id),
  period_id uuid references periods(id),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- activity_log: audit trail — who did what, when
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table notifications enable row level security;
alter table activity_log enable row level security;
-- Policies defined in 0013_rls_policies.sql.
