"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import { fetchOrders } from "@/shared/api/orders";
import { fetchAllUsers } from "@/shared/api/users";
import { queryKeys } from "@/shared/config/query-keys";
import { DEFAULT_PAGE_SIZE } from "@/shared/config/constants";
import { formatCurrency, getOrderStatus, cn } from "@/shared/lib/utils";
import { StatusBadge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Pagination } from "@/shared/ui/pagination";
import {
  DataTableCard,
  DataTableFilterMeta,
  DataTableFooter,
  DataTableSearch,
  DataTableSortSelect,
  DataTableTabs,
  DataTableToolbar,
  DataTableToolbarGroup,
  DataTableToolbarRow,
  tableCellComfortClass,
  tableCellDenseClass,
  tableHeadClass,
  type DataTableFilterChip,
  type DataTableTab,
} from "@/shared/ui/data-table";
import { TableRowSkeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import type { OrderStatus } from "@/shared/types/api";

type SortField = "id" | "total" | "quantity";
type SortOrder = "asc" | "desc";

export function OrdersTable() {
  const t = useTranslations("orders");
  const tc = useTranslations("common");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dense, setDense] = useState(false);

  const usersQuery = useQuery({
    queryKey: queryKeys.users.allData(),
    queryFn: fetchAllUsers,
    staleTime: 10 * 60 * 1000,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.orders.list({ limit: 0 }),
    queryFn: () => fetchOrders({ limit: 0 }),
  });

  const userMap = useMemo(() => {
    const map = new Map<number, string>();
    usersQuery.data?.forEach((user) => {
      map.set(user.id, `${user.firstName} ${user.lastName}`);
    });
    return map;
  }, [usersQuery.data]);

  const ordersWithStatus = useMemo(
    () =>
      (data?.orders || []).map((order) => ({
        ...order,
        status: getOrderStatus(order.id),
        customerName: userMap.get(order.userId) || `User #${order.userId}`,
      })),
    [data?.orders, userMap]
  );

  const statusCounts = useMemo(() => {
    const count = (status: OrderStatus) =>
      ordersWithStatus.filter((o) => o.status === status).length;
    return {
      all: ordersWithStatus.length,
      pending: count("pending"),
      processing: count("processing"),
      shipped: count("shipped"),
      delivered: count("delivered"),
      cancelled: count("cancelled"),
    };
  }, [ordersWithStatus]);

  const statusTabs: DataTableTab[] = [
    { value: "all", label: tc("all"), count: statusCounts.all, countVariant: "plain" },
    {
      value: "pending",
      label: t("pending"),
      count: statusCounts.pending,
      badgeTone: "warning",
    },
    {
      value: "processing",
      label: t("processing"),
      count: statusCounts.processing,
      badgeTone: "info",
    },
    {
      value: "shipped",
      label: t("shipped"),
      count: statusCounts.shipped,
      badgeTone: "info",
    },
    {
      value: "delivered",
      label: t("delivered"),
      count: statusCounts.delivered,
      badgeTone: "success",
    },
    {
      value: "cancelled",
      label: t("cancelled"),
      count: statusCounts.cancelled,
      badgeTone: "danger",
    },
  ];

  const processedOrders = useMemo(() => {
    let orders = [...ordersWithStatus];

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          String(o.id).includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.products.some((p) => p.title.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      orders = orders.filter((o) => o.status === statusFilter);
    }

    orders.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "total":
          cmp = a.discountedTotal - b.discountedTotal;
          break;
        case "quantity":
          cmp = a.totalQuantity - b.totalQuantity;
          break;
        default:
          cmp = a.id - b.id;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return orders;
  }, [ordersWithStatus, search, statusFilter, sortField, sortOrder]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedOrders.slice(start, start + pageSize);
  }, [processedOrders, page, pageSize]);

  const totalPages = Math.ceil(processedOrders.length / pageSize);

  const filterChips: DataTableFilterChip[] = useMemo(() => {
    if (!search) return [];

    return [
      {
        id: "search",
        label: `${tc("search")}: ${search}`,
      },
    ];
  }, [search, tc]);

  const sortOptions = [
    { value: "id-desc", label: t("sortNewest") },
    { value: "id-asc", label: t("sortOldest") },
    { value: "total-desc", label: t("sortTotalHigh") },
    { value: "total-asc", label: t("sortTotalLow") },
    { value: "quantity-desc", label: t("sortItemsHigh") },
  ];

  const clearFilters = () => {
    setSearch("");
    setPage(1);
  };

  const removeChip = (id: string) => {
    if (id === "search") setSearch("");
    setPage(1);
  };

  const cellClass = dense ? tableCellDenseClass : tableCellComfortClass;

  if (isError) {
    return <ErrorState onRetry={() => refetch()} retryLabel={tc("retry")} />;
  }

  return (
    <DataTableCard>
      <DataTableTabs
        tabs={statusTabs}
        value={statusFilter}
        onChange={(value) => {
          setStatusFilter(value as OrderStatus | "all");
          setPage(1);
        }}
      />

      <DataTableToolbar>
        <DataTableToolbarRow>
          <DataTableToolbarGroup className="min-w-0 flex-1">
            <DataTableSearch
              className="w-full max-w-sm"
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder={t("search")}
            />
          </DataTableToolbarGroup>

          <DataTableToolbarGroup className="ml-auto">
            <DataTableSortSelect
              value={`${sortField}-${sortOrder}`}
              onChange={(value) => {
                const [field, order] = value.split("-") as [SortField, SortOrder];
                setSortField(field);
                setSortOrder(order);
              }}
              label={tc("sort")}
              options={sortOptions}
            />
          </DataTableToolbarGroup>
        </DataTableToolbarRow>

        <DataTableFilterMeta
          className="mt-2.5"
          resultsCount={processedOrders.length}
          resultsLabel={tc("resultsFound")}
          chips={filterChips}
          onRemoveChip={removeChip}
          onClear={clearFilters}
          clearLabel={tc("clear")}
        />
      </DataTableToolbar>

      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className={tableHeadClass} scope="col">ID</th>
              <th className={tableHeadClass} scope="col">{t("customer")}</th>
              <th className={tableHeadClass} scope="col">{t("products")}</th>
              <th className={tableHeadClass} scope="col">{t("quantity")}</th>
              <th className={tableHeadClass} scope="col">{t("total")}</th>
              <th className={tableHeadClass} scope="col">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRowSkeleton key={i} columns={6} />
              ))
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState title={t("noOrders")} />
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-muted/25">
                  <td className={cn(cellClass, "font-semibold")}>#{order.id}</td>
                  <td className={cellClass}>{order.customerName}</td>
                  <td className={cellClass}>
                    <div className="flex items-center gap-1">
                      {order.products.slice(0, 3).map((product) => (
                        <Image
                          key={product.id}
                          src={product.thumbnail}
                          alt={product.title}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-md object-cover"
                        />
                      ))}
                      {order.products.length > 3 && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          +{order.products.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={cellClass}>{order.totalQuantity}</td>
                  <td className={cn(cellClass, "font-semibold")}>
                    {formatCurrency(order.discountedTotal)}
                  </td>
                  <td className={cellClass}>
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataTableFooter dense={dense} onDenseChange={setDense} denseLabel={tc("dense")}>
        <Pagination
          compact
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={processedOrders.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          rowsPerPageLabel={tc("rowsPerPage")}
          previousLabel={tc("previous")}
          nextLabel={tc("next")}
          ofLabel={tc("of")}
        />
      </DataTableFooter>
    </DataTableCard>
  );
}
