import type { Response } from "@/modules/core";
import { BaseService } from "./BaseService";
import type { RateQuote, RateRequest } from "./types";

/**
 * Service abstract untuk pengambilan tarif/ongkir.
 *
 * Tiap provider mengimplementasikan {@link getRates} dengan menerjemahkan
 * {@link RateRequest} ke API tarifnya lalu memetakan hasilnya ke daftar
 * {@link RateQuote} ternormalisasi.
 */
export abstract class AbstractRateService<
  TCredentials = Record<string, unknown>,
> extends BaseService<TCredentials> {
  abstract getRates(input: RateRequest): Promise<Response<RateQuote[]>>;
}
