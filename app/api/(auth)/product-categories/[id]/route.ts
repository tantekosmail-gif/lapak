import productCategoryService from "@/modules/services/ProductCategoryService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    const result = await productCategoryService.findByIdWithProducts(id);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 })
    }
    return NextResponse.json({ ...result }, { status: 200 });
}

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    const result = await productCategoryService.delete(id);
    if (!result.success) {
        const status = result.error.code === "CATEGORY_HAS_PRODUCTS" ? 409 : 404;
        return NextResponse.json({ data: null, message: result.error }, { status });
    }
    return NextResponse.json({ ...result }, { status: 200 });
}


export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    const body = await request.json();
    const result = await productCategoryService.update(id, body);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 })
    }
    return NextResponse.json({ ...result }, { status: 200 });
}
