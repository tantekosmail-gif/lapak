import productService from "@/modules/services/ProductService";
import { sortParamDirection } from "@/modules/statics/SortParam";
import { NextRequest, NextResponse } from "next/server";

// GET /api/public/products -> daftar produk publik (guest & customer).
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const search = searchParams.get("search") || "";

        const { direction: sortDir, field: sortBy } =
            sortParamDirection(searchParams.get("sort") as string);

        const result =
            await productService.getAll(page, limit, sortBy, sortDir, search);

        return NextResponse.json({ ...result });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
