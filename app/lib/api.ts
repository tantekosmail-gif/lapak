import { NextResponse } from "next/server";
import type { Response as ServiceResponse } from "@/modules/core";

const STATUS_BY_CODE: Record<string, number> = {
  ORDER_NOT_FOUND: 404,
  ORDER_FORBIDDEN: 403,
};

/** Ubah error-code domain menjadi HTTP status; default 400 (bad request). */
export const jsonError = (code: string, message: string, status: number) =>
  NextResponse.json({ success: false, error: { code, message } }, { status });

/** Bungkus Response<T> dari service menjadi NextResponse dengan status yang sesuai. */
export function respond<T>(result: ServiceResponse<T>, okStatus = 200) {
  if (result.success) {
    return NextResponse.json({ ...result }, { status: okStatus });
  }
  const status = STATUS_BY_CODE[result.error.code] ?? 400;
  return NextResponse.json({ ...result }, { status });
}
