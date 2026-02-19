"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  Star,
  ExternalLink,
  ArrowRight,
  Brain,
  Lightbulb,
  BookMarked,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import type { MindBook, MindBookCategory } from "@/lib/mind-books/types";

interface MindBooksContentProps {
  categories: MindBookCategory[];
  topBooks: MindBook[];
  initialCategory?: string;
  initialSearch?: string;
}

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "startups and business": "💼",
  "philosophy and psychology": "🧠",
  "autobiographies and biographies": "📖",
  "history": "🏛️",
  "science and medicine": "🔬",
  "logic and problem solving": "🧩",
  "politics": "🏛️",
  "economics": "📈",
  "gender": "⚧️",
  "sexuality": "❤️",
  "race": "✊",
  "education": "🎓",
  "writing": "✍️",
  "theater and film": "🎬",
  "shakespeare": "🎭",
  "fiction": "📚",
  "classics": "📜",
  "fantasy": "🐉",
  "historical fiction": "⚔️",
  "humor": "😄",
  "mystery": "🔍",
  "science fiction": "🚀",
  "horror": "👻",
  "health": "💪",
  "design": "🎨",
  "travel": "✈️",
  "language": "🗣️",
  "nature": "🌿",
  "art": "🖼️",
};

function getCategoryIcon(categoryName: string): React.ReactNode {
  const lowerName = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  return "📚";
}

export function MindBooksContent({
  categories,
  topBooks,
  initialCategory,
  initialSearch,
}: MindBooksContentProps) {
  const t = useTranslations("mindBooks");
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);

  // Get all books from all categories
  const allBooks = useMemo(() => {
    return categories.flatMap((cat) => cat.books);
  }, [categories]);

  // Filter books based on search and category
  const filteredBooks = useMemo(() => {
    let books = selectedCategory
      ? categories.find((c) => c.slug === selectedCategory)?.books || []
      : allBooks;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    return books;
  }, [allBooks, categories, selectedCategory, searchQuery]);

  const totalBooks = allBooks.length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400 dark:border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400">
              <Brain className="h-4 w-4" />
              <span>{t("badge")}</span>
              <Lightbulb className="h-4 w-4 animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-purple-600 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {totalBooks.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground">{t("statsBooks")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {categories.length}
                </div>
                <div className="text-sm text-muted-foreground">{t("statsCategories")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 border-b border-gray-200 dark:border-gray-800 sticky top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Category Filter - Hidden on mobile */}
            {/* <div className="hidden md:flex items-center gap-2 flex-wrap justify-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {t("allCategories")}
              </Button>
              {categories.slice(0, 5).map((cat) => (
                <Button
                  key={cat.slug}
                  variant={selectedCategory === cat.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={selectedCategory === cat.slug ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  <span className="mr-1">{getCategoryIcon(cat.name)}</span>
                  {cat.name}
                </Button>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Top Rated Books */}
      {!selectedCategory && !searchQuery && (
        <section className="py-12 bg-linear-to-b from-purple-50/50 to-transparent dark:from-purple-950/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl md:text-2xl font-bold">{t("topRated")}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {topBooks.map((book, index) => (
                <a
                  key={`${book.title}-${index}`}
                  href={book.goodreadsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {book.title}
                        </h3>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="font-medium">{book.goodreadsRating.toFixed(2)}</span>
                        </div>
                        <span className="text-muted-foreground">{book.yearPublished}</span>
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        {getCategoryIcon(book.category)} {book.category}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid or Filtered Results */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          {selectedCategory || searchQuery ? (
            // Filtered Results
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">
                  {selectedCategory
                    ? categories.find((c) => c.slug === selectedCategory)?.name
                    : t("searchResults")}
                </h2>
                <span className="text-muted-foreground">
                  {filteredBooks.length} {t("booksFound")}
                </span>
              </div>

              {filteredBooks.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredBooks.map((book, index) => (
                    <a
                      key={`${book.title}-${index}`}
                      href={book.goodreadsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-all hover:border-purple-300 dark:hover:border-purple-700">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {book.title}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-3 w-3 fill-current" />
                              <span className="font-medium">{book.goodreadsRating.toFixed(2)}</span>
                            </div>
                            <span className="text-muted-foreground">{book.yearPublished}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t("noResults")}</p>
                </div>
              )}
            </>
          ) : (
            // Categories Overview
            <>
              <h2 className="text-xl md:text-2xl font-bold mb-6">{t("browseCategories")}</h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.slug)}
                    className="group text-left"
                  >
                    <Card className="h-full hover:shadow-lg transition-all border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700">
                      <CardContent className="flex items-center gap-4 p-5">
                        <div className="text-3xl">
                          {getCategoryIcon(category.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.books.length} {t("books")}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <ArrowRight className="h-4 w-4 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Source Attribution */}
      <section className="py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <BookMarked className="h-4 w-4" />
            <span>{t("sourceAttribution")}</span>
            <a
              href="https://github.com/hackerkid/Mind-Expanding-Books"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Mind-Expanding-Books
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
