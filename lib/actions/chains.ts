"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { MANAGER_ROLES } from "@/lib/auth/role-labels";
import { chainFormSchema, type ChainFormValues } from "@/lib/validations/chain.schema";

export async function createChain(values: ChainFormValues) {
  const profile = await requireRole(MANAGER_ROLES);
  const parsed = chainFormSchema.parse(values);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hui_chains")
    .insert({ ...parsed, owner_id: profile.id })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "chain.create",
    entity_type: "hui_chain",
    entity_id: data.id,
    metadata: { name: parsed.name },
  });

  revalidatePath("/chains");
  redirect(`/chains/${data.id}`);
}

export async function updateChain(chainId: string, values: ChainFormValues) {
  const profile = await requireRole(MANAGER_ROLES);
  const parsed = chainFormSchema.parse(values);
  const supabase = await createClient();

  const { error } = await supabase
    .from("hui_chains")
    .update(parsed)
    .eq("id", chainId);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "chain.update",
    entity_type: "hui_chain",
    entity_id: chainId,
  });

  revalidatePath(`/chains/${chainId}`);
  revalidatePath("/chains");
  redirect(`/chains/${chainId}`);
}

export async function deleteChain(chainId: string) {
  const profile = await requireRole(MANAGER_ROLES);
  const supabase = await createClient();

  const { error } = await supabase.from("hui_chains").delete().eq("id", chainId);
  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "chain.delete",
    entity_type: "hui_chain",
    entity_id: chainId,
  });

  revalidatePath("/chains");
}
