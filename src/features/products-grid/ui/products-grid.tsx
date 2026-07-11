"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import { LayoutGrid, List, Star } from "lucide-react";
import { fetchProducts, fetchProductCategories } from "@/shared/api/products";
import { queryKeys } from "@/shared/config/query-keys";
import { DEFAULT_PAGE_SIZE } from "@/shared/config/constants";
import {
  formatCurrency,
  calculateDiscountedPrice,
  cn,
} from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { PriceRangeFilter } from "@/shared/ui/price-range-slider";
import {
  DataTableCard,
  DataTableFilterSelect,
  DataTableSearch,
  DataTableTabs,
  DataTableToolbar,
  DataTableToolbarGroup,
  tableCellComfortClass,
  tableHeadClass,
  type DataTableTab,
} from "@/shared/ui/data-table";
import { ProductCardSkeleton, TableRowSkeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { Card, CardContent } from "@/shared/ui/card";
import type { Product } from "@/shared/types/api";

type SortField = "title" | "price" | "rating" | "stock";
type SortOrder = "asc" | "desc";
type ViewMode = "grid" | "list";

const PRICE_SLIDER_MAX = 2000;

function getStockStatus(stock: number) {
  if (stock === 0) return { label: "outOfStock" as const, tone: "danger" as const };
  if (stock < 10) return { label: "lowStock" as const, tone: "warning" as const };
  return { label: "inStock" as const, tone: "success" as const };
}

const stockToneClass = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
} as const;

