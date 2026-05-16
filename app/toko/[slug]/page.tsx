"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MessageCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingBag,
  ChevronDown,
  Phone,
  Globe,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

// ─── Dummy Data ───────────────────────────────────────────

const storeInfo = {
  name: "Toko Batik Nusantara",
  slug: "toko-batik-nusantara",
  description:
    "Batik berkualitas tinggi dari pengrajin lokal Solo dan Pekalongan. Menerima pesanan custom untuk souvenir dan seragam.",
  logo: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=200",
  banner:
    "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=1600",
  phone: "6281234567890",
  address: "Solo, Jawa Tengah",
  instagram: "@tokobatiknusantara",
  productCount: 8,
  rating: 4.9,
  reviewCount: 324,
  founded: "2020",
};

const categories = [
  { id: "all", label: "Semua" },
  { id: "batik-tulis", label: "Batik Tulis" },
  { id: "batik-cap", label: "Batik Cap" },
  { id: "batik-print", label: "Batik Print" },
  { id: "aksesoris", label: "Aksesoris" },
];

const dummyProducts = [
  {
    id: "prod-1",
    name: "Batik Tulis Solo Motif Parang Kusuma",
    slug: "batik-tulis-solo-parang-kusuma",
    price: 450000,
    originalPrice: 550000,
    image:
      "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "batik-tulis",
    rating: 4.8,
    sold: 230,
    stock: 15,
  },
  {
    id: "prod-2",
    name: "Batik Cap Pekalongan Motif Mega Mendung",
    slug: "batik-cap-pekalongan-mega-mendung",
    price: 285000,
    originalPrice: 320000,
    image:
      "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "batik-cap",
    rating: 4.6,
    sold: 89,
    stock: 22,
  },
  {
    id: "prod-3",
    name: "Batik Tulis Yogyakarta Motif Kawung",
    slug: "batik-tulis-yogya-kawung",
    price: 520000,
    image:
      "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "batik-tulis",
    rating: 4.9,
    sold: 156,
    stock: 8,
  },
  {
    id: "prod-4",
    name: "Batik Print Modern Motif Geometris",
    slug: "batik-print-modern-geometris",
    price: 150000,
    image:
      "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "batik-print",
    rating: 4.3,
    sold: 312,
    stock: 45,
  },
  {
    id: "prod-5",
    name: "Batik Tulis Madura Motif Pesisir",
    slug: "batik-tulis-madura-pesisir",
    price: 380000,
    originalPrice: 420000,
    image:
      "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "batik-tulis",
    rating: 4.7,
    sold: 67,
    stock: 12,
  },
  {
    id: "prod-6",
    name: "Gelang Batik Kayu Jati",
    slug: "gelang-batik-kayu-jati",
    price: 75000,
    image:
      "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "aksesoris",
    rating: 4.5,
    sold: 198,
    stock: 50,
  },
  {
    id: "prod-7",
    name: "Batik Cap Solo Motif Sogan",
    slug: "batik-cap-solo-motif-sogan",
    price: 310000,
    image:
      "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "batik-cap",
    rating: 4.8,
    sold: 112,
    stock: 18,
  },
  {
    id: "prod-8",
    name: "Broshi Batik Tie Dye",
    slug: "broshi-batik-tie-dye",
    price: 45000,
    image:
      "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "aksesoris",
    rating: 4.4,
    sold: 276,
    stock: 80,
  },
];

