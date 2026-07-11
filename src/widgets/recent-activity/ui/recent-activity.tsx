"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/routing";
import Image from "next/image";
import { fetchUsers } from "@/shared/api/users";
import { fetchProducts } from "@/shared/api/products";
import { fetchOrders } from "@/shared/api/orders";
import { queryKeys } from "@/shared/config/query-keys";
import { formatCurrency, getInitials } from "@/shared/lib/utils";
import { useApiErrorMessage } from "@/shared/hooks/use-api-error-message";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";

export function RecentActivity({ ready = false }: { ready?: boolean }) {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");

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

  const usersError = useApiErrorMessage(usersQuery.error);
  const productsError = useApiErrorMessage(productsQuery.error);
  const ordersError = useApiErrorMessage(ordersQuery.error);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ActivityCard
        title={t("recentUsers")}
        viewAllHref="/users"
        viewAllLabel={tc("viewAll")}
        isLoading={!ready && usersQuery.isPending}
        isError={usersQuery.isError}
        errorMessage={usersError}
        onRetry={() => usersQuery.refetch()}
        retryLabel={tc("retry")}
        isEmpty={!usersQuery.data?.users.length}
        emptyLabel={tc("noData")}
      >
        {usersQuery.data?.users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ))}
      </ActivityCard>

      <ActivityCard
        title={t("recentProducts")}
        viewAllHref="/products"
        viewAllLabel={tc("viewAll")}
        isLoading={!ready && productsQuery.isPending}
        isError={productsQuery.isError}
        errorMessage={productsError}
        onRetry={() => productsQuery.refetch()}
        retryLabel={tc("retry")}
        isEmpty={!productsQuery.data?.products.length}
        emptyLabel={tc("noData")}
      >
        {productsQuery.data?.products.map((product) => (
          <div key={product.id} className="flex items-center gap-3 py-2">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={32}
              height={32}
              className="h-8 w-8 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.title}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(product.price)}</p>
            </div>
          </div>
        ))}
      </ActivityCard>

      <ActivityCard
        title={t("recentOrders")}
        viewAllHref="/orders"
        viewAllLabel={tc("viewAll")}
        isLoading={!ready && ordersQuery.isPending}
        isError={ordersQuery.isError}
        errorMessage={ordersError}
        onRetry={() => ordersQuery.refetch()}
        retryLabel={tc("retry")}
        isEmpty={!ordersQuery.data?.orders.length}
        emptyLabel={tc("noData")}
      >
        {ordersQuery.data?.orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Order #{order.id}</p>
              <p className="text-xs text-muted-foreground">{order.totalProducts} items</p>
            </div>
            <p className="text-sm font-semibold">{formatCurrency(order.discountedTotal)}</p>
          </div>
        ))}
      </ActivityCard>
    </div>
  );
}

function ActivityCard({
  title,
  children,
  viewAllHref,
  viewAllLabel,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  retryLabel,
  isEmpty,
  emptyLabel,
}: {
  title: string;
  children: React.ReactNode;
  viewAllHref: string;
  viewAllLabel: string;
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  retryLabel?: string;
  isEmpty?: boolean;
  emptyLabel?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <Link
          href={viewAllHref}
          className="rounded text-xs text-primary hover:underline outline-none focus:outline-none focus-visible:outline-none"
        >
          {viewAllLabel}
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={onRetry} retryLabel={retryLabel} />
        ) : isEmpty ? (
          <EmptyState title={emptyLabel || "No data"} />
        ) : (
          <div className="divide-y divide-border">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
