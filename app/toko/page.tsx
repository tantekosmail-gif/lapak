"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag,
  Star,
  Heart,
} from "lucide-react";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCart } from "../lib/cart-context";
import { toast } from "sonner";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

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
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "aksesoris",
    rating: 4.4,
    sold: 276,
    stock: 80,
  },
];

export default function TokoPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  const filteredProducts = dummyProducts
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "newest": return 0;
      default: return b.sold - a.sold;
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

  const handleAddToCart = (product: typeof dummyProducts[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      slug: product.slug,
    });
    toast.success("Ditambahkan ke keranjang");
  };

  const sortLabels: Record<string, string> = {
    popular: "Terpopuler",
    "price-low": "Harga Terendah",
    "price-high": "Harga Tertinggi",
    newest: "Terbaru",
  };

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Katalog Produk</span>
        </nav>

        <h1 className="text-[22px] font-semibold text-ink mb-2">Katalog Produk</h1>
        <p className="text-sm text-muted mb-6">Semua produk yang tersedia di toko</p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-soft" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-1 scrollbar-none">
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
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted">{sortedProducts.length} produk</p>
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
                <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg border border-hairline bg-canvas shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] py-1">
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSortBy(key); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === key ? "text-primary font-medium bg-surface-soft" : "text-ink hover:bg-surface-soft"
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

        {/* Products Grid */}
        <div className="mt-6">
          {sortedProducts.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-hairline" />
              <p className="mt-4 text-base font-medium text-ink">Produk tidak ditemukan</p>
              <p className="mt-1 text-sm text-muted">Coba ubah kata kunci atau kategori pencarian.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {sortedProducts.map((product) => {
                const discount = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="group relative rounded-xl border border-hairline overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
                  >
                    <Link href={`/toko/produk/${product.slug}`}>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-canvas/80 backdrop-blur-sm border border-hairline/50 shadow-sm transition-colors hover:bg-canvas"
                        aria-label="Wishlist"
                      >
                        <Heart className={`h-4 w-4 ${wishlisted.has(product.id) ? "fill-primary text-primary" : "text-ink"}`} />
                      </button>

                      {discount > 0 && (
                        <span className="absolute top-3 left-3 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-on-primary">
                          -{discount}%
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
                          <span className="font-medium text-ink">{product.rating}</span>
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
                        {product.stock <= 10 && product.stock > 0 && (
                          <p className="mt-2 text-[11px] font-medium text-primary">
                            Sisa {product.stock} stok!
                          </p>
                        )}
                      </div>
                    </Link>

                    <div className="px-4 pb-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full rounded-lg border border-hairline py-2 text-xs font-medium text-ink hover:bg-surface-soft hover:border-ink transition-colors"
                      >
                        + Keranjang
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}