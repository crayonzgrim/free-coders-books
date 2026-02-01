import { NextRequest, NextResponse } from "next/server";
import { getAllBooks, getAllCategories, getAllLanguages } from "@/lib/books";
import { filterBooks, paginateBooks } from "@/lib/books/utils";

// GET /api/books - Get books with filtering and pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const language = searchParams.get("language") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "24", 10);

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
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
