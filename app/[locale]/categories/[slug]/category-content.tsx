"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { BookList } from "@/components/books/book-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Layers, Sparkles, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import type { Book } from "@/lib/books/types";

interface BooksResponse {
  books: Book[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

interface CategoryContentProps {
  slug: string;
  categoryName: string;
}

export function CategoryContent({ slug, categoryName }: CategoryContentProps) {
  const t = useTranslations("categories");
  // NOTE: Authentication disabled
  const session = null as { user?: { id: string } } | null;

  const [data, setData] = useState<BooksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState<string>("");
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string; count: number }[]>([]);
  const [bookmarkedUrls, setBookmarkedUrls] = useState<string[]>([]);
  const [likedUrls, setLikedUrls] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // Fetch available languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch(`/api/books?category=${slug}&perPage=1`);
        const json = await res.json();
        if (json.filters?.languages) {
          setAvailableLanguages(json.filters.languages);
        }
      } catch {
        // Silent fail - languages will show empty
      }
    };
    fetchLanguages();
  }, [slug]);

  // Fetch books for this category
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("category", slug);
        params.set("page", page.toString());
        params.set("perPage", "24");
        if (language) {
          params.set("language", language);
        }

        const res = await fetch(`/api/books?${params}`);
        const json = await res.json();
        setData(json);

        // Fetch like counts
        if (json.books?.length > 0) {
          const urls = json.books.map((b: Book) => encodeURIComponent(b.url)).join(",");
          const countRes = await fetch(`/api/likes/count?bookUrls=${urls}`);
          if (countRes.ok) {
            const counts = await countRes.json();
            setLikeCounts(counts);
          }
        }
      } catch {
        // Error handled by error boundary
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [slug, page, language]);

  // Reset page when language changes
  const handleLanguageChange = (value: string) => {
    setLanguage(value === "all" ? "" : value);
    setPage(1);
  };

  // Fetch user's bookmarks and likes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;

      try {
        const [bookmarksRes, likesRes] = await Promise.all([
          fetch("/api/bookmarks"),
          fetch("/api/likes"),
        ]);

        if (bookmarksRes.ok) {
          const bookmarks = await bookmarksRes.json();
          setBookmarkedUrls(bookmarks.map((b: { bookUrl: string }) => b.bookUrl));
        }

        if (likesRes.ok) {
          const likes = await likesRes.json();
          setLikedUrls(likes.map((l: { bookUrl: string }) => l.bookUrl));
        }
      } catch {
        // Silent fail - user data optional
      }
    };

    fetchUserData();
  }, [session]);

  const handleToggleBookmark = async (bookUrl: string, bookTitle: string) => {
    if (!session?.user) return;

    const isBookmarked = bookmarkedUrls.includes(bookUrl);

    try {
      if (isBookmarked) {
        await fetch(`/api/bookmarks?bookUrl=${encodeURIComponent(bookUrl)}`, {
          method: "DELETE",
        });
        setBookmarkedUrls((prev) => prev.filter((url) => url !== bookUrl));
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookUrl, bookTitle }),
        });
        setBookmarkedUrls((prev) => [...prev, bookUrl]);
      }
    } catch {
      // Silent fail - bookmark toggle
    }
  };

  const handleToggleLike = async (bookUrl: string) => {
    if (!session?.user) return;

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookUrl }),
      });

      if (res.ok) {
        const { liked, count } = await res.json();
        if (liked) {
          setLikedUrls((prev) => [...prev, bookUrl]);
        } else {
          setLikedUrls((prev) => prev.filter((url) => url !== bookUrl));
        }
        setLikeCounts((prev) => ({ ...prev, [bookUrl]: count }));
      }
    } catch {
      // Silent fail - like toggle
    }
  };

  // Use the category name from data if available, otherwise use the prop
  const displayName = data?.books?.[0]?.category || categoryName;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{displayName}</h1>
            {data?.pagination && (
              <Badge variant="secondary" className="text-base px-3 py-1">
                {data.pagination.total}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {t("booksInCategory", { count: data?.pagination?.total || 0 })}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Language Filter & Results count */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Language Filter */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select
              value={language || "all"}
              onChange={(e) => handleLanguageChange(e.target.value)}
              options={[
                { value: "all", label: "All Languages" },
                ...availableLanguages.map((lang) => ({
                  value: lang.code,
                  label: `${lang.name} (${lang.count})`
                })),
              ]}
              className="w-[220px]"
            />
          </div>

          {/* Results count */}
          {!isLoading && data?.pagination && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">
                <span className="text-orange-600 dark:text-orange-400">
                  {data.pagination.total}
                </span>{" "}
                <span className="text-muted-foreground">
                  resources
                  {language ? ` in ${availableLanguages.find(l => l.code === language)?.name || language}` : ""}
                  {" "}in {displayName}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Book List */}
        <BookList
          books={data?.books || []}
          isLoading={isLoading}
          bookmarkedUrls={bookmarkedUrls}
          likedUrls={likedUrls}
          likeCounts={likeCounts}
          onToggleBookmark={session ? handleToggleBookmark : undefined}
          onToggleLike={session ? handleToggleLike : undefined}
        />

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="px-4 text-sm text-muted-foreground">
              Page {page} of {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
