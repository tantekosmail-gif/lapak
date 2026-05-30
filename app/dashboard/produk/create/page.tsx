"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/app/lib/fetch";
import type { ProductCategoryEntity } from "@/modules/entities/ProductCategories";
import type { ProductEntity } from "@/modules/entities/Product";
import type { UploadResult } from "@/modules/services/UploadService";

type CategoryMode = "existing" | "new";

export default function ProdukCreatePage() {
  const router = useRouter();

  // Product fields.
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [sold, setSold] = useState("0");
  const [status, setStatus] = useState<"AKTIF" | "HABIS" | "NONAKTIF">("AKTIF");
  const [imageUrl, setImageUrl] = useState("");

  // Image upload.
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category selection (existing vs new).
  const [categoryMode, setCategoryMode] = useState<CategoryMode>("existing");
  const [categories, setCategories] = useState<ProductCategoryEntity[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await apiGet<ProductCategoryEntity[]>("/api/product-categories", {
        query: { limit: 100 },
      });
      if (res.success) setCategories(res.data);
    })();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await apiPost<UploadResult>("/api/upload", form);
    setUploading(false);
    if (!res.success) {
      toast.error(`Upload gagal: ${res.error.message}`);
      return;
    }
    setImageUrl(res.data.url);
    toast.success("Gambar terunggah");
  }

  function validate(): string | null {
    if (!name.trim()) return "Nama produk wajib diisi";
    if (!price || Number(price) < 0) return "Harga jual wajib diisi";
    if (!regularPrice || Number(regularPrice) < 0) return "Harga normal wajib diisi";
    if (categoryMode === "existing" && !categoryId) return "Pilih kategori atau buat baru";
    if (categoryMode === "new" && !newCategoryName.trim()) return "Nama kategori baru wajib diisi";
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);

    const productPayload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      price: Number(price),
      regular_price: Number(regularPrice),
      stock: Number(stock),
      sold: Number(sold),
      status,
      imageUrl: imageUrl.trim() || undefined,
    };

    let result;
    if (categoryMode === "new") {
      // POST /api/products/saveAll -> buat kategori baru + produk dalam transaksi.
      result = await apiPost<ProductEntity>("/api/products/saveAll", {
        category: {
          name: newCategoryName.trim(),
          image: newCategoryImage.trim() || undefined,
        },
        product: productPayload,
      });
    } else {
      // POST /api/products/save -> hubungkan ke kategori existing.
      result = await apiPost<ProductEntity>("/api/products/save", {
        ...productPayload,
        categoryId: Number(categoryId),
      });
    }

    setSubmitting(false);
    if (!result.success) {
      toast.error(`Gagal membuat produk: ${result.error.message}`);
      return;
    }
    toast.success("Produk dibuat");
    router.push(`/dashboard/produk/${result.data.id}`);
  }

  return (
    <div className="max-w-[760px] space-y-6">
      <Link
        href="/dashboard/produk"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div>
        <h1 className="text-[22px] font-semibold text-ink">Tambah Produk</h1>
        <p className="text-sm text-muted mt-1">
          Hubungkan ke kategori yang ada atau buat kategori baru sekaligus.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Image preview + upload */}
        <div className="rounded-xl border border-hairline p-5">
          <h2 className="text-sm font-semibold text-ink mb-3">Gambar Produk</h2>
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-hairline bg-surface-soft">
              {imageUrl ? (
                <Image src={imageUrl} alt="preview" fill sizes="96px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-8 w-8 text-muted-soft" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
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
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-4 py-2 text-sm font-medium text-ink hover:bg-surface-soft disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Mengunggah…" : "Upload Gambar"}
              </button>
              <input
                type="text"
                value={imageUrl}
                readOnly
                placeholder="URL terisi otomatis setelah upload"
                className="w-full h-10 px-3 rounded-lg border border-hairline bg-surface-soft text-sm text-muted focus:outline-none cursor-default"
              />
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="rounded-xl border border-hairline p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink">Detail Produk</h2>
          <Text label="Nama" value={name} onChange={setName} required />
          <Text label="Slug (opsional)" value={slug} onChange={setSlug} placeholder="auto dari nama" />
          <div className="grid grid-cols-2 gap-3">
            <Num label="Harga Jual" value={price} onChange={setPrice} required />
            <Num label="Harga Normal" value={regularPrice} onChange={setRegularPrice} required />
            <Num label="Stok" value={stock} onChange={setStock} />
            <Num label="Terjual" value={sold} onChange={setSold} />
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
        </div>

        {/* Category selection */}
        <div className="rounded-xl border border-hairline p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink">Kategori</h2>
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={categoryMode === "existing"}
                onChange={() => setCategoryMode("existing")}
              />
              Pilih kategori yang ada
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={categoryMode === "new"}
                onChange={() => setCategoryMode("new")}
              />
              Buat kategori baru
            </label>
          </div>

          {categoryMode === "existing" ? (
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-ink"
              >
                <option value="">— Pilih kategori —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <Text label="Nama Kategori Baru" value={newCategoryName} onChange={setNewCategoryName} required />
              <Text label="URL Gambar Kategori (opsional)" value={newCategoryImage} onChange={setNewCategoryImage} placeholder="https://…" />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Link
            href="/dashboard/produk"
            className="h-10 inline-flex items-center px-4 rounded-lg text-sm font-medium text-muted hover:bg-surface-soft"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="h-10 px-5 rounded-lg bg-primary text-sm font-medium text-on-primary hover:bg-primary-active disabled:opacity-50"
          >
            {submitting ? "Menyimpan…" : "Simpan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Text({
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

function Num({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-10 px-3 rounded-lg border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-ink"
      />
    </div>
  );
}
