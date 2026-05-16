# PRD — Lapak (Toko Online)

> Dokumen ini menjadi **single source of truth** untuk pengembangan aplikasi Lapak — platform toko online untuk **1 (satu) store**.

---

## 1. Gambaran Umum

### 1.1 Produk
**Lapak** adalah aplikasi web toko online yang memungkinkan pemilik usaha (UMKM) mempublikasikan katalog produk dan menerima pesanan secara digital. Sistem ini dirancang untuk **satu store saja** — bukan marketplace multi-seller.

### 1.2 Tujuan
- Menyediakan halaman toko profesional yang bisa diakses publik tanpa login.
- Memudahkan pembeli melihat produk, memilih, dan melakukan checkout.
- Memberikan pengalaman belanja yang cepat, ringan, dan mobile-friendly.

### 1.3 Tech Stack
| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Database | PostgreSQL (Prisma ORM) |
| Auth | NextAuth.js |
| Styling | Tailwind CSS 4 |
| UI Icons | Lucide React |
| Form | React Hook Form + Zod |
| Notifikasi | Sonner (toast) |

---

## 2. User Roles

Aplikasi memiliki **2 level pengguna**:

| Role | Deskripsi |
|---|---|
| **Guest** (Pengunjung) | Pengguna yang belum login. Bisa melihat katalog, kategori, dan detail produk. |
| **Customer** (Pembeli) | Pengguna yang sudah signup/login. Memiliki semua akses Guest + bisa checkout, melihat profil, dan riwayat transaksi. |

> **Catatan:** Admin/Store owner mengelola toko melalui halaman dashboard terpisah (di luar scope PRD ini untuk fase awal).

---

## 3. Fitur per Role

### 3.1 Guest (Tanpa Login)

| # | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| G-1 | **Lihat Halaman Utama Toko** | Menampilkan banner toko, produk unggulan, dan navigasi ke kategori. | 🔴 Tinggi |
| G-2 | **Daftar Kategori Produk** | Halaman yang menampilkan semua kategori produk yang tersedia. | 🔴 Tinggi |
| G-3 | **Listing Produk per Kategori** | Grid/list produk yang bisa difilter berdasarkan kategori. | 🔴 Tinggi |
| G-4 | **Listing Semua Produk** | Halaman katalog lengkap semua produk toko. | 🔴 Tinggi |
| G-5 | **Detail Produk** | Halaman detail 1 produk: gambar, nama, harga, deskripsi, stok, tombol "Tambah ke Keranjang". | 🔴 Tinggi |
| G-6 | **Search Produk** | Pencarian produk berdasarkan nama. | 🟡 Sedang |
| G-7 | **Signup** | Formulir pendaftaran akun baru (nama, email, password). | 🔴 Tinggi |
| G-8 | **Signin** | Formulir login untuk pengguna yang sudah terdaftar. | 🔴 Tinggi |

### 3.2 Customer (Login = true)

| # | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| C-1 | **Profil Pengguna** | Melihat dan mengedit profil (nama, email, No. HP, alamat). | 🔴 Tinggi |
| C-2 | **Keranjang Belanja (Cart)** | Menambah, mengubah jumlah, dan menghapus produk dari keranjang. | 🔴 Tinggi |
| C-3 | **Checkout** | Formulir checkout: pilih alamat pengiriman, metode pembayaran, ringkasan pesanan. | 🔴 Tinggi |
| C-4 | **Buat Pesanan (Place Order)** | Konfirmasi dan submit pesanan. Menghasilkan order ID. | 🔴 Tinggi |
| C-5 | **Riwayat Transaksi** | Daftar semua pesanan yang pernah dilakukan beserta statusnya. | 🔴 Tinggi |
| C-6 | **Detail Transaksi** | Melihat detail 1 transaksi: item, harga, status pengiriman, info pembayaran. | 🔴 Tinggi |
| C-7 | **Logout** | Keluar dari akun. | 🔴 Tinggi |

---

## 4. Halaman & Routing

### 4.1 Struktur Route

