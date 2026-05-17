import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface-soft mt-auto">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-primary tracking-tight">
              Nusantara Batik
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Temukan koleksi batik tulis, batik cap, dan aksesoris batik berkualitas tinggi langsung dari pengrajin terbaik Indonesia. Harga terjangkau, kualitas terjamin.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Mail className="h-4 w-4 shrink-0" />
                <span>halo@nusantarabatik.id</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Jelajahi */}
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
              <li>
                <Link href="/toko?sort=terbaru" className="text-sm text-muted hover:text-ink transition-colors">
                  Produk Terbaru
                </Link>
              </li>
              <li>
                <Link href="/toko?sort=terlaris" className="text-sm text-muted hover:text-ink transition-colors">
                  Produk Terlaris
                </Link>
              </li>
            </ul>
          </div>

          {/* Akun */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Akun</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/signin" className="text-sm text-muted hover:text-ink transition-colors">
                  Masuk
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

          {/* Nusantara Batik */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Nusantara Batik</h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-muted">Tentang Kami</span>
              </li>
              <li>
                <span className="text-sm text-muted">Kebijakan Privasi</span>
              </li>
              <li>
                <span className="text-sm text-muted">Syarat & Ketentuan</span>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted hover:text-ink transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-soft">
            © 2026 Nusantara Batik. Batik premium dari seluruh Nusantara.
          </p>
          <p className="text-xs text-muted-soft">
            nusantarabatik.id
          </p>
        </div>
      </div>
    </footer>
  );
}