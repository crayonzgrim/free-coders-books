"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Bookmark, ArrowRight } from "lucide-react";

export default function BookmarksPage() {
  const t = useTranslations("bookmarks");

  // Authentication is currently disabled. Show sign-in prompt.
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mx-auto w-fit mb-6 bg-orange-500 p-4 rounded-2xl">
          <Bookmark className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("emptyDescription")}
        </p>
        <Link href="/books">
          <Button
            size="lg"
            className="gap-2 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-warm"
          >
            {t("startBrowsing")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
