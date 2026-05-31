"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, LogOut, Search } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { useState, FormEvent } from "react";
import { signOut, useSession } from "next-auth/react";

export function StoreHeader() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated" && !!session?.user;
  const displayName =
    session?.user?.name?.split(" ")[0] ?? session?.user?.email ?? "Akun";

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/toko?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary tracking-tight shrink-0">
          Nusantara Batik
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 shrink-0">
          <Link
            href="/toko"
            className="text-sm font-medium text-ink hover:text-primary transition-colors"
          >
            Katalog
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium text-ink hover:text-primary transition-colors"
          >
            Kategori
          </Link>
        </nav>

        {/* Search Bar — Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full rounded-lg border border-hairline bg-surface-soft py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Search Toggle */}
          <Link
            href="/toko"
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
            aria-label="Cari"
          >
            <Search className="h-5 w-5 text-ink" />
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-ink" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {isAuthed ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-4 py-2 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
                aria-label={`Akun ${displayName}`}
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{displayName}</span>
              </Link>
            ) : (
              <Link
                href="/signin"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active active:bg-primary-active transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-ink" />
            ) : (
              <Menu className="h-5 w-5 text-ink" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas">
          <div className="mx-auto max-w-[1280px] px-4 pt-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full rounded-lg border border-hairline bg-surface-soft py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </form>
          </div>
          <nav className="mx-auto max-w-[1280px] px-4 py-4 space-y-1">
            <Link
              href="/toko"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Katalog Produk
            </Link>
            <Link
              href="/collections"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Kategori
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Pesanan Saya
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Profil
            </Link>
            <hr className="border-hairline my-2" />
            {isAuthed ? (
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-hairline px-4 py-3 text-sm font-medium text-ink"
              >
                <User className="h-4 w-4" />
                <span className="truncate">{displayName}</span>
              </Link>
            ) : (
              <Link
                href="/signin"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg bg-primary px-4 py-3 text-sm font-medium text-on-primary text-center"
              >
                Masuk dengan Google
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function CustomerHeader() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold text-primary tracking-tight">
          Nusantara Batik
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/toko"
            className="text-sm font-medium text-ink hover:text-primary transition-colors"
          >
            Katalog
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium text-ink hover:text-primary transition-colors"
          >
            Kategori
          </Link>
          <Link
            href="/orders"
            className="text-sm font-medium text-ink hover:text-primary transition-colors"
          >
            Pesanan
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-ink" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
            >
              <User className="h-5 w-5 text-ink" />
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              aria-label="Keluar"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
            >
              <LogOut className="h-5 w-5 text-ink" />
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-ink" />
            ) : (
              <Menu className="h-5 w-5 text-ink" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas">
          <nav className="mx-auto max-w-[1280px] px-4 py-4 space-y-1">
            <Link
              href="/toko"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Katalog Produk
            </Link>
            <Link
              href="/collections"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Kategori
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Pesanan Saya
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Profil
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Keranjang {totalItems > 0 && `(${totalItems})`}
            </Link>
            <hr className="border-hairline my-2" />
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-primary hover:bg-surface-soft transition-colors"
            >
              Keluar
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}