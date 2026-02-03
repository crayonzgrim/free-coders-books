import { Card, CardContent } from "@/components/ui/card";
import { getAllArticles, type ArticlePreview } from "@/lib/articles";
import { Link } from "@/lib/i18n/navigation";
import { BookOpen, Clock, Newspaper, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

interface ArticlesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = await getAllArticles();

  return <ArticlesContent articles={articles} />;
}

interface ArticlesContentProps {
  articles: ArticlePreview[];
}

function ArticlesContent({ articles }: ArticlesContentProps) {
  const t = useTranslations("articles");
  const locale = useTranslations()("language.select") === "언어 선택" ? "ko" : "en";

  const categoryColors: Record<string, { bg: string; text: string }> = {
    Opinion: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400" },
    "Open Source": { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-600 dark:text-violet-400" },
    Career: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
    "Best Practices": { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400" },
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400 dark:border-rose-600 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400">
              <Newspaper className="h-4 w-4" />
              <span>{t("badge")}</span>
              <Sparkles className="h-4 w-4" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-rose-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
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

      {/* Articles Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const colors = categoryColors[article.category] || categoryColors.Opinion;
              const title = locale === "ko" ? article.title : article.titleEn;
              const description = locale === "ko" ? article.description : article.descriptionEn;

              return (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-700">
                    <CardContent className="p-6 space-y-4">
                      {/* Category Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{article.readingTime}{t("minutes")}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-lg group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2">
                        {title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xs text-muted-foreground">
                          {article.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.date).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No articles available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: ArticlesPageProps) {
  const { locale } = await params;

  const titles = {
    ko: "아티클 - Free Coders Books",
    en: "Articles - Free Coders Books",
    es: "Artículos - Free Coders Books",
  };

  const descriptions = {
    ko: "개발자를 위한 인사이트와 경험을 공유하는 아티클 모음입니다.",
    en: "A collection of articles sharing insights and experiences for developers.",
    es: "Una colección de artículos que comparten ideas y experiencias para desarrolladores.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}
