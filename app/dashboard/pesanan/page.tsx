import Link from "next/link";
import { Search, Filter } from "lucide-react";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

const orders = [
  { id: "ORD-001", customer: "Ahmad Rizki", date: "16 Mei 2026", items: 1, total: 465000, status: "Diproses" },
  { id: "ORD-002", customer: "Siti Nurhaliza", date: "15 Mei 2026", items: 2, total: 360000, status: "Dikirim" },
  { id: "ORD-003", customer: "Budi Santoso", date: "15 Mei 2026", items: 1, total: 520000, status: "Selesai" },
  { id: "ORD-004", customer: "Dewi Lestari", date: "14 Mei 2026", items: 3, total: 675000, status: "Menunggu" },
  { id: "ORD-005", customer: "Roni Pratama", date: "14 Mei 2026", items: 1, total: 380000, status: "Selesai" },
  { id: "ORD-006", customer: "Maya Sari", date: "13 Mei 2026", items: 2, total: 570000, status: "Dibatalkan" },
  { id: "ORD-007", customer: "Joko Widodo", date: "13 Mei 2026", items: 1, total: 150000, status: "Selesai" },
];

const statusColors: Record<string, string> = {
  "Menunggu": "text-yellow-700 bg-yellow-50",
  "Diproses": "text-blue-700 bg-blue-50",
  "Dikirim": "text-indigo-700 bg-indigo-50",
  "Selesai": "text-green-700 bg-green-50",
  "Dibatalkan": "text-red-700 bg-red-50",
};

export default function DashboardPesananPage() {
  return (
    <div className="max-w-[1100px]">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-ink">Pesanan</h1>
        <p className="text-sm text-muted mt-1">{orders.length} pesanan</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-soft" />
          <input type="text" placeholder="Cari pesanan..." className="w-full h-11 pl-11 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink transition-colors" />
        </div>
        <select className="h-11 px-4 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-ink transition-colors">
          <option>Semua Status</option>
          <option>Menunggu</option>
          <option>Diproses</option>
          <option>Dikirim</option>
          <option>Selesai</option>
          <option>Dibatalkan</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline bg-surface-soft">
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Order ID</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Pelanggan</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3 hidden sm:table-cell">Tanggal</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3 hidden sm:table-cell">Item</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-muted px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-hairline-soft last:border-0 hover:bg-surface-soft/50 transition-colors">
                  <td className="px-6 py-3 text-sm font-mono text-ink">{o.id}</td>
                  <td className="px-6 py-3 text-sm text-ink">{o.customer}</td>
                  <td className="px-6 py-3 text-sm text-muted hidden sm:table-cell">{o.date}</td>
                  <td className="px-6 py-3 text-sm text-muted hidden sm:table-cell">{o.items}</td>
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