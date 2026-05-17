"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  MessageCircle,
  Truck,
  Shield,
  Clock,
  Store,
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

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: ProductImage[];
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  rating: number;
  reviewCount: number;
  sold: number;
  tags: string[];
}

interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  phone: string;
  address: string;
}

const dummyStore: StoreInfo = {
  id: "store-1",
  name: "Nusantara Batik",
  slug: "nusantara-batik",
  description: "Batik berkualitas tinggi dari pengrajin terbaik Indonesia",
  logo: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=100",
  phone: "6281234567890",
  address: "Solo, Jawa Tengah",
};

const dummyProduct: Product = {
  id: "prod-1",
  name: "Batik Tulis Solo Motif Parang Kusuma",
  slug: "batik-tulis-solo-parang-kusuma",
  description: `Batik tulis asli Solo dengan motif Parang Kusuma yang ikonik. Dibuat oleh pengrajin batik berpengalaman dengan teknik tulis tangan tradisional.

Kain batik ini menggunakan bahan katun prima yang nyaman dipakai sehari-hari maupun untuk acara formal. Proses pembuatan memakan waktu 2-3 minggu dengan detail yang sangat halus.

Cocok untuk:
• Bahan pakaian formal dan semi-formal
• Koleksi batik premium
• Hadiah souvenir berkualitas
• Dekorasi interior

Perawatan:
• Cuci dengan tangan menggunakan detergen lembut
• Jangan gunakan pemutih
• Jemur di tempat teduh
• Setrika dengan suhu rendah`,
  images: [
    {
      id: "img-1",
      url: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Batik Tulis Solo - Tampak Depan",
    },
    {
      id: "img-2",
      url: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Batik Tulis Solo - Detail Motif",
    },
    {
      id: "img-3",
      url: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Batik Tulis Solo - Tampak Utuh",
    },
    {
      id: "img-4",
      url: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Batik Tulis Solo - Detail Warna",
    },
  ],
  price: 450000,
  originalPrice: 550000,
  stock: 15,
  category: "Batik Tulis",
  rating: 4.8,
  reviewCount: 124,
  sold: 230,
  tags: ["Batik Tulis", "Solo", "Premium", "Handmade"],
};

const relatedProducts = [
  {
    id: "rel-1",
    name: "Batik Cap Pekalongan Motif Mega Mendung",
    slug: "batik-cap-pekalongan-mega-mendung",
    price: 285000,
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.6,
    sold: 89,
  },
  {
    id: "rel-2",
    name: "Batik Tulis Yogyakarta Motif Kawung",
    slug: "batik-tulis-yogya-kawung",
    price: 520000,
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.9,
    sold: 156,
  },
  {
    id: "rel-3",
    name: "Batik Print Modern Motif Geometris",
    slug: "batik-print-modern-geometris",
    price: 150000,
    image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.3,
    sold: 312,
  },
  {
    id: "rel-4",
    name: "Batik Tulis Madura Motif Pesisir",
    slug: "batik-tulis-madura-pesisir",
    price: 380000,
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.7,
    sold: 67,
  },
];

