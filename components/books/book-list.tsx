"use client";

import { useTranslations } from "next-intl";
import { BookCard } from "./book-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Book } from "@/lib/books/types";

interface BookListProps {
  books: Book[];
  isLoading?: boolean;
  bookmarkedUrls?: string[];
  likedUrls?: string[];
  likeCounts?: Record<string, number>;
  onToggleBookmark?: (bookUrl: string, bookTitle: string) => void;
  onToggleLike?: (bookUrl: string) => void;
}

export function BookList({
  books,
  isLoading = false,
  bookmarkedUrls = [],
  likedUrls = [],
  likeCounts = {},
  onToggleBookmark,
  onToggleLike,
}: BookListProps) {
  const t = useTranslations("common");

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book.url}
          book={book}
          isBookmarked={bookmarkedUrls.includes(book.url)}
          isLiked={likedUrls.includes(book.url)}
          likeCount={likeCounts[book.url] || 0}
          onToggleBookmark={onToggleBookmark}
          onToggleLike={onToggleLike}
        />
      ))}
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-xl border bg-card p-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-8" />
      </div>
      <div className="mt-auto pt-4 border-t mt-4">
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
