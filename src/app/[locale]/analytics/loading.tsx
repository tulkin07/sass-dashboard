import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { ChartSkeleton } from "@/shared/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <DashboardLayout>
      <div className="mb-5 space-y-2">
        <div className="h-8 w-44 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 h-4 w-32 animate-pulse rounded bg-muted" />
            <ChartSkeleton height={200} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
