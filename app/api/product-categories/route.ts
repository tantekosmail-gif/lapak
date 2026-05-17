import { NextRequest } from "next/server";

/**
 * List Product Categories
 * GET /
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const category = searchParams.get("category");
        const sort = searchParams.get("sort");

    } catch (error) {

    }
}