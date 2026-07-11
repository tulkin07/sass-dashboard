"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Columns3,
  Download,
  MoreVertical,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import { fetchProducts, fetchProductCategories } from "@/shared/api/products";
import { queryKeys } from "@/shared/config/query-keys";
import { DEFAULT_PAGE_SIZE } from "@/shared/config/constants";
import {
  cn,
  downloadCSV,
  formatCurrency,
  formatDateTime,
  getProductCreatedAt,
  getProductPublishStatus,
  getProductStockLevel,
} from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Checkbox } from "@/shared/ui/checkbox";
import { Pagination } from "@/shared/ui/pagination";
import {
  DataTableCard,
  DataTableFilterSelect,
  DataTableFooter,
  DataTableSearch,
  DataTableSortSelect,
  DataTableToolbar,
  DataTableToolbarGroup,
  DataTableToolbarRow,
  tableCellComfortClass,
  tableCellDenseClass,
  tableHeadClass,
} from "@/shared/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { TableRowSkeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import type {
  Product,
  ProductPublishStatus,
  ProductStockLevel,
} from "@/shared/types/api";

type SortField = "title" | "price" | "stock" | "rating" | "createdAt";
type SortOrder = "asc" | "desc";

const ALL_COLUMNS = [
  { id: "product", labelKey: "product" },
  { id: "createdAt", labelKey: "createdAt" },
  { id: "stock", labelKey: "stock" },
  { id: "price", labelKey: "price" },
  { id: "publish", labelKey: "publish" },
  { id: "actions", labelKey: "actions" },
] as const;

type ColumnId = (typeof ALL_COLUMNS)[number]["id"];

