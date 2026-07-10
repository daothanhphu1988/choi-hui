"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/roles";

export async function markNotificationRead(id: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  revalidatePath("/", "layout");
}

export async function markAllNotificationsRead() {
  const profile = await requireProfile();
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .or(`profile_id.eq.${profile.id},profile_id.is.null`)
    .eq("is_read", false);
  revalidatePath("/", "layout");
}
