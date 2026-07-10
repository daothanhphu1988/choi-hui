"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { formatDate } from "@/lib/utils/dates";

const actionLabels: Record<string, string> = {
  "chain.create": "Tạo dây hụi",
  "chain.update": "Cập nhật dây hụi",
  "chain.delete": "Xóa dây hụi",
  "member.create": "Thêm thành viên",
  "member.update": "Cập nhật thành viên",
  "member.delete": "Xóa thành viên",
  "chain_member.add": "Thêm vào dây hụi",
  "chain_member.update_shares": "Cập nhật số phần",
  "chain_member.remove": "Gỡ khỏi dây hụi",
  "period.open": "Mở kỳ hụi",
  "period.close": "Đóng kỳ hụi",
  "period.bid": "Ghi nhận bỏ hụi",
  "payment.record": "Ghi nhận đóng tiền",
};

export interface ActivityLogRow {
  id: string;
  actorName: string;
  action: string;
  entityType: string;
  createdAt: string;
}

export function ActivityLogTable({ rows }: { rows: ActivityLogRow[] }) {
  const columns: ColumnDef<ActivityLogRow>[] = [
    {
      accessorKey: "createdAt",
      header: "Thời gian",
      cell: ({ row }) => formatDate(row.original.createdAt, "dd/MM/yyyy HH:mm"),
    },
    { accessorKey: "actorName", header: "Người thực hiện" },
    {
      accessorKey: "action",
      header: "Hành động",
      cell: ({ row }) => actionLabels[row.original.action] ?? row.original.action,
    },
    { accessorKey: "entityType", header: "Đối tượng" },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      pageSize={20}
      emptyMessage="Chưa có hoạt động nào"
    />
  );
}
