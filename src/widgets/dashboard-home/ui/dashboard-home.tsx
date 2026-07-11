"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { PageHeading } from "@/widgets/page-heading/ui/page-heading";
import { StatsCards } from "@/widgets/stats-cards/ui/stats-cards";
import { DashboardCharts } from "@/widgets/dashboard-charts/ui/dashboard-charts";
import { RecentActivity } from "@/widgets/recent-activity/ui/recent-activity";
import { DashboardSkeleton } from "@/widgets/dashboard-home/ui/dashboard-skeleton";
import { fetchDashboardStats } from "@/shared/api/dashboard";
import { fetchUsers } from "@/shared/api/users";
import { fetchProducts } from "@/shared/api/products";
import { fetchOrders } from "@/shared/api/orders";
import {
  fetchRevenueByMonth,
  fetchProductsByCategory,
  fetchTopProducts,
  fetchUsersByCountry,
} from "@/shared/api/dashboard";
import { queryKeys } from "@/shared/config/query-keys";
import { ErrorState } from "@/shared/ui/error-state";

export function DashboardHome() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");

  const statsQuery = useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: fetchDashboardStats,
  });
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
  const usersQuery = useQuery({
    queryKey: queryKeys.users.list({ limit: 5, skip: 0 }),
    queryFn: () => fetchUsers({ limit: 5, skip: 0 }),
  });
  const productsQuery = useQuery({
    queryKey: queryKeys.products.list({ limit: 5, skip: 0 }),
    queryFn: () => fetchProducts({ limit: 5, skip: 0 }),
  });
  const ordersQuery = useQuery({
    queryKey: queryKeys.orders.list({ limit: 5, skip: 0 }),
    queryFn: () => fetchOrders({ limit: 5, skip: 0 }),
  });

  const queries = [
    statsQuery,
    revenueQuery,
    categoryQuery,
    topProductsQuery,
    countryQuery,
    usersQuery,
    productsQuery,
    ordersQuery,
  ];

  const isPending = queries.some((q) => q.isPending);
  const isError = queries.some((q) => q.isError);

  const refetchAll = () => {
    queries.forEach((q) => q.refetch());
  };

  if (isPending) {
    return (
      <div className="space-y-8">
        <PageHeading title={t("welcome")} />
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <PageHeading title={t("welcome")} />
        <ErrorState onRetry={refetchAll} retryLabel={tc("retry")} />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <PageHeading title={t("welcome")} />
      <StatsCards stats={statsQuery.data} animate />
      <DashboardCharts ready />
      <RecentActivity ready />
    </motion.div>
  );
}
