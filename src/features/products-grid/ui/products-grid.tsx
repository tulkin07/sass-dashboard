"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpDown, Search, Star } from "lucide-react";
import { fetchProducts, fetchProductCategories } from "@/shared/api/products";
import { queryKeys } from "@/shared/config/query-keys";
import { DEFAULT_PAGE_SIZE } from "@/shared/config/constants";
import { formatCurrency, calculateDiscountedPrice } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Pagination } from "@/shared/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ProductCardSkeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { Card, CardContent } from "@/shared/ui/card";

type SortField = "title" | "price" | "rating" | "stock";
type SortOrder = "asc" | "desc";

export function ProductsGrid() {
  const t = useTranslations("products");
  const tc = useTranslations("common");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("all");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

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
  }, [data?.products, minPrice, maxPrice, minRating, sortField, sortOrder]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedProducts.slice(start, start + pageSize);
  }, [processedProducts, page, pageSize]);

  const totalPages = Math.ceil(processedProducts.length / pageSize);

  if (isError) {
    return <ErrorState onRetry={() => refetch()} retryLabel={tc("retry")} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              searchTimeout(e.target.value);
            }}
            className="pl-9"
            aria-label={t("search")}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40" aria-label={t("category")}>
              <SelectValue placeholder={t("allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {(categoriesQuery.data || []).map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug} className="capitalize">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder={t("minPrice")}
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
            className="w-full sm:w-24"
            aria-label={t("minPrice")}
          />
          <Input
            type="number"
            placeholder={t("maxPrice")}
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
            className="w-full sm:w-24"
            aria-label={t("maxPrice")}
          />

          <Select value={minRating} onValueChange={(v) => { setMinRating(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-32" aria-label={t("minRating")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("minRating")}</SelectItem>
              <SelectItem value="3">3+ ⭐</SelectItem>
              <SelectItem value="4">4+ ⭐</SelectItem>
              <SelectItem value="4.5">4.5+ ⭐</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${sortField}-${sortOrder}`}
            onValueChange={(v) => {
              const [field, order] = v.split("-") as [SortField, SortOrder];
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-full sm:w-36" aria-label={tc("sort")}>
              <ArrowUpDown className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Name A-Z</SelectItem>
              <SelectItem value="title-desc">Name Z-A</SelectItem>
              <SelectItem value="price-asc">Price Low</SelectItem>
              <SelectItem value="price-desc">Price High</SelectItem>
              <SelectItem value="rating-desc">Rating High</SelectItem>
              <SelectItem value="stock-asc">Stock Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
          {paginatedProducts.map((product) => {
            const discountedPrice = calculateDiscountedPrice(
              product.price,
              product.discountPercentage
            );
            const isLowStock = product.stock < 20;

            return (
              <Card key={product.id} className="overflow-hidden group transition-colors hover:border-primary/30">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {product.discountPercentage > 0 && (
                    <Badge className="absolute top-2 right-2" variant="destructive">
                      -{Math.round(product.discountPercentage)}%
                    </Badge>
                  )}
                  {isLowStock && (
                    <Badge className="absolute top-2 left-2" variant="warning">
                      {t("lowStock")}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <p className="font-medium text-sm line-clamp-2">{product.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {product.category.replace(/-/g, " ")}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{formatCurrency(discountedPrice)}</span>
                      {product.discountPercentage > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("stock")}: {product.stock}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={processedProducts.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        previousLabel={tc("previous")}
        nextLabel={tc("next")}
        showingLabel={tc("showing")}
        ofLabel={tc("of")}
      />
    </div>
  );
}
