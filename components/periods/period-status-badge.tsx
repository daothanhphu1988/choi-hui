import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PeriodStatus } from "@/lib/supabase/types";

const statusConfig: Record<PeriodStatus, { label: string; className: string }> = {
  pending: { label: "Chưa mở", className: "bg-muted text-muted-foreground" },
  open: {
    label: "Đang mở",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  closed: {
    label: "Đã đóng",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
};

export function PeriodStatusBadge({ status }: { status: PeriodStatus }) {
  const config = statusConfig[status];
  return <Badge className={cn(config.className)}>{config.label}</Badge>;
}
