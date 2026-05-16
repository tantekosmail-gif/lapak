"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, MapPin, User, Phone, ArrowRight, Check } from "lucide-react";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCart } from "../lib/cart-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = items.length > 0 ? 15000 : 0;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);
    // Simulate order creation
    setTimeout(() => {
      clearCart();
      toast.success("Pesanan berhasil dibuat!");
      router.push("/orders/order-1");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-canvas flex flex-col">
        <StoreHeader />
        <section className="mx-auto max-w-[1080px] w-full px-4 sm:px-6 py-8 flex-1">
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-hairline" />
            <p className="mt-4 text-base font-medium text-ink">Keranjang kosong</p>
            <p className="mt-1 text-sm text-muted mb-6">Tambahkan produk terlebih dahulu</p>
            <Link href="/toko" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors">
              Jelajahi Produk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[1080px] w-full px-4 sm:px-6 py-8">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <Link href="/cart" className="hover:text-ink transition-colors">Keranjang</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Checkout</span>
        </nav>

        <h1 className="text-[22px] font-semibold text-ink mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Left: Shipping Form */}
            <div className="space-y-6">
              {/* Shipping Info */}
              <div className="rounded-xl border border-hairline p-6 space-y-5">
                <h2 className="text-base font-semibold text-ink flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Alamat Pengiriman
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">No. WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="08123456789"
                      className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Alamat Lengkap</label>
                  <textarea
                    rows={3}
                    placeholder="Jl. Contoh No. 123, Kota, Provinsi 12345"
                    className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors resize-none"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Kota</label>
                    <input
                      type="text"
                      placeholder="Jakarta"
                      className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Kode Pos</label>
                    <input
                      type="text"
                      placeholder="12345"
                      className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-xl border border-hairline p-6 space-y-4">
                <h2 className="text-base font-semibold text-ink">Produk yang Dipesan</h2>
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 py-3 border-b border-hairline-soft last:border-0 last:pb-0">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-soft">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-hairline" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink line-clamp-1">{item.name}</p>
                      <p className="mt-1 text-xs text-muted">{item.quantity} × {formatRupiah(item.price)}</p>
                    </div>
                    <p className="text-sm font-semibold text-ink shrink-0">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-hairline p-6 space-y-4">
                <h2 className="text-base font-semibold text-ink">Ringkasan Pembayaran</h2>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal ({totalItems} item)</span>
                    <span className="text-ink">{formatRupiah(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Ongkos kirim</span>
                    <span className="text-ink">{formatRupiah(shippingCost)}</span>
                  </div>
                </div>

                <hr className="border-hairline" />

                <div className="flex justify-between">
                  <span className="text-base font-semibold text-ink">Total</span>
                  <span className="text-base font-bold text-ink">{formatRupiah(grandTotal)}</span>
                </div>

                {/* Payment method placeholder */}
                <div className="rounded-lg bg-surface-soft p-4">
                  <p className="text-sm font-medium text-ink mb-1">Metode Pembayaran</p>
                  <p className="text-xs text-muted">Pembayaran dilakukan via WhatsApp. Penjual akan menghubungi Anda untuk konfirmasi pembayaran.</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-on-primary font-medium text-base hover:bg-primary-active active:bg-primary-active transition-colors h-12 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Buat Pesanan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}