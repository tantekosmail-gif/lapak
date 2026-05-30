"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, Tag, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPost, apiPut } from "@/app/lib/fetch";
import type { ProductCategoryWithProducts } from "@/modules/entities/ProductCategories";
import type { UploadResult } from "@/modules/services/UploadService";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function KategoriDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [category, setCategory] = useState<ProductCategoryWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    const res = await apiGet<ProductCategoryWithProducts>(`/api/product-categories/${id}`);
    if (res.success) {
      setCategory(res.data);
    } else {
      toast.error(`Gagal memuat kategori: ${res.error.message}`);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleUpload(file: File) {
    if (!id) return;
    setUploading(true);
    // 1) upload file ke storage publik.
    const form = new FormData();
    form.append("file", file);
    const uploadRes = await apiPost<UploadResult>("/api/upload", form);
    if (!uploadRes.success) {
      setUploading(false);
      toast.error(`Upload gagal: ${uploadRes.error.message}`);
      return;
    }
    // 2) PUT kategori dengan URL gambar baru.
    const putRes = await apiPut<ProductCategoryWithProducts>(
      `/api/product-categories/${id}`,
      { image: uploadRes.data.url },
    );
    setUploading(false);
    if (!putRes.success) {
      toast.error(`Gagal memperbarui kategori: ${putRes.error.message}`);
      return;
    }
    toast.success("Gambar diperbarui");
    void load();
  }

  async function handleDelete() {
    if (!id || !category) return;
    if (category.products.length > 0) {
      toast.error(
        `Tidak dapat menghapus: masih ada ${category.products.length} produk di kategori ini`,
      );
      return;
    }
    if (!confirm(`Hapus kategori "${category.name}"?`)) return;
    setDeleting(true);
    const res = await apiDelete<unknown>(`/api/product-categories/${id}`);
    setDeleting(false);
    if (!res.success) {
      // Server tetap blocking lewat code CATEGORY_HAS_PRODUCTS (defense in depth).
      toast.error(`Gagal menghapus: ${res.error.message}`);
      return;
    }
    toast.success("Kategori dihapus");
    router.push("/dashboard/kategori");
  }

  if (loading) {
    return <div className="text-sm text-muted">Memuat…</div>;
  }
  if (!category) {
    return <div className="text-sm text-muted">Kategori tidak ditemukan.</div>;
  }

  const hasProducts = category.products.length > 0;

  return (
    <div className="max-w-[1100px] space-y-6">
      <Link
        href="/dashboard/kategori"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-ink">{category.name}</h1>
          <p className="text-sm text-muted mt-1">
            Dibuat {new Date(category.createdAt).toLocaleDateString("id-ID")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-4 py-2 text-sm font-medium text-ink hover:bg-surface-soft"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting || hasProducts}
            title={hasProducts ? "Tidak dapat menghapus: kategori masih punya produk" : undefined}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Menghapus…" : "Hapus Kategori"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Image + upload */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-hairline bg-surface-soft">
            {category.image ? (
              <Image src={category.image} alt={category.name} fill sizes="280px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Tag className="h-12 w-12 text-muted-soft" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-hairline bg-canvas px-4 py-2 text-sm font-medium text-ink hover:bg-surface-soft disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Mengunggah…" : "Upload Gambar"}
          </button>
        </div>

        {/* Detail fields */}
        <div className="space-y-4 rounded-xl border border-hairline p-5">
          <Field label="ID">{category.id}</Field>
          <Field label="Nama">{category.name}</Field>
          <Field label="Deskripsi">{category.description || "—"}</Field>
          <Field label="URL Gambar">
            {category.image ? (
              <span className="break-all text-ink">{category.image}</span>
            ) : (
              "—"
            )}
          </Field>
          <Field label="Jumlah Produk">{category.products.length}</Field>
        </div>
      </div>

      {/* Products list */}
      <div className="rounded-xl border border-hairline overflow-hidden">
        <div className="border-b border-hairline bg-surface-soft px-6 py-3">
          <h2 className="text-sm font-semibold text-ink">Produk dalam kategori ini</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline">
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Produk</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Harga</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3 hidden sm:table-cell">Stok</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {category.products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted">
                    Belum ada produk di kategori ini
                  </td>
                </tr>
              )}
              {category.products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-hairline-soft last:border-0 hover:bg-surface-soft/50"
                >
                  <td className="px-6 py-3 text-sm text-ink">{p.name}</td>
                  <td className="px-6 py-3 text-sm text-ink">{formatRupiah(p.price)}</td>
                  <td className="px-6 py-3 text-sm text-ink hidden sm:table-cell">{p.stock}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEdit && (
        <EditCategoryModal
          category={category}
          onClose={() => setShowEdit(false)}
          onUpdated={() => {
            setShowEdit(false);
            void load();
          }}
        />
      )}
    </div>
  );
}

function EditCategoryModal({
  category,
  onClose,
  onUpdated,
}: {
  category: ProductCategoryWithProducts;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }
    setSubmitting(true);
    const res = await apiPut<ProductCategoryWithProducts>(
      `/api/product-categories/${category.id}`,
      {
        name: name.trim(),
        description: description.trim() || undefined,
      },
    );
    setSubmitting(false);
    if (!res.success) {
      toast.error(`Gagal menyimpan: ${res.error.message}`);
      return;
    }
    toast.success("Kategori diperbarui");
    onUpdated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-hairline bg-canvas p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">Edit Kategori</h2>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="text-sm text-ink">{children}</span>
    </div>
  );
}
