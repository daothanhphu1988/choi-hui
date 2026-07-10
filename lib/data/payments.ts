import { createClient } from "@/lib/supabase/server";
import { getReceiptSignedUrls } from "@/lib/actions/payments";
import type { PaymentRecord } from "@/lib/supabase/types";
import type { PaymentRow } from "@/components/payments/types";

export async function buildPaymentRows(chainId?: string): Promise<PaymentRow[]> {
  const supabase = await createClient();

  const { data: chains } = chainId
    ? await supabase.from("hui_chains").select("*").eq("id", chainId)
    : await supabase.from("hui_chains").select("*");

  const chainIds = (chains ?? []).map((c) => c.id);
  if (!chainIds.length) return [];

  const [{ data: periods }, { data: shares }, { data: chainMembers }, { data: members }] =
    await Promise.all([
      supabase.from("periods").select("*").in("chain_id", chainIds),
      supabase.from("chain_shares").select("*").in("chain_id", chainIds),
      supabase.from("chain_members").select("*").in("chain_id", chainIds),
      supabase.from("members").select("*"),
    ]);

  const periodIds = (periods ?? []).map((p) => p.id);
  const { data: payments } = periodIds.length
    ? await supabase.from("payments").select("*").in("period_id", periodIds)
    : { data: [] };

  const paymentIds = (payments ?? []).map((p) => p.id);
  const { data: records } = paymentIds.length
    ? await supabase
        .from("payment_records")
        .select("*")
        .in("payment_id", paymentIds)
        .order("paid_at", { ascending: false })
    : { data: [] };

  const receiptPaths = (records ?? [])
    .map((r) => r.receipt_url)
    .filter((p): p is string => !!p);
  const signedUrls = await getReceiptSignedUrls(receiptPaths);

  const chainById = new Map((chains ?? []).map((c) => [c.id, c]));
  const periodById = new Map((periods ?? []).map((p) => [p.id, p]));
  const shareById = new Map((shares ?? []).map((s) => [s.id, s]));
  const chainMemberById = new Map((chainMembers ?? []).map((cm) => [cm.id, cm]));
  const memberById = new Map((members ?? []).map((m) => [m.id, m]));

  const recordsByPayment = new Map<string, PaymentRecord[]>();
  for (const record of records ?? []) {
    const list = recordsByPayment.get(record.payment_id) ?? [];
    list.push(record);
    recordsByPayment.set(record.payment_id, list);
  }

  const rows: PaymentRow[] = (payments ?? []).map((p) => {
    const period = periodById.get(p.period_id);
    const share = shareById.get(p.chain_share_id);
    const chainMember = share ? chainMemberById.get(share.chain_member_id) : undefined;
    const member = chainMember ? memberById.get(chainMember.member_id) : undefined;
    const chain = period ? chainById.get(period.chain_id) : undefined;

    const history = (recordsByPayment.get(p.id) ?? []).map((record) => ({
      id: record.id,
      amount: record.amount,
      paidAt: record.paid_at,
      method: record.method,
      note: record.note,
      receiptUrl: record.receipt_url ? (signedUrls[record.receipt_url] ?? null) : null,
    }));

    return {
      paymentId: p.id,
      chainId: period?.chain_id ?? "",
      chainName: chain?.name,
      periodNo: period?.period_no ?? 0,
      memberName: member?.full_name ?? "—",
      shareNo: share?.share_no ?? 0,
      amountDue: p.amount_due,
      amountPaid: p.amount_paid,
      status: p.status,
      dueDate: p.due_date,
      history,
    };
  });

  return rows.sort(
    (a, b) => a.periodNo - b.periodNo || a.memberName.localeCompare(b.memberName),
  );
}
