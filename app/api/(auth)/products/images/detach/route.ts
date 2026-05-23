import productImageService from "@/modules/services/ProductImageService";
import { detachProductImageSchema } from "@/modules/dto/ProductImage.dto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = detachProductImageSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: "PRODUCT_IMAGE_VALIDATION_FAILED",
                        message: "Invalid payload",
                        details: parsed.error.issues,
                    },
                },
                { status: 400 },
            );
        }

        const result = await productImageService.detach(parsed.data.ids);
        if (!result.success) {
            return NextResponse.json({ ...result }, { status: 400 });
        }
        return NextResponse.json({ ...result });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
