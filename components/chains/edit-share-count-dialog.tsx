"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateMemberShareCount } from "@/lib/actions/chain-members";
import type { ChainMemberRow } from "@/components/chains/chain-members-view";

export function EditShareCountDialog({
  chainId,
  row,
}: {
  chainId: string;
  row: ChainMemberRow;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(String(row.shareCount));
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    const count = Number(value);
    if (!Number.isInteger(count) || count < row.sharesWon) {
      toast.error(
        `Số phần không thể nhỏ hơn số phần đã hốt (${row.sharesWon})`,
      );
      return;
    }
    setPending(true);
    try {
      await updateMemberShareCount(chainId, row.chainMemberId, count);
      toast.success("Đã cập nhật số phần");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm">
            <Pencil className="size-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa số phần của {row.fullName}</DialogTitle>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="count">Số phần chưng</FieldLabel>
          <Input
            id="count"
            type="number"
            min={row.sharesWon}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Field>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
