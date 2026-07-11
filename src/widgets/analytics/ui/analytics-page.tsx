"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import {
  fetchRevenueByMonth,
  fetchProductsByCategory,
  fetchTopProducts,
  fetchUsersByCountry,
  fetchDashboardStats,
} from "@/shared/api/dashboard";
import { queryKeys } from "@/shared/config/query-keys";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ChartSkeleton } from "@/shared/ui/skeleton";
import { ErrorState } from "@/shared/ui/error-state";
import { ANALYTICS_CHART_HEIGHT } from "@/widgets/dashboard-charts/ui/charts";

const PureLineChart = dynamic(
  () => import("@/widgets/dashboard-charts/ui/charts").then((m) => m.PureLineChart),
  { loading: () => <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />, ssr: false }
);
const LineChartWidget = dynamic(
  () => import("@/widgets/dashboard-charts/ui/charts").then((m) => m.LineChartWidget),
  { loading: () => <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />, ssr: false }
);
const AnalyticsBarChart = dynamic(
  () => import("@/widgets/dashboard-charts/ui/charts").then((m) => m.AnalyticsBarChart),
  { loading: () => <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />, ssr: false }
);
const PopularCategoriesChart = dynamic(
  () => import("@/widgets/dashboard-charts/ui/charts").then((m) => m.PopularCategoriesChart),
  { loading: () => <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />, ssr: false }
);
const CountryChart = dynamic(
  () => import("@/widgets/dashboard-charts/ui/charts").then((m) => m.CountryChart),
  { loading: () => <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />, ssr: false }
);

interface AnalyticsChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function AnalyticsChartCard({ title, description, children, className }: AnalyticsChartCardProps) {
  return (
    <Card className={className ?? "flex h-full flex-col"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="w-full" style={{ minHeight: ANALYTICS_CHART_HEIGHT }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsPage() {
  const t = useTranslations("analytics");

  const revenueQuery = useQuery({
    queryKey: queryKeys.dashboard.revenue(),
    queryFn: fetchRevenueByMonth,
  });
  const statsQuery = useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: fetchDashboardStats,
  });
  const categoryQuery = useQuery({
    queryKey: queryKeys.dashboard.categories(),
    queryFn: fetchProductsByCategory,
  });
  const topProductsQuery = useQuery({
    queryKey: queryKeys.dashboard.topProducts(),
    queryFn: fetchTopProducts,
  });
  const countryQuery = useQuery({
    queryKey: queryKeys.dashboard.usersByCountry(),
    queryFn: fetchUsersByCountry,
  });

  const usersGrowthData = revenueQuery.data?.map((item, index) => ({
    month: item.month,
    users: Math.round((statsQuery.data?.totalUsers || 0) * ((index + 1) / 12)),
  }));

  return (
    <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
      <AnalyticsChartCard title={t("revenue")}>
        {revenueQuery.isLoading ? (
          <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />
        ) : revenueQuery.isError ? (
          <ErrorState onRetry={() => revenueQuery.refetch()} />
        ) : (
          <LineChartWidget
            data={revenueQuery.data || []}
            dataKey="revenue"
            height={ANALYTICS_CHART_HEIGHT}
          />
        )}
      </AnalyticsChartCard>

      <AnalyticsChartCard title={t("orders")}>
        {revenueQuery.isLoading ? (
          <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />
        ) : revenueQuery.isError ? (
          <ErrorState onRetry={() => revenueQuery.refetch()} />
        ) : (
          <AnalyticsBarChart
            data={revenueQuery.data || []}
            dataKey="orders"
            xKey="month"
            height={ANALYTICS_CHART_HEIGHT}
          />
        )}
      </AnalyticsChartCard>

      <AnalyticsChartCard title={t("users")}>
        {revenueQuery.isLoading || statsQuery.isLoading ? (
          <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />
        ) : revenueQuery.isError || statsQuery.isError ? (
          <ErrorState
            onRetry={() => {
              revenueQuery.refetch();
              statsQuery.refetch();
            }}
          />
        ) : (
          <PureLineChart
            data={usersGrowthData || []}
            dataKey="users"
            height={ANALYTICS_CHART_HEIGHT}
            color="#00AB55"
          />
        )}
      </AnalyticsChartCard>

      <AnalyticsChartCard
        title={t("categories")}
        description={t("categoriesDescription")}
      >
        {categoryQuery.isLoading ? (
          <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />
        ) : categoryQuery.isError ? (
          <ErrorState onRetry={() => categoryQuery.refetch()} />
        ) : (
          <PopularCategoriesChart
            data={categoryQuery.data || []}
            totalLabel={t("totalProducts")}
            height={ANALYTICS_CHART_HEIGHT}
          />
        )}
      </AnalyticsChartCard>

      <AnalyticsChartCard title={t("countries")}>
        {countryQuery.isLoading ? (
          <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />
        ) : countryQuery.isError ? (
          <ErrorState onRetry={() => countryQuery.refetch()} />
        ) : (
          <CountryChart data={countryQuery.data || []} height={ANALYTICS_CHART_HEIGHT} />
        )}
      </AnalyticsChartCard>

      <AnalyticsChartCard title={t("topProducts")}>
        {topProductsQuery.isLoading ? (
          <ChartSkeleton height={ANALYTICS_CHART_HEIGHT} />
        ) : topProductsQuery.isError ? (
          <ErrorState onRetry={() => topProductsQuery.refetch()} />
        ) : (
          <AnalyticsBarChart
            data={(topProductsQuery.data || []).slice(0, 8).map((p) => ({
              name: p.title.length > 15 ? p.title.slice(0, 15) + "..." : p.title,
              sales: p.sales,
            }))}
            dataKey="sales"
            xKey="name"
            height={ANALYTICS_CHART_HEIGHT}
          />
        )}
      </AnalyticsChartCard>
    </div>
  );
}
