import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { PageHeading } from "@/widgets/page-heading/ui/page-heading";
import { SettingsPage } from "@/widgets/settings/ui/settings-page";

export default function LocaleSettingsPage() {
  const t = useTranslations("settings");
  const tNav = useTranslations("nav");

  return (
    <DashboardLayout>
      <PageHeading
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/" },
          { label: tNav("settings") },
        ]}
        subtitle={t("subtitle")}
      />
      <SettingsPage />
    </DashboardLayout>
  );
}
