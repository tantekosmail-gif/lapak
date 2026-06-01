import { BaseResponse, type Response } from "@/modules/core";
import type { AbstractCreate3plOrderService } from "./AbstractCreate3plOrderService";
import type { AbstractLocationService } from "./AbstractLocationService";
import type { AbstractRateService } from "./AbstractRateService";
import {
  aggregatorRegistry,
  AggregatorRegistry,
  type AggregatorProvider,
} from "./AggregatorRegistry";
import { loadShippingConfig, type ShippingConfigLoader } from "./config";
import type { AggregatorCode, AggregatorConfig } from "./types";

/**
 * Routing dari tabel `StoreConfiguration` ke service aggregator yang tepat.
 *
 * Alur: baca konfigurasi shipping -> tentukan provider (eksplisit atau default
 * `activeProvider`) -> pastikan aktif & terdaftar -> minta provider membangun
 * service kapabilitas yang diminta dengan kredensial dari konfigurasi.
 */
export class AggregatorResolver extends BaseResponse {
  constructor(
    private readonly registry: AggregatorRegistry = aggregatorRegistry,
    private readonly loadConfig: ShippingConfigLoader = loadShippingConfig,
  ) {
    super();
  }

  async resolveRateService(
    providerCode?: AggregatorCode,
  ): Promise<Response<AbstractRateService>> {
    return this.build(providerCode, (provider, config) =>
      provider.createRateService(config),
    );
  }

  async resolveOrderService(
    providerCode?: AggregatorCode,
  ): Promise<Response<AbstractCreate3plOrderService>> {
    return this.build(providerCode, (provider, config) =>
      provider.createOrderService(config),
    );
  }

  async resolveLocationService(
    providerCode?: AggregatorCode,
  ): Promise<Response<AbstractLocationService>> {
    return this.build(providerCode, (provider, config) =>
      provider.createLocationService(config),
    );
  }

  /** Selesaikan provider aktif + konfigurasinya dari tabel store configuration. */
  private async resolveProvider(
    providerCode?: AggregatorCode,
  ): Promise<Response<{ provider: AggregatorProvider; config: AggregatorConfig }>> {
    const configResult = await this.loadConfig();
    if (!configResult.success) {
      return configResult;
    }
    const shipping = configResult.data;
    const code = providerCode ?? shipping.activeProvider;

    const providerConfig = shipping.providers[code];
    if (!providerConfig) {
      return this.fail(
        "AGGREGATOR_NOT_CONFIGURED",
        `Provider "${code}" tidak ada di konfigurasi shipping`,
      );
    }
    if (!providerConfig.enabled) {
      return this.fail("AGGREGATOR_DISABLED", `Provider "${code}" dinonaktifkan`);
    }
    const provider = this.registry.get(code);
    if (!provider) {
      return this.fail(
        "AGGREGATOR_NOT_REGISTERED",
        `Provider "${code}" belum diregistrasi di kode`,
      );
    }

    return this.ok({
      provider,
      config: {
        code,
        credentials: providerConfig.credentials,
        sandbox: providerConfig.sandbox,
      },
    });
  }

  // Helper bersama: selesaikan provider lalu bangun service kapabilitas tertentu.
  private async build<TService>(
    providerCode: AggregatorCode | undefined,
    factory: (
      provider: AggregatorProvider,
      config: AggregatorConfig,
    ) => TService,
  ): Promise<Response<TService>> {
    try {
      const resolved = await this.resolveProvider(providerCode);
      if (!resolved.success) {
        return resolved;
      }
      return this.ok(factory(resolved.data.provider, resolved.data.config));
    } catch (error) {
      return this.wrapError(error, "AGGREGATOR_RESOLVE_FAILED");
    }
  }
}

/** Resolver tunggal siap pakai dengan registry & loader default. */
export const aggregatorResolver = new AggregatorResolver();
