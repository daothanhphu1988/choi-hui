"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { RecordPaymentSheet } from "@/components/payments/record-payment-sheet";
import { PaymentHistorySheet } from "@/components/payments/payment-history-sheet";
import { formatVND } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import type { PaymentRow } from "@/components/payments/types";

export function PaymentsTable({
  rows,
  showChainColumn,
}: {
  rows: PaymentRow[];
  showChainColumn?: boolean;
}) {
  const columns: ColumnDef<PaymentRow>[] = [
    ...(showChainColumn
      ? ([
          {
            accessorKey: "chainName",
            header: "Dây hụi",
          },
        ] as ColumnDef<PaymentRow>[])
      : []),
    {
      accessorKey: "periodNo",
      header: "Kỳ",
      cell: ({ row }) => `Kỳ ${row.original.periodNo}`,
    },
    { accessorKey: "memberName", header: "Thành viên" },
    {
      accessorKey: "shareNo",
      header: "Phần",
      cell: ({ row }) => `#${row.original.shareNo}`,
    },
    {
      accessorKey: "dueDate",
      header: "Đến hạn",
      cell: ({ row }) => formatDate(row.original.dueDate),
    },
    {
      id: "amount",
      header: "Đã đóng / Cần đóng",
      cell: ({ row }) =>
        `${formatVND(row.original.amountPaid)} / ${formatVND(row.original.amountDue)}`,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <PaymentHistorySheet row={row.original} />
          {row.original.status !== "paid" ? (
            <RecordPaymentSheet chainId={row.original.chainId} payment={row.original} />
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      emptyMessage="Chưa có khoản thu nào"
      pageSize={15}
    />
  );
}
