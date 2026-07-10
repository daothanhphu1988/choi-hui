import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/roles";
import { PageHeader } from "@/components/shared/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";

export default async function NotificationsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .or(`profile_id.eq.${profile.id},profile_id.is.null`)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thông báo"
        description="Kỳ hụi sắp mở, đóng tiền và các cập nhật khác"
      />
      <NotificationsList notifications={notifications ?? []} />
    </div>
  );
}
