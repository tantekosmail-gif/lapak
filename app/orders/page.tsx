"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight } from "lucide-react";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

const statusColors: Record<string, string> = {
  "Menunggu Pembayaran": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Diproses": "bg-blue-50 text-blue-700 border-blue-200",
  "Dikirim": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Selesai": "bg-green-50 text-green-700 border-green-200",
  "Dibatalkan": "bg-red-50 text-red-700 border-red-200",
};

const dummyOrders = [
  {
    id: "order-1",
    date: "16 Mei 2026",
    status: "Diproses",
    total: 465000,
    items: [
      { name: "Batik Tulis Solo Motif Parang Kusuma", quantity: 1, price: 450000, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=200" },
    ],
  },
  {
    id: "order-2",
    date: "12 Mei 2026",
    status: "Selesai",
    total: 360000,
    items: [
      { name: "Batik Cap Pekalongan Motif Mega Mendung", quantity: 1, price: 285000, image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=200" },
      { name: "Gelang Batik Kayu Jati", quantity: 1, price: 75000, image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=200" },
    ],
  },
  {
    id: "order-3",
    date: "5 Mei 2026",
    status: "Dibatalkan",
    total: 150000,
    items: [
      { name: "Batik Print Modern Motif Geometris", quantity: 1, price: 150000, image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=200" },
    ],
  },
];

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[1080px] w-full px-4 sm:px-6 py-8">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Pesanan Saya</span>
        </nav>

        <h1 className="text-[22px] font-semibold text-ink mb-2">Pesanan Saya</h1>
        <p className="text-sm text-muted mb-8">{dummyOrders.length} pesanan</p>

        {dummyOrders.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="mx-auto h-16 w-16 text-hairline" />
            <p className="mt-4 text-base font-medium text-ink">Belum ada pesanan</p>
            <p className="mt-1 text-sm text-muted mb-6">Mulai belanja untuk membuat pesanan pertama</p>
            <Link href="/toko" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors">
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {dummyOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group block rounded-xl border border-hairline overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-surface-soft border-b border-hairline-soft">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted">#{order.id}</span>
                    <span className="text-xs text-muted">·</span>
                    <span className="text-xs text-muted">{order.date}</span>
                  </div>
                  <span className={`inline-flex rounded-full border px-3 py-0.5 text-[11px] font-medium ${statusColors[order.status] || "bg-surface-soft text-muted border-hairline"}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items Preview */}
                <div className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 border-canvas bg-surface-soft">
                          <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-canvas bg-surface-soft text-xs font-medium text-muted">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">
                        {order.items.length === 1
                          ? order.items[0].name
                          : `${order.items[0].name} +${order.items.length - 1} lainnya`}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{order.items.reduce((s, i) => s + i.quantity, 0)} item</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-ink">{formatRupiah(order.total)}</p>
                      <ChevronRight className="h-4 w-4 text-muted ml-auto mt-0.5 group-hover:text-ink transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}