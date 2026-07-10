"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteChain } from "@/lib/actions/chains";

export function DeleteChainButton({
  chainId,
  chainName,
}: {
  chainId: string;
  chainName: string;
}) {
  const router = useRouter();

  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive">
          <Trash2 /> Xóa dây hụi
        </Button>
      }
      title={`Xóa dây hụi "${chainName}"?`}
      description="Toàn bộ dữ liệu thành viên, kỳ hụi và thanh toán liên quan sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác."
      confirmLabel="Xóa"
      destructive
      onConfirm={async () => {
        await deleteChain(chainId);
        router.push("/chains");
      }}
    />
  );
}
