"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Phone, Camera, ArrowLeft, Check } from "lucide-react";
import { StoreHeader } from "../../components/Header";
import { Footer } from "../../components/Footer";

const dummyUser = {
  name: "Ahmad Rizki",
  email: "ahmad.rizki@email.com",
  phone: "08123456789",
  avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
};

export default function EditProfilePage() {
  const [name, setName] = useState(dummyUser.name);
  const [email, setEmail] = useState(dummyUser.email);
  const [phone, setPhone] = useState(dummyUser.phone);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
          <span className="text-ink font-medium">Edit Profil</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-ink" />
          </Link>
          <h1 className="text-[22px] font-semibold text-ink">Edit Profil</h1>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600 shrink-0" />
            <p className="text-green-700 text-sm">Profil berhasil diperbarui!</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface-soft border-2 border-hairline">
              <img src={dummyUser.avatar} alt={dummyUser.name} className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-full"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Foto Profil</p>
              <p className="text-xs text-muted mt-0.5">Klik foto untuk mengubah</p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-xl border border-hairline p-6 space-y-5">
            <h2 className="text-base font-semibold text-ink">Informasi Pribadi</h2>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                No. WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-xl border border-hairline p-6 space-y-5">
            <h2 className="text-base font-semibold text-ink">Ubah Kata Sandi</h2>
            <p className="text-xs text-muted -mt-2">Kosongkan jika tidak ingin mengubah kata sandi</p>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Kata Sandi Saat Ini
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi saat ini"
                className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Kata Sandi Baru
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/profile"
              className="flex-1 h-12 rounded-lg border border-hairline text-ink font-medium text-sm flex items-center justify-center hover:bg-surface-soft transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-12 rounded-lg bg-primary text-on-primary font-medium text-sm transition-colors hover:bg-primary-active active:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}