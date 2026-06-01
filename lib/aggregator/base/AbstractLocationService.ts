import type { Response } from "@/modules/core";
import { BaseService } from "./BaseService";
import type { LocationArea, LocationSearchInput } from "./types";

/**
 * Service abstract untuk pengambilan data lokasi/area.
 *
 * Tiap provider mengimplementasikan {@link searchDestination} dengan
 * menerjemahkan {@link LocationSearchInput} ke API lokasinya lalu memetakan
 * hasilnya ke daftar {@link LocationArea} ternormalisasi. Id area yang
 * dikembalikan dipakai sebagai input origin/destination pada cek tarif & order.
 */
export abstract class AbstractLocationService<
  TCredentials = Record<string, unknown>,
> extends BaseService<TCredentials> {
  abstract searchDestination(
    input: LocationSearchInput,
  ): Promise<Response<LocationArea[]>>;
}
