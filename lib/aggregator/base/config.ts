import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { Response } from "@/modules/core";

/**
 * Konfigurasi shipping disimpan di `StoreConfiguration.settings` (JSON) di
 * bawah key `shipping`. Bentuknya:
 *
 * {
 *   "shipping": {
 *     "activeProvider": "biteship",
 *     "providers": {
 *       "biteship": { "enabled": true, "credentials": { "apiKey": "..." } },
 *       "shipper":  { "enabled": false, "credentials": { ... } }
 *     }
 *   }
 * }
 */
export const providerConfigSchema = z.object({
  enabled: z.boolean().default(false),
  sandbox: z.boolean().optional(),
  credentials: z.record(z.string(), z.unknown()).default({}),
});

export const shippingConfigSchema = z.object({
  /** Kode provider default yang dipakai bila pemanggil tak menyebut spesifik. */
  activeProvider: z.string().min(1),
  providers: z.record(z.string(), providerConfigSchema).default({}),
});

export type ProviderConfig = z.infer<typeof providerConfigSchema>;
export type ShippingConfig = z.infer<typeof shippingConfigSchema>;

/**
 * Sumber konfigurasi shipping. Dibuat sebagai fungsi agar mudah di-inject
 * (mis. saat pengujian) tanpa menyentuh database.
 */
export type ShippingConfigLoader = () => Promise<Response<ShippingConfig>>;

/**
 * Loader default: membaca baris `StoreConfiguration` lalu memvalidasi bagian
 * `settings.shipping`.
 */
export const loadShippingConfig: ShippingConfigLoader = async () => {
  const row = await prisma.storeConfiguration.findFirst();
  const settings = (row?.settings ?? {}) as Record<string, unknown>;
  const parsed = shippingConfigSchema.safeParse(settings.shipping ?? {});
  if (!parsed.success) {
    return Response.fail(
      "SHIPPING_CONFIG_INVALID",
      "Konfigurasi shipping pada StoreConfiguration tidak valid",
      parsed.error.issues,
    );
  }
  return Response.ok(parsed.data);
};