// ─── Component ────────────────────────────────────────────

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  const filteredProducts = dummyProducts
    .filter(
      (p) => activeCategory === "all" || p.category === activeCategory
    )
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return 0;
      case "popular":
      default:
        return b.sold - a.sold;
    }
  });

  const toggleWishlist = (id: string) => {
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sortLabels: Record<string, string> = {
    popular: "Terpopuler",
    "price-low": "Harga Terendah",
    "price-high": "Harga Tertinggi",
    newest: "Terbaru",
  };

  return (
    <main className="min-h-screen bg-canvas">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </Link>
          <Link href="/" className="text-lg font-bold text-primary tracking-tight">
            Lapak
          </Link>
          <a
            href={`https://wa.me/${storeInfo.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-active transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* ─── Banner Image ─── */}
      <section className="relative h-48 sm:h-64 lg:h-72 overflow-hidden bg-surface-soft">
        <Image
          src={storeInfo.banner}
          alt={storeInfo.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </section>

      {/* ─── Store Info Card (overlapping banner) ─── */}
      <section className="relative -mt-16 sm:-mt-20 mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="rounded-xl bg-canvas border border-hairline shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Logo */}
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border-2 border-canvas shadow-md">
              <Image
                src={storeInfo.logo}
                alt={storeInfo.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-[22px] font-medium leading-tight text-ink">
                    {storeInfo.name}
                  </h1>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {storeInfo.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="font-medium text-ink">
                        {storeInfo.rating}
                      </span>
                      <span>({storeInfo.reviewCount} ulasan)</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">
                {storeInfo.description}
              </p>

              {/* Actions row */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${storeInfo.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active active:bg-primary-active transition-colors h-10"
                >
                  <MessageCircle className="h-4 w-4" />
                  Hubungi via WhatsApp
                </a>
                <div className="flex items-center gap-2 text-muted">
                  <a
                    href={`tel:${storeInfo.phone}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline hover:border-ink hover:text-ink transition-colors"
                    aria-label="Telepon"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://instagram.com/${storeInfo.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline hover:border-ink hover:text-ink transition-colors"
                    aria-label="Instagram"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-5 pt-5 border-t border-hairline-soft grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-ink">{storeInfo.productCount}</p>
              <p className="text-xs text-muted mt-0.5">Produk</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-ink">{storeInfo.reviewCount}</p>
              <p className="text-xs text-muted mt-0.5">Ulasan</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-ink">{storeInfo.founded}</p>
              <p className="text-xs text-muted mt-0.5">Berdiri</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Toolbar: Search + Categories + Sort ─── */}
      <section className="sticky top-16 z-20 bg-canvas border-b border-hairline">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-soft" />
            <input
              type="text"
              placeholder="Cari produk di toko ini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 focus:ring-0 transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-ink text-canvas"
                    : "bg-surface-soft text-body-text hover:bg-surface-strong"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort + result count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {sortedProducts.length} produk
            </p>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1.5 rounded-lg border border-hairline px-3 py-2 text-sm text-ink hover:border-ink transition-colors"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {sortLabels[sortBy]}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg border border-hairline bg-canvas shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] py-1">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === key
                            ? "text-primary font-medium bg-surface-soft"
                            : "text-ink hover:bg-surface-soft"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Products Grid ─── */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8 sm:py-10">
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-hairline" />
            <p className="mt-4 text-base font-medium text-ink">
              Produk tidak ditemukan
            </p>
            <p className="mt-1 text-sm text-muted">
              Coba ubah kata kunci atau kategori pencarian.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {sortedProducts.map((product) => {
              const discount = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )
                : 0;

              return (
                <Link
                  key={product.id}
                  href={`/toko/${storeInfo.slug}/${product.slug}`}
                  className="group relative rounded-xl border border-hairline overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
                >
                  {/* Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-canvas/80 backdrop-blur-sm border border-hairline/50 shadow-sm transition-colors hover:bg-canvas"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        wishlisted.has(product.id)
                          ? "fill-primary text-primary"
                          : "text-ink"
                      }`}
                    />
                  </button>

                  {/* Discount badge */}
                  {discount > 0 && (
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-on-primary">
                      -{discount}%
                    </span>
                  )}

                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-surface-soft overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Meta */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-ink line-clamp-2 leading-snug min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {/* Rating + Sold */}
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="font-medium text-ink">
                        {product.rating}
                      </span>
                      <span>·</span>
                      <span>{product.sold} terjual</span>
                    </div>

                    {/* Price */}
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

                    {/* Stock */}
                    {product.stock <= 10 && product.stock > 0 && (
                      <p className="mt-2 text-[11px] font-medium text-primary">
                        Sisa {product.stock} stok!
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-hairline">
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Link href="/" className="text-lg font-bold text-primary tracking-tight">
              Lapak
            </Link>
            <p className="text-xs text-muted max-w-xs">
              Platform toko online gratis untuk UMKM Indonesia. Buat toko, tambah produk, bagikan ke WhatsApp.
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted">
              <Link href="/" className="hover:text-ink transition-colors">
                Beranda
              </Link>
              <Link href="/signin" className="hover:text-ink transition-colors">
                Masuk
              </Link>
              <Link href="/signup" className="hover:text-ink transition-colors">
                Daftar
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-soft">
              © 2026 Lapak. Platform UMKM Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}