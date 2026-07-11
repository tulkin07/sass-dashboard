"use client";

import { useTranslations } from "next-intl";
import { getApiErrorMessage } from "@/shared/lib/errors";

export function useApiErrorMessage(error: unknown, fallback?: string) {
  const t = useTranslations("common");
  const te = useTranslations("errors");

  return getApiErrorMessage(error, {
    defaultMessage: fallback || t("error"),
    networkMessage: te("networkErrorDescription"),
  });
}
