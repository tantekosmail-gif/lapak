"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { StoreHeader } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { ProductCard } from "@/app/components/ui/card/ProductCard";
import { apiGet } from "@/app/lib/fetch";
import type { ProductCategoryWithProducts } from "@/modules/entities/ProductCategories";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function CollectionDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const [category, setCategory] = useState<ProductCategoryWithProducts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      setLoading(true);
      const res = await apiGet<ProductCategoryWithProducts>(
        `/api/public/product-categories/${slug}`,
      );
      if (res.success) {
        setCategory(res.data);
      } else {
        toast.error(`Gagal memuat kategori: ${res.error.message}`);
      }
      setLoading(false);
    })();
  }, [slug]);

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-8 sm:py-12">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">
            Beranda
          </Link>
          <span className="mx-2">/</span>
          <Link href="/collections" className="hover:text-ink transition-colors">
            Semua Kategori
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">
            {category?.name ?? slug}
          </span>
        </nav>

        <h1 className="uppercase font-bold text-xl mb-2">
          {category?.name ?? slug}
        </h1>
        {category?.description && (
          <p className="text-sm text-muted mb-6">{category.description}</p>
        )}
        <p className="text-sm text-muted mb-8">
          {loading
            ? "Memuat…"
            : `${category?.products.length ?? 0} produk`}
        </p>

        {loading ? (
          <div className="py-16 text-center text-sm text-muted">Memuat…</div>
        ) : !category ? (
          <div className="py-16 text-center text-sm text-muted">
            Kategori tidak ditemukan.
          </div>
        ) : category.products.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">
            Belum ada produk di kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                regular_price={p.regular_price}
                imageUrl={p.imageUrl ?? ""}
                slug={p.slug ?? slugify(p.name)}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
