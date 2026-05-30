"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  Clock,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { StoreHeader } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { useCart } from "../../../lib/cart-context";
import { toast } from "sonner";
import { apiGet } from "@/app/lib/fetch";
import type { ProductDetail } from "@/modules/entities/Product";
import type { ProductCategoryWithProducts } from "@/modules/entities/ProductCategories";
import type { RatingSummary } from "@/modules/entities/Rating";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Shape yang dikonsumsi UI (mengikuti shape lama agar desain tidak berubah).
type UIProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  images: { id: string; url: string; alt: string }[];
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  sold: number;
  tags: string[];
};

type UIRelated = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating: number;
  sold: number;
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { addItem } = useCart();

  const [product, setProduct] = useState<UIProduct | null>(null);
  const [related, setRelated] = useState<UIRelated[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const detail = await apiGet<ProductDetail>(
        `/api/public/products/by-slug/${slug}`,
      );
      if (!detail.success) {
        toast.error(`Gagal memuat produk: ${detail.error.message}`);
        setLoading(false);
        return;
      }
      const p = detail.data;
      const categoryName = p.category?.name ?? "";
      const categorySlug = categoryName ? slugify(categoryName) : "";

      // Bangun array gambar — pakai relation `images` jika ada; fallback ke
      // single `imageUrl` di Product supaya UI tetap menampilkan gambar
      // walau belum ada record ProductImage.
      const images =
        p.images.length > 0
          ? p.images.map((img) => ({
              id: String(img.id),
              url: img.url,
              alt: p.name,
            }))
          : p.imageUrl
          ? [{ id: "primary", url: p.imageUrl, alt: p.name }]
          : [];

      const ui: UIProduct = {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: "",
        images,
        price: p.price,
        originalPrice:
          p.regular_price > p.price ? p.regular_price : undefined,
        stock: p.stock,
        category: categoryName,
        categorySlug,
        rating: 0,
        reviewCount: 0,
        sold: p.sold,
        tags: categoryName ? [categoryName] : [],
      };
      setProduct(ui);

      // Paralel: summary rating + daftar produk kategori (untuk related).
      const [summaryRes, catRes] = await Promise.all([
        apiGet<RatingSummary>(`/api/public/products/${p.id}/ratings/summary`),
        categorySlug
          ? apiGet<ProductCategoryWithProducts>(
              `/api/public/product-categories/${categorySlug}`,
            )
          : Promise.resolve({
              success: false as const,
              error: { code: "SKIP", message: "no category" },
            }),
      ]);

      if (summaryRes.success) {
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                rating: Math.round(summaryRes.data.average * 10) / 10,
                reviewCount: summaryRes.data.count,
              }
            : prev,
        );
      }

      if (catRes.success) {
        setRelated(
          catRes.data.products
            .filter((rp) => rp.id !== p.id)
            .slice(0, 4)
            .map((rp) => ({
              id: rp.id,
              name: rp.name,
              slug: rp.slug,
              price: rp.price,
              image: rp.imageUrl ?? "",
              rating: 0,
              sold: rp.sold,
            })),
        );
      }

      setLoading(false);
    })();
  }, [slug]);

  if (loading || !product) {
    return (
      <main className="min-h-screen bg-canvas flex flex-col">
        <StoreHeader />
        <div className="mx-auto max-w-[1080px] w-full px-4 py-16 text-center text-sm text-muted">
          {loading ? "Memuat…" : "Produk tidak ditemukan."}
        </div>
        <Footer />
      </main>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const requireLogin = () => {
    if (status !== "authenticated" || !session?.user) {
      toast.info("Login dulu untuk melanjutkan");
      router.push(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireLogin()) return;
    addItem({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      image: product.images[0]?.url ?? "",
      quantity,
      slug: product.slug,
    });
    toast.success(`${quantity} item ditambahkan ke keranjang`);
  };

  const handleBuyNow = () => {
    if (!requireLogin()) return;
    addItem({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      image: product.images[0]?.url ?? "",
      quantity,
      slug: product.slug,
    });
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <div className="mx-auto max-w-[1080px] w-full px-4 py-6 sm:px-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <ChevronRight className="h-3.5 w-3.5 text-hairline" />
          <Link href="/toko" className="hover:text-ink transition-colors">Katalog</Link>
          {product.categorySlug && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-hairline" />
              <Link href={`/toko/${product.categorySlug}`} className="hover:text-ink transition-colors">{product.category}</Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-hairline" />
          <span className="text-muted-soft truncate">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          {/* Left: Images + Description */}
          <div className="space-y-10">
            <div className="space-y-3">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-soft border border-hairline">
                {product.images[selectedImage] ? (
                  <Image src={product.images[selectedImage].url} alt={product.images[selectedImage].alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" priority />
                ) : null}
                {discount > 0 && (
                  <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-on-primary shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
                    -{discount}%
                  </span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button key={img.id} onClick={() => setSelectedImage(i)} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${selectedImage === i ? "border-ink" : "border-hairline hover:border-border-strong"}`}>
                      <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold text-ink uppercase tracking-wider">Deskripsi Produk</h2>
              <div className="text-sm leading-relaxed text-body-text whitespace-pre-line">
                {product.description || "Belum ada deskripsi untuk produk ini."}
              </div>
            </div>
          </div>

          {/* Right: Info + CTA */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <Link href={`/toko/${product.categorySlug}`} className="rounded-full bg-surface-soft px-3 py-1 text-xs font-medium text-ink hover:bg-surface-strong transition-colors">
                  {product.category}
                </Link>
              )}
              <span className="text-sm text-ink font-medium">{product.rating}</span>
              <span className="text-sm text-muted">({product.reviewCount} ulasan)</span>
              <span className="text-sm text-muted">•</span>
              <span className="text-sm text-muted">{product.sold} terjual</span>
            </div>

            <h1 className="text-[22px] font-medium leading-tight text-ink">{product.name}</h1>

            <div className="flex items-end gap-3">
              <p className="text-[21px] font-bold text-ink">{formatRupiah(product.price)}</p>
              {product.originalPrice && (
                <span className="mb-0.5 text-sm text-muted line-through">{formatRupiah(product.originalPrice)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-primary"}`} />
              <span className="text-sm text-muted">{product.stock > 0 ? `Stok tersedia (${product.stock})` : "Stok habis"}</span>
            </div>

            <hr className="border-hairline" />

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Jumlah</label>
              <div className="inline-flex items-center rounded-lg border border-hairline bg-canvas">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center text-muted hover:text-ink transition-colors disabled:opacity-30" disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-ink border-x border-hairline">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="flex h-10 w-10 items-center justify-center text-muted hover:text-ink transition-colors disabled:opacity-30" disabled={quantity >= product.stock}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted">Subtotal: <span className="font-semibold text-ink">{formatRupiah(product.price * quantity)}</span></p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-hairline px-3 py-3">
                <Truck className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-center text-muted leading-tight">Siap dikirim</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-hairline px-3 py-3">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-center text-muted leading-tight">Garansi produk</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-hairline px-3 py-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-[11px] text-center text-muted leading-tight">Respon cepat</span>
              </div>
            </div>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-surface-soft px-3 py-1 text-xs text-muted">#{tag}</span>
                ))}
              </div>
            )}

            <hr className="border-hairline" />

            <div className="space-y-3">
              <button onClick={handleAddToCart} className="w-full rounded-lg border border-ink py-3.5 text-base font-medium text-ink hover:bg-surface-soft transition-colors h-12">
                Tambah ke Keranjang
              </button>
              <button onClick={handleBuyNow} className="w-full rounded-lg bg-primary py-3.5 text-on-primary font-medium text-base hover:bg-primary-active active:bg-primary-active transition-colors h-12">
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Produk Lainnya</h2>
              <Link href={product.categorySlug ? `/toko/${product.categorySlug}` : "/toko"} className="text-sm font-medium text-ink underline underline-offset-2 hover:text-primary transition-colors">
                Lihat Semua
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((rp) => (
                <Link key={rp.id} href={`/toko/produk/${rp.slug}`} className="group overflow-hidden rounded-lg border border-hairline transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
                  <div className="relative aspect-square overflow-hidden bg-surface-soft">
                    {rp.image ? (
                      <Image src={rp.image} alt={rp.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-ink line-clamp-2 leading-snug">{rp.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatRupiah(rp.price)}</p>
                    <p className="mt-1 text-xs text-muted">{rp.rating} · {rp.sold} terjual</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
