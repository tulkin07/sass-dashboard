"use client";

import { useLayoutEffect } from "react";
import { useSettingsStore } from "@/shared/stores/settings-store";
import { applyThemeToDocument } from "@/shared/lib/apply-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      applyThemeToDocument(theme);
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  return <>{children}</>;
}
