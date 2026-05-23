import productService from "@/modules/services/ProductService";
import { NextResponse } from "next/server";

export async function DELETE(params: Promise<{ id: string }>) {
    const { id } = await params;
    const result = await productService.delete(id);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 });
    }
    return NextResponse.json({ ...result }, { status: 200 });
}
