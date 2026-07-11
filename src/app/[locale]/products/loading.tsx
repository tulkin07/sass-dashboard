import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { TableCardSkeleton } from "@/shared/ui/skeleton";

export default function ProductsLoading() {
  return (
    <DashboardLayout>
      <PageHeadingSkeleton />
      <TableCardSkeleton variant="products" showTabs rows={8} />
    </DashboardLayout>
  );
}

function PageHeadingSkeleton() {
  return (
    <div className="mb-5 space-y-2 md:mb-6">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
    </div>
  );
}
