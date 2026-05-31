import productImageService from "@/modules/services/ProductImageService";
import { respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// PATCH /api/products/:id/images/:imageId/primary -> jadikan satu gambar
// sebagai primary, demote primary lama, dan sync Product.imageUrl.
// Admin-only via proxy (`/api/products` ada di ADMIN_API_PREFIXES).
export async function PATCH(
    _request: NextRequest,
    context: { params: Promise<{ id: string; imageId: string }> },
) {
    const { id, imageId } = await context.params;
    return respond(
        await productImageService.setPrimary(Number(id), Number(imageId)),
    );
}
