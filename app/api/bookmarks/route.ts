import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";

// GET /api/bookmarks - Get user's bookmarks
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json([]);
  }

  try {
    const { db, bookmarks } = await import("@/lib/db");
    const { eq } = await import("drizzle-orm");

    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, session.user.id));

    return NextResponse.json(userBookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST /api/bookmarks - Add a bookmark
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const { bookUrl, bookTitle } = await request.json();

    if (!bookUrl || !bookTitle) {
      return NextResponse.json(
        { error: "bookUrl and bookTitle are required" },
        { status: 400 }
      );
    }

    const { db, bookmarks } = await import("@/lib/db");
    const { eq, and } = await import("drizzle-orm");

    // Check if already bookmarked
    const existing = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, session.user.id),
          eq(bookmarks.bookUrl, bookUrl)
        )
      )
      .get();

    if (existing) {
      return NextResponse.json(
        { error: "Already bookmarked" },
        { status: 409 }
      );
    }

    const newBookmark = await db
      .insert(bookmarks)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        bookUrl,
        bookTitle,
      })
      .returning()
      .get();

    return NextResponse.json(newBookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks - Remove a bookmark
export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const bookUrl = searchParams.get("bookUrl");

    if (!bookUrl) {
      return NextResponse.json(
        { error: "bookUrl is required" },
        { status: 400 }
      );
    }

    const { db, bookmarks } = await import("@/lib/db");
    const { eq, and } = await import("drizzle-orm");

    await db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, session.user.id),
          eq(bookmarks.bookUrl, bookUrl)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
