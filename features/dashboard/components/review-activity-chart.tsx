"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DailyActivity } from "../server/get-dashboard-data";
import { useMemo } from "react";

const chartConfig = {
  reviews: {
    label: "PRs Reviewed",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

type ReviewActivityChartProps = {
  data: DailyActivity[];
};

export function ReviewActivityChart({ data }: ReviewActivityChartProps) {
  const totalPeriodReviews = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.reviews, 0);
  }, [data]);

  return (
    <Card className="flex flex-col border-border/80 shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Review Activity</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Pull requests reviewed over the last 14 days
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold font-mono text-foreground">
              {totalPeriodReviews}
            </span>
            <p className="text-[11px] text-muted-foreground">total in 14d</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-48 w-full">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillReviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => `${value}`}
                />
              }
            />
            <Area
              dataKey="reviews"
              type="monotone"
              fill="url(#fillReviews)"
              fillOpacity={0.4}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 2, fill: "#3b82f6" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
