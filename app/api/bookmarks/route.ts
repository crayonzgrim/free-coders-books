import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";
import { checkRateLimit, getClientIp, getRateLimitHeaders, rateLimiters } from "@/lib/rate-limit";
import { createBookmarkSchema, validateBody } from "@/lib/validations/api";

// GET /api/bookmarks - Get user's bookmarks
export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`bookmarks:get:${ip}`, rateLimiters.api);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

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
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

// POST /api/bookmarks - Add a bookmark
export async function POST(request: NextRequest) {
  // Rate limiting (stricter for write operations)
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`bookmarks:write:${ip}`, rateLimiters.write);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

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
    const validation = await validateBody(request, createBookmarkSchema);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { bookUrl, bookTitle } = validation.data;

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
  } catch {
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks - Remove a bookmark
export async function DELETE(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`bookmarks:write:${ip}`, rateLimiters.write);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

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
  } catch {
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
