"use client";

import { Store, MapPin, Phone, Globe, Save } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPengaturanPage() {
  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan");
  };

  return (
    <div className="max-w-[800px]">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink">Pengaturan Toko</h1>
        <p className="text-sm text-muted mt-1">Kelola informasi dan pengaturan toko Anda</p>
      </div>

      <div className="space-y-6">
        {/* Store Info */}
        <div className="rounded-xl border border-hairline p-6 space-y-5">
          <h2 className="text-base font-semibold text-ink flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" />
            Informasi Toko
          </h2>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Nama Toko</label>
            <input type="text" defaultValue="Toko Batik Nusantara" className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink focus:border-2 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Deskripsi Toko</label>
            <textarea rows={3} defaultValue="Toko batik premium dengan koleksi terlengkap dari seluruh Nusantara. Menyediakan batik tulis, batik cap, dan aksesoris batik berkualitas." className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink focus:border-2 transition-colors resize-none" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">No. WhatsApp</label>
              <input type="tel" defaultValue="6281234567890" className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink focus:border-2 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
              <input type="email" defaultValue="toko@batiknusantara.com" className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink focus:border-2 transition-colors" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-xl border border-hairline p-6 space-y-5">
          <h2 className="text-base font-semibold text-ink flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Alamat Toko
          </h2>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Alamat Lengkap</label>
            <textarea rows={2} defaultValue="Jl. Slamet Riyadi No. 123, Laweyan, Solo, Jawa Tengah 57141" className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink focus:border-2 transition-colors resize-none" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Kota</label>
              <input type="text" defaultValue="Solo" className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink focus:border-2 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Provinsi</label>
              <input type="text" defaultValue="Jawa Tengah" className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink focus:border-2 transition-colors" />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="rounded-xl border border-hairline p-6 space-y-5">
          <h2 className="text-base font-semibold text-ink flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Media Sosial
          </h2>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Instagram</label>
            <input type="text" defaultValue="@batiknusantara" className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink focus:border-2 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Website</label>
            <input type="text" defaultValue="https://batiknusantara.com" className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink focus:border-2 transition-colors" />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors">
            <Save className="h-4 w-4" />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}