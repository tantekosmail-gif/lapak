import { Response, type ResponseError } from "./Response";

export abstract class BaseResponse {
  protected ok<T>(data: T, message?: string): Response<T> {
    return Response.ok(data, message);
  }

  protected fail<T = never>(
    code: string,
    message: string,
    details?: unknown,
  ): Response<T> {
    return Response.fail<T>(code, message, details);
  }

  protected wrapError<T = never>(error: unknown, fallbackCode = "INTERNAL_ERROR"): Response<T> {
    if (error instanceof Error) {
      return this.fail<T>(fallbackCode, error.message, error);
    }
    return this.fail<T>(fallbackCode, "Unexpected error", error);
  }
}

export type { ResponseError };
