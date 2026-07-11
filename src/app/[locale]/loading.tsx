import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { StatsCardSkeleton } from "@/shared/ui/skeleton";

export default function LocaleLoading() {
  return (
    <DashboardLayout>
      <div className="mb-5 h-8 w-48 animate-pulse rounded-lg bg-muted md:mb-6" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    </DashboardLayout>
  );
}
