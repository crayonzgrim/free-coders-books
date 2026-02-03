import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/i18n/navigation";
import { BookOpen, Code, Github, Globe, Heart, Mail, Sparkles, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");

  const features = [
    {
      icon: BookOpen,
      title: t("features.freeResources.title"),
      description: t("features.freeResources.description"),
    },
    {
      icon: Globe,
      title: t("features.multiLanguage.title"),
      description: t("features.multiLanguage.description"),
    },
    {
      icon: Code,
      title: t("features.originalContent.title"),
      description: t("features.originalContent.description"),
    },
    {
      icon: Users,
      title: t("features.community.title"),
      description: t("features.community.description"),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400 dark:border-orange-600 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
              <Heart className="h-4 w-4" />
              <span>{t("badge")}</span>
              <Sparkles className="h-4 w-4" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("mission.title")}</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("mission.content")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">{t("features.title")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                        <feature.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Source Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("dataSource.title")}</h2>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                  <Github className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">free-programming-books</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("dataSource.description")}
                  </p>
                  <a
                    href="https://github.com/EbookFoundation/free-programming-books"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
                  >
                    {t("dataSource.link")} →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("contact.title")}</h2>
            <p className="text-muted-foreground mb-8">
              {t("contact.description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:crayonzgrim@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-colors"
              >
                <Mail className="h-4 w-4" />
                crayonzgrim@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;

  const titles = {
    ko: "소개 - Free Coders Books",
    en: "About - Free Coders Books",
    es: "Acerca de - Free Coders Books",
  };

  const descriptions = {
    ko: "Free Coders Books는 전 세계 개발자를 위한 무료 프로그래밍 리소스를 제공하는 플랫폼입니다.",
    en: "Free Coders Books is a platform providing free programming resources for developers worldwide.",
    es: "Free Coders Books es una plataforma que ofrece recursos de programación gratuitos para desarrolladores de todo el mundo.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}
