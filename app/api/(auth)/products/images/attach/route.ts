import productImageService from "@/modules/services/ProductImageService";
import { attachProductImageMetaSchema } from "@/modules/dto/ProductImage.dto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const meta = attachProductImageMetaSchema.safeParse({
            productId: formData.get("productId"),
            sortOrder: formData.get("sortOrder") ?? undefined,
            isPrimary: formData.get("isPrimary") ?? undefined,
        });
        if (!meta.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: "PRODUCT_IMAGE_VALIDATION_FAILED",
                        message: "Invalid metadata",
                        details: meta.error.issues,
                    },
                },
                { status: 400 },
            );
        }

        const files = formData.getAll("file").filter((entry): entry is File => entry instanceof File);
        const result = await productImageService.attachMany(files, meta.data);
        if (!result.success) {
            return NextResponse.json({ ...result }, { status: 400 });
        }
        return NextResponse.json({ ...result });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
