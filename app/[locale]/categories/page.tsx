import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAllCategories } from "@/lib/books";
import { CategoriesContent } from "./categories-content";

export const metadata: Metadata = {
  title: "Programming Book Categories",
  description:
    "Browse 330+ categories of free programming books — from JavaScript and Python to machine learning and DevOps.",
  openGraph: {
    title: "Programming Book Categories | Free Coders Books",
    description:
      "Browse 330+ categories of free programming books — from JavaScript and Python to machine learning and DevOps.",
  },
};

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = await getAllCategories();

  return <CategoriesContent categories={categories} />;
}
