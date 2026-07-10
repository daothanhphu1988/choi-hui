-- payments: one summary/due row per share per period (fast to aggregate)
create table payments (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references periods(id) on delete cascade,
  chain_share_id uuid not null references chain_shares(id),
  amount_due numeric(14, 2) not null,
  amount_paid numeric(14, 2) not null default 0,
  status payment_status generated always as (
    case
      when amount_paid >= amount_due then 'paid'::payment_status
      when amount_paid > 0 then 'partial'::payment_status
      else 'unpaid'::payment_status
    end
  ) stored,
  due_date date not null,
  updated_at timestamptz not null default now(),
  unique (period_id, chain_share_id)
);

-- payment_records: append-only transaction ledger (supports partial payments,
-- receipts, and an audit trail independent of the summary row above)
create table payment_records (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references payments(id) on delete cascade,
  amount numeric(14, 2) not null check (amount > 0),
  paid_at timestamptz not null default now(),
  method text,
  receipt_url text,
  recorded_by uuid not null references profiles(id),
  note text,
  created_at timestamptz not null default now()
);

-- Keeps payments.amount_paid in sync with the ledger so the app never
-- computes "amount owed" by summing payment_records ad hoc.
create or replace function sync_payment_amount_paid()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_payment_id uuid := coalesce(new.payment_id, old.payment_id);
begin
  update payments
  set amount_paid = (
        select coalesce(sum(amount), 0) from payment_records where payment_id = target_payment_id
      ),
      updated_at = now()
  where id = target_payment_id;
  return coalesce(new, old);
end;
$$;

create trigger on_payment_record_change
  after insert or delete on payment_records
  for each row execute function sync_payment_amount_paid();

alter table payments enable row level security;
alter table payment_records enable row level security;
-- Policies defined in 0013_rls_policies.sql.
