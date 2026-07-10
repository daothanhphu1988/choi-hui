import { buildPaymentRows } from "@/lib/data/payments";
import { PaymentsView } from "@/components/payments/payments-view";

export default async function ChainPaymentsPage({
  params,
}: {
  params: Promise<{ chainId: string }>;
}) {
  const { chainId } = await params;
  const rows = await buildPaymentRows(chainId);

  return <PaymentsView rows={rows} />;
}
