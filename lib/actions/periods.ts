"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { MANAGER_ROLES, STAFF_ROLES } from "@/lib/auth/role-labels";
import { nextCycleDate } from "@/lib/utils/dates";
import type { CycleType } from "@/lib/supabase/types";

export async function openPeriod(chainId: string) {
  await requireRole(MANAGER_ROLES);
  const supabase = await createClient();

  const { data: chain, error: chainError } = await supabase
    .from("hui_chains")
    .select("*")
    .eq("id", chainId)
    .single();

  if (chainError || !chain) {
    throw new Error(chainError?.message ?? "Không tìm thấy dây hụi");
  }

  const { data: lastPeriod } = await supabase
    .from("periods")
    .select("*")
    .eq("chain_id", chainId)
    .order("period_no", { ascending: false })
    .limit(1)
    .maybeSingle();

  const periodNo = (lastPeriod?.period_no ?? 0) + 1;
  const openDate = lastPeriod ? lastPeriod.close_date : chain.start_date;
  const closeDate = nextCycleDate(new Date(openDate), chain.cycle as CycleType)
    .toISOString()
    .slice(0, 10);

  const { data: periodId, error } = await supabase.rpc("open_period", {
    p_chain_id: chainId,
    p_period_no: periodNo,
    p_open_date: openDate,
    p_close_date: closeDate,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/chains/${chainId}/periods`);
  revalidatePath(`/chains/${chainId}`);
  revalidatePath("/dashboard");
  revalidatePath("/", "layout");
  return periodId;
}

export async function submitBids(
  chainId: string,
  periodId: string,
  bids: { chainShareId: string; bidAmount: number }[],
) {
  const profile = await requireRole(STAFF_ROLES);
  const supabase = await createClient();

  const rows = bids.map((b) => ({
    period_id: periodId,
    chain_share_id: b.chainShareId,
    bid_amount: b.bidAmount,
  }));

  const { error } = await supabase
    .from("period_bids")
    .upsert(rows, { onConflict: "period_id,chain_share_id" });

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "period.bid",
    entity_type: "period",
    entity_id: periodId,
    metadata: { chain_id: chainId, count: bids.length },
  });

  revalidatePath(`/chains/${chainId}/periods/${periodId}`);
}

export async function closePeriodAction(
  chainId: string,
  periodId: string,
  winnerShareId: string,
  bidAmount?: number,
) {
  await requireRole(MANAGER_ROLES);
  const supabase = await createClient();

  const { error } = await supabase.rpc("close_period", {
    p_period_id: periodId,
    p_winner_share_id: winnerShareId,
    p_bid_amount: bidAmount ?? null,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/chains/${chainId}/periods`);
  revalidatePath(`/chains/${chainId}/periods/${periodId}`);
  revalidatePath(`/chains/${chainId}`);
  revalidatePath(`/chains/${chainId}/payments`);
  revalidatePath("/dashboard");
  revalidatePath("/", "layout");
}
