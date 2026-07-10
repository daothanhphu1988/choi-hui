import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import {
  ActivityLogTable,
  type ActivityLogRow,
} from "@/components/activity-log/activity-log-table";

export default async function ActivityLogPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const actorIds = Array.from(
    new Set((logs ?? []).map((l) => l.actor_id).filter((id): id is string => !!id)),
  );
  const { data: profiles } = actorIds.length
    ? await supabase.from("profiles").select("*").in("id", actorIds)
    : { data: [] };
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const rows: ActivityLogRow[] = (logs ?? []).map((log) => ({
    id: log.id,
    actorName:
      (log.actor_id && profileById.get(log.actor_id)?.full_name) || "Hệ thống",
    action: log.action,
    entityType: log.entity_type,
    createdAt: log.created_at,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhật ký hoạt động"
        description="Lịch sử thao tác trên hệ thống"
      />
      <ActivityLogTable rows={rows} />
    </div>
  );
}
