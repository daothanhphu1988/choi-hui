"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMemberToChain } from "@/lib/actions/chain-members";
import type { Member } from "@/lib/supabase/types";

export function AddChainMemberDialog({
  chainId,
  availableMembers,
}: {
  chainId: string;
  availableMembers: Member[];
}) {
  const [open, setOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [shareCount, setShareCount] = useState("1");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!memberId) {
      toast.error("Vui lòng chọn thành viên");
      return;
    }
    const count = Number(shareCount);
    if (!Number.isInteger(count) || count < 1) {
      toast.error("Số phần phải là số nguyên lớn hơn 0");
      return;
    }
    setPending(true);
    try {
      await addMemberToChain(chainId, memberId, count);
      toast.success("Đã thêm thành viên vào dây hụi");
      setOpen(false);
      setMemberId("");
      setShareCount("1");
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
          <Button>
            <Plus /> Thêm thành viên
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm thành viên vào dây hụi</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="member">Thành viên</FieldLabel>
            <Select value={memberId} onValueChange={(value) => setMemberId(value ?? "")}>
              <SelectTrigger id="member" className="w-full">
                <SelectValue placeholder="Chọn thành viên...">
                  {(value: string) => {
                    const selected = availableMembers.find((m) => m.id === value);
                    return selected
                      ? `${selected.full_name}${selected.phone ? ` · ${selected.phone}` : ""}`
                      : "Chọn thành viên...";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.full_name}
                    {m.phone ? ` · ${m.phone}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!availableMembers.length ? (
              <p className="text-xs text-muted-foreground">
                Không còn thành viên nào để thêm — hãy tạo thành viên mới ở
                trang Thành viên trước.
              </p>
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="shareCount">Số phần chưng</FieldLabel>
            <Input
              id="shareCount"
              type="number"
              min={1}
              value={shareCount}
              onChange={(event) => setShareCount(event.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={pending} className="w-full sm:w-auto">
            {pending ? "Đang thêm..." : "Thêm vào dây hụi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
