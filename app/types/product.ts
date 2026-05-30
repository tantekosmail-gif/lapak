export type Product = {
  id: number;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  /** Harga normal/coret. Jika > price, ditampilkan sebagai diskon. */
  regular_price?: number;
};
