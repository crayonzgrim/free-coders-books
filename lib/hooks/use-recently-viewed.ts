"use client";

import { useState, useEffect, useCallback } from "react";
import type { Book } from "@/lib/books/types";

const STORAGE_KEY = "fcb-recently-viewed";
const MAX_ITEMS = 12;

interface RecentlyViewedBook {
  url: string;
  title: string;
  category: string;
  languageCode: string;
  languageName: string;
  author?: string;
  viewedAt: number;
}

export function useRecentlyViewed() {
  const [recentBooks, setRecentBooks] = useState<RecentlyViewedBook[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentBooks(JSON.parse(stored));
      }
    } catch {
      // localStorage not available or corrupted
    }
  }, []);

  const addBook = useCallback((book: Book) => {
    setRecentBooks((prev) => {
      const filtered = prev.filter((b) => b.url !== book.url);
      const updated = [
        {
          url: book.url,
          title: book.title,
          category: book.category,
          languageCode: book.languageCode,
          languageName: book.languageName,
          author: book.author,
          viewedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, MAX_ITEMS);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Storage full or not available
      }

      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecentBooks([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage not available
    }
  }, []);

  return { recentBooks, addBook, clearHistory };
}
