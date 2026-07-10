import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ChainTabs } from "@/components/chains/chain-tabs";
import {
  ChainStatusBadge,
  ChainTypeBadge,
} from "@/components/chains/chain-status-badge";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils/currency";
import { formatDate, cycleLabels } from "@/lib/utils/dates";

export default async function ChainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ chainId: string }>;
}) {
  const { chainId } = await params;
  const supabase = await createClient();
  const { data: chain } = await supabase
    .from("v_chain_dashboard")
    .select("*")
    .eq("chain_id", chainId)
    .single();

  if (!chain) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold">{chain.name}</h2>
            <ChainStatusBadge status={chain.status} />
            <ChainTypeBadge type={chain.type} />
          </div>
          <p className="text-sm text-muted-foreground">
            {formatVND(chain.share_value)} / phần · {cycleLabels[chain.cycle]}{" "}
            · mở {formatDate(chain.start_date)}
          </p>
          <p className="text-sm text-muted-foreground">
            {chain.member_count} thành viên · {chain.shares_won}/
            {chain.total_shares} phần đã hốt · Tổng quỹ{" "}
            {formatVND(chain.total_fund_value)}
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/chains/${chainId}/edit`} />}
        >
          <Pencil /> Chỉnh sửa
        </Button>
      </div>
      <ChainTabs chainId={chainId} />
      {children}
    </div>
  );
}
