"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, Star } from "lucide-react";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  stock: number;
  store: string;
}

const dummyWishlist: WishlistItem[] = [
  {
    id: "1",
    name: "Batik Tulis Solo Motif Parang Kusuma",
    slug: "batik-tulis-solo-parang-kusuma",
    price: 450000,
    originalPrice: 550000,
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.8,
    sold: 230,
    stock: 15,
    store: "Nusantara Batik",
  },
  {
    id: "3",
    name: "Batik Tulis Yogyakarta Motif Kawung",
    slug: "batik-tulis-yogya-kawung",
    price: 520000,
    image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.9,
    sold: 156,
    stock: 8,
    store: "Nusantara Batik",
  },
  {
    id: "5",
    name: "Batik Tulis Madura Motif Gulung Pacul",
    slug: "batik-tulis-madura-gulung-pacul",
    price: 380000,
    originalPrice: 450000,
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.7,
    sold: 198,
    stock: 22,
    store: "Nusantara Batik",
  },
  {
    id: "7",
    name: "Batik Cap Lasem Motif Burung Hong",
    slug: "batik-cap-lasem-burung-hong",
    price: 340000,
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.5,
    sold: 72,
    stock: 0,
    store: "Nusantara Batik",
  },
  {
    id: "9",
    name: "Batik Print Modern Motif Geometris",
    slug: "batik-print-modern-geometris",
    price: 150000,
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.3,
    sold: 312,
    stock: 45,
    store: "Nusantara Batik",
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(dummyWishlist);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[1080px] w-full px-4 sm:px-6 py-8">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Wishlist</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-semibold text-ink flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              Wishlist Saya
            </h1>
            <p className="text-sm text-muted mt-1">{items.length} produk tersimpan</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <Heart className="mx-auto h-16 w-16 text-hairline" />
            <p className="mt-4 text-base font-medium text-ink">Wishlist kosong</p>
            <p className="mt-1 text-sm text-muted mb-6">Simpan produk favorit Anda di sini</p>
            <Link
              href="/toko"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => {
              const discount = item.originalPrice
                ? Math.round(
                    ((item.originalPrice - item.price) / item.originalPrice) * 100
                  )
                : 0;
              return (
                <div
                  key={item.id}
                  className="group relative rounded-xl border border-hairline overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
                >
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-canvas/80 backdrop-blur-sm hover:bg-canvas transition-colors"
                    aria-label="Hapus dari wishlist"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted hover:text-primary" />
                  </button>

                  <Link href={`/toko/nusantara-batik/${item.slug}`}>
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-on-primary">
                        -{discount}%
                      </span>
                    )}
                    {item.stock === 0 && (
                      <span className="absolute top-3 left-3 z-10 rounded-full bg-ink/70 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                        Habis
                      </span>
                    )}
                    <div className="relative aspect-[4/3] bg-surface-soft overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted mb-1">{item.store}</p>
                      <h3 className="text-sm font-medium text-ink line-clamp-2 leading-snug min-h-[2.5rem]">
                        {item.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="font-medium text-ink">{item.rating}</span>
                        <span>·</span>
                        <span>{item.sold} terjual</span>
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-2">
                        <span className="text-[15px] font-semibold text-ink">
                          {formatRupiah(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-muted line-through">
                            {formatRupiah(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}