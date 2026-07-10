"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Users } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemberFormDialog } from "@/components/members/member-form-dialog";
import { MemberStatusBadge } from "@/components/members/member-status-badge";
import { MemberRowActions } from "@/components/members/member-row-actions";
import { createMember } from "@/lib/actions/members";
import type { Member } from "@/lib/supabase/types";

export function MembersView({ members }: { members: Member[] }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        (m.phone ?? "").toLowerCase().includes(q),
    );
  }, [members, query]);

  const columns: ColumnDef<Member>[] = [
    { accessorKey: "full_name", header: "Họ tên" },
    {
      accessorKey: "phone",
      header: "SĐT",
      cell: ({ row }) => row.original.phone || "—",
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ row }) => row.original.address || "—",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <MemberStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <MemberRowActions member={row.original} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc SĐT..."
            className="pl-8"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <MemberFormDialog
          title="Thêm thành viên"
          trigger={
            <Button>
              <Plus /> Thêm thành viên
            </Button>
          }
          onSubmit={async (values) => {
            await createMember(values);
            router.refresh();
          }}
        />
      </div>
      {filtered.length ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(member) => router.push(`/members/${member.id}`)}
        />
      ) : members.length ? (
        <EmptyState
          icon={Users}
          title="Không tìm thấy thành viên"
          description="Thử từ khóa khác hoặc thêm thành viên mới."
        />
      ) : (
        <EmptyState
          icon={Users}
          title="Chưa có thành viên nào"
          description="Thêm thành viên đầu tiên để bắt đầu gắn vào các dây hụi."
        />
      )}
    </div>
  );
}
