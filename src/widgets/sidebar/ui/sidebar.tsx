"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/shared/i18n/routing";
import {
  BarChart3,
  LayoutDashboard,
  Layers3,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { NAV_GROUPS } from "@/shared/config/constants";
import { useSettingsStore } from "@/shared/stores/settings-store";

const iconMap = {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
};

export const SIDEBAR_WIDTH = 220;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const NAVBAR_HEIGHT = 68;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground",
        compact ? "h-8 w-8" : "h-9 w-9"
      )}
    >
      <Layers3 className={cn(compact ? "h-4 w-4" : "h-5 w-5")} strokeWidth={2.25} />
    </div>
  );
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const collapsed = useSettingsStore((s) => s.sidebarCollapsed);
  const normalizedPath = pathname.replace(/^\/(en|ru)/, "") || "/";
  const isCollapsed = collapsed && !mobileOpen;

  const renderNavItem = (item: { href: string; labelKey: string; icon: string }) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap];
    const isActive =
      normalizedPath === item.href ||
      (item.href !== "/" && normalizedPath.startsWith(item.href));
    const label = t(item.labelKey);

    return (
      <Link
        key={item.href}
        href={item.href}
        title={isCollapsed ? label : undefined}
        onClick={onMobileClose}
        className={cn(
          "flex items-center rounded-lg py-2 text-[13px] font-medium transition-colors outline-none focus:outline-none focus-visible:outline-none",
          isCollapsed ? "justify-center px-0" : "gap-2.5 px-2",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon
          className={cn("h-[18px] w-[18px] shrink-0 stroke-[1.5]", isActive && "text-primary")}
          aria-hidden="true"
        />
        {!isCollapsed && <span className="truncate">{label}</span>}
      </Link>
    );
  };

  return (
    <aside
      id="main-navigation"
      className={cn(
        "fixed left-0 z-30 flex flex-col bg-transparent transition-all duration-300",
        "top-[calc(68px+env(safe-area-inset-top))] h-[calc(100dvh-68px-env(safe-area-inset-top))]",
        "-translate-x-full lg:translate-x-0",
        mobileOpen && "translate-x-0 border-r border-border bg-background shadow-xl lg:border-0 lg:bg-transparent lg:shadow-none",
        mobileOpen ? "w-[220px]" : isCollapsed ? "w-[220px] lg:w-[72px]" : "w-[220px]"
      )}
      aria-label="Main navigation"
      aria-expanded={mobileOpen || !isCollapsed}
    >
      {mobileOpen && (
        <div className="flex items-center justify-between border-b border-border px-3 py-3 lg:hidden">
          <span className="text-sm font-semibold text-foreground">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto px-2 pb-4 pt-4 lg:px-3 lg:pt-10" role="navigation">
        <div className="space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.labelKey}>
              {!isCollapsed && (
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80">
                  {t(group.labelKey)}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(renderNavItem)}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export function getSidebarOffset(collapsed: boolean) {
  return collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
}
