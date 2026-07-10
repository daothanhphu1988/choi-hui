import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { UsersTable } from "@/components/settings/users-table";
import { InviteUserDialog } from "@/components/settings/invite-user-dialog";

export default async function UsersSettingsPage() {
  const profile = await requireProfile();
  if (profile.role !== "chu_hui") notFound();

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Người dùng"
        description="Quản lý tài khoản và phân quyền trong hệ thống"
        action={<InviteUserDialog />}
      />
      <UsersTable profiles={profiles ?? []} currentUserId={profile.id} />
    </div>
  );
}
