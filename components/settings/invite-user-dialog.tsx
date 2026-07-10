"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Copy, RefreshCw, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldDescription,
} from "@/components/ui/field";
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

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("thanh_vien");
  const [password, setPassword] = useState(generatePassword);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  function resetForm() {
    setEmail("");
    setFullName("");
    setRole("thanh_vien");
    setPassword(generatePassword());
    setCreated(null);
    setCopied(false);
  }

  async function handleSubmit() {
    if (!email || !fullName) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    setPending(true);
    try {
      await inviteUser({ email, fullName, role, password });
      setCreated({ email, password });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setPending(false);
    }
  }

  async function copyCredentials() {
    if (!created) return;
    await navigator.clipboard.writeText(
      `Email: ${created.email}\nMật khẩu: ${created.password}`,
    );
    setCopied(true);
    toast.success("Đã sao chép thông tin đăng nhập");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <UserPlus /> Thêm người dùng
          </Button>
        }
      />
      <DialogContent>
        {created ? (
          <>
            <DialogHeader>
              <DialogTitle>Đã tạo tài khoản</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="text-muted-foreground">
                Gửi thông tin này cho người dùng để họ đăng nhập lần đầu:
              </p>
              <div className="space-y-1 font-mono">
                <p>Email: {created.email}</p>
                <p>Mật khẩu: {created.password}</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={copyCredentials}
                className="w-full sm:w-auto"
              >
                {copied ? <Check /> : <Copy />} Sao chép
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="w-full sm:w-auto"
              >
                Xong
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
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
                <Select
                  value={role}
                  onValueChange={(value) => setRole((value as UserRole) ?? "thanh_vien")}
                >
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
              <Field>
                <FieldLabel htmlFor="invite-password">Mật khẩu</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="invite-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setPassword(generatePassword())}
                    aria-label="Tạo mật khẩu ngẫu nhiên"
                  >
                    <RefreshCw />
                  </Button>
                </div>
                <FieldDescription>
                  Gửi mật khẩu này cho người dùng — họ có thể đổi lại sau khi
                  đăng nhập ở trang Hồ sơ cá nhân.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={pending}
                className="w-full sm:w-auto"
              >
                {pending ? "Đang tạo..." : "Tạo tài khoản"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
