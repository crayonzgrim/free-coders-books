import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";

// GET /api/likes/count?bookUrls=url1,url2,... - Get like counts for books
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookUrlsParam = searchParams.get("bookUrls");

  if (!bookUrlsParam) {
    return NextResponse.json(
      { error: "bookUrls parameter is required" },
      { status: 400 }
    );
  }

  const bookUrls = bookUrlsParam.split(",").map((url) => decodeURIComponent(url));

  if (!isDbConfigured()) {
    // Return all zeros if DB not configured
    const countsMap: Record<string, number> = {};
    for (const url of bookUrls) {
      countsMap[url] = 0;
    }
    return NextResponse.json(countsMap);
  }

  try {
    const { db, likeCounts } = await import("@/lib/db");
    const { inArray } = await import("drizzle-orm");

    const counts = await db
      .select()
      .from(likeCounts)
      .where(inArray(likeCounts.bookUrl, bookUrls));

    // Convert to a map for easy lookup
    const countsMap: Record<string, number> = {};
    for (const count of counts) {
      countsMap[count.bookUrl] = count.count || 0;
    }

    // Ensure all requested URLs have a count (default 0)
    for (const url of bookUrls) {
      if (!(url in countsMap)) {
        countsMap[url] = 0;
      }
    }

    return NextResponse.json(countsMap);
  } catch (error) {
    console.error("Error fetching like counts:", error);
    // Return zeros on error
    const countsMap: Record<string, number> = {};
    for (const url of bookUrls) {
      countsMap[url] = 0;
    }
    return NextResponse.json(countsMap);
  }
}
