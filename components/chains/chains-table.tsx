"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import {
  ChainStatusBadge,
  ChainTypeBadge,
} from "@/components/chains/chain-status-badge";
import { formatVND } from "@/lib/utils/currency";
import { formatDate, cycleLabels } from "@/lib/utils/dates";
import type { ChainDashboardView } from "@/lib/supabase/types";

const columns: ColumnDef<ChainDashboardView>[] = [
  { accessorKey: "name", header: "Tên dây hụi" },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => <ChainTypeBadge type={row.original.type} />,
  },
  {
    accessorKey: "cycle",
    header: "Chu kỳ",
    cell: ({ row }) => cycleLabels[row.original.cycle],
  },
  {
    accessorKey: "share_value",
    header: "Giá trị phần",
    cell: ({ row }) => formatVND(row.original.share_value),
  },
  { accessorKey: "member_count", header: "Thành viên" },
  {
    id: "progress",
    header: "Tiến độ",
    cell: ({ row }) =>
      `${row.original.shares_won}/${row.original.total_shares} đã hốt`,
  },
  {
    accessorKey: "start_date",
    header: "Ngày mở",
    cell: ({ row }) => formatDate(row.original.start_date),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <ChainStatusBadge status={row.original.status} />,
  },
];

export function ChainsTable({ chains }: { chains: ChainDashboardView[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={chains}
      emptyMessage="Chưa có dây hụi nào"
      onRowClick={(chain) => router.push(`/chains/${chain.chain_id}`)}
    />
  );
}
