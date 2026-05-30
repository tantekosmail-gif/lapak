import cartService from "@/modules/services/CartService";
import { requireCustomer } from "@/app/lib/authz";
import { jsonError, respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// PATCH /api/public/cart/:productId -> set qty absolut (0 = hapus entri).
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ productId: string }> },
) {
    const user = await requireCustomer();
    if (!user) {
        return jsonError("FORBIDDEN", "Customer login required", 403);
    }
    const { productId } = await context.params;
    const body = await request.json();
    return respond(
        await cartService.setQuantity(user.id, Number(productId), body),
    );
}

// DELETE /api/public/cart/:productId -> hapus satu entri cart customer ini.
export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ productId: string }> },
) {
    const user = await requireCustomer();
    if (!user) {
        return jsonError("FORBIDDEN", "Customer login required", 403);
    }
    const { productId } = await context.params;
    return respond(await cartService.remove(user.id, Number(productId)));
}
