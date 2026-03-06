import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // MVP: 샘플 통계 (추후 DB 집계로 교체)
  return NextResponse.json({
    newArtistsThisWeek: 124,
    artworksApprovedThisWeek: 3412,
    cvr: 0.028,
    gmvWeekly: 48200000,
    pendingReview: 58,
    pendingPrint: 76,
  });
}
