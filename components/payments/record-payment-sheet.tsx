"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { recordPayment } from "@/lib/actions/payments";
import { formatVND } from "@/lib/utils/currency";
import { paymentMethodLabels } from "@/lib/utils/payment-method";
import type { PaymentRow } from "@/components/payments/types";

export function RecordPaymentSheet({
  chainId,
  payment,
}: {
  chainId: string;
  payment: PaymentRow;
}) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState("cash");
  const [state, formAction, pending] = useActionState(recordPayment, undefined);
  const remaining = payment.amountDue - payment.amountPaid;

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- close sheet once the server action reports success
      setOpen(false);
    }
  }, [state]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="sm" variant="outline">
            Ghi nhận đóng tiền
          </Button>
        }
      />
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Ghi nhận đóng tiền — {payment.memberName}</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <input type="hidden" name="paymentId" value={payment.paymentId} />
          <input type="hidden" name="chainId" value={chainId} />
          <input type="hidden" name="method" value={method} />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="amount">
                Số tiền đóng (còn thiếu {formatVND(remaining)})
              </FieldLabel>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={0}
                step={1000}
                defaultValue={remaining > 0 ? remaining : payment.amountDue}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="method-select">Hình thức</FieldLabel>
              <Select value={method} onValueChange={(v) => setMethod(v ?? "cash")}>
                <SelectTrigger id="method-select" className="w-full">
                  <SelectValue>{(value: string) => paymentMethodLabels[value]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                  <SelectItem value="transfer">Chuyển khoản</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="receipt">Biên nhận (ảnh/PDF, tùy chọn)</FieldLabel>
              <Input id="receipt" name="receipt" type="file" accept="image/*,.pdf" />
            </Field>
            <Field>
              <FieldLabel htmlFor="note">Ghi chú</FieldLabel>
              <Textarea id="note" name="note" rows={2} />
            </Field>
            {state?.error ? (
              <p className="text-sm text-destructive">{state.error}</p>
            ) : null}
          </FieldGroup>
          <SheetFooter className="mt-0">
            <Button type="submit" disabled={pending}>
              {pending ? "Đang lưu..." : "Ghi nhận"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
