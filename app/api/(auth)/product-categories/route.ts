import productCategoryService from "@/modules/services/ProductCategoryService";
import { sortParamDirection } from "@/modules/statics/SortParam";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;

        // parse integers safely
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        // normalize sort param
        const { direction: sortDir, field: sortBy } =
            sortParamDirection(searchParams.get("sort") as string);

        const result =
            await productCategoryService.getAll(page, limit, sortBy, sortDir);

        return NextResponse.json({ ...result });
    } catch (error) {
        // this should not happen if the service layer wraps all errors, but just in case
        return NextResponse.json(
            { error: error },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = await productCategoryService.create(body);
        if (!result.success) {
            throw new Error(`Product category creation failed ${JSON.stringify(result.error)}`);
        }
        return NextResponse.json({ ...result });
    } catch (error) {
        console.log({ error })
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
