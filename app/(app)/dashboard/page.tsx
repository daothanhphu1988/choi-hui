import { Layers, Wallet, Users, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChainFundChart } from "@/components/dashboard/chain-fund-chart";
import {
  UpcomingPeriodsList,
  type UpcomingPeriod,
} from "@/components/dashboard/upcoming-periods-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatVND } from "@/lib/utils/currency";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: chains }, { data: debts }, { data: openPeriods }] =
    await Promise.all([
      supabase.from("v_chain_dashboard").select("*"),
      supabase.from("v_member_debt").select("*"),
      supabase.from("periods").select("*").eq("status", "open").order("close_date"),
    ]);

  const chainList = chains ?? [];
  const totalChains = chainList.length;
  const totalFund = chainList
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + c.total_fund_value, 0);
  const membersWithDebt = new Set(
    (debts ?? []).filter((d) => d.total_owed > 0).map((d) => d.member_id),
  ).size;

  const chainNameById = new Map(chainList.map((c) => [c.chain_id, c.name]));
  const upcomingPeriods: UpcomingPeriod[] = (openPeriods ?? []).map((p) => ({
    id: p.id,
    chainId: p.chain_id,
    chainName: chainNameById.get(p.chain_id) ?? "—",
    periodNo: p.period_no,
    closeDate: p.close_date,
    totalFund: p.total_fund,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan"
        description="Tình hình các dây hụi đang quản lý"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Layers} label="Tổng số dây hụi" value={String(totalChains)} />
        <StatCard
          icon={Wallet}
          label="Tổng tiền đang quản lý"
          value={formatVND(totalFund)}
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={Users}
          label="Người còn nợ"
          value={String(membersWithDebt)}
          accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          icon={CalendarClock}
          label="Kỳ đang mở"
          value={String(upcomingPeriods.length)}
          accent="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChainFundChart
          data={chainList
            .filter((c) => c.status === "active")
            .map((c) => ({ name: c.name, total_fund_value: c.total_fund_value }))}
        />
        <Card>
          <CardHeader>
            <CardTitle>Kỳ hụi sắp đến hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingPeriodsList periods={upcomingPeriods} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
