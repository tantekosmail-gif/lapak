"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus, Pencil, Trash2, Check, Home, Building2 } from "lucide-react";
import { StoreHeader } from "../../components/Header";
import { Footer } from "../../components/Footer";

interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

const dummyAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Rumah",
    recipient: "Ahmad Rizki",
    phone: "08123456789",
    fullAddress: "Jl. Slamet Riyadi No. 123, Laweyan, Solo, Jawa Tengah",
    city: "Solo",
    postalCode: "57141",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Kantor",
    recipient: "Ahmad Rizki",
    phone: "08123456789",
    fullAddress: "Jl. Jend. Sudirman No. 45, Senayan, Jakarta Selatan, DKI Jakarta",
    city: "Jakarta Selatan",
    postalCode: "12190",
    isDefault: false,
  },
  {
    id: "addr-3",
    label: "Rumah Orang Tua",
    recipient: "Haji Budi",
    phone: "08129876543",
    fullAddress: "Jl. Diponegoro No. 78, Kartasura, Sukoharjo, Jawa Tengah",
    city: "Sukoharjo",
    postalCode: "57161",
    isDefault: false,
  },
];

export default function AddressListPage() {
  const [addresses, setAddresses] = useState<Address[]>(dummyAddresses);

  const setDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[840px] w-full px-4 sm:px-6 py-8">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <Link href="/profile" className="hover:text-ink transition-colors">Profil</Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Alamat</span>
        </nav>

        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-ink" />
            </Link>
            <div>
              <h1 className="text-[22px] font-semibold text-ink">Alamat Pengiriman</h1>
              <p className="text-sm text-muted mt-0.5">{addresses.length} alamat tersimpan</p>
            </div>
          </div>
          <Link
            href="/profile/alamat/tambah"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah</span>
          </Link>
        </div>

        {addresses.length === 0 ? (
          <div className="py-20 text-center">
            <MapPin className="mx-auto h-16 w-16 text-hairline" />
            <p className="mt-4 text-base font-medium text-ink">Belum ada alamat</p>
            <p className="mt-1 text-sm text-muted mb-6">Tambahkan alamat pengiriman untuk memudahkan checkout</p>
            <Link
              href="/profile/alamat/tambah"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary hover:bg-primary-active transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Alamat
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`rounded-xl border p-5 transition-colors ${
                  addr.isDefault ? "border-primary bg-primary/5" : "border-hairline bg-canvas"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-soft px-2.5 py-0.5 text-xs font-medium text-ink">
                        {addr.label === "Rumah" ? (
                          <Home className="h-3 w-3" />
                        ) : (
                          <Building2 className="h-3 w-3" />
                        )}
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          <Check className="h-3 w-3" />
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-ink mt-2">{addr.recipient}</p>
                    <p className="text-sm text-muted mt-0.5">{addr.phone}</p>
                    <p className="text-sm text-body-text mt-2 leading-relaxed">{addr.fullAddress}</p>
                    <p className="text-xs text-muted mt-1">{addr.city}, {addr.postalCode}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/profile/alamat/edit/${addr.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4 text-muted" />
                    </Link>
                    {!addr.isDefault && (
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
                        aria-label="Hapus"
                      >
                        <Trash2 className="h-4 w-4 text-muted hover:text-primary" />
                      </button>
                    )}
                  </div>
                </div>

                {!addr.isDefault && (
                  <div className="mt-4 pt-4 border-t border-hairline-soft">
                    <button
                      onClick={() => setDefault(addr.id)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Jadikan Alamat Utama
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}