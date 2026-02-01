import type { MindBook, MindBookCategory, MindBooksData } from "./types";
import { slugify } from "../books/fetch-books";

const MIND_BOOKS_README_URL =
  "https://raw.githubusercontent.com/hackerkid/Mind-Expanding-Books/master/README.md";

// Cache for mind-expanding books data
let cachedData: MindBooksData | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Parse markdown table row into book data
function parseTableRow(row: string, category: string, categorySlug: string): MindBook | null {
  // Split by | and filter empty strings
  const cells = row.split("|").map((cell) => cell.trim()).filter(Boolean);

  if (cells.length < 4) return null;

  const [title, author, ratingCell, yearStr] = cells;

  // Parse rating: [4.46](https://www.goodreads.com/...)
  const ratingMatch = ratingCell.match(/\[(\d+\.?\d*)\]\((https?:\/\/[^\)]+)\)/);
  if (!ratingMatch) return null;

  const goodreadsRating = parseFloat(ratingMatch[1]);
  const goodreadsUrl = ratingMatch[2];
  const yearPublished = parseInt(yearStr, 10);

  if (isNaN(goodreadsRating) || isNaN(yearPublished)) return null;

  return {
    title: title.trim(),
    author: author.trim(),
    goodreadsRating,
    goodreadsUrl,
    yearPublished,
    category,
    categorySlug,
  };
}

// Parse markdown content into structured data
function parseMarkdown(markdown: string): MindBooksData {
  const categories: MindBookCategory[] = [];
  const lines = markdown.split("\n");

  let currentCategory: string | null = null;
  let currentCategorySlug: string | null = null;
  let currentBooks: MindBook[] = [];
  let inTable = false;
  let headerPassed = false;

  // Fiction subcategories to skip as main categories
  const fictionSubcategories = new Set([
    "classics", "fantasy", "historical fiction", "humor",
    "mystery", "science fiction", "horror", "miscellaneous"
  ]);

  for (const line of lines) {
    // Check for category header (## Category Name)
    const headerMatch = line.match(/^##\s+(.+)$/);
    if (headerMatch) {
      // Save previous category if exists
      if (currentCategory && currentBooks.length > 0) {
        categories.push({
          name: currentCategory,
          slug: currentCategorySlug!,
          books: currentBooks,
        });
      }

      currentCategory = headerMatch[1].trim();
      currentCategorySlug = slugify(currentCategory);
      currentBooks = [];
      inTable = false;
      headerPassed = false;

      // Skip "Table of Contents" and similar
      if (currentCategory.toLowerCase().includes("table of contents") ||
          currentCategory.toLowerCase().includes("books")) {
        currentCategory = null;
        currentCategorySlug = null;
      }

      continue;
    }

    // Skip if no current category
    if (!currentCategory) continue;

    // Detect table header row
    if (line.includes("| Name |") || line.includes("|---")) {
      inTable = true;
      headerPassed = line.includes("|---");
      continue;
    }

    // Mark header as passed after separator
    if (inTable && line.includes("|---")) {
      headerPassed = true;
      continue;
    }

    // Parse table data rows
    if (inTable && headerPassed && line.startsWith("|") && !line.includes("---")) {
      const book = parseTableRow(line, currentCategory, currentCategorySlug!);
      if (book) {
        currentBooks.push(book);
      }
    }

    // End of table (empty line or non-table content)
    if (inTable && !line.startsWith("|") && line.trim() !== "") {
      inTable = false;
      headerPassed = false;
    }
  }

  // Save last category
  if (currentCategory && currentBooks.length > 0) {
    categories.push({
      name: currentCategory,
      slug: currentCategorySlug!,
      books: currentBooks,
    });
  }

  const totalBooks = categories.reduce((sum, cat) => sum + cat.books.length, 0);

  return { categories, totalBooks };
}

export async function fetchMindBooksData(): Promise<MindBooksData> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedData && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  const response = await fetch(MIND_BOOKS_README_URL, {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Mind-Expanding Books: ${response.status}`);
  }

  const markdown = await response.text();
  const data = parseMarkdown(markdown);

  // Update cache
  cachedData = data;
  cacheTimestamp = now;

  return data;
}

// Get all mind-expanding books
export async function getAllMindBooks(): Promise<MindBook[]> {
  const data = await fetchMindBooksData();
  return data.categories.flatMap((cat) => cat.books);
}

// Get all categories
export async function getMindBookCategories(): Promise<MindBookCategory[]> {
  const data = await fetchMindBooksData();
  return data.categories;
}

// Get books by category slug
export async function getMindBooksByCategory(categorySlug: string): Promise<MindBook[]> {
  const data = await fetchMindBooksData();
  const category = data.categories.find((cat) => cat.slug === categorySlug);
  return category?.books || [];
}

// Get category by slug
export async function getMindBookCategory(categorySlug: string): Promise<MindBookCategory | null> {
  const data = await fetchMindBooksData();
  return data.categories.find((cat) => cat.slug === categorySlug) || null;
}

// Search mind-expanding books
export async function searchMindBooks(query: string): Promise<MindBook[]> {
  const books = await getAllMindBooks();
  const lowerQuery = query.toLowerCase();

  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.category.toLowerCase().includes(lowerQuery)
  );
}

// Get top rated books
export async function getTopRatedMindBooks(limit: number = 10): Promise<MindBook[]> {
  const books = await getAllMindBooks();
  return books
    .sort((a, b) => b.goodreadsRating - a.goodreadsRating)
    .slice(0, limit);
}
