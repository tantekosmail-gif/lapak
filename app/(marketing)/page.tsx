import Link from "next/link";
import {
  Store,
  MessageCircle,
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas">
      {/* ─── Top Nav ─── */}
      <header className="h-20 border-b border-hairline bg-canvas">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
            Lapak
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/signin"
              className="text-sm font-medium text-ink hover:text-primary transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors"
            >
              Daftar Gratis
            </Link>
          </nav>
          {/* Mobile nav */}
          <div className="flex sm:hidden items-center gap-3">
            <Link
              href="/signin"
              className="text-sm font-medium text-ink"
            >
              Masuk
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[28px] font-bold leading-[1.43] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Bikin Toko Online UMKM
            <br />
            dalam 5 Menit
          </h1>
          <p className="mt-6 text-base leading-relaxed text-body-text sm:text-lg">
            Jualan online lebih mudah. Langsung terhubung ke WhatsApp.
            <br className="hidden sm:block" />
            Tanpa ribet, tanpa biaya sewa.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-medium text-on-primary hover:bg-primary-active active:bg-primary-active transition-colors h-12"
            >
              Buat Toko Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/toko/toko-batik-nusantara"
              className="flex items-center gap-2 rounded-lg border border-hairline px-8 py-3.5 text-base font-medium text-ink hover:border-ink transition-colors h-12"
            >
              Lihat Contoh Toko
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="border-t border-hairline bg-surface-soft">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-20">
          <h2 className="text-center text-xl font-semibold text-ink sm:text-[22px]">
            Kenapa pilih Lapak?
          </h2>
          <p className="mt-3 text-center text-sm text-muted">
            Semua yang kamu butuhkan untuk mulai jualan online
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Store,
                title: "Toko Online Instan",
                desc: "Buat toko online dengan nama dan URL sendiri dalam hitungan menit. Tampilkan produk dengan foto dan harga.",
              },
              {
                icon: MessageCircle,
                title: "Langsung ke WhatsApp",
                desc: "Pelanggan bisa langsung order via WhatsApp. Tidak perlu aplikasi tambahan atau marketplace yang mahal.",
              },
              {
                icon: ShoppingCart,
                title: "Katalog Produk",
                desc: "Tampilkan semua produk dengan gambar, harga, dan deskripsi. Organisir toko dengan rapi dan profesional.",
              },
              {
                icon: Clock,
                title: "Siap dalam 5 Menit",
                desc: "Daftar, buat toko, tambah produk — semua selesai dalam 5 menit. Tanpa perlu keahlian teknis.",
              },
              {
                icon: Sparkles,
                title: "Desain Menarik",
                desc: "Tampilan toko yang bersih dan profesional. Optimasi untuk HP dan desktop, cepat diakses pelanggan.",
              },
              {
                icon: Shield,
                title: "Gratis Tanpa Biaya",
                desc: "Tidak ada biaya sewa, komisi, atau langganan. Sepenuhnya gratis untuk UMKM Indonesia.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg bg-canvas border border-hairline p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-strong">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-20">
          <h2 className="text-center text-xl font-semibold text-ink sm:text-[22px]">
            Cara Mulai Jualan
          </h2>
          <p className="mt-3 text-center text-sm text-muted">
            3 langkah simpel untuk buka toko online
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Daftar Akun",
                desc: "Buat akun gratis dengan email dan kata sandi. Tidak perlu kartu kredit.",
              },
              {
                step: "2",
                title: "Buat Toko",
                desc: "Pilih nama toko, tambahkan deskripsi dan logo. Langsung dapat URL toko sendiri.",
              },
              {
                step: "3",
                title: "Tambah Produk",
                desc: "Upload foto produk, atur harga dan stok. Bagikan link toko ke pelanggan.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="mt-5 text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-medium text-on-primary hover:bg-primary-active active:bg-primary-active transition-colors h-12"
            >
              Mulai Sekarang — Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-hairline">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <Link href="/" className="text-xl font-bold text-primary">
              Lapak
            </Link>
            <p className="text-xs text-muted">
              © 2026 Lapak. Platform UMKM Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}