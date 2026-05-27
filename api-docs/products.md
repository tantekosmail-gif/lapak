# Products — `GET /api/products`

Mengambil daftar produk dengan paginasi, pencarian, dan pengurutan.

Sumber: `app/api/(auth)/products/route.ts` → `ProductService.getAll`.

## Auth

Tidak digerbang `proxy.ts`.

## Query parameters

| Param | Tipe | Default | Keterangan |
|---|---|---|---|
| `page` | int | `1` | Halaman (1-based) |
| `limit` | int | `10` | Jumlah item per halaman |
| `search` | string | `""` | Filter `name` (contains) |
| `sort` | string | `createdAt` | Field urut; prefix `-` = DESC. Contoh: `-name`, `price` |

> `sort` format: `field` → `ASC`, `-field` → `DESC` (lihat `modules/statics/SortParam.ts`).

## Response

### `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kopi Susu",
      "price": 20000,
      "stock": 100,
      "sold": 0,
      "imageUrl": "/uploads/abc.png",
      "status": "AKTIF",
      "slug": "kopi-susu",
      "categoryId": 3,
      "createdAt": "2026-05-27T10:00:00.000Z",
      "updatedAt": "2026-05-27T10:00:00.000Z"
    }
  ]
}
```

> `data` adalah array produk halaman tersebut (tanpa metadata total). `status` ∈ `AKTIF | HABIS | NONAKTIF`.

### Kegagalan service

Route **selalu** membalas `200` dengan `{ "success": false, "error": { "code": "PRODUCT_FIND_FAILED", ... } }`. Cek field `success`.

### `500` — exception tak tertangani (`{ "error": ... }`).

## Contoh

```bash
curl "http://localhost:3000/api/products?page=1&limit=10&search=kopi&sort=-createdAt"
```
