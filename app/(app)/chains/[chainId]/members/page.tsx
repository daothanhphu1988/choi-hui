import { createClient } from "@/lib/supabase/server";
import {
  ChainMembersView,
  type ChainMemberRow,
} from "@/components/chains/chain-members-view";

export default async function ChainMembersPage({
  params,
}: {
  params: Promise<{ chainId: string }>;
}) {
  const { chainId } = await params;
  const supabase = await createClient();

  const [{ data: chainMembers }, { data: allMembers }, { data: shares }] =
    await Promise.all([
      supabase
        .from("chain_members")
        .select("*")
        .eq("chain_id", chainId)
        .order("joined_at"),
      supabase.from("members").select("*").order("full_name"),
      supabase.from("chain_shares").select("*").eq("chain_id", chainId),
    ]);

  const membersById = new Map((allMembers ?? []).map((m) => [m.id, m]));
  const sharesList = shares ?? [];

  const rows: ChainMemberRow[] = (chainMembers ?? []).map((cm) => {
    const member = membersById.get(cm.member_id);
    const memberShares = sharesList.filter((s) => s.chain_member_id === cm.id);
    return {
      chainMemberId: cm.id,
      memberId: cm.member_id,
      fullName: member?.full_name ?? "—",
      phone: member?.phone ?? null,
      shareCount: memberShares.length,
      sharesWon: memberShares.filter((s) => s.won_period_id).length,
    };
  });

  const memberIdsInChain = new Set((chainMembers ?? []).map((cm) => cm.member_id));
  const availableMembers = (allMembers ?? []).filter(
    (m) => !memberIdsInChain.has(m.id),
  );

  return (
    <ChainMembersView
      chainId={chainId}
      rows={rows}
      availableMembers={availableMembers}
    />
  );
}
