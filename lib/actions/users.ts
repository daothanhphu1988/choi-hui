"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/supabase/types";

export async function inviteUser(values: {
  email: string;
  fullName: string;
  role: UserRole;
}) {
  const actor = await requireRole(["chu_hui"]);
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email: values.email,
    email_confirm: true,
    password: randomUUID().slice(0, 12),
    user_metadata: { full_name: values.fullName, role: values.role },
  });

  if (error || !data.user) throw new Error(error?.message ?? "Không thể tạo tài khoản");

  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ full_name: values.fullName, role: values.role })
    .eq("id", data.user.id);

  await supabase.from("activity_log").insert({
    actor_id: actor.id,
    action: "user.invite",
    entity_type: "profile",
    entity_id: data.user.id,
    metadata: { email: values.email, role: values.role },
  });

  revalidatePath("/settings/users");
}

export async function updateUserRole(profileId: string, role: UserRole) {
  const actor = await requireRole(["chu_hui"]);
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", profileId);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    actor_id: actor.id,
    action: "user.update_role",
    entity_type: "profile",
    entity_id: profileId,
    metadata: { role },
  });

  revalidatePath("/settings/users");
}
