export type ResponseError = {
  code: string;
  message: string;
  details?: unknown;
};

export type Response<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: ResponseError };

export const Response = {
  ok<T>(data: T, message?: string): Response<T> {
    return { success: true, data, message };
  },

  fail<T = never>(
    code: string,
    message: string,
    details?: unknown,
  ): Response<T> {
    return { success: false, error: { code, message, details } };
  },
};
