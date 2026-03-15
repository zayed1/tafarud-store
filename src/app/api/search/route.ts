import { createClient } from "@/lib/supabase/server";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS = 30;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS;
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [], categories: [] });
  }

  const sanitized = query.slice(0, 100);

  try {
    const supabase = await createClient();

    const [{ data: products }, { data: categories }] = await Promise.all([
      supabase
        .from("products")
        .select("id, name_ar, name_en, price, image_url, category:categories(id, name_ar, name_en)")
        .or(
          `name_ar.ilike.%${sanitized}%,name_en.ilike.%${sanitized}%,description_ar.ilike.%${sanitized}%,description_en.ilike.%${sanitized}%`
        )
        .limit(12),
      supabase
        .from("categories")
        .select("id, name_ar, name_en, slug")
        .or(`name_ar.ilike.%${sanitized}%,name_en.ilike.%${sanitized}%`)
        .limit(4),
    ]);

    return NextResponse.json(
      { products: products || [], categories: categories || [] },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
