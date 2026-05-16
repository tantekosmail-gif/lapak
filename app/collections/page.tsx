import Link from "next/link";
import Image from "next/image";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";

const categories = [
  {
    id: "batik-tulis",
    name: "Batik Tulis",
    slug: "batik-tulis",
    description: "Koleksi batik tulis premium buatan tangan pengrajin lokal.",
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600",
    productCount: 24,
  },
  {
    id: "batik-cap",
    name: "Batik Cap",
    slug: "batik-cap",
    description: "Batik cap berkualitas dengan motif tradisional Nusantara.",
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600",
    productCount: 18,
  },
  {
    id: "batik-print",
    name: "Batik Print",
    slug: "batik-print",
    description: "Batik print modern dengan harga terjangkau.",
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=600",
    productCount: 32,
  },
  {
    id: "aksesoris",
    name: "Aksesoris",
    slug: "aksesoris",
    description: "Aksesoris batik dan kerajinan tangan lokal.",
    image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=600",
    productCount: 15,
  },
  {
    id: "pakaian",
    name: "Pakaian",
    slug: "pakaian",
    description: "Pakaian batik untuk pria dan wanita.",
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=600",
    productCount: 20,
  },
  {
    id: "souvenir",
    name: "Souvenir",
    slug: "souvenir",
    description: "Souvenir batik untuk hadiah dan cenderamata.",
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600",
    productCount: 12,
  },
];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <section className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">
            Beranda
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink font-medium">Semua Kategori</span>
        </nav>

        <h1 className="text-[22px] font-semibold text-ink mb-2">
          Semua Kategori
        </h1>
        <p className="text-sm text-muted mb-8">
          Jelajahi produk berdasarkan kategori
        </p>

        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/toko/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl border border-hairline transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            >
              <div className="relative aspect-[4/3] bg-surface-soft overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <h2 className="text-base font-semibold text-ink">
                  {cat.name}
                </h2>
                <p className="mt-1 text-xs text-muted line-clamp-2">
                  {cat.description}
                </p>
                <p className="mt-2 text-xs text-muted-soft">
                  {cat.productCount} produk
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}