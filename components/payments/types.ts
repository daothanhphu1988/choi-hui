import type { PaymentStatus } from "@/lib/supabase/types";

export interface PaymentHistoryRecord {
  id: string;
  amount: number;
  paidAt: string;
  method: string | null;
  note: string | null;
  receiptUrl: string | null;
}

export interface PaymentRow {
  paymentId: string;
  chainId: string;
  chainName?: string;
  periodNo: number;
  memberName: string;
  shareNo: number;
  amountDue: number;
  amountPaid: number;
  status: PaymentStatus;
  dueDate: string;
  history: PaymentHistoryRecord[];
}
