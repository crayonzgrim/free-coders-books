import type { FpbData, Book, FpbSection, FpbSubsection, FpbLanguageData } from "./types";

const FPB_JSON_URL =
  "https://raw.githubusercontent.com/EbookFoundation/free-programming-books-search/main/fpb.json";

// Cache for fpb.json data
let cachedData: FpbData | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function fetchFpbData(): Promise<FpbData> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedData && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  const response = await fetch(FPB_JSON_URL, {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch fpb.json: ${response.status}`);
  }

  const data: FpbData = await response.json();

  // Update cache
  cachedData = data;
  cacheTimestamp = now;

  return data;
}

// Flatten all entries from a section and its subsections
function flattenSection(
  section: FpbSection | FpbSubsection,
  languageCode: string,
  languageName: string,
  parentCategory?: string
): Book[] {
  const books: Book[] = [];
  const category = parentCategory || section.section;

  // Add entries from this section
  if (section.entries) {
    for (const entry of section.entries) {
      books.push({
        url: entry.url,
        title: entry.title,
        author: entry.author,
        notes: entry.notes,
        category,
        subcategory: parentCategory ? section.section : undefined,
        languageCode,
        languageName,
      });
    }
  }

  // Recursively add entries from subsections
  if (section.subsections) {
    for (const subsection of section.subsections) {
      books.push(
        ...flattenSection(subsection, languageCode, languageName, category)
      );
    }
  }

  return books;
}

// Get all languages from the data structure
function getLanguages(data: FpbData): FpbLanguageData[] {
  // Navigate: root -> children[0] (books node) -> children (language array)
  const booksNode = data.children?.find((child) => child.type === "books");
  return booksNode?.children || [];
}

// Get all books normalized
export async function getAllBooks(): Promise<Book[]> {
  const data = await fetchFpbData();
  const books: Book[] = [];

  const languages = getLanguages(data);

  for (const langData of languages) {
    const langCode = langData.language?.code || "unknown";
    const langName = langData.language?.name || "Unknown";

    if (langData.sections) {
      for (const section of langData.sections) {
        books.push(...flattenSection(section, langCode, langName));
      }
    }
  }

  return books;
}

// Get books by language
export async function getBooksByLanguage(languageCode: string): Promise<Book[]> {
  const books = await getAllBooks();
  return books.filter((book) => book.languageCode === languageCode);
}

// Get books by category
export async function getBooksByCategory(categorySlug: string): Promise<Book[]> {
  const books = await getAllBooks();
  return books.filter(
    (book) => slugify(book.category) === categorySlug
  );
}

// Get all categories with counts
export async function getAllCategories(): Promise<
  { name: string; slug: string; count: number }[]
> {
  const books = await getAllBooks();
  const categoryMap = new Map<string, number>();

  for (const book of books) {
    const count = categoryMap.get(book.category) || 0;
    categoryMap.set(book.category, count + 1);
  }

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      slug: slugify(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// Get all languages with counts
export async function getAllLanguages(): Promise<
  { code: string; name: string; count: number }[]
> {
  const books = await getAllBooks();
  const languageMap = new Map<string, { name: string; count: number }>();

  for (const book of books) {
    const existing = languageMap.get(book.languageCode);
    if (existing) {
      existing.count++;
    } else {
      languageMap.set(book.languageCode, {
        name: book.languageName,
        count: 1,
      });
    }
  }

  return Array.from(languageMap.entries())
    .map(([code, { name, count }]) => ({ code, name, count }))
    .sort((a, b) => b.count - a.count);
}

// Helper: slugify category name
export function slugify(text: string): string {
  return text
    .toLowerCase()
    // Handle special programming language characters before removing others
    .replace(/\+\+/g, "-plus-plus")
    .replace(/\+/g, "-plus")
    .replace(/#/g, "-sharp")
    .replace(/\*/g, "-star")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .trim();
}
