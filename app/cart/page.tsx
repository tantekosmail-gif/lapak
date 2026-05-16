"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCart } from "../lib/cart-context";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[1080px] w-full px-4 sm:px-6 py-8">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Keranjang</span>
        </nav>

        <h1 className="text-[22px] font-semibold text-ink mb-2">Keranjang Belanja</h1>
        <p className="text-sm text-muted mb-8">{totalItems} item</p>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-hairline" />
            <p className="mt-4 text-base font-medium text-ink">Keranjang masih kosong</p>
            <p className="mt-1 text-sm text-muted mb-6">Yuk mulai belanja!</p>
            <Link
              href="/toko"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors"
            >
              Jelajahi Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 rounded-xl border border-hairline p-4"
                >
                  <Link href={`/toko/produk/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-soft">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-hairline" />
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <Link href={`/toko/produk/${item.slug}`} className="text-sm font-medium text-ink line-clamp-2 hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-[15px] font-semibold text-ink">
                        {formatRupiah(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-hairline">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-muted hover:text-ink transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="flex h-8 w-10 items-center justify-center text-xs font-semibold text-ink border-x border-hairline">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-muted hover:text-ink transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-primary hover:bg-surface-soft transition-colors"
                        aria-label="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-hairline p-6 space-y-4">
                <h2 className="text-base font-semibold text-ink">Ringkasan Pesanan</h2>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal ({totalItems} item)</span>
                    <span className="text-ink">{formatRupiah(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Ongkos kirim</span>
                    <span className="text-muted-soft">Dihitung saat checkout</span>
                  </div>
                </div>

                <hr className="border-hairline" />

                <div className="flex justify-between">
                  <span className="text-base font-semibold text-ink">Total</span>
                  <span className="text-base font-bold text-ink">{formatRupiah(totalPrice)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-on-primary font-medium text-base hover:bg-primary-active active:bg-primary-active transition-colors h-12"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/toko"
                  className="block text-center text-sm text-muted hover:text-ink transition-colors"
                >
                  Lanjut belanja
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}