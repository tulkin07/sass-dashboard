"use client";

import { ArrowUpDown, Search, Trash2, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export const tableHeadClass =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground";
export const tableCellClass = "px-4 text-sm text-foreground";
export const tableCellDenseClass = "px-4 py-2 text-sm text-foreground";
export const tableCellComfortClass = "px-4 py-3.5 text-sm text-foreground";

export function DataTableCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export type DataTableTab = {
  value: string;
  label: string;
  count?: number;
  badgeTone?: "default" | "success" | "warning" | "danger" | "info";
  countVariant?: "badge" | "plain";
};

const tabBadgeToneClass: Record<NonNullable<DataTableTab["badgeTone"]>, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
};

export function DataTableTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: DataTableTab[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-b border-border px-4 md:px-5">
      <div className="flex flex-nowrap items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const isActive = tab.value === value;
          const countVariant = tab.countVariant || "badge";

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined &&
                (countVariant === "plain" ? (
                  <span className="text-xs font-semibold text-muted-foreground">
                    {tab.count}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "inline-flex min-w-[22px] items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
                      tabBadgeToneClass[tab.badgeTone || "default"]
                    )}
                  >
                    {tab.count}
                  </span>
                ))}
              {isActive && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DataTableToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-border px-4 py-3 md:px-5">{children}</div>
  );
}

export function DataTableToolbarRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between">
      {children}
    </div>
  );
}

export function DataTableToolbarGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-wrap items-center gap-2", className)}>
      {children}
    </div>
  );
}

export function DataTableFilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        onChange(nextValue);
        requestAnimationFrame(() => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        });
      }}
    >
      <SelectTrigger
        className="h-9 w-auto min-w-[108px] shrink-0 rounded-lg border-border bg-background px-3 text-sm shadow-none"
        aria-label={label}
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DataTableSortSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="h-9 w-full min-w-[160px] shrink-0 gap-2 rounded-lg border-border bg-background px-3 text-sm shadow-none sm:w-auto sm:min-w-[180px]"
        aria-label={label}
      >
        <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DataTableSearch({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full min-w-0 sm:w-[200px] sm:shrink-0 lg:w-[240px]", className)}>
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border-border bg-background pl-8 text-sm shadow-none"
      />
    </div>
  );
}

export type DataTableFilterChip = {
  id: string;
  label: string;
};

export function DataTableFilterMeta({
  resultsCount,
  resultsLabel,
  chips = [],
  onRemoveChip,
  onClear,
  clearLabel,
  className,
}: {
  resultsCount: number;
  resultsLabel: string;
  chips?: DataTableFilterChip[];
  onRemoveChip?: (id: string) => void;
  onClear?: () => void;
  clearLabel: string;
  className?: string;
}) {
  const hasFilters = chips.length > 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-xs text-muted-foreground sm:text-sm">
        <span className="font-semibold text-foreground">{resultsCount}</span>{" "}
        {resultsLabel}
      </p>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onRemoveChip?.(chip.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              {chip.label}
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          ))}

          {onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {clearLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function DataTableFooter({
  children,
  dense,
  onDenseChange,
  denseLabel,
}: {
  children: React.ReactNode;
  dense?: boolean;
  onDenseChange?: (value: boolean) => void;
  denseLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
      {onDenseChange && denseLabel ? (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={dense}
            onCheckedChange={(checked) => onDenseChange(checked === true)}
            aria-label={denseLabel}
          />
          {denseLabel}
        </label>
      ) : (
        <div />
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {children}
      </div>
    </div>
  );
}
