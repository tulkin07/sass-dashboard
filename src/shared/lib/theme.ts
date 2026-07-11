import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import type { Theme } from "@/shared/stores/settings-store";

export const THEME_OPTIONS: {
  value: Theme;
  icon: LucideIcon;
  labelKey: "themeLight" | "themeDark" | "themeSystem";
}[] = [
  { value: "light", icon: Sun, labelKey: "themeLight" },
  { value: "dark", icon: Moon, labelKey: "themeDark" },
  { value: "system", icon: Monitor, labelKey: "themeSystem" },
];

const THEME_CYCLE: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export function getNextTheme(theme: Theme): Theme {
  return THEME_CYCLE[theme];
}

export function getThemeIcon(theme: Theme): LucideIcon {
  if (theme === "dark") return Moon;
  if (theme === "system") return Monitor;
  return Sun;
}

export function isDarkTheme(theme: Theme): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
