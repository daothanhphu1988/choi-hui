import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChainStatus, ChainType } from "@/lib/supabase/types";

const statusConfig: Record<ChainStatus, { label: string; className: string }> = {
  draft: { label: "Nháp", className: "bg-muted text-muted-foreground" },
  active: {
    label: "Đang chạy",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  completed: {
    label: "Đã kết thúc",
    className: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-destructive/10 text-destructive",
  },
};

export function ChainStatusBadge({ status }: { status: ChainStatus }) {
  const config = statusConfig[status];
  return <Badge className={cn(config.className)}>{config.label}</Badge>;
}

const typeConfig: Record<ChainType, string> = {
  lai: "Có lãi (đấu giá)",
  khong_lai: "Không lãi (bốc thăm)",
};

export function ChainTypeBadge({ type }: { type: ChainType }) {
  return <Badge variant="outline">{typeConfig[type]}</Badge>;
}
