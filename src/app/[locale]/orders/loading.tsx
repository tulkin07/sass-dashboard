import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { TableCardSkeleton } from "@/shared/ui/skeleton";

export default function OrdersLoading() {
  return (
    <DashboardLayout>
      <PageHeadingSkeleton />
      <TableCardSkeleton variant="orders" showTabs rows={8} />
    </DashboardLayout>
  );
}

function PageHeadingSkeleton() {
  return (
    <div className="mb-5 space-y-2 md:mb-6">
      <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-56 animate-pulse rounded-md bg-muted" />
    </div>
  );
}
