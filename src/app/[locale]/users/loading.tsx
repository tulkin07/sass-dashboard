import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { TableRowSkeleton } from "@/shared/ui/skeleton";

export default function UsersLoading() {
  return (
    <DashboardLayout>
      <div className="mb-5 h-8 w-40 animate-pulse rounded-lg bg-muted md:mb-6" />
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <div className="h-9 w-full max-w-md animate-pulse rounded-lg bg-muted" />
        </div>
        <table className="w-full">
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRowSkeleton key={i} columns={7} />
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
