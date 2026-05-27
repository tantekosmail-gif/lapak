import productService from "@/modules/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    const body = await request.json();
    const result = await productService.update(id, body);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 });
    }
    return NextResponse.json({ ...result }, { status: 200 });
}
