import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/widgets/dashboard-layout/ui/dashboard-layout";
import { PageHeading } from "@/widgets/page-heading/ui/page-heading";
import { ProductsView } from "@/features/products-view/ui/products-view";

export default function LocaleProductsPage() {
  const t = useTranslations("products");
  const tNav = useTranslations("nav");

  return (
    <DashboardLayout>
      <PageHeading
        title={t("listTitle")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/" },
          { label: t("product") },
          { label: t("listTitle") },
        ]}
      />
      <ProductsView />
    </DashboardLayout>
  );
}
