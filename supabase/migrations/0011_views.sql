-- Per-member contribution/debt/win status within a chain
create view v_member_debt
with (security_invoker = true) as
select
  cm.chain_id,
  cm.member_id,
  m.full_name,
  count(cs.id) as total_shares,
  count(cs.won_period_id) as shares_won,
  coalesce(sum(p.amount_due), 0) as total_due,
  coalesce(sum(p.amount_paid), 0) as total_paid,
  coalesce(sum(p.amount_due - p.amount_paid), 0) as total_owed
from chain_members cm
join members m on m.id = cm.member_id
join chain_shares cs on cs.chain_member_id = cm.id
left join payments p on p.chain_share_id = cs.id
group by cm.chain_id, cm.member_id, m.full_name;

-- Per-chain dashboard aggregates
create view v_chain_dashboard
with (security_invoker = true) as
select
  hc.id as chain_id,
  hc.name,
  hc.status,
  hc.type,
  hc.cycle,
  hc.share_value,
  hc.start_date,
  hc.total_shares,
  count(distinct cm.member_id) as member_count,
  hc.total_shares * hc.share_value as total_fund_value,
  count(cs.won_period_id) as shares_won,
  hc.total_shares - count(cs.won_period_id) as shares_remaining
from hui_chains hc
left join chain_members cm on cm.chain_id = hc.id
left join chain_shares cs on cs.chain_member_id = cm.id
group by hc.id;
