import { describe, it, expect } from "vitest";
import {
  searchBooks,
  filterByCategory,
  filterByLanguage,
  filterBooks,
  paginateBooks,
  getLanguageFlag,
  getCategoryColors,
} from "../books/utils";
import type { Book } from "../books/types";

// Mock book data for testing
const mockBooks: Book[] = [
  {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    url: "https://example.com/js-good-parts",
    category: "JavaScript",
    languageCode: "en",
    languageName: "English",
  },
  {
    title: "Python for Beginners",
    author: "John Smith",
    url: "https://example.com/python-beginners",
    category: "Python",
    languageCode: "en",
    languageName: "English",
  },
  {
    title: "JavaScript Complete Guide (Korean)",
    author: "김개발",
    url: "https://example.com/js-korean",
    category: "JavaScript",
    languageCode: "ko",
    languageName: "Korean",
  },
  {
    title: "Rust Programming",
    url: "https://example.com/rust",
    category: "Rust",
    languageCode: "en",
    languageName: "English",
  },
];

describe("searchBooks", () => {
  it("should return all books when query is empty", () => {
    const result = searchBooks(mockBooks, "");
    expect(result).toHaveLength(4);
  });

  it("should filter books by title", () => {
    const result = searchBooks(mockBooks, "JavaScript");
    expect(result).toHaveLength(2);
    expect(result[0].title).toContain("JavaScript");
  });

  it("should filter books by author", () => {
    const result = searchBooks(mockBooks, "Douglas");
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe("Douglas Crockford");
  });

  it("should be case insensitive", () => {
    const result = searchBooks(mockBooks, "JAVASCRIPT");
    expect(result).toHaveLength(2);
  });

  it("should handle books without author", () => {
    const result = searchBooks(mockBooks, "Rust");
    expect(result).toHaveLength(1);
  });

  it("should return empty array when no matches", () => {
    const result = searchBooks(mockBooks, "nonexistent");
    expect(result).toHaveLength(0);
  });
});

describe("filterByCategory", () => {
  it("should return all books when category is empty", () => {
    const result = filterByCategory(mockBooks, "");
    expect(result).toHaveLength(4);
  });

  it("should filter by category", () => {
    const result = filterByCategory(mockBooks, "JavaScript");
    expect(result).toHaveLength(2);
  });

  it("should be case insensitive", () => {
    const result = filterByCategory(mockBooks, "javascript");
    expect(result).toHaveLength(2);
  });

  it("should return empty when category not found", () => {
    const result = filterByCategory(mockBooks, "nonexistent");
    expect(result).toHaveLength(0);
  });
});

describe("filterByLanguage", () => {
  it("should return all books when language is empty", () => {
    const result = filterByLanguage(mockBooks, "");
    expect(result).toHaveLength(4);
  });

  it("should filter by language code", () => {
    const result = filterByLanguage(mockBooks, "ko");
    expect(result).toHaveLength(1);
    expect(result[0].languageCode).toBe("ko");
  });

  it("should return multiple books for common language", () => {
    const result = filterByLanguage(mockBooks, "en");
    expect(result).toHaveLength(3);
  });
});

describe("filterBooks", () => {
  it("should apply all filters", () => {
    const result = filterBooks(mockBooks, {
      search: "JavaScript",
      category: "JavaScript",
      language: "en",
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("JavaScript: The Good Parts");
  });

  it("should work with partial filters", () => {
    const result = filterBooks(mockBooks, {
      category: "JavaScript",
    });
    expect(result).toHaveLength(2);
  });

  it("should return all books when no filters", () => {
    const result = filterBooks(mockBooks, {});
    expect(result).toHaveLength(4);
  });
});

describe("paginateBooks", () => {
  it("should paginate correctly", () => {
    const result = paginateBooks(mockBooks, 1, 2);
    expect(result.books).toHaveLength(2);
    expect(result.total).toBe(4);
    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(1);
  });

  it("should return correct page", () => {
    const result = paginateBooks(mockBooks, 2, 2);
    expect(result.books).toHaveLength(2);
    expect(result.currentPage).toBe(2);
  });

  it("should handle page out of bounds", () => {
    const result = paginateBooks(mockBooks, 10, 2);
    expect(result.currentPage).toBe(2); // Should return last page
  });

  it("should handle page 0 or negative", () => {
    const result = paginateBooks(mockBooks, 0, 2);
    expect(result.currentPage).toBe(1);
  });

  it("should handle perPage larger than total", () => {
    const result = paginateBooks(mockBooks, 1, 100);
    expect(result.books).toHaveLength(4);
    expect(result.totalPages).toBe(1);
  });
});

describe("getLanguageFlag", () => {
  it("should return correct flag for known language", () => {
    expect(getLanguageFlag("en")).toBe("🇺🇸");
    expect(getLanguageFlag("ko")).toBe("🇰🇷");
    expect(getLanguageFlag("es")).toBe("🇪🇸");
  });

  it("should return globe for unknown language", () => {
    expect(getLanguageFlag("xyz")).toBe("🌐");
  });
});

describe("getCategoryColors", () => {
  it("should return correct colors for known category", () => {
    const colors = getCategoryColors("JavaScript");
    expect(colors.bg).toBe("bg-yellow-100");
  });

  it("should be case insensitive", () => {
    const colors = getCategoryColors("PYTHON");
    expect(colors.bg).toBe("bg-blue-100");
  });

  it("should return default colors for unknown category", () => {
    const colors = getCategoryColors("unknown");
    expect(colors.bg).toBe("bg-orange-100");
  });
});
