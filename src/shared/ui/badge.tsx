import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        warning: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
        info: "border-transparent bg-blue-500/15 text-blue-600 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function StatusBadge({ status }: { status: string }) {
  const styleMap: Record<string, string> = {
    active: "bg-success/15 text-success",
    delivered: "bg-success/15 text-success",
    inactive: "bg-muted text-muted-foreground",
    pending: "bg-warning/15 text-warning",
    processing: "bg-info/15 text-info",
    shipped: "bg-info/15 text-info",
    cancelled: "bg-destructive/15 text-destructive",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold capitalize",
        styleMap[status] || "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}
