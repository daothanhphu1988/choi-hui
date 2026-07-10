import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodStatusBadge } from "@/components/periods/period-status-badge";
import { LotteryDrawCard } from "@/components/periods/lottery-draw-card";
import { AuctionBidTable } from "@/components/periods/auction-bid-table";
import { formatVND } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import type { HuiChain, Period } from "@/lib/supabase/types";

export interface EligibleShare {
  id: string;
  chainMemberId: string;
  shareNo: number;
  name: string;
  bidAmount: number | null;
}

export interface WinnerInfo {
  name: string;
  shareNo: number;
  amount: number | null;
}

export interface DistributionRow {
  name: string;
  amount: number;
}

export function PeriodDetailView({
  chainId,
  chain,
  period,
  eligibleShares,
  winnerInfo,
  distributionRows,
}: {
  chainId: string;
  chain: HuiChain;
  period: Period;
  eligibleShares: EligibleShare[];
  winnerInfo: WinnerInfo | null;
  distributionRows: DistributionRow[];
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Kỳ hụi số {period.period_no}</CardTitle>
          <PeriodStatusBadge status={period.status} />
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Ngày mở</p>
            <p className="font-medium">{formatDate(period.open_date)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ngày đóng</p>
            <p className="font-medium">{formatDate(period.close_date)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tổng quỹ</p>
            <p className="font-medium">{formatVND(period.total_fund)}</p>
          </div>
        </CardContent>
      </Card>

      {period.status === "closed" && winnerInfo ? (
        <Card className="border-emerald-500/30">
          <CardHeader>
            <CardTitle>Kết quả hốt hụi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <span className="font-medium">{winnerInfo.name}</span> (phần #
              {winnerInfo.shareNo}) đã hốt và nhận{" "}
              <span className="font-medium">{formatVND(winnerInfo.amount)}</span>
              {period.winning_bid_amount != null
                ? ` (bỏ hụi ${formatVND(period.winning_bid_amount)})`
                : ""}
            </p>
            {distributionRows.length ? (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Tiền lời chia cho các phần chưa hốt:
                </p>
                <ul className="grid gap-1 text-sm sm:grid-cols-2">
                  {distributionRows.map((d, i) => (
                    <li
                      key={i}
                      className="flex justify-between rounded-md bg-muted/50 px-2 py-1"
                    >
                      <span>{d.name}</span>
                      <span className="font-medium">{formatVND(d.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : chain.type === "khong_lai" ? (
        <LotteryDrawCard
          chainId={chainId}
          periodId={period.id}
          eligibleShares={eligibleShares}
        />
      ) : (
        <AuctionBidTable
          chainId={chainId}
          periodId={period.id}
          totalFund={period.total_fund}
          eligibleShares={eligibleShares}
        />
      )}
    </div>
  );
}
