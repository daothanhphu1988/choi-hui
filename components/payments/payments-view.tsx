"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentsTable } from "@/components/payments/payments-table";
import { cn } from "@/lib/utils";
import type { PaymentRow } from "@/components/payments/types";
import type { PaymentStatus } from "@/lib/supabase/types";

const filters: { label: string; value: PaymentStatus | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chưa đóng", value: "unpaid" },
  { label: "Đóng thiếu", value: "partial" },
  { label: "Đã đóng đủ", value: "paid" },
];

export function PaymentsView({
  rows,
  showChainColumn,
}: {
  rows: PaymentRow[];
  showChainColumn?: boolean;
}) {
  const [status, setStatus] = useState<PaymentStatus | "all">("all");

  const filtered = useMemo(
    () => (status === "all" ? rows : rows.filter((r) => r.status === status)),
    [rows, status],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={status === f.value ? "default" : "outline"}
            onClick={() => setStatus(f.value)}
            className={cn(status === f.value && "shadow-sm")}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <PaymentsTable rows={filtered} showChainColumn={showChainColumn} />
    </div>
  );
}
