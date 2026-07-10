"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
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
import { roleLabels } from "@/lib/auth/role-labels";
import { inviteUser } from "@/lib/actions/users";
import type { UserRole } from "@/lib/supabase/types";

const assignableRoles: UserRole[] = ["pho_chu_hui", "ke_toan", "thanh_vien"];

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("thanh_vien");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!email || !fullName) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setPending(true);
    try {
      await inviteUser({ email, fullName, role });
      toast.success("Đã tạo tài khoản mới");
      setOpen(false);
      setEmail("");
      setFullName("");
      setRole("thanh_vien");
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
            <UserPlus /> Thêm người dùng
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="invite-email">Email</FieldLabel>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="invite-name">Họ tên</FieldLabel>
            <Input
              id="invite-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="invite-role">Vai trò</FieldLabel>
            <Select value={role} onValueChange={(value) => setRole((value as UserRole) ?? "thanh_vien")}>
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue>{(value: UserRole) => roleLabels[value]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {assignableRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {roleLabels[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={pending} className="w-full sm:w-auto">
            {pending ? "Đang tạo..." : "Tạo tài khoản"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
