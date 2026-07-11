"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSwitchLocale } from "@/shared/hooks/use-switch-locale";
import {
  Bell,
  Globe,
  Mail,
  Palette,
  User,
} from "lucide-react";
import { useSettingsStore } from "@/shared/stores/settings-store";
import { THEME_OPTIONS } from "@/shared/lib/theme";
import { ProfileFormDialog } from "@/features/profile-form/ui/profile-form-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Switch } from "@/shared/ui/switch";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";

const themes = THEME_OPTIONS;

const languages = [
  { value: "en" as const, label: "English", flag: "EN" },
  { value: "ru" as const, label: "Русский", flag: "RU" },
];

export function SettingsPage() {
  const t = useTranslations("settings");
  const { locale, switchLocale } = useSwitchLocale();
  const storedLocale = useSettingsStore((s) => s.locale);
  const activeLocale = storedLocale || locale;
  const [profileOpen, setProfileOpen] = useState(false);

  const {
    theme,
    profile,
    emailNotifications,
    pushNotifications,
    orderAlerts,
    marketingEmails,
    setTheme,
    setEmailNotifications,
    setPushNotifications,
    setOrderAlerts,
    setMarketingEmails,
  } = useSettingsStore();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ProfileFormDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage
                src="https://i.pravatar.cc/150?u=admin"
                alt={profile.name}
              />
              <AvatarFallback className="bg-muted text-lg">
                <User className="h-7 w-7 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold text-foreground">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <span className="mt-2 inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {profile.role}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-lg"
            onClick={() => setProfileOpen(true)}
          >
            {t("editProfile")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Palette className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <CardTitle>{t("appearance")}</CardTitle>
              <CardDescription>{t("appearanceDescription")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">{t("theme")}</p>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
              {themes.map(({ value, icon: Icon, labelKey }) => {
                const isActive = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex flex-col items-center gap-2.5 rounded-xl border px-3 py-4 transition-colors",
                      isActive
                        ? "border-foreground/25 bg-muted/60"
                        : "border-border bg-background hover:border-foreground/15 hover:bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        isActive ? "bg-foreground text-background" : "bg-muted text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{t(labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{t("language")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => {
                const isActive = activeLocale === lang.value;
                return (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => switchLocale(lang.value)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                      isActive
                        ? "border-foreground/25 bg-muted/60"
                        : "border-border bg-background hover:border-foreground/15 hover:bg-muted/30"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold",
                        isActive
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {lang.flag}
                    </span>
                    <span className="text-sm font-medium text-foreground">{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Bell className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <CardTitle>{t("notifications")}</CardTitle>
              <CardDescription>{t("notificationsDescription")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-border px-6 pb-6 pt-0">
          <NotificationToggle
            icon={Mail}
            label={t("emailNotifications")}
            description={t("emailNotificationsDescription")}
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />
          <NotificationToggle
            icon={Bell}
            label={t("pushNotifications")}
            description={t("pushNotificationsDescription")}
            checked={pushNotifications}
            onChange={setPushNotifications}
          />
          <NotificationToggle
            icon={Bell}
            label={t("orderAlerts")}
            description={t("orderAlertsDescription")}
            checked={orderAlerts}
            onChange={setOrderAlerts}
          />
          <NotificationToggle
            icon={Mail}
            label={t("marketingEmails")}
            description={t("marketingEmailsDescription")}
            checked={marketingEmails}
            onChange={setMarketingEmails}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </label>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        aria-label={label}
      />
    </div>
  );
}
