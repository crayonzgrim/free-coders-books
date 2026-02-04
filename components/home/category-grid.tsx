"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Brain,
  ChevronDown,
  Cloud,
  Code,
  Cpu,
  Database,
  FileCode,
  Gamepad2,
  Monitor,
  Network,
  Server,
  Shield,
  Smartphone,
  Terminal,
  type LucideIcon,
} from "lucide-react";

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface CategoryGridProps {
  categories: Category[];
  initialCount?: number;
  loadMoreCount?: number;
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

export function CategoryGrid({ categories, initialCount = 8, loadMoreCount = 8 }: CategoryGridProps) {
  const t = useTranslations("home");
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const visibleCategories = categories.slice(0, visibleCount);
  const hasMore = visibleCount < categories.length;
  const remainingCount = categories.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + loadMoreCount, categories.length));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {visibleCategories.map((category) => {
          const style = getCategoryStyle(category.name);
          const Icon = style.icon;
          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <Card className="hover-lift border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 h-full">
                <CardContent className="flex flex-col items-center text-center gap-2 p-3 sm:flex-row sm:text-left sm:gap-4 sm:p-5">
                  <div
                    className={`rounded-xl ${style.iconBg} p-2.5 sm:p-3 shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-5 w-5 ${style.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs sm:text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 sm:truncate">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
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

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="gap-2"
          >
            <ChevronDown className="h-4 w-4" />
            {t("showMore")} ({remainingCount})
          </Button>
        </div>
      )}
    </div>
  );
}
