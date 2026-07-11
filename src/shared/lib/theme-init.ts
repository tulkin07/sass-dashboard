import { SETTINGS_STORAGE_KEY } from "@/shared/stores/settings-store";

export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${SETTINGS_STORAGE_KEY}");
    if (!stored) return;
    var parsed = JSON.parse(stored);
    var theme = (parsed.state && parsed.state.theme) || "system";
    var isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch (e) {}
})();
`;
