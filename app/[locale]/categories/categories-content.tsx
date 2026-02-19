"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Globe,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface CategoriesContentProps {
  categories: Category[];
}

const colorPalette = [
  { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400", border: "hover:border-yellow-300 dark:hover:border-yellow-700" },
  { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", border: "hover:border-blue-300 dark:hover:border-blue-700" },
  { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", border: "hover:border-orange-300 dark:hover:border-orange-700" },
  { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400", border: "hover:border-cyan-300 dark:hover:border-cyan-700" },
  { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", border: "hover:border-red-300 dark:hover:border-red-700" },
  { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", border: "hover:border-green-300 dark:hover:border-green-700" },
  { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", border: "hover:border-purple-300 dark:hover:border-purple-700" },
  { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-600 dark:text-pink-400", border: "hover:border-pink-300 dark:hover:border-pink-700" },
  { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", border: "hover:border-indigo-300 dark:hover:border-indigo-700" },
  { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", border: "hover:border-amber-300 dark:hover:border-amber-700" },
];

function getColorForIndex(index: number) {
  return colorPalette[index % colorPalette.length];
}

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("web") || lower.includes("html") || lower.includes("css")) {
    return Globe;
  }
  if (lower.includes("book") || lower.includes("reading")) {
    return BookOpen;
  }
  return Code;
}

export function CategoriesContent({ categories }: CategoriesContentProps) {
  const t = useTranslations("categories");

  // Split categories into programming languages and subjects
  // For simplicity, we'll show all as a single list since fpb.json doesn't categorize them
  const topCategories = categories.slice(0, 50);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-500">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold">All Categories</h2>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium">
              {topCategories.length}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topCategories.map((category, index) => (
              <CategoryCard
                key={category.slug}
                category={category}
                colorIndex={index}
                t={t}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

interface CategoryCardProps {
  category: Category;
  colorIndex: number;
  t: ReturnType<typeof useTranslations<"categories">>;
}

function CategoryCard({ category, colorIndex, t }: CategoryCardProps) {
  const colors = getColorForIndex(colorIndex);
  const Icon = getCategoryIcon(category.name);

  return (
    <Link href={`/books?category=${encodeURIComponent(category.name.toLowerCase())}`} className="group">
      <Card className={cn(
        "hover-lift border-2 border-transparent h-full transition-all",
        colors.border
      )}>
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={cn(
              "rounded-xl p-3 group-hover:scale-110 transition-transform",
              colors.bg
            )}
          >
            <Icon className={cn("h-5 w-5", colors.text)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("booksInCategory", { count: category.count })}
            </p>
          </div>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
            colors.bg
          )}>
            <ArrowRight className={cn("h-4 w-4", colors.text)} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
