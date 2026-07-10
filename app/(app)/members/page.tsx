import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { MembersView } from "@/components/members/members-view";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("*")
    .order("full_name");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thành viên"
        description="Danh sách con hụi tham gia các dây hụi"
      />
      <MembersView members={data ?? []} />
    </div>
  );
}
