import productService from "@/modules/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

// GET /api/public/products/:id -> detail produk publik (guest & customer).
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    const result = await productService.findById(id);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 });
    }
    return NextResponse.json({ ...result }, { status: 200 });
}
