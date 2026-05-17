"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowLeft, Share2, ChevronRight } from "lucide-react";
import { StoreHeader } from "../../components/Header";
import { Footer } from "../../components/Footer";

const blogPost = {
  slug: "sejarah-batik-indonesia-warisan-budaya",
  title: "Sejarah Batik Indonesia: Warisan Budaya yang Mendunia",
  excerpt: "Batik merupakan salah satu warisan budaya Indonesia yang telah diakui oleh UNESCO sebagai Masterpiece of Oral and Intangible Heritage of Humanity sejak 2 Oktober 2009.",
  image: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=1200",
  category: "Budaya",
  author: "Dr. Sari Dewi",
  authorAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
  date: "15 Mei 2026",
  readTime: "8 menit",
  content: `
Batik merupakan salah satu warisan budaya Indonesia yang telah diakui oleh UNESCO sebagai Masterpiece of Oral and Intangible Heritage of Humanity sejak 2 Oktober 2009. Seni menghias kain ini memiliki sejarah panjang yang mencerminkan kekayaan budaya Nusantara.

## Asal Usul Batik

Kata "batik" berasal dari bahasa Jawa "amba" yang berarti menulis dan "titik" yang merujuk pada titik-titik lilin yang dibuat pada kain. Teknik ini telah dikenal di Indonesia sejak berabad-abad silam, dengan bukti tertua ditemukan di gua-gua di daerah Sulawesi.

Penggunaan batik di Indonesia pertama kali dicatat dalam sejarah Kerajaan Mataram pada abad ke-12. Pada masa itu, batik menjadi simbol status sosial dan hanya dikenakan oleh kalangan bangsawan dan pejabat kerajaan.

## Teknik Pembuatan Batik

Ada tiga teknik utama pembuatan batik yang masih dipraktikkan hingga saat ini:

### 1. Batik Tulis
Batik tulis adalah teknik tertua dan paling tradisional. Prosesnya dilakukan secara manual menggunakan alat yang disebut **canting** untuk menggambar motif di atas kain dengan lilin cair. Satu lembar kain batik tulis bisa memakan waktu 2-3 bulan untuk diselesaikan, tergantung pada kompleksitas motifnya.

### 2. Batik Cap
Batik cap mulai berkembang pada awal abad ke-20 sebagai respons terhadap meningkatnya permintaan batik. Prosesnya menggunakan cap tembaga yang sudah diukir dengan motif tertentu, kemudian dicelupkan ke lilin panas dan ditekan ke kain. Teknik ini jauh lebih cepat dibandingkan batik tulis.

### 3. Batik Printing
Batik printing adalah teknik modern yang menggunakan mesin cetak untuk menghasilkan motif batik pada kain. Meskipun lebih efisien dan terjangkau, batik printing tidak memiliki nilai seni yang sama dengan batik tulis maupun batik cap.

## Motif Batik dan Maknanya

Setiap motif batik memiliki filosofi mendalam yang mencerminkan kehidupan masyarakat Indonesia:

- **Motif Parang** — Melambangkan keberanian dan kekuatan. Dahulu hanya boleh dikenakan oleh prajurit dan bangsawan tinggi.
- **Motif Kawung** — Melambangkan harapan dan keadilan. Terinspirasi dari buah kawung (kolang-kaling).
- **Motif Mega Mendung** — Berasal dari Cirebon, melambangkan kesabaran dan ketenangan.
- **Motif Sido Mukti** — Sering digunakan dalam upacara pernikahan, melambangkan kebahagiaan dan kemakmuran.

## Batik di Era Modern

Di era modern, batik telah mengalami transformasi yang luar biasa. Desainer-desainer muda Indonesia berhasil memadukan motif batik klasik dengan gaya kontemporer, menjadikannya relevan untuk berbagai kesempatan.

Fashion show batik internasional, seperti **Indonesia Fashion Week** dan **Jakarta Fashion Week**, telah memperkenalkan batik ke panggung dunia. Banyak selebritas internasional yang turut mempopulerkan batik, seperti Jessica Alba dan Gwyneth Paltrow yang pernah terlihat mengenakan busana bermotif batik.

## Melestarikan Warisan Budaya

Sebagai generasi penerus, kita memiliki tanggung jawab untuk melestarikan warisan budaya batik. Beberapa cara yang bisa dilakukan:

1. **Mengenakan batik** dalam kehidupan sehari-hari
2. **Mendukung pengrajin batik lokal** dengan membeli produk mereka
3. **Mempelajari teknik batik** dan mewariskannya ke generasi berikutnya
4. **Mengedukasi masyarakat** tentang nilai sejarah dan filosofi batik

Batik bukan sekadar kain bermotif — ia adalah cerminan identitas bangsa Indonesia yang kaya akan budaya dan tradisi.
  `,
};

