import uploadService from "@/modules/services/UploadService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        if (!(file instanceof File)) {
            return NextResponse.json(
                { success: false, error: { code: "UPLOAD_NO_FILE", message: "Field 'file' is required" } },
                { status: 400 },
            );
        }

        const result = await uploadService.saveImage(file);
        if (!result.success) {
            return NextResponse.json({ ...result }, { status: 400 });
        }
        return NextResponse.json({ ...result });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
