"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Gavel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatVND } from "@/lib/utils/currency";
import { submitBids, closePeriodAction } from "@/lib/actions/periods";
import type { EligibleShare } from "@/components/periods/period-detail-view";

export function AuctionBidTable({
  chainId,
  periodId,
  totalFund,
  eligibleShares,
}: {
  chainId: string;
  periodId: string;
  totalFund: number | null;
  eligibleShares: EligibleShare[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      eligibleShares.map((s) => [
        s.id,
        s.bidAmount != null ? String(s.bidAmount) : "",
      ]),
    ),
  );
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  const highestBid = useMemo(() => {
    let best: { share: EligibleShare; amount: number } | null = null;
    for (const share of eligibleShares) {
      if (share.bidAmount == null) continue;
      if (!best || share.bidAmount > best.amount) {
        best = { share, amount: share.bidAmount };
      }
    }
    return best;
  }, [eligibleShares]);

  const previewWinnerAmount =
    highestBid && totalFund != null ? totalFund - highestBid.amount : null;
  const previewShareCount = eligibleShares.length - 1;
  const previewSplit =
    highestBid && previewShareCount > 0
      ? highestBid.amount / previewShareCount
      : 0;

  async function handleSave() {
    const bids = eligibleShares
      .map((s) => ({ chainShareId: s.id, bidAmount: Number(values[s.id]) }))
      .filter(
        (b) =>
          values[b.chainShareId] !== "" &&
          Number.isFinite(b.bidAmount) &&
          b.bidAmount >= 0,
      );

    if (!bids.length) {
      toast.error("Vui lòng nhập ít nhất một mức bỏ hụi");
      return;
    }
    setSaving(true);
    try {
      await submitBids(chainId, periodId, bids);
      toast.success("Đã lưu tiền bỏ hụi");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  }

  async function handleClose() {
    if (!highestBid) return;
    setClosing(true);
    try {
      await closePeriodAction(
        chainId,
        periodId,
        highestBid.share.id,
        highestBid.amount,
      );
      toast.success(`${highestBid.share.name} đã hốt hụi kỳ này`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setClosing(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đấu giá hốt hụi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thành viên</TableHead>
              <TableHead>Phần</TableHead>
              <TableHead>Tiền bỏ hụi (VNĐ)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eligibleShares.map((share) => (
              <TableRow key={share.id}>
                <TableCell>{share.name}</TableCell>
                <TableCell>#{share.shareNo}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    className="w-40"
                    value={values[share.id] ?? ""}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        [share.id]: event.target.value,
                      }))
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu tiền bỏ hụi"}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button disabled={!highestBid || closing}>
                  <Gavel /> Chốt kỳ hụi
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận người hốt hụi</AlertDialogTitle>
                <AlertDialogDescription>
                  {highestBid ? (
                    <>
                      <strong>{highestBid.share.name}</strong> bỏ cao nhất (
                      {formatVND(highestBid.amount)}) và sẽ nhận{" "}
                      {formatVND(previewWinnerAmount)}. Số tiền bỏ hụi sẽ được
                      chia đều cho {previewShareCount} phần chưa hốt còn lại,
                      mỗi phần {formatVND(previewSplit)}.
                    </>
                  ) : (
                    "Chưa có mức bỏ hụi nào được lưu."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClose}
                  disabled={!highestBid || closing}
                >
                  {closing ? "Đang xử lý..." : "Xác nhận chốt"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
