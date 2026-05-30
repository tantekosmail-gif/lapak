"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, Pencil, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPost, apiPut } from "@/app/lib/fetch";
import type { ProductWithCategory } from "@/modules/entities/Product";
import type { ProductCategoryEntity } from "@/modules/entities/ProductCategories";
import type { UploadResult } from "@/modules/services/UploadService";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function ProdukDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    const res = await apiGet<ProductWithCategory>(`/api/public/products/${id}`);
    if (res.success) {
      setProduct(res.data);
    } else {
      toast.error(`Gagal memuat produk: ${res.error.message}`);
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
    // Upload → URL → PUT update product imageUrl.
    const form = new FormData();
    form.append("file", file);
    const uploadRes = await apiPost<UploadResult>("/api/upload", form);
    if (!uploadRes.success) {
      setUploading(false);
      toast.error(`Upload gagal: ${uploadRes.error.message}`);
      return;
    }
    const putRes = await apiPut<ProductWithCategory>(
      `/api/products/${id}/update`,
      { imageUrl: uploadRes.data.url },
    );
    setUploading(false);
    if (!putRes.success) {
      toast.error(`Gagal memperbarui gambar: ${putRes.error.message}`);
      return;
    }
    toast.success("Gambar diperbarui");
    void load();
  }

  async function handleDelete() {
    if (!id || !product) return;
    if (!confirm(`Hapus produk "${product.name}"?`)) return;
    setDeleting(true);
    const res = await apiDelete<unknown>(`/api/products/${id}/delete`);
    setDeleting(false);
    if (!res.success) {
      toast.error(`Gagal menghapus: ${res.error.message}`);
      return;
    }
    toast.success("Produk dihapus");
    router.push("/dashboard/produk");
  }

  if (loading) return <div className="text-sm text-muted">Memuat…</div>;
  if (!product) return <div className="text-sm text-muted">Produk tidak ditemukan.</div>;

  return (
    <div className="max-w-[1100px] space-y-6">
      <Link
        href="/dashboard/produk"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-ink">{product.name}</h1>
          <p className="text-sm text-muted mt-1">
            Dibuat {new Date(product.createdAt).toLocaleDateString("id-ID")} ·
            diperbarui {new Date(product.updatedAt).toLocaleDateString("id-ID")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-4 py-2 text-sm font-medium text-ink hover:bg-surface-soft"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Menghapus…" : "Hapus"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-hairline bg-surface-soft">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill sizes="280px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-12 w-12 text-muted-soft" />
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

        <div className="space-y-4 rounded-xl border border-hairline p-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="ID">{product.id}</Field>
            <Field label="Slug">{product.slug}</Field>
            <Field label="Harga Jual">{formatRupiah(product.price)}</Field>
            <Field label="Harga Normal">{formatRupiah(product.regular_price)}</Field>
            <Field label="Stok">{product.stock}</Field>
            <Field label="Terjual">{product.sold}</Field>
            <Field label="Status">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  product.status === "AKTIF"
                    ? "text-green-700 bg-green-50"
                    : "text-red-700 bg-red-50"
                }`}
              >
                {product.status}
              </span>
            </Field>
            <Field label="Kategori">{product.category?.name ?? "—"}</Field>
          </div>
          <Field label="URL Gambar">
            {product.imageUrl ? (
              <span className="break-all text-ink">{product.imageUrl}</span>
            ) : (
              "—"
            )}
          </Field>
        </div>
      </div>

      {showEdit && (
        <EditProductModal
          product={product}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="text-sm text-ink">{children}</span>
    </div>
  );
}

function EditProductModal({
  product,
  onClose,
  onUpdated,
}: {
  product: ProductWithCategory;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [price, setPrice] = useState(String(product.price));
  const [regularPrice, setRegularPrice] = useState(String(product.regular_price));
  const [stock, setStock] = useState(String(product.stock));
  const [sold, setSold] = useState(String(product.sold));
  const [status, setStatus] = useState<"AKTIF" | "HABIS" | "NONAKTIF">(product.status);
  const [categoryId, setCategoryId] = useState<string>(
    product.categoryId ? String(product.categoryId) : "",
  );
  const [categories, setCategories] = useState<ProductCategoryEntity[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await apiGet<ProductCategoryEntity[]>("/api/product-categories", {
        query: { limit: 100 },
      });
      if (res.success) setCategories(res.data);
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }
    setSubmitting(true);
    const res = await apiPut<ProductWithCategory>(`/api/products/${product.id}/update`, {
      name: name.trim(),
      slug: slug.trim() || undefined,
      price: Number(price),
      regular_price: Number(regularPrice),
      stock: Number(stock),
      sold: Number(sold),
      status,
      categoryId: categoryId ? Number(categoryId) : undefined,
    });
    setSubmitting(false);
    if (!res.success) {
      toast.error(`Gagal menyimpan: ${res.error.message}`);
      return;
    }
    toast.success("Produk diperbarui");
    onUpdated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-hairline bg-canvas p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">Edit Produk</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-ink hover:bg-surface-soft"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <TextField label="Nama" value={name} onChange={setName} required />
          <TextField label="Slug" value={slug} onChange={setSlug} placeholder="Auto dari nama jika kosong" />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Harga Jual" value={price} onChange={setPrice} />
            <NumberField label="Harga Normal" value={regularPrice} onChange={setRegularPrice} />
            <NumberField label="Stok" value={stock} onChange={setStock} />
            <NumberField label="Terjual" value={sold} onChange={setSold} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-ink"
            >
              <option value="AKTIF">AKTIF</option>
              <option value="HABIS">HABIS</option>
              <option value="NONAKTIF">NONAKTIF</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-ink"
            >
              <option value="">— Tanpa kategori —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
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

function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-ink"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-ink"
      />
    </div>
  );
}
