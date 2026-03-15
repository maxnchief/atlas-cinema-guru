import { fetchFavorites } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/favorites
 */
export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const page = params.get("page") ? Number(params.get("page")) : 1;

  // No authentication required
  const favorites = await fetchFavorites(page);
  return NextResponse.json({ favorites });
};
