import productService from "@/modules/services/ProductService";
import { respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// GET /api/public/products/by-slug/:slug -> detail produk + kategori + gambar
// untuk halaman storefront `/toko/produk/[slug]` (guest accessible).
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ slug: string }> },
) {
    const { slug } = await context.params;
    return respond(await productService.findBySlug(slug));
}
