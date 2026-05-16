import Link from "next/link";
import { Package, ShoppingCart, DollarSign, Eye, TrendingUp, Plus } from "lucide-react";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

const stats = [
  { label: "Total Produk", value: "24", icon: Package, change: "+2 bulan ini" },
  { label: "Total Pesanan", value: "156", icon: ShoppingCart, change: "+12 minggu ini" },
  { label: "Pendapatan", value: formatRupiah(12500000), icon: DollarSign, change: "+18% dari bulan lalu" },
  { label: "Pengunjung", value: "1,234", icon: Eye, change: "+5% dari bulan lalu" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Ahmad Rizki", date: "16 Mei 2026", total: 450000, status: "Diproses" },
  { id: "ORD-002", customer: "Siti Nurhaliza", date: "15 Mei 2026", total: 285000, status: "Dikirim" },
  { id: "ORD-003", customer: "Budi Santoso", date: "15 Mei 2026", total: 520000, status: "Selesai" },
  { id: "ORD-004", customer: "Dewi Lestari", date: "14 Mei 2026", total: 150000, status: "Menunggu" },
  { id: "ORD-005", customer: "Roni Pratama", date: "14 Mei 2026", total: 380000, status: "Selesai" },
];

const statusColors: Record<string, string> = {
  "Diproses": "text-blue-700 bg-blue-50",
  "Dikirim": "text-indigo-700 bg-indigo-50",
  "Selesai": "text-green-700 bg-green-50",
  "Menunggu": "text-yellow-700 bg-yellow-50",
};

export default function DashboardPage() {
  return (
    <div className="max-w-[1100px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-ink">Dashboard Overview</h1>
          <p className="text-sm text-muted mt-1">Selamat datang di Dashboard Toko Batik Nusantara</p>
        </div>
        <Link href="/dashboard/produk" className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors">
          <Plus className="h-4 w-4" /> Tambah Produk
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-hairline p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-soft">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-ink">{stat.value}</p>
            <p className="text-xs text-muted-soft mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-hairline">
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
          <h2 className="text-base font-semibold text-ink">Pesanan Terbaru</h2>
          <Link href="/dashboard/pesanan" className="text-sm font-medium text-primary hover:underline">Lihat Semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline-soft">
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Order ID</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Pelanggan</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3 hidden sm:table-cell">Tanggal</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-hairline-soft last:border-0">
                  <td className="px-6 py-3 text-sm font-mono text-ink">{o.id}</td>
                  <td className="px-6 py-3 text-sm text-ink">{o.customer}</td>
                  <td className="px-6 py-3 text-sm text-muted hidden sm:table-cell">{o.date}</td>
                  <td className="px-6 py-3 text-sm font-medium text-ink">{formatRupiah(o.total)}</td>
                  <td className="px-6 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColors[o.status] || ""}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}