import productCategoryService from "@/modules/services/ProductCategoryService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(params: Promise<{ id: string }>) {
    const { id } = await params;
    const result = await productCategoryService.findById(id);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 })
    }
    return NextResponse.json({ ...result }, { status: 200 });
}

export async function DELETE(params: Promise<{ id: string }>) {
    const { id } = await params;
    const result = await productCategoryService.delete(id);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 })
    }
    return NextResponse.json({ ...result }, { status: 200 });
}


export async function PUT(request: NextRequest, params: Promise<{ id: string }>) {
    const { id } = await params;
    const body = await request.json();
    const result = await productCategoryService.update(id, body);
    if (!result.success) {
        return NextResponse.json({ data: null, message: result.error }, { status: 404 })
    }
    return NextResponse.json({ ...result }, { status: 200 });
}