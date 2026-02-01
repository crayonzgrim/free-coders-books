"use client";

// NOTE: Authentication disabled - useSession removed
// import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { BookList } from "@/components/books/book-list";
import { Button } from "@/components/ui/button";
import { Bookmark, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import type { Book } from "@/lib/books/types";
import type { Bookmark as BookmarkType } from "@/lib/db/schema";

export default function BookmarksPage() {
  // NOTE: Authentication disabled
  const session = null as { user?: { id: string } } | null;
  const status = "unauthenticated" as const;
  const t = useTranslations("bookmarks");

  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookmarks and convert to books
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/bookmarks");
        if (res.ok) {
          const data: BookmarkType[] = await res.json();
          setBookmarks(data);

          // Convert bookmarks to book-like objects for display
          const bookObjects: Book[] = data.map((bookmark) => ({
            url: bookmark.bookUrl,
            title: bookmark.bookTitle,
            category: "Bookmarked",
            languageCode: "en",
            languageName: "English",
          }));
          setBooks(bookObjects);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [session]);

  const handleToggleBookmark = async (bookUrl: string) => {
    if (!session?.user) return;

    try {
      await fetch(`/api/bookmarks?bookUrl=${encodeURIComponent(bookUrl)}`, {
        method: "DELETE",
      });

      setBooks((prev) => prev.filter((book) => book.url !== bookUrl));
      setBookmarks((prev) => prev.filter((b) => b.bookUrl !== bookUrl));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  // NOTE: Authentication disabled - skip loading state check
  if (false) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-10 w-48 bg-orange-200/50 dark:bg-orange-800/30 rounded-lg mb-4" />
              <div className="h-6 w-32 bg-orange-100/50 dark:bg-orange-900/20 rounded" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-orange-100/50 dark:bg-orange-900/20 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto w-fit mb-6 bg-orange-500 p-4 rounded-2xl">
            <Bookmark className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to save and access your bookmarked resources
          </p>
          <Link href="/auth/signin">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-warm"
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500">
              <Bookmark className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Content */}
        {books.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mx-auto w-fit mb-6">
              <div className="absolute inset-0 bg-orange-200 dark:bg-orange-800 rounded-2xl blur opacity-40" />
              <div className="relative bg-orange-100 dark:bg-orange-900/30 p-4 rounded-2xl">
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">{t("empty")}</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              {t("emptyDescription")}
            </p>
            <Link href="/books">
              <Button className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-warm">
                {t("startBrowsing")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">
                <span className="text-orange-600 dark:text-orange-400">
                  {books.length}
                </span>{" "}
                <span className="text-muted-foreground">saved resources</span>
              </span>
            </div>
            <BookList
              books={books}
              bookmarkedUrls={books.map((b) => b.url)}
              onToggleBookmark={(url) => handleToggleBookmark(url)}
            />
          </>
        )}
      </div>
    </div>
  );
}
