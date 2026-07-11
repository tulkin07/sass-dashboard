"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Sun } from "lucide-react";
import { useSettingsStore } from "@/shared/stores/settings-store";
import { getThemeIcon, THEME_OPTIONS } from "@/shared/lib/theme";
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

const iconButtonClass =
  "h-9 w-9 rounded-full bg-card text-foreground shadow-none hover:bg-card/90";

export function ThemeMenu() {
  const tSettings = useTranslations("settings");
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ThemeIcon = mounted ? getThemeIcon(theme) : Sun;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={iconButtonClass}
          aria-label={tSettings("theme")}
          suppressHydrationWarning
        >
          <ThemeIcon className="h-[18px] w-[18px] stroke-[1.5]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[60] w-52 rounded-xl border-border p-2 shadow-lg data-[state=closed]:animate-none data-[state=open]:animate-none"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground">
          {tSettings("theme")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1.5" />
        {THEME_OPTIONS.map(({ value, icon: Icon, labelKey }) => {
          const isActive = theme === value;
          return (
            <DropdownMenuItem
              key={value}
              onSelect={() => setTheme(value)}
              className={cn(
                "cursor-pointer gap-3 rounded-lg px-2.5 py-2.5",
                isActive && "bg-muted"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  isActive ? "bg-foreground text-background" : "bg-muted text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-medium">{tSettings(labelKey)}</span>
              {isActive && <Check className="h-4 w-4 text-foreground" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
