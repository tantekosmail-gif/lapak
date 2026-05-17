"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, User, Phone, Home, Building2, Check } from "lucide-react";
import { StoreHeader } from "../../../components/Header";
import { Footer } from "../../../components/Footer";

export default function AddAddressPage() {
  const [label, setLabel] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[640px] w-full px-4 sm:px-6 py-8">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <Link href="/profile" className="hover:text-ink transition-colors">Profil</Link>
          <span className="mx-2">/</span>
          <Link href="/profile/alamat" className="hover:text-ink transition-colors">Alamat</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Tambah</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/profile/alamat"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-ink" />
          </Link>
          <h1 className="text-[22px] font-semibold text-ink">Tambah Alamat Baru</h1>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600 shrink-0" />
            <p className="text-green-700 text-sm">Alamat berhasil ditambahkan!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Label */}
          <div className="rounded-xl border border-hairline p-6 space-y-5">
            <h2 className="text-base font-semibold text-ink">Label Alamat</h2>

            <div>
              <label className="block text-xs font-medium text-muted mb-2 uppercase tracking-wide">
                Jenis Alamat
              </label>
              <div className="flex gap-3">
                {[
                  { value: "Rumah", icon: Home },
                  { value: "Kantor", icon: Building2 },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLabel(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-lg border text-sm font-medium transition-colors ${
                      label === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-hairline text-muted hover:border-ink"
                    }`}
                  >
                    <opt.icon className="h-4 w-4" />
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="rounded-xl border border-hairline p-6 space-y-5">
            <h2 className="text-base font-semibold text-ink">Info Penerima</h2>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Nama Penerima
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Nama lengkap penerima"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                No. WhatsApp Penerima
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="rounded-xl border border-hairline p-6 space-y-5">
            <h2 className="text-base font-semibold text-ink flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Detail Alamat
            </h2>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Alamat Lengkap
              </label>
              <textarea
                rows={3}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                required
                className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                  Kota
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Solo"
                  required
                  className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="57141"
                  required
                  className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Default toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="sr-only peer"
              />
              <div className="h-6 w-11 rounded-full bg-surface-soft peer-checked:bg-primary transition-colors"></div>
              <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></div>
            </div>
            <span className="text-sm text-ink">Jadikan alamat utama</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/profile/alamat"
              className="flex-1 h-12 rounded-lg border border-hairline text-ink font-medium text-sm flex items-center justify-center hover:bg-surface-soft transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-12 rounded-lg bg-primary text-on-primary font-medium text-sm transition-colors hover:bg-primary-active active:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? "Menyimpan..." : "Simpan Alamat"}
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}