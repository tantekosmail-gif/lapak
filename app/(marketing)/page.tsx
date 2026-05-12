import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-24 space-y-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Bikin Toko Online UMKM dalam 5 Menit
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Jualan online lebih mudah. Langsung terhubung ke WhatsApp.
        </p>

        <div>
          <Link
            href="/toko/toko-jaya"
            className="mt-8 rounded-xl bg-black px-6 py-3 text-white"
          >
            Buat Toko Gratis
          </Link>
        </div>
      </section>
    </main>
  );
}
