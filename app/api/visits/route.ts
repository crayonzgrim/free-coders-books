import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { checkRateLimit, getClientIp, getRateLimitHeaders, rateLimiters } from "@/lib/rate-limit";

// POST /api/visits - Increment visit count
export async function POST(request: NextRequest) {
  // Rate limiting (stricter - one visit per minute per IP)
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`visits:${ip}`, { limit: 5, windowSeconds: 60 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ success: true, mock: true });
  }

  try {
    const { db, visits } = await import("@/lib/db");
    const { eq, sql } = await import("drizzle-orm");

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Try to increment existing record
    const existing = await db
      .select()
      .from(visits)
      .where(eq(visits.date, today))
      .get();

    if (existing) {
      await db
        .update(visits)
        .set({ count: sql`${visits.count} + 1` })
        .where(eq(visits.date, today));
    } else {
      await db.insert(visits).values({
        id: crypto.randomUUID(),
        date: today,
        count: 1,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// GET /api/visits - Get visit stats
export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`visits:get:${ip}`, rateLimiters.api);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ today: 0, total: 0, mock: true });
  }

  try {
    const { db, visits } = await import("@/lib/db");
    const { eq } = await import("drizzle-orm");

    const today = new Date().toISOString().split("T")[0];

    // Get today's count
    const todayVisit = await db
      .select()
      .from(visits)
      .where(eq(visits.date, today))
      .get();

    // Get total count (sum of all days)
    const allVisits = await db.select().from(visits);
    const totalCount = allVisits.reduce((sum, v) => sum + (v.count || 0), 0);

    return NextResponse.json({
      today: todayVisit?.count || 0,
      total: totalCount,
    });
  } catch {
    return NextResponse.json({ today: 0, total: 0 }, { status: 500 });
  }
}
