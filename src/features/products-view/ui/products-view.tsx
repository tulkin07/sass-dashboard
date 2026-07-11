"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, List } from "lucide-react";
import { ProductsGrid } from "@/features/products-grid/ui/products-grid";
import { ProductsTable } from "@/features/products-table/ui/products-table";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type ProductsViewMode = "grid" | "list";

export function ProductsView() {
  const t = useTranslations("products");
  const [view, setView] = useState<ProductsViewMode>("list");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 w-fit">
        <Button
          type="button"
          variant={view === "grid" ? "default" : "ghost"}
          size="sm"
          className={cn("h-8 gap-1.5 rounded-md px-3", view !== "grid" && "text-muted-foreground")}
          onClick={() => setView("grid")}
          aria-pressed={view === "grid"}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">{t("gridView")}</span>
        </Button>
        <Button
          type="button"
          variant={view === "list" ? "default" : "ghost"}
          size="sm"
          className={cn("h-8 gap-1.5 rounded-md px-3", view !== "list" && "text-muted-foreground")}
          onClick={() => setView("list")}
          aria-pressed={view === "list"}
        >
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">{t("listView")}</span>
        </Button>
      </div>

      {view === "grid" ? <ProductsGrid /> : <ProductsTable />}
    </div>
  );
}
