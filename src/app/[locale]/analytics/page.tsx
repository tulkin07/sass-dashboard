import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { PageHeading } from "@/widgets/page-heading/ui/page-heading";
import { AnalyticsPage } from "@/widgets/analytics/ui/analytics-page";

export default function LocaleAnalyticsPage() {
  const t = useTranslations("analytics");
  const tNav = useTranslations("nav");

  return (
    <DashboardLayout>
      <PageHeading
        title={t("title")}
        subtitle={t("subtitle")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/" },
          { label: t("title") },
        ]}
      />
      <AnalyticsPage />
    </DashboardLayout>
  );
}
