import { cn } from "@/shared/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="mt-5 flex items-end gap-[3px]">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-[5px] rounded-[2px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export type TableSkeletonVariant = "default" | "users" | "orders" | "products";

const tableCellClass = "px-4 py-3.5";

export function TableRowSkeleton({
  variant = "default",
  columns = 6,
}: {
  variant?: TableSkeletonVariant;
  columns?: number;
}) {
  if (variant === "users") return <UsersTableRowSkeleton />;
  if (variant === "orders") return <OrdersTableRowSkeleton />;
  if (variant === "products") return <ProductsTableRowSkeleton />;

  return (
    <tr className="border-b border-border/60">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className={tableCellClass}>
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

function UsersTableRowSkeleton() {
  return (
    <tr className="border-b border-border/60">
      <td className={cn(tableCellClass, "w-10")}>
        <Skeleton className="h-4 w-4 rounded" />
      </td>
      <td className={tableCellClass}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-36" />
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-28" />
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-24" />
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-20" />
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className={tableCellClass}>
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

function OrdersTableRowSkeleton() {
  return (
    <tr className="border-b border-border/60">
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-10" />
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-32" />
      </td>
      <td className={tableCellClass}>
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-7 rounded-md" />
          ))}
        </div>
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-8" />
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-16" />
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-5 w-20 rounded-md" />
      </td>
    </tr>
  );
}

function ProductsTableRowSkeleton() {
  return (
    <tr className="border-b border-border/60">
      <td className={cn(tableCellClass, "pl-5")}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-24" />
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-4 w-16" />
      </td>
      <td className={tableCellClass}>
        <Skeleton className="h-5 w-12 rounded-full" />
      </td>
      <td className={tableCellClass}>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-8" />
        </div>
      </td>
      <td className={cn(tableCellClass, "pr-5")}>
        <div className="space-y-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-3 w-14" />
        </div>
      </td>
    </tr>
  );
}

export function TableCardSkeleton({
  variant = "default",
  rows = 8,
  showTabs = false,
  columns = 6,
}: {
  variant?: TableSkeletonVariant;
  rows?: number;
  showTabs?: boolean;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {showTabs && (
        <div className="flex gap-4 border-b border-border px-4 py-3 md:px-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-20" />
          ))}
        </div>
      )}

      <div className="space-y-3 border-b border-border px-4 py-4 md:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-full max-w-[200px] rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-40" />
      </div>

      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} variant={variant} columns={columns} />
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="w-full rounded-lg" style={{ height }} />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted/60" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <div className="flex items-end justify-between pt-1">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
