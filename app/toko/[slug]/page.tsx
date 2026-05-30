"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag,
  Star,
  Heart,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { StoreHeader } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useCart } from "../../lib/cart-context";
import { toast } from "sonner";
import { apiGet } from "@/app/lib/fetch";
import type { ProductCategoryWithProducts } from "@/modules/entities/ProductCategories";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

// Bentuk produk yang dipakai UI (mengikuti shape lama agar desain tidak berubah).
type UIProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  sold: number;
  stock: number;
  rating: number;
};

const sortLabels: Record<string, string> = {
  popular: "Terpopuler",
  "price-low": "Harga Terendah",
  "price-high": "Harga Tertinggi",
  newest: "Terbaru",
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { addItem } = useCart();

  const [categoryName, setCategoryName] = useState<string>(slug);
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await apiGet<ProductCategoryWithProducts>(
        `/api/public/product-categories/${slug}`,
      );
      if (!res.success) {
        toast.error(`Gagal memuat kategori: ${res.error.message}`);
        setLoading(false);
        return;
      }
      setCategoryName(res.data.name);
      // Mapping backend -> shape UI: harga normal masuk `originalPrice` hanya
      // saat lebih besar dari harga jual (supaya diskon dihitung benar).
      setProducts(
        res.data.products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          originalPrice:
            p.regular_price > p.price ? p.regular_price : undefined,
          image: p.imageUrl ?? "",
          sold: p.sold,
          stock: p.stock,
          rating: 0,
        })),
      );
      setLoading(false);
    })();
  }, [slug]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return 0;
      default:
        return b.sold - a.sold;
    }
  });

  const toggleWishlist = (id: number) => {
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddToCart = (product: UIProduct) => {
    // Belum login -> arahkan ke /signin dulu (cart tetap client-side).
    if (status !== "authenticated" || !session?.user) {
      toast.info("Login dulu untuk memasukkan produk ke keranjang");
      router.push(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    addItem({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      slug: product.slug,
    });
    toast.success("Ditambahkan ke keranjang");
  };

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <Link href="/toko" className="hover:text-ink transition-colors">Katalog</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">{categoryName}</span>
        </nav>

        <h1 className="text-[22px] font-semibold text-ink mb-2">{categoryName}</h1>
        <p className="text-sm text-muted mb-6">
          Menampilkan produk dalam kategori {categoryName}
        </p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-soft" />
          <input
            type="text"
            placeholder="Cari dalam kategori ini..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
          />
        </div>

        {/* Sort + count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            {loading ? "Memuat…" : `${sortedProducts.length} produk`}
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
          {loading ? (
            <div className="py-20 text-center text-sm text-muted">Memuat…</div>
          ) : sortedProducts.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-hairline" />
              <p className="mt-4 text-base font-medium text-ink">Produk tidak ditemukan</p>
              <p className="mt-1 text-sm text-muted">Coba ubah kata kunci pencarian.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {sortedProducts.map((product) => {
                // Diskon dihitung dari harga jual vs harga coret (regular_price).
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
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : null}
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
                    <div className="px-4 pb-4">
                      <button onClick={() => handleAddToCart(product)} className="w-full rounded-lg border border-hairline py-2 text-xs font-medium text-ink hover:bg-surface-soft hover:border-ink transition-colors">
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
