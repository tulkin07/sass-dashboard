import type { Theme } from "@/shared/stores/settings-store";

export function resolveIsDark(theme: Theme, prefersDark = false): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return prefersDark;
}

export function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = resolveIsDark(theme, prefersDark);

  root.classList.add("disable-transitions");
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";

  // Force synchronous repaint so the theme applies in one frame.
  void root.offsetHeight;

  requestAnimationFrame(() => {
    root.classList.remove("disable-transitions");
  });
}
