import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas mt-auto">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Jelajahi</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/toko" className="text-sm text-muted hover:text-ink transition-colors">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-sm text-muted hover:text-ink transition-colors">
                  Semua Kategori
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Akun</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/signin" className="text-sm text-muted hover:text-ink transition-colors">
                  Masuk
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-muted hover:text-ink transition-colors">
                  Daftar
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-muted hover:text-ink transition-colors">
                  Profil
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-muted hover:text-ink transition-colors">
                  Pesanan Saya
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Lapak</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dashboard" className="text-sm text-muted hover:text-ink transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-hairline-soft flex flex-col items-center gap-3 text-center">
          <Link href="/" className="text-lg font-bold text-primary tracking-tight">
            Lapak
          </Link>
          <p className="text-xs text-muted-soft">
            © 2026 Lapak. Platform toko online gratis untuk UMKM Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}