import { BaseResponse } from "@/modules/core";
import type { AggregatorCode, AggregatorConfig } from "./types";

/**
 * Base abstract untuk seluruh service aggregator 3PL.
 *
 * Menyimpan konfigurasi/kredensial provider dan mewarisi {@link BaseResponse}
 * agar turunannya bisa memakai helper `ok`/`fail`/`wrapError` dan
 * mengembalikan `Response<T>` yang konsisten dengan service lain di aplikasi.
 *
 * Tidak mendefinisikan operasi apa pun — itu tugas turunan per-kapabilitas
 * ({@link AbstractRateService}, {@link AbstractCreate3plOrderService},
 * {@link AbstractLocationService}).
 */
export abstract class BaseService<
  TCredentials = Record<string, unknown>,
> extends BaseResponse {
  /** Identitas unik provider; dipakai registry untuk routing. */
  abstract readonly code: AggregatorCode;

  /** Nama manusiawi untuk pesan error/log. */
  abstract readonly label: string;

  constructor(protected readonly config: AggregatorConfig<TCredentials>) {
    super();
  }
}
