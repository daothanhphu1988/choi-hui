"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/lib/actions/profile";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        await changePassword(password);
        toast.success("Đã đổi mật khẩu");
        setPassword("");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="new-password">Mật khẩu mới</FieldLabel>
        <Input
          id="new-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />
      </Field>
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Đang đổi..." : "Đổi mật khẩu"}
      </Button>
    </form>
  );
}
