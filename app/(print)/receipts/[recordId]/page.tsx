import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AutoPrint } from "@/components/payments/auto-print";
import { Logo } from "@/components/shared/logo";
import { formatVND } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { paymentMethodLabels as methodLabels } from "@/lib/utils/payment-method";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  );
}

export default async function ReceiptPrintPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;
  const supabase = await createClient();

  const { data: record } = await supabase
    .from("payment_records")
    .select("*")
    .eq("id", recordId)
    .single();
  if (!record) notFound();

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("id", record.payment_id)
    .single();

  const { data: period } = payment
    ? await supabase.from("periods").select("*").eq("id", payment.period_id).single()
    : { data: null };

  const { data: share } = payment
    ? await supabase.from("chain_shares").select("*").eq("id", payment.chain_share_id).single()
    : { data: null };

  const { data: chainMember } = share
    ? await supabase.from("chain_members").select("*").eq("id", share.chain_member_id).single()
    : { data: null };

  const { data: member } = chainMember
    ? await supabase.from("members").select("*").eq("id", chainMember.member_id).single()
    : { data: null };

  const { data: chain } = chainMember
    ? await supabase.from("hui_chains").select("*").eq("id", chainMember.chain_id).single()
    : { data: null };

  return (
    <div className="space-y-4 text-sm">
      <AutoPrint />
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo className="size-10" iconClassName="size-5" />
        <h1 className="text-base font-semibold">BIÊN NHẬN ĐÓNG HỤI</h1>
        <p className="text-muted-foreground">{chain?.name}</p>
      </div>
      <div className="space-y-0.5 border-y py-3">
        <Row label="Người đóng" value={member?.full_name} />
        <Row label="Phần hụi" value={share ? `#${share.share_no}` : undefined} />
        <Row label="Kỳ hụi" value={period ? `Kỳ ${period.period_no}` : undefined} />
        <Row label="Số tiền" value={formatVND(record.amount)} />
        <Row label="Hình thức" value={methodLabels[record.method ?? "cash"] ?? record.method} />
        <Row label="Ngày đóng" value={formatDate(record.paid_at, "dd/MM/yyyy HH:mm")} />
        {record.note ? <Row label="Ghi chú" value={record.note} /> : null}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Cảm ơn quý khách!
      </p>
    </div>
  );
}
