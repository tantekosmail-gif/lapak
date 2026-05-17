"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div>
      {sent ? (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 mb-5">
            <Check className="h-7 w-7 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-ink mb-2">Email Terkirim!</h2>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Kami telah mengirimkan link reset kata sandi ke{" "}
            <span className="font-medium text-ink">{email}</span>. Silakan cek inbox Anda.
          </p>
          <Link
            href="/signin"
            className="inline-flex w-full h-12 items-center justify-center rounded-lg bg-primary text-on-primary font-medium text-sm hover:bg-primary-active transition-colors"
          >
            Kembali ke Halaman Masuk
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-ink mb-1">Lupa Kata Sandi?</h2>
          <p className="text-muted text-sm mb-8 leading-relaxed">
            Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mengatur ulang kata sandi Anda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full h-14 pl-10 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-base placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 focus:ring-0 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg bg-primary text-on-primary font-medium text-base transition-colors hover:bg-primary-active active:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}