// ─── Component ────────────────────────────────────────────

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = dummyProduct;
  const store = dummyStore;

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const waMessage = `Halo, saya tertarik dengan produk *${product.name}* seharga ${formatRupiah(product.price)} (${quantity} pcs). Apakah masih tersedia?`;
  const waLink = `https://wa.me/${store.phone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="min-h-screen bg-canvas">
      {/* ─── Top Bar ─── */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1080px] items-center gap-3 px-4 sm:px-6">
          <Link
            href={`/toko/${store.slug}`}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke toko</span>
            <span className="sm:hidden">Kembali</span>
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-hairline shrink-0" />

          <span className="text-sm text-muted-soft truncate">
            {product.category}
          </span>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="rounded-full p-2 hover:bg-surface-soft transition-colors"
              aria-label="Tambah ke wishlist"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isWishlisted
                    ? "fill-primary text-primary"
                    : "text-muted-soft"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Content ─── */}
      <div className="mx-auto max-w-[1080px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          {/* ─── Left Column: Image Gallery + Description ─── */}
          <div className="space-y-10">
            {/* Image Gallery */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-soft border border-hairline">
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-on-primary shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${
                      selectedImage === i
                        ? "border-ink"
                        : "border-hairline hover:border-border-strong"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-4 text-sm font-semibold text-ink uppercase tracking-wider">
                Deskripsi Produk
              </h2>
              <div className="text-sm leading-relaxed text-body-text whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </div>

          {/* ─── Right Column: Product Info + CTA ─── */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-medium text-ink">
                {product.category}
              </span>
              <span className="text-sm text-ink font-medium">
                {product.rating}
              </span>
              <span className="text-sm text-muted">
                ({product.reviewCount} ulasan)
              </span>
              <span className="text-sm text-muted">•</span>
              <span className="text-sm text-muted">
                {product.sold} terjual
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-[22px] font-medium leading-tight text-ink">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3">
              <p className="text-[21px] font-bold text-ink">
                {formatRupiah(product.price)}
              </p>
              {product.originalPrice && (
                <span className="mb-0.5 text-sm text-muted line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  product.stock > 0 ? "bg-green-500" : "bg-primary"
                }`}
              />
              <span className="text-sm text-muted">
                {product.stock > 0
                  ? `Stok tersedia (${product.stock})`
                  : "Stok habis"}
              </span>
            </div>

            <hr className="border-hairline" />

            {/* Quantity Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Jumlah</label>
              <div className="inline-flex items-center rounded-lg border border-hairline bg-canvas">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center text-muted hover:text-ink transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-ink border-x border-hairline">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center text-muted hover:text-ink transition-colors disabled:opacity-30"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted">
                Subtotal:{" "}
                <span className="font-semibold text-ink">
                  {formatRupiah(product.price * quantity)}
                </span>
              </p>
            </div>

            {/* Info Badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-hairline px-3 py-3">
                <Truck className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-center text-muted leading-tight">
                  Siap dikirim
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-hairline px-3 py-3">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-center text-muted leading-tight">
                  Garansi produk
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-hairline px-3 py-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-center text-muted leading-tight">
                  Respon cepat
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-soft px-3 py-1 text-xs text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <hr className="border-hairline" />

            {/* CTA Buttons */}
            <div className="space-y-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-on-primary font-medium text-base hover:bg-primary-active active:bg-primary-active transition-colors h-12"
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </a>
            </div>

            {/* Store Info */}
            <div className="rounded-lg border border-hairline p-5">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-hairline">
                  <Image
                    src={store.logo}
                    alt={store.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-ink truncate">
                    {store.name}
                  </h3>
                  <p className="text-xs text-muted">{store.address}</p>
                </div>
                <Link
                  href={`/toko/${store.slug}`}
                  className="shrink-0 rounded-lg border border-hairline px-4 py-2 text-xs font-medium text-ink hover:border-ink transition-colors"
                >
                  <Store className="inline h-3.5 w-3.5 mr-1" />
                  Kunjungi
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Related Products ─── */}
        <section className="mt-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">
              Produk Lainnya
            </h2>
            <Link
              href={`/toko/${store.slug}`}
              className="text-sm font-medium text-ink underline underline-offset-2 hover:text-primary transition-colors"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/toko/${store.slug}/${rp.slug}`}
                className="group overflow-hidden rounded-lg border border-hairline transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]"
              >
                <div className="relative aspect-square overflow-hidden bg-surface-soft">
                  <Image
                    src={rp.image}
                    alt={rp.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-ink line-clamp-2 leading-snug">
                    {rp.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {formatRupiah(rp.price)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {rp.rating} • {rp.sold} terjual
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ─── Footer ─── */}
      <footer className="mt-16 border-t border-hairline">
        <div className="mx-auto max-w-[1080px] px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/" className="text-base font-bold text-primary">
              Nusantara Batik
            </Link>
            <p className="text-xs text-muted">
              © 2026 Nusantara Batik. Batik premium dari seluruh Nusantara.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}