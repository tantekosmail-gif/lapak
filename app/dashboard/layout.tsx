"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/produk", label: "Produk", icon: Package },
  { href: "/dashboard/pesanan", label: "Pesanan", icon: ShoppingCart },
  { href: "/dashboard/statistik", label: "Statistik", icon: BarChart3 },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-soft transition-colors">
              {mobileOpen ? <X className="h-5 w-5 text-ink" /> : <Menu className="h-5 w-5 text-ink" />}
            </button>
            <Link href="/" className="text-lg font-bold text-primary tracking-tight">Lapak</Link>
            <span className="hidden sm:inline text-sm text-muted">/ Dashboard</span>
          </div>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke Toko</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 border-r border-hairline bg-canvas transform transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0 pt-14" : "-translate-x-full"}`}>
          <div className="p-4 border-b border-hairline">
            <h2 className="text-sm font-semibold text-ink">Dashboard Toko</h2>
            <p className="text-xs text-muted mt-0.5">Toko Batik Nusantara</p>
          </div>
          <nav className="p-3 space-y-0.5">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-surface-soft text-ink"
                      : "text-muted hover:text-ink hover:bg-surface-soft"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {mobileOpen && <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}