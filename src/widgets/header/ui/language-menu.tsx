"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { useSwitchLocale } from "@/shared/hooks/use-switch-locale";
import { useSettingsStore } from "@/shared/stores/settings-store";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

const languages = [
  { value: "en" as const, label: "English", flag: "EN" },
  { value: "ru" as const, label: "Русский", flag: "RU" },
];

const iconButtonClass =
  "h-9 w-9 rounded-full bg-card text-foreground shadow-none hover:bg-card/90";

export function LanguageMenu() {
  const t = useTranslations("settings");
  const { locale, switchLocale } = useSwitchLocale();
  const storedLocale = useSettingsStore((s) => s.locale);

  const activeLocale = storedLocale || locale;
  const current = languages.find((l) => l.value === activeLocale);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            iconButtonClass,
            "outline-none focus:outline-none focus-visible:outline-none"
          )}
          aria-label={t("language")}
        >
          <span className="text-xs font-semibold">{current?.flag || "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[60] w-44 rounded-xl border border-border p-2 shadow-lg data-[state=closed]:animate-none data-[state=open]:animate-none"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground">
          {t("language")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1.5" />
        {languages.map((lang) => {
          const isActive = activeLocale === lang.value;
          return (
            <DropdownMenuItem
              key={lang.value}
              onSelect={() => switchLocale(lang.value)}
              className={cn(
                "cursor-pointer gap-3 rounded-lg px-2.5 py-2.5 outline-none focus:outline-none focus-visible:outline-none",
                "focus:bg-muted data-[highlighted]:bg-muted",
                isActive && "bg-muted"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold",
                  isActive ? "bg-foreground text-background" : "bg-muted text-foreground"
                )}
              >
                {lang.flag}
              </span>
              <span className="flex-1 text-sm font-medium">{lang.label}</span>
              {isActive && <Check className="h-4 w-4 text-foreground" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
