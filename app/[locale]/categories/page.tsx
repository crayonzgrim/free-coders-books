import { setRequestLocale } from "next-intl/server";
import { getAllCategories } from "@/lib/books";
import { CategoriesContent } from "./categories-content";

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await getAllCategories();

  return <CategoriesContent categories={categories} />;
}
