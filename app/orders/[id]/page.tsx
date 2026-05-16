import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Package, CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { StoreHeader } from "../../components/Header";
import { Footer } from "../../components/Footer";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

const order = {
  id: "order-1", date: "16 Mei 2026, 14:32 WITA", status: "Diproses",
  subtotal: 450000, shippingCost: 15000, total: 465000,
  address: "Jl. Slamet Riyadi No. 123, Laweyan, Solo, Jawa Tengah 57141", phone: "08123456789",
  items: [{ name: "Batik Tulis Solo Motif Parang Kusuma", quantity: 1, price: 450000, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=200", slug: "batik-tulis-solo-parang-kusuma" }],
  timeline: [
    { label: "Pesanan dibuat", time: "16 Mei 2026, 14:32", done: true },
    { label: "Pembayaran dikonfirmasi", time: "16 Mei 2026, 15:10", done: true },
    { label: "Sedang diproses penjual", time: "16 Mei 2026, 16:00", done: true, current: true },
    { label: "Produk dikirim", time: "", done: false },
    { label: "Pesanan selesai", time: "", done: false },
  ],
};

export default function OrderDetailPage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />
      <section className="mx-auto max-w-[1080px] w-full px-4 sm:px-6 py-8">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <Link href="/orders" className="hover:text-ink transition-colors">Pesanan</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">#{order.id}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-semibold text-ink">Pesanan #{order.id}</h1>
              <span className="inline-flex rounded-full px-3 py-0.5 text-xs font-medium text-blue-700 bg-blue-50">{order.status}</span>
            </div>
            <p className="text-sm text-muted mt-1">{order.date}</p>
          </div>
          <a href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya ingin menanyakan pesanan #${order.id}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors shrink-0">
            <MessageCircle className="h-4 w-4" /> Hubungi Penjual
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Timeline */}
            <div className="rounded-xl border border-hairline p-6">
              <h2 className="text-base font-semibold text-ink mb-5">Status Pesanan</h2>
              <div className="space-y-0">
                {order.timeline.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${step.current ? "bg-primary text-on-primary" : step.done ? "bg-green-500 text-white" : "bg-surface-soft text-muted"}`}>
                        {step.done && !step.current ? <CheckCircle2 className="h-4 w-4" /> : step.current ? <Package className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      </div>
                      {i < order.timeline.length - 1 && <div className={`w-0.5 flex-1 my-1 ${step.done ? "bg-green-500" : "bg-hairline"}`} />}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${step.done ? "text-ink" : "text-muted"}`}>{step.label}</p>
                      {step.time && <p className="text-xs text-muted mt-0.5">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="rounded-xl border border-hairline p-6">
              <h2 className="text-base font-semibold text-ink mb-4">Produk</h2>
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <Link href={`/toko/produk/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-soft">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/toko/produk/${item.slug}`} className="text-sm font-medium text-ink hover:text-primary transition-colors line-clamp-2">{item.name}</Link>
                    <p className="text-xs text-muted mt-1">{item.quantity} × {formatRupiah(item.price)}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink shrink-0">{formatRupiah(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-hairline p-6">
              <h2 className="text-base font-semibold text-ink flex items-center gap-2 mb-3"><MapPin className="h-4 w-4 text-primary" />Alamat Pengiriman</h2>
              <p className="text-sm text-body-text leading-relaxed">{order.address}</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-muted"><Phone className="h-3.5 w-3.5" />{order.phone}</div>
            </div>

            <div className="rounded-xl border border-hairline p-6 space-y-3">
              <h2 className="text-base font-semibold text-ink">Ringkasan Pembayaran</h2>
              <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="text-ink">{formatRupiah(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Ongkos kirim</span><span className="text-ink">{formatRupiah(order.shippingCost)}</span></div>
              <hr className="border-hairline" />
              <div className="flex justify-between"><span className="text-base font-semibold text-ink">Total</span><span className="text-base font-bold text-ink">{formatRupiah(order.total)}</span></div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}