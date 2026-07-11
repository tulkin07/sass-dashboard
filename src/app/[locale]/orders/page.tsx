import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { PageHeading } from "@/widgets/page-heading/ui/page-heading";
import { OrdersTable } from "@/features/orders-table/ui/orders-table";

export default function LocaleOrdersPage() {
  const t = useTranslations("orders");
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
      <OrdersTable />
    </DashboardLayout>
  );
}
