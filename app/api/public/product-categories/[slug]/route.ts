import productCategoryService from "@/modules/services/ProductCategoryService";
import { NextRequest, NextResponse } from "next/server";

// GET /api/public/product-categories/:slug -> kategori + daftar produknya
// untuk halaman storefront `/collections/[slug]` (guest accessible).
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ slug: string }> },
) {
    const { slug } = await context.params;
    const result = await productCategoryService.findBySlugWithProducts(slug);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 });
    }
    return NextResponse.json({ ...result }, { status: 200 });
}
