"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BookList } from "@/components/books/book-list";
import { BookFilters } from "@/components/books/book-filters";
import { RecentlyViewedSection } from "@/components/books/recently-viewed";
import { useRecentlyViewed } from "@/lib/hooks/use-recently-viewed";
import { Button } from "@/components/ui/button";
import { BookOpen, Filter, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import type { Book } from "@/lib/books/types";

interface BooksResponse {
  books: Book[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  filters: {
    categories: { name: string; slug: string; count: number }[];
    languages: { code: string; name: string; count: number }[];
  };
}

export function BooksContent() {
  const t = useTranslations("books");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [language, setLanguage] = useState(searchParams.get("lang") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<BooksResponse | null>(null);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const { recentBooks, addBook, clearHistory } = useRecentlyViewed();

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync state to URL params
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (language) params.set("lang", language);
    if (page > 1) params.set("page", page.toString());
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [debouncedSearch, category, language, page, pathname, router]);

  // Fetch books (uses debounced search)
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (category) params.set("category", category);
        if (language) params.set("language", language);
        params.set("page", page.toString());
        params.set("perPage", "24");

        const res = await fetch(`/api/books?${params}`);
        const json = await res.json();
        setData(json);

        // Fetch like counts for these books
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
  }, [debouncedSearch, category, language, page]);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setLanguage("");
    setPage(1);
  };

  const categories = useMemo(
    () =>
      data?.filters?.categories?.map((c) => ({
        value: c.name.toLowerCase(),
        label: `${c.name} (${c.count})`,
      })) || [],
    [data?.filters?.categories]
  );

  const languages = useMemo(
    () =>
      data?.filters?.languages?.map((l) => ({
        value: l.code,
        label: `${l.name} (${l.count})`,
      })) || [],
    [data?.filters?.languages]
  );

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-500">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters - sticky on mobile */}
        <div className="mb-8 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold">{t("filters")}</h2>
          </div>
          <BookFilters
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            category={category}
            onCategoryChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
            language={language}
            onLanguageChange={(value) => {
              setLanguage(value);
              setPage(1);
            }}
            categories={categories}
            languages={languages}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">
            <span className="text-orange-600 dark:text-orange-400">
              {data?.pagination?.total || 0}
            </span>{" "}
            <span className="text-muted-foreground">resources found</span>
          </span>
        </div>

        {/* Recently Viewed */}
        <RecentlyViewedSection books={recentBooks} onClear={clearHistory} />

        {/* Book List */}
        <BookList
          books={data?.books || []}
          isLoading={isLoading}
          likeCounts={likeCounts}
          onView={addBook}
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
