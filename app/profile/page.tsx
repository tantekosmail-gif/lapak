"use client";

import Link from "next/link";
import { User, Mail, Phone, MapPin, Package, Heart, Settings, LogOut, Store, Pencil } from "lucide-react";
import { signOut } from "next-auth/react";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";

const dummyUser = {
  name: "Ahmad Rizki",
  email: "ahmad.rizki@email.com",
  phone: "08123456789",
  address: "Jl. Slamet Riyadi No. 123, Solo, Jawa Tengah",
  avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  totalOrders: 12,
  totalSpent: 5250000,
  joinDate: "Januari 2026",
};

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

const menuItems = [
  { href: "/orders", label: "Pesanan Saya", icon: Package, count: 3 },
  { href: "/wishlist", label: "Wishlist", icon: Heart, count: 5 },
  { href: "/profile/alamat", label: "Alamat Pengiriman", icon: MapPin },
  { href: "/profile/edit", label: "Edit Profil", icon: Settings },
  { href: "/dashboard", label: "Dashboard Toko", icon: Store },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[840px] w-full px-4 sm:px-6 py-8">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Profil</span>
        </nav>

        {/* Profile Card */}
        <div className="rounded-xl border border-hairline p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface-soft border-2 border-hairline">
              <img src={dummyUser.avatar} alt={dummyUser.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-ink">{dummyUser.name}</h1>
              <p className="text-sm text-muted mt-0.5">{dummyUser.email}</p>
              <p className="text-xs text-muted-soft mt-1">Bergabung sejak {dummyUser.joinDate}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-hairline">
            <div className="rounded-lg bg-surface-soft p-4 text-center">
              <p className="text-xl font-bold text-ink">{dummyUser.totalOrders}</p>
              <p className="text-xs text-muted mt-0.5">Total Pesanan</p>
            </div>
            <div className="rounded-lg bg-surface-soft p-4 text-center">
              <p className="text-xl font-bold text-ink">{formatRupiah(dummyUser.totalSpent)}</p>
              <p className="text-xs text-muted mt-0.5">Total Belanja</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-xl border border-hairline p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-ink">Informasi Kontak</h2>
            <Link href="/profile/edit" className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <Pencil className="h-3 w-3" />
              Edit
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted shrink-0" />
              <span className="text-sm text-ink">{dummyUser.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted shrink-0" />
              <span className="text-sm text-ink">{dummyUser.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted shrink-0 mt-0.5" />
              <span className="text-sm text-ink">{dummyUser.address}</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="rounded-xl border border-hairline overflow-hidden">
          {menuItems.map((item, i) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex items-center justify-between px-6 py-4 text-sm font-medium text-ink hover:bg-surface-soft transition-colors ${i < menuItems.length - 1 ? "border-b border-hairline-soft" : ""}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted" />
                {item.label}
              </div>
              {item.count !== undefined && (
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-on-primary">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-hairline py-3.5 text-sm font-medium text-primary hover:bg-surface-soft transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}