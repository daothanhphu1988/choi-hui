"use client";

import { useRouter } from "next/navigation";
import { Trash2, Users } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AddChainMemberDialog } from "@/components/chains/add-chain-member-dialog";
import { EditShareCountDialog } from "@/components/chains/edit-share-count-dialog";
import { removeMemberFromChain } from "@/lib/actions/chain-members";
import type { Member } from "@/lib/supabase/types";

export interface ChainMemberRow {
  chainMemberId: string;
  memberId: string;
  fullName: string;
  phone: string | null;
  shareCount: number;
  sharesWon: number;
}

export function ChainMembersView({
  chainId,
  rows,
  availableMembers,
}: {
  chainId: string;
  rows: ChainMemberRow[];
  availableMembers: Member[];
}) {
  const router = useRouter();

  const columns: ColumnDef<ChainMemberRow>[] = [
    { accessorKey: "fullName", header: "Họ tên" },
    {
      accessorKey: "phone",
      header: "SĐT",
      cell: ({ row }) => row.original.phone || "—",
    },
    { accessorKey: "shareCount", header: "Số phần" },
    {
      id: "won",
      header: "Đã hốt",
      cell: ({ row }) => `${row.original.sharesWon}/${row.original.shareCount}`,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <EditShareCountDialog chainId={chainId} row={row.original} />
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon-sm">
                <Trash2 className="size-4 text-destructive" />
              </Button>
            }
            title={`Gỡ "${row.original.fullName}" khỏi dây hụi?`}
            description="Chỉ có thể gỡ nếu thành viên chưa hốt phần nào trong dây hụi này."
            confirmLabel="Gỡ"
            destructive
            onConfirm={async () => {
              await removeMemberFromChain(chainId, row.original.chainMemberId);
              router.refresh();
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddChainMemberDialog chainId={chainId} availableMembers={availableMembers} />
      </div>
      {rows.length ? (
        <DataTable columns={columns} data={rows} emptyMessage="Chưa có thành viên" />
      ) : (
        <EmptyState
          icon={Users}
          title="Chưa có thành viên trong dây hụi"
          description="Thêm thành viên để bắt đầu góp hụi."
        />
      )}
    </div>
  );
}
