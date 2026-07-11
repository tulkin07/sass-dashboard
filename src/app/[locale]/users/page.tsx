import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { PageHeading } from "@/widgets/page-heading/ui/page-heading";
import { UsersTable } from "@/features/users-table/ui/users-table";

export default function LocaleUsersPage() {
  const t = useTranslations("users");
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
      <UsersTable />
    </DashboardLayout>
  );
}
