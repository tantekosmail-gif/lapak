"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Tag } from "lucide-react";
import { StoreHeader } from "../components/Header";
import { Footer } from "../components/Footer";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

const dummyPosts: BlogPost[] = [
  {
    slug: "sejarah-batik-indonesia-warisan-budaya",
    title: "Sejarah Batik Indonesia: Warisan Budaya yang Mendunia",
    excerpt: "Batik merupakan salah satu warisan budaya Indonesia yang telah diakui oleh UNESCO sebagai Masterpiece of Oral and Intangible Heritage of Humanity sejak 2 Oktober 2009. Seni menghias kain ini memiliki sejarah panjang yang mencerminkan kekayaan budaya Nusantara.",
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Budaya",
    author: "Dr. Sari Dewi",
    date: "15 Mei 2026",
    readTime: "8 menit",
  },
  {
    slug: "memilih-batik-berkualitas-tips-dan-trik",
    title: "Tips Memilih Batik Berkualitas: Panduan Lengkap untuk Pemula",
    excerpt: "Memilih batik yang berkualitas membutuhkan pengetahuan khusus. Dari jenis kain, teknik pembuatan, hingga kualitas pewarna, ada banyak faktor yang perlu diperhatikan agar Anda mendapatkan batik terbaik.",
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Panduan",
    author: "Ahmad Rizki",
    date: "12 Mei 2026",
    readTime: "6 menit",
  },
  {
    slug: "perawatan-batik-agar-tahan-lama",
    title: "Cara Merawat Batik Agar Tetap Indah dan Tahan Lama",
    excerpt: "Batik tulis dan batik cap memerlukan perawatan khusus agar warna tetap cerah dan kain tidak mudah rusak. Simak tips perawatan batik yang benar agar koleksi Anda awet bertahun-tahun.",
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Tips & Trik",
    author: "Bu Ratna",
    date: "8 Mei 2026",
    readTime: "5 menit",
  },
  {
    slug: "motif-batik-dan-filosofinya",
    title: "Mengenal Motif Batik dan Filosofi di Baliknya",
    excerpt: "Setiap motif batik memiliki makna dan filosofi mendalam yang mencerminkan kehidupan masyarakat Indonesia. Dari motif Parang yang melambangkan keberanian hingga Kawung yang melambangkan harapan.",
    image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Budaya",
    author: "Dr. Sari Dewi",
    date: "3 Mei 2026",
    readTime: "7 menit",
  },
  {
    slug: "batik-modern-tren-fashion-2026",
    title: "Tren Batik Modern 2026: Perpaduan Tradisi dan Kontemporer",
    excerpt: "Batik kini tidak hanya dikenakan untuk acara formal. Desainer-desainer muda Indonesia berhasil memadukan motif batik klasik dengan gaya modern yang cocok untuk sehari-hari.",
    image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fashion",
    author: "Maya Putri",
    date: "28 April 2026",
    readTime: "6 menit",
  },
  {
    slug: "sentra-batik-di-indonesia",
    title: "Wisata Sentra Batik: Destinasi Wajib di Indonesia",
    excerpt: "Indonesia memiliki banyak sentra batik yang tersebar dari Sabang hingga Merauke. Setiap daerah memiliki ciri khas motif dan teknik yang unik. Jelajahi destinasi batik terbaik di Nusantara.",
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Wisata",
    author: "Andi Pratama",
    date: "22 April 2026",
    readTime: "9 menit",
  },
];

const categories = ["Semua", "Budaya", "Panduan", "Tips & Trik", "Fashion", "Wisata"];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      {/* Hero */}
      <section className="bg-surface-soft border-b border-hairline">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Blog Nusantara Batik
          </h1>
          <p className="mt-3 text-base text-muted max-w-[520px] mx-auto leading-relaxed">
            Cerita, panduan, dan inspirasi seputar dunia batik Indonesia. Temukan tips merawat batik hingga tren fashion terkini.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] w-full px-4 sm:px-6 py-10">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10 scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-ink text-on-primary"
                  : "border border-hairline text-muted hover:text-ink hover:border-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <Link
          href={`/blog/${dummyPosts[0].slug}`}
          className="group block rounded-xl border border-hairline overflow-hidden mb-12 transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.06),0_8px_32px_rgba(0,0,0,0.08)]"
        >
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-video md:aspect-auto overflow-hidden bg-surface-soft">
              <Image
                src={dummyPosts[0].image}
                alt={dummyPosts[0].title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
                {dummyPosts[0].category}
              </span>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs text-muted mb-3">
                <span>{dummyPosts[0].date}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {dummyPosts[0].readTime}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-ink leading-tight group-hover:text-primary transition-colors">
                {dummyPosts[0].title}
              </h2>
              <p className="mt-3 text-sm text-body-text leading-relaxed line-clamp-3">
                {dummyPosts[0].excerpt}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-ink group-hover:text-primary transition-colors">
                Baca selengkapnya
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* Post Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dummyPosts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-hairline overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
            >
              <div className="relative aspect-video overflow-hidden bg-surface-soft">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 rounded-full bg-canvas/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-medium text-ink">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted mb-2">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-body-text line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <p className="mt-3 text-xs text-muted">Oleh {post.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}