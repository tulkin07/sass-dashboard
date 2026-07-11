"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { useSwitchLocale } from "@/shared/hooks/use-switch-locale";
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

  const current = languages.find((l) => l.value === locale);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={iconButtonClass}
          aria-label={t("language")}
        >
          <span className="text-xs font-semibold">{current?.flag || "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[60] w-44 rounded-xl p-2 data-[state=closed]:animate-none data-[state=open]:animate-none"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground">
          {t("language")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1.5" />
        {languages.map((lang) => {
          const isActive = locale === lang.value;
          return (
            <DropdownMenuItem
              key={lang.value}
              onSelect={() => switchLocale(lang.value)}
              className={cn(
                "cursor-pointer gap-3 rounded-lg px-2.5 py-2",
                isActive && "bg-muted"
              )}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                {lang.flag}
              </span>
              <span className="flex-1 text-sm font-medium">{lang.label}</span>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
