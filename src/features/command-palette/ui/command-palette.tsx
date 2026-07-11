"use client";

import { useRouter } from "@/shared/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";
import { NAV_ITEMS } from "@/shared/config/constants";
import { fetchUsers } from "@/shared/api/users";
import { fetchProducts } from "@/shared/api/products";
import { queryKeys } from "@/shared/config/query-keys";
import { useBodyScrollLock } from "@/shared/hooks/use-body-scroll-lock";
import { cn } from "@/shared/lib/utils";

const iconMap = {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const t = useTranslations();
  const tNav = useTranslations("nav");
  const router = useRouter();
  const [search, setSearch] = useState("");

  const usersQuery = useQuery({
    queryKey: queryKeys.users.list({ limit: 5, skip: 0, q: search }),
    queryFn: () => fetchUsers({ limit: 5, skip: 0, q: search }),
    enabled: open && search.trim().length >= 2,
    staleTime: 60_000,
  });

  const productsQuery = useQuery({
    queryKey: queryKeys.products.list({ limit: 5, skip: 0, q: search }),
    queryFn: () => fetchProducts({ limit: 5, skip: 0, q: search }),
    enabled: open && search.trim().length >= 2,
    staleTime: 60_000,
  });

  const showEntities = search.trim().length >= 2;
  const isSearching =
    showEntities && (usersQuery.isFetching || productsQuery.isFetching);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  useBodyScrollLock(open);

  const navigate = (href: string) => {
    router.push(href);
    onOpenChange(false);
    setSearch("");
  };

  const filteredNav = useMemo(() => {
    if (!search.trim()) return NAV_ITEMS;
    const q = search.toLowerCase();
    return NAV_ITEMS.filter((item) => tNav(item.labelKey).toLowerCase().includes(q));
  }, [search, tNav]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className="fixed left-1/2 top-4 z-50 w-full max-w-lg -translate-x-1/2 px-4 sm:top-[20%]">
        <Command
          className="overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
          label={t("common.commandPalette")}
          shouldFilter={false}
        >
          <div className="flex items-center border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder={t("common.searchPages")}
              className="flex h-12 w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              {!isSearching && t("common.noResults")}
            </Command.Empty>

            {isSearching && (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                {t("common.loading")}
              </div>
            )}

            {!isSearching && filteredNav.length > 0 && (
              <Command.Group heading={tNav("dashboard")}>
                {filteredNav.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <Command.Item
                      key={item.href}
                      value={`page-${item.href}`}
                      onSelect={() => navigate(item.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {tNav(item.labelKey)}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}

            {showEntities && !isSearching && (usersQuery.data?.users.length ?? 0) > 0 && (
              <Command.Group heading={tNav("users")}>
                {usersQuery.data?.users.map((user) => (
                  <Command.Item
                    key={`user-${user.id}`}
                    value={`user-${user.id}-${user.firstName}`}
                    onSelect={() => navigate("/users")}
                    className="flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:gap-3 aria-selected:bg-accent"
                  >
                    <User className="hidden h-4 w-4 text-muted-foreground sm:block" />
                    <span className="truncate">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground sm:ml-auto">
                      {user.email}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {showEntities && !isSearching && (productsQuery.data?.products.length ?? 0) > 0 && (
              <Command.Group heading={tNav("products")}>
                {productsQuery.data?.products.map((product) => (
                  <Command.Item
                    key={`product-${product.id}`}
                    value={`product-${product.id}-${product.title}`}
                    onSelect={() => navigate("/products")}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{product.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
