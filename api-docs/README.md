# API Documentation — Lapak

Spesifikasi tiap endpoint API. **Satu file per path.**

## Response envelope

Semua endpoint domain mengembalikan amplop yang konsisten:

```jsonc
// sukses
{ "success": true, "data": <payload>, "message": "optional" }

// gagal
{ "success": false, "error": { "code": "STRING_CODE", "message": "...", "details": <optional> } }
```

> Catatan: beberapa endpoint lama (lihat masing-masing) **selalu** membalas HTTP `200`
> walau `success: false` — selalu cek field `success`, jangan hanya status code.

## Autentikasi & otorisasi

Penjagaan dilakukan di `proxy.ts` (per-path) plus pengecekan di route/service:

| Prefix path | Syarat |
|---|---|
| `/api/orders/*` | Login **ADMIN** (401 anonim, 403 non-admin) |
| `/api/public/orders/*` | Login (role apa pun) |
| `/api/product-categories/*` | Login |
| `/api/products/*`, `/api/upload` | Tidak digerbang proxy (lihat catatan per-endpoint) |

## Daftar endpoint

### Auth
- [`/api/auth/[...nextauth]`](./auth.md) — NextAuth (Google)

### Orders — Customer
- [`POST /api/public/orders`](./public-orders.md)
- [`PUT /api/public/orders/:id/request-cancel`](./public-orders-id-request-cancel.md)

### Orders — Admin
- [`POST /api/orders`](./orders.md)
- [`PATCH /api/orders/:id/approve`](./orders-id-approve.md)
- [`PATCH /api/orders/:id/cancel-approve`](./orders-id-cancel-approve.md)
- [`PATCH /api/orders/:id/send`](./orders-id-send.md)

### Products
- [`GET /api/products`](./products.md)
- [`GET /api/products/:id`](./products-id.md)
- [`PUT /api/products/:id/update`](./products-id-update.md)
- [`DELETE /api/products/:id/delete`](./products-id-delete.md)
- [`POST /api/products/save`](./products-save.md)
- [`POST /api/products/saveAll`](./products-save-all.md)
- [`POST /api/products/images/attach`](./product-images-attach.md)
- [`POST /api/products/images/detach`](./product-images-detach.md)

### Product Categories
- [`GET, POST /api/product-categories`](./product-categories.md)
- [`GET, PUT, DELETE /api/product-categories/:id`](./product-categories-id.md)

### Upload
- [`POST /api/upload`](./upload.md)

## Order status

`MENUNGGU → DIPROSES → DIKIRIM → SELESAI`, jalur batal `MENUNGGU_PEMBATALAN → DIBATALKAN`.
