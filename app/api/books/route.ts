import { NextRequest, NextResponse } from "next/server";
import { getAllBooks, getAllCategories, getAllLanguages } from "@/lib/books";
import { filterBooks, paginateBooks } from "@/lib/books/utils";
import { checkRateLimit, getClientIp, getRateLimitHeaders, rateLimiters } from "@/lib/rate-limit";
import { getBooksQuerySchema, validateQuery } from "@/lib/validations/api";

// GET /api/books - Get books with filtering and pagination
export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`books:${ip}`, rateLimiters.api);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  const { searchParams } = new URL(request.url);

  const validation = validateQuery(searchParams, getBooksQuerySchema);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const { search, category, language, page, perPage } = validation.data;

  try {
    const allBooks = await getAllBooks();

    const filtered = filterBooks(allBooks, {
      search,
      category,
      language,
    });

    const paginated = paginateBooks(filtered, page, Math.min(perPage, 100));

    // Get categories and languages for filters
    const categories = await getAllCategories();
    const languages = await getAllLanguages();

    return NextResponse.json({
      books: paginated.books,
      pagination: {
        total: paginated.total,
        totalPages: paginated.totalPages,
        currentPage: paginated.currentPage,
        perPage,
      },
      filters: {
        categories: categories.slice(0, 50), // Top 50 categories
        languages: languages.slice(0, 30), // Top 30 languages
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
