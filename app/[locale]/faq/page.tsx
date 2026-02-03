import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail, Sparkles, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FAQContent />;
}

function FAQContent() {
  const t = useTranslations("faq");

  const faqItems = [
    {
      question: t("questions.whatIs.question"),
      answer: t("questions.whatIs.answer"),
    },
    {
      question: t("questions.isFree.question"),
      answer: t("questions.isFree.answer"),
    },
    {
      question: t("questions.dataSource.question"),
      answer: t("questions.dataSource.answer"),
    },
    {
      question: t("questions.contribute.question"),
      answer: t("questions.contribute.answer"),
    },
    {
      question: t("questions.languages.question"),
      answer: t("questions.languages.answer"),
    },
    {
      question: t("questions.guides.question"),
      answer: t("questions.guides.answer"),
    },
    {
      question: t("questions.articles.question"),
      answer: t("questions.articles.answer"),
    },
    {
      question: t("questions.contact.question"),
      answer: t("questions.contact.answer"),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400 dark:border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <HelpCircle className="h-4 w-4" />
              <span>{t("badge")}</span>
              <Sparkles className="h-4 w-4" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
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

      {/* FAQ List */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="font-semibold text-lg pr-4">{item.question}</h3>
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-muted-foreground mb-8">
              {t("cta.description")}
            </p>
            <a
              href="mailto:crayonzgrim@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              {t("cta.button")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: FAQPageProps) {
  const { locale } = await params;

  const titles = {
    ko: "자주 묻는 질문 - Free Coders Books",
    en: "FAQ - Free Coders Books",
    es: "Preguntas Frecuentes - Free Coders Books",
  };

  const descriptions = {
    ko: "Free Coders Books에 대해 자주 묻는 질문과 답변을 확인하세요.",
    en: "Find answers to frequently asked questions about Free Coders Books.",
    es: "Encuentra respuestas a las preguntas frecuentes sobre Free Coders Books.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}
