import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CategoryContent } from "./category-content";
import { getAllCategories } from "@/lib/books/fetch-books";

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const categoryName = decodeURIComponent(slug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return <CategoryContent slug={slug} categoryName={categoryName} />;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const categoryName = decodeURIComponent(slug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const isKorean = locale === "ko";
  const isSpanish = locale === "es";

  const title = isKorean
    ? `${categoryName} 무료 프로그래밍 도서`
    : isSpanish
      ? `Libros de programación gratis de ${categoryName}`
      : `Free ${categoryName} Programming Books`;

  const description = isKorean
    ? `${categoryName} 관련 무료 프로그래밍 도서, 튜토리얼, 학습 자료를 찾아보세요.`
    : isSpanish
      ? `Encuentra libros de programación gratuitos, tutoriales y recursos de aprendizaje sobre ${categoryName}.`
      : `Find free programming books, tutorials, and learning resources about ${categoryName}.`;

  return {
    title: `${title} | Free Coders Books`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    const locales = ["en", "ko", "es"];

    // Generate params for top 50 categories for each locale
    return locales.flatMap((locale) =>
      categories.slice(0, 50).map((category) => ({
        locale,
        slug: category.slug,
      }))
    );
  } catch {
    // Return empty array if categories fetch fails
    return [];
  }
}
