import type { Response as ServiceResponse } from "@/modules/core";

/**
 * Tipis. Bungkus `fetch` untuk:
 *   - parse JSON otomatis dan kembalikan envelope `Response<T>` ({success, data, error}).
 *   - sertakan cookie sesi (`credentials: "include"`) untuk endpoint yang digerbang proxy.
 *   - dukung body JSON otomatis (object → JSON.stringify) atau FormData (dilewatkan apa adanya).
 *
 * Tidak lempar error pada non-2xx — kembalikan `{success: false, error}` sehingga
 * caller dapat menampilkan pesan tanpa try/catch berlapis.
 */

export type FetchOptions = Omit<RequestInit, "body"> & {
    body?: BodyInit | Record<string, unknown> | unknown[];
    query?: Record<string, string | number | boolean | undefined | null>;
};

const buildUrl = (path: string, query?: FetchOptions["query"]) => {
    if (!query) return path;
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null) continue;
        search.set(k, String(v));
    }
    const qs = search.toString();
    return qs ? `${path}?${qs}` : path;
};

const isJsonBody = (body: unknown): body is Record<string, unknown> | unknown[] => {
    if (body == null) return false;
    if (typeof body === "string") return false;
    if (body instanceof FormData) return false;
    if (body instanceof Blob) return false;
    if (body instanceof URLSearchParams) return false;
    if (body instanceof ArrayBuffer) return false;
    return typeof body === "object";
};

const errorResponse = <T>(code: string, message: string): ServiceResponse<T> => ({
    success: false,
    error: { code, message },
});

export async function apiFetch<T = unknown>(
    path: string,
    options: FetchOptions = {},
): Promise<ServiceResponse<T>> {
    const { body, query, headers, ...rest } = options;

    const init: RequestInit = {
        credentials: "include",
        ...rest,
        headers: { ...(headers as Record<string, string> | undefined) },
    };

    if (body !== undefined) {
        if (isJsonBody(body)) {
            init.body = JSON.stringify(body);
            (init.headers as Record<string, string>)["Content-Type"] = "application/json";
        } else {
            init.body = body as BodyInit;
        }
    }

    let response: Response;
    try {
        response = await fetch(buildUrl(path, query), init);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Network error";
        return errorResponse("NETWORK_ERROR", message);
    }

    let payload: unknown = null;
    const text = await response.text();
    if (text) {
        try {
            payload = JSON.parse(text);
        } catch {
            return errorResponse("INVALID_JSON", `Server returned non-JSON (${response.status})`);
        }
    }

    // Server sudah membungkus dalam envelope {success, data} atau {success, error}.
    if (payload && typeof payload === "object" && "success" in payload) {
        return payload as ServiceResponse<T>;
    }

    // Fallback: HTTP gagal & body bukan envelope.
    if (!response.ok) {
        return errorResponse(`HTTP_${response.status}`, response.statusText || "Request failed");
    }

    // 2xx tanpa envelope (route tertentu) — bungkus sebagai sukses.
    return { success: true, data: payload as T };
}

export const apiGet = <T>(path: string, options: Omit<FetchOptions, "body"> = {}) =>
    apiFetch<T>(path, { ...options, method: "GET" });

export const apiPost = <T>(path: string, body?: FetchOptions["body"], options: Omit<FetchOptions, "body" | "method"> = {}) =>
    apiFetch<T>(path, { ...options, method: "POST", body });

export const apiPut = <T>(path: string, body?: FetchOptions["body"], options: Omit<FetchOptions, "body" | "method"> = {}) =>
    apiFetch<T>(path, { ...options, method: "PUT", body });

export const apiPatch = <T>(path: string, body?: FetchOptions["body"], options: Omit<FetchOptions, "body" | "method"> = {}) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body });

export const apiDelete = <T>(path: string, options: Omit<FetchOptions, "body"> = {}) =>
    apiFetch<T>(path, { ...options, method: "DELETE" });
