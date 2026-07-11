"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { TrendingDown, TrendingUp } from "lucide-react";
import { fetchDashboardStats } from "@/shared/api/dashboard";
import { queryKeys } from "@/shared/config/query-keys";
import { formatCurrency, formatNumber, cn } from "@/shared/lib/utils";
import { AnimatedNumber } from "@/shared/ui/animated-number";
import { Card } from "@/shared/ui/card";
import { MiniBarChart } from "@/shared/ui/mini-bar-chart";
import { StatsCardSkeleton } from "@/shared/ui/skeleton";
import { ErrorState } from "@/shared/ui/error-state";
import type { DashboardStats } from "@/shared/types/api";

type StatConfig = {
  key: keyof DashboardStats;
  barColor: string;
  trend: number;
  bars: number[];
  isCurrency?: boolean;
  isRating?: boolean;
  decimals?: number;
};

const allStats: StatConfig[] = [
  { key: "totalUsers", barColor: "#4A90E2", trend: 2.6, bars: [40, 55, 45, 70, 60, 85, 75] },
  { key: "totalProducts", barColor: "#00B8D9", trend: 0.2, bars: [50, 48, 52, 47, 55, 50, 58] },
  { key: "totalOrders", barColor: "#8E33FF", trend: 2.8, bars: [30, 42, 38, 55, 48, 62, 58] },
  {
    key: "totalRevenue",
    barColor: "#FF6B6B",
    trend: -0.1,
    bars: [65, 58, 62, 50, 55, 48, 45],
    isCurrency: true,
    decimals: 2,
  },
  {
    key: "averageRating",
    barColor: "#4A90E2",
    trend: 1.2,
    bars: [60, 65, 62, 70, 68, 72, 75],
    isRating: true,
    decimals: 2,
  },
  { key: "lowStockProducts", barColor: "#FFAB00", trend: -3.4, bars: [80, 75, 70, 68, 65, 60, 55] },
];

function StatCard({
  label,
  value,
  trend,
  bars,
  barColor,
  last7DaysLabel,
  isCurrency,
  isRating,
  decimals = 0,
  locale,
  animate,
}: {
  label: string;
  value: number;
  trend: number;
  bars: number[];
  barColor: string;
  last7DaysLabel: string;
  isCurrency?: boolean;
  isRating?: boolean;
  decimals?: number;
  locale: string;
  animate?: boolean;
}) {
  const isPositive = trend >= 0;

  const formatValue = (current: number) => {
    if (isCurrency) return formatCurrency(current, locale);
    if (isRating) return current.toFixed(2);
    return formatNumber(Math.round(current), locale);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-xl font-bold leading-none tracking-tight text-foreground tabular-nums sm:text-2xl">
            <AnimatedNumber
              key={animate ? `animate-${value}` : `static-${value}`}
              value={value}
              duration={animate ? 1200 : 0}
              decimals={decimals}
              format={formatValue}
            />
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] leading-none">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 shrink-0 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 shrink-0 text-destructive" />
            )}
            <span
              className={cn(
                "font-semibold",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {isPositive ? "+" : ""}
              {trend}%
            </span>
            <span className="text-muted-foreground">{last7DaysLabel}</span>
          </div>
        </div>
        <MiniBarChart
          data={bars}
          color={barColor}
          className="mt-5 hidden sm:flex"
        />
      </div>
    </Card>
  );
}

interface StatsCardsProps {
  stats?: DashboardStats;
  animate?: boolean;
}

export function StatsCards({ stats: statsProp, animate = false }: StatsCardsProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: fetchDashboardStats,
    enabled: !statsProp,
  });

  const stats = statsProp ?? data;

  if (!statsProp && isPending) {
    return (
      <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!statsProp && isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (!stats) return null;

  const labelMap: Record<string, string> = {
    totalUsers: t("totalUsers"),
    totalProducts: t("totalProducts"),
    totalOrders: t("totalOrders"),
    totalRevenue: t("totalRevenue"),
    averageRating: t("averageRating"),
    lowStockProducts: t("lowStock"),
  };

  return (
    <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allStats.map((stat) => (
        <StatCard
          key={stat.key}
          label={labelMap[stat.key]}
          value={stats[stat.key] as number}
          trend={stat.trend}
          bars={stat.bars}
          barColor={stat.barColor}
          last7DaysLabel={t("last7Days")}
          isCurrency={stat.isCurrency}
          isRating={stat.isRating}
          decimals={stat.decimals}
          locale={locale}
          animate={animate}
        />
      ))}
    </div>
  );
}
