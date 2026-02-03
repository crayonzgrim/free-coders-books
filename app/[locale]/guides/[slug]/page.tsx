import { Button } from "@/components/ui/button";
import { getAllGuideSlugs, getGuideBySlug } from "@/lib/guides";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft, BookOpen, Clock, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface GuidePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return <GuideContent guide={guide} locale={locale} />;
}

interface GuideContentProps {
  guide: {
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

function GuideContent({ guide, locale }: GuideContentProps) {
  const t = useTranslations("guides");
  const isKorean = locale === "ko";

  const title = isKorean ? guide.title : guide.titleEn;

  const categoryColors: Record<string, { bg: string; text: string }> = {
    beginner: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
    javascript: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
    python: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
    backend: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
    learning: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
  };

  const colors = categoryColors[guide.category] || categoryColors.beginner;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            {t("backToList")}
          </Link>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
              {t(`categories.${guide.category}`)}
            </span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{guide.readingTime} {t("minutes")}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{guide.author}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h1>

          {/* Date */}
          <p className="text-sm text-muted-foreground">
            {t("publishedAt")}: {new Date(guide.date).toLocaleDateString(isKorean ? "ko-KR" : "en-US", {
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
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          {/* Related Books CTA */}
          <div className="mt-12 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-800 rounded-xl">
                <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {isKorean ? "더 깊이 학습하고 싶으신가요?" : "Want to learn more?"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isKorean
                    ? "관련 주제의 무료 프로그래밍 도서를 찾아보세요."
                    : "Find free programming books on related topics."}
                </p>
                <Link href="/books">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    {t("relatedBooks")}
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
  const slugs = getAllGuideSlugs();
  const locales = ["en", "ko", "es"];

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { locale, slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  const isKorean = locale === "ko";
  const title = isKorean ? guide.title : guide.titleEn;
  const description = isKorean ? guide.description : guide.descriptionEn;

  return {
    title: `${title} - Free Coders Books`,
    description,
  };
}
