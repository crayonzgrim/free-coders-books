import { SearchBar } from "@/components/books/search-bar";
import { CategoryGrid } from "@/components/home/category-grid";
import { LanguageSelector } from "@/components/home/language-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KakaoAdFit } from "@/components/ui/kakao-adfit";
import { getAllArticles, type ArticlePreview } from "@/lib/articles";
import { getAllCategories } from "@/lib/books/fetch-books";
import { getAllGuides, type GuidePreview } from "@/lib/guides";
import { Link } from "@/lib/i18n/navigation";
import { getTopRatedMindBooks, type MindBook } from "@/lib/mind-books";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  ExternalLink,
  Globe,
  GraduationCap,
  Newspaper,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await getAllCategories();
  const mindBooks = await getTopRatedMindBooks(6);
  const guides = await getAllGuides();
  const articles = await getAllArticles();

  return <HomeContent categories={categories} mindBooks={mindBooks} guides={guides.slice(0, 6)} articles={articles.slice(0, 3)} />;
}

interface HomeContentProps {
  categories: { name: string; slug: string; count: number }[];
  mindBooks: MindBook[];
  guides: GuidePreview[];
  articles: ArticlePreview[];
}

function HomeContent({ categories, mindBooks, guides, articles }: HomeContentProps) {
  const t = useTranslations("home");

  const stats = [
    { value: "4,300+", label: t("statsBooks"), icon: BookOpen },
    { value: "330+", label: t("statsCategories"), icon: Sparkles },
    { value: "40+", label: t("statsLanguages"), icon: Globe },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400 dark:border-orange-600 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
              <BookOpen className="h-4 w-4" />
              <span>Open Source & Free Forever</span>
              <Sparkles className="h-4 w-4 animate-pulse-warm" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
              {t("heroDescription")}
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto pt-6">
              <SearchBar size="lg" />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl md:text-4xl font-bold bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Section (300x250) */}
      <div className="flex justify-center py-6">
        <KakaoAdFit unit="DAN-lawkB1KqkNnDh62T" width={300} height={250} />
      </div>

      {/* Learning Guides Section - 자체 콘텐츠 (광고 통과용 임시 - 주석처리) */}
      {/* <section className="py-16 md:py-24 bg-linear-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400 dark:border-emerald-600 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-3">
                <GraduationCap className="h-3 w-3" />
                <span>{t("guidesSubtitle")}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  {t("guidesTitle")}
                </span>
              </h2>
              <p className="text-muted-foreground mt-1">
                {t("guidesDescription")}
              </p>
            </div>
            <Link href="/guides">
              <Button variant="outline" className="gap-2 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/50">
                {t("exploreGuides")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {guide.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{guide.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{guide.readingTime}{t("readingTimeUnit")}</span>
                      </div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                        {guide.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Articles Section - 자체 콘텐츠 (광고 통과용 임시 - 주석처리) */}
      {/* <section className="py-16 md:py-24 bg-linear-to-b from-rose-50/50 to-transparent dark:from-rose-950/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-400 dark:border-rose-600 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 mb-3">
                <Newspaper className="h-3 w-3" />
                <span>{t("articlesSubtitle")}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="bg-linear-to-r from-rose-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  {t("articlesTitle")}
                </span>
              </h2>
              <p className="text-muted-foreground mt-1">
                {t("articlesDescription")}
              </p>
            </div>
            <Link href="/articles">
              <Button variant="outline" className="gap-2 border-rose-300 hover:border-rose-400 hover:bg-rose-50 dark:border-rose-700 dark:hover:border-rose-600 dark:hover:bg-rose-950/50">
                {t("exploreArticles")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{article.readingTime}{t("readingTimeUnit")}</span>
                      </div>
                      <span className="text-xs text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Language Selector */}
      <LanguageSelector
        title={t("browseByLanguage")}
        subtitle={t("browseByLanguageSubtitle")}
      />

      {/* Mind-Expanding Books Section */}
      <section className="py-16 md:py-24 bg-linear-to-b from-purple-50/50 to-transparent dark:from-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400 dark:border-purple-600 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 mb-3">
                <Brain className="h-3 w-3" />
                <span>{t("mindBooksSubtitle")}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="bg-linear-to-r from-purple-600 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
                  {t("mindBooksTitle")}
                </span>
              </h2>
              <p className="text-muted-foreground mt-1">
                {t("mindBooksDescription")}
              </p>
            </div>
            <Link href="/mind-books">
              <Button variant="outline" className="gap-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-700 dark:hover:border-purple-600 dark:hover:bg-purple-950/50">
                {t("exploreMindBooks")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mindBooks.map((book, index) => (
              <a
                key={`${book.title}-${index}`}
                href={book.goodreadsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {book.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{book.goodreadsRating.toFixed(2)}</span>
                      </div>
                      <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                        {book.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("featuredCategories")}
            </h2>
            <p className="text-muted-foreground mt-1">
              Explore our most popular programming topics
            </p>
          </div>

          <CategoryGrid categories={categories} initialCount={16} loadMoreCount={16} />
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 md:py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Powered by the Community
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                All resources are curated from the amazing{" "}
                <a
                  href="https://github.com/EbookFoundation/free-programming-books"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
                >
                  free-programming-books
                </a>{" "}
                project, one of the most starred repositories on GitHub with 300k+ stars.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Always Free",
                  description: "Every resource is completely free and open to everyone",
                  icon: "🆓",
                },
                {
                  title: "Multi-language",
                  description: "Resources available in 40+ languages worldwide",
                  icon: "🌍",
                },
                {
                  title: "Updated Daily",
                  description: "New resources added and verified by contributors",
                  icon: "✨",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="text-center p-6 rounded-2xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to start learning?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Browse through our extensive collection of free programming resources
              and level up your skills today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books">
                <Button size="lg" className="gap-2 w-full sm:w-auto bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-warm-lg">
                  {t("browseAll")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  Explore Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