const relatedPosts = [
  {
    slug: "motif-batik-dan-filosofinya",
    title: "Mengenal Motif Batik dan Filosofi di Baliknya",
    image: "https://images.pexels.com/photos/6044268/pexels-photo-6044268.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Budaya",
    date: "3 Mei 2026",
    readTime: "7 menit",
  },
  {
    slug: "memilih-batik-berkualitas-tips-dan-trik",
    title: "Tips Memilih Batik Berkualitas: Panduan Lengkap untuk Pemula",
    image: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Panduan",
    date: "12 Mei 2026",
    readTime: "6 menit",
  },
  {
    slug: "perawatan-batik-agar-tahan-lama",
    title: "Cara Merawat Batik Agar Tetap Indah dan Tahan Lama",
    image: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Tips & Trik",
    date: "8 Mei 2026",
    readTime: "5 menit",
  },
];

function renderMarkdown(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    } else if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-lg font-semibold text-ink mt-8 mb-3">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-xl font-bold text-ink mt-10 mb-4">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith("- **")) {
      const match = trimmed.match(/^- \*\*(.+?)\*\*\s*—?\s*(.*)$/);
      if (match) {
        elements.push(
          <li key={key++} className="text-sm text-body-text leading-relaxed ml-4 list-disc">
            <strong className="text-ink">{match[1]}</strong>{match[2] ? ` — ${match[2]}` : ""}
          </li>
        );
      }
    } else if (/^\d+\./.test(trimmed)) {
      const match = trimmed.match(/^\d+\.\s*\*\*(.+?)\*\*\s*(.*)$/);
      if (match) {
        elements.push(
          <li key={key++} className="text-sm text-body-text leading-relaxed ml-4 list-decimal">
            <strong className="text-ink">{match[1]}</strong>{match[2] ? ` ${match[2]}` : ""}
          </li>
        );
      }
    } else {
      // Parse inline bold
      const parts = trimmed.split(/\*\*(.+?)\*\*/g);
      elements.push(
        <p key={key++} className="text-sm text-body-text leading-relaxed mb-4">
          {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-ink font-semibold">{part}</strong> : part)}
        </p>
      );
    }
  }

  return elements;
}

export default function BlogDetailPage() {
  const post = blogPost;

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <StoreHeader />

      <article className="mx-auto max-w-[780px] w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-ink transition-colors">Beranda</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/blog" className="hover:text-ink transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink font-medium truncate">{post.category}</span>
        </nav>

        {/* Category */}
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-5 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-surface-soft">
              <img src={post.authorAvatar} alt={post.author} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{post.author}</p>
              <p className="text-xs text-muted">{post.date}</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-soft mb-10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 780px) 100vw, 780px"
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose-custom">
          {renderMarkdown(post.content)}
        </div>

        {/* Share */}
        <div className="mt-10 pt-8 border-t border-hairline">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Bagikan artikel ini</p>
            <div className="flex gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline hover:bg-surface-soft transition-colors" aria-label="Share">
                <Share2 className="h-4 w-4 text-muted" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline hover:bg-surface-soft transition-colors text-xs font-bold text-muted" aria-label="Facebook">
                f
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline hover:bg-surface-soft transition-colors text-xs font-bold text-muted" aria-label="Twitter">
                𝕏
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Blog
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 py-12">
          <h2 className="text-xl font-semibold text-ink mb-8">Artikel Lainnya</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group rounded-xl border border-hairline overflow-hidden transition-all hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
              >
                <div className="relative aspect-video overflow-hidden bg-surface-soft">
                  <Image
                    src={rp.image}
                    alt={rp.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-canvas/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-medium text-ink">
                    {rp.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted mb-2">
                    <span>{rp.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rp.readTime}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {rp.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}