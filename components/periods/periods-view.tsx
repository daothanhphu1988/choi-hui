"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { PeriodStatusBadge } from "@/components/periods/period-status-badge";
import { formatVND } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { openPeriod } from "@/lib/actions/periods";
import type { Period, ChainStatus } from "@/lib/supabase/types";

interface WinnerInfo {
  name: string;
  amount: number | null;
}

export function PeriodsView({
  chainId,
  chainStatus,
  periods,
  winners,
}: {
  chainId: string;
  chainStatus: ChainStatus;
  periods: Period[];
  winners: Record<string, WinnerInfo>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const hasOpenPeriod = periods.some((p) => p.status !== "closed");
  const canOpenNew =
    chainStatus !== "completed" && chainStatus !== "cancelled" && !hasOpenPeriod;

  async function handleOpenPeriod() {
    setPending(true);
    try {
      const periodId = await openPeriod(chainId);
      toast.success("Đã mở kỳ hụi mới");
      router.push(`/chains/${chainId}/periods/${periodId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setPending(false);
    }
  }

  const columns: ColumnDef<Period>[] = [
    { accessorKey: "period_no", header: "Kỳ số" },
    {
      accessorKey: "open_date",
      header: "Ngày mở",
      cell: ({ row }) => formatDate(row.original.open_date),
    },
    {
      accessorKey: "close_date",
      header: "Ngày đóng",
      cell: ({ row }) => formatDate(row.original.close_date),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <PeriodStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "total_fund",
      header: "Tổng quỹ",
      cell: ({ row }) => formatVND(row.original.total_fund),
    },
    {
      id: "winner",
      header: "Người hốt",
      cell: ({ row }) => {
        const winner = winners[row.original.id];
        return winner ? `${winner.name} · ${formatVND(winner.amount)}` : "—";
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleOpenPeriod} disabled={pending || !canOpenNew}>
          <CalendarPlus /> {pending ? "Đang mở..." : "Mở kỳ mới"}
        </Button>
      </div>
      {periods.length ? (
        <DataTable
          columns={columns}
          data={periods}
          onRowClick={(p) => router.push(`/chains/${chainId}/periods/${p.id}`)}
        />
      ) : (
        <EmptyState
          icon={CalendarPlus}
          title="Chưa có kỳ hụi nào"
          description="Mở kỳ đầu tiên để bắt đầu thu tiền và hốt hụi."
          action={
            <Button onClick={handleOpenPeriod} disabled={pending}>
              <CalendarPlus /> Mở kỳ mới
            </Button>
          }
        />
      )}
    </div>
  );
}
