import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/lib/supabase/types";

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  unpaid: { label: "Chưa đóng", className: "bg-destructive/10 text-destructive" },
  partial: {
    label: "Đóng thiếu",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  paid: {
    label: "Đã đóng đủ",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = statusConfig[status];
  return <Badge className={cn(config.className)}>{config.label}</Badge>;
}
