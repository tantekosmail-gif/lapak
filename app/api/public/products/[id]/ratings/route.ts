import ratingService from "@/modules/services/RatingService";
import { currentUser, requireCustomer } from "@/app/lib/authz";
import { jsonError, respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// GET /api/public/products/:id/ratings -> daftar rating produk (guest accessible).
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";

    return respond(await ratingService.listByProduct(Number(id), page, limit, sort));
}

// POST /api/public/products/:id/ratings -> customer memberi/memperbarui rating.
// Hanya user dengan role CUSTOMER yang boleh; anonim 401, admin 403.
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const user = await currentUser();
    if (!user) {
        return jsonError("UNAUTHORIZED", "Authentication required", 401);
    }
    if (!(await requireCustomer())) {
        return jsonError("FORBIDDEN", "Only customers can rate products", 403);
    }

    const { id } = await context.params;
    const body = await request.json();
    return respond(
        await ratingService.createOrUpdate(user.id, Number(id), body),
        201,
    );
}
