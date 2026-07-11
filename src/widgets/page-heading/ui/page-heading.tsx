import { Link } from "@/shared/i18n/routing";
import { cn } from "@/shared/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  className?: string;
}

export function PageHeading({
  title,
  subtitle,
  breadcrumbs,
  action,
  className,
}: PageHeadingProps) {
  return (
    <div className={cn("mb-5 md:mb-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[28px]">
            {title}
          </h1>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mt-1.5">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                      {index > 0 && (
                        <span aria-hidden="true" className="text-muted-foreground/60">
                          •
                        </span>
                      )}
                      {item.href && !isLast ? (
                        <Link
                          href={item.href}
                          className="transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className={cn(isLast && "text-foreground/80")}>
                          {item.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground md:text-base">{subtitle}</p>
          )}
        </div>
        {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
      </div>
    </div>
  );
}
