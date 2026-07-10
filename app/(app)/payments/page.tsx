import { buildPaymentRows } from "@/lib/data/payments";
import { PageHeader } from "@/components/shared/page-header";
import { PaymentsView } from "@/components/payments/payments-view";

export default async function PaymentsPage() {
  const rows = await buildPaymentRows();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thanh toán"
        description="Theo dõi công nợ và ghi nhận đóng tiền trên tất cả dây hụi"
      />
      <PaymentsView rows={rows} showChainColumn />
    </div>
  );
}
