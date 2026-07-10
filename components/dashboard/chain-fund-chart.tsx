"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatVND } from "@/lib/utils/currency";

const chartConfig: ChartConfig = {
  total_fund_value: { label: "Tổng quỹ", color: "var(--chart-1)" },
};

export function ChainFundChart({
  data,
}: {
  data: { name: string; total_fund_value: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quỹ theo dây hụi</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length ? (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) =>
                  value.length > 10 ? `${value.slice(0, 10)}…` : value
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatVND(Number(value))}
                  />
                }
              />
              <Bar dataKey="total_fund_value" fill="var(--color-total_fund_value)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Chưa có dây hụi nào đang hoạt động.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
