import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  Headphones,
  RefreshCw,
  Clock,
  Zap,
  Gift,
  TrendingUp,
  Quote,
  Mail,
} from "lucide-react";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";
import { NewsletterForm } from "../components/NewsletterForm";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

/* ──────────────────────────── DATA ──────────────────────────── */

const heroImages = [
  "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const trustItems = [
  { icon: Truck, label: "Gratis Ongkir", desc: "Untuk pesanan di atas Rp200rb" },
  { icon: Shield, label: "100% Asli", desc: "Produk original dari pengrajin" },
  { icon: Headphones, label: "Support 24/7", desc: "Layanan pelanggan siap membantu" },
  { icon: RefreshCw, label: "Garansi Retur", desc: "7 hari pengembalian mudah" },
];

const bestSellers = [
  { id: "1", name: "Batik Tulis Solo Motif Parang Kusuma", price: 450000, originalPrice: 550000, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, sold: 230, slug: "batik-tulis-solo-parang-kusuma", badge: "Terlaris" },
  { id: "2", name: "Batik Cap Pekalongan Motif Mega Mendung", price: 285000, image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, sold: 89, slug: "batik-cap-pekalongan-mega-mendung", badge: null },
  { id: "3", name: "Batik Tulis Yogyakarta Motif Kawung", price: 520000, image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.9, sold: 156, slug: "batik-tulis-yogya-kawung", badge: "Baru" },
  { id: "4", name: "Batik Print Modern Motif Geometris", price: 150000, image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.3, sold: 312, slug: "batik-print-modern-geometris", badge: null },
  { id: "5", name: "Batik Tulis Madura Motif Gulung Pacul", price: 380000, originalPrice: 450000, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, sold: 198, slug: "batik-tulis-madura-gulung-pacul", badge: null },
  { id: "6", name: "Batik Cap Lasem Motif Burung Hong", price: 340000, image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, sold: 72, slug: "batik-cap-lasem-burung-hong", badge: null },
];

const categories = [
  { name: "Batik Tulis", slug: "batik-tulis", count: 45, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Batik Cap", slug: "batik-cap", count: 32, image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Batik Print", slug: "batik-print", count: 28, image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Aksesoris", slug: "aksesoris", count: 19, image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Pakaian", slug: "pakaian", count: 24, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Souvenir", slug: "souvenir", count: 15, image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400" },
];

const testimonials = [
  {
    name: "Siti Rahayu",
    location: "Jakarta",
    text: "Batik tulisnya sangat indah dan berkualitas. Pengiriman cepat dan packaging rapi. Pasti akan order lagi!",
    rating: 5,
    avatar: "SR",
  },
  {
    name: "Budi Santoso",
    location: "Bandung",
    text: "Koleksi batiknya lengkap dan harganya terjangkau. Customer service juga sangat membantu dalam memilih motif.",
    rating: 5,
    avatar: "BS",
  },
  {
    name: "Dewi Lestari",
    location: "Surabaya",
    text: "Sudah 3x belanja di Nusantara Batik dan selalu puas. Kualitas produk konsisten dan proses checkout-nya mudah.",
    rating: 4,
    avatar: "DL",
  },
];

const blogPosts = [
  {
    title: "Cara Merawat Batik Tulis Agar Tetap Awet",
    excerpt: "Tips dan trik menjaga kualitas kain batik tulis kesayangan Anda agar warna tetap cerah dan tidak mudah pudar.",
    slug: "cara-merawat-batik-tulis",
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600",
    date: "12 Mei 2026",
    category: "Tips & Tricks",
  },
  {
    title: "Mengenal 10 Motif Batik Populer di Indonesia",
    excerpt: "Indonesia memiliki ribuan motif batik. Simak 10 motif paling populer yang wajib Anda ketahui.",
    slug: "motif-batik-populer",
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600",
    date: "5 Mei 2026",
    category: "Edukasi",
  },
  {
    title: "Tren Batik Modern untuk Anak Muda",
    excerpt: "Batik tidak lagi kuno. Pelajari bagaimana anak muda saat ini memadukan batik dengan gaya modern.",
    slug: "tren-batik-modern",
    image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=600",
    date: "28 April 2026",
    category: "Inspirasi",
  },
];

