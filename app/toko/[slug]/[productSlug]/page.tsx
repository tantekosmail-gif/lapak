"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Truck,
  Shield,
  Star,
  Minus,
  Plus,
  Share2,
  Heart,
  ChevronRight,
  MessageCircle,
  Clock,
  Store,
} from "lucide-react";

// ─── Dummy Data ──────────────────────────────────────────────

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

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

interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  phone: string;
  address: string;
}

const dummyStore: Store = {
  id: "store-1",
  name: "Toko Batik Nusantara",
  slug: "toko-batik-nusantara",
  description: "Batik berkualitas tinggi dari pengrajin lokal",
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
• Dekorasi interiorr

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

// ─── Component ───────────────────────────────────────────────

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = dummyProduct;
  const store = dummyStore;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const waMessage = `Halo, saya tertarik dengan produk *${product.name}* seharga ${formatRupiah(product.price)} (${quantity} pcs). Apakah masih tersedia?`;
  const waLink = `https://wa.me/${store.phone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ─── Top Bar ─── */}
      <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href={`/toko/${store.slug}`}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke toko</span>
            <span className="sm:hidden">Kembali</span>
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700 shrink-0" />

          <span className="text-sm text-gray-400 dark:text-gray-500 truncate">
            {product.category}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Tambah ke wishlist"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
            </button>
            <button
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Bagikan produk"
            >
              <Share2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ─── Galeri Gambar ─── */}
          <div className="space-y-3">
            {/* Gambar Utama */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800">
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnail */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition-all sm:h-20 sm:w-20 ${
                    selectedImage === i
                      ? "ring-green-500 dark:ring-green-400 scale-105"
                      : "ring-gray-200 dark:ring-gray-700 hover:ring-gray-400 dark:hover:ring-gray-500"
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

          {/* ─── Info Produk ─── */}
          <div className="flex flex-col">
            <div className="space-y-5">
              {/* Kategori & Rating */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {product.rating}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    ({product.reviewCount} ulasan)
                  </span>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  • {product.sold} terjual
                </span>
              </div>

              {/* Nama Produk */}
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl leading-tight">
                {product.name}
              </h1>

              {/* Harga */}
              <div className="flex items-end gap-3 flex-wrap">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatRupiah(product.price)}
                </p>
                {product.originalPrice && (
                  <span className="mb-1 text-lg text-gray-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Stok */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    product.stock > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.stock > 0
                    ? `Stok tersedia (${product.stock})`
                    : "Stok habis"}
                </span>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 dark:border-gray-800" />

              {/* Quantity Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Jumlah
                </label>
                <div className="inline-flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-30"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Subtotal:{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {formatRupiah(product.price * quantity)}
                  </span>
                </p>
              </div>

              {/* Info Badges */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1.5 rounded-xl bg-white dark:bg-gray-900 px-3 py-3 ring-1 ring-gray-200 dark:ring-gray-800">
                  <Truck className="h-5 w-5 text-green-500" />
                  <span className="text-[11px] text-center text-gray-600 dark:text-gray-400 leading-tight">
                    Siap dikirim
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-xl bg-white dark:bg-gray-900 px-3 py-3 ring-1 ring-gray-200 dark:ring-gray-800">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-[11px] text-center text-gray-600 dark:text-gray-400 leading-tight">
                    Garansi produk
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-xl bg-white dark:bg-gray-900 px-3 py-3 ring-1 ring-gray-200 dark:ring-gray-800">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="text-[11px] text-center text-gray-600 dark:text-gray-400 leading-tight">
                    Respon cepat
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs text-gray-600 dark:text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <hr className="border-gray-200 dark:border-gray-800" />

              {/* Deskripsi */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Deskripsi Produk
                </h2>
                <div className="leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm">
                  {product.description}
                </div>
              </div>
            </div>

            {/* ─── Tombol Aksi ─── */}
            <div className="mt-8 space-y-3 lg:sticky lg:bottom-6">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-white font-semibold shadow-lg shadow-green-600/25 hover:bg-green-700 active:scale-[0.98] transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </a>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 dark:border-green-500 px-6 py-3 text-green-600 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 active:scale-[0.98] transition-all">
                <ShoppingCart className="h-5 w-5" />
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>

        {/* ─── Info Toko ─── */}
        <section className="mt-12 rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-gray-200 dark:ring-gray-700">
              <Image
                src={store.logo}
                alt={store.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {store.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {store.address}
              </p>
            </div>
            <Link
              href={`/toko/${store.slug}`}
              className="shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Store className="inline h-4 w-4 mr-1" />
              Kunjungi Toko
            </Link>
          </div>
        </section>

        {/* ─── Produk Terkait ─── */}
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Produk Lainnya
            </h2>
            <Link
              href={`/toko/${store.slug}`}
              className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/toko/${store.slug}/${rp.slug}`}
                className="group overflow-hidden rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 hover:ring-green-400 dark:hover:ring-green-500 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={rp.image}
                    alt={rp.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug min-h-[2.5rem]">
                    {rp.name}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-green-600 dark:text-green-400">
                    {formatRupiah(rp.price)}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {rp.rating} • {rp.sold} terjual
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ─── Footer ─── */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-2 text-center text-sm text-gray-400 dark:text-gray-500">
            <Package className="h-6 w-6" />
            <p>Powered by <span className="font-semibold text-gray-600 dark:text-gray-300">Lapak</span></p>
            <p className="text-xs">Platform UMKM Indonesia</p>
          </div>
        </div>
      </footer>
    </main>
  );
}