```
app/
├── (auth)/
│   ├── signin/page.tsx          # Halaman login
│   └── signup/page.tsx          # Halaman registrasi
├── (marketing)/
│   └── page.tsx                 # Landing page / home toko
├── toko/
│   ├── page.tsx                 # Katalog semua produk
│   ├── [category]/page.tsx      # Produk per kategori
│   └── produk/
│       └── [slug]/page.tsx      # Detail produk
├── collections/page.tsx         # Halaman semua kategori
├── cart/page.tsx                # Keranjang belanja
├── checkout/page.tsx            # Halaman checkout
├── orders/
│   ├── page.tsx                 # Riwayat transaksi
│   └── [id]/page.tsx            # Detail transaksi
├── profile/page.tsx             # Profil pengguna
└── dashboard/                   # Admin/Store owner (fase lanjutan)
```

### 4.2 Deskripsi Halaman

#### Halaman Utama Toko `/`
- Banner hero toko (nama toko, tagline, gambar banner).
- Section produk unggulan / terbaru.
- Grid kategori produk.
- CTA signup/signin untuk guest.

#### Halaman Signin `/signin`
- Form: email, password.
- Tombol "Masuk".
- Link ke signup.

#### Halaman Signup `/signup`
- Form: nama, email, password, konfirmasi password.
- Tombol "Daftar".
- Link ke signin.

#### Halaman Semua Kategori `/collections`
- Grid/list semua kategori produk.
- Klik kategori → menuju listing produk per kategori.

#### Halaman Katalog Produk `/toko`
- Grid produk dengan filter & search.
- Pagination.
- Sort (terbaru, harga terendah, harga tertinggi).

#### Halaman Produk per Kategori `/toko/[category]`
- Sama seperti katalog, tapi terfilter berdasarkan kategori.

#### Halaman Detail Produk `/toko/produk/[slug]`
- Gambar produk (utama).
- Nama produk.
- Harga.
- Deskripsi lengkap.
- Info stok.
- Tombol "Tambah ke Keranjang" (customer) / "Login untuk membeli" (guest).
- Breadcrumb navigasi.

#### Halaman Keranjang `/cart`
- Daftar item di keranjang.
- Ubah jumlah per item.
- Hapus item.
- Ringkasan harga (subtotal).
- Tombol "Checkout".

#### Halaman Checkout `/checkout`
- Form data pemesan: nama, No. HP, alamat pengiriman.
- Ringkasan pesanan (items, subtotal, ongkir, total).
- Pilihan metode pembayaran (initially: COD / Transfer Bank).
- Tombol "Bayar" / "Place Order".

#### Halaman Riwayat Transaksi `/orders`
- Daftar semua pesanan customer.
- Kolom: Order ID, tanggal, jumlah item, total, status.
- Klik order → detail.

#### Halaman Detail Transaksi `/orders/[id]`
- Info pemesan.
- Daftar item yang dipesan.
- Breakdown harga.
- Status pesanan (Menunggu, Diproses, Dikirim, Selesai).
- Timeline/status tracking.

#### Halaman Profil `/profile`
- Info akun: nama, email, No. HP.
- Edit profil.
- Ubah password.

---

## 5. Data Model

### 5.1 Entity Relationship

```
User ──< Order ──< OrderItem >── Product ── Store
                      │
                  Category ──< Product
```

### 5.2 Models

#### User
| Field | Type | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String? | Nama lengkap |
| email | String (unique) | Email login |
| password | String | Hashed password (bcrypt) |
| phone | String? | No. HP |
| address | String? | Alamat default |
| createdAt | DateTime | Tanggal registrasi |

#### Store
| Field | Type | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| userId | String (FK) | Pemilik toko |
| name | String | Nama toko |
| slug | String (unique) | URL slug toko |
| description | String? | Deskripsi toko |
| logo | String? | URL logo |
| banner | String? | URL banner |
| phone | String? | No. HP toko (WhatsApp) |
| createdAt | DateTime | Tanggal dibuat |

#### Category
| Field | Type | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Nama kategori |
| slug | String (unique) | URL slug |
| image | String? | Gambar/ikon kategori |
| description | String? | Deskripsi kategori |

#### Product
| Field | Type | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| storeId | String (FK) | Toko pemilik produk |
| categoryId | String? (FK) | Kategori produk |
| name | String | Nama produk |
| slug | String | URL slug (unique per store) |
| description | String? | Deskripsi produk |
| image | String? | URL gambar utama |
| images | String[] | URL gambar tambahan |
| price | Int | Harga dalam Rupiah |
| stock | Int | Jumlah stok tersedia |
| weight | Int? | Berat dalam gram |
| isActive | Boolean | Status aktif/nonaktif |
| createdAt | DateTime | Tanggal dibuat |