/* ──────────────────────── PAGE COMPONENT ──────────────────────── */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      {/* ═══ 1. HEADER ═══ */}
      <StoreHeader />

      {/* ═══ 2. HERO SECTION (USP + CTA) ═══ */}
      <section className="relative overflow-hidden bg-surface-soft">
        <div className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-14 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
                <Zap className="h-3.5 w-3.5" />
                Gratis Ongkir & Bisa COD
              </span>
              <h1 className="mt-5 text-3xl sm:text-5xl font-bold text-ink leading-[1.1] tracking-tight">
                Belanja Batik Premium{" "}
                <span className="text-primary">dari Seluruh Nusantara</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed">
                Temukan koleksi batik tulis, batik cap, dan aksesoris batik berkualitas tinggi langsung dari pengrajin terbaik Indonesia. Harga terjangkau, kualitas terjamin.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/toko"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-on-primary hover:bg-primary-active transition-colors shadow-sm"
                >
                  Jelajahi Koleksi
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 rounded-lg border border-hairline px-7 py-3.5 text-sm font-semibold text-ink hover:bg-surface-soft transition-colors"
                >
                  Lihat Kategori
                </Link>
              </div>
              {/* Mini stats */}
              <div className="mt-8 flex items-center gap-6 text-sm text-muted">
                <div>
                  <span className="block text-lg font-bold text-ink">2.500+</span>
                  Produk
                </div>
                <div className="h-8 w-px bg-hairline" />
                <div>
                  <span className="block text-lg font-bold text-ink">10.000+</span>
                  Pelanggan
                </div>
                <div className="h-8 w-px bg-hairline" />
                <div>
                  <span className="block text-lg font-bold text-ink">4.9</span>
                  Rating
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {heroImages.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-xl ${
                    i === 0
                      ? "row-span-2 aspect-[3/4]"
                      : "aspect-square"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Batik ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. VALUE PROPOSITION / TRUST BAR ═══ */}
      <section className="border-y border-hairline bg-canvas">
        <div className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. BEST SELLER / FEATURED PRODUCTS ═══ */}
      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Best Seller</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink">Produk Terlaris</h2>
            <p className="text-sm text-muted mt-1">Pilihan terbaik yang paling banyak dipesan</p>
          </div>
          <Link
            href="/toko"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-ink underline underline-offset-2 hover:text-primary transition-colors"
          >
            Lihat Semua
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {bestSellers.map((product) => {
            const discount = product.originalPrice
              ? Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )
              : 0;
            return (
              <div
                key={product.id}
                className="group relative rounded-xl border border-hairline overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
              >
                <Link href={`/toko/produk/${product.slug}`}>
                  {discount > 0 && (
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-on-primary">
                      -{discount}%
                    </span>
                  )}
                  {product.badge && (
                    <span className="absolute top-3 right-3 z-10 rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-semibold text-on-primary">
                      {product.badge}
                    </span>
                  )}
                  <div className="relative aspect-[4/3] bg-surface-soft overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-ink line-clamp-2 leading-snug min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="font-medium text-ink">
                        {product.rating}
                      </span>
                      <span>·</span>
                      <span>{product.sold} terjual</span>
                    </div>
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="text-[15px] font-semibold text-ink">
                        {formatRupiah(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted line-through">
                          {formatRupiah(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/toko"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            Lihat Semua Produk
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ═══ 5. CATEGORY SECTION ═══ */}
      <section className="bg-surface-soft">
        <div className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-ink">
                Belanja per Kategori
              </h2>
              <p className="text-sm text-muted mt-1">
                Jelajahi koleksi berdasarkan kategori favorit Anda
              </p>
            </div>
            <Link
              href="/collections"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-ink underline underline-offset-2 hover:text-primary transition-colors"
            >
              Semua Kategori
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/toko/${cat.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-[4/3]"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-semibold text-white">
                    {cat.name}
                  </p>
                  <p className="text-xs text-white/70">{cat.count} produk</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. TESTIMONIAL / SOCIAL PROOF ═══ */}
      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-ink">
            Apa Kata Pelanggan Kami
          </h2>
          <p className="text-sm text-muted mt-2">
            Ribuan pelanggan puas telah membuktikan kualitas produk Nusantara Batik
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-hairline p-6 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < t.rating
                        ? "fill-primary text-primary"
                        : "fill-surface-strong text-surface-strong"
                    }`}
                  />
                ))}
              </div>
              <Quote className="h-5 w-5 text-hairline mb-2" />
              <p className="text-sm text-body-text leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-hairline-soft flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-muted">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 7. PROMO / OFFER SECTION (URGENCY) ═══ */}
      <section className="bg-primary">
        <div className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-14 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-on-primary/20 px-3 py-1 text-xs font-semibold text-on-primary mb-4">
                <Clock className="h-3.5 w-3.5" />
                Promo Terbatas
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-primary">
                Diskon Hingga 40% untuk Koleksi Terbaru!
              </h2>
              <p className="mt-3 text-sm sm:text-base text-on-primary/80 max-w-lg">
                Jangan sampai ketinggalan koleksi batik premium dengan harga spesial. Penawaran ini hanya berlaku hingga akhir bulan!
              </p>
              <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
                <Link
                  href="/toko"
                  className="inline-flex items-center gap-2 rounded-lg bg-on-primary px-7 py-3.5 text-sm font-semibold text-primary hover:bg-canvas transition-colors"
                >
                  <Gift className="h-4 w-4" />
                  Belanja Sekarang
                </Link>
              </div>
            </div>
            {/* Countdown-style badges */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center rounded-xl bg-on-primary/15 px-5 py-4 min-w-[80px]">
                <span className="text-2xl font-bold text-on-primary">07</span>
                <span className="text-xs text-on-primary/70 mt-1">Hari</span>
              </div>
              <span className="text-2xl font-bold text-on-primary">:</span>
              <div className="flex flex-col items-center rounded-xl bg-on-primary/15 px-5 py-4 min-w-[80px]">
                <span className="text-2xl font-bold text-on-primary">12</span>
                <span className="text-xs text-on-primary/70 mt-1">Jam</span>
              </div>
              <span className="text-2xl font-bold text-on-primary">:</span>
              <div className="flex flex-col items-center rounded-xl bg-on-primary/15 px-5 py-4 min-w-[80px]">
                <span className="text-2xl font-bold text-on-primary">45</span>
                <span className="text-xs text-on-primary/70 mt-1">Menit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. BLOG / ARTICLES ═══ */}
      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink">
              Inspirasi & Artikel
            </h2>
            <p className="text-sm text-muted mt-1">
              Tips, edukasi, dan inspirasi seputar batik Indonesia
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-ink underline underline-offset-2 hover:text-primary transition-colors"
          >
            Semua Artikel
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border border-hairline overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[16/9] bg-surface-soft overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 rounded-full bg-canvas/90 px-2.5 py-0.5 text-[11px] font-semibold text-ink backdrop-blur-sm">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <time className="text-xs text-muted">{post.date}</time>
                <h3 className="mt-2 text-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Baca Selengkapnya
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ 9. EMAIL / LEAD CAPTURE ═══ */}
      <section className="bg-surface-soft border-y border-hairline">
        <div className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-5">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink">
              Dapatkan Promo & Inspirasi Terbaru
            </h2>
            <p className="mt-3 text-sm text-muted max-w-md mx-auto">
              Bergabung dengan 10.000+ pelanggan kami dan dapatkan diskon eksklusif, tips perawatan batik, serta info koleksi terbaru langsung di inbox Anda.
            </p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-muted-soft">
              Kami menghormati privasi Anda. Berhenti kapan saja.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 10. FOOTER ═══ */}
      <Footer />
    </main>
  );
}