"use client";

import { useState } from "react";
import Link from "next/link";
import { History, Printer } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { paymentMethodLabels as methodLabels } from "@/lib/utils/payment-method";
import type { PaymentRow } from "@/components/payments/types";

export function PaymentHistorySheet({ row }: { row: PaymentRow }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="icon-sm" variant="ghost">
            <History className="size-4" />
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Lịch sử đóng — {row.memberName}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-3 overflow-y-auto px-4">
          {row.history.length ? (
            row.history.map((record) => (
              <div key={record.id} className="space-y-1 rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{formatVND(record.amount)}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(record.paidAt, "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {methodLabels[record.method ?? "cash"] ?? record.method}
                </p>
                {record.note ? <p>{record.note}</p> : null}
                <div className="mt-1 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={
                      <Link href={`/receipts/${record.id}`} target="_blank" rel="noopener noreferrer" />
                    }
                  >
                    <Printer /> In biên nhận
                  </Button>
                  {record.receiptUrl ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      nativeButton={false}
                      render={
                        <Link href={record.receiptUrl} target="_blank" rel="noopener noreferrer" />
                      }
                    >
                      Xem tệp đính kèm
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có khoản đóng nào.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