function ProductsViewToggle({
  view,
  onChange,
  gridLabel,
  listLabel,
}: {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
  gridLabel: string;
  listLabel: string;
}) {
  return (
    <div className="flex shrink-0 items-center rounded-lg border border-border bg-background p-0.5">
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          view === "grid"
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={view === "grid"}
      >
        <LayoutGrid className="h-4 w-4" />
        {gridLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          view === "list"
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={view === "list"}
      >
        <List className="h-4 w-4" />
        {listLabel}
      </button>
    </div>
  );
}

function ProductsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  showingLabel,
  perPageLabel,
  previousLabel,
  nextLabel,
}: {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showingLabel: string;
  perPageLabel: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>([1, totalPages, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    if (currentPage > 2) pages.add(currentPage - 2);
    if (currentPage < totalPages - 1) pages.add(currentPage + 2);

    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">{showingLabel}</p>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label={previousLabel}
          >
            ‹
          </Button>

          {pageNumbers.map((page, index) => {
            const prev = pageNumbers[index - 1];
            const showEllipsis = prev !== undefined && page - prev > 1;

            return (
              <span key={page} className="flex items-center gap-1">
                {showEllipsis && (
                  <span className="px-1 text-sm text-muted-foreground">…</span>
                )}
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-9 min-w-9 rounded-lg px-2",
                    page === currentPage && "shadow-sm"
                  )}
                  onClick={() => onPageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </Button>
              </span>
            );
          })}

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || totalPages === 0}
            aria-label={nextLabel}
          >
            ›
          </Button>
        </div>

        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-9 w-[96px] rounded-lg" aria-label={perPageLabel}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 30, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} {perPageLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function ProductsGrid() {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, PRICE_SLIDER_MAX]);
  const [minRating, setMinRating] = useState("all");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [view, setView] = useState<ViewMode>("list");

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
      category: category !== "all" ? category : undefined,
    }),
    queryFn: () =>
      fetchProducts({
        limit: 100,
        skip: 0,
        q: debouncedSearch || undefined,
        category: category !== "all" ? category : undefined,
      }),
  });

  const processedProducts = useMemo(() => {
    if (!data?.products) return [];

    let products = [...data.products];

    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (minRating !== "all") {
      products = products.filter((p) => p.rating >= Number(minRating));
    }

    products.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "price":
          cmp = a.price - b.price;
          break;
        case "rating":
          cmp = a.rating - b.rating;
          break;
        case "stock":
          cmp = a.stock - b.stock;
          break;
        default:
          cmp = a.title.localeCompare(b.title);
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return products;
  }, [data?.products, priceRange, minRating, sortField, sortOrder]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedProducts.slice(start, start + pageSize);
  }, [processedProducts, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(processedProducts.length / pageSize));
  const sortValue = `${sortField}-${sortOrder}`;
  const start = processedProducts.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, processedProducts.length);

  const sortTabs: DataTableTab[] = useMemo(
    () => [
      { value: "title-desc", label: t("sortNewest") },
      { value: "title-asc", label: t("sortOldest") },
      { value: "price-desc", label: t("sortPriceDesc") },
      { value: "price-asc", label: t("sortPriceAsc") },
      { value: "rating-desc", label: t("sortRatingDesc") },
      { value: "stock-asc", label: t("sortStockAsc") },
    ],
    [t]
  );

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-") as [SortField, SortOrder];
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  };

  if (isError) {
    return <ErrorState onRetry={() => refetch()} retryLabel={tc("retry")} />;
  }

  return (
    <DataTableCard>
      <DataTableTabs
        tabs={sortTabs}
        value={sortValue}
        onChange={handleSortChange}
      />

      <DataTableToolbar>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <DataTableToolbarGroup className="w-auto min-w-0 flex-1 flex-wrap items-center gap-2">
            <DataTableSearch
              value={search}
              onChange={(value) => {
                setSearch(value);
                searchTimeout(value);
              }}
              placeholder={t("searchByName")}
              className="w-full max-w-[200px] shrink-0"
            />

            <DataTableFilterSelect
              value={category}
              onChange={(value) => {
                setCategory(value);
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
              value={minRating}
              onChange={(value) => {
                setMinRating(value);
                setPage(1);
              }}
              label={t("rating")}
              options={[
                { value: "all", label: t("rating") },
                { value: "3", label: "★ 3+" },
                { value: "4", label: "★ 4+" },
                { value: "4.5", label: "★ 4.5+" },
              ]}
            />

            <PriceRangeFilter
              min={0}
              max={PRICE_SLIDER_MAX}
              value={priceRange}
              onChange={(value) => {
                setPriceRange(value);
                setPage(1);
              }}
              minLabel={t("minPrice")}
              maxLabel={t("maxPrice")}
            />
          </DataTableToolbarGroup>

          <DataTableToolbarGroup className="w-auto shrink-0 justify-end md:ml-4">
            <ProductsViewToggle
              view={view}
              onChange={setView}
              gridLabel={t("gridView")}
              listLabel={t("listView")}
            />
          </DataTableToolbarGroup>
        </div>
      </DataTableToolbar>

      {view === "list" ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className={cn(tableHeadClass, "pl-5")}>{t("product")}</th>
                <th className={tableHeadClass}>{t("category")}</th>
                <th className={tableHeadClass}>{t("price")}</th>
                <th className={tableHeadClass}>{t("discount")}</th>
                <th className={tableHeadClass}>{t("rating")}</th>
                <th className={cn(tableHeadClass, "pr-5")}>{t("stock")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <TableRowSkeleton key={i} variant="products" />
                ))
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12">
                    <EmptyState title={t("noProducts")} />
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <ProductListRow
                    key={product.id}
                    product={product}
                    t={t}
                    locale={locale}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 md:p-5">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: pageSize }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <EmptyState title={t("noProducts")} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductGridCard
                  key={product.id}
                  product={product}
                  t={t}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="border-t border-border px-4 py-4 md:px-5">
        <ProductsPagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={processedProducts.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          showingLabel={t("showingProducts", { start, end, total: processedProducts.length })}
          perPageLabel={t("perPage")}
          previousLabel={tc("previous")}
          nextLabel={tc("next")}
        />
      </div>
    </DataTableCard>
  );
}

function ProductListRow({
  product,
  t,
  locale,
}: {
  product: Product;
  t: ReturnType<typeof useTranslations<"products">>;
  locale: string;
}) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const stockStatus = getStockStatus(product.stock);
  const categoryLabel = product.category.replace(/-/g, " ");
  const hasDiscount = product.discountPercentage > 0;

  return (
    <tr className="border-b border-border/80 transition-colors hover:bg-muted/20">
      <td className={cn(tableCellComfortClass, "pl-5")}>
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="48px"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{product.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {product.brand || categoryLabel}
            </p>
          </div>
        </div>
      </td>
      <td className={cn(tableCellComfortClass, "capitalize text-muted-foreground")}>
        {categoryLabel}
      </td>
      <td className={cn(tableCellComfortClass, "font-semibold tabular-nums")}>
        {formatCurrency(discountedPrice, locale)}
      </td>
      <td className={tableCellComfortClass}>
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
            hasDiscount
              ? "bg-destructive/12 text-destructive"
              : "bg-success/12 text-success"
          )}
        >
          {hasDiscount ? `${Math.round(product.discountPercentage)}%` : "0%"}
        </span>
      </td>
      <td className={tableCellComfortClass}>
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-medium tabular-nums">{product.rating.toFixed(1)}</span>
        </div>
      </td>
      <td className={cn(tableCellComfortClass, "pr-5")}>
        <div className="flex flex-col">
          <span className={cn("font-bold tabular-nums", stockToneClass[stockStatus.tone])}>
            {product.stock}
          </span>
          <span className={cn("text-xs font-medium capitalize", stockToneClass[stockStatus.tone])}>
            {t(stockStatus.label)}
          </span>
        </div>
      </td>
    </tr>
  );
}

function ProductGridCard({
  product,
  t,
  locale,
}: {
  product: Product;
  t: ReturnType<typeof useTranslations<"products">>;
  locale: string;
}) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const stockStatus = getStockStatus(product.stock);
  const categoryLabel = product.category.replace(/-/g, " ");
  const hasDiscount = product.discountPercentage > 0;

  return (
    <Card className="group overflow-hidden border-border/70 transition-all hover:border-primary/30">
      <div className="relative h-28 overflow-hidden bg-muted/30 px-3 pb-2 pt-5 sm:h-32 sm:pt-6">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {hasDiscount && (
          <Badge
            variant="destructive"
            className="absolute left-2 top-2 border-0 bg-destructive/90 px-1.5 py-0 text-[10px]"
          >
            -{Math.round(product.discountPercentage)}%
          </Badge>
        )}
      </div>

      <CardContent className="space-y-2.5 p-3">
        <div>
          <p className="line-clamp-2 text-sm font-semibold text-foreground">{product.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {product.brand || categoryLabel}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-base font-bold tabular-nums">
            {formatCurrency(discountedPrice, locale)}
          </p>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
          <span className="capitalize text-muted-foreground">{categoryLabel}</span>
          <span className={cn("font-semibold", stockToneClass[stockStatus.tone])}>
            {product.stock} · {t(stockStatus.label)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
