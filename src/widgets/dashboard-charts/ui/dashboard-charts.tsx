"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import {
  fetchRevenueByMonth,
  fetchProductsByCategory,
  fetchTopProducts,
  fetchUsersByCountry,
} from "@/shared/api/dashboard";
import { queryKeys } from "@/shared/config/query-keys";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ChartSkeleton } from "@/shared/ui/skeleton";
import { ErrorState } from "@/shared/ui/error-state";

const RevenueChart = dynamic(
  () => import("./charts").then((m) => m.RevenueChart),
  { ssr: false }
);
const OrdersCountChart = dynamic(
  () => import("./charts").then((m) => m.OrdersCountChart),
  { ssr: false }
);
const CategoryChart = dynamic(
  () => import("./charts").then((m) => m.CategoryChart),
  { ssr: false }
);
const CountryChart = dynamic(
  () => import("./charts").then((m) => m.CountryChart),
  { ssr: false }
);
const TopProductsChart = dynamic(
  () => import("./charts").then((m) => m.TopProductsChart),
  { ssr: false }
);

export function DashboardCharts({ ready = false }: { ready?: boolean }) {
  const t = useTranslations("dashboard");

  const revenueQuery = useQuery({
    queryKey: queryKeys.dashboard.revenue(),
    queryFn: fetchRevenueByMonth,
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t("productsByCategory")}</CardTitle>
            <CardDescription className="text-xs">{t("categoryDistribution")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {!ready && categoryQuery.isPending ? (
              <ChartSkeleton />
            ) : categoryQuery.isError ? (
              <ErrorState onRetry={() => categoryQuery.refetch()} />
            ) : (
              <CategoryChart data={categoryQuery.data || []} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-semibold">{t("revenueByMonth")}</CardTitle>
              <CardDescription className="text-xs">
                <span className="font-semibold text-[#00AB55]">(+43%)</span> {t("thanLastYear")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {!ready && revenueQuery.isPending ? (
              <ChartSkeleton />
            ) : revenueQuery.isError ? (
              <ErrorState onRetry={() => revenueQuery.refetch()} />
            ) : (
              <RevenueChart data={revenueQuery.data || []} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t("usersByCountry")}</CardTitle>
            <CardDescription className="text-xs">{t("topCountries")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {!ready && countryQuery.isPending ? (
              <ChartSkeleton />
            ) : countryQuery.isError ? (
              <ErrorState onRetry={() => countryQuery.refetch()} />
            ) : (
              <CountryChart data={countryQuery.data || []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t("ordersCount")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {!ready && revenueQuery.isPending ? (
              <ChartSkeleton />
            ) : revenueQuery.isError ? (
              <ErrorState onRetry={() => revenueQuery.refetch()} />
            ) : (
              <OrdersCountChart data={revenueQuery.data || []} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">{t("topProducts")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {!ready && topProductsQuery.isPending ? (
            <ChartSkeleton />
          ) : topProductsQuery.isError ? (
            <ErrorState onRetry={() => topProductsQuery.refetch()} />
          ) : (
            <TopProductsChart data={topProductsQuery.data || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
