import { Card, CardContent } from "@/components/ui/card";
import { getAllGuides, type GuidePreview } from "@/lib/guides";
import { Link } from "@/lib/i18n/navigation";
import { BookOpen, Clock, FileText, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale, getLocale } from "next-intl/server";

interface GuidesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GuidesPage({ params }: GuidesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const guides = await getAllGuides();

  return <GuidesContent guides={guides} />;
}

interface GuidesContentProps {
  guides: GuidePreview[];
}

function GuidesContent({ guides }: GuidesContentProps) {
  const t = useTranslations("guides");
  const locale = useTranslations()("language.select") === "언어 선택" ? "ko" : "en";

  const categoryColors: Record<string, { bg: string; text: string }> = {
    beginner: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
    javascript: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
    python: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
    backend: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
    learning: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400 dark:border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <FileText className="h-4 w-4" />
              <span>{t("badge")}</span>
              <Sparkles className="h-4 w-4" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => {
              const colors = categoryColors[guide.category] || categoryColors.beginner;
              const title = locale === "ko" ? guide.title : guide.titleEn;
              const description = locale === "ko" ? guide.description : guide.descriptionEn;

              return (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700">
                    <CardContent className="p-6 space-y-4">
                      {/* Category Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                          {t(`categories.${guide.category}`)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{guide.readingTime}{t("minutes")}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xs text-muted-foreground">
                          {guide.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(guide.date).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {guides.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No guides available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: GuidesPageProps) {
  const { locale } = await params;

  const titles = {
    ko: "학습 가이드 - Free Coders Books",
    en: "Learning Guides - Free Coders Books",
    es: "Guías de Aprendizaje - Free Coders Books",
  };

  const descriptions = {
    ko: "프로그래밍 학습을 위한 실용적인 가이드. 입문자부터 백엔드 개발자까지 단계별 학습 로드맵을 제공합니다.",
    en: "Practical guides for learning programming. Step-by-step learning roadmaps from beginners to backend developers.",
    es: "Guías prácticas para aprender programación. Hojas de ruta de aprendizaje paso a paso desde principiantes hasta desarrolladores backend.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}
