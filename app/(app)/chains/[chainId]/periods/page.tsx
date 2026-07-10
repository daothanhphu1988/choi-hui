import { createClient } from "@/lib/supabase/server";
import { PeriodsView } from "@/components/periods/periods-view";

export default async function ChainPeriodsPage({
  params,
}: {
  params: Promise<{ chainId: string }>;
}) {
  const { chainId } = await params;
  const supabase = await createClient();

  const [{ data: chain }, { data: periods }, { data: wonShares }] =
    await Promise.all([
      supabase.from("hui_chains").select("*").eq("id", chainId).single(),
      supabase
        .from("periods")
        .select("*")
        .eq("chain_id", chainId)
        .order("period_no"),
      supabase
        .from("chain_shares")
        .select("*")
        .eq("chain_id", chainId)
        .not("won_period_id", "is", null),
    ]);

  const wonSharesList = wonShares ?? [];
  const chainMemberIds = Array.from(
    new Set(wonSharesList.map((s) => s.chain_member_id)),
  );
  const { data: chainMembers } = chainMemberIds.length
    ? await supabase.from("chain_members").select("*").in("id", chainMemberIds)
    : { data: [] };
  const memberIds = Array.from(
    new Set((chainMembers ?? []).map((cm) => cm.member_id)),
  );
  const { data: members } = memberIds.length
    ? await supabase.from("members").select("*").in("id", memberIds)
    : { data: [] };

  const memberById = new Map((members ?? []).map((m) => [m.id, m]));
  const chainMemberById = new Map(
    (chainMembers ?? []).map((cm) => [cm.id, cm]),
  );

  const winners: Record<string, { name: string; amount: number | null }> = {};
  for (const share of wonSharesList) {
    if (!share.won_period_id) continue;
    const chainMember = chainMemberById.get(share.chain_member_id);
    const member = chainMember ? memberById.get(chainMember.member_id) : undefined;
    winners[share.won_period_id] = {
      name: member?.full_name ?? "—",
      amount: share.won_amount,
    };
  }

  return (
    <PeriodsView
      chainId={chainId}
      chainStatus={chain?.status ?? "draft"}
      periods={periods ?? []}
      winners={winners}
    />
  );
}
