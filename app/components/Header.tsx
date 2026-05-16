"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { useState } from "react";

export function StoreHeader() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary tracking-tight">
          Lapak
        </Link>

        {/* Desktop Nav */}
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
        </nav>

        {/* Right side */}
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
              href="/signin"
              className="text-sm font-medium text-ink hover:text-primary transition-colors px-3 py-2"
            >
              Masuk
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active active:bg-primary-active transition-colors"
            >
              Daftar
            </Link>
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
            <Link
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg bg-primary px-4 py-3 text-sm font-medium text-on-primary text-center"
            >
              Daftar Gratis
            </Link>
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
          Lapak
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
            <Link
              href="/api/auth/signout"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
            >
              <LogOut className="h-5 w-5 text-ink" />
            </Link>
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
            <Link
              href="/api/auth/signout"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-primary hover:bg-surface-soft transition-colors"
            >
              Keluar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}