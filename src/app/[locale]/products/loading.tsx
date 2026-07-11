import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { ProductCardSkeleton } from "@/shared/ui/skeleton";

export default function ProductsLoading() {
  return (
    <DashboardLayout>
      <div className="mb-5 h-8 w-40 animate-pulse rounded-lg bg-muted md:mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </DashboardLayout>
  );
}
