"use client";

import { useActionState } from "react";
import { HandCoins } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <HandCoins className="size-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Quản Lý Chơi Hụi
          </h1>
          <p className="text-sm text-muted-foreground">
            Đăng nhập để quản lý dây hụi của bạn
          </p>
        </div>
      </div>

      <Card className="border-border/60 shadow-xl shadow-black/5">
        <CardContent className="pt-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ban@vidu.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {state?.error ? (
              <p className="text-sm text-destructive">{state.error}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Tài khoản được cấp bởi chủ hụi hoặc phó chủ hụi.
      </p>
    </div>
  );
}
