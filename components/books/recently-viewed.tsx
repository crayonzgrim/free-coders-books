"use client";

import { useTranslations } from "next-intl";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategoryColors, getLanguageFlag } from "@/lib/books/utils";

interface RecentlyViewedBook {
  url: string;
  title: string;
  category: string;
  languageCode: string;
  languageName: string;
  author?: string;
  viewedAt: number;
}

interface RecentlyViewedSectionProps {
  books: RecentlyViewedBook[];
  onClear?: () => void;
}

export function RecentlyViewedSection({ books, onClear }: RecentlyViewedSectionProps) {
  const t = useTranslations("books");

  if (books.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          <h2 className="font-semibold text-lg">{t("recentlyViewed")}</h2>
        </div>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            {t("clearHistory")}
          </Button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {books.slice(0, 8).map((book) => {
          const colors = getCategoryColors(book.category);
          const flag = getLanguageFlag(book.languageCode);
          return (
            <a
              key={book.url}
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[200px] rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 bg-card p-3 transition-all hover:shadow-md group"
            >
              <div className={cn("h-1 w-full rounded-full mb-2", colors.bg, colors.darkBg)} />
              <p className="text-sm font-medium line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {book.title}
              </p>
              {book.author && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {book.author}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                    colors.bg, colors.text, colors.darkBg, colors.darkText
                  )}
                >
                  {book.category}
                </span>
                <span className="text-xs">{flag}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
