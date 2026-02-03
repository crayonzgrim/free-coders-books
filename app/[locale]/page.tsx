import { SearchBar } from "@/components/books/search-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllArticles, type ArticlePreview } from "@/lib/articles";
import { getAllCategories } from "@/lib/books/fetch-books";
import { getAllGuides, type GuidePreview } from "@/lib/guides";
import { Link } from "@/lib/i18n/navigation";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Brain,
  Clock,
  Cloud,
  Code,
  Cpu,
  Database,
  FileCode,
  FileText,
  Gamepad2,
  GraduationCap,
  Monitor,
  Network,
  Newspaper,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  type LucideIcon
} from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// Category icon and color mapping
const categoryStyles: Record<string, { icon: LucideIcon; iconBg: string; iconColor: string }> = {
  javascript: { icon: Code, iconBg: "bg-yellow-100 dark:bg-yellow-900/30", iconColor: "text-yellow-600 dark:text-yellow-400" },
  python: { icon: Code, iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
  java: { icon: Code, iconBg: "bg-red-100 dark:bg-red-900/30", iconColor: "text-red-600 dark:text-red-400" },
  "c++": { icon: Code, iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
  c: { icon: Terminal, iconBg: "bg-gray-100 dark:bg-gray-800", iconColor: "text-gray-600 dark:text-gray-400" },
  ruby: { icon: Code, iconBg: "bg-red-100 dark:bg-red-900/30", iconColor: "text-red-600 dark:text-red-400" },
  go: { icon: Code, iconBg: "bg-cyan-100 dark:bg-cyan-900/30", iconColor: "text-cyan-600 dark:text-cyan-400" },
  rust: { icon: Cpu, iconBg: "bg-orange-100 dark:bg-orange-900/30", iconColor: "text-orange-600 dark:text-orange-400" },
  php: { icon: Code, iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
  swift: { icon: Smartphone, iconBg: "bg-orange-100 dark:bg-orange-900/30", iconColor: "text-orange-600 dark:text-orange-400" },
  kotlin: { icon: Smartphone, iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
  typescript: { icon: Code, iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
  "machine learning": { icon: Brain, iconBg: "bg-pink-100 dark:bg-pink-900/30", iconColor: "text-pink-600 dark:text-pink-400" },
  "artificial intelligence": { icon: Brain, iconBg: "bg-pink-100 dark:bg-pink-900/30", iconColor: "text-pink-600 dark:text-pink-400" },
  database: { icon: Database, iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
  sql: { icon: Database, iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
  nosql: { icon: Database, iconBg: "bg-green-100 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400" },
  android: { icon: Smartphone, iconBg: "bg-green-100 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400" },
  ios: { icon: Smartphone, iconBg: "bg-gray-100 dark:bg-gray-800", iconColor: "text-gray-600 dark:text-gray-400" },
  "cloud computing": { icon: Cloud, iconBg: "bg-cyan-100 dark:bg-cyan-900/30", iconColor: "text-cyan-600 dark:text-cyan-400" },
  devops: { icon: Server, iconBg: "bg-cyan-100 dark:bg-cyan-900/30", iconColor: "text-cyan-600 dark:text-cyan-400" },
  security: { icon: Shield, iconBg: "bg-red-100 dark:bg-red-900/30", iconColor: "text-red-600 dark:text-red-400" },
  networking: { icon: Network, iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
  "game development": { icon: Gamepad2, iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
  "web development": { icon: Monitor, iconBg: "bg-green-100 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400" },
  linux: { icon: Terminal, iconBg: "bg-yellow-100 dark:bg-yellow-900/30", iconColor: "text-yellow-600 dark:text-yellow-400" },
  "operating systems": { icon: Monitor, iconBg: "bg-gray-100 dark:bg-gray-800", iconColor: "text-gray-600 dark:text-gray-400" },
  algorithms: { icon: Cpu, iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
  "data structures": { icon: Boxes, iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
  git: { icon: FileCode, iconBg: "bg-orange-100 dark:bg-orange-900/30", iconColor: "text-orange-600 dark:text-orange-400" },
};

const defaultStyle = { icon: BookOpen, iconBg: "bg-gray-100 dark:bg-gray-800", iconColor: "text-gray-600 dark:text-gray-400" };

function getCategoryStyle(categoryName: string) {
  const lowerName = categoryName.toLowerCase();
  for (const [key, style] of Object.entries(categoryStyles)) {
    if (lowerName.includes(key)) {
      return style;
    }
  }
  return defaultStyle;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await getAllCategories();
  const guides = await getAllGuides();
  const articles = await getAllArticles();

  return <HomeContent categories={categories} guides={guides.slice(0, 6)} articles={articles.slice(0, 3)} totalGuides={guides.length} totalArticles={articles.length} />;
}

interface HomeContentProps {
  categories: { name: string; slug: string; count: number }[];
  guides: GuidePreview[];
  articles: ArticlePreview[];
  totalGuides: number;
  totalArticles: number;
}

function HomeContent({ categories, guides, articles, totalGuides, totalArticles }: HomeContentProps) {
  const t = useTranslations("home");

  const stats = [
    { value: `${totalGuides}+`, label: t("statsGuides"), icon: GraduationCap },
    { value: `${totalArticles}+`, label: t("statsArticles"), icon: FileText },
    { value: `${categories.length}+`, label: t("statsCategories"), icon: Sparkles },
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

      {/* Learning Guides Section - 자체 콘텐츠 */}
      <section className="py-16 md:py-24 bg-linear-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20">
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
      </section>

      {/* Articles Section - 자체 콘텐츠 */}
      <section className="py-16 md:py-24 bg-linear-to-b from-rose-50/50 to-transparent dark:from-rose-950/20">
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => {
              const style = getCategoryStyle(category.name);
              const Icon = style.icon;
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="hover-lift border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 h-full">
                    <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
                      <div
                        className={`rounded-xl ${style.iconBg} p-2.5 sm:p-3 shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${style.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                          {category.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {category.count.toLocaleString()} resources
                        </p>
                      </div>
                      <div className="hidden sm:flex w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <ArrowRight className="h-4 w-4 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 mb-6">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t("featuresTitle")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("featuresDescription")}
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: t("feature1Title"),
                  description: t("feature1Description"),
                  icon: "📚",
                },
                {
                  title: t("feature2Title"),
                  description: t("feature2Description"),
                  icon: "🎯",
                },
                {
                  title: t("feature3Title"),
                  description: t("feature3Description"),
                  icon: "💡",
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
              {t("ctaTitle")}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              {t("ctaDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/guides">
                <Button size="lg" className="gap-2 w-full sm:w-auto bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg">
                  {t("exploreGuides")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/articles">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  {t("exploreArticles")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
