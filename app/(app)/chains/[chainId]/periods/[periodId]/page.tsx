import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PeriodDetailView,
  type DistributionRow,
  type EligibleShare,
  type WinnerInfo,
} from "@/components/periods/period-detail-view";

export default async function PeriodDetailPage({
  params,
}: {
  params: Promise<{ chainId: string; periodId: string }>;
}) {
  const { chainId, periodId } = await params;
  const supabase = await createClient();

  const [{ data: chain }, { data: period }] = await Promise.all([
    supabase.from("hui_chains").select("*").eq("id", chainId).single(),
    supabase.from("periods").select("*").eq("id", periodId).single(),
  ]);

  if (!chain || !period) notFound();

  const [
    { data: shares },
    { data: chainMembers },
    { data: members },
    { data: bids },
    { data: distributions },
  ] = await Promise.all([
    supabase.from("chain_shares").select("*").eq("chain_id", chainId),
    supabase.from("chain_members").select("*").eq("chain_id", chainId),
    supabase.from("members").select("*"),
    supabase.from("period_bids").select("*").eq("period_id", periodId),
    supabase
      .from("period_bid_distributions")
      .select("*")
      .eq("period_id", periodId),
  ]);

  const sharesList = shares ?? [];
  const memberById = new Map((members ?? []).map((m) => [m.id, m]));
  const chainMemberById = new Map(
    (chainMembers ?? []).map((cm) => [cm.id, cm]),
  );

  function shareDisplayName(chainMemberId: string) {
    const chainMember = chainMemberById.get(chainMemberId);
    const member = chainMember ? memberById.get(chainMember.member_id) : undefined;
    return member?.full_name ?? "—";
  }

  const eligibleShares: EligibleShare[] = sharesList
    .filter((s) => !s.won_period_id)
    .map((s) => ({
      id: s.id,
      chainMemberId: s.chain_member_id,
      shareNo: s.share_no,
      name: shareDisplayName(s.chain_member_id),
      bidAmount:
        (bids ?? []).find((b) => b.chain_share_id === s.id)?.bid_amount ?? null,
    }));

  const winnerShare = sharesList.find((s) => s.won_period_id === periodId);
  const winnerInfo: WinnerInfo | null = winnerShare
    ? {
        name: shareDisplayName(winnerShare.chain_member_id),
        shareNo: winnerShare.share_no,
        amount: winnerShare.won_amount,
      }
    : null;

  const distributionRows: DistributionRow[] = (distributions ?? []).map((d) => {
    const share = sharesList.find((s) => s.id === d.chain_share_id);
    return {
      name: share ? shareDisplayName(share.chain_member_id) : "—",
      amount: d.amount,
    };
  });

  return (
    <PeriodDetailView
      chainId={chainId}
      chain={chain}
      period={period}
      eligibleShares={eligibleShares}
      winnerInfo={winnerInfo}
      distributionRows={distributionRows}
    />
  );
}
