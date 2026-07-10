"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { MANAGER_ROLES } from "@/lib/auth/role-labels";
import {
  memberFormSchema,
  type MemberFormValues,
} from "@/lib/validations/member.schema";

export async function createMember(values: MemberFormValues) {
  const profile = await requireRole(MANAGER_ROLES);
  const parsed = memberFormSchema.parse(values);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("members")
    .insert(parsed)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "member.create",
    entity_type: "member",
    entity_id: data.id,
    metadata: { full_name: parsed.full_name },
  });

  revalidatePath("/members");
  return data.id as string;
}

export async function updateMember(memberId: string, values: MemberFormValues) {
  const profile = await requireRole(MANAGER_ROLES);
  const parsed = memberFormSchema.parse(values);
  const supabase = await createClient();

  const { error } = await supabase
    .from("members")
    .update(parsed)
    .eq("id", memberId);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "member.update",
    entity_type: "member",
    entity_id: memberId,
  });

  revalidatePath("/members");
  revalidatePath(`/members/${memberId}`);
}

export async function deleteMember(memberId: string) {
  const profile = await requireRole(MANAGER_ROLES);
  const supabase = await createClient();

  const { error } = await supabase.from("members").delete().eq("id", memberId);
  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "member.delete",
    entity_type: "member",
    entity_id: memberId,
  });

  revalidatePath("/members");
}
