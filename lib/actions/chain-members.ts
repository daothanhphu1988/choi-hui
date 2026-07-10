"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { MANAGER_ROLES } from "@/lib/auth/role-labels";

export async function addMemberToChain(
  chainId: string,
  memberId: string,
  shareCount: number,
) {
  const profile = await requireRole(MANAGER_ROLES);
  const supabase = await createClient();

  const { data: chainMember, error } = await supabase
    .from("chain_members")
    .insert({ chain_id: chainId, member_id: memberId })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const shareRows = Array.from({ length: shareCount }, (_, i) => ({
    chain_id: chainId,
    chain_member_id: chainMember.id,
    share_no: i + 1,
  }));

  const { error: sharesError } = await supabase
    .from("chain_shares")
    .insert(shareRows);

  if (sharesError) throw new Error(sharesError.message);

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "chain_member.add",
    entity_type: "chain_member",
    entity_id: chainMember.id,
    metadata: { chain_id: chainId, member_id: memberId, share_count: shareCount },
  });

  revalidatePath(`/chains/${chainId}/members`);
  revalidatePath(`/chains/${chainId}`);
}

export async function updateMemberShareCount(
  chainId: string,
  chainMemberId: string,
  newShareCount: number,
) {
  const profile = await requireRole(MANAGER_ROLES);
  const supabase = await createClient();

  const { data: existingShares, error: fetchError } = await supabase
    .from("chain_shares")
    .select("id, share_no, won_period_id")
    .eq("chain_member_id", chainMemberId)
    .order("share_no");

  if (fetchError) throw new Error(fetchError.message);

  const current = existingShares ?? [];
  const currentCount = current.length;

  if (newShareCount > currentCount) {
    const newRows = Array.from(
      { length: newShareCount - currentCount },
      (_, i) => ({
        chain_id: chainId,
        chain_member_id: chainMemberId,
        share_no: currentCount + i + 1,
      }),
    );
    const { error } = await supabase.from("chain_shares").insert(newRows);
    if (error) throw new Error(error.message);
  } else if (newShareCount < currentCount) {
    const unwon = current.filter((s) => !s.won_period_id);
    const toRemoveCount = currentCount - newShareCount;
    if (unwon.length < toRemoveCount) {
      throw new Error("Không thể giảm số phần vì đã có phần hụi được hốt");
    }
    const idsToRemove = unwon.slice(0, toRemoveCount).map((s) => s.id);
    const { error } = await supabase
      .from("chain_shares")
      .delete()
      .in("id", idsToRemove);
    if (error) throw new Error(error.message);
  }

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "chain_member.update_shares",
    entity_type: "chain_member",
    entity_id: chainMemberId,
    metadata: { chain_id: chainId, new_share_count: newShareCount },
  });

  revalidatePath(`/chains/${chainId}/members`);
  revalidatePath(`/chains/${chainId}`);
}

export async function removeMemberFromChain(
  chainId: string,
  chainMemberId: string,
) {
  const profile = await requireRole(MANAGER_ROLES);
  const supabase = await createClient();

  const { count } = await supabase
    .from("chain_shares")
    .select("id", { count: "exact", head: true })
    .eq("chain_member_id", chainMemberId)
    .not("won_period_id", "is", null);

  if ((count ?? 0) > 0) {
    throw new Error("Không thể xóa vì thành viên đã hốt hụi trong dây này");
  }

  const { error } = await supabase
    .from("chain_members")
    .delete()
    .eq("id", chainMemberId);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "chain_member.remove",
    entity_type: "chain_member",
    entity_id: chainMemberId,
    metadata: { chain_id: chainId },
  });

  revalidatePath(`/chains/${chainId}/members`);
  revalidatePath(`/chains/${chainId}`);
}
