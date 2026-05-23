import productService from "@/modules/services/ProductService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await productService.saveAll(body);
        if (!result.success) {
            return NextResponse.json({ ...result }, { status: 400 });
        }
        return NextResponse.json({ ...result });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
