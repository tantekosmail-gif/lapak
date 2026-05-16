"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

const products = [
  { id: "p1", name: "Batik Tulis Solo Motif Parang Kusuma", price: 450000, stock: 15, sold: 230, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=200", status: "Aktif", slug: "batik-tulis-solo-parang-kusuma" },
  { id: "p2", name: "Batik Cap Pekalongan Motif Mega Mendung", price: 285000, stock: 22, sold: 89, image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=200", status: "Aktif", slug: "batik-cap-pekalongan-mega-mendung" },
  { id: "p3", name: "Batik Tulis Yogyakarta Motif Kawung", price: 520000, stock: 8, sold: 156, image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=200", status: "Aktif", slug: "batik-tulis-yogya-kawung" },
  { id: "p4", name: "Batik Print Modern Motif Geometris", price: 150000, stock: 45, sold: 312, image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=200", status: "Aktif", slug: "batik-print-modern-geometris" },
  { id: "p5", name: "Batik Tulis Madura Motif Pesisir", price: 380000, stock: 0, sold: 67, image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=200", status: "Habis", slug: "batik-tulis-madura-pesisir" },
  { id: "p6", name: "Gelang Batik Kayu Jati", price: 75000, stock: 50, sold: 198, image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=200", status: "Aktif", slug: "gelang-batik-kayu-jati" },
];

export default function DashboardProdukPage() {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-ink">Produk</h1>
          <p className="text-sm text-muted mt-1">{products.length} produk</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors">
          <Plus className="h-4 w-4" /> Tambah Produk
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-soft" />
        <input type="text" placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-11 pl-11 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink transition-colors" />
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
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-hairline-soft last:border-0 hover:bg-surface-soft/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-soft">
                        <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="text-sm font-medium text-ink line-clamp-1 max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-ink">{formatRupiah(p.price)}</td>
                  <td className="px-6 py-3 text-sm text-ink hidden sm:table-cell">{p.stock}</td>
                  <td className="px-6 py-3 text-sm text-muted hidden sm:table-cell">{p.sold}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${p.status === "Aktif" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/toko/produk/${p.slug}`} className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-ink hover:bg-surface-soft transition-colors"><Eye className="h-4 w-4" /></Link>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-ink hover:bg-surface-soft transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-primary hover:bg-surface-soft transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}