#### Order
| Field | Type | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| userId | String (FK) | Customer yang memesan |
| storeId | String (FK) | Toko yang menerima order |
| customerName | String | Nama pemesan |
| phone | String | No. HP pemesan |
| address | String | Alamat pengiriman |
| total | Int | Total harga (Rupiah) |
| status | Enum | Status pesanan |
| paymentMethod | String? | Metode pembayaran |
| note | String? | Catatan dari pemesan |
| createdAt | DateTime | Tanggal order |

#### OrderItem
| Field | Type | Keterangan |
|---|---|---|
| id | String (cuid) | Primary key |
| orderId | String (FK) | Pesanan induk |
| productId | String (FK) | Produk yang dipesan |
| productName | String | Nama produk (snapshot) |
| productImage | String? | Gambar produk (snapshot) |
| price | Int | Harga saat dipesan |
| quantity | Int | Jumlah yang dipesan |
| subtotal | Int | price × quantity |

#### OrderStatus (Enum)
| Value | Deskripsi |
|---|---|
| PENDING | Menunggu pembayaran/konfirmasi |
| CONFIRMED | Pesanan dikonfirmasi |
| PROCESSING | Sedang diproses |
| SHIPPED | Sudah dikirim |
| DELIVERED | Sudah diterima |
| CANCELLED | Dibatalkan |

### 5.3 Cart (Client-side / Session)
Cart disimpan di **client-side** (localStorage atau state management) untuk guest, dan di-sync ke database setelah login. Struktur:

```typescript
interface CartItem {
  productId: string
  name: string
  price: number
  image: string | null
  quantity: number
}
```

---

## 6. API Endpoints

### 6.1 Auth
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Registrasi user baru | ❌ |
| POST | `/api/auth/signin` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |

### 6.2 Public (Store & Produk)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/store` | Info toko (public) | ❌ |
| GET | `/api/categories` | Daftar semua kategori | ❌ |
| GET | `/api/products` | Daftar produk (dengan pagination, filter, search) | ❌ |
| GET | `/api/products/[slug]` | Detail 1 produk | ❌ |
| GET | `/api/categories/[slug]/products` | Produk per kategori | ❌ |

### 6.3 Customer (Auth Required)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/user/profile` | Profil user | ✅ |
| PUT | `/api/user/profile` | Update profil | ✅ |
| POST | `/api/orders` | Buat pesanan baru (checkout) | ✅ |
| GET | `/api/orders` | Daftar pesanan user | ✅ |
| GET | `/api/orders/[id]` | Detail pesanan | ✅ |

---

## 7. Alur Utama (User Flow)

### 7.1 Alur Guest → Customer

```
[Guest mengunjungi toko]
        │
        ├── Lihat halaman utama ──→ Browse produk/kategori
        │
        ├── Lihat katalog produk ──→ Filter/search ──→ Lihat detail produk
        │
        ├── Klik "Beli" ──→ Diarahkan login/signup
        │
        └── Signup/Signin ──→ [Menjadi Customer]
                                    │
                                    ├── Tambah ke keranjang
                                    ├── Checkout
                                    └── Lihat riwayat transaksi
```

### 7.2 Alur Checkout

```
[Customer di halaman detail produk]
        │
        └── Klik "Tambah ke Keranjang"
                │
                └── [Halaman Keranjang]
                        │
                        ├── Review item
                        ├── Ubah jumlah
                        └── Klik "Checkout"
                                │
                                └── [Halaman Checkout]
                                        │
                                        ├── Isi data pemesan
                                        ├── Pilih metode pembayaran
                                        ├── Review ringkasan
                                        └── Klik "Place Order"
                                                │
                                                └── [Order Created]
                                                        │
                                                        ├── Redirect ke halaman detail order
                                                        └── Notifikasi sukses
```

---

## 8. UI/UX Guidelines

### 8.1 Design Principles
- **Mobile-first**: Mayoritas pengguna mengakses via mobile.
- **Clean & minimal**: Terinspirasi dari desain Airbnb — canvas putih, sedikit warna aksen.
- **Photo-led**: Produk ditampilkan dengan gambar sebagai focal point.
- **Fast loading**: Prioritaskan performa dan Core Web Vitals.

