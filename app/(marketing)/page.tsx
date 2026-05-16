import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Heart, ShoppingBag } from "lucide-react";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

const heroImages = [
  "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const featuredProducts = [
  { id: "1", name: "Batik Tulis Solo Motif Parang Kusuma", price: 450000, originalPrice: 550000, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, sold: 230, slug: "batik-tulis-solo-parang-kusuma" },
  { id: "2", name: "Batik Cap Pekalongan Motif Mega Mendung", price: 285000, image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, sold: 89, slug: "batik-cap-pekalongan-mega-mendung" },
  { id: "3", name: "Batik Tulis Yogyakarta Motif Kawung", price: 520000, image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.9, sold: 156, slug: "batik-tulis-yogya-kawung" },
  { id: "4", name: "Batik Print Modern Motif Geometris", price: 150000, image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.3, sold: 312, slug: "batik-print-modern-geometris" },
];

const categories = [
  { name: "Batik Tulis", slug: "batik-tulis", count: 45, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Batik Cap", slug: "batik-cap", count: 32, image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Batik Print", slug: "batik-print", count: 28, image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Aksesoris", slug: "aksesoris", count: 19, image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=400" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-soft">
        <div className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
            <div className="max-w-lg">
              <p className="text-sm font-medium text-primary mb-3">Koleksi Terbaru 2026</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">
                Batik Premium <br />dari Seluruh Nusantara
              </h1>
              <p className="mt-4 text-base text-muted leading-relaxed">
                Temukan koleksi batik tulis, batik cap, dan aksesoris batik berkualitas tinggi dari pengrajin terbaik Indonesia.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/toko" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors">
                  Jelajahi Koleksi
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/collections" className="inline-flex items-center gap-2 rounded-lg border border-ink px-6 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors">
                  Lihat Koleksi
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {heroImages.map((img, i) => (
                <div key={i} className={`relative overflow-hidden rounded-xl ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}>
                  <Image src={img} alt={`Batik ${i + 1}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-ink">Kategori</h2>
            <p className="text-sm text-muted mt-1">Jelajahi berdasarkan kategori</p>
          </div>
          <Link href="/toko" className="text-sm font-medium text-ink underline underline-offset-2 hover:text-primary transition-colors">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/toko/${cat.slug}`} className="group relative overflow-hidden rounded-xl aspect-[4/3]">
              <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-sm font-semibold text-white">{cat.name}</p>
                <p className="text-xs text-white/70">{cat.count} produk</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-12 sm:py-16 border-t border-hairline">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-ink">Produk Populer</h2>
            <p className="text-sm text-muted mt-1">Pilihan terbaik minggu ini</p>
          </div>
          <Link href="/toko" className="text-sm font-medium text-ink underline underline-offset-2 hover:text-primary transition-colors">
            Lihat Semua
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {featuredProducts.map((product) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            return (
              <div key={product.id} className="group relative rounded-xl border border-hairline overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
                <Link href={`/toko/produk/${product.slug}`}>
                  {discount > 0 && (
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-on-primary">-{discount}%</span>
                  )}
                  <div className="relative aspect-[4/3] bg-surface-soft overflow-hidden">
                    <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-ink line-clamp-2 leading-snug min-h-[2.5rem]">{product.name}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="font-medium text-ink">{product.rating}</span>
                      <span>·</span>
                      <span>{product.sold} terjual</span>
                    </div>
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="text-[15px] font-semibold text-ink">{formatRupiah(product.price)}</span>
                      {product.originalPrice && <span className="text-xs text-muted line-through">{formatRupiah(product.originalPrice)}</span>}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-2xl bg-surface-soft p-8 sm:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-ink">Punya Toko Batik?</h2>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">Buka toko online Anda di Lapak dan jangkau pembeli batik dari seluruh Indonesia.</p>
          <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors">
            Buka Toko Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}