"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/shared/i18n/routing";
import { useSettingsStore, type Locale } from "@/shared/stores/settings-store";

export function useSwitchLocale() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const setLocale = useSettingsStore((s) => s.setLocale);

  const switchLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return;

      setLocale(newLocale);
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    },
    [locale, pathname, router, setLocale]
  );

  return { locale, switchLocale };
}
