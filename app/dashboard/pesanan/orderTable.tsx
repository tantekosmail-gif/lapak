"use client";

import { Search } from "lucide-react";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatTanggal(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

const statusColors: Record<string, string> = {
  MENUNGGU: "text-yellow-700 bg-yellow-50",
  DIPROSES: "text-blue-700 bg-blue-50",
  DIKIRIM: "text-indigo-700 bg-indigo-50",
  SELESAI: "text-green-700 bg-green-50",
  DIBATALKAN: "text-red-700 bg-red-50",
};

const statusLabels: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DIPROSES: "Diproses",
  DIKIRIM: "Dikirim",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

export default function OrderTable({ orders }: { orders: any[] }) {
  function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

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

          <input
            type="text"
            placeholder="Cari pesanan..."
            className="w-full h-11 pl-11 pr-4 rounded-lg border border-hairline bg-canvas text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-ink transition-colors"
          />
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
                <th className="text-left text-xs font-medium text-muted px-6 py-3">
                  Order ID
                </th>

                <th className="text-left text-xs font-medium text-muted px-6 py-3">
                  Pelanggan
                </th>

                <th className="text-left text-xs font-medium text-muted px-6 py-3 hidden sm:table-cell">
                  Tanggal
                </th>

                <th className="text-left text-xs font-medium text-muted px-6 py-3 hidden sm:table-cell">
                  Item
                </th>

                <th className="text-left text-xs font-medium text-muted px-6 py-3">
                  Total
                </th>

                <th className="text-left text-xs font-medium text-muted px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-hairline-soft last:border-0 hover:bg-surface-soft/50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm font-mono text-ink">
                    {o.orderNumber}
                  </td>

                  <td className="px-6 py-3 text-sm text-ink">{o.customer}</td>

                  <td className="px-6 py-3 text-sm text-muted hidden sm:table-cell">
                    {formatTanggal(o.createdAt)}
                  </td>

                  <td className="px-6 py-3 text-sm text-muted hidden sm:table-cell">
                    {o.items.length}
                  </td>

                  <td className="px-6 py-3 text-sm font-medium text-ink">
                    {formatRupiah(o.total)}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        statusColors[o.status]
                      }`}
                    >
                      {statusLabels[o.status]}
                    </span>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-muted"
                  >
                    Belum ada pesanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
