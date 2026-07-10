-- Enumerated types used across the schema
create type user_role as enum ('chu_hui', 'pho_chu_hui', 'ke_toan', 'thanh_vien');
create type chain_type as enum ('lai', 'khong_lai');
create type cycle_type as enum ('weekly', 'biweekly', 'monthly');
create type chain_status as enum ('draft', 'active', 'completed', 'cancelled');
create type period_status as enum ('pending', 'open', 'closed');
create type payment_status as enum ('unpaid', 'partial', 'paid');
create type bid_split_rule as enum ('equal');
create type member_status as enum ('active', 'inactive');
create type notification_type as enum (
  'payment_due',
  'chain_opening',
  'overdue',
  'confirmation',
  'period_closed',
  'payment_recorded'
);
