"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { toast } from "sonner";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";
import { apiGet } from "@/app/lib/fetch";
import type { ProductCategoryListItem } from "@/modules/entities/ProductCategories";

const LIMIT_OPTIONS = [6, 12, 24] as const;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function CollectionsPage() {
  const [categories, setCategories] = useState<ProductCategoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<(typeof LIMIT_OPTIONS)[number]>(12);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<ProductCategoryListItem[]>(
      "/api/public/product-categories",
      { query: { page, limit, sort: "createdAt" } },
    );
    if (res.success) {
      setCategories(res.data);
    } else {
      toast.error(`Gagal memuat kategori: ${res.error.message}`);
    }
    setLoading(false);
  }, [page, limit]);

  useEffect(() => {
    void load();
  }, [load]);

  // Tanpa total count dari API, gunakan heuristik panjang hasil untuk Next.
  const hasNext = categories.length === limit;
  const hasPrev = page > 1;

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">
            Beranda
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Semua Kategori</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[22px] font-semibold text-ink mb-2">
              Semua Kategori
            </h1>
            <p className="text-sm text-muted">
              Jelajahi produk berdasarkan kategori
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            Per halaman
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value) as (typeof LIMIT_OPTIONS)[number]);
                setPage(1);
              }}
              className="h-10 px-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink"
            >
              {LIMIT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-muted">Memuat…</div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">
            Belum ada kategori
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/toko/${slugify(cat.name)}`}
                className="group relative overflow-hidden rounded-xl border border-hairline transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/3] bg-surface-soft overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Tag className="h-10 w-10 text-muted-soft" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <h2 className="text-base font-semibold text-ink">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="mt-1 text-xs text-muted line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-soft">
                    {cat._count?.products ?? 0} produk
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <span className="text-sm text-muted">Halaman {page}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrev || loading}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-hairline bg-canvas px-3 text-sm text-ink hover:bg-surface-soft disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" /> Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext || loading}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-hairline bg-canvas px-3 text-sm text-ink hover:bg-surface-soft disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
