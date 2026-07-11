"use client";

import { useTranslations } from "next-intl";
import {
  Bell,
  ChevronRight,
  LayoutGrid,
  Mail,
  Menu,
  Search,
} from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { useSettingsStore } from "@/shared/stores/settings-store";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";
import { LogoMark } from "@/widgets/sidebar/ui/sidebar";
import { ThemeMenu } from "@/widgets/header/ui/theme-menu";
import { LanguageMenu } from "@/widgets/header/ui/language-menu";

interface HeaderProps {
  onCommandPaletteOpen?: () => void;
  mobileOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

const iconButtonClass =
  "h-9 w-9 rounded-full bg-card text-foreground shadow-none hover:bg-card/90";

export function Header({
  onCommandPaletteOpen,
  mobileOpen = false,
  onMobileMenuToggle,
}: HeaderProps) {
  const t = useTranslations("common");
  const tSettings = useTranslations("settings");
  const profile = useSettingsStore((s) => s.profile);
  const collapsed = useSettingsStore((s) => s.sidebarCollapsed);
  const setCollapsed = useSettingsStore((s) => s.setSidebarCollapsed);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-[60px] shrink-0 items-center gap-2 bg-background px-3 pt-[env(safe-area-inset-top)] sm:gap-3 sm:px-4 lg:gap-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={onMobileMenuToggle}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
        aria-controls="main-navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Link
        href="/"
        className="hidden shrink-0 items-center gap-2.5 lg:flex"
      >
        <LogoMark />
        <span className="text-[18px] font-bold tracking-tight text-foreground">SaaS</span>
      </Link>

      <Button
        variant="outline"
        size={collapsed ? "icon" : "sm"}
        className={cn(
          "hidden shrink-0 border-border/60 bg-card text-muted-foreground hover:bg-card/90 lg:flex",
          collapsed ? "h-8 w-8" : "h-8 gap-1.5 px-2.5 text-[11px] font-medium"
        )}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <>
            <LayoutGrid className="h-3.5 w-3.5" />
            Menu
          </>
        )}
      </Button>

      <button
        type="button"
        onClick={onCommandPaletteOpen}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm text-muted-foreground transition-colors outline-none hover:bg-card/90 focus:outline-none focus-visible:outline-none lg:max-w-2xl"
        aria-label={t("commandPalette")}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate text-left text-[13px] sm:hidden">{t("search")}</span>
        <span className="hidden truncate text-left text-[13px] sm:inline">
          {t("search")} users, products, orders...
        </span>
        <kbd className="ml-auto hidden shrink-0 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-transparent"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 stroke-[1.5] text-foreground" />
          <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-warning" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative hidden h-9 w-9 rounded-full hover:bg-transparent sm:flex"
          aria-label="Messages"
        >
          <Mail className="h-5 w-5 stroke-[1.5] text-foreground" />
          <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-warning" />
        </Button>

        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-full bg-card p-1 transition-colors hover:bg-card/90 sm:px-2"
          aria-label={tSettings("profile")}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt={profile.name} />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <span className="hidden pr-1 text-sm font-medium text-foreground sm:inline">
            {profile.name}
          </span>
        </Link>

        <LanguageMenu />

        <ThemeMenu />
      </div>
    </header>
  );
}
