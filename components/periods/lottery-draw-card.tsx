"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dices } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { closePeriodAction } from "@/lib/actions/periods";
import type { EligibleShare } from "@/components/periods/period-detail-view";

export function LotteryDrawCard({
  chainId,
  periodId,
  eligibleShares,
}: {
  chainId: string;
  periodId: string;
  eligibleShares: EligibleShare[];
}) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  async function handleDraw() {
    if (!eligibleShares.length) {
      toast.error("Không còn phần hụi nào để bốc thăm");
      return;
    }
    setSpinning(true);

    const winner =
      eligibleShares[Math.floor(Math.random() * eligibleShares.length)];

    const rounds = 14;
    for (let i = 0; i < rounds; i++) {
      const candidate =
        eligibleShares[Math.floor(Math.random() * eligibleShares.length)];
      setHighlighted(candidate.id);
      await new Promise((resolve) => setTimeout(resolve, 60 + i * 10));
    }
    setHighlighted(winner.id);
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      await closePeriodAction(chainId, periodId, winner.id);
      toast.success(`${winner.name} đã trúng thăm!`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
      setSpinning(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bốc thăm hốt hụi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {eligibleShares.map((share) => (
            <div
              key={share.id}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm transition-colors",
                highlighted === share.id && "border-primary bg-primary/10 font-medium",
              )}
            >
              {share.name}{" "}
              <span className="text-muted-foreground">#{share.shareNo}</span>
            </div>
          ))}
        </div>
        <Button onClick={handleDraw} disabled={spinning || !eligibleShares.length}>
          <Dices /> {spinning ? "Đang quay số..." : "Quay số"}
        </Button>
      </CardContent>
    </Card>
  );
}
