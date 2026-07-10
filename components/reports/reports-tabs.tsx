"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatVND } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import type {
  IncomeExpenseRow,
  WinHistoryRow,
  DebtReportRow,
  MemberReportRow,
} from "@/lib/data/reports";

function ExportButton() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="outline" size="sm" disabled>
            <Download /> Xuất Excel/PDF
          </Button>
        }
      />
      <TooltipContent>Tính năng sắp ra mắt</TooltipContent>
    </Tooltip>
  );
}

export function ReportsTabs({
  incomeExpense,
  winHistory,
  debtReport,
  memberReport,
}: {
  incomeExpense: IncomeExpenseRow[];
  winHistory: WinHistoryRow[];
  debtReport: DebtReportRow[];
  memberReport: MemberReportRow[];
}) {
  const [tab, setTab] = useState("income");

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="income">Thu chi</TabsTrigger>
          <TabsTrigger value="wins">Lịch sử hốt</TabsTrigger>
          <TabsTrigger value="debt">Công nợ</TabsTrigger>
          <TabsTrigger value="members">Thành viên</TabsTrigger>
        </TabsList>
        <ExportButton />
      </div>

      <TabsContent value="income" className="mt-4 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dây hụi</TableHead>
              <TableHead>Cần thu</TableHead>
              <TableHead>Đã thu</TableHead>
              <TableHead>Còn thiếu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomeExpense.map((row) => (
              <TableRow key={row.chainId}>
                <TableCell>{row.chainName}</TableCell>
                <TableCell>{formatVND(row.totalDue)}</TableCell>
                <TableCell>{formatVND(row.totalPaid)}</TableCell>
                <TableCell>{formatVND(row.outstanding)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="wins" className="mt-4 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dây hụi</TableHead>
              <TableHead>Kỳ</TableHead>
              <TableHead>Người hốt</TableHead>
              <TableHead>Số tiền nhận</TableHead>
              <TableHead>Tiền bỏ hụi</TableHead>
              <TableHead>Ngày hốt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {winHistory.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.chainName}</TableCell>
                <TableCell>Kỳ {row.periodNo}</TableCell>
                <TableCell>{row.memberName}</TableCell>
                <TableCell>{formatVND(row.amount)}</TableCell>
                <TableCell>
                  {row.bidAmount != null ? formatVND(row.bidAmount) : "—"}
                </TableCell>
                <TableCell>{formatDate(row.closedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="debt" className="mt-4 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thành viên</TableHead>
              <TableHead>Dây hụi</TableHead>
              <TableHead>Đã đóng</TableHead>
              <TableHead>Còn nợ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debtReport.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.memberName}</TableCell>
                <TableCell>{row.chainName}</TableCell>
                <TableCell>{formatVND(row.totalPaid)}</TableCell>
                <TableCell
                  className={row.totalOwed > 0 ? "font-medium text-destructive" : undefined}
                >
                  {formatVND(row.totalOwed)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="members" className="mt-4 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Số dây hụi</TableHead>
              <TableHead>Tổng số phần</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberReport.map((row) => (
              <TableRow key={row.memberId}>
                <TableCell>{row.fullName}</TableCell>
                <TableCell>{row.phone || "—"}</TableCell>
                <TableCell>{row.status === "active" ? "Hoạt động" : "Ngưng"}</TableCell>
                <TableCell>{row.chainCount}</TableCell>
                <TableCell>{row.shareCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
