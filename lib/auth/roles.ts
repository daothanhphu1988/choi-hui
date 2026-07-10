import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/supabase/types";

export { roleLabels, MANAGER_ROLES, STAFF_ROLES } from "@/lib/auth/role-labels";

export class ForbiddenError extends Error {
  constructor(message = "Bạn không có quyền thực hiện thao tác này") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

/** Use in Server Components/layouts that require a session. */
export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

/** Use at the top of every Server Action that mutates data — the real
 * authorization boundary; UI-level hiding is only ever a convenience. */
export async function requireRole(roles: UserRole[]): Promise<Profile> {
  const profile = await requireProfile();
  if (!roles.includes(profile.role)) {
    throw new ForbiddenError();
  }
  return profile;
}
