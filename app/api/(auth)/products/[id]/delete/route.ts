import productService from "@/modules/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    const result = await productService.delete(id);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 });
    }
    return NextResponse.json({ ...result }, { status: 200 });
}
