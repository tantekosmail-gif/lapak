"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Plus, Search, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/app/lib/fetch";
import type { ProductCategoryEntity } from "@/modules/entities/ProductCategories";

export default function KategoriListPage() {
  const [categories, setCategories] = useState<ProductCategoryEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    const res = await apiGet<ProductCategoryEntity[]>("/api/product-categories", {
      query: { limit: 100 },
    });
    if (res.success) {
      setCategories(res.data);
    } else {
      toast.error(`Gagal memuat kategori: ${res.error.message}`);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [categories, search],
  );

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-ink">Kategori</h1>
          <p className="text-sm text-muted mt-1">{categories.length} kategori</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors"
        >
          <Plus className="h-4 w-4" /> Tambah Kategori
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-soft" />
        <input
          type="text"
          placeholder="Cari kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink transition-colors"
        />
      </div>

      <div className="rounded-xl border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline bg-surface-soft">
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Kategori</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3 hidden sm:table-cell">Deskripsi</th>
                <th className="text-right text-xs font-medium text-muted px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-muted">
                    Memuat…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-muted">
                    Belum ada kategori
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-hairline-soft last:border-0 hover:bg-surface-soft/50 transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-soft">
                        {c.image ? (
                          <Image src={c.image} alt={c.name} fill sizes="40px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Tag className="h-4 w-4 text-muted-soft" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-ink line-clamp-1 max-w-[220px]">
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-muted hidden sm:table-cell">
                    <span className="line-clamp-1 max-w-[420px]">
                      {c.description || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/dashboard/kategori/${c.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-ink hover:bg-surface-soft transition-colors"
                      aria-label={`Lihat ${c.name}`}
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

      {showCreate && (
        <CreateCategoryModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            void load();
          }}
        />
      )}
    </div>
  );
}

function CreateCategoryModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }
    setSubmitting(true);
    const res = await apiPost<ProductCategoryEntity>("/api/product-categories", {
      name: name.trim(),
      description: description.trim() || undefined,
      image: image.trim() || undefined,
    });
    setSubmitting(false);
    if (!res.success) {
      toast.error(`Gagal membuat kategori: ${res.error.message}`);
      return;
    }
    toast.success("Kategori dibuat");
    onCreated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-hairline bg-canvas p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">Tambah Kategori</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-ink hover:bg-surface-soft"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Deskripsi (opsional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">URL Gambar</label>
            <input
              type="text"
              value={image}
              readOnly
              placeholder="URL akan terisi setelah upload (lakukan dari halaman view)"
              className="w-full h-10 px-3 rounded-lg border border-hairline bg-surface-soft text-sm text-muted focus:outline-none cursor-default"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg text-sm font-medium text-muted hover:bg-surface-soft"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 px-5 rounded-lg bg-primary text-sm font-medium text-on-primary hover:bg-primary-active disabled:opacity-50"
            >
              {submitting ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
