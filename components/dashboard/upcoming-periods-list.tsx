import Link from "next/link";
import { formatDate } from "@/lib/utils/dates";
import { formatVND } from "@/lib/utils/currency";

export interface UpcomingPeriod {
  id: string;
  chainId: string;
  chainName: string;
  periodNo: number;
  closeDate: string;
  totalFund: number | null;
}

export function UpcomingPeriodsList({ periods }: { periods: UpcomingPeriod[] }) {
  if (!periods.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Không có kỳ hụi nào đang mở.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {periods.map((period) => (
        <li key={period.id}>
          <Link
            href={`/chains/${period.chainId}/periods/${period.id}`}
            className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
          >
            <div>
              <p className="font-medium">
                {period.chainName} — Kỳ {period.periodNo}
              </p>
              <p className="text-xs text-muted-foreground">
                Đến hạn {formatDate(period.closeDate)}
              </p>
            </div>
            <span className="font-medium">{formatVND(period.totalFund)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
