import { StatsCardSkeleton } from "@/shared/ui/skeleton";
import { Skeleton } from "@/shared/ui/skeleton";

function ChartCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <Skeleton className="mb-2 h-4 w-40" />
      <Skeleton className="mb-4 h-3 w-28" />
      <Skeleton className="h-[220px] w-full rounded-lg" />
    </div>
  );
}

function ActivityCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-14" />
      </div>
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
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCardSkeleton />
          <div className="lg:col-span-2">
            <ChartCardSkeleton />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCardSkeleton />
          <ChartCardSkeleton />
        </div>
        <ChartCardSkeleton />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ActivityCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
