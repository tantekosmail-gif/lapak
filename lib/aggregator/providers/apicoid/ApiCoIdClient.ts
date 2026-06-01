import { z } from "zod";
import type { AggregatorConfig } from "../../base";

/**
 * API.co.id (RajaOngkir x Komship by Komerce) memakai DUA permukaan API:
 *
 *  1. Shipping Cost / Destination (RajaOngkir)
 *     base : https://rajaongkir.komerce.id/api/v1
 *     auth : header `key: <API_KEY>`
 *
 *  2. Delivery Order (Komship)
 *     base : https://api.collaborator.komerce.id (sandbox: api-sandbox.*)
 *     auth : header `x-api-key: <API_KEY>`
 *
 * Keduanya membungkus respons dalam envelope `{ meta, data }`.
 */
const COST_BASE_URL = "https://rajaongkir.komerce.id/api/v1";
const ORDER_BASE_URL_PROD = "https://api.collaborator.komerce.id";
const ORDER_BASE_URL_SANDBOX = "https://api-sandbox.collaborator.komerce.id";

export const apiCoIdCredentialsSchema = z.object({
  /** API key RajaOngkir untuk endpoint destination & cost (header `key`). */
  apiKey: z.string().min(1),
  /**
   * API key Komship untuk endpoint order (header `x-api-key`). Bila kosong,
   * pakai {@link apiKey}.
   */
  deliveryApiKey: z.string().min(1).optional(),
  /** Override base URL cost/destination (opsional). */
  costBaseUrl: z.url().optional(),
  /** Override base URL order (opsional). */
  orderBaseUrl: z.url().optional(),
});

export type ApiCoIdCredentials = z.infer<typeof apiCoIdCredentialsSchema>;

interface ApiCoIdEnvelope<T> {
  meta: { message: string; code: number; status: string };
  data: T;
}

/** Error spesifik provider agar pemanggil bisa mengenali sumbernya. */
export class ApiCoIdError extends Error {
  constructor(
    message: string,
    readonly httpStatus: number,
    readonly metaCode?: number,
  ) {
    super(message);
    this.name = "ApiCoIdError";
  }
}

export class ApiCoIdClient {
  private readonly costBaseUrl: string;
  private readonly orderBaseUrl: string;
  private readonly costKey: string;
  private readonly orderKey: string;

  private constructor(creds: ApiCoIdCredentials, sandbox: boolean) {
    this.costBaseUrl = creds.costBaseUrl ?? COST_BASE_URL;
    this.orderBaseUrl =
      creds.orderBaseUrl ??
      (sandbox ? ORDER_BASE_URL_SANDBOX : ORDER_BASE_URL_PROD);
    this.costKey = creds.apiKey;
    this.orderKey = creds.deliveryApiKey ?? creds.apiKey;
  }

  /** Bangun client dari konfigurasi; melempar `ZodError` bila kredensial invalid. */
  static fromConfig(config: AggregatorConfig): ApiCoIdClient {
    const creds = apiCoIdCredentialsSchema.parse(config.credentials);
    return new ApiCoIdClient(creds, config.sandbox ?? false);
  }

  /** GET ke permukaan cost/destination dengan query string. */
  async costGet<T>(
    path: string,
    query: Record<string, string | number | undefined>,
  ): Promise<T> {
    const url = new URL(`${this.costBaseUrl}${path}`);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const res = await fetch(url, { headers: { key: this.costKey } });
    return this.unwrap<T>(res);
  }

  /** POST form-urlencoded ke permukaan cost. */
  async costPostForm<T>(
    path: string,
    body: Record<string, string | number | undefined>,
  ): Promise<T> {
    const form = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) form.set(key, String(value));
    }
    const res = await fetch(`${this.costBaseUrl}${path}`, {
      method: "POST",
      headers: {
        key: this.costKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    return this.unwrap<T>(res);
  }

  /** POST JSON ke permukaan order (Komship). */
  async orderPostJson<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.orderBaseUrl}${path}`, {
      method: "POST",
      headers: {
        "x-api-key": this.orderKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return this.unwrap<T>(res);
  }

  // Buka envelope `{ meta, data }`; lempar ApiCoIdError bila gagal.
  private async unwrap<T>(res: Response): Promise<T> {
    let payload: ApiCoIdEnvelope<T> | null = null;
    try {
      payload = (await res.json()) as ApiCoIdEnvelope<T>;
    } catch {
      // Biarkan payload null bila body bukan JSON.
    }

    const status = payload?.meta?.status;
    if (!res.ok || (status && status !== "success")) {
      const message =
        payload?.meta?.message ?? `HTTP ${res.status} ${res.statusText}`;
      throw new ApiCoIdError(message, res.status, payload?.meta?.code);
    }
    if (!payload) {
      throw new ApiCoIdError(
        "Respons API.co.id kosong/bukan JSON",
        res.status,
      );
    }
    return payload.data;
  }
}
