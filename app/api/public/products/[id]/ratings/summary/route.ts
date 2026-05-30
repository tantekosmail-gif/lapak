import ratingService from "@/modules/services/RatingService";
import { respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// GET /api/public/products/:id/ratings/summary -> rata-rata & jumlah rating.
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    return respond(await ratingService.summaryByProduct(Number(id)));
}
