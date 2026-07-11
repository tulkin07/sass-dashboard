"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/shared/stores/settings-store";
import { profileSchema, type ProfileFormValues } from "@/features/profile-form/model/profile-schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface ProfileFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileFormDialog({ open, onOpenChange }: ProfileFormDialogProps) {
  const t = useTranslations("settings");
  const profile = useSettingsStore((s) => s.profile);
  const setProfile = useSettingsStore((s) => s.setProfile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  useEffect(() => {
    if (open) reset(profile);
  }, [open, profile, reset]);

  const onSubmit = (values: ProfileFormValues) => {
    setProfile(values);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-label="Close"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-form-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <h2 id="profile-form-title" className="text-lg font-semibold text-foreground">
          {t("editProfile")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("profileFormDescription")}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium">
              {t("profileNameLabel")}
            </label>
            <Input id="profile-name" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium">
              {t("profileEmailLabel")}
            </label>
            <Input
              id="profile-email"
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="profile-role" className="mb-1.5 block text-sm font-medium">
              {t("profileRoleLabel")}
            </label>
            <Input id="profile-role" {...register("role")} aria-invalid={!!errors.role} />
            {errors.role && (
              <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {t("saveProfile")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
