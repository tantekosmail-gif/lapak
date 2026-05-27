# Create product + category — `POST /api/products/saveAll`

Membuat **kategori baru dan produk baru** sekaligus dalam satu transaksi. Produk otomatis terhubung ke kategori yang baru dibuat.

Sumber: `app/api/(auth)/products/saveAll/route.ts` → `ProductService.saveAll`.

## Auth

Tidak digerbang `proxy.ts`.

## Request body

`Content-Type: application/json`

```json
{
  "category": { "name": "Minuman", "image": "minuman.jpg" },
  "product": {
    "name": "Kopi Susu",
    "price": 20000,
    "stock": 100,
    "status": "AKTIF",
    "slug": "kopi-susu"
  }
}
```

| Objek | Field | Wajib | Aturan |
|---|---|---|---|
| `category` | `name` | ✅ | min 1 |
| `category` | `image` | – | URL/string |
| `product` | `name` | ✅ | min 1 |
| `product` | `price` | ✅ | int ≥ 0 |
| `product` | `stock`, `sold` | – | int ≥ 0 |
| `product` | `imageUrl` | – | URL valid |
| `product` | `status` | – | `AKTIF` \| `HABIS` \| `NONAKTIF` |
| `product` | `slug` | – | di-generate dari `name` bila kosong |

> Field `categoryId` pada `product` **tidak diterima** di sini (di-omit) — kategori dibuat dari objek `category`.

## Response

### `200 OK`

```json
{ "success": true, "data": { "id": 11, "name": "Kopi Susu", "categoryId": 5, "...": "..." } }
```

`data` adalah produk yang dibuat (terhubung ke kategori baru).

### `400 Bad Request`

| Code | Penyebab |
|---|---|
| `PRODUCT_VALIDATION_FAILED` | Payload tidak valid |
| `PRODUCT_SAVE_ALL_FAILED` | Kegagalan transaksi |

### `500` — exception tak tertangani.

## Contoh

```bash
curl -X POST http://localhost:3000/api/products/saveAll \
  -H "Content-Type: application/json" \
  -d '{"category":{"name":"Minuman"},"product":{"name":"Kopi Susu","price":20000}}'
```