### 8.2 Warna (berdasarkan `design.md`)
| Token | Hex | Penggunaan |
|---|---|---|
| Primary (Rausch) | `#ff385c` | CTA utama, aksen brand |
| Canvas | `#ffffff` | Background halaman |
| Ink | `#222222` | Teks utama |
| Muted | `#6a6a6a` | Teks sekunder |
| Surface Soft | `#f7f7f7` | Background card, disabled state |
| Hairline | `#dddddd` | Border, divider |
| Error | `#c13515` | Pesan error |
| On Primary | `#ffffff` | Teks di atas warna primary |

### 8.3 Komponen Utama
- **Product Card**: Gambar produk (aspect-ratio 1:1), nama, harga, badge stok. Rounded corners.
- **Category Card**: Ikon/gambar kategori + nama. Rounded corners.
- **Button Primary**: Background primary, teks putih, 8px radius, min-height 48px.
- **Input Field**: Border hairline, 8px radius, label di atas, placeholder muted.

### 8.4 Responsive Breakpoints
| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | 1-2 kolom, hamburger nav |
| Tablet | 640–1024px | 2-3 kolom |
| Desktop | > 1024px | 3-4 kolom, full nav |

---

## 9. Fase Pengembangan

### Fase 1 — MVP (Bulan 1)
> Goal: Toko online bisa dipakai untuk menerima pesanan.

- [x] Setup project (Next.js, Prisma, PostgreSQL)
- [ ] Auth (signup, signin, logout)
- [ ] Halaman utama toko
- [ ] Listing produk + kategori
- [ ] Detail produk
- [ ] Keranjang belanja
- [ ] Checkout & buat pesanan
- [ ] Riwayat transaksi
- [ ] Profil pengguna

### Fase 2 — UX Improvement (Bulan 2)
- Search produk
- Optimasi mobile
- Template toko (customizable)
- Multiple gambar produk
- Toast notification

### Fase 3 — SEO (Bulan 3)
- Sitemap otomatis
- Metadata & OpenGraph
- JSON-LD schema
- Static generation untuk halaman publik

### Fase 4 — Monetisasi (Bulan 4)
- Subscription plan
- Premium template
- Custom domain

### Fase 5 — Analytics (Bulan 5)
- Visitor counter
- Klik WA tracking
- Produk populer stats

### Fase 6 — Scale (Bulan 6)
- Multi-template
- Auto social share
- Lightweight CMS

---

## 10. Non-Functional Requirements

### 10.1 Performa
- Target LCP < 2.5 detik.
- Target FID < 100ms.
- Gambar produk menggunakan Next.js `<Image>` dengan lazy loading.
- Halaman publik menggunakan ISR (Incremental Static Regeneration) jika memungkinkan.

### 10.2 Keamanan
- Password di-hash menggunakan bcrypt.
- Input divalidasi menggunakan Zod schema.
- CSRF protection bawaan Next.js.
- Rate limiting pada endpoint auth.

### 10.3 SEO
- Setiap halaman publik memiliki metadata (title, description, OG image).
- URL menggunakan slug yang human-readable.
- Sitemap.xml di-generate otomatis.

### 10.4 Aksesibilitas
- Semantic HTML.
- Alt text pada semua gambar.
- Keyboard navigable.
- Color contrast ratio min 4.5:1.

---

## 11. Constraints & Assumptions

### Constraints
- **Single store**: Aplikasi hanya untuk 1 toko. Tidak ada fitur multi-seller.
- **Pembayaran**: Fase awal menggunakan COD dan transfer bank manual. Tidak ada payment gateway.
- **Pengiriman**: Ongkir dihitung manual atau flat rate. Tidak ada integrasi kurir.

### Assumptions
- Pengguna utama adalah UMKM di Indonesia.
- Bahasa utama: Bahasa Indonesia.
- Mata uang: Rupiah (IDR).
- Pengguna mengakses mayoritas via mobile.

---

## 12. Glossary

| Istilah | Definisi |
|---|---|
| Lapak | Nama aplikasi toko online ini. |
| Guest | Pengunjung yang belum login. |
| Customer | Pengguna yang sudah mendaftar dan login. |
| Store | Toko online (hanya 1 per aplikasi). |
| Product | Barang/jasa yang dijual di toko. |
| Category | Pengelompokan produk. |
| Cart / Keranjang | Tempat menyimpan produk sebelum checkout. |
| Checkout | Proses menyelesaikan pembelian. |
| Order / Pesanan | Transaksi yang sudah dibuat customer. |
| OrderItem | Item produk di dalam satu pesanan. |

---

*Dokumen ini akan terus diperbarui seiring perkembangan fitur Lapak.*