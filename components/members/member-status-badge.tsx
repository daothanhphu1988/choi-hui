import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MemberStatus } from "@/lib/supabase/types";

const statusConfig: Record<MemberStatus, { label: string; className: string }> = {
  active: {
    label: "Hoạt động",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  inactive: { label: "Ngưng", className: "bg-muted text-muted-foreground" },
};

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  const config = statusConfig[status];
  return <Badge className={cn(config.className)}>{config.label}</Badge>;
}
