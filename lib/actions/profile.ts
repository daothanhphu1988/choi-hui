"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/roles";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "@/lib/validations/profile.schema";

export async function updateOwnProfile(values: ProfileFormValues) {
  const profile = await requireProfile();
  const parsed = profileFormSchema.parse(values);
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update(parsed)
    .eq("id", profile.id);

  if (error) throw new Error(error.message);

  revalidatePath("/settings/profile");
  revalidatePath("/", "layout");
}

export async function changePassword(newPassword: string) {
  await requireProfile();
  if (newPassword.length < 6) {
    throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}
