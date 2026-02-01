import type { Book } from "./types";

// Search books by title or author
export function searchBooks(books: Book[], query: string): Book[] {
  if (!query.trim()) return books;

  const lowerQuery = query.toLowerCase();
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      (book.author && book.author.toLowerCase().includes(lowerQuery))
  );
}

// Filter books by category
export function filterByCategory(books: Book[], category: string): Book[] {
  if (!category) return books;
  return books.filter(
    (book) => book.category.toLowerCase() === category.toLowerCase()
  );
}

// Filter books by language
export function filterByLanguage(books: Book[], languageCode: string): Book[] {
  if (!languageCode) return books;
  return books.filter((book) => book.languageCode === languageCode);
}

// Combined filter function
export function filterBooks(
  books: Book[],
  options: {
    search?: string;
    category?: string;
    language?: string;
  }
): Book[] {
  let filtered = books;

  if (options.search) {
    filtered = searchBooks(filtered, options.search);
  }

  if (options.category) {
    filtered = filterByCategory(filtered, options.category);
  }

  if (options.language) {
    filtered = filterByLanguage(filtered, options.language);
  }

  return filtered;
}

// Pagination helper
export function paginateBooks(
  books: Book[],
  page: number,
  perPage: number
): {
  books: Book[];
  total: number;
  totalPages: number;
  currentPage: number;
} {
  const total = books.length;
  const totalPages = Math.ceil(total / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  return {
    books: books.slice(start, end),
    total,
    totalPages,
    currentPage,
  };
}

// Language flags mapping
export const languageFlags: Record<string, string> = {
  en: "🇺🇸",
  ko: "🇰🇷",
  es: "🇪🇸",
  zh: "🇨🇳",
  ja: "🇯🇵",
  de: "🇩🇪",
  fr: "🇫🇷",
  pt: "🇧🇷",
  ru: "🇷🇺",
  ar: "🇸🇦",
  it: "🇮🇹",
  nl: "🇳🇱",
  pl: "🇵🇱",
  tr: "🇹🇷",
  vi: "🇻🇳",
  id: "🇮🇩",
  th: "🇹🇭",
  uk: "🇺🇦",
  cs: "🇨🇿",
  el: "🇬🇷",
  he: "🇮🇱",
  hi: "🇮🇳",
  hu: "🇭🇺",
  sv: "🇸🇪",
  fi: "🇫🇮",
  da: "🇩🇰",
  no: "🇳🇴",
  fa: "🇮🇷",
  ro: "🇷🇴",
  sk: "🇸🇰",
  bg: "🇧🇬",
  hr: "🇭🇷",
  sr: "🇷🇸",
  sl: "🇸🇮",
  lt: "🇱🇹",
  lv: "🇱🇻",
  et: "🇪🇪",
  ta: "🇮🇳",
  te: "🇮🇳",
  bn: "🇧🇩",
  ms: "🇲🇾",
};

export function getLanguageFlag(code: string): string {
  return languageFlags[code] || "🌐";
}

// Category color mapping
export const categoryColors: Record<
  string,
  { bg: string; text: string; darkBg: string; darkText: string }
> = {
  javascript: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    darkBg: "dark:bg-yellow-900/30",
    darkText: "dark:text-yellow-300",
  },
  python: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    darkBg: "dark:bg-blue-900/30",
    darkText: "dark:text-blue-300",
  },
  rust: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    darkBg: "dark:bg-orange-900/30",
    darkText: "dark:text-orange-300",
  },
  go: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    darkBg: "dark:bg-cyan-900/30",
    darkText: "dark:text-cyan-300",
  },
  typescript: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    darkBg: "dark:bg-blue-900/30",
    darkText: "dark:text-blue-300",
  },
  java: {
    bg: "bg-red-100",
    text: "text-red-700",
    darkBg: "dark:bg-red-900/30",
    darkText: "dark:text-red-300",
  },
  "c++": {
    bg: "bg-purple-100",
    text: "text-purple-700",
    darkBg: "dark:bg-purple-900/30",
    darkText: "dark:text-purple-300",
  },
  c: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    darkBg: "dark:bg-gray-800/50",
    darkText: "dark:text-gray-300",
  },
  ruby: {
    bg: "bg-red-100",
    text: "text-red-700",
    darkBg: "dark:bg-red-900/30",
    darkText: "dark:text-red-300",
  },
  php: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    darkBg: "dark:bg-indigo-900/30",
    darkText: "dark:text-indigo-300",
  },
  default: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    darkBg: "dark:bg-orange-900/30",
    darkText: "dark:text-orange-300",
  },
};

export function getCategoryColors(category: string) {
  const key = category.toLowerCase();
  return categoryColors[key] || categoryColors.default;
}
