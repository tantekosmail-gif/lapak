import cartService from "@/modules/services/CartService";
import { requireCustomer } from "@/app/lib/authz";
import { jsonError, respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// `customerId` selalu diambil dari sesi — customer tidak bisa membaca cart
// orang lain karena ID-nya tidak datang dari URL atau body.

// GET /api/public/cart -> daftar entri cart milik customer ini.
export async function GET() {
    const user = await requireCustomer();
    if (!user) {
        return jsonError("FORBIDDEN", "Customer login required", 403);
    }
    return respond(await cartService.list(user.id));
}

// POST /api/public/cart -> tambah / increment entri cart.
export async function POST(request: NextRequest) {
    const user = await requireCustomer();
    if (!user) {
        return jsonError("FORBIDDEN", "Customer login required", 403);
    }
    const body = await request.json();
    return respond(await cartService.add(user.id, body), 201);
}

// DELETE /api/public/cart -> kosongkan seluruh cart customer ini.
export async function DELETE() {
    const user = await requireCustomer();
    if (!user) {
        return jsonError("FORBIDDEN", "Customer login required", 403);
    }
    return respond(await cartService.clear(user.id));
}