export function ProductsTable() {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [stockFilter, setStockFilter] = useState<ProductStockLevel | "all">("all");
  const [publishFilter, setPublishFilter] = useState<ProductPublishStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dense, setDense] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(
    ALL_COLUMNS.map((c) => c.id)
  );

  const searchTimeout = useMemo(() => {
    let timer: ReturnType<typeof setTimeout>;
    return (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setDebouncedSearch(value);
        setPage(1);
      }, 300);
    };
  }, []);

  const categoriesQuery = useQuery({
    queryKey: queryKeys.products.categories(),
    queryFn: fetchProductCategories,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.products.list({
      limit: 100,
      skip: 0,
      q: debouncedSearch,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    }),
    queryFn: () =>
      fetchProducts({
        limit: 100,
        skip: 0,
        q: debouncedSearch || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
      }),
  });

  const productsWithMeta = useMemo(
    () =>
      (data?.products || []).map((product) => ({
        ...product,
        createdAt: getProductCreatedAt(product.id),
        publishStatus: getProductPublishStatus(product.id),
        stockLevel: getProductStockLevel(product.stock),
      })),
    [data?.products]
  );

  const processedProducts = useMemo(() => {
    let products = [...productsWithMeta];

    if (stockFilter !== "all") {
      products = products.filter((p) => p.stockLevel === stockFilter);
    }

    if (publishFilter !== "all") {
      products = products.filter((p) => p.publishStatus === publishFilter);
    }

    if (minPrice) {
      products = products.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.price <= Number(maxPrice));
    }
    if (minRating !== "all") {
      products = products.filter((p) => p.rating >= Number(minRating));
    }

    products.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "price":
          cmp = a.price - b.price;
          break;
        case "stock":
          cmp = a.stock - b.stock;
          break;
        case "rating":
          cmp = a.rating - b.rating;
          break;
        case "createdAt":
          cmp = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        default:
          cmp = a.title.localeCompare(b.title);
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return products;
  }, [
    productsWithMeta,
    stockFilter,
    publishFilter,
    minPrice,
    maxPrice,
    minRating,
    sortField,
    sortOrder,
  ]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedProducts.slice(start, start + pageSize);
  }, [processedProducts, page, pageSize]);

  const totalPages = Math.ceil(processedProducts.length / pageSize);

  const toggleColumn = (column: ColumnId) => {
    setVisibleColumns((prev) => {
      if (prev.includes(column)) {
        if (prev.length <= 1) return prev;
        return prev.filter((c) => c !== column);
      }
      return [...prev, column];
    });
  };

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleExport = () => {
    const exportData = (selectedRows.length > 0
      ? processedProducts.filter((p) => selectedRows.includes(p.id))
      : processedProducts
    ).map((product) => ({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      stock: product.stock,
      publish: product.publishStatus,
      createdAt: formatDateTime(product.createdAt, locale),
    }));
    downloadCSV(exportData, "products-export.csv");
  };

  const cellClass = dense ? tableCellDenseClass : tableCellComfortClass;

  const toolbarButtonClass =
    "h-9 shrink-0 rounded-lg border-border bg-background px-3 text-sm shadow-none";

  const sortValue = `${sortField}-${sortOrder}`;
  const hasAdvancedFilters = Boolean(minPrice || maxPrice || minRating !== "all");

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-") as [SortField, SortOrder];
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  };

  const clearAdvancedFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("all");
    setPage(1);
  };

  if (isError) {
    return <ErrorState onRetry={() => refetch()} retryLabel={tc("retry")} />;
  }

  return (
    <DataTableCard>
      <DataTableToolbar>
        <div className="flex flex-col gap-3">
          <DataTableToolbarRow>
            <DataTableToolbarGroup className="w-full">
            <DataTableFilterSelect
              value={categoryFilter}
              onChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
              label={t("category")}
              options={[
                { value: "all", label: t("allCategories") },
                ...(categoriesQuery.data || []).map((cat) => ({
                  value: cat.slug,
                  label: cat.name,
                })),
              ]}
            />

            <DataTableFilterSelect
              value={stockFilter}
              onChange={(value) => {
                setStockFilter(value as ProductStockLevel | "all");
                setPage(1);
              }}
              label={t("stock")}
              options={[
                { value: "all", label: t("stock") },
                { value: "in_stock", label: t("inStock") },
                { value: "low_stock", label: t("lowStock") },
                { value: "out_of_stock", label: t("outOfStock") },
              ]}
            />

            <DataTableFilterSelect
              value={publishFilter}
              onChange={(value) => {
                setPublishFilter(value as ProductPublishStatus | "all");
                setPage(1);
              }}
              label={t("publish")}
              options={[
                { value: "all", label: t("publish") },
                { value: "published", label: t("published") },
                { value: "draft", label: t("draft") },
              ]}
            />

            <DataTableSearch
              value={search}
              onChange={(value) => {
                setSearch(value);
                searchTimeout(value);
              }}
              placeholder={t("search")}
              className="w-full max-w-none lg:w-[240px]"
            />
          </DataTableToolbarGroup>
          </DataTableToolbarRow>

          <DataTableToolbarRow>
          <DataTableToolbarGroup className="w-full lg:ml-auto lg:w-auto lg:justify-end">
            <DataTableSortSelect
              value={sortValue}
              onChange={handleSortChange}
              label={tc("sort")}
              options={[
                { value: "createdAt-desc", label: t("sortNewest") },
                { value: "createdAt-asc", label: t("sortOldest") },
                { value: "title-asc", label: t("sortNameAsc") },
                { value: "title-desc", label: t("sortNameDesc") },
                { value: "price-asc", label: t("sortPriceAsc") },
                { value: "price-desc", label: t("sortPriceDesc") },
                { value: "rating-desc", label: t("sortRatingDesc") },
                { value: "stock-asc", label: t("sortStockAsc") },
                { value: "stock-desc", label: t("sortStockDesc") },
              ]}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={toolbarButtonClass}>
                  <Columns3 className="h-4 w-4" />
                  <span className="hidden md:inline">{t("columns")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("columns")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_COLUMNS.filter((c) => c.id !== "actions").map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={visibleColumns.includes(col.id)}
                    onCheckedChange={() => toggleColumn(col.id)}
                  >
                    {t(col.labelKey)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(toolbarButtonClass, hasAdvancedFilters && "border-primary/40")}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden md:inline">{t("filters")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3">
                <DropdownMenuLabel>{t("priceRange")}</DropdownMenuLabel>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder={t("minPrice")}
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    aria-label={t("minPrice")}
                    className="h-8"
                  />
                  <Input
                    type="number"
                    placeholder={t("maxPrice")}
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    aria-label={t("maxPrice")}
                    className="h-8"
                  />
                </div>
                <DropdownMenuLabel>{t("minRating")}</DropdownMenuLabel>
                <Select
                  value={minRating}
                  onValueChange={(value) => {
                    setMinRating(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="mb-3 h-8" aria-label={t("minRating")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("minRating")}</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="4.5">4.5+</SelectItem>
                  </SelectContent>
                </Select>
                {hasAdvancedFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full"
                    onClick={clearAdvancedFilters}
                  >
                    {tc("clear")}
                  </Button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              className={toolbarButtonClass}
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">{t("export")}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={toolbarButtonClass}>
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden md:inline">{t("settings")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={dense}
                  onCheckedChange={(checked) => setDense(checked === true)}
                >
                  {tc("dense")}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DataTableToolbarGroup>
          </DataTableToolbarRow>
        </div>
      </DataTableToolbar>

      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-4 py-2 text-sm md:px-5">
          <span>{t("selected", { count: selectedRows.length })}</span>
          <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>
            {tc("clear")}
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="w-10 px-4 py-3" scope="col">
                <Checkbox
                  checked={
                    paginatedProducts.length > 0 &&
                    paginatedProducts.every((p) => selectedRows.includes(p.id))
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>
              {visibleColumns.includes("product") && (
                <th className={tableHeadClass} scope="col">
                  {t("product")}
                </th>
              )}
              {visibleColumns.includes("createdAt") && (
                <th className={tableHeadClass} scope="col">
                  {t("createdAt")}
                </th>
              )}
              {visibleColumns.includes("stock") && (
                <th className={tableHeadClass} scope="col">
                  {t("stock")}
                </th>
              )}
              {visibleColumns.includes("price") && (
                <th className={tableHeadClass} scope="col">
                  {t("price")}
                </th>
              )}
              {visibleColumns.includes("publish") && (
                <th className={tableHeadClass} scope="col">
                  {t("publish")}
                </th>
              )}
              {visibleColumns.includes("actions") && (
                <th className={cn(tableHeadClass, "w-12")} scope="col" />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRowSkeleton key={i} columns={7} />
              ))
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState title={t("noProducts")} />
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  locale={locale}
                  visibleColumns={visibleColumns}
                  isSelected={selectedRows.includes(product.id)}
                  onToggle={() => toggleRow(product.id)}
                  cellClass={cellClass}
                  t={t}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataTableFooter
        dense={dense}
        onDenseChange={setDense}
        denseLabel={tc("dense")}
      >
        <Pagination
          compact
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={processedProducts.length}
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

function ProductRow({
  product,
  locale,
  visibleColumns,
  isSelected,
  onToggle,
  cellClass,
  t,
}: {
  product: Product & {
    createdAt: Date;
    publishStatus: ProductPublishStatus;
    stockLevel: ProductStockLevel;
  };
  locale: string;
  visibleColumns: ColumnId[];
  isSelected: boolean;
  onToggle: () => void;
  cellClass: string;
  t: ReturnType<typeof useTranslations<"products">>;
}) {
  const categoryLabel = product.category.replace(/-/g, " ");

  return (
    <tr className="transition-colors hover:bg-muted/25">
      <td className={cellClass}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          aria-label={`Select ${product.title}`}
        />
      </td>
      {visibleColumns.includes("product") && (
        <td className={cellClass}>
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <button
                type="button"
                className="truncate text-left text-sm font-medium text-info hover:underline"
              >
                {product.title}
              </button>
              <p className="truncate text-xs capitalize text-muted-foreground">
                {categoryLabel}
              </p>
            </div>
          </div>
        </td>
      )}
      {visibleColumns.includes("createdAt") && (
        <td className={cn(cellClass, "whitespace-nowrap text-muted-foreground")}>
          {formatDateTime(product.createdAt, locale)}
        </td>
      )}
      {visibleColumns.includes("stock") && (
        <td className={cellClass}>
          <StockBar stock={product.stock} stockLevel={product.stockLevel} t={t} />
        </td>
      )}
      {visibleColumns.includes("price") && (
        <td className={cn(cellClass, "whitespace-nowrap font-medium")}>
          {formatCurrency(product.price, locale)}
        </td>
      )}
      {visibleColumns.includes("publish") && (
        <td className={cellClass}>
          <PublishBadge status={product.publishStatus} t={t} />
        </td>
      )}
      {visibleColumns.includes("actions") && (
        <td className={cellClass}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground"
                aria-label={t("actions")}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("view")}</DropdownMenuItem>
              <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      )}
    </tr>
  );
}

function StockBar({
  stock,
  stockLevel,
  t,
}: {
  stock: number;
  stockLevel: ProductStockLevel;
  t: ReturnType<typeof useTranslations<"products">>;
}) {
  const barWidth = stock === 0 ? 0 : Math.min((stock / 100) * 100, 100);

  const styles: Record<ProductStockLevel, { bar: string; text: string; label: string }> = {
    out_of_stock: {
      bar: "bg-destructive",
      text: "text-destructive",
      label: t("outOfStock"),
    },
    low_stock: {
      bar: "bg-warning",
      text: "text-warning",
      label: t("lowStockCount", { count: stock }),
    },
    in_stock: {
      bar: "bg-success",
      text: "text-success",
      label: t("inStockCount", { count: stock }),
    },
  };

  const style = styles[stockLevel];

  return (
    <div className="min-w-0 sm:min-w-[120px]">
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", style.bar)}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <p className={cn("mt-1.5 text-xs", style.text)}>{style.label}</p>
    </div>
  );
}

function PublishBadge({
  status,
  t,
}: {
  status: ProductPublishStatus;
  t: ReturnType<typeof useTranslations<"products">>;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold capitalize",
        status === "published"
          ? "bg-success/15 text-success"
          : "bg-muted text-muted-foreground"
      )}
    >
      {status === "published" ? t("published") : t("draft")}
    </span>
  );
}
