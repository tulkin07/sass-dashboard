"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/shared/i18n/routing";
import { useSettingsStore, type Locale } from "@/shared/stores/settings-store";

export function LocaleSync() {
  const urlLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const storedLocale = useSettingsStore((s) => s.locale);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;

    if (storedLocale !== urlLocale) {
      router.replace(pathname, { locale: storedLocale });
    }
  }, [pathname, router, storedLocale, urlLocale]);

  return null;
}
