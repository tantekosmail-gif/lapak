/**
 * Kontrak domain ternormalisasi untuk aggregator 3PL.
 *
 * Tiap 3PL (api.co.id, everpro, kiriminaja, rajaongkir, dst) punya bentuk
 * request/response yang berbeda. Tipe-tipe di sini adalah "bahasa bersama"
 * yang dipakai aplikasi; tiap concrete service menerjemahkan dari/ke bentuk
 * asli provider-nya.
 */

/** Identitas unik tiap aggregator, mis. "apicoid", "everpro", "kiriminaja". */
export type AggregatorCode = string;

/**
 * Konfigurasi runtime sebuah aggregator yang diturunkan dari tabel
 * `StoreConfiguration`. `TCredentials` dispesifikkan tiap provider sesuai
 * kebutuhan kredensialnya (apiKey, baseUrl, dsb).
 */
export interface AggregatorConfig<TCredentials = Record<string, unknown>> {
  code: AggregatorCode;
  credentials: TCredentials;
  /** Jalankan terhadap environment sandbox provider bila tersedia. */
  sandbox?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Location                                                                   */
/* -------------------------------------------------------------------------- */

/** Permintaan pencarian lokasi/area tujuan. */
export interface LocationSearchInput {
  query: string;
  limit?: number;
  offset?: number;
}

/** Satu area lokasi ternormalisasi (hasil pencarian). */
export interface LocationArea {
  /** Id area pada sisi provider; dipakai sebagai origin/destination tarif. */
  id: string;
  /** Label lengkap siap tampil, mis. "SINDUHARJO, NGAGLIK, SLEMAN, ...". */
  label: string;
  subdistrictName?: string;
  districtName?: string;
  cityName?: string;
  provinceName?: string;
  postalCode?: string;
  raw?: unknown;
}

/* -------------------------------------------------------------------------- */
/* Rate                                                                       */
/* -------------------------------------------------------------------------- */

/** Permintaan cek tarif/ongkir antar dua area. */
export interface RateRequest {
  /** Id area asal (dari {@link LocationArea}). */
  originAreaId: string;
  /** Id area tujuan (dari {@link LocationArea}). */
  destinationAreaId: string;
  /** Berat total paket dalam gram (1kg = 1000g). */
  weightGram: number;
  /** Filter kurir, mis. ["jne", "sicepat"]. Kosong = default provider. */
  couriers?: string[];
  /** Nilai barang dalam Rupiah (untuk asuransi/COD bila relevan). */
  itemValueIdr?: number;
}

/** Satu opsi tarif yang dikembalikan aggregator. */
export interface RateQuote {
  aggregator: AggregatorCode;
  courierCode: string;
  courierName: string;
  serviceCode: string;
  serviceName: string;
  priceIdr: number;
  /** Estimasi waktu kirim, mis. "2-3 hari". */
  etd?: string;
  raw?: unknown;
}

/* -------------------------------------------------------------------------- */
/* Order                                                                      */
/* -------------------------------------------------------------------------- */

/** Pihak pengirim/penerima pada sebuah order 3PL. */
export interface OrderParty {
  name: string;
  /** Nomor telepon; sebagian provider mensyaratkan diawali 0 atau 62. */
  phone: string;
  /** Id area (dari {@link LocationArea}). */
  areaId: string;
  address: string;
  email?: string;
  /** Titik koordinat "lat,lng" bila provider mendukung. */
  pinPoint?: string;
}

/** Satu baris barang dalam order. */
export interface OrderItemInput {
  name: string;
  variantName?: string;
  priceIdr: number;
  weightGram: number;
  widthCm?: number;
  heightCm?: number;
  lengthCm?: number;
  qty: number;
  subtotalIdr: number;
}

export type PaymentMethod = "COD" | "BANK TRANSFER";

/** Permintaan pembuatan order/booking pengiriman di 3PL. */
export interface Create3plOrderInput {
  /** Referensi internal kita (mis. orderNumber). */
  referenceId?: string;
  /** Tanggal order; default hari ini (YYYY-MM-DD). */
  orderDate?: string;
  /** Nama brand yang tampil di label pengiriman. */
  brandName?: string;
  shipper: OrderParty;
  receiver: OrderParty;
  courierCode: string;
  serviceCode: string;
  paymentMethod: PaymentMethod;
  shippingCostIdr: number;
  shippingCashbackIdr?: number;
  serviceFeeIdr?: number;
  additionalCostIdr?: number;
  grandTotalIdr: number;
  codValueIdr?: number;
  insuranceValueIdr?: number;
  items: OrderItemInput[];
}

/** Hasil pembuatan order 3PL. */
export interface Create3plOrderResult {
  aggregator: AggregatorCode;
  /** Id order pada sisi provider. */
  orderId: string;
  /** Nomor order provider (mis. "KOMxxxx"). */
  orderNo: string;
  /** Nomor resi/AWB; bisa baru tersedia setelah dialokasikan. */
  trackingNumber?: string;
  raw?: unknown;
}
