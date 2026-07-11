"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "@/widgets/sidebar/ui/sidebar";
import { Header } from "@/widgets/header/ui/header";
import { CommandPalette } from "@/features/command-palette/ui/command-palette";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { useSettingsStore } from "@/shared/stores/settings-store";
import { useBodyScrollLock } from "@/shared/hooks/use-body-scroll-lock";
import { useEscapeKey } from "@/shared/hooks/use-escape-key";
import { cn } from "@/shared/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = useSettingsStore((s) => s.sidebarCollapsed);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((open) => !open);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useBodyScrollLock(mobileOpen);
  useEscapeKey(closeMobileMenu, mobileOpen);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onCommandPaletteOpen={() => setCommandOpen(true)}
        mobileOpen={mobileOpen}
        onMobileMenuToggle={toggleMobileMenu}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 top-[calc(60px+env(safe-area-inset-top))] z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <Sidebar mobileOpen={mobileOpen} onMobileClose={closeMobileMenu} />

      <div
        className={cn(
          "min-h-screen pt-[calc(60px+env(safe-area-inset-top))] transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-[220px]"
        )}
      >
        <main className="mx-auto w-full max-w-[1600px] px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-6" role="main">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
