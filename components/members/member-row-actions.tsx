"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MemberFormDialog } from "@/components/members/member-form-dialog";
import { updateMember, deleteMember } from "@/lib/actions/members";
import type { Member } from "@/lib/supabase/types";

export function MemberRowActions({ member }: { member: Member }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div onClick={(event) => event.stopPropagation()} className="flex justify-end gap-1">
      <Button variant="ghost" size="icon-sm" onClick={() => setEditOpen(true)}>
        <Pencil className="size-4" />
      </Button>
      <MemberFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Chỉnh sửa thành viên"
        defaultValues={{
          full_name: member.full_name,
          phone: member.phone ?? undefined,
          address: member.address ?? undefined,
          note: member.note ?? undefined,
          status: member.status,
        }}
        onSubmit={async (values) => {
          await updateMember(member.id, values);
          router.refresh();
        }}
      />
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        }
        title={`Xóa thành viên "${member.full_name}"?`}
        description="Thành viên sẽ bị xóa khỏi hệ thống. Nếu đang tham gia dây hụi, hãy gỡ khỏi dây hụi trước."
        confirmLabel="Xóa"
        destructive
        onConfirm={async () => {
          await deleteMember(member.id);
          router.refresh();
        }}
      />
    </div>
  );
}
