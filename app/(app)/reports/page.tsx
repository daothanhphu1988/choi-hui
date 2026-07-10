import { PageHeader } from "@/components/shared/page-header";
import { getReportsData } from "@/lib/data/reports";
import { ReportsTabs } from "@/components/reports/reports-tabs";

export default async function ReportsPage() {
  const { incomeExpense, winHistory, debtReport, memberReport } =
    await getReportsData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo"
        description="Thu chi, lịch sử hốt hụi, công nợ và thành viên"
      />
      <ReportsTabs
        incomeExpense={incomeExpense}
        winHistory={winHistory}
        debtReport={debtReport}
        memberReport={memberReport}
      />
    </div>
  );
}
