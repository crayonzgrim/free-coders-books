import { setRequestLocale } from "next-intl/server";
import { MindBooksContent } from "./mind-books-content";
import { getMindBookCategories, getTopRatedMindBooks } from "@/lib/mind-books";

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
