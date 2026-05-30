"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "@/app/lib/fetch";
import type { ProductEntity } from "@/modules/entities/Product";

const LIMIT_OPTIONS = [10, 20, 50, 100] as const;

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function ProdukListPage() {
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<(typeof LIMIT_OPTIONS)[number]>(10);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<ProductEntity[]>("/api/public/products", {
      query: { page, limit, search, sort: "-createdAt" },
    });
    if (res.success) {
      setProducts(res.data);
    } else {
      toast.error(`Gagal memuat produk: ${res.error.message}`);
    }
    setLoading(false);
  }, [page, limit, search]);

  useEffect(() => {
    void load();
  }, [load]);

  // Pagination: tidak ada total count dari API, jadi kita simpulkan dari panjang
  // hasil — kalau hasil < limit, tidak ada halaman berikutnya.
  const hasNext = products.length === limit;
  const hasPrev = page > 1;

  // Tampilan butuh `regular_price` (kolom DB tipe `number` non-nullable).
  const rows = useMemo(() => products, [products]);

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-ink">Produk</h1>
          <p className="text-sm text-muted mt-1">
            Halaman {page} · menampilkan {products.length} item
          </p>
        </div>
        <Link
          href="/dashboard/produk/create"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors"
        >
          <Plus className="h-4 w-4" /> Tambah Produk
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-soft" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 pl-11 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          Per halaman
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value) as (typeof LIMIT_OPTIONS)[number]);
              setPage(1);
            }}
            className="h-11 px-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink"
          >
            {LIMIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline bg-surface-soft">
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Produk</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Harga</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3 hidden sm:table-cell">Stok</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3 hidden sm:table-cell">Terjual</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted">
                    Memuat…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted">
                    Belum ada produk
                  </td>
                </tr>
              )}
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-hairline-soft last:border-0 hover:bg-surface-soft/50 transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-soft">
                        <Image
                          src={p.imageUrl || "/placeholder.png"}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-ink line-clamp-1 max-w-[220px]">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-ink">
                    <div className="flex flex-col">
                      <span>{formatRupiah(p.price)}</span>
                      {p.regular_price > p.price && (
                        <span className="text-xs text-muted line-through">
                          {formatRupiah(p.regular_price)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-ink hidden sm:table-cell">{p.stock}</td>
                  <td className="px-6 py-3 text-sm text-muted hidden sm:table-cell">{p.sold}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        p.status === "AKTIF"
                          ? "text-green-700 bg-green-50"
                          : "text-red-700 bg-red-50"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/dashboard/produk/${p.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-ink hover:bg-surface-soft transition-colors"
                      aria-label={`Lihat ${p.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
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
    </div>
  );
}
