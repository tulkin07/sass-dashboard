import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { PageHeading } from "@/widgets/page-heading/ui/page-heading";
import { ProductsGrid } from "@/features/products-grid/ui/products-grid";

export default function LocaleProductsPage() {
  const t = useTranslations("products");
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
      <ProductsGrid />
    </DashboardLayout>
  );
}
