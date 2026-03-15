import { fetchWatchLaters } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/watch-later
 */
export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const page = params.get("page") ? Number(params.get("page")) : 1;

  // No authentication required
  const watchLater = await fetchWatchLaters(page);
  return NextResponse.json({ watchLater });
};
