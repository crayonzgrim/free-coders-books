import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MindBooksContent } from "./mind-books-content";
import { getMindBookCategories, getTopRatedMindBooks } from "@/lib/mind-books";

export const metadata: Metadata = {
  title: "Mind-Expanding Books",
  description:
    "Discover curated mind-expanding books across philosophy, science, business, history, and more — rated by the community.",
  openGraph: {
    title: "Mind-Expanding Books | Free Coders Books",
    description:
      "Discover curated mind-expanding books across philosophy, science, business, history, and more — rated by the community.",
  },
};

interface MindBooksPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function MindBooksPage({ params, searchParams }: MindBooksPageProps) {
  const { locale } = await params;
  const { category, search } = await searchParams;
  setRequestLocale(locale);

  const categories = await getMindBookCategories();
  const topBooks = await getTopRatedMindBooks(12);

  return (
    <MindBooksContent
      categories={categories}
      topBooks={topBooks}
      initialCategory={category}
      initialSearch={search}
    />
  );
}
