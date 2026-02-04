import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";
import { checkRateLimit, getClientIp, getRateLimitHeaders, rateLimiters } from "@/lib/rate-limit";
import { toggleLikeSchema, validateBody } from "@/lib/validations/api";

// POST /api/likes - Toggle like
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`likes:write:${ip}`, rateLimiters.write);
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
    const validation = await validateBody(request, toggleLikeSchema);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { bookUrl } = validation.data;

    const { db, likes, likeCounts } = await import("@/lib/db");
    const { eq, and, sql } = await import("drizzle-orm");

    // Check if already liked
    const existing = await db
      .select()
      .from(likes)
      .where(
        and(eq(likes.userId, session.user.id), eq(likes.bookUrl, bookUrl))
      )
      .get();

    if (existing) {
      // Unlike: remove the like
      await db
        .delete(likes)
        .where(
          and(eq(likes.userId, session.user.id), eq(likes.bookUrl, bookUrl))
        );

      // Decrement count
      await db
        .update(likeCounts)
        .set({ count: sql`${likeCounts.count} - 1` })
        .where(eq(likeCounts.bookUrl, bookUrl));

      const updatedCount = await db
        .select()
        .from(likeCounts)
        .where(eq(likeCounts.bookUrl, bookUrl))
        .get();

      return NextResponse.json({
        liked: false,
        count: Math.max(0, updatedCount?.count || 0),
      });
    } else {
      // Like: add the like
      await db.insert(likes).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        bookUrl,
      });

      // Increment or create count
      const existingCount = await db
        .select()
        .from(likeCounts)
        .where(eq(likeCounts.bookUrl, bookUrl))
        .get();

      if (existingCount) {
        await db
          .update(likeCounts)
          .set({ count: sql`${likeCounts.count} + 1` })
          .where(eq(likeCounts.bookUrl, bookUrl));
      } else {
        await db.insert(likeCounts).values({
          bookUrl,
          count: 1,
        });
      }

      const updatedCount = await db
        .select()
        .from(likeCounts)
        .where(eq(likeCounts.bookUrl, bookUrl))
        .get();

      return NextResponse.json({
        liked: true,
        count: updatedCount?.count || 1,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

// GET /api/likes - Get user's liked books
export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`likes:get:${ip}`, rateLimiters.api);
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
    const { db, likes } = await import("@/lib/db");
    const { eq } = await import("drizzle-orm");

    const userLikes = await db
      .select()
      .from(likes)
      .where(eq(likes.userId, session.user.id));

    return NextResponse.json(userLikes);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
