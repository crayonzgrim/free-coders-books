"use client";

import { useTranslations } from "next-intl";
import { ExternalLink, Bookmark, BookmarkCheck, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategoryColors, getLanguageFlag } from "@/lib/books/utils";
import type { Book } from "@/lib/books/types";

interface BookCardProps {
  book: Book;
  isBookmarked?: boolean;
  isLiked?: boolean;
  likeCount?: number;
  onToggleBookmark?: (bookUrl: string, bookTitle: string) => void;
  onToggleLike?: (bookUrl: string) => void;
}

export function BookCard({
  book,
  isBookmarked = false,
  isLiked = false,
  likeCount = 0,
  onToggleBookmark,
  onToggleLike,
}: BookCardProps) {
  const t = useTranslations("books");

  const colors = getCategoryColors(book.category);
  const flag = getLanguageFlag(book.languageCode);

  return (
    <Card className="group relative flex flex-col h-full hover-lift border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 overflow-hidden cursor-pointer">
      {/* Full card clickable link */}
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-0"
        aria-label={book.title}
      />
      {/* Category Color Bar */}
      <div className={cn("h-1.5 w-full", colors.bg, colors.darkBg)} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {book.title}
          </CardTitle>
          <div className="relative z-10 flex shrink-0 gap-1">
            {onToggleLike && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 transition-all",
                  isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-muted-foreground hover:text-red-500"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(book.url);
                }}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              </Button>
            )}
            {onToggleBookmark && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 transition-all",
                  isBookmarked
                    ? "text-orange-500 hover:text-orange-600"
                    : "text-muted-foreground hover:text-orange-500"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(book.url, book.title);
                }}
                aria-label={isBookmarked ? t("removeBookmark") : t("addBookmark")}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5 fill-current" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
        {book.author && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            by {book.author}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-2">
          {/* Category Badge */}
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              colors.bg,
              colors.text,
              colors.darkBg,
              colors.darkText
            )}
          >
            {book.category}
          </span>

          {/* Language Badge */}
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium">
            <span>{flag}</span>
            <span className="uppercase">{book.languageCode}</span>
          </span>

          {/* Notes/Format badges */}
          {book.notes?.slice(0, 2).map((note, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-xs font-medium"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Like count */}
        {likeCount > 0 && (
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Heart className="h-3 w-3" />
            <span>{likeCount}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-gray-100 dark:border-gray-800">
        <a
          href={book.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors group/link"
        >
          {t("readNow")}
          <ExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
      </CardFooter>
    </Card>
  );
}
