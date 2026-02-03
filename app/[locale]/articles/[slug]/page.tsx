import { Button } from "@/components/ui/button";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/articles";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft, BookOpen, Clock, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} locale={locale} />;
}

interface ArticleContentProps {
  article: {
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    author: string;
    date: string;
    category: string;
    tags: string[];
    readingTime: number;
    content: string;
    slug: string;
  };
  locale: string;
}

function ArticleContent({ article, locale }: ArticleContentProps) {
  const t = useTranslations("articles");
  const isKorean = locale === "ko";

  const title = isKorean ? article.title : article.titleEn;

  const categoryColors: Record<string, { bg: string; text: string }> = {
    Opinion: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400" },
    "Open Source": { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-600 dark:text-violet-400" },
    Career: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
    "Best Practices": { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400" },
  };

  const colors = categoryColors[article.category] || categoryColors.Opinion;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            {t("backToList")}
          </Link>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
              {article.category}
            </span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{article.readingTime} {t("minutes")}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h1>

          {/* Date */}
          <p className="text-sm text-muted-foreground">
            {t("publishedAt")}: {new Date(article.date).toLocaleDateString(isKorean ? "ko-KR" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div
            className="guide-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Related Books CTA */}
          <div className="mt-12 p-6 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-800 rounded-xl">
                <BookOpen className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {isKorean ? "더 많은 아티클 읽기" : "Read More Articles"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isKorean
                    ? "개발자를 위한 인사이트와 경험을 더 탐색해보세요."
                    : "Explore more insights and experiences for developers."}
                </p>
                <Link href="/articles">
                  <Button className="bg-rose-600 hover:bg-rose-700">
                    {t("backToList")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  const locales = ["en", "ko", "es"];

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const isKorean = locale === "ko";
  const title = isKorean ? article.title : article.titleEn;
  const description = isKorean ? article.description : article.descriptionEn;

  return {
    title: `${title} - Free Coders Books`,
    description,
  };
}
