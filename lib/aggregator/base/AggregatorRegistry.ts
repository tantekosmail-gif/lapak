import type { AbstractCreate3plOrderService } from "./AbstractCreate3plOrderService";
import type { AbstractLocationService } from "./AbstractLocationService";
import type { AbstractRateService } from "./AbstractRateService";
import type { AggregatorCode, AggregatorConfig } from "./types";

/**
 * Deskriptor sebuah provider 3PL: identitas plus pabrik untuk tiap service
 * kapabilitas. Sebuah provider boleh hanya mengimplementasikan sebagian
 * kapabilitas — sisanya cukup dibiarkan tak terdaftar.
 */
export interface AggregatorProvider {
  code: AggregatorCode;
  label: string;
  createRateService(config: AggregatorConfig): AbstractRateService;
  createOrderService(config: AggregatorConfig): AbstractCreate3plOrderService;
  createLocationService(config: AggregatorConfig): AbstractLocationService;
}

/**
 * Registry pusat pemetaan `AggregatorCode` -> {@link AggregatorProvider}.
 * Dipakai resolver untuk routing: konfigurasi menentukan provider mana yang
 * aktif, registry yang tahu cara membangun service-nya.
 */
export class AggregatorRegistry {
  private readonly providers = new Map<AggregatorCode, AggregatorProvider>();

  /** Daftarkan sebuah provider. Melempar bila kode bentrok. */
  register(provider: AggregatorProvider): void {
    if (this.providers.has(provider.code)) {
      throw new Error(`Aggregator "${provider.code}" sudah terdaftar`);
    }
    this.providers.set(provider.code, provider);
  }

  has(code: AggregatorCode): boolean {
    return this.providers.has(code);
  }

  get(code: AggregatorCode): AggregatorProvider | undefined {
    return this.providers.get(code);
  }

  /** Daftar seluruh kode provider yang terdaftar. */
  codes(): AggregatorCode[] {
    return [...this.providers.keys()];
  }
}

/** Registry tunggal yang dipakai bersama di seluruh aplikasi. */
export const aggregatorRegistry = new AggregatorRegistry();
