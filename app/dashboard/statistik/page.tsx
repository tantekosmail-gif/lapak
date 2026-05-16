import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, Eye } from "lucide-react";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

const monthlyData = [
  { month: "Jan", revenue: 2800000, orders: 32 },
  { month: "Feb", revenue: 3200000, orders: 38 },
  { month: "Mar", revenue: 4100000, orders: 45 },
  { month: "Apr", revenue: 3600000, orders: 41 },
  { month: "Mei", revenue: 4800000, orders: 52 },
];

const topProducts = [
  { name: "Batik Print Modern Motif Geometris", sold: 312, revenue: 46800000 },
  { name: "Batik Tulis Solo Motif Parang Kusuma", sold: 230, revenue: 103500000 },
  { name: "Gelang Batik Kayu Jati", sold: 198, revenue: 14850000 },
  { name: "Batik Tulis Yogyakarta Motif Kawung", sold: 156, revenue: 81120000 },
  { name: "Batik Cap Solo Motif Sogan", sold: 112, revenue: 34720000 },
];

export default function DashboardStatistikPage() {
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="max-w-[1100px]">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink">Statistik</h1>
        <p className="text-sm text-muted mt-1">Analisis penjualan toko Anda</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-hairline p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Pendapatan Bulan Ini</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-ink">{formatRupiah(4800000)}</p>
          <p className="text-xs text-green-600 mt-1">+33% dari bulan lalu</p>
        </div>
        <div className="rounded-xl border border-hairline p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Pesanan Bulan Ini</span>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xl font-bold text-ink">52</p>
          <p className="text-xs text-green-600 mt-1">+27% dari bulan lalu</p>
        </div>
        <div className="rounded-xl border border-hairline p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Rata-rata Nilai Order</span>
            <Package className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xl font-bold text-ink">{formatRupiah(92300)}</p>
          <p className="text-xs text-muted mt-1">Stabil</p>
        </div>
        <div className="rounded-xl border border-hairline p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Pengunjung Bulan Ini</span>
            <Eye className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xl font-bold text-ink">1,234</p>
          <p className="text-xs text-green-600 mt-1">+5% dari bulan lalu</p>
        </div>
      </div>

      {/* Revenue Chart (Simple bar chart) */}
      <div className="rounded-xl border border-hairline p-6 mb-8">
        <h2 className="text-base font-semibold text-ink mb-6">Pendapatan 5 Bulan Terakhir</h2>
        <div className="flex items-end gap-4 h-48">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-ink">{formatRupiah(d.revenue).replace("Rp", "").trim()}</span>
              <div className="w-full bg-primary/20 rounded-t-lg relative" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}>
                <div className="absolute inset-0 bg-primary rounded-t-lg" />
              </div>
              <span className="text-xs text-muted">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-xl border border-hairline">
        <div className="px-6 py-4 border-b border-hairline">
          <h2 className="text-base font-semibold text-ink">Produk Terlaris</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline-soft">
                <th className="text-left text-xs font-medium text-muted px-6 py-3">#</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Produk</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Terjual</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.name} className="border-b border-hairline-soft last:border-0">
                  <td className="px-6 py-3 text-sm font-medium text-muted">{i + 1}</td>
                  <td className="px-6 py-3 text-sm font-medium text-ink">{p.name}</td>
                  <td className="px-6 py-3 text-sm text-muted">{p.sold}</td>
                  <td className="px-6 py-3 text-sm font-medium text-ink">{formatRupiah(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}