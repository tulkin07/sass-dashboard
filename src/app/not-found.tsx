import { Link } from "@/shared/i18n/routing";
import { useTranslations } from "next-intl";
import { FileQuestion } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="mt-2 text-xl font-semibold">{t("notFound")}</h2>
        <p className="mt-2 text-muted-foreground">{t("notFoundDescription")}</p>
      </div>
      <Button asChild>
        <Link href="/">{t("goHome")}</Link>
      </Button>
    </div>
  );
}
