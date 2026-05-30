import type { Cart, Product } from "@/app/generated/prisma/client";

export type CartEntity = Cart;

/** Entri cart beserta info produk untuk ditampilkan di UI. */
export type CartLine = Cart & { product: Product };
