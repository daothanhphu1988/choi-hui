-- open_period: generates the payments due-rows for a new round. Every share
-- in the chain owes a full share_value each period, whether or not it has
-- already won (winners keep paying until the chain ends).
create or replace function open_period(
  p_chain_id uuid,
  p_period_no int,
  p_open_date date,
  p_close_date date
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role user_role := current_role_name();
  v_chain hui_chains%rowtype;
  v_period_id uuid;
  v_share record;
begin
  if v_role is null or v_role not in ('chu_hui', 'pho_chu_hui') then
    raise exception 'Không có quyền mở kỳ hụi';
  end if;

  select * into v_chain from hui_chains where id = p_chain_id;
  if not found then
    raise exception 'Không tìm thấy dây hụi';
  end if;

  insert into periods (chain_id, period_no, open_date, close_date, status, total_fund)
  values (
    p_chain_id, p_period_no, p_open_date, p_close_date, 'open',
    v_chain.share_value * v_chain.total_shares
  )
  returning id into v_period_id;

  for v_share in
    select cs.id from chain_shares cs where cs.chain_id = p_chain_id
  loop
    insert into payments (period_id, chain_share_id, amount_due, due_date)
    values (v_period_id, v_share.id, v_chain.share_value, p_close_date);
  end loop;

  update hui_chains set status = 'active', updated_at = now()
  where id = p_chain_id and status = 'draft';

  insert into activity_log (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(), 'period.open', 'period', v_period_id,
    jsonb_build_object('chain_id', p_chain_id, 'period_no', p_period_no)
  );

  insert into notifications (type, title, body, chain_id, period_id)
  values (
    'chain_opening', 'Kỳ hụi mới đã mở',
    format('Dây hụi "%s" đã mở kỳ %s', v_chain.name, p_period_no),
    p_chain_id, v_period_id
  );

  return v_period_id;
end;
$$;

-- close_period: the single atomic write for recording a winner. Marks the
-- winning share, computes/distributes the bid premium (auction chains),
-- closes the period, logs the action, and completes the chain once every
-- share has won exactly once. This is the ONLY way chain_shares.won_period_id
-- and periods.status get mutated — always call via supabase.rpc().
create or replace function close_period(
  p_period_id uuid,
  p_winner_share_id uuid,
  p_bid_amount numeric default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role user_role := current_role_name();
  v_period periods%rowtype;
  v_chain hui_chains%rowtype;
  v_winner_amount numeric(14, 2);
  v_eligible_count int;
  v_share_amount numeric(14, 2);
  v_share record;
  v_total_shares int;
  v_won_shares int;
begin
  if v_role is null or v_role not in ('chu_hui', 'pho_chu_hui') then
    raise exception 'Không có quyền đóng kỳ hụi';
  end if;

  select * into v_period from periods where id = p_period_id;
  if not found then
    raise exception 'Không tìm thấy kỳ hụi';
  end if;
  if v_period.status = 'closed' then
    raise exception 'Kỳ hụi đã đóng';
  end if;

  select * into v_chain from hui_chains where id = v_period.chain_id;

  if exists (
    select 1 from chain_shares where id = p_winner_share_id and won_period_id is not null
  ) then
    raise exception 'Phần hụi này đã hốt rồi';
  end if;

  if v_chain.type = 'lai' then
    if p_bid_amount is null then
      raise exception 'Cần nhập tiền bỏ hụi cho hụi có lãi';
    end if;
    v_winner_amount := v_period.total_fund - p_bid_amount;

    select count(*) into v_eligible_count
    from chain_shares
    where chain_id = v_chain.id and won_period_id is null and id <> p_winner_share_id;

    if v_eligible_count > 0 then
      v_share_amount := round(p_bid_amount / v_eligible_count, 2);
      for v_share in
        select id from chain_shares
        where chain_id = v_chain.id and won_period_id is null and id <> p_winner_share_id
      loop
        insert into period_bid_distributions (period_id, chain_share_id, amount)
        values (p_period_id, v_share.id, v_share_amount);
      end loop;
    end if;
  else
    v_winner_amount := v_period.total_fund;
  end if;

  update periods
  set status = 'closed', winning_bid_amount = p_bid_amount, closed_by = auth.uid(), closed_at = now()
  where id = p_period_id;

  update chain_shares
  set won_period_id = p_period_id, won_amount = v_winner_amount
  where id = p_winner_share_id;

  insert into activity_log (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(), 'period.close', 'period', p_period_id,
    jsonb_build_object(
      'chain_id', v_chain.id, 'winner_share_id', p_winner_share_id,
      'winner_amount', v_winner_amount, 'bid_amount', p_bid_amount
    )
  );

  insert into notifications (type, title, body, chain_id, period_id)
  values (
    'period_closed', 'Kỳ hụi đã đóng',
    format('Dây hụi "%s" kỳ %s đã có người hốt', v_chain.name, v_period.period_no),
    v_chain.id, p_period_id
  );

  select total_shares into v_total_shares from hui_chains where id = v_chain.id;
  select count(*) into v_won_shares from chain_shares where chain_id = v_chain.id and won_period_id is not null;

  if v_won_shares >= v_total_shares then
    update hui_chains set status = 'completed', updated_at = now() where id = v_chain.id;
  end if;
end;
$$;

grant execute on function open_period(uuid, int, date, date) to authenticated;
grant execute on function close_period(uuid, uuid, numeric) to authenticated;
